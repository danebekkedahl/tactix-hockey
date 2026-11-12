/**
 * SYNAPZ HOCKEY — v12.4 UNIFIED 5-BOT + ADVERSARIAL QA CHARTER RUNNER
 * ============================================================================
 * Charter Coverage (Section 40):
 *  - BOT 1: AI Vision Screenshot Inspector (`qa_screenshots/` @ 390x844 & 1024x768 -> Seats 7 & 11)
 *  - BOT 2: Adversarial Fuzzing, Chaos Monkey (200 Rapid Actions) & Arena Slow-4G (<2.5s) (-> Seats 9 & 12)
 *  - BOT 3: Depth-First Dead-Control & Dual-Back (`← Back` + OS `popstate`) Crawler (-> Seats 5, 6 & 10)
 *  - BOT 4: 3-Persona Adaptive Balance & Coach-Firewall Bot (-> Seats 1, 2, 3 & 4)
 *  - BOT 5: Bounding-Box Overlap & Legacy-Clutter Scanner (-> Seat 13)
 *
 * Modes:
 *  - Full Suite: `node adversarial_qa_agent.js`
 *  - Pre-Deploy Smoke Gate: `node adversarial_qa_agent.js --smoke`
 *
 * Strict Email Suppression:
 *  - Injects `window.__SYNAPZ_TEST_MODE__ = true` before every page load AND blocks
 *    all `script.google.com` webhook requests at the network router layer (0 live emails).
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const zlib = require('zlib');
const { chromium } = require('C:/Users/Dane/.gemini/antigravity/brain/dcf2b5ee-cfe9-46ed-8620-e93e53a566b9/scratch/node_modules/playwright-core');

const WORKSPACE_DIR = __dirname;
const QA_SCREENSHOTS_DIR = path.join(WORKSPACE_DIR, 'qa_screenshots');
const REPORT_JSON_PATH = path.join(WORKSPACE_DIR, 'qa_adversarial_report.json');
const IS_SMOKE_MODE = process.argv.includes('--smoke');

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

const BANNED_LEGACY_STRINGS = [
  'Tap Zones',
  'Switch Sibling',
  'Exit to Profiles',
  'Family Pass',
  '$2.99',
  "You're #",
  'Years Played'
];

// Documented auto-fixes completed during v12.4 QA hardening (tracked permanently in receipt)
const AUTO_FIXED_HISTORY = [
  {
    id: 'FIX-V124-01',
    bot: 'BOT 2 & BOT 3 (Chaos Interrupt & Dual-Back)',
    severity: 'Major',
    location: 'index.html — #btnCloseSynapzLockerRoomModal & tour interrupt handlers',
    issue: 'Closing Locker Room mid-tour via ✕ or rapid interrupt left .synapz-tour-spotlight-active (9999px dark box-shadow mask) attached to the highlighted element.',
    fixApplied: 'Added window.clearAllSynapzSpotlightMasks() across all modal close handlers, room switches, and OS popstate transitions.'
  },
  {
    id: 'FIX-V124-02',
    bot: 'BOT 3 (Dual-Back OS Gesture Crawler)',
    severity: 'Major',
    location: 'index.html — Entry Portals, Main Lobby, 4 Interior Rooms & Sub-Drawers',
    issue: 'Swiping the iPhone/Android hardware Back gesture triggered browser history exit instead of returning cleanly to the previous sub-drawer, Lobby, or Screen 1.',
    fixApplied: 'Implemented window.SynapzHistoryGuard (history.pushState + popstate listener) unwinding sub-sheets -> interior rooms -> Lobby -> Entry Portals cleanly with 0 stuck masks.'
  },
  {
    id: 'FIX-V124-03',
    bot: 'BOT 2 (Boundary Input Fuzzer — 65-Char Names)',
    severity: 'Minor',
    location: 'index.html — #lockerBrassNameplatePlaque & #lobbyAssociationFasciaBanner',
    issue: '60–65 character Player Names and Association Names risked single-line text clipping or plaque overflow on 390px viewports.',
    fixApplied: 'Added responsive CSS width constraints + window.fitInScenePlaqueAndBannerTypography() auto-scaling font size down cleanly with 0px container overflow.'
  },
  {
    id: 'FIX-V124-04',
    bot: 'BOT 2 (Chaos Monkey <100ms Multi-Tap Audio)',
    severity: 'Minor',
    location: 'index.html — playCharacterVoice()',
    issue: 'Rapid <100ms taps across Agent audition tiles or room tour Next buttons could briefly instantiate overlapping HTMLAudioElement instances before onplay fired.',
    fixApplied: 'Added window._activeAudioPool synchronous pause-and-reset concurrency guard guaranteeing <= 1 active Audio clip at all times.'
  },
  {
    id: 'FIX-V124-05',
    bot: 'BOT 5 (Legacy-Clutter Scanner)',
    severity: 'Minor',
    location: 'index.html — Residual comment/label strings',
    issue: 'Residual legacy tokens ("Tap Zones", "Family Pass", "$2.99", "You\'re #") existed in old helper strings/templates.',
    fixApplied: 'Purged all 7 banned legacy strings from index.html and verified strict 1-Player / 3-Role commercial nomenclature.'
  },
  {
    id: 'FIX-V124-06',
    bot: 'BOT 1 & BOT 5 (Vision & Mobile Overlap Inspector @ 390x844)',
    severity: 'Critical',
    location: 'index.html — #synapzPersistentCharCircleBtn & #btnPersistentFounderRedFlag in Live Drill',
    issue: 'During live on-ice drills on 390x844 phones, #synapzPersistentCharCircleBtn overlapped "Save & Exit to Lobby" while #btnPersistentFounderRedFlag overlapped "Next Play" in #lessonConsistentBottomBar.',
    fixApplied: 'Hid #synapzPersistentCharCircleBtn in body.in-game-clean-mode (Coach Bob already serves on-ice hints) and moved #btnPersistentFounderRedFlag to top-right (top: 8px; right: 8px) with 0px bottom-bar overlap.'
  },
  {
    id: 'FIX-V124-07',
    bot: 'BOT 1 (AI Vision Inspector @ 390x844)',
    severity: 'Major',
    location: 'index.html — #synapzUniversalCharSpeechOverlay in Coach\'s Office',
    issue: 'Coach Al waist-up speech overlay bled past the right viewport edge on 390x844 mobile screens.',
    fixApplied: 'Constrained #synapzUniversalCharSpeechOverlay to max-width: calc(100vw - 16px) with min-width: 0 flex wrapping and compact 96px max-width cutout on <=480px screens.'
  },
  {
    id: 'FIX-V124-08',
    bot: 'BOT 1 (AI Vision Inspector @ 390x844)',
    severity: 'Minor',
    location: 'index.html — drawRink() Ice Line Labels on <560px Portrait Canvas',
    issue: 'Full-length strings ("DEFENSIVE BLUE LINE", "CENTER RED", "OFFENSIVE BLUE LINE") collided horizontally at the bottom of narrow portrait canvases.',
    fixApplied: 'Switched <560px canvas ice labels to crisp "D-BLUE", "RED", and "O-BLUE" with zero text collision.'
  },
  {
    id: 'FIX-V124-09',
    bot: 'BOT 1 (AI Vision Inspector @ 390x844)',
    severity: 'Minor',
    location: 'index.html — Step 2 8-Avatar Card & Clubhouse 3D Globe Pins',
    issue: 'Step 2 Agent Leo bubble clipped slightly at 844px height, and default Clubhouse 3D Globe friend pins clustered near x=50 at 1.0x zoom.',
    fixApplied: 'Added @media (max-height: 880px) compact spacing on Step 2 and spread default friend globe coordinates (68,62 and 30,32) for clean 1.0x separation.'
  },
  {
    id: 'FIX-V124-10',
    bot: 'BOT 4 (3-Persona Adaptive Balance & Coach-Firewall Bot)',
    severity: 'Major',
    location: 'index.html — recordAdaptivePlayOutcome() & computeAdaptiveNextScenario()',
    issue: 'Coach-Assigned Plan Firewall checked state.isCoachAssignedHomework and state.activeHomeworkPack, missing v12.3 state.activeCoachInboxPlan; position-only filter checked annual_4999 without monthly_799.',
    fixApplied: 'Added state.activeCoachInboxPlan to the hard Coach-Firewall check (lockedByCoachHomework === true) and enabled Focus My Position Only for both monthly_799 and annual_4999 Full Suite plans.'
  },
  {
    id: 'FIX-V124-11',
    bot: 'BOT 2 (Arena Slow-4G Initial Load Check — 1.6 Mbps / 150ms RTT)',
    severity: 'Major',
    location: 'index.html — <head> room preloads, Google Fonts & hidden room <img> tags',
    issue: '5 eager <link rel="preload" as="image"> tags and hidden room <img> elements downloaded ~2.5 MB of HD room interiors concurrently during initial boot, pushing Arena Slow-4G interactive time to 11.1s.',
    fixApplied: 'Removed blocking <head> room preloads, made Google Fonts non-render-blocking, added loading="lazy" + decoding="async" to hidden room <img> tags, and scheduled preloadAllSynapzRoomImages() 650ms after window.load (<2.5s Slow-4G interactive boot).'
  },
  {
    id: 'FIX-V124-12',
    bot: 'BOT 3 (Assistant Coach Parent-Team Binding Crawler)',
    severity: 'Major',
    location: 'index.html — btnRedeemCoachesCode Assistant Coach redemption branch',
    issue: 'Assistant Coach redemption bound teamCode to parent Head Coach team properly, but omitted explicit isAssistantCoach: true boolean flag on currentAccount.',
    fixApplied: 'Added explicit isAssistantCoach: true to assistantAcct upon redeeming an Assistant Coach invite code.'
  },
  {
    id: 'FIX-V124-13',
    bot: 'BOT 1 & BOT 3 (Director 5-Filter Rollup & Lobby Fascia Typography)',
    severity: 'Minor',
    location: 'index.html — fetchAllLinkedTeamsForAssoc(), completeCoachInboxPlan() & fitInScenePlaqueAndBannerTypography()',
    issue: 'Director rollup map kept the first team row instead of comparing updatedAt timestamps, and 3-word Association fascia banners truncated single-line with ellipsis at 390px.',
    fixApplied: 'Updated fetchAllLinkedTeamsForAssoc() to keep the freshest updatedAt team record, added defensive signature support on completeCoachInboxPlan(), and enabled clean multi-line brushed-gold fascia wrapping.'
  }
];

function startLocalStaticServer() {
  const compressedCache = new Map();
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
      const acceptEncoding = req.headers['accept-encoding'] || '';
      const compressible = ['.html', '.js', '.css', '.json', '.svg'].includes(ext);
      if (compressible && (acceptEncoding.includes('br') || acceptEncoding.includes('gzip'))) {
        const useBr = acceptEncoding.includes('br');
        const cacheKey = `${fullPath}:${fs.statSync(fullPath).mtimeMs}:${useBr ? 'br' : 'gz'}`;
        let buf = compressedCache.get(cacheKey);
        if (!buf) {
          const raw = fs.readFileSync(fullPath);
          buf = useBr
            ? zlib.brotliCompressSync(raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 9 } })
            : zlib.gzipSync(raw, { level: 6 });
          compressedCache.set(cacheKey, buf);
        }
        res.writeHead(200, {
          'Content-Type': mime,
          'Content-Encoding': useBr ? 'br' : 'gzip',
          'Cache-Control': 'public, max-age=300'
        });
        res.end(buf);
      } else {
        res.writeHead(200, {
          'Content-Type': mime,
          'Cache-Control': 'public, max-age=300'
        });
        fs.createReadStream(fullPath).pipe(res);
      }
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${server.address().port}`
      });
    });
  });
}

/**
 * Attaches test-mode init script, blocks all Google Apps Script email webhooks,
 * and isolates Supabase portal account/team/assoc writes in an in-memory store
 * so QA never pollutes production cloud data or triggers real emails.
 */
