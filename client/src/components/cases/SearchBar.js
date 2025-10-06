"use client";

import { useState } from "react";
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
  const [showFilters, setShowFilters] = useState(false);

  const fields = [
    { value: "ყველა ველი", label: "ყველა ველი", icon: "🔍" },
    { value: "#", label: "#", icon: "🔢" },
    { value: "მოსარჩელე", label: "მოსარჩელე", icon: "👤" },
    { value: "საიდენთიფიკაციო ნომერი (მოს.)", label: "პირადი ნომერი (მოს.)", icon: "🆔" },
    { value: "მოპასუხე", label: "მოპასუხე", icon: "👥" },
    { value: "საიდენთიფიკაციო ნომერი (მოპ.)", label: "პირადი ნომერი (მოპ.)", icon: "🆔" },
    { value: "მოთხოვნის ოდენობა", label: "თანხა", icon: "💰" },
    { value: "განმხილველი ორგანო", label: "სასამართლო", icon: "⚖️" },
    { value: "საქმის ნომერი", label: "საქმის ნომერი", icon: "📋" },
    { value: "კომენტარი", label: "კომენტარი", icon: "💬" },
  ];

  const selectedField = fields.find((f) => f.value === field) || fields[0];

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchContainer}>
        {/* Main Search Input */}
        <div className={styles.inputWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`ძიება ${selectedField.label === "ყველა ველი" ? "ყველა ველში" : `"${selectedField.label}"-ში`}...`}
            className={styles.input}
          />
          {query && (
            <button
              onClick={onClear}
              className={styles.clearButton}
              aria-label="გასუფთავება"
              title="გასუფთავება"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`${styles.filterToggle} ${showFilters ? styles.active : ""}`}
          title={`ფილტრი: ${selectedField.label}`}
        >
          <span className={styles.selectedFilter}>🎛️</span>
        </button>
      </div>

      {/* Filter Pills */}
      {showFilters && (
        <div className={styles.filterPills}>
          <div className={styles.pillsHeader}>
            <span className={styles.pillsTitle}>აირჩიეთ ველი:</span>
          </div>
          <div className={styles.pillsContainer}>
            {fields.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setField(f.value);
                  if (!isMobile) {
                    setShowFilters(false);
                  }
                }}
                className={`${styles.pill} ${field === f.value ? styles.pillActive : ""}`}
              >
                <span className={styles.pillIcon}>{f.icon}</span>
                <span className={styles.pillLabel}>{f.label}</span>
                {field === f.value && (
                  <span className={styles.pillCheck}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filter Badge */}
      {field !== "ყველა ველი" && (
        <div className={styles.activeFilterBadge}>
          <span className={styles.badgeIcon}>{selectedField.icon}</span>
          <span className={styles.badgeText}>
            ფილტრი: <strong>{selectedField.label}</strong>
          </span>
          <button
            onClick={() => setField("ყველა ველი")}
            className={styles.badgeRemove}
            title="ფილტრის გაუქმება"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
