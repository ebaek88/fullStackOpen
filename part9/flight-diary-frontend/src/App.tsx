import React, { useState, useEffect } from "react";
import type {
  DiaryEntry,
  NewDiaryEntry,
  NonSensitiveDiaryEntry,
} from "./types.ts";
import { Weather, Visibility } from "./types.ts";
import {
  getAllNonsensitiveDiaries,
  getAllDiaries,
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
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`,
    weather: Weather.Sunny,
    visibility: Visibility.Good,
    comment: "",
  };

  // states for the app
  const [diaryEntries, setDiaryEntries] = useState<
    Array<DiaryEntry> | undefined
  >([]);
  const [nonSensitiveDiaryEntries, setNonsensitiveDiaryEntries] = useState<
    Array<NonSensitiveDiaryEntry> | undefined
  >([]);
  const [newDiaryEntry, setNewDiaryEntry] =
    useState<NewDiaryEntry>(defaultNewDiaryEntry);
  const [showDiariesWithComments, setShowDiariesWithComments] =
    useState<boolean>(false);
  const [needsRefresh, setNeedsRefresh] = useState<boolean>(true);

  useEffect(() => {
    if (needsRefresh) {
      getAllNonsensitiveDiaries().then((data) =>
        setNonsensitiveDiaryEntries(data)
      );
      getAllDiaries().then((data) => setDiaryEntries(data));
      setNeedsRefresh(false);
    }
  }, [needsRefresh]);

  // event handlers
  const diaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (newDiaryEntry) {
      const createdDiary = await createNote(newDiaryEntry);
      setDiaryEntries(diaryEntries?.concat(createdDiary));
      setNonsensitiveDiaryEntries(
        nonSensitiveDiaryEntries?.concat(createdDiary)
      );
      setNeedsRefresh(true);
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

  const toggleShowDiariesWithComments = () => {
    setShowDiariesWithComments(!showDiariesWithComments);
  };

  if (needsRefresh) {
    console.log("diaries with comments:", diaryEntries);
    console.log("diaries without comments:", nonSensitiveDiaryEntries);
  }

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
      <button onClick={toggleShowDiariesWithComments}>
        {showDiariesWithComments
          ? "show diaries without comments"
          : "show diaries with comments"}
      </button>
      {!showDiariesWithComments && nonSensitiveDiaryEntries && (
        <Diaries entries={nonSensitiveDiaryEntries} />
      )}
      {showDiariesWithComments && diaryEntries && (
        <Diaries entries={diaryEntries} />
      )}
    </>
  );
};

export default App;
