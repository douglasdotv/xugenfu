const express = require('express')

const app = express()

app.get('/', (_req, res) => {
  res.send('Hello, world!')
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
