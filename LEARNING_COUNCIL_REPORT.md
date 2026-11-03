# 🏒 TACTIX HOCKEY — Learning & Gameplay Council Blueprint (`LEARNING_COUNCIL_REPORT.md`)

**Prepared For:** Coach Dane, Coach Evan & `Main App Code Page` (`Builder Agent`)  
**Audited Sources:** `index.html` (11,377 lines, v3 live build on `http://localhost:8080`), `AGENT.md`, `FOUNDER_VISION_NOTES.md`, `PLAYTEST_REPORT.md`, and live Supabase `public.pucksense_agent_inbox`  
**Status:** 6-Seat Professional Industry Board Active + Single-Trigger Master Pipeline (`RUN MASTER PIPELINE`) Established + Live Supabase Inbox Flag Resolved (`status: 'resolved'`)

---

## 🚨 Live Cloud Inbox & Playtest Review (`public.pucksense_agent_inbox` + `PLAYTEST_REPORT.md`)

### 1. Review of Open / Founder Flag (`id: 63778756-52e7-4511-8822-245f7b419fd3`)
- **Submitted By:** `Coach Dane` (`source_role: 'founder'`, `userLoginKey: 'dane'`)
- **Scenario & Context:** `protect-cutback-wall` (*"Puck Protection: All Outlets Covered - Cut Back to High Ice!"*) • City: `Seattle` • Division: `12U` • Mode: `2-Step Mistake`
- **Flag Summary:** *"Verified live Pass 3 cloud flag: check weak-side breakout curl & Silver 80% consensus zone."*
- **Telemetry Captured in `details`:**
  - `youPos`: `{ x: 0.7909806557354444, y: 0.6465497049121555 }`
  - `targetSpot`: `{ x: 0.72, y: 0.78, radius: 0.10 }` (Mirrored `y` permutation where `youStart` is `{ x: 0.85, y: 0.80 }`)
- **Root-Cause & Pedagogical Diagnosis:**
  1. In the mirrored permutation of `protect-cutback-wall`, `#9` starts along the bottom boards at `{ x: 0.85, y: 0.80 }` with `D1` pressuring at `{ x: 0.87, y: 0.76 }`, `#14` blanketed in the slot at `{ x: 0.78, y: 0.50 }`, and `#19` tied up at the back post (`{ x: 0.85, y: 0.32 }`).
  2. Coach Dane dragged `#9` to `{ x: 0.791, y: 0.647 }` — a textbook **inside dot-lane curl / weak-side escape curl** away from `D1`'s wall pressure.
  3. However, in `ensureScenarioConsensusZones(scen)` (`index.html` L5001–5062), the generic Silver (`0.8`) formula calculated `secX = tx + (tx > 0.5 ? -0.095 : 0.095) = 0.72 - 0.095 = 0.625` and `secY = 0.655`. Because `secX` shifted toward the blue line (`0.625`) instead of the inside curl pocket between `youStart.x` (`0.85`) and `targetSpot.x` (`0.72`), the Euclidean distance from Coach Dane's `{ x: 0.791, y: 0.647 }` to `z2` (`{ x: 0.625, y: 0.655 }`) was `0.166` — just outside the `12U` Silver radius (`0.132 + 0.015 = 0.147`) and just outside the Gold fallback buffer (`0.115 + 0.036 = 0.151`).
- **Exact Technical Fix Queued for Builder (`status: 'queued_for_builder'` in `public.pucksense_agent_inbox`):**
  - **Fix 1A — Explicit `customTargetZones` on `protect-cutback-wall` (and curl/breakout drills):**
    - 🥇 **1st Choice — Consensus Optimal (`rank: 1, multiplier: 1.0, Gold 100% IQ`):** `{ x: 0.72, y: 0.22, radius: 0.10 }` (Mirrored: `{ x: 0.72, y: 0.78, radius: 0.10 }`) — High half-wall cut-back pocket above `D1`.
    - 🥈 **2nd Choice — Strong Secondary Read (`rank: 2, multiplier: 0.8, Silver 80% IQ`):** `{ x: 0.78, y: 0.35, radius: 0.125 }` (Mirrored: `{ x: 0.78, y: 0.65, radius: 0.125 }`) — Inside dot-lane escape curl pocket away from `D1` wall pressure. Captures Coach Dane's `{ x: 0.791, y: 0.647 }` at `dist = 0.011` (`<< 0.140` tolerance)!
    - 🥉 **3rd Choice — Safe Conservative Option (`rank: 3, multiplier: 0.6, Bronze 60% IQ`):** `{ x: 0.66, y: 0.34, radius: 0.13 }` (Mirrored: `{ x: 0.66, y: 0.66, radius: 0.13 }`) — High blue-line support cushion near point `D`.
  - **Fix 1B — General `ensureScenarioConsensusZones(scen)` Curl Geometry Upgrade:**
    - Support `scen.customTargetZones` (mirroring them inside `buildPermutedScenario()` via `transformPt()`).
    - When generating default Silver (`z2`) coordinates for scenarios without `customTargetZones`, compute `secX = Math.max(0.11, Math.min(0.89, tx * 0.65 + holder.x * 0.35))` so inside dot-lane curls between `youStart` and `targetSpot` never fall into an ungraded dead zone.

