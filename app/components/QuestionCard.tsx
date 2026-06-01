'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuizQuestion, letterToIndex } from '@/app/lib/quizData';
import styles from './QuestionCard.module.css';

interface QuestionCardProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  mode: 'study' | 'exam' | 'practice';
  onAnswer: (selected: number[], isCorrect: boolean) => void;
  showResult: boolean;
  score?: number; // Optional score prop from parent
}

export default function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  mode,
  onAnswer,
  showResult,
  score,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const isMultiSelect = question.assessmentType === 'multi-select';

  useEffect(() => {
    setSelected([]);
    setSubmitted(false);
    setIsCorrect(false);
  }, [question.id, questionIndex]);

  const checkCorrectness = useCallback(
    (sel: number[]): boolean => {
      const correctIndices = question.correctResponse.map((l) => letterToIndex(l));
      if (sel.length !== correctIndices.length) return false;
      const sortedSel = [...sel].sort();
      const sortedCorrect = [...correctIndices].sort();
      return sortedSel.every((v, i) => v === sortedCorrect[i]);
    },
    [question.correctResponse]
  );

  const handleOptionClick = (index: number) => {
    if (submitted || (showResult && mode !== 'study')) return;

    if (isMultiSelect) {
      setSelected((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setSelected([index]);
    }
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;
    const correct = checkCorrectness(selected);
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswer(selected, correct);
  };

  const displayResult = mode === 'study' ? submitted : showResult;
  const correctIndices = question.correctResponse.map((l) => letterToIndex(l));

  const getOptionClass = (index: number): string => {
    const isSelected = selected.includes(index);
    let classes = [styles.option];
    
    if (isSelected) classes.push(styles.optionSelected);

    if (submitted || (showResult && mode !== 'study')) {
      classes.push(styles.optionDisabled);
    }

    if (displayResult) {
      if (correctIndices.includes(index)) {
        classes.push(styles.optionCorrect);
      } else if (isSelected && !correctIndices.includes(index)) {
        classes.push(styles.optionIncorrect);
      }
    }

    return classes.join(' ');
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span>Question {questionIndex + 1} of {totalQuestions}</span>
        {score !== undefined && <span>Score: {score}</span>}
      </div>

      <div
        className={styles.questionText}
        dangerouslySetInnerHTML={{ __html: question.question }}
      />

      <div className={styles.options}>
        {question.answers.map((answer, index) => {
          const isSelected = selected.includes(index);
          return (
            <div
              key={index}
              className={getOptionClass(index)}
              onClick={() => handleOptionClick(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOptionClick(index);
                }
              }}
            >
              <div
                className={`${styles.checkIndicator} ${
                  isMultiSelect ? styles.checkIndicatorMulti : styles.checkIndicatorSingle
                } ${isSelected ? styles.checkFilled : ''}`}
              >
                {isSelected && (isMultiSelect ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />
                ))}
              </div>

              <div
                className={styles.optionText}
                dangerouslySetInnerHTML={{ __html: answer }}
              />
            </div>
          );
        })}
      </div>

      {!submitted && mode === 'study' && (
        <div className={styles.actions}>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={selected.length === 0}
          >
            {selected.length === 0 ? 'Selecione para continuar' : 'Check Answer'}
          </button>
        </div>
      )}

      {!submitted && mode !== 'study' && (
        <div className={styles.actions}>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={selected.length === 0}
          >
            {selected.length === 0 ? 'Selecione para continuar' : 'Submit Answer'}
          </button>
        </div>
      )}

      {displayResult && (
        <div className={styles.resultArea}>
          <div className={styles.explanationBox}>
            <div className={styles.explanationTitle}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </div>
            <div
              className={styles.explanationContent}
              dangerouslySetInnerHTML={{ __html: question.explanation }}
            />
          </div>

          {question.feedbacks && question.feedbacks.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              {question.feedbacks.map((fb, idx) => {
                if (!fb || fb.trim() === '') return null;
                return (
                  <div key={idx} className={styles.feedbackItem}>
                    <div dangerouslySetInnerHTML={{ __html: fb }} />
                  </div>
                );
              })}
            </div>
          )}

          {question.links && question.links.length > 0 && (
            <div className={styles.linksBox}>
              <div className={styles.linksTitle}>Reference Links</div>
              {question.links.map((link, idx) => (
                <a
                  key={idx}
                  className={styles.linkItem}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
