import Link from 'next/link';
import ThemeToggle from '@/app/components/ThemeToggle';
import styles from './practice.module.css';

export default function PracticeSelectionPage() {
  // We have 6 quizzes * 4 parts = 24 Simulados total.
  // The user requested a grid like "Simulado 1" to "Simulado 19" in the screenshot. 
  // We'll generate the 24 simulating the 24 parts available.
  const simulados = Array.from({ length: 24 }, (_, i) => {
    const num = i + 1;
    const quizId = Math.floor(i / 4) + 1; // 1 to 6
    const partId = (i % 4) + 1;           // 1 to 4
    return { name: `Simulado ${num}`, href: `/practice/${quizId}/${partId}` };
  });

  return (
    <main className="app-container">
      <div className="theme-toggle-wrapper">
        <ThemeToggle />
      </div>

      <div className="logo-container">
        <div className="logo-text">servicen<span>o</span>w&reg;</div>
        <div className="logo-sub">CSA</div>
      </div>

      <h2 className={styles.pageTitle}>Select a short simulate:</h2>

      <div className={styles.grid}>
        {simulados.map((sim, index) => (
          <Link key={index} href={sim.href} className="btn-flat">
            {sim.name}
          </Link>
        ))}
      </div>

      <div className={styles.backButtonWrapper}>
        <Link href="/" className="btn-outline">
          Back to Menu
        </Link>
      </div>
    </main>
  );
}
