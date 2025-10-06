# Form System Guide

Complete guide to the new form system with best practices.

## 🎯 Overview

The form system provides:
- ✅ Reusable input components
- ✅ Form validation hooks
- ✅ Error handling
- ✅ Consistent styling
- ✅ Accessibility support

## 📦 Components

### Input Components

Located in `client/src/components/ui/inputs/`

#### TextInput
```jsx
import { TextInput } from '@/components/ui/inputs';

<TextInput
  label="Email"
  placeholder="Enter email"
  required
  error="Invalid email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

#### DateInput
```jsx
import { DateInput } from '@/components/ui/inputs';

<DateInput
  label="Birth Date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
/>
```

#### TextArea
```jsx
import { TextArea } from '@/components/ui/inputs';

<TextArea
  label="Description"
  rows={5}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

#### Select
```jsx
import { Select } from '@/components/ui/inputs';

<Select
  label="Role"
  options={[
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' }
  ]}
  value={role}
  onChange={(e) => setRole(e.target.value)}
/>
```

#### Checkbox
```jsx
import { Checkbox } from '@/components/ui/inputs';

<Checkbox
  label="Accept terms"
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
/>
```

#### Radio
```jsx
import { Radio } from '@/components/ui/inputs';

<Radio
  label="Gender"
  name="gender"
  options={[
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ]}
  value={gender}
  onChange={setGender}
/>
```

#### Button
```jsx
import { Button } from '@/components/ui/inputs';

<Button
  variant="primary"     // primary, secondary, danger, outline, ghost
  size="medium"         // small, medium, large
  loading={isLoading}
  disabled={isDisabled}
  fullWidth
  onClick={handleClick}
>
  Submit
</Button>
```

### Form Components

#### Form Structure
```jsx
import {
  Form,
  FormSection,
  FormGrid,
  FormActions
} from '@/components/ui/inputs';

<Form onSubmit={handleSubmit}>
  <FormSection title="Personal Info">
    <FormGrid columns={2}>
      <TextInput label="First Name" {...bind('firstName')} />
      <TextInput label="Last Name" {...bind('lastName')} />
    </FormGrid>
  </FormSection>

  <FormActions>
    <Button variant="secondary" onClick={onCancel}>
      Cancel
    </Button>
    <Button type="submit" loading={isSubmitting}>
      Save
    </Button>
  </FormActions>
</Form>
```

## 🪝 Hooks

### useForm Hook

Located in `client/src/hooks/form/`

#### Basic Usage
```jsx
import { useForm } from '@/hooks';

function MyForm() {
  const { bind, handleSubmit, isSubmitting } = useForm(
    { name: '', email: '' },  // Initial values
    async (values) => {        // Submit handler
      await api.save(values);
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <TextInput {...bind('name')} />
      <TextInput {...bind('email')} />
      <Button type="submit" loading={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
```

#### With Validation
```jsx
import { useForm, validators, createValidator } from '@/hooks';

const validationSchema = createValidator({
  name: validators.required(),
  email: [
    validators.required(),
    validators.email()
  ],
  password: [
    validators.required(),
    validators.minLength(6)
  ]
});

function MyForm() {
  const { bind, handleSubmit, isSubmitting, errors } = useForm(
    { name: '', email: '', password: '' },
    handleSave,
    validationSchema
  );

  return (
    <form onSubmit={handleSubmit}>
      <TextInput {...bind('name')} />
      <TextInput {...bind('email')} />
      <TextInput type="password" {...bind('password')} />
      <Button type="submit" loading={isSubmitting}>Submit</Button>
    </form>
  );
}
```

### Validation Validators

```jsx
import { validators, combineValidators } from '@/hooks';

// Built-in validators
validators.required('Custom message')
validators.email('Invalid email')
validators.minLength(6, 'Too short')
validators.maxLength(100, 'Too long')
validators.pattern(/regex/, 'Invalid format')
validators.min(0, 'Must be positive')
validators.max(100, 'Too large')
validators.match('password', 'Passwords must match')

// Combine validators
const passwordValidator = combineValidators(
  validators.required(),
  validators.minLength(8),
  validators.pattern(/[A-Z]/, 'Must contain uppercase')
);
```

## 🛠️ Utilities

### Form Helpers

Located in `client/src/utils/form/`

