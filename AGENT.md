# AGENT.md — Antigravity Builder & QA Handoff Specification
**Project Name:** TACTIX HOCKEY — PLAY. LEARN. DOMINATE. (`HOCKEY IQ & STRATEGY PLATFORM` with Coach Bob)  
**Live GitHub Pages Deployment (Free & Unlimited Deploys):** `https://danebekkedahl.github.io/tactix-hockey/` (Report: `https://danebekkedahl.github.io/tactix-hockey/report.html`)  
**Local Dev Server:** `http://localhost:8080`  
**Architecture:** Self-Contained Single-Page Web Application + Installable PWA (`index.html`, `report.html`, `assets/tactix-logo.png`, `assets/coach-bob.png`, `manifest.json`, `sw.js`, `deploy-github-pages.js`)

> [!IMPORTANT]
> **Mandatory Multi-Agent Reading Rule & Single-Trigger Pipelines (`RUN NIGHTLY AUTOPILOT` & `RUN MASTER PIPELINE`):**
> 1. All Antigravity agents (`Main App Code Page`, `PuckSense IQ Learning Council Report`, and `Youth Hockey Playtest Report`) **MUST** read `FOUNDER_VISION_NOTES.md` alongside `LEARNING_COUNCIL_REPORT.md` and `PLAYTEST_REPORT.md` before planning, auditing, or modifying `index.html`.
> 2. Whenever the user types **`RUN NIGHTLY AUTOPILOT`** (or **`RUN MASTER PIPELINE`**) inside `Main App Code Page`, the agent **MUST** automatically execute all 4 stages from start to finish without pausing for confirmation between stages (Stage 1: Autonomous 6-Division Playtest Bot `Playtest-Agent`; Stage 2: 6-Seat Professional Industry Board Review `Council-Agent`; Stage 3: 3-Bot Scenario Factory Expansion `generate-tactix-bank.js`; Stage 4: Main App Code Build, Verification & Live GitHub Pages Deploy to `https://danebekkedahl.github.io/tactix-hockey/`). See **Section 7.2 & Section 7.3** below for the full specification.

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

## 7. Single-Trigger Master Pipeline (`RUN MASTER PIPELINE`) & 6-Seat Professional Industry Board

### 7.1 The 6-Seat Professional Industry Board Charter
Whenever a Council Audit or **`RUN MASTER PIPELINE`** executes, evaluate `index.html` and propose concrete, high-impact upgrades across all **6 Industry Seats**:

1. **Seat 1 — NCAA D1 / AAA & USA Hockey Systems Director:**
   - Focus: Authentic playbooks, Graded 1st/2nd/3rd Choice Consensus Zones (`100% Gold / 80% Silver / 60% Bronze` — "The Miles vs. Rhett Rule"), Dynamic Proximity Roles (`🐂 F1 Wolf / 🦊 F2 Fox / 🦅 F3 Hawk` & `🛡️ D1 / 🏰 D2` rotations), and position-specific Forward, Defenseman, and Goalie reads.
2. **Seat 2 — Pediatric Sports Psychologist & Cognitive Scientist:**
   - Focus: 6-division scaling (`8U`, `10U`, `12U`, `14U`, `16U`, `18U`), 1-sentence simplicity for `8U`, fading visual indicators as mastery increases, and automatic spaced-repetition remediation when a player misses a concept twice.
3. **Seat 3 — Mobile Game & EdTech Retention Designer:**
   - Focus: 3D Trophy Room Prestige Stanley Cups across age tiers, streak rewards, Pro Shop swag unlocks (`+$ PuckBucks`), and `8U/10U` Team Co-Op goals (`coop_trophy_points`).
4. **Seat 4 — Native iPad / Phone Touch UX Architect:**
   - Focus: Thumb ergonomics, Landscape/Portrait rotation across 8-inch to 16-inch tablets and phones, scrollable modals (`max-height: 92dvh; overflow-y: auto;`) with sticky action buttons, and zero clipped text.
