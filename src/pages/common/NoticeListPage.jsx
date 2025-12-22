import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import '../../styles/notices.scss';

const NoticeListPage = () => {
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchNotices();
        checkRole();
    }, []);

    // 관리자 여부 확인 (글쓰기 버튼용)
    const checkRole = () => {
        const role = localStorage.getItem('userRole');
        setIsAdmin(role === 'admin');
    };

    const fetchNotices = async () => {
        try {
            const response = await axiosInstance.get('/notices');

            // 👇 [디버깅용] 일단 콘솔에 찍어봐. 백엔드가 뭘 보냈는지 눈으로 봐야지!
            console.log("🔥 공지사항 데이터 원본:", response.data);

            // 👇 [수정 핵심] 무조건 배열만 들어가게 방어 코드 작성
            // 1. 그냥 배열로 왔으면 그대로 씀
            if (Array.isArray(response.data)) {
                setNotices(response.data);
            }
            // 2. 만약 { data: [...] } 형태로 왔으면 .data를 꺼냄
            else if (response.data.data && Array.isArray(response.data.data)) {
                setNotices(response.data.data);
            }
            // 3. 만약 { notices: [...] } 형태로 왔으면 .notices를 꺼냄
            else if (response.data.notices && Array.isArray(response.data.notices)) {
                setNotices(response.data.notices);
            }
            // 4. 에라이 모르겠다, 이상한 거면 빈 배열 [] 넣어! (에러 방지)
            else {
                console.error("데이터 형식이 배열이 아님!", response.data);
                setNotices([]);
            }

        } catch (error) {
            console.error('공지사항 로딩 실패:', error);
            setNotices([]); // 에러나도 빈 배열로 초기화해야 map 에러 안 남
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="notice-container">
            <h1>
                📢 공지사항
                {isAdmin && (
                    <button
                        onClick={() => navigate('/admin/notices/new')}
                        className="btn btn-primary" // 👈 버튼 스타일 적용
                    >
                        ✏️ 글쓰기
                    </button>
                )}
            </h1>

            <div className="notice-table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}>No.</th>
                            <th>제목</th>
                            <th style={{ width: '120px' }}>작성자</th>
                            <th style={{ width: '120px' }}>작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>로딩 중...</td></tr>
                        ) : notices.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>등록된 공지사항이 없습니다.</td></tr>
                        ) : (
                            notices.map((notice, index) => (
                                <tr
                                    key={notice._id}
                                    onClick={() => navigate(`/admin/notices/${notice._id}`)}
                                >
                                    <td>{index + 1}</td>
                                    <td style={{ fontWeight: 'bold' }}>
                                        {notice.title}
                                        {notice.images && notice.images.length > 0 && <span style={{ marginLeft: '5px' }}>📷</span>}
                                    </td>
                                    <td>{notice.writer?.name || '관리자'}</td>
                                    <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NoticeListPage;