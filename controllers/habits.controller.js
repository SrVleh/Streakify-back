import { HabitService } from '../services/habit.service.js'

export class HabitController {
  getAll = async (req, res) => {
    const id = req.session.user.id
    const habits = await HabitService.getAll({ userId: id })
    res.json(habits)
  }

  getById = async (req, res) => {
    const { id: habitId } = req.params
    const userId = req.session.user.id
    const habit = await HabitService.getById({ habitId: habitId, userId: userId })
    res.json(habit)
  }

  getHistory = async (req, res) => {
    const { id } = req.params
    const userId = req.session.user.id
    const habitRecords = await HabitService.getHistory({ habitId: id, userId: userId })
    res.json(habitRecords)
  }

  create = async (req, res) => {
    const newHabit = await HabitService.create({ input: req })
    res.status(201).json(newHabit)
  }

  complete = async (req, res) => {
    const { id } = req.params
    const habit = await HabitService.complete({ id: id, userId: req.session.user.id })
    res.json(habit)
  }

  update = async (req, res) => {
    const { id } = req.params
    const habit = await HabitService.update({id: id, input: req})
    res.json(habit)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await HabitService.delete({ id: id, userId: req.session.user.id })
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Habit not found.' })
    res.json({ message: 'Habit deleted successfully!' })
  }
}