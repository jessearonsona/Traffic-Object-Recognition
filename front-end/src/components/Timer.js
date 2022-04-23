import "../styling/Timer.css";

const Timer = (props) => {
  return (
    <div id="timer">
      Elapsed Time:
      <span>{("0" + Math.floor((props.time / 3600000) % 60)).slice(-2)}:</span>
      <span>{("0" + Math.floor((props.time / 60000) % 60)).slice(-2)}:</span>
      <span>{("0" + ((props.time / 1000) % 60)).slice(-2)}</span>
    </div>
  );
};

export default Timer;
