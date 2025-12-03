import { Link } from "react-router-dom";
import EmptyState from "../../common/EmptyState";
import StatusBadge from "../../common/StatusBadge";

// 날짜 포맷 함수
const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("ko-KR");
};

// 금액 포맷 함수 (필요하면 쓰고, 없으면 걍 둠)
const formatCurrency = (value) => {
  if (value === undefined || value === null) return "-";
  return `${Number(value).toLocaleString()}원`;
};

const AdminHotelTable = ({ hotels = [], onDelete }) => {
  if (!hotels.length) {
    return (
      <EmptyState
        icon="🏨"
        message="등록된 호텔이 없습니다."
      />
    );
  }

  const renderActions = (hotel) => {
    return (
      <div className="table-actions">
        <Link
          to={`/admin/hotels/${hotel._id}/edit`} // 🚨 id -> _id 로 변경
          className="btn btn-outline"
        >
          수정
        </Link>

        <button
          type="button"
          className="btn btn-outline"
          onClick={() => onDelete?.(hotel._id)} // 🚨 id -> _id 로 변경
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
            <th>호텔명</th>
            <th>사업자</th>
            <th>주소</th>
            <th>등급</th>
            <th>등록일</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel._id}>
              <td>
                <div className="table-title">
                  <div className="title">{hotel.name || "-"}</div>
                  {hotel.description && (
                    <div className="subtitle" style={{fontSize: '12px', color: '#888'}}>
                      {hotel.description.substring(0, 20)}...
                    </div>
                  )}
                </div>
              </td>
              
              <td>{hotel.business?.business_name || hotel.business || "-"}</td>
              
              <td>{hotel.address || "-"}</td>
              
              <td>{hotel.star_rating ? `⭐ ${hotel.star_rating}` : "-"}</td>
              
              <td>{formatDate(hotel.createdAt)}</td>
              
              <td>{renderActions(hotel)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHotelTable;