// Generic schema-validation middleware. Parses req.body, attaches the clean result,
// or short-circuits with a 400 carrying field-level messages.
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body ?? {});
  if (!result.success) {
    return res.status(400).json({
      ok: false,
      error: 'Validation failed',
      fields: result.error.flatten().fieldErrors,
    });
  }
  req.validated = result.data;
  next();
};
