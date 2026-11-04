# AGENT.md — Antigravity Builder & QA Handoff Specification
**Project Name:** SYNAPZ HOCKEY — PLAY. LEARN. DOMINATE. (`HOCKEY IQ & STRATEGY PLATFORM` with Coach Bob)  
**Live GitHub Pages Deployment (Free & Unlimited Deploys):** `https://danebekkedahl.github.io/tactix-hockey/` (Report: `https://danebekkedahl.github.io/tactix-hockey/report.html`)  
**Local Dev Server:** `http://localhost:8080`  
**Architecture:** Self-Contained Single-Page Web Application + Installable PWA (`index.html`, `report.html`, `CONTEXT.md`, `assets/tactix-logo.png`, `assets/coach-bob.png`, `manifest.json`, `sw.js`, `deploy-github-pages.js`)

> [!IMPORTANT]
> **Mandatory Multi-Agent Reading Rule, `CONTEXT.md` Fast-Map, `CHANGELOG_DECISIONS.md` Ledger & Single-Trigger Pipelines (`RUN NIGHTLY AUTOPILOT` & `RUN MASTER PIPELINE`):**
> 1. **Read `CONTEXT.md` & `CHANGELOG_DECISIONS.md` First:** All Antigravity agents (`Main App Code Page`, `Synapz Hockey Learning Council Report`, and `Youth Hockey Playtest Report`) **MUST** read `CONTEXT.md` (the ~100-line architectural index of all 8 Supabase tables, DOM IDs, and core functions) and `CHANGELOG_DECISIONS.md` (the immutable ledger of locked Founder rules) alongside `FOUNDER_VISION_NOTES.md`, `LEARNING_COUNCIL_REPORT.md`, and `PLAYTEST_REPORT.md` before planning, auditing, or modifying `index.html`.
> 2. Whenever the user types **`RUN NIGHTLY AUTOPILOT`** (or **`RUN MASTER PIPELINE`**) inside `Main App Code Page`, the agent **MUST** automatically execute all 4 stages from start to finish without pausing for confirmation between stages (Stage 1: Autonomous 5-Persona & 3-Pod / 10-Seat Field Playtest Bot `deep_playtest_audit.js`; Stage 2: 3-Pod / 10-Seat Board Review `Council-Agent` with the 4-Step Authority Hierarchy & Max 3 Shipped Changes Per Run; Stage 3: 3-Bot Scenario Factory `generate-tactix-bank.js` + Multi-Channel Video Harvester `harvest-tactix-videos.js`; Stage 4: Main App Code Build, Verification, 30-Idea Founder Email Digest `send-board-digest.js`, & Live GitHub Pages Deploy to `https://danebekkedahl.github.io/tactix-hockey/`). See **Section 7.1–7.4** below for the full specification.

---

## 1. Project Overview & Target Device Experience
**Synapz Hockey** is an interactive off-ice cognitive training game and coaching platform designed to build real-world "Hockey IQ" (spatial awareness, puck support, defensive slot protection, breakout reads, forecheck angling, odd-man rush decision-making, and special teams positioning) in youth hockey players across USA Hockey age divisions (`8U Mite`, `10U Squirt`, `12U Peewee`, `14U Bantam`, and `16U/18U`).

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
   - Columns: `id` (`uuid`), `team_name` (`text` — pre-seeded with `'Synapz Hockey Select 3v3'`), `team_code` (`text` unique — pre-seeded with `'PUCK99'`), `age_division` (`text`), `coach_name` (`text`), `roster` (`jsonb`), `weekly_assignments` (`jsonb`), `coop_trophy_points` (`integer`), `updated_at` (`timestamptz`).
3. **`public.pucksense_agent_inbox`**:
   - Columns: `id` (`uuid`), `created_by` (`text` — `'Dane'`, `'Evan'`, `'Playtest-Agent'`, `'Council-Agent'`), `source_role` (`text`), `scenario_id` (`text`), `age_division` (`text`), `category` (`text` — `'drill_flag'`, `'playtest_audit'`, `'council_spec'`, `'builder_fixed'`), `status` (`text` — `'open'`, `'in_council_review'`, `'queued_for_builder'`, `'resolved'`), `summary` (`text`), `details` (`jsonb`), `created_at` (`timestamptz`).
