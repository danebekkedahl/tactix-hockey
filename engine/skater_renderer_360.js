/**
 * SYNAPZ HOCKEY v15.1 — Live Layered 360° Customizable Skater Renderer
 * (`engine/skater_renderer_360.js`)
 *
 * 75%-Realistic / 25%-Stylized multi-layered vector hockey skater engine:
 *   - Real-time dynamic layers: Skin Tone, Hair Style + Hair Color (visible with
 *     helmet on across Front 0°, Angled 45°, and Back 180° views), Jersey Primary
 *     + Accent with cloth folds, collar laces, shoulder yokes, sleeve numbers,
 *     front crest, and Rear 180° stitched Upper-Back Nameplate (`TUG BOAT`) +
 *     bold tackle-twill `#28` Back Number, Helmet & Visor (clear, smoke, gold
 *     chrome, blue iridium, cage), 4-Roll / Tapered Hockey Gloves, Carbon-Weave
 *     Composite Stick + Kick-Point Band + Blade Tape, and Pro Hockey Skates
 *     (quarter package, tendon guard, felt tongue, holder, steel runner — 0 toe picks).
 *   - Interactive 360° Spin (`Front 0°` <-> `Angled 45°` <-> `Back 180°`):
 *     Horizontal pointer/touch/mouse drag-to-spin + `🔄 Spin 360° (Front / Back)` button.
 */

let _skaterUidSeq = 0;
function nextSkaterUid() {
  _skaterUidSeq = (_skaterUidSeq + 1) % 999999;
  return `sk360_${_skaterUidSeq}`;
}

function escSvg(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseHexRgb(hex, fallback = [2, 132, 199]) {
  const raw = String(hex || '').trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    return [
      parseInt(raw[0] + raw[0], 16),
      parseInt(raw[1] + raw[1], 16),
      parseInt(raw[2] + raw[2], 16)
    ];
  }
  if (/^[0-9a-fA-F]{6}$/.test(raw)) {
    return [
      parseInt(raw.slice(0, 2), 16),
      parseInt(raw.slice(2, 4), 16),
      parseInt(raw.slice(4, 6), 16)
    ];
  }
  return fallback;
}

