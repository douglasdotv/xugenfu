import { Container, Typography, Box, keyframes } from '@mui/material';

const rotateReverse = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const Home = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, #330066, #000)',
        padding: 4,
        margin: '0 auto',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          p: 4,
          background: '#111',
          border: '3px solid #f0f',
          borderRadius: 2,
          boxShadow: '0 0 30px #ff8ad8',
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
            boxShadow: '0 0 20px #00fff7',
            animation: `${rotateReverse} 0.5s linear infinite, ${bounce} 2s ease-in-out infinite`,
          }}
        />
        <Typography
          variant="h6"
          component="p"
          sx={{
            mt: 4,
            color: '#fff',
            fontFamily: 'monospace',
            textShadow: '0 0 5px #f0f, 0 0 15px #00fff7',
            lineHeight: 1.8,
          }}
        >
          王者归来主盟！
          <br />
          没有一辈子的游戏，只有一辈子的兄弟！
          <br />
          来加入我们吧！我们就是王者！
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
