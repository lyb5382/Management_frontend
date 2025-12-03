import { createContext, useState, useEffect } from "react";
import adminAuthApi from "../api/adminAuthApi";

export const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const data = await adminAuthApi.getMyInfo();
        setAdminInfo(data);
      }
    } catch (error) {
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await adminAuthApi.login(credentials);

    // ✅ axios는 .data 안에 진짜 내용물이 있음
    const { token, user } = response.data;

    // 1. 토큰 저장
    localStorage.setItem("accessToken", token);

    // 2. 유저 정보 저장 (백엔드가 user라고 주니까 user로 받아야지!)
    setAdminInfo(user);
  };

  const logout = async () => {
    try {
      await adminAuthApi.logout();
    } finally {
      localStorage.removeItem("accessToken");
      setAdminInfo(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{ adminInfo, loading, login, logout, checkAuth }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;
