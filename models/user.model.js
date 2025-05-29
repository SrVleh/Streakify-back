import { model } from 'mongoose'
import { UserSchema } from '../schemas/user.schema.js'

export const UserModel = model('User', UserSchema)
