import { useState } from 'react';

const TRACKS = [
  { value: 'fullstack', label: 'Full-Stack Development' },
  { value: 'data', label: 'Data & AI' },
  { value: 'devops', label: 'DevOps & Cloud' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'other', label: 'Other' },
];

export default function ApplicationForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    choice: '',
    motivation: '',
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrors({});
    try {
      const res = await fetch('/api/applicants/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || { general: data.error || 'Submission failed.' });
        setStatus('error');
        return;
      }
      setStatus('success');
      setForm({ name: '', email: '', phone: '', choice: '', motivation: '' });
    } catch (err) {
      setErrors({ general: 'Network error. Please try again.' });
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="application-form application-form--success">
        <h2>Application submitted</h2>
        <p>Thank you for applying to Zone01. We will be in touch.</p>
      </div>
    );
  }

  return (
    <form className="application-form" onSubmit={handleSubmit} noValidate>
      <h2>Apply to Zone01</h2>

      <label>
        Full Name
        <input name="name" value={form.name} onChange={handleChange} required />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </label>

      <label>
        Email
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </label>

      <label>
        Phone
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
        {errors.phone && <span className="field-error">{errors.phone}</span>}
      </label>

      <label>
        Track / Program
        <select name="choice" value={form.choice} onChange={handleChange} required>
          <option value="">Select a track</option>
          {TRACKS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        {errors.choice && <span className="field-error">{errors.choice}</span>}
      </label>

      <label>
        Motivation
        <textarea name="motivation" value={form.motivation} onChange={handleChange} required rows={4} />
        {errors.motivation && <span className="field-error">{errors.motivation}</span>}
      </label>

      {errors.general && <p className="form-error">{errors.general}</p>}

      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}