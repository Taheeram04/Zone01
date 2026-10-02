// components/apply.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Button from './button.jsx';
import { Container } from './layout.jsx';

// Call the backend directly in dev (CORS allows the dev origin); same origin
// in production unless VITE_API_BASE_URL points elsewhere.
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '');

const GENDERS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
  { value: 'undisclosed', label: 'Prefer not to say' },
];

const EDUCATION_LEVELS = [
  { value: 'secondary', label: 'Secondary school' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'degree', label: "Bachelor's degree" },
  { value: 'postgraduate', label: 'Postgraduate' },
  { value: 'self_taught', label: 'Self-taught' },
  { value: 'other', label: 'Other' },
];

const INITIAL_VALUES = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  gender: '',
  county: '',
  education_level: '',
  current_occupation: '',
  motivation: '',
  portfolio_url: '',
  github_url: '',
  linkedin_url: '',
  referral_source: '',
  consent: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+/i;

const validate = (values) => {
  const errors = {};

  if (!values.first_name.trim()) errors.first_name = 'First name is required.';
  if (!values.last_name.trim()) errors.last_name = 'Last name is required.';

  if (!values.email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Enter a valid email address.';

  ['portfolio_url', 'github_url', 'linkedin_url'].forEach((field) => {
    if (values[field] && !URL_RE.test(values[field].trim())) {
      errors[field] = 'Enter a full URL starting with http:// or https://';
    }
  });

  if (!values.consent) errors.consent = 'Please accept the terms to apply.';

  return errors;
};

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-white px-4 py-3 font-sans text-sm text-black-900 ` +
  `placeholder:text-black-900/40 focus:outline-none focus:ring-2 transition-colors ${
    hasError
      ? 'border-red-400 focus:ring-red-300'
      : 'border-black-900/15 focus:border-primary focus:ring-primary/30'
  }`;

const Field = ({ label, name, required, error, children, className = '' }) => (
  <div className={className}>
    <label htmlFor={name} className="mb-1.5 block font-mono text-body-s text-black-900/80">
      {label}
      {required && <span className="text-primary"> *</span>}
    </label>
    {children}
    {error && (
      <p className="mt-1 font-mono text-body-s text-red-500" role="alert">
        {error}
      </p>
    )}
  </div>
);

const Apply = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [reference, setReference] = useState(null);
  const [formMessage, setFormMessage] = useState(null);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const clientErrors = validate(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      setStatus('idle');
      return;
    }

    setStatus('submitting');
    setFormMessage(null);

    try {
      const response = await fetch(`${API_BASE}/api/apply/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.ok) {
        setReference(data.reference);
        setStatus('success');
        return;
      }

      const serverErrors = {};
      Object.entries(data.errors || {}).forEach(([field, list]) => {
        const first = Array.isArray(list) ? list[0] : list;
        serverErrors[field === '__all__' ? '_form' : field] = first?.message || 'Invalid value.';
      });
      setErrors(serverErrors);
      setFormMessage(
        response.status === 409
          ? 'You have already applied with this email address.'
          : 'Please fix the highlighted fields and try again.',
      );
      setStatus('error');
    } catch {
      setFormMessage('We could not reach the server. Please check your connection and try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <section className="relative w-full min-h-[100svh] bg-tint-blue py-28">
        <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl sm:p-10"
          >
            <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-accent" />
            <h1 className="font-sans text-2xl font-black tracking-tight text-black-900 sm:text-3xl">
              Application received
            </h1>
            <p className="mt-3 font-mono text-sm text-black-900/70">
              Thank you. Your application reference is
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-primary">{reference}</p>
            <p className="mt-4 font-mono text-body-s text-black-900/60">
              Keep this reference handy — our team will reach out by email.
            </p>
            <Button variant="primary" className="mt-8 w-full sm:w-auto" onClick={() => navigate('/')}>
              Back to home
            </Button>
          </motion.div>
        </Container>
      </section>
    );
  }

  const submitting = status === 'submitting';

  return (
    <section className="relative w-full min-h-[100svh] bg-tint-blue py-28">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="font-sans text-3xl font-black tracking-tight text-black-900 sm:text-4xl">
              Apply to Zone01 Kisumu
            </h1>
            <p className="mt-3 font-mono text-sm text-black-900/70">
              No prior programming experience or academic qualifications required. Fields marked{' '}
              <span className="text-primary">*</span> are required.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl bg-white p-6 shadow-xl sm:p-8"
          >
            {formMessage && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-2 rounded-lg bg-red-50 p-3 font-mono text-body-s text-red-600"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{formMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="First name" name="first_name" required error={errors.first_name}>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  value={values.first_name}
                  onChange={update}
                  className={inputClass(errors.first_name)}
                />
              </Field>

              <Field label="Last name" name="last_name" required error={errors.last_name}>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  value={values.last_name}
                  onChange={update}
                  className={inputClass(errors.last_name)}
                />
              </Field>

              <Field label="Email" name="email" required error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={update}
                  className={inputClass(errors.email)}
                />
              </Field>

              <Field label="Phone" name="phone" error={errors.phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={update}
                  className={inputClass(errors.phone)}
                />
              </Field>

              <Field label="Date of birth" name="date_of_birth" error={errors.date_of_birth}>
                <input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={values.date_of_birth}
                  onChange={update}
                  className={inputClass(errors.date_of_birth)}
                />
              </Field>

              <Field label="Gender" name="gender" error={errors.gender}>
                <select
                  id="gender"
                  name="gender"
                  value={values.gender}
                  onChange={update}
                  className={inputClass(errors.gender)}
                >
                  <option value="">Select…</option>
                  {GENDERS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="County" name="county" error={errors.county}>
                <input
                  id="county"
                  name="county"
                  type="text"
                  value={values.county}
                  onChange={update}
                  className={inputClass(errors.county)}
                />
              </Field>

              <Field label="Education level" name="education_level" error={errors.education_level}>
                <select
                  id="education_level"
                  name="education_level"
                  value={values.education_level}
                  onChange={update}
                  className={inputClass(errors.education_level)}
                >
                  <option value="">Select…</option>
                  {EDUCATION_LEVELS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Current occupation"
                name="current_occupation"
                error={errors.current_occupation}
                className="sm:col-span-2"
              >
                <input
                  id="current_occupation"
                  name="current_occupation"
                  type="text"
                  value={values.current_occupation}
                  onChange={update}
                  className={inputClass(errors.current_occupation)}
                />
              </Field>

              <Field
                label="Why do you want to join?"
                name="motivation"
                error={errors.motivation}
                className="sm:col-span-2"
              >
                <textarea
                  id="motivation"
                  name="motivation"
                  rows={4}
                  value={values.motivation}
                  onChange={update}
                  className={inputClass(errors.motivation)}
                />
              </Field>

              <Field label="Portfolio URL" name="portfolio_url" error={errors.portfolio_url}>
                <input
                  id="portfolio_url"
                  name="portfolio_url"
                  type="url"
                  placeholder="https://"
                  value={values.portfolio_url}
                  onChange={update}
                  className={inputClass(errors.portfolio_url)}
                />
              </Field>

              <Field label="GitHub URL" name="github_url" error={errors.github_url}>
                <input
                  id="github_url"
                  name="github_url"
                  type="url"
                  placeholder="https://"
                  value={values.github_url}
                  onChange={update}
                  className={inputClass(errors.github_url)}
                />
              </Field>

              <Field label="LinkedIn URL" name="linkedin_url" error={errors.linkedin_url}>
                <input
                  id="linkedin_url"
                  name="linkedin_url"
                  type="url"
                  placeholder="https://"
                  value={values.linkedin_url}
                  onChange={update}
                  className={inputClass(errors.linkedin_url)}
                />
              </Field>

              <Field
                label="How did you hear about us?"
                name="referral_source"
                error={errors.referral_source}
              >
                <input
                  id="referral_source"
                  name="referral_source"
                  type="text"
                  value={values.referral_source}
                  onChange={update}
                  className={inputClass(errors.referral_source)}
                />
              </Field>
            </div>

            <div className="mt-6">
              <label className="flex items-start gap-3">
                <input
                  name="consent"
                  type="checkbox"
                  checked={values.consent}
                  onChange={update}
                  className="mt-1 h-4 w-4 shrink-0 accent-primary"
                />
                <span className="font-mono text-body-s text-black-900/80">
                  I confirm the information provided is accurate and consent to Zone01 Kisumu
                  processing it for my application.
                </span>
              </label>
              {errors.consent && (
                <p className="mt-1 font-mono text-body-s text-red-500" role="alert">
                  {errors.consent}
                </p>
              )}
            </div>

            {errors._form && (
              <p className="mt-4 font-mono text-body-s text-red-500" role="alert">
                {errors._form}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="mt-8 w-full rounded-full py-3.5 text-base"
            >
              {submitting ? 'Submitting…' : 'Submit application'}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default Apply;