4. **`public.tactix_adm_guidelines`**:
   - Columns: `age_division` (`text` PK — `'8U'`, `'10U'`, `'12U'`, `'14U'`, `'16U'`, `'18U'`), `division_title` (`text`), `allowed_situations` (`jsonb`), `prohibited_concepts` (`jsonb` — e.g. `8U` strictly prohibits `offsides`, `delayed_offsides`, `icing`, `powerplay_5v4`, `penaltykill_4v5`, `unannounced_3v3`), `allowed_concepts` (`jsonb`), `max_prompt_words` (`integer` — `14` for `8U`), `coach_bob_tone` (`text`).
5. **`public.tactix_concept_buckets`**:
   - Columns: `id` (`uuid`), `bucket_code` (`text` unique — `'basics'`, `'spacing'`, `'house'`, `'breakout'`, `'rush'`, `'forecheck'`, `'transition'`, `'defense_d'`, `'goalie_g'`), `title` (`text`), `source_authority` (`text`), `min_age_division` (`text`), `summary` (`text`).
6. **`public.tactix_scenarios`**:
   - Columns: `id` (`uuid`), `scenario_key` (`text` unique), `bucket_code` (`text`), `title` (`text`), `allowed_divisions` (`text[]`), `tier_level` (`text` — `'Rec'`, `'B'`, `'A'`, `'AA'`, `'AAA'`), `situation_label` (`text`), `ice_zone` (`text` — `'OZ'`, `'DZ'`, `'NZ'`), `target_position` (`text`), `question_style` (`text` — `'tap_zone'`, `'tap_player'`, `'tactical_choice'`, `'drag_skater'`, `'spot_and_fix'`), `coach_bob_prompt` (`text`), `scenario_payload` (`jsonb`), `qc_approved` (`boolean`).
7. **`public.tactix_video_channels`**:
   - Columns: `id` (`uuid`), `channel_name` (`text` unique — 16-Channel 3-Tier Trusted Network: *Evolution Hockey*, *IceHockeySystems / Denis Savard*, *Coach Matt*, *Morgan Park / Coach John*, *Minnesota Hockey*, *How To Hockey*, *Coach Steve Hockey*, *Hockey Players Club / Topher Scott*, *Along The Ice*, *NESN / Billy Jaffe*, *Mitch Giguere*, *Deep Sea Hockey*, *Coach Enio / Kevin Bieksa*, *Wally Kozak*, *St. Louis Blues*, *Official NHL*), `channel_tier` (`text`), `default_divisions` (`text[]`), `is_active` (`boolean`), `created_at` (`timestamptz`).
8. **`public.tactix_video_library`**:
   - Columns: `id` (`uuid`), `clip_key` (`text` unique — **38 QC-approved segments** across all 15 buckets), `video_id` (`text` — permanently blacklists `bSgfwvhIT7E`), `title` (`text`), `channel_name` (`text`), `bucket_code` (`text`), `allowed_divisions` (`text[]`), `tier_levels` (`text[]`), `positions` (`text[]`), `dynamic_roles` (`text[]`), `clip_style` (`text` — `'whiteboard_diagram'`, `'telestrator_breakdown'`, `'nhl_live_play'`), `start_sec` (`integer`), `end_sec` (`integer` — full-concept teaching windows `23s–140s`, never cutting off at 12s), `coach_bob_takeaway` (`text`), `film_quiz_question` (`text`), `film_quiz_options` (`text[]`), `film_quiz_answer_idx` (`integer`), `qc_approved` (`boolean`), `last_verified_at` (`timestamptz`), `created_at` (`timestamptz`).

### 6.3 Private Multi-Login Sandbox Gate (`#sandboxLoginModal`) & Autonomous Bot Bypass
- On launch, `#sandboxLoginModal` presents the zero-scroll **Private Multi-Login Sandbox** (`Player & Family Portal` vs. `Team & Coach Portal (PUCK99)`), quick-tap chips for **Coach Dane (`dane`)**, **Coach Evan (`evan`)**, **Miles (`miles`, 12U)**, **Rhett (`rhett`, 8U)**, **Whelan (`whelan`, 8U)**, **Cohen (`cohen`, 10U)**, **Amanda (`amanda`)**, and **Sal (`sal`)** with default PIN `99`, plus a **➕ New Tester (5-Step Wizard)** button (`#btnSandboxNewTester`) that upserts new testers to `public.pucksense_profiles`.
- **Autonomous Playtest Bot Login**:
  - Navigating to `?bot=1` (e.g., `http://localhost:8080/index.html?bot=1` or `https://danebekkedahl.github.io/tactix-hockey/?bot=1`) or clicking **`🤖 Agent Auto-Login (playtest-bot)`** (`#btnAgentAutoLoginBot`) automatically logs in as `playtest-bot` and bypasses `#sandboxLoginModal`.

