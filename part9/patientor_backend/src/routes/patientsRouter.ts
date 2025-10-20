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

router.get(
  "/:id",
  (
    req: Request<{ id: string }>,
    res: Response<Patient | { error: string }>,
    next: NextFunction
  ) => {
    try {
      const queriedPatient = patientService.getIndividualPatient(req.params.id);
      if (!queriedPatient) {
        res.status(404).send({ error: "patient not found" });
      } else {
        res.send(queriedPatient);
      }
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
