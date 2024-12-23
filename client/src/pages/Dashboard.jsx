import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Container, Typography } from '@mui/material';

const Dashboard = () => {
  const { auth } = useContext(AuthContext);

  return (
    <Container maxWidth="md">
      <Typography
        variant="h2"
        component="h1"
        sx={{
          textAlign: 'center',
          mt: 8,
          mb: 4,
        }}
      >
        Dashboard
      </Typography>
      <Typography
        variant="body1"
        sx={{
          textAlign: 'center',
        }}
      >
        You are logged in as {auth.user.username}.
      </Typography>
    </Container>
  );
};

export default Dashboard;