### 6.4 3-Agent Cloud Coordination Workflow (`public.pucksense_agent_inbox`)
1. **Youth Hockey Playtest Agent (`Playtest-Agent`)**:
   - Launches with `?bot=1` or clicks `#btnAgentAutoLoginBot` to authenticate as `playtest-bot`.
   - Fetches open flags from `GET /rest/v1/pucksense_agent_inbox?status=eq.open` and posts automated playtest findings via `POST /rest/v1/pucksense_agent_inbox` (`created_by: 'Playtest-Agent'`, `category: 'playtest_audit'`, `status: 'open'`).
2. **Synapz Hockey Learning Council Agent (`Council-Agent`)**:
   - Reads open founder/playtest flags from `public.pucksense_agent_inbox` (`status: 'open'` or `'in_council_review'`), evaluates them against USA Hockey ADM & Hockey Canada LTAD standards, and updates/posts pedagogical specs with `category: 'council_spec'` and `status: 'queued_for_builder'`.
3. **Main App Code Page (`Builder Agent`)**:
   - Queries `public.pucksense_agent_inbox?status=eq.queued_for_builder` (and any `open` flags), implements the code changes in `index.html` and `report.html`, verifies with `window.runAutomatedQaAudit()`, and patches the rows to `status: 'resolved'` (`category: 'builder_fixed'`).

---

## 7. Single-Trigger Master Pipeline (`RUN MASTER PIPELINE` / `RUN NIGHTLY AUTOPILOT`), 3-Pod / 10-Seat Board & 4-Step Authority Hierarchy

### 7.1 The 3-Pod / 10-Seat Board Charter & 4-Step Domain Authority Hierarchy (`PASS / FAIL` Permanently Banned)
> [!IMPORTANT]
> **`PASS / FAIL` Permanently Banned Across All 10 Council Seats & 4-Step Authority Hierarchy Enforced:**
> Rubber-stamp `PASS / FAIL` badges are permanently banned across `AGENT.md`, `deep_playtest_audit.js`, `PLAYTEST_REPORT.md`, `LEARNING_COUNCIL_REPORT.md`, and `report.html`. On every `RUN NIGHTLY AUTOPILOT` or `RUN MASTER PIPELINE` pass, every Seat (Seats 1–10) **MUST** output four structured continuous-improvement sections:
> - **(A) What Was Observed Live**
> - **(B) What Can Be Better**
> - **(C) 3 Concrete Better Options for Coach Dane & Coach Evan**
> - **(D) Live Code/Database Edit Shipped in This Run**

#### The 4-Step Domain Authority Hierarchy & 1-Upgrade-Per-Pod Cap
1. **Priority 1 — Founder Vision & `CHANGELOG_DECISIONS.md` (100% Immutable Veto):**
   - Nothing in `FOUNDER_VISION_NOTES.md` or `CHANGELOG_DECISIONS.md` may ever be reversed by an automated run (`LOCK-01` through `LOCK-09`).
2. **Priority 2 — USA Hockey ADM & Pediatric Cognitive Safety (Seats 1 & 3 Veto):**
   - `8U` strictly `5-on-5 Even Strength`, `0` offsides/PK/PP/unannounced 3v3, and `<= 14 words` reading cap override all other seats.
3. **Priority 3 — 4-Seat Touch UX & Family Ergonomics (Seats 5 & 10 Veto):**
   - Any proposal that introduces overlapping HUD boxes, horizontal clipping, or multi-child data bleed on `390x844` Phone or `768x1024` iPad Portrait is automatically blocked.
4. **Priority 4 — Pod Votes & 1-Upgrade-Per-Pod Cap (Max 3 Shipped Changes Per Run):**
   - Each Pod (`Pod A`, `Pod B`, `Pod C`) generates 9–12 ideas (`30 Total Ideas`), vetoes any idea that violates Priorities 1–3, and selects **at most 1 consensus winner per Pod (`Max 3 Total Shipped Changes Per Run`)** so the codebase stays rock-solid while all 30 ideas are delivered to Coach Dane (`danebekkedahl@gmail.com`) and Coach Evan (`evanbekk@gmail.com`) in the **30-Idea Founder Email & In-App Digest (`#founderDigestModal` & `send-board-digest.js`)**.

