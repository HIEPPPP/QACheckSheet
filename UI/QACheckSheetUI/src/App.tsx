import { Layout } from "./layouts/PrivateLayout.tsx";
import { AppRoutes } from "./routes/AppRoutes.tsx";
import { RouterProvider } from "react-router-dom";

function App() {
    return <RouterProvider router={AppRoutes} />;
}

export default App;
