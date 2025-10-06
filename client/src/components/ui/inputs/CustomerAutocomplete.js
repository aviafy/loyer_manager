"use client";

import { useState, useEffect, useRef } from "react";
import { customerService } from "@/services";
import styles from "./CustomerAutocomplete.module.css";

export default function CustomerAutocomplete({
  label,
  required = false,
  value, // customer object or null
  onChange,
  onCreateNew,
  error,
  className = "",
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search customers
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await customerService.search(query);
        setSuggestions(results);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (customer) => {
    onChange(customer);
    setQuery("");
    setShowDropdown(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
  };

  const handleCreateNew = () => {
    setShowCreateForm(true);
    setShowDropdown(false);
  };

  const displayValue = value ? `${value.name}${value.email ? ` (${value.email})` : ""}` : "";

  return (
    <div className={`${styles.wrapper} ${className}`} ref={wrapperRef}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {value ? (
        <div className={styles.selected}>
          <div className={styles.selectedInfo}>
            <div className={styles.selectedName}>{value.name}</div>
            {value.email && <div className={styles.selectedDetail}>{value.email}</div>}
            {value.phone && <div className={styles.selectedDetail}>{value.phone}</div>}
          </div>
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearBtn}
            title="წაშლა"
          >
            ✕
          </button>
        </div>
      ) : (
        <>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={`${styles.input} ${error ? styles.error : ""}`}
              placeholder="მოძებნეთ კლიენტი..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowDropdown(true)}
            />
            {loading && <span className={styles.spinner}>⏳</span>}
          </div>

          {showDropdown && (
            <div className={styles.dropdown}>
              {suggestions.length === 0 ? (
                <div className={styles.noResults}>
                  <p>არ მოიძებნა შედეგები</p>
                  <button
                    type="button"
                    className={styles.createBtn}
                    onClick={handleCreateNew}
                  >
                    + ახალი კლიენტის დამატება
                  </button>
                </div>
              ) : (
                <>
                  {suggestions.map((customer) => (
                    <div
                      key={customer._id}
                      className={styles.suggestion}
                      onClick={() => handleSelect(customer)}
                    >
                      <div className={styles.suggestionName}>{customer.name}</div>
                      {customer.email && (
                        <div className={styles.suggestionDetail}>{customer.email}</div>
                      )}
                      {customer.phone && (
                        <div className={styles.suggestionDetail}>{customer.phone}</div>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.createBtnBottom}
                    onClick={handleCreateNew}
                  >
                    + ახალი კლიენტის დამატება
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
