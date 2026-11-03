# TACTIX HOCKEY — STAGE 2: 9-SEAT PROFESSIONAL INDUSTRY, TEACHING STRATEGY, 4-LEVEL COACH PANEL, ENGINEERING & VIDEO QC BOARD REVIEW (`Council-Agent`)

**Review Date:** November 2026 (v8.1 Clean `F1–F3 / D1–D2` Base Default, Single-Label Role Mapper, 5 Coach Customizations & 4-Level Coach Playtester)  
**Input Telemetry:** `PLAYTEST_REPORT.md`, `deep_playtest_telemetry.json`, & `tactix_video_library_snapshot.json` (5-Persona & 9-Seat Deep Playtest Suite across 4 Viewports)  
**Scenario & Video Database Status:** `360 / 360` Clean Scenarios Live in `public.tactix_scenarios` + `39 / 39` QC-Approved Video Segments across `16` Channels Live in `public.tactix_video_library` + `3` Teams (`PUCK99`, `ASSOC-MINOT`, `ASSOC-FOOTHILLS`) Synced in `public.pucksense_teams`  
**Board Governance Rule:** **`PASS / FAIL` Permanently Banned** — Every Seat on the 9-Seat Board outputs **(A) What Was Observed Live**, **(B) What Can Be Better**, **(C) 3 Concrete Better Options for Coach Dane & Coach Evan**, and **(D) Live Code/Database Edit Shipped in This Run**.

---

## Part A — Scenario Bank (`public.tactix_scenarios`), Cloud Video Library (`public.tactix_video_library`) & Team Customizations (`public.pucksense_teams`) Spec

1. **Clean Base Default (`F1, F2, F3, D1, D2`) Across All 360 Cloud Scenarios:**
   - Updated `DYNAMIC_ROLES` and `cleanRoleTerminology(text)` in `generate-tactix-bank.js` and re-ran the 3-Bot Scenario Factory against live Supabase (`public.tactix_scenarios`, `public.tactix_concept_buckets`, `public.tactix_adm_guidelines`).
   - Verified in Bot #3 (`runQualityControlGate`) that zero `"🐂"`, `"🦊"`, `"🦅"`, `"🛡️"`, `"🏰"`, `"F1 Bull"`, `"F2 Fox"`, `"F3 Eagle"`, `"Wolf"`, or `"Hawk"` strings appear in any of the `360/360` cloud rows.
2. **Strict Single-Label Replacement (`applyRoleLabelMap(text)`):**
   - When a coach or Pro subscriber customizes role names via `setRoleLabelMap(newMap)` (e.g., setting `F1 -> "Bull"`, `F2 -> "Fox"`, `F3 -> "Eagle"`, or `F1 -> "Pressure"`), `applyRoleLabelMap(text)` normalizes base text and swaps whole-word `\b(F1|F2|F3|D1|D2)\b` -> `map[code]` so on-ice badges, `"Who Am I?"` buttons, and Coach Bob prompts before and after the play **ONLY** say `"Bull"` (never `"F1 Bull"` or `"Bull and F1"`).
3. **Cloud Persistence of the 5 Multi-Level Coach Portal Customizations (`public.pucksense_teams`):**
   - `PuckSenseCloud.upsertTeam()` and `fetchTeamByCode()` sync `coach_customizations` (`roleLabelMap`, `teamPlaybookSystems`, `targetGroup`, `teamJerseyColors`, `teamCoachingPace`, `activeCoachLevel`) inside `weekly_assignments[0]` across `PUCK99`, `ASSOC-MINOT`, and `ASSOC-FOOTHILLS`.

---

## Part B — The 9-Seat Continuous-Improvement Board Reviews (`(A)` Observed • `(B)` What Can Be Better • `(C)` 3 Concrete Options • `(D)` Live Edit Shipped)

