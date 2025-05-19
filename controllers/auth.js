import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config.js";
import { AuthService } from "../services/auth.js";

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
      console.log(user._doc)
      const token = jwt.sign({ id: user._doc._id, username: user._doc.username }, JWT_SECRET, {
        expiresIn: '1h'
      })

      res.cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxLength: 60 * 60 * 1000,
        }).send({ user, token })

    } catch (error) {
      res.status(401).send(error.message)
    }
  }

  logout = (req, res) => {
    res.clearCookie('access_token')
      .json({ message: 'Logged out successfully!' })
  }
}