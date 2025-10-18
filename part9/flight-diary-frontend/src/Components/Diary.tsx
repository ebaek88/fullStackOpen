import type { NonSensitiveDiaryEntry, DiaryEntry } from "../types";

const Diary = ({ entry }: { entry: NonSensitiveDiaryEntry | DiaryEntry }) => {
  return (
    <div>
      <h3>{entry.date}</h3>
      <div>visibility: {entry.visibility}</div>
      <div>weather: {entry.weather}</div>
      {"comment" in entry ? <div>comment: {entry.comment}</div> : null}
    </div>
  );
};

export default Diary;