### 🏒 Seat 1 — NCAA D1 / AAA & USA Hockey Systems Director
- **(A) What Was Observed Live:** Inspected `360` live cloud scenarios across all 15 Concept Buckets (`24` per bucket) and all 5 positions (`C, LW, RW, D, G`). Out-of-the-box role buttons (`F1, F2, F3, D1, D2`), on-ice token pills, and Coach Bob prompts render strictly clean `F1, F2, F3, D1, D2` with zero animal emojis or double-labels. Tested `applyRoleLabelMap()` with `F1 -> "Bull"`, `F2 -> "Fox"`, `F3 -> "Eagle"` and confirmed single-label output (*"You are Bull! Angle R1 toward the corner boards while Fox seals the wall and Eagle holds the high slot!"*) with zero `"F1 Bull"` or `"Bull and F1"` collisions.
- **(B) What Can Be Better:** When coaches customize role terminology or switch team forecheck/breakout systems (`2-1-2 Aggressive` vs. `1-2-2 Trap` vs. `LW Lock`), scenarios in the Forecheck and Breakout buckets can dynamically prioritize drills that match the team's active system playbook.
- **(C) 3 Concrete Better Options for Coach Dane & Coach Evan:**
  1. **Dynamic System Playbook Drill Priority:** Sort `getFilteredScenarios()` so drills matching `state.teamPlaybookSystems` appear first in team homework.
  2. **Weak-Side `D2` Net-Front Stick-Lift Micro-Read:** Add an explicit stick-lift timing window on DZ Protect the House drills when the puck carrier attempts a royal-road seam pass.
  3. **Off-Puck `F3` High-Slot Reload Mirroring:** Highlight the `F3` high-slot triangle apex relative to the pinching `D1` defenseman on OZ cycle scissors drills.
- **(D) Live Code/Database Edit Shipped in This Run:** Stripped all combined `"🐂 F1 Bull"`, `"🦊 F2 Fox"`, `"🦅 F3 Eagle"`, `"🛡️ D1"`, `"🏰 D2"` double-labels across `index.html`, `generate-tactix-bank.js`, and `360/360` rows in `public.tactix_scenarios`, and shipped `cleanBaseRoleString()` + `applyRoleLabelMap(text)` for strict single-label role swaps.

### 🎓 Seat 2 — Master Instructional Designer & Sports Teaching Strategist
- **(A) What Was Observed Live:** Verified Cue-First Visual Highlighting (*"👀 CUE FIRST: Spot the puck and protect The House!"*) defaults `ON` for `Rec/B/A` tiers and fades to on-demand for `AA/AAA` tiers, and confirmed Contrastive Good-vs-Bad Read Replay animates the `❌ Youth Mistake` vector alongside the `✅ 1st Choice Gold` path.
- **(B) What Can Be Better:** Players who miss a read or trigger a Contrastive Replay benefit when Coach Bob's verbal/written explanation and visual scaffolding automatically respect the coaching pace configured by their team coach.
- **(C) 3 Concrete Better Options for Coach Dane & Coach Evan:**
  1. **Coach Pace-Aware Scaffolding:** Wire `state.teamCoachingPace` (`relaxed_no_clock` vs. `pro_speed_no_hints`) directly into `loadScenario()` so youth volunteer coaches can keep Cue-First visual hints `ON` with no clock pressure while AAA/Jr coaches can enforce `4.5s` blind reads.
  2. **3-Play Micro-Arc Progression:** Group each city's 10 questions into three 3-play micro-arcs (`Play 1: Cue-First Guided` → `Play 2: Faded Cue` → `Play 3: Game-Speed Test`) plus a `Q10 Boss Read`.
  3. **Post-Play "Why Did D1 Bite?" Freeze Callout:** After a Look-Off Fake (`+5 IQ`), display a `1.5s` vector showing how the `22°` hip/blade shift widened the passing seam.
- **(D) Live Code/Database Edit Shipped in This Run:** Wired `state.teamCoachingPace` (`default`, `relaxed_no_clock`, `pro_speed_no_hints`) into `loadScenario()` so Cue-First visual highlights, Coach Hints, and decision clocks automatically adapt to the coach's selected pace.

