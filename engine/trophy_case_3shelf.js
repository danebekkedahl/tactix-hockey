/**
 * SYNAPZ HOCKEY v15.1 — Single Illuminated 3-Shelf Walnut, Brushed Brass & Glass Trophy Case
 * (`engine/trophy_case_3shelf.js`)
 *
 * Replaces split emoji badge boxes and the separate Cup Vault with ONE unified,
 * arena-lit 3-Shelf Walnut & Glass Trophy Case featuring 75/25 illustrated SVG hardware:
 *   1) Top Shelf — Division Championship Silver Cups (`8U`, `10U`, `12U`, `14U`, `16U`, `18U+`)
 *   2) Middle Shelf — Tactical Mastery & Streak Medals (5 Zone Mastery + 3 Streak/Breakaway Medallions on woven ribbons)
 *   3) Bottom Shelf — 32-City Tour Embroidered Patches (32 stitched hockey shield/crest patches)
 *
 * Strict Zero-State Hardware Rules:
 *   - Brand-new profiles (`0` drills played) render 100% of Cups, Medals, and Patches
 *     as locked frosted-glass silhouettes (`0` pre-unlocked 8U/10U/18U Cups!).
 *   - Tapping any silhouette or earned hardware opens an inline inspection card
 *     showing exact unlock criteria/progress (if locked) or Earned Date +
 *     `🖨️ Print / Share Certificate` (if earned).
 */

import { NHL_ATLAS_CITIES } from './nhl_atlas_map.js';

let _trophySvgSeq = 0;
function nextTrophyUid() {
  _trophySvgSeq = (_trophySvgSeq + 1) % 999999;
  return `tr75_${_trophySvgSeq}`;
}

