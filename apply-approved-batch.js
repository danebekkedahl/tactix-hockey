#!/usr/bin/env node
/**
 * ============================================================================
 * SYNAPZ HOCKEY — `apply-approved-batch.js`
 * STRICT CODE-VERIFIED BATCH RECEIPT & SKIPPED-ITEM REASSESSMENT ENGINE
 * ============================================================================
 * GOVERNANCE RULE (Zero Fake Status Flipping):
 * - A plain `.js` script must NEVER mark items `completed_and_deployed` by
 *   setting dummy flags!
 * - Delegates queue inspection & code marker verification to
 *   `fetch-approved-queue.js`. Only items whose real HTML/CSS/<canvas> code
 *   markers are verified inside `index.html` can transition to
 *   `completed_and_deployed`. All other approved items remain in
 *   `status = 'approved_for_build'` for Antigravity (the AI Coding Agent).
 * ============================================================================
 */

const { fetchApprovedQueue } = require('./fetch-approved-queue.js');

async function runApplyApprovedBatch() {
  console.log('🛡️ Running Code-Verified Queue Check via `fetch-approved-queue.js` (Zero Fake Status Flipping)...');
  const result = await fetchApprovedQueue();
  return result;
}

if (require.main === module) {
  runApplyApprovedBatch().catch(err => {
    console.error('Fatal error in apply-approved-batch.js:', err);
    process.exit(1);
  });
}

module.exports = { runApplyApprovedBatch };
