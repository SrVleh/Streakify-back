import mongoose, { isValidObjectId } from 'mongoose'

import { HabitModel } from '../models/habit.model.js'
import { AppError } from "../utils/app.error.js";
import {HabitHistory} from "../models/habit-history.model.js";

const ObjectId = mongoose.Types.ObjectId

export class HabitService {
  static async getAll({ userId }) {
    await updateHabitsStates(userId)
    const habits = await HabitModel.find({ user: userId })
    if (!habits) return new AppError('Habits not found', 404)
    return habits
  }

  static async getById({ habitId, userId }) {
    await updateHabitsStates(userId)
    if (!isValidObjectId(habitId)) return null
    const habit = HabitModel.findOne({ _id: new ObjectId(habitId), user: userId })
    if (!habit) return new AppError('Habit not found', 404)
    return habit
  }

  static async getHistory({ habitId, userId }) {
    const habitRecords = HabitHistory.find({ habit: habitId, user: userId })
    if (!habitRecords) return new AppError('Habit records not found', 404)
    return habitRecords
  }

  static async create({ input }) {
    const habitTemplate = new HabitModel({
      user: input.user.id,
      name: input.body.name,
      description: input.body.description,
      frequency: input.body.frequency,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastCompleted: null,
      tags: input.body.tags,
      streak: 0
    })

    try {
      return await habitTemplate.save()
    } catch (error) {
      return new AppError('Failed creating habit', 404)
    }
  }

  static async complete({ id, userId }) {
    const habit = await HabitService.getById({ habitId: id, userId })

    if(!isHabitCompletable(habit)) return new AppError('Habit already completed', 400)

    const updateData = {
      completed: true,
      lastCompleted: new Date()
    }

    const habitHistoryTemplate = new HabitHistory({
      habit: id,
      user: userId,
      completedAt: new Date(),
    })

    try {
      const updatedHabit = await HabitModel.findOneAndUpdate({ _id: id, user: userId }, { $set: updateData }, {
        new: true,
        runValidators: true
      })

      if (!updatedHabit) return new AppError('Habit not found', 404)
      await habitHistoryTemplate.save()

      return updatedHabit
    } catch (error) {
      return new AppError('Failed completing habit', 422)
    }
  }

  static async update({ id, input }) {
    const updateData = {
      updatedAt: new Date(),
      ...input.body
    }

    try {
      const updatedHabit = await HabitModel.findOneAndUpdate({ _id: id, user: input.user.id }, { $set: updateData }, {
        new: true,
        runValidators: true
      })

      if (!updatedHabit) return new AppError('Habit not found', 404)

      return updatedHabit
    } catch (error) {
      return new AppError('Failed updating habit', 422)
    }
  }

  static async delete({ id, userId }) {
    try {
      return await HabitModel.deleteOne({ _id: id, user: userId })
    } catch (error) {
      throw new AppError('Failed deleting habit', 422)
    }
  }
}

const isHabitCompletable = (habit) => {
  const isNewHabit = !habit.lastCompleted

  if (!isNewHabit && isSameDay(habit.lastCompleted)) return false
  if (habit.completed && isSameDay(habit.lastCompleted)) return false

  return true
}

const isSameDay = (dateToCompareWith) => {
  const newDate = new Date()

  return (
    newDate.getFullYear() === dateToCompareWith.getFullYear() &&
    newDate.getMonth() === dateToCompareWith.getMonth() &&
    newDate.getDate() === dateToCompareWith.getDate()
  )
}

const updateHabitsStates = async (userId) => {
  const habits = await HabitModel.find({ user: userId });

  for (const habit of habits) {
    if (isHabitCompletable(habit)) {
      await HabitModel.findOneAndUpdate(
        { _id: habit._id },
        { $set: { completed: false } },
        {
          new: true,
          runValidators: true
        }
      );
    }
  }
}

