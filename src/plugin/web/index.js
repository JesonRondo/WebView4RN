// 这个文件由脚本自动生成
// 如需重新生成，请执行 npm run build:plugin
import * as navigation_bar from 'plugin/web/src/navigation-bar';
import * as navigation from 'plugin/web/src/navigation';

export const invokePlugins = {
  install (context) {

    for (let key in navigation_bar) {
      const bindPluginFn = navigation_bar[key].bind(context);
      context.invoke.define(key, bindPluginFn);
    }
  

    for (let key in navigation) {
      const bindPluginFn = navigation[key].bind(context);
      context.invoke.define(key, bindPluginFn);
    }
  
  }
};

export default '!function(){"use strict";var n=function(n){if(Array.isArray(n)){for(var e=0,t=Array(n.length);e<n.length;e++)t[e]=n[e];return t}return Array.from(n)},e=function n(){var e=this;!function(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),this.promise=new Promise(function(n,t){e.resolve=n,e.reject=t})},t=0;var i=function(n){return n.command+"("+n.id+")"},r="RNWV:sync";var o="undefined"!=typeof window,a=function(o){var a,s=[],f=(a={send:[],receive:[],ready:[]},{addEventListener:function(n,e){if(n in a){var t=a[n];t.indexOf(e)<0&&t.push(e)}},removeEventListener:function(n,e){if(n in a){var t=a[n],i=t.indexOf(e);i>=0&&t.splice(i,1)}},emitEvent:function(n,e){n in a&&a[n].forEach(function(n){return n(e)})}}),c={},u={},d={};function v(n){return function(){for(var r=arguments.length,o=Array(r),a=0;a<r;a++)o[a]=arguments[a];return s={command:n,data:o,id:t++,reply:!1},f=new e,c[i(s)]=f,m(s),f.promise;var s,f}}function l(e,t){return u[e]=function(e){return t.apply(void 0,n(e))},!s&&h(),{define:l,bind:v}}function m(n){n.command!==r&&s?s.push(n):o(n),f.emitEvent("send",n)}function p(n,e){n.reply=!0,n.data=e,m(n)}var y=v(r);function g(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:[]).filter(function(n){return!(n in d)}).map(function(n){d[n]=v(n)}),function(){if(s){var n=s;s=null,n.forEach(function(n){m(n)}),f.emitEvent("ready")}}(),Object.keys(u)}function h(){y(Object.keys(u)).then(g)}return l(r,g),{bind:v,define:l,listener:function(n){if(n.reply){var e=i(n);c[e]&&c[e].resolve(n.data)}else if(u[n.command]){var t=u[n.command](n.data);t&&t.then?t.then(function(e){return p(n,e)}):p(n,t)}else p(n,null);f.emitEvent("receive",n)},ready:h,fn:d,addEventListener:f.addEventListener,removeEventListener:f.removeEventListener,isConnect:function(){return!s}}}(function(n){o&&window.postMessage(JSON.stringify(n))}),s=a.bind,f=a.define,c=a.listener,u=a.ready,d=a.fn,v=a.addEventListener,l=a.removeEventListener,m=a.isConnect;o&&function(){var n=window.originalPostMessage;if(n)u();else{var e={get:function(){return n},set:function(e){(n=e)&&setTimeout(u,50)}};Object.defineProperty(window,"originalPostMessage",e)}window.document.addEventListener("message",function(n){return c(JSON.parse(n.data))})}();var p={bind:s,define:f,fn:d,addEventListener:v,removeEventListener:l,isConnect:m};var y=Object.freeze({setNavigationBarTitle:function({title:n}){"string"==typeof n&&this.setState({title:n})}});var g=Object.freeze({navigateBack:function(){this.HPR.Navigation.pop(this.props.pageKey)}});const h={},E={};for(let n in y)E[n]=p.bind(n);Object.assign(h,E);const w={};for(let n in g)w[n]=p.bind(n);Object.assign(h,w),window.hpr=h}();';
