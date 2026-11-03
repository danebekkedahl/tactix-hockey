# TACTIX HOCKEY — STAGE 2: 8-SEAT PROFESSIONAL INDUSTRY, TEACHING STRATEGY & ENGINEERING BOARD REVIEW (`Council-Agent`)

**Review Date:** November 2026 (v7.9 Sections 15–19 & 8-Seat Board Upgrade)  
**Input Telemetry:** `PLAYTEST_REPORT.md` & `deep_playtest_telemetry.json` (5-Persona & 8-Seat Deep Playtest Suite across 4 Viewports)  
**Scenario Database Status:** `360 / 360` Approved Scenarios Live in `public.tactix_scenarios` (`24` scenarios × `15` tactical concept buckets)  
**Implementation Status:** **ALL 8 SEATS VERIFIED & SHIPPED IN `index.html` (`0` Remaining Issues across all 5 Personas, 8 Seats & 4 Viewports)**

---

## 1. The 8-Seat Professional Industry, Teaching Strategy & Engineering Board Charter & Shipped Verdicts

### 🏒 Seat 1 — IIHF / USA Hockey & Hockey Canada Systems Director
- **Audit of Persona 1–4 Telemetry:** Verified that all **15 official `bucket_code` categories** (`24` scenarios per bucket = `360` cloud scenarios) and all **5 positions (`C`, `LW`, `RW`, `D`, `G`)** are selectable in `#selectCustomSystem` and `#selectCoachWeeklyFocus`, with `🐂 F1 Bull / 🦊 F2 Fox / 🦅 F3 Eagle` and `🛡️ D1 / 🏰 D2` dynamic proximity badges updating every frame.
- **Status:** **SHIPPED & VERIFIED (`360/360` scenarios, `15/15` buckets, `5/5` positions, `0` ADM violations).**

### 🎓 Seat 2 — Master Hockey Educator & Instructional Designer (NEW SEAT)
- **Charter:** Propose **3 concrete new teaching/instructional strategies** in every run so players don't just memorize answers, but genuinely learn *why* a play works and transfer that habit to real ice, and ship the #1 highest-impact teaching upgrade directly into `index.html`.
- **3 Concrete Teaching Strategies Proposed This Run:**
  1. **Strategy #1 (SHIPPED IN `index.html`): Cue-First Visual Highlighting + Contrastive Good-vs-Bad Read Replay (`#btnCueFirstHighlight` & `#btnContrastiveReplay`)** — Before a player drags or taps, highlight *what cue to look at on the ice* (e.g., primary defender `D1`'s stick angle and hip orientation or the open Attack Triangle anchor `#14`) via a cyan sightline vector and target reticle (`getCueFirstHighlightTarget()`). After answering (or on demand via `🔄 Good vs. Bad`), animate both the **❌ Common Youth Mistake Path (Red Dashed Ghost Skater)** and the **✅ 1st Choice Gold Path (Emerald Solid Skater)** side-by-side (`triggerContrastiveGoodBadReplay()`) so the skater visually contrasts why bunching/forcing fails vs. why the Gold read succeeds.
  2. **Strategy #2: Guided Self-Explanation Micro-Prompts ("Why Was He Open?")** — On selected drills in `B` and `A` tiers, follow a correct pass read with a 1-tap micro-confirmation asking *which defender cue made that seam open* (e.g., *"D1's stick was angled toward the wall"* vs. *"D1 was sliding toward the net"*).
  3. **Strategy #3: Cross-Unit Role-Reversal Perspective Swap ("See It From Your Pass Target's Eyes")** — Allow a Left Wing (`LW`) who just missed a weak-side breakout or 5v4 Power Play read to tap `🎓 Study RW / C / D` in `#positionSpecificIqGrid` and immediately replay the same system from their linemate's perspective.
- **Status:** **STRATEGY #1 (Cue-First Visual Highlighting + Contrastive Good-vs-Bad Read Replay) & STRATEGY #3 (Cross-Position Study in `#positionSpecificIqGrid`) SHIPPED & VERIFIED (`seat2_InstructionalDesigner = PASS`).**

### 🧠 Seat 3 — Pediatric Cognitive & Age-Scaling Specialist
- **Audit of Persona 1 & Age-Scaling Telemetry:**
  1. Enforced `<= 14-word` Coach Bob prompts AND `<= 14-word` 1-sentence upbeat Self-Evaluations (`buildAgeScaledSelfEvaluation()`) for `8U` & `10U` (`13 words` verified: *"🌟 Awesome Attack Triangles! Keep your stick on the ice in The House!"*).
  2. Delivered deep **`46`-word** AAA/Junior film-room breakdowns for `14U–18U` players tailored to their strongest and weakest pie slices.
  3. Implemented **Fading Training Wheels (`Rec → B → A → AA → AAA`)**: `state.cueFirstHighlightActive` is automatically `ON` for `Rec`, `B`, and `A` tiers, and automatically fades to on-demand (`false`) on `AA` and `AAA` stops (`aaaTrainingWheelsFadedOnDemand = true`).
