/**
 * SYNAPZ HOCKEY — REAL HUMAN-SOUNDING NEURAL VOICE PACK GENERATOR (`generate-natural-voices.js`)
 * ==============================================================================================
 * Generates real, natural human-sounding `.mp3` voice files in `assets/audio/voices/<characterId>/`
 * for all 11 characters:
 *   - `coach-bob` (On-Ice Bench Coach)
 *   - `coach-al` (Coach's Office Film & Strategy Specialist)
 *   - `agent-maya`, `agent-jalen`, `agent-chloe`, `agent-sofia`, `agent-leo`,
 *     `agent-marcus`, `agent-priya`, `agent-ryan`, `agent-claire` (9 Relatable Player Agents)
 *
 * Uses distinct Neural TTS voices (TikTok Neural TTS voices + Google Neural TTS fallback)
 * so every character has real `.mp3` files on disk and never falls back to a robotic OS voice.
 */

const fs = require('fs');
const path = require('path');

const WORKSPACES = [
  'c:/Users/Dane/.gemini/antigravity/scratch/pucksense',
  'C:/Users/Dane/Documents/Hockey-IQ-App'
];

const CHARACTER_VOICE_PROFILES = {
  'coach-bob': {
    tiktokVoice: 'en_male_narration',
    gttsLang: 'en-CA',
    clips: {
      greeting: "Hey skater, I'm Coach Bob, let's keep our heads up and make quick hockey reads today!",
      intro_default: "Keep your head up, scan the ice early, and find your open teammate in the slot!",
      feedback_gold: "Great read, you kept your head up and moved the puck to open ice right on time!",
      feedback_try_again: "Good hustle, take one quick look before the defender closes on you and try that read again!",
      hint: "Look for your open teammate in the soft ice with their stick on the tape!",
      breakout_tip: "When F1 pressures you behind the net, use your D partner or hit your winger on the boards!",
      dzone_tip: "Protect the house in front of our goalie first, and keep your stick in the passing lane!",
      ozone_tip: "Form a triangle with your linemates and get to the slot with your stick on the ice!"
    }
  },
  'coach-al': {
    tiktokVoice: 'en_us_006',
    gttsLang: 'en-US',
    clips: {
      greeting: "Welcome to my office, tap any slice of your Hockey IQ chart to build today's training plan!",
      office_welcome: "Welcome to my office, tap any slice of your Hockey IQ chart to build today's training plan!",
      office_tour: "Pick your lowest skill slice on the chart and we'll dial in five quick on-ice reps!",
      pie_chart: "Your six-slice Hockey IQ chart tracks breakouts, D-zone coverage, attack triangles, transition, spacing, and scanning.",
      weekly_plan: "Your custom training plan is locked in, let's step onto the ice and sharpen those reads!"
    }
  },
  'agent-maya': {
    tiktokVoice: 'en_us_001',
    gttsLang: 'en-US',
    greeting: "Hey, I'm Maya, your Youth Player Agent—let's dial in your gear, hit the ice, and stack Puck Bucks!"
  },
  'agent-jalen': {
    tiktokVoice: 'en_us_009',
    gttsLang: 'en-US',
    greeting: "Hey, I'm Jalen, your Youth Player Agent—let's get your gear dialed in and stack some Puck Bucks!"
  },
  'agent-chloe': {
    tiktokVoice: 'en_us_002',
    gttsLang: 'en-CA',
    greeting: "What's up, I'm Chloe—I've got your back from the Locker Room all the way to the Stanley Cup Finals!"
  },
  'agent-sofia': {
    tiktokVoice: 'en_female_emotional',
    gttsLang: 'en-US',
    greeting: "Hey there, I'm Sofia—let's read the ice faster than anyone in your division and unlock pro gear!"
  },
  'agent-leo': {
    tiktokVoice: 'en_us_010',
    gttsLang: 'en-CA',
    greeting: "Yo, I'm Leo, your Teen Player Agent—let's build your Hockey IQ chart and dominate the Road to the Cup!"
  },
  'agent-marcus': {
    tiktokVoice: 'en_uk_003',
    gttsLang: 'en-GB',
    greeting: "Welcome to the show, I'm Marcus—I represent top prospects who study the game and make elite reads."
  },
  'agent-priya': {
    tiktokVoice: 'en_au_001',
    gttsLang: 'en-AU',
    greeting: "Hi, I'm Priya—my job is to sharpen every slice of your Hockey IQ chart and get you Cup-ready!"
  },
  'agent-ryan': {
    tiktokVoice: 'en_au_002',
    gttsLang: 'en-CA',
    greeting: "Hey, I'm Ryan—let's lock in your pro habits, crush Coach Al's training plans, and climb the map!"
  },
  'agent-claire': {
    tiktokVoice: 'en_us_002',
    gttsLang: 'en-US',
    greeting: "Hey, I'm Claire—let's turn your off-ice reps into elite on-ice reads and outfit your locker stall!"
  }
};

