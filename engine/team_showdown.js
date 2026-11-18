/**
 * SYNAPZ HOCKEY v14.1 — 4-Digit Blooket Live Team Showdown PIN Mode
 * (`engine/team_showdown.js`)
 *
 * Features:
 *  1) Host Flow (`⚡ Host Team Showdown` in Coach's Office, Ice Rink Header & Clubhouse):
 *     - Topic Packs (`All-Ice Mix`, `Breakouts & D-Zone`, `2v1 & Odd-Man Rushes`,
 *       `O-Zone & Forecheck`, `Special Teams & Clutch IQ`) + Timer (`2 Min` | `3 Min` | `5 Min`).
 *     - Generates a giant high-contrast 4-Digit Showdown PIN (e.g. `7419`).
 *     - Syncs live room state via Supabase `public.pucksense_agent_inbox` (`showdown_room_XXXX`)
 *       with automatic 20-minute TTL cleanup + smooth 1.5s polling + BroadcastChannel sync +
 *       instant steel-roof arena offline bot-sparring fallback.
 *  2) Player Join Flow (`🎮 Join Showdown PIN` in Ice Rink, Clubhouse & `Try 3 Plays Free` Modal):
 *     - 4-Digit PIN + First Name + Jersey # + Age Band (`8U–10U`, `12U–14U`, `16U+`) + 3D Avatar.
 *     - Pre-filled from logged-in Player stall; zero email/password required for hotel-lobby guests.
 *     - Warmup Lobby displays 3D Avatars & Jersey Badges until Host taps `🚨 DROP PUCK — START SHOWDOWN!`.
 *  3) Fair Cross-Age Blooket Gameplay & Broadcast Three Stars Podium:
 *     - Rapid-fire mixed-mode 1000×500 white-ice reads calibrated to each player's Age Band.
 *     - Every 3-Gold streak launches Breakaway Snipe + Shaking Bag Power-Up (`2x Shift Multiplier`,
 *       `Clutch OT Bonus`, `Goalie Brick Wall` — 100% positive boosts, 0 stealing/griefing, 0 text chat).
 *     - Broadcast `🏆 Three Stars of the Game Podium` crediting Puck Bucks & 5-Zone Skill Ring progress
 *       to logged-in profiles while keeping guest sessions 100% Clean-Slate ephemeral.
 */

import { WhiteIceRink1000x500, samplePolylineAt } from './rink_1000x500.js';
import { recordConceptRepResult } from './blooket_payoff.js';

const SB_URL_DEFAULT = 'https://jrusjgpfcnptozfehcrv.supabase.co';
const SB_ANON_KEY_DEFAULT = 'sb_publishable_73207-0o-_PJEGLgeiZSog__PwUgTxX';
const ROOM_TTL_MS = 20 * 60 * 1000; // 20-minute automatic TTL cleanup
const POLL_INTERVAL_MS = 1500;

export const SHOWDOWN_TOPIC_PACKS = [
  { id: 'all_ice', label: '🏒 All-Ice Mix (45 Concepts)', zones: ['DZ', 'NZ', 'OM', 'OZ', 'ST'] },
  { id: 'dz_nz', label: '🛡️ Breakouts & D-Zone', zones: ['DZ', 'NZ'] },
  { id: 'rush', label: '🚀 2v1 & Odd-Man Rushes', zones: ['OM', 'NZ'] },
  { id: 'ozone', label: '🎯 O-Zone & Forecheck', zones: ['OZ'] },
  { id: 'special', label: '🔥 Special Teams & Clutch IQ', zones: ['ST', 'DZ', 'OZ'] }
];

export const SHOWDOWN_TIMERS = [
  { sec: 120, label: '2 Min' },
  { sec: 180, label: '3 Min' },
  { sec: 300, label: '5 Min' }
];

export const SHOWDOWN_AGE_BANDS = [
  { id: '8U-10U', label: '🧊 8U–10U (Mite / Squirt)', tiers: ['8U', '10U'] },
  { id: '12U-14U', label: '🏒 12U–14U (Peewee / Bantam)', tiers: ['12U', '14U'] },
  { id: '16U+', label: '🔥 16U+ (Midget / Jr / Varsity)', tiers: ['14U', '16U'] }
];

export const SHOWDOWN_AVATARS = [
  { id: 'avatar-male-1', img: 'assets/avatars/avatar-male-1.png', label: 'Skater 1' },
  { id: 'avatar-female-1', img: 'assets/avatars/avatar-female-1.png', label: 'Skater 2' },
  { id: 'avatar-male-2', img: 'assets/avatars/avatar-male-2.png', label: 'Skater 3' },
  { id: 'avatar-female-2', img: 'assets/avatars/avatar-female-2.png', label: 'Skater 4' },
  { id: 'avatar-male-3', img: 'assets/avatars/avatar-male-3.png', label: 'Skater 5' },
  { id: 'avatar-female-3', img: 'assets/avatars/avatar-female-3.png', label: 'Skater 6' }
];

export const POSITIVE_POWERUPS = [
  {
    id: 'mult_2x',
    title: '⚡ 2x Shift Multiplier',
    desc: 'Next 2 clean hockey reads score DOUBLE Showdown Points!',
    instantPts: 40,
    bonusBucks: 15
  },
  {
    id: 'clutch_ot',
    title: '🚨 Clutch OT Bonus',
    desc: '+150 Clutch Overtime Points & +$25 Puck Bucks banked!',
    instantPts: 150,
    bonusBucks: 25
  },
  {
    id: 'brick_wall',
    title: '🧱 Goalie Brick Wall',
    desc: 'Streak Shield protects your Gold Streak + 80 Wall Points!',
    instantPts: 80,
    bonusBucks: 20
  }
];

