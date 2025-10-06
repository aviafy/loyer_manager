"use client";

import { useEffect, useMemo, useState } from "react";
import http from "@/lib/http";
import SearchBar from "@/components/cases/SearchBar";
import TableManager from "@/components/ui/TableManager";
import CaseForm from "@/components/cases/CaseForm";
import CaseCard from "@/components/cases/CaseCard";
import Modal from "@/components/ui/Modal";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/inputs";
import useResponsive from "@/hooks/useResponsive";
import useDebounce from "@/hooks/useDebounce";
import { parseAmount, parseDate } from "@/lib/utils";
import styles from "./page.module.css";

function CasesPage() {
  const { isMobile } = useResponsive();
  const [field, setField] = useState("ყველა ველი");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState({ key: "rownum", asc: true });
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http
      .get("/health")
      .then((r) => {
        setDemo(!!(r.data && r.data.demo));
      })
      .catch(() => {
        // ignore; default demo=false
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    let f = field;
    if (f === "ყველა ველი") f = "";

    http
      .get("/cases", { params: { search: debouncedQuery, field: f } })
      .then((r) => {
        const data = (r.data.data || []).map((item, idx) => ({
          __idx: idx,
          ...item,
        }));
        setRows(data);
        setTotal(data.length);
      })
      .catch(() => {
        setRows([]);
        setTotal(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [field, debouncedQuery]);

  const sorted = useMemo(() => {
    const arr = [...rows];
    const { key, asc } = sort;
    const dir = asc ? 1 : -1;

    arr.sort((a, b) => {
      if (key === "rownum") return 0;
      const va = a[key];
      const vb = b[key];

      if (key === "plaintiff_id" || key === "defendant_id") {
        const sa = String(va || "").replace(/\s+/g, "");
        const sb = String(vb || "").replace(/\s+/g, "");
        const na = /^\d+$/.test(sa) ? parseInt(sa, 10) : Number.NaN;
        const nb = /^\d+$/.test(sb) ? parseInt(sb, 10) : Number.NaN;
        if (!Number.isNaN(na) && !Number.isNaN(nb)) return (na - nb) * dir;
        return String(va || "").localeCompare(String(vb || "")) * dir;
      }

      if (key === "amount") {
        return (parseAmount(va) - parseAmount(vb)) * dir;
      }

      if (key === "initiation_date" || key === "hearing_date") {
        const da = parseDate(va) || new Date(0);
        const db = parseDate(vb) || new Date(0);
        return (da - db) * dir;
      }

      const sva = String(va || "")
        .normalize("NFC")
        .toLowerCase();
      const svb = String(vb || "")
        .normalize("NFC")
        .toLowerCase();
      const cmp = sva.localeCompare(svb);
      if (cmp !== 0) return cmp * dir;

      return (a.__idx - b.__idx) * dir;
    });

    return arr;
  }, [rows, sort]);

  const refreshCases = async () => {
    const f = field === "ყველა ველი" ? "" : field;
    const r = await http.get("/cases", {
      params: { search: debouncedQuery, field: f },
    });
    setRows(r.data.data || []);
    setTotal((r.data.data || []).length);
  };

  const handleDelete = async () => {
    if (selected && selected._id) {
      if (confirm("ნამდვილად გსურთ ამ საქმის წაშლა?")) {
        await http.delete(`/cases/${selected._id}`);
        await refreshCases();
        setSelected(null);
      }
    }
  };

  const handleExport = () => {
    const f = field === "ყველა ველი" ? "" : field;
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    window.location.href = `${apiBase}/cases/export?search=${encodeURIComponent(
      debouncedQuery
    )}&field=${encodeURIComponent(f)}`;
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {demo && (
          <div className={styles.demoWarning}>Demo Mode: Writes disabled</div>
        )}

        <div className={styles.toolbar}>
          <div className={styles.searchBarWrapper}>
            <SearchBar
              field={field}
              setField={setField}
              query={query}
              setQuery={setQuery}
              onClear={() => setQuery("")}
            />
          </div>

          <div className={styles.actions}>
            <Button
              onClick={() => {
                setEditing(null);
                setShowModal(true);
              }}
              disabled={demo}
              size="medium"
            >
              ➕ დამატება
            </Button>
            <Button
              onClick={() => {
                if (selected) {
                  setEditing(selected);
                  setShowModal(true);
                }
              }}
              disabled={demo || !selected}
              size="medium"
            >
              ✏️ რედაქტირება
            </Button>
            <Button
              onClick={handleDelete}
              disabled={demo || !selected}
              variant="danger"
              size="medium"
            >
              🗑️ წაშლა
            </Button>
            {/* Export moved to table footer */}
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className="spinner"></div>
            <p>იტვირთება...</p>
          </div>
        ) : (
          <>
            {isMobile ? (
              <div className={styles.cardGrid}>
                {sorted.map((item) => (
                  <CaseCard
                    key={item._id}
                    item={item}
                    selected={selected?._id === item._id}
                    onPress={() => setSelected(item)}
                  />
                ))}
              </div>
            ) : (
              <>
                {(() => {
                  const columns = [
                    { key: "rownum", label: "#", align: "center" },
                    { key: "plaintiff", label: "მოსარჩელე" },
                    { key: "plaintiff_id", label: "საიდენთ. ნომერი (მოს.)" },
                    { key: "defendant", label: "მოპასუხე" },
                    { key: "defendant_id", label: "საიდენთ. ნომერი (მოპ.)" },
                    {
                      key: "amount",
                      label: "მოთხოვნის ოდენობა",
                      align: "right",
                    },
                    { key: "court", label: "განმხილველი ორგანო" },
                    { key: "case_number", label: "საქმის ნომერი" },
                    { key: "notes", label: "კომენტარი" },
                  ];
                  return (
                    <TableManager
                      rows={sorted}
                      columns={columns}
                      sortState={sort}
                      selectedId={selected?._id}
                      onSelect={(r) => setSelected(r)}
                      onSort={(k) =>
                        setSort((s) => ({
                          key: k,
                          asc: s.key === k ? !s.asc : true,
                        }))
                      }
                      onRowDoubleClick={(r) => {
                        setSelected(r);
                        setEditing(r);
                        setShowModal(true);
                      }}
                      onExport={handleExport}
                    />
                  );
                })()}
              </>
            )}
            {/* Removed separate total footer; info is handled by the table */}
          </>
        )}

        {showModal && (
          <Modal
            title={editing ? "✏️ საქმის რედაქტირება" : "➕ საქმის დამატება"}
            onClose={() => setShowModal(false)}
          >
            <CaseForm
              initial={editing || {}}
              onCancel={() => setShowModal(false)}
              onSubmit={async (data) => {
                if (editing && editing._id) {
                  await http.put(`/cases/${editing._id}`, data);
                } else {
                  await http.post("/cases", data);
                }
                await refreshCases();
                setShowModal(false);
                setSelected(null);
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}

export default function ProtectedCasesPage() {
  return (
    <ProtectedRoute>
      <CasesPage />
    </ProtectedRoute>
  );
}
