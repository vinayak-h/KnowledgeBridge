import { Download } from 'lucide-react';

export default function ExportCard({ id, onExport }) {
  return (
    <section className="side-card">
      <div className="side-card-heading">
        <div className="side-icon blue-icon">
          <Download size={18} />
        </div>
        <div>
          <h3>Export handover</h3>
          <p>Take the context with you.</p>
        </div>
      </div>
      <button
        className="btn btn-primary btn-full"
        onClick={onExport}
        disabled={!id}
      >
        <Download size={16} /> Download Word document
      </button>
      {!id && (
        <div className="micro-copy">
          Save your handover first to enable export.
        </div>
      )}
    </section>
  );
}
