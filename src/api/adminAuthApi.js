import axiosInstance from "./axiosConfig";

const adminAuthApi = {
  // 2. 로그인 (URL은 딱 "/auth/login" 만 써야 됨)
  login: (credentials) => {
    // credentials = { email, password }
    return axiosInstance.post("/auth/login", credentials);
  },

  // 3. 로그아웃 (토큰만 지우면 됨)
  logout: () => {
    return new Promise((resolve) => {
        localStorage.removeItem('accessToken');
        resolve({ message: "로그아웃 성공" });
    });
  },

  // 4. 나머지는 에러 방지용 가짜 함수
  getMyInfo: () => Promise.resolve({ data: {} }),
  changePassword: () => Promise.resolve({}),
  forgotPassword: () => Promise.resolve({}),
};

export default adminAuthApi;