import { getAllBookingsAdmin } from "./index"; 

const adminBookingApi = {
  // 1. 예약 목록 조회
  getBookings: async (params) => {
    const response = await getAllBookingsAdmin(params);
    return response.data; 
  },
  
  // 예약 상세 조회
  getBookingById: (bookingId) => {
    console.warn("관리자용 예약 상세 조회 API 미구현");
    return Promise.resolve({ data: {} });
  },

  // 예약 상태 변경
  updateBookingStatus: (bookingId, status) => {
    console.warn("관리자용 예약 상태 변경 API 미구현");
    return Promise.resolve({});
  },

  // 예약 취소
  cancelBooking: (bookingId, reason) => {
    console.warn("관리자용 예약 취소 API 미구현");
    return Promise.resolve({});
  },

  // 예약 삭제
  deleteBooking: (bookingId) => {
    console.warn("관리자용 예약 삭제 API 미구현");
    return Promise.resolve({});
  },
};

export default adminBookingApi;