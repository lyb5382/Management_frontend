import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import adminRoutes from "./router/adminRoutes";
import ownerRoutes from "./router/ownerRoutes"; // 👈 방금 만든 거 import!
import "./styles/index.scss";

function App() {
  // 두 라우트 배열을 합침
  const mergedRoutes = [...adminRoutes, ...ownerRoutes];

  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          {/* 기본 루트 접속 시 로그인 페이지로 보냄 */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* 합쳐진 라우트들을 맵핑 */}
          {mergedRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  index={child.index}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ))}
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;