### 🧠 Seat 3 — Pediatric Cognitive & Age-Scaling Specialist (`8U–18U`)
- **(A) What Was Observed Live:** Verified `8U` self-evaluation is `13 words` (*"🌟 Awesome Attack Triangles! Keep your stick on the ice in The House!"*, strictly `<= 14 words`), `8U` Coach Bob prompts are capped at `<= 14 words` with clean `F1/F2/F3/D1/D2` role labels, `18U` self-evaluation delivers a `46-word` AAA/Junior film-room breakdown, and `AA/AAA` tiers fade Cue-First training wheels to on-demand.
- **(B) What Can Be Better:** `8U` and `10U` youth volunteer coaches often want a 1-tap way to switch between standard USA Hockey role labels (`F1, F2, F3`) and kid-friendly animal role nicknames (`Bull, Fox, Eagle`) without double-labeling.
- **(C) 3 Concrete Better Options for Coach Dane & Coach Evan:**
  1. **1-Tap Youth Animal vs. Standard Role Presets:** Provide instant 1-tap presets in the Coach Portal (`#btnPresetRoleStandard` and `#btnPresetRoleAnimal`) that swap `F1 ↔ Bull`, `F2 ↔ Fox`, `F3 ↔ Eagle` cleanly with zero double-labels.
  2. **Audio-First Icon Badges for `8U`:** Pair `8U <= 14-word` prompts with automatic Coach Bob voice narration so early readers never have to decode dense text.
  3. **Adaptive Spaced-Repetition Cooldown:** Space out remedial permutation drills by at least 2 questions so `8U/10U` players never feel stuck on the same play.
- **(D) Live Code/Database Edit Shipped in This Run:** Updated `enforceAdmPromptWordLimit()` and `getAgeScaledRolePromptSuffix()` to normalize all `8U–18U` prompts through `applyRoleLabelMap()` while strictly enforcing `<= 14 words` for `8U`.

### 🏆 Seat 4 — Hit Mobile Game & EdTech Retention Designer
- **(A) What Was Observed Live:** Verified the 32-Team NHL Tour Map (`Rec → B → A → AA → AAA`), Coach Bob's 3-state Reflex animations (`.coach-bob-state-talking`, `.coach-bob-state-mistake`, `.coach-bob-state-celebrate`), Pro Gear Shop 360° 3D avatar preview, 3D Trophy Room Prestige Cups, and on-ice Team Jersey Color customization.
- **(B) What Can Be Better:** When a coach customizes their team's primary and secondary jersey colors in the Coach Portal, seeing those exact team colors reflected on every teammate token on the ice sheet builds immediate team identity and pride.
- **(C) 3 Concrete Better Options for Coach Dane & Coach Evan:**
  1. **Live On-Ice Team Jersey Color Rendering:** Render all teammate tokens in 2D Rink, 3D POV, and Live Shift using `state.teamJerseyColors.primary` synced from the Coach Portal.
  2. **Position-Group Homework Completion Streaks:** Award a `+15` Team Co-Op Stanley Cup bonus whenever a targeted position group (`Forwards`, `Defensemen`, `Centers`, or `Goalies`) completes their weekly series.
  3. **Custom Team Color Banner in Locker Room:** Tint the Team Leaderboard header accent to match `state.teamJerseyColors.primary`.
- **(D) Live Code/Database Edit Shipped in This Run:** Wired `state.teamJerseyColors` (`{ primary, secondary }`) into `drawScenarioEntities()`, `drawFirstPersonPovRink()`, and `drawLiveShiftEntities()` plus 4 quick-tap NHL/Youth jersey color presets in `#coachJerseyAndPacePanel`.

### 📱 Seat 5 — Native iPad / Phone Touch UX & Anti-Clutter Architect
- **(A) What Was Observed Live:** Verified `0` HUD overlaps, `0` out-of-viewport elements, and `0` clipped text across all 4 viewports (`Phone 390x844`, `iPad Portrait 768x1024`, `iPad Landscape 1024x768`, `Desktop 1280x800`). Stripping animal emojis and double-labels from the default `F1, F2, F3, D1, D2` buttons reduced horizontal pill width in `#dockRoleReadBar` by `~38%` on `390px` phone screens.
- **(B) What Can Be Better:** As we added the 5 Multi-Level Coach Portal Customizations and 4-Level Coaching Perspective Switcher inside `#teamManagerModal`, keeping them organized in a responsive 2-column grid ensures coaches on iPads and phones can configure their team without excessive vertical scrolling.
- **(C) 3 Concrete Better Options for Coach Dane & Coach Evan:**
  1. **Compact 2-Column Coach Customization Grid:** Lay out `#coachRoleTerminologyPanel` and `#coachTeamSystemPlaybookPanel` side-by-side on tablet/desktop (`grid-cols-1 lg:grid-cols-2`) with 1-tap preset pills.
  2. **Single-Word Role Pill Truncation Guard:** Cap custom role inputs (`#inputRoleMapF1..D2`) at `maxlength="12"` so custom team labels never overflow on-ice token pills.
  3. **Sticky Save & Sync Bar:** Keep `#btnSaveCoachCustomizations` immediately reachable at the bottom of the Coach Customization panel.
