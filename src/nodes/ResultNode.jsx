import { Handle, Position } from "@xyflow/react";

export default function ResultNode({ data }) {
  const isEmpty = !data.response;
  const isLoading = data.loading;

  return (
    <div style={styles.wrapper}>
      <Handle type="target" position={Position.Left} style={styles.handle} />

      <div style={styles.labelRow}>
        <span style={{ ...styles.dot, background: isLoading ? "#c9a96e" : isEmpty ? "#d4cfc9" : "#3d6b4f" }} />
        <span style={styles.label}>AI Response</span>
        <span style={styles.badge}>Node 02</span>
      </div>

      <p style={styles.sub}>
        {isLoading ? "Generating response…" : isEmpty ? "Awaiting prompt" : "Response ready"}
      </p>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Body */}
      <div style={{
        ...styles.body,
        color: isEmpty && !isLoading ? "#c0bbb5" : "#1a1714",
        fontStyle: isEmpty && !isLoading ? "italic" : "normal",
      }}>
        {isLoading ? (
          <div style={styles.loadingWrapper}>
            <div style={styles.spinnerRow}>
              {[0,1,2].map(i => (
                <div key={i} style={{ ...styles.pulse, animationDelay: `${i * 0.18}s` }} />
              ))}
            </div>
            <span style={styles.loadingText}>Thinking…</span>
          </div>
        ) : isEmpty ? (
          "Your AI response will appear here once you click Run Flow."
        ) : (
          data.response
        )}
      </div>

      {/* Save button */}
      {!isEmpty && !isLoading && (
        <>
          <div style={styles.divider} />
          <button style={styles.saveBtn} onClick={data.onSave}
            onMouseEnter={e => e.target.style.background = "#f7f4ef"}
            onMouseLeave={e => e.target.style.background = "#fafaf9"}
          >
            <span>↓</span>
            <span>Save to Database</span>
          </button>
        </>
      )}
    </div>
  );
}

const keyframes = `
@keyframes pulse-dot {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}`;
if (typeof document !== 'undefined') {
  const s = document.createElement('style');
  s.textContent = keyframes;
  document.head.appendChild(s);
}

const styles = {
  wrapper: {
    background: "#ffffff",
    border: "1.5px solid #e8e4de",
    borderRadius: "20px",
    padding: "22px",
    width: "340px",
    boxShadow: "0 4px 30px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
    fontFamily: "'DM Sans', sans-serif",
  },
  labelRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    display: "inline-block",
    flexShrink: 0,
    transition: "background 0.4s ease",
  },
  label: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "15px",
    fontWeight: 600,
    color: "#1a1714",
    flex: 1,
    letterSpacing: "-0.01em",
  },
  badge: {
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    color: "#a09b94",
    background: "#f7f4ef",
    padding: "3px 8px",
    borderRadius: "99px",
    border: "1px solid #e8e4de",
    textTransform: "uppercase",
  },
  sub: {
    fontSize: "12px",
    color: "#a09b94",
    marginBottom: "14px",
    fontWeight: 400,
  },
  divider: {
    height: "1px",
    background: "linear-gradient(to right, transparent, #e8e4de 20%, #e8e4de 80%, transparent)",
    margin: "14px 0",
  },
  body: {
    fontSize: "13.5px",
    lineHeight: 1.72,
    minHeight: "90px",
    maxHeight: "220px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  loadingWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 0",
    gap: "12px",
  },
  spinnerRow: { display: "flex", gap: "7px" },
  pulse: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    background: "#c9a96e",
    animation: "pulse-dot 1.2s ease-in-out infinite",
  },
  loadingText: {
    fontSize: "12px",
    color: "#a09b94",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 500,
  },
  saveBtn: {
    width: "100%",
    background: "#fafaf9",
    border: "1.5px solid #e8e4de",
    borderRadius: "10px",
    color: "#3d6b4f",
    padding: "10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background 0.2s",
    letterSpacing: "0.01em",
  },
  handle: {
    background: "#3d6b4f",
    width: "13px",
    height: "13px",
    border: "2.5px solid #ffffff",
    boxShadow: "0 0 0 1.5px #3d6b4f",
    left: "-7px",
  },
};
