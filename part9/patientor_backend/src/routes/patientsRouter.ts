/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from "express";
import type { Response } from "express";
import type { PatientWithoutSsn } from "../types.js";
import patientService from "../services/patientService.js";

const router = express.Router();

router.get("/", (_req, res: Response<Array<PatientWithoutSsn>>) => {
  try {
    res.send(patientService.getPatientsWithoutSsn());
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      // res.status(400).json({error: error.message});
    }
  }
});

router.post("/", (req, res) => {
  const { name, ssn, dateOfBirth, gender, occupation } = req.body;
  try {
    const addedPatient = patientService.addPatient({
      name,
      ssn,
      dateOfBirth,
      gender,
      occupation,
    });
    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ error: error.message });
    }
  }
});

export default router;