- **(D) Live Code/Database Edit Shipped in This Run:** Built the responsive 2-column `#coachMultiLevelCustomizationsBox` with `maxlength="12"` role inputs and clean single-label `F1–F3 / D1–D2` pills that prevent horizontal crowding on `390x844` phones.

### 🧢 Seat 6 — 4-Level Coaching Panel Playtester (`Level A: 8U/10U Volunteer`, `Level B: 12U/14U AA/AAA Travel`, `Level C: 16U/18U HS/Jr`, `Level D: Association Director`)
- **(A) What Was Observed Live:** Playtested the Coach Portal across all 4 Coaching Levels: (1) `Level A (8U/10U Volunteer)`: verified 1-tap `Bull/Fox/Eagle` vs. `Standard F1–F3` presets, `Relaxed No-Clock` pace override, and Team Co-Op Cup progress; (2) `Level B (12U/14U AA/AAA Travel)`: verified Team System Playbook selector (`2-1-2 Aggressive • Protect the House • D-to-D Over`) and Position-Group Homework Targeting (`🛡️ Defensemen Only (D-Pairs 1–3)`); (3) `Level C (16U/18U HS/Jr)`: verified `5v4 PP` / `4v5 PK` system selectors and `AAA/Jr Pro Speed` (`4.5s` clock / `0` hints) override; (4) `Level D (Association Director — ASSOC-MINOT & ASSOC-FOOTHILLS)`: verified 22-seat roster cap (`21/22` after kick, `22/22` after add), and Player Login privacy boundaries.
- **(B) What Can Be Better:** Coaches assigning position-group homework (e.g., `"Defensemen Only (D-Pairs 1–3)"`) or Association Directors managing multiple age divisions can benefit from seeing which specific roster players belong to the targeted position group directly in the Compliance & Scouting Alert table.
- **(C) 3 Concrete Better Options for Coach Dane & Coach Evan:**
  1. **Target-Group Filter Pill in Compliance Table:** Highlight roster members matching the active homework `targetGroup` (`Forwards`, `Defensemen`, `Centers`, or `Goalies`) inside `#coachComplianceAlertTable`.
  2. **Printable 1-Page Locker Room System Poster:** Let coaches export their Team System Playbook + Custom Role Terminology as a 1-page locker-room PDF/print sheet.
  3. **Association Multi-Team Switcher Dropdown:** Allow Level D Association Directors (`ASSOC-MINOT` / `ASSOC-FOOTHILLS`) to toggle between `8U`, `10U`, `12U`, and `14U` team rosters in 1 click.
- **(D) Live Code/Database Edit Shipped in This Run:** Built and wired the 4-Level Coaching Perspective Switcher (`#coachLevelPerspectiveSelector`) + all 5 Multi-Level Coach Portal Customizations synced to `public.pucksense_teams` (`PUCK99`, `ASSOC-MINOT`, `ASSOC-FOOTHILLS`).

### 💎 Seat 7 — App Store, Conversion & Growth Strategist
- **(A) What Was Observed Live:** Verified the Free-Download 2-Portal Gate (`#sandboxLoginModal`), `50%` Partner Association Logo Banner, 4-Tier Pricing Modal (`$15.99/mo` Pro, `$29.99/mo` Family, `$249/season` Team), Position-Specific & Cross-Position IQ Ratings (`5` position cards comparing `5v5`, `5v4 PP`, and `4v5 PK` IQ), and the `100%` Well-Rounded Balance Pie.
- **(B) What Can Be Better:** When a coach customizes their team's system playbook and role terminology on a `$249` Team Pass, surfacing the team's active Playbook and Target Group badges inside the Player Homework Inbox increases parent engagement and upgrades to Personal Pro.
- **(C) 3 Concrete Better Options for Coach Dane & Coach Evan:**
  1. **Playbook-Synced Player Inbox Badges:** Display `#playerInboxTargetGroupBadge` and `#playerInboxPlaybookBadge` inside `#playerCoachInboxCard` next to the Personal Pro Custom Lesson Builder callout.
  2. **1-Click Coach Invite Text Message Template:** Generate a pre-written SMS/GroupMe snippet with the team code and live GitHub Pages URL for team managers.
  3. **Association Bulk-Quote Calculator:** Add an interactive team-count slider inside the Association Partner card for 50% logo-co-branded quotes.
