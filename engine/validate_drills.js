/**
 * SYNAPZ HOCKEY v14.1 — Canonical 45/45 Drill, Kid-Clarity & Taxonomy Validator
 * (`engine/validate_drills.js`)
 *
 * Works identically as:
 *  1) Browser ES Module (`import { validateDrillSchema, validateDrillCatalog } from './validate_drills.js'`)
 *     powering runtime validation & the Slide-Over Catalog "Import Drills JSON" modal.
 *  2) Node CLI (`node engine/validate_drills.js`) enforcing `45/45` playable drills (`5 × 9` modes, `0` stub concepts).
 */

export const CANONICAL_9_MODES = [
  'read_and_react',
  'ghost_player',
  'fog_of_war',
  'two_touch',
  'spot_the_breakdown',
  'gap_surfing',
  'lane_sweeper',
  'draw_the_route',
  'change_or_stay'
];

export const CANONICAL_5_ZONES = ['DZ', 'NZ', 'OM', 'OZ', 'ST'];
export const CANONICAL_5_POSITIONS = ['C', 'LW', 'RW', 'LD', 'RD'];

export function countWords(str) {
  const clean = String(str || '').trim();
  return clean ? clean.split(/\s+/).length : 0;
}

function samplePathAt(points, tRaw) {
  if (!Array.isArray(points) || points.length === 0) return [500, 250];
  if (points.length === 1) return [points[0][0], points[0][1]];
  const t = Math.max(0, Math.min(1, Number(tRaw) || 0));
  if (t <= 0) return [points[0][0], points[0][1]];
  if (t >= 1) return [points[points.length - 1][0], points[points.length - 1][1]];
  const segs = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const d = Math.hypot(points[i + 1][0] - points[i][0], points[i + 1][1] - points[i][1]);
    segs.push(d);
    total += d;
  }
  if (total < 0.001) return [points[0][0], points[0][1]];
  const want = total * t;
  let acc = 0;
  for (let i = 0; i < segs.length; i++) {
    if (acc + segs[i] >= want || i === segs.length - 1) {
      const lt = segs[i] > 0.0001 ? (want - acc) / segs[i] : 0;
      return [
        points[i][0] + (points[i + 1][0] - points[i][0]) * lt,
        points[i][1] + (points[i + 1][1] - points[i][1]) * lt
      ];
    }
    acc += segs[i];
  }
  return [points[points.length - 1][0], points[points.length - 1][1]];
}

function checkCoordPair(pair, label, errors) {
  if (!Array.isArray(pair) || pair.length < 2) {
    errors.push(`${label}: expected [x, y] coordinate pair`);
    return;
  }
  const [x, y] = pair;
  if (typeof x !== 'number' || Number.isNaN(x) || x < 0 || x > 1000) {
    errors.push(`${label}: x=${x} out of canonical [0..1000] bounds`);
  }
  if (typeof y !== 'number' || Number.isNaN(y) || y < 0 || y > 500) {
    errors.push(`${label}: y=${y} out of canonical [0..500] bounds`);
  }
}

function checkPointList(points, label, errors) {
  if (!Array.isArray(points) || points.length === 0) {
    errors.push(`${label}: expected non-empty array of [x, y] points`);
    return;
  }
  points.forEach((pt, idx) => checkCoordPair(pt, `${label}[${idx}]`, errors));
}

/**
 * Checks if a non-shot pass/rim segment cuts impossibly through the back iron/mesh
 * of the Left Goal Cage (x: 67..88.5, y: 228..272) or Right Goal Cage (x: 911.5..933, y: 228..272).
 */
export function segmentCutsGoalCageBack(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  const STEPS = 32;
  for (let s = 1; s < STEPS; s++) {
    const t = s / STEPS;
    const x = a[0] + (b[0] - a[0]) * t;
    const y = a[1] + (b[1] - a[1]) * t;
    const inLeftCage = x >= 67 && x <= 88.2 && y >= 228 && y <= 272;
    const inRightCage = x >= 911.8 && x <= 933 && y >= 228 && y <= 272;
    if (inLeftCage || inRightCage) return true;
  }
  return false;
}

function checkPolylineGoalCageClearance(points, label, errors) {
  if (!Array.isArray(points) || points.length < 2) return;
  for (let i = 0; i < points.length - 1; i++) {
    if (segmentCutsGoalCageBack(points[i], points[i + 1])) {
      errors.push(`${label}[${i}->${i + 1}] cuts impossibly through the back of the goal cage`);
    }
  }
}

