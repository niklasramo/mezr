/*!
 * mezr v0.5.0-dev
 * https://github.com/niklasramo/mezr
 * Copyright (c) 2016 Niklas Rämö <inramo@gmail.com>
 * Released under the MIT license
 */

(function (global, factory) {

  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory(global);
    });
  }
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory(global);
  }
  else {
    global.mezr = factory(global);
  }

}(this, function (win, undefined) {

  'use strict';

  // Make sure we received a valid window object from the factory arguments.
  var win = win.document && win.self === win.document.defaultView ? win : window;

  // Cache document, root and body elements.
  var doc = win.document;
  var root = doc.documentElement;
  var body = doc.body;

  // Throw error if body is not available
  if (!body) {
    throw Error('Mezr needs access to body element.');
  }

  // Cache some often used native functions.
  var abs = Math.abs;
  var max = Math.max;
  var min = Math.min;

  // String to number mappings for element edges.
  var edges = {
    content: 1,
    padding: 2,
    scroll: 3,
    border: 4,
    margin: 5
  };

  // Temporary bounding client rect data.
  var tempBCR;

  // Mezr settings.
  var settings = {};

  // Default options for place method.
  settings.placeDefaultOptions = {
    element: null,
    target: null,
    position: 'left top left top',
    offsetX: 0,
    offsetY: 0,
    contain: null
  };

  // Get the primary supported transform property.
  settings.transform = getSupportedTransform();

  // Do transformed elements leak fixed elements? According W3C specification about transform
  // rendering a transformed element should contain even fixed elements, but not every browser
  // follows the spec. So we need to test it.
  settings.transformLeaksFixed = doesTransformLeakFixed();

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
   *   - The return value may be fractional when calculating the width of an element. For window and
   *     document objects the value is always an integer though.
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
   *   - The return value may be fractional when calculating the width of an element. For window and
   *     document objects the value is always an integer though.
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

    var ret = {
      left: 0,
      top: 0
    };

    // Document's offsets are always 0.
    if (el === doc) {

      return ret;

    }

    // Add viewport's scroll left/top to the respective offsets.
    ret.left = win.pageXOffset || 0;
    ret.top = win.pageYOffset || 0;

    // Window's offsets are the viewport's scroll left/top values.
    if (el.self === win.self) {

      return ret;

    }

    // Now we know we are calculating an element's offsets so let's first get the element's
    // bounding client rect. If it is not cached, then just fetch it.
    var gbcr = tempBCR || el.getBoundingClientRect();

    // Add bounding client rect's left/top values to the offsets.
    ret.left += gbcr.left;
    ret.top += gbcr.top;

    // Sanitize edge.
    edge = edge && edges[edge] || 4;

    // Exclude element's positive margin size from the offset if needed.
    if (edge === 5) {

      var marginLeft = getStyleAsFloat(el, 'margin-left');
      var marginTop = getStyleAsFloat(el, 'margin-top');

      ret.left -=  marginLeft > 0 ? marginLeft : 0;
      ret.top -= marginTop > 0 ? marginTop : 0;

    }

    // Include element's border size to the offset if needed.
    if (edge < 4) {

      ret.left += getStyleAsFloat(el, 'border-left-width');
      ret.top += getStyleAsFloat(el, 'border-top-width');

    }

    // Include element's padding size to the offset if needed.
    if (edge === 1) {

      ret.left += getStyleAsFloat(el, 'padding-left');
      ret.top += getStyleAsFloat(el, 'padding-top');

    }

    return ret;

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

    return getRectInternal(el, edge);

  }

  /**
   * Returns the element's containing block, which is considered to be the closest ancestor
   * element (or window, or document, or the target element itself) that the target element's
   * positioning is relative to. In other words, containing block is the element the target
   * element's CSS properties "left", "right", "top" and "bottom" are relative to. This function
   * is quite similar to the native elem.offsetParent read-only property, but there are enough
   * differences to justify the existence of this function.
   *
   * The logic:
   * - Document is considered to be the root containing block of all elements and the window.
   *   Getting the document's containing block will return null.
   * - Static element does not have a containing block since setting values to the "left", "right",
   *   "top" and "bottom" CSS properties does not have any effect on it. Thus, getting the position
   *   container of a static element will return null.
   * - Relative element's containing block is always the element itself.
   * - Fixed element's containing block is always the closest transformed ancestor or window if
   *   the element does not have any transformed ancestors. An exception is made for browsers which
   *   allow fixed elements to bypass the W3C specification of transform rendering. In those
   *   browsers fixed element's containing block is always the window.
   * - Absolute element's containing block is the closest ancestor element that is transformed or
   *   positioned (any element which is not static), or document if no positioned or transformed
   *   ancestor is not found.
   * - Root element and body element are considered as equals with all other elements and are
   *   treated equally with all other elements.
   *
   * @public
   * @param {Document|Element|Window} el
   * @param {String} [fakePosition]
   *   - An optional argument which allows you to get the element's containing block as if the
   *     element had the position set to the value provided with this argument. Using this argument
   *     does not modify the element's true position in any way, it's just used as fake value for
   *     function. By default (when this argument is empty) the function will automatically get the
   *     element's current position.
   * @returns {?Document|Element|Window}
   */
  function getContainingBlock(el, fakePosition) {

    // If we have document return null right away.
    if (el === doc) {

      return null;

    }

    // If we have window return document right away.
    if (el === win) {

      return doc;

    }

    // Now that we know we have an element in our hands, let's get it's position. Get element's
    // current position value if a specific position is not provided.
    var position = fakePosition || getStyle(el, 'position');

    // Relative element's container is always the element itself.
    if (position === 'relative') {

      return el;

    }

    // If element is not positioned (static or an invalid position value), always return null.
    if (position !== 'fixed' && position !== 'absolute') {

      return null;

    }

    // If the element is fixed and transforms leak fixed elements, always return window.
    if (position === 'fixed' && settings.transformLeaksFixed) {

      return win;

    }

    // Alrighty, so now fetch the element's parent (which is document for the root) and set it as
    // the initial containing block. Fallback to null if everything else fails.
    var ret = el === root ? doc : el.parentElement || null;

    // If element is fixed positioned.
    if (position === 'fixed') {

      // As long as the containing block is an element and is not transformed, try to get the
      // element's parent element and fallback to document.
      while (ret && ret !== doc && !isTransformed(ret)) {

        ret = ret.parentElement || doc;

      }

      return ret === doc ? win : ret;

    }
    // If the element is absolute positioned.
    else {

      // As long as the containing block is an element, is static and is not transformed, try to
      // get the element's parent element and fallback to document.
      while (ret && ret !== doc && getStyle(ret, 'position') === 'static' && !isTransformed(ret)) {

        ret = ret.parentElement || doc;

      }

      return ret;

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

    var aRect = getSanitizedRect(a);
    var bRect = getSanitizedRect(b);

    return getIntersection(aRect, bRect) ? -1 : getRectDistance(aRect, bRect);

  }

  /**
   * Detect if all of the provided elements overlap and calculate the possible intersection area's
   * dimensions and offsets. If the intersection area exists the function returns an object
   * containing the intersection area's dimensions and offsets. Otherwise null is returned.
   *
   * @public
   * @param {...Array|Document|Element|Window|Rectangle} el
   * @returns {?Rectangle}
   */
  function getIntersectionMultiple() {

    // Get the initial intersection of the first two items.
    var intersection = getIntersection(arguments[0], arguments[1]);

    // If there are more than two items.
    if (arguments.length > 2) {

      // Loop the arguments until the end or until the intersection is non-existent.
      for (var i = 2; i < arguments.length; ++i) {

        intersection = getIntersection(intersection, arguments[i]);

        if (!intersection) {
          break;
        }

      }

    }

    return intersection;

  }

  /**
   * Calculate an element's position (left/top CSS properties) when positioned relative to another
   * element, window or the document.
   *
   * @public
   * @param {PlaceOptions} [options]
   * @returns {PlaceData}
   */
  function getPlace(options) {

    var ret = {};
    var opts = getPlaceOptions(options);
    var eRect = getSanitizedRect(opts.element, true);
    var tRect = getSanitizedRect(opts.target);
    var offsetX = opts.offsetX;
    var offsetY = opts.offsetY;

    // Sanitize offsets and check for percentage values.
    offsetX = typeof offsetX === 'string' && offsetX.indexOf('%') > -1 ? toFloat(offsetX) / 100 * eRect.width : toFloat(offsetX);
    offsetY = typeof offsetY === 'string' && offsetY.indexOf('%') > -1 ? toFloat(offsetY) / 100 * eRect.height : toFloat(offsetY);

    // Calculate element's new position (left/top coordinates).
    ret.left = getPlacePosition(opts.position[0] + opts.position[2], tRect.width, tRect.left, eRect.width, eRect.left, offsetX);
    ret.top = getPlacePosition(opts.position[1] + opts.position[3], tRect.height, tRect.top, eRect.height, eRect.top, offsetY);

    // If contain is defined, let's add overlap data and handle collisions.
    if (opts.contain) {

      // Update element offset data to match the newly calculated position.
      eRect.left += ret.left;
      eRect.top += ret.top;

      // Get container overlap data.
      var containerOverlap = getOverlap(eRect, opts.contain.within);

      // Get adjusted data after collision handling.
      ret.left += getPlaceCollision(opts.contain.onCollision, containerOverlap);
      ret.top += getPlaceCollision(opts.contain.onCollision, containerOverlap, 1);

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
   * Returns the supported transform property's prefix, property name and style name or null if
   * transforms are not supported.
   *
   * @private
   * @returns {?Object}
   */
  function getSupportedTransform() {

    var transforms = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];

    for (var i = 0; i < transforms.length; i++) {

      if (root.style[transforms[i]] !== undefined) {

        var prop = transforms[i];
        var prefix = prop.toLowerCase().split('transform')[0];

        return {
          prefix: prefix,
          propName: prop,
          styleName: prefix ? '-' + prefix + '-transform' : prop
        };

      }

    }

    return null;

  }

  /**
   * Detects if transformed elements leak fixed elements. According W3C transform rendering spec a
   * transformed element should contain even fixed elements. Meaning that fixed elements are
   * positioned relative to the closest transformed ancestor element instead of window. However, not
   * every ot browser follows the spec (IE and older Firefox). So we need to test it.
   * https://www.w3.org/TR/css3-2d-transforms/#transform-rendering
   *
   * @private
   * @returns {Boolean}
   *   - Returns true if transformed elements leak fixed elements, false otherwise.
   */
  function doesTransformLeakFixed() {

    if (!settings.transform) {

      return true;

    }

    var outer = doc.createElement('div');
    var inner = doc.createElement('div');
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
    body.appendChild(outer);
    leftNotTransformed = inner.getBoundingClientRect().left;
    outer.style[settings.transform.propName] = 'translateX(0)';
    leftTransformed = inner.getBoundingClientRect().left;
    body.removeChild(outer);

    return leftTransformed === leftNotTransformed;

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

    var transform = getStyle(el, settings.transform.styleName);
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
   * Returns the computed value of an element's style property transformed into a float value.
   *
   * @private
   * @param {Element} el
   * @param {String} style
   * @returns {Number}
   */
  function getStyleAsFloat(el, style) {

    return toFloat(getStyle(el, style));

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

    a = getSanitizedRect(a);
    b = getSanitizedRect(b);

    return {
      left: a.left - b.left,
      right: (b.left + b.width) - (a.left + a.width),
      top: a.top - b.top,
      bottom: (b.top + b.height) - (a.top + a.height)
    };

  }

  /**
   * Detect if two elements overlap and calculate the possible intersection area's dimensions and
   * offsets. If the intersection area exists the function returns an object containing the
   * intersection area's dimensions and offsets. Otherwise null is returned.
   *
   * @private
   * @param {Array|Document|Element|Window|Rectangle} a
   * @param {Array|Document|Element|Window|Rectangle} b
   * @returns {?RectangleExtended}
   */
  function getIntersection(a, b) {

    var ret = {};
    var aRect = getSanitizedRect(a);
    var bRect = getSanitizedRect(b);
    var overlap = getOverlap(aRect, bRect);
    var intWidth = max(aRect.width + min(overlap.left, 0) + min(overlap.right, 0), 0);
    var intHeight = max(aRect.height + min(overlap.top, 0) + min(overlap.bottom, 0), 0);
    var hasIntersection = intWidth > 0 && intHeight > 0;

    if (hasIntersection) {
      ret.width = intWidth;
      ret.height = intHeight;
      ret.left = aRect.left + abs(min(overlap.left, 0));
      ret.top = aRect.top + abs(min(overlap.top, 0));
      ret.right = ret.left + ret.width;
      ret.bottom = ret.top + ret.height;
    }

    return hasIntersection ? ret : null;

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
   *   - The return value may be fractional when calculating the width of an element. For window and
   *     document objects the value is always an integer though.
   */
  function getDimension(dimension, el, includePadding, includeScrollbar, includeBorder, includeMargin) {

    var ret;
    var isHeight = dimension === 'height';
    var dimensionCapitalized = isHeight ? 'Height' : 'Width';
    var innerDimension = 'inner' + dimensionCapitalized;
    var clientDimension = 'client' + dimensionCapitalized;
    var scrollDimension = 'scroll' + dimensionCapitalized;
    var edgeA;
    var edgeB;
    var borderA;
    var borderB;
    var marginA;
    var marginB;
    var sbSize;

    if (el.self === win.self) {

      ret = includeScrollbar ? win[innerDimension] : root[clientDimension];

    }
    else if (el === doc) {

      if (includeScrollbar) {

        sbSize = win[innerDimension] - root[clientDimension];
        ret = max(root[scrollDimension] + sbSize, body[scrollDimension] + sbSize, win[innerDimension]);

      } else {

        ret = max(root[scrollDimension], body[scrollDimension], root[clientDimension]);

      }

    }
    else {

      edgeA = isHeight ? 'top' : 'left';
      edgeB = isHeight ? 'bottom' : 'right';
      ret = (tempBCR || el.getBoundingClientRect())[dimension];

      if (!includeScrollbar) {

        if (el === root) {

          sbSize = win[innerDimension] - root[clientDimension];

        }
        else {

          borderA = getStyleAsFloat(el, 'border-' + edgeA + '-width');
          borderB = getStyleAsFloat(el, 'border-' + edgeB + '-width');
          sbSize = Math.round(ret) - (el[clientDimension] + borderA + borderB);

        }

        ret -= sbSize > 0 ? sbSize : 0;

      }

      if (!includePadding) {

        ret -= getStyleAsFloat(el, 'padding-' + edgeA);
        ret -= getStyleAsFloat(el, 'padding-' + edgeB);

      }

      if (!includeBorder) {

        ret -= borderA !== undefined ? borderA : getStyleAsFloat(el, 'border-' + edgeA + '-width');
        ret -= borderB !== undefined ? borderB : getStyleAsFloat(el, 'border-' + edgeB + '-width');

      }

      if (includeMargin) {

        marginA = getStyleAsFloat(el, 'margin-' + edgeA);
        marginB = getStyleAsFloat(el, 'margin-' + edgeB);
        ret += marginA > 0 ? marginA : 0;
        ret += marginB > 0 ? marginB : 0;

      }

    }

    return ret;

  }

  /**
   * Returns an object containing the provided element's dimensions and offsets. This is basically
   * just a wrapper for the getRectInternal function which does some argument normalization before
   * doing the actal calculations. Used only internally.
   *
   * @private
   * @param {Array|Document|Element|Window|Rectangle} el
   * @param {Boolean} [useStaticOffset=false]
   * @returns {?Rectangle}
   */
  function getSanitizedRect(el, useStaticOffset) {

    // Can't have an empty value.
    if (!el) {

      return null;

    }

    // Let's assume that plain objects are static rectangle definitions.
    if (isPlainObject(el)) {

      return el;

    }

    // We don't know for sure if the provided element is defined with an edge layer (array syntax)
    // or not. So let's play it safe an normalize the value to an array.
    el = [].concat(el);

    return getRectInternal(el[0], el[1], useStaticOffset);

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
   * @param {Boolean} [useStaticOffset=false]
   * @returns {Rectangle}
   */
  function getRectInternal(el, edge, useStaticOffset) {

    var isElem = el !== doc && el.self !== win.self;
    var rect;

    // Sanitize edge.
    edge = edge || 'border';

    // If static offset is required we have to get it before temporary bounding client rect is
    // cached, since it might need to get the offset of another element than the cached one.
    if (useStaticOffset) {
      rect = getStaticOffset(el, edge);
    }

    // Cache element's bounding client rect.
    if (isElem) {
      tempBCR = el.getBoundingClientRect();
    }

    // If static offset is not required we know for sure that the temporary bounding client rect is
    // the same element we need to get offset for.
    if (!useStaticOffset) {
      rect = getOffset(el, edge);
    }

    // Get element's width and height.
    rect.width = getWidth(el, edge);
    rect.height = getHeight(el, edge);

    // Calculate element's bottom and right.
    rect.bottom = rect.top + rect.height;
    rect.right = rect.left + rect.width;

    // Nullify temporary bounding client rect cache.
    if (isElem) {
      tempBCR = null;
    }

    return rect;

  }

  /**
   * Returns an element's static offset which in this case means the element's offset in a state
   * where the element's left and top CSS properties are set to 0.
   *
   * @private
   * @param {Document|Element|Window} el
   * @param {Edge} edge
   * @returns {Offset}
   */
  function getStaticOffset(el, edge) {

    // Sanitize edge.
    edge = edge || 'border';

    // For window and document just return normal offset.
    if (el === win || el === doc) {

      return getOffset(el, edge);

    }

    var position = getStyle(el, 'position');
    var offset = position === 'static' || position === 'relative' ? getOffset(el, edge) : getOffset(getContainingBlock(el) || doc, 'padding');

    if (position === 'static') {

      return offset;

    }

    if (position === 'relative') {

      var left = getStyle(el, 'left');
      var right = getStyle(el, 'right');
      var top = getStyle(el, 'top');
      var bottom = getStyle(el, 'bottom');

      if (left !== 'auto' || right !== 'auto') {

        offset.left -= left === 'auto' ? -toFloat(right) : toFloat(left);

      }

      if (top !== 'auto' || bottom !== 'auto') {

        offset.top -= top === 'auto' ? -toFloat(bottom) : toFloat(top);

      }

      return offset;

    }

    // Get edge number.
    edge = edges[edge];

    // Get left and top margins.
    var marginLeft = getStyleAsFloat(el, 'margin-left');
    var marginTop = getStyleAsFloat(el, 'margin-top');

    // If edge is "margin" remove negative left/top margins from offset to account for their
    // effect on position.
    if (edge === 5) {

      offset.left -= abs(min(marginLeft, 0));
      offset.top -= abs(min(marginTop, 0));

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

      offset.left += getStyleAsFloat(el, 'border-left-width');
      offset.top += getStyleAsFloat(el, 'border-top-width');

    }

    // If edge is "content" add left/top paddings to offset to account for their effect on
    // position.
    if (edge === 1) {

      offset.left += getStyleAsFloat(el, 'padding-left');
      offset.top += getStyleAsFloat(el, 'padding-top');

    }

    return offset;

  }

  /**
   * Merges default options with the instance options and sanitizes the new options.
   *
   * @private
   * @param {PlaceOptions} [options]
   * @returns {Object}
   */
  function getPlaceOptions(options) {

    // Merge user options with default options.
    var opts = mergeObjects(options ? [settings.placeDefaultOptions, options] : [settings.placeDefaultOptions]);

    // Sanitize position option. Transform to array with shortened string values.
    var position = opts.position;
    opts.position = position = typeof position === 'string' ? position.split(' ') : position;
    for (var i = 0; i < position.length; i++) {
      position[i] = position[i].charAt(0);
    }

    // Sanitize contain option. First of all make sure that the contain option and contain.within
    // option are both objects and not null.
    var contain = opts.contain;
    if (contain && typeof contain === 'object' && contain.within && typeof contain.within === 'object') {

      var collision = contain.onCollision;
      var collisionType = typeof collision;
      var left = 'none';
      var right = 'none';
      var top = 'none';
      var bottom = 'none';

      // onCollision string value is always used for all sides.
      if (collisionType === 'string') {

        left = right = top = bottom = collision;

      }
      // onCollision object value can have properties that present a side (left/right/top/bottom) or
      // an axis (x/y). Always try to use the side value first and then fallback to axis value. If
      // all else fails fallback to "none".
      else if (collisionType === 'object') {

        left = collision.left || collision.x || left;
        right = collision.right || collision.x || right;
        top = collision.top || collision.y || top;
        bottom = collision.bottom || collision.y || bottom;

      }

      // If one side (or more) has a value other than "none" we know that the collision option might
      // have an effect on the positioning. So let's update the options object with the new data.
      if (left !== 'none' || right !== 'none' || top !== 'none' || bottom !== 'none') {

        opts.contain.onCollision = {
          left: left,
          right: right,
          top: top,
          bottom: bottom
        };

      }
      // Otherwise we know that the collision will not have an effect.
      else {

        opts.contain = null;

      }

    }
    else {

      opts.contain = null;

    }

    return opts;

  }

  /**
   * Returns the horizontal or vertical base position of an element relative to the target element.
   * In other words, this function returns the left and top CSS values which should be set as to the
   * target element in order to position it according to the desired position.
   *
   * @private
   * @param {Placement} placement
   * @param {Number} targetSize
   *   - Target's width/height in pixels.
   * @param {Number} targetOffset
   *   - Target's left/top offset in pixels.
   * @param {Number} elementSize
   *   - Element's width/height in pixels.
   * @param {Number} elementNwOffset
   *   - Element's left/top northwest offset in pixels.
   * @param {Number} extraOffset
   *   - Additional left/top offset in pixels.
   * @returns {Number}
   */
  function getPlacePosition(placement, targetSize, targetOffset, elementSize, elementNwOffset, extraOffset) {

    var northwestPoint = targetOffset + extraOffset - elementNwOffset;

    return placement === 'll' || placement === 'tt' ? northwestPoint :
           placement === 'lc' || placement === 'tc' ? northwestPoint + (targetSize / 2) :
           placement === 'lr' || placement === 'tb' ? northwestPoint + targetSize :
           placement === 'cl' || placement === 'ct' ? northwestPoint - (elementSize / 2) :
           placement === 'cr' || placement === 'cb' ? northwestPoint + targetSize - (elementSize / 2) :
           placement === 'rl' || placement === 'bt' ? northwestPoint - elementSize :
           placement === 'rc' || placement === 'bc' ? northwestPoint - elementSize + (targetSize / 2) :
           placement === 'rr' || placement === 'bb' ? northwestPoint - elementSize + targetSize :
                                                      northwestPoint + (targetSize / 2) - (elementSize / 2);

  }

  /**
   * Calculates the distance in pixels that the element needs to be moved in order to be aligned
   * correctly if the target element overlaps the container.
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
    var forcePush = 'forcepush';
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

        ret -= sizeDifference < 0 ? sideAOverlap + abs(sizeDifference / 2) : sideAOverlap;

      }

      // Do push correction from opposite sides with equal force.
      if (sideBOverlap < sideAOverlap) {

        ret += sizeDifference < 0 ? sideBOverlap + abs(sizeDifference / 2) : sideBOverlap;

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
   * @property {Number} left
   *   - Element's horizontal distance from the left edge of the document.
   * @property {Number} top
   *   - Element's vertical distance from the top edge of the document.
   * @property {Number} height
   *   - Element's height.
   * @property {Number} width
   *   - Element's width.
   */

  /**
   * @typedef {Object} RectangleExtended
   * @property {Number} left
   *   - Element's horizontal distance from the left edge of the document.
   * @property {Number} right
   *   - Element's horizontal distance from the left edge of the document plus width.
   * @property {Number} top
   *   - Element's vertical distance from the top edge of the document
   * @property {Number} bottom
   *   - Element's vertical distance from the top edge of the document plus height.
   * @property {Number} height
   *   - Element's height.
   * @property {Number} width
   *   - Element's width.
   */

  /**
   * @typedef {Object} Offset
   * @property {Number} left
   *   - Element's horizontal distance from the left edge of the document.
   * @property {Number} top
   *   - Element's vertical distance from the top edge of the document.
   */

  /**
   * @typedef {Object} Position
   * @property {Number} left
   *   - Element's horizontal distance from the left edge of another element.
   * @property {Number} top
   *   - Element's vertical distance from the top edge of another element.
   */

  /**
   * @typedef {Object} Overlap
   * @property {Number} left
   * @property {Number} top
   * @property {Number} right
   * @property {Number} bottom
   */

  /**
   * @typedef {Object} PlaceOptions
   * @param {Array|Document|Element|Window|Rectangle} element
   * @property {Array|Document|Element|Window|Rectangle} target
   * @property {String} [position='left top left top']
   * @property {Number} [offsetX=0]
   * @property {Number} [offsetY=0]
   * @property {?Containment} [contain=null]
   */

  /**
   * All properties accepts the following values: "push", "forcepush" and "none".
   *
   * @typedef {Object} Containment
   * @property {?Array|Document|Element|Window|Rectangle} within
   * @property {?Collision|String} onCollision
   */

  /**
   * All properties accepts the following values: "push", "forcepush" and "none". The properties
   * left, right, top and bottom are used to define the collision action that should be called when
   * the positioned element overlaps the container element from the respective side. Alternatively
   * you can also use the properties x and y to define the collision action per axis. If you mix
   * side collision properties with axis collision properties remember that the side collision
   * overwrites the axis collision.
   *
   * @typedef {Object} Collision
   * @property {String} [left='none']
   * @property {String} [right='none']
   * @property {String} [top='none']
   * @property {String} [bottom='none']
   * @property {String} [x='none']
   * @property {String} [y='none']
   */

  /**
   * @typedef {Object} PlaceData
   * @property {Number} left
   *   - Target element's new left position.
   * @property {Number} top
   *   - Target element's new top position.
   */

  /**
    * Describe an element's vertical or horizontal placement relative to another element. For
    * example, if we wanted to place element's left side to the target's right side we would write:
    * "lr", which is short from  "left" and "right".
    * left   -> "l"
    * right  -> "r"
    * top    -> "t"
    * bottom -> "b"
    * center -> "c"
    *
    * @typedef {String} Placement
    */

  // Name and return the public methods.
  return {
    width: getWidth,
    height: getHeight,
    offset: getOffset,
    rect: getRect,
    containingBlock: getContainingBlock,
    distance: getDistance,
    intersection: getIntersectionMultiple,
    place: getPlace,
    _settings: settings
  };

}));
