import bcrypt from 'bcryptjs'
import { SALT_ROUNDS } from "../config.js";
import { UserModel } from "../models/user.model.js";
import { AppError } from "../utils/app.error.js";
import { USER_DEFAULT } from "../defaults/user.default.js";

export class AuthService {
  static async create({ input }) {
    const {
      username,
      password,
    } = input

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const user = new UserModel({
      username: username,
      password: hashedPassword,
      ...USER_DEFAULT
    })

    try {
      await user.validate()
      await user.save()
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError('Username already exists', 409);
      }

      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        throw new AppError(`Validation failed: ${validationErrors.join(', ')}`, 400);
      }

      console.error('Database error during user creation:', error);
      throw new AppError('Failed to create user account', 500);    }

    return user.id
  }

  static async login({ input }) {
    const {
      username,
      password,
    } = input

    const user = await UserModel.findOne({ username: username })
    if (!user) throw new AppError('Invalid credentials', 401)

    const isValid = bcrypt.compareSync(password, user.password)
    if (!isValid) throw new AppError('Invalid credentials', 401)

    const publicUser = {
      _id: user._id,
      username: user.username,
      memberType: user.memberType,
      bestStreak: user.bestStreak,
      totalStrikes: user.totalStrikes,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return publicUser
  }
}