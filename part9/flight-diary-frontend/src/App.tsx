import { useState, useEffect } from "react";
import type {
  // DiaryEntry,
  NewDiaryEntry,
  NonSensitiveDiaryEntry,
} from "./types.ts";
import { Weather, Visibility } from "./types.ts";
import {
  getAllNonsensitiveDiaries,
  createNote,
} from "./services/diaryServices.ts";
import NewEntry from "./Components/NewEntry.tsx";
import Diaries from "./Components/Diaries.tsx";

const App = () => {
  // constants
  const date = new Date();
  const defaultNewDiaryEntry = {
    date: `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDay().toString().padStart(2, "0")}`,
    weather: Weather.Sunny,
    visibility: Visibility.Good,
    comment: "",
  };

  // states for the app
  // const [diaryEntries, setDiaryEntries] = useState<Array<DiaryEntry> | null>(null);
  const [nonSensitiveDiaryEntries, setNonsensitiveDiaryEntries] = useState<
    Array<NonSensitiveDiaryEntry> | undefined
  >([]);
  const [newDiaryEntry, setNewDiaryEntry] =
    useState<NewDiaryEntry>(defaultNewDiaryEntry);

  useEffect(() => {
    getAllNonsensitiveDiaries().then((data) =>
      setNonsensitiveDiaryEntries(data)
    );
  }, []);

  // event handlers
  const diaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (newDiaryEntry) {
      const createdDiary = await createNote(newDiaryEntry);
      setNonsensitiveDiaryEntries(
        nonSensitiveDiaryEntries?.concat(createdDiary)
      );
    }
    setNewDiaryEntry(defaultNewDiaryEntry);
  };

  const handleDateChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (newDiaryEntry) {
      setNewDiaryEntry({ ...newDiaryEntry, date: event.currentTarget.value });
    }
  };

  const handleCommentChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (newDiaryEntry) {
      setNewDiaryEntry({
        ...newDiaryEntry,
        comment: event.currentTarget.value,
      });
    }
  };

  const handleWeatherChange = (event: React.FormEvent<HTMLSelectElement>) => {
    if (newDiaryEntry) {
      setNewDiaryEntry({
        ...newDiaryEntry,
        weather: event.currentTarget.value as Weather,
      });
    }
  };

  const handleVisibilityChange = (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    if (newDiaryEntry) {
      setNewDiaryEntry({
        ...newDiaryEntry,
        visibility: event.currentTarget.value as Visibility,
      });
    }
  };

  return (
    <>
      <NewEntry
        handleSubmit={diaryCreation}
        handleDateChange={handleDateChange}
        handleWeatherChange={handleWeatherChange}
        handleVisibilityChange={handleVisibilityChange}
        handleCommentChange={handleCommentChange}
        newDiaryEntry={newDiaryEntry}
      />
      {nonSensitiveDiaryEntries && (
        <Diaries entries={nonSensitiveDiaryEntries} />
      )}
    </>
  );
};

export default App;
