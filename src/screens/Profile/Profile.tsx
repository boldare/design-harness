import { useId, useState } from 'react';
import { AccountCard } from '../../components/AccountCard';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { RadioGroup } from '../../components/Radio';
import { Select } from '../../components/Select';
import { TextField } from '../../components/TextField';
import layout from '../layout.module.css';
import { emailError } from '../validation';

/** The three states from the Profile README. */
export type ProfileState = 'default' | 'error' | 'saving';

export interface ProfileValues {
  name: string;
  email: string;
  country: string;
  usageSummary: string;
  productNews: boolean;
}

export interface ProfileProps {
  /** The state the screen opens in, for previews and tests. From there it moves on as the person uses it. */
  state?: ProfileState;
  /** Called with valid values only. The screen shows "Saving…" until it resolves. */
  onSave: (values: ProfileValues) => Promise<void>;
}

const countries = [
  { value: 'pl', label: 'Poland' },
  { value: 'de', label: 'Germany' },
  { value: 'gb', label: 'United Kingdom' },
];

const usageSummaries = [
  { value: 'daily', label: 'Every day' },
  { value: 'weekly', label: 'Every week' },
  { value: 'never', label: 'Never' },
];

// SPEC GAP: the README does not say whether "Product news by email" starts checked. It starts unchecked (opt-in).
const savedValues: ProfileValues = {
  name: 'Anna Kowalska',
  email: 'anna.kowalska@example.com',
  country: 'pl',
  usageSummary: 'weekly',
  productNews: false,
};

const opening: Record<ProfileState, { values: ProfileValues; validated: boolean; saving: boolean }> = {
  default: { values: savedValues, validated: false, saving: false },
  error: { values: { ...savedValues, email: 'anna.kowalska@', country: '' }, validated: true, saving: false },
  saving: { values: savedValues, validated: false, saving: true },
};

/*
 * SPEC GAP: the README gives no rule for the full name and no message for an empty email.
 * The name is not checked; an empty email gets the SignIn message. Country can only be empty
 * when the screen opens in the error state, because the Select has no empty option.
 */
const errorsOf = (values: ProfileValues) => ({
  email: emailError(values.email),
  country: values.country ? undefined : 'Choose the country where you use your device',
});

/** Account details and notification preferences, saved together with one button. */
export function Profile({ state = 'default', onSave }: ProfileProps) {
  const [saved, setSaved] = useState(savedValues);
  const [values, setValues] = useState(opening[state].values);
  // True from the first Save with problems: messages show, and update as the person types.
  const [validated, setValidated] = useState(opening[state].validated);
  const [saving, setSaving] = useState(opening[state].saving);
  const emailId = useId();
  const countryId = useId();

  const errors = validated ? errorsOf(values) : undefined;

  function edit<Field extends keyof ProfileValues>(field: Field, value: ProfileValues[Field]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function save() {
    const found = errorsOf(values);
    const firstInvalid = found.email ? emailId : found.country ? countryId : undefined;
    if (firstInvalid) {
      // Everything typed stays; focus moves to the first invalid field.
      setValidated(true);
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    setSaving(true);
    await onSave(values);
    setSaved(values);
    setValidated(false);
    setSaving(false);
  }

  // Discards every change since the last save.
  function cancel() {
    setValues(saved);
    setValidated(false);
  }

  return (
    <div className={`${layout.screen} ${layout.blocks}`}>
      <div className={layout.titleBlock}>
        <h1 className={layout.title}>Profile</h1>
        <p className={layout.intro}>
          We use these details to confirm your age and to show features available in your country.
        </p>
      </div>

      <AccountCard name={saved.name} email={saved.email} />

      <form className={layout.blocks} noValidate onSubmit={(event) => event.preventDefault()}>
        <section className={layout.section}>
          <h2 className={layout.heading}>Details</h2>
          <TextField
            label="Full name"
            autoComplete="name"
            value={values.name}
            onChange={(value) => edit('name', value)}
            disabled={saving}
          />
          <TextField
            id={emailId}
            label="Email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(value) => edit('email', value)}
            error={errors?.email}
            disabled={saving}
          />
          <Select
            id={countryId}
            label="Country"
            options={countries}
            value={values.country}
            onChange={(value) => edit('country', value)}
            error={errors?.country}
            disabled={saving}
          />
        </section>

        <section className={layout.section}>
          <h2 className={layout.heading}>Notifications</h2>
          <RadioGroup
            legend="Usage summary"
            options={usageSummaries}
            value={values.usageSummary}
            onChange={(value) => edit('usageSummary', value)}
            disabled={saving}
          />
          <Checkbox
            label="Product news by email"
            description="One email a month at most."
            checked={values.productNews}
            onChange={(checked) => edit('productNews', checked)}
            disabled={saving}
          />
        </section>

        <div className={layout.actions}>
          {/* Enter in a field clicks the submit button, so onPress handles both. Loading ignores repeated presses. */}
          <Button type="submit" loading={saving} loadingLabel="Saving…" onPress={save}>
            Save changes
          </Button>
          <Button variant="quiet" disabled={saving} onPress={cancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
