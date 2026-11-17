/**
 * SYNAPZ HOCKEY v14.0 — Master ES-Module Teaching & 9-Mode Engine Bootstrap
 * (`engine/v14_bootstrap.js`)
 *
 * Mounts inside V1's `#gameViewSection` while preserving 100% of V1's meta-world,
 * 5 HD Arena rooms, standing 3D Avatars, Equipment Bag, Pro Shop, 3D World Tour Globe,
 * Offline Outbox, Net-30 PO, and 3-Role Portals (`Player`, `Coach`, `Camp`, `Association`).
 */

import { RINK_SPEC, WhiteIceRink1000x500 } from './rink_1000x500.js';
import { CANONICAL_9_MODES, validateDrillSchema, validateDrillCatalog } from './validate_drills.js';
import { ChalkTalkReelController } from './chalk_reel.js';
import { Subconscious9ModeEngine, MODE_LABELS } from './modes_9pack.js';
import {
  ensureProfileConceptMastery,
  getConceptStatus,
  markConceptReelWatched,
  recordConceptRepResult,
  compute5ZoneRingSummaries,
  renderZoneSkillRingsHtml,
  BlooketPayoffController,
  DrillCatalogDrawerController
} from './blooket_payoff.js';
import { TeamShowdownController } from './team_showdown.js';

class SynapzV14TeachingCoordinator {
  constructor() {
    this.catalog = null;
    this.ready = false;
    this.readyPromise = null;
    this.activeDrill = null;
    this.drillQueue = [];
    this.queueIdx = 0;
    this.shiftMode = 'city'; // 'city' | 'daily5' | 'guest' | 'coach_inbox' | 'single'
    this.liveStreak = 0;
    this.shiftRepsCompleted = 0;
    this.shiftGoldCount = 0;
    this.chalkReel = null;
    this.modeEngine = null;
    this.blooket = null;
    this.catalogDrawer = null;
  }

  async init() {
    if (this.readyPromise) return this.readyPromise;
    this.readyPromise = (async () => {
      const res = await fetch('./drills/catalog_45.json');
      if (!res.ok) throw new Error(`Failed to load drills/catalog_45.json (HTTP ${res.status})`);
      this.catalog = await res.json();
      const check = validateDrillCatalog(this.catalog);
      if (!check.valid) {
        console.warn('[SYNAPZ v14.0] Catalog validation warnings:', check);
      }
      this._mountEngineDom();
      this.ready = true;
      // Re-sync if player already entered #gameViewSection before fetch finished
      if (typeof window !== 'undefined' && window.state && window.state.view === 'game') {
        this.activateInGameView();
      }
      return this;
    })();
    return this.readyPromise;
  }

  _getActiveProfile() {
    if (typeof window !== 'undefined' && typeof window.getActiveProfile === 'function') {
      return window.getActiveProfile();
    }
    return {};
  }

  _getFederationMode() {
    if (typeof window !== 'undefined' && typeof window.getEffectiveFederationMode === 'function') {
      return window.getEffectiveFederationMode(this._getActiveProfile());
    }
    return 'USA';
  }

  _enforceZeroCutoutOverlap() {
    const cutoutIds = [
      'coachBobPopup',
      'btnCallCoachBob',
      'coachCornerWidget',
      'synapzPersistentCharCircleBtn',
      'synapzUniversalCharSpeechOverlay',
      'firstShiftAgentDrillTourOverlay',
      'firstShiftTourBanner'
    ];
    for (const id of cutoutIds) {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    }
  }

