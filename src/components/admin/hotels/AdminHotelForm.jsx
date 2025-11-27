import { useState, useEffect } from "react";

const DEFAULT_FORM = {
  name: "",
  brand: "",
  partnerName: "",
  partnerEmail: "",
  partnerPhone: "",
  region: "",
  city: "",
  address: "",
  description: "",
  amenities: "",
  roomCount: "",
  averagePrice: "",
  status: "active",
  approvalStatus: "pending",
};

const STATUS_OPTIONS = [
  { value: "active", label: "활성" },
  { value: "inactive", label: "비활성" },
];

const APPROVAL_OPTIONS = [
  { value: "pending", label: "승인대기" },
  { value: "approved", label: "승인" },
  { value: "rejected", label: "거부" },
];

const AdminHotelForm = ({ hotel = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ ...DEFAULT_FORM, ...(hotel || {}) });

  useEffect(() => {
    if (!hotel) return;
    setFormData({ ...DEFAULT_FORM, ...hotel });
  }, [hotel]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...formData,
      roomCount: formData.roomCount ? Number(formData.roomCount) : 0,
      averagePrice: formData.averagePrice ? Number(formData.averagePrice) : 0,
      amenities: formData.amenities
        ? formData.amenities.split(",").map((item) => item.trim())
        : [],
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
        <label htmlFor="hotelName">호텔명</label>
        <input
          id="hotelName"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="호텔명을 입력하세요"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="hotelBrand">브랜드</label>
        <input
          id="hotelBrand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="브랜드명을 입력하세요"
        />
      </div>

      <div className="form-group">
        <label htmlFor="hotelDescription">소개</label>
        <textarea
          id="hotelDescription"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="호텔 소개를 입력하세요"
          rows={4}
        />
      </div>

      <h2>파트너 정보</h2>
      <div className="form-group">
        <label htmlFor="partnerName">파트너명</label>
        <input
          id="partnerName"
          name="partnerName"
          value={formData.partnerName}
          onChange={handleChange}
          placeholder="담당자 이름"
        />
      </div>

      <div className="form-group">
        <label htmlFor="partnerEmail">파트너 이메일</label>
        <input
          id="partnerEmail"
          name="partnerEmail"
          type="email"
          value={formData.partnerEmail}
          onChange={handleChange}
          placeholder="partner@example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="partnerPhone">파트너 연락처</label>
        <input
          id="partnerPhone"
          name="partnerPhone"
          value={formData.partnerPhone}
          onChange={handleChange}
          placeholder="010-0000-0000"
        />
      </div>

      <h2>운영 정보</h2>
      <div className="form-group">
        <label htmlFor="hotelRegion">지역</label>
        <input
          id="hotelRegion"
          name="region"
          value={formData.region}
          onChange={handleChange}
          placeholder="예: 서울"
        />
      </div>

      <div className="form-group">
        <label htmlFor="hotelCity">도시</label>
        <input
          id="hotelCity"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="예: 강남구"
        />
      </div>

      <div className="form-group">
        <label htmlFor="hotelAddress">주소</label>
        <input
          id="hotelAddress"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="상세 주소를 입력하세요"
        />
      </div>

      <div className="form-group">
        <label htmlFor="hotelAmenities">편의시설 (쉼표로 구분)</label>
        <input
          id="hotelAmenities"
          name="amenities"
          value={formData.amenities}
          onChange={handleChange}
          placeholder="예: Wi-Fi, 조식, 수영장"
        />
      </div>

      <div className="form-group">
        <label htmlFor="roomCount">객실 수</label>
        <input
          id="roomCount"
          name="roomCount"
          type="number"
          min="0"
          value={formData.roomCount}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="averagePrice">평균 요금 (원)</label>
        <input
          id="averagePrice"
          name="averagePrice"
          type="number"
          min="0"
          value={formData.averagePrice}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="hotelStatus">운영 상태</label>
        <select
          id="hotelStatus"
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

      <div className="form-group">
        <label htmlFor="approvalStatus">승인 상태</label>
        <select
          id="approvalStatus"
          name="approvalStatus"
          value={formData.approvalStatus}
          onChange={handleChange}
        >
          {APPROVAL_OPTIONS.map((option) => (
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

export default AdminHotelForm;

