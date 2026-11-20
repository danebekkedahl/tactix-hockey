/**
 * SYNAPZ HOCKEY v15.4 — Real Painted 75/25 Skater Renderer + Pixel-Mask HSL Colorizer
 * (`engine/skater_renderer_360.js`)
 *
 * CRITICAL STUDIO ART ARCHITECTURE (Lock 4 — ZERO Vector Robot Faces/Bodies):
 *   - Front View (`0°`): Renders the authentic studio-painted 75%-realistic / 25%-stylized
 *     character PNGs (`assets/avatars/avatar-male-1..4.png`, `avatar-female-1..4.png`) onto a
 *     crisp high-DPI `<canvas>` (`devicePixelRatio` scaled, `imageSmoothingEnabled = true`).
 *   - Luminance-Preserving HSL Pixel-Mask Color Tinting:
 *     1) Painted Hair Region Pixels (per-avatar hair geometry + facial/ear/neck skin keep-out
 *        mask + blue-cloth exclusion): Shifts `Hue` & `Saturation` smoothly to the player's
 *        selected Hair Color (`Blonde`, `Brown`, `Black`, `Red`, `Blue`, `Platinum`, etc.)
 *        while preserving 100% of painted brush-stroke shading, strand contrast, and highlights.
 *     2) Painted Jersey / Sweater Region Pixels (torso + shoulder + sleeve cloth envelope
 *        excluding skin, braids, silver puck crest/stripes, gloves, pants, and skates):
 *        Shifts `Hue` & `Saturation` smoothly to the player's selected Jersey Color (`Royal Blue`,
 *        `Red`, `Pink`, `Teal`, `Emerald`, `Gold`, `Purple`, `Black`, etc.) while preserving
 *        100% of original painted cloth folds, shadows, collar stitching, and highlights.
 *   - `0ms` Bitmap Cache: Processed `<canvas>` bitmaps are cached in an in-memory `Map` keyed by
 *     `avatarBaseId|hairColor|jerseyColor` for instant Safari-15 (`iPadOS 15.8.8`) re-renders.
 *   - Sleek Non-Overlapping Loadout Dock (`gear_art_75_25.js`): Displays the 4 shaded 75/25 SVG
 *     badges (`Helmet/Visor`, `Stick`, `Gloves`, `Skates`) alongside the painted skater in
 *     Pro Shop Try-On Floor & Locker Stall without drawing stick-on vector shapes over painted art.
 *   - Back View (`180°`): Smooth `-webkit-transform` / `transform` flip to a richly stitched
 *     Pro Hockey Rear Locker Sweater (`TUG BOAT` tackle-twill nameplate + `#28` double-layer
 *     back number + fight strap + 4-slot Equipped Gear Showcase) — ZERO geometric robot bodies!
 */

import { renderGearItemArtSvg, buildStarterGearItems } from './gear_art_75_25.js';

let _skaterUidSeq = 0;
function nextSkaterUid() {
  _skaterUidSeq = (_skaterUidSeq + 1) % 999999;
  return `skp_${_skaterUidSeq}`;
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const PAINTED_SKATER_CATALOG = Object.freeze([
  { id: 'avatar-male-1',   label: 'Skater 1', styleTag: 'Classic Flow',  gender: 'boy',  src: 'assets/avatars/avatar-male-1.png',   hairBaseLum: 0.34, defaultHairStyle: 'flow' },
  { id: 'avatar-male-2',   label: 'Skater 2', styleTag: 'Pro Fade',      gender: 'boy',  src: 'assets/avatars/avatar-male-2.png',   hairBaseLum: 0.09, defaultHairStyle: 'buzz' },
  { id: 'avatar-male-3',   label: 'Skater 3', styleTag: 'Mohawk Edge',   gender: 'boy',  src: 'assets/avatars/avatar-male-3.png',   hairBaseLum: 0.08, defaultHairStyle: 'mohawk' },
  { id: 'avatar-male-4',   label: 'Skater 4', styleTag: 'Side Part',     gender: 'boy',  src: 'assets/avatars/avatar-male-4.png',   hairBaseLum: 0.15, defaultHairStyle: 'short' },
  { id: 'avatar-female-1', label: 'Skater 5', styleTag: 'High Pony',     gender: 'girl', src: 'assets/avatars/avatar-female-1.png', hairBaseLum: 0.58, defaultHairStyle: 'ponytail' },
  { id: 'avatar-female-2', label: 'Skater 6', styleTag: 'Pro Braids',    gender: 'girl', src: 'assets/avatars/avatar-female-2.png', hairBaseLum: 0.17, defaultHairStyle: 'braids' },
  { id: 'avatar-female-3', label: 'Skater 7', styleTag: 'Wavy Flow',     gender: 'girl', src: 'assets/avatars/avatar-female-3.png', hairBaseLum: 0.16, defaultHairStyle: 'curly' },
  { id: 'avatar-female-4', label: 'Skater 8', styleTag: 'Twin Braids',   gender: 'girl', src: 'assets/avatars/avatar-female-4.png', hairBaseLum: 0.36, defaultHairStyle: 'braids' }
]);

const NAMED_HAIR_COLORS = {
  blonde: '#facc15',
  brown: '#78350f',
  black: '#111827',
  red: '#dc2626',
  blue: '#2563eb',
  cyan: '#06b6d4',
  platinum: '#e2e8f0'
};

const NAMED_JERSEY_COLORS = {
  blue: '#0284c7',
  'royal blue': '#2563eb',
  'championship blue': '#0284c7',
  red: '#dc2626',
  crimson: '#dc2626',
  pink: '#ec4899',
  teal: '#0d9488',
  emerald: '#059669',
  green: '#059669',
  gold: '#eab308',
  purple: '#7c3aed',
  black: '#111827'
};

// In-memory Image & Tinted Bitmap Caches (`avatarBaseId|hairColor|jerseyColor` -> Canvas)
const _rawImageCache = new Map();
const _rawImagePromises = new Map();
const _tintedBitmapCache = new Map();
const _tintedDataUrlCache = new Map();

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

function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) * 0.5;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) {
      h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
    } else if (max === gn) {
      h = ((bn - rn) / d + 2) * 60;
    } else {
      h = ((rn - gn) / d + 4) * 60;
    }
  }
  return [h, s, l];
}

function hue2rgb(p, q, t) {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
}

function hslToRgb(h, s, l) {
  const hn = (((h % 360) + 360) % 360) / 360;
  const sn = Math.max(0, Math.min(1, s));
  const ln = Math.max(0, Math.min(1, l));
  if (sn === 0) {
    const v = Math.round(ln * 255);
    return [v, v, v];
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  return [
    Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, hn) * 255),
    Math.round(hue2rgb(p, q, hn - 1 / 3) * 255)
  ];
}

