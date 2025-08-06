import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./utils/theme.ts";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </StrictMode>
);
