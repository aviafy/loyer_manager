"use client";

import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.content}>
          <Link href="/" className={styles.logo}>
            <span className={styles.icon}>⚖️</span>
            <h1 className={styles.title}>საქმის მენეჯერი</h1>
          </Link>
        </div>
      </div>
    </header>
  );
}
