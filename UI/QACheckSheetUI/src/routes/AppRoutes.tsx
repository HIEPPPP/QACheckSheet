import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import NotFoundPage from "../shared/components/NotFoundPage";
import DashboardPage from "../features/dashboard/DashboardPage";

export const AppRoutes = createBrowserRouter([
    {
        path: "/",
        element: <DashboardPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },

    { path: "*", element: <NotFoundPage /> },
]);
