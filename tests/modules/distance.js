TestSuite.modules.push(function () {

  QUnit.module('distance');

  var inst = this;
  var docElem = document.documentElement;
  var body = document.body;
  var fixture = this.fixture;
  var element = this.element;
  var elementInner = this.elementInner;
  var anchor = this.anchor;
  var container = this.container;

  QUnit.test('Should return the direct distance between the two objects', function (assert) {

    assert.expect(11);

    var rectA = {width: 5, height: 5, left: 10, top: 10};
    var rectB = {width: 5, height: 5};
    var elemA = fixture;
    var elemB = element;
    var setA = {
      'right top corner': {
        left: 20,
        top: 0
      },
      'right bottom corner': {
        left: 20,
        top: 20
      },
      'left bottom corner': {
        left: 0,
        top: 20
      },
      'left top corner': {
        left: 0,
        top: 0
      }
    };
    var setB = {
      'top edge': {
        left: 10,
        top: 0
      },
      'bottom edge': {
        left: 10,
        top: 20
      },
      'left edge': {
        left: 0,
        top: 10
      },
      'right edge': {
        left: 20,
        top: 10
      }
    };

    inst.setStyles(fixture, {
      position: 'absolute',
      width: '5px',
      height: '5px',
      left: '10px',
      top: '10px'
    });

    inst.setStyles(element, {
      position: 'absolute',
      width: '5px',
      height: '5px',
      left: '-10px',
      top: '-10px'
    });

    // Test corner-to-corner distances.
    for (var name in setA) {
      var pos = setA[name];
      var expected = Math.sqrt(Math.pow(5, 2) + Math.pow(5, 2));
      rectB.left = pos.left;
      rectB.top = pos.top;
      assert.strictEqual(mezr.distance(rectA, rectB), expected, name);
    }

    // Test edge-to-edge distances.
    for (var name in setB) {
      var pos = setB[name];
      var expected = 5;
      rectB.left = pos.left;
      rectB.top = pos.top;
      assert.strictEqual(mezr.distance(rectA, rectB), expected, name);
    }

    // Make sure the function works with two elements.
    assert.strictEqual(mezr.distance(elemA, elemB), Math.sqrt(Math.pow(5, 2) + Math.pow(5, 2)), 'with two elements');

    // Make sure the function works with an element and an object.
    assert.strictEqual(mezr.distance(rectA, elemB), Math.sqrt(Math.pow(5, 2) + Math.pow(5, 2)), 'with element + object');

    // Make sure the method allows defining the edge layer for elements.
    inst.setStyles(element, {paddingRight: '5px', paddingBottom: '5px'});
    assert.strictEqual(mezr.distance(rectA, [elemB, 'content']), Math.sqrt(Math.pow(5, 2) + Math.pow(5, 2)), 'with element (edge layer defined) + object');

  });

});