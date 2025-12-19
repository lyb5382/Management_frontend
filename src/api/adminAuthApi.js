import axiosInstance from "./axiosConfig";

const authApi = {
  // 1. 🔑 로그인 (이건 그대로 유지)
  login: (credentials) => {
    // credentials = { email, password }
    // 백엔드가 { user, token } 뱉어줌
    return axiosInstance.post("/auth/login", credentials);
  },

  // 2. 🚪 로그아웃 (토큰 싹 비우기)
  logout: () => {
    return new Promise((resolve) => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole'); // 아까 저장한 역할도 같이 지워야 깔끔
      resolve({ message: "로그아웃 성공" });
    });
  },

  // 3. 🚨 [중요] 내 정보 가져오기 (가짜 함수 삭제!)
  // 새로고침해도 로그인 유지하려면 이게 진짜 서버를 찔러야 됨.
  getMyInfo: () => {
    // 보통 백엔드 라우터가 /users/me 또는 /auth/me 로 되어 있을 거임.
    // 니 백엔드 User 라우터에 '내 정보 조회'가 있다면 그 주소 써야 됨.
    // 만약 없으면... 일단 가짜로 두거나 백엔드에 만들어야 하는데,
    // 일단 니 백엔드 구조상 '/users/me'가 있을 확률 99%
    return axiosInstance.get("/users/me");
  },

  // 4. 🔒 비밀번호 변경 (필요하면 진짜 연결)
  changePassword: (data) => {
    // data = { currentPassword, newPassword }
    return axiosInstance.patch("/users/password", data);
  },

  // 5. 📧 비번 찾기 (이메일 발송)
  forgotPassword: (email) => {
    return axiosInstance.post("/auth/forgot-password", { email });
  },
};

export default authApi;