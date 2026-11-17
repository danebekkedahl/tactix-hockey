/**
 * SYNAPZ HOCKEY v14.0 — 15-Second Interactive City / Concept Chalk-Talk Reel
 * (`engine/chalk_reel.js`)
 *
 * Honest Hockey + IHS Interactive Micro-Lesson Card:
 *  - Category kicker in caps + bold <= 7-word human headline
 *  - Interactive `YOU ARE: [C] [LW] [RW] [LD] [RD]` pill switcher above white ice
 *  - 3-Beat Animated Whiteboard Breakdown (12–15s: Setup -> Movement -> Execution)
 *  - Spoken + Mute-Safe 2-line vertical-bar captions underneath
 *  - Big thumb-friendly `🏒 Got It — Drop Puck! ➔` CTA
 */

import { WhiteIceRink1000x500, samplePolylineAt } from './rink_1000x500.js';

const POSITIONS_5 = ['C', 'LW', 'RW', 'LD', 'RD'];

export class ChalkTalkReelController {
  constructor({ mountEl, onComplete, onWatchedConcept, getFederationMode }) {
    this.mountEl = mountEl;
    this.onComplete = onComplete;
    this.onWatchedConcept = onWatchedConcept;
    this.getFederationMode = getFederationMode || (() => 'USA');

    this.drill = null;
    this.activePosition = 'C';
    this.isPlaying = false;
    this.isOpen = false;
    this.elapsedSec = 0;
    this.totalSec = 13;
    this.currentBeatIdx = -1;
    this._pausedByModal = false;
    this._rafId = null;
    this._lastTs = 0;
    this.rink = null;

    this._buildDom();
  }