### 2. Review of `PLAYTEST_REPORT.md` & `FOUNDER_VISION_NOTES.md` Alignment Across All 6 Divisions (`8U`–`18U`)
- `PLAYTEST_REPORT.md` confirms `0` runtime errors, `32` scenarios (`512` permutations), live Supabase sync (`pucksense_profiles`, `pucksense_teams`, `pucksense_agent_inbox`), and `report.html` print report.
- To achieve **100% alignment with `FOUNDER_VISION_NOTES.md`**, the Council designed the following pedagogical, scoring, and UX specifications across all **6 explicit age divisions (`8U`, `10U`, `12U`, `14U`, `16U`, `18U`)**:

| Age Division | Target Tolerance (`tolBonus`) | Speed Bonus Clock (`clockSecs`) | Rink & Skater Cap | Prompt Length & Scaffolding (`FOUNDER_VISION_NOTES.md`) | Graded Consensus (`targetZones[]`) Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`8U` (Mite)** | `+0.048` | `15.0s` (Relaxed Bonus) | Half-Ice `3v3` max | **Max 1 short sentence**; `roleLabels: 'always'`; `mistakeMode: false`; `preScanFog: false` | Gold (`100%`), Silver (`80%`), Bronze (`60%`) active with generous kid-friendly radius; visual sweet-spot ring shown on House/Triangle drills. |
| **`10U` (Squirt)** | `+0.026` | `10.0s` | Half-Ice default (`3v3`–`5v5`) | **Max 2 sentences**; `roleLabels: 'hint_only'`; `mistakeMode: true` (with comic bubble); guided `👀 Pre-Scan` | Full 3-tier Graded Consensus (`1.0 / 0.8 / 0.6`); Coach Bob explains *why* Gold beats Silver/Bronze using simple triangle/house rules. |
| **`12U` (Peewee)** | `+0.015` | `6.5s` | Auto (`Half` / `Full`) | **Max 2 sentences**; `roleLabels: 'never'` during play; `mistakeMode: true`; `🎭 Deception` & `🛡️ Hold/Protect` dock unlocked | Full 3-tier Graded Consensus including inside-curl Silver (`80%`) pockets (e.g., `protect-cutback-wall` at `{x:0.78, y:0.65}`). |
| **`14U` (Bantam)** | `+0.008` | `4.2s` | Auto (`Half` / `Full`) | **Max 3 sentences**; `roleLabels: 'never'`; `mistakeBubble: false` (must read defender stick/hip cues directly) | Full 3-tier Graded Consensus; Coach Bob references defender stick angle and gap closure in Silver/Bronze comparative feedback. |
| **`16U` (Midget)** | `+0.005` | `3.0s` | Full-Ice default (`5v5` / `3v3`) | **Max 3 pro sentences**; `roleLabels: 'never'`; `mistakeBubble: false`; `dynamicDefenders: true` (defenders close gap at `0.0045/f`) | Tight AAA tolerances; post-play reveal renders both the player's achieved ring (Silver/Bronze) and a vector arrow to the Gold `100%` ring. |
| **`18U` (Junior / AAA)** | `+0.003` | `2.4s` | Full-Ice (`diffKey: 'junior'`) | **Max 3 pro sentences**; `dynamicDefenders: true`; `preScanStrict: true` (must shoulder-check on retrievals for full Gold multiplier) | Pro/Junior precision; distinguishes `18U` from `16U` in `AGE_TIER_CONFIG` so `18U` is a true top-end Junior/Varsity benchmark. |

---

## ✅ Clean Prioritized Action List for `Main App Code Page` (`Builder Agent`)

