const express = require('express')
require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port  = process.env.PORT || 8080
const helmet = require('helmet')
const morgan = require('morgan')

connectDB()

const app = express()
app.use(helmet())
app.use(morgan('combined'))

// Adding middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/users', require('./routes/userRoutes'))



app.use(errorHandler)

app.listen(port, () => console.log(`server is running on port ${port}`))