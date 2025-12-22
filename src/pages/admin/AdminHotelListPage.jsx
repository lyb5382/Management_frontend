import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHotelFilter from "../../components/admin/hotels/AdminHotelFilter";
import AdminHotelTable from "../../components/admin/hotels/AdminHotelTable";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import adminHotelApi from "../../api/adminHotelApi";

const AdminHotelListPage = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const [hotels, setHotels] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHotels();
  }, [currentPage, filters]); // 필터 바뀌면 바로 검색되게 의존성 추가

  const fetchHotels = async () => {
    try {
      setLoading(true);
      // 🕵️‍♂️ api에서 받아온 결과물을 res라는 이름으로 받자
      const res = await adminHotelApi.getHotels({
        ...filters,
        page: currentPage,
      });

      // 👇 [디버깅] 이제 에러 안 나게 로그 찍어보자
      console.log("🏨 [최종 데이터] 화면에 뿌릴 배열:", res.hotels);

      // 서버가 배열로 주든 객체로 주든 res.hotels에 담기게 해놨으니까 안심해!
      setHotels(res.hotels || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("❌ 로딩 실패:", err);
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // 필터 바뀌면 1페이지로 리셋
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchHotels();
  };

  // 🚨 [수정] 호텔 삭제 (강제 삭제)
  const handleDelete = async (hotelId) => {
    if (!window.confirm("정말 삭제하시겠습니까? (DB 및 이미지 영구 삭제)")) return;

    try {
      await adminHotelApi.deleteHotel(hotelId);
      alert("호텔이 삭제되었습니다.");
      fetchHotels(); // 목록 새로고침
    } catch (err) {
      alert(err.message || "삭제에 실패했습니다.");
    }
  };

  // ✅ 호텔 승인 처리
  const handleApprove = async (hotelId) => {
    if (!window.confirm("이 호텔을 승인하시겠습니까?")) return;
    try {
      // 🚨 adminHotelApi에 updateStatus 같은 함수가 있다고 가정 (없으면 만들어야함)
      await adminHotelApi.updateHotelStatus(hotelId, 'approved');
      alert("승인 완료! 👌");
      fetchHotels();
    } catch (err) {
      alert(err.message || "승인 처리 실패");
    }
  };

  // ❌ 호텔 거부 처리
  const handleReject = async (hotelId) => {
    const reason = window.prompt("거부 사유를 입력하세요:");
    if (reason === null) return;
    try {
      await adminHotelApi.updateHotelStatus(hotelId, 'rejected', reason);
      alert("거부 처리됨.");
      fetchHotels();
    } catch (err) {
      alert(err.message || "거부 처리 실패");
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchHotels} />;

  return (
    <div className="admin-hotel-list-page">
      <div className="page-header">
        <h1>호텔 관리</h1>
        {userRole === 'business' && (
          <button
            onClick={() => navigate("/owner/my-hotel/new")}
            className="btn btn-primary"
          >
            호텔 등록
          </button>
        )}
      </div>

      <AdminHotelFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      <AdminHotelTable
        hotels={hotels}
        onApprove={handleApprove} // 👈 함수 연결
        onReject={handleReject}   // 👈 함수 연결
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminHotelListPage;