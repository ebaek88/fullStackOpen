import express from "express";
import type { Response } from "express";
import type { PatientWithoutSsn } from "../types.js";
import patientService from "../services/patientService.js";

const router = express.Router();

router.get("/", (_req, res: Response<Array<PatientWithoutSsn>>) => {
  try {
    res.send(patientService.getPatientsWithoutSsn());
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
  }
});

export default router;
