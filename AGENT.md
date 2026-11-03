# AGENT.md — Antigravity Builder & QA Handoff Specification
**Project Name:** TACTIX HOCKEY — PLAY. LEARN. DOMINATE. (`HOCKEY IQ & STRATEGY PLATFORM` with Coach Bob)  
**Live GitHub Pages Deployment (Free & Unlimited Deploys):** `https://danebekkedahl.github.io/tactix-hockey/` (Report: `https://danebekkedahl.github.io/tactix-hockey/report.html`)  
**Local Dev Server:** `http://localhost:8080`  
**Architecture:** Self-Contained Single-Page Web Application + Installable PWA (`index.html`, `report.html`, `CONTEXT.md`, `assets/tactix-logo.png`, `assets/coach-bob.png`, `manifest.json`, `sw.js`, `deploy-github-pages.js`)

> [!IMPORTANT]
> **Mandatory Multi-Agent Reading Rule, `CONTEXT.md` Fast-Map & Single-Trigger Pipelines (`RUN NIGHTLY AUTOPILOT` & `RUN MASTER PIPELINE`):**
> 1. **Read `CONTEXT.md` First:** All Antigravity agents (`Main App Code Page`, `PuckSense IQ Learning Council Report`, and `Youth Hockey Playtest Report`) **MUST** read `CONTEXT.md` (the ~100-line architectural index of all 6 Supabase tables, DOM IDs, and core functions) alongside `FOUNDER_VISION_NOTES.md`, `LEARNING_COUNCIL_REPORT.md`, and `PLAYTEST_REPORT.md` before planning, auditing, or modifying `index.html`.
> 2. Whenever the user types **`RUN NIGHTLY AUTOPILOT`** (or **`RUN MASTER PIPELINE`**) inside `Main App Code Page`, the agent **MUST** automatically execute all 4 stages from start to finish without pausing for confirmation between stages (Stage 1: Autonomous 5-Persona & 8-Seat Field Playtest Bot `deep_playtest_audit.js`; Stage 2: 8-Seat Professional Industry, Teaching Strategy & Engineering Board Review `Council-Agent`; Stage 3: 3-Bot Scenario Factory Expansion `generate-tactix-bank.js`; Stage 4: Main App Code Build, Verification & Live GitHub Pages Deploy to `https://danebekkedahl.github.io/tactix-hockey/`). See **Section 7.1–7.3** below for the full specification.

---

## 1. Project Overview & Target Device Experience
**PuckSense IQ** is an interactive off-ice cognitive training game and coaching platform designed to build real-world "Hockey IQ" (spatial awareness, puck support, defensive slot protection, breakout reads, forecheck angling, odd-man rush decision-making, and special teams positioning) in youth hockey players across USA Hockey age divisions (`8U Mite`, `10U Squirt`, `12U Peewee`, `14U Bantam`, and `16U/18U`).

