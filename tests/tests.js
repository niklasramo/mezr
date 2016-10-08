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
  var elementOf = document.createElement('div');

  // Set up elements.
  element.appendChild(elementInner);
  fixture.appendChild(element);
  fixture.appendChild(elementOf);
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

    // Needed for iOS emulator.
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
    elementOf.removeAttribute('style');

    // Reset body margins.
    body.style.margin = '0px';

  }

  function forIn(obj, callback) {

    if (typeof callback === 'function') {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          callback(obj[prop], prop);
        }
      }
    }

  }

  //
  // Tests - width & height
  //

  QUnit.module('width & height');

  QUnit.test('mezr.width(document) and mezr.height(document) should return the document\'s width and height', function (assert) {

    assert.expect(12);

    setStyles(fixture, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '10000px',
      height: '10000px'
    });

    // Without scrollbar.
    var expectedWidth = 10000;
    var expectedHeight = 10000;
    assert.strictEqual(mezr.width(document, 'content'), expectedWidth, 'width - "content"');
    assert.strictEqual(mezr.width(document, 'padding'), expectedWidth, 'width - "padding"');
    assert.strictEqual(mezr.height(document, 'content'), expectedHeight, 'height - "content"');
    assert.strictEqual(mezr.height(document, 'padding'), expectedHeight, 'height - "padding"');

    // With scrollbar.
    var expectedWidth = 10000 + window.innerWidth - docElem.clientWidth;
    var expectedHeight = 10000 + window.innerHeight - docElem.clientHeight;
    assert.strictEqual(mezr.width(document), expectedWidth, 'width - ""');
    assert.strictEqual(mezr.width(document, 'scroll'), expectedWidth, 'width - "scroll"');
    assert.strictEqual(mezr.width(document, 'border'), expectedWidth, 'width - "border"');
    assert.strictEqual(mezr.width(document, 'margin'), expectedWidth, 'width - "margin"');
    assert.strictEqual(mezr.height(document), expectedHeight, 'height - ""');
    assert.strictEqual(mezr.height(document, 'scroll'), expectedHeight, 'height - "scroll"');
    assert.strictEqual(mezr.height(document, 'border'), expectedHeight, 'height - "border"');
    assert.strictEqual(mezr.height(document, 'margin'), expectedHeight, 'height - "margin"');

  });

  QUnit.test('mezr.width(window) and mezr.height(window) should return the window\'s width and height', function (assert) {

    assert.expect(12);

    setStyles(docElem, {
      'overflow': 'scroll'
    });

    // Without scrollbar.
    var expectedWidth = docElem.clientWidth;
    var expectedHeight = docElem.clientHeight;
    assert.strictEqual(mezr.width(window, 'content'), expectedWidth, 'width - "content"');
    assert.strictEqual(mezr.width(window, 'padding'), expectedWidth, 'width - "padding"');
    assert.strictEqual(mezr.height(window, 'content'), expectedHeight, 'height - "content"');
    assert.strictEqual(mezr.height(window, 'padding'), expectedHeight, 'height - "padding"');

    // With scrollbar.
    var expectedWidth = window.innerWidth;
    var expectedHeight = window.innerHeight;
    assert.strictEqual(mezr.width(window), expectedWidth, 'width - ""');
    assert.strictEqual(mezr.width(window, 'scroll'), expectedWidth, 'width - "scroll"');
    assert.strictEqual(mezr.width(window, 'border'), expectedWidth, 'width - "border"');
    assert.strictEqual(mezr.width(window, 'margin'), expectedWidth, 'width - "margin"');
    assert.strictEqual(mezr.height(window), expectedHeight, 'height - ""');
    assert.strictEqual(mezr.height(window, 'scroll'), expectedHeight, 'height - "scroll"');
    assert.strictEqual(mezr.height(window, 'border'), expectedHeight, 'height - "border"');
    assert.strictEqual(mezr.height(window, 'margin'), expectedHeight, 'height - "margin"');

  });

  QUnit.test('mezr.width(element) and mezr.height(element) should return the element\'s width and height', function (assert) {

    assert.expect(48);

    var expectedWidth;
    var expectedHeight;
    var elemGBCR;
    var innerGBCR;

    // Define the element's dimensions.
    var width = 10;
    var height = 10;
    var padding = {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    };
    var border = {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    };
    var margin = {
      left: -10,
      right: 10,
      top: -10,
      bottom: 10
    };

    // Set the element's base styles.
    setStyles(element, {
      position: 'relative',
      borderStyle: 'solid',
      borderColor: '#ffffff',
      width: width + 'px',
      height: height + 'px',
      paddingLeft: padding.left + 'px',
      paddingRight: padding.right + 'px',
      paddingTop: padding.top + 'px',
      paddingBottom: padding.bottom + 'px',
      borderLeftWidth: border.left + 'px',
      borderRightWidth: border.right + 'px',
      borderTopWidth: border.top + 'px',
      borderBottomWidth: border.bottom + 'px',
      marginLeft: margin.left + 'px',
      marginRight: margin.right + 'px',
      marginTop: margin.top + 'px',
      marginBottom: margin.bottom + 'px'
    });

    // Set the inner element's styles.
    setStyles(elementInner, {
      display: 'block',
      position: 'absolute',
      left: '0px',
      right: '0px',
      top: '0px',
      bottom: '0px',
      width: 'auto',
      height: 'auto'
    });

    // Magical function to mimic Mezr's width/height behaviour.
    function getDimension(dimension, edgeLayer) {

      var elemGBCR = element.getBoundingClientRect();
      var innerGBCR = elementInner.getBoundingClientRect();
      var edgeLayer = edgeLayer || 'border';
      var sideA = dimension === 'width' ? 'left' : 'top';
      var sideB = dimension === 'width' ? 'right' : 'bottom';

      if (edgeLayer === 'content') {
        return innerGBCR[dimension] - padding[sideA] - padding[sideB];
      }
      else if (edgeLayer === 'padding') {
        return innerGBCR[dimension];
      }
      else if (edgeLayer === 'scroll') {
        return elemGBCR[dimension] - border[sideA] - border[sideB];
      }
      else if (edgeLayer === 'border') {
        return elemGBCR[dimension];
      }
      else if (edgeLayer === 'margin') {
        var marginA = margin[sideA] < 0 ? 0 : margin[sideA];
        var marginB = margin[sideB] < 0 ? 0 : margin[sideB];
        return elemGBCR[dimension] + marginA + marginB;
      }

    }

    // Run all height and width tests.
    function runTests(message) {

      ['', 'content', 'padding', 'scroll', 'border', 'margin'].forEach(function (edgeLayer) {
        assert.strictEqual(mezr.width(element, edgeLayer), getDimension('width', edgeLayer), 'width - "' + edgeLayer + '" - ' + message);
        assert.strictEqual(mezr.height(element, edgeLayer), getDimension('height', edgeLayer), 'height - "' + edgeLayer + '" - ' + message);
      });

    }

    // Content box - No scrollbar
    setStyles(element, {
      overflow: 'visible',
      mozBoxSizing: 'content-box',
      webkitBoxSizing: 'content-box',
      boxSizing: 'content-box'
    });
    runTests('content-box - without scrollbar');

    // Border box - No scrollbar
    setStyles(element, {
      overflow: 'visible',
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      boxSizing: 'border-box'
    });
    runTests('border-box - without scrollbar');

    // Content box - Scrollbar
    setStyles(element, {
      overflow: 'scroll',
      mozBoxSizing: 'content-box',
      webkitBoxSizing: 'content-box',
      boxSizing: 'content-box'
    });
    runTests('content-box - with scrollbar');

    // Content box - Scrollbar
    setStyles(element, {
      overflow: 'scroll',
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      boxSizing: 'border-box'
    });
    runTests('border-box - with scrollbar');

  });

  QUnit.test('mezr.width(element) and mezr.height(element) should return the width and height correctly if the padding is defined in percentages', function (assert) {

    assert.expect(4);

    setStyles(fixture, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '1000px',
      height: '1000px'
    });

    setStyles(element, {
      position: 'relative',
      width: '100px',
      height: '100px',
      padding: '1.5%',
      border: '10px solid',
      overflow: 'scroll',
      mozBoxSizing: 'content-box',
      webkitBoxSizing: 'content-box',
      boxSizing: 'content-box'
    });

    assert.strictEqual(mezr.width(element, 'margin'), 150, 'width - "margin" - content-box');
    assert.strictEqual(mezr.height(element, 'margin'), 150, 'height - "margin" - content-box');

    setStyles(element, {
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      boxSizing: 'border-box'
    });

    assert.strictEqual(mezr.width(element, 'margin'), 100, 'width - "margin" - border-box');
    assert.strictEqual(mezr.height(element, 'margin'), 100, 'height - "margin" - border-box');

  });

  QUnit.test('mezr.width(element) and mezr.height(element) should return the width and height correctly if the margin is defined in percentages', function (assert) {

    assert.expect(4);

    setStyles(fixture, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '1000px',
      height: '1000px'
    });

    setStyles(element, {
      position: 'relative',
      width: '100px',
      height: '100px',
      margin: '10%',
      border: '10px solid',
      overflow: 'scroll',
      mozBoxSizing: 'content-box',
      webkitBoxSizing: 'content-box',
      boxSizing: 'content-box'
    });

    assert.strictEqual(mezr.width(element, 'margin'), 320, 'width - "margin" - content-box');
    assert.strictEqual(mezr.height(element, 'margin'), 320, 'height - "margin" - content-box');

    setStyles(element, {
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      boxSizing: 'border-box'
    });

    assert.strictEqual(mezr.width(element, 'margin'), 300, 'width - "margin" - border-box');
    assert.strictEqual(mezr.height(element, 'margin'), 300, 'height - "margin" - border-box');

  });

  //
  // Tests - offset
  //

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

  QUnit.test('mezr.offset(element) should return the element\'s offset', function (assert) {

    assert.expect(40);

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

    setStyles(element, {
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

    forIn(elemValues, function (posValues, posName) {
      forIn(posValues, function (edgeValue, edgeName) {
        setStyles(element, {position: posName});
        window.scrollTo(0, 0);
        assert.strictEqual(mezr.offset(element, edgeName).left, window.pageXOffset + edgeValue, 'left - ' + posName + ' - ' + edgeName);
        assert.strictEqual(mezr.offset(element, edgeName).top, window.pageYOffset + edgeValue, 'top - ' + posName + ' - ' + edgeName);
      });
    });

  });

  QUnit.test('absolute element - scroll test', function (assert) {

    assert.expect(2);

    setStyles(fixture, {
      position: 'absolute',
      width: '10000px',
      height: '10000px',
      left: '0px',
      top: '0px'
    });

    setStyles(element, {
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

  QUnit.test('fixed element - scroll test', function (assert) {

    assert.expect(2);

    setStyles(fixture, {
      position: 'absolute',
      width: '10000px',
      height: '10000px'
    });

    setStyles(element, {
      position: 'fixed',
      left: '2000px',
      top: '2000px'
    });

    window.scrollTo(1000, 1000);

    var result = mezr.offset(element);
    assert.strictEqual(result.left, window.pageXOffset + 2000, 'left offset');
    assert.strictEqual(result.top, window.pageYOffset + 2000, 'top offset');

  });

  //
  // Tests - rect
  //

  QUnit.module('rect');

  QUnit.test('mezr.rect() should match the results of mezr.width(), mezr.height and mezr.offset()', function (assert) {

    assert.expect(36);

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

    setStyles(element, {
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

  //
  // Tests - offset parent
  //

  QUnit.module('offsetParent');

  QUnit.test('basic scenarios', function (assert) {

    assert.expect(16);

    setStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    setStyles(element, {
      position: 'absolute',
      width: '10px',
      height: '10px',
      left: '0px',
      top: '0px'
    });

    setStyles(document.body, {
      position: 'relative'
    });

    var positions = {
      a: 'static',
      b: 'relative',
      c: 'absolute',
      d: 'fixed'
    };

    forIn(positions, function (elementPosition) {

      setStyles(element, {
        position: elementPosition
      });

      forIn(positions, function (fixturePosition) {

        setStyles(fixture, {
          position: fixturePosition
        });

        assert.strictEqual(
          mezr.offsetParent(element),
          elementPosition === 'fixed' ? window : fixturePosition === 'static' ? document.body : fixture,
          elementPosition + ' element with ' + fixturePosition + ' parent'
        );

      });

    });

  });

  QUnit.test('special scenarios', function (assert) {

    assert.expect(8);

    setStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    setStyles(element, {
      position: 'absolute',
      width: '10px',
      height: '10px',
      left: '0px',
      top: '0px'
    });

    assert.strictEqual(mezr.offsetParent(document), null, 'mezr.offsetParent(document) -> null');
    assert.strictEqual(mezr.offsetParent(window), document, 'mezr.offsetParent(window) -> document');
    assert.strictEqual(mezr.offsetParent(document.documentElement), document, 'mezr.offsetParent(document.documentElement) -> document');

    setStyles(document.documentElement, {position: 'static'});
    assert.strictEqual(mezr.offsetParent(document.body), document, 'mezr.offsetParent(document.body) -> document (when documentElement is static)');

    setStyles(document.documentElement, {position: 'relative'});
    assert.strictEqual(mezr.offsetParent(document.body), document.documentElement, 'mezr.offsetParent(document.body) -> documentElement (when documentElement is relative)');

    setStyles(document.documentElement, {position: 'absolute'});
    assert.strictEqual(mezr.offsetParent(document.body), document.documentElement, 'mezr.offsetParent(document.body) -> documentElement (when documentElement is absolute)');

    setStyles(document.documentElement, {position: 'fixed'});
    assert.strictEqual(mezr.offsetParent(document.body), document.documentElement, 'mezr.offsetParent(document.body) -> documentElement (when documentElement is fixed)');

    setStyles(document.documentElement, {position: 'static'});
    setStyles(document.body, {position: 'static'});
    setStyles(fixture, {position: 'static'});
    setStyles(element, {position: 'static'});
    setStyles(elementInner, {position: 'static'});
    assert.strictEqual(mezr.offsetParent(elementInner), document, 'mezr.offsetParent(element) -> document (when all the parent elements are static)');

  });

  //
  // Tests - intersection
  //

  QUnit.module('intersection');

  QUnit.test('mezr.intersection(objA, objB) should return the intersection area data', function (assert) {

    assert.expect(2);

    var rectA = {width: 5, height: 5, left: 0, top: 0};
    var rectB = {width: 5, height: 5, left: 4, top: 4};
    var rectC = {width: 5, height: 5, left: 5, top: 5};

    assert.deepEqual(mezr.intersection(rectA, rectB), {left: 4, top: 4, height: 1, width: 1}, 'intersection area exists');
    assert.strictEqual(mezr.intersection(rectA, rectC), null, 'intersection area does not exist');

  });

  //
  // Tests - distance
  //

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

  //
  // Tests
  //

  QUnit.module('place');

  QUnit.test('basic scenarios', function (assert) {

    assert.expect(486);

    var cssPositions = {
      a: 'relative',
      b: 'absolute',
      c: 'fixed'
    };
    var placePositions = {
      'left top left top': {left: 10, top: 10},
      'center top left top': {left: 5, top: 10},
      'right top left top': {left: 0, top: 10},
      'left center left top': {left: 10, top: 5},
      'center center left top': {left: 5, top: 5},
      'right center left top': {left: 0, top: 5},
      'left bottom left top': {left: 10, top: 0},
      'center bottom left top': {left: 5, top: 0},
      'right bottom left top': {left: 0, top: 0},
      'left top center top': {left: 15, top: 10},
      'center top center top': {left: 10, top: 10},
      'right top center top': {left: 5, top: 10},
      'left center center top': {left: 15, top: 5},
      'center center center top': {left: 10, top: 5},
      'right center center top': {left: 5, top: 5},
      'left bottom center top': {left: 15, top: 0},
      'center bottom center top': {left: 10, top: 0},
      'right bottom center top': {left: 5, top: 0},
      'left top right top': {left: 20, top: 10},
      'center top right top': {left: 15, top: 10},
      'right top right top': {left: 10, top: 10},
      'left center right top': {left: 20, top: 5},
      'center center right top': {left: 15, top: 5},
      'right center right top': {left: 10, top: 5},
      'left bottom right top': {left: 20, top: 0},
      'center bottom right top': {left: 15, top: 0},
      'right bottom right top': {left: 10, top: 0},
      'left top left center': {left: 10, top: 15},
      'center top left center': {left: 5, top: 15},
      'right top left center': {left: 0, top: 15},
      'left center left center': {left: 10, top: 10},
      'center center left center': {left: 5, top: 10},
      'right center left center': {left: 0, top: 10},
      'left bottom left center': {left: 10, top: 5},
      'center bottom left center': {left: 5, top: 5},
      'right bottom left center': {left: 0, top: 5},
      'left top center center': {left: 15, top: 15},
      'center top center center': {left: 10, top: 15},
      'right top center center': {left: 5, top: 15},
      'left center center center': {left: 15, top: 10},
      'center center center center': {left: 10, top: 10},
      'right center center center': {left: 5, top: 10},
      'left bottom center center': {left: 15, top: 5},
      'center bottom center center': {left: 10, top: 5},
      'right bottom center center': {left: 5, top: 5},
      'left top right center': {left: 20, top: 15},
      'center top right center': {left: 15, top: 15},
      'right top right center': {left: 10, top: 15},
      'left center right center': {left: 20, top: 10},
      'center center right center': {left: 15, top: 10},
      'right center right center': {left: 10, top: 10},
      'left bottom right center': {left: 20, top: 5},
      'center bottom right center': {left: 15, top: 5},
      'right bottom right center': {left: 10, top: 5},
      'left top left bottom': {left: 10, top: 20},
      'center top left bottom': {left: 5, top: 20},
      'right top left bottom': {left: 0, top: 20},
      'left center left bottom': {left: 10, top: 15},
      'center center left bottom': {left: 5, top: 15},
      'right center left bottom': {left: 0, top: 15},
      'left bottom left bottom': {left: 10, top: 10},
      'center bottom left bottom': {left: 5, top: 10},
      'right bottom left bottom': {left: 0, top: 10},
      'left top center bottom': {left: 15, top: 20},
      'center top center bottom': {left: 10, top: 20},
      'right top center bottom': {left: 5, top: 20},
      'left center center bottom': {left: 15, top: 15},
      'center center center bottom': {left: 10, top: 15},
      'right center center bottom': {left: 5, top: 15},
      'left bottom center bottom': {left: 15, top: 10},
      'center bottom center bottom': {left: 10, top: 10},
      'right bottom center bottom': {left: 5, top: 10},
      'left top right bottom': {left: 20, top: 20},
      'center top right bottom': {left: 15, top: 20},
      'right top right bottom': {left: 10, top: 20},
      'left center right bottom': {left: 20, top: 15},
      'center center right bottom': {left: 15, top: 15},
      'right center right bottom': {left: 10, top: 15},
      'left bottom right bottom': {left: 20, top: 10},
      'center bottom right bottom': {left: 15, top: 10},
      'right bottom right bottom': {left: 10, top: 10}
    };

    setStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    setStyles(element, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '10px',
      height: '10px'
    });

    setStyles(elementOf, {
      position: 'absolute',
      left: '10px',
      top: '10px',
      width: '10px',
      height: '10px'
    });

    forIn(cssPositions, function (cssPosition) {

      forIn(placePositions, function (pos, posName) {

        var posNameSplit = posName.split(' ');
        var my = posNameSplit[0] + ' ' + posNameSplit[1];
        var at = posNameSplit[2] + ' ' + posNameSplit[3];
        var result = mezr.place(element, {
          my: my,
          at: at,
          of: elementOf
        });

        assert.strictEqual(result.left, pos.left, cssPosition + '- mezr.place(element, {my: ' + my + ' , at: ' + at + ' }).left');
        assert.strictEqual(result.top, pos.top, cssPosition + '- mezr.place(element, {my: ' + my + ' , at: ' + at + ' }).top');

      });

    });

  });

  QUnit.test('special scenarios', function (assert) {

    assert.expect(8);

    setStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    setStyles(element, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '10px',
      height: '10px'
    });

    setStyles(elementOf, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '10px',
      height: '10px'
    });

    // Case #1

    setStyles(element, {
      marginTop: '-10px',
      marginLeft: '-10px'
    });

    var result = mezr.place([element, 'margin'], {
      my: 'left top',
      at: 'left top',
      of: elementOf
    });

    assert.strictEqual(result.left, 10, 'mezr.place([element, "margin"]).left - negative left margin on absolute element');
    assert.strictEqual(result.top, 10, 'mezr.place([element, "margin"]).top - negative top margin on absolute element');

    // Case #2

    setStyles(element, {
      marginTop: '10px',
      marginLeft: '10px'
    });

    var result = mezr.place([element, 'margin'], {
      my: 'left top',
      at: 'left top',
      of: elementOf
    });

    assert.strictEqual(result.left, 0, 'mezr.place([element, "margin"]).left - positive left margin on absolute element');
    assert.strictEqual(result.top, 0, 'mezr.place([element, "margin"]).top - positive top margin on absolute element');

    // Case #3

    setStyles(element, {
      marginTop: '10px',
      marginLeft: '10px'
    });

    var result = mezr.place([element, 'border'], {
      my: 'left top',
      at: 'left top',
      of: elementOf
    });

    assert.strictEqual(result.left, -10, 'mezr.place([element, "border"]).left - positive left margin on absolute element');
    assert.strictEqual(result.top, -10, 'mezr.place([element, "border"]).top - positive top margin on absolute element');

    // Case #4

    setStyles(element, {
      position: 'relative',
      height: '100%',
      width: '100%',
      margin: '0 0 100% 0'
    });

    var result = mezr.place([element, 'margin'], {
      my: 'left bottom',
      at: 'left bottom',
      of: elementOf
    });

    assert.strictEqual(result.left, 0, 'mezr.place([element, "margin"]).left - 100% bottom margin on relative element');
    assert.strictEqual(result.top, -190, 'mezr.place([element, "margin"]).top - 100% bottom margin on relative element');

  });

};