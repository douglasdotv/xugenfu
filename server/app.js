const express = require('express')
const apiRoutes = require('./routes/api')
const connectToDatabase = require('./utils/db')

const app = express()

connectToDatabase()

app.use('/api', apiRoutes)

module.exports = app
