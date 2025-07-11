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
  return <h2>{name}</h2>;
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

export default Course;
