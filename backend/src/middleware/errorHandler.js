import { env } from "../config/env.js";

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID" });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "That value already exists" });
  }
  if (err.name === "ValidationError" && err.errors) {
    const message = Object.values(err.errors).map((e) => e.message).join("; ");
    return res.status(400).json({ message });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body is not valid JSON" });
  }

  const status = err.status || 500;
  if (status === 500) console.error(err);

  res.status(status).json({
    message:
      status === 500 && env.nodeEnv === "production"
        ? "Something went wrong on our side"
        : err.message,
  });
}
