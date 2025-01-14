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
          border: '1px solid',
          marginRight: '8px',
          textDecoration: 'none',
          fontFamily: 'monospace',
          fontSize: '1rem',
          '&:hover': {
            color: 'primary.main',
          },
          '@media (max-width: 600px)': {
            fontSize: '0.8rem',
          },
        }}
      >
        Oi
      </Link>
    </Box>
  );
};

export default Footer;
