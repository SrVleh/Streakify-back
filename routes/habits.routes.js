import { Router } from 'express'
import { HabitController } from "../controllers/habits.controller.js";

export const createHabitRouter = () => {
  const habitsRouter = Router()
  const habitController = new HabitController()

  habitsRouter.get('/', habitController.getAll)
  habitsRouter.get('/:id', habitController.getById)
  habitsRouter.get('/:id/history', habitController.getHistory)
  habitsRouter.post('/', habitController.create)
  habitsRouter.patch('/:id/complete', habitController.complete)
  habitsRouter.patch('/:id', habitController.update)
  habitsRouter.delete('/:id', habitController.delete)

  return habitsRouter
}