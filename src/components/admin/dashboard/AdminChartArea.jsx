import React from "react";

const CHART_WIDTH = 760;
const CHART_HEIGHT = 480;
const CHART_PADDING = 80;
const GRID_LINES = 5;

const formatCurrency = (v) => `₩${Number(v).toLocaleString()}`;

const AdminChartArea = ({ data = {} }) => {
  const labels = data.labels || [];
  const revenue = (data.revenue || []).map((v) => Number(v || 0));
  const bookings = (data.bookings || []).map((v) => Number(v || 0));
  const hasData = labels.length && revenue.length;

  const maxValue = Math.max(...revenue, ...bookings, 1);

  const getPoints = (values) => {
    return values.map((value, i) => {
      const x =
        CHART_PADDING +
        (i / Math.max(values.length - 1, 1)) * (CHART_WIDTH - CHART_PADDING * 2);
      const y =
        CHART_PADDING +
        (1 - value / maxValue) * (CHART_HEIGHT - CHART_PADDING * 2);
      return { x, y, value };
    });
  };

  const revPoints = getPoints(revenue);
  const bookPoints = getPoints(bookings);

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <h3>매출 추이</h3>
        <div className="chart-legend">
          <span className="legend revenue">매출</span>
          <span className="legend bookings">예약 건수</span>
        </div>
      </div>

      {hasData ? (
        <svg
          className="line-chart"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          role="img"
          aria-label="최근 매출 및 예약 추이"
        >
          {/* Y axis grid & labels */}
          {[...Array(GRID_LINES)].map((_, i) => {
            const t = i / (GRID_LINES - 1);
            const y = CHART_PADDING + t * (CHART_HEIGHT - CHART_PADDING * 2);
            const labelValue = Math.round((1 - t) * maxValue);
            return (
              <g key={i}>
                <line
                  x1={CHART_PADDING}
                  x2={CHART_WIDTH - CHART_PADDING}
                  y1={y}
                  y2={y}
                  stroke="#eef2f6"
                />
                <text
                  x={CHART_PADDING - 12}
                  y={y + 4}
                  fontSize="12"
                  fill="#6b7280"
                  textAnchor="end"
                >
                  {formatCurrency(labelValue)}
                </text>
              </g>
            );
          })}

          {/* bookings line */}
          <polyline
            points={bookPoints.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.9"
          />
          {bookPoints.map((p, idx) => (
            <g key={`b${idx}`}>
              <circle cx={p.x} cy={p.y} r={4} fill="#10b981" />
              <text x={p.x} y={p.y - 10} fontSize="11" fill="#10b981" textAnchor="middle">
                {p.value}
              </text>
            </g>
          ))}

          {/* revenue line */}
          <polyline
            points={revPoints.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {revPoints.map((p, idx) => (
            <g key={`r${idx}`}>
              <circle cx={p.x} cy={p.y} r={6} fill="#2563eb" opacity={0.12} />
              <circle cx={p.x} cy={p.y} r={3.5} fill="#2563eb" />
            </g>
          ))}

          {/* revenue labels (badge) */}
          {revPoints.map((p, idx) => (
            <g key={`rl${idx}`}>
              <rect
                x={p.x - 40}
                y={p.y - 38}
                width={80}
                height={24}
                rx={8}
                fill="#ffffff"
                stroke="#e6eefc"
                filter="url(#shadow)"
              />
              <text x={p.x} y={p.y - 22} fontSize="12" fill="#0f172a" textAnchor="middle">
                {formatCurrency(p.value)}
              </text>
            </g>
          ))}

          {/* simple drop shadow filter for badges */}
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.06" />
            </filter>
          </defs>

          {/* X axis labels and vertical separators */}
          {labels.map((label, idx) => {
            const p = revPoints[idx] || { x: CHART_PADDING + idx * 30 };
            return (
              <g key={`xl${idx}`}>
                <line
                  x1={p.x}
                  x2={p.x}
                  y1={CHART_HEIGHT - CHART_PADDING}
                  y2={CHART_HEIGHT - CHART_PADDING + 6}
                  stroke="#e6eefc"
                />
                <text
                  x={p.x}
                  y={CHART_HEIGHT - CHART_PADDING + 28}
                  fontSize="13"
                  fill="#0f172a"
                  textAnchor="middle"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      ) : (
        <div className="chart-placeholder">
          <p>표시할 데이터가 없습니다. 기간을 변경해 보세요.</p>
        </div>
      )}
    </div>
  );
};

export default AdminChartArea;
