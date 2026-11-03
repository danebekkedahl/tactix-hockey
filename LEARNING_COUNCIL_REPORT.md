# TACTIX HOCKEY — STAGE 2: 3-POD / 10-SEAT BOARD REVIEW & 30-IDEA FOUNDER DIGEST (`Council-Agent`)

**Review Date:** November 2026 (`v8.4` Strict Blind 30-Drill Playtest Engine, 10-Seat `FOUNDER_VISION_NOTES.md` Visual Walk-Through & Live Google Apps Script Gmail Webhook Dispatch)  
**Input Telemetry:** `PLAYTEST_REPORT.md`, `deep_playtest_telemetry.json`, `CHANGELOG_DECISIONS.md`, & `FOUNDER_EMAIL_DIGEST_LATEST.html`  
**Scenario & Video Database Status:** `360 / 360` Clean Role-Matched Scenarios Live in `public.tactix_scenarios` (0 hardcoded `"Zone A"` strings, 0 mismatched role headers) + `39 / 39` QC-Approved Video Segments across `16` Channels Live in `public.tactix_video_library` + `30-Idea Board Digest` Dispatched Live via `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` (`HTTP 200 "SENT"`) to `danebekkedahl@gmail.com` and `evanbekk@gmail.com`  
**Board Governance Rule:** **`PASS / FAIL` Permanently Banned & 4-Step Domain Authority Hierarchy Enforced** — Every Seat on the 3-Pod / 10-Seat Board visually walks through its domain of the app against `FOUNDER_VISION_NOTES.md` and outputs **(A) What Was Observed Live**, **(B) What Can Be Better**, **(C) 3 Concrete Better Options for Coach Dane & Coach Evan**, and **(D) Live Code/Database Edit Shipped in This Run**, capped at **1 Consensus Winner Per Pod (`Max 3 Shipped Changes Per Run`)**.

---

## Part A — The 4-Step Domain Authority Hierarchy & 1-Upgrade-Per-Pod Cap

1. **Priority 1 — Founder Vision & `CHANGELOG_DECISIONS.md` (100% Immutable Veto):**
   - Nothing in `FOUNDER_VISION_NOTES.md` or `CHANGELOG_DECISIONS.md` (`LOCK-01` through `LOCK-12`) may ever be reversed by an automated run.
2. **Priority 2 — USA Hockey ADM & Pediatric Cognitive Safety (Seats 1 & 3 Veto):**
   - `8U` strictly `5-on-5 Even Strength`, `0` offsides/PK/PP/unannounced 3v3, and `<= 14 words` reading cap override all other seats.
3. **Priority 3 — 4-Seat Touch UX & Family Ergonomics (Seats 5 & 10 Veto):**
   - Any proposal that introduces overlapping HUD boxes, horizontal clipping, or multi-child data bleed on `390x844` Phone or `768x1024` iPad Portrait is automatically blocked.
4. **Priority 4 — Pod Votes & 1-Upgrade-Per-Pod Cap (Max 3 Shipped Changes Per Run):**
   - **Pod 1 Winner (`SHIPPED`):** **Blind Playtest Discrepancy Fixes #1 & #2** — Stripped all hardcoded `(Zone A/B/C)` strings from `generate-tactix-bank.js` (`360/360` scenarios updated in `public.tactix_scenarios`), added physical rink landmark labels (`describePhysicalRinkLandmark`) to `tap_zone` buttons (`Zone A / B / C`), preserved canonical `localScen` prompts in `ingestCloudScenarioRows`, and mirrored `short8U` directional terms when `mirrorY` is active.
   - **Pod 2 Winner (`SHIPPED`):** **Blind Playtest Discrepancy Fixes #3 & #4** — Locked `roleObj` in `generate-tactix-bank.js` to `seed.roleCode` across all 360 permutations so the `[F1/F2/F3/D1/D2]` header badge always matches Coach Bob's prompt 100%, and restricted `tap_player` question style strictly to `seed.puckHolder === 'YOU'`.
   - **Pod 3 Winner (`SHIPPED`):** **Strict Blind Playtester (`deep_playtest_audit.js`) + Live Google Apps Script Gmail Webhook (`send-board-digest.js`, `index.html`, `report.html`)** — Enforced zero answer-key peeking via a startup source-code self-audit (`0` forbidden tokens), removed `data-zone-rank` and `data-tactical-correct` spoiler attributes from `index.html`, and wired `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` (`HTTP 200 "SENT"` to `danebekkedahl@gmail.com` and `evanbekk@gmail.com`).

