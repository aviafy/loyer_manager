"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  TextInput,
  EmailInput,
  PhoneInput,
  PasswordInput,
  Button,
  Form,
  FormSection,
  FormGrid,
  FormActions,
} from "@/components/ui/inputs";
import { useForm, validators, createValidator } from "@/hooks";
import styles from "./register.module.css";

const validationSchema = createValidator({
  companyName: validators.required("Company name is required"),
  companyEmail: [
    validators.required("Company email is required"),
    validators.email("Invalid email address"),
  ],
  companyPhone: validators.phone("Invalid phone number"),
  firstName: validators.required("First name is required"),
  lastName: validators.required("Last name is required"),
  email: [
    validators.required("Email is required"),
    validators.email("Invalid email address"),
  ],
  password: [
    validators.required("Password is required"),
    validators.minLength(6, "Password must be at least 6 characters"),
  ],
  confirmPassword: [
    validators.required("Please confirm password"),
    validators.match("password", "Passwords do not match"),
  ],
});

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  const { bind, handleSubmit, isSubmitting, errors, setError } = useForm(
    {
      companyName: "",
      companyEmail: "",
      companyPhone: "",
      companyAddress: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    async (values) => {
      try {
        await register(values);
        router.push("/");
      } catch (err) {
        setError("_global", err.response?.data?.error || "Registration failed");
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
          <h2 className={styles.title}>🏢 Register Company</h2>
          <p className={styles.subtitle}>Create your company account</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <FormSection title="Company Information">
            <TextInput
              label="Company Name"
              placeholder="Enter company name"
              required
              {...bind("companyName")}
            />
            <EmailInput
              label="Company Email"
              placeholder="company@example.com"
              required
              {...bind("companyEmail")}
            />
            <FormGrid columns={2}>
              <PhoneInput
                label="Company Phone"
                placeholder="5XX XX XX XX"
                {...bind("companyPhone")}
              />
              <TextInput
                label="Company Address"
                placeholder="Enter company address"
                {...bind("companyAddress")}
              />
            </FormGrid>
          </FormSection>

          <FormSection title="Admin User">
            <FormGrid columns={2}>
              <TextInput
                label="First Name"
                placeholder="Enter first name"
                required
                {...bind("firstName")}
              />
              <TextInput
                label="Last Name"
                placeholder="Enter last name"
                required
                {...bind("lastName")}
              />
            </FormGrid>

            <EmailInput
              label="Email"
              placeholder="user@example.com"
              required
              {...bind("email")}
            />

            <FormGrid columns={2}>
              <PasswordInput
                label="Password"
                placeholder="At least 6 characters"
                showStrength
                required
                {...bind("password")}
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="Re-enter password"
                required
                {...bind("confirmPassword")}
              />
            </FormGrid>
          </FormSection>

          {errors._global && <div className={styles.error}>{errors._global}</div>}

          <FormActions>
            <Button type="submit" loading={isSubmitting} fullWidth>
              ✅ Create Account
            </Button>
          </FormActions>

          <div className={styles.footer}>
            Already have an account?{" "}
            <Link href="/login" className={styles.link}>
              Login here
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
