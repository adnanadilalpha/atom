var AtomApp=(()=>{var Oe=Object.defineProperty;var kt=Object.getOwnPropertyDescriptor;var Ct=Object.getOwnPropertyNames;var Tt=Object.prototype.hasOwnProperty;var St=(t,e)=>()=>(t&&(e=t(t=0)),e);var rt=(t,e)=>{for(var c in e)Oe(t,c,{get:e[c],enumerable:!0})},At=(t,e,c,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let l of Ct(e))!Tt.call(t,l)&&l!==c&&Oe(t,l,{get:()=>e[l],enumerable:!(i=kt(e,l))||i.enumerable});return t};var _t=t=>At(Oe({},"__esModule",{value:!0}),t);var nt={};rt(nt,{create:()=>Mt,default:()=>he});var ze,he,Mt,Fe=St(()=>{ze={};(function t(e,c,i,l){var a=!!(e.Worker&&e.Blob&&e.Promise&&e.OffscreenCanvas&&e.OffscreenCanvasRenderingContext2D&&e.HTMLCanvasElement&&e.HTMLCanvasElement.prototype.transferControlToOffscreen&&e.URL&&e.URL.createObjectURL),u=typeof Path2D=="function"&&typeof DOMMatrix=="function",g=(function(){if(!e.OffscreenCanvas)return!1;try{var r=new OffscreenCanvas(1,1),o=r.getContext("2d");o.fillRect(0,0,1,1);var p=r.transferToImageBitmap();o.createPattern(p,"no-repeat")}catch{return!1}return!0})();function s(){}function f(r){var o=c.exports.Promise,p=o!==void 0?o:e.Promise;return typeof p=="function"?new p(r):(r(s,s),null)}var d=(function(r,o){return{transform:function(p){if(r)return p;if(o.has(p))return o.get(p);var w=new OffscreenCanvas(p.width,p.height),v=w.getContext("2d");return v.drawImage(p,0,0),o.set(p,w),w},clear:function(){o.clear()}}})(g,new Map),b=(function(){var r=Math.floor(16.666666666666668),o,p,w={},v=0;return typeof requestAnimationFrame=="function"&&typeof cancelAnimationFrame=="function"?(o=function(y){var N=Math.random();return w[N]=requestAnimationFrame(function x(k){v===k||v+r-1<k?(v=k,delete w[N],y()):w[N]=requestAnimationFrame(x)}),N},p=function(y){w[y]&&cancelAnimationFrame(w[y])}):(o=function(y){return setTimeout(y,r)},p=function(y){return clearTimeout(y)}),{frame:o,cancel:p}})(),m=(function(){var r,o,p={};function w(v){function y(N,x){v.postMessage({options:N||{},callback:x})}v.init=function(x){var k=x.transferControlToOffscreen();v.postMessage({canvas:k},[k])},v.fire=function(x,k,R){if(o)return y(x,null),o;var $=Math.random().toString(36).slice(2);return o=f(function(j){function O(D){D.data.callback===$&&(delete p[$],v.removeEventListener("message",O),o=null,d.clear(),R(),j())}v.addEventListener("message",O),y(x,$),p[$]=O.bind(null,{data:{callback:$}})}),o},v.reset=function(){v.postMessage({reset:!0});for(var x in p)p[x](),delete p[x]}}return function(){if(r)return r;if(!i&&a){var v=["var CONFETTI, SIZE = {}, module = {};","("+t.toString()+")(this, module, true, SIZE);","onmessage = function(msg) {","  if (msg.data.options) {","    CONFETTI(msg.data.options).then(function () {","      if (msg.data.callback) {","        postMessage({ callback: msg.data.callback });","      }","    });","  } else if (msg.data.reset) {","    CONFETTI && CONFETTI.reset();","  } else if (msg.data.resize) {","    SIZE.width = msg.data.resize.width;","    SIZE.height = msg.data.resize.height;","  } else if (msg.data.canvas) {","    SIZE.width = msg.data.canvas.width;","    SIZE.height = msg.data.canvas.height;","    CONFETTI = module.exports.create(msg.data.canvas);","  }","}"].join(`
`);try{r=new Worker(URL.createObjectURL(new Blob([v])))}catch(y){return typeof console<"u"&&typeof console.warn=="function"&&console.warn("\u{1F38A} Could not load worker",y),null}w(r)}return r}})(),I={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:["square","circle"],zIndex:100,colors:["#26ccff","#a25afd","#ff5e7e","#88ff5a","#fcff42","#ffa62d","#ff36ff"],disableForReducedMotion:!1,scalar:1};function L(r,o){return o?o(r):r}function z(r){return r!=null}function T(r,o,p){return L(r&&z(r[o])?r[o]:I[o],p)}function E(r){return r<0?0:Math.floor(r)}function C(r,o){return Math.floor(Math.random()*(o-r))+r}function W(r){return parseInt(r,16)}function je(r){return r.map(ve)}function ve(r){var o=String(r).replace(/[^0-9a-f]/gi,"");return o.length<6&&(o=o[0]+o[0]+o[1]+o[1]+o[2]+o[2]),{r:W(o.substring(0,2)),g:W(o.substring(2,4)),b:W(o.substring(4,6))}}function Ie(r){var o=T(r,"origin",Object);return o.x=T(o,"x",Number),o.y=T(o,"y",Number),o}function Ne(r){r.width=document.documentElement.clientWidth,r.height=document.documentElement.clientHeight}function ke(r){var o=r.getBoundingClientRect();r.width=o.width,r.height=o.height}function Ce(r){var o=document.createElement("canvas");return o.style.position="fixed",o.style.top="0px",o.style.left="0px",o.style.pointerEvents="none",o.style.zIndex=r,o}function Te(r,o,p,w,v,y,N,x,k){r.save(),r.translate(o,p),r.rotate(y),r.scale(w,v),r.arc(0,0,1,N,x,k),r.restore()}function Se(r){var o=r.angle*(Math.PI/180),p=r.spread*(Math.PI/180);return{x:r.x,y:r.y,wobble:Math.random()*10,wobbleSpeed:Math.min(.11,Math.random()*.1+.05),velocity:r.startVelocity*.5+Math.random()*r.startVelocity,angle2D:-o+(.5*p-Math.random()*p),tiltAngle:(Math.random()*(.75-.25)+.25)*Math.PI,color:r.color,shape:r.shape,tick:0,totalTicks:r.ticks,decay:r.decay,drift:r.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:r.gravity*3,ovalScalar:.6,scalar:r.scalar,flat:r.flat}}function Ae(r,o){o.x+=Math.cos(o.angle2D)*o.velocity+o.drift,o.y+=Math.sin(o.angle2D)*o.velocity+o.gravity,o.velocity*=o.decay,o.flat?(o.wobble=0,o.wobbleX=o.x+10*o.scalar,o.wobbleY=o.y+10*o.scalar,o.tiltSin=0,o.tiltCos=0,o.random=1):(o.wobble+=o.wobbleSpeed,o.wobbleX=o.x+10*o.scalar*Math.cos(o.wobble),o.wobbleY=o.y+10*o.scalar*Math.sin(o.wobble),o.tiltAngle+=.1,o.tiltSin=Math.sin(o.tiltAngle),o.tiltCos=Math.cos(o.tiltAngle),o.random=Math.random()+2);var p=o.tick++/o.totalTicks,w=o.x+o.random*o.tiltCos,v=o.y+o.random*o.tiltSin,y=o.wobbleX+o.random*o.tiltCos,N=o.wobbleY+o.random*o.tiltSin;if(r.fillStyle="rgba("+o.color.r+", "+o.color.g+", "+o.color.b+", "+(1-p)+")",r.beginPath(),u&&o.shape.type==="path"&&typeof o.shape.path=="string"&&Array.isArray(o.shape.matrix))r.fill(Me(o.shape.path,o.shape.matrix,o.x,o.y,Math.abs(y-w)*.1,Math.abs(N-v)*.1,Math.PI/10*o.wobble));else if(o.shape.type==="bitmap"){var x=Math.PI/10*o.wobble,k=Math.abs(y-w)*.1,R=Math.abs(N-v)*.1,$=o.shape.bitmap.width*o.scalar,j=o.shape.bitmap.height*o.scalar,O=new DOMMatrix([Math.cos(x)*k,Math.sin(x)*k,-Math.sin(x)*R,Math.cos(x)*R,o.x,o.y]);O.multiplySelf(new DOMMatrix(o.shape.matrix));var D=r.createPattern(d.transform(o.shape.bitmap),"no-repeat");D.setTransform(O),r.globalAlpha=1-p,r.fillStyle=D,r.fillRect(o.x-$/2,o.y-j/2,$,j),r.globalAlpha=1}else if(o.shape==="circle")r.ellipse?r.ellipse(o.x,o.y,Math.abs(y-w)*o.ovalScalar,Math.abs(N-v)*o.ovalScalar,Math.PI/10*o.wobble,0,2*Math.PI):Te(r,o.x,o.y,Math.abs(y-w)*o.ovalScalar,Math.abs(N-v)*o.ovalScalar,Math.PI/10*o.wobble,0,2*Math.PI);else if(o.shape==="star")for(var A=Math.PI/2*3,V=4*o.scalar,J=8*o.scalar,Z=o.x,Y=o.y,se=5,Q=Math.PI/se;se--;)Z=o.x+Math.cos(A)*J,Y=o.y+Math.sin(A)*J,r.lineTo(Z,Y),A+=Q,Z=o.x+Math.cos(A)*V,Y=o.y+Math.sin(A)*V,r.lineTo(Z,Y),A+=Q;else r.moveTo(Math.floor(o.x),Math.floor(o.y)),r.lineTo(Math.floor(o.wobbleX),Math.floor(v)),r.lineTo(Math.floor(y),Math.floor(N)),r.lineTo(Math.floor(w),Math.floor(o.wobbleY));return r.closePath(),r.fill(),o.tick<o.totalTicks}function _e(r,o,p,w,v){var y=o.slice(),N=r.getContext("2d"),x,k,R=f(function($){function j(){x=k=null,N.clearRect(0,0,w.width,w.height),d.clear(),v(),$()}function O(){i&&!(w.width===l.width&&w.height===l.height)&&(w.width=r.width=l.width,w.height=r.height=l.height),!w.width&&!w.height&&(p(r),w.width=r.width,w.height=r.height),N.clearRect(0,0,w.width,w.height),y=y.filter(function(D){return Ae(N,D)}),y.length?x=b.frame(O):j()}x=b.frame(O),k=j});return{addFettis:function($){return y=y.concat($),R},canvas:r,promise:R,reset:function(){x&&b.cancel(x),k&&k()}}}function ge(r,o){var p=!r,w=!!T(o||{},"resize"),v=!1,y=T(o,"disableForReducedMotion",Boolean),N=a&&!!T(o||{},"useWorker"),x=N?m():null,k=p?Ne:ke,R=r&&x?!!r.__confetti_initialized:!1,$=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion)").matches,j;function O(A,V,J){for(var Z=T(A,"particleCount",E),Y=T(A,"angle",Number),se=T(A,"spread",Number),Q=T(A,"startVelocity",Number),ft=T(A,"decay",Number),bt=T(A,"gravity",Number),pt=T(A,"drift",Number),Ye=T(A,"colors",je),wt=T(A,"ticks",Number),Ke=T(A,"shapes"),xt=T(A,"scalar"),yt=!!T(A,"flat"),et=Ie(A),tt=Z,$e=[],vt=r.width*et.x,Nt=r.height*et.y;tt--;)$e.push(Se({x:vt,y:Nt,angle:Y,spread:se,startVelocity:Q,color:Ye[tt%Ye.length],shape:Ke[C(0,Ke.length)],ticks:wt,decay:ft,gravity:bt,drift:pt,scalar:xt,flat:yt}));return j?j.addFettis($e):(j=_e(r,$e,k,V,J),j.promise)}function D(A){var V=y||T(A,"disableForReducedMotion",Boolean),J=T(A,"zIndex",Number);if(V&&$)return f(function(Q){Q()});p&&j?r=j.canvas:p&&!r&&(r=Ce(J),document.body.appendChild(r)),w&&!R&&k(r);var Z={width:r.width,height:r.height};x&&!R&&x.init(r),R=!0,x&&(r.__confetti_initialized=!0);function Y(){if(x){var Q={getBoundingClientRect:function(){if(!p)return r.getBoundingClientRect()}};k(Q),x.postMessage({resize:{width:Q.width,height:Q.height}});return}Z.width=Z.height=null}function se(){j=null,w&&(v=!1,e.removeEventListener("resize",Y)),p&&r&&(document.body.contains(r)&&document.body.removeChild(r),r=null,R=!1)}return w&&!v&&(v=!0,e.addEventListener("resize",Y,!1)),x?x.fire(A,Z,se):O(A,Z,se)}return D.reset=function(){x&&x.reset(),j&&j.reset()},D}var ae;function oe(){return ae||(ae=ge(null,{useWorker:!0,resize:!0})),ae}function Me(r,o,p,w,v,y,N){var x=new Path2D(r),k=new Path2D;k.addPath(x,new DOMMatrix(o));var R=new Path2D;return R.addPath(k,new DOMMatrix([Math.cos(N)*v,Math.sin(N)*v,-Math.sin(N)*y,Math.cos(N)*y,p,w])),R}function Le(r){if(!u)throw new Error("path confetti are not supported in this browser");var o,p;typeof r=="string"?o=r:(o=r.path,p=r.matrix);var w=new Path2D(o),v=document.createElement("canvas"),y=v.getContext("2d");if(!p){for(var N=1e3,x=N,k=N,R=0,$=0,j,O,D=0;D<N;D+=2)for(var A=0;A<N;A+=2)y.isPointInPath(w,D,A,"nonzero")&&(x=Math.min(x,D),k=Math.min(k,A),R=Math.max(R,D),$=Math.max($,A));j=R-x,O=$-k;var V=10,J=Math.min(V/j,V/O);p=[J,0,0,J,-Math.round(j/2+x)*J,-Math.round(O/2+k)*J]}return{type:"path",path:o,matrix:p}}function h(r){var o,p=1,w="#000000",v='"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';typeof r=="string"?o=r:(o=r.text,p="scalar"in r?r.scalar:p,v="fontFamily"in r?r.fontFamily:v,w="color"in r?r.color:w);var y=10*p,N=""+y+"px "+v,x=new OffscreenCanvas(y,y),k=x.getContext("2d");k.font=N;var R=k.measureText(o),$=Math.ceil(R.actualBoundingBoxRight+R.actualBoundingBoxLeft),j=Math.ceil(R.actualBoundingBoxAscent+R.actualBoundingBoxDescent),O=2,D=R.actualBoundingBoxLeft+O,A=R.actualBoundingBoxAscent+O;$+=O+O,j+=O+O,x=new OffscreenCanvas($,j),k=x.getContext("2d"),k.font=N,k.fillStyle=w,k.fillText(o,D,A);var V=1/p;return{type:"bitmap",bitmap:x.transferToImageBitmap(),matrix:[V,0,0,V,-$*V/2,-j*V/2]}}c.exports=function(){return oe().apply(this,arguments)},c.exports.reset=function(){oe().reset()},c.exports.create=ge,c.exports.shapeFromPath=Le,c.exports.shapeFromText=h})((function(){return typeof window<"u"?window:typeof self<"u"?self:this||{}})(),ze,!1);he=ze.exports,Mt=ze.exports.create});var Vt={};rt(Vt,{Routes:()=>F,matchRoute:()=>gt,navigate:()=>st,renderApp:()=>ht,useCallback:()=>Et,useEffect:()=>le,useMemo:()=>Xe,usePath:()=>We,useRef:()=>re,useState:()=>M});Fe();window.__ATOM_STATE__=[];var K=window.__ATOM_STATE__,ue=0,te=window.location.pathname,De=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.state={playing:!1,progress:0,duration:0,muted:!1},this._handlers=[],this._timeoutId=null}connectedCallback(){let e=this.getAttribute("src"),c=this.getAttribute("poster"),i=this.hasAttribute("autoplay")?"autoplay":"",l=this.hasAttribute("loop")?"loop":"",a=this.hasAttribute("muted")?"muted":"",u=this.hasAttribute("playsinline")?"playsinline":"";this.shadowRoot.innerHTML=`<style>:host{display:block;position:relative;width:100%;height:100%;background:#000;overflow:hidden}video{width:100%;height:100%;object-fit:cover;display:block}.ui-layer{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:20}::slotted(*){pointer-events:auto}</style><video src="${e}" ${c?'poster="'+c+'"':""} ${i} ${l} ${a} ${u}></video><div class="ui-layer"><slot></slot></div>`,this.video=this.shadowRoot.querySelector("video"),this.hasAttribute("muted")&&(this.video.muted=!0);let g=()=>this.updateState(),s=()=>this.updateState(),f=()=>{this.state.playing=!0,this.emit()},d=()=>{this.state.playing=!1,this.emit()},b=()=>this.togglePlay(),m=I=>{I.stopPropagation();let{action:L,value:z}=I.detail;L==="toggle"?this.togglePlay():L==="seek"?this.video.currentTime=z/100*this.video.duration:L==="mute"&&(this.video.muted=!this.video.muted,this.state.muted=this.video.muted,this.emit())};this.video.addEventListener("timeupdate",g),this.video.addEventListener("loadedmetadata",s),this.video.addEventListener("play",f),this.video.addEventListener("pause",d),this.video.addEventListener("click",b),this.addEventListener("atom-action",m),this._handlers=[{el:this.video,event:"timeupdate",handler:g},{el:this.video,event:"loadedmetadata",handler:s},{el:this.video,event:"play",handler:f},{el:this.video,event:"pause",handler:d},{el:this.video,event:"click",handler:b},{el:this,event:"atom-action",handler:m}],this._timeoutId=setTimeout(()=>{this.video.paused||(this.state.playing=!0,this.emit()),this.state.muted=this.video.muted},100)}disconnectedCallback(){this._handlers.forEach(({el:e,event:c,handler:i})=>{e.removeEventListener(c,i)}),this._handlers=[],this._timeoutId&&(clearTimeout(this._timeoutId),this._timeoutId=null)}togglePlay(){this.video.paused?this.video.play():this.video.pause()}updateState(){this.state.progress=this.video.currentTime/this.video.duration*100||0,this.state.duration=this.video.duration,this.emit()}emit(){let e=new CustomEvent("atom-state",{detail:{...this.state}});this.querySelectorAll("*").forEach(c=>c.dispatchEvent(e))}};customElements.get("atom-video")||customElements.define("atom-video",De);var He=class extends HTMLElement{connectedCallback(){this.style.display="inline-flex",this.style.cursor="pointer",this.onclick=e=>{e.stopPropagation(),this.dispatchEvent(new CustomEvent("atom-action",{bubbles:!0,detail:{action:"toggle"}}))},this.render(!1),this.addEventListener("atom-state",e=>this.render(e.detail.playing))}render(e){this.innerHTML=e?'<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>':'<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'}};customElements.get("atom-play")||customElements.define("atom-play",He);var Be=class extends HTMLElement{connectedCallback(){this.style.display="block",this.style.width="100%",this.style.height="100%",this.style.cursor="pointer",this.innerHTML='<div style="width:100%;height:100%;background:rgba(255,255,255,0.3);border-radius:10px;overflow:hidden;"><div id="fill" style="background:currentColor;width:0%;height:100%;"></div></div>',this.fill=this.querySelector("#fill"),this.onclick=e=>{e.stopPropagation();let c=this.getBoundingClientRect(),i=(e.clientX-c.left)/c.width*100;this.dispatchEvent(new CustomEvent("atom-action",{bubbles:!0,detail:{action:"seek",value:i}}))},this.addEventListener("atom-state",e=>{this.fill.style.width=e.detail.progress+"%"})}};customElements.get("atom-progress")||customElements.define("atom-progress",Be);var Ve=class extends HTMLElement{constructor(){super(),this._mousemoveHandler=null,this._stateHandler=null,this._timeoutId=null}connectedCallback(){this.style.position="absolute",this.style.zIndex="50",this.style.pointerEvents="none",this.style.transform="translate(-50%, -50%)",this.innerHTML='<div style="background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);padding:12px;border-radius:50%;color:white;"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>',this._timeoutId=setTimeout(()=>{let e=this.closest("atom-video");e&&(this._mousemoveHandler=c=>{let i=e.getBoundingClientRect(),l=c.clientX-i.left,a=c.clientY-i.top;this.style.left=l+"px",this.style.top=a+"px"},this._stateHandler=c=>{this.querySelector("svg").innerHTML=c.detail.playing?'<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>':'<path d="M8 5v14l11-7z"/>'},e.addEventListener("mousemove",this._mousemoveHandler),this.addEventListener("atom-state",this._stateHandler))},100)}disconnectedCallback(){this._timeoutId&&(clearTimeout(this._timeoutId),this._timeoutId=null);let e=this.closest("atom-video");e&&this._mousemoveHandler&&e.removeEventListener("mousemove",this._mousemoveHandler),this._stateHandler&&this.removeEventListener("atom-state",this._stateHandler)}};customElements.get("atom-cursor")||customElements.define("atom-cursor",Ve);var me=[],Re=[],qe=[],Ze=0;function M(t){ie===!1&&ue>0&&console.warn("useState called outside render cycle. This may indicate a hook ordering issue.");let e=ue;Array.isArray(K)||(K=[],window.__ATOM_STATE__=K),e in K||(K[e]=t);let c=l=>{try{if(e>=K.length){console.error("useState: Attempted to update state at invalid cursor position",e);return}K[e]=l,be()}catch(a){throw console.error("useState setState error:",a),new Error(`useState setState failed: ${a.message}`)}},i=K[e];return ue++,[i!==void 0?i:t,c]}function ot(t,e){if(!t&&!e)return!0;if(!t||!e)return!1;if(Array.isArray(t)&&Array.isArray(e)){if(t.length!==e.length)return!1;for(let c=0;c<t.length;c++)if(t[c]!==e[c])return!1;return!0}return t===e}function le(t,e){if(typeof t!="function"){console.error("useEffect: First argument must be a function. Received:",typeof t);return}if(typeof window<"u"){let c=Ze++,i=qe[c],l=me[c],a=Re[c],u=e===void 0?null:Array.isArray(e)?e:[e],g=i===void 0?null:Array.isArray(i)?i:[i];if(g===null||!ot(g,u)){if(a&&clearTimeout(a),l&&typeof l=="function")try{l()}catch(b){console.error("useEffect cleanup error:",b)}qe[c]=u!==null?Array.isArray(u)?[...u]:u:null;let d=setTimeout(()=>{try{let b=t();typeof b=="function"?me[c]=b:me[c]=null}catch(b){console.error("useEffect callback error:",b),console.error("Effect ID:",c,"Deps:",u),me[c]=null}},0);Re[c]=d}}}var ce=[],fe=[],Qe=0;function Xe(t,e){let c=Qe++;Array.isArray(ce)||(ce=[]),Array.isArray(fe)||(fe=[]);let i=fe[c];return(!i||!ot(i,e)||ce[c]===void 0)&&(ce[c]=t(),fe[c]=e?Array.isArray(e)?[...e]:e:null),ce[c]}function Et(t,e){return t}var de=[],Pe=0;function re(t){ie===!1&&Pe>0&&console.warn("useRef called outside render cycle. This may indicate a hook ordering issue.");let e=Pe++;return Array.isArray(de)||(de=[]),de[e]===void 0&&(de[e]={current:t}),de[e]}function We(){return te}var ne=null,ie=!1;function be(){ie||(ne&&clearTimeout(ne),ne=setTimeout(()=>{ie=!0,ht(),ie=!1},0))}function Ge(){Re.forEach(t=>{t&&clearTimeout(t)}),me.forEach((t,e)=>{if(t&&typeof t=="function")try{t()}catch(c){console.error("Cleanup error:",c)}}),me=[],Re=[],qe=[],Ze=0}function st(t){Ge(),ne&&(clearTimeout(ne),ne=null),window.history.pushState({},"",t),te=t,K=[],window.__ATOM_STATE__=[],ue=0,de=[],Pe=0,ce=[],fe=[],Qe=0,be()}function U(t,e,c={}){let i=document.createElement(t);return e instanceof Node?i.appendChild(e):e==null||e===!1||(Array.isArray(e)?e.forEach(l=>{l==null||l===!1||(l instanceof Node?i.appendChild(l):(typeof l=="string"||typeof l=="number")&&i.appendChild(document.createTextNode(String(l))))}):typeof e=="string"||typeof e=="number"?i.appendChild(document.createTextNode(e)):i.appendChild(document.createTextNode(String(e)))),Object.keys(c).forEach(l=>{if(!isNaN(parseInt(l))&&isFinite(l))return;let a=c[l];l.startsWith("on")?i[l.toLowerCase()]=a:l==="style"?a&&typeof a=="object"&&!Array.isArray(a)&&Object.assign(i.style,a):l==="className"?i.className=a:l==="innerHTML"?i.innerHTML=a:["muted","autoplay","loop","checked","disabled","readonly","controls","playsinline"].includes(l)?a?(i.setAttribute(l,""),i[l]=!0):(i.removeAttribute(l),i[l]=!1):l==="value"?(i.value=a,i.setAttribute("value",a)):a!=null&&typeof a!="object"&&i.setAttribute(l,String(a))}),i}var n=(t,e)=>U("div",t,e),q=(t,e)=>U("h1",t,e),B=(t,e)=>U("h2",t,e),H=(t,e)=>U("h3",t,e),Je=(t,e)=>U("h4",t,e);var S=(t,e)=>U("p",t,e),P=(t,e)=>U("button",t,e),it=(t,e)=>U("input",t,e),Rt=(t,e)=>U("form",t,e);var Pt=(t,e)=>U("textarea",t,e),jt=(t,e)=>U("nav",t,e),It=(t,e)=>U("footer",t,e),X=(t,e)=>U("span",t,e);var Ue=(t,e)=>U("section",t,e);var Lt=(t,e)=>U("main",t,e),$t=(t,e)=>U("label",t,e);var Ot=(t,e)=>U("strong",t,e);var Ee=t=>U("img",null,t);var we=t=>{let{src:e,width:c,height:i,sizes:l,quality:a,format:u,...g}=t;if(e&&(e.startsWith("http://")||e.startsWith("https://")))return Ee({loading:"lazy",decoding:"async",...t});let s=(f,d,b,m)=>{let I=typeof process<"u"&&process.env&&process.env.IMAGE_CDN;return I&&I!=="local"?`/_atom/image?url=${encodeURIComponent(e)}&w=${f||""}&h=${d||""}&q=${b||85}&fmt=${m||"auto"}`:`/_atom/image?url=${encodeURIComponent(e)}&w=${f||""}&h=${d||""}&q=${b||85}&fmt=${m||"auto"}`};if(c&&l){let f=e||t.src,b=[640,768,1024,1280,1920].filter(m=>m<=c*2).map(m=>`${s(m,null,a,u)} ${m}w`).join(", ");return Ee({src:s(c,i,a,u),srcset:b,sizes:l||`(max-width: ${c}px) 100vw, ${c}px`,width:c,height:i,loading:"lazy",decoding:"async",...g})}if(e&&(c||i)){let f=s(c,i,a,u);return Ee({src:f,width:c,height:i,loading:"lazy",decoding:"async",...g})}return Ee({loading:"lazy",decoding:"async",...t})};var _=(t,e)=>{let c=e||{};return c.onclick=i=>{c.href&&(c.href.startsWith("http")||c.href.includes(":"))||(i.preventDefault(),st(c.href))},U("a",t,c)},G=t=>{let{content:e}=t||{},c=typeof We<"u"?We():typeof window<"u"?window.location.pathname:"/";return n([dt({activePath:c}),Lt(e?n(e):n("Loading...",{className:"flex justify-center p-20"}),{className:"min-h-screen pt-6"}),ct()],{className:"layout flex flex-col min-h-screen font-sans bg-white text-gray-900"})},zt=t=>{let{content:e}=t||{};return n([n([n([n([n("DASHBOARD",{className:"text-xs font-black text-gray-400 tracking-widest mb-6"}),_("Overview",{href:"/dashboard",className:"block py-2 text-gray-300 hover:text-white font-medium"}),_("Analytics",{href:"/dashboard/analytics",className:"block py-2 text-gray-300 hover:text-white font-medium"}),_("Settings",{href:"/dashboard/settings",className:"block py-2 text-gray-300 hover:text-white font-medium"}),n("SYSTEM",{className:"text-xs font-black text-gray-400 tracking-widest mt-8 mb-6"}),_("Logs",{href:"/dashboard/logs",className:"block py-2 text-gray-300 hover:text-white font-medium"}),_("Users",{href:"/dashboard/users",className:"block py-2 text-gray-300 hover:text-white font-medium"}),n([P("Logout",{className:"mt-8 w-full py-2 bg-red-900/30 text-red-400 border border-red-900 rounded hover:bg-red-900/50 transition text-sm"})])],{className:"sticky top-24"})],{className:"w-64 bg-gray-900 min-h-screen p-6 hidden md:block border-r border-gray-800"}),n([n([B("Dashboard",{className:"text-2xl font-bold"}),n([n([n("JD",{className:"w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold"})],{className:"flex items-center gap-3"})],{className:"flex items-center"})],{className:"flex justify-between items-center mb-8 pb-6 border-b border-gray-200"}),e],{className:"flex-1 p-8 bg-white"})],{className:"flex"})])},Ft=t=>{let{content:e}=t||{};return n([n([n([H("Documentation",{className:"font-bold text-gray-900 mb-6 px-4"}),n([n("GETTING STARTED",{className:"text-xs font-bold text-gray-500 px-4 mb-2 mt-6"}),_("Introduction",{href:"/docs",className:"block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm"}),_("Installation",{href:"/docs/installation",className:"block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm"}),_("Quick Start",{href:"/docs/quick-start",className:"block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm"}),n("CORE CONCEPTS",{className:"text-xs font-bold text-gray-500 px-4 mb-2 mt-6"}),_("Routing",{href:"/docs/routing",className:"block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm"}),_("Server Actions",{href:"/docs/server-actions",className:"block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm"}),_("Components",{href:"/docs/components",className:"block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm"})],{className:"border-l border-gray-100 ml-4"})],{className:"w-64 py-8 hidden lg:block fixed h-screen overflow-y-auto"}),n([e],{className:"lg:ml-64 flex-1 py-12 px-8 max-w-4xl"})],{className:"flex max-w-7xl mx-auto"})])},lt=t=>{try{t=t||{};let e=t||{};return n([H(e.title,{className:"text-xl font-bold mb-2"}),S(e.children,{className:"text-gray-600"})],{className:"bg-white p-6 rounded-xl shadow border border-gray-100"})}catch(e){return console.error('Component "Card" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.Card=lt);var xe=t=>{try{t=t||{};let{error:e,className:c=""}=t||{};if(!e)return null;let i=typeof e=="string"?e:e&&e.message?e.message:"Unknown error occurred",l=e&&typeof e=="object"&&e.hint?e.hint:null;return n([n([n("\u26A0\uFE0F",{className:"text-2xl mr-3"}),n([Je("Something went wrong",{className:"font-bold text-red-800"}),S(i,{className:"text-red-600 text-sm mt-1"}),l?S("\u{1F4A1} "+l,{className:"text-amber-700 text-xs mt-2 bg-amber-50 p-2 rounded border border-amber-100"}):null])],{className:"flex items-start"})],{className:`bg-red-50 border border-red-200 rounded-lg p-4 ${c}`})}catch(e){return console.error('Component "ErrorDisplay" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.ErrorDisplay=xe);var ct=t=>{try{return t=t||{},It([n([n([H("ATOM Showcase",{className:"text-xl font-bold text-white mb-4"}),S("Demonstrating the power of the ATOM Framework V53.",{className:"text-gray-400"})],{className:"col-span-1 md:col-span-2"}),n([Je("Links",{className:"font-bold text-white mb-4"}),n([_("Home",{href:"/",className:"block text-gray-400 hover:text-white mb-2"}),_("Products",{href:"/products",className:"block text-gray-400 hover:text-white mb-2"}),_("Blog",{href:"/blog",className:"block text-gray-400 hover:text-white mb-2"}),_("About",{href:"/about",className:"block text-gray-400 hover:text-white mb-2"})])]),n([Je("Connect",{className:"font-bold text-white mb-4"}),n([_("GitHub",{href:"https://github.com",className:"block text-gray-400 hover:text-white mb-2"}),_("Twitter",{href:"https://twitter.com",className:"block text-gray-400 hover:text-white mb-2"}),_("Discord",{href:"https://discord.com",className:"block text-gray-400 hover:text-white mb-2"})])])],{className:"grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto"}),n("\xA9 2024 ATOM Framework. Open Source.",{className:"text-center text-gray-500 mt-12 pt-8 border-t border-gray-800"})],{className:"bg-gray-900 py-12 px-6 mt-auto"})}catch(e){return console.error('Component "Footer" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.Footer=ct);var pe=t=>{try{t=t||{};let{label:e,type:c="text",value:i,placeholder:l,error:a,required:u,onChange:g,className:s=""}=t||{};return n([e?$t(e,{className:"block text-sm font-medium text-gray-700 mb-1"}):null,c==="textarea"?Pt(null,{className:`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${a?"border-red-500 bg-red-50":"border-gray-300"} ${s}`,placeholder:l,value:i,required:u,oninput:f=>g(f.target.value)}):it(null,{type:c,value:i,className:`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${a?"border-red-500 bg-red-50":"border-gray-300"} ${s}`,placeholder:l,required:u,oninput:f=>g(f.target.value)}),a?S(a,{className:"mt-1 text-sm text-red-600"}):null],{className:"w-full"})}catch(e){return console.error('Component "FormInput" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.FormInput=pe);var dt=t=>{try{t=t||{};let{activePath:e}=t||{},c=i=>`text-sm font-medium transition-colors ${e===i?"text-blue-600 font-bold":"text-gray-600 hover:text-blue-600"}`;return jt([n([_("ATOM Showcase",{href:"/",className:"text-xl font-black tracking-tight text-gray-900"}),n([_("Home",{href:"/",className:c("/")}),_("Products",{href:"/products",className:c("/products")}),_("Blog",{href:"/blog",className:c("/blog")}),_("Dashboard",{href:"/dashboard/home",className:c("/dashboard/home")}),_("Docs",{href:"/docs",className:c("/docs")}),_("Contact",{href:"/contact",className:"px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-bold"})],{className:"hidden md:flex items-center gap-8"}),n("\u2630",{className:"md:hidden text-2xl cursor-pointer"})],{className:"flex justify-between items-center max-w-7xl mx-auto"})],{className:"bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50"})}catch(e){return console.error('Component "Header" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.Header=dt);var Ut=t=>{try{t=t||{};let{images:e=[]}=t||{},[c,i]=M(0);return n([n([we({src:e[c].src,alt:e[c].alt,width:800,height:600,className:"w-full h-[400px] object-cover rounded-xl shadow-lg transition-opacity duration-300"})],{className:"mb-4"}),n(e.map((l,a)=>n([we({src:l.src,alt:l.alt,width:100,height:100,className:"w-full h-full object-cover"})],{className:`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition ${c===a?"border-blue-500 ring-2 ring-blue-200":"border-transparent hover:border-gray-300"}`,onclick:()=>i(a)})),{className:"flex gap-4 overflow-x-auto pb-2"})],{className:"w-full"})}catch(e){return console.error('Component "ImageGallery" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.ImageGallery=Ut);var ye=t=>{try{return t=t||{},n([n([],{className:"w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"}),S("Loading...",{className:"mt-4 text-gray-500 font-medium animate-pulse"})],{className:"flex flex-col items-center justify-center p-12"})}catch(e){return console.error('Component "LoadingSpinner" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.LoadingSpinner=ye);var mt=t=>{try{t=t||{};let{title:e,description:c,image:i,price:l,onAddToCart:a}=t||{};return n([i?we({src:i,alt:e,width:400,height:300,className:"w-full h-48 object-cover"}):null,n([H(e,{className:"text-xl font-bold mb-2"}),S(c,{className:"text-gray-600 mb-4 line-clamp-2"}),n([X(l,{className:"text-2xl font-bold text-blue-600"}),P("Add to Cart",{className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition",onclick:a})],{className:"flex justify-between items-center"})],{className:"p-4"})],{className:"bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100"})}catch(e){return console.error('Component "ProductCard" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.ProductCard=mt);var ee=t=>{try{t=t||{};let e=t||{};return n([n(e.label,{className:"text-xs font-bold text-gray-400 uppercase tracking-widest mb-1"}),n(e.value,{className:"text-2xl font-black text-gray-800"}),e.sub?n(e.sub,{className:"text-xs text-gray-500 mt-1"}):null],{className:"bg-white p-6 rounded-xl shadow-sm border border-gray-100"})}catch(e){return console.error('Component "StatusCard" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.StatusCard=ee);var F=[];F.push({regex:new RegExp("^/marketing-test$"),paramNames:[],title:"Atom App",meta:[],revalidate:null,isStatic:!1,enableStreaming:!1,component:t=>{t=t||{};let e={},i=(l=>(l=l||{},n([q("Marketing Page",{className:"text-4xl font-bold mb-4"}),S("This page is inside a route group (marketing) but the URL is just /marketing-test",{className:"text-xl text-gray-600"})],{className:"p-12 text-center"})))(t);return i=G({...t,content:i}),i}});F.push({regex:new RegExp("^/about$"),paramNames:[],title:"Atom App",meta:[],revalidate:null,isStatic:!0,enableStreaming:!1,component:t=>{t=t||{};let e={},i=(l=>{l=l||{};let a=[{name:"Alex Developer",role:"Lead Architect",image:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",bio:"Obsessed with performance and compiler optimizations."},{name:"Sarah Designer",role:"UI/UX Lead",image:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",bio:"Making complex systems look simple and beautiful."},{name:"Mike Engineer",role:"Backend Specialist",image:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",bio:"Scaling servers to handle millions of requests."}];return n([Ue([n([q("About The Team",{className:"text-5xl font-black mb-6 tracking-tight"}),S("We are a passionate group of developers building the next generation of web tools.",{className:"text-xl text-gray-600 max-w-2xl mx-auto"})],{className:"text-center py-20"})],{className:"bg-gray-50"}),Ue([n(a.map(u=>n([we({src:u.image,alt:u.name,width:400,height:400,className:"w-full h-64 object-cover grayscale hover:grayscale-0 transition duration-500"}),n([H(u.name,{className:"text-xl font-bold mb-1"}),S(u.role,{className:"text-blue-600 font-medium text-sm uppercase tracking-wider mb-3"}),S(u.bio,{className:"text-gray-600 text-sm leading-relaxed"})],{className:"p-6"})],{className:"bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group"})),{className:"grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 -mt-10"})],{className:"pb-24"}),Ue([n([n([B("Global Reach",{className:"text-3xl font-bold mb-8 text-center"}),n([ee({label:"Downloads",value:"2M+"}),ee({label:"Contributors",value:"150+"}),ee({label:"Countries",value:"85"}),ee({label:"Uptime",value:"99.9%"})],{className:"grid grid-cols-2 md:grid-cols-4 gap-6"})],{className:"max-w-6xl mx-auto px-6"})],{className:"py-24 bg-white"})])])})(t);return i=G({...t,content:i}),i}});F.push({regex:new RegExp("^/blog/([^/]+)$"),paramNames:["id"],title:"Atom App",meta:[],revalidate:300,isStatic:!1,enableStreaming:!1,component:t=>{t=t||{};let e={};e.secure_getPost=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_blog__id__secure_getPost",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_getPost" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()};let i=(l=>{l=l||{};let{params:a}=l||{},u=a&&a.id,g=Xe(()=>u?Array.isArray(u)?u[0]:String(u):null,[u]),[s,f]=M(null),[d,b]=M(!0),[m,I]=M(null),L=re(!1),z=re(null);return le(()=>{if(L.current)return;if(!g){b(!1),I(new Error("No post ID provided"));return}if(g===z.current)return;L.current=!0,z.current=g,b(!0),I(null),f(null);let T=g;e.secure_getPost(T).then(E=>{T===z.current&&(f(E),b(!1)),L.current=!1}).catch(E=>{T===z.current&&(I(E),b(!1)),L.current=!1})},[g]),n([n([_("\u2190 Back to Blog",{href:"/blog",className:"text-gray-500 hover:text-black font-medium mb-8 inline-block"}),d?ye():m?xe({error:m}):s?n([X(s.date,{className:"text-blue-600 font-bold tracking-wide text-sm uppercase mb-2 block"}),q(s.title,{className:"text-5xl font-black mb-6 text-gray-900 leading-tight"}),n([n(s.author[0],{className:"w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold mr-3"}),n([S(s.author,{className:"font-bold text-gray-900"}),S("Author",{className:"text-xs text-gray-500 uppercase"})])],{className:"flex items-center mb-12 pb-12 border-b border-gray-100"}),n(s.content,{className:"text-xl text-gray-800 leading-relaxed max-w-none"})]):null],{className:"max-w-3xl mx-auto px-6 py-12"})],{className:"bg-white min-h-screen"})})(t);return i=G({...t,content:i}),i}});F.push({regex:new RegExp("^/blog$"),paramNames:[],title:"Atom App",meta:[],revalidate:300,isStatic:!1,enableStreaming:!1,component:t=>{t=t||{};let e={};e.secure_getPosts=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_blog_secure_getPosts",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_getPosts" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()};let i=(l=>{l=l||{};let[a,u]=M([]),[g,s]=M(!0);return le(()=>{e.secure_getPosts().then(f=>{u(f),s(!1)})},[]),n([n([q("Latest News",{className:"text-4xl font-bold mb-4"}),S("Insights, updates, and tutorials from the team.",{className:"text-xl text-gray-600"})],{className:"bg-white border-b border-gray-100 py-16 px-6 text-center mb-12"}),n([g?ye():n(a.map(f=>n([n([X(f.category,{className:"text-xs font-bold text-blue-600 uppercase tracking-wide"}),X("\u2022",{className:"mx-2 text-gray-300"}),X(f.date,{className:"text-xs text-gray-500"})],{className:"mb-2 flex items-center"}),B([_(f.title,{href:`/blog/${f.id}`,className:"hover:text-blue-600 transition"})],{className:"text-2xl font-bold mb-3 text-gray-900"}),S(f.excerpt,{className:"text-gray-600 mb-4 leading-relaxed"}),n([n([n(f.author[0],{className:"w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 mr-2"}),X(f.author,{className:"text-sm font-medium text-gray-900"})],{className:"flex items-center"}),_("Read Article \u2192",{href:`/blog/${f.id}`,className:"text-sm font-bold text-blue-600 hover:text-blue-800"})],{className:"flex justify-between items-center pt-4 border-t border-gray-50"})],{className:"bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"})),{className:"grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6"})],{className:"pb-24"})],{className:"bg-gray-50 min-h-screen"})})(t);return i=G({...t,content:i}),i}});F.push({regex:new RegExp("^/contact$"),paramNames:[],title:"Atom App",meta:[],revalidate:null,isStatic:!1,enableStreaming:!0,component:t=>{t=t||{};let e={};e.secure_submitContact=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_contact_secure_submitContact",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_submitContact" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()};let i=(l=>{l=l||{};let[a,u]=M({name:"",email:"",message:""}),[g,s]=M({}),[f,d]=M(!1),[b,m]=M(!1),[I,L]=M(null),z=()=>{let C={};return a.name.trim()||(C.name="Name is required"),a.email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)||(C.email="Invalid email format"):C.email="Email is required",a.message.trim()?a.message.length<10&&(C.message="Message too short"):C.message="Message is required",s(C),Object.keys(C).length===0},T=async C=>{if(C.preventDefault(),!!z()){d(!0),L(null);try{let W=await e.secure_submitContact(a);m(!0),u({name:"",email:"",message:""})}catch(W){L(W)}finally{d(!1)}}},E=(C,W)=>{u({...a,[C]:W}),g[C]&&s({...g,[C]:null})};return n([n([n([q("Contact Us",{className:"text-4xl font-bold mb-4"}),S("We'd love to hear from you. Send us a message and we'll respond within 24 hours.",{className:"text-xl text-gray-600 mb-8"}),n([n([H("Email",{className:"font-bold text-lg mb-1"}),S("support@atom-framework.com",{className:"text-blue-600"})],{className:"mb-6"}),n([H("Office",{className:"font-bold text-lg mb-1"}),S("123 Innovation Drive",{className:"text-gray-600"}),S("San Francisco, CA 94103",{className:"text-gray-600"})])],{className:"bg-gray-50 p-8 rounded-xl"})],{className:"col-span-1 md:col-span-1"}),n([n([b?n([n("\u2705",{className:"text-4xl mb-4"}),H("Message Sent!",{className:"text-2xl font-bold mb-2"}),S("Thank you for reaching out. We'll be in touch shortly.",{className:"text-gray-600 mb-6"}),P("Send Another",{className:"px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition",onclick:()=>m(!1)})],{className:"text-center py-12"}):Rt([I?xe({error:I,className:"mb-6"}):null,n([pe({label:"Full Name",value:a.name,placeholder:"Jane Doe",error:g.name,onChange:C=>E("name",C)})],{className:"mb-4"}),n([pe({label:"Email Address",type:"email",value:a.email,placeholder:"jane@example.com",error:g.email,onChange:C=>E("email",C)})],{className:"mb-4"}),n([pe({label:"Message",type:"textarea",value:a.message,placeholder:"How can we help you?",error:g.message,onChange:C=>E("message",C),className:"h-32"})],{className:"mb-6"}),P(f?"Sending...":"Send Message",{type:"submit",className:`w-full py-3 px-6 rounded-lg font-bold text-white transition ${f?"bg-gray-400 cursor-not-allowed":"bg-black hover:bg-gray-800"}`,disabled:f})],{onsubmit:T})],{className:"bg-white p-8 rounded-xl shadow-lg border border-gray-100"})],{className:"col-span-1 md:col-span-2"})],{className:"grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto px-6 py-16"})])})(t);return i=G({...t,content:i}),i}});F.push({regex:new RegExp("^/dashboard/home$"),paramNames:[],title:"Atom App",meta:[],revalidate:null,isStatic:!1,enableStreaming:!1,component:t=>{t=t||{};let e={};e.secure_getStats=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_dashboard_home_secure_getStats",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_getStats" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()};let i=(l=>{l=l||{};let[a,u]=M(null);return le(()=>{e.secure_getStats().then(u)},[]),n([a?n([n([ee({label:"Total Users",value:a.users.toLocaleString(),sub:"+12% from last month"}),ee({label:"Revenue",value:"$"+a.revenue.toLocaleString(),sub:"+8.2% from last month"}),ee({label:"Active Now",value:a.active,sub:"Current online users"}),ee({label:"Growth",value:a.growth+"%",sub:"Year over year"})],{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"}),n([n([H("Recent Activity",{className:"font-bold text-lg mb-4"}),n([n("New user signed up",{className:"py-3 border-b text-sm text-gray-600"}),n("Project 'Alpha' deployed",{className:"py-3 border-b text-sm text-gray-600"}),n("Payment received from Client X",{className:"py-3 border-b text-sm text-gray-600"}),n("Server backup completed",{className:"py-3 text-sm text-gray-600"})])],{className:"bg-gray-50 p-6 rounded-xl border border-gray-100"}),n([H("System Status",{className:"font-bold text-lg mb-4"}),n([n([n("CPU Usage",{className:"text-sm text-gray-500 mb-1"}),n([n([],{className:"h-2 bg-blue-500 rounded w-3/4"})],{className:"h-2 bg-gray-200 rounded w-full"})],{className:"mb-4"}),n([n("Memory",{className:"text-sm text-gray-500 mb-1"}),n([n([],{className:"h-2 bg-green-500 rounded w-1/2"})],{className:"h-2 bg-gray-200 rounded w-full"})],{className:"mb-4"}),n([n("Disk Space",{className:"text-sm text-gray-500 mb-1"}),n([n([],{className:"h-2 bg-purple-500 rounded w-1/4"})],{className:"h-2 bg-gray-200 rounded w-full"})])])],{className:"bg-gray-50 p-6 rounded-xl border border-gray-100"})],{className:"grid grid-cols-1 lg:grid-cols-2 gap-8"})]):ye()])})(t);return i=G({...t,content:i}),i=zt({...t,content:i}),i}});F.push({regex:new RegExp("^/docs(?:/(.*))?$"),paramNames:["slug"],title:"Atom App",meta:[],revalidate:null,isStatic:!1,enableStreaming:!1,component:t=>{t=t||{};let e={},i=(l=>{l=l||{};let{params:a}=l||{},u=[];a&&a.slug&&(Array.isArray(a.slug)?u=a.slug:typeof a.slug=="string"&&(u=a.slug?[a.slug]:[]));let g=u.join(" / ");return n([n([X(g||"Docs",{className:"text-sm text-blue-600 font-bold uppercase tracking-wide mb-2 block"}),q(u[u.length-1]||"Introduction",{className:"text-4xl font-black mb-6 capitalize"}),n([S("This is a dynamically generated documentation page based on the URL path.",{className:"text-xl text-gray-600 mb-8"}),n([H("Current Path Segments:",{className:"font-bold text-lg mb-2"}),n([u.length===0?n("Root (/docs)",{className:"font-mono text-sm bg-gray-100 p-2 rounded"}):u.map(s=>n(s,{className:"font-mono text-sm bg-gray-100 p-2 rounded mb-1"}))],{className:"bg-gray-50 p-4 rounded-lg border border-gray-200"})],{className:"mb-12"}),n([B("Content Placeholder",{className:"text-2xl font-bold mb-4"}),S("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",{className:"mb-4 text-gray-600 leading-relaxed"}),S("Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",{className:"mb-4 text-gray-600 leading-relaxed"})])],{className:"prose max-w-none"})])])})(t);return i=G({...t,content:i}),i=Ft({...t,content:i}),i}});F.push({regex:new RegExp("^/error-tests$"),paramNames:[],title:"Atom App",meta:[],revalidate:null,isStatic:!1,enableStreaming:!1,component:t=>{t=t||{};let e={};e.secure_throwError=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_error_tests_secure_throwError",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_throwError" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()},e.secure_validateInput=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_error_tests_secure_validateInput",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_validateInput" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()};let i=(l=>{l=l||{};let[a,u]=M(null),[g,s]=M(""),f=async()=>{u(null);try{await e.secure_throwError()}catch(b){u(b)}},d=async()=>{u(null);try{await e.secure_validateInput(g),alert("Success!")}catch(b){u(b)}};return n([n([q("Error Handling Tests",{className:"text-4xl font-bold mb-8"}),n([B("1. Server Action Errors",{className:"text-2xl font-bold mb-4"}),S("Click the button below to trigger a server-side error and see how it's handled.",{className:"mb-4 text-gray-600"}),P("Trigger Server Error",{className:"bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition",onclick:f})],{className:"bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8"}),n([B("2. Input Validation",{className:"text-2xl font-bold mb-4"}),n([it({value:g,placeholder:"Type something (min 5 chars)...",className:"border p-2 rounded mr-4 w-64",oninput:b=>s(b.target.value)}),P("Validate",{className:"bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition",onclick:d})],{className:"flex items-center"})],{className:"bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8"}),n([B("3. Error Display Component",{className:"text-2xl font-bold mb-4"}),a?xe({error:a}):n("No errors yet.",{className:"text-gray-400 italic"})],{className:"bg-white p-8 rounded-xl shadow-sm border border-gray-100"})],{className:"max-w-4xl mx-auto px-6 py-12"})],{className:"bg-gray-50 min-h-screen"})})(t);return i=G({...t,content:i}),i}});F.push({regex:new RegExp("^/$"),paramNames:[],title:"Home | ATOM",meta:[{name:"description",content:"Welcome to the future."},{name:"keywords",content:"atom, framework, speed"}],revalidate:null,isStatic:!1,enableStreaming:!1,component:t=>{t=t||{};let e={};e.celebrate=function(){he({particleCount:50,spread:70,origin:{y:.6}})};let i=(l=>{l=l||{};let[a,u]=M(0);return n([n([we({src:"/atom-icon.svg",alt:"ATOM Logo",width:100,height:100,className:"mb-6"}),q("ATOM V20",{className:"text-6xl font-black text-gray-800 mb-4"}),S("Instant Reload & Zero Load",{className:"text-xl text-gray-500 mb-8"}),P("Click ("+a+")",{className:"bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg",onclick:()=>{u(a+1),e.celebrate()}})],{className:"flex flex-col items-center justify-center py-20"})])})(t);return i=G({...t,content:i}),i}});F.push({regex:new RegExp("^/products$"),paramNames:[],title:"Atom App",meta:[],revalidate:60,isStatic:!1,enableStreaming:!1,component:t=>{t=t||{};let e={};e.secure_getProducts=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_products_secure_getProducts",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_getProducts" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()};let i=(l=>{l=l||{};let[a,u]=M([]),[g,s]=M(!0),[f,d]=M(null),[b,m]=M(""),I=re(!1),L=re(null);le(()=>{z()},[]);let z=async(E="")=>{if(!I.current){I.current=!0,s(!0),d(null);try{let C=await e.secure_getProducts(E);Array.isArray(C)?u(C):(console.warn("loadProducts: Expected array but got:",typeof C,C),u([]))}catch(C){console.error("loadProducts error:",C),d(C),u([])}finally{s(!1),I.current=!1}}},T=E=>{m(E),L.current&&clearTimeout(L.current),L.current=setTimeout(()=>{z(E)},300)};return le(()=>()=>{L.current&&clearTimeout(L.current)},[]),n([n([q("Our Products",{className:"text-4xl font-bold mb-4"}),S("Tools designed for the modern web.",{className:"text-xl text-gray-600 mb-8"}),n([pe({placeholder:"Search products...",value:b,onChange:T,className:"max-w-md"})],{className:"mb-12"})],{className:"max-w-7xl mx-auto px-6 pt-12"}),n([f?xe({error:f}):null,g?ye():!Array.isArray(a)||a.length===0?n("No products found matching your search.",{className:"text-center text-gray-500 py-12"}):n((Array.isArray(a)?a:[]).map((E,C)=>!E||typeof E!="object"?(console.warn("Invalid product at index",C,E),null):mt({title:E.title||"Untitled",description:E.description||"",price:E.price||"$0.00",image:E.image||"",onAddToCart:()=>alert(`Added ${E.title||"product"} to cart!`)})).filter(Boolean),{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"})],{className:"max-w-7xl mx-auto px-6 pb-24 min-h-[400px]"})],{className:"bg-gray-50 min-h-screen"})})(t);return i=G({...t,content:i}),i}});F.push({regex:new RegExp("^/test_suite$"),paramNames:[],title:"Atom App",meta:[{name:"robots",content:"noindex, nofollow"}],revalidate:60,isStatic:!1,enableStreaming:!1,component:t=>{t=t||{};let e={};e.secure_testLogin=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_test_suite_secure_testLogin",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_testLogin" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()},e.secure_testRegister=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_test_suite_secure_testRegister",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_testRegister" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()},e.secure_testGetCurrentUser=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_test_suite_secure_testGetCurrentUser",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_testGetCurrentUser" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()},e.secure_testCreateRecord=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_test_suite_secure_testCreateRecord",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_testCreateRecord" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()},e.secure_testGetRecords=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_test_suite_secure_testGetRecords",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_testGetRecords" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()},e.secure_testUpdateRecord=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_test_suite_secure_testUpdateRecord",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_testUpdateRecord" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()},e.secure_testDeleteRecord=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_test_suite_secure_testDeleteRecord",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_testDeleteRecord" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()},e.secure_testValidation=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_test_suite_secure_testValidation",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_testValidation" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()},e.secure_testSanitization=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_test_suite_secure_testSanitization",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_testSanitization" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()},e.secure_testErrorHandling=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_test_suite_secure_testErrorHandling",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_testErrorHandling" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()},e.secure_testPerformance=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_test_suite_secure_testPerformance",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_testPerformance" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()},e.secure_testFileUpload=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_test_suite_secure_testFileUpload",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_testFileUpload" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()},e.secure_testWebSocket=async(l,a={})=>{let u=a.method||"POST",g={"Content-Type":"application/json",...a.headers||{}},s=await fetch("/_atom/rpc/_test_suite_secure_testWebSocket",{method:u,headers:g,body:JSON.stringify(l),...a.signal?{signal:a.signal}:{}});if(!s.ok){let d=await s.json().catch(()=>({error:s.statusText})),b=d.error||s.statusText,m=new Error(`Server Action "secure_testWebSocket" failed: ${b}`);throw d.function&&(m.function=d.function),d.hint&&(m.hint=d.hint),m}return await s.json()};let i=(l=>{l=l||{};let[a,u]=M("auth"),[g,s]=M({}),[f,d]=M(!1),[b,m]=M(null),[I,L]=M(null),[z,T]=M([]),E=Array.isArray(z)?z:[],C=re(!1),W=re(0),je=re(null);le(()=>{typeof window<"u"&&!window.confetti&&Promise.resolve().then(()=>(Fe(),nt)).then(h=>{window.confetti=h.default||h}).catch(()=>{})},[]);let ve=(h={})=>{try{let r=window.confetti||(typeof he<"u"?he:null);r&&typeof r=="function"&&r(h)}catch{}},Ie=Xe(()=>[{id:"auth",name:"Authentication",icon:"\u{1F510}"},{id:"database",name:"Database",icon:"\u{1F4BE}"},{id:"validation",name:"Validation",icon:"\u2705"},{id:"errors",name:"Error Handling",icon:"\u26A0\uFE0F"},{id:"performance",name:"Performance",icon:"\u26A1"},{id:"security",name:"Security",icon:"\u{1F6E1}\uFE0F"}],[]),Ne=async()=>{if(!C.current){C.current=!0,d(!0),m(null);try{let h=await e.secure_testLogin({email:"test@example.com",password:"password123"});h&&h.success?(h.token&&localStorage.setItem("test_token",h.token),h.user&&L(h.user),s(r=>({...r,login:"\u2705 PASS"})),ve({particleCount:50,spread:70})):s(r=>({...r,login:"\u274C FAIL: Unexpected response format"}))}catch(h){m(h.message),s(r=>({...r,login:`\u274C FAIL: ${h.message}`}))}finally{d(!1),C.current=!1}}},ke=async()=>{d(!0),m(null);try{let h=await e.secure_testRegister({email:`test${Date.now()}@example.com`,password:"password123",name:"Test User"});h&&h.success?(s(r=>({...r,register:"\u2705 PASS"})),alert("Registration successful!")):s(r=>({...r,register:"\u274C FAIL: Unexpected response format"}))}catch(h){m(h.message),s(r=>({...r,register:`\u274C FAIL: ${h.message}`}))}finally{d(!1)}},Ce=async()=>{let h=localStorage.getItem("test_token");if(!h){m("No token found. Please login first.");return}d(!0),m(null);try{let r=await e.secure_testGetCurrentUser(h);r?(L(r),s(o=>({...o,getCurrentUser:"\u2705 PASS"}))):s(o=>({...o,getCurrentUser:"\u274C FAIL: No user data returned"}))}catch(r){m(r.message),s(o=>({...o,getCurrentUser:`\u274C FAIL: ${r.message}`}))}finally{d(!1)}},Te=async()=>{d(!0),m(null);try{let h=await e.secure_testCreateRecord({title:"Test Record",content:"<p>This is a <strong>test</strong> record</p>"});h&&h.record?(T(r=>{let o=Array.isArray(r)?r:[],p=h.record;return p?[p,...o]:o}),s(r=>({...r,createRecord:"\u2705 PASS"}))):s(r=>({...r,createRecord:"\u274C FAIL: No record returned"}))}catch(h){m(h.message),s(r=>({...r,createRecord:`\u274C FAIL: ${h.message}`}))}finally{d(!1)}},Se=async()=>{d(!0),m(null);try{let h=await e.secure_testGetRecords({page:1,limit:10});h&&Array.isArray(h.records)?(T(h.records),s(r=>({...r,getRecords:"\u2705 PASS"}))):(T([]),s(r=>({...r,getRecords:"\u274C FAIL: Invalid response format"})))}catch(h){m(h.message),s(r=>({...r,getRecords:`\u274C FAIL: ${h.message}`}))}finally{d(!1)}},Ae=async()=>{let h=Array.isArray(z)?z:[];if(h.length===0){m("No records to update. Create a record first.");return}d(!0),m(null);try{let r=h[0];if(!r||!r.id){m("Invalid record to update.");return}let o=await e.secure_testUpdateRecord({id:r.id,title:"Updated Record",content:"Updated content"});o&&o.success?s(p=>({...p,updateRecord:"\u2705 PASS"})):s(p=>({...p,updateRecord:"\u274C FAIL: Update failed"}))}catch(r){m(r.message),s(o=>({...o,updateRecord:`\u274C FAIL: ${r.message}`}))}finally{d(!1)}},_e=async()=>{let h=Array.isArray(z)?z:[];if(h.length===0){m("No records to delete. Create a record first.");return}d(!0),m(null);try{let r=h[0];if(!r||!r.id){m("Invalid record to delete.");return}let o=typeof r.id=="number"?r.id:Number(r.id);if(isNaN(o)){m("Invalid record ID.");return}let p=await e.secure_testDeleteRecord(o);p&&p.success?(T(w=>(Array.isArray(w)?w:[]).filter(y=>y&&y.id!==r.id)),s(w=>({...w,deleteRecord:"\u2705 PASS"}))):s(w=>({...w,deleteRecord:"\u274C FAIL: Delete failed"}))}catch(r){m(r.message),s(o=>({...o,deleteRecord:`\u274C FAIL: ${r.message}`}))}finally{d(!1)}},ge=async()=>{d(!0),m(null);try{let h=await e.secure_testValidation({email:"test@example.com",name:"Test User",age:25,url:"https://example.com",tags:["tag1","tag2"]});h&&h.success?s(r=>({...r,validation:"\u2705 PASS"})):s(r=>({...r,validation:"\u274C FAIL: Validation failed"}))}catch(h){m(h.message),s(r=>({...r,validation:`\u274C FAIL: ${h.message}`}))}finally{d(!1)}},ae=async()=>{d(!0),m(null);try{let h=await e.secure_testSanitization({html:'<p>Test <script>alert("xss")<\/script></p>',string:"<strong>Test</strong> String",email:"test@example.com",url:'javascript:alert("xss")',object:{name:'<script>alert("xss")<\/script>'}});h&&h.success?s(r=>({...r,sanitization:"\u2705 PASS"})):s(r=>({...r,sanitization:"\u274C FAIL: Sanitization failed"}))}catch(h){m(h.message),s(r=>({...r,sanitization:`\u274C FAIL: ${h.message}`}))}finally{d(!1)}},oe=async h=>{d(!0),m(null);try{await e.secure_testErrorHandling(h),s(r=>({...r,[`error_${h}`]:"\u274C FAIL: Should have thrown error"}))}catch(r){s(o=>({...o,[`error_${h}`]:`\u2705 PASS: ${r.message}`}))}finally{d(!1)}},Me=async()=>{d(!0),m(null);try{let h=await e.secure_testPerformance(1e3);if(h&&h.iterations&&h.duration){let r=h.averageTime?h.averageTime.toFixed(2):(h.duration/h.iterations).toFixed(2);s(o=>({...o,performance:`\u2705 PASS: ${h.iterations} iterations in ${h.duration}ms (avg: ${r}ms)`}))}else s(r=>({...r,performance:"\u274C FAIL: Invalid performance result"}))}catch(h){m(h.message),s(r=>({...r,performance:`\u274C FAIL: ${h.message}`}))}finally{d(!1)}},Le=async()=>{d(!0),m(null),s({}),W.current=0;let h=[{name:"login",fn:Ne},{name:"register",fn:ke},{name:"getCurrentUser",fn:Ce},{name:"createRecord",fn:Te},{name:"getRecords",fn:Se},{name:"updateRecord",fn:Ae},{name:"deleteRecord",fn:_e},{name:"validation",fn:ge},{name:"sanitization",fn:ae},{name:"performance",fn:Me}];for(let r of h){je.current=r.name;try{await r.fn(),W.current++,await new Promise(o=>setTimeout(o,100))}catch(o){console.error(`Test ${r.name} failed:`,o)}}d(!1),ve({particleCount:100,spread:70}),alert(`Tests completed! ${W.current}/${h.length} passed.`)};return n([n([q("\u{1F9EA} ATOM Framework - Complete Test Suite",{className:"text-4xl font-bold mb-2"}),S("Comprehensive production-level testing of all framework features",{className:"text-gray-600 mb-6"}),I&&n([X(`Logged in as: ${I.name} (${I.email})`,{className:"text-green-600 font-semibold"}),P("Logout",{onclick:()=>{localStorage.removeItem("test_token"),L(null),T([])},className:"ml-4 px-3 py-1 bg-red-500 text-white rounded text-sm"})],{className:"mb-4"})],{className:"mb-8"}),b&&n([S(`Error: ${b}`,{className:"text-red-600 bg-red-50 p-4 rounded mb-4"})]),n([B("Test Categories",{className:"text-2xl font-bold mb-4"}),n(Ie.map(h=>P([X(h.icon,{className:"mr-2"}),X(h.name)],{onclick:()=>u(h.id),className:`px-4 py-2 rounded mr-2 mb-2 ${a===h.id?"bg-blue-600 text-white":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`})),{className:"flex flex-wrap mb-6"}),P("\u{1F680} Run All Tests",{onclick:Le,disabled:f,className:"px-6 py-3 bg-green-600 text-white rounded font-bold hover:bg-green-700 disabled:opacity-50 mb-6"})],{className:"mb-8"}),a==="auth"&&n([B("\u{1F510} Authentication Tests",{className:"text-2xl font-bold mb-4"}),n([P("Test Login",{onclick:Ne,disabled:f,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),P("Test Register",{onclick:ke,disabled:f,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),P("Test Get Current User",{onclick:Ce,disabled:f,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"})],{className:"mb-4"}),n([H("Results:",{className:"font-bold mb-2"}),...(()=>{let h=Object.entries(g||{}).filter(([r])=>["login","register","getCurrentUser"].includes(r));return h.length>0?h.map(([r,o])=>n(`${r}: ${o}`,{className:"p-2 bg-gray-100 rounded mb-1"})):[n("No results yet. Click a test button above.",{className:"p-2 bg-gray-50 rounded text-gray-500 italic"})]})()])],{className:"mb-8 p-4 border rounded"}),a==="database"&&n([B("\u{1F4BE} Database Tests",{className:"text-2xl font-bold mb-4"}),n([P("Test Create Record",{onclick:Te,disabled:f,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),P("Test Get Records",{onclick:Se,disabled:f,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),P("Test Update Record",{onclick:Ae,disabled:f,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),P("Test Delete Record",{onclick:_e,disabled:f,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"})],{className:"mb-4"}),E.length>0?n([H("Records:",{className:"font-bold mb-2"}),...E.slice(0,5).map(h=>!h||typeof h!="object"?null:n([Ot(h.title||`Record ${h.id||"Unknown"}`),S(h.content||"No content",{className:"text-sm text-gray-600"})],{className:"p-2 bg-gray-100 rounded mb-2"})).filter(Boolean)]):null,n([H("Results:",{className:"font-bold mb-2"}),...(()=>{let h=Object.entries(g||{}).filter(([r])=>["createRecord","getRecords","updateRecord","deleteRecord"].includes(r));return h.length>0?h.map(([r,o])=>n(`${r}: ${o}`,{className:"p-2 bg-gray-100 rounded mb-1"})):[n("No results yet. Click a test button above.",{className:"p-2 bg-gray-50 rounded text-gray-500 italic"})]})()])],{className:"mb-8 p-4 border rounded"}),a==="validation"&&n([B("\u2705 Validation & Sanitization Tests",{className:"text-2xl font-bold mb-4"}),n([P("Test Validation",{onclick:ge,disabled:f,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),P("Test Sanitization",{onclick:ae,disabled:f,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"})],{className:"mb-4"}),n([H("Results:",{className:"font-bold mb-2"}),...(()=>{let h=Object.entries(g||{}).filter(([r])=>["validation","sanitization"].includes(r));return h.length>0?h.map(([r,o])=>n(`${r}: ${o}`,{className:"p-2 bg-gray-100 rounded mb-1"})):[n("No results yet. Click a test button above.",{className:"p-2 bg-gray-50 rounded text-gray-500 italic"})]})()])],{className:"mb-8 p-4 border rounded"}),a==="errors"&&n([B("\u26A0\uFE0F Error Handling Tests",{className:"text-2xl font-bold mb-4"}),n([P("Test Validation Error",{onclick:()=>oe("validation"),disabled:f,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),P("Test Database Error",{onclick:()=>oe("database"),disabled:f,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),P("Test Permission Error",{onclick:()=>oe("permission"),disabled:f,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),P("Test Not Found Error",{onclick:()=>oe("notfound"),disabled:f,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"})],{className:"mb-4"}),n([H("Results:",{className:"font-bold mb-2"}),...(()=>{let h=Object.entries(g||{}).filter(([r])=>r.startsWith("error_"));return h.length>0?h.map(([r,o])=>n(`${r}: ${o}`,{className:"p-2 bg-gray-100 rounded mb-1"})):[n("No results yet. Click a test button above.",{className:"p-2 bg-gray-50 rounded text-gray-500 italic"})]})()])],{className:"mb-8 p-4 border rounded"}),a==="performance"&&n([B("\u26A1 Performance Tests",{className:"text-2xl font-bold mb-4"}),n([P("Test Performance (1000 iterations)",{onclick:Me,disabled:f,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"})],{className:"mb-4"}),n([H("Results:",{className:"font-bold mb-2"}),...g&&g.performance?[n(`performance: ${g.performance}`,{className:"p-2 bg-gray-100 rounded mb-1"})]:[n("No results yet. Click a test button above.",{className:"p-2 bg-gray-50 rounded text-gray-500 italic"})]])],{className:"mb-8 p-4 border rounded"}),a==="security"&&n([B("\u{1F6E1}\uFE0F Security Tests",{className:"text-2xl font-bold mb-4"}),S("Security tests are integrated into validation and sanitization tests.",{className:"text-gray-600 mb-4"}),n([P("Test XSS Prevention",{onclick:ae,disabled:f,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),P("Test SQL Injection Prevention",{onclick:()=>{alert("SQL injection prevention is handled by parameterized queries. Test by attempting SQL injection in forms.")},className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"})],{className:"mb-4"})],{className:"mb-8 p-4 border rounded"}),f&&n([S("Loading...",{className:"text-blue-600 font-semibold"})],{className:"text-center py-4"}),Object.keys(g||{}).length>0&&n([B("\u{1F4CA} Test Summary",{className:"text-2xl font-bold mb-4"}),n([S(`Total Tests: ${Object.keys(g||{}).length}`,{className:"font-semibold"}),S(`Passed: ${Object.values(g||{}).filter(h=>h&&typeof h=="string"&&h.includes("\u2705")).length}`,{className:"text-green-600 font-semibold"}),S(`Failed: ${Object.values(g||{}).filter(h=>h&&typeof h=="string"&&h.includes("\u274C")).length}`,{className:"text-red-600 font-semibold"})],{className:"p-4 bg-gray-100 rounded"})],{className:"mt-8"})],{className:"max-w-6xl mx-auto p-8"})})(t);return i=G({...t,content:i}),i}});F.push({regex:new RegExp("^/users/([^/]+)$"),paramNames:["id"],title:"User Profile | ATOM",meta:[],revalidate:null,isStatic:!1,enableStreaming:!1,component:t=>{t=t||{};let e={};e.get_user=async function(l){return console.log("Fetching User ID:",l),{id:l,name:"User "+l,role:l==="1"?"Admin":"Guest",bio:"This data came from the server securely."}};let i=(l=>{l=l||{};let{params:a}=l,[u,g]=M(null);return u?n([n([n([q("Welcome",{className:"text-4xl font-bold mb-10"}),lt({title:"Auto Import"},"This component was loaded automatically from the _components folder.")],{className:"p-20 bg-gray-50 min-h-screen"}),n(u.name[0],{className:"w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 mx-auto"}),q(u.name,{className:"text-3xl font-bold text-center text-gray-800"}),n(u.role,{className:"text-center text-sm uppercase tracking-wide text-blue-500 font-bold mb-4"}),n(u.bio,{className:"bg-gray-50 p-4 rounded-lg text-gray-600 text-center"}),n([_("\u2190 Back Home",{href:"/",className:"text-blue-600 hover:underline"})],{className:"mt-6 text-center"})],{className:"max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10"})]):(e.get_user(a.id).then(s=>g(s)),n("Loading Profile...",{className:"p-10 text-center text-gray-500"}))})(t);return i=G({...t,content:i}),i}});F.push({regex:/^\/404$/,paramNames:[],title:"404 Not Found",meta:[],component:()=>n([q("404",{style:{fontSize:"100px",fontWeight:"800",margin:0,color:"#333"}}),n("Page Not Found",{style:{fontSize:"24px",color:"#666",marginBottom:"24px"}}),_("Go Home",{href:"/",style:{background:"#000",color:"#fff",padding:"10px 20px",borderRadius:"6px",textDecoration:"none",fontWeight:"bold"}})],{style:{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"sans-serif",background:"#fff"}})});function ut(t,e,c){if(!t||!(t instanceof Node)){console.error("diff: parent must be a valid DOM Node",t);return}if(!e||!(e instanceof Node)){console.error("diff: newEl must be a valid DOM Node",e);return}try{if(!c){t.appendChild(e);return}if(!(c instanceof Node)){console.error("diff: oldEl is not a valid DOM Node",c),t.replaceChild(e,c);return}if(!e){try{t.removeChild(c)}catch(i){console.warn("diff: Could not remove oldEl",i)}return}if(e.nodeType===3&&c.nodeType===3){if(e.nodeValue!==c.nodeValue)try{c.nodeValue=e.nodeValue}catch(i){console.warn("diff: Could not update text node value",i)}return}if(e.nodeName!==c.nodeName){try{t.replaceChild(e,c)}catch(i){console.error("diff: Error replacing node",i);try{t.innerHTML="",t.appendChild(e)}catch(l){console.error("diff: Fatal error in fallback",l)}}return}if(e.nodeName.includes("-"))return;try{Array.from(c.attributes).forEach(i=>{try{e.hasAttribute(i.name)||(c.removeAttribute(i.name),i.name in c&&(c[i.name]=!1))}catch(l){console.warn("diff: Error removing attribute",i.name,l)}})}catch(i){console.warn("diff: Error processing old attributes",i)}try{Array.from(e.attributes).forEach(i=>{try{let l=i.name,a=i.value;c.getAttribute(l)!==a&&c.setAttribute(l,a),["value","checked","muted","autoplay","loop"].includes(l)&&(c[l]=l==="value"?a:!0)}catch(l){console.warn("diff: Error setting attribute",i.name,l)}})}catch(i){console.warn("diff: Error processing new attributes",i)}try{e.tagName==="INPUT"&&e.value!==c.value&&(c.value=e.value)}catch(i){console.warn("diff: Error syncing input value",i)}try{e.onclick!==c.onclick&&(c.onclick=e.onclick),e.oninput!==c.oninput&&(c.oninput=e.oninput)}catch(i){console.warn("diff: Error syncing events",i)}try{let i=Array.from(e.childNodes),l=Array.from(c.childNodes),a=Math.max(i.length,l.length);for(let u=0;u<a;u++)try{let g=i[u],s=l[u];if(g&&g instanceof Node)ut(c,g,s);else if(s&&s instanceof Node)try{c.removeChild(s)}catch(f){console.warn("diff: Could not remove old child",f)}}catch(g){console.warn(`diff: Error diffing child at index ${u}`,g)}}catch(i){console.error("diff: Error processing children",i);try{t.replaceChild(e,c)}catch(l){console.error("diff: Fatal error in children fallback",l)}}}catch(i){console.error("diff: Fatal error",i);try{c&&c.parentNode===t?t.replaceChild(e,c):t.appendChild(e)}catch(l){console.error("diff: Cannot recover from error",l)}}}function gt(t){let e=t==="/"?"/":t.replace(/\/$/,"");for(let c=0;c<F.length;c++){let i=F[c];if(i.regex.test(e)){let l=e.match(i.regex),a={};if(i.paramNames&&Array.isArray(i.paramNames))for(let u=0;u<i.paramNames.length;u++){let g=i.paramNames[u],s=l&&l[u+1]!==void 0?l[u+1]:void 0;s!=null&&s!==""?typeof s=="string"&&s.includes("/")?a[g]=s.split("/").filter(Boolean):s?a[g]=[s]:a[g]=[]:a[g]=[]}return{component:i.component,params:a||{},title:i.title||"ATOM App",meta:i.meta||[]}}}for(let c=0;c<F.length;c++)if(F[c].title==="404 Not Found")return{component:F[c].component,params:{},title:"404 Not Found",meta:[]};return null}var at=`*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}/*
! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com
*//*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box; /* 1 */
  border-width: 0; /* 2 */
  border-style: solid; /* 2 */
  border-color: #e5e7eb; /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured \`sans\` font-family by default.
5. Use the user's configured \`sans\` font-feature-settings by default.
6. Use the user's configured \`sans\` font-variation-settings by default.
7. Disable tap highlights on iOS
*/

html,
:host {
  line-height: 1.5; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  -moz-tab-size: 4; /* 3 */
  -o-tab-size: 4;
     tab-size: 4; /* 3 */
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */
  font-feature-settings: normal; /* 5 */
  font-variation-settings: normal; /* 6 */
  -webkit-tap-highlight-color: transparent; /* 7 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.
*/

body {
  margin: 0; /* 1 */
  line-height: inherit; /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0; /* 1 */
  color: inherit; /* 2 */
  border-top-width: 1px; /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured \`mono\` font-family by default.
2. Use the user's configured \`mono\` font-feature-settings by default.
3. Use the user's configured \`mono\` font-variation-settings by default.
4. Correct the odd \`em\` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */
  font-feature-settings: normal; /* 2 */
  font-variation-settings: normal; /* 3 */
  font-size: 1em; /* 4 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0; /* 1 */
  border-color: inherit; /* 2 */
  border-collapse: collapse; /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-feature-settings: inherit; /* 1 */
  font-variation-settings: inherit; /* 1 */
  font-size: 100%; /* 1 */
  font-weight: inherit; /* 1 */
  line-height: inherit; /* 1 */
  letter-spacing: inherit; /* 1 */
  color: inherit; /* 1 */
  margin: 0; /* 2 */
  padding: 0; /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
input:where([type='button']),
input:where([type='reset']),
input:where([type='submit']) {
  -webkit-appearance: button; /* 1 */
  background-color: transparent; /* 2 */
  background-image: none; /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to \`inherit\` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Reset default styling for dialogs.
*/
dialog {
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/
:disabled {
  cursor: default;
}

/*
1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block; /* 1 */
  vertical-align: middle; /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */
[hidden]:where(:not([hidden="until-found"])) {
  display: none;
} .fixed {
  position: fixed;
} .sticky {
  position: sticky;
} .top-0 {
  top: 0px;
} .top-24 {
  top: 6rem;
} .z-50 {
  z-index: 50;
} .col-span-1 {
  grid-column: span 1 / span 1;
} .mx-2 {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
} .mx-auto {
  margin-left: auto;
  margin-right: auto;
} .-mt-10 {
  margin-top: -2.5rem;
} .mb-1 {
  margin-bottom: 0.25rem;
} .mb-10 {
  margin-bottom: 2.5rem;
} .mb-12 {
  margin-bottom: 3rem;
} .mb-2 {
  margin-bottom: 0.5rem;
} .mb-3 {
  margin-bottom: 0.75rem;
} .mb-4 {
  margin-bottom: 1rem;
} .mb-6 {
  margin-bottom: 1.5rem;
} .mb-8 {
  margin-bottom: 2rem;
} .ml-4 {
  margin-left: 1rem;
} .mr-2 {
  margin-right: 0.5rem;
} .mr-3 {
  margin-right: 0.75rem;
} .mr-4 {
  margin-right: 1rem;
} .mt-1 {
  margin-top: 0.25rem;
} .mt-10 {
  margin-top: 2.5rem;
} .mt-12 {
  margin-top: 3rem;
} .mt-2 {
  margin-top: 0.5rem;
} .mt-4 {
  margin-top: 1rem;
} .mt-6 {
  margin-top: 1.5rem;
} .mt-8 {
  margin-top: 2rem;
} .mt-auto {
  margin-top: auto;
} .line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
} .block {
  display: block;
} .inline-block {
  display: inline-block;
} .flex {
  display: flex;
} .grid {
  display: grid;
} .hidden {
  display: none;
} .h-10 {
  height: 2.5rem;
} .h-12 {
  height: 3rem;
} .h-2 {
  height: 0.5rem;
} .h-20 {
  height: 5rem;
} .h-32 {
  height: 8rem;
} .h-48 {
  height: 12rem;
} .h-64 {
  height: 16rem;
} .h-8 {
  height: 2rem;
} .h-\\[400px\\] {
  height: 400px;
} .h-full {
  height: 100%;
} .h-screen {
  height: 100vh;
} .min-h-\\[400px\\] {
  min-height: 400px;
} .min-h-screen {
  min-height: 100vh;
} .w-1\\/2 {
  width: 50%;
} .w-1\\/4 {
  width: 25%;
} .w-10 {
  width: 2.5rem;
} .w-12 {
  width: 3rem;
} .w-20 {
  width: 5rem;
} .w-3\\/4 {
  width: 75%;
} .w-64 {
  width: 16rem;
} .w-8 {
  width: 2rem;
} .w-full {
  width: 100%;
} .max-w-2xl {
  max-width: 42rem;
} .max-w-3xl {
  max-width: 48rem;
} .max-w-4xl {
  max-width: 56rem;
} .max-w-5xl {
  max-width: 64rem;
} .max-w-6xl {
  max-width: 72rem;
} .max-w-7xl {
  max-width: 80rem;
} .max-w-md {
  max-width: 28rem;
} .max-w-none {
  max-width: none;
} .flex-1 {
  flex: 1 1 0%;
} @keyframes pulse {

  50% {
    opacity: .5;
  }
} .animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
} @keyframes spin {

  to {
    transform: rotate(360deg);
  }
} .animate-spin {
  animation: spin 1s linear infinite;
} .cursor-not-allowed {
  cursor: not-allowed;
} .cursor-pointer {
  cursor: pointer;
} .grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
} .grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
} .flex-col {
  flex-direction: column;
} .flex-wrap {
  flex-wrap: wrap;
} .items-start {
  align-items: flex-start;
} .items-center {
  align-items: center;
} .justify-center {
  justify-content: center;
} .justify-between {
  justify-content: space-between;
} .gap-12 {
  gap: 3rem;
} .gap-3 {
  gap: 0.75rem;
} .gap-4 {
  gap: 1rem;
} .gap-6 {
  gap: 1.5rem;
} .gap-8 {
  gap: 2rem;
} .overflow-hidden {
  overflow: hidden;
} .overflow-x-auto {
  overflow-x: auto;
} .overflow-y-auto {
  overflow-y: auto;
} .rounded {
  border-radius: 0.25rem;
} .rounded-full {
  border-radius: 9999px;
} .rounded-lg {
  border-radius: 0.5rem;
} .rounded-xl {
  border-radius: 0.75rem;
} .border {
  border-width: 1px;
} .border-2 {
  border-width: 2px;
} .border-4 {
  border-width: 4px;
} .border-b {
  border-bottom-width: 1px;
} .border-l {
  border-left-width: 1px;
} .border-r {
  border-right-width: 1px;
} .border-t {
  border-top-width: 1px;
} .border-amber-100 {
  --tw-border-opacity: 1;
  border-color: rgb(254 243 199 / var(--tw-border-opacity, 1));
} .border-blue-200 {
  --tw-border-opacity: 1;
  border-color: rgb(191 219 254 / var(--tw-border-opacity, 1));
} .border-blue-500 {
  --tw-border-opacity: 1;
  border-color: rgb(59 130 246 / var(--tw-border-opacity, 1));
} .border-gray-100 {
  --tw-border-opacity: 1;
  border-color: rgb(243 244 246 / var(--tw-border-opacity, 1));
} .border-gray-200 {
  --tw-border-opacity: 1;
  border-color: rgb(229 231 235 / var(--tw-border-opacity, 1));
} .border-gray-300 {
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));
} .border-gray-50 {
  --tw-border-opacity: 1;
  border-color: rgb(249 250 251 / var(--tw-border-opacity, 1));
} .border-gray-800 {
  --tw-border-opacity: 1;
  border-color: rgb(31 41 55 / var(--tw-border-opacity, 1));
} .border-red-200 {
  --tw-border-opacity: 1;
  border-color: rgb(254 202 202 / var(--tw-border-opacity, 1));
} .border-red-500 {
  --tw-border-opacity: 1;
  border-color: rgb(239 68 68 / var(--tw-border-opacity, 1));
} .border-red-900 {
  --tw-border-opacity: 1;
  border-color: rgb(127 29 29 / var(--tw-border-opacity, 1));
} .border-transparent {
  border-color: transparent;
} .border-t-blue-600 {
  --tw-border-opacity: 1;
  border-top-color: rgb(37 99 235 / var(--tw-border-opacity, 1));
} .bg-amber-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(255 251 235 / var(--tw-bg-opacity, 1));
} .bg-black {
  --tw-bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity, 1));
} .bg-blue-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
} .bg-blue-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity, 1));
} .bg-gray-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));
} .bg-gray-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(229 231 235 / var(--tw-bg-opacity, 1));
} .bg-gray-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(156 163 175 / var(--tw-bg-opacity, 1));
} .bg-gray-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));
} .bg-gray-900 {
  --tw-bg-opacity: 1;
  background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));
} .bg-green-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));
} .bg-green-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity, 1));
} .bg-purple-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(168 85 247 / var(--tw-bg-opacity, 1));
} .bg-red-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity, 1));
} .bg-red-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity, 1));
} .bg-red-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity, 1));
} .bg-red-900\\/30 {
  background-color: rgb(127 29 29 / 0.3);
} .bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
} .bg-white\\/80 {
  background-color: rgb(255 255 255 / 0.8);
} .bg-yellow-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 249 195 / var(--tw-bg-opacity, 1));
} .object-cover {
  -o-object-fit: cover;
     object-fit: cover;
} .p-10 {
  padding: 2.5rem;
} .p-12 {
  padding: 3rem;
} .p-2 {
  padding: 0.5rem;
} .p-20 {
  padding: 5rem;
} .p-4 {
  padding: 1rem;
} .p-6 {
  padding: 1.5rem;
} .p-8 {
  padding: 2rem;
} .px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
} .px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
} .px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
} .px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
} .py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
} .py-1\\.5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
} .py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
} .py-16 {
  padding-top: 4rem;
  padding-bottom: 4rem;
} .py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
} .py-20 {
  padding-top: 5rem;
  padding-bottom: 5rem;
} .py-24 {
  padding-top: 6rem;
  padding-bottom: 6rem;
} .py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
} .py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
} .py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
} .pb-12 {
  padding-bottom: 3rem;
} .pb-2 {
  padding-bottom: 0.5rem;
} .pb-24 {
  padding-bottom: 6rem;
} .pb-6 {
  padding-bottom: 1.5rem;
} .pt-12 {
  padding-top: 3rem;
} .pt-4 {
  padding-top: 1rem;
} .pt-6 {
  padding-top: 1.5rem;
} .pt-8 {
  padding-top: 2rem;
} .text-center {
  text-align: center;
} .font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
} .font-sans {
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
} .text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
} .text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
} .text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
} .text-5xl {
  font-size: 3rem;
  line-height: 1;
} .text-6xl {
  font-size: 3.75rem;
  line-height: 1;
} .text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
} .text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
} .text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
} .text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
} .font-black {
  font-weight: 900;
} .font-bold {
  font-weight: 700;
} .font-medium {
  font-weight: 500;
} .font-semibold {
  font-weight: 600;
} .uppercase {
  text-transform: uppercase;
} .capitalize {
  text-transform: capitalize;
} .italic {
  font-style: italic;
} .leading-relaxed {
  line-height: 1.625;
} .leading-tight {
  line-height: 1.25;
} .tracking-tight {
  letter-spacing: -0.025em;
} .tracking-wide {
  letter-spacing: 0.025em;
} .tracking-wider {
  letter-spacing: 0.05em;
} .tracking-widest {
  letter-spacing: 0.1em;
} .text-amber-700 {
  --tw-text-opacity: 1;
  color: rgb(180 83 9 / var(--tw-text-opacity, 1));
} .text-blue-500 {
  --tw-text-opacity: 1;
  color: rgb(59 130 246 / var(--tw-text-opacity, 1));
} .text-blue-600 {
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity, 1));
} .text-gray-300 {
  --tw-text-opacity: 1;
  color: rgb(209 213 219 / var(--tw-text-opacity, 1));
} .text-gray-400 {
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity, 1));
} .text-gray-500 {
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity, 1));
} .text-gray-600 {
  --tw-text-opacity: 1;
  color: rgb(75 85 99 / var(--tw-text-opacity, 1));
} .text-gray-700 {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity, 1));
} .text-gray-800 {
  --tw-text-opacity: 1;
  color: rgb(31 41 55 / var(--tw-text-opacity, 1));
} .text-gray-900 {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity, 1));
} .text-green-600 {
  --tw-text-opacity: 1;
  color: rgb(22 163 74 / var(--tw-text-opacity, 1));
} .text-red-400 {
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity, 1));
} .text-red-600 {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
} .text-red-800 {
  --tw-text-opacity: 1;
  color: rgb(153 27 27 / var(--tw-text-opacity, 1));
} .text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
} .text-yellow-800 {
  --tw-text-opacity: 1;
  color: rgb(133 77 14 / var(--tw-text-opacity, 1));
} .shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
} .shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
} .shadow-md {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
} .shadow-sm {
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
} .outline-none {
  outline: 2px solid transparent;
  outline-offset: 2px;
} .ring-2 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
} .ring-blue-200 {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(191 219 254 / var(--tw-ring-opacity, 1));
} .grayscale {
  --tw-grayscale: grayscale(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
} .filter {
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
} .backdrop-blur-md {
  --tw-backdrop-blur: blur(12px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
} .transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
} .transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
} .transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
} .duration-300 {
  transition-duration: 300ms;
} .duration-500 {
  transition-duration: 500ms;
} .hover\\:border-gray-300:hover {
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));
} .hover\\:bg-blue-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(29 78 216 / var(--tw-bg-opacity, 1));
} .hover\\:bg-gray-300:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(209 213 219 / var(--tw-bg-opacity, 1));
} .hover\\:bg-gray-800:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));
} .hover\\:bg-green-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(21 128 61 / var(--tw-bg-opacity, 1));
} .hover\\:bg-red-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(185 28 28 / var(--tw-bg-opacity, 1));
} .hover\\:bg-red-900\\/50:hover {
  background-color: rgb(127 29 29 / 0.5);
} .hover\\:text-black:hover {
  --tw-text-opacity: 1;
  color: rgb(0 0 0 / var(--tw-text-opacity, 1));
} .hover\\:text-blue-600:hover {
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity, 1));
} .hover\\:text-blue-800:hover {
  --tw-text-opacity: 1;
  color: rgb(30 64 175 / var(--tw-text-opacity, 1));
} .hover\\:text-white:hover {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
} .hover\\:underline:hover {
  text-decoration-line: underline;
} .hover\\:shadow-lg:hover {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
} .hover\\:shadow-md:hover {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
} .hover\\:shadow-xl:hover {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
} .hover\\:grayscale-0:hover {
  --tw-grayscale: grayscale(0);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
} .focus\\:border-blue-500:focus {
  --tw-border-opacity: 1;
  border-color: rgb(59 130 246 / var(--tw-border-opacity, 1));
} .focus\\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
} .focus\\:ring-blue-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));
} .disabled\\:opacity-50:disabled {
  opacity: 0.5;
} @media (min-width: 768px) {

  .md\\:col-span-1 {
    grid-column: span 1 / span 1;
  }

  .md\\:col-span-2 {
    grid-column: span 2 / span 2;
  }

  .md\\:block {
    display: block;
  }

  .md\\:flex {
    display: flex;
  }

  .md\\:hidden {
    display: none;
  }

  .md\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .md\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .md\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
} @media (min-width: 1024px) {

  .lg\\:ml-64 {
    margin-left: 16rem;
  }

  .lg\\:block {
    display: block;
  }

  .lg\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lg\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lg\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
} `;if(typeof document<"u"&&at){let t=document.createElement("style");t.innerHTML=at,document.head.appendChild(t)}var Dt=`
    .err-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 2147483647; font-family: -apple-system, monospace; }
    .err-card { width: 100%; max-width: 650px; background: #0a0a0a; border: 1px solid #333; border-radius: 16px; box-shadow: 0 50px 100px -20px rgba(0,0,0,0.7); overflow: hidden; }
    .err-header { background: #1f1212; border-bottom: 1px solid #451a1a; padding: 16px 24px; display: flex; align-items: center; gap: 12px; }
    .err-icon { width: 12px; height: 12px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 10px #ef4444; }
    .err-title { color: #fca5a5; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .err-body { padding: 30px; }
    .err-msg { color: #94a3b8; font-size: 13px; line-height: 1.6; word-break: break-word; }
`;function Ht(t){let e=document.createElement("style");e.textContent=Dt,document.head.appendChild(e);let c=document.createElement("div");c.className="err-backdrop";let i=t.message||"Unknown error occurred",l=t.stack?t.stack.split(`
`).slice(0,5).join(`
`):"",a=window.location.pathname;c.innerHTML=`
        <div class="err-card">
            <div class="err-header"><div class="err-icon"></div><div class="err-title">Runtime Error</div></div>
            <div class="err-body">
                <div class="err-msg"><strong>Error:</strong> ${i}</div>
                <div style="margin-top:12px; color:#888; font-size:11px;"><strong>Page:</strong> ${a}</div>
                ${l?`<div style="margin-top:12px; color:#666; font-size:10px; font-family:monospace; white-space:pre-wrap; max-height:150px; overflow:auto; background:#111; padding:8px; border-radius:4px;">${l}</div>`:""}
                <div style="margin-top:20px; color:#555; font-size:11px;">Check browser console for full stack trace.</div>
            </div>
        </div>
    `,document.body.appendChild(c)}function Bt(t,e,c){try{return t(e)}catch(i){console.error(`Component error in route "${c}":`,i);let l=i&&i.message?i.message:"Unknown error",a=i&&i.stack?i.stack:"";return n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold text-lg mb-2"}),n(l,{className:"text-red-500 mb-2"}),n(a.split(`
`).slice(0,5).join(`
`),{className:"text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded overflow-auto max-h-32",style:{fontSize:"10px"}})],{className:"p-4 border border-red-300 bg-red-50 rounded",style:{margin:"20px"}})}}function ht(){let t=document.getElementById("root");if(!t){console.error("renderApp: Root element not found");return}ie=!0;try{ue=0,Ze=0,Pe=0,Qe=0;let e=gt(te),c;if(e){try{document.title=e.title||"Atom App"}catch(i){console.warn("Failed to set document title:",i)}e.meta&&Array.isArray(e.meta)&&e.meta.forEach(i=>{try{if(i&&typeof i=="object"&&i.name&&i.content){let l=document.querySelector(`meta[name="${i.name}"]`);l||(l=document.createElement("meta"),l.name=i.name,document.head.appendChild(l)),l.content=i.content}}catch(l){console.warn("Failed to set meta tag:",i,l)}});try{let l={params:e.params||{}};if(typeof e.component!="function")throw new Error(`Route component is not a function. Received: ${typeof e.component}`);let a=Bt(e.component,l,te);a&&typeof a.then=="function"?(c=n("Loading...",{className:"flex justify-center p-20 text-gray-500"}),a.then(u=>{try{if(u instanceof Node){let g=t.firstChild;g?t.replaceChild(u,g):t.appendChild(u)}else{console.error("Async component returned non-Node:",typeof u,u);let g=n("Error: Component must return a DOM Node"),s=t.firstChild;s?t.replaceChild(g,s):t.appendChild(g)}}catch(g){console.error("Error updating DOM after async component:",g)}}).catch(u=>{console.error("Async component error:",u);let g=n([n("\u26A0\uFE0F Loading Error",{className:"text-red-600 font-bold mb-2"}),n(u.message||"Failed to load component",{className:"text-red-500"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-4"}),s=t.firstChild;try{s?t.replaceChild(g,s):t.appendChild(g)}catch(f){console.error("Error displaying error node:",f)}})):c=a,(!c||!(c instanceof Node))&&(console.error("Component returned invalid value:",typeof c,c),c=n("Error: Component must return a DOM Node"))}catch(i){let l=new Error(`Error rendering route "${te}": ${i.message}`);l.stack=i.stack,l.originalError=i,console.error("Route Error:",{path:te,error:i.message,stack:i.stack}),Ht(l),c=n([n("\u26A0\uFE0F Rendering Error",{className:"text-red-600 font-bold text-lg mb-2"}),n(i.message||"Unknown error",{className:"text-red-500"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-4"})}}else c=n([n("404 - Page Not Found",{className:"text-gray-800 font-bold text-xl mb-2"}),n(`The route "${te}" was not found.`,{className:"text-gray-600"}),_("Go Home",{href:"/",className:"text-blue-600 hover:underline mt-4 inline-block"})],{className:"p-8 text-center"});(!c||!(c instanceof Node))&&(console.error("VNode is not a valid Node:",typeof c,c),c=n("Error: Invalid component return value"));try{let i=t.firstChild;i?c&&c instanceof Node?ut(t,c,i):(console.error("Cannot diff: VNode is not a valid Node",c),(!c||!(c instanceof Node))&&(c=n("Error: Invalid component return value")),t.replaceChild(c,i)):t.appendChild(c)}catch(i){console.error("Error updating DOM:",i);try{t.innerHTML="",t.appendChild(c)}catch(l){console.error("Fatal: Cannot update DOM:",l)}}}catch(e){console.error("Fatal error in renderApp:",e);try{t.innerHTML=`<div style="padding: 20px; color: red; font-family: monospace;">
                <h1>Fatal Error</h1>
                <p>${e.message||"Unknown error"}</p>
                <pre style="font-size: 10px; overflow: auto;">${e.stack||""}</pre>
            </div>`}catch(c){console.error("Cannot even display error:",c)}}finally{ie=!1}}typeof window<"u"&&(window.addEventListener("beforeunload",()=>{Ge(),ne&&clearTimeout(ne)}),window.onpopstate=()=>{Ge(),te=window.location.pathname,ue=0,be()},document.readyState==="loading"?document.addEventListener("DOMContentLoaded",be):be());return _t(Vt);})();
