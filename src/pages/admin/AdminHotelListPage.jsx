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
      const data = await adminHotelApi.getHotels({
        ...filters,
        page: currentPage,
      });
      setHotels(data.hotels || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
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

  // ❌ [삭제] handleApprove, handleReject는 백엔드에 기능 없으므로 제거함.
  // 만약 AdminHotelTable 컴포넌트가 props를 필수(required)로 요구하면
  // onApprove={() => {}} 이렇게 빈 함수라도 넘겨줘야 에러 안 남.

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchHotels} />;

  return (
    <div className="admin-hotel-list-page">
      <div className="page-header">
        <h1>호텔 관리</h1>
        <button
          onClick={() => navigate("/admin/hotels/new")}
          className="btn btn-primary"
        >
          호텔 등록
        </button>
      </div>

      <AdminHotelFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      <AdminHotelTable
        hotels={hotels}
        // 승인/거절은 기능 없으니까 빼거나 빈 함수 전달
        onApprove={() => alert("호텔은 등록 즉시 승인됩니다.")} 
        onReject={() => alert("기능 없음")}
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