### Target Device & UX Layout
- **Responsive Cross-Device Design (Phones, iPads/Tablets, Laptops/Desktops):**
  - Uses a responsive 12-column Tailwind CSS grid (`lg:grid-cols-12` with an 8-column Rink Canvas arena on the left and a 4-column Action & Series Progress Deck on the right).
  - **Clean Full-Viewport Arena Mode (`body.in-game-clean-mode`) + Right-Side Action Ribbon (`#rightActionRibbon`) + Corner Coach Badge (`#coachCornerFloating`):** Whenever `state.view === 'game'`, the app automatically enters a distraction-free `100vw × 100dvh` layout where `<header>`, `#gameTopSubheader`, `#coachCornerWidget`, and `#rightPanelDeck` are hidden so **only** the Full Ice Sheet (`#rinkCanvasContainer`) and the Right-Side Action Ribbon (`#rightActionRibbon`) fill the viewport cleanly on phones, tablets, and desktops. The Right-Side Action Ribbon provides instant one-thumb access to `Check My Position`, `Next Play`, `🔍 2-Step: ON/OFF`, `📺 12s Pro Clip`, `Hint`, `Reset`, `3D POV`, `Full Ice`, and `🗺️ Tour Map`.
  - **360° 3D Spinning Custom Avatars & Pro Gear Shop Fitting Room (`render3dAvatarSvg()`):** Players customize Person (`Boy`/`Girl`) or Mascot (`Hawk`, `Bear`, `Wolf`, `Shark`), Hair style, Hair color, Skin tone, Jersey color, and Last Name on the back of their `#9` jersey (`#inputPlayerLastName`). Avatars spin 360° in the Locker Room and Pro Gear Shop (where players preview and equip Sticks, Helmets, Visors, Skates, and Cellies) and appear as mini avatars on the 32-Team NHL Tour Map.
  - **Team Program, Family, & Individual Registration + Coach Invites (`#teamManagerModal`):** Supports Individual, Family Group, and Team Program modes with a Team Leaderboard, all team participants plotted on the 32-Team NHL Tour Map (`#mapTeamAvatarsGroup`), and a Coach/Manager Invite sender.
  - **Town Tactical Briefing (`#cityIntroModal`) & Quick Tutorial (`#tutorialModal`):** Starting a new NHL city opens a Town Tactical Focus Briefing with a `Start Drill #1 (Drop the Puck) ▶` button before Question 1 begins. New players can also step through a 4-card interactive tutorial.
  - **Timed Scenario Coach Explanation + `3, 2, 1, GO!` Countdown + Non-Blocking Speed Bonus Clock (`prepareTimedScenarioWithCountdown()`, `run321Countdown()`, & `startDecisionClock()`):** On timed scenarios (`pass_decision`, `pov`, and Stage 2 `read`), the decision clock never runs while Coach Mack is explaining the drill. `CoachVoice.speak()` uses an `onComplete` callback (with a minimum `5.2s` setup window if speech is muted/blocked) before triggering a visual & audio `3, 2, 1, GO!` countdown (`#countdownOverlay`). Once `GO!` finishes, the Speed Bonus Clock starts (`12.0s` for `10U`, `10.0s` for `12U+`). Reaching `0.0s` **never** auto-fails or locks out the player before they make a move—answering before `0.0s` awards a `⚡ +10 IQ Pts & +$15 PuckBucks` Speed Bonus.
  - **2-Step `"Spot the Mistake → Fix the Play"` Mode for `10U–18U` (`startSpotMistakeClip()` & `completeSpotMistakeStep1()`):** On positioning drills for `10U–18U` divisions, players first watch a 3-second animated breakdown clip showing a classic youth mistake (e.g., chasing behind the net, bunching the puck carrier, or crossing the blue line offsides) with a red dashed mistake path and callout bubble. Step 1 asks the player to tap the skater who blew their coverage (`+5 IQ Pts & +$5 PuckBucks`), and Step 2 (`🛠️ Fix the Play`) lets them drag `#9` away from the `❌ MISTAKE SPOT` ghost ring into the sweet spot. Can be toggled anytime via `🔍 2-Step: ON/OFF` (`#btnRibbonMistakeMode`).
  - **Crisp 12-Second Timestamped YouTube Pro Clips (`CONCEPT_VIDEOS` & `openConceptVideoModal()`):** All 7 Hockey IQ concept pillars use official YouTube coaching and NHL clips bounded to crisp 12-second `start=` and `end=` parameters (`endSec = startSec + 12`) with `referrerpolicy="strict-origin-when-cross-origin"` for instant, free, legal playback via the `📺 12s Pro Clip` Ribbon button (`#btnRibbonVideo`) or the on-ice post-answer banner (`#btnOnIceWatchVideo`).
  - **Clean Goal Lights (`#goalLampsOverlay`):** Flashing red goal lamps celebrate correct plays across the top of the ice sheet without any `"GOAL LAMP"` text label cluttering the glass.
  - **Clean Audio-First UX with Toggleable Comic Speech Bubble:** Coach Mack automatically narrates each play setup and coaching adjustment out loud using the Web Speech API (`window.speechSynthesis`), prioritizing natural/neural system voices (`SoundFX.pickNaturalVoice()`). Written instructions are hidden by default to prevent visual clutter and can be toggled on/off via the **💬 Speech Bubble: ON/OFF** button (`#btnToggleSpeechBubble`) or replayed via **🔊 Speak Again** (`#btnReplayVoice`).
- **Touch, Mouse & Keyboard Controls:**
  - **Pointer Events (`pointerdown`, `pointermove`, `pointerup`):** Unified touch and mouse input on `#rinkCanvas` with `touch-action: none` to prevent accidental page scrolling while dragging skaters on mobile/iPad.
  - **Live Shift Controls:** Supports both physical keyboard input (`WASD` or Arrow keys to skate, `Space` to Pass/Call for Puck, `E`/`Enter` to Shoot/Stick Check) and an on-screen touch D-Pad (`.dpad-btn`) + action buttons (`#btnActionPass`, `#btnActionShoot`).

---

## 2. Core Gameplay Mechanics, Dynamic Positioning Logic & Hockey IQ Concepts

### 5 Interactive Gameplay Mechanics
1. **Off-Puck Positioning (`mechanic: 'position'`, Stage 1 "Spot the Ice"):**
   - The player drags or taps to move their highlighted gold skater (`YOU #9`) to the optimal tactical support spot (`scen.targetSpot = { x, y, radius }`).
   - Grading checks both Euclidean distance to `targetSpot` (scaled by difficulty tolerance) AND anti-bunching spacing (penalizing players if they stand within `0.058` normalized units of a teammate).
2. **On-Puck Pass/Shoot Decision Maker (`mechanic: 'pass_decision'`):**
   - `YOU (#9)` starts with the puck (`puckHolder: 'YOU'`). Opponents pressure or shift coverage, leaving specific teammates covered and one teammate (or the Goal Net) open.
   - Tapping directly on the open teammate or net on the canvas immediately fires the puck and grades the decision.
   - On higher age levels (`10U+`) and later series questions (`Q5+`), a live countdown clock (`#decisionTimerWrap`, `startDecisionClock()`) forces quick reads before defenders close the lane.
3. **First-Person 3D "In the Skates" POV (`mechanic: 'pov'` & `#btnTogglePovMode`):**
   - `drawFirstPersonPovRink()` switches the canvas from a top-down chalkboard into a scenario-aware 3D first-person ice-level view looking out from the corner with 3D perspective boards, glass, goal crease, goalie, foreground stick blade, and 3D skaters. Players scan past tied-up teammates and tap the uncovered teammate in the high slot (or the Goal Net when shooting).
