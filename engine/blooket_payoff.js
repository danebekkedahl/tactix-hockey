/**
 * SYNAPZ HOCKEY v14.0 — Blooket Breakaway + 3-Bag Payoff, 5-Zone Skill Rings & Catalog Drawer
 * (`engine/blooket_payoff.js`)
 */

import { CANONICAL_9_MODES, CANONICAL_5_POSITIONS, validateDrillSchema, validateDrillCatalog } from './validate_drills.js';
import { MODE_LABELS } from './modes_9pack.js';

export function ensureProfileConceptMastery(prof) {
  if (!prof || typeof prof !== 'object') return {};
  if (!prof.conceptMasteryV14 || typeof prof.conceptMasteryV14 !== 'object') {
    prof.conceptMasteryV14 = {};
  }
  return prof.conceptMasteryV14;
}

export function getConceptStatus(prof, conceptId) {
  const map = ensureProfileConceptMastery(prof);
  const rec = map[conceptId];
  if (!rec) return { state: 'unwatched', goldOfLast10: 0, attempts: 0, watchedReel: false };
  const last10 = Array.isArray(rec.last10) ? rec.last10.slice(-10) : [];
  const goldCount = last10.filter(Boolean).length;
  let st = 'unwatched';
  if (last10.length >= 8 && goldCount >= 8) {
    st = 'mastered';
  } else if (last10.length > 0) {
    st = 'practicing';
  } else if (rec.watchedReel) {
    st = 'watched_reel';
  }
  return {
    state: st,
    goldOfLast10: goldCount,
    attempts: Number(rec.attempts || last10.length),
    watchedReel: Boolean(rec.watchedReel)
  };
}

export function markConceptReelWatched(prof, conceptId) {
  if (!prof || !conceptId) return null;
  const map = ensureProfileConceptMastery(prof);
  if (!map[conceptId]) {
    map[conceptId] = { watchedReel: true, attempts: 0, last10: [] };
  } else {
    map[conceptId].watchedReel = true;
  }
  return getConceptStatus(prof, conceptId);
}

export function recordConceptRepResult(prof, conceptId, isGold) {
  if (!prof || !conceptId) return null;
  const map = ensureProfileConceptMastery(prof);
  if (!map[conceptId]) {
    map[conceptId] = { watchedReel: true, attempts: 0, last10: [] };
  }
  const rec = map[conceptId];
  rec.watchedReel = true;
  rec.attempts = Number(rec.attempts || 0) + 1;
  if (!Array.isArray(rec.last10)) rec.last10 = [];
  rec.last10.push(Boolean(isGold));
  if (rec.last10.length > 10) rec.last10 = rec.last10.slice(-10);
  return getConceptStatus(prof, conceptId);
}

export function compute5ZoneRingSummaries(prof, catalog) {
  const zones = catalog?.zones || [
    { id: 'DZ', label: 'D-Zone & House', shortLabel: 'D-Zone', color: '#14B8A6', icon: '🛡️' },
    { id: 'NZ', label: 'Breakouts & Regroups', shortLabel: 'Breakouts', color: '#38BDF8', icon: '⚡' },
    { id: 'OM', label: 'Odd-Man Rushes', shortLabel: 'Rushes', color: '#F59E0B', icon: '🚀' },
    { id: 'OZ', label: 'O-Zone & Forecheck', shortLabel: 'O-Zone', color: '#10B981', icon: '🎯' },
    { id: 'ST', label: 'Special Teams', shortLabel: 'PP / PK', color: '#A855F7', icon: '🔥' }
  ];
  const concepts = catalog?.concepts || [];

  return zones.map((z) => {
    const zConcepts = concepts.filter(c => c.zone === z.id);
    const total = Math.max(1, zConcepts.length);
    let watched = 0;
    let practicing = 0;
    let mastered = 0;
    let progressUnits = 0;

    for (const c of zConcepts) {
      const st = getConceptStatus(prof, c.id);
      if (st.state === 'mastered') {
        mastered += 1;
        progressUnits += 1.0;
      } else if (st.state === 'practicing') {
        practicing += 1;
        progressUnits += 0.55 + Math.min(0.4, (st.goldOfLast10 / 10) * 0.4);
      } else if (st.state === 'watched_reel') {
        watched += 1;
        progressUnits += 0.25;
      }
    }

    const pct = Math.min(100, Math.round((progressUnits / total) * 100));
    const stageBadge = mastered > 0
      ? `${mastered}/${total} Mastered`
      : (practicing > 0 ? `${practicing} Practicing` : (watched > 0 ? `${watched} Watched` : `0/${total} New`));

    return {
      ...z,
      total,
      watched,
      practicing,
      mastered,
      pct,
      stageBadge
    };
  });
}

