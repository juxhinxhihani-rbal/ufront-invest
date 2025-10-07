import { useState, useEffect } from "react";

export const useCounter = () => {
  const [count, setCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

  const startCounting = () => {
    setCount(0);
    setIsCounting(true);
  };

  const stopCounting = () => {
    setIsCounting(false);
    setCount(0);
  };

  useEffect(() => {
    let intervalId: number | undefined;

    if (isCounting) {
      intervalId = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isCounting]);

  return { count, startCounting, stopCounting };
};
