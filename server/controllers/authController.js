const bcrypt = require('bcryptjs')
const User = require('../models/user')

const register = async (req, res) => {
  const { username, name, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  const existingUser = await User.findOne({
    username,
  })
  if (existingUser) {
    return res.status(400).json({ error: 'Username already in use' })
  }

  if (password.length < 3) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  const userCount = await User.countDocuments({})
  const isFirstUser = userCount === 0

  const user = new User({
    username,
    name,
    hashedPassword,
    isAdmin: isFirstUser,
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
}

module.exports = {
  register,
}
