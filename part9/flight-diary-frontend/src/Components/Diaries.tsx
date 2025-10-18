import type { NonSensitiveDiaryEntry, DiaryEntry } from "../types.ts";
import Diary from "./Diary.tsx";

interface DiariesProps {
  entries: Array<NonSensitiveDiaryEntry> | Array<DiaryEntry>;
  // showDiariesWithComments: boolean;
}

const Diaries = ({ entries }: DiariesProps) => {
  return (
    <div>
      <h2>Diary entries</h2>
      {entries.map((entry) => (
        <Diary key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default Diaries;
