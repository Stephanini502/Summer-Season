export const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
 
  :root {
    --sun:        #f59e0b;
    --sun-light:  #fef3c7;
    --sun-dark:   #d97706;
    --ocean:      #1a56db;
    --ocean-light:#e8f0fe;
    --ocean-dark: #1241a8;
    --sand:       #fffbf0;
    --text:       #111827;
    --text-muted: #6b7280;
    --border:     #e5eaf3;
  }
 
  .nav-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #ffffff;
    border-bottom: 1px solid var(--border);
    box-shadow: 0 2px 12px rgba(26,86,219,0.08);
    position: sticky;
    top: 0;
    z-index: 100;
  }
 
  /* Striscia decorativa solare in cima */
  .nav-root::before {
    content: '';
    display: block;
    height: 3px;
    background: linear-gradient(90deg, var(--ocean) 0%, var(--sun) 50%, var(--ocean) 100%);
    background-size: 200% 100%;
    animation: navShimmer 4s ease infinite;
  }
 
  @keyframes navShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
 
  .nav-inner {
    max-width: 1360px;
    margin: 0 auto;
    padding: 0 48px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
 
  /* BRAND */
  .nav-brand {
    display: flex;
    align-items: center;
    gap: 11px;
    text-decoration: none;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  .nav-brand:hover { transform: translateY(-1px); }
 
  .nav-brand-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--sun) 0%, var(--sun-dark) 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(245,158,11,0.4);
  }
 
  .nav-brand-text {
    font-family: 'Outfit', sans-serif;
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.02em;
    line-height: 1;
  }
 
  .nav-brand-text .brand-season {
    color: var(--sun-dark);
  }
 
  .nav-brand-badge {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ocean);
    background: var(--ocean-light);
    padding: 2px 7px;
    border-radius: 20px;
    margin-left: 4px;
    vertical-align: middle;
    border: 1px solid #c7d9f8;
  }
 
  /* ACTIONS */
  .nav-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
 
  .nav-btn {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 9px 18px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.18s, transform 0.15s, box-shadow 0.18s, color 0.18s;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }
 
  .nav-btn-ghost {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border);
  }
  .nav-btn-ghost:hover {
    background: var(--ocean-light);
    color: var(--ocean);
    border-color: #c7d9f8;
    transform: translateY(-1px);
  }
 
  .nav-btn-outline {
    background: transparent;
    color: var(--ocean);
    border: 1.5px solid #c7d9f8;
  }
  .nav-btn-outline:hover {
    background: var(--ocean-light);
    border-color: var(--ocean);
    transform: translateY(-1px);
  }
 
  /* Bottone solare — il CTA principale */
  .nav-btn-primary {
    background: linear-gradient(135deg, var(--sun) 0%, var(--sun-dark) 100%);
    color: #ffffff;
    box-shadow: 0 2px 10px rgba(245,158,11,0.35);
    border: none;
    font-weight: 700;
  }
  .nav-btn-primary:hover {
    background: linear-gradient(135deg, #fbbf24 0%, var(--sun) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(245,158,11,0.45);
  }
 
  .nav-divider {
    width: 1px;
    height: 22px;
    background: var(--border);
    margin: 0 4px;
  }
 
  /* Pill utente loggato */
  .nav-user-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 14px 5px 6px;
    border-radius: 20px;
    background: var(--sand);
    border: 1px solid #fde68a;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text);
    cursor: pointer;
    transition: background 0.15s, transform 0.15s;
  }
  .nav-user-pill:hover { background: var(--sun-light); transform: translateY(-1px); }
 
  .nav-user-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, var(--sun) 0%, var(--sun-dark) 100%);
    color: #fff; font-size: 0.62rem; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
 
  @media (max-width: 600px) {
    .nav-inner { padding: 0 20px; }
    .nav-brand-text { display: none; }
    .nav-brand-badge { display: none; }
    .nav-btn { padding: 8px 13px; font-size: 0.76rem; }
  }