```jsx
import {
  formatFormData,
  parseFormData,
  getChangedFields,
  hasFormChanges
} from '@/utils';

// Format before submit
const formatted = formatFormData(formValues, {
  age: { type: 'number' },
  birthDate: { type: 'date' },
  active: { type: 'boolean' }
});

// Parse from server
const parsed = parseFormData(serverData, {
  birthDate: { type: 'date' }
});

// Check changes
const changes = getChangedFields(original, current);
const hasChanges = hasFormChanges(original, current);
```

### Field Normalizers

```jsx
import {
  normalizePhone,
  normalizeIdNumber,
  normalizeEmail,
  capitalizeWords
} from '@/utils';

// Normalize input
const phone = normalizePhone(value);        // Remove non-digits
const id = normalizeIdNumber(value);        // 11 digits max
const email = normalizeEmail(value);        // Lowercase, trim
const name = capitalizeWords(value);        // Title Case
```

## 📝 Complete Example

```jsx
import {
  TextInput,
  DateInput,
  Button,
  Form,
  FormSection,
  FormGrid,
  FormActions
} from '@/components/ui/inputs';
import { useForm, validators, createValidator } from '@/hooks';
import { normalizeIdNumber } from '@/utils';

const validationSchema = createValidator({
  plaintiff: validators.required('მოსარჩელე სავალდებულოა'),
  defendant: validators.required('მოპასუხე სავალდებულოა'),
  plaintiff_id: validators.pattern(
    /^\d{11}$/,
    'უნდა იყოს 11 ციფრი'
  )
});

export default function CaseForm({ initial = {}, onSubmit, onCancel }) {
  const {
    bind,
    handleSubmit,
    isSubmitting,
    values,
    setValue
  } = useForm(
    {
      plaintiff: initial.plaintiff || '',
      defendant: initial.defendant || '',
      plaintiff_id: initial.plaintiff_id || '',
      case_number: initial.case_number || '',
      initiation_date: initial.initiation_date || ''
    },
    onSubmit,
    validationSchema
  );

  // Custom handler with normalization
  const handleIdChange = (e) => {
    const normalized = normalizeIdNumber(e.target.value);
    setValue('plaintiff_id', normalized);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormSection title="მხარეები">
        <FormGrid columns={2}>
          <TextInput
            label="მოსარჩელე"
            required
            {...bind('plaintiff')}
          />
          <TextInput
            label="საიდენთიფიკაციო ნომერი"
            value={values.plaintiff_id}
            onChange={handleIdChange}
          />
          <TextInput
            label="მოპასუხე"
            required
            {...bind('defendant')}
          />
        </FormGrid>
      </FormSection>

      <FormSection title="საქმის ინფორმაცია">
        <FormGrid columns={2}>
          <TextInput
            label="საქმის ნომერი"
            {...bind('case_number')}
          />
          <DateInput
            label="წარმოებაში მიღების თარიღი"
            {...bind('initiation_date')}
          />
        </FormGrid>
      </FormSection>

      <FormActions>
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          გაუქმება
        </Button>
        <Button type="submit" loading={isSubmitting}>
          შენახვა
        </Button>
      </FormActions>
    </Form>
  );
}
```

## 🎨 Styling

All components use CSS Modules with consistent theming:

```css
/* Custom colors via CSS variables */
:root {
  --primary-green: #4caf50;
  --primary-green-dark: #2e7d32;
  --error-color: #d32f2f;
  --border-color: #ddd;
}
```

## ♿ Accessibility

All components include:
- ✅ Proper ARIA labels
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Error announcements
- ✅ Required field indicators

## 🚀 Best Practices

1. **Always use validation** - Validate on client and server
2. **Use constants** - Define field configs in constants
3. **Normalize inputs** - Clean data before submission
4. **Handle errors** - Show clear error messages
5. **Disable on submit** - Prevent double submissions
6. **Reset on success** - Clear form after save
7. **Show loading states** - Indicate processing

## 📚 Migration Guide

### From Old Form
```jsx
// Old way ❌
<input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// New way ✅
<TextInput
  label="Name"
  {...bind('name')}
/>
```

### From Manual Validation
```jsx
// Old way ❌
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  const newErrors = {};
  if (!name) newErrors.name = 'Required';
  if (errors) {
    setErrors(newErrors);
    return;
  }
  // submit...
};

// New way ✅
const validationSchema = createValidator({
  name: validators.required()
});

const { bind, handleSubmit } = useForm(
  { name: '' },
  onSubmit,
  validationSchema
);
```

---

**Date**: October 2025
**Status**: ✅ Complete
**Version**: 1.0
