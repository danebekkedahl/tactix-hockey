# 🏒 SYNAPZ HOCKEY — PLAY. LEARN. DOMINATE. | Founder Vision, Product Architecture & Multi-Agent Pipeline (`FOUNDER_VISION_NOTES.md`)

**Official Slogan:** `PLAY. LEARN. DOMINATE.`  
**Platform Sub-Badge:** `HOCKEY IQ & STRATEGY PLATFORM`  
**Founders:** Dane Bekkedahl & Evan Bekkedahl  
**Date:** November 2, 2026  
**Last Synced:** November 11, 2026 (Through Section 35 • `v11.2-173-verified-and-6position-pilot-bank`)  
**Purpose:** Master architectural specification synthesized from Founder strategy sessions. All Antigravity agents (`Main App Code Page`, `Synapz Hockey Learning Council Report`, and `Youth Hockey Playtest Report`) must treat this document as the authoritative product roadmap alongside `AGENT.md` and `LEARNING_COUNCIL_REPORT.md`.

## 1. The 4-Agent Curriculum & Quality Control Pipeline (Zero Unchecked AI Content)

**Core Rule:** AI must **never** invent scenarios on the fly and push them directly into live player gameplay without verification. Every scenario, question permutation, and remediation drill must pass through a strict **4-Stage Multi-Agent Pipeline** before unlocking for players:

| Pipeline Stage | Agent Role | Core Responsibilities | Output Artifact |
| :--- | :--- | :--- | :--- |
| **Stage 1: Data Scouring** | **Elite Playbook Harvester Agent** | Scours NCAA D1, Junior A/B (USHL, NAHL, BCHL), Tier 1 AAA, High School 5A, and USA Hockey Development Model chalk-talks, coaching clinics, and playbooks (such as the Weiss Tech Hockey Playbook and Ice Hockey Systems Library). | Verified raw tactical snapshots & coaching consensus notes. |
| **Stage 2: Consensus & Graded Scoring** | **Tactical Consensus Analyst Agent** | Evaluates each snapshot across coaching consensus to rank **1st Best Option (100% Gold IQ)**, **2nd Best Option (80% Silver IQ)**, and **3rd Acceptable Option (60% Bronze IQ)** ("The Miles vs. Rhett Rule"). Accounts for puck movement direction, stick blade orientation, and position roles (`C`, `LW`, `RW`, `LD`, `RD`, `G`). | Structured JSON scenario spec with graded target zones and tactical rationales. |
| **Stage 3: Lesson & Permutation Design** | **Pedagogical Lesson Architect Agent** | Chooses the optimal interactive question format (*Find the Space*, *Match the Player*, *Best Option Ranking*, *2-Step Spot the Mistake*, *Active Film Study*, *Pre-Scan + Deception*) and generates **6–12 permutations per sub-lesson** (Full Ice, Half Ice, `5v5`, `4v4`, `3v3`, `5v4 Power Play`, `4v5 Penalty Kill`). | 12-question sub-lesson bank per tactical concept across all 6 age divisions. |
| **Stage 4: Pre-Release Quality Gate** | **QA & Youth Cognitive Gatekeeper Agent** | Runs an automated browser/logic audit verifying that Coach Mack's voice prompt matches the exact evaluation coordinates, checks age-appropriate reading length (`8U` ultra-short 1-sentence prompts vs. `16U/18U` deep tactical reads), and blocks any broken or confusing drill from entering gameplay. | `"status": "APPROVED_FOR_GAMEPLAY"` badge required before rendering in `index.html`. |

## 2. Graded Consensus Scoring ("The Miles vs. Rhett Rule")

Hockey positioning is dynamic and situational—two spots on the ice can both be defensible depending on whether a player is cutting off a high passing seam or dropping low to support the corner battle.

* **Multi-Zone Ranked Evaluation (`targetZones[]`):**
  * Instead of a single binary `targetZone` (pass/fail), every spatial and pass-decision scenario supports up to **3 Ranked Consensus Zones**:
    1. **🥇 1st Choice — Consensus Optimal Play (`100% Points` / `+10 IQ`):** The highest-percentage play endorsed by D1/AAA/USA Hockey consensus for the exact puck vector and defender stick angle.
    2. **🥈 2nd Choice — Strong Secondary Read (`75%–85% Points` / `+7 IQ`):** A smart, defensible hockey read (e.g., staying slightly higher in the high slot to intercept a seam pass while still able to drop down). Coach Mack validates the read: *"Good hockey sense! You cut off the high seam—dropping 10 feet lower toward the dot gives you an even cleaner one-timer angle as the puck moves up the wall."*
    3. **🥉 3rd Choice — Safe Conservative Option (`50%–60% Points` / `+5 IQ`):** Safe positioning that doesn't hurt the team, with coaching feedback on how to be more dangerous or assertive.
    4. **❌ Turnover / Out-of-Structure Zone (`0% Points`):** Leaving the zone early, standing directly behind a defender's stick lane, or vacating defensive coverage.

## 3. "Living, Organic" Adaptive Engine across 6 Age Divisions (`8U` to `18U`)

The curriculum scales across **6 explicit age divisions**: **`8U`**, **`10U`**, **`12U`**, **`14U`**, **`16U`**, and **`18U`**.

* **Progressive Visual Scaffolding (Fading Training Wheels):**
  * **Level 1 (New Player / `8U` Entry):** Clear visual target rings, glowing passing lanes, max 1 short sentence of voice/text instruction, and simple *"Move your player from A to B"* mechanics.
  * **Level 2 (Developing Mastery):** Target rings fade out; player must read teammate and defender stick angles and body orientation without on-ice text spoilers.
  * **Level 3 (Advanced Instinct):** Moving defenders, pre-scan fog-of-war look-offs, tight decision clocks, and graded multi-option reads.
* **Automatic Deficiency Detection & Spaced Repetition:**
  * When a player misses a specific sub-concept twice (e.g., *F3 High-Slot Support on a 2-1-2 Forecheck* or *Behind-the-Net D-to-D Swing Breakout*), the adaptive engine flags that concept ID in the player's profile and automatically injects 2–3 new permutations (`5v5`, `4v4`, mirrored left/right wall) of that exact concept into upcoming rounds until their mastery score crosses `80%`.

## 4. True Mobile/Tablet App UX: Zero-Scroll, 1-Question-Per-Screen Wizard

Players and coaches use **iPads (8-inch to 16-inch tablets) and phones**, not laptop websites. Every screen must feel like a native touch app:

* **Strict Zero-Scroll Rule (`100dvh` Locked Viewport):**
  * Never show long, scrollable forms or cluttered multi-input modals on mobile or tablet.
  * Automatically adapt layout between **Landscape** (wide rink + right thumb ribbon) and **Portrait** (vertical rink + bottom thumb dock) across phone, 8-inch iPad Mini, 11-inch iPad Air, and 16-inch tablet viewports.
* **One-Question-At-A-Time Onboarding Wizard:**
  * When logging in or creating a player profile, present **one clean question per screen** with giant, touch-friendly cards that immediately advance on tap:
    1. **Screen 1 (Portal Selection):** `🎮 Player Portal` vs. `🏒 Team Portal`
    2. **Screen 2 (Age Division):** `8U` | `10U` | `12U` | `14U` | `16U` | `18U`
    3. **Screen 3 (Stick Hand):** `⬅️ Left-Handed Shot` | `➡️ Right-Handed Shot`
    4. **Screen 4 (Primary Position):** `Center` | `Left Wing` | `Right Wing` | `Defense` | `Goalie`
    5. **Screen 5 (Player Name & Number):** Quick nameplate entry -> Straight onto the ice!

## 5. Infinite Replayability: The 3D Trophy Room & Age-Tier Prestige Cups

Beating all 32 NHL cities is not the end of the game—it is the start of a player's **Trophy Room & Prestige Career**:

* **Interactive Trophy Room (`#trophyRoomModal`):**
  * Displays a dedicated locker/trophy showcase housing earned **Stanley Cups**, NHL individual hardware medals (*Hart, Norris, Vezina, Selke, Calder*), and division banners.
  * **Age-Stamped Stanley Cups & Multi-Cup Prestige:** Each Stanley Cup is engraved with the player's age division and run number (e.g., *"8U Stanley Cup Champion — Run I, II, III"*, *"10U Stanley Cup Champion"*). Kids can compete with siblings and teammates on total Cups won (*"How many 8U Stanley Cups do you have? I've got three!"*).
  * **Exclusive Championship Swag Unlocks:** Every Cup victory unlocks rare **Stanley Cup Champion Gear** (Chrome/Gold sticks, Championship skates, engraved helmets, and banner patches) and launches a harder New Game+ season with fresh permutations, faster clocks, and zero visual indicators.

## 6. Free-Download Portal Gate, 4-Tier Pricing Architecture & Partner Associations (`#pricingAndPlansModal`, `#partnerAssociationBanner`, `#successStoriesModal`)

### Tier 1: `🏒 Team & Association Portal` (`FREE Entry w/ Team or Association Code`)
* **Free Download & Entry:** Players enter a coach's Team Code (`PUCK99`) or Partner Association Code (`ASSOC-MINOT`, `ASSOC-FOOTHILLS`, `ASSOC-LIGHTNING`) at the Login Gate (`#sandboxLoginModal`).
* **Included Free:** Complete coach-assigned weekly lessons (`10-play assignments`) and view live Team Standings & Co-Op Stanley Cup progress.
* **Custom Lesson Builder Upsell Prompt (`#teamPortalUpsellBanner`):** When a Free Team Portal player taps `🛠️ Create My Own Lesson`, the app displays a clear upsell prompt to unlock the `Player Portal ($4.99)` + `Synapz Pro ($4.99/mo or $49.99/yr)`.

### Tier 2: `🎮 Player Portal — Base Game` (`$4.99 One-Time App Purchase`)
* Full access to the **32-Team Road to the Stanley Cup** (`Rec -> B -> A -> AA -> AAA`), 3D Avatar Customizer, Pro Gear Shop, Trophy Room, and adaptive age-tier gameplay.
* Includes the **Read-Only 6-Slice Player Performance Pie Chart**: Shows the player's overall Hockey IQ breakdown across core categories (*Forecheck, Rush & Open Ice, Zone Possession, Breakout & Regroup, Power Play, Penalty Kill*).

### Tier 3: `⚡ Synapz Pro Subscription` (`$4.99/mo` or `$49.99/yr — Save $10!`)
* Tied to the player's existing login so all historical play data carries over immediately upon upgrade.
* **Interactive 6-Slice Player Performance Pie Chart (Self-Eval & Drill-Down):**
  * Players tap directly on any weak slice of their pie chart (e.g., `10% Power Play IQ` or `15% Forecheck F3 Eagle Support`) to open a detailed breakdown showing:
    * Exact concepts and past questions missed (with 1-tap replay to review *why* they missed them).
    * **⚡ "Formulate My Hockey IQ Improvement Plan (PIP)":** AI generates a custom remedial lesson series targeting their lowest pie slices and tracks before/after IQ gains.
* **🛠️ "Create My Own Lesson" Custom Scenario Builder:**
  * Step-by-step interactive filter where players build targeted study sessions outside the Stanley Cup map:
    1. *Phase of Play:* `Offense` | `Defense` | `Transition / Regroup` | `Special Teams`
    2. *Situation:* `5v5` | `4v4` | `3v3 OT` | `5v4 Power Play` | `4v5 Penalty Kill`
    3. *Specific Focus:* `🐂🦊🦅 F1 Bull / F2 Fox / F3 Eagle Rotation` | `🛡️🏰 D1 Challenge / D2 Protect the House` | `Zone Possession` | `2-1-2 Forecheck` | `1-2-2 Forecheck` | `D-to-D Breakout`
    4. *Position & Handedness:* Play as your own spot (e.g., `Left-Handed Left Wing`) **or** study another position on your line.

### Tier 4: `🧑‍💼 Coach & Association Plans` (`$99/yr` or **`$49.99/yr` with 50% Partner Logo Discount**; Full Association Licenses **`$499–$999/yr` for 5–20 Coaching Seats**)
* **Single Team Coach Portal:** `$99/yr` standard, or **`$49.99/yr` (50% OFF Partner Logo Discount)** when a team/association partners with Synapz Hockey to display their crest on the Partner Banner (`#partnerAssociationBanner`).
* **Full Association Licenses (`$499–$999/yr`):** Provides `5–20 coaching seats` with preset Association Codes (`ASSOC-MINOT`, `ASSOC-FOOTHILLS`, `ASSOC-LIGHTNING`).
* **Partner Association Logo Banner & Success Stories Drawer (`#partnerAssociationBanner` & `#successStoriesModal`):**
  * Showcases partner teams (*Minot 3v3 Wolves*, *Foothills Flyers*, *Lightning AAA*), coach reviews, and real youth/team iPad training clip cards across all **3 Marketing Audiences**:
    1. `👶 8U–10U Youth & Parents` (Car-ride iPad shifts, 14-word Coach Bob prompts, `🐂 Bull / 🦊 Fox / 🦅 Eagle` roles)
    2. `🔥 12U–18U Competitive Players` (AAA/High School `2.8s` decision clocks, `3D POV` pre-scans, 6-slice Pie Chart PIP)
    3. `🧑‍💼 Coaches & Associations` (Bench chalkboard iPad reviews, 10-play weekly assignments, 50% Partner Logo Discount)

## 7. Official Dynamic Forward & Defenseman Archetypes (`F1 Bull / F2 Fox / F3 Eagle` & `D1 / D2`)

In modern hockey systems, **`F1 / F2 / F3`** and **`D1 / D2`** designate a skater's **real-time proximity to the puck** rather than their fixed lineup position (`LW`, `C`, `RW`, `LD`, `RD`). Whenever the puck moves, roles dynamically recalculate and rotate:

### 7.1 Official Dynamic Forward Archetypes (`Bull / Fox / Eagle` — Sorted Closest → Furthest from Puck via `Math.hypot(skater.x - puck.x, skater.y - puck.y)`)
* **`F1` — First Forward / The "Bull" (`🐂 F1 Bull`):**
  * **Who:** Closest forward to the puck.
  * **Job:** Charges in to apply direct stick-on-puck angle pressure and force a rushed decision along the boards.
* **`F2` — Second Forward / The "Fox" (`🦊 F2 Fox`):**
  * **Who:** Second-closest forward to the puck.
  * **Job:** Reads the Bull's angle, seals the boards/cutback lane, and pounces on forced turnovers and loose pucks.
* **`F3` — Third Forward / The "Eagle" (`🦅 F3 Eagle`):**
  * **Who:** Furthest forward from the puck.
  * **Job:** Soars high in the offensive zone (high slot / above the circles) as the safety valve to prevent breakouts or swoop in for a high-slot shot.

### 7.2 Defenseman Proximity Roles (`D1 / D2` — Sorted Closest → Furthest from Puck)
* **`D1` — First Defenseman (`🛡️ D1 Strong-Side / Challenge`):**
  * **Who:** Closest defenseman to the puck.
  * **Job:** Pinches/holds the strong-side blue line wall on offense; challenges the puck carrier in the corner, along the wall, or with tight gap control on defense.
* **`D2` — Second Defenseman (`🏰 D2 Protect the House`):**
  * **Who:** Furthest defenseman from the puck.
  * **Job:** Stays central in front of the crease on defense to **"Protect the House"** (tying up sticks and boxing out net-front threats), or hinges to the middle of the blue line on offense as the safety outlet.