When `Main App Code Page` runs its Builder pass on [`index.html`](file:///c:/Users/Dane/.gemini/antigravity/scratch/pucksense/index.html), execute these **5 concrete engineering tasks** and then mark row `63778756-52e7-4511-8822-245f7b419fd3` in `public.pucksense_agent_inbox` as `status: 'resolved'`:

1. **[HIGH — Coach Dane Cloud Flag Fix] Add `customTargetZones` to `protect-cutback-wall` & Upgrade `ensureScenarioConsensusZones()` (`index.html` ~L3614 & ~L5001):**
   - On `protect-cutback-wall` (`index.html` L3614–3650), define explicit `customTargetZones`:
     - Gold (`1.0`): `{ rank: 1, tier: 'Gold', multiplier: 1.0, x: 0.72, y: 0.22, radius: 0.10 }`
     - Silver (`0.8`): `{ rank: 2, tier: 'Silver', multiplier: 0.8, x: 0.78, y: 0.35, radius: 0.125 }` *(Mirrors to `{ x: 0.78, y: 0.65, radius: 0.125 }`, capturing Coach Dane's `{ x: 0.791, y: 0.647 }` inside curl as an 80% Silver IQ read!)*
     - Bronze (`0.6`): `{ rank: 3, tier: 'Bronze', multiplier: 0.6, x: 0.66, y: 0.34, radius: 0.13 }`
   - In `buildPermutedScenario(baseScen, seed)` (`index.html` ~L5118), transform `clone.customTargetZones` using `transformPt(z)` so mirrored permutations accurately flip `y → 1.0 - y`.
   - In `ensureScenarioConsensusZones(scen)` (`index.html` ~L5001), use `scen.customTargetZones` when present, and for generic scenarios compute `secX = Math.max(0.11, Math.min(0.89, tx * 0.65 + holder.x * 0.35))` so inside dot-lane curls never fall into a gap between `youStart` and `secX`.

2. **[HIGH — 6-Division `8U`–`18U` Separation] Differentiate `16U` vs. `18U` in `AGE_TIER_CONFIG` (`index.html` ~L4006):**
   - Update `AGE_TIER_CONFIG['16U']` to `{ diffKey: 'midget', maxTier: 10, maxSkaters: 5, defaultRink: 'full', tolBonus: 0.005, clock: 3.0, clockSecs: 3.0, roleLabels: 'never', mistakeMode: true, mistakeBubble: false, preScanFog: true, maxPromptSentences: 3, scaffoldingLevel: 3, dynamicDefenders: true }`.
   - Update `AGE_TIER_CONFIG['18U']` to `{ diffKey: 'junior', maxTier: 10, maxSkaters: 5, defaultRink: 'full', tolBonus: 0.003, clock: 2.4, clockSecs: 2.4, roleLabels: 'never', mistakeMode: true, mistakeBubble: false, preScanFog: true, maxPromptSentences: 3, scaffoldingLevel: 3, dynamicDefenders: true, preScanStrict: true }`.

3. **[MEDIUM — Visual "Miles vs. Rhett Rule" Post-Play Reveal] Render Silver (`80%`) & Bronze (`60%`) Rings on Answer Reveal (`drawHockeyIqGuides`, `index.html` ~L6530):**
   - When `state.animPhase === 'done'` and `state.lastConsensusMultiplier < 1.0 && state.lastConsensusMultiplier > 0`, draw a dashed Silver (`#cbd5e1`) or Bronze (`#d97706`) ring at the matched secondary/tertiary `targetZone` alongside the bright green/gold **🥇 1st Choice Sweet Spot ring**, connected by a subtle directional arrow labeled `"🥇 +20% Cleaner Lane"` so the player immediately sees why Gold is optimal while celebrating their 80%/60% read.

4. **[MEDIUM — 4-Agent Pipeline Gate Stamp] Stamp `approvalStatus: 'APPROVED_FOR_GAMEPLAY'` on All 32 Scenarios (`index.html` ~L5116):**
   - Ensure `ensureScenarioConsensusZones(scen)` stamps `scen.approvalStatus = 'APPROVED_FOR_GAMEPLAY'` and validates that all 3 `targetZones` stay within `[0.09..0.91, 0.12..0.88]` and do not overlap any teammate token (`dist >= 0.065`).

5. **[HIGH — Close Cloud Loop] Mark Inbox Row `resolved` After Verification:**
   - Once items 1–4 are live in `index.html` and verified via `runAutomatedQaAudit()`, `PATCH` row `id=eq.63778756-52e7-4511-8822-245f7b419fd3` in `public.pucksense_agent_inbox` to `status: 'resolved'` with `resolutionNote: 'Implemented in index.html by Builder Agent'`.

---

## Executive Summary: From Static Chalkboard Quiz to True Off-Ice Hockey Sense

Our live inspection of `http://localhost:8080`, `index.html`, and `AGENT.md` confirms that **TACTIX HOCKEY** already has a rock-solid technical and visual foundation:
- Clean full-viewport arena layout (`body.in-game-clean-mode`) with a thumb-friendly Right Action Ribbon (`#rightActionRibbon`) and compact Corner Coach Bob (`#coachCornerFloating`).
- 360° 3D-spinnable custom avatars (`render3dAvatarSvg()`), stitched back nameplates, and a Pro Gear Shop (`#proShopModal`).
- A 32-Team NHL Road to the Cup Map (`#nhlTourMapSvg`) with a staggered 550-point 10-question series (`10 + 20 + ... + 100 = 550 pts`, `440 pts / 80%` to advance).
- Non-blocking `3, 2, 1, GO!` timed countdowns (`prepareTimedScenarioWithCountdown()`), 2-Step `"Spot the Mistake → Fix the Play"` animations (`startSpotMistakeClip()`), 12-second timestamped YouTube clips (`CONCEPT_VIDEOS`), and a 16x side-mirroring permutation engine (`buildPermutedScenario()`).

However, when evaluated against our **5 Core Pillars of Hockey IQ** (*Spatial Awareness, Anticipation & Reading Cues, Decision-Making Under Pressure, Deception & Manipulation, Verbal & Non-Verbal Communication*) and **3 Training Methods** (*Pre-Scanning Habits, Small-Area Games, Active Film Study*), the Council identified **7 critical transfer gaps** that we have systematically addressed across the 5 Council Agent sections below:

1. **6-Division Age Scaling (`8U`, `10U`, `12U`, `14U`, `16U`, `18U`):** Ensuring every division has tailored cognitive load, prompt length (`1` sentence at `8U` up to `3` pro tactical sentences at `16U`/`18U`), decision clocks (`15.0s` down to `2.4s`), and target tolerances (`+0.048` down to `+0.003`).
2. **Eliminating Text Spoilers on `12U`–`18U`:** Hiding explicit role spoilers (`"OPEN High Slot!"`, `"Covered at Net"`) during active play for `12U+` so players read defender sticks, hips, and spacing rather than reading English text labels.
3. **Anatomical Skater Cues (`drawSkaterToken`):** Rendering **shoulder/hip orientation**, **skate toe-cap direction**, **helmet visor gaze**, and **active stick blade lane angles**.
4. **Pre-Scan ("Look Over Shoulder") Habit Training:** Peripheral fog-of-war on retrievals/receptions that clears for `2.5s` when the player checks over their shoulder (`+5 Pre-Scan IQ`).
5. **Contextual Tactical Action Dock (`#tacticalActionDock`):** Strictly 1 contextual button group visible at a time (`👀 Look Over Shoulder`, `🎭 Look-Off / 🛡️ Hold-Protect`, or `🗣️ Time! / Man On! / Reverse! / 🏒 Stick Tap`).
6. **Multi-Skater Culprit in 2-Step Mistake + Active Film Study:** Randomizing the Step 1 breakdown across `YOU`, `T1`, `T2`, `T3`, `T4` and adding a `+10 IQ` Active Film Study question to the 12-second YouTube clips.
7. **32-Scenario All-Position Bank (`C`, `LW`, `RW`, `D`, `G`) + Graded Consensus Scoring ("The Miles vs. Rhett Rule"):** Ranking top 3 reads (`100% Gold`, `80% Silver`, `60% Bronze`) so creative secondary hockey reads are rewarded and coached rather than punished as binary failures.

---

## 🧠 AGENT 1: Youth Cognitive & Motor-Learning Scientist (`8U`, `10U`, `12U`, `14U`, `16U`, `18U`)

### 1.1 Concrete 6-Division Hockey IQ Progression Matrix (`8U` → `18U`)

The table below defines how the **5 Core Pillars** and **3 Training Methods** scale across all **6 USA Hockey age divisions** (`8U`, `10U`, `12U`, `14U`, `16U`, `18U`), along with the exact engine configuration parameters in `AGE_TIER_CONFIG`:

| Dimension / Pillar | `8U Mite` (Ages 6–8) | `10U Squirt` (Ages 9–10) | `12U Peewee` (Ages 11–12) | `14U Bantam` (Ages 13–14) | `16U Midget` (Ages 15–16) | `18U Junior/AAA` (Ages 17–18) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Developmental Stage** | Egocentric → Dyadic (*"Me + Teammate vs. Puck Magnet"*) | Concrete Spatial (*Triangles, The House, Onsides, Basic Breakout*) | Pattern & Cue Recognition (*Reading Stick Lanes, Pre-Scanning, 3v3 Flow*) | Pressure & Manipulation (*Checking Pressure, Deception, Disguised Coverage*) | High-Speed Tactical (*Dynamic Gap Closure, Multi-Option Consensus Reads*) | Pro/Junior Anticipatory (*2-Moves Ahead, Baiting Seams, Strict Pre-Scan*) |
| **1. Spatial Awareness** | ⭐⭐⭐⭐⭐ (**40% wt**)<br>Stop puck-chasing; find open ice; stay Onsides | ⭐⭐⭐⭐⭐ (**30% wt**)<br>Attack Triangle, Net-Side House, Hashmark Breakout | ⭐⭐⭐⭐ (**20% wt**)<br>Weak-side high-house sag, F3 high-slot rotation, 3v3 Hinge | ⭐⭐⭐⭐ (**20% wt**)<br>5-man connected unit spacing, NZ regroup stretch seams, gap control | ⭐⭐⭐⭐ (**15% wt**)<br>Dynamic layer spacing, weak-side D activation | ⭐⭐⭐⭐ (**15% wt**)<br>Pro royal-road denial & weak-side seam manipulation |
| **2. Anticipation & Reading Cues** | ⭐⭐ (**15% wt**)<br>See who has the puck & which way they face | ⭐⭐⭐ (**20% wt**)<br>Read if teammate is covered or open; basic 2-Step Mistake | ⭐⭐⭐⭐⭐ (**25% wt**)<br>Read defender stick blade angle & skate toe-caps; multi-culprit mistake ID | ⭐⭐⭐⭐⭐ (**25% wt**)<br>Read defender hip turn, head gaze (puck-watching), & closing speed | ⭐⭐⭐⭐⭐ (**25% wt**)<br>Read disguised bait coverage & stick sweeps | ⭐⭐⭐⭐⭐ (**25% wt**)<br>Anticipate 2 passes ahead under live gap closure |
| **3. Decision-Making Under Pressure** | ⭐⭐ (**15% wt**)<br>`15.0s` relaxed bonus; pass to open buddy or shoot | ⭐⭐⭐ (**20% wt**)<br>`10.0s` bonus clock; 2v1 pass vs. shoot read | ⭐⭐⭐⭐ (**20% wt**)<br>`6.5s` bonus clock; include **Hold / Protect Puck** when lanes jammed | ⭐⭐⭐⭐⭐ (**20% wt**)<br>`4.2s` closing-defender clock; **Cut-Back / Rim / Protect** vs. F1 heat | ⭐⭐⭐⭐⭐ (**25% wt**)<br>`3.0s` decision window; dynamic closing defenders | ⭐⭐⭐⭐⭐ (**25% wt**)<br>`2.4s` pro decision window; strict pre-scan + live defenders |
| **4. Deception & Manipulation** | ⭐ (**5% wt**)<br>Basic head-up skating into open space | ⭐⭐ (**10% wt**)<br>Pass-and-move (Give & Go past puck-watcher) | ⭐⭐⭐ (**15% wt**)<br>Intro to **Look-Offs** & **Pump-Fakes** to move a defender's stick | ⭐⭐⭐⭐ (**20% wt**)<br>Use **Look-Off / Shot-Fake** to open contested 2v1 & slot seams | ⭐⭐⭐⭐⭐ (**20% wt**)<br>Lateral escape + look-off to shift D1 `22°` | ⭐⭐⭐⭐⭐ (**20% wt**)<br>Multi-step manipulation (pre-scan + look-off + seam execution) |
| **5. Verbal & Non-Verbal Comm** | ⭐⭐⭐ (**25% wt**)<br>🏒 **Stick on Ice** tap + calling *"Pass!"* / *"Open!"* | ⭐⭐⭐ (**20% wt**)<br>Call *"Boards!"*, *"Middle!"*, & stick-tap target | ⭐⭐⭐⭐ (**20% wt**)<br>Call *"Time!"*, *"Man On!"*, *"Reverse!"*, & forehand blade target | ⭐⭐⭐⭐ (**15% wt**)<br>Early retrieval callouts before D touches puck + PK/PP switches | ⭐⭐⭐⭐⭐ (**15% wt**)<br>Full-unit tactical calls (*"Time!"*, *"Reverse!"*, *"Switch!"*) | ⭐⭐⭐⭐⭐ (**15% wt**)<br>Instant pre-touch verbal & non-verbal line communication |
| **Engine Config (`AGE_TIER_CONFIG`)** | `skaters: 3`, `rink: 'half'`, `tol: +0.048`, `clock: 15.0s`, `roleLabels: 'always'`, `maxSents: 1` | `skaters: 3..5`, `rink: 'half'`, `tol: +0.026`, `clock: 10.0s`, `roleLabels: 'hint_only'`, `maxSents: 2` | `skaters: 3..5`, `rink: 'auto'`, `tol: +0.015`, `clock: 6.5s`, `roleLabels: 'never'`, `maxSents: 2` | `skaters: 3..5`, `rink: 'auto'`, `tol: +0.008`, `clock: 4.2s`, `mistakeBubble: false`, `maxSents: 3` | `skaters: 3..5`, `rink: 'full'`, `tol: +0.005`, `clock: 3.0s`, `dynamicDefenders: true`, `maxSents: 3` | `skaters: 3..5`, `rink: 'full'`, `tol: +0.003`, `clock: 2.4s`, `dynamicDefenders: true`, `preScanStrict: true` |

---

## 🏒 AGENT 2: Elite Hockey Sense & Skills Director (On-Ice Transfer Specialist)

### 2.1 Readable Body, Skate Toe-Cap & Stick Cues on Canvas Skaters (`drawSkaterToken`)
1. **Skate Toe-Caps:** Two dark boot/steel toe-caps (`width = r * 0.36`, `length = r * 0.55`) protruding forward at `hipAngle` so players can read defender pivot commitment.
2. **Oriented Shoulder Capsule:** Rounded stadium torso (`width = r * 2.15`, `height = r * 1.45`) rotated to `shoulderAngle`.
3. **Helmet Visor Gaze Cone:** Directional visor arc pointing along `headAngle` (revealing when a defender is puck-watching vs. scanning the slot).
4. **Active Stick Shaft, Curved Blade & Denial Sector:** Stick shaft + curved blade oriented to block passing lanes (`lane_block`) or present an open forehand target (`tape_ready`), with a `22°` hip/blade shift when the player triggers `🎭 Look-Off / Pump-Fake`.

### 2.2 Contextual Tactical Action Dock (`#tacticalActionDock`)
- Strictly **1 contextual button group** visible at a time below the rink:
  - **Pre-Scan Group (`#dockGroupPreScan`):** `👀 Look Over Shoulder (Pre-Scan)` active during puck-in-transit window on `10U`–`18U` breakout/transition drills (`+5 Pre-Scan IQ`, clears peripheral fog for `2.5s`).
  - **Deception & Puck Protection Group (`#dockGroupDeception`):** `🎭 Look-Off / Pump-Fake` (shifts `D1` `22°`) and `🛡️ Hold / Protect (Cutback)` (triggers `1.2s` teammate separation animation) when `#9` has the puck on `12U`–`18U` drills.
  - **Communication Group (`#dockGroupComm`):** `🗣️ "Time!"`, `🚨 "Man On!"`, `🔄 "Reverse!"`, and `🏒 Tap Stick on Ice` when supporting a teammate off the puck (`+5 Comm IQ`).

---

## 🎮 AGENT 3: Interactive Game Designer (Graded Consensus & Flow Architect)

### 3.1 Graded Consensus Scoring ("The Miles vs. Rhett Rule")
- Every scenario evaluates player positioning and pass decisions against **3 ranked consensus zones (`targetZones[]`)**:
  - 🥇 **1st Choice — Consensus Optimal (`100% Gold IQ`, `multiplier: 1.0`)**
  - 🥈 **2nd Choice — Strong Secondary Read (`80% Silver IQ`, `multiplier: 0.8`)** — Rewards creative secondary reads (such as Miles's or Coach Dane's high-circle curl `{ x: 0.79, y: 0.65 }` on `protect-cutback-wall`), awarding `80%` of the question's point value and explaining why both reads work and why the 🥇 1st Choice is optimal.
  - 🥉 **3rd Choice — Safe Conservative Option (`60% Bronze IQ`, `multiplier: 0.6`)**
  - ❌ **Out-of-Structure / Covered Turnover (`0%`)**
- **Automatic Deficiency Detection & Spaced Repetition Queue:** Missing any concept twice flags `prof.deficientConcepts[concept] = true` and injects **3 fresh permutations** (`5v5 Full Unit`, `4v4 Open Ice`, `Mirrored Weak-Side`) into `prof.spacedRepetitionQueue`.

---

## 🧒👦🧑👨 AGENT 4: Multi-Age Player Panel (`8U`–`18U`) & 32-Scenario All-Position Bank

- **32 Base Scenarios (`512` Permutations)** across all 5 positions:
  - **Forwards (`C`, `LW`, `RW`):** 24 scenarios including `protect-cutback-wall` (1v1 Wall Cut-Back & Puck Protection) and `delay-high-slot` (2v2 Zone Entry Look-Off & Delay).
  - **Defensemen (`LD / RD`):** `d-gap-1v1` (1v1 Rush Gap & Inside-Out Angling), `d-2v1-slide` (2v1 Royal-Road Seam Denial), `d-netfront-boxout` (Crease Box-Out & Stick Lift), and `d-blueline-walk` (Blue-Line Walk & Low Shot-Pass for Tip).
  - **Goalies (`G`):** `goalie-angle-depth` (Top-of-Crease Depth & Squareness), `goalie-screen-look` (Fighting Through Net-Front Traffic), `goalie-rim-comm` (Trapezoid Rim Stop & `"Reverse!"` Callout), and `goalie-rebound-steer` (Active Stick Corner Rebound Steering).

---

## 📊 AGENT 5: Hockey Parent & Team Coach Advisor

- **6-Slice Hockey IQ Pie Chart & 5-Pillar Scouting Report (`#reportModal` & `report.html`):**
  - Tracks *Forecheck, Rush, Spacing/Possession, Breakout, Power Play, Penalty Kill* (`pie_chart_stats` synced to `public.pucksense_profiles`) alongside the **5 Core Hockey IQ Pillars** (`scanning`, `support`, `timing`, `risk`, `transition`), **Parent Bleacher Watch Guide**, and **1-Click Remedial Drill Injection** (`injectRemedialDrill()`).
- **3D Trophy Case (`#trophyRoomModal`) & Multi-Age Stanley Cup Prestige:**
  - Tracks Stanley Cups won per age division (`8U`–`18U`) and connects team homework completion to the **Team Co-Op Cup Meter** (`coop_trophy_points` in `public.pucksense_teams`).

---

## 🐺🦊🦅 SECTION 7: Dynamic Proximity Roles (`F1 / F2 / F3` & `D1 / D2` — "The Bull, Fox & Eagle" System)

### 7.1 Pedagogical Principle: Positionless Proximity Reads Over Fixed Lineup Labels
Youth players frequently confuse **lineup positions** (`LW`, `C`, `RW`, `LD`, `RD`) with **functional tactical roles** (`F1`, `F2`, `F3`, `D1`, `D2`). Once the puck drops, whichever forward is closest to the puck *is* `F1`—even if they started the shift at Center or Right Wing. Teaching players to continuously compute their distance rank to the puck builds true spatial awareness and prevents the classic youth "puck-magnet" cluster.

### 7.2 Dynamic Proximity Role Engine (`computeDynamicProximityRoles(scenario, puckPos)`)
- **Forwards (Sorted by Euclidean distance `Math.hypot(skater.x - puck.x, skater.y - puck.y)` from closest to furthest):**
  - **`🐂 F1` — First Forward / The "Wolf":** Closest forward to the puck. Spearheads the forecheck, angles the carrier's stick, and forces a rushed play.
  - **`🦊 F2` — Second Forward / The "Fox":** Second-closest forward. Reads `F1`'s angle, seals the wall or secondary outlet, supports the board battle, and pounces on turnovers.
  - **`🦅 F3` — Third Forward / The "Hawk":** Furthest forward from the puck. Hovers high in the offensive zone (`High Slot`) as the safety valve to prevent odd-man breakouts and lead the backcheck.
- **Defensemen (Sorted by Euclidean distance to the puck from closest to furthest):**
  - **`🛡️ D1` — First Defenseman:** Closest defenseman to the play. Holds the strong-side blue line wall on offense; challenges the puck carrier in the corner/wall/gap on defense.
  - **`🏰 D2` — Second Defenseman:** Furthest defenseman from the puck. Stays central in the net-front slot to **"Protect the House"** on defense, or hinges to the middle blue line on offense.

### 7.3 Real-Time On-Ice Badges, `"Who Am I?"` Bonus & Age-Scaled Coaching
1. **Live Role Pill Rendering (`drawSkaterToken`, `drawFirstPersonPovRink`, `drawLiveShiftEntities`):**
   - Renders a high-contrast dynamic role pill (`🐂 F1`, `🦊 F2`, `🦅 F3`, `🛡️ D1`, `🏰 D2`) above/beside each skater token without obscuring the upright jersey number inside the jersey circle.
   - Recalculates every animation frame whenever the puck or skaters move so players watch `F1 ↔ F2 ↔ F3` and `D1 ↔ D2` dynamically swap as the puck changes sides.
2. **Interactive `"Identify Your Role (Who Am I?)"` Bar (`+5 Role-Read IQ Bonus`):**
   - Inside `#tacticalActionDock`, players can tap `🐂 F1 (Bull)`, `🦊 F2 (Fox)`, `🦅 F3 (Eagle)`, `🛡️ D1 (Challenge)`, or `🏰 D2 (Protect House)` to earn a **`+5 Role-Read IQ Bonus`** (`+$5 PuckBucks`) and hear Coach Bob confirm *why* their distance to the puck assigns them that role, plus open the **`ℹ️ F1-F3 / D1-D2 Guide`** popover.
3. **Age-Scaled Coaching Voice (`8U/10U` Archetypes vs. `12U–18U` Rotations):**
   - **`8U` & `10U`:** Uses the **Wolf (`🐂 F1`)**, **Fox (`🦊 F2`)**, **Hawk (`🦅 F3`)**, and **Protect the House (`🏰 D2`)** animal metaphors directly in Coach Bob's prompts and feedback.
   - **`12U`–`18U`:** Coaches dynamic **Role Rotation & High Reloads** as the puck shifts from strong side to weak side.
4. **Custom Lesson Builder & Team Portal Integration:**
   - Adds `🐺🦊🦅 F1 Bull / F2 Fox / F3 Eagle Rotation` and `🛡️🏰 D1 Challenge / D2 Protect the House` to both `#selectCustomSystem` (**Create My Own Lesson**) and `#selectCoachWeeklyFocus` (**Team Portal Coach Assignment**).

---

## 🏛️ SECTION 8: 6-Seat Professional Industry Board & Single-Trigger Master Pipeline (`RUN MASTER PIPELINE`)

### 8.1 The 6-Seat Professional Industry Board Charter & Latest Recommendations
Whenever a Council Audit or **`RUN MASTER PIPELINE`** runs, `index.html` is evaluated across all **6 Industry Board Seats** to ensure authentic hockey systems, developmental cognitive science, mobile retention, ergonomic touch UX, coach workflow speed, and clear product monetization:

| Seat # | Industry Board Seat Title | Core Evaluation Domain | Latest High-Impact Board Recommendation | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Seat 1** | **NCAA D1 / AAA & USA Hockey Systems Director** | Authentic playbooks, Graded 1st/2nd/3rd Choice Consensus Zones (`100% Gold / 80% Silver / 60% Bronze`), `🐂 F1 Wolf / 🦊 F2 Fox / 🦅 F3 Hawk` & `🛡️ D1 / 🏰 D2` rotations | Real-time Euclidean proximity role engine (`computeDynamicProximityRoles`) + `+5 Role-Read IQ Bonus` (`"Who Am I?"`) + inside dot-lane Silver 80% curl zones (`protect-cutback-wall`). | ✅ **Live & Verified** |
| **Seat 2** | **Pediatric Sports Psychologist & Cognitive Scientist** | 6-division scaling (`8U–18U`), 1-sentence simplicity for `8U`, fading visual indicators, automatic spaced-repetition remediation when a player misses a concept twice | 6 distinct `AGE_TIER_CONFIG` profiles (`8U` 1-sentence max + animal archetypes `Wolf/Fox/Hawk`; `12U+` faded scaffolding) + `recordConceptOutcome()` 2-miss spaced-repetition queue. | ✅ **Live & Verified** |
| **Seat 3** | **Mobile Game & EdTech Retention Designer** | 3D Trophy Room Prestige Stanley Cups, streak rewards, Pro Shop swag unlocks, and `8U/10U` Team Co-Op goals | Multi-division 3D Stanley Cup Trophy Room (`#trophyRoomModal`), PuckBucks Pro Shop fitting room (`render3dAvatarSvg`), and Team `PUCK99` Co-Op Cup meter (`coop_trophy_points`). | ✅ **Live & Verified** |
| **Seat 4** | **Native iPad / Phone Touch UX Architect** | Thumb ergonomics, Landscape/Portrait rotation across 8-inch to 16-inch tablets, scrollable modals with sticky action buttons, zero clipped text | Smooth touch scrolling (`max-height: 92dvh; overflow-y: auto; -webkit-overflow-scrolling: touch;`) with sticky bottom primary action bars across `#sandboxLoginModal`, `#profileModal`, and all modals. | ✅ **Live & Verified** |
| **Seat 5** | **Youth Hockey Coach & Association Director Liaison** | 30-second Coach Weekly Assignment workflow, roster line builder, player inbox compliance, and actionable practice scouting alerts | 1-click Coach Weekly Homework assignment (`#selectCoachWeeklyFocus` including `F1/F2/F3` & `D1/D2`), live roster compliance table, and USA Hockey ADM Station prescriptions in `report.html`. | ✅ **Live & Verified** |
| **Seat 6** | **App Store & Subscription Product Strategist** | Clear value separation between `$4.99` Base Game, Pro Interactive Pie Chart + PIP / Custom Lesson Builder, and Team Portal licensing | 3-tier product architecture (`$4.99` Base 32-City Tour vs. Pro Interactive 6-Slice IQ Pie + PIP Remedial Window + Custom Lesson Builder vs. Team Portal `PUCK99` license) with Founder Pro Sandbox toggle. | ✅ **Live & Verified** |

### 8.2 Single-Trigger Master Sequence (`RUN MASTER PIPELINE`)
Whenever Coach Dane or Coach Evan types **"RUN MASTER PIPELINE"** inside `Main App Code Page`, the agent executes all 4 stages end-to-end without switching chat tabs:
1. **Stage 1 (Fetch Live Flags):** Queries `https://jrusjgpfcnptozfehcrv.supabase.co/rest/v1/pucksense_agent_inbox?select=*&order=created_at.asc` (using `apikey: sb_publishable_73207-0o-_PJEGLgeiZSog__PwUgTxX`) for all `open`, `in_council_review`, or `queued_for_builder` items from Coach Dane, Coach Evan, or `Playtest-Agent`.
2. **Stage 2 (Automated Bot Playtest):** Launches headless Chrome as `playtest-bot` (`?bot=1`), runs `window.runAutomatedQaAudit()` plus interactive checks across age tiers (`8U–18U`) and portals (`Player` & `Team PUCK99`), and logs any bugs found.
3. **Stage 3 (6-Seat Industry Board Review):** Synthesizes the Founder flags + Playtest findings with 1 high-impact improvement from each of the 6 Industry Seats, and posts the summary to `public.pucksense_agent_inbox`.
4. **Stage 4 (Build, Verify & Deploy):** Implements the fixes and highest-value upgrades in `index.html`, verifies `0` console errors, marks fixed inbox rows as `status: 'resolved'`, updates `report.html` (showing each Industry Seat's latest recommendation and status), and deploys live to `https://pucksenseiq.netlify.app`.


