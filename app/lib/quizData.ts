/* ============================================
   Quiz Data — Types & Utilities
   ============================================ */

// ---- Raw JSON shape coming from /public/data/quizN.json ----

interface RawPrompt {
  question: string;
  feedbacks: string[];
  explanation: string;
  answers: string[];
  links: string[];
}

interface RawAssessment {
  _class: string;
  id: number;
  assessment_type: 'multi-select' | 'multiple-choice';
  prompt: RawPrompt;
  correct_response: string[];
  section: string;
  question_plain: string;
}

interface RawQuizFile {
  count: number;
  results: RawAssessment[];
}

// ---- Public types ----

export interface QuizQuestion {
  id: number;
  assessmentType: 'multiple-choice' | 'multi-select';
  question: string;
  questionPlain: string;
  answers: string[];
  correctResponse: string[];
  explanation: string;
  feedbacks: string[];
  section: string;
  links: string[];
  quizIndex: number;
}

export interface QuizData {
  id: number;
  name: string;
  count: number;
  questions: QuizQuestion[];
}

// ---- Quiz names ----

const QUIZ_NAMES: Record<number, string> = {
  1: 'Practice Test 1',
  2: 'Practice Test 2',
  3: 'Practice Test 3',
  4: 'Practice Test 4',
  5: 'Practice Test 5',
  6: 'Practice Test 6',
};

// ---- Fetch helpers ----

function mapRawToQuestion(raw: RawAssessment, quizIndex: number): QuizQuestion {
  return {
    id: raw.id,
    assessmentType: raw.assessment_type,
    question: raw.prompt.question,
    questionPlain: raw.question_plain,
    answers: raw.prompt.answers,
    correctResponse: raw.correct_response,
    explanation: raw.prompt.explanation,
    feedbacks: raw.prompt.feedbacks,
    section: raw.section,
    links: raw.prompt.links,
    quizIndex,
  };
}

/**
 * Fetch a single quiz by its 1-based ID (1–6).
 */
export async function fetchQuiz(quizId: number): Promise<QuizData> {
  const res = await fetch(`/data/quiz${quizId}.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch quiz ${quizId}: ${res.status} ${res.statusText}`);
  }

  const raw: RawQuizFile = await res.json();

  return {
    id: quizId,
    name: QUIZ_NAMES[quizId] ?? `Practice Test ${quizId}`,
    count: raw.count,
    questions: raw.results.map((r) => mapRawToQuestion(r, quizId)),
  };
}

/**
 * Fetch all six quizzes in parallel.
 */
export async function fetchAllQuizzes(): Promise<QuizData[]> {
  const ids = [1, 2, 3, 4, 5, 6];
  const quizzes = await Promise.all(ids.map(fetchQuiz));
  return quizzes;
}

// ---- Utility functions ----

/**
 * Shuffle an array in place using the Fisher-Yates algorithm.
 * Returns a new shuffled array (does not mutate the original).
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Partition an array into chunks of a given size.
 * The last chunk may be smaller than `size`.
 */
export function partitionArray<T>(array: T[], size: number): T[][] {
  if (size <= 0) throw new Error('Chunk size must be greater than 0');
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Map a letter code to a 0-based index.
 * 'a' → 0, 'b' → 1, 'c' → 2, etc.
 */
export function letterToIndex(letter: string): number {
  return letter.toLowerCase().charCodeAt(0) - 97; // 'a' = 97
}

/**
 * Check whether the user's selected answer indices match the correct response.
 *
 * @param selected  - Array of 0-based indices the user selected
 * @param correctResponse - Array of letter codes from the quiz data (e.g. ['a','c'])
 * @returns `true` if the selection exactly matches the correct answers
 */
export function checkAnswer(selected: number[], correctResponse: string[]): boolean {
  const correctIndices = correctResponse.map(letterToIndex).sort((a, b) => a - b);
  const sortedSelected = [...selected].sort((a, b) => a - b);

  if (correctIndices.length !== sortedSelected.length) return false;
  return correctIndices.every((val, idx) => val === sortedSelected[idx]);
}
