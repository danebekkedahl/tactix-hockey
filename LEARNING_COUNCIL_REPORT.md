# 🧠 TACTIX HOCKEY — 6-Seat Professional Industry Board Review (`LEARNING_COUNCIL_REPORT.md`)

**Agent:** `Council-Agent` (6-Seat Professional Industry Board)  
**Target Build:** TACTIX HOCKEY v8.0 Nightly Auto-Pilot Pipeline (`RUN NIGHTLY AUTOPILOT`)  
**Date:** November 2, 2026  
**Inputs Audited:** `PLAYTEST_REPORT.md` (Stage 1 Bot Audit), `FOUNDER_VISION_NOTES.md` (Sections 1–12), and `public.pucksense_agent_inbox` (`https://jrusjgpfcnptozfehcrv.supabase.co`).

---

## PART A — Scenario Factory Expansion Specification (`generate-tactix-bank.js`: `240 -> 360` Scenarios)

To expand our live Supabase curriculum in `public.tactix_concept_buckets` and `public.tactix_scenarios` from **10 buckets (240 permutations)** to **15 buckets (360 QC-approved permutations)**, the 6-Seat Industry Board specifies the following **5 new NCAA D1 / AAA / USA Hockey ADM Tactical Sub-Lessons** (24 permutations each = **120 new permutations**):

| Bucket # | `bucket_code` | Sub-Lesson Title | Source Authority | Age Divisions | `8U` ADM Rule |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Bucket 11** | `oz_cycle_scissors` | **O-Zone High-Low Cycle & Scissors Switch** | NCAA D1 / Weiss Tech O-Zone Playbook | `8U, 10U, 12U, 14U, 16U, 18U` | `8U` strictly `5v5` (`<=14w` triangle support in high slot) |
| **Bucket 12** | `nz_regroup_hinge` | **Neutral Zone D-to-D Hinge Regroup & Speed Seam** | USA Hockey NTDP / Junior A Transition | `10U, 12U, 14U, 16U, 18U` | **Strictly blocked in `8U`** (`10U+` Full-Ice Transition) |
| **Bucket 13** | `dz_box_plus_one` | **D-Zone Box+1 Net-Front Stick Lift & Royal-Road Denial** | Hockey Canada LTAD & USA Hockey ADM | `8U, 10U, 12U, 14U, 16U, 18U` | `8U` strictly `5v5` (`<=14w` net-side House protection) |
| **Bucket 14** | `goalie_screen_rebound` | **Goalie Sightline Screen Look-Around & Corner Rebound Steering** | USA Hockey Goaltending Model (Gold) | `8U, 10U, 12U, 14U, 16U, 18U` | `8U` strictly `5v5` (`<=14w` top-of-crease square angle) |
| **Bucket 15** | `faceoff_oz_win_play` | **O-Zone Faceoff Win Set Play & Point Activation** | NCAA D1 / AAA Special Situations | `8U, 10U, 12U, 14U, 16U, 18U` | `8U` strictly `5v5` (`<=14w` hashmarks slot shot support) |

### Mandatory Tuning on Existing & New Permutations (Stage 1 Audit Fix)
1. **Decoupled Tier × Age Rotation (`10U AAA` Depth Fix):**
   * In `generate-tactix-bank.js`, decouple the `tier_level` index (`['Rec', 'B', 'A', 'AA', 'AAA'][(idx + Math.floor(idx / 5)) % 5]`) from the `age_division` index (`idx % 6`) and include `10U` in `AAA`-tier `allowed_divisions` for all `10U`-eligible buckets so `10U AAA` has 60+ candidate scenarios instead of 2.
2. **Strict `8U` ADM Verification:**
   * All `8U`-allowed scenarios across all 15 buckets (`360` total scenarios) must be `5-on-5 Even Strength`, `<= 14 words` in `coach_bob_prompt`, with `0` offsides, `0` `5v4` Power Play, `0` `4v5` Penalty Kill, and `0` unannounced `3v3`.

---

## PART B — Main App Code Builder Specification (`index.html` & `report.html` Upgrades Across All 6 Industry Seats)

### 🏒 Seat 1 — NCAA D1 / AAA & USA Hockey Systems Director
* **Upgrade:** Fix `loadScenario()` in `index.html` so that changing `state.currentCityIdx` or `prof.ageGroup` automatically invalidates `state.activeScenarioInstance` (tracking `state.lastLoadedCityIdx` and `state.lastLoadedAgeGroup`), and update `getFilteredScenarios()` to prioritize scenarios matching the active city stop's Mathseeds skill tier (`Rec -> B -> A -> AA -> AAA`) when `state.conceptFilter === 'all'`.

### 🧠 Seat 2 — Pediatric Sports Psychologist & Cognitive Scientist
* **Upgrade:** Add a live **`#coachBobRoleCalloutBadge`** pill inside Coach Bob's lower-left Reflex pop-up (`#coachBobPopup`) that automatically displays the player's real-time dynamic proximity role on that play (e.g., `YOU = 🐂 F1 Bull`, `YOU = 🦊 F2 Fox`, `YOU = 🦅 F3 Eagle`, `YOU = 🛡️ D1`, `YOU = 🏰 D2`, or `YOU = 🥅 G`) so `8U–18U` skaters connect Coach Bob's verbal cue to their exact on-ice role badge before moving.

### 🏆 Seat 3 — Mobile Game & EdTech Retention Designer
* **Upgrade:** Add a **`1st-Try Gold IQ Tier Bonus (+15 PuckBucks)`** celebration callout when a player nails the `1st Choice Optimal (100% Gold IQ)` read on a play, and update the cloud library counter badges across the UI to reflect all **360 QC-Verified Cloud Scenarios across 15 Tactical Buckets**.

### 📱 Seat 4 — Native iPad / Phone Touch UX Architect
* **Upgrade:** Wire all **15 tactical concept buckets** cleanly into `#selectCustomSystem` (`🛠️ Create My Own Lesson`), `#selectCoachWeeklyFocus` (`🏒 Team Portal`), and the 6-Slice Hockey IQ Performance Pie Chart (`computeSixSlicePieStats`) so players and coaches can filter or drill down into `O-Zone Cycle & Scissors`, `NZ D-to-D Hinge Regroup`, `D-Zone Box+1 Royal Road`, `Goalie Screens & Rebounds`, and `O-Zone Faceoff Set Plays` on any phone or iPad screen.

### 🧑‍💼 Seat 5 — Youth Hockey Coach & Association Director Liaison
* **Upgrade:** Add a 1-tap **`📋 Share Live Team Link & Code`** button (`#btnCopyLiveTeamShareLink`) inside the Sandbox/Portal Gate (`#sandboxLoginModal`) and Coach Portal (`#teamManagerModal`) that copies `"Join our team on TACTIX HOCKEY (https://danebekkedahl.github.io/tactix-hockey/) using Team/Association Code: <CODE>"` to the clipboard with an instant confirmation toast.

### 💎 Seat 6 — App Store & Subscription Product Strategist
* **Upgrade:** Update `#pricingAndPlansModal` (`Tier 3: Tactix Pro`) and `#successStoriesModal` to highlight the expanded **360+ Tagged Cloud Scenario Library & 15 D1/AAA Concept Buckets**, reinforcing the upgrade value of `Tactix Pro ($4.99/mo or $49.99/yr)` and the `50% Partner Association Coach Discount ($49.99/yr)`.
