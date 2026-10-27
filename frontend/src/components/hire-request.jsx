// components/hire-request.jsx
import { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Copy,
  Globe,
  Mail,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { Container } from './layout.jsx';
import { HIRE_EMAIL, hireWhatsAppUrl } from '../constants.js';
import { EMPLOYMENT_TYPES, WORK_ARRANGEMENTS } from './hire.data.js';

const EMPTY_FORM = {
  name: '',
  organisation: '',
  email: '',
  roles: '',
  skills: '',
  people: '',
  employment: '',
  arrangement: '',
  startDate: '',
  notes: '',
};

const REQUIRED_FIELDS = [
  'name',
  'organisation',
  'email',
  'roles',
  'skills',
  'people',
  'employment',
  'arrangement',
];

const FIELD_LABELS = {
  name: 'Full name',
  organisation: 'Organisation',
  email: 'Work email',
  roles: 'Roles required',
  skills: 'Skills required',
  people: 'Number of people',
  employment: 'Employment type',
  arrangement: 'Work arrangement',
};

const validate = (values) => {
  const errors = {};

  REQUIRED_FIELDS.forEach((field) => {
    if (!String(values[field] ?? '').trim()) {
      errors[field] = `${FIELD_LABELS[field]} is required.`;
    }
  });

  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid work email address.';
  }

  if (values.people && Number(values.people) < 1) {
    errors.people = 'Enter at least one person.';
  }

  return errors;
};

const buildBrief = (values) =>
  [
    'New talent request — Zone01 Kisumu',
    '',
    `Name: ${values.name}`,
    `Organisation: ${values.organisation}`,
    `Work email: ${values.email}`,
    `Roles required: ${values.roles}`,
    `Skills required: ${values.skills}`,
    `Number of people: ${values.people}`,
    `Employment type: ${values.employment}`,
    `Work arrangement: ${values.arrangement}`,
    `Approximate start date: ${values.startDate || 'Flexible'}`,
    '',
    `Additional information: ${values.notes || 'None'}`,
  ].join('\n');

const inputClasses = (hasError) =>
  [
    'w-full rounded-lg border bg-white px-4 py-3 font-sans text-body-m text-secondary',
    'placeholder:text-black-900/35 transition-colors',
    'focus:outline-none focus:ring-2',
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15'
      : 'border-secondary/15 focus:border-primary focus:ring-primary/20',
  ].join(' ');

const Field = ({ label, name, error, required = false, children }) => (
  <div>
    <label
      htmlFor={`employer-${name}`}
      className="mb-1.5 block font-mono text-body-s uppercase tracking-[0.12em] text-secondary/70"
    >
      {label}
      {required && (
        <span aria-hidden="true" className="ml-1 text-primary">
          *
        </span>
      )}
    </label>
    {children}
    {error && (
      <p id={`employer-${name}-error`} className="mt-1.5 font-sans text-xs text-red-600">
        {error}
      </p>
    )}
  </div>
);

/**
 * Talent request form. Submitting validates the brief and opens WhatsApp with
 * the full request pre-filled (the team's live employer channel), with an
 * email fallback that carries exactly the same copy. If the browser blocks the
 * WhatsApp pop-up, the success panel says so and offers email + copy paths.
 */
