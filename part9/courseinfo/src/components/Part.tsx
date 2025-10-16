import type { CoursePart } from "../types.ts";

// helper function for exhaustive type checking
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <div>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
          </div>
          <div>
            <em>{part.description}</em>
          </div>
          <br />
        </div>
      );
    case "group":
      return (
        <div>
          <div>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
          </div>
          <div>project exercises {part.groupProjectCount}</div>
          <br />
        </div>
      );
    case "background":
      return (
        <div>
          <div>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
          </div>
          <div>
            <em>{part.description}</em>
          </div>
          <div>submit to {part.backgroundMaterial}</div>
          <br />
        </div>
      );
    case "special":
      return (
        <div>
          <div>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
          </div>
          <div>
            <em>{part.description}</em>
          </div>
          <div>required skills: {part.requirements.join(", ")}</div>
          <br />
        </div>
      );
    default:
      return assertNever(part);
      break;
  }
};

export default Part;
