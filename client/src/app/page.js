"use client";

import { useEffect, useMemo, useState } from "react";
import http from "@/lib/http";
import SearchBar from "@/components/cases/SearchBar";
import CasesTable from "@/components/cases/CasesTable";
import CaseForm from "@/components/cases/CaseForm";
import CaseCard from "@/components/cases/CaseCard";
import Modal from "@/components/ui/Modal";
import useResponsive from "@/hooks/useResponsive";
import useDebounce from "@/hooks/useDebounce";
import { parseAmount, parseDate } from "@/lib/utils";
import styles from "./page.module.css";

export default function CasesPage() {
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

        <div className={styles.headerRow}>
          <h2 className={styles.title}>📋 საქმეების სია</h2>
          <div className={styles.searchBarWrapper}>
            <SearchBar
              field={field}
              setField={setField}
              query={query}
              setQuery={setQuery}
              onClear={() => setQuery("")}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => {
              setEditing(null);
              setShowModal(true);
            }}
            disabled={demo}
          >
            ➕ დამატება
          </button>
          <button
            onClick={() => {
              if (selected) {
                setEditing(selected);
                setShowModal(true);
              }
            }}
            disabled={demo || !selected}
          >
            ✏️ რედაქტირება
          </button>
          <button
            onClick={handleDelete}
            disabled={demo || !selected}
            className="danger"
          >
            🗑️ წაშლა
          </button>
          <button onClick={handleExport} className="secondary">
            📤 Excel ექსპორტი
          </button>
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
              <CasesTable
                rows={sorted}
                sortState={sort}
                selectedId={selected?._id}
                onSelect={(r) => setSelected(r)}
                onSort={(k) =>
                  setSort((s) => ({ key: k, asc: s.key === k ? !s.asc : true }))
                }
                onRowDoubleClick={(r) => {
                  setSelected(r);
                  setEditing(r);
                  setShowModal(true);
                }}
              />
            )}

            <div className={styles.footer}>
              <p className={styles.totalResults}>
                სულ: <strong>{total}</strong> შედეგი
              </p>
            </div>
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
