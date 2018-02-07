(function(f) {
  typeof exports === 'object' && typeof module === 'object'
    ? f(require('../../lib/codemirror'))
    : typeof define === 'function' && define.amd
      ? define(['../../lib/codemirror'], f)
      : f(CodeMirror);
})(f => {
  function p(a, b) {
    this.cm = a;
    this.options = this.buildOptions(b);
    this.widget = null;
    this.tick = this.debounce = 0;
    this.startPos = this.cm.getCursor();
    this.startLen = this.cm.getLine(this.startPos.line).length;
    const c = this;
    a.on(
      'cursorActivity',
      (this.activityFunc = function() {
        c.cursorActivity();
      }),
    );
  }
  function w(a, b) {
    function c(a, c) {
      let d;
      d =
        typeof c !== 'string'
          ? function(a) {
              return c(a, b);
            }
          : e.hasOwnProperty(c) ? e[c] : c;
      f[a] = d;
    }
    var e = {
        Up() {
          b.moveFocus(-1);
        },
        Down() {
          b.moveFocus(1);
        },
        PageUp() {
          b.moveFocus(-b.menuSize() + 1, !0);
        },
        PageDown() {
          b.moveFocus(b.menuSize() - 1, !0);
        },
        Home() {
          b.setFocus(0);
        },
        End() {
          b.setFocus(b.length - 1);
        },
        Enter: b.pick,
        Tab: b.pick,
        Esc: b.close,
      },
      d = a.options.customKeys,
      f = d ? {} : e;
    if (d) for (var g in d) d.hasOwnProperty(g) && c(g, d[g]);
    if ((d = a.options.extraKeys))
      for (g in d) d.hasOwnProperty(g) && c(g, d[g]);
    return f;
  }
  function v(a, b) {
    for (; b && b != a; ) {
      if (b.nodeName.toUpperCase() === 'LI' && b.parentNode == a) return b;
      b = b.parentNode;
    }
  }
  function n(a, b) {
    this.completion = a;
    this.data = b;
    this.picked = !1;
    let c = this,
      e = a.cm,
      d = (this.hints = document.createElement('ul'));
    d.className = 'CodeMirror-hints';
    this.selectedHint = b.selectedHint || 0;
    for (var m = b.list, g = 0; g < m.length; ++g) {
      var l = d.appendChild(document.createElement('li')),
        h = m[g],
        k = `CodeMirror-hint${
          g != this.selectedHint ? '' : ' CodeMirror-hint-active'
        }`;
      h.className != null && (k = `${h.className} ${k}`);
      l.className = k;
      h.render
        ? h.render(l, b, h)
        : l.appendChild(
            document.createTextNode(
              h.displayText || (typeof h === 'string' ? h : h.text),
            ),
          );
      l.hintId = g;
    }
    var g = e.cursorCoords(a.options.alignWithWord ? b.from : null),
      r = g.left,
      t = g.bottom,
      n = !0;
    d.style.left = `${r}px`;
    d.style.top = `${t}px`;
    l =
      window.innerWidth ||
      Math.max(document.body.offsetWidth, document.documentElement.offsetWidth);
    k =
      window.innerHeight ||
      Math.max(
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
      );
    (a.options.container || document.body).appendChild(d);
    h = d.getBoundingClientRect();
    if (h.bottom - k > 0) {
      const u = h.bottom - h.top;
      g.top - (g.bottom - h.top) - u > 0
        ? ((d.style.top = `${(t = g.top - u)}px`), (n = !1))
        : u > k &&
          ((d.style.height = `${k - 5}px`),
          (d.style.top = `${(t = g.bottom - h.top)}px`),
          (k = e.getCursor()),
          b.from.ch != k.ch &&
            ((g = e.cursorCoords(k)),
            (d.style.left = `${(r = g.left)}px`),
            (h = d.getBoundingClientRect())));
    }
    k = h.right - l;
    k > 0 &&
      (h.right - h.left > l &&
        ((d.style.width = `${l - 5}px`), (k -= h.right - h.left - l)),
      (d.style.left = `${(r = g.left - k)}px`));
    e.addKeyMap(
      (this.keyMap = w(a, {
        moveFocus(a, b) {
          c.changeActive(c.selectedHint + a, b);
        },
        setFocus(a) {
          c.changeActive(a);
        },
        menuSize() {
          return c.screenAmount();
        },
        length: m.length,
        close() {
          a.close();
        },
        pick() {
          c.pick();
        },
        data: b,
      })),
    );
    if (a.options.closeOnUnfocus) {
      let p;
      e.on(
        'blur',
        (this.onBlur = function() {
          p = setTimeout(() => {
            a.close();
          }, 100);
        }),
      );
      e.on(
        'focus',
        (this.onFocus = function() {
          clearTimeout(p);
        }),
      );
    }
    const q = e.getScrollInfo();
    e.on(
      'scroll',
      (this.onScroll = function() {
        let c = e.getScrollInfo(),
          b = e.getWrapperElement().getBoundingClientRect(),
          f = t + q.top - c.top,
          g =
            f -
            (window.pageYOffset ||
              (document.documentElement || document.body).scrollTop);
        n || (g += d.offsetHeight);
        if (g <= b.top || g >= b.bottom) return a.close();
        d.style.top = `${f}px`;
        d.style.left = `${r + q.left - c.left}px`;
      }),
    );
    f.on(d, 'dblclick', a => {
      (a = v(d, a.target || a.srcElement)) &&
        a.hintId != null &&
        (c.changeActive(a.hintId), c.pick());
    });
    f.on(d, 'click', b => {
      (b = v(d, b.target || b.srcElement)) &&
        b.hintId != null &&
        (c.changeActive(b.hintId), a.options.completeOnSingleClick && c.pick());
    });
    f.on(d, 'mousedown', () => {
      setTimeout(() => {
        e.focus();
      }, 20);
    });
    f.signal(b, 'select', m[0], d.firstChild);
    return !0;
  }
  f.showHint = function(a, b, c) {
    if (!b) return a.showHint(c);
    c && c.async && (b.async = !0);
    b = { hint: b };
    if (c) for (const e in c) b[e] = c[e];
    return a.showHint(b);
  };
  f.defineExtension('showHint', function(a) {
    this.listSelections().length > 1 ||
      this.somethingSelected() ||
      (this.state.completionActive && this.state.completionActive.close(),
      (a = this.state.completionActive = new p(this, a)),
      a.options.hint && (f.signal(this, 'startCompletion', this), a.update()));
  });
  let x =
      window.requestAnimationFrame ||
      function(a) {
        return setTimeout(a, 1e3 / 60);
      },
    y = window.cancelAnimationFrame || clearTimeout;
  p.prototype = {
    close() {
      this.active() &&
        ((this.tick = this.cm.state.completionActive = null),
        this.cm.off('cursorActivity', this.activityFunc),
        this.widget && this.widget.close(),
        f.signal(this.cm, 'endCompletion', this.cm));
    },
    active() {
      return this.cm.state.completionActive == this;
    },
    pick(a, b) {
      const c = a.list[b];
      c.hint
        ? c.hint(this.cm, a, c)
        : this.cm.replaceRange(
            typeof c === 'string' ? c : c.text,
            c.from || a.from,
            c.to || a.to,
            'complete',
          );
      f.signal(a, 'pick', c);
      this.close();
    },
    showHints(a) {
      if (!a || !a.list.length || !this.active()) return this.close();
      this.options.completeSingle && a.list.length == 1
        ? this.pick(a, 0)
        : this.showWidget(a);
    },
    cursorActivity() {
      this.debounce && (y(this.debounce), (this.debounce = 0));
      let a = this.cm.getCursor(),
        b = this.cm.getLine(a.line);
      if (
        a.line != this.startPos.line ||
        b.length - a.ch != this.startLen - this.startPos.ch ||
        a.ch < this.startPos.ch ||
        this.cm.somethingSelected() ||
        (a.ch && this.options.closeCharacters.test(b.charAt(a.ch - 1)))
      )
        this.close();
      else {
        const c = this;
        this.debounce = x(() => {
          c.update();
        });
        this.widget && this.widget.disable();
      }
    },
    update() {
      if (this.tick != null)
        if (
          (this.data && f.signal(this.data, 'update'), this.options.hint.async)
        ) {
          var a = ++this.tick,
            b = this;
          this.options.hint(
            this.cm,
            c => {
              b.tick == a && b.finishUpdate(c);
            },
            this.options,
          );
        } else this.finishUpdate(this.options.hint(this.cm, this.options), a);
    },
    finishUpdate(a) {
      this.data = a;
      const b = this.widget && this.widget.picked;
      this.widget && this.widget.close();
      a &&
        a.list.length &&
        (b && a.list.length == 1
          ? this.pick(a, 0)
          : (this.widget = new n(this, a)));
    },
    showWidget(a) {
      this.data = a;
      this.widget = new n(this, a);
      f.signal(a, 'shown');
    },
    buildOptions(a) {
      let b = this.cm.options.hintOptions,
        c = {},
        e;
      for (e in q) c[e] = q[e];
      if (b) for (e in b) void 0 !== b[e] && (c[e] = b[e]);
      if (a) for (e in a) void 0 !== a[e] && (c[e] = a[e]);
      return c;
    },
  };
  n.prototype = {
    close() {
      if (this.completion.widget == this) {
        this.completion.widget = null;
        this.hints.parentNode.removeChild(this.hints);
        this.completion.cm.removeKeyMap(this.keyMap);
        const a = this.completion.cm;
        this.completion.options.closeOnUnfocus &&
          (a.off('blur', this.onBlur), a.off('focus', this.onFocus));
        a.off('scroll', this.onScroll);
      }
    },
    disable() {
      this.completion.cm.removeKeyMap(this.keyMap);
      const a = this;
      this.keyMap = {
        Enter() {
          a.picked = !0;
        },
      };
      this.completion.cm.addKeyMap(this.keyMap);
    },
    pick() {
      this.completion.pick(this.data, this.selectedHint);
    },
    changeActive(a, b) {
      a >= this.data.list.length
        ? (a = b ? this.data.list.length - 1 : 0)
        : a < 0 && (a = b ? 0 : this.data.list.length - 1);
      if (this.selectedHint != a) {
        let c = this.hints.childNodes[this.selectedHint];
        c.className = c.className.replace(' CodeMirror-hint-active', '');
        c = this.hints.childNodes[(this.selectedHint = a)];
        c.className += ' CodeMirror-hint-active';
        c.offsetTop < this.hints.scrollTop
          ? (this.hints.scrollTop = c.offsetTop - 3)
          : c.offsetTop + c.offsetHeight >
              this.hints.scrollTop + this.hints.clientHeight &&
            (this.hints.scrollTop =
              c.offsetTop + c.offsetHeight - this.hints.clientHeight + 3);
        f.signal(this.data, 'select', this.data.list[this.selectedHint], c);
      }
    },
    screenAmount() {
      return (
        Math.floor(
          this.hints.clientHeight / this.hints.firstChild.offsetHeight,
        ) || 1
      );
    },
  };
  f.registerHelper('hint', 'auto', (a, b) => {
    let c = a.getHelpers(a.getCursor(), 'hint');
    if (c.length)
      for (let e = 0; e < c.length; e++) {
        const d = c[e](a, b);
        if (d && d.list.length) return d;
      }
    else if ((c = a.getHelper(a.getCursor(), 'hintWords'))) {
      if (c) return f.hint.fromList(a, { words: c });
    } else if (f.hint.anyword) return f.hint.anyword(a, b);
  });
  f.registerHelper('hint', 'fromList', (a, b) => {
    for (
      var c = a.getCursor(), e = a.getTokenAt(c), d = [], m = 0;
      m < b.words.length;
      m++
    ) {
      const g = b.words[m];
      g.slice(0, e.string.length) == e.string && d.push(g);
    }
    if (d.length)
      return {
        list: d,
        from: f.Pos(c.line, e.start),
        to: f.Pos(c.line, e.end),
      };
  });
  f.commands.autocomplete = f.showHint;
  var q = {
    hint: f.hint.auto,
    completeSingle: !0,
    alignWithWord: !0,
    closeCharacters: /[\s()\[\]{};:>,]/,
    closeOnUnfocus: !0,
    completeOnSingleClick: !1,
    container: null,
    customKeys: null,
    extraKeys: null,
  };
  f.defineOption('hintOptions', null);
});
