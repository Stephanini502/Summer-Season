/* Shared inline CSS string for LeagueDataPage and LeagueDataAdminPage */
export const leagueMediaStyles = `
  .media-thumb { width: 100%; border-radius: 8px; object-fit: cover; max-height: 160px; display: block; cursor: zoom-in; }
  .media-video { width: 100%; border-radius: 8px; max-height: 200px; display: block; background: #0d1117; }
  .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
  .media-item {
    position: relative; border-radius: 10px; overflow: hidden;
    background: #121826; border: 1px solid rgba(255,255,255,0.07);
  }
  .media-item-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.2s;
  }
  .media-item:hover .media-item-overlay { background: rgba(0,0,0,0.55); }
  .media-icon-btn {
    opacity: 0; transition: opacity 0.2s;
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; border: none; font-size: 1rem;
    backdrop-filter: blur(4px);
  }
  .media-item:hover .media-icon-btn { opacity: 1; }
  .media-icon-btn-view { background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.35) !important; }
  .media-icon-btn-dl   { background: #3b82f6; }
  .media-icon-btn-del  { background: #ef4444; }
  .media-upload-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;
    cursor: pointer; border: 1px dashed rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.03); color: #8b97b8; transition: all 0.15s;
  }
  .media-upload-btn:hover {
    border-color: rgba(251,191,36,0.4);
    color: #fbbf24;
    background: rgba(251,191,36,0.08);
  }
  .media-section { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; gap: 16px; }
  .media-block-title { font-size: 0.72rem; font-weight: 700; color: #8b97b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
  .media-progress { font-size: 0.75rem; color: #fbbf24; font-weight: 600; background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.2); padding: 6px 14px; border-radius: 20px; }
  .challenge-item { border-bottom: 1px solid rgba(255,255,255,0.07); }
  .challenge-media-wrap { padding: 8px 16px 16px; background: rgba(255,255,255,0.015); border-top: 1px dashed rgba(255,255,255,0.06); }
  .video-wrap { position: relative; }
  .video-actions { position: absolute; top: 8px; right: 8px; display: flex; gap: 6px; }
  .video-icon-btn {
    width: 32px; height: 32px; border-radius: 50%; border: none;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; cursor: pointer;
  }

  /* Lightbox */
  .lb-backdrop {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.94); display: flex;
    align-items: center; justify-content: center;
    animation: lbFadeIn 0.15s ease;
  }
  @keyframes lbFadeIn { from { opacity: 0 } to { opacity: 1 } }
  .lb-img {
    max-width: 90vw; max-height: 85vh;
    border-radius: 10px; object-fit: contain;
    box-shadow: 0 25px 60px rgba(0,0,0,0.7);
    animation: lbZoomIn 0.18s ease;
  }
  @keyframes lbZoomIn { from { transform: scale(0.93); opacity: 0 } to { transform: scale(1); opacity: 1 } }
  .lb-close {
    position: fixed; top: 20px; right: 24px;
    background: rgba(255,255,255,0.12); border: none; color: white;
    font-size: 1.4rem; width: 44px; height: 44px; border-radius: 50%;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.15s; backdrop-filter: blur(6px);
  }
  .lb-close:hover { background: rgba(255,255,255,0.22); }
  .lb-download {
    position: fixed; top: 20px; right: 76px;
    background: #3b82f6; border: none; color: white;
    font-size: 0.8rem; font-weight: 700; padding: 0 16px; height: 44px;
    border-radius: 22px; cursor: pointer; display: flex; align-items: center; gap: 6px;
    transition: background 0.15s;
  }
  .lb-download:hover { background: #2563eb; }
  .lb-arrow {
    position: fixed; top: 50%; transform: translateY(-50%);
    background: rgba(255,255,255,0.12); border: none; color: white;
    font-size: 1.6rem; width: 48px; height: 48px; border-radius: 50%;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.15s; backdrop-filter: blur(6px);
  }
  .lb-arrow:hover { background: rgba(255,255,255,0.22); }
  .lb-arrow-left { left: 20px; }
  .lb-arrow-right { right: 20px; }
  .lb-counter {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    color: rgba(255,255,255,0.5); font-size: 0.8rem; font-weight: 600;
    background: rgba(0,0,0,0.5); padding: 4px 14px; border-radius: 20px;
  }
`;