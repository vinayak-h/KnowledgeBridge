import { useEffect, useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Save,
  ClipboardList,
  FolderOpen,
  Check,
} from 'lucide-react';
const API = 'http://localhost:8080/api/handovers';
const blank = () => ({
  title: '',
  type: 'LEAVE',
  creator: '',
  recipient: '',
  startDate: '',
  endDate: '',
  summary: '',
  status: 'DRAFT',
  workItems: [],
  knowledgeEntries: [],
  referenceLinks: [],
});
const work = () => ({
  title: '',
  description: '',
  status: 'IN_PROGRESS',
  owner: '',
  dueDate: '',
  blocker: '',
  completedWork: '',
  nextAction: '',
});
const know = () => ({ type: 'DECISION', title: '', content: '' });
async function req(url, opts = {}) {
  let r = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  if (!r.ok) {
    let e = await r.json().catch(() => ({}));
    throw Error(e.error || `Request failed (${r.status})`);
  }
  if (r.status === 204) return null;
  return opts.blob ? r.blob() : r.json();
}
export default function App() {
  const [items, setItems] = useState([]),
    [form, setForm] = useState(blank()),
    [id, setId] = useState(null),
    [editing, setEditing] = useState(false),
    [search, setSearch] = useState(''),
    [error, setError] = useState(''),
    [notice, setNotice] = useState(''),
    [findings, setFindings] = useState(null),
    [tab, setTab] = useState('work');
  async function load() {
    try {
      setItems(await req(API));
      setError('');
    } catch (e) {
      setError(e.message + ' — start MySQL and the backend, then refresh.');
    }
  }
  useEffect(() => {
    load();
  }, []);
  function create() {
    setForm(blank());
    setId(null);
    setFindings(null);
    setEditing(true);
    setError('');
  }
  async function edit(x) {
    try {
      let h = await req(`${API}/${x}`);
      setForm({ ...blank(), ...h });
      setId(x);
      setEditing(true);
      setFindings(null);
    } catch (e) {
      setError(e.message);
    }
  }
  function patch(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }
  function arr(k, i, f, v) {
    setForm((p) => ({ ...p, [k]: p[k].map((x, j) => (i === j ? { ...x, [f]: v } : x)) }));
  }
  function add(k, v) {
    setForm((p) => ({ ...p, [k]: [...p[k], v] }));
  }
  function remove(k, i) {
    setForm((p) => ({ ...p, [k]: p[k].filter((_, j) => i !== j) }));
  }
  async function save() {
    if (!form.title.trim() || !form.creator.trim()) {
      setError('Title and creator are required.');
      return;
    }
    try {
      let p = {
        ...form,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        workItems: form.workItems.map((w) => ({ ...w, dueDate: w.dueDate || null })),
      };
      let h = await req(id ? `${API}/${id}` : API, { method: id ? 'PUT' : 'POST', body: JSON.stringify(p) });
      setId(h.id);
      setForm({ ...blank(), ...h });
      await load();
      setNotice('Handover saved.');
      setError('');
      return h;
    } catch (e) {
      setError(e.message);
    }
  }
  async function check() {
    let h = await save();
    if (h) {
      try {
        setFindings(await req(`${API}/${h.id}/completeness`));
      } catch (e) {
        setError(e.message);
      }
    }
  }
  async function exportDoc() {
    if (!id) {
      setError('Save the handover first.');
      return;
    }
    try {
      let blob = await req(`${API}/${id}/export`, { blob: true });
      let u = URL.createObjectURL(blob),
        a = document.createElement('a');
      a.href = u;
      a.download = `handover-${id}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(u), 0);
    } catch (e) {
      setError(e.message);
    }
  }
  async function del(x) {
    if (!confirm('Delete this handover?')) return;
    try {
      await req(`${API}/${x}`, { method: 'DELETE' });
      await load();
      setNotice('Handover deleted.');
    } catch (e) {
      setError(e.message);
    }
  }
  const filtered = items.filter((x) =>
    `${x.title} ${x.creator} ${x.recipient || ''}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="shell">
      <aside>
        <div className="brand">
          <BookOpen />
          <div>
            <b>KnowledgeBridge</b>
            <small>Work continuity</small>
          </div>
        </div>
        <p className="label">WORKSPACE</p>
        <button className={!editing ? 'nav active' : 'nav'} onClick={() => setEditing(false)}>
          <FolderOpen size={18} /> Overview
        </button>
        <button className="nav" onClick={create}>
          <Plus size={18} /> Create handover
        </button>
        <div className="aside-foot">Standalone POC · No Jira integration</div>
      </aside>
      <main>
        <header>
          <span>
            Workspace / <b>{editing ? (id ? 'Edit handover' : 'New handover') : 'Overview'}</b>
          </span>
          <span className="badge">Local workspace</span>
        </header>
        <div className="content">
          {error && (
            <div className="alert error">
              {error}
              <button onClick={() => setError('')} aria-label="Dismiss error">
                ×
              </button>
            </div>
          )}
          {notice && (
            <div className="alert good">
              {notice}
              <button onClick={() => setNotice('')} aria-label="Dismiss notice">
                ×
              </button>
            </div>
          )}
          {!editing ? (
            <>
              <div className="heading">
                <div>
                  <small>YOUR TEAM'S KNOWLEDGE, CONNECTED</small>
                  <h1>Handover overview</h1>
                  <p>Keep work moving when responsibilities change.</p>
                </div>
                <button className="primary" onClick={create}>
                  <Plus size={16} /> Create handover
                </button>
              </div>
              <div className="stats">
                <div>
                  <FolderOpen />
                  <small>Total handovers</small>
                  <strong>{items.length}</strong>
                </div>
                <div>
                  <ClipboardList />
                  <small>Work items</small>
                  <strong>{items.reduce((n, h) => n + (h.workItems?.length || 0), 0)}</strong>
                </div>
                <div>
                  <CheckCircle2 />
                  <small>Shared</small>
                  <strong>{items.filter((h) => h.status === 'SHARED').length}</strong>
                </div>
              </div>
              <section className="panel">
                <div className="panel-head">
                  <div>
                    <h2>Recent handovers</h2>
                    <p>Open a handover to edit its details.</p>
                  </div>
                  <label className="search">
                    <Search size={16} />
                    <input placeholder="Search handovers" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </label>
                </div>
                {!filtered.length ? (
                  <div className="empty">
                    <FileText size={34} />
                    <h3>No handovers found</h3>
                    <p>Create your first handover to get started.</p>
                    <button className="primary" onClick={create}>
                      <Plus size={16} /> Create handover
                    </button>
                  </div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>HANDOVER</th>
                          <th>CREATOR</th>
                          <th>RECIPIENT</th>
                          <th>WORK ITEMS</th>
                          <th>STATUS</th>
                          <th>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((h) => (
                          <tr key={h.id}>
                            <td>
                              <button className="link" onClick={() => edit(h.id)}>
                                {h.title}
                              </button>
                              <small>{(h.type || '').replaceAll('_', ' ')}</small>
                            </td>
                            <td>{h.creator}</td>
                            <td>{h.recipient || '—'}</td>
                            <td>{h.workItems?.length || 0}</td>
                            <td>
                              <span className="status">{h.status || 'DRAFT'}</span>
                            </td>
                            <td>
                              <button className="icon" onClick={() => edit(h.id)} aria-label="Open handover">
                                <FileText size={16} />
                              </button>
                              <button className="icon danger" onClick={() => del(h.id)} aria-label="Delete handover">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          ) : (
            <>
              <div className="heading">
                <div>
                  <button className="back" onClick={() => setEditing(false)}>
                    <ArrowLeft size={15} /> Back to overview
                  </button>
                  <small>HANDOVER WORKSPACE</small>
                  <h1>{id ? 'Edit handover' : 'Create a handover'}</h1>
                  <p>Capture the context needed to continue work.</p>
                </div>
                <div className="actions">
                  <button className="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                  <button className="primary" onClick={save}>
                    <Save size={15} /> Save draft
                  </button>
                </div>
              </div>
              <div className="editor">
                <div className="left">
                  <section className="panel form">
                    <h2>01 &nbsp; Handover details</h2>
                    <div className="grid">
                      <Field label="Handover title *">
                        <input
                          value={form.title}
                          onChange={(e) => patch('title', e.target.value)}
                          placeholder="e.g. Payments API handover"
                        />
                      </Field>
                      <Field label="Type">
                        <select value={form.type} onChange={(e) => patch('type', e.target.value)}>
                          <option value="LEAVE">Leave</option>
                          <option value="PROJECT_TRANSITION">Project transition</option>
                          <option value="ROLE_CHANGE">Role change</option>
                          <option value="RESPONSIBILITY_TRANSFER">Responsibility transfer</option>
                        </select>
                      </Field>
                      <Field label="Created by *">
                        <input
                          value={form.creator}
                          onChange={(e) => patch('creator', e.target.value)}
                          placeholder="Employee name"
                        />
                      </Field>
                      <Field label="Recipient">
                        <input
                          value={form.recipient || ''}
                          onChange={(e) => patch('recipient', e.target.value)}
                          placeholder="Receiving employee"
                        />
                      </Field>
                      <Field label="Start date">
                        <input
                          type="date"
                          value={form.startDate || ''}
                          onChange={(e) => patch('startDate', e.target.value)}
                        />
                      </Field>
                      <Field label="End date">
                        <input
                          type="date"
                          value={form.endDate || ''}
                          onChange={(e) => patch('endDate', e.target.value)}
                        />
                      </Field>
                      <Field label="Summary" full>
                        <textarea
                          rows="3"
                          value={form.summary || ''}
                          onChange={(e) => patch('summary', e.target.value)}
                          placeholder="Current situation, priorities and context"
                        />
                      </Field>
                    </div>
                  </section>
                  <section className="panel form">
                    <h2>02 &nbsp; Knowledge and work</h2>
                    <div className="tabs">
                      <button className={tab === 'work' ? 'chosen' : ''} onClick={() => setTab('work')}>
                        Work items ({form.workItems.length})
                      </button>
                      <button className={tab === 'knowledge' ? 'chosen' : ''} onClick={() => setTab('knowledge')}>
                        Knowledge ({form.knowledgeEntries.length})
                      </button>
                      <button className={tab === 'links' ? 'chosen' : ''} onClick={() => setTab('links')}>
                        References ({form.referenceLinks.length})
                      </button>
                    </div>
                    {tab === 'work' && (
                      <>
                        {form.workItems.map((w, i) => (
                          <div className="repeat" key={i}>
                            <div className="repeat-head">
                              <b>Work item {i + 1}</b>
                              <button
                                className="icon danger"
                                onClick={() => remove('workItems', i)}
                                aria-label="Remove work item"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <div className="grid">
                              <Field label="Title *" full>
                                <input
                                  value={w.title}
                                  onChange={(e) => arr('workItems', i, 'title', e.target.value)}
                                  placeholder="Task title"
                                />
                              </Field>
                              <Field label="Status">
                                <select
                                  value={w.status || 'NOT_STARTED'}
                                  onChange={(e) => arr('workItems', i, 'status', e.target.value)}
                                >
                                  <option value="NOT_STARTED">Not started</option>
                                  <option value="IN_PROGRESS">In progress</option>
                                  <option value="BLOCKED">Blocked</option>
                                  <option value="COMPLETED">Completed</option>
                                </select>
                              </Field>
                              <Field label="Owner">
                                <input
                                  value={w.owner || ''}
                                  onChange={(e) => arr('workItems', i, 'owner', e.target.value)}
                                />
                              </Field>
                              <Field label="Due date">
                                <input
                                  type="date"
                                  value={w.dueDate || ''}
                                  onChange={(e) => arr('workItems', i, 'dueDate', e.target.value)}
                                />
                              </Field>
                              <Field label="Description" full>
                                <textarea
                                  value={w.description || ''}
                                  onChange={(e) => arr('workItems', i, 'description', e.target.value)}
                                  rows="2"
                                />
                              </Field>
                              <Field label="Completed work">
                                <textarea
                                  value={w.completedWork || ''}
                                  onChange={(e) => arr('workItems', i, 'completedWork', e.target.value)}
                                  rows="2"
                                />
                              </Field>
                              <Field label="Next action">
                                <textarea
                                  value={w.nextAction || ''}
                                  onChange={(e) => arr('workItems', i, 'nextAction', e.target.value)}
                                  rows="2"
                                />
                              </Field>
                              <Field label="Blocker" full>
                                <textarea
                                  value={w.blocker || ''}
                                  onChange={(e) => arr('workItems', i, 'blocker', e.target.value)}
                                  rows="2"
                                />
                              </Field>
                            </div>
                          </div>
                        ))}
                        <button className="dashed" onClick={() => add('workItems', work())}>
                          <Plus size={15} /> Add work item
                        </button>
                      </>
                    )}
                    {tab === 'knowledge' && (
                      <>
                        {form.knowledgeEntries.map((k, i) => (
                          <div className="repeat" key={i}>
                            <div className="repeat-head">
                              <b>Knowledge entry {i + 1}</b>
                              <button
                                className="icon danger"
                                onClick={() => remove('knowledgeEntries', i)}
                                aria-label="Remove knowledge entry"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <div className="grid">
                              <Field label="Type">
                                <select
                                  value={k.type || 'GENERAL'}
                                  onChange={(e) => arr('knowledgeEntries', i, 'type', e.target.value)}
                                >
                                  {['DECISION', 'ISSUE', 'WORKAROUND', 'DEPENDENCY', 'OPEN_QUESTION', 'GENERAL'].map(
                                    (x) => (
                                      <option key={x}>{x}</option>
                                    ),
                                  )}
                                </select>
                              </Field>
                              <Field label="Title">
                                <input
                                  value={k.title || ''}
                                  onChange={(e) => arr('knowledgeEntries', i, 'title', e.target.value)}
                                />
                              </Field>
                              <Field label="Details" full>
                                <textarea
                                  rows="3"
                                  value={k.content || ''}
                                  onChange={(e) => arr('knowledgeEntries', i, 'content', e.target.value)}
                                />
                              </Field>
                            </div>
                          </div>
                        ))}
                        <button className="dashed" onClick={() => add('knowledgeEntries', know())}>
                          <Plus size={15} /> Add knowledge entry
                        </button>
                      </>
                    )}
                    {tab === 'links' && (
                      <>
                        {form.referenceLinks.map((l, i) => (
                          <div className="repeat" key={i}>
                            <div className="repeat-head">
                              <b>Reference {i + 1}</b>
                              <button
                                className="icon danger"
                                onClick={() => remove('referenceLinks', i)}
                                aria-label="Remove reference"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <div className="grid">
                              <Field label="Label">
                                <input
                                  value={l.label || ''}
                                  onChange={(e) => arr('referenceLinks', i, 'label', e.target.value)}
                                />
                              </Field>
                              <Field label="URL">
                                <input
                                  value={l.url || ''}
                                  onChange={(e) => arr('referenceLinks', i, 'url', e.target.value)}
                                  placeholder="https://…"
                                />
                              </Field>
                            </div>
                          </div>
                        ))}
                        <button className="dashed" onClick={() => add('referenceLinks', { label: '', url: '' })}>
                          <Plus size={15} /> Add reference
                        </button>
                      </>
                    )}
                  </section>
                </div>
                <aside>
                  <section className="panel side">
                    <h3>
                      <CheckCircle2 size={18} /> Completeness check
                    </h3>
                    <p>Find missing owners, next actions, blockers and other context.</p>
                    <button className="secondary wide" onClick={check}>
                      <Check size={15} /> Check handover
                    </button>
                    {findings && (
                      <div className="findings">
                        <b>
                          {findings.ready ? 'No blocking warnings' : `${findings.warningCount} warning(s) to review`}
                        </b>
                        {findings.findings.map((f, i) => (
                          <p key={i}>
                            <AlertTriangle size={13} /> {f.message}
                          </p>
                        ))}
                      </div>
                    )}
                  </section>
                  <section className="panel side">
                    <h3>
                      <Download size={18} /> Export document
                    </h3>
                    <p>Save first, then download a formatted Word document.</p>
                    <button className="primary wide" onClick={exportDoc} disabled={!id}>
                      <Download size={15} /> Download DOCX
                    </button>
                  </section>
                  <section className="panel side">
                    <h3>Workflow status</h3>
                    <Field label="Status">
                      <select value={form.status || 'DRAFT'} onChange={(e) => patch('status', e.target.value)}>
                        <option value="DRAFT">Draft</option>
                        <option value="READY">Ready for review</option>
                        <option value="SHARED">Shared</option>
                      </select>
                    </Field>
                    <p>Mark the record shared after distributing the document through an approved channel.</p>
                  </section>
                  <div className="privacy">Use fictional demo data. Authentication is not included.</div>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
function Field({ label, children, full }) {
  return (
    <label className={`field ${full ? 'full' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}
