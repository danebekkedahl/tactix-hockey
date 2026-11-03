# 🏒 TACTIX HOCKEY — PLAY. LEARN. DOMINATE. | Founder Vision, Product Architecture & Multi-Agent Pipeline (`FOUNDER_VISION_NOTES.md`)

**Official Slogan:** `PLAY. LEARN. DOMINATE.`  
**Platform Sub-Badge:** `HOCKEY IQ & STRATEGY PLATFORM`  
**Founders:** Dane Bekkedahl & Evan Bekkedahl  
**Date:** November 2, 2026  
**Purpose:** Master architectural specification synthesized from Founder strategy sessions. All Antigravity agents (`Main App Code Page`, `Tactix Hockey Learning Council Report`, and `Youth Hockey Playtest Report`) must treat this document as the authoritative product roadmap alongside `AGENT.md` and `LEARNING_COUNCIL_REPORT.md`.

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
* **Custom Lesson Builder Upsell Prompt (`#teamPortalUpsellBanner`):** When a Free Team Portal player taps `🛠️ Create My Own Lesson`, the app displays a clear upsell prompt to unlock the `Player Portal ($4.99)` + `Tactix Pro ($4.99/mo or $49.99/yr)`.

### Tier 2: `🎮 Player Portal — Base Game` (`$4.99 One-Time App Purchase`)
* Full access to the **32-Team Road to the Stanley Cup** (`Rec -> B -> A -> AA -> AAA`), 3D Avatar Customizer, Pro Gear Shop, Trophy Room, and adaptive age-tier gameplay.
* Includes the **Read-Only 6-Slice Player Performance Pie Chart**: Shows the player's overall Hockey IQ breakdown across core categories (*Forecheck, Rush & Open Ice, Zone Possession, Breakout & Regroup, Power Play, Penalty Kill*).

### Tier 3: `⚡ Tactix Pro Subscription` (`$4.99/mo` or `$49.99/yr — Save $10!`)
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
* **Single Team Coach Portal:** `$99/yr` standard, or **`$49.99/yr` (50% OFF Partner Logo Discount)** when a team/association partners with Tactix Hockey to display their crest on the Partner Banner (`#partnerAssociationBanner`).
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

## 8. Rebrand to `TACTIX HOCKEY` (`PLAY. LEARN. DOMINATE.`) & Animated `Coach Bob` (`#coachBobPopup`)

1. **Official Brand Identity (`TACTIX HOCKEY — PLAY. LEARN. DOMINATE.` + Sub-Badge `HOCKEY IQ & STRATEGY PLATFORM`):**
   * Uses `assets/tactix-logo.png` and prominently displays **`PLAY. LEARN. DOMINATE.`** below the **TACTIX HOCKEY** logo on the Login Gate (`#sandboxLoginModal`), top header (`#btnGoHomeMap`), map dashboard (`#mapViewSection`), and `report.html` (keeping **`HOCKEY IQ & STRATEGY PLATFORM`** as the sub-badge).
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

## 12. Tactix Hockey 3-Bot Scenario Factory Pipeline (`generate-tactix-bank.js`)

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



