const Part = ({ part }) => {
  return (
    <div>
      {part.name} {part.exercises}
    </div>
  );
};

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => {
        return <Part part={part} key={part.id} />;
      })}
    </>
  );
};

const Header = ({ name }) => {
  return <h1>{name}</h1>;
};

const Course = ({ course }) => {
  const total = course.parts.reduce((acc, curr) => acc + curr.exercises, 0);

  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <strong>total of {total} exercises</strong>
    </>
  );
};

const App = () => {
  const course = {
    id: 1,
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
        id: 1,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
        id: 2,
      },
      {
        name: "State of a component",
        exercises: 14,
        id: 3,
      },
      {
        name: "Hello world",
        exercises: 30,
        id: 4,
      },
    ],
  };

  return <Course course={course} />;
};

export default App;
