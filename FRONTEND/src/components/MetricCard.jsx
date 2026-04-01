export default function MetricCard({ label, value, sub, icon: Icon, color, bgColor }) {
  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <span className="metric-card-label">{label}</span>
        <div className="metric-icon" style={{ background: bgColor }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <div className="metric-value" style={{ color }}>{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  )
}
