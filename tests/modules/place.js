TestSuite.modules.push(function () {

  QUnit.module('place');

  // TODO:
  // - Test that positions work as advertised (a light weight version of the monster test).
  // - Test that contain does not do anything if within is not set or onCollision is not set.
  // - Test that contain.within accepts an element, window, document or an object.
  // - Test that containment pushing and force pushing work as advertised.

  var inst = this;
  var docElem = document.documentElement;
  var body = document.body;
  var fixture = this.fixture;
  var element = this.element;
  var elementInner = this.elementInner;
  var anchor = this.anchor;
  var container = this.container;

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

  QUnit.test('#critical: Element option should accept an element, document or window.', function (assert) {

    assert.expect(6);

    inst.setStyles(fixture, {
      position: 'absolute',
      width: '10000px',
      height: '10000px',
      left: '0px',
      top: '0px'
    });

    inst.setStyles(element, {
      position: 'absolute',
      width: '10px',
      height: '10px',
      padding: '10px',
      left: '0px',
      top: '0px'
    });

    // Element.
    assert.deepEqual(
      mezr.place({
        element: element,
        target: fixture,
        position: 'left top right bottom'
      }),
      {
        left: 10000,
        top: 10000
      },
      'Element'
    );

    // Element (array syntax).
    assert.deepEqual(
      mezr.place({
        element: [element, 'content'],
        target: fixture,
        position: 'left top right bottom'
      }),
      {
        left: 10000 - 10,
        top: 10000 - 10
      },
      'Element (array syntax)'
    );

    // Window.
    assert.deepEqual(
      mezr.place({
        element: window,
        target: fixture,
        position: 'left top right bottom'
      }),
      {
        left: 10000,
        top: 10000
      },
      'Window'
    );

    // Window (array syntax).
    assert.deepEqual(
      mezr.place({
        element: [window, 'content'],
        target: fixture,
        position: 'left top right bottom'
      }),
      {
        left: 10000,
        top: 10000
      },
      'Window (array syntax)'
    );

    // Document.
    assert.deepEqual(
      mezr.place({
        element: document,
        target: fixture,
        position: 'left top right bottom'
      }),
      {
        left: 10000,
        top: 10000
      },
      'Document'
    );

    // Document (array syntax).
    assert.deepEqual(
      mezr.place({
        element: [document, 'content'],
        target: fixture,
        position: 'left top right bottom'
      }),
      {
        left: 10000,
        top: 10000
      },
      'Document (array syntax)'
    );

  });

  QUnit.test('#critical: Target option should accept an element, document, window or an object.', function (assert) {

    assert.expect(7);

    inst.setStyles(fixture, {
      position: 'absolute',
      width: '10000px',
      height: '10000px',
      padding: '10px',
      left: '0px',
      top: '0px'
    });

    inst.setStyles(element, {
      position: 'absolute',
      width: '10px',
      height: '10px',
      left: '0px',
      top: '0px'
    });

    // Element.
    assert.deepEqual(
      mezr.place({
        element: element,
        target: fixture,
        position: 'left top right bottom'
      }),
      {
        left: mezr.width(fixture),
        top: mezr.height(fixture)
      },
      'Element'
    );

    // Element (array syntax).
    assert.deepEqual(
      mezr.place({
        element: element,
        target: [fixture, 'content'],
        position: 'left top right bottom'
      }),
      {
        left: mezr.width(fixture, 'content') + 10,
        top: mezr.height(fixture, 'content') + 10
      },
      'Element (array syntax)'
    );

    // Window.
    assert.deepEqual(
      mezr.place({
        element: element,
        target: window,
        position: 'left top right bottom'
      }),
      {
        left: mezr.width(window),
        top: mezr.height(window)
      },
      'Window'
    );

    // Window (array syntax).
    assert.deepEqual(
      mezr.place({
        element: element,
        target: [window, 'content'],
        position: 'left top right bottom'
      }),
      {
        left: mezr.width(window, 'content'),
        top: mezr.height(window, 'content')
      },
      'Window (array syntax)'
    );

    // Document.
    assert.deepEqual(
      mezr.place({
        element: element,
        target: document,
        position: 'left top right bottom'
      }),
      {
        left: mezr.width(document),
        top: mezr.height(document)
      },
      'Document'
    );

    // Document (array syntax).
    assert.deepEqual(
      mezr.place({
        element: element,
        target: [document, 'content'],
        position: 'left top right bottom'
      }),
      {
        left: mezr.width(document, 'content'),
        top: mezr.height(document, 'content')
      },
      'Document (array syntax)'
    );

    // Object.
    assert.deepEqual(
      mezr.place({
        element: element,
        target: {
          left: 0,
          top: 0,
          width: 10,
          height: 10
        },
        position: 'left top right bottom'
      }),
      {
        left: 10,
        top: 10
      },
      'Object'
    );

  });

  QUnit.test('#critical: Negative or positive "offset" option values should affect the positioning.', function (assert) {

    assert.expect(4);

    inst.setStyles(fixture, {
      position: 'absolute',
      width: '10000px',
      height: '10000px',
      left: '0px',
      top: '0px'
    });

    inst.setStyles(element, {
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

    inst.setStyles(fixture, {
      position: 'absolute',
      width: '300px',
      height: '300px',
      left: '0px',
      top: '0px',
      overflow: 'hidden'
    });

    inst.setStyles(element, {
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

    inst.setStyles(anchor, {
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
      inst.setStyles(element, {position: elementCssPosition});
      inst.setStyles(anchor, {position: anchorCssPosition});

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

});