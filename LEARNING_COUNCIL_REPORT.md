# TACTIX HOCKEY — STAGE 2: 9-SEAT PROFESSIONAL INDUSTRY, TEACHING STRATEGY, ENGINEERING & VIDEO QC BOARD REVIEW (`Council-Agent`)

**Review Date:** November 2026 (v8.0 Cloud Video Library, 16-Channel Harvester & 9-Seat Board Upgrade)  
**Input Telemetry:** `PLAYTEST_REPORT.md`, `deep_playtest_telemetry.json`, & `tactix_video_library_snapshot.json` (5-Persona & 9-Seat Deep Playtest Suite across 4 Viewports)  
**Scenario & Video Database Status:** `360 / 360` Approved Scenarios Live in `public.tactix_scenarios` + `39 / 39` QC-Approved Video Segments across `16` Channels Live in `public.tactix_video_library`  
**Implementation Status:** **ALL 9 SEATS VERIFIED & SHIPPED IN `index.html` (`0` Remaining Issues across all 5 Personas, 9 Seats & 4 Viewports)**

---

## 1. The 9-Seat Professional Industry, Teaching Strategy, Engineering & Video QC Board Charter & Shipped Verdicts

### 🏒 Seat 1 — IIHF / USA Hockey & Hockey Canada Systems Director
- **Audit of Persona 1–4 Telemetry:** Verified that all **15 official `bucket_code` categories** (`24` scenarios per bucket = `360` cloud scenarios) and all **5 positions (`C`, `LW`, `RW`, `D`, `G`)** are selectable in `#selectCustomSystem` and `#selectCoachWeeklyFocus`, with `🐂 F1 Bull / 🦊 F2 Fox / 🦅 F3 Eagle` and `🛡️ D1 / 🏰 D2` dynamic proximity badges updating every frame.
- **Status:** **SHIPPED & VERIFIED (`360/360` scenarios, `15/15` buckets, `5/5` positions, `0` ADM violations).**

### 🎓 Seat 2 — Master Hockey Educator & Instructional Designer
- **Charter:** Propose **3 concrete new teaching/instructional strategies** in every run so players don't just memorize answers, but genuinely learn *why* a play works and transfer that habit to real ice, and ship the #1 highest-impact teaching upgrade directly into `index.html`.
- **Shipped Teaching Strategies Verified:**
  1. **Cue-First Visual Highlighting + Contrastive Good-vs-Bad Read Replay (`#btnCueFirstHighlight` & `#btnContrastiveReplay`)** — Highlights *what cue to look at on the ice* before the skater moves, and animates both the **❌ Common Youth Mistake Path (Red Dashed Ghost Skater)** and the **✅ 1st Choice Gold Path (Emerald Solid Skater)** side-by-side.
  2. **Cross-Unit Role-Reversal Perspective Swap (`#positionSpecificIqGrid`)** — Allows any skater to tap `🎓 Study C / LW / RW / D / G` and immediately study another unit position's responsibilities.
- **Status:** **SHIPPED & VERIFIED (`seat2_InstructionalDesigner = PASS`).**

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
- **Audit of Persona 5 Multi-Viewport Telemetry:** Verified across `390x844` Phone Portrait, `768x1024` iPad Portrait, `1024x768` iPad Landscape, and `1280x800` Desktop that gameplay is 100% zero-scroll while pop-up modals (`#teamManagerModal`, `#reportModal`, `#upgradeModal`, `#pricingModal`, `#videoExampleModal`) scroll smoothly (`max-h-[90vh] overflow-y-auto`) with `0` HUD overlaps, `0` out-of-viewport elements, and `0` clipped text.
- **Status:** **SHIPPED & VERIFIED (`seat5_TouchUxLead = PASS`).**

