import type { NonSensitiveDiaryEntry } from "../types.ts";
import Diary from "./Diary.tsx";

const Diaries = ({ entries }: { entries: Array<NonSensitiveDiaryEntry> }) => {
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
