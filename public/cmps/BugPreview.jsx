export function BugPreview({ bug }) {
  return (
    <article>
      <h4>{bug.title}</h4>
      <h1>🐛</h1>
      <p>
        Severity: <span>{bug.severity}</span>
      </p>

      <ul>
        {bug.labels.map((label, idx) => (
          <li key={`${label}${idx}`}>{label}</li>
        ))}
      </ul>
    </article>
  )
}