function showdownKeyToUuid(rawKey) {
  if (typeof window !== 'undefined' && typeof window.synapzPortalKeyToUuid === 'function') {
    return window.synapzPortalKeyToUuid(rawKey);
  }
  let h1 = 0xdeadbeef ^ rawKey.length;
  let h2 = 0x41c6ce57 ^ rawKey.length;
  for (let i = 0; i < rawKey.length; i++) {
    const ch = rawKey.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex = (n) => (n >>> 0).toString(16).padStart(8, '0');
  const full = (hex(h1) + hex(h2) + hex(h1 ^ 0x9e3779b9) + hex(h2 ^ 0x85ebca6b)).slice(0, 32);
  return `${full.slice(0, 8)}-${full.slice(8, 12)}-4${full.slice(13, 16)}-a${full.slice(17, 20)}-${full.slice(20, 32)}`;
}

function generateSafe4DigitPin() {
  for (let tries = 0; tries < 50; tries++) {
    const num = 1000 + Math.floor(Math.random() * 9000);
    const pin = String(num);
    // Avoid Founder PIN or trivial repeats
    if (pin !== '2026' && !/^(\d)\1{3}$/.test(pin)) return pin;
  }
  return '7419';
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function mergeRoomStates(a, b) {
  if (!a) return b;
  if (!b) return a;
  const newer = (Number(b.updatedAtMs || 0) >= Number(a.updatedAtMs || 0)) ? b : a;
  const older = newer === b ? a : b;
  const statusOrder = { lobby: 0, live: 1, finished: 2 };
  const status = (statusOrder[b.status] ?? 0) >= (statusOrder[a.status] ?? 0) ? b.status : a.status;
  const mergedPlayers = {};
  const allIds = new Set([...Object.keys(older.players || {}), ...Object.keys(newer.players || {})]);
  for (const pid of allIds) {
    const pa = a.players?.[pid];
    const pb = b.players?.[pid];
    if (pa && pb) {
      const pickB = Number(pb.score || 0) > Number(pa.score || 0) ||
        (Number(pb.score || 0) === Number(pa.score || 0) && Number(pb.updatedAtMs || 0) >= Number(pa.updatedAtMs || 0));
      mergedPlayers[pid] = pickB ? { ...pa, ...pb } : { ...pb, ...pa };
    } else {
      mergedPlayers[pid] = pb || pa;
    }
  }
  return {
    ...older,
    ...newer,
    status,
    startedAtMs: a.startedAtMs || b.startedAtMs || null,
    players: mergedPlayers,
    updatedAtMs: Math.max(Number(a.updatedAtMs || 0), Number(b.updatedAtMs || 0))
  };
}

// Shared in-process map for same-tab multi-instance tests + BroadcastChannel for multi-tab sync
const IN_MEMORY_SHOWDOWN_ROOMS = new Map();

export class TeamShowdownCloudSync {
  constructor() {
    this.sbUrl = (typeof window !== 'undefined' && window.SUPABASE_URL) || SB_URL_DEFAULT;
    this.sbKey = (typeof window !== 'undefined' && window.SUPABASE_KEY) || SB_ANON_KEY_DEFAULT;
    this.lastSyncOnline = true;
    this.channel = null;
    this.onBroadcastUpdate = null;

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('synapz_showdown_v14_1');
        this.channel.onmessage = (ev) => {
          if (ev?.data?.type === 'SHOWDOWN_ROOM_UPDATE' && ev.data.room?.pin) {
            const pin = ev.data.room.pin;
            const prev = IN_MEMORY_SHOWDOWN_ROOMS.get(pin);
            const merged = mergeRoomStates(prev, ev.data.room);
            IN_MEMORY_SHOWDOWN_ROOMS.set(pin, merged);
            if (typeof this.onBroadcastUpdate === 'function') {
              this.onBroadcastUpdate(merged);
            }
          }
        };
      } catch (_) {}
    }
  }

  _recordKey(pin) {
    return `showdown_room_${String(pin).trim()}`;
  }

  async cleanupExpiredRooms() {
    const now = Date.now();
    for (const [pin, rm] of IN_MEMORY_SHOWDOWN_ROOMS.entries()) {
      if (Number(rm.expiresAtMs || 0) < now) {
        IN_MEMORY_SHOWDOWN_ROOMS.delete(pin);
      }
    }
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
    try {
      const cutoffIso = new Date(now - ROOM_TTL_MS).toISOString();
      await fetch(
        `${this.sbUrl}/rest/v1/pucksense_agent_inbox?category=eq.showdown_room&created_at=lt.${encodeURIComponent(cutoffIso)}`,
        {
          method: 'DELETE',
          headers: {
            apikey: this.sbKey,
            Authorization: `Bearer ${this.sbKey}`
          }
        }
      );
    } catch (_) {}
  }

  async fetchRoom(pin) {
    const cleanPin = String(pin || '').trim();
    if (!/^\d{4}$/.test(cleanPin)) return null;
    const now = Date.now();
    let localRoom = IN_MEMORY_SHOWDOWN_ROOMS.get(cleanPin) || null;
    if (localRoom && Number(localRoom.expiresAtMs || 0) < now) {
      IN_MEMORY_SHOWDOWN_ROOMS.delete(cleanPin);
      localRoom = null;
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      this.lastSyncOnline = false;
      return localRoom;
    }

    const recKey = this._recordKey(cleanPin);
    try {
      const res = await fetch(
        `${this.sbUrl}/rest/v1/pucksense_agent_inbox?scenario_id=eq.${encodeURIComponent(recKey)}&select=id,scenario_id,created_at,details`,
        {
          headers: {
            apikey: this.sbKey,
            Authorization: `Bearer ${this.sbKey}`
          }
        }
      );
      if (res.ok) {
        this.lastSyncOnline = true;
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0 && rows[0].details) {
          const remote = rows[0].details;
          if (Number(remote.expiresAtMs || 0) < now) {
            // Auto-delete expired room on sight (20-min TTL)
            fetch(`${this.sbUrl}/rest/v1/pucksense_agent_inbox?scenario_id=eq.${encodeURIComponent(recKey)}`, {
              method: 'DELETE',
              headers: { apikey: this.sbKey, Authorization: `Bearer ${this.sbKey}` }
            }).catch(() => {});
            return null;
          }
          const merged = mergeRoomStates(localRoom, remote);
          IN_MEMORY_SHOWDOWN_ROOMS.set(cleanPin, merged);
          return merged;
        }
      } else {
        this.lastSyncOnline = false;
      }
    } catch (_) {
      this.lastSyncOnline = false;
    }
    return localRoom;
  }

  async saveRoom(room) {
    if (!room || !room.pin) return null;
    const pin = String(room.pin).trim();
    room.updatedAtMs = Date.now();
    if (!room.expiresAtMs) room.expiresAtMs = (room.createdAtMs || Date.now()) + ROOM_TTL_MS;

    const existing = IN_MEMORY_SHOWDOWN_ROOMS.get(pin);
    let mergedLocal = mergeRoomStates(existing, room);
    IN_MEMORY_SHOWDOWN_ROOMS.set(pin, mergedLocal);

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      this.lastSyncOnline = false;
      try {
        this.channel?.postMessage({ type: 'SHOWDOWN_ROOM_UPDATE', room: mergedLocal });
      } catch (_) {}
      return mergedLocal;
    }

    // Fetch & merge freshest remote player scores before upsert so concurrent players never overwrite each other!
    const isFreshCreate = Boolean(room._isFreshHostCreate);
    delete mergedLocal._isFreshHostCreate;
    if (!isFreshCreate) {
      const remoteBeforeSave = await this.fetchRoom(pin);
      if (remoteBeforeSave) {
        mergedLocal = mergeRoomStates(remoteBeforeSave, mergedLocal);
        IN_MEMORY_SHOWDOWN_ROOMS.set(pin, mergedLocal);
      }
    }

    try {
      this.channel?.postMessage({ type: 'SHOWDOWN_ROOM_UPDATE', room: mergedLocal });
    } catch (_) {}

    const recKey = this._recordKey(pin);
    const payload = {
      id: showdownKeyToUuid(recKey),
      scenario_id: recKey,
      category: 'showdown_room',
      status: mergedLocal.status === 'finished' ? 'completed_showdown' : 'active_showdown',
      reporter_name: mergedLocal.hostName || 'Showdown Host',
      reporter_role: 'showdown_host',
      note: `v14.1 Showdown PIN ${pin} (${mergedLocal.topicPack} • ${mergedLocal.durationSec}s)`,
      details: mergedLocal
    };

    try {
      const res = await fetch(`${this.sbUrl}/rest/v1/pucksense_agent_inbox?on_conflict=id`, {
        method: 'POST',
        headers: {
          apikey: this.sbKey,
          Authorization: `Bearer ${this.sbKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify(payload)
      });
      this.lastSyncOnline = res.ok;
    } catch (_) {
      this.lastSyncOnline = false;
    }
    return mergedLocal;
  }
}

export class TeamShowdownController {
  constructor({ mountEl, getCatalog, getActiveProfile, getFederationMode, onRewardsCredited }) {
    this.mountEl = mountEl;
    this.getCatalog = getCatalog;
    this.getActiveProfile = getActiveProfile || (() => null);
    this.getFederationMode = getFederationMode || (() => 'USA');
    this.onRewardsCredited = onRewardsCredited;

    this.cloud = new TeamShowdownCloudSync();
    this.cloud.onBroadcastUpdate = (room) => {
      if (this.isOpen && this.room && room.pin === this.room.pin) {
        this._applyIncomingRoomState(room);
      }
    };

    this.isOpen = false;
    this.view = 'chooser'; // 'host_setup' | 'join_form' | 'lobby' | 'live_play' | 'podium'
    this.isHost = false;
    this.room = null;
    this.localPlayerId = null;

    // Gameplay state during live_play
    this.selectedTopic = 'all_ice';
    this.selectedDurationSec = 180;
    this.playerDraft = {
      firstName: 'Skater',
      jerseyNumber: '9',
      ageBand: '12U-14U',
      avatarImg: SHOWDOWN_AVATARS[0].img
    };

    this.drillDeck = [];
    this.deckIdx = 0;
    this.currentDrill = null;
    this.rink = null;
    this.powerUpModalState = null; // null | { step: 'breakaway' | 'bags', bags: [...] }
    this.multiplierCharges = 0;
    this.streakShieldCharges = 0;
    this.bonusPuckBucks = 0;
    this.completedConcepts = [];
    this.podiumCredited = false;

    this._pollTimer = null;
    this._clockTimer = null;

    this._buildDom();
  }

  _prefillFromProfile() {
    const prof = this.getActiveProfile();
    if (prof && prof.name && prof.id) {
      const first = String(prof.firstName || prof.name || 'Skater').trim().split(/\s+/)[0].slice(0, 14);
      const jersey = String(prof.jerseyNumber || '9').replace(/\D/g, '').slice(0, 2) || '9';
      const div = String(prof.divisionLabel || prof.ageGroup || '12U').toUpperCase();
      let band = '12U-14U';
      if (div.includes('8U') || div.includes('10U') || div.includes('U7') || div.includes('U9') || div.includes('U11')) {
        band = '8U-10U';
      } else if (div.includes('16U') || div.includes('18U') || div.includes('JR') || div.includes('U18')) {
        band = '16U+';
      }
      const avObj = SHOWDOWN_AVATARS.find(a => a.id === prof.stockAvatarId) || SHOWDOWN_AVATARS[0];
      this.playerDraft = {
        firstName: first || 'Skater',
        jerseyNumber: jersey,
        ageBand: band,
        avatarImg: prof.avatarUrl || avObj.img,
        loggedInProfileId: prof.id
      };
    } else {
      this.playerDraft = {
        firstName: '',
        jerseyNumber: '19',
        ageBand: '12U-14U',
        avatarImg: SHOWDOWN_AVATARS[0].img,
        loggedInProfileId: null
      };
    }
  }

  _buildDom() {
    if (!this.mountEl) return;
    this.mountEl.innerHTML = `
      <div id="v14ShowdownBackdrop" class="fixed inset-0 z-[130] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
        <div id="v14ShowdownCard" class="w-full max-w-4xl rounded-3xl bg-[#090D16] border-2 border-amber-400/90 shadow-[0_0_50px_rgba(245,158,11,0.28)] overflow-hidden flex flex-col my-auto max-h-[94dvh]">
          <!-- Top Broadcast Header -->
          <div class="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div class="flex items-center gap-2 min-w-0">
              <span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0">
                ⚡ LIVE TEAM SHOWDOWN
              </span>
              <span id="v14ShowdownSyncBadge" class="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 text-[10px] font-black truncate">
                ☁️ SafeSport Tier-A Sync
              </span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span id="v14ShowdownHeaderPinPill" class="hidden px-3 py-0.5 rounded-lg bg-slate-900 border border-amber-400 text-amber-300 font-mono text-xs font-black">
                PIN: ----
              </span>
              <button id="btnV14CloseShowdown" type="button" class="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-black cursor-pointer">
                ✕ Exit
              </button>
            </div>
          </div>

          <!-- Dynamic Body -->
          <div id="v14ShowdownBody" class="p-3.5 sm:p-5 overflow-y-auto space-y-3.5 flex-1"></div>
        </div>
      </div>
    `;

    this.mountEl.querySelector('#btnV14CloseShowdown')?.addEventListener('click', () => {
      this.close();
    });
    this.mountEl.querySelector('#v14ShowdownBackdrop')?.addEventListener('click', (ev) => {
      if (ev.target && ev.target.id === 'v14ShowdownBackdrop') {
        this.close();
      }
    });
  }

  openModal(mode = 'host', prefillPin = '') {
    if (mode === 'join') return this.openJoinModal(prefillPin);
    return this.openHostSetup();
  }

  openHostSetup() {
    this._prefillFromProfile();
    this.isOpen = true;
    this.isHost = true;
    this.view = 'host_setup';
    this.mountEl?.classList.remove('hidden');
    this.cloud.cleanupExpiredRooms().catch(() => {});
    this._render();
  }

  openJoinModal(prefillPin = '') {
    this._prefillFromProfile();
    this.isOpen = true;
    this.isHost = false;
    this.view = 'join_form';
    this._prefillPin = String(prefillPin || '').replace(/\D/g, '').slice(0, 4);
    this.mountEl?.classList.remove('hidden');
    this._render();
  }

  close() {
    this.isOpen = false;
    this._stopTimers();
    this.room = null;
    this.powerUpModalState = null;
    this.mountEl?.classList.add('hidden');
  }

  _stopTimers() {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
    if (this._clockTimer) {
      clearInterval(this._clockTimer);
      this._clockTimer = null;
    }
  }

  async createHostedRoom({ pinOverride = null, topicPack = this.selectedTopic, durationSec = this.selectedDurationSec, hostPlaysToo = true } = {}) {
    const pin = pinOverride && /^\d{4}$/.test(String(pinOverride)) ? String(pinOverride) : generateSafe4DigitPin();
    const now = Date.now();
    const hostPlayerId = `skater_${now}_${Math.random().toString(36).slice(2, 6)}`;
    this.localPlayerId = hostPlaysToo ? hostPlayerId : null;

    const players = {};
    if (hostPlaysToo) {
      players[hostPlayerId] = {
        id: hostPlayerId,
        firstName: (this.playerDraft.firstName || 'Captain').slice(0, 14),
        jerseyNumber: this.playerDraft.jerseyNumber || '9',
        ageBand: this.playerDraft.ageBand || '12U-14U',
        avatarImg: this.playerDraft.avatarImg || SHOWDOWN_AVATARS[0].img,
        score: 0,
        goldCount: 0,
        repsPlayed: 0,
        streak: 0,
        bestStreak: 0,
        isBot: false,
        updatedAtMs: now
      };
    }

    const newRoom = {
      pin,
      _isFreshHostCreate: true,
      topicPack,
      durationSec: Number(durationSec) || 180,
      status: 'lobby',
      hostName: this.playerDraft.firstName || 'Coach',
      createdAtMs: now,
      updatedAtMs: now,
      expiresAtMs: now + ROOM_TTL_MS,
      startedAtMs: null,
      players
    };

    this.isHost = true;
    this.room = await this.cloud.saveRoom(newRoom);
    // If offline at a steel-roof arena, auto-seed 2 friendly sparring bots so lobby is immediately lively!
    if (!this.cloud.lastSyncOnline && Object.keys(this.room.players).length < 2) {
      await this.addSparringBots(2);
    }
    this.view = 'lobby';
    this._startLobbyPolling();
    this._render();
    return this.room;
  }

  async joinRoomByPin({ pin, firstName, jerseyNumber, ageBand, avatarImg } = {}) {
    const cleanPin = String(pin || '').replace(/\D/g, '').slice(0, 4);
    if (cleanPin.length !== 4) {
      return { ok: false, error: 'Enter a valid 4-digit Showdown PIN.' };
    }
    const safeName = String(firstName || this.playerDraft.firstName || 'Teammate').trim().slice(0, 14) || 'Teammate';
    const safeJersey = String(jerseyNumber || this.playerDraft.jerseyNumber || '19').replace(/\D/g, '').slice(0, 2) || '19';
    const safeBand = SHOWDOWN_AGE_BANDS.some(b => b.id === ageBand) ? ageBand : (this.playerDraft.ageBand || '12U-14U');
    const safeAvatar = avatarImg || this.playerDraft.avatarImg || SHOWDOWN_AVATARS[1].img;

    this.playerDraft = {
      ...this.playerDraft,
      firstName: safeName,
      jerseyNumber: safeJersey,
      ageBand: safeBand,
      avatarImg: safeAvatar
    };

    let fetched = await this.cloud.fetchRoom(cleanPin);
    // Offline Steel-Roof Rink Fallback: if offline and room isn't found remotely, spin up instant local bot-sparring room on that PIN!
    if (!fetched && (typeof navigator !== 'undefined' && navigator.onLine === false)) {
      const now = Date.now();
      fetched = {
        pin: cleanPin,
        topicPack: 'all_ice',
        durationSec: 180,
        status: 'lobby',
        hostName: 'Offline Arena Bot Host',
        createdAtMs: now,
        updatedAtMs: now,
        expiresAtMs: now + ROOM_TTL_MS,
        startedAtMs: null,
        players: {}
      };
      this.isHost = true;
    }

    if (!fetched) {
      return { ok: false, error: `Room PIN ${cleanPin} not found or expired (20-min TTL). Check the 4 digits!` };
    }

    const pid = this.localPlayerId || `skater_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    this.localPlayerId = pid;
    fetched.players = fetched.players || {};
    fetched.players[pid] = {
      id: pid,
      firstName: safeName,
      jerseyNumber: safeJersey,
      ageBand: safeBand,
      avatarImg: safeAvatar,
      score: 0,
      goldCount: 0,
      repsPlayed: 0,
      streak: 0,
      bestStreak: 0,
      isBot: false,
      updatedAtMs: Date.now()
    };

    this.room = await this.cloud.saveRoom(fetched);
    if (!this.cloud.lastSyncOnline && Object.keys(this.room.players).length < 2) {
      await this.addSparringBots(2);
    }

    if (this.room.status === 'live') {
      this._enterLiveGameplay();
    } else if (this.room.status === 'finished') {
      this.view = 'podium';
      this._render();
    } else {
      this.view = 'lobby';
      this._startLobbyPolling();
      this._render();
    }
    return { ok: true, room: this.room, playerId: pid };
  }

  async addSparringBots(count = 2) {
    if (!this.room) return;
    const botTemplates = [
      { firstName: 'Leo', jerseyNumber: '9', ageBand: '8U-10U', avatarImg: 'assets/avatars/avatar-male-2.png' },
      { firstName: 'Maya', jerseyNumber: '14', ageBand: '12U-14U', avatarImg: 'assets/avatars/avatar-female-2.png' },
      { firstName: 'Jalen', jerseyNumber: '4', ageBand: '16U+', avatarImg: 'assets/avatars/avatar-male-3.png' }
    ];
    let added = 0;
    for (let i = 0; i < botTemplates.length && added < count; i++) {
      const bt = botTemplates[i];
      const botId = `bot_${this.room.pin}_${i}`;
      if (!this.room.players[botId]) {
        this.room.players[botId] = {
          id: botId,
          firstName: bt.firstName,
          jerseyNumber: bt.jerseyNumber,
          ageBand: bt.ageBand,
          avatarImg: bt.avatarImg,
          score: 0,
          goldCount: 0,
          repsPlayed: 0,
          streak: 0,
          bestStreak: 0,
          isBot: true,
          updatedAtMs: Date.now()
        };
        added += 1;
      }
    }
    this.room = await this.cloud.saveRoom(this.room);
    if (this.view === 'lobby') this._render();
  }

  _startLobbyPolling() {
    this._stopTimers();
    this._pollTimer = setInterval(async () => {
      if (!this.isOpen || !this.room) return;
      const latest = await this.cloud.fetchRoom(this.room.pin);
      if (latest) this._applyIncomingRoomState(latest);
    }, POLL_INTERVAL_MS);
  }

  _applyIncomingRoomState(latest) {
    const prevStatus = this.room?.status;
    const prevCount = Object.keys(this.room?.players || {}).length;
    this.room = mergeRoomStates(this.room, latest);
    const nextCount = Object.keys(this.room?.players || {}).length;

    if (prevStatus !== 'live' && this.room.status === 'live') {
      this._enterLiveGameplay();
      return;
    }
    if (prevStatus !== 'finished' && this.room.status === 'finished') {
      this._finishToPodium();
      return;
    }
    if (this.view === 'lobby' && nextCount !== prevCount) {
      this._render();
    } else if (this.view === 'live_play') {
      this._updateLiveScoreboardStrip();
    }
  }

  async hostStartMatch() {
    if (!this.room) return;
    this.room.status = 'live';
    this.room.startedAtMs = Date.now();
    this.room = await this.cloud.saveRoom(this.room);
    this._enterLiveGameplay();
  }

  _buildAgeCalibratedDeck() {
    const catalog = (typeof this.getCatalog === 'function' ? this.getCatalog() : null) || { drills: [] };
    const allDrills = Array.isArray(catalog.drills) ? catalog.drills : [];
    const pack = SHOWDOWN_TOPIC_PACKS.find(p => p.id === this.room?.topicPack) || SHOWDOWN_TOPIC_PACKS[0];
    // Rapid-fire friendly modes for 3-minute live Blooket race
    const rapidModes = new Set(['read_and_react', 'fog_of_war', 'two_touch', 'spot_the_breakdown', 'change_or_stay', 'draw_the_route']);
    let pool = allDrills.filter(d => pack.zones.includes(d.zone) && rapidModes.has(d.mode));
    if (pool.length < 5) pool = allDrills.filter(d => rapidModes.has(d.mode));

    const me = this.room?.players?.[this.localPlayerId];
    const bandObj = SHOWDOWN_AGE_BANDS.find(b => b.id === (me?.ageBand || this.playerDraft.ageBand)) || SHOWDOWN_AGE_BANDS[1];
    const bandHits = pool.filter(d => bandObj.tiers.includes(d.ageTier));
    const otherHits = pool.filter(d => !bandObj.tiers.includes(d.ageTier));

    // Prioritize player's selected Age Band first so 8U Mites and 14U Bantams compete fairly in the same room!
    this.drillDeck = [...bandHits, ...otherHits];
    this.deckIdx = 0;
  }

  _enterLiveGameplay() {
    this._stopTimers();
    this.view = 'live_play';
    this.multiplierCharges = 0;
    this.streakShieldCharges = 0;
    this.bonusPuckBucks = 0;
    this.completedConcepts = [];
    this.podiumCredited = false;
    this.powerUpModalState = null;

    this._buildAgeCalibratedDeck();
    this.currentDrill = this.drillDeck[0] || null;
    this._render();
    this._drawCurrentShowdownDrill();

    // 1.5s cloud sync + 250ms countdown clock + bot sparring pace
    this._pollTimer = setInterval(async () => {
      if (!this.isOpen || !this.room || this.view !== 'live_play') return;
      // Step any sparring bots gently if we are Host or offline
      if (this.isHost) {
        let botChanged = false;
        for (const p of Object.values(this.room.players || {})) {
          if (p.isBot && Math.random() < 0.42) {
            p.repsPlayed = Number(p.repsPlayed || 0) + 1;
            p.goldCount = Number(p.goldCount || 0) + 1;
            p.streak = Number(p.streak || 0) + 1;
            p.bestStreak = Math.max(Number(p.bestStreak || 0), p.streak);
            p.score = Number(p.score || 0) + 95;
            p.updatedAtMs = Date.now();
            botChanged = true;
          }
        }
        if (botChanged) await this.cloud.saveRoom(this.room);
      }
      const latest = await this.cloud.fetchRoom(this.room.pin);
      if (latest) this._applyIncomingRoomState(latest);
    }, POLL_INTERVAL_MS);

    this._clockTimer = setInterval(() => {
      if (!this.isOpen || !this.room || this.view !== 'live_play') return;
      const rem = this.getRemainingSeconds();
      const clkEl = this.mountEl?.querySelector('#v14ShowdownClockText');
      if (clkEl) {
        const m = Math.floor(rem / 60);
        const s = String(Math.floor(rem % 60)).padStart(2, '0');
        clkEl.textContent = `⏱️ ${m}:${s}`;
      }
      if (rem <= 0) {
        this.endShowdownAtHorn();
      }
    }, 250);
  }

  getRemainingSeconds() {
    if (!this.room || !this.room.startedAtMs) return Number(this.room?.durationSec || 180);
    const elapsed = (Date.now() - Number(this.room.startedAtMs)) / 1000;
    return Math.max(0, Number(this.room.durationSec || 180) - elapsed);
  }

  async submitShowdownAnswer(isGold, feedbackLabel = '') {
    if (!this.room || !this.localPlayerId) return;
    const me = this.room.players[this.localPlayerId];
    if (!me) return;

    const drill = this.currentDrill;
    me.repsPlayed = Number(me.repsPlayed || 0) + 1;

    if (isGold) {
      me.goldCount = Number(me.goldCount || 0) + 1;
      me.streak = Number(me.streak || 0) + 1;
      me.bestStreak = Math.max(Number(me.bestStreak || 0), me.streak);
      const mult = this.multiplierCharges > 0 ? 2 : 1;
      if (this.multiplierCharges > 0) this.multiplierCharges -= 1;
      const streakBonus = Math.min(50, (me.streak - 1) * 15);
      const pts = (100 + streakBonus) * mult;
      me.score = Number(me.score || 0) + pts;
      if (drill?.conceptId) {
        this.completedConcepts.push({ conceptId: drill.conceptId, isGold: true });
      }
    } else {
      if (this.streakShieldCharges > 0) {
        this.streakShieldCharges -= 1;
      } else {
        me.streak = 0;
      }
      me.score = Number(me.score || 0) + 15; // Effort shift points
      if (drill?.conceptId) {
        this.completedConcepts.push({ conceptId: drill.conceptId, isGold: false });
      }
    }
    me.updatedAtMs = Date.now();
    this.room = await this.cloud.saveRoom(this.room);

    // Every 3-Gold streak triggers Breakaway Snipe + Shaking Bag Power-Up!
    if (isGold && me.streak > 0 && me.streak % 3 === 0) {
      this.powerUpModalState = {
        step: 'breakaway',
        bags: [...POSITIVE_POWERUPS]
      };
      this._render();
      return;
    }

    // Advance to next calibrated drill immediately!
    this.deckIdx = (this.deckIdx + 1) % Math.max(1, this.drillDeck.length);
    this.currentDrill = this.drillDeck[this.deckIdx] || null;
    this._lastAnswerToast = isGold
      ? `✅ GOLD READ! ${feedbackLabel}`
      : `🏒 Quick Reset: ${drill?.coachRule || feedbackLabel}`;
    this._render();
    this._drawCurrentShowdownDrill();
  }

  async resolveShowdownBreakaway(move = 'snipe') {
    if (!this.powerUpModalState || !this.room || !this.localPlayerId) return;
    const me = this.room.players[this.localPlayerId];
    if (me) {
      me.score = Number(me.score || 0) + 50;
      me.updatedAtMs = Date.now();
      this.room = await this.cloud.saveRoom(this.room);
    }
    this.powerUpModalState.step = 'bags';
    this.powerUpModalState.moveLabel = move === 'deke' ? 'Silky Forehand Deke' : (move === 'fivehole' ? 'Five-Hole Slip' : 'Bar-Down Snipe');
    this._render();
  }

  async claimShowdownPowerUpBag(bagIdx = 0) {
    if (!this.powerUpModalState || !this.room || !this.localPlayerId) return;
    const chosen = POSITIVE_POWERUPS[bagIdx] || POSITIVE_POWERUPS[0];
    const me = this.room.players[this.localPlayerId];
    if (me) {
      me.score = Number(me.score || 0) + Number(chosen.instantPts || 50);
      me.powerUpActive = chosen.title;
      me.updatedAtMs = Date.now();
    }
    if (chosen.id === 'mult_2x') this.multiplierCharges += 2;
    if (chosen.id === 'brick_wall') this.streakShieldCharges += 1;
    this.bonusPuckBucks += Number(chosen.bonusBucks || 20);

    this.powerUpModalState = null;
    this.deckIdx = (this.deckIdx + 1) % Math.max(1, this.drillDeck.length);
    this.currentDrill = this.drillDeck[this.deckIdx] || null;
    this._lastAnswerToast = `🎒 UNZIPPED ${chosen.title}! (+${chosen.instantPts} Pts)`;
    this.room = await this.cloud.saveRoom(this.room);
    this._render();
    this._drawCurrentShowdownDrill();
  }

  async endShowdownAtHorn() {
    if (!this.room) return;
    this.room.status = 'finished';
    this.room = await this.cloud.saveRoom(this.room);
    this._finishToPodium();
  }

  _finishToPodium() {
    this._stopTimers();
    this.view = 'podium';
    this.powerUpModalState = null;

    // Credit earned Puck Bucks & 5-Zone Skill Ring progress to logged-in profile once!
    if (!this.podiumCredited) {
      this.podiumCredited = true;
      const prof = this.getActiveProfile();
      const me = this.room?.players?.[this.localPlayerId];
      if (prof && prof.id && me) {
        const sorted = this.getStandings();
        const myRank = sorted.findIndex(p => p.id === me.id) + 1;
        const starBonus = myRank === 1 ? 50 : (myRank === 2 ? 35 : (myRank === 3 ? 25 : 15));
        const earnedBucks = starBonus + Number(me.goldCount || 0) * 12 + this.bonusPuckBucks;
        const earnedIq = Math.max(10, Number(me.goldCount || 0) * 15);

        for (const item of this.completedConcepts) {
          recordConceptRepResult(prof, item.conceptId, item.isGold);
        }
        if (typeof this.onRewardsCredited === 'function') {
          this.onRewardsCredited({
            earnedBucks,
            earnedIq,
            rank: myRank,
            completedConceptsCount: this.completedConcepts.length
          });
        }
        this._creditedSummary = { earnedBucks, earnedIq, rank: myRank };
      }
    }
    this._render();
  }

  getStandings() {
    const list = Object.values(this.room?.players || {});
    return list.sort((a, b) => (Number(b.score || 0) - Number(a.score || 0)) || (Number(b.goldCount || 0) - Number(a.goldCount || 0)));
  }

  _updateLiveScoreboardStrip() {
    const strip = this.mountEl?.querySelector('#v14ShowdownTopStandingsStrip');
    if (!strip) return;
    const top = this.getStandings().slice(0, 4);
    strip.innerHTML = top.map((p, idx) => `
      <div class="px-2.5 py-1 rounded-xl ${p.id === this.localPlayerId ? 'bg-teal-500/25 border border-teal-400' : 'bg-slate-900 border border-slate-700'} flex items-center gap-1.5 text-[11px] font-black">
        <span>${['🥇', '🥈', '🥉', '4️⃣'][idx] || '🏒'}</span>
        <span class="text-white truncate max-w-[90px]">${escapeHtml(p.firstName)} #${escapeHtml(p.jerseyNumber)}</span>
        <span class="text-amber-300 font-mono">${p.score}</span>
      </div>
    `).join('');
  }

  _drawCurrentShowdownDrill() {
    const canvas = this.mountEl?.querySelector('#v14ShowdownRinkCanvas');
    const drill = this.currentDrill;
    if (!canvas || !drill) return;
    this.rink = new WhiteIceRink1000x500(canvas, { federationMode: this.getFederationMode() });

    const normT = drill.mode === 'spot_the_breakdown' ? 0.35 : 1.0;
    const skaters = (drill.skaters || []).map(sk => ({
      ...sk,
      pos: samplePolylineAt(sk.motion || [sk.start], normT),
      highlightSuspect: drill.mode === 'spot_the_breakdown' && sk.team === 'home'
    }));
    const youObj = skaters.find(s => s.id === drill.youRole);
    const puckPos = samplePolylineAt(drill.puck?.livePath || [[500, 250]], normT);
    const mc = drill.modeConfig || {};

    this.rink.renderScene({
      camera: drill.camera,
      youRole: drill.youRole,
      showLeftHouse: drill.zone === 'DZ',
      showRightHouse: drill.zone === 'OZ',
      pressureCones: mc.pressureCones || [],
      thisSpaceHalo: mc.thisSpace ? { x: mc.thisSpace.x, y: mc.thisSpace.y, rx: 48, ry: 38, label: 'THIS SPACE', color: 'gold' } : null,
      abcOptions: Array.isArray(mc.options) ? mc.options : null,
      abcOrigin: youObj ? youObj.pos : puckPos,
      skaters,
      puckPos,
      calloutPills: []
    });
  }

  _renderRapidChallengeButtons(drill) {
    if (!drill) return '';
    const mc = drill.modeConfig || {};
    if (drill.mode === 'read_and_react' || drill.mode === 'fog_of_war') {
      return `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          ${(mc.options || []).map(opt => `
            <button type="button" data-sd-opt="${opt.id}" class="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-teal-400/75 text-left flex items-center gap-2 cursor-pointer">
              <span class="w-6 h-6 rounded-full bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">${opt.id}</span>
              <span class="text-xs font-black text-white leading-tight">${escapeHtml(opt.label)}</span>
            </button>
          `).join('')}
        </div>
      `;
    }
    if (drill.mode === 'two_touch') {
      const [g1, g2] = mc.goldSequence || ['LD', 'LW'];
      const wrong = (mc.candidates || []).find(c => c.id !== g1 && c.id !== g2)?.id || 'RW';
      const chains = [
        { id: 'gold', label: `${g1} ➔ ${g2}`, isGold: true },
        { id: 'alt1', label: `${wrong} ➔ ${g1}`, isGold: false },
        { id: 'alt2', label: `${g2} ➔ ${wrong}`, isGold: false }
      ];
      return `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          ${chains.map((ch, idx) => `
            <button type="button" data-sd-chain="${ch.id}" class="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-amber-400/75 text-left flex items-center gap-2 cursor-pointer">
              <span class="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">${idx + 1}</span>
              <span class="text-xs font-black text-white">⚡ ${escapeHtml(ch.label)}</span>
            </button>
          `).join('')}
        </div>
      `;
    }
    if (drill.mode === 'spot_the_breakdown') {
      return `
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          ${(mc.suspects || []).map(s => `
            <button type="button" data-sd-suspect="${s.id}" class="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-rose-400/75 text-xs font-black text-white cursor-pointer">
              🕵️ ${escapeHtml(s.roleLabel)}
            </button>
          `).join('')}
        </div>
      `;
    }
    if (drill.mode === 'change_or_stay') {
      return `
        <div class="grid grid-cols-2 gap-2.5">
          <button type="button" data-sd-cs="change" class="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm cursor-pointer">
            🏃 CHANGE NOW (${mc.fatiguePct || 88}% Tired)
          </button>
          <button type="button" data-sd-cs="stay" class="py-2.5 px-4 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs sm:text-sm cursor-pointer">
            🛡️ STAY &amp; DEFEND
          </button>
        </div>
      `;
    }
    // draw_the_route rapid-fire support choice
    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button type="button" data-sd-route="gold" class="py-2.5 px-4 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs sm:text-sm cursor-pointer">
          ✏️ Curve Underneath Into THIS SPACE
        </button>
        <button type="button" data-sd-route="miss" class="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-black text-xs sm:text-sm cursor-pointer">
          ⚡ Fly Straight Through Defender Stick
        </button>
      </div>
    `;
  }

  _render() {
    const body = this.mountEl?.querySelector('#v14ShowdownBody');
    const pinPill = this.mountEl?.querySelector('#v14ShowdownHeaderPinPill');
    const syncBadge = this.mountEl?.querySelector('#v14ShowdownSyncBadge');
    if (!body) return;

    if (syncBadge) {
      syncBadge.textContent = this.cloud.lastSyncOnline
        ? '☁️ Live Cloud Sync • 0 Text Chat (SafeSport)'
        : '📡 Offline Rink Mode • Bot Sparring Active';
    }

    if (pinPill) {
      if (this.room?.pin) {
        pinPill.classList.remove('hidden');
        pinPill.textContent = `PIN: ${this.room.pin}`;
      } else {
        pinPill.classList.add('hidden');
      }
    }

    // 1. HOST SETUP VIEW
    if (this.view === 'host_setup') {
      body.innerHTML = `
        <div class="space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 class="text-lg sm:text-xl font-black text-white">⚡ Host Live 3-Minute Team Showdown (4-Digit PIN)</h3>
              <p class="text-xs font-bold text-slate-300">Phones, iPads &amp; PCs join in 5 seconds—calibrated fairly across 8U–16U+ age bands!</p>
            </div>
            <button id="btnSwitchToJoinView" type="button" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-400/70 text-cyan-200 text-xs font-black cursor-pointer">
              🎮 Have a PIN? Join Instead
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <!-- Topic Pack Picker -->
            <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div class="text-[11px] font-black uppercase text-teal-300">1. Pick Topic Pack</div>
              <div class="space-y-1.5">
                ${SHOWDOWN_TOPIC_PACKS.map(tp => `
                  <button type="button" data-host-topic="${tp.id}" class="w-full py-2 px-3 rounded-xl border text-left text-xs font-black transition cursor-pointer ${this.selectedTopic === tp.id ? 'bg-teal-400 text-slate-950 border-teal-200 shadow' : 'bg-slate-900 text-slate-200 border-slate-800 hover:border-teal-400/60'}">
                    ${tp.label}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Clock + Host Skater Identity -->
            <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div>
                <div class="text-[11px] font-black uppercase text-amber-300 mb-1.5">2. Match Clock</div>
                <div class="grid grid-cols-3 gap-2">
                  ${SHOWDOWN_TIMERS.map(tm => `
                    <button type="button" data-host-timer="${tm.sec}" class="py-2.5 px-3 rounded-xl border text-xs font-black transition cursor-pointer ${this.selectedDurationSec === tm.sec ? 'bg-amber-400 text-slate-950 border-amber-200 shadow' : 'bg-slate-900 text-slate-200 border-slate-800'}">
                      ⏱️ ${tm.label}
                    </button>
                  `).join('')}
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-[10px] font-black uppercase text-slate-400">Your Name</label>
                  <input id="inputShowdownHostName" type="text" maxlength="14" value="${escapeHtml(this.playerDraft.firstName || 'Coach')}" class="w-full mt-0.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-black text-white" />
                </div>
                <div>
                  <label class="text-[10px] font-black uppercase text-slate-400">Jersey #</label>
                  <input id="inputShowdownHostJersey" type="text" maxlength="2" value="${escapeHtml(this.playerDraft.jerseyNumber || '9')}" class="w-full mt-0.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-black text-amber-300" />
                </div>
              </div>

              <div>
                <label class="text-[10px] font-black uppercase text-slate-400">Your Age Band Calibration</label>
                <select id="selectShowdownHostBand" class="w-full mt-0.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-black text-teal-200">
                  ${SHOWDOWN_AGE_BANDS.map(b => `<option value="${b.id}" ${this.playerDraft.ageBand === b.id ? 'selected' : ''}>${b.label}</option>`).join('')}
                </select>
              </div>

              <button id="btnGenerateShowdownPin" type="button" class="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-sm shadow-xl cursor-pointer">
                ⚡ Generate 4-Digit Showdown PIN ➔
              </button>
            </div>
          </div>
        </div>
      `;

      body.querySelector('#btnSwitchToJoinView')?.addEventListener('click', () => {
        this.isHost = false;
        this.view = 'join_form';
        this._render();
      });
      body.querySelectorAll('[data-host-topic]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.selectedTopic = btn.getAttribute('data-host-topic');
          this._render();
        });
      });
      body.querySelectorAll('[data-host-timer]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.selectedDurationSec = Number(btn.getAttribute('data-host-timer') || 180);
          this._render();
        });
      });
      body.querySelector('#btnGenerateShowdownPin')?.addEventListener('click', () => {
        this.playerDraft.firstName = body.querySelector('#inputShowdownHostName')?.value?.trim() || 'Coach';
        this.playerDraft.jerseyNumber = body.querySelector('#inputShowdownHostJersey')?.value?.trim() || '9';
        this.playerDraft.ageBand = body.querySelector('#selectShowdownHostBand')?.value || '12U-14U';
        this.createHostedRoom({ topicPack: this.selectedTopic, durationSec: this.selectedDurationSec, hostPlaysToo: true });
      });
      return;
    }

    // 2. PLAYER JOIN PIN VIEW
    if (this.view === 'join_form') {
      body.innerHTML = `
        <div class="max-w-lg mx-auto space-y-3.5">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-lg sm:text-xl font-black text-white">🎮 Join Live Showdown PIN</h3>
            <button id="btnSwitchToHostView" type="button" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-400/70 text-amber-300 text-xs font-black cursor-pointer">
              ⚡ Host Room Instead
            </button>
          </div>
          <p class="text-xs font-bold text-slate-300">Zero email or password needed—punch in your Coach or Sibling's 4-Digit PIN!</p>

          <div>
            <label class="text-[11px] font-black uppercase text-amber-300">4-Digit Showdown PIN</label>
            <input id="inputJoinShowdownPin" type="text" inputmode="numeric" maxlength="4" placeholder="7419" value="${escapeHtml(this._prefillPin || '')}" class="w-full mt-1 py-3 px-4 rounded-2xl bg-slate-950 border-2 border-amber-400 text-center text-3xl font-mono font-black tracking-[0.35em] text-amber-300" />
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div class="col-span-2">
              <label class="text-[10px] font-black uppercase text-slate-300">First Name</label>
              <input id="inputJoinFirstName" type="text" maxlength="14" placeholder="Connor" value="${escapeHtml(this.playerDraft.firstName)}" class="w-full mt-0.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-black text-white" />
            </div>
            <div>
              <label class="text-[10px] font-black uppercase text-slate-300">Jersey #</label>
              <input id="inputJoinJersey" type="text" inputmode="numeric" maxlength="2" value="${escapeHtml(this.playerDraft.jerseyNumber)}" class="w-full mt-0.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-black text-amber-300 text-center" />
            </div>
          </div>

          <div>
            <label class="text-[10px] font-black uppercase text-teal-300">Fair Cross-Age Band (Calibrates Your Reads!)</label>
            <select id="selectJoinAgeBand" class="w-full mt-0.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-teal-400/70 text-xs font-black text-white">
              ${SHOWDOWN_AGE_BANDS.map(b => `<option value="${b.id}" ${this.playerDraft.ageBand === b.id ? 'selected' : ''}>${b.label}</option>`).join('')}
            </select>
          </div>

          <div id="v14JoinShowdownError" class="hidden p-2.5 rounded-xl bg-rose-950 border border-rose-400 text-rose-200 text-xs font-black"></div>

          <button id="btnSubmitJoinShowdown" type="button" class="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-sm shadow-xl cursor-pointer">
            🏒 Skate Into Warmup Lobby ➔
          </button>
        </div>
      `;

      body.querySelector('#btnSwitchToHostView')?.addEventListener('click', () => {
        this.openHostSetup();
      });
      body.querySelector('#btnSubmitJoinShowdown')?.addEventListener('click', async () => {
        const pin = body.querySelector('#inputJoinShowdownPin')?.value || '';
        const firstName = body.querySelector('#inputJoinFirstName')?.value || 'Skater';
        const jerseyNumber = body.querySelector('#inputJoinJersey')?.value || '19';
        const ageBand = body.querySelector('#selectJoinAgeBand')?.value || '12U-14U';
        const res = await this.joinRoomByPin({ pin, firstName, jerseyNumber, ageBand });
        if (!res.ok) {
          const errEl = body.querySelector('#v14JoinShowdownError');
          if (errEl) {
            errEl.textContent = `⚠️ ${res.error}`;
            errEl.classList.remove('hidden');
          }
        }
      });
      return;
    }

    // 3. WARMUP LOBBY VIEW (GIANT 4-DIGIT PIN + 3D AVATARS)
    if (this.view === 'lobby' && this.room) {
      const players = Object.values(this.room.players || {});
      const packObj = SHOWDOWN_TOPIC_PACKS.find(p => p.id === this.room.topicPack) || SHOWDOWN_TOPIC_PACKS[0];
      const mins = Math.round((this.room.durationSec || 180) / 60);

      body.innerHTML = `
        <div class="space-y-4">
          <!-- Giant High-Contrast 4-Digit Showdown PIN Banner -->
          <div class="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-400 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <div class="text-[11px] font-black uppercase tracking-widest text-amber-300">🏒 PUNCH IN 4-DIGIT SHOWDOWN PIN</div>
              <div id="v14GiantShowdownPin" class="text-4xl sm:text-5xl font-mono font-black tracking-[0.25em] text-white mt-0.5">${escapeHtml(this.room.pin)}</div>
              <div class="text-xs font-bold text-teal-300 mt-1">${packObj.label} • ⏱️ ${mins} Min Clock • 20-Min Room TTL</div>
            </div>
            <div class="flex flex-col gap-2 w-full sm:w-auto">
              <button id="btnAddSparringBots" type="button" class="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-400/70 text-cyan-200 text-xs font-black cursor-pointer">
                🤖 + Add AI Sparring Teammates
              </button>
              ${this.isHost ? `
                <button id="btnHostDropPuckStart" type="button" class="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 hover:from-amber-300 hover:to-teal-300 text-slate-950 font-black text-sm shadow-2xl cursor-pointer">
                  🚨 DROP PUCK — START SHOWDOWN!
                </button>
              ` : `
                <div class="py-2.5 px-4 rounded-xl bg-teal-950/80 border border-teal-400 text-teal-200 text-xs font-black text-center">
                  ⏳ Waiting for Host to Drop Puck...
                </div>
              `}
            </div>
          </div>

          <!-- Warmup Ice Lobby 3D Avatars Grid -->
          <div>
            <div class="text-xs font-black uppercase text-slate-300 mb-2">🏒 Skaters in Warmup Lobby (${players.length})</div>
            <div id="v14ShowdownLobbyGrid" class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              ${players.map(p => `
                <div data-lobby-skater="${escapeHtml(p.id)}" class="p-3 rounded-2xl bg-slate-950 border ${p.id === this.localPlayerId ? 'border-teal-400 shadow-lg' : 'border-slate-800'} flex flex-col items-center text-center gap-1">
                  <img src="${escapeHtml(p.avatarImg || SHOWDOWN_AVATARS[0].img)}" alt="${escapeHtml(p.firstName)}" class="h-16 w-auto object-contain" />
                  <div class="text-xs font-black text-white truncate max-w-full">
                    ${escapeHtml(p.firstName)} <span class="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px]">#${escapeHtml(p.jerseyNumber)}</span>
                  </div>
                  <span class="text-[10px] font-extrabold text-teal-300">${escapeHtml(p.ageBand)}${p.isBot ? ' • 🤖 Bot' : ''}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      body.querySelector('#btnAddSparringBots')?.addEventListener('click', () => this.addSparringBots(2));
      body.querySelector('#btnHostDropPuckStart')?.addEventListener('click', () => this.hostStartMatch());
      return;
    }

    // 4. LIVE RAPID-FIRE GAMEPLAY + BREAKAWAY/BAG POWER-UP
    if (this.view === 'live_play' && this.room) {
      const me = this.room.players?.[this.localPlayerId] || { score: 0, streak: 0, ageBand: '12U-14U' };
      const rem = this.getRemainingSeconds();
      const m = Math.floor(rem / 60);
      const s = String(Math.floor(rem % 60)).padStart(2, '0');

      if (this.powerUpModalState) {
        const st = this.powerUpModalState;
        body.innerHTML = `
          <div class="p-4 rounded-2xl bg-slate-950 border-2 border-amber-400 space-y-3 text-center">
            <div class="text-xs font-black uppercase text-amber-400">🔥 3-GOLD STREAK POWER-UP UNLOCKED!</div>
            ${st.step === 'breakaway' ? `
              <h4 class="text-lg font-black text-white">🚨 Breakaway Snipe (+50 Bonus Pts)!</h4>
              <p class="text-xs font-bold text-slate-300">Pick your move to beat the goalie and unzip a Shaking Hockey Bag:</p>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <button type="button" data-sd-breakaway="deke" class="py-3 px-4 rounded-xl bg-teal-400 text-slate-950 font-black text-xs cursor-pointer">⚡ Forehand-Backhand Deke</button>
                <button type="button" data-sd-breakaway="snipe" class="py-3 px-4 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer">🎯 Top-Corner Glove Snipe</button>
                <button type="button" data-sd-breakaway="fivehole" class="py-3 px-4 rounded-xl bg-sky-400 text-slate-950 font-black text-xs cursor-pointer">🧊 Quick Five-Hole Slip</button>
              </div>
            ` : `
              <h4 class="text-lg font-black text-emerald-300">🚨 GOAL (${escapeHtml(st.moveLabel)})! Pick a Shaking Hockey Bag:</h4>
              <p class="text-xs font-bold text-slate-300">100% Positive SafeSport Boosts — Zero Stealing or Griefing!</p>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                ${POSITIVE_POWERUPS.map((pu, idx) => `
                  <button type="button" data-sd-bag="${idx}" class="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-amber-400 flex flex-col items-center gap-1 cursor-pointer">
                    <span class="text-3xl animate-bounce">🎒</span>
                    <span class="text-xs font-black text-amber-300">Hockey Bag #${idx + 1}</span>
                    <span class="text-[10px] font-bold text-slate-300">Tap to Unzip Boost!</span>
                  </button>
                `).join('')}
              </div>
            `}
          </div>
        `;
        body.querySelectorAll('[data-sd-breakaway]').forEach(btn => {
          btn.addEventListener('click', () => this.resolveShowdownBreakaway(btn.getAttribute('data-sd-breakaway')));
        });
        body.querySelectorAll('[data-sd-bag]').forEach(btn => {
          btn.addEventListener('click', () => this.claimShowdownPowerUpBag(Number(btn.getAttribute('data-sd-bag') || 0)));
        });
        return;
      }

      const drill = this.currentDrill;
      body.innerHTML = `
        <div class="space-y-2.5">
          <!-- Top Live HUD: Clock + Streak + Active Boosts + Standings -->
          <div class="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
            <div class="flex flex-wrap items-center gap-1.5">
              <span id="v14ShowdownClockText" class="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-mono text-xs font-black">⏱️ ${m}:${s}</span>
              <span class="px-2.5 py-1 rounded-lg bg-teal-500/20 border border-teal-400 text-teal-200 text-xs font-black">⭐ ${me.score || 0} Pts</span>
              <span class="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black">🔥 x${me.streak || 0}</span>
              ${this.multiplierCharges > 0 ? `<span class="px-2 py-0.5 rounded bg-emerald-400 text-slate-950 text-[10px] font-black">⚡ 2x (${this.multiplierCharges})</span>` : ''}
              ${this.streakShieldCharges > 0 ? `<span class="px-2 py-0.5 rounded bg-sky-400 text-slate-950 text-[10px] font-black">🧱 Wall Shield</span>` : ''}
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] font-black text-slate-400">Calibrated: ${escapeHtml(me.ageBand)}</span>
              ${this.isHost ? `<button id="btnShowdownEndHornNow" type="button" class="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-400/70 text-rose-200 text-[10px] font-black cursor-pointer">🏁 Sound Horn</button>` : ''}
            </div>
          </div>

          <div id="v14ShowdownTopStandingsStrip" class="flex flex-wrap items-center gap-1.5"></div>

          ${this._lastAnswerToast ? `<div class="px-3 py-1.5 rounded-xl bg-slate-900 border border-teal-400/50 text-xs font-black text-teal-200">${escapeHtml(this._lastAnswerToast)}</div>` : ''}

          <!-- Briefing + Crisp White-Ice 1000×500 Canvas -->
          <div class="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-black text-white">${escapeHtml(drill ? `${drill.conceptId} · ${drill.title}` : 'Hockey Read')}</span>
              <span class="text-[10px] font-black text-teal-300 uppercase">YOU: ${escapeHtml(drill?.youRole || 'C')}</span>
            </div>
            <p class="text-xs font-bold text-slate-200">${escapeHtml(drill?.briefing || '')}</p>
            <div class="w-full rounded-xl overflow-hidden border border-slate-800" style="aspect-ratio: 16 / 9; max-height: 36vh;">
              <canvas id="v14ShowdownRinkCanvas" class="w-full h-full block"></canvas>
            </div>
            ${this._renderRapidChallengeButtons(drill)}
          </div>
        </div>
      `;

      this._updateLiveScoreboardStrip();

      body.querySelector('#btnShowdownEndHornNow')?.addEventListener('click', () => this.endShowdownAtHorn());
      body.querySelectorAll('[data-sd-opt]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-sd-opt');
          const opt = (drill?.modeConfig?.options || []).find(o => o.id === id);
          this.submitShowdownAnswer(Boolean(opt?.isGold), opt?.label || '');
        });
      });
      body.querySelectorAll('[data-sd-chain]').forEach(btn => {
        btn.addEventListener('click', () => {
          const isGold = btn.getAttribute('data-sd-chain') === 'gold';
          this.submitShowdownAnswer(isGold, 'Two-Touch Chain');
        });
      });
      body.querySelectorAll('[data-sd-suspect]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-sd-suspect');
          this.submitShowdownAnswer(id === drill?.modeConfig?.culpritId, `Spotted ${drill?.modeConfig?.culpritId}`);
        });
      });
      body.querySelectorAll('[data-sd-cs]').forEach(btn => {
        btn.addEventListener('click', () => {
          const act = btn.getAttribute('data-sd-cs');
          this.submitShowdownAnswer(act === drill?.modeConfig?.correctAction, act.toUpperCase());
        });
      });
      body.querySelectorAll('[data-sd-route]').forEach(btn => {
        btn.addEventListener('click', () => {
          const isGold = btn.getAttribute('data-sd-route') === 'gold';
          this.submitShowdownAnswer(isGold, 'THIS SPACE Support Cut');
        });
      });
      return;
    }

    // 5. BROADCAST THREE STARS OF THE GAME PODIUM
    if (this.view === 'podium' && this.room) {
      const standings = this.getStandings();
      const top3 = standings.slice(0, 3);
      const cred = this._creditedSummary;

      body.innerHTML = `
        <div id="v14ThreeStarsPodiumRoot" class="space-y-4 text-center">
          <div>
            <span class="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-widest shadow">
              🚨 FINAL HORN • PIN ${escapeHtml(this.room.pin)}
            </span>
            <h3 class="text-xl sm:text-2xl font-black text-white mt-2">🏆 Three Stars of the Game Podium</h3>
            <p class="text-xs font-bold text-slate-300">Cross-Age Fair Calibration • 100% Positive SafeSport Showdown</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-2">
            ${top3.map((p, idx) => {
              const starLabels = ['🥇 1ST STAR OF THE GAME', '🥈 2ND STAR', '🥉 3RD STAR'];
              const borderCols = ['border-amber-400 bg-amber-950/35', 'border-slate-300 bg-slate-900/90', 'border-amber-600 bg-slate-900/80'];
              return `
                <div data-podium-star="${idx + 1}" class="p-4 rounded-2xl border-2 ${borderCols[idx]} flex flex-col items-center gap-1.5 shadow-xl">
                  <span class="text-[11px] font-black text-amber-300">${starLabels[idx]}</span>
                  <img src="${escapeHtml(p.avatarImg || SHOWDOWN_AVATARS[0].img)}" alt="${escapeHtml(p.firstName)}" class="h-20 w-auto object-contain" />
                  <div class="text-sm font-black text-white">${escapeHtml(p.firstName)} <span class="text-amber-300">#${escapeHtml(p.jerseyNumber)}</span></div>
                  <div class="text-[10px] font-bold text-teal-300">${escapeHtml(p.ageBand)}</div>
                  <div class="text-lg font-mono font-black text-emerald-300">${p.score} PTS</div>
                  <div class="text-[10px] font-bold text-slate-300">${p.goldCount || 0} Gold Reads • 🔥 Best x${p.bestStreak || 0}</div>
                </div>
              `;
            }).join('')}
          </div>

          ${cred ? `
            <div id="v14ShowdownCreditedBanner" class="p-3 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 text-xs sm:text-sm font-black text-emerald-200">
              🎉 Credited to Your Locker Stall: +$${cred.earnedBucks} Puck Bucks • +${cred.earnedIq} IQ • 5-Zone Skill Ring Progress Saved!
            </div>
          ` : `
            <div class="p-3 rounded-2xl bg-slate-900 border border-teal-400/60 text-xs font-bold text-teal-200">
              🏒 Great Showdown! Log into a Player Stall anytime to bank Puck Bucks &amp; 5-Zone Skill Rings permanently.
            </div>
          `}

          <div class="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <button id="btnShowdownPlayAgainHost" type="button" class="py-2.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow cursor-pointer">
              ⚡ Host Another Showdown
            </button>
            <button id="btnShowdownDoneExit" type="button" class="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-black text-xs sm:text-sm cursor-pointer">
              ✓ Back to Rink
            </button>
          </div>
        </div>
      `;

      body.querySelector('#btnShowdownPlayAgainHost')?.addEventListener('click', () => this.openHostSetup());
      body.querySelector('#btnShowdownDoneExit')?.addEventListener('click', () => this.close());
    }
  }
}
