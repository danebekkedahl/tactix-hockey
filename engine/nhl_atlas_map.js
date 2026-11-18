/**
 * SYNAPZ HOCKEY v15.1 — Real Zoomable/Pannable US & Canada 32-City NHL Atlas Map
 * (`engine/nhl_atlas_map.js`)
 *
 * Replaces the legacy blue gradient circle with a true Albers Conic Projected
 * North America Geographic Vector Atlas:
 *   - Accurate US & Canada coastlines, all 5 Great Lakes, US state borders,
 *     and Canadian province borders in a championship dark-slate & ice-blue theme.
 *   - All 32 NHL cities plotted at true projected geographic coordinates (`SEA..FLA`)
 *     with subtle tour route lines.
 *   - Smooth 1.0x–4.0x Zoom (`+ / − / Reset` + mouse wheel + touch pinch) & Drag-Pan
 *     with counter-scaled city pins & dynamic zero-overlap label placement so dense
 *     East Coast / Metro clusters (`NYR, NYI, NJD, PHI, BOS, MTL, TOR, OTT, BUF`)
 *     separate cleanly with zero overlapping text.
 *   - Opens to a 100% unobstructed map (`0` auto-popped friend cards), plots `You • #[Number]`
 *     + strictly real accepted friends only, and opens a floating detail popover
 *     with live 360° Skater preview on tap.
 */

import { renderCustomizableSkater } from './skater_renderer_360.js';

