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
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60000 // 1m
      }).send({ user, accessToken })

    } catch (error) {
      res.status(401).send(error.message)
    }
  }

  logout = async (req, res) => {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/'
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/'
    });
    res.json({ message: 'Logged out successfully!' });
  };

  refresh = async (req, res) => {
    try {
      const token = req.cookies.refresh_token;

      if (!token) {
        return next(new AppError('No refresh token provided', 401));
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      const newAccessToken = createToken(
        { _id: decoded._id, username: decoded.username },
        '1m'
      );

      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000 // 1h
      }).send({newAccessToken })
    } catch (error) {
      return next(new AppError('Invalid or expired refresh token', 403));
    }
  }

  currentSession = async (req, res) => {
    res.json({ user: req.session.user })
  }
}

const createToken = (user, time) => {
  return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: time
  })
}