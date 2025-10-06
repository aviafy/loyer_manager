"use client";

import { useState } from "react";
import { customerService } from "@/services";
import CustomerModal from "./CustomerModal";
import styles from "./CustomerSelector.module.css";

export default function CustomerSelector({
  label,
  value,
  onChange,
  error,
  placeholder = "მოძებნეთ კლიენტი...",
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = async (searchText) => {
    setQuery(searchText);

    if (searchText.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const results = await customerService.search(searchText);
      setSuggestions(results);
      setShowDropdown(true);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (customer) => {
    onChange(customer);
    setQuery("");
    setShowDropdown(false);
  };

  const handleRemove = () => {
    onChange(null);
    setQuery("");
  };

  const handleCreateNew = () => {
    setShowModal(true);
    setShowDropdown(false);
  };

  const handleCustomerCreated = (newCustomer) => {
    onChange(newCustomer);
    setShowModal(false);
  };

  if (value) {
    // Show selected customer
    return (
      <div className={styles.wrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.selectedCard}>
          <div className={styles.selectedIcon}>👤</div>
          <div className={styles.selectedInfo}>
            <div className={styles.selectedName}>{value.name}</div>
            {value.email && <div className={styles.selectedDetail}>📧 {value.email}</div>}
            {value.phone && <div className={styles.selectedDetail}>📞 {value.phone}</div>}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className={styles.removeBtn}
            title="წაშლა"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.searchBox}>
        <div className={styles.inputWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={`${styles.input} ${error ? styles.error : ""}`}
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query.length >= 2 && setShowDropdown(true)}
          />
          {loading && <span className={styles.spinner}>⏳</span>}
        </div>

        {showDropdown && (
          <div className={styles.dropdown}>
            {suggestions.length === 0 ? (
              <div className={styles.noResults}>
                <p className={styles.noResultsText}>😕 კლიენტი ვერ მოიძებნა</p>
                <button
                  type="button"
                  className={styles.createBtn}
                  onClick={handleCreateNew}
                >
                  ➕ ახალი კლიენტის დამატება
                </button>
              </div>
            ) : (
              <>
                <div className={styles.suggestions}>
                  {suggestions.map((customer) => (
                    <button
                      key={customer._id}
                      type="button"
                      className={styles.suggestion}
                      onClick={() => handleSelect(customer)}
                    >
                      <div className={styles.suggestionIcon}>👤</div>
                      <div className={styles.suggestionInfo}>
                        <div className={styles.suggestionName}>{customer.name}</div>
                        {customer.email && (
                          <div className={styles.suggestionDetail}>📧 {customer.email}</div>
                        )}
                        {customer.phone && (
                          <div className={styles.suggestionDetail}>📞 {customer.phone}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.createBtnBottom}
                  onClick={handleCreateNew}
                >
                  ➕ ახალი კლიენტის დამატება
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {error && <div className={styles.errorText}>{error}</div>}

      {showModal && (
        <CustomerModal
          onClose={() => setShowModal(false)}
          onSave={handleCustomerCreated}
        />
      )}
    </div>
  );
}