export function computeFreezeSkaterPositions(drill) {
  const normT = drill.mode === 'spot_the_breakdown' ? 0.35 : 1.0;
  return (drill.skaters || []).map((sk) => {
    const traj = Array.isArray(sk.motion) && sk.motion.length > 0 ? sk.motion : [sk.start];
    return {
      id: sk.id,
      team: sk.team,
      pos: samplePathAt(traj, normT)
    };
  });
}

export function validateDrillSchema(drill, opts = {}) {
  const errors = [];
  const strictKidClarity = opts.strictKidClarity !== false;
  if (!drill || typeof drill !== 'object') {
    return { valid: false, errors: ['Drill must be a non-null object'] };
  }

  const id = String(drill.id || '').trim();
  if (!id) errors.push('Missing drill.id');
  if (!drill.conceptId || !/^(DZ|NZ|OM|OZ|ST)-\d{2}$/.test(String(drill.conceptId))) {
    errors.push(`Invalid drill.conceptId "${drill.conceptId}" (expected DZ/NZ/OM/OZ/ST-XX)`);
  }
  if (!CANONICAL_5_ZONES.includes(drill.zone)) {
    errors.push(`Invalid drill.zone "${drill.zone}"`);
  }
  if (!CANONICAL_9_MODES.includes(drill.mode)) {
    errors.push(`Invalid drill.mode "${drill.mode}" (must be one of 9 canonical modes)`);
  }
  if (!CANONICAL_5_POSITIONS.includes(drill.youRole)) {
    errors.push(`Invalid drill.youRole "${drill.youRole}" (must be C, LW, RW, LD, or RD)`);
  }

  // Kid-Clarity Copy Rules: briefing <= 15w (<=120 chars), coachTip <= 14w (<=110 chars), coachRule <= 15w
  const briefing = String(drill.briefing || '').trim();
  if (!briefing) errors.push('Missing drill.briefing');
  if (briefing.length > 120) {
    errors.push(`drill.briefing length (${briefing.length}) exceeds 120 chars`);
  }
  if (strictKidClarity && countWords(briefing) > 15) {
    errors.push(`drill.briefing word count (${countWords(briefing)}) exceeds 15 words`);
  }

  const coachTip = String(drill.coachTip || '').trim();
  if (!coachTip) errors.push('Missing drill.coachTip');
  if (coachTip.length > 110) {
    errors.push(`drill.coachTip length (${coachTip.length}) exceeds 110 chars`);
  }
  if (strictKidClarity && countWords(coachTip) > 14) {
    errors.push(`drill.coachTip word count (${countWords(coachTip)}) exceeds 14 words`);
  }

  const coachRule = String(drill.coachRule || '').trim();
  if (!coachRule) errors.push('Missing drill.coachRule');
  if (countWords(coachRule) > 15) {
    errors.push(`drill.coachRule word count (${countWords(coachRule)}) exceeds 15 words`);
  }

  // Camera framing bounds
  const cam = drill.camera;
  if (!cam || typeof cam !== 'object') {
    errors.push('Missing drill.camera { focusX, focusY, zoom }');
  } else {
    checkCoordPair([cam.focusX, cam.focusY], 'drill.camera.[focusX,focusY]', errors);
    if (typeof cam.zoom !== 'number' || cam.zoom < 1.15 || cam.zoom > 1.85) {
      errors.push(`drill.camera.zoom=${cam.zoom} out of [1.15..1.85] bounds`);
    }
  }

  // Skaters & coordinate paths + >= 28 logical unit freeze separation
  if (!Array.isArray(drill.skaters) || drill.skaters.length < 5) {
    errors.push('drill.skaters must include at least the 5 team positions (C, LW, RW, LD, RD)');
  } else {
    const teamRolesFound = new Set();
    drill.skaters.forEach((sk, idx) => {
      const tag = `drill.skaters[${idx}:${sk.id || '?'}]`;
      if (sk.team === 'home' && CANONICAL_5_POSITIONS.includes(sk.id)) {
        teamRolesFound.add(sk.id);
      }
      checkCoordPair(sk.start, `${tag}.start`, errors);
      if (Array.isArray(sk.motion) && sk.motion.length > 0) {
        checkPointList(sk.motion, `${tag}.motion`, errors);
      }
      if (Array.isArray(sk.outcomeGold) && sk.outcomeGold.length > 0) {
        checkPointList(sk.outcomeGold, `${tag}.outcomeGold`, errors);
      }
      if (Array.isArray(sk.outcomeMiss) && sk.outcomeMiss.length > 0) {
        checkPointList(sk.outcomeMiss, `${tag}.outcomeMiss`, errors);
      }
    });
    for (const pos of CANONICAL_5_POSITIONS) {
      if (!teamRolesFound.has(pos)) {
        errors.push(`drill.skaters missing home position "${pos}" required for Chalk-Talk [C][LW][RW][LD][RD] switcher`);
      }
    }

    if (strictKidClarity) {
      const freezeSkaters = computeFreezeSkaterPositions(drill);
      for (let i = 0; i < freezeSkaters.length; i++) {
        for (let j = i + 1; j < freezeSkaters.length; j++) {
          const a = freezeSkaters[i];
          const b = freezeSkaters[j];
          const d = Math.hypot(a.pos[0] - b.pos[0], a.pos[1] - b.pos[1]);
          if (d < 28) {
            errors.push(`Token overlap at freeze: ${a.id} and ${b.id} are ${d.toFixed(1)} units apart (must be >= 28)`);
          }
        }
      }
    }
  }

  if (drill.puck && typeof drill.puck === 'object') {
    if (Array.isArray(drill.puck.livePath) && drill.puck.livePath.length > 0) {
      checkPointList(drill.puck.livePath, 'drill.puck.livePath', errors);
      checkPolylineGoalCageClearance(drill.puck.livePath, 'drill.puck.livePath', errors);
    }
    if (Array.isArray(drill.puck.goldPath) && drill.puck.goldPath.length > 0) {
      checkPointList(drill.puck.goldPath, 'drill.puck.goldPath', errors);
      checkPolylineGoalCageClearance(drill.puck.goldPath, 'drill.puck.goldPath', errors);
    }
    if (Array.isArray(drill.puck.missPath) && drill.puck.missPath.length > 0) {
      checkPointList(drill.puck.missPath, 'drill.puck.missPath', errors);
    }
  } else {
    errors.push('Missing drill.puck trajectory definition');
  }

  // 15-Second Chalk-Talk Lesson Reel validation
  const reel = drill.lessonReel;
  if (!reel || typeof reel !== 'object') {
    errors.push('Missing drill.lessonReel');
  } else {
    if (!String(reel.kicker || '').trim()) errors.push('Missing lessonReel.kicker');
    const hl = String(reel.headline || '').trim();
    if (!hl) errors.push('Missing lessonReel.headline');
    if (countWords(hl) > 7) {
      errors.push(`lessonReel.headline "${hl}" exceeds 7 words (${countWords(hl)} words)`);
    }
    if (!reel.positionRoles || typeof reel.positionRoles !== 'object') {
      errors.push('Missing lessonReel.positionRoles map for C/LW/RW/LD/RD');
    } else {
      for (const pos of CANONICAL_5_POSITIONS) {
        if (!reel.positionRoles[pos] || !String(reel.positionRoles[pos].callout || '').trim()) {
          errors.push(`Missing lessonReel.positionRoles.${pos}.callout`);
        }
      }
    }
    if (!Array.isArray(reel.beats) || reel.beats.length !== 3) {
      errors.push('lessonReel.beats must contain exactly 3 beats (Setup -> Movement -> Execution)');
    } else {
      let totalSec = 0;
      reel.beats.forEach((b, bIdx) => {
        const bTag = `lessonReel.beats[${bIdx}]`;
        totalSec += Number(b.durationSec || 0);
        const cap = String(b.caption || '').trim();
        if (!cap) errors.push(`${bTag}: missing caption`);
        if (strictKidClarity && countWords(cap) > 12) {
          errors.push(`${bTag}.caption (${countWords(cap)}w) exceeds 12-word Kid-Clarity limit`);
        }
        if (Array.isArray(b.paths)) {
          b.paths.forEach((p, pIdx) => {
            checkPointList(p.points, `${bTag}.paths[${pIdx}].points`, errors);
            if (p.type === 'pass') {
              checkPolylineGoalCageClearance(p.points, `${bTag}.paths[${pIdx}].pass`, errors);
            }
          });
        }
        if (b.thisSpaceHalo) {
          checkCoordPair([b.thisSpaceHalo.x, b.thisSpaceHalo.y], `${bTag}.thisSpaceHalo`, errors);
        }
        if (Array.isArray(b.pressureCones)) {
          b.pressureCones.forEach((c, cIdx) => {
            checkCoordPair(c.from, `${bTag}.pressureCones[${cIdx}].from`, errors);
            checkCoordPair(c.to, `${bTag}.pressureCones[${cIdx}].to`, errors);
          });
        }
        if (Array.isArray(b.calloutPills)) {
          b.calloutPills.forEach((pill, pillIdx) => {
            checkCoordPair([pill.x, pill.y], `${bTag}.calloutPills[${pillIdx}]`, errors);
          });
        }
      });
      if (totalSec < 11 || totalSec > 16) {
        errors.push(`lessonReel total duration (${totalSec}s) must be 12–15s`);
      }
    }
  }

  // Mode-specific modeConfig validation across all 9 modes
  const mc = drill.modeConfig;
  if (!mc || typeof mc !== 'object') {
    errors.push('Missing drill.modeConfig');
  } else {
    const freezeSkaters = computeFreezeSkaterPositions(drill);
    const youFreeze = freezeSkaters.find(s => s.id === drill.youRole);

    switch (drill.mode) {
      case 'read_and_react': {
        if (typeof mc.freezeTime !== 'number' || mc.freezeTime <= 0) {
          errors.push('modeConfig.freezeTime must be > 0');
        }
        if (!Array.isArray(mc.options) || mc.options.length !== 3) {
          errors.push('read_and_react requires exactly 3 A/B/C options');
        } else {
          const goldCount = mc.options.filter(o => o.isGold).length;
          if (goldCount < 1) errors.push('read_and_react requires at least 1 isGold option');
          mc.options.forEach((opt, i) => {
            checkCoordPair(opt.target, `modeConfig.options[${i}].target`, errors);
            if (countWords(opt.label) > 6) {
              errors.push(`modeConfig.options[${i}].label "${opt.label}" exceeds 6 words`);
            }
            if (youFreeze && opt.pathType !== 'shot' && segmentCutsGoalCageBack(youFreeze.pos, opt.target)) {
              errors.push(`modeConfig.options[${i}] pass cuts impossibly through goal cage`);
            }
          });
        }
        if (Array.isArray(mc.pressureCones)) {
          mc.pressureCones.forEach((c, i) => {
            checkCoordPair(c.from, `modeConfig.pressureCones[${i}].from`, errors);
            checkCoordPair(c.to, `modeConfig.pressureCones[${i}].to`, errors);
          });
        }
        break;
      }
      case 'ghost_player': {
        if (!Array.isArray(mc.targetZoneKeyframes) || mc.targetZoneKeyframes.length < 2) {
          errors.push('ghost_player requires >= 2 targetZoneKeyframes');
        } else {
          mc.targetZoneKeyframes.forEach((kf, i) => {
            checkCoordPair([kf.x, kf.y], `modeConfig.targetZoneKeyframes[${i}]`, errors);
          });
        }
        break;
      }
      case 'fog_of_war': {
        if (typeof mc.passArrivalTime !== 'number' || mc.passArrivalTime <= 0) {
          errors.push('fog_of_war requires passArrivalTime > 0');
        }
        if (!mc.fogRegion) {
          errors.push('fog_of_war requires fogRegion');
        } else {
          checkCoordPair([mc.fogRegion.x, mc.fogRegion.y], 'modeConfig.fogRegion.[x,y]', errors);
          checkCoordPair(
            [mc.fogRegion.x + mc.fogRegion.w, mc.fogRegion.y + mc.fogRegion.h],
            'modeConfig.fogRegion.[x+w,y+h]',
            errors
          );
        }
        if (!Array.isArray(mc.options) || mc.options.length !== 3) {
          errors.push('fog_of_war requires 3 outlet options');
        } else {
          mc.options.forEach((opt, i) => {
            checkCoordPair(opt.target, `modeConfig.options[${i}].target`, errors);
            if (countWords(opt.label) > 6) {
              errors.push(`modeConfig.options[${i}].label "${opt.label}" exceeds 6 words`);
            }
            if (youFreeze && segmentCutsGoalCageBack(youFreeze.pos, opt.target)) {
              errors.push(`modeConfig.options[${i}] outlet pass cuts impossibly through goal cage`);
            }
          });
        }
        break;
      }
      case 'two_touch': {
        if (!Array.isArray(mc.goldSequence) || mc.goldSequence.length !== 2) {
          errors.push('two_touch requires goldSequence of exactly 2 teammate IDs');
        }
        if (!Array.isArray(mc.candidates) || mc.candidates.length < 2) {
          errors.push('two_touch requires >= 2 candidate teammate nodes');
        } else {
          mc.candidates.forEach((c, i) => checkCoordPair(c.target, `modeConfig.candidates[${i}].target`, errors));
        }
        break;
      }
      case 'spot_the_breakdown': {
        if (!mc.culpritId) errors.push('spot_the_breakdown requires culpritId');
        if (typeof mc.rewindSec !== 'number' || mc.rewindSec <= 0) {
          errors.push('spot_the_breakdown requires rewindSec > 0');
        }
        if (!Array.isArray(mc.suspects) || mc.suspects.length < 2) {
          errors.push('spot_the_breakdown requires >= 2 suspects');
        }
        break;
      }
      case 'gap_surfing': {
        if (!mc.attackerId) errors.push('gap_surfing requires attackerId');
        if (typeof mc.blueLineX !== 'number' || mc.blueLineX < 0 || mc.blueLineX > 1000) {
          errors.push('gap_surfing requires valid blueLineX');
        }
        if (typeof mc.idealGapDist !== 'number' || mc.idealGapDist <= 0) {
          errors.push('gap_surfing requires idealGapDist > 0');
        }
        break;
      }
      case 'lane_sweeper': {
        checkCoordPair(mc.pivotOrigin, 'modeConfig.pivotOrigin', errors);
        if (!Array.isArray(mc.passes) || mc.passes.length < 2) {
          errors.push('lane_sweeper requires >= 2 passes (perimeter + seam threat)');
        } else {
          const hasThreat = mc.passes.some(p => p.isThreat === true);
          const hasHarmless = mc.passes.some(p => p.isThreat === false);
          if (!hasThreat || !hasHarmless) {
            errors.push('lane_sweeper requires both harmless perimeter (isThreat:false) and dangerous seam (isThreat:true) passes');
          }
          mc.passes.forEach((p, i) => {
            checkCoordPair(p.from, `modeConfig.passes[${i}].from`, errors);
            checkCoordPair(p.to, `modeConfig.passes[${i}].to`, errors);
            if (segmentCutsGoalCageBack(p.from, p.to)) {
              errors.push(`modeConfig.passes[${i}] cuts impossibly through goal cage`);
            }
          });
        }
        break;
      }
      case 'draw_the_route': {
        if (!mc.thisSpace) {
          errors.push('draw_the_route requires modeConfig.thisSpace');
        } else {
          checkCoordPair([mc.thisSpace.x, mc.thisSpace.y], 'modeConfig.thisSpace', errors);
        }
        if (Array.isArray(mc.idealRoute) && mc.idealRoute.length > 0) {
          checkPointList(mc.idealRoute, 'modeConfig.idealRoute', errors);
        } else {
          errors.push('draw_the_route requires modeConfig.idealRoute');
        }
        break;
      }
      case 'change_or_stay': {
        if (mc.correctAction !== 'change' && mc.correctAction !== 'stay') {
          errors.push('change_or_stay requires correctAction === "change" or "stay"');
        }
        if (typeof mc.fatiguePct !== 'number' || mc.fatiguePct < 50 || mc.fatiguePct > 100) {
          errors.push('change_or_stay requires fatiguePct in [50..100]');
        }
        checkCoordPair(mc.benchPos, 'modeConfig.benchPos', errors);
        break;
      }
      default:
        break;
    }
  }

  return {
    valid: errors.length === 0,
    drillId: id,
    conceptId: drill.conceptId,
    mode: drill.mode,
    errors
  };
}