`;
 

export const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
 
  :root {
    --bg:           #f5f7ff;
    --white:        #ffffff;
    --sun:          #f59e0b;
    --sun-light:    #fef3c7;
    --sun-dark:     #d97706;
    --sun-mid:      #fde68a;
    --ocean:        #1a56db;
    --ocean-light:  #e8f0fe;
    --ocean-mid:    #c7d9f8;
    --ocean-dark:   #1241a8;
    --text:         #111827;
    --text-muted:   #6b7280;
    --text-light:   #9ca3af;
    --border:       #e5eaf3;
    --success:      #0d9488;
    --success-light:#f0fdfa;
    --success-mid:  #99f6e4;
    --warning:      #d97706;
    --warning-light:#fffbeb;
    --danger:       #dc2626;
    --danger-light: #fef2f2;
    --radius:       14px;
    --radius-sm:    9px;
    --shadow-sm:    0 1px 4px rgba(26,86,219,0.07), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md:    0 6px 20px rgba(26,86,219,0.11), 0 2px 8px rgba(0,0,0,0.05);
    --shadow-sun:   0 4px 16px rgba(245,158,11,0.25);
  }
 
  * { box-sizing: border-box; margin: 0; padding: 0; }
 
  .pg-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    color: var(--text);
    padding: 36px 48px;
  }
 
  .pg-content { max-width: 1360px; margin: 0 auto; }
 
  /* ── HEADER ── */
  .pg-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 36px;
    animation: pgFadeDown 0.45s ease both;
  }
 
  .pg-eyebrow {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--sun-dark);
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .pg-eyebrow::before {
    content: '';
    display: inline-block;
    width: 14px; height: 2px;
    background: var(--sun);
    border-radius: 2px;
  }
 
  .pg-title {
    font-family: 'Outfit', sans-serif;
    font-size: 2.1rem;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.03em;
    line-height: 1.1;
  }
 
  .pg-subtitle {
    font-size: 0.82rem;
    color: var(--text-muted);
    margin-top: 4px;
  }
 
  /* ── BUTTONS ── */
  .pg-btn {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    border: none;
    padding: 10px 20px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
    white-space: nowrap;
  }
 
  .pg-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
 
  .pg-btn-primary {
    background: var(--ocean);
    color: #fff;
    box-shadow: 0 2px 8px rgba(26,86,219,0.25);
  }
  .pg-btn-primary:hover:not(:disabled) {
    background: var(--ocean-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(26,86,219,0.35);
  }
 
  .pg-btn-sun {
    background: linear-gradient(135deg, var(--sun) 0%, var(--sun-dark) 100%);
    color: #fff;
    box-shadow: var(--shadow-sun);
    font-weight: 700;
  }
  .pg-btn-sun:hover:not(:disabled) {
    background: linear-gradient(135deg, #fbbf24 0%, var(--sun) 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(245,158,11,0.4);
  }
 
  .pg-btn-success {
    background: var(--success);
    color: #fff;
    box-shadow: 0 2px 8px rgba(13,148,136,0.22);
  }
  .pg-btn-success:hover:not(:disabled) {
    background: #0f766e;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(13,148,136,0.3);
  }
 
  .pg-btn-warning {
    background: var(--warning);
    color: #fff;
    box-shadow: 0 2px 8px rgba(217,119,6,0.22);
  }
  .pg-btn-warning:hover:not(:disabled) { background: #b45309; transform: translateY(-1px); }
 
  .pg-btn-danger {
    background: var(--danger);
    color: #fff;
    box-shadow: 0 2px 8px rgba(220,38,38,0.2);
  }
  .pg-btn-danger:hover:not(:disabled) { background: #b91c1c; transform: translateY(-1px); }
 
  .pg-btn-ghost {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border);
  }
  .pg-btn-ghost:hover:not(:disabled) { background: var(--ocean-light); color: var(--ocean); border-color: var(--ocean-mid); }
 
  .pg-btn-sm { padding: 7px 14px; font-size: 0.76rem; }
 
  /* ── ALERT ── */
  .pg-alert {
    border-radius: var(--radius-sm);
    padding: 13px 18px;
    font-size: 0.83rem;
    font-weight: 500;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: pgFadeDown 0.3s ease both;
  }
  .pg-alert-danger  { background: var(--danger-light);  border: 1px solid #fecaca; color: var(--danger); }
  .pg-alert-success { background: var(--success-light); border: 1px solid var(--success-mid); color: var(--success); }
 
  /* ── STAT CARDS ── */
  .pg-stats {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    flex-wrap: wrap;
    animation: pgFadeUp 0.45s ease 0.08s both;
  }
 
  .pg-stat-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 22px 26px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    box-shadow: var(--shadow-sm);
    flex: 1;
    min-width: 160px;
    transition: box-shadow 0.2s, transform 0.2s;
    position: relative;
    overflow: hidden;
  }
  .pg-stat-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--ocean) 0%, var(--sun) 100%);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .pg-stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); }
  .pg-stat-card:hover::after { opacity: 1; }
 
  .pg-stat-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 5px;
  }
 
  .pg-stat-value {
    font-family: 'Outfit', sans-serif;
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--ocean);
    letter-spacing: -0.04em;
    line-height: 1;
  }
 
  .pg-stat-value-sm {
    font-family: 'Outfit', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1.2;
  }
 
  .pg-stat-sub { font-size: 0.72rem; color: var(--text-muted); margin-top: 3px; }
 
  .pg-stat-icon {
    width: 50px; height: 50px;
    border-radius: 13px;
    background: var(--ocean-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  .pg-stat-icon-sun    { background: var(--sun-light); }
  .pg-stat-icon-green  { background: var(--success-light); }
  .pg-stat-icon-yellow { background: var(--warning-light); }
 
  /* ── CARD ── */
  .pg-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    animation: pgFadeUp 0.45s ease both;
    margin-bottom: 20px;
    transition: box-shadow 0.2s;
  }
 
  .pg-card-header {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(to right, #fafbff, #fffdf5);
  }
 
  .pg-card-header-left { display: flex; align-items: center; gap: 10px; }
 
  .pg-card-icon {
    width: 30px; height: 30px;
    border-radius: 8px;
    background: var(--ocean-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem;
    flex-shrink: 0;
  }
 
  .pg-card-title {
    font-family: 'Outfit', sans-serif;
    font-size: 0.92rem;
    font-weight: 700;
    color: var(--text);
  }
 
  /* ── HERO ── */
  .pg-hero {
    background: linear-gradient(130deg, var(--ocean-dark) 0%, var(--ocean) 55%, #2563eb 100%);
    border-radius: var(--radius);
    padding: 40px 44px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 32px;
    box-shadow: 0 8px 28px rgba(26,86,219,0.28);
    animation: pgFadeDown 0.45s ease both;
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;
  }
 
  /* Decorazione onde / sole */
  .pg-hero::before {
    content: '☀️';
    position: absolute;
    right: 180px; top: -10px;
    font-size: 5rem;
    opacity: 0.08;
    animation: pgHeroSpin 20s linear infinite;
  }
  .pg-hero::after {
    content: '';
    position: absolute;
    bottom: -30px; right: -30px;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(245,158,11,0.12);
  }
 
  @keyframes pgHeroSpin { to { transform: rotate(360deg); } }
 
  .pg-hero-eyebrow {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    opacity: 0.7;
    margin-bottom: 8px;
    display: flex; align-items: center; gap: 6px;
  }
  .pg-hero-eyebrow::before {
    content: '';
    display: inline-block;
    width: 12px; height: 2px;
    background: var(--sun);
    border-radius: 2px;
  }
 
  .pg-hero-title {
    font-family: 'Outfit', sans-serif;
    font-size: 2.2rem;
    font-weight: 900;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }
 
  .pg-hero-sub { font-size: 0.85rem; opacity: 0.72; margin-top: 5px; }
 
  .pg-btn-hero {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--sun) 0%, var(--sun-dark) 100%);
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    box-shadow: 0 3px 12px rgba(245,158,11,0.4);
    transition: transform 0.15s, box-shadow 0.15s;
    white-space: nowrap;
    position: relative;
    z-index: 1;
  }
  .pg-btn-hero:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245,158,11,0.5); }
 
  /* ── GRID ── */
  .pg-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .pg-grid-sidebar { display: grid; grid-template-columns: 340px 1fr; gap: 20px; }
  .pg-col { display: flex; flex-direction: column; }
 
  /* ── TABLE ── */
  .pg-table-wrap { overflow-x: auto; }
  .pg-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  .pg-table thead tr { background: linear-gradient(to right, #fafbff, #fffdf5); border-bottom: 1px solid var(--border); }
  .pg-table th {
    padding: 11px 16px;
    text-align: left;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.11em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .pg-table tbody tr { border-bottom: 1px solid var(--border); transition: background 0.14s; }
  .pg-table tbody tr:last-child { border-bottom: none; }
  .pg-table tbody tr.clickable { cursor: pointer; }
  .pg-table tbody tr.clickable:hover { background: var(--ocean-light); }
  .pg-table tbody tr:not(.clickable):hover { background: #fafbff; }
  .pg-table td { padding: 12px 16px; color: var(--text); vertical-align: middle; }
  .pg-table td.muted { color: var(--text-muted); font-size: 0.78rem; }
  .pg-table td.bold { font-weight: 600; }
 
  /* ── LIST GROUP ── */
  .pg-list { list-style: none; }
  .pg-list-item {
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; transition: background 0.14s;
  }
  .pg-list-item:last-child { border-bottom: none; }
  .pg-list-item.clickable { cursor: pointer; }
  .pg-list-item.clickable:hover { background: var(--ocean-light); }
  .pg-list-item-name { font-weight: 600; font-size: 0.88rem; }
  .pg-list-item-sub  { font-size: 0.74rem; color: var(--text-muted); margin-top: 2px; }
 
  /* ── BADGES ── */
  .pg-badge {
    display: inline-block;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
    white-space: nowrap;
  }
  .pg-badge-blue   { background: var(--ocean-light); border: 1px solid var(--ocean-mid); color: var(--ocean); }
  .pg-badge-sun    { background: var(--sun-light); border: 1px solid var(--sun-mid); color: var(--sun-dark); }
  .pg-badge-green  { background: var(--success-light); border: 1px solid var(--success-mid); color: var(--success); }
  .pg-badge-yellow { background: var(--warning-light); border: 1px solid #fde68a; color: var(--warning); }
  .pg-badge-red    { background: var(--danger-light); border: 1px solid #fecaca; color: var(--danger); }
 
  /* Rank badges podio */
  .pg-rank {
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--ocean-light); border: 1px solid var(--ocean-mid);
    color: var(--ocean); font-size: 0.72rem; font-weight: 800;
    display: inline-flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-family: 'Outfit', sans-serif;
  }
  .pg-rank-1 { background: linear-gradient(135deg, #fef3c7, #fde68a); border-color: #f59e0b; color: #92400e; box-shadow: 0 2px 8px rgba(245,158,11,0.3); }
  .pg-rank-2 { background: linear-gradient(135deg, #f1f5f9, #e2e8f0); border-color: #94a3b8; color: #334155; }
  .pg-rank-3 { background: linear-gradient(135deg, #fef9ec, #fef3c7); border-color: #fbbf24; color: #78350f; }
 
  /* ── FORM ── */
  .pg-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
 
  .pg-field-label {
    font-size: 0.7rem; font-weight: 700;
    color: var(--text-muted); letter-spacing: 0.07em; text-transform: uppercase;
  }
 
  .pg-input, .pg-select, .pg-textarea {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.83rem;
    background: #f9faff;
    border: 1px solid var(--border);
    color: var(--text);
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    width: 100%; outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }
  .pg-input::placeholder, .pg-textarea::placeholder { color: var(--text-light); }
  .pg-input:focus, .pg-select:focus, .pg-textarea:focus {
    border-color: var(--ocean);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
  }
  .pg-select { cursor: pointer; }
  .pg-textarea { resize: vertical; min-height: 80px; }
  .pg-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
 
  .pg-inline-form { display: flex; gap: 10px; align-items: flex-end; }
  .pg-inline-form .pg-select { flex: 1; }
 
  /* ── DELETE BTN ── */
  .pg-delete-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 6px;
    background: var(--danger-light); border: 1px solid #fecaca;
    color: var(--danger); font-size: 0.58rem; font-weight: 700;
    cursor: pointer; margin-right: 8px; vertical-align: middle;
    transition: background 0.15s, transform 0.12s; flex-shrink: 0;
  }
  .pg-delete-btn:hover { background: var(--danger); color: #fff; border-color: var(--danger); transform: scale(1.1); }
 
  /* ── EMPTY STATE ── */
  .pg-empty { text-align: center; color: var(--text-light); font-size: 0.8rem; padding: 36px 0; }
 
  /* ── LOADING ── */
  .pg-loading { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
  .pg-spinner {
    width: 38px; height: 38px; border-radius: 50%;
    border: 3px solid var(--ocean-light); border-top-color: var(--sun);
    animation: pgSpin 0.7s linear infinite;
  }
 
  /* ── AVATAR ── */
  .pg-avatar {
    width: 64px; height: 64px; border-radius: 50%;
    background: linear-gradient(135deg, var(--ocean-light), var(--sun-light));
    border: 2px solid var(--sun-mid);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Outfit', sans-serif;
    font-size: 1.6rem; font-weight: 800; color: var(--ocean-dark);
    margin: 0 auto 12px; flex-shrink: 0;
  }
 
  /* ── INFO ROW ── */
  .pg-info-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 0.83rem;
  }
  .pg-info-row:last-child { border-bottom: none; }
  .pg-info-row-label { color: var(--text-muted); font-weight: 500; }
  .pg-info-row-value { font-weight: 700; color: var(--text); }
 
  /* ── CHALLENGE GRID ── */
  .pg-challenge-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; padding: 20px; }
 
  .pg-challenge-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    display: flex; flex-direction: column; gap: 10px;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s, transform 0.2s;
    animation: pgFadeUp 0.4s ease both;
    position: relative; overflow: hidden;
  }
  .pg-challenge-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--ocean), var(--sun));
    opacity: 0; transition: opacity 0.2s;
  }
  .pg-challenge-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); }
  .pg-challenge-card:hover::before { opacity: 1; }
 
  .pg-challenge-name { font-family: 'Outfit', sans-serif; font-size: 0.98rem; font-weight: 700; color: var(--text); }
  .pg-challenge-desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; flex: 1; }
  .pg-challenge-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
 
  /* ── ANIMATIONS ── */
  @keyframes pgFadeDown { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pgFadeUp   { from { opacity: 0; transform: translateY(18px);  } to { opacity: 1; transform: translateY(0); } }
  @keyframes pgSpin     { to { transform: rotate(360deg); } }
 
  @media (max-width: 960px) {
    .pg-root { padding: 24px 20px; }
    .pg-grid-2, .pg-grid-sidebar { grid-template-columns: 1fr; }
    .pg-stats { flex-direction: column; }
    .pg-hero { flex-direction: column; align-items: flex-start; padding: 28px 24px; }
    .pg-hero-title { font-size: 1.7rem; }
  }
`;

