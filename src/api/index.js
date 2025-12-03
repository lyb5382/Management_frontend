import axiosInstance from './axiosConfig';

// ========================================================
// 🔑 1. 인증 (Auth)
// ========================================================
export const login = (data) => axiosInstance.post('/auth/login', data);
export const signup = (data) => axiosInstance.post('/auth/register', data);

// ========================================================
// 🏢 2. 사업자 (Business)
// ========================================================
// 사업자 신청 (이미지 포함 -> FormData)
export const registerBusiness = (formData) => axiosInstance.post('/business/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// [관리자] 사업자 목록 조회 (필터링 가능)
export const getBusinessListAdmin = (params) => axiosInstance.get('/business/admin/list', { params }); // params: { status: 'pending' }

// [관리자] 사업자 상세 조회
export const getBusinessDetail = (businessId) => axiosInstance.get(`/business/admin/${businessId}`);

// [관리자] 승인/거부/정지
export const approveBusiness = (businessId) => axiosInstance.patch(`/business/admin/approved/${businessId}`);
export const rejectBusiness = (businessId) => axiosInstance.patch(`/business/admin/rejected/${businessId}`);
export const suspendBusiness = (businessId) => axiosInstance.patch(`/business/admin/suspend/${businessId}`);

// ========================================================
// 🏨 3. 호텔 (Hotel)
// ========================================================
// [사업자] 호텔 등록
export const registerHotel = (data) => axiosInstance.post('/hotels', data);

// [사업자] 내 호텔 목록 조회
export const getMyHotels = () => axiosInstance.get('/hotels/my-hotels');

// 호텔 상세 조회
export const getHotelDetail = (hotelId) => axiosInstance.get(`/hotels/${hotelId}`);

// [사업자] 호텔 수정
export const updateHotel = (hotelId, data) => axiosInstance.patch(`/hotels/${hotelId}`, data);

// [사업자] 호텔 삭제
export const deleteHotel = (hotelId) => axiosInstance.delete(`/hotels/${hotelId}`);

// [사업자] 호텔 이미지 업로드 (FormData)
export const uploadHotelImages = (hotelId, formData) => axiosInstance.post(`/hotels/${hotelId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// [관리자] 전체 호텔 목록 조회
export const getAllHotelsAdmin = (params) => axiosInstance.get('/hotels/admin/all', { params });

// [관리자] 호텔 강제 삭제
export const forceDeleteHotel = (hotelId) => axiosInstance.delete(`/hotels/admin/${hotelId}`);

// ========================================================
// 🛏️ 4. 객실 (Room)
// ========================================================
// [사업자] 객실 등록
export const registerRoom = (data) => axiosInstance.post('/rooms', data);

// 호텔별 객실 목록 조회
export const getRoomsByHotel = (hotelId) => axiosInstance.get(`/rooms/hotel/${hotelId}`);

// [사업자] 객실 수정
export const updateRoom = (roomId, data) => axiosInstance.patch(`/rooms/${roomId}`, data);

// [사업자] 객실 삭제
export const deleteRoom = (roomId) => axiosInstance.delete(`/rooms/${roomId}`);

// [사업자] 객실 이미지 업로드 (FormData)
export const uploadRoomImages = (roomId, formData) => axiosInstance.post(`/rooms/${roomId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// ========================================================
// 📅 5. 예약 (Booking)
// ========================================================
// [사업자] 내 예약 목록 조회
export const getBusinessBookings = (status) => axiosInstance.get('/bookings/business', { params: { status } });

// [사업자] 예약 승인/거절 ({ status: "confirmed" })
export const updateBookingStatus = (bookingId, status) => axiosInstance.patch(`/bookings/${bookingId}/status`, { status });

// [관리자] 전체 예약 조회
export const getAllBookingsAdmin = (params) => axiosInstance.get('/bookings/admin/all', { params });

// ========================================================
// 💳 6. 결제 (Payment)
// ========================================================
// [사업자] 내 결제 내역 조회
export const getBusinessPayments = () => axiosInstance.get('/payments/business');

// [관리자] 전체 결제 내역 조회
export const getAllPaymentsAdmin = (params) => axiosInstance.get('/payments/admin/list', { params });

// ========================================================
// 📊 7. 통계 (Stats)
// ========================================================
// [사업자] 대시보드
export const getBusinessStats = () => axiosInstance.get('/stats/business');

// [관리자] 대시보드
export const getAdminStats = () => axiosInstance.get('/stats/admin');

// ========================================================
// 🎟️ 8. 쿠폰 (Coupon) - 관리자용
// ========================================================
export const createCoupon = (data) => axiosInstance.post('/coupons', data);
export const getCoupons = (params) => axiosInstance.get('/coupons', { params });
export const deleteCoupon = (couponId) => axiosInstance.delete(`/coupons/${couponId}`);

// ========================================================
// 📢 9. 공지사항 (Notice)
// ========================================================
// [관리자] 공지 등록 (이미지 포함 -> FormData)
export const createNotice = (formData) => axiosInstance.post('/notices', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const getNotices = (params) => axiosInstance.get('/notices', { params });
export const getNoticeDetail = (noticeId) => axiosInstance.get(`/notices/${noticeId}`);
export const updateNotice = (noticeId, data) => axiosInstance.patch(`/notices/${noticeId}`, data);
export const deleteNotice = (noticeId) => axiosInstance.delete(`/notices/${noticeId}`);

// ========================================================
// 💬 10. 문의사항 (Inquiry)
// ========================================================
export const createInquiry = (data) => axiosInstance.post('/inquiries', data);
export const getInquiries = (params) => axiosInstance.get('/inquiries', { params }); // 내꺼 or 전체 자동 분기
export const getInquiryDetail = (inquiryId) => axiosInstance.get(`/inquiries/${inquiryId}`);
export const deleteInquiry = (inquiryId) => axiosInstance.delete(`/inquiries/${inquiryId}`);

// [관리자] 답변 등록
export const replyInquiry = (inquiryId, answer) => axiosInstance.post(`/inquiries/${inquiryId}/reply`, { answer });

// ========================================================
// ⚠️ 11. 신고 (Report)
// ========================================================
export const createReport = (data) => axiosInstance.post('/reports', data);
export const getReportsAdmin = (params) => axiosInstance.get('/reports/admin/list', { params });
export const processReport = (reportId, data) => axiosInstance.patch(`/reports/admin/${reportId}`, data); // { status, adminMemo }

// ========================================================
// 👥 12. 회원 관리 (User Manage) - 관리자용
// ========================================================
export const getAllUsersAdmin = (params) => axiosInstance.get('/users/admin/all', { params });
export const toggleUserBlock = (userId) => axiosInstance.patch(`/users/admin/${userId}/status`);