- **Status:** **SHIPPED & VERIFIED (`seat3_PediatricCognitive = PASS`).**

### 🏆 Seat 4 — Mobile Game Retention & Gamification Architect
- **Audit of Persona 1 & 2 Telemetry:** Verified the Mathseeds 5-tier map progression (`Rec → B → A → AA → AAA`), Coach Bob's 3-state animations (`.coach-bob-state-talking`, `.coach-bob-state-mistake` shake, `.coach-bob-state-celebrate` bounce with `0ms` latency), 360° 3D Avatar spin, 5 Pro Shop tabs, and `#trophyRoomModal` 3D Stanley Cup + 6 Age-Tier Cups.
- **Status:** **SHIPPED & VERIFIED (`seat4_GamificationArchitect = PASS`).**

### 📱 Seat 5 — Touch UX & Anti-Clutter Lead
- **Audit of Persona 5 Multi-Viewport Telemetry:** Verified across `390x844` Phone Portrait, `768x1024` iPad Portrait, `1024x768` iPad Landscape, and `1280x800` Desktop that gameplay is 100% zero-scroll while pop-up modals (`#teamManagerModal`, `#reportModal`, `#upgradeModal`, `#pricingModal`) scroll smoothly (`max-h-[90vh] overflow-y-auto`) with `0` HUD overlaps, `0` out-of-viewport elements, and `0` clipped text.
- **Status:** **SHIPPED & VERIFIED (`seat5_TouchUxLead = PASS`).**

### 🧢 Seat 6 — Dedicated Head Coach & Association Portal Tester
- **Audit of Persona 4 & Coach Portal Scorecard (`coachPortalScorecard`):**
  1. Added `#coachRosterSeatCounterBadge` (`🪑 Roster Seats: 22 / 22 Used`) enforcing `MAX_TEAM_ROSTER_SEATS = 22`.
  2. Added `kickRosterPlayer()` (`👢 Kick` button on every roster row in Coach View) and `addCoachRosterPlayer()` so coaches can remove inactive/graduated players and fill open seats up to 22.
  3. Added `#playerViewTeamLeaderboardSection` (`#playerViewTeamLeaderboardList`) and `#playerViewCustomLessonLockBanner` inside `Team Portal -> Player Login`, displaying shared Team Leaderboard standings while strictly hiding teammates' private diagnostic weaknesses and remedial controls.
- **Status:** **SHIPPED & VERIFIED (`seat6_CoachPortalTester = PASS`).**

### 💎 Seat 7 — App Store, Conversion & Growth Strategist
- **Audit of Persona 3 & Section 15 Telemetry:**
  1. Added **Position-Specific & Cross-Position Hockey IQ Ratings (`#positionSpecificIqGrid`)** inside `#reportModal`, tracking `5v5 IQ`, `5v4 PP IQ`, and `4v5 PK IQ` across all 5 unit positions (`C, LW, RW, D, G` — e.g., `5v4 PP as LW = 88` vs. `as RW = 72`) with 1-click `🎓 Study Role` buttons.
  2. Added **The "Well-Rounded Player" 100% Balance Pie Badge (`#wellRoundedBalanceBadge` — "Triple-B Player Performance Plan")** via `checkWellRoundedBalancePie()`, flagging any lopsided `<10%` proportional share slice.
- **Status:** **SHIPPED & VERIFIED (`seat7_GrowthStrategist = PASS`).**

### 📐 Seat 8 — Principal Full-Stack, Supabase & `<canvas>` Performance Engineer
- **Audit of Infrastructure & Security Guardrails:**
  1. Created `CONTEXT.md` (~80 lines) indexing all 6 Supabase tables (`pucksense_profiles`, `pucksense_teams`, `pucksense_agent_inbox`, `tactix_adm_guidelines`, `tactix_concept_buckets`, `tactix_scenarios`), key DOM IDs, and core functions, and referenced it at the top of `AGENT.md`.
  2. Added `runPreCommitSecurityGuardrail()` in `deploy-github-pages.js` and `.gitignore` blocking `.tactix_gh_token`, `.env`, `ghp_`, `github_pat_`, `sb_secret_`, and `service_role` keys from ever being staged or pushed to GitHub.
  3. Verified `0` console/page errors and non-empty 2D & 3D `<canvas>` rendering across all 4 viewports.
- **Status:** **SHIPPED & VERIFIED (`seat8_PrincipalEngineer = PASS`).**
