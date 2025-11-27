import { useState, useEffect, useRef } from "react";

const DEFAULT_FORM = {
  name: "",
  description: "",
  code: "",
  type: "percent",
  discountValue: "",
  minOrderAmount: "",
  startDate: "",
  endDate: "",
  usageLimit: "",
  status: "active",
};

const STATUS_OPTIONS = [
  { value: "active", label: "사용중" },
  { value: "scheduled", label: "예약됨" },
  { value: "paused", label: "중단" },
  { value: "expired", label: "만료" },
];

const AdminCouponForm = ({ coupon = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ ...DEFAULT_FORM, ...(coupon || {}) });
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (!coupon) return;
    setFormData({ ...DEFAULT_FORM, ...coupon });
  }, [coupon]);

  // removed auto-focus effect to avoid possible render loops in strict/dev mode

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...formData,
      discountValue: formData.discountValue
        ? Number(formData.discountValue)
        : 0,
      minOrderAmount: formData.minOrderAmount
        ? Number(formData.minOrderAmount)
        : 0,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
    };
    onSubmit?.(payload);
  };

  const handleReset = () => {
    setFormData({ ...DEFAULT_FORM });
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>기본 정보</h2>
      <div className="form-group">
        <label htmlFor="couponName">쿠폰명</label>
        <input
          id="couponName"
          name="name"
          ref={firstInputRef}
          value={formData.name}
          onChange={handleChange}
          placeholder="쿠폰 이름을 입력하세요"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="couponDescription">설명</label>
        <textarea
          id="couponDescription"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="쿠폰 설명을 입력하세요"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="couponCode">쿠폰 코드</label>
        <input
          id="couponCode"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="예: SUMMER10"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="couponType">할인 유형</label>
        <select
          id="couponType"
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="percent">정율(%)</option>
          <option value="amount">정액(원)</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="discountValue">할인 값</label>
        <input
          id="discountValue"
          name="discountValue"
          type="number"
          min="0"
          value={formData.discountValue}
          onChange={handleChange}
          placeholder={
            formData.type === "percent" ? "할인율(%)" : "할인액(원)"
          }
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="minOrderAmount">최소 주문금액 (원)</label>
        <input
          id="minOrderAmount"
          name="minOrderAmount"
          type="number"
          min="0"
          value={formData.minOrderAmount}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>사용 기간</label>
        <div className="date-range">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          <span>~</span>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="usageLimit">총 발급 수량</label>
        <input
          id="usageLimit"
          name="usageLimit"
          type="number"
          min="0"
          value={formData.usageLimit ?? ""}
          onChange={handleChange}
          placeholder="제한이 없다면 비워두세요"
        />
      </div>

      <div className="form-group">
        <label htmlFor="couponStatus">상태</label>
        <select
          id="couponStatus"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={handleReset}>
          되돌리기
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            취소
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          저장
        </button>
      </div>
    </form>
  );
};

export default AdminCouponForm;