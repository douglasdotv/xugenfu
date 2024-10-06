const mongoose = require('mongoose')
const { MONGO_URI } = require('./config')
const logger = require('./logger')

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    logger.info('Connected to MongoDB')
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error)
  }
}

mongoose.set('strictQuery', false)

module.exports = connectToDatabase
