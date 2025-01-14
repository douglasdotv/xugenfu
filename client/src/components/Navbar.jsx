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
          ≮王者归来≯
        </Typography>

        <Button color="inherit" component={Link} to="/leagues/active">
          当前联赛
        </Button>

        {auth?.user?.isAdmin && (
          <>
            <Button color="inherit" component={Link} to="/leagues/fetch">
              获取联赛数据
            </Button>
            <Button color="inherit" component={Link} to="/users">
              用户管理
            </Button>
          </>
        )}

        {auth && (
          <>
            <Box mx={2}>
              <Typography variant="body1">
                欢迎, {auth.user.name || auth.user.username}！
              </Typography>
            </Box>
            <Button color="inherit" onClick={handleLogout}>
              退出登录
            </Button>
          </>
        )}

        {!auth && (
          <>
            <Button color="inherit" component={Link} to="/login">
              登录
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              注册
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
