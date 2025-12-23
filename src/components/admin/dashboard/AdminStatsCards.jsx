import React from 'react';

const AdminStatsCards = ({ stats }) => {
  const userRole = localStorage.getItem('userRole');

  // 💡 문자열(예: "+12%")이 '+'로 시작하면 긍정(true), 아니면 부정(false)
  const isPositive = (changeStr) => String(changeStr).startsWith('+');

  const cards = [
    {
      title: "오늘 예약",
      value: stats?.todayBookings || 0,

      // 👇 아까 API에서 만든 값 연결!
      change: stats?.bookingChange || "0%",
      positive: isPositive(stats?.bookingChange),

      icon: "📅",
      color: "#2563eb",
    },
    {
      title: "총 매출",
      value: `${stats?.totalRevenue?.toLocaleString() || 0}원`,
      change: stats?.revenueChange || "0%",
      positive: isPositive(stats?.revenueChange),
      icon: "💰",
      color: "#10b981",
    },
    {
      title: userRole === 'business' ? "내 호텔" : "활성 호텔",
      value: stats?.activeHotels || 0,
      change: stats?.hotelChange || "0",
      positive: true, // 호텔 수는 무조건 긍정
      icon: "🏨",
      color: "#f59e0b",
    },
    ...(userRole === 'admin' ? [{
      title: "신규 회원",
      value: stats?.newUsers || 0,
      change: stats?.userChange || "0%",
      positive: isPositive(stats?.userChange),
      icon: "👥",
      color: "#06b6d4",
    }] : []),
  ];

  return (
    <div className="stats-cards">
      {cards.map((card, index) => (
        <div key={index} className="stat-card">
          <div className="stat-header">
            <div className="stat-title">{card.title}</div>
            <div className="stat-icon" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
              {card.icon}
            </div>
          </div>
          <div className="stat-value">{card.value}</div>
          <div className={`stat-change ${card.positive ? "positive" : "negative"}`}>
            {card.change} 전일 대비
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStatsCards;