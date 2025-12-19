import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdminHeader from "./AdminHeader"; // 헤더는 그냥 재탕해 (로그아웃 기능 똑같으니까)
import OwnerSidebar from "./OwnerSidebar"; // 👈 [핵심] 방금 만든 사업자용 사이드바
import "../../styles/index.scss";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import Loader from "../common/Loader";
import { useEffect } from "react";

const OwnerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminInfo, loading } = useAdminAuth(); // 훅 이름이 AdminAuth여도 토큰 검사는 똑같음

  useEffect(() => {
    // 로딩 끝났는데 정보 없으면 로그인 페이지로 뻥 차버림
    if (!loading && !adminInfo) {
      navigate("/admin/login", { replace: true });
    }

    // (선택사항) 혹시 여기서 role 체크해서 사업자 아니면 쫓아내는 로직 넣어도 됨
    // if (!loading && adminInfo && adminInfo.role !== 'business') { ... } 
    // 근데 로그인단에서 막았으니까 굳이 안 해도 됨.

  }, [loading, adminInfo, navigate]);

  if (loading) return <Loader fullScreen />;

  return (
    // className은 admin-layout 그대로 써야 스타일 적용됨!
    <div className="admin-layout">
      {/* 👇 여기가 핵심! 관리자 메뉴 대신 사업자 메뉴 낌 */}
      <OwnerSidebar />

      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <Outlet key={location.pathname} />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;