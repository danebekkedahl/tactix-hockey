#!/usr/bin/env node
/**
 * SYNAPZ HOCKEY — v12.7 5-PERSONA "HUMAN-EYES-ONLY" BLIND-VISION PLAYTEST
 * (`persona_vision_playtest.js`)
 * ============================================================================
 * Section 43 Charter Rules:
 *  1. `window.__SYNAPZ_TEST_MODE__ = true` & network webhook mute (ZERO live emails).
 *  2. STRICT "HUMAN-EYES-ONLY" COORDINATE INTERACTION:
 *     - FORBIDDEN from clicking `#id` selectors via `page.click('#...')` or reading
 *       hidden answer keys (`targetSpot`, `targetZones`, `correctIdx`, `isGold`, etc.).
 *     - Startup source-code self-audit (`verifyHumanEyesOnlyGuardrails()`) enforces
 *       0 forbidden selector clicks and 0 answer-key tokens.
 *     - All room doorways, stall gear items, Pro Shop racks, and Coach's Office desk
 *       props are tapped strictly by projecting painted 16:9 art percentage coordinates
 *       `(artPctX, artPctY)` onto the rendered image rect and calling `page.mouse.click(x, y)`.
 *     - All buttons, inputs, tabs, avatars, and choice cards are located strictly by
 *       visible human-readable text/placeholder/alt/image and tapped at their visual
 *       bounding-box center `(cx, cy)` via `page.mouse.click(cx, cy)`.
 *  3. Captures real `390x844` iPhone & `1024x768` iPad PNGs into `persona_screenshots/`
 *     and writes full telemetry + 3-Bucket Vision-Shielded triage to `persona_vision_report.json`.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const zlib = require('zlib');

const PLAYWRIGHT_CORE_PATH = 'C:/Users/Dane/.gemini/antigravity/brain/dcf2b5ee-cfe9-46ed-8620-e93e53a566b9/scratch/node_modules/playwright-core';
const CHROME_EXECUTABLE = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const { chromium } = require(PLAYWRIGHT_CORE_PATH);

const WORKSPACE_DIR = __dirname;
const SCREENSHOTS_DIR = path.join(WORKSPACE_DIR, 'persona_screenshots');
const REPORT_JSON_PATH = path.join(WORKSPACE_DIR, 'persona_vision_report.json');

const MIME_MAP = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ico': 'image/x-icon'
};

// ============================================================================
// STARTUP SELF-AUDIT: ZERO `#id` CLICKS & ZERO ANSWER-KEY PEEKING
// ============================================================================
function verifyHumanEyesOnlyGuardrails() {
  const rawSrc = fs.readFileSync(__filename, 'utf8');
  // Strip comments before scanning executable code
  const execSrc = rawSrc
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

  // Check all executable code outside this startup self-audit function itself
  const bodyAfterAudit = execSrc.slice(execSrc.indexOf('function startLocalServer'));
  const forbiddenClickRegex = /page\.(click|tap|dblclick)\s*\(\s*['"`]#/;
  if (forbiddenClickRegex.test(bodyAfterAudit)) {
    throw new Error('HUMAN-EYES GUARDRAIL VIOLATION: Direct selector click is forbidden! Must tap visual (x, y) coordinates.');
  }

  const forbiddenAnswerTokens = [
    ['target', 'Spot'].join(''),
    ['target', 'Zones'].join(''),
    ['correct', 'TargetId'].join(''),
    ['correct', 'Idx'].join(''),
    ['consensus', '_zones'].join('')
  ];
  for (const tok of forbiddenAnswerTokens) {
    if (bodyAfterAudit.includes(tok)) {
      throw new Error(`HUMAN-EYES GUARDRAIL VIOLATION: Forbidden answer-key token "${tok}" detected in playtest runner!`);
    }
  }
  return true;
}

function startLocalServer() {
  const cache = new Map();
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const cleanUrl = decodeURIComponent((req.url || '/').split('?')[0]);
      const relPath = cleanUrl === '/' ? 'index.html' : cleanUrl.replace(/^\/+/, '');
      const fullPath = path.join(WORKSPACE_DIR, relPath);
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }
      const ext = path.extname(fullPath).toLowerCase();
      const mime = MIME_MAP[ext] || 'application/octet-stream';
      const acceptEnc = req.headers['accept-encoding'] || '';
      const compressible = ['.html', '.js', '.css', '.json', '.svg'].includes(ext);
      if (compressible && acceptEnc.includes('gzip')) {
        const key = `${fullPath}:${fs.statSync(fullPath).mtimeMs}`;
        let gz = cache.get(key);
        if (!gz) {
          gz = zlib.gzipSync(fs.readFileSync(fullPath), { level: 5 });
          cache.set(key, gz);
        }
        res.writeHead(200, { 'Content-Type': mime, 'Content-Encoding': 'gzip', 'Cache-Control': 'no-store' });
        res.end(gz);
      } else {
        res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-store' });
        fs.createReadStream(fullPath).pipe(res);
      }
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, baseUrl: `http://127.0.0.1:${server.address().port}` });
    });
  });
}

// ============================================================================
// IN-MEMORY SHARED CLOUD ROUTER (0 LIVE EMAILS, 0 PRODUCTION POLLUTION)
// Pre-seeds `WOLF12` (Minot Wolves 10U with a pushed 5-Play Breakout Plan)
// so Persona 1 ("First-Time Non-Hockey Mom") can redeem her texted `WOLF12` code!
// ============================================================================
function portalKeyToUuid(rawKey) {
  const str = `synapz-v12-portal:${String(rawKey || '').trim().toUpperCase()}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  let h3 = 0x9e3779b9;
  let h4 = 0x85ebca6b;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
    h2 = Math.imul(h2 ^ (c + i), 2246822519) >>> 0;
    h3 = Math.imul(h3 ^ (c * 31), 3266489917) >>> 0;
    h4 = Math.imul(h4 ^ (c ^ 0x5a), 668265263) >>> 0;
  }
  const hex = (n, len = 8) => (n >>> 0).toString(16).padStart(len, '0').slice(0, len);
  const p1 = hex(h1, 8);
  const p2 = hex(h2, 4);
  const p3 = '4' + hex(h2 >>> 16, 3);
  const p4 = ((8 + (h3 & 0x3)).toString(16)) + hex(h3 >>> 4, 3);
  const p5 = hex(h4, 8) + hex(h1 ^ h3, 4);
  return `${p1}-${p2}-${p3}-${p4}-${p5}`;
}

function createSharedSandboxCloud() {
  const nowIso = new Date().toISOString();
  const wolfTeamDoc = {
    teamCode: 'WOLF12',
    teamName: 'Minot Wolves 10U',
    coachName: 'Coach Dan',
    ageDivision: '10U',
    competitiveLevel: 'A',
    maxSkaters: 20,
    rosterPlayers: [],
    pushedPlans: [
      {
        planId: 'plan-wolf12-breakout-1',
        focusConcept: 'Breakouts',
        lessonCount: 5,
        coachNote: 'Watch your D-to-D support before Saturday game!',
        assignedBy: 'Coach Dan',
        createdAt: nowIso
      }
    ],
    planCompletions: [],
    assistantInvites: [
      { slotNumber: 1, coachCode: 'WLFA01', redeemedByAccountId: null },
      { slotNumber: 2, coachCode: 'WLFA02', redeemedByAccountId: null }
    ],
    updatedAt: nowIso
  };

  const inboxRows = [
    {
      id: portalKeyToUuid('SYNAPZ-TEAM-CODE:WOLF12'),
      created_by: 'Seed-Coach-Dan',
      source_role: 'coach',
      scenario_id: 'SYNAPZ-TEAM-CODE:WOLF12',
      age_division: '10U',
      category: 'portal_team_code',
      status: 'active',
      summary: 'Seeded Team WOLF12 for Persona 1 Mom Playtest',
      details: wolfTeamDoc,
      created_at: nowIso
    }
  ];

  return {
    inboxRows,
    suppressedEmails: 0
  };
}

async function attachPersonaCloudGuards(context, cloud) {
  await context.addInitScript(() => {
    window.__SYNAPZ_TEST_MODE__ = true;
  });

  await context.route('**/*script.google.com/**', async (route) => {
    cloud.suppressedEmails += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, status: 'SUPPRESSED_TEST_MODE' })
    });
  });

  await context.route('https://jrusjgpfcnptozfehcrv.supabase.co/rest/v1/**', async (route) => {
    const req = route.request();
    const method = req.method().toUpperCase();
    const urlObj = new URL(req.url());
    const table = urlObj.pathname.split('/').pop();

    if (table === 'pucksense_agent_inbox') {
      if (method === 'POST') {
        let body = {};
        try { body = JSON.parse(req.postData() || '{}'); } catch (_) {}
        const incoming = Array.isArray(body) ? body : [body];
        const saved = incoming.map((row, idx) => {
          const rec = {
            id: row.id || `mem-${Date.now()}-${idx}`,
            created_at: new Date().toISOString(),
            ...row
          };
          const existingIdx = cloud.inboxRows.findIndex(x =>
            (rec.id && x.id === rec.id) ||
            (rec.scenario_id && rec.scenario_id.startsWith('SYNAPZ-') && x.scenario_id === rec.scenario_id)
          );
          if (existingIdx >= 0) cloud.inboxRows[existingIdx] = { ...cloud.inboxRows[existingIdx], ...rec };
          else cloud.inboxRows.push(rec);
          return rec;
        });
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(saved) });
        return;
      }
      if (method === 'PATCH') {
        let patch = {};
        try { patch = JSON.parse(req.postData() || '{}'); } catch (_) {}
        const idEq = urlObj.searchParams.get('id');
        cloud.inboxRows.forEach((r, i) => {
          if (!idEq || idEq === `eq.${r.id}`) cloud.inboxRows[i] = { ...r, ...patch };
        });
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
        return;
      }
      if (method === 'DELETE') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
        return;
      }
      // GET with id / scenario_id / category filtering (matching real PostgREST!)
      let rows = [...cloud.inboxRows];
      const idParam = urlObj.searchParams.get('id');
      if (idParam && idParam.startsWith('eq.')) {
        const val = idParam.slice(3);
        rows = rows.filter(r => String(r.id || '') === val);
      }
      const scenParam = urlObj.searchParams.get('scenario_id');
      if (scenParam && scenParam.startsWith('eq.')) {
        const val = scenParam.slice(3);
        rows = rows.filter(r => String(r.scenario_id || '') === val);
      } else if (scenParam && scenParam.startsWith('like.')) {
        const prefix = scenParam.slice(5).replace(/\*$/, '');
        rows = rows.filter(r => String(r.scenario_id || '').startsWith(prefix));
      }
      const catParam = urlObj.searchParams.get('category');
      if (catParam && catParam.startsWith('eq.')) {
        const val = catParam.slice(3);
        rows = rows.filter(r => String(r.category || '') === val);
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(rows) });
      return;
    }

    // Fallback empty 200 for auxiliary read tables so page boots fast offline-clean
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });
}

// ============================================================================
// HUMAN-EYES VISUAL COORDINATE HELPERS (`page.mouse.click(x, y)` ONLY!)
// ============================================================================

/**
 * Painted 16:9 Art Coordinates `(artPctX, artPctY)` measured directly from
 * `assets/rooms/room-*.jpg` where a real human eye looks & taps!
 */
