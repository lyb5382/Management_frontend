import { Link } from "react-router-dom";
import EmptyState from "../../common/EmptyState";
import StatusBadge from "../../common/StatusBadge";

const STATUS_OPTIONS = [
  { value: "pending", label: "대기" },
  { value: "confirmed", label: "확정" },
  { value: "completed", label: "완료" },
  { value: "cancelled", label: "취소" },
];

const paymentStatusMap = {
  paid: "결제완료",
  pending: "결제대기",
  refunded: "환불완료",
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("ko-KR");
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "-";
  return `${Number(value).toLocaleString()}원`;
};

const AdminBookingTable = ({ bookings = [], onStatusChange, onCancel }) => {
  if (!bookings.length) {
    return (
      <EmptyState
        icon="📘"
        message="예약 데이터가 없습니다. 필터를 조정해보세요."
      />
    );
  }

  const renderActions = (booking) => {
    return (
      <div className="table-actions">
        <select
          className="status-select"
          value={booking?.status || ""}
          onChange={(event) =>
            onStatusChange?.(booking.id, event.target.value)
          }
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <Link
          to={`/admin/bookings/${booking?.id || ""}`}
          className="btn btn-outline"
        >
          상세보기
        </Link>

        <button
          type="button"
          className="btn btn-danger"
          disabled={booking?.status === "cancelled"}
          onClick={() => onCancel?.(booking.id)}
        >
          예약취소
        </button>
      </div>
    );
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>예약번호</th>
            <th>호텔</th>
            <th>고객</th>
            <th>체크인/아웃</th>
            <th>금액</th>
            <th>예약 상태</th>
            <th>결제 상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id || booking.code}>
              <td>{booking?.code || `#${booking?.id}`}</td>
              <td>
                <div className="table-title">
                  <div className="title">{booking?.hotelName || "-"}</div>
                  {booking?.roomType && (
                    <div className="subtitle">{booking.roomType}</div>
                  )}
                </div>
              </td>
              <td>
                <div className="table-title">
                  <div className="title">{booking?.guestName || "-"}</div>
                  {booking?.guestEmail && (
                    <div className="subtitle">{booking.guestEmail}</div>
                  )}
                </div>
              </td>
              <td>
                {booking?.checkIn} ~ {booking?.checkOut}
              </td>
              <td>{formatCurrency(booking?.totalAmount)}</td>
              <td>
                <StatusBadge status={booking?.status} type="booking" />
              </td>
              <td>
                {paymentStatusMap[booking.paymentStatus] ||
                  booking.paymentStatus}
              </td>
              <td>{renderActions(booking)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookingTable;
