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

  QUnit.test('#critical: Document\'s containing block should be null.', function (assert) {

    assert.expect(1);

    assert.strictEqual(mezr.containingBlock(document), null);

  });

  QUnit.test('#critical: Window\'s containing block should be document.', function (assert) {

    assert.expect(1);

    assert.strictEqual(mezr.containingBlock(window), document);

  });

  QUnit.test('#critical: Static element\'s containing block should be null.', function (assert) {

    assert.expect(1);

    inst.setStyles(element, {
      position: 'static'
    });

    assert.strictEqual(mezr.containingBlock(element), null);

  });

  QUnit.test('#critical: Relative element\'s containing block should be the element itself.', function (assert) {

    assert.expect(1);

    inst.setStyles(element, {
      position: 'relative'
    });

    assert.strictEqual(mezr.containingBlock(element), element);

  });

  QUnit.test('#critical: Absolute element\'s containing block should be the closest positioned and/or transformed ancestor, and fallback to document if all ancestors are static.', function (assert) {

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

  QUnit.test('#critical: Fixed element\'s containing block should be the closest transformed ancestor or window.', function (assert) {

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

});