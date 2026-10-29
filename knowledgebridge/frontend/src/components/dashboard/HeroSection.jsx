import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileCheck2,
  ListTodo,
  Plus,
  ShieldCheck,
} from 'lucide-react';

export default function HeroSection({ onCreate }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="eyebrow-dot" /> TEAM KNOWLEDGE, WITHOUT THE GAPS
        </div>
        <h1>
          Make every handover
          <br />
          <span>feel effortless.</span>
        </h1>
        <p>
          One clear place for priorities, open work, decisions and the context
          that keeps your team moving.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onCreate}>
            <Plus size={17} /> Create handover
          </button>
          <button
            className="btn btn-ghost"
            onClick={() =>
              document
                .getElementById('handover-list')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Explore workspace <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <div className="hero-art">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="hero-doc">
          <div className="doc-icon">
            <FileCheck2 size={25} />
          </div>
          <div className="doc-lines">
            <i />
            <i />
            <i />
          </div>
          <div className="doc-check">
            <Check size={15} />
          </div>
        </div>
        <div className="float-card float-top">
          <span className="float-symbol purple">
            <ListTodo size={16} />
          </span>
          <div>
            <b>Next actions</b>
            <small>Clearly assigned</small>
          </div>
          <CheckCircle2 size={17} className="float-check" />
        </div>
        <div className="float-card float-bottom">
          <span className="float-symbol green">
            <ShieldCheck size={16} />
          </span>
          <div>
            <b>Ready to hand over</b>
            <small>Context captured</small>
          </div>
        </div>
        <div className="hero-sparkle sparkle-one">✦</div>
        <div className="hero-sparkle sparkle-two">✳</div>
      </div>
    </section>
  );
}
