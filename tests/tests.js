window.onload = function() {

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
  fixtureStyle = document.createElement('style'),
  fixtureCSS = '',
  result,
  expected,
  desc;

  // Give test elements an id.
  fixture.id = 'test-fixture';
  element.id = 'test-element';
  elementInner.id = 'test-element-inner';
  of.id = 'test-of';

  // Nest test fixtures and append them to body.
  element.appendChild(elementInner);
  fixture.appendChild(element);
  fixture.appendChild(of);
  body.appendChild(fixture);

  // Create fixture CSS rules.
  fixtureCSS += 'body { margin: 0; }';
  fixtureCSS += '#test-fixture {position: absolute; left: 0px; top: 0px; width: 100px; height: 100px;}';
  fixtureCSS += '#test-element { position: absolute; width: 10px; height: 10px; }';
  fixtureCSS += '#test-of { position: absolute; left: 0px; top: 0px; width: 10px; height: 10px; margin: 10px 0 0 10px; }';

  // Append fixture stylesheet to head.
  fixtureStyle.type = 'text/css';
  if (fixtureStyle.styleSheet) {
    fixtureStyle.styleSheet.cssText = fixtureCSS;
  } else {
    fixtureStyle.appendChild(document.createTextNode(fixtureCSS));
  }
  head.appendChild(fixtureStyle);

  // Helper to wrap assertions in a more readable format.
  function assertion(assert, obj) {

    if (typeof obj.setup === 'function') {
      obj.setup();
    }
    forceRedraw(body);
    assert[obj.should](obj.result(), obj.expected(), obj.description);
    window.scrollTo(0, 0);

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

  function forceRedraw(element) {

    var disp = element.style.display;
    element.style.display = 'none';
    var trick = element.offsetHeight;
    element.style.display = disp;

  }

  QUnit.testStart(function () {

    // Reset element inline styles.
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('style');
    fixture.removeAttribute('style');
    element.removeAttribute('style');
    elementInner.removeAttribute('style');
    of.removeAttribute('style');

    // Scroll window to top.
    window.scrollTo(0, 0);

    // Reset result and expected.
    result = {};
    expected = {};

  });

  QUnit.module('width/height');

  QUnit.test('document', function (assert) {

    // TODO: Add tests for edgeLayer value normalization and default value check

    assert.expect(2);

    addStyles(element, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '10000px',
      height: '10000px',
      padding : '0px',
      border : '0px solid',
      margin: '0px',
      boxSizing : 'border-box'
    });

    assertion(assert, {
      description: 'size without viewport scrollbar',
      expected: function () {
        return {
          width: 10000,
          height: 10000
        }
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(document, 'core'),
          height: mezr.height(document, 'core')
        }
      }
    });

    assertion(assert, {
      description: 'size with viewport scrollbar',
      expected: function () {
        return {
          width: 10000 + window.innerWidth - document.documentElement.clientWidth,
          height: 10000 + window.innerHeight - document.documentElement.clientHeight
        }
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(document, 'scroll'),
          height: mezr.height(document, 'scroll')
        }
      }
    });

  });

  QUnit.test('window', function (assert) {

    // TODO: Add tests for edgeLayer value normalization and default value check

    assert.expect(2);

    addStyles(element, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '10000px',
      height: '10000px',
      padding : '0px',
      border : '0px solid',
      margin: '0px',
      boxSizing : 'border-box'
    });


    assertion(assert, {
      description: 'size without viewport scrollbar',
      expected: function () {
        return {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight
        }
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(window, 'core'),
          height: mezr.height(window, 'core')
        }
      }
    });

    assertion(assert, {
      description: 'size with viewport scrollbar',
      expected: function () {
        return {
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(window, 'scroll'),
          height: mezr.height(window, 'scroll')
        }
      }
    });

  });

  QUnit.test('element', function (assert) {

    assert.expect(35);

    addStyles(element, {
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
    })

    // Test that the width and height methods' edge argument can be a either a number
    // or a string and that the string/number values match each other correctly.

    assertion(assert, {
      description: 'width "edge" argument: "core" === 0',
      expected: function () {
        return mezr.width(element, 'core');
      },
      should: 'equal',
      result: function () {
        return mezr.width(element, 0);
      }
    });

    assertion(assert, {
      description: 'height "edge" argument: "core" === 0',
      expected: function () {
        return mezr.height(element, 'core');
      },
      should: 'equal',
      result: function () {
        return mezr.height(element, 0);
      }
    });

    assertion(assert, {
      description: 'width "edge" argument: "padding" === 1',
      expected: function () {
        return mezr.width(element, 'padding');
      },
      should: 'equal',
      result: function () {
        return mezr.width(element, 1);
      }
    });

    assertion(assert, {
      description: 'height "edge" argument: "padding" === 1',
      expected: function () {
        return mezr.height(element, 'padding');
      },
      should: 'equal',
      result: function () {
        return mezr.height(element, 1);
      }
    });

    assertion(assert, {
      description: 'width "edge" argument: "scroll" === 2',
      expected: function () {
        return mezr.width(element, 'scroll');
      },
      should: 'equal',
      result: function () {
        return mezr.width(element, 2);
      }
    });

    assertion(assert, {
      description: 'height "edge" argument: "scroll" === 2',
      expected: function () {
        return mezr.height(element, 'scroll');
      },
      should: 'equal',
      result: function () {
        return mezr.height(element, 2);
      }
    });

    assertion(assert, {
      description: 'width "edge" argument: "border" === 3',
      expected: function () {
        return mezr.width(element, 'border');
      },
      should: 'equal',
      result: function () {
        return mezr.width(element, 3);
      }
    });

    assertion(assert, {
      description: 'height "edge" argument: "border" === 3',
      expected: function () {
        return mezr.height(element, 'border');
      },
      should: 'equal',
      result: function () {
        return mezr.height(element, 3);
      }
    });

    assertion(assert, {
      description: 'width "edge" argument: "margin" === 4',
      expected: function () {
        return mezr.width(element, 'margin');
      },
      should: 'equal',
      result: function () {
        return mezr.width(element, 4);
      }
    });

    assertion(assert, {
      description: 'height "edge" argument: "margin" === 4',
      expected: function () {
        return mezr.height(element, 'margin');
      },
      should: 'equal',
      result: function () {
        return mezr.height(element, 4);
      }
    });

    // Default edge argument value should be "border".

    assertion(assert, {
      description: 'Default "edge" argument value should be "border"',
      setup: function () {
        addStyles(element, {
          overflow: 'scroll',
          boxSizing: 'content-box'
        });
      },
      expected: function () {
        return {
          width: mezr.width(element, 'border'),
          height: mezr.height(element, 'border')
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element),
          height: mezr.height(element)
        };
      }
    });

    // Core

    assertion(assert, {
      description: '"core" size with scrollbar: box-sizing = content-box, overflow = scroll',
      setup: function () {
        addStyles(element, {
          overflow: 'scroll',
          boxSizing: 'content-box'
        });
      },
      expected: function () {
        return {
          width: elementInner.getBoundingClientRect().width - 20,
          height: elementInner.getBoundingClientRect().height - 20
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'core'),
          height: mezr.height(element, 'core')
        };
      }
    });

    assertion(assert, {
      description: '"core" size with scrollbar: box-sizing = content-box, overflow = hidden',
      setup: function () {
        addStyles(element, {
          overflow: 'hidden',
          boxSizing: 'content-box'
        });
      },
      expected: function () {
        return {
          width: elementInner.getBoundingClientRect().width - 20,
          height: elementInner.getBoundingClientRect().height - 20
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'core'),
          height: mezr.height(element, 'core')
        };
      }
    });

    assertion(assert, {
      description: '"core" size with scrollbar: box-sizing = border-box, overflow = scroll',
      setup: function () {
        addStyles(element, {
          overflow: 'scroll',
          boxSizing: 'border-box'
        });
      },
      expected: function () {
        return {
          width: elementInner.getBoundingClientRect().width - 20,
          height: elementInner.getBoundingClientRect().height - 20
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'core'),
          height: mezr.height(element, 'core')
        };
      }
    });

    assertion(assert, {
      description: '"core" size with scrollbar: box-sizing = border-box, overflow = scroll',
      setup: function () {
        addStyles(element, {
          overflow: 'hidden',
          boxSizing: 'border-box'
        });
      },
      expected: function () {
        return {
          width: elementInner.getBoundingClientRect().width - 20,
          height: elementInner.getBoundingClientRect().height - 20
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'core'),
          height: mezr.height(element, 'core')
        };
      }
    });

    // Padding

    assertion(assert, {
      description: '"padding" size with scrollbar: box-sizing = content-box, overflow = scroll',
      setup: function () {
        addStyles(element, {
          overflow: 'scroll',
          boxSizing: 'content-box'
        });
      },
      expected: function () {
        return {
          width: elementInner.getBoundingClientRect().width,
          height: elementInner.getBoundingClientRect().height
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'padding'),
          height: mezr.height(element, 'padding')
        };
      }
    });

    assertion(assert, {
      description: '"padding" size with scrollbar: box-sizing = content-box, overflow = hidden',
      setup: function () {
        addStyles(element, {
          overflow: 'hidden',
          boxSizing: 'content-box'
        });
      },
      expected: function () {
        return {
          width: elementInner.getBoundingClientRect().width,
          height: elementInner.getBoundingClientRect().height
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'padding'),
          height: mezr.height(element, 'padding')
        };
      }
    });

    assertion(assert, {
      description: '"padding" size with scrollbar: box-sizing = border-box, overflow = scroll',
      setup: function () {
        addStyles(element, {
          overflow: 'scroll',
          boxSizing: 'border-box'
        });
      },
      expected: function () {
        return {
          width: elementInner.getBoundingClientRect().width,
          height: elementInner.getBoundingClientRect().height
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'padding'),
          height: mezr.height(element, 'padding')
        };
      }
    });

    assertion(assert, {
      description: '"padding" size with scrollbar: box-sizing = border-box, overflow = scroll',
      setup: function () {
        addStyles(element, {
          overflow: 'hidden',
          boxSizing: 'border-box'
        });
      },
      expected: function () {
        return {
          width: elementInner.getBoundingClientRect().width,
          height: elementInner.getBoundingClientRect().height
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'padding'),
          height: mezr.height(element, 'padding')
        };
      }
    });

    // Scroll

    assertion(assert, {
      description: '"scroll" size with scrollbar: box-sizing = content-box, overflow = scroll',
      setup: function () {
        addStyles(element, {
          overflow: 'scroll',
          boxSizing: 'content-box'
        });
      },
      expected: function () {
        return {
          width: 120,
          height: 120
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'scroll'),
          height: mezr.height(element, 'scroll')
        };
      }
    });

    assertion(assert, {
      description: '"scroll" size with scrollbar: box-sizing = content-box, overflow = hidden',
      setup: function () {
        addStyles(element, {
          overflow: 'hidden',
          boxSizing: 'content-box'
        });
      },
      expected: function () {
        return {
          width: 120,
          height: 120
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'scroll'),
          height: mezr.height(element, 'scroll')
        };
      }
    });

    assertion(assert, {
      description: '"scroll" size with scrollbar: box-sizing = border-box, overflow = scroll',
      setup: function () {
        addStyles(element, {
          overflow: 'scroll',
          boxSizing: 'border-box'
        });
      },
      expected: function () {
        return {
          width: 80,
          height: 80
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'scroll'),
          height: mezr.height(element, 'scroll')
        };
      }
    });

    assertion(assert, {
      description: '"scroll" size with scrollbar: box-sizing = border-box, overflow = scroll',
      setup: function () {
        addStyles(element, {
          overflow: 'hidden',
          boxSizing: 'border-box'
        });
      },
      expected: function () {
        return {
          width: 80,
          height: 80
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'scroll'),
          height: mezr.height(element, 'scroll')
        };
      }
    });

    // Border

    assertion(assert, {
      description: '"border" size with scrollbar: box-sizing = content-box, overflow = scroll',
      setup: function () {
        addStyles(element, {
          overflow: 'scroll',
          boxSizing: 'content-box'
        });
      },
      expected: function () {
        return {
          width: 140,
          height: 140
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'border'),
          height: mezr.height(element, 'border')
        };
      }
    });

    assertion(assert, {
      description: '"border" size with scrollbar: box-sizing = content-box, overflow = hidden',
      setup: function () {
        addStyles(element, {
          overflow: 'hidden',
          boxSizing: 'content-box'
        });
      },
      expected: function () {
        return {
          width: 140,
          height: 140
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'border'),
          height: mezr.height(element, 'border')
        };
      }
    });

    assertion(assert, {
      description: '"border" size with scrollbar: box-sizing = border-box, overflow = scroll',
      setup: function () {
        addStyles(element, {
          overflow: 'scroll',
          boxSizing: 'border-box'
        });
      },
      expected: function () {
        return {
          width: 100,
          height: 100
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'border'),
          height: mezr.height(element, 'border')
        };
      }
    });

    assertion(assert, {
      description: '"border" size with scrollbar: box-sizing = border-box, overflow = scroll',
      setup: function () {
        addStyles(element, {
          overflow: 'hidden',
          boxSizing: 'border-box'
        });
      },
      expected: function () {
        return {
          width: 100,
          height: 100
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'border'),
          height: mezr.height(element, 'border')
        };
      }
    });

    // Margin

    assertion(assert, {
      description: '"margin" size with scrollbar: box-sizing = content-box, overflow = scroll',
      setup: function () {
        addStyles(element, {
          overflow: 'scroll',
          boxSizing: 'content-box'
        });
      },
      expected: function () {
        return {
          width: 150,
          height: 150
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'margin'),
          height: mezr.height(element, 'margin')
        };
      }
    });

    assertion(assert, {
      description: '"margin" size with scrollbar: box-sizing = content-box, overflow = hidden',
      setup: function () {
        addStyles(element, {
          overflow: 'hidden',
          boxSizing: 'content-box'
        });
      },
      expected: function () {
        return {
          width: 150,
          height: 150
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'margin'),
          height: mezr.height(element, 'margin')
        };
      }
    });

    assertion(assert, {
      description: '"margin" size with scrollbar: box-sizing = border-box, overflow = scroll',
      setup: function () {
        addStyles(element, {
          overflow: 'scroll',
          boxSizing: 'border-box'
        });
      },
      expected: function () {
        return {
          width: 110,
          height: 110
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'margin'),
          height: mezr.height(element, 'margin')
        };
      }
    });

    assertion(assert, {
      description: '"margin" size with scrollbar: box-sizing = border-box, overflow = scroll',
      setup: function () {
        addStyles(element, {
          overflow: 'hidden',
          boxSizing: 'border-box'
        });
      },
      expected: function () {
        return {
          width: 110,
          height: 110
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'margin'),
          height: mezr.height(element, 'margin')
        };
      }
    });

    // Fractional values

    assertion(assert, {
      description: 'fractional values',
      setup: function () {
        addStyles(element, {
          overflow: 'scroll',
          boxSizing: 'content-box',
          width: '100.4px',
          height: '100.4px'
        });
      },
      expected: function () {
        return {
          width: elementInner.getBoundingClientRect().width,
          height: elementInner.getBoundingClientRect().height
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'padding'),
          height: mezr.height(element, 'padding')
        };
      }
    });

    assertion(assert, {
      description: 'fractional values',
      setup: function () {
        addStyles(element, {
          overflow: 'scroll',
          boxSizing: 'content-box',
          width: '100.5px',
          height: '100.5px'
        });
      },
      expected: function () {
        return {
          width: elementInner.getBoundingClientRect().width,
          height: elementInner.getBoundingClientRect().height
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'padding', false),
          height: mezr.height(element, 'padding', false)
        };
      }
    });

    assertion(assert, {
      description: 'fractional values',
      setup: function () {
        addStyles(element, {
          overflow: 'scroll',
          boxSizing: 'content-box',
          width: '100.6px',
          height: '100.6px'
        });
      },
      expected: function () {
        return {
          width: elementInner.getBoundingClientRect().width,
          height: elementInner.getBoundingClientRect().height
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'padding', false),
          height: mezr.height(element, 'padding', false)
        };
      }
    });

    assertion(assert, {
      description: 'fractional values',
      setup: function () {
        addStyles(element, {
          overflow: 'scroll',
          boxSizing: 'content-box',
          width: '77.7%',
          height: '77.7%'
        });
      },
      expected: function () {
        return {
          width: elementInner.getBoundingClientRect().width,
          height: elementInner.getBoundingClientRect().height
        };
      },
      should: 'deepEqual',
      result: function () {
        return {
          width: mezr.width(element, 'padding', false),
          height: mezr.height(element, 'padding', false)
        };
      }
    });

  });

  /*

  QUnit.test('element - padding in percentages', function (assert) {

    assert.expect(6);

    fixture.style.width = '1000px';
    fixture.style.height = '1000px';
    element.style.width = '100px';
    element.style.height = '100px';
    element.style.padding = '1%';
    element.style.margin = '0px';
    element.style.border = '10px solid';
    element.style.overflow = 'scroll';

    element.style.boxSizing = 'content-box';
    result.height = mezr.height(element, true, true, true, true);
    result.width = mezr.width(element, true, true, true, true);
    expected.height = 140;
    expected.width = 140;
    assert.strictEqual(result.width, expected.width, 'content-box');
    assert.strictEqual(result.height, expected.height, 'content-box');

    element.style.boxSizing = 'border-box';
    result.height = mezr.height(element, true, true, true, true);
    result.width = mezr.width(element, true, true, true, true);
    expected.height = 100;
    expected.width = 100;
    assert.deepEqual(result.height, expected.height, 'border-box');
    assert.deepEqual(result.width, expected.width, 'border-box');

    element.style.boxSizing = 'border-box';
    result.height = mezr.height(element, true);
    result.width = mezr.width(element, true);
    expected.height = 60;
    expected.width = 60;
    assert.deepEqual(result.height, expected.height, 'border-box');
    assert.deepEqual(result.width, expected.width, 'border-box');

  });

  QUnit.test('element - margin in percentages', function (assert) {

    assert.expect(6);

    fixture.style.width = '1000px';
    fixture.style.height = '1000px';
    element.style.width = '100px';
    element.style.height = '100px';
    element.style.padding = '0px';
    element.style.margin = '10%';
    element.style.border = '10px solid';
    element.style.overflow = 'scroll';

    element.style.boxSizing = 'content-box';
    result.height = mezr.height(element, true, true, true, true);
    result.width = mezr.width(element, true, true, true, true);
    expected.height = 320;
    expected.width = 320;
    assert.strictEqual(result.width, expected.width, 'content-box');
    assert.strictEqual(result.height, expected.height, 'content-box');

    element.style.boxSizing = 'border-box';
    result.height = mezr.height(element, true, true, true, true);
    result.width = mezr.width(element, true, true, true, true);
    expected.height = 300;
    expected.width = 300;
    assert.deepEqual(result.height, expected.height, 'border-box');
    assert.deepEqual(result.width, expected.width, 'border-box');

    element.style.boxSizing = 'border-box';
    result.height = mezr.height(element, true);
    result.width = mezr.width(element, true);
    expected.height = 80;
    expected.width = 80;
    assert.deepEqual(result.height, expected.height, 'border-box');
    assert.deepEqual(result.width, expected.width, 'border-box');

  });

  QUnit.module('offset');

  QUnit.test('default tests', function (assert) {

    assert.expect(19);

    fixture.style.position = 'absolute';
    fixture.style.width = '10000px';
    fixture.style.height = '10000px';
    fixture.style.left = '10px';
    fixture.style.top = '10px';
    fixture.style.margin = '10px';
    fixture.style.border = '10px solid';
    fixture.style.padding = '10px';
    element.style.width = '10px';
    element.style.height = '10px';
    element.style.left = '10px';
    element.style.top = '10px';
    element.style.margin = '10px';
    element.style.border = '10px solid';
    element.style.padding = '15px';

    // Document.

    window.scrollTo(1000, 1000);
    result = mezr.offset(document);
    expected.left = 0;
    expected.top = 0;
    assert.deepEqual(result, expected, 'document');

    // Window.

    window.scrollTo(1000, 1000);
    result = mezr.offset(window);
    expected.left = 1000;
    expected.top = 1000;
    assert.deepEqual(result.left, expected.left, 'window');
    assert.deepEqual(result.top, expected.top, 'window');

    // Element - Static positioning.

    window.scrollTo(0, 0);
    element.style.position = 'static';

    result = mezr.offset(element);
    expected.left = 50;
    expected.top = 50;
    assert.deepEqual(result, expected, element.style.position + ' positioning - default');

    result = mezr.offset(element, true);
    expected.left = 60;
    expected.top = 60;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include border');

    result = mezr.offset(element, false, true);
    expected.left = 65;
    expected.top = 65;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding');

    result = mezr.offset(element, true, true);
    expected.left = 75;
    expected.top = 75;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding and border');

    // Element - Relative positioning.

    window.scrollTo(0, 0);
    element.style.position = 'relative';

    result = mezr.offset(element);
    expected.left = 60;
    expected.top = 60;
    assert.deepEqual(result, expected, element.style.position + ' positioning - default');

    result = mezr.offset(element, true);
    expected.left = 70;
    expected.top = 70;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include border');

    result = mezr.offset(element, false, true);
    expected.left = 75;
    expected.top = 75;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding');

    result = mezr.offset(element, true, true);
    expected.left = 85;
    expected.top = 85;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding and border');

    // Element - Absolute positioning.

    window.scrollTo(0, 0);
    element.style.position = 'absolute';

    result = mezr.offset(element);
    expected.left = 50;
    expected.top = 50;
    assert.deepEqual(result, expected, element.style.position + ' positioning - default');

    result = mezr.offset(element, true);
    expected.left = 60;
    expected.top = 60;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include border');

    result = mezr.offset(element, false, true);
    expected.left = 65;
    expected.top = 65;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding');

    result = mezr.offset(element, true, true);
    expected.left = 75;
    expected.top = 75;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding and border');

    // Element - Fixed positioning.

    window.scrollTo(0, 0);
    element.style.position = 'fixed';

    result = mezr.offset(element);
    expected.left = 20;
    expected.top = 20;
    assert.deepEqual(result, expected, element.style.position + ' positioning - default');

    result = mezr.offset(element, true);
    expected.left = 30;
    expected.top = 30;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include border');

    result = mezr.offset(element, false, true);
    expected.left = 35;
    expected.top = 35;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding');

    result = mezr.offset(element, true, true);
    expected.left = 45;
    expected.top = 45;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding and border');

  });

  QUnit.test('element - scroll test - absolute positioning', function (assert) {

    assert.expect(1);

    fixture.style.position = 'absolute';
    fixture.style.width = '10000px';
    fixture.style.height = '10000px';
    fixture.style.left = '0px';
    fixture.style.top = '0px';
    fixture.style.margin = '0px';
    fixture.style.border = '0px solid';
    fixture.style.padding = '0px';
    element.style.position = 'absolute';
    element.style.left = '';
    element.style.top = '';
    element.style.right = '0px';
    element.style.bottom = '0px';
    element.style.margin = '0px';
    element.style.padding = '0px';
    element.style.border = '0px solid';
    window.scrollTo(1000, 1000);

    result = mezr.offset(element);
    expected.left = 9990;
    expected.top = 9990;
    assert.deepEqual(result, expected);

  });

  QUnit.test('element - scroll test - fixed positioning', function (assert) {

    assert.expect(1);

    fixture.style.position = 'absolute';
    fixture.style.width = '10000px';
    fixture.style.height = '10000px';
    fixture.style.left = '1000px';
    fixture.style.top = '1000px';
    fixture.style.margin = '0px';
    fixture.style.border = '0px solid';
    fixture.style.padding = '0px';
    element.style.position = 'fixed';
    element.style.left = '2000px';
    element.style.top = '2000px';
    element.style.margin = '0px';
    element.style.padding = '0px';
    element.style.border = '0px solid';
    window.scrollTo(1000, 1000);

    result = mezr.offset(element);
    expected.left = 3000;
    expected.top = 3000;
    assert.deepEqual(result, expected);

  });

  */

  QUnit.module('offsetParent');

  QUnit.test('tests', function (assert) {

    assert.expect(21);

    // Special cases.

    result = mezr.offsetParent(document);
    expected = null;
    assert.deepEqual(result, expected, 'document offsetParent -> null');

    result = mezr.offsetParent(window);
    expected = document;
    assert.deepEqual(result, expected, 'window offsetParent -> document');

    result = mezr.offsetParent(document.documentElement);
    expected = document;
    assert.deepEqual(result, expected, 'document.documentElement offsetParent -> document');

    document.documentElement.style.position = 'static';
    result = mezr.offsetParent(document.body);
    expected = document;
    assert.deepEqual(result, expected, 'document.body offsetParent -> document (when documentElement is static)');

    document.documentElement.style.position = 'relative';
    result = mezr.offsetParent(document.body);
    expected = document.documentElement;
    assert.deepEqual(result, expected, 'document.body offsetParent -> document.documentElement (when documentElement is relative)');

    document.documentElement.style.position = 'absolute';
    result = mezr.offsetParent(document.body);
    expected = document.documentElement;
    assert.deepEqual(result, expected, 'document.body offsetParent -> document.documentElement (when documentElement is absolute)');

    document.documentElement.style.position = 'fixed';
    result = mezr.offsetParent(document.body);
    expected = document.documentElement;
    assert.deepEqual(result, expected, 'document.body offsetParent -> document.documentElement (when documentElement is fixed)');

    document.documentElement.style.position = 'static';
    document.body.style.position = 'static';
    fixture.style.position = 'static';
    element.style.position = 'static';
    elementInner.style.position = 'static';
    result = mezr.offsetParent(elementInner);
    expected = document;
    assert.deepEqual(result, expected, 'deep nested element with only static positioned parents -> offsetParent should be document');

    // Fixed positioned element.

    fixture.style.position = 'fixed';
    element.style.position = 'fixed';
    result = mezr.offsetParent(element);
    expected = window;
    assert.deepEqual(result, expected, 'fixed element offsetParent -> window (even if the element is a child of another fixed element)');

    // Static positioned element.

    document.body.style.position = 'relative';
    element.style.position = 'static';

    fixture.style.position = 'relative';
    result = mezr.offsetParent(element);
    expected = fixture;
    assert.deepEqual(result, expected, 'static element with relative parent');

    fixture.style.position = 'absolute';
    result = mezr.offsetParent(element);
    expected = fixture;
    assert.deepEqual(result, expected, 'static element with absolute parent');

    fixture.style.position = 'fixed';
    result = mezr.offsetParent(element);
    expected = fixture;
    assert.deepEqual(result, expected, 'static element with fixed parent');

    fixture.style.position = 'static';
    result = mezr.offsetParent(element);
    expected = document.body;
    assert.deepEqual(result, expected, 'static element with static parent');

    // Relative positioned element.

    document.body.style.position = 'relative';
    element.style.position = 'relative';

    fixture.style.position = 'relative';
    result = mezr.offsetParent(element);
    expected = fixture;
    assert.deepEqual(result, expected, 'relative element with relative parent');

    fixture.style.position = 'absolute';
    result = mezr.offsetParent(element);
    expected = fixture;
    assert.deepEqual(result, expected, 'relative element with absolute parent');

    fixture.style.position = 'fixed';
    result = mezr.offsetParent(element);
    expected = fixture;
    assert.deepEqual(result, expected, 'relative element with fixed parent');

    fixture.style.position = 'static';
    result = mezr.offsetParent(element);
    expected = document.body;
    assert.deepEqual(result, expected, 'relative element with static parent');

    // Absolute positioned element.

    document.body.style.position = 'relative';
    element.style.position = 'absolute';

    fixture.style.position = 'relative';
    result = mezr.offsetParent(element);
    expected = fixture;
    assert.deepEqual(result, expected, 'absolute element with relative parent');

    fixture.style.position = 'absolute';
    result = mezr.offsetParent(element);
    expected = fixture;
    assert.deepEqual(result, expected, 'absolute element with absolute parent');

    fixture.style.position = 'fixed';
    result = mezr.offsetParent(element);
    expected = fixture;
    assert.deepEqual(result, expected, 'absolute element with fixed parent');

    fixture.style.position = 'static';
    result = mezr.offsetParent(element);
    expected = document.body;
    assert.deepEqual(result, expected, 'absolute element with static parent');

  });

  QUnit.module('intersection');

  QUnit.test('tests', function (assert) {

    assert.expect(4);

    var
    a = {width: 5, height: 5, left: 0, top: 0},
    b = {width: 5, height: 5, left: 4, top: 4};

    result = mezr.intersection(a, b);
    expected = true;
    assert.equal(result, expected, 'has intersection - boolean');

    result = mezr.intersection(a, b, 1);
    expected = {left: 4, top: 4, height: 1, width: 1};
    assert.deepEqual(result, expected, 'has intersection - data');

    a = {width: 5, height: 5, left: 0, top: 0};
    b = {width: 5, height: 5, left: 5, top: 5};

    result = mezr.intersection(a, b);
    expected = false;
    assert.equal(result, expected, 'no intersection - boolean');

    result = mezr.intersection(a, b, 1);
    expected = null;
    assert.equal(result, expected, 'no intersection - data');

  });

  QUnit.module('distance');

  QUnit.test('tests', function (assert) {

    assert.expect(8);

    function distanceFormula(a, b) {

      return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    }

    var
    a = {width: 5, height: 5, left: 10, top: 10},
    b = {width: 5, height: 5};

    b.left = 20;
    b.top = 0;
    result = mezr.distance(a, b);
    expected = distanceFormula(5, 5);
    assert.equal(result, expected, 'right top corner');

    b.left = 20;
    b.top = 20;
    result = mezr.distance(a, b);
    expected = distanceFormula(5, 5);
    assert.equal(result, expected, 'right bottom corner');

    b.left = 0;
    b.top = 20;
    result = mezr.distance(a, b);
    expected = distanceFormula(5, 5);
    assert.equal(result, expected, 'left bottom corner');

    b.left = 0;
    b.top = 0;
    result = mezr.distance(a, b);
    expected = distanceFormula(5, 5);
    assert.equal(result, expected, 'left top corner');

    b.left = 10;
    b.top = 0;
    result = mezr.distance(a, b);
    expected = 5;
    assert.equal(result, expected, 'top edge');

    b.left = 10;
    b.top = 20;
    result = mezr.distance(a, b);
    expected = 5;
    assert.equal(result, expected, 'bottom edge');

    b.left = 0;
    b.top = 10;
    result = mezr.distance(a, b);
    expected = 5;
    assert.equal(result, expected, 'left edge');

    b.left = 20;
    b.top = 10;
    result = mezr.distance(a, b);
    expected = 5;
    assert.equal(result, expected, 'right edge');

  });

  QUnit.module('place');

  QUnit.test('tests', function (assert) {

    assert.expect(1458);

    var
    cssPositions = ['absolute', 'relative', 'fixed'],
    cssPosition,
    // Define all positions of place method and their expected result.
    placePositions = [
      {name: 'left top left top', expected: {left: 10, top: 10}},
      {name: 'center top left top', expected: {left: 5, top: 10}},
      {name: 'right top left top', expected: {left: 0, top: 10}},
      {name: 'left center left top', expected: {left: 10, top: 5}},
      {name: 'center center left top', expected: {left: 5, top: 5}},
      {name: 'right center left top', expected: {left: 0, top: 5}},
      {name: 'left bottom left top', expected: {left: 10, top: 0}},
      {name: 'center bottom left top', expected: {left: 5, top: 0}},
      {name: 'right bottom left top', expected: {left: 0, top: 0}},
      {name: 'left top center top', expected: {left: 15, top: 10}},
      {name: 'center top center top', expected: {left: 10, top: 10}},
      {name: 'right top center top', expected: {left: 5, top: 10}},
      {name: 'left center center top', expected: {left: 15, top: 5}},
      {name: 'center center center top', expected: {left: 10, top: 5}},
      {name: 'right center center top', expected: {left: 5, top: 5}},
      {name: 'left bottom center top', expected: {left: 15, top: 0}},
      {name: 'center bottom center top', expected: {left: 10, top: 0}},
      {name: 'right bottom center top', expected: {left: 5, top: 0}},
      {name: 'left top right top', expected: {left: 20, top: 10}},
      {name: 'center top right top', expected: {left: 15, top: 10}},
      {name: 'right top right top', expected: {left: 10, top: 10}},
      {name: 'left center right top', expected: {left: 20, top: 5}},
      {name: 'center center right top', expected: {left: 15, top: 5}},
      {name: 'right center right top', expected: {left: 10, top: 5}},
      {name: 'left bottom right top', expected: {left: 20, top: 0}},
      {name: 'center bottom right top', expected: {left: 15, top: 0}},
      {name: 'right bottom right top', expected: {left: 10, top: 0}},
      {name: 'left top left center', expected: {left: 10, top: 15}},
      {name: 'center top left center', expected: {left: 5, top: 15}},
      {name: 'right top left center', expected: {left: 0, top: 15}},
      {name: 'left center left center', expected: {left: 10, top: 10}},
      {name: 'center center left center', expected: {left: 5, top: 10}},
      {name: 'right center left center', expected: {left: 0, top: 10}},
      {name: 'left bottom left center', expected: {left: 10, top: 5}},
      {name: 'center bottom left center', expected: {left: 5, top: 5}},
      {name: 'right bottom left center', expected: {left: 0, top: 5}},
      {name: 'left top center center', expected: {left: 15, top: 15}},
      {name: 'center top center center', expected: {left: 10, top: 15}},
      {name: 'right top center center', expected: {left: 5, top: 15}},
      {name: 'left center center center', expected: {left: 15, top: 10}},
      {name: 'center center center center', expected: {left: 10, top: 10}},
      {name: 'right center center center', expected: {left: 5, top: 10}},
      {name: 'left bottom center center', expected: {left: 15, top: 5}},
      {name: 'center bottom center center', expected: {left: 10, top: 5}},
      {name: 'right bottom center center', expected: {left: 5, top: 5}},
      {name: 'left top right center', expected: {left: 20, top: 15}},
      {name: 'center top right center', expected: {left: 15, top: 15}},
      {name: 'right top right center', expected: {left: 10, top: 15}},
      {name: 'left center right center', expected: {left: 20, top: 10}},
      {name: 'center center right center', expected: {left: 15, top: 10}},
      {name: 'right center right center', expected: {left: 10, top: 10}},
      {name: 'left bottom right center', expected: {left: 20, top: 5}},
      {name: 'center bottom right center', expected: {left: 15, top: 5}},
      {name: 'right bottom right center', expected: {left: 10, top: 5}},
      {name: 'left top left bottom', expected: {left: 10, top: 20}},
      {name: 'center top left bottom', expected: {left: 5, top: 20}},
      {name: 'right top left bottom', expected: {left: 0, top: 20}},
      {name: 'left center left bottom', expected: {left: 10, top: 15}},
      {name: 'center center left bottom', expected: {left: 5, top: 15}},
      {name: 'right center left bottom', expected: {left: 0, top: 15}},
      {name: 'left bottom left bottom', expected: {left: 10, top: 10}},
      {name: 'center bottom left bottom', expected: {left: 5, top: 10}},
      {name: 'right bottom left bottom', expected: {left: 0, top: 10}},
      {name: 'left top center bottom', expected: {left: 15, top: 20}},
      {name: 'center top center bottom', expected: {left: 10, top: 20}},
      {name: 'right top center bottom', expected: {left: 5, top: 20}},
      {name: 'left center center bottom', expected: {left: 15, top: 15}},
      {name: 'center center center bottom', expected: {left: 10, top: 15}},
      {name: 'right center center bottom', expected: {left: 5, top: 15}},
      {name: 'left bottom center bottom', expected: {left: 15, top: 10}},
      {name: 'center bottom center bottom', expected: {left: 10, top: 10}},
      {name: 'right bottom center bottom', expected: {left: 5, top: 10}},
      {name: 'left top right bottom', expected: {left: 20, top: 20}},
      {name: 'center top right bottom', expected: {left: 15, top: 20}},
      {name: 'right top right bottom', expected: {left: 10, top: 20}},
      {name: 'left center right bottom', expected: {left: 20, top: 15}},
      {name: 'center center right bottom', expected: {left: 15, top: 15}},
      {name: 'right center right bottom', expected: {left: 10, top: 15}},
      {name: 'left bottom right bottom', expected: {left: 20, top: 10}},
      {name: 'center bottom right bottom', expected: {left: 15, top: 10}},
      {name: 'right bottom right bottom', expected: {left: 10, top: 10}}
    ];

    fixture.style.position = 'absolute';
    fixture.style.left = '0px';
    fixture.style.top = '0px';
    fixture.style.width = '100px';
    fixture.style.height = '100px';

    element.style.position = 'absolute';
    element.style.width = '6px';
    element.style.height = '6px';
    element.style.padding = '1px';
    element.style.border = '1px solid #000';
    element.style.marginLeft = '10x';
    element.style.marginTop = '-10x';

    of.style.position = 'absolute';
    of.style.left = '0px';
    of.style.top = '0px';
    of.style.width = '10px';
    of.style.height = '10px';
    of.style.marginTop = '10px';
    of.style.marginLeft = '10px';

    for (var i = 0; i < cssPositions.length; i++) {

      cssPosition = cssPositions[i];
      element.style.position = cssPosition;

      for (var ii = 0; ii < placePositions.length; ii++) {

        var
        val = placePositions[ii],
        valPos = val.name.split(' '),
        my = valPos[0] + ' ' + valPos[1],
        at = valPos[2] + ' ' + valPos[3];

        expected = val.expected;
        desc = cssPosition + ' - my: ' + my + ' - at: ' + at;

        result = mezr.place(element, {
          my: my,
          at: at,
          of: of
        });
        assert.deepEqual(result.left, expected.left, 'default (left) - ' + desc);
        assert.deepEqual(result.top, expected.top, 'default (top) - ' + desc);

        result = mezr.place(element, {
          my: my,
          at: at,
          of: of,
          offsetX: 100,
          offsetY: 100
        });
        assert.strictEqual(result.left, expected.left + 100, 'positive offset (left) - ' + desc);
        assert.strictEqual(result.top, expected.top + 100, 'positive offset (top) - ' + desc);

        result = mezr.place(element, {
          my: my,
          at: at,
          of: of,
          offsetX: -100,
          offsetY: -100
        });
        assert.strictEqual(result.left, expected.left - 100, 'negative offset (left) - ' + desc);
        assert.strictEqual(result.top, expected.top - 100, 'negative offset (top) - ' + desc);

      }

    }

  });

};