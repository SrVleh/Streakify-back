import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config.js";
import { AuthService } from "../services/auth.service.js";
import {AppError} from "../utils/app.error.js";

export class AuthController {
  register = async (req, res) => {
    const input = req.body
    const newUser = await AuthService.create({ input })
    res.json({ message: newUser })
  }

  login = async (req, res) => {
    const input = req.body

    try {
      const user = await AuthService.login({ input });
      const accessToken = createToken(user, '1h')
      const refreshToken = createToken(user, '7d')

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxLength: 60 * 60 * 1000,
      })

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxLength: 60 * 60 * 24000,
      }).send({ user, accessToken })

    } catch (error) {
      res.status(401).send(error.message)
    }
  }

  logout = async (req, res) => {
    res.clearCookie('access_token')
      .json({ message: 'Logged out successfully!' })
  }

  refresh = async (req, res) => {
    const token = req.cookies.refresh_token
    if (!token) return new AppError('No refresh token provided', 401)

    try {
      const user = jwt.verify(token, JWT_SECRET)
      const newAccessToken = createAccessToken({ _id: user._id, username: user.username })
      res.json({ accessToken: newAccessToken })
    } catch (error) {
      return new AppError('Invalid refresh token', 403)
    }
  }
}

const createToken = (user, time) => {
  return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: time
  })
}