import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminHotelApi from "../../api/adminHotelApi"; // 호텔 목록 불러오기용
import axiosInstance from "../../api/axiosConfig"; // 방 생성용 (API 파일 따로 없으면 직접 호출)
import Loader from "../../components/common/Loader";

const OwnerRoomCreatePage = () => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]); // 내 호텔 목록
    const [loading, setLoading] = useState(true);

    // 폼 데이터
    const [formData, setFormData] = useState({
        hotelId: "",
        name: "",
        price: "",
        capacity: 2,
        stock: 1, // 👈 [추가] 기본값 1개로 설정
        description: "",
    });

    // 1. 페이지 열리자마자 '내 호텔 목록' 가져오기
    useEffect(() => {
        fetchMyHotels();
    }, []);

    const fetchMyHotels = async () => {
        try {
            const data = await adminHotelApi.getHotels();
            const myHotels = data.hotels || [];
            setHotels(myHotels);
            if (myHotels.length === 0) {
                alert("등록된 호텔이 없습니다. 호텔을 먼저 등록해주세요!");
                navigate("/owner/my-hotel/new");
                return;
            }
            if (myHotels.length === 1) {
                setFormData((prev) => ({ ...prev, hotelId: myHotels[0]._id }));
            }
        } catch (err) {
            alert("호텔 정보를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.hotelId) return alert("호텔을 선택해주세요!");

        try {
            await axiosInstance.post("/rooms", {
                hotelId: formData.hotelId, // 아까 고친 hotelId
                name: formData.name,
                price: Number(formData.price),
                capacity: Number(formData.capacity),

                // 👇 [핵심 추가] 백엔드가 애타게 찾는 'stock' 여기 있다!
                stock: Number(formData.stock),

                description: formData.description,
            });

            alert("객실이 등록되었습니다! 🎉");
            navigate("/owner/rooms");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "객실 등록 실패");
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">새 객실 등록</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* 호텔 선택 (기존 동일) */}
                <div className="form-group">
                    <label className="block mb-1 font-bold">호텔 선택</label>
                    <select
                        name="hotelId"
                        value={formData.hotelId}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                        disabled={hotels.length === 1}
                    >
                        <option value="">-- 호텔을 선택하세요 --</option>
                        {hotels.map((hotel) => (
                            <option key={hotel._id} value={hotel._id}>
                                {hotel.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 객실명 (기존 동일) */}
                <div className="form-group">
                    <label className="block mb-1 font-bold">객실명 (예: 디럭스 룸)</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {/* 가격 & 인원 & 재고(Stock) 입력칸 */}
                <div className="grid grid-cols-3 gap-4"> {/* 👈 2칸에서 3칸으로 변경 */}
                    <div className="form-group">
                        <label className="block mb-1 font-bold">1박 요금 (원)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="block mb-1 font-bold">최대 인원</label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    {/* 👇 [추가] 재고 입력 필드 */}
                    <div className="form-group">
                        <label className="block mb-1 font-bold text-blue-600">보유 객실 수 (재고)</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full p-2 border border-blue-300 rounded focus:border-blue-500"
                            required
                            min="1"
                            placeholder="예: 5"
                        />
                    </div>
                </div>

                {/* 설명 (기존 동일) */}
                <div className="form-group">
                    <label className="block mb-1 font-bold">객실 설명</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded h-32"
                    ></textarea>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        객실 등록 완료
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OwnerRoomCreatePage;