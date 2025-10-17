import type { NonSensitiveDiaryEntry } from "../types";

const Diary = ({ entry }: { entry: NonSensitiveDiaryEntry }) => {
  return (
    <div>
      <h3>{entry.date}</h3>
      <div>visibility: {entry.visibility}</div>
      <div>weather: {entry.weather}</div>
    </div>
  );
};

export default Diary;
