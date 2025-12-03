import { useState, useEffect } from "react";
import AdminReviewFilter from "../../components/admin/reviews/AdminReviewFilter";
import AdminReviewTable from "../../components/admin/reviews/AdminReviewTable";
import Pagination from "../../components/common/Pagination";
import adminReviewApi from "../../api/adminReviewApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminReviewListPage = () => {
  const [reviews, setReviews] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await adminReviewApi.getReviews({
        ...filters,
        page: currentPage,
      });
      setReviews(data.reviews || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchReviews();
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await adminReviewApi.deleteReview(reviewId);
      fetchReviews();
    } catch (err) {
      alert(err.message || "삭제에 실패했습니다.");
    }
  };

  const handleToggleVisibility = async (reviewId, currentStatus) => {
    try {
      const newStatus = currentStatus === "hidden" ? "published" : "hidden";
      await adminReviewApi.updateReviewStatus?.(reviewId, newStatus) || 
        Promise.resolve(); // fallback if not implemented in API
      fetchReviews();
    } catch (err) {
      alert(err.message || "상태 변경에 실패했습니다.");
    }
  };

  const handleReportAction = async (reviewId, action) => {
    try {
      let message = "신고 처리";
      if (action === "resolve") {
        message = "신고를 처리하시겠습니까?";
      } else if (action === "delete") {
        message = "신고를 삭제하시겠습니까?";
      }
      
      if (!confirm(message)) return;

      await adminReviewApi.handleReport(reviewId, action);
      fetchReviews();
    } catch (err) {
      alert(err.message || "신고 처리에 실패했습니다.");
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchReviews} />;

  return (
    <div className="admin-review-list-page">
      <div className="page-header">
        <h1>리뷰 관리</h1>
      </div>

      <AdminReviewFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      <AdminReviewTable 
        reviews={reviews} 
        onDelete={handleDelete}
        onToggleVisibility={handleToggleVisibility}
        onReportAction={handleReportAction}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminReviewListPage;
