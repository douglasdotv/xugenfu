const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const User = require('../models/user');

const register = async (req, res) => {
  const { username, email, name, teamId, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: 'Username, email and password are required' });
  }

  const existingUserOrEmail = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUserOrEmail) {
    return res.status(400).json({ error: 'Username or email already in use' });
  }

  if (password.length < 3) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 3 characters long' });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const userCount = await User.countDocuments({});
  const isFirstUser = userCount === 0;

  const user = new User({
    username,
    email,
    name,
    teamId,
    hashedPassword,
    isAdmin: isFirstUser,
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required' });
  }

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.hashedPassword);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, config.JWT_SECRET, {
    expiresIn: 60 * 60,
  });

  res.status(200).json({
    token,
    user: {
      username: user.username,
      name: user.name,
      isAdmin: user.isAdmin,
    },
  });
};

module.exports = {
  register,
  login,
};
