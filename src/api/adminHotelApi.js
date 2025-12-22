import axiosInstance from './axiosConfig';

const adminHotelApi = {
  // 1. 목록 조회
  getHotels: async (params) => {
    const role = localStorage.getItem('userRole');
    const endpoint = role === 'business' ? '/hotels/my-hotels' : '/hotels';

    const response = await axiosInstance.get(endpoint, { params });
    // console.log("📡 [API] 목록 데이터:", response.data);

    if (Array.isArray(response.data)) return { hotels: response.data, totalPages: 1 };
    return {
      hotels: response.data.hotels || response.data.data || [],
      totalPages: response.data.totalPages || 1
    };
  },

  // 👇 2. [핵심 추가] 호텔 상세 조회 (이게 없어서 에러 난 거임!)
  getHotelById: async (hotelId) => {
    // 백엔드: GET /api/hotels/:hotelId
    const response = await axiosInstance.get(`/hotels/${hotelId}`);
    return response.data;
  },

  // 👇 3. [핵심 추가] 호텔 정보 수정 (저장 버튼 누를 때 필요)
  updateHotel: async (hotelId, formData) => {
    // 백엔드: PATCH /api/hotels/:hotelId
    const response = await axiosInstance.patch(`/hotels/${hotelId}`, formData);
    return response.data;
  },

  // 4. 승인/거부 상태 변경
  updateHotelStatus: async (hotelId, status, reason = "") => {
    return await axiosInstance.patch(`/hotels/admin/${hotelId}/status`, {
      approvalStatus: status,
      rejectReason: reason
    });
  },

  // 5. 삭제 (사장님 vs 관리자 경로 분기 처리)
  deleteHotel: async (hotelId) => {
    const role = localStorage.getItem('userRole');

    // 🕵️‍♂️ 관리자면? -> 강제 삭제 라우터 (/admin/...)
    if (role === 'admin') {
      return await axiosInstance.delete(`/hotels/admin/${hotelId}`);
    }

    // 🏨 사장님이면? -> 내 호텔 삭제 라우터 (일반 경로)
    // 백엔드 라우터: router.delete('/:hotelId', ...)
    return await axiosInstance.delete(`/hotels/${hotelId}`);
  },
};

export default adminHotelApi;