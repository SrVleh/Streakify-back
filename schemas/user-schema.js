import { Schema } from 'mongoose'

export const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    nullable: false,
    unique: true,

  },
  password: {
    type: String,
    required: true,
    nullable: false,
    minlength: 6,
  },
})
