import { CircleHelp, ArrowRight } from 'lucide-react';

export default function BottomNote({ onCreate }) {
  return (
    <section className="bottom-note">
      <div className="note-icon">
        <CircleHelp size={18} />
      </div>
      <div>
        <b>Good handovers are specific.</b>
        <span>
          Include owners, next actions, blockers and links to the source of
          truth. Use the completeness check before sharing.
        </span>
      </div>
      <button onClick={onCreate}>
        Create a handover <ArrowRight size={15} />
      </button>
    </section>
  );
}
