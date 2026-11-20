/**
 * SYNAPZ HOCKEY v15.2 — Continuous 12-Second Auto-Playing Chalk-Talk Video Reel
 * (`engine/chalk_reel.js`)
 *
 * Pass 3 (Evan 54-Page Walkthrough Completion):
 *  - Normalizes full on-ice lineup (5 home skaters C/LW/RW/LD/RD + opponents + Goalie G + Puck)
 *    with STRICT 0-vanishing-skater persistence from t = 0.0s through t = 12.0s.
 *  - Replaces clickable 1. Setup / 2. Movement / 3. Execution quiz-looking pills with a sleek
 *    12-second Video Transport Scrubber Bar (⏯️ Pause/Play, ↺ Replay Clip, draggable 0:00 / 0:12
 *    scrubber, subtle non-button Setup • Read • Execute track text, synced speakClean() coaching).
 *  - Preserves YOU ARE: [C] [LW] [RW] [LD] [RD] role switcher (moving gold YOU ARE crease halo)
 *    + Untimed Practice toggle + pulsing primary `🏒 DROP PUCK — YOUR TURN ▸` CTA at clip end.
 */

import { WhiteIceRink1000x500, samplePolylineAt, normalizeDrillLineup } from './rink_1000x500.js';

const POSITIONS_5 = ['C', 'LW', 'RW', 'LD', 'RD'];
const CLIP_DURATION_SEC = 12.0;

function formatClockSec(secRaw) {
  const s = Math.max(0, Math.min(12, Math.floor(Number(secRaw) || 0)));
  return `0:${String(s).padStart(2, '0')}`;
}

export class ChalkTalkReelController {
  constructor({ mountEl, onComplete, onWatchedConcept, onRoleChange, onUntimedChange, getFederationMode }) {
    this.mountEl = mountEl;
    this.onComplete = onComplete;
    this.onWatchedConcept = onWatchedConcept;
    this.onRoleChange = onRoleChange;
    this.onUntimedChange = onUntimedChange;
    this.getFederationMode = getFederationMode || (() => 'USA');

    this.drill = null;
    this.activePosition = 'C';
    this.untimed = false;
    this.isPlaying = false;
    this.isOpen = false;
    this.clipFinished = false;
    this.elapsedSec = 0;
    this.totalSec = CLIP_DURATION_SEC;
    this.currentBeatIdx = -1;
    this._pausedByModal = false;
    this._rafId = null;
    this._lastTs = 0;
    this._clipEnvelopePoints = [];
    this.lastFrameSnapshot = null;
    this.rink = null;

    this._buildDom();
  }

