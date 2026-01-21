class K {
  constructor(e, t, i, n) {
    this.g1 = e, this.a1 = t, this.v1 = i, this.a2 = n, this.constrained = !1, this.x0 = 0;
  }
  #e(e) {
    const t = this.a1, i = this.v1, n = this.g1, l = e * e;
    let r = 0;
    return l < ((o) => o * o)(t / (n * n)) ? r = -n * e : l < ((o) => o * o)(t / (2 * n * n) + i * i / (2 * t)) ? r = -Math.sqrt(t * (2 * Math.abs(e) - t / (n * n))) * Math.sign(e) : r = -i * Math.sign(e), r;
  }
  setX0(e) {
    this.x0 = e;
  }
  calcNext(e, t, i) {
    const n = e - this.x0;
    if (this.constrained === !0)
      return {
        x: this.x0 + n + t * i,
        v: this.#e(n + t * i),
        constrained: !0
      };
    if (t < this.#e(n)) {
      const l = t + this.a2 * i, r = n + t * i;
      return l < this.#e(r) ? {
        x: this.x0 + r,
        v: l,
        constrained: !1
      } : (this.constrained = !0, {
        x: this.x0 + r,
        v: this.#e(r),
        constrained: !0
      });
    } else {
      const l = t - this.a2 * i, r = n + t * i;
      return l > this.#e(r) ? {
        x: this.x0 + r,
        v: l,
        constrained: !1
      } : (this.constrained = !0, {
        x: this.x0 + r,
        v: this.#e(r),
        constrained: !0
      });
    }
  }
  reset() {
    this.constrained = !1;
  }
}
function re(s) {
  const e = s.length;
  let t = 0, i = 0;
  for (; i < e; ) {
    let n = s.charCodeAt(i++);
    if ((n & 4294967168) === 0) {
      t++;
      continue;
    } else if ((n & 4294965248) === 0)
      t += 2;
    else {
      if (n >= 55296 && n <= 56319 && i < e) {
        const l = s.charCodeAt(i);
        (l & 64512) === 56320 && (++i, n = ((n & 1023) << 10) + (l & 1023) + 65536);
      }
      (n & 4294901760) === 0 ? t += 3 : t += 4;
    }
  }
  return t;
}
function le(s, e, t) {
  const i = s.length;
  let n = t, l = 0;
  for (; l < i; ) {
    let r = s.charCodeAt(l++);
    if ((r & 4294967168) === 0) {
      e[n++] = r;
      continue;
    } else if ((r & 4294965248) === 0)
      e[n++] = r >> 6 & 31 | 192;
    else {
      if (r >= 55296 && r <= 56319 && l < i) {
        const o = s.charCodeAt(l);
        (o & 64512) === 56320 && (++l, r = ((r & 1023) << 10) + (o & 1023) + 65536);
      }
      (r & 4294901760) === 0 ? (e[n++] = r >> 12 & 15 | 224, e[n++] = r >> 6 & 63 | 128) : (e[n++] = r >> 18 & 7 | 240, e[n++] = r >> 12 & 63 | 128, e[n++] = r >> 6 & 63 | 128);
    }
    e[n++] = r & 63 | 128;
  }
}
const ae = new TextEncoder(), ce = 50;
function fe(s, e, t) {
  ae.encodeInto(s, e.subarray(t));
}
function de(s, e, t) {
  s.length > ce ? fe(s, e, t) : le(s, e, t);
}
new TextDecoder();
class L {
  constructor(e, t) {
    this.type = e, this.data = t;
  }
}
class z extends Error {
  constructor(e) {
    super(e);
    const t = Object.create(z.prototype);
    Object.setPrototypeOf(this, t), Object.defineProperty(this, "name", {
      configurable: !0,
      enumerable: !1,
      value: z.name
    });
  }
}
function ue(s, e, t) {
  const i = t / 4294967296, n = t;
  s.setUint32(e, i), s.setUint32(e + 4, n);
}
function Q(s, e, t) {
  const i = Math.floor(t / 4294967296), n = t;
  s.setUint32(e, i), s.setUint32(e + 4, n);
}
function he(s, e) {
  const t = s.getInt32(e), i = s.getUint32(e + 4);
  return t * 4294967296 + i;
}
const ge = -1, we = 4294967296 - 1, me = 17179869184 - 1;
function pe({ sec: s, nsec: e }) {
  if (s >= 0 && e >= 0 && s <= me)
    if (e === 0 && s <= we) {
      const t = new Uint8Array(4);
      return new DataView(t.buffer).setUint32(0, s), t;
    } else {
      const t = s / 4294967296, i = s & 4294967295, n = new Uint8Array(8), l = new DataView(n.buffer);
      return l.setUint32(0, e << 2 | t & 3), l.setUint32(4, i), n;
    }
  else {
    const t = new Uint8Array(12), i = new DataView(t.buffer);
    return i.setUint32(0, e), Q(i, 4, s), t;
  }
}
function xe(s) {
  const e = s.getTime(), t = Math.floor(e / 1e3), i = (e - t * 1e3) * 1e6, n = Math.floor(i / 1e9);
  return {
    sec: t + n,
    nsec: i - n * 1e9
  };
}
function ye(s) {
  if (s instanceof Date) {
    const e = xe(s);
    return pe(e);
  } else
    return null;
}
function Ue(s) {
  const e = new DataView(s.buffer, s.byteOffset, s.byteLength);
  switch (s.byteLength) {
    case 4:
      return { sec: e.getUint32(0), nsec: 0 };
    case 8: {
      const t = e.getUint32(0), i = e.getUint32(4), n = (t & 3) * 4294967296 + i, l = t >>> 2;
      return { sec: n, nsec: l };
    }
    case 12: {
      const t = he(e, 4), i = e.getUint32(0);
      return { sec: t, nsec: i };
    }
    default:
      throw new z(`Unrecognized data size for timestamp (expected 4, 8, or 12): ${s.length}`);
  }
}
function ve(s) {
  const e = Ue(s);
  return new Date(e.sec * 1e3 + e.nsec / 1e6);
}
const Se = {
  type: ge,
  encode: ye,
  decode: ve
};
class $ {
  constructor() {
    this.builtInEncoders = [], this.builtInDecoders = [], this.encoders = [], this.decoders = [], this.register(Se);
  }
  register({ type: e, encode: t, decode: i }) {
    if (e >= 0)
      this.encoders[e] = t, this.decoders[e] = i;
    else {
      const n = -1 - e;
      this.builtInEncoders[n] = t, this.builtInDecoders[n] = i;
    }
  }
  tryToEncode(e, t) {
    for (let i = 0; i < this.builtInEncoders.length; i++) {
      const n = this.builtInEncoders[i];
      if (n != null) {
        const l = n(e, t);
        if (l != null) {
          const r = -1 - i;
          return new L(r, l);
        }
      }
    }
    for (let i = 0; i < this.encoders.length; i++) {
      const n = this.encoders[i];
      if (n != null) {
        const l = n(e, t);
        if (l != null) {
          const r = i;
          return new L(r, l);
        }
      }
    }
    return e instanceof L ? e : null;
  }
  decode(e, t, i) {
    const n = t < 0 ? this.builtInDecoders[-1 - t] : this.decoders[t];
    return n ? n(e, t, i) : new L(t, e);
  }
}
$.defaultCodec = new $();
function Ee(s) {
  return s instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && s instanceof SharedArrayBuffer;
}
function be(s) {
  return s instanceof Uint8Array ? s : ArrayBuffer.isView(s) ? new Uint8Array(s.buffer, s.byteOffset, s.byteLength) : Ee(s) ? new Uint8Array(s) : Uint8Array.from(s);
}
const Te = 100, Ie = 2048;
class H {
  constructor(e) {
    this.entered = !1, this.extensionCodec = e?.extensionCodec ?? $.defaultCodec, this.context = e?.context, this.useBigInt64 = e?.useBigInt64 ?? !1, this.maxDepth = e?.maxDepth ?? Te, this.initialBufferSize = e?.initialBufferSize ?? Ie, this.sortKeys = e?.sortKeys ?? !1, this.forceFloat32 = e?.forceFloat32 ?? !1, this.ignoreUndefined = e?.ignoreUndefined ?? !1, this.forceIntegerToFloat = e?.forceIntegerToFloat ?? !1, this.pos = 0, this.view = new DataView(new ArrayBuffer(this.initialBufferSize)), this.bytes = new Uint8Array(this.view.buffer);
  }
  clone() {
    return new H({
      extensionCodec: this.extensionCodec,
      context: this.context,
      useBigInt64: this.useBigInt64,
      maxDepth: this.maxDepth,
      initialBufferSize: this.initialBufferSize,
      sortKeys: this.sortKeys,
      forceFloat32: this.forceFloat32,
      ignoreUndefined: this.ignoreUndefined,
      forceIntegerToFloat: this.forceIntegerToFloat
    });
  }
  reinitializeState() {
    this.pos = 0;
  }
  /**
   * This is almost equivalent to {@link Encoder#encode}, but it returns an reference of the encoder's internal buffer and thus much faster than {@link Encoder#encode}.
   *
   * @returns Encodes the object and returns a shared reference the encoder's internal buffer.
   */
  encodeSharedRef(e) {
    if (this.entered)
      return this.clone().encodeSharedRef(e);
    try {
      return this.entered = !0, this.reinitializeState(), this.doEncode(e, 1), this.bytes.subarray(0, this.pos);
    } finally {
      this.entered = !1;
    }
  }
  /**
   * @returns Encodes the object and returns a copy of the encoder's internal buffer.
   */
  encode(e) {
    if (this.entered)
      return this.clone().encode(e);
    try {
      return this.entered = !0, this.reinitializeState(), this.doEncode(e, 1), this.bytes.slice(0, this.pos);
    } finally {
      this.entered = !1;
    }
  }
  doEncode(e, t) {
    if (t > this.maxDepth)
      throw new Error(`Too deep objects in depth ${t}`);
    e == null ? this.encodeNil() : typeof e == "boolean" ? this.encodeBoolean(e) : typeof e == "number" ? this.forceIntegerToFloat ? this.encodeNumberAsFloat(e) : this.encodeNumber(e) : typeof e == "string" ? this.encodeString(e) : this.useBigInt64 && typeof e == "bigint" ? this.encodeBigInt64(e) : this.encodeObject(e, t);
  }
  ensureBufferSizeToWrite(e) {
    const t = this.pos + e;
    this.view.byteLength < t && this.resizeBuffer(t * 2);
  }
  resizeBuffer(e) {
    const t = new ArrayBuffer(e), i = new Uint8Array(t), n = new DataView(t);
    i.set(this.bytes), this.view = n, this.bytes = i;
  }
  encodeNil() {
    this.writeU8(192);
  }
  encodeBoolean(e) {
    e === !1 ? this.writeU8(194) : this.writeU8(195);
  }
  encodeNumber(e) {
    !this.forceIntegerToFloat && Number.isSafeInteger(e) ? e >= 0 ? e < 128 ? this.writeU8(e) : e < 256 ? (this.writeU8(204), this.writeU8(e)) : e < 65536 ? (this.writeU8(205), this.writeU16(e)) : e < 4294967296 ? (this.writeU8(206), this.writeU32(e)) : this.useBigInt64 ? this.encodeNumberAsFloat(e) : (this.writeU8(207), this.writeU64(e)) : e >= -32 ? this.writeU8(224 | e + 32) : e >= -128 ? (this.writeU8(208), this.writeI8(e)) : e >= -32768 ? (this.writeU8(209), this.writeI16(e)) : e >= -2147483648 ? (this.writeU8(210), this.writeI32(e)) : this.useBigInt64 ? this.encodeNumberAsFloat(e) : (this.writeU8(211), this.writeI64(e)) : this.encodeNumberAsFloat(e);
  }
  encodeNumberAsFloat(e) {
    this.forceFloat32 ? (this.writeU8(202), this.writeF32(e)) : (this.writeU8(203), this.writeF64(e));
  }
  encodeBigInt64(e) {
    e >= BigInt(0) ? (this.writeU8(207), this.writeBigUint64(e)) : (this.writeU8(211), this.writeBigInt64(e));
  }
  writeStringHeader(e) {
    if (e < 32)
      this.writeU8(160 + e);
    else if (e < 256)
      this.writeU8(217), this.writeU8(e);
    else if (e < 65536)
      this.writeU8(218), this.writeU16(e);
    else if (e < 4294967296)
      this.writeU8(219), this.writeU32(e);
    else
      throw new Error(`Too long string: ${e} bytes in UTF-8`);
  }
  encodeString(e) {
    const i = re(e);
    this.ensureBufferSizeToWrite(5 + i), this.writeStringHeader(i), de(e, this.bytes, this.pos), this.pos += i;
  }
  encodeObject(e, t) {
    const i = this.extensionCodec.tryToEncode(e, this.context);
    if (i != null)
      this.encodeExtension(i);
    else if (Array.isArray(e))
      this.encodeArray(e, t);
    else if (ArrayBuffer.isView(e))
      this.encodeBinary(e);
    else if (typeof e == "object")
      this.encodeMap(e, t);
    else
      throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(e)}`);
  }
  encodeBinary(e) {
    const t = e.byteLength;
    if (t < 256)
      this.writeU8(196), this.writeU8(t);
    else if (t < 65536)
      this.writeU8(197), this.writeU16(t);
    else if (t < 4294967296)
      this.writeU8(198), this.writeU32(t);
    else
      throw new Error(`Too large binary: ${t}`);
    const i = be(e);
    this.writeU8a(i);
  }
  encodeArray(e, t) {
    const i = e.length;
    if (i < 16)
      this.writeU8(144 + i);
    else if (i < 65536)
      this.writeU8(220), this.writeU16(i);
    else if (i < 4294967296)
      this.writeU8(221), this.writeU32(i);
    else
      throw new Error(`Too large array: ${i}`);
    for (const n of e)
      this.doEncode(n, t + 1);
  }
  countWithoutUndefined(e, t) {
    let i = 0;
    for (const n of t)
      e[n] !== void 0 && i++;
    return i;
  }
  encodeMap(e, t) {
    const i = Object.keys(e);
    this.sortKeys && i.sort();
    const n = this.ignoreUndefined ? this.countWithoutUndefined(e, i) : i.length;
    if (n < 16)
      this.writeU8(128 + n);
    else if (n < 65536)
      this.writeU8(222), this.writeU16(n);
    else if (n < 4294967296)
      this.writeU8(223), this.writeU32(n);
    else
      throw new Error(`Too large map object: ${n}`);
    for (const l of i) {
      const r = e[l];
      this.ignoreUndefined && r === void 0 || (this.encodeString(l), this.doEncode(r, t + 1));
    }
  }
  encodeExtension(e) {
    if (typeof e.data == "function") {
      const i = e.data(this.pos + 6), n = i.length;
      if (n >= 4294967296)
        throw new Error(`Too large extension object: ${n}`);
      this.writeU8(201), this.writeU32(n), this.writeI8(e.type), this.writeU8a(i);
      return;
    }
    const t = e.data.length;
    if (t === 1)
      this.writeU8(212);
    else if (t === 2)
      this.writeU8(213);
    else if (t === 4)
      this.writeU8(214);
    else if (t === 8)
      this.writeU8(215);
    else if (t === 16)
      this.writeU8(216);
    else if (t < 256)
      this.writeU8(199), this.writeU8(t);
    else if (t < 65536)
      this.writeU8(200), this.writeU16(t);
    else if (t < 4294967296)
      this.writeU8(201), this.writeU32(t);
    else
      throw new Error(`Too large extension object: ${t}`);
    this.writeI8(e.type), this.writeU8a(e.data);
  }
  writeU8(e) {
    this.ensureBufferSizeToWrite(1), this.view.setUint8(this.pos, e), this.pos++;
  }
  writeU8a(e) {
    const t = e.length;
    this.ensureBufferSizeToWrite(t), this.bytes.set(e, this.pos), this.pos += t;
  }
  writeI8(e) {
    this.ensureBufferSizeToWrite(1), this.view.setInt8(this.pos, e), this.pos++;
  }
  writeU16(e) {
    this.ensureBufferSizeToWrite(2), this.view.setUint16(this.pos, e), this.pos += 2;
  }
  writeI16(e) {
    this.ensureBufferSizeToWrite(2), this.view.setInt16(this.pos, e), this.pos += 2;
  }
  writeU32(e) {
    this.ensureBufferSizeToWrite(4), this.view.setUint32(this.pos, e), this.pos += 4;
  }
  writeI32(e) {
    this.ensureBufferSizeToWrite(4), this.view.setInt32(this.pos, e), this.pos += 4;
  }
  writeF32(e) {
    this.ensureBufferSizeToWrite(4), this.view.setFloat32(this.pos, e), this.pos += 4;
  }
  writeF64(e) {
    this.ensureBufferSizeToWrite(8), this.view.setFloat64(this.pos, e), this.pos += 8;
  }
  writeU64(e) {
    this.ensureBufferSizeToWrite(8), ue(this.view, this.pos, e), this.pos += 8;
  }
  writeI64(e) {
    this.ensureBufferSizeToWrite(8), Q(this.view, this.pos, e), this.pos += 8;
  }
  writeBigUint64(e) {
    this.ensureBufferSizeToWrite(8), this.view.setBigUint64(this.pos, e), this.pos += 8;
  }
  writeBigInt64(e) {
    this.ensureBufferSizeToWrite(8), this.view.setBigInt64(this.pos, e), this.pos += 8;
  }
}
function Z(s, e) {
  return new H(e).encodeSharedRef(s);
}
const g = Object.freeze({
  initializing: 1,
  waitingRobotType: 2,
  generatorMaking: 3,
  generatorReady: 4,
  slrmReady: 5
}), U = Object.freeze({
  dormant: 1,
  converged: 2,
  moving: 3,
  rewinding: 4
});
let w = g.initializing, x = U.dormant;
console.debug("Now intended to import ModuleFactory");
const F = await import("/wasm/slrm_module.js"), ke = await import("/wasm/cd_module.js");
console.log("ModuleFactory: ", F);
console.debug("ModuleFactory.default type:", typeof F.default);
if (typeof F.default != "function")
  throw console.error("ModuleFactory.default is not a function:", F.default), new Error("ModuleFactory.default is not a valid function");
const u = await F.default();
if (!u)
  throw console.error("Failed to load SlrmModule"), new Error("SlrmModule could not be loaded");
const T = await ke.default();
if (!T)
  throw console.error("Failed to load CdModule"), new Error("CdModule could not be loaded");
const G = {
  [u.CmdVelGeneratorStatus.OK.value]: "OK",
  [u.CmdVelGeneratorStatus.ERROR.value]: "ERROR",
  [u.CmdVelGeneratorStatus.END.value]: "END",
  [u.CmdVelGeneratorStatus.SINGULARITY.value]: "SINGULARITY",
  [u.CmdVelGeneratorStatus.REWIND.value]: "REWIND"
}, ee = 4, X = 0n / BigInt(ee);
let M = null, O = 0n, W = null, _ = null, f = null, I = null, b = null, k = null;
const N = [], P = [];
let h = null, v = null, B = null, te = null, A = !1;
function _e(s) {
  function e(t) {
    const i = new s.DoubleVector();
    for (let n = 0; n < t.length; ++n)
      i.push_back(t[n]);
    return i;
  }
  return {
    makeDoubleVector: e
    // ... more helpers
  };
}
function Ae(s) {
  function e(i) {
    const n = new s.DoubleVector();
    for (let l = 0; l < i.length; ++l)
      n.push_back(i[l]);
    return n;
  }
  function t(i) {
    const n = new s.ConvexShape();
    for (let l = 0; l < i.length; ++l) {
      const r = i[l];
      n.push_back({ x: r[0], y: r[1], z: r[2] });
    }
    return n;
  }
  return {
    makeCdDoubleVector: e,
    makeConvexShape: t
  };
}
let ie = !1, p = null, J = null, j = [], R = null;
function q(s) {
  R = s, p = new WebSocket(R), p.onopen = () => {
    for (console.log("WebSocket connected"); j.length > 0; )
      p.send(j.shift());
  }, p.onclose = (e) => {
    console.log("webSocket closed, will retry...", e.code, e.reason), Me();
  }, p.onerror = (e) => {
    console.error("WebSocket error", e), p.close();
  };
}
function Me() {
  J || (J = setTimeout(() => {
    J = null, R && (console.log("Reconnecting..."), q(R));
  }, 3e3));
}
function Y(s, e) {
  function t(r, o) {
    const a = new r.DoubleVector();
    for (let c = 0; c < o.length; ++c)
      a.push_back(o[c]);
    return a;
  }
  function i(r, o) {
    const a = new r.JointModelFlatStructVector();
    for (let c = 0; c < o.length; ++c)
      a.push_back(o[c]);
    return a;
  }
  const n = e.map((r) => {
    const o = r.origin.$.xyz ?? [0, 0, 0], a = t(
      s,
      Array.isArray(o) && o.length === 3 ? o : [0, 0, 0]
    ), c = r.origin.$.rpy ?? [0, 0, 0], S = t(
      s,
      Array.isArray(c) && c.length === 3 ? c : [0, 0, 0]
    ), V = r.axis.$.xyz ?? [0, 0, 1], C = t(
      s,
      Array.isArray(V) && V.length === 3 ? V : [0, 0, 1]
    ), d = new s.JointModelFlatStruct(C, a, S);
    return C.delete(), a.delete(), S.delete(), d;
  });
  return { jointModelVector: i(s, n), jointModelsArray: n };
}
function Re(s) {
  const e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  s.forEach((r) => {
    const o = r.parent.$.link, a = r.child.$.link;
    e.has(o) || e.set(o, []), e.get(o).push(r), t.set(a, (t.get(a) || 0) + 1), t.has(o) || t.set(o, 0), i.set(a, r);
  });
  const n = [];
  for (const [r, o] of t.entries())
    o === 0 && n.push(r);
  const l = [];
  for (; n.length > 0; ) {
    const r = n.shift(), o = e.get(r) || [];
    for (const a of o) {
      const c = a.child.$.link;
      l.push(a), t.set(c, t.get(c) - 1), t.get(c) === 0 && n.push(c);
    }
  }
  return l.length !== s.length && console.warn("Cycle detected or disconnected components in URDF joints"), l;
}
function ne(s, e) {
  for (const t in e) {
    if (!(t in s)) {
      console.debug("key in update.json:", t, " ignored");
      continue;
    }
    const i = e[t], n = s[t];
    i !== null && typeof i == "object" && !Array.isArray(i) && n !== null && typeof n == "object" && !Array.isArray(n) ? ne(n, i) : (console.warn("key:", t, "val:", s[t], "is replaced by", i), s[t] = i);
  }
  return s;
}
console.debug("now setting onmessage");
self.onmessage = function(s) {
  const e = s.data;
  switch (e.type) {
    case "shutdown":
      p && (p.close(), p = null), u && u.delete(), self.postMessage({ type: "shutdown_complete" }), ie = !0;
      break;
    case "set_slrm_loglevel":
      e?.logLevel && 0 <= e.logLevel && e.logLevel <= 4 && u.setJsLogLevel(e.logLevel);
      break;
    case "set_cd_loglevel":
      e?.logLevel && 0 <= e.logLevel && e.logLevel <= 4 && T.setJsLogLevel(e.logLevel);
      break;
    case "init":
      if (w === g.waitingRobotType) {
        w = g.generatorMaking, console.log("constructing CmdVelGenerator with :", e.filename), console.log("URDF modifier file is", e.modifier);
        const { makeDoubleVector: t } = _e(u), { makeCdDoubleVector: i, makeConvexShape: n } = Ae(T);
        B = t, te = i, u.setJsLogLevel(2), fetch(e.filename).then((l) => l.json()).then((l) => {
          let r = !1, o = null;
          Array.isArray(l) ? (o = { ...l }, r = !0) : o = l, fetch(e.modifier).then((a) => a.json()).then((a) => {
            ne(o, a), o = Object.values(o), r || (o = Re(o));
            const c = o.filter((d) => d.$.type === "revolute"), {
              jointModelVector: S,
              jointModelsArray: V
            } = Y(u, c);
            if (console.debug("type of SlrmModule.CmdVelGen: " + typeof u.CmdVelGenerator), h = new u.CmdVelGenerator(S), V.forEach((d) => d.delete()), S.delete(), h == null) {
              console.error("generation of CmdVelGen instance failed"), h = null;
              return;
            }
            h != null && console.log("CmdVelGen instance created:", h), c.forEach((d) => {
              N.push(d.limit.$.upper), P.push(d.limit.$.lower);
            }), console.log("jointLimits: ", N, P), console.log("Status Definitions: OK:" + u.CmdVelGeneratorStatus.OK.value + ", ERROR:" + u.CmdVelGeneratorStatus.ERROR.value + ", END:" + u.CmdVelGeneratorStatus.END.value), h.setExactSolution(A), h.setLinearVelocityLimit(10), h.setAngularVelocityLimit(2 * Math.PI), h.setAngularGain(20), h.setLinearGain(20);
            const C = t(Array(c.length).fill(Math.PI * 2));
            if (h.setJointVelocityLimit(C), C.delete(), e.linkShapes) {
              T.setJsLogLevel(2);
              const {
                jointModelVector: d,
                jointModelsArray: y
              } = Y(T, c), m = i([0, 0, 0]), E = i([1, 0, 0, 0]);
              v = new T.CollisionDetection(
                d,
                m,
                E
              ), d.delete(), y.forEach((D) => D.delete()), m.delete(), E.delete();
            }
            v && fetch(e.linkShapes).then((d) => d.json()).then((d) => {
              if (d.length !== c.length + 2) {
                d.length !== 0 && console.error(
                  "干渉形状定義の数",
                  d.length,
                  "がジョイントの数(+2 effector必須)",
                  c.length + 2,
                  "と一致しません。"
                );
                return;
              }
              console.log("linkShapes.length: ", d.length);
              for (let y = 0; y < d.length; ++y) {
                const m = new T.ConvexShapeVector();
                for (const E of d[y]) {
                  const D = n(E);
                  m.push_back(D), D.delete();
                }
                v.addLinkShape(y, m), m.delete();
              }
              if (console.log("setting up of link shapes is finished"), v.infoLinkShapes(), e.testPairs)
                console.log("recieve test pairs from", e.testPairs), fetch(e.testPairs).then((y) => y.json()).then((y) => {
                  v.clearTestPairs();
                  for (const m of y)
                    v.addTestPair(m[0], m[1]);
                });
              else {
                const y = [];
                for (let m = 0; m < d.length - 4; m++)
                  for (let E = m + 2; E < d.length; E++)
                    y.push([m, E]);
                console.log("using default test pairs: ", y), v.clearTestPairs();
                for (const m of y)
                  v.addTestPair(m[0], m[1]);
              }
            }).catch((d) => {
              console.error("Error fetching or parsing SHAPE file:", d);
            }), e.bridgeUrl && (console.log("recieve bridge URL: ", e.bridgeUrl), q(e.bridgeUrl)), w = g.generatorReady, self.postMessage({ type: "generator_ready" });
          }).catch((a) => {
            console.warn("Error fetching or parsing URDF modifier file:", a), console.warn("modifier file name:", e.modifier);
          });
        }).catch((l) => {
          console.error("Error fetching or parsing URDF.JSON file:", l);
        });
      }
      break;
    case "set_initial_joints":
      (w === g.generatorReady || w === g.slrmReady) && e.joints && (f = new Float64Array(e.joints.length), f.set(e.joints), W = f.slice(), I = f.slice(), b = new Float64Array(f.length), console.log("Setting initial joints:" + f.map((t) => (t * 57.2958).toFixed(1)).join(", ")), (!_ || f.length !== _.length) && (_ = Array(f.length).fill(null).map((t, i) => i <= 1 ? new K(5, 1, 0.2, 0.02) : new K(5, 1, 1, 0.0625))), _.forEach((t, i) => {
        t.reset(), t.setX0(W[i]);
      }), w = g.slrmReady, M = [], x = U.moving, console.log("Worker state changed to slrmReady"));
      break;
    case "destination":
      w === g.slrmReady && e.endLinkPose && (M = [...e.endLinkPose], x = U.moving);
      break;
    case "slow_rewind":
      w === g.slrmReady && f && W && _ && (e.slowRewind == !0 ? x = U.rewinding : x = U.converged);
      break;
    case "set_end_effector_point":
      if (e.endEffectorPoint && B && e.endEffectorPoint.length === 3 && typeof e.endEffectorPoint[0] == "number" && typeof e.endEffectorPoint[1] == "number" && typeof e.endEffectorPoint[2] == "number") {
        console.debug("Setting end effector point: ", e.endEffectorPoint);
        const t = B(e.endEffectorPoint);
        h.setEndEffectorPosition(t), t.delete();
        const i = x;
        x = U.moving, M = [], se(0), x = i;
      }
      break;
    case "set_exact_solution":
      (w === g.generatorReady || w === g.slrmReady) && e.exactSolution !== void 0 && (e.exactSolution === !0 ? A = !0 : A = !1, h.setExactSolution(A), console.log("Exact solution for singularity set to: ", A));
      break;
    case "set_joint_weights":
      (w === g.generatorReady || w === g.slrmReady) && e.jointNumber !== void 0 && e.jointWeight !== void 0 && h.setJointWeight(e.jointNumber, e.jointWeight) !== !0 && console.error(
        "set_joint_weights: failed to set weight for joint number ",
        e.jointNumber
      );
      break;
    case "clear_joint_desirable":
      (w === g.generatorReady || w === g.slrmReady) && e.jointNumber !== void 0 && h.setJointDesirable(e.jointNumber, !1) !== !0 && console.error(
        "clear_joint_desirable: failed to clear desirable for joint number ",
        e.jointNumber
      );
      break;
    case "set_joint_desirable":
      console.log("in worker, set_joint_desirable called:", e), (w === g.generatorReady || w === g.slrmReady) && e.jointNumber !== void 0 && e.lower !== void 0 && e.upper !== void 0 && e.gain !== void 0 && (console.log(
        "in worker, set_joint_desirable: jointNumber=",
        e.jointNumber,
        " lower=",
        e.lower,
        " upper=",
        e.upper,
        " gain=",
        e.gain
      ), h.setJointDesirable(
        e.jointNumber,
        !0,
        e.lower,
        e.upper,
        e.gain
      ) !== !0 && console.error(
        "set_joint_desirable: failed to set desirable for joint number ",
        e.jointNumber
      ));
      break;
  }
};
function se(s) {
  let e = null, t = null, i = null, n = null;
  if (!(!h || !f)) {
    if (w === g.slrmReady && (x === U.moving || x === U.rewinding)) {
      if (x === U.rewinding) {
        const a = _.map((c, S) => c.calcNext(f[S], b[S], s));
        for (let c = 0; c < f.length; c++)
          f[c] = a[c].x, b[c] = a[c].v;
        if (p) {
          const c = {
            topic: "actuator1",
            javascriptStamp: Date.now(),
            header: {},
            position: [...f],
            velocity: [...b],
            normalized: []
          }, S = Z(c);
          p.readyState === WebSocket.OPEN ? p.send(S) : R && (console.log("Not connected, queueing message"), j.push(c), (!p || p.readyState === WebSocket.CLOSED) && q(R));
        }
        M = [];
      } else x === U.converged && b.fill(0);
      if (M === null)
        return;
      const l = B(f), r = B(M), o = h.calcVelocityPQ(l, r);
      if (l.delete(), r.delete(), x !== U.rewinding)
        for (let a = 0; a < b.length; a++)
          b[a] = o.joint_velocities.get(a);
      if (o.joint_velocities.delete(), e = o.status, t = o.other, (!i || !n) && (i = new Float64Array(3), n = new Float64Array(4)), i[0] = o.position.get(0), i[1] = o.position.get(1), i[2] = o.position.get(2), n[0] = o.quaternion.get(0), n[1] = o.quaternion.get(1), n[2] = o.quaternion.get(2), n[3] = o.quaternion.get(3), o.position.delete(), o.quaternion.delete(), x === U.rewinding && o.status.value !== u.CmdVelGeneratorStatus.END.value && o.status.value !== u.CmdVelGeneratorStatus.OK.value && console.warn("CmdVelGenerator returned status other than END or OK during rewinding:", G[o.status.value]), x === U.moving)
        switch (o.status.value) {
          case u.CmdVelGeneratorStatus.OK.value:
            I.set(f);
            for (let a = 0; a < f.length; a++)
              f[a] = f[a] + b[a] * s;
            if (v) {
              const a = te(f);
              v.calcFk(a), a.delete(), v.testCollisionPairs().size() !== 0 && f.set(I);
            }
            break;
          case u.CmdVelGeneratorStatus.END.value:
            x = U.converged;
            break;
          case u.CmdVelGeneratorStatus.SINGULARITY.value:
            console.error("CmdVelGenerator returned SINGULARITY status");
            break;
          case u.CmdVelGeneratorStatus.REWIND.value:
            f.set(I);
            break;
          case u.CmdVelGeneratorStatus.ERROR.value:
            console.error("CmdVelGenerator returned ERROR status");
            break;
          default:
            console.error("Unknown status from CmdVelGenerator:", o.status.value);
            break;
        }
    }
    if (e !== null && t !== null) {
      let l = Array(f.length).fill(0), r = !1;
      for (let o = 0; o < f.length; o++)
        f[o] > N[o] && (l[o] = 1, I[o] = N[o] - 1e-3, r = !0), f[o] < P[o] && (l[o] = -1, I[o] = P[o] + 1e-3, r = !0);
      r && f.set(I), self.postMessage({ type: "joints", joints: [...f] }), self.postMessage({
        type: "status",
        status: G[e.value],
        exact_solution: A,
        condition_number: t.condition_number,
        manipulability: t.manipulability,
        sensitivity_scale: t.sensitivity_scale,
        limit_flag: l
      }), self.postMessage({
        type: "pose",
        position: i,
        quaternion: n
      }), O++, X !== 0n && O % X === 0n && (k !== null && f !== null && k.length === f.length && Math.max(...k.map((o, a) => Math.abs(o - f[a]))) > 5e-3 && console.log(
        "counter:",
        O,
        "status: ",
        G[e.value],
        " condition:",
        t.condition_number.toFixed(2),
        " m:",
        t.manipulability.toFixed(3),
        " k:",
        t.sensitivity_scale.toFixed(3) + `
limit flags: ` + l.join(", ")
      ), k || (k = f.slice()), k.set(f));
    }
  }
}
function oe(s = performance.now() - ee) {
  const e = performance.now(), t = e - s;
  if (se(t / 1e3), ie === !0) {
    self.postMessage({ type: "shutdown_complete" }), console.log("main loop was finished"), self.close();
    return;
  }
  if (p) {
    const n = performance.now() - e, l = Math.floor(n / 1e3), r = Math.floor((n - l * 1e3) * 1e6), o = {
      topic: "timeRef",
      javascriptStamp: Date.now(),
      header: { frame_id: "none" },
      time_ref: {
        sec: l,
        nanosec: r
      },
      source: "slrm_and_cd"
    }, a = Z(o);
    p.readyState === WebSocket.OPEN && p.send(a);
  }
  setTimeout(() => oe(e), 0);
}
w = g.waitingRobotType;
self.postMessage({ type: "ready" });
oe();
