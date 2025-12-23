import { getAdminStats } from "./index";

const adminStatsApi = {
  getDashboardStats: async () => {
    try {
      const response = await getAdminStats();
      const rawData = response.data;

      console.log("백엔드 실데이터:", rawData); // 확인용

      return {
        // 1. 메인 데이터 (백엔드 값 그대로 연결)
        todayBookings: rawData.todayReservations || rawData.reservations || 0,
        totalRevenue: rawData.revenue || rawData.totalSales || 0,
        activeHotels: rawData.hotels || rawData.hotelCount || 0,
        newUsers: rawData.users || rawData.userCount || 0,

        // 2. 증감률 (랜덤 삭제! 백엔드 데이터 없으면 그냥 0% 처리)
        // 백엔드에서 bookingChange 등을 주면 그걸 쓰고, 아니면 0% 고정
        bookingChange: rawData.bookingChange || "0%",
        revenueChange: rawData.revenueChange || "0%",
        hotelChange: rawData.hotelChange || "0",
        userChange: rawData.userChange || "0%",

        // 3. 차트 및 테이블
        chartData: rawData.chartData || { labels: [], revenue: [], bookings: [] },
        recentBookings: rawData.recentBookings || [],
        recentUsers: rawData.recentUsers || [],
        recentReviews: rawData.recentReviews || []
      };

    } catch (error) {
      console.error("데이터 매핑 실패:", error);
      throw error;
    }
  },

  getRevenueChart: () => Promise.resolve([]),
};

export default adminStatsApi;