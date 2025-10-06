"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import http from "@/lib/http";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import Modal from "@/components/ui/Modal";
import styles from "./page.module.css";

function CaseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { isStaffOrAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareableLinks, setShareableLinks] = useState([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkForm, setLinkForm] = useState({
    expiresInDays: "30",
    recipientEmail: "",
    password: "",
  });

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

  const loadShareableLinks = useCallback(async () => {
    try {
      const response = await http.get(`/shareable-links/case/${id}`);
      setShareableLinks(response.data.data || []);
    } catch (error) {
      console.error("Failed to load shareable links:", error);
    }
  }, [id]);

  useEffect(() => {
    if (id && isStaffOrAdmin) {
      loadShareableLinks();
    }
  }, [id, isStaffOrAdmin, loadShareableLinks]);

  const handleCreateLink = async (e) => {
    e.preventDefault();
    try {
      await http.post("/shareable-links", {
        caseId: id,
        expiresInDays: linkForm.expiresInDays
          ? parseInt(linkForm.expiresInDays, 10)
          : undefined,
        recipientEmail: linkForm.recipientEmail || undefined,
        password: linkForm.password || undefined,
      });
      await loadShareableLinks();
      setShowLinkModal(false);
      setLinkForm({ expiresInDays: "30", recipientEmail: "", password: "" });
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create link");
    }
  };

  const handleRevokeLink = async (linkId) => {
    if (confirm("Are you sure you want to revoke this link?")) {
      try {
        await http.put(`/shareable-links/${linkId}/revoke`);
        await loadShareableLinks();
      } catch (error) {
        alert(error.response?.data?.error || "Failed to revoke link");
      }
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
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

                {isStaffOrAdmin && (
                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h3 className={styles.sectionTitle}>
                        🔗 Shareable Links
                      </h3>
                      <button
                        onClick={() => setShowLinkModal(true)}
                        className={styles.createLinkBtn}
                      >
                        ➕ Create Link
                      </button>
                    </div>

                    {shareableLinks.length === 0 ? (
                      <p className={styles.noLinks}>
                        No shareable links created yet
                      </p>
                    ) : (
                      <div className={styles.linksList}>
                        {shareableLinks.map((link) => (
                          <div key={link._id} className={styles.linkCard}>
                            <div className={styles.linkInfo}>
                              <div className={styles.linkStatus}>
                                <span
                                  className={`${styles.statusBadge} ${
                                    styles[link.status]
                                  }`}
                                >
                                  {link.status}
                                </span>
                                {link.recipientEmail && (
                                  <span className={styles.recipientEmail}>
                                    📧 {link.recipientEmail}
                                  </span>
                                )}
                                {link.password && (
                                  <span className={styles.passwordProtected}>
                                    🔒 Password Protected
                                  </span>
                                )}
                              </div>
                              <div className={styles.linkUrl}>{link.url}</div>
                              <div className={styles.linkMeta}>
                                <span>Accessed: {link.accessCount} times</span>
                                {link.expiresAt && (
                                  <span>
                                    Expires:{" "}
                                    {new Date(
                                      link.expiresAt
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className={styles.linkActions}>
                              <button
                                onClick={() => handleCopyLink(link.url)}
                                className={styles.copyBtn}
                              >
                                📋 Copy
                              </button>
                              {link.status === "active" && (
                                <button
                                  onClick={() => handleRevokeLink(link._id)}
                                  className={styles.revokeBtn}
                                >
                                  ❌ Revoke
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {showLinkModal && (
          <Modal
            title="🔗 Create Shareable Link"
            onClose={() => setShowLinkModal(false)}
          >
            <form onSubmit={handleCreateLink} className={styles.linkForm}>
              <div className={styles.field}>
                <label>Expires in (days)</label>
                <input
                  type="number"
                  value={linkForm.expiresInDays}
                  onChange={(e) =>
                    setLinkForm((f) => ({
                      ...f,
                      expiresInDays: e.target.value,
                    }))
                  }
                  placeholder="30"
                  min="1"
                />
                <small>Leave empty for no expiration</small>
              </div>

              <div className={styles.field}>
                <label>Recipient Email (Optional)</label>
                <input
                  type="email"
                  value={linkForm.recipientEmail}
                  onChange={(e) =>
                    setLinkForm((f) => ({
                      ...f,
                      recipientEmail: e.target.value,
                    }))
                  }
                  placeholder="recipient@example.com"
                />
                <small>Restrict access to specific email</small>
              </div>

              <div className={styles.field}>
                <label>Password (Optional)</label>
                <input
                  type="password"
                  value={linkForm.password}
                  onChange={(e) =>
                    setLinkForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="Enter password"
                />
                <small>Add password protection</small>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="secondary"
                >
                  ❌ Cancel
                </button>
                <button type="submit">✅ Create Link</button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default function ProtectedCaseDetailsPage() {
  return (
    <ProtectedRoute>
      <CaseDetailsPage />
    </ProtectedRoute>
  );
}
