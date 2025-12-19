import { Navigate } from "react-router-dom";
import OwnerLayout from "../components/layout/OwnerLayout"; // 아까 만든 레이아웃
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminHotelListPage from "../pages/admin/AdminHotelListPage";
import AdminBookingListPage from "../pages/admin/AdminBookingListPage";
import AdminReviewListPage from "../pages/admin/AdminReviewListPage";
import AdminMyProfilePage from "../pages/admin/AdminMyProfilePage";

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
                path: "rooms",
                element: <AdminHotelListPage />,
            },
            {
                path: "bookings",
                element: <AdminBookingListPage />,
            },
            {
                path: "reviews",
                element: <AdminReviewListPage />,
            },
            {
                path: "me",
                element: <AdminMyProfilePage />,
            },
        ],
    },
];

export default ownerRoutes;