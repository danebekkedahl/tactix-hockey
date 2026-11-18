/**
 * SYNAPZ HOCKEY v15.1 — 75%-Realistic / 25%-Stylized Shaded Hockey Gear Art
 * & Owned-Only Equipment Catalog Helpers (`engine/gear_art_75_25.js`)
 *
 * Permanently replaces all non-hockey emojis (winter mittens, swim goggles,
 * figure skates, tank tops) and thin wireframes with dimensional, multi-stop
 * metallic/carbon/polycarbonate SVG hockey illustrations for:
 *   - Category Tab & Room Pin Icons (`Bag`, `Stick`, `Gloves`, `Visor`, `Skates`, `Jersey`)
 *   - Individual Gear Item Card Thumbnails dynamically tinted to each item's colorway & tier
 *   - Starter Rink Kit items (`owned === true` on every profile) + Owned-Only Bag filtering
 */

let _gearSvgUidCounter = 0;
function nextGearUid(prefix = 'g75') {
  _gearSvgUidCounter = (_gearSvgUidCounter + 1) % 999999;
  return `${prefix}_${_gearSvgUidCounter}`;
}

function escAttr(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function hexToRgb(hex, fallback = [2, 132, 199]) {
  const clean = String(hex || '').trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16)
    ];
  }
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16)
    ];
  }
  return fallback;
}

