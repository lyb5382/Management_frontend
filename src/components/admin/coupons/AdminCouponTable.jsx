import { Link } from "react-router-dom";
import EmptyState from "../../common/EmptyState";
import StatusBadge from "../../common/StatusBadge";

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

// 🚨 [수정] 백엔드 필드명(discountType)에 맞게 수정
const formatDiscount = (coupon) => {
  if (!coupon) return "-";
  // 백엔드는 'percentage' 라고 저장함
  if (coupon.discountType === "percentage") {
    return `${coupon.discountValue || 0}%`;
  }
  return formatCurrency(coupon.discountValue);
};

const AdminCouponTable = ({ coupons = [], onDelete, onToggleStatus }) => {
  if (!coupons.length) {
    return (
      <EmptyState
        icon="🎟️"
        message="등록된 쿠폰이 없습니다. 새 쿠폰을 생성해보세요."
      />
    );
  }

  const renderActions = (coupon) => {
    return (
      <div className="table-actions">
        {/* 🚨 [수정] id -> _id */}
        <Link
          to={`/admin/coupons/${coupon?._id || ""}/edit`}
          className="btn btn-outline"
        >
          수정
        </Link>

        {/* 🚨 [수정] status -> isActive (Boolean) 처리 */}
        {/* (백엔드에 토글 API가 아직 없다면 이 버튼은 에러 날 수 있음) */}
        {/*
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onToggleStatus?.(coupon._id, !coupon.isActive)}
        >
          {coupon?.isActive ? "중단" : "활성화"}
        </button>
        */}

        <button
          type="button"
          className="btn btn-danger"
          // 🚨 [수정] id -> _id
          onClick={() => onDelete?.(coupon._id)}
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
            <th>쿠폰명</th>
            <th>코드</th>
            <th>유형</th>
            <th>할인값</th>
            {/* 백엔드에 최소주문금액 없어서 일단 숨김 (필요하면 모델 추가) */}
            {/* <th>최소 주문금액</th> */}
            <th>유효 기간</th>
            <th>발행량</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            // 🚨 [수정] 키값 _id로 변경
            <tr key={coupon._id}>
              <td>
                <div className="table-title">
                  <div className="title">{coupon?.name || "-"}</div>
                  {/* 설명 필드 없으면 뺌 */}
                </div>
              </td>
              <td style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                {coupon?.code || "-"}
              </td>
              
              {/* 🚨 [수정] discountType 체크 */}
              <td>{coupon?.discountType === "percentage" ? "정률(%)" : "정액(₩)"}</td>
              
              <td>{formatDiscount(coupon)}</td>
              
              {/* <td>{formatCurrency(coupon?.minOrderAmount)}</td> */}
              
              {/* 🚨 [수정] validUntil 체크 */}
              <td>
                ~ {formatDate(coupon?.validUntil)}
              </td>
              
              {/* 🚨 [수정] totalQuantity (사용량은 아직 카운팅 안 함) */}
              <td>
                {coupon?.totalQuantity
                  ? `${coupon.totalQuantity.toLocaleString()}개`
                  : "무제한"}
              </td>
              
              {/* 🚨 [수정] isActive Boolean -> String 변환 */}
              <td>
                <StatusBadge 
                    status={coupon?.isActive ? "active" : "inactive"} 
                    type="coupon" 
                />
              </td>
              
              <td>{renderActions(coupon)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCouponTable;