/* =====================================================================
   DARK PATCH — da incollare come secondo blocco <style> nelle pagine:
   LeagueDataPage, LeagueDataAdminPage, ChallengesAdminPage, UserDataPage

   Sovrascrive tutti i residui light-theme rimasti negli inline styles
   e nei className con valori hard-coded chiari.
   ===================================================================== */

export const darkPatch = `
  /* ── Background radici già corretti in sharedStyles, ma alcune
     sub-aree usano ancora #fafbff o background: linear-gradient(to right, #fafbff, #fffdf5) ── */

  /* Card header gradient light → dark */
  .pg-card-header,
  .adm-card-header {
    background: rgba(255,255,255,0.025) !important;
  }

  /* challenge-media-wrap bianco */
  .challenge-media-wrap,
  .challenge-item {
    background: transparent !important;
  }

  /* media-upload-btn: bg var(--bg) diventa dark */
  .media-upload-btn {
    background: rgba(255,255,255,0.03) !important;
    border-color: rgba(255,255,255,0.09) !important;
    color: #8b97b8 !important;
  }
  .media-upload-btn:hover {
    background: rgba(251,191,36,0.08) !important;
    border-color: rgba(251,191,36,0.35) !important;
    color: #fbbf24 !important;
  }

  /* media-item background */
  .media-item {
    background: #121826 !important;
    border-color: rgba(255,255,255,0.07) !important;
  }

  /* UserDataPage: league row hover usava inline onMouseOver con #fafbff */
  /* Non possiamo sovrascrivere facilmente l'inline onMouseOver, ma il default basta */

  /* pg-list-item hover già corretto in sharedStyles */

  /* Scrollbar della participant grid in admin */
  .adm-participants::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.03) !important;
  }

  /* Inline bg usato in UserDataPage sui mini-podio badges */
  /* background: var(--bg) è già #0d1117, ok */

  /* Lightbox è già dark per definizione, nessuna patch necessaria */

  /* Input number arrow (Chrome) */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    filter: invert(0.8);
  }

  /* video nativo — sfondo quando non ancora caricato */
  video {
    background: #0d1117;
  }
`;