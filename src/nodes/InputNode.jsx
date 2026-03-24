import { Handle, Position } from "@xyflow/react";

export default function InputNode({ data }) {
  return (
    <div style={styles.wrapper}>
      {/* Label strip */}
      <div style={styles.labelRow}>
        <span style={styles.dot} />
        <span style={styles.label}>Prompt Input</span>
        <span style={styles.badge}>Node 01</span>
      </div>

      <p style={styles.sub}>Ask anything to the AI</p>

      <textarea
        style={styles.textarea}
        value={data.prompt}
        onChange={(e) => data.onPromptChange(e.target.value)}
        placeholder="e.g. What is the capital of France?"
        rows={5}
      />

      <div style={styles.footer}>
        <span style={styles.chars}>{data.prompt?.length || 0} chars</span>
        <span style={styles.hint}>→ Connect to AI node</span>
      </div>

      <Handle type="source" position={Position.Right} style={styles.handle} />
    </div>
  );
}

const styles = {
  wrapper: {
    background: "#ffffff",
    border: "1.5px solid #e8e4de",
    borderRadius: "20px",
    padding: "22px",
    width: "300px",
    boxShadow: "0 4px 30px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    transition: "box-shadow 0.25s ease",
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
    background: "#c9a96e",
    display: "inline-block",
    flexShrink: 0,
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
  textarea: {
    width: "100%",
    background: "#fafaf9",
    border: "1.5px solid #e8e4de",
    borderRadius: "12px",
    color: "#1a1714",
    fontSize: "13.5px",
    padding: "12px 14px",
    resize: "none",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.65,
    transition: "border-color 0.2s ease",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    alignItems: "center",
  },
  chars: {
    fontSize: "11px",
    color: "#c9a96e",
    fontFamily: "'DM Mono', monospace",
  },
  hint: {
    fontSize: "11px",
    color: "#c0bbb5",
    letterSpacing: "0.03em",
  },
  handle: {
    background: "#c9a96e",
    width: "13px",
    height: "13px",
    border: "2.5px solid #ffffff",
    boxShadow: "0 0 0 1.5px #c9a96e",
    right: "-7px",
  },
};
