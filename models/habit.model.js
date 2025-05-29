import { model } from "mongoose"
import { HabitSchema } from "../schemas/habit.schema.js"

export const HabitModel = model("Habit", HabitSchema);