export default function Field({ label, children, wide, required }) {
  return (
    <label className={`field ${wide ? 'field-wide' : ''}`}>
      <span>
        {label}
        {required && <i> *</i>}
      </span>
      {children}
    </label>
  );
}