export const adminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
 
  :root {
    --bg:           #f5f7ff;
    --white:        #ffffff;
    --sun:          #f59e0b;
    --sun-light:    #fef3c7;
    --sun-dark:     #d97706;
    --sun-mid:      #fde68a;
    --ocean:        #1a56db;
    --ocean-light:  #e8f0fe;
    --ocean-mid:    #c7d9f8;
    --ocean-dark:   #1241a8;
    --text:         #111827;
    --text-muted:   #6b7280;
    --text-light:   #9ca3af;
    --border:       #e5eaf3;
    --danger:       #dc2626;
    --danger-light: #fef2f2;
    --radius:       14px;
    --radius-sm:    9px;
    --shadow-sm:    0 1px 4px rgba(26,86,219,0.07), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md:    0 6px 20px rgba(26,86,219,0.11), 0 2px 8px rgba(0,0,0,0.05);
  }
 
  * { box-sizing: border-box; margin: 0; padding: 0; }
 
  .adm-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    color: var(--text);
    padding: 36px 48px;
  }
 
  .adm-content { max-width: 1360px; margin: 0 auto; }
 
  /* HEADER */
  .adm-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 36px; animation: fadeDown 0.45s ease both;
  }
 
  .adm-eyebrow {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--sun-dark); margin-bottom: 4px;
    display: flex; align-items: center; gap: 6px;
  }
  .adm-eyebrow::before {
    content: ''; display: inline-block;
    width: 14px; height: 2px;
    background: var(--sun); border-radius: 2px;
  }
 
  .adm-title {
    font-family: 'Outfit', sans-serif;
    font-size: 2.1rem; font-weight: 800;
    color: var(--text); letter-spacing: -0.03em; line-height: 1.1;
  }
 
  .adm-btn-primary {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.82rem; font-weight: 700;
    background: linear-gradient(135deg, var(--sun) 0%, var(--sun-dark) 100%);
    color: #fff; border: none;
    padding: 11px 22px; border-radius: var(--radius-sm);
    cursor: pointer; display: flex; align-items: center; gap: 7px;
    box-shadow: 0 2px 10px rgba(245,158,11,0.35);
    transition: transform 0.15s, box-shadow 0.18s;
  }
  .adm-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 18px rgba(245,158,11,0.45); }
 
  /* ALERT */
  .adm-alert {
    background: var(--danger-light); border: 1px solid #fecaca; color: var(--danger);
    border-radius: var(--radius-sm); padding: 13px 18px; font-size: 0.83rem;
    font-weight: 500; margin-bottom: 28px;
    display: flex; align-items: center; gap: 8px; animation: fadeDown 0.3s ease both;
  }
 
  /* STAT CARDS */
  .adm-stats {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 16px; margin-bottom: 32px; animation: fadeUp 0.45s ease 0.08s both;
  }
 
  .adm-stat-card {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 24px 28px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: var(--shadow-sm); transition: box-shadow 0.2s, transform 0.2s;
    position: relative; overflow: hidden;
  }
  .adm-stat-card::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--ocean), var(--sun));
    opacity: 0; transition: opacity 0.2s;
  }
  .adm-stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); }
  .adm-stat-card:hover::after { opacity: 1; }
 
  .adm-stat-label {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;
  }
 
  .adm-stat-value {
    font-family: 'Outfit', sans-serif;
    font-size: 2.7rem; font-weight: 800;
    color: var(--ocean); letter-spacing: -0.04em; line-height: 1;
  }
 
  .adm-stat-icon-wrap {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--sun-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; flex-shrink: 0;
  }
 
  /* GRID */
  .adm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .adm-col  { display: flex; flex-direction: column; gap: 20px; }
 
  /* CARD */
  .adm-card {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
    box-shadow: var(--shadow-sm); animation: fadeUp 0.45s ease both;
  }
  .adm-card:nth-child(1) { animation-delay: 0.12s; }
  .adm-card:nth-child(2) { animation-delay: 0.22s; }
 
  .adm-card-header {
    padding: 17px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
    background: linear-gradient(to right, #fafbff, #fffdf5);
  }
 
  .adm-card-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: var(--ocean-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; flex-shrink: 0;
  }
 
  .adm-card-title {
    font-family: 'Outfit', sans-serif;
    font-size: 0.92rem; font-weight: 700; color: var(--text);
  }
 
  .adm-card-body { padding: 20px 24px; }
 
  /* FORM */
  .adm-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
 
  .adm-field { display: flex; flex-direction: column; gap: 5px; }
 
  .adm-field-label {
    font-size: 0.7rem; font-weight: 700;
    color: var(--text-muted); letter-spacing: 0.07em; text-transform: uppercase;
  }
 
  .adm-input {
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.83rem;
    background: #f9faff; border: 1px solid var(--border);
    color: var(--text); padding: 10px 14px; border-radius: var(--radius-sm);
    width: 100%; outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }
  .adm-input::placeholder { color: var(--text-light); }
  .adm-input:focus { border-color: var(--ocean); background: #fff; box-shadow: 0 0 0 3px rgba(26,86,219,0.1); }
 
  .adm-select {
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.83rem;
    background: #f9faff; border: 1px solid var(--border);
    color: var(--text); padding: 10px 14px; border-radius: var(--radius-sm);
    width: 100%; outline: none; cursor: pointer;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .adm-select:focus { border-color: var(--ocean); box-shadow: 0 0 0 3px rgba(26,86,219,0.1); }
 
  .adm-btn-submit {
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem; font-weight: 700;
    background: var(--ocean); color: #fff; border: none;
    padding: 11px 18px; border-radius: var(--radius-sm); width: 100%;
    cursor: pointer; margin-top: 12px;
    transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
    box-shadow: 0 2px 8px rgba(26,86,219,0.22);
  }
  .adm-btn-submit:hover { background: var(--ocean-dark); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(26,86,219,0.32); }
 
  /* TABLE */
  .adm-table-wrap { overflow-x: auto; }
  .adm-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  .adm-table thead tr { background: linear-gradient(to right, #fafbff, #fffdf5); border-bottom: 1px solid var(--border); }
  .adm-table th {
    padding: 11px 16px; text-align: left;
    font-size: 0.66rem; font-weight: 700; letter-spacing: 0.11em;
    text-transform: uppercase; color: var(--text-muted);
  }
  .adm-table tbody tr { border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.14s; }
  .adm-table tbody tr:last-child { border-bottom: none; }
  .adm-table tbody tr:hover { background: var(--ocean-light); }
  .adm-table td { padding: 12px 16px; color: var(--text); vertical-align: middle; }
  .adm-table td.muted { color: var(--text-muted); font-size: 0.78rem; }
 
  /* DELETE BTN */
  .adm-delete-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 6px;
    background: var(--danger-light); border: 1px solid #fecaca;
    color: var(--danger); font-size: 0.6rem; font-weight: 700;
    cursor: pointer; margin-right: 8px; vertical-align: middle;
    transition: background 0.15s, transform 0.12s; flex-shrink: 0;
  }
  .adm-delete-btn:hover { background: var(--danger); color: #fff; border-color: var(--danger); transform: scale(1.1); }
 
  /* ROLE BADGE */
  .adm-role-badge {
    display: inline-block; font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.05em; padding: 3px 9px;
    background: var(--ocean-light); border: 1px solid var(--ocean-mid);
    color: var(--ocean); border-radius: 20px; text-transform: uppercase;
  }
 
  /* PARTICIPANTS */
  .adm-section-label {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px;
  }
 
  .adm-participants {
    display: grid; grid-template-columns: 1fr 1fr; gap: 7px;
    margin-bottom: 4px; max-height: 190px; overflow-y: auto; padding-right: 2px;
  }
  .adm-participants::-webkit-scrollbar { width: 4px; }
  .adm-participants::-webkit-scrollbar-track { background: var(--border); border-radius: 4px; }
  .adm-participants::-webkit-scrollbar-thumb { background: var(--sun-mid); border-radius: 4px; }
 
  .adm-participant-item {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 11px; background: #f9faff; border: 1px solid var(--border);
    border-radius: var(--radius-sm); cursor: pointer;
    transition: border-color 0.15s, background 0.15s; user-select: none;
  }
  .adm-participant-item.selected { border-color: var(--sun); background: var(--sun-light); }
  .adm-participant-item input[type="checkbox"] {
    accent-color: var(--sun-dark); width: 13px; height: 13px; cursor: pointer; flex-shrink: 0;
  }
  .adm-participant-label {
    font-size: 0.78rem; font-weight: 500; color: var(--text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
 
  /* LEAGUE ROW */
  .adm-league-name { display: flex; align-items: center; gap: 9px; font-weight: 600; }
  .adm-league-pip {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--sun); flex-shrink: 0; opacity: 0.7;
  }
 
  /* EMPTY */
  .adm-empty { text-align: center; color: var(--text-light); font-size: 0.8rem; padding: 36px 0; }
 
  /* ANIMATIONS */
  @keyframes fadeDown { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp   { from { opacity: 0; transform: translateY(18px);  } to { opacity: 1; transform: translateY(0); } }
 
  @media (max-width: 960px) {
    .adm-root { padding: 24px 20px; }
    .adm-grid { grid-template-columns: 1fr; }
    .adm-stats { grid-template-columns: 1fr 1fr; }
  }
`;