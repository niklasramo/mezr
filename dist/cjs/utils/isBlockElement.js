"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.isBlockElement=void 0;const getStyle_js_1=require("./getStyle.js");function isBlockElement(e){switch((0,getStyle_js_1.getStyle)(e).display){case"none":return null;case"inline":case"contents":return!1;default:return!0}}exports.isBlockElement=isBlockElement;