import axios from "axios";

// 🚨 [여기가 문제였음]
// 니가 여기에 "VITE_API_BASE_URL=..." 이라는 글자를 넣었을 확률 10000%임.
// 그냥 깔끔하게 주소만 딱 박아.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    // 쿠키 안 쓰면 false로 해도 되는데, 일단 true 둬도 상관없음
    withCredentials: true, 
});

// 요청 인터셉터 (토큰 박기)
axiosInstance.interceptors.request.use(
    (config) => {
        // 아까 고친 "accessToken" 이름 확인!
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 (에러 처리)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // 에러 처리 로직은 일단 냅두자 (여긴 문제 없음)
        return Promise.reject(error);
    }
);

export default axiosInstance;