import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config.js";

export const authenticateJWT = (req, res, next) => {
  const token = req.cookies.access_token
  const refreshToken = req.cookies.refresh_token

  if (!token && !refreshToken) return res.status(401).json({ error: 'Access denied. No token provided.' })

  try {
    req.user = jwt.verify(token ? token : refreshToken, JWT_SECRET)
    next()
  } catch (error) {
    console.log({ error: 'Invalid or expired token.' })
    return res.status(403).json({ error: 'Invalid or expired token.' })
  }
}