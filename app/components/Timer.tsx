'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Timer.module.css';

interface TimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

export default function Timer({ totalSeconds, onTimeUp, isRunning }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setTimeout(() => onTimeUpRef.current(), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, remaining > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  const pad = (n: number): string => n.toString().padStart(2, '0');
  const timeString = hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;

  const progress = remaining / totalSeconds;
  const isWarning = remaining <= 300 && remaining > 60;
  const isDanger = remaining <= 60;

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const getTimeClass = useCallback((): string => {
    if (isDanger) return `${styles.timeText} ${styles.timeDanger}`;
    if (isWarning) return `${styles.timeText} ${styles.timeWarning}`;
    return styles.timeText;
  }, [isDanger, isWarning]);

  const getProgressClass = (): string => {
    if (isDanger) return `${styles.progressCircle} ${styles.progressDanger}`;
    if (isWarning) return `${styles.progressCircle} ${styles.progressWarning}`;
    return `${styles.progressCircle} ${styles.progressNormal}`;
  };

  return (
    <div className={styles.timerContainer}>
      <div className={styles.circularProgress}>
        <div className={styles.timeDisplay} style={{ position: 'relative' }}>
          <span className={getTimeClass()}>{timeString}</span>
          <span className={styles.timeLabel}>remaining</span>
        </div>
      </div>
    </div>
  );
}
