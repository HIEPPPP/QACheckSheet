import { Layout } from "./layouts/Layout.tsx";
import { AppRoutes } from "./routes/AppRoutes.tsx";
import { RouterProvider } from "react-router-dom";

function App() {
    return (
        <Layout>
            <RouterProvider router={AppRoutes} />
        </Layout>
    );
}

export default App;
