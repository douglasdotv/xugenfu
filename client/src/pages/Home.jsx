import { Container, Typography } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Typography
        variant="h2"
        component="h1"
        sx={{
          textAlign: 'center',
          mt: 8,
        }}
      >
        Welcome to Xugenfu!
      </Typography>
    </Container>
  );
};

export default Home;
