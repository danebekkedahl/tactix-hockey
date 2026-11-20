/**
 * SYNAPZ HOCKEY v15.3 — Master ES-Module Teaching, Tunnel-Vision Rink HUD & 9-Mode Engine Bootstrap
 * (`engine/v14_bootstrap.js`)
 *
 * Mounts inside V1's `#gameViewSection` while preserving 100% of v15.0–v15.2 meta-world,
 * iPadOS 15.8.8 Safari-15 Universal Compatibility, Dynamic `YOU ARE` Role Sync,
 * 5 HD Arena rooms, Live 360° Customizable Skaters, 75/25 Gear Art + Owned-Only Bag & Pro Shop,
 * Real North America 32-City NHL Atlas Map, 3-Shelf Walnut & Glass Trophy Case, Offline Outbox,
 * and 3-Role Portals (`Player`, `Coach`, `Camp`, `Association`).
 */

import { RINK_SPEC, WhiteIceRink1000x500, normalizeDrillLineup } from './rink_1000x500.js';
import { CANONICAL_9_MODES, validateDrillSchema, validateDrillCatalog } from './validate_drills.js';
import { ChalkTalkReelController } from './chalk_reel.js';
import { Subconscious9ModeEngine, MODE_LABELS, buildPlainKidQuestionHtml, ensureSafeDrillForEngine } from './modes_9pack.js';
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
    this.shiftMode = 'city'; // 'city' | 'daily5' | 'guest' | 'coach_inbox' | 'personal_plan' | 'head_coach_preview' | 'single'
    this.returnContext = 'lobby'; // 'lobby' | 'screen1_guest' | 'player_coach_inbox' | 'head_coach_whiteboard' | 'head_coach_preview_5_plays' | 'hit_the_ice_hub'
    this.activeSession = {
      youAreRole: 'C',
      drillId: null,
      conceptId: null
    };
    this.liveStreak = 0;
    this.shiftRepsCompleted = 0;
    this.shiftGoldCount = 0;
    this.untimed = false;
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
        console.warn('[SYNAPZ v15.2] Catalog validation warnings:', check);
      }
      this._mountEngineDom();
      this.ready = true;
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

  _silenceAllSpeechNow(reason = 'silent_drill_exit') {
    try {
      if (typeof window !== 'undefined' && typeof window.cancelSynapzSpeechExplicit === 'function') {
        window.cancelSynapzSpeechExplicit(reason);
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (typeof document !== 'undefined') {
        document.getElementById('synapzMuteSafeCaptionRibbon')?.classList.add('hidden');
        document.getElementById('synapzUniversalCharSpeechOverlay')?.classList.add('hidden');
      }
    } catch (_) {}
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

  _isAudioMuted() {
    if (typeof window === 'undefined') return false;
    const stMuted = window.state && window.state.voiceReadAloud === false;
    const sfxMuted = window.SoundFX && window.SoundFX.muted === true;
    return Boolean(stMuted || sfxMuted);
  }

  _syncTunnelAudioBtn() {
    const btn = typeof document !== 'undefined' ? document.getElementById('btnV14TunnelAudioToggle') : null;
    if (!btn) return;
    const muted = this._isAudioMuted();
    btn.textContent = muted ? '🔇 Muted' : '🔊 Audio';
    btn.setAttribute('aria-label', muted ? 'Unmute rink audio and voiceover' : 'Mute rink audio and voiceover');
    btn.className = muted
      ? 'min-h-[36px] px-3 py-1 rounded-full bg-slate-900 border border-rose-400/70 text-rose-300 text-xs font-black transition cursor-pointer shrink-0'
      : 'min-h-[36px] px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-teal-300 text-xs font-black transition cursor-pointer shrink-0';
  }

  _toggleTunnelAudio() {
    if (typeof window === 'undefined') return;
    const nextMuted = !this._isAudioMuted();
    if (window.state) {
      window.state.voiceReadAloud = !nextMuted;
    }
    if (window.SoundFX) {
      window.SoundFX.muted = nextMuted;
    }
    if (nextMuted) {
      this._silenceAllSpeechNow('user_mute_toggle');
    }
    this._syncTunnelAudioBtn();
  }

  _syncTunnelHudYouAre(roleCode = 'C') {
    const cleanRole = String(roleCode || 'C').trim().toUpperCase() || 'C';
    this.activeSession.youAreRole = cleanRole;
    if (typeof window !== 'undefined' && window.state) {
      window.state.activeYouAreRole = cleanRole;
    }
    const el = typeof document !== 'undefined' ? document.getElementById('v14TunnelYouAreBadge') : null;
    if (el) {
      el.textContent = `YOU ARE: ${cleanRole}`;
    }
  }

  setYouAreRole(roleCode = 'C') {
    this._syncTunnelHudYouAre(roleCode);
  }

  _syncTunnelHudUntimed(untimedVal = this.untimed) {
    this.untimed = Boolean(untimedVal);
    const btn = typeof document !== 'undefined' ? document.getElementById('btnV14TunnelUntimed') : null;
    if (!btn) return;
    btn.textContent = this.untimed ? '🧘 Untimed' : '⏱️ Timed';
    btn.className = this.untimed
      ? 'min-h-[34px] px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 border border-amber-200 text-[11px] font-black transition cursor-pointer shrink-0'
      : 'min-h-[34px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-black transition cursor-pointer shrink-0';
  }

  _syncTunnelHudProgressBadge() {
    const badge = typeof document !== 'undefined' ? document.getElementById('v14TunnelProgressBadge') : null;
    if (!badge) return;
    const guestSess = typeof window !== 'undefined' ? window.__synapzGuestDemoSession : null;
    if (guestSess && guestSess.active) {
      const total = Math.max(1, (guestSess.playIds && guestSess.playIds.length) || this.drillQueue.length || 3);
      const cur = Math.min(total, Math.max(1, Number(guestSess.playIndex || this.queueIdx || 0) + 1));
      badge.textContent = `Free Play ${cur} of ${total}`;
      return;
    }
    const total = Math.max(1, this.drillQueue.length || 5);
    const cur = Math.min(total, Math.max(1, this.queueIdx + 1));
    if (this.shiftMode === 'head_coach_preview') {
      badge.textContent = `Preview ${cur} of ${total}`;
    } else if (total === 1) {
      badge.textContent = `Play 1 of 1`;
    } else {
      badge.textContent = `Play ${cur} of ${total}`;
    }
  }

  _mountEngineDom() {
    if (typeof document === 'undefined') return;
    const gameSec = document.getElementById('gameViewSection');
    const rinkWrapper = document.getElementById('rinkWrapper');
    if (!gameSec || !rinkWrapper) return;

    // Strict v15.2 Tunnel-Vision CSS: hides 100% of legacy V1 DOM, bottom 5-zone strip, & non-drill nav pills
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
        body.v14-white-ice-active #v14RinkFooterBar,
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
          height: 100% !important;
          min-height: 0 !important;
        }
        body.v14-white-ice-active #v14TeachingEngineRoot {
          flex: 1 1 0% !important;
          min-height: 0 !important;
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
        }
        body.v14-white-ice-active #v14ChalkReelMount:not(.hidden),
        body.v14-white-ice-active #v14ModeEngineMount:not(.hidden) {
          flex: 1 1 0% !important;
          min-height: 0 !important;
          display: flex !important;
          flex-direction: column !important;
        }
      `;
      document.head.appendChild(style);
    }

    let root = document.getElementById('v14TeachingEngineRoot');
    if (!root) {
      root = document.createElement('div');
      root.id = 'v14TeachingEngineRoot';
      root.className = 'w-full h-full flex flex-col gap-1.5';
      root.innerHTML = `
        <!-- Pure Tunnel-Vision Top On-Ice HUD: Left (<- Exit + Progress) • Center (>=16px Question + YOU ARE + Untimed) • Right (Audio + Unobstructed Red Flag) -->
        <div id="v14TunnelVisionHudBar" class="w-full rounded-2xl px-2.5 pr-28 py-1.5 bg-gradient-to-r from-slate-950 via-[#0C1322] to-slate-950 border-2 border-amber-400/85 shadow-lg flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 shrink-0">
          <!-- Top-Left: <- Exit + Compact Progress Badge -->
          <div class="flex items-center gap-1.5 shrink-0">
            <button id="btnV14TunnelExit" type="button" class="min-h-[36px] px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-600 text-white font-black text-xs transition cursor-pointer flex items-center gap-1">
              ← Exit
            </button>
            <span id="v14TunnelProgressBadge" class="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/60 text-cyan-200 text-[11px] font-black whitespace-nowrap">
              Play 1 of 5
            </span>
          </div>

          <!-- Top-Center: Persistent High-Contrast >=16px Question / Read Prompt Banner + YOU ARE + Untimed -->
          <div id="v14ActiveQuestionBanner" class="flex-1 min-w-[200px] flex flex-wrap items-center justify-center gap-2 px-1">
            <div id="v14ActiveQuestionBannerText" style="font-size: 16px; line-height: 1.28;" class="text-base font-black text-white text-center lg:text-left flex-1 min-w-[180px]"></div>
            <div class="flex items-center gap-1.5 shrink-0">
              <span id="v14TunnelYouAreBadge" class="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400 text-amber-200 text-[11px] font-black whitespace-nowrap">
                YOU ARE: C
              </span>
              <button id="btnV14TunnelUntimed" type="button" class="min-h-[34px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-black transition cursor-pointer shrink-0">
                ⏱️ Timed
              </button>
            </div>
          </div>

          <!-- Top-Right: Audio Toggle (sits cleanly beside fixed 🚩 Red Flag button) -->
          <div class="flex items-center gap-1.5 shrink-0">
            <button id="btnV14TunnelAudioToggle" type="button" class="min-h-[36px] px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-teal-300 text-xs font-black transition cursor-pointer shrink-0">
              🔊 Audio
            </button>
          </div>
        </div>

        <div id="v14ChalkReelMount" class="hidden w-full flex-1 min-h-0"></div>
        <div id="v14ModeEngineMount" class="w-full flex-1 min-h-0"></div>

        <!-- Hidden DOM sink preserving 5-Zone Ring nodes for automated ring telemetry while NEVER visible during active rink -->
        <div id="v14RinkFooterBar" class="hidden" aria-hidden="true">
          <div id="v14RinkSkillRingsBar"></div>
          <button id="btnV14OpenTourMap" type="button" class="hidden"></button>
          <button id="btnV14QuickDaily5" type="button" class="hidden"></button>
          <button id="btnV14SaveExitLobby" type="button" class="hidden"></button>
        </div>
        <div id="v14BlooketMount" class="hidden"></div>
      `;
      rinkWrapper.parentElement.insertBefore(root, rinkWrapper);
    }

    // Mount Pre-Drill "Hit the Ice" Catalog & Daily 5 Hub Drawer at body root (outside #gameViewSection!)
    let catalogMount = document.getElementById('v14CatalogDrawerMount');
    if (!catalogMount) {
      catalogMount = document.createElement('div');
      catalogMount.id = 'v14CatalogDrawerMount';
      catalogMount.className = 'hidden';
      document.body.appendChild(catalogMount);
    } else if (catalogMount.parentElement !== document.body) {
      document.body.appendChild(catalogMount);
    }

    root.querySelector('#btnV14TunnelExit')?.addEventListener('click', () => {
      this.exitActiveDrillSilently();
    });
    root.querySelector('#btnV14SaveExitLobby')?.addEventListener('click', () => {
      this.exitActiveDrillSilently();
    });

    root.querySelector('#btnV14TunnelUntimed')?.addEventListener('click', () => {
      const next = !this.untimed;
      this._syncTunnelHudUntimed(next);
      this.chalkReel?.setUntimed(next, false);
      this.modeEngine?.setUntimed(next, false);
    });

    root.querySelector('#btnV14TunnelAudioToggle')?.addEventListener('click', () => {
      this._toggleTunnelAudio();
    });

    this.chalkReel = new ChalkTalkReelController({
      mountEl: root.querySelector('#v14ChalkReelMount'),
      getFederationMode: () => this._getFederationMode(),
      onRoleChange: (pos) => {
        this._syncTunnelHudYouAre(pos);
      },
      onUntimedChange: (val) => {
        this._syncTunnelHudUntimed(val);
        this.modeEngine?.setUntimed(val, false);
      },
      onWatchedConcept: (conceptId) => {
        const prof = this._getActiveProfile();
        markConceptReelWatched(prof, conceptId);
        if (typeof window.saveProgress === 'function') window.saveProgress();
        this.refreshSkillRingsUI();
      },
      onComplete: (drill, _selectedRole, opts = {}) => {
        // Unbroken DROP PUCK handoff: immediately drop puck into 60fps live motion on the 1000x500 white ice!
        root.querySelector('#v14ModeEngineMount')?.classList.remove('hidden');
        const nextUntimed = typeof opts.untimed === 'boolean' ? opts.untimed : this.untimed;
        const protagonistRole = drill?.primaryRole || drill?.youRole || 'C';
        this._syncTunnelHudUntimed(nextUntimed);
        this._syncTunnelHudYouAre(protagonistRole);
        this.modeEngine.loadDrill(drill, { autoDrop: true, untimed: nextUntimed });
      }
    });

    this.modeEngine = new Subconscious9ModeEngine({
      mountEl: root.querySelector('#v14ModeEngineMount'),
      getFederationMode: () => this._getFederationMode(),
      onRoleSync: (role) => {
        this._syncTunnelHudYouAre(role);
      },
      onUntimedChange: (val) => {
        this._syncTunnelHudUntimed(val);
        this.chalkReel?.setUntimed(val, false);
      },
      onOpenChalkReel: (drill) => {
        root.querySelector('#v14ModeEngineMount')?.classList.add('hidden');
        const protagonistRole = drill?.primaryRole || drill?.youRole || 'C';
        this._syncTunnelHudYouAre(protagonistRole);
        this.chalkReel.open(drill, protagonistRole, { untimed: this.untimed });
      },
      onOpenCatalog: () => {
        this.openHitTheIceHub();
      },
      onRepEvaluated: (outcome) => this._handleRepEvaluated(outcome),
      onNextRep: () => this.advanceNextRep()
    });

    this.blooket = new BlooketPayoffController({
      mountEl: root.querySelector('#v14BlooketMount'),
      onRewardCredited: (loot) => this._creditBlooketLootToProfile(loot)
    });

    this.catalogDrawer = new DrillCatalogDrawerController({
      mountEl: catalogMount,
      catalog: this.catalog,
      getProfile: () => this._getActiveProfile(),
      onSelectDrill: (drill) => {
        this.returnContext = 'hit_the_ice_hub';
        this.shiftMode = 'single';
        this.drillQueue = [drill];
        this.queueIdx = 0;
        if (typeof window !== 'undefined' && window.state && window.state.view !== 'game' && typeof window.switchView === 'function') {
          window.__synapzSkipAutoActivateOnce = true;
          window.switchView('game');
        }
        document.body.classList.add('v14-white-ice-active');
        this.presentDrill(drill, { forceChalkReel: false });
      },
      onLaunchDaily5: () => {
        this.returnContext = 'hit_the_ice_hub';
        if (typeof window !== 'undefined' && window.state && window.state.view !== 'game' && typeof window.switchView === 'function') {
          window.__synapzSkipAutoActivateOnce = true;
          window.switchView('game');
        }
        document.body.classList.add('v14-white-ice-active');
        this.startDaily5Shift();
      },
      onImportDrills: (newDrills) => {
        for (const d of newDrills) {
          const idx = this.catalog.drills.findIndex(x => x.id === d.id);
          if (idx >= 0) this.catalog.drills[idx] = d;
          else this.catalog.drills.push(d);
        }
      }
    });

    // Global 4-Digit Live Team Showdown PIN Mount (accessible from Coach's Office Binder, Clubhouse Center TV & Try 3 Plays Free!)
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
            prof.hockeyIQ = window.state.iqScore;
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

  openHitTheIceHub() {
    if (!this.catalogDrawer) return;
    this.catalogDrawer.open();
  }

  openHostShowdown() {
    if (!this.showdown) return;
    this.showdown.openHostSetup();
  }

  openJoinShowdown(pin = '') {
    if (!this.showdown) return;
    this.showdown.openJoinModal(pin);
  }

  /**
   * Context-Aware Silent `← Exit` Return (Slice 3.2):
   * Returns cleanly to the exact screen that launched the active drill with ZERO automatic TTS voiceovers.
   */
  exitActiveDrillSilently() {
    this._silenceAllSpeechNow('silent_drill_exit');
    if (this.chalkReel) this.chalkReel.close();
    if (this.modeEngine) this.modeEngine.stopLoop();
    if (this.blooket && this.blooket.isOpen) this.blooket.close();

    const origin = (typeof window !== 'undefined' && window.__synapzDrillReturnContext) || this.returnContext || 'lobby';
    if (typeof window !== 'undefined') {
      window.__synapzDrillReturnContext = null;
      window.__synapzSuppressNextAutoVoice = true;
    }

    try {
      // 1. Screen 1 Guest Shift (`⚡ Try 3 Plays Free`)
      const guestSess = typeof window !== 'undefined' ? window.__synapzGuestDemoSession : null;
      if ((guestSess && guestSess.active) || origin === 'screen1_guest') {
        document.body.classList.remove('v14-white-ice-active');
        if (typeof window !== 'undefined' && typeof window.exitSynapzGuestDemoToScreen1 === 'function') {
          window.exitSynapzGuestDemoToScreen1();
        }
        this._silenceAllSpeechNow('silent_guest_return');
        return;
      }

      // 2. Head Coach's Office — `👁️ Preview All 5 Plays` Drawer or Wall Whiteboard
      if (origin === 'head_coach_preview_5_plays' || origin === 'head_coach_whiteboard') {
        document.body.classList.remove('v14-white-ice-active', 'in-game-clean-mode');
        if (typeof window !== 'undefined' && window.state) {
          window.state.view = 'lobby';
          window.state.activeHeadCoachStation = 'whiteboard';
        }
        document.getElementById('gameViewSection')?.classList.add('hidden');
        document.getElementById('synapzCoachOfficeModal')?.classList.remove('hidden');
        document.getElementById('coachOfficeOverlaySheet')?.classList.remove('hidden');
        if (typeof window !== 'undefined' && typeof window.renderSynapzCoachOfficeModal === 'function') {
          window.renderSynapzCoachOfficeModal();
        }
        if (
          (origin === 'head_coach_preview_5_plays' || (typeof window !== 'undefined' && window.state?.coachPreviewAll5Context?.reopenOnExit)) &&
          typeof window !== 'undefined' &&
          typeof window.restoreCoachPreviewAll5PlaysDrawer === 'function'
        ) {
          window.restoreCoachPreviewAll5PlaysDrawer();
        }
        this._silenceAllSpeechNow('silent_head_coach_return');
        return;
      }

      // 3. Player's Coach's Office — Desk Computer (`My Lesson Inbox`)
      if (origin === 'player_coach_inbox') {
        document.body.classList.remove('v14-white-ice-active');
        if (typeof window !== 'undefined' && window.state) {
          window.state.activeCoachInboxPlan = null;
          window.state.activePersonalCoachAlPlan = null;
          window.state.activePlayerOfficeStation = 'computer';
        }
        if (typeof window !== 'undefined' && typeof window.switchView === 'function') {
          window.switchView('lobby');
        }
        document.getElementById('synapzCoachOfficeModal')?.classList.remove('hidden');
        document.getElementById('coachOfficeOverlaySheet')?.classList.remove('hidden');
        if (typeof window !== 'undefined' && typeof window.renderSynapzCoachOfficeModal === 'function') {
          window.renderSynapzCoachOfficeModal();
        }
        if (typeof window !== 'undefined' && window.SynapzCharacterSpeechEngine) {
          window.SynapzCharacterSpeechEngine.minimizeToCircle('coach-al');
        }
        this._silenceAllSpeechNow('silent_inbox_return');
        return;
      }

      // 4. Pre-Drill Hit the Ice Hub Drawer (`Catalog / Daily 5`)
      if (origin === 'hit_the_ice_hub') {
        document.body.classList.remove('v14-white-ice-active');
        if (typeof window !== 'undefined' && typeof window.switchView === 'function') {
          window.switchView('lobby');
        }
        if (typeof window !== 'undefined' && window.SynapzCharacterSpeechEngine) {
          window.SynapzCharacterSpeechEngine.minimizeToCircle('active-agent');
        }
        this.openHitTheIceHub();
        this._silenceAllSpeechNow('silent_hub_return');
        return;
      }

      // 5. Default Main Rink Lobby
      document.body.classList.remove('v14-white-ice-active');
      if (typeof window !== 'undefined' && typeof window.switchView === 'function') {
        window.switchView('lobby');
      }
      if (typeof window !== 'undefined' && window.SynapzCharacterSpeechEngine) {
        window.SynapzCharacterSpeechEngine.minimizeToCircle('active-agent');
      }
      this._silenceAllSpeechNow('silent_lobby_return');
    } finally {
      if (typeof window !== 'undefined') {
        setTimeout(() => { window.__synapzSuppressNextAutoVoice = false; }, 60);
      }
    }
  }

  launchCoachWhiteboardPreviewDrills(drillIds = [], startIdx = 0, opts = {}) {
    if (!this.ready || !this.catalog) return false;
    this._silenceAllSpeechNow('coach_preview_launch');
    const launchMode = opts && opts.mode === 'reel' ? 'reel' : 'live';
    const resolved = (Array.isArray(drillIds) ? drillIds : [])
      .map(id => this.getDrillById(id))
      .filter(Boolean);
    const queue = resolved.length > 0 ? resolved : this.catalog.drills.slice(0, 5);
    this.shiftMode = 'head_coach_preview';
    this.returnContext = 'head_coach_preview_5_plays';
    if (typeof window !== 'undefined') {
      window.__synapzDrillReturnContext = 'head_coach_preview_5_plays';
      window.__synapzSkipAutoActivateOnce = true;
    }
    this.drillQueue = queue;
    this.queueIdx = Math.max(0, Math.min(queue.length - 1, Number(startIdx) || 0));
    this.shiftRepsCompleted = 0;
    this.shiftGoldCount = 0;

    document.getElementById('v14CoachPreviewAll5Drawer')?.classList.add('hidden');
    document.getElementById('coachOfficeOverlaySheet')?.classList.add('hidden');
    document.getElementById('synapzCoachOfficeModal')?.classList.add('hidden');

    if (typeof window !== 'undefined' && typeof window.switchView === 'function') {
      window.switchView('game');
    }
    document.body.classList.add('v14-white-ice-active');
    const targetDrill = this.drillQueue[this.queueIdx];
    if (launchMode === 'reel') {
      this.presentDrill(targetDrill, { forceChalkReel: true });
    } else {
      this.presentDrill(targetDrill, { forceSkipReel: true });
      if (this.modeEngine) {
        this.modeEngine.dropPuck({ force: true });
      }
    }
    this.refreshSkillRingsUI();
    return true;
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
      if (focusLower.includes('regroup') || focusLower.includes('offsides') || focusLower.includes('neutral') || focusLower.includes('scan') || focusLower.includes('gap') || focusLower.includes('breakout')) return d.zone === 'NZ' || d.conceptId === 'DZ-01';
      if (focusLower.includes('d-zone') || focusLower.includes('house') || focusLower.includes('goalie')) return d.zone === 'DZ';
      return d.zone === 'DZ' || d.zone === 'NZ';
    });
    if (matching.length < 3) matching = this.catalog.drills.slice(0, 6);
    const total = Math.max(1, Number(count || 5));
    return Array.from({ length: total }, (_, i) => matching[i % matching.length]);
  }

  activateInGameView() {
    if (!this.ready || !this.catalog) return;
    if (typeof window !== 'undefined' && window.__synapzSkipAutoActivateOnce) {
      window.__synapzSkipAutoActivateOnce = false;
      document.body.classList.add('v14-white-ice-active');
      this._enforceZeroCutoutOverlap();
      this._syncTunnelAudioBtn();
      return;
    }

    document.body.classList.add('v14-white-ice-active');
    this._enforceZeroCutoutOverlap();
    this._syncTunnelAudioBtn();
    this.catalogDrawer?.close();

    const guestSess = typeof window !== 'undefined' ? window.__synapzGuestDemoSession : null;
    const isGuest = Boolean(guestSess && guestSess.active);

    if (isGuest) {
      this.shiftMode = 'guest';
      this.returnContext = 'screen1_guest';
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
      guestSess.playIds = requestedCodes;
      this.drillQueue = requestedCodes.map(code => this.getDrillById(code)).filter(Boolean);
      this.queueIdx = Math.min(this.drillQueue.length - 1, Math.max(0, Number(guestSess.playIndex || 0)));
      const drill = this.drillQueue[this.queueIdx] || this.catalog.drills[0];
      this.presentDrill(drill, { forceSkipReel: false });
      this.refreshSkillRingsUI();
      return;
    }

    if (window.state && window.state.activeCoachInboxPlan) {
      this.shiftMode = 'coach_inbox';
      this.returnContext = window.__synapzDrillReturnContext || 'player_coach_inbox';
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
      this.returnContext = window.__synapzDrillReturnContext || 'player_coach_inbox';
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
      this.returnContext = window.__synapzDrillReturnContext || 'lobby';
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

    this.returnContext = (typeof window !== 'undefined' && window.__synapzDrillReturnContext) || 'lobby';
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
      this.modeEngine.dropPuck({ force: true });
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

  presentDrill(drillRaw, { forceChalkReel = false, forceSkipReel = false, forceSkipChalkReel = false } = {}) {
    if (typeof drillRaw === 'string') {
      drillRaw = this.getDrillById(drillRaw);
    }
    if (!drillRaw) return;
    const skipReelFlag = Boolean(forceSkipReel || forceSkipChalkReel);
    const drill = normalizeDrillLineup(drillRaw);
    const protagonistRole = drill.primaryRole || drill.youRole || 'C';
    drill.primaryRole = protagonistRole;
    drill.youRole = protagonistRole;
    this.activeDrill = drill;
    this.activeSession.drillId = drill.id || null;
    this.activeSession.conceptId = drill.conceptId || null;
    this._syncTunnelHudYouAre(protagonistRole);
    this._enforceZeroCutoutOverlap();
    this._syncTunnelAudioBtn();
    this._syncTunnelHudProgressBadge();

    const prof = this._getActiveProfile();
    const cStatus = getConceptStatus(prof, drill.conceptId);
    const shouldShowReel = forceChalkReel || (!skipReelFlag && cStatus.state === 'unwatched');

    const qBanner = typeof document !== 'undefined' ? document.getElementById('v14ActiveQuestionBanner') : null;
    const qBannerText = typeof document !== 'undefined' ? document.getElementById('v14ActiveQuestionBannerText') : null;
    if (qBanner) qBanner.classList.remove('hidden');
    if (qBannerText) qBannerText.innerHTML = buildPlainKidQuestionHtml(drill);

    const modeMount = document.getElementById('v14ModeEngineMount');
    this.modeEngine.loadDrill(drill, { autoDrop: false, untimed: this.untimed });
    if (shouldShowReel) {
      modeMount?.classList.add('hidden');
      this._syncTunnelHudYouAre(protagonistRole);
      this.chalkReel.open(drill, protagonistRole, { untimed: this.untimed });
    } else {
      this.chalkReel.close();
      modeMount?.classList.remove('hidden');
      this._syncTunnelHudYouAre(protagonistRole);
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

    // Head Coach Whiteboard Preview does not mutate player profile stats
    if (this.shiftMode === 'head_coach_preview') {
      return;
    }

    // Guest Funnel (`⚡ Try 3 Plays Free`) Compatibility
    const guestSess = typeof window !== 'undefined' ? window.__synapzGuestDemoSession : null;
    if (guestSess && guestSess.active && typeof window.handleGuestDemoPlayResolved === 'function') {
      window.handleGuestDemoPlayResolved({ isCorrect: isGold, mult: isGold ? 1.0 : 0 });
      return;
    }

    // Update 45-Concept Mastery & Profile IQ / Puck Bucks cleanly on fresh or active profile
    if (prof && drill?.conceptId) {
      recordConceptRepResult(prof, drill.conceptId, isGold);
    }
    if (typeof window !== 'undefined' && window.state) {
      if (typeof window.recordAdaptivePlayOutcome === 'function' && prof && window.SCENARIOS?.[0]) {
        try {
          window.recordAdaptivePlayOutcome(prof, window.SCENARIOS[0], isGold, isGold ? 1.0 : 0);
        } catch (_) {}
      }
      window.state.iqScore = Math.max(0, Number(window.state.iqScore || prof?.iqScore || 0) + earnedIq);
      window.state.puckBucks = Math.max(0, Number(window.state.puckBucks || prof?.puckBucks || 0) + earnedBucks);
      if (drill?.id) {
        if (!window.state.completedIds || typeof window.state.completedIds !== 'object') {
          window.state.completedIds = {};
        }
        window.state.completedIds[drill.id] = true;
      }
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
          window.state.bestStreak = Math.max(Number(window.state.bestStreak || 0), prof.bestStreak);
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

    if (this.shiftMode === 'head_coach_preview') {
      this.exitActiveDrillSilently();
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
      if (this.returnContext === 'player_coach_inbox') {
        this.exitActiveDrillSilently();
        return;
      }
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
      if (this.returnContext === 'player_coach_inbox') {
        this.exitActiveDrillSilently();
        return;
      }
    }

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
  window.activeSession = synapzV14.activeSession;
  window.openSynapzHostShowdown = () => synapzV14.openHostShowdown();
  window.openSynapzJoinShowdown = (pin = '') => synapzV14.openJoinShowdown(pin);
  window.openSynapzHitTheIceHub = () => synapzV14.openHitTheIceHub();
  window.SynapzV14Modules = {
    RINK_SPEC,
    WhiteIceRink1000x500,
    normalizeDrillLineup,
    ensureSafeDrillForEngine,
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
    console.error('[SYNAPZ v15.2] Bootstrap initialization error:', err);
  });
}
