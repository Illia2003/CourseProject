﻿/*File: angular.min.js*/
/*
 AngularJS v1.2.15
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function (Q, T, s) {
    'use strict'; function z(b) { return function () { var a = arguments[0], c, a = "[" + (b ? b + ":" : "") + a + "] http://errors.angularjs.org/1.2.15/" + (b ? b + "/" : "") + a; for (c = 1; c < arguments.length; c++) a = a + (1 == c ? "?" : "&") + "p" + (c - 1) + "=" + encodeURIComponent("function" == typeof arguments[c] ? arguments[c].toString().replace(/ \{[\s\S]*$/, "") : "undefined" == typeof arguments[c] ? "undefined" : "string" != typeof arguments[c] ? JSON.stringify(arguments[c]) : arguments[c]); return Error(a) } } function $a(b) {
        if (null == b || Aa(b)) return !1;
        var a = b.length; return 1 === b.nodeType && a ? !0 : x(b) || M(b) || 0 === a || "number" === typeof a && 0 < a && a - 1 in b
    } function r(b, a, c) { var d; if (b) if (D(b)) for (d in b) "prototype" == d || ("length" == d || "name" == d || b.hasOwnProperty && !b.hasOwnProperty(d)) || a.call(c, b[d], d); else if (b.forEach && b.forEach !== r) b.forEach(a, c); else if ($a(b)) for (d = 0; d < b.length; d++) a.call(c, b[d], d); else for (d in b) b.hasOwnProperty(d) && a.call(c, b[d], d); return b } function Ob(b) { var a = [], c; for (c in b) b.hasOwnProperty(c) && a.push(c); return a.sort() } function Qc(b,
    a, c) { for (var d = Ob(b), e = 0; e < d.length; e++) a.call(c, b[d[e]], d[e]); return d } function Pb(b) { return function (a, c) { b(c, a) } } function ab() { for (var b = ia.length, a; b;) { b--; a = ia[b].charCodeAt(0); if (57 == a) return ia[b] = "A", ia.join(""); if (90 == a) ia[b] = "0"; else return ia[b] = String.fromCharCode(a + 1), ia.join("") } ia.unshift("0"); return ia.join("") } function Qb(b, a) { a ? b.$$hashKey = a : delete b.$$hashKey } function v(b) { var a = b.$$hashKey; r(arguments, function (a) { a !== b && r(a, function (a, c) { b[c] = a }) }); Qb(b, a); return b } function R(b) {
        return parseInt(b,
        10)
    } function Rb(b, a) { return v(new (v(function () { }, { prototype: b })), a) } function B() { } function Ba(b) { return b } function Y(b) { return function () { return b } } function E(b) { return "undefined" === typeof b } function u(b) { return "undefined" !== typeof b } function W(b) { return null != b && "object" === typeof b } function x(b) { return "string" === typeof b } function ub(b) { return "number" === typeof b } function Ma(b) { return "[object Date]" === ta.call(b) } function M(b) { return "[object Array]" === ta.call(b) } function D(b) { return "function" === typeof b }
    function bb(b) { return "[object RegExp]" === ta.call(b) } function Aa(b) { return b && b.document && b.location && b.alert && b.setInterval } function Rc(b) { return !(!b || !(b.nodeName || b.prop && b.attr && b.find)) } function Sc(b, a, c) { var d = []; r(b, function (b, f, g) { d.push(a.call(c, b, f, g)) }); return d } function cb(b, a) { if (b.indexOf) return b.indexOf(a); for (var c = 0; c < b.length; c++) if (a === b[c]) return c; return -1 } function Na(b, a) { var c = cb(b, a); 0 <= c && b.splice(c, 1); return a } function $(b, a) {
        if (Aa(b) || b && b.$evalAsync && b.$watch) throw Oa("cpws");
        if (a) { if (b === a) throw Oa("cpi"); if (M(b)) for (var c = a.length = 0; c < b.length; c++) a.push($(b[c])); else { c = a.$$hashKey; r(a, function (b, c) { delete a[c] }); for (var d in b) a[d] = $(b[d]); Qb(a, c) } } else (a = b) && (M(b) ? a = $(b, []) : Ma(b) ? a = new Date(b.getTime()) : bb(b) ? a = RegExp(b.source) : W(b) && (a = $(b, {}))); return a
    } function Sb(b, a) { a = a || {}; for (var c in b) !b.hasOwnProperty(c) || "$" === c.charAt(0) && "$" === c.charAt(1) || (a[c] = b[c]); return a } function ua(b, a) {
        if (b === a) return !0; if (null === b || null === a) return !1; if (b !== b && a !== a) return !0;
        var c = typeof b, d; if (c == typeof a && "object" == c) if (M(b)) { if (!M(a)) return !1; if ((c = b.length) == a.length) { for (d = 0; d < c; d++) if (!ua(b[d], a[d])) return !1; return !0 } } else {
            if (Ma(b)) return Ma(a) && b.getTime() == a.getTime(); if (bb(b) && bb(a)) return b.toString() == a.toString(); if (b && b.$evalAsync && b.$watch || a && a.$evalAsync && a.$watch || Aa(b) || Aa(a) || M(a)) return !1; c = {}; for (d in b) if ("$" !== d.charAt(0) && !D(b[d])) { if (!ua(b[d], a[d])) return !1; c[d] = !0 } for (d in a) if (!c.hasOwnProperty(d) && "$" !== d.charAt(0) && a[d] !== s && !D(a[d])) return !1;
            return !0
        } return !1
    } function Tb() { return T.securityPolicy && T.securityPolicy.isActive || T.querySelector && !(!T.querySelector("[ng-csp]") && !T.querySelector("[data-ng-csp]")) } function db(b, a) { var c = 2 < arguments.length ? va.call(arguments, 2) : []; return !D(a) || a instanceof RegExp ? a : c.length ? function () { return arguments.length ? a.apply(b, c.concat(va.call(arguments, 0))) : a.apply(b, c) } : function () { return arguments.length ? a.apply(b, arguments) : a.call(b) } } function Tc(b, a) {
        var c = a; "string" === typeof b && "$" === b.charAt(0) ? c =
            s : Aa(a) ? c = "$WINDOW" : a && T === a ? c = "$DOCUMENT" : a && (a.$evalAsync && a.$watch) && (c = "$SCOPE"); return c
    } function oa(b, a) { return "undefined" === typeof b ? s : JSON.stringify(b, Tc, a ? "  " : null) } function Ub(b) { return x(b) ? JSON.parse(b) : b } function Pa(b) { "function" === typeof b ? b = !0 : b && 0 !== b.length ? (b = O("" + b), b = !("f" == b || "0" == b || "false" == b || "no" == b || "n" == b || "[]" == b)) : b = !1; return b } function fa(b) {
        b = w(b).clone(); try { b.empty() } catch (a) { } var c = w("<div>").append(b).html(); try {
            return 3 === b[0].nodeType ? O(c) : c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,
            function (a, b) { return "<" + O(b) })
        } catch (d) { return O(c) }
    } function Vb(b) { try { return decodeURIComponent(b) } catch (a) { } } function Wb(b) { var a = {}, c, d; r((b || "").split("&"), function (b) { b && (c = b.split("="), d = Vb(c[0]), u(d) && (b = u(c[1]) ? Vb(c[1]) : !0, a[d] ? M(a[d]) ? a[d].push(b) : a[d] = [a[d], b] : a[d] = b)) }); return a } function Xb(b) { var a = []; r(b, function (b, d) { M(b) ? r(b, function (b) { a.push(wa(d, !0) + (!0 === b ? "" : "=" + wa(b, !0))) }) : a.push(wa(d, !0) + (!0 === b ? "" : "=" + wa(b, !0))) }); return a.length ? a.join("&") : "" } function vb(b) {
        return wa(b,
        !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+")
    } function wa(b, a) { return encodeURIComponent(b).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, a ? "%20" : "+") } function Uc(b, a) {
        function c(a) { a && d.push(a) } var d = [b], e, f, g = ["ng:app", "ng-app", "x-ng-app", "data-ng-app"], h = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/; r(g, function (a) {
            g[a] = !0; c(T.getElementById(a)); a = a.replace(":", "\\:"); b.querySelectorAll && (r(b.querySelectorAll("." + a), c), r(b.querySelectorAll("." +
            a + "\\:"), c), r(b.querySelectorAll("[" + a + "]"), c))
        }); r(d, function (a) { if (!e) { var b = h.exec(" " + a.className + " "); b ? (e = a, f = (b[2] || "").replace(/\s+/g, ",")) : r(a.attributes, function (b) { !e && g[b.name] && (e = a, f = b.value) }) } }); e && a(e, f ? [f] : [])
    } function Yb(b, a) {
        var c = function () {
            b = w(b); if (b.injector()) { var c = b[0] === T ? "document" : fa(b); throw Oa("btstrpd", c); } a = a || []; a.unshift(["$provide", function (a) { a.value("$rootElement", b) }]); a.unshift("ng"); c = Zb(a); c.invoke(["$rootScope", "$rootElement", "$compile", "$injector", "$animate",
            function (a, b, c, d, e) { a.$apply(function () { b.data("$injector", d); c(b)(a) }) }]); return c
        }, d = /^NG_DEFER_BOOTSTRAP!/; if (Q && !d.test(Q.name)) return c(); Q.name = Q.name.replace(d, ""); Ca.resumeBootstrap = function (b) { r(b, function (b) { a.push(b) }); c() }
    } function eb(b, a) { a = a || "_"; return b.replace(Vc, function (b, d) { return (d ? a : "") + b.toLowerCase() }) } function wb(b, a, c) { if (!b) throw Oa("areq", a || "?", c || "required"); return b } function Qa(b, a, c) {
        c && M(b) && (b = b[b.length - 1]); wb(D(b), a, "not a function, got " + (b && "object" == typeof b ?
        b.constructor.name || "Object" : typeof b)); return b
    } function xa(b, a) { if ("hasOwnProperty" === b) throw Oa("badname", a); } function $b(b, a, c) { if (!a) return b; a = a.split("."); for (var d, e = b, f = a.length, g = 0; g < f; g++) d = a[g], b && (b = (e = b)[d]); return !c && D(b) ? db(e, b) : b } function xb(b) { var a = b[0]; b = b[b.length - 1]; if (a === b) return w(a); var c = [a]; do { a = a.nextSibling; if (!a) break; c.push(a) } while (a !== b); return w(c) } function Wc(b) {
        var a = z("$injector"), c = z("ng"); b = b.angular || (b.angular = {}); b.$$minErr = b.$$minErr || z; return b.module ||
        (b.module = function () {
            var b = {}; return function (e, f, g) {
                if ("hasOwnProperty" === e) throw c("badname", "module"); f && b.hasOwnProperty(e) && (b[e] = null); return b[e] || (b[e] = function () {
                    function b(a, d, e) { return function () { c[e || "push"]([a, d, arguments]); return n } } if (!f) throw a("nomod", e); var c = [], d = [], l = b("$injector", "invoke"), n = {
                        _invokeQueue: c, _runBlocks: d, requires: f, name: e, provider: b("$provide", "provider"), factory: b("$provide", "factory"), service: b("$provide", "service"), value: b("$provide", "value"), constant: b("$provide",
                        "constant", "unshift"), animation: b("$animateProvider", "register"), filter: b("$filterProvider", "register"), controller: b("$controllerProvider", "register"), directive: b("$compileProvider", "directive"), config: l, run: function (a) { d.push(a); return this }
                    }; g && l(g); return n
                }())
            }
        }())
    } function Xc(b) {
        v(b, {
            bootstrap: Yb, copy: $, extend: v, equals: ua, element: w, forEach: r, injector: Zb, noop: B, bind: db, toJson: oa, fromJson: Ub, identity: Ba, isUndefined: E, isDefined: u, isString: x, isFunction: D, isObject: W, isNumber: ub, isElement: Rc, isArray: M,
            version: Yc, isDate: Ma, lowercase: O, uppercase: Da, callbacks: { counter: 0 }, $$minErr: z, $$csp: Tb
        }); Ra = Wc(Q); try { Ra("ngLocale") } catch (a) { Ra("ngLocale", []).provider("$locale", Zc) } Ra("ng", ["ngLocale"], ["$provide", function (a) {
            a.provider({ $$sanitizeUri: $c }); a.provider("$compile", ac).directive({
                a: ad, input: bc, textarea: bc, form: bd, script: cd, select: dd, style: ed, option: fd, ngBind: gd, ngBindHtml: hd, ngBindTemplate: id, ngClass: jd, ngClassEven: kd, ngClassOdd: ld, ngCloak: md, ngController: nd, ngForm: od, ngHide: pd, ngIf: qd, ngInclude: rd,
                ngInit: sd, ngNonBindable: td, ngPluralize: ud, ngRepeat: vd, ngShow: wd, ngStyle: xd, ngSwitch: yd, ngSwitchWhen: zd, ngSwitchDefault: Ad, ngOptions: Bd, ngTransclude: Cd, ngModel: Dd, ngList: Ed, ngChange: Fd, required: cc, ngRequired: cc, ngValue: Gd
            }).directive({ ngInclude: Hd }).directive(yb).directive(dc); a.provider({
                $anchorScroll: Id, $animate: Jd, $browser: Kd, $cacheFactory: Ld, $controller: Md, $document: Nd, $exceptionHandler: Od, $filter: ec, $interpolate: Pd, $interval: Qd, $http: Rd, $httpBackend: Sd, $location: Td, $log: Ud, $parse: Vd, $rootScope: Wd,
                $q: Xd, $sce: Yd, $sceDelegate: Zd, $sniffer: $d, $templateCache: ae, $timeout: be, $window: ce, $$rAF: de, $$asyncCallback: ee
            })
        }])
    } function Sa(b) { return b.replace(fe, function (a, b, d, e) { return e ? d.toUpperCase() : d }).replace(ge, "Moz$1") } function zb(b, a, c, d) {
        function e(b) { var e = c && b ? [this.filter(b)] : [this], m = a, k, l, n, q, p, t; if (!d || null != b) for (; e.length;) for (k = e.shift(), l = 0, n = k.length; l < n; l++) for (q = w(k[l]), m ? q.triggerHandler("$destroy") : m = !m, p = 0, q = (t = q.children()).length; p < q; p++) e.push(Ea(t[p])); return f.apply(this, arguments) }
        var f = Ea.fn[b], f = f.$original || f; e.$original = f; Ea.fn[b] = e
    } function L(b) { if (b instanceof L) return b; x(b) && (b = aa(b)); if (!(this instanceof L)) { if (x(b) && "<" != b.charAt(0)) throw Ab("nosel"); return new L(b) } if (x(b)) { var a = T.createElement("div"); a.innerHTML = "<div>&#160;</div>" + b; a.removeChild(a.firstChild); Bb(this, a.childNodes); w(T.createDocumentFragment()).append(this) } else Bb(this, b) } function Cb(b) { return b.cloneNode(!0) } function Fa(b) { fc(b); var a = 0; for (b = b.childNodes || []; a < b.length; a++) Fa(b[a]) } function gc(b,
    a, c, d) { if (u(d)) throw Ab("offargs"); var e = ja(b, "events"); ja(b, "handle") && (E(a) ? r(e, function (a, c) { Db(b, c, a); delete e[c] }) : r(a.split(" "), function (a) { E(c) ? (Db(b, a, e[a]), delete e[a]) : Na(e[a] || [], c) })) } function fc(b, a) { var c = b[fb], d = Ta[c]; d && (a ? delete Ta[c].data[a] : (d.handle && (d.events.$destroy && d.handle({}, "$destroy"), gc(b)), delete Ta[c], b[fb] = s)) } function ja(b, a, c) { var d = b[fb], d = Ta[d || -1]; if (u(c)) d || (b[fb] = d = ++he, d = Ta[d] = {}), d[a] = c; else return d && d[a] } function hc(b, a, c) {
        var d = ja(b, "data"), e = u(c), f = !e &&
        u(a), g = f && !W(a); d || g || ja(b, "data", d = {}); if (e) d[a] = c; else if (f) { if (g) return d && d[a]; v(d, a) } else return d
    } function Eb(b, a) { return b.getAttribute ? -1 < (" " + (b.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + a + " ") : !1 } function gb(b, a) { a && b.setAttribute && r(a.split(" "), function (a) { b.setAttribute("class", aa((" " + (b.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").replace(" " + aa(a) + " ", " "))) }) } function hb(b, a) {
        if (a && b.setAttribute) {
            var c = (" " + (b.getAttribute("class") || "") + " ").replace(/[\n\t]/g,
            " "); r(a.split(" "), function (a) { a = aa(a); -1 === c.indexOf(" " + a + " ") && (c += a + " ") }); b.setAttribute("class", aa(c))
        }
    } function Bb(b, a) { if (a) { a = a.nodeName || !u(a.length) || Aa(a) ? [a] : a; for (var c = 0; c < a.length; c++) b.push(a[c]) } } function ic(b, a) { return ib(b, "$" + (a || "ngController") + "Controller") } function ib(b, a, c) { b = w(b); 9 == b[0].nodeType && (b = b.find("html")); for (a = M(a) ? a : [a]; b.length;) { for (var d = b[0], e = 0, f = a.length; e < f; e++) if ((c = b.data(a[e])) !== s) return c; b = w(d.parentNode || 11 === d.nodeType && d.host) } } function jc(b) {
        for (var a =
        0, c = b.childNodes; a < c.length; a++) Fa(c[a]); for (; b.firstChild;) b.removeChild(b.firstChild)
    } function kc(b, a) { var c = jb[a.toLowerCase()]; return c && lc[b.nodeName] && c } function ie(b, a) {
        var c = function (c, e) {
            c.preventDefault || (c.preventDefault = function () { c.returnValue = !1 }); c.stopPropagation || (c.stopPropagation = function () { c.cancelBubble = !0 }); c.target || (c.target = c.srcElement || T); if (E(c.defaultPrevented)) { var f = c.preventDefault; c.preventDefault = function () { c.defaultPrevented = !0; f.call(c) }; c.defaultPrevented = !1 } c.isDefaultPrevented =
            function () { return c.defaultPrevented || !1 === c.returnValue }; var g = Sb(a[e || c.type] || []); r(g, function (a) { a.call(b, c) }); 8 >= P ? (c.preventDefault = null, c.stopPropagation = null, c.isDefaultPrevented = null) : (delete c.preventDefault, delete c.stopPropagation, delete c.isDefaultPrevented)
        }; c.elem = b; return c
    } function Ga(b) { var a = typeof b, c; "object" == a && null !== b ? "function" == typeof (c = b.$$hashKey) ? c = b.$$hashKey() : c === s && (c = b.$$hashKey = ab()) : c = b; return a + ":" + c } function Ua(b) { r(b, this.put, this) } function mc(b) {
        var a, c; "function" ==
        typeof b ? (a = b.$inject) || (a = [], b.length && (c = b.toString().replace(je, ""), c = c.match(ke), r(c[1].split(le), function (b) { b.replace(me, function (b, c, d) { a.push(d) }) })), b.$inject = a) : M(b) ? (c = b.length - 1, Qa(b[c], "fn"), a = b.slice(0, c)) : Qa(b, "fn", !0); return a
    } function Zb(b) {
        function a(a) { return function (b, c) { if (W(b)) r(b, Pb(a)); else return a(b, c) } } function c(a, b) { xa(a, "service"); if (D(b) || M(b)) b = n.instantiate(b); if (!b.$get) throw Va("pget", a); return l[a + h] = b } function d(a, b) { return c(a, { $get: b }) } function e(a) {
            var b = [],
            c, d, f, h; r(a, function (a) { if (!k.get(a)) { k.put(a, !0); try { if (x(a)) for (c = Ra(a), b = b.concat(e(c.requires)).concat(c._runBlocks), d = c._invokeQueue, f = 0, h = d.length; f < h; f++) { var g = d[f], m = n.get(g[0]); m[g[1]].apply(m, g[2]) } else D(a) ? b.push(n.invoke(a)) : M(a) ? b.push(n.invoke(a)) : Qa(a, "module") } catch (l) { throw M(a) && (a = a[a.length - 1]), l.message && (l.stack && -1 == l.stack.indexOf(l.message)) && (l = l.message + "\n" + l.stack), Va("modulerr", a, l.stack || l.message || l); } } }); return b
        } function f(a, b) {
            function c(d) {
                if (a.hasOwnProperty(d)) {
                    if (a[d] ===
                    g) throw Va("cdep", m.join(" <- ")); return a[d]
                } try { return m.unshift(d), a[d] = g, a[d] = b(d) } catch (e) { throw a[d] === g && delete a[d], e; } finally { m.shift() }
            } function d(a, b, e) { var f = [], h = mc(a), g, k, m; k = 0; for (g = h.length; k < g; k++) { m = h[k]; if ("string" !== typeof m) throw Va("itkn", m); f.push(e && e.hasOwnProperty(m) ? e[m] : c(m)) } a.$inject || (a = a[g]); return a.apply(b, f) } return {
                invoke: d, instantiate: function (a, b) { var c = function () { }, e; c.prototype = (M(a) ? a[a.length - 1] : a).prototype; c = new c; e = d(a, c, b); return W(e) || D(e) ? e : c }, get: c,
                annotate: mc, has: function (b) { return l.hasOwnProperty(b + h) || a.hasOwnProperty(b) }
            }
        } var g = {}, h = "Provider", m = [], k = new Ua, l = { $provide: { provider: a(c), factory: a(d), service: a(function (a, b) { return d(a, ["$injector", function (a) { return a.instantiate(b) }]) }), value: a(function (a, b) { return d(a, Y(b)) }), constant: a(function (a, b) { xa(a, "constant"); l[a] = b; q[a] = b }), decorator: function (a, b) { var c = n.get(a + h), d = c.$get; c.$get = function () { var a = p.invoke(d, c); return p.invoke(b, null, { $delegate: a }) } } } }, n = l.$injector = f(l, function () {
            throw Va("unpr",
            m.join(" <- "));
        }), q = {}, p = q.$injector = f(q, function (a) { a = n.get(a + h); return p.invoke(a.$get, a) }); r(e(b), function (a) { p.invoke(a || B) }); return p
    } function Id() {
        var b = !0; this.disableAutoScrolling = function () { b = !1 }; this.$get = ["$window", "$location", "$rootScope", function (a, c, d) {
            function e(a) { var b = null; r(a, function (a) { b || "a" !== O(a.nodeName) || (b = a) }); return b } function f() {
                var b = c.hash(), d; b ? (d = g.getElementById(b)) ? d.scrollIntoView() : (d = e(g.getElementsByName(b))) ? d.scrollIntoView() : "top" === b && a.scrollTo(0, 0) :
                a.scrollTo(0, 0)
            } var g = a.document; b && d.$watch(function () { return c.hash() }, function () { d.$evalAsync(f) }); return f
        }]
    } function ee() { this.$get = ["$$rAF", "$timeout", function (b, a) { return b.supported ? function (a) { return b(a) } : function (b) { return a(b, 0, !1) } }] } function ne(b, a, c, d) {
        function e(a) { try { a.apply(null, va.call(arguments, 1)) } finally { if (t--, 0 === t) for (; H.length;) try { H.pop()() } catch (b) { c.error(b) } } } function f(a, b) { (function kb() { r(C, function (a) { a() }); A = b(kb, a) })() } function g() {
            y = null; J != h.url() && (J = h.url(),
            r(ba, function (a) { a(h.url()) }))
        } var h = this, m = a[0], k = b.location, l = b.history, n = b.setTimeout, q = b.clearTimeout, p = {}; h.isMock = !1; var t = 0, H = []; h.$$completeOutstandingRequest = e; h.$$incOutstandingRequestCount = function () { t++ }; h.notifyWhenNoOutstandingRequests = function (a) { r(C, function (a) { a() }); 0 === t ? a() : H.push(a) }; var C = [], A; h.addPollFn = function (a) { E(A) && f(100, n); C.push(a); return a }; var J = k.href, F = a.find("base"), y = null; h.url = function (a, c) {
            k !== b.location && (k = b.location); l !== b.history && (l = b.history); if (a) {
                if (J !=
                a) return J = a, d.history ? c ? l.replaceState(null, "", a) : (l.pushState(null, "", a), F.attr("href", F.attr("href"))) : (y = a, c ? k.replace(a) : k.href = a), h
            } else return y || k.href.replace(/%27/g, "'")
        }; var ba = [], S = !1; h.onUrlChange = function (a) { if (!S) { if (d.history) w(b).on("popstate", g); if (d.hashchange) w(b).on("hashchange", g); else h.addPollFn(g); S = !0 } ba.push(a); return a }; h.baseHref = function () { var a = F.attr("href"); return a ? a.replace(/^(https?\:)?\/\/[^\/]*/, "") : "" }; var N = {}, Z = "", U = h.baseHref(); h.cookies = function (a, b) {
            var d,
            e, f, h; if (a) b === s ? m.cookie = escape(a) + "=;path=" + U + ";expires=Thu, 01 Jan 1970 00:00:00 GMT" : x(b) && (d = (m.cookie = escape(a) + "=" + escape(b) + ";path=" + U).length + 1, 4096 < d && c.warn("Cookie '" + a + "' possibly not set or overflowed because it was too large (" + d + " > 4096 bytes)!")); else { if (m.cookie !== Z) for (Z = m.cookie, d = Z.split("; "), N = {}, f = 0; f < d.length; f++) e = d[f], h = e.indexOf("="), 0 < h && (a = unescape(e.substring(0, h)), N[a] === s && (N[a] = unescape(e.substring(h + 1)))); return N }
        }; h.defer = function (a, b) {
            var c; t++; c = n(function () {
                delete p[c];
                e(a)
            }, b || 0); p[c] = !0; return c
        }; h.defer.cancel = function (a) { return p[a] ? (delete p[a], q(a), e(B), !0) : !1 }
    } function Kd() { this.$get = ["$window", "$log", "$sniffer", "$document", function (b, a, c, d) { return new ne(b, d, a, c) }] } function Ld() {
        this.$get = function () {
            function b(b, d) {
                function e(a) { a != n && (q ? q == a && (q = a.n) : q = a, f(a.n, a.p), f(a, n), n = a, n.n = null) } function f(a, b) { a != b && (a && (a.p = b), b && (b.n = a)) } if (b in a) throw z("$cacheFactory")("iid", b); var g = 0, h = v({}, d, { id: b }), m = {}, k = d && d.capacity || Number.MAX_VALUE, l = {}, n = null, q = null;
                return a[b] = { put: function (a, b) { if (k < Number.MAX_VALUE) { var c = l[a] || (l[a] = { key: a }); e(c) } if (!E(b)) return a in m || g++, m[a] = b, g > k && this.remove(q.key), b }, get: function (a) { if (k < Number.MAX_VALUE) { var b = l[a]; if (!b) return; e(b) } return m[a] }, remove: function (a) { if (k < Number.MAX_VALUE) { var b = l[a]; if (!b) return; b == n && (n = b.p); b == q && (q = b.n); f(b.n, b.p); delete l[a] } delete m[a]; g-- }, removeAll: function () { m = {}; g = 0; l = {}; n = q = null }, destroy: function () { l = h = m = null; delete a[b] }, info: function () { return v({}, h, { size: g }) } }
            } var a = {};
            b.info = function () { var b = {}; r(a, function (a, e) { b[e] = a.info() }); return b }; b.get = function (b) { return a[b] }; return b
        }
    } function ae() { this.$get = ["$cacheFactory", function (b) { return b("templates") }] } function ac(b, a) {
        var c = {}, d = "Directive", e = /^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/, f = /(([\d\w\-_]+)(?:\:([^;]+))?;?)/, g = /^<\s*(tr|th|td|thead|tbody|tfoot)(\s+[^>]*)?>/i, h = /^(on[a-z]+|formaction)$/; this.directive = function k(a, e) {
            xa(a, "directive"); x(a) ? (wb(e, "directiveFactory"), c.hasOwnProperty(a) || (c[a] = [], b.factory(a +
            d, ["$injector", "$exceptionHandler", function (b, d) { var e = []; r(c[a], function (c, f) { try { var h = b.invoke(c); D(h) ? h = { compile: Y(h) } : !h.compile && h.link && (h.compile = Y(h.link)); h.priority = h.priority || 0; h.index = f; h.name = h.name || a; h.require = h.require || h.controller && h.name; h.restrict = h.restrict || "A"; e.push(h) } catch (g) { d(g) } }); return e }])), c[a].push(e)) : r(a, Pb(k)); return this
        }; this.aHrefSanitizationWhitelist = function (b) { return u(b) ? (a.aHrefSanitizationWhitelist(b), this) : a.aHrefSanitizationWhitelist() }; this.imgSrcSanitizationWhitelist =
        function (b) { return u(b) ? (a.imgSrcSanitizationWhitelist(b), this) : a.imgSrcSanitizationWhitelist() }; this.$get = ["$injector", "$interpolate", "$exceptionHandler", "$http", "$templateCache", "$parse", "$controller", "$rootScope", "$document", "$sce", "$animate", "$$sanitizeUri", function (a, b, n, q, p, t, H, C, A, J, F, y) {
            function ba(a, b, c, d, e) {
                a instanceof w || (a = w(a)); r(a, function (b, c) { 3 == b.nodeType && b.nodeValue.match(/\S+/) && (a[c] = w(b).wrap("<span></span>").parent()[0]) }); var f = N(a, b, a, c, d, e); S(a, "ng-scope"); return function (b,
                c, d) { wb(b, "scope"); var e = c ? Ha.clone.call(a) : a; r(d, function (a, b) { e.data("$" + b + "Controller", a) }); d = 0; for (var h = e.length; d < h; d++) { var g = e[d].nodeType; 1 !== g && 9 !== g || e.eq(d).data("$scope", b) } c && c(e, b); f && f(b, e, e); return e }
            } function S(a, b) { try { a.addClass(b) } catch (c) { } } function N(a, b, c, d, e, f) {
                function h(a, c, d, e) {
                    var f, k, l, n, p, t, q; f = c.length; var ca = Array(f); for (p = 0; p < f; p++) ca[p] = c[p]; q = p = 0; for (t = g.length; p < t; q++) k = ca[q], c = g[p++], f = g[p++], l = w(k), c ? (c.scope ? (n = a.$new(), l.data("$scope", n)) : n = a, (l = c.transclude) ||
                    !e && b ? c(f, n, k, d, Z(a, l || b)) : c(f, n, k, d, e)) : f && f(a, k.childNodes, s, e)
                } for (var g = [], k, l, n, p, t = 0; t < a.length; t++) k = new Fb, l = U(a[t], [], k, 0 === t ? d : s, e), (f = l.length ? Wa(l, a[t], k, b, c, null, [], [], f) : null) && f.scope && S(w(a[t]), "ng-scope"), k = f && f.terminal || !(n = a[t].childNodes) || !n.length ? null : N(n, f ? f.transclude : b), g.push(f, k), p = p || f || k, f = null; return p ? h : null
            } function Z(a, b) { return function (c, d, e) { var f = !1; c || (c = a.$new(), f = c.$$transcluded = !0); d = b(c, d, e); if (f) d.on("$destroy", db(c, c.$destroy)); return d } } function U(a,
            b, c, d, h) {
                var g = c.$attr, k; switch (a.nodeType) {
                    case 1: u(b, ka(Ia(a).toLowerCase()), "E", d, h); var l, n, p; k = a.attributes; for (var t = 0, q = k && k.length; t < q; t++) { var H = !1, C = !1; l = k[t]; if (!P || 8 <= P || l.specified) { n = l.name; p = ka(n); la.test(p) && (n = eb(p.substr(6), "-")); var J = p.replace(/(Start|End)$/, ""); p === J + "Start" && (H = n, C = n.substr(0, n.length - 5) + "end", n = n.substr(0, n.length - 6)); p = ka(n.toLowerCase()); g[p] = n; c[p] = l = aa(l.value); kc(a, p) && (c[p] = !0); ga(a, b, l, p); u(b, p, "A", d, h, H, C) } } a = a.className; if (x(a) && "" !== a) for (; k = f.exec(a) ;) p =
                    ka(k[2]), u(b, p, "C", d, h) && (c[p] = aa(k[3])), a = a.substr(k.index + k[0].length); break; case 3: L(b, a.nodeValue); break; case 8: try { if (k = e.exec(a.nodeValue)) p = ka(k[1]), u(b, p, "M", d, h) && (c[p] = aa(k[2])) } catch (y) { }
                } b.sort(z); return b
            } function I(a, b, c) { var d = [], e = 0; if (b && a.hasAttribute && a.hasAttribute(b)) { do { if (!a) throw ha("uterdir", b, c); 1 == a.nodeType && (a.hasAttribute(b) && e++, a.hasAttribute(c) && e--); d.push(a); a = a.nextSibling } while (0 < e) } else d.push(a); return w(d) } function ya(a, b, c) {
                return function (d, e, f, h, g) {
                    e = I(e[0],
                    b, c); return a(d, e, f, h, g)
                }
            } function Wa(a, c, d, e, f, h, g, k, p) {
                function q(a, b, c, d) { if (a) { c && (a = ya(a, c, d)); a.require = G.require; if (N === G || G.$$isolateScope) a = nc(a, { isolateScope: !0 }); g.push(a) } if (b) { c && (b = ya(b, c, d)); b.require = G.require; if (N === G || G.$$isolateScope) b = nc(b, { isolateScope: !0 }); k.push(b) } } function C(a, b, c) {
                    var d, e = "data", f = !1; if (x(a)) {
                        for (; "^" == (d = a.charAt(0)) || "?" == d;) a = a.substr(1), "^" == d && (e = "inheritedData"), f = f || "?" == d; d = null; c && "data" === e && (d = c[a]); d = d || b[e]("$" + a + "Controller"); if (!d && !f) throw ha("ctreq",
                        a, ga);
                    } else M(a) && (d = [], r(a, function (a) { d.push(C(a, b, c)) })); return d
                } function J(a, e, f, h, p) {
                    function q(a, b) { var c; 2 > arguments.length && (b = a, a = s); Ja && (c = ya); return p(a, b, c) } var y, ca, A, I, ba, U, ya = {}, u; y = c === f ? d : Sb(d, new Fb(w(f), d.$attr)); ca = y.$$element; if (N) {
                        var oe = /^\s*([@=&])(\??)\s*(\w*)\s*$/; h = w(f); U = e.$new(!0); Z && Z === N.$$originalDirective ? h.data("$isolateScope", U) : h.data("$isolateScopeNoTemplate", U); S(h, "ng-isolate-scope"); r(N.scope, function (a, c) {
                            var d = a.match(oe) || [], f = d[3] || c, h = "?" == d[2], d = d[1],
                            g, k, p, n; U.$$isolateBindings[c] = d + f; switch (d) {
                                case "@": y.$observe(f, function (a) { U[c] = a }); y.$$observers[f].$$scope = e; y[f] && (U[c] = b(y[f])(e)); break; case "=": if (h && !y[f]) break; k = t(y[f]); n = k.literal ? ua : function (a, b) { return a === b }; p = k.assign || function () { g = U[c] = k(e); throw ha("nonassign", y[f], N.name); }; g = U[c] = k(e); U.$watch(function () { var a = k(e); n(a, U[c]) || (n(a, g) ? p(e, a = U[c]) : U[c] = a); return g = a }, null, k.literal); break; case "&": k = t(y[f]); U[c] = function (a) { return k(e, a) }; break; default: throw ha("iscp", N.name, c,
                                a);
                            }
                        })
                    } u = p && q; F && r(F, function (a) { var b = { $scope: a === N || a.$$isolateScope ? U : e, $element: ca, $attrs: y, $transclude: u }, c; ba = a.controller; "@" == ba && (ba = y[a.name]); c = H(ba, b); ya[a.name] = c; Ja || ca.data("$" + a.name + "Controller", c); a.controllerAs && (b.$scope[a.controllerAs] = c) }); h = 0; for (A = g.length; h < A; h++) try { I = g[h], I(I.isolateScope ? U : e, ca, y, I.require && C(I.require, ca, ya), u) } catch (v) { n(v, fa(ca)) } h = e; N && (N.template || null === N.templateUrl) && (h = U); a && a(h, f.childNodes, s, p); for (h = k.length - 1; 0 <= h; h--) try {
                        I = k[h], I(I.isolateScope ?
                            U : e, ca, y, I.require && C(I.require, ca, ya), u)
                    } catch (K) { n(K, fa(ca)) }
                } p = p || {}; for (var y = -Number.MAX_VALUE, A, F = p.controllerDirectives, N = p.newIsolateScopeDirective, Z = p.templateDirective, u = p.nonTlbTranscludeDirective, Wa = !1, Ja = p.hasElementTranscludeDirective, K = d.$$element = w(c), G, ga, v, z = e, L, la = 0, P = a.length; la < P; la++) {
                    G = a[la]; var R = G.$$start, V = G.$$end; R && (K = I(c, R, V)); v = s; if (y > G.priority) break; if (v = G.scope) A = A || G, G.templateUrl || (Q("new/isolated scope", N, G, K), W(v) && (N = G)); ga = G.name; !G.templateUrl && G.controller &&
                    (v = G.controller, F = F || {}, Q("'" + ga + "' controller", F[ga], G, K), F[ga] = G); if (v = G.transclude) Wa = !0, G.$$tlb || (Q("transclusion", u, G, K), u = G), "element" == v ? (Ja = !0, y = G.priority, v = I(c, R, V), K = d.$$element = w(T.createComment(" " + ga + ": " + d[ga] + " ")), c = K[0], lb(f, w(va.call(v, 0)), c), z = ba(v, e, y, h && h.name, { nonTlbTranscludeDirective: u })) : (v = w(Cb(c)).contents(), K.empty(), z = ba(v, e)); if (G.template) if (Q("template", Z, G, K), Z = G, v = D(G.template) ? G.template(K, d) : G.template, v = oc(v), G.replace) {
                        h = G; v = E(v); c = v[0]; if (1 != v.length || 1 !== c.nodeType) throw ha("tplrt",
                        ga, ""); lb(f, K, c); P = { $attr: {} }; v = U(c, [], P); var X = a.splice(la + 1, a.length - (la + 1)); N && kb(v); a = a.concat(v).concat(X); B(d, P); P = a.length
                    } else K.html(v); if (G.templateUrl) Q("template", Z, G, K), Z = G, G.replace && (h = G), J = O(a.splice(la, a.length - la), K, d, f, z, g, k, { controllerDirectives: F, newIsolateScopeDirective: N, templateDirective: Z, nonTlbTranscludeDirective: u }), P = a.length; else if (G.compile) try { L = G.compile(K, d, z), D(L) ? q(null, L, R, V) : L && q(L.pre, L.post, R, V) } catch (Y) { n(Y, fa(K)) } G.terminal && (J.terminal = !0, y = Math.max(y, G.priority))
                } J.scope =
                A && !0 === A.scope; J.transclude = Wa && z; p.hasElementTranscludeDirective = Ja; return J
            } function kb(a) { for (var b = 0, c = a.length; b < c; b++) a[b] = Rb(a[b], { $$isolateScope: !0 }) } function u(b, e, f, h, g, l, p) { if (e === g) return null; g = null; if (c.hasOwnProperty(e)) { var t; e = a.get(e + d); for (var q = 0, H = e.length; q < H; q++) try { t = e[q], (h === s || h > t.priority) && -1 != t.restrict.indexOf(f) && (l && (t = Rb(t, { $$start: l, $$end: p })), b.push(t), g = t) } catch (y) { n(y) } } return g } function B(a, b) {
                var c = b.$attr, d = a.$attr, e = a.$$element; r(a, function (d, e) {
                    "$" != e.charAt(0) &&
                    (b[e] && (d += ("style" === e ? ";" : " ") + b[e]), a.$set(e, d, !0, c[e]))
                }); r(b, function (b, f) { "class" == f ? (S(e, b), a["class"] = (a["class"] ? a["class"] + " " : "") + b) : "style" == f ? (e.attr("style", e.attr("style") + ";" + b), a.style = (a.style ? a.style + ";" : "") + b) : "$" == f.charAt(0) || a.hasOwnProperty(f) || (a[f] = b, d[f] = c[f]) })
            } function E(a) {
                var b; a = aa(a); if (b = g.exec(a)) { b = b[1].toLowerCase(); a = w("<table>" + a + "</table>"); if (/(thead|tbody|tfoot)/.test(b)) return a.children(b); a = a.children("tbody"); return "tr" === b ? a.children("tr") : a.children("tr").contents() } return w("<div>" +
                a + "</div>").contents()
            } function O(a, b, c, d, e, f, h, g) {
                var k = [], l, n, t = b[0], H = a.shift(), y = v({}, H, { templateUrl: null, transclude: null, replace: null, $$originalDirective: H }), C = D(H.templateUrl) ? H.templateUrl(b, c) : H.templateUrl; b.empty(); q.get(J.getTrustedResourceUrl(C), { cache: p }).success(function (p) {
                    var q, J; p = oc(p); if (H.replace) { p = E(p); q = p[0]; if (1 != p.length || 1 !== q.nodeType) throw ha("tplrt", H.name, C); p = { $attr: {} }; lb(d, b, q); var A = U(q, [], p); W(H.scope) && kb(A); a = A.concat(a); B(c, p) } else q = t, b.html(p); a.unshift(y);
                    l = Wa(a, q, c, e, b, H, f, h, g); r(d, function (a, c) { a == q && (d[c] = b[0]) }); for (n = N(b[0].childNodes, e) ; k.length;) { p = k.shift(); J = k.shift(); var I = k.shift(), F = k.shift(), A = b[0]; if (J !== t) { var ba = J.className; g.hasElementTranscludeDirective && H.replace || (A = Cb(q)); lb(I, w(J), A); S(w(A), ba) } J = l.transclude ? Z(p, l.transclude) : F; l(n, p, A, d, J) } k = null
                }).error(function (a, b, c, d) { throw ha("tpload", d.url); }); return function (a, b, c, d, e) { k ? (k.push(b), k.push(c), k.push(d), k.push(e)) : l(n, b, c, d, e) }
            } function z(a, b) {
                var c = b.priority - a.priority;
                return 0 !== c ? c : a.name !== b.name ? a.name < b.name ? -1 : 1 : a.index - b.index
            } function Q(a, b, c, d) { if (b) throw ha("multidir", b.name, c.name, a, fa(d)); } function L(a, c) { var d = b(c, !0); d && a.push({ priority: 0, compile: Y(function (a, b) { var c = b.parent(), e = c.data("$binding") || []; e.push(d); S(c.data("$binding", e), "ng-binding"); a.$watch(d, function (a) { b[0].nodeValue = a }) }) }) } function Ja(a, b) { if ("srcdoc" == b) return J.HTML; var c = Ia(a); if ("xlinkHref" == b || "FORM" == c && "action" == b || "IMG" != c && ("src" == b || "ngSrc" == b)) return J.RESOURCE_URL }
            function ga(a, c, d, e) { var f = b(d, !0); if (f) { if ("multiple" === e && "SELECT" === Ia(a)) throw ha("selmulti", fa(a)); c.push({ priority: 100, compile: function () { return { pre: function (c, d, g) { d = g.$$observers || (g.$$observers = {}); if (h.test(e)) throw ha("nodomevents"); if (f = b(g[e], !0, Ja(a, e))) g[e] = f(c), (d[e] || (d[e] = [])).$$inter = !0, (g.$$observers && g.$$observers[e].$$scope || c).$watch(f, function (a, b) { "class" === e && a != b ? g.$updateClass(a, b) : g.$set(e, a) }) } } } }) } } function lb(a, b, c) {
                var d = b[0], e = b.length, f = d.parentNode, h, g; if (a) for (h =
                0, g = a.length; h < g; h++) if (a[h] == d) { a[h++] = c; g = h + e - 1; for (var k = a.length; h < k; h++, g++) g < k ? a[h] = a[g] : delete a[h]; a.length -= e - 1; break } f && f.replaceChild(c, d); a = T.createDocumentFragment(); a.appendChild(d); c[w.expando] = d[w.expando]; d = 1; for (e = b.length; d < e; d++) f = b[d], w(f).remove(), a.appendChild(f), delete b[d]; b[0] = c; b.length = 1
            } function nc(a, b) { return v(function () { return a.apply(null, arguments) }, a, b) } var Fb = function (a, b) { this.$$element = a; this.$attr = b || {} }; Fb.prototype = {
                $normalize: ka, $addClass: function (a) {
                    a && 0 <
                    a.length && F.addClass(this.$$element, a)
                }, $removeClass: function (a) { a && 0 < a.length && F.removeClass(this.$$element, a) }, $updateClass: function (a, b) { var c = pc(a, b), d = pc(b, a); 0 === c.length ? F.removeClass(this.$$element, d) : 0 === d.length ? F.addClass(this.$$element, c) : F.setClass(this.$$element, c, d) }, $set: function (a, b, c, d) {
                    var e = kc(this.$$element[0], a); e && (this.$$element.prop(a, b), d = e); this[a] = b; d ? this.$attr[a] = d : (d = this.$attr[a]) || (this.$attr[a] = d = eb(a, "-")); e = Ia(this.$$element); if ("A" === e && "href" === a || "IMG" === e &&
                    "src" === a) this[a] = b = y(b, "src" === a); !1 !== c && (null === b || b === s ? this.$$element.removeAttr(d) : this.$$element.attr(d, b)); (c = this.$$observers) && r(c[a], function (a) { try { a(b) } catch (c) { n(c) } })
                }, $observe: function (a, b) { var c = this, d = c.$$observers || (c.$$observers = {}), e = d[a] || (d[a] = []); e.push(b); C.$evalAsync(function () { e.$$inter || b(c[a]) }); return b }
            }; var R = b.startSymbol(), V = b.endSymbol(), oc = "{{" == R || "}}" == V ? Ba : function (a) { return a.replace(/\{\{/g, R).replace(/}}/g, V) }, la = /^ngAttr[A-Z]/; return ba
        }]
    } function ka(b) {
        return Sa(b.replace(pe,
        ""))
    } function pc(b, a) { var c = "", d = b.split(/\s+/), e = a.split(/\s+/), f = 0; a: for (; f < d.length; f++) { for (var g = d[f], h = 0; h < e.length; h++) if (g == e[h]) continue a; c += (0 < c.length ? " " : "") + g } return c } function Md() {
        var b = {}, a = /^(\S+)(\s+as\s+(\w+))?$/; this.register = function (a, d) { xa(a, "controller"); W(a) ? v(b, a) : b[a] = d }; this.$get = ["$injector", "$window", function (c, d) {
            return function (e, f) {
                var g, h, m; x(e) && (g = e.match(a), h = g[1], m = g[3], e = b.hasOwnProperty(h) ? b[h] : $b(f.$scope, h, !0) || $b(d, h, !0), Qa(e, h, !0)); g = c.instantiate(e, f);
                if (m) { if (!f || "object" != typeof f.$scope) throw z("$controller")("noscp", h || e.name, m); f.$scope[m] = g } return g
            }
        }]
    } function Nd() { this.$get = ["$window", function (b) { return w(b.document) }] } function Od() { this.$get = ["$log", function (b) { return function (a, c) { b.error.apply(b, arguments) } }] } function qc(b) { var a = {}, c, d, e; if (!b) return a; r(b.split("\n"), function (b) { e = b.indexOf(":"); c = O(aa(b.substr(0, e))); d = aa(b.substr(e + 1)); c && (a[c] = a[c] ? a[c] + (", " + d) : d) }); return a } function rc(b) {
        var a = W(b) ? b : s; return function (c) {
            a ||
            (a = qc(b)); return c ? a[O(c)] || null : a
        }
    } function sc(b, a, c) { if (D(c)) return c(b, a); r(c, function (c) { b = c(b, a) }); return b } function Rd() {
        var b = /^\s*(\[|\{[^\{])/, a = /[\}\]]\s*$/, c = /^\)\]\}',?\n/, d = { "Content-Type": "application/json;charset=utf-8" }, e = this.defaults = {
            transformResponse: [function (d) { x(d) && (d = d.replace(c, ""), b.test(d) && a.test(d) && (d = Ub(d))); return d }], transformRequest: [function (a) { return W(a) && "[object File]" !== ta.call(a) && "[object Blob]" !== ta.call(a) ? oa(a) : a }], headers: {
                common: { Accept: "application/json, text/plain, */*" },
                post: $(d), put: $(d), patch: $(d)
            }, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN"
        }, f = this.interceptors = [], g = this.responseInterceptors = []; this.$get = ["$httpBackend", "$browser", "$cacheFactory", "$rootScope", "$q", "$injector", function (a, b, c, d, n, q) {
            function p(a) {
                function c(a) { var b = v({}, a, { data: sc(a.data, a.headers, d.transformResponse) }); return 200 <= a.status && 300 > a.status ? b : n.reject(b) } var d = { method: "get", transformRequest: e.transformRequest, transformResponse: e.transformResponse }, f = function (a) {
                    function b(a) {
                        var c;
                        r(a, function (b, d) { D(b) && (c = b(), null != c ? a[d] = c : delete a[d]) })
                    } var c = e.headers, d = v({}, a.headers), f, h, c = v({}, c.common, c[O(a.method)]); b(c); b(d); a: for (f in c) { a = O(f); for (h in d) if (O(h) === a) continue a; d[f] = c[f] } return d
                }(a); v(d, a); d.headers = f; d.method = Da(d.method); (a = Gb(d.url) ? b.cookies()[d.xsrfCookieName || e.xsrfCookieName] : s) && (f[d.xsrfHeaderName || e.xsrfHeaderName] = a); var h = [function (a) {
                    f = a.headers; var b = sc(a.data, rc(f), a.transformRequest); E(a.data) && r(f, function (a, b) { "content-type" === O(b) && delete f[b] });
                    E(a.withCredentials) && !E(e.withCredentials) && (a.withCredentials = e.withCredentials); return t(a, b, f).then(c, c)
                }, s], g = n.when(d); for (r(A, function (a) { (a.request || a.requestError) && h.unshift(a.request, a.requestError); (a.response || a.responseError) && h.push(a.response, a.responseError) }) ; h.length;) { a = h.shift(); var k = h.shift(), g = g.then(a, k) } g.success = function (a) { g.then(function (b) { a(b.data, b.status, b.headers, d) }); return g }; g.error = function (a) { g.then(null, function (b) { a(b.data, b.status, b.headers, d) }); return g };
                return g
            } function t(b, c, f) {
                function g(a, b, c) { A && (200 <= a && 300 > a ? A.put(s, [a, b, qc(c)]) : A.remove(s)); k(b, a, c); d.$$phase || d.$apply() } function k(a, c, d) { c = Math.max(c, 0); (200 <= c && 300 > c ? t.resolve : t.reject)({ data: a, status: c, headers: rc(d), config: b }) } function m() { var a = cb(p.pendingRequests, b); -1 !== a && p.pendingRequests.splice(a, 1) } var t = n.defer(), q = t.promise, A, r, s = H(b.url, b.params); p.pendingRequests.push(b); q.then(m, m); (b.cache || e.cache) && (!1 !== b.cache && "GET" == b.method) && (A = W(b.cache) ? b.cache : W(e.cache) ? e.cache :
                C); if (A) if (r = A.get(s), u(r)) { if (r.then) return r.then(m, m), r; M(r) ? k(r[1], r[0], $(r[2])) : k(r, 200, {}) } else A.put(s, q); E(r) && a(b.method, s, c, g, f, b.timeout, b.withCredentials, b.responseType); return q
            } function H(a, b) { if (!b) return a; var c = []; Qc(b, function (a, b) { null === a || E(a) || (M(a) || (a = [a]), r(a, function (a) { W(a) && (a = oa(a)); c.push(wa(b) + "=" + wa(a)) })) }); 0 < c.length && (a += (-1 == a.indexOf("?") ? "?" : "&") + c.join("&")); return a } var C = c("$http"), A = []; r(f, function (a) { A.unshift(x(a) ? q.get(a) : q.invoke(a)) }); r(g, function (a,
            b) { var c = x(a) ? q.get(a) : q.invoke(a); A.splice(b, 0, { response: function (a) { return c(n.when(a)) }, responseError: function (a) { return c(n.reject(a)) } }) }); p.pendingRequests = []; (function (a) { r(arguments, function (a) { p[a] = function (b, c) { return p(v(c || {}, { method: a, url: b })) } }) })("get", "delete", "head", "jsonp"); (function (a) { r(arguments, function (a) { p[a] = function (b, c, d) { return p(v(d || {}, { method: a, url: b, data: c })) } }) })("post", "put"); p.defaults = e; return p
        }]
    } function qe(b) {
        if (8 >= P && (!b.match(/^(get|post|head|put|delete|options)$/i) ||
        !Q.XMLHttpRequest)) return new Q.ActiveXObject("Microsoft.XMLHTTP"); if (Q.XMLHttpRequest) return new Q.XMLHttpRequest; throw z("$httpBackend")("noxhr");
    } function Sd() { this.$get = ["$browser", "$window", "$document", function (b, a, c) { return re(b, qe, b.defer, a.angular.callbacks, c[0]) }] } function re(b, a, c, d, e) {
        function f(a, b) {
            var c = e.createElement("script"), d = function () { c.onreadystatechange = c.onload = c.onerror = null; e.body.removeChild(c); b && b() }; c.type = "text/javascript"; c.src = a; P && 8 >= P ? c.onreadystatechange = function () {
                /loaded|complete/.test(c.readyState) &&
                d()
            } : c.onload = c.onerror = function () { d() }; e.body.appendChild(c); return d
        } var g = -1; return function (e, m, k, l, n, q, p, t) {
            function H() { A = g; F && F(); y && y.abort() } function C(a, d, e, f) { S && c.cancel(S); F = y = null; 0 === d && (d = e ? 200 : "file" == pa(m).protocol ? 404 : 0); a(1223 == d ? 204 : d, e, f); b.$$completeOutstandingRequest(B) } var A; b.$$incOutstandingRequestCount(); m = m || b.url(); if ("jsonp" == O(e)) {
                var J = "_" + (d.counter++).toString(36); d[J] = function (a) { d[J].data = a }; var F = f(m.replace("JSON_CALLBACK", "angular.callbacks." + J), function () {
                    d[J].data ?
                    C(l, 200, d[J].data) : C(l, A || -2); d[J] = Ca.noop
                })
            } else { var y = a(e); y.open(e, m, !0); r(n, function (a, b) { u(a) && y.setRequestHeader(b, a) }); y.onreadystatechange = function () { if (y && 4 == y.readyState) { var a = null, b = null; A !== g && (a = y.getAllResponseHeaders(), b = "response" in y ? y.response : y.responseText); C(l, A || y.status, b, a) } }; p && (y.withCredentials = !0); if (t) try { y.responseType = t } catch (s) { if ("json" !== t) throw s; } y.send(k || null) } if (0 < q) var S = c(H, q); else q && q.then && q.then(H)
        }
    } function Pd() {
        var b = "{{", a = "}}"; this.startSymbol = function (a) {
            return a ?
            (b = a, this) : b
        }; this.endSymbol = function (b) { return b ? (a = b, this) : a }; this.$get = ["$parse", "$exceptionHandler", "$sce", function (c, d, e) {
            function f(f, k, l) {
                for (var n, q, p = 0, t = [], H = f.length, C = !1, A = []; p < H;) -1 != (n = f.indexOf(b, p)) && -1 != (q = f.indexOf(a, n + g)) ? (p != n && t.push(f.substring(p, n)), t.push(p = c(C = f.substring(n + g, q))), p.exp = C, p = q + h, C = !0) : (p != H && t.push(f.substring(p)), p = H); (H = t.length) || (t.push(""), H = 1); if (l && 1 < t.length) throw tc("noconcat", f); if (!k || C) return A.length = H, p = function (a) {
                    try {
                        for (var b = 0, c = H, h; b < c; b++) "function" ==
                        typeof (h = t[b]) && (h = h(a), h = l ? e.getTrusted(l, h) : e.valueOf(h), null === h || E(h) ? h = "" : "string" != typeof h && (h = oa(h))), A[b] = h; return A.join("")
                    } catch (g) { a = tc("interr", f, g.toString()), d(a) }
                }, p.exp = f, p.parts = t, p
            } var g = b.length, h = a.length; f.startSymbol = function () { return b }; f.endSymbol = function () { return a }; return f
        }]
    } function Qd() {
        this.$get = ["$rootScope", "$window", "$q", function (b, a, c) {
            function d(d, g, h, m) {
                var k = a.setInterval, l = a.clearInterval, n = c.defer(), q = n.promise, p = 0, t = u(m) && !m; h = u(h) ? h : 0; q.then(null, null, d);
                q.$$intervalId = k(function () { n.notify(p++); 0 < h && p >= h && (n.resolve(p), l(q.$$intervalId), delete e[q.$$intervalId]); t || b.$apply() }, g); e[q.$$intervalId] = n; return q
            } var e = {}; d.cancel = function (a) { return a && a.$$intervalId in e ? (e[a.$$intervalId].reject("canceled"), clearInterval(a.$$intervalId), delete e[a.$$intervalId], !0) : !1 }; return d
        }]
    } function Zc() {
        this.$get = function () {
            return {
                id: "en-us", NUMBER_FORMATS: {
                    DECIMAL_SEP: ".", GROUP_SEP: ",", PATTERNS: [{
                        minInt: 1, minFrac: 0, maxFrac: 3, posPre: "", posSuf: "", negPre: "-", negSuf: "",
                        gSize: 3, lgSize: 3
                    }, { minInt: 1, minFrac: 2, maxFrac: 2, posPre: "\u00a4", posSuf: "", negPre: "(\u00a4", negSuf: ")", gSize: 3, lgSize: 3 }], CURRENCY_SYM: "$"
                }, DATETIME_FORMATS: {
                    MONTH: "January February March April May June July August September October November December".split(" "), SHORTMONTH: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), DAY: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTDAY: "Sun Mon Tue Wed Thu Fri Sat".split(" "), AMPMS: ["AM", "PM"], medium: "MMM d, y h:mm:ss a",
                    "short": "M/d/yy h:mm a", fullDate: "EEEE, MMMM d, y", longDate: "MMMM d, y", mediumDate: "MMM d, y", shortDate: "M/d/yy", mediumTime: "h:mm:ss a", shortTime: "h:mm a"
                }, pluralCat: function (b) { return 1 === b ? "one" : "other" }
            }
        }
    } function uc(b) { b = b.split("/"); for (var a = b.length; a--;) b[a] = vb(b[a]); return b.join("/") } function vc(b, a, c) { b = pa(b, c); a.$$protocol = b.protocol; a.$$host = b.hostname; a.$$port = R(b.port) || se[b.protocol] || null } function wc(b, a, c) {
        var d = "/" !== b.charAt(0); d && (b = "/" + b); b = pa(b, c); a.$$path = decodeURIComponent(d &&
        "/" === b.pathname.charAt(0) ? b.pathname.substring(1) : b.pathname); a.$$search = Wb(b.search); a.$$hash = decodeURIComponent(b.hash); a.$$path && "/" != a.$$path.charAt(0) && (a.$$path = "/" + a.$$path)
    } function ma(b, a) { if (0 === a.indexOf(b)) return a.substr(b.length) } function Xa(b) { var a = b.indexOf("#"); return -1 == a ? b : b.substr(0, a) } function Hb(b) { return b.substr(0, Xa(b).lastIndexOf("/") + 1) } function xc(b, a) {
        this.$$html5 = !0; a = a || ""; var c = Hb(b); vc(b, this, b); this.$$parse = function (a) {
            var e = ma(c, a); if (!x(e)) throw Ib("ipthprfx",
            a, c); wc(e, this, b); this.$$path || (this.$$path = "/"); this.$$compose()
        }; this.$$compose = function () { var a = Xb(this.$$search), b = this.$$hash ? "#" + vb(this.$$hash) : ""; this.$$url = uc(this.$$path) + (a ? "?" + a : "") + b; this.$$absUrl = c + this.$$url.substr(1) }; this.$$rewrite = function (d) { var e; if ((e = ma(b, d)) !== s) return d = e, (e = ma(a, e)) !== s ? c + (ma("/", e) || e) : b + d; if ((e = ma(c, d)) !== s) return c + e; if (c == d + "/") return c }
    } function Jb(b, a) {
        var c = Hb(b); vc(b, this, b); this.$$parse = function (d) {
            var e = ma(b, d) || ma(c, d), e = "#" == e.charAt(0) ? ma(a, e) :
            this.$$html5 ? e : ""; if (!x(e)) throw Ib("ihshprfx", d, a); wc(e, this, b); d = this.$$path; var f = /^\/?.*?:(\/.*)/; 0 === e.indexOf(b) && (e = e.replace(b, "")); f.exec(e) || (d = (e = f.exec(d)) ? e[1] : d); this.$$path = d; this.$$compose()
        }; this.$$compose = function () { var c = Xb(this.$$search), e = this.$$hash ? "#" + vb(this.$$hash) : ""; this.$$url = uc(this.$$path) + (c ? "?" + c : "") + e; this.$$absUrl = b + (this.$$url ? a + this.$$url : "") }; this.$$rewrite = function (a) { if (Xa(b) == Xa(a)) return a }
    } function yc(b, a) {
        this.$$html5 = !0; Jb.apply(this, arguments); var c = Hb(b);
        this.$$rewrite = function (d) { var e; if (b == Xa(d)) return d; if (e = ma(c, d)) return b + a + e; if (c === d + "/") return c }
    } function mb(b) { return function () { return this[b] } } function zc(b, a) { return function (c) { if (E(c)) return this[b]; this[b] = a(c); this.$$compose(); return this } } function Td() {
        var b = "", a = !1; this.hashPrefix = function (a) { return u(a) ? (b = a, this) : b }; this.html5Mode = function (b) { return u(b) ? (a = b, this) : a }; this.$get = ["$rootScope", "$browser", "$sniffer", "$rootElement", function (c, d, e, f) {
            function g(a) {
                c.$broadcast("$locationChangeSuccess",
                h.absUrl(), a)
            } var h, m = d.baseHref(), k = d.url(); a ? (m = k.substring(0, k.indexOf("/", k.indexOf("//") + 2)) + (m || "/"), e = e.history ? xc : yc) : (m = Xa(k), e = Jb); h = new e(m, "#" + b); h.$$parse(h.$$rewrite(k)); f.on("click", function (a) {
                if (!a.ctrlKey && !a.metaKey && 2 != a.which) {
                    for (var b = w(a.target) ; "a" !== O(b[0].nodeName) ;) if (b[0] === f[0] || !(b = b.parent())[0]) return; var e = b.prop("href"); W(e) && "[object SVGAnimatedString]" === e.toString() && (e = pa(e.animVal).href); var g = h.$$rewrite(e); e && (!b.attr("target") && g && !a.isDefaultPrevented()) &&
                    (a.preventDefault(), g != d.url() && (h.$$parse(g), c.$apply(), Q.angular["ff-684208-preventDefault"] = !0))
                }
            }); h.absUrl() != k && d.url(h.absUrl(), !0); d.onUrlChange(function (a) { h.absUrl() != a && (c.$evalAsync(function () { var b = h.absUrl(); h.$$parse(a); c.$broadcast("$locationChangeStart", a, b).defaultPrevented ? (h.$$parse(b), d.url(b)) : g(b) }), c.$$phase || c.$digest()) }); var l = 0; c.$watch(function () {
                var a = d.url(), b = h.$$replace; l && a == h.absUrl() || (l++, c.$evalAsync(function () {
                    c.$broadcast("$locationChangeStart", h.absUrl(), a).defaultPrevented ?
                    h.$$parse(a) : (d.url(h.absUrl(), b), g(a))
                })); h.$$replace = !1; return l
            }); return h
        }]
    } function Ud() {
        var b = !0, a = this; this.debugEnabled = function (a) { return u(a) ? (b = a, this) : b }; this.$get = ["$window", function (c) {
            function d(a) { a instanceof Error && (a.stack ? a = a.message && -1 === a.stack.indexOf(a.message) ? "Error: " + a.message + "\n" + a.stack : a.stack : a.sourceURL && (a = a.message + "\n" + a.sourceURL + ":" + a.line)); return a } function e(a) {
                var b = c.console || {}, e = b[a] || b.log || B; a = !1; try { a = !!e.apply } catch (m) { } return a ? function () {
                    var a =
                    []; r(arguments, function (b) { a.push(d(b)) }); return e.apply(b, a)
                } : function (a, b) { e(a, null == b ? "" : b) }
            } return { log: e("log"), info: e("info"), warn: e("warn"), error: e("error"), debug: function () { var c = e("debug"); return function () { b && c.apply(a, arguments) } }() }
        }]
    } function da(b, a) { if ("constructor" === b) throw za("isecfld", a); return b } function Ya(b, a) {
        if (b) {
            if (b.constructor === b) throw za("isecfn", a); if (b.document && b.location && b.alert && b.setInterval) throw za("isecwindow", a); if (b.children && (b.nodeName || b.prop && b.attr && b.find)) throw za("isecdom",
            a);
        } return b
    } function nb(b, a, c, d, e) { e = e || {}; a = a.split("."); for (var f, g = 0; 1 < a.length; g++) { f = da(a.shift(), d); var h = b[f]; h || (h = {}, b[f] = h); b = h; b.then && e.unwrapPromises && (qa(d), "$$v" in b || function (a) { a.then(function (b) { a.$$v = b }) }(b), b.$$v === s && (b.$$v = {}), b = b.$$v) } f = da(a.shift(), d); return b[f] = c } function Ac(b, a, c, d, e, f, g) {
        da(b, f); da(a, f); da(c, f); da(d, f); da(e, f); return g.unwrapPromises ? function (h, g) {
            var k = g && g.hasOwnProperty(b) ? g : h, l; if (null == k) return k; (k = k[b]) && k.then && (qa(f), "$$v" in k || (l = k, l.$$v = s, l.then(function (a) {
                l.$$v =
                a
            })), k = k.$$v); if (!a) return k; if (null == k) return s; (k = k[a]) && k.then && (qa(f), "$$v" in k || (l = k, l.$$v = s, l.then(function (a) { l.$$v = a })), k = k.$$v); if (!c) return k; if (null == k) return s; (k = k[c]) && k.then && (qa(f), "$$v" in k || (l = k, l.$$v = s, l.then(function (a) { l.$$v = a })), k = k.$$v); if (!d) return k; if (null == k) return s; (k = k[d]) && k.then && (qa(f), "$$v" in k || (l = k, l.$$v = s, l.then(function (a) { l.$$v = a })), k = k.$$v); if (!e) return k; if (null == k) return s; (k = k[e]) && k.then && (qa(f), "$$v" in k || (l = k, l.$$v = s, l.then(function (a) { l.$$v = a })), k = k.$$v);
            return k
        } : function (f, g) { var k = g && g.hasOwnProperty(b) ? g : f; if (null == k) return k; k = k[b]; if (!a) return k; if (null == k) return s; k = k[a]; if (!c) return k; if (null == k) return s; k = k[c]; if (!d) return k; if (null == k) return s; k = k[d]; return e ? null == k ? s : k = k[e] : k }
    } function te(b, a) { da(b, a); return function (a, d) { return null == a ? s : (d && d.hasOwnProperty(b) ? d : a)[b] } } function ue(b, a, c) { da(b, c); da(a, c); return function (c, e) { if (null == c) return s; c = (e && e.hasOwnProperty(b) ? e : c)[b]; return null == c ? s : c[a] } } function Bc(b, a, c) {
        if (Kb.hasOwnProperty(b)) return Kb[b];
        var d = b.split("."), e = d.length, f; if (a.unwrapPromises || 1 !== e) if (a.unwrapPromises || 2 !== e) if (a.csp) f = 6 > e ? Ac(d[0], d[1], d[2], d[3], d[4], c, a) : function (b, f) { var h = 0, g; do g = Ac(d[h++], d[h++], d[h++], d[h++], d[h++], c, a)(b, f), f = s, b = g; while (h < e); return g }; else {
            var g = "var p;\n"; r(d, function (b, d) {
                da(b, c); g += "if(s == null) return undefined;\ns=" + (d ? "s" : '((k&&k.hasOwnProperty("' + b + '"))?k:s)') + '["' + b + '"];\n' + (a.unwrapPromises ? 'if (s && s.then) {\n pw("' + c.replace(/(["\r\n])/g, "\\$1") + '");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n' :
                "")
            }); var g = g + "return s;", h = new Function("s", "k", "pw", g); h.toString = Y(g); f = a.unwrapPromises ? function (a, b) { return h(a, b, qa) } : h
        } else f = ue(d[0], d[1], c); else f = te(d[0], c); "hasOwnProperty" !== b && (Kb[b] = f); return f
    } function Vd() {
        var b = {}, a = { csp: !1, unwrapPromises: !1, logPromiseWarnings: !0 }; this.unwrapPromises = function (b) { return u(b) ? (a.unwrapPromises = !!b, this) : a.unwrapPromises }; this.logPromiseWarnings = function (b) { return u(b) ? (a.logPromiseWarnings = b, this) : a.logPromiseWarnings }; this.$get = ["$filter", "$sniffer",
        "$log", function (c, d, e) { a.csp = d.csp; qa = function (b) { a.logPromiseWarnings && !Cc.hasOwnProperty(b) && (Cc[b] = !0, e.warn("[$parse] Promise found in the expression `" + b + "`. Automatic unwrapping of promises in Angular expressions is deprecated.")) }; return function (d) { var e; switch (typeof d) { case "string": if (b.hasOwnProperty(d)) return b[d]; e = new Lb(a); e = (new Za(e, c, a)).parse(d, !1); "hasOwnProperty" !== d && (b[d] = e); return e; case "function": return d; default: return B } } }]
    } function Xd() {
        this.$get = ["$rootScope", "$exceptionHandler",
        function (b, a) { return ve(function (a) { b.$evalAsync(a) }, a) }]
    } function ve(b, a) {
        function c(a) { return a } function d(a) { return g(a) } var e = function () {
            var g = [], k, l; return l = {
                resolve: function (a) { if (g) { var c = g; g = s; k = f(a); c.length && b(function () { for (var a, b = 0, d = c.length; b < d; b++) a = c[b], k.then(a[0], a[1], a[2]) }) } }, reject: function (a) { l.resolve(h(a)) }, notify: function (a) { if (g) { var c = g; g.length && b(function () { for (var b, d = 0, e = c.length; d < e; d++) b = c[d], b[2](a) }) } }, promise: {
                    then: function (b, f, h) {
                        var l = e(), H = function (d) {
                            try {
                                l.resolve((D(b) ?
                                    b : c)(d))
                            } catch (e) { l.reject(e), a(e) }
                        }, C = function (b) { try { l.resolve((D(f) ? f : d)(b)) } catch (c) { l.reject(c), a(c) } }, A = function (b) { try { l.notify((D(h) ? h : c)(b)) } catch (d) { a(d) } }; g ? g.push([H, C, A]) : k.then(H, C, A); return l.promise
                    }, "catch": function (a) { return this.then(null, a) }, "finally": function (a) {
                        function b(a, c) { var d = e(); c ? d.resolve(a) : d.reject(a); return d.promise } function d(e, f) {
                            var h = null; try { h = (a || c)() } catch (g) { return b(g, !1) } return h && D(h.then) ? h.then(function () { return b(e, f) }, function (a) { return b(a, !1) }) :
                            b(e, f)
                        } return this.then(function (a) { return d(a, !0) }, function (a) { return d(a, !1) })
                    }
                }
            }
        }, f = function (a) { return a && D(a.then) ? a : { then: function (c) { var d = e(); b(function () { d.resolve(c(a)) }); return d.promise } } }, g = function (a) { var b = e(); b.reject(a); return b.promise }, h = function (c) { return { then: function (f, h) { var g = e(); b(function () { try { g.resolve((D(h) ? h : d)(c)) } catch (b) { g.reject(b), a(b) } }); return g.promise } } }; return {
            defer: e, reject: g, when: function (h, k, l, n) {
                var q = e(), p, t = function (b) {
                    try { return (D(k) ? k : c)(b) } catch (d) {
                        return a(d),
                        g(d)
                    }
                }, H = function (b) { try { return (D(l) ? l : d)(b) } catch (c) { return a(c), g(c) } }, C = function (b) { try { return (D(n) ? n : c)(b) } catch (d) { a(d) } }; b(function () { f(h).then(function (a) { p || (p = !0, q.resolve(f(a).then(t, H, C))) }, function (a) { p || (p = !0, q.resolve(H(a))) }, function (a) { p || q.notify(C(a)) }) }); return q.promise
            }, all: function (a) { var b = e(), c = 0, d = M(a) ? [] : {}; r(a, function (a, e) { c++; f(a).then(function (a) { d.hasOwnProperty(e) || (d[e] = a, --c || b.resolve(d)) }, function (a) { d.hasOwnProperty(e) || b.reject(a) }) }); 0 === c && b.resolve(d); return b.promise }
        }
    }
    function de() { this.$get = ["$window", "$timeout", function (b, a) { var c = b.requestAnimationFrame || b.webkitRequestAnimationFrame || b.mozRequestAnimationFrame, d = b.cancelAnimationFrame || b.webkitCancelAnimationFrame || b.mozCancelAnimationFrame || b.webkitCancelRequestAnimationFrame, e = !!c, f = e ? function (a) { var b = c(a); return function () { d(b) } } : function (b) { var c = a(b, 16.66, !1); return function () { a.cancel(c) } }; f.supported = e; return f }] } function Wd() {
        var b = 10, a = z("$rootScope"), c = null; this.digestTtl = function (a) {
            arguments.length &&
            (b = a); return b
        }; this.$get = ["$injector", "$exceptionHandler", "$parse", "$browser", function (d, e, f, g) {
            function h() { this.$id = ab(); this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null; this["this"] = this.$root = this; this.$$destroyed = !1; this.$$asyncQueue = []; this.$$postDigestQueue = []; this.$$listeners = {}; this.$$listenerCount = {}; this.$$isolateBindings = {} } function m(b) { if (q.$$phase) throw a("inprog", q.$$phase); q.$$phase = b } function k(a, b) {
                var c = f(a);
                Qa(c, b); return c
            } function l(a, b, c) { do a.$$listenerCount[c] -= b, 0 === a.$$listenerCount[c] && delete a.$$listenerCount[c]; while (a = a.$parent) } function n() { } h.prototype = {
                constructor: h, $new: function (a) {
                    a ? (a = new h, a.$root = this.$root, a.$$asyncQueue = this.$$asyncQueue, a.$$postDigestQueue = this.$$postDigestQueue) : (a = function () { }, a.prototype = this, a = new a, a.$id = ab()); a["this"] = a; a.$$listeners = {}; a.$$listenerCount = {}; a.$parent = this; a.$$watchers = a.$$nextSibling = a.$$childHead = a.$$childTail = null; a.$$prevSibling = this.$$childTail;
                    this.$$childHead ? this.$$childTail = this.$$childTail.$$nextSibling = a : this.$$childHead = this.$$childTail = a; return a
                }, $watch: function (a, b, d) { var e = k(a, "watch"), f = this.$$watchers, h = { fn: b, last: n, get: e, exp: a, eq: !!d }; c = null; if (!D(b)) { var g = k(b || B, "listener"); h.fn = function (a, b, c) { g(c) } } if ("string" == typeof a && e.constant) { var m = h.fn; h.fn = function (a, b, c) { m.call(this, a, b, c); Na(f, h) } } f || (f = this.$$watchers = []); f.unshift(h); return function () { Na(f, h); c = null } }, $watchCollection: function (a, b) {
                    var c = this, d, e, h, g = 1 < b.length,
                    k = 0, m = f(a), l = [], n = {}, q = !0, r = 0; return this.$watch(function () { d = m(c); var a, b; if (W(d)) if ($a(d)) for (e !== l && (e = l, r = e.length = 0, k++), a = d.length, r !== a && (k++, e.length = r = a), b = 0; b < a; b++) e[b] !== e[b] && d[b] !== d[b] || e[b] === d[b] || (k++, e[b] = d[b]); else { e !== n && (e = n = {}, r = 0, k++); a = 0; for (b in d) d.hasOwnProperty(b) && (a++, e.hasOwnProperty(b) ? e[b] !== d[b] && (k++, e[b] = d[b]) : (r++, e[b] = d[b], k++)); if (r > a) for (b in k++, e) e.hasOwnProperty(b) && !d.hasOwnProperty(b) && (r--, delete e[b]) } else e !== d && (e = d, k++); return k }, function () {
                        q ? (q =
                        !1, b(d, d, c)) : b(d, h, c); if (g) if (W(d)) if ($a(d)) { h = Array(d.length); for (var a = 0; a < d.length; a++) h[a] = d[a] } else for (a in h = {}, d) Dc.call(d, a) && (h[a] = d[a]); else h = d
                    })
                }, $digest: function () {
                    var d, f, h, g, k = this.$$asyncQueue, l = this.$$postDigestQueue, r, y, s = b, S, N = [], u, v, I; m("$digest"); c = null; do {
                        y = !1; for (S = this; k.length;) { try { I = k.shift(), I.scope.$eval(I.expression) } catch (w) { q.$$phase = null, e(w) } c = null }a: do {
                            if (g = S.$$watchers) for (r = g.length; r--;) try {
                                if (d = g[r]) if ((f = d.get(S)) !== (h = d.last) && !(d.eq ? ua(f, h) : "number" == typeof f &&
                                "number" == typeof h && isNaN(f) && isNaN(h))) y = !0, c = d, d.last = d.eq ? $(f) : f, d.fn(f, h === n ? f : h, S), 5 > s && (u = 4 - s, N[u] || (N[u] = []), v = D(d.exp) ? "fn: " + (d.exp.name || d.exp.toString()) : d.exp, v += "; newVal: " + oa(f) + "; oldVal: " + oa(h), N[u].push(v)); else if (d === c) { y = !1; break a }
                            } catch (x) { q.$$phase = null, e(x) } if (!(g = S.$$childHead || S !== this && S.$$nextSibling)) for (; S !== this && !(g = S.$$nextSibling) ;) S = S.$parent
                        } while (S = g); if ((y || k.length) && !s--) throw q.$$phase = null, a("infdig", b, oa(N));
                    } while (y || k.length); for (q.$$phase = null; l.length;) try { l.shift()() } catch (B) { e(B) }
                },
                $destroy: function () {
                    if (!this.$$destroyed) {
                        var a = this.$parent; this.$broadcast("$destroy"); this.$$destroyed = !0; this !== q && (r(this.$$listenerCount, db(null, l, this)), a.$$childHead == this && (a.$$childHead = this.$$nextSibling), a.$$childTail == this && (a.$$childTail = this.$$prevSibling), this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling), this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling), this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail =
                        null)
                    }
                }, $eval: function (a, b) { return f(a)(this, b) }, $evalAsync: function (a) { q.$$phase || q.$$asyncQueue.length || g.defer(function () { q.$$asyncQueue.length && q.$digest() }); this.$$asyncQueue.push({ scope: this, expression: a }) }, $$postDigest: function (a) { this.$$postDigestQueue.push(a) }, $apply: function (a) { try { return m("$apply"), this.$eval(a) } catch (b) { e(b) } finally { q.$$phase = null; try { q.$digest() } catch (c) { throw e(c), c; } } }, $on: function (a, b) {
                    var c = this.$$listeners[a]; c || (this.$$listeners[a] = c = []); c.push(b); var d = this; do d.$$listenerCount[a] ||
                    (d.$$listenerCount[a] = 0), d.$$listenerCount[a]++; while (d = d.$parent); var e = this; return function () { c[cb(c, b)] = null; l(e, 1, a) }
                }, $emit: function (a, b) {
                    var c = [], d, f = this, h = !1, g = { name: a, targetScope: f, stopPropagation: function () { h = !0 }, preventDefault: function () { g.defaultPrevented = !0 }, defaultPrevented: !1 }, k = [g].concat(va.call(arguments, 1)), l, m; do { d = f.$$listeners[a] || c; g.currentScope = f; l = 0; for (m = d.length; l < m; l++) if (d[l]) try { d[l].apply(null, k) } catch (n) { e(n) } else d.splice(l, 1), l--, m--; if (h) break; f = f.$parent } while (f);
                    return g
                }, $broadcast: function (a, b) { for (var c = this, d = this, f = { name: a, targetScope: this, preventDefault: function () { f.defaultPrevented = !0 }, defaultPrevented: !1 }, h = [f].concat(va.call(arguments, 1)), g, k; c = d;) { f.currentScope = c; d = c.$$listeners[a] || []; g = 0; for (k = d.length; g < k; g++) if (d[g]) try { d[g].apply(null, h) } catch (l) { e(l) } else d.splice(g, 1), g--, k--; if (!(d = c.$$listenerCount[a] && c.$$childHead || c !== this && c.$$nextSibling)) for (; c !== this && !(d = c.$$nextSibling) ;) c = c.$parent } return f }
            }; var q = new h; return q
        }]
    } function $c() {
        var b =
        /^\s*(https?|ftp|mailto|tel|file):/, a = /^\s*(https?|ftp|file):|data:image\//; this.aHrefSanitizationWhitelist = function (a) { return u(a) ? (b = a, this) : b }; this.imgSrcSanitizationWhitelist = function (b) { return u(b) ? (a = b, this) : a }; this.$get = function () { return function (c, d) { var e = d ? a : b, f; if (!P || 8 <= P) if (f = pa(c).href, "" !== f && !f.match(e)) return "unsafe:" + f; return c } }
    } function we(b) {
        if ("self" === b) return b; if (x(b)) {
            if (-1 < b.indexOf("***")) throw ra("iwcard", b); b = b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g,
            "\\x08").replace("\\*\\*", ".*").replace("\\*", "[^:/.?&;]*"); return RegExp("^" + b + "$")
        } if (bb(b)) return RegExp("^" + b.source + "$"); throw ra("imatcher");
    } function Ec(b) { var a = []; u(b) && r(b, function (b) { a.push(we(b)) }); return a } function Zd() {
        this.SCE_CONTEXTS = ea; var b = ["self"], a = []; this.resourceUrlWhitelist = function (a) { arguments.length && (b = Ec(a)); return b }; this.resourceUrlBlacklist = function (b) { arguments.length && (a = Ec(b)); return a }; this.$get = ["$injector", function (c) {
            function d(a) {
                var b = function (a) {
                    this.$$unwrapTrustedValue =
                    function () { return a }
                }; a && (b.prototype = new a); b.prototype.valueOf = function () { return this.$$unwrapTrustedValue() }; b.prototype.toString = function () { return this.$$unwrapTrustedValue().toString() }; return b
            } var e = function (a) { throw ra("unsafe"); }; c.has("$sanitize") && (e = c.get("$sanitize")); var f = d(), g = {}; g[ea.HTML] = d(f); g[ea.CSS] = d(f); g[ea.URL] = d(f); g[ea.JS] = d(f); g[ea.RESOURCE_URL] = d(g[ea.URL]); return {
                trustAs: function (a, b) {
                    var c = g.hasOwnProperty(a) ? g[a] : null; if (!c) throw ra("icontext", a, b); if (null === b || b ===
                    s || "" === b) return b; if ("string" !== typeof b) throw ra("itype", a); return new c(b)
                }, getTrusted: function (c, d) {
                    if (null === d || d === s || "" === d) return d; var f = g.hasOwnProperty(c) ? g[c] : null; if (f && d instanceof f) return d.$$unwrapTrustedValue(); if (c === ea.RESOURCE_URL) { var f = pa(d.toString()), l, n, q = !1; l = 0; for (n = b.length; l < n; l++) if ("self" === b[l] ? Gb(f) : b[l].exec(f.href)) { q = !0; break } if (q) for (l = 0, n = a.length; l < n; l++) if ("self" === a[l] ? Gb(f) : a[l].exec(f.href)) { q = !1; break } if (q) return d; throw ra("insecurl", d.toString()); } if (c ===
                    ea.HTML) return e(d); throw ra("unsafe");
                }, valueOf: function (a) { return a instanceof f ? a.$$unwrapTrustedValue() : a }
            }
        }]
    } function Yd() {
        var b = !0; this.enabled = function (a) { arguments.length && (b = !!a); return b }; this.$get = ["$parse", "$sniffer", "$sceDelegate", function (a, c, d) {
            if (b && c.msie && 8 > c.msieDocumentMode) throw ra("iequirks"); var e = $(ea); e.isEnabled = function () { return b }; e.trustAs = d.trustAs; e.getTrusted = d.getTrusted; e.valueOf = d.valueOf; b || (e.trustAs = e.getTrusted = function (a, b) { return b }, e.valueOf = Ba); e.parseAs =
            function (b, c) { var d = a(c); return d.literal && d.constant ? d : function (a, c) { return e.getTrusted(b, d(a, c)) } }; var f = e.parseAs, g = e.getTrusted, h = e.trustAs; r(ea, function (a, b) { var c = O(b); e[Sa("parse_as_" + c)] = function (b) { return f(a, b) }; e[Sa("get_trusted_" + c)] = function (b) { return g(a, b) }; e[Sa("trust_as_" + c)] = function (b) { return h(a, b) } }); return e
        }]
    } function $d() {
        this.$get = ["$window", "$document", function (b, a) {
            var c = {}, d = R((/android (\d+)/.exec(O((b.navigator || {}).userAgent)) || [])[1]), e = /Boxee/i.test((b.navigator ||
            {}).userAgent), f = a[0] || {}, g = f.documentMode, h, m = /^(Moz|webkit|O|ms)(?=[A-Z])/, k = f.body && f.body.style, l = !1, n = !1; if (k) { for (var q in k) if (l = m.exec(q)) { h = l[0]; h = h.substr(0, 1).toUpperCase() + h.substr(1); break } h || (h = "WebkitOpacity" in k && "webkit"); l = !!("transition" in k || h + "Transition" in k); n = !!("animation" in k || h + "Animation" in k); !d || l && n || (l = x(f.body.style.webkitTransition), n = x(f.body.style.webkitAnimation)) } return {
                history: !(!b.history || !b.history.pushState || 4 > d || e), hashchange: "onhashchange" in b && (!g || 7 <
                g), hasEvent: function (a) { if ("input" == a && 9 == P) return !1; if (E(c[a])) { var b = f.createElement("div"); c[a] = "on" + a in b } return c[a] }, csp: Tb(), vendorPrefix: h, transitions: l, animations: n, android: d, msie: P, msieDocumentMode: g
            }
        }]
    } function be() {
        this.$get = ["$rootScope", "$browser", "$q", "$exceptionHandler", function (b, a, c, d) {
            function e(e, h, m) {
                var k = c.defer(), l = k.promise, n = u(m) && !m; h = a.defer(function () { try { k.resolve(e()) } catch (a) { k.reject(a), d(a) } finally { delete f[l.$$timeoutId] } n || b.$apply() }, h); l.$$timeoutId = h; f[h] = k;
                return l
            } var f = {}; e.cancel = function (b) { return b && b.$$timeoutId in f ? (f[b.$$timeoutId].reject("canceled"), delete f[b.$$timeoutId], a.defer.cancel(b.$$timeoutId)) : !1 }; return e
        }]
    } function pa(b, a) {
        var c = b; P && (V.setAttribute("href", c), c = V.href); V.setAttribute("href", c); return {
            href: V.href, protocol: V.protocol ? V.protocol.replace(/:$/, "") : "", host: V.host, search: V.search ? V.search.replace(/^\?/, "") : "", hash: V.hash ? V.hash.replace(/^#/, "") : "", hostname: V.hostname, port: V.port, pathname: "/" === V.pathname.charAt(0) ? V.pathname :
            "/" + V.pathname
        }
    } function Gb(b) { b = x(b) ? pa(b) : b; return b.protocol === Fc.protocol && b.host === Fc.host } function ce() { this.$get = Y(Q) } function ec(b) { function a(d, e) { if (W(d)) { var f = {}; r(d, function (b, c) { f[c] = a(c, b) }); return f } return b.factory(d + c, e) } var c = "Filter"; this.register = a; this.$get = ["$injector", function (a) { return function (b) { return a.get(b + c) } }]; a("currency", Gc); a("date", Hc); a("filter", xe); a("json", ye); a("limitTo", ze); a("lowercase", Ae); a("number", Ic); a("orderBy", Jc); a("uppercase", Be) } function xe() {
        return function (b,
        a, c) {
            if (!M(b)) return b; var d = typeof c, e = []; e.check = function (a) { for (var b = 0; b < e.length; b++) if (!e[b](a)) return !1; return !0 }; "function" !== d && (c = "boolean" === d && c ? function (a, b) { return Ca.equals(a, b) } : function (a, b) { if (a && b && "object" === typeof a && "object" === typeof b) { for (var d in a) if ("$" !== d.charAt(0) && Dc.call(a, d) && c(a[d], b[d])) return !0; return !1 } b = ("" + b).toLowerCase(); return -1 < ("" + a).toLowerCase().indexOf(b) }); var f = function (a, b) {
                if ("string" == typeof b && "!" === b.charAt(0)) return !f(a, b.substr(1)); switch (typeof a) {
                    case "boolean": case "number": case "string": return c(a,
                    b); case "object": switch (typeof b) { case "object": return c(a, b); default: for (var d in a) if ("$" !== d.charAt(0) && f(a[d], b)) return !0 } return !1; case "array": for (d = 0; d < a.length; d++) if (f(a[d], b)) return !0; return !1; default: return !1
                }
            }; switch (typeof a) { case "boolean": case "number": case "string": a = { $: a }; case "object": for (var g in a) (function (b) { "undefined" != typeof a[b] && e.push(function (c) { return f("$" == b ? c : c && c[b], a[b]) }) })(g); break; case "function": e.push(a); break; default: return b } d = []; for (g = 0; g < b.length; g++) {
                var h =
                b[g]; e.check(h) && d.push(h)
            } return d
        }
    } function Gc(b) { var a = b.NUMBER_FORMATS; return function (b, d) { E(d) && (d = a.CURRENCY_SYM); return Kc(b, a.PATTERNS[1], a.GROUP_SEP, a.DECIMAL_SEP, 2).replace(/\u00A4/g, d) } } function Ic(b) { var a = b.NUMBER_FORMATS; return function (b, d) { return Kc(b, a.PATTERNS[0], a.GROUP_SEP, a.DECIMAL_SEP, d) } } function Kc(b, a, c, d, e) {
        if (null == b || !isFinite(b) || W(b)) return ""; var f = 0 > b; b = Math.abs(b); var g = b + "", h = "", m = [], k = !1; if (-1 !== g.indexOf("e")) {
            var l = g.match(/([\d\.]+)e(-?)(\d+)/); l && "-" == l[2] &&
            l[3] > e + 1 ? g = "0" : (h = g, k = !0)
        } if (k) 0 < e && (-1 < b && 1 > b) && (h = b.toFixed(e)); else { g = (g.split(Lc)[1] || "").length; E(e) && (e = Math.min(Math.max(a.minFrac, g), a.maxFrac)); g = Math.pow(10, e); b = Math.round(b * g) / g; b = ("" + b).split(Lc); g = b[0]; b = b[1] || ""; var l = 0, n = a.lgSize, q = a.gSize; if (g.length >= n + q) for (l = g.length - n, k = 0; k < l; k++) 0 === (l - k) % q && 0 !== k && (h += c), h += g.charAt(k); for (k = l; k < g.length; k++) 0 === (g.length - k) % n && 0 !== k && (h += c), h += g.charAt(k); for (; b.length < e;) b += "0"; e && "0" !== e && (h += d + b.substr(0, e)) } m.push(f ? a.negPre : a.posPre);
        m.push(h); m.push(f ? a.negSuf : a.posSuf); return m.join("")
    } function Mb(b, a, c) { var d = ""; 0 > b && (d = "-", b = -b); for (b = "" + b; b.length < a;) b = "0" + b; c && (b = b.substr(b.length - a)); return d + b } function X(b, a, c, d) { c = c || 0; return function (e) { e = e["get" + b](); if (0 < c || e > -c) e += c; 0 === e && -12 == c && (e = 12); return Mb(e, a, d) } } function ob(b, a) { return function (c, d) { var e = c["get" + b](), f = Da(a ? "SHORT" + b : b); return d[f][e] } } function Hc(b) {
        function a(a) {
            var b; if (b = a.match(c)) {
                a = new Date(0); var f = 0, g = 0, h = b[8] ? a.setUTCFullYear : a.setFullYear, m =
                b[8] ? a.setUTCHours : a.setHours; b[9] && (f = R(b[9] + b[10]), g = R(b[9] + b[11])); h.call(a, R(b[1]), R(b[2]) - 1, R(b[3])); f = R(b[4] || 0) - f; g = R(b[5] || 0) - g; h = R(b[6] || 0); b = Math.round(1E3 * parseFloat("0." + (b[7] || 0))); m.call(a, f, g, h, b)
            } return a
        } var c = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/; return function (c, e) {
            var f = "", g = [], h, m; e = e || "mediumDate"; e = b.DATETIME_FORMATS[e] || e; x(c) && (c = Ce.test(c) ? R(c) : a(c)); ub(c) && (c = new Date(c)); if (!Ma(c)) return c; for (; e;) (m = De.exec(e)) ?
            (g = g.concat(va.call(m, 1)), e = g.pop()) : (g.push(e), e = null); r(g, function (a) { h = Ee[a]; f += h ? h(c, b.DATETIME_FORMATS) : a.replace(/(^'|'$)/g, "").replace(/''/g, "'") }); return f
        }
    } function ye() { return function (b) { return oa(b, !0) } } function ze() { return function (b, a) { if (!M(b) && !x(b)) return b; a = R(a); if (x(b)) return a ? 0 <= a ? b.slice(0, a) : b.slice(a, b.length) : ""; var c = [], d, e; a > b.length ? a = b.length : a < -b.length && (a = -b.length); 0 < a ? (d = 0, e = a) : (d = b.length + a, e = b.length); for (; d < e; d++) c.push(b[d]); return c } } function Jc(b) {
        return function (a,
        c, d) {
            function e(a, b) { return Pa(b) ? function (b, c) { return a(c, b) } : a } function f(a, b) { var c = typeof a, d = typeof b; return c == d ? ("string" == c && (a = a.toLowerCase(), b = b.toLowerCase()), a === b ? 0 : a < b ? -1 : 1) : c < d ? -1 : 1 } if (!M(a) || !c) return a; c = M(c) ? c : [c]; c = Sc(c, function (a) { var c = !1, d = a || Ba; if (x(a)) { if ("+" == a.charAt(0) || "-" == a.charAt(0)) c = "-" == a.charAt(0), a = a.substring(1); d = b(a); if (d.constant) { var h = d(); return e(function (a, b) { return f(a[h], b[h]) }, c) } } return e(function (a, b) { return f(d(a), d(b)) }, c) }); for (var g = [], h = 0; h < a.length; h++) g.push(a[h]);
            return g.sort(e(function (a, b) { for (var d = 0; d < c.length; d++) { var e = c[d](a, b); if (0 !== e) return e } return 0 }, d))
        }
    } function sa(b) { D(b) && (b = { link: b }); b.restrict = b.restrict || "AC"; return Y(b) } function Mc(b, a, c, d) {
        function e(a, c) { c = c ? "-" + eb(c, "-") : ""; d.removeClass(b, (a ? pb : qb) + c); d.addClass(b, (a ? qb : pb) + c) } var f = this, g = b.parent().controller("form") || rb, h = 0, m = f.$error = {}, k = []; f.$name = a.name || a.ngForm; f.$dirty = !1; f.$pristine = !0; f.$valid = !0; f.$invalid = !1; g.$addControl(f); b.addClass(Ka); e(!0); f.$addControl = function (a) {
            xa(a.$name,
            "input"); k.push(a); a.$name && (f[a.$name] = a)
        }; f.$removeControl = function (a) { a.$name && f[a.$name] === a && delete f[a.$name]; r(m, function (b, c) { f.$setValidity(c, !0, a) }); Na(k, a) }; f.$setValidity = function (a, b, c) { var d = m[a]; if (b) d && (Na(d, c), d.length || (h--, h || (e(b), f.$valid = !0, f.$invalid = !1), m[a] = !1, e(!0, a), g.$setValidity(a, !0, f))); else { h || e(b); if (d) { if (-1 != cb(d, c)) return } else m[a] = d = [], h++, e(!1, a), g.$setValidity(a, !1, f); d.push(c); f.$valid = !1; f.$invalid = !0 } }; f.$setDirty = function () {
            d.removeClass(b, Ka); d.addClass(b,
            sb); f.$dirty = !0; f.$pristine = !1; g.$setDirty()
        }; f.$setPristine = function () { d.removeClass(b, sb); d.addClass(b, Ka); f.$dirty = !1; f.$pristine = !0; r(k, function (a) { a.$setPristine() }) }
    } function na(b, a, c, d) { b.$setValidity(a, c); return c ? d : s } function Fe(b, a, c) { var d = c.prop("validity"); W(d) && (c = function (c) { if (b.$error[a] || !(d.badInput || d.customError || d.typeMismatch) || d.valueMissing) return c; b.$setValidity(a, !1) }, b.$parsers.push(c), b.$formatters.push(c)) } function tb(b, a, c, d, e, f) {
        var g = a.prop("validity"); if (!e.android) {
            var h =
            !1; a.on("compositionstart", function (a) { h = !0 }); a.on("compositionend", function () { h = !1; m() })
        } var m = function () { if (!h) { var e = a.val(); Pa(c.ngTrim || "T") && (e = aa(e)); if (d.$viewValue !== e || g && "" === e && !g.valueMissing) b.$$phase ? d.$setViewValue(e) : b.$apply(function () { d.$setViewValue(e) }) } }; if (e.hasEvent("input")) a.on("input", m); else {
            var k, l = function () { k || (k = f.defer(function () { m(); k = null })) }; a.on("keydown", function (a) { a = a.keyCode; 91 === a || (15 < a && 19 > a || 37 <= a && 40 >= a) || l() }); if (e.hasEvent("paste")) a.on("paste cut",
            l)
        } a.on("change", m); d.$render = function () { a.val(d.$isEmpty(d.$viewValue) ? "" : d.$viewValue) }; var n = c.ngPattern; n && ((e = n.match(/^\/(.*)\/([gim]*)$/)) ? (n = RegExp(e[1], e[2]), e = function (a) { return na(d, "pattern", d.$isEmpty(a) || n.test(a), a) }) : e = function (c) { var e = b.$eval(n); if (!e || !e.test) throw z("ngPattern")("noregexp", n, e, fa(a)); return na(d, "pattern", d.$isEmpty(c) || e.test(c), c) }, d.$formatters.push(e), d.$parsers.push(e)); if (c.ngMinlength) {
            var q = R(c.ngMinlength); e = function (a) {
                return na(d, "minlength", d.$isEmpty(a) ||
                a.length >= q, a)
            }; d.$parsers.push(e); d.$formatters.push(e)
        } if (c.ngMaxlength) { var p = R(c.ngMaxlength); e = function (a) { return na(d, "maxlength", d.$isEmpty(a) || a.length <= p, a) }; d.$parsers.push(e); d.$formatters.push(e) }
    } function Nb(b, a) {
        b = "ngClass" + b; return function () {
            return {
                restrict: "AC", link: function (c, d, e) {
                    function f(b) { if (!0 === a || c.$index % 2 === a) { var d = g(b || ""); h ? ua(b, h) || e.$updateClass(d, g(h)) : e.$addClass(d) } h = $(b) } function g(a) {
                        if (M(a)) return a.join(" "); if (W(a)) {
                            var b = []; r(a, function (a, c) { a && b.push(c) });
                            return b.join(" ")
                        } return a
                    } var h; c.$watch(e[b], f, !0); e.$observe("class", function (a) { f(c.$eval(e[b])) }); "ngClass" !== b && c.$watch("$index", function (d, f) { var h = d & 1; if (h !== f & 1) { var n = g(c.$eval(e[b])); h === a ? e.$addClass(n) : e.$removeClass(n) } })
                }
            }
        }
    } var O = function (b) { return x(b) ? b.toLowerCase() : b }, Dc = Object.prototype.hasOwnProperty, Da = function (b) { return x(b) ? b.toUpperCase() : b }, P, w, Ea, va = [].slice, Ge = [].push, ta = Object.prototype.toString, Oa = z("ng"), Ca = Q.angular || (Q.angular = {}), Ra, Ia, ia = ["0", "0", "0"]; P = R((/msie (\d+)/.exec(O(navigator.userAgent)) ||
    [])[1]); isNaN(P) && (P = R((/trident\/.*; rv:(\d+)/.exec(O(navigator.userAgent)) || [])[1])); B.$inject = []; Ba.$inject = []; var aa = function () { return String.prototype.trim ? function (b) { return x(b) ? b.trim() : b } : function (b) { return x(b) ? b.replace(/^\s\s*/, "").replace(/\s\s*$/, "") : b } }(); Ia = 9 > P ? function (b) { b = b.nodeName ? b : b[0]; return b.scopeName && "HTML" != b.scopeName ? Da(b.scopeName + ":" + b.nodeName) : b.nodeName } : function (b) { return b.nodeName ? b.nodeName : b[0].nodeName }; var Vc = /[A-Z]/g, Yc = {
        full: "1.2.15", major: 1, minor: 2, dot: 15,
        codeName: "beer-underestimating"
    }, Ta = L.cache = {}, fb = L.expando = "ng-" + (new Date).getTime(), he = 1, Nc = Q.document.addEventListener ? function (b, a, c) { b.addEventListener(a, c, !1) } : function (b, a, c) { b.attachEvent("on" + a, c) }, Db = Q.document.removeEventListener ? function (b, a, c) { b.removeEventListener(a, c, !1) } : function (b, a, c) { b.detachEvent("on" + a, c) }; L._data = function (b) { return this.cache[b[this.expando]] || {} }; var fe = /([\:\-\_]+(.))/g, ge = /^moz([A-Z])/, Ab = z("jqLite"), Ha = L.prototype = {
        ready: function (b) {
            function a() {
                c || (c = !0,
                b())
            } var c = !1; "complete" === T.readyState ? setTimeout(a) : (this.on("DOMContentLoaded", a), L(Q).on("load", a))
        }, toString: function () { var b = []; r(this, function (a) { b.push("" + a) }); return "[" + b.join(", ") + "]" }, eq: function (b) { return 0 <= b ? w(this[b]) : w(this[this.length + b]) }, length: 0, push: Ge, sort: [].sort, splice: [].splice
    }, jb = {}; r("multiple selected checked disabled readOnly required open".split(" "), function (b) { jb[O(b)] = b }); var lc = {}; r("input select option textarea button form details".split(" "), function (b) {
        lc[Da(b)] =
        !0
    }); r({
        data: hc, inheritedData: ib, scope: function (b) { return w(b).data("$scope") || ib(b.parentNode || b, ["$isolateScope", "$scope"]) }, isolateScope: function (b) { return w(b).data("$isolateScope") || w(b).data("$isolateScopeNoTemplate") }, controller: ic, injector: function (b) { return ib(b, "$injector") }, removeAttr: function (b, a) { b.removeAttribute(a) }, hasClass: Eb, css: function (b, a, c) {
            a = Sa(a); if (u(c)) b.style[a] = c; else {
                var d; 8 >= P && (d = b.currentStyle && b.currentStyle[a], "" === d && (d = "auto")); d = d || b.style[a]; 8 >= P && (d = "" === d ? s :
                d); return d
            }
        }, attr: function (b, a, c) { var d = O(a); if (jb[d]) if (u(c)) c ? (b[a] = !0, b.setAttribute(a, d)) : (b[a] = !1, b.removeAttribute(d)); else return b[a] || (b.attributes.getNamedItem(a) || B).specified ? d : s; else if (u(c)) b.setAttribute(a, c); else if (b.getAttribute) return b = b.getAttribute(a, 2), null === b ? s : b }, prop: function (b, a, c) { if (u(c)) b[a] = c; else return b[a] }, text: function () {
            function b(b, d) { var e = a[b.nodeType]; if (E(d)) return e ? b[e] : ""; b[e] = d } var a = []; 9 > P ? (a[1] = "innerText", a[3] = "nodeValue") : a[1] = a[3] = "textContent";
            b.$dv = ""; return b
        }(), val: function (b, a) { if (E(a)) { if ("SELECT" === Ia(b) && b.multiple) { var c = []; r(b.options, function (a) { a.selected && c.push(a.value || a.text) }); return 0 === c.length ? null : c } return b.value } b.value = a }, html: function (b, a) { if (E(a)) return b.innerHTML; for (var c = 0, d = b.childNodes; c < d.length; c++) Fa(d[c]); b.innerHTML = a }, empty: jc
    }, function (b, a) {
        L.prototype[a] = function (a, d) {
            var e, f; if (b !== jc && (2 == b.length && b !== Eb && b !== ic ? a : d) === s) {
                if (W(a)) {
                    for (e = 0; e < this.length; e++) if (b === hc) b(this[e], a); else for (f in a) b(this[e],
                    f, a[f]); return this
                } e = b.$dv; f = e === s ? Math.min(this.length, 1) : this.length; for (var g = 0; g < f; g++) { var h = b(this[g], a, d); e = e ? e + h : h } return e
            } for (e = 0; e < this.length; e++) b(this[e], a, d); return this
        }
    }); r({
        removeData: fc, dealoc: Fa, on: function a(c, d, e, f) {
            if (u(f)) throw Ab("onargs"); var g = ja(c, "events"), h = ja(c, "handle"); g || ja(c, "events", g = {}); h || ja(c, "handle", h = ie(c, g)); r(d.split(" "), function (d) {
                var f = g[d]; if (!f) {
                    if ("mouseenter" == d || "mouseleave" == d) {
                        var l = T.body.contains || T.body.compareDocumentPosition ? function (a,
                        c) { var d = 9 === a.nodeType ? a.documentElement : a, e = c && c.parentNode; return a === e || !!(e && 1 === e.nodeType && (d.contains ? d.contains(e) : a.compareDocumentPosition && a.compareDocumentPosition(e) & 16)) } : function (a, c) { if (c) for (; c = c.parentNode;) if (c === a) return !0; return !1 }; g[d] = []; a(c, { mouseleave: "mouseout", mouseenter: "mouseover" }[d], function (a) { var c = a.relatedTarget; c && (c === this || l(this, c)) || h(a, d) })
                    } else Nc(c, d, h), g[d] = []; f = g[d]
                } f.push(e)
            })
        }, off: gc, one: function (a, c, d) {
            a = w(a); a.on(c, function f() {
                a.off(c, d); a.off(c,
                f)
            }); a.on(c, d)
        }, replaceWith: function (a, c) { var d, e = a.parentNode; Fa(a); r(new L(c), function (c) { d ? e.insertBefore(c, d.nextSibling) : e.replaceChild(c, a); d = c }) }, children: function (a) { var c = []; r(a.childNodes, function (a) { 1 === a.nodeType && c.push(a) }); return c }, contents: function (a) { return a.contentDocument || a.childNodes || [] }, append: function (a, c) { r(new L(c), function (c) { 1 !== a.nodeType && 11 !== a.nodeType || a.appendChild(c) }) }, prepend: function (a, c) {
            if (1 === a.nodeType) {
                var d = a.firstChild; r(new L(c), function (c) {
                    a.insertBefore(c,
                    d)
                })
            }
        }, wrap: function (a, c) { c = w(c)[0]; var d = a.parentNode; d && d.replaceChild(c, a); c.appendChild(a) }, remove: function (a) { Fa(a); var c = a.parentNode; c && c.removeChild(a) }, after: function (a, c) { var d = a, e = a.parentNode; r(new L(c), function (a) { e.insertBefore(a, d.nextSibling); d = a }) }, addClass: hb, removeClass: gb, toggleClass: function (a, c, d) { c && r(c.split(" "), function (c) { var f = d; E(f) && (f = !Eb(a, c)); (f ? hb : gb)(a, c) }) }, parent: function (a) { return (a = a.parentNode) && 11 !== a.nodeType ? a : null }, next: function (a) {
            if (a.nextElementSibling) return a.nextElementSibling;
            for (a = a.nextSibling; null != a && 1 !== a.nodeType;) a = a.nextSibling; return a
        }, find: function (a, c) { return a.getElementsByTagName ? a.getElementsByTagName(c) : [] }, clone: Cb, triggerHandler: function (a, c, d) { c = (ja(a, "events") || {})[c]; d = d || []; var e = [{ preventDefault: B, stopPropagation: B }]; r(c, function (c) { c.apply(a, e.concat(d)) }) }
    }, function (a, c) {
        L.prototype[c] = function (c, e, f) { for (var g, h = 0; h < this.length; h++) E(g) ? (g = a(this[h], c, e, f), u(g) && (g = w(g))) : Bb(g, a(this[h], c, e, f)); return u(g) ? g : this }; L.prototype.bind = L.prototype.on;
        L.prototype.unbind = L.prototype.off
    }); Ua.prototype = { put: function (a, c) { this[Ga(a)] = c }, get: function (a) { return this[Ga(a)] }, remove: function (a) { var c = this[a = Ga(a)]; delete this[a]; return c } }; var ke = /^function\s*[^\(]*\(\s*([^\)]*)\)/m, le = /,/, me = /^\s*(_?)(\S+?)\1\s*$/, je = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, Va = z("$injector"), He = z("$animate"), Jd = ["$provide", function (a) {
        this.$$selectors = {}; this.register = function (c, d) {
            var e = c + "-animation"; if (c && "." != c.charAt(0)) throw He("notcsel", c); this.$$selectors[c.substr(1)] =
            e; a.factory(e, d)
        }; this.classNameFilter = function (a) { 1 === arguments.length && (this.$$classNameFilter = a instanceof RegExp ? a : null); return this.$$classNameFilter }; this.$get = ["$timeout", "$$asyncCallback", function (a, d) {
            return {
                enter: function (a, c, g, h) { g ? g.after(a) : (c && c[0] || (c = g.parent()), c.append(a)); h && d(h) }, leave: function (a, c) { a.remove(); c && d(c) }, move: function (a, c, d, h) { this.enter(a, c, d, h) }, addClass: function (a, c, g) { c = x(c) ? c : M(c) ? c.join(" ") : ""; r(a, function (a) { hb(a, c) }); g && d(g) }, removeClass: function (a, c, g) {
                    c =
                    x(c) ? c : M(c) ? c.join(" ") : ""; r(a, function (a) { gb(a, c) }); g && d(g)
                }, setClass: function (a, c, g, h) { r(a, function (a) { hb(a, c); gb(a, g) }); h && d(h) }, enabled: B
            }
        }]
    }], ha = z("$compile"); ac.$inject = ["$provide", "$$sanitizeUriProvider"]; var pe = /^(x[\:\-_]|data[\:\-_])/i, tc = z("$interpolate"), Ie = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/, se = { http: 80, https: 443, ftp: 21 }, Ib = z("$location"); yc.prototype = Jb.prototype = xc.prototype = {
        $$html5: !1, $$replace: !1, absUrl: mb("$$absUrl"), url: function (a, c) {
            if (E(a)) return this.$$url; var d = Ie.exec(a); d[1] &&
            this.path(decodeURIComponent(d[1])); (d[2] || d[1]) && this.search(d[3] || ""); this.hash(d[5] || "", c); return this
        }, protocol: mb("$$protocol"), host: mb("$$host"), port: mb("$$port"), path: zc("$$path", function (a) { return "/" == a.charAt(0) ? a : "/" + a }), search: function (a, c) { switch (arguments.length) { case 0: return this.$$search; case 1: if (x(a)) this.$$search = Wb(a); else if (W(a)) this.$$search = a; else throw Ib("isrcharg"); break; default: E(c) || null === c ? delete this.$$search[a] : this.$$search[a] = c } this.$$compose(); return this }, hash: zc("$$hash",
        Ba), replace: function () { this.$$replace = !0; return this }
    }; var za = z("$parse"), Cc = {}, qa, La = {
        "null": function () { return null }, "true": function () { return !0 }, "false": function () { return !1 }, undefined: B, "+": function (a, c, d, e) { d = d(a, c); e = e(a, c); return u(d) ? u(e) ? d + e : d : u(e) ? e : s }, "-": function (a, c, d, e) { d = d(a, c); e = e(a, c); return (u(d) ? d : 0) - (u(e) ? e : 0) }, "*": function (a, c, d, e) { return d(a, c) * e(a, c) }, "/": function (a, c, d, e) { return d(a, c) / e(a, c) }, "%": function (a, c, d, e) { return d(a, c) % e(a, c) }, "^": function (a, c, d, e) {
            return d(a, c) ^ e(a,
            c)
        }, "=": B, "===": function (a, c, d, e) { return d(a, c) === e(a, c) }, "!==": function (a, c, d, e) { return d(a, c) !== e(a, c) }, "==": function (a, c, d, e) { return d(a, c) == e(a, c) }, "!=": function (a, c, d, e) { return d(a, c) != e(a, c) }, "<": function (a, c, d, e) { return d(a, c) < e(a, c) }, ">": function (a, c, d, e) { return d(a, c) > e(a, c) }, "<=": function (a, c, d, e) { return d(a, c) <= e(a, c) }, ">=": function (a, c, d, e) { return d(a, c) >= e(a, c) }, "&&": function (a, c, d, e) { return d(a, c) && e(a, c) }, "||": function (a, c, d, e) { return d(a, c) || e(a, c) }, "&": function (a, c, d, e) {
            return d(a,
            c) & e(a, c)
        }, "|": function (a, c, d, e) { return e(a, c)(a, c, d(a, c)) }, "!": function (a, c, d) { return !d(a, c) }
    }, Je = { n: "\n", f: "\f", r: "\r", t: "\t", v: "\v", "'": "'", '"': '"' }, Lb = function (a) { this.options = a }; Lb.prototype = {
        constructor: Lb, lex: function (a) {
            this.text = a; this.index = 0; this.ch = s; this.lastCh = ":"; this.tokens = []; var c; for (a = []; this.index < this.text.length;) {
                this.ch = this.text.charAt(this.index); if (this.is("\"'")) this.readString(this.ch); else if (this.isNumber(this.ch) || this.is(".") && this.isNumber(this.peek())) this.readNumber();
                else if (this.isIdent(this.ch)) this.readIdent(), this.was("{,") && ("{" === a[0] && (c = this.tokens[this.tokens.length - 1])) && (c.json = -1 === c.text.indexOf(".")); else if (this.is("(){}[].,;:?")) this.tokens.push({ index: this.index, text: this.ch, json: this.was(":[,") && this.is("{[") || this.is("}]:,") }), this.is("{[") && a.unshift(this.ch), this.is("}]") && a.shift(), this.index++; else if (this.isWhitespace(this.ch)) { this.index++; continue } else {
                    var d = this.ch + this.peek(), e = d + this.peek(2), f = La[this.ch], g = La[d], h = La[e]; h ? (this.tokens.push({
                        index: this.index,
                        text: e, fn: h
                    }), this.index += 3) : g ? (this.tokens.push({ index: this.index, text: d, fn: g }), this.index += 2) : f ? (this.tokens.push({ index: this.index, text: this.ch, fn: f, json: this.was("[,:") && this.is("+-") }), this.index += 1) : this.throwError("Unexpected next character ", this.index, this.index + 1)
                } this.lastCh = this.ch
            } return this.tokens
        }, is: function (a) { return -1 !== a.indexOf(this.ch) }, was: function (a) { return -1 !== a.indexOf(this.lastCh) }, peek: function (a) {
            a = a || 1; return this.index + a < this.text.length ? this.text.charAt(this.index +
            a) : !1
        }, isNumber: function (a) { return "0" <= a && "9" >= a }, isWhitespace: function (a) { return " " === a || "\r" === a || "\t" === a || "\n" === a || "\v" === a || "\u00a0" === a }, isIdent: function (a) { return "a" <= a && "z" >= a || "A" <= a && "Z" >= a || "_" === a || "$" === a }, isExpOperator: function (a) { return "-" === a || "+" === a || this.isNumber(a) }, throwError: function (a, c, d) { d = d || this.index; c = u(c) ? "s " + c + "-" + this.index + " [" + this.text.substring(c, d) + "]" : " " + d; throw za("lexerr", a, c, this.text); }, readNumber: function () {
            for (var a = "", c = this.index; this.index < this.text.length;) {
                var d =
                O(this.text.charAt(this.index)); if ("." == d || this.isNumber(d)) a += d; else { var e = this.peek(); if ("e" == d && this.isExpOperator(e)) a += d; else if (this.isExpOperator(d) && e && this.isNumber(e) && "e" == a.charAt(a.length - 1)) a += d; else if (!this.isExpOperator(d) || e && this.isNumber(e) || "e" != a.charAt(a.length - 1)) break; else this.throwError("Invalid exponent") } this.index++
            } a *= 1; this.tokens.push({ index: c, text: a, json: !0, fn: function () { return a } })
        }, readIdent: function () {
            for (var a = this, c = "", d = this.index, e, f, g, h; this.index < this.text.length;) {
                h =
                this.text.charAt(this.index); if ("." === h || this.isIdent(h) || this.isNumber(h)) "." === h && (e = this.index), c += h; else break; this.index++
            } if (e) for (f = this.index; f < this.text.length;) { h = this.text.charAt(f); if ("(" === h) { g = c.substr(e - d + 1); c = c.substr(0, e - d); this.index = f; break } if (this.isWhitespace(h)) f++; else break } d = { index: d, text: c }; if (La.hasOwnProperty(c)) d.fn = La[c], d.json = La[c]; else { var m = Bc(c, this.options, this.text); d.fn = v(function (a, c) { return m(a, c) }, { assign: function (d, e) { return nb(d, c, e, a.text, a.options) } }) } this.tokens.push(d);
            g && (this.tokens.push({ index: e, text: ".", json: !1 }), this.tokens.push({ index: e + 1, text: g, json: !1 }))
        }, readString: function (a) {
            var c = this.index; this.index++; for (var d = "", e = a, f = !1; this.index < this.text.length;) {
                var g = this.text.charAt(this.index), e = e + g; if (f) "u" === g ? (g = this.text.substring(this.index + 1, this.index + 5), g.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + g + "]"), this.index += 4, d += String.fromCharCode(parseInt(g, 16))) : d = (f = Je[g]) ? d + f : d + g, f = !1; else if ("\\" === g) f = !0; else {
                    if (g === a) {
                        this.index++;
                        this.tokens.push({ index: c, text: e, string: d, json: !0, fn: function () { return d } }); return
                    } d += g
                } this.index++
            } this.throwError("Unterminated quote", c)
        }
    }; var Za = function (a, c, d) { this.lexer = a; this.$filter = c; this.options = d }; Za.ZERO = function () { return 0 }; Za.prototype = {
        constructor: Za, parse: function (a, c) {
            this.text = a; this.json = c; this.tokens = this.lexer.lex(a); c && (this.assignment = this.logicalOR, this.functionCall = this.fieldAccess = this.objectIndex = this.filterChain = function () {
                this.throwError("is not valid json", {
                    text: a,
                    index: 0
                })
            }); var d = c ? this.primary() : this.statements(); 0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]); d.literal = !!d.literal; d.constant = !!d.constant; return d
        }, primary: function () {
            var a; if (this.expect("(")) a = this.filterChain(), this.consume(")"); else if (this.expect("[")) a = this.arrayDeclaration(); else if (this.expect("{")) a = this.object(); else { var c = this.expect(); (a = c.fn) || this.throwError("not a primary expression", c); c.json && (a.constant = !0, a.literal = !0) } for (var d; c = this.expect("(",
            "[", ".") ;) "(" === c.text ? (a = this.functionCall(a, d), d = null) : "[" === c.text ? (d = a, a = this.objectIndex(a)) : "." === c.text ? (d = a, a = this.fieldAccess(a)) : this.throwError("IMPOSSIBLE"); return a
        }, throwError: function (a, c) { throw za("syntax", c.text, a, c.index + 1, this.text, this.text.substring(c.index)); }, peekToken: function () { if (0 === this.tokens.length) throw za("ueoe", this.text); return this.tokens[0] }, peek: function (a, c, d, e) { if (0 < this.tokens.length) { var f = this.tokens[0], g = f.text; if (g === a || g === c || g === d || g === e || !(a || c || d || e)) return f } return !1 },
        expect: function (a, c, d, e) { return (a = this.peek(a, c, d, e)) ? (this.json && !a.json && this.throwError("is not valid json", a), this.tokens.shift(), a) : !1 }, consume: function (a) { this.expect(a) || this.throwError("is unexpected, expecting [" + a + "]", this.peek()) }, unaryFn: function (a, c) { return v(function (d, e) { return a(d, e, c) }, { constant: c.constant }) }, ternaryFn: function (a, c, d) { return v(function (e, f) { return a(e, f) ? c(e, f) : d(e, f) }, { constant: a.constant && c.constant && d.constant }) }, binaryFn: function (a, c, d) {
            return v(function (e, f) {
                return c(e,
                f, a, d)
            }, { constant: a.constant && d.constant })
        }, statements: function () { for (var a = []; ;) if (0 < this.tokens.length && !this.peek("}", ")", ";", "]") && a.push(this.filterChain()), !this.expect(";")) return 1 === a.length ? a[0] : function (c, d) { for (var e, f = 0; f < a.length; f++) { var g = a[f]; g && (e = g(c, d)) } return e } }, filterChain: function () { for (var a = this.expression(), c; ;) if (c = this.expect("|")) a = this.binaryFn(a, c.fn, this.filter()); else return a }, filter: function () {
            for (var a = this.expect(), c = this.$filter(a.text), d = []; ;) if (a = this.expect(":")) d.push(this.expression());
            else { var e = function (a, e, h) { h = [h]; for (var m = 0; m < d.length; m++) h.push(d[m](a, e)); return c.apply(a, h) }; return function () { return e } }
        }, expression: function () { return this.assignment() }, assignment: function () { var a = this.ternary(), c, d; return (d = this.expect("=")) ? (a.assign || this.throwError("implies assignment but [" + this.text.substring(0, d.index) + "] can not be assigned to", d), c = this.ternary(), function (d, f) { return a.assign(d, c(d, f), f) }) : a }, ternary: function () {
            var a = this.logicalOR(), c, d; if (this.expect("?")) {
                c = this.ternary();
                if (d = this.expect(":")) return this.ternaryFn(a, c, this.ternary()); this.throwError("expected :", d)
            } else return a
        }, logicalOR: function () { for (var a = this.logicalAND(), c; ;) if (c = this.expect("||")) a = this.binaryFn(a, c.fn, this.logicalAND()); else return a }, logicalAND: function () { var a = this.equality(), c; if (c = this.expect("&&")) a = this.binaryFn(a, c.fn, this.logicalAND()); return a }, equality: function () { var a = this.relational(), c; if (c = this.expect("==", "!=", "===", "!==")) a = this.binaryFn(a, c.fn, this.equality()); return a },
        relational: function () { var a = this.additive(), c; if (c = this.expect("<", ">", "<=", ">=")) a = this.binaryFn(a, c.fn, this.relational()); return a }, additive: function () { for (var a = this.multiplicative(), c; c = this.expect("+", "-") ;) a = this.binaryFn(a, c.fn, this.multiplicative()); return a }, multiplicative: function () { for (var a = this.unary(), c; c = this.expect("*", "/", "%") ;) a = this.binaryFn(a, c.fn, this.unary()); return a }, unary: function () {
            var a; return this.expect("+") ? this.primary() : (a = this.expect("-")) ? this.binaryFn(Za.ZERO, a.fn,
            this.unary()) : (a = this.expect("!")) ? this.unaryFn(a.fn, this.unary()) : this.primary()
        }, fieldAccess: function (a) { var c = this, d = this.expect().text, e = Bc(d, this.options, this.text); return v(function (c, d, h) { return e(h || a(c, d)) }, { assign: function (e, g, h) { return nb(a(e, h), d, g, c.text, c.options) } }) }, objectIndex: function (a) {
            var c = this, d = this.expression(); this.consume("]"); return v(function (e, f) {
                var g = a(e, f), h = d(e, f), m; if (!g) return s; (g = Ya(g[h], c.text)) && (g.then && c.options.unwrapPromises) && (m = g, "$$v" in g || (m.$$v = s, m.then(function (a) {
                    m.$$v =
                    a
                })), g = g.$$v); return g
            }, { assign: function (e, f, g) { var h = d(e, g); return Ya(a(e, g), c.text)[h] = f } })
        }, functionCall: function (a, c) { var d = []; if (")" !== this.peekToken().text) { do d.push(this.expression()); while (this.expect(",")) } this.consume(")"); var e = this; return function (f, g) { for (var h = [], m = c ? c(f, g) : f, k = 0; k < d.length; k++) h.push(d[k](f, g)); k = a(f, g, m) || B; Ya(m, e.text); Ya(k, e.text); h = k.apply ? k.apply(m, h) : k(h[0], h[1], h[2], h[3], h[4]); return Ya(h, e.text) } }, arrayDeclaration: function () {
            var a = [], c = !0; if ("]" !== this.peekToken().text) {
                do {
                    if (this.peek("]")) break;
                    var d = this.expression(); a.push(d); d.constant || (c = !1)
                } while (this.expect(","))
            } this.consume("]"); return v(function (c, d) { for (var g = [], h = 0; h < a.length; h++) g.push(a[h](c, d)); return g }, { literal: !0, constant: c })
        }, object: function () {
            var a = [], c = !0; if ("}" !== this.peekToken().text) { do { if (this.peek("}")) break; var d = this.expect(), d = d.string || d.text; this.consume(":"); var e = this.expression(); a.push({ key: d, value: e }); e.constant || (c = !1) } while (this.expect(",")) } this.consume("}"); return v(function (c, d) {
                for (var e = {}, m = 0; m <
                a.length; m++) { var k = a[m]; e[k.key] = k.value(c, d) } return e
            }, { literal: !0, constant: c })
        }
    }; var Kb = {}, ra = z("$sce"), ea = { HTML: "html", CSS: "css", URL: "url", RESOURCE_URL: "resourceUrl", JS: "js" }, V = T.createElement("a"), Fc = pa(Q.location.href, !0); ec.$inject = ["$provide"]; Gc.$inject = ["$locale"]; Ic.$inject = ["$locale"]; var Lc = ".", Ee = {
        yyyy: X("FullYear", 4), yy: X("FullYear", 2, 0, !0), y: X("FullYear", 1), MMMM: ob("Month"), MMM: ob("Month", !0), MM: X("Month", 2, 1), M: X("Month", 1, 1), dd: X("Date", 2), d: X("Date", 1), HH: X("Hours", 2), H: X("Hours",
        1), hh: X("Hours", 2, -12), h: X("Hours", 1, -12), mm: X("Minutes", 2), m: X("Minutes", 1), ss: X("Seconds", 2), s: X("Seconds", 1), sss: X("Milliseconds", 3), EEEE: ob("Day"), EEE: ob("Day", !0), a: function (a, c) { return 12 > a.getHours() ? c.AMPMS[0] : c.AMPMS[1] }, Z: function (a) { a = -1 * a.getTimezoneOffset(); return a = (0 <= a ? "+" : "") + (Mb(Math[0 < a ? "floor" : "ceil"](a / 60), 2) + Mb(Math.abs(a % 60), 2)) }
    }, De = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/, Ce = /^\-?\d+$/; Hc.$inject = ["$locale"]; var Ae = Y(O), Be = Y(Da); Jc.$inject =
    ["$parse"]; var ad = Y({ restrict: "E", compile: function (a, c) { 8 >= P && (c.href || c.name || c.$set("href", ""), a.append(T.createComment("IE fix"))); if (!c.href && !c.xlinkHref && !c.name) return function (a, c) { var f = "[object SVGAnimatedString]" === ta.call(c.prop("href")) ? "xlink:href" : "href"; c.on("click", function (a) { c.attr(f) || a.preventDefault() }) } } }), yb = {}; r(jb, function (a, c) { if ("multiple" != a) { var d = ka("ng-" + c); yb[d] = function () { return { priority: 100, link: function (a, f, g) { a.$watch(g[d], function (a) { g.$set(c, !!a) }) } } } } }); r(["src",
    "srcset", "href"], function (a) { var c = ka("ng-" + a); yb[c] = function () { return { priority: 99, link: function (d, e, f) { var g = a, h = a; "href" === a && "[object SVGAnimatedString]" === ta.call(e.prop("href")) && (h = "xlinkHref", f.$attr[h] = "xlink:href", g = null); f.$observe(c, function (a) { a && (f.$set(h, a), P && g && e.prop(g, f[h])) }) } } } }); var rb = { $addControl: B, $removeControl: B, $setValidity: B, $setDirty: B, $setPristine: B }; Mc.$inject = ["$element", "$attrs", "$scope", "$animate"]; var Oc = function (a) {
        return ["$timeout", function (c) {
            return {
                name: "form",
                restrict: a ? "EAC" : "E", controller: Mc, compile: function () { return { pre: function (a, e, f, g) { if (!f.action) { var h = function (a) { a.preventDefault ? a.preventDefault() : a.returnValue = !1 }; Nc(e[0], "submit", h); e.on("$destroy", function () { c(function () { Db(e[0], "submit", h) }, 0, !1) }) } var m = e.parent().controller("form"), k = f.name || f.ngForm; k && nb(a, k, g, k); if (m) e.on("$destroy", function () { m.$removeControl(g); k && nb(a, k, s, k); v(g, rb) }) } } }
            }
        }]
    }, bd = Oc(), od = Oc(!0), Ke = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
    Le = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i, Me = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/, Pc = {
        text: tb, number: function (a, c, d, e, f, g) {
            tb(a, c, d, e, f, g); e.$parsers.push(function (a) { var c = e.$isEmpty(a); if (c || Me.test(a)) return e.$setValidity("number", !0), "" === a ? null : c ? a : parseFloat(a); e.$setValidity("number", !1); return s }); Fe(e, "number", c); e.$formatters.push(function (a) { return e.$isEmpty(a) ? "" : "" + a }); d.min && (a = function (a) { var c = parseFloat(d.min); return na(e, "min", e.$isEmpty(a) || a >= c, a) }, e.$parsers.push(a),
            e.$formatters.push(a)); d.max && (a = function (a) { var c = parseFloat(d.max); return na(e, "max", e.$isEmpty(a) || a <= c, a) }, e.$parsers.push(a), e.$formatters.push(a)); e.$formatters.push(function (a) { return na(e, "number", e.$isEmpty(a) || ub(a), a) })
        }, url: function (a, c, d, e, f, g) { tb(a, c, d, e, f, g); a = function (a) { return na(e, "url", e.$isEmpty(a) || Ke.test(a), a) }; e.$formatters.push(a); e.$parsers.push(a) }, email: function (a, c, d, e, f, g) {
            tb(a, c, d, e, f, g); a = function (a) { return na(e, "email", e.$isEmpty(a) || Le.test(a), a) }; e.$formatters.push(a);
            e.$parsers.push(a)
        }, radio: function (a, c, d, e) { E(d.name) && c.attr("name", ab()); c.on("click", function () { c[0].checked && a.$apply(function () { e.$setViewValue(d.value) }) }); e.$render = function () { c[0].checked = d.value == e.$viewValue }; d.$observe("value", e.$render) }, checkbox: function (a, c, d, e) {
            var f = d.ngTrueValue, g = d.ngFalseValue; x(f) || (f = !0); x(g) || (g = !1); c.on("click", function () { a.$apply(function () { e.$setViewValue(c[0].checked) }) }); e.$render = function () { c[0].checked = e.$viewValue }; e.$isEmpty = function (a) { return a !== f };
            e.$formatters.push(function (a) { return a === f }); e.$parsers.push(function (a) { return a ? f : g })
        }, hidden: B, button: B, submit: B, reset: B, file: B
    }, bc = ["$browser", "$sniffer", function (a, c) { return { restrict: "E", require: "?ngModel", link: function (d, e, f, g) { g && (Pc[O(f.type)] || Pc.text)(d, e, f, g, c, a) } } }], qb = "ng-valid", pb = "ng-invalid", Ka = "ng-pristine", sb = "ng-dirty", Ne = ["$scope", "$exceptionHandler", "$attrs", "$element", "$parse", "$animate", function (a, c, d, e, f, g) {
        function h(a, c) {
            c = c ? "-" + eb(c, "-") : ""; g.removeClass(e, (a ? pb : qb) + c);
            g.addClass(e, (a ? qb : pb) + c)
        } this.$modelValue = this.$viewValue = Number.NaN; this.$parsers = []; this.$formatters = []; this.$viewChangeListeners = []; this.$pristine = !0; this.$dirty = !1; this.$valid = !0; this.$invalid = !1; this.$name = d.name; var m = f(d.ngModel), k = m.assign; if (!k) throw z("ngModel")("nonassign", d.ngModel, fa(e)); this.$render = B; this.$isEmpty = function (a) { return E(a) || "" === a || null === a || a !== a }; var l = e.inheritedData("$formController") || rb, n = 0, q = this.$error = {}; e.addClass(Ka); h(!0); this.$setValidity = function (a, c) {
            q[a] !==
            !c && (c ? (q[a] && n--, n || (h(!0), this.$valid = !0, this.$invalid = !1)) : (h(!1), this.$invalid = !0, this.$valid = !1, n++), q[a] = !c, h(c, a), l.$setValidity(a, c, this))
        }; this.$setPristine = function () { this.$dirty = !1; this.$pristine = !0; g.removeClass(e, sb); g.addClass(e, Ka) }; this.$setViewValue = function (d) {
            this.$viewValue = d; this.$pristine && (this.$dirty = !0, this.$pristine = !1, g.removeClass(e, Ka), g.addClass(e, sb), l.$setDirty()); r(this.$parsers, function (a) { d = a(d) }); this.$modelValue !== d && (this.$modelValue = d, k(a, d), r(this.$viewChangeListeners,
            function (a) { try { a() } catch (d) { c(d) } }))
        }; var p = this; a.$watch(function () { var c = m(a); if (p.$modelValue !== c) { var d = p.$formatters, e = d.length; for (p.$modelValue = c; e--;) c = d[e](c); p.$viewValue !== c && (p.$viewValue = c, p.$render()) } return c })
    }], Dd = function () { return { require: ["ngModel", "^?form"], controller: Ne, link: function (a, c, d, e) { var f = e[0], g = e[1] || rb; g.$addControl(f); a.$on("$destroy", function () { g.$removeControl(f) }) } } }, Fd = Y({ require: "ngModel", link: function (a, c, d, e) { e.$viewChangeListeners.push(function () { a.$eval(d.ngChange) }) } }),
    cc = function () { return { require: "?ngModel", link: function (a, c, d, e) { if (e) { d.required = !0; var f = function (a) { if (d.required && e.$isEmpty(a)) e.$setValidity("required", !1); else return e.$setValidity("required", !0), a }; e.$formatters.push(f); e.$parsers.unshift(f); d.$observe("required", function () { f(e.$viewValue) }) } } } }, Ed = function () {
        return {
            require: "ngModel", link: function (a, c, d, e) {
                var f = (a = /\/(.*)\//.exec(d.ngList)) && RegExp(a[1]) || d.ngList || ","; e.$parsers.push(function (a) {
                    if (!E(a)) {
                        var c = []; a && r(a.split(f), function (a) {
                            a &&
                            c.push(aa(a))
                        }); return c
                    }
                }); e.$formatters.push(function (a) { return M(a) ? a.join(", ") : s }); e.$isEmpty = function (a) { return !a || !a.length }
            }
        }
    }, Oe = /^(true|false|\d+)$/, Gd = function () { return { priority: 100, compile: function (a, c) { return Oe.test(c.ngValue) ? function (a, c, f) { f.$set("value", a.$eval(f.ngValue)) } : function (a, c, f) { a.$watch(f.ngValue, function (a) { f.$set("value", a) }) } } } }, gd = sa(function (a, c, d) { c.addClass("ng-binding").data("$binding", d.ngBind); a.$watch(d.ngBind, function (a) { c.text(a == s ? "" : a) }) }), id = ["$interpolate",
    function (a) { return function (c, d, e) { c = a(d.attr(e.$attr.ngBindTemplate)); d.addClass("ng-binding").data("$binding", c); e.$observe("ngBindTemplate", function (a) { d.text(a) }) } }], hd = ["$sce", "$parse", function (a, c) { return function (d, e, f) { e.addClass("ng-binding").data("$binding", f.ngBindHtml); var g = c(f.ngBindHtml); d.$watch(function () { return (g(d) || "").toString() }, function (c) { e.html(a.getTrustedHtml(g(d)) || "") }) } }], jd = Nb("", !0), ld = Nb("Odd", 0), kd = Nb("Even", 1), md = sa({ compile: function (a, c) { c.$set("ngCloak", s); a.removeClass("ng-cloak") } }),
    nd = [function () { return { scope: !0, controller: "@", priority: 500 } }], dc = {}; r("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "), function (a) { var c = ka("ng-" + a); dc[c] = ["$parse", function (d) { return { compile: function (e, f) { var g = d(f[c]); return function (c, d, e) { d.on(O(a), function (a) { c.$apply(function () { g(c, { $event: a }) }) }) } } } }] }); var qd = ["$animate", function (a) {
        return {
            transclude: "element", priority: 600, terminal: !0, restrict: "A",
            $$tlb: !0, link: function (c, d, e, f, g) { var h, m, k; c.$watch(e.ngIf, function (f) { Pa(f) ? m || (m = c.$new(), g(m, function (c) { c[c.length++] = T.createComment(" end ngIf: " + e.ngIf + " "); h = { clone: c }; a.enter(c, d.parent(), d) })) : (k && (k.remove(), k = null), m && (m.$destroy(), m = null), h && (k = xb(h.clone), a.leave(k, function () { k = null }), h = null)) }) }
        }
    }], rd = ["$http", "$templateCache", "$anchorScroll", "$animate", "$sce", function (a, c, d, e, f) {
        return {
            restrict: "ECA", priority: 400, terminal: !0, transclude: "element", controller: Ca.noop, compile: function (g,
            h) {
                var m = h.ngInclude || h.src, k = h.onload || "", l = h.autoscroll; return function (g, h, p, r, s) {
                    var v = 0, A, w, F, y = function () { w && (w.remove(), w = null); A && (A.$destroy(), A = null); F && (e.leave(F, function () { w = null }), w = F, F = null) }; g.$watch(f.parseAsResourceUrl(m), function (f) {
                        var m = function () { !u(l) || l && !g.$eval(l) || d() }, p = ++v; f ? (a.get(f, { cache: c }).success(function (a) { if (p === v) { var c = g.$new(); r.template = a; a = s(c, function (a) { y(); e.enter(a, null, h, m) }); A = c; F = a; A.$emit("$includeContentLoaded"); g.$eval(k) } }).error(function () {
                            p ===
                            v && y()
                        }), g.$emit("$includeContentRequested")) : (y(), r.template = null)
                    })
                }
            }
        }
    }], Hd = ["$compile", function (a) { return { restrict: "ECA", priority: -400, require: "ngInclude", link: function (c, d, e, f) { d.html(f.template); a(d.contents())(c) } } }], sd = sa({ priority: 450, compile: function () { return { pre: function (a, c, d) { a.$eval(d.ngInit) } } } }), td = sa({ terminal: !0, priority: 1E3 }), ud = ["$locale", "$interpolate", function (a, c) {
        var d = /{}/g; return {
            restrict: "EA", link: function (e, f, g) {
                var h = g.count, m = g.$attr.when && f.attr(g.$attr.when), k = g.offset ||
                0, l = e.$eval(m) || {}, n = {}, q = c.startSymbol(), p = c.endSymbol(), t = /^when(Minus)?(.+)$/; r(g, function (a, c) { t.test(c) && (l[O(c.replace("when", "").replace("Minus", "-"))] = f.attr(g.$attr[c])) }); r(l, function (a, e) { n[e] = c(a.replace(d, q + h + "-" + k + p)) }); e.$watch(function () { var c = parseFloat(e.$eval(h)); if (isNaN(c)) return ""; c in l || (c = a.pluralCat(c - k)); return n[c](e, f, !0) }, function (a) { f.text(a) })
            }
        }
    }], vd = ["$parse", "$animate", function (a, c) {
        var d = z("ngRepeat"); return {
            transclude: "element", priority: 1E3, terminal: !0, $$tlb: !0,
            link: function (e, f, g, h, m) {
                var k = g.ngRepeat, l = k.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/), n, q, p, t, s, v, u = { $id: Ga }; if (!l) throw d("iexp", k); g = l[1]; h = l[2]; (l = l[3]) ? (n = a(l), q = function (a, c, d) { v && (u[v] = a); u[s] = c; u.$index = d; return n(e, u) }) : (p = function (a, c) { return Ga(c) }, t = function (a) { return a }); l = g.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/); if (!l) throw d("iidexp", g); s = l[3] || l[1]; v = l[2]; var J = {}; e.$watchCollection(h, function (a) {
                    var g, h, l = f[0], n, u = {}, A, I, x, B, E, K,
                    z = []; if ($a(a)) E = a, n = q || p; else { n = q || t; E = []; for (x in a) a.hasOwnProperty(x) && "$" != x.charAt(0) && E.push(x); E.sort() } A = E.length; h = z.length = E.length; for (g = 0; g < h; g++) if (x = a === E ? g : E[g], B = a[x], B = n(x, B, g), xa(B, "`track by` id"), J.hasOwnProperty(B)) K = J[B], delete J[B], u[B] = K, z[g] = K; else { if (u.hasOwnProperty(B)) throw r(z, function (a) { a && a.scope && (J[a.id] = a) }), d("dupes", k, B); z[g] = { id: B }; u[B] = !1 } for (x in J) J.hasOwnProperty(x) && (K = J[x], g = xb(K.clone), c.leave(g), r(g, function (a) { a.$$NG_REMOVED = !0 }), K.scope.$destroy());
                    g = 0; for (h = E.length; g < h; g++) {
                        x = a === E ? g : E[g]; B = a[x]; K = z[g]; z[g - 1] && (l = z[g - 1].clone[z[g - 1].clone.length - 1]); if (K.scope) { I = K.scope; n = l; do n = n.nextSibling; while (n && n.$$NG_REMOVED); K.clone[0] != n && c.move(xb(K.clone), null, w(l)); l = K.clone[K.clone.length - 1] } else I = e.$new(); I[s] = B; v && (I[v] = x); I.$index = g; I.$first = 0 === g; I.$last = g === A - 1; I.$middle = !(I.$first || I.$last); I.$odd = !(I.$even = 0 === (g & 1)); K.scope || m(I, function (a) {
                            a[a.length++] = T.createComment(" end ngRepeat: " + k + " "); c.enter(a, null, w(l)); l = a; K.scope = I; K.clone =
                            a; u[K.id] = K
                        })
                    } J = u
                })
            }
        }
    }], wd = ["$animate", function (a) { return function (c, d, e) { c.$watch(e.ngShow, function (c) { a[Pa(c) ? "removeClass" : "addClass"](d, "ng-hide") }) } }], pd = ["$animate", function (a) { return function (c, d, e) { c.$watch(e.ngHide, function (c) { a[Pa(c) ? "addClass" : "removeClass"](d, "ng-hide") }) } }], xd = sa(function (a, c, d) { a.$watch(d.ngStyle, function (a, d) { d && a !== d && r(d, function (a, d) { c.css(d, "") }); a && c.css(a) }, !0) }), yd = ["$animate", function (a) {
        return {
            restrict: "EA", require: "ngSwitch", controller: ["$scope", function () {
                this.cases =
                {}
            }], link: function (c, d, e, f) { var g, h, m, k = []; c.$watch(e.ngSwitch || e.on, function (d) { var n, q = k.length; if (0 < q) { if (m) { for (n = 0; n < q; n++) m[n].remove(); m = null } m = []; for (n = 0; n < q; n++) { var p = h[n]; k[n].$destroy(); m[n] = p; a.leave(p, function () { m.splice(n, 1); 0 === m.length && (m = null) }) } } h = []; k = []; if (g = f.cases["!" + d] || f.cases["?"]) c.$eval(e.change), r(g, function (d) { var e = c.$new(); k.push(e); d.transclude(e, function (c) { var e = d.element; h.push(c); a.enter(c, e.parent(), e) }) }) }) }
        }
    }], zd = sa({
        transclude: "element", priority: 800, require: "^ngSwitch",
        link: function (a, c, d, e, f) { e.cases["!" + d.ngSwitchWhen] = e.cases["!" + d.ngSwitchWhen] || []; e.cases["!" + d.ngSwitchWhen].push({ transclude: f, element: c }) }
    }), Ad = sa({ transclude: "element", priority: 800, require: "^ngSwitch", link: function (a, c, d, e, f) { e.cases["?"] = e.cases["?"] || []; e.cases["?"].push({ transclude: f, element: c }) } }), Cd = sa({ link: function (a, c, d, e, f) { if (!f) throw z("ngTransclude")("orphan", fa(c)); f(function (a) { c.empty(); c.append(a) }) } }), cd = ["$templateCache", function (a) {
        return {
            restrict: "E", terminal: !0, compile: function (c,
            d) { "text/ng-template" == d.type && a.put(d.id, c[0].text) }
        }
    }], Pe = z("ngOptions"), Bd = Y({ terminal: !0 }), dd = ["$compile", "$parse", function (a, c) {
        var d = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/, e = { $setViewValue: B }; return {
            restrict: "E", require: ["select", "?ngModel"], controller: ["$element", "$scope", "$attrs", function (a, c, d) {
                var m = this, k = {}, l = e, n; m.databound =
                d.ngModel; m.init = function (a, c, d) { l = a; n = d }; m.addOption = function (c) { xa(c, '"option value"'); k[c] = !0; l.$viewValue == c && (a.val(c), n.parent() && n.remove()) }; m.removeOption = function (a) { this.hasOption(a) && (delete k[a], l.$viewValue == a && this.renderUnknownOption(a)) }; m.renderUnknownOption = function (c) { c = "? " + Ga(c) + " ?"; n.val(c); a.prepend(n); a.val(c); n.prop("selected", !0) }; m.hasOption = function (a) { return k.hasOwnProperty(a) }; c.$on("$destroy", function () { m.renderUnknownOption = B })
            }], link: function (e, g, h, m) {
                function k(a,
                c, d, e) { d.$render = function () { var a = d.$viewValue; e.hasOption(a) ? (z.parent() && z.remove(), c.val(a), "" === a && x.prop("selected", !0)) : E(a) && x ? c.val("") : e.renderUnknownOption(a) }; c.on("change", function () { a.$apply(function () { z.parent() && z.remove(); d.$setViewValue(c.val()) }) }) } function l(a, c, d) {
                    var e; d.$render = function () { var a = new Ua(d.$viewValue); r(c.find("option"), function (c) { c.selected = u(a.get(c.value)) }) }; a.$watch(function () { ua(e, d.$viewValue) || (e = $(d.$viewValue), d.$render()) }); c.on("change", function () {
                        a.$apply(function () {
                            var a =
                            []; r(c.find("option"), function (c) { c.selected && a.push(c.value) }); d.$setViewValue(a)
                        })
                    })
                } function n(e, f, g) {
                    function h() {
                        var a = { "": [] }, c = [""], d, k, s, t, z; t = g.$modelValue; z = y(e) || []; var E = n ? Ob(z) : z, I, C, D; C = {}; s = !1; var F, L; if (p) if (w && M(t)) for (s = new Ua([]), D = 0; D < t.length; D++) C[m] = t[D], s.put(w(e, C), t[D]); else s = new Ua(t); for (D = 0; I = E.length, D < I; D++) {
                            k = D; if (n) { k = E[D]; if ("$" === k.charAt(0)) continue; C[n] = k } C[m] = z[k]; d = q(e, C) || ""; (k = a[d]) || (k = a[d] = [], c.push(d)); p ? d = u(s.remove(w ? w(e, C) : r(e, C))) : (w ? (d = {}, d[m] = t, d =
                            w(e, d) === w(e, C)) : d = t === r(e, C), s = s || d); F = l(e, C); F = u(F) ? F : ""; k.push({ id: w ? w(e, C) : n ? E[D] : D, label: F, selected: d })
                        } p || (v || null === t ? a[""].unshift({ id: "", label: "", selected: !s }) : s || a[""].unshift({ id: "?", label: "", selected: !0 })); C = 0; for (E = c.length; C < E; C++) {
                            d = c[C]; k = a[d]; x.length <= C ? (t = { element: B.clone().attr("label", d), label: k.label }, z = [t], x.push(z), f.append(t.element)) : (z = x[C], t = z[0], t.label != d && t.element.attr("label", t.label = d)); F = null; D = 0; for (I = k.length; D < I; D++) s = k[D], (d = z[D + 1]) ? (F = d.element, d.label !== s.label &&
                            F.text(d.label = s.label), d.id !== s.id && F.val(d.id = s.id), d.selected !== s.selected && F.prop("selected", d.selected = s.selected)) : ("" === s.id && v ? L = v : (L = A.clone()).val(s.id).attr("selected", s.selected).text(s.label), z.push({ element: L, label: s.label, id: s.id, selected: s.selected }), F ? F.after(L) : t.element.append(L), F = L); for (D++; z.length > D;) z.pop().element.remove()
                        } for (; x.length > C;) x.pop()[0].element.remove()
                    } var k; if (!(k = t.match(d))) throw Pe("iexp", t, fa(f)); var l = c(k[2] || k[1]), m = k[4] || k[6], n = k[5], q = c(k[3] || ""), r =
                    c(k[2] ? k[1] : m), y = c(k[7]), w = k[8] ? c(k[8]) : null, x = [[{ element: f, label: "" }]]; v && (a(v)(e), v.removeClass("ng-scope"), v.remove()); f.empty(); f.on("change", function () {
                        e.$apply(function () {
                            var a, c = y(e) || [], d = {}, h, k, l, q, t, v, u; if (p) for (k = [], q = 0, v = x.length; q < v; q++) for (a = x[q], l = 1, t = a.length; l < t; l++) { if ((h = a[l].element)[0].selected) { h = h.val(); n && (d[n] = h); if (w) for (u = 0; u < c.length && (d[m] = c[u], w(e, d) != h) ; u++); else d[m] = c[h]; k.push(r(e, d)) } } else {
                                h = f.val(); if ("?" == h) k = s; else if ("" === h) k = null; else if (w) for (u = 0; u < c.length; u++) {
                                    if (d[m] =
                                    c[u], w(e, d) == h) { k = r(e, d); break }
                                } else d[m] = c[h], n && (d[n] = h), k = r(e, d); 1 < x[0].length && x[0][1].id !== h && (x[0][1].selected = !1)
                            } g.$setViewValue(k)
                        })
                    }); g.$render = h; e.$watch(h)
                } if (m[1]) { var q = m[0]; m = m[1]; var p = h.multiple, t = h.ngOptions, v = !1, x, A = w(T.createElement("option")), B = w(T.createElement("optgroup")), z = A.clone(); h = 0; for (var y = g.children(), D = y.length; h < D; h++) if ("" === y[h].value) { x = v = y.eq(h); break } q.init(m, v, z); p && (m.$isEmpty = function (a) { return !a || 0 === a.length }); t ? n(e, g, m) : p ? l(e, g, m) : k(e, g, m, q) }
            }
        }
    }], fd = ["$interpolate",
    function (a) { var c = { addOption: B, removeOption: B }; return { restrict: "E", priority: 100, compile: function (d, e) { if (E(e.value)) { var f = a(d.text(), !0); f || e.$set("value", d.text()) } return function (a, d, e) { var k = d.parent(), l = k.data("$selectController") || k.parent().data("$selectController"); l && l.databound ? d.prop("selected", !1) : l = c; f ? a.$watch(f, function (a, c) { e.$set("value", a); a !== c && l.removeOption(c); l.addOption(a) }) : l.addOption(e.value); d.on("$destroy", function () { l.removeOption(e.value) }) } } } }], ed = Y({ restrict: "E", terminal: !0 });
    Q.angular.bootstrap ? console.log("WARNING: Tried to load angular more than once.") : ((Ea = Q.jQuery) ? (w = Ea, v(Ea.fn, { scope: Ha.scope, isolateScope: Ha.isolateScope, controller: Ha.controller, injector: Ha.injector, inheritedData: Ha.inheritedData }), zb("remove", !0, !0, !1), zb("empty", !1, !1, !1), zb("html", !1, !1, !0)) : w = L, Ca.element = w, Xc(Ca), w(T).ready(function () { Uc(T, Yb) }))
})(window, document); !angular.$$csp() && angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-block-transitions{transition:0s all!important;-webkit-transition:0s all!important;}</style>');
//# sourceMappingURL=angular.min.js.map
//----------------------------------------------------------------------------------------------------
/*File: Script/App/directive.js*/
angular.module('AjaxLoaderServices', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('myHttpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            // todo start the spinner here
            //alert('start spinner');
            $('#loader').show();
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
    // register the interceptor as a service, intercepts ALL angular ajax http calls
    .factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
                // Do something on success (Here hide the spinner)                
                $('#loader').hide();
                return response;

            }, function (response) {
                // Do something on error (Here hide the spinner)
                $('#loader').hide();
                return $q.reject(response);
            });
        };
    });
