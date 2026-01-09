import "./Button.css";

export default function Button({ className = "", icon = null, onClick, children, subAction, inline, primary }) {
  return (
    <div className={`button ${icon ? "icon" : ""} ${inline ? "inline" : ""} ${primary ? "primary" : ""} ` + className}>
      <button onClick={onClick}>{icon}{children}</button>
      {subAction}
    </div>
  );
}
