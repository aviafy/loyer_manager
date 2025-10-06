# Input Components Examples

Complete examples for all specialized input components.

## 📧 EmailInput

Auto-validates email format with visual feedback.

### Basic Usage
```jsx
import { EmailInput } from '@/components/ui/inputs';

<EmailInput
  label="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
```

### Features
- ✅ Auto-lowercase
- ✅ Auto-trim
- ✅ Real-time validation
- ✅ Success indicator (✓)
- ✅ Error messages

### With Form Hook
```jsx
import { EmailInput } from '@/components/ui/inputs';
import { useForm, validators } from '@/hooks';

const { bind } = useForm(
  { email: '' },
  onSubmit,
  createValidator({
    email: [validators.required(), validators.email()]
  })
);

<EmailInput label="Email" {...bind('email')} />
```

## 📱 PhoneInput

Georgian phone number with auto-formatting.

### Basic Usage
```jsx
import { PhoneInput } from '@/components/ui/inputs';

<PhoneInput
  label="Mobile Number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  required
/>
```

### Features
- ✅ Auto-formatting (5XX XX XX XX)
- ✅ International format (+995 5XX XX XX XX)
- ✅ Returns clean digits to parent
- ✅ Visual formatting for user

### Format Examples
```
Input: 555123456
Display: 555 12 34 56
Value sent: 555123456

Input: 995555123456
Display: +995 555 12 34 56
Value sent: 995555123456
```

### With Validation
```jsx
import { PhoneInput } from '@/components/ui/inputs';
import { useForm, validators } from '@/hooks';

const { bind } = useForm(
  { phone: '' },
  onSubmit,
  createValidator({
    phone: validators.phone('არასწორი ტელეფონის ნომერი')
  })
);

<PhoneInput label="მობილური" {...bind('phone')} />
```

## 🔒 PasswordInput

Password with visibility toggle and strength meter.

### Basic Usage
```jsx
import { PasswordInput } from '@/components/ui/inputs';

<PasswordInput
  label="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>
```

### With Strength Meter
```jsx
<PasswordInput
  label="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  showStrength
  required
/>
```

### Features
- ✅ Show/hide toggle (👁️)
- ✅ Password strength meter
- ✅ Strength levels: Weak, Medium, Good, Strong
- ✅ Color-coded feedback
- ✅ Auto-complete support

### Strength Calculation
```
Weak (Red):
- Less than 6 characters
- Only lowercase or only numbers

Medium (Orange):
- 6-8 characters
- Mixed case OR numbers

Good (Green):
- 8-12 characters
- Mixed case AND numbers

Strong (Dark Green):
- 12+ characters
- Uppercase, lowercase, numbers, symbols
```

### With Validation
```jsx
import { PasswordInput } from '@/components/ui/inputs';
import { useForm, validators } from '@/hooks';

const { bind } = useForm(
  { password: '', confirmPassword: '' },
  onSubmit,
  createValidator({
    password: validators.strongPassword(),
    confirmPassword: validators.match('password', 'Passwords must match')
  })
);

<PasswordInput
  label="Password"
  showStrength
  {...bind('password')}
/>
<PasswordInput
  label="Confirm Password"
  {...bind('confirmPassword')}
/>
```

## 🔢 Specialized Validators

### Phone Validator
```jsx
import { validators } from '@/hooks';

// Georgian phone (9 or 12 digits, starts with 5)
validators.phone('Invalid phone number')

// Usage
const schema = createValidator({
  phone: validators.phone('არასწორი ტელეფონის ნომერი')
});
```

### Georgian ID Validator
```jsx
import { validators } from '@/hooks';

// 11 digits
validators.georgianId('Invalid ID')

// Usage
const schema = createValidator({
  personalId: validators.georgianId('არასწორი პირადი ნომერი')
});
```

