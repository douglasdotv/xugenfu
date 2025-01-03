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
    const { teamId, teamName, name, email } = req.body;

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

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { teamId, teamName, name, email },
      { new: true, runValidators: true }
    ).select('-hashedPassword');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
};
