import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import '../../styles/notices.scss';

const NoticeDetailPage = () => {
    const { noticeId } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const isAdmin = localStorage.getItem('userRole') === 'admin';
    useEffect(() => {
        if (noticeId === 'new') return;
        const fetchNoticeDetail = async () => {
            try {
                // ✅ 백엔드 라우터 '/api/notices/:id' 호출
                const response = await axiosInstance.get(`/notices/${noticeId}`);
                setNotice(response.data);
            } catch (error) {
                console.error('공지 상세 로딩 실패:', error);
                alert("존재하지 않거나 삭제된 공지입니다.");
                navigate('/admin/notices');
            } finally {
                setLoading(false);
            }
        };
        fetchNoticeDetail();
    }, [noticeId, navigate]);
    const handleDelete = async () => {
        if (!window.confirm("정말로 이 공지사항을 삭제하시겠습니까? \n(삭제 후 복구 불가)")) {
            return;
        }

        try {
            // 백엔드: router.delete('/:noticeId')
            await axiosInstance.delete(`/notices/${noticeId}`);
            alert("삭제되었습니다. 🗑️");
            navigate('/admin/notices'); // 목록으로 튕겨주기
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제에 실패했습니다. (콘솔 확인)");
        }
    };
    if (loading) return <div className="notice-container" style={{ textAlign: 'center' }}>로딩 중...</div>;
    if (!notice) return null;

    return (
        <div className="notice-container notice-detail-view">
            {/* 헤더 */}
            <div className="detail-header">
                <div className="title">{notice.title}</div>
                <div className="meta">
                    <span>👤 {notice.writer?.name || '관리자'}</span>
                    <span>📅 {new Date(notice.createdAt).toLocaleDateString()}</span>
                    <span>👁️ {notice.views || 0}</span>
                </div>
            </div>

            {/* 본문 */}
            <div className="detail-content">
                {notice.images && notice.images.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                        {notice.images.map((imgUrl, idx) => (
                            <img
                                key={idx}
                                src={imgUrl}
                                alt="공지"
                                style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '10px' }}
                            />
                        ))}
                    </div>
                )}
                {notice.content}
            </div>

            {/* 푸터 (버튼) */}
            <div className="detail-footer">
                <button
                    onClick={() => navigate('/admin/notices')}
                    className="btn btn-secondary"
                >
                    목록으로
                </button>

                {isAdmin && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => navigate(`/admin/notices/${noticeId}/edit`)}
                            className="btn btn-primary"
                        >
                            ✏️ 수정
                        </button>
                        <button
                            onClick={handleDelete}
                            className="btn btn-danger"
                        >
                            🗑️ 삭제
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoticeDetailPage;