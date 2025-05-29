import { model } from 'mongoose'
import { UserSchema } from '../schemas/userSchema.js'

export const UserModel = model('User', UserSchema)
