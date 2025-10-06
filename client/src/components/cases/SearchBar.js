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
    {
      value: "საიდენთიფიკაციო ნომერი (მოს.)",
      label: "პირადი ნომერი (მოს.)",
      icon: "🆔",
    },
    { value: "მოპასუხე", label: "მოპასუხე", icon: "👥" },
    {
      value: "საიდენთიფიკაციო ნომერი (მოპ.)",
      label: "პირადი ნომერი (მოპ.)",
      icon: "🆔",
    },
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
            placeholder={`ძიება ${
              selectedField.label === "ყველა ველი"
                ? "ყველა ველში"
                : `"${selectedField.label}"-ში`
            }...`}
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
          className={`${styles.filterToggle} ${
            showFilters ? styles.active : ""
          }`}
          title={`ფილტრი: ${selectedField.label}`}
        >
          <span className={styles.selectedFilter} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="1em"
              height="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" stroke="currentColor" strokeWidth="2">
                <line color="black" x1="3" y1="6" x2="21" y2="6" />
                <circle color="black" fill="black" cx="8" cy="6" r="3" />

                <line color="black" x1="3" y1="12" x2="21" y2="12" />
                <circle color="black" fill="black" cx="16" cy="12" r="3" />

                <line color="black" x1="3" y1="18" x2="21" y2="18" />
                <circle color="black" fill="black" cx="10" cy="18" r="3" />
              </g>
            </svg>
          </span>
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
                className={`${styles.pill} ${
                  field === f.value ? styles.pillActive : ""
                }`}
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
