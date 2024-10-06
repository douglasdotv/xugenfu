require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}
mongoose.set('strictQuery', false)
connectToDatabase()

app.get('/', (_req, res) => {
  res.send('Hello, world!')
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
