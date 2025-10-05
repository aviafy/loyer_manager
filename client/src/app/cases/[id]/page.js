"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import http from "@/lib/http";
import styles from "./page.module.css";

export default function CaseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    http
      .get(`/cases/${id}`)
      .then((r) => {
        if (!isMounted) return;
        setData(r.data || null);
        setError("");
      })
      .catch(() => {
        if (!isMounted) return;
        setError("ვერ მოვძებნეთ ჩანაწერი");
        setData(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const DetailRow = ({ label, value }) => (
    <div className={styles.detailRow}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value || "—"}</div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.backButton}>
          <button onClick={() => router.back()} className="secondary">
            ← უკან დაბრუნება
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>📄 საქმის დეტალები</h2>
          </div>

          <div className={styles.cardBody}>
            {loading ? (
              <div className={styles.loading}>
                <div className="spinner"></div>
                <p>იტვირთება...</p>
              </div>
            ) : error ? (
              <div className={styles.error}>
                <p>{error}</p>
              </div>
            ) : (
              <div className={styles.details}>
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>მხარეები</h3>
                  <DetailRow label="მოსარჩელე" value={data?.plaintiff} />
                  <DetailRow
                    label="საიდენთიფიკაციო ნომერი (მოს.)"
                    value={data?.plaintiff_id}
                  />
                  <DetailRow label="მოპასუხე" value={data?.defendant} />
                  <DetailRow
                    label="საიდენთიფიკაციო ნომერი (მოპ.)"
                    value={data?.defendant_id}
                  />
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>საქმის ინფორმაცია</h3>
                  <DetailRow label="საქმის ნომერი" value={data?.case_number} />
                  <DetailRow label="მოთხოვნის ოდენობა" value={data?.amount} />
                  <DetailRow label="განმხილველი ორგანო" value={data?.court} />
                  <DetailRow
                    label="წარმოებაში მიღების თარიღი"
                    value={data?.initiation_date}
                  />
                  <DetailRow
                    label="სხდომის თარიღი"
                    value={data?.hearing_date}
                  />
                </div>

                {data?.notes && (
                  <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>კომენტარი</h3>
                    <div className={styles.notesBox}>{data.notes}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
