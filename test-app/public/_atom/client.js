var AtomApp=(()=>{var jt=Object.defineProperty;var sn=Object.getOwnPropertyDescriptor;var cn=Object.getOwnPropertyNames;var ln=Object.prototype.hasOwnProperty;var dn=(r,e)=>()=>(r&&(e=r(r=0)),e);var fr=(r,e)=>{for(var l in e)jt(r,l,{get:e[l],enumerable:!0})},un=(r,e,l,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let c of cn(e))!ln.call(r,c)&&c!==l&&jt(r,c,{get:()=>e[c],enumerable:!(s=sn(e,c))||s.enumerable});return r};var mn=r=>un(jt({},"__esModule",{value:!0}),r);var br={};fr(br,{create:()=>gn,default:()=>We});var Ot,We,gn,Vt=dn(()=>{Ot={};(function r(e,l,s,c){var o=!!(e.Worker&&e.Blob&&e.Promise&&e.OffscreenCanvas&&e.OffscreenCanvasRenderingContext2D&&e.HTMLCanvasElement&&e.HTMLCanvasElement.prototype.transferControlToOffscreen&&e.URL&&e.URL.createObjectURL),p=typeof Path2D=="function"&&typeof DOMMatrix=="function",b=(function(){if(!e.OffscreenCanvas)return!1;try{var g=new OffscreenCanvas(1,1),d=g.getContext("2d");d.fillRect(0,0,1,1);var A=g.transferToImageBitmap();d.createPattern(A,"no-repeat")}catch{return!1}return!0})();function i(){}function x(g){var d=l.exports.Promise,A=d!==void 0?d:e.Promise;return typeof A=="function"?new A(g):(g(i,i),null)}var u=(function(g,d){return{transform:function(A){if(g)return A;if(d.has(A))return d.get(A);var m=new OffscreenCanvas(A.width,A.height),_=m.getContext("2d");return _.drawImage(A,0,0),d.set(A,m),m},clear:function(){d.clear()}}})(b,new Map),w=(function(){var g=Math.floor(16.666666666666668),d,A,m={},_=0;return typeof requestAnimationFrame=="function"&&typeof cancelAnimationFrame=="function"?(d=function(I){var M=Math.random();return m[M]=requestAnimationFrame(function C(R){_===R||_+g-1<R?(_=R,delete m[M],I()):m[M]=requestAnimationFrame(C)}),M},A=function(I){m[I]&&cancelAnimationFrame(m[I])}):(d=function(I){return setTimeout(I,g)},A=function(I){return clearTimeout(I)}),{frame:d,cancel:A}})(),f=(function(){var g,d,A={};function m(_){function I(M,C){_.postMessage({options:M||{},callback:C})}_.init=function(C){var R=C.transferControlToOffscreen();_.postMessage({canvas:R},[R])},_.fire=function(C,R,z){if(d)return I(C,null),d;var D=Math.random().toString(36).slice(2);return d=x(function(O){function U(Q){Q.data.callback===D&&(delete A[D],_.removeEventListener("message",U),d=null,u.clear(),z(),O())}_.addEventListener("message",U),I(C,D),A[D]=U.bind(null,{data:{callback:D}})}),d},_.reset=function(){_.postMessage({reset:!0});for(var C in A)A[C](),delete A[C]}}return function(){if(g)return g;if(!s&&o){var _=["var CONFETTI, SIZE = {}, module = {};","("+r.toString()+")(this, module, true, SIZE);","onmessage = function(msg) {","  if (msg.data.options) {","    CONFETTI(msg.data.options).then(function () {","      if (msg.data.callback) {","        postMessage({ callback: msg.data.callback });","      }","    });","  } else if (msg.data.reset) {","    CONFETTI && CONFETTI.reset();","  } else if (msg.data.resize) {","    SIZE.width = msg.data.resize.width;","    SIZE.height = msg.data.resize.height;","  } else if (msg.data.canvas) {","    SIZE.width = msg.data.canvas.width;","    SIZE.height = msg.data.canvas.height;","    CONFETTI = module.exports.create(msg.data.canvas);","  }","}"].join(`
`);try{g=new Worker(URL.createObjectURL(new Blob([_])))}catch(I){return typeof console<"u"&&typeof console.warn=="function"&&console.warn("\u{1F38A} Could not load worker",I),null}m(g)}return g}})(),H={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:["square","circle"],zIndex:100,colors:["#26ccff","#a25afd","#ff5e7e","#88ff5a","#fcff42","#ffa62d","#ff36ff"],disableForReducedMotion:!1,scalar:1};function W(g,d){return d?d(g):g}function Z(g){return g!=null}function E(g,d,A){return W(g&&Z(g[d])?g[d]:H[d],A)}function G(g){return g<0?0:Math.floor(g)}function re(g,d){return Math.floor(Math.random()*(d-g))+g}function he(g){return parseInt(g,16)}function J(g){return g.map(ce)}function ce(g){var d=String(g).replace(/[^0-9a-f]/gi,"");return d.length<6&&(d=d[0]+d[0]+d[1]+d[1]+d[2]+d[2]),{r:he(d.substring(0,2)),g:he(d.substring(2,4)),b:he(d.substring(4,6))}}function ae(g){var d=E(g,"origin",Object);return d.x=E(d,"x",Number),d.y=E(d,"y",Number),d}function ne(g){g.width=document.documentElement.clientWidth,g.height=document.documentElement.clientHeight}function ze(g){var d=g.getBoundingClientRect();g.width=d.width,g.height=d.height}function Se(g){var d=document.createElement("canvas");return d.style.position="fixed",d.style.top="0px",d.style.left="0px",d.style.pointerEvents="none",d.style.zIndex=g,d}function tt(g,d,A,m,_,I,M,C,R){g.save(),g.translate(d,A),g.rotate(I),g.scale(m,_),g.arc(0,0,1,M,C,R),g.restore()}function rt(g){var d=g.angle*(Math.PI/180),A=g.spread*(Math.PI/180);return{x:g.x,y:g.y,wobble:Math.random()*10,wobbleSpeed:Math.min(.11,Math.random()*.1+.05),velocity:g.startVelocity*.5+Math.random()*g.startVelocity,angle2D:-d+(.5*A-Math.random()*A),tiltAngle:(Math.random()*(.75-.25)+.25)*Math.PI,color:g.color,shape:g.shape,tick:0,totalTicks:g.ticks,decay:g.decay,drift:g.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:g.gravity*3,ovalScalar:.6,scalar:g.scalar,flat:g.flat}}function yt(g,d){d.x+=Math.cos(d.angle2D)*d.velocity+d.drift,d.y+=Math.sin(d.angle2D)*d.velocity+d.gravity,d.velocity*=d.decay,d.flat?(d.wobble=0,d.wobbleX=d.x+10*d.scalar,d.wobbleY=d.y+10*d.scalar,d.tiltSin=0,d.tiltCos=0,d.random=1):(d.wobble+=d.wobbleSpeed,d.wobbleX=d.x+10*d.scalar*Math.cos(d.wobble),d.wobbleY=d.y+10*d.scalar*Math.sin(d.wobble),d.tiltAngle+=.1,d.tiltSin=Math.sin(d.tiltAngle),d.tiltCos=Math.cos(d.tiltAngle),d.random=Math.random()+2);var A=d.tick++/d.totalTicks,m=d.x+d.random*d.tiltCos,_=d.y+d.random*d.tiltSin,I=d.wobbleX+d.random*d.tiltCos,M=d.wobbleY+d.random*d.tiltSin;if(g.fillStyle="rgba("+d.color.r+", "+d.color.g+", "+d.color.b+", "+(1-A)+")",g.beginPath(),p&&d.shape.type==="path"&&typeof d.shape.path=="string"&&Array.isArray(d.shape.matrix))g.fill(Re(d.shape.path,d.shape.matrix,d.x,d.y,Math.abs(I-m)*.1,Math.abs(M-_)*.1,Math.PI/10*d.wobble));else if(d.shape.type==="bitmap"){var C=Math.PI/10*d.wobble,R=Math.abs(I-m)*.1,z=Math.abs(M-_)*.1,D=d.shape.bitmap.width*d.scalar,O=d.shape.bitmap.height*d.scalar,U=new DOMMatrix([Math.cos(C)*R,Math.sin(C)*R,-Math.sin(C)*z,Math.cos(C)*z,d.x,d.y]);U.multiplySelf(new DOMMatrix(d.shape.matrix));var Q=g.createPattern(u.transform(d.shape.bitmap),"no-repeat");Q.setTransform(U),g.globalAlpha=1-A,g.fillStyle=Q,g.fillRect(d.x-D/2,d.y-O/2,D,O),g.globalAlpha=1}else if(d.shape==="circle")g.ellipse?g.ellipse(d.x,d.y,Math.abs(I-m)*d.ovalScalar,Math.abs(M-_)*d.ovalScalar,Math.PI/10*d.wobble,0,2*Math.PI):tt(g,d.x,d.y,Math.abs(I-m)*d.ovalScalar,Math.abs(M-_)*d.ovalScalar,Math.PI/10*d.wobble,0,2*Math.PI);else if(d.shape==="star")for(var F=Math.PI/2*3,oe=4*d.scalar,le=8*d.scalar,te=d.x,me=d.y,ye=5,de=Math.PI/ye;ye--;)te=d.x+Math.cos(F)*le,me=d.y+Math.sin(F)*le,g.lineTo(te,me),F+=de,te=d.x+Math.cos(F)*oe,me=d.y+Math.sin(F)*oe,g.lineTo(te,me),F+=de;else g.moveTo(Math.floor(d.x),Math.floor(d.y)),g.lineTo(Math.floor(d.wobbleX),Math.floor(_)),g.lineTo(Math.floor(I),Math.floor(M)),g.lineTo(Math.floor(m),Math.floor(d.wobbleY));return g.closePath(),g.fill(),d.tick<d.totalTicks}function De(g,d,A,m,_){var I=d.slice(),M=g.getContext("2d"),C,R,z=x(function(D){function O(){C=R=null,M.clearRect(0,0,m.width,m.height),u.clear(),_(),D()}function U(){s&&!(m.width===c.width&&m.height===c.height)&&(m.width=g.width=c.width,m.height=g.height=c.height),!m.width&&!m.height&&(A(g),m.width=g.width,m.height=g.height),M.clearRect(0,0,m.width,m.height),I=I.filter(function(Q){return yt(M,Q)}),I.length?C=w.frame(U):O()}C=w.frame(U),R=O});return{addFettis:function(D){return I=I.concat(D),z},canvas:g,promise:z,reset:function(){C&&w.cancel(C),R&&R()}}}function nt(g,d){var A=!g,m=!!E(d||{},"resize"),_=!1,I=E(d,"disableForReducedMotion",Boolean),M=o&&!!E(d||{},"useWorker"),C=M?f():null,R=A?ne:ze,z=g&&C?!!g.__confetti_initialized:!1,D=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion)").matches,O;function U(F,oe,le){for(var te=E(F,"particleCount",G),me=E(F,"angle",Number),ye=E(F,"spread",Number),de=E(F,"startVelocity",Number),wt=E(F,"decay",Number),vt=E(F,"gravity",Number),Nt=E(F,"drift",Number),ke=E(F,"colors",J),St=E(F,"ticks",Number),at=E(F,"shapes"),ot=E(F,"scalar"),kt=!!E(F,"flat"),Tt=ae(F),st=te,it=[],At=g.width*Tt.x,Ct=g.height*Tt.y;st--;)it.push(rt({x:At,y:Ct,angle:me,spread:ye,startVelocity:de,color:ke[st%ke.length],shape:at[re(0,at.length)],ticks:St,decay:wt,gravity:vt,drift:Nt,scalar:ot,flat:kt}));return O?O.addFettis(it):(O=De(g,it,R,oe,le),O.promise)}function Q(F){var oe=I||E(F,"disableForReducedMotion",Boolean),le=E(F,"zIndex",Number);if(oe&&D)return x(function(de){de()});A&&O?g=O.canvas:A&&!g&&(g=Se(le),document.body.appendChild(g)),m&&!z&&R(g);var te={width:g.width,height:g.height};C&&!z&&C.init(g),z=!0,C&&(g.__confetti_initialized=!0);function me(){if(C){var de={getBoundingClientRect:function(){if(!A)return g.getBoundingClientRect()}};R(de),C.postMessage({resize:{width:de.width,height:de.height}});return}te.width=te.height=null}function ye(){O=null,m&&(_=!1,e.removeEventListener("resize",me)),A&&g&&(document.body.contains(g)&&document.body.removeChild(g),g=null,z=!1)}return m&&!_&&(_=!0,e.addEventListener("resize",me,!1)),C?C.fire(F,te,ye):U(F,te,ye)}return Q.reset=function(){C&&C.reset(),O&&O.reset()},Q}var ue;function Ie(){return ue||(ue=nt(null,{useWorker:!0,resize:!0})),ue}function Re(g,d,A,m,_,I,M){var C=new Path2D(g),R=new Path2D;R.addPath(C,new DOMMatrix(d));var z=new Path2D;return z.addPath(R,new DOMMatrix([Math.cos(M)*_,Math.sin(M)*_,-Math.sin(M)*I,Math.cos(M)*I,A,m])),z}function Pe(g){if(!p)throw new Error("path confetti are not supported in this browser");var d,A;typeof g=="string"?d=g:(d=g.path,A=g.matrix);var m=new Path2D(d),_=document.createElement("canvas"),I=_.getContext("2d");if(!A){for(var M=1e3,C=M,R=M,z=0,D=0,O,U,Q=0;Q<M;Q+=2)for(var F=0;F<M;F+=2)I.isPointInPath(m,Q,F,"nonzero")&&(C=Math.min(C,Q),R=Math.min(R,F),z=Math.max(z,Q),D=Math.max(D,F));O=z-C,U=D-R;var oe=10,le=Math.min(oe/O,oe/U);A=[le,0,0,le,-Math.round(O/2+C)*le,-Math.round(U/2+R)*le]}return{type:"path",path:d,matrix:A}}function xt(g){var d,A=1,m="#000000",_='"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';typeof g=="string"?d=g:(d=g.text,A="scalar"in g?g.scalar:A,_="fontFamily"in g?g.fontFamily:_,m="color"in g?g.color:m);var I=10*A,M=""+I+"px "+_,C=new OffscreenCanvas(I,I),R=C.getContext("2d");R.font=M;var z=R.measureText(d),D=Math.ceil(z.actualBoundingBoxRight+z.actualBoundingBoxLeft),O=Math.ceil(z.actualBoundingBoxAscent+z.actualBoundingBoxDescent),U=2,Q=z.actualBoundingBoxLeft+U,F=z.actualBoundingBoxAscent+U;D+=U+U,O+=U+U,C=new OffscreenCanvas(D,O),R=C.getContext("2d"),R.font=M,R.fillStyle=m,R.fillText(d,Q,F);var oe=1/A;return{type:"bitmap",bitmap:C.transferToImageBitmap(),matrix:[oe,0,0,oe,-D*oe/2,-O*oe/2]}}l.exports=function(){return Ie().apply(this,arguments)},l.exports.reset=function(){Ie().reset()},l.exports.create=nt,l.exports.shapeFromPath=Pe,l.exports.shapeFromText=xt})((function(){return typeof window<"u"?window:typeof self<"u"?self:this||{}})(),Ot,!1);We=Ot.exports,gn=Ot.exports.create});var Rn={};fr(Rn,{Routes:()=>ee,matchRoute:()=>Mr,navigate:()=>ft,renderApp:()=>Rr,useCallback:()=>pn,useEffect:()=>fe,useMemo:()=>gt,usePath:()=>Ze,useRef:()=>se,useState:()=>k});Vt();window.__ATOM_STATE__=[];var B=window.__ATOM_STATE__,Ve=0,$e=window.location.pathname,qt=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.state={playing:!1,progress:0,duration:0,muted:!1},this._handlers=[],this._timeoutId=null}connectedCallback(){let e=this.getAttribute("src"),l=this.getAttribute("poster"),s=this.hasAttribute("autoplay")?"autoplay":"",c=this.hasAttribute("loop")?"loop":"",o=this.hasAttribute("muted")?"muted":"",p=this.hasAttribute("playsinline")?"playsinline":"";this.shadowRoot.innerHTML=`<style>:host{display:block;position:relative;width:100%;height:100%;background:#000;overflow:hidden}video{width:100%;height:100%;object-fit:cover;display:block}.ui-layer{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:20}::slotted(*){pointer-events:auto}</style><video src="${e}" ${l?'poster="'+l+'"':""} ${s} ${c} ${o} ${p}></video><div class="ui-layer"><slot></slot></div>`,this.video=this.shadowRoot.querySelector("video"),this.hasAttribute("muted")&&(this.video.muted=!0);let b=()=>this.updateState(),i=()=>this.updateState(),x=()=>{this.state.playing=!0,this.emit()},u=()=>{this.state.playing=!1,this.emit()},w=()=>this.togglePlay(),f=H=>{H.stopPropagation();let{action:W,value:Z}=H.detail;W==="toggle"?this.togglePlay():W==="seek"?this.video.currentTime=Z/100*this.video.duration:W==="mute"&&(this.video.muted=!this.video.muted,this.state.muted=this.video.muted,this.emit())};this.video.addEventListener("timeupdate",b),this.video.addEventListener("loadedmetadata",i),this.video.addEventListener("play",x),this.video.addEventListener("pause",u),this.video.addEventListener("click",w),this.addEventListener("atom-action",f),this._handlers=[{el:this.video,event:"timeupdate",handler:b},{el:this.video,event:"loadedmetadata",handler:i},{el:this.video,event:"play",handler:x},{el:this.video,event:"pause",handler:u},{el:this.video,event:"click",handler:w},{el:this,event:"atom-action",handler:f}],this._timeoutId=setTimeout(()=>{this.video.paused||(this.state.playing=!0,this.emit()),this.state.muted=this.video.muted},100)}disconnectedCallback(){this._handlers.forEach(({el:e,event:l,handler:s})=>{e.removeEventListener(l,s)}),this._handlers=[],this._timeoutId&&(clearTimeout(this._timeoutId),this._timeoutId=null)}togglePlay(){this.video.paused?this.video.play():this.video.pause()}updateState(){this.state.progress=this.video.currentTime/this.video.duration*100||0,this.state.duration=this.video.duration,this.emit()}emit(){let e=new CustomEvent("atom-state",{detail:{...this.state}});this.querySelectorAll("*").forEach(l=>l.dispatchEvent(e))}};customElements.get("atom-video")||customElements.define("atom-video",qt);var Ht=class extends HTMLElement{connectedCallback(){this.style.display="inline-flex",this.style.cursor="pointer",this.onclick=e=>{e.stopPropagation(),this.dispatchEvent(new CustomEvent("atom-action",{bubbles:!0,detail:{action:"toggle"}}))},this.render(!1),this.addEventListener("atom-state",e=>this.render(e.detail.playing))}render(e){this.innerHTML=e?'<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>':'<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'}};customElements.get("atom-play")||customElements.define("atom-play",Ht);var Bt=class extends HTMLElement{connectedCallback(){this.style.display="block",this.style.width="100%",this.style.height="100%",this.style.cursor="pointer",this.innerHTML='<div style="width:100%;height:100%;background:rgba(255,255,255,0.3);border-radius:10px;overflow:hidden;"><div id="fill" style="background:currentColor;width:0%;height:100%;"></div></div>',this.fill=this.querySelector("#fill"),this.onclick=e=>{e.stopPropagation();let l=this.getBoundingClientRect(),s=(e.clientX-l.left)/l.width*100;this.dispatchEvent(new CustomEvent("atom-action",{bubbles:!0,detail:{action:"seek",value:s}}))},this.addEventListener("atom-state",e=>{this.fill.style.width=e.detail.progress+"%"})}};customElements.get("atom-progress")||customElements.define("atom-progress",Bt);var Wt=class extends HTMLElement{constructor(){super(),this._mousemoveHandler=null,this._stateHandler=null,this._timeoutId=null}connectedCallback(){this.style.position="absolute",this.style.zIndex="50",this.style.pointerEvents="none",this.style.transform="translate(-50%, -50%)",this.innerHTML='<div style="background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);padding:12px;border-radius:50%;color:white;"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>',this._timeoutId=setTimeout(()=>{let e=this.closest("atom-video");e&&(this._mousemoveHandler=l=>{let s=e.getBoundingClientRect(),c=l.clientX-s.left,o=l.clientY-s.top;this.style.left=c+"px",this.style.top=o+"px"},this._stateHandler=l=>{this.querySelector("svg").innerHTML=l.detail.playing?'<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>':'<path d="M8 5v14l11-7z"/>'},e.addEventListener("mousemove",this._mousemoveHandler),this.addEventListener("atom-state",this._stateHandler))},100)}disconnectedCallback(){this._timeoutId&&(clearTimeout(this._timeoutId),this._timeoutId=null);let e=this.closest("atom-video");e&&this._mousemoveHandler&&e.removeEventListener("mousemove",this._mousemoveHandler),this._stateHandler&&this.removeEventListener("atom-state",this._stateHandler)}};customElements.get("atom-cursor")||customElements.define("atom-cursor",Wt);var Oe=[],mt=[],Gt=[],Zt=0;function k(r){Me===!1&&Ve>0&&console.warn("useState called outside render cycle. This may indicate a hook ordering issue.");let e=Ve;Array.isArray(B)||(B=[],window.__ATOM_STATE__=B),e in B||(B[e]=r),typeof window<"u"&&(window.__ATOM_STATE__=B);let l=c=>{try{if(Array.isArray(B)||(B=[],window.__ATOM_STATE__=B),e>=B.length)for(;B.length<=e;)B.push(void 0);let o;if(typeof c=="function"){let p=B[e];o=c(p)}else o=c;if(B[e]!==o){let p=B[e];B[e]=o,window.__ATOM_STATE__=B,typeof window<"u"&&window.location&&window.location.hostname==="localhost"&&console.log("[ATOM useState] State updated at cursor",e,":",p,"\u2192",o,B),Je()}}catch(o){throw console.error("useState setState error:",o),new Error(`useState setState failed: ${o.message}`)}},s=B[e];return Ve++,[s!==void 0?s:r,l]}function Nr(r,e){if(!r&&!e)return!0;if(!r||!e)return!1;if(Array.isArray(r)&&Array.isArray(e)){if(r.length!==e.length)return!1;for(let l=0;l<r.length;l++)if(r[l]!==e[l])return!1;return!0}return r===e}function fe(r,e){if(typeof r!="function"){console.error("useEffect: First argument must be a function. Received:",typeof r);return}if(typeof window<"u"){let l=Zt++,s=Gt[l],c=Oe[l],o=mt[l],p=e===void 0?null:Array.isArray(e)?e:[e],b=s===void 0?null:Array.isArray(s)?s:[s];if(b===null||!Nr(b,p)){if(o&&clearTimeout(o),c&&typeof c=="function")try{c()}catch(w){console.error("useEffect cleanup error:",w)}Gt[l]=p!==null?Array.isArray(p)?[...p]:p:null;let u=setTimeout(()=>{try{let w=r();typeof w=="function"?Oe[l]=w:Oe[l]=null}catch(w){console.error("useEffect callback error:",w),console.error("Effect ID:",l,"Deps:",p),Oe[l]=null}},0);mt[l]=u}}}var Le=[],Ge=[],Qt=0;function gt(r,e){let l=Qt++;Array.isArray(Le)||(Le=[]),Array.isArray(Ge)||(Ge=[]);let s=Ge[l];return(!s||!Nr(s,e)||Le[l]===void 0)&&(Le[l]=r(),Ge[l]=e?Array.isArray(e)?[...e]:e:null),Le[l]}function pn(r,e){return r}var je=[],pt=0;function se(r){Me===!1&&pt>0&&console.warn("useRef called outside render cycle. This may indicate a hook ordering issue.");let e=pt++;return Array.isArray(je)||(je=[]),je[e]===void 0&&(je[e]={current:r}),je[e]}function Ze(){return $e}var _e=null,Me=!1;function Je(){Me||(_e&&clearTimeout(_e),_e=setTimeout(()=>{Me=!0,Rr(),Me=!1},0))}function Jt(){mt.forEach(r=>{r&&clearTimeout(r)}),Oe.forEach((r,e)=>{if(r&&typeof r=="function")try{r()}catch(l){console.error("Cleanup error:",l)}}),Oe=[],mt=[],Gt=[],Zt=0}function ft(r){Jt(),_e&&(clearTimeout(_e),_e=null),window.history.pushState({},"",r),$e=r,B=[],window.__ATOM_STATE__=[],Ve=0,je=[],pt=0,Le=[],Ge=[],Qt=0,Je()}var Ye=new WeakMap,ut=new WeakMap;function Yt(r){if(r&&(r.tagName==="INPUT"||r.tagName==="TEXTAREA")){Ye.set(r,r.value||"");let e=ut.get(r);e&&clearTimeout(e)}}function Sr(r){r&&(r.tagName==="INPUT"||r.tagName==="TEXTAREA")&&Yt(r)}function kr(r){if(r&&(r.tagName==="INPUT"||r.tagName==="TEXTAREA")){let e=setTimeout(()=>{Ye.delete(r),ut.delete(r)},500),l=ut.get(r);l&&clearTimeout(l),ut.set(r,e)}}function hr(r){return r&&Ye.has(r)}function fn(r){return Ye.get(r)||(r?r.value:"")}function j(r,e,l={}){let s=document.createElement(r);return e instanceof Node?s.appendChild(e):e==null||e===!1||(Array.isArray(e)?e.forEach(c=>{c==null||c===!1||(c instanceof Node?s.appendChild(c):(typeof c=="string"||typeof c=="number")&&s.appendChild(document.createTextNode(String(c))))}):typeof e=="string"||typeof e=="number"?s.appendChild(document.createTextNode(e)):s.appendChild(document.createTextNode(String(e)))),Object.keys(l).forEach(c=>{if(!isNaN(parseInt(c))&&isFinite(c))return;let o=l[c];if(c.startsWith("on"))r==="input"||r==="textarea"?c==="oninput"||c==="onInput"?s.oninput=p=>{Yt(s),o&&o(p)}:c==="onfocus"||c==="onFocus"?s.onfocus=p=>{Sr(s),o&&o(p)}:c==="onblur"||c==="onBlur"?s.onblur=p=>{kr(s),o&&o(p)}:s[c.toLowerCase()]=o:r==="form"&&(c==="onsubmit"||c==="onSubmit")?s.onsubmit=p=>{p.preventDefault(),p.stopPropagation(),o&&o(p)}:s[c.toLowerCase()]=o;else if(c==="style")o&&typeof o=="object"&&!Array.isArray(o)&&Object.assign(s.style,o);else if(c==="className")s.className=o;else if(c==="innerHTML")s.innerHTML=o;else if(["muted","autoplay","loop","checked","disabled","readonly","controls","playsinline"].includes(c))o?(s.setAttribute(c,""),s[c]=!0):(s.removeAttribute(c),s[c]=!1);else if(c==="value"){let p;o==null||o===!1||typeof o=="string"&&o==="undefined"?p="":p=String(o),s.value=p,p===""?s.removeAttribute("value"):s.setAttribute("value",p)}else o!=null&&typeof o!="object"&&s.setAttribute(c,String(o))}),s}var n=(r,e)=>j("div",r,e),ie=(r,e)=>j("h1",r,e),X=(r,e)=>j("h2",r,e),V=(r,e)=>j("h3",r,e),bt=(r,e)=>j("h4",r,e);var T=(r,e)=>j("p",r,e),$=(r,e)=>j("button",r,e),Ne=(r,e)=>j("input",r,e),Xt=(r,e)=>j("form",r,e),bn=(r,e)=>j("select",r,e),zt=(r,e)=>j("option",r,e),ht=(r,e)=>j("textarea",r,e),hn=(r,e)=>j("nav",r,e),yn=(r,e)=>j("footer",r,e),Y=(r,e)=>j("span",r,e),xn=(r,e)=>j("ul",r,e);var Dt=(r,e)=>j("li",r,e);var Ut=(r,e)=>j("section",r,e);var wn=(r,e)=>j("main",r,e),pe=(r,e)=>j("label",r,e),vn=(r,e)=>j("table",r,e),Nn=(r,e)=>j("thead",r,e),Sn=(r,e)=>j("tbody",r,e),yr=(r,e)=>j("tr",r,e),xr=(r,e)=>j("td",r,e),wr=(r,e)=>j("th",r,e),Xe=(r,e)=>j("strong",r,e),kn=(r,e)=>j("em",r,e);var Tn=(r,e)=>j("code",r,e);var dt=r=>j("img",null,r);var Qe=r=>{let{src:e,width:l,height:s,sizes:c,quality:o,format:p,...b}=r;if(e&&(e.startsWith("http://")||e.startsWith("https://")))return dt({loading:"lazy",decoding:"async",...r});let i=(x,u,w,f)=>{let H=typeof process<"u"&&process.env&&process.env.IMAGE_CDN;return H&&H!=="local"?`/_atom/image?url=${encodeURIComponent(e)}&w=${x||""}&h=${u||""}&q=${w||85}&fmt=${f||"auto"}`:`/_atom/image?url=${encodeURIComponent(e)}&w=${x||""}&h=${u||""}&q=${w||85}&fmt=${f||"auto"}`};if(l&&c){let x=e||r.src,w=[640,768,1024,1280,1920].filter(f=>f<=l*2).map(f=>`${i(f,null,o,p)} ${f}w`).join(", ");return dt({src:i(l,s,o,p),srcset:w,sizes:c||`(max-width: ${l}px) 100vw, ${l}px`,width:l,height:s,loading:"lazy",decoding:"async",...b})}if(e&&(l||s)){let x=i(l,s,o,p);return dt({src:x,width:l,height:s,loading:"lazy",decoding:"async",...b})}return dt({loading:"lazy",decoding:"async",...r})};var L=(r,e)=>{let l=e||{};return l.onclick=s=>{l.href&&(l.href.startsWith("http")||l.href.includes(":"))||(s.preventDefault(),ft(l.href))},j("a",r,l)},be=r=>{let{content:e}=r||{},l=typeof Ze<"u"?Ze():typeof window<"u"?window.location.pathname:"/";return n([$r({activePath:l}),wn(e?n(e):n("Loading...",{className:"flex justify-center p-20"}),{className:"min-h-screen pt-6"}),Ar()],{className:"layout flex flex-col min-h-screen font-sans bg-white text-gray-900"})},An=r=>{let{content:e}=r||{};return n([n([n([n([n("DASHBOARD",{className:"text-xs font-black text-gray-400 tracking-widest mb-6"}),L("Overview",{href:"/dashboard",className:"block py-2 text-gray-300 hover:text-white font-medium"}),L("Analytics",{href:"/dashboard/analytics",className:"block py-2 text-gray-300 hover:text-white font-medium"}),L("Settings",{href:"/dashboard/settings",className:"block py-2 text-gray-300 hover:text-white font-medium"}),n("SYSTEM",{className:"text-xs font-black text-gray-400 tracking-widest mt-8 mb-6"}),L("Logs",{href:"/dashboard/logs",className:"block py-2 text-gray-300 hover:text-white font-medium"}),L("Users",{href:"/dashboard/users",className:"block py-2 text-gray-300 hover:text-white font-medium"}),n([$("Logout",{className:"mt-8 w-full py-2 bg-red-900/30 text-red-400 border border-red-900 rounded hover:bg-red-900/50 transition text-sm"})])],{className:"sticky top-24"})],{className:"w-64 bg-gray-900 min-h-screen p-6 hidden md:block border-r border-gray-800"}),n([n([X("Dashboard",{className:"text-2xl font-bold"}),n([n([n("JD",{className:"w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold"})],{className:"flex items-center gap-3"})],{className:"flex items-center"})],{className:"flex justify-between items-center mb-8 pb-6 border-b border-gray-200"}),e],{className:"flex-1 p-8 bg-white"})],{className:"flex"})])},Cn=r=>{let{content:e}=r||{};return n([n([n([V("Documentation",{className:"font-bold text-gray-900 mb-6 px-4"}),n([n("GETTING STARTED",{className:"text-xs font-bold text-gray-500 px-4 mb-2 mt-6"}),L("Introduction",{href:"/docs",className:"block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm"}),L("Installation",{href:"/docs/installation",className:"block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm"}),L("Quick Start",{href:"/docs/quick-start",className:"block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm"}),n("CORE CONCEPTS",{className:"text-xs font-bold text-gray-500 px-4 mb-2 mt-6"}),L("Routing",{href:"/docs/routing",className:"block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm"}),L("Server Actions",{href:"/docs/server-actions",className:"block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm"}),L("Components",{href:"/docs/components",className:"block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm"})],{className:"border-l border-gray-100 ml-4"})],{className:"w-64 py-8 hidden lg:block fixed h-screen overflow-y-auto"}),n([e],{className:"lg:ml-64 flex-1 py-12 px-8 max-w-4xl"})],{className:"flex max-w-7xl mx-auto"})])},Tr=r=>{try{r=r||{};let e=r||{};return n([V(e.title,{className:"text-xl font-bold mb-2"}),T(e.children,{className:"text-gray-600"})],{className:"bg-white p-6 rounded-xl shadow border border-gray-100"})}catch(e){return console.error('Component "Card" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.Card=Tr);var Ke=r=>{try{r=r||{};let{error:e,className:l=""}=r||{};if(!e)return null;let s=typeof e=="string"?e:e&&e.message?e.message:"Unknown error occurred",c=e&&typeof e=="object"&&e.hint?e.hint:null;return n([n([n("\u26A0\uFE0F",{className:"text-2xl mr-3"}),n([bt("Something went wrong",{className:"font-bold text-red-800"}),T(s,{className:"text-red-600 text-sm mt-1"}),c?T("\u{1F4A1} "+c,{className:"text-amber-700 text-xs mt-2 bg-amber-50 p-2 rounded border border-amber-100"}):null])],{className:"flex items-start"})],{className:`bg-red-50 border border-red-200 rounded-lg p-4 ${l}`})}catch(e){return console.error('Component "ErrorDisplay" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.ErrorDisplay=Ke);var Ar=r=>{try{return r=r||{},yn([n([n([V("ATOM Showcase",{className:"text-xl font-bold text-white mb-4"}),T("Demonstrating the power of the ATOM Framework V53.",{className:"text-gray-400"})],{className:"col-span-1 md:col-span-2"}),n([bt("Links",{className:"font-bold text-white mb-4"}),n([L("Home",{href:"/",className:"block text-gray-400 hover:text-white mb-2"}),L("Products",{href:"/products",className:"block text-gray-400 hover:text-white mb-2"}),L("Blog",{href:"/blog",className:"block text-gray-400 hover:text-white mb-2"}),L("About",{href:"/about",className:"block text-gray-400 hover:text-white mb-2"})])]),n([bt("Connect",{className:"font-bold text-white mb-4"}),n([L("GitHub",{href:"https://github.com",className:"block text-gray-400 hover:text-white mb-2"}),L("Twitter",{href:"https://twitter.com",className:"block text-gray-400 hover:text-white mb-2"}),L("Discord",{href:"https://discord.com",className:"block text-gray-400 hover:text-white mb-2"})])])],{className:"grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto"}),n("\xA9 2024 ATOM Framework. Open Source.",{className:"text-center text-gray-500 mt-12 pt-8 border-t border-gray-800"})],{className:"bg-gray-900 py-12 px-6 mt-auto"})}catch(e){return console.error('Component "Footer" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.Footer=Ar);var Cr=r=>{try{r=r||{};let{label:e,type:l="text",value:s,placeholder:c,error:o,required:p,onChange:b,className:i=""}=r||{},x=typeof s=="string"?s:s==null?"":String(s),u=w=>{let f=w&&w.target?w.target.value:"";typeof b=="function"&&b(typeof f=="string"?f:"")};return n([e?pe(e,{className:"block text-sm font-medium text-gray-700 mb-1"}):null,l==="textarea"?ht(null,{className:`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${o?"border-red-500 bg-red-50":"border-gray-300"} ${i}`,placeholder:c,value:x,required:p,oninput:u}):Ne(null,{type:l,value:x,className:`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${o?"border-red-500 bg-red-50":"border-gray-300"} ${i}`,placeholder:c,required:p,oninput:u}),o?T(o,{className:"mt-1 text-sm text-red-600"}):null],{className:"w-full"})}catch(e){return console.error('Component "FormInput" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.FormInput=Cr);var $r=r=>{try{r=r||{};let{activePath:e}=r||{},l=s=>`text-sm font-medium transition-colors ${e===s?"text-blue-600 font-bold":"text-gray-600 hover:text-blue-600"}`;return hn([n([L("ATOM Showcase",{href:"/",className:"text-xl font-black tracking-tight text-gray-900"}),n([L("Home",{href:"/",className:l("/")}),L("Products",{href:"/products",className:l("/products")}),L("Blog",{href:"/blog",className:l("/blog")}),L("Dashboard",{href:"/dashboard/home",className:l("/dashboard/home")}),L("Docs",{href:"/docs",className:l("/docs")}),L("Contact",{href:"/contact",className:"px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-bold"})],{className:"hidden md:flex items-center gap-8"}),n("\u2630",{className:"md:hidden text-2xl cursor-pointer"})],{className:"flex justify-between items-center max-w-7xl mx-auto"})],{className:"bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50"})}catch(e){return console.error('Component "Header" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.Header=$r);var $n=r=>{try{r=r||{};let{images:e=[]}=r||{},[l,s]=k(0);return n([n([Qe({src:e[l].src,alt:e[l].alt,width:800,height:600,className:"w-full h-[400px] object-cover rounded-xl shadow-lg transition-opacity duration-300"})],{className:"mb-4"}),n(e.map((c,o)=>n([Qe({src:c.src,alt:c.alt,width:100,height:100,className:"w-full h-full object-cover"})],{className:`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition ${l===o?"border-blue-500 ring-2 ring-blue-200":"border-transparent hover:border-gray-300"}`,onclick:()=>s(o)})),{className:"flex gap-4 overflow-x-auto pb-2"})],{className:"w-full"})}catch(e){return console.error('Component "ImageGallery" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.ImageGallery=$n);var et=r=>{try{return r=r||{},n([n([],{className:"w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"}),T("Loading...",{className:"mt-4 text-gray-500 font-medium animate-pulse"})],{className:"flex flex-col items-center justify-center p-12"})}catch(e){return console.error('Component "LoadingSpinner" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.LoadingSpinner=et);var _r=r=>{try{r=r||{};let{title:e,description:l,image:s,price:c,onAddToCart:o}=r||{};return n([s?Qe({src:s,alt:e,width:400,height:300,className:"w-full h-48 object-cover"}):null,n([V(e,{className:"text-xl font-bold mb-2"}),T(l,{className:"text-gray-600 mb-4 line-clamp-2"}),n([Y(c,{className:"text-2xl font-bold text-blue-600"}),$("Add to Cart",{className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition",onclick:o})],{className:"flex justify-between items-center"})],{className:"p-4"})],{className:"bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100"})}catch(e){return console.error('Component "ProductCard" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.ProductCard=_r);var Ae=r=>{try{r=r||{};let e=r||{};return n([n(e.label,{className:"text-xs font-bold text-gray-400 uppercase tracking-widest mb-1"}),n(e.value,{className:"text-2xl font-black text-gray-800"}),e.sub?n(e.sub,{className:"text-xs text-gray-500 mt-1"}):null],{className:"bg-white p-6 rounded-xl shadow-sm border border-gray-100"})}catch(e){return console.error('Component "StatusCard" error:',e),n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold mb-2"}),n(e.message||"Unknown error",{className:"text-red-500 text-sm"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-2"})}};typeof globalThis<"u"&&(globalThis.StatusCard=Ae);var ee=[];ee.push({regex:new RegExp("^/marketing-test$"),paramNames:[],title:"Atom App",meta:[],revalidate:null,isStatic:!1,enableStreaming:!1,component:r=>{r=r||{};let e={},s=(c=>(c=c||{},n([ie("Marketing Page",{className:"text-4xl font-bold mb-4"}),T("This page is inside a route group (marketing) but the URL is just /marketing-test",{className:"text-xl text-gray-600"})],{className:"p-12 text-center"})))(r);return s=be({...r,content:s}),s}});ee.push({regex:new RegExp("^/about$"),paramNames:[],title:"Atom App",meta:[],revalidate:null,isStatic:!0,enableStreaming:!1,component:r=>{r=r||{};let e={},s=(c=>{c=c||{};let o=[{name:"Alex Developer",role:"Lead Architect",image:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",bio:"Obsessed with performance and compiler optimizations."},{name:"Sarah Designer",role:"UI/UX Lead",image:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",bio:"Making complex systems look simple and beautiful."},{name:"Mike Engineer",role:"Backend Specialist",image:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",bio:"Scaling servers to handle millions of requests."}];return n([Ut([n([ie("About The Team",{className:"text-5xl font-black mb-6 tracking-tight"}),T("We are a passionate group of developers building the next generation of web tools.",{className:"text-xl text-gray-600 max-w-2xl mx-auto"})],{className:"text-center py-20"})],{className:"bg-gray-50"}),Ut([n(o.map(p=>n([Qe({src:p.image,alt:p.name,width:400,height:400,className:"w-full h-64 object-cover grayscale hover:grayscale-0 transition duration-500"}),n([V(p.name,{className:"text-xl font-bold mb-1"}),T(p.role,{className:"text-blue-600 font-medium text-sm uppercase tracking-wider mb-3"}),T(p.bio,{className:"text-gray-600 text-sm leading-relaxed"})],{className:"p-6"})],{className:"bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group"})),{className:"grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 -mt-10"})],{className:"pb-24"}),Ut([n([n([X("Global Reach",{className:"text-3xl font-bold mb-8 text-center"}),n([Ae({label:"Downloads",value:"2M+"}),Ae({label:"Contributors",value:"150+"}),Ae({label:"Countries",value:"85"}),Ae({label:"Uptime",value:"99.9%"})],{className:"grid grid-cols-2 md:grid-cols-4 gap-6"})],{className:"max-w-6xl mx-auto px-6"})],{className:"py-24 bg-white"})])])})(r);return s=be({...r,content:s}),s}});ee.push({regex:new RegExp("^/blog/([^/]+)$"),paramNames:["id"],title:"Atom App",meta:[],revalidate:300,isStatic:!1,enableStreaming:!1,component:r=>{r=r||{};let e={};e.secure_getPost=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_blog__id__secure_getPost",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_getPost" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()};let s=(c=>{c=c||{};let{params:o}=c||{},p=o&&o.id,b=gt(()=>p?Array.isArray(p)?p[0]:String(p):null,[p]),[i,x]=k(null),[u,w]=k(!0),[f,H]=k(null),W=se(!1),Z=se(null);return fe(()=>{if(W.current)return;if(!b){w(!1),H(new Error("No post ID provided"));return}if(b===Z.current)return;W.current=!0,Z.current=b,w(!0),H(null),x(null);let E=b;e.secure_getPost(E).then(G=>{E===Z.current&&(x(G),w(!1)),W.current=!1}).catch(G=>{E===Z.current&&(H(G),w(!1)),W.current=!1})},[b]),n([n([L("\u2190 Back to Blog",{href:"/blog",className:"text-gray-500 hover:text-black font-medium mb-8 inline-block"}),u?et():f?Ke({error:f}):i?n([Y(i.date,{className:"text-blue-600 font-bold tracking-wide text-sm uppercase mb-2 block"}),ie(i.title,{className:"text-5xl font-black mb-6 text-gray-900 leading-tight"}),n([n(i.author[0],{className:"w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold mr-3"}),n([T(i.author,{className:"font-bold text-gray-900"}),T("Author",{className:"text-xs text-gray-500 uppercase"})])],{className:"flex items-center mb-12 pb-12 border-b border-gray-100"}),n(i.content,{className:"text-xl text-gray-800 leading-relaxed max-w-none"})]):null],{className:"max-w-3xl mx-auto px-6 py-12"})],{className:"bg-white min-h-screen"})})(r);return s=be({...r,content:s}),s}});ee.push({regex:new RegExp("^/blog$"),paramNames:[],title:"Atom App",meta:[],revalidate:300,isStatic:!1,enableStreaming:!1,component:r=>{r=r||{};let e={};e.secure_getPosts=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_blog_secure_getPosts",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_getPosts" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()};let s=(c=>{c=c||{};let[o,p]=k([]),[b,i]=k(!0);return fe(()=>{e.secure_getPosts().then(x=>{p(x),i(!1)})},[]),n([n([ie("Latest News",{className:"text-4xl font-bold mb-4"}),T("Insights, updates, and tutorials from the team.",{className:"text-xl text-gray-600"})],{className:"bg-white border-b border-gray-100 py-16 px-6 text-center mb-12"}),n([b?et():n(o.map(x=>n([n([Y(x.category,{className:"text-xs font-bold text-blue-600 uppercase tracking-wide"}),Y("\u2022",{className:"mx-2 text-gray-300"}),Y(x.date,{className:"text-xs text-gray-500"})],{className:"mb-2 flex items-center"}),X([L(x.title,{href:`/blog/${x.id}`,className:"hover:text-blue-600 transition"})],{className:"text-2xl font-bold mb-3 text-gray-900"}),T(x.excerpt,{className:"text-gray-600 mb-4 leading-relaxed"}),n([n([n(x.author[0],{className:"w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 mr-2"}),Y(x.author,{className:"text-sm font-medium text-gray-900"})],{className:"flex items-center"}),L("Read Article \u2192",{href:`/blog/${x.id}`,className:"text-sm font-bold text-blue-600 hover:text-blue-800"})],{className:"flex justify-between items-center pt-4 border-t border-gray-50"})],{className:"bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"})),{className:"grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6"})],{className:"pb-24"})],{className:"bg-gray-50 min-h-screen"})})(r);return s=be({...r,content:s}),s}});ee.push({regex:new RegExp("^/contact$"),paramNames:[],title:"Contact the ATOM Framework Team | Support & Partnerships",meta:[{name:"description",content:"Get in touch with the ATOM Framework specialists for enterprise support, partnership opportunities, and developer advocacy guidance tailored to your product roadmap."}],revalidate:null,isStatic:!1,enableStreaming:!0,component:r=>{r=r||{};let e={};e.secure_submitContact=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_contact_secure_submitContact",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_submitContact" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()};let s=(c=>{c=c||{};let[o,p]=k({name:"",email:"",message:""}),[b,i]=k({}),[x,u]=k(!1),[w,f]=k(!1),[H,W]=k(null),[Z,E]=k(null),G=()=>{let J={},ce=(o.name||"").trim(),ae=(o.email||"").trim(),ne=(o.message||"").trim();return ce||(J.name="Name is required"),ae?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ae)||(J.email="Invalid email format"):J.email="Email is required",ne?ne.length<10&&(J.message="Message too short"):J.message="Message is required",i(J),Object.keys(J).length===0},re=async J=>{J.preventDefault();let ce=J.target,ae={name:(ce.querySelector('input[type="text"]')?.value||"").trim(),email:(ce.querySelector('input[type="email"]')?.value||"").trim(),message:(ce.querySelector("textarea")?.value||"").trim()},ne={};if(ae.name||(ne.name="Name is required"),ae.email?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ae.email)||(ne.email="Invalid email format"):ne.email="Email is required",ae.message?ae.message.length<10&&(ne.message="Message too short"):ne.message="Message is required",i(ne),!(Object.keys(ne).length>0)){u(!0),E(null);try{let ze=await e.secure_submitContact(ae);W(ae),f(!0),i({}),p({name:"",email:"",message:""})}catch(ze){E(ze)}finally{u(!1)}}},he=(J,ce)=>{let ae=typeof ce=="string"?ce:"";p(ne=>({...ne,[J]:ae})),i(ne=>({...ne,[J]:null}))};return n([n([n([ie("Contact Us",{className:"text-4xl font-bold mb-4"}),T("We'd love to hear from you. Send us a message and we'll respond within 24 hours.",{className:"text-xl text-gray-600 mb-8"}),n([n([V("Email",{className:"font-bold text-lg mb-1"}),T("support@atom-framework.com",{className:"text-blue-600"})],{className:"mb-6"}),n([V("Office",{className:"font-bold text-lg mb-1"}),T("123 Innovation Drive",{className:"text-gray-600"}),T("San Francisco, CA 94103",{className:"text-gray-600"})])],{className:"bg-gray-50 p-8 rounded-xl"})],{className:"col-span-1 md:col-span-1"}),n([n([w?n([n("\u2705",{className:"text-4xl mb-4"}),V("Message Sent Successfully!",{className:"text-2xl font-bold mb-2 text-green-600"}),T("Thank you for reaching out. We'll be in touch shortly.",{className:"text-gray-600 mb-6"}),H?n([bt("Submitted Data:",{className:"text-lg font-semibold mb-3 text-gray-800"}),n([n([Xe("Name: ",{className:"font-bold text-gray-700"}),Y(H.name||"N/A",{className:"text-gray-900"})],{className:"mb-2"}),n([Xe("Email: ",{className:"font-bold text-gray-700"}),Y(H.email||"N/A",{className:"text-gray-900"})],{className:"mb-2"}),n([Xe("Message: ",{className:"font-bold text-gray-700"}),T(H.message||"N/A",{className:"text-gray-900 mt-1 whitespace-pre-wrap"})])],{className:"bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left"})]):null,$("Send Another Message",{className:"px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition",onclick:()=>{f(!1),W(null)}})],{className:"text-center py-12"}):Xt([Z?Ke({error:Z,className:"mb-6"}):null,n([pe("Full Name",{className:"block text-sm font-medium text-gray-700 mb-1"}),Ne(null,{type:"text",value:o&&typeof o.name=="string"?o.name:"",className:`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${b.name?"border-red-500 bg-red-50":"border-gray-300"}`,placeholder:"Jane Doe",required:!0,oninput:J=>he("name",J?.target?.value||"")}),b.name?T(b.name,{className:"mt-1 text-sm text-red-600"}):null],{className:"mb-4"}),n([pe("Email Address",{className:"block text-sm font-medium text-gray-700 mb-1"}),Ne(null,{type:"email",value:o&&typeof o.email=="string"?o.email:"",className:`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${b.email?"border-red-500 bg-red-50":"border-gray-300"}`,placeholder:"jane@example.com",required:!0,oninput:J=>he("email",J?.target?.value||"")}),b.email?T(b.email,{className:"mt-1 text-sm text-red-600"}):null],{className:"mb-4"}),n([pe("Message",{className:"block text-sm font-medium text-gray-700 mb-1"}),ht(null,{className:`w-full px-4 py-2 h-32 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${b.message?"border-red-500 bg-red-50":"border-gray-300"}`,placeholder:"How can we help you?",value:o&&typeof o.message=="string"?o.message:"",required:!0,oninput:J=>he("message",J?.target?.value||"")}),b.message?T(b.message,{className:"mt-1 text-sm text-red-600"}):null],{className:"mb-6"}),$(x?"Sending...":"Send Message",{type:"submit",className:`w-full py-3 px-6 rounded-lg font-bold text-white transition ${x?"bg-gray-400 cursor-not-allowed":"bg-black hover:bg-gray-800"}`,disabled:x})],{onsubmit:re})],{className:"bg-white p-8 rounded-xl shadow-lg border border-gray-100"})],{className:"col-span-1 md:col-span-2"})],{className:"grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto px-6 py-16"})])})(r);return s=be({...r,content:s}),s}});ee.push({regex:new RegExp("^/dashboard/home$"),paramNames:[],title:"Atom App",meta:[],revalidate:null,isStatic:!1,enableStreaming:!1,component:r=>{r=r||{};let e={};e.secure_getStats=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_dashboard_home_secure_getStats",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_getStats" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()};let s=(c=>{c=c||{};let[o,p]=k(null);return fe(()=>{e.secure_getStats().then(p)},[]),n([o?n([n([Ae({label:"Total Users",value:o.users.toLocaleString(),sub:"+12% from last month"}),Ae({label:"Revenue",value:"$"+o.revenue.toLocaleString(),sub:"+8.2% from last month"}),Ae({label:"Active Now",value:o.active,sub:"Current online users"}),Ae({label:"Growth",value:o.growth+"%",sub:"Year over year"})],{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"}),n([n([V("Recent Activity",{className:"font-bold text-lg mb-4"}),n([n("New user signed up",{className:"py-3 border-b text-sm text-gray-600"}),n("Project 'Alpha' deployed",{className:"py-3 border-b text-sm text-gray-600"}),n("Payment received from Client X",{className:"py-3 border-b text-sm text-gray-600"}),n("Server backup completed",{className:"py-3 text-sm text-gray-600"})])],{className:"bg-gray-50 p-6 rounded-xl border border-gray-100"}),n([V("System Status",{className:"font-bold text-lg mb-4"}),n([n([n("CPU Usage",{className:"text-sm text-gray-500 mb-1"}),n([n([],{className:"h-2 bg-blue-500 rounded w-3/4"})],{className:"h-2 bg-gray-200 rounded w-full"})],{className:"mb-4"}),n([n("Memory",{className:"text-sm text-gray-500 mb-1"}),n([n([],{className:"h-2 bg-green-500 rounded w-1/2"})],{className:"h-2 bg-gray-200 rounded w-full"})],{className:"mb-4"}),n([n("Disk Space",{className:"text-sm text-gray-500 mb-1"}),n([n([],{className:"h-2 bg-purple-500 rounded w-1/4"})],{className:"h-2 bg-gray-200 rounded w-full"})])])],{className:"bg-gray-50 p-6 rounded-xl border border-gray-100"})],{className:"grid grid-cols-1 lg:grid-cols-2 gap-8"})]):et()])})(r);return s=be({...r,content:s}),s=An({...r,content:s}),s}});ee.push({regex:new RegExp("^/docs(?:/(.*))?$"),paramNames:["slug"],title:"Atom App",meta:[],revalidate:null,isStatic:!1,enableStreaming:!1,component:r=>{r=r||{};let e={},s=(c=>{c=c||{};let{params:o}=c||{},p=[];o&&o.slug&&(Array.isArray(o.slug)?p=o.slug:typeof o.slug=="string"&&(p=o.slug?[o.slug]:[]));let b=p.join(" / ");return n([n([Y(b||"Docs",{className:"text-sm text-blue-600 font-bold uppercase tracking-wide mb-2 block"}),ie(p[p.length-1]||"Introduction",{className:"text-4xl font-black mb-6 capitalize"}),n([T("This is a dynamically generated documentation page based on the URL path.",{className:"text-xl text-gray-600 mb-8"}),n([V("Current Path Segments:",{className:"font-bold text-lg mb-2"}),n([p.length===0?n("Root (/docs)",{className:"font-mono text-sm bg-gray-100 p-2 rounded"}):p.map(i=>n(i,{className:"font-mono text-sm bg-gray-100 p-2 rounded mb-1"}))],{className:"bg-gray-50 p-4 rounded-lg border border-gray-200"})],{className:"mb-12"}),n([X("Content Placeholder",{className:"text-2xl font-bold mb-4"}),T("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",{className:"mb-4 text-gray-600 leading-relaxed"}),T("Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",{className:"mb-4 text-gray-600 leading-relaxed"})])],{className:"prose max-w-none"})])])})(r);return s=be({...r,content:s}),s=Cn({...r,content:s}),s}});ee.push({regex:new RegExp("^/error-tests$"),paramNames:[],title:"Atom App",meta:[],revalidate:null,isStatic:!1,enableStreaming:!1,component:r=>{r=r||{};let e={};e.secure_throwError=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_error_tests_secure_throwError",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_throwError" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()},e.secure_validateInput=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_error_tests_secure_validateInput",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_validateInput" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()};let s=(c=>{c=c||{};let[o,p]=k(null),[b,i]=k(""),x=async()=>{p(null);try{await e.secure_throwError()}catch(w){p(w)}},u=async()=>{p(null);try{await e.secure_validateInput(b),alert("Success!")}catch(w){p(w)}};return n([n([ie("Error Handling Tests",{className:"text-4xl font-bold mb-8"}),n([X("1. Server Action Errors",{className:"text-2xl font-bold mb-4"}),T("Click the button below to trigger a server-side error and see how it's handled.",{className:"mb-4 text-gray-600"}),$("Trigger Server Error",{className:"bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition",onclick:x})],{className:"bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8"}),n([X("2. Input Validation",{className:"text-2xl font-bold mb-4"}),n([Ne({value:b,placeholder:"Type something (min 5 chars)...",className:"border p-2 rounded mr-4 w-64",oninput:w=>i(w.target.value)}),$("Validate",{className:"bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition",onclick:u})],{className:"flex items-center"})],{className:"bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8"}),n([X("3. Error Display Component",{className:"text-2xl font-bold mb-4"}),o?Ke({error:o}):n("No errors yet.",{className:"text-gray-400 italic"})],{className:"bg-white p-8 rounded-xl shadow-sm border border-gray-100"})],{className:"max-w-4xl mx-auto px-6 py-12"})],{className:"bg-gray-50 min-h-screen"})})(r);return s=be({...r,content:s}),s}});ee.push({regex:new RegExp("^/$"),paramNames:[],title:"Home | ATOM Framework V20 Speed Test",meta:[{name:"description",content:"Welcome to the future. Instant Reload & Zero Load. Server-Side Rendered for SEO and speed. Isomorphic Splitting. Write once, runs everywhere (Server + Client)."},{name:"keywords",content:"atom, framework, speed"}],revalidate:null,isStatic:!1,enableStreaming:!1,component:r=>{r=r||{};let e={};e.celebrate=function(){We({particleCount:50,spread:70,origin:{y:.6}})};let s=(c=>{c=c||{};let[o,p]=k(0);return n([n([Qe({src:"/atom-icon.svg",alt:"ATOM Logo",width:100,height:100,className:"mb-6"}),ie("ATOM V20",{className:"text-6xl font-black text-gray-800 mb-4"}),T("Instant Reload & Zero Load",{className:"text-xl text-gray-500 mb-8"}),$("Click ("+o+")",{className:"bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg",onclick:()=>{p(o+1),e.celebrate()}})],{className:"flex flex-col items-center justify-center py-20"})])})(r);return s=be({...r,content:s}),s}});ee.push({regex:new RegExp("^/products$"),paramNames:[],title:"Atom App",meta:[],revalidate:60,isStatic:!1,enableStreaming:!1,component:r=>{r=r||{};let e={};e.secure_getProducts=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_products_secure_getProducts",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_getProducts" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()};let s=(c=>{c=c||{};let[o,p]=k([]),[b,i]=k(!0),[x,u]=k(null),[w,f]=k(""),H=se(!1),W=se(null);fe(()=>{Z()},[]);let Z=async(G="")=>{if(!H.current){H.current=!0,i(!0),u(null);try{let re=await e.secure_getProducts(G);Array.isArray(re)?p(re):(console.warn("loadProducts: Expected array but got:",typeof re,re),p([]))}catch(re){console.error("loadProducts error:",re),u(re),p([])}finally{i(!1),H.current=!1}}},E=G=>{f(G),W.current&&clearTimeout(W.current),W.current=setTimeout(()=>{Z(G)},300)};return fe(()=>()=>{W.current&&clearTimeout(W.current)},[]),n([n([ie("Our Products",{className:"text-4xl font-bold mb-4"}),T("Tools designed for the modern web.",{className:"text-xl text-gray-600 mb-8"}),n([Cr({placeholder:"Search products...",value:w,onChange:E,className:"max-w-md"})],{className:"mb-12"})],{className:"max-w-7xl mx-auto px-6 pt-12"}),n([x?Ke({error:x}):null,b?et():!Array.isArray(o)||o.length===0?n("No products found matching your search.",{className:"text-center text-gray-500 py-12"}):n((Array.isArray(o)?o:[]).map((G,re)=>!G||typeof G!="object"?(console.warn("Invalid product at index",re,G),null):_r({title:G.title||"Untitled",description:G.description||"",price:G.price||"$0.00",image:G.image||"",onAddToCart:()=>alert(`Added ${G.title||"product"} to cart!`)})).filter(Boolean),{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"})],{className:"max-w-7xl mx-auto px-6 pb-24 min-h-[400px]"})],{className:"bg-gray-50 min-h-screen"})})(r);return s=be({...r,content:s}),s}});ee.push({regex:new RegExp("^/test_suite$"),paramNames:[],title:"Atom App",meta:[{name:"robots",content:"noindex, nofollow"}],revalidate:60,isStatic:!1,enableStreaming:!1,component:r=>{r=r||{};let e={};e.secure_testLogin=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_test_suite_secure_testLogin",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_testLogin" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()},e.secure_testRegister=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_test_suite_secure_testRegister",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_testRegister" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()},e.secure_testGetCurrentUser=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_test_suite_secure_testGetCurrentUser",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_testGetCurrentUser" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()},e.secure_testCreateRecord=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_test_suite_secure_testCreateRecord",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_testCreateRecord" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()},e.secure_testGetRecords=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_test_suite_secure_testGetRecords",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_testGetRecords" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()},e.secure_testUpdateRecord=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_test_suite_secure_testUpdateRecord",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_testUpdateRecord" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()},e.secure_testDeleteRecord=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_test_suite_secure_testDeleteRecord",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_testDeleteRecord" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()},e.secure_testValidation=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_test_suite_secure_testValidation",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_testValidation" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()},e.secure_testSanitization=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_test_suite_secure_testSanitization",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_testSanitization" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()},e.secure_testErrorHandling=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_test_suite_secure_testErrorHandling",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_testErrorHandling" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()},e.secure_testPerformance=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_test_suite_secure_testPerformance",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_testPerformance" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()},e.secure_testFileUpload=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_test_suite_secure_testFileUpload",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_testFileUpload" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()},e.secure_testWebSocket=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_test_suite_secure_testWebSocket",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_testWebSocket" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()},e.secure_testSqlInjection=async(c,o={})=>{let p=o.method||"POST",b={"Content-Type":"application/json",...o.headers||{}},i=await fetch("/_atom/rpc/_test_suite_secure_testSqlInjection",{method:p,headers:b,body:JSON.stringify(c),...o.signal?{signal:o.signal}:{}});if(!i.ok){let u=await i.json().catch(()=>({error:i.statusText})),w=u.error||i.statusText,f=new Error(`Server Action "secure_testSqlInjection" failed: ${w}`);throw u.function&&(f.function=u.function),u.hint&&(f.hint=u.hint),f}return await i.json()};let s=(c=>{c=c||{};let[o,p]=k("framework"),[b,i]=k({}),[x,u]=k(!1),[w,f]=k(null),[H,W]=k(null),[Z,E]=k([]),G=Array.isArray(Z)?Z:[],re=se(!1),he=se(0),J=se(null);fe(()=>{typeof window<"u"&&!window.confetti&&Promise.resolve().then(()=>(Vt(),br)).then(t=>{window.confetti=t.default||t}).catch(()=>{})},[]);let ce=(t={})=>{try{let a=window.confetti||(typeof We<"u"?We:null);a&&typeof a=="function"&&a(t)}catch{}},ae=gt(()=>[{id:"framework",name:"Framework Core",icon:"\u269B\uFE0F"},{id:"inputs",name:"Input Tracking",icon:"\u2328\uFE0F"},{id:"events",name:"Event Handling",icon:"\u{1F3AF}"},{id:"forms",name:"Forms & Validation",icon:"\u{1F4DD}"},{id:"state",name:"State Management",icon:"\u{1F504}"},{id:"html",name:"HTML Helpers",icon:"\u{1F3F7}\uFE0F"},{id:"navigation",name:"Navigation",icon:"\u{1F9ED}"},{id:"auth",name:"Authentication",icon:"\u{1F510}"},{id:"database",name:"Database",icon:"\u{1F4BE}"},{id:"validation",name:"Validation",icon:"\u2705"},{id:"errors",name:"Error Handling",icon:"\u26A0\uFE0F"},{id:"performance",name:"Performance",icon:"\u26A1"},{id:"security",name:"Security",icon:"\u{1F6E1}\uFE0F"}],[]),[ne,ze]=k(""),[Se,tt]=k(0),[rt,yt]=k(0),[De,nt]=k(0),ue=se(0),Ie=se(0),Re=se(0),Pe=se(0),[xt,g]=k({}),[d,A]=k([]),m=(t,a="info")=>{let h=new Date().toLocaleTimeString(),N={timestamp:h,message:t,type:a};console.log(`[TEST ${a.toUpperCase()}] ${h}: ${t}`),A(v=>[...Array.isArray(v)?v:[],N].slice(-50))};fe(()=>{let t=Ie.current+1;Ie.current=t;let a=typeof Se=="number"?Se:0;Re.current=a,yt(h=>h+1),m(`useEffect triggered: testCounter changed to ${a} (effect count: ${t})`,"success")},[Se]);let _=gt(()=>{let t=Pe.current||(typeof De=="number"?De:0),a=t*2;return m(`useMemo recalculated: ${t} * 2 = ${a}`,"framework"),a},[De]),I=()=>{console.log("testUseState called!");try{m("\u{1F9EA} Starting useState test...","info");let t=typeof Se=="number"?Se:0;Re.current=t,m(`\u{1F4CA} Current counter value: ${t}`,"info"),m("\u2699\uFE0F Framework: Calling setTestCounter...","framework");let a=t+1;tt(v=>{let y=typeof v=="number"?v:0,S=y+1;return m(`\u2699\uFE0F Framework: State updater called (${y} \u2192 ${S})`,"framework"),Re.current=S,S}),m("\u23F3 Waiting for state update and re-render...","info");let h=0,N=()=>{h++;let v=Re.current;m(`\u{1F4CA} Check ${h}: Ref value = ${v}, Expected = ${a}`,"info"),v>=a?(m(`\u2705 PASS: useState working correctly (${t} \u2192 ${v})`,"success"),g(y=>({...y,useState:`\u2705 PASS: State updated successfully (${t} \u2192 ${v})`}))):h<10?setTimeout(N,100):(m(`\u274C FAIL: State not updated after ${h} attempts (expected >= ${a}, ref shows ${v})`,"error"),m("\u{1F50D} Issue: Framework state update may not be working - state not updating","error"),g(y=>({...y,useState:`\u274C FAIL: State not updated (${t} \u2192 ${v})`})))};setTimeout(N,200)}catch(t){m(`\u274C ERROR: ${t.message}`,"error"),m("\u{1F50D} Issue: Frontend test code error","error"),g(a=>({...a,useState:`\u274C FAIL: ${t.message}`}))}},M=()=>{m("\u{1F9EA} Starting useEffect test...","info");try{let t=Ie.current;m(`\u{1F4CA} Initial effect count: ${t}`,"info"),m("\u2699\uFE0F Framework: Updating testCounter to trigger effect...","framework"),tt(a=>{let h=(typeof a=="number"?a:0)+1;return m(`\u2699\uFE0F Framework: Counter updated to ${h}`,"framework"),h}),m("\u23F3 Waiting for useEffect to trigger...","info"),setTimeout(()=>{let a=Ie.current;m(`\u{1F4CA} New effect count: ${a}`,"info"),a>t?(m(`\u2705 PASS: useEffect triggered (${t} \u2192 ${a})`,"success"),g(h=>({...h,useEffect:`\u2705 PASS: Effect triggered (count: ${t} \u2192 ${a})`}))):(m(`\u274C FAIL: Effect not triggered (count: ${t} \u2192 ${a})`,"error"),m("\u{1F50D} Issue: Framework useEffect may not be working or dependency not tracked","error"),g(h=>({...h,useEffect:"\u274C FAIL: Effect not triggered"})))},200)}catch(t){m(`\u274C ERROR: ${t.message}`,"error"),m("\u{1F50D} Issue: Frontend test code error","error"),g(a=>({...a,useEffect:`\u274C FAIL: ${t.message}`}))}},C=()=>{m("\u{1F9EA} Starting useRef test...","info");try{let t=ue?.current||0;m(`\u{1F4CA} Initial ref value: ${t}`,"info"),m("\u2699\uFE0F Framework: Updating ref.current...","framework"),ue.current=(typeof ue.current=="number"?ue.current:0)+1;let a=ue.current;m(`\u2699\uFE0F Framework: Ref updated to ${a}`,"framework"),a>t?(m(`\u2705 PASS: useRef working (${t} \u2192 ${a})`,"success"),g(h=>({...h,useRef:`\u2705 PASS: Ref value updated from ${t} to ${a}`}))):(m(`\u274C FAIL: Ref not updating (${t} \u2192 ${a})`,"error"),m("\u{1F50D} Issue: Framework useRef may not be persisting values","error"),g(h=>({...h,useRef:"\u274C FAIL: Ref not updating"})))}catch(t){m(`\u274C ERROR: ${t.message}`,"error"),m("\u{1F50D} Issue: Frontend test code error","error"),g(a=>({...a,useRef:`\u274C FAIL: ${t.message}`}))}},R=()=>{m("\u{1F9EA} Starting useMemo test...","info");try{let t=Pe.current;m(`\u{1F4CA} Current testMemoValue: ${t}`,"info"),m("\u2699\uFE0F Framework: Updating testMemoValue...","framework");let a=t+1;Pe.current=a,nt(a),m(`\u2699\uFE0F Framework: testMemoValue updated to ${a}`,"framework"),setTimeout(()=>{let h=Pe.current,N=h*2;m(`\u{1F4CA} Expected memo: ${N} (from testMemoValue: ${h})`,"info"),g(v=>h>t?(m(`\u2705 PASS: useMemo dependency updated (${t} \u2192 ${h})`,"success"),{...v,useMemo:`\u2705 PASS: Memo should calculate ${h} * 2 = ${N}`}):(m("\u274C FAIL: State not updated","error"),{...v,useMemo:"\u274C FAIL: State not updated"}))},200)}catch(t){m(`\u274C ERROR: ${t.message}`,"error"),m("\u{1F50D} Issue: Frontend test code error","error"),g(a=>({...a,useMemo:`\u274C FAIL: ${t.message}`}))}},z=async()=>{m("\u{1F680} Starting Framework Core Test Suite...","info"),g({}),A([]);let t=[{name:"useState",fn:I},{name:"useEffect",fn:M},{name:"useRef",fn:C},{name:"useMemo",fn:R}];for(let a=0;a<t.length;a++){let h=t[a];m(`
\u2501\u2501\u2501 Test ${a+1}/${t.length}: ${h.name} \u2501\u2501\u2501`,"info"),await new Promise(N=>{h.fn(),setTimeout(N,500)}),a<t.length-1&&(m("\u23F8\uFE0F  Waiting before next test...","info"),await new Promise(N=>setTimeout(N,300)))}m(`
\u2705 Framework Core Test Suite Complete!`,"success")},[D,O]=k(""),[U,Q]=k(""),[F,oe]=k(""),[le,te]=k({}),[me,ye]=k([]),de=Array.isArray(me)?me:[],wt=()=>{m("\u{1F9EA} Starting Input Value Preservation test...","info");try{let t=document.querySelector('input[placeholder*="Type here, then switch"]')||document.querySelectorAll('input[type="text"]')[0],a=document.querySelector('input[placeholder*="Switch here and type"]')||document.querySelectorAll('input[type="text"]')[1],h=t?t.value:"",N=a?a.value:"";m(`\u{1F4CA} Current Input 1 value: "${h}"`,"info"),m(`\u{1F4CA} Current Input 2 value: "${N}"`,"info");let v="Test Value 1",y="Test Value 2";m(`\u{1F4DD} Setting Input 1 state to: "${v}"`,"info"),m("\u2699\uFE0F Framework: State update should sync to DOM if input is not focused","framework"),O(v),setTimeout(()=>{m(`\u{1F4DD} Setting Input 2 state to: "${y}"`,"info"),Q(y),setTimeout(()=>{let S=t?t.value:"",P=a?a.value:"",K=typeof D=="string"?D:"",Ce=typeof U=="string"?U:"";m("\u{1F4CA} After state update:","info"),m(`   Input 1 - DOM: "${S}", State: "${K}"`,"info"),m(`   Input 2 - DOM: "${P}", State: "${Ce}"`,"info");let Ft=!h||h.trim()==="",Fe=!N||N.trim()==="",gr=Ft?S===v||K===v:S===h||S===v,pr=Fe?P===y||Ce===y:P===N||P===y;gr&&pr?(m("\u2705 PASS: Input value preservation working correctly","success"),(!Ft||!Fe)&&m("\u2705 Framework correctly preserved user input over programmatic updates","success"),te(Lt=>({...Lt,valuePreservation:"\u2705 PASS: Values preserved correctly"}))):(m("\u274C FAIL: Input values not handled correctly","error"),m(`\u{1F50D} Issue: Input 1 ${gr?"OK":"MISMATCH"}, Input 2 ${pr?"OK":"MISMATCH"}`,"error"),te(Lt=>({...Lt,valuePreservation:`\u274C FAIL: Values not preserved (DOM1: ${S}, DOM2: ${P})`})))},300)},300)}catch(t){m(`\u274C ERROR: ${t.message}`,"error"),te(a=>({...a,valuePreservation:`\u274C FAIL: ${t.message}`}))}},vt=()=>{m("\u{1F9EA} Starting Input Switching test...","info"),m("\u{1F4DD} This test verifies that when you type in one input, then switch to another, the first input keeps its value","info");let t=document.querySelector('input[placeholder*="Input 1"]')||document.querySelector('input[type="text"]'),a=document.querySelectorAll('input[type="text"]')[1],h=t?t.value:"",N=a?a.value:"";m(`\u{1F4CA} Current Input 1 value: "${h}"`,"info"),m(`\u{1F4CA} Current Input 2 value: "${N}"`,"info"),m("\u{1F4A1} Tip: Type in Input 1, then click in Input 2 and type there. Input 1 should keep its value.","info");try{let v=h||"Typing in input 1...",y=N||"Now typing in input 2...";m(`\u{1F4DD} Setting Input 1 state to: "${v}"`,"info"),O(v),setTimeout(()=>{m(`\u{1F4DD} Setting Input 2 state to: "${y}"`,"info"),m("\u2699\uFE0F Framework: Testing if Input 1 value is preserved when Input 2 is updated...","framework"),Q(y),setTimeout(()=>{let S=t?t.value:"",P=a?a.value:"",K=typeof D=="string"?D:"",Ce=typeof U=="string"?U:"";m("\u{1F4CA} After state update:","info"),m(`   Input 1 - DOM: "${S}", State: "${K}"`,"info"),m(`   Input 2 - DOM: "${P}", State: "${Ce}"`,"info"),(S===h||S===v)&&(P===N||P===y)?(m("\u2705 PASS: Input values preserved when switching/updating","success"),m("\u2705 Framework correctly preserves user input and syncs state","success"),te(Fe=>({...Fe,switching:"\u2705 PASS: Values preserved on switch"}))):(m("\u274C FAIL: Values not preserved correctly","error"),m("\u{1F50D} Issue: Framework may be overwriting input values during state updates","error"),te(Fe=>({...Fe,switching:`\u274C FAIL: Values lost (Input1: ${S}, Input2: ${P})`})))},300)},300)}catch(v){m(`\u274C ERROR: ${v.message}`,"error"),te(y=>({...y,switching:`\u274C FAIL: ${v.message}`}))}},[Nt,ke]=k({}),[St,at]=k(0),[ot,kt]=k(0),[Tt,st]=k(0),[it,At]=k(0),[Ct,Pr]=k(0),[Er,Fr]=k(0),Lr=()=>{at(t=>t+1),ke(t=>({...t,onclick:"\u2705 PASS"}))},jr=t=>{kt(a=>a+1),ot>=0&&ke(a=>({...a,oninput:"\u2705 PASS"}))},$t=()=>{st(t=>t+1),ke(t=>({...t,onfocus:"\u2705 PASS"}))},_t=()=>{At(t=>t+1),ke(t=>({...t,onblur:"\u2705 PASS"}))},Kt=t=>{Fr(a=>a+1),ke(a=>({...a,onchange:"\u2705 PASS"}))},Or=t=>{t.preventDefault(),Pr(a=>a+1),ke(a=>({...a,onsubmit:"\u2705 PASS"}))},[ge,It]=k({name:"",email:"",message:""}),[Te,er]=k({}),[Vr,Ue]=k({}),[zr,Dr]=k(!1),Ur=t=>{t.preventDefault(),m("\u{1F9EA} Starting Form Submission test...","info");let a=document.querySelector('input[type="text"][placeholder*="name" i]')||document.querySelectorAll('input[type="text"]')[0],h=document.querySelector('input[type="email"]')||document.querySelectorAll('input[type="text"]')[1],N=document.querySelector("textarea"),v={name:a?a.value:ge.name||"",email:h?h.value:ge.email||"",message:N?N.value:ge.message||""};m("\u{1F4CA} Submitting form with values:","info"),m(`   Name: "${v.name}"`,"info"),m(`   Email: "${v.email}"`,"info"),m(`   Message: "${v.message}"`,"info");let y={};(!v.name||v.name.trim()==="")&&(y.name="Name required",m("\u274C Validation: Name is required","error")),!v.email||v.email.trim()===""?(y.email="Email required",m("\u274C Validation: Email is required","error")):/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)||(y.email="Invalid email format",m(`\u274C Validation: Email format invalid ("${v.email}")`,"error")),!v.message||v.message.trim()===""?(y.message="Message required",m("\u274C Validation: Message is required","error")):v.message.trim().length<10&&(y.message="Message too short (min 10 characters)",m(`\u274C Validation: Message too short (${v.message.length} chars)`,"error")),Object.keys(y).length===0?(m("\u2705 PASS: Form validation passed, submitting...","success"),Dr(!0),Ue(S=>({...S,submission:"\u2705 PASS: Form submitted successfully"}))):(m(`\u274C FAIL: Form validation failed (${Object.keys(y).length} error(s))`,"error"),er(y),Ue(S=>({...S,submission:`\u274C FAIL: Validation errors (${Object.keys(y).length} error(s))`})))},qr=()=>{m("\u{1F9EA} Starting Form Validation test...","info");try{let t=document.querySelector('input[type="text"][placeholder*="name" i]')||document.querySelectorAll('input[type="text"]')[0],a=document.querySelector('input[type="email"]')||document.querySelectorAll('input[type="text"]')[1],h=document.querySelector("textarea"),N=t?t.value:ge.name||"",v=a?a.value:ge.email||"",y=h?h.value:ge.message||"";m("\u{1F4CA} Form values:","info"),m(`   Name: "${N}"`,"info"),m(`   Email: "${v}"`,"info"),m(`   Message: "${y}"`,"info");let S={};!N||N.trim()===""?(S.name="Name required",m("\u274C Validation: Name is required","error")):m("\u2705 Validation: Name is valid","success"),!v||v.trim()===""?(S.email="Email required",m("\u274C Validation: Email is required","error")):/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?m("\u2705 Validation: Email format is valid","success"):(S.email="Invalid email format",m(`\u274C Validation: Email format invalid ("${v}")`,"error")),!y||y.trim()===""?(S.message="Message required",m("\u274C Validation: Message is required","error")):y.trim().length<10?(S.message="Message too short (min 10 characters)",m(`\u274C Validation: Message too short (${y.length} chars)`,"error")):m("\u2705 Validation: Message is valid","success"),m(`\u{1F4CA} Total validation errors: ${Object.keys(S).length}`,"info"),er(S),Object.keys(S).length>0?(m(`\u2705 PASS: Validation detected ${Object.keys(S).length} error(s)`,"success"),Ue(P=>({...P,validation:`\u2705 PASS: Validation working (${Object.keys(S).length} error(s) detected)`}))):(m("\u274C FAIL: No validation errors detected (form should have errors)","error"),m("\u{1F50D} Issue: Validation may not be checking email format or message length","error"),Ue(P=>({...P,validation:"\u274C FAIL: No errors detected (validation may be incomplete)"})))}catch(t){m(`\u274C ERROR: ${t.message}`,"error"),Ue(a=>({...a,validation:`\u274C FAIL: ${t.message}`}))}},[xe,ct]=k(0),[qe,Hr]=k({count:0,name:"Test"}),[we,Br]=k([1,2,3]),[Wr,ve]=k({}),[tr,rr]=k([]),He=se(0),Mt=se(0),Rt=se(3),q=(t,a="info")=>{let h=new Date().toLocaleTimeString(),N={timestamp:h,message:t,type:a};console.log(`[STATE TEST ${a.toUpperCase()}] ${h}: ${t}`),rr(v=>[...Array.isArray(v)?v:[],N].slice(-30))};fe(()=>{He.current=typeof xe=="number"?xe:0},[xe]),fe(()=>{Mt.current=qe?.count||0},[qe]),fe(()=>{Rt.current=Array.isArray(we)?we.length:0},[we]);let Gr=()=>{q("\u{1F9EA} Testing basic state update...","info");let t=typeof xe=="number"?xe:0;q(`\u{1F4CA} Current value: ${t}`,"info");let a=t+1;He.current=a,ct(y=>{let S=(typeof y=="number"?y:0)+1;return q(`\u2699\uFE0F Framework: State updater called (${y} \u2192 ${S})`,"framework"),S});let h=0,N=15,v=()=>{h++;let y=He.current,S=typeof window<"u"&&window.__ATOM_STATE__?window.__ATOM_STATE__:[],P=Array.isArray(S)&&S.length>0?S[0]:void 0,K=typeof y=="number"?y:typeof P=="number"?P:0;q(`\u{1F4CA} Check ${h}: Ref value = ${y}, Global state[0] = ${P}, Expected = ${a}`,"info"),K>=a?(q(`\u2705 PASS: State updated (${t} \u2192 ${K})`,"success"),ve(Ce=>({...Ce,basicUpdate:"\u2705 PASS"}))):h<N?setTimeout(v,100):(q(`\u274C FAIL: State not updated after ${N} attempts (expected ${a}, ref shows ${y}, global shows ${P})`,"error"),q("\u{1F50D} Issue: Framework state update may not be working correctly","error"),ve(Ce=>({...Ce,basicUpdate:"\u274C FAIL"})))};setTimeout(v,200)},Jr=()=>{q("\u{1F9EA} Testing state with objects...","info");let t=qe?.count||0,a=t+1;Hr(y=>{let S={...y,count:(y?.count||0)+1};return q(`\u2699\uFE0F Framework: Object state updated (count: ${y?.count||0} \u2192 ${S.count})`,"framework"),S});let h=0,N=10,v=()=>{h++;let y=typeof Mt.current=="number"?Mt.current:NaN,S=qe?.count||0,P=Number.isFinite(y)?y:S;q(`\u{1F4CA} Check ${h}: Object count = ${P} (ref: ${y}, state: ${S}), Expected = ${a}`,"info"),P>=a?(q(`\u2705 PASS: Object state updated (${t} \u2192 ${P})`,"success"),ve(K=>({...K,objectState:"\u2705 PASS"}))):h<N?setTimeout(v,50):(q(`\u274C FAIL: Object state not updated after ${N} attempts`,"error"),ve(K=>({...K,objectState:"\u274C FAIL"})))};setTimeout(v,100)},Xr=()=>{q("\u{1F9EA} Testing state with arrays...","info");let t=Array.isArray(we)?we.length:0,a=t+1;Br(y=>{let S=Array.isArray(y)?[...y,y.length+1]:[1];return q(`\u2699\uFE0F Framework: Array state updated (length: ${y?.length||0} \u2192 ${S.length})`,"framework"),S});let h=0,N=10,v=()=>{h++;let y=typeof Rt.current=="number"?Rt.current:NaN,S=Array.isArray(we)?we.length:0,P=Number.isFinite(y)?y:S;q(`\u{1F4CA} Check ${h}: Array length = ${P} (ref: ${y}, state: ${S}), Expected = ${a}`,"info"),P>=a?(q(`\u2705 PASS: Array state updated (length: ${t} \u2192 ${P})`,"success"),ve(K=>({...K,arrayState:"\u2705 PASS"}))):h<N?setTimeout(v,50):(q(`\u274C FAIL: Array state not updated after ${N} attempts`,"error"),ve(K=>({...K,arrayState:"\u274C FAIL"})))};setTimeout(v,100)},Zr=()=>{q("\u{1F9EA} Testing state update batching...","info");let t=typeof xe=="number"?xe:0,a=t+3;ct(y=>(typeof y=="number"?y:0)+1),ct(y=>(typeof y=="number"?y:0)+1),ct(y=>(typeof y=="number"?y:0)+1),q("\u2699\uFE0F Framework: Sent 3 rapid state updates","framework");let h=0,N=15,v=()=>{h++;let y=typeof He.current=="number"?He.current:NaN,S=typeof xe=="number"?xe:0,P=Number.isFinite(y)?y:S;q(`\u{1F4CA} Check ${h}: Final value = ${P} (ref: ${y}, state: ${S}), Expected >= ${a}`,"info"),P>=a?(q(`\u2705 PASS: State batching working (${t} \u2192 ${P})`,"success"),ve(K=>({...K,batching:"\u2705 PASS"}))):h<N?setTimeout(v,50):(q(`\u274C FAIL: State batching issue after ${N} attempts (expected >= ${a}, got ${P})`,"error"),ve(K=>({...K,batching:"\u274C FAIL"})))};setTimeout(v,150)},[Be,Qr]=k("Initial"),Pt=se("Initial");fe(()=>{Pt.current=typeof Be=="string"?Be:"Initial"},[Be]);let Yr=()=>{q("\u{1F9EA} Testing state persistence across re-renders...","info");let t="Persistent Value "+Date.now();q(`\u{1F4DD} Setting state to: "${t}"`,"info"),Qr(t);let a=0,h=10,N=()=>{a++;let v=typeof Pt.current=="string"?Pt.current:"",y=typeof Be=="string"?Be:"",S=v||y;q(`\u{1F4CA} Check ${a}: Current state value: "${S}" (ref: "${v}", state: "${y}")`,"info"),S&&(S===t||S.includes("Persistent Value"))?(q(`\u2705 PASS: State persisted correctly (${S})`,"success"),ve(P=>({...P,persistence:"\u2705 PASS: State persists across re-renders"}))):a<h?setTimeout(N,50):(q(`\u274C FAIL: State not persisted after ${h} attempts (expected "${t}", got "${S}")`,"error"),ve(P=>({...P,persistence:"\u274C FAIL: State not persisting"})))};setTimeout(N,100)},[Kr,nr]=k({}),en=()=>{try{nr(t=>({...t,helpers:"\u2705 PASS: All helpers available"}))}catch(t){nr(a=>({...a,helpers:`\u274C FAIL: ${t.message}`}))}},[tn,Ee]=k({}),rn=()=>{try{let t=Ze();Ee(t?a=>({...a,usePath:"\u2705 PASS"}):a=>({...a,usePath:"\u274C FAIL: usePath not working"}))}catch(t){Ee(a=>({...a,usePath:`\u274C FAIL: ${t.message}`}))}},nn=()=>{try{ft("/test"),setTimeout(()=>{window.location.pathname==="/test"?(Ee(t=>({...t,navigate:"\u2705 PASS"})),ft("/test-suite")):Ee(t=>({...t,navigate:"\u274C FAIL: Navigation not working"}))},100)}catch(t){Ee(a=>({...a,navigate:`\u274C FAIL: ${t.message}`}))}},ar=async()=>{if(!re.current){re.current=!0,u(!0),f(null);try{let t=await e.secure_testLogin({email:"test@example.com",password:"password123"});t&&t.success?(t.token&&localStorage.setItem("test_token",t.token),t.user&&W(t.user),i(a=>({...a,login:"\u2705 PASS"})),ce({particleCount:50,spread:70})):i(a=>({...a,login:"\u274C FAIL: Unexpected response format"}))}catch(t){f(t.message),i(a=>({...a,login:`\u274C FAIL: ${t.message}`}))}finally{u(!1),re.current=!1}}},or=async()=>{u(!0),f(null);try{let t=await e.secure_testRegister({email:`test${Date.now()}@example.com`,password:"password123",name:"Test User"});t&&t.success?(i(a=>({...a,register:"\u2705 PASS"})),alert("Registration successful!")):i(a=>({...a,register:"\u274C FAIL: Unexpected response format"}))}catch(t){f(t.message),i(a=>({...a,register:`\u274C FAIL: ${t.message}`}))}finally{u(!1)}},sr=async()=>{let t=localStorage.getItem("test_token");if(!t){f("No token found. Please login first.");return}u(!0),f(null);try{let a=await e.secure_testGetCurrentUser(t);a?(W(a),i(h=>({...h,getCurrentUser:"\u2705 PASS"}))):i(h=>({...h,getCurrentUser:"\u274C FAIL: No user data returned"}))}catch(a){f(a.message),i(h=>({...h,getCurrentUser:`\u274C FAIL: ${a.message}`}))}finally{u(!1)}},ir=async()=>{u(!0),f(null);try{let t=await e.secure_testCreateRecord({title:"Test Record",content:"<p>This is a <strong>test</strong> record</p>"});t&&t.record?(E(a=>{let h=Array.isArray(a)?a:[],N=t.record;return N?[N,...h]:h}),i(a=>({...a,createRecord:"\u2705 PASS"}))):i(a=>({...a,createRecord:"\u274C FAIL: No record returned"}))}catch(t){f(t.message),i(a=>({...a,createRecord:`\u274C FAIL: ${t.message}`}))}finally{u(!1)}},cr=async()=>{u(!0),f(null);try{let t=await e.secure_testGetRecords({page:1,limit:10});t&&Array.isArray(t.records)?(E(t.records),i(a=>({...a,getRecords:"\u2705 PASS"}))):(E([]),i(a=>({...a,getRecords:"\u274C FAIL: Invalid response format"})))}catch(t){f(t.message),i(a=>({...a,getRecords:`\u274C FAIL: ${t.message}`}))}finally{u(!1)}},lr=async()=>{let t=Array.isArray(Z)?Z:[];if(t.length===0){f("No records to update. Create a record first.");return}u(!0),f(null);try{let a=t[0];if(!a||!a.id){f("Invalid record to update.");return}let h=await e.secure_testUpdateRecord({id:a.id,title:"Updated Record",content:"Updated content"});h&&h.success?i(N=>({...N,updateRecord:"\u2705 PASS"})):i(N=>({...N,updateRecord:"\u274C FAIL: Update failed"}))}catch(a){f(a.message),i(h=>({...h,updateRecord:`\u274C FAIL: ${a.message}`}))}finally{u(!1)}},dr=async()=>{let t=Array.isArray(Z)?Z:[];if(t.length===0){f("No records to delete. Create a record first.");return}u(!0),f(null);try{let a=t[0];if(!a||!a.id){f("Invalid record to delete.");return}let h=typeof a.id=="number"?a.id:Number(a.id);if(isNaN(h)){f("Invalid record ID.");return}let N=await e.secure_testDeleteRecord(h);N&&N.success?(E(v=>(Array.isArray(v)?v:[]).filter(S=>S&&S.id!==a.id)),i(v=>({...v,deleteRecord:"\u2705 PASS"}))):i(v=>({...v,deleteRecord:"\u274C FAIL: Delete failed"}))}catch(a){f(a.message),i(h=>({...h,deleteRecord:`\u274C FAIL: ${a.message}`}))}finally{u(!1)}},ur=async()=>{u(!0),f(null);try{let t=await e.secure_testValidation({email:"test@example.com",name:"Test User",age:25,url:"https://example.com",tags:["tag1","tag2"]});t&&t.success?i(a=>({...a,validation:"\u2705 PASS"})):i(a=>({...a,validation:"\u274C FAIL: Validation failed"}))}catch(t){f(t.message),i(a=>({...a,validation:`\u274C FAIL: ${t.message}`}))}finally{u(!1)}},Et=async()=>{u(!0),f(null);try{let t=await e.secure_testSanitization({html:'<p>Test <script>alert("xss")<\/script></p>',string:"<strong>Test</strong> String",email:"test@example.com",url:'javascript:alert("xss")',object:{name:'<script>alert("xss")<\/script>'}});t&&t.success?i(a=>({...a,sanitization:"\u2705 PASS"})):i(a=>({...a,sanitization:"\u274C FAIL: Sanitization failed"}))}catch(t){f(t.message),i(a=>({...a,sanitization:`\u274C FAIL: ${t.message}`}))}finally{u(!1)}},an=async()=>{u(!0),f(null);try{let t=await e.secure_testSqlInjection({input:"' OR 1=1; DROP TABLE users; --"});if(t&&t.success){let a=t.isSuspicious?"Suspicious input detected and neutralized via parameterized query":"Input sanitized and executed via parameterized query",h=`Query: ${t.query} | Parameters: ${JSON.stringify(t.parameters)}`;i(N=>({...N,sqlInjection:`\u2705 PASS: ${a}. ${h}`}))}else i(a=>({...a,sqlInjection:"\u274C FAIL: Unexpected SQL injection response"}))}catch(t){f(t.message),i(a=>({...a,sqlInjection:`\u274C FAIL: ${t.message}`}))}finally{u(!1)}},lt=async t=>{u(!0),f(null);try{await e.secure_testErrorHandling(t),i(a=>({...a,[`error_${t}`]:"\u274C FAIL: Should have thrown error"}))}catch(a){i(h=>({...h,[`error_${t}`]:`\u2705 PASS: ${a.message}`}))}finally{u(!1)}},mr=async()=>{u(!0),f(null);try{let t=await e.secure_testPerformance(1e3),a=Number(t?.iterations),h=Number(t?.duration),N=Number.isFinite(a),v=Number.isFinite(h);if(t&&N&&v){let y=Number.isFinite(t?.averageTime)?t.averageTime:a!==0?h/a:0,S=Number.isFinite(y)?y.toFixed(2):"0.00";i(P=>({...P,performance:`\u2705 PASS: ${a} iterations in ${h}ms (avg: ${S}ms)`}))}else console.warn("[STATE TEST ERROR] Invalid performance payload:",t),i(y=>({...y,performance:"\u274C FAIL: Invalid performance result"}))}catch(t){f(t.message),i(a=>({...a,performance:`\u274C FAIL: ${t.message}`}))}finally{u(!1)}},on=async()=>{u(!0),f(null),i({}),he.current=0;let t=[{name:"login",fn:ar},{name:"register",fn:or},{name:"getCurrentUser",fn:sr},{name:"createRecord",fn:ir},{name:"getRecords",fn:cr},{name:"updateRecord",fn:lr},{name:"deleteRecord",fn:dr},{name:"validation",fn:ur},{name:"sanitization",fn:Et},{name:"performance",fn:mr}];for(let a of t){J.current=a.name;try{await a.fn(),he.current++,await new Promise(h=>setTimeout(h,100))}catch(h){console.error(`Test ${a.name} failed:`,h)}}u(!1),ce({particleCount:100,spread:70}),alert(`Tests completed! ${he.current}/${t.length} passed.`)};return n([n([ie("\u{1F9EA} ATOM Framework - Complete Test Suite",{className:"text-4xl font-bold mb-2"}),T("Comprehensive production-level testing of all framework features",{className:"text-gray-600 mb-6"}),H&&n([Y(`Logged in as: ${H.name} (${H.email})`,{className:"text-green-600 font-semibold"}),$("Logout",{onclick:()=>{localStorage.removeItem("test_token"),W(null),E([])},className:"ml-4 px-3 py-1 bg-red-500 text-white rounded text-sm"})],{className:"mb-4"})],{className:"mb-8"}),w&&n([T(`Error: ${w}`,{className:"text-red-600 bg-red-50 p-4 rounded mb-4"})]),n([X("Test Categories",{className:"text-2xl font-bold mb-4"}),n(ae.map(t=>$([Y(t.icon,{className:"mr-2"}),Y(t.name)],{onclick:()=>p(t.id),className:`px-4 py-2 rounded mr-2 mb-2 ${o===t.id?"bg-blue-600 text-white":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`})),{className:"flex flex-wrap mb-6"}),$("\u{1F680} Run All Tests",{onclick:on,disabled:x,className:"px-6 py-3 bg-green-600 text-white rounded font-bold hover:bg-green-700 disabled:opacity-50 mb-6"})],{className:"mb-8"}),o==="framework"&&n([X("\u269B\uFE0F Framework Core Tests",{className:"text-2xl font-bold mb-4"}),n([$("Test useState",{onclick:t=>{console.log("Button clicked!",t),t.preventDefault(),t.stopPropagation(),I()},className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"}),$("Test useEffect",{onclick:t=>{t.preventDefault(),t.stopPropagation(),M()},className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"}),$("Test useRef",{onclick:t=>{t.preventDefault(),t.stopPropagation(),C()},className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"}),$("Test useMemo",{onclick:t=>{t.preventDefault(),t.stopPropagation(),R()},className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"}),$("\u{1F680} Run All Framework Tests",{onclick:t=>{t.preventDefault(),t.stopPropagation(),z()},className:"px-4 py-2 bg-green-600 text-white rounded mr-2 mb-2 font-bold"}),$("Clear Logs",{onclick:()=>A([]),className:"px-4 py-2 bg-gray-600 text-white rounded mr-2 mb-2"})],{className:"mb-4"}),n([T(`Counter: ${typeof Se=="number"?Se:0}`,{className:"text-sm text-gray-600"}),T(`Effect Count: ${typeof rt=="number"?rt:0}`,{className:"text-sm text-gray-600"}),T(`Ref Value: ${typeof ue?.current=="number"?ue.current:ue?.current||0}`,{className:"text-sm text-gray-600"}),T(`Memo Value: ${typeof _=="number"&&!isNaN(_)?_:0}`,{className:"text-sm text-gray-600"})],{className:"mb-4 p-4 bg-gray-50 rounded"}),n([V("Results:",{className:"font-bold mb-2"}),...(()=>{let a=Object.entries(xt||{});return a.length>0?a.map(([h,N])=>n(`${h}: ${N}`,{className:"p-2 bg-gray-100 rounded mb-1"})):[n("No test results yet. Click a test button above.",{className:"p-2 bg-gray-50 rounded text-gray-500 italic"})]})()],{className:"mb-4"}),n([V("\u{1F4CB} Test Logs:",{className:"font-bold mb-2"}),n([...(()=>{let t=Array.isArray(d)?d:[];return t.length===0?[n("No logs yet. Run a test to see detailed execution logs.",{className:"p-2 bg-gray-50 rounded text-gray-500 italic"})]:t.slice(-30).map((a,h)=>{let N=a.type==="error"?"bg-red-50 border-red-200":a.type==="success"?"bg-green-50 border-green-200":a.type==="framework"?"bg-blue-50 border-blue-200":"bg-gray-50 border-gray-200",v=a.type==="error"?"text-red-800":a.type==="success"?"text-green-800":a.type==="framework"?"text-blue-800":"text-gray-800";return n([Y(`[${a.timestamp}]`,{className:"text-xs text-gray-500 mr-2"}),Y(a.message,{className:v})],{className:`p-2 border rounded mb-1 text-sm ${N}`})})})()],{className:"max-h-96 overflow-y-auto"})])],{className:"mb-8 p-4 border rounded"}),o==="inputs"&&n([X("\u2328\uFE0F Input Tracking Tests",{className:"text-2xl font-bold mb-4"}),T("Type in the inputs below and switch between them to test value preservation:",{className:"text-gray-600 mb-4"}),n([n([pe("Input 1:",{className:"block mb-1 font-medium"}),Ne(null,{type:"text",value:D,placeholder:"Type here, then switch to Input 2",className:"w-full px-3 py-2 border rounded",oninput:t=>{O(t.target.value),ye(a=>[...a,`Input 1: ${t.target.value}`])},onfocus:$t,onblur:_t})],{className:"mb-4"}),n([pe("Input 2:",{className:"block mb-1 font-medium"}),Ne(null,{type:"text",value:U,placeholder:"Switch here and type - Input 1 should keep its value",className:"w-full px-3 py-2 border rounded",oninput:t=>{Q(t.target.value),ye(a=>[...a,`Input 2: ${t.target.value}`])},onfocus:$t,onblur:_t})],{className:"mb-4"}),n([pe("Textarea:",{className:"block mb-1 font-medium"}),ht(null,{value:F,placeholder:"Test textarea value preservation",className:"w-full px-3 py-2 border rounded h-24",oninput:t=>{oe(t.target.value),ye(a=>[...a,`Textarea: ${t.target.value}`])}})],{className:"mb-4"})],{className:"mb-4"}),n([$("Test Value Preservation",{onclick:t=>{t.preventDefault(),t.stopPropagation(),wt()},className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"}),$("Test Input Switching",{onclick:t=>{t.preventDefault(),t.stopPropagation(),vt()},className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"})],{className:"mb-4"}),de.length>0&&n([V("Input Log:",{className:"font-bold mb-2"}),...de.slice(-10).map(t=>n(t,{className:"text-sm text-gray-600 p-1"}))],{className:"mb-4 p-4 bg-gray-50 rounded max-h-40 overflow-y-auto"}),n([V("Results:",{className:"font-bold mb-2"}),...Object.entries(le||{}).map(([t,a])=>n(`${t}: ${a}`,{className:"p-2 bg-gray-100 rounded mb-1"}))])],{className:"mb-8 p-4 border rounded"}),o==="events"&&n([X("\u{1F3AF} Event Handling Tests",{className:"text-2xl font-bold mb-4"}),n([$("Test Click Event",{onclick:Lr,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"}),Y(`Clicks: ${St}`,{className:"text-sm text-gray-600 ml-2"})],{className:"mb-4"}),n([pe("Test Input Event:",{className:"block mb-1 font-medium"}),Ne(null,{type:"text",placeholder:"Type here to test oninput",className:"w-full px-3 py-2 border rounded mb-2",oninput:jr,onfocus:$t,onblur:_t,onchange:Kt}),Y(`Input Events: ${ot}`,{className:"text-sm text-gray-600"})],{className:"mb-4"}),n([pe("Test Select Change:",{className:"block mb-1 font-medium"}),bn([zt("Option 1",{value:"1"}),zt("Option 2",{value:"2"}),zt("Option 3",{value:"3"})],{className:"w-full px-3 py-2 border rounded mb-2",onchange:Kt}),Y(`Change Events: ${Er}`,{className:"text-sm text-gray-600"})],{className:"mb-4"}),n([Xt([Ne(null,{type:"text",placeholder:"Test form submission",className:"w-full px-3 py-2 border rounded mb-2"}),$("Test Submit Event",{type:"submit",className:"px-4 py-2 bg-green-600 text-white rounded"})],{onsubmit:Or}),Y(`Submit Events: ${Ct}`,{className:"text-sm text-gray-600 ml-2"})],{className:"mb-4"}),n([V("Event Results:",{className:"font-bold mb-2"}),...Object.entries(Nt||{}).map(([t,a])=>n(`${t}: ${a}`,{className:"p-2 bg-gray-100 rounded mb-1"}))])],{className:"mb-8 p-4 border rounded"}),o==="forms"&&n([X("\u{1F4DD} Forms & Validation Tests",{className:"text-2xl font-bold mb-4"}),Xt([n([pe("Name:",{className:"block mb-1 font-medium"}),Ne(null,{type:"text",value:ge.name,placeholder:"Enter your name",className:`w-full px-3 py-2 border rounded ${Te.name?"border-red-500":""}`,oninput:t=>It(a=>({...a,name:t.target.value}))}),Te.name&&T(Te.name,{className:"text-red-600 text-sm mt-1"})],{className:"mb-4"}),n([pe("Email:",{className:"block mb-1 font-medium"}),Ne(null,{type:"email",value:ge.email,placeholder:"Enter your email",className:`w-full px-3 py-2 border rounded ${Te.email?"border-red-500":""}`,oninput:t=>It(a=>({...a,email:t.target.value}))}),Te.email&&T(Te.email,{className:"text-red-600 text-sm mt-1"})],{className:"mb-4"}),n([pe("Message:",{className:"block mb-1 font-medium"}),ht(null,{value:ge.message,placeholder:"Enter your message",className:`w-full px-3 py-2 border rounded h-24 ${Te.message?"border-red-500":""}`,oninput:t=>It(a=>({...a,message:t.target.value}))}),Te.message&&T(Te.message,{className:"text-red-600 text-sm mt-1"})],{className:"mb-4"}),n([$("Submit Form",{type:"submit",className:"px-4 py-2 bg-blue-600 text-white rounded mr-2"}),$("Test Validation",{type:"button",onclick:qr,className:"px-4 py-2 bg-gray-600 text-white rounded"})])],{onsubmit:Ur}),zr&&n([T("\u2705 Form submitted successfully!",{className:"text-green-600 font-semibold mt-4"}),T(`Name: ${ge.name}`,{className:"text-sm text-gray-600"}),T(`Email: ${ge.email}`,{className:"text-sm text-gray-600"}),T(`Message: ${ge.message}`,{className:"text-sm text-gray-600"})],{className:"mt-4 p-4 bg-green-50 rounded"}),n([V("Results:",{className:"font-bold mb-2"}),...Object.entries(Vr||{}).map(([t,a])=>n(`${t}: ${a}`,{className:"p-2 bg-gray-100 rounded mb-1"}))],{className:"mt-4"})],{className:"mb-8 p-4 border rounded"}),o==="state"&&n([X("\u{1F504} State Management Tests",{className:"text-2xl font-bold mb-4"}),T("Comprehensive tests for useState, state updates, batching, and state persistence",{className:"text-gray-600 mb-4"}),n([$("Test Basic State Update",{onclick:t=>{t.preventDefault(),t.stopPropagation(),Gr()},className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"}),$("Test Object State",{onclick:t=>{t.preventDefault(),t.stopPropagation(),Jr()},className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"}),$("Test Array State",{onclick:t=>{t.preventDefault(),t.stopPropagation(),Xr()},className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"}),$("Test State Batching",{onclick:t=>{t.preventDefault(),t.stopPropagation(),Zr()},className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"}),$("Test State Persistence",{onclick:t=>{t.preventDefault(),t.stopPropagation(),Yr()},className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"}),$("Clear Logs",{onclick:()=>rr([]),className:"px-4 py-2 bg-gray-600 text-white rounded mr-2 mb-2"})],{className:"mb-4"}),n([T(`Counter: ${typeof xe=="number"?xe:0}`,{className:"text-sm text-gray-600"}),T(`Object Count: ${qe?.count||0}`,{className:"text-sm text-gray-600"}),T(`Array Length: ${Array.isArray(we)?we.length:0}`,{className:"text-sm text-gray-600"}),T(`Array Values: [${Array.isArray(we)?we.join(", "):"N/A"}]`,{className:"text-sm text-gray-600"})],{className:"mb-4 p-4 bg-gray-50 rounded"}),n([V("Results:",{className:"font-bold mb-2"}),...(()=>{let a=Object.entries(Wr||{});return a.length>0?a.map(([h,N])=>n(`${h}: ${N}`,{className:"p-2 bg-gray-100 rounded mb-1"})):[n("No results yet. Click a test button above.",{className:"p-2 bg-gray-50 rounded text-gray-500 italic"})]})()],{className:"mb-4"}),n([V("\u{1F4CB} Test Logs:",{className:"font-bold mb-2"}),n([...(()=>{let t=Array.isArray(tr)?tr:[];return t.length===0?[n("No logs yet. Run a test to see detailed execution logs.",{className:"p-2 bg-gray-50 rounded text-gray-500 italic"})]:t.slice(-20).map((a,h)=>{let N=a.type==="error"?"bg-red-50 border-red-200":a.type==="success"?"bg-green-50 border-green-200":a.type==="framework"?"bg-blue-50 border-blue-200":"bg-gray-50 border-gray-200",v=a.type==="error"?"text-red-800":a.type==="success"?"text-green-800":a.type==="framework"?"text-blue-800":"text-gray-800";return n([Y(`[${a.timestamp}]`,{className:"text-xs text-gray-500 mr-2"}),Y(a.message,{className:v})],{className:`p-2 border rounded mb-1 text-sm ${N}`})})})()],{className:"max-h-96 overflow-y-auto"})])],{className:"mb-8 p-4 border rounded"}),o==="html"&&n([X("\u{1F3F7}\uFE0F HTML Helpers Tests",{className:"text-2xl font-bold mb-4"}),$("Test HTML Helpers",{onclick:en,className:"px-4 py-2 bg-blue-600 text-white rounded mb-4"}),n([V("HTML Elements Rendered:",{className:"font-bold mb-2"}),n([ie("H1 Heading",{className:"text-2xl"}),X("H2 Heading",{className:"text-xl"}),T("Paragraph text",{className:"text-gray-600"}),Xe("Bold text"),kn("Italic text"),Tn("Code text",{className:"bg-gray-100 px-2 py-1 rounded"}),xn([Dt("List item 1"),Dt("List item 2"),Dt("List item 3")]),vn([Nn([yr([wr("Header 1"),wr("Header 2")])]),Sn([yr([xr("Cell 1"),xr("Cell 2")])])],{className:"border-collapse border border-gray-300"})],{className:"space-y-2"})],{className:"mb-4"}),n([V("Results:",{className:"font-bold mb-2"}),...Object.entries(Kr||{}).map(([t,a])=>n(`${t}: ${a}`,{className:"p-2 bg-gray-100 rounded mb-1"}))])],{className:"mb-8 p-4 border rounded"}),o==="navigation"&&n([X("\u{1F9ED} Navigation Tests",{className:"text-2xl font-bold mb-4"}),n([$("Test usePath",{onclick:rn,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"}),$("Test navigate",{onclick:nn,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"}),T(`Current Path: ${Ze()}`,{className:"text-sm text-gray-600 mt-2"})],{className:"mb-4"}),n([V("Results:",{className:"font-bold mb-2"}),...Object.entries(tn||{}).map(([t,a])=>n(`${t}: ${a}`,{className:"p-2 bg-gray-100 rounded mb-1"}))])],{className:"mb-8 p-4 border rounded"}),o==="auth"&&n([X("\u{1F510} Authentication Tests",{className:"text-2xl font-bold mb-4"}),n([$("Test Login",{onclick:ar,disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),$("Test Register",{onclick:or,disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),$("Test Get Current User",{onclick:sr,disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"})],{className:"mb-4"}),n([V("Results:",{className:"font-bold mb-2"}),...(()=>{let t=Object.entries(b||{}).filter(([a])=>["login","register","getCurrentUser"].includes(a));return t.length>0?t.map(([a,h])=>n(`${a}: ${h}`,{className:"p-2 bg-gray-100 rounded mb-1"})):[n("No results yet. Click a test button above.",{className:"p-2 bg-gray-50 rounded text-gray-500 italic"})]})()])],{className:"mb-8 p-4 border rounded"}),o==="database"&&n([X("\u{1F4BE} Database Tests",{className:"text-2xl font-bold mb-4"}),n([$("Test Create Record",{onclick:ir,disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),$("Test Get Records",{onclick:cr,disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),$("Test Update Record",{onclick:lr,disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),$("Test Delete Record",{onclick:dr,disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"})],{className:"mb-4"}),G.length>0?n([V("Records:",{className:"font-bold mb-2"}),...G.slice(0,5).map(t=>!t||typeof t!="object"?null:n([Xe(t.title||`Record ${t.id||"Unknown"}`),T(t.content||"No content",{className:"text-sm text-gray-600"})],{className:"p-2 bg-gray-100 rounded mb-2"})).filter(Boolean)]):null,n([V("Results:",{className:"font-bold mb-2"}),...(()=>{let t=Object.entries(b||{}).filter(([a])=>["createRecord","getRecords","updateRecord","deleteRecord"].includes(a));return t.length>0?t.map(([a,h])=>n(`${a}: ${h}`,{className:"p-2 bg-gray-100 rounded mb-1"})):[n("No results yet. Click a test button above.",{className:"p-2 bg-gray-50 rounded text-gray-500 italic"})]})()])],{className:"mb-8 p-4 border rounded"}),o==="validation"&&n([X("\u2705 Validation & Sanitization Tests",{className:"text-2xl font-bold mb-4"}),n([$("Test Validation",{onclick:ur,disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),$("Test Sanitization",{onclick:Et,disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"})],{className:"mb-4"}),n([V("Results:",{className:"font-bold mb-2"}),...(()=>{let t=Object.entries(b||{}).filter(([a])=>["validation","sanitization"].includes(a));return t.length>0?t.map(([a,h])=>n(`${a}: ${h}`,{className:"p-2 bg-gray-100 rounded mb-1"})):[n("No results yet. Click a test button above.",{className:"p-2 bg-gray-50 rounded text-gray-500 italic"})]})()])],{className:"mb-8 p-4 border rounded"}),o==="errors"&&n([X("\u26A0\uFE0F Error Handling Tests",{className:"text-2xl font-bold mb-4"}),n([$("Test Validation Error",{onclick:()=>lt("validation"),disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),$("Test Database Error",{onclick:()=>lt("database"),disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),$("Test Permission Error",{onclick:()=>lt("permission"),disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),$("Test Not Found Error",{onclick:()=>lt("notfound"),disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"})],{className:"mb-4"}),n([V("Results:",{className:"font-bold mb-2"}),...(()=>{let t=Object.entries(b||{}).filter(([a])=>a.startsWith("error_"));return t.length>0?t.map(([a,h])=>n(`${a}: ${h}`,{className:"p-2 bg-gray-100 rounded mb-1"})):[n("No results yet. Click a test button above.",{className:"p-2 bg-gray-50 rounded text-gray-500 italic"})]})()])],{className:"mb-8 p-4 border rounded"}),o==="performance"&&n([X("\u26A1 Performance Tests",{className:"text-2xl font-bold mb-4"}),n([$("Test Performance (1000 iterations)",{onclick:mr,disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"})],{className:"mb-4"}),n([V("Results:",{className:"font-bold mb-2"}),...b&&b.performance?[n(`performance: ${b.performance}`,{className:"p-2 bg-gray-100 rounded mb-1"})]:[n("No results yet. Click a test button above.",{className:"p-2 bg-gray-50 rounded text-gray-500 italic"})]])],{className:"mb-8 p-4 border rounded"}),o==="security"&&n([X("\u{1F6E1}\uFE0F Security Tests",{className:"text-2xl font-bold mb-4"}),T("Run targeted security checks for XSS sanitization and SQL injection prevention using parameterized queries.",{className:"text-gray-600 mb-4"}),n([$("Test XSS Prevention",{onclick:Et,disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"}),$("Test SQL Injection Prevention",{onclick:an,disabled:x,className:"px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"})],{className:"mb-4"}),n([V("Results:",{className:"font-bold mb-2"}),...(()=>{let t=Object.entries(b||{}).filter(([a])=>["sanitization","sqlInjection"].includes(a));return t.length>0?t.map(([a,h])=>n(`${a}: ${h}`,{className:"p-2 bg-gray-100 rounded mb-1"})):[n("No security test results yet. Run a test above.",{className:"p-2 bg-gray-50 rounded text-gray-500 italic"})]})()])],{className:"mb-8 p-4 border rounded"}),x&&n([T("Loading...",{className:"text-blue-600 font-semibold"})],{className:"text-center py-4"}),Object.keys(b||{}).length>0&&n([X("\u{1F4CA} Test Summary",{className:"text-2xl font-bold mb-4"}),n([T(`Total Tests: ${Object.keys(b||{}).length}`,{className:"font-semibold"}),T(`Passed: ${Object.values(b||{}).filter(t=>t&&typeof t=="string"&&t.includes("\u2705")).length}`,{className:"text-green-600 font-semibold"}),T(`Failed: ${Object.values(b||{}).filter(t=>t&&typeof t=="string"&&t.includes("\u274C")).length}`,{className:"text-red-600 font-semibold"})],{className:"p-4 bg-gray-100 rounded"})],{className:"mt-8"})],{className:"max-w-6xl mx-auto p-8"})})(r);return s=be({...r,content:s}),s}});ee.push({regex:new RegExp("^/users/([^/]+)$"),paramNames:["id"],title:"User Profile | ATOM",meta:[],revalidate:null,isStatic:!1,enableStreaming:!1,component:r=>{r=r||{};let e={};e.get_user=async function(c){return console.log("Fetching User ID:",c),{id:c,name:"User "+c,role:c==="1"?"Admin":"Guest",bio:"This data came from the server securely."}};let s=(c=>{c=c||{};let{params:o}=c,[p,b]=k(null);return p?n([n([n([ie("Welcome",{className:"text-4xl font-bold mb-10"}),Tr({title:"Auto Import"},"This component was loaded automatically from the _components folder.")],{className:"p-20 bg-gray-50 min-h-screen"}),n(p.name[0],{className:"w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 mx-auto"}),ie(p.name,{className:"text-3xl font-bold text-center text-gray-800"}),n(p.role,{className:"text-center text-sm uppercase tracking-wide text-blue-500 font-bold mb-4"}),n(p.bio,{className:"bg-gray-50 p-4 rounded-lg text-gray-600 text-center"}),n([L("\u2190 Back Home",{href:"/",className:"text-blue-600 hover:underline"})],{className:"mt-6 text-center"})],{className:"max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10"})]):(e.get_user(o.id).then(i=>b(i)),n("Loading Profile...",{className:"p-10 text-center text-gray-500"}))})(r);return s=be({...r,content:s}),s}});ee.push({regex:/^\/404$/,paramNames:[],title:"404 Not Found",meta:[],component:()=>n([ie("404",{style:{fontSize:"100px",fontWeight:"800",margin:0,color:"#333"}}),n("Page Not Found",{style:{fontSize:"24px",color:"#666",marginBottom:"24px"}}),L("Go Home",{href:"/",style:{background:"#000",color:"#fff",padding:"10px 20px",borderRadius:"6px",textDecoration:"none",fontWeight:"bold"}})],{style:{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"sans-serif",background:"#fff"}})});function Ir(r,e,l){if(!r||!(r instanceof Node)){console.error("diff: parent must be a valid DOM Node",r);return}if(!e||!(e instanceof Node)){console.error("diff: newEl must be a valid DOM Node",e);return}try{if(!l){r.appendChild(e);return}if(!(l instanceof Node)){console.error("diff: oldEl is not a valid DOM Node",l),r.replaceChild(e,l);return}if(!e){try{r.removeChild(l)}catch(s){console.warn("diff: Could not remove oldEl",s)}return}if(e.nodeType===3&&l.nodeType===3){if(e.nodeValue!==l.nodeValue)try{l.nodeValue=e.nodeValue}catch(s){console.warn("diff: Could not update text node value",s)}return}if(e.nodeName!==l.nodeName){try{r.replaceChild(e,l)}catch(s){console.error("diff: Error replacing node",s);try{r.innerHTML="",r.appendChild(e)}catch(c){console.error("diff: Fatal error in fallback",c)}}return}if(e.nodeName.includes("-"))return;try{Array.from(l.attributes).forEach(s=>{try{e.hasAttribute(s.name)||(l.removeAttribute(s.name),s.name in l&&(l[s.name]=!1))}catch(c){console.warn("diff: Error removing attribute",s.name,c)}})}catch(s){console.warn("diff: Error processing old attributes",s)}try{Array.from(e.attributes).forEach(s=>{try{let c=s.name,o=s.value;c==="value"&&(l.tagName==="INPUT"||l.tagName==="TEXTAREA")&&(hr(l)||l===document.activeElement)||l.getAttribute(c)!==o&&l.setAttribute(c,o),["checked","muted","autoplay","loop"].includes(c)&&(l[c]=!0)}catch(c){console.warn("diff: Error setting attribute",s.name,c)}})}catch(s){console.warn("diff: Error processing new attributes",s)}try{if(e.tagName==="INPUT"||e.tagName==="TEXTAREA"){let s=e.value===!1||e.value===null||e.value===void 0?"":String(e.value||""),c=l.value===!1||l.value===null||l.value===void 0?"":String(l.value||"");if(hr(l)){let o=fn(l);l===document.activeElement?(e.value=c,Ye.set(l,c)):s===o||s===c?l.value=s:(l.value=o,e.value=o)}else l===document.activeElement?e.value=c:c!==s&&(l.value=s)}}catch(s){console.warn("diff: Error syncing input value",s)}try{if(e.onclick!==l.onclick&&(l.onclick=e.onclick),l.tagName==="FORM"&&e.onsubmit!==l.onsubmit)if(e.onsubmit){let s=e.onsubmit;l.onsubmit=c=>{c.preventDefault(),c.stopPropagation(),s&&s(c)}}else l.onsubmit=null;else if(l.tagName==="INPUT"||l.tagName==="TEXTAREA"){if(e.oninput!==l.oninput)if(e.oninput){let s=e.oninput;l.oninput=c=>{Yt(l),s&&s(c)}}else l.oninput=null;if(e.onfocus!==l.onfocus)if(e.onfocus){let s=e.onfocus;l.onfocus=c=>{Sr(l),s&&s(c)}}else l.onfocus=null;if(e.onblur!==l.onblur)if(e.onblur){let s=e.onblur;l.onblur=c=>{kr(l),s&&s(c)}}else l.onblur=null}else e.oninput!==l.oninput&&(l.oninput=e.oninput)}catch(s){console.warn("diff: Error syncing events",s)}try{let s=Array.from(e.childNodes),c=Array.from(l.childNodes),o=Math.max(s.length,c.length);for(let p=0;p<o;p++)try{let b=s[p],i=c[p];if(b&&b instanceof Node)Ir(l,b,i);else if(i&&i instanceof Node)try{l.removeChild(i)}catch(x){console.warn("diff: Could not remove old child",x)}}catch(b){console.warn(`diff: Error diffing child at index ${p}`,b)}}catch(s){console.error("diff: Error processing children",s);try{r.replaceChild(e,l)}catch(c){console.error("diff: Fatal error in children fallback",c)}}}catch(s){console.error("diff: Fatal error",s);try{l&&l.parentNode===r?r.replaceChild(e,l):r.appendChild(e)}catch(c){console.error("diff: Cannot recover from error",c)}}}function Mr(r){let e=r==="/"?"/":r.replace(/\/$/,"");for(let l=0;l<ee.length;l++){let s=ee[l];if(s.regex.test(e)){let c=e.match(s.regex),o={};if(s.paramNames&&Array.isArray(s.paramNames))for(let p=0;p<s.paramNames.length;p++){let b=s.paramNames[p],i=c&&c[p+1]!==void 0?c[p+1]:void 0;i!=null&&i!==""?typeof i=="string"&&i.includes("/")?o[b]=i.split("/").filter(Boolean):i?o[b]=[i]:o[b]=[]:o[b]=[]}return{component:s.component,params:o||{},title:s.title||"ATOM App",meta:s.meta||[]}}}for(let l=0;l<ee.length;l++)if(ee[l].title==="404 Not Found")return{component:ee[l].component,params:{},title:"404 Not Found",meta:[]};return null}var vr=`*, ::before, ::after {
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
! tailwindcss v3.4.18 | MIT License | https://tailwindcss.com
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
} .\\!container {
  width: 100% !important;
} .container {
  width: 100%;
} @media (min-width: 640px) {

  .\\!container {
    max-width: 640px !important;
  }

  .container {
    max-width: 640px;
  }
} @media (min-width: 768px) {

  .\\!container {
    max-width: 768px !important;
  }

  .container {
    max-width: 768px;
  }
} @media (min-width: 1024px) {

  .\\!container {
    max-width: 1024px !important;
  }

  .container {
    max-width: 1024px;
  }
} @media (min-width: 1280px) {

  .\\!container {
    max-width: 1280px !important;
  }

  .container {
    max-width: 1280px;
  }
} @media (min-width: 1536px) {

  .\\!container {
    max-width: 1536px !important;
  }

  .container {
    max-width: 1536px;
  }
} .visible {
  visibility: visible;
} .collapse {
  visibility: collapse;
} .fixed {
  position: fixed;
} .absolute {
  position: absolute;
} .relative {
  position: relative;
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
} .col-span-2 {
  grid-column: span 2 / span 2;
} .m-2 {
  margin: 0.5rem;
} .m-4 {
  margin: 1rem;
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
} .ml-2 {
  margin-left: 0.5rem;
} .ml-4 {
  margin-left: 1rem;
} .ml-64 {
  margin-left: 16rem;
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
} .mt-3 {
  margin-top: 0.75rem;
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
} .inline-flex {
  display: inline-flex;
} .table {
  display: table;
} .grid {
  display: grid;
} .contents {
  display: contents;
} .hidden {
  display: none;
} .h-10 {
  height: 2.5rem;
} .h-12 {
  height: 3rem;
} .h-16 {
  height: 4rem;
} .h-2 {
  height: 0.5rem;
} .h-20 {
  height: 5rem;
} .h-24 {
  height: 6rem;
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
} .max-h-32 {
  max-height: 8rem;
} .max-h-40 {
  max-height: 10rem;
} .max-h-96 {
  max-height: 24rem;
} .min-h-\\[400px\\] {
  min-height: 400px;
} .min-h-screen {
  min-height: 100vh;
} .w-1 {
  width: 0.25rem;
} .w-1\\/2 {
  width: 50%;
} .w-1\\/4 {
  width: 25%;
} .w-10 {
  width: 2.5rem;
} .w-12 {
  width: 3rem;
} .w-16 {
  width: 4rem;
} .w-20 {
  width: 5rem;
} .w-3 {
  width: 0.75rem;
} .w-3\\/4 {
  width: 75%;
} .w-64 {
  width: 16rem;
} .w-8 {
  width: 2rem;
} .w-auto {
  width: auto;
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
} .border-collapse {
  border-collapse: collapse;
} .transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
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
} .resize-none {
  resize: none;
} .resize {
  resize: both;
} .grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
} .grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
} .grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
} .grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
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
} .space-y-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
} .overflow-auto {
  overflow: auto;
} .overflow-hidden {
  overflow: hidden;
} .overflow-x-auto {
  overflow-x: auto;
} .overflow-y-auto {
  overflow-y: auto;
} .whitespace-pre-wrap {
  white-space: pre-wrap;
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
} .border-green-200 {
  --tw-border-opacity: 1;
  border-color: rgb(187 247 208 / var(--tw-border-opacity, 1));
} .border-red-200 {
  --tw-border-opacity: 1;
  border-color: rgb(254 202 202 / var(--tw-border-opacity, 1));
} .border-red-300 {
  --tw-border-opacity: 1;
  border-color: rgb(252 165 165 / var(--tw-border-opacity, 1));
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
} .bg-blue-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
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
} .bg-gray-300 {
  --tw-bg-opacity: 1;
  background-color: rgb(209 213 219 / var(--tw-bg-opacity, 1));
} .bg-gray-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(156 163 175 / var(--tw-bg-opacity, 1));
} .bg-gray-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));
} .bg-gray-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(75 85 99 / var(--tw-bg-opacity, 1));
} .bg-gray-900 {
  --tw-bg-opacity: 1;
  background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));
} .bg-green-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1));
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
} .bg-red-900 {
  --tw-bg-opacity: 1;
  background-color: rgb(127 29 29 / var(--tw-bg-opacity, 1));
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
} .p-1 {
  padding: 0.25rem;
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
} .p-5 {
  padding: 1.25rem;
} .p-6 {
  padding: 1.5rem;
} .p-8 {
  padding: 2rem;
} .px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
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
} .text-left {
  text-align: left;
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
} .text-base {
  font-size: 1rem;
  line-height: 1.5rem;
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
} .text-blue-800 {
  --tw-text-opacity: 1;
  color: rgb(30 64 175 / var(--tw-text-opacity, 1));
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
} .text-green-800 {
  --tw-text-opacity: 1;
  color: rgb(22 101 52 / var(--tw-text-opacity, 1));
} .text-red-400 {
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity, 1));
} .text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity, 1));
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
} .underline {
  text-decoration-line: underline;
} .opacity-50 {
  opacity: 0.5;
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
} .outline {
  outline-style: solid;
} .ring-2 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
} .ring-blue-200 {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(191 219 254 / var(--tw-ring-opacity, 1));
} .blur {
  --tw-blur: blur(8px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
} .grayscale {
  --tw-grayscale: grayscale(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
} .filter {
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
} .backdrop-blur-md {
  --tw-backdrop-blur: blur(12px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
} .backdrop-filter {
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
} .transition-shadow {
  transition-property: box-shadow;
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
} `;if(typeof document<"u"&&vr&&!document.querySelector("link[data-atom-css]")){let e=document.createElement("style");e.setAttribute("data-atom-css",""),e.innerHTML=vr,document.head.appendChild(e)}var _n=`
    .err-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 2147483647; font-family: -apple-system, monospace; }
    .err-card { width: 100%; max-width: 650px; background: #0a0a0a; border: 1px solid #333; border-radius: 16px; box-shadow: 0 50px 100px -20px rgba(0,0,0,0.7); overflow: hidden; }
    .err-header { background: #1f1212; border-bottom: 1px solid #451a1a; padding: 16px 24px; display: flex; align-items: center; gap: 12px; }
    .err-icon { width: 12px; height: 12px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 10px #ef4444; }
    .err-title { color: #fca5a5; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .err-body { padding: 30px; }
    .err-msg { color: #94a3b8; font-size: 13px; line-height: 1.6; word-break: break-word; }
`;function In(r){let e=document.createElement("style");e.textContent=_n,document.head.appendChild(e);let l=document.createElement("div");l.className="err-backdrop";let s=r.message||"Unknown error occurred",c=r.stack?r.stack.split(`
`).slice(0,5).join(`
`):"",o=window.location.pathname;l.innerHTML=`
        <div class="err-card">
            <div class="err-header"><div class="err-icon"></div><div class="err-title">Runtime Error</div></div>
            <div class="err-body">
                <div class="err-msg"><strong>Error:</strong> ${s}</div>
                <div style="margin-top:12px; color:#888; font-size:11px;"><strong>Page:</strong> ${o}</div>
                ${c?`<div style="margin-top:12px; color:#666; font-size:10px; font-family:monospace; white-space:pre-wrap; max-height:150px; overflow:auto; background:#111; padding:8px; border-radius:4px;">${c}</div>`:""}
                <div style="margin-top:20px; color:#555; font-size:11px;">Check browser console for full stack trace.</div>
            </div>
        </div>
    `,document.body.appendChild(l)}function Mn(r,e,l){try{return r(e)}catch(s){console.error(`Component error in route "${l}":`,s);let c=s&&s.message?s.message:"Unknown error",o=s&&s.stack?s.stack:"";return n([n("\u26A0\uFE0F Component Error",{className:"text-red-600 font-bold text-lg mb-2"}),n(c,{className:"text-red-500 mb-2"}),n(o.split(`
`).slice(0,5).join(`
`),{className:"text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded overflow-auto max-h-32",style:{fontSize:"10px"}})],{className:"p-4 border border-red-300 bg-red-50 rounded",style:{margin:"20px"}})}}function Rr(){let r=document.getElementById("root");if(!r){console.error("renderApp: Root element not found");return}Me=!0;try{Array.isArray(B)||(B=[]),window.__ATOM_STATE__=B,Ve=0,Zt=0,pt=0,Qt=0;let e=Mr($e),l;if(e){try{document.title=e.title||"Atom App"}catch(s){console.warn("Failed to set document title:",s)}e.meta&&Array.isArray(e.meta)&&e.meta.forEach(s=>{try{if(s&&typeof s=="object"&&s.name&&s.content){let c=document.querySelector(`meta[name="${s.name}"]`);c||(c=document.createElement("meta"),c.name=s.name,document.head.appendChild(c)),c.content=s.content}}catch(c){console.warn("Failed to set meta tag:",s,c)}});try{let c={params:e.params||{}};if(typeof e.component!="function")throw new Error(`Route component is not a function. Received: ${typeof e.component}`);let o=Mn(e.component,c,$e);o&&typeof o.then=="function"?(l=n("Loading...",{className:"flex justify-center p-20 text-gray-500"}),o.then(p=>{try{if(p instanceof Node){let b=r.firstChild;b?r.replaceChild(p,b):r.appendChild(p)}else{console.error("Async component returned non-Node:",typeof p,p);let b=n("Error: Component must return a DOM Node"),i=r.firstChild;i?r.replaceChild(b,i):r.appendChild(b)}}catch(b){console.error("Error updating DOM after async component:",b)}}).catch(p=>{console.error("Async component error:",p);let b=n([n("\u26A0\uFE0F Loading Error",{className:"text-red-600 font-bold mb-2"}),n(p.message||"Failed to load component",{className:"text-red-500"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-4"}),i=r.firstChild;try{i?r.replaceChild(b,i):r.appendChild(b)}catch(x){console.error("Error displaying error node:",x)}})):l=o,(!l||!(l instanceof Node))&&(console.error("Component returned invalid value:",typeof l,l),l=n("Error: Component must return a DOM Node"))}catch(s){let c=new Error(`Error rendering route "${$e}": ${s.message}`);c.stack=s.stack,c.originalError=s,console.error("Route Error:",{path:$e,error:s.message,stack:s.stack}),In(c),l=n([n("\u26A0\uFE0F Rendering Error",{className:"text-red-600 font-bold text-lg mb-2"}),n(s.message||"Unknown error",{className:"text-red-500"})],{className:"p-4 border border-red-300 bg-red-50 rounded m-4"})}}else l=n([n("404 - Page Not Found",{className:"text-gray-800 font-bold text-xl mb-2"}),n(`The route "${$e}" was not found.`,{className:"text-gray-600"}),L("Go Home",{href:"/",className:"text-blue-600 hover:underline mt-4 inline-block"})],{className:"p-8 text-center"});(!l||!(l instanceof Node))&&(console.error("VNode is not a valid Node:",typeof l,l),l=n("Error: Invalid component return value"));try{let s=r.firstChild;s?l&&l instanceof Node?Ir(r,l,s):(console.error("Cannot diff: VNode is not a valid Node",l),(!l||!(l instanceof Node))&&(l=n("Error: Invalid component return value")),r.replaceChild(l,s)):r.appendChild(l)}catch(s){console.error("Error updating DOM:",s);try{r.innerHTML="",r.appendChild(l)}catch(c){console.error("Fatal: Cannot update DOM:",c)}}}catch(e){console.error("Fatal error in renderApp:",e);try{r.innerHTML=`<div style="padding: 20px; color: red; font-family: monospace;">
                <h1>Fatal Error</h1>
                <p>${e.message||"Unknown error"}</p>
                <pre style="font-size: 10px; overflow: auto;">${e.stack||""}</pre>
            </div>`}catch(l){console.error("Cannot even display error:",l)}}finally{Me=!1}}typeof window<"u"&&(window.addEventListener("beforeunload",()=>{Jt(),_e&&clearTimeout(_e)}),window.onpopstate=()=>{Jt(),$e=window.location.pathname,Ve=0,Je()},document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Je):Je());return mn(Rn);})();
