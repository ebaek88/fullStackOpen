import express from "express";
import type { Response } from "express";
import type { DiagnosisWithoutLatin } from "../types/diagnosis.js";
import diagnosisService from "../services/diagnosisService.js";

const router = express.Router();

router.get("/", (_req, res: Response<Array<DiagnosisWithoutLatin>>) => {
  res.send(diagnosisService.getDiagnosesWithoutLatin());
});

export default router;
