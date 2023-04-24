import{INCLUDE_SCROLLBAR}from"./utils/constants.js";import{isWindow}from"./utils/isWindow.js";import{isDocument}from"./utils/isDocument.js";import{getWindowWidth}from"./utils/getWindowWidth.js";import{getDocumentWidth}from"./utils/getDocumentWidth.js";import{getElementWidth}from"./utils/getElementWidth.js";export function getWidth(t,i="border"){return isWindow(t)?getWindowWidth(t,INCLUDE_SCROLLBAR[i]):isDocument(t)?getDocumentWidth(t,INCLUDE_SCROLLBAR[i]):getElementWidth(t,i)}