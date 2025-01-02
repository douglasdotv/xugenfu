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
          xugenfu106
        </Typography>

        <Button color="inherit" component={Link} to="/leagues/active">
          Active League
        </Button>

        {/* Admin-only buttons */}
        {auth?.user?.isAdmin && (
          <Button color="inherit" component={Link} to="/leagues/fetch">
            Fetch League
          </Button>
        )}

        {/* Auth-required buttons */}
        {auth && (
          <>
            <Box mx={2}>
              <Typography variant="body1">
                Welcome, {auth.user.name || auth.user.username}!
              </Typography>
            </Box>
            <Button color="inherit" onClick={handleLogout}>
              Log out
            </Button>
          </>
        )}

        {/* Public buttons */}
        {!auth && (
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
