var CryptoJS = CryptoJS || function (s, p) {
    var m = {}, l = m.lib = {}, n = function () {
        }, r = l.Base = {
            extend: function (b) {
                n.prototype = this;
                var h = new n;
                b && h.mixIn(b);
                h.hasOwnProperty("init") || (h.init = function () {
                    h.$super.init.apply(this, arguments)
                });
                h.init.prototype = h;
                h.$super = this;
                return h
            }, create: function () {
                var b = this.extend();
                b.init.apply(b, arguments);
                return b
            }, init: function () {
            }, mixIn: function (b) {
                for (var h in b) b.hasOwnProperty(h) && (this[h] = b[h]);
                b.hasOwnProperty("toString") && (this.toString = b.toString)
            }, clone: function () {
                return this.init.prototype.extend(this)
            }
        },
        q = l.WordArray = r.extend({
            init: function (b, h) {
                b = this.words = b || [];
                this.sigBytes = h != p ? h : 4 * b.length
            }, toString: function (b) {
                return (b || t).stringify(this)
            }, concat: function (b) {
                var h = this.words, a = b.words, j = this.sigBytes;
                b = b.sigBytes;
                this.clamp();
                if (j % 4) for (var g = 0; g < b; g++) h[j + g >>> 2] |= (a[g >>> 2] >>> 24 - 8 * (g % 4) & 255) << 24 - 8 * ((j + g) % 4); else if (65535 < a.length) for (g = 0; g < b; g += 4) h[j + g >>> 2] = a[g >>> 2]; else h.push.apply(h, a);
                this.sigBytes += b;
                return this
            }, clamp: function () {
                var b = this.words, h = this.sigBytes;
                b[h >>> 2] &= 4294967295 <<
                    32 - 8 * (h % 4);
                b.length = s.ceil(h / 4)
            }, clone: function () {
                var b = r.clone.call(this);
                b.words = this.words.slice(0);
                return b
            }, random: function (b) {
                for (var h = [], a = 0; a < b; a += 4) h.push(4294967296 * s.random() | 0);
                return new q.init(h, b)
            }
        }), v = m.enc = {}, t = v.Hex = {
            stringify: function (b) {
                var a = b.words;
                b = b.sigBytes;
                for (var g = [], j = 0; j < b; j++) {
                    var k = a[j >>> 2] >>> 24 - 8 * (j % 4) & 255;
                    g.push((k >>> 4).toString(16));
                    g.push((k & 15).toString(16))
                }
                return g.join("")
            }, parse: function (b) {
                for (var a = b.length, g = [], j = 0; j < a; j += 2) g[j >>> 3] |= parseInt(b.substr(j,
                    2), 16) << 24 - 4 * (j % 8);
                return new q.init(g, a / 2)
            }
        }, a = v.Latin1 = {
            stringify: function (b) {
                var a = b.words;
                b = b.sigBytes;
                for (var g = [], j = 0; j < b; j++) g.push(String.fromCharCode(a[j >>> 2] >>> 24 - 8 * (j % 4) & 255));
                return g.join("")
            }, parse: function (b) {
                for (var a = b.length, g = [], j = 0; j < a; j++) g[j >>> 2] |= (b.charCodeAt(j) & 255) << 24 - 8 * (j % 4);
                return new q.init(g, a)
            }
        }, u = v.Utf8 = {
            stringify: function (b) {
                try {
                    return decodeURIComponent(escape(a.stringify(b)))
                } catch (g) {
                    throw Error("Malformed UTF-8 data");
                }
            }, parse: function (b) {
                return a.parse(unescape(encodeURIComponent(b)))
            }
        },
        g = l.BufferedBlockAlgorithm = r.extend({
            reset: function () {
                this._data = new q.init;
                this._nDataBytes = 0
            }, _append: function (b) {
                "string" == typeof b && (b = u.parse(b));
                this._data.concat(b);
                this._nDataBytes += b.sigBytes
            }, _process: function (b) {
                var a = this._data, g = a.words, j = a.sigBytes, k = this.blockSize, m = j / (4 * k),
                    m = b ? s.ceil(m) : s.max((m | 0) - this._minBufferSize, 0);
                b = m * k;
                j = s.min(4 * b, j);
                if (b) {
                    for (var l = 0; l < b; l += k) this._doProcessBlock(g, l);
                    l = g.splice(0, b);
                    a.sigBytes -= j
                }
                return new q.init(l, j)
            }, clone: function () {
                var b = r.clone.call(this);
                b._data = this._data.clone();
                return b
            }, _minBufferSize: 0
        });
    l.Hasher = g.extend({
        cfg: r.extend(), init: function (b) {
            this.cfg = this.cfg.extend(b);
            this.reset()
        }, reset: function () {
            g.reset.call(this);
            this._doReset()
        }, update: function (b) {
            this._append(b);
            this._process();
            return this
        }, finalize: function (b) {
            b && this._append(b);
            return this._doFinalize()
        }, blockSize: 16, _createHelper: function (b) {
            return function (a, g) {
                return (new b.init(g)).finalize(a)
            }
        }, _createHmacHelper: function (b) {
            return function (a, g) {
                return (new k.HMAC.init(b,
                    g)).finalize(a)
            }
        }
    });
    var k = m.algo = {};
    return m
}(Math);
(function (s) {
    function p(a, k, b, h, l, j, m) {
        a = a + (k & b | ~k & h) + l + m;
        return (a << j | a >>> 32 - j) + k
    }

    function m(a, k, b, h, l, j, m) {
        a = a + (k & h | b & ~h) + l + m;
        return (a << j | a >>> 32 - j) + k
    }

    function l(a, k, b, h, l, j, m) {
        a = a + (k ^ b ^ h) + l + m;
        return (a << j | a >>> 32 - j) + k
    }

    function n(a, k, b, h, l, j, m) {
        a = a + (b ^ (k | ~h)) + l + m;
        return (a << j | a >>> 32 - j) + k
    }

    for (var r = CryptoJS, q = r.lib, v = q.WordArray, t = q.Hasher, q = r.algo, a = [], u = 0; 64 > u; u++) a[u] = 4294967296 * s.abs(s.sin(u + 1)) | 0;
    q = q.MD5 = t.extend({
        _doReset: function () {
            this._hash = new v.init([1732584193, 4023233417, 2562383102, 271733878])
        },
        _doProcessBlock: function (g, k) {
            for (var b = 0; 16 > b; b++) {
                var h = k + b, w = g[h];
                g[h] = (w << 8 | w >>> 24) & 16711935 | (w << 24 | w >>> 8) & 4278255360
            }
            var b = this._hash.words, h = g[k + 0], w = g[k + 1], j = g[k + 2], q = g[k + 3], r = g[k + 4],
                s = g[k + 5], t = g[k + 6], u = g[k + 7], v = g[k + 8], x = g[k + 9], y = g[k + 10], z = g[k + 11],
                A = g[k + 12], B = g[k + 13], C = g[k + 14], D = g[k + 15], c = b[0], d = b[1], e = b[2], f = b[3],
                c = p(c, d, e, f, h, 7, a[0]), f = p(f, c, d, e, w, 12, a[1]), e = p(e, f, c, d, j, 17, a[2]),
                d = p(d, e, f, c, q, 22, a[3]), c = p(c, d, e, f, r, 7, a[4]), f = p(f, c, d, e, s, 12, a[5]),
                e = p(e, f, c, d, t, 17, a[6]), d = p(d, e, f, c, u, 22, a[7]),
                c = p(c, d, e, f, v, 7, a[8]), f = p(f, c, d, e, x, 12, a[9]), e = p(e, f, c, d, y, 17, a[10]),
                d = p(d, e, f, c, z, 22, a[11]), c = p(c, d, e, f, A, 7, a[12]), f = p(f, c, d, e, B, 12, a[13]),
                e = p(e, f, c, d, C, 17, a[14]), d = p(d, e, f, c, D, 22, a[15]), c = m(c, d, e, f, w, 5, a[16]),
                f = m(f, c, d, e, t, 9, a[17]), e = m(e, f, c, d, z, 14, a[18]), d = m(d, e, f, c, h, 20, a[19]),
                c = m(c, d, e, f, s, 5, a[20]), f = m(f, c, d, e, y, 9, a[21]), e = m(e, f, c, d, D, 14, a[22]),
                d = m(d, e, f, c, r, 20, a[23]), c = m(c, d, e, f, x, 5, a[24]), f = m(f, c, d, e, C, 9, a[25]),
                e = m(e, f, c, d, q, 14, a[26]), d = m(d, e, f, c, v, 20, a[27]), c = m(c, d, e, f, B, 5, a[28]),
                f = m(f, c,
                    d, e, j, 9, a[29]), e = m(e, f, c, d, u, 14, a[30]), d = m(d, e, f, c, A, 20, a[31]),
                c = l(c, d, e, f, s, 4, a[32]), f = l(f, c, d, e, v, 11, a[33]), e = l(e, f, c, d, z, 16, a[34]),
                d = l(d, e, f, c, C, 23, a[35]), c = l(c, d, e, f, w, 4, a[36]), f = l(f, c, d, e, r, 11, a[37]),
                e = l(e, f, c, d, u, 16, a[38]), d = l(d, e, f, c, y, 23, a[39]), c = l(c, d, e, f, B, 4, a[40]),
                f = l(f, c, d, e, h, 11, a[41]), e = l(e, f, c, d, q, 16, a[42]), d = l(d, e, f, c, t, 23, a[43]),
                c = l(c, d, e, f, x, 4, a[44]), f = l(f, c, d, e, A, 11, a[45]), e = l(e, f, c, d, D, 16, a[46]),
                d = l(d, e, f, c, j, 23, a[47]), c = n(c, d, e, f, h, 6, a[48]), f = n(f, c, d, e, u, 10, a[49]),
                e = n(e, f, c, d,
                    C, 15, a[50]), d = n(d, e, f, c, s, 21, a[51]), c = n(c, d, e, f, A, 6, a[52]),
                f = n(f, c, d, e, q, 10, a[53]), e = n(e, f, c, d, y, 15, a[54]), d = n(d, e, f, c, w, 21, a[55]),
                c = n(c, d, e, f, v, 6, a[56]), f = n(f, c, d, e, D, 10, a[57]), e = n(e, f, c, d, t, 15, a[58]),
                d = n(d, e, f, c, B, 21, a[59]), c = n(c, d, e, f, r, 6, a[60]), f = n(f, c, d, e, z, 10, a[61]),
                e = n(e, f, c, d, j, 15, a[62]), d = n(d, e, f, c, x, 21, a[63]);
            b[0] = b[0] + c | 0;
            b[1] = b[1] + d | 0;
            b[2] = b[2] + e | 0;
            b[3] = b[3] + f | 0
        }, _doFinalize: function () {
            var a = this._data, k = a.words, b = 8 * this._nDataBytes, h = 8 * a.sigBytes;
            k[h >>> 5] |= 128 << 24 - h % 32;
            var l = s.floor(b /
                4294967296);
            k[(h + 64 >>> 9 << 4) + 15] = (l << 8 | l >>> 24) & 16711935 | (l << 24 | l >>> 8) & 4278255360;
            k[(h + 64 >>> 9 << 4) + 14] = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360;
            a.sigBytes = 4 * (k.length + 1);
            this._process();
            a = this._hash;
            k = a.words;
            for (b = 0; 4 > b; b++) h = k[b], k[b] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360;
            return a
        }, clone: function () {
            var a = t.clone.call(this);
            a._hash = this._hash.clone();
            return a
        }
    });
    r.MD5 = t._createHelper(q);
    r.HmacMD5 = t._createHmacHelper(q)
})(Math);
var Ext = Ext || {};
Ext.String = function () {
    var j = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
        n = /('|\\)/g, i = /\{(\d+)\}/g, b = /([-.*+?\^${}()|\[\]\/\\])/g, o = /^\s+|\s+$/g, k = /\s+/,
        m = /(^[^a-z]*|[^\w])/gi, e, a, h, d, g = function (q, p) {
            return e[p]
        }, l = function (q, p) {
            return p in a ? a[p] : String.fromCharCode(parseInt(p.substr(2), 10))
        }, c = function (q, p) {
            if (q === null || q === undefined || p === null || p === undefined) {
                return false
            }
            return p.length <= q.length
        };
    return {
        insert: function (t, u, q) {
            if (!t) {
                return u
            }
            if (!u) {
                return t
            }
            var p = t.length;
            if (!q && q !== 0) {
                q = p
            }
            if (q < 0) {
                q *= -1;
                if (q >= p) {
                    q = 0
                } else {
                    q = p - q
                }
            }
            if (q === 0) {
                t = u + t
            } else {
                if (q >= t.length) {
                    t += u
                } else {
                    t = t.substr(0, q) + u + t.substr(q)
                }
            }
            return t
        },
        startsWith: function (t, u, q) {
            var p = c(t, u);
            if (p) {
                if (q) {
                    t = t.toLowerCase();
                    u = u.toLowerCase()
                }
                p = t.lastIndexOf(u, 0) === 0
            }
            return p
        },
        endsWith: function (u, q, t) {
            var p = c(u, q);
            if (p) {
                if (t) {
                    u = u.toLowerCase();
                    q = q.toLowerCase()
                }
                p = u.indexOf(q, u.length - q.length) !== -1
            }
            return p
        },
        createVarName: function (p) {
            return p.replace(m, "")
        },
        htmlEncode: function (p) {
            return !p ? p : String(p).replace(h, g)
        },
        htmlDecode: function (p) {
            return !p ? p : String(p).replace(d, l)
        },
        addCharacterEntities: function (q) {
            var p = [], u = [], s, t;
            for (s in q) {
                t = q[s];
                a[s] = t;
                e[t] = s;
                p.push(t);
                u.push(s)
            }
            h = new RegExp("(" + p.join("|") + ")", "g");
            d = new RegExp("(" + u.join("|") + "|&#[0-9]{1,5};)", "g")
        },
        resetCharacterEntities: function () {
            e = {};
            a = {};
            this.addCharacterEntities({
                "&amp;": "&",
                ">": ">",
                "<": "<",
                "&quot;": '"',
                "'": "'"
            })
        },
        urlAppend: function (q, p) {
            if (!Ext.isEmpty(p)) {
                return q + (q.indexOf("?") === -1 ? "?" : "&") + p
            }
            return q
        },
        trim: function (p) {
            return p.replace(j, "")
        },
        capitalize: function (p) {
            return p.charAt(0).toUpperCase() + p.substr(1)
        },
        uncapitalize: function (p) {
            return p.charAt(0).toLowerCase() + p.substr(1)
        },
        ellipsis: function (s, p, t) {
            if (s && s.length > p) {
                if (t) {
                    var u = s.substr(0, p - 2)
                        , q = Math.max(u.lastIndexOf(" "), u.lastIndexOf("."), u.lastIndexOf("!"), u.lastIndexOf("?"));
                    if (q !== -1 && q >= p - 15) {
                        return u.substr(0, q) + "..."
                    }
                }
                return s.substr(0, p - 3) + "..."
            }
            return s
        },
        escapeRegex: function (p) {
            return p.replace(b, "\\$1")
        },
        escape: function (p) {
            return p.replace(n, "\\$1")
        },
        toggle: function (q, s, p) {
            return q === s ? p : s
        },
        leftPad: function (q, s, t) {
            var p = String(q);
            t = t || " ";
            while (p.length < s) {
                p = t + p
            }
            return p
        },
        format: function (q) {
            var p = Ext.Array.toArray(arguments, 1);
            return q.replace(i, function (s, t) {
                return p[t]
            })
        },
        repeat: function (u, t, q) {
            if (t < 1) {
                t = 0
            }
            for (var p = [], s = t; s--;) {
                p.push(u)
            }
            return p.join(q || "")
        },
        splitWords: function (p) {
            if (p && typeof p == "string") {
                return p.replace(o, "").split(k)
            }
            return p || []
        }
    }
}();
(function () {
        var g = Array.prototype, o = g.slice, q = function () {
                var B = [], e, A = 20;
                if (!B.splice) {
                    return false
                }
                while (A--) {
                    B.push("A")
                }
                B.splice(15, 0, "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F");
                e = B.length;
                B.splice(13, 0, "XXX");
                if (e + 1 != B.length) {
                    return false
                }
                return true
            }(), j = "forEach" in g, v = "map" in g, p = "indexOf" in g, z = "every" in g, c = "some" in g,
            d = "filter" in g, n = function () {
                var e = [1, 2, 3, 4, 5].sort(function () {
                    return 0
                });
                return e[0] === 1 && e[1] === 2 && e[2] === 3 && e[3] === 4 && e[4] === 5
            }(), k = true, a, x, u, w;
        try {
            if (typeof document !== "undefined") {
                o.call(document.getElementsByTagName("body"))
            }
        } catch (t) {
            k = false
        }

        function m(A, e) {
            return e < 0 ? Math.max(0, A.length + e) : Math.min(A.length, e)
        }

        function y(H, G, A, K) {
            var L = K ? K.length : 0, C = H.length, I = m(H, G), F, J, B, e, D, E;
            if (I === C) {
                if (L) {
                    H.push.apply(H, K)
                }
            } else {
                F = Math.min(A, C - I);
                J = I + F;
                B = J + L - F;
                e = C - J;
                D = C - F;
                if (B < J) {
                    for (E = 0; E < e; ++E) {
                        H[B + E] = H[J + E]
                    }
                } else {
                    if (B > J) {
                        for (E = e; E--;) {
                            H[B + E] = H[J + E]
                        }
                    }
                }
                if (L && I === D) {
                    H.length = D;
                    H.push.apply(H, K)
                } else {
                    H.length = D + L;
                    for (E = 0; E < L; ++E) {
                        H[I + E] = K[E]
                    }
                }
            }
            return H
        }

        function i(C, e, B, A) {
            if (A && A.length) {
                if (e === 0 && !B) {
                    C.unshift.apply(C, A)
                } else {
                    if (e < C.length) {
                        C.splice.apply(C, [e, B].concat(A))
                    } else {
                        C.push.apply(C, A)
                    }
                }
            } else {
                C.splice(e, B)
            }
            return C
        }

        function b(B, e, A) {
            return y(B, e, A)
        }

        function s(B, e, A) {
            B.splice(e, A);
            return B
        }

        function l(D, e, B) {
            var C = m(D, e)
                , A = D.slice(e, m(D, C + B));
            if (arguments.length < 4) {
                y(D, C, B)
            } else {
                y(D, C, B, o.call(arguments, 3))
            }
            return A
        }

        function h(e) {
            return e.splice.apply(e, o.call(arguments, 1))
        }

        x = q ? s : b;
        u = q ? i : y;
        w = q ? h : l;
        a = Ext.Array = {
            each: function (E, C, B, e) {
                E = a.from(E);
                var A, D = E.length;
                if (e !== true) {
                    for (A = 0; A < D; A++) {
                        if (C.call(B || E[A], E[A], A, E) === false) {
                            return A
                        }
                    }
                } else {
                    for (A = D - 1; A > -1; A--) {
                        if (C.call(B || E[A], E[A], A, E) === false) {
                            return A
                        }
                    }
                }
                return true
            },
            forEach: j ? function (B, A, e) {
                    B.forEach(A, e)
                }
                : function (D, B, A) {
                    var e = 0
                        , C = D.length;
                    for (; e < C; e++) {
                        B.call(A, D[e], e, D)
                    }
                }
            ,
            indexOf: p ? function (B, e, A) {
                    return g.indexOf.call(B, e, A)
                }
                : function (D, B, C) {
                    var e, A = D.length;
                    for (e = C < 0 ? Math.max(0, A + C) : C || 0; e < A; e++) {
                        if (D[e] === B) {
                            return e
                        }
                    }
                    return -1
                }
            ,
            contains: p ? function (A, e) {
                    return g.indexOf.call(A, e) !== -1
                }
                : function (C, B) {
                    var e, A;
                    for (e = 0,
                             A = C.length; e < A; e++) {
                        if (C[e] === B) {
                            return true
                        }
                    }
                    return false
                }
            ,
            toArray: function (B, D, e) {
                if (!B || !B.length) {
                    return []
                }
                if (typeof B === "string") {
                    B = B.split("")
                }
                if (k) {
                    return o.call(B, D || 0, e || B.length)
                }
                var C = [], A;
                D = D || 0;
                e = e ? e < 0 ? B.length + e : e : B.length;
                for (A = D; A < e; A++) {
                    C.push(B[A])
                }
                return C
            },
            pluck: function (E, e) {
                var A = [], B, D, C;
                for (B = 0,
                         D = E.length; B < D; B++) {
                    C = E[B];
                    A.push(C[e])
                }
                return A
            },
            map: v ? function (B, A, e) {
                    if (!A) {
                        Ext.Error.raise("Ext.Array.map must have a callback function passed as second argument.")
                    }
                    return B.map(A, e)
                }
                : function (E, D, C) {
                    if (!D) {
                        Ext.Error.raise("Ext.Array.map must have a callback function passed as second argument.")
                    }
                    var B = []
                        , A = 0
                        , e = E.length;
                    for (; A < e; A++) {
                        B[A] = D.call(C, E[A], A, E)
                    }
                    return B
                }
            ,
            every: z ? function (B, A, e) {
                    if (!A) {
                        Ext.Error.raise("Ext.Array.every must have a callback function passed as second argument.")
                    }
                    return B.every(A, e)
                }
                : function (D, B, A) {
                    if (!B) {
                        Ext.Error.raise("Ext.Array.every must have a callback function passed as second argument.")
                    }
                    var e = 0
                        , C = D.length;
                    for (; e < C; ++e) {
                        if (!B.call(A, D[e], e, D)) {
                            return false
                        }
                    }
                    return true
                }
            ,
            some: c ? function (B, A, e) {
                    if (!A) {
                        Ext.Error.raise("Ext.Array.some must have a callback function passed as second argument.")
                    }
                    return B.some(A, e)
                }
                : function (D, B, A) {
                    if (!B) {
                        Ext.Error.raise("Ext.Array.some must have a callback function passed as second argument.")
                    }
                    var e = 0
                        , C = D.length;
                    for (; e < C; ++e) {
                        if (B.call(A, D[e], e, D)) {
                            return true
                        }
                    }
                    return false
                }
            ,
            equals: function (D, C) {
                var A = D.length, e = C.length, B;
                if (D === C) {
                    return true
                }
                if (A !== e) {
                    return false
                }
                for (B = 0; B < A; ++B) {
                    if (D[B] !== C[B]) {
                        return false
                    }
                }
                return true
            },
            clean: function (D) {
                var A = [], e = 0, C = D.length, B;
                for (; e < C; e++) {
                    B = D[e];
                    if (!Ext.isEmpty(B)) {
                        A.push(B)
                    }
                }
                return A
            },
            unique: function (D) {
                var C = [], e = 0, B = D.length, A;
                for (; e < B; e++) {
                    A = D[e];
                    if (a.indexOf(C, A) === -1) {
                        C.push(A)
                    }
                }
                return C
            },
            filter: d ? function (B, A, e) {
                    if (!A) {
                        Ext.Error.raise("Ext.Array.filter must have a filter function passed as second argument.")
                    }
                    return B.filter(A, e)
                }
                : function (E, C, B) {
                    if (!C) {
                        Ext.Error.raise("Ext.Array.filter must have a filter function passed as second argument.")
                    }
                    var A = []
                        , e = 0
                        , D = E.length;
                    for (; e < D; e++) {
                        if (C.call(B, E[e], e, E)) {
                            A.push(E[e])
                        }
                    }
                    return A
                }
            ,
            findBy: function (D, C, B) {
                var A = 0
                    , e = D.length;
                for (; A < e; A++) {
                    if (C.call(B || D, D[A], A)) {
                        return D[A]
                    }
                }
                return null
            },
            from: function (B, A) {
                if (B === undefined || B === null) {
                    return []
                }
                if (Ext.isArray(B)) {
                    return A ? o.call(B) : B
                }
                var e = typeof B;
                if (B && B.length !== undefined && e !== "string" && (e !== "function" || !B.apply)) {
                    return a.toArray(B)
                }
                return [B]
            },
            remove: function (B, A) {
                var e = a.indexOf(B, A);
                if (e !== -1) {
                    x(B, e, 1)
                }
                return B
            },
            include: function (A, e) {
                if (!a.contains(A, e)) {
                    A.push(e)
                }
            },
            clone: function (e) {
                return o.call(e)
            },
            merge: function () {
                var e = o.call(arguments), C = [], A, B;
                for (A = 0,
                         B = e.length; A < B; A++) {
                    C = C.concat(e[A])
                }
                return a.unique(C)
            },
            intersect: function () {
                var e = [], B = o.call(arguments), M, K, G, J, N, C, A, I, L, D, H, F, E;
                if (!B.length) {
                    return e
                }
                M = B.length;
                for (H = N = 0; H < M; H++) {
                    C = B[H];
                    if (!J || C.length < J.length) {
                        J = C;
                        N = H
                    }
                }
                J = a.unique(J);
                x(B, N, 1);
                A = J.length;
                M = B.length;
                for (H = 0; H < A; H++) {
                    I = J[H];
                    D = 0;
                    for (F = 0; F < M; F++) {
                        K = B[F];
                        G = K.length;
                        for (E = 0; E < G; E++) {
                            L = K[E];
                            if (I === L) {
                                D++;
                                break
                            }
                        }
                    }
                    if (D === M) {
                        e.push(I)
                    }
                }
                return e
            },
            difference: function (A, e) {
                var F = o.call(A), D = F.length, C, B, E;
                for (C = 0,
                         E = e.length; C < E; C++) {
                    for (B = 0; B < D; B++) {
                        if (F[B] === e[C]) {
                            x(F, B, 1);
                            B--;
                            D--
                        }
                    }
                }
                return F
            },
            slice: [1, 2].slice(1, undefined).length ? function (B, A, e) {
                    return o.call(B, A, e)
                }
                : function (B, A, e) {
                    if (typeof A === "undefined") {
                        return o.call(B)
                    }
                    if (typeof e === "undefined") {
                        return o.call(B, A)
                    }
                    return o.call(B, A, e)
                }
            ,
            sort: n ? function (A, e) {
                    if (e) {
                        return A.sort(e)
                    } else {
                        return A.sort()
                    }
                }
                : function (G, F) {
                    var D = G.length, C = 0, E, e, B, A;
                    for (; C < D; C++) {
                        B = C;
                        for (e = C + 1; e < D; e++) {
                            if (F) {
                                E = F(G[e], G[B]);
                                if (E < 0) {
                                    B = e
                                }
                            } else {
                                if (G[e] < G[B]) {
                                    B = e
                                }
                            }
                        }
                        if (B !== C) {
                            A = G[C];
                            G[C] = G[B];
                            G[B] = A
                        }
                    }
                    return G
                }
            ,
            flatten: function (B) {
                var A = [];

                function e(C) {
                    var E, F, D;
                    for (E = 0,
                             F = C.length; E < F; E++) {
                        D = C[E];
                        if (Ext.isArray(D)) {
                            e(D)
                        } else {
                            A.push(D)
                        }
                    }
                    return A
                }

                return e(B)
            },
            min: function (E, D) {
                var A = E[0], e, C, B;
                for (e = 0,
                         C = E.length; e < C; e++) {
                    B = E[e];
                    if (D) {
                        if (D(A, B) === 1) {
                            A = B
                        }
                    } else {
                        if (B < A) {
                            A = B
                        }
                    }
                }
                return A
            },
            max: function (E, D) {
                var e = E[0], A, C, B;
                for (A = 0,
                         C = E.length; A < C; A++) {
                    B = E[A];
                    if (D) {
                        if (D(e, B) === -1) {
                            e = B
                        }
                    } else {
                        if (B > e) {
                            e = B
                        }
                    }
                }
                return e
            },
            mean: function (e) {
                return e.length > 0 ? a.sum(e) / e.length : undefined
            },
            sum: function (D) {
                var A = 0, e, C, B;
                for (e = 0,
                         C = D.length; e < C; e++) {
                    B = D[e];
                    A += B
                }
                return A
            },
            toMap: function (D, e, B) {
                var C = {}
                    , A = D.length;
                if (!e) {
                    while (A--) {
                        C[D[A]] = A + 1
                    }
                } else {
                    if (typeof e == "string") {
                        while (A--) {
                            C[D[A][e]] = A + 1
                        }
                    } else {
                        while (A--) {
                            C[e.call(B, D[A])] = A + 1
                        }
                    }
                }
                return C
            },
            toValueMap: function (D, e, B) {
                var C = {}
                    , A = D.length;
                if (!e) {
                    while (A--) {
                        C[D[A]] = D[A]
                    }
                } else {
                    if (typeof e == "string") {
                        while (A--) {
                            C[D[A][e]] = D[A]
                        }
                    } else {
                        while (A--) {
                            C[e.call(B, D[A])] = D[A]
                        }
                    }
                }
                return C
            },
            _replaceSim: y,
            _spliceSim: l,
            erase: x,
            insert: function (B, A, e) {
                return u(B, A, 0, e)
            },
            replace: u,
            splice: w,
            push: function (C) {
                var e = arguments.length, B = 1, A;
                if (C === undefined) {
                    C = []
                } else {
                    if (!Ext.isArray(C)) {
                        C = [C]
                    }
                }
                for (; B < e; B++) {
                    A = arguments[B];
                    Array.prototype.push[Ext.isIterable(A) ? "apply" : "call"](C, A)
                }
                return C
            }
        };
        Ext.each = a.each;
        a.union = a.merge;
        Ext.min = a.min;
        Ext.max = a.max;
        Ext.sum = a.sum;
        Ext.mean = a.mean;
        Ext.flatten = a.flatten;
        Ext.clean = a.clean;
        Ext.unique = a.unique;
        Ext.pluck = a.pluck;
        Ext.toArray = function () {
            return a.toArray.apply(a, arguments)
        }
    }
)();
function decrypt(clazzId,courseId,objectId,userid,jobid,end,isdrag) {
    var _0x46946 = '[{0}][{1}][{2}][{3}][{4}][{5}][{6}][{7}]';
    var _0x16be19 = end * 0x3e8;
    var _0x237c28 = '0_' + end;
    var _0x2286e7 = Ext.String.format(_0x46946, clazzId, userid,
        jobid || '', objectId, _0x16be19, 'd_yHJ!$pdA~5', end * 0x3e8, _0x237c28);
    return {
        'clazzId': clazzId,
        'playingTime': end,
        'duration': end,
        'clipTime': '0_'+end,
        'objectId': objectId,
        'otherInfo': 'nodeId_552707073-cpi_156553352-rt_d-ds_1-ff_d-be_0_0-vt_1-v_6-enc_c69e9d0f45dcd8ea49dbd96dbfb22c29',
        'courseId': courseId,
        'jobid': jobid,
        'userid': userid,
        'isdrag': isdrag,
        'view': 'pc',
        'enc': CryptoJS.MD5(_0x2286e7).toString(),
        'rt': '0.9',
        'dtype': 'Video',
        '_t': new Date().getTime(),
    };
}
