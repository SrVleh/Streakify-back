import { z } from 'zod'

export const habitValidatorSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().min(16).max(100),
  frequency: z.string(),
  tags: z.array(
    z.enum([
      "Health",
      "Fitness",
      "Nutrition",
      "Hydration",
      "Reading",
      "Learning",
      "Meditation",
      "Gratitude",
      "Journaling",
      "Sleep",
      "Productivity",
      "Focus",
      "Exercise",
      "Routine",
      "Mentalhealth",
      "Selfcare",
      "Financial",
      "Digitaldetox",
      "Relationships",
      "Goalsetting"
    ])
  )
})