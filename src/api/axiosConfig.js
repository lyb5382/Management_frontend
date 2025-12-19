import axios from "axios";

// 🚨 주소 확실함? http인지 https인지 잘 봐. (지금은 http인 듯)
const BASE_URL = 'http://dfasdfasd.store/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    // ❌ [삭제] 이거 지워버려! 쿠키 안 쓰잖아. 괜히 에러만 만듦.
    // withCredentials: true, 
});

// 요청 납치해서 토큰 박기
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        // 👇 [디버깅용] 콘솔창(F12)에 이거 뜨는지 확인해봐!
        console.log("📡 API 요청 쏘는 중! 토큰 유무:", token ? "있음" : "없음");

        if (token) {
            // "Bearer " 뒤에 띄어쓰기 한 칸 필수!
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.error("🔥 API 에러 발생:", error.response?.status, error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;