---

## Part B — All 10 Seats Walk-Through vs. `FOUNDER_VISION_NOTES.md` (`(A)–(D)` Continuous Improvement)

### Pod 1 — Player, Family & On-Ice Learning (`Seats 1–4`)
- **Seat 1 (NCAA D1 / AAA & USA Hockey Systems Director — `WHAT` Authority):**
  - **(A) What Was Observed Live:** Played 30 on-ice drills strictly blind across `8U, 10U, 12U, 14U, 16U, 18U` (`Rec -> B -> A -> AA -> AAA`). Identified that non-first-pass permutations in `generate-tactix-bank.js` previously rotated `roleObj` independently of `seed.roleCode` and included hardcoded `"Zone A"` strings when `index.html` rotated zone letters `A, B, C`.
  - **(B) What Can Be Better:** Every cloud scenario's `[Role • Position • Tier]` header and `tap_zone` button label should describe the physical rink landmark (`High Slot Triangle`, `Left Wing Hashmarks Wall`, `Low House Net-Front`) with 100% role agreement.
  - **(C) 3 Concrete Options:** `S1-A` (Physical Rink Landmark Labels + Role Header Lock — **🟢 Pod 1 Winner**), `S1-B` (Weak-Side D2 Hinge Angle Guide), `S1-C` (Vetoed: 8U Delayed Offsides).
  - **(D) Live Code/Database Edit Shipped:** Updated `generate-tactix-bank.js`, re-synced all `360/360` scenarios to `public.tactix_scenarios`, and added `describePhysicalRinkLandmark()` in `index.html`.
- **Seat 2 (Master Instructional Designer & Sports Teaching Strategist — `HOW` Authority):**
  - **(A) What Was Observed Live:** Walked through `Cue-First Read` (`triggerCueFirstHighlight`), `Contrastive Good-vs-Bad Replay` (`triggerContrastiveGoodBadReplay`), and `enforceAdmPromptWordLimit` for `8U` (`<= 14 words`). Observed that `ingestCloudScenarioRows` was overwriting canonical `localScen.coach_bob_prompt` with cloud seed prompts, and `short8U['basics-defense']` was not swapping `Left Point -> Right Point` when `mirrorY` was active.
  - **(B) What Can Be Better:** Canonical scenarios should retain their exact crafted 8U/12U prompts and swap directional terms when mirrored.
  - **(C) 3 Concrete Options:** `S2-A` (Canonical Prompt Preservation & Mirrored 8U Directional Swap — **🟢 Shipped with Pod 1**), `S2-B` (Pre-Scan Audio Chime), `S2-C` (Vetoed: 35-word 8U explanations).
  - **(D) Live Code/Database Edit Shipped:** Updated `ingestCloudScenarioRows`, `enforceAdmPromptWordLimit`, and `buildPermutedScenario` in `index.html`.
- **Seat 3 (Pediatric Cognitive & Family/Parent Specialist — `HOW` Authority):**
  - **(A) What Was Observed Live:** Walked visually through all 4 tabs of `#profileModal` (`Tab 1: Who's Playing?` 1-Tap Sibling Locker Stalls for `Miles #9`, `Rhett #88`, `Whelan #7`, `Cohen #14` with zero data bleed; `Tab 2: 3D Avatar & Gear`; `Tab 3: My IQ Pie Chart & PIP`; `Tab 4: Parent & Family HQ` with All-Kids Snapshot, Family House Cup, and Parent Age Division Lock).
  - **(B) What Can Be Better:** Keep the 1-Click Family Fridge & Car-Ride Praise Sheet (`#btnCopyFamilyCarRideSheet`) synced with live blind-playtest streak stats.
  - **(C) 3 Concrete Options:** `S3-A` (4-Tab Locker Room — Shipped), `S3-B` (1-Click Car-Ride Praise Sheet — Shipped), `S3-C` (Vetoed: Shared Sibling XP Pool).
  - **(D) Live Code/Database Edit Shipped:** Verified zero data bleed (`rhettAge='8U'`, `whelanAge='8U'`, `cohenAge='10U'`, `milesRestoredIq=188`) across all 4 sibling stalls in `deep_playtest_audit.js`.
