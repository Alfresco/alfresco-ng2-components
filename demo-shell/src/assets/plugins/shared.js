!(function(n, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t(
        require('ng.common'),
        require('tslib'),
        require('ng.core')
      ))
    : 'function' == typeof define && define.amd
    ? define(['ng.common', 'tslib', 'ng.core'], t)
    : 'object' == typeof exports
    ? (exports.shared = t(
        require('ng.common'),
        require('tslib'),
        require('ng.core')
      ))
    : (n.shared = t(n['ng.common'], n.tslib, n['ng.core']));
})('undefined' != typeof self ? self : this, function(n, t, e) {
  return (function(n) {
    var t = {};
    function e(l) {
      if (t[l]) return t[l].exports;
      var u = (t[l] = { i: l, l: !1, exports: {} });
      return n[l].call(u.exports, u, u.exports, e), (u.l = !0), u.exports;
    }
    return (
      (e.m = n),
      (e.c = t),
      (e.d = function(n, t, l) {
        e.o(n, t) || Object.defineProperty(n, t, { enumerable: !0, get: l });
      }),
      (e.r = function(n) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(n, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(n, '__esModule', { value: !0 });
      }),
      (e.t = function(n, t) {
        if ((1 & t && (n = e(n)), 8 & t)) return n;
        if (4 & t && 'object' == typeof n && n && n.__esModule) return n;
        var l = Object.create(null);
        if (
          (e.r(l),
          Object.defineProperty(l, 'default', { enumerable: !0, value: n }),
          2 & t && 'string' != typeof n)
        )
          for (var u in n)
            e.d(
              l,
              u,
              function(t) {
                return n[t];
              }.bind(null, u)
            );
        return l;
      }),
      (e.n = function(n) {
        var t =
          n && n.__esModule
            ? function() {
                return n.default;
              }
            : function() {
                return n;
              };
        return e.d(t, 'a', t), t;
      }),
      (e.o = function(n, t) {
        return Object.prototype.hasOwnProperty.call(n, t);
      }),
      (e.p = ''),
      e((e.s = 0))
    );
  })({
    0: function(n, t, e) {
      n.exports = e('zUnb');
    },
    '0S4P': function(t, e) {
      t.exports = n;
    },
    '17wl': function(n, e) {
      n.exports = t;
    },
    vOrQ: function(n, t) {
      n.exports = e;
    },
    zUnb: function(n, t, e) {
      'use strict';
      e.r(t), e('17wl');
      var l = e('0S4P'),
        u = e('vOrQ'),
        o = (function() {
          return function() {};
        })(),
        r = (function() {
          function n() {
            (this.tabs = []), (this.selected = new u.EventEmitter());
          }
          return (
            (n.prototype.addTab = function(n) {
              this.tabs.length || (n.hidden = !1), this.tabs.push(n);
            }),
            (n.prototype.selectTab = function(n) {
              this.tabs.map(function(n) {
                return (n.hidden = !0);
              }),
                (n.hidden = !1),
                this.selected.emit(n);
            }),
            n
          );
        })(),
        i = (function() {
          return function(n) {
            (this.hidden = !0), n.addTab(this);
          };
        })(),
        c = (function() {
          return function() {};
        })(),
        d = (function() {
          return function() {};
        })(),
        a = u['\u0275cmf'](d, [], function(n) {
          return u['\u0275mod']([
            u['\u0275mpd'](
              512,
              u.ComponentFactoryResolver,
              u['\u0275CodegenComponentFactoryResolver'],
              [[8, []], [3, u.ComponentFactoryResolver], u.NgModuleRef]
            ),
            u['\u0275mpd'](4608, l.NgLocalization, l.NgLocaleLocalization, [
              u.LOCALE_ID,
              [2, l['\u0275angular_packages_common_common_a']]
            ]),
            u['\u0275mpd'](1073742336, l.CommonModule, l.CommonModule, []),
            u['\u0275mpd'](1073742336, d, d, [])
          ]);
        }),
        f = u['\u0275crt']({ encapsulation: 2, styles: [], data: {} });
      function s(n) {
        return u['\u0275vid'](
          0,
          [
            (n()(),
            u['\u0275eld'](
              0,
              0,
              null,
              null,
              1,
              'h4',
              [],
              null,
              null,
              null,
              null,
              null
            )),
            (n()(), u['\u0275ted'](-1, null, [' Shared component ']))
          ],
          null,
          null
        );
      }
      function p(n) {
        return u['\u0275vid'](
          0,
          [
            (n()(),
            u['\u0275eld'](
              0,
              0,
              null,
              null,
              1,
              'shared-component',
              [],
              null,
              null,
              null,
              s,
              f
            )),
            u['\u0275did'](1, 49152, null, 0, o, [], null, null)
          ],
          null,
          null
        );
      }
      var b = u['\u0275ccf']('shared-component', o, p, {}, {}, []),
        m = u['\u0275crt']({
          encapsulation: 0,
          styles: [
            '[_nghost-%COMP%]{padding:0 15px;border:1px solid #d8dde6;border-radius:6px;line-height:40px;cursor:pointer;background:#fff}[_nghost-%COMP%]:hover{background:#f3f7fb}'
          ],
          data: {}
        });
      function h(n) {
        return u['\u0275vid'](0, [u['\u0275ncd'](null, 0)], null, null);
      }
      function g(n) {
        return u['\u0275vid'](
          0,
          [
            (n()(),
            u['\u0275eld'](
              0,
              0,
              null,
              null,
              1,
              'button',
              [['sharedBtn', '']],
              null,
              null,
              null,
              h,
              m
            )),
            u['\u0275did'](1, 49152, null, 0, c, [], null, null)
          ],
          null,
          null
        );
      }
      var _ = u['\u0275ccf']('button[sharedBtn]', c, g, {}, {}, ['*']),
        y = u['\u0275crt']({ encapsulation: 2, styles: [], data: {} });
      function v(n) {
        return u['\u0275vid'](0, [u['\u0275ncd'](null, 0)], null, null);
      }
      function x(n) {
        return u['\u0275vid'](
          0,
          [
            (n()(),
            u['\u0275eld'](
              0,
              0,
              null,
              null,
              1,
              'shared-tab',
              [],
              [[8, 'hidden', 0]],
              null,
              null,
              v,
              y
            )),
            u['\u0275did'](1, 49152, null, 0, i, [r], null, null)
          ],
          null,
          function(n, t) {
            n(t, 0, 0, u['\u0275nov'](t, 1).hidden);
          }
        );
      }
      var C = u['\u0275ccf']('shared-tab', i, x, { title: 'title' }, {}, ['*']),
        O = u['\u0275crt']({
          encapsulation: 0,
          styles: [
            "[_nghost-%COMP%]{display:block}.tabs[_ngcontent-%COMP%]{display:flex;list-style:none;margin:0;padding:0;border-bottom:1px solid #ebeef2}.tab[_ngcontent-%COMP%]{position:relative;padding:0 20px;line-height:40px;cursor:pointer}.tab-body[_ngcontent-%COMP%]{padding:20px}.tab--active[_ngcontent-%COMP%]:before{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:#03a9f4}"
          ],
          data: {}
        });
      function M(n) {
        return u['\u0275vid'](
          0,
          [
            (n()(),
            u['\u0275eld'](
              0,
              0,
              null,
              null,
              1,
              'li',
              [['class', 'tab']],
              [[2, 'tab--active', null]],
              [[null, 'click']],
              function(n, t, e) {
                var l = !0;
                return (
                  'click' === t &&
                    (l =
                      !1 !== n.component.selectTab(n.context.$implicit) && l),
                  l
                );
              },
              null,
              null
            )),
            (n()(), u['\u0275ted'](1, null, [' ', ' ']))
          ],
          null,
          function(n, t) {
            n(t, 0, 0, !t.context.$implicit.hidden),
              n(t, 1, 0, t.context.$implicit.title);
          }
        );
      }
      function S(n) {
        return u['\u0275vid'](
          0,
          [
            (n()(),
            u['\u0275eld'](
              0,
              0,
              null,
              null,
              2,
              'ul',
              [['class', 'tabs']],
              null,
              null,
              null,
              null,
              null
            )),
            (n()(), u['\u0275and'](16777216, null, null, 1, null, M)),
            u['\u0275did'](
              2,
              278528,
              null,
              0,
              l.NgForOf,
              [u.ViewContainerRef, u.TemplateRef, u.IterableDiffers],
              { ngForOf: [0, 'ngForOf'] },
              null
            ),
            (n()(),
            u['\u0275eld'](
              3,
              0,
              null,
              null,
              1,
              'div',
              [['class', 'tab-body']],
              null,
              null,
              null,
              null,
              null
            )),
            u['\u0275ncd'](null, 0)
          ],
          function(n, t) {
            n(t, 2, 0, t.component.tabs);
          },
          null
        );
      }
      function P(n) {
        return u['\u0275vid'](
          0,
          [
            (n()(),
            u['\u0275eld'](
              0,
              0,
              null,
              null,
              1,
              'shared-tabs',
              [],
              null,
              null,
              null,
              S,
              O
            )),
            u['\u0275did'](1, 49152, null, 0, r, [], null, null)
          ],
          null,
          null
        );
      }
      var w = u['\u0275ccf'](
        'shared-tabs',
        r,
        P,
        {},
        { selected: 'selected' },
        ['*']
      );
      e.d(t, 'SharedComponent', function() {
        return o;
      }),
        e.d(t, 'SharedModule', function() {
          return d;
        }),
        e.d(t, '\u0275a', function() {
          return c;
        }),
        e.d(t, '\u0275b', function() {
          return i;
        }),
        e.d(t, '\u0275c', function() {
          return r;
        }),
        e.d(t, 'SharedModuleNgFactory', function() {
          return a;
        }),
        e.d(t, 'RenderType_SharedComponent', function() {
          return f;
        }),
        e.d(t, 'View_SharedComponent_0', function() {
          return s;
        }),
        e.d(t, 'View_SharedComponent_Host_0', function() {
          return p;
        }),
        e.d(t, 'SharedComponentNgFactory', function() {
          return b;
        }),
        e.d(t, 'RenderType_\u0275a', function() {
          return m;
        }),
        e.d(t, 'View_\u0275a_0', function() {
          return h;
        }),
        e.d(t, 'View_\u0275a_Host_0', function() {
          return g;
        }),
        e.d(t, '\u0275aNgFactory', function() {
          return _;
        }),
        e.d(t, 'RenderType_\u0275b', function() {
          return y;
        }),
        e.d(t, 'View_\u0275b_0', function() {
          return v;
        }),
        e.d(t, 'View_\u0275b_Host_0', function() {
          return x;
        }),
        e.d(t, '\u0275bNgFactory', function() {
          return C;
        }),
        e.d(t, 'RenderType_\u0275c', function() {
          return O;
        }),
        e.d(t, 'View_\u0275c_0', function() {
          return S;
        }),
        e.d(t, 'View_\u0275c_Host_0', function() {
          return P;
        }),
        e.d(t, '\u0275cNgFactory', function() {
          return w;
        }),
        (t.default = a);
    }
  });
});