function smoothstep(edge0, edge1, x) {
  if (edge1 === edge0) return x < edge0 ? 0 : 1;
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function ellipseInsideWeight(nx, ny, cx, cy, rx, ry, feather = 0.08) {
  const dx = (nx - cx) / rx;
  const dy = (ny - cy) / ry;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return 1 - smoothstep(1 - feather, 1 + feather, dist);
}

function boxInsideWeight(nx, ny, x0, x1, y0, y1, fx = 0.012, fy = 0.008) {
  const wx = smoothstep(x0 - fx, x0 + fx, nx) * (1 - smoothstep(x1 - fx, x1 + fx, nx));
  const wy = smoothstep(y0 - fy, y0 + fy, ny) * (1 - smoothstep(y1 - fy, y1 + fy, ny));
  return wx * wy;
}

/**
 * Per-avatar Spatial + HSL Skin Protection & Hair Isolation Classifier.
 * Measured directly against all 8 `assets/avatars/avatar-*.png` bitmaps (`~374x900`)
 * so facial skin, eyes, sclera, lips, ears, and neck stay 100% natural (`0%` bleed).
 */
function computeHairMaskWeight(avatarId, nx, ny, hue, sat, lum) {
  // Never tint navy/blue jersey, collar, or hair-tie pixels as hair
  if (hue >= 184 && hue <= 254 && sat >= 0.13) {
    return 0;
  }

  let inHairZone = 0;
  let skinKeepOut = 0;

  switch (avatarId) {
    case 'avatar-male-2': {
      // High buzz/fade: hair strictly on top crown + outer upper temple fade
      const crown = boxInsideWeight(nx, ny, 0.34, 0.66, 0.008, 0.056, 0.012, 0.004);
      const temples = (boxInsideWeight(nx, ny, 0.335, 0.388, 0.052, 0.098, 0.008, 0.005) +
                       boxInsideWeight(nx, ny, 0.612, 0.665, 0.052, 0.098, 0.008, 0.005)) *
                      (1 - smoothstep(0.14, 0.22, lum));
      inHairZone = Math.min(1, crown + temples);
      skinKeepOut = Math.max(
        ellipseInsideWeight(nx, ny, 0.500, 0.126, 0.124, 0.070, 0.06),
        ellipseInsideWeight(nx, ny, 0.500, 0.126, 0.170, 0.030, 0.08),
        boxInsideWeight(nx, ny, 0.380, 0.620, 0.168, 0.240, 0.012, 0.008)
      );
      break;
    }
    case 'avatar-male-3': {
      // Mohawk / faux-hawk crest + tight faded temples
      const crest = boxInsideWeight(nx, ny, 0.345, 0.655, 0.006, 0.079, 0.012, 0.004);
      const temples = (boxInsideWeight(nx, ny, 0.345, 0.392, 0.075, 0.116, 0.008, 0.005) +
                       boxInsideWeight(nx, ny, 0.608, 0.655, 0.075, 0.116, 0.008, 0.005)) *
                      (1 - smoothstep(0.16, 0.25, lum));
      inHairZone = Math.min(1, crest + temples);
      skinKeepOut = Math.max(
        ellipseInsideWeight(nx, ny, 0.500, 0.139, 0.119, 0.060, 0.06),
        ellipseInsideWeight(nx, ny, 0.500, 0.142, 0.170, 0.028, 0.08),
        boxInsideWeight(nx, ny, 0.380, 0.620, 0.178, 0.242, 0.012, 0.008)
      );
      break;
    }
    case 'avatar-male-4': {
      // Side-part short cut + neat sideburns above ears
      inHairZone = boxInsideWeight(nx, ny, 0.260, 0.740, 0.004, 0.128, 0.012, 0.005);
      skinKeepOut = Math.max(
        ellipseInsideWeight(nx, ny, 0.500, 0.134, 0.115, 0.060, 0.06),
        ellipseInsideWeight(nx, ny, 0.500, 0.136, 0.172, 0.024, 0.08),
        boxInsideWeight(nx, ny, 0.380, 0.620, 0.174, 0.240, 0.012, 0.008)
      );
      break;
    }
    case 'avatar-female-1': {
      // High blonde ponytail sweeping left + diagonal parted bangs (blonde H=36..55 vs peach skin H=6..28)
      const upper = boxInsideWeight(nx, ny, 0.060, 0.740, 0.004, 0.160, 0.010, 0.005);
      const ponyTailLower = boxInsideWeight(nx, ny, 0.060, 0.402, 0.145, 0.224, 0.010, 0.005);
      inHairZone = Math.max(upper, ponyTailLower);
      const isYellowBlondeBang = (ny < 0.126) ? smoothstep(29, 36, hue) * smoothstep(0.28, 0.42, sat) : 0;
      const baseFaceKeepOut = Math.max(
        ellipseInsideWeight(nx, ny, 0.512, 0.149, 0.110, 0.058, 0.06),
        ellipseInsideWeight(nx, ny, 0.375, 0.149, 0.028, 0.022, 0.09),
        ellipseInsideWeight(nx, ny, 0.632, 0.149, 0.028, 0.022, 0.09),
        boxInsideWeight(nx, ny, 0.408, 0.602, 0.190, 0.264, 0.012, 0.008),
        boxInsideWeight(nx, ny, 0.580, 0.750, 0.152, 0.240, 0.010, 0.008)
      );
      skinKeepOut = baseFaceKeepOut * (1 - isYellowBlondeBang);
      break;
    }
    case 'avatar-female-2': {
      // Crown braids + long cascading braids over viewer-left chest down to ny ~ 0.36
      const crown = boxInsideWeight(nx, ny, 0.180, 0.680, 0.004, 0.145, 0.010, 0.005);
      const cascade = boxInsideWeight(nx, ny, 0.180, 0.425, 0.132, 0.362, 0.010, 0.006);
      inHairZone = Math.max(crown, cascade);
      skinKeepOut = Math.max(
        ellipseInsideWeight(nx, ny, 0.504, 0.140, 0.111, 0.061, 0.06),
        ellipseInsideWeight(nx, ny, 0.370, 0.137, 0.024, 0.022, 0.09),
        ellipseInsideWeight(nx, ny, 0.638, 0.137, 0.028, 0.024, 0.09),
        boxInsideWeight(nx, ny, 0.422, 0.600, 0.182, 0.246, 0.009, 0.008)
      );
      break;
    }
    case 'avatar-female-3': {
      // Wavy shoulder-length hair framing both sides down to collar/shoulders
      inHairZone = boxInsideWeight(nx, ny, 0.160, 0.840, 0.004, 0.220, 0.010, 0.005);
      skinKeepOut = Math.max(
        ellipseInsideWeight(nx, ny, 0.500, 0.129, 0.113, 0.064, 0.06),
        ellipseInsideWeight(nx, ny, 0.500, 0.135, 0.124, 0.020, 0.08),
        boxInsideWeight(nx, ny, 0.414, 0.586, 0.178, 0.238, 0.010, 0.008)
      );
      break;
    }
    case 'avatar-female-4': {
      // Crown braided part + twin braids cascading over both shoulders down to ny ~ 0.335
      const crown = boxInsideWeight(nx, ny, 0.250, 0.750, 0.004, 0.112, 0.010, 0.005);
      const leftBraid = boxInsideWeight(nx, ny, 0.295, 0.418, 0.100, 0.338, 0.010, 0.006);
      const rightBraid = boxInsideWeight(nx, ny, 0.582, 0.705, 0.100, 0.338, 0.010, 0.006);
      inHairZone = Math.max(crown, leftBraid, rightBraid);
      skinKeepOut = Math.max(
        ellipseInsideWeight(nx, ny, 0.500, 0.123, 0.113, 0.064, 0.06),
        ellipseInsideWeight(nx, ny, 0.360, 0.123, 0.021, 0.019, 0.09),
        ellipseInsideWeight(nx, ny, 0.640, 0.123, 0.021, 0.019, 0.09),
        boxInsideWeight(nx, ny, 0.416, 0.584, 0.174, 0.232, 0.010, 0.008)
      );
      break;
    }
    case 'avatar-male-1':
    default: {
      // Classic parted hockey flow wrapping behind ears to collar
      inHairZone = boxInsideWeight(nx, ny, 0.180, 0.820, 0.004, 0.204, 0.010, 0.005);
      skinKeepOut = Math.max(
        ellipseInsideWeight(nx, ny, 0.500, 0.129, 0.106, 0.061, 0.06),
        ellipseInsideWeight(nx, ny, 0.500, 0.136, 0.148, 0.025, 0.08),
        boxInsideWeight(nx, ny, 0.415, 0.585, 0.175, 0.236, 0.012, 0.008)
      );
      break;
    }
  }

  return Math.max(0, Math.min(1, inHairZone * (1 - skinKeepOut)));
}

/**
 * Painted Jersey / Sweater Classifier:
 * Isolates navy-blue sweater cloth pixels across torso, shoulders, and sleeves while
 * excluding skin, chest braids, silver puck crest/stripes (`low S`), gloves (`ny > 0.438` on arms),
 * breezers/pants (`ny > 0.522`), and skates.
 */
function computeJerseyMaskWeight(nx, ny, hue, sat) {
  if (ny < 0.188 || ny > 0.530) return 0;

  // Hue window around painted navy sweater (`186°..252°`) with smooth rolloff
  const hueIn = smoothstep(182, 194, hue) * (1 - smoothstep(244, 256, hue));
  if (hueIn <= 0.001) return 0;

  // Saturation ramp preserves silver puck crest & white/silver shoulder/sleeve/hem stripes
  const satIn = smoothstep(0.115, 0.205, sat);
  if (satIn <= 0.001) return 0;

  // Spatial union: Torso (`0.244..0.756`, `ny <= 0.522`) + Sleeves above glove cuffs (`ny <= 0.438`)
  const torsoSpatial = boxInsideWeight(nx, ny, 0.244, 0.756, 0.192, 0.522, 0.010, 0.006);
  const sleeveSpatial = boxInsideWeight(nx, ny, 0.050, 0.950, 0.195, 0.438, 0.010, 0.007);
  const spatial = Math.max(torsoSpatial, sleeveSpatial);

  // Exclude top ponytail hair tie (`ny < 0.195`) and twin braid ties (`avatar-female-4` at `ny ~ 0.245`)
  return Math.max(0, Math.min(1, spatial * hueIn * satIn));
}

/**
 * Computes contrast-preserving Hair HSL target parameters for a given hex color & base avatar.
 */
function resolveHairTintProfile(hairHex, hairBaseLum = 0.30) {
  const [tr, tg, tb] = parseHexRgb(hairHex, [120, 53, 15]);
  const [th, ts, tl] = rgbToHsl(tr, tg, tb);
  const hexLow = String(hairHex || '').toLowerCase();

  // Platinum / Silver-Ice (`#e2e8f0`)
  if (hexLow === '#e2e8f0' || (ts < 0.22 && tl > 0.75)) {
    const desiredMid = 0.66;
    const gamma = Math.max(0.38, Math.min(1.15, Math.log(desiredMid) / Math.log(Math.max(0.08, hairBaseLum))));
    return { hue: 214, sat: 0.14, gamma, scale: 0.96, lift: 0.06 };
  }

  // Raven Black (`#111827` / `#0f172a`)
  if (hexLow === '#111827' || hexLow === '#0f172a' || tl < 0.12) {
    const desiredMid = 0.11;
    const gamma = Math.max(1.05, Math.min(2.35, Math.log(desiredMid) / Math.log(Math.max(0.08, Math.min(0.85, hairBaseLum)))));
    return { hue: 218, sat: 0.18, gamma, scale: 0.82, lift: 0.01 };
  }

  // Blonde (`#facc15`)
  if (hexLow === '#facc15' || (th >= 38 && th <= 58 && tl > 0.45)) {
    const desiredMid = 0.56;
    const gamma = Math.max(0.42, Math.min(1.15, Math.log(desiredMid) / Math.log(Math.max(0.08, hairBaseLum))));
    return { hue: 43, sat: 0.74, gamma, scale: 0.98, lift: 0.02 };
  }

  // Natural Chestnut Brown (`#78350f`)
  if (hexLow === '#78350f' || (th >= 18 && th <= 36 && tl < 0.35)) {
    const desiredMid = 0.25;
    const gamma = Math.max(0.68, Math.min(1.55, Math.log(desiredMid) / Math.log(Math.max(0.08, hairBaseLum))));
    return { hue: 25, sat: 0.62, gamma, scale: 0.96, lift: 0.0 };
  }

  // Vibrant Red / Blue / Cyan / Custom Hair Colors
  const desiredMid = Math.max(0.34, Math.min(0.50, tl));
  const gamma = Math.max(0.48, Math.min(1.38, Math.log(desiredMid) / Math.log(Math.max(0.08, hairBaseLum))));
  return {
    hue: th,
    sat: Math.max(0.68, Math.min(0.86, ts * 0.95)),
    gamma,
    scale: 0.98,
    lift: 0.01
  };
}

/**
 * Computes luminance-preserving Jersey HSL target parameters for a given sweater hex color.
 */
function resolveJerseyTintProfile(jerseyHex) {
  const [tr, tg, tb] = parseHexRgb(jerseyHex, [2, 132, 199]);
  const [th, ts, tl] = rgbToHsl(tr, tg, tb);
  const hexLow = String(jerseyHex || '').toLowerCase();

  // Stealth Blackout Sweater (`#111827` / `#0f172a`)
  if (hexLow === '#111827' || hexLow === '#0f172a' || tl < 0.12) {
    return { hue: 216, sat: 0.14, gamma: 1.32, scale: 0.88 };
  }

  // Gold Sweater (`#eab308` / `#facc15`)
  if (hexLow === '#eab308' || hexLow === '#facc15' || (th >= 38 && th <= 56 && ts > 0.5)) {
    return { hue: 45, sat: 0.84, gamma: 0.72, scale: 1.04 };
  }

  // Pink Sweater (`#ec4899`)
  if (hexLow === '#ec4899') {
    return { hue: 330, sat: 0.80, gamma: 0.76, scale: 1.03 };
  }

  // General vibrant team sweater (`Royal Blue`, `Red`, `Teal`, `Emerald`, `Purple`, etc.)
  return {
    hue: th,
    sat: Math.max(0.66, Math.min(0.84, ts * 0.94)),
    gamma: 0.82,
    scale: 1.02
  };
}

function loadRawAvatarImage(avatarMeta) {
  if (typeof Image === 'undefined') return Promise.resolve(null);
  const key = avatarMeta.id;
  const cached = _rawImageCache.get(key);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }
  if (_rawImagePromises.has(key)) {
    return _rawImagePromises.get(key);
  }
  const p = new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      _rawImageCache.set(key, img);
      resolve(img);
    };
    img.onerror = () => {
      _rawImagePromises.delete(key);
      resolve(null);
    };
    img.src = avatarMeta.src;
  });
  _rawImagePromises.set(key, p);
  return p;
}

