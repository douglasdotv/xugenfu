import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#FF5722' },
    secondary: { main: '#2196F3' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          overflowX: 'hidden',
          overflowY: 'auto',
        },
        body: {
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          overflowX: 'hidden',
          background:
            'linear-gradient(135deg, rgb(220,220,226) 0%, #ffd9f4 100%)',
        },
        '::-webkit-scrollbar': {
          width: '12px',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: '#0A2A43',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#ED8A14',
          borderRadius: '6px',
          border: '2px solid #0A2A43',
        },
      },
    },
  },
});

export default theme;
