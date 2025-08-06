// src/theme.ts
import { createTheme } from "@mui/material/styles";

const fontFamily = `'Inter', 'Helvetica', 'Arial', sans-serif`;

const theme = createTheme({
    typography: {
        fontFamily,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontFamily,
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },
    },
});

export default theme;
