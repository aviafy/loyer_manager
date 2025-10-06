"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import http from "@/lib/http";
import styles from "./shared.module.css";

export default function SharedCasePage() {
  const params = useParams();
  const token = params.token;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [submittingPassword, setSubmittingPassword] = useState(false);

  useEffect(() => {
    verifyLink();
  }, [token]);

  const verifyLink = async (pwd = "") => {
    setLoading(true);
    setError("");

    try {
      const params = pwd ? { password: pwd } : {};
      const response = await http.get(`/shareable-links/${token}/verify`, {
        params,
      });

      setData(response.data.case);
      setRequiresPassword(false);
    } catch (err) {
      const errorData = err.response?.data;

      if (errorData?.requiresPassword) {
        setRequiresPassword(true);
        setError("");
      } else {
        setError(errorData?.error || "Failed to load case");
        setRequiresPassword(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSubmittingPassword(true);
    await verifyLink(password);
    setSubmittingPassword(false);
  };

  const DetailRow = ({ label, value }) => (
    <div className={styles.detailRow}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value || "—"}</div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>🔗 Shared Case View</h2>
          <p className={styles.subtitle}>
            Read-only access to case information
          </p>
        </div>

        <div className={styles.card}>
          {loading ? (
            <div className={styles.loading}>
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          ) : requiresPassword ? (
            <div className={styles.passwordForm}>
              <h3>🔒 Password Required</h3>
              <p>
                This link is password protected. Please enter the password to
                view.
              </p>
              <form onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <button type="submit" disabled={submittingPassword}>
                  {submittingPassword ? "Verifying..." : "🔓 Unlock"}
                </button>
              </form>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <h3>❌ Error</h3>
              <p>{error}</p>
            </div>
          ) : data ? (
            <div className={styles.details}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>მხარეები</h3>
                <DetailRow label="მოსარჩელე" value={data.plaintiff} />
                <DetailRow
                  label="საიდენთიფიკაციო ნომერი (მოს.)"
                  value={data.plaintiff_id}
                />
                <DetailRow label="მოპასუხე" value={data.defendant} />
                <DetailRow
                  label="საიდენთიფიკაციო ნომერი (მოპ.)"
                  value={data.defendant_id}
                />
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>საქმის ინფორმაცია</h3>
                <DetailRow label="საქმის ნომერი" value={data.case_number} />
                <DetailRow label="მოთხოვნის ოდენობა" value={data.amount} />
                <DetailRow label="განმხილველი ორგანო" value={data.court} />
                <DetailRow label="მოსამართლე" value={data.judge} />
                <DetailRow
                  label="წარმოებაში მიღების თარიღი"
                  value={data.initiation_date}
                />
                <DetailRow label="სხდომის თარიღი" value={data.hearing_date} />
              </div>

              {data.notes && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>კომენტარი</h3>
                  <div className={styles.notesBox}>{data.notes}</div>
                </div>
              )}

              <div className={styles.watermark}>
                🔒 This is a read-only shared view
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
