import { Schema } from "mongoose";

export const HabitHistorySchema = new Schema({
  habit: String,
  user: String,
  completedAt: Date,
})