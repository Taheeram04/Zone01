// components/impact/LatestReports.jsx
import { useEffect, useMemo, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import annual2025Cover from '../../assets/reports/annual-2025.webp';
import q1_2025Cover from '../../assets/reports/q1-2025.webp';
import q2_2025Cover from '../../assets/reports/q2-2025.webp';
import q3_2025Cover from '../../assets/reports/q3-2025.webp';
import q1_2026Cover from '../../assets/reports/q1-2026.webp';
import q2_2026Cover from '../../assets/reports/q2-2026.webp';
import q3_2026Cover from '../../assets/reports/q3-2026.webp';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const REPORT_COVERS = {
  'Q3 2026 Report': q3_2026Cover,
  'Q2 2026 Report': q2_2026Cover,
  'Q1 2026 Report': q1_2026Cover,
  '2025 Annual Report': annual2025Cover,
  'Q3 2025 Report': q3_2025Cover,
  'Q2 2025 Report': q2_2025Cover,
  'Q1 2025 Report': q1_2025Cover,
};

// Front covers shown until editors attach images or PDFs in the CMS.
const PLACEHOLDER_REPORTS = [
  { id: 'q3-2026', title: 'Q3 2026 Report', year: 2026, order: 1, cover: q3_2026Cover },
  { id: 'q2-2026', title: 'Q2 2026 Report', year: 2026, order: 2, cover: q2_2026Cover },
  { id: 'q1-2026', title: 'Q1 2026 Report', year: 2026, order: 3, cover: q1_2026Cover },
  { id: 'annual-2025', title: '2025 Annual Report', year: 2025, order: 4, cover: annual2025Cover },
  { id: 'q3-2025', title: 'Q3 2025 Report', year: 2025, order: 5, cover: q3_2025Cover },
  { id: 'q2-2025', title: 'Q2 2025 Report', year: 2025, order: 6, cover: q2_2025Cover },
  { id: 'q1-2025', title: 'Q1 2025 Report', year: 2025, order: 7, cover: q1_2025Cover },
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

const normalizeReport = (report) => ({
  ...report,
  year:
    Number(report.year) ||
    (report.published_at ? new Date(report.published_at).getFullYear() : new Date().getFullYear()),
  cover: report.cover || REPORT_COVERS[report.title] || null,
});

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
        // Keep the cover placeholders when the CMS is unreachable.
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

  const orderedReports = useMemo(
    () =>
      reports
        .map(normalizeReport)
        .sort(
          (a, b) =>
            b.year - a.year ||
            (a.order ?? 0) - (b.order ?? 0) ||
            a.title.localeCompare(b.title)
        ),
    [reports]
  );

  const visibleReports = orderedReports;

  const groupedReports = useMemo(() => {
    const groups = new Map();
    visibleReports.forEach((report) => {
      if (!groups.has(report.year)) groups.set(report.year, []);
      groups.get(report.year).push(report);
    });
    return [...groups.entries()].sort((a, b) => b[0] - a[0]);
  }, [visibleReports]);

  return (
    <section
      id="impact-reports"
      data-nav-theme="dark"
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

        {groupedReports.map(([year, yearReports]) => (
          <div className="impact-reports-year" key={year}>
            <h3 className="impact-reports-year-title">{year}</h3>
            <div className="impact-reports-grid">
              {yearReports.map((report) => (
                <article className="impact-report-card" key={report.id || report.title}>
                  <div className="impact-report-cover">
                    {report.cover ? (
                      <img src={report.cover} alt="" loading="lazy" />
                    ) : (
                      <span className="impact-report-cover-fallback" aria-hidden="true">
                        <FileText size={28} strokeWidth={1.6} />
                      </span>
                    )}
                    {report.report ? <span className="impact-report-type">PDF</span> : null}
                  </div>

                  <div className="impact-report-body">
                    <h4 className="impact-report-title">{report.title}</h4>
                    {report.published_at ? (
                      <p className="impact-report-date">{formatDate(report.published_at)}</p>
                    ) : null}

                    {report.report ? (
                      <a
                        className="impact-report-link"
                        href={report.report}
                        download={report.report_name || `${report.title}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Report
                        <Download size={14} aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