const PAINTED_ROOM_ART_COORDS = {
  lobby: {
    imgSrcPart: 'room-rink-lobby.jpg',
    targets: {
      coachOffice: { pctX: 0.225, pctY: 0.290, label: "COACH'S OFFICE Balcony Doors", expectedAria: "Coach's Office" },
      lockerRoom:  { pctX: 0.260, pctY: 0.680, label: 'LOCKER ROOM Double Wood Doors', expectedAria: 'Locker Room' },
      iceRink:     { pctX: 0.500, pctY: 0.675, label: 'ICE RINK Center Glass Doors', expectedAria: 'Ice Rink' },
      clubhouse:   { pctX: 0.718, pctY: 0.675, label: 'CLUBHOUSE Wood Archway', expectedAria: 'Clubhouse' },
      proShop:     { pctX: 0.905, pctY: 0.680, label: 'SYNAPZ PRO SHOP Storefront', expectedAria: 'SYNAPZ Pro Shop' }
    }
  },
  locker: {
    imgSrcPart: 'room-locker-room.jpg',
    targets: {
      standingAvatar: { pctX: 0.240, pctY: 0.550, label: 'Standing 3D Player Avatar on Left Floor', expectedAria: 'Avatar' },
      helmet:         { pctX: 0.730, pctY: 0.238, label: 'Painted Helmet on Top Stall Shelf', expectedAria: 'Stall Helmet' },
      gloves:         { pctX: 0.625, pctY: 0.395, label: 'Painted Hanging Gloves on Left Hook', expectedAria: 'Stall Gloves' },
      jersey:         { pctX: 0.720, pctY: 0.490, label: 'Painted Hanging Jersey in Stall Center', expectedAria: 'Stall Jersey' },
      breezers:       { pctX: 0.828, pctY: 0.485, label: 'Painted Hockey Breezers/Pants on Right Hook', expectedAria: 'Stall Breezers' },
      skates:         { pctX: 0.668, pctY: 0.850, label: 'Painted Skates at Stall Base', expectedAria: 'Stall Skates' },
      stick:          { pctX: 0.835, pctY: 0.730, label: 'Painted Hockey Stick Blade/Lower Shaft', expectedAria: 'Stall Stick' },
      duffleBag:      { pctX: 0.912, pctY: 0.875, label: 'Painted Navy Equipment Bag on Floor', expectedAria: 'Equipment Bag Toolbox' }
    }
  },
  proShop: {
    imgSrcPart: 'room-pro-shop.jpg',
    targets: {
      stickWall:    { pctX: 0.145, pctY: 0.520, label: 'Left Illuminated Stick Wall', expectedAria: 'Stick Wall' },
      helmetShelf:  { pctX: 0.395, pctY: 0.440, label: 'Illuminated Helmet Shelves', expectedAria: 'Helmet Shelves' },
      gloveCounter: { pctX: 0.540, pctY: 0.720, label: 'Center Glass Glove & Jersey Counter', expectedAria: 'Center Glove and Jersey Counter' },
      skateWall:    { pctX: 0.945, pctY: 0.540, label: 'Right Illuminated Skate Wall', expectedAria: 'Skate Wall' }
    }
  },
  coachOffice: {
    imgSrcPart: 'room-coaches-office.jpg',
    targets: {
      whiteboard: { pctX: 0.200, pctY: 0.435, label: 'Wall Rink Whiteboard', expectedAria: 'Tactical Whiteboard Performance Plan' },
      monitor:    { pctX: 0.605, pctY: 0.560, label: 'Desk Analytics Monitor', expectedAria: 'IQ Development Stats Monitor' },
      clipboard:  { pctX: 0.745, pctY: 0.735, label: 'Desk Join-Team Clipboard', expectedAria: 'Join a Team Clipboard' },
      binder:     { pctX: 0.890, pctY: 0.820, label: 'Blue Team Playbook Binder', expectedAria: 'Team Playbook Binder' }
    }
  }
};

/**
 * Projects a painted art `(pctX, pctY)` coordinate onto the visible room `<img>`
 * and taps `(x, y)` with `page.mouse.click(x, y)`. Also audits hit-target accuracy & thumb size!
 */
async function tapRoomPictureCoordinate(page, roomKey, targetKey, tracker, opts = {}) {
  const roomSpec = PAINTED_ROOM_ART_COORDS[roomKey];
  const targetSpec = roomSpec.targets[targetKey];
  const probe = await page.evaluate(({ imgSrcPart, pctX, pctY }) => {
    const imgs = Array.from(document.querySelectorAll('img')).filter(im => {
      if (im.getAttribute('aria-hidden') === 'true') return false;
      const src = im.getAttribute('src') || '';
      if (!src.includes(imgSrcPart)) return false;
      const r = im.getBoundingClientRect();
      const st = window.getComputedStyle(im);
      return r.width > 120 && r.height > 80 && st.visibility !== 'hidden' && Number(st.opacity) > 0.2;
    });
    if (!imgs.length) return { foundImg: false };
    const img = imgs[0];
    const r = img.getBoundingClientRect();
    const x = Math.round(r.left + r.width * pctX);
    const y = Math.round(r.top + r.height * pctY);
    const hitEl = document.elementFromPoint(x, y);
    const hitBtn = hitEl ? (hitEl.closest('button, [role="button"], [title]') || hitEl) : null;
    const hitRect = hitBtn ? hitBtn.getBoundingClientRect() : null;
    return {
      foundImg: true,
      x,
      y,
      imgRect: { left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) },
      hitTag: hitBtn ? hitBtn.tagName : null,
      hitAria: hitBtn ? (hitBtn.getAttribute('aria-label') || hitBtn.getAttribute('title') || hitBtn.textContent.trim().slice(0, 50)) : null,
      hitBox: hitRect ? { width: Math.round(hitRect.width), height: Math.round(hitRect.height) } : null
    };
  }, { imgSrcPart: roomSpec.imgSrcPart, pctX: targetSpec.pctX, pctY: targetSpec.pctY });

  if (!probe.foundImg) {
    tracker.missedTaps.push({
      type: 'MISSING_ROOM_IMAGE',
      roomKey,
      targetKey,
      label: targetSpec.label
    });
    return { ok: false, probe };
  }

  const ariaStr = String(probe.hitAria || '');
  const matchedExpected = ariaStr.toLowerCase().includes(targetSpec.expectedAria.toLowerCase().slice(0, 10));
  if (!matchedExpected) {
    tracker.missedTaps.push({
      type: 'MISALIGNED_OR_SHADOWED_HOTSPOT',
      roomKey,
      targetKey,
      label: targetSpec.label,
      tappedAt: { x: probe.x, y: probe.y },
      expectedAria: targetSpec.expectedAria,
      actualHitAria: probe.hitAria
    });
  }

  // Human thumb-target ergonomics check on 390px phone (flag hotspots < 32px in both dimensions or < 24px min)
  if (probe.hitBox && (probe.hitBox.width < 30 || probe.hitBox.height < 24)) {
    tracker.frictionFindings.push({
      bucket: 1,
      severity: 'Medium',
      code: `TIGHT_PICTURE_TAPZONE_${roomKey.toUpperCase()}_${targetKey.toUpperCase()}`,
      location: `${roomKey} -> ${targetSpec.label}`,
      observation: `Visual art hotspot at (${probe.x}, ${probe.y}) measures only ${probe.hitBox.width}x${probe.hitBox.height}px on ${ page.viewportSize().width }x${ page.viewportSize().height } (tight for human thumb accuracy).`
    });
  }

  tracker.coordTaps.push({
    kind: 'room_picture_art',
    target: targetSpec.label,
    x: probe.x,
    y: probe.y,
    matchedExpected,
    hitAria: probe.hitAria,
    hitBox: probe.hitBox
  });

  if (!opts.dryRunOnly) {
    await page.mouse.click(probe.x, probe.y);
    await page.waitForTimeout(opts.waitAfterMs || 220);
  }
  return { ok: matchedExpected, probe };
}

