'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizQuestion } from '@/app/lib/quizData';
import styles from './ResultsSummary.module.css';

interface AnswerRecord {
  selected: number[];
  isCorrect: boolean;
}

interface ResultsSummaryProps {
  questions: QuizQuestion[];
  answers: Map<number, AnswerRecord>;
  timeSpent: number;
  mode: string;
}

export default function ResultsSummary({
  questions,
  answers,
  timeSpent,
  mode,
}: ResultsSummaryProps) {
  const router = useRouter();
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const totalQuestions = questions.length;
  const correctCount = Array.from(answers.values()).filter((a) => a.isCorrect).length;
  const answeredCount = answers.size;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = percentage >= 70;

  const hours = Math.floor(timeSpent / 3600);
  const minutes = Math.floor((timeSpent % 3600) / 60);
  const secs = timeSpent % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timeString = hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(secs)}` : `${pad(minutes)}:${pad(secs)}`;

  const toggleQuestion = (idx: number) => {
    setExpandedQuestion((prev) => (prev === idx ? null : idx));
  };

  return (
    <main className="app-container" style={{ maxWidth: '900px' }}>
      <h2 className={styles.title}>
        {mode === 'study' ? 'Study Session Complete' : mode === 'exam' ? 'Exam Results' : 'Practice Results'}
      </h2>
      <p className={styles.subtitle}>
        {passed ? 'Great job on your performance!' : 'Keep practicing to improve your score.'}
      </p>

      <div className={styles.statsContainer}>
        <div className={styles.scoreCircle}>
          <span className={passed ? styles.scorePass : styles.scoreFail}>{percentage}%</span>
        </div>
        
        <div className={styles.statsDetails}>
          <p><strong>Correct:</strong> {correctCount} / {totalQuestions}</p>
          <p><strong>Answered:</strong> {answeredCount}</p>
          <p><strong>Time Spent:</strong> {timeString}</p>
          <p><strong>Result:</strong> {passed ? 'PASSED' : 'FAILED'}</p>
        </div>
      </div>

      <div className={styles.reviewSection}>
        <h3 className={styles.reviewTitle}>Question Review</h3>
        {questions.map((q, idx) => {
          const answer = answers.get(idx);
          const isExpanded = expandedQuestion === idx;
          const statusClass = answer ? (answer.isCorrect ? styles.correct : styles.incorrect) : styles.unanswered;

          return (
            <div key={q.id} className={styles.questionCard}>
              <div 
                className={`${styles.questionHeader} ${statusClass}`}
                onClick={() => toggleQuestion(idx)}
              >
                <span>Q{idx + 1}: {q.questionPlain}</span>
                <span>{answer ? (answer.isCorrect ? '✓' : '✗') : '—'}</span>
              </div>
              
              {isExpanded && (
                <div className={styles.questionBody}>
                  <div dangerouslySetInnerHTML={{ __html: q.explanation }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button className="btn-flat" onClick={() => window.location.reload()}>
          Try Again
        </button>
        <button className="btn-outline" onClick={() => router.push('/')} style={{ marginTop: '1rem', width: '100%', padding: '1rem', textAlign: 'center' }}>
          Back to Menu
        </button>
      </div>
    </main>
  );
}