#### The 3 Pods & 10 Dedicated Board Seats
- **Pod A — Youth Kid, Parent & Family Experience (`Seats 3, 4, 5, 10`):**
  - **Seat 3 — Pediatric Cognitive & Age-Scaling Specialist (`8U–18U`):** Reading load `<= 14 words` for `8U`, age-scaled self-evaluation tone (`<= 14-word` upbeat summary with big icons for `8U` vs. deep AAA/Junior film-room breakdowns for `14U–18U`), fading training wheels across `Rec -> AAA`, and automatic spaced-repetition remediation.
  - **Seat 4 — Hit Mobile Game & EdTech Retention Designer:** Mathseeds map progression (`Rec -> B -> A -> AA -> AAA`), Coach Bob Reflex pop-up animations (`Talking`, `Mistake`, `Celebrate`), streak juice, Pro Shop swag unlocks, and 3D Trophy Room Prestige Cups.
  - **Seat 5 — Native iPad / Phone Touch UX & Anti-Clutter Architect:** Phone `390x844`, iPad Portrait `768x1024`, iPad Landscape `1024x768`, and Desktop `1280x800` anti-clutter, zero overlapping HUD boxes, zero clipped text, and clean **4-Tab Player Portal (`#profileModal`)** & **4-Tab Coach Portal (`#teamManagerModal`)** ergonomics.
  - **Seat 10 — Multi-Child Hockey Parent & Family Experience Advocate (`Amanda & Sal Persona`):** Audits the **4-Tab Player & Family Locker Room (`#profileModal`)** — Tab 1 `🏒 Who's Playing? (1-Tap Sibling Locker Stalls)` (`Miles #9 • 12U`, `Rhett #88 • 8U`, `Whelan #7 • 8U`, `Cohen #14 • 10U`, plus `+ Add Sibling`) with zero data bleed, Tab 2 `🎨 3D Avatar & Fitting Room`, Tab 3 `📊 My IQ Pie Chart & Custom Lessons`, and Tab 4 `👨‍👩‍👧‍👦 Family Pass & Parent Controls` (`Side-by-Side All-Kids Progress Snapshot`, `Family "House Cup" Friendly Sibling Leaderboard`, and `🔒 Lock Child's Age Division` parent toggle).
- **Pod B — Hockey Systems, Teaching & Film Room (`Seats 1, 2, 9`):**
  - **Seat 1 — NCAA D1 / AAA & USA Hockey Systems Director:** On-ice geometry, clean out-of-the-box `F1, F2, F3, D1, D2` base defaults + `applyRoleLabelMap(text)` single-label custom role swaps (verifying setting `F1 -> "Bull"` outputs ONLY `"Bull"` and never `"F1 Bull"`), `1st/2nd/3rd Choice` consensus zones (`100% Gold / 80% Silver / 60% Bronze`), Position-Specific & Cross-Position IQ Ratings, and strict `8U` ADM guardrails.
  - **Seat 2 — Master Instructional Designer & Sports Teaching Strategist:** Critiques *how* we teach and proposes **3 concrete, better teaching strategies on every pass**—such as `Cue-First Visual Highlighting` (`👀 Look Here First`), `Teach -> Guided Read -> Blind Game-Speed Test` micro-arcs, and `Contrastive Good-vs-Bad Read` ghost replays.
  - **Seat 9 — Automated Video Harvester & Film-Room QC Auditor (`harvest-tactix-videos.js`):** Audits our 16-Channel Trusted Network (`public.tactix_video_channels`) and 39+ multi-tagged segments (`public.tactix_video_library`) across all 15 Concept Buckets via YouTube `oEmbed` (`HTTP 200`), permanently blocks music-only/unverified clips (`bSgfwvhIT7E`), enforces full-concept teaching windows (`23s–140s`, never cutting off at 12s), and tests `#videoExampleModal` multi-clip cycling, `⏪ Rewind 10s`, and `📋 Coach Bob 60fps Native Telestrator`.
