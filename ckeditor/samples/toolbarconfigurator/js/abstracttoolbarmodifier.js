﻿typeof Object.create !== 'function' &&
  (function() {
    const a = function() {};
    Object.create = function(b) {
      if (arguments.length > 1) throw Error('Second argument not supported');
      if (b === null) throw Error('Cannot set a null [[Prototype]]');
      if (typeof b !== 'object') throw TypeError('Argument must be an object');
      a.prototype = b;
      return new a();
    };
  })();
CKEDITOR.plugins.add('toolbarconfiguratorarea', {
  afterInit(a) {
    a.addMode('wysiwyg', b => {
      let c = CKEDITOR.dom.element.createFromHtml(
        '\x3cdiv class\x3d"cke_wysiwyg_div cke_reset" hidefocus\x3d"true"\x3e\x3c/div\x3e',
      );
      a.ui.space('contents').append(c);
      c = a.editable(c);
      c.detach = CKEDITOR.tools.override(
        c.detach,
        b =>
          function() {
            b.apply(this, arguments);
            this.remove();
          },
      );
      a.setData(a.getData(1), b);
      a.fire('contentDom');
    });
    a.dataProcessor.toHtml = function(b) {
      return b;
    };
    a.dataProcessor.toDataFormat = function(b) {
      return b;
    };
  },
});
Object.keys ||
  (Object.keys = (function() {
    let a = Object.prototype.hasOwnProperty,
      b = !{ toString: null }.propertyIsEnumerable('toString'),
      c = 'toString toLocaleString valueOf hasOwnProperty isPrototypeOf propertyIsEnumerable constructor'.split(
        ' ',
      ),
      e = c.length;
    return function(d) {
      if (typeof d !== 'object' && (typeof d !== 'function' || d === null))
        throw new TypeError('Object.keys called on non-object');
      let g = [],
        f;
      for (f in d) a.call(d, f) && g.push(f);
      if (b) for (f = 0; f < e; f++) a.call(d, c[f]) && g.push(c[f]);
      return g;
    };
  })());
