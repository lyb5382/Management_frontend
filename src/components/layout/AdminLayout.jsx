import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import "../../styles/index.scss";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import Loader from "../common/Loader";
import { useEffect } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminInfo, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading && !adminInfo) {
      // not authenticated -> redirect to login and replace history
      navigate("/admin/login", { replace: true });
    }
  }, [loading, adminInfo, navigate]);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <Outlet key={location.pathname} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
