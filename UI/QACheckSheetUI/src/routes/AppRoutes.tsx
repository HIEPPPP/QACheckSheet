import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import NotFoundPage from "../shared/components/NotFoundPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import { PublicLayout } from "../layouts/PublicLayout";
import { RequireAuth } from "./RequireAuth";
import { PrivateLayout } from "../layouts/PrivateLayout";

export const AppRoutes = createBrowserRouter([
    // PUBLIC routes (no sidebar/header)
    {
        path: "/",
        element: <PublicLayout />, // layout rỗng hoặc đơn giản
        children: [
            { path: "login", element: <LoginPage /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },

    // PRIVATE routes (có sidebar/header)
    {
        path: "/app",
        element: (
            <RequireAuth>
                <PrivateLayout />
            </RequireAuth>
        ), // bảo vệ
        children: [
            { index: true, element: <DashboardPage /> },
            { path: "dashboard", element: <DashboardPage /> },
            // more routes
        ],
    },
]);
