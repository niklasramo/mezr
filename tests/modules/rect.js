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

  QUnit.test('#critical: Should match the results of mezr.width(), mezr.height and mezr.offset().', function (assert) {

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

});