import { getAdminStats } from "./index";

const adminStatsApi = {
  // 1. 관리자 대시보드 통계 (매출, 예약수, 호텔수)
  getDashboardStats: async () => {
    // Mock 다 꺼져. 진짜 데이터 가져온다.
    const response = await getAdminStats();
    
    // 백엔드 응답 구조: { revenue: 0, reservations: 0, hotels: 0 }
    // 프론트가 원하는 구조랑 맞는지 확인하고 리턴
    return response.data; 
  },

  // 2. (혹시 다른 통계 함수가 더 있다면)
  // getRevenueChart: ... -> 백엔드에 아직 없으면 빈 배열 리턴
  getRevenueChart: () => Promise.resolve([]),
};

export default adminStatsApi;