function shadeHex(hex, delta = 0) {
  const [r, g, b] = hexToRgb(hex);
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const nr = clamp(r + delta);
  const ng = clamp(g + delta);
  const nb = clamp(b + delta);
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

/**
 * Starter Rink Kit — Always owned (`owned: true`) by every skater profile so the
 * Locker Room Equipment Bag strictly displays owned gear with zero Pro Shop ads.
 */
export function buildStarterGearItems(profile = {}) {
  const jerseyHex = profile?.jerseyColor || '#0284c7';
  const helmetHex = jerseyHex === '#eab308' ? '#111827' : jerseyHex;
  return [
    {
      id: 'starter-stick',
      category: 'Stick',
      slot: 'stick',
      style: 'starter-carbon',
      tierLabel: 'Starter Kit',
      name: 'Standard Carbon Composite Twig',
      cost: 0,
      owned: true,
      isStarter: true,
      color: '#334155',
      accentColor: jerseyHex,
      tapeColor: '#f8fafc'
    },
    {
      id: 'starter-gloves',
      category: 'Gloves',
      slot: 'gloves',
      style: '4-roll-pro',
      tierLabel: 'Starter Kit',
      name: 'Standard Team 4-Roll Hockey Gloves',
      cost: 0,
      owned: true,
      isStarter: true,
      color: jerseyHex,
      accentColor: '#f8fafc'
    },
    {
      id: 'starter-visor',
      category: 'Visor',
      slot: 'visor',
      style: 'clear-shield',
      tierLabel: 'Starter Kit',
      name: 'Standard Pro Bucket & Clear Shield',
      cost: 0,
      owned: true,
      isStarter: true,
      color: helmetHex,
      accentColor: '#bae6fd',
      visorTint: 'clear'
    },
    {
      id: 'starter-skates',
      category: 'Skates',
      slot: 'skates',
      style: 'chrome-steel',
      tierLabel: 'Starter Kit',
      name: 'Standard Pro Quarter Hockey Skates',
      cost: 0,
      owned: true,
      isStarter: true,
      color: '#1e293b',
      accentColor: '#94a3b8',
      steelColor: '#e2e8f0'
    }
  ];
}

export const STARTER_JERSEY_SWATCHES = [
  { id: 'jersey-blue', hex: '#0284c7', accent: '#38bdf8', name: 'All-Star Ice Blue Sweater', tierLabel: 'Team Kit', owned: true },
  { id: 'jersey-red', hex: '#dc2626', accent: '#fca5a5', name: 'Championship Crimson Red Sweater', tierLabel: 'Team Kit', owned: true },
  { id: 'jersey-pink', hex: '#ec4899', accent: '#f9a8d4', name: 'Electric Rink Pink Sweater', tierLabel: 'Team Kit', owned: true },
  { id: 'jersey-purple', hex: '#7c3aed', accent: '#c4b5fd', name: 'Royal Purple Pro Sweater', tierLabel: 'Team Kit', owned: true },
  { id: 'jersey-gold', hex: '#eab308', accent: '#fef08a', name: 'Vegas Championship Gold Sweater', tierLabel: 'Team Kit', owned: true },
  { id: 'jersey-black', hex: '#111827', accent: '#22d3ee', name: 'Stealth Blackout Pro Sweater', tierLabel: 'Team Kit', owned: true }
];

export function resolveItemTierLabel(item = {}) {
  if (item.tierLabel) return item.tierLabel;
  if (item.isStarter) return 'Starter Kit';
  if (item.isPromoShowcase) return 'Pro Drop';
  const cost = Number(item.cost || 0);
  if (cost >= 320) return 'Championship Tier';
  if (cost >= 220) return 'Elite Pro Tier';
  return 'Pro Stock';
}

/**
 * Crisp 75/25 Shaded Category Tab Icons (Inline SVG, zero emojis).
 */
export function renderGearCategoryIconSvg(category = 'Stick', sizePx = 18) {
  const uid = nextGearUid('cat');
  const norm = String(category || '').toLowerCase();
  const s = Math.max(14, Number(sizePx) || 18);

  if (norm.includes('bag')) {
    return `<svg viewBox="0 0 36 28" width="${s}" height="${Math.round(s * 0.8)}" aria-hidden="true" class="inline-block align-middle shrink-0">
      <defs>
        <linearGradient id="${uid}_bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e3a8a"/>
          <stop offset="55%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
      </defs>
      <path d="M12 8 C12 3, 24 3, 24 8" fill="none" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round"/>
      <rect x="3" y="8" width="30" height="17" rx="5" fill="url(#${uid}_bg)" stroke="#38bdf8" stroke-width="1.5"/>
      <path d="M11 8 L11 25 M25 8 L25 25" stroke="#fbbf24" stroke-width="1.8"/>
      <line x1="6" y1="13" x2="30" y2="13" stroke="#94a3b8" stroke-width="1.1" stroke-dasharray="2 1.5"/>
    </svg>`;
  }

  if (norm.includes('stick')) {
    return `<svg viewBox="0 0 36 28" width="${s}" height="${Math.round(s * 0.8)}" aria-hidden="true" class="inline-block align-middle shrink-0">
      <defs>
        <linearGradient id="${uid}_sh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </linearGradient>
      </defs>
      <line x1="5" y1="3" x2="22" y2="21" stroke="#020617" stroke-width="4.6" stroke-linecap="round"/>
      <line x1="5" y1="3" x2="22" y2="21" stroke="url(#${uid}_sh)" stroke-width="3" stroke-linecap="round"/>
      <path d="M21 20 Q28 24 33 19 Q33.5 15.5 29 15.5 Q24.5 17.5 20.8 18.8 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="1.3"/>
      <path d="M25.5 16.6 L31 15.8 L31.4 20.2 L25.5 21.4 Z" fill="#f8fafc" opacity="0.92"/>
    </svg>`;
  }

  if (norm.includes('glove')) {
    return `<svg viewBox="0 0 36 28" width="${s}" height="${Math.round(s * 0.8)}" aria-hidden="true" class="inline-block align-middle shrink-0">
      <defs>
        <linearGradient id="${uid}_gl" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="55%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect x="8" y="3" width="21" height="5.5" rx="2" fill="url(#${uid}_gl)" stroke="#e2e8f0" stroke-width="1.1"/>
      <rect x="9" y="9.5" width="19" height="3.6" rx="1.7" fill="url(#${uid}_gl)" stroke="#bae6fd" stroke-width="0.9"/>
      <rect x="9" y="13.8" width="19" height="3.6" rx="1.7" fill="url(#${uid}_gl)" stroke="#bae6fd" stroke-width="0.9"/>
      <path d="M5 11 Q2.5 16 6.5 21 L10 19.5 L9 11 Z" fill="#fbbf24" stroke="#0f172a" stroke-width="1"/>
      <rect x="10.5" y="18.2" width="3.8" height="6.5" rx="1.6" fill="#0284c7" stroke="#e2e8f0" stroke-width="0.8"/>
      <rect x="15" y="18.2" width="3.8" height="7" rx="1.6" fill="#0284c7" stroke="#e2e8f0" stroke-width="0.8"/>
      <rect x="19.5" y="18.2" width="3.8" height="6.6" rx="1.6" fill="#0284c7" stroke="#e2e8f0" stroke-width="0.8"/>
      <rect x="24" y="18.2" width="3.5" height="5.8" rx="1.5" fill="#0284c7" stroke="#e2e8f0" stroke-width="0.8"/>
    </svg>`;
  }

  if (norm.includes('visor') || norm.includes('helmet') || norm.includes('bucket')) {
    return `<svg viewBox="0 0 36 28" width="${s}" height="${Math.round(s * 0.8)}" aria-hidden="true" class="inline-block align-middle shrink-0">
      <defs>
        <linearGradient id="${uid}_shd" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#67e8f9"/>
          <stop offset="50%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#1e3a8a"/>
        </linearGradient>
      </defs>
      <path d="M7 15 C6.5 4, 29.5 4, 29 15 L27 17.5 L9 17.5 Z" fill="#1e293b" stroke="#94a3b8" stroke-width="1.3"/>
      <rect x="13" y="7.5" width="4" height="2" rx="1" fill="#020617"/>
      <rect x="19" y="7.5" width="4" height="2" rx="1" fill="#020617"/>
      <path d="M8 14 Q18 17.5 28 14 L26.5 22 Q18 25.5 9.5 22 Z" fill="url(#${uid}_shd)" fill-opacity="0.88" stroke="#e0f2fe" stroke-width="1.2"/>
      <line x1="12" y1="16" x2="18" y2="21" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
    </svg>`;
  }

  if (norm.includes('skate')) {
    return `<svg viewBox="0 0 36 28" width="${s}" height="${Math.round(s * 0.8)}" aria-hidden="true" class="inline-block align-middle shrink-0">
      <rect x="8" y="3" width="3.5" height="7" rx="1.2" fill="#f59e0b"/>
      <path d="M8 7 L19 7 L28 15 Q31 17 29.5 19.5 L7.5 19.5 Q6 15 8 7 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="1.3"/>
      <path d="M18 8 L21 7.5 L25 13.5 L22.5 14 Z" fill="#f8fafc"/>
      <path d="M8.5 19.5 L28.5 19.5 L26.8 23 L10.2 23 Z" fill="#f8fafc" stroke="#64748b" stroke-width="0.9"/>
      <rect x="6.5" y="23" width="24" height="2.4" rx="1.2" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.7"/>
    </svg>`;
  }

  // Jerseys / Sweater
  return `<svg viewBox="0 0 36 28" width="${s}" height="${Math.round(s * 0.8)}" aria-hidden="true" class="inline-block align-middle shrink-0">
    <defs>
      <linearGradient id="${uid}_jr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#0369a1"/>
      </linearGradient>
    </defs>
    <path d="M11 4 L15 6.5 L21 6.5 L25 4 L33 9.5 L29.5 15 L25.5 12.5 L25.5 25 L10.5 25 L10.5 12.5 L6.5 15 L3 9.5 Z" fill="url(#${uid}_jr)" stroke="#e2e8f0" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="10.5" y1="20.5" x2="25.5" y2="20.5" stroke="#fbbf24" stroke-width="2"/>
    <circle cx="18" cy="13.5" r="3.2" fill="#0f172a" stroke="#fbbf24" stroke-width="1"/>
  </svg>`;
}

/**
 * Rich 75/25 Shaded Individual Gear Item SVG Thumbnail (`120x84` viewBox).
 */
export function renderGearItemArtSvg(item = {}, opts = {}) {
  const uid = nextGearUid('itm');
  const cat = String(item.category || 'Stick');
  const col = item.color || item.hex || '#0284c7';
  const colLight = shadeHex(col, 48);
  const colDark = shadeHex(col, -52);
  const acc = item.accentColor || item.accent || '#38bdf8';
  const widthCls = opts.compact ? 'w-20 h-14' : 'w-24 h-16';

  if (cat === 'Gloves') {
    const is4Roll = String(item.style || '').includes('4-roll');
    return `
      <svg viewBox="0 0 120 84" data-gear-svg-cat="Gloves" data-gear-svg-id="${escAttr(item.id || 'gloves')}" class="${widthCls} shrink-0 rounded-xl bg-slate-950 border border-slate-700/80 p-1 shadow-inner">
        <defs>
          <linearGradient id="${uid}_shell" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${colLight}"/>
            <stop offset="52%" stop-color="${col}"/>
            <stop offset="100%" stop-color="${colDark}"/>
          </linearGradient>
          <linearGradient id="${uid}_cuff" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${colDark}"/>
            <stop offset="45%" stop-color="${colLight}"/>
            <stop offset="100%" stop-color="${colDark}"/>
          </linearGradient>
        </defs>
        <ellipse cx="62" cy="76" rx="40" ry="4.5" fill="rgba(2,6,23,0.75)"/>
        <!-- Flared Pro Cuff Roll with Stitched Piping -->
        <path d="M22 10 Q62 6 98 10 L95 25 Q62 22 25 25 Z" fill="url(#${uid}_cuff)" stroke="${acc}" stroke-width="1.8"/>
        <path d="M28 17 Q62 14 92 17" fill="none" stroke="${acc}" stroke-width="1.2" stroke-dasharray="4 2" opacity="0.9"/>
        ${is4Roll ? `
          <!-- 4-Roll Dimensional Segmented Backhand Rolls -->
          <rect x="24" y="27" width="72" height="8.2" rx="4" fill="url(#${uid}_shell)" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
          <rect x="24" y="36.5" width="72" height="8.2" rx="4" fill="url(#${uid}_shell)" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
          <rect x="25" y="46" width="70" height="8" rx="4" fill="url(#${uid}_shell)" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
          <rect x="27" y="55" width="66" height="7" rx="3.5" fill="url(#${uid}_shell)" stroke="${acc}" stroke-width="1.1"/>
        ` : `
          <!-- Tapered Anatomical Dual-Density Backhand Plates -->
          <path d="M24 27 L58 26 L56 58 L26 58 Z" fill="url(#${uid}_shell)" stroke="${acc}" stroke-width="1.4"/>
          <path d="M62 26 L96 27 L93 58 L64 58 Z" fill="url(#${uid}_shell)" stroke="${acc}" stroke-width="1.4"/>
          <line x1="30" y1="33" x2="53" y2="32" stroke="rgba(255,255,255,0.5)" stroke-width="1.6" stroke-linecap="round"/>
          <line x1="67" y1="32" x2="90" y2="33" stroke="rgba(255,255,255,0.5)" stroke-width="1.6" stroke-linecap="round"/>
        `}
        <!-- Articulated 2-Piece Pro Lock-Thumb -->
        <path d="M15 31 Q8 45 18 60 L27 56 L24 31 Z" fill="${acc}" stroke="#0f172a" stroke-width="1.4"/>
        <path d="M16 36 Q13 45 19 54" fill="none" stroke="#ffffff" stroke-width="1.2" opacity="0.65"/>
        <!-- Segmented Finger Stalls & Nash Gussets -->
        <rect x="30" y="62.5" width="13.5" height="12" rx="3.5" fill="url(#${uid}_shell)" stroke="#cbd5e1" stroke-width="0.9"/>
        <rect x="46" y="62.5" width="13.5" height="13" rx="3.5" fill="url(#${uid}_shell)" stroke="#cbd5e1" stroke-width="0.9"/>
        <rect x="62" y="62.5" width="13.5" height="12.5" rx="3.5" fill="url(#${uid}_shell)" stroke="#cbd5e1" stroke-width="0.9"/>
        <rect x="78" y="62.5" width="12.5" height="10.5" rx="3.2" fill="url(#${uid}_shell)" stroke="#cbd5e1" stroke-width="0.9"/>
      </svg>
    `;
  }

  if (cat === 'Stick') {
    const tapeCol = item.tapeColor || '#f8fafc';
    const tapeStripe = tapeCol === '#0f172a' || tapeCol === '#111827' ? '#475569' : '#cbd5e1';
    return `
      <svg viewBox="0 0 120 84" data-gear-svg-cat="Stick" data-gear-svg-id="${escAttr(item.id || 'stick')}" class="${widthCls} shrink-0 rounded-xl bg-slate-950 border border-slate-700/80 p-1 shadow-inner">
        <defs>
          <linearGradient id="${uid}_shaft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="38%" stop-color="${col}"/>
            <stop offset="72%" stop-color="${colLight}"/>
            <stop offset="100%" stop-color="#090d16"/>
          </linearGradient>
          <pattern id="${uid}_weave" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="5" height="5" fill="#0f172a"/>
            <path d="M0 2.5 H5 M2.5 0 V5" stroke="rgba(255,255,255,0.16)" stroke-width="0.9"/>
          </pattern>
        </defs>
        <ellipse cx="86" cy="73" rx="26" ry="4" fill="rgba(2,6,23,0.75)"/>
        <!-- Butt-End Knob Tape -->
        <line x1="11" y1="9" x2="18" y2="15" stroke="${tapeCol}" stroke-width="9.5" stroke-linecap="round"/>
        <!-- 18K Carbon-Weave Composite Shaft -->
        <line x1="14" y1="12" x2="77" y2="62" stroke="url(#${uid}_weave)" stroke-width="9" stroke-linecap="round"/>
        <line x1="14" y1="12" x2="77" y2="62" stroke="url(#${uid}_shaft)" stroke-width="6.4" stroke-linecap="round" opacity="0.9"/>
        <!-- Kick-Point Flex Accent Graphic -->
        <line x1="35" y1="28.6" x2="57" y2="46.1" stroke="${acc}" stroke-width="6.8" stroke-linecap="round"/>
        <line x1="17" y1="13.2" x2="74" y2="58.5" stroke="#ffffff" stroke-width="1.1" stroke-dasharray="3 4" opacity="0.55"/>
        <!-- Tapered Hosel & Pro Curved Hockey Blade -->
        <path d="M74 60 Q92 69 111 58 Q114 50 103 49 Q88 54 75 57 Z" fill="#111827" stroke="${colLight}" stroke-width="1.6"/>
        <!-- Heel-to-Toe Cloth Blade Tape -->
        <path d="M84 54.5 L105 49.5 L107.5 58.2 L84.5 63.6 Z" fill="${tapeCol}" opacity="0.96"/>
        <line x1="89" y1="53.5" x2="90" y2="62.5" stroke="${tapeStripe}" stroke-width="1.1"/>
        <line x1="94.5" y1="52.2" x2="95.5" y2="61.2" stroke="${tapeStripe}" stroke-width="1.1"/>
        <line x1="100" y1="50.8" x2="101" y2="59.8" stroke="${tapeStripe}" stroke-width="1.1"/>
      </svg>
    `;
  }

  if (cat === 'Skates') {
    const st = String(item.style || '');
    const runnerFill = st.includes('black-steel')
      ? '#0f172a'
      : (st.includes('gold-steel') ? '#facc15' : (st.includes('blue-steel') ? '#38bdf8' : (item.steelColor || '#e2e8f0')));
    const runnerHighlight = st.includes('black-steel') ? '#475569' : '#ffffff';
    return `
      <svg viewBox="0 0 120 84" data-gear-svg-cat="Skates" data-gear-svg-id="${escAttr(item.id || 'skates')}" class="${widthCls} shrink-0 rounded-xl bg-slate-950 border border-slate-700/80 p-1 shadow-inner">
        <defs>
          <linearGradient id="${uid}_boot" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#334155"/>
            <stop offset="48%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
          <linearGradient id="${uid}_steel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${shadeHex(runnerFill, -28)}"/>
            <stop offset="50%" stop-color="${runnerHighlight}"/>
            <stop offset="100%" stop-color="${runnerFill}"/>
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="76" rx="42" ry="3.8" fill="rgba(2,6,23,0.78)"/>
        <!-- Flexible Pro Tendon Guard -->
        <path d="M29 7 L38 7 L39 24 L28 24 Z" rx="3" fill="${acc}" stroke="#0f172a" stroke-width="1.3"/>
        <!-- White Pro Felt Tongue -->
        <path d="M56 15 Q65 13 69 20 L80 35 L68 38 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.1"/>
        <!-- 1-Piece Carbon Boot Quarter Package -->
        <path d="M27 20 L60 19 L89 41 Q97 46 93 55 L25 55 Q19 45 27 20 Z" fill="url(#${uid}_boot)" stroke="${col}" stroke-width="2"/>
        <!-- Quarter-Package Carbon Trim & Eyelets -->
        <path d="M32 32 Q54 30 80 45" fill="none" stroke="${colLight}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M35 41 Q55 39 76 50" fill="none" stroke="${acc}" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/>
        <line x1="60" y1="23" x2="69" y2="20" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="66" y1="28" x2="75" y2="25" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="72" y1="33" x2="81" y2="30" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="78" y1="38" x2="86" y2="35" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Dual-Cutout Hockey Blade Holder (Zero Toe Picks!) -->
        <path d="M28 55 L90 55 L85 65.5 L33 65.5 Z" fill="#f8fafc" stroke="#64748b" stroke-width="1.3"/>
        <polygon points="39,57.5 53,57.5 50,63 41,63" fill="#090d16"/>
        <polygon points="64,57.5 78,57.5 75,63 66,63" fill="#090d16"/>
        <!-- Radiused Pro Hockey Steel Runner -->
        <path d="M22 65.5 L96 65.5 Q98 71 90 71.5 L28 71.5 Q20 71 22 65.5 Z" fill="url(#${uid}_steel)" stroke="${acc}" stroke-width="1"/>
      </svg>
    `;
  }

  if (cat === 'Jersey') {
    return `
      <svg viewBox="0 0 120 84" data-gear-svg-cat="Jersey" data-gear-svg-id="${escAttr(item.id || 'jersey')}" class="${widthCls} shrink-0 rounded-xl bg-slate-950 border border-slate-700/80 p-1 shadow-inner">
        <defs>
          <linearGradient id="${uid}_sw" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${colLight}"/>
            <stop offset="55%" stop-color="${col}"/>
            <stop offset="100%" stop-color="${colDark}"/>
          </linearGradient>
        </defs>
        <path d="M40 10 L51 16 L69 16 L80 10 L106 26 L96 42 L83 35 L83 74 L37 74 L37 35 L24 42 L14 26 Z" fill="url(#${uid}_sw)" stroke="#e2e8f0" stroke-width="1.6" stroke-linejoin="round"/>
        <!-- Shoulder Yoke & Collar Laces -->
        <path d="M40 10 L51 16 L69 16 L80 10 L96 20 L82 24 L38 24 L24 20 Z" fill="${colDark}" opacity="0.55"/>
        <polygon points="53,16 67,16 63,25 57,25" fill="#0f172a" stroke="#f8fafc" stroke-width="1"/>
        <line x1="56" y1="19" x2="64" y2="19" stroke="#f8fafc" stroke-width="1.2"/>
        <line x1="57" y1="22" x2="63" y2="22" stroke="#f8fafc" stroke-width="1.2"/>
        <!-- Double Hem & Sleeve Stripes -->
        <rect x="37" y="59" width="46" height="4" fill="${acc}"/>
        <rect x="37" y="65" width="46" height="3" fill="#f8fafc" opacity="0.9"/>
        <!-- Stitched Shield Crest -->
        <polygon points="60,31 70,35 67,48 60,53 53,48 50,35" fill="#0f172a" stroke="${acc}" stroke-width="1.5"/>
        <text x="60" y="45" fill="#f8fafc" font-size="10" font-weight="900" text-anchor="middle">S</text>
      </svg>
    `;
  }

  // Helmets & Visors (`Visor` / `Helmet`)
  const st = String(item.style || '');
  const isCage = st.includes('cage');
  const isHelmetItem = cat === 'Helmet';
  const shellBase = isHelmetItem ? col : '#1e293b';
  const shellLight = shadeHex(shellBase, 42);
  const shellDark = shadeHex(shellBase, -42);
  const visorStop1 = st.includes('gold')
    ? '#fef08a'
    : (st.includes('smoke') ? '#334155' : (st.includes('clear') ? '#e0f2fe' : '#67e8f9'));
  const visorStop2 = st.includes('gold')
    ? '#ca8a04'
    : (st.includes('smoke') ? '#090d16' : (st.includes('clear') ? '#7dd3fc' : col));
  const visorOpacity = st.includes('clear') ? '0.46' : '0.86';

  return `
    <svg viewBox="0 0 120 84" data-gear-svg-cat="Visor" data-gear-svg-id="${escAttr(item.id || 'visor')}" class="${widthCls} shrink-0 rounded-xl bg-slate-950 border border-slate-700/80 p-1 shadow-inner">
      <defs>
        <linearGradient id="${uid}_bkt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${shellLight}"/>
          <stop offset="55%" stop-color="${shellBase}"/>
          <stop offset="100%" stop-color="${shellDark}"/>
        </linearGradient>
        <linearGradient id="${uid}_vsr" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${visorStop1}"/>
          <stop offset="55%" stop-color="${visorStop2}"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="75" rx="36" ry="4" fill="rgba(2,6,23,0.75)"/>
      <!-- Aero Hockey Bucket Shell, Crown Ridge & Ventilation Ports -->
      <path d="M24 44 C21 11, 99 11, 96 44 L89 51 L31 51 Z" fill="url(#${uid}_bkt)" stroke="${acc}" stroke-width="1.8"/>
      <path d="M40 16 Q60 11 80 16" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="2" stroke-linecap="round"/>
      <rect x="39" y="21" width="14" height="4.5" rx="2.2" fill="#020617" stroke="rgba(255,255,255,0.28)" stroke-width="0.8"/>
      <rect x="67" y="21" width="14" height="4.5" rx="2.2" fill="#020617" stroke="rgba(255,255,255,0.28)" stroke-width="0.8"/>
      <!-- Temple Mounting Hardware -->
      <circle cx="29" cy="43" r="3" fill="#cbd5e1" stroke="#0f172a" stroke-width="1"/>
      <circle cx="91" cy="43" r="3" fill="#cbd5e1" stroke="#0f172a" stroke-width="1"/>
      ${isCage ? `
        <!-- Pro Titanium Facemask Cage -->
        <rect x="31" y="39" width="58" height="27" rx="7" fill="rgba(226,232,240,0.12)" stroke="#e2e8f0" stroke-width="2"/>
        <line x1="31" y1="48" x2="89" y2="48" stroke="#e2e8f0" stroke-width="1.4"/>
        <line x1="33" y1="57" x2="87" y2="57" stroke="#e2e8f0" stroke-width="1.4"/>
        <line x1="49" y1="39" x2="49" y2="66" stroke="#e2e8f0" stroke-width="1.4"/>
        <line x1="60" y1="39" x2="60" y2="66" stroke="#e2e8f0" stroke-width="1.4"/>
        <line x1="71" y1="39" x2="71" y2="66" stroke="#e2e8f0" stroke-width="1.4"/>
      ` : `
        <!-- Polycarbonate Curved Hockey Visor Shield + Diagonal Specular Reflection -->
        <path d="M26 38 Q60 47 94 38 L90 60 Q60 69 30 60 Z" fill="url(#${uid}_vsr)" fill-opacity="${visorOpacity}" stroke="#e0f2fe" stroke-width="1.6"/>
        <path d="M36 43 L48 59 M45 44 L54 57" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" opacity="0.72"/>
      `}
    </svg>
  `;
}

/**
 * Returns strictly `owned === true` items for a player's Locker Room Equipment Bag
 * (Starter Rink Kit + purchased/unlocked Pro Shop items ONLY — zero unowned ads!).
 */
export function getOwnedLockerBagItems(profile = {}, shopCatalog = [], categoryFilter = 'Bag') {
  const ownedSet = new Set(Array.isArray(profile?.ownedGear) ? profile.ownedGear : []);
  const starters = buildStarterGearItems(profile);
  const purchasedShopItems = (Array.isArray(shopCatalog) ? shopCatalog : [])
    .filter((it) => it && it.category !== 'Celly' && ownedSet.has(it.id))
    .map((it) => ({
      ...it,
      owned: true,
      isStarter: false,
      tierLabel: resolveItemTierLabel(it)
    }));

  const combined = [...starters, ...purchasedShopItems];
  const cat = String(categoryFilter || 'Bag');
  if (cat === 'Bag' || cat === 'all') {
    return combined;
  }
  if (cat === 'Visor' || cat === 'Helmets') {
    return combined.filter((it) => it.category === 'Visor' || it.category === 'Helmet');
  }
  if (cat === 'Sticks' || cat === 'Stick') {
    return combined.filter((it) => it.category === 'Stick');
  }
  return combined.filter((it) => it.category === cat);
}

const SynapzGearArt7525 = {
  buildStarterGearItems,
  STARTER_JERSEY_SWATCHES,
  resolveItemTierLabel,
  renderGearCategoryIconSvg,
  renderGearItemArtSvg,
  getOwnedLockerBagItems
};

if (typeof window !== 'undefined') {
  window.SynapzGearArt7525 = SynapzGearArt7525;
  window.renderProShopWallProductSvg = (item) => renderGearItemArtSvg(item);
}

export default SynapzGearArt7525;
