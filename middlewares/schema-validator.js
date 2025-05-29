export const SchemaValidator = (schema) => (req, res, next) => {
  if (Object.keys(req.body || {}).length === 0) return next()

  const result = schema.safeParse(req.body)
  if (result.success) next()
  else res.status(400).json({ error: result.error.issues })
}