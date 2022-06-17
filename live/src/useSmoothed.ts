import { useEffect, useState } from "react";

export default (raw: number) => {
  const [smoother, setSmoother] = useState(0.5);
  const [smoothed, setSmoothed] = useState(0);
  useEffect(() => {
    setSmoothed(smoother * smoothed + (1 - smoother) * raw);
  }, [raw]);
  return { smoothed, smoother, setSmoother };
};
