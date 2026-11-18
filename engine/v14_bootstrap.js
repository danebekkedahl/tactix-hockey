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
import { Subconscious9ModeEngine, MODE_LABELS, buildPlainKidQuestionHtml } from './modes_9pack.js';
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
import SynapzSkaterRenderer360, { renderCustomizableSkater, buildCustomizableSkaterSvg, buildMiniSkaterHeadSvg } from './skater_renderer_360.js';
import SynapzGearArt7525, { renderGearCategoryIconSvg, renderGearItemArtSvg, getOwnedLockerBagItems } from './gear_art_75_25.js';
import SynapzNhlAtlasMap, { renderNhlAtlasMap, NHL_ATLAS_CITIES } from './nhl_atlas_map.js';
import SynapzTrophyCase3Shelf, { renderTrophyCase3Shelf, evaluateTrophyCaseProgress } from './trophy_case_3shelf.js';

const LEGACY_SCENARIO_TO_V14_CONCEPT = Object.freeze({
  'spacing-1': 'OZ-03',
  'spacing-2': 'OZ-02',
  'spacing-3': 'OZ-04',
  'spacing-4': 'OZ-06',
  'rush-1': 'OM-01',
  'rush-2': 'OM-02',
  'rush-2v1-dish': 'OM-01',
  'rush-2v1-shoot': 'OM-06',
  'breakout-1': 'DZ-01',
  'breakout-2': 'DZ-05',
  'breakout-3': 'DZ-07',
  'breakout-4': 'DZ-06',
  'breakout-dtod': 'DZ-01',
  'house-1': 'DZ-03',
  'house-2': 'DZ-04',
  'house-3': 'DZ-08',
  'house-4': 'DZ-02',
  'basics-center': 'DZ-03',
  'basics-defense': 'OZ-05',
  'basics-offsides': 'NZ-05',
  'forecheck-1': 'OZ-07',
  'forecheck-2': 'OZ-08',
  'forecheck-212': 'OZ-07',
  'backcheck-1': 'NZ-06',
  'regroup-nz': 'NZ-01',
  'transition-1': 'NZ-02',
  'protect-cutback-wall': 'OZ-04',
  'delay-high-slot': 'OM-04',
  'd-gap-1v1': 'NZ-06',
  'd-2v1-slide': 'OM-05',
  'd-netfront-boxout': 'DZ-04',
  'd-blueline-walk': 'OZ-05',
  'goalie-angle-depth': 'DZ-09',
  'goalie-screen-look': 'DZ-10',
  'goalie-rim-comm': 'DZ-11',
  'goalie-rebound-steer': 'DZ-12'
});

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

    // Inject strict v14.3 CSS hiding 100% of legacy V1 game DOM & expanding #leftRinkColumn to full 12-col width
    if (!document.getElementById('synapzV14EngineStyles')) {
      const style = document.createElement('style');
      style.id = 'synapzV14EngineStyles';
      style.textContent = `
        body.v14-white-ice-active #gameTopSubheader,
        body.v14-white-ice-active #rinkWrapper,
        body.v14-white-ice-active #habitComboControlsBar,
        body.v14-white-ice-active #habitComboScorecardBox,
        body.v14-white-ice-active #multiFormatControlsBar,
        body.v14-white-ice-active #lessonConsistentBottomBar,
        body.v14-white-ice-active #coachCornerWidget,
        body.v14-white-ice-active #rightPanelDeck,
        body.v14-white-ice-active #coachBobPopup,
        body.v14-white-ice-active #btnCallCoachBob,
        body.v14-white-ice-active #synapzPersistentCharCircleBtn,
        body.v14-white-ice-active #synapzUniversalCharSpeechOverlay,
        body.v14-white-ice-active #firstShiftAgentDrillTourOverlay,
        body.v14-white-ice-active #firstShiftTourBanner,
        body.in-game-clean-mode #gameTopSubheader,
        body.in-game-clean-mode #rinkWrapper,
        body.in-game-clean-mode #habitComboControlsBar,
        body.in-game-clean-mode #habitComboScorecardBox,
        body.in-game-clean-mode #multiFormatControlsBar,
        body.in-game-clean-mode #lessonConsistentBottomBar,
        body.in-game-clean-mode #coachCornerWidget,
        body.in-game-clean-mode #rightPanelDeck {
          display: none !important;
        }
        body.v14-white-ice-active #leftRinkColumn,
        body.in-game-clean-mode #leftRinkColumn {
          grid-column: 1 / -1 !important;
          width: 100% !important;
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
        <div id="v14ActiveQuestionBanner" class="w-full rounded-2xl px-3.5 pr-24 py-2.5 bg-gradient-to-r from-amber-500/20 via-[#0C1322] to-slate-950 border-2 border-amber-400/85 border-l-4 border-l-amber-400 shadow-lg">
          <div id="v14ActiveQuestionBannerText" style="font-size: 16px; line-height: 1.32;" class="text-base sm:text-lg font-black text-white"></div>
        </div>
        <div id="v14ChalkReelMount" class="hidden w-full"></div>
        <div id="v14ModeEngineMount" class="w-full"></div>
        <div id="v14RinkFooterBar" class="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div id="v14RinkSkillRingsBar" class="flex-1 min-w-[240px]"></div>
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <button id="btnV14OpenTourMap" type="button" class="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-400/70 text-cyan-200 font-black text-xs cursor-pointer">
              🗺️ 32-City Tour
            </button>
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

    root.querySelector('#btnV14OpenTourMap')?.addEventListener('click', () => {
      document.body.classList.remove('v14-white-ice-active');
      if (typeof window.switchView === 'function') {
        window.switchView('map');
      }
    });

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

  mapLegacyScenarioOrFocusToConcept(rawId) {
    const clean = String(rawId || '').trim();
    if (!clean) return 'DZ-01';
    if (LEGACY_SCENARIO_TO_V14_CONCEPT[clean]) return LEGACY_SCENARIO_TO_V14_CONCEPT[clean];
    const upper = clean.toUpperCase();
    if (/^(DZ|NZ|OM|OZ|ST)-\d{2}$/.test(upper) || upper.startsWith('DRILL-')) return upper;
    const low = clean.toLowerCase();
    if (low.includes('rush') || low.includes('2v1') || low.includes('3v2') || low.includes('delay')) return 'OM-01';
    if (low.includes('spacing') || low.includes('cycle') || low.includes('cutback') || low.includes('forecheck') || low.includes('oz')) return 'OZ-03';
    if (low.includes('power') || low.includes('penalty') || low.includes('pk') || low.includes('pp') || low.includes('special')) return 'ST-01';
    if (low.includes('regroup') || low.includes('offsides') || low.includes('transition') || low.includes('gap') || low.includes('nz')) return 'NZ-01';
    if (low.includes('goalie') || low.includes('screen') || low.includes('rebound')) return 'DZ-10';
    if (low.includes('house') || low.includes('boxout')) return 'DZ-03';
    return 'DZ-01';
  }

  resolveDrillsForFocus(focusStr = '', count = 5) {
    if (!this.catalog?.drills?.length) return [];
    const focusLower = String(focusStr || '').toLowerCase();
    let matching = this.catalog.drills.filter((d) => {
      if (focusLower.includes('rush') || focusLower.includes('2v1') || focusLower.includes('odd-man')) return d.zone === 'OM';
      if (focusLower.includes('power') || focusLower.includes('penalty') || focusLower.includes('special') || focusLower.includes('pp') || focusLower.includes('pk')) return d.zone === 'ST';
      if (focusLower.includes('forecheck') || focusLower.includes('o-zone') || focusLower.includes('spacing') || focusLower.includes('cycle') || focusLower.includes('cutback')) return d.zone === 'OZ';
      if (focusLower.includes('regroup') || focusLower.includes('offsides') || focusLower.includes('neutral') || focusLower.includes('scan') || focusLower.includes('gap')) return d.zone === 'NZ';
      if (focusLower.includes('d-zone') || focusLower.includes('house') || focusLower.includes('breakout') || focusLower.includes('goalie')) return d.zone === 'DZ';
      return d.zone === 'DZ' || d.zone === 'NZ';
    });
    if (matching.length < 3) matching = this.catalog.drills.slice(0, 6);
    const total = Math.max(1, Number(count || 5));
    return Array.from({ length: total }, (_, i) => matching[i % matching.length]);
  }

  activateInGameView() {
    if (!this.ready || !this.catalog) return;
    document.body.classList.add('v14-white-ice-active');
    this._enforceZeroCutoutOverlap();

    const guestSess = typeof window !== 'undefined' ? window.__synapzGuestDemoSession : null;
    const isGuest = Boolean(guestSess && guestSess.active);
    const exitBtn = document.getElementById('btnV14SaveExitLobby');
    const mapBtn = document.getElementById('btnV14OpenTourMap');
    const dailyBtn = document.getElementById('btnV14QuickDaily5');
    if (exitBtn) {
      exitBtn.textContent = isGuest ? '← Exit Free Shift' : '💾 Save & Exit to Lobby';
    }
    if (mapBtn) mapBtn.classList.toggle('hidden', isGuest);
    if (dailyBtn) dailyBtn.classList.toggle('hidden', isGuest);

    if (isGuest) {
      this.shiftMode = 'guest';
      const defaultGuestCodes = guestSess.tier === 'coach_preview'
        ? ['DZ-01']
        : (guestSess.tier === 'youth'
            ? ['DZ-01', 'OZ-03', 'OM-01']
            : (guestSess.tier === 'aaa'
                ? ['ST-01', 'NZ-06', 'DZ-07']
                : ['OM-01', 'NZ-01', 'NZ-03']));
      const requestedCodes = Array.isArray(guestSess.playIds) && guestSess.playIds.length
        ? guestSess.playIds.map(id => this.mapLegacyScenarioOrFocusToConcept(id))
        : defaultGuestCodes;
      // Keep guestSess.playIds synced to canonical v14 concept IDs (0 legacy spacing-1 / rush-1 IDs!)
      guestSess.playIds = requestedCodes;
      this.drillQueue = requestedCodes.map(code => this.getDrillById(code)).filter(Boolean);
      this.queueIdx = Math.min(this.drillQueue.length - 1, Math.max(0, Number(guestSess.playIndex || 0)));
      const drill = this.drillQueue[this.queueIdx] || this.catalog.drills[0];
      // Auto-open the 15s Honest/IHS YOU ARE Chalk-Talk Lesson Reel before Rep 1 of any unseen concept!
      this.presentDrill(drill, { forceSkipReel: false });
      this.refreshSkillRingsUI();
      return;
    }

    if (window.state && window.state.activeCoachInboxPlan) {
      this.shiftMode = 'coach_inbox';
      const plan = window.state.activeCoachInboxPlan;
      if (Array.isArray(plan.drillIds) && plan.drillIds.length > 0) {
        this.drillQueue = plan.drillIds.map(id => this.getDrillById(id)).filter(Boolean);
      } else {
        this.drillQueue = this.resolveDrillsForFocus(plan.focusConcept || 'breakout', Number(plan.lessonCount || 5));
      }
      this.queueIdx = 0;
      this.shiftRepsCompleted = 0;
      this.shiftGoldCount = 0;
      this.presentDrill(this.drillQueue[0], { forceSkipReel: false });
      this.refreshSkillRingsUI();
      return;
    }

    if (window.state && window.state.activePersonalCoachAlPlan) {
      this.shiftMode = 'personal_plan';
      const pPlan = window.state.activePersonalCoachAlPlan;
      const prof = this._getActiveProfile();
      if (prof && Array.isArray(prof.personalPlans)) {
        const found = prof.personalPlans.find(x => x && x.planId === pPlan.planId);
        if (found && found.status !== 'Completed') {
          found.status = 'In Progress';
          if (typeof window.saveProgress === 'function') window.saveProgress();
        }
      }
      if (Array.isArray(pPlan.drillIds) && pPlan.drillIds.length > 0) {
        this.drillQueue = pPlan.drillIds.map(id => this.getDrillById(id)).filter(Boolean);
      } else {
        this.drillQueue = this.resolveDrillsForFocus(pPlan.focusConcept || 'breakout', Number(pPlan.lessonCount || 5));
      }
      this.queueIdx = 0;
      this.shiftRepsCompleted = 0;
      this.shiftGoldCount = 0;
      this.presentDrill(this.drillQueue[0], { forceSkipReel: false });
      this.refreshSkillRingsUI();
      return;
    }

    if (window.state && window.state.customFocusShift) {
      this.shiftMode = 'custom_focus';
      const cf = window.state.customFocusShift;
      window.state.customFocusShift = null;
      this.drillQueue = this.resolveDrillsForFocus(cf.focus || 'breakout', Number(cf.lessonCount || 5));
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
    const mapped = LEGACY_SCENARIO_TO_V14_CONCEPT[clean] || clean;
    return (this.catalog?.drills || []).find(d => d.id === mapped || d.conceptId === mapped || d.id === clean || d.conceptId === clean) || this.catalog?.drills?.[0] || null;
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

    // Always keep #v14ActiveQuestionBanner visible & synced above both Chalk Reel and 9-Mode Ice!
    const qBanner = typeof document !== 'undefined' ? document.getElementById('v14ActiveQuestionBanner') : null;
    const qBannerText = typeof document !== 'undefined' ? document.getElementById('v14ActiveQuestionBannerText') : null;
    if (qBanner) qBanner.classList.remove('hidden');
    if (qBannerText) qBannerText.innerHTML = buildPlainKidQuestionHtml(drill);

    const modeMount = document.getElementById('v14ModeEngineMount');
    // Prime modeEngine with drill so activeDrill/modeEngine.drill are always ready
    this.modeEngine.loadDrill(drill, { autoDrop: false });
    if (shouldShowReel) {
      modeMount?.classList.add('hidden');
      this.chalkReel.open(drill, prof?.positionCode || drill.youRole);
    } else {
      this.chalkReel.close();
      modeMount?.classList.remove('hidden');
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
        prof.hockeyIQ = window.state.iqScore;
        prof.puckBucks = window.state.puckBucks;
        prof.drillsCompleted = Number(prof.drillsCompleted || 0) + 1;
        if (drill?.id) {
          if (!prof.completedIds || typeof prof.completedIds !== 'object') prof.completedIds = {};
          prof.completedIds[drill.id] = true;
        }
        if (isGold) {
          prof.bestStreak = Math.max(Number(prof.bestStreak || 0), this.liveStreak);
        }
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
        prof.hockeyIQ = window.state.iqScore;
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

    // Completed a 5-rep Daily / City / Coach's Inbox / Personal Plan Shift!
    if (this.shiftMode === 'personal_plan' && window.state?.activePersonalCoachAlPlan) {
      const pPlan = window.state.activePersonalCoachAlPlan;
      const pct = Math.round((this.shiftGoldCount / Math.max(1, this.drillQueue.length)) * 100);
      window.state.activePersonalCoachAlPlan = null;
      const prof = this._getActiveProfile();
      if (prof && Array.isArray(prof.personalPlans)) {
        const found = prof.personalPlans.find(x => x && x.planId === pPlan.planId);
        if (found) {
          found.status = 'Completed';
          found.scorePct = pct;
          found.completedAt = new Date().toISOString();
        }
      }
      if (typeof window.saveProgress === 'function') window.saveProgress();
    }

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

    // Completed a 5-rep NHL City Tour Shift -> advance city stop & award +50 Tour Bonus Puck Bucks!
    if (this.shiftMode === 'city' && typeof window !== 'undefined' && window.state) {
      const prof = this._getActiveProfile();
      const nextCity = Math.min(31, Number(window.state.currentCityIdx || 0) + 1);
      window.state.currentCityIdx = nextCity;
      window.state.puckBucks = Number(window.state.puckBucks || prof?.puckBucks || 0) + 50;
      if (prof) {
        const conqueredCity = ((typeof window !== 'undefined' && window.NHL_CITIES) || [])[window.state.currentCityIdx || 0];
        if (!Array.isArray(prof.unlockedCityPatches)) prof.unlockedCityPatches = [];
        if (conqueredCity && conqueredCity.id && !prof.unlockedCityPatches.includes(conqueredCity.id)) {
          prof.unlockedCityPatches.push(conqueredCity.id);
        }
        prof.currentCityIdx = nextCity;
        prof.unlockedCityIdx = Math.max(Number(prof.unlockedCityIdx || 0), nextCity);
        prof.puckBucks = window.state.puckBucks;
      }
      if (typeof window.saveProgress === 'function') window.saveProgress();
      if (typeof window.updateHeaderStats === 'function') window.updateHeaderStats();
    }

    if (this.drillQueue.length >= 5 && !this.blooket.isOpen) {
      this.blooket.launch({
        reason: '🏆 5-Rep Shift Complete Bonus!',
        baseBucks: 50
      });
    }

    if (this.shiftMode === 'city') {
      this.startCityShift(window.state?.currentCityIdx || 0);
      return;
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
    TeamShowdownController,
    SynapzSkaterRenderer360,
    renderCustomizableSkater,
    buildCustomizableSkaterSvg,
    buildMiniSkaterHeadSvg,
    SynapzGearArt7525,
    renderGearCategoryIconSvg,
    renderGearItemArtSvg,
    getOwnedLockerBagItems,
    SynapzNhlAtlasMap,
    renderNhlAtlasMap,
    NHL_ATLAS_CITIES,
    SynapzTrophyCase3Shelf,
    renderTrophyCase3Shelf,
    evaluateTrophyCaseProgress
  };
  if (typeof window.syncV151VisualModulesOnReady === 'function') {
    try { window.syncV151VisualModulesOnReady(); } catch (_) {}
  }
  synapzV14.init().catch((err) => {
    console.error('[SYNAPZ v14.0] Bootstrap initialization error:', err);
  });
}
