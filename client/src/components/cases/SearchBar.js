"use client";

import useResponsive from "@/hooks/useResponsive";
import styles from "./SearchBar.module.css";

export default function SearchBar({
  field,
  setField,
  query,
  setQuery,
  onClear,
}) {
  const { isMobile } = useResponsive();

  const fields = [
    "ყველა ველი",
    "#",
    "მოსარჩელე",
    "საიდენთიფიკაციო ნომერი (მოს.)",
    "მოპასუხე",
    "საიდენთიფიკაციო ნომერი (მოპ.)",
    "მოთხოვნის ოდენობა",
    "განმხილველი ორგანო",
    "საქმის ნომერი",
    "კომენტარი",
  ];

  return (
    <div className={styles.searchBar}>
      <div className={styles.filterGroup}>
        <label className={styles.label}>ფილტრი:</label>
        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          className={styles.select}
        >
          {fields.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.searchGroup}>
        <label className={styles.label}>
          <span className={styles.searchIcon}>🔍</span> ძიება:
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="საძიებო სიტყვა..."
            className={styles.input}
          />
          {query && (
            <button
              onClick={onClear}
              className={styles.clearButton}
              aria-label="გასუფთავება"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
