import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import authApi from "../../api/adminAuthApi";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. 로그인 요청
      const response = await authApi.login(formData);

      // 2. 데이터 꺼내기 (여기는 .data 붙이는 거 잊지 말고!)
      const { user, token } = response.data;

      // 3. 토큰 저장
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userRole', user.role); // 기왕이면 역할도 저장해두자

      // 🚨 4. [수정] navigate 대신 이걸 써! (강제 새로고침 효과)
      // 이렇게 하면 앱이 새로 시작되면서 토큰을 읽고 "로그인 됨" 상태로 변함
      if (user.role === 'admin') {
        window.location.replace('/admin/dashboard');
      } else if (user.role === 'business') {
        window.location.replace('/owner/dashboard');
      } else {
        alert("접근 권한이 없습니다.");
        window.location.replace('/');
      }

    } catch (err) {
      console.error(err);
      setError("로그인에 실패했습니다.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>관리자 및 파트너 로그인</h2>

        {/* 👇 개발용 샘플 계정 안내 (박사장 추가함) */}
        <div className="sample-account-info" style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem", color: "#555" }}>
          <p style={{ fontWeight: "bold", marginBottom: "5px" }}>📌 테스트 계정 정보</p>
          <div style={{ marginBottom: "8px" }}>
            <span style={{ fontWeight: "bold", color: "#d32f2f" }}>[관리자]</span><br />
            ID: admin@hotel.com <br />
            PW: admin1234
          </div>
          <div>
            <span style={{ fontWeight: "bold", color: "#1976d2" }}>[사업자]</span><br />
            ID: owner@hotelhub.com <br />
            PW: password123
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", padding: "10px", marginTop: "10px" }}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
