import { useState, useEffect, useCallback } from "react"; // useCallback 추가!
import AdminBookingFilter from "../../components/admin/bookings/AdminBookingFilter";
import AdminBookingTable from "../../components/admin/bookings/AdminBookingTable";
import Pagination from "../../components/common/Pagination";
import adminBookingApi from "../../api/adminBookingApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminBookingListPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🚨 [수정 1] 함수를 useEffect 밖으로 꺼냄 (이제 누구나 쓸 수 있음)
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        search: filters.keyword,
        page: currentPage,
      };
      console.log("Booking API params:", params);

      const data = await adminBookingApi.getBookings(params);
      console.log("Booking API response:", data);

      setBookings(data.bookings || []);
      setTotalPages(data.totalPages || 1);
      setError(""); // 성공하면 에러 초기화
    } catch (err) {
      console.error("Fetch error:", err);
      // 에러 메시지 세팅
      setError(err.response?.data?.message || err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]); // 필터나 페이지 바뀌면 함수 새로고침

  // 🚨 [수정 2] useEffect에서는 그냥 부르기만 함
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // 🚨 [수정 3] 새로고침 버튼도 그냥 이거 쓰면 됨 (코드 중복 제거)
  const handleRefresh = () => {
    fetchBookings();
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // 필터 바뀌면 1페이지로
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
      await adminBookingApi.updateBookingStatus(bookingId, status);
      fetchBookings(); // 성공하면 목록 새로고침
    } catch (err) {
      alert(err.message || "상태 변경에 실패했습니다.");
    }
  };

  const handleCancel = async (bookingId) => {
    const reason = prompt("취소 사유를 입력하세요:");
    if (!reason) return;

    try {
      await adminBookingApi.cancelBooking(bookingId, reason);
      fetchBookings(); // 성공하면 목록 새로고침
    } catch (err) {
      alert(err.message || "취소에 실패했습니다.");
    }
  };

  if (loading) return <Loader fullScreen />;

  // 🚨 [수정 4] 이제 fetchBookings가 밖에 있으니까 에러 나도 안 튕김!
  if (error) return <ErrorMessage message={error} onRetry={fetchBookings} />;

  return (
    <div className="admin-booking-list-page">
      <div className="page-header">
        <h1>예약 관리</h1>
        <button className="btn-refresh" onClick={handleRefresh}>
          🔄 새로고침
        </button>
      </div>

      <AdminBookingFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      <AdminBookingTable
        bookings={bookings}
        onStatusChange={handleStatusChange}
        onCancel={handleCancel}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminBookingListPage;