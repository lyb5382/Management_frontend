// 👇 니가 만든 함수 모음집에서 신고(Report) 관련 함수 가져와
import { getReportsAdmin, processReport } from "./index";

const adminReviewApi = {
  // ==================================================
  // 🚨 [주의] 일반 리뷰 관리 기능 (관리자 백엔드에 없음)
  // user 백엔드가 리뷰 API 만들면 거기로 연결해야 함.
  // 일단은 에러 안 나게 빈 껍데기만 둠.
  // ==================================================

  // 리뷰 목록 조회
  getReviews: (params) => {
    console.warn("일반 리뷰 목록 조회 API는 User Backend 소관입니다.");
    return Promise.resolve({ data: [] });
  },

  // 리뷰 상세 조회
  getReviewById: (reviewId) => {
    console.warn("리뷰 상세 조회 API 미구현");
    return Promise.resolve({ data: {} });
  },

  // 리뷰 삭제
  deleteReview: (reviewId) => {
    console.warn("리뷰 강제 삭제 API 미구현 (신고 처리를 이용하세요)");
    return Promise.resolve({});
  },

  // 리뷰 상태 변경
  updateReviewStatus: (reviewId, status) => {
    console.warn("리뷰 상태 변경 API 미구현");
    return Promise.resolve({});
  },

  // ==================================================
  // ✅ [핵심] 신고된 리뷰 관리
  // ==================================================

  // 신고된 리뷰 목록 조회
  // GET /api/reports/admin/list
  getReportedReviews: async (params) => {
    const response = await getReportsAdmin(params);
    return response.data; 
  },

  // 리뷰 신고 처리 (승인/기각)
  // PATCH /api/reports/admin/:id
  handleReport: async (reportId, status) => {
    // status: "resolved"(처리됨/삭제) 또는 "dismissed"(기각)
    // 프론트에서 'DELETE'나 'KEEP' 같은 걸로 보내면 변환 필요할 수 있음.
    // status를 보낸다고 가정.
    const response = await processReport(reportId, { status });
    return response.data;
  },
};

export default adminReviewApi;