export function isIntersecting(t,e){return!(t.left+t.width<=e.left||e.left+e.width<=t.left||t.top+t.height<=e.top||e.top+e.height<=t.top)}