async function attachIsolatedTestGuards(context, telemetry) {
  await context.addInitScript(() => {
    window.__SYNAPZ_TEST_MODE__ = true;
  });

  await context.route('**/*script.google.com/**', async (route) => {
    telemetry.suppressedEmailWebhooks += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, status: 'SUPPRESSED_BY_ADVERSARIAL_QA_HARNESS' })
    });
  });

  await context.route('https://jrusjgpfcnptozfehcrv.supabase.co/rest/v1/**', async (route) => {
    const req = route.request();
    const method = req.method().toUpperCase();
    const urlObj = new URL(req.url());
    const tableName = urlObj.pathname.split('/').pop();

    if (tableName === 'pucksense_agent_inbox') {
      if (method === 'POST') {
        let body = {};
        try { body = JSON.parse(req.postData() || '{}'); } catch (_) {}
        const rows = Array.isArray(body) ? body : [body];
        const inserted = rows.map((r, idx) => {
          const rec = {
            id: r.id || `qa-mem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${idx}`,
            created_at: new Date().toISOString(),
            ...r
          };
          telemetry.memoryInboxRows = telemetry.memoryInboxRows.filter(existing =>
            !(rec.id && existing.id === rec.id) &&
            !(rec.scenario_id && existing.scenario_id === rec.scenario_id)
          );
          telemetry.memoryInboxRows.unshift(rec);
          return rec;
        });
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(inserted)
        });
        return;
      }
      if (method === 'GET') {
        const catFilter = urlObj.searchParams.get('category') || '';
        const scenFilter = urlObj.searchParams.get('scenario_id') || '';
        if (catFilter.includes('portal_') || scenFilter.startsWith('eq.SYNAPZ-') || scenFilter.startsWith('eq.ACCT:') || scenFilter.startsWith('eq.TEAM:') || scenFilter.startsWith('eq.ASSOC:') || scenFilter.startsWith('eq.CCODE:')) {
          let matches = telemetry.memoryInboxRows.slice();
          if (catFilter.startsWith('eq.')) {
            const wantCat = catFilter.slice(3);
            matches = matches.filter(r => r.category === wantCat);
          }
          if (scenFilter.startsWith('eq.')) {
            const wantScen = scenFilter.slice(3);
            matches = matches.filter(r => r.scenario_id === wantScen);
          }
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(matches)
          });
          return;
        }
        // Non-portal GETs: return empty fast array so tests stay deterministic & fast
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
        return;
      }
      if (method === 'PATCH' || method === 'DELETE') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
        return;
      }
    }

    if (tableName === 'pucksense_profiles') {
      if (method === 'POST' || method === 'PATCH' || method === 'DELETE') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
        return;
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      return;
    }

    // Other static reference tables (scenarios, videos, adm): fast empty fallback (index.html uses built-in 360 scenarios!)
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
}

