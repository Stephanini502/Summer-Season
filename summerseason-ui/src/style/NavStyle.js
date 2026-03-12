
export const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .nav-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #ffffff;
    border-bottom: 1px solid #e5eaf3;
    box-shadow: 0 1px 8px rgba(26,86,219,0.07);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-inner {
    max-width: 1360px;
    margin: 0 auto;
    padding: 0 48px;
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    cursor: pointer;
  }

  .nav-brand-icon {
    width: 32px;
    height: 32px;
    background: #1a56db;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .nav-brand-text {
    font-size: 1rem;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.02em;
  }

  .nav-brand-text span {
    color: #1a56db;
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
    padding: 8px 18px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.18s, transform 0.15s, box-shadow 0.18s, color 0.18s;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .nav-btn-ghost {
    background: transparent;
    color: #6b7280;
    border: 1px solid #e5eaf3;
  }
  .nav-btn-ghost:hover {
    background: #f0f4fa;
    color: #111827;
    border-color: #c7d9f8;
  }

  .nav-btn-outline {
    background: transparent;
    color: #1a56db;
    border: 1.5px solid #c7d9f8;
  }
  .nav-btn-outline:hover {
    background: #e8f0fe;
    border-color: #1a56db;
    transform: translateY(-1px);
  }

  .nav-btn-primary {
    background: #1a56db;
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(26,86,219,0.25);
  }
  .nav-btn-primary:hover {
    background: #1241a8;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(26,86,219,0.35);
  }

  .nav-divider {
    width: 1px;
    height: 20px;
    background: #e5eaf3;
    margin: 0 4px;
  }

  .nav-user-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 12px 5px 6px;
    border-radius: 20px;
    background: #f0f4fa;
    border: 1px solid #e5eaf3;
    font-size: 0.78rem;
    font-weight: 600;
    color: #374151;
  }

  .nav-user-avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #1a56db;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    .nav-inner { padding: 0 20px; }
    .nav-brand-text { display: none; }
    .nav-btn { padding: 8px 13px; }
  }
`;