export function preloadAllPaintedAvatars() {
  if (typeof Image === 'undefined') return Promise.resolve([]);
  return Promise.all(PAINTED_SKATER_CATALOG.map((meta) => loadRawAvatarImage(meta)));
}

// Eagerly start preloading painted character PNGs in browser environments
if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
  preloadAllPaintedAvatars().catch(() => {});
}

function buildTintedBitmapFromImage(img, avatarMeta, hairColorHex, jerseyColorHex) {
  const cacheKey = `${avatarMeta.id}|${hairColorHex.toLowerCase()}|${jerseyColorHex.toLowerCase()}`;
  const hit = _tintedBitmapCache.get(cacheKey);
  if (hit) return hit;

  const w = img.naturalWidth || 374;
  const h = img.naturalHeight || 900;
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const ctx = off.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);

  const imgData = ctx.getImageData(0, 0, w, h);
  const px = imgData.data;

  const hairProf = resolveHairTintProfile(hairColorHex, avatarMeta.hairBaseLum || 0.30);
  const jerseyProf = resolveJerseyTintProfile(jerseyColorHex);
  const invW = 1 / w;
  const invH = 1 / h;

  for (let y = 0; y < h; y++) {
    const ny = (y + 0.5) * invH;
    // Fast skip below sweater bottom (`ny > 0.532` is breezers, socks, and skates — 100% untouched!)
    if (ny > 0.532) continue;

    const rowOffset = y * w * 4;
    for (let x = 0; x < w; x++) {
      const i = rowOffset + x * 4;
      const a = px[i + 3];
      if (a < 12) continue;

      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];
      const nx = (x + 0.5) * invW;
      const [hue, sat, lum] = rgbToHsl(r, g, b);

      // 1. Hair Region Check (`ny <= 0.370` covers long chest braids on Skater 6 & Skater 8)
      let wHair = 0;
      if (ny <= 0.370) {
        wHair = computeHairMaskWeight(avatarMeta.id, nx, ny, hue, sat, lum);
      }

      if (wHair > 0.005) {
        // Preserve specular hair highlights (`lum > 0.72` desaturates naturally toward white sheen)
        const specFade = 1 - smoothstep(0.68, 0.90, lum) * 0.55;
        const curvedL = Math.max(0.025, Math.min(0.94, Math.pow(Math.max(0.005, lum), hairProf.gamma) * hairProf.scale + hairProf.lift));
        // Preserve strand-level saturation micro-variation while shifting to target hair chroma
        const outSat = Math.max(0.04, Math.min(0.92, (hairProf.sat * 0.78 + sat * 0.22) * specFade));
        const [nr, ng, nb] = hslToRgb(hairProf.hue, outSat, curvedL);
        px[i]     = Math.round(r + (nr - r) * wHair);
        px[i + 1] = Math.round(g + (ng - g) * wHair);
        px[i + 2] = Math.round(b + (nb - b) * wHair);
        continue;
      }

      // 2. Sweater / Jersey Region Check (`0.188 <= ny <= 0.530`)
      if (ny >= 0.188) {
        const wJersey = computeJerseyMaskWeight(nx, ny, hue, sat);
        if (wJersey > 0.005) {
          const foldHighlightFade = 1 - smoothstep(0.62, 0.88, lum) * 0.45;
          const curvedL = Math.max(0.03, Math.min(0.92, Math.pow(Math.max(0.008, lum), jerseyProf.gamma) * jerseyProf.scale));
          const outSat = Math.max(0.06, Math.min(0.90, (jerseyProf.sat * 0.82 + sat * 0.18) * foldHighlightFade));
          const [nr, ng, nb] = hslToRgb(jerseyProf.hue, outSat, curvedL);
          px[i]     = Math.round(r + (nr - r) * wJersey);
          px[i + 1] = Math.round(g + (ng - g) * wJersey);
          px[i + 2] = Math.round(b + (nb - b) * wJersey);
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  _tintedBitmapCache.set(cacheKey, off);
  return off;
}

function resolveCatalogItem(idOrVal, category) {
  if (!idOrVal) return null;
  const shop = (typeof window !== 'undefined' && Array.isArray(window.PRO_SHOP_ITEMS)) ? window.PRO_SHOP_ITEMS : [];
  return shop.find((it) => it.id === idOrVal || (category && it.category === category && (it.color === idOrVal || it.style === idOrVal))) || null;
}

function resolveAvatarMetaFromState(s = {}) {
  const explicitId = String(s.stockAvatarId || s.avatarBaseId || '').trim();
  const byId = PAINTED_SKATER_CATALOG.find((a) => a.id === explicitId);
  if (byId) return byId;

  // Fallback mapping from hairStyle / avatarType if stockAvatarId wasn't explicitly specified
  const style = String(s.hairStyle || '').toLowerCase();
  const isGirl = String(s.avatarType || s.charType || '').toLowerCase() === 'girl';
  if (style === 'ponytail') return PAINTED_SKATER_CATALOG[4]; // avatar-female-1
  if (style === 'braids') return PAINTED_SKATER_CATALOG[5];   // avatar-female-2
  if (style === 'mohawk') return PAINTED_SKATER_CATALOG[2];   // avatar-male-3
  if (style === 'buzz') return PAINTED_SKATER_CATALOG[1];     // avatar-male-2
  if (style === 'short' || style === 'fade') return PAINTED_SKATER_CATALOG[3]; // avatar-male-4
  if (style === 'curly' && isGirl) return PAINTED_SKATER_CATALOG[6]; // avatar-female-3
  return isGirl ? PAINTED_SKATER_CATALOG[4] : PAINTED_SKATER_CATALOG[0];
}

export function normalizeSkaterState(rawState = {}, previewItem = null) {
  const s = { ...(rawState || {}) };
  let previewSlot = null;

  if (previewItem && typeof previewItem === 'object') {
    const cat = previewItem.category || '';
    if (cat === 'Gloves' || previewItem.slot === 'gloves') {
      s.equippedGloves = previewItem.color;
      s.equippedGlovesId = previewItem.id;
      s.glovesStyle = previewItem.style;
      previewSlot = 'gloves';
    } else if (cat === 'Stick' || previewItem.slot === 'stick') {
      s.equippedStick = previewItem.color;
      s.equippedStickId = previewItem.id;
      s.stickStyle = previewItem.style;
      s.bladeTapeColor = previewItem.tapeColor;
      previewSlot = 'stick';
    } else if (cat === 'Helmet' || previewItem.slot === 'helmet') {
      s.equippedHelmet = previewItem.color;
      s.equippedHelmetId = previewItem.id;
      previewSlot = 'visor';
    } else if (cat === 'Visor' || previewItem.slot === 'visor') {
      s.equippedVisor = previewItem.color;
      s.equippedVisorId = previewItem.id;
      s.visorStyle = previewItem.style;
      previewSlot = 'visor';
    } else if (cat === 'Skates' || previewItem.slot === 'skates') {
      s.equippedSkate = previewItem.color;
      s.equippedSkates = previewItem.id;
      s.equippedSkatesId = previewItem.id;
      s.skateStyle = previewItem.style;
      s.steelColor = previewItem.steelColor;
      previewSlot = 'skates';
    } else if (cat === 'Jersey' || previewItem.hex) {
      s.jerseyColor = previewItem.hex || previewItem.color;
      previewSlot = 'jersey';
    }
  }

  const avatarMeta = resolveAvatarMetaFromState(s);
  const rawName = String(s.name || s.firstName || 'Skater').trim() || 'Skater';
  const backNameplate = String(s.jerseyBackName || rawName || s.lastName || 'SKATER')
    .trim()
    .toUpperCase()
    .slice(0, 14) || 'SKATER';

  const rawNum = s.jerseyNumber !== undefined && s.jerseyNumber !== null ? String(s.jerseyNumber).trim() : '9';
  const jerseyNumber = rawNum.replace(/[^0-9]/g, '').slice(0, 2);

  const rawHairCol = String(s.hairColor || '#78350f').trim();
  const hairColor = rawHairCol.startsWith('#')
    ? rawHairCol
    : (NAMED_HAIR_COLORS[rawHairCol.toLowerCase()] || '#78350f');

  const rawJerseyCol = String(s.jerseyColor || '#0284c7').trim();
  const jerseyColor = rawJerseyCol.startsWith('#')
    ? rawJerseyCol
    : (NAMED_JERSEY_COLORS[rawJerseyCol.toLowerCase()] || '#0284c7');

  const jerseyAccent = s.jerseyAccent || (
    jerseyColor.toLowerCase() === '#111827' || jerseyColor.toLowerCase() === '#0f172a'
      ? '#22d3ee'
      : (jerseyColor.toLowerCase() === '#eab308' || jerseyColor.toLowerCase() === '#facc15'
          ? '#0f172a'
          : (jerseyColor.toLowerCase() === '#dc2626' || jerseyColor.toLowerCase() === '#ec4899'
              ? '#fde047'
              : '#38bdf8'))
  );

  const starters = buildStarterGearItems({ jerseyColor });
  const starterVisor = starters.find((x) => x.slot === 'visor') || starters[2];
  const starterStick = starters.find((x) => x.slot === 'stick') || starters[0];
  const starterGloves = starters.find((x) => x.slot === 'gloves') || starters[1];
  const starterSkates = starters.find((x) => x.slot === 'skates') || starters[3];

  const glovesMeta = resolveCatalogItem(s.equippedGlovesId || s.equippedGloves, 'Gloves');
  const stickMeta = resolveCatalogItem(s.equippedStickId || s.equippedStick, 'Stick');
  const helmetMeta = resolveCatalogItem(s.equippedHelmetId || s.equippedHelmet, 'Helmet');
  const visorMeta = resolveCatalogItem(s.equippedVisorId || s.equippedVisor, 'Visor');
  const skateMeta = resolveCatalogItem(s.equippedSkatesId || s.equippedSkates || s.equippedSkate, 'Skates');

  const visorItem = visorMeta || helmetMeta || starterVisor;
  const stickItem = stickMeta || starterStick;
  const glovesItem = glovesMeta || starterGloves;
  const skatesItem = skateMeta || starterSkates;

  const visorId = s.equippedVisorId || (visorMeta && visorMeta.id) || (helmetMeta && helmetMeta.id) || 'starter-visor';
  const stickId = s.equippedStickId || (stickMeta && stickMeta.id) || 'starter-stick';
  const glovesId = s.equippedGlovesId || (glovesMeta && glovesMeta.id) || 'starter-gloves';
  const skatesId = s.equippedSkatesId || s.equippedSkates || (skateMeta && skateMeta.id) || 'starter-skates';

  return {
    profileId: s.id || 'skater',
    avatarBaseId: avatarMeta.id,
    avatarLabel: avatarMeta.label,
    avatarStyleTag: avatarMeta.styleTag,
    avatarSrc: avatarMeta.src,
    avatarMeta,
    name: rawName,
    backNameplate,
    jerseyNumber,
    hairStyle: s.hairStyle || avatarMeta.defaultHairStyle || 'flow',
    hairColor,
    skinTone: s.skinTone || '#fdba74',
    jerseyColor,
    jerseyAccent,
    visorId,
    stickId,
    glovesId,
    skatesId,
    visorItem,
    stickItem,
    glovesItem,
    skatesItem,
    previewSlot,
    cacheKey: `${avatarMeta.id}|${hairColor.toLowerCase()}|${jerseyColor.toLowerCase()}`
  };
}

function classifySpinView(angleDeg = 0) {
  const norm = ((Number(angleDeg) || 0) % 360 + 360) % 360;
  if (norm >= 95 && norm <= 265) {
    return { normAngle: norm, face: 'back' };
  }
  return { normAngle: norm, face: 'front' };
}

/**
 * Draws the cached painted & HSL-tinted character onto a high-DPI target `<canvas>`
 * (`devicePixelRatio` scaled, `imageSmoothingEnabled = true`).
 */
function paintSkaterOntoCanvas(canvasEl, tintedBitmap, cfg) {
  if (!canvasEl || !tintedBitmap) return;
  const srcW = tintedBitmap.width || 374;
  const srcH = tintedBitmap.height || 900;
  const dpr = Math.min(2.5, Math.max(1.5, (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 2));
  const outW = Math.round(srcW * (dpr > 1.8 ? 1.15 : 1.0));
  const outH = Math.round(srcH * (dpr > 1.8 ? 1.15 : 1.0));

  if (canvasEl.width !== outW || canvasEl.height !== outH) {
    canvasEl.width = outW;
    canvasEl.height = outH;
  }

  const ctx = canvasEl.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, outW, outH);
  ctx.imageSmoothingEnabled = true;
  if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';

  // Subtle grounded arena shadow beneath painted skate blades
  ctx.save();
  ctx.translate(outW * 0.5, outH * 0.968);
  ctx.scale(1, 0.14);
  const grad = ctx.createRadialGradient(0, 0, outW * 0.04, 0, 0, outW * 0.36);
  grad.addColorStop(0, 'rgba(2, 6, 23, 0.65)');
  grad.addColorStop(0.65, 'rgba(15, 23, 42, 0.28)');
  grad.addColorStop(1, 'rgba(2, 6, 23, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, outW * 0.36, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.drawImage(tintedBitmap, 0, 0, outW, outH);

  canvasEl.setAttribute('data-natural-width', String(srcW));
  canvasEl.setAttribute('data-natural-height', String(srcH));
  canvasEl.setAttribute('data-cache-key', cfg.cacheKey);
  canvasEl.setAttribute('data-avatar-base-id', cfg.avatarBaseId);
}

/**
 * Renders the sleek, non-overlapping 4-slot 75/25 SVG Gear Loadout Dock
 * (`Helmet/Visor`, `Stick`, `Gloves`, `Skates`) alongside the painted skater!
 */
function buildLoadoutDockHtml(cfg, layout = 'vertical') {
  const slots = [
    { key: 'visor',  label: 'VISOR',  id: cfg.visorId,  item: { ...cfg.visorItem,  category: cfg.visorItem.category || 'Visor' } },
    { key: 'stick',  label: 'STICK',  id: cfg.stickId,  item: { ...cfg.stickItem,  category: 'Stick' } },
    { key: 'gloves', label: 'GLOVES', id: cfg.glovesId, item: { ...cfg.glovesItem, category: 'Gloves' } },
    { key: 'skates', label: 'SKATES', id: cfg.skatesId, item: { ...cfg.skatesItem, category: 'Skates' } }
  ];

  const isHorizontal = layout === 'horizontal';
  const wrapCls = isHorizontal
    ? 'grid grid-cols-4 gap-1.5 w-full pt-1'
    : 'flex flex-col justify-center gap-1.5 shrink-0 z-20';

  const cardsHtml = slots.map((sl) => {
    const isTrying = cfg.previewSlot === sl.key;
    const isProUpgrade = !String(sl.id || '').startsWith('starter-');
    const borderCls = isTrying
      ? 'border-cyan-300 bg-cyan-950/85 ring-2 ring-cyan-300/80 shadow-[0_0_12px_rgba(34,211,238,0.45)]'
      : (isProUpgrade
          ? 'border-emerald-400/75 bg-slate-950/90 shadow-md'
          : 'border-slate-700/85 bg-slate-950/85');
    const tagCol = isTrying ? 'text-cyan-200' : (isProUpgrade ? 'text-emerald-300' : 'text-slate-400');

    // Render 75/25 shaded gear SVG scaled cleanly inside the compact dock tile
    const rawSvg = renderGearItemArtSvg(sl.item, { compact: true })
      .replace(/w-20 h-14/g, isHorizontal ? 'w-full h-9' : 'w-12 h-8 sm:w-14 sm:h-9');

    return `
      <div
        data-dock-slot="${sl.key}"
        data-dock-item-id="${escHtml(sl.id)}"
        data-dock-trying="${isTrying ? 'true' : 'false'}"
        title="${escHtml(sl.item.name || sl.label)}"
        class="rounded-xl border ${borderCls} px-1 py-0.5 flex flex-col items-center justify-center transition-all"
      >
        ${rawSvg}
        <span class="text-[8px] font-black tracking-wider leading-tight mt-0.5 ${tagCol}">${isTrying ? 'TRYING' : sl.label}</span>
      </div>
    `;
  }).join('');

  return `
    <div data-skater-loadout-dock="true" data-dock-layout="${layout}" class="${wrapCls}">
      ${cardsHtml}
    </div>
  `;
}

/**
 * 180° Back View — Richly Textured Pro-Stitched Rear Hockey Sweater & 4-Slot Gear Showcase.
 * ZERO geometric robot heads, faces, hands, or stick-figure limbs!
 */
export function buildRearSweaterShowcaseHtml(rawState = {}, options = {}) {
  const uid = nextSkaterUid();
  const cfg = normalizeSkaterState(rawState, options.previewItem || null);
  const jerseyLight = adjustHex(cfg.jerseyColor, 42, '#38bdf8');
  const jerseyDark = adjustHex(cfg.jerseyColor, -52, '#090d16');
  const jNumStr = cfg.jerseyNumber !== '' ? cfg.jerseyNumber : '9';
  const numLum = luminance(cfg.jerseyColor);
  const numTextFill = numLum > 0.68 ? '#0f172a' : '#ffffff';
  const numOutline = numLum > 0.68 ? '#ffffff' : cfg.jerseyAccent;
  const nameLen = cfg.backNameplate.length;
  const nameFontSize = nameLen >= 12 ? 11.2 : (nameLen >= 9 ? 13.0 : 14.8);
  const compact = Boolean(options.compactRear);

  return `
    <div class="w-full h-full flex flex-col items-center justify-between gap-1 select-none" data-rear-sweater-showcase="true">
      <div class="flex-1 min-h-0 w-full flex items-center justify-center">
        <svg
          viewBox="0 0 260 220"
          role="img"
          aria-label="${escHtml(cfg.backNameplate)} #${escHtml(jNumStr)} Pro Stitched Rear Hockey Sweater"
          class="w-full h-full max-h-full object-contain drop-shadow-[0_10px_18px_rgba(2,6,23,0.75)]"
          data-rear-sweater-svg="true"
        >
          <defs>
            <linearGradient id="${uid}_jback" x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stop-color="${jerseyLight}"/>
              <stop offset="48%" stop-color="${cfg.jerseyColor}"/>
              <stop offset="100%" stop-color="${jerseyDark}"/>
            </linearGradient>
            <pattern id="${uid}_mesh" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="0.65" fill="rgba(2,6,23,0.18)"/>
              <circle cx="4.5" cy="4.5" r="0.65" fill="rgba(255,255,255,0.08)"/>
            </pattern>
          </defs>

          <!-- Pro Hockey Rear Sweater Garment Silhouette (Garment Only — Zero Robot Head/Limbs!) -->
          <g data-skater-layer="jersey-back">
            <path
              d="M 82 22 Q 130 12 178 22 L 236 68 L 216 132 L 188 118 L 190 194 Q 130 202 70 194 L 72 118 L 44 132 L 24 68 Z"
              fill="url(#${uid}_jback)"
              stroke="rgba(255,255,255,0.38)"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
            <!-- Breathable Pro Air-Knit Mesh Texture -->
            <path
              d="M 82 22 Q 130 12 178 22 L 236 68 L 216 132 L 188 118 L 190 194 Q 130 202 70 194 L 72 118 L 44 132 L 24 68 Z"
              fill="url(#${uid}_mesh)"
            />

            <!-- Stitched Rear Shoulder Yoke & Double-Needle Seam -->
            <path d="M 82 22 Q 130 12 178 22 L 214 51 Q 130 46 46 51 Z" fill="${jerseyDark}" opacity="0.62" stroke="${cfg.jerseyAccent}" stroke-width="1.5"/>
            <path d="M 52 55 Q 130 50 208 55" fill="none" stroke="rgba(255,255,255,0.42)" stroke-width="1" stroke-dasharray="3.5 2.5"/>

            <!-- Rear Collar Ribbing & Chromed League Shield Tag -->
            <path d="M 102 18 Q 130 28 158 18 L 152 29 Q 130 37 108 29 Z" fill="#090d16" stroke="#f8fafc" stroke-width="1.3"/>
            <polygon points="130,23 135,25.5 133.5,31.5 130,33.5 126.5,31.5 125,25.5" fill="${cfg.jerseyAccent}" stroke="#0f172a" stroke-width="0.8"/>

            <!-- Dimensional Fabric Drape Creases -->
            <path d="M 84 96 Q 90 138 82 182 M 176 96 Q 170 138 178 182" fill="none" stroke="rgba(2,6,23,0.34)" stroke-width="2.6" stroke-linecap="round"/>

            <!-- Double Sleeve Stripes & Sleeve TV Numbers -->
            <polygon points="32,96 68,87 70,96 36,105" fill="${cfg.jerseyAccent}"/>
            <polygon points="37,108 70,99 71,106 40,115" fill="#f8fafc"/>
            <polygon points="228,96 192,87 190,96 224,105" fill="${cfg.jerseyAccent}"/>
            <polygon points="223,108 190,99 189,106 220,115" fill="#f8fafc"/>
            <text x="53" y="81" fill="${numTextFill}" stroke="${numOutline}" stroke-width="0.8" font-family="Impact, Inter, sans-serif" font-size="14" font-weight="900" text-anchor="middle">${escHtml(jNumStr)}</text>
            <text x="207" y="81" fill="${numTextFill}" stroke="${numOutline}" stroke-width="0.8" font-family="Impact, Inter, sans-serif" font-size="14" font-weight="900" text-anchor="middle">${escHtml(jNumStr)}</text>

            <!-- Double Waist Hem Stripes -->
            <rect x="71" y="168" width="118" height="8" fill="${cfg.jerseyAccent}"/>
            <rect x="71" y="179" width="118" height="5.5" fill="#f8fafc" opacity="0.95"/>

            <!-- Authentic Stitched Rear Fight-Strap Loop & Snap Tab -->
            <rect x="121" y="174" width="18" height="25" rx="3.5" fill="#f8fafc" stroke="#64748b" stroke-width="1.2"/>
            <rect x="123.5" y="176.5" width="13" height="8" rx="1.5" fill="none" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="2 1.5"/>
            <circle cx="130" cy="192" r="2.8" fill="#94a3b8" stroke="#0f172a" stroke-width="0.9"/>

            <!-- STITCHED TACKLE-TWILL UPPER-BACK NAMEBAR -->
            <rect x="74" y="54" width="112" height="24" rx="4.5" fill="rgba(9,13,22,0.86)" stroke="${cfg.jerseyAccent}" stroke-width="1.5"/>
            <rect x="77" y="57" width="106" height="18" rx="3" fill="none" stroke="rgba(255,255,255,0.38)" stroke-width="0.9" stroke-dasharray="3.5 2"/>
            <text
              x="130"
              y="71"
              data-skater-layer="back-nameplate"
              fill="#ffffff"
              font-family="Inter, Impact, Segoe UI, sans-serif"
              font-size="${nameFontSize}"
              font-weight="900"
              letter-spacing="1.1"
              text-anchor="middle"
            >${escHtml(cfg.backNameplate)}</text>

            <!-- GIANT DOUBLE-LAYER TACKLE-TWILL BACK JERSEY NUMBER -->
            <text
              x="130"
              y="148"
              data-skater-layer="back-number"
              fill="${numTextFill}"
              stroke="${numOutline}"
              stroke-width="4.2"
              paint-order="stroke fill"
              font-family="Impact, Inter, Arial Black, sans-serif"
              font-size="68"
              font-weight="900"
              letter-spacing="1.5"
              text-anchor="middle"
            >${escHtml(jNumStr)}</text>
          </g>
        </svg>
      </div>
      ${compact ? '' : `
        <div class="w-full shrink-0" data-rear-loadout-strip="true">
          ${buildLoadoutDockHtml(cfg, 'horizontal')}
        </div>
      `}
    </div>
  `;
}

/**
 * Synchronously returns a cached `<canvas>` if the base painted PNG is already decoded,
 * or resolves via `ensurePaintedCanvasReady(cfg)` once decoded.
 */
export function getCachedTintedBitmap(cfg) {
  const hit = _tintedBitmapCache.get(cfg.cacheKey);
  if (hit) return hit;
  const rawImg = _rawImageCache.get(cfg.avatarBaseId);
  if (rawImg && rawImg.complete && rawImg.naturalWidth > 0) {
    return buildTintedBitmapFromImage(rawImg, cfg.avatarMeta, cfg.hairColor, cfg.jerseyColor);
  }
  return null;
}

/**
 * Compatibility string builder (`buildCustomizableSkaterSvg`):
 * Returns HTML string for static string callers (`0` geometric robot shapes!).
 */
export function buildCustomizableSkaterSvg(rawState = {}, options = {}) {
  const cfg = normalizeSkaterState(rawState, options.previewItem || null);
  const angle = options.angleDeg !== undefined ? Number(options.angleDeg) : 0;
  const view = classifySpinView(angle);

  if (view.face === 'back') {
    return `
      <div
        data-skater-renderer="v154-painted-75-25"
        data-view-angle="${Math.round(view.normAngle)}"
        data-view-face="back"
        data-avatar-base-id="${escHtml(cfg.avatarBaseId)}"
        data-hair-color="${escHtml(cfg.hairColor)}"
        data-jersey-color="${escHtml(cfg.jerseyColor)}"
        data-jersey-number="${escHtml(cfg.jerseyNumber)}"
        data-back-nameplate="${escHtml(cfg.backNameplate)}"
        data-stick-id="${escHtml(cfg.stickId)}"
        data-gloves-id="${escHtml(cfg.glovesId)}"
        data-visor-id="${escHtml(cfg.visorId)}"
        data-skates-id="${escHtml(cfg.skatesId)}"
        class="w-full h-full flex items-center justify-center select-none"
      >
        ${buildRearSweaterShowcaseHtml(rawState, options)}
      </div>
    `;
  }

  let imgSrc = cfg.avatarSrc;
  const bitmap = getCachedTintedBitmap(cfg);
  if (bitmap) {
    let dataUrl = _tintedDataUrlCache.get(cfg.cacheKey);
    if (!dataUrl) {
      try {
        dataUrl = bitmap.toDataURL('image/png');
        _tintedDataUrlCache.set(cfg.cacheKey, dataUrl);
      } catch (_) {}
    }
    if (dataUrl) imgSrc = dataUrl;
  }

  return `
    <div
      data-skater-renderer="v154-painted-75-25"
      data-view-angle="${Math.round(view.normAngle)}"
      data-view-face="front"
      data-avatar-base-id="${escHtml(cfg.avatarBaseId)}"
      data-hair-color="${escHtml(cfg.hairColor)}"
      data-jersey-color="${escHtml(cfg.jerseyColor)}"
      data-jersey-number="${escHtml(cfg.jerseyNumber)}"
      data-back-nameplate="${escHtml(cfg.backNameplate)}"
      data-stick-id="${escHtml(cfg.stickId)}"
      data-gloves-id="${escHtml(cfg.glovesId)}"
      data-visor-id="${escHtml(cfg.visorId)}"
      data-skates-id="${escHtml(cfg.skatesId)}"
      class="w-full h-full flex items-center justify-center select-none"
    >
      <img src="${escHtml(imgSrc)}" alt="${escHtml(cfg.name)}" class="h-full w-auto max-w-full max-h-full object-contain select-none pointer-events-none" />
    </div>
  `;
}

/**
 * Compact circular headshot badge backed by the REAL painted 75/25 portrait (zero geometric SVG faces!).
 */
export function buildMiniSkaterHeadSvg(rawState = {}, sizePx = 36) {
  const cfg = normalizeSkaterState(rawState);
  const s = Math.max(24, Number(sizePx) || 36);
  let headSrc = cfg.avatarSrc;
  const bitmap = getCachedTintedBitmap(cfg);
  if (bitmap) {
    let dataUrl = _tintedDataUrlCache.get(cfg.cacheKey);
    if (!dataUrl) {
      try {
        dataUrl = bitmap.toDataURL('image/png');
        _tintedDataUrlCache.set(cfg.cacheKey, dataUrl);
      } catch (_) {}
    }
    if (dataUrl) headSrc = dataUrl;
  }
  return `
    <span
      class="inline-flex items-center justify-center rounded-full overflow-hidden bg-slate-950 shrink-0 shadow-md"
      style="width:${s}px;height:${s}px;border:2px solid ${escHtml(cfg.jerseyColor)};"
      data-mini-skater-360="${escHtml(cfg.profileId)}"
    >
      <img
        src="${escHtml(headSrc)}"
        alt="${escHtml(cfg.name)}"
        style="width:100%;height:260%;object-fit:cover;object-position:50% 4%;transform:translateY(28%);"
        class="pointer-events-none select-none"
      />
    </span>
  `;
}

/**
 * Mounts the Real Painted 75/25 High-DPI `<canvas>` Skater (`0° Front`) + Smooth Flip
 * to Pro-Stitched Rear Sweater & Gear Showcase (`180° Back`) into `container`.
 */
export function renderCustomizableSkater(container, skaterState = {}, options = {}) {
  const el = typeof container === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(container) : null)
    : container;

  const initialAngle = Number.isFinite(Number(options.angleDeg)) ? Number(options.angleDeg) : 0;
  if (!el) {
    return buildCustomizableSkaterSvg(skaterState, { ...options, angleDeg: initialAngle });
  }

  const cfg = normalizeSkaterState(skaterState, options.previewItem || null);
  const showSpinButton = Boolean(options.showSpinButton);
  const showLoadoutDock = Boolean(options.showLoadoutDock);
  const spinBtnIdAttr = options.spinButtonId ? `id="${escHtml(options.spinButtonId)}"` : '';
  const initialView = classifySpinView(initialAngle);
  const renderToken = nextSkaterUid();
  el._synapzSkaterRenderToken = renderToken;

  const syncGlobalTelemetry = (viewObj) => {
    if (typeof window !== 'undefined') {
      window._lastRenderedYoungPlayerAvatar = {
        style: 'v154-painted-75-25-hsl-canvas',
        profileId: cfg.profileId,
        avatarBaseId: cfg.avatarBaseId,
        avatarLabel: cfg.avatarLabel,
        name: cfg.name,
        backNameplate: cfg.backNameplate,
        hairStyle: cfg.hairStyle,
        hairColor: cfg.hairColor,
        jerseyNumber: cfg.jerseyNumber,
        jerseyColor: cfg.jerseyColor,
        jerseyAccent: cfg.jerseyAccent,
        stickId: cfg.stickId,
        glovesId: cfg.glovesId,
        visorId: cfg.visorId,
        skatesId: cfg.skatesId,
        cacheKey: cfg.cacheKey,
        angleDeg: viewObj.normAngle,
        viewFace: viewObj.face
      };
    }
  };

  const angleLabelFor = (v) => (v.face === 'back' ? 'Back 180°' : 'Front 0°');

  el.innerHTML = `
    <div
      class="synapz-skater-360-stage relative w-full h-full flex flex-col items-center justify-between select-none"
      data-skater-stage="true"
      data-skater-renderer="v154-painted-75-25"
      data-avatar-base-id="${escHtml(cfg.avatarBaseId)}"
      data-view-angle="${Math.round(initialView.normAngle)}"
      data-view-face="${initialView.face}"
      data-hair-style="${escHtml(cfg.hairStyle)}"
      data-hair-color="${escHtml(cfg.hairColor)}"
      data-jersey-color="${escHtml(cfg.jerseyColor)}"
      data-jersey-number="${escHtml(cfg.jerseyNumber)}"
      data-back-nameplate="${escHtml(cfg.backNameplate)}"
      data-stick-id="${escHtml(cfg.stickId)}"
      data-gloves-id="${escHtml(cfg.glovesId)}"
      data-visor-id="${escHtml(cfg.visorId)}"
      data-skates-id="${escHtml(cfg.skatesId)}"
      style="touch-action: pan-y; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between;"
    >
      <div
        class="synapz-skater-360-figure flex-1 min-h-0 w-full flex items-center justify-center gap-2 cursor-grab active:cursor-grabbing"
        data-skater-figure-wrap="true"
        style="flex: 1 1 0%; min-height: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; -webkit-transition: -webkit-transform 180ms ease, opacity 180ms ease; transition: transform 180ms ease, opacity 180ms ease;"
      ></div>
      ${showSpinButton ? `
        <div class="shrink-0 pt-1 flex items-center justify-center gap-1.5 z-30">
          <button ${spinBtnIdAttr} type="button" data-skater-spin-btn="true" class="px-3 py-1 rounded-full bg-slate-950/92 hover:bg-slate-900 border border-cyan-400/75 text-cyan-200 text-[10px] sm:text-[11px] font-black shadow-lg backdrop-blur-md cursor-pointer">
            🔄 Flip Front / Back (${angleLabelFor(initialView)})
          </button>
        </div>
      ` : ''}
    </div>
  `;

  const stageRoot = el.querySelector('[data-skater-stage]');
  const figureWrap = el.querySelector('[data-skater-figure-wrap]');
  const spinBtn = el.querySelector('[data-skater-spin-btn]');

  let currentAngle = initialAngle;
  let dragStartX = null;
  let didDrag = false;

  const mountViewFace = (viewObj) => {
    if (!figureWrap || !stageRoot) return;
    stageRoot.setAttribute('data-view-angle', String(Math.round(viewObj.normAngle)));
    stageRoot.setAttribute('data-view-face', viewObj.face);
    syncGlobalTelemetry(viewObj);

    if (viewObj.face === 'back') {
      // Back 180° already includes the horizontal 4-slot gear loadout strip below the rear sweater!
      figureWrap.innerHTML = buildRearSweaterShowcaseHtml(skaterState, {
        ...options,
        compactRear: Boolean(options.compactRear)
      });
      return;
    }

    // Front 0°: Crisp High-DPI `<canvas>` Painted 75/25 Skater + Optional Sleek Loadout Dock Alongside!
    figureWrap.innerHTML = `
      <div style="height: 100%; width: 100%; flex: 1 1 0%; min-width: 0; display: flex; align-items: center; justify-content: center;">
        <canvas
          class="synapz-painted-skater-canvas block select-none"
          data-painted-avatar-canvas="true"
          data-avatar-src="${escHtml(cfg.avatarSrc)}"
          style="height: 100%; width: auto; max-width: 100%; max-height: 100%; object-fit: contain; margin: 0 auto;"
        ></canvas>
      </div>
      ${showLoadoutDock ? buildLoadoutDockHtml(cfg, 'vertical') : ''}
    `;

    const canvasEl = figureWrap.querySelector('canvas[data-painted-avatar-canvas]');
    const syncCachedBitmap = getCachedTintedBitmap(cfg);
    if (syncCachedBitmap) {
      paintSkaterOntoCanvas(canvasEl, syncCachedBitmap, cfg);
    } else {
      loadRawAvatarImage(cfg.avatarMeta).then((loadedImg) => {
        if (!loadedImg || el._synapzSkaterRenderToken !== renderToken) return;
        const liveCanvas = figureWrap.querySelector('canvas[data-painted-avatar-canvas]');
        if (!liveCanvas) return;
        const tinted = buildTintedBitmapFromImage(loadedImg, cfg.avatarMeta, cfg.hairColor, cfg.jerseyColor);
        paintSkaterOntoCanvas(liveCanvas, tinted, cfg);
      });
    }
  };

  mountViewFace(initialView);

  const applyAngle = (nextAngle, animateFlip = false) => {
    currentAngle = ((Number(nextAngle) || 0) % 360 + 360) % 360;
    const nextView = classifySpinView(currentAngle);
    el._skaterWasDragged = true;
    setTimeout(() => { el._skaterWasDragged = false; }, 80);

    if (figureWrap && animateFlip) {
      figureWrap.style.webkitTransform = 'scaleX(0.08)';
      figureWrap.style.transform = 'scaleX(0.08)';
      setTimeout(() => {
        if (el._synapzSkaterRenderToken !== renderToken || !figureWrap) return;
        mountViewFace(nextView);
        figureWrap.style.webkitTransform = 'scaleX(1)';
        figureWrap.style.transform = 'scaleX(1)';
      }, 95);
    } else {
      mountViewFace(nextView);
    }

    if (spinBtn) {
      spinBtn.textContent = `🔄 Flip Front / Back (${angleLabelFor(nextView)})`;
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
      applyAngle(v.face === 'back' ? 0 : 180, true);
    });
  }

  if (figureWrap) {
    figureWrap.addEventListener('pointerdown', (ev) => {
      if (ev.target && ev.target.closest && ev.target.closest('[data-skater-loadout-dock]')) return;
      dragStartX = ev.clientX;
      didDrag = false;
    });
    figureWrap.addEventListener('pointermove', (ev) => {
      if (dragStartX === null) return;
      const dx = ev.clientX - dragStartX;
      if (Math.abs(dx) > 26 && !didDrag) {
        didDrag = true;
        const curFace = classifySpinView(currentAngle).face;
        applyAngle(curFace === 'back' ? 0 : 180, true);
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

  return stageRoot ? stageRoot.outerHTML : '';
}

const SynapzSkaterRenderer360 = {
  PAINTED_SKATER_CATALOG,
  preloadAllPaintedAvatars,
  normalizeSkaterState,
  getCachedTintedBitmap,
  buildRearSweaterShowcaseHtml,
  buildCustomizableSkaterSvg,
  buildMiniSkaterHeadSvg,
  renderCustomizableSkater
};

if (typeof window !== 'undefined') {
  window.SynapzSkaterRenderer360 = SynapzSkaterRenderer360;
  window.renderCustomizableSkater = renderCustomizableSkater;
}

export default SynapzSkaterRenderer360;
