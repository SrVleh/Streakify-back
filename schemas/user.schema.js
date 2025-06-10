import { Schema } from 'mongoose'

export const UserSchema = new Schema({
  username: String,
  password: String,
  email: String,
  memberType: String,
  bestStreak: Number,
  totalStrikes: Number,
  createdAt: Date,
  updatedAt: Date,
})