  _buildDom() {
    if (!this.mountEl) return;
    this.mountEl.innerHTML = `
      <div id="v14ChalkReelCard" class="w-full h-full rounded-2xl bg-[#090D16] border-2 border-teal-400/80 shadow-2xl overflow-hidden flex flex-col">
        <!-- Compact Header + Interactive YOU ARE: [C] [LW] [RW] [LD] [RD] Role Switcher -->
        <div id="v14ChalkPositionBar" class="px-3 py-1.5 bg-slate-950/95 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2 min-w-0">
            <span id="v14ChalkKicker" class="px-2 py-0.5 rounded bg-teal-500/15 border border-teal-400/50 text-[10px] font-black uppercase tracking-wider text-teal-300 whitespace-nowrap">
              DEFENSIVE ZONE · BREAKOUT
            </span>
            <h3 id="v14ChalkHeadline" class="text-xs sm:text-sm font-black text-white leading-tight truncate">
              Two on your wall? Use the net.
            </h3>
          </div>
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-300 mr-0.5">YOU ARE:</span>
            ${POSITIONS_5.map(pos => `
              <button type="button" data-chalk-pos="${pos}" class="v14-chalk-pos-btn min-w-[38px] min-h-[30px] px-2.5 py-0.5 rounded-full text-xs font-black border transition cursor-pointer">
                ${pos}
              </button>
            `).join('')}
            <span id="v14ChalkPositionJobText" class="hidden xl:inline text-[11px] font-extrabold text-teal-300 truncate max-w-[260px] ml-1"></span>
          </div>
        </div>

        <!-- Zoomed Crisp 1000x500 White-Ice Video Sheet (Maximized Tunnel-Vision Area) -->
        <div class="relative w-full flex-1 min-h-0 bg-[#090D16] px-2 pt-1.5 pb-1 flex flex-col justify-center">
          <div id="v14ChalkCanvasWrap" class="relative w-full h-full mx-auto overflow-hidden rounded-xl" style="aspect-ratio: 16 / 9; max-height: calc(100vh - 218px); max-height: calc(100dvh - 218px); min-height: 210px;">
            <canvas id="v14ChalkCanvas" class="w-full h-full block" style="touch-action: none;"></canvas>
          </div>
        </div>

        <!-- Sleek 12-Second Video Transport Scrubber Bar (ZERO Step/Quiz Tab Buttons!) -->
        <div id="v14ChalkVideoTransportBar" class="px-3 py-1.5 bg-slate-950/95 border-t border-slate-800/90 flex flex-wrap items-center gap-2.5">
          <div class="flex items-center gap-1.5 shrink-0">
            <button id="btnChalkPlayPause" type="button" class="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-teal-400/60 text-xs font-black text-teal-200 transition cursor-pointer flex items-center gap-1">
              ⏸ Pause
            </button>
            <button id="btnChalkReplayClip" type="button" class="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-black text-slate-200 transition cursor-pointer flex items-center gap-1">
              ↺ Replay Clip
            </button>
          </div>

          <div class="flex-1 min-w-[180px] flex flex-col justify-center">
            <div class="flex items-center gap-2.5">
              <input
                id="v14ChalkVideoScrubber"
                type="range"
                min="0"
                max="1200"
                step="10"
                value="0"
                aria-label="Chalk-talk 12-second video timeline scrubber"
                class="w-full h-2 rounded-lg accent-teal-400 bg-slate-800 cursor-pointer"
              />
              <span id="v14ChalkTimecodeLabel" class="text-[11px] font-mono font-black text-teal-300 shrink-0 w-[68px] text-right">
                0:00 / 0:12
              </span>
            </div>
            <div id="v14ChalkPhaseMarkers" class="pointer-events-none select-none flex items-center justify-between text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500 px-0.5 mt-0.5">
              <span>Setup</span>
              <span>•</span>
              <span>Read</span>
              <span>•</span>
              <span>Execute</span>
            </div>
          </div>
        </div>

        <!-- Spoken + Mute-Safe Caption + Untimed Toggle + Unmistakable Primary DROP PUCK CTA -->
        <div class="px-3.5 py-2 bg-slate-950 border-t border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div id="v14ChalkVerticalCaption" class="pl-3 border-l-4 border-teal-400 text-xs sm:text-sm font-bold text-slate-100 leading-snug whitespace-pre-line flex-1 min-w-0">
          </div>
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <button id="btnChalkUntimedToggle" type="button" class="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-black transition cursor-pointer">
              🧘 Untimed Practice: OFF
            </button>
            <button id="btnChalkReelDropPuck" type="button" class="min-h-[46px] py-2.5 px-5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition cursor-pointer">
              🏒 DROP PUCK — YOUR TURN ▸
            </button>
          </div>
        </div>
      </div>
    `;

    const canvas = this.mountEl.querySelector('#v14ChalkCanvas');
    this.rink = new WhiteIceRink1000x500(canvas, { federationMode: this.getFederationMode() });

    this.mountEl.querySelectorAll('[data-chalk-pos]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pos = btn.getAttribute('data-chalk-pos') || 'C';
        this.setPosition(pos);
      });
    });

    this.mountEl.querySelector('#btnChalkPlayPause')?.addEventListener('click', () => {
      if (!this.isPlaying && this.elapsedSec >= this.totalSec - 0.05) {
        this.elapsedSec = 0;
        this.currentBeatIdx = -1;
        this.clipFinished = false;
        this._syncDropPuckPulse();
      }
      this.isPlaying = !this.isPlaying;
      this._syncPlayPauseBtn();
      if (this.isPlaying) {
        this._lastTs = typeof performance !== 'undefined' ? performance.now() : Date.now();
        this._scheduleFrame();
      }
    });

    this.mountEl.querySelector('#btnChalkReplayClip')?.addEventListener('click', () => {
      this.replayClip();
    });

    this.mountEl.querySelector('#v14ChalkVideoScrubber')?.addEventListener('input', (ev) => {
      const rawVal = Number(ev.currentTarget.value || 0);
      const sec = Math.max(0, Math.min(this.totalSec, rawVal / 100));
      this.seekTo(sec, { keepPlaying: this.isPlaying });
    });

    this.mountEl.querySelector('#btnChalkUntimedToggle')?.addEventListener('click', () => {
      this.setUntimed(!this.untimed, true);
    });

    this.mountEl.querySelector('#btnChalkReelDropPuck')?.addEventListener('click', () => {
      this.completeAndDropPuck();
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        if (this.isOpen && this.drill) {
          this._syncOrientation();
          this._renderAtElapsed(this.elapsedSec);
        }
      });
    }
  }

  _syncOrientation() {
    if (!this.rink) return;
    this.rink.setFederationMode(this.getFederationMode());
    this.rink.setOrientation('landscape');
  }

  _computeClipEnvelopePoints(drill) {
    const pts = [];
    if (!drill) return pts;
    for (const sk of (drill.skaters || [])) {
      if (Array.isArray(sk.start)) pts.push(sk.start);
      for (const m of (sk.motion || [])) pts.push(m);
      for (const g of (sk.outcomeGold || [])) pts.push(g);
    }
    for (const lp of (drill.puck?.livePath || [])) pts.push(lp);
    for (const gp of (drill.puck?.goldPath || [])) pts.push(gp);
    for (const b of (drill.lessonReel?.beats || [])) {
      if (b?.thisSpaceHalo) pts.push([b.thisSpaceHalo.x, b.thisSpaceHalo.y]);
    }
    return pts;
  }

  setUntimed(val, notify = false) {
    this.untimed = Boolean(val);
    const btn = this.mountEl?.querySelector('#btnChalkUntimedToggle');
    if (btn) {
      btn.textContent = this.untimed ? '🧘 Untimed Practice: ON' : '🧘 Untimed Practice: OFF';
      btn.className = this.untimed
        ? 'min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 border border-amber-200 text-xs font-black transition cursor-pointer shadow'
        : 'min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-black transition cursor-pointer';
    }
    if (notify && typeof this.onUntimedChange === 'function') {
      this.onUntimedChange(this.untimed);
    }
  }

  _syncDropPuckPulse() {
    const cta = this.mountEl?.querySelector('#btnChalkReelDropPuck');
    if (!cta) return;
    cta.className = this.clipFinished
      ? 'min-h-[46px] py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-300 via-teal-300 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl ring-4 ring-amber-300/80 animate-pulse transition cursor-pointer'
      : 'min-h-[46px] py-2.5 px-5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition cursor-pointer';
  }

  open(drillRaw, defaultPosition = null, opts = {}) {
    if (!drillRaw || !drillRaw.lessonReel) return;
    const drill = normalizeDrillLineup(drillRaw);
    this.drill = drill;
    this._clipEnvelopePoints = this._computeClipEnvelopePoints(drill);

    const reel = drill.lessonReel;
    const protagonist = drill.primaryRole || drill.youRole || 'C';
    const preferred = POSITIONS_5.includes(defaultPosition) ? defaultPosition : protagonist;
    this.activePosition = preferred;
    if (typeof opts.untimed === 'boolean') {
      this.setUntimed(opts.untimed, false);
    }

    this.totalSec = CLIP_DURATION_SEC;
    this.elapsedSec = 0;
    this.currentBeatIdx = -1;
    this.clipFinished = false;
    this.isOpen = true;
    this.isPlaying = true;

    this.mountEl.classList.remove('hidden');
    this._syncOrientation();

    const kickerEl = this.mountEl.querySelector('#v14ChalkKicker');
    const hlEl = this.mountEl.querySelector('#v14ChalkHeadline');
    if (kickerEl) kickerEl.textContent = reel.kicker || 'CHALK-TALK VIDEO REEL';
    if (hlEl) hlEl.textContent = reel.headline || drill.title;

    this._syncPositionButtons();
    this._syncPlayPauseBtn();
    this._syncDropPuckPulse();

    if (typeof this.onRoleChange === 'function') {
      this.onRoleChange(this.activePosition);
    }
    if (typeof this.onWatchedConcept === 'function') {
      this.onWatchedConcept(drill.conceptId, drill.zone);
    }

    this._lastTs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this._renderAtElapsed(0);
    this._scheduleFrame();
  }

  replayClip() {
    if (!this.drill) return;
    this.elapsedSec = 0;
    this.currentBeatIdx = -1;
    this.clipFinished = false;
    this.isPlaying = true;
    this._syncPlayPauseBtn();
    this._syncDropPuckPulse();
    this._lastTs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this._renderAtElapsed(0);
    this._scheduleFrame();
  }

  seekTo(secRaw, { keepPlaying = false } = {}) {
    if (!this.drill) return;
    this.elapsedSec = Math.max(0, Math.min(this.totalSec, Number(secRaw) || 0));
    this.clipFinished = this.elapsedSec >= this.totalSec - 0.02;
    this.isPlaying = Boolean(keepPlaying && !this.clipFinished);
    this._syncPlayPauseBtn();
    this._syncDropPuckPulse();
    this._renderAtElapsed(this.elapsedSec);
    if (this.isPlaying) {
      this._lastTs = typeof performance !== 'undefined' ? performance.now() : Date.now();
      this._scheduleFrame();
    } else if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  close() {
    this.isOpen = false;
    this.isPlaying = false;
    this._pausedByModal = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    try {
      if (typeof window !== 'undefined' && typeof window.cancelSynapzSpeechExplicit === 'function') {
        window.cancelSynapzSpeechExplicit('room_change');
      } else if (typeof window !== 'undefined' && window.speechSynthesis && !window.__SYNAPZ_TEST_MODE__) {
        window.speechSynthesis.cancel();
      }
    } catch (_) {}
    if (this.mountEl) this.mountEl.classList.add('hidden');
  }

  pauseForModal() {
    if (!this.isOpen) return false;
    if (this.isPlaying) {
      this._pausedByModal = true;
      this.isPlaying = false;
      if (this._rafId) {
        cancelAnimationFrame(this._rafId);
        this._rafId = null;
      }
      this._syncPlayPauseBtn();
    }
    try {
      if (typeof window !== 'undefined' && typeof window.cancelSynapzSpeechExplicit === 'function') {
        window.cancelSynapzSpeechExplicit('tour_close');
      } else if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch (_) {}
    return this._pausedByModal;
  }

  resumeAfterModal() {
    if (!this.isOpen || !this._pausedByModal) return false;
    this._pausedByModal = false;
    this.isPlaying = true;
    this._lastTs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this._syncPlayPauseBtn();
    this._scheduleFrame();
    return true;
  }

  getContextSnapshot() {
    if (!this.isOpen || !this.drill) return null;
    return {
      activeScreen: 'Chalk-Talk Reel',
      drillId: this.drill.conceptId || this.drill.id || null,
      catalogDrillId: this.drill.id || null,
      drillTitle: this.drill.title || null,
      gameMode: 'chalk_talk_reel',
      drillMode: this.drill.mode || null,
      positionRole: this.activePosition || this.drill.youRole || null,
      stage: `reel_${this.elapsedSec.toFixed(1)}s`
    };
  }

  completeAndDropPuck() {
    if (!this.isOpen || !this.drill) return;
    const drillRef = this.drill;
    const roleRef = this.activePosition;
    const untimedRef = this.untimed;
    this.close();
    if (typeof this.onComplete === 'function') {
      this.onComplete(drillRef, roleRef, { untimed: untimedRef });
    }
  }

  setPosition(pos) {
    if (!POSITIONS_5.includes(pos)) return;
    this.activePosition = pos;
    this._syncPositionButtons();
    if (typeof this.onRoleChange === 'function') {
      this.onRoleChange(pos);
    }
    this._renderAtElapsed(this.elapsedSec);
  }

  _syncPlayPauseBtn() {
    const btn = this.mountEl?.querySelector('#btnChalkPlayPause');
    if (btn) btn.textContent = this.isPlaying ? '⏸ Pause' : '▶ Play';
  }

  _syncPositionButtons() {
    if (!this.mountEl || !this.drill) return;
    const rolesMap = this.drill.lessonReel?.positionRoles || {};
    this.mountEl.querySelectorAll('[data-chalk-pos]').forEach((btn) => {
      const p = btn.getAttribute('data-chalk-pos');
      const active = p === this.activePosition;
      btn.className = active
        ? 'v14-chalk-pos-btn min-w-[38px] min-h-[30px] px-2.5 py-0.5 rounded-full text-xs font-black border transition cursor-pointer bg-teal-400 text-slate-950 border-teal-200 shadow'
        : 'v14-chalk-pos-btn min-w-[38px] min-h-[30px] px-2.5 py-0.5 rounded-full text-xs font-black border transition cursor-pointer bg-slate-900 text-slate-200 border-slate-700 hover:border-teal-400/60';
    });
    const jobEl = this.mountEl.querySelector('#v14ChalkPositionJobText');
    if (jobEl) {
      jobEl.textContent = rolesMap[this.activePosition]?.callout || `${this.activePosition}: Watch your lane & support!`;
    }
  }

  _scheduleFrame() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (!this.isOpen || !this.isPlaying) return;
    this._rafId = requestAnimationFrame((ts) => {
      if (!this.isOpen || !this.isPlaying) return;
      const dt = Math.min(0.1, Math.max(0, (ts - this._lastTs) / 1000));
      this._lastTs = ts;
      this.elapsedSec += dt;
      if (this.elapsedSec >= this.totalSec) {
        this.elapsedSec = this.totalSec;
        this.isPlaying = false;
        this.clipFinished = true;
        this._syncPlayPauseBtn();
        this._syncDropPuckPulse();
        this._renderAtElapsed(this.elapsedSec, ts);
        return;
      }
      this._renderAtElapsed(this.elapsedSec, ts);
      this._scheduleFrame();
    });
  }

  _speakBeatCaption(captionText) {
    if (typeof window === 'undefined') return;
    const clean = String(captionText || '').replace(/\n+/g, ' ').trim();
    if (!clean) return;
    document.getElementById('synapzMuteSafeCaptionRibbon')?.classList.add('hidden');
    if (typeof window.speakClean === 'function') {
      if (!window.__SYNAPZ_TEST_MODE__) {
        window.speakClean(clean, { characterId: 'coach-bob', rate: 1.04, reason: 'chalk_reel_beat', suppressCaptionRibbon: true });
      }
    }
  }

  _sampleContinuousActorAt(sk, clampedSec) {
    const startPt = sk.start || [500, 250];
    const motionPts = Array.isArray(sk.motion) && sk.motion.length > 0 ? sk.motion : [startPt, startPt];
    const motionEnd = motionPts[motionPts.length - 1] || startPt;
    const goldPts = Array.isArray(sk.outcomeGold) && sk.outcomeGold.length > 0 ? sk.outcomeGold : [motionEnd, motionEnd];

    // Phase 0..8s: smooth glide from start through motionPts (0..25% in Setup 0-4s, 25..100% in Read 4-8s)
    if (clampedSec <= 4.0) {
      const u = (clampedSec / 4.0) * 0.28;
      return samplePolylineAt(motionPts, u);
    }
    if (clampedSec <= 8.0) {
      const u = 0.28 + ((clampedSec - 4.0) / 4.0) * 0.72;
      return samplePolylineAt(motionPts, Math.min(1, u));
    }
    // Phase 8..12s: smooth execution from motionEnd (=== goldPts[0]) through goldPts[end]
    const uExec = Math.max(0, Math.min(1, (clampedSec - 8.0) / 4.0));
    return samplePolylineAt(goldPts, uExec);
  }

  _sampleContinuousPuckAt(puckObj, clampedSec) {
    const livePts = Array.isArray(puckObj?.livePath) && puckObj.livePath.length > 0 ? puckObj.livePath : [[500, 250]];
    const liveEnd = livePts[livePts.length - 1] || [500, 250];
    const goldPts = Array.isArray(puckObj?.goldPath) && puckObj.goldPath.length > 0 ? puckObj.goldPath : [liveEnd, liveEnd];

    if (clampedSec <= 4.0) {
      return samplePolylineAt(livePts, (clampedSec / 4.0) * 0.28);
    }
    if (clampedSec <= 8.0) {
      return samplePolylineAt(livePts, Math.min(1, 0.28 + ((clampedSec - 4.0) / 4.0) * 0.72));
    }
    return samplePolylineAt(goldPts, Math.max(0, Math.min(1, (clampedSec - 8.0) / 4.0)));
  }

  _renderAtElapsed(secRaw, nowMs = (typeof performance !== 'undefined' ? performance.now() : Date.now())) {
    if (!this.drill || !this.drill.lessonReel || !this.rink) return;
    const sec = Math.max(0, Math.min(this.totalSec, Number(secRaw) || 0));
    const reel = this.drill.lessonReel;
    const beats = reel.beats || [];

    // 3 seamless 4.0s narrative phases across the continuous 12.0s video reel: Setup (0-4s) • Read (4-8s) • Execute (8-12s)
    const bIdx = sec < 4.0 ? 0 : (sec < 8.0 ? 1 : 2);
    const beatLocalProgress = bIdx === 0
      ? sec / 4.0
      : (bIdx === 1 ? (sec - 4.0) / 4.0 : Math.min(1, (sec - 8.0) / 4.0));

    const beat = beats[Math.min(bIdx, Math.max(0, beats.length - 1))] || beats[0];
    if (bIdx !== this.currentBeatIdx) {
      this.currentBeatIdx = bIdx;
      const capEl = this.mountEl?.querySelector('#v14ChalkVerticalCaption');
      if (capEl && beat) {
        capEl.textContent = beat.caption || '';
      }
      if (beat) this._speakBeatCaption(beat.caption);
    }

    // Sync continuous scrubber slider & 0:00 / 0:12 timecode label
    const scrubberEl = this.mountEl?.querySelector('#v14ChalkVideoScrubber');
    if (scrubberEl) {
      scrubberEl.value = String(Math.round((sec / this.totalSec) * 1200));
    }
    const timecodeEl = this.mountEl?.querySelector('#v14ChalkTimecodeLabel');
    if (timecodeEl) {
      timecodeEl.textContent = `${formatClockSec(sec)} / 0:12`;
    }

    // STRICT NON-VANISHING INVARIANT: every skater in drill.skaters + puck renders continuously 0.0s -> 12.0s
    const skaters = (this.drill.skaters || []).map((sk) => {
      const pos = this._sampleContinuousActorAt(sk, sec);
      return {
        ...sk,
        pos
      };
    });

    const puckPos = this._sampleContinuousPuckAt(this.drill.puck, sec);

    const animatedPaths = (beat?.paths || []).map(p => ({
      ...p,
      progress: Math.min(1, beatLocalProgress * 1.35)
    }));

    const roleJob = reel.positionRoles?.[this.activePosition]?.callout;
    const pills = [...(beat?.calloutPills || [])];
    if (roleJob) {
      const youSkater = skaters.find(s => s.id === this.activePosition);
      if (youSkater) {
        const pillY = youSkater.pos[1] > 250 ? 34 : 466;
        pills.push({
          x: youSkater.pos[0],
          y: pillY,
          text: roleJob,
          tone: 'gold'
        });
      }
    }

    this.rink.renderScene({
      camera: this.drill.camera,
      viewportBoundsPoints: this._clipEnvelopePoints,
      nowMs,
      youRole: this.activePosition,
      showLeftHouse: this.drill.zone === 'DZ' || this.drill.zone === 'ST',
      showRightHouse: this.drill.zone === 'OZ',
      pressureCones: beat?.pressureCones || [],
      thisSpaceHalo: beat?.thisSpaceHalo || null,
      paths: animatedPaths,
      skaters,
      puckPos,
      calloutPills: pills
    });

    const audit = this.rink._lastFrameAudit || {};
    this.lastFrameSnapshot = {
      elapsedSec: sec,
      totalSec: this.totalSec,
      phaseLabel: bIdx === 0 ? 'Setup' : (bIdx === 1 ? 'Read' : 'Execute'),
      activePosition: this.activePosition,
      skaterCount: skaters.length,
      visibleSkaterCount: audit.visibleSkaterCount ?? skaters.length,
      puckVisible: Boolean(audit.puckVisible),
      puckPos: [...puckPos],
      skaters: skaters.map(s => ({ id: s.id, team: s.team, pos: [...s.pos] }))
    };
  }
}
