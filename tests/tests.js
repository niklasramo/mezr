window.onload = function() {

  //
  // Setup
  //

  QUnit.config.reorder = false;

  // Cache elements used in testing.
  var
  docElem = document.documentElement,
  head = document.getElementsByTagName('head')[0],
  body = document.body,
  fixture = document.createElement('div'),
  element = document.createElement('div'),
  elementInner = document.createElement('div'),
  of = document.createElement('div'),
  within = document.createElement('div'),
  result,
  expected,
  desc;

  // Give test elements an id.
  fixture.id = 'test-fixture';
  element.id = 'test-element';
  elementInner.id = 'test-element-inner';
  of.id = 'test-of';
  within.id = 'test-within';

  // Nest test fixtures and append them to body.
  element.appendChild(elementInner);
  fixture.appendChild(element);
  fixture.appendChild(of);
  fixture.appendChild(within);
  body.appendChild(fixture);

  // Apply CSS reset
  resetCSS();

  QUnit.testStart(function () {

    // Reset element inline styles.
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('style');
    fixture.removeAttribute('style');
    element.removeAttribute('style');
    elementInner.removeAttribute('style');
    of.removeAttribute('style');
    within.removeAttribute('style');

    // Scroll window to top.
    window.scrollTo(0, 0);

    // Reset result and expected.
    result = {};
    expected = {};

  });

  //
  // Helper functions
  //

  // CSS reset
  function resetCSS() {

    var
    fixtureStyle = document.createElement('style'),
    fixtureCSS = 'body { margin: 0; }';

    // Append fixture stylesheet to head.
    fixtureStyle.type = 'text/css';
    if (fixtureStyle.styleSheet) {
      fixtureStyle.styleSheet.cssText = fixtureCSS;
    } else {
      fixtureStyle.appendChild(document.createTextNode(fixtureCSS));
    }
    head.appendChild(fixtureStyle);

  }

  // Helper to wrap assertions.
  function a(assert, obj) {

    var
    comparisons = [
      'deepEqual',
      'equal',
      'notDeepEqual',
      'notEqual',
      'notOk',
      'notPropEqual',
      'notStrictEqual',
      'ok',
      'propEqual',
      'strictEqual',
      'throws'
    ],
    comparisonsLen = comparisons.length,
    comparisonOperator;

    for (var i = 0; i < comparisonsLen; i++) {
      if (obj.hasOwnProperty(comparisons[i])) {
        comparisonOperator = comparisons[i];
        break;
      }
    }

    if (comparisonOperator) {
      assert[comparisonOperator](obj.result, obj[comparisonOperator], obj.description || '');
    }

  };

  // Helper function to set inline styles.
  function addStyles(elem, styles) {

    for (style in styles) {
      elem.style[style] = styles[style];
    }
    forceRedraw(elem);

  }

  // Helper function to remove inline styles.
  function removeStyles(elem, styles) {

    for (style in styles) {
      elem.style[style] = '';
    }
    forceRedraw(elem);

  }

  // Helper function to get calculated style.
  function getStyle(el, style) {

    return window.getComputedStyle(el, null).getPropertyValue(style);

  }

  // Helper function to force repaint an element.
  function forceRedraw(element) {

    var disp = element.style.display;
    element.style.display = 'none';
    var trick = element.offsetHeight;
    element.style.display = disp;

  }

  // for in  loop helper.
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
  // Tests
  //

  QUnit.module('width/height');

  QUnit.test('document', function (assert) {

    assert.expect(2);

    addStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    addStyles(element, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '10000px',
      height: '10000px',
      boxSizing : 'border-box'
    });

    a(assert, {
      description: 'size without viewport scrollbar',
      result: {
        width: mezr.width(document, 'core'),
        height: mezr.height(document, 'core')
      },
      deepEqual: {
        width: 10000,
        height: 10000
      }
    });

    a(assert, {
      description: 'size with viewport scrollbar',
      result: {
        width: mezr.width(document, 'scroll'),
        height: mezr.height(document, 'scroll')
      },
      deepEqual: {
        width: 10000 + window.innerWidth - document.documentElement.clientWidth,
        height: 10000 + window.innerHeight - document.documentElement.clientHeight
      }
    });

  });

  QUnit.test('window', function (assert) {

    // TODO: Add tests for edgeLayer value normalization and default value check

    assert.expect(2);

    addStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    addStyles(element, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '10000px',
      height: '10000px',
      boxSizing : 'border-box'
    });

    a(assert, {
      description: 'size without viewport scrollbar',
      result: {
        width: mezr.width(window, 'core'),
        height: mezr.height(window, 'core')
      },
      deepEqual: {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      }
    });

    a(assert, {
      description: 'size with viewport scrollbar',
      result: {
        width: mezr.width(window, 'scroll'),
        height: mezr.height(window, 'scroll')
      },
      deepEqual: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });

  });

  QUnit.test('element', function (assert) {

    assert.expect(20);

    addStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    addStyles(element, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '100px',
      height: '100px',
      margin: '10px 10px -10px -10px',
      padding: '10px',
      border: '10px solid',
      overflow: 'scroll',
      boxSizing: 'content-box'
    });

    addStyles(elementInner, {
      position: 'absolute',
      display: 'block',
      left: '0px',
      right: '0px',
      top: '0px',
      bottom: '0px',
      overflow: 'hidden'
    });

    var
    assertData = {
      core: {
        a: {
          expected: function () {
            return {
              width: elementInner.getBoundingClientRect().width - 20,
              height: elementInner.getBoundingClientRect().height - 20
            };
          }
        },
        b: {
          expected: function () {
            return {
              width: elementInner.getBoundingClientRect().width - 20,
              height: elementInner.getBoundingClientRect().height - 20
            };
          }
        },
        c: {
          expected: function () {
            return {
              width: elementInner.getBoundingClientRect().width - 20,
              height: elementInner.getBoundingClientRect().height - 20
            };
          }
        },
        d: {
          expected: function () {
            return {
              width: elementInner.getBoundingClientRect().width - 20,
              height: elementInner.getBoundingClientRect().height - 20
            };
          }
        }
      },
      padding: {
        a: {
          expected: function () {
            return {
              width: elementInner.getBoundingClientRect().width,
              height: elementInner.getBoundingClientRect().height
            };
          }
        },
        b: {
          expected: function () {
            return {
              width: elementInner.getBoundingClientRect().width,
              height: elementInner.getBoundingClientRect().height
            };
          }
        },
        c: {
          expected: function () {
            return {
              width: elementInner.getBoundingClientRect().width,
              height: elementInner.getBoundingClientRect().height
            };
          }
        },
        d: {
          expected: function () {
            return {
              width: elementInner.getBoundingClientRect().width,
              height: elementInner.getBoundingClientRect().height
            };
          }
        }
      },
      scroll: {
        a: {
          expected: {
            width: 120,
            height: 120
          }
        },
        b: {
          expected: {
            width: 120,
            height: 120
          }
        },
        c: {
          expected: {
            width: 80,
            height: 80
          }
        },
        d: {
          expected: {
            width: 80,
            height: 80
          }
        }
      },
      border: {
        a: {
          expected: {
            width: 140,
            height: 140
          }
        },
        b: {
          expected: {
            width: 140,
            height: 140
          }
        },
        c: {
          expected: {
            width: 100,
            height: 100
          }
        },
        d: {
          expected: {
            width: 100,
            height: 100
          }
        }
      },
      margin: {
        a: {
          expected: {
            width: 150,
            height: 150
          }
        },
        b: {
          expected: {
            width: 150,
            height: 150
          }
        },
        c: {
          expected: {
            width: 110,
            height: 110
          }
        },
        d: {
          expected: {
            width: 110,
            height: 110
          }
        }
      }
    };

    forIn(assertData, function (sets, edgeLayerName) {

      forIn(sets, function (setData, setName) {

        var
        boxSizing = setName === 'a' || setName === 'b' ? 'content-box' : 'border-box',
        overflow = setName === 'a' || setName === 'c' ? 'scroll' : 'hidden';

        addStyles(element, {
          overflow: overflow,
          boxSizing: boxSizing
        });

        a(assert, {
          description: '"' + edgeLayerName + '" size: box-sizing = ' + boxSizing + ', overflow = ' + overflow,
          result: {
            width: mezr.width(element, edgeLayerName),
            height: mezr.height(element, edgeLayerName)
          },
          deepEqual: typeof setData.expected === 'function' ? setData.expected() : setData.expected
        });

      });

    });

  });

  QUnit.test('element - edgeLayer default value', function (assert) {

    assert.expect(1);

    addStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    addStyles(element, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '100px',
      height: '100px',
      margin: '10px',
      padding: '10px',
      border: '10px solid',
      overflow: 'scroll',
      boxSizing: 'content-box'
    });

    a(assert, {
      description: 'Default "edge" argument value should be "border"',
      result: {
        width: mezr.width(element),
        height: mezr.height(element)
      },
      deepEqual: {
        width: mezr.width(element, 'border'),
        height: mezr.height(element, 'border')
      }
    });

  });

  QUnit.test('element - edgeLayer string/number values', function (assert) {

    assert.expect(10);

    addStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    addStyles(element, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '100px',
      height: '100px',
      margin: '10px',
      padding: '10px',
      border: '10px solid',
      overflow: 'scroll',
      boxSizing: 'content-box'
    });

    // Test that the width and height methods' edge argument can be a either a number
    // or a string and that the string/number values match each other correctly.

    a(assert, {
      description: 'width "edge" argument: "core" === 0',
      result: mezr.width(element, 0),
      equal: mezr.width(element, 'core')
    });

    a(assert, {
      description: 'height "edge" argument: "core" === 0',
      result: mezr.height(element, 0),
      equal: mezr.height(element, 'core')
    });

    a(assert, {
      description: 'width "edge" argument: "padding" === 1',
      result: mezr.width(element, 1),
      equal: mezr.width(element, 'padding')
    });

    a(assert, {
      description: 'height "edge" argument: "padding" === 1',
      result: mezr.height(element, 1),
      equal: mezr.height(element, 'padding')
    });

    a(assert, {
      description: 'width "edge" argument: "scroll" === 2',
      result: mezr.width(element, 'scroll'),
      equal: mezr.width(element, 2)
    });

    a(assert, {
      description: 'height "edge" argument: "scroll" === 2',
      result: mezr.height(element, 'scroll'),
      equal: mezr.height(element, 2)
    });

    a(assert, {
      description: 'width "edge" argument: "border" === 3',
      result: mezr.width(element, 'border'),
      equal: mezr.width(element, 3)
    });

    a(assert, {
      description: 'height "edge" argument: "border" === 3',
      result: mezr.height(element, 'border'),
      equal: mezr.height(element, 3)
    });

    a(assert, {
      description: 'width "edge" argument: "margin" === 4',
      result: mezr.width(element, 'margin'),
      equal: mezr.width(element, 4)
    });

    a(assert, {
      description: 'height "edge" argument: "margin" === 4',
      result: mezr.height(element, 'margin'),
      equal: mezr.height(element, 4)
    });

  });

  QUnit.test('element - fractional values', function (assert) {

    assert.expect(4);

    addStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    addStyles(element, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '100px',
      height: '100px',
      margin: '10px 10px -10px -10px',
      padding: '10px',
      border: '10px solid',
      overflow: 'hidden',
      boxSizing: 'content-box'
    });

    addStyles(elementInner, {
      position: 'absolute',
      display: 'block',
      left: '0px',
      right: '0px',
      top: '0px',
      bottom: '0px',
      overflow: 'hidden'
    });

    var
    assertData = {
      a: '100.4px',
      b: '100.5px',
      c: '100.6px',
      d: '77.7%'
    };

    forIn(assertData, function (val) {

      // Note that we need to add some number rounding because
      // IE gives sometimes a bit different results due to the
      // test method's slight inaccuracy.

      addStyles(element, {
        width: val,
        height: val
      });

      a(assert, {
        description: 'fractional values - ' + val,
        result: {
          width: mezr.width(element, 'padding').toFixed(4),
          height: mezr.height(element, 'padding').toFixed(4)
        },
        deepEqual: {
          width: elementInner.getBoundingClientRect().width.toFixed(4),
          height: elementInner.getBoundingClientRect().height.toFixed(4)
        }
      });

    });

  });

  QUnit.test('element - padding in percentages', function (assert) {

    assert.expect(2);

    addStyles(fixture, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '1000px',
      height: '1000px'
    });

    addStyles(element, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '100px',
      height: '100px',
      padding: '1.5%',
      border: '10px solid',
      overflow: 'scroll'
    });

    addStyles(element, {
      boxSizing: 'content-box'
    });

    a(assert, {
      description: '"margin" size - box-sizing = content-box',
      result: {
        width: mezr.width(element, 'margin'),
        height: mezr.height(element, 'margin')
      },
      deepEqual: {
        width: 150,
        height: 150
      }
    });

    addStyles(element, {
      boxSizing: 'border-box'
    });

    a(assert, {
      description: '"margin" size - box-sizing = border-box',
      result: {
        width: mezr.width(element, 'margin'),
        height: mezr.height(element, 'margin')
      },
      deepEqual: {
        width: 100,
        height: 100
      }
    });

  });

  QUnit.test('element - margin in percentages', function (assert) {

    assert.expect(2);

    addStyles(fixture, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '1000px',
      height: '1000px'
    });

    addStyles(element, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '100px',
      height: '100px',
      margin: '10%',
      border: '10px solid',
      overflow: 'scroll'
    });

    addStyles(element, {
      boxSizing: 'content-box'
    });

    a(assert, {
      description: '"margin" size - box-sizing = content-box',
      result: {
        width: mezr.width(element, 'margin'),
        height: mezr.height(element, 'margin')
      },
      deepEqual: {
        width: 320,
        height: 320
      }
    });

    addStyles(element, {
      boxSizing: 'border-box'
    });

    a(assert, {
      description: '"margin" size - box-sizing = border-box',
      result: {
        width: mezr.width(element, 'margin'),
        height: mezr.height(element, 'margin')
      },
      deepEqual: {
        width: 300,
        height: 300
      }
    });

  });

  QUnit.module('offset');

  QUnit.test('document', function (assert) {

    assert.expect(1);

    addStyles(fixture, {
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

    a(assert, {
      result: mezr.offset(document),
      deepEqual: {
        left: 0,
        top: 0
      }
    });

  });

  QUnit.test('window', function (assert) {

    assert.expect(1);

    addStyles(fixture, {
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

    a(assert, {
      result: mezr.offset(window),
      deepEqual: {
        left: 1000,
        top: 1000
      }
    });

  });

  QUnit.test('element', function (assert) {

    assert.expect(20);

    addStyles(fixture, {
      position: 'absolute',
      width: '10000px',
      height: '10000px',
      left: '10px',
      top: '10px',
      margin: '10px',
      border: '10px solid',
      padding: '10px'
    });

    addStyles(element, {
      position: 'absolute',
      width: '10px',
      height: '10px',
      left: '10px',
      top: '10px',
      margin: '10px',
      border: '10px solid',
      padding: '15px'
    });

    var
    elemValues = {
      'static': {
        'core': 75,
        'padding': 60,
        'scroll': 60,
        'border': 50,
        'margin': 40
      },
      'relative': {
        'core': 85,
        'padding': 70,
        'scroll': 70,
        'border': 60,
        'margin': 50
      },
      'absolute': {
        'core': 75,
        'padding': 60,
        'scroll': 60,
        'border': 50,
        'margin': 40
      },
      'fixed': {
        'core': 45,
        'padding': 30,
        'scroll': 30,
        'border': 20,
        'margin': 10
      }
    };

    forIn(elemValues, function (positionValues, positionName) {

      forIn(positionValues, function (edgeLayerValue, edgeLayerName) {

        addStyles(element, {
          position: positionName
        });

        window.scrollTo(0, 0);

        a(assert, {
          description: 'element - ' + positionName + ' - ' + edgeLayerName,
          result: mezr.offset(element, edgeLayerName),
          deepEqual: {
            left: edgeLayerValue,
            top: edgeLayerValue
          }
        });

      });

    });

  });

  QUnit.test('absolute element - scroll test', function (assert) {

    assert.expect(1);

    addStyles(fixture, {
      position: 'absolute',
      width: '10000px',
      height: '10000px',
      left: '0px',
      top: '0px'
    });

    addStyles(element, {
      position: 'absolute',
      right: '0px',
      bottom: '0px',
      width: '10px',
      height: '10px'
    });

    window.scrollTo(1000, 1000);

    a(assert, {
      result: mezr.offset(element),
      deepEqual: {
        left: 9990,
        top: 9990
      }
    });

  });

  QUnit.test('fixed element - scroll test', function (assert) {

    assert.expect(1);

    addStyles(fixture, {
      position: 'absolute',
      width: '10000px',
      height: '10000px',
      left: '1000px',
      top: '1000px'
    });

    addStyles(element, {
      position: 'fixed',
      left: '2000px',
      top: '2000px'
    });

    window.scrollTo(1000, 1000);

    a(assert, {
      result: mezr.offset(element),
      deepEqual: {
        left: 3000,
        top: 3000
      }
    });

  });

  QUnit.module('offsetParent');

  QUnit.test('default cases', function (assert) {

    assert.expect(16);

    addStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    addStyles(element, {
      position: 'absolute',
      width: '10px',
      height: '10px',
      left: '0px',
      top: '0px'
    });

    addStyles(document.body, {
      position: 'relative'
    });


    var positions = {
      a: 'static',
      b: 'relative',
      c: 'absolute',
      d: 'fixed'
    };

    forIn(positions, function (elementPosition) {

      addStyles(element, {
        position: elementPosition
      });

      forIn(positions, function (fixturePosition) {

        addStyles(fixture, {
          position: fixturePosition
        });

        a(assert, {
          description: elementPosition + ' element with ' + fixturePosition + ' parent',
          result: mezr.offsetParent(element),
          equal: elementPosition === 'fixed' ? window : fixturePosition === 'static' ? document.body : fixture
        });

      });

    });

  });

  QUnit.test('special cases', function (assert) {

    assert.expect(8);

    addStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    addStyles(element, {
      position: 'absolute',
      width: '10px',
      height: '10px',
      left: '0px',
      top: '0px'
    });

    a(assert, {
      description: 'document offsetParent -> null',
      result: mezr.offsetParent(document),
      equal: null
    });

    a(assert, {
      description: 'document offsetParent -> document',
      result: mezr.offsetParent(window),
      equal: document
    });

    a(assert, {
      description: 'document.documentElement offsetParent -> document',
      result: mezr.offsetParent(document.documentElement),
      equal: document
    });

    addStyles(document.documentElement, {
      position: 'static'
    });
    a(assert, {
      description: 'document.body offsetParent -> document (when documentElement is static)',
      result: mezr.offsetParent(document.body),
      equal: document
    });

    addStyles(document.documentElement, {
      position: 'relative'
    });
    a(assert, {
      description: 'document.body offsetParent -> document.documentElement (when documentElement is relative)',
      result: mezr.offsetParent(document.body),
      equal: document.documentElement
    });

    addStyles(document.documentElement, {
      position: 'absolute'
    });
    a(assert, {
      description: 'document.body offsetParent -> document.documentElement (when documentElement is absolute)',
      result: mezr.offsetParent(document.body),
      equal: document.documentElement
    });

    addStyles(document.documentElement, {
      position: 'fixed'
    });
    a(assert, {
      description: 'document.body offsetParent -> document.documentElement (when documentElement is fixed)',
      result: mezr.offsetParent(document.body),
      equal: document.documentElement
    });

    addStyles(document.documentElement, {
      position: 'static'
    });
    addStyles(document.body, {
      position: 'static'
    });
    addStyles(fixture, {
      position: 'static'
    });
    addStyles(element, {
      position: 'static'
    });
    addStyles(elementInner, {
      position: 'static'
    });
    a(assert, {
      description: 'deep nested element with only static positioned parents -> offsetParent should be document',
      result: mezr.offsetParent(elementInner),
      equal: document
    });

  });

  QUnit.module('intersection');

  // TODO: Elements and arrays

  QUnit.test('objects', function (assert) {

    assert.expect(4);

    var
    rectA = {width: 5, height: 5, left: 0, top: 0},
    rectB = {width: 5, height: 5, left: 4, top: 4},
    rectC = {width: 5, height: 5, left: 5, top: 5};

    a(assert, {
      description: 'has intersection - boolean',
      result: mezr.intersection(rectA, rectB),
      equal: true
    });

    a(assert, {
      description: 'has intersection - data',
      result: mezr.intersection(rectA, rectB, 1),
      deepEqual: {left: 4, top: 4, height: 1, width: 1}
    });

    a(assert, {
      description: 'no intersection - boolean',
      result: mezr.intersection(rectA, rectC),
      equal: false
    });

    a(assert, {
      description: 'no intersection - data',
      result: mezr.intersection(rectA, rectC, 1),
      equal: null
    });

  });

  QUnit.module('distance');

  // TODO: Elements and arrays

  QUnit.test('objects', function (assert) {

    assert.expect(8);

    function distanceFormula(a, b) {

      return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    }

    var
    rectA = {width: 5, height: 5, left: 10, top: 10},
    rectB = {width: 5, height: 5},
    setA = {
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
    },
    setB = {
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

    forIn(setA, function (pos, name) {

      rectB.left = pos.left;
      rectB.top = pos.top;

      a(assert, {
        description: name,
        result: mezr.distance(rectA, rectB),
        equal: distanceFormula(5, 5)
      });

    });

    forIn(setB, function (pos, name) {

      rectB.left = pos.left;
      rectB.top = pos.top;

      a(assert, {
        description: name,
        result: mezr.distance(rectA, rectB),
        equal: 5
      });

    });

  });


  QUnit.module('place');

  // TODO: Collision method tests, offset tests and more special case tests.

  QUnit.test('default cases', function (assert) {

    assert.expect(243);

    var
    cssPositions = {
      a: 'relative',
      b: 'absolute',
      c: 'fixed'
    },
    placePositions = {
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

    addStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    addStyles(element, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '10px',
      height: '10px'
    });

    addStyles(of, {
      position: 'absolute',
      left: '10px',
      top: '10px',
      width: '10px',
      height: '10px'
    });

    forIn(cssPositions, function (cssPosition) {

      forIn(placePositions, function (pos, posName) {

        var
        posNameSplit = posName.split(' '),
        my = posNameSplit[0] + ' ' + posNameSplit[1],
        at = posNameSplit[2] + ' ' + posNameSplit[3],
        result = mezr.place(element, {
          my: my,
          at: at,
          of: of
        });

        a(assert, {
          description: cssPosition + ' - my: ' + my + ' - at: ' + at,
          result: {
            left: result.left,
            top: result.top
          },
          deepEqual: {
            left: pos.left,
            top: pos.top
          }
        });


      });

    });

  });

QUnit.test('special cases', function (assert) {

    assert.expect(4);

    addStyles(fixture, {
      position: 'absolute',
      width: '100px',
      height: '100px',
      left: '0px',
      top: '0px'
    });

    addStyles(element, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '10px',
      height: '10px'
    });

    addStyles(of, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '10px',
      height: '10px'
    });

    // Case #1

    addStyles(element, {
      marginTop: '-10px',
      marginLeft: '-10px'
    });

    var result = mezr.place([element, 'margin'], {
      my: 'left top',
      at: 'left top',
      of: of
    });

    a(assert, {
      description: 'margin size - negative left/top margin on absolute element',
      result: {
        left: result.left,
        top: result.top
      },
      deepEqual: {
        left: 10,
        top: 10
      }
    });

    // Case #2

    addStyles(element, {
      marginTop: '10px',
      marginLeft: '10px'
    });

    var result = mezr.place([element, 'margin'], {
      my: 'left top',
      at: 'left top',
      of: of
    });

    a(assert, {
      description: 'margin size - positive left/top margin on absolute element',
      result: {
        left: result.left,
        top: result.top
      },
      deepEqual: {
        left: 0,
        top: 0
      }
    });

    // Case #3

    addStyles(element, {
      marginTop: '10px',
      marginLeft: '10px'
    });

    var result = mezr.place([element, 'border'], {
      my: 'left top',
      at: 'left top',
      of: of
    });

    a(assert, {
      description: 'border size - positive left/top margin on absolute element',
      result: {
        left: result.left,
        top: result.top
      },
      deepEqual: {
        left: -10,
        top: -10
      }
    });

    // Case #4

    addStyles(element, {
      position: 'relative',
      height: '100%',
      width: '100%',
      margin: '0 0 100% 0'
    });

    var result = mezr.place([element, 'margin'], {
      my: 'left bottom',
      at: 'left bottom',
      of: of
    });

    a(assert, {
      description: 'margin size - 100% bottom margin on relative element',
      result: {
        left: result.left,
        top: result.top
      },
      deepEqual: {
        left: 0,
        top: -190
      }
    });

  });

};