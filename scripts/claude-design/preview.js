// Shared by every preview: helpers that mirror the state rows of the tests (src/test/layout.module.css) and force focus styles.
// The page preloads React 18, the tokens, bundle.css and bundle.js (window.Atlas) into each preview frame.
var Atlas = window.Atlas;
var React = window.React;
var h = React.createElement;

function noop() {}

function mount(element) {
  window.ReactDOM.createRoot(document.getElementById('root')).render(element);
}

/** Keeps a value in local state, so a controlled Atlas component can be used in the preview. */
function Controlled(props) {
  var state = React.useState(props.initial);
  return props.render(state[0], state[1]);
}

function controlled(initial, render) {
  return h(Controlled, { initial: initial, render: render });
}

function heading(text) {
  return h('span', { className: 'type-caption pv-heading' }, text);
}

/** Rows of states by columns of variants, labelled with the state names from the component README. */
function matrix(columns, rows) {
  var children = [];
  if (columns) {
    children.push(h('span', { key: 'corner' }));
    columns.forEach(function (column) {
      children.push(h('span', { key: 'column-' + column, className: 'type-caption pv-heading' }, column));
    });
  }
  rows.forEach(function (row) {
    children.push(
      h(
        'div',
        { key: 'row-' + row.label, className: 'pv-row' },
        heading(row.label),
        row.cells.map(function (cell, index) {
          return h('div', { key: index, className: 'pv-cell', 'data-forced-focus': row.focus ? '' : undefined }, cell);
        }),
      ),
    );
  });
  return h('div', { className: 'pv-matrix', style: { '--pv-columns': columns ? columns.length : 1 } }, children);
}

/** Labelled examples in a grid of `columns`. */
function grid(columns, examples) {
  return h(
    'div',
    { className: 'pv-grid', style: { '--pv-columns': columns } },
    examples.map(function (example) {
      return h(
        'div',
        { key: example.label, className: 'pv-example', 'data-forced-focus': example.focus ? '' : undefined },
        heading(example.label),
        example.node,
      );
    }),
  );
}

/**
 * Shows the components' own :focus-visible styles inside elements marked data-forced-focus, without a keyboard.
 * Each :focus-visible rule of the loaded stylesheets is copied once, scoped to [data-forced-focus], as the describe-me
 * viewer does when it replays a frame recorded after userEvent.tab().
 */
function forceFocusStyles() {
  Array.prototype.forEach.call(document.styleSheets, function (sheet) {
    var rules;
    try {
      rules = sheet.cssRules;
    } catch (error) {
      return;
    }
    if (!rules || sheet.atlasForcedFocus) return;
    sheet.atlasForcedFocus = true;
    Array.prototype.slice.call(rules).forEach(function (rule) {
      if (!rule.selectorText || rule.selectorText.indexOf(':focus-visible') === -1) return;
      var selectors = rule.selectorText
        .split(',')
        .filter(function (selector) {
          return selector.indexOf(':focus-visible') !== -1;
        })
        .map(function (selector) {
          return '[data-forced-focus] ' + selector.trim().replace(/:focus-visible/g, '');
        });
      try {
        sheet.insertRule(selectors.join(', ') + ' { ' + rule.style.cssText + ' }', sheet.cssRules.length);
      } catch (error) {
        /* a selector this browser cannot parse stays as it is */
      }
    });
  });
}

forceFocusStyles();
window.addEventListener('load', forceFocusStyles);
