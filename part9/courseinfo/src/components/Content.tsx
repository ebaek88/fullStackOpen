import type { ContentProps } from "../types.ts";
import Part from "./Part.tsx";

const Content = (props: ContentProps) => {
  return (
    <>
      {props.content.map((part) => (
        <Part
          key={part.name
            .split("")
            .reduce((sum, char) => sum + char.charCodeAt(0), "")}
          part={part}
        />
      ))}
    </>
  );
};

export default Content;
