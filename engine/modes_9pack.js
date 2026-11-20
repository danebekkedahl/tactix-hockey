/**
 * SYNAPZ HOCKEY v15.2 — All 9 Subconscious Game Modes + Failsafe Live Motion & Ghost Scrubber
 * (`engine/modes_9pack.js`)
 *
 * Unified 5-Stage Lifecycle across ALL 45/45 drills & 9/9 modes:
 *  Stage 1 (`pre_snap`):      Pre-Snap "YOU" Gold/Teal Halo + DROP PUCK + Untimed Toggle
 *  Stage 2 (`live_motion`):   Live 1000×500 Skater & Puck Motion (60fps, 0 dead freezes!)
 *  Stage 3 (`challenge`):     >= 44px Mode-Native On-Ice & Dock Interactive Targets + Micro-Instruction
 *  Stage 4 (`outcome_movie`): Live Payoff / Turnover Consequence Movie
 *  Stage 5 (`debrief_dock`):  Outcome Banner + <=15w Coach Rule + Timeline Scrubber + [👻 My Play] / [⭐ Best Play] Toggle
 */

import { WhiteIceRink1000x500, samplePolylineAt, normalizeDrillLineup } from './rink_1000x500.js';

export const MODE_LABELS = Object.freeze({
  read_and_react: '❄️ Freeze & Decide',
  ghost_player: '🛡️ Lock the Slot',
  fog_of_war: '👀 Shoulder-Check Scan',
  two_touch: '⚡ Two-Touch Chain',
  spot_the_breakdown: '⏪ Goal Rewind Detective',
  gap_surfing: '🌊 1-on-1 Gap Surfing',
  lane_sweeper: '🏒 Active Stick PK Denial',
  draw_the_route: '✏️ Sketch Your Support Cut',
  change_or_stay: '🏃 Shift Fatigue Bench IQ'
});

