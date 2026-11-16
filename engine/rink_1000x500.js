/**
 * SYNAPZ HOCKEY v14.0 — Universal 1000×500 Honest Hockey + IHS White-Ice Engine
 * (`engine/rink_1000x500.js`)
 *
 * Canonical Logical Grid:
 *  - Width: 1000 (x: 0..1000), Height: 500 (y: 0..500)
 *  - Goal lines: x = 89 & x = 911
 *  - Blue lines: x = 340 & x = 660
 *  - Center red line & dot: x = 500, (500, 250)
 *  - End-zone faceoff dots: (220, 140), (220, 360), (780, 140), (780, 360)
 *  - Left Defensive House: [(89,215),(220,140),(310,185),(310,315),(220,360),(89,285)]
 *  - Right House Mirror:   [(911,215),(780,140),(690,185),(690,315),(780,360),(911,285)]
 */

export const RINK_SPEC = Object.freeze({
  WIDTH: 1000,
  HEIGHT: 500,
  CORNER_RADIUS: 138,
  GOAL_LEFT_X: 89,
  GOAL_RIGHT_X: 911,
  BLUE_LEFT_X: 340,
  BLUE_RIGHT_X: 660,
  CENTER_X: 500,
  CENTER_Y: 250,
  CIRCLE_RADIUS: 75,
  END_DOTS: [
    [220, 140],
    [220, 360],
    [780, 140],
    [780, 360]
  ],
  NEUTRAL_DOTS: [
    [390, 140],
    [390, 360],
    [610, 140],
    [610, 360]
  ],
  LEFT_HOUSE: [
    [89, 215],
    [220, 140],
    [310, 185],
    [310, 315],
    [220, 360],
    [89, 285]
  ],
  RIGHT_HOUSE: [
    [911, 215],
    [780, 140],
    [690, 185],
    [690, 315],
    [780, 360],
    [911, 285]
  ]
});

export function samplePolylineAt(points, tRaw) {
  if (!Array.isArray(points) || points.length === 0) return [500, 250];
  if (points.length === 1) return [points[0][0], points[0][1]];
  const t = Math.max(0, Math.min(1, Number(tRaw) || 0));
  if (t <= 0) return [points[0][0], points[0][1]];
  if (t >= 1) return [points[points.length - 1][0], points[points.length - 1][1]];

  const segLengths = [];
  let totalLen = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1][0] - points[i][0];
    const dy = points[i + 1][1] - points[i][1];
    const d = Math.hypot(dx, dy);
    segLengths.push(d);
    totalLen += d;
  }
  if (totalLen < 0.001) return [points[0][0], points[0][1]];

  const targetDist = t * totalLen;
  let acc = 0;
  for (let i = 0; i < segLengths.length; i++) {
    const seg = segLengths[i];
    if (acc + seg >= targetDist || i === segLengths.length - 1) {
      const localT = seg > 0.0001 ? (targetDist - acc) / seg : 0;
      return [
        points[i][0] + (points[i + 1][0] - points[i][0]) * localT,
        points[i][1] + (points[i + 1][1] - points[i][1]) * localT
      ];
    }
    acc += seg;
  }
  return [points[points.length - 1][0], points[points.length - 1][1]];
}

export function slicePolylineUpTo(points, progressRaw) {
  if (!Array.isArray(points) || points.length < 2) return points || [];
  const p = Math.max(0, Math.min(1, Number(progressRaw ?? 1)));
  if (p >= 0.999) return points;
  if (p <= 0.001) return [points[0], points[0]];

  let total = 0;
  const segs = [];
  for (let i = 0; i < points.length - 1; i++) {
    const d = Math.hypot(points[i + 1][0] - points[i][0], points[i + 1][1] - points[i][1]);
    segs.push(d);
    total += d;
  }
  if (total < 0.01) return [points[0], points[0]];
  const want = total * p;
  const out = [points[0]];
  let acc = 0;
  for (let i = 0; i < segs.length; i++) {
    if (acc + segs[i] >= want) {
      const lt = segs[i] > 0.0001 ? (want - acc) / segs[i] : 0;
      out.push([
        points[i][0] + (points[i + 1][0] - points[i][0]) * lt,
        points[i][1] + (points[i + 1][1] - points[i][1]) * lt
      ]);
      break;
    }
    out.push(points[i + 1]);
    acc += segs[i];
  }
  return out;
}

