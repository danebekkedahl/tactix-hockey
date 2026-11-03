# 🧠 TACTIX HOCKEY — 7-Seat Professional Industry & Engineering Board Review (`LEARNING_COUNCIL_REPORT.md`)

**Agent:** `Council-Agent` (7-Seat Professional Industry & Engineering Board)  
**Target Build:** TACTIX HOCKEY v8.1 Nightly Auto-Pilot Pipeline (`RUN NIGHTLY AUTOPILOT`)  
**Date:** November 2, 2026  
**Inputs Audited:** `PLAYTEST_REPORT.md` (Stage 1 5-Persona Deep Playtest & Pixel/Graphics Suite), `deep_playtest_telemetry.json`, `FOUNDER_VISION_NOTES.md` (Sections 1–12), and `public.pucksense_agent_inbox` (`https://jrusjgpfcnptozfehcrv.supabase.co`).

---

## PART A — Scenario Factory & Curriculum Specification (`generate-tactix-bank.js`: `360` Cloud Scenarios across `15` Buckets)

Our 3-Bot Scenario Factory (`generate-tactix-bank.js`) maintains **360 QC-approved scenarios** (`5,760` dynamic permutations) across **15 NCAA D1 / AAA / USA Hockey ADM Concept Buckets**:

| Bucket # | `bucket_code` | Sub-Lesson Title | Source Authority | Age Divisions | `8U` ADM Rule |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Bucket 1** | `basics_support` | **Puck Support 101 & Attack Triangle Spacing** | USA Hockey ADM & Hockey Canada LTAD | `8U–18U` | Strictly `5v5`, `<=14w` |
| **Bucket 2** | `f1_f2_f3_roles` | **Dynamic Forward Roles: 🐂 F1 Bull, 🦊 F2 Fox, 🦅 F3 Eagle** | USA Hockey ADM / Weiss Tech | `8U–18U` | Strictly `5v5`, `<=14w` |
| **Bucket 3** | `dzone_house` | **Defensive Zone: Protect the House & Net-Side Stick** | USA Hockey ADM / D1 Systems | `8U–18U` | Strictly `5v5`, `<=14w` |
| **Bucket 4** | `offsides_rules` | **Blue-Line Offsides, Tag-Up & Delayed Entry Reads** | USA Hockey Rulebook & 10U ADM | `10U–18U` | **Blocked in `8U`** |
| **Bucket 5** | `breakout_d_to_d` | **D-to-D Breakout, Hashmarks Wall & Center Low-and-Slow Curl** | USA Hockey NTDP / Weiss Tech | `8U–18U` | `8U` foundational `5v5` only |
| **Bucket 6** | `rush_attack` | **Odd-Man Rushes: 2-on-1 & 3-on-2 Middle Lane Drive** | Hockey Canada / NHL Analytics | `10U–18U` | **Blocked in `8U`** |
| **Bucket 7** | `forecheck_systems` | **2-1-2 & 1-2-2 Forecheck Angling & Backcheck Track** | NCAA D1 / AAA Systems Playbook | `12U–18U` | **Blocked in `8U/10U`** |
| **Bucket 8** | `powerplay_5v4` | **5-on-4 Power Play Umbrella, Bumper & Flank One-Timer** | NHL / NCAA D1 Special Teams | `12U–18U` | **Blocked in `8U/10U`** |
| **Bucket 9** | `penaltykill_4v5` | **4-on-5 Penalty Kill Tight Box, Diamond & Royal-Road Seal** | NHL / NCAA D1 Special Teams | `12U–18U` | **Blocked in `8U/10U`** |
| **Bucket 10** | `deception_prescan` | **Pre-Scan Shoulder Check, Look-Off Deception & Hip Shield** | Pediatric Cognitive Sport Science | `10U–18U` | **Blocked in `8U`** |
| **Bucket 11** | `oz_cycle_scissors` | **O-Zone High-Low Cycle, Scissors Switch & D1 Pinch Backfill** | NCAA D1 / Weiss Tech O-Zone Playbook | `8U–18U` | Strictly `5v5`, `<=14w` |
| **Bucket 12** | `nz_regroup_hinge` | **Neutral Zone D-to-D Hinge Regroup & Weak-Side Speed Slash** | USA Hockey NTDP / Junior A Transition | `10U–18U` | **Blocked in `8U`** |
| **Bucket 13** | `dz_box_plus_one` | **D-Zone Box+1 Low-Slot Lock & Strong-Post Royal-Road Denial** | Hockey Canada LTAD & USA Hockey ADM | `8U–18U` | Strictly `5v5`, `<=14w` |
| **Bucket 14** | `goalie_screen_rebound` | **Goalie Sightline Box-Out, Stick Lift & Rebound Clearing** | USA Hockey Goaltending Model (Gold) | `8U–18U` | Strictly `5v5`, `<=14w` |
| **Bucket 15** | `faceoff_oz_win_play` | **O-Zone & D-Zone Faceoff Alignment & Win Set Plays** | NCAA D1 / AAA Special Situations | `8U–18U` | Strictly `5v5`, `<=14w` |

