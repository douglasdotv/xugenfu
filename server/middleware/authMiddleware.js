const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const User = require('../models/user');

const verifyToken = async (req, res, next) => {
  try {
    const authorization = req.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token missing or invalid' });
    }

    const token = authorization.replace('Bearer ', '');
    const decodedToken = jwt.verify(token, config.JWT_SECRET);

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = {
  verifyToken,
  requireAdmin,
};
