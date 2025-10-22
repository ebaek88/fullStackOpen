import type { Request, Response, NextFunction } from "express";
import * as z from "zod";
import { NewPatientSchema } from "./schemas/patientSchema.js";
import { EntryWithoutIdSchema } from "./schemas/entrySchema.js";

// middleware
// schema parser for a new patient
export const newPatientParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

// schema parser for a new entry
export const newEntryParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    EntryWithoutIdSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

// handler for unknown endpoint
export const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

// error handler
export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};
