import { Link } from "react-router-dom";
import EmptyState from "../../common/EmptyState";

const AdminHotelTable = ({ hotels = [], onDelete, onApprove, onReject }) => {
  // 🕵️‍♂️ 1. 신분 확인
  const userRole = localStorage.getItem('userRole');

  // 🚦 2. [핵심] 접속한 놈에 따라 '수정' 버튼 눌렀을 때 가는 길을 갈라준다!
  // 사장님(business)이면 -> /owner/my-hotel/...
  // 관리자(admin)면 -> /admin/hotels/...
  const linkPrefix = userRole === 'business' ? '/owner/my-hotel' : '/admin/hotels';

  // 데이터 없으면 텅~ 보여주기
  if (!hotels.length) {
    return <EmptyState icon="🏨" message="등록된 호텔이 없습니다." />;
  }

  const renderActions = (hotel) => {
    return (
      <div className="table-actions" style={{ display: 'flex', gap: '5px' }}>
        {/* ⭐ 관리자일 때만 승인/거부 버튼 노출 */}
        {userRole === 'admin' && (
          <>
            {hotel.approvalStatus === 'pending' && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => onApprove?.(hotel._id)}
                  style={{ backgroundColor: '#4f46e5', color: 'white' }}
                >
                  승인
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => onReject?.(hotel._id)}
                  style={{ borderColor: '#ef4444', color: '#ef4444' }}
                >
                  거부
                </button>
              </>
            )}
          </>
        )}

        {/* 👇 [수정] 여기가 하이라이트! 아까 만든 linkPrefix 변수 사용해서 주소 동적 생성 */}
        <Link
          to={`${linkPrefix}/${hotel._id}/edit`}
          className="btn btn-outline"
        >
          수정
        </Link>

        <button
          type="button"
          className="btn btn-outline"
          onClick={() => onDelete?.(hotel._id)}
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
            <th>승인상태</th> {/* 👈 상태 확인용 컬럼 */}
            <th>사업자</th>
            <th>주소</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel._id}>
              <td>
                <div style={{ fontWeight: 'bold' }}>{hotel.name || "-"}</div>
              </td>
              <td>
                {/* 🏷️ 상태 배지 (pending: 노랑, approved: 초록, rejected: 빨강) */}
                <span className={`badge status-${hotel.approvalStatus}`}>
                  {hotel.approvalStatus === 'pending' ? '⏳ 대기' :
                    hotel.approvalStatus === 'approved' ? '✅ 승인' : '❌ 거부'}
                </span>
              </td>
              <td>{hotel.business?.business_name || "-"}</td>
              <td>{hotel.address || "-"}</td>
              <td>{renderActions(hotel)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHotelTable;