import express from 'express'
import mongoose from 'mongoose'
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import { ZodError } from "zod";

import { createAuthRouter } from "./routes/auth.routes.js"
import { createHabitRouter } from "./routes/habits.routes.js";
import { PORT } from "./config.js";
import { authenticateJWT } from "./middlewares/authenticate.js"
import { JWT_SECRET } from "./config.js"
import { SchemaValidator } from "./middlewares/schema-validator.js";
import { habitValidatorSchema } from "./validators/habit.validator.js";
import { userValidatorSchema } from "./validators/user.validator.js";

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

app.use(morgan('dev'))
app.use('/auth', SchemaValidator(userValidatorSchema), createAuthRouter())
app.use('/habits', SchemaValidator(habitValidatorSchema), authenticateJWT, createHabitRouter())

mongoose.connect('mongodb://127.0.0.1:27017/testdb').then(() => {
  console.log('##### MongoDB Connected #####')

}).catch(() => {
  console.log('##### MongoDB Connection Failed #####')
})

const server = app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
  const { user } = req.session
  res.render('../views/index', user)
})

app.get('/dashboard', authenticateJWT, (req, res) => {
  res.render('../views/dashboard')
})

app.use((err, req, res, next) => {
  console.log(err)

  if (err instanceof ZodError) {
    return res.status(400).json({ error: err.flatten() })
  }

  const status = err.statusCode || 500
  const message = err.isOperational ? err.message : 'Internal Server Error'

  res.status(status).json({ error: message })
})

export { app, server }
