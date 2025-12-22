import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import '../../styles/notices.scss';

const NoticeWritePage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isImportant, setIsImportant] = useState(false);
    // 이미지 파일 상태 (필요하면 추가)
    // const [files, setFiles] = useState([]); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        try {
            // 백엔드가 req.body로 받으니까 그대로 쏴줌
            await axiosInstance.post('/notices', {
                title,
                content,
                isImportant: String(isImportant) // 혹은 boolean 그대로 (백엔드 로직 따라)
            });
            alert("공지사항이 등록되었습니다! 🎉");
            navigate('/admin/notices'); // 목록으로 이동
        } catch (error) {
            console.error(error);
            alert("등록 실패!");
        }
    };

    return (
        <div className="notice-container">
            <h1>✏️ 공지사항 글쓰기</h1>

            <form onSubmit={handleSubmit} className="notice-form">
                {/* 제목 */}
                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                    />
                </div>

                {/* 중요 공지 체크박스 */}
                <div className="form-group checkbox-group">
                    <input
                        type="checkbox"
                        id="important"
                        checked={isImportant}
                        onChange={(e) => setIsImportant(e.target.checked)}
                    />
                    <label htmlFor="important">📢 중요 공지로 등록</label>
                </div>

                {/* 내용 */}
                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="공지 내용을 작성하세요"
                    />
                </div>

                {/* 버튼 */}
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
                        등록하기
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NoticeWritePage;