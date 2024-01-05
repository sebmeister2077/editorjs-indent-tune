!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.IndentPlugin=e():t.IndentPlugin=e()}(self,(()=>(()=>{"use strict";var t={424:(t,e,n)=>{n.d(e,{Z:()=>i});var o=n(645),r=n.n(o)()((function(t){return t[1]}));r.push([t.id,".ce-popover-item-custom:hover {\r\n    background-color: transparent !important;\r\n}\r\n\r\n.ce-popover-item-custom .ce-popover-item__icon {\r\n    will-change: background-color;\r\n    transition: 0.3s background-color;\r\n    padding-block: 0px;\r\n    padding-inline: 0px;\r\n    border-width: 0px;\r\n    color: var(--color-text-primary, black);\r\n}\r\n.ce-popover-item-custom .ce-popover-item__icon:focus {\r\n    outline: none;\r\n}\r\n\r\n.ce-popover-item-custom:hover .ce-popover-item__icon {\r\n    box-shadow: 0 0 0 1px var(--color-border-icon, rgba(201, 201, 204, 0.48)) !important;\r\n    -webkit-box-shadow: 0 0 0 1px var(--color-border-icon, rgba(201, 201, 204, 0.48)) !important;\r\n}\r\n\r\n.ce-popover-item-custom .ce-popover-item__icon:hover {\r\n    background-color: var(--color-background-item-hover, #eff2f5);\r\n}\r\n",""]);const i=r},645:t=>{t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=t(e);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n})).join("")},e.i=function(t,n,o){"string"==typeof t&&(t=[[null,t,""]]);var r={};if(o)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(r[a]=!0)}for(var c=0;c<t.length;c++){var l=[].concat(t[c]);o&&r[l[0]]||(n&&(l[2]?l[2]="".concat(n," and ").concat(l[2]):l[2]=n),e.push(l))}},e}},548:(t,e,n)=>{var o=n(379),r=n.n(o),i=n(424);r()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},379:(t,e,n)=>{var o,r=function(){var t={};return function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(t){n=null}t[e]=n}return t[e]}}(),i=[];function a(t){for(var e=-1,n=0;n<i.length;n++)if(i[n].identifier===t){e=n;break}return e}function c(t,e){for(var n={},o=[],r=0;r<t.length;r++){var c=t[r],l=e.base?c[0]+e.base:c[0],s=n[l]||0,u="".concat(l," ").concat(s);n[l]=s+1;var d=a(u),p={css:c[1],media:c[2],sourceMap:c[3]};-1!==d?(i[d].references++,i[d].updater(p)):i.push({identifier:u,updater:h(p,e),references:1}),o.push(u)}return o}function l(t){var e=document.createElement("style"),o=t.attributes||{};if(void 0===o.nonce){var i=n.nc;i&&(o.nonce=i)}if(Object.keys(o).forEach((function(t){e.setAttribute(t,o[t])})),"function"==typeof t.insert)t.insert(e);else{var a=r(t.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(e)}return e}var s,u=(s=[],function(t,e){return s[t]=e,s.filter(Boolean).join("\n")});function d(t,e,n,o){var r=n?"":o.media?"@media ".concat(o.media," {").concat(o.css,"}"):o.css;if(t.styleSheet)t.styleSheet.cssText=u(e,r);else{var i=document.createTextNode(r),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i)}}function p(t,e,n){var o=n.css,r=n.media,i=n.sourceMap;if(r?t.setAttribute("media",r):t.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),t.styleSheet)t.styleSheet.cssText=o;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(o))}}var f=null,v=0;function h(t,e){var n,o,r;if(e.singleton){var i=v++;n=f||(f=l(e)),o=d.bind(null,n,i,!1),r=d.bind(null,n,i,!0)}else n=l(e),o=p.bind(null,n,e),r=function(){!function(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t)}(n)};return o(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;o(t=e)}else r()}}t.exports=function(t,e){(e=e||{}).singleton||"boolean"==typeof e.singleton||(e.singleton=(void 0===o&&(o=Boolean(window&&document&&document.all&&!window.atob)),o));var n=c(t=t||[],e);return function(t){if(t=t||[],"[object Array]"===Object.prototype.toString.call(t)){for(var o=0;o<n.length;o++){var r=a(n[o]);i[r].references--}for(var l=c(t,e),s=0;s<n.length;s++){var u=a(n[s]);0===i[u].references&&(i[u].updater(),i.splice(u,1))}n=l}}}}},e={};function n(o){var r=e[o];if(void 0!==r)return r.exports;var i=e[o]={id:o,exports:{}};return t[o](i,i.exports,n),i.exports}n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var o in e)n.o(e,o)&&!n.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.nc=void 0;var o={};return(()=>{n.d(o,{default:()=>a});var t='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"\n    style="transform:rotateZ(0.25turn)">\n    <path stroke="currentColor" stroke-linecap="round" stroke-width="2"\n        d="M7 15L11.8586 10.1414C11.9367 10.0633 12.0633 10.0633 12.1414 10.1414L17 15"></path>\n</svg>',e='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"\n    style="transform:rotateZ(-0.25turn)">\n    <path stroke="currentColor" stroke-linecap="round" stroke-width="2"\n        d="M7 15L11.8586 10.1414C11.9367 10.0633 12.0633 10.0633 12.1414 10.1414L17 15"></path>\n</svg>',r=function(){return r=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var r in e=arguments[n])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t},r.apply(this,arguments)},i="data-block-indent-wrapper";n(548).toString();const a=function(){function n(t){var e,n,o=t.api,i=t.data,a=t.config,c=t.block;this.wrapper=null,this.api=o,this.block=c,this.config=r(r({},{indentSize:24,maxIndent:8,minIndent:0,multiblock:!1,tuneName:null,orientation:"horizontal",customBlockIndentLimits:{}}),null!=a?a:{});var l=null!==(n=null===(e=this.config.customBlockIndentLimits[this.block.name])||void 0===e?void 0:e.min)&&void 0!==n?n:this.config.minIndent;this.data=r({indentLevel:l},null!=i?i:{}),this.config.multiblock&&!this.config.tuneName&&console.error("IndentTune config 'tuneName' was not provided, this is required for multiblock option to work.")}return Object.defineProperty(n,"isTune",{get:function(){return!0},enumerable:!1,configurable:!0}),n.prototype.render=function(){var n,o,r=this;if(setTimeout((function(){var t,e;r.data.indentLevel==r.config.maxIndent&&(null===(t=r.getTuneButton("indent"))||void 0===t||t.classList.add(r.CSS.disabledItem)),0==r.data.indentLevel&&(null===(e=r.getTuneButton("unindent"))||void 0===e||e.classList.add(r.CSS.disabledItem))}),0),"vertical"===this.config.orientation)return[{title:"Indent",onActivate:function(t,e){return r.indentBlock()},icon:t,name:"".concat(this.TuneNames.indent,"-").concat(this.block.id)},{title:"Un indent",onActivate:function(t,e){return r.unIndentBlock()},icon:e,name:"".concat(this.TuneNames.unindent,"-").concat(this.block.id)}];var i='\n\t\t\t<div class="'.concat(this.CSS.popoverItem," ").concat(this.CSS.customPopoverItem,"\" data-item-name='indent'>\n\t\t\t\t<button class=\"").concat(this.CSS.popoverItemIcon,'" data-unindent>').concat(e,'</button>\n\t\t\t\t<div class="').concat(this.CSS.popoverItemTitle,'">Indent</div>\n\t\t\t\t<button class="').concat(this.CSS.popoverItemIcon,'" data-indent style="margin-left:10px;">').concat(t,"</button>\n\t\t\t</div>\n\t\t"),a=(new DOMParser).parseFromString(i,"text/html").body.firstChild;return null===(n=a.querySelector("[data-indent]"))||void 0===n||n.addEventListener("click",(function(){return r.indentBlock()})),null===(o=a.querySelector("[data-unindent]"))||void 0===o||o.addEventListener("click",(function(){return r.unIndentBlock()})),a},n.prototype.wrap=function(t){var e=this;return this.wrapper=document.createElement("div"),this.wrapper.appendChild(t),this.wrapper.setAttribute(i,""),this.wrapper.style.paddingLeft="".concat(this.data.indentLevel*this.config.indentSize,"px"),this.wrapper.addEventListener("keydown",(function(t){if("Tab"===t.key){t.stopPropagation(),t.preventDefault();var n=!t.shiftKey,o=e.getGlobalSelectedBlocks();if(!e.config.multiblock||o.length<2)return n?e.indentBlock():e.unIndentBlock(),void e.block.dispatchChange();Boolean(e.config.tuneName)?o.forEach((function(t){return o=e,r=void 0,a=function(){var e,o,r,i,a,c;return function(t,e){var n,o,r,i,a={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(c){return function(l){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;i&&(i=0,c[0]&&(a=0)),a;)try{if(n=1,o&&(r=2&c[0]?o.return:c[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,c[1])).done)return r;switch(o=0,r&&(c=[2&c[0],r.value]),c[0]){case 0:case 1:r=c;break;case 4:return a.label++,{value:c[1],done:!1};case 5:a.label++,o=c[1],c=[0];continue;case 7:c=a.ops.pop(),a.trys.pop();continue;default:if(!((r=(r=a.trys).length>0&&r[r.length-1])||6!==c[0]&&2!==c[0])){a=0;continue}if(3===c[0]&&(!r||c[1]>r[0]&&c[1]<r[3])){a.label=c[1];break}if(6===c[0]&&a.label<r[1]){a.label=r[1],r=c;break}if(r&&a.label<r[2]){a.label=r[2],a.ops.push(c);break}r[2]&&a.ops.pop(),a.trys.pop();continue}c=e.call(t,a)}catch(t){c=[6,t],o=0}finally{n=r=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,l])}}}(this,(function(l){switch(l.label){case 0:return[4,t.save()];case 1:return(e=l.sent())?(o=null===(i=e.tunes)||void 0===i?void 0:i[this.config.tuneName],console.assert(Boolean(o),"'tuneName' is invalid, no tune was found for block ".concat(t.name)),o.indentLevel=n?Math.min(this.config.maxIndent,(null!==(a=o.indentLevel)&&void 0!==a?a:0)+1):Math.max(0,(null!==(c=o.indentLevel)&&void 0!==c?c:0)-1),t.dispatchChange(),(r=this.getWrapperBlockById(t.id))instanceof HTMLElement&&this.applyStylesToWrapper(r,o.indentLevel),[2]):[2]}}))},new((i=void 0)||(i=Promise))((function(t,e){function n(t){try{l(a.next(t))}catch(t){e(t)}}function c(t){try{l(a.throw(t))}catch(t){e(t)}}function l(e){var o;e.done?t(e.value):(o=e.value,o instanceof i?o:new i((function(t){t(o)}))).then(n,c)}l((a=a.apply(o,r||[])).next())}));var o,r,i,a})):console.error("'tuneName' is empty.")}}),{capture:!0}),this.wrapper},n.prototype.save=function(){return this.data},Object.defineProperty(n.prototype,"CSS",{get:function(){return{customPopoverItem:" ce-popover-item-custom",popoverItem:"ce-popover-item",popoverItemIcon:"ce-popover-item__icon",popoverItemTitle:"ce-popover-item__title",disabledItem:"ce-popover-item--disabled"}},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"TuneNames",{get:function(){return{indent:"tune-indent",unindent:"tune-unindent"}},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"customInterval",{get:function(){return this.config.customBlockIndentLimits[this.block.name]},enumerable:!1,configurable:!0}),n.prototype.indentBlock=function(){var t,e,n;this.wrapper&&(this.data.indentLevel=Math.min(this.data.indentLevel+1,null!==(t=this.customInterval.max)&&void 0!==t?t:this.config.maxIndent),this.applyStylesToWrapper(this.wrapper,this.data.indentLevel),null===(e=this.getTuneButton("unindent"))||void 0===e||e.classList.remove(this.CSS.disabledItem),this.data.indentLevel==this.config.maxIndent&&(null===(n=this.getTuneButton("indent"))||void 0===n||n.classList.add(this.CSS.disabledItem)))},n.prototype.unIndentBlock=function(){var t,e,n;this.wrapper&&(this.data.indentLevel=Math.max(this.data.indentLevel-1,null!==(t=this.customInterval.min)&&void 0!==t?t:this.config.minIndent),this.applyStylesToWrapper(this.wrapper,this.data.indentLevel),null===(e=this.getTuneButton("indent"))||void 0===e||e.classList.remove(this.CSS.disabledItem),0==this.data.indentLevel&&(null===(n=this.getTuneButton("unindent"))||void 0===n||n.classList.add(this.CSS.disabledItem)))},n.prototype.getTuneButton=function(t){return"vertical"===this.config.orientation?this.getTuneByName("".concat(this.TuneNames[t],"[data-item-name=").concat(this.block.id,"]")):document.querySelector(".".concat(this.CSS.popoverItemIcon,"[data-").concat(t,"]"))},n.prototype.getTuneByName=function(t){return document.querySelector(".".concat(this.CSS.popoverItem,"[data-item-name=").concat(t,"]"))},n.prototype.applyStylesToWrapper=function(t,e){t.style.paddingLeft="".concat(e*this.config.indentSize,"px")},n.prototype.getGlobalSelectedBlocks=function(){var t=this;return new Array(this.api.blocks.getBlocksCount()).fill(0).map((function(e,n){return t.api.blocks.getBlockByIndex(n)})).filter((function(t){return!!(null==t?void 0:t.selected)}))},n.prototype.getWrapperBlockById=function(t){return document.querySelector('.ce-block[data-id="'.concat(t,'"] [').concat(i,"]"))},n}()})(),o.default})()));