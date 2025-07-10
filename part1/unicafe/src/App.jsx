import { useState } from "react";

const StatisticsRow = ({ name, value }) => {
  return (
    <li style={{ listStyle: "none" }}>
      {name} {value}
    </li>
  );
};

const Statistics = ({ feedbacks }) => {
  const statisticsRows = feedbacks.map((feedback, index) => (
    <StatisticsRow name={feedback.name} value={feedback.value} key={index} />
  ));
  return (
    <>
      <h1>statistics</h1>
      <ul style={{ padding: "0px" }}>{statisticsRows}</ul>
    </>
  );
};

const FeedbackButton = ({ name, handler }) => {
  return <button onClick={handler}>{name}</button>;
};

const Feedback = ({ feedbacks }) => {
  const feedbackComponents = feedbacks.map((feedback, index) => (
    <FeedbackButton
      name={feedback.name}
      handler={feedback.handler}
      key={index}
    />
  ));
  return (
    <>
      <h1>give feedback</h1>
      <div>{feedbackComponents}</div>
    </>
  );
};

const App = () => {
  // saves clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const increaseGood = () => setGood(good + 1);
  const increaseNeutral = () => setNeutral(neutral + 1);
  const increaseBad = () => setBad(bad + 1);

  const feedbacks = [
    { name: "good", value: good, handler: increaseGood },
    { name: "neutral", value: neutral, handler: increaseNeutral },
    { name: "bad", value: bad, handler: increaseBad },
  ];

  return (
    <div>
      <Feedback feedbacks={feedbacks} />
      <Statistics feedbacks={feedbacks} />
    </div>
  );
};

export default App;
