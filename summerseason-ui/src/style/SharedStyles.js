export const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
 
  :root {
    --sun:        #fbbf24;
    --sun-light:  rgba(251,191,36,0.15);
    --sun-dark:   #f59e0b;
    --ocean:      #60a5fa;
    --ocean-light:rgba(96,165,250,0.12);
    --ocean-dark: #3b82f6;
    --sand:       #1e2535;
    --text:       #f0f4ff;
    --text-muted: #8b97b8;
    --border:     rgba(255,255,255,0.08);
  }
 
  .nav-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: rgba(13,17,30,0.85);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
    box-shadow: 0 2px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04);
    position: sticky;
    top: 0;
    z-index: 100;
  }
 
  .nav-root::before {
    content: '';
    display: block;
    height: 2px;
    background: linear-gradient(90deg, var(--ocean-dark) 0%, var(--sun) 50%, var(--ocean-dark) 100%);
    background-size: 200% 100%;
    animation: navShimmer 5s ease infinite;
    opacity: 0.9;
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
    background: linear-gradient(135deg, var(--sun) 0%, #ea580c 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
    box-shadow: 0 2px 12px rgba(251,191,36,0.35), 0 0 0 1px rgba(251,191,36,0.2);
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
    color: var(--sun);
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
    border: 1px solid rgba(96,165,250,0.25);
  }
 
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
    border-color: rgba(96,165,250,0.3);
    transform: translateY(-1px);
  }
 
  .nav-btn-outline {
    background: transparent;
    color: var(--ocean);
    border: 1.5px solid rgba(96,165,250,0.3);
  }
  .nav-btn-outline:hover {
    background: var(--ocean-light);
    border-color: var(--ocean);
    transform: translateY(-1px);
  }
 
  .nav-btn-primary {
    background: linear-gradient(135deg, var(--sun) 0%, #ea580c 100%);
    color: #0d1117;
    box-shadow: 0 2px 12px rgba(251,191,36,0.3), 0 0 0 1px rgba(251,191,36,0.15);
    border: none;
    font-weight: 700;
  }
  .nav-btn-primary:hover {
    background: linear-gradient(135deg, #fcd34d 0%, var(--sun) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(251,191,36,0.4);
  }
 
  .nav-divider {
    width: 1px;
    height: 22px;
    background: var(--border);
    margin: 0 4px;
  }
 
  .nav-user-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 14px 5px 6px;
    border-radius: 20px;
    background: var(--sand);
    border: 1px solid rgba(251,191,36,0.2);
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text);
    cursor: pointer;
    transition: background 0.15s, transform 0.15s;
  }
  .nav-user-pill:hover { background: rgba(251,191,36,0.08); transform: translateY(-1px); }
 
  .nav-user-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, var(--sun) 0%, #ea580c 100%);
    color: #0d1117; font-size: 0.62rem; font-weight: 800;
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
    --bg:           #0d1117;
    --bg-2:         #121826;
    --white:        #1a2236;
    --sun:          #fbbf24;
    --sun-light:    rgba(251,191,36,0.12);
    --sun-dark:     #f59e0b;
    --sun-mid:      rgba(251,191,36,0.25);
    --ocean:        #60a5fa;
    --ocean-light:  rgba(96,165,250,0.1);
    --ocean-mid:    rgba(96,165,250,0.25);
    --ocean-dark:   #3b82f6;
    --text:         #eef2ff;
    --text-muted:   #8b97b8;
    --text-light:   #4b5675;
    --border:       rgba(255,255,255,0.07);
    --border-bright:rgba(255,255,255,0.12);
    --success:      #34d399;
    --success-light:rgba(52,211,153,0.1);
    --success-mid:  rgba(52,211,153,0.25);
    --warning:      #f59e0b;
    --warning-light:rgba(245,158,11,0.1);
    --danger:       #f87171;
    --danger-light: rgba(248,113,113,0.1);
    --radius:       14px;
    --radius-sm:    9px;
    --shadow-sm:    0 2px 8px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.04);
    --shadow-md:    0 8px 28px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05);
    --shadow-sun:   0 4px 20px rgba(251,191,36,0.2);
    --glow-ocean:   0 0 20px rgba(96,165,250,0.15);
  }
 
  * { box-sizing: border-box; margin: 0; padding: 0; }
 
  .pg-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse at 20% 0%, rgba(96,165,250,0.06) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 100%, rgba(251,191,36,0.05) 0%, transparent 50%);
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
    box-shadow: 0 0 6px rgba(251,191,36,0.6);
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
 
  .pg-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none !important; }
 
  .pg-btn-primary {
    background: var(--ocean-dark);
    color: #fff;
    box-shadow: 0 2px 12px rgba(59,130,246,0.3), 0 0 0 1px rgba(96,165,250,0.15);
  }
  .pg-btn-primary:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(59,130,246,0.4), var(--glow-ocean);
  }
 
  .pg-btn-sun {
    background: linear-gradient(135deg, var(--sun) 0%, #ea580c 100%);
    color: #0d1117;
    box-shadow: var(--shadow-sun);
    font-weight: 700;
  }
  .pg-btn-sun:hover:not(:disabled) {
    background: linear-gradient(135deg, #fcd34d 0%, var(--sun) 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(251,191,36,0.35);
  }
 
  .pg-btn-success {
    background: rgba(52,211,153,0.15);
    color: var(--success);
    border: 1px solid rgba(52,211,153,0.25);
    box-shadow: 0 2px 8px rgba(52,211,153,0.1);
  }
  .pg-btn-success:hover:not(:disabled) {
    background: rgba(52,211,153,0.22);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(52,211,153,0.2);
  }
 
  .pg-btn-warning {
    background: rgba(245,158,11,0.15);
    color: var(--warning);
    border: 1px solid rgba(245,158,11,0.25);
  }
  .pg-btn-warning:hover:not(:disabled) { background: rgba(245,158,11,0.22); transform: translateY(-1px); }
 
  .pg-btn-danger {
    background: rgba(248,113,113,0.12);
    color: var(--danger);
    border: 1px solid rgba(248,113,113,0.22);
  }
  .pg-btn-danger:hover:not(:disabled) { background: rgba(248,113,113,0.2); transform: translateY(-1px); }
 
  .pg-btn-ghost {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border);
  }
  .pg-btn-ghost:hover:not(:disabled) {
    background: var(--ocean-light);
    color: var(--ocean);
    border-color: var(--ocean-mid);
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
  .pg-alert-danger  { background: var(--danger-light);  border: 1px solid rgba(248,113,113,0.25); color: var(--danger); }
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
    transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
    position: relative;
    overflow: hidden;
  }
  .pg-stat-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--ocean-dark) 0%, var(--sun) 100%);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .pg-stat-card:hover {
    box-shadow: var(--shadow-md), var(--glow-ocean);
    transform: translateY(-3px);
    border-color: var(--border-bright);
  }
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
    text-shadow: 0 0 30px rgba(96,165,250,0.4);
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
    border: 1px solid var(--ocean-mid);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  .pg-stat-icon-sun    { background: var(--sun-light);     border-color: var(--sun-mid); }
  .pg-stat-icon-green  { background: var(--success-light); border-color: var(--success-mid); }
  .pg-stat-icon-yellow { background: var(--warning-light); border-color: rgba(245,158,11,0.25); }
 
  /* ── CARD ── */
  .pg-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    animation: pgFadeUp 0.45s ease both;
    margin-bottom: 20px;
    transition: box-shadow 0.2s, border-color 0.2s;
  }
  .pg-card:hover { border-color: var(--border-bright); }
 
  .pg-card-header {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255,255,255,0.02);
  }
 
  .pg-card-header-left { display: flex; align-items: center; gap: 10px; }
 
  .pg-card-icon {
    width: 30px; height: 30px;
    border-radius: 8px;
    background: var(--ocean-light);
    border: 1px solid var(--ocean-mid);
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
    background: linear-gradient(130deg, #0c1428 0%, #0f1f3d 55%, #131f3a 100%);
    border: 1px solid rgba(96,165,250,0.15);
    border-radius: var(--radius);
    padding: 40px 44px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 32px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
    animation: pgFadeDown 0.45s ease both;
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;
  }
 
  .pg-hero::before {
    content: '☀️';
    position: absolute;
    right: 180px; top: -10px;
    font-size: 5rem;
    opacity: 0.07;
    animation: pgHeroSpin 20s linear infinite;
  }
  .pg-hero::after {
    content: '';
    position: absolute;
    bottom: -40px; right: -40px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%);
  }
 
  @keyframes pgHeroSpin { to { transform: rotate(360deg); } }
 
  .pg-hero-eyebrow {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    opacity: 0.55;
    margin-bottom: 8px;
    display: flex; align-items: center; gap: 6px;
  }
  .pg-hero-eyebrow::before {
    content: '';
    display: inline-block;
    width: 12px; height: 2px;
    background: var(--sun);
    border-radius: 2px;
    box-shadow: 0 0 6px rgba(251,191,36,0.7);
  }
 
  .pg-hero-title {
    font-family: 'Outfit', sans-serif;
    font-size: 2.2rem;
    font-weight: 900;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }
 
  .pg-hero-sub { font-size: 0.85rem; opacity: 0.6; margin-top: 5px; }
 
  .pg-btn-hero {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--sun) 0%, #ea580c 100%);
    color: #0d1117;
    border: none;
    padding: 12px 24px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    box-shadow: 0 3px 16px rgba(251,191,36,0.3);
    transition: transform 0.15s, box-shadow 0.15s;
    white-space: nowrap;
    position: relative;
    z-index: 1;
  }
  .pg-btn-hero:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(251,191,36,0.4); }
 
  /* ── GRID ── */
  .pg-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .pg-grid-sidebar { display: grid; grid-template-columns: 340px 1fr; gap: 20px; }
  .pg-col { display: flex; flex-direction: column; }
 
  /* ── TABLE ── */
  .pg-table-wrap { overflow-x: auto; }
  .pg-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  .pg-table thead tr { background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--border); }
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
  .pg-table tbody tr.clickable:hover { background: rgba(96,165,250,0.07); }
  .pg-table tbody tr:not(.clickable):hover { background: rgba(255,255,255,0.02); }
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
  .pg-list-item.clickable:hover { background: rgba(96,165,250,0.07); }
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
  .pg-badge-blue   { background: var(--ocean-light);   border: 1px solid var(--ocean-mid);               color: var(--ocean); }
  .pg-badge-sun    { background: var(--sun-light);     border: 1px solid var(--sun-mid);                 color: var(--sun-dark); }
  .pg-badge-green  { background: var(--success-light); border: 1px solid var(--success-mid);             color: var(--success); }
  .pg-badge-yellow { background: var(--warning-light); border: 1px solid rgba(245,158,11,0.25);          color: var(--warning); }
  .pg-badge-red    { background: var(--danger-light);  border: 1px solid rgba(248,113,113,0.25);         color: var(--danger); }
 
  .pg-rank {
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--ocean-light); border: 1px solid var(--ocean-mid);
    color: var(--ocean); font-size: 0.72rem; font-weight: 800;
    display: inline-flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-family: 'Outfit', sans-serif;
  }
  .pg-rank-1 { background: linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.15)); border-color: rgba(251,191,36,0.5); color: var(--sun); box-shadow: 0 0 12px rgba(251,191,36,0.2); }
  .pg-rank-2 { background: rgba(148,163,184,0.1); border-color: rgba(148,163,184,0.3); color: #94a3b8; }
  .pg-rank-3 { background: rgba(180,130,70,0.1); border-color: rgba(180,130,70,0.3); color: #b48246; }
 
  /* ── FORM ── */
  .pg-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
 
  .pg-field-label {
    font-size: 0.7rem; font-weight: 700;
    color: var(--text-muted); letter-spacing: 0.07em; text-transform: uppercase;
  }
 
  .pg-input, .pg-select, .pg-textarea {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.83rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    width: 100%; outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }
  .pg-input::placeholder, .pg-textarea::placeholder { color: var(--text-light); }
  .pg-input:focus, .pg-select:focus, .pg-textarea:focus {
    border-color: var(--ocean-dark);
    background: rgba(255,255,255,0.06);
    box-shadow: 0 0 0 3px rgba(96,165,250,0.12);
  }
  .pg-select { cursor: pointer; color-scheme: dark; }
  .pg-textarea { resize: vertical; min-height: 80px; }
  .pg-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
 
  .pg-inline-form { display: flex; gap: 10px; align-items: flex-end; }
  .pg-inline-form .pg-select { flex: 1; }
 
  /* ── DELETE BTN ── */
  .pg-delete-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 6px;
    background: var(--danger-light); border: 1px solid rgba(248,113,113,0.25);
    color: var(--danger); font-size: 0.58rem; font-weight: 700;
    cursor: pointer; margin-right: 8px; vertical-align: middle;
    transition: background 0.15s, transform 0.12s; flex-shrink: 0;
  }
  .pg-delete-btn:hover { background: rgba(248,113,113,0.25); transform: scale(1.1); }
 
  /* ── EMPTY STATE ── */
  .pg-empty { text-align: center; color: var(--text-light); font-size: 0.8rem; padding: 36px 0; }
 
  /* ── LOADING ── */
  .pg-loading { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
  .pg-spinner {
    width: 38px; height: 38px; border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.06); border-top-color: var(--sun);
    animation: pgSpin 0.7s linear infinite;
    box-shadow: 0 0 16px rgba(251,191,36,0.2);
  }
 
  /* ── AVATAR ── */
  .pg-avatar {
    width: 64px; height: 64px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(96,165,250,0.2), rgba(251,191,36,0.15));
    border: 2px solid rgba(251,191,36,0.3);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Outfit', sans-serif;
    font-size: 1.6rem; font-weight: 800; color: var(--ocean);
    margin: 0 auto 12px; flex-shrink: 0;
    box-shadow: 0 0 20px rgba(96,165,250,0.1);
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
    transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
    animation: pgFadeUp 0.4s ease both;
    position: relative; overflow: hidden;
  }
  .pg-challenge-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--ocean-dark), var(--sun));
    opacity: 0; transition: opacity 0.2s;
  }
  .pg-challenge-card:hover {
    box-shadow: var(--shadow-md), var(--glow-ocean);
    transform: translateY(-3px);
    border-color: var(--border-bright);
  }
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
    --bg:           #0d1117;
    --bg-2:         #121826;
    --white:        #1a2236;
    --sun:          #fbbf24;
    --sun-light:    rgba(251,191,36,0.12);
    --sun-dark:     #f59e0b;
    --sun-mid:      rgba(251,191,36,0.25);
    --ocean:        #60a5fa;
    --ocean-light:  rgba(96,165,250,0.1);
    --ocean-mid:    rgba(96,165,250,0.25);
    --ocean-dark:   #3b82f6;
    --text:         #eef2ff;
    --text-muted:   #8b97b8;
    --text-light:   #4b5675;
    --border:       rgba(255,255,255,0.07);
    --border-bright:rgba(255,255,255,0.12);
    --danger:       #f87171;
    --danger-light: rgba(248,113,113,0.1);
    --radius:       14px;
    --radius-sm:    9px;
    --shadow-sm:    0 2px 8px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.04);
    --shadow-md:    0 8px 28px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05);
    --glow-ocean:   0 0 20px rgba(96,165,250,0.12);
  }
 
  * { box-sizing: border-box; margin: 0; padding: 0; }
 
  .adm-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse at 15% 0%, rgba(96,165,250,0.05) 0%, transparent 45%),
      radial-gradient(ellipse at 85% 100%, rgba(251,191,36,0.04) 0%, transparent 45%);
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
    box-shadow: 0 0 6px rgba(251,191,36,0.6);
  }
 
  .adm-title {
    font-family: 'Outfit', sans-serif;
    font-size: 2.1rem; font-weight: 800;
    color: var(--text); letter-spacing: -0.03em; line-height: 1.1;
  }
 
  .adm-btn-primary {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.82rem; font-weight: 700;
    background: linear-gradient(135deg, var(--sun) 0%, #ea580c 100%);
    color: #0d1117; border: none;
    padding: 11px 22px; border-radius: var(--radius-sm);
    cursor: pointer; display: flex; align-items: center; gap: 7px;
    box-shadow: 0 2px 14px rgba(251,191,36,0.25);
    transition: transform 0.15s, box-shadow 0.18s;
  }
  .adm-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 22px rgba(251,191,36,0.35); }
 
  /* ALERT */
  .adm-alert {
    background: var(--danger-light); border: 1px solid rgba(248,113,113,0.25); color: var(--danger);
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
    box-shadow: var(--shadow-sm); transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
    position: relative; overflow: hidden;
  }
  .adm-stat-card::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--ocean-dark), var(--sun));
    opacity: 0; transition: opacity 0.2s;
  }
  .adm-stat-card:hover {
    box-shadow: var(--shadow-md), var(--glow-ocean);
    transform: translateY(-3px);
    border-color: var(--border-bright);
  }
  .adm-stat-card:hover::after { opacity: 1; }
 
  .adm-stat-label {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;
  }
 
  .adm-stat-value {
    font-family: 'Outfit', sans-serif;
    font-size: 2.7rem; font-weight: 800;
    color: var(--ocean); letter-spacing: -0.04em; line-height: 1;
    text-shadow: 0 0 30px rgba(96,165,250,0.4);
  }
 
  .adm-stat-icon-wrap {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--sun-light);
    border: 1px solid var(--sun-mid);
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
    transition: border-color 0.2s;
  }
  .adm-card:hover { border-color: var(--border-bright); }
  .adm-card:nth-child(1) { animation-delay: 0.12s; }
  .adm-card:nth-child(2) { animation-delay: 0.22s; }
 
  .adm-card-header {
    padding: 17px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.02);
  }
 
  .adm-card-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: var(--ocean-light);
    border: 1px solid var(--ocean-mid);
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
    background: rgba(255,255,255,0.04); border: 1px solid var(--border);
    color: var(--text); padding: 10px 14px; border-radius: var(--radius-sm);
    width: 100%; outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }
  .adm-input::placeholder { color: var(--text-light); }
  .adm-input:focus {
    border-color: var(--ocean-dark);
    background: rgba(255,255,255,0.06);
    box-shadow: 0 0 0 3px rgba(96,165,250,0.12);
  }
 
  .adm-select {
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.83rem;
    background: rgba(255,255,255,0.04); border: 1px solid var(--border);
    color: var(--text); padding: 10px 14px; border-radius: var(--radius-sm);
    width: 100%; outline: none; cursor: pointer; color-scheme: dark;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .adm-select:focus { border-color: var(--ocean-dark); box-shadow: 0 0 0 3px rgba(96,165,250,0.12); }
 
  .adm-btn-submit {
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem; font-weight: 700;
    background: var(--ocean-dark); color: #fff; border: none;
    padding: 11px 18px; border-radius: var(--radius-sm); width: 100%;
    cursor: pointer; margin-top: 12px;
    transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
    box-shadow: 0 2px 12px rgba(59,130,246,0.25);
  }
  .adm-btn-submit:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(59,130,246,0.35), var(--glow-ocean);
  }
 
  /* TABLE */
  .adm-table-wrap { overflow-x: auto; }
  .adm-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  .adm-table thead tr { background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--border); }
  .adm-table th {
    padding: 11px 16px; text-align: left;
    font-size: 0.66rem; font-weight: 700; letter-spacing: 0.11em;
    text-transform: uppercase; color: var(--text-muted);
  }
  .adm-table tbody tr { border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.14s; }
  .adm-table tbody tr:last-child { border-bottom: none; }
  .adm-table tbody tr:hover { background: rgba(96,165,250,0.07); }
  .adm-table td { padding: 12px 16px; color: var(--text); vertical-align: middle; }
  .adm-table td.muted { color: var(--text-muted); font-size: 0.78rem; }
 
  /* DELETE BTN */
  .adm-delete-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 6px;
    background: var(--danger-light); border: 1px solid rgba(248,113,113,0.25);
    color: var(--danger); font-size: 0.6rem; font-weight: 700;
    cursor: pointer; margin-right: 8px; vertical-align: middle;
    transition: background 0.15s, transform 0.12s; flex-shrink: 0;
  }
  .adm-delete-btn:hover { background: rgba(248,113,113,0.22); transform: scale(1.1); }
 
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
  .adm-participants::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-radius: 4px; }
  .adm-participants::-webkit-scrollbar-thumb { background: rgba(251,191,36,0.3); border-radius: 4px; }
 
  .adm-participant-item {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 11px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm); cursor: pointer;
    transition: border-color 0.15s, background 0.15s; user-select: none;
  }
  .adm-participant-item.selected {
    border-color: rgba(251,191,36,0.4);
    background: rgba(251,191,36,0.07);
  }
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
    background: var(--sun); flex-shrink: 0; opacity: 0.6;
    box-shadow: 0 0 6px rgba(251,191,36,0.5);
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