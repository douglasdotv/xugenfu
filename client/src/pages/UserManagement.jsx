import { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  AdminPanelSettings,
  Person,
  Delete,
  Password,
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import userService from '../services/userService';

const UserManagement = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formData, setFormData] = useState({
    teamId: '',
    teamName: '',
    name: '',
    email: '',
    mzUsername: '',
    isAdmin: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.error || '获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      teamId: user.teamId,
      teamName: user.teamName,
      name: user.name,
      email: user.email,
      mzUsername: user.mzUsername,
      isAdmin: user.isAdmin,
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handlePasswordClick = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setFormData({
      mzUsername: '',
      teamId: '',
      teamName: '',
      name: '',
      email: '',
      isAdmin: false,
    });
  };

  const handlePasswordClose = () => {
    setPasswordDialogOpen(false);
    setSelectedUser(null);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(selectedUser.id);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );
      handleDeleteClose();
    } catch (err) {
      setError(err.response?.data?.error || '删除用户失败');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    if (newPassword.length < 3) {
      setError('密码长度至少为3个字符');
      return;
    }
    try {
      await userService.updatePassword(selectedUser.id, newPassword);
      handlePasswordClose();
    } catch (err) {
      setError(err.response?.data?.error || '更新密码失败');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await userService.updateUser(
        selectedUser.id,
        formData
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || '更新用户信息失败');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        用户管理
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ mt: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>角色</TableCell>
                <TableCell>用户名</TableCell>
                <TableCell>姓名</TableCell>
                <TableCell>邮箱</TableCell>
                <TableCell>MZ用户名</TableCell>
                <TableCell>队伍ID</TableCell>
                <TableCell>队伍名称</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={user.isAdmin ? { backgroundColor: 'action.hover' } : {}}
                >
                  <TableCell>
                    <Tooltip title={user.isAdmin ? '管理员' : '普通用户'}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {user.isAdmin ? (
                          <AdminPanelSettings color="primary" />
                        ) : (
                          <Person color="action" />
                        )}
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mzUsername}</TableCell>
                  <TableCell>{user.teamId}</TableCell>
                  <TableCell>{user.teamName}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
                    >
                      <IconButton
                        onClick={() => handleEditClick(user)}
                        disabled={!auth?.user?.isAdmin}
                        title="编辑用户"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handlePasswordClick(user)}
                        disabled={!auth?.user?.isAdmin}
                        title="修改密码"
                      >
                        <Password />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(user)}
                        disabled={
                          !auth?.user?.isAdmin || user.id === auth.user.id
                        }
                        color="error"
                        title="删除用户"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {formData.isAdmin ? (
              <AdminPanelSettings color="primary" />
            ) : (
              <Person color="action" />
            )}
            编辑用户
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="MZ用户名"
              fullWidth
              value={formData.mzUsername}
              onChange={(e) =>
                setFormData({ ...formData, mzUsername: e.target.value })
              }
              required
              margin="normal"
            />
            <TextField
              label="队伍ID"
              fullWidth
              value={formData.teamId}
              onChange={(e) =>
                setFormData({ ...formData, teamId: e.target.value })
              }
              required
              margin="normal"
            />
            <TextField
              label="队伍名称"
              fullWidth
              value={formData.teamName}
              onChange={(e) =>
                setFormData({ ...formData, teamName: e.target.value })
              }
              required
              margin="normal"
            />
            <TextField
              label="姓名"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              margin="normal"
            />
            <TextField
              label="邮箱"
              fullWidth
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              type="email"
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isAdmin}
                  onChange={(e) =>
                    setFormData({ ...formData, isAdmin: e.target.checked })
                  }
                  disabled={!auth?.user?.isAdmin}
                />
              }
              label="管理员权限"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button type="submit" variant="contained" color="primary">
              保存修改
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>确认删除用户</DialogTitle>
        <DialogContent>
          确定要删除用户 {selectedUser?.username} 吗？此操作无法撤销。
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>取消</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            删除用户
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={passwordDialogOpen}
        onClose={handlePasswordClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>修改用户 {selectedUser?.username} 的密码</DialogTitle>
        <form onSubmit={handlePasswordSubmit}>
          <DialogContent>
            <TextField
              label="新密码"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              label="确认密码"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePasswordClose}>取消</Button>
            <Button type="submit" variant="contained" color="primary">
              更新密码
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        align="center"
        sx={{ mt: 2 }}
      >
        提示：只有管理员可以访问此页面
      </Typography>
    </Container>
  );
};

export default UserManagement;