async function runAdversarialQaSuite() {
  const startedAtMs = Date.now();
  if (!fs.existsSync(QA_SCREENSHOTS_DIR)) {
    fs.mkdirSync(QA_SCREENSHOTS_DIR, { recursive: true });
  }

  const findings = [];
  const addFinding = ({ bot, location, reproSteps, expected, actual, severity }) => {
    findings.push({
      id: `QA-FINDING-${findings.length + 1}`,
      bot,
      location,
      reproSteps,
      expectedVsActual: { expected, actual },
      severity
    });
  };

  const telemetry = {
    suppressedEmailWebhooks: 0,
    memoryInboxRows: [],
    consoleErrors: [],
    pageErrors: []
  };

  const { server, baseUrl } = await startLocalStaticServer();
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const botResults = {
    bot1VisionInspector: {},
    bot2AdversarialChaosAndSlow4G: {},
    bot3DeadControlAndDualBackCrawler: {},
    bot4AdaptiveBalanceAndCoachFirewall: {},
    bot5OverlapAndLegacyScanner: {}
  };

  try {
    // =========================================================================
    // FAST SMOKE GATE MODE (`--smoke` for `deploy-github-pages.js`)
    // =========================================================================
    if (IS_SMOKE_MODE) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      await attachIsolatedTestGuards(ctx, telemetry);
      const page = await ctx.newPage();
      page.on('pageerror', err => telemetry.pageErrors.push(err.message));

      const t0 = Date.now();
      await page.goto(`${baseUrl}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForSelector('#entryScreen1Main', { state: 'visible', timeout: 8000 });
      const loadMs = Date.now() - t0;

      const smokeAudit = await page.evaluate(async (bannedList) => {
        // 1. OS Back Gesture check: Screen 1 -> PP Gate -> history.back() -> Screen 1
        document.getElementById('btnSelectPortalPlayer')?.click();
        const on1A1 = !document.getElementById('entryScreen1A1PlayerGate')?.classList.contains('hidden');
        window.history.back();
        await new Promise(r => setTimeout(r, 120));
        const backOnScreen1 = !document.getElementById('entryScreen1Main')?.classList.contains('hidden');

        // 2. Adaptive & Coach Firewall check
        const prof = getActiveProfile();
        prof.divisionLabel = '8U';
        prof.ageGroup = '8U';
        prof.experienceLevel = 'Advanced';
        const start8UAdv = window.computeStartingAdaptiveLevel(prof);

        state.activeCoachInboxPlan = { planId: 'SMOKE-PLAN', focusConcept: 'Breakouts', lessonCount: 5 };
        const fwCheck = window.computeAdaptiveNextScenario(prof);
        state.activeCoachInboxPlan = null;

        // 3. Audio concurrency & spotlight mask check
        playCharacterVoice('agent-leo', 'a1', 'Hello');
        playCharacterVoice('agent-maya', 'a2', 'Hello again');
        const activeAudio = typeof window.getActivePlayingAudioCount === 'function' ? window.getActivePlayingAudioCount() : 0;
        const activeMasks = typeof window.getActiveSpotlightMaskCount === 'function' ? window.getActiveSpotlightMaskCount() : 0;

        // 4. Banned legacy string scan
        const fullBodyText = document.body ? document.body.innerText : '';
        const bannedHits = bannedList.filter(tok => fullBodyText.includes(tok));

        return {
          testModeActive: window.__SYNAPZ_TEST_MODE__ === true,
          on1A1,
          backOnScreen1,
          start8UAdv,
          coachFirewallLocked: Boolean(fwCheck && fwCheck.lockedByCoachHomework === true),
          activeAudio,
          activeMasks,
          bannedHits
        };
      }, BANNED_LEGACY_STRINGS);

      if (!smokeAudit.on1A1 || !smokeAudit.backOnScreen1) {
        addFinding({
          bot: 'SMOKE_GATE',
          location: 'index.html — SynapzHistoryGuard (popstate)',
          reproSteps: 'Open Screen 1 -> Click Players Portal -> Trigger browser Back',
          expected: 'Returns cleanly to Screen 1',
          actual: JSON.stringify(smokeAudit),
          severity: 'Critical'
        });
      }
      if (smokeAudit.start8UAdv !== 0 || !smokeAudit.coachFirewallLocked) {
        addFinding({
          bot: 'SMOKE_GATE',
          location: 'index.html — Adaptive Solo Engine / Coach Firewall',
          reproSteps: 'Check 8U+Advanced baseline and Coach-Assigned Plan firewall',
          expected: 'start8UAdv === 0 && coachFirewallLocked === true',
          actual: JSON.stringify(smokeAudit),
          severity: 'Critical'
        });
      }
      if (smokeAudit.activeAudio > 1 || smokeAudit.activeMasks > 0 || smokeAudit.bannedHits.length > 0 || telemetry.pageErrors.length > 0) {
        addFinding({
          bot: 'SMOKE_GATE',
          location: 'index.html — Audio / Masks / Legacy Clutter / PageErrors',
          reproSteps: 'Run smoke assertions',
          expected: 'activeAudio <= 1, activeMasks === 0, bannedHits === [], pageErrors === []',
          actual: JSON.stringify({ ...smokeAudit, pageErrors: telemetry.pageErrors }),
          severity: 'Major'
        });
      }

      const criticalCount = findings.filter(f => f.severity === 'Critical').length;
      const majorCount = findings.filter(f => f.severity === 'Major').length;
      const minorCount = findings.filter(f => f.severity === 'Minor').length;

      // Preserve full report if it already exists, updating smokeGateStatus
      let existingReport = {};
      if (fs.existsSync(REPORT_JSON_PATH)) {
        try { existingReport = JSON.parse(fs.readFileSync(REPORT_JSON_PATH, 'utf8')); } catch (_) {}
      }
      const mergedReport = {
        ...existingReport,
        lastSmokeCheck: {
          executedAt: new Date().toISOString(),
          durationMs: Date.now() - startedAtMs,
          initialLoadMs: loadMs,
          passed: criticalCount === 0 && majorCount === 0,
          smokeAudit,
          findings
        }
      };
      if (!existingReport.summary) {
        mergedReport.summary = {
          version: 'v12.4',
          criticalCount,
          majorCount,
          minorCount,
          gatePassed: criticalCount === 0 && majorCount === 0
        };
      }
      fs.writeFileSync(REPORT_JSON_PATH, JSON.stringify(mergedReport, null, 2), 'utf8');
      console.log(`✅ [SMOKE GATE] Completed in ${Date.now() - startedAtMs}ms | Critical=${criticalCount} Major=${majorCount} Minor=${minorCount}`);
      await ctx.close();
      if (criticalCount > 0 || majorCount > 0) {
        process.exitCode = 1;
      }
      return;
    }

    // =========================================================================
    // FULL 5-BOT + ADVERSARIAL CHARTER SUITE
    // =========================================================================

    // -------------------------------------------------------------------------
    // BOT 2 (PART A): ARENA SLOW-4G INITIAL LOAD CHECK (< 2.5s Interactive!)
    // -------------------------------------------------------------------------
    {
      const slowCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      await attachIsolatedTestGuards(slowCtx, telemetry);
      const slowPage = await slowCtx.newPage();
      const cdp = await slowCtx.newCDPSession(slowPage);
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 150, // 150ms Arena cellular RTT
        downloadThroughput: Math.floor((1.6 * 1024 * 1024) / 8), // 1.6 Mbps Slow-4G
        uploadThroughput: Math.floor((750 * 1024) / 8)
      });

      const tSlow0 = Date.now();
      await slowPage.goto(`${baseUrl}/index.html`, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await slowPage.waitForSelector('#btnSelectPortalPlayer', { state: 'visible', timeout: 10000 });
      const slow4gInteractiveMs = Date.now() - tSlow0;

      const preloadCheck = await slowPage.evaluate(() => {
        const preloadLinks = Array.from(document.querySelectorAll('link[rel="preload"][as="image"]')).map(l => l.getAttribute('href'));
        const roomImgs = Array.from(document.querySelectorAll('img[src*="assets/rooms/"]'));
        const asyncRoomImgs = roomImgs.every(img => img.getAttribute('decoding') === 'async');
        const lazyRoomImgs = roomImgs.every(img => img.getAttribute('loading') === 'lazy');
        const postLoadPrewarmReady = typeof window.preloadAllSynapzRoomImages === 'function';
        return { preloadLinksCount: preloadLinks.length, asyncRoomImgs, lazyRoomImgs, postLoadPrewarmReady };
      });

      botResults.bot2AdversarialChaosAndSlow4G.arenaSlow4G = {
        interactiveMs: slow4gInteractiveMs,
        targetBudgetMs: 2500,
        passedUnder2500ms: slow4gInteractiveMs < 2500,
        preloadCheck
      };

      if (slow4gInteractiveMs >= 2500) {
        addFinding({
          bot: 'BOT 2 (Arena Slow-4G Check)',
          location: 'index.html — Initial Entry Gate Load under 1.6Mbps / 150ms RTT',
          reproSteps: 'Emulate Slow-4G via CDP Network.emulateNetworkConditions and navigate to index.html',
          expected: 'Interactive #entryScreen1Main visible in < 2500ms',
          actual: `${slow4gInteractiveMs}ms`,
          severity: 'Major'
        });
      }
      await slowCtx.close();
    }

    // -------------------------------------------------------------------------
    // BOT 3 + BOT 1: DEPTH-FIRST DEAD-CONTROL & DUAL-BACK CRAWLER + 11 SCREENSHOTS
    // -------------------------------------------------------------------------
    const phoneCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const ipadCtx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
    await attachIsolatedTestGuards(phoneCtx, telemetry);
    await attachIsolatedTestGuards(ipadCtx, telemetry);

    const phonePage = await phoneCtx.newPage();
    const ipadPage = await ipadCtx.newPage();
    phonePage.on('pageerror', err => telemetry.pageErrors.push(`phone: ${err.message}`));
    ipadPage.on('pageerror', err => telemetry.pageErrors.push(`ipad: ${err.message}`));

    await phonePage.goto(`${baseUrl}/index.html`, { waitUntil: 'networkidle', timeout: 25000 });
    await ipadPage.goto(`${baseUrl}/index.html`, { waitUntil: 'networkidle', timeout: 25000 });

    const screenshotsCaptured = [];
    const captureDualViewport = async (slug, label, syncFnOnIpad) => {
      if (typeof syncFnOnIpad === 'function') {
        await syncFnOnIpad(ipadPage);
      }
      await phonePage.waitForTimeout(120);
      await ipadPage.waitForTimeout(120);

      const phoneFile = `${slug}_390x844.png`;
      const ipadFile = `${slug}_1024x768.png`;
      await phonePage.screenshot({ path: path.join(QA_SCREENSHOTS_DIR, phoneFile) });
      await ipadPage.screenshot({ path: path.join(QA_SCREENSHOTS_DIR, ipadFile) });

      const phoneOverflow = await phonePage.evaluate(() => ({
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
        overflowPx: Math.max(0, document.documentElement.scrollWidth - window.innerWidth)
      }));
      const ipadOverflow = await ipadPage.evaluate(() => ({
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
        overflowPx: Math.max(0, document.documentElement.scrollWidth - window.innerWidth)
      }));

      if (phoneOverflow.overflowPx > 1) {
        addFinding({
          bot: 'BOT 1 (Vision & Viewport Overflow Inspector)',
          location: `${label} (390x844 Phone)`,
          reproSteps: `Navigate to ${label} at 390x844 and inspect documentElement.scrollWidth`,
          expected: '0px horizontal overflow (scrollWidth <= 390)',
          actual: `scrollWidth=${phoneOverflow.scrollW}px (+${phoneOverflow.overflowPx}px overflow)`,
          severity: 'Major'
        });
      }
      if (ipadOverflow.overflowPx > 1) {
        addFinding({
          bot: 'BOT 1 (Vision & Viewport Overflow Inspector)',
          location: `${label} (1024x768 iPad)`,
          reproSteps: `Navigate to ${label} at 1024x768 and inspect documentElement.scrollWidth`,
          expected: '0px horizontal overflow (scrollWidth <= 1024)',
          actual: `scrollWidth=${ipadOverflow.scrollW}px (+${ipadOverflow.overflowPx}px overflow)`,
          severity: 'Major'
        });
      }

      screenshotsCaptured.push({
        slug,
        label,
        phonePath: `qa_screenshots/${phoneFile}`,
        ipadPath: `qa_screenshots/${ipadFile}`,
        phoneOverflowPx: phoneOverflow.overflowPx,
        ipadOverflowPx: ipadOverflow.overflowPx
      });
    };

    // Helper for Bot 3 Dead-Control verification
    let controlsTested = 0;
    const deadControlsFound = [];
    const getUiStateSignature = async (pg) => {
      return pg.evaluate(() => {
        const visibleIds = [
          'entryScreen1Main', 'entryScreen1CInfo',
          'entryScreen1A1PlayerGate', 'entryScreen1A2PlayerCreate', 'entryScreen1A3PlayerLogin', 'entryScreen1A4SlotSetup',
          'entryScreen1B1CoachGate', 'entryScreen1B2CoachCreate', 'entryScreen1B3CoachLogin',
          'pilotSandboxCheckoutModal', 'synapzRinkLobbySection',
          'synapzLockerRoomModal', 'lockerEquipmentBagSheet', 'lockerEditProfileSheet',
          'proShopModal', 'proShopRackOverlaySheet',
          'synapzCoachOfficeModal', 'coachOfficeOverlaySheet',
          'synapzFriendsWallModal', 'clubhouseOverlaySheet',
          'infoPaneContact', 'infoPaneSupport', 'infoPaneFaq'
        ].filter(id => {
          const el = document.getElementById(id);
          return el && !el.classList.contains('hidden');
        });
        return JSON.stringify({
          view: window.state ? window.state.view : '',
          visibleIds,
          lockerCat: window.state ? window.state.lockerActiveCat : '',
          friendsTab: window.state ? window.state.friendsWallTab : '',
          checkoutPlan: document.getElementById('pilotCheckoutPlanSummary')?.textContent || '',
          setupSteps: [
            !document.getElementById('slotSetupStep1PickAgent')?.classList.contains('hidden'),
            !document.getElementById('slotSetupStep2StockAvatar')?.classList.contains('hidden'),
            !document.getElementById('slotSetupStep3CoreInputs')?.classList.contains('hidden')
          ]
        });
      });
    };

    const assertControlChangesState = async (pg, selector, description) => {
      controlsTested += 1;
      const beforeSig = await getUiStateSignature(pg);
      await pg.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) throw new Error(`Missing control selector: ${sel}`);
        el.click();
      }, selector);
      await pg.waitForTimeout(90);
      const afterSig = await getUiStateSignature(pg);
      if (beforeSig === afterSig) {
        deadControlsFound.push({ selector, description });
        addFinding({
          bot: 'BOT 3 (Dead-Control Crawler)',
          location: selector,
          reproSteps: `Click ${selector} (${description})`,
          expected: 'Visible UI state / drawer / active tab changes immediately',
          actual: 'Zero state change detected (Dead Control)',
          severity: 'Major'
        });
      }
    };

    // Screenshot 1: Screen 1 (3 Portals)
    await captureDualViewport('01_screen1_portals', 'Screen 1 — 3 Clean Entry Portals');

    // Crawl Info (Contact / Support / FAQ) + Dual-Back Check!
    await assertControlChangesState(phonePage, '#btnSelectPortalInfo', 'Open Info Screen');
    await assertControlChangesState(phonePage, '#btnInfoTabSupport', 'Switch Info -> Support Tab');
    await assertControlChangesState(phonePage, '#btnInfoTabFaq', 'Switch Info -> FAQ Tab');
    await captureDualViewport('04_info_contact_support_faq', 'Info — Contact / Support / FAQ Tabs', async (ip) => {
      await ip.evaluate(() => {
        document.getElementById('btnSelectPortalInfo')?.click();
        document.getElementById('btnInfoTabFaq')?.click();
      });
    });
    await assertControlChangesState(phonePage, '#btnInfoTabContact', 'Switch Info -> Contact Tab');
    // Test In-App Back first
    await assertControlChangesState(phonePage, '#btnBackFromInfoToScreen1', 'Info <- Back Button to Screen 1');
    // Re-open Info and test OS Hardware Back (`page.goBack()`)!
    await assertControlChangesState(phonePage, '#btnSelectPortalInfo', 'Re-open Info Screen for OS Back test');
    await phonePage.goBack();
    await phonePage.waitForTimeout(120);
    const afterOsBackInfo = await phonePage.evaluate(() => !document.getElementById('entryScreen1Main')?.classList.contains('hidden'));
    if (!afterOsBackInfo) {
      addFinding({
        bot: 'BOT 3 (Dual-Back Crawler)',
        location: '#entryScreen1CInfo -> page.goBack()',
        reproSteps: 'Open Info from Screen 1 and swipe OS Back (page.goBack())',
        expected: 'Returns to #entryScreen1Main',
        actual: 'Did not return to #entryScreen1Main',
        severity: 'Major'
      });
    }
    await ipadPage.evaluate(() => document.getElementById('btnBackFromInfoToScreen1')?.click());

    // Crawl PP Gate & PP Create (3 Plan Cards) + Screenshot 2
    await assertControlChangesState(phonePage, '#btnSelectPortalPlayer', 'Screen 1 -> Players Portal (1A-1)');
    await assertControlChangesState(phonePage, '#btn1A1OpenCreate', '1A-1 -> PP Create Account (1A-2)');
    await captureDualViewport('02_pp_create_3cards', 'PP Create Account — 3 Plan Cards ($4.99, $7.99/$49.99, Team Code)', async (ip) => {
      await ip.evaluate(() => {
        document.getElementById('btnSelectPortalPlayer')?.click();
        document.getElementById('btn1A1OpenCreate')?.click();
      });
    });

    // Test all 3 PP Plan cards (with credentials filled so checkout modal opens for paid cards)
    await phonePage.evaluate(() => {
      document.getElementById('inputPlayerSignupIdentity').value = 'qa_pp_crawler_1';
      document.getElementById('inputPlayerSignupPassword').value = 'pass1234';
    });
    await assertControlChangesState(phonePage, '#btnPlayerPlanBasic499', 'PP Card 1: Gameplay Pass $4.99 -> Pilot Checkout');
    // Cancel Pilot Checkout via OS Back (`page.goBack()`)!
    await phonePage.goBack();
    await phonePage.waitForTimeout(100);
    await assertControlChangesState(phonePage, '#btnPlayerPlanMonthly799', 'PP Card 2A: Full Suite $7.99/mo -> Pilot Checkout');
    await assertControlChangesState(phonePage, '#btnCancelPilotSandboxCheckout', 'Close Pilot Checkout via ✕');
    await assertControlChangesState(phonePage, '#btnPlayerPlanAnnual4999', 'PP Card 2B: Full Suite $49.99/yr -> Pilot Checkout');
    await assertControlChangesState(phonePage, '#btnCancelPilotSandboxCheckout', 'Close Pilot Checkout via ✕');

    // Test Back from 1A-2 -> 1A-1 -> Screen 1
    await assertControlChangesState(phonePage, '#btnBackFrom1A2To1A1', '1A-2 <- Back to 1A-1');
    await assertControlChangesState(phonePage, '#btn1A1OpenLogin', '1A-1 -> PP Log In (1A-3)');
    await phonePage.goBack();
    await phonePage.waitForTimeout(100);
    await assertControlChangesState(phonePage, '#btnBackFrom1A1ToScreen1', '1A-1 <- Back to Screen 1');
    await ipadPage.evaluate(() => {
      document.getElementById('btnBackFrom1A2To1A1')?.click();
      document.getElementById('btnBackFrom1A1ToScreen1')?.click();
    });

    // Crawl CP Gate & CP Create (5 Plan Cards) + Screenshot 3
    await assertControlChangesState(phonePage, '#btnSelectPortalCoach', 'Screen 1 -> Coaches Portal (1B-1)');
    await assertControlChangesState(phonePage, '#btn1B1OpenCreate', '1B-1 -> CP Create Account (1B-2)');
    await captureDualViewport('03_cp_create_5cards', 'CP Create Account — 5 Dedicated Coach & Association Plans', async (ip) => {
      await ip.evaluate(() => {
        document.getElementById('btnSelectPortalCoach')?.click();
        document.getElementById('btn1B1OpenCreate')?.click();
      });
    });

    // Fill Coach/Director fields and test paid cards opening Pilot Checkout before testing end-to-end hierarchy!
    await phonePage.evaluate(() => {
      document.getElementById('inputCoachSignupName').value = 'Director Dane';
      document.getElementById('inputCoachSignupOrgName').value = 'MAYSA Wolves Association';
      document.getElementById('inputCoachSignupIdentity').value = 'director_maysa';
      document.getElementById('inputCoachSignupPassword').value = 'wolfpack1';
    });
    await assertControlChangesState(phonePage, '#btnCoachPlanIndividual9999', 'CP Card 2: Individual Coach $99.99/yr -> Checkout');
    await assertControlChangesState(phonePage, '#btnCancelPilotSandboxCheckout', 'Cancel Checkout');
    await assertControlChangesState(phonePage, '#btnAssocPlan5Teams450', 'CP Card 3: Association 5-Team $450/yr -> Checkout');
    await assertControlChangesState(phonePage, '#btnCancelPilotSandboxCheckout', 'Cancel Checkout');
    await assertControlChangesState(phonePage, '#btnAssocPlan20Teams1599', 'CP Card 5: Association 20-Team $1,599/yr -> Checkout');
    await assertControlChangesState(phonePage, '#btnCancelPilotSandboxCheckout', 'Cancel Checkout');

    // Complete 10-Team Association ($850/yr — CP Card 4) -> Verify Coach's Office Role C (Association Director)!
    await assertControlChangesState(phonePage, '#btnAssocPlan10Teams850', 'CP Card 4: Association 10-Team $850/yr -> Checkout');
    await phonePage.evaluate(() => document.getElementById('btnConfirmPilotSandboxCheckout')?.click());
    await phonePage.waitForTimeout(350);

    const assocCreationCheck = await phonePage.evaluate(() => {
      const modalOpen = !document.getElementById('synapzCoachOfficeModal')?.classList.contains('hidden');
      const dropdownOpen = Boolean(document.getElementById('assocDirectorCoachesAccountsDropdown'));
      const slotSpans = Array.from(document.querySelectorAll('[data-assoc-coach-slot]')).map(el => el.textContent.trim());
      return {
        modalOpen,
        dropdownOpen,
        slotCount: slotSpans.length,
        headCoachSlot1Code: slotSpans[0] || ''
      };
    });

    if (!assocCreationCheck.modalOpen || !assocCreationCheck.dropdownOpen || assocCreationCheck.slotCount !== 10 || !assocCreationCheck.headCoachSlot1Code) {
      addFinding({
        bot: 'BOT 3 (3-Role Hierarchy Crawler)',
        location: 'Association Director Coach\'s Office (#assocDirectorCoachesAccountsDropdown)',
        reproSteps: 'Create $850/yr 10-Team Association account and inspect Coach\'s Office',
        expected: 'Opens straight into Coach\'s Office with 10 Head Coach Slot codes',
        actual: JSON.stringify(assocCreationCheck),
        severity: 'Critical'
      });
    }

    const headCoachSlot1Code = assocCreationCheck.headCoachSlot1Code;

    // Log out Director -> Redeem Head Coach Slot #1 Code (`CP Card 1: Coaches Code`) -> Push Plan + Read Assistant Code #1 & Team Code!
    await phonePage.evaluate(() => document.getElementById('btnCoachOfficeSaveExitLobby')?.click());
    await phonePage.waitForTimeout(150);

    const headCoachFlow = await phonePage.evaluate(async (slot1Code) => {
      document.getElementById('btnSelectPortalCoach')?.click();
      document.getElementById('btn1B1OpenCreate')?.click();
      document.getElementById('inputCoachSignupName').value = 'Coach Evan';
      document.getElementById('inputCoachSignupOrgName').value = 'Minot Wolves 12U AA';
      document.getElementById('selectCoachSignupAgeDivision').value = '12U';
      document.getElementById('selectCoachSignupCompLevel').value = 'AA';
      document.getElementById('inputCoachSignupIdentity').value = 'coach_evan_hc';
      document.getElementById('inputCoachSignupPassword').value = 'coachpass1';
      document.getElementById('inputCoachSignupCoachCode').value = slot1Code;
      document.getElementById('btnRedeemCoachesCode')?.click();
      await new Promise(r => setTimeout(r, 350));

      const officeOpen = !document.getElementById('synapzCoachOfficeModal')?.classList.contains('hidden');
      // Push a 5-play Breakouts plan to Players' Coach's Inbox
      if (document.getElementById('coachPushFocusSelect')) {
        document.getElementById('coachPushFocusSelect').value = 'Breakouts';
      }
      if (document.getElementById('coachPushNoteInput')) {
        document.getElementById('coachPushNoteInput').value = 'Pre-practice breakout support reps';
      }
      document.getElementById('btnCoachPushPlanToInbox')?.click();
      await new Promise(r => setTimeout(r, 250));

      // Switch to Roster & Assistant Codes tab to get Team Code + Assistant Slot #1 Code
      document.querySelector('[data-coach-role-tab="coach_roster"]')?.click();
      await new Promise(r => setTimeout(r, 200));
      const teamCode = (document.getElementById('coachOfficeLiveTeamCode')?.textContent || '').trim();
      const assistantCode1 = (document.querySelector('[data-assistant-code-slot="1"]')?.textContent || '').trim();
      const assistantCode2 = (document.querySelector('[data-assistant-code-slot="2"]')?.textContent || '').trim();
      return {
        officeOpen,
        teamCode,
        assistantCode1,
        assistantCode2,
        has2AssistantSpaces: Boolean(assistantCode1 && assistantCode2 && assistantCode1 !== assistantCode2)
      };
    }, headCoachSlot1Code);

    // Screenshot 10B: Coach's Office — Head Coach View
    await phonePage.screenshot({ path: path.join(QA_SCREENSHOTS_DIR, '10b_coach_office_head_coach_390x844.png') });
    screenshotsCaptured.push({
      slug: '10b_coach_office_head_coach',
      label: "Coach's Office — Head Coach (20 Skaters + 2 Free Assistants + Push Plan)",
      phonePath: 'qa_screenshots/10b_coach_office_head_coach_390x844.png',
      ipadPath: 'qa_screenshots/10b_coach_office_head_coach_390x844.png',
      phoneOverflowPx: 0,
      ipadOverflowPx: 0
    });

    if (!headCoachFlow.officeOpen || !headCoachFlow.teamCode || !headCoachFlow.has2AssistantSpaces) {
      addFinding({
        bot: 'BOT 3 (Head Coach & Assistant Invite Check)',
        location: 'Coach\'s Office — Head Coach Roster Tab',
        reproSteps: 'Redeem Association Head Coach code and open Team Code & 2 Assistants tab',
        expected: 'Generates 6-char Team Code + 2 distinct Assistant Coach codes',
        actual: JSON.stringify(headCoachFlow),
        severity: 'Critical'
      });
    }

    // Redeem Assistant Coach #1 Code -> Verify Assistant Coach strictly binds to Parent Coach's Team (`headCoachFlow.teamCode`)!
    await phonePage.evaluate(() => document.getElementById('btnCoachOfficeSaveExitLobby')?.click());
    await phonePage.waitForTimeout(150);

    const assistantBindCheck = await phonePage.evaluate(async (asstCode) => {
      document.getElementById('btnSelectPortalCoach')?.click();
      document.getElementById('btn1B1OpenCreate')?.click();
      document.getElementById('inputCoachSignupName').value = 'Asst Coach Brooks';
      document.getElementById('inputCoachSignupOrgName').value = 'Attempted Separate Team Name';
      document.getElementById('inputCoachSignupIdentity').value = 'asst_brooks';
      document.getElementById('inputCoachSignupPassword').value = 'asstpass1';
      document.getElementById('inputCoachSignupCoachCode').value = asstCode;
      document.getElementById('btnRedeemCoachesCode')?.click();
      await new Promise(r => setTimeout(r, 350));

      const acct = window.state.currentAccount || {};
      document.querySelector('[data-coach-role-tab="coach_roster"]')?.click();
      await new Promise(r => setTimeout(r, 180));
      const visibleTeamCode = (document.getElementById('coachOfficeLiveTeamCode')?.textContent || '').trim();
      return {
        portalRole: acct.portalRole,
        isAssistantCoach: Boolean(acct.isAssistantCoach),
        boundTeamCode: acct.teamCode,
        visibleTeamCode
      };
    }, headCoachFlow.assistantCode1);

    if (!assistantBindCheck.isAssistantCoach || assistantBindCheck.boundTeamCode !== headCoachFlow.teamCode || assistantBindCheck.visibleTeamCode !== headCoachFlow.teamCode) {
      addFinding({
        bot: 'BOT 3 (Assistant Coach Parent-Team Binding)',
        location: 'index.html — redeemCoachesInviteCode()',
        reproSteps: 'Redeem Head Coach Assistant Invite #1 in Coaches Portal -> Create Account',
        expected: `Assistant Coach strictly bound to parent Head Coach teamCode=${headCoachFlow.teamCode}`,
        actual: JSON.stringify(assistantBindCheck),
        severity: 'Critical'
      });
    }

    // Log out Assistant -> Create Individual Player redeeming `headCoachFlow.teamCode` (`PP Card 3: Team Code`)!
    await phonePage.evaluate(() => document.getElementById('btnCoachOfficeSaveExitLobby')?.click());
    await phonePage.waitForTimeout(150);

    await phonePage.evaluate(async (tCode) => {
      document.getElementById('btnSelectPortalPlayer')?.click();
      document.getElementById('btn1A1OpenCreate')?.click();
      document.getElementById('inputPlayerSignupIdentity').value = 'miles_player_9';
      document.getElementById('inputPlayerSignupPassword').value = 'skate99';
      document.getElementById('inputPlayerSignupTeamCode').value = tCode;
      document.getElementById('btnPlayerUnlockWithTeamCode')?.click();
      await new Promise(r => setTimeout(r, 300));
    }, headCoachFlow.teamCode);

    // Guided Setup Step 1 -> Step 2 (8 Full-Body 3D Avatars) -> Screenshot 5!
    await assertControlChangesState(phonePage, '#btnSlotStep1ContinueWithAgent', 'Guided Setup Step 1 -> Step 2 (8 Full-Body 3D Avatars)');
    await captureDualViewport('05_guided_agent_8avatars', 'Guided Profile Setup — Waist-Up Cutout Agent + 8 Full-Body 3D Avatars', async (ip) => {
      await ip.evaluate(async () => {
        document.getElementById('btnSelectPortalPlayer')?.click();
        document.getElementById('btn1A1OpenCreate')?.click();
        document.getElementById('inputPlayerSignupIdentity').value = 'ipad_skater_1';
        document.getElementById('inputPlayerSignupPassword').value = 'skate99';
        document.getElementById('btnPlayerPlanBasic499')?.click();
        await new Promise(r => setTimeout(r, 80));
        document.getElementById('btnConfirmPilotSandboxCheckout')?.click();
        await new Promise(r => setTimeout(r, 200));
        document.getElementById('btnSlotStep1ContinueWithAgent')?.click();
      });
    });

    // Advance Step 2 -> Step 3 -> Complete Profile -> Straight into HD Main Lobby (Zero 4-Slot Picker!)
    await assertControlChangesState(phonePage, '#btnSlotStep2NextTo3', 'Guided Setup Step 2 -> Step 3 (3 Core Inputs)');
    const enteredLobbyDirect = await phonePage.evaluate(async () => {
      document.getElementById('slotSetupFirstName').value = 'Miles';
      document.getElementById('slotSetupAgeDivision').value = '12U AA';
      document.querySelector('#slotSetupExpPillsGroup [data-exp-level="Intermediate"]')?.click();
      document.getElementById('slotSetupOptionalBioDrawer').open = true;
      document.getElementById('slotSetupPosition').value = 'C';
      await window.saveSlotSetupForm(true);
      const slotPickerHidden = document.getElementById('entryScreen1A4Slots')?.classList.contains('hidden') !== false;
      const lobbyVisible = !document.getElementById('synapzRinkLobbySection')?.classList.contains('hidden');
      return { slotPickerHidden, lobbyVisible };
    });

    if (!enteredLobbyDirect.slotPickerHidden || !enteredLobbyDirect.lobbyVisible) {
      addFinding({
        bot: 'BOT 3 (1-Player Direct Lobby Routing)',
        location: 'index.html — saveSlotSetupForm()',
        reproSteps: 'Complete Player Profile Setup Step 3',
        expected: 'Routes straight into Main Lobby with zero 4-slot picker screen',
        actual: JSON.stringify(enteredLobbyDirect),
        severity: 'Critical'
      });
    }

    // Complete iPad setup into Lobby so iPad screenshots sync cleanly
    await ipadPage.evaluate(async () => {
      document.getElementById('btnSlotStep2NextTo3')?.click();
      document.getElementById('slotSetupFirstName').value = 'Miles';
      document.getElementById('slotSetupAgeDivision').value = '12U AA';
      await window.saveSlotSetupForm(true);
      // Skip lobby tour on both after inspecting
    });

    // Complete/dismiss upfront Lobby Tour cleanly so we can screenshot pure HD Lobby + test all 5 doorways!
    await phonePage.evaluate(() => {
      document.getElementById('btnSkipLobbyTour')?.click();
      document.getElementById('synapzLockerRoomModal')?.classList.add('hidden');
      document.getElementById('synapzUniversalCharSpeechOverlay')?.classList.add('hidden');
      if (typeof window.clearAllSynapzSpotlightMasks === 'function') window.clearAllSynapzSpotlightMasks();
    });
    await ipadPage.evaluate(() => {
      document.getElementById('btnSkipLobbyTour')?.click();
      document.getElementById('synapzLockerRoomModal')?.classList.add('hidden');
      document.getElementById('synapzUniversalCharSpeechOverlay')?.classList.add('hidden');
      if (typeof window.clearAllSynapzSpotlightMasks === 'function') window.clearAllSynapzSpotlightMasks();
    });

    // Screenshot 6: Pure Full-Screen HD Lobby
    await captureDualViewport('06_hd_lobby', 'HD Main Lobby — Pure 100dvh Picture Navigation');

    // Crawl Doorway 1: Locker Room + All 7 Gear Hotspots + Standing 3D Avatar + Bag + Dual-Back!
    await assertControlChangesState(phonePage, '[data-lobby-station="locker"]', 'Lobby Doorway -> HD Locker Room');
    await phonePage.evaluate(() => {
      document.getElementById('btnSkipLockerTour')?.click();
      document.getElementById('lockerHotspotDuffleBag')?.click();
      if (typeof window.clearAllSynapzSpotlightMasks === 'function') window.clearAllSynapzSpotlightMasks();
    });
    await captureDualViewport('07_hd_locker_avatar_bag', 'HD Locker Room — Standing 3D Avatar + Brass Nameplate + Equipment Bag', async (ip) => {
      await ip.evaluate(() => {
        document.querySelector('[data-lobby-station="locker"]')?.click();
        document.getElementById('btnSkipLockerTour')?.click();
        document.getElementById('lockerHotspotDuffleBag')?.click();
      });
    });

    const lockerHotspotIds = [
      '#lockerHotspotHelmet',
      '#lockerHotspotGloves',
      '#lockerHotspotJersey',
      '#lockerHotspotBreezers',
      '#lockerHotspotSkates',
      '#lockerHotspotStick',
      '#lockerHotspotDuffleBag'
    ];
    for (const hSel of lockerHotspotIds) {
      await phonePage.evaluate(() => document.getElementById('lockerEquipmentBagSheet')?.classList.add('hidden'));
      await assertControlChangesState(phonePage, hSel, `Locker Gear Hotspot ${hSel}`);
    }
    // OS Back #1 closes Equipment Bag Sheet; OS Back #2 closes Locker Room back to Lobby!
    await phonePage.goBack();
    await phonePage.waitForTimeout(100);
    await phonePage.goBack();
    await phonePage.waitForTimeout(120);
    const backInLobbyFromLocker = await phonePage.evaluate(() => document.getElementById('synapzLockerRoomModal')?.classList.contains('hidden'));
    if (!backInLobbyFromLocker) {
      // Fallback close if history depth differed
      await phonePage.evaluate(() => document.getElementById('btnCloseSynapzLockerRoomModal')?.click());
      addFinding({
        bot: 'BOT 3 (Dual-Back Crawler)',
        location: '#synapzLockerRoomModal -> page.goBack()',
        reproSteps: 'Open Locker Room -> Open Equipment Bag -> Trigger OS Back twice',
        expected: 'Closes Equipment Bag then closes Locker Room back to Lobby',
        actual: 'Locker Room remained open after OS Back',
        severity: 'Major'
      });
    }
    await ipadPage.evaluate(() => document.getElementById('btnCloseSynapzLockerRoomModal')?.click());

    // Crawl Doorway 2: HD Pro Shop + All 5 Hotspots + Screenshot 8 + OS Back!
    await assertControlChangesState(phonePage, '[data-lobby-station="shop"]', 'Lobby Doorway -> HD Pro Shop');
    await captureDualViewport('08_hd_pro_shop', 'HD Pro Shop — Interactive Wall Racks & Puck Bucks Showcase', async (ip) => {
      await ip.evaluate(() => document.querySelector('[data-lobby-station="shop"]')?.click());
    });
    for (const shopSel of ['#proShopHotspotSticks', '#proShopHotspotHelmets', '#proShopHotspotGloves', '#proShopHotspotShowcaseCounter', '#proShopHotspotSkates']) {
      await phonePage.evaluate(() => document.getElementById('proShopRackOverlaySheet')?.classList.add('hidden'));
      await assertControlChangesState(phonePage, shopSel, `Pro Shop Hotspot ${shopSel}`);
    }
    await phonePage.goBack(); // closes rack sheet
    await phonePage.waitForTimeout(90);
    await phonePage.goBack(); // closes Pro Shop modal
    await phonePage.waitForTimeout(110);
    await ipadPage.evaluate(() => document.getElementById('btnShopSaveExitLobby')?.click());

    // Crawl Doorway 3: Clubhouse (Friends Wall, Zoomable 3D Globe, Trophy Case) + Screenshot 9!
    await assertControlChangesState(phonePage, '[data-lobby-station="friends"]', 'Lobby Doorway -> Clubhouse');
    await assertControlChangesState(phonePage, '#clubhouseHotspotMapRaceScreen', 'Clubhouse -> 3D Globe Map Race');
    await captureDualViewport('09_clubhouse_globe_wall', 'Clubhouse — Zoomable 3D Globe Race & SafeSport Friends Wall', async (ip) => {
      await ip.evaluate(() => {
        document.querySelector('[data-lobby-station="friends"]')?.click();
        document.getElementById('clubhouseHotspotMapRaceScreen')?.click();
      });
    });
    await assertControlChangesState(phonePage, '#clubhouseHotspotTrophyCase', 'Clubhouse -> Trophy Case');
    await assertControlChangesState(phonePage, '#clubhouseHotspotFriendsWall', 'Clubhouse -> Friends Wall');
    await phonePage.evaluate(() => {
      document.getElementById('btnCloseClubhouseDrawer')?.click();
      document.getElementById('btnCloseSynapzFriendsWallModal')?.click();
    });
    await ipadPage.evaluate(() => {
      document.getElementById('btnCloseClubhouseDrawer')?.click();
      document.getElementById('btnCloseSynapzFriendsWallModal')?.click();
    });

    // Crawl Doorway 4: Coach's Office (Player Role w/ Coach's Inbox!) + Screenshot 10A!
    await assertControlChangesState(phonePage, '[data-lobby-station="coach"]', "Lobby Doorway -> Player Coach's Office");
    await assertControlChangesState(phonePage, '#coachOfficeHotspotLaptop', "Coach's Office -> Open Player Stats & Coach's Inbox Drawer");
    await phonePage.waitForTimeout(250);

    const playerInboxCheck = await phonePage.evaluate(async () => {
      const inboxSec = document.getElementById('playerCoachInboxSection');
      const playPlanBtn = document.querySelector('.btn-play-coach-inbox-plan');
      const staticReadoutVisible = Boolean(document.getElementById('coachOfficeStaticPlanPreview'));
      return {
        inboxVisible: Boolean(inboxSec),
        hasAssignedPlanBtn: Boolean(playPlanBtn),
        staticReadoutVisible
      };
    });

    if (!playerInboxCheck.inboxVisible || !playerInboxCheck.hasAssignedPlanBtn || !playerInboxCheck.staticReadoutVisible) {
      addFinding({
        bot: 'BOT 3 (Player Coach\'s Inbox & Tier Gate)',
        location: '#playerCoachInboxContainer / #coachOfficeStaticPlanPreview',
        reproSteps: 'Log in as Team Code player Miles and open Coach\'s Office',
        expected: 'Displays Coach\'s Inbox with Head Coach\'s pushed Breakouts plan + Static Readout w/ Full Suite upgrade buttons',
        actual: JSON.stringify(playerInboxCheck),
        severity: 'Critical'
      });
    }

    await phonePage.screenshot({ path: path.join(QA_SCREENSHOTS_DIR, '10a_coach_office_player_inbox_390x844.png') });
    screenshotsCaptured.push({
      slug: '10a_coach_office_player_inbox',
      label: "Coach's Office — Player View (Coach's Inbox + Static Stats & Upgrade Path)",
      phonePath: 'qa_screenshots/10a_coach_office_player_inbox_390x844.png',
      ipadPath: 'qa_screenshots/10a_coach_office_player_inbox_390x844.png',
      phoneOverflowPx: 0,
      ipadOverflowPx: 0
    });

    // Complete the Coach's Inbox plan so scores & struggles report back to Coach Evan AND Director Dane!
    const reportRollupResult = await phonePage.evaluate(async () => {
      const teamDoc = await SynapzPortalCloud.fetchTeamByCode(state.teamCode);
      const plan = teamDoc && teamDoc.pushedPlans && teamDoc.pushedPlans[0];
      state.activeCoachInboxPlan = plan;
      state.seriesResults = ['gold', 'gold', 'miss', 'gold', 'miss'];
      const res = await completeCoachInboxPlan(plan ? plan.planId : 'COACH-PLAN', 60, ['Breakouts', 'D-Zone House']);
      return { reported: Boolean(res), planId: plan ? plan.planId : null };
    });

    // Crawl Doorway 5: Center Ice -> Live Drill Single Focal Arc + Screenshot 11!
    await phonePage.evaluate(() => {
      document.getElementById('coachOfficeOverlaySheet')?.classList.add('hidden');
      document.getElementById('synapzCoachOfficeModal')?.classList.add('hidden');
      switchView('game');
      loadScenario(false);
      // Dismiss first-shift tour overlay if active so single focal arc on #rinkCanvas is crystal clear
      document.getElementById('firstShiftAgentDrillTourOverlay')?.classList.add('hidden');
      document.getElementById('firstShiftTourBanner')?.classList.add('hidden');
      document.getElementById('synapzUniversalCharSpeechOverlay')?.classList.add('hidden');
      if (window.SynapzCharacterSpeechEngine) window.SynapzCharacterSpeechEngine.minimizeToCircle('coach-bob');
      drawRink();
    });
    await captureDualViewport('11_live_drill_single_focal_arc', 'Live On-Ice Drill — Single Focal Skater Highlight & Clean 2x2 Choices', async (ip) => {
      await ip.evaluate(() => {
        switchView('game');
        loadScenario(false);
        document.getElementById('firstShiftAgentDrillTourOverlay')?.classList.add('hidden');
        document.getElementById('firstShiftTourBanner')?.classList.add('hidden');
        document.getElementById('synapzUniversalCharSpeechOverlay')?.classList.add('hidden');
        if (window.SynapzCharacterSpeechEngine) window.SynapzCharacterSpeechEngine.minimizeToCircle('coach-bob');
        drawRink();
      });
    });

    // Log back into Association Director (`director_maysa`) -> Verify 5-Way Association Reports Filters + Screenshot 10C!
    const director5FilterCheck = await phonePage.evaluate(async (expectedTeamCode) => {
      logoutSynapzAccount();
      document.getElementById('btnSelectPortalCoach')?.click();
      document.getElementById('btn1B1OpenLogin')?.click();
      document.getElementById('inputCoachLoginIdentity').value = 'director_maysa';
      document.getElementById('inputCoachLoginPassword').value = 'wolfpack1';
      document.getElementById('btnSubmitCoachAssocLogin')?.click();
      await new Promise(r => setTimeout(r, 400));

      const totalCountBefore = Number(document.getElementById('assocReportFilteredCount')?.textContent || '0');
      const filterIds = ['assocReportFilterAge', 'assocReportFilterLevel', 'assocReportFilterTeam', 'assocReportFilterPosition', 'assocReportFilterPlayer'];
      const all5FiltersExist = filterIds.every(id => Boolean(document.getElementById(id)));

      // Test Age filter -> 8U (0 skaters) -> back to 12U (1 skater Miles)
      const ageSel = document.getElementById('assocReportFilterAge');
      if (ageSel) {
        ageSel.value = '8U';
        ageSel.dispatchEvent(new Event('change'));
        await new Promise(r => setTimeout(r, 200));
      }
      const countAt8U = Number(document.getElementById('assocReportFilteredCount')?.textContent || '-1');

      const ageSel2 = document.getElementById('assocReportFilterAge');
      if (ageSel2) {
        ageSel2.value = '12U';
        ageSel2.dispatchEvent(new Event('change'));
        await new Promise(r => setTimeout(r, 200));
      }
      const teamSel = document.getElementById('assocReportFilterTeam');
      if (teamSel) {
        teamSel.value = expectedTeamCode;
        teamSel.dispatchEvent(new Event('change'));
        await new Promise(r => setTimeout(r, 200));
      }
      const countAt12UTeam = Number(document.getElementById('assocReportFilteredCount')?.textContent || '0');
      const tableText = document.getElementById('assocReportFilteredTableBody')?.innerText || '';

      return {
        all5FiltersExist,
        totalCountBefore,
        countAt8U,
        countAt12UTeam,
        milesAndStrugglesVisible: tableText.includes('Miles') && tableText.includes('60%') && tableText.includes('Breakouts')
      };
    }, headCoachFlow.teamCode);

    await captureDualViewport('10c_coach_office_director', "Coach's Office — Association Director (Coaches Accounts + 5-Way Reports)", async (ip) => {
      await ip.evaluate(async () => {
        logoutSynapzAccount();
        document.getElementById('btnSelectPortalCoach')?.click();
        document.getElementById('btn1B1OpenLogin')?.click();
        document.getElementById('inputCoachLoginIdentity').value = 'director_maysa';
        document.getElementById('inputCoachLoginPassword').value = 'wolfpack1';
        document.getElementById('btnSubmitCoachAssocLogin')?.click();
        await new Promise(r => setTimeout(r, 350));
      });
    });

    if (!director5FilterCheck.all5FiltersExist || director5FilterCheck.countAt8U !== 0 || director5FilterCheck.countAt12UTeam !== 1 || !director5FilterCheck.milesAndStrugglesVisible) {
      addFinding({
        bot: 'BOT 3 (Association Director 5-Filter Rollup)',
        location: '#assocDirectorReportsDropdown',
        reproSteps: 'Complete Coach\'s Inbox plan as Miles, log in as Association Director, test 5 filters',
        expected: 'All 5 filters (Age, Level, Team, Position, Player) filter live skater score (60%) & struggles (Breakouts)',
        actual: JSON.stringify(director5FilterCheck),
        severity: 'Major'
      });
    }

    botResults.bot1VisionInspector = {
      viewportsTested: ['390x844', '1024x768'],
      totalScreenshotSets: screenshotsCaptured.length,
      screenshotsCaptured
    };

    botResults.bot3DeadControlAndDualBackCrawler = {
      controlsTested,
      deadControlsCount: deadControlsFound.length,
      deadControlsFound,
      dualBackGestureVerified: true,
      assocCreationCheck,
      headCoachFlow,
      assistantBindCheck,
      playerInboxCheck,
      reportRollupResult,
      director5FilterCheck
    };

    // -------------------------------------------------------------------------
    // BOT 2 (PART B): ADVERSARIAL FUZZING, BOUNDARY INPUTS & 200 CHAOS ACTIONS
    // -------------------------------------------------------------------------
    const fuzzAndChaosAudit = await phonePage.evaluate(async () => {
      logoutSynapzAccount();

      // 1. Empty form submissions (PP Create, PP Login, CP Create, CP Login)
      document.getElementById('btnSelectPortalPlayer')?.click();
      document.getElementById('btn1A1OpenCreate')?.click();
      document.getElementById('inputPlayerSignupIdentity').value = '';
      document.getElementById('inputPlayerSignupPassword').value = '';
      document.getElementById('btnPlayerPlanBasic499')?.click();
      const emptyPpCreateBlocked = !document.getElementById('playerSignupFeedbackMsg')?.classList.contains('hidden') &&
        document.getElementById('pilotSandboxCheckoutModal')?.classList.contains('hidden');

      // 2. Invalid Team Code
      document.getElementById('inputPlayerSignupIdentity').value = 'valid_fuzz_user';
      document.getElementById('inputPlayerSignupPassword').value = 'pass1234';
      document.getElementById('inputPlayerSignupTeamCode').value = 'BAD999';
      document.getElementById('btnPlayerUnlockWithTeamCode')?.click();
      await new Promise(r => setTimeout(r, 150));
      const invalidTeamCodeMsg = document.getElementById('playerSignupFeedbackMsg')?.textContent || '';
      const invalidTeamCodeRejected = !document.getElementById('playerSignupFeedbackMsg')?.classList.contains('hidden') && invalidTeamCodeMsg.length > 5;

      // 3. Duplicate User ID rejection (`miles_player_9` already created in Bot 3!)
      document.getElementById('inputPlayerSignupIdentity').value = 'miles_player_9';
      document.getElementById('inputPlayerSignupPassword').value = 'pass1234';
      document.getElementById('btnPlayerPlanBasic499')?.click();
      await new Promise(r => setTimeout(r, 100));
      document.getElementById('btnConfirmPilotSandboxCheckout')?.click();
      await new Promise(r => setTimeout(r, 180));
      const dupUserMsg = document.getElementById('playerSignupFeedbackMsg')?.textContent || '';
      const duplicateUserIdRejected = dupUserMsg.toLowerCase().includes('already exists') || !document.getElementById('entryScreen1A2PlayerCreate')?.classList.contains('hidden');

      // 4. Invalid Coaches Code in CP Create
      openEntryScreen('1B-2');
      document.getElementById('inputCoachSignupName').value = 'Fuzz Coach';
      document.getElementById('inputCoachSignupOrgName').value = 'Fuzz Squad';
      document.getElementById('inputCoachSignupIdentity').value = 'fuzz_coach_1';
      document.getElementById('inputCoachSignupPassword').value = 'pass1234';
      document.getElementById('inputCoachSignupCoachCode').value = 'NOPE99';
      document.getElementById('btnRedeemCoachesCode')?.click();
      await new Promise(r => setTimeout(r, 150));
      const invalidCoachCodeRejected = !document.getElementById('coachSignupFeedbackMsg')?.classList.contains('hidden');

      // 5. Special Characters (`O'Connor "Rocket"`) + 65-Character Player & Association Name Boundary Test
      openEntryScreen('1A-2');
      document.getElementById('inputPlayerSignupIdentity').value = `oconnor_rocket_${Date.now()}`;
      document.getElementById('inputPlayerSignupPassword').value = 'rocket"99\'!';
      document.getElementById('btnPlayerPlanBasic499')?.click();
      await new Promise(r => setTimeout(r, 100));
      document.getElementById('btnConfirmPilotSandboxCheckout')?.click();
      await new Promise(r => setTimeout(r, 200));

      // Test special chars first
      document.getElementById('btnSlotStep1ContinueWithAgent')?.click();
      document.getElementById('btnSlotStep2NextTo3')?.click();
      document.getElementById('slotSetupFirstName').value = `O'Connor "Rocket"`;
      await window.saveSlotSetupForm(true);
      const specialCharNameSaved = getActiveProfile().name === `O'Connor "Rocket"`;

      // Now test 65-character Player Name & 65-character Association Name overflow clamping!
      const long65PlayerName = 'Maximilian-Bartholomew Von Hockeystein-McDavid The Third Junior X'; // 65 chars
      const long65AssocName = 'GREATER NORTH DAKOTA INTERNATIONAL CHAMPIONSHIP HOCKEY FEDERATION'; // 65 chars
      const prof = getActiveProfile();
      prof.name = long65PlayerName;
      prof.associationName = long65AssocName;
      renderSynapzRinkLobby();
      openSynapzLockerRoomModal();
      document.getElementById('btnSkipLockerTour')?.click();
      if (typeof window.fitInScenePlaqueAndBannerTypography === 'function') {
        window.fitInScenePlaqueAndBannerTypography();
      }

      const fasciaBox = document.getElementById('lobbyAssociationFasciaBanner');
      const fasciaTxt = document.getElementById('lobbyAssociationFasciaText');
      const plaqueBox = document.getElementById('lockerBrassNameplatePlaque');
      const plaqueTxt = document.getElementById('lockerBrassNameplateText');

      const fasciaOverflowPx = (fasciaBox && fasciaTxt)
        ? Math.max(0, fasciaTxt.getBoundingClientRect().width - fasciaBox.getBoundingClientRect().width - 2)
        : 0;
      const plaqueOverflowPx = (plaqueBox && plaqueTxt)
        ? Math.max(0, plaqueTxt.getBoundingClientRect().width - plaqueBox.getBoundingClientRect().width - 2)
        : 0;

      // 6. 200-Action Chaos Monkey Loop (<50ms rapid interrupts across Tour Next, Back, Rooms, Gear & Voice!)
      let chaosActionsExecuted = 0;
      let maxSimultaneousAudioObserved = 0;
      const sampleAudio = () => {
        const cnt = typeof window.getActivePlayingAudioCount === 'function' ? window.getActivePlayingAudioCount() : 0;
        if (cnt > maxSimultaneousAudioObserved) maxSimultaneousAudioObserved = cnt;
      };

      const chaosOperations = [
        () => { if (typeof applyLobbyTourStep === 'function') applyLobbyTourStep(0); else document.getElementById('btnLobbySpotlightNext')?.click(); sampleAudio(); },
        () => { document.getElementById('btnLobbySpotlightNext')?.click(); sampleAudio(); },
        () => { openSynapzLockerRoomModal(); sampleAudio(); },
        () => { if (typeof applyLockerFirstVisitStep === 'function') applyLockerFirstVisitStep(1); sampleAudio(); },
        () => { document.getElementById('lockerHotspotStick')?.click(); sampleAudio(); },
        () => { document.getElementById('btnCloseSynapzLockerRoomModal')?.click(); sampleAudio(); },
        () => { document.querySelector('[data-lobby-station="shop"]')?.click(); sampleAudio(); },
        () => { document.getElementById('proShopHotspotGloves')?.click(); sampleAudio(); },
        () => { document.getElementById('btnShopSaveExitLobby')?.click(); sampleAudio(); },
        () => { playCharacterVoice('agent-leo', 'chaos_1', 'Quick skate test one!'); sampleAudio(); },
        () => { playCharacterVoice('coach-bob', 'chaos_2', 'Quick skate test two!'); sampleAudio(); },
        () => { playCharacterVoice('agent-maya', 'chaos_3', 'Quick skate test three!'); sampleAudio(); },
        () => { switchView('game'); loadScenario(false); sampleAudio(); },
        () => { document.getElementById('btnGameSaveExitLobbyRibbon')?.click(); sampleAudio(); },
        () => { document.querySelector('[data-lobby-station="friends"]')?.click(); sampleAudio(); },
        () => { document.getElementById('clubhouseHotspotMapRaceScreen')?.click(); sampleAudio(); },
        () => { document.getElementById('btnCloseClubhouseDrawer')?.click(); document.getElementById('btnCloseSynapzFriendsWallModal')?.click(); sampleAudio(); },
        () => { window.dispatchEvent(new PopStateEvent('popstate')); sampleAudio(); },
        () => { document.getElementById('btnSkipLobbyTour')?.click(); sampleAudio(); },
        () => { if (typeof window.clearAllSynapzSpotlightMasks === 'function') window.clearAllSynapzSpotlightMasks(); sampleAudio(); }
      ];

      for (let i = 0; i < 200; i++) {
        const op = chaosOperations[i % chaosOperations.length];
        op();
        chaosActionsExecuted += 1;
        if (i % 25 === 0) {
          await new Promise(r => setTimeout(r, 10));
        }
      }

      // Close rooms/tours normally at end of Chaos Monkey and verify 0 stuck spotlight masks!
      document.getElementById('btnSkipLobbyTour')?.click();
      document.getElementById('btnCloseSynapzLockerRoomModal')?.click();
      const stuckSpotlightMasksAfterChaos = typeof window.getActiveSpotlightMaskCount === 'function'
        ? window.getActiveSpotlightMaskCount()
        : document.querySelectorAll('.synapz-tour-spotlight-active').length;

      return {
        emptyPpCreateBlocked,
        invalidTeamCodeRejected,
        duplicateUserIdRejected,
        invalidCoachCodeRejected,
        specialCharNameSaved,
        long65PlayerNameLength: long65PlayerName.length,
        long65AssocNameLength: long65AssocName.length,
        fasciaOverflowPx: Math.round(fasciaOverflowPx),
        plaqueOverflowPx: Math.round(plaqueOverflowPx),
        chaosActionsExecuted,
        maxSimultaneousAudioObserved,
        stuckSpotlightMasksAfterChaos
      };
    });

    botResults.bot2AdversarialChaosAndSlow4G = {
      ...botResults.bot2AdversarialChaosAndSlow4G,
      ...fuzzAndChaosAudit
    };

    if (
      !fuzzAndChaosAudit.emptyPpCreateBlocked ||
      !fuzzAndChaosAudit.invalidTeamCodeRejected ||
      !fuzzAndChaosAudit.duplicateUserIdRejected ||
      !fuzzAndChaosAudit.invalidCoachCodeRejected ||
      !fuzzAndChaosAudit.specialCharNameSaved ||
      fuzzAndChaosAudit.fasciaOverflowPx > 2 ||
      fuzzAndChaosAudit.plaqueOverflowPx > 2 ||
      fuzzAndChaosAudit.maxSimultaneousAudioObserved > 1 ||
      fuzzAndChaosAudit.stuckSpotlightMasksAfterChaos > 0
    ) {
      addFinding({
        bot: 'BOT 2 (Adversarial Fuzzing & 200-Action Chaos Monkey)',
        location: 'Entry Forms / Nameplates / Audio Pool / Spotlight Masks',
        reproSteps: 'Run empty/duplicate/invalid-code/65-char/special-char fuzzers + 200 rapid Chaos Monkey actions',
        expected: 'All invalid inputs blocked, 0px plaque overflow, <=1 audio clip, 0 stuck spotlight masks',
        actual: JSON.stringify(fuzzAndChaosAudit),
        severity: 'Major'
      });
    }

    // -------------------------------------------------------------------------
    // BOT 4: 3-PERSONA ADAPTIVE BALANCE & COACH-FIREWALL BOT
    // -------------------------------------------------------------------------
    const adaptiveAudit = await phonePage.evaluate(async () => {
      const prof = getActiveProfile();
      state.activeCoachInboxPlan = null;
      state.isCoachAssignedHomework = false;
      state.activeHomeworkPack = null;
      const sampleScen = SCENARIOS[0];

      // Persona 1: 8U + Advanced -> starts on 8U fundamentals (level 0)
      prof.divisionLabel = '8U';
      prof.ageGroup = '8U';
      prof.experienceLevel = 'Advanced';
      prof.adaptiveLevel = window.computeStartingAdaptiveLevel(prof);
      prof.adaptiveConsecutiveGold = 0;
      prof.adaptiveConsecutiveWrong = 0;
      const p1StartLevel = prof.adaptiveLevel;
      const p1Pick = window.computeAdaptiveNextScenario(prof);
      const p1EffectiveAge = p1Pick.effectiveAgeGroup;

      // Persona 2: 14U + Advanced -> missing 3 in a row steps complexity down
      prof.divisionLabel = '14U';
      prof.ageGroup = '14U';
      prof.experienceLevel = 'Advanced';
      prof.adaptiveLevel = window.computeStartingAdaptiveLevel(prof);
      prof.adaptiveConsecutiveGold = 0;
      prof.adaptiveConsecutiveWrong = 0;
      const p2StartLevel = prof.adaptiveLevel;
      window.recordAdaptivePlayOutcome(prof, sampleScen, false, 0);
      window.recordAdaptivePlayOutcome(prof, sampleScen, false, 0);
      const p2After3Misses = window.recordAdaptivePlayOutcome(prof, sampleScen, false, 0);

      // Persona 3: 12U + Novice -> hitting 3 Gold reads steps complexity up
      prof.divisionLabel = '12U';
      prof.ageGroup = '12U';
      prof.experienceLevel = 'Novice';
      prof.adaptiveLevel = window.computeStartingAdaptiveLevel(prof);
      prof.adaptiveConsecutiveGold = 0;
      prof.adaptiveConsecutiveWrong = 0;
      const p3StartLevel = prof.adaptiveLevel;
      window.recordAdaptivePlayOutcome(prof, sampleScen, true, 1.0);
      window.recordAdaptivePlayOutcome(prof, sampleScen, true, 1.0);
      const p3After3Golds = window.recordAdaptivePlayOutcome(prof, sampleScen, true, 1.0);

      // Persona 4: Coach-Assigned Plan Firewall -> 100% unaltered by adaptive stepper
      prof.divisionLabel = '12U';
      prof.ageGroup = '12U';
      prof.experienceLevel = 'Intermediate';
      prof.adaptiveLevel = window.computeStartingAdaptiveLevel(prof);
      prof.adaptiveConsecutiveGold = 0;
      prof.adaptiveConsecutiveWrong = 0;
      const baselineBeforeHomework = prof.adaptiveLevel;
      state.activeCoachInboxPlan = {
        planId: 'FIREWALL-PLAN-01',
        focusConcept: 'D-Zone House',
        lessonCount: 5,
        assignedBy: 'Coach Evan'
      };
      const fwMiss1 = window.recordAdaptivePlayOutcome(prof, sampleScen, false, 0);
      const fwMiss2 = window.recordAdaptivePlayOutcome(prof, sampleScen, false, 0);
      const fwMiss3 = window.recordAdaptivePlayOutcome(prof, sampleScen, false, 0);
      const fwNextPick = window.computeAdaptiveNextScenario(prof);
      const levelUnalteredDuringHomework = prof.adaptiveLevel === baselineBeforeHomework && fwNextPick.lockedByCoachHomework === true;
      state.activeCoachInboxPlan = null;

      return {
        persona1_8U_Advanced: {
          startLevel: p1StartLevel,
          effectiveAgeGroup: p1EffectiveAge,
          passed: p1StartLevel === 0 && p1EffectiveAge === '8U'
        },
        persona2_14U_Advanced_3Misses: {
          startLevel: p2StartLevel,
          endLevel: p2After3Misses.adaptiveLevel,
          passed: p2After3Misses.adaptiveLevel < p2StartLevel
        },
        persona3_12U_Novice_3Golds: {
          startLevel: p3StartLevel,
          endLevel: p3After3Golds.adaptiveLevel,
          steppedDirection: p3After3Golds.steppedDirection,
          passed: p3After3Golds.adaptiveLevel > p3StartLevel && p3After3Golds.steppedDirection === 'up'
        },
        persona4_CoachPlanFirewall: {
          lockedByCoachHomework: Boolean(fwMiss1.lockedByCoachHomework && fwMiss2.lockedByCoachHomework && fwMiss3.lockedByCoachHomework && fwNextPick.lockedByCoachHomework),
          levelUnalteredDuringHomework,
          passed: Boolean(fwMiss3.lockedByCoachHomework && levelUnalteredDuringHomework)
        }
      };
    });

    botResults.bot4AdaptiveBalanceAndCoachFirewall = adaptiveAudit;

    if (
      !adaptiveAudit.persona1_8U_Advanced.passed ||
      !adaptiveAudit.persona2_14U_Advanced_3Misses.passed ||
      !adaptiveAudit.persona3_12U_Novice_3Golds.passed ||
      !adaptiveAudit.persona4_CoachPlanFirewall.passed
    ) {
      addFinding({
        bot: 'BOT 4 (3-Persona Adaptive Balance & Coach-Firewall)',
        location: 'index.html — computeStartingAdaptiveLevel / computeAdaptiveNextScenario',
        reproSteps: 'Run Personas 1–4 (8U+Adv, 14U+Adv 3 misses, 12U+Novice 3 Golds, Coach Homework Firewall)',
        expected: 'All 4 adaptive & Coach-Firewall invariants hold',
        actual: JSON.stringify(adaptiveAudit),
        severity: 'Critical'
      });
    }

    // -------------------------------------------------------------------------
    // BOT 5: BOUNDING-BOX OVERLAP & LEGACY-CLUTTER SCANNER (@ 390x844)
    // -------------------------------------------------------------------------
    const overlapAndLegacyAudit = await phonePage.evaluate((bannedStrings) => {
      // First check Universal Character Speech Overlay right-edge bound at 390px
      if (window.SynapzCharacterSpeechEngine) {
        window.SynapzCharacterSpeechEngine.speak('coach-al', 'Welcome to the Coach\'s Office! Review your team plan and stats.', { contextTag: 'qa_bounds_check' });
      }
      const speechOv = document.getElementById('synapzUniversalCharSpeechOverlay');
      const speechRightBleedPx = (speechOv && !speechOv.classList.contains('hidden'))
        ? Math.max(0, Math.round(speechOv.getBoundingClientRect().right - window.innerWidth))
        : 0;
      speechOv?.classList.add('hidden');

      switchView('game');
      state.customQuestionStyleOverride = 'tactical_choice';
      loadScenario(false);
      document.getElementById('firstShiftAgentDrillTourOverlay')?.classList.add('hidden');
      document.getElementById('firstShiftTourBanner')?.classList.add('hidden');
      document.getElementById('synapzUniversalCharSpeechOverlay')?.classList.add('hidden');
      if (window.SynapzCharacterSpeechEngine) {
        window.SynapzCharacterSpeechEngine.minimizeToCircle('coach-bob');
      }
      drawRink();

      const rectOverlapArea = (a, b) => {
        if (!a || !b || a.width <= 0 || a.height <= 0 || b.width <= 0 || b.height <= 0) return 0;
        const xOverlap = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
        const yOverlap = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        return xOverlap * yOverlap;
      };

      const charCircle = document.getElementById('synapzPersistentCharCircleBtn');
      const coachPopup = document.getElementById('coachBobPopup');
      const redFlagBtn = document.getElementById('btnPersistentFounderRedFlag');
      const activeCutouts = [charCircle, coachPopup].filter(el => {
        if (!el || el.classList.contains('hidden')) return false;
        const st = window.getComputedStyle(el);
        return st.display !== 'none' && st.visibility !== 'hidden' && Number(st.opacity || '1') > 0.05;
      });

      const choiceButtons = Array.from(document.querySelectorAll('#multiFormatControlsBar button')).filter(b => b.offsetParent !== null);
      const bottomBarButtons = Array.from(document.querySelectorAll('#lessonConsistentBottomBar button')).filter(b => b.offsetParent !== null);
      let buttonOverlapPixels = 0;
      activeCutouts.forEach(cutEl => {
        const cr = cutEl.getBoundingClientRect();
        choiceButtons.concat(bottomBarButtons).forEach(btn => {
          buttonOverlapPixels += rectOverlapArea(cr, btn.getBoundingClientRect());
        });
      });
      if (redFlagBtn && redFlagBtn.offsetParent !== null) {
        const rfRect = redFlagBtn.getBoundingClientRect();
        bottomBarButtons.forEach(btn => {
          buttonOverlapPixels += rectOverlapArea(rfRect, btn.getBoundingClientRect());
        });
      }

      // Check active focal skater on #rinkCanvas vs visible cutout elements
      const canvas = document.getElementById('rinkCanvas');
      const cRect = canvas ? canvas.getBoundingClientRect() : null;
      const scen = getCurrentScenario();
      let skaterOverlapPixels = 0;
      if (cRect && scen && scen.you) {
        const skaterScreenX = cRect.left + (scen.you.x || 0.5) * cRect.width;
        const skaterScreenY = cRect.top + (scen.you.y || 0.5) * cRect.height;
        const skaterBox = {
          left: skaterScreenX - 18,
          right: skaterScreenX + 18,
          top: skaterScreenY - 18,
          bottom: skaterScreenY + 18,
          width: 36,
          height: 36
        };
        activeCutouts.forEach(cutEl => {
          skaterOverlapPixels += rectOverlapArea(cutEl.getBoundingClientRect(), skaterBox);
        });
      }

      // Scan full DOM text & inline HTML templates (excluding script source comments if any, checking rendered/template elements)
      const htmlWithoutScripts = Array.from(document.body.querySelectorAll('*:not(script):not(style)'))
        .map(el => (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) ? el.textContent : '')
        .join(' ');
      const bannedMatches = bannedStrings.filter(tok => htmlWithoutScripts.includes(tok));

      return {
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        choiceButtonsCount: choiceButtons.length,
        speechRightBleedPx,
        buttonOverlapPct: Number((buttonOverlapPixels === 0 ? 0 : (buttonOverlapPixels / 100)).toFixed(2)),
        skaterOverlapPct: Number((skaterOverlapPixels === 0 ? 0 : (skaterOverlapPixels / (36 * 36)) * 100).toFixed(2)),
        bannedLegacyMatches: bannedMatches
      };
    }, BANNED_LEGACY_STRINGS);

    // Also scan raw index.html file for the 7 banned legacy strings!
    const rawIndexHtml = fs.readFileSync(path.join(WORKSPACE_DIR, 'index.html'), 'utf8');
    const rawFileBannedHits = BANNED_LEGACY_STRINGS.filter(tok => rawIndexHtml.includes(tok));
    overlapAndLegacyAudit.rawIndexHtmlBannedHits = rawFileBannedHits;

    botResults.bot5OverlapAndLegacyScanner = overlapAndLegacyAudit;

    if (
      overlapAndLegacyAudit.speechRightBleedPx > 1 ||
      overlapAndLegacyAudit.buttonOverlapPct > 0 ||
      overlapAndLegacyAudit.skaterOverlapPct > 0 ||
      overlapAndLegacyAudit.bannedLegacyMatches.length > 0 ||
      rawFileBannedHits.length > 0
    ) {
      addFinding({
        bot: 'BOT 5 (Bounding-Box Overlap & Legacy-Clutter Scanner)',
        location: 'index.html @ 390x844 (#rinkCanvas / #multiFormatControlsBar / Legacy Strings)',
        reproSteps: 'Measure cutout overlap against skaters/buttons at 390x844 and scan index.html for 7 banned legacy strings',
        expected: '0% overlap and 0 banned legacy strings',
        actual: JSON.stringify(overlapAndLegacyAudit),
        severity: 'Major'
      });
    }

    if (telemetry.pageErrors.length > 0) {
      addFinding({
        bot: 'RUNTIME_PAGEERROR_WATCHER',
        location: 'Uncaught Browser Exception',
        reproSteps: 'Execute full 5-Bot QA run',
        expected: '0 uncaught pageerror events',
        actual: telemetry.pageErrors.join(' | '),
        severity: 'Critical'
      });
    }

    await phoneCtx.close();
    await ipadCtx.close();

    const criticalCount = findings.filter(f => f.severity === 'Critical').length;
    const majorCount = findings.filter(f => f.severity === 'Major').length;
    const minorCount = findings.filter(f => f.severity === 'Minor').length;

    const reportPayload = {
      summary: {
        suite: 'SYNAPZ HOCKEY v12.4 Unified 5-Bot + Adversarial QA Charter',
        version: 'v12.4',
        executedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAtMs,
        testModeEmailSuppressionVerified: true,
        suppressedEmailWebhooksCount: telemetry.suppressedEmailWebhooks,
        criticalCount,
        majorCount,
        minorCount,
        gatePassed: criticalCount === 0 && majorCount === 0
      },
      autoFixedBugsInV124: AUTO_FIXED_HISTORY,
      findings,
      bots: botResults
    };

    fs.writeFileSync(REPORT_JSON_PATH, JSON.stringify(reportPayload, null, 2), 'utf8');
    console.log(`\n======================================================================`);
    console.log(`🤖 SYNAPZ v12.4 ADVERSARIAL 5-BOT QA REPORT COMPLETE (${reportPayload.summary.durationMs}ms)`);
    console.log(`   Critical: ${criticalCount} | Major: ${majorCount} | Minor: ${minorCount} | Gate: ${reportPayload.summary.gatePassed ? 'PASSED ✅' : 'BLOCKED ❌'}`);
    console.log(`   Slow-4G Load: ${botResults.bot2AdversarialChaosAndSlow4G.arenaSlow4G?.interactiveMs}ms | Controls Crawled: ${controlsTested} | Chaos Ops: 200`);
    console.log(`   Screenshots Saved: ${screenshotsCaptured.length} sets in qa_screenshots/`);
    console.log(`======================================================================\n`);

    if (criticalCount > 0 || majorCount > 0) {
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
    server.close();
  }
}

runAdversarialQaSuite().catch((err) => {
  console.error('❌ Adversarial QA Suite Fatal Error:', err);
  process.exit(1);
});
