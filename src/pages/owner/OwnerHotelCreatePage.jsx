import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import '../../styles/owner-rooms.scss'

const OwnerHotelCreatePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 입력 데이터
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        star_rating: 3, // 기본 3성급
    });

    // 편의시설 (체크박스용)
    const [amenities, setAmenities] = useState([]);

    // 이미지 파일들 & 미리보기
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    // 편의시설 목록 (필요하면 더 추가해)
    const amenityOptions = [
        "와이파이", "수영장", "조식", "주차장", "헬스장",
        "스파", "루프탑", "회의실", "반려동물", "공항셔틀"
    ];

    // 1. 텍스트 입력 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 2. 편의시설 체크 핸들러
    const handleAmenityToggle = (item) => {
        if (amenities.includes(item)) {
            setAmenities(amenities.filter(a => a !== item));
        } else {
            setAmenities([...amenities, item]);
        }
    };

    // 3. 이미지 파일 선택 핸들러 (미리보기 생성)
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // 최대 10장 제한
        if (selectedFiles.length > 10) {
            alert("이미지는 최대 10장까지만 업로드 가능합니다.");
            return;
        }

        setFiles(selectedFiles);

        // 미리보기 URL 생성
        const filePreviews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviews(filePreviews);
    };

    // 4. 최종 전송 (호텔 생성 -> 이미지 업로드)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.address) {
            return alert("호텔 이름과 주소는 필수입니다.");
        }

        try {
            setLoading(true);

            // [Step 1] 호텔 기본 정보 생성 (JSON)
            // 백엔드: router.post('/hotels', ...)
            const hotelPayload = {
                ...formData,
                amenities_list: amenities, // 배열 그대로 전송
                star_rating: Number(formData.star_rating)
            };

            console.log("🚀 호텔 생성 요청:", hotelPayload);
            const createRes = await axiosInstance.post('/hotels', hotelPayload);
            const newHotelId = createRes.data._id; // 생성된 호텔 ID 받기

            console.log("🏨 호텔 생성 성공! ID:", newHotelId);

            // [Step 2] 이미지가 있다면 업로드 (FormData)
            // 백엔드: router.post('/hotels/:id/images', ...)
            if (files.length > 0) {
                const imageFormData = new FormData();
                files.forEach(file => {
                    imageFormData.append('hotelImages', file); // 백엔드 multer 설정 이름('hotelImages') 확인!
                });

                console.log("📸 이미지 업로드 시작...");
                await axiosInstance.post(`/hotels/${newHotelId}/images`, imageFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log("📸 이미지 업로드 완료!");
            }

            alert("호텔 등록이 완료되었습니다! 🎉");
            navigate('/owner/my-hotel'); // 등록 후 관리 페이지로 이동

        } catch (error) {
            console.error("호텔 등록 실패:", error);
            const errorMsg = error.response?.data?.message || "호텔 등록 중 오류가 발생했습니다.";
            alert(`등록 실패: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hotel-create-container">
            <h1>🏨 내 호텔 등록하기</h1>

            <form onSubmit={handleSubmit} className="hotel-form">

                {/* 1열: 호텔 이름 & 등급 */}
                <div className="form-row">
                    <div className="form-group">
                        <label>호텔 이름 <span>*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="예: W 호텔 서울"
                        />
                    </div>
                    <div className="form-group">
                        <label>호텔 등급 (성급)</label>
                        <select name="star_rating" value={formData.star_rating} onChange={handleChange}>
                            <option value="1">⭐ 1성급</option>
                            <option value="2">⭐⭐ 2성급</option>
                            <option value="3">⭐⭐⭐ 3성급</option>
                            <option value="4">⭐⭐⭐⭐ 4성급</option>
                            <option value="5">⭐⭐⭐⭐⭐ 5성급</option>
                        </select>
                    </div>
                </div>

                {/* 주소 */}
                <div className="form-group">
                    <label>호텔 주소 <span>*</span></label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="서울특별시 강남구..."
                    />
                </div>

                {/* 설명 */}
                <div className="form-group">
                    <label>소개글</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="우리 호텔만의 매력을 적어주세요."
                    />
                </div>

                {/* 편의시설 체크박스 */}
                <div className="form-group amenities-group">
                    <label>편의시설 선택</label>
                    <div className="amenities-grid">
                        {amenityOptions.map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    checked={amenities.includes(item)}
                                    onChange={() => handleAmenityToggle(item)}
                                />
                                {item}
                            </label>
                        ))}
                    </div>
                </div>

                {/* 이미지 업로드 */}
                <div className="form-group">
                    <label>호텔 이미지 (최대 10장)</label>
                    <div className="image-upload-section" onClick={() => document.getElementById('hotel-imgs').click()}>
                        <input
                            id="hotel-imgs"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <div className="upload-placeholder">
                            클릭하여 <span>이미지 파일</span>을 선택하세요.<br />
                            (또는 여기로 드래그)
                        </div>
                    </div>

                    {/* 미리보기 */}
                    {previews.length > 0 && (
                        <div className="image-previews">
                            {previews.map((src, idx) => (
                                <div key={idx} className="preview-box">
                                    <img src={src} alt={`preview-${idx}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 버튼 */}
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn-cancel"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading}
                    >
                        {loading ? '등록 중...' : '호텔 등록 완료'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default OwnerHotelCreatePage;