5. **Seat 5 — Youth Hockey Coach & Association Director Liaison:**
   - Focus: 30-second Coach Weekly Assignment workflow (`#teamManagerModal`, Team Code `PUCK99`), roster line builder, player inbox compliance tracking, and actionable practice scouting alerts.
6. **Seat 6 — App Store & Subscription Product Strategist:**
   - Focus: Clear value separation between the **`$4.99` Base Game** (32-City Tour, 6 Age Tiers, Trophy Room, Pro Shop), **Pro Upgrade** (Interactive 6-Slice IQ Pie Chart + PIP Remedial Drills + Custom Lesson Builder), and **Team Portal Licensing** (Coach Roster, Weekly Homework & Co-Op Cup).

### 7.2 Single-Trigger Master Sequence (`RUN MASTER PIPELINE`)
Whenever the user types **"RUN MASTER PIPELINE"** inside `Main App Code Page`, automatically execute all **4 Stages** in sequence without making the user switch chat tabs:

- **Stage 1 — Fetch Live Flags (`public.pucksense_agent_inbox`):**
  - Query `https://jrusjgpfcnptozfehcrv.supabase.co/rest/v1/pucksense_agent_inbox?select=*&order=created_at.asc` (using `apikey: sb_publishable_73207-0o-_PJEGLgeiZSog__PwUgTxX`) for all `open`, `in_council_review`, or `queued_for_builder` items submitted by Coach Dane, Coach Evan, or `Playtest-Agent`.
- **Stage 2 — Automated Bot Playtest (`?bot=1`):**
  - Launch headless Chrome as `playtest-bot` (`http://localhost:8080/index.html?bot=1`), run `window.runAutomatedQaAudit()` plus interactive checks across age tiers (`8U–18U`), positions (`C`, `LW`, `RW`, `D`, `G`), and portals (`Player` & `Team PUCK99`), and log any newly discovered bugs.
- **Stage 3 — 6-Seat Industry Board Review:**
  - Synthesize the Founder flags + Playtest findings with **1 high-impact improvement from each of the 6 Industry Seats** (Seats 1–6 above), and post the consolidated Board review summary to `public.pucksense_agent_inbox` (`created_by: 'Council-Agent'`, `category: 'council_spec'`).
