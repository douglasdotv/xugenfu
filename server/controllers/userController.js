const bcrypt = require('bcryptjs');
const User = require('../models/user');

const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find({}).select('-hashedPassword');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, teamName, name, email, mzUsername, isAdmin } = req.body;

    await checkForLastAdmin(id, isAdmin);

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (teamId !== existingUser.teamId) {
      const teamIdExists = await User.findOne({ teamId });
      if (teamIdExists) {
        return res.status(400).json({ error: 'Team ID already in use' });
      }
    }

    if (email !== existingUser.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: id } });
      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    if (mzUsername !== existingUser.mzUsername) {
      const mzUsernameExists = await User.findOne({ mzUsername });
      if (mzUsernameExists) {
        return res.status(400).json({ error: 'MZ Username already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { teamId, teamName, name, email, mzUsername, isAdmin },
      { new: true }
    ).select('-hashedPassword');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    if (user.isAdmin) {
      try {
        await checkForLastAdmin(id, false);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    await User.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 3) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 3 characters long' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { hashedPassword },
      { new: true }
    ).select('-hashedPassword');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password' });
  }
};

const checkForLastAdmin = async (userId, newIsAdmin) => {
  const user = await User.findById(userId);
  if (user.isAdmin && !newIsAdmin) {
    const adminCount = await User.countDocuments({ isAdmin: true });
    if (adminCount <= 1) {
      throw new Error('Cannot remove last admin');
    }
  }
  return true;
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  updatePassword,
};
