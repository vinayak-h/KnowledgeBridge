import {
  ArrowRight,
  BookOpen,
  LayoutDashboard,
  Plus,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({
  isOverviewActive,
  isCreateActive,
  onShowOverview,
  onCreate,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <BookOpen size={22} />
        </div>
        <div>
          <strong>KnowledgeBridge</strong>
          <span>Work continuity hub</span>
        </div>
      </div>
      <div className="workspace-label">WORKSPACE</div>
      <button
        className={`nav-item ${isOverviewActive ? 'selected' : ''}`}
        onClick={onShowOverview}
      >
        <LayoutDashboard size={18} /> Overview
      </button>
      <button
        className={`nav-item ${isCreateActive ? 'selected' : ''}`}
        onClick={onCreate}
      >
        <Plus size={18} /> Create handover
      </button>
      <div className="sidebar-divider" />
      <div className="sidebar-tip">
        <div className="tip-icon">
          <Sparkles size={17} />
        </div>
        <strong>Keep work moving</strong>
        <p>
          Capture the context your teammates need to pick up where you left off.
        </p>
        <button onClick={onCreate}>
          Start a handover <ArrowRight size={14} />
        </button>
      </div>
      <div className="sidebar-footer">
        <span className="online-dot" /> Local workspace{' '}
        <small>KnowledgeBridge · POC</small>
      </div>
    </aside>
  );
}