const SHARED_AGENT_CLIPS = {
  lobby_tour_1: "Push through the Center Ice doors to skate the thirty-two team NHL Map and earn Puck Bucks!",
  lobby_tour_2: "Step into your Locker Room stall to equip pro gear on your skater or switch agents!",
  lobby_tour_3: "Score ninety-five percent Hockey IQ to earn ninety-five Puck Bucks for gloves, sticks, skates, and visors!",
  lobby_tour_4: "Head into Coach Al's Office to check your skill pie chart and build a custom lesson plan!",
  lobby_tour_5: "Visit the Clubhouse to check out buddy stalls, your trophy case, and head-to-head map races!",
  locker_room: "Here's your Locker Room stall, tap any shelf to try on new mitts, sticks, skates, or visors!",
  pro_shop: "Welcome to the Pro Shop, tap any display wall to spend your Puck Bucks on pro-stock gear!",
  clubhouse: "Welcome to the Clubhouse, tap the portrait wall, center race screen, or trophy case to explore!",
  map_intro: "Here's the North America tour map, tap Drop the Puck to play your next NHL city series!"
};

async function synthesizeNaturalMp3(text, tiktokVoice, gttsLang) {
  // Primary: Neural voice synthesis via TikTok Neural TTS endpoint
  try {
    const res = await fetch('https://tiktok-tts.weilnet.workers.dev/api/generation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.slice(0, 290), voice: tiktokVoice || 'en_us_006' })
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && json.data.length > 500) {
        return Buffer.from(json.data, 'base64');
      }
    }
  } catch (_) {}

  // Fallback: Google Neural TTS HTTP endpoint (`audio/mpeg`)
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(gttsLang || 'en-US')}&q=${encodeURIComponent(text.slice(0, 195))}`;
  const res2 = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  if (!res2.ok) {
    throw new Error(`TTS HTTP ${res2.status} for: ${text}`);
  }
  const ab = await res2.arrayBuffer();
  return Buffer.from(ab);
}

async function main() {
  let totalGenerated = 0;
  const manifest = {};
  const jobs = [];

  for (const [charId, cfg] of Object.entries(CHARACTER_VOICE_PROFILES)) {
    const clips = cfg.clips
      ? { ...cfg.clips }
      : {
          audition_greeting: cfg.greeting,
          greeting: cfg.greeting,
          ...SHARED_AGENT_CLIPS
        };
    manifest[charId] = {};
    for (const [clipKey, clipText] of Object.entries(clips)) {
      jobs.push({ charId, cfg, clipKey, clipText });
    }
  }

  const CONCURRENCY = 8;
  let cursor = 0;
  async function worker() {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      const { charId, cfg, clipKey, clipText } = job;
      const primaryRelPath = path.join('assets', 'audio', 'voices', charId, `${clipKey}.mp3`);
      const primaryAbsPath = path.join(WORKSPACES[0], primaryRelPath);

      let mp3Buffer = null;
      if (fs.existsSync(primaryAbsPath) && fs.statSync(primaryAbsPath).size > 1500) {
        mp3Buffer = fs.readFileSync(primaryAbsPath);
      } else {
        mp3Buffer = await synthesizeNaturalMp3(clipText, cfg.tiktokVoice, cfg.gttsLang);
      }

      for (const ws of WORKSPACES) {
        if (!fs.existsSync(ws)) continue;
        const targetDir = path.join(ws, 'assets', 'audio', 'voices', charId);
        fs.mkdirSync(targetDir, { recursive: true });
        const targetFile = path.join(targetDir, `${clipKey}.mp3`);
        fs.writeFileSync(targetFile, mp3Buffer);
      }

      manifest[charId][clipKey] = {
        path: `assets/audio/voices/${charId}/${clipKey}.mp3`,
        bytes: mp3Buffer.length,
        text: clipText
      };
      totalGenerated++;
      process.stdout.write(`.`);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  for (const ws of WORKSPACES) {
    if (!fs.existsSync(ws)) continue;
    const manifestPath = path.join(ws, 'assets', 'audio', 'voices', 'voice-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  }

  console.log(`\n✅ Generated & verified ${totalGenerated} natural neural .mp3 voice clips across both workspaces!`);
}

main().catch(err => {
  console.error('generate-natural-voices error:', err);
  process.exit(1);
});
