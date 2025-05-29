import { model } from "mongoose"
import { HabitSchema } from "../schemas/habitSchema.js"

export const HabitModel = model("Habit", HabitSchema);