function adjustHex(hex, delta = 0, fallback = '#0284c7') {
  const [r, g, b] = parseHexRgb(hex, parseHexRgb(fallback));
  const c = (n) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${c(r + delta).toString(16).padStart(2, '0')}${c(g + delta).toString(16).padStart(2, '0')}${c(b + delta).toString(16).padStart(2, '0')}`;
}

function luminance(hex) {
  const [r, g, b] = parseHexRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

const NAMED_HAIR_COLORS = {
  blonde: '#facc15',
  brown: '#78350f',
  black: '#111827',
  red: '#dc2626',
  blue: '#2563eb',
  cyan: '#06b6d4',
  platinum: '#e2e8f0'
};

function resolveCatalogItem(idOrVal, category) {
  if (!idOrVal) return null;
  const shop = (typeof window !== 'undefined' && Array.isArray(window.PRO_SHOP_ITEMS)) ? window.PRO_SHOP_ITEMS : [];
  return shop.find((it) => it.id === idOrVal || (category && it.category === category && (it.color === idOrVal || it.style === idOrVal))) || null;
}

export function normalizeSkaterState(rawState = {}, previewItem = null) {
  const s = { ...(rawState || {}) };
  if (previewItem && typeof previewItem === 'object') {
    const cat = previewItem.category || '';
    if (cat === 'Gloves' || previewItem.slot === 'gloves') {
      s.equippedGloves = previewItem.color;
      s.equippedGlovesId = previewItem.id;
      s.glovesStyle = previewItem.style;
    } else if (cat === 'Stick' || previewItem.slot === 'stick') {
      s.equippedStick = previewItem.color;
      s.equippedStickId = previewItem.id;
      s.stickStyle = previewItem.style;
      s.bladeTapeColor = previewItem.tapeColor;
    } else if (cat === 'Helmet' || previewItem.slot === 'helmet') {
      s.equippedHelmet = previewItem.color;
      s.equippedHelmetId = previewItem.id;
    } else if (cat === 'Visor' || previewItem.slot === 'visor') {
      s.equippedVisor = previewItem.color;
      s.equippedVisorId = previewItem.id;
      s.visorStyle = previewItem.style;
    } else if (cat === 'Skates' || previewItem.slot === 'skates') {
      s.equippedSkate = previewItem.color;
      s.equippedSkates = previewItem.id;
      s.equippedSkatesId = previewItem.id;
      s.skateStyle = previewItem.style;
      s.steelColor = previewItem.steelColor;
    } else if (cat === 'Jersey' || previewItem.hex) {
      s.jerseyColor = previewItem.hex || previewItem.color;
    }
  }

  const rawName = String(s.name || s.firstName || 'Skater').trim() || 'Skater';
  const backNameplate = String(s.jerseyBackName || rawName || s.lastName || 'SKATER')
    .trim()
    .toUpperCase()
    .slice(0, 14) || 'SKATER';

  const rawNum = s.jerseyNumber !== undefined && s.jerseyNumber !== null ? String(s.jerseyNumber).trim() : '9';
  const jerseyNumber = rawNum.replace(/[^0-9]/g, '').slice(0, 2);

  const skinTone = String(s.skinTone || '#fdba74').startsWith('#') ? s.skinTone : '#fdba74';
  const rawHairCol = String(s.hairColor || '#78350f').trim();
  const hairColor = rawHairCol.startsWith('#')
    ? rawHairCol
    : (NAMED_HAIR_COLORS[rawHairCol.toLowerCase()] || '#78350f');

  const rawStyle = String(s.hairStyle || 'flow').trim().toLowerCase();
  const hairStyle = ['flow', 'short', 'fade', 'ponytail', 'curly', 'mohawk', 'braids', 'buzz'].includes(rawStyle)
    ? (rawStyle === 'fade' ? 'short' : rawStyle)
    : 'flow';

  const jerseyColor = String(s.jerseyColor || '#0284c7').startsWith('#') ? s.jerseyColor : '#0284c7';
  const jerseyLum = luminance(jerseyColor);
  const jerseyAccent = s.jerseyAccent || (
    jerseyColor.toLowerCase() === '#111827' || jerseyColor.toLowerCase() === '#0f172a'
      ? '#22d3ee'
      : (jerseyColor.toLowerCase() === '#eab308' || jerseyColor.toLowerCase() === '#facc15'
          ? '#0f172a'
          : (jerseyColor.toLowerCase() === '#dc2626' || jerseyColor.toLowerCase() === '#ec4899'
              ? '#fde047'
              : '#38bdf8'))
  );

  const glovesMeta = resolveCatalogItem(s.equippedGlovesId || s.equippedGloves, 'Gloves');
  const stickMeta = resolveCatalogItem(s.equippedStickId || s.equippedStick, 'Stick');
  const helmetMeta = resolveCatalogItem(s.equippedHelmetId || s.equippedHelmet, 'Helmet');
  const visorMeta = resolveCatalogItem(s.equippedVisorId || s.equippedVisor, 'Visor');
  const skateMeta = resolveCatalogItem(s.equippedSkatesId || s.equippedSkates || s.equippedSkate, 'Skates');

  const glovesId = s.equippedGlovesId || (glovesMeta && glovesMeta.id) || 'starter-gloves';
  const glovesColor = (glovesMeta && glovesMeta.color) ||
    (String(s.equippedGloves || '').startsWith('#') ? s.equippedGloves : jerseyColor);
  const glovesAccent = (glovesMeta && glovesMeta.accentColor) || '#f8fafc';
  const glovesStyle = s.glovesStyle || (glovesMeta && glovesMeta.style) || '4-roll-pro';

  const stickId = s.equippedStickId || (stickMeta && stickMeta.id) || 'starter-stick';
  const stickColor = (stickMeta && stickMeta.color) ||
    (String(s.equippedStick || '').startsWith('#') && s.equippedStickId ? s.equippedStick : '#334155');
  const stickAccent = (stickMeta && stickMeta.accentColor) || jerseyColor;
  const bladeTapeColor = s.bladeTapeColor || (stickMeta && stickMeta.tapeColor) || '#f8fafc';

  const helmetId = s.equippedHelmetId || (helmetMeta && helmetMeta.id) || 'starter-helmet';
  const helmetColor = (helmetMeta && helmetMeta.color) ||
    (String(s.equippedHelmet || '').startsWith('#') && s.equippedHelmetId ? s.equippedHelmet : (jerseyLum > 0.72 ? '#111827' : jerseyColor));

  const visorId = s.equippedVisorId || (visorMeta && visorMeta.id) || 'starter-visor';
  const visorStyle = s.visorStyle || (visorMeta && visorMeta.style) ||
    (visorId === 'starter-visor' ? 'clear-shield' : 'blue-iridium');
  const visorColor = (visorMeta && visorMeta.color) ||
    (visorStyle === 'clear-shield' ? '#bae6fd' : (String(s.equippedVisor || '').startsWith('#') ? s.equippedVisor : '#38bdf8'));

  const skatesId = s.equippedSkatesId || s.equippedSkates || (skateMeta && skateMeta.id) || 'starter-skates';
  const skateStyle = s.skateStyle || (skateMeta && skateMeta.style) || 'chrome-steel';
  const skateBootAccent = (skateMeta && skateMeta.color) || jerseyAccent;
  const steelColor = s.steelColor || (skateMeta && skateMeta.steelColor) ||
    (skateStyle.includes('black') ? '#0f172a' : (skateStyle.includes('gold') ? '#facc15' : (skateStyle.includes('blue') ? '#38bdf8' : '#e2e8f0')));

  const breezerColor = (jerseyColor.toLowerCase() === '#111827' || jerseyColor.toLowerCase() === '#0f172a')
    ? '#090d16'
    : '#0f172a';

  return {
    profileId: s.id || 'skater',
    name: rawName,
    backNameplate,
    jerseyNumber,
    skinTone,
    hairStyle,
    hairColor,
    jerseyColor,
    jerseyAccent,
    breezerColor,
    glovesId,
    glovesColor,
    glovesAccent,
    glovesStyle,
    stickId,
    stickColor,
    stickAccent,
    bladeTapeColor,
    helmetId,
    helmetColor,
    visorId,
    visorColor,
    visorStyle,
    skatesId,
    skateStyle,
    skateBootAccent,
    steelColor
  };
}

function classifySpinView(angleDeg = 0) {
  const norm = ((Number(angleDeg) || 0) % 360 + 360) % 360;
  if (norm >= 115 && norm <= 245) {
    return { normAngle: norm, face: 'back', shiftX: 0 };
  }
  if (norm >= 25 && norm < 115) {
    return { normAngle: norm, face: 'angled', dir: 1, shiftX: 7 };
  }
  if (norm > 245 && norm <= 335) {
    return { normAngle: norm, face: 'angled', dir: -1, shiftX: -7 };
  }
  return { normAngle: norm, face: 'front', shiftX: 0 };
}

function renderHairUnderHelmetFront(uid, cfg, cx) {
  const hFill = `url(#${uid}_hair)`;
  const hDark = adjustHex(cfg.hairColor, -42, '#1e293b');
  const style = cfg.hairStyle;

  if (style === 'ponytail') {
    return `
      <g data-skater-layer="hair-front-ponytail">
        <!-- Rear ponytail sweeping out from beneath helmet rim over right shoulder -->
        <path d="M ${cx + 22} 66 C ${cx + 38} 68, ${cx + 46} 84, ${cx + 40} 103 C ${cx + 35} 112, ${cx + 24} 109, ${cx + 25} 96 C ${cx + 26} 85, ${cx + 21} 76, ${cx + 18} 70 Z" fill="${hFill}" stroke="${hDark}" stroke-width="1.3"/>
        <path d="M ${cx + 28} 74 C ${cx + 36} 82, ${cx + 36} 94, ${cx + 32} 103" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.4" stroke-linecap="round"/>
        <rect x="${cx + 20}" y="66" width="7" height="4" rx="2" fill="${cfg.jerseyAccent}" transform="rotate(22 ${cx + 23} 68)"/>
        <!-- Temple framing strands -->
        <path d="M ${cx - 24} 58 Q ${cx - 27} 68 ${cx - 22} 75" fill="none" stroke="${cfg.hairColor}" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M ${cx + 24} 58 Q ${cx + 27} 68 ${cx + 22} 74" fill="none" stroke="${cfg.hairColor}" stroke-width="3.2" stroke-linecap="round"/>
      </g>
    `;
  }

  if (style === 'flow') {
    return `
      <g data-skater-layer="hair-front-flow">
        <!-- Classic Hockey Flow ("Lettuce") curling out beneath both sides of helmet rim -->
        <path d="M ${cx - 23} 58 C ${cx - 35} 64, ${cx - 38} 80, ${cx - 27} 86 C ${cx - 21} 88, ${cx - 18} 80, ${cx - 20} 72 Z" fill="${hFill}" stroke="${hDark}" stroke-width="1.2"/>
        <path d="M ${cx + 23} 58 C ${cx + 35} 64, ${cx + 38} 80, ${cx + 27} 86 C ${cx + 21} 88, ${cx + 18} 80, ${cx + 20} 72 Z" fill="${hFill}" stroke="${hDark}" stroke-width="1.2"/>
        <path d="M ${cx - 29} 68 Q ${cx - 31} 77 ${cx - 25} 82 M ${cx + 29} 68 Q ${cx + 31} 77 ${cx + 25} 82" fill="none" stroke="rgba(255,255,255,0.32)" stroke-width="1.2" stroke-linecap="round"/>
      </g>
    `;
  }

  if (style === 'curly') {
    return `
      <g data-skater-layer="hair-front-curly" fill="${hFill}" stroke="${hDark}" stroke-width="1.1">
        <circle cx="${cx - 26}" cy="64" r="5.5"/>
        <circle cx="${cx - 28}" cy="72" r="5.2"/>
        <circle cx="${cx - 23}" cy="79" r="4.8"/>
        <circle cx="${cx + 26}" cy="64" r="5.5"/>
        <circle cx="${cx + 28}" cy="72" r="5.2"/>
        <circle cx="${cx + 23}" cy="79" r="4.8"/>
      </g>
    `;
  }

  if (style === 'braids') {
    return `
      <g data-skater-layer="hair-front-braids" fill="${hFill}" stroke="${hDark}" stroke-width="1.1">
        <ellipse cx="${cx - 25}" cy="72" rx="4.2" ry="5"/>
        <ellipse cx="${cx - 26}" cy="81" rx="4" ry="5"/>
        <ellipse cx="${cx - 26}" cy="90" rx="3.6" ry="4.8"/>
        <rect x="${cx - 29}" y="94" width="6" height="2.6" rx="1.2" fill="${cfg.jerseyAccent}"/>
        <ellipse cx="${cx + 25}" cy="72" rx="4.2" ry="5"/>
        <ellipse cx="${cx + 26}" cy="81" rx="4" ry="5"/>
        <ellipse cx="${cx + 26}" cy="90" rx="3.6" ry="4.8"/>
        <rect x="${cx + 23}" y="94" width="6" height="2.6" rx="1.2" fill="${cfg.jerseyAccent}"/>
      </g>
    `;
  }

  if (style === 'mohawk') {
    return `
      <g data-skater-layer="hair-front-mohawk">
        <!-- Mohawk crest peaking cleanly above center helmet ridge -->
        <path d="M ${cx - 6} 24 L ${cx} 9 L ${cx + 6} 24 Q ${cx} 21 ${cx - 6} 24 Z" fill="${hFill}" stroke="${hDark}" stroke-width="1.2"/>
        <path d="M ${cx - 4} 22 L ${cx - 2} 13 M ${cx + 3} 22 L ${cx + 2} 14" stroke="rgba(255,255,255,0.38)" stroke-width="1.1" stroke-linecap="round"/>
      </g>
    `;
  }

  // `short` / `fade` / `buzz`: neat temple sideburns under helmet rim
  const sw = style === 'buzz' ? 2.0 : 3.2;
  return `
    <g data-skater-layer="hair-front-short">
      <line x1="${cx - 23}" y1="57" x2="${cx - 22}" y2="67" stroke="${cfg.hairColor}" stroke-width="${sw}" stroke-linecap="round"/>
      <line x1="${cx + 23}" y1="57" x2="${cx + 22}" y2="67" stroke="${cfg.hairColor}" stroke-width="${sw}" stroke-linecap="round"/>
    </g>
  `;
}

function renderHairUnderHelmetBack(uid, cfg, cx) {
  const hFill = `url(#${uid}_hair)`;
  const hDark = adjustHex(cfg.hairColor, -45, '#0f172a');
  const style = cfg.hairStyle;

  if (style === 'ponytail') {
    return `
      <g data-skater-layer="hair-back-ponytail">
        <!-- Gathered nape hair under rear helmet rim + full flowing ponytail -->
        <path d="M ${cx - 18} 62 Q ${cx} 70 ${cx + 18} 62 L ${cx + 14} 73 Q ${cx} 77 ${cx - 14} 73 Z" fill="${hFill}" stroke="${hDark}" stroke-width="1.1"/>
        <rect x="${cx - 6}" y="68" width="12" height="4.8" rx="2.4" fill="${cfg.jerseyAccent}" stroke="#0f172a" stroke-width="0.9"/>
        <path d="M ${cx - 5} 72 C ${cx - 15} 84, ${cx - 12} 102, ${cx - 2} 112 C ${cx + 3} 108, ${cx + 15} 98, ${cx + 6} 72 Z" fill="${hFill}" stroke="${hDark}" stroke-width="1.4"/>
        <path d="M ${cx - 2} 76 C ${cx - 7} 88, ${cx - 5} 99, ${cx - 1} 107" fill="none" stroke="rgba(255,255,255,0.42)" stroke-width="1.5" stroke-linecap="round"/>
      </g>
    `;
  }

  if (style === 'flow') {
    return `
      <g data-skater-layer="hair-back-flow">
        <!-- Full feathered hockey flow fanning out beneath rear helmet bumper -->
        <path d="M ${cx - 24} 60 C ${cx - 32} 72, ${cx - 28} 88, ${cx - 17} 90 C ${cx - 10} 92, ${cx - 4} 93, ${cx} 92 C ${cx + 4} 93, ${cx + 10} 92, ${cx + 17} 90 C ${cx + 28} 88, ${cx + 32} 72, ${cx + 24} 60 Z" fill="${hFill}" stroke="${hDark}" stroke-width="1.3"/>
        <path d="M ${cx - 16} 68 Q ${cx - 20} 80 ${cx - 13} 87 M ${cx} 68 L ${cx} 89 M ${cx + 16} 68 Q ${cx + 20} 80 ${cx + 13} 87" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="1.3" stroke-linecap="round"/>
      </g>
    `;
  }

  if (style === 'curly') {
    return `
      <g data-skater-layer="hair-back-curly" fill="${hFill}" stroke="${hDark}" stroke-width="1.1">
        <circle cx="${cx - 19}" cy="69" r="6.5"/>
        <circle cx="${cx - 9}" cy="73" r="7"/>
        <circle cx="${cx + 1}" cy="74" r="7.2"/>
        <circle cx="${cx + 11}" cy="73" r="7"/>
        <circle cx="${cx + 19}" cy="69" r="6.5"/>
        <circle cx="${cx - 13}" cy="81" r="5.8"/>
        <circle cx="${cx}" cy="83" r="6.2"/>
        <circle cx="${cx + 13}" cy="81" r="5.8"/>
      </g>
    `;
  }

  if (style === 'braids') {
    return `
      <g data-skater-layer="hair-back-braids" fill="${hFill}" stroke="${hDark}" stroke-width="1.1">
        <path d="M ${cx - 19} 62 Q ${cx} 68 ${cx + 19} 62 L ${cx + 16} 70 L ${cx - 16} 70 Z"/>
        <ellipse cx="${cx - 16}" cy="75" rx="4.5" ry="5.5"/>
        <ellipse cx="${cx - 17}" cy="85" rx="4.2" ry="5.5"/>
        <ellipse cx="${cx - 17}" cy="95" rx="3.8" ry="5"/>
        <rect x="${cx - 20}" y="99" width="6.5" height="3" rx="1.4" fill="${cfg.jerseyAccent}"/>
        <ellipse cx="${cx + 16}" cy="75" rx="4.5" ry="5.5"/>
        <ellipse cx="${cx + 17}" cy="85" rx="4.2" ry="5.5"/>
        <ellipse cx="${cx + 17}" cy="95" rx="3.8" ry="5"/>
        <rect x="${cx + 13.5}" y="99" width="6.5" height="3" rx="1.4" fill="${cfg.jerseyAccent}"/>
      </g>
    `;
  }

  if (style === 'mohawk') {
    return `
      <g data-skater-layer="hair-back-mohawk">
        <path d="M ${cx - 6} 23 L ${cx} 8 L ${cx + 6} 23 Z" fill="${hFill}" stroke="${hDark}" stroke-width="1.2"/>
        <rect x="${cx - 5.5}" y="60" width="11" height="27" rx="5" fill="${hFill}" stroke="${hDark}" stroke-width="1.2"/>
        <line x1="${cx}" y1="62" x2="${cx}" y2="85" stroke="rgba(255,255,255,0.38)" stroke-width="1.4" stroke-linecap="round"/>
      </g>
    `;
  }

  // `short` / `buzz`: tapered fade nape under helmet occipital lock
  return `
    <g data-skater-layer="hair-back-short">
      <path d="M ${cx - 17} 62 L ${cx + 17} 62 L ${cx + 14} 75 Q ${cx} 78 ${cx - 14} 75 Z" fill="${hFill}" opacity="${style === 'buzz' ? '0.68' : '0.95'}" stroke="${hDark}" stroke-width="1"/>
    </g>
  `;
}

function renderVisorLayer(uid, cfg, cx) {
  const st = String(cfg.visorStyle || 'clear-shield');
  if (st.includes('cage')) {
    return `
      <g data-skater-layer="visor-cage">
        <rect x="${cx - 23}" y="47" width="46" height="31" rx="8" fill="rgba(226,232,240,0.08)" stroke="#e2e8f0" stroke-width="1.7"/>
        <line x1="${cx - 23}" y1="56" x2="${cx + 23}" y2="56" stroke="#cbd5e1" stroke-width="1.2"/>
        <line x1="${cx - 22}" y1="65" x2="${cx + 22}" y2="65" stroke="#cbd5e1" stroke-width="1.2"/>
        <line x1="${cx - 10}" y1="47" x2="${cx - 10}" y2="78" stroke="#cbd5e1" stroke-width="1.2"/>
        <line x1="${cx}" y1="47" x2="${cx}" y2="78" stroke="#e2e8f0" stroke-width="1.3"/>
        <line x1="${cx + 10}" y1="47" x2="${cx + 10}" y2="78" stroke="#cbd5e1" stroke-width="1.2"/>
        <rect x="${cx - 10}" y="73" width="20" height="5.5" rx="2.5" fill="#f8fafc" stroke="#64748b" stroke-width="0.9"/>
      </g>
    `;
  }

  const isClear = st.includes('clear');
  const isSmoke = st.includes('smoke');
  const isGold = st.includes('gold');
  const opacity = isClear ? '0.38' : (isSmoke ? '0.86' : '0.78');
  const borderStroke = isGold ? '#fef08a' : (isSmoke ? '#64748b' : '#bae6fd');

  return `
    <g data-skater-layer="visor-shield" data-visor-style="${escSvg(st)}">
      <!-- Curved Polycarbonate Hockey Half-Shield -->
      <path d="M ${cx - 25} 45 Q ${cx} 51 ${cx + 25} 45 L ${cx + 23} 62 Q ${cx} 69 ${cx - 23} 62 Z" fill="url(#${uid}_visor)" fill-opacity="${opacity}" stroke="${borderStroke}" stroke-width="1.4"/>
      <!-- Diagonal Specular Arena Light Reflection -->
      <path d="M ${cx - 16} 48 L ${cx - 7} 61 M ${cx - 9} 49 L ${cx - 2} 59" stroke="#ffffff" stroke-width="2.1" stroke-linecap="round" opacity="${isClear ? '0.68' : '0.82'}"/>
      <!-- Side Visor Mounting Clips -->
      <rect x="${cx - 27}" y="46" width="4" height="7" rx="1.5" fill="#cbd5e1" stroke="#0f172a" stroke-width="0.9"/>
      <rect x="${cx + 23}" y="46" width="4" height="7" rx="1.5" fill="#cbd5e1" stroke="#0f172a" stroke-width="0.9"/>
    </g>
  `;
}

function renderSkatesPairSvg(uid, cfg, leftFootX, rightFootX, footY) {
  const runnerGrad = `url(#${uid}_steel)`;
  const bootGrad = `url(#${uid}_boot)`;
  return `
    <g data-skater-layer="skates" data-skates-id="${escSvg(cfg.skatesId)}">
      <!-- Left Skate (Quarter Package, Tendon Guard, White Felt Tongue, Tuuk Holder & Smooth Hockey Steel — ZERO Toe Picks!) -->
      <g transform="translate(${leftFootX}, ${footY})">
        <rect x="-8" y="-12" width="5.5" height="12" rx="2" fill="${cfg.skateBootAccent}" stroke="#020617" stroke-width="1"/>
        <path d="M -9 -3 L 9 -3 L 16 14 Q 18 19 13 21 L -12 21 Q -15 16 -9 -3 Z" fill="${bootGrad}" stroke="${cfg.skateBootAccent}" stroke-width="1.4"/>
        <!-- White Felt Tongue & Laces -->
        <path d="M -3 -5 Q 2 -7 6 -3 L 9 11 L -2 11 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.9"/>
        <line x1="-2" y1="1" x2="7" y2="1" stroke="#cbd5e1" stroke-width="1.4"/>
        <line x1="-1" y1="5" x2="8" y2="5" stroke="#cbd5e1" stroke-width="1.4"/>
        <line x1="0" y1="9" x2="9" y2="9" stroke="#cbd5e1" stroke-width="1.4"/>
        <!-- White Dual-Cutout Blade Holder -->
        <path d="M -11 21 L 14 21 L 12 28 L -9 28 Z" fill="#f8fafc" stroke="#64748b" stroke-width="1"/>
        <ellipse cx="-3" cy="24.5" rx="3.2" ry="1.6" fill="#090d16"/>
        <ellipse cx="6" cy="24.5" rx="3.2" ry="1.6" fill="#090d16"/>
        <!-- Radiused Pro Hockey Steel Runner -->
        <rect x="-14" y="28" width="30" height="3.8" rx="1.9" fill="${runnerGrad}" stroke="#475569" stroke-width="0.7"/>
      </g>

      <!-- Right Skate -->
      <g transform="translate(${rightFootX}, ${footY})">
        <rect x="2.5" y="-12" width="5.5" height="12" rx="2" fill="${cfg.skateBootAccent}" stroke="#020617" stroke-width="1"/>
        <path d="M -9 -3 L 9 -3 L 12 21 L -13 21 Q -18 19 -16 14 Z" fill="${bootGrad}" stroke="${cfg.skateBootAccent}" stroke-width="1.4"/>
        <path d="M -6 -3 Q -2 -7 3 -5 L 2 11 L -9 11 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.9"/>
        <line x1="-7" y1="1" x2="2" y2="1" stroke="#cbd5e1" stroke-width="1.4"/>
        <line x1="-8" y1="5" x2="1" y2="5" stroke="#cbd5e1" stroke-width="1.4"/>
        <line x1="-9" y1="9" x2="0" y2="9" stroke="#cbd5e1" stroke-width="1.4"/>
        <path d="M -14 21 L 11 21 L 9 28 L -12 28 Z" fill="#f8fafc" stroke="#64748b" stroke-width="1"/>
        <ellipse cx="-6" cy="24.5" rx="3.2" ry="1.6" fill="#090d16"/>
        <ellipse cx="3" cy="24.5" rx="3.2" ry="1.6" fill="#090d16"/>
        <rect x="-16" y="28" width="30" height="3.8" rx="1.9" fill="${runnerGrad}" stroke="#475569" stroke-width="0.7"/>
      </g>
    </g>
  `;
}

/**
 * Pure SVG Markup Builder (`240 x 340` viewBox) for any angle (`0°` Front, `45°` Angled, `180°` Back).
 */
export function buildCustomizableSkaterSvg(rawState = {}, options = {}) {
  const uid = nextSkaterUid();
  const cfg = normalizeSkaterState(rawState, options.previewItem || null);
  const angle = options.angleDeg !== undefined ? Number(options.angleDeg) : 0;
  const view = classifySpinView(angle);
  const cx = 120 + (view.shiftX || 0);

  const skinLight = adjustHex(cfg.skinTone, 24, '#fde68a');
  const skinShadow = adjustHex(cfg.skinTone, -34, '#c2410c');
  const hairLight = adjustHex(cfg.hairColor, 44, '#94a3b8');
  const hairDark = adjustHex(cfg.hairColor, -42, '#0f172a');
  const jerseyLight = adjustHex(cfg.jerseyColor, 38, '#38bdf8');
  const jerseyDark = adjustHex(cfg.jerseyColor, -48, '#0f172a');
  const helmetLight = adjustHex(cfg.helmetColor, 46, '#38bdf8');
  const helmetDark = adjustHex(cfg.helmetColor, -44, '#090d16');
  const glovesLight = adjustHex(cfg.glovesColor, 38, '#38bdf8');
  const glovesDark = adjustHex(cfg.glovesColor, -44, '#090d16');

  const stVisor = String(cfg.visorStyle || '');
  const vStop1 = stVisor.includes('gold')
    ? '#fef08a'
    : (stVisor.includes('smoke') ? '#334155' : (stVisor.includes('clear') ? '#e0f2fe' : '#67e8f9'));
  const vStop2 = stVisor.includes('gold')
    ? '#ca8a04'
    : (stVisor.includes('smoke') ? '#020617' : (stVisor.includes('clear') ? '#7dd3fc' : cfg.visorColor));

  const jNumStr = cfg.jerseyNumber !== '' ? cfg.jerseyNumber : '';
  const numTextFill = luminance(cfg.jerseyColor) > 0.68 ? '#0f172a' : '#ffffff';
  const numOutline = luminance(cfg.jerseyColor) > 0.68 ? '#ffffff' : cfg.jerseyAccent;
  const nameLen = cfg.backNameplate.length;
  const nameFontSize = nameLen >= 11 ? 9.2 : (nameLen >= 8 ? 10.6 : 11.8);
  const tapeStripeCol = (cfg.bladeTapeColor === '#0f172a' || cfg.bladeTapeColor === '#111827') ? '#475569' : '#cbd5e1';

  const defsMarkup = `
    <defs>
      <radialGradient id="${uid}_skin" cx="45%" cy="38%" r="62%">
        <stop offset="0%" stop-color="${skinLight}"/>
        <stop offset="65%" stop-color="${cfg.skinTone}"/>
        <stop offset="100%" stop-color="${skinShadow}"/>
      </radialGradient>
      <linearGradient id="${uid}_hair" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${hairLight}"/>
        <stop offset="52%" stop-color="${cfg.hairColor}"/>
        <stop offset="100%" stop-color="${hairDark}"/>
      </linearGradient>
      <linearGradient id="${uid}_jersey" x1="12%" y1="0%" x2="88%" y2="100%">
        <stop offset="0%" stop-color="${jerseyLight}"/>
        <stop offset="48%" stop-color="${cfg.jerseyColor}"/>
        <stop offset="100%" stop-color="${jerseyDark}"/>
      </linearGradient>
      <linearGradient id="${uid}_helmet" x1="20%" y1="0%" x2="85%" y2="100%">
        <stop offset="0%" stop-color="${helmetLight}"/>
        <stop offset="52%" stop-color="${cfg.helmetColor}"/>
        <stop offset="100%" stop-color="${helmetDark}"/>
      </linearGradient>
      <linearGradient id="${uid}_visor" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${vStop1}"/>
        <stop offset="58%" stop-color="${vStop2}"/>
        <stop offset="100%" stop-color="#090d16"/>
      </linearGradient>
      <linearGradient id="${uid}_gloves" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${glovesLight}"/>
        <stop offset="55%" stop-color="${cfg.glovesColor}"/>
        <stop offset="100%" stop-color="${glovesDark}"/>
      </linearGradient>
      <linearGradient id="${uid}_boot" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="50%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>
      <linearGradient id="${uid}_steel" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${adjustHex(cfg.steelColor, -30, '#64748b')}"/>
        <stop offset="50%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="${cfg.steelColor}"/>
      </linearGradient>
      <pattern id="${uid}_carbon" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
        <rect width="5" height="5" fill="#0b1120"/>
        <path d="M0 2.5 H5 M2.5 0 V5" stroke="rgba(255,255,255,0.16)" stroke-width="0.8"/>
      </pattern>
    </defs>
  `;

  // Ground ice/stall shadow
  const shadowMarkup = `
    <ellipse cx="120" cy="322" rx="68" ry="10" fill="rgba(2,6,23,0.68)"/>
    <ellipse cx="120" cy="322" rx="46" ry="5.5" fill="${cfg.jerseyColor}" opacity="0.22"/>
  `;

  let bodyMarkup = '';

  if (view.face === 'back') {
    // =======================================================================
    // 180° REAR VIEW — Stitched Upper-Back Nameplate (`TUG BOAT`) + Bold
    // Tackle-Twill `#28` Back Number + Sleeve Numbers + Hair Under Rear Helmet!
    // =======================================================================
    bodyMarkup = `
      <!-- Composite Stick Held Behind/Side in Rear Stance -->
      <g data-skater-layer="stick-back" data-stick-id="${escSvg(cfg.stickId)}">
        <line x1="194" y1="88" x2="62" y2="306" stroke="url(#${uid}_carbon)" stroke-width="7.5" stroke-linecap="round"/>
        <line x1="194" y1="88" x2="62" y2="306" stroke="${cfg.stickColor}" stroke-width="5.2" stroke-linecap="round" opacity="0.88"/>
        <line x1="146" y1="167" x2="122" y2="207" stroke="${cfg.stickAccent}" stroke-width="5.8" stroke-linecap="round"/>
        <path d="M 64 304 Q 44 316 25 309 Q 22 301 33 299 Q 49 302 64 301 Z" fill="#0f172a" stroke="${cfg.stickAccent}" stroke-width="1.4"/>
        <path d="M 50 301 L 31 299.5 L 29 309.5 L 50 311 Z" fill="${cfg.bladeTapeColor}" opacity="0.95"/>
        <line x1="44" y1="300" x2="43" y2="310" stroke="${tapeStripeCol}" stroke-width="1"/>
        <line x1="37" y1="300" x2="36" y2="310" stroke="${tapeStripeCol}" stroke-width="1"/>
      </g>

      <!-- Hockey Socks over Molded Shin Guards -->
      <g data-skater-layer="socks-back">
        <rect x="88" y="236" width="24" height="54" rx="10" fill="url(#${uid}_jersey)" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>
        <rect x="88" y="255" width="24" height="5" fill="${cfg.jerseyAccent}"/>
        <rect x="88" y="262" width="24" height="3.5" fill="#f8fafc"/>
        <rect x="128" y="236" width="24" height="54" rx="10" fill="url(#${uid}_jersey)" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>
        <rect x="128" y="255" width="24" height="5" fill="${cfg.jerseyAccent}"/>
        <rect x="128" y="262" width="24" height="3.5" fill="#f8fafc"/>
      </g>

      <!-- Padded Hockey Breezers (Rear Tailbone Pad & Thigh Shells) -->
      <g data-skater-layer="breezers-back">
        <path d="M 80 186 L 160 186 L 164 240 L 125 240 L 120 222 L 115 240 L 76 240 Z" fill="${cfg.breezerColor}" stroke="#334155" stroke-width="1.4" stroke-linejoin="round"/>
        <rect x="112" y="188" width="16" height="24" rx="5" fill="#1e293b" stroke="#475569" stroke-width="1"/>
        <line x1="80" y1="232" x2="115" y2="232" stroke="${cfg.jerseyAccent}" stroke-width="2.5"/>
        <line x1="125" y1="232" x2="160" y2="232" stroke="${cfg.jerseyAccent}" stroke-width="2.5"/>
      </g>

      <!-- Rear Pro Hockey Sweater with Shoulder Yoke, Sleeve Numbers, Stitched Nameplate & Tackle-Twill Back Number -->
      <g data-skater-layer="jersey-back">
        <path d="M 82 94 Q 120 86 158 94 L 188 122 L 178 175 L 160 168 L 160 198 Q 120 203 80 198 L 80 168 L 62 175 L 52 122 Z" fill="url(#${uid}_jersey)" stroke="rgba(255,255,255,0.28)" stroke-width="1.4" stroke-linejoin="round"/>
        <!-- Stitched Rear Shoulder Yoke -->
        <path d="M 82 94 Q 120 86 158 94 L 180 115 Q 120 112 60 115 Z" fill="${jerseyDark}" opacity="0.58" stroke="${cfg.jerseyAccent}" stroke-width="1.2"/>
        <!-- Cloth Fold Shading Lines -->
        <path d="M 90 142 Q 94 168 88 192 M 150 142 Q 146 168 152 192" fill="none" stroke="rgba(2,6,23,0.34)" stroke-width="2.2" stroke-linecap="round"/>
        <!-- Sleeve Stripes & Sleeve Numbers -->
        <polygon points="56,149 78,145 79,153 58,157" fill="${cfg.jerseyAccent}"/>
        <polygon points="58,158 79,154 80,159 59,163" fill="#f8fafc"/>
        <polygon points="184,149 162,145 161,153 182,157" fill="${cfg.jerseyAccent}"/>
        <polygon points="182,158 161,154 160,159 181,163" fill="#f8fafc"/>
        ${jNumStr ? `
          <text x="68" y="138" fill="${numTextFill}" stroke="${numOutline}" stroke-width="0.6" font-size="11" font-weight="900" text-anchor="middle">${escSvg(jNumStr)}</text>
          <text x="172" y="138" fill="${numTextFill}" stroke="${numOutline}" stroke-width="0.6" font-size="11" font-weight="900" text-anchor="middle">${escSvg(jNumStr)}</text>
        ` : ''}
        <!-- Double Hem Stripes -->
        <rect x="80" y="182" width="80" height="5.5" fill="${cfg.jerseyAccent}"/>
        <rect x="80" y="189" width="80" height="3.5" fill="#f8fafc" opacity="0.92"/>

        <!-- STITCHED UPPER-BACK NAMEPLATE BAR -->
        <rect x="78" y="110" width="84" height="17" rx="3.5" fill="rgba(9,13,22,0.82)" stroke="${cfg.jerseyAccent}" stroke-width="1.3"/>
        <rect x="80" y="112" width="80" height="13" rx="2.5" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.8" stroke-dasharray="3 2"/>
        <text x="120" y="122.5" data-skater-layer="back-nameplate" fill="#ffffff" font-family="Inter, Impact, Segoe UI, sans-serif" font-size="${nameFontSize}" font-weight="900" letter-spacing="0.8" text-anchor="middle">${escSvg(cfg.backNameplate)}</text>

        <!-- BOLD TACKLE-TWILL BACK JERSEY NUMBER -->
        ${jNumStr ? `
          <text x="120" y="172" data-skater-layer="back-number" fill="${numTextFill}" stroke="${numOutline}" stroke-width="2.4" paint-order="stroke fill" font-family="Impact, Inter, Arial Black, sans-serif" font-size="44" font-weight="900" letter-spacing="1" text-anchor="middle">${escSvg(jNumStr)}</text>
        ` : ''}
      </g>

      <!-- Pro Hockey Gloves at Sleeve Cuffs -->
      <g data-skater-layer="gloves-back" data-gloves-id="${escSvg(cfg.glovesId)}">
        <rect x="49" y="168" width="21" height="12" rx="4" fill="url(#${uid}_gloves)" stroke="${cfg.glovesAccent}" stroke-width="1.3" transform="rotate(10 59 174)"/>
        <rect x="50" y="179" width="18" height="13" rx="5" fill="url(#${uid}_gloves)" stroke="rgba(255,255,255,0.4)" stroke-width="1" transform="rotate(10 59 185)"/>
        <rect x="170" y="166" width="21" height="12" rx="4" fill="url(#${uid}_gloves)" stroke="${cfg.glovesAccent}" stroke-width="1.3" transform="rotate(-12 180 172)"/>
        <rect x="172" y="177" width="18" height="13" rx="5" fill="url(#${uid}_gloves)" stroke="rgba(255,255,255,0.4)" stroke-width="1" transform="rotate(-12 180 183)"/>
      </g>

      <!-- Shaded Neck & Ears Visible Above Collar -->
      <g data-skater-layer="skin-back">
        <rect x="${cx - 11}" y="70" width="22" height="22" rx="7" fill="url(#${uid}_skin)"/>
        <ellipse cx="${cx - 25}" cy="56" rx="4" ry="6.5" fill="url(#${uid}_skin)"/>
        <ellipse cx="${cx + 25}" cy="56" rx="4" ry="6.5" fill="url(#${uid}_skin)"/>
      </g>

      <!-- Rear Pro Helmet Shell + Bumper Number Decal (#28) -->
      <g data-skater-layer="helmet-back" data-helmet-id="${escSvg(cfg.helmetId)}">
        <path d="M ${cx - 27} 56 C ${cx - 29} 20, ${cx + 29} 20, ${cx + 27} 56 L ${cx + 23} 65 Q ${cx} 69 ${cx - 23} 65 Z" fill="url(#${uid}_helmet)" stroke="rgba(255,255,255,0.34)" stroke-width="1.4"/>
        <path d="M ${cx - 14} 28 Q ${cx} 23 ${cx + 14} 28" fill="none" stroke="rgba(255,255,255,0.42)" stroke-width="2" stroke-linecap="round"/>
        <rect x="${cx - 15}" y="35" width="9" height="4" rx="2" fill="#020617"/>
        <rect x="${cx + 6}" y="35" width="9" height="4" rx="2" fill="#020617"/>
        <!-- Rear Helmet Bumper Number Decal (#28) -->
        <rect x="${cx - 12}" y="49" width="24" height="11" rx="3" fill="#090d16" stroke="${cfg.jerseyAccent}" stroke-width="1"/>
        <text x="${cx}" y="57.2" data-skater-layer="helmet-number-decal" fill="#f8fafc" font-size="8.2" font-weight="900" text-anchor="middle">${jNumStr ? `#${escSvg(jNumStr)}` : 'PRO'}</text>
      </g>

      <!-- Styled Hair Extending Naturally From Beneath Rear Helmet Rim -->
      ${renderHairUnderHelmetBack(uid, cfg, cx)}

      <!-- Pro Hockey Skates -->
      ${renderSkatesPairSvg(uid, cfg, 100, 140, 286)}
    `;
  } else {
    // =======================================================================
    // FRONT (0°) & ANGLED 3/4 (45°) VIEWS — Full Layered Skater & Live Gear!
    // =======================================================================
    const isAngled = view.face === 'angled';
    const skewTorso = isAngled ? `transform="translate(${view.dir * 3}, 0)"` : '';

    bodyMarkup = `
      <!-- Hair Behind Neck / Shoulders (Rendered Behind Jersey Collar & Helmet) -->
      ${renderHairUnderHelmetFront(uid, cfg, cx)}

      <!-- Hockey Socks over Anatomically Contoured Shin Pads -->
      <g data-skater-layer="socks-front">
        <rect x="88" y="236" width="24" height="54" rx="10" fill="url(#${uid}_jersey)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
        <ellipse cx="100" cy="244" rx="11" ry="9" fill="rgba(255,255,255,0.12)"/>
        <rect x="88" y="256" width="24" height="5" fill="${cfg.jerseyAccent}"/>
        <rect x="88" y="263" width="24" height="3.5" fill="#f8fafc"/>

        <rect x="128" y="236" width="24" height="54" rx="10" fill="url(#${uid}_jersey)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
        <ellipse cx="140" cy="244" rx="11" ry="9" fill="rgba(255,255,255,0.12)"/>
        <rect x="128" y="256" width="24" height="5" fill="${cfg.jerseyAccent}"/>
        <rect x="128" y="263" width="24" height="3.5" fill="#f8fafc"/>
      </g>

      <!-- Padded Hockey Breezers (Pants) with Waist Belt & Thigh Pads -->
      <g data-skater-layer="breezers-front">
        <path d="M 80 186 L 160 186 L 164 240 L 125 240 L 120 220 L 115 240 L 76 240 Z" fill="${cfg.breezerColor}" stroke="#334155" stroke-width="1.4" stroke-linejoin="round"/>
        <rect x="83" y="198" width="28" height="28" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(148,163,184,0.22)" stroke-width="0.9"/>
        <rect x="129" y="198" width="28" height="28" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(148,163,184,0.22)" stroke-width="0.9"/>
        <line x1="78" y1="232" x2="115" y2="232" stroke="${cfg.jerseyAccent}" stroke-width="2.5"/>
        <line x1="125" y1="232" x2="162" y2="232" stroke="${cfg.jerseyAccent}" stroke-width="2.5"/>
      </g>

      <!-- Front / 3/4 Hockey Sweater with Cloth Folds, Shoulder Yokes, Laced Collar, Sleeve Numbers & Team Crest -->
      <g data-skater-layer="jersey-front" ${skewTorso}>
        <path d="M 82 94 L 103 90 L 137 90 L 158 94 L 190 124 L 178 176 L 160 168 L 160 198 Q 120 204 80 198 L 80 168 L 62 176 L 50 124 Z" fill="url(#${uid}_jersey)" stroke="rgba(255,255,255,0.3)" stroke-width="1.4" stroke-linejoin="round"/>
        <!-- Stitched Shoulder Yokes -->
        <path d="M 82 94 L 103 90 L 108 103 L 62 114 Z" fill="${jerseyDark}" opacity="0.6" stroke="${cfg.jerseyAccent}" stroke-width="1.1"/>
        <path d="M 158 94 L 137 90 L 132 103 L 178 114 Z" fill="${jerseyDark}" opacity="0.6" stroke="${cfg.jerseyAccent}" stroke-width="1.1"/>
        <!-- Cloth Fold Highlights & Underarm Creases -->
        <path d="M 88 132 Q 95 160 88 184 M 152 132 Q 145 160 152 184" fill="none" stroke="rgba(2,6,23,0.32)" stroke-width="2" stroke-linecap="round"/>
        <!-- NHL Pentagon Collar & Crisscrossed White Skate Laces -->
        <polygon points="105,90 135,90 126,109 114,109" fill="#090d16" stroke="#f8fafc" stroke-width="1.2"/>
        <line x1="114" y1="96" x2="126" y2="99" stroke="#f8fafc" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="126" y1="96" x2="114" y2="99" stroke="#f8fafc" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="115" y1="102" x2="125" y2="105" stroke="#f8fafc" stroke-width="1.5" stroke-linecap="round"/>

        <!-- Sleeve Stripes & Sleeve Numbers -->
        <polygon points="55,148 78,144 79,151 57,155" fill="${cfg.jerseyAccent}"/>
        <polygon points="57,156 79,152 80,157 58,161" fill="#f8fafc"/>
        <polygon points="185,148 162,144 161,151 183,155" fill="${cfg.jerseyAccent}"/>
        <polygon points="183,156 161,152 160,157 182,161" fill="#f8fafc"/>
        ${jNumStr ? `
          <text x="67" y="137" fill="${numTextFill}" font-size="10.5" font-weight="900" text-anchor="middle">${escSvg(jNumStr)}</text>
          <text x="173" y="137" fill="${numTextFill}" font-size="10.5" font-weight="900" text-anchor="middle">${escSvg(jNumStr)}</text>
        ` : ''}

        <!-- Double Sweater Hem Stripes -->
        <rect x="80" y="182" width="80" height="5.5" fill="${cfg.jerseyAccent}"/>
        <rect x="80" y="189" width="80" height="3.5" fill="#f8fafc" opacity="0.92"/>

        <!-- Stitched Championship Front Shield Crest + Captain/Chest Number -->
        <polygon points="120,115 141,123 136,151 120,162 104,151 99,123" fill="#090d16" stroke="${cfg.jerseyAccent}" stroke-width="2"/>
        <polygon points="120,119 137,126 133,148 120,157 107,148 103,126" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.9"/>
        <text x="120" y="144" data-skater-layer="front-crest-number" fill="#ffffff" font-family="Impact, Inter, sans-serif" font-size="19" font-weight="900" text-anchor="middle">${escSvg(jNumStr || 'S')}</text>
        ${jNumStr ? `<text x="147" y="114" fill="${numTextFill}" font-size="9.5" font-weight="900" text-anchor="middle">#${escSvg(jNumStr)}</text>` : ''}
      </g>

      <!-- Shaded Neck, Jawline, Ears, Eyes & Facial Definition -->
      <g data-skater-layer="skin-front" data-skin-tone="${escSvg(cfg.skinTone)}">
        <!-- Neck & Clavicle Shadow -->
        <rect x="${cx - 10}" y="74" width="20" height="19" rx="7" fill="url(#${uid}_skin)"/>
        <path d="M ${cx - 10} 79 Q ${cx} 86 ${cx + 10} 79" fill="none" stroke="${skinShadow}" stroke-width="2" opacity="0.55"/>
        <!-- Ears -->
        <ellipse cx="${cx - 24}" cy="57" rx="4" ry="6.5" fill="url(#${uid}_skin)" stroke="${skinShadow}" stroke-width="0.7"/>
        <ellipse cx="${cx + 24}" cy="57" rx="4" ry="6.5" fill="url(#${uid}_skin)" stroke="${skinShadow}" stroke-width="0.7"/>
        <!-- Sculpted Athletic Face & Jaw -->
        <path d="M ${cx - 22} 44 C ${cx - 23} 67, ${cx - 13} 80, ${cx} 81 C ${cx + 13} 80, ${cx + 23} 67, ${cx + 22} 44 Z" fill="url(#${uid}_skin)" stroke="${skinShadow}" stroke-width="0.9"/>
        <!-- Eyebrows, Focused Eyes, Nose Bridge Highlight & Confident Game-Face Grin -->
        <path d="M ${cx - 14} 51 Q ${cx - 9} 49 ${cx - 5} 51 M ${cx + 5} 51 Q ${cx + 9} 49 ${cx + 14} 51" fill="none" stroke="${hairDark}" stroke-width="2" stroke-linecap="round"/>
        <ellipse cx="${cx - 9.5}" cy="55.5" rx="3.1" ry="2.2" fill="#ffffff"/>
        <circle cx="${cx - 9.2}" cy="55.5" r="1.6" fill="#0f172a"/>
        <circle cx="${cx - 9.8}" cy="54.9" r="0.6" fill="#ffffff"/>
        <ellipse cx="${cx + 9.5}" cy="55.5" rx="3.1" ry="2.2" fill="#ffffff"/>
        <circle cx="${cx + 9.2}" cy="55.5" r="1.6" fill="#0f172a"/>
        <circle cx="${cx + 8.8}" cy="54.9" r="0.6" fill="#ffffff"/>
        <path d="M ${cx} 55 L ${cx - 1.5} 63.5 Q ${cx} 65 ${cx + 2} 63.5" fill="none" stroke="${skinShadow}" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M ${cx - 6.5} 69.5 Q ${cx} 73.5 ${cx + 6.5} 69.5" fill="none" stroke="#7c2d12" stroke-width="1.7" stroke-linecap="round"/>
        <path d="M ${cx - 4.5} 70.2 Q ${cx} 72.2 ${cx + 4.5} 70.2" fill="none" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round"/>
      </g>

      <!-- Pro Hockey Helmet Shell + Chin Strap + Dynamic Visor Shield -->
      <g data-skater-layer="helmet-front" data-helmet-id="${escSvg(cfg.helmetId)}">
        <!-- Helmet Dome & Brow Rim -->
        <path d="M ${cx - 26} 48 C ${cx - 28} 16, ${cx + 28} 16, ${cx + 26} 48 Q ${cx} 43 ${cx - 26} 48 Z" fill="url(#${uid}_helmet)" stroke="rgba(255,255,255,0.36)" stroke-width="1.4"/>
        <!-- Specular Dome Sheen & Aero Vents -->
        <path d="M ${cx - 15} 26 Q ${cx} 20 ${cx + 15} 26" fill="none" stroke="rgba(255,255,255,0.48)" stroke-width="2.2" stroke-linecap="round"/>
        <rect x="${cx - 15}" y="30" width="9.5" height="4" rx="2" fill="#020617" stroke="rgba(255,255,255,0.22)" stroke-width="0.7"/>
        <rect x="${cx + 5.5}" y="30" width="9.5" height="4" rx="2" fill="#020617" stroke="rgba(255,255,255,0.22)" stroke-width="0.7"/>
        <!-- Chin Strap -->
        <path d="M ${cx - 22} 60 Q ${cx} 84 ${cx + 22} 60" fill="none" stroke="#cbd5e1" stroke-width="1.2" opacity="0.8"/>
      </g>

      <!-- Equipped Visor / Shield Layer -->
      ${renderVisorLayer(uid, cfg, cx)}

      <!-- Pro Hockey Skates -->
      ${renderSkatesPairSvg(uid, cfg, 100, 140, 286)}

      <!-- Composite Hockey Stick Held Naturally Across Body onto Ice -->
      <g data-skater-layer="stick-front" data-stick-id="${escSvg(cfg.stickId)}">
        <!-- Butt-end tape -->
        <line x1="42" y1="130" x2="48" y2="140" stroke="${cfg.bladeTapeColor}" stroke-width="8.5" stroke-linecap="round"/>
        <!-- 18K Carbon Weave Shaft + Colorway + Kick-Point Band -->
        <line x1="44" y1="133" x2="174" y2="309" stroke="url(#${uid}_carbon)" stroke-width="7.8" stroke-linecap="round"/>
        <line x1="44" y1="133" x2="174" y2="309" stroke="${cfg.stickColor}" stroke-width="5.2" stroke-linecap="round" opacity="0.9"/>
        <line x1="98" y1="206" x2="128" y2="247" stroke="${cfg.stickAccent}" stroke-width="6" stroke-linecap="round"/>
        <line x1="50" y1="141" x2="168" y2="301" stroke="#ffffff" stroke-width="1" stroke-dasharray="2.5 4" opacity="0.45"/>
        <!-- Curved Pro Blade & Cloth Tape Job Resting on Ice -->
        <path d="M 172 307 Q 194 319 216 310 Q 219 301 206 299 Q 189 303 172 304 Z" fill="#090d16" stroke="${cfg.stickAccent}" stroke-width="1.5"/>
        <path d="M 186 303 L 209 300 L 211 310.5 L 186 313 Z" fill="${cfg.bladeTapeColor}" opacity="0.96"/>
        <line x1="192" y1="302" x2="192" y2="312" stroke="${tapeStripeCol}" stroke-width="1"/>
        <line x1="198" y1="301" x2="198" y2="311.5" stroke="${tapeStripeCol}" stroke-width="1"/>
        <line x1="204" y1="300.5" x2="204" y2="311" stroke="${tapeStripeCol}" stroke-width="1"/>
      </g>

      <!-- Segmented 4-Roll / Pro-Taper Hockey Gloves Gripping the Stick -->
      <g data-skater-layer="gloves-front" data-gloves-id="${escSvg(cfg.glovesId)}" data-gloves-style="${escSvg(cfg.glovesStyle)}">
        <!-- Top Hand Glove (Left Arm Gripping Upper Shaft) -->
        <g transform="translate(59, 166) rotate(-18)">
          <rect x="-12" y="-8" width="24" height="9" rx="3" fill="url(#${uid}_gloves)" stroke="${cfg.glovesAccent}" stroke-width="1.3"/>
          <rect x="-11" y="2" width="22" height="5" rx="2.4" fill="url(#${uid}_gloves)" stroke="rgba(255,255,255,0.45)" stroke-width="0.9"/>
          <rect x="-11" y="8" width="22" height="5" rx="2.4" fill="url(#${uid}_gloves)" stroke="rgba(255,255,255,0.4)" stroke-width="0.9"/>
          <rect x="-10" y="14" width="20" height="5.5" rx="2.5" fill="url(#${uid}_gloves)" stroke="${cfg.glovesAccent}" stroke-width="1"/>
          <ellipse cx="9" cy="9" rx="4.2" ry="6.5" fill="${cfg.glovesAccent}" stroke="#090d16" stroke-width="1"/>
        </g>
        <!-- Bottom Hand Glove (Right Arm Gripping Mid-Shaft) -->
        <g transform="translate(154, 186) rotate(22)">
          <rect x="-12" y="-10" width="24" height="9" rx="3" fill="url(#${uid}_gloves)" stroke="${cfg.glovesAccent}" stroke-width="1.3"/>
          <rect x="-11" y="0" width="22" height="5" rx="2.4" fill="url(#${uid}_gloves)" stroke="rgba(255,255,255,0.45)" stroke-width="0.9"/>
          <rect x="-11" y="6" width="22" height="5" rx="2.4" fill="url(#${uid}_gloves)" stroke="rgba(255,255,255,0.4)" stroke-width="0.9"/>
          <rect x="-10" y="12" width="20" height="5.5" rx="2.5" fill="url(#${uid}_gloves)" stroke="${cfg.glovesAccent}" stroke-width="1"/>
          <ellipse cx="-9" cy="8" rx="4.2" ry="6.5" fill="${cfg.glovesAccent}" stroke="#090d16" stroke-width="1"/>
        </g>
      </g>
    `;
  }

  // Sync window._lastRenderedYoungPlayerAvatar for full telemetry/QA introspection
  if (typeof window !== 'undefined') {
    window._lastRenderedYoungPlayerAvatar = {
      style: 'v151-live-360-layered-svg',
      profileId: cfg.profileId,
      name: cfg.name,
      backNameplate: cfg.backNameplate,
      hairStyle: cfg.hairStyle,
      hairColor: cfg.hairColor,
      skinTone: cfg.skinTone,
      jerseyNumber: cfg.jerseyNumber,
      jerseyColor: cfg.jerseyColor,
      jerseyAccent: cfg.jerseyAccent,
      glovesId: cfg.glovesId,
      glovesColor: cfg.glovesColor,
      glovesStyle: cfg.glovesStyle,
      stickId: cfg.stickId,
      stickColor: cfg.stickColor,
      bladeTapeColor: cfg.bladeTapeColor,
      helmetColor: cfg.helmetColor,
      visorId: cfg.visorId,
      visorColor: cfg.visorColor,
      visorStyle: cfg.visorStyle,
      skatesId: cfg.skatesId,
      skateStyle: cfg.skateStyle,
      steelColor: cfg.steelColor,
      angleDeg: view.normAngle,
      viewFace: view.face
    };
  }

  const heightCls = options.svgClass || 'w-full h-full max-h-full object-contain select-none';

  return `
    <svg
      viewBox="0 0 240 340"
      role="img"
      aria-label="${escSvg(cfg.name)}${jNumStr ? ` #${escSvg(jNumStr)}` : ''} 360 Hockey Skater (${view.face})"
      data-skater-renderer="v151-live-360"
      data-view-angle="${Math.round(view.normAngle)}"
      data-view-face="${view.face}"
      data-skin-tone="${escSvg(cfg.skinTone)}"
      data-hair-style="${escSvg(cfg.hairStyle)}"
      data-hair-color="${escSvg(cfg.hairColor)}"
      data-jersey-color="${escSvg(cfg.jerseyColor)}"
      data-jersey-number="${escSvg(jNumStr)}"
      data-back-nameplate="${escSvg(cfg.backNameplate)}"
      data-stick-id="${escSvg(cfg.stickId)}"
      data-gloves-id="${escSvg(cfg.glovesId)}"
      data-visor-id="${escSvg(cfg.visorId)}"
      data-skates-id="${escSvg(cfg.skatesId)}"
      class="${heightCls}"
    >
      ${defsMarkup}
      ${shadowMarkup}
      ${bodyMarkup}
    </svg>
  `;
}

/**
 * Compact circular headshot badge (for leaderboards, friend rows, report headers — zero static PNGs).
 */
export function buildMiniSkaterHeadSvg(rawState = {}, sizePx = 36) {
  const uid = nextSkaterUid();
  const cfg = normalizeSkaterState(rawState);
  const s = Math.max(24, Number(sizePx) || 36);
  const skinLight = adjustHex(cfg.skinTone, 22, '#fde68a');
  const helmetLight = adjustHex(cfg.helmetColor, 40, '#38bdf8');
  return `
    <span class="inline-flex items-center justify-center rounded-full overflow-hidden bg-slate-950 shrink-0 shadow-md" style="width:${s}px;height:${s}px;border:2px solid ${escSvg(cfg.jerseyColor)};" data-mini-skater-360="${escSvg(cfg.profileId)}">
      <svg viewBox="68 14 104 104" width="${s}" height="${s}" aria-hidden="true">
        <defs>
          <radialGradient id="${uid}_mskin" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stop-color="${skinLight}"/>
            <stop offset="100%" stop-color="${cfg.skinTone}"/>
          </radialGradient>
          <linearGradient id="${uid}_mhelm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${helmetLight}"/>
            <stop offset="100%" stop-color="${cfg.helmetColor}"/>
          </linearGradient>
        </defs>
        <path d="M 80 96 L 160 96 L 174 122 L 66 122 Z" fill="${cfg.jerseyColor}"/>
        ${cfg.hairStyle === 'ponytail' || cfg.hairStyle === 'flow' || cfg.hairStyle === 'curly'
          ? `<circle cx="93" cy="70" r="9" fill="${cfg.hairColor}"/><circle cx="147" cy="70" r="9" fill="${cfg.hairColor}"/>`
          : ''}
        <rect x="110" y="75" width="20" height="20" rx="6" fill="url(#${uid}_mskin)"/>
        <path d="M 98 46 C 97 69, 108 81, 120 82 C 132 81, 143 69, 142 46 Z" fill="url(#${uid}_mskin)"/>
        <circle cx="111" cy="56" r="2" fill="#0f172a"/>
        <circle cx="129" cy="56" r="2" fill="#0f172a"/>
        <path d="M 114 69 Q 120 73 126 69" fill="none" stroke="#7c2d12" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M 94 49 C 92 18, 148 18, 146 49 Q 120 44 94 49 Z" fill="url(#${uid}_mhelm)"/>
        <path d="M 96 46 Q 120 52 144 46 L 142 61 Q 120 67 98 61 Z" fill="${cfg.visorColor}" fill-opacity="0.52" stroke="#bae6fd" stroke-width="1.2"/>
      </svg>
    </span>
  `;
}

/**
 * Mounts an interactive 360° Customizable Skater into `container` with:
 *   - Live horizontal pointer/touch/mouse drag-to-spin (`0° <-> 45° <-> 180°`)
 *   - Optional built-in `🔄 Spin 360° (Front / Back)` button (`options.showSpinButton`)
 *   - Smooth turn transition + `options.onAngleChange(nextAngle)` callback
 */
export function renderCustomizableSkater(container, skaterState = {}, options = {}) {
  const el = typeof container === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(container) : null)
    : container;

  const initialAngle = Number.isFinite(Number(options.angleDeg)) ? Number(options.angleDeg) : 0;
  const svgHtml = buildCustomizableSkaterSvg(skaterState, { ...options, angleDeg: initialAngle });
  if (!el) return svgHtml;

  const showSpinButton = Boolean(options.showSpinButton);
  const spinBtnIdAttr = options.spinButtonId ? `id="${escSvg(options.spinButtonId)}"` : '';
  const view = classifySpinView(initialAngle);
  const angleLabel = view.face === 'back' ? 'Back 180°' : (view.face === 'angled' ? 'Angled 45°' : 'Front 0°');

  el.innerHTML = `
    <div class="synapz-skater-360-stage relative w-full h-full flex flex-col items-center justify-between select-none" data-skater-stage="true" style="touch-action: pan-y;">
      <div class="synapz-skater-360-figure flex-1 min-h-0 w-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-200" data-skater-figure-wrap="true">
        ${svgHtml}
      </div>
      ${showSpinButton ? `
        <div class="shrink-0 pt-1 flex items-center justify-center gap-1.5 z-30">
          <button ${spinBtnIdAttr} type="button" data-skater-spin-btn="true" class="px-3 py-1 rounded-full bg-slate-950/92 hover:bg-slate-900 border border-cyan-400/75 text-cyan-200 text-[10px] sm:text-[11px] font-black shadow-lg backdrop-blur-md cursor-pointer">
            🔄 Spin 360° (${angleLabel})
          </button>
          <button type="button" data-skater-angle-step="45" title="Angled 45° View" class="px-2 py-1 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-black cursor-pointer">
            45°
          </button>
        </div>
      ` : ''}
    </div>
  `;

  let currentAngle = initialAngle;
  let dragStartX = null;
  let dragStartAngle = 0;
  let didDrag = false;

  const figureWrap = el.querySelector('[data-skater-figure-wrap]');
  const spinBtn = el.querySelector('[data-skater-spin-btn]');
  const step45Btn = el.querySelector('[data-skater-angle-step="45"]');

  const applyAngle = (nextAngle, animateFlip = false) => {
    currentAngle = ((Number(nextAngle) || 0) % 360 + 360) % 360;
    el._skaterWasDragged = true;
    setTimeout(() => { el._skaterWasDragged = false; }, 80);

    if (figureWrap) {
      if (animateFlip) {
        figureWrap.style.transform = 'scaleX(0.86)';
        setTimeout(() => {
          if (figureWrap) figureWrap.style.transform = 'scaleX(1)';
        }, 120);
      }
      figureWrap.innerHTML = buildCustomizableSkaterSvg(skaterState, { ...options, angleDeg: currentAngle });
    }
    if (spinBtn) {
      const v = classifySpinView(currentAngle);
      const lbl = v.face === 'back' ? 'Back 180°' : (v.face === 'angled' ? 'Angled 45°' : 'Front 0°');
      spinBtn.textContent = `🔄 Spin 360° (${lbl})`;
    }
    if (typeof options.onAngleChange === 'function') {
      options.onAngleChange(currentAngle);
    }
  };

  if (spinBtn) {
    spinBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const v = classifySpinView(currentAngle);
      const targetAngle = v.face === 'back' ? 0 : 180;
      applyAngle(targetAngle, true);
    });
  }

  if (step45Btn) {
    step45Btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const v = classifySpinView(currentAngle);
      applyAngle(v.face === 'angled' ? 0 : 45, true);
    });
  }

  if (figureWrap) {
    figureWrap.addEventListener('pointerdown', (ev) => {
      dragStartX = ev.clientX;
      dragStartAngle = currentAngle;
      didDrag = false;
    });
    figureWrap.addEventListener('pointermove', (ev) => {
      if (dragStartX === null) return;
      const dx = ev.clientX - dragStartX;
      if (Math.abs(dx) > 10) {
        didDrag = true;
        const nextA = dragStartAngle + dx * 1.35;
        applyAngle(nextA, false);
      }
    });
    const endDrag = (ev) => {
      if (dragStartX !== null && didDrag) {
        ev.stopPropagation();
      }
      dragStartX = null;
    };
    figureWrap.addEventListener('pointerup', endDrag);
    figureWrap.addEventListener('pointercancel', endDrag);
    figureWrap.addEventListener('click', (ev) => {
      if (didDrag || el._skaterWasDragged) {
        ev.preventDefault();
        ev.stopPropagation();
        didDrag = false;
      }
    }, true);
  }

  return svgHtml;
}

const SynapzSkaterRenderer360 = {
  normalizeSkaterState,
  buildCustomizableSkaterSvg,
  buildMiniSkaterHeadSvg,
  renderCustomizableSkater
};

if (typeof window !== 'undefined') {
  window.SynapzSkaterRenderer360 = SynapzSkaterRenderer360;
  window.renderCustomizableSkater = renderCustomizableSkater;
}

export default SynapzSkaterRenderer360;
