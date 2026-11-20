/**
 * SYNAPZ HOCKEY v15.3 — 18 Authentic Full-Sheet Regulation Practice Diagrams &
 * Real `catalog_45.json` Play Snapshot Renderer (`engine/practice_stations_svg.js`)
 *
 * ZERO RECYCLED SVGS • ZERO GENERIC X1/O1 LABELS • 100% REGULATION RINK MARKINGS:
 *  - Regulation 200ft × 85ft NHL/USA Hockey rink sheet on EVERY diagram:
 *    Outer boards, Center Red Line + Center Ice Circle & Dot, BOTH Blue Lines
 *    (true Defensive, Neutral w/ 4 neutral faceoff dots, and Offensive zones),
 *    BOTH Goal Lines + Trapezoids, ALL 4 End-Zone Faceoff Circles w/ exterior
 *    hashmarks, inner L-marks & red dots, BOTH Blue Goal Creases, and BOTH Nets.
 *  - 18 Distinct Tactical Drills (6 Topics × 3 Progressive Stations):
 *    1) Breakouts & Regroups          (Warmup • 3v2 Low Breakout • 5v5 Full Breakout)
 *    2) Forecheck & Gap Control       (Warmup • 3v2 2-1-2 Hunt   • 5v5 Forecheck + 1-2-2 Gap)
 *    3) Neutral Zone & Regroups       (Warmup • 3v2 NZ Hinge     • 5v5 Counter Regroup)
 *    4) Odd-Man Rush & Entries        (Warmup • 2v1 Read D1      • 5v5 Backcheck Rush)
 *    5) O-Zone Cycling & Net-Front    (Warmup • 3v2 Low Cycle    • 5v5 Cycle + Point Walk)
 *    6) Special Teams (PP & PK)       (Warmup • 5v4 Umbrella/Box • 5v5 Special-Teams Shift)
 *  - `renderCatalogPlayThumbnailSVG(drill)`:
 *    Renders crisp mini regulation rink snapshots directly from each drill's real
 *    `drills/catalog_45.json` setup positions, `primaryRole` gold halo, opponents,
 *    Goalie `G`, black Puck `●`, and initial skate/pass vectors.
 */
