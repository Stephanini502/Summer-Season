export const adminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    --bg: #f0f4fa;
    --white: #ffffff;
    --blue-primary: #1a56db;
    --blue-light: #e8f0fe;
    --blue-mid: #c7d9f8;
    --blue-dark: #1241a8;
    --text: #111827;
    --text-muted: #6b7280;
    --text-light: #9ca3af;
    --border: #e5eaf3;
    --danger: #dc2626;
    --danger-light: #fef2f2;
    --radius: 12px;
    --radius-sm: 8px;
    --shadow-sm: 0 1px 3px rgba(26,86,219,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(26,86,219,0.1), 0 2px 6px rgba(0,0,0,0.05);
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 36px;
    animation: fadeDown 0.45s ease both;
  }

  .adm-eyebrow {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--blue-primary);
    margin-bottom: 3px;
  }

  .adm-title {
    font-size: 1.9rem;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  .adm-btn-primary {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    background: var(--blue-primary);
    color: #fff;
    border: none;
    padding: 11px 22px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 7px;
    box-shadow: 0 2px 8px rgba(26,86,219,0.28);
    transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
  }

  .adm-btn-primary:hover {
    background: var(--blue-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(26,86,219,0.36);
  }

  /* ALERT */
  .adm-alert {
    background: var(--danger-light);
    border: 1px solid #fecaca;
    color: var(--danger);
    border-radius: var(--radius-sm);
    padding: 13px 18px;
    font-size: 0.83rem;
    font-weight: 500;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: fadeDown 0.3s ease both;
  }

  /* STAT CARDS */
  .adm-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 32px;
    animation: fadeUp 0.45s ease 0.08s both;
  }

  .adm-stat-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .adm-stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

  .adm-stat-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 6px;
  }

  .adm-stat-value {
    font-size: 2.6rem;
    font-weight: 800;
    color: var(--blue-primary);
    letter-spacing: -0.04em;
    line-height: 1;
  }

  .adm-stat-icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: var(--blue-light);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  /* GRID */
  .adm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .adm-col { display: flex; flex-direction: column; gap: 20px; }

  /* CARD */
  .adm-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    animation: fadeUp 0.45s ease both;
  }

  .adm-card:nth-child(1) { animation-delay: 0.12s; }
  .adm-card:nth-child(2) { animation-delay: 0.22s; }

  .adm-card-header {
    padding: 17px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fafbff;
  }

  .adm-card-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: var(--blue-light);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  .adm-card-title { font-size: 0.88rem; font-weight: 700; color: var(--text); }

  .adm-card-body { padding: 20px 24px; }

  /* FORM */
  .adm-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }

  .adm-field { display: flex; flex-direction: column; gap: 5px; }

  .adm-field-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .adm-input {
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

  .adm-input::placeholder { color: var(--text-light); }

  .adm-input:focus {
    border-color: var(--blue-primary);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
  }

  .adm-select {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.83rem;
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    width: 100%;
    outline: none;
    cursor: pointer;
    transition: border-color 0.18s, box-shadow 0.18s;
  }

  .adm-select:focus {
    border-color: var(--blue-primary);
    box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
  }

  .adm-btn-submit {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    background: var(--blue-primary);
    color: #fff;
    border: none;
    padding: 11px 18px;
    border-radius: var(--radius-sm);
    width: 100%;
    cursor: pointer;
    margin-top: 12px;
    transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
    box-shadow: 0 2px 8px rgba(26,86,219,0.2);
  }

  .adm-btn-submit:hover {
    background: var(--blue-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(26,86,219,0.3);
  }

  /* TABLE */
  .adm-table-wrap { overflow-x: auto; }

  .adm-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }

  .adm-table thead tr { background: #fafbff; border-bottom: 1px solid var(--border); }

  .adm-table th {
    padding: 11px 16px;
    text-align: left;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .adm-table tbody tr {
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.14s;
  }

  .adm-table tbody tr:last-child { border-bottom: none; }
  .adm-table tbody tr:hover { background: var(--blue-light); }

  .adm-table td { padding: 12px 16px; color: var(--text); vertical-align: middle; }
  .adm-table td.muted { color: var(--text-muted); font-size: 0.78rem; }

  /* DELETE BTN */
  .adm-delete-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background: var(--danger-light);
    border: 1px solid #fecaca;
    color: var(--danger);
    font-size: 0.6rem;
    font-weight: 700;
    cursor: pointer;
    margin-right: 8px;
    vertical-align: middle;
    transition: background 0.15s, transform 0.12s;
    flex-shrink: 0;
  }

  .adm-delete-btn:hover { background: var(--danger); color: #fff; border-color: var(--danger); transform: scale(1.1); }

  /* ROLE BADGE */
  .adm-role-badge {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    padding: 3px 9px;
    background: var(--blue-light);
    border: 1px solid var(--blue-mid);
    color: var(--blue-primary);
    border-radius: 20px;
    text-transform: uppercase;
  }

  /* PARTICIPANTS */
  .adm-section-label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 10px;
  }

  .adm-participants {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 7px;
    margin-bottom: 4px;
    max-height: 190px;
    overflow-y: auto;
    padding-right: 2px;
  }

  .adm-participants::-webkit-scrollbar { width: 4px; }
  .adm-participants::-webkit-scrollbar-track { background: var(--border); border-radius: 4px; }
  .adm-participants::-webkit-scrollbar-thumb { background: var(--blue-mid); border-radius: 4px; }

  .adm-participant-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 11px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    user-select: none;
  }

  .adm-participant-item.selected { border-color: var(--blue-primary); background: var(--blue-light); }

  .adm-participant-item input[type="checkbox"] {
    accent-color: var(--blue-primary);
    width: 13px; height: 13px;
    cursor: pointer; flex-shrink: 0;
  }

  .adm-participant-label {
    font-size: 0.78rem; font-weight: 500; color: var(--text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  /* LEAGUE ROW */
  .adm-league-name { display: flex; align-items: center; gap: 9px; font-weight: 600; }

  .adm-league-pip {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--blue-primary); flex-shrink: 0; opacity: 0.45;
  }

  /* EMPTY STATE */
  .adm-empty { text-align: center; color: var(--text-light); font-size: 0.8rem; padding: 36px 0; }

  /* ANIMATIONS */
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 960px) {
    .adm-root { padding: 24px 20px; }
    .adm-grid { grid-template-columns: 1fr; }
    .adm-stats { grid-template-columns: 1fr 1fr; }
  }
`;