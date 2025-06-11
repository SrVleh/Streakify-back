import { z } from 'zod'

export const userValidatorSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(8).max(30),
})