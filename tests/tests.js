// TODO
// - Split tests in to separate files, based on the modules.

function testSuite(targetTests) {

  //
  // Setup
  //

  // Create elements.
  var docElem = document.documentElement;
  var body = document.body;
  var fixture = document.createElement('div');
  var element = document.createElement('div');
  var elementInner = document.createElement('div');
  var anchor = document.createElement('div');
  var container = document.createElement('div');

  // Set up elements.
  element.appendChild(elementInner);
  fixture.appendChild(element);
  fixture.appendChild(anchor);
  fixture.appendChild(container);
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

  // Filter tests if needed.
  if (targetTests) {
    QUnit.config.filter = targetTests;
  }

  //
  // Helpers
  //

  function test(description, assertions, cb) {

    QUnit.test(description, function (assert) {
      var done = assert.async();
      assert.expect(assertions);
      cb(function (method, config) {
        window.setTimeout(function () {
          assert[method](config.r || config.result, config.e || config.expected, config.d || config.description || undefined);
        }, 0);
      }, done);
    });

  }

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
    anchor.removeAttribute('style');
    container.removeAttribute('style');

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

  QUnit.test('#critical: Should return the document\'s width and height.', function (assert) {

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

  QUnit.test('#critical: Should return the window\'s width and height.', function (assert) {

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

  QUnit.test('#critical: Should return the element\'s width and height.', function (assert) {

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

  QUnit.test('#critical: Should return the element\'s width and height correctly if the padding is defined in percentages.', function (assert) {

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

  QUnit.test('#critical: Should return the element\'s width and height correctly if the margin is defined in percentages.', function (assert) {

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

  QUnit.test('#critical: Should return the document\'s offset.', function (assert) {

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

  QUnit.test('#critical: Should return the window\'s offset.', function (assert) {

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

  QUnit.test('#critical: Should return the element\'s offset.', function (assert) {

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

  QUnit.test('#critical: Absolute element - scroll test.', function (assert) {

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

  QUnit.test('#critical: Fixed element - scroll test.', function (assert) {

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

  QUnit.test('#critical: Should match the results of mezr.width(), mezr.height and mezr.offset().', function (assert) {

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
  // Tests - containing block
  //

  QUnit.module('containingBlock');

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

    setStyles(element, {
      position: 'static'
    });

    assert.strictEqual(mezr.containingBlock(element), null);

  });

  QUnit.test('#critical: Relative element\'s containing block should be the element itself.', function (assert) {

    assert.expect(1);

    setStyles(element, {
      position: 'relative'
    });

    assert.strictEqual(mezr.containingBlock(element), element);

  });

  QUnit.test('#critical: Absolute element\'s containing block should be the closest positioned and/or transformed ancestor, and fallback to document if all ancestors are static.', function (assert) {

    assert.expect(5);

    setStyles(document.documentElement, {position: 'fixed'});
    setStyles(document.body, {position: 'relative'});
    setStyles(fixture, {position: 'absolute'});
    setStyles(element, {position: 'absolute'});

    assert.strictEqual(mezr.containingBlock(element), fixture);

    setStyles(fixture, {position: 'static'});
    assert.strictEqual(mezr.containingBlock(element), document.body);

    setStyles(document.body, {position: 'static'});
    assert.strictEqual(mezr.containingBlock(element), document.documentElement);

    setStyles(document.documentElement, {position: 'static'});
    assert.strictEqual(mezr.containingBlock(element), document);

    setStyles(document.documentElement, {
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

      setStyles(outer, {
        display: 'block',
        visibility: 'hidden',
        position: 'absolute',
        width: '1px',
        height: '1px',
        left: '1px',
        top: '0',
        margin: '0'
      });

      setStyles(inner, {
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
      setStyles(outer, {
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

    console.log('transformLeaksFixed: ' + transformLeaksFixed);

    setStyles(document.documentElement, {position: 'fixed'});
    setStyles(document.body, {position: 'absolute'});
    setStyles(fixture, {position: 'relative'});
    setStyles(element, {position: 'fixed'});
    assert.strictEqual(mezr.containingBlock(element), window);

    setStyles(document.documentElement, {
      webkitTransform: 'translateX(0)',
      mozTransform: 'translateX(0)',
      msTransform: 'translateX(0)',
      oTransform: 'translateX(0)',
      transform: 'translateX(0)'
    });
    assert.strictEqual(mezr.containingBlock(element), transformLeaksFixed ? window : document.documentElement);

    setStyles(document.body, {
      webkitTransform: 'translateX(0)',
      mozTransform: 'translateX(0)',
      msTransform: 'translateX(0)',
      oTransform: 'translateX(0)',
      transform: 'translateX(0)'
    });
    assert.strictEqual(mezr.containingBlock(element), transformLeaksFixed ? window : document.body);

    setStyles(fixture, {
      webkitTransform: 'translateX(0)',
      mozTransform: 'translateX(0)',
      msTransform: 'translateX(0)',
      oTransform: 'translateX(0)',
      transform: 'translateX(0)'
    });
    assert.strictEqual(mezr.containingBlock(element), transformLeaksFixed ? window : fixture);

    setStyles(fixture, {position: 'static'});
    assert.strictEqual(mezr.containingBlock(element), transformLeaksFixed ? window : fixture);

  });

  //
  // Tests - intersection
  //

  QUnit.module('intersection');

  QUnit.test('#critical: Should return the intersection area data of two or more objects', function (assert) {

    assert.expect(6);

    var rectA = {width: 5, height: 5, left: 0, top: 0};
    var rectB = {width: 5, height: 5, left: 3, top: 3};
    var rectC = {width: 5, height: 5, left: 5, top: 5};
    var rectD = {width: 5, height: 5, left: 4, top: 4};

    setStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    setStyles(element, {
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

  //
  // Tests - distance
  //

  QUnit.module('distance');

  QUnit.test('#critical: Should return the direct distance between the two objects', function (assert) {

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

    setStyles(fixture, {
      position: 'absolute',
      width: '5px',
      height: '5px',
      left: '10px',
      top: '10px'
    });

    setStyles(element, {
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
    setStyles(element, {paddingRight: '5px', paddingBottom: '5px'});
    assert.strictEqual(mezr.distance(rectA, [elemB, 'content']), Math.sqrt(Math.pow(5, 2) + Math.pow(5, 2)), 'with element (edge layer defined) + object');

  });

  //
  // Tests - place
  //

  QUnit.module('place');

  // TODO:
  // - Test that containment pushing and force pushing work as advertised.
  // - Test that element accepts an element, window or document.
  // - Test that target accepts an element, window, document or an object.
  // - Test that contain.within accepts an element, window, document or an object.
  // - Test that contain does not do anything if within is not set or onCollision is not set.
  // - Test that positions work as advertised (a light weight version of the monster test).

  QUnit.test('#critical: Should always return an object with two properties: "left" and "top".', function (assert) {

    assert.expect(1);
    assert.deepEqual(Object.keys(mezr.place({element: element, target: element})).sort(), ['left', 'top']);

  });

  QUnit.test('#critical: Make sure we have correct default options.', function (assert) {

    assert.expect(1);

    assert.deepEqual(mezr._settings.placeDefaultOptions, {
      element: null,
      target: null,
      position: 'left top left top',
      offsetX: 0,
      offsetY: 0,
      contain: null
    });

  });

  QUnit.test('#critical: Negative or positive "offset" option values should affect the positioning.', function (assert) {

    assert.expect(4);

    setStyles(fixture, {
      position: 'absolute',
      width: '10000px',
      height: '10000px',
      left: '0px',
      top: '0px'
    });

    setStyles(element, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '10px',
      height: '10px',
      padding: '10px',
      border: '10px solid',
      margin: '0px'
    });

    window.scrollTo(0, 0);

    assert.deepEqual(
      mezr.place({
        element: element,
        target: window,
        offsetX: -10,
        offsetY: 10
      }),
      {
        left: window.pageXOffset - 10,
        top: window.pageYOffset + 10
      },
      'Using negative and positive floats work.'
    );
    assert.deepEqual(
      mezr.place({
        element: element,
        target: window,
        offsetX: '-10',
        offsetY: '10'
      }),
      {
        left: window.pageXOffset - 10,
        top: window.pageYOffset + 10
      },
      'Using negative and positive strings work.'
    );
    assert.deepEqual(
      mezr.place({
        element: element,
        target: window,
        offsetX: '-10px',
        offsetY: '10px'
      }),
      {
        left: window.pageXOffset - 10,
        top: window.pageYOffset + 10
      },
      'Using negative and positive strings with "px" appendix work.'
    );
    assert.deepEqual(
      mezr.place({
        element: element,
        target: window,
        offsetX: '-30%',
        offsetY: '60%'
      }),
      {
        left: window.pageXOffset - (element.getBoundingClientRect().width * 0.3),
        top: window.pageYOffset + (element.getBoundingClientRect().height * 0.6)
      },
      'Using negative and positive strings with "%" appendix work.'
    );

  });

  QUnit.test('#extended: An extensive test with all possible positioining variations, css positions and edge layers.', function (assert) {

    var done = assert.async();
    var edgeLayers = ['content', 'padding', 'scroll', 'border', 'margin'];
    var cssPositions = ['relative', 'absolute', 'fixed'];
    var yPositions = ['top', 'center', 'bottom'];
    var xPositions = ['left', 'center', 'right'];
    var positionCombos = (function () {
      var ret = [];
      xPositions.forEach(function (xPos) {
        yPositions.forEach(function (yPos) {
          ret.push([xPos, yPos]);
        });
      });
      return ret;
    })();
    var totalAssertions = cssPositions.length * cssPositions.length * positionCombos.length * positionCombos.length * edgeLayers.length * edgeLayers.length;
    var assertionCount = 0;

    assert.expect(totalAssertions);

    var elemData = {
      left: -17,
      top: -80,
      width: 10,
      height: 10,
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      },
      border: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      },
      margin: {
        left: 3,
        right: 3,
        top: 3,
        bottom: 3
      }
    };

    var anchorData = {
      left: 10,
      top: 10,
      width: 10,
      height: 10,
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      },
      border: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      },
      margin: {
        left: 3,
        right: 3,
        top: 3,
        bottom: 3
      }
    };

    setStyles(fixture, {
      position: 'absolute',
      width: '300px',
      height: '300px',
      left: '0px',
      top: '0px',
      overflow: 'hidden'
    });

    setStyles(element, {
      position: 'absolute',
      left: elemData.left + 'px',
      top: elemData.top + 'px',
      borderStyle: 'solid',
      borderColor: '#ffffff',
      width: elemData.width + 'px',
      height: elemData.height + 'px',
      paddingLeft: elemData.padding.left + 'px',
      paddingRight: elemData.padding.right + 'px',
      paddingTop: elemData.padding.top + 'px',
      paddingBottom: elemData.padding.bottom + 'px',
      borderLeftWidth: elemData.border.left + 'px',
      borderRightWidth: elemData.border.right + 'px',
      borderTopWidth: elemData.border.top + 'px',
      borderBottomWidth: elemData.border.bottom + 'px',
      marginLeft: elemData.margin.left + 'px',
      marginRight: elemData.margin.right + 'px',
      marginTop: elemData.margin.top + 'px',
      marginBottom: elemData.margin.bottom + 'px',
      mozBoxSizing: 'content-box',
      webkitBoxSizing: 'content-box',
      boxSizing: 'content-box'
    });

    setStyles(anchor, {
      position: 'absolute',
      left: anchorData.left + 'px',
      top: anchorData.top + 'px',
      borderStyle: 'solid',
      borderColor: '#ffffff',
      width: anchorData.width + 'px',
      height: anchorData.height + 'px',
      paddingLeft: anchorData.padding.left + 'px',
      paddingRight: anchorData.padding.right + 'px',
      paddingTop: anchorData.padding.top + 'px',
      paddingBottom: anchorData.padding.bottom + 'px',
      borderLeftWidth: anchorData.border.left + 'px',
      borderRightWidth: anchorData.border.right + 'px',
      borderTopWidth: anchorData.border.top + 'px',
      borderBottomWidth: anchorData.border.bottom + 'px',
      marginLeft: anchorData.margin.left + 'px',
      marginRight: anchorData.margin.right + 'px',
      marginTop: anchorData.margin.top + 'px',
      marginBottom: anchorData.margin.bottom + 'px',
      mozBoxSizing: 'content-box',
      webkitBoxSizing: 'content-box',
      boxSizing: 'content-box'
    });

    cssPositions.forEach(function (elemCssPos) {
      cssPositions.forEach(function (anchorCssPos) {
        positionCombos.forEach(function (elemPos) {
          positionCombos.forEach(function (anchorPos) {
            edgeLayers.forEach(function (elemEdge) {
              edgeLayers.forEach(function (anchorEdge) {
                window.setTimeout(function() {
                  checkPlacement(elemCssPos, anchorCssPos, elemPos, anchorPos, elemEdge, anchorEdge);
                  if ((++assertionCount) === totalAssertions) {
                    done();
                  }
                }, 0);
              });
            });
          });
        });
      });
    });

    function checkPlacement(elementCssPosition, anchorCssPosition, elementPosition, anchorPosition, elementEdge, anchorEdge) {

      // Set CSS positions.
      setStyles(element, {position: elementCssPosition});
      setStyles(anchor, {position: anchorCssPosition});

      var my = elementPosition[0] + ' ' +  elementPosition[1];
      var at = anchorPosition[0] + ' ' +  anchorPosition[1];

      // Get element and anchor rects.
      var elemRect = mezr.rect(element, elementEdge);
      var anchorRect = mezr.rect(anchor, anchorEdge);

      // Get the result.
      var result = mezr.place({
        element: [element, elementEdge],
        target: [anchor, anchorEdge],
        position: my + ' ' + at
      });

      // Get the expected result.
      var expected = {
        left: getPlacePosition(elementPosition[0][0] + anchorPosition[0][0], elemRect.width, elemRect.left, elemData.left, anchorRect.width, anchorRect.left),
        top: getPlacePosition(elementPosition[1][0] + anchorPosition[1][0], elemRect.height, elemRect.top, elemData.top, anchorRect.height, anchorRect.top)
      };

      // Do the assertion.
      assert.deepEqual(
        result,
        expected,
        'element position: ' + elementCssPosition + ', ' +
        'anchor position: ' + anchorCssPosition + ', ' +
        'element edge: ' + elementEdge + ', ' +
        'anchor edge: ' + anchorEdge + ', ' +
        'my: ' + my + ', ' +
        'at: ' + at
      );

    }

    function getPlacePosition(placement, elemSize, elemOffset, elemCurrentPosition, anchorSize, anchorOffset) {

      var zeroPoint = anchorOffset - elemOffset + elemCurrentPosition;
      return placement === 'll' || placement === 'tt' ? zeroPoint :
             placement === 'lc' || placement === 'tc' ? zeroPoint + (anchorSize / 2) :
             placement === 'lr' || placement === 'tb' ? zeroPoint + anchorSize :
             placement === 'cl' || placement === 'ct' ? zeroPoint - (elemSize / 2) :
             placement === 'cr' || placement === 'cb' ? zeroPoint + anchorSize - (elemSize / 2) :
             placement === 'rl' || placement === 'bt' ? zeroPoint - elemSize :
             placement === 'rc' || placement === 'bc' ? zeroPoint - elemSize + (anchorSize / 2) :
             placement === 'rr' || placement === 'bb' ? zeroPoint - elemSize + anchorSize :
                                                        zeroPoint + (anchorSize / 2) - (elemSize / 2);

    }

  });

}