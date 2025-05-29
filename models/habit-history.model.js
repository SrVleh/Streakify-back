import { model } from "mongoose"
import { HabitHistorySchema } from "../schemas/habit-history.schema.js"

export const HabitHistory = model("HabitHistory", HabitHistorySchema)