4. **Freeze-Frame Read & React (`state.mode === 'read'`, Stage 2):**
   - Clicking `▶️ Roll Live Play & Freeze at Read` animates skaters and puck movement for `900ms`, freezes the frame, starts the Quick Read Clock, and presents 3 multiple-choice tactical reads (`#readChoicesContainer`).
5. **Live Playable Shift (`state.mode === 'live'`, Stage 3):**
   - A 45-second real-time physics loop (`updateLivePhysics()`) where the player skates in real time while a live **Hockey IQ Meter** (`state.liveIqRating`, `0–100%`) dynamically rewards triangle spacing and net-side slot protection and penalizes puck-chasing/bunching.

### Synchronized Neon-Green Ice Highlights & Goal Lamp Celebrations
- While Coach Mack speaks (`CoachVoice.speak()`), a `requestAnimationFrame` loop (`CoachVoice.activeHighlightPhase`) pulses glowing **Neon-Green radar rings (`#22c55e`)** directly on the ice in 3 synchronized phases:
  - **Phase 1 (`0–2.2s`):** Highlights the `PUCK CARRIER` and puck.
  - **Phase 2 (`2.2–4.4s`):** Highlights `YOU (#9)`.
  - **Phase 3 (`4.4–6.6s`):** Highlights the `KEY TARGET` / outlet teammate.
- When a player answers correctly, synthesized goal horns fire (`SoundFX.playGoalHorn()`) and **Flashing Red Goal Scoring Lamps** (`#goalLampsOverlay`) animate across the top of the rink alongside a **📺 Watch Video Example** button (`#btnWatchVideoExample`) wired to multi-tagged YouTube NHL/coaching clips with `start=` and `end=` timestamps (`CONCEPT_VIDEOS`).

