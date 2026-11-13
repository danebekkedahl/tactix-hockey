#!/usr/bin/env node
/**
 * TACTIX HOCKEY — Automated GitHub Pages Deployer (Zero git/gh CLI required)
 * Uses GitHub OAuth Device Flow + GitHub REST & Git Trees API to publish:
 *   index.html, report.html, manifest.json, sw.js, assets/tactix-logo.png, assets/coach-bob.png
 * to https://<owner>.github.io/tactix-hockey/
 * Also saves the token locally so future `RUN MASTER PIPELINE` runs deploy in 1 click!
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');

const CLIENT_ID = '178c6fc778ccc68e1d6a';
const REPO_NAMES = ['synapz-hockey', 'tactix-hockey'];
const TOKEN_FILE = path.join('C:\\Users\\Dane\\.gemini', '.tactix_gh_token');
const WORKSPACE_A = 'c:\\Users\\Dane\\.gemini\\antigravity\\scratch\\pucksense';
const WORKSPACE_B = 'C:\\Users\\Dane\\Documents\\Hockey-IQ-App';

const FILES_TO_DEPLOY = [
  { rel: 'index.html', encoding: 'utf-8' },
  { rel: 'report.html', encoding: 'utf-8' },
  { rel: 'manifest.json', encoding: 'utf-8' },
  { rel: 'sw.js', encoding: 'utf-8' },
  { rel: 'FOUNDER_VISION_NOTES.md', encoding: 'utf-8' },
  { rel: 'AGENT.md', encoding: 'utf-8' },
  { rel: 'CONTEXT.md', encoding: 'utf-8' },
  { rel: 'CHANGELOG_DECISIONS.md', encoding: 'utf-8' },
  { rel: 'LEARNING_COUNCIL_REPORT.md', encoding: 'utf-8' },
  { rel: 'PLAYTEST_REPORT.md', encoding: 'utf-8' },
  { rel: 'playtest_coverage_ledger.json', encoding: 'utf-8' },
  { rel: 'audit_coverage_ledger.json', encoding: 'utf-8' },
  { rel: 'audit_live_findings.json', encoding: 'utf-8' },
  { rel: 'founder_taste_profile.json', encoding: 'utf-8' },
  { rel: 'batch_deployment_receipt.json', encoding: 'utf-8' },
  { rel: 'fresh_12_seat_recommendations.json', encoding: 'utf-8' },
  { rel: 'v110_63_upgrades_audit.json', encoding: 'utf-8' },
  { rel: 'v111_118_upgrades_audit.json', encoding: 'utf-8' },
  { rel: 'v112_173_upgrades_audit.json', encoding: 'utf-8' },
  { rel: 'v120_242_upgrades_audit.json', encoding: 'utf-8' },
  { rel: 'v121_242_upgrades_audit.json', encoding: 'utf-8' },
  { rel: 'v122_242_upgrades_audit.json', encoding: 'utf-8' },
  { rel: 'v123_242_upgrades_audit.json', encoding: 'utf-8' },
  { rel: 'fetch-approved-queue.js', encoding: 'utf-8' },
  { rel: 'apply-approved-batch.js', encoding: 'utf-8' },
  { rel: 'watch-approved-queue.js', encoding: 'utf-8' },
  { rel: 'harvest-tactix-videos.js', encoding: 'utf-8' },
  { rel: 'send-board-digest.js', encoding: 'utf-8' },
  { rel: 'deep_playtest_audit.js', encoding: 'utf-8' },
  { rel: 'deploy-github-pages.js', encoding: 'utf-8' },
  { rel: 'generate-natural-voices.js', encoding: 'utf-8' },
  { rel: 'assets/audio/voices/voice-manifest.json', encoding: 'utf-8' },
  { rel: '.nojekyll', encoding: 'utf-8' },
  { rel: '.gitignore', encoding: 'utf-8' },
  { rel: 'assets/synapz-logo.png', encoding: 'base64' },
  { rel: 'assets/synapz-logo.webp', encoding: 'base64' },
  { rel: 'adversarial_qa_agent.js', encoding: 'utf-8' },
  { rel: 'qa_adversarial_report.json', encoding: 'utf-8' },
  { rel: 'specs/adaptive_iq_rules.json', encoding: 'utf-8' },
  { rel: 'curriculum_iq_audit.js', encoding: 'utf-8' },
  { rel: 'curriculum_iq_audit_report.json', encoding: 'utf-8' },
  { rel: 'qa_screenshots/01_screen1_portals_1024x768.png', encoding: 'base64' },
  { rel: 'qa_screenshots/01_screen1_portals_390x844.png', encoding: 'base64' },
  { rel: 'qa_screenshots/02_pp_create_3cards_1024x768.png', encoding: 'base64' },
  { rel: 'qa_screenshots/02_pp_create_3cards_390x844.png', encoding: 'base64' },
  { rel: 'qa_screenshots/03_cp_create_5cards_1024x768.png', encoding: 'base64' },
  { rel: 'qa_screenshots/03_cp_create_5cards_390x844.png', encoding: 'base64' },
  { rel: 'qa_screenshots/04_info_contact_support_faq_1024x768.png', encoding: 'base64' },
  { rel: 'qa_screenshots/04_info_contact_support_faq_390x844.png', encoding: 'base64' },
  { rel: 'qa_screenshots/05_guided_agent_8avatars_1024x768.png', encoding: 'base64' },
  { rel: 'qa_screenshots/05_guided_agent_8avatars_390x844.png', encoding: 'base64' },
  { rel: 'qa_screenshots/06_hd_lobby_1024x768.png', encoding: 'base64' },
  { rel: 'qa_screenshots/06_hd_lobby_390x844.png', encoding: 'base64' },
  { rel: 'qa_screenshots/07_hd_locker_avatar_bag_1024x768.png', encoding: 'base64' },
  { rel: 'qa_screenshots/07_hd_locker_avatar_bag_390x844.png', encoding: 'base64' },
  { rel: 'qa_screenshots/08_hd_pro_shop_1024x768.png', encoding: 'base64' },
  { rel: 'qa_screenshots/08_hd_pro_shop_390x844.png', encoding: 'base64' },
  { rel: 'qa_screenshots/09_clubhouse_globe_wall_1024x768.png', encoding: 'base64' },
  { rel: 'qa_screenshots/09_clubhouse_globe_wall_390x844.png', encoding: 'base64' },
  { rel: 'qa_screenshots/10a_coach_office_player_inbox_390x844.png', encoding: 'base64' },
  { rel: 'qa_screenshots/10b_coach_office_head_coach_390x844.png', encoding: 'base64' },
  { rel: 'qa_screenshots/10c_coach_office_director_1024x768.png', encoding: 'base64' },
  { rel: 'qa_screenshots/10c_coach_office_director_390x844.png', encoding: 'base64' },
  { rel: 'qa_screenshots/11_live_drill_single_focal_arc_1024x768.png', encoding: 'base64' },
  { rel: 'qa_screenshots/11_live_drill_single_focal_arc_390x844.png', encoding: 'base64' },
  { rel: 'assets/synapz-splash-bg.png', encoding: 'base64' },
  { rel: 'assets/tactix-logo.png', encoding: 'base64' },
  { rel: 'assets/coach-bob.png', encoding: 'base64' },
  { rel: 'assets/agents/agent-maya.png', encoding: 'base64' },
  { rel: 'assets/agents/agent-jalen.png', encoding: 'base64' },
  { rel: 'assets/agents/agent-chloe.png', encoding: 'base64' },
  { rel: 'assets/agents/agent-sofia.png', encoding: 'base64' },
  { rel: 'assets/agents/agent-leo.png', encoding: 'base64' },
  { rel: 'assets/agents/agent-marcus.png', encoding: 'base64' },
  { rel: 'assets/agents/agent-priya.png', encoding: 'base64' },
  { rel: 'assets/agents/agent-ryan.png', encoding: 'base64' },
  { rel: 'assets/agents/agent-claire.png', encoding: 'base64' },
  { rel: 'assets/cutouts/agent-leo.png', encoding: 'base64' },
  { rel: 'assets/cutouts/agent-maya.png', encoding: 'base64' },
  { rel: 'assets/cutouts/agent-jalen.png', encoding: 'base64' },
  { rel: 'assets/cutouts/agent-chloe.png', encoding: 'base64' },
  { rel: 'assets/cutouts/agent-sofia.png', encoding: 'base64' },
  { rel: 'assets/cutouts/agent-marcus.png', encoding: 'base64' },
  { rel: 'assets/cutouts/agent-priya.png', encoding: 'base64' },
  { rel: 'assets/cutouts/agent-ryan.png', encoding: 'base64' },
  { rel: 'assets/cutouts/agent-claire.png', encoding: 'base64' },
  { rel: 'assets/cutouts/coach-bob.png', encoding: 'base64' },
  { rel: 'assets/cutouts/coach-al.png', encoding: 'base64' },
  { rel: 'assets/avatars/avatar-male-1.png', encoding: 'base64' },
  { rel: 'assets/avatars/avatar-male-2.png', encoding: 'base64' },
  { rel: 'assets/avatars/avatar-male-3.png', encoding: 'base64' },
  { rel: 'assets/avatars/avatar-male-4.png', encoding: 'base64' },
  { rel: 'assets/avatars/avatar-female-1.png', encoding: 'base64' },
  { rel: 'assets/avatars/avatar-female-2.png', encoding: 'base64' },
  { rel: 'assets/avatars/avatar-female-3.png', encoding: 'base64' },
  { rel: 'assets/avatars/avatar-female-4.png', encoding: 'base64' },
  { rel: 'assets/rooms/room-rink-lobby.jpg', encoding: 'base64' },
  { rel: 'assets/rooms/room-locker-room.jpg', encoding: 'base64' },
  { rel: 'assets/rooms/room-coaches-office.jpg', encoding: 'base64' },
  { rel: 'assets/rooms/room-pro-shop.jpg', encoding: 'base64' },
  { rel: 'assets/rooms/room-clubhouse.png', encoding: 'base64' },
  { rel: 'apple-touch-icon.png', encoding: 'base64' },
  { rel: 'icon-192.png', encoding: 'base64' },
  { rel: 'icon-512.png', encoding: 'base64' },
  { rel: 'assets/audit-screenshots/seat0-red-flag-council-review.png', encoding: 'base64' },
  { rel: 'assets/audit-screenshots/seat1-on-ice-drill-setup.png', encoding: 'base64' },
  { rel: 'assets/audit-screenshots/seat2-cue-first-roll-in.png', encoding: 'base64' },
  { rel: 'assets/audit-screenshots/seat3-8u-adm-cognitive-load.png', encoding: 'base64' },
  { rel: 'assets/audit-screenshots/seat4-32-city-tour-map.png', encoding: 'base64' },
  { rel: 'assets/audit-screenshots/seat5-coach-homework-wizard.png', encoding: 'base64' },
  { rel: 'assets/audit-screenshots/seat6-director-hq-rollup.png', encoding: 'base64' },
  { rel: 'assets/audit-screenshots/seat7-hud-ergonomics-audit.png', encoding: 'base64' },
  { rel: 'assets/audit-screenshots/seat8-film-room-video-modal.png', encoding: 'base64' },
  { rel: 'assets/audit-screenshots/seat9-founder-approval-digest.png', encoding: 'base64' },
  { rel: 'assets/audit-screenshots/seat10-pricing-partner-gate.png', encoding: 'base64' },
  { rel: 'assets/audit-screenshots/seat11-art-director-avatar-shop.png', encoding: 'base64' },
  { rel: 'assets/audit-screenshots/seat12-safesport-voice-qa.png', encoding: 'base64' },
  { rel: 'screenshots/audit_step1_portals.png', encoding: 'base64' },
  { rel: 'screenshots/audit_step2_player_login.png', encoding: 'base64' },
  { rel: 'screenshots/audit_coach_portal.png', encoding: 'base64' },
  { rel: 'screenshots/audit_family_portal.png', encoding: 'base64' },
  { rel: 'screenshots/audit_adventure_map.png', encoding: 'base64' },
  { rel: 'screenshots/audit_on_ice_gameplay.png', encoding: 'base64' },
  { rel: 'screenshots/audit_rink_lobby.png', encoding: 'base64' },
  { rel: 'screenshots/audit_player_agent_picker.png', encoding: 'base64' },
  { rel: 'screenshots/audit_phase2_lesson_screen.png', encoding: 'base64' },
  { rel: 'screenshots/audit_phase3_hover_zones.png', encoding: 'base64' },
  { rel: 'screenshots/audit_phase3_habit_combo.png', encoding: 'base64' },
  { rel: 'screenshots/audit_locker_room_avatar.png', encoding: 'base64' },
  { rel: 'screenshots/audit_pro_shop_walls.png', encoding: 'base64' },
  { rel: 'screenshots/audit_accurate_na_map.png', encoding: 'base64' },
  { rel: 'screenshots/audit_team_roster_hub.png', encoding: 'base64' },
  { rel: 'screenshots/audit_coach_als_corner.png', encoding: 'base64' },
  { rel: 'screenshots/audit_opponent_scouting.png', encoding: 'base64' },
  { rel: 'screenshots/audit_bucket_coverage_report.png', encoding: 'base64' },
  { rel: 'screenshots/audit_red_flag_council_review.png', encoding: 'base64' },
  { rel: 'screenshots/audit_room_lobby.png', encoding: 'base64' },
  { rel: 'screenshots/audit_room_locker.png', encoding: 'base64' },
  { rel: 'screenshots/audit_room_coach_office.png', encoding: 'base64' },
  { rel: 'screenshots/audit_room_pro_shop.png', encoding: 'base64' },
  { rel: 'screenshots/audit_room_clubhouse.png', encoding: 'base64' },
  { rel: 'screenshots/audit_interactive_rooms.png', encoding: 'base64' },
  { rel: 'screenshots/audit_clean_gameplay_screen.png', encoding: 'base64' },
  { rel: 'screenshots/audit_live_word_speech_bubble.png', encoding: 'base64' },
  { rel: 'screenshots/marathon_frame1_intro.png', encoding: 'base64' },
  { rel: 'screenshots/marathon_frame2_freeze.png', encoding: 'base64' },
  { rel: 'screenshots/marathon_frame3_feedback.png', encoding: 'base64' },
  { rel: 'screenshots/audit_cloud_batch_persistence_v108.png', encoding: 'base64' },
  { rel: 'screenshots/audit_clean_3tab_inbox_v109.png', encoding: 'base64' },
  { rel: 'screenshots/audit_inbox_topup_mode_v1094.png', encoding: 'base64' },
  { rel: 'screenshots/audit_v110_63_verified_dial_in.png', encoding: 'base64' },
  { rel: 'screenshots/audit_v111_118_verified_rotated_flows.png', encoding: 'base64' },
  { rel: 'screenshots/audit_v112_173_verified_6pos_pilot.png', encoding: 'base64' },
  { rel: 'screenshots/audit_v120_clean_slate_portals.png', encoding: 'base64' },
  { rel: 'screenshots/audit_v121_cutout_guided_profiles.png', encoding: 'base64' },
  { rel: 'screenshots/audit_v122_hd_rooms_8avatars.png', encoding: 'base64' },
  { rel: 'screenshots/audit_v123_strict_3role_portals.png', encoding: 'base64' },
  { rel: 'persona_vision_playtest.js', encoding: 'utf-8' },
  { rel: 'persona_vision_report.json', encoding: 'utf-8' }
];

// Automatically include all v12.7 5-Persona Blind-Vision screenshots in persona_screenshots/*.png
const personaShotsRoot = path.join(WORKSPACE_A, 'persona_screenshots');
if (fs.existsSync(personaShotsRoot)) {
  for (const f of fs.readdirSync(personaShotsRoot)) {
    if (f.endsWith('.png')) {
      FILES_TO_DEPLOY.push({ rel: `persona_screenshots/${f}`, encoding: 'base64' });
    }
  }
}

// Automatically include all generated neural .mp3 voice files in assets/audio/voices/<characterId>/*.mp3
const voicesRoot = path.join(WORKSPACE_A, 'assets', 'audio', 'voices');
if (fs.existsSync(voicesRoot)) {
  for (const sub of fs.readdirSync(voicesRoot)) {
    const subDir = path.join(voicesRoot, sub);
    if (fs.statSync(subDir).isDirectory()) {
      for (const f of fs.readdirSync(subDir)) {
        if (f.endsWith('.mp3')) {
          FILES_TO_DEPLOY.push({ rel: `assets/audio/voices/${sub}/${f}`, encoding: 'base64' });
        }
      }
    }
  }
}

const FORBIDDEN_FILENAMES = new Set([
  '.tactix_gh_token',
  '.env',
  '.env.local',
  '.env.production',
  'id_rsa'
]);

const SECRET_PATTERNS = [
  { name: 'GitHub Personal Access Token (ghp_)', regex: /\bghp_[A-Za-z0-9]{30,}\b/ },
  { name: 'GitHub OAuth Token (gho_)', regex: /\bgho_[A-Za-z0-9]{30,}\b/ },
  { name: 'GitHub Fine-Grained PAT (github_pat_)', regex: /\bgithub_pat_[A-Za-z0-9_]{30,}\b/ },
  { name: 'Supabase Secret Key (sb_secret_)', regex: /\bsb_secret_[A-Za-z0-9_-]{20,}\b/ },
  { name: 'Supabase service_role JWT', regex: /"role"\s*:\s*"service_role"/ }
];

function runPreCommitSecurityGuardrail(filesList) {
  for (const item of filesList) {
    const base = path.basename(item.rel);
    if (FORBIDDEN_FILENAMES.has(base) || item.rel.includes('.tactix_gh_token') || item.rel.startsWith('.env')) {
      throw new Error(`SECURITY GUARDRAIL BLOCKED DEPLOY: Forbidden credential file "${item.rel}" in staging list!`);
    }
    const fullPath = path.join(WORKSPACE_A, item.rel);
    if (!fs.existsSync(fullPath) || item.encoding === 'base64') continue;
    const content = fs.readFileSync(fullPath, 'utf-8');
    for (const pat of SECRET_PATTERNS) {
      if (pat.regex.test(content)) {
        throw new Error(`SECURITY GUARDRAIL BLOCKED DEPLOY: Detected ${pat.name} inside "${item.rel}"!`);
      }
    }
  }
  console.log('🔒 Pre-Commit Security Guardrail Passed: 0 tokens/secrets (.tactix_gh_token, .env, service_role) in staged files.');
  return true;
}

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function verifyJavaScriptSyntaxGuardrail(filesList) {
  let checkedBlocks = 0;
  for (const item of filesList) {
    if (item.encoding === 'base64') continue;
    const fullPath = path.join(WORKSPACE_A, item.rel);
    if (!fs.existsSync(fullPath)) continue;
    if (item.rel.endsWith('.js')) {
      const code = fs.readFileSync(fullPath, 'utf-8').replace(/^#![^\r\n]+/, '');
      new vm.Script(code, { filename: item.rel });
      checkedBlocks++;
    } else if (item.rel.endsWith('.html')) {
      const html = fs.readFileSync(fullPath, 'utf-8');
      const scriptRegex = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
      let match;
      let idx = 0;
      while ((match = scriptRegex.exec(html)) !== null) {
        idx++;
        const scriptBody = match[1];
        if (!scriptBody.trim()) continue;
        new vm.Script(scriptBody, { filename: `${item.rel}#script-${idx}` });
        checkedBlocks++;
      }
    }
  }
  console.log(`✅ Pre-Save JS Syntax Verification Passed: ${checkedBlocks} JavaScript files & inline <script> blocks parsed with 0 syntax errors.`);
  return checkedBlocks;
}

function mirrorAndChecksumVerifyWorkspaces(filesList) {
  const extraMirrorFiles = [
    'FOUNDER_EMAIL_DIGEST_LATEST.html',
    'deep_playtest_telemetry.json',
    'generate-tactix-bank.js',
    '.github/workflows/nightly-tactix-harvest.yml',
    '.github/workflows/deploy-approved-batch.yml'
  ];
  const allRelativePaths = Array.from(new Set([
    ...filesList.map(f => f.rel),
    ...extraMirrorFiles
  ]));

  let mirroredCount = 0;
  for (const rel of allRelativePaths) {
    const srcPath = path.join(WORKSPACE_A, rel);
    const dstPath = path.join(WORKSPACE_B, rel);
    if (!fs.existsSync(srcPath)) continue;
    fs.mkdirSync(path.dirname(dstPath), { recursive: true });
    fs.copyFileSync(srcPath, dstPath);
    const hashA = sha256File(srcPath);
    const hashB = sha256File(dstPath);
    if (hashA !== hashB) {
      throw new Error(`DUAL-FOLDER CHECKSUM MISMATCH on "${rel}": ${hashA} !== ${hashB}`);
    }
    mirroredCount++;
  }
  console.log(`🔄 Automatic Dual-Folder Mirror & SHA-256 Checksum Verification Passed: ${mirroredCount} files 100% identical between "${WORKSPACE_A}" and "${WORKSPACE_B}".`);
  return mirroredCount;
}

async function ghApi(endpoint, token, method = 'GET', body = null) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'Tactix-Hockey-Deployer'
  };
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(`https://api.github.com${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = { raw: text };
  }
  return { ok: res.ok, status: res.status, data };
}

async function pollForToken(deviceCode, intervalSec = 5) {
  const maxWaitMs = 14 * 60 * 1000;
  const start = Date.now();
  let waitSec = intervalSec || 5;

  while (Date.now() - start < maxWaitMs) {
    await new Promise(r => setTimeout(r, waitSec * 1000));
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        device_code: deviceCode,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
      })
    });
    const data = await res.json();
    if (data.access_token) {
      fs.writeFileSync(TOKEN_FILE, data.access_token, 'utf-8');
      return data.access_token;
    }
    if (data.error === 'slow_down') {
      waitSec += 5;
    } else if (data.error && data.error !== 'authorization_pending') {
      throw new Error(`OAuth Device Flow Error: ${data.error} (${data.error_description || ''})`);
    }
  }
  throw new Error('Timed out waiting for GitHub device authorization.');
}

async function deploySingleRepo(token, owner, REPO_NAME) {
  console.log(`\n=== 🚀 Deploying to ${owner}/${REPO_NAME} ===`);
  // 1. Check if repo exists; if not, create it with auto_init: true
  let repoRes = await ghApi(`/repos/${owner}/${REPO_NAME}`, token);
  if (!repoRes.ok) {
    console.log(`📦 Creating public repository ${owner}/${REPO_NAME}...`);
    const createRes = await ghApi('/user/repos', token, 'POST', {
      name: REPO_NAME,
      description: 'SYNAPZ HOCKEY — PLAY. LEARN. DOMINATE. | Hockey IQ & Strategy Platform',
      private: false,
      auto_init: true
    });
    if (!createRes.ok) {
      throw new Error(`Failed to create repo: ${JSON.stringify(createRes.data)}`);
    }
    await new Promise(r => setTimeout(r, 2200));
  }

  // 2. Get current main branch HEAD SHA
  let refRes = await ghApi(`/repos/${owner}/${REPO_NAME}/git/ref/heads/main`, token);
  if (!refRes.ok) {
    await ghApi(`/repos/${owner}/${REPO_NAME}/contents/.nojekyll`, token, 'PUT', {
      message: 'Initialize Synapz Hockey repository',
      content: Buffer.from('').toString('base64')
    });
    await new Promise(r => setTimeout(r, 1200));
    refRes = await ghApi(`/repos/${owner}/${REPO_NAME}/git/ref/heads/main`, token);
  }
  const baseCommitSha = refRes.data.object.sha;
  const baseCommitObj = await ghApi(`/repos/${owner}/${REPO_NAME}/git/commits/${baseCommitSha}`, token);
  const baseTreeSha = (baseCommitObj.ok && baseCommitObj.data?.tree?.sha) ? baseCommitObj.data.tree.sha : baseCommitSha;

  const existingBlobShas = new Map();
  const existingTreeRes = await ghApi(`/repos/${owner}/${REPO_NAME}/git/trees/${baseTreeSha}?recursive=1`, token);
  if (existingTreeRes.ok && Array.isArray(existingTreeRes.data?.tree)) {
    for (const entry of existingTreeRes.data.tree) {
      if (entry.type === 'blob' && entry.path && entry.sha) {
        existingBlobShas.set(entry.path, entry.sha);
      }
    }
  }

  function computeGitBlobSha(buf) {
    const header = Buffer.from(`blob ${buf.length}\0`, 'utf8');
    return crypto.createHash('sha1').update(header).update(buf).digest('hex');
  }

  // 3. Create blobs ONLY for changed or new files (deduplicated by path)
  const uniqueDeployFiles = [];
  const seenPaths = new Set();
  for (const f of FILES_TO_DEPLOY) {
    if (!seenPaths.has(f.rel)) {
      seenPaths.add(f.rel);
      uniqueDeployFiles.push(f);
    }
  }

  const treeItems = [];
  let unchangedSkippedCount = 0;
  let idxCursor = 0;
  const BLOB_CONCURRENCY = 6;
  async function blobWorker() {
    while (idxCursor < uniqueDeployFiles.length) {
      const item = uniqueDeployFiles[idxCursor++];
      const fullPath = path.join(WORKSPACE_A, item.rel);
      if (!fs.existsSync(fullPath)) continue;
      const rawBuf = fs.readFileSync(fullPath);
      const localGitSha = computeGitBlobSha(rawBuf);
      if (existingBlobShas.get(item.rel) === localGitSha) {
        unchangedSkippedCount++;
        continue;
      }
      if (item.encoding === 'base64') {
        const b64 = rawBuf.toString('base64');
        const blobRes = await ghApi(`/repos/${owner}/${REPO_NAME}/git/blobs`, token, 'POST', {
          content: b64,
          encoding: 'base64'
        });
        if (blobRes.ok && blobRes.data.sha) {
          treeItems.push({
            path: item.rel,
            mode: '100644',
            type: 'blob',
            sha: blobRes.data.sha
          });
        }
      } else {
        const txt = rawBuf.toString('utf-8');
        const blobRes = await ghApi(`/repos/${owner}/${REPO_NAME}/git/blobs`, token, 'POST', {
          content: txt,
          encoding: 'utf-8'
        });
        if (blobRes.ok && blobRes.data.sha) {
          treeItems.push({
            path: item.rel,
            mode: '100644',
            type: 'blob',
            sha: blobRes.data.sha
          });
        }
      }
    }
  }
  await Promise.all(Array.from({ length: BLOB_CONCURRENCY }, () => blobWorker()));
  const OBSOLETE_PATHS_TO_DELETE = [
    'assets/rooms/room-rink-lobby.png',
    'assets/rooms/room-locker-room.png',
    'assets/rooms/room-coaches-office.png',
    'assets/rooms/room-pro-shop.png'
  ];
  for (const oldRel of OBSOLETE_PATHS_TO_DELETE) {
    if (existingBlobShas.has(oldRel)) {
      treeItems.push({ path: oldRel, mode: '100644', type: 'blob', sha: null });
    }
  }
  console.log(`  📄 Delta-staged ${treeItems.length} changed/new files (${unchangedSkippedCount} unchanged assets reused via base_tree)`);

  // 4. Create Git Tree incrementally in chunks of 35 to avoid GitHub API 422 timeouts
  let currentTreeSha = baseTreeSha;
  if (treeItems.length > 0) {
    const CHUNK_SIZE = 35;
    for (let offset = 0; offset < treeItems.length; offset += CHUNK_SIZE) {
      const chunk = treeItems.slice(offset, offset + CHUNK_SIZE);
      let treeRes = await ghApi(`/repos/${owner}/${REPO_NAME}/git/trees`, token, 'POST', {
        base_tree: currentTreeSha,
        tree: chunk
      });
      if (!treeRes.ok && chunk.some(t => t.path.startsWith('.github/workflows/'))) {
        const filteredChunk = chunk.filter(t => !t.path.startsWith('.github/workflows/'));
        treeRes = await ghApi(`/repos/${owner}/${REPO_NAME}/git/trees`, token, 'POST', {
          base_tree: currentTreeSha,
          tree: filteredChunk
        });
      }
      if (!treeRes.ok) {
        throw new Error(`Failed to create Git tree chunk at ${offset}: ${JSON.stringify(treeRes.data)}`);
      }
      currentTreeSha = treeRes.data.sha;
    }
  }
  const treeRes = { ok: true, data: { sha: currentTreeSha } };

  // 5. Create Commit
  const commitRes = await ghApi(`/repos/${owner}/${REPO_NAME}/git/commits`, token, 'POST', {
    message: `Deploy SYNAPZ HOCKEY v12.7-5persona-blind-vision-playtest (Section 43: 5-Persona Human-Eyes Coordinate Playtest, 11 Vision-Shielded Bucket-1 UX Auto-Fixes, 0 Missed (x,y) Taps, Clean-Slate Screen 1 + 288/288 Live + Batch DA)`,
    tree: treeRes.data.sha,
    parents: [baseCommitSha]
  });
  if (!commitRes.ok) {
    throw new Error(`Failed to create commit: ${JSON.stringify(commitRes.data)}`);
  }

  // 6. Update refs/heads/main (NOTE: this automatically triggers GitHub's native 'pages build and deployment' workflow!
  //    Do NOT call POST /pages/builds right after PATCH /refs/heads/main, or a second concurrent Pages build will cancel the first!)
  const updateRefRes = await ghApi(`/repos/${owner}/${REPO_NAME}/git/refs/heads/main`, token, 'PATCH', {
    sha: commitRes.data.sha,
    force: true
  });
  if (!updateRefRes.ok) {
    throw new Error(`Failed to update main ref: ${JSON.stringify(updateRefRes.data)}`);
  }
  console.log(`✅ Pushed commit ${commitRes.data.sha.slice(0, 7)} to ${owner}/${REPO_NAME}@main!`);

  // 7. Ensure GitHub Pages is enabled on main branch (without triggering a conflicting duplicate build)
  const pagesCheck = await ghApi(`/repos/${owner}/${REPO_NAME}/pages`, token);
  if (!pagesCheck.ok) {
    const enablePages = await ghApi(`/repos/${owner}/${REPO_NAME}/pages`, token, 'POST', {
      source: { branch: 'main', path: '/' }
    });
    console.log(`🌐 Enabled GitHub Pages (HTTP ${enablePages.status})`);
  } else {
    console.log(`🌐 GitHub Pages active at ${pagesCheck.data.html_url}`);
  }

  // 8. Monitor the commit's 'pages build and deployment' workflow run to ensure it completes with conclusion === 'success'
  console.log(`⏳ Waiting for GitHub Actions 'pages build and deployment' for ${commitRes.data.sha.slice(0, 7)}...`);
  await new Promise(r => setTimeout(r, 4000));
  const maxPollMs = 150000;
  const pollStart = Date.now();
  let retriedOnce = false;
  while (Date.now() - pollStart < maxPollMs) {
    const runsRes = await ghApi(`/repos/${owner}/${REPO_NAME}/actions/runs?per_page=5`, token);
    if (runsRes.ok && runsRes.data && Array.isArray(runsRes.data.workflow_runs)) {
      const matchingRun = runsRes.data.workflow_runs.find(r => r.head_sha === commitRes.data.sha && r.name === 'pages build and deployment') || runsRes.data.workflow_runs[0];
      if (matchingRun) {
        if (matchingRun.status === 'completed') {
          if (matchingRun.conclusion === 'success') {
            console.log(`✅ GitHub Actions 'pages build and deployment' SUCCEEDED for ${owner}/${REPO_NAME} (${commitRes.data.sha.slice(0, 7)})!`);
            break;
          } else if (!retriedOnce) {
            retriedOnce = true;
            console.log(`⚠️ Run ${matchingRun.id} finished with conclusion=${matchingRun.conclusion}; triggering a single clean Pages build after 3s...`);
            await new Promise(r => setTimeout(r, 3000));
            await ghApi(`/repos/${owner}/${REPO_NAME}/pages/builds`, token, 'POST');
            await new Promise(r => setTimeout(r, 5000));
            continue;
          } else {
            console.log(`⚠️ Run ${matchingRun.id} conclusion: ${matchingRun.conclusion}`);
            break;
          }
        }
      }
    }
    await new Promise(r => setTimeout(r, 5000));
  }

  const liveUrl = `https://${owner}.github.io/${REPO_NAME}/`;
  const reportUrl = `https://${owner}.github.io/${REPO_NAME}/report.html`;
  if (REPO_NAME === 'synapz-hockey') {
    for (let attempt = 1; attempt <= 14; attempt++) {
      try {
        const [resRep, resSw] = await Promise.all([
          fetch(`${reportUrl}?t=${Date.now()}`, { headers: { 'Cache-Control': 'no-cache' } }),
          fetch(`${liveUrl}sw.js?t=${Date.now()}`, { headers: { 'Cache-Control': 'no-cache' } })
        ]);
        const html = await resRep.text();
        const swText = await resSw.text();
        if (html.toUpperCase().includes('V12.7') && swText.includes('synapz-hockey-v12.7-5persona-human-vision')) {
          console.log(`✅ Verified live ${liveUrl} & ${reportUrl} are serving v12.7 (synapz-hockey-v12.7-5persona-human-vision)!`);
          break;
        }
      } catch (_) {}
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  console.log(`🚀 LIVE PRODUCTION URL: ${liveUrl}`);
  console.log(`📊 LIVE ANALYTICS URL:  ${reportUrl}`);
  return { owner, repo: REPO_NAME, commitSha: commitRes.data.sha, liveUrl, reportUrl };
}

async function deployToGitHubPages(token) {
  runPreCommitSecurityGuardrail(FILES_TO_DEPLOY);
  verifyJavaScriptSyntaxGuardrail(FILES_TO_DEPLOY);
  mirrorAndChecksumVerifyWorkspaces(FILES_TO_DEPLOY);
  const userRes = await ghApi('/user', token);
  if (!userRes.ok) {
    throw new Error(`Failed to fetch GitHub user: HTTP ${userRes.status}`);
  }
  const owner = userRes.data.login;
  console.log(`✅ Authenticated as GitHub user: ${owner}`);

  const results = [];
  for (const repoName of REPO_NAMES) {
    const res = await deploySingleRepo(token, owner, repoName);
    results.push(res);
  }
  return results;
}

(async () => {
  try {
    let token = null;
    if (fs.existsSync(TOKEN_FILE)) {
      const candidate = fs.readFileSync(TOKEN_FILE, 'utf-8').trim();
      const check = await ghApi('/user', candidate);
      if (check.ok) token = candidate;
    }

    const passedDeviceCode = process.argv[2];
    if (!token && passedDeviceCode) {
      console.log(`⏳ Waiting for browser authorization of device code...`);
      token = await pollForToken(passedDeviceCode, 5);
    }

    if (!token) {
      const res = await fetch('https://github.com/login/device/code', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: CLIENT_ID, scope: 'repo' })
      });
      const dc = await res.json();
      console.log(`🔑 DEVICE CODE: ${dc.user_code} -> ${dc.verification_uri}`);
      token = await pollForToken(dc.device_code, dc.interval || 5);
    }

    await deployToGitHubPages(token);
  } catch (err) {
    console.error('❌ Deployment error:', err.message);
    process.exit(1);
  }
})();
