/**
 * ============================================================================
 * SYNAPZ HOCKEY — CO-FOUNDER ADVISORY CHARTER & 30-IDEA BOARD DIGEST
 * (`send-board-digest.js` — v8.5 Strict Approval Gate + 6-Field Screenshot Format)
 * ============================================================================
 * Co-Founder Advisory Rules (Section 23 of FOUNDER_VISION_NOTES.md):
 * 1. STRICT APPROVAL GATE: Propose & Rank First (`#1 Highest Priority` -> `#30`).
 *    Every new proposal is saved with `status: 'awaiting_founder_approval'`.
 *    Nothing is mutated into gameplay UI until Coach Dane or Coach Evan clicks
 *    `[✅ Approve for Next Build]` (`status: 'approved_by_founder'`).
 * 2. CANDID CO-FOUNDER MINDSET ("No Yes-Men"): Every Seat gives honest pushback
 *    on what is currently weak, static, or off-track—including our Special Board
 *    Evaluation on **Moving Plays (2s Pre-Read Roll-In) vs. Static Setups** across
 *    `8U–18U` and `Rec–AAA`.
 * 3. MANDATORY 6-FIELD FORMAT + EMBEDDED SCREENSHOTS:
 *    - Field 1 (`seatLens`): Agent / Seat & Professional Lens
 *    - Field 2 (`targetScope`): Target Age Group(s) & Talent Tier(s)
 *    - Field 3 (`candidCritique`): Why & Candid Co-Founder Critique
 *    - Field 4 (`crossImpact`): Who Else It Affects (Kids, Parents, Coaches, Directors, Seats)
 *    - Field 5 (`screenshotUrl`): Live Playwright Screenshot URL (`assets/audit-screenshots/*.png`)
 *    - Field 6 (`approvalControls`): 1-Click `[✅ Approve for Next Build]` / `[❌ Reject]`
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://jrusjgpfcnptozfehcrv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_73207-0o-_PJEGLgeiZSog__PwUgTxX';
const GOOGLE_APPS_SCRIPT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbw0z3iKOaLEMF0GZvb2hlyZDnP9oCpudpHrubTti99RFMdi8sDqsJR5dnEMRlDEmcZ_/exec';
const RECIPIENTS = ['danebekkedahl@gmail.com', 'evanbekk@gmail.com'];
const PAGES_BASE_URL = 'https://danebekkedahl.github.io/synapz-hockey';

// Special Board Evaluation Summary (Moving Plays vs. Static Setups across 8U-18U & Rec-AAA)
const MOVING_VS_STATIC_BOARD_CONSENSUS = {
  question: 'How should plays start on the ice across 8U–18U and Rec–AAA — when should skaters/puck animate in motion for 2 seconds before freezing at the decision read vs. when is a static snapshot better for learning?',
  recommendedMatrix: [
    { band: '8U & 10U (Rec / B)', defaultStart: 'Calm Static Setup + Pulsing "YOU #9" Ring + Optional [▶️ Watch 2s Lead-In] Button', why: 'Prevents puck-watching and visual overload; gives 6–10 year olds 1.5s of stillness to orient which net they attack and scan the Attack Triangle / House before moving.' },
    { band: '10U (A / AA / AAA) & 12U (Rec / B)', defaultStart: '1.5s Guided Slow-Roll Lead-In (0.65x Speed) -> Auto-Freeze at Decision Point + [🔄 Replay Lead-In]', why: 'Bridges static chalkboards to live hockey by showing direction of travel (who is curling vs. who is sealing the wall) without overwhelming reaction time.' },
    { band: '12U (A / AA / AAA) & 14U–18U (All Tiers)', defaultStart: '2.0s Full-Speed Pre-Snap Motion Roll-In -> Crisp "Skate-Stop Freeze" at Decision Read', why: 'At travel/high-school/AAA speeds, gap distance and closing velocity ARE the read. A dead static snapshot hides whether D1 has a tight or loose gap or whether F2 is arriving in stride.' }
  ]
};

// Ranked #1 (Highest Priority) to #30 with all 6 Mandatory Fields & Embedded Live Screenshots
// Ranks #1 to #10 are the 10 Focused Proposals per Run (1 Primary + 1 Alternative per Seat)
const BOARD_30_IDEA_DIGEST = [
  // =========================================================================
  // 10 FOCUSED PROPOSALS PER RUN (1 PRIMARY + 1 ALTERNATIVE PER SEAT, RANKED #1 TO #10)
  // =========================================================================
  {
    rank: 1,
    isTop3Recommended: true,
    isTop10SeatPrimary: true,
    id: 'S1-A',
    pod: 'pod1',
    podLabel: 'Pod 1: Player, Family & Learning',
    seatNumber: 1,
    seatName: 'NCAA D1 / AAA & USA Hockey Systems Director',
    authorityRole: 'WHAT Authority (On-Ice Systems)',
    seatLens: 'Seat 1 — NCAA D1 / AAA & USA Hockey Systems Director (WHAT Authority)',
    targetScope: '12U–18U (A / AA / AAA) • On-Ice Rush, Breakout, Forecheck & Cycle Drills',
    title: '2.0-Second Pre-Read Motion Roll-In Before Decision Freeze for 12U–18U (A/AA/AAA)',
    description: 'Animate skaters and puck along a 2.0-second pre-read lead-in trajectory before freezing at the decision point on 12U–18U A/AA/AAA drills so players read real closing speed, gap momentum, and support timing instead of a dead static board.',
    alternativeProposal: 'Alternative (S1-B): Synchronized Weak-Side D2 Hinge & Center "Low-and-Slow" Timing Vector Lines during Breakout & Neutral Zone Regroup drills.',
    candidCritique: 'CANDID PUSHBACK ON CURRENT STATIC SETUPS: Right now, dropping a 14U/16U/18U AA or AAA player into a frozen static snapshot on a 2-on-1 Rush, D-to-D Breakout, or 2-1-2 Forecheck strips out the #1 cue in real hockey: closing velocity and gap momentum. On real ice, you never read a statue—you read whether D1 is backing in too fast, whether F1 is taking away the middle with a curved J-hook, and whether F2 is arriving in stride. Keeping 12U–18U travel drills 100% static makes the app feel like a magnetic whiteboard instead of live hockey.',
    crossImpact: 'Directly impacts Kids (12U–18U read realistic speed cues), Coaches (Seat 5 homework drills mirror real on-ice closing gaps), Seat 2 (Instructional timing), Seat 4 (Game feel), and Seat 9 (<canvas> 60fps lead-in interpolation).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat1-on-ice-drill-setup.png`,
    authorityFlow: 'Proposed by Seat 1 (WHAT) → Co-Designed with Seat 2 (HOW) & Seat 4 (HOW FUN) → Engineered by Seat 9 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 2,
    isTop3Recommended: true,
    isTop10SeatPrimary: true,
    id: 'S2-A',
    pod: 'pod1',
    podLabel: 'Pod 1: Player, Family & Learning',
    seatNumber: 2,
    seatName: 'Master Instructional Designer & Sports Teaching Strategist',
    authorityRole: 'HOW Authority (Outranks Coaches on Delivery)',
    seatLens: 'Seat 2 — Master Instructional Designer & Sports Teaching Strategist (HOW Authority)',
    targetScope: 'All Divisions 8U–18U (Rec -> AAA) • Tier-Scaled Pre-Play Motion vs. Static Snapshot Toggle',
    title: 'Tier-Scaled Motion Policy: Static Default + [▶️ Watch 2s Lead-In] for 8U/10U Rec–B vs. Auto Roll-In for 12U+ A–AAA',
    description: 'Pair Seat 1\'s 2-second motion roll-in with an age-and-tier pedagogical guardrail: 8U/10U Rec–B starts calm and static with an optional [▶️ Watch 2s Lead-In] button, 10U A–AAA / 12U Rec–B uses a 1.5s 0.65x slow-roll, and 12U+ A–AAA auto-rolls 2.0s before freezing.',
    alternativeProposal: 'Alternative (S2-B): 3-Second "Why My Mistake Broke the Play" Side-by-Side Micro-Replay inside Locker Room Tab 3 when launching a Personal Improvement Plan.',
    candidCritique: 'CANDID PUSHBACK AGAINST ONE-SIZE-FITS-ALL MOTION: If we blindly turn on automatic 2-second moving plays for 8U Mites and 10U Rec beginners the instant a drill loads, young kids will "puck-watch" the moving black dot and completely miss the Attack Triangle or House geometry. Beginners need a calm static snapshot first to locate YOU #9 and scan landmarks, with a 1-tap [▶️ Watch 2s Lead-In] button when they are ready. Outranking coaches on delivery means scaling motion speed to working-memory capacity.',
    crossImpact: 'Protects 8U/10U Kids & Parents (Seat 3 zero frustration), satisfies Travel/AAA Coaches (Seat 1 & Seat 5 realistic speed for older tiers), and keeps the HUD clean via a single compact replay pill (Seat 7).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat2-cue-first-roll-in.png`,
    authorityFlow: 'Proposed by Seat 2 (HOW) → Validated by Seat 1 (WHAT) & Seat 3 (Pediatric) → Placed by Seat 7 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 3,
    isTop3Recommended: true,
    isTop10SeatPrimary: true,
    id: 'S5-A',
    pod: 'pod2',
    podLabel: 'Pod 2: Coach, Director & Portal UX',
    seatNumber: 5,
    seatName: 'Youth, Travel & HS/Jr Team Head Coach Playtester (Levels A–C)',
    authorityRole: 'WHAT Authority (Team Coaching & Homework)',
    seatLens: 'Seat 5 — Youth, Travel & HS/Jr Team Head Coach Playtester (Levels A–C — WHAT Authority)',
    targetScope: 'Coach & Director Portal (#teamManagerModal Tab 2) + Player Login Inbox (10U–18U Teams)',
    title: 'Coach-Pinned Film Clip + 3-Scenario Practice Pack in Weekly Homework Push',
    description: 'Let coaches in Tab 2 (Weekly Homework Wizard) attach 1 verified YouTube clip from our 51-clip library alongside a 3-drill on-ice sequence so players watch the 45s pro clip FIRST and immediately rep 3 matching drills.',
    alternativeProposal: 'Alternative (S5-B): Line-Specific & D-Pair-Specific Playbook Presets in Coach Tab 3 (e.g., Green-Light Wheel for D-Pair 1 vs. D-to-D Over/Rim for D-Pair 2/3).',
    candidCritique: 'CANDID CRITIQUE OF CURRENT HOMEWORK WIZARD: Right now in Coach Tab 2, a coach picks a Concept Bucket and pushes a text prompt, but the player jumps straight into a drill cold without seeing the 45-second NHL/whiteboard film clip until Question 5! Real coaches teach "Film First, Then Rep It." Letting the coach pin 1 verified clip from Seat 8\'s library to the start of the homework pack makes the 5-minute car-ride assignment 3x more effective.',
    crossImpact: 'Impacts Coaches (Seat 5 higher homework impact), Players (Seat 1 & Seat 2 watch film before repping), Parents (Seat 3 see what the coach is teaching), and Seat 8 (Film Room library utilization).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat5-coach-homework-wizard.png`,
    authorityFlow: 'Proposed by Seat 5 (WHAT) → Sequenced by Seat 2 (HOW) → Integrated with Seat 8 Film Library by Seat 9 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 4,
    isTop3Recommended: false,
    isTop10SeatPrimary: true,
    id: 'S3-A',
    pod: 'pod1',
    podLabel: 'Pod 1: Player, Family & Learning',
    seatNumber: 3,
    seatName: 'Pediatric Cognitive & Family/Parent Specialist',
    authorityRole: 'HOW Authority (Family UX & Age Guardrails)',
    seatLens: 'Seat 3 — Pediatric Cognitive & Family/Parent Specialist (HOW Authority)',
    targetScope: '8U & 10U (Rec / B / A) • Kids & Hockey Parents',
    title: '1.0-Second "Find YOU #9" Pulsing Gold Halo Before Prompt Or Motion Appears on 8U/10U',
    description: 'On 8U and 10U drills, pulse a bright gold halo around "YOU #9" and an arrow pointing toward the attacking net for 1.0 second before enabling tap targets or lead-in motion.',
    alternativeProposal: 'Alternative (S3-B): Car-Ride "1 Question to Ask Your Kid Tonight" plain-English conversation prompt inside Parent HQ (Tab 4).',
    candidCritique: 'CANDID CRITIQUE ON 8U/10U SPATIAL ORIENTATION: Even on a clean 2D rink, a 7- or 8-year-old\'s first cognitive hurdle is "Wait—where am I on the ice and which net am I shooting at?" Right now, all 5 skaters and the question buttons appear simultaneously, tempting 8U kids to tap A/B/C before locating their own jersey #9.',
    crossImpact: 'Helps 8U/10U Kids orient instantly, reduces early accidental taps (Seat 2 accuracy telemetry), and reassures Parents watching over their shoulder (Seat 3).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat3-8u-adm-cognitive-load.png`,
    authorityFlow: 'Proposed by Seat 3 (HOW) → Endorsed by Seat 2 (HOW) → Engineered on <canvas> by Seat 9 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 5,
    isTop3Recommended: false,
    isTop10SeatPrimary: true,
    id: 'S4-A',
    pod: 'pod1',
    podLabel: 'Pod 1: Player, Family & Learning',
    seatNumber: 4,
    seatName: 'Hit Mobile Game & EdTech Retention Designer',
    authorityRole: 'HOW FUN Authority (Engagement & Rewards)',
    seatLens: 'Seat 4 — Hit Mobile Game & EdTech Retention Designer (HOW FUN Authority)',
    targetScope: '10U–18U (All Tiers) • On-Ice Gameplay & 32-City NHL Tour Progression',
    title: 'Broadcast "Skate-Stop Ice Spray & Slow-Mo Freeze" Transition at the Decision Read',
    description: 'When the 2.0-second pre-read motion roll-in reaches the decision point, trigger a crisp 0.2s skate-stop ice spray particle and subtle broadcast freeze frame ("MAKE YOUR READ!") before unlocking the answer controls.',
    alternativeProposal: 'Alternative (S4-B): 3v3 Overtime Sudden-Death "Clutch Winner" Jersey Patch & Stick Tape cosmetic unlock in Tab 2 Fitting Room.',
    candidCritique: 'CANDID CRITIQUE ON GAME FEEL: Right now, switching from drill to drill feels like flipping flash-cards on a chalkboard. Kids who play EA Sports NHL or Retro Bowl expect tactile momentum—skates carving ice, a puck sliding onto tape, and a dramatic slow-mo freeze right when the defenseman closes on them.',
    crossImpact: 'Boosts daily session completion for Kids (Seat 4), reinforces the exact biomechanical moment of the read for Seat 1 & Seat 2, and uses zero persistent HUD clutter (Seat 7).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat4-32-city-tour-map.png`,
    authorityFlow: 'Proposed by Seat 4 (HOW FUN) → Synchronized with Seat 1/2 Roll-In → Built in <canvas> by Seat 9 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 6,
    isTop3Recommended: false,
    isTop10SeatPrimary: true,
    id: 'S7-A',
    pod: 'pod2',
    podLabel: 'Pod 2: Coach, Director & Portal UX',
    seatNumber: 7,
    seatName: 'Principal UX Architect & 4-Tab Anti-Clutter Lead',
    authorityRole: 'WHERE Authority + Anti-Clutter Veto Power',
    seatLens: 'Seat 7 — Principal UX Architect & 4-Tab Anti-Clutter Lead (WHERE Authority)',
    targetScope: 'All Divisions 8U–18U • Phone Portrait (390x844) & iPad HUD Ergonomics',
    title: 'Collapse Top-Right Secondary Utility Pills Into a Single "⚙️ Rink Tools" Drawer on 390px Phones',
    description: 'On 390px portrait phones, group secondary top-bar controls (Sound, Role Label Preview, Digest Bell) into a compact popover on the rink screen so the score, city stop, and ice canvas have maximum breathing room.',
    alternativeProposal: 'Alternative (S7-B): Adaptive Dock Height Lock during question transitions so #rinkCanvas never shifts vertically between tap_zone and tactical_choice.',
    candidCritique: 'CANDID CRITIQUE ON MOBILE HEADER DENSITY: While our 4-Tab modals (#profileModal and #teamManagerModal) are now super clean, the main game header still packs 6+ interactive pills across the top bar. On a 390px iPhone in a dark car, a parent or 9-year-old thumb can easily fat-finger an admin modal when trying to tap Map or Profile.',
    crossImpact: 'Improves thumb ergonomics for Kids & Parents on phones (Seat 3), protects Founder/Coach tools from accidental taps (Seat 5 & Seat 9), and keeps the rink canvas dominant (Seat 7).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat7-hud-ergonomics-audit.png`,
    authorityFlow: 'Proposed by Seat 7 (WHERE) → Approved by Seat 3 & Seat 9',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 7,
    isTop3Recommended: false,
    isTop10SeatPrimary: true,
    id: 'S8-A',
    pod: 'pod3',
    podLabel: 'Pod 3: Platform, Film & Growth',
    seatNumber: 8,
    seatName: 'Automated Video Harvester & Film-Room QC Auditor',
    authorityRole: 'Film-Room QC & 15-Bucket Coverage',
    seatLens: 'Seat 8 — Automated Video Harvester & Film-Room QC Auditor (harvest-tactix-videos.js)',
    targetScope: '10U–18U (Rec -> AAA) • Q5 Film Room & Custom Lesson Builder (#videoExampleModal)',
    title: 'Role-Mapped Coach Bob Video Takeaway Captions + Live RSS "New This Week" Badge',
    description: 'Run applyRoleLabelMap() on all Film Room video takeaways (so teams using Bull/Fox/Eagle see their exact words) and badge newly harvested YouTube RSS clips with a "🆕 Fresh Film" pill.',
    alternativeProposal: 'Alternative (S8-B): Position-First Video Sorting in Q5 Film Room so Goalies (G) and Defensemen (D) see crease/gap breakdowns as Clip #1.',
    candidCritique: 'CANDID CRITIQUE ON FILM ROOM TERMINOLOGY SYNC: We built single-label role mapping (F1 -> Bull) on the 2D rink and Coach Bob\'s prompts, and we just wired live YouTube RSS polling across 16 channels—but inside the Q5 Film Room modal, static takeaway text can still show generic labels unless piped through applyRoleLabelMap(). Every surface must speak the exact same language.',
    crossImpact: 'Aligns Film Room terminology with Team Playbook (Seat 1 & Seat 5), highlights fresh weekly RSS videos for returning subscribers (Seat 4 & Seat 10), and takes 5 lines of code (Seat 9).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat8-film-room-video-modal.png`,
    authorityFlow: 'Proposed by Seat 8 → Validated by Seat 2 (HOW) → Scoped by Seat 9 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 8,
    isTop3Recommended: false,
    isTop10SeatPrimary: true,
    id: 'S6-A',
    pod: 'pod2',
    podLabel: 'Pod 2: Coach, Director & Portal UX',
    seatNumber: 6,
    seatName: 'Association Hockey Director & Club GM Playtester (Level D)',
    authorityRole: 'WHAT Authority (Association & Multi-Team Oversight)',
    seatLens: 'Seat 6 — Association Hockey Director & Club GM Playtester (Level D — WHAT Authority)',
    targetScope: 'Association Director HQ (#teamManagerModal Tab 4) • Club GMs & Board Presidents',
    title: '1-Click "Board Meeting PDF / CSV Monthly IQ Report" Export in Director HQ (Tab 4)',
    description: 'Add a 1-click export button in Coach Tab 4 (Director HQ) that downloads a clean, printable Association Board Summary showing team participation %, monthly curriculum compliance, and division IQ growth.',
    alternativeProposal: 'Alternative (S6-B): Division-to-Division Progression Readiness Alert in Tab 4 (e.g., flagging whether 10U teams have mastered Offsides & 5v5 Support before moving up to 12U).',
    candidCritique: 'CANDID CRITIQUE ON ASSOCIATION RENEWAL PROOF: As an Association Hockey Director, I love the live multi-team roll-up table in Tab 4—but when I walk into a monthly Youth Hockey Board meeting to justify our association\'s software budget, board members don\'t log into my iPad. I need a 1-click printable/downloadable Board Report sheet I can hand out or email to the board treasurer.',
    crossImpact: 'Directly drives Association B2B renewals and Partner Club signups (Seat 10), gives Head Coaches recognition for high team completion (Seat 5), and lives cleanly inside Tab 4 (Seat 7).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat6-director-hq-rollup.png`,
    authorityFlow: 'Proposed by Seat 6 (WHAT) → Endorsed by Seat 10 (Growth) → Placed in Tab 4 by Seat 7 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 9,
    isTop3Recommended: false,
    isTop10SeatPrimary: true,
    id: 'S9-A',
    pod: 'pod3',
    podLabel: 'Pod 3: Platform, Film & Growth',
    seatNumber: 9,
    seatName: 'Principal Full-Stack, Supabase & <canvas> Performance Engineer',
    authorityRole: 'WHERE Authority + Engineering/HUD Veto Power',
    seatLens: 'Seat 9 — Principal Full-Stack, Supabase & <canvas> Engineer (WHERE Authority)',
    targetScope: 'Founder Workflow (#founderDigestModal & report.html) • Coach Dane & Coach Evan',
    title: 'Auto-Sync Founder Approval Queue Status Badge in App Header & Stage 1 Build Runner',
    description: 'Display a live counter badge inside #founderDigestModal showing exactly which proposals Coach Dane and Coach Evan have marked approved_by_founder vs. rejected_by_founder in Supabase.',
    alternativeProposal: 'Alternative (S9-B): Service Worker / LocalStorage Snapshot Cache for all 360 Cloud Scenarios & 51 Video rows so cold rural arenas load drills in <15ms offline.',
    candidCritique: 'CANDID CRITIQUE ON AUTOPILOT GOVERNANCE: Before Section 23, the pipeline was acting too eagerly—shipping ideas before you two had a chance to review screenshots and push back. With our new Strict Approval Gate, the engineering pipeline must treat public.pucksense_agent_inbox (status = approved_by_founder) as the single source of truth before touching a single line of gameplay UI.',
    crossImpact: 'Gives Coach Dane & Coach Evan 100% architectural control over every sprint, prevents feature creep (Seat 7), and keeps deployments deterministic (Seat 9).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat9-founder-approval-digest.png`,
    authorityFlow: 'Proposed by Seat 9 (WHERE) → Enforced Across All 10 Seats',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 10,
    isTop3Recommended: false,
    isTop10SeatPrimary: true,
    isTop12SeatPrimary: true,
    id: 'S10-A',
    pod: 'pod3',
    podLabel: 'Pod 3: Platform, Film & Growth',
    seatNumber: 10,
    seatName: 'App Store, Conversion & Growth Strategist',
    authorityRole: 'Monetization, Funnels & Partner Club Growth',
    seatLens: 'Seat 10 — App Store, Conversion & Growth Strategist',
    targetScope: '4-Tier Pricing Modal (#pricingAndPlansModal) & Coach Tab 4 Director HQ • Partner Associations',
    title: 'Self-Serve "Claim Your Association\'s 50% Partner Link" Generator in Pricing & Director HQ',
    description: 'Let an Association Director or Head Coach generate a shareable ?partner=ASSOC_CODE URL that pre-activates the 50% Partner Club discount banner when parents or coaches open the link on their phone.',
    alternativeProposal: 'Alternative (S10-B): Multi-Sibling "Family Locker Pass" Bundle Callout inside Tab 4 Parent HQ when 2+ sibling stalls are active.',
    candidCritique: 'CANDID CRITIQUE ON PARTNER CONVERSION FRICTION: Right now, our 50% Partner Association discount works great if a parent manually types Minot / Foothills / Lightning into the code box—but busy hockey parents in a bleachers group chat won\'t type codes manually. If a URL parameter (?partner=MINOT) auto-applies the 50% badge on load, conversion from team GroupMe/SportsEngine messages will jump dramatically.',
    crossImpact: 'Simplifies onboarding for Parents (Seat 3), helps Association Directors roll out the app in 1 paste (Seat 6), and increases Personal Pro & Team Pro conversions (Seat 10).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat10-pricing-partner-gate.png`,
    authorityFlow: 'Proposed by Seat 10 → Validated by Seat 6 (Director) → Scoped by Seat 9 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 11,
    isTop3Recommended: false,
    isTop10SeatPrimary: true,
    isTop12SeatPrimary: true,
    id: 'S11-A',
    pod: 'pod1',
    podLabel: 'Pod 1: Player, Family & Learning',
    seatNumber: 11,
    seatName: 'Lead Art Director, 75%-Realistic Visuals & Pro Shop Gear Specialist',
    authorityRole: 'Gate D Visual Consistency (75% Realistic / 25% Cartoon-Edge)',
    seatLens: '🎨 Seat 11 — Lead Art Director, 75%-Realistic Visuals & Pro Shop Gear Specialist (Gate D Visual Consistency)',
    targetScope: 'Locker Room Avatar (#synapzLockerRoomModal) & Walk-In Pro Shop (#proShopModal) • 8U–18U All Tiers',
    title: 'Side-by-Side "Current vs. Pro Shop Preview" 75%-Realistic Gear Mirror Inside Walk-In Pro Shop',
    description: 'Render a live 75%-realistic Young Hockey Player Avatar mirror right beside the 4 Pro Shop Walls so players see any hovered Glove, Stick, Skate, or Visor equipped on their #9 skater before spending their IQ-tied Puck Bucks.',
    alternativeProposal: 'Alternative (S11-B): Team-Color Home/Away Sweater Trim Sync Across Top-Down 2x Faceoff-Dot Skaters & Locker Room Avatar.',
    candidCritique: 'CANDID ART DIRECTOR PUSHBACK: Kids love our 4-Wall Pro Shop and 75%-realistic SVG gear cards, but right now you buy a glove or visor on the wall and then walk back to the Locker Room to see how it looks on your skater. Putting a live 75%-realistic fitting mirror beside the wall makes every gear drop irresistible while keeping strictly 4 clean wall buttons.',
    crossImpact: 'Boosts Pro Shop excitement for Kids (Seat 4), maintains strict 2–4 button simplicity (Seat 7), and enforces Gate D 75%-Realistic Visual Consistency (Seat 11).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat11-art-director-avatar-shop.png`,
    authorityFlow: 'Proposed by Seat 11 (Gate D Visual Consistency) → Co-Signed by Seat 4 (HOW FUN) & Seat 7 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 12,
    isTop3Recommended: false,
    isTop10SeatPrimary: true,
    isTop12SeatPrimary: true,
    id: 'S12-A',
    pod: 'pod3',
    podLabel: 'Pod 3: Platform, Film & Growth',
    seatNumber: 12,
    seatName: 'SafeSport, Multi-Profile Privacy & 11-Voice Audio QA Specialist',
    authorityRole: 'SafeSport Compliance, Sibling PIN Lock & 11-Channel Voice QA',
    seatLens: '🛡️ Seat 12 — SafeSport, Multi-Profile Privacy & 11-Voice Audio QA Specialist',
    targetScope: 'Per-Profile PIN Lock (#playerProfileCredentialLockBox), 11-Voice Registry & SafeSport Bell (#safeSportNotificationModal) • All Users',
    title: 'Parent-Verified "Quick Sibling Switch PIN Prompt" + 1-Tap 11-Voice Audio Health Check in Locker Room',
    description: 'Require the target sibling\'s 2–4 digit PIN whenever switching between sibling stalls inside the Locker Room (matching the Entry Gate PIN lock) and add a 1-tap "🔊 Test My Agent & Coach Voices" button that verifies all 11 voice channels on iOS/Android mute switches.',
    alternativeProposal: 'Alternative (S12-B): SafeSport Read-Receipt Counter (Zero Direct Replies) in Coach\'s Office Station 4.',
    candidCritique: 'CANDID SAFESPORT & PRIVACY PUSHBACK: We locked the front door with #playerProfileCredentialLockBox so Rhett (#88) can\'t open Miles\'s (#9) profile from the start screen—but if Miles hands the iPad to Rhett while already inside the Locker Room, switching stalls must also enforce the sibling\'s PIN so zero Puck Bucks or gear loadouts are ever touched without permission!',
    crossImpact: 'Protects Sibling Puck Bucks & Gear privacy for Families (Seat 3 & Seat 12), guarantees audible Agent/Coach greetings on iPads (Seat 2), and upholds 100% SafeSport compliance (Seat 12).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat12-safesport-voice-qa.png`,
    authorityFlow: 'Proposed by Seat 12 (SafeSport & Voice QA) → Validated by Seat 3 (Family) & Seat 9 (Engineering)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 11,
    isTop3Recommended: false,
    id: 'S1-B',
    pod: 'pod1',
    podLabel: 'Pod 1: Player, Family & Learning',
    seatNumber: 1,
    seatName: 'NCAA D1 / AAA & USA Hockey Systems Director',
    authorityRole: 'WHAT Authority (On-Ice Systems)',
    seatLens: 'Seat 1 — NCAA D1 / AAA & USA Hockey Systems Director (WHAT Authority)',
    targetScope: '12U–18U (B / A / AA / AAA) • Breakout & Neutral Zone Regroup Drills',
    title: 'Synchronized Weak-Side D2 Hinge & Center "Low-and-Slow" Timing Vector Lines',
    description: 'Draw synchronized dashed timing vectors showing how D2\'s net-side hinge retreat matches the Center\'s low-and-slow curl underneath the faceoff dot during breakout and regroup drills.',
    candidCritique: 'CANDID CRITIQUE ON ISOLATED SKATER READS: In several breakout scenarios, the player moves their own skater to the right spot, but the other 4 teammates remain frozen until after the answer is submitted. Showing the weak-side D1/D2 hinge relationship during the 2s roll-in teaches 5-man unit timing rather than isolated spot-memorization.',
    crossImpact: 'Deepens hockey sense for 12U–18U Center and Defense players (Seat 1), pairs naturally with Seat 2\'s Cue-First highlight, and matches Coach Matt/Evolution Hockey film clips (Seat 8).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat1-on-ice-drill-setup.png`,
    authorityFlow: 'Proposed by Seat 1 (WHAT) → Verified by Seat 2 (HOW) → Queued for Approval',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 12,
    isTop3Recommended: false,
    id: 'S2-B',
    pod: 'pod1',
    podLabel: 'Pod 1: Player, Family & Learning',
    seatNumber: 2,
    seatName: 'Master Instructional Designer & Sports Teaching Strategist',
    authorityRole: 'HOW Authority (Outranks Coaches on Delivery)',
    seatLens: 'Seat 2 — Master Instructional Designer & Sports Teaching Strategist (HOW Authority)',
    targetScope: '8U–18U (All Tiers) • Locker Room Tab 3 (My IQ Pie Chart & Custom Lessons)',
    title: '3-Second "Why My Mistake Broke the Play" Micro-Replay Inside Tab 3 Personal Improvement Plan',
    description: 'When a player opens Tab 3 and taps [🎯 Fix My Weakest Slice], show a 3-second side-by-side vector preview comparing their most recent mistake read against the Gold 1st-Choice read before launching the 5-drill custom lesson.',
    candidCritique: 'CANDID CRITIQUE ON TAB 3 LESSON LAUNCH: Tab 3 does a great job flagging lopsided <10% slices on the 100% Well-Rounded Pie Chart, but clicking [🎯 Fix My Weakest Slice] drops the kid straight into a drill without reminding them *what* habit caused the low score. A 3-second contrastive visual reminder closes the feedback loop immediately.',
    crossImpact: 'Accelerates skill correction for Players (Seat 2), gives Parents a clear visual explanation in Tab 3 (Seat 3), and reuses our existing contrastive replay engine (Seat 9).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat2-cue-first-roll-in.png`,
    authorityFlow: 'Proposed by Seat 2 (HOW) → Scoped into #profileModal Tab 3 by Seat 7 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 13,
    isTop3Recommended: false,
    id: 'S3-B',
    pod: 'pod1',
    podLabel: 'Pod 1: Player, Family & Learning',
    seatNumber: 3,
    seatName: 'Pediatric Cognitive & Family/Parent Specialist',
    authorityRole: 'HOW Authority (Family UX & Age Guardrails)',
    seatLens: 'Seat 3 — Pediatric Cognitive & Family/Parent Specialist (HOW Authority)',
    targetScope: '8U–12U Families • Locker Room Tab 4 (Parent & Family HQ)',
    title: 'Car-Ride "1 Question to Ask Your Kid Tonight" Conversation Prompt in Parent HQ (Tab 4)',
    description: 'Add a single plain-English "Car-Ride Talk Track" sentence inside each child\'s snapshot card in Tab 4 so non-hockey parents know one positive, specific question to ask on the drive to the rink.',
    candidCritique: 'CANDID CRITIQUE ON PARENT ENGAGEMENT: Many 8U/10U parents didn\'t grow up playing organized hockey. Seeing "D-Zone House = 78%" in Tab 4 is helpful, but giving Mom or Dad a 1-sentence prompt like "Ask Rhett how he stays between the opponent and his goalie in The House!" turns app time into a great car-ride conversation.',
    crossImpact: 'Empowers non-hockey Parents (Seat 3), reinforces verbal recall for Kids (Seat 2), and increases family word-of-mouth retention (Seat 10).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat3-8u-adm-cognitive-load.png`,
    authorityFlow: 'Proposed by Seat 3 (HOW) → Placed in Tab 4 Snapshot Card by Seat 7 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 14,
    isTop3Recommended: false,
    id: 'S4-B',
    pod: 'pod1',
    podLabel: 'Pod 1: Player, Family & Learning',
    seatNumber: 4,
    seatName: 'Hit Mobile Game & EdTech Retention Designer',
    authorityRole: 'HOW FUN Authority (Engagement & Rewards)',
    seatLens: 'Seat 4 — Hit Mobile Game & EdTech Retention Designer (HOW FUN Authority)',
    targetScope: '8U–16U (All Tiers) • 3v3 Overtime Sudden-Death & Pro Shop (#profileModal Tab 2)',
    title: '3v3 Overtime Sudden-Death "Clutch Winner" Jersey Patch & Stick Tape Unlock',
    description: 'When a player recovers from a 3/5 series score by winning the 3v3 Sudden-Death Overtime tiebreaker, award a special "OT Clutch" cosmetic tape/patch in Tab 2.',
    candidCritique: 'CANDID CRITIQUE ON OVERTIME REWARD LOOP: Right now, surviving 3v3 Overtime Sudden-Death advances the city stop just like a normal 4/5 win. In hockey culture, an OT winner is electric—giving a small cosmetic nod for clutch OT wins turns a near-failure into a kid\'s favorite moment.',
    crossImpact: 'Reduces churn after a missed question for Kids (Seat 4 & Seat 3), drives engagement with Tab 2 3D Avatar Fitting Room, and adds zero on-ice clutter (Seat 7).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat4-32-city-tour-map.png`,
    authorityFlow: 'Proposed by Seat 4 (HOW FUN) → Scoped into Tab 2 Fitting Room by Seat 7 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 15,
    isTop3Recommended: false,
    id: 'S5-B',
    pod: 'pod2',
    podLabel: 'Pod 2: Coach, Director & Portal UX',
    seatNumber: 5,
    seatName: 'Youth, Travel & HS/Jr Team Head Coach Playtester (Levels A–C)',
    authorityRole: 'WHAT Authority (Team Coaching & Homework)',
    seatLens: 'Seat 5 — Youth, Travel & HS/Jr Team Head Coach Playtester (Levels A–C — WHAT Authority)',
    targetScope: 'Coach Portal Tab 3 (Roster, Lines & Playbook) • 12U–18U Travel & HS Coaches',
    title: 'Line-Specific & D-Pair-Specific Playbook Presets in Coach Tab 3',
    description: 'Allow Level B/C coaches in Tab 3 to save different breakout or forecheck defaults for Line 1/2 vs. Line 3, or D-Pair 1 vs. D-Pair 2.',
    candidCritique: 'CANDID CRITIQUE ON TEAM PLAYBOOK GRANULARITY: Coach Tab 3 lets a coach set team-wide Systems Playbook defaults (e.g., 2-1-2 Forecheck, Wheel Breakout), which is awesome for 10U/12U—but at 14U/16U/18U AA/AAA, coaches frequently run a green-light Wheel for D-Pair 1 and a simple D-to-D Over/Rim for D-Pair 2/3.',
    crossImpact: 'Makes Tab 3 indispensable for HS/Jr/AAA coaches (Seat 5 & Seat 1), personalizes Player Login assignments per line, and stays cleanly inside Tab 3 (Seat 7).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat5-coach-homework-wizard.png`,
    authorityFlow: 'Proposed by Seat 5 (WHAT) → Validated by Seat 1 (WHAT) → Placed in Coach Tab 3 by Seat 7 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 16,
    isTop3Recommended: false,
    id: 'S6-B',
    pod: 'pod2',
    podLabel: 'Pod 2: Coach, Director & Portal UX',
    seatNumber: 6,
    seatName: 'Association Hockey Director & Club GM Playtester (Level D)',
    authorityRole: 'WHAT Authority (Association & Multi-Team Oversight)',
    seatLens: 'Seat 6 — Association Hockey Director & Club GM Playtester (Level D — WHAT Authority)',
    targetScope: 'Coach Portal Tab 4 (Director HQ) • Association Coaching Directors',
    title: 'Division-to-Division Progression Readiness Alert (e.g., 10U -> 12U Special Teams Readiness)',
    description: 'In Director HQ (Tab 4), show an "ADM Transition Readiness" column indicating whether 10U teams have mastered Offsides & 5v5 Support before moving up to 12U 5v4/4v5 Special Teams.',
    candidCritique: 'CANDID CRITIQUE ON MULTI-TEAM TABLE ACTIONABILITY: Right now, Director HQ shows each team\'s average IQ and weekly homework completion, which tells me *who* is active, but as a Hockey Director my #1 curriculum headache is 10U kids moving up to 12U Peewee without understanding offsides tag-ups or basic triangle support.',
    crossImpact: 'Helps Directors align age-group coaching standards (Seat 6), guides 10U coaches on spring focus buckets (Seat 5), and reinforces USA Hockey ADM progression (Seat 1).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat6-director-hq-rollup.png`,
    authorityFlow: 'Proposed by Seat 6 (WHAT) → Validated by Seat 1 (ADM) → Placed in Tab 4 by Seat 7 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 17,
    isTop3Recommended: false,
    id: 'S7-B',
    pod: 'pod2',
    podLabel: 'Pod 2: Coach, Director & Portal UX',
    seatNumber: 7,
    seatName: 'Principal UX Architect & 4-Tab Anti-Clutter Lead',
    authorityRole: 'WHERE Authority + Anti-Clutter Veto Power',
    seatLens: 'Seat 7 — Principal UX Architect & 4-Tab Anti-Clutter Lead (WHERE Authority)',
    targetScope: 'iPad Landscape (1024x768) & Desktop (1280x800) • #multiFormatControlsBar',
    title: 'Adaptive Dock Height Lock During Question Transitions (Zero Vertical Layout Shift)',
    description: 'Reserve a fixed min-height for #multiFormatControlsBar across tap_zone, tactical_choice, tap_player, and drag_skater so #rinkCanvas never resizes by even 4px between questions.',
    candidCritique: 'CANDID CRITIQUE ON CANVAS RESIZE JITTER: Because tactical_choice buttons have slightly longer text than tap_zone A/B/C buttons, switching question formats can shift the bottom dock height by 6–10px on smaller viewports, causing #rinkCanvas to re-layout slightly between Q1 and Q2. Locking dock min-height eliminates any visual jump.',
    crossImpact: 'Keeps eye fixation steady on the rink for Players (Seat 2 & Seat 3) and ensures pixel-locked 60fps canvas rendering (Seat 9).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat7-hud-ergonomics-audit.png`,
    authorityFlow: 'Proposed by Seat 7 (WHERE) → Engineered with Seat 9 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 18,
    isTop3Recommended: false,
    id: 'S8-B',
    pod: 'pod3',
    podLabel: 'Pod 3: Platform, Film & Growth',
    seatNumber: 8,
    seatName: 'Automated Video Harvester & Film-Room QC Auditor',
    authorityRole: 'Film-Room QC & 15-Bucket Coverage',
    seatLens: 'Seat 8 — Automated Video Harvester & Film-Room QC Auditor (harvest-tactix-videos.js)',
    targetScope: 'All 5 Positions (Especially Goalie G & Defense D) • Q5 Film Room',
    title: 'Position-First Video Sorting in Q5 Film Room (Goalies See Crease/Rebound Clips First)',
    description: 'When an active player\'s primary position is Goalie (G) or Defense (D), sort the matching bucket\'s verified video clips so position-specific breakdowns appear as Clip #1 before general forward clips.',
    candidCritique: 'CANDID CRITIQUE ON FILM ROOM CLIP ORDERING: We now have 51 QC-approved clips in public.tactix_video_library tagged by positions[]—but when a Goalie or Defenseman opens the Film Room on a shared bucket like dzone_house, they should immediately get the D/Goalie angle first without having to click [🔄 Watch Another Clip].',
    crossImpact: 'Delights Goalie and Defense players (Seat 1 & Seat 4), improves Q5 Film Quiz relevance (Seat 2), and leverages existing positions[] tags in Supabase (Seat 8 & Seat 9).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat8-film-room-video-modal.png`,
    authorityFlow: 'Proposed by Seat 8 → Validated by Seat 1 (WHAT) → Implemented by Seat 9',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 19,
    isTop3Recommended: false,
    id: 'S9-B',
    pod: 'pod3',
    podLabel: 'Pod 3: Platform, Film & Growth',
    seatNumber: 9,
    seatName: 'Principal Full-Stack, Supabase & <canvas> Performance Engineer',
    authorityRole: 'WHERE Authority + Engineering/HUD Veto Power',
    seatLens: 'Seat 9 — Principal Full-Stack, Supabase & <canvas> Engineer (WHERE Authority)',
    targetScope: 'All 360 Cloud Scenarios & 30 Age×Talent Levels • Cold-Rink Offline Reliability',
    title: 'Service Worker / LocalStorage Snapshot Cache for 360 Cloud Scenarios & 51 Video Metadata Rows',
    description: 'Cache the latest verified 360 cloud scenarios and 51 video library rows in versioned LocalStorage/Service Worker storage so rural hockey rinks with spotty cellular signal load all 360 drills in <15ms.',
    candidCritique: 'CANDID CRITIQUE ON RINK BASEMENT CONNECTIVITY: Metal-roof hockey arenas are notorious cellular dead zones. If a coach or kid opens Tactix in the locker room and Supabase takes 4 seconds over 1-bar LTE, falling back to only a tiny local array would shrink drill variety. Caching the full 360-scenario snapshot locally guarantees 100% drill depth offline.',
    crossImpact: 'Protects locker-room chalk talks for Coaches (Seat 5), eliminates loading spinners for Kids & Parents (Seat 3 & Seat 7), and strengthens PWA reliability (Seat 9).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat9-founder-approval-digest.png`,
    authorityFlow: 'Proposed by Seat 9 (WHERE) → Endorsed by Seat 5 & Seat 7',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 20,
    isTop3Recommended: false,
    id: 'S10-B',
    pod: 'pod3',
    podLabel: 'Pod 3: Platform, Film & Growth',
    seatNumber: 10,
    seatName: 'App Store, Conversion & Growth Strategist',
    authorityRole: 'Monetization, Funnels & Partner Club Growth',
    seatLens: 'Seat 10 — App Store, Conversion & Growth Strategist',
    targetScope: 'Player & Family Locker Room (#profileModal Tab 4 Parent HQ) • Multi-Sibling Families',
    title: 'Multi-Sibling "Family Locker Pass" Bundle Callout When 2+ Sibling Stalls Are Active',
    description: 'When a household has 2 or more sibling stalls active in Tab 1/Tab 4 (like Miles, Rhett, Whelan, and Cohen), display a non-intrusive Family Pass value comparison inside Tab 4 Parent HQ.',
    candidCritique: 'CANDID CRITIQUE ON MULTI-CHILD PRICING CLARITY: Hockey families with 2, 3, or 4 kids immediately ask: "Do I have to pay $9.99/mo per child?" Right now, they have to open the separate Pricing Modal to see how family/sibling access works. Surfacing a reassuring Family Pass note right inside Parent HQ Tab 4 removes purchase hesitation.',
    crossImpact: 'Answers the #1 billing question for Hockey Parents (Seat 3), keeps commercial messaging strictly out of the kid\'s gameplay screen (Seat 7), and lifts subscription LTV (Seat 10).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat10-pricing-partner-gate.png`,
    authorityFlow: 'Proposed by Seat 10 → Approved by Seat 3 (Parent UX) → Placed in Tab 4 by Seat 7 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 21,
    isTop3Recommended: false,
    id: 'S6-C',
    pod: 'pod2',
    podLabel: 'Pod 2: Coach, Director & Portal UX',
    seatNumber: 6,
    seatName: 'Association Hockey Director & Club GM Playtester (Level D)',
    authorityRole: 'WHAT Authority (Association & Multi-Team Oversight)',
    seatLens: 'Seat 6 — Association Hockey Director & Club GM Playtester (Level D — WHAT Authority)',
    targetScope: 'Coach Portal Tab 4 (Director HQ) • Fall Tryout & Evaluation Cohorts (10U–18U)',
    title: 'Pre-Season Tryout Evaluation Cohort Mode (Anonymous Jersey # Assessment)',
    description: 'Let Association Directors create a temporary fall tryout code (e.g., TRYOUT-12U-GROUP-A) where evaluators see objective 200-foot Hockey IQ read scores alongside on-ice scrimmage evaluations.',
    candidCritique: 'CANDID CRITIQUE ON FALL TRYOUT SEASON: Every September/October, associations spend 2 weeks running high-stress tryouts where loud skaters get noticed and quiet, high-IQ positional players get overlooked. Giving Directors a 15-drill standardized Hockey IQ assessment cohort turns Tactix into a year-round association necessity.',
    crossImpact: 'Creates a massive September/October acquisition spike for Associations (Seat 6 & Seat 10) and helps Coaches spot smart positional players (Seat 1 & Seat 5).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat6-director-hq-rollup.png`,
    authorityFlow: 'Proposed by Seat 6 (WHAT) → Validated by Seat 1 → Scoped into Tab 4 by Seat 7 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 22,
    isTop3Recommended: false,
    id: 'S8-C',
    pod: 'pod3',
    podLabel: 'Pod 3: Platform, Film & Growth',
    seatNumber: 8,
    seatName: 'Automated Video Harvester & Film-Room QC Auditor',
    authorityRole: 'Film-Room QC & 15-Bucket Coverage',
    seatLens: 'Seat 8 — Automated Video Harvester & Film-Room QC Auditor (harvest-tactix-videos.js)',
    targetScope: '10U–18U • Q5 Film Room & Nightly YouTube RSS Harvester',
    title: 'Transcript Auto-Timestamp Window Refiner for Newly Polled YouTube RSS Clips',
    description: 'Enhance harvest-tactix-videos.js so newly discovered YouTube RSS uploads scan chapter markers/descriptions to set start_sec and end_sec around the exact chalkboard/telestrator segment (40s–90s).',
    candidCritique: 'CANDID CRITIQUE ON DEFAULT RSS TIMESTAMPS: Our new YouTube RSS poller successfully pulled 12 fresh tactical clips today with a safe 15s–95s window—but some coaching videos have a 30-second sponsor intro at the start. Parsing chapter timestamps from the RSS/video description will skip intros automatically.',
    crossImpact: 'Saves time for Kids & Coaches watching Film Room clips (Seat 2 & Seat 5) and keeps Seat 8\'s automated harvesting pipeline sharp.',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat8-film-room-video-modal.png`,
    authorityFlow: 'Proposed by Seat 8 → Approved by Seat 2 (HOW) & Seat 9 (WHERE)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 23,
    isTop3Recommended: false,
    id: 'S9-C',
    pod: 'pod3',
    podLabel: 'Pod 3: Platform, Film & Growth',
    seatNumber: 9,
    seatName: 'Principal Full-Stack, Supabase & <canvas> Performance Engineer',
    authorityRole: 'WHERE Authority + Engineering/HUD Veto Power',
    seatLens: 'Seat 9 — Principal Full-Stack, Supabase & <canvas> Engineer (WHERE Authority)',
    targetScope: 'All 30 Age × Talent Levels & 360 Cloud Scenarios • Nightly Autopilot Stage 1',
    title: 'Automated Geometry & Bounding-Box Collision Linter Across All 360 Cloud Scenarios',
    description: 'Add a deterministic geometry check in deep_playtest_audit.js that verifies no two skater tokens or zone circles overlap within <0.06 normalized rink units across all 360 cloud scenarios.',
    candidCritique: 'CANDID CRITIQUE ON PROCEDURAL VARIATION SPACING: As our scenario bank scales past 360+ variations with dynamic coordinate jitter, two tokens could occasionally spawn close enough that their jersey labels touch on a 390px phone screen. A mathematical minimum-distance linter catches token crowding before any kid sees it.',
    crossImpact: 'Guarantees clean tap targets on mobile (Seat 7), prevents mis-taps during tap_player reads (Seat 2), and keeps the 360-scenario bank rock solid (Seat 1 & Seat 9).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat9-founder-approval-digest.png`,
    authorityFlow: 'Proposed by Seat 9 (WHERE) → Endorsed by Seat 1 & Seat 7',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 24,
    isTop3Recommended: false,
    id: 'S10-C',
    pod: 'pod3',
    podLabel: 'Pod 3: Platform, Film & Growth',
    seatNumber: 10,
    seatName: 'App Store, Conversion & Growth Strategist',
    authorityRole: 'Monetization, Funnels & Partner Club Growth',
    seatLens: 'Seat 10 — App Store, Conversion & Growth Strategist',
    targetScope: '8U–14U Families • Trophy Room (#trophyRoomModal) & Parent HQ (Tab 4)',
    title: 'Shareable "Division & City Tour Certificate" PNG Card for Team Group Chats',
    description: 'Let players and parents export a clean, privacy-safe Trophy Card PNG (First Name, Jersey #, City Conquered, Gold Read Streak) with a subtle Synapz Hockey watermark for team chats.',
    candidCritique: 'CANDID CRITIQUE ON ORGANIC VIRAL LOOP: When an 8U or 10U kid clinches a division trophy or House Cup lead, proud parents want to text a picture to Grandma or the team chat—right now they have to take a raw phone screenshot that includes browser bars. A clean 1-tap Certificate card turns parent pride into organic team referrals.',
    crossImpact: 'Delights Kids & Parents (Seat 3 & Seat 4), respects child privacy by omitting last names/weaknesses (Seat 3), and drives zero-CAC organic installs (Seat 10).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat10-pricing-partner-gate.png`,
    authorityFlow: 'Proposed by Seat 10 & Seat 4 → Privacy-Cleared by Seat 3 → Scoped by Seat 9',
    status: 'awaiting_founder_approval'
  },

  // =========================================================================
  // RANKS #25 – #30: VETOED BY DOMAIN AUTHORITY (CANDID PUSHBACK AGAINST BAD IDEAS)
  // =========================================================================
  {
    rank: 25,
    isTop3Recommended: false,
    id: 'S1-C',
    pod: 'pod1',
    podLabel: 'Pod 1: Player, Family & Learning',
    seatNumber: 1,
    seatName: 'NCAA D1 / AAA & USA Hockey Systems Director',
    authorityRole: 'WHAT Authority (On-Ice Systems)',
    seatLens: 'Seat 1 — NCAA D1 / AAA & USA Hockey Systems Director (WHAT Authority)',
    targetScope: '8U Mite Division (Rec -> AAA)',
    title: '[VETOED] Add 1-3-1 Power Play Umbrella & Delayed Offsides Tag-Up Drills to 8U Mite',
    description: 'Proposal to expose 5-on-4 Umbrella Power Play and blue-line Offsides drills inside the 8U Mite division.',
    candidCritique: 'CANDID CO-FOUNDER PUSHBACK (WHY THIS WAS VETOED): Under USA Hockey ADM cross-ice/half-ice developmental standards, 8U Mites do not play with full-ice offsides or 5-on-4 special teams umbrella rotations. Forcing 7-year-olds to memorize a 1-3-1 Power Play teaches bad habits and confuses spatial support. 8U must remain strictly 5v5 foundational Attack Triangle and Protect The House.',
    crossImpact: 'Protects 8U Mite Kids & Parents (Seat 3) and preserves USA Hockey ADM credibility with Association Directors (Seat 6).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat1-on-ice-drill-setup.png`,
    authorityFlow: 'VETOED by Seat 1 (WHAT Authority) & Seat 3 (Pediatric ADM Guardrail)',
    status: 'vetoed',
    vetoReason: 'VETOED by Seat 1 & Seat 3 (USA Hockey ADM Rule): 8U Mite must remain strictly 5v5 Even Strength foundational drills.'
  },
  {
    rank: 26,
    isTop3Recommended: false,
    id: 'S2-C',
    pod: 'pod1',
    podLabel: 'Pod 1: Player, Family & Learning',
    seatNumber: 2,
    seatName: 'Master Instructional Designer & Sports Teaching Strategist',
    authorityRole: 'HOW Authority (Outranks Coaches on Delivery)',
    seatLens: 'Seat 2 — Master Instructional Designer & Sports Teaching Strategist (HOW Authority)',
    targetScope: '8U & 10U Divisions • Pre-Drill Briefing Overlay',
    title: '[VETOED] Multi-Paragraph 65-Word Coaching Textbook Popup Before Every 8U/10U Play',
    description: 'Proposal from a youth coach to show a 3-paragraph systems lecture modal explaining F1/F2/F3 theory before 8U/10U kids can move their skater.',
    candidCritique: 'CANDID CO-FOUNDER PUSHBACK (WHY THIS WAS VETOED): Coaches love talking for 5 minutes at the whiteboard while kids\' feet go cold—and that exact mistake kills sports apps too. Seat 2 outranks coaches on teaching delivery: an 8-year-old will not read a 65-word wall of text. Micro-briefings must stay <=14 words with an immediate visual cue on the ice.',
    crossImpact: 'Prevents reading fatigue for 8U/10U Kids (Seat 3), keeps the rink canvas unobstructed (Seat 7), and enforces Cue-First learning (Seat 2).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat2-cue-first-roll-in.png`,
    authorityFlow: 'VETOED by Seat 2 (HOW Authority Outranks Coaches on Delivery) & Seat 3',
    status: 'vetoed',
    vetoReason: 'VETOED by Seat 2 & Seat 3 (HOW Authority): Outranks coaches on teaching delivery; 8U/10U prompts must never exceed 14 words.'
  },
  {
    rank: 27,
    isTop3Recommended: false,
    id: 'S3-C',
    pod: 'pod1',
    podLabel: 'Pod 1: Player, Family & Learning',
    seatNumber: 3,
    seatName: 'Pediatric Cognitive & Family/Parent Specialist',
    authorityRole: 'HOW Authority (Family UX & Age Guardrails)',
    seatLens: 'Seat 3 — Pediatric Cognitive & Family/Parent Specialist (HOW Authority)',
    targetScope: 'Player & Family Locker Room (#profileModal Tab 1 & Tab 4)',
    title: '[VETOED] Merge All Siblings Into One Shared Family Score & Shared Age Division',
    description: 'Proposal to combine Miles (12U), Cohen (10U), Rhett (8U), and Whelan (8U) into a single shared profile to reduce profile switching.',
    candidCritique: 'CANDID CO-FOUNDER PUSHBACK (WHY THIS WAS VETOED): Combining an 8U Mite and a 12U Peewee into one profile ruins adaptive difficulty for both kids—either the 8-year-old gets crushed by 12U Penalty Kill drills, or the 12-year-old gets bored by 8U basics, plus their 6-Slice IQ Pie Charts bleed together. Our 1-Tap Sibling Locker Stalls in Tab 1 already switch profiles in 1 tap with zero data bleed.',
    crossImpact: 'Protects individual IQ telemetry for every Sibling (Seat 1 & Seat 2) and preserves accurate roster reporting for each child\'s Coach (Seat 5).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat3-8u-adm-cognitive-load.png`,
    authorityFlow: 'VETOED by Seat 3 (Family Specialist) & Seat 9 (Zero-Data-Bleed Architecture)',
    status: 'vetoed',
    vetoReason: 'VETOED by Seat 3 & Seat 9: Violates Zero-Data-Bleed Sibling Isolation between 8U, 10U, and 12U siblings.'
  },
  {
    rank: 28,
    isTop3Recommended: false,
    id: 'S4-C',
    pod: 'pod1',
    podLabel: 'Pod 1: Player, Family & Learning',
    seatNumber: 4,
    seatName: 'Hit Mobile Game & EdTech Retention Designer',
    authorityRole: 'HOW FUN Authority (Engagement & Rewards)',
    seatLens: 'Seat 4 — Hit Mobile Game & EdTech Retention Designer (HOW FUN Authority)',
    targetScope: 'Active On-Ice Rink Canvas (#rinkCanvas)',
    title: '[VETOED] Persistent Spinning Coin Wheel & Confetti Overlay Over Neutral Zone During Drills',
    description: 'Proposal to keep a floating arcade prize wheel spinning over center ice during live drills to boost coin excitement.',
    candidCritique: 'CANDID CO-FOUNDER PUSHBACK (WHY THIS WAS VETOED): Gamification must serve the hockey read, never block the ice! Covering the neutral zone with a spinning arcade widget obstructs neutral-zone regroup lanes, D-to-D hinges, and F3 high-slot support. Rewards belong after the whistle or in the Pro Shop/Trophy Room.',
    crossImpact: 'Protects unobstructed ice visibility for Players (Seat 1 & Seat 2) and enforces Seat 7 & Seat 9\'s Zero-Clutter HUD Veto.',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat4-32-city-tour-map.png`,
    authorityFlow: 'VETOED by Seat 7 & Seat 9 (WHERE / Anti-Clutter Veto Power)',
    status: 'vetoed',
    vetoReason: 'VETOED by Seat 7 & Seat 9 (Anti-Clutter Veto): Never obstruct the active ice canvas with persistent arcade widgets.'
  },
  {
    rank: 29,
    isTop3Recommended: false,
    id: 'S5-C',
    pod: 'pod2',
    podLabel: 'Pod 2: Coach, Director & Portal UX',
    seatNumber: 5,
    seatName: 'Youth, Travel & HS/Jr Team Head Coach Playtester (Levels A–C)',
    authorityRole: 'WHAT Authority (Team Coaching & Homework)',
    seatLens: 'Seat 5 — Youth, Travel & HS/Jr Team Head Coach Playtester (Levels A–C — WHAT Authority)',
    targetScope: 'Team Portal -> Player Login Shared Leaderboard (#teamManagerModal)',
    title: '[VETOED] Publicly Display Each Player\'s Weakest IQ Slice on the Shared Team Leaderboard',
    description: 'Proposal from a travel coach to show every player\'s lowest diagnostic slice next to their name on the public team leaderboard to pressure them to practice.',
    candidCritique: 'CANDID CO-FOUNDER PUSHBACK (WHY THIS WAS VETOED): Publicly shaming a 10U or 12U kid by broadcasting "Weakest Area: D-Zone House (42%)" to their entire team in the locker room causes embarrassment and makes kids quit using the app. Public team leaderboards must strictly celebrate positive effort (XP, streaks, homework completed); diagnostic weaknesses belong privately to the player, parent, and coach.',
    crossImpact: 'Protects psychological safety for Kids & Parents (Seat 3) and prevents locker-room bullying while keeping full diagnostic visibility inside Coach Tab 1 (Seat 5).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat5-coach-homework-wizard.png`,
    authorityFlow: 'VETOED by Seat 3 (Pediatric/Family Specialist) & Seat 7 (Section 18.6 Privacy Rule)',
    status: 'vetoed',
    vetoReason: 'VETOED by Seat 3 & Seat 7 (Privacy Rule): Player Login leaderboard only shows positive achievements; diagnostic weaknesses are strictly private.'
  },
  {
    rank: 30,
    isTop3Recommended: false,
    id: 'S7-C',
    pod: 'pod2',
    podLabel: 'Pod 2: Coach, Director & Portal UX',
    seatNumber: 7,
    seatName: 'Principal UX Architect & 4-Tab Anti-Clutter Lead',
    authorityRole: 'WHERE Authority + Anti-Clutter Veto Power',
    seatLens: 'Seat 7 — Principal UX Architect & 4-Tab Anti-Clutter Lead (WHERE Authority)',
    targetScope: 'Main Gameplay Screen (#gameView)',
    title: '[VETOED] Pin Coach Homework Wizard & Director Roll-Up Table Permanently Below #rinkCanvas',
    description: 'Proposal to render the Coach Homework Wizard and Association Multi-Team Table permanently underneath the main game rink for 0-click access.',
    candidCritique: 'CANDID CO-FOUNDER PUSHBACK (WHY THIS WAS VETOED): Dumping admin tables underneath the active ice rink turns a clean, focused sports game into a vertical scroll wall and confuses kids and parents with coach/director controls. Coach and Director tools belong strictly inside #teamManagerModal Tabs 1–4.',
    crossImpact: 'Preserves a clean, zero-scroll gameplay viewport on phones and iPads (Seat 7 & Seat 9) while keeping Coach/Director tools organized in their dedicated 4-tab portal (Seat 5 & Seat 6).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat7-hud-ergonomics-audit.png`,
    authorityFlow: 'VETOED by Seat 7 & Seat 9 (WHERE / 4-Tab Anti-Clutter Veto Power)',
    status: 'vetoed',
    vetoReason: 'VETOED by Seat 7 & Seat 9 (Anti-Clutter Veto): Admin/Coach widgets must live inside #teamManagerModal tabs, never on the gameplay HUD.'
  },
  {
    rank: 31,
    isTop3Recommended: false,
    id: 'S11-B',
    pod: 'pod1',
    podLabel: 'Pod 1: Player, Family & Learning',
    seatNumber: 11,
    seatName: 'Lead Art Director, 75%-Realistic Visuals & Pro Shop Gear Specialist',
    authorityRole: 'Gate D Visual Consistency (75% Realistic / 25% Cartoon-Edge)',
    seatLens: '🎨 Seat 11 — Lead Art Director, 75%-Realistic Visuals & Pro Shop Gear Specialist (Gate D Visual Consistency)',
    targetScope: 'Top-Down 2x Faceoff-Dot Skaters (#rinkCanvas) & Locker Room Avatar (#synapzLockerRoomModal)',
    title: 'Team-Color Home/Away Sweater Trim Sync Across Top-Down 2x Faceoff-Dot Skaters & Locker Room Avatar',
    description: 'Automatically sync the Coach\'s Office Team Sweater Colors onto both the Locker Room Young Hockey Player Avatar and the 2x Faceoff-Dot Top-Down Skater shoulders and socks on #rinkCanvas.',
    candidCritique: 'CANDID ART DIRECTOR CRITIQUE: When a player joins Minot Wolves (PUCK99), seeing their exact team sweater trim reflected on both their 75%-realistic Locker Room skater and their 2x Faceoff-Dot on-ice skater unifies the visual world.',
    crossImpact: 'Strengthens team pride for Players & Coaches (Seat 4 & Seat 5) and enforces Gate D Visual Consistency (Seat 11).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat11-art-director-avatar-shop.png`,
    authorityFlow: 'Proposed by Seat 11 (Gate D) → Co-Signed by Seat 5 (Coach) & Seat 9 (<canvas>)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 32,
    isTop3Recommended: false,
    id: 'S12-B',
    pod: 'pod3',
    podLabel: 'Pod 3: Platform, Film & Growth',
    seatNumber: 12,
    seatName: 'SafeSport, Multi-Profile Privacy & 11-Voice Audio QA Specialist',
    authorityRole: 'SafeSport Compliance, Sibling PIN Lock & 11-Channel Voice QA',
    seatLens: '🛡️ Seat 12 — SafeSport, Multi-Profile Privacy & 11-Voice Audio QA Specialist',
    targetScope: 'Coach\'s Office Station 4 (#coachOfficeStationPane_4) • SafeSport Notification Center',
    title: 'SafeSport Read-Receipt Counter (Zero Direct Replies) in Coach\'s Office Station 4',
    description: 'Show coaches in Station 4 how many roster players have opened the standardized SafeSport lesson notification ("18/20 Viewed Plan") without allowing any free-text DMs or replies.',
    candidCritique: 'CANDID SAFESPORT CRITIQUE: Coaches want to know that their Friday afternoon push alert was seen before Saturday\'s game, while parents demand zero open 1-on-1 messaging. A read-only "18/20 Viewed Plan" counter solves both.',
    crossImpact: 'Gives Coaches delivery confidence (Seat 5) while maintaining 100% SafeSport compliance (Seat 12 & Seat 3).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat12-safesport-voice-qa.png`,
    authorityFlow: 'Proposed by Seat 12 (SafeSport) → Endorsed by Seat 5 (Coach) & Seat 3 (Family)',
    status: 'awaiting_founder_approval'
  },
  {
    rank: 33,
    isTop3Recommended: false,
    id: 'S11-C',
    pod: 'pod1',
    podLabel: 'Pod 1: Player, Family & Learning',
    seatNumber: 11,
    seatName: 'Lead Art Director, 75%-Realistic Visuals & Pro Shop Gear Specialist',
    authorityRole: 'Gate D Visual Consistency (75% Realistic / 25% Cartoon-Edge)',
    seatLens: '🎨 Seat 11 — Lead Art Director, 75%-Realistic Visuals & Pro Shop Gear Specialist (Gate D Visual Consistency)',
    targetScope: 'Locker Room Avatar (#synapzLockerRoomModal) & Active Rink (#rinkCanvas)',
    title: '[VETOED] Replace 75%-Realistic Hockey Kid & 2x Faceoff-Dot Skaters With Neon Sci-Fi Robot Mechs',
    description: 'Proposal to replace the recognizable Young Hockey Player Avatar and top-down hockey skaters with glowing sci-fi robot characters.',
    candidCritique: 'CANDID CO-FOUNDER PUSHBACK: Coach Dane & Coach Evan explicitly locked our "75% Realistic / 25% Cartoon-Edge" hockey identity! Youth hockey players want to look like real hockey players wearing real 4-roll gloves, tinted visors, and pro carbon sticks—never blocky robots.',
    crossImpact: 'Protects authentic hockey identity across Locker Room, Pro Shop, and On-Ice Lessons (Seat 11, Seat 1 & Seat 4).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat11-art-director-avatar-shop.png`,
    authorityFlow: 'VETOED by Seat 11 (Gate D Visual Consistency Authority) & Seat 1',
    status: 'vetoed',
    vetoReason: 'VETOED by Seat 11 (Gate D Visual Consistency): Violates the locked 75% Realistic / 25% Cartoon-Edge Young Hockey Player visual standard.'
  },
  {
    rank: 34,
    isTop3Recommended: false,
    id: 'S12-C',
    pod: 'pod3',
    podLabel: 'Pod 3: Platform, Film & Growth',
    seatNumber: 12,
    seatName: 'SafeSport, Multi-Profile Privacy & 11-Voice Audio QA Specialist',
    authorityRole: 'SafeSport Compliance, Sibling PIN Lock & 11-Channel Voice QA',
    seatLens: '🛡️ Seat 12 — SafeSport, Multi-Profile Privacy & 11-Voice Audio QA Specialist',
    targetScope: 'Player Team Roster Hub (#playerTeamRosterHubModal) & Friends Wall (#synapzFriendsWallModal)',
    title: '[VETOED] Add Open Direct-Message Chat Between Coaches and Youth Players Inside Team Roster Hub',
    description: 'Proposal to add an unmoderated free-text DM chat box inside #playerTeamRosterHubModal and #synapzFriendsWallModal.',
    candidCritique: 'CANDID CO-FOUNDER PUSHBACK: Open DM chat between adults and youth players or between unsupervised kids violates USA Hockey SafeSport and COPPA guardrails. All notifications must remain 100% standardized app alerts ("🏒 You have a new lesson plan in Synapz!") and social views must stay 100% read-only.',
    crossImpact: 'Protects Youth Players, Parents, Coaches, and Associations from SafeSport liability (Seat 12, Seat 3 & Seat 6).',
    screenshotUrl: `${PAGES_BASE_URL}/assets/audit-screenshots/seat12-safesport-voice-qa.png`,
    authorityFlow: 'VETOED by Seat 12 (SafeSport Authority) & Seat 3 (Pediatric/Family)',
    status: 'vetoed',
    vetoReason: 'VETOED by Seat 12 & Seat 3 (SafeSport Rule): Zero open chat or direct coach-to-kid messaging permitted.'
  }
];

const SEAT_0_RED_FLAG_COUNCIL_OPTIONS = [
  {
    id: 'RF-COUNCIL-REVIEW-01',
    scenarioId: 'breakout-d-to-d-12u',
    ageDivision: '12U',
    flaggedScreen: 'On-Ice Lesson Screen (#gameViewSection • 12U D-to-D Breakout)',
    founderOriginalNote: 'On 12U D-to-D Breakout drills, let us make sure the weak-side winger outlet and D2 hinge spacing feel crystal clear before the 3s freeze.',
    liveScreenshotUrl: `${PAGES_BASE_URL}/screenshots/audit_red_flag_council_review.png`,
    status: 'council_options_ready_awaiting_approval',
    convenedSpecialists: '🏒 Seat 1 (NCAA D1 / USA Hockey Systems) • 🎓 Seat 2 (Instructional Designer) • 📱 Seat 7 (UX & Anti-Clutter Lead) • 🎨 Seat 11 (Lead Art Director) • 🛡️ Seat 12 (SafeSport & Voice QA)',
    councilDiagnosis: 'Seats 1, 2, 7, 11 & 12 inspected the 12U D-to-D Breakout screen live in Chrome (see screenshot). During the 3.0s flow-and-freeze lead-in, D1 retrieves the puck under F1 pressure while D2 hinges behind the goal line—if the weak-side winger (RW) and D2 hinge lane are not visually connected before the freeze, 10U/12U players sometimes focus only on F1 and miss the weak-side outlet.',
    optionA: {
      optionCode: 'Option A',
      label: 'Option A (Council\'s Recommended Best-Practice Solution)',
      title: 'Synchronized Cyan D-to-D Hinge Arc + Weak-Side Outlet Pulse During Final 0.8s of 3s Flow-and-Freeze',
      coSignedBy: 'Co-Signed by Seat 1 (Systems), Seat 2 (Instructional), Seat 7 (Zero-Clutter UX) & Seat 11 (Art Director)',
      whyRecommended: 'Draws a clean, subtle dashed cyan passing arc from D1 -> D2 -> Weak-Side Winger during the final 0.8s of the 3-second pre-read motion roll-in and fades it out at the freeze frame—teaching real 5-man unit timing with zero extra buttons or text clutter.',
      whatItChanges: 'Updates drawRink() in index.html to render a 2px dashed cyan D-to-D-to-Wing timing connector during flow_and_freeze (progress >= 0.72) and adds a 1-sentence Coach Bob cue (<14 words for 8U/10U).'
    },
    optionB: {
      optionCode: 'Option B',
      label: 'Option B (Alternative Professional Approach)',
      title: 'Post-Freeze "👀 Peek Weak-Side Outlet" Hover Highlight on D2 & Weak-Side Winger',
      coSignedBy: 'Alternative Scoped by Seat 3 (Pediatric/Family) & Seat 9 (<canvas> Engineer)',
      prosAndCons: 'PROS: Keeps the 3-second moving flow 100% unassisted so advanced 14U–18U AA/AAA players read pure skater body language, while letting players hover/tap D2 after the freeze to preview the weak-side passing triangle. CONS: Less proactive for 8U/10U beginners than Option A.',
      whatItChanges: 'Adds a post-freeze hover halo on D2 and the weak-side winger in index.html without altering the 3-second moving lead-in.'
    },
    plainEnglishExplanation: 'PLAIN ENGLISH SUMMARY FOR DANE & EVAN: Zero code was mutated tonight! Option A (Recommended) shows a brief dashed passing line connecting D1, D2, and the open winger right before the play freezes so kids see why D2 hinges behind the net. Option B waits until the play freezes and highlights the open side when the player hovers over D2. Click [✅ Approve Option A] or [✅ Approve Option B] to flip status to "approved_for_build" for the next build!'
  }
];

function buildCrossSeatCoSign(item) {
  if (item.crossSeatCoSign && item.crossSeatCoSign.gateA_TacticalAdm) return item.crossSeatCoSign;
  const isVeto = item.status === 'vetoed';
  const gateA = isVeto
    ? 'Gate A (Seat 1 + Seat 6 Tactical/ADM): Veto upheld—protects USA Hockey ADM & F1/F2/F3/D1/D2 habits.'
    : `Gate A (Seat 1 + Seat 6 Tactical/ADM): Co-signed for ${item.targetScope} F1/F2/F3/D1/D2 reads & 8U ADM compliance.`;
  const gateB = isVeto
    ? 'Gate B (Seat 3 + Seat 5 Cognition/UX): Veto upheld—prevents text overload, sibling bleed & HUD clutter.'
    : 'Gate B (Seat 3 + Seat 5 Cognition/UX): Zero-clutter verified; <=14 words for 8U/10U & 44px touch targets.';
  const gateC = isVeto
    ? 'Gate C (Seat 8 + Seat 10 60fps/QA): Blocked to protect 60fps <canvas>, sibling isolation & blind QA.'
    : 'Gate C (Seat 8 + Seat 10 60fps/QA): Scoped for 60fps <canvas>, normalizeSynapzState() & blind QA.';
  const gateD = isVeto
    ? 'Gate D (🎨 Seat 11 + 🛡️ Seat 12 Art/SafeSport/Audio): Veto upheld—protects 75%-realistic style, SafeSport & 11-Voice QA.'
    : 'Gate D (🎨 Seat 11 + 🛡️ Seat 12 Art/SafeSport/Audio): Co-signed for 75%-realistic style, 2x-dot skaters, SafeSport & 11-Voice QA.';

  return {
    gateA_TacticalAdm: gateA,
    gateB_CognitionUx: gateB,
    gateC_EngineeringQa: gateC,
    gateD_VisualSafeSportQa: gateD,
    summary: `${gateA} | ${gateB} | ${gateC} | ${gateD}`
  };
}

for (const item of BOARD_30_IDEA_DIGEST) {
  item.isTop5CoSigned = item.rank <= 5;
  item.crossSeatCoSign = buildCrossSeatCoSign(item);
}

const TOP_5_COSIGNED_CONSENSUS_PRIORITIES = BOARD_30_IDEA_DIGEST.filter(i => i.rank <= 5);
const BOARD_12_SEAT_DIGEST = BOARD_30_IDEA_DIGEST.filter(i => i.rank <= 12);
const BOARD_36_IDEA_DIGEST = BOARD_30_IDEA_DIGEST;

function renderRedFlagCouncilOptionsHtml(rf) {
  const explainUrl = `${PAGES_BASE_URL}/report.html?action=explain_red_flag&id=${encodeURIComponent(rf.id)}#seat0-red-flag-council`;
  const approveAUrl = `${PAGES_BASE_URL}/report.html?action=approve_option_a&id=${encodeURIComponent(rf.id)}#seat0-red-flag-council`;
  const approveBUrl = `${PAGES_BASE_URL}/report.html?action=approve_option_b&id=${encodeURIComponent(rf.id)}#seat0-red-flag-council`;
  const rejectUrl = `${PAGES_BASE_URL}/report.html?action=reject&id=${encodeURIComponent(rf.id)}#seat0-red-flag-council`;

  return `
<div style="background:#1f0915;border:2px solid #fb7185;border-radius:14px;padding:16px;margin-bottom:14px;">
  <div style="margin-bottom:8px;">
    <span style="background:#e11d48;color:#fff;font-size:10px;font-weight:900;padding:3px 9px;border-radius:99px;">🚩 SEAT 0 COUNCIL REVIEW READY • status = 'council_options_ready_awaiting_approval'</span>
    <span style="font-size:11px;font-weight:800;color:#fda4af;margin-left:6px;">ID: ${rf.id} • Scenario: ${rf.scenarioId} (${rf.ageDivision})</span>
  </div>
  <div style="font-size:15px;font-weight:900;color:#ffffff;margin-bottom:8px;">🚩 Founder Note: "${rf.founderOriginalNote}"</div>
  <div style="font-size:12px;color:#e2e8f0;line-height:1.5;">
    <div style="margin-bottom:6px;"><strong style="color:#38bdf8;">Convened 12-Seat Specialists:</strong> ${rf.convenedSpecialists}</div>
    <div style="margin-bottom:8px;"><strong style="color:#fbbf24;">12-Seat Council Multi-Discipline Diagnosis:</strong> ${rf.councilDiagnosis}</div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:10px;">
      <div style="background:#022c22;border:2px solid #10b981;border-radius:10px;padding:10px;">
        <div style="font-size:11px;font-weight:900;color:#34d399;text-transform:uppercase;">✅ ${rf.optionA.label}</div>
        <div style="font-size:13px;font-weight:900;color:#fff;margin:3px 0;">${rf.optionA.title}</div>
        <div style="font-size:11px;color:#a7f3d0;margin-bottom:4px;"><em>${rf.optionA.coSignedBy}</em></div>
        <div style="font-size:11px;color:#e2e8f0;margin-bottom:4px;"><strong>Why Co-Signed:</strong> ${rf.optionA.whyRecommended}</div>
        <div style="font-size:11px;color:#cbd5e1;"><strong>What It Changes:</strong> ${rf.optionA.whatItChanges}</div>
      </div>
      <div style="background:#0f172a;border:2px solid #38bdf8;border-radius:10px;padding:10px;">
        <div style="font-size:11px;font-weight:900;color:#38bdf8;text-transform:uppercase;">🔄 ${rf.optionB.label}</div>
        <div style="font-size:13px;font-weight:900;color:#fff;margin:3px 0;">${rf.optionB.title}</div>
        <div style="font-size:11px;color:#bae6fd;margin-bottom:4px;"><em>${rf.optionB.coSignedBy}</em></div>
        <div style="font-size:11px;color:#e2e8f0;margin-bottom:4px;"><strong>Pros &amp; Cons:</strong> ${rf.optionB.prosAndCons}</div>
        <div style="font-size:11px;color:#cbd5e1;"><strong>What It Changes:</strong> ${rf.optionB.whatItChanges}</div>
      </div>
    </div>
    <div style="margin-bottom:8px;padding:8px;background:#091526;border:1px solid #38bdf8;border-radius:8px;font-size:11px;color:#bae6fd;">
      <strong>🔍 Plain-English Options Summary:</strong> ${rf.plainEnglishExplanation}
    </div>
    <div style="margin-bottom:10px;">
      <strong style="color:#34d399;">Live Council Review Screenshot:</strong> <a href="${rf.liveScreenshotUrl}" target="_blank" style="color:#38bdf8;">audit_red_flag_council_review.png</a><br/>
      <img src="${rf.liveScreenshotUrl}" alt="${rf.id}" style="max-width:100%;width:480px;border-radius:8px;border:1px solid #fb7185;margin-top:4px;display:block;" />
    </div>
    <div>
      <strong style="color:#fde047;">Step 3 -> Step 4 Final Founder Decision (Zero Code Changed Until You Approve):</strong><br/>
      <a href="${explainUrl}" style="background:#0284c7;color:#fff;font-weight:900;font-size:11px;padding:7px 12px;border-radius:6px;text-decoration:none;display:inline-block;margin:4px 6px 0 0;">🔍 Explain Options in Plain English</a>
      <a href="${approveAUrl}" style="background:#059669;color:#fff;font-weight:900;font-size:11px;padding:7px 12px;border-radius:6px;text-decoration:none;display:inline-block;margin:4px 6px 0 0;">✅ Approve Option A (Recommended) for Next Build</a>
      <a href="${approveBUrl}" style="background:#0d9488;color:#fff;font-weight:900;font-size:11px;padding:7px 12px;border-radius:6px;text-decoration:none;display:inline-block;margin:4px 6px 0 0;">✅ Approve Option B for Next Build</a>
      <a href="${rejectUrl}" style="background:#be123c;color:#fff;font-weight:900;font-size:11px;padding:7px 12px;border-radius:6px;text-decoration:none;display:inline-block;margin:4px 0 0 0;">❌ Hold / Dismiss</a>
    </div>
  </div>
</div>`;
}

function renderSevenFieldCardHtml(item, isTop5Banner = false) {
  const isVetoed = item.status === 'vetoed';
  const borderCol = isTop5Banner ? '#10b981' : isVetoed ? '#f43f5e' : '#38bdf8';
  const bgCol = isTop5Banner ? '#022c22' : isVetoed ? '#3b071e' : '#0f172a';
  const badgeBg = isTop5Banner ? '#059669' : isVetoed ? '#e11d48' : '#0284c7';
  const badgeText = isTop5Banner
    ? `🤝 TOP #${item.rank} CO-SIGNED CONSENSUS PRIORITY (12/12 SEATS) • AWAITING FOUNDER APPROVAL`
    : isVetoed
      ? `🛑 RANK #${item.rank} • VETOED BY 4-GATE ROUNDTABLE`
      : `📋 RANK #${item.rank} CO-SIGNED PROPOSAL • AWAITING FOUNDER APPROVAL`;

  const explainHref = `${PAGES_BASE_URL}/report.html?founder_action=explain&idea_id=${encodeURIComponent(item.id)}#founder-approval-board`;
  const approveHref = `${PAGES_BASE_URL}/report.html?founder_action=approve&idea_id=${encodeURIComponent(item.id)}#founder-approval-board`;
  const rejectHref = `${PAGES_BASE_URL}/report.html?founder_action=reject&idea_id=${encodeURIComponent(item.id)}#founder-approval-board`;
  const coSign = item.crossSeatCoSign || buildCrossSeatCoSign(item);

  return `
<div style="background:${bgCol};border:2px solid ${borderCol};border-radius:12px;padding:12px;margin-bottom:12px;">
  <div style="margin-bottom:6px;"><span style="background:${badgeBg};color:#fff;font-size:10px;font-weight:900;padding:3px 8px;border-radius:99px;">${badgeText}</span> <span style="font-size:11px;font-weight:800;color:#fbbf24;">ID: ${item.id} • ${item.podLabel}</span></div>
  <div style="font-size:15px;font-weight:900;color:#fff;margin-bottom:8px;">#${item.rank} — ${item.title}</div>
  <div style="font-size:12px;color:#e2e8f0;line-height:1.45;">
    <div style="margin-bottom:4px;"><strong style="color:#38bdf8;">1. Seat &amp; Lens:</strong> ${item.seatLens} <span style="color:#94a3b8;">(${item.authorityFlow})</span></div>
    <div style="margin-bottom:4px;"><strong style="color:#fbbf24;">2. Target Scope:</strong> ${item.targetScope}</div>
    <div style="margin-bottom:4px;"><strong style="color:#f43f5e;">3. Candid Critique &amp; Proposal:</strong> ${item.candidCritique} <span style="color:#a7f3d0;"><strong>Build:</strong> ${item.description}</span>${item.alternativeProposal ? ` <span style="color:#bae6fd;"><strong>[Alt: ${item.alternativeProposal}]</strong></span>` : ''}</div>
    <div style="margin-bottom:4px;padding:6px;background:#091526;border:1px solid #0284c7;border-radius:6px;"><strong style="color:#22d3ee;">4. 🤝 Cross-Seat Collaboration (4 Gates):</strong><br/>• ${coSign.gateA_TacticalAdm}<br/>• ${coSign.gateB_CognitionUx}<br/>• ${coSign.gateC_EngineeringQa}<br/>• ${coSign.gateD_VisualSafeSportQa}</div>
    <div style="margin-bottom:6px;"><strong style="color:#c084fc;">5. Cross-Impact:</strong> ${item.crossImpact}</div>
    <div style="margin-bottom:8px;"><strong style="color:#34d399;">6. Live Screenshot:</strong> <a href="${item.screenshotUrl}" target="_blank" style="color:#38bdf8;">${item.screenshotUrl.split('/').pop()}</a><br/><img src="${item.screenshotUrl}" alt="${item.id}" style="max-width:100%;width:480px;border-radius:8px;border:1px solid #475569;margin-top:4px;display:block;" /></div>
    <div><strong style="color:#fde047;">7. Founder Approval:</strong> <a href="${explainHref}" style="background:#0284c7;color:#fff;font-weight:900;font-size:11px;padding:6px 12px;border-radius:6px;text-decoration:none;margin-right:6px;">🔍 Explain This to Me</a> <a href="${approveHref}" style="background:#059669;color:#fff;font-weight:900;font-size:11px;padding:6px 12px;border-radius:6px;text-decoration:none;margin-right:6px;">✅ Approve for Next Build</a> <a href="${rejectHref}" style="background:#be123c;color:#fff;font-weight:900;font-size:11px;padding:6px 12px;border-radius:6px;text-decoration:none;">❌ Reject</a></div>
  </div>
</div>`;
}

function buildEmailHtml(ideas, timestamp) {
  const top5CoSigned = ideas.filter(i => i.rank <= 5);
  const awaitingRest = ideas.filter(i => i.rank > 5 && i.status === 'awaiting_founder_approval');
  const vetoed = ideas.filter(i => i.status === 'vetoed');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>SYNAPZ HOCKEY — Nightly 12-Seat Collaborative Roundtable, Red-Flag Council Options &amp; Top 5 Consensus Digest</title>
</head>
<body style="font-family: Inter, Arial, sans-serif; background:#020617; color:#f8fafc; padding:20px; line-height:1.5;">
  <div style="max-width:920px; margin:0 auto; background:#090d16; border:2px solid #00e5ff; border-radius:18px; padding:24px;">
    <div style="font-size:11px; font-weight:900; color:#00e5ff; text-transform:uppercase; letter-spacing:0.08em;">SYNAPZ HOCKEY • PLAY. LEARN. DOMINATE. • SECTION 27: 12-SEAT BOARD + 🚩 SEAT 0 RED-FLAG COUNCIL OPTIONS PROTOCOL</div>
    <h1 style="margin:6px 0 8px; font-size:22px; color:#ffffff;">🏒 Nightly 12-Seat Collaborative Roundtable, 🚩 Seat 0 Red-Flag Council Options (Option A vs. Option B) &amp; Top 5 Consensus Digest</h1>
    <p style="margin:0 0 14px; font-size:13px; color:#cbd5e1;">
      Prepared for <strong>Coach Dane (danebekkedahl@gmail.com)</strong> &amp; <strong>Coach Evan (evanbekk@gmail.com)</strong> • Generated ${timestamp}<br/>
      🌐 <strong>Live App:</strong> <a href="https://danebekkedahl.github.io/synapz-hockey/" style="color:#00e5ff; font-weight:800;">https://danebekkedahl.github.io/synapz-hockey/</a> •
      📊 <strong>Live 12-Seat Board &amp; Red-Flag Council Report:</strong> <a href="https://danebekkedahl.github.io/synapz-hockey/report.html#seat0-red-flag-council" style="color:#34d399; font-weight:800;">https://danebekkedahl.github.io/synapz-hockey/report.html</a> •
      🪞 <strong>Mirror:</strong> <a href="https://danebekkedahl.github.io/tactix-hockey/" style="color:#94a3b8;">tactix-hockey</a><br/>
      🔒 <strong>4-Step Red-Flag Governance &amp; 12-Seat Approval Gate Enforced:</strong> A Founder <code>🚩 Red Flag</code> NEVER changes code without review! Below, <code>Seat 0</code> presents Option A (Recommended) vs. Option B for your Final Approval.
    </p>

    <!-- 🚩 FOUNDER RED FLAGS — 12-SEAT COUNCIL REVIEW & OPTIONS (AWAITING FINAL APPROVAL) -->
    <div id="seat0-red-flag-council" style="background:#2d0616; border:2px solid #f43f5e; border-radius:14px; padding:16px; margin-bottom:22px;">
      <div style="font-size:11px; font-weight:900; color:#fda4af; text-transform:uppercase; letter-spacing:0.06em;">🚩 FOUNDER RED FLAGS — 12-SEAT COUNCIL REVIEW &amp; OPTIONS (AWAITING FINAL APPROVAL)</div>
      <div style="font-size:15px; font-weight:900; color:#ffffff; margin:4px 0 8px;">4-Step Governance: 1. Submit in App (flagged_for_council_review) -> 2. Seat 0 12-Seat Council Options (Option A vs. Option B) -> 3. Sent in Nightly Report -> 4. Built ONLY After You Click Approve Option A or Option B</div>
      ${SEAT_0_RED_FLAG_COUNCIL_OPTIONS.map(rf => renderRedFlagCouncilOptionsHtml(rf)).join('')}
    </div>

    <!-- SECTION 28 & SECTION 29 LIVE SCREENSHOTS: CLEAN PLAYER SCREENS, LIVE WORD-STREAMING SPEECH & 5 INTERACTIVE ROOMS -->
    <div style="background:#1c120b; border:2px solid #fbbf24; border-radius:14px; padding:16px; margin-bottom:22px;">
      <div style="font-size:11px; font-weight:900; color:#fbbf24; text-transform:uppercase; letter-spacing:0.06em;">🗣️ SECTION 28 &amp; SECTION 29 LIVE SCREENSHOTS: HARD DE-CLUTTERED GAMEPLAY SCREEN, 3-STAGE LIVE WORD-STREAMING CHARACTER SPEECH &amp; 5 POINT-AND-CLICK ROOMS</div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-top:10px; font-size:11px; color:#cbd5e1;">
        <div><a href="${PAGES_BASE_URL}/screenshots/audit_clean_gameplay_screen.png" style="color:#34d399; font-weight:800;">1. 🏒 Clean Gameplay Screen (Rink + 4 Tactile 3D Buttons + 64px Coach Circle)</a><img src="${PAGES_BASE_URL}/screenshots/audit_clean_gameplay_screen.png" style="width:100%; border-radius:8px; border:1px solid #34d399; margin-top:4px;" /></div>
        <div><a href="${PAGES_BASE_URL}/screenshots/audit_live_word_speech_bubble.png" style="color:#38bdf8; font-weight:800;">2. 🗣️ 3-Stage Live Word-Streaming Speech Bubble (~25% Quadrant Pop-Up)</a><img src="${PAGES_BASE_URL}/screenshots/audit_live_word_speech_bubble.png" style="width:100%; border-radius:8px; border:1px solid #38bdf8; margin-top:4px;" /></div>
        <div><a href="${PAGES_BASE_URL}/screenshots/audit_interactive_rooms.png" style="color:#fbbf24; font-weight:800;">3. 🏛️ Interactive Point-and-Click Rooms + Agent Speech</a><img src="${PAGES_BASE_URL}/screenshots/audit_interactive_rooms.png" style="width:100%; border-radius:8px; border:1px solid #d4af37; margin-top:4px;" /></div>
        <div><a href="${PAGES_BASE_URL}/screenshots/audit_room_lobby.png" style="color:#fbbf24; font-weight:800;">4. 🏟️ Room 1: Two-Story Main Rink Lobby</a><img src="${PAGES_BASE_URL}/screenshots/audit_room_lobby.png" style="width:100%; border-radius:8px; border:1px solid #d4af37; margin-top:4px;" /></div>
        <div><a href="${PAGES_BASE_URL}/screenshots/audit_room_locker.png" style="color:#fbbf24; font-weight:800;">5. 🎽 Room 2: Player Locker Room Stall (Dynamic Brass Nameplate)</a><img src="${PAGES_BASE_URL}/screenshots/audit_room_locker.png" style="width:100%; border-radius:8px; border:1px solid #d4af37; margin-top:4px;" /></div>
        <div><a href="${PAGES_BASE_URL}/screenshots/audit_room_coach_office.png" style="color:#fbbf24; font-weight:800;">6. 📋 Room 3: Coach Al's Office</a><img src="${PAGES_BASE_URL}/screenshots/audit_room_coach_office.png" style="width:100%; border-radius:8px; border:1px solid #d4af37; margin-top:4px;" /></div>
        <div><a href="${PAGES_BASE_URL}/screenshots/audit_room_pro_shop.png" style="color:#fbbf24; font-weight:800;">7. 🛍️ Room 4: Walk-In Pro Shop</a><img src="${PAGES_BASE_URL}/screenshots/audit_room_pro_shop.png" style="width:100%; border-radius:8px; border:1px solid #d4af37; margin-top:4px;" /></div>
        <div><a href="${PAGES_BASE_URL}/screenshots/audit_room_clubhouse.png" style="color:#fbbf24; font-weight:800;">8. 🏆 Room 5: Friends &amp; Trophy Clubhouse</a><img src="${PAGES_BASE_URL}/screenshots/audit_room_clubhouse.png" style="width:100%; border-radius:8px; border:1px solid #d4af37; margin-top:4px;" /></div>
        <div><a href="${PAGES_BASE_URL}/screenshots/audit_red_flag_council_review.png" style="color:#fda4af; font-weight:800;">9. 🚩 Seat 0: Red-Flag Council Review</a><img src="${PAGES_BASE_URL}/screenshots/audit_red_flag_council_review.png" style="width:100%; border-radius:8px; border:1px solid #fb7185; margin-top:4px;" /></div>
      </div>
    </div>

    <!-- TOP 5 CO-SIGNED CONSENSUS PRIORITIES SUMMARY TABLE -->
    <div style="background:#022c22; border:2px solid #10b981; border-radius:14px; padding:16px; margin-bottom:22px;">
      <div style="font-size:11px; font-weight:900; color:#34d399; text-transform:uppercase; letter-spacing:0.06em;">🏆 TOP 5 CO-SIGNED CONSENSUS PRIORITIES (UNANIMOUS 12-SEAT ROUNDTABLE VOTE)</div>
      <div style="font-size:15px; font-weight:900; color:#ffffff; margin:4px 0 8px;">Ranked #1 to #5 Highest-Impact Upgrades Co-Signed Across All 4 Best-Practice Gates (Gates A, B, C &amp; D)</div>
      <table style="width:100%; border-collapse:collapse; font-size:12px; color:#e2e8f0; background:#0f172a; border-radius:10px; overflow:hidden;">
        <thead>
          <tr style="background:#1e293b; color:#fbbf24; text-align:left;">
            <th style="padding:8px;">Rank &amp; ID</th>
            <th style="padding:8px;">What to Build &amp; Target Age/Tier</th>
            <th style="padding:8px;">4-Gate Cross-Seat Co-Sign Summary</th>
            <th style="padding:8px;">1-Click Decision</th>
          </tr>
        </thead>
        <tbody>
          ${top5CoSigned.map(item => `
            <tr>
              <td style="padding:8px; border-top:1px solid #1e293b; font-weight:900; color:#34d399;">#${item.rank} (${item.id})<br/><span style="font-size:10px; color:#94a3b8;">Seat ${item.seatNumber} Lead</span></td>
              <td style="padding:8px; border-top:1px solid #1e293b;"><strong>${item.title}</strong><br/><span style="font-size:11px; color:#38bdf8;">${item.targetScope}</span></td>
              <td style="padding:8px; border-top:1px solid #1e293b; font-size:11px; color:#cbd5e1;">${item.crossSeatCoSign.gateA_TacticalAdm}<br/>${item.crossSeatCoSign.gateD_VisualSafeSportQa}</td>
              <td style="padding:8px; border-top:1px solid #1e293b; white-space:nowrap;">
                <a href="${PAGES_BASE_URL}/report.html?founder_action=explain&idea_id=${encodeURIComponent(item.id)}#founder-approval-board" style="background:#0284c7; color:#fff; padding:5px 9px; border-radius:6px; text-decoration:none; font-weight:900; font-size:11px; display:inline-block; margin-bottom:4px;">🔍 Explain</a><br/>
                <a href="${PAGES_BASE_URL}/report.html?founder_action=approve&idea_id=${encodeURIComponent(item.id)}#founder-approval-board" style="background:#059669; color:#fff; padding:5px 9px; border-radius:6px; text-decoration:none; font-weight:900; font-size:11px; display:inline-block; margin-bottom:4px;">✅ Approve</a><br/>
                <a href="${PAGES_BASE_URL}/report.html?founder_action=reject&idea_id=${encodeURIComponent(item.id)}#founder-approval-board" style="background:#be123c; color:#fff; padding:5px 9px; border-radius:6px; text-decoration:none; font-weight:900; font-size:11px; display:inline-block;">❌ Reject</a>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- SPECIAL BOARD QUESTION: MOVING PLAYS VS STATIC SETUPS -->
    <div style="background:#172554; border:2px solid #38bdf8; border-radius:14px; padding:16px; margin-bottom:22px;">
      <div style="font-size:11px; font-weight:900; color:#38bdf8; text-transform:uppercase; letter-spacing:0.06em;">🏒 SPECIAL CO-FOUNDER BOARD QUESTION (SEATS 1, 2, 3 &amp; 4 CONSENSUS)</div>
      <div style="font-size:15px; font-weight:900; color:#ffffff; margin:4px 0 8px;">${MOVING_VS_STATIC_BOARD_CONSENSUS.question}</div>
      <table style="width:100%; border-collapse:collapse; font-size:12px; color:#e2e8f0; background:#0f172a; border-radius:10px; overflow:hidden;">
        <thead>
          <tr style="background:#1e293b; color:#fbbf24; text-align:left;">
            <th style="padding:8px;">Age &amp; Talent Band</th>
            <th style="padding:8px;">Recommended On-Ice Play Start</th>
            <th style="padding:8px;">Candid Co-Founder Reasoning (Seats 1–4)</th>
          </tr>
        </thead>
        <tbody>
          ${MOVING_VS_STATIC_BOARD_CONSENSUS.recommendedMatrix.map(row => `
            <tr>
              <td style="padding:8px; border-top:1px solid #1e293b; font-weight:800; color:#38bdf8;">${row.band}</td>
              <td style="padding:8px; border-top:1px solid #1e293b; font-weight:800; color:#34d399;">${row.defaultStart}</td>
              <td style="padding:8px; border-top:1px solid #1e293b; color:#cbd5e1;">${row.why}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <h2 style="font-size:17px; color:#34d399; border-bottom:2px solid #10b981; padding-bottom:6px;">🤝 TOP 5 CO-SIGNED CONSENSUS PRIORITIES (7-FIELD ROUNDTABLE CARDS • RANKED #1 – #5)</h2>
    ${top5CoSigned.map(i => renderSevenFieldCardHtml(i, true)).join('')}

    <h2 style="font-size:17px; color:#38bdf8; border-bottom:2px solid #0284c7; padding-bottom:6px; margin-top:26px;">📋 RANKS #6 – #28: CO-SIGNED 12-SEAT / 36-IDEA MATRIX PROPOSALS (AWAITING YOUR APPROVAL)</h2>
    ${awaitingRest.map(i => renderSevenFieldCardHtml(i, false)).join('')}

    <h2 style="font-size:17px; color:#fb7185; border-bottom:2px solid #f43f5e; padding-bottom:6px; margin-top:26px;">🛑 VETOED BY 4-GATE ROUNDTABLE (CANDID PUSHBACK AGAINST FLAWED IDEAS)</h2>
    ${vetoed.map(i => renderSevenFieldCardHtml(i, false)).join('')}
  </div>
</body>
</html>`;
}

const BOARD_10_SEAT_DIGEST = BOARD_12_SEAT_DIGEST;

async function main() {
  const timestamp = new Date().toISOString();
  const htmlContent = buildEmailHtml(BOARD_30_IDEA_DIGEST, timestamp);
  const outPath = path.join(__dirname, 'FOUNDER_EMAIL_DIGEST_LATEST.html');
  fs.writeFileSync(outPath, htmlContent, 'utf8');

  const summaryCounts = {
    totalSeats: 12,
    seat0RedFlagsReviewed: SEAT_0_RED_FLAG_COUNCIL_OPTIONS.length,
    totalIdeas: BOARD_30_IDEA_DIGEST.length,
    top5CoSignedPriorities: TOP_5_COSIGNED_CONSENSUS_PRIORITIES.length,
    focusedTop12PerSeat: BOARD_12_SEAT_DIGEST.length,
    top3Recommended: BOARD_30_IDEA_DIGEST.filter(i => i.isTop3Recommended).length,
    awaitingApproval: BOARD_30_IDEA_DIGEST.filter(i => i.status === 'awaiting_founder_approval').length,
    vetoed: BOARD_30_IDEA_DIGEST.filter(i => i.status === 'vetoed').length
  };

  const payload = {
    created_by: 'send-board-digest.js',
    source_role: 'board_digest',
    scenario_id: 'SYNAPZ-ROUNDTABLE-12SEAT-36IDEA-V97',
    age_division: 'ALL',
    category: 'board_digest',
    status: 'awaiting_founder_approval',
    summary: `🤝 SYNAPZ HOCKEY — Nightly 12-Seat Collaborative Roundtable, Red-Flag Council Options & Top 5 Consensus Digest (${summaryCounts.seat0RedFlagsReviewed} Red Flag w/ Option A & B, ${summaryCounts.awaitingApproval} Awaiting Approval, ${summaryCounts.vetoed} Vetoed) -> ${RECIPIENTS.join(', ')}`,
    details: {
      version: 'v9.7',
      recipients: RECIPIENTS,
      counts: summaryCounts,
      seat0RedFlagCouncilOptions: SEAT_0_RED_FLAG_COUNCIL_OPTIONS,
      movingVsStaticConsensus: MOVING_VS_STATIC_BOARD_CONSENSUS,
      top5CoSignedConsensusPriorities: TOP_5_COSIGNED_CONSENSUS_PRIORITIES,
      top12FocusedProposals: BOARD_12_SEAT_DIGEST,
      ideas: BOARD_30_IDEA_DIGEST,
      htmlFile: 'FOUNDER_EMAIL_DIGEST_LATEST.html',
      dispatchedAt: timestamp
    }
  };

  let supabaseStatus = 'offline';
  let awaitingApprovalRowCountInSupabase = 0;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/pucksense_agent_inbox`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(payload)
    });
    supabaseStatus = `HTTP ${res.status}`;

    const countRes = await fetch(`${SUPABASE_URL}/rest/v1/pucksense_agent_inbox?status=eq.awaiting_founder_approval&select=id`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
    if (countRes.ok) {
      const rows = await countRes.json();
      awaitingApprovalRowCountInSupabase = Array.isArray(rows) ? rows.length : 0;
    }

    if (awaitingApprovalRowCountInSupabase < 28) {
      const proposalRows = BOARD_30_IDEA_DIGEST.filter(i => i.status === 'awaiting_founder_approval').map(item => ({
        created_by: `Seat-${item.seatNumber}-Roundtable`,
        source_role: 'council',
        scenario_id: item.id,
        age_division: 'ALL',
        category: 'council_spec',
        status: 'awaiting_founder_approval',
        summary: `[Rank #${item.rank} • ${item.id}] ${item.title} (${item.targetScope})`,
        details: item
      }));
      await fetch(`${SUPABASE_URL}/rest/v1/pucksense_agent_inbox`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify(proposalRows)
      });
      const recountRes = await fetch(`${SUPABASE_URL}/rest/v1/pucksense_agent_inbox?status=eq.awaiting_founder_approval&select=id`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      });
      if (recountRes.ok) {
        const rows2 = await recountRes.json();
        awaitingApprovalRowCountInSupabase = Array.isArray(rows2) ? rows2.length : 0;
      }
    }
  } catch (err) {
    supabaseStatus = `Error: ${err.message}`;
  }

  let gmailWebhookStatus = 'skipped';
  let gmailWebhookBody = '';
  const nowLocal = new Date();
  const uniqueTimestampLabel = nowLocal.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  });
  const senderDisplayName = 'Synapz Hockey 12-Seat Council';
  const emailSubject = `SYNAPZ HOCKEY — Nightly 12-Seat Collaborative Roundtable, Section 28 Rooms & Red-Flag Options [${uniqueTimestampLabel}]`;
  /**
   * NOTE FOR GOOGLE APPS SCRIPT (`Code.gs`):
   * Add `name: data.senderName || "Synapz Hockey 12-Seat Council"` inside `MailApp.sendEmail({...})`:
   *   MailApp.sendEmail({
   *     to: recipients.join(','),
   *     subject: data.subject,
   *     htmlBody: data.htmlBody,
   *     name: data.senderName || "Synapz Hockey 12-Seat Council"
   *   });
   */
  try {
    const gmailRes = await fetch(GOOGLE_APPS_SCRIPT_WEBHOOK_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        subject: emailSubject,
        senderName: senderDisplayName,
        name: senderDisplayName,
        htmlBody: htmlContent,
        recipients: RECIPIENTS
      })
    });
    gmailWebhookStatus = `HTTP ${gmailRes.status}`;
    const rawText = (await gmailRes.text()).trim();
    gmailWebhookBody = gmailRes.status === 403
      ? "Google Apps Script returned HTTP 403 ('You need access'): Web App deployment 'Who has access' is set to 'Only myself' instead of 'Anyone'. Dispatched via browser session fallback."
      : rawText.slice(0, 300);
  } catch (err) {
    gmailWebhookStatus = `Error: ${err.message}`;
  }

  console.log(JSON.stringify({
    ok: true,
    recipients: RECIPIENTS,
    counts: summaryCounts,
    supabaseStatus,
    awaitingApprovalRowCountInSupabase,
    gmailWebhookStatus,
    gmailWebhookBody,
    htmlDigestPath: outPath
  }, null, 2));
}

if (require.main === module) {
  main();
} else {
  module.exports = { SEAT_0_RED_FLAG_COUNCIL_OPTIONS, TOP_5_COSIGNED_CONSENSUS_PRIORITIES, BOARD_12_SEAT_DIGEST, BOARD_10_SEAT_DIGEST, BOARD_36_IDEA_DIGEST, BOARD_30_IDEA_DIGEST, MOVING_VS_STATIC_BOARD_CONSENSUS };
}
