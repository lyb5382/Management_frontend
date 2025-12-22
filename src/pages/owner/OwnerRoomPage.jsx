import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import '../../styles/owner-rooms.scss'

const OwnerRoomPage = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyRooms();
    }, []);

    // 1. 객실 리스트 가져오기
    const fetchMyRooms = async () => {
        try {
            setLoading(true);
            const role = localStorage.getItem('userRole');
            let targetHotels = [];

            if (role === 'admin') {
                const res = await axiosInstance.get('/hotels');
                targetHotels = res.data;
            } else {
                const res = await axiosInstance.get('/hotels/my-hotels');
                targetHotels = res.data;
            }

            if (!targetHotels || targetHotels.length === 0) {
                setLoading(false);
                return;
            }

            const firstHotelId = targetHotels[0]._id;
            const roomRes = await axiosInstance.get(`/rooms/hotel/${firstHotelId}`);
            setRooms(roomRes.data);

        } catch (error) {
            console.error("데이터 로딩 실패:", error);
            // 테스트 데이터 유지
            setRooms([
                { _id: '1', roomNumber: '101', type: 'Standard', price: 100000, status: 'AVAILABLE' },
                { _id: '2', roomNumber: '102', type: 'Deluxe', price: 150000, status: 'OCCUPIED' },
                { _id: '3', roomNumber: '201', type: 'Suite', price: 250000, status: 'CLEANING' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // 2. 상태 변경
    const handleStatusChange = async (roomId, newStatus) => {
        try {
            await axiosInstance.patch(`/rooms/${roomId}/status`, { status: newStatus });
            setRooms(prevRooms =>
                prevRooms.map(room =>
                    room._id === roomId ? { ...room, status: newStatus } : room
                )
            );
        } catch (error) {
            console.error("상태 변경 에러:", error);
            alert("상태 변경 실패");
        }
    };

    // 3. [수정] SCSS 클래스 이름 반환
    const getStatusClass = (status) => {
        switch (status) {
            case 'AVAILABLE': return 'status-available';
            case 'OCCUPIED': return 'status-occupied';
            case 'CLEANING': return 'status-cleaning';
            case 'MAINTENANCE': return 'status-maintenance';
            default: return '';
        }
    };

    return (
        <div className="room-container"> {/* 메인 컨테이너 */}

            {/* 헤더 */}
            <div className="page-header">
                <h2>🛏️ 객실 관리</h2>
                <button
                    onClick={() => navigate("/owner/rooms/new")}
                    className="btn-add"
                >
                    + 객실 추가
                </button>
            </div>

            {/* 테이블 */}
            <div className="room-table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th width="15%">호수</th>
                            <th width="20%">객실 타입</th>
                            <th width="20%">1박 요금</th>
                            <th>상태 (변경가능)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="state-message">로딩 중...</td></tr>
                        ) : rooms.length === 0 ? (
                            <tr><td colSpan="4" className="state-message">등록된 객실이 없습니다.</td></tr>
                        ) : (
                            rooms.map((room) => (
                                <tr key={room._id}>
                                    <td className="room-number">{room.roomNumber}호</td>
                                    <td>{room.type}</td>
                                    <td className="room-price">{room.price.toLocaleString()}원</td>
                                    <td>
                                        {/* 👇 상태 변경 드롭다운 */}
                                        <select
                                            value={room.status}
                                            onChange={(e) => handleStatusChange(room._id, e.target.value)}
                                            className={`status-select ${getStatusClass(room.status)}`}
                                        >
                                            <option value="AVAILABLE">🟢 공실 (예약가능)</option>
                                            <option value="OCCUPIED">🔵 투숙중</option>
                                            <option value="CLEANING">🔴 청소중</option>
                                            <option value="MAINTENANCE">🔧 수리중</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OwnerRoomPage;