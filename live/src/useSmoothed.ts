import { useRef, useState } from "react";

export default (raw: number) => {
  const [smoother, setSmoother] = useState(0.9);
  const smoothed = useRef(0);
  smoothed.current = smoother * smoothed.current + (1 - smoother) * raw;
  return { smoothed, smoother, setSmoother };
};
