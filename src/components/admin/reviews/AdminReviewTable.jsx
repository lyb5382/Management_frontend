import { Link } from "react-router-dom";
import EmptyState from "../../common/EmptyState";
import StatusBadge from "../../common/StatusBadge";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("ko-KR");
};

const renderRating = (rating) => {
  if (!rating) return "-";
  const stars = Math.round(rating);
  return (
    <span className="rating">
      {"★".repeat(stars)}
      {"☆".repeat(5 - stars)}
      <span className="rating-score">({Number(rating).toFixed(1)})</span>
    </span>
  );
};

const truncateText = (text, limit = 80) => {
  if (!text) return "-";
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}...`;
};

const AdminReviewTable = ({
  reviews = [],
  onDelete,
  onReportAction,
  onToggleVisibility,
}) => {
  if (!reviews.length) {
    return (
      <EmptyState
        icon="💬"
        message="등록된 리뷰가 없습니다. 필터를 변경해보세요."
      />
    );
  }

  const renderActions = (review) => {
    return (
      <div className="table-actions">
        <Link
          to={`/admin/reviews/${review?.id || ""}`}
          className="btn btn-outline"
        >
          상세보기
        </Link>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onToggleVisibility?.(review.id, review.status)}
        >
          {review?.status === "hidden" ? "노출 전환" : "숨기기"}
        </button>

        {review?.reportCount > 0 && (
          <>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onReportAction?.(review.id, "resolve")}
            >
              신고 처리
            </button>
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => onReportAction?.(review.id, "delete")}
            >
              신고삭제
            </button>
          </>
        )}

        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onDelete?.(review.id)}
        >
          삭제
        </button>
      </div>
    );
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>리뷰</th>
            <th>고객</th>
            <th>평점</th>
            <th>신고</th>
            <th>상태</th>
            <th>작성일</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td>
                <div className="table-title">
                  <div className="title">{review?.hotelName || "-"}</div>
                  <div className="subtitle">
                    {truncateText(review?.content || review?.title)}
                  </div>
                </div>
              </td>
              <td>
                <div className="table-title">
                  <div className="title">{review?.guestName || "-"}</div>
                  {review?.guestEmail && (
                    <div className="subtitle">{review.guestEmail}</div>
                  )}
                </div>
              </td>
              <td>{renderRating(review?.rating)}</td>
              <td>
                {review?.reportCount
                  ? `${review.reportCount}건`
                  : review?.reportStatus === "resolved"
                  ? "처리완료"
                  : "-"}
              </td>
              <td>
                <StatusBadge status={review?.status} type="review" />
              </td>
              <td>{formatDate(review?.createdAt)}</td>
              <td>{renderActions(review)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReviewTable;