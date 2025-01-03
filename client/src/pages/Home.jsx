import { Container, Typography, Box, keyframes } from '@mui/material';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Home = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          p: 3,
          background: 'black',
          border: '2px solid #fff',
          borderRadius: 2,
          boxShadow: '0 0 20px #ff8ad8',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            mb: 4,
            color: '#fff',
            fontFamily: 'monospace',
            textShadow: '0 0 10px #fff, 0 0 20px #f0f, 0 0 30px #0ff',
          }}
        >
          ≮王者归来≯
        </Typography>
        <Box
          component="img"
          src="https://www.managerzone.com/dynimg/pic.php?type=federation&fid=63&size=small&sport=soccer"
          alt="Return of the King Logo"
          sx={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            boxShadow: '0 0 10px #00fff7',
            animation: `${rotate} 10s linear infinite`,
          }}
        />
      </Box>
    </Container>
  );
};

export default Home;