const HireRequest = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sent
  const [delivery, setDelivery] = useState('whatsapp'); // whatsapp | blocked
  const [copied, setCopied] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => {
      if (!previous[name]) return previous;
      const next = { ...previous };
      delete next[name];
      return next;
    });
  };

  const brief = buildBrief(form);
  const whatsappUrl = hireWhatsAppUrl(brief);
  const mailtoUrl = `mailto:${HIRE_EMAIL}?subject=${encodeURIComponent(
    `Talent request — ${form.organisation || 'Zone01 employer'}`,
  )}&body=${encodeURIComponent(brief)}`;

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form);

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus('idle');
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(`employer-${firstField}`)?.focus();
      return;
    }

    setErrors({});

    // Open a blank tab first so we can tell whether the pop-up was blocked.
    // `noopener` makes window.open() return null even on success, so we sever
    // the opener reference ourselves before navigating.
    let popup;
    try {
      popup = window.open('about:blank', '_blank');
      if (popup) {
        popup.opener = null;
        popup.location.replace(whatsappUrl);
      }
    } catch {
      popup = null;
    }

    setDelivery(popup ? 'whatsapp' : 'blocked');
    setStatus('sent');
  };

  const handleCopy = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setStatus('idle');
    setDelivery('whatsapp');
    setCopied(false);
  };

  return (
    <section
      id="request"
      data-nav-theme="dark"
      className="relative overflow-hidden bg-primary pb-8 pt-10 md:pb-10 md:pt-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"
      />

      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="font-sans text-[1.875rem] font-black leading-tight tracking-tight text-white sm:text-section-headline">
              Request a talent shortlist.
            </h2>
            <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-white sm:text-body-l">
              Tell us what you are hiring for. Shortlist requests are typically
              answered within five working days by the talent team.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                {
                  icon: BadgeCheck,
                  text: 'Matched, screened profiles with project evidence.',
                },
                {
                  icon: ShieldCheck,
                  text: 'Clear terms before you commit. No cost to candidates.',
                },
                {
                  icon: Globe,
                  text: 'Remote, hybrid or onsite in Kisumu.',
                },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/10 text-white">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="font-sans text-body-m leading-relaxed text-white">
                    {text}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9 space-y-3 border-t border-white/15 pt-6">
              <a
                href={`mailto:${HIRE_EMAIL}`}
                className="flex items-center gap-3 font-mono text-body-m text-white transition-colors hover:text-white/80"
              >
                <Mail className="h-4 w-4 text-white" aria-hidden="true" />
                {HIRE_EMAIL}
              </a>
              <a
                href={hireWhatsAppUrl(
                  "Hi Zone01, I'd like to talk to an expert about hiring talent.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 font-mono text-body-m text-white transition-colors hover:text-white/80"
              >
                <MessageCircle className="h-4 w-4 text-white" aria-hidden="true" />
                WhatsApp the talent team
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-[0_30px_80px_rgba(3,20,48,0.35)] sm:p-8">
            {status === 'sent' ? (
              <div className="flex h-full flex-col justify-center py-6">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Check className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-sans text-cta-headline font-black tracking-tight text-secondary">
                  Your brief is ready.
                </h3>
                <p className="mt-3 max-w-md font-sans text-body-m leading-relaxed text-black-900/65">
                  {delivery === 'blocked'
                    ? 'Your browser blocked the WhatsApp window, but your brief is ready. Send it by email or copy it below.'
                    : 'We opened WhatsApp with your request pre-filled — review and send it to reach the talent team. Prefer email? Send the same brief from your inbox.'}
                </p>

                {delivery === 'blocked' && (
                  <div
                    role="status"
                    className="mt-4 max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
                  >
                    <p className="font-sans text-body-m font-semibold text-amber-900">
                      Pop-up blocked — nothing has been sent yet.
                    </p>
                    <p className="mt-1 font-sans text-body-s leading-relaxed text-amber-900/80">
                      Use <strong>Email the brief</strong> or copy it below. Your
                      answers are safe.
                    </p>
                  </div>
                )}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-body-m font-semibold transition-colors ${
                      delivery === 'blocked'
                        ? 'border border-primary text-primary hover:bg-primary hover:text-white'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    Open WhatsApp again
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href={mailtoUrl}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-body-m font-semibold transition-colors ${
                      delivery === 'blocked'
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'border border-primary text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Email the brief
                  </a>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-full border border-secondary/20 px-4 py-2 font-sans text-body-s font-semibold text-secondary transition-colors hover:border-primary hover:text-primary"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span aria-live="polite">
                      {copied ? 'Brief copied' : 'Copy the brief'}
                    </span>
                  </button>
                  <span className="font-mono text-body-s text-black-900/70">
                    Same text as the WhatsApp message
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-6 w-fit font-mono text-body-s text-secondary/50 underline-offset-4 hover:text-secondary hover:underline"
                >
                  Edit this brief
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" name="name" required error={errors.name}>
                    <input
                      id="employer-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'employer-name-error' : undefined}
                      className={inputClasses(errors.name)}
                      placeholder="Amina Otieno"
                    />
                  </Field>

                  <Field
                    label="Organisation"
                    name="organisation"
                    required
                    error={errors.organisation}
                  >
                    <input
                      id="employer-organisation"
                      name="organisation"
                      type="text"
                      autoComplete="organization"
                      value={form.organisation}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.organisation)}
                      aria-describedby={
                        errors.organisation ? 'employer-organisation-error' : undefined
                      }
                      className={inputClasses(errors.organisation)}
                      placeholder="Company or team"
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <Field
                      label="Work email"
                      name="email"
                      required
                      error={errors.email}
                    >
                      <input
                        id="employer-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'employer-email-error' : undefined}
                        className={inputClasses(errors.email)}
                        placeholder="you@company.com"
                      />
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <Field
                      label="Roles required"
                      name="roles"
                      required
                      error={errors.roles}
                    >
                      <input
                        id="employer-roles"
                        name="roles"
                        type="text"
                        value={form.roles}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.roles)}
                        aria-describedby={errors.roles ? 'employer-roles-error' : undefined}
                        className={inputClasses(errors.roles)}
                        placeholder="e.g. Backend engineer, data engineer"
                      />
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <Field
                      label="Skills required"
                      name="skills"
                      required
                      error={errors.skills}
                    >
                      <input
                        id="employer-skills"
                        name="skills"
                        type="text"
                        value={form.skills}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.skills)}
                        aria-describedby={
                          errors.skills ? 'employer-skills-error' : undefined
                        }
                        className={inputClasses(errors.skills)}
                        placeholder="e.g. Go, PostgreSQL, CI/CD"
                      />
                    </Field>
                  </div>

                  <Field
                    label="Number of people"
                    name="people"
                    required
                    error={errors.people}
                  >
                    <input
                      id="employer-people"
                      name="people"
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={form.people}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.people)}
                      aria-describedby={
                        errors.people ? 'employer-people-error' : undefined
                      }
                      className={inputClasses(errors.people)}
                      placeholder="1"
                    />
                  </Field>

                  <Field
                    label="Employment type"
                    name="employment"
                    required
                    error={errors.employment}
                  >
                    <select
                      id="employer-employment"
                      name="employment"
                      value={form.employment}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.employment)}
                      aria-describedby={
                        errors.employment ? 'employer-employment-error' : undefined
                      }
                      className={`${inputClasses(errors.employment)} [&>option]:text-secondary`}
                    >
                      <option value="">Please select</option>
                      {EMPLOYMENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label="Work arrangement"
                    name="arrangement"
                    required
                    error={errors.arrangement}
                  >
                    <select
                      id="employer-arrangement"
                      name="arrangement"
                      value={form.arrangement}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.arrangement)}
                      aria-describedby={
                        errors.arrangement ? 'employer-arrangement-error' : undefined
                      }
                      className={`${inputClasses(errors.arrangement)} [&>option]:text-secondary`}
                    >
                      <option value="">Please select</option>
                      {WORK_ARRANGEMENTS.map((arrangement) => (
                        <option key={arrangement} value={arrangement}>
                          {arrangement}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Approx. start date (optional)" name="startDate">
                    <input
                      id="employer-startDate"
                      name="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={handleChange}
                      className={inputClasses(false)}
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <Field
                      label="Additional information (optional)"
                      name="notes"
                    >
                      <textarea
                        id="employer-notes"
                        name="notes"
                        rows="3"
                        maxLength="600"
                        value={form.notes}
                        onChange={handleChange}
                        className={`${inputClasses(false)} resize-y`}
                        placeholder="Timelines, seniority, team context or anything else we should know."
                      />
                    </Field>
                  </div>
                </div>

                {Object.keys(errors).length > 0 && (
                  <p
                    role="alert"
                    className="mt-5 rounded-lg bg-red-50 px-4 py-3 font-sans text-body-m text-red-700"
                  >
                    Please complete the highlighted fields so we can route your
                    request correctly.
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-sans text-body-m font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                >
                  Request a talent shortlist
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <p className="mt-3 text-center font-sans text-[11px] leading-relaxed text-black-900/70">
                  Submitting opens WhatsApp with your brief pre-filled, so you can
                  review it before sending. We only use these details to respond
                  to your request.
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HireRequest;
