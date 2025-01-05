import { Box, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        opacity: 0.6,
        transition: 'opacity 0.3s',
        '&:hover': {
          opacity: 1,
        },
      }}
    >
      <Link
        href="https://www.managerzone.com/?p=guestbook&uid=8577497"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: 'text.secondary',
          textDecoration: 'none',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          '&:hover': {
            color: 'primary.main',
          },
        }}
      >
        道格拉斯
      </Link>
    </Box>
  );
};

export default Footer;