- **Seat 4 (Hit Mobile Game & EdTech Retention Designer — `HOW FUN` Authority):**
  - **(A) What Was Observed Live:** Tested deliberate mistakes in `deep_playtest_audit.js` (`state.youPos = { x: 0.09, y: 0.89 }`) and verified `.coach-bob-state-mistake` shake animation, 2-hint cap, and `.coach-bob-state-celebrate` fist-pump bounce on `1st Choice Gold` reads.
  - **(B) What Can Be Better:** Ensure `tap_zone` and `tactical_choice` buttons never leak answer keys (`data-zone-rank` or `data-tactical-correct`) in DOM attributes.
  - **(C) 3 Concrete Options:** `S4-A` (Strip DOM Spoiler Attributes — **🟢 Shipped**), `S4-B` (Milestone Stanley Cup Banner), `S4-C` (Vetoed: Persistent Floating Coin Ticker Over Ice).
  - **(D) Live Code/Database Edit Shipped:** Removed `btn.dataset.zoneRank` and `btn.dataset.tacticalCorrect` from `renderMultiFormatControlsBar` in `index.html` (`spoilerCheck: { rankAttrs: 0, correctAttrs: 0 }`).

### Pod 2 — 4-Tab Coach & Director Portal + Team Flow (`Seats 5–7`)
- **Seat 5 (Youth, Travel & HS/Jr Team Head Coach Playtester — `WHAT` Authority):**
  - **(A) What Was Observed Live:** Walked visually through Coach Tab 1 (`Command Center & Practice Alerts`), Coach Tab 2 (`3-Step Weekly Homework Wizard`), and Coach Tab 3 (`22/22 Roster, Lines & Custom Role Mapper`), pushed an `oz_cycle_scissors` Weekly Homework assignment, switched to `Player Login`, and launched the assigned drill directly onto the ice.
  - **(B) What Can Be Better:** Restrict `tap_player` in `generate-tactix-bank.js` strictly to `seed.puckHolder === 'YOU'` so off-puck drills assigned by coaches never ask players to pass to a teammate who already has the puck.
  - **(C) 3 Concrete Options:** `S5-A` (On-Puck Only `tap_player` Rule — **🟢 Pod 2 Winner**), `S5-B` (Printable Practice Card Export), `S5-C` (Vetoed: Public Weakest-Player Callout on Team Leaderboard).
  - **(D) Live Code/Database Edit Shipped:** Restricted `tap_player` to `seed.puckHolder === 'YOU'` in `generate-tactix-bank.js` line 2177 and synced all 360 scenarios to Supabase.
- **Seat 6 (Association Hockey Director & Club GM Playtester — `WHAT` Authority):**
  - **(A) What Was Observed Live:** Walked visually through Coach Tab 4 (`Director HQ` multi-team roll-up across `ASSOC-MINOT`, `ASSOC-FOOTHILLS`, and `ASSOC-LIGHTNING`), pushed the Association-Wide Monthly Curriculum Standard, and verified the toast confirmation.
  - **(B) What Can Be Better:** Keep all 4 association division rows (`8U`, `10U`, `12U`, `14U+`) aligned with USA Hockey ADM division guardrails.
  - **(C) 3 Concrete Options:** `S6-A` (Director HQ Multi-Team Roll-Up — Shipped), `S6-B` (CSV Export of Association Compliance), `S6-C` (Seasonal Benchmark Snapshot).
  - **(D) Live Code/Database Edit Shipped:** Verified `directorRowsCount = 4` and `dirToastVisible = true` in `deep_playtest_audit.js`.
