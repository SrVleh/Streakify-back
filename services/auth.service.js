import bcrypt from 'bcryptjs'
import { SALT_ROUNDS } from "../config.js";
import { UserModel } from "../models/user.model.js";
import { AppError } from "../utils/app.error.js";

export class AuthService {
  static async create({ input }) {
    const {
      username,
      password
    } = input

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const user = new UserModel({username: username, password: hashedPassword})

    try {
      await user.validate()
      await user.save()
    } catch (error) {
      throw new AppError('Failed creating new user', 422)
    }

    return user.id
  }

  static async login({ input }) {
    const {
      username,
      password
    } = input

    const user = await UserModel.findOne({username: username})
    if (!user) throw new AppError('User not found', 404)
    const isValid = bcrypt.compareSync(password, user.password)
    if (!isValid) throw new AppError('Wrong credentials', 404)

    const publicUser = {
      _id: user._id,
      username: user.username,
    }

    return publicUser
  }
}