- **Pod C — 4-Level Coach Portal, Growth & Engineering (`Seats 6, 7, 8`):**
  - **Seat 6 — 4-Level Coaching Panel Playtester (`Level A: 8U/10U Volunteer`, `Level B: 12U/14U AA/AAA Travel`, `Level C: 16U/18U HS/Jr`, `Level D: Association Director`):** Audits the **4-Tab Coach & Director Portal (`#teamManagerModal`)** — Tab 1 `📊 Team Command Center (At-a-Glance)`, Tab 2 `🎯 Assign Weekly Homework (3-Step Wizard)`, Tab 3 `🧢 Team Playbook, Roles & Roster (22-Seat Cap)`, and Tab 4 `🏛️ Association Director HQ (Level D Only)` (`ASSOC-MINOT`, `ASSOC-FOOTHILLS`, `ASSOC-LIGHTNING` multi-team roll-up table + 1-click Monthly Curriculum Standard push).
  - **Seat 7 — App Store, Conversion & Growth Strategist:** `PLAY. LEARN. DOMINATE.`, Free-Download Portal Gate, Partner Association Banner (`50% Partner Logo Discount`), 3-Audience Social Media Engine, and Synapz Pro (`Well-Rounded 100% Balance Pie`, `PIP`, and Custom Lesson Builder) upsell.
  - **Seat 8 — Principal Full-Stack App & `<canvas>` Graphics Engineer:** Canvas rendering polish, 3D POV camera, 60fps smoothness, `CONTEXT.md` & `CHANGELOG_DECISIONS.md` maintenance, `send-board-digest.js` automation, and pre-deploy security checks in `deploy-github-pages.js`.

### 7.2 Single-Trigger Master Sequence (`RUN MASTER PIPELINE`)
Whenever the user types **"RUN MASTER PIPELINE"** inside `Main App Code Page`, automatically execute all **4 Stages** in sequence without making the user switch chat tabs:

- **Stage 1 — Fetch Live Flags (`public.pucksense_agent_inbox`):**
  - Query `https://jrusjgpfcnptozfehcrv.supabase.co/rest/v1/pucksense_agent_inbox?select=*&order=created_at.asc` (using `apikey: sb_publishable_73207-0o-_PJEGLgeiZSog__PwUgTxX`) for all `open`, `in_council_review`, or `queued_for_builder` items submitted by Coach Dane, Coach Evan, `Founder-Override`, or `Playtest-Agent`.
- **Stage 2 — Automated 5-Persona & 10-Seat Deep Playtest (`deep_playtest_audit.js`):**
  - Launch headless Chrome via `deep_playtest_audit.js` against `http://localhost:8080/index.html?bot=1` and run all 5 Personas + 4 Viewports (`390x844`, `768x1024`, `1024x768`, `1280x800`) + 4-Tab Player Portal + 4-Tab Coach Portal + 30-Idea Founder Digest + all 10 Seats.
- **Stage 3 — 3-Pod / 10-Seat Board Review & 30-Idea Digest Generation:**
  - Synthesize the Founder flags + 5-Persona Playtest telemetry across all **10 Seats** (30 total concrete options: 3 Green-Lit Pod Winners, 21 On-Deck Backlog Options, and any Vetoed items), update `CHANGELOG_DECISIONS.md`, and run `send-board-digest.js` to post the 30-Idea Digest to `public.pucksense_agent_inbox` (`category: 'board_digest'`) for Coach Dane (`danebekkedahl@gmail.com`) and Coach Evan (`evanbekk@gmail.com`).