- **Seat 7 (Principal UX Architect & 4-Tab Anti-Clutter Lead — `WHERE` Authority + Veto):**
  - **(A) What Was Observed Live:** Walked visually through both 4-Tab Portals (`#profileModal` and `#teamManagerModal`) and the active rink HUD (`#situationContextBanner`, `#multiFormatControlsBar`, `#coachBobPopup`, `#tacticalActionDock`, `#rightActionRibbon`).
  - **(B) What Can Be Better:** Maintain `0` HUD overlaps and `0` out-of-viewport elements even when physical landmark labels `(High Slot Triangle)` are displayed on `tap_zone` buttons.
  - **(C) 3 Concrete Options:** `S7-A` (Compact Landmark Pill Formatting on `tap_zone` Buttons — **🟢 Shipped**), `S7-B` (Keyboard Shortcut Legend), `S7-C` (Vetoed: 5th Top-Level Tab).
  - **(D) Live Code/Database Edit Shipped:** Formatted `Pick Zone A (Landmark)` cleanly inside `#multiFormatControlsBar` in `index.html`.

### Pod 3 — Platform, Film-Room Videos, Pricing & Engineering (`Seats 8–10`)
- **Seat 8 (Automated Video Harvester & Film-Room QC Auditor):**
  - **(A) What Was Observed Live:** Opened `#videoExampleModal` on Q5 (`openConceptVideoModal`), tested `🔄 Watch Another Clip` (`cycleAnotherVideoForCurrentBucket`), `⏪ Rewind 10s` (`rewindConceptVideo10s`), and `📋 Coach Bob Native Telestrator` (`toggleVideoNativeTelestrator`) across our 39 verified clips and 16 trusted channels.
  - **(B) What Can Be Better:** Keep Coach-Pinned Video Clips (`#selectCoachPinnedVideoClip`) wired directly into Player Homework Inbox.
  - **(C) 3 Concrete Options:** `S8-A` (Role-Filtered Video Queue), `S8-B` (Clip Duration Badge), `S8-C` (Coach-Pinned Video Clip of the Week — Shipped).
  - **(D) Live Code/Database Edit Shipped:** Verified `videoModalOpen = true` and `telestratorOpen = true` in `deep_playtest_audit.js`.
- **Seat 9 (Principal Full-Stack, Supabase & `<canvas>` Engineer — `WHERE` Authority):**
  - **(A) What Was Observed Live:** Verified `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` across `send-board-digest.js`, `#founderDigestModal` in `index.html`, and `report.html`, and verified the startup self-audit in `deep_playtest_audit.js` (`forbiddenTokensChecked: 7, violationsFound: 0`).
  - **(B) What Can Be Better:** Dispatch a live HTML email via `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` at the end of every Stage 4 pipeline run and log `HTTP 200 "SENT"`.
  - **(C) 3 Concrete Options:** `S9-A` (Live Google Apps Script Gmail Webhook + Self-Audited Blind Playtester — **🟢 Pod 3 Winner**), `S9-B` (Offline Queue Retry), `S9-C` (Telemetry Diff Viewer).
  - **(D) Live Code/Database Edit Shipped:** Wired `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` in `send-board-digest.js`, `index.html`, and `report.html`, and added `verifyZeroAnswerKeyPeekingInSource()` in `deep_playtest_audit.js`.
- **Seat 10 (App Store, Conversion & Growth Strategist):**
  - **(A) What Was Observed Live:** Walked visually through the Free-Download 2-Portal Gate, 50% Partner Association Logo Discount Banner, 4-Tier Pricing Modal (`Free`, `Individual Monthly/Annual`, `Family Pass`, `Team/Association`), and `Create My Own Lesson` builder.
  - **(B) What Can Be Better:** Keep the 1-Click 50% Partner Club Activation Link (`#btnCopyDirectorPartnerDiscountLink`) front and center in Director HQ.
  - **(C) 3 Concrete Options:** `S10-A` (1-Click 50% Partner Club Activation Link — Shipped), `S10-B` (QR Code Poster Generator), `S10-C` (Tournament Weekend Trial Pass).
  - **(D) Live Code/Database Edit Shipped:** Verified all 4 pricing tiers and partner discount links in `deep_playtest_audit.js`.

---

## Part C — Section 23 Co-Founder Advisory Charter: Moving Plays vs. Static Setups & Ranked `#1–#30` 6-Field Proposals (`status: 'awaiting_founder_approval'`)