  _buildDom() {
    if (!this.mountEl) return;
    this.mountEl.innerHTML = `
      <div id="v14ChalkReelCard" class="w-full rounded-2xl bg-[#090D16] border-2 border-teal-400/80 shadow-2xl overflow-hidden flex flex-col">
        <!-- Header: Category Kicker + <=7-Word Human Headline -->
        <div class="px-3.5 pr-28 pt-3 pb-2 border-b border-slate-800/90 flex flex-wrap items-start justify-between gap-2">
          <div class="min-w-0">
            <div id="v14ChalkKicker" class="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-teal-400">
              DEFENSIVE ZONE · BREAKOUT
            </div>
            <h3 id="v14ChalkHeadline" class="text-base sm:text-xl font-black text-white leading-tight mt-0.5">
              Two on your wall? Use the net.
            </h3>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <span id="v14ChalkTimerPill" class="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-[11px] font-black text-slate-200">
              🎬 13s Chalk Reel
            </span>
            <button id="btnChalkPlayPause" type="button" class="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[11px] font-black text-teal-300 cursor-pointer">
              ⏸ Pause
            </button>
          </div>
        </div>

        <!-- Interactive YOU ARE: [C] [LW] [RW] [LD] [RD] Pill Bar Directly Above White Ice -->
        <div id="v14ChalkPositionBar" class="px-3 py-1.5 bg-slate-950/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-300 mr-0.5">YOU ARE:</span>
            ${POSITIONS_5.map(pos => `
              <button type="button" data-chalk-pos="${pos}" class="v14-chalk-pos-btn min-w-[38px] min-h-[30px] px-2.5 py-1 rounded-full text-xs font-black border transition cursor-pointer">
                ${pos}
              </button>
            `).join('')}
          </div>
          <span id="v14ChalkPositionJobText" class="text-[11px] font-extrabold text-teal-300 truncate max-w-full sm:max-w-[340px]"></span>
        </div>

        <!-- Zoomed Crisp White Ice Sheet -->
        <div class="relative w-full bg-[#090D16] px-2 pt-2 pb-1">
          <div class="relative w-full mx-auto overflow-hidden rounded-xl" style="aspect-ratio: 16 / 9; max-height: 46vh;">
            <canvas id="v14ChalkCanvas" class="w-full h-full block" style="touch-action: none;"></canvas>
          </div>
          <!-- 3-Beat Progress & Stepper Pills -->
          <div id="v14ChalkBeatsBar" class="grid grid-cols-3 gap-1.5 mt-2">
            <button type="button" data-chalk-beat="0" class="v14-chalk-beat-btn py-1 px-2 rounded-lg text-[10px] sm:text-[11px] font-black border text-left truncate cursor-pointer">
              1 · Setup
            </button>
            <button type="button" data-chalk-beat="1" class="v14-chalk-beat-btn py-1 px-2 rounded-lg text-[10px] sm:text-[11px] font-black border text-left truncate cursor-pointer">
              2 · Movement
            </button>
            <button type="button" data-chalk-beat="2" class="v14-chalk-beat-btn py-1 px-2 rounded-lg text-[10px] sm:text-[11px] font-black border text-left truncate cursor-pointer">
              3 · Execution
            </button>
          </div>
        </div>

        <!-- Spoken + Mute-Safe 2-Line Vertical-Bar Caption + Got It CTA -->
        <div class="px-3.5 py-2.5 bg-slate-950 border-t border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div id="v14ChalkVerticalCaption" class="pl-3 border-l-4 border-teal-400 text-xs sm:text-sm font-bold text-slate-100 leading-snug whitespace-pre-line flex-1 min-w-0">
          </div>
          <button id="btnChalkReelDropPuck" type="button" class="w-full sm:w-auto shrink-0 py-2.5 px-5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-sm shadow-lg transition cursor-pointer">
            🏒 Got It — Drop Puck! ➔
          </button>
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

    this.mountEl.querySelectorAll('[data-chalk-beat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const bIdx = Number(btn.getAttribute('data-chalk-beat') || 0);
        this.jumpToBeat(bIdx);
      });
    });

    this.mountEl.querySelector('#btnChalkPlayPause')?.addEventListener('click', () => {
      this.isPlaying = !this.isPlaying;
      this._syncPlayPauseBtn();
      if (this.isPlaying) {
        this._lastTs = performance.now();
        this._scheduleFrame();
      }
    });

    this.mountEl.querySelector('#btnChalkReelDropPuck')?.addEventListener('click', () => {
      this.completeAndDropPuck();
    });
  }

  open(drill, defaultPosition = null) {
    if (!drill || !drill.lessonReel) return;
    this.drill = drill;
    const reel = drill.lessonReel;
    const preferred = POSITIONS_5.includes(defaultPosition) ? defaultPosition : (drill.youRole || 'C');
    this.activePosition = preferred;

    const beats = reel.beats || [];
    this.totalSec = beats.reduce((s, b) => s + Number(b.durationSec || 4), 0) || 13;
    this.elapsedSec = 0;
    this.currentBeatIdx = -1;
    this.isOpen = true;
    this.isPlaying = true;

    this.mountEl.classList.remove('hidden');
    this.rink.setFederationMode(this.getFederationMode());
    const portraitNow = typeof window !== 'undefined' && window.innerWidth < 520 && window.innerHeight > window.innerWidth * 1.25;
    this.rink.setOrientation(portraitNow ? 'portrait' : 'landscape');

    const kickerEl = this.mountEl.querySelector('#v14ChalkKicker');
    const hlEl = this.mountEl.querySelector('#v14ChalkHeadline');
    if (kickerEl) kickerEl.textContent = reel.kicker || 'CHALK-TALK MICRO-LESSON';
    if (hlEl) hlEl.textContent = reel.headline || drill.title;

    this._syncPositionButtons();
    this._syncPlayPauseBtn();

    if (typeof this.onWatchedConcept === 'function') {
      this.onWatchedConcept(drill.conceptId, drill.zone);
    }

    this._lastTs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this._renderAtElapsed(0);
    this._scheduleFrame();
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
      if (typeof window !== 'undefined' && window.speechSynthesis && !window.__SYNAPZ_TEST_MODE__) {
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
      if (typeof window !== 'undefined' && window.speechSynthesis) {
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
      stage: `beat_${Math.max(1, (this.currentBeatIdx || 0) + 1)}`
    };
  }

  completeAndDropPuck() {
    const drillRef = this.drill;
    this.close();
    if (typeof this.onComplete === 'function') {
      this.onComplete(drillRef, this.activePosition);
    }
  }

  setPosition(pos) {
    if (!POSITIONS_5.includes(pos)) return;
    this.activePosition = pos;
    this._syncPositionButtons();
    this._renderAtElapsed(this.elapsedSec);
  }

  jumpToBeat(beatIdx) {
    if (!this.drill || !this.drill.lessonReel) return;
    const beats = this.drill.lessonReel.beats || [];
    let acc = 0;
    for (let i = 0; i < Math.min(beatIdx, beats.length - 1); i++) {
      acc += Number(beats[i].durationSec || 4);
    }
    this.elapsedSec = acc + 0.05;
    this.currentBeatIdx = -1;
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
        ? 'v14-chalk-pos-btn min-w-[38px] min-h-[30px] px-2.5 py-1 rounded-full text-xs font-black border transition cursor-pointer bg-teal-400 text-slate-950 border-teal-200 shadow'
        : 'v14-chalk-pos-btn min-w-[38px] min-h-[30px] px-2.5 py-1 rounded-full text-xs font-black border transition cursor-pointer bg-slate-900 text-slate-200 border-slate-700 hover:border-teal-400/60';
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
        this.elapsedSec = 0; // Loop cleanly until player taps Got It — Drop Puck!
        this.currentBeatIdx = -1;
      }
      this._renderAtElapsed(this.elapsedSec, ts);
      this._scheduleFrame();
    });
  }

  _speakBeatCaption(captionText) {
    if (typeof window === 'undefined') return;
    const clean = String(captionText || '').replace(/\n+/g, ' ').trim();
    if (!clean) return;
    // Note: Chalk-Talk Reel renders its own built-in 2-line vertical-bar caption (#v14ChalkVerticalCaption)
    // right below the white ice, so hide the top floating #synapzMuteSafeCaptionRibbon to avoid double-caption overlap!
    document.getElementById('synapzMuteSafeCaptionRibbon')?.classList.add('hidden');
    if (!window.__SYNAPZ_TEST_MODE__ && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(clean);
        utt.rate = 1.04;
        window.speechSynthesis.speak(utt);
      } catch (_) {}
    }
  }

  _renderAtElapsed(sec, nowMs = performance.now()) {
    if (!this.drill || !this.drill.lessonReel || !this.rink) return;
    const reel = this.drill.lessonReel;
    const beats = reel.beats || [];
    let acc = 0;
    let bIdx = 0;
    let beatLocalProgress = 0;

    for (let i = 0; i < beats.length; i++) {
      const dur = Math.max(1, Number(beats[i].durationSec || 4));
      if (sec < acc + dur || i === beats.length - 1) {
        bIdx = i;
        beatLocalProgress = Math.max(0, Math.min(1, (sec - acc) / dur));
        break;
      }
      acc += dur;
    }

    const beat = beats[bIdx] || beats[0];
    if (bIdx !== this.currentBeatIdx) {
      this.currentBeatIdx = bIdx;
      const capEl = this.mountEl?.querySelector('#v14ChalkVerticalCaption');
      if (capEl && beat) {
        capEl.textContent = beat.caption || '';
      }
      if (beat) this._speakBeatCaption(beat.caption);

      this.mountEl?.querySelectorAll('[data-chalk-beat]').forEach((btn, idx) => {
        const active = idx === bIdx;
        btn.className = active
          ? 'v14-chalk-beat-btn py-1 px-2 rounded-lg text-[10px] sm:text-[11px] font-black border text-left truncate cursor-pointer bg-teal-400/20 border-teal-400 text-teal-200'
          : 'v14-chalk-beat-btn py-1 px-2 rounded-lg text-[10px] sm:text-[11px] font-black border text-left truncate cursor-pointer bg-slate-900 border-slate-800 text-slate-400';
      });
    }

    const timerPill = this.mountEl?.querySelector('#v14ChalkTimerPill');
    if (timerPill) {
      timerPill.textContent = `🎬 ${sec.toFixed(1)}s / ${this.totalSec}s`;
    }

    // Interpolate skater & puck positions gracefully across the 3 beats
    const overallT = bIdx === 0
      ? beatLocalProgress * 0.25
      : (bIdx === 1 ? 0.25 + beatLocalProgress * 0.55 : 0.80 + beatLocalProgress * 0.20);

    const skaters = (this.drill.skaters || []).map((sk) => {
      const pts = bIdx === 2 && Array.isArray(sk.outcomeGold) && sk.outcomeGold.length > 1
        ? sk.outcomeGold
        : (Array.isArray(sk.motion) && sk.motion.length > 1 ? sk.motion : [sk.start, sk.start]);
      const pos = samplePolylineAt(pts, bIdx === 2 ? beatLocalProgress : Math.min(1, overallT * 1.2));
      return {
        ...sk,
        pos
      };
    });

    const puckPts = bIdx === 2 && Array.isArray(this.drill.puck?.goldPath)
      ? this.drill.puck.goldPath
      : (this.drill.puck?.livePath || [[500, 250]]);
    const puckPos = samplePolylineAt(puckPts, bIdx === 2 ? beatLocalProgress : Math.min(1, overallT * 1.25));

    const animatedPaths = (beat?.paths || []).map(p => ({
      ...p,
      progress: Math.min(1, beatLocalProgress * 1.35)
    }));

    // Include position-specific IHS callout pill on open margin when user switches position!
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
  }
}
