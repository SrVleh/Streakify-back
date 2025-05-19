import bcrypt from 'bcryptjs'
import { SALT_ROUNDS } from "../config.js";
import { User } from "../models/user.js";

export class AuthService {
  static async create({ input }) {
    const {
      username,
      password
    } = input

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const user = new User({username: username, password: hashedPassword})

    try {
      await user.validate()
      await user.save()
    } catch (error) {
      throw new Error('Failed creating new user.')
    }

    return user.id
  }

  static async login({ input }) {
    const {
      username,
      password
    } = input

    const user = await User.findOne({username: username})
    if (!user) throw new Error('User not found.')
    const isValid = bcrypt.compareSync(password, user.password)
    if (!isValid) throw new Error('Wrong credentials')

    const { password: _, ...publicUser } = user

    return publicUser
  }
}