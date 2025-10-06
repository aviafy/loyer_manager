"use client";

import { useEffect, useState } from "react";
import http from "@/lib/http";
import { ProtectedRoute } from "@/components/auth";
import { Modal } from "@/components/ui";
import {
  TextInput,
  EmailInput,
  PasswordInput,
  Select,
  Button,
  FormGrid,
} from "@/components/ui/inputs";
import { useForm, validators, createValidator } from "@/hooks";
import styles from "./users.module.css";

const createUserSchema = createValidator({
  email: [validators.required(), validators.email()],
  password: [validators.required(), validators.minLength(6)],
  firstName: validators.required("First name is required"),
  lastName: validators.required("Last name is required"),
  role: validators.required("Role is required"),
});

const editUserSchema = createValidator({
  firstName: validators.required("First name is required"),
  lastName: validators.required("Last name is required"),
  role: validators.required("Role is required"),
});

const roleOptions = [
  { value: "CompanyAdmin", label: "Company Admin" },
  { value: "Staff", label: "Staff" },
  { value: "ReadOnly", label: "Read Only" },
];

function UserForm({ user, onSuccess, onCancel }) {
  const isEditing = !!user;

  const { bind, handleSubmit, isSubmitting } = useForm(
    {
      email: user?.email || "",
      password: "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      role: user?.role || "Staff",
    },
    async (values) => {
      if (isEditing) {
        await http.put(`/users/${user._id}`, {
          firstName: values.firstName,
          lastName: values.lastName,
          role: values.role,
        });
      } else {
        await http.post("/users", values);
      }
      onSuccess();
    },
    isEditing ? editUserSchema : createUserSchema
  );

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {!isEditing && (
        <>
          <EmailInput
            label="Email"
            placeholder="user@example.com"
            required
            {...bind("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="At least 6 characters"
            required
            {...bind("password")}
          />
        </>
      )}

      <FormGrid columns={2}>
        <TextInput
          label="First Name"
          placeholder="First name"
          required
          {...bind("firstName")}
        />
        <TextInput
          label="Last Name"
          placeholder="Last name"
          required
          {...bind("lastName")}
        />
      </FormGrid>

      <Select
        label="Role"
        options={roleOptions}
        required
        {...bind("role")}
      />

      <div className={styles.formActions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          ❌ Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          💾 Save
        </Button>
      </div>
    </form>
  );
}

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await http.get("/users");
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await http.delete(`/users/${userId}`);
        await loadUsers();
      } catch (error) {
        alert(error.response?.data?.error || "Delete failed");
      }
    }
  };

  const handleSuccess = async () => {
    await loadUsers();
    setShowModal(false);
    setEditing(null);
  };

  const openAddModal = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditing(user);
    setShowModal(true);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>👥 User Management</h2>
          <Button onClick={openAddModal}>➕ Add User</Button>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading users...</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          user.status === "active"
                            ? styles.active
                            : styles.inactive
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => openEditModal(user)}
                          className={styles.editBtn}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className={styles.deleteBtn}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className={styles.empty}>No users found</div>
            )}
          </div>
        )}

        {showModal && (
          <Modal
            title={editing ? "✏️ Edit User" : "➕ Add User"}
            onClose={() => {
              setShowModal(false);
              setEditing(null);
            }}
          >
            <UserForm
              user={editing}
              onSuccess={handleSuccess}
              onCancel={() => {
                setShowModal(false);
                setEditing(null);
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}

export default function ProtectedUsersPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <UsersPage />
    </ProtectedRoute>
  );
}
