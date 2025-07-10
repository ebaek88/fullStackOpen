import { useState } from "react";

const StatisticsOverall = ({ feedbacks }) => {
  const all = feedbacks.reduce((acc, feedback) => acc + feedback.quantity, 0);
  const total = feedbacks.reduce(
    (acc, feedback) => acc + feedback.quantity * feedback.value,
    0
  );
  const average = total / all;
  const positivePercentage =
    (feedbacks.filter((feedback) => (feedback.name = "good"))[0].quantity /
      all) *
    100;
  console.log(average);
  console.log(positivePercentage);
  return (
    <>
      <li style={{ listStyle: "none" }}>all {all}</li>
      <li style={{ listStyle: "none" }}>average {average}</li>
      <li style={{ listStyle: "none" }}>positive {positivePercentage} %</li>
    </>
  );
};

const StatisticsRow = ({ name, quantity }) => {
  return (
    <li style={{ listStyle: "none" }}>
      {name} {quantity}
    </li>
  );
};

const Statistics = ({ feedbacks }) => {
  // Rendering each feedback
  let statisticsRows = feedbacks.map((feedback, index) => (
    <StatisticsRow
      name={feedback.name}
      quantity={feedback.quantity}
      key={index}
    />
  ));
  // Rendering the overall statistics
  statisticsRows = statisticsRows.concat(
    <StatisticsOverall feedbacks={feedbacks} key={feedbacks.length} />
  );

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
    { name: "good", quantity: good, value: 1, handler: increaseGood },
    { name: "neutral", quantity: neutral, value: 0, handler: increaseNeutral },
    { name: "bad", quantity: bad, value: -1, handler: increaseBad },
  ];

  return (
    <div>
      <Feedback feedbacks={feedbacks} />
      <Statistics feedbacks={feedbacks} />
    </div>
  );
};

export default App;
