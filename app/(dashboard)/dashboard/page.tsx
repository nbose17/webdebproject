import styles from './page.module.css';

export default function DashboardPage() {
  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome to your dashboard</p>
      </div>
    </div>
  );
}