---

## PART B — 7-Seat Professional Industry & Engineering Board Prescriptions (`index.html` & `report.html`)

### 🏒 Seat 1 — NCAA D1 / AAA & USA Hockey Systems Director
* **Prescription:** Expose all **15 official cloud `bucket_code` options** directly in both `#selectCustomSystem` (`🛠️ Create My Own Lesson`) and `#selectCoachWeeklyFocus` (`🏒 Team Portal`) and ensure `getFilteredScenarios()` matches `s.bucket_code === state.conceptFilter || s.concept === state.conceptFilter` across all 5 positions (`C, LW, RW, D, G`).

### 🧠 Seat 2 — Pediatric Sports Psychologist & Cognitive Scientist
* **Prescription:** Trigger Coach Bob's `.coach-bob-state-mistake` chalkboard shake and `.coach-bob-state-celebrate` golden fist-pump bounce **immediately** inside `resolveAttempt()` (0ms latency upon play submission, before the 620ms puck/skater resolution animation completes) and support both `opts.stateMode` and `opts.mode` in `showCoachBobPopup(opts)` so `8U–18U` players receive immediate visual reinforcement.

### 🏆 Seat 3 — Mobile Game & EdTech Retention Designer
* **Prescription:** Keep `state.lastLoadedCityIdx` and `state.lastLoadedAgeGroup` synced in `getCurrentScenario()` so advancing across the 32 NHL Cities (`Rec -> B -> A -> AA -> AAA`) immediately serves fresh tier-matched drills and awards `1st-Choice Gold IQ` bonuses cleanly.

### 📱 Seat 4 — Native iPad / Phone Touch UX Architect
* **Prescription:** Eliminate all text truncation (`scrollWidth > clientWidth`) on `#coachBobPopup` header pills (`#cornerCoachTitle`, `#coachBobRoleCalloutBadge`, `#coachBobSituationTag`) and `tactical_choice` action cards in `#multiFormatControlsBar` by replacing `truncate` / `max-w-[250px]` with responsive `flex-wrap` and `whitespace-normal leading-tight`.

### 🧑‍💼 Seat 5 — Youth Hockey Coach & Association Director Liaison
* **Prescription:** Fix `#btnCopyLiveTeamShareLink` and `?team=` URL query param hydration to bind directly to `#sandboxTeamCodeInput` (`PUCK99`, `ASSOC-MINOT`, `ASSOC-FOOTHILLS`, `ASSOC-LIGHTNING`) so coaches can share 1-click association sign-in links.

### 💎 Seat 6 — App Store & Subscription Product Strategist
* **Prescription:** Ensure the Pro Custom Lesson Builder (`#upgradeModal`) and 6-Slice Performance Pie Chart (`#reportModal`) seamlessly filter all 15 cloud buckets and 5 positions (`C, LW, RW, D, G`) to demonstrate clear Tier 3 `Tactix Pro ($4.99/mo or $49.99/yr)` value.

### 🖥️ Seat 7 — Principal Full-Stack App & `<canvas>` Graphics Engineer *(NEW SEAT)*
* **Charter:** Analyzes Persona 5's pixel/bounding-box telemetry (`getBoundingClientRect()`), `<canvas>` 2D/3D POV rendering smoothness, Coach Bob cutout transitions, state management, and mobile responsiveness across all 4 viewports (`390x844`, `768x1024`, `1024x768`, `1280x800`).
* **Exact Code / CSS / `<canvas>` Prescriptions (Shipped in Stage 4):**
  1. **Unified Top HUD Stack (`#topRinkHudStack`):** Wrap `#situationContextBanner` and `#multiFormatControlsBar` inside a single `flex-col items-center gap-1.5` container at `top-2 left-1/2 -translate-x-1/2` so `#multiFormatControlsBar` never collides with a 2-line `#situationContextBanner` on `390x844` or `768x1024` (`0px` overlap).
  2. **Zero-Collision Coach Bob & Tactical Dock Layout:** Position `#coachBobPopup` at `bottom-[86px]` (`bottom: 86px`) above `#tacticalActionDock` (`bottom-2`) so Coach Bob's Reflex speech bubble and `#tacticalActionDock` can both remain visible and interactive simultaneously with `0px` bounding-box overlap across all 4 viewports.
  3. **Portrait Viewport Fit (`390x844` & `768x1024`):** In `@media (orientation: portrait)`, set `#rinkCanvasContainer { flex: 1 1 0% !important; min-height: 0 !important; }` and compact `#rightActionRibbon` padding/buttons so `#rightActionRibbon` never overflows past `844px` (`0` out-of-viewport elements).
  4. **Stage 4 Verification Sign-Off:** Re-ran `deep_playtest_audit.js` after applying all 7 Seat prescriptions — confirmed **`0` HUD overlaps, `0` out-of-viewport elements, `0` clipped text elements, `0` console errors, and `360/360` cloud scenarios live**.
