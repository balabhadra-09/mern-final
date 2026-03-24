import { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import InputNode from "./nodes/InputNode.jsx";
import ResultNode from "./nodes/ResultNode.jsx";
import HistorySidebar from "./components/HistorySidebar.jsx";

const nodeTypes = { inputNode: InputNode, resultNode: ResultNode };

const INITIAL_EDGES = [{
  id: "e1-2",
  source: "node-input",
  target: "node-result",
  animated: true,
  style: { stroke: "#c9a96e", strokeWidth: 2 },
}];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const toastTimer = useRef(null);

  const showToast = (msg, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const nodes = [
    {
      id: "node-input",
      type: "inputNode",
      position: { x: 100, y: 160 },
      data: { prompt, onPromptChange: setPrompt },
      draggable: true,
    },
    {
      id: "node-result",
      type: "resultNode",
      position: { x: 540, y: 120 },
      data: { response, loading, onSave: handleSave },
      draggable: true,
    },
  ];

  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)), [setEdges]
  );

  async function handleRun() {
    if (!prompt.trim()) { showToast("Please enter a prompt first.", "error"); return; }
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      setResponse(data.answer);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!prompt.trim() || !response) return;
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, response }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      showToast("Saved to MongoDB successfully.", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <div style={styles.root}>
      {/* ── NAVBAR ── */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.logoMark}>◈</div>
          <div>
            <span style={styles.logoText}>MERN AI Flow</span>
            <span style={styles.logoDivider}>/</span>
            <span style={styles.logoSub}>Prompt Studio</span>
          </div>
        </div>
        <div style={styles.navCenter}>
          <div style={styles.statusDot(loading)} />
          <span style={styles.statusText}>
            {loading ? "Running flow…" : response ? "Flow complete" : "Ready"}
          </span>
        </div>
        <div style={styles.navRight}>
          <button style={styles.btnOutline}
            onClick={() => setHistoryOpen(true)}
            onMouseEnter={e => e.currentTarget.style.background = "#f7f4ef"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            History
          </button>
          <button
            style={{
              ...styles.btnPrimary,
              opacity: loading ? 0.65 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={handleRun}
            disabled={loading}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#1a1714"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#2d2926"; }}
          >
            {loading ? (
              <><span style={styles.navSpinner} /> Running…</>
            ) : (
              <><span style={{ fontSize: "15px" }}>▶</span> Run Flow</>
            )}
          </button>
        </div>
      </nav>

      {/* ── BREADCRUMB / INFO BAR ── */}
      <div style={styles.infoBar}>
        <span style={styles.infoItem}>
          <span style={styles.infoLabel}>Nodes</span>
          <span style={styles.infoValue}>2</span>
        </span>
        <span style={styles.infoDot} />
        <span style={styles.infoItem}>
          <span style={styles.infoLabel}>Edges</span>
          <span style={styles.infoValue}>{edges.length}</span>
        </span>
        <span style={styles.infoDot} />
        <span style={styles.infoItem}>
          <span style={styles.infoLabel}>Model</span>
          <span style={styles.infoValue}>Gemini 2.0 Flash</span>
        </span>
        <span style={styles.infoDot} />
        <span style={styles.infoItem}>
          <span style={styles.infoLabel}>Status</span>
          <span style={{ ...styles.infoValue, color: response ? "#3d6b4f" : "#a09b94" }}>
            {response ? "● Complete" : "● Idle"}
          </span>
        </span>
      </div>

      {/* ── CANVAS ── */}
      <div style={styles.canvas}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.35 }}
            minZoom={0.4}
            maxZoom={1.6}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant="dots" color="#d4cfc9" gap={22} size={1.2} />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={n => n.type === "inputNode" ? "#c9a96e" : "#3d6b4f"}
              maskColor="rgba(247,244,239,0.7)"
              style={{ borderRadius: "14px", overflow: "hidden" }}
            />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          ...styles.toast,
          background: toast.type === "error" ? "#fff5f5" : "#f0faf4",
          borderColor: toast.type === "error" ? "#e8c4c4" : "#a8d5b8",
          color: toast.type === "error" ? "#8b3a3a" : "#2d5a3d",
        }}>
          <span style={{ fontSize: "16px" }}>{toast.type === "error" ? "⚠" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      {/* ── HISTORY SIDEBAR ── */}
      <HistorySidebar visible={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
}

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#fafaf9",
    fontFamily: "'DM Sans', sans-serif",
  },
  // ── Navbar
  nav: {
    height: "62px",
    display: "flex", alignItems: "center",
    padding: "0 24px",
    background: "#ffffff",
    borderBottom: "1px solid #ece9e3",
    flexShrink: 0,
    gap: "20px",
  },
  navLeft: { display: "flex", alignItems: "center", gap: "12px", flex: 1 },
  logoMark: {
    fontSize: "22px", color: "#c9a96e",
    lineHeight: 1,
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "17px", fontWeight: 600, color: "#1a1714", letterSpacing: "-0.02em",
  },
  logoDivider: { margin: "0 8px", color: "#d4cfc9", fontSize: "16px" },
  logoSub: { fontSize: "13px", color: "#a09b94", fontWeight: 400 },
  navCenter: {
    display: "flex", alignItems: "center", gap: "7px",
    position: "absolute", left: "50%", transform: "translateX(-50%)",
  },
  statusDot: (loading) => ({
    width: "7px", height: "7px", borderRadius: "50%",
    background: loading ? "#c9a96e" : "#3d6b4f",
    animation: loading ? "pulse-dot 1s ease infinite" : "none",
    flexShrink: 0,
  }),
  statusText: { fontSize: "12.5px", color: "#6b6560", letterSpacing: "0.01em" },
  navRight: { display: "flex", gap: "10px", alignItems: "center", marginLeft: "auto" },
  btnOutline: {
    padding: "8px 18px",
    background: "transparent",
    border: "1.5px solid #e8e4de",
    borderRadius: "10px",
    color: "#6b6560",
    fontSize: "13.5px", fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.2s",
  },
  btnPrimary: {
    padding: "8px 20px",
    background: "#2d2926",
    border: "none",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "13.5px", fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    display: "flex", alignItems: "center", gap: "8px",
    transition: "background 0.2s",
    letterSpacing: "0.01em",
  },
  navSpinner: {
    display: "inline-block",
    width: "13px", height: "13px",
    border: "2px solid rgba(255,255,255,0.25)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  // ── Info bar
  infoBar: {
    height: "38px",
    display: "flex", alignItems: "center",
    padding: "0 26px",
    background: "#fafaf9",
    borderBottom: "1px solid #f0ede8",
    flexShrink: 0,
    gap: "14px",
  },
  infoItem: { display: "flex", alignItems: "center", gap: "6px" },
  infoLabel: { fontSize: "11px", color: "#a09b94", fontWeight: 400, letterSpacing: "0.02em" },
  infoValue: {
    fontSize: "11.5px", color: "#1a1714", fontWeight: 600,
    fontFamily: "'DM Mono', monospace",
  },
  infoDot: {
    width: "3px", height: "3px", borderRadius: "50%",
    background: "#d4cfc9", display: "inline-block",
  },
  // ── Canvas
  canvas: { flex: 1, position: "relative" },
  // ── Toast
  toast: {
    position: "fixed",
    bottom: "28px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "13px 22px",
    borderRadius: "12px",
    border: "1.5px solid",
    fontSize: "13.5px",
    fontWeight: 500,
    zIndex: 999,
    boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: "260px",
    justifyContent: "center",
    letterSpacing: "0.01em",
  },
};

// global keyframes
if (typeof document !== "undefined") {
  const s = document.createElement("style");
  s.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
  `;
  document.head.appendChild(s);
}
