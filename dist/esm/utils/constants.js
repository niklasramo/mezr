export const IS_BROWSER="undefined"!=typeof window&&void 0!==window.document;export const IS_SAFARI=!!(IS_BROWSER&&navigator.vendor&&navigator.vendor.indexOf("Apple")>-1&&navigator.userAgent&&-1==navigator.userAgent.indexOf("CriOS")&&-1==navigator.userAgent.indexOf("FxiOS"));export const BOX_AREA={content:"content",padding:"padding",scroll:"scroll",border:"border",margin:"margin"};export const INCLUDE_SCROLLBAR={[BOX_AREA.content]:!1,[BOX_AREA.padding]:!1,[BOX_AREA.scroll]:!0,[BOX_AREA.border]:!0,[BOX_AREA.margin]:!0};