  _mountEngineDom() {
    if (typeof document === 'undefined') return;
    const gameSec = document.getElementById('gameViewSection');
    const rinkWrapper = document.getElementById('rinkWrapper');
    if (!gameSec || !rinkWrapper) return;

    // Inject strict v14 CSS hiding legacy dark-ice 4-button quiz bars & floating cutouts when v14 is mounted
    if (!document.getElementById('synapzV14EngineStyles')) {
      const style = document.createElement('style');
      style.id = 'synapzV14EngineStyles';
      style.textContent = `
        body.v14-white-ice-active #rinkWrapper,
        body.v14-white-ice-active #coachCornerWidget,
        body.v14-white-ice-active #coachBobPopup,
        body.v14-white-ice-active #btnCallCoachBob,
        body.v14-white-ice-active #synapzPersistentCharCircleBtn,
        body.v14-white-ice-active #synapzUniversalCharSpeechOverlay,
        body.v14-white-ice-active #firstShiftAgentDrillTourOverlay {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    let root = document.getElementById('v14TeachingEngineRoot');
    if (!root) {
      root = document.createElement('div');
      root.id = 'v14TeachingEngineRoot';
      root.className = 'w-full space-y-2';
      root.innerHTML = `
        <div id="v14ChalkReelMount" class="hidden w-full"></div>
        <div id="v14ModeEngineMount" class="w-full"></div>
        <div id="v14RinkFooterBar" class="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div id="v14RinkSkillRingsBar" class="flex-1 min-w-[260px]"></div>
          <div class="flex items-center gap-2 shrink-0">
            <button id="btnV14QuickDaily5" type="button" class="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow cursor-pointer">
              ⚡ Daily 5 Shift
            </button>
            <button id="btnV14SaveExitLobby" type="button" class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-400 text-emerald-300 font-black text-xs cursor-pointer">
              💾 Save &amp; Exit to Lobby
            </button>
          </div>
        </div>
        <div id="v14BlooketMount" class="hidden"></div>
        <div id="v14CatalogDrawerMount" class="hidden"></div>
      `;
      rinkWrapper.parentElement.insertBefore(root, rinkWrapper);
    }

    root.querySelector('#btnV14QuickDaily5')?.addEventListener('click', () => {
      this.startDaily5Shift();
    });

    root.querySelector('#btnV14SaveExitLobby')?.addEventListener('click', () => {
      if (window.__synapzGuestDemoSession && window.__synapzGuestDemoSession.active && typeof window.exitSynapzGuestDemoToScreen1 === 'function') {
        window.exitSynapzGuestDemoToScreen1();
        return;
      }
      document.body.classList.remove('v14-white-ice-active');
      if (typeof window.switchView === 'function') {
        window.switchView('lobby');
      }
    });

    this.chalkReel = new ChalkTalkReelController({
      mountEl: root.querySelector('#v14ChalkReelMount'),
      getFederationMode: () => this._getFederationMode(),
      onWatchedConcept: (conceptId) => {
        const prof = this._getActiveProfile();
        markConceptReelWatched(prof, conceptId);
        if (typeof window.saveProgress === 'function') window.saveProgress();
        this.refreshSkillRingsUI();
      },
      onComplete: (drill) => {
        root.querySelector('#v14ModeEngineMount')?.classList.remove('hidden');
        this.modeEngine.loadDrill(drill, { autoDrop: false });
      }
    });

    this.modeEngine = new Subconscious9ModeEngine({
      mountEl: root.querySelector('#v14ModeEngineMount'),
      getFederationMode: () => this._getFederationMode(),
      onOpenChalkReel: (drill) => {
        root.querySelector('#v14ModeEngineMount')?.classList.add('hidden');
        const prof = this._getActiveProfile();
        this.chalkReel.open(drill, prof?.positionCode || drill.youRole);
      },
      onOpenCatalog: () => {
        this.catalogDrawer.open();
      },
      onRepEvaluated: (outcome) => this._handleRepEvaluated(outcome),
      onNextRep: () => this.advanceNextRep()
    });

    this.blooket = new BlooketPayoffController({
      mountEl: root.querySelector('#v14BlooketMount'),
      onRewardCredited: (loot) => this._creditBlooketLootToProfile(loot)
    });

    this.catalogDrawer = new DrillCatalogDrawerController({
      mountEl: root.querySelector('#v14CatalogDrawerMount'),
      catalog: this.catalog,
      getProfile: () => this._getActiveProfile(),
      onSelectDrill: (drill) => {
        this.shiftMode = 'single';
        this.drillQueue = [drill];
        this.queueIdx = 0;
        this.presentDrill(drill, { forceChalkReel: false });
      },
      onLaunchDaily5: () => this.startDaily5Shift(),
      onImportDrills: (newDrills) => {
        for (const d of newDrills) {
          const idx = this.catalog.drills.findIndex(x => x.id === d.id);
          if (idx >= 0) this.catalog.drills[idx] = d;
          else this.catalog.drills.push(d);
        }
      }
    });

    // Global 4-Digit Blooket Live Team Showdown PIN Mount (accessible from Coach's Office, Ice Rink, Clubhouse & Try 3 Plays Free!)
    let showdownMount = document.getElementById('v14GlobalShowdownMount');
    if (!showdownMount) {
      showdownMount = document.createElement('div');
      showdownMount.id = 'v14GlobalShowdownMount';
      showdownMount.className = 'hidden';
      document.body.appendChild(showdownMount);
    }

    this.showdown = new TeamShowdownController({
      mountEl: showdownMount,
      getCatalog: () => this.catalog,
      getActiveProfile: () => this._getActiveProfile(),
      getFederationMode: () => this._getFederationMode(),
      onRewardsCredited: ({ earnedBucks, earnedIq }) => {
        const prof = this._getActiveProfile();
        if (typeof window !== 'undefined' && window.state) {
          window.state.puckBucks = Number(window.state.puckBucks || prof?.puckBucks || 0) + Number(earnedBucks || 0);
          window.state.iqScore = Number(window.state.iqScore || prof?.iqScore || 0) + Number(earnedIq || 0);
          if (prof && prof.id) {
            prof.puckBucks = window.state.puckBucks;
            prof.iqScore = window.state.iqScore;
          }
          if (typeof window.saveProgress === 'function') window.saveProgress();
          if (typeof window.updateHeaderStats === 'function') window.updateHeaderStats();
        }
        this.refreshSkillRingsUI();
      }
    });

    if (!this._boundShowdownDelegation) {
      this._boundShowdownDelegation = true;
      document.addEventListener('click', (ev) => {
        const hostBtn = ev.target?.closest?.('[data-open-host-showdown]');
        if (hostBtn) {
          ev.preventDefault();
          this.openHostShowdown();
          return;
        }
        const joinBtn = ev.target?.closest?.('[data-open-join-showdown]');
        if (joinBtn) {
          ev.preventDefault();
          document.getElementById('synapzGuestSpeedModal')?.classList.add('hidden');
          this.openJoinShowdown();
        }
      });
    }
  }

  openHostShowdown() {
    if (!this.showdown) return;
    this.showdown.openHostSetup();
  }

  openJoinShowdown(pin = '') {
    if (!this.showdown) return;
    this.showdown.openJoinModal(pin);
  }

  activateInGameView() {
    if (!this.ready || !this.catalog) return;
    document.body.classList.add('v14-white-ice-active');
    this._enforceZeroCutoutOverlap();

    const guestSess = typeof window !== 'undefined' ? window.__synapzGuestDemoSession : null;
    const exitBtn = document.getElementById('btnV14SaveExitLobby');
    if (exitBtn) {
      exitBtn.textContent = guestSess && guestSess.active ? '← Exit Free Shift' : '💾 Save & Exit to Lobby';
    }

    if (guestSess && guestSess.active) {
      this.shiftMode = 'guest';
      const tierDrills = guestSess.tier === 'coach_preview'
        ? [this.getDrillById('DRILL-RR-01')]
        : (guestSess.tier === 'youth'
            ? [this.getDrillById('DRILL-RR-01'), this.getDrillById('DRILL-GP-02'), this.getDrillById('DRILL-CS-01')]
            : [this.getDrillById('DRILL-RR-02'), this.getDrillById('DRILL-FW-01'), this.getDrillById('DRILL-TT-01')]);
      this.drillQueue = tierDrills.filter(Boolean);
      this.queueIdx = Math.min(this.drillQueue.length - 1, Number(guestSess.playIndex || 0));
      const drill = this.drillQueue[this.queueIdx] || this.catalog.drills[0];
      // Keep Try 3 Plays Free ultra-snappy (skip reel by default unless tapped)
      this.presentDrill(drill, { forceSkipReel: true });
      this.refreshSkillRingsUI();
      return;
    }

    if (window.state && window.state.activeCoachInboxPlan) {
      this.shiftMode = 'coach_inbox';
      const plan = window.state.activeCoachInboxPlan;
      const focusLower = String(plan.focusConcept || '').toLowerCase();
      let matching = this.catalog.drills.filter(d => {
        if (focusLower.includes('rush')) return d.zone === 'OM';
        if (focusLower.includes('d-zone') || focusLower.includes('house')) return d.zone === 'DZ';
        if (focusLower.includes('power') || focusLower.includes('special')) return d.zone === 'ST';
        if (focusLower.includes('forecheck') || focusLower.includes('o-zone')) return d.zone === 'OZ';
        return d.zone === 'NZ' || d.zone === 'DZ';
      });
      if (matching.length < 3) matching = this.catalog.drills.slice(0, 5);
      const count = Number(plan.lessonCount || 5);
      this.drillQueue = Array.from({ length: count }, (_, i) => matching[i % matching.length]);
      this.queueIdx = 0;
      this.shiftRepsCompleted = 0;
      this.shiftGoldCount = 0;
      this.presentDrill(this.drillQueue[0], { forceSkipReel: false });
      this.refreshSkillRingsUI();
      return;
    }

    // Default NHL City Tour Shift (5-rep City Shift mapped to city focus)
    this.startCityShift(window.state?.currentCityIdx || 0);
  }

  getDrillById(id) {
    const clean = String(id || '').trim();
    return (this.catalog?.drills || []).find(d => d.id === clean || d.conceptId === clean) || this.catalog?.drills?.[0] || null;
  }

  loadDrillByConceptOrId(code, { forceSkipReel = true, autoDrop = false } = {}) {
    const drill = this.getDrillById(code);
    if (!drill) return null;
    this.shiftMode = 'single';
    this.drillQueue = [drill];
    this.queueIdx = 0;
    this.presentDrill(drill, { forceSkipReel });
    if (autoDrop && !this.chalkReel?.isOpen && this.modeEngine) {
      this.modeEngine.dropPuck();
    }
    return drill;
  }

  pauseActiveTimers() {
    let pausedAny = false;
    if (this.chalkReel?.pauseForModal?.()) pausedAny = true;
    if (this.modeEngine?.pauseForModal?.()) pausedAny = true;
    return pausedAny;
  }

  resumeActiveTimers() {
    let resumedAny = false;
    if (this.chalkReel?.resumeAfterModal?.()) resumedAny = true;
    if (this.modeEngine?.resumeAfterModal?.()) resumedAny = true;
    return resumedAny;
  }

  getLiveRedFlagContext() {
    const prof = this._getActiveProfile() || {};
    const showdownRoot = typeof document !== 'undefined' ? document.getElementById('v14GlobalShowdownMount') : null;
    if (showdownRoot && !showdownRoot.classList.contains('hidden') && this.showdown) {
      const sdDrill = this.showdown.activeDrill || this.activeDrill;
      return {
        activeScreen: 'Team Showdown',
        drillId: sdDrill?.conceptId || sdDrill?.id || null,
        catalogDrillId: sdDrill?.id || null,
        drillTitle: sdDrill?.title || null,
        gameMode: sdDrill?.mode || 'team_showdown',
        positionRole: prof.positionCode || sdDrill?.youRole || null,
        stage: 'team_showdown'
      };
    }

    const catRoot = typeof document !== 'undefined' ? document.getElementById('v14CatalogDrawerMount') : null;
    if (catRoot && !catRoot.classList.contains('hidden')) {
      const cur = this.activeDrill;
      return {
        activeScreen: 'Drill Catalog',
        drillId: cur?.conceptId || cur?.id || null,
        catalogDrillId: cur?.id || null,
        drillTitle: cur?.title || null,
        gameMode: cur?.mode || null,
        positionRole: prof.positionCode || cur?.youRole || null,
        stage: 'catalog_drawer'
      };
    }

    const inGame = typeof document !== 'undefined' && (
      document.body.classList.contains('v14-white-ice-active') ||
      (typeof window !== 'undefined' && window.state && window.state.view === 'game')
    );
    if (inGame) {
      const reelSnap = this.chalkReel?.getContextSnapshot?.();
      if (reelSnap) return reelSnap;
      const modeSnap = this.modeEngine?.getContextSnapshot?.();
      if (modeSnap) {
        return {
          ...modeSnap,
          positionRole: modeSnap.positionRole || prof.positionCode || null
        };
      }
    }
    return null;
  }

  getDrillByMode(modeName) {
    return (this.catalog?.drills || []).find(d => d.mode === modeName) || null;
  }

  startCityShift(cityIdx = 0) {
    if (!this.catalog) return;
    this.shiftMode = 'city';
    const cities = (typeof window !== 'undefined' && window.NHL_CITIES) || [];
    const city = cities[cityIdx] || { id: 'sanjose', focus: 'breakout' };
    const cityHits = this.catalog.drills.filter(d => Array.isArray(d.nhlCities) && d.nhlCities.includes(city.id));
    const pool = cityHits.length >= 2 ? cityHits : this.catalog.drills;
    this.drillQueue = Array.from({ length: 5 }, (_, i) => pool[(cityIdx + i) % pool.length]);
    this.queueIdx = 0;
    this.shiftRepsCompleted = 0;
    this.shiftGoldCount = 0;
    this.presentDrill(this.drillQueue[0], { forceSkipReel: false });
    this.refreshSkillRingsUI();
  }

  startDaily5Shift() {
    if (!this.catalog) return;
    this.shiftMode = 'daily5';
    const prof = this._getActiveProfile();
    const sorted = [...this.catalog.drills].sort((a, b) => {
      const sa = getConceptStatus(prof, a.conceptId).attempts;
      const sb = getConceptStatus(prof, b.conceptId).attempts;
      return sa - sb;
    });
    this.drillQueue = sorted.slice(0, 5);
    this.queueIdx = 0;
    this.shiftRepsCompleted = 0;
    this.shiftGoldCount = 0;
    this.presentDrill(this.drillQueue[0], { forceSkipReel: false });
    this.refreshSkillRingsUI();
  }

  presentDrill(drill, { forceChalkReel = false, forceSkipReel = false } = {}) {
    if (!drill) return;
    this.activeDrill = drill;
    this._enforceZeroCutoutOverlap();
    const prof = this._getActiveProfile();
    const cStatus = getConceptStatus(prof, drill.conceptId);
    const shouldShowReel = forceChalkReel || (!forceSkipReel && cStatus.state === 'unwatched');

    const modeMount = document.getElementById('v14ModeEngineMount');
    if (shouldShowReel) {
      modeMount?.classList.add('hidden');
      this.chalkReel.open(drill, prof?.positionCode || drill.youRole);
    } else {
      this.chalkReel.close();
      modeMount?.classList.remove('hidden');
      this.modeEngine.loadDrill(drill, { autoDrop: false });
    }
    this.modeEngine.updateStreakBadge(this.liveStreak);
  }

  _handleRepEvaluated({ drill, isGold, earnedIq, earnedBucks }) {
    const prof = this._getActiveProfile();
    if (isGold) {
      this.liveStreak += 1;
      this.shiftGoldCount += 1;
    } else {
      this.liveStreak = 0;
    }
    this.shiftRepsCompleted += 1;
    this.modeEngine.updateStreakBadge(this.liveStreak);

    // Guest Funnel (`⚡ Try 3 Plays Free`) Compatibility
    const guestSess = typeof window !== 'undefined' ? window.__synapzGuestDemoSession : null;
    if (guestSess && guestSess.active && typeof window.handleGuestDemoPlayResolved === 'function') {
      window.handleGuestDemoPlayResolved({ isCorrect: isGold, mult: isGold ? 1.0 : 0 });
      return;
    }

    // Update 45-Concept Mastery & Profile IQ / Puck Bucks
    if (prof && drill?.conceptId) {
      recordConceptRepResult(prof, drill.conceptId, isGold);
    }
    if (typeof window !== 'undefined' && window.state) {
      // Respect Coach-Assigned Plan Firewall via V1's recordAdaptivePlayOutcome if available
      if (typeof window.recordAdaptivePlayOutcome === 'function' && prof && window.SCENARIOS?.[0]) {
        try {
          window.recordAdaptivePlayOutcome(prof, window.SCENARIOS[0], isGold, isGold ? 1.0 : 0);
        } catch (_) {}
      }
      window.state.iqScore = Math.max(0, Number(window.state.iqScore || prof?.iqScore || 0) + earnedIq);
      window.state.puckBucks = Math.max(0, Number(window.state.puckBucks || prof?.puckBucks || 0) + earnedBucks);
      if (prof) {
        prof.iqScore = window.state.iqScore;
        prof.puckBucks = window.state.puckBucks;
      }
      if (typeof window.saveProgress === 'function') window.saveProgress();
      if (typeof window.updateHeaderStats === 'function') window.updateHeaderStats();
    }

    this.refreshSkillRingsUI();

    // Blooket Subconscious Payoff Trigger: 3 Gold reads in a row!
    if (isGold && this.liveStreak > 0 && this.liveStreak % 3 === 0) {
      setTimeout(() => {
        if (!this.blooket.isOpen) {
          this.blooket.launch({
            reason: `🔥 ${this.liveStreak}x Gold Streak Bonus!`,
            baseBucks: 40
          });
        }
      }, 280);
    }
  }

  _creditBlooketLootToProfile(loot) {
    const prof = this._getActiveProfile();
    const bucks = Number(loot.puckBucksAwarded || 60);
    const iq = Number(loot.iqAwarded || 15);
    if (typeof window !== 'undefined' && window.state) {
      window.state.puckBucks = Number(window.state.puckBucks || prof?.puckBucks || 0) + bucks;
      window.state.iqScore = Number(window.state.iqScore || prof?.iqScore || 0) + iq;
      if (prof) {
        prof.puckBucks = window.state.puckBucks;
        prof.iqScore = window.state.iqScore;
        prof.blooketBagsOpened = Number(prof.blooketBagsOpened || 0) + 1;
        prof.unlockedCityIdx = Math.min(31, Number(prof.unlockedCityIdx || 0) + Number(loot.cityProgressPts || 1));
        if (!Array.isArray(prof.blooketGearDrops)) prof.blooketGearDrops = [];
        if (loot.gearBonus) prof.blooketGearDrops.push(loot.gearBonus);
      }
      if (typeof window.saveProgress === 'function') window.saveProgress();
      if (typeof window.updateHeaderStats === 'function') window.updateHeaderStats();
    }
  }

  advanceNextRep() {
    const guestSess = typeof window !== 'undefined' ? window.__synapzGuestDemoSession : null;
    if (guestSess && guestSess.active && typeof window.advanceGuestDemoPlay === 'function') {
      window.advanceGuestDemoPlay();
      if (window.__synapzGuestDemoSession && window.__synapzGuestDemoSession.active) {
        this.activateInGameView();
      }
      return;
    }

    if (this.queueIdx + 1 < this.drillQueue.length) {
      this.queueIdx += 1;
      this.presentDrill(this.drillQueue[this.queueIdx], { forceSkipReel: false });
      return;
    }

    // Completed a 5-rep Daily / City / Coach's Inbox Shift!
    if (this.shiftMode === 'coach_inbox' && window.state?.activeCoachInboxPlan && typeof window.completeCoachInboxPlan === 'function') {
      const plan = window.state.activeCoachInboxPlan;
      const pct = Math.round((this.shiftGoldCount / Math.max(1, this.drillQueue.length)) * 100);
      window.state.activeCoachInboxPlan = null;
      window.completeCoachInboxPlan(plan.planId, pct, [], {
        code: plan.teamCode,
        iqEarned: 25,
        puckBucksEarned: 35,
        completedDrillIds: this.drillQueue.map(d => d.id)
      }).catch(() => {});
    }

    if (this.drillQueue.length >= 5 && !this.blooket.isOpen) {
      this.blooket.launch({
        reason: '🏆 5-Rep Shift Complete Bonus!',
        baseBucks: 50
      });
    }

    // Start fresh cycle
    this.queueIdx = 0;
    this.presentDrill(this.drillQueue[0] || this.catalog.drills[0], { forceSkipReel: true });
  }

  refreshSkillRingsUI() {
    if (!this.catalog || typeof document === 'undefined') return;
    const prof = this._getActiveProfile();
    const html = renderZoneSkillRingsHtml(prof, this.catalog, { compact: true });
    const rinkBar = document.getElementById('v14RinkSkillRingsBar');
    if (rinkBar) rinkBar.innerHTML = html;
    const officeBox = document.getElementById('v14CoachOfficeSkillRingsMount');
    if (officeBox) officeBox.innerHTML = renderZoneSkillRingsHtml(prof, this.catalog, { compact: false });
  }

  renderSkillRingsHtmlForProfile(prof, opts = {}) {
    return renderZoneSkillRingsHtml(prof || this._getActiveProfile(), this.catalog, opts);
  }
}

export const synapzV14 = new SynapzV14TeachingCoordinator();

if (typeof window !== 'undefined') {
  window.SynapzV14Engine = synapzV14;
  window.openSynapzHostShowdown = () => synapzV14.openHostShowdown();
  window.openSynapzJoinShowdown = (pin = '') => synapzV14.openJoinShowdown(pin);
  window.SynapzV14Modules = {
    RINK_SPEC,
    WhiteIceRink1000x500,
    CANONICAL_9_MODES,
    MODE_LABELS,
    validateDrillSchema,
    validateDrillCatalog,
    ensureProfileConceptMastery,
    getConceptStatus,
    markConceptReelWatched,
    recordConceptRepResult,
    compute5ZoneRingSummaries,
    renderZoneSkillRingsHtml,
    TeamShowdownController
  };
  synapzV14.init().catch((err) => {
    console.error('[SYNAPZ v14.0] Bootstrap initialization error:', err);
  });
}
