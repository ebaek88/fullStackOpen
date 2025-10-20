import type { Request, Response, NextFunction } from "express";
import * as z from "zod";
import { Gender } from "./types.js";

// schema for a new patient
const ssnRegex = /(\d{6})-(\d{2,3}[A-Z0-9])/; // regex for validating SSN format

export const NewPatientSchema = z.object({
  name: z.string(),
  ssn: z.string().regex(ssnRegex),
  dateOfBirth: z.iso.date().refine((val) => Date.parse(val) <= Date.now(), {
    error: "the date cannot be later than the current date",
  }),
  gender: z.enum(Gender),
  occupation: z.string(),
  entries: z.array(z.object({})), // this is temporary, haven't defined interface Entry yet
});

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
