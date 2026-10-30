// components/impact/LatestReports.jsx
import { useEffect, useState } from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// Shown until editors upload the first report in the Django admin.
const PLACEHOLDER_REPORTS = [
  { id: 'q4-2026', title: 'Q4 2026 Report' },
  { id: 'q3-2026', title: 'Q3 2026 Report' },
  { id: 'q2-2026', title: 'Q2 2026 Report' },
  { id: 'q1-2026', title: 'Q1 2026 Report' },
  { id: 'annual-2025', title: '2025 Annual Report' },
  { id: 'annual-2024', title: '2024 Annual Report' },
];

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  year: 'numeric',
});

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date);
};

export default function LatestReports() {
  const [reports, setReports] = useState(PLACEHOLDER_REPORTS);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/reports/`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const results = Array.isArray(payload) ? payload : payload.results;
        if (Array.isArray(results) && results.length > 0) {
          setReports(results);
        }
      } catch (error) {
        if (error?.name === 'AbortError') return;
        // Keep placeholders when the CMS is unreachable.
      }
    };

    load();
    const timer = window.setInterval(load, 60_000);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      controller.abort();
    };
  }, []);

  return (
    <section
      id="impact-reports"
      data-nav-theme="light"
      aria-labelledby="impact-reports-title"
      className="impact-reports-section"
    >
      <div className="impact-wrap">
        <header className="impact-reports-head">
          <h2 id="impact-reports-title" className="impact-reports-title">
            Our latest reports
          </h2>
          <p className="impact-reports-sub">
            Annual performance, programme outcomes and independent evidence from
            the Zone01 Kisumu journey.
          </p>
        </header>

        <div className="impact-reports-grid">
          {reports.map((report) => (
            <article className="impact-report-card" key={report.id || report.title}>
              <div className="impact-report-top">
                <span className="impact-report-icon" aria-hidden="true">
                  <FileText size={20} strokeWidth={1.9} />
                </span>
                <span className="impact-report-type">
                  {report.report ? 'PDF' : 'Placeholder'}
                </span>
              </div>

              <div>
                <h3 className="impact-report-title">{report.title}</h3>
                {report.published_at ? (
                  <p className="impact-report-date">{formatDate(report.published_at)}</p>
                ) : null}

                {report.report ? (
                  <a
                    className="impact-report-link"
                    href={report.report}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Report
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ) : (
                  <span className="impact-report-link impact-report-link--pending">
                    Report coming soon
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