export function validateDrillCatalog(catalog, opts = {}) {
  const catalogErrors = [];
  if (!catalog || typeof catalog !== 'object') {
    return { valid: false, validCount: 0, totalCount: 0, stubConceptsCount: 45, catalogErrors: ['Catalog must be an object'], drillResults: [] };
  }

  const concepts = Array.isArray(catalog.concepts) ? catalog.concepts : [];
  if (concepts.length !== 45) {
    catalogErrors.push(`Expected 45 canonical taxonomy concepts (DZ-01..12, NZ-01..08, OM-01..08, OZ-01..09, ST-01..08), found ${concepts.length}`);
  }

  const drills = Array.isArray(catalog.drills) ? catalog.drills : [];
  if (drills.length !== 45 && opts.allowPartial !== true) {
    catalogErrors.push(`Expected 45/45 playable drills (5 × 9 modes), found ${drills.length}`);
  }

  const seenIds = new Set();
  const coveredConcepts = new Set();
  const modeCounts = Object.fromEntries(CANONICAL_9_MODES.map(m => [m, 0]));
  const drillResults = drills.map((drill) => {
    const res = validateDrillSchema(drill, opts);
    if (seenIds.has(drill.id)) {
      res.valid = false;
      res.errors.push(`Duplicate drill.id "${drill.id}"`);
    }
    seenIds.add(drill.id);
    if (coveredConcepts.has(drill.conceptId)) {
      res.valid = false;
      res.errors.push(`Duplicate drill.conceptId "${drill.conceptId}"`);
    }
    coveredConcepts.add(drill.conceptId);
    if (modeCounts[drill.mode] != null) modeCounts[drill.mode] += 1;
    return res;
  });

  const missingConcepts = concepts.map(c => c.id).filter(cid => !coveredConcepts.has(cid));
  if (missingConcepts.length > 0 && opts.allowPartial !== true) {
    catalogErrors.push(`Found ${missingConcepts.length} unplayable stub concept(s): ${missingConcepts.join(', ')}`);
  }

  if (drills.length === 45 && opts.allowPartial !== true) {
    for (const mode of CANONICAL_9_MODES) {
      if (modeCounts[mode] !== 5) {
        catalogErrors.push(`Mode "${mode}" has ${modeCounts[mode]} drills (expected balanced 5 drills per mode across all 9 modes)`);
      }
    }
  }

  const validCount = drillResults.filter(r => r.valid).length;
  return {
    valid: catalogErrors.length === 0 && validCount === drills.length && drills.length > 0,
    validCount,
    totalCount: drills.length,
    conceptsCount: concepts.length,
    stubConceptsCount: missingConcepts.length,
    modeCounts,
    catalogErrors,
    drillResults
  };
}