- **Stage 4 — Build, Verify & Deploy (GitHub Pages `danebekkedahl/tactix-hockey`):**
  - Implement the fixes and highest-value 6-Seat upgrades in `index.html`, verify `0` console errors in headless Chrome on `http://localhost:8080`, patch fixed inbox rows in `public.pucksense_agent_inbox` to `status: 'resolved'`, update `report.html` (displaying each Industry Seat's latest recommendation and implementation status), sync both workspaces (`c:\Users\Dane\.gemini\antigravity\scratch\pucksense\` and `C:\Users\Dane\Documents\Hockey-IQ-App\`), and push/deploy live to **`https://danebekkedahl.github.io/tactix-hockey/`** (and `https://danebekkedahl.github.io/tactix-hockey/report.html`) via `node deploy-github-pages.js` while keeping `http://localhost:8080` running locally.

### 7.3 4-Stage Nightly Auto-Pilot Pipeline (`RUN NIGHTLY AUTOPILOT`)
Whenever the user types **`RUN NIGHTLY AUTOPILOT`**, execute a full, uninterrupted **4-Stage Nightly Auto-Pilot Pipeline** from start to finish without pausing for confirmation between stages:

- **STAGE 1 — Autonomous 6-Division Playtest Bot (`Playtest-Agent`):**
  1. Launch headless Chrome against `http://localhost:8080/index.html?bot=1` as `playtest-bot`.
  2. Playtest all 6 age divisions (`8U`, `10U`, `12U`, `14U`, `16U`, `18U`) across `Rec -> B -> A -> AA -> AAA`:
     - Verify `8U` strictly serves only `5-on-5 Even Strength` foundational drills (`0` offsides, `0` PK/PP, `0` unannounced 3v3).
     - Test **Coach Bob**'s lower-left Reflex pop-up animations (`Talking`, `Mistake`, `Celebrate`) and auto-hide behavior.
     - Test the `🐂 F1 Bull / 🦊 F2 Fox / 🦅 F3 Eagle / 🛡️ D1 / 🏰 D2` role badges and all 5 question formats (`tap_zone`, `tap_player`, `tactical_choice`, `drag_skater`, `spot_and_fix`).
  3. Save the full audit to `PLAYTEST_REPORT.md` and `POST` any discovered bugs or friction points to `public.pucksense_agent_inbox` (`https://jrusjgpfcnptozfehcrv.supabase.co/rest/v1/pucksense_agent_inbox` using apikey `sb_publishable_73207-0o-_PJEGLgeiZSog__PwUgTxX`).

- **STAGE 2 — 6-Seat Professional Industry Board Review (`Council-Agent`):**
  Immediately after Stage 1 finishes:
  1. Fetch all open / `in_council_review` rows from `public.pucksense_agent_inbox` (including any Founder `🚩 Flag Drill` notes from Coach Dane or Coach Evan) and read `PLAYTEST_REPORT.md` and `FOUNDER_VISION_NOTES.md`.
  2. Evaluate the app from all **6 Industry Seats** (1. NCAA D1/AAA & USA Hockey Systems Director, 2. Pediatric Sports Psychologist, 3. Mobile Game & EdTech Retention Designer, 4. Native iPad/Phone Touch UX Architect, 5. Youth Hockey Coach & Association Director Liaison, 6. App Store & Subscription Strategist).
  3. Write two clear sections in `LEARNING_COUNCIL_REPORT.md`:
     - **Part A — Scenario Bank Expansion Spec:** Define 5 new high-value tactical sub-lessons / concept buckets (e.g. `OZ Cycle & Low-High Scissors`, `Neutral Zone D-to-D Hinge Regroup`, `D-Zone Box+1 Low Hand-Off`, `Goalie Screen Sightline & Rebound Control`, `Faceoff Set Plays & Win-to-Shot`) with `24` permutations each (`120` new scenarios total) to expand our Supabase bank (`public.tactix_scenarios`).
     - **Part B — UI, UX & Gameplay Polish Spec:** Define the top fixes and feature upgrades from the 6 seats.
  4. Update/post the specs to `public.pucksense_agent_inbox` with `status: 'queued_for_builder'`.

- **STAGE 3 — 3-Bot Scenario Factory Expansion (`generate-tactix-bank.js`):**
  Immediately after Stage 2 finishes:
  1. Update `generate-tactix-bank.js` with the 5 new tactical concept buckets from Stage 2 Part A (`120` new permutations = **360+ total cloud scenarios** across `Rec -> B -> A -> AA -> AAA`).
  2. Run **Bot #1 (`Curriculum & ADM Guardrail Bot`)** -> **Bot #2 (`Scenario Permutation Generator`)** -> **Bot #3 (`Strict QA & Geometry Verifier`)** via `& "C:\Users\Dane\AppData\Local\Programs\nodejs\node-v22.14.0-win-x64\node.exe" generate-tactix-bank.js` and upload all newly approved scenarios (`qc_approved = true`) to `public.tactix_scenarios`.

- **STAGE 4 — Main App Code Build, Verification & Live GitHub Pages Deploy:**
  Immediately after Stage 3 finishes:
  1. Implement the Stage 2 Part B UI/UX/gameplay fixes in `index.html` and ensure `index.html` seamlessly ingests all **360+ cloud scenarios** from `public.tactix_scenarios`.
  2. Verify with `window.runAutomatedQaAudit()` and headless Chrome on `http://localhost:8080` (`0` console errors, `0` failed audit checks).
  3. `PATCH` all fixed items in `public.pucksense_agent_inbox` to `status: 'resolved'` and update `report.html`.
  4. Sync all updated files across both `C:\Users\Dane\Documents\Hockey-IQ-App\` and `c:\Users\Dane\.gemini\antigravity\scratch\pucksense\`, then run `& "C:\Users\Dane\AppData\Local\Programs\nodejs\node-v22.14.0-win-x64\node.exe" deploy-github-pages.js` so the live build at **`https://danebekkedahl.github.io/tactix-hockey/`** is updated automatically.



