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
  const headers = [
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

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((h) => (
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
              <td colSpan={headers.length} className={styles.emptyState}>
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
                <td className={`${styles.td} ${styles.center}`}>{idx + 1}</td>
                <td className={styles.td}>{r.plaintiff || "—"}</td>
                <td className={styles.td}>{r.plaintiff_id || "—"}</td>
                <td className={styles.td}>{r.defendant || "—"}</td>
                <td className={styles.td}>{r.defendant_id || "—"}</td>
                <td className={`${styles.td} ${styles.right}`}>
                  {r.amount || "—"}
                </td>
                <td className={styles.td}>{r.court || "—"}</td>
                <td className={styles.td}>
                  {r.case_number ? (
                    <Link
                      href={`/cases/${r._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className={styles.link}
                    >
                      {r.case_number}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className={styles.td}>
                  {r.notes ? (
                    <div className={styles.notes}>{r.notes}</div>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
