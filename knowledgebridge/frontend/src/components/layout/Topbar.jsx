export default function Topbar({ title }) {
  return (
    <header className="topbar">
      <div className="breadcrumbs">
        Workspace <span>/</span> <strong>{title}</strong>
      </div>
      <div className="topbar-right">
        <span className="local-pill">
          <span className="online-dot" /> Local environment
        </span>
        <div className="avatar">KB</div>
      </div>
    </header>
  );
}
