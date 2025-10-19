import type React from "react";
// import { useState } from "react";
import type { NewDiaryEntry } from "../types.ts";
import { Weather, Visibility } from "../types.ts";

interface newEntryProps {
  handleSubmit: (event: React.SyntheticEvent) => void;
  handleDateChange: (event: React.FormEvent<HTMLInputElement>) => void;
  handleWeatherChange: (value: Weather) => void;
  handleVisibilityChange: (value: Visibility) => void;
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
  // const [radioWeatherValue, setRadioWeatherValue] = useState<Weather>(Weather.Sunny);
  return (
    <div>
      <h2>Add new entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">date </label>
          <input
            type="date"
            value={newDiaryEntry?.date}
            id="date"
            onChange={handleDateChange}
            max={`${new Date().toISOString().slice(0, 10)}`}
          />
        </div>
        <div>
          weather{" "}
          {Object.values(Weather).map((key) => (
            <label key={key}>
              <input
                type="radio"
                name="weather"
                value={key}
                checked={newDiaryEntry?.weather === key}
                onChange={() => handleWeatherChange(key)}
              />
              {key}
            </label>
          ))}
        </div>
        <div>
          visibility{" "}
          {Object.values(Visibility).map((key) => (
            <label key={key}>
              <input
                type="radio"
                name="visibility"
                value={key}
                checked={newDiaryEntry?.visibility === key}
                onChange={() => handleVisibilityChange(key)}
              />
              {key}
            </label>
          ))}
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