(function() {
  function a(b, c) {
    this.cfg = c || {};
    this.hidden = !1;
    this.editorId = b;
    this.fullToolbarEditor = new ToolbarConfigurator.FullToolbarEditor();
    this.actualConfig = this.originalConfig = this.mainContainer = null;
    this.isEditableVisible = this.waitForReady = !1;
    this.toolbarContainer = null;
    this.toolbarButtons = [];
  }
  ToolbarConfigurator.AbstractToolbarModifier = a;
  a.prototype.setConfig = function(b) {
    this._onInit(void 0, b, !0);
  };
  a.prototype.init = function(b) {
    const c = this;
    this.mainContainer = new CKEDITOR.dom.element('div');
    if (this.fullToolbarEditor.editorInstance !== null)
      throw 'Only one instance of ToolbarModifier is allowed';
    this.editorInstance || this._createEditor(!1);
    this.editorInstance.once('loaded', () => {
      c.fullToolbarEditor.init(() => {
        c._onInit(b);
        if (typeof c.onRefresh === 'function') c.onRefresh();
      }, c.editorInstance.config);
    });
    return this.mainContainer;
  };
  a.prototype._onInit = function(b, c) {
    this.originalConfig = this.editorInstance.config;
    this.actualConfig = c
      ? JSON.parse(c)
      : JSON.parse(JSON.stringify(this.originalConfig));
    if (!this.actualConfig.toolbarGroups && !this.actualConfig.toolbar) {
      for (
        var a = this.actualConfig,
          d = this.editorInstance.toolbar,
          g = [],
          f = d.length,
          k = 0;
        k < f;
        k++
      ) {
        const h = d[k];
        typeof h === 'string'
          ? g.push(h)
          : g.push({ name: h.name, groups: h.groups ? h.groups.slice() : [] });
      }
      a.toolbarGroups = g;
    }
    typeof b === 'function' && b(this.mainContainer);
  };
  a.prototype._createModifier = function() {
    this.mainContainer.addClass('unselectable');
    this.modifyContainer && this.modifyContainer.remove();
    this.modifyContainer = new CKEDITOR.dom.element('div');
    this.modifyContainer.addClass('toolbarModifier');
    this.mainContainer.append(this.modifyContainer);
    return this.mainContainer;
  };
  a.prototype.getEditableArea = function() {
    return this.editorInstance.container.findOne(
      `#${this.editorInstance.id}_contents`,
    );
  };
  a.prototype._hideEditable = function() {
    const b = this.getEditableArea();
    this.isEditableVisible = !1;
    this.lastEditableAreaHeight = b.getStyle('height');
    b.setStyle('height', '0');
  };
  a.prototype._showEditable = function() {
    this.isEditableVisible = !0;
    this.getEditableArea().setStyle(
      'height',
      this.lastEditableAreaHeight || 'auto',
    );
  };
  a.prototype._toggleEditable = function() {
    this.isEditableVisible ? this._hideEditable() : this._showEditable();
  };
  a.prototype._refreshEditor = function() {
    function b() {
      c.editorInstance.destroy();
      c._createEditor(!0, c.getActualConfig());
      c.waitForReady = !1;
    }
    var c = this,
      a = this.editorInstance.status;
    this.waitForReady ||
      (a == 'unloaded' || a == 'loaded'
        ? ((this.waitForReady = !0),
          this.editorInstance.once(
            'instanceReady',
            () => {
              b();
            },
            this,
          ))
        : b());
  };
  a.prototype._createEditor = function(b, c) {
    function e() {}
    const d = this;
    this.editorInstance = CKEDITOR.replace(this.editorId);
    this.editorInstance.on('configLoaded', () => {
      const b = d.editorInstance.config;
      c && CKEDITOR.tools.extend(b, c, !0);
      a.extendPluginsConfig(b);
    });
    this.editorInstance.on(
      'uiSpace',
      b => {
        b.data.space != 'top' && b.stop();
      },
      null,
      null,
      -999,
    );
    this.editorInstance.once('loaded', () => {
      let c = d.editorInstance.ui.instances,
        a;
      for (a in c) c[a] && ((c[a].click = e), (c[a].onClick = e));
      d.isEditableVisible || d._hideEditable();
      d.currentActive &&
        d.currentActive.name &&
        d._highlightGroup(d.currentActive.name);
      d.hidden ? d.hideUI() : d.showUI();
      if (b && typeof d.onRefresh === 'function') d.onRefresh();
    });
  };
  a.prototype.getActualConfig = function() {
    return JSON.parse(JSON.stringify(this.actualConfig));
  };
  a.prototype._createToolbar = function() {
    if (this.toolbarButtons.length) {
      this.toolbarContainer = new CKEDITOR.dom.element('div');
      this.toolbarContainer.addClass('toolbar');
      for (let b = this.toolbarButtons.length, c = 0; c < b; c += 1)
        this._createToolbarBtn(this.toolbarButtons[c]);
    }
  };
  a.prototype._createToolbarBtn = function(b) {
    const c = ToolbarConfigurator.FullToolbarEditor.createButton(
      typeof b.text === 'string' ? b.text : b.text.inactive,
      b.cssClass,
    );
    this.toolbarContainer.append(c);
    c.data('group', b.group);
    c.addClass(b.position);
    c.on(
      'click',
      function() {
        b.clickCallback.call(this, c, b);
      },
      this,
    );
    return c;
  };
  a.prototype._fixGroups = function(b) {
    b = b.toolbarGroups || [];
    for (let c = b.length, a = 0; a < c; a += 1) {
      let d = b[a];
      d == '/'
        ? ((d = b[a] = {}),
          (d.type = 'separator'),
          (d.name = `separator${CKEDITOR.tools.getNextNumber()}`))
        : ((d.groups = d.groups || []),
          CKEDITOR.tools.indexOf(d.groups, d.name) == -1 &&
            (this.editorInstance.ui.addToolbarGroup(
              d.name,
              d.groups[d.groups.length - 1],
              d.name,
            ),
            d.groups.push(d.name)),
          this._fixSubgroups(d));
    }
  };
  a.prototype._fixSubgroups = function(b) {
    b = b.groups;
    for (let c = b.length, a = 0; a < c; a += 1) {
      const d = b[a];
      b[a] = {
        name: d,
        totalBtns: ToolbarConfigurator.ToolbarModifier.getTotalSubGroupButtonsNumber(
          d,
          this.fullToolbarEditor,
        ),
      };
    }
  };
  a.stringifyJSONintoOneLine = function(b, a) {
    a = a || {};
    var e = JSON.stringify(b, null, ''),
      e = e.replace(/\n/g, '');
    a.addSpaces &&
      ((e = e.replace(/(\{|:|,|\[|\])/g, a => `${a} `)),
      (e = e.replace(/(\])/g, a => ` ${a}`)));
    a.noQuotesOnKey && (e = e.replace(/"(\w*)":/g, (a, b) => `${b}:`));
    a.singleQuotes && (e = e.replace(/\"/g, "'"));
    return e;
  };
  a.prototype.hideUI = function() {
    this.hidden = !0;
    this.mainContainer.hide();
    this.editorInstance.container && this.editorInstance.container.hide();
  };
  a.prototype.showUI = function() {
    this.hidden = !1;
    this.mainContainer.show();
    this.editorInstance.container && this.editorInstance.container.show();
  };
  a.extendPluginsConfig = function(a) {
    const c = a.extraPlugins;
    a.extraPlugins = `${c ? `${c},` : ''}toolbarconfiguratorarea`;
  };
})();
