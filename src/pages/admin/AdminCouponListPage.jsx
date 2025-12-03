import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminCouponTable from "../../components/admin/coupons/AdminCouponTable";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getCoupons, deleteCoupon } from "../../api"; 

const AdminCouponListPage = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      
      // 1. API 호출
      const response = await getCoupons();
      
      // 2. 데이터 세팅 (백엔드가 { coupons: [...], total: ... } 이렇게 줌)
      setCoupons(response.data.coupons || []);
      
    } catch (err) {
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      // 3. 삭제 API 호출
      await deleteCoupon(couponId);
      alert("쿠폰이 삭제되었습니다.");
      
      // 4. 목록 새로고침
      fetchCoupons();
    } catch (err) {
      alert(err.message || "삭제에 실패했습니다.");
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCoupons} />;

  return (
    <div className="admin-coupon-list-page">
      <div className="page-header">
        <h1>쿠폰 관리</h1>
        <button
          onClick={() => navigate("/admin/coupons/new")}
          className="btn btn-primary"
        >
          쿠폰 생성
        </button>
      </div>

      <AdminCouponTable coupons={coupons} onDelete={handleDelete} />
    </div>
  );
};

export default AdminCouponListPage;