function escTr(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const DIVISION_CUPS_SPEC = [
  { id: 'cup-8U',   divKey: '8U',  label: '8U Division Cup',   shortBand: '8U CUP',   heightScale: 0.88 },
  { id: 'cup-10U',  divKey: '10U', label: '10U Division Cup',  shortBand: '10U CUP',  heightScale: 0.92 },
  { id: 'cup-12U',  divKey: '12U', label: '12U Division Cup',  shortBand: '12U CUP',  heightScale: 0.96 },
  { id: 'cup-14U',  divKey: '14U', label: '14U Division Cup',  shortBand: '14U CUP',  heightScale: 1.00 },
  { id: 'cup-16U',  divKey: '16U', label: '16U Division Cup',  shortBand: '16U CUP',  heightScale: 1.03 },
  { id: 'cup-18U',  divKey: '18U', label: '18U+ Championship Cup', shortBand: '18U+ CUP', heightScale: 1.06 }
];

const TACTICAL_MEDALS_SPEC = [
  { id: 'medal-dz',        zoneId: 'DZ', metal: 'gold',   ribbonA: '#0284c7', ribbonB: '#38bdf8', emblem: 'DZ',  title: 'D-Zone House Mastery Medal',       criteria: 'Master all Defensive Zone House & Breakout concepts (80%+ Gold).' },
  { id: 'medal-nz',        zoneId: 'NZ', metal: 'silver', ribbonA: '#0f766e', ribbonB: '#2dd4bf', emblem: 'NZ',  title: 'Neutral Zone & Hinge Medal',       criteria: 'Master all Neutral Zone Regroup, Scanning & Gap concepts (80%+ Gold).' },
  { id: 'medal-om',        zoneId: 'OM', metal: 'gold',   ribbonA: '#b45309', ribbonB: '#fbbf24', emblem: '2v1', title: 'Odd-Man Rush Mastery Medal',       criteria: 'Master all 2-on-1 & 3-on-2 Odd-Man Rush concepts (80%+ Gold).' },
  { id: 'medal-oz',        zoneId: 'OZ', metal: 'gold',   ribbonA: '#be123c', ribbonB: '#fb7185', emblem: 'OZ',  title: 'O-Zone & Forecheck Medal',         criteria: 'Master all Offensive Zone Triangle, Cycle & Forecheck concepts (80%+ Gold).' },
  { id: 'medal-st',        zoneId: 'ST', metal: 'silver', ribbonA: '#6d28d9', ribbonB: '#c4b5fd', emblem: 'PP',  title: 'Special Teams Clutch Medal',       criteria: 'Master all 5-on-4 Power Play & 4-on-5 Penalty Kill concepts (80%+ Gold).' },
  { id: 'medal-streak-3',  streakReq: 3, metal: 'bronze', ribbonA: '#9a3412', ribbonB: '#fdba74', emblem: '3X',  title: '3-Gold Hat-Trick Medallion',       criteria: 'String together 3 consecutive Gold Hockey IQ reads on the ice.' },
  { id: 'medal-streak-5',  streakReq: 5, metal: 'silver', ribbonA: '#1e3a8a', ribbonB: '#93c5fd', emblem: '5X',  title: '5-Gold Iron Shift Medallion',      criteria: 'String together 5 consecutive Gold Hockey IQ reads without a turnover.' },
  { id: 'medal-breakaway', breakawayReq: 1, drillsReq: 10, metal: 'gold', ribbonA: '#111827', ribbonB: '#facc15', emblem: 'SNIPE', title: 'Breakaway Clutch Medallion', criteria: 'Complete 10+ on-ice shifts and convert a 3-Streak Breakaway Bonus.' }
];

function renderFrostedPadlockOverlay(cx, cy) {
  return `
    <g data-frosted-lock-emblem="true" transform="translate(${cx}, ${cy})">
      <circle cx="0" cy="0" r="8.5" fill="rgba(15,23,42,0.78)" stroke="rgba(148,163,184,0.65)" stroke-width="1"/>
      <path d="M -3 -1 V -3.2 A 3 3 0 0 1 3 -3.2 V -1" fill="none" stroke="#cbd5e1" stroke-width="1.3" stroke-linecap="round"/>
      <rect x="-3.8" y="-1" width="7.6" height="5.8" rx="1.4" fill="#94a3b8"/>
    </g>
  `;
}

/**
 * 75/25 Illustrated Tiered Metallic Silver Championship Cup SVG (Earned vs Frosted-Glass Silhouette).
 */
export function renderDivisionCupSvg(cupSpec, { earned = false, large = false } = {}) {
  const uid = nextTrophyUid();
  const cls = large ? 'w-28 h-36' : 'w-16 h-22 sm:w-20 sm:h-24';

  if (!earned) {
    return `
      <svg viewBox="0 0 110 140" data-hardware-svg="cup" data-hardware-state="frosted-locked" class="${cls} select-none">
        <defs>
          <linearGradient id="${uid}_frost" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(186,230,253,0.22)"/>
            <stop offset="50%" stop-color="rgba(100,116,139,0.16)"/>
            <stop offset="100%" stop-color="rgba(30,41,59,0.28)"/>
          </linearGradient>
        </defs>
        <ellipse cx="55" cy="130" rx="34" ry="5" fill="rgba(2,6,23,0.45)"/>
        <!-- Frosted Glass Cup Silhouette -->
        <rect x="27" y="88" width="56" height="39" rx="6" fill="url(#${uid}_frost)" stroke="rgba(148,163,184,0.42)" stroke-width="1.3" stroke-dasharray="3 2"/>
        <line x1="27" y1="101" x2="83" y2="101" stroke="rgba(148,163,184,0.28)" stroke-width="1"/>
        <line x1="27" y1="114" x2="83" y2="114" stroke="rgba(148,163,184,0.28)" stroke-width="1"/>
        <rect x="35" y="70" width="40" height="18" rx="4" fill="url(#${uid}_frost)" stroke="rgba(148,163,184,0.38)" stroke-width="1.2"/>
        <path d="M 43 46 L 67 46 L 73 70 L 37 70 Z" fill="url(#${uid}_frost)" stroke="rgba(148,163,184,0.38)" stroke-width="1.2"/>
        <path d="M 31 16 C 31 44, 79 44, 79 16 Z" fill="url(#${uid}_frost)" stroke="rgba(186,230,253,0.48)" stroke-width="1.4"/>
        <ellipse cx="55" cy="16" rx="24" ry="5" fill="rgba(148,163,184,0.18)" stroke="rgba(186,230,253,0.45)" stroke-width="1.2"/>
        <!-- Etched Division Label -->
        <text x="55" y="110" fill="rgba(203,213,225,0.68)" font-size="8.5" font-weight="900" text-anchor="middle" letter-spacing="0.5">${escTr(cupSpec.shortBand)}</text>
        ${renderFrostedPadlockOverlay(55, 62)}
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 110 140" data-hardware-svg="cup" data-hardware-state="earned" class="${cls} select-none drop-shadow-[0_8px_16px_rgba(250,204,21,0.35)]">
      <defs>
        <linearGradient id="${uid}_silver" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#64748b"/>
          <stop offset="28%" stop-color="#f8fafc"/>
          <stop offset="52%" stop-color="#cbd5e1"/>
          <stop offset="78%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
        <linearGradient id="${uid}_brass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#eab308"/>
          <stop offset="100%" stop-color="#92400e"/>
        </linearGradient>
      </defs>
      <ellipse cx="55" cy="130" rx="36" ry="5.5" fill="rgba(2,6,23,0.75)" stroke="rgba(250,204,21,0.45)" stroke-width="1"/>
      <!-- Engraved Tiered Barrel Base -->
      <rect x="25" y="122" width="60" height="7" rx="3" fill="#1e1b18" stroke="url(#${uid}_brass)" stroke-width="1.2"/>
      <rect x="27" y="86" width="56" height="37" rx="6" fill="url(#${uid}_silver)" stroke="#475569" stroke-width="1.4"/>
      <line x1="27" y1="98" x2="83" y2="98" stroke="#334155" stroke-width="1.3"/>
      <line x1="27" y1="111" x2="83" y2="111" stroke="#334155" stroke-width="1.3"/>
      <!-- Engraved Brass Championship Band -->
      <rect x="31" y="100.5" width="48" height="9" rx="2" fill="#0f172a" stroke="url(#${uid}_brass)" stroke-width="1"/>
      <text x="55" y="107.2" fill="#fde047" font-size="6.8" font-weight="900" text-anchor="middle" letter-spacing="0.4">${escTr(cupSpec.shortBand)}</text>
      <!-- Collar & Fluted Neck -->
      <rect x="35" y="69" width="40" height="17" rx="4" fill="url(#${uid}_silver)" stroke="#475569" stroke-width="1.3"/>
      <path d="M 43 45 L 67 45 L 73 69 L 37 69 Z" fill="url(#${uid}_silver)" stroke="#475569" stroke-width="1.3"/>
      <!-- Championship Sterling Bowl & Specular Highlight -->
      <path d="M 30 15 C 30 44, 80 44, 80 15 Z" fill="url(#${uid}_silver)" stroke="url(#${uid}_brass)" stroke-width="1.8"/>
      <ellipse cx="55" cy="15" rx="25" ry="5.5" fill="#e2e8f0" stroke="url(#${uid}_brass)" stroke-width="1.6"/>
      <path d="M 38 20 Q 39 33 46 37" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="0.88"/>
    </svg>
  `;
}

/**
 * 75/25 Illustrated Hockey Medallion on Woven Neck Ribbon (Earned vs Frosted Silhouette).
 */
export function renderTacticalMedalSvg(medalSpec, { earned = false, large = false } = {}) {
  const uid = nextTrophyUid();
  const cls = large ? 'w-24 h-32' : 'w-14 h-20 sm:w-16 sm:h-22';

  if (!earned) {
    return `
      <svg viewBox="0 0 96 124" data-hardware-svg="medal" data-hardware-state="frosted-locked" class="${cls} select-none">
        <defs>
          <linearGradient id="${uid}_mfrost" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(186,230,253,0.2)"/>
            <stop offset="100%" stop-color="rgba(30,41,59,0.3)"/>
          </linearGradient>
        </defs>
        <!-- Frosted Woven V-Ribbon Silhouette -->
        <polygon points="22,8 38,8 49,54 37,54" fill="url(#${uid}_mfrost)" stroke="rgba(148,163,184,0.38)" stroke-width="1.1" stroke-dasharray="3 2"/>
        <polygon points="74,8 58,8 47,54 59,54" fill="url(#${uid}_mfrost)" stroke="rgba(148,163,184,0.38)" stroke-width="1.1" stroke-dasharray="3 2"/>
        <rect x="41" y="51" width="14" height="6" rx="2" fill="rgba(148,163,184,0.28)"/>
        <!-- Frosted Medallion Disc -->
        <circle cx="48" cy="84" r="26" fill="url(#${uid}_mfrost)" stroke="rgba(186,230,253,0.45)" stroke-width="1.4" stroke-dasharray="3 2"/>
        <circle cx="48" cy="84" r="20" fill="none" stroke="rgba(148,163,184,0.3)" stroke-width="1"/>
        <text x="48" y="103" fill="rgba(203,213,225,0.65)" font-size="7.5" font-weight="900" text-anchor="middle">${escTr(medalSpec.emblem)}</text>
        ${renderFrostedPadlockOverlay(48, 80)}
      </svg>
    `;
  }

  const metalStops = medalSpec.metal === 'bronze'
    ? ['#fed7aa', '#ea580c', '#7c2d12']
    : (medalSpec.metal === 'silver'
        ? ['#ffffff', '#cbd5e1', '#475569']
        : ['#fef08a', '#eab308', '#92400e']);

  return `
    <svg viewBox="0 0 96 124" data-hardware-svg="medal" data-hardware-state="earned" class="${cls} select-none drop-shadow-[0_6px_14px_rgba(250,204,21,0.32)]">
      <defs>
        <linearGradient id="${uid}_metal" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stop-color="${metalStops[0]}"/>
          <stop offset="52%" stop-color="${metalStops[1]}"/>
          <stop offset="100%" stop-color="${metalStops[2]}"/>
        </linearGradient>
      </defs>
      <!-- Woven Striped Neck Ribbon -->
      <polygon points="20,6 37,6 49,54 36,54" fill="${medalSpec.ribbonA}" stroke="${medalSpec.ribbonB}" stroke-width="1.3"/>
      <line x1="28.5" y1="6" x2="42.5" y2="54" stroke="${medalSpec.ribbonB}" stroke-width="2.4"/>
      <polygon points="76,6 59,6 47,54 60,54" fill="${medalSpec.ribbonA}" stroke="${medalSpec.ribbonB}" stroke-width="1.3"/>
      <line x1="67.5" y1="6" x2="53.5" y2="54" stroke="${medalSpec.ribbonB}" stroke-width="2.4"/>
      <!-- Brushed Brass Bail Ring -->
      <rect x="40" y="51" width="16" height="6.5" rx="2.5" fill="url(#${uid}_metal)" stroke="#0f172a" stroke-width="1"/>
      <!-- Dimensional Hockey Medallion -->
      <circle cx="48" cy="84" r="27" fill="url(#${uid}_metal)" stroke="#fef9c3" stroke-width="1.6"/>
      <circle cx="48" cy="84" r="21" fill="#0f172a" stroke="url(#${uid}_metal)" stroke-width="1.5"/>
      <!-- Crossed Hockey Sticks + Emblem -->
      <line x1="36" y1="73" x2="60" y2="95" stroke="${metalStops[0]}" stroke-width="1.8" stroke-linecap="round" opacity="0.55"/>
      <line x1="60" y1="73" x2="36" y2="95" stroke="${metalStops[0]}" stroke-width="1.8" stroke-linecap="round" opacity="0.55"/>
      <text x="48" y="88" fill="#ffffff" font-family="Impact, Inter, sans-serif" font-size="11" font-weight="900" text-anchor="middle" letter-spacing="0.5">${escTr(medalSpec.emblem)}</text>
    </svg>
  `;
}

/**
 * 75/25 Illustrated Stitched Embroidered NHL City Tour Shield Patch (Earned vs Frosted Silhouette).
 */
export function renderCityPatchSvg(cityObj, { earned = false, large = false } = {}) {
  const uid = nextTrophyUid();
  const cls = large ? 'w-24 h-28' : 'w-12 h-14 sm:w-14 sm:h-16';

  if (!earned) {
    return `
      <svg viewBox="0 0 84 96" data-hardware-svg="patch" data-hardware-state="frosted-locked" class="${cls} select-none">
        <defs>
          <linearGradient id="${uid}_pfrost" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(186,230,253,0.18)"/>
            <stop offset="100%" stop-color="rgba(15,23,42,0.34)"/>
          </linearGradient>
        </defs>
        <path d="M 12 14 L 42 6 L 72 14 L 68 58 Q 42 86 42 88 Q 42 86 16 58 Z" fill="url(#${uid}_pfrost)" stroke="rgba(148,163,184,0.45)" stroke-width="1.5" stroke-dasharray="3 2"/>
        <text x="42" y="34" fill="rgba(203,213,225,0.68)" font-size="11" font-weight="900" text-anchor="middle">${escTr(cityObj.code)}</text>
        ${renderFrostedPadlockOverlay(42, 57)}
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 84 96" data-hardware-svg="patch" data-hardware-state="earned" class="${cls} select-none drop-shadow-[0_5px_12px_rgba(34,211,238,0.32)]">
      <defs>
        <linearGradient id="${uid}_pfill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0ea5e9"/>
          <stop offset="55%" stop-color="#1e3a8a"/>
          <stop offset="100%" stop-color="#090d16"/>
        </linearGradient>
      </defs>
      <!-- Merrowed Embroidered Shield Outer Edge -->
      <path d="M 10 13 L 42 5 L 74 13 L 70 59 Q 42 88 42 90 Q 42 88 14 59 Z" fill="url(#${uid}_pfill)" stroke="#facc15" stroke-width="2.4"/>
      <!-- Stitched Twill Inner Seam -->
      <path d="M 15 17 L 42 10 L 69 17 L 65.5 56 Q 42 81 42 83 Q 42 81 18.5 56 Z" fill="none" stroke="#ffffff" stroke-width="1.1" stroke-dasharray="3 2" opacity="0.85"/>
      <rect x="18" y="22" width="48" height="16" rx="3" fill="#090d16" stroke="#38bdf8" stroke-width="1"/>
      <text x="42" y="33.5" fill="#fef08a" font-family="Impact, Inter, sans-serif" font-size="12" font-weight="900" text-anchor="middle" letter-spacing="0.8">${escTr(cityObj.code)}</text>
      <!-- Stitched Hockey Puck & Stars -->
      <ellipse cx="42" cy="54" rx="11" ry="5.5" fill="#020617" stroke="#67e8f9" stroke-width="1.3"/>
      <text x="42" y="70" fill="#bae6fd" font-size="7.2" font-weight="900" text-anchor="middle">STOP #${cityObj.stopNumber}</text>
    </svg>
  `;
}

/**
 * Computes strictly authentic hardware unlock states for a profile (`0` unlocked on brand-new profiles!).
 */
export function evaluateTrophyCaseProgress(profile = {}, catalog = null) {
  const isDemo = typeof window !== 'undefined' && typeof window.isSynapzDemoMode === 'function' && window.isSynapzDemoMode();
  const drillsDone = Number(profile?.drillsCompleted || 0);
  const bestStreak = Number(profile?.bestStreak || 0);
  const bagsOpened = Number(profile?.blooketBagsOpened || 0);
  const unlockedCupsArr = Array.isArray(profile?.unlockedCups) ? profile.unlockedCups : [];
  const cupsByAge = (!isDemo && drillsDone === 0) ? {} : (profile?.stanleyCupsByAge || {});
  const patchesSet = new Set(Array.isArray(profile?.unlockedCityPatches) ? profile.unlockedCityPatches : []);
  const medalsSet = new Set(Array.isArray(profile?.unlockedMedals) ? profile.unlockedMedals : []);

  let zoneSummaries = [];
  if (typeof window !== 'undefined' && window.SynapzV14Modules?.compute5ZoneRingSummaries) {
    zoneSummaries = window.SynapzV14Modules.compute5ZoneRingSummaries(profile, catalog || window.SynapzV14Engine?.catalog);
  }

  const cups = DIVISION_CUPS_SPEC.map((c) => {
    const runs = (!isDemo && drillsDone === 0 && unlockedCupsArr.length === 0)
      ? 0
      : (Number(cupsByAge[c.divKey] || 0) + (unlockedCupsArr.includes(c.divKey) ? 1 : 0));
    const earned = runs > 0;
    return {
      ...c,
      shelf: 'Top Shelf — Division Championship Silver Cups',
      earned,
      runs,
      earnedDate: earned ? (profile?.lastCupEarnedDate || 'Current Season') : null,
      progressLabel: earned
        ? `Engraved (${runs}x Division Championship)`
        : `Locked • Conquer all 32 NHL Tour Stops in ${c.divKey} (${patchesSet.size} / 32 Stops)`,
      criteria: `Complete all 32 NHL City Tour Stops at 80%+ Hockey IQ in the ${c.divKey} division.`
    };
  });

  const medals = TACTICAL_MEDALS_SPEC.map((m) => {
    let earned = medalsSet.has(m.id);
    let progressLabel = '';
    if (m.zoneId) {
      const z = zoneSummaries.find((r) => r.zoneId === m.zoneId) || { pct: 0, mastered: 0, total: 9 };
      if (z.total > 0 && z.mastered >= z.total && drillsDone > 0) earned = true;
      progressLabel = earned
        ? `Mastered (${z.mastered} / ${z.total} Concepts)`
        : `Locked • ${z.mastered} / ${z.total || 9} Concepts Mastered (${z.pct || 0}%)`;
    } else if (m.streakReq) {
      if (bestStreak >= m.streakReq && drillsDone > 0) earned = true;
      progressLabel = earned
        ? `Earned • Best Streak: ${bestStreak} Gold Reads`
        : `Locked • Best Streak: ${Math.min(bestStreak, m.streakReq)} / ${m.streakReq} Gold Reads`;
    } else if (m.drillsReq) {
      if (drillsDone >= m.drillsReq && bagsOpened >= (m.breakawayReq || 1)) earned = true;
      progressLabel = earned
        ? `Earned • ${drillsDone} Shifts & ${bagsOpened} Breakaways`
        : `Locked • ${Math.min(drillsDone, m.drillsReq)} / ${m.drillsReq} Shifts & ${Math.min(bagsOpened, 1)} / 1 Breakaway`;
    }
    if (!isDemo && drillsDone === 0 && !medalsSet.has(m.id)) {
      earned = false;
    }
    return {
      ...m,
      label: m.title,
      shelf: 'Middle Shelf — Tactical Mastery & Streak Medals',
      earned,
      earnedDate: earned ? 'Current Season' : null,
      progressLabel
    };
  });

  const patches = NHL_ATLAS_CITIES.map((city) => {
    const earned = (!isDemo && drillsDone === 0 && patchesSet.size === 0)
      ? false
      : (patchesSet.has(city.id) || patchesSet.has(city.code));
    return {
      id: `patch-${city.code}`,
      city,
      code: city.code,
      label: `${city.name} ${city.team} Tour Patch`,
      shelf: 'Bottom Shelf — 32-City Tour Embroidered Patches',
      earned,
      earnedDate: earned ? 'Current Season' : null,
      criteria: `Complete the 5-play ${city.name} (${city.team}) Tour Shift focused on ${city.focus}.`,
      progressLabel: earned
        ? `Conquered Stop #${city.stopNumber} / 32`
        : `Locked • Tour Stop #${city.stopNumber} / 32 (${city.name}, ${city.region})`
    };
  });

  const earnedCupsCount = cups.filter((c) => c.earned).length;
  const earnedMedalsCount = medals.filter((m) => m.earned).length;
  const earnedPatchesCount = patches.filter((p) => p.earned).length;
  const totalEarned = earnedCupsCount + earnedMedalsCount + earnedPatchesCount;

  return {
    cups,
    medals,
    patches,
    earnedCupsCount,
    earnedMedalsCount,
    earnedPatchesCount,
    totalEarned
  };
}

function openTrophyCertificatePrintPreview(item, profile = {}) {
  if (typeof document === 'undefined') return;
  const overlay = document.getElementById('synapzPrintSheetOverlay');
  const docRoot = document.getElementById('synapzPrintDocumentRoot');
  if (!overlay || !docRoot) return;

  const skaterName = String(profile?.name || 'Skater').trim();
  const jNum = profile?.jerseyNumber !== undefined && profile?.jerseyNumber !== '' ? ` #${profile.jerseyNumber}` : '';
  const div = profile?.divisionLabel || profile?.ageGroup || '12U';

  docRoot.innerHTML = `
    <div class="synapz-print-single-page p-6 rounded-2xl border-4 border-amber-500 bg-white text-slate-950 space-y-4 text-center">
      <div class="text-xs font-black uppercase tracking-widest text-amber-700">SYNAPZ HOCKEY • OFFICIAL CHAMPIONSHIP HARDWARE CERTIFICATE</div>
      <h2 class="text-2xl font-black text-slate-950">${escTr(item.label)}</h2>
      <div class="text-sm font-bold text-slate-700">Awarded To: <strong class="text-slate-950">${escTr(skaterName)}${escTr(jNum)}</strong> (${escTr(div)})</div>
      <div class="py-3 flex items-center justify-center">
        ${item.divKey
          ? renderDivisionCupSvg(item, { earned: true, large: true })
          : (item.city
              ? renderCityPatchSvg(item.city, { earned: true, large: true })
              : renderTacticalMedalSvg(item, { earned: true, large: true }))}
      </div>
      <p class="text-xs font-semibold text-slate-700 max-w-lg mx-auto">${escTr(item.criteria)}</p>
      <div class="pt-3 border-t border-slate-300 flex items-center justify-between text-[11px] font-bold text-slate-600">
        <span>Earned: ${escTr(item.earnedDate || 'Current Season')}</span>
        <span>SYNAPZ HOCKEY — PLAY. LEARN. DOMINATE.</span>
      </div>
    </div>
  `;
  overlay.classList.remove('hidden');
}

/**
 * Renders the Illuminated 3-Shelf Walnut, Brushed Brass & Glass Trophy Case into `container`.
 */
export function renderTrophyCase3Shelf(container, options = {}) {
  const root = typeof container === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(container) : null)
    : container;
  if (!root) return null;

  const profile = options.profile || (typeof window !== 'undefined' && typeof window.getActiveProfile === 'function' ? window.getActiveProfile() : {}) || {};
  const progress = evaluateTrophyCaseProgress(profile, options.catalog);
  let inspectedItem = null;

  const allItemsById = new Map();
  [...progress.cups, ...progress.medals, ...progress.patches].forEach((it) => allItemsById.set(it.id, it));

  // Sync legacy #trophyRoomPrestigeBadge text if present in DOM
  const legacyPrestigeBadge = typeof document !== 'undefined' ? document.getElementById('trophyRoomPrestigeBadge') : null;
  if (legacyPrestigeBadge) {
    legacyPrestigeBadge.textContent = progress.earnedCupsCount > 0
      ? `${progress.earnedCupsCount} Stanley Cups Unlocked`
      : '0 Stanley Cups Unlocked — Road to 32 NHL Cities';
  }

  root.innerHTML = `
    <div id="walnut3ShelfTrophyCaseRoot" data-trophy-case="v151-walnut-3shelf" class="rounded-2xl p-3 sm:p-4 space-y-3 border-2 border-amber-500/75 shadow-2xl select-none" style="background: linear-gradient(180deg, #2d190e 0%, #180d07 48%, #26140b 100%); box-shadow: inset 0 2px 24px rgba(251,191,36,0.18), 0 18px 40px rgba(2,6,23,0.9);">
      <!-- Brushed Brass Top Cabinet Fascia Plaque -->
      <div class="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl border border-amber-300/70" style="background: linear-gradient(90deg, #451a03 0%, #78350f 50%, #451a03 100%);">
        <div>
          <div class="text-[10px] font-black uppercase tracking-widest text-amber-300">ILLUMINATED WALNUT &amp; GLASS CHAMPIONSHIP CABINET</div>
          <div class="text-xs sm:text-sm font-black text-white">${escTr(profile?.name || 'Skater')}${profile?.jerseyNumber !== undefined && profile?.jerseyNumber !== '' ? ` #${escTr(profile.jerseyNumber)}` : ''} — Personal Hardware Collection</div>
        </div>
        <div class="flex flex-wrap items-center gap-1.5 text-[10px] font-black">
          <span id="trophyCaseSummaryUnlockedPill" class="px-2.5 py-1 rounded-full bg-slate-950/90 border border-amber-400 text-amber-300">
            ${progress.earnedCupsCount} Unlocked • ${progress.earnedCupsCount}/6 Cups • ${progress.earnedMedalsCount}/8 Medals • ${progress.earnedPatchesCount}/32 Patches
          </span>
        </div>
      </div>

      <!-- Inline Tap-to-Inspect Popover Card (Opens When Any Silhouette or Trophy Is Tapped) -->
      <div id="trophyCaseInspectionCard" class="hidden rounded-xl bg-slate-950/96 border-2 border-amber-400 p-3 shadow-2xl"></div>

      <!-- ================================================================= -->
      <!-- SHELF 1 (TOP SHELF): DIVISION CHAMPIONSHIP SILVER CUPS (8U–18U+)  -->
      <!-- ================================================================= -->
      <div data-trophy-shelf="cups" class="relative rounded-xl p-2.5 sm:p-3 border border-amber-500/40 overflow-hidden" style="background: radial-gradient(ellipse at 50% 0%, rgba(254,240,138,0.16) 0%, rgba(15,23,42,0.78) 72%);">
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-[11px] font-black uppercase tracking-wider text-amber-200">Top Shelf — Division Championship Silver Cups</span>
          <span class="text-[10px] font-bold text-slate-300">${progress.earnedCupsCount} / 6 Earned</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 items-end pt-1 pb-2">
          ${progress.cups.map((cup) => `
            <button type="button" data-trophy-item-id="${cup.id}" data-trophy-locked="${cup.earned ? 'false' : 'true'}" class="trophy-case-hardware-btn group p-1.5 rounded-xl border ${cup.earned ? 'border-amber-400/70 bg-amber-500/10' : 'border-slate-700/60 bg-slate-950/45 hover:border-cyan-400/60'} flex flex-col items-center gap-1 transition cursor-pointer">
              ${renderDivisionCupSvg(cup, { earned: cup.earned })}
              <span class="text-[10px] font-black ${cup.earned ? 'text-amber-300' : 'text-slate-300'} leading-tight text-center" style="white-space:normal;">${escTr(cup.divKey === '18U' ? '18U+' : cup.divKey)}</span>
            </button>
          `).join('')}
        </div>
        <!-- Beveled Glass Shelf Ledge -->
        <div class="h-1.5 w-full rounded-full" style="background: linear-gradient(90deg, rgba(148,163,184,0.25), rgba(226,232,240,0.75), rgba(56,189,248,0.45), rgba(148,163,184,0.25));"></div>
      </div>

      <!-- ================================================================= -->
      <!-- SHELF 2 (MIDDLE SHELF): TACTICAL MASTERY & STREAK MEDALS          -->
      <!-- ================================================================= -->
      <div data-trophy-shelf="medals" class="relative rounded-xl p-2.5 sm:p-3 border border-amber-500/40 overflow-hidden" style="background: radial-gradient(ellipse at 50% 0%, rgba(125,211,252,0.14) 0%, rgba(15,23,42,0.8) 74%);">
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-[11px] font-black uppercase tracking-wider text-cyan-200">Middle Shelf — Tactical Mastery &amp; Streak Medals</span>
          <span class="text-[10px] font-bold text-slate-300">${progress.earnedMedalsCount} / 8 Earned</span>
        </div>
        <div class="grid grid-cols-4 sm:grid-cols-8 gap-1.5 items-end pt-1 pb-2">
          ${progress.medals.map((med) => `
            <button type="button" data-trophy-item-id="${med.id}" data-trophy-locked="${med.earned ? 'false' : 'true'}" class="trophy-case-hardware-btn p-1.5 rounded-xl border ${med.earned ? 'border-amber-400/70 bg-amber-500/10' : 'border-slate-700/60 bg-slate-950/45 hover:border-cyan-400/60'} flex flex-col items-center gap-1 transition cursor-pointer">
              ${renderTacticalMedalSvg(med, { earned: med.earned })}
              <span class="text-[9.5px] font-extrabold ${med.earned ? 'text-amber-200' : 'text-slate-300'} leading-tight text-center" style="white-space:normal;">${escTr(med.emblem)}</span>
            </button>
          `).join('')}
        </div>
        <!-- Beveled Glass Shelf Ledge -->
        <div class="h-1.5 w-full rounded-full" style="background: linear-gradient(90deg, rgba(148,163,184,0.25), rgba(226,232,240,0.75), rgba(56,189,248,0.45), rgba(148,163,184,0.25));"></div>
      </div>

      <!-- ================================================================= -->
      <!-- SHELF 3 (BOTTOM SHELF): 32-CITY TOUR EMBROIDERED PATCHES          -->
      <!-- ================================================================= -->
      <div data-trophy-shelf="patches" class="relative rounded-xl p-2.5 sm:p-3 border border-amber-500/40 overflow-hidden" style="background: radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.13) 0%, rgba(15,23,42,0.84) 76%);">
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-[11px] font-black uppercase tracking-wider text-emerald-200">Bottom Shelf — 32-City Tour Embroidered Patches</span>
          <span class="text-[10px] font-bold text-slate-300">${progress.earnedPatchesCount} / 32 Earned</span>
        </div>
        <div class="grid grid-cols-4 sm:grid-cols-8 gap-1.5 max-h-40 overflow-y-auto pr-1 pb-2">
          ${progress.patches.map((pt) => `
            <button type="button" data-trophy-item-id="${pt.id}" data-trophy-locked="${pt.earned ? 'false' : 'true'}" class="trophy-case-hardware-btn p-1 rounded-xl border ${pt.earned ? 'border-emerald-400/75 bg-emerald-500/15' : 'border-slate-800 bg-slate-950/50 hover:border-cyan-400/60'} flex flex-col items-center gap-0.5 transition cursor-pointer">
              ${renderCityPatchSvg(pt.city, { earned: pt.earned })}
              <span class="text-[9px] font-black ${pt.earned ? 'text-emerald-200' : 'text-slate-400'}">${escTr(pt.code)}</span>
            </button>
          `).join('')}
        </div>
        <!-- Walnut & Brass Base Plinth -->
        <div class="h-2 w-full rounded-full mt-1" style="background: linear-gradient(90deg, #78350f, #facc15, #78350f);"></div>
      </div>

      <div class="text-[11px] text-amber-200/80 font-semibold text-center">
        Tap any frosted-glass silhouette or earned trophy above to inspect unlock criteria, live progress, or print an award certificate.
      </div>
    </div>
  `;

  const inspectEl = root.querySelector('#trophyCaseInspectionCard');

  const renderInspectionCard = () => {
    if (!inspectEl) return;
    if (!inspectedItem) {
      inspectEl.classList.add('hidden');
      inspectEl.innerHTML = '';
      return;
    }

    const it = inspectedItem;
    const artSvg = it.divKey
      ? renderDivisionCupSvg(it, { earned: it.earned, large: true })
      : (it.city
          ? renderCityPatchSvg(it.city, { earned: it.earned, large: true })
          : renderTacticalMedalSvg(it, { earned: it.earned, large: true }));

    inspectEl.classList.remove('hidden');
    inspectEl.innerHTML = `
      <div class="flex flex-col sm:flex-row items-center gap-3">
        <div class="p-2 rounded-xl bg-slate-900 border border-slate-700 shrink-0 flex items-center justify-center">
          ${artSvg}
        </div>
        <div class="flex-1 min-w-0 space-y-1.5 text-left w-full">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="text-[10px] font-black uppercase tracking-wider text-amber-300">${escTr(it.shelf)}</div>
              <div class="text-sm sm:text-base font-black text-white" style="white-space:normal;">${escTr(it.label)}</div>
            </div>
            <button type="button" id="btnCloseTrophyInspectionCard" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black shrink-0 cursor-pointer">✕</button>
          </div>
          <div class="text-xs font-bold ${it.earned ? 'text-emerald-300' : 'text-cyan-200'}">${escTr(it.progressLabel)}</div>
          <p class="text-[11px] text-slate-300 leading-snug">${escTr(it.criteria)}</p>
          ${it.earned ? `
            <div class="pt-1 flex flex-wrap items-center justify-between gap-2">
              <span class="text-[11px] font-black text-amber-300">Earned Date: ${escTr(it.earnedDate || 'Current Season')}</span>
              <button type="button" id="btnPrintEarnedTrophyCertificate" class="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow cursor-pointer">
                🖨️ Print / Share Certificate
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    inspectEl.querySelector('#btnCloseTrophyInspectionCard')?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      inspectedItem = null;
      renderInspectionCard();
    });

    inspectEl.querySelector('#btnPrintEarnedTrophyCertificate')?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      openTrophyCertificatePrintPreview(it, profile);
    });
  };

  root.querySelectorAll('.trophy-case-hardware-btn').forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const id = btn.getAttribute('data-trophy-item-id');
      const target = allItemsById.get(id);
      if (!target) return;
      inspectedItem = target;
      renderInspectionCard();
    });
  });

  return {
    progress,
    inspectItemById: (id) => {
      const target = allItemsById.get(id);
      if (target) {
        inspectedItem = target;
        renderInspectionCard();
      }
      return target || null;
    }
  };
}

const SynapzTrophyCase3Shelf = {
  DIVISION_CUPS_SPEC,
  TACTICAL_MEDALS_SPEC,
  evaluateTrophyCaseProgress,
  renderDivisionCupSvg,
  renderTacticalMedalSvg,
  renderCityPatchSvg,
  renderTrophyCase3Shelf
};

if (typeof window !== 'undefined') {
  window.SynapzTrophyCase3Shelf = SynapzTrophyCase3Shelf;
  window.renderTrophyCase3Shelf = renderTrophyCase3Shelf;
}

export default SynapzTrophyCase3Shelf;
