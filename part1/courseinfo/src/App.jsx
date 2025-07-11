const Header = ({ name }) => {
  return <h1>{name}</h1>;
};

const Content = ({ parts }) => {
  const partComponents = parts.map((part) => (
    <Part name={part.name} exercises={part.exercises} key={part.id} />
  ));

  return <>{partComponents}</>;
};

const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  );
};

const Total = ({ parts }) => {
  const totalExercises = parts.reduce((acc, curr) => acc + curr.exercises, 0);
  return <p>Number of exercises {totalExercises}</p>;
};

const App = () => {
  let idGenerator = 0;

  const course = {
    name: "Half Stack application development",
    parts: [
      {
        id: idGenerator++,
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        id: idGenerator++,
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        id: idGenerator++,
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default App;