### 🧢 Seat 6 — Dedicated Head Coach & Association Portal Tester
- **Audit of Persona 4 & Coach Portal Scorecard (`coachPortalScorecard`):**
  1. Verified `#coachRosterSeatCounterBadge` (`🪑 Roster Seats: 21 / 22 Used (1 Open)` after kick, `22 / 22 Used (0 Open)` after add) enforcing `MAX_TEAM_ROSTER_SEATS = 22`.
  2. Verified `kickRosterPlayer()` (`👢 Kick` button on every roster row in Coach View) and `addCoachRosterPlayer()` so coaches can remove inactive/graduated players and fill open seats up to 22.
  3. Verified `#playerViewTeamLeaderboardSection` (`#playerViewTeamLeaderboardList`) and `#playerViewCustomLessonLockBanner` inside `Team Portal -> Player Login`, displaying shared Team Leaderboard standings while strictly hiding teammates' private diagnostic weaknesses and remedial controls.
- **Status:** **SHIPPED & VERIFIED (`seat6_CoachPortalTester = PASS`).**

### 💎 Seat 7 — App Store, Conversion & Growth Strategist
- **Audit of Persona 3 & Section 15 Telemetry:**
  1. Verified **Position-Specific & Cross-Position Hockey IQ Ratings (`#positionSpecificIqGrid`)** inside `#reportModal`, tracking `5v5 IQ`, `5v4 PP IQ`, and `4v5 PK IQ` across all 5 unit positions (`C, LW, RW, D, G` — e.g., `5v4 PP as LW = 88` vs. `as RW = 72`) with 1-click `🎓 Study Role` buttons.
  2. Verified **The "Well-Rounded Player" 100% Balance Pie Badge (`#wellRoundedBalanceBadge` — "Triple-B Player Performance Plan")** via `checkWellRoundedBalancePie()`, flagging any lopsided `<10%` proportional share slice.
- **Status:** **SHIPPED & VERIFIED (`seat7_GrowthStrategist = PASS`).**

### 📐 Seat 8 — Principal Full-Stack, Supabase & `<canvas>` Performance Engineer
- **Audit of Infrastructure & Security Guardrails:**
  1. Updated `CONTEXT.md` (~100 lines) indexing all 8 Supabase tables (`pucksense_profiles`, `pucksense_teams`, `pucksense_agent_inbox`, `tactix_adm_guidelines`, `tactix_concept_buckets`, `tactix_scenarios`, `tactix_video_channels`, `tactix_video_library`), key DOM IDs, and core functions.
  2. Verified `runPreCommitSecurityGuardrail()` in `deploy-github-pages.js` and `.gitignore` blocking `.tactix_gh_token`, `.env`, `ghp_`, `github_pat_`, `sb_secret_`, and `service_role` keys from ever being staged or pushed to GitHub.
  3. Verified `0` console/page errors and non-empty 2D & 3D `<canvas>` rendering across all 4 viewports.
- **Status:** **SHIPPED & VERIFIED (`seat8_PrincipalEngineer = PASS`).**

### 🎬 Seat 9 — Automated Video Harvester & Film-Room QC Auditor (NEW SEAT)
- **Charter:** Run `harvest-tactix-videos.js` against `public.tactix_video_channels` and `public.tactix_video_library`, verify every YouTube video ID via YouTube's official `oEmbed` API (`HTTP 200`), permanently blacklist dead/unrelated clips (`bSgfwvhIT7E`), enforce full-concept teaching windows (`23s–140s`, never cutting off mid-play at 12 seconds), verify `>= 2` segments per bucket across all 15 buckets (`8U` strictly `5v5` with `whiteboard_diagram` prioritized; `12U–18U` prioritizing `telestrator_breakdown` and `nhl_live_play`), and test `#videoExampleModal` multi-clip controls (`🔄 Watch Another Clip`, `⏪ Rewind 10s`, `🔄 Replay Segment`, `📋 Coach Bob 60fps Native Telestrator`).
- **Status:** **SHIPPED & VERIFIED (`seat9_VideoAuditor = PASS` — `16` channels, `39` verified segments across `15/15` buckets, `0` blacklisted IDs).**
