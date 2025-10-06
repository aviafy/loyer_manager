"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  EmailInput,
  PasswordInput,
  Button,
  Form,
  FormSection,
  FormActions,
} from "@/components/ui/inputs";
import { useForm, validators, createValidator } from "@/hooks";
import styles from "./login.module.css";

const validationSchema = createValidator({
  email: [
    validators.required("Email is required"),
    validators.email("Invalid email address"),
  ],
  password: validators.required("Password is required"),
});

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const { bind, handleSubmit, isSubmitting, errors, setError } = useForm(
    {
      email: "",
      password: "",
    },
    async (values) => {
      try {
        await login(values.email, values.password);
        router.push("/");
      } catch (err) {
        setError("_global", err.response?.data?.error || "Login failed");
        throw err;
      }
    },
    validationSchema
  );

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>🔐 Login</h2>
          <p className={styles.subtitle}>Welcome back!</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <FormSection>
            <EmailInput
              label="Email"
              placeholder="user@example.com"
              required
              {...bind("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              required
              {...bind("password")}
            />
          </FormSection>

          {errors._global && (
            <div className={styles.error}>{errors._global}</div>
          )}

          <FormActions>
            <Button type="submit" loading={isSubmitting} fullWidth>
              🚀 Login
            </Button>
          </FormActions>

          <div className={styles.footer}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className={styles.link}>
              Register here
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
