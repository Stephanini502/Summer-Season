export const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
 
  :root {
    --bg:           #f0f4fa;
    --white:        #ffffff;
    --blue-primary: #1a56db;
    --blue-light:   #e8f0fe;
    --blue-mid:     #c7d9f8;
    --blue-dark:    #1241a8;
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
    --radius:       12px;
    --radius-sm:    8px;
    --shadow-sm:    0 1px 3px rgba(26,86,219,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md:    0 4px 16px rgba(26,86,219,0.1), 0 2px 6px rgba(0,0,0,0.05);
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
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--blue-primary);
    margin-bottom: 3px;
  }
 
  .pg-title {
    font-size: 1.9rem;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.03em;
    line-height: 1.1;
  }
 
  .pg-subtitle {
    font-size: 0.82rem;
    color: var(--text-muted);
    margin-top: 3px;
  }
 
  /* ── BUTTONS ── */
  .pg-btn {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
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
 
  .pg-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none !important; }
 
  .pg-btn-primary {
    background: var(--blue-primary);
    color: #fff;
    box-shadow: 0 2px 8px rgba(26,86,219,0.25);
  }
  .pg-btn-primary:hover:not(:disabled) {
    background: var(--blue-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(26,86,219,0.35);
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
  .pg-btn-warning:hover:not(:disabled) {
    background: #b45309;
    transform: translateY(-1px);
  }
 
  .pg-btn-danger {
    background: var(--danger);
    color: #fff;
    box-shadow: 0 2px 8px rgba(220,38,38,0.2);
  }
  .pg-btn-danger:hover:not(:disabled) {
    background: #b91c1c;
    transform: translateY(-1px);
  }
 
  .pg-btn-ghost {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border);
  }
  .pg-btn-ghost:hover:not(:disabled) {
    background: var(--bg);
    color: var(--text);
  }
 
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
  .pg-alert-danger { background: var(--danger-light); border: 1px solid #fecaca; color: var(--danger); }
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
  }
  .pg-stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
 
  .pg-stat-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 5px;
  }
 
  .pg-stat-value {
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--blue-primary);
    letter-spacing: -0.04em;
    line-height: 1;
  }
 
  .pg-stat-value-sm {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1.2;
  }
 
  .pg-stat-sub { font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; }
 
  .pg-stat-icon {
    width: 48px; height: 48px;
    border-radius: 12px;
    background: var(--blue-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem;
    flex-shrink: 0;
  }
 
  .pg-stat-icon-green { background: var(--success-light); }
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
  }
 
  .pg-card-header {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fafbff;
  }
 
  .pg-card-header-left { display: flex; align-items: center; gap: 10px; }
 
  .pg-card-icon {
    width: 28px; height: 28px;
    border-radius: 7px;
    background: var(--blue-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem;
    flex-shrink: 0;
  }
 
  .pg-card-title { font-size: 0.88rem; font-weight: 700; color: var(--text); }
 
  /* ── HERO ── */
  .pg-hero {
    background: linear-gradient(130deg, var(--blue-primary) 0%, var(--blue-dark) 100%);
    border-radius: var(--radius);
    padding: 36px 40px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 32px;
    box-shadow: 0 6px 24px rgba(26,86,219,0.25);
    animation: pgFadeDown 0.45s ease both;
    flex-wrap: wrap;
  }
 
  .pg-hero-title { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; }
  .pg-hero-sub { font-size: 0.85rem; opacity: 0.75; margin-top: 4px; }
 
  .pg-btn-hero {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    background: rgba(255,255,255,0.15);
    color: #fff;
    border: 1.5px solid rgba(255,255,255,0.35);
    padding: 11px 22px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: background 0.18s, transform 0.15s;
    white-space: nowrap;
  }
  .pg-btn-hero:hover { background: rgba(255,255,255,0.25); transform: translateY(-1px); }
 
  /* ── GRID ── */
  .pg-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .pg-grid-sidebar { display: grid; grid-template-columns: 340px 1fr; gap: 20px; }
  .pg-col { display: flex; flex-direction: column; }
 
  /* ── TABLE ── */
  .pg-table-wrap { overflow-x: auto; }
 
  .pg-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
 
  .pg-table thead tr { background: #fafbff; border-bottom: 1px solid var(--border); }
 
  .pg-table th {
    padding: 11px 16px;
    text-align: left;
    font-size: 0.67rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
 
  .pg-table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.14s;
  }
  .pg-table tbody tr:last-child { border-bottom: none; }
  .pg-table tbody tr.clickable { cursor: pointer; }
  .pg-table tbody tr.clickable:hover { background: var(--blue-light); }
  .pg-table tbody tr:not(.clickable):hover { background: #fafbff; }
 
  .pg-table td { padding: 12px 16px; color: var(--text); vertical-align: middle; }
  .pg-table td.muted { color: var(--text-muted); font-size: 0.78rem; }
  .pg-table td.bold { font-weight: 600; }
 
  /* ── LIST GROUP ── */
  .pg-list { list-style: none; }
 
  .pg-list-item {
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    transition: background 0.14s;
  }
  .pg-list-item:last-child { border-bottom: none; }
  .pg-list-item.clickable { cursor: pointer; }
  .pg-list-item.clickable:hover { background: var(--blue-light); }
 
  .pg-list-item-name { font-weight: 600; font-size: 0.88rem; }
  .pg-list-item-sub { font-size: 0.74rem; color: var(--text-muted); margin-top: 2px; }
 
  /* ── BADGES ── */
  .pg-badge {
    display: inline-block;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
    white-space: nowrap;
  }
  .pg-badge-blue { background: var(--blue-light); border: 1px solid var(--blue-mid); color: var(--blue-primary); }
  .pg-badge-green { background: var(--success-light); border: 1px solid var(--success-mid); color: var(--success); }
  .pg-badge-yellow { background: var(--warning-light); border: 1px solid #fde68a; color: var(--warning); }
  .pg-badge-red { background: var(--danger-light); border: 1px solid #fecaca; color: var(--danger); }
 
  /* rank badge */
  .pg-rank {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: var(--blue-light);
    border: 1px solid var(--blue-mid);
    color: var(--blue-primary);
    font-size: 0.72rem;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .pg-rank-1 { background: #fef3c7; border-color: #fde68a; color: #92400e; }
  .pg-rank-2 { background: #f1f5f9; border-color: #cbd5e1; color: #475569; }
  .pg-rank-3 { background: #fef9ec; border-color: #fcd9a0; color: #92400e; }
 
  /* ── FORM ELEMENTS ── */
  .pg-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
 
  .pg-field-label {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
 
  .pg-input, .pg-select, .pg-textarea {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.83rem;
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    width: 100%;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }
 
  .pg-input::placeholder, .pg-textarea::placeholder { color: var(--text-light); }
 
  .pg-input:focus, .pg-select:focus, .pg-textarea:focus {
    border-color: var(--blue-primary);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
  }
 
  .pg-select { cursor: pointer; }
  .pg-textarea { resize: vertical; min-height: 80px; }
 
  .pg-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
 
  /* ── INLINE SELECT + BTN ── */
  .pg-inline-form {
    display: flex; gap: 10px; align-items: flex-end;
  }
  .pg-inline-form .pg-select { flex: 1; }
 
  /* ── DELETE BTN (inline) ── */
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
 
  /* ── LOADING / ERROR ── */
  .pg-loading { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
  .pg-spinner {
    width: 36px; height: 36px; border-radius: 50%;
    border: 3px solid var(--blue-light); border-top-color: var(--blue-primary);
    animation: pgSpin 0.7s linear infinite;
  }
 
  /* ── PROFILE AVATAR ── */
  .pg-avatar {
    width: 64px; height: 64px; border-radius: 50%;
    background: var(--blue-light); border: 2px solid var(--blue-mid);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.6rem; font-weight: 800; color: var(--blue-primary);
    margin: 0 auto 12px;
    flex-shrink: 0;
  }
 
  /* ── SIDEBAR INFO ROW ── */
  .pg-info-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid var(--border);
    font-size: 0.83rem;
  }
  .pg-info-row:last-child { border-bottom: none; }
  .pg-info-row-label { color: var(--text-muted); font-weight: 500; }
  .pg-info-row-value { font-weight: 600; color: var(--text); }
 
  /* ── CHALLENGE CARD (grid view) ── */
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
  }
  .pg-challenge-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
 
  .pg-challenge-name { font-size: 0.95rem; font-weight: 700; color: var(--text); }
  .pg-challenge-desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; flex: 1; }
  .pg-challenge-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
 
  /* ── ANIMATIONS ── */
  @keyframes pgFadeDown {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pgFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pgSpin {
    to { transform: rotate(360deg); }
  }
 
  @media (max-width: 960px) {
    .pg-root { padding: 24px 20px; }
    .pg-grid-2, .pg-grid-sidebar { grid-template-columns: 1fr; }
    .pg-stats { flex-direction: column; }
    .pg-hero { flex-direction: column; align-items: flex-start; }
  }
`;