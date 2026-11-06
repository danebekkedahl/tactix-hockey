#!/usr/bin/env node
/**
 * ============================================================================
 * SYNAPZ HOCKEY — SECTION 32: LOCAL / CLOUD AUTO-WATCHER (`watch-approved-queue.js`)
 * ============================================================================
 * Polls `public.pucksense_agent_inbox` in Supabase every 15 seconds for
 * `status = 'batch_deploy_requested'` (triggered when Coach Dane or Coach Evan
 * clicks `[🚀 BUILD & DEPLOY ALL X APPROVED UPGRADES NOW]` on `report.html` or
 * in the email digest).
 *
 * When detected, automatically executes the 4-stage batch deployment pipeline:
 *   1. `node apply-approved-batch.js`
 *   2. `node deep_playtest_audit.js --marathon`
 *   3. `node deploy-github-pages.js`
 *   4. `node send-board-digest.js --marathon`
 * ============================================================================
 */

const { execSync } = require('child_process');
const path = require('path');

const SUPABASE_URL = 'https://jrusjgpfcnptozfehcrv.supabase.co/rest/v1/pucksense_agent_inbox';
const SUPABASE_KEY = 'sb_publishable_73207-0o-_PJEGLgeiZSog__PwUgTxX';
const POLL_INTERVAL_MS = 15000;

let isRunningBatch = false;

async function checkAndRunBatchQueue() {
  if (isRunningBatch) return;
  try {
    const res = await fetch(`${SUPABASE_URL}?status=eq.batch_deploy_requested&select=id,scenario_id,summary,created_at&limit=5`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
    if (!res.ok) return;
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return;

    isRunningBatch = true;
    console.log(`\n🚀 [${new Date().toISOString()}] Detected ${rows.length} 'batch_deploy_requested' trigger(s) in Supabase!`);
    const nodeBin = process.execPath;
    const cwd = __dirname;

    // Mark trigger in-progress first so duplicate polls don't double-fire
    await fetch(`${SUPABASE_URL}?status=eq.batch_deploy_requested`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ status: 'building_approved_batch' })
    });

    console.log('1/4 🛠️ Running apply-approved-batch.js...');
    execSync(`"${nodeBin}" "${path.join(cwd, 'apply-approved-batch.js')}"`, { stdio: 'inherit', cwd });

    console.log('2/4 🔬 Running deep_playtest_audit.js --marathon...');
    execSync(`"${nodeBin}" "${path.join(cwd, 'deep_playtest_audit.js')}" --marathon`, { stdio: 'inherit', cwd });

    console.log('3/4 🌐 Running deploy-github-pages.js...');
    execSync(`"${nodeBin}" "${path.join(cwd, 'deploy-github-pages.js')}"`, { stdio: 'inherit', cwd });

    console.log('4/4 📧 Running send-board-digest.js --marathon (< 75 KB single consolidated receipt)...');
    execSync(`"${nodeBin}" "${path.join(cwd, 'send-board-digest.js')}" --marathon`, { stdio: 'inherit', cwd });

    await fetch(`${SUPABASE_URL}?status=eq.building_approved_batch`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ status: 'completed_and_deployed' })
    });

    console.log(`✅ [${new Date().toISOString()}] Remote Batch Deployment + Skipped-Item Reassessment + Next Marathon Audit Complete!`);
  } catch (err) {
    console.error('⚠️ Auto-Watcher error:', err.message);
  } finally {
    isRunningBatch = false;
  }
}

console.log(`👀 SYNAPZ HOCKEY Section 32 Auto-Watcher active — polling Supabase every ${POLL_INTERVAL_MS / 1000}s for 'batch_deploy_requested'...`);
checkAndRunBatchQueue();
setInterval(checkAndRunBatchQueue, POLL_INTERVAL_MS);