function dist2D(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function pointToSegmentDist(p, a, b) {
  const vx = b[0] - a[0];
  const vy = b[1] - a[1];
  const wx = p[0] - a[0];
  const wy = p[1] - a[1];
  const c1 = vx * wx + vy * wy;
  if (c1 <= 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const c2 = vx * vx + vy * vy;
  if (c2 <= c1) return Math.hypot(p[0] - b[0], p[1] - b[1]);
  const t = c1 / c2;
  return Math.hypot(p[0] - (a[0] + t * vx), p[1] - (a[1] + t * vy));
}

export function escapeHtmlText(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildPlainKidQuestionHtml(drill) {
  if (!drill) return '';
  const qRaw = String(drill.briefing || drill.title || '').trim();
  const q = escapeHtmlText(qRaw);
  switch (drill.mode) {
    case 'read_and_react':
      return `<span class="text-amber-300">❓ QUESTION:</span> <span class="text-white">${q} — </span><span class="text-amber-200">Tap the best ice target (A, B, or C)!</span>`;
    case 'ghost_player':
      return `<span class="text-amber-300">🎯 YOUR JOB:</span> <span class="text-white">Drag </span><span class="text-teal-300">YOUR glowing skater</span><span class="text-white"> to stay inside THIS SPACE! (${q})</span>`;
    case 'spot_the_breakdown':
      return `<span class="text-amber-300">🕵️ DETECTIVE:</span> <span class="text-white">Watch the goal, then </span><span class="text-amber-200">tap the defender who blew coverage!</span> <span class="text-slate-200">(${q})</span>`;
    case 'fog_of_war':
      return `<span class="text-amber-300">👀 YOUR JOB:</span> <span class="text-white">Tap </span><span class="text-amber-200">SCAN</span><span class="text-white"> to check your blind spot, then tap the open pass target! (${q})</span>`;
    case 'two_touch':
      return `<span class="text-amber-300">⚡ TWO-TOUCH:</span> <span class="text-white">Tap </span><span class="text-amber-200">Pass #1</span><span class="text-white"> then </span><span class="text-amber-200">Pass #2</span><span class="text-white"> BEFORE the puck hits your stick! (${q})</span>`;
    case 'gap_surfing':
      return `<span class="text-amber-300">🛡️ GAP CONTROL:</span> <span class="text-white">Slide backward to hold the green gap, then tap </span><span class="text-amber-200">POKE</span><span class="text-white"> at the blue line! (${q})</span>`;
    case 'lane_sweeper':
      return `<span class="text-amber-300">🏒 ACTIVE STICK:</span> <span class="text-white">Drag to angle your stick and block cross-ice seam passes! (${q})</span>`;
    case 'draw_the_route':
      return `<span class="text-amber-300">✏️ DRAW ROUTE:</span> <span class="text-white">Drag your skating route into </span><span class="text-emerald-300">THIS SPACE</span><span class="text-white"> on time and onside! (${q})</span>`;
    case 'change_or_stay':
      return `<span class="text-amber-300">⏱️ BENCH IQ:</span> <span class="text-white">Legs are tired — tap </span><span class="text-amber-200">CHANGE NOW</span><span class="text-white"> or </span><span class="text-emerald-300">STAY &amp; DEFEND</span><span class="text-white">! (${q})</span>`;
    default:
      return `<span class="text-amber-300">❓ QUESTION:</span> <span class="text-white">${q}</span>`;
  }
}

/**
 * Failsafe Watchdog: guarantees valid coordinates, trajectories, and interactive targets
 * across all 9 modes even if an optional/custom drill field is missing.
 */
export function ensureSafeDrillForEngine(drillRaw) {
  const base = normalizeDrillLineup(drillRaw || {});
  const mode = base.mode || 'read_and_react';
  const rawMc = (base.modeConfig && typeof base.modeConfig === 'object') ? { ...base.modeConfig } : {};
  const homeFieldSkaters = (base.skaters || []).filter(s => s.team === 'home' && s.id !== 'G');
  const awayFieldSkaters = (base.skaters || []).filter(s => s.team === 'away' && s.id !== 'G');
  const youSk = homeFieldSkaters.find(s => s.id === base.youRole) || homeFieldSkaters[0] || { id: 'C', start: [240, 250], motion: [[240, 250], [260, 240]] };
  const mates = homeFieldSkaters.filter(s => s.id !== youSk.id);

  if (mode === 'read_and_react' || mode === 'fog_of_war') {
    if (!Array.isArray(rawMc.options) || rawMc.options.length === 0) {
      const m1 = mates[0]?.motion?.[mates[0].motion.length - 1] || [320, 150];
      const m2 = mates[1]?.motion?.[mates[1].motion.length - 1] || [320, 350];
      const m3 = mates[2]?.motion?.[mates[2].motion.length - 1] || [220, 250];
      rawMc.options = [
        { id: 'A', label: 'Hit open weak-side support', target: [...m1], isGold: true, pathType: 'pass' },
        { id: 'B', label: 'Force into sealed strong wall', target: [...m2], isGold: false, pathType: 'pass' },
        { id: 'C', label: 'Hold into heavy pressure', target: [...m3], isGold: false, pathType: 'skate' }
      ];
    } else if (!rawMc.options.some(o => o && o.isGold)) {
      rawMc.options[0] = { ...rawMc.options[0], isGold: true };
    }
    if (mode === 'read_and_react' && (!rawMc.freezeTime || rawMc.freezeTime <= 0)) {
      rawMc.freezeTime = 1.5;
    }
    if (mode === 'fog_of_war') {
      if (!rawMc.passArrivalTime || rawMc.passArrivalTime <= 0) rawMc.passArrivalTime = 1.8;
      if (!rawMc.fogRegion) rawMc.fogRegion = { x: 240, y: 30, w: 210, h: 180, label: 'BLIND-SIDE FOG — TAP SCAN!' };
    }
  } else if (mode === 'ghost_player') {
    if (!Array.isArray(rawMc.targetZoneKeyframes) || rawMc.targetZoneKeyframes.length === 0) {
      rawMc.targetZoneKeyframes = [
        { t: 0, x: youSk.start[0] + 25, y: 250, rx: 52, ry: 42, label: 'THIS SPACE' },
        { t: 1, x: youSk.start[0] + 45, y: 235, rx: 52, ry: 42, label: 'THIS SPACE' }
      ];
    }
  } else if (mode === 'two_touch') {
    if (!Array.isArray(rawMc.candidates) || rawMc.candidates.length < 2) {
      const c1 = mates[0] || { id: 'C', start: [310, 210] };
      const c2 = mates[1] || { id: 'RW', start: [410, 140] };
      rawMc.candidates = [
        { id: c1.id, label: `${c1.id} Support`, target: [...(c1.motion?.[c1.motion.length - 1] || c1.start)] },
        { id: c2.id, label: `${c2.id} Outlet`, target: [...(c2.motion?.[c2.motion.length - 1] || c2.start)] }
      ];
    }
    if (!Array.isArray(rawMc.goldSequence) || rawMc.goldSequence.length < 2) {
      rawMc.goldSequence = [rawMc.candidates[0].id, rawMc.candidates[1].id];
    }
  } else if (mode === 'spot_the_breakdown') {
    if (!Array.isArray(rawMc.suspects) || rawMc.suspects.length < 2) {
      rawMc.suspects = homeFieldSkaters.slice(0, 3).map((s, idx) => ({
        id: s.id,
        roleLabel: `${s.id}`,
        reason: idx === 0 ? 'Left assignment open in slot' : 'Held proper leverage'
      }));
    }
    if (!rawMc.culpritId) rawMc.culpritId = rawMc.suspects[0]?.id || youSk.id;
  } else if (mode === 'gap_surfing') {
    if (!rawMc.attackerId) rawMc.attackerId = awayFieldSkaters[0]?.id || 'F1';
    if (!rawMc.idealGapDist) rawMc.idealGapDist = 82;
    if (!rawMc.gapTolerance) rawMc.gapTolerance = 48;
    if (!Array.isArray(rawMc.pokeWindowX)) rawMc.pokeWindowX = [300, 460];
  } else if (mode === 'lane_sweeper') {
    if (!Array.isArray(rawMc.pivotOrigin)) rawMc.pivotOrigin = [...youSk.start];
    if (!Array.isArray(rawMc.passes) || rawMc.passes.length === 0) {
      rawMc.passes = [
        { tStart: 0.3, tEnd: 1.4, from: [260, 110], to: [260, 380], isThreat: true, label: 'CROSS-SEAM THREAT!' }
      ];
    }
  } else if (mode === 'draw_the_route') {
    if (!rawMc.thisSpace) {
      const mEnd = youSk.motion?.[youSk.motion.length - 1] || [youSk.start[0] + 90, youSk.start[1] - 40];
      rawMc.thisSpace = { x: mEnd[0], y: mEnd[1], r: 54, label: 'THIS SPACE' };
    }
    if (!Array.isArray(rawMc.idealRoute) || rawMc.idealRoute.length < 2) {
      rawMc.idealRoute = [[...youSk.start], [rawMc.thisSpace.x, rawMc.thisSpace.y]];
    }
  } else if (mode === 'change_or_stay') {
    if (rawMc.correctAction !== 'change' && rawMc.correctAction !== 'stay') {
      rawMc.correctAction = 'stay';
    }
    if (!Array.isArray(rawMc.benchPos)) rawMc.benchPos = [500, 16];
    if (!rawMc.fatiguePct) rawMc.fatiguePct = 86;
  }

  return {
    ...base,
    mode,
    modeConfig: rawMc
  };
}

export class Subconscious9ModeEngine {
  constructor({ mountEl, onRepEvaluated, onNextRep, onOpenChalkReel, onOpenCatalog, onUntimedChange, onRoleSync, onStageChange, getFederationMode }) {
    this.mountEl = mountEl;
    this.onRepEvaluated = onRepEvaluated;
    this.onNextRep = onNextRep;
    this.onOpenChalkReel = onOpenChalkReel;
    this.onOpenCatalog = onOpenCatalog;
    this.onUntimedChange = onUntimedChange;
    this.onRoleSync = onRoleSync;
    this.onStageChange = onStageChange;
    this.getFederationMode = getFederationMode || (() => 'USA');

    this.drill = null;
    this.stage = 'pre_snap'; // pre_snap | live_motion | challenge | outcome_movie | debrief_dock
    this.untimed = false;
    this.isPausedByModal = false;
    this.orientationPref = 'auto';
    this._rafId = null;
    this._lastTs = 0;

    // Runtime mode state
    this.simTime = 0;
    this.ambientElapsed = 0;
    this.outcomeElapsed = 0;
    this.outcomeDuration = 1.6;
    this.isGoldResult = false;
    this.resultDetail = '';
    this.earnedIq = 0;
    this.earnedBucks = 0;
    this.lastLiveSnapshot = null;

    // Mode-specific trackers
    this.youCurrentPos = [500, 250];
    this.pointerDragging = false;
    this.coverageFramesIn = 0;
    this.coverageFramesTotal = 0;
    this.coveragePct = 100;
    this.fogScannedInTime = false;
    this.fogLiftRemainingSec = 0;
    this.fogReadyForChoice = false;
    this.twoTouchPicked = [];
    this.rewindPhase = 'watching_goal';
    this.rewindProgress = 0;
    this.gapFramesGood = 0;
    this.gapFramesTotal = 0;
    this.stickSweepAngleRad = Math.PI * 0.55;
    this.sweptHarmlessMistake = false;
    this.sweptThreatSuccess = false;
    this.drawnRoutePoints = [];
    this.isDrawingRoute = false;
    this._overlaySig = '';

    // Stage 5 Ghost Scrubber state
    this.ghostViewMode = 'my_play';
    this.scrubProgress = 1.0;
    this.totalTimelineSec = 4.5;
    this.recordedMyYouPath = [];

    this._buildDom();
    this._bindEvents();
  }

  _buildDom() {
    if (!this.mountEl) return;
    this.mountEl.innerHTML = `
      <div id="v14GameStageShell" class="w-full h-full rounded-2xl bg-[#090D16] border border-slate-800 shadow-2xl overflow-hidden flex flex-col select-none">
        <!-- Pure Tunnel-Vision Mode Strip (0 Host Showdown, 0 Join PIN, 0 Catalog, 0 Daily 5!) -->
        <div id="v14TopModeHeader" class="px-3 py-1.5 bg-slate-950/95 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-1.5 min-w-0">
            <span id="v14ModeBadgePill" class="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/70 text-teal-300 text-[10px] sm:text-[11px] font-black uppercase whitespace-nowrap">
              ❄️ Freeze &amp; Decide
            </span>
            <span id="v14ConceptCodePill" class="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-mono font-black">
              DZ-01
            </span>
            <span id="v14DrillTitleLabel" class="text-xs sm:text-sm font-black text-white truncate max-w-[210px] sm:max-w-[360px]">
              Wheel vs. Reverse Behind Net
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <div id="v14LiveMeterWrap" class="hidden flex items-center gap-1.5">
              <span id="v14LiveMeterLabel" class="text-[10px] font-black uppercase text-emerald-300">COVERAGE</span>
              <div class="w-20 h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                <div id="v14LiveMeterFill" class="h-full bg-emerald-400 transition-all duration-75" style="width: 80%;"></div>
              </div>
              <span id="v14LiveMeterPct" class="text-[11px] font-black text-white">80%</span>
            </div>
            <span id="v14StreakPill" class="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 text-[11px] font-black">
              🔥 x0
            </span>
            <button id="btnV14ReplayChalkReel" type="button" class="px-2.5 py-1 rounded-full bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/70 text-teal-200 text-[10px] sm:text-[11px] font-black transition cursor-pointer">
              🎬 Watch 12s Reel
            </button>
          </div>
        </div>
        <p id="v14BriefingText" class="hidden"></p>

        <!-- Main Zoomed White-Ice 1000×500 Canvas + >= 44px Interactive On-Ice Target Layer -->
        <div class="relative w-full flex-1 min-h-0 bg-[#090D16] px-2 py-1.5 flex flex-col justify-center">
          <div id="v14CanvasAspectBox" class="relative w-full h-full mx-auto overflow-hidden rounded-xl" style="aspect-ratio: 16 / 9; max-height: calc(100vh - 210px); max-height: calc(100dvh - 210px); min-height: 215px;">
            <canvas id="v14RinkCanvas" class="w-full h-full block cursor-pointer" style="touch-action: none;"></canvas>

            <!-- >= 44px On-Ice Interactive Target Overlay (Synced to logical coordinates) -->
            <div id="v14OnIceInteractiveLayer" class="absolute inset-0 pointer-events-none z-10"></div>

            <!-- Stage 1 Pre-Snap Floating DROP PUCK Pill -->
            <div id="v14PreSnapOverlay" class="absolute inset-x-0 bottom-3 flex items-center justify-center pointer-events-none px-3 z-20">
              <button id="btnV14DropPuck" type="button" class="pointer-events-auto min-h-[48px] py-2.5 px-7 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-sm sm:text-base shadow-2xl border-2 border-white/80 transition cursor-pointer">
                🏒 DROP PUCK ➔
              </button>
            </div>
          </div>
        </div>

        <!-- Mode-Native >= 44px Interactive Controls Dock (Stages 2 & 3) -->
        <div id="v14ModeControlsDock" class="px-3 py-2 bg-slate-950 border-t border-slate-800/90 min-h-[58px] flex flex-col justify-center"></div>

        <!-- Universal Stage 5 Tactical Debrief Scrubber Dock -->
        <div id="v14DebriefDock" class="hidden px-3.5 py-2.5 bg-slate-950 border-t-2 border-teal-400/80 space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span id="v14DebriefOutcomeBanner" class="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs sm:text-sm font-black">
                🏆 CLEAN PLAY! +25 IQ
              </span>
              <span id="v14DebriefSubDetail" class="text-[11px] font-bold text-slate-300"></span>
            </div>
            <div class="flex items-center gap-1.5">
              <button id="btnV14GhostMyPlay" type="button" class="min-h-[38px] px-3 py-1.5 rounded-lg text-[11px] font-black border cursor-pointer">
                👻 My Play
              </button>
              <button id="btnV14GhostBestPlay" type="button" class="min-h-[38px] px-3 py-1.5 rounded-lg text-[11px] font-black border cursor-pointer">
                ⭐ Best Play
              </button>
            </div>
          </div>

          <!-- 1-Sentence Vertical-Bar Coach Rule (<= 15 words) -->
          <div id="v14DebriefCoachRule" class="pl-3 border-l-4 border-teal-400 text-xs sm:text-sm font-extrabold text-white leading-snug"></div>

          <!-- Draggable Timeline Scrubber (0.0s -> end) + Retry / Next Rep -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-0.5">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <span class="text-[10px] font-black uppercase text-slate-400 shrink-0">Scrub</span>
              <input id="v14TimelineScrubber" type="range" min="0" max="100" value="100" class="w-full accent-teal-400 cursor-pointer" />
              <span id="v14TimelineScrubLabel" class="text-[11px] font-mono font-black text-teal-300 shrink-0 w-20 text-right">4.5s / 4.5s</span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button id="btnV14RetryRep" type="button" class="min-h-[44px] py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-black text-xs cursor-pointer">
                ↺ Retry
              </button>
              <button id="btnV14NextRep" type="button" class="min-h-[44px] py-2 px-5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg cursor-pointer">
                Next Rep ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const canvas = this.mountEl.querySelector('#v14RinkCanvas');
    this.rink = new WhiteIceRink1000x500(canvas, { federationMode: this.getFederationMode() });
  }

  _bindEvents() {
    if (!this.mountEl) return;
    const canvas = this.mountEl.querySelector('#v14RinkCanvas');

    this.mountEl.querySelector('#btnV14DropPuck')?.addEventListener('click', () => {
      this.dropPuck();
    });

    this.mountEl.querySelector('#btnV14UntimedToggle')?.addEventListener('click', () => {
      this.setUntimed(!this.untimed, true);
    });

    this.mountEl.querySelector('#btnV14ReplayChalkReel')?.addEventListener('click', () => {
      this.stopLoop();
      if (typeof this.onOpenChalkReel === 'function' && this.drill) {
        this.onOpenChalkReel(this.drill);
      }
    });

    this.mountEl.querySelector('#btnV14GhostMyPlay')?.addEventListener('click', () => {
      this.setGhostViewMode('my_play');
    });

    this.mountEl.querySelector('#btnV14GhostBestPlay')?.addEventListener('click', () => {
      this.setGhostViewMode('best_play');
    });

    this.mountEl.querySelector('#v14TimelineScrubber')?.addEventListener('input', (ev) => {
      const val = Number(ev.currentTarget.value || 100);
      this.setScrubProgress(val / 100);
    });

    this.mountEl.querySelector('#btnV14RetryRep')?.addEventListener('click', () => {
      if (this.drill) this.loadDrill(this.drill, { autoDrop: true });
    });

    this.mountEl.querySelector('#btnV14NextRep')?.addEventListener('click', () => {
      if (typeof this.onNextRep === 'function') this.onNextRep();
    });

    // Unified W3C Pointer Events on White-Ice Canvas
    if (canvas) {
      canvas.addEventListener('pointerdown', (ev) => this._onCanvasPointerDown(ev));
      canvas.addEventListener('pointermove', (ev) => this._onCanvasPointerMove(ev));
      canvas.addEventListener('pointerup', (ev) => this._onCanvasPointerUp(ev));
      canvas.addEventListener('pointercancel', (ev) => this._onCanvasPointerUp(ev));
    }

    // PC Keyboard Parity (Space = Scan/Drop, 1/2/3 or A/B/C = Choice, Arrows = Skate/Gap)
    if (typeof window !== 'undefined') {
      this._keyHandler = (ev) => {
        if (!this.drill || !this.mountEl || this.mountEl.offsetParent === null) return;
        const tag = (ev.target && ev.target.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

        if (ev.code === 'Space') {
          if (this.stage === 'pre_snap') {
            ev.preventDefault();
            this.dropPuck();
          } else if (this.drill.mode === 'fog_of_war' && (this.stage === 'live_motion' || this.stage === 'challenge')) {
            ev.preventDefault();
            this.triggerShoulderCheckScan();
          }
        } else if (this.stage === 'challenge' && (this.drill.mode === 'read_and_react' || (this.drill.mode === 'fog_of_war' && this.fogReadyForChoice))) {
          const k = ev.key.toUpperCase();
          if (k === 'A' || k === '1') this.submitAbcOption('A');
          else if (k === 'B' || k === '2') this.submitAbcOption('B');
          else if (k === 'C' || k === '3') this.submitAbcOption('C');
        } else if (this.stage === 'challenge' && (this.drill.mode === 'ghost_player' || this.drill.mode === 'gap_surfing')) {
          const step = 18;
          if (ev.key === 'ArrowLeft') this.youCurrentPos[0] = Math.max(40, this.youCurrentPos[0] - step);
          if (ev.key === 'ArrowRight') this.youCurrentPos[0] = Math.min(960, this.youCurrentPos[0] + step);
          if (ev.key === 'ArrowUp') this.youCurrentPos[1] = Math.max(30, this.youCurrentPos[1] - step);
          if (ev.key === 'ArrowDown') this.youCurrentPos[1] = Math.min(470, this.youCurrentPos[1] + step);
        }
      };
      window.addEventListener('keydown', this._keyHandler);
      window.addEventListener('resize', () => {
        if (this.drill && this.mountEl && this.mountEl.offsetParent !== null) {
          this._syncCanvasOrientation();
          this._renderCurrentFrame();
        }
      });
    }
  }

  setUntimed(val, notify = false) {
    this.untimed = Boolean(val);
    this._syncUntimedBtn();
    this._renderCurrentFrame();
    if (notify && typeof this.onUntimedChange === 'function') {
      this.onUntimedChange(this.untimed);
    }
  }

  updateStreakBadge(streakCount = 0) {
    const el = this.mountEl?.querySelector('#v14StreakPill');
    if (!el) return;
    el.textContent = `🔥 x${streakCount}`;
    el.className = streakCount >= 2
      ? 'px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black shadow animate-pulse'
      : 'px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 text-[11px] font-black';
  }

  _syncUntimedBtn() {
    const btn = this.mountEl?.querySelector('#btnV14UntimedToggle');
    if (!btn) return;
    btn.textContent = this.untimed ? '🧘 Untimed: ON' : '⏱️ Timed';
    btn.className = this.untimed
      ? 'px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 border border-amber-200 text-[10px] sm:text-[11px] font-black transition cursor-pointer'
      : 'px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] sm:text-[11px] font-black transition cursor-pointer';
  }

  _syncCanvasOrientation() {
    if (!this.rink) return;
    this.rink.setFederationMode(this.getFederationMode());
    const box = this.mountEl?.querySelector('#v14CanvasAspectBox');
    const usePortrait = this.orientationPref === 'portrait';
    this.rink.setOrientation(usePortrait ? 'portrait' : 'landscape');
    if (box) {
      box.style.aspectRatio = usePortrait ? '10 / 12' : '16 / 9';
    }
  }

  stopLoop() {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  pauseForModal() {
    const activeTimerStage = this.stage === 'live_motion' || this.stage === 'challenge' || this.stage === 'outcome_movie';
    if (this._rafId || activeTimerStage) {
      this.isPausedByModal = true;
      this.stopLoop();
      try {
        if (typeof window !== 'undefined' && typeof window.cancelSynapzSpeechExplicit === 'function') {
          window.cancelSynapzSpeechExplicit('tour_close');
        } else if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } catch (_) {}
      return true;
    }
    return false;
  }

  resumeAfterModal() {
    if (!this.isPausedByModal) return false;
    this.isPausedByModal = false;
    if (this.drill && (this.stage === 'live_motion' || this.stage === 'challenge' || this.stage === 'outcome_movie')) {
      this._lastTs = typeof performance !== 'undefined' ? performance.now() : Date.now();
      this._scheduleLoop();
      return true;
    }
    return false;
  }

  getContextSnapshot() {
    if (!this.drill) return null;
    return {
      activeScreen: 'Ice Rink',
      drillId: this.drill.conceptId || this.drill.id || null,
      catalogDrillId: this.drill.id || null,
      drillTitle: this.drill.title || null,
      gameMode: this.drill.mode || null,
      positionRole: this.drill.youRole || null,
      stage: this.stage || 'pre_snap'
    };
  }

  _buildPlainKidQuestionHtml(drill) {
    return buildPlainKidQuestionHtml(drill);
  }

  loadDrill(drillRaw, opts = {}) {
    this.stopLoop();
    this.isPausedByModal = false;
    const drill = ensureSafeDrillForEngine(drillRaw);
    this.drill = drill;
    this.stage = 'pre_snap';
    this.simTime = 0;
    this.ambientElapsed = 0;
    this.outcomeElapsed = 0;
    this.isGoldResult = false;
    this.resultDetail = '';
    this._overlaySig = '';

    if (typeof opts.untimed === 'boolean') {
      this.untimed = opts.untimed;
    }

    const protagonistRole = drill.primaryRole || drill.youRole || 'C';
    drill.primaryRole = protagonistRole;
    drill.youRole = protagonistRole;
    if (typeof this.onRoleSync === 'function') {
      this.onRoleSync(protagonistRole);
    }

    const youSkater = (drill.skaters || []).find(s => s.id === protagonistRole) || drill.skaters[0];
    this.youCurrentPos = [...(youSkater?.start || [500, 250])];
    this.recordedMyYouPath = [[...this.youCurrentPos]];
    this.pointerDragging = false;
    this.coverageFramesIn = 0;
    this.coverageFramesTotal = 0;
    this.coveragePct = 100;
    this.fogScannedInTime = false;
    this.fogLiftRemainingSec = 0;
    this.fogReadyForChoice = false;
    this.twoTouchPicked = [];
    this.rewindPhase = 'watching_goal';
    this.rewindProgress = 0;
    this.gapFramesGood = 0;
    this.gapFramesTotal = 0;
    this.stickSweepAngleRad = 0.35;
    this.sweptHarmlessMistake = false;
    this.sweptThreatSuccess = false;
    this.drawnRoutePoints = [[...this.youCurrentPos]];
    this.isDrawingRoute = false;
    this.ghostViewMode = 'my_play';
    this.scrubProgress = 1.0;

    // Header & Persistent High-Contrast Question/Goal Banner UI
    const modePill = this.mountEl?.querySelector('#v14ModeBadgePill');
    const codePill = this.mountEl?.querySelector('#v14ConceptCodePill');
    const titleEl = this.mountEl?.querySelector('#v14DrillTitleLabel');
    const briefEl = this.mountEl?.querySelector('#v14BriefingText');
    const qBanner = typeof document !== 'undefined' ? document.getElementById('v14ActiveQuestionBanner') : null;
    const qBannerText = typeof document !== 'undefined' ? document.getElementById('v14ActiveQuestionBannerText') : null;
    if (modePill) modePill.textContent = MODE_LABELS[drill.mode] || drill.mode;
    if (codePill) codePill.textContent = drill.conceptId;
    if (titleEl) titleEl.textContent = drill.title;
    if (briefEl) briefEl.textContent = drill.briefing;
    if (qBanner) qBanner.classList.remove('hidden');
    if (qBannerText) qBannerText.innerHTML = buildPlainKidQuestionHtml(drill);

    this._syncUntimedBtn();
    this._syncCanvasOrientation();

    this.mountEl?.querySelector('#v14PreSnapOverlay')?.classList.remove('hidden');
    this.mountEl?.querySelector('#v14DebriefDock')?.classList.add('hidden');
    this.mountEl?.querySelector('#v14ModeControlsDock')?.classList.remove('hidden');
    this.mountEl?.querySelector('#v14LiveMeterWrap')?.classList.add('hidden');
    this._clearOnIceInteractiveOverlay();

    this._renderModeControlsDock();
    this._renderCurrentFrame();

    if (typeof this.onStageChange === 'function') {
      this.onStageChange(this.stage, drill);
    }

    if (opts.autoDrop) {
      this.dropPuck({ force: true });
    }
  }

  dropPuck({ force = false } = {}) {
    if (!this.drill) return;
    if (this.stage !== 'pre_snap' && !force) return;

    this.mountEl?.querySelector('#v14PreSnapOverlay')?.classList.add('hidden');
    this.simTime = 0;
    this.ambientElapsed = 0;
    this._overlaySig = '';

    const immediateChallengeModes = new Set([
      'ghost_player',
      'gap_surfing',
      'lane_sweeper',
      'draw_the_route'
    ]);
    this.stage = immediateChallengeModes.has(this.drill.mode) ? 'challenge' : 'live_motion';

    if (this.drill.mode === 'ghost_player' || this.drill.mode === 'gap_surfing' || this.drill.mode === 'change_or_stay') {
      this.mountEl?.querySelector('#v14LiveMeterWrap')?.classList.remove('hidden');
    }

    if (typeof window !== 'undefined' && window.SoundFX && typeof window.SoundFX.playTap === 'function') {
      try { window.SoundFX.playTap(); } catch (_) {}
    }

    this._renderModeControlsDock();
    this._renderCurrentFrame();
    if (typeof this.onStageChange === 'function') {
      this.onStageChange(this.stage, this.drill);
    }
    this._lastTs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this._scheduleLoop();
  }

  _playDecisionWhistleCue() {
    if (typeof window !== 'undefined' && window.SoundFX && typeof window.SoundFX.playTap === 'function') {
      try { window.SoundFX.playTap(); } catch (_) {}
    }
  }

  _scheduleLoop() {
    this.stopLoop();
    this._rafId = requestAnimationFrame((ts) => {
      const dt = Math.min(0.08, Math.max(0.001, (ts - this._lastTs) / 1000));
      this._lastTs = ts;
      try {
        this._stepSimulation(dt, ts);
      } catch (err) {
        console.warn('[SYNAPZ v15.2] Mode simulation failsafe recovered cleanly:', err);
        if (this.stage === 'live_motion') {
          this.stage = 'challenge';
          this._renderModeControlsDock();
          this._renderCurrentFrame(ts);
        }
      }
    });
  }

  _stepSimulation(dt, ts) {
    if (!this.drill || this.isPausedByModal) return;
    const mode = this.drill.mode;
    const mc = this.drill.modeConfig || {};
    this.ambientElapsed += dt;

    if (this.stage === 'live_motion' || this.stage === 'challenge') {
      if (mode === 'read_and_react') {
        if (this.stage === 'live_motion') {
          const freezeSec = Number(mc.freezeTime || 1.5);
          this.simTime += dt;
          if (this.simTime >= freezeSec) {
            this.simTime = freezeSec;
            this.stage = 'challenge';
            this.shotClockLeft = Math.max(7.5, Number(mc.shotClockSec || 8.0));
            this._playDecisionWhistleCue();
            this._renderModeControlsDock();
            if (typeof this.onStageChange === 'function') this.onStageChange(this.stage, this.drill);
          }
        } else if (this.stage === 'challenge' && !this.untimed) {
          this.shotClockLeft = Math.max(0, (this.shotClockLeft ?? 8.0) - dt);
          if (this.shotClockLeft <= 0) {
            const wrongOpt = (mc.options || []).find(o => !o.isGold) || mc.options[0];
            this._beginOutcomeMovie(false, `Shot clock expired! Best read: ${mc.options.find(o => o.isGold)?.label || ''}`, wrongOpt);
            return;
          }
        }
      } else if (mode === 'ghost_player') {
        const dur = mc.durationSec || 3.6;
        this.simTime = Math.min(dur, this.simTime + dt);
        const zoneNow = this._sampleGhostTargetZone(this.simTime / dur);
        const dx = (this.youCurrentPos[0] - zoneNow.x) / Math.max(18, zoneNow.rx);
        const dy = (this.youCurrentPos[1] - zoneNow.y) / Math.max(18, zoneNow.ry);
        const inside = (dx * dx + dy * dy) <= 1.15;
        this.coverageFramesTotal += 1;
        if (inside) this.coverageFramesIn += 1;
        this.coveragePct = Math.round((this.coverageFramesIn / Math.max(1, this.coverageFramesTotal)) * 100);
        this.recordedMyYouPath.push([...this.youCurrentPos]);
        this._updateMeterUI('SLOT LOCK', this.coveragePct, inside ? 'emerald' : 'amber');

        if (this.simTime >= dur) {
          const req = Math.round((mc.requiredCoverageRatio || 0.5) * 100);
          const won = inside || this.coveragePct >= req;
          this._beginOutcomeMovie(won, won ? `Slot locked (${this.coveragePct}% coverage)!` : `Drifted out of slot (${this.coveragePct}% coverage).`);
          return;
        }
      } else if (mode === 'fog_of_war') {
        if (this.fogLiftRemainingSec > 0) {
          this.fogLiftRemainingSec = Math.max(0, this.fogLiftRemainingSec - dt);
        }
        if (!this.fogReadyForChoice) {
          const arr = Number(mc.passArrivalTime || 1.8);
          this.simTime += dt;
          if (this.simTime >= arr) {
            this.simTime = arr;
            this.fogReadyForChoice = true;
            this.stage = 'challenge';
            this.shotClockLeft = 8.0;
            this._playDecisionWhistleCue();
            this._renderModeControlsDock();
            if (typeof this.onStageChange === 'function') this.onStageChange(this.stage, this.drill);
          }
        } else if (!this.untimed) {
          this.shotClockLeft = Math.max(0, (this.shotClockLeft ?? 8.0) - dt);
          if (this.shotClockLeft <= 0) {
            this._beginOutcomeMovie(false, 'Pinned on the boards—scan & move puck quicker!');
            return;
          }
        }
      } else if (mode === 'two_touch') {
        const arr = Number(mc.passArrivalTime || 2.2);
        if (this.twoTouchPicked.length >= 2) {
          this._evaluateTwoTouchSelection();
          return;
        }
        if (this.simTime < arr) {
          this.simTime = Math.min(arr, this.simTime + dt);
          if (this.simTime >= arr) {
            this.stage = 'challenge';
            this._playDecisionWhistleCue();
            this._renderModeControlsDock();
            if (!this.untimed) this.shotClockLeft = 7.5;
            if (typeof this.onStageChange === 'function') this.onStageChange(this.stage, this.drill);
          }
        } else if (!this.untimed) {
          this.shotClockLeft = Math.max(0, (this.shotClockLeft ?? 7.5) - dt);
          if (this.shotClockLeft <= 0) {
            this._evaluateTwoTouchSelection();
            return;
          }
        }
      } else if (mode === 'spot_the_breakdown') {
        const clipDur = mc.goalClipSec || 2.2;
        if (this.rewindPhase === 'watching_goal') {
          this.simTime += dt;
          if (this.simTime >= clipDur) {
            this.simTime = clipDur;
            this.rewindPhase = 'rewinding';
            this.rewindProgress = 0;
            this._renderModeControlsDock();
          }
        } else if (this.rewindPhase === 'rewinding') {
          this.rewindProgress += dt / 1.0;
          if (this.rewindProgress >= 1) {
            this.rewindProgress = 1;
            this.rewindPhase = 'pick_culprit';
            this.stage = 'challenge';
            this._playDecisionWhistleCue();
            this._renderModeControlsDock();
            if (typeof this.onStageChange === 'function') this.onStageChange(this.stage, this.drill);
          }
        }
      } else if (mode === 'gap_surfing') {
        const dur = mc.durationSec || 3.4;
        this.simTime = Math.min(dur, this.simTime + dt);
        const attSk = (this.drill.skaters || []).find(s => s.id === mc.attackerId);
        const attPos = samplePolylineAt(attSk?.motion || [[500, 250]], this.simTime / dur);
        this.youCurrentPos[1] = attPos[1];
        const gap = attPos[0] - this.youCurrentPos[0];
        const inIdeal = Math.abs(gap - (mc.idealGapDist || 82)) <= (mc.gapTolerance || 48);
        this.gapFramesTotal += 1;
        if (inIdeal) this.gapFramesGood += 1;
        const pct = Math.round((this.gapFramesGood / Math.max(1, this.gapFramesTotal)) * 100);
        this.recordedMyYouPath.push([...this.youCurrentPos]);
        this._updateMeterUI('GAP LOCK', pct, inIdeal ? 'emerald' : 'amber');

        if (this.simTime >= dur) {
          this._beginOutcomeMovie(pct >= 60, pct >= 60 ? 'Tight gap forced turnover at blue line!' : 'Backed in too deep—poke at the blue line!');
          return;
        }
      } else if (mode === 'lane_sweeper') {
        const dur = mc.durationSec || 3.8;
        this.simTime = Math.min(dur, this.simTime + dt);
        const origin = mc.pivotOrigin || [180, 250];
        const reach = mc.stickReach || 90;
        const tip = [
          origin[0] + Math.cos(this.stickSweepAngleRad) * reach,
          origin[1] + Math.sin(this.stickSweepAngleRad) * reach
        ];
        for (const p of (mc.passes || [])) {
          if (this.simTime >= p.tStart && this.simTime <= p.tEnd) {
            const prog = (this.simTime - p.tStart) / Math.max(0.1, p.tEnd - p.tStart);
            const puckNow = [
              p.from[0] + (p.to[0] - p.from[0]) * prog,
              p.from[1] + (p.to[1] - p.from[1]) * prog
            ];
            const dToStick = pointToSegmentDist(puckNow, origin, tip);
            if (dToStick <= 24) {
              if (p.isThreat) {
                this.sweptThreatSuccess = true;
                this._beginOutcomeMovie(true, 'Deflected cross-seam pass & cleared 200ft!');
                return;
              } else {
                this.sweptHarmlessMistake = true;
              }
            }
          }
        }
        if (this.simTime >= dur) {
          const ok = this.sweptThreatSuccess && !this.sweptHarmlessMistake;
          this._beginOutcomeMovie(ok, ok ? 'Royal Road seam denied!' : 'Cross-seam pass slipped through the box!');
          return;
        }
      } else if (mode === 'draw_the_route') {
        // Advance teammates, defenders, and puck through live pre-read motion (0 -> 1.8s) while awaiting route draw!
        const setupSec = mc.setupMotionSec || 1.8;
        if (this.simTime < setupSec) {
          this.simTime = Math.min(setupSec, this.simTime + dt);
        }
      } else if (mode === 'change_or_stay') {
        const clipSec = mc.clipSec || 1.9;
        if (this.stage === 'live_motion') {
          this.simTime = Math.min(clipSec, this.simTime + dt);
          this._updateMeterUI('FATIGUE', mc.fatiguePct || 88, 'danger');
          if (this.simTime >= clipSec) {
            this.stage = 'challenge';
            this._playDecisionWhistleCue();
            this._renderModeControlsDock();
            if (typeof this.onStageChange === 'function') this.onStageChange(this.stage, this.drill);
          }
        }
      }

      this._renderCurrentFrame(ts);
      // Keep 60fps loop alive throughout live_motion AND challenge so YOU halo, defender stick jitter & target pulses stay crisp!
      this._scheduleLoop();
      return;
    }

    if (this.stage === 'outcome_movie') {
      this.outcomeElapsed += dt;
      this._renderCurrentFrame(ts);
      if (this.outcomeElapsed >= this.outcomeDuration) {
        this._enterStage5Debrief();
        return;
      }
      this._scheduleLoop();
    }
  }

  _updateMeterUI(label, pct, tone = 'emerald') {
    const lbl = this.mountEl?.querySelector('#v14LiveMeterLabel');
    const fill = this.mountEl?.querySelector('#v14LiveMeterFill');
    const txt = this.mountEl?.querySelector('#v14LiveMeterPct');
    if (lbl) lbl.textContent = label;
    if (txt) txt.textContent = `${pct}%`;
    if (fill) {
      fill.style.width = `${Math.max(4, Math.min(100, pct))}%`;
      fill.className = tone === 'danger'
        ? 'h-full bg-rose-500 animate-pulse transition-all duration-75'
        : (tone === 'amber' ? 'h-full bg-amber-400 transition-all duration-75' : 'h-full bg-emerald-400 transition-all duration-75');
    }
  }

  // =========================================================================
  // INTERACTIVE CHALLENGE ACTIONS ACROSS ALL 9 MODES
  // =========================================================================

  submitAbcOption(optionId) {
    if (!this.drill) return;
    const mc = this.drill.modeConfig || {};
    const opt = (mc.options || []).find(o => o.id === optionId) || mc.options?.[0];
    if (!opt) return;

    if (this.drill.mode === 'fog_of_war') {
      const won = Boolean(opt.isGold && this.fogScannedInTime);
      const detail = won
        ? 'Pre-scanned blind side + hit the open outlet!'
        : (!this.fogScannedInTime && opt.isGold
            ? 'Good outlet, but ALWAYS Shoulder-Check BEFORE puck arrives!'
            : `Turnover into pressure (${opt.label}).`);
      this._beginOutcomeMovie(won, detail, opt);
      return;
    }

    this._beginOutcomeMovie(Boolean(opt.isGold), opt.isGold ? `Nailed Option ${opt.id}: ${opt.label}!` : `Turnover on Option ${opt.id} (${opt.label}).`, opt);
  }

  triggerShoulderCheckScan() {
    if (!this.drill || this.drill.mode !== 'fog_of_war') return;
    const mc = this.drill.modeConfig || {};
    if (!this.fogReadyForChoice) {
      this.fogScannedInTime = true;
    }
    this.fogLiftRemainingSec = mc.scanRevealSec || 1.4;
    this._renderModeControlsDock();
    this._renderCurrentFrame();
  }

  pickTwoTouchNode(nodeId) {
    if (!this.drill || this.drill.mode !== 'two_touch') return;
    if (this.stage === 'pre_snap') this.dropPuck();
    if (this.twoTouchPicked.length >= 2) return;
    if (this.twoTouchPicked[this.twoTouchPicked.length - 1] === nodeId) return;
    this.twoTouchPicked.push(nodeId);
    this._renderModeControlsDock();
    this._renderCurrentFrame();
    if (this.twoTouchPicked.length === 2) {
      this._evaluateTwoTouchSelection();
    }
  }

  _evaluateTwoTouchSelection() {
    const mc = this.drill.modeConfig || {};
    const gold = mc.goldSequence || [];
    const won = this.twoTouchPicked.length === 2 &&
      this.twoTouchPicked[0] === gold[0] &&
      this.twoTouchPicked[1] === gold[1];
    const detail = won
      ? `Tic-tac-toe chain (${gold[0]} ➔ ${gold[1]}) executed!`
      : `Chain broken—best 2-touch chain was ${gold[0]} ➔ ${gold[1]}.`;
    this._beginOutcomeMovie(won, detail);
  }

  submitCulpritSuspect(skaterId) {
    if (!this.drill || this.drill.mode !== 'spot_the_breakdown') return;
    const mc = this.drill.modeConfig || {};
    const won = skaterId === mc.culpritId;
    const suspectObj = (mc.suspects || []).find(s => s.id === skaterId);
    const culpritObj = (mc.suspects || []).find(s => s.id === mc.culpritId);
    const detail = won
      ? `Spotted culprit ${mc.culpritId}: ${culpritObj?.reason || 'Blown coverage fixed!'}`
      : `${skaterId} did their job (${suspectObj?.reason || ''})—watch ${mc.culpritId}!`;
    this._beginOutcomeMovie(won, detail);
  }

  triggerGapPokeCheck() {
    if (!this.drill || this.drill.mode !== 'gap_surfing') return;
    if (this.stage === 'pre_snap') this.dropPuck();
    const mc = this.drill.modeConfig || {};
    const dur = mc.durationSec || 3.4;
    const attSk = (this.drill.skaters || []).find(s => s.id === mc.attackerId);
    const attPos = samplePolylineAt(attSk?.motion || [[400, 250]], Math.min(1, this.simTime / dur));
    const gap = attPos[0] - this.youCurrentPos[0];
    const goodGap = gap >= 20 && Math.abs(gap - (mc.idealGapDist || 82)) <= (mc.gapTolerance || 48) + 22;
    const [minX, maxX] = mc.pokeWindowX || [300, 440];
    const nearBlue = attPos[0] >= minX - 25 && attPos[0] <= maxX + 35;
    const won = goodGap && nearBlue;
    this._beginOutcomeMovie(
      won,
      won ? 'Clean stick-on-puck poke right at the blue line!' : 'Mistimed poke—hold 1-stick gap to the blue line!'
    );
  }

  evaluateDrawnRoute(points = this.drawnRoutePoints) {
    if (!this.drill || this.drill.mode !== 'draw_the_route') return;
    const mc = this.drill.modeConfig || {};
    if (!Array.isArray(points) || points.length < 2) {
      this._beginOutcomeMovie(false, 'Draw a skating path from YOU into gold THIS SPACE!');
      return;
    }
    this.drawnRoutePoints = points.map(p => [p[0], p[1]]);
    this.recordedMyYouPath = [...this.drawnRoutePoints];

    const endPt = this.drawnRoutePoints[this.drawnRoutePoints.length - 1];
    const target = mc.thisSpace || { x: 500, y: 250, r: 54 };
    const hitTarget = dist2D(endPt, [target.x, target.y]) <= (target.r || 54) + 22;

    let hitDefender = false;
    for (const fz of (mc.forbiddenZones || [])) {
      for (const pt of this.drawnRoutePoints) {
        if (dist2D(pt, [fz.x, fz.y]) < (fz.r || 30) * 0.8) {
          hitDefender = true;
          break;
        }
      }
    }

    let offside = false;
    if (mc.mustStayOnside && typeof mc.blueLineX === 'number') {
      const earlyIdx = Math.min(this.drawnRoutePoints.length - 1, Math.max(1, Math.floor(this.drawnRoutePoints.length * 0.25)));
      if (this.drawnRoutePoints[earlyIdx][0] > mc.blueLineX + 28) {
        offside = true;
      }
    }

    const won = hitTarget && !hitDefender && !offside;
    const detail = won
      ? 'Timed support route cleanly into THIS SPACE!'
      : (offside
          ? 'Offside! Straddle the blue line before driving deep.'
          : (hitDefender ? 'Skated through defender coverage—curve underneath!' : 'End your route inside gold THIS SPACE!'));
    this._beginOutcomeMovie(won, detail);
  }

  submitChangeOrStay(choiceAction) {
    if (!this.drill || this.drill.mode !== 'change_or_stay') return;
    const mc = this.drill.modeConfig || {};
    const won = choiceAction === mc.correctAction;
    const detail = won
      ? (choiceAction === 'change' ? 'Smart change with puck 200ft deep!' : 'Stayed on to stop the 3-on-2 counter-rush!')
      : (mc.correctAction === 'change' ? 'Stayed out exhausted when puck was safely deep!' : 'Bad line change handed opponents a breakaway!');
    this._beginOutcomeMovie(won, detail);
  }

  _beginOutcomeMovie(isGold, detailText = '', chosenOption = null) {
    this.stopLoop();
    this.isGoldResult = Boolean(isGold);
    this.resultDetail = detailText;
    this.chosenOption = chosenOption;
    this.earnedIq = isGold ? 25 : 5;
    this.earnedBucks = isGold ? 25 : 5;
    this.stage = 'outcome_movie';
    this.outcomeElapsed = 0;
    this.outcomeDuration = (typeof window !== 'undefined' && window.__SYNAPZ_FAST_OUTCOME__) ? 0.12 : 1.1;

    this.mountEl?.querySelector('#v14ModeControlsDock')?.classList.add('hidden');
    this._clearOnIceInteractiveOverlay();

    if (typeof this.onStageChange === 'function') {
      this.onStageChange(this.stage, this.drill);
    }

    if (typeof this.onRepEvaluated === 'function') {
      this.onRepEvaluated({
        drill: this.drill,
        isGold: this.isGoldResult,
        earnedIq: this.earnedIq,
        earnedBucks: this.earnedBucks,
        detail: this.resultDetail
      });
    }

    this._lastTs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this._scheduleLoop();
  }

  _enterStage5Debrief() {
    this.stopLoop();
    this.stage = 'debrief_dock';
    this.ghostViewMode = this.isGoldResult ? 'my_play' : 'best_play';
    this.scrubProgress = 1.0;
    this._clearOnIceInteractiveOverlay();

    const dock = this.mountEl?.querySelector('#v14DebriefDock');
    const banner = this.mountEl?.querySelector('#v14DebriefOutcomeBanner');
    const detailEl = this.mountEl?.querySelector('#v14DebriefSubDetail');
    const ruleEl = this.mountEl?.querySelector('#v14DebriefCoachRule');
    const scrubber = this.mountEl?.querySelector('#v14TimelineScrubber');

    if (dock) dock.classList.remove('hidden');
    if (banner) {
      banner.textContent = this.isGoldResult
        ? `🏆 CLEAN PLAY! +${this.earnedIq} IQ · +$${this.earnedBucks}`
        : `⚠️ TURNOVER! +${this.earnedIq} IQ`;
      banner.className = this.isGoldResult
        ? 'px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs sm:text-sm font-black'
        : 'px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-400 text-rose-300 text-xs sm:text-sm font-black';
    }
    if (detailEl) detailEl.textContent = this.resultDetail;
    if (ruleEl) ruleEl.textContent = this.drill?.coachRule || '';
    if (scrubber) scrubber.value = '100';

    if (typeof this.onStageChange === 'function') {
      this.onStageChange(this.stage, this.drill);
    }

    this._syncGhostButtons();
    this.setScrubProgress(1.0);
  }

  setGhostViewMode(mode) {
    this.ghostViewMode = mode === 'best_play' ? 'best_play' : 'my_play';
    this._syncGhostButtons();
    this._renderCurrentFrame();
  }

  setScrubProgress(progRaw) {
    this.scrubProgress = Math.max(0, Math.min(1, Number(progRaw ?? 1)));
    const lbl = this.mountEl?.querySelector('#v14TimelineScrubLabel');
    if (lbl) {
      const cur = (this.scrubProgress * this.totalTimelineSec).toFixed(1);
      lbl.textContent = `${cur}s / ${this.totalTimelineSec.toFixed(1)}s`;
    }
    this._renderCurrentFrame();
  }

  _syncGhostButtons() {
    const myBtn = this.mountEl?.querySelector('#btnV14GhostMyPlay');
    const bestBtn = this.mountEl?.querySelector('#btnV14GhostBestPlay');
    if (myBtn) {
      myBtn.className = this.ghostViewMode === 'my_play'
        ? 'min-h-[38px] px-3 py-1.5 rounded-lg text-[11px] font-black border cursor-pointer bg-teal-400 text-slate-950 border-teal-200 shadow'
        : 'min-h-[38px] px-3 py-1.5 rounded-lg text-[11px] font-black border cursor-pointer bg-slate-900 text-slate-300 border-slate-700';
    }
    if (bestBtn) {
      bestBtn.className = this.ghostViewMode === 'best_play'
        ? 'min-h-[38px] px-3 py-1.5 rounded-lg text-[11px] font-black border cursor-pointer bg-amber-400 text-slate-950 border-amber-200 shadow'
        : 'min-h-[38px] px-3 py-1.5 rounded-lg text-[11px] font-black border cursor-pointer bg-slate-900 text-slate-300 border-slate-700';
    }
  }

  // =========================================================================
  // W3C POINTER EVENTS ON WHITE-ICE CANVAS
  // =========================================================================

  _onCanvasPointerDown(ev) {
    if (!this.drill || !this.rink) return;
    if (this.stage === 'pre_snap') {
      if (this.drill.mode === 'draw_the_route') {
        this.dropPuck();
      } else {
        this.dropPuck();
        return;
      }
    }

    const [lx, ly] = this.rink.clientToLogical(ev.clientX, ev.clientY);
    const mode = this.drill.mode;
    const mc = this.drill.modeConfig || {};

    try {
      ev.currentTarget.setPointerCapture?.(ev.pointerId);
    } catch (_) {}

    if (mode === 'read_and_react' && this.stage === 'challenge') {
      const hit = (mc.options || []).find(opt => dist2D([lx, ly], opt.target) <= 48);
      if (hit) this.submitAbcOption(hit.id);
    } else if (mode === 'fog_of_war') {
      if (!this.fogReadyForChoice) {
        this.triggerShoulderCheckScan();
      } else {
        const hit = (mc.options || []).find(opt => dist2D([lx, ly], opt.target) <= 48);
        if (hit) this.submitAbcOption(hit.id);
      }
    } else if (mode === 'ghost_player' && this.stage === 'challenge') {
      this.pointerDragging = true;
      this.youCurrentPos = [lx, ly];
      this._renderCurrentFrame();
    } else if (mode === 'two_touch') {
      const hit = (mc.candidates || []).find(c => dist2D([lx, ly], c.target) <= 48);
      if (hit) this.pickTwoTouchNode(hit.id);
    } else if (mode === 'spot_the_breakdown' && this.rewindPhase === 'pick_culprit') {
      const skatersNow = this._computeLiveSkaters(0.35);
      let closest = null;
      let bestD = 54;
      for (const sk of skatersNow) {
        if (sk.team !== 'home' || sk.id === 'G') continue;
        const d = dist2D([lx, ly], sk.pos);
        if (d < bestD) {
          bestD = d;
          closest = sk;
        }
      }
      if (closest) this.submitCulpritSuspect(closest.id);
    } else if (mode === 'gap_surfing' && this.stage === 'challenge') {
      this.pointerDragging = true;
      this.youCurrentPos[0] = Math.max(80, Math.min(620, lx));
      this._renderCurrentFrame();
    } else if (mode === 'lane_sweeper' && this.stage === 'challenge') {
      this.pointerDragging = true;
      const origin = mc.pivotOrigin || [180, 250];
      this.stickSweepAngleRad = Math.atan2(ly - origin[1], lx - origin[0]);
      this._renderCurrentFrame();
    } else if (mode === 'draw_the_route' && this.stage === 'challenge') {
      this.isDrawingRoute = true;
      this.drawnRoutePoints = [[...this.youCurrentPos], [lx, ly]];
      this._renderCurrentFrame();
    }
  }

  _onCanvasPointerMove(ev) {
    if (!this.drill || !this.rink) return;
    const mode = this.drill.mode;
    const mc = this.drill.modeConfig || {};
    const [lx, ly] = this.rink.clientToLogical(ev.clientX, ev.clientY);

    if (mode === 'ghost_player' && this.pointerDragging && this.stage === 'challenge') {
      this.youCurrentPos = [lx, ly];
    } else if (mode === 'gap_surfing' && this.pointerDragging && this.stage === 'challenge') {
      this.youCurrentPos[0] = Math.max(80, Math.min(620, lx));
    } else if (mode === 'lane_sweeper' && this.pointerDragging && this.stage === 'challenge') {
      const origin = mc.pivotOrigin || [180, 250];
      this.stickSweepAngleRad = Math.atan2(ly - origin[1], lx - origin[0]);
    } else if (mode === 'draw_the_route' && this.isDrawingRoute && this.stage === 'challenge') {
      const last = this.drawnRoutePoints[this.drawnRoutePoints.length - 1];
      if (!last || dist2D(last, [lx, ly]) >= 10) {
        this.drawnRoutePoints.push([lx, ly]);
        this._renderCurrentFrame();
      }
    }
  }

  _onCanvasPointerUp() {
    if (!this.drill) return;
    this.pointerDragging = false;
    if (this.drill.mode === 'draw_the_route' && this.isDrawingRoute) {
      this.isDrawingRoute = false;
      if (this.drawnRoutePoints.length >= 3) {
        this.evaluateDrawnRoute(this.drawnRoutePoints);
      }
    }
  }

  // =========================================================================
  // >= 44px ON-ICE INTERACTIVE OVERLAY TARGETS (Synced to Rink Logical Coords)
  // =========================================================================

  _clearOnIceInteractiveOverlay() {
    const layer = this.mountEl?.querySelector('#v14OnIceInteractiveLayer');
    if (layer && layer.innerHTML !== '') {
      layer.innerHTML = '';
    }
    this._overlaySig = '';
  }

  _syncOnIceInteractiveOverlay(skaters = []) {
    const layer = this.mountEl?.querySelector('#v14OnIceInteractiveLayer');
    if (!layer || !this.drill || !this.rink) return;

    if (this.stage === 'pre_snap' || this.stage === 'outcome_movie' || this.stage === 'debrief_dock') {
      this._clearOnIceInteractiveOverlay();
      return;
    }

    const mode = this.drill.mode;
    const mc = this.drill.modeConfig || {};
    const vt = this.rink._viewportTransform;
    const clampCss = (pt) => ({
      x: Math.max(26, Math.min(vt.cssW - 26, pt.x)),
      y: Math.max(26, Math.min(vt.cssH - 26, pt.y))
    });

    const targets = [];
    if (mode === 'read_and_react' && this.stage === 'challenge') {
      for (const opt of (mc.options || [])) {
        const cPt = clampCss(this.rink.logicalToCss(opt.target[0], opt.target[1]));
        targets.push({
          key: `abc_${opt.id}`,
          x: cPt.x,
          y: cPt.y,
          label: opt.id,
          aria: `Option ${opt.id}: ${opt.label}`,
          kind: 'abc',
          value: opt.id
        });
      }
    } else if (mode === 'fog_of_war') {
      if (!this.fogReadyForChoice) {
        const fr = mc.fogRegion || { x: 250, y: 40, w: 200, h: 160 };
        const cPt = clampCss(this.rink.logicalToCss(fr.x + fr.w / 2, fr.y + fr.h / 2));
        targets.push({
          key: `scan_${this.fogScannedInTime ? 'done' : 'wait'}`,
          x: cPt.x,
          y: cPt.y,
          label: this.fogScannedInTime ? '✅ SCANNED' : '👀 SCAN',
          aria: 'Tap to Shoulder-Check Scan blind spot',
          kind: 'scan',
          wide: true
        });
      } else if (this.stage === 'challenge') {
        for (const opt of (mc.options || [])) {
          const cPt = clampCss(this.rink.logicalToCss(opt.target[0], opt.target[1]));
          targets.push({
            key: `fog_abc_${opt.id}`,
            x: cPt.x,
            y: cPt.y,
            label: opt.id,
            aria: `Option ${opt.id}: ${opt.label}`,
            kind: 'abc',
            value: opt.id
          });
        }
      }
    } else if (mode === 'two_touch') {
      for (const cand of (mc.candidates || [])) {
        const cPt = clampCss(this.rink.logicalToCss(cand.target[0], cand.target[1]));
        targets.push({
          key: `tt_${cand.id}_${this.twoTouchPicked.join(',')}`,
          x: cPt.x,
          y: cPt.y,
          label: cand.id,
          aria: `Tap pass target ${cand.label}`,
          kind: 'twotouch',
          value: cand.id
        });
      }
    } else if (mode === 'spot_the_breakdown' && this.rewindPhase === 'pick_culprit') {
      for (const sus of (mc.suspects || [])) {
        const sk = skaters.find(s => s.id === sus.id);
        if (!sk || !sk.pos) continue;
        const cPt = clampCss(this.rink.logicalToCss(sk.pos[0], sk.pos[1]));
        targets.push({
          key: `sus_${sus.id}`,
          x: cPt.x,
          y: cPt.y,
          label: sus.id,
          aria: `Suspect ${sus.roleLabel}`,
          kind: 'suspect',
          value: sus.id
        });
      }
    }

    const sig = targets.map(t => `${t.key}@${Math.round(t.x)},${Math.round(t.y)}`).join('|');
    if (sig === this._overlaySig) return;
    this._overlaySig = sig;

    if (targets.length === 0) {
      layer.innerHTML = '';
      return;
    }

    layer.innerHTML = targets.map(t => `
      <button
        type="button"
        data-v14-interactive-target="${t.key}"
        data-target-kind="${t.kind}"
        data-target-val="${t.value || ''}"
        aria-label="${escapeHtmlText(t.aria)}"
        style="left: ${t.x.toFixed(1)}px; top: ${t.y.toFixed(1)}px; transform: translate(-50%, -50%);"
        class="pointer-events-auto absolute ${t.wide ? 'min-w-[96px] min-h-[46px] px-3 rounded-full bg-amber-400/95 text-slate-950 border-2 border-white shadow-xl text-xs font-black' : 'w-[48px] h-[48px] min-w-[48px] min-h-[48px] rounded-full bg-teal-400/15 hover:bg-teal-400/30 border-2 border-amber-300/85 shadow-lg'} flex items-center justify-center cursor-pointer transition"
      >
        ${t.wide ? `<span>${t.label}</span>` : `<span class="sr-only">${escapeHtmlText(t.aria)}</span>`}
      </button>
    `).join('');

    layer.querySelectorAll('[data-v14-interactive-target]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const kind = btn.getAttribute('data-target-kind');
        const val = btn.getAttribute('data-target-val');
        if (kind === 'abc') this.submitAbcOption(val);
        else if (kind === 'scan') this.triggerShoulderCheckScan();
        else if (kind === 'twotouch') this.pickTwoTouchNode(val);
        else if (kind === 'suspect') this.submitCulpritSuspect(val);
      });
    });
  }

  // =========================================================================
  // MODE-NATIVE >= 44px BOTTOM CONTROLS DOCK RENDERER
  // =========================================================================

  _renderModeControlsDock() {
    const dock = this.mountEl?.querySelector('#v14ModeControlsDock');
    if (!dock || !this.drill) return;
    const mode = this.drill.mode;
    const mc = this.drill.modeConfig || {};

    if (this.stage === 'pre_snap') {
      dock.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <span>💡 <strong>Coach Tip:</strong> ${escapeHtmlText(this.drill.coachTip)}</span>
          <span class="text-teal-300 font-black">Tap 🏒 DROP PUCK to start live rep</span>
        </div>
      `;
      return;
    }

    if (mode === 'read_and_react') {
      if (this.stage !== 'challenge') {
        dock.innerHTML = `<div class="min-h-[44px] flex items-center justify-center text-xs sm:text-sm font-black text-teal-300">👀 Watch the skaters &amp; puck develop — read the pressure!</div>`;
        return;
      }
      dock.innerHTML = `
        <div class="space-y-1">
          <div class="text-[11px] font-black uppercase tracking-wider text-amber-300">🎯 Tap the best ice target (A, B, or C):</div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            ${(mc.options || []).map(opt => `
              <button type="button" data-v14-choice="${opt.id}" class="min-h-[46px] py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-teal-400/75 text-left flex items-center gap-2.5 transition cursor-pointer">
                <span class="w-7 h-7 rounded-full bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">${opt.id}</span>
                <span class="text-xs font-black text-white leading-tight">${escapeHtmlText(opt.label)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
      dock.querySelectorAll('[data-v14-choice]').forEach(btn => {
        btn.addEventListener('click', () => this.submitAbcOption(btn.getAttribute('data-v14-choice')));
      });
    } else if (mode === 'ghost_player') {
      dock.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs font-black text-teal-300">🖐️ Drag YOUR glowing skater on the ice to stay inside THIS SPACE!</span>
          <button id="btnV14SnapToSpace" type="button" class="min-h-[46px] px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs shadow cursor-pointer">
            🛡️ Skate Into THIS SPACE
          </button>
        </div>
      `;
      dock.querySelector('#btnV14SnapToSpace')?.addEventListener('click', () => {
        const dur = mc.durationSec || 3.8;
        const z = this._sampleGhostTargetZone(Math.min(1, this.simTime / dur));
        this.youCurrentPos = [z.x, z.y];
        this._renderCurrentFrame();
      });
    } else if (mode === 'fog_of_war') {
      if (!this.fogReadyForChoice) {
        dock.innerHTML = `
          <div class="flex items-center justify-center">
            <button id="btnV14ShoulderScan" type="button" class="min-h-[46px] w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-sky-400 hover:from-amber-300 hover:to-sky-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg cursor-pointer">
              👀 SHOULDER CHECK (SCAN) ${this.fogScannedInTime ? '✅ SCANNED!' : '— Tap Before Puck Arrives!'}
            </button>
          </div>
        `;
        dock.querySelector('#btnV14ShoulderScan')?.addEventListener('click', () => this.triggerShoulderCheckScan());
      } else {
        dock.innerHTML = `
          <div class="space-y-1">
            <div class="text-[11px] font-black uppercase tracking-wider text-amber-300">🎯 Tap the open pass target (A, B, or C):</div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              ${(mc.options || []).map(opt => `
                <button type="button" data-v14-choice="${opt.id}" class="min-h-[46px] py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-sky-400/75 text-left flex items-center gap-2.5 transition cursor-pointer">
                  <span class="w-7 h-7 rounded-full bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">${opt.id}</span>
                  <span class="text-xs font-black text-white leading-tight">${escapeHtmlText(opt.label)}</span>
                </button>
              `).join('')}
            </div>
          </div>
        `;
        dock.querySelectorAll('[data-v14-choice]').forEach(btn => {
          btn.addEventListener('click', () => this.submitAbcOption(btn.getAttribute('data-v14-choice')));
        });
      }
    } else if (mode === 'two_touch') {
      dock.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs font-black text-amber-300">⚡ Tap 2 Teammates (${this.twoTouchPicked.length}/2): ${this.twoTouchPicked.join(' ➔ ') || 'Pass #1 ➔ Pass #2'}</span>
          <div class="flex flex-wrap items-center gap-2">
            ${(mc.candidates || []).map(c => `
              <button type="button" data-v14-node="${c.id}" class="min-h-[46px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-teal-400/75 text-xs font-black text-white cursor-pointer">
                ${escapeHtmlText(c.label)}
              </button>
            `).join('')}
          </div>
        </div>
      `;
      dock.querySelectorAll('[data-v14-node]').forEach(btn => {
        btn.addEventListener('click', () => this.pickTwoTouchNode(btn.getAttribute('data-v14-node')));
      });
    } else if (mode === 'spot_the_breakdown') {
      if (this.rewindPhase !== 'pick_culprit') {
        dock.innerHTML = `
          <div class="min-h-[44px] flex items-center justify-center text-xs sm:text-sm font-black text-rose-300 text-center">
            ${this.rewindPhase === 'watching_goal' ? '🚨 Watch closely—opponent scores! Who blew their assignment?' : '⏪ Auto-Rewinding -3.0s to the breakdown moment...'}
          </div>
        `;
      } else {
        dock.innerHTML = `
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xs font-black text-amber-300">🕵️ Tap the defender who blew coverage on the ice or below:</span>
            <div class="flex flex-wrap items-center gap-2">
              ${(mc.suspects || []).map(s => `
                <button type="button" data-v14-suspect="${s.id}" class="min-h-[46px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-rose-400/75 text-xs font-black text-white cursor-pointer">
                  ${escapeHtmlText(s.roleLabel)}
                </button>
              `).join('')}
            </div>
          </div>
        `;
        dock.querySelectorAll('[data-v14-suspect]').forEach(btn => {
          btn.addEventListener('click', () => this.submitCulpritSuspect(btn.getAttribute('data-v14-suspect')));
        });
      }
    } else if (mode === 'gap_surfing') {
      dock.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2 flex-1 min-w-[180px] min-h-[44px]">
            <span class="text-[11px] font-black text-teal-300 shrink-0">🌊 Surf Gap:</span>
            <input id="v14GapSlider" type="range" min="160" max="540" value="${Math.round(this.youCurrentPos[0])}" class="w-full h-3 accent-teal-400 cursor-pointer" />
          </div>
          <button id="btnV14PokeAngle" type="button" class="min-h-[46px] py-2 px-5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg cursor-pointer">
            🏒 POKE / ANGLE!
          </button>
        </div>
      `;
      dock.querySelector('#v14GapSlider')?.addEventListener('input', (ev) => {
        this.youCurrentPos[0] = Number(ev.currentTarget.value || 350);
      });
      dock.querySelector('#btnV14PokeAngle')?.addEventListener('click', () => this.triggerGapPokeCheck());
    } else if (mode === 'lane_sweeper') {
      dock.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-3">
          <span class="text-xs font-black text-teal-300">🏒 Drag on ice or slide to angle Active Stick across the SEAM lane:</span>
          <div class="flex items-center gap-2 min-h-[46px]">
            <input id="v14SweepAngleSlider" type="range" min="-180" max="180" value="${Math.round((this.stickSweepAngleRad * 180) / Math.PI)}" class="w-44 h-3 accent-teal-400 cursor-pointer" />
            <button id="btnV14AimThreatSeam" type="button" class="min-h-[46px] px-3.5 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs cursor-pointer">
              🏒 Seal Seam
            </button>
          </div>
        </div>
      `;
      dock.querySelector('#v14SweepAngleSlider')?.addEventListener('input', (ev) => {
        this.stickSweepAngleRad = (Number(ev.currentTarget.value || 0) * Math.PI) / 180;
      });
      dock.querySelector('#btnV14AimThreatSeam')?.addEventListener('click', () => {
        const threat = (mc.passes || []).find(p => p.isThreat) || mc.passes?.[0];
        if (threat && mc.pivotOrigin) {
          const mid = [(threat.from[0] + threat.to[0]) / 2, (threat.from[1] + threat.to[1]) / 2];
          this.stickSweepAngleRad = Math.atan2(mid[1] - mc.pivotOrigin[1], mid[0] - mc.pivotOrigin[0]);
          this._renderCurrentFrame();
        }
      });
    } else if (mode === 'draw_the_route') {
      dock.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs font-black text-teal-300">✏️ Drag your skating route from YOU into gold THIS SPACE on the ice!</span>
          <div class="flex items-center gap-2">
            <button id="btnV14ClearRoute" type="button" class="min-h-[46px] px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-black text-slate-200 cursor-pointer">↺ Clear</button>
            <button id="btnV14RunDrawnRoute" type="button" class="min-h-[46px] px-5 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-black shadow cursor-pointer">▶ Run Route</button>
          </div>
        </div>
      `;
      dock.querySelector('#btnV14ClearRoute')?.addEventListener('click', () => {
        const youSk = (this.drill.skaters || []).find(s => s.id === this.drill.youRole);
        this.drawnRoutePoints = [[...(youSk?.start || [500, 250])]];
        this._renderCurrentFrame();
      });
      dock.querySelector('#btnV14RunDrawnRoute')?.addEventListener('click', () => {
        this.evaluateDrawnRoute(this.drawnRoutePoints);
      });
    } else if (mode === 'change_or_stay') {
      if (this.stage !== 'challenge') {
        dock.innerHTML = `<div class="min-h-[44px] flex items-center justify-center text-xs sm:text-sm font-black text-amber-300">⏱️ Read puck depth &amp; opponent rush numbers before deciding!</div>`;
        return;
      }
      dock.innerHTML = `
        <div class="space-y-1">
          <div class="text-[11px] font-black uppercase tracking-wider text-amber-300">⏱️ Tap Change or Stay:</div>
          <div class="grid grid-cols-2 gap-2.5">
            <button id="btnV14ChangeNow" type="button" class="min-h-[48px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs sm:text-sm shadow-lg cursor-pointer">
              🏃 CHANGE NOW
            </button>
            <button id="btnV14StayDefend" type="button" class="min-h-[48px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg cursor-pointer">
              🛡️ STAY &amp; DEFEND
            </button>
          </div>
        </div>
      `;
      dock.querySelector('#btnV14ChangeNow')?.addEventListener('click', () => this.submitChangeOrStay('change'));
      dock.querySelector('#btnV14StayDefend')?.addEventListener('click', () => this.submitChangeOrStay('stay'));
    }
  }

  // =========================================================================
  // SCENE SYNTHESIS & RENDERING ACROSS ALL 5 STAGES
  // =========================================================================

  _sampleGhostTargetZone(normT) {
    const kfs = this.drill?.modeConfig?.targetZoneKeyframes || [{ t: 0, x: 500, y: 250, rx: 50, ry: 40, label: 'THIS SPACE' }];
    if (kfs.length === 1) return kfs[0];
    const t = Math.max(0, Math.min(1, normT));
    for (let i = 0; i < kfs.length - 1; i++) {
      const a = kfs[i];
      const b = kfs[i + 1];
      if (t <= b.t || i === kfs.length - 2) {
        const span = Math.max(0.001, b.t - a.t);
        const lt = Math.max(0, Math.min(1, (t - a.t) / span));
        return {
          x: a.x + (b.x - a.x) * lt,
          y: a.y + (b.y - a.y) * lt,
          rx: (a.rx || 50) + ((b.rx || 50) - (a.rx || 50)) * lt,
          ry: (a.ry || 42) + ((b.ry || 42) - (a.ry || 42)) * lt,
          label: b.label || a.label || 'THIS SPACE'
        };
      }
    }
    return kfs[kfs.length - 1];
  }

  _computeLiveSkaters(normProgress, applyDefenderJitter = false) {
    const mode = this.drill.mode;
    return (this.drill.skaters || []).map((sk, idx) => {
      let pos = samplePolylineAt(sk.motion || [sk.start], normProgress);
      if (sk.id === this.drill.youRole && (mode === 'ghost_player' || mode === 'gap_surfing' || mode === 'draw_the_route')) {
        pos = [...this.youCurrentPos];
      }
      const pickIdx = this.twoTouchPicked.indexOf(sk.id);
      const stickBase = sk.stickAngleDeg ?? (sk.team === 'home' ? 0 : 180);
      const stickJitter = (applyDefenderJitter && sk.team === 'away' && sk.id !== 'G')
        ? Math.sin(this.ambientElapsed * 5.2 + idx * 1.4) * 7.5
        : 0;
      return {
        ...sk,
        pos,
        stickAngleDeg: stickBase + stickJitter,
        chainBadge: pickIdx >= 0 ? `${pickIdx + 1}` : null,
        highlightSuspect: mode === 'spot_the_breakdown' && this.rewindPhase === 'pick_culprit' && sk.team === 'home' && sk.id !== 'G'
      };
    });
  }

  _renderCurrentFrame(nowMs = (typeof performance !== 'undefined' ? performance.now() : Date.now())) {
    if (!this.drill || !this.rink) return;
    const mode = this.drill.mode;
    const mc = this.drill.modeConfig || {};

    // Stage 5 Ghost Scrubber Rendering (`[👻 My Play]` vs `[⭐ Best Play]`)
    if (this.stage === 'debrief_dock') {
      const p = this.scrubProgress;
      const showBest = this.ghostViewMode === 'best_play';
      const skaters = (this.drill.skaters || []).map((sk) => {
        const isYou = sk.id === this.drill.youRole;
        let traj = p < 0.6
          ? (sk.motion || [sk.start])
          : ((showBest || this.isGoldResult) ? (sk.outcomeGold || sk.motion || [sk.start]) : (sk.outcomeMiss || sk.motion || [sk.start]));
        if (isYou && !showBest && this.recordedMyYouPath.length > 2) {
          traj = this.recordedMyYouPath;
        } else if (isYou && showBest && mode === 'draw_the_route' && Array.isArray(mc.idealRoute)) {
          traj = mc.idealRoute;
        }
        const subT = (isYou && (this.recordedMyYouPath.length > 2 || (showBest && mode === 'draw_the_route')))
          ? p
          : (p < 0.6 ? p / 0.6 : (p - 0.6) / 0.4);
        return {
          ...sk,
          pos: samplePolylineAt(traj, subT)
        };
      });

      const puckTraj = p < 0.6
        ? (this.drill.puck?.livePath || [[500, 250]])
        : ((showBest || this.isGoldResult) ? (this.drill.puck?.goldPath || [[500, 250]]) : (this.drill.puck?.missPath || [[500, 250]]));
      const puckPos = samplePolylineAt(puckTraj, p < 0.6 ? p / 0.6 : (p - 0.6) / 0.4);

      const ghostPaths = [];
      const bestGoldPath = this.drill.puck?.goldPath;
      if (showBest && Array.isArray(bestGoldPath) && bestGoldPath.length > 1) {
        ghostPaths.push({ type: 'pass', points: bestGoldPath, color: '#10B981', progress: p });
      }
      if (mode === 'draw_the_route') {
        if (showBest && Array.isArray(mc.idealRoute)) {
          ghostPaths.push({ type: 'skate', points: mc.idealRoute, color: '#F59E0B', progress: p });
        } else if (this.drawnRoutePoints.length > 1) {
          ghostPaths.push({ type: 'skate', points: this.drawnRoutePoints, color: '#14B8A6', progress: p });
        }
      }

      this.rink.renderScene({
        camera: this.drill.camera,
        nowMs,
        youRole: this.drill.youRole,
        showLeftHouse: Boolean(mc.showLeftHouse || this.drill.zone === 'DZ'),
        showRightHouse: Boolean(mc.showRightHouse || this.drill.zone === 'OZ'),
        paths: ghostPaths,
        skaters,
        puckPos,
        calloutPills: [{
          x: this.drill.camera.focusX,
          y: 34,
          text: showBest ? '⭐ BEST PLAY TRAJECTORY' : '👻 MY PLAY REPLAY',
          tone: showBest ? 'success' : 'gold'
        }]
      });
      return;
    }

    // Stage 4 Live Outcome Movie
    if (this.stage === 'outcome_movie') {
      const t = Math.min(1, this.outcomeElapsed / Math.max(0.1, this.outcomeDuration));
      const skaters = (this.drill.skaters || []).map((sk) => {
        let pts = this.isGoldResult ? (sk.outcomeGold || sk.motion) : (sk.outcomeMiss || sk.motion);
        if (sk.id === this.drill.youRole && mode === 'draw_the_route' && this.drawnRoutePoints.length > 1) {
          pts = this.drawnRoutePoints;
        }
        return { ...sk, pos: samplePolylineAt(pts || [sk.start], t) };
      });
      const puckPts = this.isGoldResult ? (this.drill.puck?.goldPath || [[500, 250]]) : (this.drill.puck?.missPath || [[500, 250]]);
      const puckPos = samplePolylineAt(puckPts, t);

      this.rink.renderScene({
        camera: this.drill.camera,
        nowMs,
        youRole: this.drill.youRole,
        paths: [{
          type: this.isGoldResult ? 'pass' : 'skate',
          points: puckPts,
          color: this.isGoldResult ? '#10B981' : '#DC2626',
          progress: t
        }],
        skaters,
        puckPos,
        calloutPills: [{
          x: this.drill.camera.focusX,
          y: 36,
          text: this.isGoldResult ? '🏆 CLEAN EXECUTION!' : '⚠️ TURNOVER — WATCH CONSEQUENCE',
          tone: this.isGoldResult ? 'success' : 'danger'
        }]
      });
      return;
    }

    // Stages 1, 2, 3 Active Rendering
    let normT = 0;
    if (this.stage !== 'pre_snap') {
      if (mode === 'read_and_react') normT = Math.min(1, this.simTime / Math.max(0.2, mc.freezeTime || 1.5));
      else if (mode === 'ghost_player') normT = Math.min(1, this.simTime / Math.max(0.2, mc.durationSec || 3.6));
      else if (mode === 'fog_of_war') normT = Math.min(1, this.simTime / Math.max(0.2, mc.passArrivalTime || 1.8));
      else if (mode === 'two_touch') normT = Math.min(1, this.simTime / Math.max(0.2, mc.passArrivalTime || 2.2));
      else if (mode === 'spot_the_breakdown') {
        const clip = mc.goalClipSec || 2.2;
        if (this.rewindPhase === 'watching_goal') normT = Math.min(1, this.simTime / clip);
        else if (this.rewindPhase === 'rewinding') normT = Math.max(0.35, 1 - this.rewindProgress * 0.65);
        else normT = 0.35;
      } else if (mode === 'gap_surfing') normT = Math.min(1, this.simTime / Math.max(0.2, mc.durationSec || 3.4));
      else if (mode === 'lane_sweeper') normT = Math.min(1, this.simTime / Math.max(0.2, mc.durationSec || 3.8));
      else if (mode === 'draw_the_route') normT = Math.min(1, this.simTime / Math.max(0.2, mc.setupMotionSec || 1.8));
      else if (mode === 'change_or_stay') normT = Math.min(1, this.simTime / Math.max(0.2, mc.clipSec || 1.8));
    }

    const skaters = this._computeLiveSkaters(normT, this.stage !== 'pre_snap');
    const youObj = skaters.find(s => s.id === this.drill.youRole);
    let puckPos = samplePolylineAt(this.drill.puck?.livePath || [[500, 250]], normT);

    // Build exact candidate target focalPoints so Kid-Clarity Viewport Lock (>=28px inset) covers every mode!
    const focalPoints = [];
    if (youObj && youObj.pos) focalPoints.push(youObj.pos);
    if (Array.isArray(mc.options)) {
      for (const opt of mc.options) if (opt.target) focalPoints.push(opt.target);
    }
    if (Array.isArray(mc.targetZoneKeyframes)) {
      for (const kf of mc.targetZoneKeyframes) focalPoints.push([kf.x, kf.y]);
    }
    if (Array.isArray(mc.candidates)) {
      for (const cand of mc.candidates) if (cand.target) focalPoints.push(cand.target);
    }
    if (mode === 'spot_the_breakdown') {
      const culpritSk = skaters.find(s => s.id === mc.culpritId);
      if (culpritSk && culpritSk.pos) focalPoints.push(culpritSk.pos);
      for (const sus of (mc.suspects || [])) {
        const sSk = skaters.find(s => s.id === sus.id);
        if (sSk && sSk.pos) focalPoints.push(sSk.pos);
      }
    }
    if (mode === 'gap_surfing') {
      const attSk = skaters.find(s => s.id === mc.attackerId);
      if (attSk && attSk.pos) focalPoints.push(attSk.pos);
    }
    if (mode === 'lane_sweeper') {
      if (mc.pivotOrigin) focalPoints.push(mc.pivotOrigin);
      for (const p of (mc.passes || [])) {
        if (p.from) focalPoints.push(p.from);
        if (p.to) focalPoints.push(p.to);
      }
    }
    if (mode === 'draw_the_route') {
      if (mc.thisSpace) focalPoints.push([mc.thisSpace.x, mc.thisSpace.y]);
      if (Array.isArray(mc.idealRoute)) {
        for (const pt of mc.idealRoute) focalPoints.push(pt);
      }
    }
    if (mode === 'change_or_stay' && mc.benchPos) {
      focalPoints.push(mc.benchPos);
    }

    const scene = {
      camera: this.drill.camera,
      focalPoints,
      nowMs,
      youRole: this.drill.youRole,
      showLeftHouse: Boolean(mc.showLeftHouse),
      showRightHouse: Boolean(mc.showRightHouse),
      pressureCones: [],
      thisSpaceHalo: null,
      paths: [],
      abcOptions: null,
      abcOrigin: null,
      fogOverlay: null,
      hiddenSkaterIds: [],
      gapZone: null,
      activeStickSweep: null,
      skaters,
      puckPos,
      calloutPills: [],
      shotClock: null
    };

    if (mode === 'read_and_react' && this.stage === 'challenge') {
      scene.pressureCones = mc.pressureCones || [];
      scene.abcOptions = mc.options || [];
      scene.abcOrigin = youObj ? youObj.pos : puckPos;
      if (!this.untimed) {
        scene.shotClock = { visible: true, remainingSec: this.shotClockLeft ?? 8.0, totalSec: Math.max(7.5, mc.shotClockSec || 8.0) };
      }
    } else if (mode === 'ghost_player') {
      const z = this._sampleGhostTargetZone(normT);
      scene.thisSpaceHalo = { ...z, color: this.coveragePct >= 55 ? 'emerald' : 'gold' };
    } else if (mode === 'fog_of_war') {
      const lifted = this.fogLiftRemainingSec > 0 || this.fogReadyForChoice;
      scene.fogOverlay = { ...(mc.fogRegion || { x: 250, y: 20, w: 200, h: 200 }), lifted };
      if (!lifted) scene.hiddenSkaterIds = mc.hiddenDefenderIds || [];
      if (this.fogReadyForChoice && this.stage === 'challenge') {
        scene.abcOptions = mc.options || [];
        scene.abcOrigin = youObj ? youObj.pos : puckPos;
      }
    } else if (mode === 'two_touch') {
      if (this.twoTouchPicked.length >= 1) {
        const n1 = skaters.find(s => s.id === this.twoTouchPicked[0]);
        if (youObj && n1) scene.paths.push({ type: 'pass', points: [youObj.pos, n1.pos], color: '#14B8A6' });
        if (this.twoTouchPicked.length >= 2) {
          const n2 = skaters.find(s => s.id === this.twoTouchPicked[1]);
          if (n1 && n2) scene.paths.push({ type: 'pass', points: [n1.pos, n2.pos], color: '#F59E0B' });
        }
      }
    } else if (mode === 'spot_the_breakdown') {
      if (this.rewindPhase === 'rewinding') {
        scene.calloutPills.push({ x: this.drill.camera.focusX, y: 42, text: '⏪ AUTO-REWIND -3.0S', tone: 'danger' });
      } else if (this.rewindPhase === 'pick_culprit') {
        scene.calloutPills.push({ x: this.drill.camera.focusX, y: 42, text: '🕵️ TAP DEFENDER WHO BLEW COVERAGE', tone: 'gold' });
      }
    } else if (mode === 'gap_surfing') {
      const att = skaters.find(s => s.id === mc.attackerId);
      if (att && youObj) {
        const gap = att.pos[0] - youObj.pos[0];
        const inZone = Math.abs(gap - (mc.idealGapDist || 82)) <= (mc.gapTolerance || 48);
        scene.gapZone = {
          attackerPos: att.pos,
          idealDist: mc.idealGapDist || 82,
          tolerance: mc.gapTolerance || 48,
          isInZone: inZone
        };
      }
    } else if (mode === 'lane_sweeper') {
      scene.activeStickSweep = {
        origin: mc.pivotOrigin || (youObj ? youObj.pos : [180, 250]),
        reach: mc.stickReach || 90,
        angleRad: this.stickSweepAngleRad
      };
      for (const p of (mc.passes || [])) {
        if (this.simTime >= p.tStart && this.simTime <= p.tEnd) {
          const prog = (this.simTime - p.tStart) / Math.max(0.1, p.tEnd - p.tStart);
          scene.puckPos = [
            p.from[0] + (p.to[0] - p.from[0]) * prog,
            p.from[1] + (p.to[1] - p.from[1]) * prog
          ];
          scene.paths.push({
            type: 'pass',
            points: [p.from, p.to],
            color: p.isThreat ? '#DC2626' : '#64748B',
            progress: prog
          });
          scene.calloutPills.push({
            x: this.drill.camera.focusX,
            y: 38,
            text: p.label,
            tone: p.isThreat ? 'danger' : 'gold'
          });
        }
      }
    } else if (mode === 'draw_the_route') {
      if (mc.thisSpace) {
        scene.thisSpaceHalo = { x: mc.thisSpace.x, y: mc.thisSpace.y, rx: mc.thisSpace.r, ry: mc.thisSpace.r * 0.82, label: mc.thisSpace.label || 'THIS SPACE', color: 'gold' };
      }
      if (this.drawnRoutePoints.length > 1) {
        scene.paths.push({ type: 'skate', points: this.drawnRoutePoints, color: '#14B8A6' });
      }
    } else if (mode === 'change_or_stay') {
      if (mc.benchPos) {
        scene.thisSpaceHalo = { x: mc.benchPos[0], y: mc.benchPos[1] + 16, rx: 48, ry: 20, label: 'BENCH DOOR', color: 'gold' };
      }
      scene.calloutPills.push({
        x: this.drill.camera.focusX,
        y: 448,
        text: `⚡ ${mc.fatiguePct}% TIRED • ${mc.situationTag || ''}`,
        tone: 'danger'
      });
    }

    this.rink.renderScene(scene);
    this._syncOnIceInteractiveOverlay(skaters);

    const audit = this.rink._lastFrameAudit || {};
    this.lastLiveSnapshot = {
      stage: this.stage,
      simTime: this.simTime,
      normT,
      skaterCount: audit.skaterCount ?? skaters.length,
      visibleSkaterCount: audit.visibleSkaterCount ?? skaters.length,
      puckVisible: Boolean(audit.puckVisible),
      puckPos: [...(scene.puckPos || puckPos)],
      skaters: skaters.map(s => ({ id: s.id, team: s.team, pos: [...s.pos] }))
    };
  }
}
