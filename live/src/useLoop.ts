import { useEffect, useState } from "react";
import ac from "./ac";

export default (initialSrc = "") => {
  const [src, setSrc] = useState(initialSrc);
  const [gain, setGain] = useState<GainNode | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = document.createElement("audio");
    audio.autoplay = true;
    audio.loop = true;
    audio.src = src;
    const source = ac.createMediaElementSource(audio);
    const gain = ac.createGain();
    source.connect(gain);
    gain.connect(ac.destination);
    setAudio(audio);
    setGain(gain);
  }, []);

  useEffect(() => {
    if (audio) {
      audio.src = src;
    }
  }, [src]);

  return { gain, src, setSrc };
};