### 7.3 Live On-Ice Badges, `"Who Am I?"` Role-Read Bonus & Age-Scaled Coaching
* **Real-Time Dynamic Role Pills (`computeDynamicProximityRoles`):** Every skater on the ice in 2D Rink, 3D First-Person POV, Live Shift, and Chalkboard modes displays a live proximity role badge (`🐂 F1 Bull`, `🦊 F2 Fox`, `🦅 F3 Eagle`, `🛡️ D1`, `🏰 D2`) that updates every frame as the puck or skaters move.
* **Interactive `"Who Am I?"` Role-Read Selector (`+5 Role-Read IQ Bonus`):** Inside `#tacticalActionDock`, players can tap their current/target proximity role (`🐂 F1 Bull`, `🦊 F2 Fox`, `🦅 F3 Eagle`, `🛡️ D1`, `🏰 D2`) for a **`+5 IQ` (`+$5 PuckBucks`) bonus** and instant Coach Bob confirmation, or open the 1-tap **`ℹ️ F1-F3 / D1-D2 Guide`** visual reference card.
* **Age-Scaled Coaching Voice:**
  * **`8U` & `10U`:** Uses the **Bull (`🐂 F1 Bull`)**, **Fox (`🦊 F2 Fox`)**, **Eagle (`🦅 F3 Eagle`)**, **Strong-Side Challenge (`🛡️ D1`)**, and **Protect the House (`🏰 D2`)** archetypes directly in Coach Bob's voice and text prompts.
  * **`12U`–`18U`:** Coaches **Dynamic Role Rotation & High Reloads** (e.g., rotating from `F3 Eagle` to `F1 Bull` when the puck rims weak-side while the old `F1 Bull` reloads high through the middle to become the new `F3 Eagle`).
* **Custom Lesson & Coach Assignment Integration:** Both **`🛠️ Create My Own Lesson`** (`#selectCustomSystem`) and **`🏒 Team Portal` Coach Assignment** (`#selectCoachWeeklyFocus`) include dedicated `F1 Bull / F2 Fox / F3 Eagle Rotation` and `D1 Challenge / D2 Protect the House` training tracks.

---

## 8. Rebrand to `SYNAPZ HOCKEY` (`PLAY. LEARN. DOMINATE.`) & Animated `Coach Bob` (`#coachBobPopup`)

1. **Official Brand Identity (`SYNAPZ HOCKEY — PLAY. LEARN. DOMINATE.` + Sub-Badge `HOCKEY IQ & STRATEGY PLATFORM`):**
   * Uses `assets/tactix-logo.png` and prominently displays **`PLAY. LEARN. DOMINATE.`** below the **SYNAPZ HOCKEY** logo on the Login Gate (`#sandboxLoginModal`), top header (`#btnGoHomeMap`), map dashboard (`#mapViewSection`), and `report.html` (keeping **`HOCKEY IQ & STRATEGY PLATFORM`** as the sub-badge).
2. **Multi-State Animated `Coach Bob` (`assets/coach-bob.png`) in the Lower-Left Reflex Pop-Up (`#coachBobPopup`):**
   * Replaces all `"Coach Mack"` references with **`Coach Bob`** (`assets/coach-bob.png`).
   * **3 Animated Pop-Up States (`setCoachBobAnimationState`):**
     1. **Talking State (`coach-bob-state-talking`):** Subtle rhythmic bobbing + animated cyan/gold soundwave rings (`#coachBobSoundwaveRing1`, `#coachBobSoundwaveRing2`) around his whistle/chalkboard while speaking a prompt.
     2. **Coaching / Mistake State (`coach-bob-state-mistake`):** Chalkboard shake/highlight animation when popping up after a missed attempt (`recordPlayResult(..., false)`).
     3. **Celebration State (`coach-bob-state-celebrate`):** Fist-pump / golden glow bounce on a `1st Choice Gold IQ` play (`mult >= 0.99`) before sliding smoothly back down out of sight so the rink stays 100% unobstructed.
   * **Auto-Hide Out of Sight (`hideCoachBobPopup()`):** As soon as Coach Bob finishes his prompt (or the player clicks **`Got It / Start Play ▶`** `#btnDismissCoachBob` or touches the ice `#rinkCanvas`), Coach Bob slides smoothly down out of sight so the player has **100% unobstructed full-screen ice**!

---

## 9. Mathseeds-Style Map Progression & `Rec → B → A → AA → AAA` Skill Tier Milestones

1. **5 Hockey Skill Tier Promotions Within Every Age Division (`8U`, `10U`, `12U`, `14U`, `16U`, `18U`):**
   * **Stops 1–6 (`Rec`):** `Rec / House Tier` (Beginner difficulty for that age group; unlocks `Neon Green Vapor Twig`)
   * **Stops 7–12 (`B`):** `B Travel Tier` (Promotion celebration + unlocks `All-Star Whiteout Bucket`)
   * **Stops 13–19 (`A`):** `A Select Tier` (Promotion celebration + unlocks `Ice Blue Prizm Shield`)
   * **Stops 20–26 (`AA`):** `AA Premier Tier` (Promotion celebration + unlocks `Electric Blue Runners`)
   * **Stops 27–32 (`AAA`):** `AAA Elite Tier` → **Division Stanley Cup Finals** (Unlocks `Gold One-Timer Pro Twig`)
2. **Header & Ribbon Age + Skill Tier Badges (`#headerAgeSkillTierBadge` & `#ribbonSkillTierBadge`):**
   * Clearly displays `8U • Rec Tier` → `8U • AA Tier` or `12U • AAA Tier` in the top header, on the `#situationContextBanner`, and on the 5-stage Mathseeds Milestone Track bar (`#mathseedsTierTrackBar`).

---

## 10. USA Hockey ADM Age Guardrails & Mandatory Situation Context Banner (`#situationContextBanner`)

1. **Live ADM Guardrail Table (`public.tactix_adm_guidelines`):**
   * **Strict `8U` Filter (`isScenarioAllowedForAge`):** When `age_division === '8U'`, **NEVER** serve Offsides (`basics-offsides`), Delayed Offsides, Power Play (`5v4`, `pp-umbrella`), Penalty Kill (`4v5`, `pk-box`), or unannounced `3v3` (`transition-1`) scenarios.
   * Keeps `8U` strictly **`5-on-5 Even Strength`** (`skatersPerSide = 5`) focused on Puck Support, Open-Ice Spacing, Protect the House (`D1/D2`), and `Bull (🐂 F1) / Fox (🦊 F2) / Eagle (🦅 F3)` with **max 14-word prompts** (`enforceAdmPromptWordLimit`).
2. **Mandatory Situation Banner (`#situationContextBanner`):**
   * Displays a bold, unmistakable pill at the top-center of every drill showing the exact on-ice situation, zone, and age/tier before the play starts: e.g., `🏒 5-on-5 Even Strength • Defensive Zone (DZ) • 8U • Rec Tier` or `⚡ 5-on-4 Power Play • Offensive Zone (OZ) • 12U • AA Tier`, and Coach Bob announces it in his pop-up intro.

---

## 11. Multi-Format Question Engine & Tagged Cloud Scenario Bank (`public.tactix_concept_buckets` & `public.tactix_scenarios`)

1. **5 Interactive Question Formats (`state.activeQuestionStyle` & `#multiFormatControlsBar`):**
   * **`tap_zone` (Pick the Best Ice Zone A / B / C):** Renders 3 labeled glowing tactical zones (`ZONE A`, `ZONE B`, `ZONE C`) on the ice canvas (plus quick-tap `Zone A / B / C` buttons in `#multiFormatControlsBar`) supporting `1st Choice 100% Gold`, `2nd Choice 80% Silver`, and `3rd Choice 60% Bronze` consensus scoring without requiring fine finger dragging.
   * **`tap_player` (Select Teammate / Pass Target / Rip Shot):** Tap the open teammate or goal net directly on the ice or via quick-tap player pills.
   * **`tactical_choice` (Multiple-Choice Action Cards):** Presents 3–4 crisp tactical action cards (`"Reverse D-to-D"`, `"Hit F3 Eagle in High Slot"`, `"Drop into the House"`) for rapid decision-making reads.
   * **`drag_skater` & `spot_and_fix`:** Preserves spatial skater dragging and 2-step Spot the Mistake (`10U+`).
2. **Tagged Cloud Scenario Bank (`public.tactix_concept_buckets` & `public.tactix_scenarios`):**
   * Synced with Supabase (`PuckSenseCloud.fetchAdmGuidelines()`, `fetchConceptBuckets()`, `fetchCloudScenarios()`) filtered strictly by the active player's `age_division` and `tier_level`.

---

## 12. Synapz Hockey 3-Bot Scenario Factory Pipeline (`generate-tactix-bank.js`)

The standalone Node curriculum generator (`generate-tactix-bank.js`) executes a **3-Bot Scenario Factory Pipeline (`Harvester` -> `Bucket Tagger` -> `24x Permutator` + `QC Gatekeeper`)** to populate `public.tactix_adm_guidelines`, `public.tactix_concept_buckets`, and `public.tactix_scenarios`:

1. **Bot 1 (Playbook Harvester) & Bot 2 (Bucket Sorter & ADM Rule Tagger):**
   * Upserts the **10 Core Hockey Concept Buckets** into `public.tactix_concept_buckets`:
     1. `basics_support` — Puck Support & Triangle Spacing (`8U–18U`)
     2. `f1_f2_f3_roles` — Bull `F1`, Fox `F2`, Eagle `F3` Forecheck & Rotation (`8U–18U`)
     3. `dzone_house` — `D1` Corner Challenge & `D2` Protect the House (`8U–18U`)
     4. `offsides_rules` — Blue Line Offsides & Delayed Offsides (**`10U–18U ONLY`, strictly blocked in `8U`**)
     5. `breakout_d_to_d` — `D1/D2` Behind-the-Net Swing, Rim & Wall Outlet (`10U–18U`, basic `5v5` outlet for `8U`)
     6. `rush_attack` — `2v1`, `3v2` Wide Speed, Middle Drive & High Trailer (`10U–18U`)
     7. `forecheck_systems` — `2-1-2` Aggressive & `1-2-2` Trap/Angle (`12U–18U`)
     8. `powerplay_5v4` — `5-on-4` Umbrella, Overload & Back-Door Seam (**`12U–18U ONLY`, strictly blocked in `8U`**)
     9. `penaltykill_4v5` — `4-on-5` Box+1, Diamond & Stick-in-Seam (**`12U–18U ONLY`, strictly blocked in `8U`**)
     10. `deception_prescan` — Shoulder Pre-Scan, Look-Offs & `3v3` Overtime (**`10U–18U ONLY`, strictly blocked in `8U`**)
2. **Bot 3 (The 24x Permutation Multiplier & Quality Control Gate):**
   * Generates and upserts **240+ tagged, QC-verified scenario variations** (24 permutations per concept bucket across all 10 core buckets, plus the 32 canonical base scenario keys) into `public.tactix_scenarios`:
     * Covers all **6 Age Divisions** (`8U`, `10U`, `12U`, `14U`, `16U`, `18U`) — strictly enforcing that `8U` is `5-on-5 Even Strength` with `0` offsides, `0` PK/PP, `0` unannounced `3v3`, and `<= 14-word` Coach Bob prompts.
     * Covers all **5 Within-Division Skill Tiers** (`Rec`, `B`, `A`, `AA`, `AAA`).
     * Covers all **5 Positions** (`C`, `LW`, `RW`, `D`, `G`) and **Official Dynamic Roles** (`🐂 F1 Bull`, `🦊 F2 Fox`, `🦅 F3 Eagle`, `🛡️ D1`, `🏰 D2`).
     * Covers all **5 Question Styles** (`tap_zone`, `tap_player`, `tactical_choice`, `drag_skater`, `spot_and_fix`) with **Graded Consensus Zones (`1st Choice 100% Gold`, `2nd Choice 80% Silver`, `3rd Choice 60% Bronze`)**.
   * **Automated QC Gatekeeper:** Audits every generated row verifying that `coach_bob_prompt` matches the exact `1st Choice` winning target (`targetZones[0]`, `passTargets[0]`, or `readChoices[0]`), validates ADM age division rules (`8U` strict `5-on-5 Even Strength` & prohibited concept filter), and sets `qc_approved: true` only when all checks pass.



---

## 15. Position-Specific IQ Ratings, Well-Rounded 100% Balance & Age-Scaled Self-Eval (Dictation 1 Additions)
1. **Position-Specific & Cross-Position Hockey IQ Ratings:** Track and display a player's Hockey IQ rating per position AND per situation (e.g., "5v4 Power Play IQ as LW = 84" vs. "as RW = 68"), allowing players in the Custom Lesson Builder to study another position on their unit (LW studying RW, C, LD, or RD responsibilities).
2. **The "Well-Rounded Player" 100% Balance Pie ("Triple-B Player Performance Plan"):** Frame the Player Performance Pie Chart around a 100% Well-Rounded Hockey Player Balance, visually flagging lopsided `<10%` slices.
3. **Age-Scaled Self-Evaluation Language (`8U` vs. `16U/18U`):** `8U` & `10U` self-evaluations use big icons and never exceed 1 short, upbeat sentence; `14U–18U` evaluations deliver deep AAA/Junior film-room breakdowns tailored to the player's historical trends.

## 16. Expanded Playbook Harvester Sources & The 24–48x Multi-Variable Permutation Matrix (Dictation 2 Additions)
1. **Full Spectrum of Verified Coaching Sources for Bot 1 (`Harvester`):** Scour official diagrams and lesson plans across USA Hockey ADM (Learn-to-Play through 18U), Youth Club & Tier 1 AAA, High School 5A, Junior A & Junior B (USHL, NAHL, BCHL), NCAA D1, D2 & D3, Semi-Pro, and Pro systems.
2. **The 6-Lever Permutation Matrix:** Multiply each Concept Bucket across: (1) Age Division (`8U–18U` with strict ADM guardrails), (2) Within-Division Skill Tier (`Rec -> B -> A -> AA -> AAA`), (3) Position & Dynamic Role (`C, LW, RW, LD, RD, G` + `🐂 F1 Bull, 🦊 F2 Fox, 🦅 F3 Eagle, 🛡️ D1, 🏰 D2`), (4) Ice Zone & Surface (`OZ / NZ / DZ` + `Full Ice vs. Half Ice` + `Left/Right Mirroring`), (5) Manpower (`5v5, 4v4, 3v3 OT, 5v4 PP, 4v5 PK`), and (6) Interactive Question Format (`tap_zone, tap_player, tactical_choice, drag_skater, spot_and_fix`).

## 17. Granular Team Portal Permissions, Roster Seat Controls & Modal Scroll Ergonomics (Dictation 3 Additions)
1. **Coach Roster Seat Controls ("Add / Kick Players" Up to ~20–22 Seat Cap):** Coaches in `Team Portal -> Coach Login` can add, edit, or remove ("kick in and out") players on their team roster up to their team seat limit.
2. **Visibility Boundary Between `Team Portal (Player View)` and `Coach Portal (Coach View)`:**
   - In `Team Portal -> Player Login`: Players see the shared Team Leaderboard & Co-Op Trophy progress plus their own Coach Weekly Assignment Inbox, cannot view teammates' private diagnostic weaknesses, and cannot use "Create My Own Lesson" unless they unlock their personal `Player Portal` + `Synapz Pro`.
   - In `Team Portal -> Coach Login`: Only the Coach sees per-player diagnostic analytics, missed question logs, and Practice Scouting Alerts with 1-click remedial homework assignment.
3. **Scrollable Modals with Sticky Action Buttons:** Lock scrolling (`overflow: hidden`) on the background rink canvas during active play, while allowing smooth vertical scrolling (`overflow-y: auto; max-height: 92dvh`) with sticky bottom action buttons (`position: sticky; bottom: 0`) on Sign-In, Profile, Locker Room, and all modals.

