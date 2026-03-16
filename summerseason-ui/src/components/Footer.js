const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  /* ── BOOTSTRAP NUCLEAR RESET ──────────────────────────────────────────
     Bootstrap inietta border-color: #dee2e6 su moltissimi selettori.
     Questi override globali ripristinano il dark theme ovunque Bootstrap
     abbia "inquinato" bordi, sfondi e testi.
  ──────────────────────────────────────────────────────────────────── */

  /* Reset variabili Bootstrap stesse */
  :root {
    --bs-border-color: rgba(255,255,255,0.08) !important;
    --bs-border-color-translucent: rgba(255,255,255,0.08) !important;
    --bs-body-bg: #0d1117 !important;
    --bs-body-color: #eef2ff !important;
    --bs-card-bg: #1a2236 !important;
    --bs-card-border-color: rgba(255,255,255,0.08) !important;
    --bs-table-bg: transparent !important;
    --bs-table-border-color: rgba(255,255,255,0.07) !important;
  }

  /* Bordi Bootstrap su elementi HTML */
  *,
  *::before,
  *::after {
    border-color: rgba(255,255,255,0.08);
  }

  /* Classi Bootstrap che portano bordi bianchi */
  .border,
  .border-top,
  .border-bottom,
  .border-start,
  .border-end {
    border-color: rgba(255,255,255,0.08) !important;
  }

  /* Sfondi light Bootstrap */
  .bg-light   { background-color: #121826 !important; }
  .bg-white   { background-color: #1a2236 !important; }
  .bg-body    { background-color: #0d1117 !important; }

  /* Testi muted Bootstrap */
  .text-muted { color: #8b97b8 !important; }
  .text-dark  { color: #eef2ff !important; }

  /* Card Bootstrap */
  .card {
    background-color: #1a2236 !important;
    border-color: rgba(255,255,255,0.08) !important;
  }

  /* Table Bootstrap */
  .table {
    --bs-table-bg: transparent;
    --bs-table-border-color: rgba(255,255,255,0.07);
    color: #eef2ff !important;
  }
  .table thead th,
  .table td,
  .table th {
    border-color: rgba(255,255,255,0.07) !important;
  }
  .table-striped > tbody > tr:nth-of-type(odd) > * {
    background-color: rgba(255,255,255,0.02) !important;
    color: #eef2ff !important;
  }

  /* Form controls Bootstrap */
  .form-control,
  .form-select {
    background-color: rgba(255,255,255,0.04) !important;
    border-color: rgba(255,255,255,0.1) !important;
    color: #eef2ff !important;
  }
  .form-control::placeholder { color: #4b5675 !important; }
  .form-control:focus,
  .form-select:focus {
    background-color: rgba(255,255,255,0.06) !important;
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 3px rgba(96,165,250,0.15) !important;
    color: #eef2ff !important;
  }

  /* Alert Bootstrap */
  .alert-danger {
    background-color: rgba(248,113,113,0.1) !important;
    border-color: rgba(248,113,113,0.25) !important;
    color: #f87171 !important;
  }

  /* Btn Bootstrap leftover */
  .btn-primary {
    background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%) !important;
    border-color: transparent !important;
    color: #0d1117 !important;
  }

  /* ── FOOTER ─────────────────────────────────────────────────────── */

  .ss-footer {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #0d1117;
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 32px 48px;
    margin-top: auto;
    position: relative;
    overflow: hidden;
  }

  .ss-footer::before {
    content: '';
    display: block;
    height: 2px;
    background: linear-gradient(90deg, #1241a8 0%, #fbbf24 50%, #1241a8 100%);
    background-size: 200% 100%;
    animation: footerShimmer 6s ease infinite;
    position: absolute;
    top: 0; left: 0; right: 0;
    opacity: 0.6;
  }

  @keyframes footerShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .ss-footer-inner {
    max-width: 1360px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }

  .ss-footer-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ss-footer-brand-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
    box-shadow: 0 2px 8px rgba(251,191,36,0.25);
    flex-shrink: 0;
  }

  .ss-footer-brand-name {
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    font-weight: 800;
    color: #eef2ff;
    letter-spacing: -0.01em;
  }

  .ss-footer-brand-name span { color: #fbbf24; }

  .ss-footer-copy {
    font-size: 0.75rem;
    color: #4b5675;
    font-weight: 500;
  }

  .ss-footer-copy strong {
    color: #8b97b8;
    font-weight: 600;
  }

  .ss-footer-links {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .ss-footer-link {
    font-size: 0.73rem;
    font-weight: 600;
    color: #4b5675;
    padding: 5px 10px;
    border-radius: 6px;
    transition: color 0.15s, background 0.15s;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .ss-footer-link:hover {
    color: #60a5fa;
    background: rgba(96,165,250,0.08);
  }

  .ss-footer-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: #4b5675;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .ss-footer {
      padding: 28px 20px;
    }
    .ss-footer-inner {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 14px;
    }
    .ss-footer-links { flex-wrap: wrap; justify-content: center; }
  }
`;

function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{footerStyles}</style>
      <footer className="ss-footer">
        <div className="ss-footer-inner">

          <div className="ss-footer-brand">
            <span className="ss-footer-brand-name">Summer<span>Season</span></span>
          </div>

          <p className="ss-footer-copy">
            © {year} <strong>Summer Season</strong> — Tutti i diritti riservati
          </p>


        </div>
      </footer>
    </>
  );
}

export default Footer;