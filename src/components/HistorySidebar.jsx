import { useState, useEffect } from "react";

export default function HistorySidebar({ visible, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    fetch("/api/history")
      .then(r => r.json())
      .then(d => Array.isArray(d) && setHistory(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [visible]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          ...styles.backdrop,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "all" : "none",
        }}
      />
      {/* Panel */}
      <div style={{
        ...styles.panel,
        transform: visible ? "translateX(0)" : "translateX(100%)",
      }}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.headerLabel}>Database</p>
            <h2 style={styles.headerTitle}>Saved History</h2>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.divider} />

        {/* Content */}
        <div style={styles.content}>
          {loading && (
            <div style={styles.center}>
              <div style={styles.spinner} />
              <p style={styles.msgText}>Loading records…</p>
            </div>
          )}
          {!loading && history.length === 0 && (
            <div style={styles.center}>
              <div style={styles.emptyIcon}>◎</div>
              <p style={styles.msgText}>No saved records yet.</p>
              <p style={styles.msgSub}>Run a prompt and click "Save to Database"</p>
            </div>
          )}
          {!loading && history.map((item, idx) => (
            <div key={item._id} style={styles.card}>
              <div style={styles.cardIndex}>#{String(idx + 1).padStart(2, "0")}</div>
              <div style={styles.cardSection}>
                <span style={styles.cardLabel}>Prompt</span>
                <p style={styles.cardText}>{item.prompt}</p>
              </div>
              <div style={styles.cardDivider} />
              <div style={styles.cardSection}>
                <span style={styles.cardLabel}>Response</span>
                <p style={{ ...styles.cardText, color: "#3d6b4f" }}>{item.response}</p>
              </div>
              <p style={styles.cardDate}>
                {new Date(item.createdAt).toLocaleString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerText}>{history.length} records stored</span>
        </div>
      </div>
    </>
  );
}

const styles = {
  backdrop: {
    position: "fixed", inset: 0,
    background: "rgba(26,23,20,0.25)",
    backdropFilter: "blur(3px)",
    zIndex: 99,
    transition: "opacity 0.3s ease",
  },
  panel: {
    position: "fixed", top: 0, right: 0, bottom: 0,
    width: "400px",
    background: "#ffffff",
    borderLeft: "1px solid #e8e4de",
    zIndex: 100,
    display: "flex", flexDirection: "column",
    boxShadow: "-8px 0 40px rgba(0,0,0,0.10)",
    transition: "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
    fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    padding: "28px 28px 20px",
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
  },
  headerLabel: {
    fontSize: "11px", fontWeight: 600, letterSpacing: "0.10em",
    color: "#c9a96e", textTransform: "uppercase", marginBottom: "4px",
  },
  headerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "22px", fontWeight: 600, color: "#1a1714", letterSpacing: "-0.02em",
  },
  closeBtn: {
    background: "#fafaf9", border: "1px solid #e8e4de",
    borderRadius: "8px", color: "#6b6560",
    cursor: "pointer", fontSize: "14px",
    width: "34px", height: "34px",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.2s",
  },
  divider: {
    height: "1px",
    background: "linear-gradient(to right, transparent, #e8e4de 20%, #e8e4de 80%, transparent)",
    margin: "0 20px",
  },
  content: { flex: 1, overflowY: "auto", padding: "20px 28px" },
  center: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "60px 0", gap: "10px",
  },
  spinner: {
    width: "28px", height: "28px",
    border: "2px solid #f0ede8",
    borderTopColor: "#c9a96e",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  emptyIcon: { fontSize: "32px", color: "#d4cfc9", marginBottom: "4px" },
  msgText: { fontSize: "14px", color: "#6b6560", fontWeight: 500 },
  msgSub: { fontSize: "12px", color: "#a09b94", textAlign: "center" },
  card: {
    background: "#fafaf9",
    border: "1px solid #f0ede8",
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "12px",
    position: "relative",
  },
  cardIndex: {
    position: "absolute", top: "14px", right: "14px",
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px", color: "#c9a96e", fontWeight: 500,
  },
  cardSection: { marginBottom: "6px" },
  cardLabel: {
    fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "#a09b94",
  },
  cardText: {
    fontSize: "13px", color: "#1a1714",
    lineHeight: 1.6, marginTop: "3px",
    wordBreak: "break-word",
  },
  cardDivider: {
    height: "1px", background: "#f0ede8", margin: "10px 0",
  },
  cardDate: {
    fontSize: "11px", color: "#c0bbb5",
    marginTop: "10px", textAlign: "right",
    fontFamily: "'DM Mono', monospace",
  },
  footer: {
    padding: "16px 28px",
    borderTop: "1px solid #f0ede8",
    display: "flex", justifyContent: "center",
  },
  footerText: {
    fontSize: "12px", color: "#a09b94",
    fontFamily: "'DM Mono', monospace",
  },
};

// inject spinner keyframe
if (typeof document !== 'undefined') {
  const s = document.createElement('style');
  s.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(s);
}
