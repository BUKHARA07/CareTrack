const chartData = [
  { day: "25 May", newP: 42, oldP: 38 },
  { day: "26 May", newP: 55, oldP: 30 },
  { day: "27 May", newP: 48, oldP: 42 },
  { day: "28 May", newP: 60, oldP: 35 },
  { day: "29 May", newP: 52, oldP: 45 },
  { day: "30 May", newP: 65, oldP: 28 },
  { day: "31 May", newP: 58, oldP: 40 },
];

export default function PatientsChart() {
  const maxY = 100;
  const barW = 28;
  const gap = 24;
  const chartH = 180;
  const chartW = chartData.length * (barW + gap) + gap;
  const baseY = chartH + 20;

  return (
    <section className="dashPanel">
      <div className="dashPanelHead">
        <h2>Patients Statistics</h2>
        <button type="button" className="dashPanelBtn">
          View All
        </button>
      </div>
      <div className="dashChartBody">
        <div className="dashChartLegend">
          <span>
            <i className="new" /> New Patients
          </span>
          <span>
            <i className="old" /> Old Patients
          </span>
        </div>
        <p className="dashChartTotal">
          Total No of Patients : <b>480</b>
        </p>
        <svg
          className="dashBarChart"
          viewBox={`0 0 ${chartW} ${chartH + 50}`}
          role="img"
          aria-label="Patients statistics bar chart"
        >
          {[0, 20, 40, 60, 80, 100].map((tick) => {
            const y = baseY - (tick / maxY) * chartH;
            return (
              <g key={tick}>
                <line x1={gap} y1={y} x2={chartW - gap} y2={y} stroke="#e8ecf1" strokeWidth="1" />
                <text x={0} y={y + 4} fontSize="10" fill="#6b7280">
                  {tick}
                </text>
              </g>
            );
          })}
          {chartData.map((d, i) => {
            const x = gap + i * (barW + gap);
            const newH = (d.newP / maxY) * chartH;
            const oldH = (d.oldP / maxY) * chartH;
            return (
              <g key={d.day}>
                <rect
                  x={x}
                  y={baseY - oldH - newH}
                  width={barW}
                  height={newH}
                  rx="3"
                  fill="var(--accent_clr_drk)"
                />
                <rect
                  x={x}
                  y={baseY - oldH}
                  width={barW}
                  height={oldH}
                  rx="3"
                  fill="var(--accent_clr-200)"
                />
                <text
                  x={x + barW / 2}
                  y={baseY + 16}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#6b7280"
                >
                  {d.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
