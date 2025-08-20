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
        ],
    },
]);
