TestSuite.modules.push(function () {

  QUnit.module('overflow');

  var inst = this;
  var container = this.fixture;
  var element = this.element;

  QUnit.test('Should return data on how how much element overflows container from each side.', function (assert) {

    assert.expect(4);

    inst.setStyles(container, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    inst.setStyles(element, {
      position: 'absolute',
      width: '3px',
      height: '3px',
      left: '-3px',
      top: '-3px',
      padding: '1px'
    });

    var containerRect = mezr.rect(container);
    var elementRect = mezr.rect(element);
    var expected = {left: 3, right: -98, top: 3, bottom: -98};
    var expectedWithoutPadding = {left: 2, right: -99, top: 2, bottom: -99};

    assert.deepEqual(mezr.overflow(container, element), expected, 'Two elements.');
    assert.deepEqual(mezr.overflow(containerRect, elementRect), expected, 'Two objects.');
    assert.deepEqual(mezr.overflow(containerRect, element), expected, 'Element and object.');
    assert.deepEqual(mezr.overflow(containerRect, [element, 'content']), expectedWithoutPadding, 'Array and object.');

  });

});