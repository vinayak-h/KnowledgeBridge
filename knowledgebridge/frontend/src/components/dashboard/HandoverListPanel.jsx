import { Activity, FolderKanban, LoaderCircle, Plus } from 'lucide-react';
import FilterBar from './FilterBar.jsx';
import HandoverCard from './HandoverCard.jsx';
import Pagination from './Pagination.jsx';

export default function HandoverListPanel({
  list,
  onCreate,
  onOpen,
  onDelete,
}) {
  const { pageData, loading, currentPage, loadPage, clearFilters } = list;
  const hasContent = Boolean(pageData?.content?.length);

  return (
    <section className="list-panel" id="handover-list">
      <div className="list-heading">
        <div>
          <div className="section-kicker">YOUR WORKSPACE</div>
          <h2>
            Recent handovers{' '}
            <span className="count-badge">{pageData?.totalElements || 0}</span>
          </h2>
          <p>Open a handover to review or update its details.</p>
        </div>
        <button className="btn btn-primary" onClick={onCreate}>
          <Plus size={17} /> New handover
        </button>
      </div>
      <FilterBar list={list} />
      {loading ? (
        <div className="loading-state">
          <LoaderCircle className="spin" size={24} />
          <span>Loading your workspace…</span>
        </div>
      ) : !hasContent ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FolderKanban size={27} />
          </div>
          <h3>
            {pageData?.totalElements
              ? 'No matching handovers'
              : 'Your workspace starts here'}
          </h3>
          <p>
            {pageData?.totalElements
              ? 'Try changing your search or filters.'
              : 'Create your first handover to capture the context your team needs.'}
          </p>
          {pageData?.totalElements ? (
            <button className="btn btn-secondary" onClick={clearFilters}>
              Clear filters
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onCreate}>
              <Plus size={16} /> Create your first handover
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="handover-grid">
            {pageData.content.map((h) => (
              <HandoverCard
                key={h.id}
                item={h}
                onOpen={() => onOpen(h.id)}
                onDelete={() => onDelete(h.id)}
              />
            ))}
          </div>
          <Pagination list={list} />
        </>
      )}
      <div className="list-foot">
        <span>
          <span className="online-dot" /> Your data is stored in your local
          MySQL database
        </span>
        <button onClick={() => loadPage(currentPage)}>
          <Activity size={14} /> Refresh
        </button>
      </div>
    </section>
  );
}
