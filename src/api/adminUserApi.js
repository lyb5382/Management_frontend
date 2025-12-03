import { 
  getAllUsersAdmin, 
  toggleUserBlock, 
  getBusinessListAdmin 
} from "./index";

const adminUserApi = {
  // 1. 일반 사용자 목록 조회
  getUsers: async (params) => {
    // params: { page: 1 }
    const response = await getAllUsersAdmin(params);
    return response.data;
  },

  // 2. 사용자 상태 변경 (활성화/비활성화) -> 차단 토글
  updateUserStatus: async (userId, status) => {
    // 백엔드는 토글 방식이라 status 값 안 보내도 됨 (알아서 반대로 바뀜)
    const response = await toggleUserBlock(userId);
    return response.data;
  },

  // 3. 사업자 목록 조회 (Business 도메인 API 재활용)
  getBusinessUsers: async (params) => {
    const response = await getBusinessListAdmin(params);
    return response.data;
  },

  // ==================================================
  // 🚨 아래 기능들은 백엔드 정책상 없음
  // ==================================================

  // 사용자 상세 조회
  getUserById: (userId) => {
    console.warn("관리자용 유저 상세 조회 미구현 (목록에서 확인하세요)");
    // 목록에 있는 정보로 퉁치거나 빈 객체 리턴
    return Promise.resolve({ data: {} });
  },

  // 사용자 정보 수정 (관리자가 남의 정보 함부로 수정 X)
  updateUser: (userId, data) => {
    console.warn("관리자용 유저 정보 수정 미구현");
    return Promise.resolve({});
  },

  // 사용자 삭제 (차단 기능을 사용하세요)
  deleteUser: (userId) => {
    console.warn("관리자용 유저 삭제 미구현 (차단 기능을 사용하세요)");
    return Promise.resolve({});
  },
};

export default adminUserApi;