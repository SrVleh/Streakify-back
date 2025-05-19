import express from 'express'
import mongoose from 'mongoose'
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import { createAuthRouter } from "./routes/auth.js"
import { userSchema } from "./schemas/user-schema.js";
import { PORT } from "./config.js";
import { authenticateJWT } from "./middlewares/authenticate.js";
import { JWT_SECRET } from "./config.js";

const app = express()
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  const token = req.cookies.access_token

  req.session = { user: null }

  try {
    const data = jwt.verify(token, JWT_SECRET)
    req.session.user = data
  } catch {}

  next()
})

app.use('/auth', createAuthRouter())

mongoose.connect('mongodb://127.0.0.1:27017/testdb').then(() => {
  console.log('##### MongoDB Connected #####')

  app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`)
  })
}).catch(() => {
  console.log('##### MongoDB Connection Failed #####')
})

const User = mongoose.model('User', userSchema)

const users = await User.find({})

console.log(users)


app.get('/', (req, res) => {
  const { user } = req.session
  res.render('../views/index', user)
})

app.get('/dashboard', authenticateJWT, (req, res) => {
  res.render('../views/dashboard')
})
