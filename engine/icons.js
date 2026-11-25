/* =========================================================
   Thẻ minh họa cho từng kết thúc (SVG vẽ bằng code, 64×64).
   Thư viện hình dùng chung cả mùa. Mỗi tập khai báo STORY.endingIcons = { idKếtThúc: 'tênHình' }.
   ========================================================= */
(function () {
  'use strict';
  const S = 'fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
  const D = {
    note: `<g ${S}><path d="M16 6h24l10 10v42H16z"/><path d="M40 6v10h10M22 28h20M22 36h20M22 44h12"/></g>`,
    star: `<g ${S}><path d="M32 8l7 15 16 2-12 11 3 16-14-8-14 8 3-16L9 25l16-2z"/></g>`,
    wave: `<g ${S}><path d="M8 32h6l4-10 6 22 6-30 6 30 6-22 4 10h10"/></g>`,
    folder: `<g ${S}><path d="M6 18h20l4 6h28v28H6z"/><path d="M6 30h52"/></g>`,
    house: `<g ${S}><path d="M8 30L32 10l24 20M14 26v28h36V26"/><path d="M26 54V40h12v14"/><path d="M4 58l8-4M60 58l-8-4"/></g>`,
    eye: `<g ${S}><path d="M4 32s10-16 28-16 28 16 28 16-10 16-28 16S4 32 4 32z"/><circle cx="32" cy="32" r="7"/></g>`,
    sun: `<g ${S}><path d="M8 44h48M14 52h36"/><path d="M18 44a14 14 0 0 1 28 0"/><path d="M32 12v8M14 20l5 5M50 20l-5 5M6 34h6M52 34h6"/></g>`,
    key: `<g ${S}><circle cx="18" cy="32" r="10"/><path d="M28 32h28M48 32v8M54 32v6"/></g>`,
    ruler: `<g ${S}><rect x="6" y="24" width="52" height="16" rx="2"/><path d="M14 24v6M22 24v9M30 24v6M38 24v9M46 24v6"/></g>`,
    // Mùa 2 · Tập 1 · Bãi Bồi
    tide: `<g ${S}><path d="M6 24c6-6 10-6 16 0s10 6 16 0 10-6 16 0"/><path d="M6 36c6-6 10-6 16 0s10 6 16 0 10-6 16 0"/><path d="M6 48c6-6 10-6 16 0s10 6 16 0 10-6 16 0"/></g>`,
    stake: `<g ${S}><path d="M32 6v40M28 46l4 10 4-10z"/><path d="M26 14h12M26 22h12"/><path d="M6 50c8-5 14-5 20 0M38 50c8-5 14-5 20 0"/></g>`,
    boat: `<g ${S}><path d="M6 36h52l-8 12H14z"/><path d="M22 36l6-22 10 22M28 14v-4"/><path d="M4 56c8-4 14-4 20 0s14 4 20 0 12-4 16 0"/></g>`,
    lamp: `<g ${S}><path d="M24 20h16l4 22H20z"/><path d="M28 14h8M32 8v6M24 42v6h16v-6"/><path d="M8 30l6 2M56 30l-6 2M10 18l6 5M54 18l-6 5"/></g>`,
    tree: `<g ${S}><path d="M32 58V30M32 40l-10-8M32 36l10-10M32 30l-6-12M32 30l8-14"/><circle cx="20" cy="30" r="3"/><circle cx="44" cy="24" r="3"/><circle cx="26" cy="16" r="3"/><circle cx="40" cy="14" r="3"/></g>`,
    bell: `<g ${S}><path d="M20 44c0-14 2-26 12-26s12 12 12 26z"/><path d="M14 44h36M32 18v-6M28 50a4 4 0 0 0 8 0"/></g>`,
    bowl: `<g ${S}><path d="M8 30h48a24 24 0 0 1-48 0z"/><path d="M20 54h24"/><path d="M24 22c0-4 4-4 4-8M32 22c0-4 4-4 4-8M40 22c0-4 4-4 4-8"/></g>`,
    pen: `<g ${S}><path d="M44 8l12 12-30 30-16 4 4-16z"/><path d="M38 14l12 12M14 38l12 12"/><path d="M8 58c6-4 10 2 16-2"/></g>`,
    roof: `<g ${S}><path d="M6 34L32 16l26 18"/><path d="M12 30v6M52 30v6"/><path d="M4 46c8-4 14-4 20 0s14 4 20 0 12-4 16 0M4 56c8-4 14-4 20 0s14 4 20 0 12-4 16 0"/></g>`
  };
  function EndingIcon(id, map) {
    const m = map || EndingIcon.map || {};
    return `<svg class="eicon" viewBox="0 0 64 64" aria-hidden="true">${D[m[id]] || D.note}</svg>`;
  }
  EndingIcon.map = {};
  EndingIcon.lib = D;
  window.EndingIcon = EndingIcon;
})();
