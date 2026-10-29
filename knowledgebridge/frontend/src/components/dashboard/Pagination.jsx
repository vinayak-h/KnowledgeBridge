import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';

export default function Pagination({ list }) {
  const { pageData, currentPage, pageSize, loadPage, handlePageSizeChange } =
    list;

  return (
    <div
      className="pagination-controls"
      style={{
        marginTop: '24px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          className="btn btn-secondary"
          onClick={() => loadPage(0)}
          disabled={pageData?.first}
        >
          <ArrowLeft size={14} /> First
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => loadPage(currentPage - 1)}
          disabled={pageData?.first}
        >
          <ChevronDown size={14} style={{ transform: 'rotate(90deg)' }} />{' '}
          Previous
        </button>
        <span
          style={{ padding: '8px 12px', fontSize: '14px', fontWeight: '500' }}
        >
          Page {pageData?.page + 1} of {pageData?.totalPages}
        </span>
        <button
          className="btn btn-secondary"
          onClick={() => loadPage(currentPage + 1)}
          disabled={pageData?.last}
        >
          <ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} /> Next
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => loadPage(pageData?.totalPages - 1)}
          disabled={pageData?.last}
        >
          Last <ArrowRight size={14} />
        </button>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <label style={{ fontSize: '14px', fontWeight: '500' }}>Per page:</label>
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          style={{
            padding: '6px 8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}
