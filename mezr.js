/*!
 * mezr v1.0.0-alpha
 * https://github.com/niklasramo/mezr
 * Copyright (c) 2016 Niklas Rämö <inramo@gmail.com>
 * Released under the MIT license
 */

/*

Ideas
*****
- .scrollbarWidth( el )
- .scrollbarHeight( el )
- .w3cTelcs()
- .scrollParent( el ) and/or .scrollParents( el )

Todo for v1.0.0-beta
********************
- [ ] Finalize API.
- [ ] Better docs.
- [ ] Auto-generate docs.
- [ ] Updated unit tests.
- [ ] Contribution guidelines and process.
- [ ] Bug report guidelines and process.

*/

(function (global, factory) {

  if (typeof define === 'function' && define.amd) {

    define('mezr', [], function () {

      return factory(global);

    });

  }
  else if (typeof module === 'object' && module.exports) {

    module.exports = global.document ?
      factory(global) :
      function (win) {

        if (!win.document) {
          throw new Error('Mezr requires a window with a document');
        }

        return factory(win);

      };

  }
  else {

    global.mezr = factory(global);

  }

}(typeof window === 'object' && window.window || this, function (win, undefined) {

  'use strict';

  // Cache window document and root element.
  var doc = win.document;
  var root = doc.documentElement;

  // Cache some often used native functions.
  var ABS = Math.abs;
  var MAX = Math.max;
  var MIN = Math.min;

  // String to number mappings for element edges.
  var edges = {
    content: 1,
    padding: 2,
    scroll: 3,
    border: 4,
    margin: 5
  };

  // Place method's option names.
  var placeOptionsNames = ['my', 'at', 'of', 'within', 'collision', 'offsetX', 'offsetY'];

  // Define default options for place method.
  var placeDefaultOptions = {
    my: 'left top',
    at: 'left top',
    of: win,
    offsetX: 0,
    offsetY: 0,
    within: null,
    collision: {
      left: 'push',
      right: 'push',
      top: 'push',
      bottom: 'push'
    }
  };

  // Get the primary supported transform property.
  var supportedTransform = getSupportedTransform();

  // Does the browser support transformed element's local coordinate system as per W3C spec. This is
  // checked in the init section (in the bottom of this file).
  var supportsW3CTELCS = false;

  /**
   * Public methods
   * **************
   */

  /**
   * Returns the width of an element in pixels. Accepts also the window object (for getting the
   * viewport width) and the document object (for getting the document width) in place of element.
   *
   * @public
   * @param {Document|Element|Window} el
   * @param {Edge} [edge='border']
   * @returns {Number}
   *  - The return value may be fractional when calculating the width of an element. For window and
   *    document objects the value is always an integer though.
   */
  function getWidth(el, edge) {

    edge = edge && edges[edge] || 4;

    return getDimension('width', el, edge > 1, edge > 2, edge > 3, edge > 4);

  }

  /**
   * Returns the height of an element in pixels. Accepts also the window object (for getting the
   * viewport height) and the document object (for getting the document height) in place of element.
   *
   * @public
   * @param {Document|Element|Window} el
   * @param {Edge} [edge='border']
   * @returns {Number}
   *  - The return value may be fractional when calculating the width of an element. For window and
   *    document objects the value is always an integer though.
   */
  function getHeight(el, edge) {

    edge = edge && edges[edge] || 4;

    return getDimension('height', el, edge > 1, edge > 2, edge > 3, edge > 4);

  }

  /**
   * Returns the element's offset, which in practice means the vertical and horizontal distance
   * between the element's northwest corner and the document's northwest corner.
   *
   * @public
   * @param {Document|Element|Window} el
   * @param {Edge} [edge='border']
   * @returns {Offset}
   */
  function getOffset(el, edge) {

    if (el === doc) {

      return {
        left: 0,
        top: 0
      };

    }

    // Get viewport scroll left/top.
    var viewportScrollLeft = win.pageXOffset || 0;
    var viewportScrollTop = win.pageYOffset || 0;

    // For window we just need to get viewport's scroll distance.
    if (el.self === win.self) {

      return {
        left: viewportScrollLeft,
        top: viewportScrollLeft
      };

    }

    // Sanitize edge.
    edge = edge && edges[edge] || 4;

    var gbcr = el.getBoundingClientRect();
    var offsetLeft = gbcr.left + viewportScrollLeft;
    var offsetTop = gbcr.top + viewportScrollTop;

    // Exclude element's positive margin size from the offset.
    if (edge === 5) {

      var marginLeft = toFloat(getStyle(el, 'margin-left'));
      var marginTop = toFloat(getStyle(el, 'margin-top'));

      offsetLeft -=  marginLeft > 0 ? marginLeft : 0;
      offsetTop -= marginTop > 0 ? marginTop : 0;

    }

    // Include element's border size to the offset.
    if (edge < 4) {

      offsetLeft += toFloat(getStyle(el, 'border-left-width'));
      offsetTop += toFloat(getStyle(el, 'border-top-width'));

    }

    // Include element's padding size to the offset.
    if (edge === 1) {

      offsetLeft += toFloat(getStyle(el, 'padding-left'));
      offsetTop += toFloat(getStyle(el, 'padding-top'));

    }

    return {
      left: offsetLeft,
      top: offsetTop
    };

  }

  /**
   * Returns an object containing the provided element's dimensions and offsets. This is basically a
   * helper method for calculating an element's dimensions and offsets simultaneously. Mimics the
   * native getBoundingClientRect method with the added bonus of allowing to provide the "edge" of
   * the element.
   *
   * @public
   * @param {Document|Element|Window} el
   * @param {Edge} [edge='border']
   * @returns {Rectangle}
   */
  function getRect(el, edge) {

    // Sanitize edge.
    edge = edge || 'border';

    var rect = getOffset(el, edge);

    rect.width = getWidth(el, edge);
    rect.height = getHeight(el, edge);
    rect.bottom = rect.top + rect.height;
    rect.right = rect.left + rect.width;

    return rect;

  }

  /**
   * Returns the element's offset parent. This function works in the same manner as the native
   * elem.offsetParent method with a few tweaks and logic changes. Additionally this function
   * recognizes transformed elements and is aware of their local coordinate system. The function
   * accepts the window object and the document object in addition to DOM elements. Document object
   * is considered as the base offset point against which the element/window offsets are compared
   * to. This in turn means that the document object does not have an offset parent and the
   * the function returns null if document is provided as the argument. Document is also considered
   * as the window's offset parent. Window is considered as the root offset parent of all fixed
   * elements. Root and body elements are treated equally with all other DOM elements. For example
   * body's offset parent is the root element if root element is positioned, but if the root element
   * is static the body's offset parent is the document object.
   *
   * @public
   * @param {Document|Element|Window} el
   * @returns {?Document|Element|Window}
   */
  function getOffsetParent(el) {

    var isFixed = getStyle(el, 'position') === 'fixed';

    if (isFixed && !supportsW3CTELCS) {

      return global;

    }

    var offsetParent = el === root || el === global ? doc : el.parentElement || null;

    if (isFixed) {

      while (offsetParent && offsetParent !== doc && !isTransformed(offsetParent)) {

        offsetParent = offsetParent.parentElement || doc;

      }

      return offsetParent === doc ? global : offsetParent;

    }
    else {

      while (offsetParent && offsetParent !== doc && getStyle(offsetParent, 'position') === 'static' && !isTransformed(offsetParent)) {

        offsetParent = offsetParent.parentElement || doc;

      }

      return offsetParent;

    }

  }

  /**
   * Calculate the distance between two elements or rectangles. Returns a number. If the
   * elements/rectangles overlap the function returns -1. In other cases the function returns the
   * distance in pixels (fractional) between the the two elements/rectangles.
   *
   * @public
   * @param {Array|Document|Element|Window|Rectangle} a
   * @param {Array|Document|Element|Window|Rectangle} b
   * @returns {Number}
   */
  function getDistance(a, b) {

    var aRect = getSafeRect(a);
    var bRect = getSafeRect(b);

    return getIntersection(aRect, bRect) ? -1 : getRectDistance(aRect, bRect);

  }

  /**
   * Detect if two elements overlap and calculate the possible intersection area's dimensions and
   * offsets. If the intersection area exists the function returns an object containing the
   * intersection area's dimensions and offsets. Otherwise null is returned.
   *
   * @public
   * @param {Array|Document|Element|Window|Rectangle} a
   * @param {Array|Document|Element|Window|Rectangle} b
   * @returns {?Rectangle}
   */
  function getIntersection(a, b) {

    var aRect = getSafeRect(a);
    var bRect = getSafeRect(b);
    var overlap = getOverlap(aRect, bRect);
    var intWidth = MAX(aRect.width + MIN(overlap.left, 0) + MIN(overlap.right, 0), 0);
    var intHeight = MAX(aRect.height + MIN(overlap.top, 0) + MIN(overlap.bottom, 0), 0);
    var hasIntersection = intWidth > 0 && intHeight > 0;

    return !hasIntersection ? null : {
      width: intWidth,
      height: intHeight,
      left: aRect.left + ABS(MIN(overlap.left, 0)),
      top: aRect.top + ABS(MIN(overlap.top, 0))
    };

  }

  /**
   * Calculate an element's position (left/top CSS properties) when positioned relative to another
   * element, window or the document.
   *
   * @public
   * @param {Array|Document|Element|Window} el
   * @param {PlaceOptions} [options]
   * @returns {PlaceData}
   */
  function getPlace(el, options) {

    // Sanitize element (to dissect the possible edge info).
    el = [].concat(el);

    // Sanitize options.
    options = getPlaceOptions(el, options);

    var ret = {};
    var anchor = getSafeRect(options.of);
    var target = getNorthwestOffset(el[0], el[1]);
    var offsetX = options.offsetX;
    var offsetY = options.offsetY;

    // Get target width and height.
    target.width = getWidth(el[0], el[1]);
    target.height = getHeight(el[0], el[1]);

    // Sanitize offsets and check for percentage values.
    offsetX = typeof offsetX === 'string' && offsetX.indexOf('%') > -1 ? toFloat(offsetX) / 100 * targe.width : toFloat(offsetX);
    offsetY = typeof offsetY === 'string' && offsetY.indexOf('%') > -1 ? toFloat(offsetY) / 100 * targe.height : toFloat(offsetY);

    // Calculate element's new position (left/top coordinates).
    ret.left = getPlacePosition(options.my[0] + options.at[0], anchor.width, anchor.left, target.width, target.left, offsetX);
    ret.top = getPlacePosition(options.my[1] + options.at[1], anchor.height, anchor.top, target.height, target.top, offsetY);

    // If container is defined, let's add overlap data and handle collisions.
    if (options.within && options.collision) {

      // Update element offset data to match the newly calculated position.
      target.left += ret.left;
      target.top += ret.top;

      // Get container overlap data.
      var containerOverlap = getOverlap(target, options.within);

      // Get adjusted data after collision handling.
      ret.left += getPlaceCollision(options.collision, containerOverlap);
      ret.top += getPlaceCollision(options.collision, containerOverlap, 1);

    }

    return ret;

  }

  /**
   * Private helper functions
   * ************************
   */

  /**
   * Check if a value is a plain object.
   *
   * @private
   * @param {*} val
   * @returns {Boolean}
   */
  function isPlainObject(val) {

    return typeof val === 'object' && Object.prototype.toString.call(val) === '[object Object]';

  }

  /**
   * Returns the transform property name that the browser supports or null if transforms are not
   * supported.
   *
   * @private
   * @returns {?String}
   */
  function getSupportedTransform() {

    var all = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];

    for (var i = 0; i < all.length; i++) {

      if (root.style[all[i]] !== undefined) {

        return all[i];

      }

    }

    return null;

  }

  /**
   * Detect if the browser supports the W3C specification of the transform rendering model where a
   * transformed element creates a local coordinate system. All modern browsers follow the spec
   * mostly, but there is one specific case where IE (9-11) strays from the spec: IE allows fixed
   * elements to bypass the local coordinate system of transformed parent elements. This actually
   * makes a lot of sense and feels more intuitive to use than spec compliant implementations.
   * However, opinions aside, this needs to be tested in order for this library to provide correct
   * results. https://www.w3.org/TR/css3-2d-transforms/#transform-rendering
   *
   * @private
   * @returns {Boolean}
   */
  function testW3CTELCS() {

    if (!supportedTransform) {
      return false;
    }

    var body = doc.body;
    var outer = doc.createElement('div');
    var inner = doc.createElement('div');
    var leftUntransformed;
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
    body.appendChild(outer);
    leftUntransformed = inner.getBoundingClientRect().left;
    outer.style[supportedTransform] = 'translateZ(0)';
    leftTransformed = inner.getBoundingClientRect().left;
    body.removeChild(outer);

    return leftTransformed !== leftUntransformed;

  }

  /**
   * Returns true if element is transformed, false if not. In practice the element's display value
   * must be anything else than "none" or "inline" as well as have a valid transform value applied
   * in order to be counted as a transformed element.
   *
   * @private
   * @param {Element} el
   * @returns {Boolean}
   */
  function isTransformed(el) {

    var transform = getStyle(el, supportedTransform);
    var display = getStyle(el, 'display');

    return transform !== 'none' && display !== 'inline' && display !== 'none';

  }

  /**
   * Customized parseFloat function which returns 0 instead of NaN.
   *
   * @private
   * @param {Number|String} val
   * @returns {Number}
   */
  function toFloat(val) {

    return parseFloat(val) || 0;

  }

  /**
   * Deep merge an array of objects into a new object.
   *
   * @private
   * @param {Array} array
   * @returns {Object}
   */
  function mergeObjects(array) {

    var ret = {};
    var propName;
    var propVal;

    for (var i = 0, len = array.length; i < len; i++) {

      for (propName in array[i]) {

        if (array[i].hasOwnProperty(propName)) {

          propVal = array[i][propName];
          ret[propName] = isPlainObject(propVal) ? mergeObjects([propVal]) :
                          Array.isArray(propVal) ? propVal.slice() :
                                                   propVal;

        }

      }

    }

    return ret;

  }

  /**
   * Returns the computed value of an element's style property as a string.
   *
   * @private
   * @param {Element} el
   * @param {String} style
   * @returns {String}
   */
  function getStyle(el, style) {

    return win.getComputedStyle(el, null).getPropertyValue(style);

  }

  /**
   * Set inline styles to an element.
   *
   * @private
   * @param {Element} element
   * @param {Object} styles
   */
  function setStyles(element, styles) {

    for (var prop in styles) {

      element.style[prop] = styles[prop];

    }

  }

  /**
   * Calculates how much element overlaps another element from each side.
   *
   * @private
   * @param {Array|Document|Element|Window|Rectangle} a
   * @param {Array|Document|Element|Window|Rectangle} b
   * @returns {Overlap}
   */
  function getOverlap(a, b) {

    a = getSafeRect(a);
    b = getSafeRect(b);

    return {
      left: a.left - b.left,
      right: (b.left + b.width) - (a.left + a.width),
      top: a.top - b.top,
      bottom: (b.top + b.height) - (a.top + a.height)
    };

  }

  /**
   * Calculates the distance between two points in 2D space.
   *
   * @private
   * @param {Number} aLeft
   * @param {Number} aTop
   * @param {Number} bLeft
   * @param {Number} bTop
   * @returns {Number}
   */
  function getPointDistance(aLeft, aTop, bLeft, bTop) {

    return Math.sqrt(Math.pow(bLeft - aLeft, 2) + Math.pow(bTop - aTop, 2));

  }

  /**
   * Calculates the distance between two unrotated rectangles in 2D space. This function assumes
   * that the rectangles do not intersect.
   *
   * @private
   * @param {Rectangle} a
   * @param {Rectangle} b
   * @returns {Number}
   */
  function getRectDistance(a, b) {

    var ret = 0;
    var aLeft = a.left;
    var aRight = aLeft + b.width;
    var aTop = a.top;
    var aBottom = aTop + b.height;
    var bLeft = b.left;
    var bRight = bLeft + b.width;
    var bTop = b.top;
    var bBottom = bTop + b.height;

    // Calculate shortest corner distance
    if ((bLeft > aRight || bRight < aLeft) && (bTop > aBottom || bBottom < aTop)) {

      if (bLeft > aRight) {

        ret = bBottom < aTop ? getPointDistance(aRight, aTop, bLeft, bBottom) : getPointDistance(aRight, aBottom, bLeft, bTop);

      }
      else {

        ret = bBottom < aTop ? getPointDistance(aLeft, aTop, bRight, bBottom) : getPointDistance(aLeft, aBottom, bRight, bTop);

      }

    }

    // Calculate shortest edge distance
    else {

      ret = bBottom < aTop ? aTop - bBottom :
            bLeft > aRight ? bLeft - aRight :
            bTop > aBottom ? bTop - aBottom :
                             aLeft - bRight ;

    }

    return ret;

  }

  /**
   * Returns the height/width of an element in pixels. The function also accepts the window object
   * (for obtaining the viewport dimensions) and the document object (for obtaining the dimensions
   * of the document) in place of element. Note that this function considers root element's
   * scrollbars as the document's and window's scrollbars also. Since the root element's scrollbars
   * are always stuck on the right/bottom edge of the window (even if you specify width and/or
   * height to root element) they are generally referred to as viewport scrollbars in the docs. Also
   * note that only positive margins are included in the result when includeMargin argument is true.
   *
   * @private
   * @param {String} dimension
   *   - Accepts "width" or "height".
   * @param {Document|Element|Window} el
   * @param {Boolean} [includePadding=false]
   * @param {Boolean} [includeScrollbar=false]
   * @param {Boolean} [includeBorder=false]
   * @param {Boolean} [includeMargin=false]
   * @returns {Number}
   *  - The return value may be fractional when calculating the width of an element. For window and
   *    document objects the value is always an integer though.
   */
  function getDimension(dimension, el, includePadding, includeScrollbar, includeBorder, includeMargin) {

    var ret;
    var isHeight = dimension === 'height';
    var dimensionCapitalized = isHeight ? 'Height' : 'Width';
    var innerDimension = 'inner' + dimensionCapitalized;
    var clientDimension = 'client' + dimensionCapitalized;
    var scrollDimension = 'scroll' + dimensionCapitalized;

    if (el.self === win.self) {

      ret = includeScrollbar ? win[innerDimension] : root[clientDimension];

    }
    else if (el === doc) {

      if (includeScrollbar) {

        var sbSize = win[innerDimension] - root[clientDimension];

        ret = MAX(root[scrollDimension] + sbSize, doc.body[scrollDimension] + sbSize, win[innerDimension]);

      } else {

        ret = MAX(root[scrollDimension], doc.body[scrollDimension], root[clientDimension]);

      }

    }
    else {

      var edgeA = isHeight ? 'top' : 'left';
      var edgeB = isHeight ? 'bottom' : 'right';
      var borderA;
      var borderB;

      ret = el.getBoundingClientRect()[dimension];

      if (!includeScrollbar) {

        if (el === root) {

          ret -= win[innerDimension] - root[clientDimension];

        }
        else {

          borderA = toFloat(getStyle(el, 'border-' + edgeA + '-width'));
          borderB = toFloat(getStyle(el, 'border-' + edgeB + '-width'));
          ret -= Math.round(ret) - el[clientDimension] - borderA - borderB;

        }

      }

      if (!includePadding) {

        ret -= toFloat(getStyle(el, 'padding-' + edgeA));
        ret -= toFloat(getStyle(el, 'padding-' + edgeB));

      }

      if (!includeBorder) {

        ret -= borderA !== undefined ? borderA : toFloat(getStyle(el, 'border-' + edgeA + '-width'));
        ret -= borderB !== undefined ? borderB : toFloat(getStyle(el, 'border-' + edgeB + '-width'));

      }

      if (includeMargin) {

        var marginA = toFloat(getStyle(el, 'margin-' + edgeA));
        var marginB = toFloat(getStyle(el, 'margin-' + edgeB));

        ret += marginA > 0 ? marginA : 0;
        ret += marginB > 0 ? marginB : 0;

      }

    }

    return ret;

  }

  /**
   * Returns an object containing the provided element's dimensions and offsets. This is basically
   * just a wrapper for the getRect function which does some argument normalization before doing
   * the actal calculations. Used only internally.
   *
   * @private
   * @param {Array|Document|Element|Window|Rectangle} el
   * @returns {?Rectangle}
   */
  function getSafeRect(el) {

    if (!el) {
      return null;
    }

    if (isPlainObject(el)) {
      return el;
    }

    el = [].concat(el);

    return getRect(el[0], el[1]);

  }

  /**
   * Returns an element's northwest offset which in this case means the element's offset in a state
   * where the element's left and top CSS properties are set to 0.
   *
   * @private
   * @param {Array|Document|Element|Window} el
   * @param {Edge} edge
   * @returns {Offset}
   */
  function getNorthwestOffset(el, edge) {

    // Sanitize edge.
    edge = edge || 'border';

    var position = getStyle(el, 'position');
    var offset;

    if (position === 'static') {

      offset = getOffset(el, edge);

    }
    else if (position === 'relative') {

      offset = getOffset(el, edge);

      var autoLeft = getStyle(el, 'left') === 'auto';
      var autoRight = getStyle(el, 'right') === 'auto';
      var autoTop = getStyle(el, 'top') === 'auto';
      var autoBottom = getStyle(el, 'bottom') === 'auto';

      if (!autoLeft || !autoRight) {

        offset.left -= autoLeft ? -toFloat(right) : toFloat(left);

      }

      if (!autoTop || !autoBottom) {

        offset.top -= autoTop ? -toFloat(bottom) : toFloat(top);

      }

    }
    else {

      offset = getOffset(getOffsetParent(el) || doc, 'padding');
      edge = edges[edge];

      var marginLeft = toFloat(getStyle(el, 'margin-left'));
      var marginTop = toFloat(getStyle(el, 'margin-top'));

      // If edge is "margin" remove negative left/top margins from offset to account for their
      // effect on position.
      if (edge === 5) {

        offset.left -= ABS(MIN(marginLeft, 0));
        offset.top -= ABS(MIN(marginTop, 0));

      }

      // If edge is "border" or smaller add positive left/top margins and remove negative left/top
      // margins from offset to account for their effect on position.
      if (edge < 5) {

        offset.left += marginLeft;
        offset.top += marginTop;

      }

      // If edge is "scroll" or smaller add left/top borders to offset to account for their effect
      // on position.
      if (edge < 4) {

        offset.left += toFloat(getStyle(el, 'border-left-width'));
        offset.top += toFloat(getStyle(el, 'border-top-width'));

      }

      // If edge is "content" add left/top paddings to offset to account for their effect on
      // position.
      if (edge === 1) {

        offset.left += toFloat(getStyle(el, 'padding-left'));
        offset.top += toFloat(getStyle(el, 'padding-top'));

      }

    }

    return offset;

  }

  /**
   * Merges default options with the instance options and sanitizes the new options.
   *
   * @private
   * @param {Document|Element|Window} el
   * @param {PlaceOptions} [options]
   * @returns {Object}
   */
  function getPlaceOptions(el, options) {

    // Merge user options with default options.
    options = mergeObjects(options ? [placeDefaultOptions, options] : [defaults]);

    var name;
    var val;

    // Loop through all the options.
    for (var i = 0; i < 7; i++) {

      name = placeOptionsNames[i];
      val = options[name];

      // If option is declared as a function let's execute it and continue processing.
      if (typeof val === 'function') {

        val = options[name] = val();

      }

      // Sanitize positions.
      if (i < 2) {

        val = typeof val === 'string' ? val.split(' ') : val;
        val[0] = val[0].charAt(0);
        val[1] = val[1].charAt(0);
        options[name] = val;

      }

    }

    // If collision option is a string value map it into an object.
    if (typeof options.collision === 'string') {

      val = options.collision.split(' ');
      val[1] = val[1] || val[0];
      options.collision = {
        left: val[0],
        right: val[0],
        top: val[1],
        bottom: val[1]
      };

    }

    return options;

  }

  /**
   * Returns the horizontal or vertical base position of a target element relative to an anchor
   * element. In other words, this function returns the value which should set as the target
   * element's left/top CSS value in order to position it according to the placement argument.
   *
   * @private
   * @param {Placement} placement
   * @param {Number} anchorSize
   *   - Target's width/height in pixels.
   * @param {Number} anchorOffset
   *   - Target's left/top offset in pixels.
   * @param {Number} targetSize
   *   - Target's width/height in pixels.
   * @param {Number} targetNwOffset
   *   - Target's left/top northwest offset in pixels.
   * @param {Number} extraOffset
   *   - Additional left/top offset in pixels.
   * @returns {Number}
   */
  function getPlacePosition(placement, anchorSize, anchorOffset, targetSize, targetNwOffset, extraOffset) {

    var northwestPoint = anchorOffset + extraOffset - targetNwOffset;

    return placement === 'll' || placement === 'tt' ? northwestPoint :
           placement === 'lc' || placement === 'tc' ? northwestPoint + (anchorSize / 2) :
           placement === 'lr' || placement === 'tb' ? northwestPoint + anchorSize :
           placement === 'cl' || placement === 'ct' ? northwestPoint - (targetSize / 2) :
           placement === 'cr' || placement === 'cb' ? northwestPoint + anchorSize - (targetSize / 2) :
           placement === 'rl' || placement === 'bt' ? northwestPoint - targetSize :
           placement === 'rc' || placement === 'bc' ? northwestPoint - targetSize + (anchorSize / 2) :
           placement === 'rr' || placement === 'bb' ? northwestPoint - targetSize + anchorSize :
                                                      northwestPoint + (anchorSize / 2) - (targetSize / 2);

  }

  /**
   * Calculates the distance in pixels that the target element needs to be moved in order to be
   * aligned correctly if the target element overlaps with the container.
   *
   * @private
   * @param {Collision} collision
   * @param {Overlap} targetOverlap
   * @param {Boolean} isVertical
   * @returns {Number}
   */
  function getPlaceCollision(collision, targetOverlap, isVertical) {

    var ret = 0;
    var push = 'push';
    var forcePush = 'forcePush';
    var sideA = isVertical ? 'top' : 'left';
    var sideB = isVertical ? 'bottom' : 'right';
    var sideACollision = collision[sideA];
    var sideBCollision = collision[sideB];
    var sideAOverlap = targetOverlap[sideA];
    var sideBOverlap = targetOverlap[sideB];
    var sizeDifference = sideAOverlap + sideBOverlap;

    // If pushing is needed from both sides.
    if ((sideACollision === push || sideACollision === forcePush) && (sideBCollision === push || sideBCollision === forcePush) && (sideAOverlap < 0 || sideBOverlap < 0)) {

      // Do push correction from opposite sides with equal force.
      if (sideAOverlap < sideBOverlap) {

        ret -= sizeDifference < 0 ? sideAOverlap + ABS(sizeDifference / 2) : sideAOverlap;

      }

      // Do push correction from opposite sides with equal force.
      if (sideBOverlap < sideAOverlap) {

        ret += sizeDifference < 0 ? sideBOverlap + ABS(sizeDifference / 2) : sideBOverlap;

      }

      // Update overlap data.
      sideAOverlap += ret;
      sideBOverlap -= ret;

      // Check if left/top side forced push correction is needed.
      if (sideACollision === forcePush && sideBCollision != forcePush && sideAOverlap < 0) {

        ret -= sideAOverlap;

      }

      // Check if right/top side forced push correction is needed.
      if (sideBCollision === forcePush && sideACollision != forcePush && sideBOverlap < 0) {

        ret += sideBOverlap;

      }

    }

    // Check if pushing is needed from left or top side only.
    else if ((sideACollision === forcePush || sideACollision === push) && sideAOverlap < 0) {

      ret -= sideAOverlap;

    }

    // Check if pushing is needed from right or bottom side only.
    else if ((sideBCollision === forcePush || sideBCollision === push) && sideBOverlap < 0) {

      ret += sideBOverlap;

    }

    return ret;

  }

  /**
   * Custom type definitions
   * ***********************
   */

  /**
   * The browser's window object.
   *
   * @typedef {Object} Window
   */

  /**
   * The document contained in browser's window object.
   *
   * @typedef {Object} Document
   */

  /**
   * Any HTML element including root and body elements.
   *
   * @typedef {Object} Element
   */

  /**
   * The name of an element's box model edge which allows you to decide which areas of the element
   * you want to include in the calculations. Valid edge values are "content", "padding", "scroll",
   * "border" and "margin", in that specific order. Note that "scroll" is not a valid element edge
   * accroding to W3C spec, but it is used here to define whether or not the scrollbar's size should
   * be included in the calculations. For window and document objects this argument behaves a bit
   * differently since they cannot have any paddings, borders or margins. Only "content" (without
   * vertical scrollbar’s width) and "scroll" (with vertical scrollbar’s width) are effective
   * values. "padding" is normalized to "content" while "border" and "margin" are normalized to
   * "scroll".
   *
   * @typedef {String} Edge
   */

  /**
   * @typedef {Object} Rectangle
   * @property {Number} left - Element's horizontal distance from the left edge of the document.
   * @property {Number} top - Element's vertical distance from the top edge of the document.
   * @property {Number} height - Element's height.
   * @property {Number} width - Element's width.
   */

  /**
   * @typedef {Object} Offset
   * @property {Number} left - Element's horizontal distance from the left edge of the document.
   * @property {Number} top - Element's vertical distance from the top edge of the document.
   */

  /**
   * @typedef {Object} Position
   * @property {Number} left - Element's horizontal distance from the left edge of another element.
   * @property {Number} top - Element's vertical distance from the top edge of another element.
   */

  /**
   * @typedef {Object} Overlap
   * @property {Number} left
   * @property {Number} top
   * @property {Number} right
   * @property {Number} bottom
   */

  /**
   * All properties accepts the following values: "push", "forcePush" and "none".
   *
   * @typedef {Object} Collision
   * @property {String} [left='push']
   * @property {String} [right='push']
   * @property {String} [top='push']
   * @property {String} [bottom='push']
   */

  /**
   * @typedef {Object} PlaceOptions
   * @property {String} [my='left top']
   * @property {String} [at='left top']
   * @property {Array|Document|Element|Window|Rectangle} [of=window]
   * @property {?Array|Document|Element|Window|Rectangle} [within=null]
   * @property {Number} [offsetX=0]
   * @property {Number} [offsetY=0]
   * @property {?Collision} [collision]
   */

  /**
   * @typedef {Object} PlaceData
   * @property {Number} left - Target element's new left position.
   * @property {Number} top - Target element's new top position.
   */

  /**
    * Describe an element's vertical or horizontal placement relative to another element. For
    * example, if we wanted to place target's left side to the anchor's right side we would write:
    * "lr", which is short from  "left" and "right".
    * left   -> "l"
    * right  -> "r"
    * top    -> "t"
    * bottom -> "b"
    * center -> "c"
    *
    * @typedef {String} Placement
    */

  /**
   * Initialize
   * **********
   */

  // The TELCS test needs to have body ready, so we need to make sure we have it available before
  // doing the test.
  if (doc.body) {
    supportsW3CTELCS = testW3CTELCS();
  }
  else {
    doc.addEventListener('DOMContentLoaded', function () {
      supportsW3CTELCS = testW3CTELCS();
    }, false);
  }

  // Name and return the public methods.
  return {
    width: getWidth,
    height: getHeight,
    offset: getOffset,
    rect: getRect,
    offsetParent: getOffsetParent,
    distance: getDistance,
    intersection: getIntersection,
    place: getPlace
  };

}));
