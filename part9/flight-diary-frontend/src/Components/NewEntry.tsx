import type { NewDiaryEntry } from "../types.ts";
import { Weather, Visibility } from "../types.ts";

interface newEntryProps {
  handleSubmit: (event: React.SyntheticEvent) => void;
  handleDateChange: (event: React.FormEvent<HTMLInputElement>) => void;
  handleWeatherChange: (event: React.FormEvent<HTMLSelectElement>) => void;
  handleVisibilityChange: (event: React.FormEvent<HTMLSelectElement>) => void;
  handleCommentChange: (event: React.FormEvent<HTMLInputElement>) => void;
  newDiaryEntry: NewDiaryEntry;
}

const NewEntry = ({
  handleSubmit,
  handleDateChange,
  handleWeatherChange,
  handleVisibilityChange,
  handleCommentChange,
  newDiaryEntry,
}: newEntryProps) => {
  return (
    <div>
      <h2>Add new entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">date </label>
          <input
            type="text"
            value={newDiaryEntry?.date}
            id="date"
            onChange={handleDateChange}
          />
        </div>
        <div>
          <label htmlFor="weather">weather </label>
          <select
            value={newDiaryEntry?.weather}
            id="weather"
            onChange={handleWeatherChange}
          >
            {Object.values(Weather).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="visibility">visibility </label>
          <select
            value={newDiaryEntry?.visibility}
            id="visibility"
            onChange={handleVisibilityChange}
          >
            {Object.values(Visibility).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="comment">comment </label>
          <input
            type="text"
            value={newDiaryEntry?.comment}
            id="date"
            onChange={handleCommentChange}
          />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default NewEntry;