## 18. 3-Audience Automated Social Media Engine, Real-Kid Hybrid Videos & Companion Website (Dictation 3 Additions)
1. **Three Targeted Social Media Tracks:** (1) `8U–10U` Youth & Parents (Coach Bob animations + real clips of Miles, Rhett, Whelan, Cohen, and youth teams on iPads and on the ice), (2) `12U–18U` Competitive Players ("What's Your Play?" quizzes & gifted Pro accounts), and (3) Youth Coaches & Association Directors (30-second Weekly Assignment demos + 50% Partner Logo Discount `$49.99/yr` & `$499–$999/yr` Association Multi-Coach Bundles).
2. **Real-Footage + AI Polish Rule:** Film real youth players and coaches using the app and executing plays on the ice, using AI strictly to add broadcast telestrator overlays and studio polish rather than generic artificial AI skating clips.
3. **Companion Marketing Website & Reviews / Success Stories Hub:** Feature the Partner Association Logo Banner (*Minot Wolves*, *Foothills Flyers*, *Lightning AAA*), Team Success Stories, and Association signup.

## 19. The 8-Seat Professional Industry, Teaching Strategy & Engineering Board
Every `RUN NIGHTLY AUTOPILOT` pass runs an active Playwright field inspection in Chrome across 8 dedicated seats:
1. **Seat 1 — NCAA D1 / AAA & USA Hockey Systems Director** (On-ice geometry, `Bull/Fox/Eagle` & `D1/D2`, `1st/2nd/3rd Choice` consensus zones, strict `8U` ADM guardrails).
2. **Seat 2 — Master Instructional Designer & Sports Teaching Strategist** (Critiques *how* we teach and proposes 3 concrete, better teaching strategies on every pass—such as Cue-First Eye-Tracking Highlights, `Teach -> Guided Read -> Blind Game-Speed Test` micro-arcs, and Contrastive Good-vs-Bad Read replays—building the #1 upgrade into `index.html`).
3. **Seat 3 — Pediatric Cognitive & Age-Scaling Specialist (`8U–18U`)** (Reading load `<= 14 words` for `8U`, age-scaled self-eval tone, fading training wheels across `Rec -> AAA`, and spaced repetition).
4. **Seat 4 — Hit Mobile Game & EdTech Retention Designer** (Mathseeds map, Coach Bob Reflex pop-ups, streak juice, Pro Shop swag, 3D Trophy Room Prestige Cups).
5. **Seat 5 — Native iPad / Phone Touch UX & Anti-Clutter Architect** (Phone `390x844`, iPad Portrait `768x1024`, iPad Landscape `1024x768`, Desktop `1280x800` anti-clutter and scrollable modal ergonomics).
6. **Seat 6 — Dedicated Head Coach & Association Portal Tester** (Tests Coach Login -> Add/Kick Roster Seat Controls -> Line Builder -> Weekly Assignment Push -> Player Inbox -> Coach Practice Scouting Alerts end-to-end and reports a dedicated Coach Portal Scorecard).
7. **Seat 7 — App Store, Conversion & Growth Strategist** (`PLAY. LEARN. DOMINATE.`, Free-Download Portal Gate, Partner Association Banner, and Synapz Pro `PIP` + Custom Lesson Builder upsell).
8. **Seat 8 — Principal Full-Stack App & `<canvas>` Graphics Engineer** (Canvas rendering polish, 3D POV camera, 60fps smoothness, `CONTEXT.md` fast-map, and pre-deploy security checks in `deploy-github-pages.js`).

## 20. Cloud Video Library (`public.tactix_video_library`), Multi-Channel NHL/Coaching Harvester (`harvest-tactix-videos.js`) & Seat 9 Video Auditor
1. **16-Channel 3-Tier Trusted Network (`public.tactix_video_channels`):**
   - **Tier 1 (Youth & Foundational Whiteboard):** *Evolution Hockey*, *IceHockeySystems / Denis Savard*, *Coach Matt*, *Morgan Park / Coach John*, *Minnesota Hockey*, *How To Hockey*, *Coach Steve Hockey*.
   - **Tier 2 (NCAA / Pro Telestrator Film Lab):** *Hockey Players Club / Topher Scott*, *Along The Ice*, *NESN / Billy Jaffe*, *Mitch Giguere*, *Deep Sea Hockey*, *Coach Enio / Kevin Bieksa*, *Wally Kozak*.
   - **Tier 3 (Official NHL Live Game Film):** *St. Louis Blues*, *Official NHL*.
2. **Multi-Tagged Full-Concept Video Segments (`public.tactix_video_library`):**
   - Stores **38+ transcript-verified, multi-tagged video segments across all 15 Concept Buckets** (`>= 2` segments per bucket), tagged by `bucket_code`, `allowed_divisions[]` (`8U` strictly `5v5` with 0 offsides/PK/PP/3v3), `tier_levels[]` (`Rec -> B -> A -> AA -> AAA`), `positions[]` (`C, LW, RW, D, G`), `dynamic_roles[]` (`F1, F2, F3, D1, D2`), and `clip_style` (`whiteboard_diagram` served first to `8U–10U Rec/B` players vs. `telestrator_breakdown` and `nhl_live_play` served first to `12U–18U A/AA/AAA` players).
   - **Full-Concept Teaching Windows (`start_sec` to `end_sec`, `23s–140s`):** Never cuts off a teaching video mid-play at 12 seconds!
   - **Permanent Blacklist:** Permanently blocks music-only or unverified clips (`bSgfwvhIT7E`).
3. **Interactive Film-Room Controls inside `#videoExampleModal`:**
   - **`🔄 Watch Another Clip for This Concept (Clip 1 of N)`** (`#btnCycleConceptVideoClip` & `#videoClipCounterBadge`): Cycles through all tagged Whiteboard, Telestrator, and Live NHL clips in the active bucket.
   - **`⏪ Rewind 10s`** (`#btnVideoRewind10s`), **`🔄 Replay Segment`** (`#btnReplay12sClip`), and **`📋 Coach Bob 60fps Native Telestrator`** (`#btnVideoLaunchNativeTelestrator`, closing the modal and animating the play directly on our `<canvas>` rink).
4. **Seat 9 — Automated Video Harvester & Film-Room QC Auditor (`harvest-tactix-videos.js`):**
   - Added to the `RUN NIGHTLY AUTOPILOT` pipeline so every nightly pass audits all YouTube IDs via official `oEmbed` (`HTTP 200`), blocks any music-only or unverified clip, verifies `>= 2` clips per bucket across all 15 buckets, and syncs `public.tactix_video_library`.


## 21. Clean `F1–F3 / D1–D2` Base Default, Single-Label Custom Role Mapper (`applyRoleLabelMap`), 5 Multi-Level Coach Portal Customizations & 9-Seat Continuous-Improvement Board (No `PASS / FAIL`)
1. **Clean Base Default (`F1, F2, F3, D1, D2`) & Strict Single-Label Custom Role Mapper (`applyRoleLabelMap`):**
   - Out-of-the-box tokens, badges, `"Who Am I?"` Role-Read buttons (`#dockRoleReadBar`), and Coach Bob prompts across `index.html`, `generate-tactix-bank.js`, and `public.tactix_scenarios` default to strictly clean **`F1`**, **`F2`**, **`F3`**, **`D1`**, and **`D2`** (zero animal/shield emojis or combined `"🐂 F1 Bull"` double-labels).
   - When a coach (in `Team Portal -> Coach Login`) or Pro subscriber customizes role terminology via `setRoleLabelMap(newMap)` (e.g., `F1 -> "Bull"`, `F2 -> "Fox"`, `F3 -> "Eagle"`, or any custom team word), `applyRoleLabelMap(text)` performs a single-pass whole-word swap (`\b(F1|F2|F3|D1|D2)\b`) across on-ice badges, buttons, and Coach Bob's prompts before and after the play so it **ONLY** outputs `"Bull"` (never `"F1 Bull"` or `"Bull and F1"`).
2. **The 5 Multi-Level Coach Portal Customizations (`#teamManagerModal` & `public.pucksense_teams`):**
   - **0. 4-Level Coaching Perspective Switcher (`#coachLevelPerspectiveSelector`):** 1-tap presets for `Level A: 8U/10U Volunteer`, `Level B: 12U/14U AA/AAA Travel`, `Level C: 16U/18U HS / Junior`, and `Level D: Association Hockey Director (ASSOC-MINOT / ASSOC-FOOTHILLS)`.
   - **1. Custom Role Terminology Panel (`#coachRoleTerminologyPanel`):** 5 custom inputs (`#inputRoleMapF1`..`#inputRoleMapD2`) + 1-tap presets (`Standard F1–F3 / D1–D2`, `Youth Animal: Bull / Fox / Eagle`, `Pro Functional: Pressure / Seal / High`) and live prompt preview (`#roleMapLivePreviewText`).
   - **2. Team System Playbook Selector ("Coach Our System" — `#coachTeamSystemPlaybookPanel`):** Dropdowns for *Forecheck* (`2-1-2 Aggressive` | `1-2-2 Trap` | `LW Lock`), *D-Zone* (`Protect the House` | `Box+1` | `Overload`), *Breakout* (`Up Wall` | `D-to-D Over` | `Wheel` | `Reverse` | `Rim`), *5v4 PP* (`1-3-1 Umbrella` | `Overload`), and *4v5 PK* (`Box` | `Diamond`).
   - **3. Line- & Position-Group Homework Targeting (`#selectCoachHomeworkTargetGroup`):** Assign weekly homework to `Whole Team (All Lines & D-Pairs)`, `Forwards Only (Lines 1–4)`, `Defensemen Only (D-Pairs 1–3)`, `Centers Only (Faceoffs & Low Support)`, or `Goalies Only (Crease Depth & Rims)`, displayed directly in the Player Homework Inbox (`#playerInboxTargetGroupBadge` & `#playerInboxPlaybookBadge`).
   - **4. Team Jersey Color Customizer & Coaching Pace Override (`#coachJerseyAndPacePanel`):** Primary/secondary jersey color pickers (`#inputTeamPrimaryColor`, `#inputTeamSecondaryColor`, `.btn-team-jersey-preset`) rendered on all teammate tokens on the ice, plus `Coaching Pace` override (`#selectTeamCoachingPace`: `Default Age-Scaled`, `8U/10U Relaxed — Visual Hints ON & No Clock Pressure`, or `AAA/Jr Pro Speed — Tight 4.5s Clocks & Zero Hints`) synced to `public.pucksense_teams`.
3. **Seat 6 Upgraded to the "4-Level Coaching Panel Playtester" & Ban on `PASS / FAIL` Across All 9 Seats:**
   - Seat 6 inspects and critiques the Coach Portal from **4 distinct coaching perspectives** on every `RUN NIGHTLY AUTOPILOT` pass: `Level A (8U/10U Youth Volunteer)`, `Level B (12U/14U AA/AAA Travel)`, `Level C (16U/18U High School / Junior)`, and `Level D (Association Hockey Director — ASSOC-MINOT / ASSOC-FOOTHILLS)`.
   - All **`PASS / FAIL`** rubber-stamp badges are permanently banned across Seats 1–9 in `AGENT.md`, `deep_playtest_audit.js`, `PLAYTEST_REPORT.md`, `LEARNING_COUNCIL_REPORT.md`, and `report.html`. Every Seat on every run must output four structured continuous-improvement sections: **(A) What Was Observed Live**, **(B) What Can Be Better**, **(C) 3 Concrete Better Options for Coach Dane & Coach Evan**, and **(D) Live Code/Database Edit Shipped in This Run**.


## 22. 4-Tab Player & Coach Portal Architectures, 3-Pod / 10-Seat Authority Hierarchy & 30-Idea Founder Digest (`v8.2` Additions)
1. **4-Tab Player & Family Locker Room (`#profileModal`):**
   - **Tab 1 — `🏒 Who's Playing? (1-Tap Sibling Locker Stalls)`:** Giant visual jersey stall cards (`Miles #9 • 12U`, `Rhett #88 • 8U`, `Whelan #7 • 8U`, `Cohen #14 • 10U`, plus `+ Add Sibling`) that switch the active child in 1 tap with zero data bleed (`saveProgress()` runs on the outgoing sibling before switching `state.activeProfileId`).
   - **Tab 2 — `🎨 3D Avatar & Fitting Room`:** Dedicated 360° 3D skater customizer and equipped Pro Shop gear slots (`Helmet`, `Visor`, `Stick`, `Skates`).
   - **Tab 3 — `📊 My IQ Pie Chart & Custom Lessons`:** Active player's **6-Slice Hockey IQ Pie Chart** (`100% Well-Rounded Balance`), **Position-Specific IQ Grid (`C, LW, RW, D, G`)**, **Age-Scaled Self-Eval Summary**, **`⚡ Formulate My Improvement Plan (PIP)`**, and **`🛠️ Create My Own Lesson`**.
   - **Tab 4 — `👨‍👩‍👦 Parent & Family HQ (Hockey Mom & Dad View)`:** Side-by-side **All-Kids Progress Snapshot** (with car-ride praise prompts), **Family "House Cup" Sibling Leaderboard**, and **🔒 Lock Child's Age Division** parent toggle.
2. **4-Tab Coach & Director Portal (`#teamManagerModal`):**
   - **Tab 1 — `📊 Command Center & Practice Alerts`:** Team Completion %, Team IQ Average, Co-Op Stanley Cup Points, Practice Scouting Alerts (`[📩 Send 2 Remedial Drills]`), and Live Cloud Inbox.
   - **Tab 2 — `📋 Weekly Homework Wizard`:** Guided 3-step flow (`1. Target Group: Whole Team / Forwards / D / Centers / Goalies` -> `2. Focus Bucket or Custom AI Prompt` -> `3. Live Preview & ✅ Approve to Player Inboxes`).
   - **Tab 3 — `🏒 Roster, Lines & Team Playbook`:** `22/22` Seat Manager (`➕ Add` / `👢 Kick`), Line & D-Pair Builder, Team System Playbook Selector (`2-1-2`, `Box+1`, `D-to-D`, `Umbrella`), Custom Role Terminology (`F1–F3 / D1–D2` vs `Bull / Fox / Eagle`), and Team Sweater Colors/Pace Overrides.
   - **Tab 4 — `🏢 Director HQ (Association & Club GM View)`:** Multi-team association roll-up table across `8U–18U` teams (`ASSOC-MINOT`, `ASSOC-FOOTHILLS`, `ASSOC-LIGHTNING`) showing coach activity, roster compliance %, division IQ growth, and **"📢 Push Association-Wide Monthly Curriculum Standard"**.
3. **3-Pod / 10-Seat Board & 4-Step Domain Authority Hierarchy (`CHANGELOG_DECISIONS.md`):**
   - **Pod 1: Player, Family & Learning (`Seats 1–4`):** Seat 1 (NCAA D1 / AAA & USA Hockey Systems Director — `WHAT` Authority), Seat 2 (Master Instructional Designer — `HOW` Authority), Seat 3 (Pediatric Cognitive & Family/Parent Specialist — `HOW` Authority), Seat 4 (Hit Mobile Game & EdTech Retention Designer — `HOW FUN` Authority).
   - **Pod 2: Coach, Director & Portal UX (`Seats 5–7`):** Seat 5 (Youth/Travel/HS Head Coach Playtester — `WHAT` Authority), Seat 6 (Association Hockey Director & Club GM Playtester — `WHAT` Authority), Seat 7 (Principal UX Architect & 4-Tab Anti-Clutter Lead — `WHERE` Authority + Anti-Clutter Veto).
   - **Pod 3: Platform, Film & Growth (`Seats 8–10`):** Seat 8 (Automated Video Harvester & Film-Room QC Auditor), Seat 9 (Principal Full-Stack, Supabase & `<canvas>` Engineer — `WHERE` Authority + Engineering/HUD Veto), Seat 10 (App Store, Conversion & Growth Strategist).
   - **4-Step Domain Authority Hierarchy:** `1. WHAT Is Taught -> Seats 1, 5 & 6`, `2. HOW It Is Taught -> Seats 2 & 3 (outrank Coaches on delivery)`, `3. HOW FUN It Feels -> Seat 4`, `4. WHERE It Lives & Anti-Clutter Veto -> Seats 7 & 9`. All locked Founder rules and shipped Board upgrades are permanently recorded in `CHANGELOG_DECISIONS.md`.
4. **30-Idea Founder Digest, 1-Click Override Queue & Email Dispatch (`send-board-digest.js`):**
   - Every Nightly Autopilot run saves all **30 Proposed Ideas (`3 Options × 10 Seats`)** with their **Authority Flow Path** (`🟢 GREEN-LIT & SHIPPED — 3 of 30, 1 per Pod`, `🟡 ON DECK — 21 of 30`, `🔴 VETOED — 6 of 30 with exact Authority Seat veto reason`) to `public.pucksense_agent_inbox` (`category: 'board_digest'`).
   - Both `#founderDigestModal` (opened via `#btnFounderDigestBell` in the top header) and `report.html` provide a 1-click **`[⭐ Green-Light & Queue for Next Build]`** button next to every `🟡 ON DECK` or `🔴 VETOED` idea (`status: 'queued_for_builder'`, `created_by: 'Founder-Override'`) plus a 1-click **`📧 Email This 30-Idea Digest to Dane & Evan (`danebekkedahl@gmail.com`, `evanbekk@gmail.com`)`** button and automated `send-board-digest.js` script.


## 23. The Co-Founder Advisory Charter & 4 Process Reliability Upgrades: Strict Approval Gate, Test-Suite Lock, 10 Focused Proposals per Run (1 Primary + 1 Alternative per Seat), Rolling 30-Level Coverage Ledger, Video RSS & Dual-Folder Checksum Mirror (`v9.1` Charter)
1. **Strict Founder Approval Gate & Test-Suite Integrity Lock:**
   - **Zero Unapproved Feature/UI Changes:** During `RUN NIGHTLY AUTOPILOT`, do **NOT** automatically mutate `index.html` with new unapproved UI, buttons, or gameplay features. Only build items in `public.pucksense_agent_inbox` where Coach Dane or Coach Evan explicitly set `status: 'approved_by_founder'` (or submitted a `🚩 Flag Drill` fix).
   - **Test-Suite Integrity Lock:** The Builder is strictly forbidden from weakening or bypassing any test check in `deep_playtest_audit.js` to make a run pass.
2. **Focus All 10 Seats on Their #1 Best Candid Recommendation (With Embedded Screenshots):**
   - **Candid Co-Founder Pushback ("No Yes-Men"):** Every Seat (`Seat 1`–`Seat 10`) acts like an invested co-founder—challenging any weak screen, drill, flow, or assumption (including evaluating **Static Setups vs. 2-Second Moving Play -> Freeze -> Read** across `8U–18U` and `Rec–AAA`).
   - **10 Focused Proposals per Run (1 Primary + 1 Alternative per Seat, Ranked `#1` to `#10`):**
     - Save proposals to `public.pucksense_agent_inbox` as `status: 'awaiting_founder_approval'` and include all 6 fields in `send-board-digest.js`, `#founderDigestModal` in `index.html`, and `report.html`:
       1. **Recommending Seat & Professional Lens** (`Seat 1`–`Seat 10`).
       2. **Target Age Group (`8U–18U`) & Talent Tier (`Rec–AAA`)**.
       3. **Why & Candid Critique** (what is currently weak and why this change makes **Synapz Hockey** succeed, plus 1 concise Alternative Option from that Seat).
       4. **Who Else It Affects** (cross-impact on Kids, Parents, Coaches, Directors, and other Seats).
       5. **Actual Live Screenshot (`<img>`)** captured during Stage 1, pushed to `https://danebekkedahl.github.io/synapz-hockey/assets/audit-screenshots/...`, and embedded directly in the HTML email (`send-board-digest.js`) and `report.html`.
       6. **1-Click Founder Approval Buttons (`[✅ Approve for Next Build]` / `[❌ Reject]`)**: Clicking **`[✅ Approve for Next Build]`** sets `status: 'approved_by_founder'` in Supabase (and `[❌ Reject]` sets `status: 'rejected_by_founder'`) so the next run builds only what Dane and Evan green-light.
3. **Rolling 30 Age × Talent Coverage + Off-Ice Walkthrough + Auto-Updating Video RSS:**
   - Maintain `playtest_coverage_ledger.json` so consecutive blind playtest runs cover all **30 Age × Talent Levels (`8U–18U` × `Rec/B/A/AA/AAA`)**, advance across all **32 NHL Cities**, blind-play all **360+ Cloud Scenarios**, and walk through all **6 Off-Ice Areas** (2-Step Start Page, 5-Step Wizard, Pro Shop, 3D Avatar, Trophy Room, 4-Tab Family HQ, 4-Tab Coach/Director HQ, Pricing, and Film Room).
   - Ensure `harvest-tactix-videos.js` (and `.github/workflows/nightly-tactix-harvest.yml`) polls public YouTube RSS feeds (`https://www.youtube.com/feeds/videos.xml?channel_id=...`) for our 16 whitelisted NHL and coaching channels and upserts verified clips into `public.tactix_video_library`.
4. **Defensive State Normalizer (`normalizeSynapzState()`) & Automatic Dual-Folder Mirroring:**
   - `normalizeSynapzState()` in `index.html` safely backfills default fields on older cached `localStorage` / cloud profiles, paired with a pre-save JS syntax verification check (`vm.Script`) in `deploy-github-pages.js`.
   - `deploy-github-pages.js` automatically mirrors and SHA-256 checksum-verifies `c:\Users\Dane\.gemini\antigravity\scratch\pucksense` ↔ `C:\Users\Dane\Documents\Hockey-IQ-App` before pushing to both `https://danebekkedahl.github.io/synapz-hockey/` and `https://danebekkedahl.github.io/tactix-hockey/`.


## 24. SYNAPZ HOCKEY Brand Identity, 2-Step Portal Gate, `#synapzTransitionSplash` & Stepping-Stone Adventure Map (`v9.1` Upgrade)
1. **SYNAPZ HOCKEY (`PLAY. LEARN. DOMINATE.`) Visual Identity:**
   - Uses `assets/synapz-logo.png`, `assets/synapz-splash-bg.png`, and `assets/coach-bob.png` with a deep gunmetal-navy (`#060b14` -> `#0d1829`) and electric cyan (`#00e5ff`) glassmorphic aesthetic while keeping the active 2D ice rink bright and clean (`#f8fafc`).
2. **2-Step Portal Selection Gate (`#sandboxStep1Portals` -> `#sandboxStep2Credentials`) & `#synapzTransitionSplash`:**
   - Step 1 displays only the 3 primary Portal Cards (`🏒 PLAYER PORTAL`, `📋 COACH PORTAL`, `👨‍👩‍👦 FAMILY PORTAL`) with Step 2 credentials strictly hidden on entry (`step2HiddenOnEntry === true`), transitioning smoothly through `#synapzTransitionSplash` into the revved-up Stepping-Stone Adventure Map (`#synapzMapHeaderBar` & `#nhlTourMapSvg`).


## 25. The 4-Phase Cross-Seat Collaborative Roundtable & Updated SYNAPZ HOCKEY Nightly Autopilot Protocol (`v9.2` Charter)
1. **Step 1 — Automated Playwright Audit of the 2-Step `SYNAPZ HOCKEY` Flow & Blind Playtest (`deep_playtest_audit.js`):**
   - Verifies `#sandboxStep1Portals` (`step2HiddenOnEntry === true`, `assets/synapz-splash-bg.png`, and 3 Portal Cards) -> `#sandboxStep2Credentials` (`⬅️ Back to Portals` and isolated credentials) -> `#synapzTransitionSplash` -> `#synapzMapHeaderBar` & `#nhlTourMapSvg` (Stepping-Stone Stanley Cup trail with zero overlapping city labels, pulsing `#9` puck marker, and bottom `▶️ DROP THE PUCK` bar) -> 30 Blind On-Ice Drills (`0` answer-key peeks).
   - Captures `screenshots/audit_step1_portals.png`, `screenshots/audit_step2_player_login.png`, `screenshots/audit_coach_portal.png`, `screenshots/audit_family_portal.png`, `screenshots/audit_adventure_map.png`, and `screenshots/audit_on_ice_gameplay.png` alongside `assets/audit-screenshots/seat1-...png` .. `seat10-...png`.
2. **Step 2 — The 3-Gate Cross-Seat Collaborative Roundtable ("Zero Siloed Ideas"):**
   - Every single recommendation in the 30-Idea Matrix (`10 Seats × 3 Ideas`) MUST pass 3 Cross-Seat Best-Practice Gates and include `crossSeatCoSign` (`🤝 Cross-Seat Collaboration & Best-Practice Plan`):
     - **Gate A — Tactical & USA Hockey ADM Review (`Seat 1: NCAA D1/USA Hockey` + `Seat 6: Multi-Level Coach`):** How the hockey specialists refined the idea so it strengthens real on-ice habits (`F1/F2/F3/D1/D2` reads, `8U` ADM compliance, and static vs. 2-second pre-play motion).
     - **Gate B — Child Cognition, Parent Value & Zero-Clutter UX Review (`Seat 3: Pediatric/Parent` + `Seat 5: Touch UX`):** How the UX and cognitive specialists stripped away any potential screen clutter, text overload, or mobile scroll friction across Phone (`390x844`) and iPad (`768x1024` / `1024x768`).
     - **Gate C — Clean `<canvas>` & Full-Stack Engineering Plan (`Seat 8: Principal Engineer` + `Seat 10: Blind QA`):** The exact best-practice technical implementation (`60fps` canvas rendering, zero regression to `localStorage` sibling isolation, and clean Supabase sync).
3. **Step 3 — Top 5 Co-Signed Consensus Priorities & 7-Field Digest (`report.html` & `send-board-digest.js`):**
   - All 10 Seats vote and collaborate to synthesize the **Top 5 Co-Signed Consensus Priorities** (`TOP_5_COSIGNED_CONSENSUS_PRIORITIES`, ranked `#1` to `#5`), rendered at the top of `https://danebekkedahl.github.io/synapz-hockey/report.html` and the HTML email digest, followed by the full **30-Idea Matrix** with all 7 fields (`Seat & Lens`, `Target Age/Tier`, `Candid Critique & Pushback`, `🤝 Cross-Seat Collaboration & Best-Practice Plan`, `Cross-Impact`, `Live Screenshot`, and `[🔍 Explain This to Me]` / `[✅ Approve]` / `[❌ Reject]` controls) and strict `status = 'awaiting_founder_approval'` governance in `public.pucksense_agent_inbox`.


## 26. 11-04 Modular Redesign, 9 Age-Relatable Player Agents, Per-Profile Login Lock & 6-Phase Rollout Plan (`v9.3` Phase 1)
1. **Core UX Rule — Extreme Simplicity & Progressive Disclosure:**
   - **2 to 4 Real, Tactile Buttons Per Screen Max:** Never overwhelm players, parents, or coaches with walls of text or dense control bars. Use progressive disclosure (1 question or 1 focus area per screen) and a **75% realistic / 25% stylized cartoon-edge** visual aesthetic across the entire platform.
2. **Strictly 2-Button Entry Gate (`Player Portal` & `Team Portal`) + Per-Profile Credential Lock:**
   - **Step 1 (`#sandboxStep1Portals`):** Shows the centered `SYNAPZ HOCKEY — PLAY. LEARN. DOMINATE.` hero logo over `assets/synapz-splash-bg.png` and **strictly TWO large, tactile Portal Buttons**: **`🏒 PLAYER PORTAL`** (`#btnSelectPortalPlayer`) and **`📋 TEAM PORTAL`** (`#btnSelectPortalCoach`), plus a clean **`💳 View Plans ($4.99 Game vs. Synapz Pro)`** button (`#btnStep1ViewPlans`).
   - **Step 2 (`#portalCredsPlayer` & `#playerProfileCredentialLockBox`):** Clicking **`🏒 PLAYER PORTAL`** displays the account's Player Profile Cards (up to 3 Player Profiles per `$4.99` Base Game, plus Bekkedahl test profiles `Miles #9`, `Rhett #88`, `Whelan #7`, `Cohen #14`, and `+ Create New Player`). Every Player Profile has its own individual **Profile Credential Lock** (`Enter [Player]'s Login / PIN` + **`🔓 Enter My Rink Lobby`** button, default test PIN `99`) so siblings on a shared family iPad cannot tamper with each other's private gameplay or spend each other's Puck Bucks.
3. **11-Channel Voice Registry (`window.SYNAPZ_VOICE_REGISTRY`) & 9 Age-Relatable Player Agents With Mandatory Pre-Selection Voice Audition:**
   - **9 Branded Player Agents in `assets/agents/`:**
     - `8U–12U Youth Junior Agents`: **Maya** (`agent-maya.png`) & **Jalen** (`agent-jalen.png`)
     - `10U–14U Teen Agents`: **Chloe** (`agent-chloe.png`), **Sofia** (`agent-sofia.png`) & **Leo** (`agent-leo.png`)
     - `14U–18U+ Pro Agents`: **Marcus** (`agent-marcus.png`), **Priya** (`agent-priya.png`), **Ryan** (`agent-ryan.png`) & **Claire** (`agent-claire.png`)
   - **Plus 2 Coaching Channels (`coach-bob` for On-Ice Lessons & `coach-al` for the Coach's Office):** `playCharacterVoice(characterId, clipKey, fallbackText)` checks `assets/audio/voices/<characterId>/<clipKey>.mp3` first and falls back cleanly to a distinctly tuned Web Speech voice profile per character.
   - **Mandatory 2-Step Voice Audition (`#playerAgentPickerModal`):** Clicking any Agent card highlights their portrait, displays their signature 1-sentence greeting, and **immediately plays their audible 1-sentence voice greeting** with **`🔊 Hear Voice Again`** (`#btnAuditionHearAgentAgain`) and **`✅ Hire [Agent Name] as My Agent`** (`#btnConfirmHirePlayerAgent`) before locking them in.
4. **Central Hub — The Virtual Hockey Rink Lobby (`#synapzRinkLobbySection`):**
   - Logging into a player profile transitions via `#synapzTransitionSplash` directly into the **Virtual Hockey Rink Lobby** (`#synapzRinkLobbySection`) with 5 tactile stations:
     1. **Center Ice Double Doors — `🏒 HIT THE ICE (Road to the Stanley Cup)`** (`#lobbyStationHitTheIce`)
     2. **Left Doorway — `🎽 LOCKER ROOM (Young Hockey Player Avatar, Gear & Agent)`** (`#lobbyStationLockerRoom` -> `#synapzLockerRoomModal`)
     3. **Right Doorway — `🛍️ SYNAPZ PRO SHOP (Wall of Gloves, Skates, Sticks & Visors)`** (`#lobbyStationProShop` -> `#proShopModal`)
     4. **Coach's Doorway — `📋 COACH'S OFFICE & TRAINING ROOM (Guided by Coach Al)`** (`#lobbyStationCoachOffice` -> `#synapzCoachOfficeModal`: 6-Slice Skill Pie Chart + 1-question-per-screen wizard ending in **`⚡ 5-Lesson Quick Tune-Up`** or **`🏒 10-Lesson Full Mastery Plan`**, plus **`🔗 Find / Join My Team`**)
     5. **Lobby Wall — `🖼️ FRIENDS & FAMILY COMMUNITY WALL (100% SafeSport Read-Only Social + Map Races)`** (`#lobbyStationFriendsWall` -> `#synapzFriendsWallModal`)
   - **Lower-Left Player Agent Greeter & 5-Step 1-Sentence Quadrant Spotlight Tutorial (`#lobbyActivePlayerAgentWidget`):** Spotlights one station at a time (`Hit the Ice` -> `Locker Room` -> `Pro Shop` -> `Coach's Office` -> `Friends & Family Wall`), speaking strictly 1 concise plain-English sentence per step.
   - **Universal `💾 Save & Exit to Lobby` + Persistent `🚩 Red Flag` Button:** Every major screen includes `💾 Save & Exit to Lobby`, and `#btnPersistentFounderRedFlag` floats on every screen to log priority founder flags (`status: 'founder_flagged_priority'`) with voice dictation or text notes.
5. **Phase 2 & Phase 3 — The On-Ice Lesson Screen Overhaul (`v9.4` Complete):**
   - **De-Cluttered & Standardized Lesson Screen (`#gameViewSection`):** Removed all in-drill filter chips/dropdowns and persistent action ribbons (`#rightActionRibbon`, `#tacticalActionDock`) from active lessons. Every drill keeps an identical, rock-solid layout with `#lessonConsistentBottomBar` directly below `#rinkCanvas` featuring **strictly 4 consistent, tactile 3D buttons**:
     1. **`💾 Save & Exit to Lobby`** (`#btnGameSaveExitLobby`)
     2. **`🎬 Video Clip`** (`#btnLessonWatchVideoPopup`)
     3. **`💡 More Info / Hint`** (`#btnLessonMoreInfoPopup`)
     4. **`➡️ Next Play`** (`#btnNextQuestion`)
   - **Coach Bob 1-Sentence Pop-Up Intro & Plain-Language Feedback Engine:** Coach Bob (`#coachBobPopup`, `assets/coach-bob.png`, `coach-bob` voice channel) pops up in the lower-left quadrant for a brief 1–2 sentence intro before disappearing (`🏒 Drop the Puck / Watch Play` / `#btnDismissCoachBob`) so the rink is 100% unobstructed. Permanently banned robotic jargon (`"First choice consensus optimal"` has `0` occurrences in `index.html`) and wired `window.formatPlainLanguageCoachFeedback(scenario, choiceOutcome, division)` (`<= 14 words` 1-sentence plain English for `8U/10U`; 1–2 natural coaching sentences for `12U–18U`).
   - **Top-Down Directional Hockey Player Skaters at `2x Faceoff Dot Size` (`drawTopDownSkaterToken`):** Replaced large overlapping circles on `#rinkCanvas` with top-down hockey skater figures whose body diameter is **strictly `2.0x` the rendered red faceoff dot diameter** (`skaterBodyDiameterPx === 2.0 * faceoffDotDiameterPx`, `skaterToFaceoffDotRatio === 2.0`), complete with directional helmet & shoulders (`headingRad`), left/right hockey stick & blade (`'L'` or `'R'`) with puck on the blade when carrying, and clean chest role/position badge (`LW/RW/C/LD/RD` or `F1/F2/F3/D1/D2`).
   - **3 Variable Lesson Presentation Formats (`setLessonPresentationStyle`):**
     1. **`flow_and_freeze` (`3–4s Moving Flow -> Freeze & Read`):** Animates 3.0–3.5 seconds of smooth skater and puck movement (`runLessonFlowAndFreezeAnimation`) right after Coach Bob's intro closes, then freezes with **`❄️ FREEZE — MAKE YOUR READ!`** (`#flowFreezeStatusBadge`) and **`🔄 Replay 3s Flow`** (`#btnReplay3sFlow`).
     2. **`static_hover_zones` (`Static Position & Interactive Hover-Zone Read`):** Draws 4 interactive color-coded ice zones (`Left Point / Left Wing Zone`, `Right Point / Right Wing Zone`, `The House / Slot`, `Low Corner / Net Front`) via `drawStaticHoverZones` that light up on hover/touch and select on click (`handleSelectHoverZone`).
     3. **`habit_combo` (`Habit-Combo Drills — Scan + Call + Play`):** Displays `#habitComboControlsBar` (`👀 Look Over Shoulder (Scan Ice)` + `🗣️ Call Out ("Pass!" / "D-to-D!" / "Boards!")`) and grades all 3 steps on the **3-Check Habit Scorecard** (`#habitComboScorecardBox`: `1. Scan Ice`, `2. Call Out`, `3. Smart Play`).
6. **Phase 4 — Young Hockey Player Avatar (75% Realistic Style + Visibly Worn Gear), Walk-In Wall-Style Synapz Pro Shop, IQ-Tied Puck Bucks Economy & Geographically Accurate North America Map (`v9.5` Complete):**
   - **75%-Realistic / 25%-Cartoon-Edge Young Hockey Player Avatar (`renderYoungHockeyPlayerAvatar`):** Replaced any blocky/robotic avatar drawing in `#synapzLockerRoomModal` and `#proShopModal` with a high-detail **Young Hockey Player Kid** in an athletic two-handed hockey stance (`style: '75%-realistic-25%-cartoon-edge'`) visibly wearing their equipped **🧤 Gloves** (4-Roll Pro vs. Tapered Vapor silhouette, cuff stitching, lock-thumb), **🏒 Stick** (one-piece carbon weave shaft, kick-point graphic band, curved pro blade & white/cyan tape job matching Left/Right handedness), **🥽 Helmet & Visor** (clear pro shield, smoke-blackout shield, blue-iridium mirror, gold-iridium mirror, or chrome pro cage), **⛸️ Skates** (carbon quarter-package boot, tendon guard, Tuuk-style cutout holder, and steel/black-steel/gold-steel runner), and **🎽 Jersey & Number** (`#9`, `#88`, `#7`, `#14`). Includes 1-tap **`🖤 Preview "Full Blackout" Loadout`** (`applyFullBlackoutLoadout`) and **`⚡ Equip Owned Gear`** (`equipOwnedGearLoadout`).
   - **Walk-In Wall-Style Synapz Pro Shop (`#proShopModal` & `renderProShopWallProductSvg`):** Redesigned `#proShopModal` into a walk-in hockey store with **4 tactile Wall Category Buttons** (`🧤 Wall of Gloves`, `🏒 Pro Stick Rack`, `⛸️ Wall of Skates`, `🥽 Visors & Buckets`, plus `💾 Save & Exit to Lobby`), large 75%-realistic SVG product wall cards (`renderProShopWallProductSvg(item)`), and a dedicated sponsor-ready **`⭐ PRO BRAND SHOWCASE & PROMO DROP`** display rack (`#proShopBrandShowcaseRack` featuring *Blackout Pro 4-Roll Gloves*, *Pro Carbon Pulse Stick*, *Elite Ridgecore Black-Steel Skates*, and *Smoke-Blackout Pro Visor Shield*).
   - **IQ-Tied `Puck Bucks ($)` Economy (`calculateIqTiedPuckBucks` & `completeLessonWithIqTiedPuckBucks`):** Every completed lesson awards **Puck Bucks Earned = Lesson Hockey IQ Percentage Score** (`95% IQ` -> `+95 💰 Puck Bucks`; `70% IQ` -> `+70 💰 Puck Bucks`; `< 50% IQ` -> minimal consolidation bucks + retry prompt) identically across **Map Play** and **Coach Al's 5-Lesson & 10-Lesson Tailored Plans** (`#synapzCoachOfficeModal`), explained in plain English by the player's hired **Player Agent** in the Lobby Spotlight Tour and `#proShopAgentEconomyBanner`.
   - **Geographically Accurate North America Map (`#nhlTourMapSvg`):** Replaced abstract background polygons with recognizable U.S. coastline & state boundaries (`#usaAccurateStatesGroup`), Canadian coastline & province boundaries (`#canadaAccurateProvincesGroup`: `BC`, `AB`, `SK`, `MB`, `ON`, `QC`, `NB/NS`), the 5 Great Lakes (`#greatLakesSvgGroup`), all 32 NHL Cities at their true geographic coordinates (`stateOrProvince`), and the top-corner locked milestone badge (`#postCupFutureToursTeaserBadge`: **`🌍 NEXT TOUR AFTER STANLEY CUP: Road to Olympic Gold & European Pro Tour (Locked — Win the Stanley Cup First!)`**).
7. **Phase 5 & Phase 6 — Team Portal (`Coach Login` vs. `Coach Code`), Coach's Office Lobby Guided by Coach Al, Opponent Scouting & Counter-Strategy Knowledge Base, SafeSport App Notifications, Endless Organic Drill Permutations & Concept Bucket Coverage Report (`v9.6` Complete):**
   - **Streamlined 2-Button `📋 TEAM PORTAL` Entry (`#portalCredsCoach`) & Player Team Roster Hub (`#playerTeamRosterHubModal`):**
     1. **`🧑‍💼 COACH LOGIN`** (`#btnCoachPortalDirectorSignIn`) opens the **Coach's Office Lobby (`#coachPortalModal`)** guided by **Coach Al** (`coach-al` voice channel).
     2. **`🏒 ENTER COACH CODE (Player Access)`** (`#btnCoachPortalPlayerSignIn` / `#btnCoachOfficeJoinTeam`) opens the **Player Team Roster Hub (`#playerTeamRosterHubModal`)** with **strictly 4 tactile buttons** (`📋 Team Roster & Standings` with 100% Read-Only teammate progress and private diagnostic weaknesses strictly hidden, `📥 Active & Past Lesson Plans`, `🗓️ Team Schedule & Coach Notes`, and `📈 My Team Development Plan`).
   - **Coach's Office Lobby Guided by Coach Al (`#coachPortalModal` — 4 Clean Stations + 1-Sentence Spotlight Tour):**
     - **Station 1 — `📁 Roster & Association Materials Upload Hub`:** Manage team roster seats and upload/sync Association Playbooks (`.pdf`, `.csv`, `.json`) or 1-click System Presets (`2-1-2 Forecheck`, `Protect the House`, `D-to-D / Wheel Breakout`).
     - **Station 2 — `🧠 Coach Al's Corner`:** Proactive Weekly Busywork Summary (*"Hey Coach! Dane needs work on Breakouts this week (62% IQ), and Evan scored 95% on D-Zone Coverage. I've queued a fresh Breakout Lesson Plan for the team—ready to send?"*) with 1-Click **`[✅ Confirm & Send Weekly Plan]`**, Step-by-Step Concept Picker + Natural-Language AI Prompt (`[🚀 Confirm & Send to Roster]`), **Lesson Plan History**, and **Question-by-Question Progress Report** (`[⚡ Generate & Send Individual Improvement Plans for Struggling Players]` + `[🗄️ Save Report to Archive]`).
     - **Station 3 — `🗓️ Schedule & Opponent Scouting Prep` (Backed by `window.SYNAPZ_COACHING_STRATEGY_KB`):** Maps 6 opponent tendencies (*Aggressive 2-1-2 Forecheck*, *1-2-2 Neutral Zone Trap*, *Heavy Physical / Board Pinning*, *Blue-Line Pinch / Hold-the-Line D*, *High-Penalty Team*, *Pass-Jumping / Aggressive PK*) to age-tailored USA Hockey ADM / Hockey Canada / NCAA counter-strategies (`generateOpponentCounterStrategyPlan` generating distinct `8U` vs. `16U` plans) and a 1-page **`📋 Weekend Bench Game Plan`** (`generateWeekendBenchGamePlan`).
     - **Station 4 — `🔔 100% SafeSport-Compliant Notification Center`:** Dispatches standardized App Push Notifications (`"🏒 You have a new lesson plan in Synapz!"`) with zero direct coach-to-kid email or open chat.
   - **Phase 6 — Endless Organic Drill Permutations (`getNextOrganicScenarioPermutation`) & Concept Bucket Coverage Report (`#conceptBucketCoverageReportModal` + `report.html`):**
     - Tracks `completedScenarioPermutationHashes` per player profile so once a player masters a drill permutation, they never get the exact same drill twice (dynamically varying 4-way rink rotation `0°/90°/180°/270°`, role perspective `C/LW/RW/LD/RD`, skater speed/vector, and question/presentation mode while re-testing missed concepts with fresh permutations).
     - Live **`📊 Concept Buckets & Tags Coverage Report`** (`getConceptBucketCoverageReport()`) verifying **16 Core Concept Buckets**, **`360` Base Scenarios**, **`1,440` 4-Way Geometric Rotations**, and **`5,760+` Organic Multi-Role/Mode Permutations**.
8. **6-Phase Modular Rollout Roadmap (All 6 Phases 100% Complete):**
   - **Phase 1 (Complete):** 2-Button Entry Gate, Per-Profile Login Lock, 9 Age-Relatable Player Agents (with Voice Audition), Virtual Hockey Rink Lobby (5 Stations), SafeSport Notification Bell, Universal Save & Exit to Lobby, Persistent `🚩 Red Flag`, and `[🔍 Explain This to Me]` Digest Wiring.
   - **Phase 2 & Phase 3 (Complete):** On-Ice Lesson Screen Overhaul — De-Cluttered Lesson Layout (4 Consistent Bottom Buttons), Plain-Language Coach Bob Intro/Feedback (`0` robotic jargon), Top-Down Directional Hockey Player Skaters at `2x Faceoff Dot Size`, and Variable `3–4s Moving Flow -> Freeze` / `Static Hover-Zone` / `Habit-Combo` Lesson Formats.
   - **Phase 4 (Complete):** Locker Room 75%-Realistic Young Hockey Player Avatar (Visibly Worn Gear + Full Blackout Loadout), Walk-In Wall-Style Synapz Pro Shop (Sponsor-Ready Displays), IQ-Tied Puck Bucks Economy (Map + Coach's Office 5/10-Lesson Plans), and Geographically Accurate North America Map (U.S. States + Canadian Provinces + Post-Cup Olympic/European Tour Teaser).
   - **Phase 5 (Complete):** Streamlined `📋 TEAM PORTAL` (`Coach Login` vs. `Coach Code`), Player Team Roster Hub (`#playerTeamRosterHubModal`), Coach's Office Lobby Guided by Coach Al (`#coachPortalModal` — 4 Stations), Opponent Scouting & Counter-Strategy Knowledge Base (`SYNAPZ_COACHING_STRATEGY_KB`), and 100% SafeSport Notification Center.
   - **Phase 6 (Complete):** Endless Organic Drill Permutations (`getNextOrganicScenarioPermutation`) & 16-Bucket / `360` -> `1,440` -> `5,760+` Concept Bucket & Tag Coverage Report (`#conceptBucketCoverageReportModal` & `report.html`).


## 27. The 12-Seat Board & `🚩 Seat 0` 4-Step Founder Red-Flag Council Review & Options Protocol (`v9.7` Charter)
1. **Strict 4-Step Governance Rule for Founder `🚩 Red Flags` (Zero Unreviewed Code Mutations):**
   - **Step 1 — Submit in App (`index.html` `#founderRedFlagModal`):** Submitting a `🚩 Red Flag` on any screen saves the item to `public.pucksense_agent_inbox` with `status = 'flagged_for_council_review'` (zero immediate code changes) and displays:
     `"🚩 Sent to the 12-Seat Council! The Council will review this screen, formulate Best-Practice Options, and send them in your next Nightly Report for your Final Approval before any code is changed."`
   - **Step 2 — 12-Seat Council Review & Professional Options (`Seat 0 — Council Red-Flag Options Synthesizer` in `deep_playtest_audit.js`):** During `RUN NIGHTLY AUTOPILOT`, `Seat 0` queries `status = 'flagged_for_council_review'`, navigates to the exact flagged screen/drill in headless Chrome (`screenshots/audit_red_flag_council_review.png` & `assets/audit-screenshots/seat0-red-flag-council-review.png`), convenes the relevant specialists from the **12-Seat Board**, synthesizes **Option A (Council's Recommended Best-Practice Solution)** and **Option B (Alternative Professional Approach)**, and updates the status to `status = 'council_options_ready_awaiting_approval'`.
   - **Step 3 — Top-of-Report & Nightly Email Digest Review (`report.html` & `send-board-digest.js`):** Renders **`🚩 FOUNDER RED FLAGS — 12-SEAT COUNCIL REVIEW & OPTIONS (AWAITING FINAL APPROVAL)`** (`#seat0-red-flag-council`) at the very top of `report.html` and the Nightly HTML Email Digest with the Founder's original note, live screenshot, multi-seat diagnosis, Option A vs. Option B, and 4 interactive buttons:
     - **`[🔍 Explain Options in Plain English]`** (`?action=explain_red_flag&id=...`)
     - **`[✅ Approve Option A (Recommended) for Next Build]`** (`?action=approve_option_a&id=...`)
     - **`[✅ Approve Option B for Next Build]`** (`?action=approve_option_b&id=...`)
     - **`[❌ Hold / Dismiss]`** (`?action=reject&id=...`)
   - **Step 4 — Built ONLY After Final Founder Approval:** Clicking **`[✅ Approve Option A]`** or **`[✅ Approve Option B]`** flips the row in `public.pucksense_agent_inbox` to `status = 'approved_for_build'` with `selected_option: 'Option A' | 'Option B'` so the next build pass implements the exact option approved by Coach Dane or Coach Evan.
2. **The Expanded 12-Seat Board (`12 Seats × 3 Ideas = 36-Idea Matrix`) & 4-Gate Collaborative Co-Sign:**
   - **Seats 1–10:** Core Hockey Systems, Instructional Design, Pediatric/Parent Cognition, Game Economy, Multi-Level Coaching, Association Director, Zero-Clutter UX, Film-Room Harvester, Principal `<canvas>`/Full-Stack Engineer, and Growth/Conversion Strategist.
   - **🎨 Seat 11 — Lead Art Director, 75%-Realistic Visuals & Pro Shop Gear Specialist:** Audits the 75%-realistic / 25%-cartoon-edge aesthetic across `renderYoungHockeyPlayerAvatar`, `drawTopDownSkaterToken` (`2.0x` faceoff-dot ratio), `#proShopModal` wall displays (`renderProShopWallProductSvg`), and `#nhlTourMapSvg` (`assets/audit-screenshots/seat11-art-director-avatar-shop.png`).
   - **🛡️ Seat 12 — SafeSport, Multi-Profile Privacy & 11-Voice Audio QA Specialist:** Audits 100% SafeSport one-way push notifications (`#safeSportNotificationModal`), read-only teammate roster privacy (`#playerTeamRosterHubModal`), per-profile PIN credential lock (`#playerProfileCredentialLockBox`), and the 11-channel voice registry (`window.SYNAPZ_VOICE_REGISTRY` + mandatory pre-selection voice audition in `#playerAgentPickerModal`) (`assets/audit-screenshots/seat12-safesport-voice-qa.png`).
   - **4-Gate Cross-Seat Co-Sign:** Every proposal passes **Gate A (Tactical & ADM)**, **Gate B (Child Cognition & Zero-Clutter UX)**, **Gate C (60fps `<canvas>` & Blind QA)**, and **Gate D (Visual Consistency & SafeSport/Audio QA)**.

---

## 28. Interactive Point-and-Click Illustrated Room Navigation (`assets/rooms/`) & Warm Arena Walnut Wood, Brushed Brass & Championship Blue/Gold Theme (`v9.8` Charter)
1. **5 Illustrated 3D Room Scenes (`assets/rooms/` — 75% Realistic / 25% Stylized Arena Wood & Brass Theme):**
   - **Room 1 — Two-Story Main Rink Lobby (`assets/rooms/room-rink-lobby.png` inside `#synapzRinkLobbySection`):**
     - **Center Glass Double Doors (`HIT THE ICE` — `#lobbyStationHitTheIce`):** Launches the North America Road to the Stanley Cup Map (`switchView('map')`).
     - **Left Ground-Floor Wood Doorway (`LOCKER ROOM` — `#lobbyStationLockerRoom`):** Opens Room 2 (`#synapzLockerRoomModal`).
     - **Right Ground-Floor Storefront (`PRO SHOP` — `#lobbyStationProShop`):** Opens Room 4 (`#proShopModal`).
     - **Upper-Left Balcony Doorway (`COACHES OFFICE` — `#lobbyStationCoachOffice`):** Opens Room 3 (`#synapzCoachOfficeModal`).
     - **Upper-Right Balcony Doorway (`CLUBHOUSE` — `#lobbyStationFriendsWall`) & Left Framed Wall Portraits (`#lobbyHotspotWallPortraits`):** Opens Room 5 (`#synapzFriendsWallModal`).
     - **Center-Floor `SYNAPZ HOCKEY` Medallion (`#lobbyHotspotFloorMedallion`):** Triggers the active Player Agent's 1-sentence Spotlight Tour (`applyLobbySpotlightStep(0)`).
   - **Room 2 — Player Locker Room Stall (`assets/rooms/room-locker-room.png` inside `#synapzLockerRoomModal`):**
     - **Dynamic Brass Stall Nameplate Overlay (`#lockerBrassNameplateHotspot` / `#lockerBrassNameplateText`):** Clean brushed-brass nameplate positioned directly over the upper stall header (`left: 14.5%; top: 2.5%; width: 25.5%; height: 5.5%`), dynamically displaying `<PLAYER NAME> #<NUMBER> • AGENT: <HIRED AGENT NAME>` (e.g., `MILES #9 • AGENT: LEO`) and opening `#playerAgentPickerModal` on click.
     - **6 Clickable Equipment Hotspots:** Helmet & Visor (`#lockerHotspotHelmet` -> `Visor`), Hanging Blue `#9` Jersey (`#lockerHotspotJersey` -> `Jersey`), Hockey Stick (`#lockerHotspotStick` -> `Stick`), Hockey Gloves (`#lockerHotspotGloves` -> `Gloves`), Breezers (`#lockerHotspotBreezers` -> `applyFullBlackoutLoadout(true)`), and Skates (`#lockerHotspotSkates` -> `Skates`), plus the Right Open Doorway (`#lockerHotspotDoorwayExit` -> `saveAndExitToRinkLobby()`).
   - **Room 3 — Coach's Office (`assets/rooms/room-coaches-office.png` inside `#synapzCoachOfficeModal` & `#coachPortalModal`):**
     - **5 Clickable Office Hotspots:** Desk Laptop (`#coachOfficeHotspotLaptop` / `#coachPortalHotspotLaptop`), Coach Al (`#coachOfficeHotspotCoachAl` / `#coachPortalHotspotCoachAl`), Tactical Whiteboard (`#coachOfficeHotspotWhiteboard` / `#coachPortalHotspotWhiteboard`), Left Trophy & Playbook Bookshelf (`#coachOfficeHotspotBookshelf` / `#coachPortalHotspotBookshelf`), and Right Open Doorway (`#coachOfficeHotspotDoorway` / `#coachPortalHotspotDoorway`).
   - **Room 4 — Walk-In Pro Shop (`assets/rooms/room-pro-shop.png` inside `#proShopModal`):**
     - **6 Clickable Store Fixture Hotspots:** Left Glove Wall (`#proShopHotspotGloves`), Left Skate Shelves (`#proShopHotspotSkates`), Center Stick Rack (`#proShopHotspotSticks`), Right Helmet & Visor Wall (`#proShopHotspotHelmets`), Foreground Glass Counter (`#proShopHotspotShowcaseCounter` -> `applyFullBlackoutLoadout(true)`), and Back-Left Doorway (`#proShopHotspotDoorway` -> `saveAndExitToRinkLobby()`).
   - **Room 5 — Friends & Family / Trophy Case Clubhouse (`assets/rooms/room-clubhouse.png` inside `#synapzFriendsWallModal`):**
     - **3 Clickable Clubhouse Hotspots:** Left `FRIENDS & FAMILY` Portrait Wall (`#clubhouseHotspotFriendsWall` -> `'find'`), Center `HEAD-TO-HEAD MAP RACE` Screen (`#clubhouseHotspotMapRaceScreen` -> `'race'`), and Right Glass `TROPHY CASE` (`#clubhouseHotspotTrophyCase` -> `'trophies'` + 1-tap `🏆 Open Full 3D Stanley Cup Trophy Vault`).
2. **Global `✨ Show / Hide Tap Zones` Toggle (`.btn-toggle-room-tap-zones`):**
   - Toggles `document.body.classList.toggle('room-tap-zones-visible')` so young players (8U/10U) or first-time visitors can view glowing gold dashed outlines around every interactive doorway, shelf, and piece of gear.
3. **Unique Email Subject Timestamping & `"Synapz Hockey 12-Seat Council"` Sender Name (`send-board-digest.js`):**
   - Appends a unique local date/time stamp (`[Nov 4, ...]`) to every email subject line so Gmail never collapses new reports into an old thread, and sends `senderName: "Synapz Hockey 12-Seat Council"` in the Google Apps Script payload.

---

## 29. Hard Player-Screen De-Clutter & 3-Stage Live Word-Streaming Character Speech System (`v9.9` Charter)
1. **Hard Strip-Down of All Player Screens (`#synapzCleanPlayerScreensRule` — "Rink + Coach + Max 4 Real Tactile Buttons — Zero Clutter"):**
   - **On-Ice Gameplay / Lesson Screen (`#gameViewSection`):**
     - Permanently hides all legacy global header bars (`body > header`, `#settingsDrawer`), in-drill `5v5`/`3v3`/manpower filter buttons, division/position/zone selector bars, top/bottom ribbon bars, sidebars (`#rightPanelDeck`, `#rightActionRibbon`, `#tacticalActionDock`, `#coachCornerWidget`), and plain-text links.
     - Displays **ONLY**:
       1. **Minimal 1-Line Top Bar (`#gameTopSubheader`):** Shows City/Lesson name (`#citySeriesBadge`), Question `#` (`#drillCounter`, e.g., `Play 1 of 10`), and `IQ % / 💰 Puck Bucks` pill (`#cleanGameIqBucksPill`).
       2. **Center Ice Rink (`#rinkCanvas`):** Full-width top-down ice surface + `2x Faceoff Dot` Top-Down Directional Hockey Player Skaters (`drawTopDownSkaterToken`).
       3. **Coach Bob's 3-Stage Live Word-Streaming Pop-Up (`#coachBobPopup` at `~25%` screen height) / Persistent Bottom-Left `64x64px` Circle Button (`#btnCallCoachBob`).**
       4. **Strictly 4 Real, Tactile 3D Buttons Below the Rink (`#lessonConsistentBottomBar`):** `🧢 Coach Bob (Hint)` (`#btnLessonMoreInfoPopup`), `🎬 Video Clip` (`#btnLessonWatchVideoPopup`), `💾 Save & Exit to Lobby` (`#btnGameSaveExitLobby`), and `➡️ Next Play` (`#btnNextQuestion`).
   - **Adventure Map Screen (`#mapViewSection`):**
     - Hides extra header/tier bars (`#mathseedsTierTrackBar`, `#btnMapLockerRoom`, `#btnMapProShop`, `#btnMapSwitchPortal`) and shows **ONLY**:
       1. The Geographically Accurate North America Map (`#nhlTourMapSvg`),
       2. The persistent **Player Agent Circle Button (`64x64px`)** in the bottom-left corner (`#synapzPersistentCharCircleBtn`),
       3. Two unmistakable bottom tactile 3D buttons (`#mapCleanBottomActionRow`): **`▶️ DROP THE PUCK — STOP #X: [CITY NAME]`** (`#btnPlayCurrentCity`) and **`💾 Save & Exit to Lobby`** (`#btnMapBottomSaveExitLobby`).
2. **The 3-Stage Live Word-Streaming Character Speech System (`window.SynapzCharacterSpeechEngine`):**
   - **Stage 1 — Full Lower-Left Quadrant Pop-Up (`~25%` Screen Height):** Whenever **Coach Bob** (`coach-bob` on the Ice), **Coach Al** (`coach-al` in the Coach's Office), or any of the **9 Player Agents** (`agent-maya` .. `agent-claire` in the Lobby, Map, Locker Room, Pro Shop, or Clubhouse) speaks, they pop up in the **lower-left quadrant (`~25%` of screen height)** for the **entire duration of their spoken dictation**.
   - **Stage 2 — Live Word-by-Word Synchronized Speech Bubble ("Words Come Out As They Say Them"):** Instead of dumping a static block of text, `window.SynapzCharacterSpeechEngine.speakWithLiveWordStream()` wraps each word in `.synapz-stream-word` spans (`.synapz-word-spoken`, `.synapz-word-current`, `.synapz-word-pending`) and synchronizes word-by-word unveiling (`SpeechSynthesisUtterance.onboundary` + calibrated word-cadence interval timer) alongside `#coachBobLiveStreamedWordsPreview` (`🗣️ Streaming Word X/N: "..."`).
   - **Stage 3 — Minimize to Persistent Bottom-Left `64x64px` Circle Avatar Button (1-Tap Re-Summon):** Once the character finishes speaking (or the user taps **`🏒 Drop the Puck / Watch Play`**), the quadrant pop-up smoothly minimizes down into a **persistent `64x64px` Circular Character Avatar Button** in the bottom-left corner (`#btnCallCoachBob` on `#gameViewSection`, `#synapzPersistentCharCircleBtn` across Lobby/Map/Locker/Shop/Clubhouse/Coach Office). Tapping the circle button at any time re-summons the character (`summonFromCircle`) and replays their live word-streaming speech bubble.
3. **Live Playwright Verification Screenshots (`deep_playtest_audit.js`):**
   - `screenshots/audit_clean_gameplay_screen.png` (Stripped-Down On-Ice Gameplay Screen)
   - `screenshots/audit_live_word_speech_bubble.png` (3-Stage Live Word-Streaming Character Speech System)
   - `screenshots/audit_interactive_rooms.png` (Interactive Point-and-Click Rooms + Agent Speech)

---

## 30. Deep Marathon Blind Playtest Architecture: Top 10 Consensus + 12 Seats × 5 Ideas = 60-Idea Master Report & AAA Game-QA Best Practices (`v10.0` Charter)
1. **Unhurried Real-Time Dwell & 3-Stage Animation/Speech Sampling (`deep_playtest_audit.js --marathon`):**
   - **Stage A (`t = 150ms`, `t = 600ms`, `t = 1200ms`):** Verifies Coach Bob pops up (`~25%` height), words stream progressively (`wordCount(t=1200ms) >= wordCount(t=150ms)`), and Coach Bob shrinks to the persistent corner Circle Button (`#btnCallCoachBob` / `#synapzPersistentCharCircleBtn`) when finished.
   - **Stage B (`3.0–3.5s` Moving Flow -> Freeze):** Samples skater `(x, y)` coordinates, `headingRad` stick direction, `2.0x faceoff dot` size (`skaterToFaceoffDotRatio === 2.0`), board boundary containment, and zero skater overlap across the moving lead-in before the freeze.
   - **Stage C (Re-Summon + 100% Blind Solve):** Clicks the persistent Circle Button mid-drill to verify Coach Bob re-appears with the reminder before solving 100% blind (`verifyZeroAnswerKeyPeekingInSource() === true`).
2. **72 Total Plays Across 3 Distinct Persona Tracks:**
   - **60 Blind Gold Mastery Plays (`10 plays × 6 Age Divisions: 8U, 10U, 12U, 14U, 16U, 18U`):** Across all 3 lesson formats (`flow_and_freeze`, `static_hover_zones`, `habit_combo`) and both Map Adventure Tour & Coach's Office Tailored Lesson Plan flows.
   - **12 Intentional Wrong-Answer / Confused Kid Recovery Plays (`2 per Age Division`):** Intentionally selects a wrong move / `<50%` IQ play to audit the **Mistake & Remediation UX** (verifying Coach Bob explains *why* in warm, 1-sentence natural hockey talk via `toNaturalHockeyTalk()`, verifying the `<50%` IQ retry prompt appears cleanly, and recovering on the retry to advance).
3. **4-Viewport Bounding-Box Collision, Overflow & Tap-Target Geometry Audit (`getBoundingClientRect()`):**
   - Audits all 4 viewports (`390x844` iPhone, `768x1024` iPad Portrait, `1024x768` iPad Landscape, `1280x800` Desktop) across all 8 screens (`2-Button Entry`, `Main Rink Lobby`, `Locker Room`, `Coaches Office`, `Pro Shop`, `Clubhouse`, `Map`, `On-Ice Drill`), checking zero button collisions, `>= 44x44px` touch targets, zero off-screen clipping, and `img.complete && img.naturalWidth > 0`.
4. **3-Frame Action Filmstrip Screenshots:**
   - `screenshots/marathon_frame1_intro.png` (Stage A Intro + Live Word Stream)
   - `screenshots/marathon_frame2_freeze.png` (Stage B 3.2s Flow -> Freeze Decision Frame)
   - `screenshots/marathon_frame3_feedback.png` (Stage C Gold Read + Remediation Feedback)
5. **5 Deep Recommendations Per Seat (`12 Seats × 5 = 60-Idea Master Matrix`) & `Top 10 Co-Signed Consensus Master Priorities` (`#1` to `#10`):**
   - Each of the 12 Seats produces 5 deep, telemetry-grounded recommendations (`60 total ideas`), all passing the 4-Gate Cross-Seat Peer Review (`Gate A`, `Gate B`, `Gate C`, `Gate D`), with Ranks `#1` to `#10` highlighted at the top of `report.html` and the Email Digest (`SYNAPZ HOCKEY — Special Deep Marathon Audit: Top 10 Consensus + 60-Idea Master Report [...]`).

---

## 31. `🔍 Seat 13` Chief Meta-Auditor, 100% App Scouring Heatmap, Real Data-Driven Defect Scanner & 3-Tier Founder Preference Learning Engine (`v10.1` Charter)
1. **Persistent Cross-Run Rotation Ledger (`audit_coverage_ledger.json`) & `🔍 Seat 13` Pre-Run Targeting:**
   - Tracks `runNumber`, `testedScenarioIds[]` (out of `360`), `testedPermutationHashes[]` (`scenarioId + rotation (0/90/180/270) + position (C/LW/RW/LD/RD) + division (8U-18U)` out of `5,760+`), `testedCityStops[]` (out of `32 NHL Cities`), `testedBuckets[]` (`16/16`), `testedRoomHotspots[]` (`28/28` across all 5 Illustrated Rooms), and `previousRecommendationHashes[]`.
   - Before each run, `🔍 Seat 13` inspects `audit_coverage_ledger.json`, identifies the lowest-coverage slices, and forces the current run to test 72 fresh scenarios/permutations next.
2. **Real Data-Driven Defect Scanner (`audit_live_findings.json`):**
   - Scans the live DOM, `<canvas>`, and scenario definitions in Chrome across `390x844` iPhone and `768x1024` iPad, logging exact `scenario.id`s with `8U/10U` prompts `> 14 words` or `12U–18U` prompts `> 22 words`, exact `scenario.id`s where any two skaters start or freeze within `< 0.15` normalized rink distance (`closestPair` + `mobilePixelDist390w`), and exact visible primary button counts across all 8 screens.
3. **Founder Preference Learning Engine (`founder_taste_profile.json`) & 3-Tier Progressive Trust:**
   - Computes a `🎯 Founder Alignment Match Score (0%–99%)` and classifies every recommendation into:
     - **🟢 `TIER 1: SAFE HYGIENE / MICRO-FIX` (`>= 95% Match`):** Eligible for `⚡ Auto-Approve Tier 1 Safe Micro-Fixes: ON/OFF` with `[↩️ 1-Click Undo]` (`?action=undo_tier1&id=...`).
     - **🟡 `TIER 2: HIGH-MATCH UI, ROOM & COACHING UPGRADES` (`>= 90% Match`):** Eligible for `[⭐ Approve All High-Match Picks (>=90% Match) in 1 Click]` (`?action=approve_high_match_batch`).
     - **🔴 `TIER 3: CORE ARCHITECTURE, PRICING & 🚩 RED-FLAG OPTIONS`:** Requires explicit individual Founder click (`[✅ Approve Option A]`, `[✅ Approve Option B]`, or `[✅ Approve]`).
4. **Honest 4-Gate Scoring (`4/4 Unanimous` vs. `3/4 Conditional` vs. `2/4 Vetoed`) & Guaranteed `< 75 KB` Email Payload:**
   - Every proposal that adds any UI element or control is honestly scored `3/4 Conditional (Gate B: Must replace an existing element or live inside a modal so primary screen buttons stay <= 4)`.
   - `send-board-digest.js` enforces `Buffer.byteLength(htmlBody, 'utf8') < 75,000` bytes (`< 75 KB`) across the 4 clean sections so Google Apps Script (`GmailApp.sendEmail`) delivers 100% of the time (`SYNAPZ HOCKEY — Seat 13 Audited Deep Report: Top 10 + 60 Telemetry Ideas [...]`).

---

## 32. 1-Click Remote Batch Deployment (`[🚀 BUILD & DEPLOY ALL X APPROVED UPGRADES NOW]`), 4th Button `[⏭️ Skip & Reassess]`, Post-Batch Skipped-Item Auto-Reassessment & Single Consolidated Batch Summary Email (`v10.2` Charter)
1. **Silent Instant Queueing + Sticky Bottom Deployment Cart Bar (`#founderBatchDeployBar`):**
   - Clicking `[✅ Approve]`, `[⏭️ Skip & Reassess]`, or `[❌ Reject]` on individual items in `report.html` or the Email Digest **never** triggers an email per click—each decision queues silently in `public.pucksense_agent_inbox` and updates the sticky bottom Deployment Cart Bar (`#founderBatchDeployBar`):
     **`🛒 [X] Approved  •  ⏭️ [Y] Skipped to Reassess  |  [🚀 BUILD & DEPLOY ALL [X] APPROVED UPGRADES NOW]`** (`#btnTriggerRemoteBatchDeploy`).
   - Clicking `#btnTriggerRemoteBatchDeploy` (or `?action=trigger_batch_deploy`) posts `status = 'batch_deploy_requested'` to `public.pucksense_agent_inbox`.
2. **Local/Cloud Auto-Watcher (`watch-approved-queue.js`) & GitHub Actions Workflow (`.github/workflows/deploy-approved-batch.yml`):**
   - Polls `public.pucksense_agent_inbox` for `status = 'batch_deploy_requested'` and automatically executes the 4-stage pipeline:
     `node apply-approved-batch.js && node deep_playtest_audit.js --marathon && node deploy-github-pages.js && node send-board-digest.js --marathon`
3. **`apply-approved-batch.js` & `batch_deployment_receipt.json`:**
   - Pulls all items marked `status = 'approved_for_build'`, applies them cleanly to `index.html` and `sw.js` (strictly keeping primary buttons `<= 4` on all player screens), updates `founder_taste_profile.json`, and transitions them to `status = 'completed_and_deployed'`.
4. **Subsection 4 — The 4th Decision Button `[⏭️ Skip & Reassess]` (`status = 'skipped_reassess_next_run'`) & Post-Batch Auto-Reassessment (`reassessSkippedItemsAfterBatch`):**
   - Alongside `[🔍 Explain]`, `[✅ Approve]`, and `[❌ Reject]`, every recommendation includes **`[⏭️ Skip & Reassess]`** (`?action=skip_reassess&id=...`).
   - Clicking `[⏭️ Skip & Reassess]` records **zero negative taste penalty** in `founder_taste_profile.json`, does **not** blacklist the item in `previousRecommendationHashes[]`, and displays:
     **`"⏭️ Skipped for This Batch — Seat 13 will automatically re-test this after your other approvals are built to see if it resolved itself!"`**
   - Immediately after `apply-approved-batch.js` builds the approved batch, `Seat 13` re-evaluates all skipped/unclicked items against the newly updated codebase:
     - **Case A (`status = 'auto_resolved_by_batch'`):** If the newly built upgrades already fixed or superseded that issue (e.g. `S9-A`, `S1-E`, `S7-E`, `S12-E`), automatically closes it and lists it under **`✨ Skipped Items Auto-Resolved by Your Approved Batch`**.
     - **Case B (`status = 'reassessed_awaiting_approval'`):** If still relevant after the new build (e.g. `S9-B`, `S10-B`, `S4-E`), updates its telemetry citation and surfaces it in the next report with a **`🔄 Reassessed After Last Build`** badge.
5. **Single Consolidated Batch Summary Email (`< 75 KB` in `send-board-digest.js`):**
   - Dispatches strictly **ONE** consolidated email (`< 75 KB`) containing:
     1. `✅ BATCH DEPLOYMENT RECEIPT: [N] APPROVED UPGRADES NOW LIVE` + `✨ [M] SKIPPED ITEMS AUTO-RESOLVED BY THIS BATCH` (with `[↩️ 1-Click Undo]` links).
     2. `🔄 REASSESSED ITEMS FROM LAST RUN (STILL RELEVANT AFTER NEW BUILD)`.
     3. `🚩 Seat 0 Red-Flag Council Options` + `🔍 Seat 13 100% App Scouring Heatmap (Advanced to Next Batch!)`.
     4. `🏆 Next Fresh Batch: Top 10 Consensus + 60 Non-Repeating Telemetry Ideas` (each equipped with all 4 buttons: `🔍 Explain`, `✅ Approve`, `⏭️ Skip & Reassess`, `❌ Reject`).
6. **Subsection 5 — 100% Phone-Driven Batch Deploy, Next-24-Play Rotated Audit & Next-12-Idea Email Generator (`v10.6` — Zero PC Required):**
   - **Pre-Coded 5-Batch Modular Upgrade Bank (`Batches F, G, H, I, J` = 60 Real Modular Features in `index.html`):**
     - `index.html` pre-codes all **60 real `<canvas>` / DOM / audio / coaching upgrades** across **Batches `F`, `G`, `H`, `I`, and `J`** (`S1-F..S12-F`, `S1-G..S12-G`, `S1-H..S12-H`, `S1-I..S12-I`, `S1-J..S12-J`) inside `window.SYNAPZ_5_BATCH_UPGRADE_BANK`, gated by `window.isSynapzUpgradeActive(id)` and hydrated on startup from `public.pucksense_agent_inbox` (`status = 'completed_and_deployed'`).
     - Every feature in Batches `F–J` strictly preserves `<= 4` primary buttons on all player screens (`#synapzCleanPlayerScreensRule`) and supports instant `[↩️ 1-Click Undo]` (`window.deactivateSynapzUpgrade(id)`).
   - **In-Browser 5-Phase Autonomous Loop (`window.runCloudBatchDeployAndNextAuditFromPhone()` in `report.html`):**
     - When Coach Dane or Coach Evan clicks `[✅ Approve]`, `[⏭️ Skip & Reassess]`, or `[❌ Reject]` on their phone and taps **`[🚀 DEPLOY APPROVED & GENERATE NEXT 12-IDEA AUDIT NOW]`** (`#btnTriggerRemoteBatchDeploy`), the phone browser itself executes all 5 phases with zero PC required:
       - **Phase 1 (Activate Approved Upgrades Live):** Transitions all `approved_for_build` rows to `completed_and_deployed` in Supabase (`?on_conflict=id`), activates them immediately in `index.html` via `window.syncActiveUpgradesFromSupabase()`, and updates the cloud-synced `SYNAPZ-FOUNDER-TASTE-PROFILE` record (`+3` for approved, `-5` for rejected, `0` penalty for skipped).
       - **Phase 2 (Auto-Reassess Skipped Items):** Re-evaluates all `skipped_reassess_next_run` rows (`auto_resolved_by_batch` vs. `reassessed_awaiting_approval` with fresh telemetry and zero taste penalty).
       - **Phase 3 (In-Browser 24-Play Rotated Scenario & Telemetry Audit):** Reads and advances the cloud-synced coverage ledger (`SYNAPZ-CLOUD-COVERAGE-LEDGER` in Supabase) by **24 fresh scenarios & NHL cities** (`4 plays × 6 age divisions: 8U–18U`), updates the Seat 13 Heatmap DOM live on the phone screen, and advances the active batch pointer (`Batch F -> Batch G -> Batch H -> Batch I -> Batch J`).
       - **Phase 4 (Load & `UPSERT` Next 12 Non-Repeating Seat Recommendations):** Loads the next unseen batch of 12 telemetry-grounded recommendations (`1 per Seat` + `Top 5 Co-Signed Consensus Priorities`), `UPSERT`s them to `public.pucksense_agent_inbox` (`status = 'awaiting_founder_approval'`), and re-renders Sections 1–4 live on the phone screen.
       - **Phase 5 (Direct Phone-to-Gmail `< 35 KB` Digest Dispatch):** Builds the compact `< 35 KB` HTML digest and `POST`s it directly from the phone browser to `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` (`Content-Type: 'text/plain;charset=utf-8'`, with `mode: 'no-cors'` fallback) so `danebekkedahl@gmail.com` and `evanbekk@gmail.com` receive the updated batch receipt and next 12-idea email within seconds.
7. **Subsection 6 — 390px Full-Width Mobile Cards + 2×2 Decision Grid (`0px` Overflow) & Clean `.nojekyll` GitHub Pages Deploy (`v10.7`):**
   - Redesigned `report.html` into full-width mobile recommendation cards (`.synapz-rec-card`) inside `.synapz-mobile-container` enforcing `document.documentElement.scrollWidth <= 390` (`0px` horizontal overflow on `390×844` iPhone).
   - Replaced wide horizontal button strips with a thumb-ergonomic **2×2 Decision Grid** (`.founder-decision-2x2-grid` + `min-height: 44px` `.founder-decision-btn` for `✅ Approve`, `⏭️ Skip & Reassess`, `🔍 Explain`, `❌ Reject`) with `0` clipped buttons on `390px` screens, paired with a clean `.nojekyll` root GitHub Pages deployment pipeline across `danebekkedahl/synapz-hockey` and `danebekkedahl/tactix-hockey`.
8. **Subsection 7 — Cloud-Hydrated Active Batch Persistence on `DOMContentLoaded` (`v10.8`):**
   - On page load (`DOMContentLoaded`), `report.html` queries `public.pucksense_agent_inbox` (`SYNAPZ-CLOUD-COVERAGE-LEDGER` + live card rows via `determineActiveCloudBatchLetter()` and `syncFounderDecisionsFromSupabaseCloud()`) *before* processing URL parameters or falling back to static HTML, ensuring the active cloud batch (`G..Z`) persists seamlessly across phone refreshes, tab closes, and email button taps without ever resetting to an older static batch.
9. **Subsection 8 — Clean 3-Tab Phone Inbox (`📥 To Review (12)` | `🛠️ Queued` | `✅ Live in App`), `<= 56` Decision Buttons & `window.__SYNAPZ_TEST_MODE__` Email Guard (`v10.9`):**
   - Added the sticky **3-Tab Phone Inbox Bar** (`#founderInbox3TabBar`: `📥 To Review (12)` | `🛠️ Queued` | `✅ Live in App`). Tapping `[✅ Approve]`, `[⏭️ Skip]`, or `[❌ Reject]` immediately moves that card out of `📥 To Review` into `🛠️ Queued` (`#inboxZeroTransitionFlash`), with 1-tap `[↩️ Move Back to Review]` (`window.moveCardBackToReview(id)`).
   - Permanently removed legacy `#reportDigest30TableBody` and duplicate `#reportTop5CoSignedTableBody` tables so `report.html` renders strictly **ONE unified 12-Card List** (`<= 56` total decision buttons on screen, never 341).
   - **Automated Test Email Mute Guard (`window.__SYNAPZ_TEST_MODE__`):** Whenever `window.__SYNAPZ_TEST_MODE__ === true`, `navigator.webdriver === true`, or `{ suppressEmail: true }` is passed, `runCloudBatchDeployAndNextAuditFromPhone()` mutes real Gmail webhook dispatches (`gmailWebhookStatus: 'SUPPRESSED_TEST_MODE'`), guaranteeing zero test-email spam during automated Playwright QA runs.
10. **Subsection 9 — Top-Up Mode (Preserve Untouched Cards in `📥 To Review`) & 0-Reviewed Double-Tap Guard (`v10.9.4`):**
    - **Accidental Double-Tap Guard (`reviewedOrQueuedCount === 0`):** If 0 cards in the active inbox have been moved to `🛠️ Queued` when `#btnTriggerRemoteBatchDeploy` is tapped, the launch is safely blocked (`{ ok: false, blockedZeroReviewed: true }`) with a clear prompt to review at least 1 card first.
    - **Top-Up Mode:** Launching a partial batch deploys the `approved_for_build` cards live into `✅ Live in App`, preserves **100% of untouched cards** in `📥 To Review`, and pulls strictly `slotsNeeded = 12 - untouchedCount` unseen cards from the next pre-coded batch (`pending_future_batch`) so `📥 To Review` tops right back up to `12` cards (`activeInboxIds` persisted in `SYNAPZ-CLOUD-COVERAGE-LEDGER` in Supabase).

---

## 33. Hard-Committed `CORE_DEPLOYED_UPGRADE_IDS`, Single Primary Tactical Cue Arbitration (`selectPrimaryCanvasCueForScenario`), `#emptyBankCompletionBanner` & 5-Batch Dial-In Bank (`v11.0` Charter)
1. **Hard-Committed Core Live Upgrades (`CORE_DEPLOYED_UPGRADE_IDS` in `index.html` & `report.html`):**
   - Every cumulative founder-approved upgrade (`completed_and_deployed` in `public.pucksense_agent_inbox`, strictly excluding any rejected or skipped IDs) is hard-committed directly into `CORE_DEPLOYED_UPGRADE_IDS` so 100% of approved upgrades execute immediately on first paint and offline even before Supabase responds, backed by headless Chrome functional verification (`390×844` iPhone + `1024×768` iPad) and surfaced via `#v110ChromeVerified63Banner` on `report.html` Tab 3 (`✅ Live in App`).
2. **Single Primary Canvas Cue Arbitration (`window.selectPrimaryCanvasCueForScenario(scen)` — Max 1 Tactical Overlay Per Play):**
   - Arbitrates across all active `<canvas>` tactical upgrades and enforces `maxConcurrentTacticalOverlaysPerPlay === 1` per play, selecting only the single highest-priority pedagogical visual cue matching the scenario's concept bucket (e.g., offsides tag-up line, D-to-D hinge arc, F1 angling cone, PK seam shadow, goalie sightline ray, or 1v1 gap bracket) so `#rinkCanvas` never suffers from overlapping radar rings or visual soup.
3. **Empty-Bank Completion State (`#emptyBankCompletionBanner`):**
   - When all pre-coded batches in `SYNAPZ_5_BATCH_UPGRADE_BANK` have been reviewed (`0 Kept + 0 New`), `report.html` cleanly renders `#emptyBankCompletionBanner` (`🎉 All Pre-Coded Batches Reviewed!`) to signal readiness for the next pre-coded bank generation pass.
4. **5-Batch "Dial-In & Hockey Realism" Bank (`Batches K, L, M, N, O` = 60 Upgrades Across Scenarios `185–360/360`):**
   - Tuned strictly to Dane & Evan's proven Founder Taste Profile: high hockey IQ realism, drill route accuracy, Q5 film timestamp QC, 5-room hotspot polish, and mobile UX — strictly excluding social brag cards, sales demos, or extra player-screen buttons (`63/63` -> `118/118` verified).

---

## 34. 4-Way Camera Rotation (`0°/90°/180°/270°`), Orientation-Proof Hockey Landmark Phrasing (`sanitizeToOrientationProofHockeyLandmarks`), Auto-Context `🚩` Red-Flag Capture & Rotated-Flow Bank (`v11.1` Charter)
1. **4-Way Geometric Camera Rotation (`window.transformCoordForCameraRotation(x, y, rotationDeg)`):**
   - Transforms normalized skater, puck, pass-lane, and goalie coordinates accurately across all 4 camera orientations — `0°` (Horizontal Attacking Right), `90°` (Vertical Attacking Up), `180°` (Horizontal Attacking Left), and `270°` (Vertical Attacking Down) — keeping every skater inside board boundaries (`inBounds: true`) with accurate skater/goalie facing vectors (`960/5,760` rotated permutations verified in `v111_118_upgrades_audit.json`).
2. **Orientation-Proof Hockey Landmark Phrasing (`window.sanitizeToOrientationProofHockeyLandmarks(text)`):**
   - Automatically sanitizes Coach Bob's spoken and written prompts to replace screen-relative directional words (*"left side of the screen"*, *"right side"*, *"top of the screen"*, *"skate up"*) with orientation-invariant hockey ice landmarks (*"strong-side wall"*, *"weak-side flank"*, *"attacking blue line"*, *"high slot / House"*, *"net-front post"*), ensuring prompts never contradict a `90°`, `180°`, or `270°` rotated rink view.
3. **Auto-Context `🚩` Founder Red-Flag Capture (`window.openFounderRedFlagModal()` -> `window._lastFounderRedFlagAutoContext`):**
   - Opening the persistent `🚩 Red Flag` modal automatically snapshots `{ scenarioId, rotationAngle, ageDivision, activeScreenOrModal, activeUpgradesCount }` and attaches that telemetry payload to the `flagged_for_council_review` row in `public.pucksense_agent_inbox` so `Seat 0` reproduces the exact rotated drill/room state in headless Chrome.
4. **5-Batch Rotated-Flow Bank (`Batches P, Q, R, S, T` = 60 Upgrades):**
   - Added 60 rotated-flow, multi-angle spatial awareness, and transition timing upgrades (`S1-P..S12-T`), achieving a `92%` Founder Approval Match Rate (`55/60` approved, reaching `173` cumulative live upgrades).

---

## 35. `173/173` Chrome-Verified Live Upgrades, 6-Position Role Switching (`C / LW / RW / LD / RD / G`), Dedicated Goalie Mode & Pilot-Team Launch Readiness Bank (`Batches U–Z`) (`v11.2` Charter)
1. **`173/173` Cumulative Approved Upgrades Hard-Committed & Chrome-Verified (`v112_173_upgrades_audit.json` & `window.run173UpgradesLiveAudit()`):**
   - Hard-commits all **173 `completed_and_deployed` upgrades** (`118` prior + `55` approved across Batches P–T, strictly excluding declined/skipped `S5-P, S6-P, S10-Q, S7-R, S3-S` and earlier declined items) into `CORE_DEPLOYED_UPGRADE_IDS` (`CACHE_NAME = 'synapz-hockey-v11.2-173-verified-6pos-pilot'`), verified across `390×844` iPhone and `1024×768` iPad with `0` console/page errors, `maxConcurrentTacticalOverlaysPerPlay === 1`, `<= 4` primary gameplay buttons, and `🔬 173/173 Live Upgrades Chrome-Verified (0 Conflicts • Max 1 Cue/Play)` on `report.html` Tab 3.
2. **6-Position Role Switching (`C / LW / RW / LD / RD / G` × `0°/90°/180°/270°` = `1,680/5,760` Permutations `29.2%`):**
   - Powered by `window.SIX_POSITION_ROLE_SPECS` and `window.applySixPositionRoleFidelity(scen, position, rotationDeg)`, verifying all **24 position × rotation combinations** (`youSkaterInBounds === true`, exact `YOU #` role highlight, strong-side vs. weak-side responsibilities for `LW` vs. `RW` and `LD` vs. `RD`, center low-and-slow support for `C`, and 3 role-authentic Gold/Silver/Bronze grading choices).
3. **Dedicated Goalie Mode Polish (`window.evaluateGoalieCreaseAndReboundRead(scen, rotationDeg)`):**
   - Implements dedicated `Goalie (G)` tactical reads across all 4 rotations: top-of-crease puck squareness (`TOP_OF_CREASE_SQUARE_TO_PUCK`), post-integration `RVH` seal (`POST_INTEGRATION_RVH_SEAL`) on sharp-angle/below-goal-line attacks, screen sightline peeks around net-front traffic, low-blocker corner rebound steering away from the slot, and goalie gear / Puck Bucks progression in the Locker Room & Pro Shop.
4. **Association Pilot-Team Launch Readiness (`window.verifyPilotTeamLaunchReadiness('PUCK99')`) & 6-Batch Bank (`Batches U, V, W, X, Y, Z` = 72 Upgrades / `252` Total Bank):**
   - Pre-codes **72 real executable upgrades (`S1-U..S12-Z`)** in `window.SYNAPZ_5_BATCH_UPGRADE_BANK` (total bank size = `252`, with `Batch U` `S1-U..S12-U` loaded in `📥 To Review (12)`), verifying collision-free 20-player simultaneous `?team=PUCK99` roster joins (`Minot / MAYSA Pilot Polish`), offline arena Wi-Fi outbox sync resilience, zero-lag audio prewarming across all 11 character voices, and printable 3-station coach practice cards (`Forwards`, `Defensemen`, `Goalies`) — with **ZERO** social brag cards, **ZERO** printable participation certificates, **ZERO** guest-wall popups, and **ZERO** extra gameplay buttons.
5. **Automated Startup Spec-Sync Assertion (`verifyFounderVisionAndAgentSpecsSync()` in `deep_playtest_audit.js`):**
   - At startup, `deep_playtest_audit.js` programmatically reads both `FOUNDER_VISION_NOTES.md` and `AGENT.md` across both `c:\Users\Dane\.gemini\antigravity\scratch\pucksense\` and `C:\Users\Dane\Documents\Hockey-IQ-App\`, verifies SHA-256 parity and Section 36 (`v12.0`) milestone alignment, and prints `📖 Spec Sync Verified: FOUNDER_VISION_NOTES.md & AGENT.md read and verified`.

---

## 36. v12.0 Clean-Slate Account, 4-Slot Profile & Blooket-Style `Association -> Coach -> Player` Portal Architecture (`242/242` Verified Live Upgrades)
1. **`242/242` Cumulative Approved Upgrades Hard-Committed & Chrome-Verified (`v120_242_upgrades_audit.json` & `window.run242UpgradesLiveAudit()`):**
   - Hard-commits all **242 `completed_and_deployed` upgrades** (`173` prior + `69` approved across Batches U–Z, strictly excluding declined `S11-U` and skipped `S4-U, S2-V` plus earlier declined/skipped items) into `CORE_DEPLOYED_UPGRADE_IDS` (`CACHE_NAME = 'synapz-hockey-v12.0-clean-slate-portals'`), verified in headless Chrome across `390×844` iPhone and `1024×768` iPad with `0` console/page errors, `maxConcurrentTacticalOverlaysPerPlay === 1`, and `<= 4` primary gameplay buttons.
2. **Zero Preloaded Profiles ("Start From Scratch") & Strict Character Agent Suppression on Entry / Auth / Slot Screens:**
   - Fresh visitors land on **Screen 1** with **0 pre-created accounts and 0 preloaded sample profiles** (all legacy `Miles #9`, `Rhett #88`, `Whelan #7`, `Cohen #14`, `Maya` auto-seeds removed; `?bot=1` remains strictly an ephemeral in-memory QA bypass).
   - Includes **`🚪 Log Out / Switch Account`** and **`🔄 Switch Slot`** controls in the Main Rink Lobby, Locker Stall, Coach HQ, and Association Master HQ headers so multiple family members or coaches can test on one device, plus a gated **`🔄 Reset All Test Accounts & Wipe Profiles`** control (confirmation `RESET` or PIN `1111`) at the bottom of the **`Info`** screen and in `report.html` that wipes all test accounts, profiles, and team/association codes from `localStorage` and Supabase while keeping all **242+ approved upgrades** 100% intact.
   - **Zero Character Agent on Entry/Auth/Slot Screens (`body.synapz-entry-gate-active`):** Strictly suppresses `#synapzPersistentCharCircleBtn`, `#synapzSpeechCircleBtn`, `#synapzUniversalCharSpeechOverlay`, `#synapzCharacterPopup`, `#coachBobPopup`, and background character audio across **Screen 1**, **Screen 1A-1..1A-4**, **Screen 1B-1..1B-3**, **Checkout**, and **Info**. A Player Agent ONLY appears *after* a player enters the Main Rink Lobby inside a configured Profile Slot.
3. **Minimal 1–3 Button Entry Gate (`max-width: 440px`, `0px` Overflow on `390×844`):**
   - **Screen 1 (Main Landing):** Shows ONLY the **SYNAPZ HOCKEY** Logo, `"SYNAPZ HOCKEY — PLAY. LEARN. DOMINATE."` **one single time** (zero `"HOCKEY IQ & STRATEGY PLATFORM"`, zero sub-verbiage), and **3 Clean Title-Only Buttons**: `Player Portal` (-> 1A-1), `Coaches/Association Portal` (-> 1B-1), and `Info` (-> 1C).
   - **Screen 1A-1 (`Player Portal` Gate):** `Log In` (-> 1A-3), `Create Account` (-> 1A-2), `← Back`.
   - **Screen 1A-2 (`Player Portal: Create Account`):** `Email or Username` + `Password` + 3 unlock paths (`Basic Plan — $4.99` -> 4 Slots, `Annual Plan — $49.99/yr (or $4.99/mo)` -> 4 Slots + Season Perks via 1-tap `$0.00` `Founder Pilot Sandbox Checkout`, or `Enter Coach's Team Code` validating live Supabase `SYNAPZ-TEAM-CODE:*` + `PUCK99` to unlock `Slot 1` free while `Slots 2–4` stay upgradable inside the same account).
   - **Screen 1A-3 (`Player Portal: Log In` + Max-3-Device Household Anti-Sharing Guard):** Tracks `registeredDeviceIds[]` (max `3` devices per household account) in Supabase; a 4th device prompts `"Household Device Limit (3 Devices) — Replace Oldest Device to Continue"`.
   - **Screen 1A-4 (`4 Player Profile Slots` — Blooket-Style Per-Profile Team Linking):** Displays `Slot 1..Slot 4` (`Empty` -> streamlined Profile Setup with `First Name`, `Jersey #`, `Age Division 8U–18U`, `Position C/LW/RW/LD/RD/G`, `Stick Hand`, `Avatar & 9-Agent Voice Audition`, optional `4-Digit Stall PIN`, and per-slot `Team Code`). Siblings in Slots 1–4 can each link to a **different Coach's Team Code**, and existing profiles include a 1-tap **`Join / Change Team Code`** control inside their Locker Stall so players keep 100% of their avatar, gear, Puck Bucks, and IQ stats year over year.
4. **Blooket-Style `Association -> Coach -> Player` Hierarchy & Cross-Device Cloud Sync:**
   - **Screen 1B-1 (`Coaches/Association Portal` Gate):** `Log In` (-> 1B-3), `Create Account` (-> 1B-2), `← Back`.
   - **Screen 1B-2 (`Coaches/Association: Create Account` — Zero `$4.99` Player Game Option):** `Your Name`, `Team or Association Name`, `Email or Username`, `Password`, `Age Division` + 3 role/plan paths: `Coach / Team Plan — $49.99/yr (or $4.99/mo)` (generates unique **6-Character Team Code** -> **Coach HQ**), `Enter Association Code (Coach Under Club Plan)` (validates live `SYNAPZ-ASSOC-CODE:*` + `MINOT26`, bypasses payment, generates unique **6-Character Team Code** linked under the Association rollup -> **Coach HQ**), and `Association Master Plan (Club / Hockey Director)` (generates unique **6-Character Association Code** -> **Association Master HQ**).
   - **Screen 1B-3 (`Coaches/Association: Log In`):** Routes `coach` accounts to **Coach HQ** (live Team Code + live joined player roster) and `association` accounts to **Association Master HQ** (live Association Code + live multi-team IQ & participation rollup + club team management).
   - **Cloud Persistence (`public.pucksense_agent_inbox`) & Pre-Coded `Batches AA–AD` (`48` Upgrades / `300` Total Bank):** Syncs `SYNAPZ-USER-ACCT:<id>`, `SYNAPZ-TEAM-CODE:<code>`, and `SYNAPZ-ASSOC-CODE:<code>` via deterministic UUIDs (`?on_conflict=id`) + `localStorage` fallback, and pre-codes **Batches `AA, AB, AC, AD` (`S1-AA..S12-AD` = 48 portal/onboarding polish upgrades)** with **Batch AA** loaded in `📥 To Review (12)`.


