import { useState, useEffect, useRef } from "react";
import axios from "axios";
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
import Notification from "./Components/Notification.tsx";

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
  const timeoutId = useRef<number | undefined>(-1);

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
  const [notification, setNotification] = useState<string>("");

  useEffect(() => {
    if (needsRefresh) {
      getAllNonsensitiveDiaries()
        .then((data) => setNonsensitiveDiaryEntries(data))
        .catch((error: unknown) => {
          if (axios.isAxiosError(error)) {
            console.log(error?.status);
            console.log(error?.message);
            showNotification(error?.message);
          } else {
            showNotification("unknown error occurred");
          }
        })
        .finally(() => setNeedsRefresh(false));
      getAllDiaries()
        .then((data) => setDiaryEntries(data))
        .catch((error: unknown) => {
          if (axios.isAxiosError(error)) {
            console.log(error?.status);
            console.log(error?.message);
            showNotification(error?.message);
          } else {
            showNotification("unknown error occurred");
          }
        })
        .finally(() => setNeedsRefresh(false));
      // setNeedsRefresh(false);
    }
  }, [needsRefresh]);

  // event handlers
  const showNotification = (msg: string, duration = 3000) => {
    setNotification(msg);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      setNotification("");
    }, duration);
  };

  const diaryCreation = async (event: React.SyntheticEvent) => {
    try {
      event.preventDefault();
      if (newDiaryEntry) {
        const createdDiary = await createNote(newDiaryEntry);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { comment, ...nonSensitiveNewDiaryEntry } = createdDiary;
        setDiaryEntries(diaryEntries?.concat(createdDiary));
        setNonsensitiveDiaryEntries(
          nonSensitiveDiaryEntries?.concat(nonSensitiveNewDiaryEntry)
        );
        showNotification(`Successfully added diary ${createdDiary.date}`);
        setNeedsRefresh(true);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error?.status);
        console.log(error?.message);
        showNotification(error?.message);
      } else {
        showNotification("unknown error occurred");
      }
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

  const handleWeatherChange = (value: Weather) => {
    if (newDiaryEntry) {
      setNewDiaryEntry({
        ...newDiaryEntry,
        weather: value,
      });
    }
  };

  const handleVisibilityChange = (value: Visibility) => {
    if (newDiaryEntry) {
      setNewDiaryEntry({
        ...newDiaryEntry,
        visibility: value,
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
      <Notification message={notification} />
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
