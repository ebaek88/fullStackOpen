interface CoursePart {
  name: string;
  exerciseCount: number;
}

interface ContentProps {
  content: Array<CoursePart>;
}

const Content = (props: ContentProps) => {
  return (
    <>
      {props.content.map((part) => (
        <p
          key={part.name
            .split("")
            .reduce((sum, char) => sum + char.charCodeAt(0), "")}
        >
          {part.name} {part.exerciseCount}
        </p>
      ))}
    </>
  );
};

export default Content;
