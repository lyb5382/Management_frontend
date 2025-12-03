import { Link } from "react-router-dom";
import EmptyState from "../../common/EmptyState";
import StatusBadge from "../../common/StatusBadge";

const STATUS_OPTIONS = [
  { value: "pending", label: "대기" },
  { value: "confirmed", label: "확정" },
  { value: "completed", label: "완료" },
  { value: "cancelled", label: "취소" },
];

// (결제 상태는 Booking 모델에 없어서 일단 뺌. 필요하면 Payment API 따로 찔러야 함)
/*
const paymentStatusMap = {
  paid: "결제완료",
  pending: "결제대기",
  refunded: "환불완료",
};
*/

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
            onStatusChange?.(booking._id, event.target.value)
          }
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* 🚨 [수정] 상세보기 링크 ID 수정 */}
        {/* (관리자용 예약 상세 페이지가 없다면 이 버튼은 에러 날 수 있음. 일단 둠) */}
        {/* <Link
          to={`/admin/bookings/${booking?._id || ""}`} 
          className="btn btn-outline"
        >
          상세보기
        </Link>
        */}

        <button
          type="button"
          className="btn btn-danger"
          disabled={booking?.status === "cancelled"}
          onClick={() => onCancel?.(booking._id)}
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
            <th>호텔/객실</th>
            <th>고객</th>
            <th>체크인/아웃</th>
            <th>금액</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>
                {/* ID가 너무 기니까 앞 8자리만 잘라서 보여줌 (선택) */}
                <span title={booking._id}>#{booking._id.substring(0, 8)}</span>
              </td>
              <td>
                <div className="table-title">
                  <div className="title">{booking.hotel?.name || "-"}</div>
                  {booking.room?.name && (
                    <div className="subtitle">{booking.room.name}</div>
                  )}
                </div>
              </td>
              <td>
                <div className="table-title">
                  <div className="title">{booking.user?.name || "-"}</div>
                  {booking.user?.email && (
                    <div className="subtitle">{booking.user.email}</div>
                  )}
                </div>
              </td>
              <td>
                {formatDate(booking.checkIn)} ~ {formatDate(booking.checkOut)}
              </td>
              <td>{formatCurrency(booking.totalPrice)}</td>
              <td>
                <StatusBadge status={booking?.status} type="booking" />
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