export function renderZoneSkillRingsHtml(prof, catalog, opts = {}) {
  const rings = compute5ZoneRingSummaries(prof, catalog);
  const compact = Boolean(opts.compact);
  const r = compact ? 15 : 18;
  const size = compact ? 38 : 46;
  const circ = Number((2 * Math.PI * r).toFixed(2));

  return `
    <div data-v14-skill-rings="true" class="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full">
      ${rings.map((ring) => {
        const dashOffset = Number((circ * (1 - ring.pct / 100)).toFixed(2));
        return `
          <div data-zone-ring="${ring.id}" class="p-1.5 sm:p-2 rounded-xl bg-slate-950/95 border border-slate-800 flex items-center gap-2 min-w-0">
            <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="shrink-0 -rotate-90">
              <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#1E293B" stroke-width="4"/>
              <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${ring.color}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${dashOffset}"/>
            </svg>
            <div class="min-w-0 flex-1">
              <div class="text-[10px] font-black text-white truncate">${ring.icon} ${compact ? ring.shortLabel : ring.label}</div>
              <div class="text-[9px] font-extrabold text-teal-300 truncate">${ring.pct}% • ${ring.stageBadge}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

export class BlooketPayoffController {
  constructor({ mountEl, onRewardCredited }) {
    this.mountEl = mountEl;
    this.onRewardCredited = onRewardCredited;
    this.isOpen = false;
    this.phase = 'breakaway'; // 'breakaway' | 'bags' | 'done'
    this.timeLeft = 6.0;
    this.goalieOffset = 0;
    this.breakawayScored = false;
    this.baseBucks = 40;
    this.bagOptions = [];
    this.pickedBagIdx = null;
    this._rafId = null;
    this._lastTs = 0;

    this._buildDom();
  }

  _buildDom() {
    if (!this.mountEl) return;
    this.mountEl.innerHTML = `
      <div id="v14BlooketModalCard" class="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3">
        <div class="w-full max-w-xl rounded-2xl bg-[#090D16] border-2 border-amber-400 shadow-2xl overflow-hidden space-y-3 p-4">
          <div class="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div>
              <span id="v14BlooketKicker" class="text-[10px] font-black uppercase tracking-widest text-amber-400">
                🔥 HOT STREAK BONUS UNLOCKED!
              </span>
              <h3 id="v14BlooketTitle" class="text-base sm:text-lg font-black text-white">
                🚨 6-Second Breakaway Deek-or-Snipe!
              </h3>
            </div>
            <span id="v14BlooketClockBadge" class="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
              ⏱️ 6.0s
            </span>
          </div>

          <!-- STEP A: 6-Second Playable Breakaway Canvas + Shot Buttons -->
          <div id="v14BreakawayStage" class="space-y-2.5">
            <div class="w-full rounded-xl overflow-hidden border border-slate-800 bg-white" style="aspect-ratio: 16 / 8;">
              <canvas id="v14BreakawayCanvas" class="w-full h-full block cursor-pointer" style="touch-action: none;"></canvas>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button type="button" data-breakaway-move="deke" class="py-2.5 px-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs shadow cursor-pointer">
                ⚡ Forehand-Backhand Deke
              </button>
              <button type="button" data-breakaway-move="snipe" class="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow cursor-pointer">
                🎯 Top-Corner Glove Snipe
              </button>
              <button type="button" data-breakaway-move="fivehole" class="py-2.5 px-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs shadow cursor-pointer">
                🧊 Quick Five-Hole Slip
              </button>
            </div>
          </div>

          <!-- STEP B: Pick 1-of-3 Shaking Hockey Bags -->
          <div id="v14LootBagsStage" class="hidden space-y-3">
            <p id="v14BreakawayResultBanner" class="text-xs sm:text-sm font-black text-emerald-300 text-center bg-emerald-950/50 border border-emerald-400/60 rounded-xl py-2 px-3"></p>
            <div id="v14ThreeBagsGrid" class="grid grid-cols-3 gap-2.5">
              ${[0, 1, 2].map(idx => `
                <button type="button" data-loot-bag="${idx}" class="v14-shaking-bag-btn p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-amber-400/80 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer">
                  <span class="text-3xl sm:text-4xl inline-block animate-bounce">🎒</span>
                  <span class="text-xs font-black text-amber-300">Hockey Bag #${idx + 1}</span>
                  <span class="text-[10px] font-bold text-slate-300">Tap to Unzip!</span>
                </button>
              `).join('')}
            </div>
            <div id="v14BagRevealSummary" class="hidden p-3 rounded-xl bg-emerald-950/75 border-2 border-emerald-400 text-center space-y-2">
              <div id="v14BagRevealHeadline" class="text-sm sm:text-base font-black text-white"></div>
              <div id="v14BagRevealSub" class="text-xs font-bold text-emerald-200"></div>
              <button id="btnV14ClaimLootContinue" type="button" class="mt-1 py-2 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg cursor-pointer">
                🏒 Claim Puck Bucks &amp; Keep Skating ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.mountEl.querySelectorAll('[data-breakaway-move]').forEach(btn => {
      btn.addEventListener('click', () => this.resolveBreakawayMove(btn.getAttribute('data-breakaway-move')));
    });

    this.mountEl.querySelector('#v14BreakawayCanvas')?.addEventListener('pointerdown', (ev) => {
      const rect = ev.currentTarget.getBoundingClientRect();
      const relX = (ev.clientX - rect.left) / Math.max(1, rect.width);
      if (relX < 0.36) this.resolveBreakawayMove('deke');
      else if (relX > 0.64) this.resolveBreakawayMove('snipe');
      else this.resolveBreakawayMove('fivehole');
    });

    this.mountEl.querySelectorAll('[data-loot-bag]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-loot-bag') || 0);
        this.pickHockeyBag(idx);
      });
    });

    this.mountEl.querySelector('#btnV14ClaimLootContinue')?.addEventListener('click', () => {
      this.close();
    });
  }

  launch({ reason = '🔥 3 Gold Reads in a Row!', baseBucks = 40 } = {}) {
    if (!this.mountEl) return;
    this.isOpen = true;
    this.phase = 'breakaway';
    this.timeLeft = 6.0;
    this.baseBucks = Math.max(30, Number(baseBucks || 40));
    this.pickedBagIdx = null;
    this.breakawayScored = false;

    // Deterministic-friendly rich Blooket multipliers (1.5x, 2x, 3x)
    const multPool = [
      { mult: 2.0, gearBonus: 'Pro Carbon Stick Tape Token', cityPts: 1 },
      { mult: 3.0, gearBonus: '24K All-Star Locker Drop', cityPts: 1 },
      { mult: 1.5, gearBonus: 'NHL Tour Boarding Stamp', cityPts: 1 }
    ];
    this.bagOptions = multPool;

    const kicker = this.mountEl.querySelector('#v14BlooketKicker');
    const title = this.mountEl.querySelector('#v14BlooketTitle');
    if (kicker) kicker.textContent = reason.toUpperCase();
    if (title) title.textContent = '🚨 6-Second Breakaway Deek-or-Snipe!';

    this.mountEl.querySelector('#v14BreakawayStage')?.classList.remove('hidden');
    this.mountEl.querySelector('#v14LootBagsStage')?.classList.add('hidden');
    this.mountEl.querySelector('#v14BagRevealSummary')?.classList.add('hidden');
    this.mountEl.querySelectorAll('[data-loot-bag]').forEach((btn, idx) => {
      btn.disabled = false;
      btn.innerHTML = `
        <span class="text-3xl sm:text-4xl inline-block animate-bounce">🎒</span>
        <span class="text-xs font-black text-amber-300">Hockey Bag #${idx + 1}</span>
        <span class="text-[10px] font-bold text-slate-300">Tap to Unzip!</span>
      `;
    });

    this.mountEl.classList.remove('hidden');
    this._lastTs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this._loopBreakaway();
  }

  _loopBreakaway() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (!this.isOpen || this.phase !== 'breakaway') return;
    this._rafId = requestAnimationFrame((ts) => {
      if (!this.isOpen || this.phase !== 'breakaway') return;
      const dt = Math.min(0.1, Math.max(0, (ts - this._lastTs) / 1000));
      this._lastTs = ts;
      this.timeLeft = Math.max(0, this.timeLeft - dt);
      this.goalieOffset = Math.sin(ts * 0.004) * 44;

      const clk = this.mountEl?.querySelector('#v14BlooketClockBadge');
      if (clk) clk.textContent = `⏱️ ${this.timeLeft.toFixed(1)}s`;
      this._drawBreakawayCanvas(ts);

      if (this.timeLeft <= 0) {
        this.resolveBreakawayMove('snipe');
        return;
      }
      this._loopBreakaway();
    });
  }

  _drawBreakawayCanvas(ts = 0) {
    const c = this.mountEl?.querySelector('#v14BreakawayCanvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    const w = (c.width = 520);
    const h = (c.height = 240);

    // Crisp white crease ice
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // Red goal line & blue paint crease
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(0, 56, w, 4);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(w / 2, 58, 66, 0, Math.PI, false);
    ctx.fill();
    ctx.stroke();

    // Goal frame
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 5;
    ctx.strokeRect(w / 2 - 78, 16, 156, 42);

    // Target bullseyes in corners + five-hole
    for (const tx of [w / 2 - 58, w / 2, w / 2 + 58]) {
      ctx.beginPath();
      ctx.arc(tx, 38, 13, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(20, 184, 166, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#0D9488';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Sliding Goalie Token
    const gx = w / 2 + this.goalieOffset;
    ctx.beginPath();
    ctx.arc(gx, 74, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#DC2626';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('G', gx, 74);

    // Approaching Teal "YOU" Breakaway Skater + Puck
    const sy = 192 - (6 - this.timeLeft) * 8;
    ctx.beginPath();
    ctx.arc(w / 2, sy, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#0D9488';
    ctx.fill();
    ctx.strokeStyle = '#0F2942';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('YOU', w / 2, sy);

    ctx.beginPath();
    ctx.arc(w / 2 + Math.sin(ts * 0.01) * 14, sy - 28, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#090D16';
    ctx.fill();
  }

  resolveBreakawayMove(moveType = 'deke') {
    if (this.phase !== 'breakaway') return;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this.phase = 'bags';
    this.breakawayScored = true;
    this.baseBucks += 20;

    this.mountEl.querySelector('#v14BreakawayStage')?.classList.add('hidden');
    this.mountEl.querySelector('#v14LootBagsStage')?.classList.remove('hidden');

    const title = this.mountEl.querySelector('#v14BlooketTitle');
    const clk = this.mountEl.querySelector('#v14BlooketClockBadge');
    const banner = this.mountEl.querySelector('#v14BreakawayResultBanner');
    if (title) title.textContent = '🎒 Pick 1 of 3 Shaking Hockey Bags!';
    if (clk) clk.textContent = '🚨 GOAL!';
    if (banner) {
      const moveLabel = moveType === 'deke'
        ? 'Silky Forehand-Backhand Deke'
        : (moveType === 'fivehole' ? 'Quick Five-Hole Slip' : 'Bar-Down Glove Snipe');
      banner.textContent = `🚨 LIGHT THE LAMP! ${moveLabel} (+20 Breakaway Bonus)! Pick a Hockey Bag to multiply your Puck Bucks!`;
    }
  }

  pickHockeyBag(idx = 0) {
    if (this.pickedBagIdx !== null) return;
    this.pickedBagIdx = idx;
    const chosen = this.bagOptions[idx] || this.bagOptions[0];
    const totalBucks = Math.round(this.baseBucks * chosen.mult);
    const bonusIq = 15;

    this.mountEl.querySelectorAll('[data-loot-bag]').forEach((btn, bIdx) => {
      btn.disabled = true;
      const opt = this.bagOptions[bIdx];
      const picked = bIdx === idx;
      btn.className = picked
        ? 'p-3 rounded-2xl bg-emerald-950 border-2 border-emerald-400 flex flex-col items-center justify-center gap-1 shadow-xl'
        : 'p-3 rounded-2xl bg-slate-900/60 border border-slate-700 opacity-75 flex flex-col items-center justify-center gap-1';
      btn.innerHTML = `
        <span class="text-2xl">${picked ? '🏆' : '🎒'}</span>
        <span class="text-xs font-black ${picked ? 'text-emerald-300' : 'text-slate-300'}">${opt.mult}x Multiplier</span>
        <span class="text-[10px] font-bold text-amber-300">+$${Math.round(this.baseBucks * opt.mult)} Bucks</span>
      `;
    });

    const summaryBox = this.mountEl.querySelector('#v14BagRevealSummary');
    const hl = this.mountEl.querySelector('#v14BagRevealHeadline');
    const sub = this.mountEl.querySelector('#v14BagRevealSub');
    if (summaryBox) summaryBox.classList.remove('hidden');
    if (hl) hl.textContent = `🎉 ${chosen.mult}x BLOOKET JACKPOT: +$${totalBucks} Puck Bucks & +${bonusIq} Bonus IQ!`;
    if (sub) sub.textContent = `Unlocked: ${chosen.gearBonus} • +${chosen.cityPts} NHL City Tour Progress Credited!`;

    if (typeof this.onRewardCredited === 'function') {
      this.onRewardCredited({
        bagIndex: idx,
        multiplier: chosen.mult,
        puckBucksAwarded: totalBucks,
        iqAwarded: bonusIq,
        gearBonus: chosen.gearBonus,
        cityProgressPts: chosen.cityPts
      });
    }
  }

  close() {
    this.isOpen = false;
    this.phase = 'done';
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this.mountEl) this.mountEl.classList.add('hidden');
  }
}

export class DrillCatalogDrawerController {
  constructor({ mountEl, catalog, getProfile, onSelectDrill, onLaunchDaily5, onImportDrills }) {
    this.mountEl = mountEl;
    this.catalog = catalog;
    this.getProfile = getProfile;
    this.onSelectDrill = onSelectDrill;
    this.onLaunchDaily5 = onLaunchDaily5;
    this.onImportDrills = onImportDrills;

    this.filters = {
      query: '',
      zone: 'ALL',
      mode: 'ALL',
      position: 'ALL',
      ageTier: 'ALL',
      status: 'ALL'
    };

    this._buildDom();
  }

  _buildDom() {
    if (!this.mountEl) return;
    this.mountEl.innerHTML = `
      <div id="v14CatalogBackdrop" class="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex justify-end">
        <div class="w-full max-w-2xl h-full bg-[#090D16] border-l-2 border-teal-400/70 shadow-2xl flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="p-3.5 pr-28 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div class="text-[10px] font-black uppercase tracking-widest text-teal-400">45-CONCEPT TAXONOMY &amp; 9-MODE ENGINE</div>
              <h3 class="text-base font-black text-white">📚 Drill Catalog &amp; 5-Zone Skill Rings</h3>
            </div>
            <div class="flex items-center gap-2">
              <button id="btnV14LaunchDaily5Shift" type="button" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black text-xs shadow cursor-pointer">
                ⚡ Daily 5 Shift
              </button>
              <button id="btnV14OpenImportModal" type="button" class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-sky-400/70 text-sky-200 font-black text-xs cursor-pointer">
                📥 Import Drills JSON
              </button>
              <button id="btnV14CloseCatalog" type="button" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs cursor-pointer">
                ✕
              </button>
            </div>
          </div>

          <!-- 5-Zone Mastery Rings Summary -->
          <div id="v14DrawerSkillRings" class="p-3 bg-slate-950/70 border-b border-slate-800"></div>

          <!-- Filter Bar -->
          <div class="p-3 bg-[#0C1322] border-b border-slate-800 grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
            <input id="v14CatalogSearchInput" type="text" placeholder="🔍 Search drill or code..." class="col-span-2 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold" />
            <select id="v14FilterZone" class="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-bold">
              <option value="ALL">All Zones</option>
              <option value="DZ">D-Zone (DZ)</option>
              <option value="NZ">Breakouts (NZ)</option>
              <option value="OM">Rushes (OM)</option>
              <option value="OZ">O-Zone (OZ)</option>
              <option value="ST">Special Teams (ST)</option>
            </select>
            <select id="v14FilterMode" class="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-bold">
              <option value="ALL">All 9 Modes</option>
              ${CANONICAL_9_MODES.map(m => `<option value="${m}">${MODE_LABELS[m] || m}</option>`).join('')}
            </select>
            <select id="v14FilterPos" class="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-bold">
              <option value="ALL">All Pos</option>
              ${CANONICAL_5_POSITIONS.map(p => `<option value="${p}">${p}</option>`).join('')}
            </select>
            <select id="v14FilterStatus" class="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-bold">
              <option value="ALL">All Status</option>
              <option value="unplayed">Unplayed</option>
              <option value="watched_reel">Watched Reel</option>
              <option value="practicing">Practicing</option>
              <option value="mastered">Mastered</option>
            </select>
          </div>

          <!-- Scrollable Drill Cards + 45-Concept Roadmap -->
          <div id="v14CatalogListContainer" class="flex-1 overflow-y-auto p-3 space-y-2"></div>

          <!-- Import Drills JSON Validator Modal -->
          <div id="v14ImportDrillsModal" class="hidden absolute inset-0 bg-slate-950/95 p-4 flex flex-col justify-center">
            <div class="max-w-lg w-full mx-auto bg-slate-900 border-2 border-sky-400 rounded-2xl p-4 space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-black text-white">📥 Import &amp; Validate Custom Drills JSON</h4>
                <button id="btnV14CloseImportModal" type="button" class="text-xs font-black text-slate-300 px-2 py-1 rounded bg-slate-800 cursor-pointer">✕</button>
              </div>
              <p class="text-[11px] text-slate-300">Validates <code>[0..1000, 0..500]</code> bounds, <code>briefing &lt;= 120</code>, <code>coachTip &lt;= 110</code>, 3-beat <code>lessonReel</code>, and 9-mode <code>modeConfig</code>.</p>
              <textarea id="v14ImportJsonTextarea" rows="6" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-teal-200" placeholder='Paste a single drill object { "id": "..." } or { "drills": [...] }'></textarea>
              <div id="v14ImportValidationMsg" class="hidden p-2.5 rounded-xl text-xs font-bold"></div>
              <div class="flex justify-end gap-2">
                <button id="btnV14ValidateAndImport" type="button" class="px-4 py-2 rounded-xl bg-teal-400 text-slate-950 font-black text-xs cursor-pointer">
                  ✅ Validate &amp; Add Drills
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.mountEl.querySelector('#btnV14CloseCatalog')?.addEventListener('click', () => this.close());
    this.mountEl.querySelector('#btnV14LaunchDaily5Shift')?.addEventListener('click', () => {
      this.close();
      if (typeof this.onLaunchDaily5 === 'function') this.onLaunchDaily5();
    });
    this.mountEl.querySelector('#btnV14OpenImportModal')?.addEventListener('click', () => {
      this.mountEl.querySelector('#v14ImportDrillsModal')?.classList.remove('hidden');
    });
    this.mountEl.querySelector('#btnV14CloseImportModal')?.addEventListener('click', () => {
      this.mountEl.querySelector('#v14ImportDrillsModal')?.classList.add('hidden');
    });
    this.mountEl.querySelector('#btnV14ValidateAndImport')?.addEventListener('click', () => {
      this._handleJsonImport();
    });

    const bindFilter = (sel, key) => {
      this.mountEl.querySelector(sel)?.addEventListener('input', (ev) => {
        this.filters[key] = ev.currentTarget.value;
        this.renderList();
      });
    };
    bindFilter('#v14CatalogSearchInput', 'query');
    bindFilter('#v14FilterZone', 'zone');
    bindFilter('#v14FilterMode', 'mode');
    bindFilter('#v14FilterPos', 'position');
    bindFilter('#v14FilterStatus', 'status');
  }

  _handleJsonImport() {
    const rawText = this.mountEl.querySelector('#v14ImportJsonTextarea')?.value || '';
    const msgEl = this.mountEl.querySelector('#v14ImportValidationMsg');
    if (!msgEl) return;
    msgEl.classList.remove('hidden');
    try {
      const parsed = JSON.parse(rawText);
      const list = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.drills) ? parsed.drills : [parsed]);
      const errors = [];
      list.forEach((d, i) => {
        const res = validateDrillSchema(d);
        if (!res.valid) errors.push(`Drill #${i + 1} (${d.id || '?'}): ${res.errors.join(', ')}`);
      });
      if (errors.length > 0) {
        msgEl.className = 'p-2.5 rounded-xl bg-rose-950 border border-rose-400 text-rose-200 text-xs font-bold';
        msgEl.textContent = `❌ Validation Failed: ${errors.join(' | ')}`;
        return;
      }
      if (typeof this.onImportDrills === 'function') this.onImportDrills(list);
      msgEl.className = 'p-2.5 rounded-xl bg-emerald-950 border border-emerald-400 text-emerald-200 text-xs font-bold';
      msgEl.textContent = `✅ Validated & Imported ${list.length} drill(s) into live catalog!`;
      this.renderList();
    } catch (err) {
      msgEl.className = 'p-2.5 rounded-xl bg-rose-950 border border-rose-400 text-rose-200 text-xs font-bold';
      msgEl.textContent = `❌ Invalid JSON syntax: ${err.message}`;
    }
  }

  open() {
    if (!this.mountEl) return;
    this.mountEl.classList.remove('hidden');
    this.renderList();
  }

  close() {
    if (!this.mountEl) return;
    this.mountEl.classList.add('hidden');
  }

  renderList() {
    if (!this.mountEl) return;
    const prof = typeof this.getProfile === 'function' ? this.getProfile() : {};
    const ringsBox = this.mountEl.querySelector('#v14DrawerSkillRings');
    if (ringsBox) {
      ringsBox.innerHTML = renderZoneSkillRingsHtml(prof, this.catalog, { compact: true });
    }

    const listEl = this.mountEl.querySelector('#v14CatalogListContainer');
    if (!listEl) return;

    const q = (this.filters.query || '').trim().toLowerCase();
    const drills = (this.catalog?.drills || []).filter((d) => {
      if (this.filters.zone !== 'ALL' && d.zone !== this.filters.zone) return false;
      if (this.filters.mode !== 'ALL' && d.mode !== this.filters.mode) return false;
      if (this.filters.position !== 'ALL' && d.youRole !== this.filters.position) return false;
      const st = getConceptStatus(prof, d.conceptId);
      if (this.filters.status === 'unplayed' && st.attempts > 0) return false;
      if (this.filters.status !== 'ALL' && this.filters.status !== 'unplayed' && st.state !== this.filters.status) return false;
      if (q && !`${d.id} ${d.conceptId} ${d.title} ${d.mode}`.toLowerCase().includes(q)) return false;
      return true;
    });

    listEl.innerHTML = drills.map((d) => {
      const st = getConceptStatus(prof, d.conceptId);
      const badge = st.state === 'mastered'
        ? '⭐ Mastered (8/10)'
        : (st.state === 'practicing' ? `🏒 Practicing (${st.goldOfLast10}/10)` : (st.state === 'watched_reel' ? '🎬 Watched Reel' : '✨ New'));
      return `
        <div data-catalog-drill-card="${d.id}" class="p-3 rounded-xl bg-slate-900/95 border border-slate-800 hover:border-teal-400/70 flex flex-wrap items-center justify-between gap-2 transition">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] font-mono font-black text-teal-300">${d.conceptId}</span>
              <span class="text-[10px] font-black text-amber-300">${MODE_LABELS[d.mode] || d.mode}</span>
              <span class="text-[10px] font-bold text-slate-400">• YOU: ${d.youRole} • ${d.ageTier} • ${badge}</span>
            </div>
            <div class="text-xs sm:text-sm font-black text-white mt-0.5">${d.title}</div>
            <div class="text-[11px] text-slate-300 truncate">${d.briefing}</div>
          </div>
          <button type="button" data-launch-drill-id="${d.id}" class="px-3.5 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs shrink-0 cursor-pointer">
            ▶ Play
          </button>
        </div>
      `;
    }).join('') || `<div class="p-4 text-center text-xs font-bold text-slate-400">No drills match your current filters.</div>`;

    listEl.querySelectorAll('[data-launch-drill-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-launch-drill-id');
        const found = (this.catalog?.drills || []).find(x => x.id === id);
        if (found) {
          this.close();
          if (typeof this.onSelectDrill === 'function') this.onSelectDrill(found);
        }
      });
    });
  }
}
