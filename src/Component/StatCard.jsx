export default function StatCard({ title, value, change, children }) {
  const up = change >= 0;
  return (
    <div className="card stat">
      <div className="stat-header">
        <h4>{title}</h4>
        <span className={`chip ${up ? 'up' : 'down'}`}>
          {Math.abs(change).toFixed(1)}% {up ? '↑' : '↓'}
        </span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="sparkline">{children}</div>
    </div>
  );
}
