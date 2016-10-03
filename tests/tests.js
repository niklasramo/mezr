window.onload = function() {

  //
  // Setup
  //

  // Create elements.
  var docElem = document.documentElement;
  var body = document.body;
  var fixture = document.createElement('div');
  var element = document.createElement('div');
  var elementInner = document.createElement('div');

  // Set up elements.
  element.appendChild(elementInner);
  fixture.appendChild(element);
  body.appendChild(fixture);

  // Setup QUnit.
  QUnit.config.reorder = false;
  QUnit.testStart(function () {

    // Reset element styles.
    resetElements();

    // Scroll window to top.
    window.scrollTo(0, 0);

  });
  QUnit.testDone(function () {

    // Reset element styles.
    resetElements();

    // Scroll window to top.
    window.scrollTo(0, 0);

  });

  //
  // Helpers
  //

  function setStyles(elem, styles) {

    for (style in styles) {
      elem.style[style] = styles[style];
    }

    repaint(elem);

  }

  function repaint(element) {

    var display = element.style.display;
    element.style.display = 'none';
    element.offsetHeight;
    element.style.display = display;

    // Needed for iOS emulator
    docElem.clientWidth;
    window.innerWidth;

  }

  function resetElements() {

    // Reset element styles.
    docElem.removeAttribute('style');
    body.removeAttribute('style');
    fixture.removeAttribute('style');
    element.removeAttribute('style');
    elementInner.removeAttribute('style');

    // Reset body margins.
    body.style.margin = '0px';

  }

  //
  // Tests
  //

  QUnit.module('width / height');

  QUnit.test('mezr.width/height(document, "content"/"padding") should return the document\'s width/height without scrollbar', function (assert) {

    assert.expect(4);

    setStyles(fixture, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '10000px',
      height: '10000px'
    });

    var expected = 10000;

    assert.strictEqual(mezr.width(document, 'content'), expected, 'width - "content"');
    assert.strictEqual(mezr.width(document, 'padding'), expected, 'width - "padding"');

    assert.strictEqual(mezr.height(document, 'content'), expected, 'height - "content"');
    assert.strictEqual(mezr.height(document, 'padding'), expected, 'height - "padding"');

  });

  QUnit.test('mezr.width/height(document, undefined/"scroll"/"border"/"margin") should return the document\'s width/height with scrollbar', function (assert) {

    assert.expect(8);

    setStyles(fixture, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '10000px',
      height: '10000px'
    });

    var expectedWidth = 10000 + window.innerWidth - docElem.clientWidth;
    var expectedHeight = 10000 + window.innerHeight - docElem.clientHeight;

    // THese fail on iOS -> check out why...
    assert.strictEqual(mezr.width(document), expectedWidth, 'width - undefined');
    assert.strictEqual(mezr.width(document, 'scroll'), expectedWidth, 'width - "scroll"');
    assert.strictEqual(mezr.width(document, 'border'), expectedWidth, 'width - "border"');
    assert.strictEqual(mezr.width(document, 'margin'), expectedWidth, 'width - "margin"');

    assert.strictEqual(mezr.height(document), expectedHeight, 'height - undefined');
    assert.strictEqual(mezr.height(document, 'scroll'), expectedHeight, 'height - "scroll"');
    assert.strictEqual(mezr.height(document, 'border'), expectedHeight, 'height - "border"');
    assert.strictEqual(mezr.height(document, 'margin'), expectedHeight, 'height - "margin"');

  });

  QUnit.test('mezr.width/height(window, "content"/"padding") should return the window\'s width/height without scrollbar', function (assert) {

    assert.expect(4);

    setStyles(docElem, {
      'overflow': 'scroll'
    });

    var expectedWidth = docElem.clientWidth;
    var expectedHeight = docElem.clientHeight;

    assert.strictEqual(mezr.width(window, 'content'), expectedWidth, 'width - "content"');
    assert.strictEqual(mezr.width(window, 'padding'), expectedWidth, 'width - "padding"');

    assert.strictEqual(mezr.height(window, 'content'), expectedHeight, 'height - "content"');
    assert.strictEqual(mezr.height(window, 'padding'), expectedHeight, 'height - "padding"');

  });

  QUnit.test('mezr.width/height(window, undefined/"scroll"/"border"/"margin") should return the window\'s width/height with scrollbar', function (assert) {

    assert.expect(8);

    setStyles(docElem, {
      'overflow': 'scroll'
    });

    var expectedWidth = window.innerWidth;
    var expectedHeight = window.innerHeight;

    assert.strictEqual(mezr.width(window), expectedWidth, 'width - undefined');
    assert.strictEqual(mezr.width(window, 'scroll'), expectedWidth, 'width - "scroll"');
    assert.strictEqual(mezr.width(window, 'border'), expectedWidth, 'width - "border"');
    assert.strictEqual(mezr.width(window, 'margin'), expectedWidth, 'width - "margin"');

    assert.strictEqual(mezr.height(window), expectedHeight, 'height - undefined');
    assert.strictEqual(mezr.height(window, 'scroll'), expectedHeight, 'height - "scroll"');
    assert.strictEqual(mezr.height(window, 'border'), expectedHeight, 'height - "border"');
    assert.strictEqual(mezr.height(window, 'margin'), expectedHeight, 'height - "margin"');

  });

  QUnit.test('mezr.width/height(element, "content") should return the element\'s content width/height', function (assert) {

    assert.expect(4);

    // Content box

    setStyles(element, {
      width: '10px',
      height: '10px',
      padding: '10px',
      border: '10px solid #ffffff',
      margin: '10px'
    });

    var expected = 10;
    assert.strictEqual(mezr.width(element, 'content'), expected, 'width - content-box');
    assert.strictEqual(mezr.height(element, 'content'), expected, 'height - content-box');

    // Border box

    setStyles(element, {
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      boxSizing: 'border-box'
    });

    var expected = 0;
    assert.strictEqual(mezr.width(element, 'content'), expected, 'width - border-box');
    assert.strictEqual(mezr.height(element, 'content'), expected, 'height - border-box');

  });

  QUnit.test('mezr.width/height(element, "padding") should return the element\'s content width/height with padding', function (assert) {

    assert.expect(4);

    // Content box

    setStyles(element, {
      width: '10px',
      height: '10px',
      padding: '10px',
      border: '10px solid #ffffff',
      margin: '10px'
    });

    var expected = 30;
    assert.strictEqual(mezr.width(element, 'padding'), expected, 'width - content-box');
    assert.strictEqual(mezr.height(element, 'padding'), expected, 'height - content-box');

    // Border box

    setStyles(element, {
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      boxSizing: 'border-box'
    });

    var expected = 20;
    assert.strictEqual(mezr.width(element, 'padding'), expected, 'width - border-box');
    assert.strictEqual(mezr.height(element, 'padding'), expected, 'height - border-box');

  });

  QUnit.test('mezr.width/height(element, "scroll") should return the element\'s content width/height with padding and scrollbar', function (assert) {

    assert.expect(4);

    // Content box

    setStyles(element, {
      width: '10px',
      height: '10px',
      padding: '10px',
      border: '10px solid #ffffff',
      margin: '10px'
    });

    var expected = 30;
    assert.strictEqual(mezr.width(element, 'scroll'), expected, 'width - content-box');
    assert.strictEqual(mezr.height(element, 'scroll'), expected, 'height - content-box');

    // Border box

    setStyles(element, {
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      boxSizing: 'border-box'
    });

    var expected = 20;
    assert.strictEqual(mezr.width(element, 'scroll'), expected, 'width - border-box');
    assert.strictEqual(mezr.height(element, 'scroll'), expected, 'height - border-box');

  });

  QUnit.test('mezr.width/height(element, "border") should return the element\'s content width/height with padding, scrollbar and border', function (assert) {

    assert.expect(4);

    // Content box

    setStyles(element, {
      width: '10px',
      height: '10px',
      padding: '10px',
      border: '10px solid #ffffff',
      margin: '10px'
    });

    var expected = 50;
    assert.strictEqual(mezr.width(element, 'border'), expected, 'width - content-box');
    assert.strictEqual(mezr.height(element, 'border'), expected, 'height - content-box');

    // Border box

    setStyles(element, {
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      boxSizing: 'border-box'
    });

    var expected = 40;
    assert.strictEqual(mezr.width(element, 'border'), expected, 'width - border-box');
    assert.strictEqual(mezr.height(element, 'border'), expected, 'height - border-box');

  });

  QUnit.test('mezr.width/height(element, "margin") should return the element\'s content width/height with padding, scrollbar, border and margin', function (assert) {

    assert.expect(4);

    // Content box

    setStyles(element, {
      width: '10px',
      height: '10px',
      padding: '10px',
      border: '10px solid #ffffff',
      margin: '10px'
    });

    var expected = 70;
    assert.strictEqual(mezr.width(element, 'margin'), expected, 'width - content-box');
    assert.strictEqual(mezr.height(element, 'margin'), expected, 'height - content-box');

    // Border box

    setStyles(element, {
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      boxSizing: 'border-box'
    });

    var expected = 60;
    assert.strictEqual(mezr.width(element, 'margin'), expected, 'width - border-box');
    assert.strictEqual(mezr.height(element, 'margin'), expected, 'height - border-box');

  });

  QUnit.module('offset');

  QUnit.test('mezr.offset(document) should return the document\'s offset', function (assert) {

    assert.expect(2);

    setStyles(fixture, {
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

  QUnit.test('mezr.offset(window) should return the window\'s offset', function (assert) {

    assert.expect(2);

    setStyles(fixture, {
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

  QUnit.module('intersection');

  QUnit.test('mezr.intersection(objA, objB) should return the intersection area data', function (assert) {

    assert.expect(2);

    var rectA = {width: 5, height: 5, left: 0, top: 0};
    var rectB = {width: 5, height: 5, left: 4, top: 4};
    var rectC = {width: 5, height: 5, left: 5, top: 5};

    assert.deepEqual(mezr.intersection(rectA, rectB), {left: 4, top: 4, height: 1, width: 1}, 'intersection area exists');
    assert.strictEqual(mezr.intersection(rectA, rectC), null, 'intersection area does not exist');

  });

  QUnit.module('distance');

  QUnit.test('mezr.distance(objA, objB) should return the direct distance between the two objects', function (assert) {

    assert.expect(8);

    var rectA = {width: 5, height: 5, left: 10, top: 10};
    var rectB = {width: 5, height: 5};
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

    for (var name in setA) {
      var pos = setA[name];
      var expected = Math.sqrt(Math.pow(5, 2) + Math.pow(5, 2));
      rectB.left = pos.left;
      rectB.top = pos.top;
      assert.strictEqual(mezr.distance(rectA, rectB), expected, name);
    }

    for (var name in setB) {
      var pos = setB[name];
      var expected = 5;
      rectB.left = pos.left;
      rectB.top = pos.top;
      assert.strictEqual(mezr.distance(rectA, rectB), expected, name);
    }

  });

};