/**
 * SYNAPZ HOCKEY v15.3 — iPadOS 15.8.8 / Safari 15 (iPad Air 2) Universal Compatibility Engine
 * (`engine/safari15_polyfill.js`)
 *
 * Loaded synchronously as the VERY FIRST <script> in <head> of `index.html`.
 * Polyfills WebKit / Safari 16+ Canvas 2D & ES2022-ES2023 APIs on Safari 15.x:
 *  1. `CanvasRenderingContext2D.prototype.roundRect(x, y, w, h, radii)` (+ Path2D / OffscreenCanvas)
 *  2. `Object.hasOwn`
 *  3. `structuredClone`
 *  4. `String.prototype.replaceAll`
 *  5. `Array.prototype.at` & `String.prototype.at` (& TypedArray.prototype.at)
 *  6. `Array.prototype.findLast` & `Array.prototype.findLastIndex`
 *  7. `Array.prototype.toSorted`, `Array.prototype.toReversed`, `Array.prototype.toSpliced`
 */
(function installSynapzSafari15Polyfills(globalScope) {
  'use strict';

  var g = globalScope || (typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : self));
  var installedList = [];

  function parseSingleRadius(rVal) {
    if (typeof rVal === 'number') {
      if (!isFinite(rVal)) return null;
      var clampedNum = rVal < 0 ? 0 : rVal;
      return { x: clampedNum, y: clampedNum };
    }
    if (rVal && typeof rVal === 'object') {
      var rx = 'x' in rVal ? Number(rVal.x) : 0;
      var ry = 'y' in rVal ? Number(rVal.y) : rx;
      if (!isFinite(rx) || !isFinite(ry)) return null;
      return { x: rx < 0 ? 0 : rx, y: ry < 0 ? 0 : ry };
    }
    var coerced = Number(rVal || 0);
    if (!isFinite(coerced)) return null;
    var c = coerced < 0 ? 0 : coerced;
    return { x: c, y: c };
  }

  function expandCornerRadii(radiiArg) {
    if (radiiArg === undefined) {
      var z = { x: 0, y: 0 };
      return [z, z, z, z];
    }
    var rawList;
    if (Array.isArray(radiiArg)) {
      if (radiiArg.length === 0) {
        var z0 = { x: 0, y: 0 };
        return [z0, z0, z0, z0];
      }
      rawList = radiiArg.slice(0, 4);
    } else {
      rawList = [radiiArg];
    }

    var parsed = [];
    for (var i = 0; i < rawList.length; i++) {
      var pr = parseSingleRadius(rawList[i]);
      if (!pr) return null;
      parsed.push(pr);
    }

    if (parsed.length === 1) {
      return [
        { x: parsed[0].x, y: parsed[0].y },
        { x: parsed[0].x, y: parsed[0].y },
        { x: parsed[0].x, y: parsed[0].y },
        { x: parsed[0].x, y: parsed[0].y }
      ];
    }
    if (parsed.length === 2) {
      return [
        { x: parsed[0].x, y: parsed[0].y },
        { x: parsed[1].x, y: parsed[1].y },
        { x: parsed[0].x, y: parsed[0].y },
        { x: parsed[1].x, y: parsed[1].y }
      ];
    }
    if (parsed.length === 3) {
      return [
        { x: parsed[0].x, y: parsed[0].y },
        { x: parsed[1].x, y: parsed[1].y },
        { x: parsed[2].x, y: parsed[2].y },
        { x: parsed[1].x, y: parsed[1].y }
      ];
    }
    return parsed;
  }

  /**
   * Spec-compliant rounded-rectangle subpath builder using `moveTo`, `lineTo`, and `arcTo`
   * (with `quadraticCurveTo` fallback only for asymmetric `{x, y}` elliptical corners).
   * Handles negative `w` / `h`, 0/1/2/3/4-element `radii`, `{x, y}` objects, and `r === 0` safely.
   */
  function traceRoundRectPath(ctx, x, y, w, h, radii) {
    if (arguments.length < 5) {
      throw new TypeError("Failed to execute 'roundRect': 4 arguments required.");
    }
    var nx = Number(x);
    var ny = Number(y);
    var nw = Number(w);
    var nh = Number(h);
    if (!isFinite(nx) || !isFinite(ny) || !isFinite(nw) || !isFinite(nh)) {
      return ctx;
    }

    // Normalize negative width / height so left <= right and top <= bottom
    var left = nw >= 0 ? nx : nx + nw;
    var right = nw >= 0 ? nx + nw : nx;
    var top = nh >= 0 ? ny : ny + nh;
    var bottom = nh >= 0 ? ny + nh : ny;
    var absW = Math.abs(nw);
    var absH = Math.abs(nh);

    var corners = expandCornerRadii(radii);
    if (!corners) return ctx;

    if (absW === 0 || absH === 0) {
      ctx.moveTo(left, top);
      ctx.lineTo(right, bottom);
      ctx.closePath();
      return ctx;
    }

    // Clamp each corner radius to Math.min(absW, absH) / 2 and proportional CSS corner sum scale
    var maxHalf = Math.min(absW, absH) / 2;
    var tl = corners[0];
    var tr = corners[1];
    var br = corners[2];
    var bl = corners[3];

    // If original w < 0, swap horizontal corners; if original h < 0, swap vertical corners
    if (nw < 0) {
      var tmpTop = tl; tl = tr; tr = tmpTop;
      var tmpBot = bl; bl = br; br = tmpBot;
    }
    if (nh < 0) {
      var tmpLeft = tl; tl = bl; bl = tmpLeft;
      var tmpRight = tr; tr = br; br = tmpRight;
    }

    var scale = 1;
    var topSum = tl.x + tr.x;
    var botSum = bl.x + br.x;
    var leftSum = tl.y + bl.y;
    var rightSum = tr.y + br.y;
    if (topSum > absW && topSum > 0) scale = Math.min(scale, absW / topSum);
    if (botSum > absW && botSum > 0) scale = Math.min(scale, absW / botSum);
    if (leftSum > absH && leftSum > 0) scale = Math.min(scale, absH / leftSum);
    if (rightSum > absH && rightSum > 0) scale = Math.min(scale, absH / rightSum);

    var clampCorner = function (c) {
      var rx = Math.max(0, Math.min(absW / 2, c.x * scale));
      var ry = Math.max(0, Math.min(absH / 2, c.y * scale));
      if (Math.abs(rx - ry) < 1e-6) {
        var rSym = Math.min(maxHalf, rx);
        return { x: rSym, y: rSym, sym: true };
      }
      return { x: rx, y: ry, sym: false };
    };

    var cTL = clampCorner(tl);
    var cTR = clampCorner(tr);
    var cBR = clampCorner(br);
    var cBL = clampCorner(bl);

    // Start at top-left edge after TL corner, trace clockwise around the rectangle
    ctx.moveTo(left + cTL.x, top);

    // Top edge -> Top-Right corner
    ctx.lineTo(right - cTR.x, top);
    if (cTR.x > 0 && cTR.y > 0) {
      if (cTR.sym && typeof ctx.arcTo === 'function') {
        ctx.arcTo(right, top, right, top + cTR.y, cTR.x);
      } else {
        ctx.quadraticCurveTo(right, top, right, top + cTR.y);
      }
    } else {
      ctx.lineTo(right, top);
    }

    // Right edge -> Bottom-Right corner
    ctx.lineTo(right, bottom - cBR.y);
    if (cBR.x > 0 && cBR.y > 0) {
      if (cBR.sym && typeof ctx.arcTo === 'function') {
        ctx.arcTo(right, bottom, right - cBR.x, bottom, cBR.x);
      } else {
        ctx.quadraticCurveTo(right, bottom, right - cBR.x, bottom);
      }
    } else {
      ctx.lineTo(right, bottom);
    }

    // Bottom edge -> Bottom-Left corner
    ctx.lineTo(left + cBL.x, bottom);
    if (cBL.x > 0 && cBL.y > 0) {
      if (cBL.sym && typeof ctx.arcTo === 'function') {
        ctx.arcTo(left, bottom, left, bottom - cBL.y, cBL.x);
      } else {
        ctx.quadraticCurveTo(left, bottom, left, bottom - cBL.y);
      }
    } else {
      ctx.lineTo(left, bottom);
    }

    // Left edge -> Top-Left corner
    ctx.lineTo(left, top + cTL.y);
    if (cTL.x > 0 && cTL.y > 0) {
      if (cTL.sym && typeof ctx.arcTo === 'function') {
        ctx.arcTo(left, top, left + cTL.x, top, cTL.x);
      } else {
        ctx.quadraticCurveTo(left, top, left + cTL.x, top);
      }
    } else {
      ctx.lineTo(left, top);
    }

    ctx.closePath();
    return ctx;
  }

  function installRoundRectOnProto(Proto, label) {
    if (!Proto || typeof Proto.roundRect === 'function') return;
    Object.defineProperty(Proto, 'roundRect', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function roundRect(x, y, w, h, radii) {
        if (arguments.length < 4) {
          throw new TypeError("Failed to execute 'roundRect': 4 arguments required, but only " + arguments.length + ' present.');
        }
        traceRoundRectPath(this, x, y, w, h, radii);
      }
    });
    installedList.push(label);
  }

  if (typeof g.CanvasRenderingContext2D !== 'undefined' && g.CanvasRenderingContext2D.prototype) {
    installRoundRectOnProto(g.CanvasRenderingContext2D.prototype, 'CanvasRenderingContext2D.roundRect');
  }
  if (typeof g.OffscreenCanvasRenderingContext2D !== 'undefined' && g.OffscreenCanvasRenderingContext2D.prototype) {
    installRoundRectOnProto(g.OffscreenCanvasRenderingContext2D.prototype, 'OffscreenCanvasRenderingContext2D.roundRect');
  }
  if (typeof g.Path2D !== 'undefined' && g.Path2D.prototype) {
    installRoundRectOnProto(g.Path2D.prototype, 'Path2D.roundRect');
  }

  // 2. Object.hasOwn (Safari 15.4)
  if (typeof Object.hasOwn !== 'function') {
    var hasOwnProp = Object.prototype.hasOwnProperty;
    Object.defineProperty(Object, 'hasOwn', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function hasOwn(obj, prop) {
        if (obj === null || obj === undefined) {
          throw new TypeError('Cannot convert undefined or null to object');
        }
        return hasOwnProp.call(Object(obj), prop);
      }
    });
    installedList.push('Object.hasOwn');
  }

  // 3. structuredClone (Safari 15.4)
  if (typeof g.structuredClone !== 'function') {
    var deepStructuredClone = function structuredClone(value) {
      var seen = typeof WeakMap === 'function' ? new WeakMap() : null;
      function cloneInner(val) {
        if (val === null || typeof val !== 'object') return val;
        if (seen && seen.has(val)) return seen.get(val);
        if (val instanceof Date) return new Date(val.getTime());
        if (val instanceof RegExp) return new RegExp(val.source, val.flags);
        if (typeof ArrayBuffer !== 'undefined' && val instanceof ArrayBuffer) {
          return val.slice(0);
        }
        if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView && ArrayBuffer.isView(val)) {
          return new val.constructor(val.buffer.slice(val.byteOffset, val.byteOffset + val.byteLength));
        }
        if (typeof Map === 'function' && val instanceof Map) {
          var m = new Map();
          if (seen) seen.set(val, m);
          val.forEach(function (v, k) {
            m.set(cloneInner(k), cloneInner(v));
          });
          return m;
        }
        if (typeof Set === 'function' && val instanceof Set) {
          var s = new Set();
          if (seen) seen.set(val, s);
          val.forEach(function (v) {
            s.add(cloneInner(v));
          });
          return s;
        }
        if (Array.isArray(val)) {
          var arr = new Array(val.length);
          if (seen) seen.set(val, arr);
          for (var i = 0; i < val.length; i++) {
            if (i in val) arr[i] = cloneInner(val[i]);
          }
          return arr;
        }
        var out = {};
        if (seen) seen.set(val, out);
        var keys = Object.keys(val);
        for (var ki = 0; ki < keys.length; ki++) {
          var key = keys[ki];
          out[key] = cloneInner(val[key]);
        }
        return out;
      }
      return cloneInner(value);
    };
    Object.defineProperty(g, 'structuredClone', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: deepStructuredClone
    });
    installedList.push('structuredClone');
  }

  // 4. String.prototype.replaceAll (Safari 13.1+, guarded for safety)
  if (typeof String.prototype.replaceAll !== 'function') {
    Object.defineProperty(String.prototype, 'replaceAll', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function replaceAll(search, replacement) {
        if (this === null || this === undefined) {
          throw new TypeError('String.prototype.replaceAll called on null or undefined');
        }
        var target = String(this);
        if (search instanceof RegExp) {
          if (search.flags.indexOf('g') === -1) {
            throw new TypeError('String.prototype.replaceAll called with a non-global RegExp argument');
          }
          return target.replace(search, replacement);
        }
        var needle = String(search);
        if (needle === '') {
          var repStr = typeof replacement === 'function' ? String(replacement('', 0, target)) : String(replacement);
          return repStr + target.split('').join(repStr) + repStr;
        }
        if (typeof replacement === 'function') {
          var out = '';
          var fromIdx = 0;
          var matchIdx = target.indexOf(needle, fromIdx);
          while (matchIdx !== -1) {
            out += target.slice(fromIdx, matchIdx) + String(replacement(needle, matchIdx, target));
            fromIdx = matchIdx + needle.length;
            matchIdx = target.indexOf(needle, fromIdx);
          }
          return out + target.slice(fromIdx);
        }
        return target.split(needle).join(String(replacement));
      }
    });
    installedList.push('String.prototype.replaceAll');
  }

  // 5. Array.prototype.at & String.prototype.at (Safari 15.4)
  if (typeof Array.prototype.at !== 'function') {
    Object.defineProperty(Array.prototype, 'at', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function at(n) {
        var obj = Object(this);
        var len = obj.length >>> 0;
        var rel = Math.trunc ? Math.trunc(Number(n) || 0) : parseInt(n, 10) || 0;
        var k = rel >= 0 ? rel : len + rel;
        if (k < 0 || k >= len) return undefined;
        return obj[k];
      }
    });
    installedList.push('Array.prototype.at');
  }

  if (typeof String.prototype.at !== 'function') {
    Object.defineProperty(String.prototype, 'at', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function at(n) {
        var s = String(this);
        var len = s.length;
        var rel = Math.trunc ? Math.trunc(Number(n) || 0) : parseInt(n, 10) || 0;
        var k = rel >= 0 ? rel : len + rel;
        if (k < 0 || k >= len) return undefined;
        return s.charAt(k);
      }
    });
    installedList.push('String.prototype.at');
  }

  // 6. Array.prototype.findLast & Array.prototype.findLastIndex (Safari 15.4)
  if (typeof Array.prototype.findLast !== 'function') {
    Object.defineProperty(Array.prototype, 'findLast', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function findLast(predicate, thisArg) {
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var obj = Object(this);
        var len = obj.length >>> 0;
        for (var i = len - 1; i >= 0; i--) {
          var val = obj[i];
          if (predicate.call(thisArg, val, i, obj)) return val;
        }
        return undefined;
      }
    });
    installedList.push('Array.prototype.findLast');
  }

  if (typeof Array.prototype.findLastIndex !== 'function') {
    Object.defineProperty(Array.prototype, 'findLastIndex', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function findLastIndex(predicate, thisArg) {
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var obj = Object(this);
        var len = obj.length >>> 0;
        for (var i = len - 1; i >= 0; i--) {
          if (predicate.call(thisArg, obj[i], i, obj)) return i;
        }
        return -1;
      }
    });
    installedList.push('Array.prototype.findLastIndex');
  }

  // 7. Change-Array-by-Copy: toSorted, toReversed, toSpliced (Safari 16.0)
  if (typeof Array.prototype.toSorted !== 'function') {
    Object.defineProperty(Array.prototype, 'toSorted', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function toSorted(compareFn) {
        if (compareFn !== undefined && typeof compareFn !== 'function') {
          throw new TypeError('Comparison argument must be a function or undefined');
        }
        var copy = Array.prototype.slice.call(Object(this));
        return compareFn ? copy.sort(compareFn) : copy.sort();
      }
    });
    installedList.push('Array.prototype.toSorted');
  }

  if (typeof Array.prototype.toReversed !== 'function') {
    Object.defineProperty(Array.prototype, 'toReversed', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function toReversed() {
        return Array.prototype.slice.call(Object(this)).reverse();
      }
    });
    installedList.push('Array.prototype.toReversed');
  }

  if (typeof Array.prototype.toSpliced !== 'function') {
    Object.defineProperty(Array.prototype, 'toSpliced', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function toSpliced(start, deleteCount) {
        var copy = Array.prototype.slice.call(Object(this));
        var args = Array.prototype.slice.call(arguments);
        if (args.length > 0) {
          Array.prototype.splice.apply(copy, args);
        }
        return copy;
      }
    });
    installedList.push('Array.prototype.toSpliced');
  }

  g.__SYNAPZ_SAFARI15_POLYFILL__ = {
    version: '15.3.0',
    installed: installedList,
    traceRoundRectPath: traceRoundRectPath
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