### Strong Password Validator
```jsx
import { validators } from '@/hooks';

// Minimum 8 chars, uppercase, lowercase, numbers
validators.strongPassword()

// Usage
const schema = createValidator({
  password: [
    validators.required(),
    validators.strongPassword('Password must be stronger')
  ]
});
```

### URL Validator
```jsx
import { validators } from '@/hooks';

validators.url('Invalid URL')

// Usage
const schema = createValidator({
  website: validators.url('Please enter a valid URL')
});
```

## 📝 Complete Login Form Example

```jsx
import {
  EmailInput,
  PasswordInput,
  Button,
  Form,
  FormSection,
  FormActions
} from '@/components/ui/inputs';
import { useForm, validators, createValidator } from '@/hooks';

const validationSchema = createValidator({
  email: [validators.required(), validators.email()],
  password: validators.required()
});

export default function LoginForm() {
  const { bind, handleSubmit, isSubmitting } = useForm(
    { email: '', password: '' },
    async (values) => {
      await login(values);
    },
    validationSchema
  );

  return (
    <Form onSubmit={handleSubmit}>
      <FormSection title="Login">
        <EmailInput
          label="Email Address"
          placeholder="your@email.com"
          required
          {...bind('email')}
        />
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          required
          {...bind('password')}
        />
      </FormSection>

      <FormActions>
        <Button type="submit" loading={isSubmitting} fullWidth>
          Login
        </Button>
      </FormActions>
    </Form>
  );
}
```

## 📝 Complete Registration Form Example

```jsx
import {
  EmailInput,
  PasswordInput,
  PhoneInput,
  TextInput,
  Button,
  Form,
  FormSection,
  FormGrid,
  FormActions
} from '@/components/ui/inputs';
import { useForm, validators, createValidator } from '@/hooks';

const validationSchema = createValidator({
  firstName: validators.required('სახელი სავალდებულოა'),
  lastName: validators.required('გვარი სავალდებულოა'),
  email: [
    validators.required('ელ. ფოსტა სავალდებულოა'),
    validators.email('არასწორი ელ. ფოსტა')
  ],
  phone: validators.phone('არასწორი ტელეფონის ნომერი'),
  password: validators.strongPassword(),
  confirmPassword: validators.match('password', 'პაროლები არ ემთხვევა')
});

export default function RegisterForm() {
  const { bind, handleSubmit, isSubmitting } = useForm(
    {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    },
    async (values) => {
      await register(values);
    },
    validationSchema
  );

  return (
    <Form onSubmit={handleSubmit}>
      <FormSection title="პირადი ინფორმაცია">
        <FormGrid columns={2}>
          <TextInput
            label="სახელი"
            required
            {...bind('firstName')}
          />
          <TextInput
            label="გვარი"
            required
            {...bind('lastName')}
          />
        </FormGrid>

        <EmailInput
          label="ელ. ფოსტა"
          required
          {...bind('email')}
        />
        <PhoneInput
          label="მობილური"
          {...bind('phone')}
        />
      </FormSection>

      <FormSection title="პაროლი">
        <PasswordInput
          label="პაროლი"
          showStrength
          required
          {...bind('password')}
        />
        <PasswordInput
          label="გაიმეორეთ პაროლი"
          required
          {...bind('confirmPassword')}
        />
      </FormSection>

      <FormActions>
        <Button type="submit" loading={isSubmitting} fullWidth>
          რეგისტრაცია
        </Button>
      </FormActions>
    </Form>
  );
}
```

## 🎨 Customization

### Custom Styling
```jsx
<EmailInput
  label="Email"
  className="custom-input"
  {...bind('email')}
/>
```

### Disable Validation
```jsx
<EmailInput
  label="Email"
  showValidation={false}  // No automatic validation
  {...bind('email')}
/>
```

### Custom Error Messages
```jsx
<PhoneInput
  label="Phone"
  error="Custom error message"
  {...bind('phone')}
/>
```

---

**Date**: October 2025
**Version**: 1.0
