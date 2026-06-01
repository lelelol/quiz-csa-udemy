'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { QuizQuestion, fetchAllQuizzes, shuffleArray } from '@/app/lib/quizData';
import QuestionCard from '@/app/components/QuestionCard';
import ResultsSummary from '@/app/components/ResultsSummary';
import ThemeToggle from '@/app/components/ThemeToggle';

interface AnswerRecord {
  selected: number[];
  isCorrect: boolean;
}

export default function StudyPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, AnswerRecord>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAllQuizzes();
        let allQuestions: QuizQuestion[] = [];
        data.forEach(q => allQuestions.push(...q.questions));
        setQuestions(shuffleArray(allQuestions));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (loading || showResults) return;
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, showResults]);

  const handleAnswer = useCallback((selected: number[], isCorrect: boolean) => {
    setAnswers(prev => {
      const newAnswers = new Map(prev);
      newAnswers.set(currentIndex, { selected, isCorrect });
      return newAnswers;
    });
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <main className="app-container">
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading questions...</div>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="app-container">
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>No questions found.</div>
      </main>
    );
  }

  if (showResults) {
    return <ResultsSummary questions={questions} answers={answers} timeSpent={timeSpent} mode="study" />;
  }

  const currentQuestion = questions[currentIndex];
  
  // Calculate score based on answers Map
  const correctCount = Array.from(answers.values()).filter(a => a.isCorrect).length;

  return (
    <main className="app-container" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div className="logo-container" style={{ marginBottom: 0, textAlign: 'left' }}>
          <div className="logo-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>servicen<span>o</span>w&reg;</div>
          <div className="logo-sub" style={{ fontSize: '0.8rem', marginTop: 0 }}>CSA</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" className="btn-outline">Restart</Link>
          <ThemeToggle />
        </div>
      </div>
      
      <QuestionCard 
        question={currentQuestion}
        questionIndex={currentIndex}
        totalQuestions={questions.length}
        mode="study"
        onAnswer={handleAnswer}
        showResult={answers.has(currentIndex)}
        score={correctCount}
      />

      {answers.has(currentIndex) && currentIndex < questions.length - 1 && (
        <button className="btn-flat" style={{ marginTop: '1rem', backgroundColor: '#262626', color: '#fff' }} onClick={handleNext}>
          Next Question
        </button>
      )}

      {answers.has(currentIndex) && currentIndex === questions.length - 1 && (
        <button className="btn-flat" style={{ marginTop: '1rem', backgroundColor: '#262626', color: '#fff' }} onClick={() => setShowResults(true)}>
          See Results
        </button>
      )}
    </main>
  );
}
