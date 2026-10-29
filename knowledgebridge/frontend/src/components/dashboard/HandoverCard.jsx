import {
  ArrowRight,
  CalendarDays,
  FileText,
  ListTodo,
  Trash2,
  Users,
} from 'lucide-react';
import { nice } from '../../utils/formatters.js';

export default function HandoverCard({ item, onOpen, onDelete }) {
  const count = item.workItems?.length || 0;
  const completed = (item.workItems || []).filter(
    (w) => w.status === 'COMPLETED'
  ).length;

  return (
    <article className="handover-card">
      <div className="handover-card-top">
        <div className="handover-type-icon">
          <FileText size={19} />
        </div>
        <span
          className={`status-badge ${String(item.status || 'DRAFT').toLowerCase()}`}
        >
          <i />
          {nice(item.status || 'DRAFT')}
        </span>
        <button
          className="icon-button card-menu"
          title="Delete handover"
          onClick={onDelete}
        >
          <Trash2 size={15} />
        </button>
      </div>
      <button className="card-title-button" onClick={onOpen}>
        {item.title || 'Untitled handover'} <ArrowRight size={16} />
      </button>
      <div className="card-type">{nice(item.type || 'PROJECT_TRANSITION')}</div>
      <p className="card-summary">
        {item.summary ||
          'No overview added yet. Open this handover to capture the current situation and next steps.'}
      </p>
      <div className="card-people">
        <div className="person-chip">
          <span className="person-avatar">
            {(item.creator || '?').trim().slice(0, 1).toUpperCase()}
          </span>
          <div>
            <small>CREATED BY</small>
            <b>{item.creator || 'Not set'}</b>
          </div>
        </div>
        <div className="person-chip recipient-chip">
          <span className="person-avatar recipient-avatar">
            <Users size={14} />
          </span>
          <div>
            <small>HANDOVER TO</small>
            <b>{item.recipient || 'Unassigned'}</b>
          </div>
        </div>
      </div>
      <div className="card-progress">
        <div className="progress-label">
          <span>
            <ListTodo size={14} /> {count} work item{count === 1 ? '' : 's'}
          </span>
          <b>{count ? Math.round((completed / count) * 100) : 0}% complete</b>
        </div>
        <div className="progress-track">
          <div style={{ width: `${count ? (completed / count) * 100 : 0}%` }} />
        </div>
      </div>
      <div className="card-footer">
        <span>
          <CalendarDays size={14} />
          {item.updatedAt
            ? `Updated ${new Date(item.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
            : 'Recently updated'}
        </span>
        <button onClick={onOpen}>
          Open handover <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
}
