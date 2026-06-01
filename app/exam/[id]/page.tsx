'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { QuizQuestion, fetchQuiz } from '@/app/lib/quizData';
import QuestionCard from '@/app/components/QuestionCard';
import ResultsSummary from '@/app/components/ResultsSummary';
import ThemeToggle from '@/app/components/ThemeToggle';
import Timer from '@/app/components/Timer';

interface AnswerRecord {
  selected: number[];
  isCorrect: boolean;
}

export default function ExamSimulationPage() {
  const params = useParams();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, AnswerRecord>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  
  // 90 minutes
  const TOTAL_SECONDS = 90 * 60;
  
  useEffect(() => {
    async function loadData() {
      try {
        const quizId = Number(params.id);
        const data = await fetchQuiz(quizId);
        setQuestions(data.questions);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      loadData();
    }
  }, [params.id]);

  useEffect(() => {
    if (loading || showResults) return;
    const t = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [loading, showResults]);

  const handleAnswer = useCallback((selected: number[], isCorrect: boolean) => {
    setAnswers(prev => {
      const newAnswers = new Map(prev);
      newAnswers.set(currentIndex, { selected, isCorrect });
      return newAnswers;
    });
    // Auto-advance logic for Exam mode (or wait for explicit Next)
    // We'll keep it manual to let the user choose.
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleTimeUp = () => {
    setShowResults(true);
  };

  if (loading) {
    return (
      <main className="app-container">
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading exam...</div>
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
    return <ResultsSummary questions={questions} answers={answers} timeSpent={timeSpent} mode="exam" />;
  }

  const currentQuestion = questions[currentIndex];
  
  return (
    <main className="app-container" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div className="logo-container" style={{ marginBottom: 0, textAlign: 'left' }}>
          <div className="logo-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>servicen<span>o</span>w&reg;</div>
          <div className="logo-sub" style={{ fontSize: '0.8rem', marginTop: 0 }}>CSA</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Timer totalSeconds={TOTAL_SECONDS} onTimeUp={handleTimeUp} isRunning={!showResults} />
          <button className="btn-outline" onClick={() => setShowResults(true)}>Submit</button>
          <Link href="/exam" className="btn-outline">Restart</Link>
          <ThemeToggle />
        </div>
      </div>
      
      <QuestionCard 
        question={currentQuestion}
        questionIndex={currentIndex}
        totalQuestions={questions.length}
        mode="exam"
        onAnswer={handleAnswer}
        showResult={answers.has(currentIndex)}
      />

      {answers.has(currentIndex) && currentIndex < questions.length - 1 && (
        <button className="btn-flat" style={{ marginTop: '1rem', backgroundColor: '#262626', color: '#fff' }} onClick={handleNext}>
          Next Question
        </button>
      )}

      {answers.has(currentIndex) && currentIndex === questions.length - 1 && (
        <button className="btn-flat" style={{ marginTop: '1rem', backgroundColor: '#262626', color: '#fff' }} onClick={() => setShowResults(true)}>
          Submit Exam
        </button>
      )}
    </main>
  );
}
