!function(t,s){"object"==typeof exports&&"undefined"!=typeof module?module.exports=s():"function"==typeof define&&define.amd?define(s):(t=t||self).rough=s()}(this,function(){"use strict";const t="undefined"!=typeof self;class s{constructor(t,s){this.defaultOptions={maxRandomnessOffset:2,roughness:1,bowing:1,stroke:"#000",strokeWidth:1,curveTightness:0,curveStepCount:9,fillStyle:"hachure",fillWeight:-1,hachureAngle:-41,hachureGap:-1},this.config=t||{},this.surface=s,this.config.options&&(this.defaultOptions=this._options(this.config.options))}_options(t){return t?Object.assign({},this.defaultOptions,t):this.defaultOptions}_drawable(t,s,e){return{shape:t,sets:s||[],options:e||this.defaultOptions}}getCanvasSize(){const t=t=>t&&"object"==typeof t&&t.baseVal&&t.baseVal.value?t.baseVal.value:t||100;return this.surface?[t(this.surface.width),t(this.surface.height)]:[100,100]}computePolygonSize(t){if(t.length){let s=t[0][0],e=t[0][0],i=t[0][1],n=t[0][1];for(let h=1;h<t.length;h++)s=Math.min(s,t[h][0]),e=Math.max(e,t[h][0]),i=Math.min(i,t[h][1]),n=Math.max(n,t[h][1]);return[e-s,n-i]}return[0,0]}polygonPath(t){let s="";if(t.length){s=`M${t[0][0]},${t[0][1]}`;for(let e=1;e<t.length;e++)s=`${s} L${t[e][0]},${t[e][1]}`}return s}computePathSize(s){let e=[0,0];if(t&&self.document)try{const t="http://www.w3.org/2000/svg",i=self.document.createElementNS(t,"svg");i.setAttribute("width","0"),i.setAttribute("height","0");const n=self.document.createElementNS(t,"path");n.setAttribute("d",s),i.appendChild(n),self.document.body.appendChild(i);const h=n.getBBox();h&&(e[0]=h.width||0,e[1]=h.height||0),self.document.body.removeChild(i)}catch(t){}const i=this.getCanvasSize();return e[0]*e[1]||(e=i),e}toPaths(t){const s=t.sets||[],e=t.options||this.defaultOptions,i=[];for(const t of s){let s=null;switch(t.type){case"path":s={d:this.opsToPath(t),stroke:e.stroke,strokeWidth:e.strokeWidth,fill:"none"};break;case"fillPath":s={d:this.opsToPath(t),stroke:"none",strokeWidth:0,fill:e.fill||"none"};break;case"fillSketch":s=this.fillSketch(t,e);break;case"path2Dfill":s={d:t.path||"",stroke:"none",strokeWidth:0,fill:e.fill||"none"};break;case"path2Dpattern":{const i=t.size,n={x:0,y:0,width:1,height:1,viewBox:`0 0 ${Math.round(i[0])} ${Math.round(i[1])}`,patternUnits:"objectBoundingBox",path:this.fillSketch(t,e)};s={d:t.path,stroke:"none",strokeWidth:0,pattern:n};break}}s&&i.push(s)}return i}fillSketch(t,s){let e=s.fillWeight;return e<0&&(e=s.strokeWidth/2),{d:this.opsToPath(t),stroke:s.fill||"none",strokeWidth:e,fill:"none"}}opsToPath(t){let s="";for(const e of t.ops){const t=e.data;switch(e.op){case"move":s+=`M${t[0]} ${t[1]} `;break;case"bcurveTo":s+=`C${t[0]} ${t[1]}, ${t[2]} ${t[3]}, ${t[4]} ${t[5]} `;break;case"qcurveTo":s+=`Q${t[0]} ${t[1]}, ${t[2]} ${t[3]} `;break;case"lineTo":s+=`L${t[0]} ${t[1]} `}}return s.trim()}}function e(t,s){return t.type===s}const i={A:7,a:7,C:6,c:6,H:1,h:1,L:2,l:2,M:2,m:2,Q:4,q:4,S:4,s:4,T:4,t:2,V:1,v:1,Z:0,z:0};class n{constructor(t){this.COMMAND=0,this.NUMBER=1,this.EOD=2,this.segments=[],this.parseData(t),this.processPoints()}tokenize(t){const s=new Array;for(;""!==t;)if(t.match(/^([ \t\r\n,]+)/))t=t.substr(RegExp.$1.length);else if(t.match(/^([aAcChHlLmMqQsStTvVzZ])/))s[s.length]={type:this.COMMAND,text:RegExp.$1},t=t.substr(RegExp.$1.length);else{if(!t.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/))return console.error("Unrecognized segment command: "+t),[];s[s.length]={type:this.NUMBER,text:`${parseFloat(RegExp.$1)}`},t=t.substr(RegExp.$1.length)}return s[s.length]={type:this.EOD,text:""},s}parseData(t){const s=this.tokenize(t);let n=0,h=s[n],a="BOD";for(this.segments=new Array;!e(h,this.EOD);){let o;const r=new Array;if("BOD"===a){if("M"!==h.text&&"m"!==h.text)return void this.parseData("M0,0"+t);n++,o=i[h.text],a=h.text}else e(h,this.NUMBER)?o=i[a]:(n++,o=i[h.text],a=h.text);if(n+o<s.length){for(let t=n;t<n+o;t++){const i=s[t];if(!e(i,this.NUMBER))return void console.error("Parameter type is not a number: "+a+","+i.text);r[r.length]=+i.text}if("number"!=typeof i[a])return void console.error("Unsupported segment type: "+a);{const t={key:a,data:r};this.segments.push(t),h=s[n+=o],"M"===a&&(a="L"),"m"===a&&(a="l")}}else console.error("Path data ended before all parameters were found")}}get closed(){if(void 0===this._closed){this._closed=!1;for(const t of this.segments)"z"===t.key.toLowerCase()&&(this._closed=!0)}return this._closed}processPoints(){let t=null,s=[0,0];for(let e=0;e<this.segments.length;e++){const i=this.segments[e];switch(i.key){case"M":case"L":case"T":i.point=[i.data[0],i.data[1]];break;case"m":case"l":case"t":i.point=[i.data[0]+s[0],i.data[1]+s[1]];break;case"H":i.point=[i.data[0],s[1]];break;case"h":i.point=[i.data[0]+s[0],s[1]];break;case"V":i.point=[s[0],i.data[0]];break;case"v":i.point=[s[0],i.data[0]+s[1]];break;case"z":case"Z":t&&(i.point=[t[0],t[1]]);break;case"C":i.point=[i.data[4],i.data[5]];break;case"c":i.point=[i.data[4]+s[0],i.data[5]+s[1]];break;case"S":i.point=[i.data[2],i.data[3]];break;case"s":i.point=[i.data[2]+s[0],i.data[3]+s[1]];break;case"Q":i.point=[i.data[2],i.data[3]];break;case"q":i.point=[i.data[2]+s[0],i.data[3]+s[1]];break;case"A":i.point=[i.data[5],i.data[6]];break;case"a":i.point=[i.data[5]+s[0],i.data[6]+s[1]]}"m"!==i.key&&"M"!==i.key||(t=null),i.point&&(s=i.point,t||(t=i.point)),"z"!==i.key&&"Z"!==i.key||(t=null)}}}class h{constructor(t){this._position=[0,0],this._first=null,this.bezierReflectionPoint=null,this.quadReflectionPoint=null,this.parsed=new n(t)}get segments(){return this.parsed.segments}get closed(){return this.parsed.closed}get linearPoints(){if(!this._linearPoints){const t=[];let s=[];for(const e of this.parsed.segments){const i=e.key.toLowerCase();("m"!==i&&"z"!==i||(s.length&&(t.push(s),s=[]),"z"!==i))&&(e.point&&s.push(e.point))}s.length&&(t.push(s),s=[]),this._linearPoints=t}return this._linearPoints}get first(){return this._first}set first(t){this._first=t}setPosition(t,s){this._position=[t,s],this._first||(this._first=[t,s])}get position(){return this._position}get x(){return this._position[0]}get y(){return this._position[1]}}class a{constructor(t,s,e,i,n,h){if(this._segIndex=0,this._numSegs=0,this._rx=0,this._ry=0,this._sinPhi=0,this._cosPhi=0,this._C=[0,0],this._theta=0,this._delta=0,this._T=0,this._from=t,t[0]===s[0]&&t[1]===s[1])return;const a=Math.PI/180;this._rx=Math.abs(e[0]),this._ry=Math.abs(e[1]),this._sinPhi=Math.sin(i*a),this._cosPhi=Math.cos(i*a);const o=this._cosPhi*(t[0]-s[0])/2+this._sinPhi*(t[1]-s[1])/2,r=-this._sinPhi*(t[0]-s[0])/2+this._cosPhi*(t[1]-s[1])/2;let l=0;const c=this._rx*this._rx*this._ry*this._ry-this._rx*this._rx*r*r-this._ry*this._ry*o*o;if(c<0){const t=Math.sqrt(1-c/(this._rx*this._rx*this._ry*this._ry));this._rx=this._rx*t,this._ry=this._ry*t,l=0}else l=(n===h?-1:1)*Math.sqrt(c/(this._rx*this._rx*r*r+this._ry*this._ry*o*o));const p=l*this._rx*r/this._ry,u=-l*this._ry*o/this._rx;this._C=[0,0],this._C[0]=this._cosPhi*p-this._sinPhi*u+(t[0]+s[0])/2,this._C[1]=this._sinPhi*p+this._cosPhi*u+(t[1]+s[1])/2,this._theta=this.calculateVectorAngle(1,0,(o-p)/this._rx,(r-u)/this._ry);let f=this.calculateVectorAngle((o-p)/this._rx,(r-u)/this._ry,(-o-p)/this._rx,(-r-u)/this._ry);!h&&f>0?f-=2*Math.PI:h&&f<0&&(f+=2*Math.PI),this._numSegs=Math.ceil(Math.abs(f/(Math.PI/2))),this._delta=f/this._numSegs,this._T=8/3*Math.sin(this._delta/4)*Math.sin(this._delta/4)/Math.sin(this._delta/2)}getNextSegment(){if(this._segIndex===this._numSegs)return null;const t=Math.cos(this._theta),s=Math.sin(this._theta),e=this._theta+this._delta,i=Math.cos(e),n=Math.sin(e),h=[this._cosPhi*this._rx*i-this._sinPhi*this._ry*n+this._C[0],this._sinPhi*this._rx*i+this._cosPhi*this._ry*n+this._C[1]],a=[this._from[0]+this._T*(-this._cosPhi*this._rx*s-this._sinPhi*this._ry*t),this._from[1]+this._T*(-this._sinPhi*this._rx*s+this._cosPhi*this._ry*t)],o=[h[0]+this._T*(this._cosPhi*this._rx*n+this._sinPhi*this._ry*i),h[1]+this._T*(this._sinPhi*this._rx*n-this._cosPhi*this._ry*i)];return this._theta=e,this._from=[h[0],h[1]],this._segIndex++,{cp1:a,cp2:o,to:h}}calculateVectorAngle(t,s,e,i){const n=Math.atan2(s,t),h=Math.atan2(i,e);return h>=n?h-n:2*Math.PI-(n-h)}}class o{constructor(t,s){this.sets=t,this.closed=s}fit(t){const s=[];for(const e of this.sets){const i=e.length;let n=Math.floor(t*i);if(n<5){if(i<=5)continue;n=5}s.push(this.reduce(e,n))}let e="";for(const t of s){for(let s=0;s<t.length;s++){const i=t[s];e+=0===s?"M"+i[0]+","+i[1]:"L"+i[0]+","+i[1]}this.closed&&(e+="z ")}return e}distance(t,s){return Math.sqrt(Math.pow(t[0]-s[0],2)+Math.pow(t[1]-s[1],2))}reduce(t,s){if(t.length<=s)return t;const e=t.slice(0);for(;e.length>s;){let t=-1,s=-1;for(let i=1;i<e.length-1;i++){const n=this.distance(e[i-1],e[i]),h=this.distance(e[i],e[i+1]),a=this.distance(e[i-1],e[i+1]),o=(n+h+a)/2,r=Math.sqrt(o*(o-n)*(o-h)*(o-a));(t<0||r<t)&&(t=r,s=i)}if(!(s>0))break;e.splice(s,1)}return e}}class r{constructor(t,s){this.xi=Number.MAX_VALUE,this.yi=Number.MAX_VALUE,this.px1=t[0],this.py1=t[1],this.px2=s[0],this.py2=s[1],this.a=this.py2-this.py1,this.b=this.px1-this.px2,this.c=this.px2*this.py1-this.px1*this.py2,this._undefined=0===this.a&&0===this.b&&0===this.c}isUndefined(){return this._undefined}intersects(t){if(this.isUndefined()||t.isUndefined())return!1;let s=Number.MAX_VALUE,e=Number.MAX_VALUE,i=0,n=0;const h=this.a,a=this.b,o=this.c;return Math.abs(a)>1e-5&&(s=-h/a,i=-o/a),Math.abs(t.b)>1e-5&&(e=-t.a/t.b,n=-t.c/t.b),s===Number.MAX_VALUE?e===Number.MAX_VALUE?-o/h==-t.c/t.a&&(this.py1>=Math.min(t.py1,t.py2)&&this.py1<=Math.max(t.py1,t.py2)?(this.xi=this.px1,this.yi=this.py1,!0):this.py2>=Math.min(t.py1,t.py2)&&this.py2<=Math.max(t.py1,t.py2)&&(this.xi=this.px2,this.yi=this.py2,!0)):(this.xi=this.px1,this.yi=e*this.xi+n,!((this.py1-this.yi)*(this.yi-this.py2)<-1e-5||(t.py1-this.yi)*(this.yi-t.py2)<-1e-5)&&(!(Math.abs(t.a)<1e-5)||!((t.px1-this.xi)*(this.xi-t.px2)<-1e-5))):e===Number.MAX_VALUE?(this.xi=t.px1,this.yi=s*this.xi+i,!((t.py1-this.yi)*(this.yi-t.py2)<-1e-5||(this.py1-this.yi)*(this.yi-this.py2)<-1e-5)&&(!(Math.abs(h)<1e-5)||!((this.px1-this.xi)*(this.xi-this.px2)<-1e-5))):s===e?i===n&&(this.px1>=Math.min(t.px1,t.px2)&&this.px1<=Math.max(t.py1,t.py2)?(this.xi=this.px1,this.yi=this.py1,!0):this.px2>=Math.min(t.px1,t.px2)&&this.px2<=Math.max(t.px1,t.px2)&&(this.xi=this.px2,this.yi=this.py2,!0)):(this.xi=(n-i)/(s-e),this.yi=s*this.xi+i,!((this.px1-this.xi)*(this.xi-this.px2)<-1e-5||(t.px1-this.xi)*(this.xi-t.px2)<-1e-5))}}class l{constructor(t,s,e,i,n,h,a,o){this.deltaX=0,this.hGap=0,this.top=t,this.bottom=s,this.left=e,this.right=i,this.gap=n,this.sinAngle=h,this.tanAngle=o,Math.abs(h)<1e-4?this.pos=e+n:Math.abs(h)>.9999?this.pos=t+n:(this.deltaX=(s-t)*Math.abs(o),this.pos=e-Math.abs(this.deltaX),this.hGap=Math.abs(n/a),this.sLeft=new r([e,s],[e,t]),this.sRight=new r([i,s],[i,t]))}nextLine(){if(Math.abs(this.sinAngle)<1e-4){if(this.pos<this.right){const t=[this.pos,this.top,this.pos,this.bottom];return this.pos+=this.gap,t}}else if(Math.abs(this.sinAngle)>.9999){if(this.pos<this.bottom){const t=[this.left,this.pos,this.right,this.pos];return this.pos+=this.gap,t}}else{let t=this.pos-this.deltaX/2,s=this.pos+this.deltaX/2,e=this.bottom,i=this.top;if(this.pos<this.right+this.deltaX){for(;t<this.left&&s<this.left||t>this.right&&s>this.right;)if(this.pos+=this.hGap,t=this.pos-this.deltaX/2,s=this.pos+this.deltaX/2,this.pos>this.right+this.deltaX)return null;const n=new r([t,e],[s,i]);this.sLeft&&n.intersects(this.sLeft)&&(t=n.xi,e=n.yi),this.sRight&&n.intersects(this.sRight)&&(s=n.xi,i=n.yi),this.tanAngle>0&&(t=this.right-(t-this.left),s=this.right-(s-this.left));const h=[t,e,s,i];return this.pos+=this.hGap,h}}return null}}function c(t){const s=t[0],e=t[1];return Math.sqrt(Math.pow(s[0]-e[0],2)+Math.pow(s[1]-e[1],2))}function p(t,s){const e=[],i=new r([t[0],t[1]],[t[2],t[3]]);for(let t=0;t<s.length;t++){const n=new r(s[t],s[(t+1)%s.length]);i.intersects(n)&&e.push([i.xi,i.yi])}return e}function u(t,s,e,i,n,h,a){return[-e*h-i*n+e+h*t+n*s,a*(e*n-i*h)+i+-a*n*t+a*h*s]}function f(t,s){const e=[];if(t&&t.length){let i=t[0][0],n=t[0][0],h=t[0][1],a=t[0][1];for(let s=1;s<t.length;s++)i=Math.min(i,t[s][0]),n=Math.max(n,t[s][0]),h=Math.min(h,t[s][1]),a=Math.max(a,t[s][1]);const o=s.hachureAngle;let r=s.hachureGap;r<0&&(r=4*s.strokeWidth),r=Math.max(r,.1);const c=o%180*(Math.PI/180),u=Math.cos(c),f=Math.sin(c),d=Math.tan(c),g=new l(h-1,a+1,i-1,n+1,r,f,u,d);let y;for(;null!=(y=g.nextLine());){const s=p(y,t);for(let t=0;t<s.length;t++)if(t<s.length-1){const i=s[t],n=s[t+1];e.push([i,n])}}}return e}function d(t,s,e,i,n){const h=[];let a=Math.abs(e/2),o=Math.abs(i/2);a+=C(.05*a,n),o+=C(.05*o,n);const r=n.hachureAngle;let l=n.hachureGap;l<=0&&(l=4*n.strokeWidth);let c=n.fillWeight;c<0&&(c=n.strokeWidth/2);const p=r%180*(Math.PI/180),f=Math.tan(p),d=o/a,g=Math.sqrt(d*f*d*f+1),y=d*f/g,x=1/g,_=l/(a*o/Math.sqrt(o*x*(o*x)+a*y*(a*y))/a);let M=Math.sqrt(a*a-(t-a+_)*(t-a+_));for(let e=t-a+_;e<t+a;e+=_){const i=u(e,s-(M=Math.sqrt(a*a-(t-e)*(t-e))),t,s,y,x,d),n=u(e,s+M,t,s,y,x,d);h.push([i,n])}return h}class g{fillPolygon(t,s){return this._fillPolygon(t,s)}fillEllipse(t,s,e,i,n){return this._fillEllipse(t,s,e,i,n)}_fillPolygon(t,s,e=!1){const i=f(t,s);return{type:"fillSketch",ops:this.renderLines(i,s,e)}}_fillEllipse(t,s,e,i,n,h=!1){const a=d(t,s,e,i,n);return{type:"fillSketch",ops:this.renderLines(a,n,h)}}renderLines(t,s,e){let i=[],n=null;for(const h of t)i=i.concat(O(h[0][0],h[0][1],h[1][0],h[1][1],s)),e&&n&&(i=i.concat(O(n[0],n[1],h[0][0],h[0][1],s))),n=h[1];return i}}class y extends g{fillPolygon(t,s){return this._fillPolygon(t,s,!0)}fillEllipse(t,s,e,i,n){return this._fillEllipse(t,s,e,i,n,!0)}}class x extends g{fillPolygon(t,s){const e=this._fillPolygon(t,s),i=Object.assign({},s,{hachureAngle:s.hachureAngle+90}),n=this._fillPolygon(t,i);return e.ops=e.ops.concat(n.ops),e}fillEllipse(t,s,e,i,n){const h=this._fillEllipse(t,s,e,i,n),a=Object.assign({},n,{hachureAngle:n.hachureAngle+90}),o=this._fillEllipse(t,s,e,i,a);return h.ops=h.ops.concat(o.ops),h}}class _{fillPolygon(t,s){const e=f(t,s=Object.assign({},s,{curveStepCount:4,hachureAngle:0}));return this.dotsOnLines(e,s)}fillEllipse(t,s,e,i,n){const h=d(t,s,e,i,n=Object.assign({},n,{curveStepCount:4,hachureAngle:0}));return this.dotsOnLines(h,n)}dotsOnLines(t,s){let e=[],i=s.hachureGap;i<0&&(i=4*s.strokeWidth),i=Math.max(i,.1);let n=s.fillWeight;n<0&&(n=s.strokeWidth/2);for(const h of t){const t=c(h)/i,a=Math.ceil(t)-1,o=Math.atan((h[1][1]-h[0][1])/(h[1][0]-h[0][0]));for(let t=0;t<a;t++){const a=i*(t+1),r=a*Math.sin(o),l=a*Math.cos(o),c=[h[0][0]-l,h[0][1]+r],p=v(E(c[0]-i/4,c[0]+i/4,s),E(c[1]-i/4,c[1]+i/4,s),n,n,s);e=e.concat(p.ops)}}return{type:"fillSketch",ops:e}}}const M={};function b(t){let s=t.fillStyle||"hachure";if(!M[s])switch(s){case"zigzag":M[s]||(M[s]=new y);break;case"cross-hatch":M[s]||(M[s]=new x);break;case"dots":M[s]||(M[s]=new _);break;case"hachure":default:M[s="hachure"]||(M[s]=new g)}return M[s]}function m(t,s,e,i,n){return{type:"path",ops:z(t,s,e,i,n)}}function w(t,s,e){const i=(t||[]).length;if(i>2){let n=[];for(let s=0;s<i-1;s++)n=n.concat(z(t[s][0],t[s][1],t[s+1][0],t[s+1][1],e));return s&&(n=n.concat(z(t[i-1][0],t[i-1][1],t[0][0],t[0][1],e))),{type:"path",ops:n}}return 2===i?m(t[0][0],t[0][1],t[1][0],t[1][1],e):{type:"path",ops:[]}}function k(t,s,e,i,n){return function(t,s){return w(t,!0,s)}([[t,s],[t+e,s],[t+e,s+i],[t,s+i]],n)}function P(t,s){const e=R(t,1*(1+.2*s.roughness),s),i=R(t,1.5*(1+.22*s.roughness),s);return{type:"path",ops:e.concat(i)}}function v(t,s,e,i,n){const h=2*Math.PI/n.curveStepCount;let a=Math.abs(e/2),o=Math.abs(i/2);const r=L(h,t,s,a+=$(.05*a,n),o+=$(.05*o,n),1,h*N(.1,N(.4,1,n),n),n),l=L(h,t,s,a,o,1.5,0,n);return{type:"path",ops:r.concat(l)}}function S(t,s,e,i,n,h,a,o,r){const l=t,c=s;let p=Math.abs(e/2),u=Math.abs(i/2);p+=$(.01*p,r),u+=$(.01*u,r);let f=n,d=h;for(;f<0;)f+=2*Math.PI,d+=2*Math.PI;d-f>2*Math.PI&&(f=0,d=2*Math.PI);const g=2*Math.PI/r.curveStepCount,y=Math.min(g/2,(d-f)/2),x=q(y,l,c,p,u,f,d,1,r),_=q(y,l,c,p,u,f,d,1.5,r);let M=x.concat(_);return a&&(o?M=(M=M.concat(z(l,c,l+p*Math.cos(f),c+u*Math.sin(f),r))).concat(z(l,c,l+p*Math.cos(d),c+u*Math.sin(d),r)):(M.push({op:"lineTo",data:[l,c]}),M.push({op:"lineTo",data:[l+p*Math.cos(f),c+u*Math.sin(f)]}))),{type:"path",ops:M}}function A(t,s){const e=[];if(t.length){const i=s.maxRandomnessOffset||0,n=t.length;if(n>2){e.push({op:"move",data:[t[0][0]+$(i,s),t[0][1]+$(i,s)]});for(let h=1;h<n;h++)e.push({op:"lineTo",data:[t[h][0]+$(i,s),t[h][1]+$(i,s)]})}}return{type:"fillPath",ops:e}}function T(t,s){return b(s).fillPolygon(t,s)}function C(t,s){return $(t,s)}function E(t,s,e){return N(t,s,e)}function O(t,s,e,i,n){return z(t,s,e,i,n)}function N(t,s,e){return e.roughness*(Math.random()*(s-t)+t)}function $(t,s){return N(-t,t,s)}function z(t,s,e,i,n){const h=D(t,s,e,i,n,!0,!1),a=D(t,s,e,i,n,!0,!0);return h.concat(a)}function D(t,s,e,i,n,h,a){const o=Math.pow(t-e,2)+Math.pow(s-i,2);let r=n.maxRandomnessOffset||0;r*r*100>o&&(r=Math.sqrt(o)/10);const l=r/2,c=.2+.2*Math.random();let p=n.bowing*n.maxRandomnessOffset*(i-s)/200,u=n.bowing*n.maxRandomnessOffset*(t-e)/200;p=$(p,n),u=$(u,n);const f=[],d=()=>$(l,n),g=()=>$(r,n);return h&&(a?f.push({op:"move",data:[t+d(),s+d()]}):f.push({op:"move",data:[t+$(r,n),s+$(r,n)]})),a?f.push({op:"bcurveTo",data:[p+t+(e-t)*c+d(),u+s+(i-s)*c+d(),p+t+2*(e-t)*c+d(),u+s+2*(i-s)*c+d(),e+d(),i+d()]}):f.push({op:"bcurveTo",data:[p+t+(e-t)*c+g(),u+s+(i-s)*c+g(),p+t+2*(e-t)*c+g(),u+s+2*(i-s)*c+g(),e+g(),i+g()]}),f}function R(t,s,e){const i=[];i.push([t[0][0]+$(s,e),t[0][1]+$(s,e)]),i.push([t[0][0]+$(s,e),t[0][1]+$(s,e)]);for(let n=1;n<t.length;n++)i.push([t[n][0]+$(s,e),t[n][1]+$(s,e)]),n===t.length-1&&i.push([t[n][0]+$(s,e),t[n][1]+$(s,e)]);return W(i,null,e)}function W(t,s,e){const i=t.length;let n=[];if(i>3){const h=[],a=1-e.curveTightness;n.push({op:"move",data:[t[1][0],t[1][1]]});for(let s=1;s+2<i;s++){const e=t[s];h[0]=[e[0],e[1]],h[1]=[e[0]+(a*t[s+1][0]-a*t[s-1][0])/6,e[1]+(a*t[s+1][1]-a*t[s-1][1])/6],h[2]=[t[s+1][0]+(a*t[s][0]-a*t[s+2][0])/6,t[s+1][1]+(a*t[s][1]-a*t[s+2][1])/6],h[3]=[t[s+1][0],t[s+1][1]],n.push({op:"bcurveTo",data:[h[1][0],h[1][1],h[2][0],h[2][1],h[3][0],h[3][1]]})}if(s&&2===s.length){const t=e.maxRandomnessOffset;n.push({op:"lineTo",data:[s[0]+$(t,e),s[1]+$(t,e)]})}}else 3===i?(n.push({op:"move",data:[t[1][0],t[1][1]]}),n.push({op:"bcurveTo",data:[t[1][0],t[1][1],t[2][0],t[2][1],t[2][0],t[2][1]]})):2===i&&(n=n.concat(z(t[0][0],t[0][1],t[1][0],t[1][1],e)));return n}function L(t,s,e,i,n,h,a,o){const r=$(.5,o)-Math.PI/2,l=[];l.push([$(h,o)+s+.9*i*Math.cos(r-t),$(h,o)+e+.9*n*Math.sin(r-t)]);for(let a=r;a<2*Math.PI+r-.01;a+=t)l.push([$(h,o)+s+i*Math.cos(a),$(h,o)+e+n*Math.sin(a)]);return l.push([$(h,o)+s+i*Math.cos(r+2*Math.PI+.5*a),$(h,o)+e+n*Math.sin(r+2*Math.PI+.5*a)]),l.push([$(h,o)+s+.98*i*Math.cos(r+a),$(h,o)+e+.98*n*Math.sin(r+a)]),l.push([$(h,o)+s+.9*i*Math.cos(r+.5*a),$(h,o)+e+.9*n*Math.sin(r+.5*a)]),W(l,null,o)}function q(t,s,e,i,n,h,a,o,r){const l=h+$(.1,r),c=[];c.push([$(o,r)+s+.9*i*Math.cos(l-t),$(o,r)+e+.9*n*Math.sin(l-t)]);for(let h=l;h<=a;h+=t)c.push([$(o,r)+s+i*Math.cos(h),$(o,r)+e+n*Math.sin(h)]);return c.push([s+i*Math.cos(a),e+n*Math.sin(a)]),c.push([s+i*Math.cos(a),e+n*Math.sin(a)]),W(c,null,r)}function I(t,s,e,i,n,h,a,o){const r=[],l=[o.maxRandomnessOffset||1,(o.maxRandomnessOffset||1)+.5];let c=[0,0];for(let p=0;p<2;p++)0===p?r.push({op:"move",data:[a.x,a.y]}):r.push({op:"move",data:[a.x+$(l[0],o),a.y+$(l[0],o)]}),c=[n+$(l[p],o),h+$(l[p],o)],r.push({op:"bcurveTo",data:[t+$(l[p],o),s+$(l[p],o),e+$(l[p],o),i+$(l[p],o),c[0],c[1]]});return a.setPosition(c[0],c[1]),r}function B(t,s,e,i){let n=[];switch(s.key){case"M":case"m":{const e="m"===s.key;if(s.data.length>=2){let h=+s.data[0],a=+s.data[1];e&&(h+=t.x,a+=t.y);const o=1*(i.maxRandomnessOffset||0);h+=$(o,i),a+=$(o,i),t.setPosition(h,a),n.push({op:"move",data:[h,a]})}break}case"L":case"l":{const e="l"===s.key;if(s.data.length>=2){let h=+s.data[0],a=+s.data[1];e&&(h+=t.x,a+=t.y),n=n.concat(z(t.x,t.y,h,a,i)),t.setPosition(h,a)}break}case"H":case"h":{const e="h"===s.key;if(s.data.length){let h=+s.data[0];e&&(h+=t.x),n=n.concat(z(t.x,t.y,h,t.y,i)),t.setPosition(h,t.y)}break}case"V":case"v":{const e="v"===s.key;if(s.data.length){let h=+s.data[0];e&&(h+=t.y),n=n.concat(z(t.x,t.y,t.x,h,i)),t.setPosition(t.x,h)}break}case"Z":case"z":t.first&&(n=n.concat(z(t.x,t.y,t.first[0],t.first[1],i)),t.setPosition(t.first[0],t.first[1]),t.first=null);break;case"C":case"c":{const e="c"===s.key;if(s.data.length>=6){let h=+s.data[0],a=+s.data[1],o=+s.data[2],r=+s.data[3],l=+s.data[4],c=+s.data[5];e&&(h+=t.x,o+=t.x,l+=t.x,a+=t.y,r+=t.y,c+=t.y);const p=I(h,a,o,r,l,c,t,i);n=n.concat(p),t.bezierReflectionPoint=[l+(l-o),c+(c-r)]}break}case"S":case"s":{const h="s"===s.key;if(s.data.length>=4){let a=+s.data[0],o=+s.data[1],r=+s.data[2],l=+s.data[3];h&&(a+=t.x,r+=t.x,o+=t.y,l+=t.y);let c=a,p=o;const u=e?e.key:"";let f=null;"c"!==u&&"C"!==u&&"s"!==u&&"S"!==u||(f=t.bezierReflectionPoint),f&&(c=f[0],p=f[1]);const d=I(c,p,a,o,r,l,t,i);n=n.concat(d),t.bezierReflectionPoint=[r+(r-a),l+(l-o)]}break}case"Q":case"q":{const e="q"===s.key;if(s.data.length>=4){let h=+s.data[0],a=+s.data[1],o=+s.data[2],r=+s.data[3];e&&(h+=t.x,o+=t.x,a+=t.y,r+=t.y);const l=1*(1+.2*i.roughness),c=1.5*(1+.22*i.roughness);n.push({op:"move",data:[t.x+$(l,i),t.y+$(l,i)]});let p=[o+$(l,i),r+$(l,i)];n.push({op:"qcurveTo",data:[h+$(l,i),a+$(l,i),p[0],p[1]]}),n.push({op:"move",data:[t.x+$(c,i),t.y+$(c,i)]}),p=[o+$(c,i),r+$(c,i)],n.push({op:"qcurveTo",data:[h+$(c,i),a+$(c,i),p[0],p[1]]}),t.setPosition(p[0],p[1]),t.quadReflectionPoint=[o+(o-h),r+(r-a)]}break}case"T":case"t":{const h="t"===s.key;if(s.data.length>=2){let a=+s.data[0],o=+s.data[1];h&&(a+=t.x,o+=t.y);let r=a,l=o;const c=e?e.key:"";let p=null;"q"!==c&&"Q"!==c&&"t"!==c&&"T"!==c||(p=t.quadReflectionPoint),p&&(r=p[0],l=p[1]);const u=1*(1+.2*i.roughness),f=1.5*(1+.22*i.roughness);n.push({op:"move",data:[t.x+$(u,i),t.y+$(u,i)]});let d=[a+$(u,i),o+$(u,i)];n.push({op:"qcurveTo",data:[r+$(u,i),l+$(u,i),d[0],d[1]]}),n.push({op:"move",data:[t.x+$(f,i),t.y+$(f,i)]}),d=[a+$(f,i),o+$(f,i)],n.push({op:"qcurveTo",data:[r+$(f,i),l+$(f,i),d[0],d[1]]}),t.setPosition(d[0],d[1]),t.quadReflectionPoint=[a+(a-r),o+(o-l)]}break}case"A":case"a":{const e="a"===s.key;if(s.data.length>=7){const h=+s.data[0],o=+s.data[1],r=+s.data[2],l=+s.data[3],c=+s.data[4];let p=+s.data[5],u=+s.data[6];if(e&&(p+=t.x,u+=t.y),p===t.x&&u===t.y)break;if(0===h||0===o)n=n.concat(z(t.x,t.y,p,u,i)),t.setPosition(p,u);else for(let s=0;s<1;s++){const s=new a([t.x,t.y],[p,u],[h,o],r,!!l,!!c);let e=s.getNextSegment();for(;e;){const h=I(e.cp1[0],e.cp1[1],e.cp2[0],e.cp2[1],e.to[0],e.to[1],t,i);n=n.concat(h),e=s.getNextSegment()}}}break}}return n}class U extends s{constructor(t,s){super(t,s)}line(t,s,e,i,n){const h=this._options(n);return this._drawable("line",[m(t,s,e,i,h)],h)}rectangle(t,s,e,i,n){const h=this._options(n),a=[];if(h.fill){const n=[[t,s],[t+e,s],[t+e,s+i],[t,s+i]];"solid"===h.fillStyle?a.push(A(n,h)):a.push(T(n,h))}return a.push(k(t,s,e,i,h)),this._drawable("rectangle",a,h)}ellipse(t,s,e,i,n){const h=this._options(n),a=[];if(h.fill)if("solid"===h.fillStyle){const n=v(t,s,e,i,h);n.type="fillPath",a.push(n)}else a.push(function(t,s,e,i,n){return b(n).fillEllipse(t,s,e,i,n)}(t,s,e,i,h));return a.push(v(t,s,e,i,h)),this._drawable("ellipse",a,h)}circle(t,s,e,i){const n=this.ellipse(t,s,e,e,i);return n.shape="circle",n}linearPath(t,s){const e=this._options(s);return this._drawable("linearPath",[w(t,!1,e)],e)}arc(t,s,e,i,n,h,a=!1,o){const r=this._options(o),l=[];if(a&&r.fill)if("solid"===r.fillStyle){const a=S(t,s,e,i,n,h,!0,!1,r);a.type="fillPath",l.push(a)}else l.push(function(t,s,e,i,n,h,a){const o=t,r=s;let l=Math.abs(e/2),c=Math.abs(i/2);l+=$(.01*l,a),c+=$(.01*c,a);let p=n,u=h;for(;p<0;)p+=2*Math.PI,u+=2*Math.PI;u-p>2*Math.PI&&(p=0,u=2*Math.PI);const f=(u-p)/a.curveStepCount,d=[];for(let t=p;t<=u;t+=f)d.push([o+l*Math.cos(t),r+c*Math.sin(t)]);return d.push([o+l*Math.cos(u),r+c*Math.sin(u)]),d.push([o,r]),T(d,a)}(t,s,e,i,n,h,r));return l.push(S(t,s,e,i,n,h,a,!0,r)),this._drawable("arc",l,r)}curve(t,s){const e=this._options(s);return this._drawable("curve",[P(t,e)],e)}polygon(t,s){const e=this._options(s),i=[];if(e.fill)if("solid"===e.fillStyle)i.push(A(t,e));else{const s=this.computePolygonSize(t),n=T([[0,0],[s[0],0],[s[0],s[1]],[0,s[1]]],e);n.type="path2Dpattern",n.size=s,n.path=this.polygonPath(t),i.push(n)}return i.push(w(t,!0,e)),this._drawable("polygon",i,e)}path(t,s){const e=this._options(s),i=[];if(!t)return this._drawable("path",i,e);if(e.fill)if("solid"===e.fillStyle){const s={type:"path2Dfill",path:t,ops:[]};i.push(s)}else{const s=this.computePathSize(t),n=T([[0,0],[s[0],0],[s[0],s[1]],[0,s[1]]],e);n.type="path2Dpattern",n.size=s,n.path=t,i.push(n)}return i.push(function(t,s){t=(t||"").replace(/\n/g," ").replace(/(-\s)/g,"-").replace("/(ss)/g"," ");let e=new h(t);if(s.simplification){const t=new o(e.linearPoints,e.closed).fit(s.simplification);e=new h(t)}let i=[];const n=e.segments||[];for(let t=0;t<n.length;t++){const h=B(e,n[t],t>0?n[t-1]:null,s);h&&h.length&&(i=i.concat(h))}return{type:"path",ops:i}}(t,e)),this._drawable("path",i,e)}}const V="undefined"!=typeof document;class X{constructor(t){this.canvas=t,this.ctx=this.canvas.getContext("2d")}draw(t){const s=t.sets||[],e=t.options||this.getDefaultOptions(),i=this.ctx;for(const t of s)switch(t.type){case"path":i.save(),i.strokeStyle=e.stroke,i.lineWidth=e.strokeWidth,this._drawToContext(i,t),i.restore();break;case"fillPath":i.save(),i.fillStyle=e.fill||"",this._drawToContext(i,t),i.restore();break;case"fillSketch":this.fillSketch(i,t,e);break;case"path2Dfill":{this.ctx.save(),this.ctx.fillStyle=e.fill||"";const s=new Path2D(t.path);this.ctx.fill(s),this.ctx.restore();break}case"path2Dpattern":{const s=this.canvas.ownerDocument||V&&document;if(s){const i=t.size,n=s.createElement("canvas"),h=n.getContext("2d"),a=this.computeBBox(t.path);a&&(a.width||a.height)?(n.width=this.canvas.width,n.height=this.canvas.height,h.translate(a.x||0,a.y||0)):(n.width=i[0],n.height=i[1]),this.fillSketch(h,t,e),this.ctx.save(),this.ctx.fillStyle=this.ctx.createPattern(n,"repeat");const o=new Path2D(t.path);this.ctx.fill(o),this.ctx.restore()}else console.error("Cannot render path2Dpattern. No defs/document defined.");break}}}computeBBox(t){if(V)try{const s="http://www.w3.org/2000/svg",e=document.createElementNS(s,"svg");e.setAttribute("width","0"),e.setAttribute("height","0");const i=self.document.createElementNS(s,"path");i.setAttribute("d",t),e.appendChild(i),document.body.appendChild(e);const n=i.getBBox();return document.body.removeChild(e),n}catch(t){}return null}fillSketch(t,s,e){let i=e.fillWeight;i<0&&(i=e.strokeWidth/2),t.save(),t.strokeStyle=e.fill||"",t.lineWidth=i,this._drawToContext(t,s),t.restore()}_drawToContext(t,s){t.beginPath();for(const e of s.ops){const s=e.data;switch(e.op){case"move":t.moveTo(s[0],s[1]);break;case"bcurveTo":t.bezierCurveTo(s[0],s[1],s[2],s[3],s[4],s[5]);break;case"qcurveTo":t.quadraticCurveTo(s[0],s[1],s[2],s[3]);break;case"lineTo":t.lineTo(s[0],s[1])}}"fillPath"===s.type?t.fill():t.stroke()}}class j extends X{constructor(t,s){super(t),this.gen=new U(s||null,this.canvas)}get generator(){return this.gen}getDefaultOptions(){return this.gen.defaultOptions}line(t,s,e,i,n){const h=this.gen.line(t,s,e,i,n);return this.draw(h),h}rectangle(t,s,e,i,n){const h=this.gen.rectangle(t,s,e,i,n);return this.draw(h),h}ellipse(t,s,e,i,n){const h=this.gen.ellipse(t,s,e,i,n);return this.draw(h),h}circle(t,s,e,i){const n=this.gen.circle(t,s,e,i);return this.draw(n),n}linearPath(t,s){const e=this.gen.linearPath(t,s);return this.draw(e),e}polygon(t,s){const e=this.gen.polygon(t,s);return this.draw(e),e}arc(t,s,e,i,n,h,a=!1,o){const r=this.gen.arc(t,s,e,i,n,h,a,o);return this.draw(r),r}curve(t,s){const e=this.gen.curve(t,s);return this.draw(e),e}path(t,s){const e=this.gen.path(t,s);return this.draw(e),e}}const G="undefined"!=typeof document;class Q{constructor(t){this.svg=t}get defs(){const t=this.svg.ownerDocument||G&&document;if(t&&!this._defs){const s=t.createElementNS("http://www.w3.org/2000/svg","defs");this.svg.firstChild?this.svg.insertBefore(s,this.svg.firstChild):this.svg.appendChild(s),this._defs=s}return this._defs||null}draw(t){const s=t.sets||[],e=t.options||this.getDefaultOptions(),i=this.svg.ownerDocument||window.document,n=i.createElementNS("http://www.w3.org/2000/svg","g");for(const t of s){let s=null;switch(t.type){case"path":(s=i.createElementNS("http://www.w3.org/2000/svg","path")).setAttribute("d",this.opsToPath(t)),s.style.stroke=e.stroke,s.style.strokeWidth=e.strokeWidth+"",s.style.fill="none";break;case"fillPath":(s=i.createElementNS("http://www.w3.org/2000/svg","path")).setAttribute("d",this.opsToPath(t)),s.style.stroke="none",s.style.strokeWidth="0",s.style.fill=e.fill||null;break;case"fillSketch":s=this.fillSketch(i,t,e);break;case"path2Dfill":(s=i.createElementNS("http://www.w3.org/2000/svg","path")).setAttribute("d",t.path||""),s.style.stroke="none",s.style.strokeWidth="0",s.style.fill=e.fill||null;break;case"path2Dpattern":if(this.defs){const n=t.size,h=i.createElementNS("http://www.w3.org/2000/svg","pattern"),a=`rough-${Math.floor(Math.random()*(Number.MAX_SAFE_INTEGER||999999))}`;h.setAttribute("id",a),h.setAttribute("x","0"),h.setAttribute("y","0"),h.setAttribute("width","1"),h.setAttribute("height","1"),h.setAttribute("height","1"),h.setAttribute("viewBox",`0 0 ${Math.round(n[0])} ${Math.round(n[1])}`),h.setAttribute("patternUnits","objectBoundingBox");const o=this.fillSketch(i,t,e);h.appendChild(o),this.defs.appendChild(h),(s=i.createElementNS("http://www.w3.org/2000/svg","path")).setAttribute("d",t.path||""),s.style.stroke="none",s.style.strokeWidth="0",s.style.fill=`url(#${a})`}else console.error("Cannot render path2Dpattern. No defs/document defined.")}s&&n.appendChild(s)}return n}fillSketch(t,s,e){let i=e.fillWeight;i<0&&(i=e.strokeWidth/2);const n=t.createElementNS("http://www.w3.org/2000/svg","path");return n.setAttribute("d",this.opsToPath(s)),n.style.stroke=e.fill||null,n.style.strokeWidth=i+"",n.style.fill="none",n}}class Z extends Q{constructor(t,s){super(t),this.gen=new U(s||null,this.svg)}get generator(){return this.gen}getDefaultOptions(){return this.gen.defaultOptions}opsToPath(t){return this.gen.opsToPath(t)}line(t,s,e,i,n){const h=this.gen.line(t,s,e,i,n);return this.draw(h)}rectangle(t,s,e,i,n){const h=this.gen.rectangle(t,s,e,i,n);return this.draw(h)}ellipse(t,s,e,i,n){const h=this.gen.ellipse(t,s,e,i,n);return this.draw(h)}circle(t,s,e,i){const n=this.gen.circle(t,s,e,i);return this.draw(n)}linearPath(t,s){const e=this.gen.linearPath(t,s);return this.draw(e)}polygon(t,s){const e=this.gen.polygon(t,s);return this.draw(e)}arc(t,s,e,i,n,h,a=!1,o){const r=this.gen.arc(t,s,e,i,n,h,a,o);return this.draw(r)}curve(t,s){const e=this.gen.curve(t,s);return this.draw(e)}path(t,s){const e=this.gen.path(t,s);return this.draw(e)}}return{canvas:(t,s)=>new j(t,s),svg:(t,s)=>new Z(t,s),generator:(t,s)=>new U(t,s)}});
