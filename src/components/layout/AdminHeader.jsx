import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { adminInfo, logout } = useAdminAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // navigate with replace so back button won't return to protected routes
      navigate("/admin/login", { replace: true });
      // push a fresh entry to history to further prevent navigating back into app
      try {
        window.history.pushState(null, "", "/admin/login");
      } catch (e) {
        /* ignore */
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="admin-header">
      <div className="admin-header-inner">
        <div className="header-left">
          <h2>관리자 대시보드</h2>
        </div>
        <div className="header-right">
          <span>{adminInfo?.name || "Admin"}</span>
          <button onClick={handleLogout} className="btn btn-outline">
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
