TestSuite.modules.push(function () {

  QUnit.module('containingBlock');

  var inst = this;
  var docElem = document.documentElement;
  var body = document.body;
  var fixture = this.fixture;
  var element = this.element;
  var elementInner = this.elementInner;
  var anchor = this.anchor;
  var container = this.container;

  QUnit.test('Document\'s containing block should be null.', function (assert) {

    assert.expect(1);

    assert.strictEqual(mezr.containingBlock(document), null);

  });

  QUnit.test('Window\'s containing block should be document.', function (assert) {

    assert.expect(1);

    assert.strictEqual(mezr.containingBlock(window), document);

  });

  QUnit.test('Static element\'s containing block should be null.', function (assert) {

    assert.expect(1);

    inst.setStyles(element, {
      position: 'static'
    });

    assert.strictEqual(mezr.containingBlock(element), null);

  });

  QUnit.test('Relative element\'s containing block should be the element itself.', function (assert) {

    assert.expect(1);

    inst.setStyles(element, {
      position: 'relative'
    });

    assert.strictEqual(mezr.containingBlock(element), element);

  });

  QUnit.test('Absolute element\'s containing block should be the closest positioned and/or transformed ancestor, and fallback to document if all ancestors are static.', function (assert) {

    assert.expect(5);

    inst.setStyles(document.documentElement, {position: 'fixed'});
    inst.setStyles(document.body, {position: 'relative'});
    inst.setStyles(fixture, {position: 'absolute'});
    inst.setStyles(element, {position: 'absolute'});

    assert.strictEqual(mezr.containingBlock(element), fixture);

    inst.setStyles(fixture, {position: 'static'});
    assert.strictEqual(mezr.containingBlock(element), document.body);

    inst.setStyles(document.body, {position: 'static'});
    assert.strictEqual(mezr.containingBlock(element), document.documentElement);

    inst.setStyles(document.documentElement, {position: 'static'});
    assert.strictEqual(mezr.containingBlock(element), document);

    inst.setStyles(document.documentElement, {
      webkitTransform: 'translateX(0)',
      mozTransform: 'translateX(0)',
      msTransform: 'translateX(0)',
      oTransform: 'translateX(0)',
      transform: 'translateX(0)'
    });
    assert.strictEqual(mezr.containingBlock(element), document.documentElement);

  });

  QUnit.test('Fixed element\'s containing block should be the closest transformed ancestor or window.', function (assert) {

    assert.expect(5);

    var transformLeaksFixed = (function() {

      var outer = document.createElement('div');
      var inner = document.createElement('div');
      var leftNotTransformed;
      var leftTransformed;

      inst.setStyles(outer, {
        display: 'block',
        visibility: 'hidden',
        position: 'absolute',
        width: '1px',
        height: '1px',
        left: '1px',
        top: '0',
        margin: '0'
      });

      inst.setStyles(inner, {
        display: 'block',
        position: 'fixed',
        width: '1px',
        height: '1px',
        left: '0',
        top: '0',
        margin: '0'
      });

      outer.appendChild(inner);
      document.body.appendChild(outer);
      leftNotTransformed = inner.getBoundingClientRect().left;
      inst.setStyles(outer, {
        webkitTransform: 'translateX(0)',
        mozTransform: 'translateX(0)',
        msTransform: 'translateX(0)',
        oTransform: 'translateX(0)',
        transform: 'translateX(0)'
      });
      leftTransformed = inner.getBoundingClientRect().left;
      document.body.removeChild(outer);

      return leftTransformed === leftNotTransformed;

    })();

    inst.setStyles(document.documentElement, {position: 'fixed'});
    inst.setStyles(document.body, {position: 'absolute'});
    inst.setStyles(fixture, {position: 'relative'});
    inst.setStyles(element, {position: 'fixed'});
    assert.strictEqual(mezr.containingBlock(element), window);

    inst.setStyles(document.documentElement, {
      webkitTransform: 'translateX(0)',
      mozTransform: 'translateX(0)',
      msTransform: 'translateX(0)',
      oTransform: 'translateX(0)',
      transform: 'translateX(0)'
    });
    assert.strictEqual(mezr.containingBlock(element), transformLeaksFixed ? window : document.documentElement);

    inst.setStyles(document.body, {
      webkitTransform: 'translateX(0)',
      mozTransform: 'translateX(0)',
      msTransform: 'translateX(0)',
      oTransform: 'translateX(0)',
      transform: 'translateX(0)'
    });
    assert.strictEqual(mezr.containingBlock(element), transformLeaksFixed ? window : document.body);

    inst.setStyles(fixture, {
      webkitTransform: 'translateX(0)',
      mozTransform: 'translateX(0)',
      msTransform: 'translateX(0)',
      oTransform: 'translateX(0)',
      transform: 'translateX(0)'
    });
    assert.strictEqual(mezr.containingBlock(element), transformLeaksFixed ? window : fixture);

    inst.setStyles(fixture, {position: 'static'});
    assert.strictEqual(mezr.containingBlock(element), transformLeaksFixed ? window : fixture);

  });

  QUnit.test('Sticky element\'s containing block should be the closest scrolling ancestor element or window if no scrolling ancestor element is found', function (assert) {

    var stickyPosition = function () {
      var el = document.createElement('div');
      el.style.cssText = "position:sticky;";
      if (el.style.position.indexOf('sticky') > -1) {
        return 'sticky';
      }
      el.style.cssText = "position:-webkit-sticky;";
      if (el.style.position.indexOf('sticky') > -1) {
        return '-webkit-sticky';
      }
      return null;
    }();

    assert.expect(stickyPosition ? 5 : 0);

    if (stickyPosition) {

      inst.setStyles(document.documentElement, {position: 'fixed'});
      inst.setStyles(document.body, {position: 'relative'});
      inst.setStyles(fixture, {position: 'absolute'});
      inst.setStyles(element, {position: stickyPosition});

      // When there are no scrolling ancestor elements
      assert.strictEqual(mezr.containingBlock(element), window);

      // When ancestor element has overflow:scroll
      inst.setStyles(document.body, {overflow: 'scroll'});
      assert.strictEqual(mezr.containingBlock(element), document.body);

      // When ancestor element has overflow:auto
      inst.setStyles(document.body, {overflow: 'auto'});
      assert.strictEqual(mezr.containingBlock(element), document.body);

      // When parent element has overflow:scroll
      inst.setStyles(fixture, {overflow: 'scroll'});
      assert.strictEqual(mezr.containingBlock(element), fixture);

      // When parent element has overflow:auto
      inst.setStyles(fixture, {overflow: 'auto'});
      assert.strictEqual(mezr.containingBlock(element), fixture);

    }

  });

});