import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import Styles from "../styles/timer.module.css";

const Timer = forwardRef(({ timeUp }, ref) => {
  const initialTime = 1800;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
    if (timeLeft == 0) {
      timeUp();
    }
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isActive && timeLeft !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, timeUp]);

  const startTimer = () => setIsActive(true);
  useImperativeHandle(ref, () => ({
    startTimer,
  }));

  useEffect(() => {
    startTimer();
  }, []);

  return (
    <div className={Styles.container}>
      <div className={Styles.timer}>
        {Math.floor(timeLeft / 60)}:
        {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
      </div>
    </div>
  );
});

export default Timer;
