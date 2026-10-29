import { Activity, CheckCircle2, FolderKanban, ListTodo } from 'lucide-react';

function Stat({ icon, label, value, foot, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div className="stat-body">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{foot}</small>
      </div>
      <div className={`stat-accent ${tone}`} />
    </div>
  );
}

export default function StatGrid({ stats }) {
  return (
    <section className="stat-grid">
      <Stat
        icon={<FolderKanban size={20} />}
        label="Total handovers"
        value={stats.total}
        foot="Across your workspace"
        tone="violet"
      />
      <Stat
        icon={<Activity size={20} />}
        label="In progress"
        value={stats.active}
        foot="Drafts and active handovers"
        tone="blue"
      />
      <Stat
        icon={<ListTodo size={20} />}
        label="Tracked work items"
        value={stats.totalWork}
        foot={`${stats.completedWork} marked completed`}
        tone="amber"
      />
      <Stat
        icon={<CheckCircle2 size={20} />}
        label="Shared"
        value={stats.shared}
        foot="Ready for the next owner"
        tone="green"
      />
    </section>
  );
}