- **(D) Live Code/Database Edit Shipped in This Run:** Added `#playerInboxTargetGroupBadge` and `#playerInboxPlaybookBadge` directly inside the Player Homework Inbox card (`#playerCoachInboxCard`) alongside the Personal Pro Custom Lesson Builder upgrade callout.

### 📐 Seat 8 — Principal Full-Stack, Supabase & `<canvas>` Performance Engineer
- **(A) What Was Observed Live:** Verified `0` console errors, `0` page errors, 60fps `<canvas>` rendering in both 2D Rink and 3D POV across all 4 viewports, `CONTEXT.md` architectural fast-map indexing all 8 Supabase tables, and `deploy-github-pages.js` pre-commit security guardrails blocking `.tactix_gh_token` and secret keys.
- **(B) What Can Be Better:** Persisting `coach_customizations` (`roleLabelMap`, `teamPlaybookSystems`, `targetGroup`, `teamJerseyColors`, `teamCoachingPace`, `activeCoachLevel`) inside `weekly_assignments` JSONB on `public.pucksense_teams` enables zero-migration cloud sync across all team codes (`PUCK99`, `ASSOC-MINOT`, `ASSOC-FOOTHILLS`).
- **(C) 3 Concrete Better Options for Coach Dane & Coach Evan:**
  1. **Cloud Sync for Coach Customizations:** Embed `coach_customizations` inside `public.pucksense_teams.weekly_assignments[0]` on `upsertTeam()` and auto-restore in `fetchTeamByCode()`.
  2. **Unicode-Safe Regex Sanitizer in Scenario Factory:** Use `/u` Unicode code-point escapes in `cleanRoleTerminology()` and `cleanBaseRoleString()` so UTF-16 surrogate pairs never split during JSON serialization.
  3. **Service Worker Cache Version Bump:** Bump `sw.js` `CACHE_NAME` to `'tactix-hockey-v8.1'` on deploy so mobile/iPad PWAs immediately pull the latest `index.html`.
- **(D) Live Code/Database Edit Shipped in This Run:** Wired `PuckSenseCloud.fetchTeamByCode()` and `PuckSenseCloud.upsertTeam()` to persist and restore `coach_customizations` across `PUCK99`, `ASSOC-MINOT`, and `ASSOC-FOOTHILLS` in live Supabase, and updated `cleanRoleTerminology()` with Unicode-safe regexes.

### 🎬 Seat 9 — Automated Video Harvester & Film-Room QC Auditor (`harvest-tactix-videos.js`)
- **(A) What Was Observed Live:** Audited `39` oEmbed-verified video segments across `16` trusted channels covering all 15 Concept Buckets (`>= 2` clips/bucket, `0` blacklisted IDs, full-concept `23s–140s` teaching windows). Confirmed `8U Rec` prioritizes `whiteboard_diagram` clips with `0` offsides/PK/PP clips, `16U AAA` prioritizes pro `telestrator_breakdown` / `nhl_live_play` film, and `#videoExampleModal` cleanly cycles `Clip 1 of 2` → `Clip 2 of 2` and hands off to Coach Bob's 60fps Native Telestrator.
- **(B) What Can Be Better:** Video takeaway text (`#videoCoachBobTakeawayText`) and film-quiz prompts inside `#videoExampleModal` should use clean `F1, F2, F3, D1, D2` base terminology so Film Room breakdowns align 100% with the on-ice role mapper.
- **(C) 3 Concrete Better Options for Coach Dane & Coach Evan:**
  1. **Role-Mapped Film Room Takeaways:** Clean all `DEFAULT_CLOUD_VIDEO_LIBRARY` takeaways to base `F1, F2, F3, D1, D2` and pass `#videoCoachBobTakeawayText` through `applyRoleLabelMap()`.
  2. **Coach Playbook Video Filter:** Prioritize video clips whose tags match the coach's selected Team System Playbook (e.g., `1-3-1 Umbrella` vs. `Overload`).
  3. **Coach-Assigned Film Clip of the Week:** Let coaches pin 1 specific clip from `public.tactix_video_library` to their weekly homework push.
- **(D) Live Code/Database Edit Shipped in This Run:** Cleaned all `DEFAULT_CLOUD_VIDEO_LIBRARY` and `CONCEPT_VIDEOS` takeaways in `index.html` to base `F1, F2, F3, D1, D2` terminology so Film Room breakdowns align 100% with the on-ice role mapper.
