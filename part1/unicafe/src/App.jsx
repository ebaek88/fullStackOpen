import { useState } from "react";

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>
        {value}
        {text === "positive" ? " %" : ""}
      </td>
    </tr>
  );
};

const Statistics = ({ feedbacks }) => {
  // Calculating the overall statistics
  const all = feedbacks.reduce((acc, feedback) => acc + feedback.value, 0);
  const total = feedbacks.reduce(
    (acc, feedback) => acc + feedback.value * feedback.point,
    0
  );
  const average = total / all;
  const positivePercentage =
    (feedbacks.filter((feedback) => (feedback.name = "good"))[0].value / all) *
    100;

  feedbacks = feedbacks.concat([
    { text: "all", value: all },
    { text: "average", value: average },
    { text: "positive", value: positivePercentage },
  ]);

  // Rendering each feedback
  const statisticLines = feedbacks.map((feedback, index) => (
    <StatisticLine text={feedback.text} value={feedback.value} key={index} />
  ));

  return feedbacks.every(
    (feedback) => feedback.value === 0 || Number.isNaN(feedback.value)
  ) ? (
    <>
      <p>No feedback given</p>
    </>
  ) : (
    <>
      <h1>statistics</h1>
      <table>
        <tbody>{statisticLines}</tbody>
      </table>
    </>
  );
};

const Button = ({ text, handler }) => {
  return <button onClick={handler}>{text}</button>;
};

const Feedback = ({ feedbacks }) => {
  const feedbackComponents = feedbacks.map((feedback, index) => (
    <Button text={feedback.text} handler={feedback.handler} key={index} />
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
    { text: "good", value: good, point: 1, handler: increaseGood },
    { text: "neutral", value: neutral, point: 0, handler: increaseNeutral },
    { text: "bad", value: bad, point: -1, handler: increaseBad },
  ];

  return (
    <div>
      <Feedback feedbacks={feedbacks} />
      <Statistics feedbacks={feedbacks} />
    </div>
  );
};

export default App;
