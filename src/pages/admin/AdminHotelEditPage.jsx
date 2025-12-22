import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminHotelForm from "../../components/admin/hotels/AdminHotelForm";
import adminHotelApi from "../../api/adminHotelApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminHotelEditPage = () => {
  const userRole = localStorage.getItem('userRole');
  // 돌아갈 목록 페이지 주소 결정
  const listPath = userRole === 'business' ? '/owner/my-hotel' : '/admin/hotels';
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHotel();
  }, [hotelId]);

  const fetchHotel = async () => {
    try {
      setLoading(true);
      // 🕵️‍♂️ [체크] api에 getHotelById가 없으면 getHotelDetail로 이름 맞춰!
      const data = await adminHotelApi.getHotelById(hotelId);
      setHotel(data);
    } catch (err) {
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 1. 승인/거부 핸들러 (아까 만든 API 활용)
  const handleStatusUpdate = async (newStatus) => {
    const actionName = newStatus === 'approved' ? '승인' : '거부';
    if (!window.confirm(`이 호텔을 ${actionName}하시겠습니까?`)) return;

    try {
      await adminHotelApi.updateHotelStatus(hotelId, newStatus);
      alert(`${actionName} 처리가 완료되었습니다.`);
      fetchHotel(); // 최신 데이터로 리로드
    } catch (err) {
      alert(err.message || "상태 변경 실패");
    }
  };

  // ✅ 2. 운영 상태(Active/Inactive) 토글 핸들러
  const handleToggleActive = async () => {
    const newActiveState = hotel.status === 'active' ? 'inactive' : 'active';
    try {
      // 일반 수정 API 재활용 (status만 실어서 보냄)
      await adminHotelApi.updateHotel(hotelId, { status: newActiveState });
      alert(`운영 상태가 ${newActiveState === 'active' ? '활성' : '비활성'}으로 변경되었습니다.`);
      fetchHotel();
    } catch (err) {
      alert("운영 상태 변경 실패");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await adminHotelApi.updateHotel(hotelId, formData);
      alert("수정 완료!");
      navigate(listPath); // 👈 동적으로 이동!
    } catch (err) {
      alert("실패");
    }
  };

  const handleCancel = () => {
    navigate(listPath); // 👈 여기도 동적으로!
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchHotel} />;

  return (
    <div className="admin-hotel-edit-page">
      <div className="page-header flex justify-between items-center">
        <h1>호텔 정보 수정</h1>
        <div className="status-badges flex gap-2">
          {/* 현재 상태 표시 배지 */}
          <span className={`badge status-${hotel.approvalStatus}`}>
            {hotel.approvalStatus === 'pending' ? '⏳ 대기' :
              hotel.approvalStatus === 'approved' ? '✅ 승인됨' : '❌ 거절됨'}
          </span>
          <span className={`badge ${hotel.status === 'active' ? 'bg-green-500' : 'bg-gray-500'} text-white px-2 py-1 rounded text-sm`}>
            {hotel.status === 'active' ? '운영 중' : '중지됨'}
          </span>
        </div>
      </div>

      {/* 👑 관리자 전용 퀵 액션 바 */}
      {userRole === 'admin' && (
        <div className="admin-action-bar bg-slate-100 p-4 rounded-lg mb-6 flex items-center justify-between border-2 border-indigo-200">
          <div className="text-sm font-bold text-slate-700">관리자 전용 퀵 컨트롤 :</div>
          <div className="flex gap-2">
            {hotel?.approvalStatus !== 'approved' && (
              <button onClick={() => handleStatusUpdate('approved')} className="bg-indigo-600 text-white px-4 py-2 rounded font-bold hover:bg-indigo-700">승인하기</button>
            )}
            {hotel?.approvalStatus !== 'rejected' && (
              <button onClick={() => handleStatusUpdate('rejected')} className="bg-rose-500 text-white px-4 py-2 rounded font-bold hover:bg-rose-700">거부하기</button>
            )}
            <button onClick={handleToggleActive} className="border-2 border-slate-400 px-4 py-2 rounded font-bold hover:bg-slate-200">
              {hotel?.status === 'active' ? '🚫 운영 중지' : '🚀 운영 재개'}
            </button>
          </div>
        </div>
      )}

      <AdminHotelForm
        hotel={hotel}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AdminHotelEditPage;