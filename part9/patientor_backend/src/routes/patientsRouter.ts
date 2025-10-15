import express from "express";
import type { Request, Response, NextFunction } from "express";
import type { NewPatient, Patient, PatientWithoutSsn } from "../types.js";
import patientService from "../services/patientService.js";
import { newPatientParser } from "../utils.js";

const router = express.Router();

router.get(
  "/",
  (_req, res: Response<Array<PatientWithoutSsn>>, next: NextFunction) => {
    try {
      res.send(patientService.getPatientsWithoutSsn());
    } catch (error: unknown) {
      next(error);
    }
  }
);

router.post(
  "/",
  newPatientParser,
  (
    req: Request<unknown, unknown, NewPatient>,
    res: Response<Patient>,
    next: NextFunction
  ) => {
    try {
      const addedPatient = patientService.addPatient(req.body);
      res.json(addedPatient);
    } catch (error: unknown) {
      next(error);
    }
  }
);

export default router;
