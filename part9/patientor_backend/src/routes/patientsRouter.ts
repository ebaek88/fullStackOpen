import express from "express";
import type { Response } from "express";
import type { PatientWithoutSsn } from "../types.js";
import patientService from "../services/patientService.js";
import toNewPatient from "../utils.js";

const router = express.Router();

router.get(
  "/",
  (_req, res: Response<Array<PatientWithoutSsn> | { error: string }>) => {
    try {
      res.send(patientService.getPatientsWithoutSsn());
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
      }
    }
  }
);

router.post("/", (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
      console.error(errorMessage);
      res.status(400).json({ error: errorMessage });
    }
  }
});

export default router;
