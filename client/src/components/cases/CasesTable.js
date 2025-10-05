"use client";

import Link from "next/link";
import styles from "./CasesTable.module.css";

export default function CasesTable({
  rows = [],
  onRowDoubleClick,
  onSort,
  sortState,
  selectedId,
  onSelect,
}) {
  const columns = [
    { key: "rownum", label: "#", align: "center" },
    { key: "plaintiff", label: "მოსარჩელე" },
    { key: "plaintiff_id", label: "საიდენთ. ნომერი (მოს.)" },
    { key: "defendant", label: "მოპასუხე" },
    { key: "defendant_id", label: "საიდენთ. ნომერი (მოპ.)" },
    { key: "amount", label: "მოთხოვნის ოდენობა", align: "right" },
    { key: "court", label: "განმხილველი ორგანო" },
    { key: "case_number", label: "საქმის ნომერი" },
    { key: "notes", label: "კომენტარი" },
  ];

  const renderCell = (row, rowIndex, col) => {
    if (col.key === "rownum") return rowIndex + 1;
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

  return (
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
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.emptyState}>
                <div className={styles.emptyContent}>
                  <span className={styles.emptyIcon}>📭</span>
                  <p>ჩანაწერები არ მოიძებნა</p>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((r, idx) => (
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
                    {renderCell(r, idx, col)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
