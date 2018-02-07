﻿/*
 Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
(function() {
  function v(a) {
    for (var f = 0, n = 0, l = 0, p, e = a.$.rows.length; l < e; l++) {
      p = a.$.rows[l];
      for (var d = (f = 0), b, c = p.cells.length; d < c; d++)
        (b = p.cells[d]), (f += b.colSpan);
      f > n && (n = f);
    }
    return n;
  }
  function r(a) {
    return function() {
      var f = this.getValue(),
        f = !!(CKEDITOR.dialog.validate.integer()(f) && f > 0);
      f || (alert(a), this.select());
      return f;
    };
  }
  function q(a, f) {
    let n = function(e) {
        return new CKEDITOR.dom.element(e, a.document);
      },
      q = a.editable(),
      p = a.plugins.dialogadvtab;
    return {
      title: a.lang.table.title,
      minWidth: 310,
      minHeight: CKEDITOR.env.ie ? 310 : 280,
      onLoad() {
        let e = this,
          a = e.getContentElement('advanced', 'advStyles');
        if (a)
          a.on('change', function() {
            let a = this.getStyle('width', ''),
              c = e.getContentElement('info', 'txtWidth');
            c && c.setValue(a, !0);
            a = this.getStyle('height', '');
            (c = e.getContentElement('info', 'txtHeight')) && c.setValue(a, !0);
          });
      },
      onShow() {
        let e = a.getSelection(),
          d = e.getRanges(),
          b,
          c = this.getContentElement('info', 'txtRows'),
          g = this.getContentElement('info', 'txtCols'),
          t = this.getContentElement('info', 'txtWidth'),
          m = this.getContentElement('info', 'txtHeight');
        f == 'tableProperties' &&
          ((e = e.getSelectedElement()) && e.is('table')
            ? (b = e)
            : d.length > 0 &&
              (CKEDITOR.env.webkit && d[0].shrink(CKEDITOR.NODE_ELEMENT),
              (b = a
                .elementPath(d[0].getCommonAncestor(!0))
                .contains('table', 1))),
          (this._.selectedElement = b));
        b
          ? (this.setupContent(b), c && c.disable(), g && g.disable())
          : (c && c.enable(), g && g.enable());
        t && t.onChange();
        m && m.onChange();
      },
      onOk() {
        let e = a.getSelection(),
          d = this._.selectedElement && e.createBookmarks(),
          b = this._.selectedElement || n('table'),
          c = {};
        this.commitContent(c, b);
        if (c.info) {
          c = c.info;
          if (!this._.selectedElement)
            for (
              var g = b.append(n('tbody')),
                f = parseInt(c.txtRows, 10) || 0,
                m = parseInt(c.txtCols, 10) || 0,
                k = 0;
              k < f;
              k++
            )
              for (var h = g.append(n('tr')), l = 0; l < m; l++)
                h.append(n('td')).appendBogus();
          f = c.selHeaders;
          if (!b.$.tHead && (f == 'row' || f == 'both')) {
            h = b.getElementsByTag('thead').getItem(0);
            g = b.getElementsByTag('tbody').getItem(0);
            m = g.getElementsByTag('tr').getItem(0);
            h || ((h = new CKEDITOR.dom.element('thead')), h.insertBefore(g));
            for (k = 0; k < m.getChildCount(); k++)
              (g = m.getChild(k)),
                g.type != CKEDITOR.NODE_ELEMENT ||
                  g.data('cke-bookmark') ||
                  (g.renameNode('th'), g.setAttribute('scope', 'col'));
            h.append(m.remove());
          }
          if (b.$.tHead !== null && f != 'row' && f != 'both') {
            h = new CKEDITOR.dom.element(b.$.tHead);
            g = b.getElementsByTag('tbody').getItem(0);
            for (l = g.getFirst(); h.getChildCount() > 0; ) {
              m = h.getFirst();
              for (k = 0; k < m.getChildCount(); k++)
                (g = m.getChild(k)),
                  g.type == CKEDITOR.NODE_ELEMENT &&
                    (g.renameNode('td'), g.removeAttribute('scope'));
              m.insertBefore(l);
            }
            h.remove();
          }
          if (!this.hasColumnHeaders && (f == 'col' || f == 'both'))
            for (h = 0; h < b.$.rows.length; h++)
              (g = new CKEDITOR.dom.element(b.$.rows[h].cells[0])),
                g.renameNode('th'),
                g.setAttribute('scope', 'row');
          if (this.hasColumnHeaders && f != 'col' && f != 'both')
            for (k = 0; k < b.$.rows.length; k++)
              (h = new CKEDITOR.dom.element(b.$.rows[k])),
                h.getParent().getName() == 'tbody' &&
                  ((g = new CKEDITOR.dom.element(h.$.cells[0])),
                  g.renameNode('td'),
                  g.removeAttribute('scope'));
          c.txtHeight
            ? b.setStyle('height', c.txtHeight)
            : b.removeStyle('height');
          c.txtWidth ? b.setStyle('width', c.txtWidth) : b.removeStyle('width');
          b.getAttribute('style') || b.removeAttribute('style');
        }
        if (this._.selectedElement)
          try {
            e.selectBookmarks(d);
          } catch (p) {}
        else
          a.insertElement(b),
            setTimeout(() => {
              let e = new CKEDITOR.dom.element(b.$.rows[0].cells[0]),
                c = a.createRange();
              c.moveToPosition(e, CKEDITOR.POSITION_AFTER_START);
              c.select();
            }, 0);
      },
      contents: [
        {
          id: 'info',
          label: a.lang.table.title,
          elements: [
            {
              type: 'hbox',
              widths: [null, null],
              styles: ['vertical-align:top'],
              children: [
                {
                  type: 'vbox',
                  padding: 0,
                  children: [
                    {
                      type: 'text',
                      id: 'txtRows',
                      default: 3,
                      label: a.lang.table.rows,
                      required: !0,
                      controlStyle: 'width:5em',
                      validate: r(a.lang.table.invalidRows),
                      setup(e) {
                        this.setValue(e.$.rows.length);
                      },
                      commit: l,
                    },
                    {
                      type: 'text',
                      id: 'txtCols',
                      default: 2,
                      label: a.lang.table.columns,
                      required: !0,
                      controlStyle: 'width:5em',
                      validate: r(a.lang.table.invalidCols),
                      setup(e) {
                        this.setValue(v(e));
                      },
                      commit: l,
                    },
                    { type: 'html', html: '\x26nbsp;' },
                    {
                      type: 'select',
                      id: 'selHeaders',
                      requiredContent: 'th',
                      default: '',
                      label: a.lang.table.headers,
                      items: [
                        [a.lang.table.headersNone, ''],
                        [a.lang.table.headersRow, 'row'],
                        [a.lang.table.headersColumn, 'col'],
                        [a.lang.table.headersBoth, 'both'],
                      ],
                      setup(e) {
                        const a = this.getDialog();
                        a.hasColumnHeaders = !0;
                        for (let b = 0; b < e.$.rows.length; b++) {
                          const c = e.$.rows[b].cells[0];
                          if (c && c.nodeName.toLowerCase() != 'th') {
                            a.hasColumnHeaders = !1;
                            break;
                          }
                        }
                        e.$.tHead !== null
                          ? this.setValue(a.hasColumnHeaders ? 'both' : 'row')
                          : this.setValue(a.hasColumnHeaders ? 'col' : '');
                      },
                      commit: l,
                    },
                    {
                      type: 'text',
                      id: 'txtBorder',
                      requiredContent: 'table[border]',
                      default: a.filter.check('table[border]') ? 1 : 0,
                      label: a.lang.table.border,
                      controlStyle: 'width:3em',
                      validate: CKEDITOR.dialog.validate.number(
                        a.lang.table.invalidBorder,
                      ),
                      setup(a) {
                        this.setValue(a.getAttribute('border') || '');
                      },
                      commit(a, d) {
                        this.getValue()
                          ? d.setAttribute('border', this.getValue())
                          : d.removeAttribute('border');
                      },
                    },
                    {
                      id: 'cmbAlign',
                      type: 'select',
                      requiredContent: 'table[align]',
                      default: '',
                      label: a.lang.common.align,
                      items: [
                        [a.lang.common.notSet, ''],
                        [a.lang.common.alignLeft, 'left'],
                        [a.lang.common.alignCenter, 'center'],
                        [a.lang.common.alignRight, 'right'],
                      ],
                      setup(a) {
                        this.setValue(a.getAttribute('align') || '');
                      },
                      commit(a, d) {
                        this.getValue()
                          ? d.setAttribute('align', this.getValue())
                          : d.removeAttribute('align');
                      },
                    },
                  ],
                },
                {
                  type: 'vbox',
                  padding: 0,
                  children: [
                    {
                      type: 'hbox',
                      widths: ['5em'],
                      children: [
                        {
                          type: 'text',
                          id: 'txtWidth',
                          requiredContent: 'table{width}',
                          controlStyle: 'width:5em',
                          label: a.lang.common.width,
                          title: a.lang.common.cssLengthTooltip,
                          default: a.filter.check('table{width}')
                            ? q.getSize('width') < 500 ? '100%' : 500
                            : 0,
                          getValue: u,
                          validate: CKEDITOR.dialog.validate.cssLength(
                            a.lang.common.invalidCssLength.replace(
                              '%1',
                              a.lang.common.width,
                            ),
                          ),
                          onChange() {
                            const a = this.getDialog().getContentElement(
                              'advanced',
                              'advStyles',
                            );
                            a && a.updateStyle('width', this.getValue());
                          },
                          setup(a) {
                            a = a.getStyle('width');
                            this.setValue(a);
                          },
                          commit: l,
                        },
                      ],
                    },
                    {
                      type: 'hbox',
                      widths: ['5em'],
                      children: [
                        {
                          type: 'text',
                          id: 'txtHeight',
                          requiredContent: 'table{height}',
                          controlStyle: 'width:5em',
                          label: a.lang.common.height,
                          title: a.lang.common.cssLengthTooltip,
                          default: '',
                          getValue: u,
                          validate: CKEDITOR.dialog.validate.cssLength(
                            a.lang.common.invalidCssLength.replace(
                              '%1',
                              a.lang.common.height,
                            ),
                          ),
                          onChange() {
                            const a = this.getDialog().getContentElement(
                              'advanced',
                              'advStyles',
                            );
                            a && a.updateStyle('height', this.getValue());
                          },
                          setup(a) {
                            (a = a.getStyle('height')) && this.setValue(a);
                          },
                          commit: l,
                        },
                      ],
                    },
                    { type: 'html', html: '\x26nbsp;' },
                    {
                      type: 'text',
                      id: 'txtCellSpace',
                      requiredContent: 'table[cellspacing]',
                      controlStyle: 'width:3em',
                      label: a.lang.table.cellSpace,
                      default: a.filter.check('table[cellspacing]') ? 1 : 0,
                      validate: CKEDITOR.dialog.validate.number(
                        a.lang.table.invalidCellSpacing,
                      ),
                      setup(a) {
                        this.setValue(a.getAttribute('cellSpacing') || '');
                      },
                      commit(a, d) {
                        this.getValue()
                          ? d.setAttribute('cellSpacing', this.getValue())
                          : d.removeAttribute('cellSpacing');
                      },
                    },
                    {
                      type: 'text',
                      id: 'txtCellPad',
                      requiredContent: 'table[cellpadding]',
                      controlStyle: 'width:3em',
                      label: a.lang.table.cellPad,
                      default: a.filter.check('table[cellpadding]') ? 1 : 0,
                      validate: CKEDITOR.dialog.validate.number(
                        a.lang.table.invalidCellPadding,
                      ),
                      setup(a) {
                        this.setValue(a.getAttribute('cellPadding') || '');
                      },
                      commit(a, d) {
                        this.getValue()
                          ? d.setAttribute('cellPadding', this.getValue())
                          : d.removeAttribute('cellPadding');
                      },
                    },
                  ],
                },
              ],
            },
            { type: 'html', align: 'right', html: '' },
            {
              type: 'vbox',
              padding: 0,
              children: [
                {
                  type: 'text',
                  id: 'txtCaption',
                  requiredContent: 'caption',
                  label: a.lang.table.caption,
                  setup(a) {
                    this.enable();
                    a = a.getElementsByTag('caption');
                    if (a.count() > 0) {
                      a = a.getItem(0);
                      const d = a.getFirst(
                        CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT),
                      );
                      d && !d.equals(a.getBogus())
                        ? (this.disable(), this.setValue(a.getText()))
                        : ((a = CKEDITOR.tools.trim(a.getText())),
                          this.setValue(a));
                    }
                  },
                  commit(e, d) {
                    if (this.isEnabled()) {
                      let b = this.getValue(),
                        c = d.getElementsByTag('caption');
                      if (b)
                        c.count() > 0
                          ? ((c = c.getItem(0)), c.setHtml(''))
                          : ((c = new CKEDITOR.dom.element(
                              'caption',
                              a.document,
                            )),
                            d.append(c, !0)),
                          c.append(new CKEDITOR.dom.text(b, a.document));
                      else if (c.count() > 0)
                        for (b = c.count() - 1; b >= 0; b--)
                          c.getItem(b).remove();
                    }
                  },
                },
                {
                  type: 'text',
                  id: 'txtSummary',
                  bidi: !0,
                  requiredContent: 'table[summary]',
                  label: a.lang.table.summary,
                  setup(a) {
                    this.setValue(a.getAttribute('summary') || '');
                  },
                  commit(a, d) {
                    this.getValue()
                      ? d.setAttribute('summary', this.getValue())
                      : d.removeAttribute('summary');
                  },
                },
              ],
            },
          ],
        },
        p && p.createAdvancedTab(a, null, 'table'),
      ],
    };
  }
  var u = CKEDITOR.tools.cssLength,
    l = function(a) {
      const f = this.id;
      a.info || (a.info = {});
      a.info[f] = this.getValue();
    };
  CKEDITOR.dialog.add('table', a => q(a, 'table'));
  CKEDITOR.dialog.add('tableProperties', a => q(a, 'tableProperties'));
})();
