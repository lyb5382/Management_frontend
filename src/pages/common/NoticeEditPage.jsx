import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import '../../styles/notices.scss';

const NoticeEditPage = () => {
    const { noticeId } = useParams(); // URL에서 ID 따오기
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isImportant, setIsImportant] = useState(false);
    const [loading, setLoading] = useState(true);

    // 1. 들어오자마자 기존 데이터 채워넣기!
    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const res = await axiosInstance.get(`/notices/${noticeId}`);
                const data = res.data;

                setTitle(data.title);
                setContent(data.content);
                setIsImportant(data.isImportant);
            } catch (error) {
                console.error("데이터 불러오기 실패:", error);
                alert("존재하지 않는 공지입니다.");
                navigate('/admin/notices');
            } finally {
                setLoading(false);
            }
        };
        fetchNotice();
    }, [noticeId, navigate]);

    // 2. 수정 완료 버튼 누르면 (PATCH 요청)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) return alert("제목과 내용을 입력해주세요.");

        try {
            await axiosInstance.patch(`/notices/${noticeId}`, {
                title,
                content,
                isImportant: String(isImportant) // 백엔드 스키마에 맞춰서
            });
            alert("수정 완료! 👌");
            navigate(`/admin/notices/${noticeId}`); // 상세 페이지로 복귀
        } catch (error) {
            console.error("수정 에러:", error);
            alert("수정 실패!");
        }
    };

    if (loading) return <div className="notice-container" style={{ textAlign: 'center' }}>로딩 중...</div>;

    return (
        <div className="notice-container">
            <h1>🛠️ 공지사항 수정</h1>

            <form onSubmit={handleSubmit} className="notice-form">
                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-group checkbox-group">
                    <input
                        type="checkbox"
                        id="edit-important"
                        checked={isImportant}
                        onChange={(e) => setIsImportant(e.target.checked)}
                    />
                    <label htmlFor="edit-important">📢 중요 공지</label>
                </div>

                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-secondary"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        수정 저장
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NoticeEditPage;