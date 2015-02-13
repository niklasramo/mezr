/*!
 * Mezr v0.3.0-2
 * https://github.com/niklasramo/mezr
 * Copyright (c) 2015 Niklas Rämö <inramo@gmail.com>
 * Released under the MIT license
 * Date: 2015-01-27T22:31:43.642Z
 */

/**
 * @todo Sync docs with readme and automate JSDoc generation.
 * @todo Adopt CI system.
 * @todo Add to Bower.
 */

(function (win, undefined) {
  'use strict';

  var
  lib = 'mezr',
  doc = win.document,
  root = doc.documentElement,
  MATH = Math,
  ABS = MATH.abs,
  MAX = MATH.max,
  MIN = MATH.min,
  NULL = null;

  /**
   * Expose public and private methods to global scope. Private methods are prefixed with an
   * underscore and exposed in order to make it easier to extend the library's default functionality
   * and build third party plugins.
   */
  win[lib] = {
    width: getWidth,
    height: getHeight,
    offset: getOffset,
    offsetParent: getOffsetParent,
    distance: getDistance,
    overlap: checkOverlap,
    place: getPlace,
    _typeOf: typeOf,
    _toFloat: toFloat,
    _mergeObjects: mergeObjects,
    _getStyle: getStyle,
    _getRect: getRect,
    _getDimension: getDimension,
    _getOverlap: getOverlap,
    _getNorthwestOffset: getNorthwestOffset
  };

  /**
   * Check the type of an object. Returns type of any object in lowercase letters. If comparison
   * type is provided the function will compare the type directly and returns a boolean.
   *
   * @private
   * @param {object} obj
   * @param {string} [compareType]
   * @returns {string|boolean} Returns boolean if type is defined.
   */
  function typeOf(obj, compareType) {

    var type = typeof obj;
    type = type === 'object' ? ({}).toString.call(obj).split(' ')[1].replace(']', '').toLowerCase() : type;
    return compareType ? type === compareType : type;

  }

  /**
   * Customized parseFloat function which returns 0 instead of NaN.
   *
   * @private
   * @param {string|number} val
   * @returns {number}
   */
  function toFloat(val) {

    return parseFloat(val) || 0;

  }

  /**
   * Merge (deep) an array of objects into a new object.
   *
   * @private
   * @param {array} array
   * @returns {object}
   */
  function mergeObjects(array) {

    var
    obj = {},
    len = array.length,
    propName,
    propType,
    propVal,
    i;

    for (i = 0; i < len; i++) {
      for (propName in array[i]) {
        if (array[i].hasOwnProperty(propName)) {
          propVal = array[i][propName];
          propType = typeOf(propVal);
          obj[propName] = propType === 'object' ? mergeObjects([propVal]) :
                          propType === 'array'  ? propVal.slice() :
                                                  propVal;
        }
      }
    }

    return obj;

  }

  /**
   * Returns the computed value of an element's style property as a string.
   *
   * @private
   * @param {element} el
   * @param {string} style
   * @returns {string}
   */
  function getStyle(el, style) {

    return win.getComputedStyle(el, NULL).getPropertyValue(style);

  }

  /**
   * Returns an object containing the provided element's width, height and offset. If element is an
   * array the function uses the array's values as arguments for internal getWidth and getHeight
   * functions. Returns null if falsy parameter is provided. Although getWidth and getHeight have
   * the option to include margins in the dimension margins are never included because getOffset
   * function does not have the option to exclude offset from it's return value.
   *
   * @private
   * @param {element|array|object} el
   * @returns {?object} The return object has the following properties: left, top, width and height.
   */
  function getRect(el) {

    if (!el) {
      return NULL;
    }

    var
    type = typeOf(el),
    ret,
    dimArgs;

    if (type === 'object') {
      return el;
    }
    else {
      ret = {};
      dimArgs = type === 'array' ? el.slice(0, 4) : [el, el.self !== win.self && el !== doc, 1, 1];
      ret.width = getWidth.apply(NULL, dimArgs);
      ret.height = getHeight.apply(NULL, dimArgs);
      ret.offset = getOffset(el, !dimArgs[3], !dimArgs[2]);
      return ret;
    }

  }

  /**
   * Calculates how much element a overlaps element b from each side. Fetches element data using
   * internal getRect function.
   *
   * @private
   * @param {element|array|object} a
   * @param {element|array|object} b
   * @returns {object} The return object has the following properties: left, right, top and bottom.
   */
  function getOverlap(a, b) {

    a = getRect(a);
    b = getRect(b);

    return {
      left: a.offset.left - b.offset.left,
      right: (b.offset.left + b.width) - (a.offset.left + a.width),
      top: a.offset.top - b.offset.top,
      bottom: (b.offset.top + b.height) - (a.offset.top + a.height)
    };

  }

  /**
   * Returns an element's northwest offset which in this case means the element's
   * offset in a state where the element's left and top CSS properties are set to 0.
   *
   * @private
   * @param {element} el
   * @returns {object} The return object has the following properties: left and top.
   */
  function getNorthwestOffset(el) {

    var
    position = getStyle(el, 'position'),
    offset,
    left,
    right,
    top,
    bottom;

    if (position === 'relative') {

      /**
       * @todo In Chrome having top or bottom values applied to relatively positioned root has no effect whatsoever. Remeber to add a test case for this.
       */

      offset = getOffset(el);
      left = getStyle(el, 'left');
      right = getStyle(el, 'right');
      top = getStyle(el, 'top');
      bottom = getStyle(el, 'bottom');

      if (left !== 'auto' || right !== 'auto') {
        offset.left -= left === 'auto' ? -toFloat(right) : toFloat(left);
      }

      if (top !== 'auto' || bottom !== 'auto') {
        offset.top -= top === 'auto' ? -toFloat(bottom) : toFloat(top);
      }

    } else if (position === 'static') {

      offset = getOffset(el);

    } else {

      offset = getOffset(getOffsetParent(el) || doc, 1);

    }

    return offset;

  }

  /**
   * Returns the height/width of an element in pixels. The function also accepts the window object
   * (for obtaining the viewport dimensions) and the document object (for obtaining the dimensions
   * of the document) in place of element. Note that this function considers root element's
   * scrollbars as the document's and window's scrollbars also. Since the root element's
   * scrollbars are always stuck on the right/bottom edge of the window (even if you specify width
   * and/or height to root element) they are generally referred to as viewport scrollbars in the
   * docs. It's also good to keep in mind that while you can set all kind of CSS rules to the root
   * element there are many inconsistencies and quirks in the way browsers use them.
   *
   * @private
   * @param {string} dimension - Accepts "width" or "height".
   * @param {element} el - Accepts any DOM element, the document object and the window object.
   * @param {boolean} [includeScrollbar=false]
   * @param {boolean} [includePadding=false]
   * @param {boolean} [includeBorder=false]
   * @param {boolean} [includeMargin=false]
   * @returns {number}
   */
  function getDimension(dimension, el, includeScrollbar, includePadding, includeBorder, includeMargin) {

    var
    ret,
    isHeight = dimension === 'height',
    dimensionCapitalized = isHeight ? 'Height' : 'Width',
    innerDimension = 'inner' + dimensionCapitalized,
    clientDimension = 'client' + dimensionCapitalized,
    scrollDimension = 'scroll' + dimensionCapitalized,
    sbSize,
    edgeA,
    edgeB,
    borderA,
    borderB;

    if (el.self === win.self) {

      ret = includeScrollbar ? win[innerDimension] : root[clientDimension];

    }
    else if (el === doc) {

      if (includeScrollbar) {
        sbSize = win[innerDimension] - root[clientDimension];
        ret = MAX(root[scrollDimension] + sbSize, doc.body[scrollDimension] + sbSize, win[innerDimension]);
      } else {
        ret = MAX(root[scrollDimension], doc.body[scrollDimension], root[clientDimension]);
      }

    }
    else {

      ret = el.getBoundingClientRect()[dimension];
      edgeA = isHeight ? 'top' : 'left';
      edgeB = isHeight ? 'bottom' : 'right';

      if (!includeScrollbar) {
        if (el === root) {
          ret -= win[innerDimension] - root[clientDimension];
        }
        else {
          borderA = toFloat(getStyle(el, 'border-' + edgeA + '-width'));
          borderB = toFloat(getStyle(el, 'border-' + edgeB + '-width'));
          ret -= MATH.round(ret) - el[clientDimension] - borderA - borderB;
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
        ret += toFloat(getStyle(el, 'margin-' + edgeA));
        ret += toFloat(getStyle(el, 'margin-' + edgeB));
      }

    }

    return ret;

  }

  /**
   * Returns the width of an element in pixels. Accepts also the window object (for getting the
   * viewport width) and the document object (for getting the width of the whole document) in place
   * of element.
   *
   * @public
   * @alias mezr.width
   * @param {element} el - Accepts any DOM element, the document object and the window object.
   * @param {boolean} [includeScrollbar=false]
   * @param {boolean} [includePadding=false]
   * @param {boolean} [includeBorder=false]
   * @param {boolean} [includeMargin=false]
   * @returns {number}
   */
  function getWidth(el, includeScrollbar, includePadding, includeBorder, includeMargin) {

    return getDimension('width', el, includeScrollbar, includePadding, includeBorder, includeMargin);

  }

  /**
   * Returns the height of an element in pixels. Accepts also the window object (for getting the
   * viewport height) and the document object (for getting the height of the whole document) in
   * place of element.
   *
   * @public
   * @alias mezr.height
   * @param {element} el - Accepts any DOM element, the document object and the window object.
   * @param {boolean} [includeScrollbar=false]
   * @param {boolean} [includePadding=false]
   * @param {boolean} [includeBorder=false]
   * @param {boolean} [includeMargin=false]
   * @returns {number}
   */
  function getHeight(el, includeScrollbar, includePadding, includeBorder, includeMargin) {

    return getDimension('height', el, includeScrollbar, includePadding, includeBorder, includeMargin);

  }

  /**
   * Returns the element's offset, which in practice means the vertical and horizontal distance
   * between the element's northwest corner and the document's northwest corner. By default the
   * edge of the element's border is considered as the edge of the element, but you can make the
   * function include the element's border width and padding in the return value as well.
   *
   * @todo Support excluding margins.
   *
   * @public
   * @alias mezr.offset
   * @param {element} el
   * @param {boolean} [includeBorder=false]
   * @param {boolean} [includePadding=false]
   * @returns {object} The return object has the following properties: left and top.
   */
  function getOffset(el, includeBorder, includePadding) {

    var
    offsetLeft = 0,
    offsetTop = 0,
    viewportScrollLeft = toFloat(win.pageXOffset),
    viewportScrollTop = toFloat(win.pageYOffset),
    gbcr;

    /**
     * For window we just need to get viewport's scroll distance.
     */
    if (el.self === win.self) {

      offsetLeft = viewportScrollLeft;
      offsetTop = viewportScrollTop;

    }

    /**
     * For all elements except the document and window we can use the combination
     * of gbcr and viewport's scroll distance.
     */
    else if (el !== doc) {

      gbcr = el.getBoundingClientRect();
      offsetLeft += gbcr.left + viewportScrollLeft;
      offsetTop += gbcr.top + viewportScrollTop;

      /**
       * Include border width to the offset.
       */
      if (includeBorder) {
        offsetLeft += toFloat(getStyle(el, 'border-left-width'));
        offsetTop += toFloat(getStyle(el, 'border-top-width'));
      }

      /*
       * Include padding to the offset.
       */
      if (includePadding) {
        offsetLeft += toFloat(getStyle(el, 'padding-left'));
        offsetTop += toFloat(getStyle(el, 'padding-top'));
      }

    }

    return {
      left: offsetLeft,
      top: offsetTop
    };

  }

  /**
   * Returns the element's offset parent. This function works in the same manner as the native
   * elem.offsetParent method with a few tweaks and logic changes. The function accepts the window
   * object and the document object in addition to DOM elements. Document object is considered as
   * the base offset point against which the element/window offsets are compared to. This in turn
   * means that the document object does not have an offset parent and returns null if provided as
   * the element. Document is also considered as the window's offset parent. Window is considered as
   * the offset parent of all fixed elements. Root and body elements are treated equally with all
   * other DOM elements. For example body's offset parent is the root element if root element is
   * positioned, but if the root element is static the body's offset parent is the document object.
   *
   * @public
   * @alias mezr.offsetParent
   * @param {element} el
   * @returns {?element}
   */
  function getOffsetParent(el) {

    var
    body = doc.body,
    pos = 'style' in el && getStyle(el, 'position'),
    offsetParent = el === doc      ? NULL :
                   pos === 'fixed' ? win  :
                   el === body     ? root :
                   el === root     ? doc  :
                                     el.offsetParent || doc;

    while (offsetParent && 'style' in offsetParent && getStyle(offsetParent, 'position') === 'static') {
      offsetParent = offsetParent === body ? root : offsetParent.offsetParent || doc;
    }

    return offsetParent;

  }

  /**
   * Returns the distance between two offset coordinates. The return object has three properties:
   * 'left', 'top' and 'direct'. The 'left' and 'top' properties return values that need to be added
   * to the first coordinate in order to arrive at the second coordinate (e.g. coordFrom.left +
   * return.left = coordTo.left). The 'direct' property of the return object indicates the actual
   * distance between the two coordinates. Accepts direct offset as an object or alternatively an
   * array in which case the the offset is retrieved automatically using mezr.offset method with the
   * array's values as the function arguments. This function was originally intended to mimic
   * jQuery's position method, but evolved into a lower level utility function to provide more
   * control.
   *
   * @public
   * @alias mezr.distance
   * @param {array|object} coordFrom
   * @param {array|object} coordTo
   * @returns {object} The return object has the following properties: left, top and direct.
   */
  function getDistance(coordFrom, coordTo) {

    var ret = {};

    coordFrom = typeOf(coordFrom) === 'array' ? getOffset.apply(NULL, coordFrom) : coordFrom;
    coordTo = typeOf(coordTo) === 'array' ? getOffset.apply(NULL, coordTo) : coordTo;

    ret.left = coordTo.left - coordFrom.left;
    ret.top = coordTo.top - coordFrom.top;
    ret.direct = MATH.sqrt(MATH.pow(ret.left, 2) + MATH.pow(ret.top, 2));

    return ret;

  }

  /**
   * Check if an element overlaps with another element. The element data is fetched with internal
   * getRect function which means you can specify an element directly, use an array for more control
   * over paddings and borders (see arguments for mezr.width/height()) or just provide dimensions
   * and offset directly in an object. Returns a boolean by default, but optionally one can set the
   * returnIntersection flag to true and make the function return explicit intersection data.
   *
   * @public
   * @alias mezr.overlap
   * @param {element|array|object} a
   * @param {element|array|object} b
   * @param {boolean} [returnIntersection=false]
   * @returns {boolean|object} The return object has the following properties: width, height, offset (left/top) and coverage (a/b/total).
   */
  function checkOverlap(a, b, returnIntersection) {

    var
    aRect = getRect(a),
    bRect = getRect(b),
    overlap = getOverlap(aRect, bRect),
    intWidth = MAX(aRect.width + MIN(overlap.left, 0) + MIN(overlap.right, 0), 0),
    intHeight = MAX(aRect.height + MIN(overlap.top, 0) + MIN(overlap.bottom, 0), 0),
    hasIntersection = intWidth > 0 && intHeight > 0;

    /**
     * Return early, just a boolean, if intersection data is not required.
     */
    if (!returnIntersection) {
      return hasIntersection;
    }

    /**
     * Create indepth intersection data.
     */
    var
    intersection = {
      width: intWidth,
      height: intHeight,
      offset: {
        left: NULL,
        top: NULL
      },
      coverage: {
        a: 0,
        b: 0,
        total: 0
      }
    };

    /**
     * Calculate offsets and coverage if the elements have an intersection.
     */
    if (hasIntersection) {
      var intArea = intWidth * intHeight;
      intersection.offset.left = aRect.offset.left + ABS(MIN(overlap.left, 0));
      intersection.offset.top = aRect.offset.top + ABS(MIN(overlap.top, 0));
      intersection.coverage.a = (intArea / (aRect.width * aRect.height)) * 100;
      intersection.coverage.b = (intArea / (bRect.width * bRect.height)) * 100;
      intersection.coverage.total = intersection.coverage.a + intersection.coverage.b;
    }

    return intersection;

  }

  /**
   * Calculate an element's position (left/top CSS properties) when positioned relative to other
   * elements, window or the document. This method is especially helpful in scenarios where the
   * DOM tree is deeply nested and it's difficult to calculate an element's position using only CSS.
   * The API is heavily inspired by the jQuery UI's position method. There are a couple of things to
   * note though. The target element's margins affect the final position so please consider the
   * margins as an additional offset. When calculating the dimensions of elements (target/of/within)
   * the outer width/height (includes scrollbar, borders and padding) is used. For window and
   * document the scrollbar width/height is always omitted.
   *
   * @todo Make more compact.
   *
   * @public
   * @alias mezr.place
   * @param {element} el
   * @param {object} [options]
   * @param {string} [options.my='left top']
   * @param {string} [options.at='left top']
   * @param {element|array} [options.of=window]
   * @param {number} [options.offsetX=0]
   * @param {number} [options.offsetY=0]
   * @param {?element|array} [options.within=null]
   * @param {?object} [options.collision]
   * @param {string} [options.collision.left='push']
   * @param {string} [options.collision.right='push']
   * @param {string} [options.collision.top='push']
   * @param {string} [options.collision.bottom='push']
   * @returns {object} The return object has the following properties: left, top, overlap, element, target and container.
   */
  function getPlace(el, options) {

    var
    o = getPlace._getOptions(el, options),
    collision = o.collision,
    e = getRect(el),
    t = getRect(o.of),
    c = getRect(o.within),
    eNwOffset = getNorthwestOffset(el),
    ret = {
      overlap: NULL,
      element: e,
      target: t,
      container: c
    };

    /**
     * Calculate element's new position (left/top coordinates).
     */
    ret.left = getPlace._getPosition(o.my[0] + o.at[0], t.width, t.offset.left, e.width, eNwOffset.left, o.offsetX);
    ret.top = getPlace._getPosition(o.my[1] + o.at[1], t.height, t.offset.top, e.height, eNwOffset.top, o.offsetY);

    /**
     * Update element offset data to match the newly calculated position.
     */
    e.offset.left = ret.left + eNwOffset.left;
    e.offset.top = ret.left + eNwOffset.top;

    /**
     * If container is defined, let's add overlap data and handle collisions.
     */
    if (c !== NULL) {
      ret.overlap = getOverlap(e, c);
      if (collision) {
        ret.left += getPlace._handleCollision(collision, ret.overlap);
        ret.top += getPlace._handleCollision(collision, ret.overlap, 1);
        e.offset.left = ret.left + eNwOffset.left;
        e.offset.top = ret.left + eNwOffset.top;
        ret.overlap = getOverlap(e, c);
      }
    }

    return ret;

  }

  /**
   * Merges default options with the instance options and also sanitizes the new options.
   *
   * @private
   * @param {element} el
   * @param {object} [options]
   * @returns {object}
   */
  getPlace._getOptions = function (el, options) {

    var
    defaults = getPlace.defaults,
    optName,
    optType,
    optVal;

    /**
     * Merge user options with default options.
     */
    options = mergeObjects(typeOf(options, 'object') ? [defaults, options] : [defaults]);

    for (optName in options) {

      optVal = options[optName];
      optType = typeOf(optVal);

      /**
       * If option is declared as a function let's execute it right here.
       */
      if (optType === 'function') {
        options[optName] = optVal(el);
      }

      /**
       * Transform my and at positions into an array using the first character of the position's
       * name. For example, "center top" becomes ["c", "t"].
       */
      if (optName === 'my' || optName === 'at') {
        optVal = optVal.split(' ');
        optVal[0] = optVal[0].charAt(0);
        optVal[1] = optVal[1].charAt(0);
        options[optName] = optVal;
      }

      /**
       * Make sure offsets are numbers.
       */
      if (optName === 'offsetX' || optName === 'offsetY') {
        options[optName] = toFloat(optVal);
      }

      /**
       * Make sure collision is an object or null.
       */
      if (optName === 'collision' && optType !== 'object') {
        options[optName] = NULL;
      }

    }

    return options;

  };

  /**
   * Returns the horizontal or vertical base position of the element.
   *
   * @param {string} pos The position in the format elementX + targetX (e.g. "lr") or elementY + targetY (e.g. "tb").
   * @param {number} tSize Target's width or height in pixels.
   * @param {number} tOffset Target's left or top offset in pixels.
   * @param {number} eSize Element's width or height in pixels.
   * @param {number} eNwOffset Element's left or top northwest offset in pixels.
   * @param {number} extraOffset Additional left or top offset in pixels.
   * @returns {number}
   */
  getPlace._getPosition = function (pos, tSize, tOffset, eSize, eNwOffset, extraOffset) {

    var northwestPoint = tOffset + extraOffset - eNwOffset;

    return pos === 'll' || pos === 'tt' ? northwestPoint :
           pos === 'lc' || pos === 'tc' ? northwestPoint + (tSize / 2) :
           pos === 'lr' || pos === 'tb' ? northwestPoint + tSize :
           pos === 'cl' || pos === 'ct' ? northwestPoint - (eSize / 2) :
           pos === 'cr' || pos === 'cb' ? northwestPoint + tSize - (eSize / 2) :
           pos === 'rl' || pos === 'bt' ? northwestPoint - eSize :
           pos === 'rc' || pos === 'bc' ? northwestPoint - eSize + (tSize / 2) :
           pos === 'rr' || pos === 'bb' ? northwestPoint - eSize + tSize :
                                          northwestPoint + (tSize / 2) - (eSize / 2);

  };

  /**
   * Calculates the distance in pixels that the target element needs to be moved in order to be
   * aligned correctly if the target element overlaps with the container.
   *
   * @private
   * @param {object} collision
   * @param {object} elementOverlap
   * @param {boolean} vertical
   * @returns {number}
   */
  getPlace._handleCollision = function (collision, elementOverlap, vertical) {

    var
    ret = 0,
    push = 'push',
    forcePush = 'forcePush',
    side1 = vertical ? 'top' : 'left',
    side2 = vertical ? 'bottom' : 'right',
    side1Collision = collision[side1],
    side2Collision = collision[side2],
    side1Overlap = elementOverlap[side1],
    side2Overlap = elementOverlap[side2],
    sizeDifference = side1Overlap + side2Overlap;

    /**
     * If pushing is needed from both sides.
     */
    if ((side1Collision === push || side1Collision === forcePush) && (side2Collision === push || side2Collision === forcePush) && (side1Overlap < 0 || side2Overlap < 0)) {

      /**
       * Do push correction from opposite sides with equal force.
       */
      if (side1Overlap < side2Overlap) {
        ret -= sizeDifference < 0 ? side1Overlap + ABS(sizeDifference / 2) : side1Overlap;
      }
      if (side2Overlap < side1Overlap) {
        ret += sizeDifference < 0 ? side2Overlap + ABS(sizeDifference / 2) : side2Overlap;
      }

      /**
       * Update overlap data.
       */
      side1Overlap += ret;
      side2Overlap -= ret;

      /**
       * Check if left/top side forced push correction is needed.
       */
      if (side1Collision === forcePush && side2Collision != forcePush && side1Overlap < 0) {
        ret -= side1Overlap;
      }

      /**
       * Check if right/top side forced push correction is needed.
       */
      if (side2Collision === forcePush && side1Collision != forcePush && side2Overlap < 0) {
        ret += side2Overlap;
      }

    }

    /**
     * Check if pushing is needed from left or top side only.
     */
    else if ((side1Collision === forcePush || side1Collision === push) && side1Overlap < 0) {
      ret -= side1Overlap;
    }

    /**
     * Check if pushing is needed from right or bottom side only.
     */
    else if ((side2Collision === forcePush || side2Collision === push) && side2Overlap < 0) {
      ret += side2Overlap;
    }

    return ret;

  };

  /**
   * Default options for getPlace.
   */
  getPlace.defaults = {
    my: 'left top',
    at: 'left top',
    of: win,
    within: NULL,
    offsetX: 0,
    offsetY: 0,
    collision: {
      left: 'push',
      right: 'push',
      top: 'push',
      bottom: 'push'
    }
  };

})(this);
