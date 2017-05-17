TestSuite.modules.push(function () {

  QUnit.module('rect');

  var inst = this;
  var docElem = document.documentElement;
  var body = document.body;
  var fixture = this.fixture;
  var element = this.element;
  var elementInner = this.elementInner;
  var anchor = this.anchor;
  var container = this.container;

  QUnit.test('Should match the results of mezr.width(), mezr.height() and mezr.offset().', function (assert) {

    assert.expect(36);

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
      left: '5000px',
      top: '5000px',
      padding: '10px',
      border: '10px solid',
      margin: '10px'
    });

    window.scrollTo(7000, 7000);

    ['', 'content', 'padding', 'scroll', 'border', 'margin'].forEach(function (edgeLayer) {
      var rect = mezr.rect(element, edgeLayer);
      var offset = mezr.offset(element, edgeLayer);
      var width = mezr.width(element, edgeLayer);
      var height = mezr.height(element, edgeLayer);
      assert.strictEqual(rect.left, offset.left, 'rect.left === offset.left');
      assert.strictEqual(rect.top, offset.top, 'rect.top === offset.top');
      assert.strictEqual(rect.width, width, 'rect.width === width');
      assert.strictEqual(rect.height, height, 'rect.height === height');
      assert.strictEqual(rect.right, offset.left + width, 'rect.right === offset.left + width');
      assert.strictEqual(rect.bottom, offset.top + height, 'rect.bottom === offset.top + height');
    });

  });

  QUnit.test('Should calculate the element\'s offset relative to another element/window/document.', function (assert) {

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

    var result = mezr.rect([element, 'content'], [fixture, 'padding']);
    var expected = mezr.offset([element, 'content'], [fixture, 'padding']);
    assert.strictEqual(result.left, expected.left, 'left offset - array syntax');
    assert.strictEqual(result.top, expected.top, 'top offset - array syntax');

    var result = mezr.rect(element, fixture);
    var expected = mezr.offset(element, fixture);
    assert.strictEqual(result.left, expected.left, 'left offset - element syntax');
    assert.strictEqual(result.top, expected.top, 'top offset - element syntax');

    var result = mezr.rect(element, window);
    var expected = mezr.offset(element, window);
    assert.strictEqual(result.left, expected.left, 'left offset - from window');
    assert.strictEqual(result.top, expected.top, 'top offset - from window');

    var result = mezr.rect(element, document);
    var expected = mezr.offset(element, document);
    assert.strictEqual(result.left, expected.left, 'left offset - from document');
    assert.strictEqual(result.top, expected.top, 'top offset - from document');

  });

});