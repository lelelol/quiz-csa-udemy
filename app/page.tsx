import Link from 'next/link';
import ThemeToggle from '@/app/components/ThemeToggle';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className="app-container">
      <div className="theme-toggle-wrapper">
        <ThemeToggle />
      </div>

      <div className="logo-container">
        <div className="logo-text">servicen<span>o</span>w&reg;</div>
        <div className="logo-sub">CSA - Udemy</div>
      </div>

      <div className={styles.buttonStack}>
        <Link href="/study" className="btn-flat">
          Study Mode
        </Link>
        <Link href="/exam" className="btn-flat">
          Exam Simulation Mode
        </Link>
        <Link href="/practice" className="btn-flat">
          Short Practice Tests (15 questions)
        </Link>
      </div>
    </main>
  );
}
