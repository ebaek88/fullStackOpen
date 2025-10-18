import axios from "axios";
import type {
  NonSensitiveDiaryEntry,
  NewDiaryEntry,
  DiaryEntry,
} from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

export const getAllNonsensitiveDiaries = async () => {
  const response = await axios.get<Array<NonSensitiveDiaryEntry>>(baseUrl);
  return response.data;
};

export const getAllDiaries = async () => {
  const response = await axios.get<Array<DiaryEntry>>(
    `${baseUrl}/with-comments`
  );
  return response.data;
};

export const createNote = async (object: NewDiaryEntry) => {
  const response = await axios.post<DiaryEntry>(baseUrl, object);
  return response.data;
};
