TestSuite.modules.push(function () {

  QUnit.module('overlap');

  var inst = this;
  var fixture = this.fixture;
  var element = this.element;

  QUnit.test('#critical: Should return data on how how much element overlaps container from eahc side.', function (assert) {

    assert.expect(1);

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

    assert.deepEqual(mezr.overlap(fixture, element), {left: 3, right: -98, top: 3, bottom: -98});

  });

});