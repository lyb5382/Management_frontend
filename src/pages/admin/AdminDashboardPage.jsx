import { useState, useEffect } from "react";
import AdminStatsCards from "../../components/admin/dashboard/AdminStatsCards";
import AdminChartArea from "../../components/admin/dashboard/AdminChartArea";
import AdminRecentTable from "../../components/admin/dashboard/AdminRecentTable";
import adminStatsApi from "../../api/adminStatsApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import OwnerDashboardCharts from '../owner/OwnerRoomPage'

const AdminDashboardPage = () => {
  const userRole = localStorage.getItem('userRole');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await adminStatsApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error)
    return <ErrorMessage message={error} onRetry={fetchDashboardStats} />;

  return (
    <div className="admin-dashboard-page">
      <h1 className="text-2xl font-bold text-gray-800">
        {userRole === 'business' ? '사장님 대시보드' : '관리자 대시보드'}
      </h1>

      <AdminStatsCards stats={stats} />
      {userRole === 'business' ? (
        <OwnerDashboardCharts stats={stats} />
      ) : (
        <AdminChartArea data={stats?.chartData} />
      )}
      <div className="mt-8">
        <AdminRecentTable
          bookings={stats?.recentBookings || []}
          users={stats?.recentUsers || []}
          reviews={stats?.recentReviews || []}
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
