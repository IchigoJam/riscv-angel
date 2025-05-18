export class Long {
  constructor(a, b) {
    this.low_ = a | 0;
    this.high_ = b | 0
  }
  getHighBits() {
    return this.high_
  }
  getLowBits() {
    return this.low_
  }
  getLowBitsUnsigned() {
    return 0 <= this.low_ ? this.low_ : Long.TWO_PWR_32_DBL_ + this.low_
  }
  isZero() {
    return 0 == this.high_ && 0 == this.low_
  }
  isNegative() {
    return 0 > this.high_
  }
  isOdd() {
    return 1 == (this.low_ & 1)
  }
  equals(a) {
    return this.high_ == a.high_ && this.low_ == a.low_
  }
  notEquals(a) {
    return this.high_ != a.high_ || this.low_ != a.low_
  }
  lessThan(a) {
    return 0 > this.compare(a)
  }
  lessThanOrEqual(a) {
    return 0 >= this.compare(a)
  }
  greaterThan(a) {
    return 0 < this.compare(a)
  }
  greaterThanOrEqual(a) {
    return 0 <= this.compare(a)
  }
  compare(a) {
    if (this.equals(a)) return 0;
    var b = this.isNegative(),
      c = a.isNegative();
    return b && !c ? -1 : !b && c ? 1 : this.subtract(a).isNegative() ? -1 : 1
  }
  negate() {
    return this.equals(Long.MIN_VALUE) ? Long.MIN_VALUE : this.not().add(Long.ONE)
  }
  add(a) {
    var b = this.high_ >>> 16,
        c = this.high_ & 65535,
        d = this.low_ >>> 16,
        e = a.high_ >>> 16,
        f = a.high_ & 65535,
        g = a.low_ >>> 16,
        k;
    k = 0 + ((this.low_ & 65535) + (a.low_ & 65535));
    a = 0 + (k >>> 16);
    a += d + g;
    d = 0 + (a >>> 16);
    d += c + f;
    c = 0 + (d >>> 16);
    c = c + (b + e) & 65535;
    return new Long((a & 65535) << 16 | k & 65535, c << 16 | d & 65535);
  }
  subtract(a) {
    return this.add(a.negate())
  }
  multiply(a) {
    if (this.isZero() || a.isZero()) return Long.ZERO;
    if (this.equals(Long.MIN_VALUE)) return a.isOdd() ? Long.MIN_VALUE : Long.ZERO;
    if (a.equals(Long.MIN_VALUE)) return this.isOdd() ? Long.MIN_VALUE : Long.ZERO;
    if (this.isNegative()) return a.isNegative() ? this.negate().multiply(a.negate()) : this.negate().multiply(a).negate();
    if (a.isNegative()) return this.multiply(a.negate()).negate();
    if (this.lessThan(Long.TWO_PWR_24_) &&
      a.lessThan(Long.TWO_PWR_24_)) return Long.fromNumber(this.toNumber() * a.toNumber());
    var b = this.high_ >>> 16,
      c = this.high_ & 65535,
      d = this.low_ >>> 16,
      e = this.low_ & 65535,
      f = a.high_ >>> 16,
      g = a.high_ & 65535,
      k = a.low_ >>> 16;
    a = a.low_ & 65535;
    var m, h, l, n;
    n = 0 + e * a;
    l = 0 + (n >>> 16);
    l += d * a;
    h = 0 + (l >>> 16);
    l = (l & 65535) + e * k;
    h += l >>> 16;
    l &= 65535;
    h += c * a;
    m = 0 + (h >>> 16);
    h = (h & 65535) + d * k;
    m += h >>> 16;
    h &= 65535;
    h += e * g;
    m += h >>> 16;
    h &= 65535;
    m = m + (b * a + c * k + d * g + e * f) & 65535;
    return Long.fromBits(l << 16 | n & 65535, m << 16 | h)
  }
  div(a) {
    if (a.isZero()) throw Error("division by zero");
    if (this.isZero()) return Long.ZERO;
    if (this.equals(Long.MIN_VALUE)) {
      if (a.equals(Long.ONE) || a.equals(Long.NEG_ONE)) return Long.MIN_VALUE;
      if (a.equals(Long.MIN_VALUE)) return Long.ONE;
      var b = this.shiftRight(1).div(a).shiftLeft(1);
      if (b.equals(Long.ZERO)) return a.isNegative() ? Long.ONE : Long.NEG_ONE;
      var c = this.subtract(a.multiply(b));
      return b.add(c.div(a))
    }
    if (a.equals(Long.MIN_VALUE)) return Long.ZERO;
    if (this.isNegative()) return a.isNegative() ? this.negate().div(a.negate()) : this.negate().div(a).negate();
    if (a.isNegative()) return this.div(a.negate()).negate();
    for (var d = Long.ZERO, c = this; c.greaterThanOrEqual(a);) {
      for (var b = Math.max(1, Math.floor(c.toNumber() / a.toNumber())), e = Math.ceil(Math.log(b) / Math.LN2), e = 48 >= e ? 1 : Math.pow(2, e - 48), f = Long.fromNumber(b), g = f.multiply(a); g.isNegative() || g.greaterThan(c);) b -=
        e, f = Long.fromNumber(b), g = f.multiply(a);
      f.isZero() && (f = Long.ONE);
      d = d.add(f);
      c = c.subtract(g)
    }
    return d
  }
  modulo(a) {
    return this.subtract(this.div(a).multiply(a));
  }
  not() {
    return new Long(~this.low_, ~this.high_);
  }
  and(a) {
    return new Long(this.low_ & a.low_, this.high_ & a.high_);
  }
  or(a) {
    return new Long(this.low_ | a.low_, this.high_ | a.high_);
  }
  xor(a) {
    return new Long(this.low_ ^ a.low_, this.high_ ^ a.high_);
  }
  shiftLeft(a) {
    a &= 63;
    if (0 == a) return this;
    var b = this.low_;
    return 32 > a ? Long.fromBits(b << a, this.high_ << a | b >>> 32 - a) : Long.fromBits(0, b << a - 32)
  }
  shiftRight(a) {
    a &= 63;
    if (0 == a) return this;
    var b = this.high_;
    return 32 > a ? Long.fromBits(this.low_ >>> a | b << 32 - a, b >> a) : Long.fromBits(b >> a - 32, 0 <= b ? 0 : -1)
  }
  shiftRightUnsigned(a) {
    a &= 63;
    if (0 == a) return this;
    var b = this.high_;
    return 32 > a ? Long.fromBits(this.low_ >>> a | b << 32 - a, b >>> a) : 32 == a ? Long.fromBits(b, 0) : Long.fromBits(b >>> a - 32, 0)
  }
  toInt() {
    return this.low_
  }
  toNumber() {
      return this.high_ * Long.TWO_PWR_32_DBL_ + this.getLowBitsUnsigned()
  }
  toString(a) {
      a = a || 10;
      if (2 > a || 36 < a) throw Error("radix out of range: " + a);
      if (this.isZero()) return "0";
      if (this.isNegative()) {
          if (this.equals(Long.MIN_VALUE)) {
              var b = Long.fromNumber(a),
                  c = this.div(b),
                  b = c.multiply(b).subtract(this);
              return c.toString(a) + b.toInt().toString(a)
          }
          return "-" + this.negate().toString(a)
      }
      for (var c = Long.fromNumber(Math.pow(a, 6)), b = this, d = "";;) {
          var e = b.div(c),
              f = b.subtract(e.multiply(c)).toInt().toString(a),
              b = e;
          if (b.isZero()) return f +
              d;
          for (; 6 > f.length;) f = "0" + f;
          d = "" + f + d
      }
  }

  static fromInt(a) {
      if (-128 <= a && 128 > a) {
          var b = Long.IntCache_[a];
          if (b) return b
      }
      b = new Long(a | 0, 0 > a ? -1 : 0); - 128 <= a && 128 > a && (Long.IntCache_[a] = b);
      return b
  }
  static fromBits(a, b) {
    return new Long(a, b)
  }

  static fromNumber(a) {
    return isNaN(a) || !isFinite(a) ? Long.ZERO : a <= -Long.TWO_PWR_63_DBL_ ? Long.MIN_VALUE : a + 1 >= Long.TWO_PWR_63_DBL_ ? Long.MAX_VALUE : 0 > a ? Long.fromNumber(-a).negate() : new Long(a % Long.TWO_PWR_32_DBL_ | 0, a / Long.TWO_PWR_32_DBL_ | 0)
  }
  static fromNumber2(a) {
    return new Long(a|0, a >> 31);
  }
  static fromString(a, b) {
    if (0 == a.length) throw Error("number format error: empty string");
    var c = b || 10;
    if (2 > c || 36 < c) throw Error("radix out of range: " + c);
    if ("-" == a.charAt(0)) return Long.fromString(a.substring(1), c).negate();
    if (0 <= a.indexOf("-")) throw Error('number format error: interior "-" character: ' + a);
    for (var d = Long.fromNumber(Math.pow(c, 8)), e = Long.ZERO, f = 0; f < a.length; f += 8) {
        var g = Math.min(8, a.length - f),
            k = parseInt(a.substring(f, f + g), c);
        8 > g ? (g = Long.fromNumber(Math.pow(c,
            g)), e = e.multiply(g).add(Long.fromNumber(k))) : (e = e.multiply(d), e = e.add(Long.fromNumber(k)))
    }
    return e
  }
}

Long.IntCache_ = {}

Long.TWO_PWR_16_DBL_ = 65536;
Long.TWO_PWR_24_DBL_ = 16777216;
Long.TWO_PWR_32_DBL_ = Long.TWO_PWR_16_DBL_ * Long.TWO_PWR_16_DBL_;
Long.TWO_PWR_31_DBL_ = Long.TWO_PWR_32_DBL_ / 2;
Long.TWO_PWR_48_DBL_ = Long.TWO_PWR_32_DBL_ * Long.TWO_PWR_16_DBL_;
Long.TWO_PWR_64_DBL_ = Long.TWO_PWR_32_DBL_ * Long.TWO_PWR_32_DBL_;
Long.TWO_PWR_63_DBL_ = Long.TWO_PWR_64_DBL_ / 2;
Long.ZERO = Long.fromInt(0);
Long.ONE = Long.fromInt(1);
Long.NEG_ONE = Long.fromInt(-1);
Long.MAX_VALUE = Long.fromBits(-1, 2147483647);
Long.MIN_VALUE = Long.fromBits(0, -2147483648);
Long.TWO_PWR_24_ = Long.fromInt(16777216);
