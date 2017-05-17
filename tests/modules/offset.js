TestSuite.modules.push(function () {

  QUnit.module('offset');

  var inst = this;
  var docElem = document.documentElement;
  var body = document.body;
  var fixture = this.fixture;
  var element = this.element;
  var elementInner = this.elementInner;
  var anchor = this.anchor;
  var container = this.container;

  QUnit.test('Should return the document\'s offset.', function (assert) {

    assert.expect(2);

    inst.setStyles(fixture, {
      position: 'absolute',
      width: '10000px',
      height: '10000px',
      left: '10px',
      top: '10px',
      margin: '10px',
      border: '10px solid',
      padding: '10px'
    });

    window.scrollTo(1000, 1000);

    assert.strictEqual(mezr.offset(document).left, 0, 'left');
    assert.strictEqual(mezr.offset(document).top, 0, 'top');

  });

  QUnit.test('Should return the window\'s offset.', function (assert) {

    assert.expect(2);

    inst.setStyles(fixture, {
      position: 'absolute',
      width: '10000px',
      height: '10000px',
      left: '10px',
      top: '10px',
      margin: '10px',
      border: '10px solid',
      padding: '10px'
    });

    window.scrollTo(1000, 1000);

    assert.strictEqual(mezr.offset(window).left, window.pageXOffset, 'left');
    assert.strictEqual(mezr.offset(window).top, window.pageYOffset, 'top');

  });

  QUnit.test('Should return the element\'s offset.', function (assert) {

    assert.expect(40);

    inst.setStyles(fixture, {
      position: 'absolute',
      width: '10000px',
      height: '10000px',
      left: '10px',
      top: '10px',
      margin: '10px',
      border: '10px solid',
      padding: '10px'
    });

    inst.setStyles(element, {
      position: 'absolute',
      width: '10px',
      height: '10px',
      left: '10px',
      top: '10px',
      margin: '10px',
      border: '10px solid',
      padding: '15px'
    });

    var elemValues = {
      'static': {
        'content': 75,
        'padding': 60,
        'scroll': 60,
        'border': 50,
        'margin': 40
      },
      'relative': {
        'content': 85,
        'padding': 70,
        'scroll': 70,
        'border': 60,
        'margin': 50
      },
      'absolute': {
        'content': 75,
        'padding': 60,
        'scroll': 60,
        'border': 50,
        'margin': 40
      },
      'fixed': {
        'content': 45,
        'padding': 30,
        'scroll': 30,
        'border': 20,
        'margin': 10
      }
    };

    inst.forIn(elemValues, function (posValues, posName) {
      inst.forIn(posValues, function (edgeValue, edgeName) {
        inst.setStyles(element, {position: posName});
        window.scrollTo(0, 0);
        assert.strictEqual(mezr.offset(element, edgeName).left, window.pageXOffset + edgeValue, 'left - ' + posName + ' - ' + edgeName);
        assert.strictEqual(mezr.offset(element, edgeName).top, window.pageYOffset + edgeValue, 'top - ' + posName + ' - ' + edgeName);
      });
    });

  });

  QUnit.test('Absolute element - scroll test.', function (assert) {

    assert.expect(2);

    inst.setStyles(fixture, {
      position: 'absolute',
      width: '10000px',
      height: '10000px',
      left: '0px',
      top: '0px'
    });

    inst.setStyles(element, {
      position: 'absolute',
      right: '0px',
      bottom: '0px',
      width: '10px',
      height: '10px'
    });

    var result = mezr.offset(element);
    assert.strictEqual(result.left, 9990, 'left offset');
    assert.strictEqual(result.top, 9990, 'top offset');

  });

  QUnit.test('Fixed element - scroll test.', function (assert) {

    assert.expect(2);

    inst.setStyles(fixture, {
      position: 'absolute',
      width: '10000px',
      height: '10000px'
    });

    inst.setStyles(element, {
      position: 'fixed',
      left: '2000px',
      top: '2000px'
    });

    window.scrollTo(1000, 1000);

    var result = mezr.offset(element);
    assert.strictEqual(result.left, window.pageXOffset + 2000, 'left offset');
    assert.strictEqual(result.top, window.pageYOffset + 2000, 'top offset');

  });

  QUnit.test('Should return the element\'s offset relative to another element/window/document.', function (assert) {

    assert.expect(8);

    inst.setStyles(fixture, {
      position: 'absolute',
      width: '10px',
      height: '10px',
      left: '10px',
      top: '10px',
      margin: '10px',
      border: '10px solid',
      padding: '10px'
    });

    inst.setStyles(element, {
      position: 'absolute',
      width: '10px',
      height: '10px',
      left: '10px',
      top: '10px',
      margin: '10px',
      border: '10px solid',
      padding: '10px'
    });

    window.scrollTo(0, 0);

    var result = mezr.offset([element, 'content'], [fixture, 'padding']);
    assert.strictEqual(result.left, 40, 'left offset - array syntax');
    assert.strictEqual(result.top, 40, 'top offset - array syntax');

    var result = mezr.offset(element, fixture);
    assert.strictEqual(result.left, 30, 'left offset - element syntax');
    assert.strictEqual(result.top, 30, 'top offset - element syntax');

    var result = mezr.offset(element, window);
    assert.strictEqual(result.left, 50, 'left offset - from window');
    assert.strictEqual(result.top, 50, 'top offset - from window');

    var result = mezr.offset(element, document);
    assert.strictEqual(result.left, 50, 'left offset - from document');
    assert.strictEqual(result.top, 50, 'top offset - from document');

  });

});