### 1. Special Co-Founder Board Evaluation (Seats 1, 2, 3 & 4 Consensus): Moving Plays vs. Static Setups Across `8U–18U` & `Rec–AAA`
- **8U & 10U (`Rec / B`) — Calm Static Default + Optional `[▶️ Watch 2s Lead-In]` Button:**
  - *Candid Reasoning (Seats 2 & 3):* Automatic motion on load causes 6–10 year olds to "puck-watch" the moving dot instead of scanning the Attack Triangle or The House. Start calm and static with a 1.0s pulsing gold `"YOU #9"` halo so kids orient which net they attack first.
- **10U (`A / AA / AAA`) & 12U (`Rec / B`) — `1.5s` Guided Slow-Roll (`0.65x` Speed) → Auto-Freeze at Decision Point:**
  - *Candid Reasoning (Seat 2):* Bridges static chalkboards to live hockey by showing direction of travel (who is curling vs. sealing the wall) without overwhelming working memory.
- **12U (`A / AA / AAA`) & 14U–18U (`All Tiers`) — `2.0s` Full-Speed Pre-Snap Motion Roll-In → Crisp "Skate-Stop Freeze":**
  - *Candid Reasoning (Seats 1 & 4):* At travel/HS/AAA speeds, closing speed and gap momentum ARE the read. A dead static snapshot hides whether D1's gap is tight or loose.

### 2. Top 3 Recommended Board Priorities (Awaiting Dane & Evan's 1-Click Approval)
1. **Rank `#1` (`S1-A` — Seat 1 Systems Director):** *2.0-Second Pre-Read Motion Roll-In Before Decision Freeze for 12U–18U (A/AA/AAA)*
   - **Target Scope:** `12U–18U (A / AA / AAA)` • On-Ice Rush, Breakout, Forecheck & Cycle Drills
   - **Candid Critique:** Dropping a 14U–18U AA/AAA player into a frozen static snapshot strips out closing velocity and gap momentum.
   - **Cross-Impact:** Kids (`12U–18U`), Coaches (Seat 5), Seat 2, Seat 4, Seat 9 (`<canvas>` 60fps interpolation).
   - **Live Screenshot:** `https://danebekkedahl.github.io/tactix-hockey/assets/audit-screenshots/seat1-on-ice-drill-setup.png`
   - **Approval Control:** `[✅ Approve for Next Build]` / `[❌ Reject]` in `report.html#founder-approval-board` and `#founderDigestModal`.
2. **Rank `#2` (`S2-A` — Seat 2 Instructional Designer):** *Tier-Scaled Motion Policy: Static Default + `[▶️ Watch 2s Lead-In]` for 8U/10U Rec–B vs. Auto Roll-In for 12U+ A–AAA*
   - **Target Scope:** All Divisions `8U–18U (Rec -> AAA)`
   - **Candid Critique:** One-size-fits-all auto-motion overwhelms 8U/10U beginners and triggers puck-watching; motion must scale by age and tier.
   - **Cross-Impact:** Protects 8U/10U Kids & Parents (Seat 3), satisfies Travel/AAA Coaches (Seat 1 & Seat 5), keeps HUD clean (Seat 7).
   - **Live Screenshot:** `https://danebekkedahl.github.io/tactix-hockey/assets/audit-screenshots/seat2-cue-first-roll-in.png`
   - **Approval Control:** `[✅ Approve for Next Build]` / `[❌ Reject]` in `report.html#founder-approval-board` and `#founderDigestModal`.
3. **Rank `#3` (`S5-A` — Seat 5 Team Head Coach Playtester):** *Coach-Pinned Film Clip + 3-Scenario Practice Pack in Weekly Homework Push*
   - **Target Scope:** Coach Portal Tab 2 + Player Login Inbox (`10U–18U` Teams)
   - **Candid Critique:** Players currently jump into a homework drill cold without seeing the 45s NHL/whiteboard film clip until Question 5. Real coaches teach "Film First, Then Rep It."
   - **Cross-Impact:** Coaches (Seat 5), Players (Seat 1 & Seat 2), Parents (Seat 3), Seat 8 (51-clip Film Room library).
   - **Live Screenshot:** `https://danebekkedahl.github.io/tactix-hockey/assets/audit-screenshots/seat5-coach-homework-wizard.png`
   - **Approval Control:** `[✅ Approve for Next Build]` / `[❌ Reject]` in `report.html#founder-approval-board` and `#founderDigestModal`.