// Node CLI Entrypoint (`node engine/validate_drills.js`)
const isNodeCli =
  typeof process !== 'undefined' &&
  Boolean(process.versions && process.versions.node) &&
  typeof window === 'undefined' &&
  Array.isArray(process.argv) &&
  process.argv[1] &&
  process.argv[1].replace(/\\/g, '/').endsWith('validate_drills.js');

if (isNodeCli) {
  (async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const url = await import('node:url');
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    const targetArg = process.argv[2];
    const catalogPath = targetArg
      ? path.resolve(process.cwd(), targetArg)
      : path.resolve(__dirname, '..', 'drills', 'catalog_45.json');

    if (!fs.existsSync(catalogPath)) {
      console.error(`❌ Drill catalog not found at: ${catalogPath}`);
      process.exit(1);
    }

    const raw = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    const report = validateDrillCatalog(raw);

    if (!report.valid) {
      console.error(`❌ Drill Validation FAILED (${report.validCount}/${report.totalCount} valid | ${report.stubConceptsCount} stubs):`);
      for (const ce of report.catalogErrors) {
        console.error(`  - [CATALOG] ${ce}`);
      }
      for (const dr of report.drillResults) {
        if (!dr.valid) {
          console.error(`  - [${dr.drillId} | ${dr.conceptId} | ${dr.mode}]: ${dr.errors.join('; ')}`);
        }
      }
      process.exit(1);
    }

    console.log(
      `✅ SYNAPZ v14.1 Drill Schema Validator PASSED: ${report.validCount}/${report.totalCount} playable drills valid (0 errors, ${report.stubConceptsCount} stub concepts) | ${report.conceptsCount}/45 taxonomy concepts | 9×5 Mode balance:`,
      JSON.stringify(report.modeCounts)
    );
  })().catch((err) => {
    console.error('❌ Validator fatal error:', err);
    process.exit(1);
  });
}
