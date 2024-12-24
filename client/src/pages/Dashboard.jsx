import { Link as RouterLink } from 'react-router-dom';
import { Container, Link as MuiLink } from '@mui/material';

const Dashboard = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
      }}
    >
      <MuiLink
        component={RouterLink}
        to="/leagues/active"
        sx={{
          color: '#1976d2',
          textDecoration: 'none',
          fontSize: '1.2rem',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        View Active League
      </MuiLink>
    </Container>
  );
};

export default Dashboard;