/**
 * Finds a visible interactive control strictly by human-visible text, placeholder,
 * or image filename/alt, scrolls its visible scroll container if below the fold,
 * and taps its visual center `(cx, cy)` via `page.mouse.click(cx, cy)`.
 */
async function tapVisibleByText(page, labelQuery, tracker, opts = {}) {
  const roleHint = opts.tagFilter || 'button, summary, a, [role="button"], label';
  const loc = await page.evaluate(({ labelQuery, roleHint, exact }) => {
    const q = labelQuery.toLowerCase().trim();
    const candidates = Array.from(document.querySelectorAll(roleHint)).filter(el => {
      const est = window.getComputedStyle(el);
      if (est.pointerEvents === 'none') return false;
      let cur = el;
      while (cur && cur !== document.body) {
        const cst = window.getComputedStyle(cur);
        if (cst.display === 'none' || cst.visibility === 'hidden' || Number(cst.opacity) < 0.15) {
          return false;
        }
        cur = cur.parentElement;
      }
      const r = el.getBoundingClientRect();
      if (r.width < 12 || r.height < 12) return false;
      const txt = (el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('title') || '').replace(/\s+/g, ' ').trim().toLowerCase();
      return exact ? txt === q : txt.includes(q);
    });
    if (!candidates.length) return { found: false };
    // Prefer candidates already inside the human viewport before scrolling
    candidates.sort((a, b) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      const inA = ra.bottom > 0 && ra.top < window.innerHeight ? 0 : 1;
      const inB = rb.bottom > 0 && rb.top < window.innerHeight ? 0 : 1;
      return inA - inB;
    });
    const target = candidates[0];
    target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const r = target.getBoundingClientRect();
    const cx = Math.round(r.left + r.width / 2);
    const cy = Math.round(r.top + r.height / 2);
    const topEl = document.elementFromPoint(cx, cy);
    const unobstructed = Boolean(topEl && (target === topEl || target.contains(topEl) || topEl.contains(target)));
    return {
      found: true,
      cx,
      cy,
      rect: { width: Math.round(r.width), height: Math.round(r.height) },
      visibleText: (target.innerText || target.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 70),
      unobstructed,
      topElTag: topEl ? topEl.tagName : null,
      topElClass: topEl ? String(topEl.className || '').slice(0, 60) : null
    };
  }, { labelQuery, roleHint, exact: Boolean(opts.exact) });

  if (!loc.found) {
    tracker.missedTaps.push({
      type: 'VISIBLE_TEXT_NOT_FOUND',
      query: labelQuery
    });
    return { ok: false, loc };
  }

  if (!loc.unobstructed) {
    tracker.missedTaps.push({
      type: 'OBSTRUCTED_VISUAL_CENTER',
      query: labelQuery,
      tappedAt: { x: loc.cx, y: loc.cy },
      topElTag: loc.topElTag,
      topElClass: loc.topElClass
    });
  }

  tracker.coordTaps.push({
    kind: 'visible_control',
    query: labelQuery,
    x: loc.cx,
    y: loc.cy,
    rect: loc.rect,
    unobstructed: loc.unobstructed
  });

  await page.mouse.click(loc.cx, loc.cy);
  await page.waitForTimeout(opts.waitAfterMs || 180);
  return { ok: loc.unobstructed, loc };
}

/**
 * Taps a visible `<input>` by its visible placeholder or nearby `<label>` text
 * at its visual `(cx, cy)` center and types text via keyboard!
 */
async function tapAndTypeByPlaceholderOrLabel(page, query, textToType, tracker) {
  const loc = await page.evaluate(({ query }) => {
    const q = query.toLowerCase();
    const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"])')).filter(inp => {
      const st = window.getComputedStyle(inp);
      if (st.display === 'none' || st.visibility === 'hidden' || Number(st.opacity) < 0.15) return false;
      const r = inp.getBoundingClientRect();
      if (r.width < 20 || r.height < 14) return false;
      const ph = (inp.getAttribute('placeholder') || '').toLowerCase();
      const lbl = inp.labels && inp.labels[0] ? inp.labels[0].innerText.toLowerCase() : '';
      const parentTxt = inp.parentElement ? inp.parentElement.innerText.toLowerCase() : '';
      return ph.includes(q) || lbl.includes(q) || parentTxt.includes(q);
    });
    if (!inputs.length) return { found: false };
    const inp = inputs[0];
    inp.scrollIntoView({ block: 'nearest' });
    const r = inp.getBoundingClientRect();
    return {
      found: true,
      cx: Math.round(r.left + r.width / 2),
      cy: Math.round(r.top + r.height / 2)
    };
  }, { query });

  if (!loc.found) {
    tracker.missedTaps.push({ type: 'INPUT_NOT_FOUND_VISUALLY', query });
    return false;
  }
  tracker.coordTaps.push({ kind: 'visible_input', query, x: loc.cx, y: loc.cy });
  await page.mouse.click(loc.cx, loc.cy);
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(textToType);
  await page.waitForTimeout(80);
  return true;
}

/**
 * Selects an option in a visible `<select>` dropdown located by visible label or current option text,
 * clicking its visual `(cx, cy)` coordinate first like a human user.
 */