- **Stage 4 — Build, Verify & Deploy (GitHub Pages `danebekkedahl/tactix-hockey`):**
  - Implement the fixes and the 3 Green-Lit Pod Winner upgrades in `index.html`, verify `0` console errors and `0` friction/layout issues in `deep_playtest_audit.js`, patch fixed inbox rows in `public.pucksense_agent_inbox` to `status: 'resolved'`, update `report.html` (featuring the interactive 30-Idea Board Digest & 1-click `[⭐ Green-Light & Queue for Next Build]` Founder override buttons), sync both workspaces (`c:\Users\Dane\.gemini\antigravity\scratch\pucksense\` and `C:\Users\Dane\Documents\Hockey-IQ-App\`), and push/deploy live to **`https://danebekkedahl.github.io/tactix-hockey/`** via `node deploy-github-pages.js`.

### 7.3 4-Stage Nightly Auto-Pilot Pipeline (`RUN NIGHTLY AUTOPILOT`)
Whenever the user types **`RUN NIGHTLY AUTOPILOT`**, execute a full, uninterrupted **4-Stage Nightly Auto-Pilot Pipeline** from start to finish without pausing for confirmation between stages:

- **STAGE 1 — Autonomous Strict Blind 30-Drill Playtest & 10-Seat `FOUNDER_VISION_NOTES.md` Walk-Through (`deep_playtest_audit.js`):**
  1. **STRICT BLIND PLAYTEST RULE (Zero Answer-Key Peeking!):**
     - `deep_playtest_audit.js` is **strictly forbidden** from reading `targetSpot`, `targetZone`, `targetZones`, `consensus_zones`, `correctIdx`, `isCorrect`, `correctTargetId`, or any hidden answer variables from `index.html` or `window` memory. A startup self-audit scans `deep_playtest_audit.js`'s own source code to enforce `0` forbidden answer-key tokens, and DOM buttons never expose `data-zone-rank` or `data-tactical-correct`.
     - **Play 30 On-Ice Drills Strictly From Visible Screen & Coach Bob's Prompt** across `8U`, `10U`, `12U`, `14U`, `16U`, and `18U` (`Rec -> B -> A -> AA -> AAA`), inspecting ONLY visible DOM text (`#cornerShortPrompt`, `#scenarioTitle`, `#scenarioBriefing`, `#goldenRuleText`, `#situationBannerText`, visible choice buttons in `#multiFormatControlsBar`) and visible skater/puck/zone positions on `#rinkCanvas`.
     - Infer where to move or tap based solely on hockey logic + Coach Bob's visible instructions, and test deliberate mistakes (`2x` miss -> `.coach-bob-state-mistake` shake + 2-hint cap), `👀 Cue-First Read`, `🔄 Good vs. Bad` contrastive replay, and the Q5 Film-Room video modal (`🔄 Watch Another Clip`, `⏪ Rewind 10s`, `📋 Coach Bob Native Telestrator`).
     - **Flag Every "Prompt-vs-Scoring Discrepancy":** Whenever a move that logically follows Coach Bob's visible prompt scores `0%` (Turnover) or fails to hit `1st Choice Gold`, log a **🔴 Prompt-vs-Scoring Discrepancy** in `PLAYTEST_REPORT.md` and `public.pucksense_agent_inbox` so Stage 3 & Stage 4 fix either the target zone geometry or Coach Bob's prompt.
  2. **All 10 Seats Walk Visually Through Their Portion of the App & Compare Against `FOUNDER_VISION_NOTES.md`:**
     - **Pod 1 Walk-Through (Seats 1–4 — On-Ice Drills & 4-Tab Family/Parent HQ):** Play blind drills on the ice AND walk through all 4 tabs of the **Player & Family Portal (`#profileModal`)** (`Who's Playing?`, `3D Avatar & Gear`, `My IQ Pie Chart & PIP`, `Parent & Family HQ`), reporting any discrepancy against `FOUNDER_VISION_NOTES.md`.
     - **Pod 2 Walk-Through (Seats 5–7 — 4-Tab Coach & Director HQ + Team Flow):** Walk visually through all 4 tabs of the **Coach & Director Portal (`#teamManagerModal`)** (`Command Center & Alerts`, `Weekly Homework Wizard`, `Roster/Lines/Team Playbook/Custom Role Mapper`, and `Director HQ Multi-Team View`), push a weekly assignment, switch to `Player Login` to verify that assigned drill, and report any workflow or layout discrepancies against `FOUNDER_VISION_NOTES.md`.
     - **Pod 3 Walk-Through (Seats 8–10 — Pricing, Growth, Graphics & Film-Room Videos):** Walk visually through the Free-Download Gate, Partner Association Banner, 4-Tier Pricing modal, `Create My Own Lesson` builder, and Film-Room Video Player, reporting any discrepancies against `FOUNDER_VISION_NOTES.md`.
  3. Save telemetry to `deep_playtest_telemetry.json`, write the full audit to `PLAYTEST_REPORT.md` (using the 4-part continuous-improvement format with zero `PASS / FAIL` badges), and `POST` any discovered bugs or friction points to `public.pucksense_agent_inbox`.

- **STAGE 2 — 3-Pod / 10-Seat Board Review & 4-Step Authority Hierarchy (`Council-Agent`):**
  Immediately after Stage 1 finishes:
  1. Fetch all open / `in_council_review` / `queued_for_builder` rows from `public.pucksense_agent_inbox` (including any `Founder-Override` green-lit items from Coach Dane or Coach Evan) and read `PLAYTEST_REPORT.md`, `deep_playtest_telemetry.json`, `CHANGELOG_DECISIONS.md`, and `FOUNDER_VISION_NOTES.md`.
  2. Evaluate the app from all **10 Seats across Pods A, B, and C**, outputting strictly **(A) What Was Observed Live**, **(B) What Can Be Better**, **(C) 3 Concrete Better Options for Coach Dane & Coach Evan**, and **(D) Live Code/Database Edit Shipped in This Run** for every seat (zero `PASS / FAIL` badges), enforcing the **1-Upgrade-Per-Pod Cap (Max 3 Shipped Changes Per Run)**.
  3. Write `LEARNING_COUNCIL_REPORT.md` and update `CHANGELOG_DECISIONS.md`.

- **STAGE 3 — 3-Bot Scenario Factory (`generate-tactix-bank.js`) & Seat 9 Multi-Channel Video Harvester (`harvest-tactix-videos.js`):**
  Immediately after Stage 2 finishes:
  1. Run `& "C:\Users\Dane\AppData\Local\Programs\nodejs\node-v22.14.0-win-x64\node.exe" generate-tactix-bank.js` to verify and sync all **360+ clean `F1, F2, F3, D1, D2` cloud scenarios** (`qc_approved = true`, zero hardcoded `"Zone A"` strings, off-puck scenarios never assigned `tap_player`) to `public.tactix_scenarios`.
  2. Run `& "C:\Users\Dane\AppData\Local\Programs\nodejs\node-v22.14.0-win-x64\node.exe" harvest-tactix-videos.js` to poll public YouTube RSS feeds (`https://www.youtube.com/feeds/videos.xml?channel_id=...`) across our 16 whitelisted NHL and coaching channels, verify `oEmbed` HTTP 200, and sync `public.tactix_video_channels` (16 channels) & `public.tactix_video_library` (51+ verified segments across all 15 buckets).

- **STAGE 4 — Co-Founder Approval Gate Enforcement, Test-Suite Integrity Lock, Dual-Folder Checksum Mirror, Live Screenshot Deployment & 6-Field 10-Seat Digest Dispatch (`send-board-digest.js`):**
  Immediately after Stage 3 finishes (enforcing **Section 23: The Co-Founder Advisory Charter & 4 Process Reliability Upgrades**):
  1. **Step A — Strict Co-Founder Approval Gate & Test-Suite Lock (Build ONLY What Dane & Evan Approve):**
     - Query `public.pucksense_agent_inbox?status=eq.approved_by_founder`.
     - **Zero Unapproved UI/Gameplay Mutations:** Do **NOT** automatically mutate `index.html` with new unapproved UI, buttons, or gameplay features! Only build items explicitly marked `status: 'approved_by_founder'` by Coach Dane or Coach Evan (plus critical bug/geometry fixes caught during blind playtesting).
     - **Test-Suite Integrity Lock:** The Builder is strictly forbidden from weakening or bypassing any test check in `deep_playtest_audit.js` to make a run pass.
  2. **Step B — Rolling 30-Level / 32-City / 360-Scenario / 6-Portal Blind Playtest & Live Screenshot Capture (`deep_playtest_audit.js`):**
     - Update `playtest_coverage_ledger.json` across all **30 Age × Talent Levels (`8U–18U` × `Rec / B / A / AA / AAA`)**, all **32 NHL Cities**, all **360 Cloud Scenarios**, and all **6 Off-Ice Feature Areas** (2-Step Start Page, 5-Step Wizard, Pro Shop, 3D Avatar, Trophy Room, 4-Tab Family HQ, 4-Tab Coach/Director HQ, Pricing, and Film Room).
     - Capture **10 live Playwright screenshots** into `assets/audit-screenshots/seat1-...png` .. `seat10-...png` showing the exact screens and drills critiqued by Seats 1–10.
  3. **Step C — Defensive State Normalizer, Dual-Folder SHA-256 Mirror, GitHub Pages Deploy & 10-Seat Advisory Digest Dispatch (`deploy-github-pages.js` + `send-board-digest.js`):**
     - Verify `window.normalizeSynapzState()` and run `node deploy-github-pages.js` (which runs pre-save JS syntax verification via `vm.Script`, automatically mirrors and SHA-256 checksum-verifies `c:\Users\Dane\.gemini\antigravity\scratch\pucksense` ↔ `C:\Users\Dane\Documents\Hockey-IQ-App`, and publishes `assets/audit-screenshots/*.png`, `playtest_coverage_ledger.json`, `index.html`, and `report.html` to both **`https://danebekkedahl.github.io/synapz-hockey/`** and **`https://danebekkedahl.github.io/tactix-hockey/`**).
     - Run `& "C:\Users\Dane\AppData\Local\Programs\nodejs\node-v22.14.0-win-x64\node.exe" send-board-digest.js` to save the **Top 5 Co-Signed Consensus Priorities** and full **30-Idea Matrix (10 Seats × 3 Ideas)** with `status: 'awaiting_founder_approval'`, candid co-founder pushback, all 7 mandatory fields (including `crossSeatCoSign` across Gate A Tactical/ADM, Gate B Cognition/Zero-Clutter UX, and Gate C 60fps Engineering/Blind QA), embedded `<img src="https://danebekkedahl.github.io/synapz-hockey/assets/audit-screenshots/...">` screenshots, and 1-click `[✅ Approve for Next Build]` / `[❌ Reject]` links, and dispatch the HTML email to `danebekkedahl@gmail.com` and `evanbekk@gmail.com`.

---

## 25. The 4-Phase Cross-Seat Collaborative Roundtable & Updated SYNAPZ HOCKEY Nightly Autopilot Protocol (`v9.2`)
1. **Phase 1 — 2-Step `SYNAPZ HOCKEY` Flow & Blind Playtest Audit (`deep_playtest_audit.js`):**
   - Verifies `#sandboxStep1Portals` (`step2HiddenOnEntry === true`, `assets/synapz-splash-bg.png`, and 3 Portal Cards) -> `#sandboxStep2Credentials` (`⬅️ Back to Portals` & isolated portal credentials) -> `#synapzTransitionSplash` -> `#synapzMapHeaderBar` & `#nhlTourMapSvg` (Stepping-Stone Stanley Cup trail, zero overlapping city labels, pulsing `#9` puck marker, and bottom `▶️ DROP THE PUCK` bar) -> 30 Blind On-Ice Drills (`0` answer-key peeks), capturing `screenshots/audit_step1_portals.png`, `screenshots/audit_step2_player_login.png`, `screenshots/audit_coach_portal.png`, `screenshots/audit_family_portal.png`, `screenshots/audit_adventure_map.png`, and `screenshots/audit_on_ice_gameplay.png`.
2. **Phase 2 — 3-Gate Cross-Seat Collaborative Roundtable ("Zero Siloed Ideas"):**
   - Every proposal in the 30-Idea Matrix (`10 Seats × 3 Ideas`) passes **Gate A (`Seat 1 + Seat 6` Tactical & ADM Review)**, **Gate B (`Seat 3 + Seat 5` Child Cognition & Zero-Clutter UX Review)**, and **Gate C (`Seat 8 + Seat 10` 60fps `<canvas>` & Blind QA Engineering Plan)** and includes `crossSeatCoSign`.
3. **Phase 3 — Top 5 Co-Signed Consensus Priorities & 7-Field Digest (`report.html` & `send-board-digest.js`):**
   - All 10 Seats co-sign the **Top 5 Highest-Impact Upgrades (`#1`–`#5`)** at the top of `https://danebekkedahl.github.io/synapz-hockey/report.html` and the HTML email digest, followed by the full 30-Idea Matrix (`status = 'awaiting_founder_approval'` in `public.pucksense_agent_inbox`).
4. **Phase 4 — Dual-Repo GitHub Pages Push & Live Gmail Webhook Dispatch (`deploy-github-pages.js` + `send-board-digest.js`):**
   - Mirrors and SHA-256 checksum-verifies both local folders, publishes to `https://danebekkedahl.github.io/synapz-hockey/` and `https://danebekkedahl.github.io/tactix-hockey/`, and dispatches the live email (`HTTP 200 "SENT"`) to `danebekkedahl@gmail.com` and `evanbekk@gmail.com`.





