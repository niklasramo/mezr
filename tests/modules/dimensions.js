TestSuite.modules.push(function () {

  QUnit.module('dimensions');

  var inst = this;
  var docElem = document.documentElement;
  var body = document.body;
  var fixture = this.fixture;
  var element = this.element;
  var elementInner = this.elementInner;
  var anchor = this.anchor;
  var container = this.container;

  QUnit.test('Should return the document\'s width and height.', function (assert) {

    assert.expect(12);

    inst.setStyles(fixture, {
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

  QUnit.test('Should return the window\'s width and height.', function (assert) {

    assert.expect(12);

    inst.setStyles(docElem, {
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

  QUnit.test('Should return the element\'s width and height.', function (assert) {

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
    inst.setStyles(element, {
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
    inst.setStyles(elementInner, {
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
      var ret;

      if (edgeLayer === 'content') {
        ret = innerGBCR[dimension] - padding[sideA] - padding[sideB];
      }
      else if (edgeLayer === 'padding') {
        ret = innerGBCR[dimension];
      }
      else if (edgeLayer === 'scroll') {
        ret = elemGBCR[dimension] - border[sideA] - border[sideB];
      }
      else if (edgeLayer === 'border') {
        ret = elemGBCR[dimension];
      }
      else if (edgeLayer === 'margin') {
        var marginA = margin[sideA] < 0 ? 0 : margin[sideA];
        var marginB = margin[sideB] < 0 ? 0 : margin[sideB];
        ret = elemGBCR[dimension] + marginA + marginB;
      }

      return ret > 0 ? ret : 0;

    }

    // Run all height and width tests.
    function runTests(message) {

      ['', 'content', 'padding', 'scroll', 'border', 'margin'].forEach(function (edgeLayer) {
        assert.strictEqual(mezr.width(element, edgeLayer), getDimension('width', edgeLayer), 'width - "' + edgeLayer + '" - ' + message);
        assert.strictEqual(mezr.height(element, edgeLayer), getDimension('height', edgeLayer), 'height - "' + edgeLayer + '" - ' + message);
      });

    }

    // Content box - No scrollbar
    inst.setStyles(element, {
      overflow: 'visible',
      mozBoxSizing: 'content-box',
      webkitBoxSizing: 'content-box',
      boxSizing: 'content-box'
    });
    runTests('content-box - without scrollbar');

    // Border box - No scrollbar
    inst.setStyles(element, {
      overflow: 'visible',
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      boxSizing: 'border-box'
    });
    runTests('border-box - without scrollbar');

    // Content box - Scrollbar
    inst.setStyles(element, {
      overflow: 'scroll',
      mozBoxSizing: 'content-box',
      webkitBoxSizing: 'content-box',
      boxSizing: 'content-box'
    });
    runTests('content-box - with scrollbar');

    // Content box - Scrollbar
    inst.setStyles(element, {
      overflow: 'scroll',
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      boxSizing: 'border-box'
    });
    runTests('border-box - with scrollbar');

  });

  QUnit.test('Should return the element\'s width and height correctly if the padding is defined in percentages.', function (assert) {

    assert.expect(4);

    inst.setStyles(fixture, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '1000px',
      height: '1000px'
    });

    inst.setStyles(element, {
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

    inst.setStyles(element, {
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      boxSizing: 'border-box'
    });

    assert.strictEqual(mezr.width(element, 'margin'), 100, 'width - "margin" - border-box');
    assert.strictEqual(mezr.height(element, 'margin'), 100, 'height - "margin" - border-box');

  });

  QUnit.test('Should return the element\'s width and height correctly if the margin is defined in percentages.', function (assert) {

    assert.expect(4);

    inst.setStyles(fixture, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '1000px',
      height: '1000px'
    });

    inst.setStyles(element, {
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

    inst.setStyles(element, {
      mozBoxSizing: 'border-box',
      webkitBoxSizing: 'border-box',
      boxSizing: 'border-box'
    });

    assert.strictEqual(mezr.width(element, 'margin'), 300, 'width - "margin" - border-box');
    assert.strictEqual(mezr.height(element, 'margin'), 300, 'height - "margin" - border-box');

  });

  QUnit.test('Should return the element\'s width and height correctly no matter what the display value is.', function (assert) {

    var edgeLayers = ['content', 'padding', 'scroll', 'border', 'margin'];
    var displayValues = [
      'inline',
      'inline-block',
      'list-item',
      'table',
      'inline-table',
      'table',
      'table-cell',
      'table-column',
      'table-column-group',
      'table-header-group',
      'table-row-group',
      'table-footer-group',
      'table-row',
      'table-caption'
    ];

    assert.expect(edgeLayers.length * displayValues.length * 2);

    inst.setStyles(fixture, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '10px',
      height: '10px'
    });

    displayValues.forEach(function (displayValue) {

      inst.setStyles(fixture, {
        display: displayValue
      });

      edgeLayers.forEach(function (edgeLayer) {
        assert.strictEqual(mezr.width(fixture, edgeLayer), 10, 'width - ' + displayValue + ' - ' + edgeLayer);
        assert.strictEqual(mezr.height(fixture, edgeLayer), 10, 'height - ' + displayValue + ' - ' + edgeLayer);
      });

    });

  });

});