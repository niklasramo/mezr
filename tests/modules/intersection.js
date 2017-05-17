TestSuite.modules.push(function () {

  QUnit.module('intersection');

  var inst = this;
  var docElem = document.documentElement;
  var body = document.body;
  var fixture = this.fixture;
  var element = this.element;
  var elementInner = this.elementInner;
  var anchor = this.anchor;
  var container = this.container;

  QUnit.test('Should return the intersection area data of two or more objects', function (assert) {

    assert.expect(6);

    var rectA = {width: 5, height: 5, left: 0, top: 0};
    var rectB = {width: 5, height: 5, left: 3, top: 3};
    var rectC = {width: 5, height: 5, left: 5, top: 5};
    var rectD = {width: 5, height: 5, left: 4, top: 4};

    inst.setStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    inst.setStyles(element, {
      position: 'absolute',
      width: '5px',
      height: '5px',
      left: '-3px',
      top: '-3px'
    });

    assert.deepEqual(mezr.intersection(rectA, rectB), {left: 3, right: 5, top: 3, bottom: 5, height: 2, width: 2}, 'two objects: intersection area exists');
    assert.strictEqual(mezr.intersection(rectA, rectC), null, 'two objects: intersection area does not exist');
    assert.strictEqual(mezr.intersection(rectA, rectB, rectC), null, 'three objects: intersection area does not exist');
    assert.deepEqual(mezr.intersection(rectA, rectB, rectD), {left: 4, right: 5, top: 4, bottom: 5, height: 1, width: 1}, 'three objects: intersection area exist');
    assert.deepEqual(mezr.intersection(element, fixture), {left: 0, right: 2, top: 0, bottom: 2, height: 2, width: 2}, 'two elements: intersection area exist');
    assert.deepEqual(mezr.intersection(element, fixture, rectA), {left: 0, right: 2, top: 0, bottom: 2, height: 2, width: 2}, 'two elements + object: intersection area exist');

  });

});