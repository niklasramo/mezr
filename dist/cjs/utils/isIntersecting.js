"use strict";function isIntersecting(t,e){return!(t.left+t.width<=e.left||e.left+e.width<=t.left||t.top+t.height<=e.top||e.top+e.height<=t.top)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.isIntersecting=void 0,exports.isIntersecting=isIntersecting;