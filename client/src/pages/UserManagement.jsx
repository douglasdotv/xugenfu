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
import { Edit, AdminPanelSettings, Person } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import userService from '../services/userService';

const UserManagement = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
      console.log(data);
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
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
      setError(err.response?.data?.error || 'Failed to update user');
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
        User Management
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
                <TableCell>Role</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>MZ Username</TableCell>
                <TableCell>Team ID</TableCell>
                <TableCell>Team Name</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={user.isAdmin ? { backgroundColor: 'action.hover' } : {}}
                >
                  <TableCell>
                    <Tooltip title={user.isAdmin ? 'Admin' : 'User'}>
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
                    <IconButton
                      onClick={() => handleEditClick(user)}
                      disabled={!auth?.user?.isAdmin}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        align="center"
        sx={{ mt: 2 }}
      >
        Note: only xugenfu106/admin can see this page.
      </Typography>

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {formData.isAdmin ? (
              <AdminPanelSettings color="primary" />
            ) : (
              <Person color="action" />
            )}
            Edit User
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="MZ Username"
              fullWidth
              value={formData.mzUsername}
              onChange={(e) =>
                setFormData({ ...formData, mzUsername: e.target.value })
              }
              required
              margin="normal"
            />
            <TextField
              label="Team ID"
              fullWidth
              value={formData.teamId}
              onChange={(e) =>
                setFormData({ ...formData, teamId: e.target.value })
              }
              required
              margin="normal"
            />
            <TextField
              label="Team Name"
              fullWidth
              value={formData.teamName}
              onChange={(e) =>
                setFormData({ ...formData, teamName: e.target.value })
              }
              required
              margin="normal"
            />
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              margin="normal"
            />
            <TextField
              label="Email"
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
              label="Admin"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
