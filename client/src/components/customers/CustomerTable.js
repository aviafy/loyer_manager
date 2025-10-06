"use client";

import styles from "./CustomerTable.module.css";

export default function CustomerTable({ customers, onEdit, onDelete }) {
  if (customers.length === 0) {
    return (
      <div className={styles.empty}>
        <p>კლიენტები არ მოიძებნა</p>
        <p className={styles.emptyHint}>
          დააჭირეთ "+ ახალი კლიენტი" ღილაკს რომ დაამატოთ პირველი კლიენტი
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>სახელი</th>
            <th>ელ. ფოსტა</th>
            <th>ტელეფონი</th>
            <th>პირადი ნომერი</th>
            <th>მოქმედებები</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td>
                <div className={styles.nameCell}>
                  <div className={styles.customerName}>{customer.name}</div>
                  {customer.address && (
                    <div className={styles.customerAddress}>{customer.address}</div>
                  )}
                </div>
              </td>
              <td>{customer.email || "-"}</td>
              <td>{customer.phone || "-"}</td>
              <td>{customer.nationalId || "-"}</td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => onEdit(customer)}
                    title="რედაქტირება"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => onDelete(customer._id)}
                    title="წაშლა"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
