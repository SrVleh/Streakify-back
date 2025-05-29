import { Router } from 'express'
import { AuthController } from "../controllers/auth.controller.js";

export const createAuthRouter = () => {
  const authRouter = Router()
  const authController = new AuthController()

  authRouter.post('/login', authController.login)
  authRouter.post('/register', authController.register)
  authRouter.post('/logout', authController.logout)
  authRouter.post('/refresh', authController.refresh)

  return authRouter
}