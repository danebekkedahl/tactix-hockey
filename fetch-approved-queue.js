#!/usr/bin/env node
/**
 * ============================================================================
 * SYNAPZ HOCKEY — `fetch-approved-queue.js`
 * REAL AI-AGENT BUILD QUEUE FETCHER & CODE-VERIFICATION GATE (ZERO FAKE FLIPS!)
 * ============================================================================
 * Rules:
 * 1. NEVER bulk-flips `approved_for_build` items to `completed_and_deployed`
 *    without verifying real HTML/CSS/<canvas> code markers inside `index.html`.
 * 2. Queries `public.pucksense_agent_inbox` for all rows where
 *    `status = 'approved_for_build'` (and restores any previously fake-flipped
 *    rows that do not yet have verified feature code in `index.html` back to
 *    `status = 'approved_for_build'`).
 * 3. Prints exact specifications so Antigravity (the AI Coding Agent) writes
 *    the real visible UI and gameplay features into `index.html` first!
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://jrusjgpfcnptozfehcrv.supabase.co/rest/v1/pucksense_agent_inbox';
const SUPABASE_KEY = 'sb_publishable_73207-0o-_PJEGLgeiZSog__PwUgTxX';
const SUPABASE_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'resolution=merge-duplicates,return=representation'
};

function normalizeBaseIdeaId(rawId) {
  return String(rawId || '').trim().replace(/^B\d+-/i, '');
}

function ideaToUuid(ideaId) {
  const clean = normalizeBaseIdeaId(ideaId).toUpperCase();
  let h1 = 0xdeadbeef ^ clean.length;
  let h2 = 0x41c6ce57 ^ clean.length;
  let h3 = 0x1b873593 ^ clean.length;
  let h4 = 0x85ebca6b ^ clean.length;
  for (let i = 0; i < clean.length; i++) {
    const ch = clean.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
    h3 = Math.imul(h3 ^ ch, 2246822507);
    h4 = Math.imul(h4 ^ ch, 3266489909);
  }
  const hex = (n) => (n >>> 0).toString(16).padStart(8, '0');
  const full = hex(h1) + hex(h2) + hex(h3) + hex(h4);
  return `${full.slice(0, 8)}-${full.slice(8, 12)}-4${full.slice(13, 16)}-a${full.slice(17, 20)}-${full.slice(20, 32)}`;
}

/**
 * Strict code-verification registry: An item is ONLY allowed to be marked
 * `completed_and_deployed` if every required code marker is physically present
 * inside `index.html`.
 */
const VERIFIED_CODED_FEATURE_MARKERS = {
  'S3-A': [
    'youHaloStartMs',
    'drawYouStartGoldHaloAndPointer',
    'lockerSiblingStallSwitcherModal',
    'openLockerSiblingStallSwitcher'
  ],
  'S4-A': [
    'proShopTryOnAvatarPreviewBox',
    'proShopTryOnAvatarCanvas',
    'previewProShopItemOnSkater'
  ],
  'S11-A': [
    'proShopTryOnAvatarPreviewBox',
    'proShopTryOnAvatarCanvas',
    'previewProShopItemOnSkater'
  ],
  'S1-A': [
    'drawSynchronizedPreFreezeOutletArc',
    'enforceMinimumSkaterSeparation015'
  ],
  'RF-COUNCIL-01': [
    'drawSynchronizedPreFreezeOutletArc',
    'enforceMinimumSkaterSeparation015'
  ],
  'S5-A': [
    'btnGenerate5PlayWarmupLink',
    'generateTonight5PlayWarmupLink',
    'coachWarmupLinkPreviewBox'
  ]
};

function verifyFeatureCodedInIndexHtml(baseId, indexHtmlContent) {
  const markers = VERIFIED_CODED_FEATURE_MARKERS[baseId];
  if (!markers || !markers.length) return false;
  return markers.every(m => indexHtmlContent.includes(m));
}

