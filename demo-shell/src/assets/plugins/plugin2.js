!(function(n, e) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = e(
        require('ng.common'),
        require('shared'),
        require('ng.core')
      ))
    : 'function' == typeof define && define.amd
    ? define(['ng.common', 'shared', 'ng.core'], e)
    : 'object' == typeof exports
    ? (exports.plugin2 = e(
        require('ng.common'),
        require('shared'),
        require('ng.core')
      ))
    : (n.plugin2 = e(n['ng.common'], n.shared, n['ng.core']));
})('undefined' != typeof self ? self : this, function(n, e, l) {
  return (function(n) {
    var e = {};
    function l(t) {
      if (e[t]) return e[t].exports;
      var u = (e[t] = { i: t, l: !1, exports: {} });
      return n[t].call(u.exports, u, u.exports, l), (u.l = !0), u.exports;
    }
    return (
      (l.m = n),
      (l.c = e),
      (l.d = function(n, e, t) {
        l.o(n, e) || Object.defineProperty(n, e, { enumerable: !0, get: t });
      }),
      (l.r = function(n) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(n, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(n, '__esModule', { value: !0 });
      }),
      (l.t = function(n, e) {
        if ((1 & e && (n = l(n)), 8 & e)) return n;
        if (4 & e && 'object' == typeof n && n && n.__esModule) return n;
        var t = Object.create(null);
        if (
          (l.r(t),
          Object.defineProperty(t, 'default', { enumerable: !0, value: n }),
          2 & e && 'string' != typeof n)
        )
          for (var u in n)
            l.d(
              t,
              u,
              function(e) {
                return n[e];
              }.bind(null, u)
            );
        return t;
      }),
      (l.n = function(n) {
        var e =
          n && n.__esModule
            ? function() {
                return n.default;
              }
            : function() {
                return n;
              };
        return l.d(e, 'a', e), e;
      }),
      (l.o = function(n, e) {
        return Object.prototype.hasOwnProperty.call(n, e);
      }),
      (l.p = ''),
      l((l.s = 0))
    );
  })({
    0: function(n, e, l) {
      n.exports = l('zUnb');
    },
    '0S4P': function(e, l) {
      e.exports = n;
    },
    cfyg: function(n, l) {
      n.exports = e;
    },
    vOrQ: function(n, e) {
      n.exports = l;
    },
    zUnb: function(n, e, l) {
      'use strict';
      l.r(e);
      var t = (function() {
          return function() {};
        })(),
        u = (function() {
          function n() {}
          return (n.entry = t), n;
        })(),
        o = l('vOrQ'),
        r = l('cfyg'),
        i = o['\u0275crt']({ encapsulation: 2, styles: [], data: {} });
      function d(n) {
        return o['\u0275vid'](
          0,
          [
            (n()(),
            o['\u0275eld'](
              0,
              0,
              null,
              null,
              1,
              'h3',
              [],
              null,
              null,
              null,
              null,
              null
            )),
            (n()(), o['\u0275ted'](-1, null, ['Plugin 2'])),
            (n()(),
            o['\u0275eld'](
              2,
              0,
              null,
              null,
              10,
              'shared-tabs',
              [],
              null,
              null,
              null,
              r['View_\u0275c_0'],
              r['RenderType_\u0275c']
            )),
            o['\u0275did'](3, 49152, null, 0, r['\u0275c'], [], null, null),
            (n()(),
            o['\u0275eld'](
              4,
              0,
              null,
              0,
              2,
              'shared-tab',
              [['title', 'Tab 1']],
              [[8, 'hidden', 0]],
              null,
              null,
              r['View_\u0275b_0'],
              r['RenderType_\u0275b']
            )),
            o['\u0275did'](
              5,
              49152,
              null,
              0,
              r['\u0275b'],
              [r['\u0275c']],
              { title: [0, 'title'] },
              null
            ),
            (n()(), o['\u0275ted'](-1, 0, [' Tab 1 contents '])),
            (n()(),
            o['\u0275eld'](
              7,
              0,
              null,
              0,
              2,
              'shared-tab',
              [['title', 'Tab 2']],
              [[8, 'hidden', 0]],
              null,
              null,
              r['View_\u0275b_0'],
              r['RenderType_\u0275b']
            )),
            o['\u0275did'](
              8,
              49152,
              null,
              0,
              r['\u0275b'],
              [r['\u0275c']],
              { title: [0, 'title'] },
              null
            ),
            (n()(), o['\u0275ted'](-1, 0, [' Tab 2 contents '])),
            (n()(),
            o['\u0275eld'](
              10,
              0,
              null,
              0,
              2,
              'shared-tab',
              [['title', 'Tab 3']],
              [[8, 'hidden', 0]],
              null,
              null,
              r['View_\u0275b_0'],
              r['RenderType_\u0275b']
            )),
            o['\u0275did'](
              11,
              49152,
              null,
              0,
              r['\u0275b'],
              [r['\u0275c']],
              { title: [0, 'title'] },
              null
            ),
            (n()(), o['\u0275ted'](-1, 0, [' Tab 3 contents ']))
          ],
          function(n, e) {
            n(e, 5, 0, 'Tab 1'), n(e, 8, 0, 'Tab 2'), n(e, 11, 0, 'Tab 3');
          },
          function(n, e) {
            n(e, 4, 0, o['\u0275nov'](e, 5).hidden),
              n(e, 7, 0, o['\u0275nov'](e, 8).hidden),
              n(e, 10, 0, o['\u0275nov'](e, 11).hidden);
          }
        );
      }
      function c(n) {
        return o['\u0275vid'](
          0,
          [
            (n()(),
            o['\u0275eld'](
              0,
              0,
              null,
              null,
              1,
              'app-plugin-2',
              [],
              null,
              null,
              null,
              d,
              i
            )),
            o['\u0275did'](1, 49152, null, 0, t, [], null, null)
          ],
          null,
          null
        );
      }
      var a = o['\u0275ccf']('app-plugin-2', t, c, {}, {}, []),
        f = l('0S4P'),
        p = o['\u0275cmf'](u, [], function(n) {
          return o['\u0275mod']([
            o['\u0275mpd'](
              512,
              o.ComponentFactoryResolver,
              o['\u0275CodegenComponentFactoryResolver'],
              [[8, [a]], [3, o.ComponentFactoryResolver], o.NgModuleRef]
            ),
            o['\u0275mpd'](4608, f.NgLocalization, f.NgLocaleLocalization, [
              o.LOCALE_ID,
              [2, f['\u0275angular_packages_common_common_a']]
            ]),
            o['\u0275mpd'](1073742336, f.CommonModule, f.CommonModule, []),
            o['\u0275mpd'](1073742336, r.SharedModule, r.SharedModule, []),
            o['\u0275mpd'](1073742336, u, u, [])
          ]);
        });
      l.d(e, 'Plugin2Module', function() {
        return u;
      }),
        l.d(e, 'Plugin2ModuleNgFactory', function() {
          return p;
        }),
        (e.default = p);
    }
  });
});
