import { useState } from "react";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (evt) => {
    setValue(evt.target.value);
  };

  const reset = () => setValue("");
  return [{ type, value, onChange }, reset];
};
