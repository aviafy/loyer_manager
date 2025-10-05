"use client";

import styles from "./CaseCard.module.css";

export default function CaseCard({ item, onPress, selected }) {
  return (
    <button
      onClick={onPress}
      className={`${styles.card} ${selected ? styles.selected : ""}`}
    >
      <div className={styles.header}>
        <div className={styles.caseNumber}>
          {item.case_number || "ნომრის გარეშე"}
        </div>
        {item.amount && <div className={styles.amount}>{item.amount}</div>}
      </div>

      <div className={styles.body}>
        <div className={styles.row}>
          <span className={styles.label}>მოსარჩელე:</span>
          <span className={styles.value}>{item.plaintiff || "—"}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>მოპასუხე:</span>
          <span className={styles.value}>{item.defendant || "—"}</span>
        </div>

        {item.court && <div className={styles.court}>📍 {item.court}</div>}

        {(item.hearing_date || item.initiation_date) && (
          <div className={styles.date}>
            📅 {item.hearing_date || item.initiation_date}
          </div>
        )}
      </div>

      {selected && <div className={styles.selectedBadge}>✓ არჩეული</div>}
    </button>
  );
}
