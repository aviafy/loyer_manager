"use client";

import { useState, useEffect } from "react";
import { customerService } from "@/services";
import { Button } from "@/components/ui/inputs";
import CustomerForm from "@/components/customers/CustomerForm";
import CustomerTable from "@/components/customers/CustomerTable";
import styles from "./customers.module.css";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCustomers();
  }, [searchQuery]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerService.getCustomers({
        search: searchQuery,
        limit: 100,
      });
      setCustomers(response.customers || []);
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("დარწმუნებული ხართ, რომ გსურთ კლიენტის წაშლა?")) {
      return;
    }

    try {
      await customerService.deleteCustomer(id);
      loadCustomers();
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.response?.data?.message || "წაშლა ვერ მოხერხდა");
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer._id, data);
      } else {
        await customerService.createCustomer(data);
      }
      setShowForm(false);
      setEditingCustomer(null);
      loadCustomers();
    } catch (error) {
      console.error("Save failed:", error);
      throw error;
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>კლიენტები</h1>
          <p className={styles.subtitle}>
            მართეთ თქვენი კლიენტების ინფორმაცია
          </p>
        </div>
        <Button onClick={handleCreate}>+ ახალი კლიენტი</Button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="🔍 მოძებნეთ კლიენტი (სახელი, ელ. ფოსტა, ტელეფონი)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>იტვირთება...</div>
      ) : (
        <CustomerTable
          customers={customers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <div className={styles.modalOverlay} onClick={handleCancel}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingCustomer ? "კლიენტის რედაქტირება" : "ახალი კლიენტი"}</h2>
              <button className={styles.closeBtn} onClick={handleCancel}>
                ✕
              </button>
            </div>
            <CustomerForm
              initial={editingCustomer}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