export class WhiteIceRink1000x500 {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.federationMode = options.federationMode || 'USA';
    this.orientation = options.orientation || 'landscape'; // 'landscape' | 'portrait'
    this.camera = { focusX: 500, focusY: 250, zoom: 1.35 };
    this._viewportTransform = {
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      cssW: 800,
      cssH: 450,
      dpr: 1,
      portrait: false
    };
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
  }

  setFederationMode(fed) {
    this.federationMode = String(fed || 'USA').toUpperCase();
  }

  setOrientation(mode) {
    this.orientation = mode === 'portrait' ? 'portrait' : 'landscape';
  }

  setCamera(cam = {}) {
    const zoom = Math.max(1.0, Math.min(1.80, Number(cam.zoom || 1.35)));
    const focusX = Math.max(80, Math.min(920, Number(cam.focusX ?? 500)));
    const focusY = Math.max(70, Math.min(430, Number(cam.focusY ?? 250)));
    this.camera = { focusX, focusY, zoom };
  }

  syncCanvasResolution() {
    if (!this.canvas) return this._viewportTransform;
    const rect = this.canvas.getBoundingClientRect();
    const cssW = Math.max(260, Math.round(rect.width || this.canvas.clientWidth || 720));
    const cssH = Math.max(180, Math.round(rect.height || this.canvas.clientHeight || 400));
    const dpr = Math.min(2.5, (typeof window !== 'undefined' && window.devicePixelRatio) || 1);
    const targetW = Math.round(cssW * dpr);
    const targetH = Math.round(cssH * dpr);
    if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
      this.canvas.width = targetW;
      this.canvas.height = targetH;
    }

    const portrait = this.orientation === 'portrait';
    const worldW = portrait ? RINK_SPEC.HEIGHT : RINK_SPEC.WIDTH;
    const worldH = portrait ? RINK_SPEC.WIDTH : RINK_SPEC.HEIGHT;

    const pad = 8;
    const baseScale = Math.min((cssW - pad * 2) / worldW, (cssH - pad * 2) / worldH);
    const scale = baseScale * (this.camera.zoom || 1.35);

    // Map logical focus point into world space (supporting North-South 90° CCW portrait rotation)
    const worldFocusX = portrait ? this.camera.focusY : this.camera.focusX;
    const worldFocusY = portrait ? (RINK_SPEC.WIDTH - this.camera.focusX) : this.camera.focusY;

    // Clamp camera pan so we don't expose excessive void outside the rink boards
    const viewHalfW = (cssW / 2) / scale;
    const viewHalfH = (cssH / 2) / scale;
    const margin = 24;
    const minFX = Math.min(worldW / 2, Math.max(-margin + viewHalfW, 0));
    const maxFX = Math.max(worldW / 2, Math.min(worldW + margin - viewHalfW, worldW));
    const minFY = Math.min(worldH / 2, Math.max(-margin + viewHalfH, 0));
    const maxFY = Math.max(worldH / 2, Math.min(worldH + margin - viewHalfH, worldH));

    const clampedFX = viewHalfW * 2 >= worldW + margin * 2
      ? worldW / 2
      : Math.max(minFX, Math.min(maxFX, worldFocusX));
    const clampedFY = viewHalfH * 2 >= worldH + margin * 2
      ? worldH / 2
      : Math.max(minFY, Math.min(maxFY, worldFocusY));

    const offsetX = cssW / 2 - clampedFX * scale;
    const offsetY = cssH / 2 - clampedFY * scale;

    this._viewportTransform = {
      scale,
      offsetX,
      offsetY,
      cssW,
      cssH,
      dpr,
      portrait
    };
    return this._viewportTransform;
  }

  logicalToCss(lx, ly) {
    const vt = this._viewportTransform;
    const wx = vt.portrait ? ly : lx;
    const wy = vt.portrait ? (RINK_SPEC.WIDTH - lx) : ly;
    return {
      x: vt.offsetX + wx * vt.scale,
      y: vt.offsetY + wy * vt.scale
    };
  }

  logicalToClient(lx, ly) {
    if (!this.canvas) return { clientX: 0, clientY: 0 };
    const rect = this.canvas.getBoundingClientRect();
    const pt = this.logicalToCss(lx, ly);
    return {
      clientX: rect.left + pt.x,
      clientY: rect.top + pt.y
    };
  }

  clientToLogical(clientX, clientY) {
    if (!this.canvas) return [500, 250];
    const rect = this.canvas.getBoundingClientRect();
    const cssX = clientX - rect.left;
    const cssY = clientY - rect.top;
    const vt = this._viewportTransform;
    const wx = (cssX - vt.offsetX) / (vt.scale || 1);
    const wy = (cssY - vt.offsetY) / (vt.scale || 1);
    const lx = vt.portrait ? (RINK_SPEC.WIDTH - wy) : wx;
    const ly = vt.portrait ? wx : wy;
    return [
      Math.max(0, Math.min(1000, lx)),
      Math.max(0, Math.min(500, ly))
    ];
  }

  _traceRinkPerimeter(ctx) {
    const w = RINK_SPEC.WIDTH;
    const h = RINK_SPEC.HEIGHT;
    const r = RINK_SPEC.CORNER_RADIUS;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.quadraticCurveTo(w, 0, w, r);
    ctx.lineTo(w, h - r);
    ctx.quadraticCurveTo(w, h, w - r, h);
    ctx.lineTo(r, h);
    ctx.quadraticCurveTo(0, h, 0, h - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
  }

  _applyLogicalWorldTransform(ctx, vt) {
    ctx.setTransform(vt.dpr, 0, 0, vt.dpr, 0, 0);
    ctx.translate(vt.offsetX, vt.offsetY);
    ctx.scale(vt.scale, vt.scale);
    if (vt.portrait) {
      // Rotate logical (x:0..1000, y:0..500) into North-South (wx=ly, wy=1000-lx)
      ctx.transform(0, -1, 1, 0, 0, RINK_SPEC.WIDTH);
    }
  }

  _drawBaseWhiteIceSheet(ctx) {
    // Clip to rounded NHL/IHS rink boards
    ctx.save();
    this._traceRinkPerimeter(ctx);

    // Stark crisp IHS white ice fill with ultra-subtle cool edge depth
    const iceGrad = ctx.createLinearGradient(0, 0, 0, RINK_SPEC.HEIGHT);
    iceGrad.addColorStop(0, '#F8FAFC');
    iceGrad.addColorStop(0.14, '#FFFFFF');
    iceGrad.addColorStop(0.86, '#FFFFFF');
    iceGrad.addColorStop(1, '#F8FAFC');
    ctx.fillStyle = iceGrad;
    ctx.fill();
    ctx.clip();

    // Subtle bench door marker at top center (x=465..535, y=0)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.06)';
    ctx.fillRect(465, 0, 70, 10);

    // Goal Lines (x=89 & x=911)
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(RINK_SPEC.GOAL_LEFT_X, 0);
    ctx.lineTo(RINK_SPEC.GOAL_LEFT_X, RINK_SPEC.HEIGHT);
    ctx.moveTo(RINK_SPEC.GOAL_RIGHT_X, 0);
    ctx.lineTo(RINK_SPEC.GOAL_RIGHT_X, RINK_SPEC.HEIGHT);
    ctx.stroke();

    // Goalie Trapezoids (USA / CAN visible; IIHF 60m×30m omits trapezoid)
    if (this.federationMode !== 'IIHF') {
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Left trapezoid
      ctx.moveTo(RINK_SPEC.GOAL_LEFT_X, 195);
      ctx.lineTo(6, 155);
      ctx.moveTo(RINK_SPEC.GOAL_LEFT_X, 305);
      ctx.lineTo(6, 345);
      // Right trapezoid
      ctx.moveTo(RINK_SPEC.GOAL_RIGHT_X, 195);
      ctx.lineTo(994, 155);
      ctx.moveTo(RINK_SPEC.GOAL_RIGHT_X, 305);
      ctx.lineTo(994, 345);
      ctx.stroke();
    }

    // Blue Lines (x=340 & x=660)
    ctx.fillStyle = '#1D4ED8';
    ctx.fillRect(RINK_SPEC.BLUE_LEFT_X - 4, 0, 8, RINK_SPEC.HEIGHT);
    ctx.fillRect(RINK_SPEC.BLUE_RIGHT_X - 4, 0, 8, RINK_SPEC.HEIGHT);

    // Center Red Line (x=500) with crisp IHS white dashes
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(RINK_SPEC.CENTER_X - 4, 0, 8, RINK_SPEC.HEIGHT);
    ctx.fillStyle = '#FFFFFF';
    for (let y = 18; y < RINK_SPEC.HEIGHT - 12; y += 34) {
      ctx.fillRect(RINK_SPEC.CENTER_X - 2, y, 4, 14);
    }

    // Center Ice Circle & Dot (500, 250)
    ctx.strokeStyle = '#1D4ED8';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(RINK_SPEC.CENTER_X, RINK_SPEC.CENTER_Y, RINK_SPEC.CIRCLE_RADIUS, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#1D4ED8';
    ctx.beginPath();
    ctx.arc(RINK_SPEC.CENTER_X, RINK_SPEC.CENTER_Y, 7, 0, Math.PI * 2);
    ctx.fill();

    // 4 End-Zone Faceoff Circles, Dots, Hash Marks & Inner L-Marks
    ctx.strokeStyle = '#DC2626';
    ctx.fillStyle = '#DC2626';
    ctx.lineWidth = 2.4;
    for (const [dx, dy] of RINK_SPEC.END_DOTS) {
      ctx.beginPath();
      ctx.arc(dx, dy, RINK_SPEC.CIRCLE_RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(dx, dy, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Authentic IHS outer faceoff hash marks
      const hOffX = 16;
      const hInnerY = RINK_SPEC.CIRCLE_RADIUS - 1;
      const hOuterY = RINK_SPEC.CIRCLE_RADIUS + 13;
      ctx.beginPath();
      for (const sx of [-1, 1]) {
        for (const sy of [-1, 1]) {
          ctx.moveTo(dx + sx * hOffX, dy + sy * hInnerY);
          ctx.lineTo(dx + sx * hOffX, dy + sy * hOuterY);
        }
      }
      // Inner faceoff L-lines
      for (const sx of [-1, 1]) {
        for (const sy of [-1, 1]) {
          ctx.moveTo(dx + sx * 10, dy + sy * 16);
          ctx.lineTo(dx + sx * 24, dy + sy * 16);
          ctx.moveTo(dx + sx * 10, dy + sy * 16);
          ctx.lineTo(dx + sx * 10, dy + sy * 6);
        }
      }
      ctx.stroke();
    }

    // 4 Neutral-Zone Faceoff Dots
    for (const [nx, ny] of RINK_SPEC.NEUTRAL_DOTS) {
      ctx.beginPath();
      ctx.arc(nx, ny, 5.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Left & Right Goal Creases + Nets
    this._drawGoalCreaseAndNet(ctx, RINK_SPEC.GOAL_LEFT_X, 250, 1);
    this._drawGoalCreaseAndNet(ctx, RINK_SPEC.GOAL_RIGHT_X, 250, -1);

    ctx.restore();

    // Crisp Dark-Navy Outer Rink Boards Stroke + Yellow Kickplate Trim
    ctx.save();
    this._traceRinkPerimeter(ctx);
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 6.5;
    ctx.stroke();
    this._traceRinkPerimeter(ctx);
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 4.2;
    ctx.stroke();
    ctx.restore();
  }

  _drawGoalCreaseAndNet(ctx, goalX, centerY, dir) {
    // Blue paint crease
    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.30)';
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    if (dir > 0) {
      ctx.arc(goalX, centerY, 30, -Math.PI / 2, Math.PI / 2, false);
    } else {
      ctx.arc(goalX, centerY, 30, Math.PI / 2, -Math.PI / 2, false);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Goal frame + mesh behind goal line
    const netDepth = 22;
    const netHalfH = 22;
    const backX = goalX - dir * netDepth;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.12)';
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(goalX, centerY - netHalfH);
    ctx.lineTo(backX, centerY - netHalfH + 4);
    ctx.lineTo(backX, centerY + netHalfH - 4);
    ctx.lineTo(goalX, centerY + netHalfH);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  _drawHousePolygon(ctx, poly, labelText = 'HOUSE') {
    if (!Array.isArray(poly) || poly.length < 3) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) {
      ctx.lineTo(poly[i][0], poly[i][1]);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.10)';
    ctx.fill();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = 'rgba(5, 150, 105, 0.65)';
    ctx.lineWidth = 2.4;
    ctx.stroke();
    ctx.restore();
    if (labelText) {
      const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length;
      this._drawUprightText(ctx, cx, 250, labelText, {
        font: '900 11px Inter, system-ui, sans-serif',
        color: 'rgba(5, 150, 105, 0.72)'
      });
    }
  }

  _drawPressureCone(ctx, cone) {
    if (!cone || !cone.from || !cone.to) return;
    const [fx, fy] = cone.from;
    const [tx, ty] = cone.to;
    const dx = tx - fx;
    const dy = ty - fy;
    const dist = Math.max(40, Math.hypot(dx, dy));
    const baseAngle = Math.atan2(dy, dx);
    const halfSpread = ((cone.spreadDeg || 28) * Math.PI) / 360;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.arc(fx, fy, dist, baseAngle - halfSpread, baseAngle + halfSpread);
    ctx.closePath();

    const grad = ctx.createRadialGradient(fx, fy, 8, fx, fy, dist);
    grad.addColorStop(0, 'rgba(220, 38, 38, 0.30)');
    grad.addColorStop(1, 'rgba(220, 38, 38, 0.06)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.68)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  _drawThisSpaceHalo(ctx, halo, nowMs = 0) {
    if (!halo) return;
    const pulse = 1 + 0.05 * Math.sin(nowMs * 0.005);
    const rx = (halo.rx || halo.r || 48) * pulse;
    const ry = (halo.ry || halo.r || 38) * pulse;
    const isEmerald = halo.color === 'emerald' || halo.color === 'green';

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(halo.x, halo.y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = isEmerald ? 'rgba(16, 185, 129, 0.18)' : 'rgba(245, 158, 11, 0.18)';
    ctx.fill();
    ctx.setLineDash([9, 6]);
    ctx.lineDashOffset = -(nowMs * 0.025) % 30;
    ctx.strokeStyle = isEmerald ? '#059669' : '#D97706';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    if (halo.label) {
      this._drawUprightText(ctx, halo.x, halo.y + ry + 13, halo.label, {
        font: '900 11px Inter, system-ui, sans-serif',
        color: isEmerald ? '#047857' : '#B45309',
        bgPill: 'rgba(255,255,255,0.92)'
      });
    }
  }

  _drawArrowHead(ctx, fromPt, toPt, color, size = 12) {
    const angle = Math.atan2(toPt[1] - fromPt[1], toPt[0] - fromPt[0]);
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(toPt[0], toPt[1]);
    ctx.lineTo(toPt[0] - size * Math.cos(angle - 0.45), toPt[1] - size * Math.sin(angle - 0.45));
    ctx.lineTo(toPt[0] - size * Math.cos(angle + 0.45), toPt[1] - size * Math.sin(angle + 0.45));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  _drawTStopBar(ctx, fromPt, toPt, color, halfWidth = 12) {
    const angle = Math.atan2(toPt[1] - fromPt[1], toPt[0] - fromPt[0]);
    const nx = -Math.sin(angle);
    const ny = Math.cos(angle);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(toPt[0] - nx * halfWidth, toPt[1] - ny * halfWidth);
    ctx.lineTo(toPt[0] + nx * halfWidth, toPt[1] + ny * halfWidth);
    ctx.stroke();
    ctx.restore();
  }

  _drawWhiteboardPath(ctx, pathSpec, progress = 1) {
    if (!pathSpec || !Array.isArray(pathSpec.points) || pathSpec.points.length < 2) return;
    const pts = slicePolylineUpTo(pathSpec.points, progress);
    if (pts.length < 2) return;

    const color = pathSpec.color || '#0F2942';
    const type = pathSpec.type || 'skate';
    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (type === 'pass') {
      ctx.strokeStyle = color;
      ctx.lineWidth = pathSpec.width || 3.4;
      ctx.setLineDash([10, 7]);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
      ctx.setLineDash([]);
      this._drawArrowHead(ctx, prev, last, color, 12);
    } else if (type === 'carry') {
      // Authentic IHS sinusoidal wavy puck-carry path
      ctx.strokeStyle = color;
      ctx.lineWidth = pathSpec.width || 3.4;
      ctx.beginPath();
      const samples = 44;
      for (let s = 0; s <= samples; s++) {
        const u = s / samples;
        const pCurr = samplePolylineAt(pts, u);
        const pNext = samplePolylineAt(pts, Math.min(1, u + 0.02));
        const ang = Math.atan2(pNext[1] - pCurr[1], pNext[0] - pCurr[0]);
        const nx = -Math.sin(ang);
        const ny = Math.cos(ang);
        const taper = u > 0.88 ? (1 - u) / 0.12 : 1;
        const wave = Math.sin(s * 0.85) * 4.8 * taper;
        const wx = pCurr[0] + nx * wave;
        const wy = pCurr[1] + ny * wave;
        if (s === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.stroke();
      this._drawArrowHead(ctx, prev, last, color, 12);
    } else if (type === 'shot') {
      // Authentic IHS double parallel shot arrow
      const widthOffset = 3.2;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.6;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
          const refA = pts[Math.max(0, i - 1)];
          const refB = pts[Math.min(pts.length - 1, i + 1)];
          const ang = Math.atan2(refB[1] - refA[1], refB[0] - refA[0]);
          const ox = -Math.sin(ang) * widthOffset * side;
          const oy = Math.cos(ang) * widthOffset * side;
          const endTaper = i === pts.length - 1 ? 0.25 : 1;
          const px = pts[i][0] + ox * endTaper;
          const py = pts[i][1] + oy * endTaper;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      this._drawArrowHead(ctx, prev, last, color, 14);
    } else if (type === 't_stop' || type === 'stop') {
      ctx.strokeStyle = color;
      ctx.lineWidth = pathSpec.width || 3.6;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
      this._drawTStopBar(ctx, prev, last, color, 12);
    } else {
      // Default solid IHS skating arrow (or ghost trajectory)
      ctx.strokeStyle = color;
      ctx.lineWidth = pathSpec.width || 3.5;
      if (pathSpec.dashed) ctx.setLineDash([7, 5]);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
      ctx.setLineDash([]);
      if (pathSpec.showArrow !== false) {
        this._drawArrowHead(ctx, prev, last, color, 12);
      }
    }
    ctx.restore();
  }

  _drawSkaterToken(ctx, sk, isYou, nowMs = 0) {
    const [x, y] = sk.pos || sk.start || [500, 250];
    const r = isYou ? 20 : 17.5;
    const isHome = sk.team === 'home';
    const isCulpritHighlight = Boolean(sk.highlightSuspect);
    const isGhost = Boolean(sk.isGhost);

    ctx.save();
    if (isGhost) ctx.globalAlpha = 0.55;

    // 1. Directional IHS Stick Blade extending from skater circle
    const angRad = ((sk.stickAngleDeg ?? (isHome ? 0 : 180)) * Math.PI) / 180;
    const sx0 = x + Math.cos(angRad) * (r - 2);
    const sy0 = y + Math.sin(angRad) * (r - 2);
    const sx1 = x + Math.cos(angRad) * (r + 14);
    const sy1 = y + Math.sin(angRad) * (r + 14);
    const bladeAng = angRad + 1.15;
    const bx = sx1 + Math.cos(bladeAng) * 8;
    const by = sy1 + Math.sin(bladeAng) * 8;

    ctx.strokeStyle = isYou ? '#0D9488' : (isHome ? '#0F2942' : '#991B1B');
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(sx0, sy0);
    ctx.lineTo(sx1, sy1);
    ctx.lineTo(bx, by);
    ctx.stroke();

    // 2. Pulsing bright Teal (#14B8A6) "YOU" Halo
    if (isYou) {
      const pulseR = r + 7 + 3.5 * Math.sin(nowMs * 0.006);
      ctx.beginPath();
      ctx.arc(x, y, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(20, 184, 166, 0.24)';
      ctx.fill();
      ctx.strokeStyle = '#14B8A6';
      ctx.lineWidth = 2.8;
      ctx.stroke();
    } else if (isCulpritHighlight) {
      ctx.beginPath();
      ctx.arc(x, y, r + 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2.6;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. Crisp Token Circle: Teal-rimmed Navy for YOU, solid Navy (#0F2942) for teammates, Crimson (#DC2626) for opponents
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = isYou ? '#0D9488' : (isHome ? '#0F2942' : (sk.ghosted ? '#64748B' : '#DC2626'));
    ctx.fill();
    ctx.strokeStyle = isYou ? '#0F2942' : '#FFFFFF';
    ctx.lineWidth = 2.6;
    ctx.stroke();

    ctx.restore();

    // 4. Upright Role Text inside circle + bold "YOU" badge above
    this._drawUprightText(ctx, x, y, sk.label || sk.id, {
      font: `900 ${isYou ? 13 : 12}px Inter, system-ui, sans-serif`,
      color: '#FFFFFF'
    });

    if (isYou && !isGhost) {
      this._drawUprightBadge(ctx, x, y - r - 13, 'YOU', {
        bg: '#14B8A6',
        border: '#0F2942',
        color: '#042F2E'
      });
    }
    if (sk.chainBadge) {
      this._drawUprightBadge(ctx, x + r + 4, y - r + 2, String(sk.chainBadge), {
        bg: '#F59E0B',
        border: '#0F172A',
        color: '#0F172A'
      });
    }
  }

  _drawPuck(ctx, puckPos) {
    if (!puckPos) return;
    const [px, py] = puckPos;
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, 7.2, 0, Math.PI * 2);
    ctx.fillStyle = '#090D16';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.restore();
  }

  _drawUprightText(ctx, lx, ly, text, opts = {}) {
    const vt = this._viewportTransform;
    ctx.save();
    ctx.setTransform(vt.dpr, 0, 0, vt.dpr, 0, 0);
    const pt = this.logicalToCss(lx, ly);
    ctx.font = opts.font || '900 12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (opts.bgPill) {
      const m = ctx.measureText(text);
      const pw = m.width + 12;
      const ph = 18;
      ctx.fillStyle = opts.bgPill;
      ctx.beginPath();
      ctx.roundRect(pt.x - pw / 2, pt.y - ph / 2, pw, ph, 9);
      ctx.fill();
    }
    ctx.fillStyle = opts.color || '#0F172A';
    ctx.fillText(text, pt.x, pt.y);
    ctx.restore();
    this._applyLogicalWorldTransform(ctx, vt);
  }

  _drawUprightBadge(ctx, lx, ly, text, opts = {}) {
    const vt = this._viewportTransform;
    ctx.save();
    ctx.setTransform(vt.dpr, 0, 0, vt.dpr, 0, 0);
    const pt = this.logicalToCss(lx, ly);
    ctx.font = '900 10px Inter, system-ui, sans-serif';
    const w = Math.max(28, ctx.measureText(text).width + 11);
    const h = 17;
    ctx.fillStyle = opts.bg || '#14B8A6';
    ctx.strokeStyle = opts.border || '#0F172A';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(pt.x - w / 2, pt.y - h / 2, w, h, 8.5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = opts.color || '#042F2E';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, pt.x, pt.y + 0.5);
    ctx.restore();
    this._applyLogicalWorldTransform(ctx, vt);
  }

  _drawIhsCalloutPill(ctx, pill) {
    if (!pill || !pill.text) return;
    const vt = this._viewportTransform;
    ctx.save();
    ctx.setTransform(vt.dpr, 0, 0, vt.dpr, 0, 0);
    const pt = this.logicalToCss(pill.x, pill.y);
    ctx.font = '800 11px Inter, system-ui, sans-serif';
    const text = String(pill.text).slice(0, 44);
    const w = Math.min(vt.cssW - 16, ctx.measureText(text).width + 20);
    const h = 23;
    const cx = Math.max(w / 2 + 6, Math.min(vt.cssW - w / 2 - 6, pt.x));
    const cy = Math.max(h / 2 + 6, Math.min(vt.cssH - h / 2 - 6, pt.y));

    const tone = pill.tone || 'gold';
    const palette = tone === 'danger'
      ? { bg: '#FEF2F2', border: '#DC2626', fg: '#991B1B' }
      : (tone === 'success'
          ? { bg: '#ECFDF5', border: '#059669', fg: '#065F46' }
          : { bg: '#0F172A', border: '#14B8A6', fg: '#F8FAFC' });

    ctx.shadowColor = 'rgba(9, 13, 22, 0.22)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = palette.bg;
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 11.5);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = palette.fg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cx, cy + 0.5);
    ctx.restore();
    this._applyLogicalWorldTransform(ctx, vt);
  }

  _drawAbcTargetLane(ctx, fromPos, opt, nowMs = 0) {
    const [tx, ty] = opt.target;
    const laneColors = {
      A: '#0D9488',
      B: '#2563EB',
      C: '#D97706'
    };
    const col = laneColors[opt.id] || '#0D9488';

    this._drawWhiteboardPath(ctx, {
      type: opt.pathType === 'shot' ? 'shot' : (opt.pathType === 'skate' ? 'skate' : 'pass'),
      points: [fromPos, [tx, ty]],
      color: col
    }, 1);

    const vt = this._viewportTransform;
    ctx.save();
    ctx.setTransform(vt.dpr, 0, 0, vt.dpr, 0, 0);
    const pt = this.logicalToCss(tx, ty);
    const r = 22 + 1.8 * Math.sin(nowMs * 0.006);

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, r + 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(20, 184, 166, 0.16)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = col;
    ctx.lineWidth = 3.2;
    ctx.stroke();

    ctx.fillStyle = col;
    ctx.font = '900 15px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(opt.id, pt.x, pt.y + 0.5);
    ctx.restore();
    this._applyLogicalWorldTransform(ctx, vt);
  }

  _drawFogOverlay(ctx, fog) {
    if (!fog || fog.lifted) return;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(fog.x, fog.y, fog.w, fog.h, 24);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.setLineDash([8, 6]);
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();

    this._drawUprightText(ctx, fog.x + fog.w / 2, fog.y + fog.h / 2, fog.label || 'BLIND-SIDE FOG — TAP SCAN!', {
      font: '900 11px Inter, system-ui, sans-serif',
      color: '#F8FAFC',
      bgPill: 'rgba(15, 23, 42, 0.92)'
    });
  }

  _drawGapZone(ctx, attackerPos, idealDist, tolerance, isInZone) {
    if (!attackerPos) return;
    const [ax, ay] = attackerPos;
    const minR = Math.max(24, idealDist - tolerance);
    const maxR = idealDist + tolerance;
    ctx.save();
    ctx.beginPath();
    ctx.arc(ax, ay, maxR, Math.PI * 0.68, Math.PI * 1.32, false);
    ctx.arc(ax, ay, minR, Math.PI * 1.32, Math.PI * 0.68, true);
    ctx.closePath();
    ctx.fillStyle = isInZone ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.20)';
    ctx.fill();
    ctx.strokeStyle = isInZone ? '#10B981' : '#F59E0B';
    ctx.lineWidth = 2.4;
    ctx.stroke();
    ctx.restore();
  }

  _drawActiveStickSweep(ctx, sweep) {
    if (!sweep || !sweep.origin) return;
    const [ox, oy] = sweep.origin;
    const reach = sweep.reach || 90;
    const angle = sweep.angleRad ?? 0;

    ctx.save();
    // Subtle sweep range ring
    ctx.beginPath();
    ctx.arc(ox, oy, reach, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.28)';
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Active carbon stick shaft + glowing Teal blade
    const tipX = ox + Math.cos(angle) * reach;
    const tipY = oy + Math.sin(angle) * reach;
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    const perp = angle + Math.PI / 2;
    ctx.strokeStyle = '#14B8A6';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(tipX - Math.cos(perp) * 14, tipY - Math.sin(perp) * 14);
    ctx.lineTo(tipX + Math.cos(perp) * 14, tipY + Math.sin(perp) * 14);
    ctx.stroke();
    ctx.restore();
  }

  renderScene(scene = {}) {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    if (scene.camera) this.setCamera(scene.camera);
    const vt = this.syncCanvasResolution();
    const nowMs = scene.nowMs ?? (typeof performance !== 'undefined' ? performance.now() : Date.now());

    // Sleek jet-black surround (#090D16)
    ctx.save();
    ctx.setTransform(vt.dpr, 0, 0, vt.dpr, 0, 0);
    ctx.fillStyle = '#090D16';
    ctx.fillRect(0, 0, vt.cssW, vt.cssH);
    ctx.restore();

    ctx.save();
    this._applyLogicalWorldTransform(ctx, vt);

    // 1. Crisp White Ice + NHL/USA/CAN/IIHF Lines
    this._drawBaseWhiteIceSheet(ctx);

    // 2. Optional Canonical House Polygons
    if (scene.showLeftHouse) this._drawHousePolygon(ctx, RINK_SPEC.LEFT_HOUSE, 'DEFENSIVE HOUSE');
    if (scene.showRightHouse) this._drawHousePolygon(ctx, RINK_SPEC.RIGHT_HOUSE, 'SLOT HOUSE');

    // 3. Defender Pressure Cones
    if (Array.isArray(scene.pressureCones)) {
      for (const cone of scene.pressureCones) this._drawPressureCone(ctx, cone);
    }

    // 4. Gold / Emerald "THIS SPACE" Soft-Ice Halos
    if (scene.thisSpaceHalo) {
      this._drawThisSpaceHalo(ctx, scene.thisSpaceHalo, nowMs);
    }
    if (Array.isArray(scene.extraHalos)) {
      for (const h of scene.extraHalos) this._drawThisSpaceHalo(ctx, h, nowMs);
    }

    // 5. Gap Surfing Ideal Zone
    if (scene.gapZone) {
      this._drawGapZone(
        ctx,
        scene.gapZone.attackerPos,
        scene.gapZone.idealDist,
        scene.gapZone.tolerance,
        scene.gapZone.isInZone
      );
    }

    // 6. Whiteboard Paths (skate, carry, pass, shot, t_stop, user-drawn spline, Stage 5 ghost paths)
    if (Array.isArray(scene.paths)) {
      for (const p of scene.paths) {
        this._drawWhiteboardPath(ctx, p, p.progress ?? 1);
      }
    }

    // 7. Read & React A / B / C Target Lanes
    if (Array.isArray(scene.abcOptions) && scene.abcOrigin) {
      for (const opt of scene.abcOptions) {
        this._drawAbcTargetLane(ctx, scene.abcOrigin, opt, nowMs);
      }
    }

    // 8. Active Stick Sweep (lane_sweeper mode)
    if (scene.activeStickSweep) {
      this._drawActiveStickSweep(ctx, scene.activeStickSweep);
    }

    // 9. Skater Tokens (Teammates, Opponents, Ghost Tokens & Pulsing Teal "YOU")
    const hiddenSet = new Set(scene.hiddenSkaterIds || []);
    if (Array.isArray(scene.skaters)) {
      for (const sk of scene.skaters) {
        if (hiddenSet.has(sk.id)) continue;
        this._drawSkaterToken(ctx, sk, sk.id === scene.youRole && !sk.isGhost, nowMs);
      }
    }

    // 10. Puck
    if (scene.puckPos) {
      this._drawPuck(ctx, scene.puckPos);
    }

    // 11. Blind-Side Fog-of-War Veil (drawn ABOVE hidden defenders until Shoulder-Check lifts it!)
    if (scene.fogOverlay) {
      this._drawFogOverlay(ctx, scene.fogOverlay);
    }

    // 12. 1-Line Rounded IHS Callout Pills on Open Ice Margins
    if (Array.isArray(scene.calloutPills)) {
      for (const pill of scene.calloutPills) {
        this._drawIhsCalloutPill(ctx, pill);
      }
    }

    // 13. Circular Freeze Shot Clock (read_and_react when Untimed is OFF)
    if (scene.shotClock && scene.shotClock.visible) {
      this._drawShotClockRing(ctx, scene.shotClock);
    }

    ctx.restore();
  }

  _drawShotClockRing(ctx, clock) {
    const vt = this._viewportTransform;
    ctx.save();
    ctx.setTransform(vt.dpr, 0, 0, vt.dpr, 0, 0);
    const cx = vt.cssW - 38;
    const cy = 36;
    const r = 24;
    const ratio = Math.max(0, Math.min(1, clock.remainingSec / Math.max(0.1, clock.totalSec)));

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(9, 13, 22, 0.90)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio, false);
    ctx.strokeStyle = ratio > 0.35 ? '#14B8A6' : '#EF4444';
    ctx.lineWidth = 4.5;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 11px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${clock.remainingSec.toFixed(1)}s`, cx, cy + 0.5);
    ctx.restore();
    this._applyLogicalWorldTransform(ctx, vt);
  }
}
