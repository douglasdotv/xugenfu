import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#FF5722' },
    secondary: { main: '#2196F3' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'linear-gradient(135deg,rgb(220, 220, 226) 0%, #ffd9f4 100%)',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

export default theme;