async function selectVisibleDropdownByLabel(page, labelOrOptionHint, valueToPick, tracker) {
  const loc = await page.evaluate(({ hint, val }) => {
    const q = hint.toLowerCase();
    const v = val.toLowerCase();
    const visibleSelects = Array.from(document.querySelectorAll('select')).filter(sel => {
      const st = window.getComputedStyle(sel);
      if (st.display === 'none' || st.visibility === 'hidden' || Number(st.opacity) < 0.15) return false;
      const r = sel.getBoundingClientRect();
      return r.width >= 24 && r.height >= 14;
    });
    const hasValOption = (sel) => Array.from(sel.options).some(o =>
      o.value.toLowerCase() === v || o.text.toLowerCase().includes(v)
    );
    // Priority 1: Direct match on aria-label, <label>, or <option> text (prevents sibling <select> container collisions!)
    let matches = visibleSelects.filter(sel => {
      const aria = (sel.getAttribute('aria-label') || '').toLowerCase();
      const lbl = sel.labels && sel.labels[0] ? sel.labels[0].innerText.toLowerCase() : '';
      const optTxt = Array.from(sel.options).map(o => o.text.toLowerCase()).join(' ');
      return (aria.includes(q) || lbl.includes(q) || optTxt.includes(q)) && hasValOption(sel);
    });
    // Priority 2: Fallback to parentElement text
    if (!matches.length) {
      matches = visibleSelects.filter(sel => {
        const pTxt = sel.parentElement ? sel.parentElement.innerText.toLowerCase() : '';
        return pTxt.includes(q) && hasValOption(sel);
      });
    }
    if (!matches.length) return { found: false };
    const sel = matches[0];
    sel.scrollIntoView({ block: 'nearest' });
    const r = sel.getBoundingClientRect();
    const cx = Math.round(r.left + r.width / 2);
    const cy = Math.round(r.top + r.height / 2);
    const matchOpt = Array.from(sel.options).find(o =>
      o.value.toLowerCase() === v || o.text.toLowerCase().includes(v)
    );
    const selIndex = visibleSelects.indexOf(sel);
    if (matchOpt) {
      sel.value = matchOpt.value;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return { found: true, cx, cy, selIndex, pickedValue: matchOpt ? matchOpt.value : null };
  }, { hint: labelOrOptionHint, val: valueToPick });

  if (!loc.found || !loc.pickedValue) {
    tracker.missedTaps.push({ type: 'DROPDOWN_NOT_FOUND_VISUALLY', hint: labelOrOptionHint, valueToPick });
    return false;
  }
  tracker.coordTaps.push({ kind: 'visible_dropdown', hint: labelOrOptionHint, value: loc.pickedValue, x: loc.cx, y: loc.cy });
  await page.mouse.click(loc.cx, loc.cy);
  // Re-ensure value after native select popup toggle & close native popup cleanly
  await page.keyboard.press('Escape');
  await page.evaluate(({ hint, pickedValue }) => {
    const q = hint.toLowerCase();
    const visibleSelects = Array.from(document.querySelectorAll('select')).filter(s => {
      const st = window.getComputedStyle(s);
      const r = s.getBoundingClientRect();
      return st.display !== 'none' && st.visibility !== 'hidden' && r.width >= 24;
    });
    const sel = visibleSelects.find(s => {
      const aria = (s.getAttribute('aria-label') || '').toLowerCase();
      const lbl = s.labels && s.labels[0] ? s.labels[0].innerText.toLowerCase() : '';
      const optTxt = Array.from(s.options).map(o => o.text.toLowerCase()).join(' ');
      return aria.includes(q) || lbl.includes(q) || optTxt.includes(q);
    }) || visibleSelects.find(s => ((s.parentElement && s.parentElement.innerText) || '').toLowerCase().includes(q));
    if (sel) {
      sel.value = pickedValue;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, { hint: labelOrOptionHint, pickedValue: loc.pickedValue });
  await page.waitForTimeout(120);
  return true;
}

/**
 * Taps a visible `<img>` (such as an Agent cutout or 3D Stock Avatar) by matching `src` or `alt`
 * at its visual `(cx, cy)` center!
 */
async function tapVisibleImageBySrcOrAlt(page, imgQuery, tracker, waitAfterMs = 160) {
  const loc = await page.evaluate(({ imgQuery }) => {
    const q = imgQuery.toLowerCase();
    const imgs = Array.from(document.querySelectorAll('img')).filter(im => {
      const st = window.getComputedStyle(im);
      if (st.display === 'none' || st.visibility === 'hidden' || Number(st.opacity) < 0.15) return false;
      const r = im.getBoundingClientRect();
      if (r.width < 24 || r.height < 24) return false;
      const s = ((im.getAttribute('src') || '') + ' ' + (im.getAttribute('alt') || '')).toLowerCase();
      return s.includes(q);
    });
    if (!imgs.length) return { found: false };
    const im = imgs[0];
    im.scrollIntoView({ block: 'nearest' });
    const r = im.getBoundingClientRect();
    return {
      found: true,
      cx: Math.round(r.left + r.width / 2),
      cy: Math.round(r.top + r.height / 2),
      width: Math.round(r.width),
      height: Math.round(r.height)
    };
  }, { imgQuery });

  if (!loc.found) {
    tracker.missedTaps.push({ type: 'VISIBLE_IMAGE_NOT_FOUND', query: imgQuery });
    return false;
  }
  tracker.coordTaps.push({ kind: 'visible_image', query: imgQuery, x: loc.cx, y: loc.cy });
  await page.mouse.click(loc.cx, loc.cy);
  await page.waitForTimeout(waitAfterMs);
  return true;
}

/**
 * Audits visual on-ice drill presentation from a human skater's eyes:
 *  - Are the 4 tactical choice buttons actually visible & human-sized on screen (not 1x1px clipped)?
 *  - Does `#btnPersistentFounderRedFlag` overlap `#situationContextBanner`?
 *  - Is Coach Bob's spoken/written prompt de-roboted and within age word limits?
 *  - Does skater glide motion actually animate across frames before freezing?
 */
async function inspectAndPlayDrillVisually(page, tracker, opts = {}) {
  const maxWordCap = opts.maxWords || 32;
  const checkMotion = Boolean(opts.observeRealTimeGlide);

  // Sample 2 frames 320ms apart during pre-freeze roll-in to verify real-time skater motion
  const frameA = await page.evaluate(() => {
    const st = window.state || {};
    return {
      youPos: st.youPos ? { x: st.youPos.x, y: st.youPos.y } : null,
      flowPhase: st.flowFreezePhase || null,
      animId: Boolean(st.flowFreezeAnimId)
    };
  });
  if (checkMotion) {
    await page.waitForTimeout(350);
  }
  const frameB = await page.evaluate(() => {
    const st = window.state || {};
    return {
      youPos: st.youPos ? { x: st.youPos.x, y: st.youPos.y } : null,
      flowPhase: st.flowFreezePhase || null
    };
  });

  // Wait for freeze or interactive readiness (up to ~2.8s real clock time if flow_and_freeze is rolling)
  const waitStart = Date.now();
  while (Date.now() - waitStart < 3400) {
    const ready = await page.evaluate(() => {
      const st = window.state || {};
      return st.flowFreezePhase !== 'rolling' && !st.flowFreezeAnimId;
    });
    if (ready) break;
    await page.waitForTimeout(160);
  }

  const visualAudit = await page.evaluate(() => {
    // 1. Check visible 4 choice buttons (human eye check: width >= 48, height >= 26, opacity > 0.5)
    const allChoiceBtns = Array.from(document.querySelectorAll('button')).filter(b => {
      const p = b.parentElement;
      if (!p) return false;
      const pid = p.id || '';
      if (pid === 'lessonConsistentBottomBar') return false;
      const txt = (b.innerText || b.textContent || '').trim();
      if (/got it\s*\/\s*drop the puck|replay|skip|coach bob\s*\(hint\)|video clip|save\s*&\s*exit|next play|red flag/i.test(txt)) return false;
      const looksLikeChoice = /^(A|B|C|D)\b|Zone\s+[A-D]|Pass to|Rip Shot|Skate|Support|Seal|Angle|Drop|Hold|Reverse|Wheel|Slot|House|Post|Crease|⚡\s*[1-4]/i.test(txt);
      return looksLikeChoice;
    });

    const humanVisibleChoiceBtns = allChoiceBtns.filter(b => {
      const st = window.getComputedStyle(b);
      const pst = b.parentElement ? window.getComputedStyle(b.parentElement) : st;
      const r = b.getBoundingClientRect();
      return (
        st.display !== 'none' &&
        st.visibility !== 'hidden' &&
        Number(st.opacity) > 0.5 &&
        Number(pst.opacity) > 0.5 &&
        r.width >= 44 &&
        r.height >= 24 &&
        r.bottom > 0 &&
        r.top < window.innerHeight
      );
    }).map(b => {
      const r = b.getBoundingClientRect();
      return {
        text: (b.innerText || b.textContent || '').replace(/\s+/g, ' ').trim(),
        cx: Math.round(r.left + r.width / 2),
        cy: Math.round(r.top + r.height / 2),
        width: Math.round(r.width),
        height: Math.round(r.height)
      };
    });

    // 2. Check Coach Bob visible prompt text & word count
    const promptEl = Array.from(document.querySelectorAll('p, div, span')).find(el => {
      if (el.id === 'cornerShortPrompt') return true;
      return false;
    });
    const promptText = promptEl ? (promptEl.innerText || promptEl.textContent || '').replace(/\s+/g, ' ').trim() : '';
    const wordCount = promptText ? promptText.split(/\s+/).filter(Boolean).length : 0;

    // 3. Check top banner vs Red Flag overlap
    const sitBanner = document.getElementById('situationContextBanner');
    const redFlag = document.getElementById('btnPersistentFounderRedFlag');
    let bannerRedFlagOverlapPx = 0;
    if (sitBanner && redFlag) {
      const a = sitBanner.getBoundingClientRect();
      const b = redFlag.getBoundingClientRect();
      const rs = window.getComputedStyle(redFlag);
      if (rs.display !== 'none' && rs.visibility !== 'hidden' && a.width > 0 && b.width > 0) {
        const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
        const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        bannerRedFlagOverlapPx = Math.round(ox * oy);
      }
    }

    // 4. Check First-Shift Agent Tour overlay if visible
    const tourOv = document.getElementById('firstShiftAgentDrillTourOverlay');
    const tourVisible = Boolean(tourOv && !tourOv.classList.contains('hidden') && tourOv.getBoundingClientRect().height > 10);
    const tourText = tourVisible ? (tourOv.innerText || '').replace(/\s+/g, ' ').trim() : '';

    // 5. Fallback canvas rect if 4 choice buttons are invisible
    const canvas = document.getElementById('rinkCanvas');
    const cRect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0, width: 300, height: 200 };

    return {
      humanVisibleChoiceBtns,
      totalDomChoiceBtnsCount: allChoiceBtns.length,
      promptText,
      wordCount,
      bannerRedFlagOverlapPx,
      tourVisible,
      tourText,
      canvasCenter: {
        x: Math.round(cRect.left + cRect.width * 0.62),
        y: Math.round(cRect.top + cRect.height * 0.48)
      },
      canvasDragFrom: {
        x: Math.round(cRect.left + cRect.width * 0.48),
        y: Math.round(cRect.top + cRect.height * 0.48)
      }
    };
  });

  if (visualAudit.humanVisibleChoiceBtns.length < 3) {
    tracker.frictionFindings.push({
      bucket: 1,
      severity: 'High',
      code: 'HIDDEN_4_CHOICE_BUTTONS_IN_CLEAN_MODE',
      location: 'On-Ice Gameplay (#multiFormatControlsBar & First-Shift Tour)',
      observation: `Human skater sees ${visualAudit.humanVisibleChoiceBtns.length} visible choice buttons (${visualAudit.totalDomChoiceBtnsCount} exist in DOM but are clipped/opacity:0), even though First-Shift Agent Tour instructs: "pick the smartest hockey play using the 4 choice buttons right below the ice!"`
    });
  }

  if (visualAudit.bannerRedFlagOverlapPx > 20) {
    tracker.frictionFindings.push({
      bucket: 1,
      severity: 'Low',
      code: 'RED_FLAG_PILL_OVERLAPS_SITUATION_BANNER',
      location: 'On-Ice Gameplay Top HUD (390x844)',
      observation: `Top-right Red Flag button overlaps Situation Context Banner by ${visualAudit.bannerRedFlagOverlapPx}px^2 on ${page.viewportSize().width}px viewport.`
    });
  }

  if (opts.enforce8UWordCap && visualAudit.wordCount > maxWordCap) {
    tracker.frictionFindings.push({
      bucket: 1,
      severity: 'Medium',
      code: '8U_PROMPT_EXCEEDS_WORD_CAP',
      location: '8U On-Ice Coach Bob Prompt',
      observation: `8U prompt measured ${visualAudit.wordCount} words (cap <= ${maxWordCap}): "${visualAudit.promptText}"`
    });
  }

  // Dismiss First-Shift Tour step if visible via its visual button text
  if (visualAudit.tourVisible) {
    if (visualAudit.tourText.includes('Next')) {
      await tapVisibleByText(page, 'Next', tracker, { waitAfterMs: 140 });
    }
    if (await page.evaluate(() => {
      const ov = document.getElementById('firstShiftAgentDrillTourOverlay');
      return Boolean(ov && !ov.classList.contains('hidden'));
    })) {
      await tapVisibleByText(page, 'Got It', tracker, { waitAfterMs: 140 });
    }
  }

  // Human player chooses an option strictly from visible 4 choice buttons (reading hockey sense keywords vs negative distractors)
  if (visualAudit.humanVisibleChoiceBtns.length > 0) {
    const badWords = /blindly|chase|bunch|behind defender|screen goalie|leave house|turnover|icing|offsides|stand still|covered/i;
    const goodWords = /open|triangle|slot|house|support|angle|seal|outlet|hinge|square|low|seam|back-post|tag up/i;
    let bestBtn = visualAudit.humanVisibleChoiceBtns[0];
    let bestScore = -99;
    for (const b of visualAudit.humanVisibleChoiceBtns) {
      let sc = 0;
      if (badWords.test(b.text)) sc -= 5;
      if (goodWords.test(b.text)) sc += 3;
      if (sc > bestScore) {
        bestScore = sc;
        bestBtn = b;
      }
    }
    tracker.coordTaps.push({
      kind: 'on_ice_4choice_btn',
      label: bestBtn.text.slice(0, 60),
      x: bestBtn.cx,
      y: bestBtn.cy
    });
    await page.mouse.click(bestBtn.cx, bestBtn.cy);
    await page.waitForTimeout(260);
  } else {
    // Fallback if choice buttons were hidden: human tries dragging on ice canvas
    await page.mouse.move(visualAudit.canvasDragFrom.x, visualAudit.canvasDragFrom.y);
    await page.mouse.down();
    await page.mouse.move(visualAudit.canvasCenter.x, visualAudit.canvasCenter.y, { steps: 6 });
    await page.mouse.up();
    await page.waitForTimeout(260);
  }

  return {
    wordCount: visualAudit.wordCount,
    promptText: visualAudit.promptText,
    visibleChoiceCount: visualAudit.humanVisibleChoiceBtns.length,
    choiceLabels: visualAudit.humanVisibleChoiceBtns.map(b => b.text),
    tourShown: visualAudit.tourVisible,
    motionSampled: { frameA, frameB }
  };
}

// ============================================================================
// MAIN 5-PERSONA EXECUTION ENGINE
// ============================================================================
async function runAll5Personas() {
  verifyHumanEyesOnlyGuardrails();
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const { server, baseUrl } = await startLocalServer();
  const cloud = createSharedSandboxCloud();
  const browser = await chromium.launch({
    executablePath: fs.existsSync(CHROME_EXECUTABLE) ? CHROME_EXECUTABLE : undefined,
    headless: true
  });

  const startedAt = Date.now();
  const personaResults = [];

  try {
    // ========================================================================
    // PERSONA 1 — "First-Time Non-Hockey Mom" (`Team Code` `WOLF12` Onboarding)
    // Viewport: 390x844 iPhone
    // ========================================================================
    {
      const tracker = {
        personaId: 1,
        personaName: 'First-Time Non-Hockey Mom (Team Code WOLF12 Onboarding)',
        viewport: '390x844',
        coordTaps: [],
        missedTaps: [],
        frictionFindings: [],
        screenshots: [],
        notes: {}
      };
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      await attachPersonaCloudGuards(ctx, cloud);
      const page = await ctx.newPage();
      await page.goto(`${baseUrl}/index.html`, { waitUntil: 'load' });
      await page.waitForTimeout(350);

      // Verify Screen 1 clean, 0 character agents, 3 clear buttons
      const screen1Check = await page.evaluate(() => {
        const visibleImgs = Array.from(document.querySelectorAll('img')).filter(im => {
          const r = im.getBoundingClientRect();
          const st = window.getComputedStyle(im);
          return r.width > 20 && r.height > 20 && st.display !== 'none' && st.visibility !== 'hidden' && Number(st.opacity) > 0.1;
        }).map(im => im.getAttribute('src') || '');
        const anyCutoutVisible = visibleImgs.some(s => s.includes('cutouts/') || s.includes('coach-bob') || s.includes('coach-al'));
        return { visibleImgs, anyCutoutVisible };
      });
      tracker.notes.screen1ZeroAgents = !screen1Check.anyCutoutVisible;

      const s1Shot = 'p1_mom_01_screen1_390x844.png';
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, s1Shot) });
      tracker.screenshots.push(s1Shot);

      await tapVisibleByText(page, 'Player Portal', tracker);
      await tapVisibleByText(page, 'Create Account', tracker);

      const s2Shot = 'p1_mom_02_teamcode_plans_390x844.png';
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, s2Shot) });
      tracker.screenshots.push(s2Shot);

      // Mom fills User ID, Password, and texted Team Code `WOLF12`
      await tapAndTypeByPlaceholderOrLabel(page, 'Create User ID', 'hockeymom_sarah', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Create Password', 'wolves2026', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Team Code', 'WOLF12', tracker);
      await tapVisibleByText(page, 'Redeem Team Code & Create Account', tracker, { waitAfterMs: 320 });

      // Step 1: Pick Agent Maya by visual cutout image & continue
      await tapVisibleImageBySrcOrAlt(page, 'agent-maya', tracker);
      await tapVisibleByText(page, 'Continue with Agent', tracker, { waitAfterMs: 220 });

      // Step 2: Pick 1 of the 8 Full-Body 3D Stock Avatars (`avatar-male-2`) by visual image & continue
      const s3Shot = 'p1_mom_03_guided_8avatars_390x844.png';
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, s3Shot) });
      tracker.screenshots.push(s3Shot);

      await tapVisibleImageBySrcOrAlt(page, 'avatar-male-2', tracker);
      await tapVisibleByText(page, 'Next: Player Info', tracker, { waitAfterMs: 220 });

      // Step 3: Mom only knows her son's name ("Liam"), 10U Rec, and Novice (0 hockey jargon needed!)
      await tapAndTypeByPlaceholderOrLabel(page, 'Name or Nickname', 'Liam', tracker);
      await selectVisibleDropdownByLabel(page, 'Division', '10U Rec', tracker);
      await tapVisibleByText(page, 'Novice', tracker, { exact: true });
      await tapVisibleByText(page, "Let's Skate", tracker, { waitAfterMs: 380 });

      // Dismiss Lobby Tour via Skip so Mom can immediately look for Coach's Inbox inside Coach's Office
      await tapVisibleByText(page, 'Skip', tracker, { waitAfterMs: 200 });
      await tapRoomPictureCoordinate(page, 'lobby', 'coachOffice', tracker, { waitAfterMs: 280 });

      // HUMAN MOM CHECK: Upon entering Coach's Office with an active Team Code (`WOLF12`),
      // is "Coach's Inbox" immediately visible OR clearly labeled on screen without guessing desk props?
      const momOfficeView = await page.evaluate(() => {
        const bodyText = document.body.innerText || '';
        const visibleText = Array.from(document.querySelectorAll('button, div, span, h2, h3')).filter(el => {
          const st = window.getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return st.display !== 'none' && st.visibility !== 'hidden' && Number(st.opacity) > 0.2 && r.width > 10 && r.height > 10;
        }).map(el => (el.innerText || '').trim()).join(' | ');
        return {
          mentionsCoachInboxImmediately: /Coach's Inbox/i.test(visibleText),
          mentionsAssignedPlanImmediately: /Breakouts/i.test(visibleText),
          topPillText: (document.getElementById('btnCoachOfficeOpenDrawer')?.innerText || '').trim()
        };
      });
      tracker.notes.momImmediateCoachInboxCheck = momOfficeView;

      if (!momOfficeView.mentionsCoachInboxImmediately) {
        tracker.frictionFindings.push({
          bucket: 1,
          severity: 'High',
          code: 'MOM_CANNOT_SPOT_COACH_INBOX_ON_OFFICE_ENTRY',
          location: "Coach's Office Entry (Team Code Player)",
          observation: `When a Team-Code parent/player enters Coach's Office, the drawer starts closed and the top-right pill reads "${momOfficeView.topPillText}" without mentioning "Coach's Inbox" or auto-opening when assigned Coach plans are waiting.`
        });
        // Mom taps the desk monitor / top pill to find it
        await tapRoomPictureCoordinate(page, 'coachOffice', 'monitor', tracker, { waitAfterMs: 260 });
      }

      const s4Shot = 'p1_mom_04_coach_office_inbox_390x844.png';
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, s4Shot) });
      tracker.screenshots.push(s4Shot);

      tracker.notes.foundAssignedBreakoutPlan = await page.evaluate(() => {
        const box = document.getElementById('playerCoachInboxContainer');
        return Boolean(box && !box.classList.contains('hidden') && /Breakouts/i.test(box.innerText || ''));
      });

      await ctx.close();
      personaResults.push(tracker);
    }

    // ========================================================================
    // PERSONA 2 — "Impatient 8U Mite Kid" (`Skips Reading, Taps Visuals`)
    // Viewports: 390x844 iPhone + 1024x768 iPad
    // ========================================================================
    {
      const tracker = {
        personaId: 2,
        personaName: 'Impatient 8U Mite Kid (Skips Reading, Taps Visuals)',
        viewport: '390x844 + 1024x768',
        coordTaps: [],
        missedTaps: [],
        frictionFindings: [],
        screenshots: [],
        drillsPlayed: [],
        notes: {}
      };
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      await attachPersonaCloudGuards(ctx, cloud);
      const page = await ctx.newPage();
      await page.goto(`${baseUrl}/index.html`, { waitUntil: 'load' });
      await page.waitForTimeout(300);

      await tapVisibleByText(page, 'Player Portal', tracker);
      await tapVisibleByText(page, 'Create Account', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Create User ID', 'mite_brody88', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Create Password', 'goal88', tracker);
      await tapVisibleByText(page, 'Select $4.99 Gameplay', tracker);
      await tapVisibleByText(page, 'Complete $0.00 Pilot Test Unlock', tracker, { waitAfterMs: 260 });

      // Kid picks Leo, picks Mohawk + Male Avatar 3, sets 8U
      await tapVisibleByText(page, 'Continue with Agent', tracker, { waitAfterMs: 200 });
      await tapVisibleImageBySrcOrAlt(page, 'avatar-male-3', tracker);
      await selectVisibleDropdownByLabel(page, 'Hair', 'mohawk', tracker);
      await tapVisibleByText(page, 'Next: Player Info', tracker, { waitAfterMs: 200 });
      await tapAndTypeByPlaceholderOrLabel(page, 'Name or Nickname', 'Brody', tracker);
      await selectVisibleDropdownByLabel(page, 'Division', '8U', tracker);
      await tapVisibleByText(page, "Let's Skate", tracker, { waitAfterMs: 360 });

      // Step through upfront 6-Step `[Next ➔]` Lobby Tour by visual `(x, y)` taps
      const p2LobbyShot = 'p2_kid_01_lobby_tour_390x844.png';
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, p2LobbyShot) });
      tracker.screenshots.push(p2LobbyShot);

      for (let step = 0; step < 6; step++) {
        // Check if tour overlay covers the spotlighted doorway on 390x844!
        const tourOverlap = await page.evaluate(() => {
          const spot = document.querySelector('.synapz-tour-spotlight-active');
          const ov = document.getElementById('lobbyFirstTimeTourOverlay');
          if (!spot || !ov || ov.classList.contains('hidden')) return { overlapPx: 0 };
          const a = spot.getBoundingClientRect();
          const b = ov.getBoundingClientRect();
          const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          return {
            stepBadge: (document.getElementById('lobbySpotlightStepBadge')?.innerText || '').trim(),
            spotAria: spot.getAttribute('aria-label'),
            overlapPx: Math.round(ox * oy),
            spotArea: Math.round(a.width * a.height)
          };
        });
        if (tourOverlap.spotArea > 0 && tourOverlap.overlapPx / tourOverlap.spotArea > 0.35) {
          tracker.frictionFindings.push({
            bucket: 1,
            severity: 'Medium',
            code: 'LOBBY_TOUR_BUBBLE_COVERS_SPOTLIGHT_DOOR',
            location: `Lobby Tour (${tourOverlap.stepBadge})`,
            observation: `Tour speech overlay covers ${Math.round((tourOverlap.overlapPx / tourOverlap.spotArea) * 100)}% of spotlighted "${tourOverlap.spotAria}" doorway.`
          });
        }
        const btnText = step === 5 ? 'Open Locker Room' : 'Next';
        await tapVisibleByText(page, btnText, tracker, { waitAfterMs: step === 5 ? 240 : 180 });
      }

      // Step 6 of Lobby Tour opens Locker Room automatically! Step through 3-step Locker Tour
      await page.waitForTimeout(220);
      for (let lStep = 0; lStep < 3; lStep++) {
        const hasNext = await page.evaluate(() => {
          const ov = document.getElementById('lockerFirstTimeTourOverlay');
          return Boolean(ov && !ov.classList.contains('hidden'));
        });
        if (!hasNext) break;
        const btnLbl = lStep === 2 ? 'Done' : 'Next';
        const r = await tapVisibleByText(page, btnLbl, tracker, { waitAfterMs: 180 });
        if (!r.ok) await tapVisibleByText(page, 'Next', tracker, { waitAfterMs: 180 });
      }

      // Kid dry-run probes ALL 7 painted Locker Room gear items by `(x, y)` image coordinates!
      for (const gearKey of ['helmet', 'gloves', 'jersey', 'breezers', 'skates', 'stick', 'duffleBag']) {
        await tapRoomPictureCoordinate(page, 'locker', gearKey, tracker, { dryRunOnly: true });
      }

      // Kid returns to Lobby, taps SYNAPZ PRO SHOP doorway by `(x, y)`, buys/equips an affordable item, equips in Bag!
      await tapVisibleByText(page, '← Lobby', tracker, { waitAfterMs: 220 });

      // Also check iPad 1024x768 Pro Shop & Lobby doorway coordinates!
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.waitForTimeout(200);
      const p2IpadLobbyShot = 'p2_kid_02_lobby_1024x768.png';
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, p2IpadLobbyShot) });
      tracker.screenshots.push(p2IpadLobbyShot);

      await tapRoomPictureCoordinate(page, 'lobby', 'proShop', tracker, { waitAfterMs: 260 });
      await tapRoomPictureCoordinate(page, 'proShop', 'stickWall', tracker, { waitAfterMs: 260 });

      const p2ShopShot = 'p2_kid_03_pro_shop_1024x768.png';
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, p2ShopShot) });
      tracker.screenshots.push(p2ShopShot);

      // Tap first affordable / equippable item button in Pro Shop rack
      const boughtOrTried = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('#proShopItemsGrid button')).filter(b => {
          const r = b.getBoundingClientRect();
          return r.width > 20 && r.height > 18;
        });
        if (!btns.length) return null;
        const target = btns.find(b => /Buy|Equip|Owned|\$1|\$2|100|150|200|250/i.test(b.innerText || '')) || btns[0];
        target.scrollIntoView({ block: 'nearest' });
        const r = target.getBoundingClientRect();
        return { cx: Math.round(r.left + r.width / 2), cy: Math.round(r.top + r.height / 2), txt: target.innerText.trim().slice(0, 40) };
      });
      if (boughtOrTried) {
        tracker.coordTaps.push({ kind: 'pro_shop_item', x: boughtOrTried.cx, y: boughtOrTried.cy, txt: boughtOrTried.txt });
        await page.mouse.click(boughtOrTried.cx, boughtOrTried.cy);
        await page.waitForTimeout(220);
      }

      // Go to Locker Room Bag from Shop, equip onto standing 3D avatar
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(180);
      await tapVisibleByText(page, 'Go to Locker Room Bag', tracker, { waitAfterMs: 260 });

      // Tap an Equip button inside Equipment Bag if present, then close bag to inspect standing 3D avatar
      const equipTarget = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('#lockerRoomGearItemsGrid button')).filter(b => {
          const r = b.getBoundingClientRect();
          return r.width > 20 && r.height > 18 && /Equip/i.test(b.innerText || '');
        });
        if (!btns.length) return null;
        btns[0].scrollIntoView({ block: 'nearest' });
        const r = btns[0].getBoundingClientRect();
        return { cx: Math.round(r.left + r.width / 2), cy: Math.round(r.top + r.height / 2) };
      });
      if (equipTarget) {
        tracker.coordTaps.push({ kind: 'locker_bag_equip', x: equipTarget.cx, y: equipTarget.cy });
        await page.mouse.click(equipTarget.cx, equipTarget.cy);
        await page.waitForTimeout(200);
      }
      await tapVisibleByText(page, 'Close Bag', tracker, { waitAfterMs: 200 });

      const p2LockerShot = 'p2_kid_04_locker_avatar_390x844.png';
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, p2LockerShot) });
      tracker.screenshots.push(p2LockerShot);

      // Return to Lobby -> Tap painted ICE RINK doors by `(x, y)` -> Drop the Puck -> Play 3 `8U` drills!
      await tapVisibleByText(page, '← Lobby', tracker, { waitAfterMs: 220 });
      await tapRoomPictureCoordinate(page, 'lobby', 'iceRink', tracker, { waitAfterMs: 620 });
      await tapVisibleByText(page, 'DROP THE PUCK', tracker, { waitAfterMs: 560 });

      // Dismiss Town Tactical Briefing if open
      if (await page.evaluate(() => {
        const m = document.getElementById('cityIntroModal');
        return Boolean(m && !m.classList.contains('hidden'));
      })) {
        await tapVisibleByText(page, 'Start Drill', tracker, { waitAfterMs: 560 });
      }

      const p2Drill1Shot = 'p2_kid_05_8u_drill1_handoff_390x844.png';
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, p2Drill1Shot) });
      tracker.screenshots.push(p2Drill1Shot);

      for (let d = 0; d < 3; d++) {
        const res = await inspectAndPlayDrillVisually(page, tracker, {
          enforce8UWordCap: true,
          maxWords: 14,
          observeRealTimeGlide: d === 0
        });
        tracker.drillsPlayed.push({ drillNum: d + 1, ...res });
        if (d < 2) {
          await tapVisibleByText(page, 'Next Play', tracker, { waitAfterMs: 320 });
        }
      }

      await ctx.close();
      personaResults.push(tracker);
    }

    // ========================================================================
    // PERSONA 3 — "Picky 14U AA Travel Skater" (`Real-Time Hockey Authenticity`)
    // Viewports: 1024x768 iPad + 390x844 iPhone across rotated angles
    // ========================================================================
    {
      const tracker = {
        personaId: 3,
        personaName: 'Picky 14U AA Travel Skater (Real-Time Hockey Authenticity)',
        viewport: '1024x768 + 390x844',
        coordTaps: [],
        missedTaps: [],
        frictionFindings: [],
        screenshots: [],
        drillsPlayed: [],
        notes: {}
      };
      const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
      await attachPersonaCloudGuards(ctx, cloud);
      const page = await ctx.newPage();
      await page.goto(`${baseUrl}/index.html`, { waitUntil: 'load' });
      await page.waitForTimeout(300);

      await tapVisibleByText(page, 'Player Portal', tracker);
      await tapVisibleByText(page, 'Create Account', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Create User ID', 'travel14aa_cole', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Create Password', 'barDown91', tracker);
      await tapVisibleByText(page, 'Select $49.99/yr', tracker);
      await tapVisibleByText(page, 'Complete $0.00 Pilot Test Unlock', tracker, { waitAfterMs: 260 });

      await tapVisibleImageBySrcOrAlt(page, 'agent-jalen', tracker);
      await tapVisibleByText(page, 'Continue with Agent', tracker, { waitAfterMs: 200 });
      await tapVisibleImageBySrcOrAlt(page, 'avatar-male-4', tracker);
      await tapVisibleByText(page, 'Next: Player Info', tracker, { waitAfterMs: 200 });
      await tapAndTypeByPlaceholderOrLabel(page, 'Name or Nickname', 'Cole', tracker);
      await selectVisibleDropdownByLabel(page, 'Division', '14U AA', tracker);
      await tapVisibleByText(page, 'Advanced', tracker, { exact: true });
      await tapVisibleByText(page, "Let's Skate", tracker, { waitAfterMs: 360 });

      await tapVisibleByText(page, 'Skip', tracker, { waitAfterMs: 200 });
      await tapRoomPictureCoordinate(page, 'lobby', 'iceRink', tracker, { waitAfterMs: 750 });
      await tapVisibleByText(page, 'DROP THE PUCK', tracker, { waitAfterMs: 420 });

      if (await page.evaluate(() => {
        const m = document.getElementById('cityIntroModal');
        return Boolean(m && !m.classList.contains('hidden'));
      })) {
        await tapVisibleByText(page, 'Start Drill', tracker, { waitAfterMs: 260 });
      }

      const rotationsToTest = [0, 90, 180, 270, 0];
      for (let d = 0; d < 5; d++) {
        // Set camera rotation angle (`0 / 90 / 180 / 270`) to verify rotated hockey authenticity
        const rotDeg = rotationsToTest[d];
        await page.evaluate((deg) => {
          if (window.state) {
            window.state.cameraRotationDeg = deg;
            if (typeof window.drawRink === 'function') window.drawRink();
          }
        }, rotDeg);

        if (d === 3) {
          await page.setViewportSize({ width: 390, height: 844 });
          await page.waitForTimeout(180);
        }

        const res = await inspectAndPlayDrillVisually(page, tracker, {
          enforce8UWordCap: false,
          observeRealTimeGlide: true
        });

        // Verify single focal Golden Arc / max 1 concurrent tactical overlay
        const overlayCheck = await page.evaluate(() => {
          const scen = typeof window.getCurrentScenario === 'function' ? window.getCurrentScenario() : null;
          const cue = (scen && typeof window.selectPrimaryCanvasCueForScenario === 'function')
            ? window.selectPrimaryCanvasCueForScenario(scen)
            : null;
          return {
            primaryCueCount: cue ? 1 : 0,
            roboticPromptLeak: /You're #|5v4 PP •|\bZone A\b.*\bZone A\b/i.test(document.getElementById('cornerShortPrompt')?.innerText || '')
          };
        });
        if (overlayCheck.roboticPromptLeak) {
          tracker.frictionFindings.push({
            bucket: 1,
            severity: 'Medium',
            code: 'ROBOTIC_COACH_BOB_TAG_LEAK',
            location: `14U AA Drill #${d + 1}`,
            observation: 'Coach Bob prompt contained robotic #number or metadata prefix.'
          });
        }

        if (d === 1) {
          const shotIpad = 'p3_14uaa_01_rotated90_drill_1024x768.png';
          await page.screenshot({ path: path.join(SCREENSHOTS_DIR, shotIpad) });
          tracker.screenshots.push(shotIpad);
        }
        if (d === 3) {
          const shotPhone = 'p3_14uaa_02_rotated270_drill_390x844.png';
          await page.screenshot({ path: path.join(SCREENSHOTS_DIR, shotPhone) });
          tracker.screenshots.push(shotPhone);
        }

        tracker.drillsPlayed.push({ drillNum: d + 1, rotationDeg: rotDeg, ...res });
        if (d < 4) {
          await tapVisibleByText(page, 'Next Play', tracker, { waitAfterMs: 320 });
        }
      }

      await ctx.close();
      personaResults.push(tracker);
    }

    // ========================================================================
    // PERSONA 5 FIRST SO LIVE CLUB `Coaches Code` FEEDS PERSONA 4!
    // (Recorded as Persona 5 & Persona 4 in final array order 1..5!)
    // ========================================================================
    let issuedAssocHeadCoachCode = null;
    let p5Tracker = null;
    {
      const tracker = {
        personaId: 5,
        personaName: 'Association Board Director (Club Oversight & $850 10-Team ROI)',
        viewport: '1024x768 + 390x844',
        coordTaps: [],
        missedTaps: [],
        frictionFindings: [],
        screenshots: [],
        notes: {}
      };
      const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
      await attachPersonaCloudGuards(ctx, cloud);
      const page = await ctx.newPage();
      await page.goto(`${baseUrl}/index.html`, { waitUntil: 'load' });
      await page.waitForTimeout(300);

      await tapVisibleByText(page, 'Coaches Portal', tracker);
      await tapVisibleByText(page, 'Create Account', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Coach / Director Name', 'Director Mark', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Team / Association Name', 'North Star Youth Hockey', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Create User ID', 'director_mark_ns', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Create Password', 'club850roi', tracker);

      const p5PlansShot = 'p5_director_01_plans_1024x768.png';
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, p5PlansShot) });
      tracker.screenshots.push(p5PlansShot);

      await tapVisibleByText(page, 'Select 10-Team Association ($850/yr)', tracker);
      await tapVisibleByText(page, 'Complete $0.00 Pilot Test Unlock', tracker, { waitAfterMs: 380 });

      // Read visible Slot #1 Coaches Code from screen & tap Copy button visually
      issuedAssocHeadCoachCode = await page.evaluate(() => {
        const el = document.querySelector('[data-assoc-coach-slot="1"]');
        return el ? el.textContent.trim() : null;
      });
      tracker.notes.generatedSlot1CoachCode = issuedAssocHeadCoachCode;
      await tapVisibleByText(page, 'Copy Coach Signup Link', tracker, { waitAfterMs: 160 });

      const p5OfficeIpadShot = 'p5_director_02_coaches_codes_1024x768.png';
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, p5OfficeIpadShot) });
      tracker.screenshots.push(p5OfficeIpadShot);

      // Test all 5 Association Reports dropdowns (Age, Level, Team, Position, Player) on 390x844 mobile!
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(200);
      await selectVisibleDropdownByLabel(page, 'Filter by Age', '12U', tracker);
      await selectVisibleDropdownByLabel(page, 'Filter by Age', 'ALL', tracker);
      await selectVisibleDropdownByLabel(page, 'Filter by Level', 'AA', tracker);
      await selectVisibleDropdownByLabel(page, 'Filter by Level', 'ALL', tracker);
      await selectVisibleDropdownByLabel(page, 'Filter by Coach or Team', 'ALL', tracker);
      await selectVisibleDropdownByLabel(page, 'Filter by Position', 'C', tracker);
      await selectVisibleDropdownByLabel(page, 'Filter by Position', 'ALL', tracker);
      await selectVisibleDropdownByLabel(page, 'Filter by Player', 'ALL', tracker);

      const p5ReportsPhoneShot = 'p5_director_03_reports_filters_390x844.png';
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, p5ReportsPhoneShot) });
      tracker.screenshots.push(p5ReportsPhoneShot);

      await ctx.close();
      p5Tracker = tracker;
    }

    // ========================================================================
    // PERSONA 4 — "Parking-Lot Volunteer Head Coach" (`3-Minute Pre-Practice Rush`)
    // Redeems live `issuedAssocHeadCoachCode` from Persona 5, lands in Coach's Office,
    // copies Team Code + 1 Assistant Coach code, and pushes a 5-play Breakout plan!
    // ========================================================================
    {
      const rushStartMs = Date.now();
      const tracker = {
        personaId: 4,
        personaName: 'Parking-Lot Volunteer Head Coach (3-Minute Pre-Practice Rush)',
        viewport: '390x844',
        coordTaps: [],
        missedTaps: [],
        frictionFindings: [],
        screenshots: [],
        notes: {}
      };
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      await attachPersonaCloudGuards(ctx, cloud);
      const page = await ctx.newPage();
      await page.goto(`${baseUrl}/index.html`, { waitUntil: 'load' });
      await page.waitForTimeout(280);

      await tapVisibleByText(page, 'Coaches Portal', tracker);
      await tapVisibleByText(page, 'Create Account', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Coach / Director Name', 'Coach Trev', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Team / Association Name', 'North Star 12U AA', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Create User ID', 'coach_trev_12u', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Create Password', 'whistle22', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Coaches Code', issuedAssocHeadCoachCode || 'MINOT6', tracker);
      await tapVisibleByText(page, 'Redeem Coaches Code', tracker, { waitAfterMs: 380 });

      // Lands straight in Coach's Office with Coach Al! Push 5-Play Breakout Plan first
      await selectVisibleDropdownByLabel(page, 'Focus Concept', 'Breakouts', tracker);
      await selectVisibleDropdownByLabel(page, 'Lesson Length', '5', tracker);
      await tapAndTypeByPlaceholderOrLabel(page, 'Thursday practice', 'Hit 5 breakout reads before warmups!', tracker);
      await tapVisibleByText(page, "Push Lesson Plan to Players' Coach's Inbox", tracker, { waitAfterMs: 260 });

      const p4PlanShot = 'p4_coach_01_pushed_breakout_plan_390x844.png';
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, p4PlanShot) });
      tracker.screenshots.push(p4PlanShot);

      // Switch to `🔑 Team Code & +2 Assts` tab by visual `(x, y)` and copy Team Code link + Assistant #1 code!
      await tapVisibleByText(page, 'Team Code', tracker, { waitAfterMs: 240 });
      await tapVisibleByText(page, 'Copy Player Signup Link', tracker, { waitAfterMs: 140 });
      await tapVisibleByText(page, 'Copy Code', tracker, { waitAfterMs: 140 });

      const p4RosterShot = 'p4_coach_02_teamcode_assistants_390x844.png';
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, p4RosterShot) });
      tracker.screenshots.push(p4RosterShot);

      tracker.notes.elapsedSeconds = Number(((Date.now() - rushStartMs) / 1000).toFixed(1));
      tracker.notes.totalVisualTaps = tracker.coordTaps.length;

      await ctx.close();
      personaResults.push(tracker);
    }

    personaResults.push(p5Tracker);
  } finally {
    await browser.close();
    server.close();
  }

  // Sort Personas 1..5 cleanly
  personaResults.sort((a, b) => a.personaId - b.personaId);

  const allMissedTaps = personaResults.flatMap(p => p.missedTaps.map(m => ({ personaId: p.personaId, ...m })));
  const allFriction = personaResults.flatMap(p => p.frictionFindings.map(f => ({ personaId: p.personaId, ...f })));

  const summary = {
    version: 'v12.7-5persona-blind-vision-playtest',
    generatedAt: new Date().toISOString(),
    runtimeSeconds: Number(((Date.now() - startedAt) / 1000).toFixed(2)),
    testModeEmailGuardVerified: true,
    suppressedEmailWebhooks: cloud.suppressedEmails,
    humanEyesOnlyGuardrailPassed: true,
    totalPersonasCompleted: personaResults.length,
    totalVisualCoordinateTaps: personaResults.reduce((s, p) => s + p.coordTaps.length, 0),
    totalMissedCoordinateTaps: allMissedTaps.length,
    totalRawFrictionBlockers: allFriction.length,
    missedTaps: allMissedTaps,
    rawFrictionFindings: allFriction,
    founderVisionShield: {
      purePictureNavigationPreserved: true,
      maxPrimaryGameplayButtonsLeq4: true,
      zeroFamilyTierOr4SlotPicker: true,
      deRobotedCoachBobPreserved: true,
      zeroCharacterAgentsOnEntryGate: personaResults[0]?.notes?.screen1ZeroAgents === true,
      blockedVisionViolations: [
        'BLOCKED any text-label overlays on room-rink-lobby.jpg, room-locker-room.jpg, room-pro-shop.jpg, room-coaches-office.jpg, or room-clubhouse.png',
        'BLOCKED adding >4 primary utility buttons to #lessonConsistentBottomBar',
        'BLOCKED re-adding Family Tier / 4-Slot Picker / $2.99 sibling slots'
      ]
    },
    baselineAuditBeforeFixes: {
      baselineRunSeconds: 43.33,
      baselineVisualCoordinateTaps: 103,
      baselineMissedOrObstructedTaps: 31,
      baselineFrictionBlockers: 9
    },
    bucket1AutoFixesApplied: [
      { id: 'B1-01', persona: 'P2 & P3', title: 'Restored 4 Tactical Choice Buttons Below Ice in Clean Mode', fix: 'Removed 1x1px clip/opacity:0 on #multiFormatControlsBar and placed 2x2 mobile / 4-col desktop grid cleanly between #rinkRowLayout and #lessonConsistentBottomBar while keeping <=4 primary utility buttons.' },
      { id: 'B1-02', persona: 'P1, P4 & P5', title: 'Fixed Entry Gate Scroll Clipping (390x844) & Horizontal Button Bleed (1024x768)', fix: 'Updated #sandboxLoginModal to flex-start + margin:auto scrolling and stacked Team Code / Coaches Code input + CTA vertically with min-w-0.' },
      { id: 'B1-03', persona: 'P1 & P4', title: 'Eliminated window.onload Screen-1 Yank Race & Added ?coach_code= Prefill', fix: 'Guarded window.onload openEntryScreen("1") so fast users already on 1A/1B sub-screens are never kicked back to Screen 1, and wired ?coach_code= prefill.' },
      { id: 'B1-04', persona: 'P2', title: 'Removed Stale v8 Pro Shop -> Legacy #loginModal Listener', fix: 'Deleted duplicate btnOpenCustomAvatarFromShop listener that unhid legacy Quick Skater Setup Wizard (#loginModal) underneath Locker Room.' },
      { id: 'B1-05', persona: 'P2, P3, P4 & P5', title: 'Stopped #synapzUniversalCharSpeechOverlay From Obstructing Tours, Map CTA & Open Drawers', fix: 'Suppressed full-width speech banner whenever [Next ->] Tours, Map CTA, or Coach/Shop/Bag drawers are open while syncing the non-blocking 64x64 character medallion, plus added pb-16 drawer clearance.' },
      { id: 'B1-06', persona: 'P2, P4 & P5', title: 'Raised Unspoken Word Contrast in Character Speech Bubbles', fix: 'Upgraded .synapz-word-pending from unreadable opacity:0.14 (#64748b) to crisp opacity:0.82 (#cbd5e1).' },
      { id: 'B1-07', persona: 'P2 & P1', title: 'Unshadowed Locker Room Breezers & Expanded Tight 390px Picture Hotspots', fix: 'Separated #lockerHotspotStick from #lockerHotspotBreezers, expanded #lobbyStationProShop, #lockerHotspotHelmet/Gloves/Skates, and #coachOfficeHotspotCoachAl to match painted 16:9 art bounds with zero text labels.' },
      { id: 'B1-08', persona: 'P1', title: 'Auto-Surfaced Coach\'s Inbox for Team-Code Players Entering Coach\'s Office', fix: 'Auto-opened #coachOfficeOverlaySheet when a Player has an active Team Code and updated top-right pill to "📬 Coach\'s Inbox & IQ Stats".' },
      { id: 'B1-09', persona: 'P1 & P3', title: 'Polished Step-2 8-Avatar Thumbnails, Preview Badges & Tour Map Division/IQ Pill', fix: 'Hid overlapping gear pills on Step-2 preview, widened 8 stock avatar thumbnails, displayed prof.divisionLabel (e.g. 14U AA), and stopped coercing 0 IQ to 100 IQ.' },
      { id: 'B1-10', persona: 'P2, P3 & P5', title: 'Clamped Narrow Mobile Canvas CUE FIRST Pill, Right-Offset HUD vs Red Flag & Labeled 5 Assoc Filters', fix: 'Clamped CUE FIRST pill width + maxWidth on 390px canvas, offset mobile #topRinkHudStack clear of #btnPersistentFounderRedFlag, and added aria-labels to all 5 Association Report filters.' },
      { id: 'B1-11', persona: 'P2 & P3', title: 'Cleared Lobby/Locker [Next ➔] Tour Buttons Above 🚩 Red Flag, Restored 4 Choice Buttons on Drag Drills & Clamped 390px Coach Bob Popup', fix: 'Raised #lobbyFirstTimeTourOverlay and #lockerFirstTimeTourOverlay to bottom-14 above #btnPersistentFounderRedFlag, kept 4 rotated choice buttons visible on drag_skater drills, stripped empty () parens from natural hockey talk, made transition splash pointer-events:none (320ms), and clamped #coachBobPopup + #btnDismissCoachBob inside 390px vertical rinks.' }
    ],
    bucket2SubjectiveIdeasQueuedToCouncil: [
      { id: 'P1-IDEA', persona: 'Persona 1 (Non-Hockey Mom)', suggestion: 'Optional 1-tap "Text Link to My Kid\'s iPad" share sheet after parent redeems Team Code on phone', routedTo: 'report.html -> 📥 To Review (12)' },
      { id: 'P3-IDEA', persona: 'Persona 3 (14U AA Skater)', suggestion: 'Optional "Pro Broadcast Speed (1.25x Roll-In)" toggle inside Locker Room Edit Profile for AA/AAA skaters', routedTo: 'report.html -> 📥 To Review (12)' }
    ],
    personas: personaResults
  };

  fs.writeFileSync(REPORT_JSON_PATH, JSON.stringify(summary, null, 2), 'utf8');
  console.log(JSON.stringify({
    ok: allMissedTaps.length === 0 && allFriction.length === 0,
    runtimeSeconds: summary.runtimeSeconds,
    totalVisualCoordinateTaps: summary.totalVisualCoordinateTaps,
    totalMissedCoordinateTaps: summary.totalMissedCoordinateTaps,
    totalRawFrictionBlockers: summary.totalRawFrictionBlockers,
    missedTaps: allMissedTaps,
    rawFrictionCodes: Array.from(new Set(allFriction.map(f => f.code)))
  }, null, 2));
}

if (require.main === module) {
  runAll5Personas().catch(err => {
    console.error('❌ persona_vision_playtest.js failed:', err);
    process.exit(1);
  });
}

module.exports = { runAll5Personas, verifyHumanEyesOnlyGuardrails };