(function installSynapzPracticeStationsSvg(globalScope) {
  'use strict';

  var g = globalScope || (typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : self));

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function polyPointAt(pts, uRaw) {
    if (!pts || pts.length === 0) return [500, 238];
    if (pts.length === 1) return [pts[0][0], pts[0][1]];
    var u = Math.max(0, Math.min(1, Number(uRaw) || 0));
    var segs = [];
    var total = 0;
    for (var i = 0; i < pts.length - 1; i++) {
      var d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
      segs.push(d);
      total += d;
    }
    if (total < 0.01) return [pts[0][0], pts[0][1]];
    var want = u * total;
    var acc = 0;
    for (var j = 0; j < segs.length; j++) {
      if (acc + segs[j] >= want || j === segs.length - 1) {
        var lt = segs[j] > 0.0001 ? (want - acc) / segs[j] : 0;
        return [
          pts[j][0] + (pts[j + 1][0] - pts[j][0]) * lt,
          pts[j][1] + (pts[j + 1][1] - pts[j][1]) * lt
        ];
      }
      acc += segs[j];
    }
    return [pts[pts.length - 1][0], pts[pts.length - 1][1]];
  }

  function arrowHeadPolygon(fromPt, toPt, size, fill) {
    var ang = Math.atan2(toPt[1] - fromPt[1], toPt[0] - fromPt[0]);
    var p1x = (toPt[0] - size * Math.cos(ang - 0.46)).toFixed(1);
    var p1y = (toPt[1] - size * Math.sin(ang - 0.46)).toFixed(1);
    var p2x = (toPt[0] - size * Math.cos(ang + 0.46)).toFixed(1);
    var p2y = (toPt[1] - size * Math.sin(ang + 0.46)).toFixed(1);
    return '<polygon points="' + toPt[0].toFixed(1) + ',' + toPt[1].toFixed(1) + ' ' + p1x + ',' + p1y + ' ' + p2x + ',' + p2y + '" fill="' + fill + '"/>';
  }

  function tStopBarSvg(fromPt, toPt, halfW, color) {
    var ang = Math.atan2(toPt[1] - fromPt[1], toPt[0] - fromPt[0]);
    var nx = -Math.sin(ang);
    var ny = Math.cos(ang);
    var x1 = (toPt[0] - nx * halfW).toFixed(1);
    var y1 = (toPt[1] - ny * halfW).toFixed(1);
    var x2 = (toPt[0] + nx * halfW).toFixed(1);
    var y2 = (toPt[1] + ny * halfW).toFixed(1);
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + color + '" stroke-width="5" stroke-linecap="round"/>';
  }

  function renderIhsVectorPath(pathSpec) {
    var pts = pathSpec && pathSpec.points;
    if (!Array.isArray(pts) || pts.length < 2) return '';
    var type = pathSpec.type || 'skate';
    var defaultColors = {
      skate: '#0F2942',
      carry: '#0284C7',
      pass: '#0F172A',
      shot: '#DC2626',
      stop: '#B45309'
    };
    var col = pathSpec.color || defaultColors[type] || '#0F2942';
    var sw = pathSpec.width || 3.6;
    var last = pts[pts.length - 1];
    var prev = pts[pts.length - 2];

    if (type === 'carry') {
      var samples = 38;
      var dParts = [];
      for (var s = 0; s <= samples; s++) {
        var u = s / samples;
        var curr = polyPointAt(pts, u);
        var nxt = polyPointAt(pts, Math.min(1, u + 0.025));
        var ang = Math.atan2(nxt[1] - curr[1], nxt[0] - curr[0]);
        var nx = -Math.sin(ang);
        var ny = Math.cos(ang);
        var taper = u > 0.86 ? (1 - u) / 0.14 : 1;
        var wave = Math.sin(s * 0.92) * 5.2 * taper;
        var wx = (curr[0] + nx * wave).toFixed(1);
        var wy = (curr[1] + ny * wave).toFixed(1);
        dParts.push((s === 0 ? 'M ' : 'L ') + wx + ' ' + wy);
      }
      return (
        '<g data-ihs-arrow="carry">' +
        '<path d="' + dParts.join(' ') + '" fill="none" stroke="' + col + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round"/>' +
        arrowHeadPolygon(prev, last, 13, col) +
        '</g>'
      );
    }

    if (type === 'shot') {
      var off = 3.3;
      var linesHtml = '';
      for (var sideIdx = 0; sideIdx < 2; sideIdx++) {
        var side = sideIdx === 0 ? -1 : 1;
        var sp = [];
        for (var k = 0; k < pts.length; k++) {
          var rA = pts[Math.max(0, k - 1)];
          var rB = pts[Math.min(pts.length - 1, k + 1)];
          var a = Math.atan2(rB[1] - rA[1], rB[0] - rA[0]);
          var ox = -Math.sin(a) * off * side * (k === pts.length - 1 ? 0.25 : 1);
          var oy = Math.cos(a) * off * side * (k === pts.length - 1 ? 0.25 : 1);
          sp.push((k === 0 ? 'M ' : 'L ') + (pts[k][0] + ox).toFixed(1) + ' ' + (pts[k][1] + oy).toFixed(1));
        }
        linesHtml += '<path d="' + sp.join(' ') + '" fill="none" stroke="' + col + '" stroke-width="2.7" stroke-linecap="round"/>';
      }
      return '<g data-ihs-arrow="shot">' + linesHtml + arrowHeadPolygon(prev, last, 15, col) + '</g>';
    }

    var dSimple = pts.map(function (p, idx) {
      return (idx === 0 ? 'M ' : 'L ') + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
    }).join(' ');

    if (type === 'pass') {
      return (
        '<g data-ihs-arrow="pass">' +
        '<path d="' + dSimple + '" fill="none" stroke="' + col + '" stroke-width="' + sw + '" stroke-dasharray="10 7" stroke-linecap="round" stroke-linejoin="round"/>' +
        arrowHeadPolygon(prev, last, 13, col) +
        '</g>'
      );
    }

    if (type === 'stop') {
      return (
        '<g data-ihs-arrow="stop">' +
        '<path d="' + dSimple + '" fill="none" stroke="' + col + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round"/>' +
        tStopBarSvg(prev, last, 12, col) +
        '</g>'
      );
    }

    return (
      '<g data-ihs-arrow="skate">' +
      '<path d="' + dSimple + '" fill="none" stroke="' + col + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round"/>' +
      arrowHeadPolygon(prev, last, 13, col) +
      '</g>'
    );
  }

  function renderRegulationRinkSheetSvg(uid, opts) {
    var options = opts || {};
    var rinkTop = 14;
    var rinkBottom = 462;
    var rinkH = rinkBottom - rinkTop; // 448
    var rinkLeft = 20;
    var rinkRight = 980;
    var rinkW = rinkRight - rinkLeft; // 960
    var cy = 238;
    var clipId = uid + '_rink_clip';

    var endDots = [
      [216, 134],
      [216, 342],
      [784, 134],
      [784, 342]
    ];
    var neutralDots = [
      [392, 134],
      [392, 342],
      [608, 134],
      [608, 342]
    ];

    var endCirclesSvg = endDots.map(function (pt) {
      var dx = pt[0];
      var dy = pt[1];
      var r = 68;
      var hashLines = '';
      var signs = [-1, 1];
      for (var si = 0; si < 2; si++) {
        for (var sj = 0; sj < 2; sj++) {
          var sx = signs[si];
          var sy = signs[sj];
          hashLines += '<line x1="' + (dx + sx * 15) + '" y1="' + (dy + sy * (r - 1)) + '" x2="' + (dx + sx * 15) + '" y2="' + (dy + sy * (r + 12)) + '" stroke="#DC2626" stroke-width="2.3"/>';
          hashLines += '<line x1="' + (dx + sx * 9) + '" y1="' + (dy + sy * 15) + '" x2="' + (dx + sx * 22) + '" y2="' + (dy + sy * 15) + '" stroke="#DC2626" stroke-width="2.1"/>';
          hashLines += '<line x1="' + (dx + sx * 9) + '" y1="' + (dy + sy * 15) + '" x2="' + (dx + sx * 9) + '" y2="' + (dy + sy * 6) + '" stroke="#DC2626" stroke-width="2.1"/>';
        }
      }
      return (
        '<g data-rink-end-circle="true">' +
        '<circle cx="' + dx + '" cy="' + dy + '" r="' + r + '" fill="none" stroke="#DC2626" stroke-width="2.4"/>' +
        '<circle cx="' + dx + '" cy="' + dy + '" r="6.5" fill="#DC2626"/>' +
        hashLines +
        '</g>'
      );
    }).join('');

    var neutralDotsSvg = neutralDots.map(function (pt) {
      return '<circle data-rink-neutral-dot="true" cx="' + pt[0] + '" cy="' + pt[1] + '" r="5.5" fill="#DC2626"/>';
    }).join('');

    var centerDashes = '';
    for (var y = rinkTop + 14; y < rinkBottom - 14; y += 32) {
      centerDashes += '<rect x="498" y="' + y + '" width="4" height="13" fill="#FFFFFF"/>';
    }

    var houseOverlay = '';
    if (options.showLeftHouse) {
      houseOverlay += '<polygon points="96,204 216,134 312,178 312,298 216,342 96,272" fill="rgba(16,185,129,0.09)" stroke="#059669" stroke-width="2" stroke-dasharray="8 6"/>';
    }
    if (options.showRightHouse) {
      houseOverlay += '<polygon points="904,204 784,134 688,178 688,298 784,342 904,272" fill="rgba(16,185,129,0.09)" stroke="#059669" stroke-width="2" stroke-dasharray="8 6"/>';
    }

    return (
      '<defs>' +
      '<clipPath id="' + clipId + '">' +
      '<rect x="' + rinkLeft + '" y="' + rinkTop + '" width="' + rinkW + '" height="' + rinkH + '" rx="124" ry="124"/>' +
      '</clipPath>' +
      '</defs>' +
      '<!-- Regulation Rink White Ice Surface -->' +
      '<rect x="' + rinkLeft + '" y="' + rinkTop + '" width="' + rinkW + '" height="' + rinkH + '" rx="124" ry="124" fill="#FFFFFF"/>' +
      '<g clip-path="url(#' + clipId + ')">' +
      '<!-- Left & Right Red Goal Lines -->' +
      '<line data-rink-goal-line="left" x1="96" y1="' + rinkTop + '" x2="96" y2="' + rinkBottom + '" stroke="#DC2626" stroke-width="3.2"/>' +
      '<line data-rink-goal-line="right" x1="904" y1="' + rinkTop + '" x2="904" y2="' + rinkBottom + '" stroke="#DC2626" stroke-width="3.2"/>' +
      '<!-- Goalie Trapezoids -->' +
      '<line x1="96" y1="186" x2="22" y2="148" stroke="#DC2626" stroke-width="1.8" opacity="0.6"/>' +
      '<line x1="96" y1="290" x2="22" y2="328" stroke="#DC2626" stroke-width="1.8" opacity="0.6"/>' +
      '<line x1="904" y1="186" x2="978" y2="148" stroke="#DC2626" stroke-width="1.8" opacity="0.6"/>' +
      '<line x1="904" y1="290" x2="978" y2="328" stroke="#DC2626" stroke-width="1.8" opacity="0.6"/>' +
      '<!-- Regulation Defensive & Offensive Blue Lines -->' +
      '<rect data-rink-blue-line="left" x="340" y="' + rinkTop + '" width="8" height="' + rinkH + '" fill="#1D4ED8"/>' +
      '<rect data-rink-blue-line="right" x="652" y="' + rinkTop + '" width="8" height="' + rinkH + '" fill="#1D4ED8"/>' +
      '<!-- Regulation Center Red Line + Center Ice Circle & Dot -->' +
      '<rect data-rink-center-red-line="true" x="496" y="' + rinkTop + '" width="8" height="' + rinkH + '" fill="#DC2626"/>' +
      centerDashes +
      '<circle data-rink-center-circle="true" cx="500" cy="' + cy + '" r="68" fill="none" stroke="#1D4ED8" stroke-width="2.8"/>' +
      '<circle cx="500" cy="' + cy + '" r="7" fill="#1D4ED8"/>' +
      '<!-- 4 End-Zone Faceoff Circles & 4 Neutral-Zone Faceoff Dots -->' +
      endCirclesSvg +
      neutralDotsSvg +
      houseOverlay +
      '<!-- Left & Right Blue Goal Creases + Regulation Nets -->' +
      '<path data-rink-crease="left" d="M 96 ' + (cy - 30) + ' A 30 30 0 0 1 96 ' + (cy + 30) + ' Z" fill="#BAE6FD" stroke="#DC2626" stroke-width="2.3"/>' +
      '<path data-rink-net="left" d="M 96 ' + (cy - 22) + ' L 74 ' + (cy - 18) + ' L 74 ' + (cy + 18) + ' L 96 ' + (cy + 22) + '" fill="#E2E8F0" stroke="#DC2626" stroke-width="2.8"/>' +
      '<path data-rink-crease="right" d="M 904 ' + (cy - 30) + ' A 30 30 0 0 0 904 ' + (cy + 30) + ' Z" fill="#BAE6FD" stroke="#DC2626" stroke-width="2.3"/>' +
      '<path data-rink-net="right" d="M 904 ' + (cy - 22) + ' L 926 ' + (cy - 18) + ' L 926 ' + (cy + 18) + ' L 904 ' + (cy + 22) + '" fill="#E2E8F0" stroke="#DC2626" stroke-width="2.8"/>' +
      '</g>' +
      '<!-- Outer Boards + Kickplate Trim -->' +
      '<rect x="' + rinkLeft + '" y="' + rinkTop + '" width="' + rinkW + '" height="' + rinkH + '" rx="124" ry="124" fill="none" stroke="#FACC15" stroke-width="6.5"/>' +
      '<rect x="' + rinkLeft + '" y="' + rinkTop + '" width="' + rinkW + '" height="' + rinkH + '" rx="124" ry="124" fill="none" stroke="#0F172A" stroke-width="4"/>'
    );
  }

  function renderConeSvg(x, y) {
    return (
      '<polygon data-drill-cone="true" points="' +
      x + ',' + (y - 10) + ' ' +
      (x - 9) + ',' + (y + 8) + ' ' +
      (x + 9) + ',' + (y + 8) +
      '" fill="#F97316" stroke="#9A3412" stroke-width="1.8"/>'
    );
  }

  function renderPuckSvg(x, y, skatersList) {
    var px = Number(x);
    var py = Number(y);
    if (Array.isArray(skatersList)) {
      for (var i = 0; i < skatersList.length; i++) {
        var sk = skatersList[i];
        if (!sk) continue;
        var sx = Number(sk.x);
        var sy = Number(sk.y);
        var dist = Math.hypot(px - sx, py - sy);
        if (dist < 26) {
          var angRad = ((sk.stickDeg != null ? sk.stickDeg : (sk.unit === 'away' ? 180 : 0)) * Math.PI) / 180;
          px = Math.max(36, Math.min(964, sx + Math.cos(angRad) * 31 + Math.cos(angRad + 1.15) * 6));
          py = Math.max(28, Math.min(448, sy + Math.sin(angRad) * 31 + Math.sin(angRad + 1.15) * 6));
          break;
        }
      }
    }
    return '<circle data-drill-puck="true" cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="7.5" fill="#090D16" stroke="#FFFFFF" stroke-width="2"/>';
  }

  function renderSkaterTokenSvg(sk) {
    var x = Number(sk.x);
    var y = Number(sk.y);
    var role = String(sk.role || 'C');
    var unit = sk.unit || (role === 'G' ? 'goalie' : 'home');
    var isYou = Boolean(sk.isYou);
    var isGoalie = role === 'G' || unit === 'goalie';
    var r = isYou ? 20 : (isGoalie ? 17 : 18);

    var angRad = ((sk.stickDeg != null ? sk.stickDeg : (unit === 'away' ? 180 : 0)) * Math.PI) / 180;
    var sx0 = (x + Math.cos(angRad) * (r - 2)).toFixed(1);
    var sy0 = (y + Math.sin(angRad) * (r - 2)).toFixed(1);
    var sx1 = (x + Math.cos(angRad) * (r + 13)).toFixed(1);
    var sy1 = (y + Math.sin(angRad) * (r + 13)).toFixed(1);
    var bx = (Number(sx1) + Math.cos(angRad + 1.15) * 7.5).toFixed(1);
    var by = (Number(sy1) + Math.sin(angRad + 1.15) * 7.5).toFixed(1);
    var stickStroke = isYou ? '#0D9488' : (unit === 'away' ? '#991B1B' : '#0F2942');

    var fillCol = '#0F2942';
    var strokeCol = '#FFFFFF';
    var textCol = '#FFFFFF';
    if (isYou) {
      fillCol = '#0D9488';
      strokeCol = '#FBBF24';
      textCol = '#FFFFFF';
    } else if (isGoalie) {
      fillCol = unit === 'away_goalie' ? '#991B1B' : '#1E3A8A';
      strokeCol = '#38BDF8';
      textCol = '#FFFFFF';
    } else if (unit === 'away') {
      fillCol = '#FFFFFF';
      strokeCol = '#DC2626';
      textCol = '#B91C1C';
    }

    var haloHtml = '';
    if (isYou) {
      haloHtml =
        '<circle data-you-are-halo="' + esc(role) + '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="30" fill="rgba(251,191,36,0.28)" stroke="#F59E0B" stroke-width="3.2"/>' +
        '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="23.5" fill="none" stroke="#14B8A6" stroke-width="2.2"/>';
    }

    var fontSize = role.length >= 2 ? 12.5 : 13.5;
    return (
      '<g data-skater-token="true" data-skater-role="' + esc(role) + '" data-skater-unit="' + esc(isGoalie ? 'goalie' : unit) + '">' +
      haloHtml +
      '<polyline points="' + sx0 + ',' + sy0 + ' ' + sx1 + ',' + sy1 + ' ' + bx + ',' + by + '" fill="none" stroke="' + stickStroke + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '" fill="' + fillCol + '" stroke="' + strokeCol + '" stroke-width="2.8"/>' +
      '<text x="' + x.toFixed(1) + '" y="' + (y + 4.4).toFixed(1) + '" font-family="Inter,Segoe UI,Arial,sans-serif" font-weight="900" font-size="' + fontSize + '" fill="' + textCol + '" text-anchor="middle">' + esc(role) + '</text>' +
      '</g>'
    );
  }

  function renderIhsLegendStripSvg() {
    return (
      '<g data-ihs-legend-bar="true" transform="translate(20, 474)">' +
      '<rect x="0" y="0" width="960" height="52" rx="12" ry="12" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>' +
      '<g font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="900" fill="#0F172A">' +
      // Skate
      '<line x1="20" y1="26" x2="62" y2="26" stroke="#0F2942" stroke-width="3.4"/>' +
      '<polygon points="68,26 57,20.5 57,31.5" fill="#0F2942"/>' +
      '<text x="76" y="31">Skate</text>' +
      // Puck Carry
      '<path d="M 134 26 Q 142 18 150 26 T 166 26 T 180 26" fill="none" stroke="#0284C7" stroke-width="3.4"/>' +
      '<polygon points="186,26 175,20.5 175,31.5" fill="#0284C7"/>' +
      '<text x="194" y="31">Puck Carry</text>' +
      // Pass
      '<line x1="290" y1="26" x2="334" y2="26" stroke="#0F172A" stroke-width="3.4" stroke-dasharray="8 6"/>' +
      '<polygon points="340,26 329,20.5 329,31.5" fill="#0F172A"/>' +
      '<text x="348" y="31">Pass</text>' +
      // Shot
      '<line x1="402" y1="23" x2="444" y2="23" stroke="#DC2626" stroke-width="2.5"/>' +
      '<line x1="402" y1="29" x2="444" y2="29" stroke="#DC2626" stroke-width="2.5"/>' +
      '<polygon points="452,26 440,19.5 440,32.5" fill="#DC2626"/>' +
      '<text x="460" y="31">Shot</text>' +
      // Stop
      '<line x1="512" y1="26" x2="548" y2="26" stroke="#B45309" stroke-width="3.6"/>' +
      '<line x1="548" y1="16" x2="548" y2="36" stroke="#B45309" stroke-width="4.5" stroke-linecap="round"/>' +
      '<text x="558" y="31">Stop (⊥)</text>' +
      // Puck & Cone
      '<circle cx="638" cy="26" r="6.5" fill="#090D16" stroke="#0F172A" stroke-width="1.5"/>' +
      '<text x="650" y="31">Puck</text>' +
      '<polygon points="704,17 695,33 713,33" fill="#F97316" stroke="#9A3412" stroke-width="1.5"/>' +
      '<text x="720" y="31">Cone</text>' +
      // Units
      '<circle cx="780" cy="26" r="9.5" fill="#0F2942"/>' +
      '<text x="795" y="31" font-size="12">Primary</text>' +
      '<circle cx="864" cy="26" r="9.5" fill="#FFFFFF" stroke="#DC2626" stroke-width="2.5"/>' +
      '<text x="879" y="31" font-size="12">Opp / FC</text>' +
      '</g>' +
      '</g>'
    );
  }

  // =========================================================================
  // 18 GENUINELY DISTINCT, HOCKEY-AUTHENTIC PRACTICE DIAGRAMS (6 TOPICS × 3)
  // =========================================================================
  var PRACTICE_STATION_TOPICS = [
    // -----------------------------------------------------------------------
    // TOPIC 1: BREAKOUTS & REGROUPS
    // -----------------------------------------------------------------------
    {
      topicId: 'breakouts_regroups',
      legacyFocusKey: 'Breakouts',
      icon: '🚀',
      label: 'Breakouts & Regroups',
      title: 'Breakouts & Regroups — Scan, Hinge & Low-Center Outlet',
      zoneLabel: 'Defensive & Neutral Zone',
      benchCues: [
        'Two shoulder scans BEFORE your blade touches the dump-in!',
        'D1/D2 hinge below the goal line—give a flat forehand target!',
        'Center curls low-and-slow underneath the dots in the middle pocket!'
      ],
      stations: [
        {
          stationNum: 1,
          formatTag: '5-0 + G Skill/Read Warmup',
          heading: 'Station 1 (Skill/Read Warmup): D1/D2 Shoulder-Scan & Behind-Net Hinge',
          cues: [
            'D1 retrieves puck behind left goal line with 2 shoulder checks past cones while G calls "Time!" or "Reverse!" from the blue crease.',
            'D1 snaps a crisp behind-net hinge pass (- - ▸) to D2 stepping out from weak-side post with open hips.',
            'C curls low underneath hashmarks while LW and RW seal boards; D2 carries (〜〜▸) and hits C in stride crossing the blue line.'
          ],
          cones: [[148, 175], [148, 305], [278, 238]],
          pucks: [[84, 302], [118, 316]],
          skaters: [
            { role: 'G', x: 98, y: 238, unit: 'goalie', stickDeg: 0 },
            { role: 'D1', x: 142, y: 318, unit: 'home', stickDeg: 165 },
            { role: 'D2', x: 132, y: 162, unit: 'home', stickDeg: 25 },
            { role: 'C', x: 252, y: 278, unit: 'home', stickDeg: 195 },
            { role: 'LW', x: 248, y: 82, unit: 'home', stickDeg: 15 },
            { role: 'RW', x: 248, y: 392, unit: 'home', stickDeg: -15 }
          ],
          paths: [
            { type: 'skate', points: [[142, 318], [92, 304], [72, 268]], color: '#0F2942' },
            { type: 'pass', points: [[72, 268], [76, 188], [132, 162]], color: '#0F172A' },
            { type: 'carry', points: [[132, 162], [186, 146], [232, 152]], color: '#0284C7' },
            { type: 'skate', points: [[252, 278], [198, 258], [236, 206], [362, 196]], color: '#0F2942' },
            { type: 'pass', points: [[232, 152], [356, 194]], color: '#0F172A' },
            { type: 'skate', points: [[248, 82], [372, 86]], color: '#0F2942' }
          ]
        },
        {
          stationNum: 2,
          formatTag: '3v2 + G Constrained Read',
          heading: 'Station 2 (Constrained 3v2 Read): Low Breakout vs. F1/F2 Forecheck',
          cues: [
            'F1 angles D1 behind the net taking away the strong-side wheel while F2 cheats high to seal the strong-wall rim.',
            'D1 reads F1 stick, fakes wheel, and reverses (- - ▸) behind the net to weak-side D2 below the left faceoff circle.',
            'C times a low-and-slow support curl below the dots to catch D2\'s seam pass (- - ▸) cleanly past F2 across the blue line.'
          ],
          cones: [[336, 108], [336, 368]],
          pucks: [[78, 294]],
          skaters: [
            { role: 'G', x: 98, y: 238, unit: 'goalie', stickDeg: 0 },
            { role: 'D1', x: 86, y: 298, unit: 'home', stickDeg: -75 },
            { role: 'D2', x: 146, y: 142, unit: 'home', stickDeg: 20 },
            { role: 'C', x: 266, y: 268, unit: 'home', stickDeg: 185 },
            { role: 'F1', x: 162, y: 318, unit: 'away', stickDeg: 195 },
            { role: 'F2', x: 254, y: 362, unit: 'away', stickDeg: 180 }
          ],
          paths: [
            { type: 'skate', points: [[162, 318], [108, 304]], color: '#DC2626' },
            { type: 'stop', points: [[254, 362], [224, 368]], color: '#B45309' },
            { type: 'pass', points: [[86, 298], [68, 238], [138, 148]], color: '#0F172A' },
            { type: 'carry', points: [[146, 142], [208, 134]], color: '#0284C7' },
            { type: 'skate', points: [[266, 268], [202, 232], [284, 188], [412, 182]], color: '#0F2942' },
            { type: 'pass', points: [[208, 134], [398, 180]], color: '#0F172A' }
          ]
        },
        {
          stationNum: 3,
          formatTag: '5v5 Full-Unit Live Read',
          heading: 'Station 3 (Full-Unit 5v5 Live Read): 5v5 Pressure Breakout to Weak-Side Speed Exit',
          cues: [
            'Full 5v5 live shift: F1 and F2 pressure strong-side LD while F3 mirrors high slot and defending D1/D2 hold the offensive blue line.',
            'LD reverses behind G to RD; LW posts at weak-side hashmarks, C curls underneath into middle ice, and RW stretches the far lane.',
            'RD hits C in middle pocket (- - ▸); C turns in 2 touches to hit LW or RW attacking neutral ice against D1 and D2 for a stride shot (══▸).'
          ],
          cones: [],
          pucks: [[84, 312]],
          skaters: [
            { role: 'G', x: 98, y: 238, unit: 'goalie', stickDeg: 0 },
            { role: 'LD', x: 92, y: 318, unit: 'home', stickDeg: -80 },
            { role: 'RD', x: 138, y: 148, unit: 'home', stickDeg: 18 },
            { role: 'C', x: 238, y: 262, unit: 'home', stickDeg: 190 },
            { role: 'LW', x: 242, y: 84, unit: 'home', stickDeg: 12 },
            { role: 'RW', x: 286, y: 392, unit: 'home', stickDeg: -10 },
            { role: 'F1', x: 168, y: 332, unit: 'away', stickDeg: 195 },
            { role: 'F2', x: 232, y: 368, unit: 'away', stickDeg: 180 },
            { role: 'F3', x: 296, y: 238, unit: 'away', stickDeg: 180 },
            { role: 'D1', x: 356, y: 126, unit: 'away', stickDeg: 180 },
            { role: 'D2', x: 356, y: 352, unit: 'away', stickDeg: 180 }
          ],
          paths: [
            { type: 'skate', points: [[168, 332], [112, 318]], color: '#DC2626' },
            { type: 'pass', points: [[92, 318], [68, 238], [134, 152]], color: '#0F172A' },
            { type: 'skate', points: [[238, 262], [196, 218], [292, 184], [496, 178]], color: '#0F2942' },
            { type: 'pass', points: [[138, 148], [286, 184]], color: '#0F172A' },
            { type: 'skate', points: [[242, 84], [456, 88], [692, 128]], color: '#0F2942' },
            { type: 'pass', points: [[496, 178], [684, 130]], color: '#0F172A' },
            { type: 'shot', points: [[692, 128], [892, 226]], color: '#DC2626' }
          ]
        }
      ]
    },

    // -----------------------------------------------------------------------
    // TOPIC 2: FORECHECK & GAP CONTROL
    // -----------------------------------------------------------------------
    {
      topicId: 'forecheck_gap',
      legacyFocusKey: 'Forechecks',
      icon: '⚡',
      label: 'Forecheck & Gap Control',
      title: 'Forecheck & Gap Control — 2-1-2 Stick-on-Puck & 1-Stick NZ Gap',
      zoneLabel: 'Offensive & Neutral Zone',
      benchCues: [
        'F1 curves inside-out through the hands—cut the D-to-D reverse in half!',
        'F2 reads retriever eyes and stops ON the hands at the hashmarks!',
        'D1/D2 surf a 1-stick gap up at the red line—stand up at our blue line!'
      ],
      stations: [
        {
          stationNum: 1,
          formatTag: '2v2 + G Skill/Read Warmup',
          heading: 'Station 1 (Skill/Read Warmup): F1 Curved Stick-on-Puck Angling & F2 Wall Stop',
          cues: [
            'Coach spots puck in right corner for retrieving D1; F1 skates an inside-out curved arc (──▸) around cones to deny behind-net reverse to D2.',
            'Forced up the strong boards, D1 rims toward the hashmarks where F2 sprints down and executes a hard T-stop (⊥) on D1\'s hands.',
            'Upon turnover strip, F2 steps off the wall (〜〜▸) and rips a low far-pad shot (══▸) on G while F1 crashes net-front for rebounds.'
          ],
          cones: [[718, 224], [792, 268], [848, 294], [744, 386]],
          pucks: [[912, 336]],
          skaters: [
            { role: 'G', x: 902, y: 238, unit: 'goalie', stickDeg: 180 },
            { role: 'F1', x: 642, y: 214, unit: 'home', stickDeg: 10 },
            { role: 'F2', x: 678, y: 388, unit: 'home', stickDeg: 0 },
            { role: 'D1', x: 896, y: 334, unit: 'away', stickDeg: 145 },
            { role: 'D2', x: 878, y: 142, unit: 'away', stickDeg: 180 }
          ],
          paths: [
            { type: 'skate', points: [[642, 214], [742, 242], [838, 286], [888, 326]], color: '#0F2942' },
            { type: 'pass', points: [[896, 334], [792, 396]], color: '#DC2626' },
            { type: 'stop', points: [[678, 388], [782, 394]], color: '#B45309' },
            { type: 'carry', points: [[782, 394], [768, 308]], color: '#0284C7' },
            { type: 'shot', points: [[768, 308], [896, 246]], color: '#DC2626' }
          ]
        },
        {
          stationNum: 2,
          formatTag: '3v2 + G Constrained Read',
          heading: 'Station 2 (Constrained 3v2 Read): 2-1-2 Hunt — F1 Flush, F2 Seal & F3 High Slot',
          cues: [
            '3 forecheckers (F1, F2, F3) hunt 2 defenders (D1, D2) in front of G: F1 angles D1 behind net to flush a rushed pass up the right boards.',
            'F2 anticipates the wall play, seals the hashmarks (⊥) ahead of D2 support, and strips possession cleanly.',
            'F3 holds quiet high-slot insurance above the circles, receives F2\'s quick pass (- - ▸), and fires a 1-touch strike (══▸) on G.'
          ],
          cones: [[656, 98], [656, 378]],
          pucks: [[916, 152]],
          skaters: [
            { role: 'G', x: 902, y: 238, unit: 'goalie', stickDeg: 180 },
            { role: 'F1', x: 744, y: 168, unit: 'home', stickDeg: -10 },
            { role: 'F2', x: 726, y: 76, unit: 'home', stickDeg: 15 },
            { role: 'F3', x: 696, y: 254, unit: 'home', stickDeg: 0 },
            { role: 'D1', x: 904, y: 156, unit: 'away', stickDeg: 195 },
            { role: 'D2', x: 846, y: 318, unit: 'away', stickDeg: 170 }
          ],
          paths: [
            { type: 'skate', points: [[744, 168], [834, 166], [892, 158]], color: '#0F2942' },
            { type: 'pass', points: [[904, 156], [796, 82]], color: '#DC2626' },
            { type: 'stop', points: [[726, 76], [790, 82]], color: '#B45309' },
            { type: 'skate', points: [[696, 254], [758, 232]], color: '#0F2942' },
            { type: 'pass', points: [[790, 82], [758, 232]], color: '#0F172A' },
            { type: 'shot', points: [[758, 232], [896, 238]], color: '#DC2626' }
          ]
        },
        {
          stationNum: 3,
          formatTag: '5v5 Full-Unit Live Read',
          heading: 'Station 3 (Full-Unit 5v5 Live Read): 5v5 2-1-2 Forecheck Into 1-2-2 Blue-Line Stand-Up',
          cues: [
            'Full 5v5 transition: F1 and F2 pressure opposing LD and RD on retrieval while F3 shadows C in the middle lane.',
            'If LW or RW chips puck out to neutral ice, forechecking D1 and D2 surf a tight 1-stick gap backward from center red line to stand up (⊥) at the blue line.',
            'D1 pokes puck free at x=344 blue line and immediately counters (- - ▸) to F3 for a quick transition rush back on G.'
          ],
          cones: [],
          pucks: [[882, 316]],
          skaters: [
            { role: 'G', x: 902, y: 238, unit: 'away_goalie', stickDeg: 180 },
            { role: 'F1', x: 804, y: 312, unit: 'home', stickDeg: 8 },
            { role: 'F2', x: 758, y: 392, unit: 'home', stickDeg: 0 },
            { role: 'F3', x: 682, y: 236, unit: 'home', stickDeg: 0 },
            { role: 'D1', x: 526, y: 152, unit: 'home', stickDeg: 0 },
            { role: 'D2', x: 526, y: 332, unit: 'home', stickDeg: 0 },
            { role: 'LD', x: 886, y: 320, unit: 'away', stickDeg: 180 },
            { role: 'RD', x: 868, y: 152, unit: 'away', stickDeg: 180 },
            { role: 'C', x: 742, y: 256, unit: 'away', stickDeg: 180 },
            { role: 'LW', x: 694, y: 118, unit: 'away', stickDeg: 180 },
            { role: 'RW', x: 716, y: 372, unit: 'away', stickDeg: 180 }
          ],
          paths: [
            { type: 'skate', points: [[804, 312], [872, 318]], color: '#0F2942' },
            { type: 'pass', points: [[886, 320], [694, 118]], color: '#DC2626' },
            { type: 'carry', points: [[694, 118], [520, 132], [366, 144]], color: '#DC2626' },
            { type: 'stop', points: [[526, 152], [432, 150], [356, 146]], color: '#B45309' },
            { type: 'skate', points: [[682, 236], [548, 224], [642, 212]], color: '#0F2942' },
            { type: 'pass', points: [[356, 146], [636, 212]], color: '#0F172A' }
          ]
        }
      ]
    },

    // -----------------------------------------------------------------------
    // TOPIC 3: NEUTRAL ZONE & REGROUPS
    // -----------------------------------------------------------------------
    {
      topicId: 'neutral_zone_regroups',
      legacyFocusKey: 'D-Zone',
      icon: '🔄',
      label: 'Neutral Zone & Regroups',
      title: 'Neutral Zone & Regroups — Open-Hip Hinge & Underneath Speed Swing',
      zoneLabel: 'Neutral Zone Transition',
      benchCues: [
        'Forwards never stop flat-footed at the blue line—curl underneath with speed!',
        'D1 opens Mohawk hips to scan all 3 lanes before hinging D-to-D!',
        'Hit weak-side speed in full stride entering onside!'
      ],
      stations: [
        {
          stationNum: 1,
          formatTag: '5-0 + G Skill/Read Warmup',
          heading: 'Station 1 (Skill/Read Warmup): Mohawk D1-to-D2 Hinge & 3-Lane Crossover Swing',
          cues: [
            'LW bumps puck back (- - ▸) from center red line to D1 at defensive blue line, then curls around top cone with crossovers.',
            'D1 opens hips in a Mohawk pivot and hinges D-to-D (- - ▸) across neutral ice to D2 stepping up outside the neutral dot.',
            'C and RW swing underneath center cones (──▸) building full speed; D2 hits RW wide (- - ▸) for an onside entry shot (══▸) on G.'
          ],
          cones: [[462, 112], [500, 238], [462, 364], [636, 238]],
          pucks: [[492, 98]],
          skaters: [
            { role: 'G', x: 902, y: 238, unit: 'goalie', stickDeg: 180 },
            { role: 'D1', x: 356, y: 148, unit: 'home', stickDeg: 15 },
            { role: 'D2', x: 342, y: 336, unit: 'home', stickDeg: 10 },
            { role: 'LW', x: 498, y: 96, unit: 'home', stickDeg: 175 },
            { role: 'C', x: 528, y: 214, unit: 'home', stickDeg: 180 },
            { role: 'RW', x: 518, y: 388, unit: 'home', stickDeg: 180 }
          ],
          paths: [
            { type: 'pass', points: [[498, 96], [362, 146]], color: '#0F172A' },
            { type: 'pass', points: [[356, 148], [346, 330]], color: '#0F172A' },
            { type: 'carry', points: [[342, 336], [428, 344]], color: '#0284C7' },
            { type: 'skate', points: [[528, 214], [438, 248], [552, 268], [724, 248]], color: '#0F2942' },
            { type: 'skate', points: [[518, 388], [434, 382], [588, 372], [752, 326]], color: '#0F2942' },
            { type: 'pass', points: [[428, 344], [612, 366]], color: '#0F172A' },
            { type: 'shot', points: [[752, 326], [894, 248]], color: '#DC2626' }
          ]
        },
        {
          stationNum: 2,
          formatTag: '3v2 + G Constrained Read',
          heading: 'Station 2 (Constrained 3v2 Read): 3v2 Neutral-Zone Hinge vs. F1/F2 Trap',
          cues: [
            '3 regrouping players (D1, D2, C) face 2 neutral-zone trappers (F1, F2) + G: F1 angles D1 to seal the left side of center ice.',
            'D1 hinges quick D-to-D (- - ▸) behind F1\'s stick to D2 stepping into open weak-side neutral ice.',
            'C times an underneath swing between F1 and F2, catches D2\'s seam pass (- - ▸) in full stride across the blue line, and shoots (══▸) on G.'
          ],
          cones: [[344, 82], [344, 394]],
          pucks: [[376, 152]],
          skaters: [
            { role: 'G', x: 902, y: 238, unit: 'goalie', stickDeg: 180 },
            { role: 'D1', x: 368, y: 152, unit: 'home', stickDeg: 25 },
            { role: 'D2', x: 352, y: 342, unit: 'home', stickDeg: 8 },
            { role: 'C', x: 516, y: 204, unit: 'home', stickDeg: 180 },
            { role: 'F1', x: 468, y: 162, unit: 'away', stickDeg: 190 },
            { role: 'F2', x: 546, y: 308, unit: 'away', stickDeg: 175 }
          ],
          paths: [
            { type: 'skate', points: [[468, 162], [398, 156]], color: '#DC2626' },
            { type: 'pass', points: [[368, 152], [354, 336]], color: '#0F172A' },
            { type: 'carry', points: [[352, 342], [442, 348]], color: '#0284C7' },
            { type: 'skate', points: [[516, 204], [438, 256], [596, 232], [768, 226]], color: '#0F2942' },
            { type: 'pass', points: [[442, 348], [608, 232]], color: '#0F172A' },
            { type: 'shot', points: [[768, 226], [894, 238]], color: '#DC2626' }
          ]
        },
        {
          stationNum: 3,
          formatTag: '5v5 Full-Unit Live Read',
          heading: 'Station 3 (Full-Unit 5v5 Live Read): 5v5 Neutral-Zone Counter Regroup & Speed Entry',
          cues: [
            'Full 5v5 neutral-zone transition: LD steps up at defensive blue line to force turnover against F1/F2/F3 and bumps puck to RD.',
            'LW, C, and RW immediately transition from backcheck to curling underneath in 3 balanced lanes across center red line.',
            'RD carries to red line (〜〜▸) and hits RW wide (- - ▸) attacking defending D1 and D2 onside while C drives middle net-front on G.'
          ],
          cones: [],
          pucks: [[362, 166]],
          skaters: [
            { role: 'G', x: 902, y: 238, unit: 'away_goalie', stickDeg: 180 },
            { role: 'LD', x: 356, y: 164, unit: 'home', stickDeg: 20 },
            { role: 'RD', x: 334, y: 326, unit: 'home', stickDeg: 5 },
            { role: 'LW', x: 472, y: 98, unit: 'home', stickDeg: 0 },
            { role: 'C', x: 454, y: 238, unit: 'home', stickDeg: 0 },
            { role: 'RW', x: 486, y: 394, unit: 'home', stickDeg: 0 },
            { role: 'F1', x: 422, y: 178, unit: 'away', stickDeg: 180 },
            { role: 'F2', x: 518, y: 282, unit: 'away', stickDeg: 180 },
            { role: 'F3', x: 556, y: 146, unit: 'away', stickDeg: 180 },
            { role: 'D1', x: 668, y: 168, unit: 'away', stickDeg: 180 },
            { role: 'D2', x: 668, y: 322, unit: 'away', stickDeg: 180 }
          ],
          paths: [
            { type: 'pass', points: [[356, 164], [336, 320]], color: '#0F172A' },
            { type: 'carry', points: [[334, 326], [488, 342]], color: '#0284C7' },
            { type: 'skate', points: [[486, 394], [648, 392], [774, 348]], color: '#0F2942' },
            { type: 'pass', points: [[488, 342], [648, 390]], color: '#0F172A' },
            { type: 'skate', points: [[454, 238], [674, 238], [842, 238]], color: '#0F2942' },
            { type: 'stop', points: [[780, 238], [848, 238]], color: '#B45309' },
            { type: 'shot', points: [[774, 348], [894, 246]], color: '#DC2626' }
          ]
        }
      ]
    },

    // -----------------------------------------------------------------------
    // TOPIC 4: ODD-MAN RUSH & ENTRIES
    // -----------------------------------------------------------------------
    {
      topicId: 'odd_man_rush_entries',
      legacyFocusKey: 'Rush',
      icon: '📐',
      label: 'Odd-Man Rush & Entries',
      title: 'Odd-Man Rush & Entries — Middle Drive, Onside Straddle & D1 Read',
      zoneLabel: 'Transition & Zone Entries',
      benchCues: [
        'Attack the faceoff dots in triple-threat—force D1 to commit first!',
        'Middle-lane F2/C drives net-front sticks down to push D heels back!',
        'D1 slides to pass = shoot low far-pad for tap-in rebound!'
      ],
      stations: [
        {
          stationNum: 1,
          formatTag: '4-0 + G Skill/Read Warmup',
          heading: 'Station 1 (Skill/Read Warmup): 3-Lane Blue-Line Straddle, Middle Drive & High Trailer',
          cues: [
            'LW carries wide (〜〜▸) across offensive blue line outside cone while RW straddles the blue paint on weak side to stay 100% onside.',
            'C sprints middle dot-lane (──▸) driving hard to stop at top of crease (⊥) in front of G, creating space behind.',
            'D1 joins late as 4th-man trailer into high slot, receives LW\'s delay cutback pass (- - ▸), and rips a low shot (══▸) past G.'
          ],
          cones: [[656, 78], [656, 398], [762, 134]],
          pucks: [[546, 96]],
          skaters: [
            { role: 'G', x: 902, y: 238, unit: 'goalie', stickDeg: 180 },
            { role: 'LW', x: 540, y: 96, unit: 'home', stickDeg: 10 },
            { role: 'C', x: 566, y: 238, unit: 'home', stickDeg: 0 },
            { role: 'RW', x: 632, y: 382, unit: 'home', stickDeg: -10 },
            { role: 'D1', x: 472, y: 186, unit: 'home', stickDeg: 0 }
          ],
          paths: [
            { type: 'carry', points: [[540, 96], [684, 92], [786, 114], [764, 152]], color: '#0284C7' },
            { type: 'stop', points: [[566, 238], [742, 238], [852, 238]], color: '#B45309' },
            { type: 'skate', points: [[632, 382], [652, 356], [798, 332]], color: '#0F2942' },
            { type: 'skate', points: [[472, 186], [628, 198], [734, 212]], color: '#0F2942' },
            { type: 'pass', points: [[764, 152], [734, 212]], color: '#0F172A' },
            { type: 'shot', points: [[734, 212], [894, 234]], color: '#DC2626' }
          ]
        },
        {
          stationNum: 2,
          formatTag: '2v1 + G Constrained Read',
          heading: 'Station 2 (Constrained 2v1 Read): 2v1 Rush — Read D1 Stick for Seam vs. Low Far-Pad',
          cues: [
            'True 2v1 rush (LW + RW vs lone defender D1 + G): LW attacks the left faceoff dot in triple-threat posture reading D1\'s stick blade.',
            'Read A (D1 commits to carrier): LW sauces cross-seam pass (- - ▸) over D1\'s stick to RW driving backdoor with blade on the ice.',
            'Read B (D1 slides to take RW): LW shoots 6 inches above G\'s far pad (══▸) to kick a juicy rebound straight onto RW\'s tape!'
          ],
          cones: [[500, 128], [500, 348]],
          pucks: [[528, 146]],
          skaters: [
            { role: 'G', x: 902, y: 238, unit: 'goalie', stickDeg: 180 },
            { role: 'LW', x: 522, y: 146, unit: 'home', isYou: true, stickDeg: 12 },
            { role: 'RW', x: 532, y: 344, unit: 'home', stickDeg: -12 },
            { role: 'D1', x: 718, y: 238, unit: 'away', stickDeg: 185 }
          ],
          paths: [
            { type: 'carry', points: [[522, 146], [678, 152], [768, 162]], color: '#0284C7' },
            { type: 'skate', points: [[718, 238], [798, 244]], color: '#DC2626' },
            { type: 'skate', points: [[532, 344], [698, 336], [834, 298]], color: '#0F2942' },
            { type: 'pass', points: [[768, 162], [830, 294]], color: '#0F172A' },
            { type: 'shot', points: [[834, 298], [896, 252]], color: '#DC2626' }
          ]
        },
        {
          stationNum: 3,
          formatTag: '5v5 Full-Unit Live Read',
          heading: 'Station 3 (Full-Unit 5v5 Live Read): 5v5 Transition Rush w/ Backcheckers & Trailer D',
          cues: [
            'Full 5v5 live rush: LW, C, and RW attack defending D1 and D2 across the blue line while LD and RD join as weak-side 4th-wave support.',
            'Chasing backcheckers F1, F2, and F3 sprint hard through the middle dot-to-dot lane to strip any slow delay.',
            'LW enters wide (〜〜▸), C drives net-front on G (⊥), RW pulls D2 wide, and LW hits trailing LD (- - ▸) stepping into high slot for a clean shot (══▸).'
          ],
          cones: [],
          pucks: [[568, 108]],
          skaters: [
            { role: 'G', x: 902, y: 238, unit: 'away_goalie', stickDeg: 180 },
            { role: 'LW', x: 562, y: 108, unit: 'home', stickDeg: 8 },
            { role: 'C', x: 586, y: 238, unit: 'home', stickDeg: 0 },
            { role: 'RW', x: 574, y: 374, unit: 'home', stickDeg: -8 },
            { role: 'LD', x: 432, y: 176, unit: 'home', stickDeg: 0 },
            { role: 'RD', x: 416, y: 318, unit: 'home', stickDeg: 0 },
            { role: 'D1', x: 706, y: 178, unit: 'away', stickDeg: 180 },
            { role: 'D2', x: 712, y: 306, unit: 'away', stickDeg: 180 },
            { role: 'F1', x: 492, y: 214, unit: 'away', stickDeg: 0 },
            { role: 'F2', x: 468, y: 284, unit: 'away', stickDeg: 0 },
            { role: 'F3', x: 382, y: 238, unit: 'away', stickDeg: 0 }
          ],
          paths: [
            { type: 'carry', points: [[562, 108], [748, 104], [792, 144]], color: '#0284C7' },
            { type: 'stop', points: [[586, 238], [848, 238]], color: '#B45309' },
            { type: 'skate', points: [[574, 374], [794, 356]], color: '#0F2942' },
            { type: 'skate', points: [[432, 176], [612, 186], [736, 198]], color: '#0F2942' },
            { type: 'skate', points: [[492, 214], [692, 218]], color: '#DC2626' },
            { type: 'pass', points: [[792, 144], [736, 198]], color: '#0F172A' },
            { type: 'shot', points: [[736, 198], [896, 236]], color: '#DC2626' }
          ]
        }
      ]
    },

    // -----------------------------------------------------------------------
    // TOPIC 5: O-ZONE CYCLING & NET-FRONT
    // -----------------------------------------------------------------------
    {
      topicId: 'ozone_cycling_netfront',
      legacyFocusKey: 'O-Zone',
      icon: '🔥',
      label: 'O-Zone Cycling & Net-Front',
      title: 'O-Zone Cycling & Net-Front — Cutbacks, Scissors & Royal Road Tips',
      zoneLabel: 'Offensive Zone Possession',
      benchCues: [
        'Punch-turn cutback on the wall buys 2 full seconds to scan high!',
        'High scissors switch at top of circle shakes man-on-man trackers!',
        'Eyes-level net-front screen at crease edge—keep stick free for tips!'
      ],
      stations: [
        {
          stationNum: 1,
          formatTag: '4-0 + G Skill/Read Warmup',
          heading: 'Station 1 (Skill/Read Warmup): Corner Cutbacks, High Scissors & Crease Screen',
          cues: [
            'RW carries deep down right wall (〜〜▸), executes a hard punch-turn cutback around corner cone, and cycles high toward top of circle.',
            'C crosses underneath RW in a high scissors switch (──▸), takes handoff pass (- - ▸), and feeds D1 walking the offensive blue line.',
            'LW skates from weak side and stops at top of blue crease (⊥) to screen G\'s eyes while D1 fires a low wrist shot (══▸) for a stick deflection.'
          ],
          cones: [[892, 386], [768, 342], [754, 152]],
          pucks: [[834, 396]],
          skaters: [
            { role: 'G', x: 902, y: 238, unit: 'goalie', stickDeg: 180 },
            { role: 'RW', x: 828, y: 398, unit: 'home', stickDeg: -20 },
            { role: 'C', x: 752, y: 292, unit: 'home', stickDeg: 45 },
            { role: 'LW', x: 766, y: 126, unit: 'home', stickDeg: 35 },
            { role: 'D1', x: 672, y: 218, unit: 'home', stickDeg: 0 }
          ],
          paths: [
            { type: 'carry', points: [[828, 398], [912, 392], [872, 346], [792, 326]], color: '#0284C7' },
            { type: 'skate', points: [[752, 292], [806, 356], [742, 318]], color: '#0F2942' },
            { type: 'pass', points: [[792, 326], [676, 222]], color: '#0F172A' },
            { type: 'carry', points: [[672, 218], [678, 246]], color: '#0284C7' },
            { type: 'stop', points: [[766, 126], [834, 198], [864, 238]], color: '#B45309' },
            { type: 'shot', points: [[678, 246], [894, 240]], color: '#DC2626' }
          ]
        },
        {
          stationNum: 2,
          formatTag: '3v2 + G Constrained Read',
          heading: 'Station 2 (Constrained 3v2 Read): 3v2 Low Cycle to Royal Road Slot Strike',
          cues: [
            '3 offensive forwards (LW, C, RW) cycle against 2 defenders (D1, D2) + G: C protects puck behind net and bumps low (- - ▸) to LW in left corner.',
            'When D1 chases LW into the corner and D2 ties up C at the near post, RW slips quietly into weak-side Royal Road slot ice (──▸).',
            'LW threads a cross-seam Royal Road pass (- - ▸) to RW for an instant 1-timer (══▸) before G can push east-west across the crease.'
          ],
          cones: [[656, 86], [656, 390]],
          pucks: [[934, 216]],
          skaters: [
            { role: 'G', x: 902, y: 238, unit: 'goalie', stickDeg: 180 },
            { role: 'C', x: 936, y: 222, unit: 'home', stickDeg: -110 },
            { role: 'LW', x: 896, y: 96, unit: 'home', stickDeg: 95 },
            { role: 'RW', x: 742, y: 348, unit: 'home', stickDeg: -25 },
            { role: 'D1', x: 856, y: 158, unit: 'away', stickDeg: -60 },
            { role: 'D2', x: 868, y: 264, unit: 'away', stickDeg: 180 }
          ],
          paths: [
            { type: 'pass', points: [[936, 222], [902, 104]], color: '#0F172A' },
            { type: 'skate', points: [[856, 158], [888, 114]], color: '#DC2626' },
            { type: 'carry', points: [[896, 96], [834, 108]], color: '#0284C7' },
            { type: 'stop', points: [[936, 222], [876, 224]], color: '#B45309' },
            { type: 'skate', points: [[742, 348], [798, 296]], color: '#0F2942' },
            { type: 'pass', points: [[834, 108], [798, 294]], color: '#0F172A' },
            { type: 'shot', points: [[798, 296], [896, 250]], color: '#DC2626' }
          ]
        },
        {
          stationNum: 3,
          formatTag: '5v5 Full-Unit Live Read',
          heading: 'Station 3 (Full-Unit 5v5 Live Read): 5v5 3-Pass Cycle, Point Walk & Box+1 Rebound Hunt',
          cues: [
            'Full 5v5 O-Zone possession against defending Box+1 (D1, D2, F1, F2, F3 + G): LW and C execute a 2-man low cycle in the left corner.',
            'LW rims/bumps high (- - ▸) to LD at the left point; LD walks the blue line toward middle (〜〜▸) pulling F2 out of the shooting lane and feeds RD.',
            'RD fires a low slap-pass/shot (══▸) while RW screens G at top of blue paint (⊥) and C spins off D1 for weak-side rebound tap-ins.'
          ],
          cones: [],
          pucks: [[912, 112]],
          skaters: [
            { role: 'G', x: 902, y: 238, unit: 'away_goalie', stickDeg: 180 },
            { role: 'LW', x: 906, y: 108, unit: 'home', stickDeg: 135 },
            { role: 'C', x: 848, y: 146, unit: 'home', stickDeg: 80 },
            { role: 'RW', x: 836, y: 298, unit: 'home', stickDeg: -20 },
            { role: 'LD', x: 672, y: 122, unit: 'home', stickDeg: 20 },
            { role: 'RD', x: 674, y: 334, unit: 'home', stickDeg: -20 },
            { role: 'D1', x: 874, y: 168, unit: 'away', stickDeg: -45 },
            { role: 'D2', x: 868, y: 268, unit: 'away', stickDeg: 180 },
            { role: 'F1', x: 812, y: 218, unit: 'away', stickDeg: 180 },
            { role: 'F2', x: 726, y: 158, unit: 'away', stickDeg: 195 },
            { role: 'F3', x: 734, y: 312, unit: 'away', stickDeg: 165 }
          ],
          paths: [
            { type: 'pass', points: [[906, 108], [678, 124]], color: '#0F172A' },
            { type: 'carry', points: [[672, 122], [676, 214]], color: '#0284C7' },
            { type: 'pass', points: [[676, 214], [676, 328]], color: '#0F172A' },
            { type: 'stop', points: [[836, 298], [864, 242]], color: '#B45309' },
            { type: 'skate', points: [[848, 146], [866, 206]], color: '#0F2942' },
            { type: 'shot', points: [[674, 334], [896, 244]], color: '#DC2626' }
          ]
        }
      ]
    },

    // -----------------------------------------------------------------------
    // TOPIC 6: SPECIAL TEAMS (PP & PK)
    // -----------------------------------------------------------------------
    {
      topicId: 'special_teams_pp_pk',
      legacyFocusKey: 'Power Plays',
      icon: '🛡️',
      label: 'Special Teams (PP & PK)',
      title: 'Special Teams (PP & PK) — 5v4 Umbrella Overload & 4v5 Seam Denial',
      zoneLabel: '5v4 Power Play & 4v5 Penalty Kill',
      benchCues: [
        'PP: Walk the umbrella to draw 2 PK sticks, then snap 1-touch!',
        'PP Bumper C & backdoor flank keep blades cocked on forehand!',
        'PK Diamond/Box: Active sticks in Royal Road seams—clear 200 feet!'
      ],
      stations: [
        {
          stationNum: 1,
          formatTag: '5-0 + G Skill/Read Warmup',
          heading: 'Station 1 (Skill/Read Warmup): 5-Man 1-Touch Umbrella, Bumper Pop & Crease Screen',
          cues: [
            '5-man Power Play unit sets 1-3-1 Umbrella around 4 PK seam cones: LD quarterbacks top middle, LW and RW man flanks, C loads bumper, RD screens G.',
            'LD walks blue line (〜〜▸) and snaps 1-touch pass (- - ▸) to left flank LW; LW threads seam pass into bumper C between cones.',
            'C pops a 1-touch dish (- - ▸) to right flank RW stepping into circle dot for a one-timer (══▸) while RD takes G\'s eyes away (⊥).'
          ],
          cones: [[748, 178], [748, 298], [834, 184], [834, 292]],
          pucks: [[678, 238]],
          skaters: [
            { role: 'G', x: 902, y: 238, unit: 'goalie', stickDeg: 180 },
            { role: 'LD', x: 672, y: 238, unit: 'home', stickDeg: 0 },
            { role: 'LW', x: 778, y: 108, unit: 'home', stickDeg: 35 },
            { role: 'RW', x: 778, y: 368, unit: 'home', stickDeg: -35 },
            { role: 'C', x: 792, y: 238, unit: 'home', stickDeg: 180 },
            { role: 'RD', x: 866, y: 256, unit: 'home', stickDeg: 180 }
          ],
          paths: [
            { type: 'carry', points: [[672, 238], [678, 198]], color: '#0284C7' },
            { type: 'pass', points: [[678, 198], [774, 114]], color: '#0F172A' },
            { type: 'pass', points: [[778, 108], [790, 234]], color: '#0F172A' },
            { type: 'pass', points: [[792, 238], [780, 362]], color: '#0F172A' },
            { type: 'stop', points: [[866, 256], [866, 238]], color: '#B45309' },
            { type: 'shot', points: [[778, 368], [896, 246]], color: '#DC2626' }
          ]
        },
        {
          stationNum: 2,
          formatTag: '5v4 + G Constrained Read',
          heading: 'Station 2 (Constrained 5v4 Read): 5v4 Flank Overload vs. 4-Man PK Diamond Box',
          cues: [
            'Live 5v4 Power Play (LD, LW, RW, C, RD) attacks 4-man PK Diamond/Box (F1, F2, D1, D2) + G inside offensive zone.',
            'LD draws top killer F1 and feeds LW on left circle; LW walks down (〜〜▸) forcing D1 to choose between bumper C and goal-line RD.',
            'When D2 slides across to cover RD, LW snaps a cross-seam pass (- - ▸) to weak-side RW hammering the backdoor one-timer (══▸) on G.'
          ],
          cones: [],
          pucks: [[684, 238]],
          skaters: [
            { role: 'G', x: 902, y: 238, unit: 'away_goalie', stickDeg: 180 },
            { role: 'LD', x: 676, y: 238, unit: 'home', stickDeg: 0 },
            { role: 'LW', x: 774, y: 102, unit: 'home', stickDeg: 35 },
            { role: 'RW', x: 798, y: 374, unit: 'home', stickDeg: -35 },
            { role: 'C', x: 794, y: 238, unit: 'home', stickDeg: 180 },
            { role: 'RD', x: 886, y: 176, unit: 'home', stickDeg: 110 },
            { role: 'F1', x: 734, y: 214, unit: 'away', stickDeg: 185 },
            { role: 'F2', x: 756, y: 306, unit: 'away', stickDeg: 170 },
            { role: 'D1', x: 842, y: 178, unit: 'away', stickDeg: -65 },
            { role: 'D2', x: 848, y: 278, unit: 'away', stickDeg: 165 }
          ],
          paths: [
            { type: 'pass', points: [[676, 238], [770, 108]], color: '#0F172A' },
            { type: 'skate', points: [[734, 214], [748, 146]], color: '#DC2626' },
            { type: 'carry', points: [[774, 102], [818, 138]], color: '#0284C7' },
            { type: 'skate', points: [[798, 374], [836, 326]], color: '#0F2942' },
            { type: 'pass', points: [[818, 138], [834, 322]], color: '#0F172A' },
            { type: 'shot', points: [[836, 326], [896, 248]], color: '#DC2626' }
          ]
        },
        {
          stationNum: 3,
          formatTag: '5v5 Full-Unit Live Read',
          heading: 'Station 3 (Full-Unit 5v5 Live Read): 5v5 Delayed-Penalty Drop-Pass Entry & Special-Teams Battle',
          cues: [
            'Full 5v5 special-teams transition: LD starts controlled breakout behind left net, skates to red line (〜〜▸), and executes a delayed-entry drop pass (- - ▸) to flying C.',
            'LW and RW push defending F1, F2, F3, D1, and D2 heels back at the offensive blue line while RD holds middle blue-line safety.',
            'C enters with speed into open slot space (──▸), hits LW on left circle (- - ▸), and crashes net-front on G for a quick-strike PP setup (══▸).'
          ],
          cones: [],
          pucks: [[292, 238]],
          skaters: [
            { role: 'G', x: 902, y: 238, unit: 'away_goalie', stickDeg: 180 },
            { role: 'LD', x: 286, y: 238, unit: 'home', stickDeg: 0 },
            { role: 'C', x: 184, y: 268, unit: 'home', stickDeg: 0 },
            { role: 'LW', x: 598, y: 94, unit: 'home', stickDeg: 10 },
            { role: 'RW', x: 604, y: 382, unit: 'home', stickDeg: -10 },
            { role: 'RD', x: 356, y: 332, unit: 'home', stickDeg: 0 },
            { role: 'F1', x: 526, y: 214, unit: 'away', stickDeg: 180 },
            { role: 'F2', x: 618, y: 172, unit: 'away', stickDeg: 180 },
            { role: 'F3', x: 618, y: 304, unit: 'away', stickDeg: 180 },
            { role: 'D1', x: 682, y: 192, unit: 'away', stickDeg: 180 },
            { role: 'D2', x: 682, y: 292, unit: 'away', stickDeg: 180 }
          ],
          paths: [
            { type: 'carry', points: [[286, 238], [468, 224]], color: '#0284C7' },
            { type: 'pass', points: [[468, 224], [412, 256]], color: '#0F172A' },
            { type: 'skate', points: [[184, 268], [412, 256], [668, 238], [768, 226]], color: '#0F2942' },
            { type: 'skate', points: [[598, 94], [652, 102], [784, 128]], color: '#0F2942' },
            { type: 'pass', points: [[768, 226], [782, 132]], color: '#0F172A' },
            { type: 'shot', points: [[784, 128], [896, 232]], color: '#DC2626' }
          ]
        }
      ]
    }
  ];

  function resolvePracticeTopicPack(rawKey) {
    var k = String(rawKey || 'breakouts_regroups').trim().toLowerCase();
    for (var i = 0; i < PRACTICE_STATION_TOPICS.length; i++) {
      var tp = PRACTICE_STATION_TOPICS[i];
      if (tp.topicId === k || tp.legacyFocusKey.toLowerCase() === k || tp.label.toLowerCase() === k) {
        return tp;
      }
    }
    if (k.indexOf('special') !== -1 || k.indexOf('power') !== -1 || k.indexOf('umbrella') !== -1 || k.indexOf('pk') !== -1 || k.indexOf('pp') !== -1) {
      return PRACTICE_STATION_TOPICS[5];
    }
    if (k.indexOf('cycle') !== -1 || k.indexOf('royal') !== -1 || k.indexOf('net-front') !== -1 || k.indexOf('net_front') !== -1 || k.indexOf('o-zone') !== -1 || k.indexOf('oz_') !== -1 || k.indexOf('spacing') !== -1) {
      return PRACTICE_STATION_TOPICS[4];
    }
    if (k.indexOf('rush') !== -1 || k.indexOf('2v1') !== -1 || k.indexOf('2-on-1') !== -1 || k.indexOf('entry') !== -1 || k.indexOf('entries') !== -1 || k.indexOf('odd') !== -1) {
      return PRACTICE_STATION_TOPICS[3];
    }
    if (k.indexOf('neutral') !== -1 || k.indexOf('nz_') !== -1 || k.indexOf('d-zone') !== -1 || k.indexOf('dz_') !== -1 || k.indexOf('house') !== -1 || k.indexOf('goalie') !== -1 || k.indexOf('crease') !== -1) {
      return PRACTICE_STATION_TOPICS[2];
    }
    if (k.indexOf('forecheck') !== -1 || k.indexOf('2-1-2') !== -1 || k.indexOf('gap') !== -1 || k.indexOf('angling') !== -1) {
      return PRACTICE_STATION_TOPICS[1];
    }
    return PRACTICE_STATION_TOPICS[0];
  }

  function renderPracticeStationDiagramSvg(topicOrCard, stationNum, opts) {
    var options = opts || {};
    var pack = (topicOrCard && Array.isArray(topicOrCard.stations))
      ? topicOrCard
      : resolvePracticeTopicPack((topicOrCard && (topicOrCard.topicId || topicOrCard.bucketId || topicOrCard.focusKey || topicOrCard.title)) || topicOrCard);
    var stIdx = Math.max(0, Math.min(2, (Number(stationNum) || 1) - 1));
    var st = pack.stations[stIdx];
    var uid = 'ps_' + pack.topicId + '_s' + st.stationNum;

    var conesSvg = (st.cones || []).map(function (c) { return renderConeSvg(c[0], c[1]); }).join('');
    var pathsSvg = (st.paths || []).map(renderIhsVectorPath).join('');
    var skatersSvg = (st.skaters || []).map(renderSkaterTokenSvg).join('');
    var pucksSvg = (st.pucks || []).map(function (p) { return renderPuckSvg(p[0], p[1], st.skaters); }).join('');

    var nonGoalieCount = (st.skaters || []).filter(function (s) { return s.role !== 'G' && s.unit !== 'goalie' && s.unit !== 'away_goalie'; }).length;
    var classStr = options.printFullPage
      ? 'w-full h-full max-h-full block rounded-xl border-2 border-slate-900 bg-white select-none'
      : 'w-full h-auto rounded-xl border-2 border-slate-400 bg-white shadow-md select-none';
    var styleStr = options.printFullPage ? ' style="width:100%;height:100%;max-height:100%;"' : '';

    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 536" preserveAspectRatio="xMidYMid meet"' + styleStr + ' ' +
      'data-mini-rink-svg="station-' + st.stationNum + '" ' +
      'data-station-topic="' + esc(pack.topicId) + '" ' +
      'data-station-num="' + st.stationNum + '" ' +
      'data-station-format="' + esc(st.formatTag) + '" ' +
      'data-non-goalie-skaters="' + nonGoalieCount + '" ' +
      'class="' + classStr + '" role="img" aria-label="' + esc(pack.label + ' — ' + st.heading) + '">' +
      renderRegulationRinkSheetSvg(uid, {
        showLeftHouse: pack.topicId === 'breakouts_regroups',
        showRightHouse: pack.topicId === 'ozone_cycling_netfront' || pack.topicId === 'special_teams_pp_pk'
      }) +
      conesSvg +
      pathsSvg +
      skatersSvg +
      pucksSvg +
      renderIhsLegendStripSvg() +
      '</svg>'
    );
  }

  // =========================================================================
  // SLICE 6: DATA-DRIVEN `PREVIEW ALL 5 PLAYS` SNAPSHOTS FROM `catalog_45.json`
  // =========================================================================
  function mapYToSheet(y500) {
    var clamped = Math.max(18, Math.min(482, Number(y500) || 250));
    return 14 + ((clamped / 500) * 448);
  }

  function mapXToSheet(x1000) {
    var clamped = Math.max(24, Math.min(976, Number(x1000) || 500));
    return 20 + ((clamped / 1000) * 960);
  }

  function mapPt(pt) {
    if (!Array.isArray(pt) || pt.length < 2) return [500, 238];
    return [mapXToSheet(pt[0]), mapYToSheet(pt[1])];
  }

  function renderCatalogPlayThumbnailSVG(drillRaw) {
    var drill = drillRaw;
    if (g.SynapzV14Modules && typeof g.SynapzV14Modules.normalizeDrillLineup === 'function' && drillRaw) {
      try {
        drill = g.SynapzV14Modules.normalizeDrillLineup(drillRaw);
      } catch (_) {
        drill = drillRaw;
      }
    }
    if (!drill || typeof drill !== 'object') {
      return renderPracticeStationDiagramSvg('breakouts_regroups', 1);
    }

    var cid = String(drill.conceptId || drill.id || 'PLAY').replace(/[^A-Za-z0-9_-]/g, '');
    var uid = 'thumb_' + cid;
    var primaryRole = String(drill.primaryRole || drill.youRole || 'C').toUpperCase();
    var skatersRaw = Array.isArray(drill.skaters) ? drill.skaters : [];
    var mc = drill.modeConfig || {};

    var vectorPaths = [];
    // 1. Skate vectors from each skater's actual `motion` array in catalog_45.json
    for (var i = 0; i < skatersRaw.length; i++) {
      var sk = skatersRaw[i];
      if (!sk || sk.id === 'G') continue;
      var mot = Array.isArray(sk.motion) ? sk.motion : [];
      if (mot.length >= 2) {
        var mappedMot = mot.map(mapPt);
        var dist = Math.hypot(mappedMot[mappedMot.length - 1][0] - mappedMot[0][0], mappedMot[mappedMot.length - 1][1] - mappedMot[0][1]);
        if (dist >= 22) {
          var isPrimary = sk.id === primaryRole && sk.team !== 'away';
          vectorPaths.push({
            type: isPrimary ? 'carry' : 'skate',
            points: mappedMot,
            color: sk.team === 'away' ? '#DC2626' : (isPrimary ? '#0D9488' : '#334155'),
            width: isPrimary ? 4.0 : 2.8
          });
        }
      }
    }

    // 2. Puck live/gold pass or shot vector from `drill.puck`
    var puckLive = Array.isArray(drill.puck && drill.puck.livePath) ? drill.puck.livePath.map(mapPt) : [];
    var puckGold = Array.isArray(drill.puck && drill.puck.goldPath) ? drill.puck.goldPath.map(mapPt) : [];
    if (puckGold.length >= 2) {
      var gd = Math.hypot(puckGold[puckGold.length - 1][0] - puckGold[0][0], puckGold[puckGold.length - 1][1] - puckGold[0][1]);
      if (gd >= 18) {
        vectorPaths.push({
          type: 'pass',
          points: puckGold,
          color: '#059669',
          width: 3.4
        });
      }
    }

    // 3. Mode-specific target accents (THIS SPACE halo or A/B/C option badges)
    var modeAccentsSvg = '';
    if (mc.thisSpace && typeof mc.thisSpace.x === 'number') {
      var ts = mapPt([mc.thisSpace.x, mc.thisSpace.y]);
      modeAccentsSvg += '<ellipse cx="' + ts[0].toFixed(1) + '" cy="' + ts[1].toFixed(1) + '" rx="42" ry="34" fill="rgba(245,158,11,0.20)" stroke="#D97706" stroke-width="2.6" stroke-dasharray="7 5"/>';
    } else if (Array.isArray(mc.targetZoneKeyframes) && mc.targetZoneKeyframes.length > 0) {
      var kf = mc.targetZoneKeyframes[mc.targetZoneKeyframes.length - 1];
      var kp = mapPt([kf.x, kf.y]);
      modeAccentsSvg += '<ellipse cx="' + kp[0].toFixed(1) + '" cy="' + kp[1].toFixed(1) + '" rx="44" ry="36" fill="rgba(16,185,129,0.18)" stroke="#059669" stroke-width="2.6" stroke-dasharray="7 5"/>';
    }
    if (Array.isArray(mc.options)) {
      modeAccentsSvg += mc.options.slice(0, 3).map(function (opt) {
        if (!opt || !Array.isArray(opt.target)) return '';
        var op = mapPt(opt.target);
        var bCol = opt.id === 'A' ? '#0D9488' : (opt.id === 'B' ? '#2563EB' : '#D97706');
        return (
          '<g data-thumb-option="' + esc(opt.id) + '">' +
          '<circle cx="' + op[0].toFixed(1) + '" cy="' + op[1].toFixed(1) + '" r="13" fill="#FFFFFF" stroke="' + bCol + '" stroke-width="2.8"/>' +
          '<text x="' + op[0].toFixed(1) + '" y="' + (op[1] + 4.2).toFixed(1) + '" font-family="Inter,Segoe UI,Arial,sans-serif" font-weight="900" font-size="11.5" fill="' + bCol + '" text-anchor="middle">' + esc(opt.id) + '</text>' +
          '</g>'
        );
      }).join('');
    }

    // 4. All real skaters from `drill.skaters` at setup positions with `primaryRole` gold halo
    var skaterTokensSvg = skatersRaw.map(function (sk) {
      var stPt = mapPt(sk.start || (sk.motion && sk.motion[0]) || [500, 250]);
      var role = String(sk.label || sk.id || 'C');
      var isGoalie = sk.id === 'G' || role === 'G';
      var unit = isGoalie
        ? (sk.team === 'away' ? 'away_goalie' : 'goalie')
        : (sk.team === 'away' ? 'away' : 'home');
      return renderSkaterTokenSvg({
        role: role,
        x: stPt[0],
        y: stPt[1],
        unit: unit,
        isYou: !isGoalie && sk.team !== 'away' && sk.id === primaryRole,
        stickDeg: sk.stickAngleDeg != null ? sk.stickAngleDeg : (sk.team === 'away' ? 180 : 0)
      });
    }).join('');

    var mappedSkatersForPuck = skatersRaw.map(function (sk) {
      var stPt = mapPt(sk.start || (sk.motion && sk.motion[0]) || [500, 250]);
      return {
        x: stPt[0],
        y: stPt[1],
        unit: sk.team === 'away' ? 'away' : 'home',
        stickDeg: sk.stickAngleDeg != null ? sk.stickAngleDeg : (sk.team === 'away' ? 180 : 0)
      };
    });
    var puckPt = puckLive.length > 0 ? puckLive[0] : mapPt([500, 250]);
    var puckSvg = renderPuckSvg(puckPt[0], puckPt[1], mappedSkatersForPuck);

    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 476" ' +
      'data-catalog-play-thumbnail="' + esc(drill.conceptId || drill.id) + '" ' +
      'data-thumbnail-primary-role="' + esc(primaryRole) + '" ' +
      'data-thumbnail-skater-count="' + skatersRaw.length + '" ' +
      'class="w-full h-auto rounded-xl border-2 border-cyan-400/65 bg-white shadow select-none" ' +
      'role="img" aria-label="' + esc((drill.conceptId || '') + ' ' + (drill.title || 'Play Snapshot') + ' — YOU ARE: ' + primaryRole) + '">' +
      renderRegulationRinkSheetSvg(uid, {
        showLeftHouse: drill.zone === 'DZ' || drill.zone === 'ST',
        showRightHouse: drill.zone === 'OZ'
      }) +
      modeAccentsSvg +
      vectorPaths.map(renderIhsVectorPath).join('') +
      skaterTokensSvg +
      puckSvg +
      '</svg>'
    );
  }

  var api = {
    PRACTICE_STATION_TOPICS: PRACTICE_STATION_TOPICS,
    resolvePracticeTopicPack: resolvePracticeTopicPack,
    renderPracticeStationDiagramSvg: renderPracticeStationDiagramSvg,
    renderCatalogPlayThumbnailSVG: renderCatalogPlayThumbnailSVG
  };

  g.SynapzPracticeStationsSVG = api;
  g.renderCatalogPlayThumbnailSVG = renderCatalogPlayThumbnailSVG;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
