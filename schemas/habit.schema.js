import { Schema } from 'mongoose'

export const HabitSchema = new Schema({
  user: String,
  name: String,
  description: String,
  frequency: String,
  completed: Boolean,
  createdAt: Date,
  updatedAt: Date,
  lastCompleted: Date,
  tags: Array,
  streak: Number,
})
