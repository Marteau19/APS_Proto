import { useState, useEffect, useRef } from 'react';

export default function TypewriterText({ text, speed = 18, delay = 400, className = '' }) {
  const [displayed, setDisplayed] = useState(0);
  const [started, setStarted] = useState(false);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started || displayed >= text.length) return;

    const step = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const chars = Math.min(Math.floor(elapsed / speed), text.length);
      setDisplayed(chars);
      if (chars < text.length) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [started, text, speed]);

  if (!started) {
    return (
      <span className={className}>
        <span className="flowiq-thinking">
          <span className="flowiq-dot" />
          <span className="flowiq-dot" />
          <span className="flowiq-dot" />
        </span>
      </span>
    );
  }

  return (
    <span className={className}>
      {text.slice(0, displayed)}
      {displayed < text.length && <span className="flowiq-cursor" />}
    </span>
  );
}
