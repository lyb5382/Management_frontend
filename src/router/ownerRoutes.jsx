import { Navigate } from "react-router-dom";
import OwnerLayout from "../components/layout/OwnerLayout"; // 아까 만든 레이아웃
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminHotelListPage from "../pages/admin/AdminHotelListPage";
import AdminBookingListPage from "../pages/admin/AdminBookingListPage";
import AdminReviewListPage from "../pages/admin/AdminReviewListPage";
import AdminMyProfilePage from "../pages/admin/AdminMyProfilePage";
import OwnerRoomPage from "../pages/owner/OwnerRoomPage";
import NoticeListPage from "../pages/common/NoticeListPage";
import NoticeDetailPage from "../pages/common/NoticeDetailPage";
import OwnerRoomCreatePage from "../pages/owner/OwnerRoomCreatePage"
import OwnerHotelCreatePage from "../pages/owner/OwnerHotelCreatePage";
import AdminHotelEditPage from "../pages/admin/AdminHotelEditPage";

const ownerRoutes = [
    {
        path: "/owner",
        element: <OwnerLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/owner/dashboard" replace />,
            },
            {
                path: "dashboard",
                element: <AdminDashboardPage />,
            },
            {
                path: "my-hotel",
                element: <AdminHotelListPage />,
            },
            {
                path: "my-hotel/new",
                element: <OwnerHotelCreatePage />,
            },
            {
                path: "my-hotel/:hotelId/edit",
                element: <AdminHotelEditPage />, // 관리자 수정 페이지 빌려 쓰기
            },
            {
                path: "rooms",
                element: <OwnerRoomPage />,
            },
            {
                path: "rooms/new",
                element: <OwnerRoomCreatePage />,
            },
            {
                path: "bookings",
                element: <AdminBookingListPage />,
            },
            {
                path: "reviews",
                element: <AdminReviewListPage />,
            },
            { path: "notices", element: <NoticeListPage /> },
            { path: "notices/:noticeId", element: <NoticeDetailPage /> },
            {
                path: "me",
                element: <AdminMyProfilePage />,
            },
        ],
    },
];

export default ownerRoutes;