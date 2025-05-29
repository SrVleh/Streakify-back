import { model } from "mongoose"
import { HabitHistorySchema } from "../schemas/habitHistorySchema.js"

export const HabitHistory = model("HabitHistory", HabitHistorySchema)