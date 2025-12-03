import { getAllHotelsAdmin, forceDeleteHotel } from './index'; 

const adminHotelApi = {
  // 1. 호텔 목록 조회 (검색/페이징)
  getHotels: async (params) => {
    // params 예시: { page: 1, limit: 10, keyword: '신라' }
    const response = await getAllHotelsAdmin(params);
    return response.data; // { hotels: [], total: 100, ... }
  },

  // 2. 호텔 상세 조회 (관리자용 상세가 따로 없으면 기존 거 재활용하거나 비워둠)
  // 일단 목록에서 다 보여주면 필요 없을 수도 있음.
  getHotelDetail: async (hotelId) => {
    // 니가 만든 'getHotelDetail' (공용) 써도 됨
    // return (await getHotelDetail(hotelId)).data;
    return Promise.resolve({ data: {} }); // 일단 패스
  },

  // 3. 호텔 강제 삭제
  deleteHotel: async (hotelId) => {
    const response = await forceDeleteHotel(hotelId);
    return response.data;
  },
};

export default adminHotelApi;