function escMap(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * True Albers Equal-Area Conic Projection for US & Southern/Central Canada
 * mapped cleanly into a `1000 x 560` SVG coordinate space.
 */
const DEG2RAD = Math.PI / 180;
const PHI1 = 29.5 * DEG2RAD;
const PHI2 = 45.5 * DEG2RAD;
const PHI0 = 40.5 * DEG2RAD;
const LAMBDA0 = -96.0 * DEG2RAD;
const N_CONE = 0.5 * (Math.sin(PHI1) + Math.sin(PHI2));
const C_CONE = Math.cos(PHI1) * Math.cos(PHI1) + 2 * N_CONE * Math.sin(PHI1);
const RHO0 = Math.sqrt(C_CONE - 2 * N_CONE * Math.sin(PHI0)) / N_CONE;
const PROJ_SCALE = 1160;
const PROJ_CX = 495;
const PROJ_CY = 312;

export function projectNorthAmericaLatLon(lat, lon) {
  const phi = Number(lat) * DEG2RAD;
  const lam = Number(lon) * DEG2RAD;
  const theta = N_CONE * (lam - LAMBDA0);
  const rho = Math.sqrt(Math.max(0.0001, C_CONE - 2 * N_CONE * Math.sin(phi))) / N_CONE;
  const x = PROJ_CX + PROJ_SCALE * rho * Math.sin(theta);
  const y = PROJ_CY - PROJ_SCALE * (RHO0 - rho * Math.cos(theta));
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

function polyPathFromLatLon(coords, close = true) {
  if (!Array.isArray(coords) || coords.length === 0) return '';
  const pts = coords.map(([lat, lon]) => projectNorthAmericaLatLon(lat, lon));
  return pts.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ') + (close ? ' Z' : '');
}

// ============================================================================
// CANADIAN PROVINCES (Real Geographic Lat/Lon Boundaries)
// ============================================================================
const CANADA_PROVINCE_POLYGONS = [
  {
    code: 'BC',
    name: 'British Columbia',
    coords: [
      [49.0, -123.2], [49.8, -124.8], [51.2, -127.8], [54.3, -130.4],
      [56.5, -131.2], [58.5, -133.5], [60.0, -139.0], [60.0, -120.0],
      [54.0, -120.0], [52.8, -118.4], [51.0, -116.0], [49.0, -114.1], [49.0, -123.2]
    ]
  },
  {
    code: 'BC-VI',
    name: 'Vancouver Island',
    coords: [
      [48.35, -123.5], [48.6, -124.7], [49.7, -126.8], [50.7, -128.3],
      [50.4, -126.4], [49.2, -123.9], [48.35, -123.5]
    ]
  },
  {
    code: 'AB',
    name: 'Alberta',
    coords: [
      [49.0, -114.1], [51.0, -116.0], [52.8, -118.4], [54.0, -120.0],
      [60.0, -120.0], [60.0, -110.0], [49.0, -110.0], [49.0, -114.1]
    ]
  },
  {
    code: 'SK',
    name: 'Saskatchewan',
    coords: [
      [49.0, -110.0], [60.0, -110.0], [60.0, -101.9], [49.0, -101.4], [49.0, -110.0]
    ]
  },
  {
    code: 'MB',
    name: 'Manitoba',
    coords: [
      [49.0, -101.4], [60.0, -101.9], [60.0, -94.8], [58.8, -94.1],
      [57.0, -92.4], [56.8, -89.0], [52.8, -95.1], [49.0, -95.2], [49.0, -101.4]
    ]
  },
  {
    code: 'ON',
    name: 'Ontario',
    coords: [
      [49.0, -95.2], [52.8, -95.1], [56.8, -89.0], [55.2, -82.3],
      [51.3, -79.6], [47.5, -79.5], [46.3, -78.8], [45.5, -76.4],
      [45.0, -74.7], [44.1, -76.5], [43.6, -79.4], [42.9, -79.0],
      [42.0, -82.6], [42.3, -83.1], [43.0, -82.4], [45.9, -83.5],
      [46.5, -84.4], [48.0, -89.5], [48.6, -93.8], [49.0, -95.2]
    ]
  },
  {
    code: 'QC',
    name: 'Quebec',
    coords: [
      [45.0, -74.7], [45.5, -76.4], [46.3, -78.8], [47.5, -79.5],
      [51.3, -79.6], [54.8, -79.2], [56.8, -76.5], [58.5, -68.0],
      [52.0, -65.5], [50.2, -61.5], [49.2, -65.0], [48.8, -64.3],
      [47.9, -66.2], [47.3, -69.2], [46.8, -71.2], [45.0, -71.5], [45.0, -74.7]
    ]
  },
  {
    code: 'NB',
    name: 'New Brunswick',
    coords: [
      [45.1, -67.1], [47.3, -69.2], [47.9, -66.2], [47.8, -64.5],
      [46.0, -64.1], [45.2, -66.0], [45.1, -67.1]
    ]
  },
  {
    code: 'NS',
    name: 'Nova Scotia',
    coords: [
      [43.5, -65.6], [44.6, -66.1], [45.8, -64.2], [46.9, -60.4],
      [45.6, -60.8], [44.6, -63.5], [43.5, -65.6]
    ]
  },
  {
    code: 'PEI',
    name: 'Prince Edward Island',
    coords: [
      [46.0, -64.0], [47.0, -64.0], [46.5, -62.0], [46.0, -62.6], [46.0, -64.0]
    ]
  }
];

// ============================================================================
// UNITED STATES (Contiguous State Boundaries in Real Geographic Lat/Lon)
// ============================================================================
const US_STATE_POLYGONS = [
  { code: 'WA', coords: [[49.0, -123.2], [49.0, -117.0], [46.0, -117.0], [45.6, -121.2], [46.25, -124.0], [48.4, -124.7], [48.2, -122.7], [49.0, -123.2]] },
  { code: 'OR', coords: [[46.25, -124.0], [45.6, -121.2], [46.0, -117.0], [42.0, -117.0], [42.0, -124.2], [44.6, -124.1], [46.25, -124.0]] },
  { code: 'CA', coords: [[42.0, -124.2], [42.0, -120.0], [39.0, -120.0], [35.0, -114.6], [32.7, -114.7], [32.55, -117.1], [33.8, -118.4], [34.45, -120.5], [36.6, -121.9], [37.8, -122.5], [40.4, -124.4], [42.0, -124.2]] },
  { code: 'ID', coords: [[49.0, -117.0], [49.0, -116.05], [47.7, -115.7], [45.6, -113.9], [44.5, -111.05], [42.0, -111.05], [42.0, -117.0], [46.0, -117.0], [49.0, -117.0]] },
  { code: 'NV', coords: [[42.0, -120.0], [42.0, -114.05], [37.0, -114.05], [35.0, -114.6], [39.0, -120.0], [42.0, -120.0]] },
  { code: 'MT', coords: [[49.0, -116.05], [49.0, -104.05], [45.0, -104.05], [45.0, -111.05], [44.5, -111.05], [45.6, -113.9], [47.7, -115.7], [49.0, -116.05]] },
  { code: 'WY', coords: [[45.0, -111.05], [45.0, -104.05], [41.0, -104.05], [41.0, -111.05], [45.0, -111.05]] },
  { code: 'UT', coords: [[42.0, -114.05], [42.0, -111.05], [41.0, -111.05], [41.0, -109.05], [37.0, -109.05], [37.0, -114.05], [42.0, -114.05]] },
  { code: 'AZ', coords: [[37.0, -114.05], [37.0, -109.05], [31.33, -109.05], [31.33, -111.1], [32.5, -114.8], [35.0, -114.6], [37.0, -114.05]] },
  { code: 'CO', coords: [[41.0, -109.05], [41.0, -102.05], [37.0, -102.05], [37.0, -109.05], [41.0, -109.05]] },
  { code: 'NM', coords: [[37.0, -109.05], [37.0, -103.0], [32.0, -103.0], [32.0, -106.6], [31.33, -109.05], [37.0, -109.05]] },
  { code: 'ND', coords: [[49.0, -104.05], [49.0, -97.2], [45.94, -96.55], [45.94, -104.05], [49.0, -104.05]] },
  { code: 'SD', coords: [[45.94, -104.05], [45.94, -96.55], [42.5, -96.45], [43.0, -104.05], [45.94, -104.05]] },
  { code: 'NE', coords: [[43.0, -104.05], [42.5, -96.45], [40.0, -95.3], [40.0, -102.05], [41.0, -102.05], [41.0, -104.05], [43.0, -104.05]] },
  { code: 'KS', coords: [[40.0, -102.05], [40.0, -95.3], [39.1, -94.6], [37.0, -94.6], [37.0, -102.05], [40.0, -102.05]] },
  { code: 'OK', coords: [[37.0, -103.0], [37.0, -94.6], [33.9, -94.5], [33.8, -96.6], [34.5, -100.0], [36.5, -100.0], [36.5, -103.0], [37.0, -103.0]] },
  { code: 'TX', coords: [[36.5, -103.0], [36.5, -100.0], [34.5, -100.0], [33.8, -96.6], [33.9, -94.5], [31.2, -93.6], [29.7, -93.8], [28.4, -96.4], [26.0, -97.15], [27.5, -99.5], [29.8, -101.4], [29.0, -103.1], [31.8, -106.5], [32.0, -103.0], [36.5, -103.0]] },
  { code: 'MN', coords: [[49.0, -97.2], [49.0, -95.15], [48.0, -89.6], [46.8, -92.1], [44.5, -92.1], [43.5, -91.2], [43.5, -96.45], [45.94, -96.55], [49.0, -97.2]] },
  { code: 'IA', coords: [[43.5, -96.45], [43.5, -91.2], [41.5, -90.2], [40.4, -91.4], [40.6, -95.8], [42.5, -96.45], [43.5, -96.45]] },
  { code: 'MO', coords: [[40.6, -95.8], [40.4, -91.4], [38.7, -90.15], [37.0, -89.1], [36.0, -89.7], [36.5, -94.6], [39.1, -94.6], [40.0, -95.3], [40.6, -95.8]] },
  { code: 'AR', coords: [[36.5, -94.6], [36.0, -89.7], [33.0, -91.15], [33.0, -94.05], [33.9, -94.5], [36.5, -94.6]] },
  { code: 'LA', coords: [[33.0, -94.05], [33.0, -91.15], [31.0, -91.6], [31.0, -89.7], [29.2, -89.1], [29.5, -91.4], [29.7, -93.8], [31.2, -93.6], [33.0, -94.05]] },
  { code: 'WI', coords: [[46.8, -92.1], [46.6, -90.2], [45.8, -88.1], [45.1, -87.6], [42.5, -87.8], [42.5, -90.65], [44.5, -92.1], [46.8, -92.1]] },
  { code: 'IL', coords: [[42.5, -90.65], [42.5, -87.8], [41.7, -87.5], [38.7, -87.5], [37.0, -89.1], [38.7, -90.15], [40.4, -91.4], [41.5, -90.2], [42.5, -90.65]] },
  { code: 'MI', coords: [[41.75, -86.8], [43.5, -86.5], [45.8, -84.7], [45.1, -83.3], [43.0, -82.4], [41.75, -83.45], [41.75, -86.8]] },
  { code: 'MI-UP', coords: [[46.6, -90.2], [47.4, -88.0], [46.5, -84.4], [45.9, -83.6], [45.8, -88.1], [46.6, -90.2]] },
  { code: 'IN', coords: [[41.75, -87.5], [41.75, -84.8], [38.8, -84.8], [37.8, -87.9], [38.7, -87.5], [41.75, -87.5]] },
  { code: 'OH', coords: [[41.75, -84.8], [41.75, -83.45], [41.4, -82.1], [41.98, -80.52], [39.1, -80.52], [38.4, -82.6], [39.1, -84.8], [41.75, -84.8]] },
  { code: 'KY', coords: [[39.1, -84.8], [38.4, -82.6], [37.2, -82.0], [36.6, -83.7], [36.5, -89.5], [37.8, -87.9], [38.8, -84.8], [39.1, -84.8]] },
  { code: 'TN', coords: [[36.5, -89.5], [36.6, -83.7], [36.5, -81.7], [35.0, -84.3], [35.0, -90.3], [36.5, -89.5]] },
  { code: 'MS', coords: [[35.0, -90.3], [35.0, -88.2], [30.2, -88.4], [31.0, -89.7], [31.0, -91.6], [33.0, -91.15], [35.0, -90.3]] },
  { code: 'AL', coords: [[35.0, -88.2], [35.0, -85.6], [32.9, -85.2], [31.0, -85.0], [31.0, -87.6], [30.2, -87.5], [30.2, -88.4], [35.0, -88.2]] },
  { code: 'GA', coords: [[35.0, -85.6], [35.0, -83.1], [32.0, -80.85], [30.7, -81.5], [30.7, -84.9], [32.9, -85.2], [35.0, -85.6]] },
  { code: 'FL', coords: [[31.0, -87.6], [31.0, -85.0], [30.7, -81.5], [28.5, -80.6], [25.2, -80.3], [25.8, -81.4], [27.8, -82.8], [29.9, -84.4], [30.2, -87.5], [31.0, -87.6]] },
  { code: 'SC', coords: [[35.2, -82.6], [35.2, -80.8], [33.85, -78.55], [32.0, -80.85], [35.0, -83.1], [35.2, -82.6]] },
  { code: 'NC', coords: [[36.55, -81.7], [36.55, -75.85], [35.2, -75.5], [33.85, -78.55], [35.2, -80.8], [35.2, -82.6], [35.0, -84.3], [36.55, -81.7]] },
  { code: 'VA', coords: [[39.46, -78.35], [38.9, -77.05], [37.9, -76.2], [36.55, -75.85], [36.55, -83.6], [37.2, -82.0], [38.0, -79.9], [39.46, -78.35]] },
  { code: 'WV', coords: [[40.6, -80.52], [39.72, -79.48], [39.46, -78.35], [38.0, -79.9], [37.2, -82.0], [38.4, -82.6], [39.1, -80.52], [40.6, -80.52]] },
  { code: 'MD-DE', coords: [[39.72, -79.48], [39.72, -75.55], [38.45, -75.05], [38.0, -75.9], [38.9, -77.05], [39.46, -78.35], [39.72, -79.48]] },
  { code: 'PA', coords: [[42.25, -79.76], [42.0, -79.76], [42.0, -75.3], [41.35, -74.7], [39.8, -75.15], [39.72, -75.55], [39.72, -80.52], [41.98, -80.52], [42.25, -79.76]] },
  { code: 'NJ', coords: [[41.35, -74.7], [41.0, -73.9], [40.5, -74.0], [38.93, -74.9], [39.8, -75.15], [41.35, -74.7]] },
  { code: 'NY', coords: [[43.3, -79.05], [43.6, -76.2], [45.0, -74.7], [45.0, -73.35], [41.3, -73.55], [40.75, -73.98], [41.0, -73.9], [41.35, -74.7], [42.0, -75.3], [42.0, -79.76], [42.88, -78.9], [43.3, -79.05]] },
  { code: 'NY-LI', coords: [[40.6, -74.02], [40.88, -73.7], [41.12, -71.86], [40.6, -73.5], [40.6, -74.02]] },
  { code: 'CT-RI', coords: [[42.05, -73.5], [42.02, -71.4], [41.35, -71.15], [41.1, -73.65], [42.05, -73.5]] },
  { code: 'MA', coords: [[42.73, -73.26], [42.88, -70.82], [42.36, -71.0], [41.8, -69.95], [41.65, -70.6], [41.5, -71.15], [42.02, -71.4], [42.05, -73.5], [42.73, -73.26]] },
  { code: 'VT', coords: [[45.0, -73.35], [45.0, -71.5], [42.73, -72.55], [42.73, -73.26], [45.0, -73.35]] },
  { code: 'NH', coords: [[45.3, -71.1], [43.1, -70.7], [42.73, -71.2], [42.73, -72.55], [45.0, -71.5], [45.3, -71.1]] },
  { code: 'ME', coords: [[45.3, -71.1], [47.45, -69.2], [47.0, -67.8], [44.8, -66.95], [43.65, -70.25], [43.1, -70.7], [45.3, -71.1]] }
];

// ============================================================================
// THE 5 GREAT LAKES (Real Geographic Lat/Lon Shorelines)
// ============================================================================
const GREAT_LAKES_POLYGONS = [
  { name: 'Lake Superior', coords: [[46.78, -92.1], [47.95, -89.5], [48.75, -87.5], [47.7, -84.9], [46.5, -84.4], [46.6, -87.4], [46.6, -90.2], [46.78, -92.1]] },
  { name: 'Lake Michigan', coords: [[45.8, -87.1], [45.8, -84.8], [44.2, -86.4], [41.65, -87.2], [42.5, -87.8], [44.5, -87.5], [45.8, -87.1]] },
  { name: 'Lake Huron', coords: [[45.9, -84.6], [46.1, -82.1], [44.9, -80.0], [43.1, -82.4], [44.0, -83.8], [45.1, -83.3], [45.9, -84.6]] },
  { name: 'Lake Erie', coords: [[41.8, -83.4], [42.88, -78.92], [42.15, -80.1], [41.4, -82.2], [41.8, -83.4]] },
  { name: 'Lake Ontario', coords: [[43.25, -79.85], [43.65, -79.35], [44.15, -76.4], [43.5, -76.2], [43.25, -79.05], [43.25, -79.85]] }
];

// ============================================================================
// ALL 32 OFFICIAL NHL CITIES AT REAL PROJECTED GEOGRAPHIC COORDINATES
// ============================================================================
const RAW_32_NHL_CITIES = [
  { code: 'SJS', id: 'sanjose',      name: 'San Jose',      team: 'Sharks',            region: 'CA', lat: 37.33, lon: -121.90, focus: 'Puck Support & Basics' },
  { code: 'ANA', id: 'anaheim',      name: 'Anaheim',       team: 'Ducks',             region: 'CA', lat: 33.81, lon: -117.88, focus: '2-on-1 Support Lanes' },
  { code: 'LAK', id: 'losangeles',   name: 'Los Angeles',   team: 'Kings',             region: 'CA', lat: 34.04, lon: -118.27, focus: 'O-Zone Triangle Spacing' },
  { code: 'SEA', id: 'seattle',      name: 'Seattle',       team: 'Kraken',            region: 'WA', lat: 47.62, lon: -122.35, focus: 'High-Slot Coverage' },
  { code: 'VAN', id: 'vancouver',    name: 'Vancouver',     team: 'Canucks',           region: 'BC', lat: 49.28, lon: -123.11, focus: 'Protecting the House' },
  { code: 'CGY', id: 'calgary',      name: 'Calgary',       team: 'Flames',            region: 'AB', lat: 51.04, lon: -114.05, focus: 'Net-Front Box-Out' },
  { code: 'EDM', id: 'edmonton',     name: 'Edmonton',      team: 'Oilers',            region: 'AB', lat: 53.55, lon: -113.49, focus: 'Controlled Breakouts' },
  { code: 'VGK', id: 'vegas',        name: 'Las Vegas',     team: 'Golden Knights',    region: 'NV', lat: 36.10, lon: -115.18, focus: 'D-to-D Reverse Outlets' },
  { code: 'UTA', id: 'utah',         name: 'Salt Lake',     team: 'Utah HC',           region: 'UT', lat: 40.77, lon: -111.90, focus: 'Center Low-and-Slow Curl' },
  { code: 'COL', id: 'denver',       name: 'Denver',        team: 'Avalanche',         region: 'CO', lat: 39.75, lon: -105.01, focus: 'Speed Regroup Entries' },
  { code: 'DAL', id: 'dallas',       name: 'Dallas',        team: 'Stars',             region: 'TX', lat: 32.79, lon: -96.81,  focus: 'Odd-Man Rush Width' },
  { code: 'WPG', id: 'winnipeg',     name: 'Winnipeg',      team: 'Jets',              region: 'MB', lat: 49.89, lon: -97.14,  focus: 'Middle-Lane Drive' },
  { code: 'MIN', id: 'stpaul',       name: 'St. Paul',      team: 'Wild',              region: 'MN', lat: 44.94, lon: -93.10,  focus: 'F3 High-Slot Trailer' },
  { code: 'STL', id: 'stlouis',      name: 'St. Louis',     team: 'Blues',             region: 'MO', lat: 38.63, lon: -90.20,  focus: 'Blue-Line Gap Surfing' },
  { code: 'CHI', id: 'chicago',      name: 'Chicago',       team: 'Blackhawks',        region: 'IL', lat: 41.88, lon: -87.67,  focus: 'Cycle & Cutback Shielding' },
  { code: 'NSH', id: 'nashville',    name: 'Nashville',     team: 'Predators',         region: 'TN', lat: 36.16, lon: -86.78,  focus: 'Stick-on-Puck Angling' },
  { code: 'DET', id: 'detroit',      name: 'Detroit',       team: 'Red Wings',         region: 'MI', lat: 42.34, lon: -83.05,  focus: '2-1-2 Forecheck Pinch' },
  { code: 'CBJ', id: 'columbus',     name: 'Columbus',      team: 'Blue Jackets',      region: 'OH', lat: 39.97, lon: -83.01,  focus: 'Royal-Road Seam Denial' },
  { code: 'TOR', id: 'toronto',      name: 'Toronto',       team: 'Maple Leafs',       region: 'ON', lat: 43.64, lon: -79.38,  focus: 'High-Tempo Two-Touch' },
  { code: 'OTT', id: 'ottawa',       name: 'Ottawa',        team: 'Senators',          region: 'ON', lat: 45.30, lon: -75.93,  focus: 'Neutral Zone Hinge' },
  { code: 'MTL', id: 'montreal',     name: 'Montreal',      team: 'Canadiens',         region: 'QC', lat: 45.50, lon: -73.57,  focus: 'Backcheck Gut Track' },
  { code: 'BOS', id: 'boston',       name: 'Boston',        team: 'Bruins',            region: 'MA', lat: 42.37, lon: -71.06,  focus: 'Board-Seal Breakouts' },
  { code: 'BUF', id: 'buffalo',      name: 'Buffalo',       team: 'Sabres',            region: 'NY', lat: 42.87, lon: -78.88,  focus: 'Shoulder-Check Scanning' },
  { code: 'NYR', id: 'nyrangers',    name: 'New York',      team: 'Rangers',           region: 'NY', lat: 40.75, lon: -73.99,  focus: 'Quick-Up Transition' },
  { code: 'NYI', id: 'nyislanders',  name: 'Long Island',   team: 'Islanders',         region: 'NY', lat: 40.72, lon: -73.52,  focus: 'Structured Low House' },
  { code: 'NJD', id: 'newjersey',    name: 'New Jersey',    team: 'Devils',            region: 'NJ', lat: 40.73, lon: -74.19,  focus: 'Speed Entry & Delay' },
  { code: 'PHI', id: 'philadelphia', name: 'Philadelphia',  team: 'Flyers',            region: 'PA', lat: 39.90, lon: -75.17,  focus: 'Strong-Wall Rim Seal' },
  { code: 'PIT', id: 'pittsburgh',   name: 'Pittsburgh',    team: 'Penguins',          region: 'PA', lat: 40.44, lon: -79.99,  focus: 'Give-and-GoScissors' },
  { code: 'WSH', id: 'washington',   name: 'Washington',    team: 'Capitals',          region: 'DC', lat: 38.90, lon: -77.02,  focus: '5-on-4 Umbrella One-Timer' },
  { code: 'CAR', id: 'carolina',     name: 'Raleigh',       team: 'Hurricanes',        region: 'NC', lat: 35.80, lon: -78.72,  focus: 'Aggressive Point Pinch' },
  { code: 'TBL', id: 'tampabay',     name: 'Tampa Bay',     team: 'Lightning',         region: 'FL', lat: 27.94, lon: -82.45,  focus: '4-on-5 Diamond PK' },
  { code: 'FLA', id: 'florida',      name: 'Florida',       team: 'Panthers • Cup Final', region: 'FL', lat: 26.16, lon: -80.33, focus: 'Championship All-Zone IQ' }
];

export const NHL_ATLAS_CITIES = RAW_32_NHL_CITIES.map((c, stopIdx) => {
  const [x, y] = projectNorthAmericaLatLon(c.lat, c.lon);
  return {
    ...c,
    stopIndex: stopIdx,
    stopNumber: stopIdx + 1,
    x,
    y
  };
});

/**
 * Deterministic Screen-Space Label Placement Solver so dense clusters
 * (`NYR, NYI, NJD, PHI, BOS, MTL, TOR, OTT, BUF`) never overlap at any zoom!
 */
function solveNonOverlappingLabels(cities, zoom = 1.0) {
  const z = Math.max(1.0, Number(zoom) || 1.0);
  const placedRects = [];
  // Reserve pin circles in screen space first
  for (const c of cities) {
    const sx = c.x * z;
    const sy = c.y * z;
    placedRects.push({ x1: sx - 5.5, y1: sy - 5.5, x2: sx + 5.5, y2: sy + 5.5, isNode: true });
  }

  const candidateOffsets = [
    [0, -13], [0, 14], [22, -4], [-22, -4],
    [22, -14], [-22, -14], [22, 14], [-22, 14],
    [34, 2], [-34, 2], [0, -25], [0, 26],
    [38, -13], [-38, -13], [38, 15], [-38, 15],
    [50, -5], [-50, -5], [48, 22], [-48, 22],
    [16, -34], [-16, -34], [18, 34], [-18, 34]
  ];

  const placements = new Map();
  for (const c of cities) {
    const sx = c.x * z;
    const sy = c.y * z;
    const labelText = z >= 2.2 ? `${c.code} • ${c.name}` : c.code;
    const w = labelText.length * 5.2 + 9;
    const h = 12;

    let best = candidateOffsets[0];
    for (const [dx, dy] of candidateOffsets) {
      const lx = sx + dx;
      const ly = sy + dy;
      const rect = {
        x1: lx - w / 2 - 1.5,
        y1: ly - h / 2 - 1.5,
        x2: lx + w / 2 + 1.5,
        y2: ly + h / 2 + 1.5
      };
      const hit = placedRects.some((r) => !(rect.x2 < r.x1 || rect.x1 > r.x2 || rect.y2 < r.y1 || rect.y1 > r.y2));
      if (!hit) {
        best = [dx, dy];
        placedRects.push(rect);
        break;
      }
    }

    placements.set(c.code, {
      dx: best[0],
      dy: best[1],
      labelText,
      pillW: Math.round(w),
      pillH: h,
      needsLeader: Math.hypot(best[0], best[1]) > 19
    });
  }
  return placements;
}

const PRECOMPUTED_CANADA_PATHS = CANADA_PROVINCE_POLYGONS.map((p) => ({
  code: p.code,
  name: p.name,
  d: polyPathFromLatLon(p.coords, true)
}));

const PRECOMPUTED_US_PATHS = US_STATE_POLYGONS.map((s) => ({
  code: s.code,
  d: polyPathFromLatLon(s.coords, true)
}));

const PRECOMPUTED_LAKES_PATHS = GREAT_LAKES_POLYGONS.map((lk) => ({
  name: lk.name,
  d: polyPathFromLatLon(lk.coords, true)
}));

/**
 * Mounts the Interactive Zoomable/Pannable 32-City NHL Atlas Map into `container`.
 */
export function renderNhlAtlasMap(container, options = {}) {
  const root = typeof container === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(container) : null)
    : container;
  if (!root) return null;

  const profile = options.profile || (typeof window !== 'undefined' && typeof window.getActiveProfile === 'function' ? window.getActiveProfile() : {}) || {};
  const currentCityIdx = Math.max(0, Math.min(31, Number(options.currentCityIdx ?? profile.currentCityIdx ?? 0)));
  const conqueredSet = new Set(Array.isArray(profile.unlockedCityPatches) ? profile.unlockedCityPatches : []);
  const maxUnlockedIdx = Math.max(currentCityIdx, Number(profile.unlockedCityIdx || 0));

  // STRICT FRIEND PIN RULE: Plot ONLY real accepted friends (`0` fake friends on a brand-new profile!)
  const realFriends = Array.isArray(profile.acceptedFriends)
    ? profile.acceptedFriends.filter((f) => f && f.friendCode && !['RHET88', 'MAYA19', 'SK8R24'].includes(f.friendCode))
    : [];

  const youNum = profile.jerseyNumber !== undefined && profile.jerseyNumber !== null && String(profile.jerseyNumber).trim() !== ''
    ? String(profile.jerseyNumber).trim()
    : '9';
  const youCity = NHL_ATLAS_CITIES[currentCityIdx] || NHL_ATLAS_CITIES[0];

  const skaterPins = [
    {
      pinId: 'YOU',
      isYou: true,
      badgeText: `You • #${youNum}`,
      cityIdx: currentCityIdx,
      city: youCity,
      skaterData: profile
    },
    ...realFriends.map((fr, idx) => {
      const fIdx = Math.max(0, Math.min(31, Number(fr.cityStopIdx ?? fr.currentCityIdx ?? 0)));
      const fCity = NHL_ATLAS_CITIES[fIdx] || NHL_ATLAS_CITIES[0];
      const fNum = fr.jerseyNumber !== undefined && fr.jerseyNumber !== null && String(fr.jerseyNumber).trim() !== ''
        ? ` #${fr.jerseyNumber}`
        : '';
      return {
        pinId: String(fr.friendCode || `FRIEND_${idx}`),
        isYou: false,
        badgeText: `${fr.name || 'Teammate'}${fNum}`,
        cityIdx: fIdx,
        city: fCity,
        skaterData: fr
      };
    })
  ];

  // State: Always opens clean & unobstructed (NEVER auto-popping any player card!)
  let zoom = 1.0;
  let panX = 0;
  let panY = 0;
  let selectedEntity = null; // null | { type: 'city' | 'skater', city, skaterPin }

  const clampPan = () => {
    const maxPanX = 1000 * (zoom - 1);
    const maxPanY = 560 * (zoom - 1);
    panX = Math.min(40 * zoom, Math.max(-maxPanX - 40 * zoom, panX));
    panY = Math.min(30 * zoom, Math.max(-maxPanY - 30 * zoom, panY));
    if (zoom <= 1.02) {
      panX = 0;
      panY = 0;
    }
  };

  root.innerHTML = `
    <div id="nhlAtlasMapRoot" data-nhl-atlas="v151" class="space-y-2 select-none">
      <!-- Top Atlas Controls Bar -->
      <div class="flex flex-wrap items-center justify-between gap-2 px-1">
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-400/60 text-cyan-200 font-black">
            🗺️ 32-City North America NHL Tour Atlas
          </span>
          <span class="text-[11px] font-bold text-slate-300">
            Active Stop: <strong class="text-amber-300">${escMap(youCity.name)} (${escMap(youCity.code)})</strong> • ${conqueredSet.size} / 32 Patches Earned
          </span>
        </div>
        <div class="flex items-center gap-1.5" role="group" aria-label="Atlas Map Zoom Controls">
          <button type="button" id="btnAtlasZoomOut" class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-600 text-white text-xs font-black cursor-pointer" title="Zoom Out">−</button>
          <span id="atlasZoomBadge" data-atlas-zoom="1.0" class="px-2.5 py-1 rounded-lg bg-slate-950 border border-cyan-400/70 text-cyan-300 text-xs font-black min-w-[48px] text-center">1.0x</span>
          <button type="button" id="btnAtlasZoomIn" class="px-2.5 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-black shadow cursor-pointer" title="Zoom In">+</button>
          <button type="button" id="btnAtlasZoomReset" class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-amber-400/60 text-amber-200 text-xs font-black cursor-pointer">Reset</button>
        </div>
      </div>

      <!-- Interactive North America Vector Viewport -->
      <div id="nhlAtlasViewport" class="relative w-full h-[310px] sm:h-[365px] rounded-2xl bg-[#050c18] border-2 border-cyan-400/55 overflow-hidden shadow-2xl" style="touch-action: none;">
        <svg id="nhlAtlasSvg" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet" class="w-full h-full block cursor-grab active:cursor-grabbing">
          <defs>
            <radialGradient id="atlasOceanGrad" cx="50%" cy="42%" r="72%">
              <stop offset="0%" stop-color="#0b192e"/>
              <stop offset="65%" stop-color="#060f1e"/>
              <stop offset="100%" stop-color="#030711"/>
            </radialGradient>
            <linearGradient id="atlasCanadaFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#10233d"/>
              <stop offset="100%" stop-color="#152c4a"/>
            </linearGradient>
            <linearGradient id="atlasUsaFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#173153"/>
              <stop offset="100%" stop-color="#0f223c"/>
            </linearGradient>
            <linearGradient id="atlasLakeFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#07284a"/>
              <stop offset="100%" stop-color="#041529"/>
            </linearGradient>
          </defs>

          <rect width="1000" height="560" fill="url(#atlasOceanGrad)"/>

          <g id="nhlAtlasTransformStage" transform="translate(0, 0) scale(1)">
            <!-- Subtle Graticule Parallels & Meridians -->
            <g stroke="rgba(56,189,248,0.07)" stroke-width="0.9" fill="none">
              <path d="${polyPathFromLatLon([[30,-128],[30,-110],[30,-95],[30,-80],[30,-66]], false)}"/>
              <path d="${polyPathFromLatLon([[40,-128],[40,-110],[40,-95],[40,-80],[40,-66]], false)}"/>
              <path d="${polyPathFromLatLon([[50,-132],[50,-112],[50,-95],[50,-78],[50,-62]], false)}"/>
              <path d="${polyPathFromLatLon([[25,-120],[40,-120],[58,-120]], false)}"/>
              <path d="${polyPathFromLatLon([[25,-100],[40,-100],[58,-100]], false)}"/>
              <path d="${polyPathFromLatLon([[25,-80],[40,-80],[56,-80]], false)}"/>
            </g>

            <!-- Canadian Provinces -->
            <g id="nhlAtlasCanadaProvinces" fill="url(#atlasCanadaFill)" stroke="rgba(125,211,252,0.34)" stroke-linejoin="round">
              ${PRECOMPUTED_CANADA_PATHS.map((p) => `<path data-atlas-province="${p.code}" d="${p.d}"/>`).join('')}
            </g>

            <!-- United States Borders -->
            <g id="nhlAtlasUsStates" fill="url(#atlasUsaFill)" stroke="rgba(56,189,248,0.42)" stroke-linejoin="round">
              ${PRECOMPUTED_US_PATHS.map((s) => `<path data-atlas-state="${s.code}" d="${s.d}"/>`).join('')}
            </g>

            <!-- International US-Canada Border Accent -->
            <path d="${polyPathFromLatLon([[49.0,-123.2],[49.0,-95.15]], false)}" fill="none" stroke="rgba(250,204,21,0.38)" stroke-width="1.2" stroke-dasharray="4 2"/>

            <!-- The 5 Great Lakes -->
            <g id="nhlAtlasGreatLakes" fill="url(#atlasLakeFill)" stroke="rgba(56,189,248,0.55)" stroke-linejoin="round">
              ${PRECOMPUTED_LAKES_PATHS.map((lk) => `<path data-atlas-lake="${escMap(lk.name)}" d="${lk.d}"/>`).join('')}
            </g>

            <!-- Subtle 32-City Tour Route Lines -->
            <g id="nhlAtlasTourRoutes" fill="none">
              ${NHL_ATLAS_CITIES.slice(0, -1).map((c1, idx) => {
                const c2 = NHL_ATLAS_CITIES[idx + 1];
                const done = idx < maxUnlockedIdx;
                return `<line x1="${c1.x}" y1="${c1.y}" x2="${c2.x}" y2="${c2.y}" stroke="${done ? '#22d3ee' : 'rgba(148,163,184,0.28)'}" stroke-width="${done ? '1.8' : '1.0'}" ${done ? '' : 'stroke-dasharray="3.5 3.5"'}/>`;
              }).join('')}
            </g>

            <!-- Dynamic Counter-Scaled 32 NHL City Pins + Skater Pins -->
            <g id="nhlAtlasDynamicPinsLayer"></g>
          </g>
        </svg>

        <!-- Clean Floating Detail Popover (Hidden on Open — Appears Only When a Pin Is Tapped!) -->
        <div id="nhlAtlasDetailPopover" class="hidden absolute right-2.5 bottom-2.5 left-2.5 sm:left-auto sm:w-80 rounded-2xl bg-slate-950/96 border-2 border-amber-400 p-3 shadow-2xl backdrop-blur-xl z-30"></div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 px-1">
        <span>Drag to pan • Pinch, scroll, or tap <strong>+ / −</strong> to zoom up to <strong>4.0x</strong> into East Coast &amp; Metro divisions • Tap any city or skater pin for details.</span>
        <span class="text-cyan-300 font-bold">${realFriends.length} Teammate${realFriends.length === 1 ? '' : 's'} Connected on Map</span>
      </div>
    </div>
  `;

  const viewportEl = root.querySelector('#nhlAtlasViewport');
  const svgEl = root.querySelector('#nhlAtlasSvg');
  const stageEl = root.querySelector('#nhlAtlasTransformStage');
  const pinsLayerEl = root.querySelector('#nhlAtlasDynamicPinsLayer');
  const zoomBadgeEl = root.querySelector('#atlasZoomBadge');
  const popoverEl = root.querySelector('#nhlAtlasDetailPopover');
  const canadaGroup = root.querySelector('#nhlAtlasCanadaProvinces');
  const usGroup = root.querySelector('#nhlAtlasUsStates');
  const lakesGroup = root.querySelector('#nhlAtlasGreatLakes');

  const renderPopover = () => {
    if (!popoverEl) return;
    if (!selectedEntity) {
      popoverEl.classList.add('hidden');
      popoverEl.innerHTML = '';
      return;
    }

    const city = selectedEntity.city;
    const skaterPin = selectedEntity.skaterPin || skaterPins.find((p) => p.city.code === city.code) || null;
    const isConquered = conqueredSet.has(city.id) || conqueredSet.has(city.code) || city.stopIndex < currentCityIdx;
    const isCurrent = city.stopIndex === currentCityIdx;
    const statusPill = isConquered
      ? '<span class="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-black">✅ Tour Stop Conquered</span>'
      : (isCurrent
          ? '<span class="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-300 text-cyan-200 text-[10px] font-black">📍 Active Tour Stop</span>'
          : `<span class="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-600 text-slate-300 text-[10px] font-black">Stop #${city.stopNumber} / 32</span>`);

    popoverEl.classList.remove('hidden');
    popoverEl.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-start justify-between gap-2 border-b border-slate-800 pb-1.5">
          <div>
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black">${escMap(city.code)}</span>
              <span class="text-xs sm:text-sm font-black text-white">${escMap(city.name)} ${escMap(city.team)}</span>
            </div>
            <div class="text-[10px] font-bold text-slate-300 mt-0.5">Stop #${city.stopNumber} (${escMap(city.region)}) • Focus: ${escMap(city.focus)}</div>
          </div>
          <button type="button" id="btnCloseAtlasPopover" class="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black cursor-pointer">✕</button>
        </div>
        <div>${statusPill}</div>
        ${skaterPin ? `
          <div class="p-2 rounded-xl bg-slate-900/95 border border-cyan-400/50 flex items-center gap-2.5" data-atlas-popover-skater="${escMap(skaterPin.pinId)}">
            <div id="nhlAtlasPopoverSkaterPreview" class="w-16 h-24 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 p-1"></div>
            <div class="min-w-0 flex-1 space-y-0.5">
              <div class="text-xs font-black text-cyan-200">${escMap(skaterPin.badgeText)}</div>
              <div class="text-[10px] font-bold text-slate-300">Division: ${escMap(skaterPin.skaterData.divisionLabel || skaterPin.skaterData.ageGroup || '12U')}</div>
              <div class="text-[10px] font-black text-emerald-300">Hockey IQ: ${Number(skaterPin.skaterData.iqScore || 0)}</div>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    popoverEl.querySelector('#btnCloseAtlasPopover')?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      selectedEntity = null;
      renderPopover();
    });

    if (skaterPin) {
      const mount = popoverEl.querySelector('#nhlAtlasPopoverSkaterPreview');
      if (mount) {
        renderCustomizableSkater(mount, skaterPin.skaterData, { angleDeg: 0, showSpinButton: false });
      }
    }
  };

  const renderPinsAndTransform = () => {
    clampPan();
    const invScale = 1 / zoom;
    const borderStroke = (1.05 / Math.pow(zoom, 0.65)).toFixed(2);

    if (stageEl) {
      stageEl.setAttribute('transform', `translate(${panX.toFixed(1)}, ${panY.toFixed(1)}) scale(${zoom.toFixed(3)})`);
    }
    if (canadaGroup) canadaGroup.setAttribute('stroke-width', borderStroke);
    if (usGroup) usGroup.setAttribute('stroke-width', borderStroke);
    if (lakesGroup) lakesGroup.setAttribute('stroke-width', borderStroke);
    if (zoomBadgeEl) {
      zoomBadgeEl.textContent = `${zoom.toFixed(1)}x`;
      zoomBadgeEl.setAttribute('data-atlas-zoom', zoom.toFixed(1));
    }

    const placements = solveNonOverlappingLabels(NHL_ATLAS_CITIES, zoom);

    if (pinsLayerEl) {
      const citiesSvg = NHL_ATLAS_CITIES.map((city) => {
        const pl = placements.get(city.code);
        const isCurrent = city.stopIndex === currentCityIdx;
        const isConquered = conqueredSet.has(city.id) || conqueredSet.has(city.code) || city.stopIndex < currentCityIdx;
        const isSelected = selectedEntity && selectedEntity.city && selectedEntity.city.code === city.code;

        const dotFill = isCurrent ? '#22d3ee' : (isConquered ? '#10b981' : '#0f172a');
        const dotStroke = isSelected ? '#facc15' : (isCurrent ? '#ffffff' : (isConquered ? '#6ee7b7' : '#38bdf8'));
        const dotR = isCurrent ? 5.2 : (isSelected ? 5.0 : 3.8);

        return `
          <g class="nhl-atlas-city-pin cursor-pointer" data-nhl-city-code="${city.code}" data-nhl-city-name="${escMap(city.name)}" transform="translate(${city.x}, ${city.y}) scale(${invScale.toFixed(4)})">
            ${pl.needsLeader ? `<line x1="0" y1="0" x2="${pl.dx}" y2="${pl.dy}" stroke="rgba(125,211,252,0.55)" stroke-width="0.9"/>` : ''}
            ${isCurrent ? `<circle cx="0" cy="0" r="9.5" fill="rgba(34,211,238,0.18)" stroke="#22d3ee" stroke-width="1.1" stroke-dasharray="2.5 2"/>` : ''}
            <circle cx="0" cy="0" r="${dotR}" fill="${dotFill}" stroke="${dotStroke}" stroke-width="1.5"/>
            <g data-city-label-box="${city.code}" transform="translate(${pl.dx}, ${pl.dy})">
              <rect x="${-pl.pillW / 2}" y="${-pl.pillH / 2}" width="${pl.pillW}" height="${pl.pillH}" rx="3.5" fill="${isCurrent ? '#083344' : 'rgba(6,11,22,0.92)'}" stroke="${isCurrent ? '#22d3ee' : (isConquered ? '#10b981' : 'rgba(56,189,248,0.45)')}" stroke-width="0.9"/>
              <text x="0" y="3" fill="${isCurrent ? '#67e8f9' : '#f1f5f9'}" font-family="Inter, Segoe UI, sans-serif" font-size="7.8" font-weight="900" text-anchor="middle">${escMap(pl.labelText)}</text>
            </g>
          </g>
        `;
      }).join('');

      const skatersSvg = skaterPins.map((sp, sIdx) => {
        const offsetY = -22 - sIdx * 16;
        const pillW = Math.max(58, sp.badgeText.length * 5.6 + 14);
        const borderCol = sp.isYou ? '#fbbf24' : '#34d399';
        const bgCol = sp.isYou ? '#451a03' : '#064e3b';
        const txtCol = sp.isYou ? '#fef08a' : '#a7f3d0';
        return `
          <g class="nhl-atlas-skater-pin cursor-pointer" data-atlas-skater-pin="${escMap(sp.pinId)}" transform="translate(${sp.city.x}, ${sp.city.y}) scale(${invScale.toFixed(4)})">
            <line x1="0" y1="-4" x2="0" y2="${offsetY + 7}" stroke="${borderCol}" stroke-width="1.6"/>
            <rect x="${-pillW / 2}" y="${offsetY - 7}" width="${pillW}" height="15" rx="7.5" fill="${bgCol}" stroke="${borderCol}" stroke-width="1.4"/>
            <text x="0" y="${offsetY + 3.2}" fill="${txtCol}" font-family="Inter, Segoe UI, sans-serif" font-size="8.2" font-weight="900" text-anchor="middle">${escMap(sp.badgeText)}</text>
          </g>
        `;
      }).join('');

      pinsLayerEl.innerHTML = citiesSvg + skatersSvg;

      pinsLayerEl.querySelectorAll('.nhl-atlas-city-pin').forEach((node) => {
        node.addEventListener('click', (ev) => {
          ev.stopPropagation();
          if (wasPanned) return;
          const code = node.getAttribute('data-nhl-city-code');
          const foundCity = NHL_ATLAS_CITIES.find((c) => c.code === code);
          if (!foundCity) return;
          const matchingSkater = skaterPins.find((p) => p.city.code === code) || null;
          selectedEntity = { type: 'city', city: foundCity, skaterPin: matchingSkater };
          renderPinsAndTransform();
          renderPopover();
        });
      });

      pinsLayerEl.querySelectorAll('.nhl-atlas-skater-pin').forEach((node) => {
        node.addEventListener('click', (ev) => {
          ev.stopPropagation();
          if (wasPanned) return;
          const pid = node.getAttribute('data-atlas-skater-pin');
          const foundSkater = skaterPins.find((p) => p.pinId === pid);
          if (!foundSkater) return;
          selectedEntity = { type: 'skater', city: foundSkater.city, skaterPin: foundSkater };
          renderPinsAndTransform();
          renderPopover();
        });
      });
    }
  };

  const zoomAroundPoint = (nextZoom, focalSvgX = 500, focalSvgY = 280) => {
    const clamped = Math.max(1.0, Math.min(4.0, Math.round(nextZoom * 100) / 100));
    if (Math.abs(clamped - zoom) < 0.001) return;
    // Keep the geographic world point under `(focalSvgX, focalSvgY)` stationary
    const worldX = (focalSvgX - panX) / zoom;
    const worldY = (focalSvgY - panY) / zoom;
    zoom = clamped;
    panX = focalSvgX - worldX * zoom;
    panY = focalSvgY - worldY * zoom;
    renderPinsAndTransform();
  };

  root.querySelector('#btnAtlasZoomIn')?.addEventListener('click', () => {
    // Default zoom focus leans gently toward the dense Great Lakes / East Coast corridor when at 1x
    const fx = zoom < 1.2 ? 660 : 500;
    const fy = zoom < 1.2 ? 250 : 280;
    zoomAroundPoint(zoom + 0.75, fx, fy);
  });

  root.querySelector('#btnAtlasZoomOut')?.addEventListener('click', () => {
    zoomAroundPoint(zoom - 0.75, 500, 280);
  });

  root.querySelector('#btnAtlasZoomReset')?.addEventListener('click', () => {
    zoom = 1.0;
    panX = 0;
    panY = 0;
    renderPinsAndTransform();
  });

  // Drag-Pan & Pinch-Zoom Pointer Handling
  const activePointers = new Map();
  let dragPrev = null;
  let pinchStartDist = null;
  let pinchStartZoom = 1.0;
  let wasPanned = false;

  const clientToSvgCoords = (clientX, clientY) => {
    if (!svgEl) return [500, 280];
    const rect = svgEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return [500, 280];
    return [
      ((clientX - rect.left) / rect.width) * 1000,
      ((clientY - rect.top) / rect.height) * 560
    ];
  };

  svgEl?.addEventListener('pointerdown', (ev) => {
    activePointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    wasPanned = false;
    if (activePointers.size === 1) {
      dragPrev = { x: ev.clientX, y: ev.clientY };
    } else if (activePointers.size === 2) {
      const pts = Array.from(activePointers.values());
      pinchStartDist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      pinchStartZoom = zoom;
    }
  });

  svgEl?.addEventListener('pointermove', (ev) => {
    if (!activePointers.has(ev.pointerId)) return;
    activePointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });

    if (activePointers.size === 2 && pinchStartDist > 10) {
      const pts = Array.from(activePointers.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      const [sx, sy] = clientToSvgCoords(midX, midY);
      wasPanned = true;
      zoomAroundPoint(pinchStartZoom * (dist / pinchStartDist), sx, sy);
      return;
    }

    if (activePointers.size === 1 && dragPrev) {
      const dxPx = ev.clientX - dragPrev.x;
      const dyPx = ev.clientY - dragPrev.y;
      if (Math.hypot(dxPx, dyPx) > 4) {
        wasPanned = true;
        const rect = svgEl.getBoundingClientRect();
        const scaleSvgX = rect.width ? 1000 / rect.width : 1;
        const scaleSvgY = rect.height ? 560 / rect.height : 1;
        panX += dxPx * scaleSvgX;
        panY += dyPx * scaleSvgY;
        dragPrev = { x: ev.clientX, y: ev.clientY };
        renderPinsAndTransform();
      }
    }
  });

  const clearPointer = (ev) => {
    activePointers.delete(ev.pointerId);
    if (activePointers.size < 2) pinchStartDist = null;
    if (activePointers.size === 0) {
      dragPrev = null;
      setTimeout(() => { wasPanned = false; }, 40);
    }
  };
  svgEl?.addEventListener('pointerup', clearPointer);
  svgEl?.addEventListener('pointercancel', clearPointer);
  svgEl?.addEventListener('pointerleave', clearPointer);

  viewportEl?.addEventListener('wheel', (ev) => {
    ev.preventDefault();
    const [sx, sy] = clientToSvgCoords(ev.clientX, ev.clientY);
    const delta = ev.deltaY < 0 ? 0.35 : -0.35;
    zoomAroundPoint(zoom + delta, sx, sy);
  }, { passive: false });

  renderPinsAndTransform();
  renderPopover();

  const controller = {
    getZoom: () => zoom,
    setZoom: (z, fx = 660, fy = 250) => zoomAroundPoint(z, fx, fy),
    resetView: () => {
      zoom = 1.0;
      panX = 0;
      panY = 0;
      renderPinsAndTransform();
    },
    getCities: () => NHL_ATLAS_CITIES,
    getSkaterPins: () => skaterPins
  };

  if (typeof window !== 'undefined') {
    window._activeNhlAtlasController = controller;
  }
  return controller;
}

const SynapzNhlAtlasMap = {
  NHL_ATLAS_CITIES,
  projectNorthAmericaLatLon,
  renderNhlAtlasMap
};

if (typeof window !== 'undefined') {
  window.SynapzNhlAtlasMap = SynapzNhlAtlasMap;
  window.renderNhlAtlasMap = renderNhlAtlasMap;
}

export default SynapzNhlAtlasMap;