//--------------------------------------------------------------------------------------------------
/*File: Script/Vendor/ngRoute.js*/
/*
 AngularJS v1.2.26
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function (n, e, A) {
    'use strict'; function x(s, g, h) {
        return {
            restrict: "ECA", terminal: !0, priority: 400, transclude: "element", link: function (a, c, b, f, w) {
                function y() { p && (p.remove(), p = null); k && (k.$destroy(), k = null); l && (h.leave(l, function () { p = null }), p = l, l = null) } function v() { var b = s.current && s.current.locals; if (e.isDefined(b && b.$template)) { var b = a.$new(), d = s.current; l = w(b, function (d) { h.enter(d, null, l || c, function () { !e.isDefined(t) || t && !a.$eval(t) || g() }); y() }); k = d.scope = b; k.$emit("$viewContentLoaded"); k.$eval(u) } else y() }
                var k, l, p, t = b.autoscroll, u = b.onload || ""; a.$on("$routeChangeSuccess", v); v()
            }
        }
    } function z(e, g, h) { return { restrict: "ECA", priority: -400, link: function (a, c) { var b = h.current, f = b.locals; c.html(f.$template); var w = e(c.contents()); b.controller && (f.$scope = a, f = g(b.controller, f), b.controllerAs && (a[b.controllerAs] = f), c.data("$ngControllerController", f), c.children().data("$ngControllerController", f)); w(a) } } } n = e.module("ngRoute", ["ng"]).provider("$route", function () {
        function s(a, c) {
            return e.extend(new (e.extend(function () { },
            { prototype: a })), c)
        } function g(a, e) { var b = e.caseInsensitiveMatch, f = { originalPath: a, regexp: a }, h = f.keys = []; a = a.replace(/([().])/g, "\\$1").replace(/(\/)?:(\w+)([\?\*])?/g, function (a, e, b, c) { a = "?" === c ? c : null; c = "*" === c ? c : null; h.push({ name: b, optional: !!a }); e = e || ""; return "" + (a ? "" : e) + "(?:" + (a ? e : "") + (c && "(.+?)" || "([^/]+)") + (a || "") + ")" + (a || "") }).replace(/([\/$\*])/g, "\\$1"); f.regexp = RegExp("^" + a + "$", b ? "i" : ""); return f } var h = {}; this.when = function (a, c) {
            h[a] = e.extend({ reloadOnSearch: !0 }, c, a && g(a, c)); if (a) {
                var b =
                "/" == a[a.length - 1] ? a.substr(0, a.length - 1) : a + "/"; h[b] = e.extend({ redirectTo: a }, g(b, c))
            } return this
        }; this.otherwise = function (a) { this.when(null, a); return this }; this.$get = ["$rootScope", "$location", "$routeParams", "$q", "$injector", "$http", "$templateCache", "$sce", function (a, c, b, f, g, n, v, k) {
            function l() {
                var d = p(), m = r.current; if (d && m && d.$$route === m.$$route && e.equals(d.pathParams, m.pathParams) && !d.reloadOnSearch && !u) m.params = d.params, e.copy(m.params, b), a.$broadcast("$routeUpdate", m); else if (d || m) u = !1, a.$broadcast("$routeChangeStart",
                d, m), (r.current = d) && d.redirectTo && (e.isString(d.redirectTo) ? c.path(t(d.redirectTo, d.params)).search(d.params).replace() : c.url(d.redirectTo(d.pathParams, c.path(), c.search())).replace()), f.when(d).then(function () {
                    if (d) {
                        var a = e.extend({}, d.resolve), c, b; e.forEach(a, function (d, c) { a[c] = e.isString(d) ? g.get(d) : g.invoke(d) }); e.isDefined(c = d.template) ? e.isFunction(c) && (c = c(d.params)) : e.isDefined(b = d.templateUrl) && (e.isFunction(b) && (b = b(d.params)), b = k.getTrustedResourceUrl(b), e.isDefined(b) && (d.loadedTemplateUrl =
                        b, c = n.get(b, { cache: v }).then(function (a) { return a.data }))); e.isDefined(c) && (a.$template = c); return f.all(a)
                    }
                }).then(function (c) { d == r.current && (d && (d.locals = c, e.copy(d.params, b)), a.$broadcast("$routeChangeSuccess", d, m)) }, function (c) { d == r.current && a.$broadcast("$routeChangeError", d, m, c) })
            } function p() {
                var a, b; e.forEach(h, function (f, h) {
                    var q; if (q = !b) {
                        var g = c.path(); q = f.keys; var l = {}; if (f.regexp) if (g = f.regexp.exec(g)) { for (var k = 1, p = g.length; k < p; ++k) { var n = q[k - 1], r = g[k]; n && r && (l[n.name] = r) } q = l } else q = null;
                        else q = null; q = a = q
                    } q && (b = s(f, { params: e.extend({}, c.search(), a), pathParams: a }), b.$$route = f)
                }); return b || h[null] && s(h[null], { params: {}, pathParams: {} })
            } function t(a, c) { var b = []; e.forEach((a || "").split(":"), function (a, d) { if (0 === d) b.push(a); else { var e = a.match(/(\w+)(.*)/), f = e[1]; b.push(c[f]); b.push(e[2] || ""); delete c[f] } }); return b.join("") } var u = !1, r = { routes: h, reload: function () { u = !0; a.$evalAsync(l) } }; a.$on("$locationChangeSuccess", l); return r
        }]
    }); n.provider("$routeParams", function () { this.$get = function () { return {} } });
    n.directive("ngView", x); n.directive("ngView", z); x.$inject = ["$route", "$anchorScroll", "$animate"]; z.$inject = ["$compile", "$controller", "$route"]
})(window, window.angular);
//# sourceMappingURL=angular-route.min.js.map
//----------------------------------------------------------------------------------------------------------------------------
/*File: Script/Vendor/angular-sanitize.js*/
/**
 * @license AngularJS v1.2.10
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function (window, angular, undefined) {
    'use strict';

    var $sanitizeMinErr = angular.$$minErr('$sanitize');

    /**
     * @ngdoc overview
     * @name ngSanitize
     * @description
     *
     * # ngSanitize
     *
     * The `ngSanitize` module provides functionality to sanitize HTML.
     *
     * {@installModule sanitize}
     *
     * <div doc-module-components="ngSanitize"></div>
     *
     * See {@link ngSanitize.$sanitize `$sanitize`} for usage.
     */

    /*
     * HTML Parser By Misko Hevery (misko@hevery.com)
     * based on:  HTML Parser By John Resig (ejohn.org)
     * Original code by Erik Arvidsson, Mozilla Public License
     * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
     *
     * // Use like so:
     * htmlParser(htmlString, {
     *     start: function(tag, attrs, unary) {},
     *     end: function(tag) {},
     *     chars: function(text) {},
     *     comment: function(text) {}
     * });
     *
     */


    /**
     * @ngdoc service
     * @name ngSanitize.$sanitize
     * @function
     *
     * @description
     *   The input is sanitized by parsing the html into tokens. All safe tokens (from a whitelist) are
     *   then serialized back to properly escaped html string. This means that no unsafe input can make
     *   it into the returned string, however, since our parser is more strict than a typical browser
     *   parser, it's possible that some obscure input, which would be recognized as valid HTML by a
     *   browser, won't make it through the sanitizer.
     *   The whitelist is configured using the functions `aHrefSanitizationWhitelist` and
     *   `imgSrcSanitizationWhitelist` of {@link ng.$compileProvider `$compileProvider`}.
     *
     * @param {string} html Html input.
     * @returns {string} Sanitized html.
     *
     * @example
       <doc:example module="ngSanitize">
       <doc:source>
         <script>
           function Ctrl($scope, $sce) {
             $scope.snippet =
               '<p style="color:blue">an html\n' +
               '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
               'snippet</p>';
             $scope.deliberatelyTrustDangerousSnippet = function() {
               return $sce.trustAsHtml($scope.snippet);
             };
           }
         </script>
         <div ng-controller="Ctrl">
            Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
           <table>
             <tr>
               <td>Directive</td>
               <td>How</td>
               <td>Source</td>
               <td>Rendered</td>
             </tr>
             <tr id="bind-html-with-sanitize">
               <td>ng-bind-html</td>
               <td>Automatically uses $sanitize</td>
               <td><pre>&lt;div ng-bind-html="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
               <td><div ng-bind-html="snippet"></div></td>
             </tr>
             <tr id="bind-html-with-trust">
               <td>ng-bind-html</td>
               <td>Bypass $sanitize by explicitly trusting the dangerous value</td>
               <td>
               <pre>&lt;div ng-bind-html="deliberatelyTrustDangerousSnippet()"&gt;
    &lt;/div&gt;</pre>
               </td>
               <td><div ng-bind-html="deliberatelyTrustDangerousSnippet()"></div></td>
             </tr>
             <tr id="bind-default">
               <td>ng-bind</td>
               <td>Automatically escapes</td>
               <td><pre>&lt;div ng-bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
               <td><div ng-bind="snippet"></div></td>
             </tr>
           </table>
           </div>
       </doc:source>
       <doc:scenario>
         it('should sanitize the html snippet by default', function() {
           expect(using('#bind-html-with-sanitize').element('div').html()).
             toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
         });
    
         it('should inline raw snippet if bound to a trusted value', function() {
           expect(using('#bind-html-with-trust').element("div").html()).
             toBe("<p style=\"color:blue\">an html\n" +
                  "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
                  "snippet</p>");
         });
    
         it('should escape snippet without any filter', function() {
           expect(using('#bind-default').element('div').html()).
             toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
                  "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
                  "snippet&lt;/p&gt;");
         });
    
         it('should update', function() {
           input('snippet').enter('new <b onclick="alert(1)">text</b>');
           expect(using('#bind-html-with-sanitize').element('div').html()).toBe('new <b>text</b>');
           expect(using('#bind-html-with-trust').element('div').html()).toBe(
             'new <b onclick="alert(1)">text</b>');
           expect(using('#bind-default').element('div').html()).toBe(
             "new &lt;b onclick=\"alert(1)\"&gt;text&lt;/b&gt;");
         });
       </doc:scenario>
       </doc:example>
     */
    function $SanitizeProvider() {
        this.$get = ['$$sanitizeUri', function ($$sanitizeUri) {
            return function (html) {
                var buf = [];
                htmlParser(html, htmlSanitizeWriter(buf, function (uri, isImage) {
                    return !/^unsafe/.test($$sanitizeUri(uri, isImage));
                }));
                return buf.join('');
            };
        }];
    }

    function sanitizeText(chars) {
        var buf = [];
        var writer = htmlSanitizeWriter(buf, angular.noop);
        writer.chars(chars);
        return buf.join('');
    }


    // Regular Expressions for parsing tags and attributes
    var START_TAG_REGEXP =
           /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,
      END_TAG_REGEXP = /^<\s*\/\s*([\w:-]+)[^>]*>/,
      ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
      BEGIN_TAG_REGEXP = /^</,
      BEGING_END_TAGE_REGEXP = /^<\s*\//,
      COMMENT_REGEXP = /<!--(.*?)-->/g,
      DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
      CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
      // Match everything outside of normal chars and " (quote character)
      NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;


    // Good source of info about elements and attributes
    // http://dev.w3.org/html5/spec/Overview.html#semantics
    // http://simon.html5.org/html-elements

    // Safe Void Elements - HTML5
    // http://dev.w3.org/html5/spec/Overview.html#void-elements
    var voidElements = makeMap("area,br,col,hr,img,wbr");

    // Elements that you can, intentionally, leave open (and which close themselves)
    // http://dev.w3.org/html5/spec/Overview.html#optional-tags
    var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
        optionalEndTagInlineElements = makeMap("rp,rt"),
        optionalEndTagElements = angular.extend({},
                                                optionalEndTagInlineElements,
                                                optionalEndTagBlockElements);

    // Safe Block Elements - HTML5
    var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap("address,article," +
            "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
            "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));

    // Inline Elements - HTML5
    var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," +
            "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
            "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));


    // Special Elements (can contain anything)
    var specialElements = makeMap("script,style");

    var validElements = angular.extend({},
                                       voidElements,
                                       blockElements,
                                       inlineElements,
                                       optionalEndTagElements);

    //Attributes that have href and hence need to be sanitized
    var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap");
    var validAttrs = angular.extend({}, uriAttrs, makeMap(
        'abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,' +
        'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,' +
        'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,' +
        'scope,scrolling,shape,size,span,start,summary,target,title,type,' +
        'valign,value,vspace,width'));

    function makeMap(str) {
        var obj = {}, items = str.split(','), i;
        for (i = 0; i < items.length; i++) obj[items[i]] = true;
        return obj;
    }


    /**
     * @example
     * htmlParser(htmlString, {
     *     start: function(tag, attrs, unary) {},
     *     end: function(tag) {},
     *     chars: function(text) {},
     *     comment: function(text) {}
     * });
     *
     * @param {string} html string
     * @param {object} handler
     */
    function htmlParser(html, handler) {
        var index, chars, match, stack = [], last = html;
        stack.last = function () { return stack[stack.length - 1]; };

        while (html) {
            chars = true;

            // Make sure we're not in a script or style element
            if (!stack.last() || !specialElements[stack.last()]) {

                // Comment
                if (html.indexOf("<!--") === 0) {
                    // comments containing -- are not allowed unless they terminate the comment
                    index = html.indexOf("--", 4);

                    if (index >= 0 && html.lastIndexOf("-->", index) === index) {
                        if (handler.comment) handler.comment(html.substring(4, index));
                        html = html.substring(index + 3);
                        chars = false;
                    }
                    // DOCTYPE
                } else if (DOCTYPE_REGEXP.test(html)) {
                    match = html.match(DOCTYPE_REGEXP);

                    if (match) {
                        html = html.replace(match[0], '');
                        chars = false;
                    }
                    // end tag
                } else if (BEGING_END_TAGE_REGEXP.test(html)) {
                    match = html.match(END_TAG_REGEXP);

                    if (match) {
                        html = html.substring(match[0].length);
                        match[0].replace(END_TAG_REGEXP, parseEndTag);
                        chars = false;
                    }

                    // start tag
                } else if (BEGIN_TAG_REGEXP.test(html)) {
                    match = html.match(START_TAG_REGEXP);

                    if (match) {
                        html = html.substring(match[0].length);
                        match[0].replace(START_TAG_REGEXP, parseStartTag);
                        chars = false;
                    }
                }

                if (chars) {
                    index = html.indexOf("<");

                    var text = index < 0 ? html : html.substring(0, index);
                    html = index < 0 ? "" : html.substring(index);

                    if (handler.chars) handler.chars(decodeEntities(text));
                }

            } else {
                html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'),
                  function (all, text) {
                      text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");

                      if (handler.chars) handler.chars(decodeEntities(text));

                      return "";
                  });

                parseEndTag("", stack.last());
            }

            if (html == last) {
                throw $sanitizeMinErr('badparse', "The sanitizer was unable to parse the following block " +
                                                  "of html: {0}", html);
            }
            last = html;
        }

        // Clean up any remaining tags
        parseEndTag();

        function parseStartTag(tag, tagName, rest, unary) {
            tagName = angular.lowercase(tagName);
            if (blockElements[tagName]) {
                while (stack.last() && inlineElements[stack.last()]) {
                    parseEndTag("", stack.last());
                }
            }

            if (optionalEndTagElements[tagName] && stack.last() == tagName) {
                parseEndTag("", tagName);
            }

            unary = voidElements[tagName] || !!unary;

            if (!unary)
                stack.push(tagName);

            var attrs = {};

            rest.replace(ATTR_REGEXP,
              function (match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
                  var value = doubleQuotedValue
                    || singleQuotedValue
                    || unquotedValue
                    || '';

                  attrs[name] = decodeEntities(value);
              });
            if (handler.start) handler.start(tagName, attrs, unary);
        }

        function parseEndTag(tag, tagName) {
            var pos = 0, i;
            tagName = angular.lowercase(tagName);
            if (tagName)
                // Find the closest opened tag of the same type
                for (pos = stack.length - 1; pos >= 0; pos--)
                    if (stack[pos] == tagName)
                        break;

            if (pos >= 0) {
                // Close all the open elements, up the stack
                for (i = stack.length - 1; i >= pos; i--)
                    if (handler.end) handler.end(stack[i]);

                // Remove the open elements from the stack
                stack.length = pos;
            }
        }
    }

    var hiddenPre = document.createElement("pre");
    var spaceRe = /^(\s*)([\s\S]*?)(\s*)$/;
    /**
     * decodes all entities into regular string
     * @param value
     * @returns {string} A string with decoded entities.
     */
    function decodeEntities(value) {
        if (!value) { return ''; }

        // Note: IE8 does not preserve spaces at the start/end of innerHTML
        // so we must capture them and reattach them afterward
        var parts = spaceRe.exec(value);
        var spaceBefore = parts[1];
        var spaceAfter = parts[3];
        var content = parts[2];
        if (content) {
            hiddenPre.innerHTML = content.replace(/</g, "&lt;");
            // innerText depends on styling as it doesn't display hidden elements.
            // Therefore, it's better to use textContent not to cause unnecessary
            // reflows. However, IE<9 don't support textContent so the innerText
            // fallback is necessary.
            content = 'textContent' in hiddenPre ?
              hiddenPre.textContent : hiddenPre.innerText;
        }
        return spaceBefore + content + spaceAfter;
    }

    /**
     * Escapes all potentially dangerous characters, so that the
     * resulting string can be safely inserted into attribute or
     * element text.
     * @param value
     * @returns escaped text
     */
    function encodeEntities(value) {
        return value.
          replace(/&/g, '&amp;').
          replace(NON_ALPHANUMERIC_REGEXP, function (value) {
              return '&#' + value.charCodeAt(0) + ';';
          }).
          replace(/</g, '&lt;').
          replace(/>/g, '&gt;');
    }

    /**
     * create an HTML/XML writer which writes to buffer
     * @param {Array} buf use buf.jain('') to get out sanitized html string
     * @returns {object} in the form of {
     *     start: function(tag, attrs, unary) {},
     *     end: function(tag) {},
     *     chars: function(text) {},
     *     comment: function(text) {}
     * }
     */
    function htmlSanitizeWriter(buf, uriValidator) {
        var ignore = false;
        var out = angular.bind(buf, buf.push);
        return {
            start: function (tag, attrs, unary) {
                tag = angular.lowercase(tag);
                if (!ignore && specialElements[tag]) {
                    ignore = tag;
                }
                if (!ignore && validElements[tag] === true) {
                    out('<');
                    out(tag);
                    angular.forEach(attrs, function (value, key) {
                        var lkey = angular.lowercase(key);
                        var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
                        if (validAttrs[lkey] === true &&
                          (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
                            out(' ');
                            out(key);
                            out('="');
                            out(encodeEntities(value));
                            out('"');
                        }
                    });
                    out(unary ? '/>' : '>');
                }
            },
            end: function (tag) {
                tag = angular.lowercase(tag);
                if (!ignore && validElements[tag] === true) {
                    out('</');
                    out(tag);
                    out('>');
                }
                if (tag == ignore) {
                    ignore = false;
                }
            },
            chars: function (chars) {
                if (!ignore) {
                    out(encodeEntities(chars));
                }
            }
        };
    }


    // define ngSanitize module and register $sanitize service
    angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);

    /* global sanitizeText: false */

    /**
     * @ngdoc filter
     * @name ngSanitize.filter:linky
     * @function
     *
     * @description
     * Finds links in text input and turns them into html links. Supports http/https/ftp/mailto and
     * plain email address links.
     *
     * Requires the {@link ngSanitize `ngSanitize`} module to be installed.
     *
     * @param {string} text Input text.
     * @param {string} target Window (_blank|_self|_parent|_top) or named frame to open links in.
     * @returns {string} Html-linkified text.
     *
     * @usage
       <span ng-bind-html="linky_expression | linky"></span>
     *
     * @example
       <doc:example module="ngSanitize">
         <doc:source>
           <script>
             function Ctrl($scope) {
               $scope.snippet =
                 'Pretty text with some links:\n'+
                 'http://angularjs.org/,\n'+
                 'mailto:us@somewhere.org,\n'+
                 'another@somewhere.org,\n'+
                 'and one more: ftp://127.0.0.1/.';
               $scope.snippetWithTarget = 'http://angularjs.org/';
             }
           </script>
           <div ng-controller="Ctrl">
           Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
           <table>
             <tr>
               <td>Filter</td>
               <td>Source</td>
               <td>Rendered</td>
             </tr>
             <tr id="linky-filter">
               <td>linky filter</td>
               <td>
                 <pre>&lt;div ng-bind-html="snippet | linky"&gt;<br>&lt;/div&gt;</pre>
               </td>
               <td>
                 <div ng-bind-html="snippet | linky"></div>
               </td>
             </tr>
             <tr id="linky-target">
              <td>linky target</td>
              <td>
                <pre>&lt;div ng-bind-html="snippetWithTarget | linky:'_blank'"&gt;<br>&lt;/div&gt;</pre>
              </td>
              <td>
                <div ng-bind-html="snippetWithTarget | linky:'_blank'"></div>
              </td>
             </tr>
             <tr id="escaped-html">
               <td>no filter</td>
               <td><pre>&lt;div ng-bind="snippet"&gt;<br>&lt;/div&gt;</pre></td>
               <td><div ng-bind="snippet"></div></td>
             </tr>
           </table>
         </doc:source>
         <doc:scenario>
           it('should linkify the snippet with urls', function() {
             expect(using('#linky-filter').binding('snippet | linky')).
               toBe('Pretty text with some links:&#10;' +
                    '<a href="http://angularjs.org/">http://angularjs.org/</a>,&#10;' +
                    '<a href="mailto:us@somewhere.org">us@somewhere.org</a>,&#10;' +
                    '<a href="mailto:another@somewhere.org">another@somewhere.org</a>,&#10;' +
                    'and one more: <a href="ftp://127.0.0.1/">ftp://127.0.0.1/</a>.');
           });
    
           it ('should not linkify snippet without the linky filter', function() {
             expect(using('#escaped-html').binding('snippet')).
               toBe("Pretty text with some links:\n" +
                    "http://angularjs.org/,\n" +
                    "mailto:us@somewhere.org,\n" +
                    "another@somewhere.org,\n" +
                    "and one more: ftp://127.0.0.1/.");
           });
    
           it('should update', function() {
             input('snippet').enter('new http://link.');
             expect(using('#linky-filter').binding('snippet | linky')).
               toBe('new <a href="http://link">http://link</a>.');
             expect(using('#escaped-html').binding('snippet')).toBe('new http://link.');
           });
    
           it('should work with the target property', function() {
            expect(using('#linky-target').binding("snippetWithTarget | linky:'_blank'")).
              toBe('<a target="_blank" href="http://angularjs.org/">http://angularjs.org/</a>');
           });
         </doc:scenario>
       </doc:example>
     */
    angular.module('ngSanitize').filter('linky', ['$sanitize', function ($sanitize) {
        var LINKY_URL_REGEXP =
              /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>]/,
            MAILTO_REGEXP = /^mailto:/;

        return function (text, target) {
            if (!text) return text;
            var match;
            var raw = text;
            var html = [];
            var url;
            var i;
            while ((match = raw.match(LINKY_URL_REGEXP))) {
                // We can not end in these as they are sometimes found at the end of the sentence
                url = match[0];
                // if we did not match ftp/http/mailto then assume mailto
                if (match[2] == match[3]) url = 'mailto:' + url;
                i = match.index;
                addText(raw.substr(0, i));
                addLink(url, match[0].replace(MAILTO_REGEXP, ''));
                raw = raw.substring(i + match[0].length);
            }
            addText(raw);
            return $sanitize(html.join(''));

            function addText(text) {
                if (!text) {
                    return;
                }
                html.push(sanitizeText(text));
            }

            function addLink(url, text) {
                html.push('<a ');
                if (angular.isDefined(target)) {
                    html.push('target="');
                    html.push(target);
                    html.push('" ');
                }
                html.push('href="');
                html.push(url);
                html.push('">');
                addText(text);
                html.push('</a>');
            }
        };
    }]);


})(window, window.angular);