### 7 Priority Hockey IQ Concept Pillars (`CONCEPT_META`)
1. `basics` — **Hockey 101 Basics** (Identifying Center, Left/Right Point Defensemen inside the offensive blue line, and tagging up Onsides at the blue line).
2. `spacing` — **Spacing & Cycle** (Offensive zone attack triangle, escaping corner traffic, middle dot-lane support, corner cycle reads).
3. `house` — **D-Zone "The House"** (Net-side positioning between check and goalie, stick in passing lanes, weak-side winger sagging into the High House, Box+1).
4. `breakout` — **Breakouts & Regroups** (Strong-side winger on hashmarks wall, Center "Low and Slow" curl underneath the dot, D-to-D reverse escape when strong wing is jumped, Neutral Zone D-to-D hinge regroup & weak-side seam pass).
5. `rush` — **Odd-Man Rushes & Pass/Shoot Reads** (2-on-1 wide back-post drive, 2-on-1 reading defender's commitment to dish vs. shoot, 3-on-2 F3 high-slot trailer delay).
6. `forecheck` — **Forecheck & Backcheck** (2-1-2 "Dog-Fox-Hawk" F1 angling & F2 sealing the strong wall, 1-2-2, backchecking straight down the middle gut to lock up the high trailer).
7. `transition` — **Special Teams & 3v3 Transitions** (3v3 give-and-go, 3v3 hinge escape valve, 5-on-4 Power Play Umbrella flank one-timer, 4-on-5 Penalty Kill tight box seam protection).

---

## 3. Code Structure: Difficulty, Skater Counts, Clickable Options & Ice Zone Coordinate Math

### Staggered 550-Point Series Math & 80% Advancement Rule
- **32 NHL Cities (`NHL_CITIES`):** All 32 NHL teams are plotted on the interactive USA & Canada SVG map (`#nhlTourMapSvg`).
- **Staggered Question Values (`getQuestionPointValue()`):** Each city is a 10-question series where Question `N` is worth `N * 10` IQ Points (`10 + 20 + 30 + 40 + 50 + 60 + 70 + 80 + 90 + 100 = 550 Total Series Points`).
- **80% Threshold (`440 / 550 Points`):** Players must score at least `440` points (`80%`) to conquer a city and unlock the next NHL stop.
- **Anti-Farming Lock (`state.questionAnswered`):** Each question locks after a single submission—players cannot repeat Question 1 to farm points and must advance through all 10 questions.
- **2-Hint Cap (`state.hintsRemaining = 2`):** Players get a maximum of 2 Coach Hints per 10-question series (`#btnShowHint`).
- **16x Permutation Engine (`buildPermutedScenario()` & `swapDirectionalTerms()`):** When a series is replayed or regenerated after falling below 80%, the engine mirrors top/bottom strong/weak sides (`1.0 - pt.y`), swaps directional terms (`Left`/`Right`, `LW`/`RW`, `LD`/`RD`, `top boards`/`bottom boards`), locks anatomical Hockey 101 side drills (`lockSide: true`), and applies subtle spatial jitter while keeping numeric jersey labels (`#14`, `#19`, `#4`, `#7`) locked so spoken audio never mismatches on-ice numbers.

### Normalized Ice Coordinate System (`normToCanvas` & `canvasToNorm`)
All scenario coordinates are authored in normalized Full-Ice space (`nx` in `[0.0 .. 1.0]`, `ny` in `[0.0 .. 1.0]`):
- `x = 0.08`: Left Goal Line (Defensive Net)
- `x = 0.38`: Left (Defensive) Blue Line
- `x = 0.50`: Center Red Line
- `x = 0.62`: Right (Offensive) Blue Line
- `x = 0.65–0.66`: Standard Offensive Point Defenseman position (strictly inside the `0.62` offensive blue line)
- `x = 0.92`: Right Goal Line (Offensive Net)

When **Half Ice** (`state.rinkType === 'half'`) is active:
- `zone === 'defense'` zooms the viewport into `nx` in `[0.04 .. 0.51]` (showing the Defensive Net at `0.08`, Defensive Blue Line at `0.38`, and Center Red Line at the right edge `0.50`).
- `zone === 'offense'` zooms the viewport into `nx` in `[0.49 .. 0.96]` (showing the Center Red Line at the left edge `0.50`, Offensive Blue Line clearly inside the view at `0.62`, Point Defensemen inside the zone at `0.66`, and Offensive Net at `0.92`).

### Auto-Configuration vs. Coach Sandbox & Pro Self-Eval Lab
- During normal **Road to the Cup** play, `loadScenario()` automatically sets `state.skatersPerSide` (`3`, `4`, or `5`, plus `5v4 PP` and `4v5 PK` overrides) and `state.rinkType` (`half` or `full`) from `scen.autoSkaters` and `scen.autoRink`, while respecting persistent Pro Lab overrides (`state.customViewOverride` and `state.customIceOverride`), and hides "The House" / "Triangle" overlays during the question for `10U+` players until the answer is revealed.
- Clicking **⚙️ Settings** (`#btnToggleSettingsDrawer`) opens manual coach overrides and the **🤖 Run Automated QA & Tag Audit** tool (`runAutomatedQaAudit()`).
- Clicking **⭐ Upgrade** (`#btnOpenUpgradeModal`) opens the **Pro Custom System & Position Self-Eval Lab**, allowing players or coaches to filter by system (`forecheck`, `breakout`, `house`, `spacing`, `rush`, `transition`), position (`C`, `LW`, `RW`, `D`), camera mode (`plan` vs `pov`), and ice format (`half` vs `full`) across all 10 plays of a custom self-eval series.

---

## 4. Known Issues, Deployment Notes & Next-Stage Roadmap for Antigravity Agents

1. **Netlify Visibility Setting (`pucksenseiq.netlify.app`):**
   - Newer Netlify credit-based Free accounts default new drops to *Private* (`"This site is private — Sign in with an invited Netlify account"`). Ensure **Project configuration → General → Visitor access → Project visibility** remains set to **Public** when deploying new builds.
2. **Voice Synthesis Cross-Browser Consistency:**
   - Currently uses the browser's native `window.speechSynthesis` with `SoundFX.pickNaturalVoice()` to select neural/natural system voices. While smooth on modern iOS/macOS/Edge/Chrome, replacing or supplementing `SpeechSynthesisUtterance` with pre-generated AI voice MP3 sprites (e.g., ElevenLabs) will guarantee identical locker-room coach voice quality across all devices.
3. **Expanding the Scenario & System Bank:**
   - Currently includes 22 hand-crafted base scenarios (352 permuted variations) across all 7 pillars. Future sprints in Antigravity should expand the `SCENARIOS` array with additional position-specific perspectives (`C`, `LW`, `RW`, `LD`, `RD`) for `1-3-1`, `Left-Wing Lock`, `Box+1`, and `Wheel/Rim/Reverse` breakouts using the public Weiss Tech / USA Hockey ADM diagrams.
4. **Backend API / IP Protection Before Commercial Launch:**
   - All scenario JSON and permutation logic currently reside client-side in `index.html`. Before commercial release, migrate `SCENARIOS` behind a serverless endpoint (e.g., Netlify Functions or Supabase) so client browsers fetch one active play at a time.

---

## 5. Local Launch & Automated Testing Commands

Run the application locally from the project root directory using Python's built-in HTTP server or Node's `npx serve` (required so `manifest.json` and `sw.js` load over `http://localhost`):

```bash
# Option A: Python 3 built-in HTTP server (Port 8080)
python3 -m http.server 8080

# Option B: Node.js static server
npx serve -l 8080 .
```

Then open **`http://localhost:8080`** in Chrome, Safari, Edge, or your Antigravity automated browser runner. To run the built-in automated QA verification inside the browser, click **⚙️ (Settings)** in the top-right header and click **🤖 Run Automated QA & Tag Audit** (or invoke `runAutomatedQaAudit()` directly from the browser console).

---

## 6. Live Supabase Cloud Backend, Multi-Login Sandbox & 3-Agent Shared Inbox Pipeline

### 6.1 Live Supabase REST Connection
- **`SUPABASE_URL`**: `'https://jrusjgpfcnptozfehcrv.supabase.co'`
- **`SUPABASE_KEY`**: `'sb_publishable_73207-0o-_PJEGLgeiZSog__PwUgTxX'`
- **Standard REST Headers**:
  ```json
  {
    "apikey": "sb_publishable_73207-0o-_PJEGLgeiZSog__PwUgTxX",
    "Authorization": "Bearer sb_publishable_73207-0o-_PJEGLgeiZSog__PwUgTxX",
    "Content-Type": "application/json",
    "Prefer": "return=representation,resolution=merge-duplicates"
  }
  ```
- **Offline Resilience**: All helper methods in `window.PuckSenseCloud` (`fetchAllProfiles`, `fetchProfileByKey`, `upsertProfile`, `fetchTeamByCode`, `upsertTeam`, `fetchAgentInbox`, `postAgentInboxFlag`, `updateAgentInboxStatus`) fall back gracefully to `localStorage` if offline.

### 6.2 Live Supabase Database Tables & Schemas
1. **`public.pucksense_profiles`**:
   - Columns: `id` (`uuid`), `login_key` (`text` unique — `'dane'`, `'evan'`, `'miles'`, `'rhett'`, `'whelan'`, `'cohen'`, `'amanda'`, `'sal'`, `'playtest-bot'`), `pin_code` (`text`, default `'99'`), `display_name` (`text`), `jersey_number` (`text`), `portal_type` (`text`: `'player'` or `'team'`), `role` (`text`: `'player'`, `'coach'`, `'founder'`, `'agent'`), `age_division` (`text`: `'8U'`, `'10U'`, `'12U'`, `'14U'`, `'16U'`, `'18U'`), `stick_hand` (`text`: `'left'` or `'right'`), `primary_position` (`text`: `'C'`, `'LW'`, `'RW'`, `'D'`, `'G'`), `subscription_tier` (`text`: `'base'`, `'pro'`, `'team'`, `'pro_sandbox'`), `iq_score` (`integer`), `coins` (`integer`), `stanley_cups` (`jsonb`), `pie_chart_stats` (`jsonb`: `{"forecheck":65,"rush":70,"possession":60,"breakout":55,"powerplay":50,"penaltykill":60}`), `flagged_deficiencies` (`jsonb`), `profile_state` (`jsonb`), `updated_at` (`timestamptz`).
2. **`public.pucksense_teams`**:
   - Columns: `id` (`uuid`), `team_name` (`text` — pre-seeded with `'PuckSense Select 3v3'`), `team_code` (`text` unique — pre-seeded with `'PUCK99'`), `age_division` (`text`), `coach_name` (`text`), `roster` (`jsonb`), `weekly_assignments` (`jsonb`), `coop_trophy_points` (`integer`), `updated_at` (`timestamptz`).
3. **`public.pucksense_agent_inbox`**:
   - Columns: `id` (`uuid`), `created_by` (`text` — `'Dane'`, `'Evan'`, `'Playtest-Agent'`, `'Council-Agent'`), `source_role` (`text`), `scenario_id` (`text`), `age_division` (`text`), `category` (`text` — `'drill_flag'`, `'playtest_audit'`, `'council_spec'`, `'builder_fixed'`), `status` (`text` — `'open'`, `'in_council_review'`, `'queued_for_builder'`, `'resolved'`), `summary` (`text`), `details` (`jsonb`), `created_at` (`timestamptz`).
4. **`public.tactix_adm_guidelines`**:
   - Columns: `age_division` (`text` PK — `'8U'`, `'10U'`, `'12U'`, `'14U'`, `'16U'`, `'18U'`), `division_title` (`text`), `allowed_situations` (`jsonb`), `prohibited_concepts` (`jsonb` — e.g. `8U` strictly prohibits `offsides`, `delayed_offsides`, `icing`, `powerplay_5v4`, `penaltykill_4v5`, `unannounced_3v3`), `allowed_concepts` (`jsonb`), `max_prompt_words` (`integer` — `14` for `8U`), `coach_bob_tone` (`text`).
5. **`public.tactix_concept_buckets`**:
   - Columns: `id` (`uuid`), `bucket_code` (`text` unique — `'basics'`, `'spacing'`, `'house'`, `'breakout'`, `'rush'`, `'forecheck'`, `'transition'`, `'defense_d'`, `'goalie_g'`), `title` (`text`), `source_authority` (`text`), `min_age_division` (`text`), `summary` (`text`).
6. **`public.tactix_scenarios`**:
   - Columns: `id` (`uuid`), `scenario_key` (`text` unique), `bucket_code` (`text`), `title` (`text`), `allowed_divisions` (`text[]`), `tier_level` (`text` — `'Rec'`, `'B'`, `'A'`, `'AA'`, `'AAA'`), `situation_label` (`text`), `ice_zone` (`text` — `'OZ'`, `'DZ'`, `'NZ'`), `target_position` (`text`), `question_style` (`text` — `'tap_zone'`, `'tap_player'`, `'tactical_choice'`, `'drag_skater'`, `'spot_and_fix'`), `coach_bob_prompt` (`text`), `scenario_payload` (`jsonb`), `qc_approved` (`boolean`).

### 6.3 Private Multi-Login Sandbox Gate (`#sandboxLoginModal`) & Autonomous Bot Bypass
- On launch, `#sandboxLoginModal` presents the zero-scroll **Private Multi-Login Sandbox** (`Player & Family Portal` vs. `Team & Coach Portal (PUCK99)`), quick-tap chips for **Coach Dane (`dane`)**, **Coach Evan (`evan`)**, **Miles (`miles`, 12U)**, **Rhett (`rhett`, 8U)**, **Whelan (`whelan`, 8U)**, **Cohen (`cohen`, 10U)**, **Amanda (`amanda`)**, and **Sal (`sal`)** with default PIN `99`, plus a **➕ New Tester (5-Step Wizard)** button (`#btnSandboxNewTester`) that upserts new testers to `public.pucksense_profiles`.
- **Autonomous Playtest Bot Login**:
  - Navigating to `?bot=1` (e.g., `http://localhost:8080/index.html?bot=1` or `https://danebekkedahl.github.io/tactix-hockey/?bot=1`) or clicking **`🤖 Agent Auto-Login (playtest-bot)`** (`#btnAgentAutoLoginBot`) automatically logs in as `playtest-bot` and bypasses `#sandboxLoginModal`.

### 6.4 3-Agent Cloud Coordination Workflow (`public.pucksense_agent_inbox`)
1. **Youth Hockey Playtest Agent (`Playtest-Agent`)**:
   - Launches with `?bot=1` or clicks `#btnAgentAutoLoginBot` to authenticate as `playtest-bot`.
   - Fetches open flags from `GET /rest/v1/pucksense_agent_inbox?status=eq.open` and posts automated playtest findings via `POST /rest/v1/pucksense_agent_inbox` (`created_by: 'Playtest-Agent'`, `category: 'playtest_audit'`, `status: 'open'`).
2. **PuckSense IQ Learning Council Agent (`Council-Agent`)**:
   - Reads open founder/playtest flags from `public.pucksense_agent_inbox` (`status: 'open'` or `'in_council_review'`), evaluates them against USA Hockey ADM & Hockey Canada LTAD standards, and updates/posts pedagogical specs with `category: 'council_spec'` and `status: 'queued_for_builder'`.
3. **Main App Code Page (`Builder Agent`)**:
   - Queries `public.pucksense_agent_inbox?status=eq.queued_for_builder` (and any `open` flags), implements the code changes in `index.html` and `report.html`, verifies with `window.runAutomatedQaAudit()`, and patches the rows to `status: 'resolved'` (`category: 'builder_fixed'`).

---

## 7. Single-Trigger Master Pipeline (`RUN MASTER PIPELINE` / `RUN NIGHTLY AUTOPILOT`) & 8-Seat Professional Industry, Teaching Strategy & Engineering Board

### 7.1 The 8-Seat Professional Industry, Teaching Strategy & Engineering Board Charter
Whenever a Council Audit, **`RUN MASTER PIPELINE`**, or **`RUN NIGHTLY AUTOPILOT`** executes, run an active Playwright field inspection in Chrome (`deep_playtest_audit.js`) and evaluate `index.html` across all **8 Dedicated Seats**:

1. **Seat 1 — NCAA D1 / AAA & USA Hockey Systems Director:**
   - Focus: On-ice geometry, `🐂 F1 Bull / 🦊 F2 Fox / 🦅 F3 Eagle` & `🛡️ D1 / 🏰 D2` rotations, `1st/2nd/3rd Choice` consensus zones (`100% Gold / 80% Silver / 60% Bronze`), Position-Specific & Cross-Position IQ Ratings, and strict `8U` ADM guardrails.
2. **Seat 2 — Master Instructional Designer & Sports Teaching Strategist:**
   - Focus: Critiques *how* we teach and proposes **3 concrete, better teaching strategies on every pass**—such as `Cue-First Visual Highlighting` (`👀 Look Here First`), `Teach -> Guided Read -> Blind Game-Speed Test` micro-arcs, and `Contrastive Good-vs-Bad Read` ghost replays—building the #1 upgrade directly into `index.html`.
3. **Seat 3 — Pediatric Cognitive & Age-Scaling Specialist (`8U–18U`):**
   - Focus: Reading load `<= 14 words` for `8U`, age-scaled self-evaluation tone (`<= 14-word` upbeat summary with big icons for `8U` vs. deep AAA/Junior film-room breakdowns for `14U–18U`), fading training wheels across `Rec -> AAA`, and automatic spaced-repetition remediation.
4. **Seat 4 — Hit Mobile Game & EdTech Retention Designer:**
   - Focus: Mathseeds map progression (`Rec -> B -> A -> AA -> AAA`), Coach Bob Reflex pop-up animations (`Talking`, `Mistake`, `Celebrate`), streak juice, Pro Shop swag unlocks, and 3D Trophy Room Prestige Cups.
5. **Seat 5 — Native iPad / Phone Touch UX & Anti-Clutter Architect:**
   - Focus: Phone `390x844`, iPad Portrait `768x1024`, iPad Landscape `1024x768`, and Desktop `1280x800` anti-clutter, zero overlapping HUD boxes, zero clipped text, and scrollable modal ergonomics (`max-height: 92dvh; overflow-y: auto;` with sticky action buttons).
6. **Seat 6 — Dedicated Head Coach & Association Portal Tester:**
   - Focus: Tests `Coach Login` -> Add/Kick Roster Seat Controls (`20/22 Seats`) -> Line Builder -> Weekly Assignment Push -> `Player Login` Inbox & Shared Team Leaderboard (verifying the visibility boundary that hides teammates' private diagnostic weaknesses and locks Custom Lesson Builder to personal Pro) -> Coach Practice Scouting Alerts end-to-end and reports a dedicated **Coach Portal Scorecard**.
7. **Seat 7 — App Store, Conversion & Growth Strategist:**
   - Focus: `PLAY. LEARN. DOMINATE.`, Free-Download Portal Gate, Partner Association Banner (`50% Partner Logo Discount`), 3-Audience Social Media Engine, and Tactix Pro (`Well-Rounded 100% Balance Pie`, `PIP`, and Custom Lesson Builder) upsell.
8. **Seat 8 — Principal Full-Stack App & `<canvas>` Graphics Engineer:**
   - Focus: Canvas rendering polish, 3D POV camera, 60fps smoothness, `CONTEXT.md` fast-map maintenance, and pre-deploy security checks in `deploy-github-pages.js` (blocking `.tactix_gh_token`, `.env`, and secret/`service_role` keys).

### 7.2 Single-Trigger Master Sequence (`RUN MASTER PIPELINE`)
Whenever the user types **"RUN MASTER PIPELINE"** inside `Main App Code Page`, automatically execute all **4 Stages** in sequence without making the user switch chat tabs:

- **Stage 1 — Fetch Live Flags (`public.pucksense_agent_inbox`):**
  - Query `https://jrusjgpfcnptozfehcrv.supabase.co/rest/v1/pucksense_agent_inbox?select=*&order=created_at.asc` (using `apikey: sb_publishable_73207-0o-_PJEGLgeiZSog__PwUgTxX`) for all `open`, `in_council_review`, or `queued_for_builder` items submitted by Coach Dane, Coach Evan, or `Playtest-Agent`.
- **Stage 2 — Automated 5-Persona Deep Playtest (`deep_playtest_audit.js`):**
  - Launch headless Chrome via `deep_playtest_audit.js` against `http://localhost:8080/index.html?bot=1` and run all 5 Personas + 4 Viewports (`390x844`, `768x1024`, `1024x768`, `1280x800`).
- **Stage 3 — 7-Seat Industry & Engineering Board Review:**
  - Synthesize the Founder flags + 5-Persona Playtest telemetry across all **7 Seats** (Seats 1–7 above), and post the consolidated Board review summary to `public.pucksense_agent_inbox` (`created_by: 'Council-Agent'`, `category: 'council_spec'`).
- **Stage 4 — Build, Verify & Deploy (GitHub Pages `danebekkedahl/tactix-hockey`):**
  - Implement the fixes and highest-value 7-Seat upgrades in `index.html`, verify `0` console errors and `0` friction/layout issues in `deep_playtest_audit.js`, patch fixed inbox rows in `public.pucksense_agent_inbox` to `status: 'resolved'`, update `report.html` (displaying each of the 7 Seats' latest recommendation and implementation status), sync both workspaces (`c:\Users\Dane\.gemini\antigravity\scratch\pucksense\` and `C:\Users\Dane\Documents\Hockey-IQ-App\`), and push/deploy live to **`https://danebekkedahl.github.io/tactix-hockey/`** (and `https://danebekkedahl.github.io/tactix-hockey/report.html`) via `node deploy-github-pages.js` while keeping `http://localhost:8080` running locally.

### 7.3 4-Stage Nightly Auto-Pilot Pipeline (`RUN NIGHTLY AUTOPILOT`)
Whenever the user types **`RUN NIGHTLY AUTOPILOT`**, execute a full, uninterrupted **4-Stage Nightly Auto-Pilot Pipeline** from start to finish without pausing for confirmation between stages:

- **STAGE 1 — Autonomous 5-Persona Deep Playtest Suite (`deep_playtest_audit.js`):**
  1. Launch headless Chrome via `& "C:\Users\Dane\AppData\Local\Programs\nodejs\node-v22.14.0-win-x64\node.exe" deep_playtest_audit.js` against `http://localhost:8080/index.html?bot=1` covering **5 Personas** and **4 Viewports** (`390x844` Phone, `768x1024` iPad Portrait, `1024x768` iPad Landscape, `1280x800` Desktop):
     - **Persona 1 (`8U` Kid & Parent Flow):** Test the 5-Step Wizard, intentionally miss a drill twice to verify Coach Bob's `.coach-bob-state-mistake` shake + 2-attempt hint cap, complete a `1st Choice Gold` and `2nd Choice Silver` read, test the 360° 3D Avatar spin + Pro Shop category tabs/equipping, and inspect `#trophyRoomModal`.
     - **Persona 2 (`12U–14U` Multi-Mode & Tactical Dock Flow):** Switch live between `🎮 2D Rink`, `🥽 3D POV`, and `📋 Chalkboard` mid-drill, click every button in `#tacticalActionDock` (`👀 Pre-Scan`, `🎭 Deception`, `🛡️ Protect`, `📣 Callout`, plus `🐂 F1 Bull / 🦊 F2 Fox / 🦅 F3 Eagle / 🛡️ D1 / 🏰 D2` role-read buttons), test Q5 Active Film Study, and test 2-Step `Spot the Mistake`.
     - **Persona 3 (`16U–18U` Pro Subscriber Flow):** Open the 6-Slice Interactive Performance Pie Chart, click the lowest slice, trigger **⚡ Formulate Hockey IQ Improvement Plan (PIP)**, and test **🛠️ Create My Own Lesson** across all 15 concept buckets and all 5 positions (`C, LW, RW, D, G`).
     - **Persona 4 (`Team & Association Portal` End-to-End Flow):** Test `PUCK99` and `ASSOC-MINOT` (`🧑‍💼 Coach Login` Roster Line Builder -> create & approve a Weekly Lesson Plan -> switch to `🏒 Player Login` -> verify the assignment appears in the player's inbox and launches cleanly -> verify Coach Scouting Alerts update).
     - **Persona 5 (Automated Pixel, Overlap & Graphics Inspector):** Across all 4 viewports (`390x844` Phone, `768x1024` iPad Portrait, `1024x768` iPad Landscape, `1280x800` Desktop), run a DOM & `<canvas>` geometry audit (`getBoundingClientRect()`) detecting any overlapping UI boxes, clipped text (`scrollWidth > clientWidth`), buttons outside the viewport, broken images/icons, or canvas rendering glitches.
  2. Save telemetry to `deep_playtest_telemetry.json`, write the full audit to `PLAYTEST_REPORT.md`, and `POST` any discovered bugs or friction points to `public.pucksense_agent_inbox` (`https://jrusjgpfcnptozfehcrv.supabase.co/rest/v1/pucksense_agent_inbox` using apikey `sb_publishable_73207-0o-_PJEGLgeiZSog__PwUgTxX`).

- **STAGE 2 — 7-Seat Professional Industry & Engineering Board Review (`Council-Agent`):**
  Immediately after Stage 1 finishes:
  1. Fetch all open / `in_council_review` rows from `public.pucksense_agent_inbox` (including any Founder `🚩 Flag Drill` notes from Coach Dane or Coach Evan) and read `PLAYTEST_REPORT.md`, `deep_playtest_telemetry.json`, and `FOUNDER_VISION_NOTES.md`.
  2. Evaluate the app from all **7 Industry & Engineering Seats** (1. NCAA D1/AAA & USA Hockey Systems Director, 2. Pediatric Sports Psychologist, 3. Mobile Game & EdTech Retention Designer, 4. Native iPad/Phone Touch UX Architect, 5. Youth Hockey Coach & Association Director Liaison, 6. App Store & Subscription Strategist, 7. Principal Full-Stack App & `<canvas>` Graphics Engineer).
  3. Write two clear sections in `LEARNING_COUNCIL_REPORT.md`:
     - **Part A — Scenario Bank Expansion Spec:** Define tactical concept buckets and permutations to expand/tune our Supabase bank (`public.tactix_scenarios`).
     - **Part B — UI, UX, Engineering & `<canvas>` Graphics Polish Spec:** Define the top fixes and exact CSS/DOM/code prescriptions from Seats 1–7 (with Seat 7 addressing Persona 5's pixel/bounding-box telemetry).
  4. Update/post the specs to `public.pucksense_agent_inbox` with `status: 'queued_for_builder'`.

- **STAGE 3 — 3-Bot Scenario Factory Expansion & Verification (`generate-tactix-bank.js`):**
  Immediately after Stage 2 finishes:
  1. Update `generate-tactix-bank.js` with any new tactical concept buckets or scenario tuning from Stage 2 Part A (**360+ total cloud scenarios** across 15 buckets and `Rec -> B -> A -> AA -> AAA`).
  2. Run **Bot #1 (`Curriculum & ADM Guardrail Bot`)** -> **Bot #2 (`Scenario Permutation Generator`)** -> **Bot #3 (`Strict QA & Geometry Verifier`)** via `& "C:\Users\Dane\AppData\Local\Programs\nodejs\node-v22.14.0-win-x64\node.exe" generate-tactix-bank.js` and upload all approved scenarios (`qc_approved = true`) to `public.tactix_scenarios`.

- **STAGE 4 — Main App Code Build, Verification & Live GitHub Pages Deploy:**
  Immediately after Stage 3 finishes:
  1. Implement the Stage 2 Part B UI/UX/engineering/canvas fixes in `index.html` and ensure `index.html` seamlessly ingests all **360+ cloud scenarios** from `public.tactix_scenarios`.
  2. Re-run `deep_playtest_audit.js` on `http://localhost:8080/index.html?bot=1` to verify `0` console errors, `0` failed audit checks, and `0` friction/layout issues across all 5 Personas and all 4 Viewports.
  3. `PATCH` all fixed items in `public.pucksense_agent_inbox` to `status: 'resolved'` and update `report.html`.
  4. Sync all updated files across both `C:\Users\Dane\Documents\Hockey-IQ-App\` and `c:\Users\Dane\.gemini\antigravity\scratch\pucksense\`, then run `& "C:\Users\Dane\AppData\Local\Programs\nodejs\node-v22.14.0-win-x64\node.exe" deploy-github-pages.js` so the live build at **`https://danebekkedahl.github.io/tactix-hockey/`** is updated automatically.



