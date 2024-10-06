const express = require('express')
const apiRoutes = require('./routes/api')
const usersRoutes = require('./routes/users')
const connectToDatabase = require('./utils/db')

const app = express()

app.use(express.json())

connectToDatabase()

app.use('/api/users', usersRoutes)
app.use('/api', apiRoutes)

module.exports = app
