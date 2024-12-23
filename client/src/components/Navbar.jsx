import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Xugenfu
        </Typography>
        {auth ? (
          <>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>
            <Box mx={2}>
              <Typography variant="body1">
                Welcome, {auth.user.name || auth.user.username}!
              </Typography>
            </Box>
            <Button color="inherit" onClick={handleLogout}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Log in
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Sign up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
