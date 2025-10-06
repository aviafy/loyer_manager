"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/inputs";
import styles from "./TableManager.module.css";

export default function TableManager({
  rows = [],
  columns = [],
  sortState,
  onSort,
  selectedId,
  onSelect,
  onRowDoubleClick,
  renderCell,
  onExport,
  exportLabel = "📤 Excel ექსპორტი",
  emptyMessage = "ჩანაწერები არ მოიძებნა",
  showExport = true,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRows = rows.slice(startIndex, endIndex);

  // Reset to page 1 when rows change
  useEffect(() => {
    setCurrentPage(1);
  }, [rows.length]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (e) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const defaultRenderCell = (row, rowIndex, col) => {
    if (col.key === "rownum") {
      return startIndex + rowIndex + 1;
    }
    if (col.key === "case_number") {
      return row.case_number ? (
        <Link
          href={`/cases/${row._id}`}
          onClick={(e) => e.stopPropagation()}
          className={styles.link}
        >
          {row.case_number}
        </Link>
      ) : (
        "—"
      );
    }
    if (col.key === "notes") {
      return row.notes ? <div className={styles.notes}>{row.notes}</div> : "—";
    }
    if (col.key === "amount") {
      return row.amount || "—";
    }
    const value = row[col.key];
    return value || "—";
  };

  const cellRenderer = renderCell || defaultRenderCell;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((h) => (
                <th
                  key={h.key}
                  className={`${styles.th} ${styles[h.align || "left"]}`}
                  onClick={() => onSort && onSort(h.key)}
                >
                  <div className={styles.headerContent}>
                    <span>{h.label}</span>
                    {sortState?.key === h.key && (
                      <span className={styles.sortIcon}>
                        {sortState.asc ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.emptyState}>
                  <div className={styles.emptyContent}>
                    <span className={styles.emptyIcon}>📭</span>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRows.map((r, idx) => (
                <tr
                  key={r._id || idx}
                  className={`${styles.row} ${
                    selectedId && r._id === selectedId ? styles.selected : ""
                  }`}
                  onClick={() => onSelect && onSelect(r)}
                  onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(r)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`${styles.td} ${styles[col.align || "left"]}`}
                    >
                      {cellRenderer(r, idx, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <div className={styles.rowsPerPageControl}>
            <label htmlFor="rowsPerPage">მწკრივები:</label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className={styles.select}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="250">250</option>
            </select>
          </div>
        </div>

        <div className={styles.footerCenter}>
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ←
              </button>

              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    className={`${styles.pageButton} ${
                      currentPage === page ? styles.active : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className={styles.pageButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                →
              </button>
            </div>
          )}
        </div>

        <div className={styles.footerRight}>
          {showExport && onExport && (
            <Button onClick={onExport} variant="secondary" size="small">
              {exportLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
