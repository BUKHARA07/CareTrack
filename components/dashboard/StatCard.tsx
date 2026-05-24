type StatCardProps = {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  color: "blue" | "orange" | "purple" | "pink";
  sparkColor: string;
  points: number[];
  icon: React.ReactNode;
};

function Sparkline({ color, points }: { color: string; points: number[] }) {
  const w = 200;
  const h = 48;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * (h - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="dashSparkline" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords}
      />
    </svg>
  );
}

export default function StatCard({
  title,
  value,
  trend,
  trendUp,
  color,
  sparkColor,
  points,
  icon,
}: StatCardProps) {
  return (
    <article className="dashStatCard">
      <div className="dashStatTop">
        <div className={`dashStatIcon ${color}`}>{icon}</div>
        <span className={`dashStatTrend ${trendUp ? "up" : "down"}`}>{trend}</span>
      </div>
      <h3>{title}</h3>
      <p className="value">{value}</p>
      <Sparkline color={sparkColor} points={points} />
    </article>
  );
}
