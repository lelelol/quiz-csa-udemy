import Link from 'next/link';
import ThemeToggle from '@/app/components/ThemeToggle';
import styles from './exam.module.css';

export default function ExamSelectionPage() {
  const exams = Array.from({ length: 6 }, (_, i) => {
    const num = i + 1;
    return { name: `Exam Simulation ${num}`, href: `/exam/${num}` };
  });

  return (
    <main className="app-container">
      <div className="theme-toggle-wrapper">
        <ThemeToggle />
      </div>

      <div className="logo-container" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="logo-text" style={{ fontSize: '2rem' }}>servicen<span>o</span>w&reg;</div>
          <div className="logo-sub" style={{ fontSize: '1rem', marginTop: '-0.3rem', marginLeft: '0.2rem' }}>CSA</div>
        </div>
      </div>

      <h2 className={styles.pageTitle}>Select an Exam Simulation:</h2>

      <div className={styles.grid}>
        {exams.map((exam, index) => (
          <Link key={index} href={exam.href} className="btn-flat">
            {exam.name}
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