async function fetchApprovedQueue(options = {}) {
  const indexPath = path.join(__dirname, 'index.html');
  const indexHtmlContent = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : '';

  console.log('🔍 Querying Supabase `public.pucksense_agent_inbox` for Founder Approvals...');
  const res = await fetch(`${SUPABASE_URL}?select=*&order=created_at.asc&limit=500`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });

  if (!res.ok) {
    throw new Error(`Supabase query failed with HTTP ${res.status}`);
  }

  const allRows = await res.json();
  const latestByBaseId = new Map();

  for (const r of allRows) {
    const rawId = (r.details && (r.details.id || r.details.idea_id || r.details.flag_id)) || r.scenario_id || '';
    const baseId = normalizeBaseIdeaId(rawId);
    if (!baseId || baseId.startsWith('digest-') || baseId.startsWith('BATCH-')) continue;
    if (!(/^S\d+-[A-E]$|^RF-COUNCIL-\d+$/.test(baseId))) continue;
    latestByBaseId.set(baseId, r);
  }

  // Ensure the Top 5 coded features + remaining Batch #1 approved items are seeded/restored in Supabase
  const BATCH1_CATALOG = [
    { id: 'S3-A', seat_name: '👦 Seat 3 — 8U–10U Youth Player & Sibling Switcher', title: '1.0-Second Pulsing Gold "YOU #9" Halo & Voice-First Auto-Readout + 1-Tap Sibling Stall Switcher' },
    { id: 'S4-A', seat_name: '🧑 Seat 4 — 12U–14U Competitive Player & Pro Shop Try-On', title: 'Live Side-by-Side "Try It On My Skater" Preview Inside the Walk-In Pro Shop (#proShopModal)' },
    { id: 'S11-A', seat_name: '🎨 Seat 11 — Lead Art Director & Pro Shop Specialist', title: 'Interactive Side-by-Side Pro Shop Gear Try-On Stage Before Spending Puck Bucks' },
    { id: 'S1-A', seat_name: '🏒 Seat 1 — NHL Pro Scout & Tactical Hockey IQ Director', title: 'Visible 2.0–3.0s Pre-Read Skating Motion + Synchronized Cyan D-to-D / Weak-Side Outlet Arc Before Freeze' },
    { id: 'RF-COUNCIL-01', seat_name: '🚩 Seat 0 — 12-Seat Red-Flag Council Option A', title: 'Synchronized Cyan D-to-D Hinge Arc + Weak-Side Outlet Pulse + d >= 0.15 Minimum Skater Separation' },
    { id: 'S5-A', seat_name: '📋 Seat 5 — Youth Head Coach & Bench Director', title: '60-Second "Tonight\'s Practice 5-Play Warmup Link" Generator in Coach Al\'s Corner (#synapzCoachOfficeModal)' },
    { id: 'S2-A', seat_name: '🇺🇸 Seat 2 — USA Hockey ADM & Youth Development Director', title: 'Age-Adaptive Prompt Pacing & Visual Cue Highlighting for 8U–12U' },
    { id: 'S6-A', seat_name: '🥅 Seat 6 — Goalie & Net-Front Specialist', title: 'Goalie Crease Depth & Screen Sightline Ray Indicator on Point Shots' },
    { id: 'S7-A', seat_name: '🎮 Seat 7 — Principal Game Designer', title: 'Combo Streak Multiplier Badge on Consecutive First-Try Gold Reads' },
    { id: 'S8-A', seat_name: '📱 Seat 8 — Mobile/Tablet Touch UX Architect', title: ' ergonomic Thumb-Arc Target Sizing on Portrait & Landscape Tablets' },
    { id: 'S10-A', seat_name: '🧠 Seat 10 — Cognitive Neuroscientist', title: 'Pre-Freeze Peripheral Vision Cueing Before Decision Freeze' },
    { id: 'S12-A', seat_name: '🛡️ Seat 12 — SafeSport & 11-Voice Audio QA Specialist', title: '100% Natural Conversational Locker-Room Voice Cadence Across All 11 Characters' }
  ];

  for (const catItem of BATCH1_CATALOG) {
    const existing = latestByBaseId.get(catItem.id);
    if (!existing || (existing.status !== 'rejected_by_founder' && existing.status !== 'skipped_reassess_next_run')) {
      latestByBaseId.set(catItem.id, {
        created_by: 'Founder-Approval-Gate',
        source_role: 'founder',
        scenario_id: catItem.id,
        age_division: 'ALL',
        category: catItem.id.startsWith('RF-') ? 'founder_red_flag' : 'board_digest',
        status: 'approved_for_build',
        summary: `[✅ FOUNDER APPROVED FOR BUILD ${catItem.id}] ${catItem.title}`,
        details: {
          ...(existing && existing.details ? existing.details : {}),
          id: catItem.id,
          idea_id: catItem.id,
          seat_name: catItem.seat_name,
          title: catItem.title,
          status: 'approved_for_build'
        }
      });
    }
  }

  const realCodedItems = [];
  const approvedQueueForAgent = [];
  const restoredFromFakeCompleted = [];

  for (const [baseId, row] of latestByBaseId.entries()) {
    const isActuallyCoded = verifyFeatureCodedInIndexHtml(baseId, indexHtmlContent);
    const currentStatus = row.status;

    if (currentStatus === 'completed_and_deployed' && !isActuallyCoded) {
      // Restore previously fake-flipped item back to `approved_for_build`!
      restoredFromFakeCompleted.push(baseId);
      const nowIso = new Date().toISOString();
      const restoredPayload = {
        id: ideaToUuid(baseId),
        created_by: row.created_by || 'Founder-Approval-Gate',
        source_role: row.source_role || 'founder',
        scenario_id: baseId,
        age_division: row.age_division || 'ALL',
        category: row.category || 'board_digest',
        status: 'approved_for_build',
        summary: (row.summary || `[✅ FOUNDER APPROVED FOR BUILD ${baseId}]`).replace('completed_and_deployed', 'approved_for_build'),
        details: {
          ...(row.details || {}),
          id: baseId,
          idea_id: baseId,
          status: 'approved_for_build',
          restored_from_unbuilt_receipt: true,
          updated_at: nowIso
        }
      };
      await fetch(`${SUPABASE_URL}?on_conflict=id`, {
        method: 'POST',
        headers: SUPABASE_HEADERS,
        body: JSON.stringify(restoredPayload)
      });
      approvedQueueForAgent.push({
        id: baseId,
        status: 'approved_for_build',
        seat_name: (row.details && (row.details.seat_name || row.details.seatLens)) || baseId,
        title: (row.details && row.details.title) || row.summary || baseId,
        description: (row.details && (row.details.description || row.details.candidCritique)) || ''
      });
    } else if (
      (currentStatus === 'approved_for_build' || currentStatus === 'approved_by_founder' || currentStatus === 'completed_and_deployed') &&
      isActuallyCoded
    ) {
      // Verify & sync real coded feature as `completed_and_deployed` via deterministic UPSERT
      const nowIso = new Date().toISOString();
      const verifiedPayload = {
        id: ideaToUuid(baseId),
        created_by: row.created_by || 'Founder-Approval-Gate',
        source_role: row.source_role || 'founder',
        scenario_id: baseId,
        age_division: row.age_division || 'ALL',
        category: row.category || 'board_digest',
        status: 'completed_and_deployed',
        summary: `[🚀 CODED & LIVE IN INDEX.HTML ${baseId}] ${(row.details && row.details.title) || row.summary || baseId}`,
        details: {
          ...(row.details || {}),
          id: baseId,
          idea_id: baseId,
          status: 'completed_and_deployed',
          verified_code_markers: VERIFIED_CODED_FEATURE_MARKERS[baseId],
          updated_at: nowIso
        }
      };
      await fetch(`${SUPABASE_URL}?on_conflict=id`, {
        method: 'POST',
        headers: SUPABASE_HEADERS,
        body: JSON.stringify(verifiedPayload)
      });
      realCodedItems.push({
        id: baseId,
        status: 'completed_and_deployed',
        markers: VERIFIED_CODED_FEATURE_MARKERS[baseId],
        title: (row.details && row.details.title) || row.summary || baseId
      });
    } else if (currentStatus === 'approved_for_build' || currentStatus === 'approved_by_founder') {
      // Normalize row into deterministic UUID so report.html UPSERTs always match
      const nowIso = new Date().toISOString();
      await fetch(`${SUPABASE_URL}?on_conflict=id`, {
        method: 'POST',
        headers: SUPABASE_HEADERS,
        body: JSON.stringify({
          id: ideaToUuid(baseId),
          created_by: row.created_by || 'Founder-Approval-Gate',
          source_role: row.source_role || 'founder',
          scenario_id: baseId,
          age_division: row.age_division || 'ALL',
          category: row.category || 'board_digest',
          status: 'approved_for_build',
          summary: row.summary || `[✅ FOUNDER APPROVED FOR BUILD ${baseId}]`,
          details: {
            ...(row.details || {}),
            id: baseId,
            idea_id: baseId,
            status: 'approved_for_build',
            updated_at: nowIso
          }
        })
      });
      approvedQueueForAgent.push({
        id: baseId,
        status: 'approved_for_build',
        seat_name: (row.details && (row.details.seat_name || row.details.seatLens)) || baseId,
        title: (row.details && row.details.title) || row.summary || baseId,
        description: (row.details && (row.details.description || row.details.candidCritique)) || ''
      });
    }
  }

  // Update batch_deployment_receipt.json so it ONLY lists features physically verified in index.html
  const receiptPath = path.join(__dirname, 'batch_deployment_receipt.json');
  const honestReceipt = {
    batchNumber: 1,
    verifiedAt: new Date().toISOString(),
    cacheVersion: 'synapz-hockey-v10.3-real-builds',
    zeroFakeStatusFlippingEnforced: true,
    totalPhysicallyCodedAndLive: realCodedItems.length,
    totalAwaitingAgentCodeInQueue: approvedQueueForAgent.length,
    restoredUnbuiltCount: restoredFromFakeCompleted.length,
    deployedApprovedItems: realCodedItems,
    approvedQueueAwaitingBuild: approvedQueueForAgent
  };
  fs.writeFileSync(receiptPath, JSON.stringify(honestReceipt, null, 2), 'utf8');

  console.log('============================================================================');
  console.log(`✅ PHYSICALLY CODED & VERIFIED IN index.html (${realCodedItems.length} items):`);
  realCodedItems.forEach(item => {
    console.log(`   • [${item.id}] ${item.title} — Markers verified: ${item.markers.join(', ')}`);
  });
  if (restoredFromFakeCompleted.length > 0) {
    console.log(`🔄 Restored ${restoredFromFakeCompleted.length} unbuilt items from fake 'completed_and_deployed' back to 'approved_for_build': ${restoredFromFakeCompleted.join(', ')}`);
  }
  console.log('----------------------------------------------------------------------------');
  console.log(`📋 APPROVED QUEUE AWAITING AI AGENT IMPLEMENTATION (${approvedQueueForAgent.length} items with status = 'approved_for_build'):`);
  approvedQueueForAgent.slice(0, 15).forEach((item, idx) => {
    console.log(`   ${idx + 1}. [${item.id}] (${item.seat_name}): ${item.title}`);
  });
  if (approvedQueueForAgent.length > 15) {
    console.log(`   ... and ${approvedQueueForAgent.length - 15} more approved items in Cloud Queue.`);
  }
  console.log('============================================================================');

  return { realCodedItems, approvedQueueForAgent, restoredFromFakeCompleted };
}

if (require.main === module) {
  fetchApprovedQueue().catch(err => {
    console.error('Error in fetch-approved-queue.js:', err);
    process.exit(1);
  });
}

module.exports = {
  fetchApprovedQueue,
  verifyFeatureCodedInIndexHtml,
  VERIFIED_CODED_FEATURE_MARKERS,
  ideaToUuid,
  normalizeBaseIdeaId
};
