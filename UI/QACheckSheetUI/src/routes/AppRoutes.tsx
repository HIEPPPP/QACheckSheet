import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import NotFoundPage from "../shared/components/NotFoundPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import { PublicLayout } from "../layouts/PublicLayout";
import { RequireAuth } from "./RequireAuth";
import { PrivateLayout } from "../layouts/PrivateLayout";
import DeviceTypePage from "../features/mstDeviceType/DeviceTypePage";
import DevicePage from "../features/mstDevice/DevicePage";
import SheetPage from "../features/mstSheet/SheetPage";
import ItemPage from "../features/mstSheetItem/ItemPage";
import TypeSheetPage from "../features/mstTypeSheet/TypeSheetPage";
import CheckPage from "../features/check/CheckPage";
import ReportPage from "../features/report/ReportPage";
import NgDetailPage from "../features/ngDetail/NgDetailPage";
import UsersPage from "../features/users/UsersPage";
import ProfilePage from "../features/auth/ProfilePage";
import EditPage from "../features/editData/EditPage";

export const AppRoutes = createBrowserRouter([
    // PUBLIC routes (no sidebar/header)
    {
        path: "/",
        element: <PublicLayout />, // layout rỗng hoặc đơn giản
        children: [
            { index: true, element: <LoginPage /> },
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
            { path: "deviceType", element: <DeviceTypePage /> },
            { path: "device", element: <DevicePage /> },
            { path: "sheet", element: <SheetPage /> },
            { path: "item", element: <ItemPage /> },
            { path: "typeSheet", element: <TypeSheetPage /> },
            { path: "check/:code", element: <CheckPage /> },
            { path: "report", element: <ReportPage /> },
            { path: "ngDetail", element: <NgDetailPage /> },
            { path: "users", element: <UsersPage /> },
            { path: "profile", element: <ProfilePage /> },
            { path: "editData", element: <EditPage /> },
        ],
    },
]);
