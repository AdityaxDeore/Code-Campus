const uc=()=>{};var is={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const so=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},dc=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const c=n[t++];e[r++]=String.fromCharCode((s&31)<<6|c&63)}else if(s>239&&s<365){const c=n[t++],h=n[t++],f=n[t++],m=((s&7)<<18|(c&63)<<12|(h&63)<<6|f&63)-65536;e[r++]=String.fromCharCode(55296+(m>>10)),e[r++]=String.fromCharCode(56320+(m&1023))}else{const c=n[t++],h=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(c&63)<<6|h&63)}}return e.join("")},oo={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const c=n[s],h=s+1<n.length,f=h?n[s+1]:0,m=s+2<n.length,v=m?n[s+2]:0,b=c>>2,S=(c&3)<<4|f>>4;let A=(f&15)<<2|v>>6,x=v&63;m||(x=64,h||(A=64)),r.push(t[b],t[S],t[A],t[x])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(so(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):dc(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const c=t[n.charAt(s++)],f=s<n.length?t[n.charAt(s)]:0;++s;const v=s<n.length?t[n.charAt(s)]:64;++s;const S=s<n.length?t[n.charAt(s)]:64;if(++s,c==null||f==null||v==null||S==null)throw new fc;const A=c<<2|f>>4;if(r.push(A),v!==64){const x=f<<4&240|v>>2;if(r.push(x),S!==64){const L=v<<6&192|S;r.push(L)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class fc extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const pc=function(n){const e=so(n);return oo.encodeByteArray(e,!0)},An=function(n){return pc(n).replace(/\./g,"")},ao=function(n){try{return oo.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gc(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mc=()=>gc().__FIREBASE_DEFAULTS__,yc=()=>{if(typeof process>"u"||typeof is>"u")return;const n=is.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},_c=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&ao(n[1]);return e&&JSON.parse(e)},Ui=()=>{try{return uc()||mc()||yc()||_c()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},co=n=>{var e,t;return(t=(e=Ui())==null?void 0:e.emulatorHosts)==null?void 0:t[n]},wc=n=>{const e=co(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},ho=()=>{var n;return(n=Ui())==null?void 0:n.config},lo=n=>{var e;return(e=Ui())==null?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ic{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jt(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function uo(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ec(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,c=n.sub||n.user_id;if(!c)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const h={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:c,user_id:c,firebase:{sign_in_provider:"custom",identities:{}},...n};return[An(JSON.stringify(t)),An(JSON.stringify(h)),""].join(".")}const Bt={};function vc(){const n={prod:[],emulator:[]};for(const e of Object.keys(Bt))Bt[e]?n.emulator.push(e):n.prod.push(e);return n}function Tc(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let rs=!1;function fo(n,e){if(typeof window>"u"||typeof document>"u"||!Jt(window.location.host)||Bt[n]===e||Bt[n]||rs)return;Bt[n]=e;function t(A){return`__firebase__banner__${A}`}const r="__firebase__banner",c=vc().prod.length>0;function h(){const A=document.getElementById(r);A&&A.remove()}function f(A){A.style.display="flex",A.style.background="#7faaf0",A.style.position="fixed",A.style.bottom="5px",A.style.left="5px",A.style.padding=".5em",A.style.borderRadius="5px",A.style.alignItems="center"}function m(A,x){A.setAttribute("width","24"),A.setAttribute("id",x),A.setAttribute("height","24"),A.setAttribute("viewBox","0 0 24 24"),A.setAttribute("fill","none"),A.style.marginLeft="-6px"}function v(){const A=document.createElement("span");return A.style.cursor="pointer",A.style.marginLeft="16px",A.style.fontSize="24px",A.innerHTML=" &times;",A.onclick=()=>{rs=!0,h()},A}function b(A,x){A.setAttribute("id",x),A.innerText="Learn more",A.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",A.setAttribute("target","__blank"),A.style.paddingLeft="5px",A.style.textDecoration="underline"}function S(){const A=Tc(r),x=t("text"),L=document.getElementById(x)||document.createElement("span"),V=t("learnmore"),U=document.getElementById(V)||document.createElement("a"),X=t("preprendIcon"),Y=document.getElementById(X)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(A.created){const ee=A.element;f(ee),b(U,V);const be=v();m(Y,X),ee.append(Y,L,U,be),document.body.appendChild(ee)}c?(L.innerText="Preview backend disconnected.",Y.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(Y.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,L.innerText="Preview backend running in this workspace."),L.setAttribute("id",x)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",S):S()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function K(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ac(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(K())}function Sc(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function po(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function bc(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Cc(){const n=K();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function go(){try{return typeof indexedDB=="object"}catch{return!1}}function mo(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var c;e(((c=s.error)==null?void 0:c.message)||"")}}catch(t){e(t)}})}function Pc(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rc="FirebaseError";class le extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Rc,Object.setPrototypeOf(this,le.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ot.prototype.create)}}class ot{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,c=this.errors[e],h=c?kc(c,r):"Error",f=`${this.serviceName}: ${h} (${s}).`;return new le(s,f,r)}}function kc(n,e){return n.replace(Oc,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const Oc=/\{\$([^}]+)}/g;function Nc(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Be(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const c=n[s],h=e[s];if(ss(c)&&ss(h)){if(!Be(c,h))return!1}else if(c!==h)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function ss(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xt(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Vt(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,c]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(c)}}),e}function jt(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Dc(n,e){const t=new Lc(n,e);return t.subscribe.bind(t)}class Lc{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Mc(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=fi),s.error===void 0&&(s.error=fi),s.complete===void 0&&(s.complete=fi);const c=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),c}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Mc(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function fi(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uc=1e3,xc=2,Fc=4*60*60*1e3,Vc=.5;function os(n,e=Uc,t=xc){const r=e*Math.pow(t,n),s=Math.round(Vc*r*(Math.random()-.5)*2);return Math.min(Fc,r+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Z(n){return n&&n._delegate?n._delegate:n}class ce{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Je="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jc{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new Ic;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if($c(e))try{this.getOrInitializeService({instanceIdentifier:Je})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const c=this.getOrInitializeService({instanceIdentifier:s});r.resolve(c)}catch{}}}}clearInstance(e=Je){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Je){return this.instances.has(e)}getOptions(e=Je){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[c,h]of this.instancesDeferred.entries()){const f=this.normalizeInstanceIdentifier(c);r===f&&h.resolve(s)}return s}onInit(e,t){const r=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);const c=this.instances.get(r);return c&&e(c,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Bc(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Je){return this.component?this.component.multipleInstances?e:Je:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Bc(n){return n===Je?void 0:n}function $c(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hc{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new jc(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var N;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(N||(N={}));const Wc={debug:N.DEBUG,verbose:N.VERBOSE,info:N.INFO,warn:N.WARN,error:N.ERROR,silent:N.SILENT},qc=N.INFO,zc={[N.DEBUG]:"log",[N.VERBOSE]:"log",[N.INFO]:"info",[N.WARN]:"warn",[N.ERROR]:"error"},Gc=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=zc[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Mn{constructor(e){this.name=e,this._logLevel=qc,this._logHandler=Gc,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in N))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Wc[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,N.DEBUG,...e),this._logHandler(this,N.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,N.VERBOSE,...e),this._logHandler(this,N.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,N.INFO,...e),this._logHandler(this,N.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,N.WARN,...e),this._logHandler(this,N.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,N.ERROR,...e),this._logHandler(this,N.ERROR,...e)}}const Kc=(n,e)=>e.some(t=>n instanceof t);let as,cs;function Jc(){return as||(as=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Xc(){return cs||(cs=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const yo=new WeakMap,Si=new WeakMap,_o=new WeakMap,pi=new WeakMap,xi=new WeakMap;function Yc(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",c),n.removeEventListener("error",h)},c=()=>{t(Ve(n.result)),s()},h=()=>{r(n.error),s()};n.addEventListener("success",c),n.addEventListener("error",h)});return e.then(t=>{t instanceof IDBCursor&&yo.set(t,n)}).catch(()=>{}),xi.set(e,n),e}function Qc(n){if(Si.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",c),n.removeEventListener("error",h),n.removeEventListener("abort",h)},c=()=>{t(),s()},h=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",c),n.addEventListener("error",h),n.addEventListener("abort",h)});Si.set(n,e)}let bi={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Si.get(n);if(e==="objectStoreNames")return n.objectStoreNames||_o.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Ve(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Zc(n){bi=n(bi)}function eh(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(gi(this),e,...t);return _o.set(r,e.sort?e.sort():[e]),Ve(r)}:Xc().includes(n)?function(...e){return n.apply(gi(this),e),Ve(yo.get(this))}:function(...e){return Ve(n.apply(gi(this),e))}}function th(n){return typeof n=="function"?eh(n):(n instanceof IDBTransaction&&Qc(n),Kc(n,Jc())?new Proxy(n,bi):n)}function Ve(n){if(n instanceof IDBRequest)return Yc(n);if(pi.has(n))return pi.get(n);const e=th(n);return e!==n&&(pi.set(n,e),xi.set(e,n)),e}const gi=n=>xi.get(n);function wo(n,e,{blocked:t,upgrade:r,blocking:s,terminated:c}={}){const h=indexedDB.open(n,e),f=Ve(h);return r&&h.addEventListener("upgradeneeded",m=>{r(Ve(h.result),m.oldVersion,m.newVersion,Ve(h.transaction),m)}),t&&h.addEventListener("blocked",m=>t(m.oldVersion,m.newVersion,m)),f.then(m=>{c&&m.addEventListener("close",()=>c()),s&&m.addEventListener("versionchange",v=>s(v.oldVersion,v.newVersion,v))}).catch(()=>{}),f}const nh=["get","getKey","getAll","getAllKeys","count"],ih=["put","add","delete","clear"],mi=new Map;function hs(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(mi.get(e))return mi.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=ih.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||nh.includes(t)))return;const c=async function(h,...f){const m=this.transaction(h,s?"readwrite":"readonly");let v=m.store;return r&&(v=v.index(f.shift())),(await Promise.all([v[t](...f),s&&m.done]))[0]};return mi.set(e,c),c}Zc(n=>({...n,get:(e,t,r)=>hs(e,t)||n.get(e,t,r),has:(e,t)=>!!hs(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rh{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(sh(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function sh(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Ci="@firebase/app",ls="0.14.6";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Te=new Mn("@firebase/app"),oh="@firebase/app-compat",ah="@firebase/analytics-compat",ch="@firebase/analytics",hh="@firebase/app-check-compat",lh="@firebase/app-check",uh="@firebase/auth",dh="@firebase/auth-compat",fh="@firebase/database",ph="@firebase/data-connect",gh="@firebase/database-compat",mh="@firebase/functions",yh="@firebase/functions-compat",_h="@firebase/installations",wh="@firebase/installations-compat",Ih="@firebase/messaging",Eh="@firebase/messaging-compat",vh="@firebase/performance",Th="@firebase/performance-compat",Ah="@firebase/remote-config",Sh="@firebase/remote-config-compat",bh="@firebase/storage",Ch="@firebase/storage-compat",Ph="@firebase/firestore",Rh="@firebase/ai",kh="@firebase/firestore-compat",Oh="firebase",Nh="12.6.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pi="[DEFAULT]",Dh={[Ci]:"fire-core",[oh]:"fire-core-compat",[ch]:"fire-analytics",[ah]:"fire-analytics-compat",[lh]:"fire-app-check",[hh]:"fire-app-check-compat",[uh]:"fire-auth",[dh]:"fire-auth-compat",[fh]:"fire-rtdb",[ph]:"fire-data-connect",[gh]:"fire-rtdb-compat",[mh]:"fire-fn",[yh]:"fire-fn-compat",[_h]:"fire-iid",[wh]:"fire-iid-compat",[Ih]:"fire-fcm",[Eh]:"fire-fcm-compat",[vh]:"fire-perf",[Th]:"fire-perf-compat",[Ah]:"fire-rc",[Sh]:"fire-rc-compat",[bh]:"fire-gcs",[Ch]:"fire-gcs-compat",[Ph]:"fire-fst",[kh]:"fire-fst-compat",[Rh]:"fire-vertex","fire-js":"fire-js",[Oh]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sn=new Map,Lh=new Map,Ri=new Map;function us(n,e){try{n.container.addComponent(e)}catch(t){Te.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function _e(n){const e=n.name;if(Ri.has(e))return Te.debug(`There were multiple attempts to register component ${e}.`),!1;Ri.set(e,n);for(const t of Sn.values())us(t,n);for(const t of Lh.values())us(t,n);return!0}function at(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function ie(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mh={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},je=new ot("app","Firebase",Mh);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uh{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new ce("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw je.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Et=Nh;function xh(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r={name:Pi,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw je.create("bad-app-name",{appName:String(s)});if(t||(t=ho()),!t)throw je.create("no-options");const c=Sn.get(s);if(c){if(Be(t,c.options)&&Be(r,c.config))return c;throw je.create("duplicate-app",{appName:s})}const h=new Hc(s);for(const m of Ri.values())h.addComponent(m);const f=new Uh(t,r,h);return Sn.set(s,f),f}function Fi(n=Pi){const e=Sn.get(n);if(!e&&n===Pi&&ho())return xh();if(!e)throw je.create("no-app",{appName:n});return e}function re(n,e,t){let r=Dh[n]??n;t&&(r+=`-${t}`);const s=r.match(/\s|\//),c=e.match(/\s|\//);if(s||c){const h=[`Unable to register library "${r}" with version "${e}":`];s&&h.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&c&&h.push("and"),c&&h.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Te.warn(h.join(" "));return}_e(new ce(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fh="firebase-heartbeat-database",Vh=1,zt="firebase-heartbeat-store";let yi=null;function Io(){return yi||(yi=wo(Fh,Vh,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(zt)}catch(t){console.warn(t)}}}}).catch(n=>{throw je.create("idb-open",{originalErrorMessage:n.message})})),yi}async function jh(n){try{const t=(await Io()).transaction(zt),r=await t.objectStore(zt).get(Eo(n));return await t.done,r}catch(e){if(e instanceof le)Te.warn(e.message);else{const t=je.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Te.warn(t.message)}}}async function ds(n,e){try{const r=(await Io()).transaction(zt,"readwrite");await r.objectStore(zt).put(e,Eo(n)),await r.done}catch(t){if(t instanceof le)Te.warn(t.message);else{const r=je.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Te.warn(r.message)}}}function Eo(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bh=1024,$h=30;class Hh{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new qh(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),c=fs();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===c||this._heartbeatsCache.heartbeats.some(h=>h.date===c))return;if(this._heartbeatsCache.heartbeats.push({date:c,agent:s}),this._heartbeatsCache.heartbeats.length>$h){const h=zh(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(h,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Te.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=fs(),{heartbeatsToSend:r,unsentEntries:s}=Wh(this._heartbeatsCache.heartbeats),c=An(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),c}catch(t){return Te.warn(t),""}}}function fs(){return new Date().toISOString().substring(0,10)}function Wh(n,e=Bh){const t=[];let r=n.slice();for(const s of n){const c=t.find(h=>h.agent===s.agent);if(c){if(c.dates.push(s.date),ps(t)>e){c.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),ps(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class qh{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return go()?mo().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await jh(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return ds(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return ds(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function ps(n){return An(JSON.stringify({version:2,heartbeats:n})).length}function zh(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gh(n){_e(new ce("platform-logger",e=>new rh(e),"PRIVATE")),_e(new ce("heartbeat",e=>new Hh(e),"PRIVATE")),re(Ci,ls,n),re(Ci,ls,"esm2020"),re("fire-js","")}Gh("");function vo(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Kh=vo,To=new ot("auth","Firebase",vo());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bn=new Mn("@firebase/auth");function Jh(n,...e){bn.logLevel<=N.WARN&&bn.warn(`Auth (${Et}): ${n}`,...e)}function wn(n,...e){bn.logLevel<=N.ERROR&&bn.error(`Auth (${Et}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function he(n,...e){throw Vi(n,...e)}function me(n,...e){return Vi(n,...e)}function Ao(n,e,t){const r={...Kh(),[e]:t};return new ot("auth","Firebase",r).create(e,{appName:n.name})}function ve(n){return Ao(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Vi(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return To.create(n,...e)}function C(n,e,...t){if(!n)throw Vi(e,...t)}function Ie(n){const e="INTERNAL ASSERTION FAILED: "+n;throw wn(e),new Error(e)}function Ae(n,e){n||Ie(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ki(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.href)||""}function Xh(){return gs()==="http:"||gs()==="https:"}function gs(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yh(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Xh()||po()||"connection"in navigator)?navigator.onLine:!0}function Qh(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt{constructor(e,t){this.shortDelay=e,this.longDelay=t,Ae(t>e,"Short delay should be less than long delay!"),this.isMobile=Ac()||bc()}get(){return Yh()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ji(n,e){Ae(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class So{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ie("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ie("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ie("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zh={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const el=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],tl=new Yt(3e4,6e4);function He(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function Se(n,e,t,r,s={}){return bo(n,s,async()=>{let c={},h={};r&&(e==="GET"?h=r:c={body:JSON.stringify(r)});const f=Xt({key:n.config.apiKey,...h}).slice(1),m=await n._getAdditionalHeaders();m["Content-Type"]="application/json",n.languageCode&&(m["X-Firebase-Locale"]=n.languageCode);const v={method:e,headers:m,...c};return Sc()||(v.referrerPolicy="no-referrer"),n.emulatorConfig&&Jt(n.emulatorConfig.host)&&(v.credentials="include"),So.fetch()(await Co(n,n.config.apiHost,t,f),v)})}async function bo(n,e,t){n._canInitEmulator=!1;const r={...Zh,...e};try{const s=new il(n),c=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const h=await c.json();if("needConfirmation"in h)throw mn(n,"account-exists-with-different-credential",h);if(c.ok&&!("errorMessage"in h))return h;{const f=c.ok?h.errorMessage:h.error.message,[m,v]=f.split(" : ");if(m==="FEDERATED_USER_ID_ALREADY_LINKED")throw mn(n,"credential-already-in-use",h);if(m==="EMAIL_EXISTS")throw mn(n,"email-already-in-use",h);if(m==="USER_DISABLED")throw mn(n,"user-disabled",h);const b=r[m]||m.toLowerCase().replace(/[_\s]+/g,"-");if(v)throw Ao(n,b,v);he(n,b)}}catch(s){if(s instanceof le)throw s;he(n,"network-request-failed",{message:String(s)})}}async function Qt(n,e,t,r,s={}){const c=await Se(n,e,t,r,s);return"mfaPendingCredential"in c&&he(n,"multi-factor-auth-required",{_serverResponse:c}),c}async function Co(n,e,t,r){const s=`${e}${t}?${r}`,c=n,h=c.config.emulator?ji(n.config,s):`${n.config.apiScheme}://${s}`;return el.includes(t)&&(await c._persistenceManagerAvailable,c._getPersistenceType()==="COOKIE")?c._getPersistence()._getFinalTarget(h).toString():h}function nl(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class il{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(me(this.auth,"network-request-failed")),tl.get())})}}function mn(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=me(n,e,r);return s.customData._tokenResponse=t,s}function ms(n){return n!==void 0&&n.enterprise!==void 0}class rl{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return nl(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function sl(n,e){return Se(n,"GET","/v2/recaptchaConfig",He(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ol(n,e){return Se(n,"POST","/v1/accounts:delete",e)}async function Cn(n,e){return Se(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $t(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function al(n,e=!1){const t=Z(n),r=await t.getIdToken(e),s=Bi(r);C(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const c=typeof s.firebase=="object"?s.firebase:void 0,h=c==null?void 0:c.sign_in_provider;return{claims:s,token:r,authTime:$t(_i(s.auth_time)),issuedAtTime:$t(_i(s.iat)),expirationTime:$t(_i(s.exp)),signInProvider:h||null,signInSecondFactor:(c==null?void 0:c.sign_in_second_factor)||null}}function _i(n){return Number(n)*1e3}function Bi(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return wn("JWT malformed, contained fewer than 3 sections"),null;try{const s=ao(t);return s?JSON.parse(s):(wn("Failed to decode base64 JWT payload"),null)}catch(s){return wn("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function ys(n){const e=Bi(n);return C(e,"internal-error"),C(typeof e.exp<"u","internal-error"),C(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wt(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof le&&cl(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function cl({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hl{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oi{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=$t(this.lastLoginAt),this.creationTime=$t(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pn(n){var S;const e=n.auth,t=await n.getIdToken(),r=await wt(n,Cn(e,{idToken:t}));C(r==null?void 0:r.users.length,e,"internal-error");const s=r.users[0];n._notifyReloadListener(s);const c=(S=s.providerUserInfo)!=null&&S.length?Po(s.providerUserInfo):[],h=ul(n.providerData,c),f=n.isAnonymous,m=!(n.email&&s.passwordHash)&&!(h!=null&&h.length),v=f?m:!1,b={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:h,metadata:new Oi(s.createdAt,s.lastLoginAt),isAnonymous:v};Object.assign(n,b)}async function ll(n){const e=Z(n);await Pn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function ul(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function Po(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dl(n,e){const t=await bo(n,{},async()=>{const r=Xt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:c}=n.config,h=await Co(n,s,"/v1/token",`key=${c}`),f=await n._getAdditionalHeaders();f["Content-Type"]="application/x-www-form-urlencoded";const m={method:"POST",headers:f,body:r};return n.emulatorConfig&&Jt(n.emulatorConfig.host)&&(m.credentials="include"),So.fetch()(h,m)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function fl(n,e){return Se(n,"POST","/v2/accounts:revokeToken",He(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){C(e.idToken,"internal-error"),C(typeof e.idToken<"u","internal-error"),C(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):ys(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){C(e.length!==0,"internal-error");const t=ys(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(C(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:c}=await dl(e,t);this.updateTokensAndExpiration(r,s,Number(c))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:c}=t,h=new pt;return r&&(C(typeof r=="string","internal-error",{appName:e}),h.refreshToken=r),s&&(C(typeof s=="string","internal-error",{appName:e}),h.accessToken=s),c&&(C(typeof c=="number","internal-error",{appName:e}),h.expirationTime=c),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new pt,this.toJSON())}_performRefresh(){return Ie("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Le(n,e){C(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class oe{constructor({uid:e,auth:t,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new hl(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Oi(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await wt(this,this.stsTokenManager.getToken(this.auth,e));return C(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return al(this,e)}reload(){return ll(this)}_assign(e){this!==e&&(C(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new oe({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){C(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Pn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ie(this.auth.app))return Promise.reject(ve(this.auth));const e=await this.getIdToken();return await wt(this,ol(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const r=t.displayName??void 0,s=t.email??void 0,c=t.phoneNumber??void 0,h=t.photoURL??void 0,f=t.tenantId??void 0,m=t._redirectEventId??void 0,v=t.createdAt??void 0,b=t.lastLoginAt??void 0,{uid:S,emailVerified:A,isAnonymous:x,providerData:L,stsTokenManager:V}=t;C(S&&V,e,"internal-error");const U=pt.fromJSON(this.name,V);C(typeof S=="string",e,"internal-error"),Le(r,e.name),Le(s,e.name),C(typeof A=="boolean",e,"internal-error"),C(typeof x=="boolean",e,"internal-error"),Le(c,e.name),Le(h,e.name),Le(f,e.name),Le(m,e.name),Le(v,e.name),Le(b,e.name);const X=new oe({uid:S,auth:e,email:s,emailVerified:A,displayName:r,isAnonymous:x,photoURL:h,phoneNumber:c,tenantId:f,stsTokenManager:U,createdAt:v,lastLoginAt:b});return L&&Array.isArray(L)&&(X.providerData=L.map(Y=>({...Y}))),m&&(X._redirectEventId=m),X}static async _fromIdTokenResponse(e,t,r=!1){const s=new pt;s.updateFromServerResponse(t);const c=new oe({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Pn(c),c}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];C(s.localId!==void 0,"internal-error");const c=s.providerUserInfo!==void 0?Po(s.providerUserInfo):[],h=!(s.email&&s.passwordHash)&&!(c!=null&&c.length),f=new pt;f.updateFromIdToken(r);const m=new oe({uid:s.localId,auth:e,stsTokenManager:f,isAnonymous:h}),v={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:c,metadata:new Oi(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(c!=null&&c.length)};return Object.assign(m,v),m}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _s=new Map;function Ee(n){Ae(n instanceof Function,"Expected a class definition");let e=_s.get(n);return e?(Ae(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,_s.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ro{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Ro.type="NONE";const ws=Ro;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function In(n,e,t){return`firebase:${n}:${e}:${t}`}class gt{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:c}=this.auth;this.fullUserKey=In(this.userKey,s.apiKey,c),this.fullPersistenceKey=In("persistence",s.apiKey,c),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Cn(this.auth,{idToken:e}).catch(()=>{});return t?oe._fromGetAccountInfoResponse(this.auth,t,e):null}return oe._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new gt(Ee(ws),e,r);const s=(await Promise.all(t.map(async v=>{if(await v._isAvailable())return v}))).filter(v=>v);let c=s[0]||Ee(ws);const h=In(r,e.config.apiKey,e.name);let f=null;for(const v of t)try{const b=await v._get(h);if(b){let S;if(typeof b=="string"){const A=await Cn(e,{idToken:b}).catch(()=>{});if(!A)break;S=await oe._fromGetAccountInfoResponse(e,A,b)}else S=oe._fromJSON(e,b);v!==c&&(f=S),c=v;break}}catch{}const m=s.filter(v=>v._shouldAllowMigration);return!c._shouldAllowMigration||!m.length?new gt(c,e,r):(c=m[0],f&&await c._set(h,f.toJSON()),await Promise.all(t.map(async v=>{if(v!==c)try{await v._remove(h)}catch{}})),new gt(c,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Is(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Do(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(ko(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Mo(e))return"Blackberry";if(Uo(e))return"Webos";if(Oo(e))return"Safari";if((e.includes("chrome/")||No(e))&&!e.includes("edge/"))return"Chrome";if(Lo(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function ko(n=K()){return/firefox\//i.test(n)}function Oo(n=K()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function No(n=K()){return/crios\//i.test(n)}function Do(n=K()){return/iemobile/i.test(n)}function Lo(n=K()){return/android/i.test(n)}function Mo(n=K()){return/blackberry/i.test(n)}function Uo(n=K()){return/webos/i.test(n)}function $i(n=K()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function pl(n=K()){var e;return $i(n)&&!!((e=window.navigator)!=null&&e.standalone)}function gl(){return Cc()&&document.documentMode===10}function xo(n=K()){return $i(n)||Lo(n)||Uo(n)||Mo(n)||/windows phone/i.test(n)||Do(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fo(n,e=[]){let t;switch(n){case"Browser":t=Is(K());break;case"Worker":t=`${Is(K())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Et}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ml{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=c=>new Promise((h,f)=>{try{const m=e(c);h(m)}catch(m){f(m)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yl(n,e={}){return Se(n,"GET","/v2/passwordPolicy",He(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _l=6;class wl{constructor(e){var r;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??_l,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,c){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Il{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Es(this),this.idTokenSubscription=new Es(this),this.beforeStateQueue=new ml(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=To,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(c=>this._resolvePersistenceManagerAvailable=c)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Ee(t)),this._initializationPromise=this.queue(async()=>{var r,s,c;if(!this._deleted&&(this.persistenceManager=await gt.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((c=this.currentUser)==null?void 0:c.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Cn(this,{idToken:e}),r=await oe._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var c;if(ie(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(f=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(f,f))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let r=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(c=this.redirectUser)==null?void 0:c._redirectEventId,f=r==null?void 0:r._redirectEventId,m=await this.tryRedirectSignIn(e);(!h||h===f)&&(m!=null&&m.user)&&(r=m.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(h){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return C(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Pn(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Qh()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ie(this.app))return Promise.reject(ve(this));const t=e?Z(e):null;return t&&C(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&C(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ie(this.app)?Promise.reject(ve(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ie(this.app)?Promise.reject(ve(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ee(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await yl(this),t=new wl(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new ot("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await fl(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Ee(e)||this._popupRedirectResolver;C(t,this,"argument-error"),this.redirectPersistenceManager=await gt.create(this,[Ee(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const c=typeof t=="function"?t:t.next.bind(t);let h=!1;const f=this._isInitialized?Promise.resolve():this._initializationPromise;if(C(f,this,"internal-error"),f.then(()=>{h||c(this.currentUser)}),typeof t=="function"){const m=e.addObserver(t,r,s);return()=>{h=!0,m()}}else{const m=e.addObserver(t);return()=>{h=!0,m()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return C(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Fo(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var t;if(ie(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&Jh(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function ct(n){return Z(n)}class Es{constructor(e){this.auth=e,this.observer=null,this.addObserver=Dc(t=>this.observer=t)}get next(){return C(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Un={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function El(n){Un=n}function Vo(n){return Un.loadJS(n)}function vl(){return Un.recaptchaEnterpriseScript}function Tl(){return Un.gapiScript}function Al(n){return`__${n}${Math.floor(Math.random()*1e6)}`}class Sl{constructor(){this.enterprise=new bl}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class bl{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const Cl="recaptcha-enterprise",jo="NO_RECAPTCHA";class Pl{constructor(e){this.type=Cl,this.auth=ct(e)}async verify(e="verify",t=!1){async function r(c){if(!t){if(c.tenantId==null&&c._agentRecaptchaConfig!=null)return c._agentRecaptchaConfig.siteKey;if(c.tenantId!=null&&c._tenantRecaptchaConfigs[c.tenantId]!==void 0)return c._tenantRecaptchaConfigs[c.tenantId].siteKey}return new Promise(async(h,f)=>{sl(c,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(m=>{if(m.recaptchaKey===void 0)f(new Error("recaptcha Enterprise site key undefined"));else{const v=new rl(m);return c.tenantId==null?c._agentRecaptchaConfig=v:c._tenantRecaptchaConfigs[c.tenantId]=v,h(v.siteKey)}}).catch(m=>{f(m)})})}function s(c,h,f){const m=window.grecaptcha;ms(m)?m.enterprise.ready(()=>{m.enterprise.execute(c,{action:e}).then(v=>{h(v)}).catch(()=>{h(jo)})}):f(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Sl().execute("siteKey",{action:"verify"}):new Promise((c,h)=>{r(this.auth).then(f=>{if(!t&&ms(window.grecaptcha))s(f,c,h);else{if(typeof window>"u"){h(new Error("RecaptchaVerifier is only supported in browser"));return}let m=vl();m.length!==0&&(m+=f),Vo(m).then(()=>{s(f,c,h)}).catch(v=>{h(v)})}}).catch(f=>{h(f)})})}}async function vs(n,e,t,r=!1,s=!1){const c=new Pl(n);let h;if(s)h=jo;else try{h=await c.verify(t)}catch{h=await c.verify(t,!0)}const f={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in f){const m=f.phoneEnrollmentInfo.phoneNumber,v=f.phoneEnrollmentInfo.recaptchaToken;Object.assign(f,{phoneEnrollmentInfo:{phoneNumber:m,recaptchaToken:v,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in f){const m=f.phoneSignInInfo.recaptchaToken;Object.assign(f,{phoneSignInInfo:{recaptchaToken:m,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return f}return r?Object.assign(f,{captchaResp:h}):Object.assign(f,{captchaResponse:h}),Object.assign(f,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(f,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),f}async function Ni(n,e,t,r,s){var c;if((c=n._getRecaptchaConfig())!=null&&c.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const h=await vs(n,e,t,t==="getOobCode");return r(n,h)}else return r(n,e).catch(async h=>{if(h.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const f=await vs(n,e,t,t==="getOobCode");return r(n,f)}else return Promise.reject(h)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rl(n,e){const t=at(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),c=t.getOptions();if(Be(c,e??{}))return s;he(s,"already-initialized")}return t.initialize({options:e})}function kl(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(Ee);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Ol(n,e,t){const r=ct(n);C(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,c=Bo(e),{host:h,port:f}=Nl(e),m=f===null?"":`:${f}`,v={url:`${c}//${h}${m}/`},b=Object.freeze({host:h,port:f,protocol:c.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){C(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),C(Be(v,r.config.emulator)&&Be(b,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=v,r.emulatorConfig=b,r.settings.appVerificationDisabledForTesting=!0,Jt(h)?(uo(`${c}//${h}${m}`),fo("Auth",!0)):Dl()}function Bo(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Nl(n){const e=Bo(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const c=s[1];return{host:c,port:Ts(r.substr(c.length+1))}}else{const[c,h]=r.split(":");return{host:c,port:Ts(h)}}}function Ts(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Dl(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hi{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Ie("not implemented")}_getIdTokenResponse(e){return Ie("not implemented")}_linkToIdToken(e,t){return Ie("not implemented")}_getReauthenticationResolver(e){return Ie("not implemented")}}async function Ll(n,e){return Se(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ml(n,e){return Qt(n,"POST","/v1/accounts:signInWithPassword",He(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ul(n,e){return Qt(n,"POST","/v1/accounts:signInWithEmailLink",He(n,e))}async function xl(n,e){return Qt(n,"POST","/v1/accounts:signInWithEmailLink",He(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gt extends Hi{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new Gt(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new Gt(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Ni(e,t,"signInWithPassword",Ml);case"emailLink":return Ul(e,{email:this._email,oobCode:this._password});default:he(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Ni(e,r,"signUpPassword",Ll);case"emailLink":return xl(e,{idToken:t,email:this._email,oobCode:this._password});default:he(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mt(n,e){return Qt(n,"POST","/v1/accounts:signInWithIdp",He(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fl="http://localhost";class tt extends Hi{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new tt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):he("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...c}=t;if(!r||!s)return null;const h=new tt(r,s);return h.idToken=c.idToken||void 0,h.accessToken=c.accessToken||void 0,h.secret=c.secret,h.nonce=c.nonce,h.pendingToken=c.pendingToken||null,h}_getIdTokenResponse(e){const t=this.buildRequest();return mt(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,mt(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,mt(e,t)}buildRequest(){const e={requestUri:Fl,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Xt(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vl(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function jl(n){const e=Vt(jt(n)).link,t=e?Vt(jt(e)).deep_link_id:null,r=Vt(jt(n)).deep_link_id;return(r?Vt(jt(r)).link:null)||r||t||e||n}class Wi{constructor(e){const t=Vt(jt(e)),r=t.apiKey??null,s=t.oobCode??null,c=Vl(t.mode??null);C(r&&s&&c,"argument-error"),this.apiKey=r,this.operation=c,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=jl(e);try{return new Wi(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(){this.providerId=vt.PROVIDER_ID}static credential(e,t){return Gt._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=Wi.parseLink(t);return C(r,"argument-error"),Gt._fromEmailAndCode(e,r.code,r.tenantId)}}vt.PROVIDER_ID="password";vt.EMAIL_PASSWORD_SIGN_IN_METHOD="password";vt.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $o{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zt extends $o{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me extends Zt{constructor(){super("facebook.com")}static credential(e){return tt._fromParams({providerId:Me.PROVIDER_ID,signInMethod:Me.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Me.credentialFromTaggedObject(e)}static credentialFromError(e){return Me.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Me.credential(e.oauthAccessToken)}catch{return null}}}Me.FACEBOOK_SIGN_IN_METHOD="facebook.com";Me.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue extends Zt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return tt._fromParams({providerId:Ue.PROVIDER_ID,signInMethod:Ue.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Ue.credentialFromTaggedObject(e)}static credentialFromError(e){return Ue.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Ue.credential(t,r)}catch{return null}}}Ue.GOOGLE_SIGN_IN_METHOD="google.com";Ue.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe extends Zt{constructor(){super("github.com")}static credential(e){return tt._fromParams({providerId:xe.PROVIDER_ID,signInMethod:xe.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return xe.credentialFromTaggedObject(e)}static credentialFromError(e){return xe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return xe.credential(e.oauthAccessToken)}catch{return null}}}xe.GITHUB_SIGN_IN_METHOD="github.com";xe.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fe extends Zt{constructor(){super("twitter.com")}static credential(e,t){return tt._fromParams({providerId:Fe.PROVIDER_ID,signInMethod:Fe.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Fe.credentialFromTaggedObject(e)}static credentialFromError(e){return Fe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return Fe.credential(t,r)}catch{return null}}}Fe.TWITTER_SIGN_IN_METHOD="twitter.com";Fe.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bl(n,e){return Qt(n,"POST","/v1/accounts:signUp",He(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const c=await oe._fromIdTokenResponse(e,r,s),h=As(r);return new nt({user:c,providerId:h,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=As(r);return new nt({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function As(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rn extends le{constructor(e,t,r,s){super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Rn.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new Rn(e,t,r,s)}}function Ho(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(c=>{throw c.code==="auth/multi-factor-auth-required"?Rn._fromErrorAndOperation(n,c,e,r):c})}async function $l(n,e,t=!1){const r=await wt(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return nt._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hl(n,e,t=!1){const{auth:r}=n;if(ie(r.app))return Promise.reject(ve(r));const s="reauthenticate";try{const c=await wt(n,Ho(r,s,e,n),t);C(c.idToken,r,"internal-error");const h=Bi(c.idToken);C(h,r,"internal-error");const{sub:f}=h;return C(n.uid===f,r,"user-mismatch"),nt._forOperation(n,s,c)}catch(c){throw(c==null?void 0:c.code)==="auth/user-not-found"&&he(r,"user-mismatch"),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wo(n,e,t=!1){if(ie(n.app))return Promise.reject(ve(n));const r="signIn",s=await Ho(n,r,e),c=await nt._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(c.user),c}async function Wl(n,e){return Wo(ct(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qo(n){const e=ct(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function sp(n,e,t){if(ie(n.app))return Promise.reject(ve(n));const r=ct(n),h=await Ni(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Bl).catch(m=>{throw m.code==="auth/password-does-not-meet-requirements"&&qo(n),m}),f=await nt._fromIdTokenResponse(r,"signIn",h);return await r._updateCurrentUser(f.user),f}function op(n,e,t){return ie(n.app)?Promise.reject(ve(n)):Wl(Z(n),vt.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&qo(n),r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ql(n,e){return Se(n,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ap(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const r=Z(n),c={idToken:await r.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},h=await wt(r,ql(r.auth,c));r.displayName=h.displayName||null,r.photoURL=h.photoUrl||null;const f=r.providerData.find(({providerId:m})=>m==="password");f&&(f.displayName=r.displayName,f.photoURL=r.photoURL),await r._updateTokensIfNecessary(h)}function zl(n,e,t,r){return Z(n).onIdTokenChanged(e,t,r)}function Gl(n,e,t){return Z(n).beforeAuthStateChanged(e,t)}function cp(n,e,t,r){return Z(n).onAuthStateChanged(e,t,r)}function hp(n){return Z(n).signOut()}const kn="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zo{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(kn,"1"),this.storage.removeItem(kn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kl=1e3,Jl=10;class Go extends zo{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=xo(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((h,f,m)=>{this.notifyListeners(h,m)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const h=this.storage.getItem(r);!t&&this.localCache[r]===h||this.notifyListeners(r,h)},c=this.storage.getItem(r);gl()&&c!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,Jl):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},Kl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Go.type="LOCAL";const Xl=Go;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ko extends zo{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Ko.type="SESSION";const Jo=Ko;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yl(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new xn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:c}=t.data,h=this.handlersMap[s];if(!(h!=null&&h.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const f=Array.from(h).map(async v=>v(t.origin,c)),m=await Yl(f);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:m})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}xn.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qi(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ql{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let c,h;return new Promise((f,m)=>{const v=qi("",20);s.port1.start();const b=setTimeout(()=>{m(new Error("unsupported_event"))},r);h={messageChannel:s,onMessage(S){const A=S;if(A.data.eventId===v)switch(A.data.status){case"ack":clearTimeout(b),c=setTimeout(()=>{m(new Error("timeout"))},3e3);break;case"done":clearTimeout(c),f(A.data.response);break;default:clearTimeout(b),clearTimeout(c),m(new Error("invalid_response"));break}}},this.handlers.add(h),s.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:v,data:t},[s.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ye(){return window}function Zl(n){ye().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xo(){return typeof ye().WorkerGlobalScope<"u"&&typeof ye().importScripts=="function"}async function eu(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function tu(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)==null?void 0:n.controller)||null}function nu(){return Xo()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yo="firebaseLocalStorageDb",iu=1,On="firebaseLocalStorage",Qo="fbase_key";class en{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Fn(n,e){return n.transaction([On],e?"readwrite":"readonly").objectStore(On)}function ru(){const n=indexedDB.deleteDatabase(Yo);return new en(n).toPromise()}function Di(){const n=indexedDB.open(Yo,iu);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(On,{keyPath:Qo})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(On)?e(r):(r.close(),await ru(),e(await Di()))})})}async function Ss(n,e,t){const r=Fn(n,!0).put({[Qo]:e,value:t});return new en(r).toPromise()}async function su(n,e){const t=Fn(n,!1).get(e),r=await new en(t).toPromise();return r===void 0?null:r.value}function bs(n,e){const t=Fn(n,!0).delete(e);return new en(t).toPromise()}const ou=800,au=3;class Zo{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Di(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>au)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Xo()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=xn._getInstance(nu()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,r;if(this.activeServiceWorker=await eu(),!this.activeServiceWorker)return;this.sender=new Ql(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||tu()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Di();return await Ss(e,kn,"1"),await bs(e,kn),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>Ss(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>su(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>bs(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const c=Fn(s,!1).getAll();return new en(c).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:c}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(c)&&(this.notifyListeners(s,c),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),ou)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Zo.type="LOCAL";const cu=Zo;new Yt(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hu(n,e){return e?Ee(e):(C(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zi extends Hi{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return mt(e,this._buildIdpRequest())}_linkToIdToken(e,t){return mt(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return mt(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function lu(n){return Wo(n.auth,new zi(n),n.bypassAuthState)}function uu(n){const{auth:e,user:t}=n;return C(t,e,"internal-error"),Hl(t,new zi(n),n.bypassAuthState)}async function du(n){const{auth:e,user:t}=n;return C(t,e,"internal-error"),$l(t,new zi(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ea{constructor(e,t,r,s,c=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=c,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:c,error:h,type:f}=e;if(h){this.reject(h);return}const m={auth:this.auth,requestUri:t,sessionId:r,tenantId:c||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(f)(m))}catch(v){this.reject(v)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return lu;case"linkViaPopup":case"linkViaRedirect":return du;case"reauthViaPopup":case"reauthViaRedirect":return uu;default:he(this.auth,"internal-error")}}resolve(e){Ae(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Ae(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fu=new Yt(2e3,1e4);class ft extends ea{constructor(e,t,r,s,c){super(e,t,s,c),this.provider=r,this.authWindow=null,this.pollId=null,ft.currentPopupAction&&ft.currentPopupAction.cancel(),ft.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return C(e,this.auth,"internal-error"),e}async onExecution(){Ae(this.filter.length===1,"Popup operations only handle one event");const e=qi();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(me(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(me(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ft.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if((r=(t=this.authWindow)==null?void 0:t.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(me(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,fu.get())};e()}}ft.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pu="pendingRedirect",En=new Map;class gu extends ea{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=En.get(this.auth._key());if(!e){try{const r=await mu(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}En.set(this.auth._key(),e)}return this.bypassAuthState||En.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function mu(n,e){const t=wu(e),r=_u(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}function yu(n,e){En.set(n._key(),e)}function _u(n){return Ee(n._redirectPersistence)}function wu(n){return In(pu,n.config.apiKey,n.name)}async function Iu(n,e,t=!1){if(ie(n.app))return Promise.reject(ve(n));const r=ct(n),s=hu(r,e),h=await new gu(r,s,t).execute();return h&&!t&&(delete h.user._redirectEventId,await r._persistUserIfCurrent(h.user),await r._setRedirectUser(null,e)),h}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Eu=10*60*1e3;class vu{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Tu(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!ta(e)){const s=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";t.onError(me(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Eu&&this.cachedEventUids.clear(),this.cachedEventUids.has(Cs(e))}saveEventToCache(e){this.cachedEventUids.add(Cs(e)),this.lastProcessedEventTime=Date.now()}}function Cs(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function ta({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Tu(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ta(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Au(n,e={}){return Se(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Su=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,bu=/^https?/;async function Cu(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Au(n);for(const t of e)try{if(Pu(t))return}catch{}he(n,"unauthorized-domain")}function Pu(n){const e=ki(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const h=new URL(n);return h.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&h.hostname===r}if(!bu.test(t))return!1;if(Su.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ru=new Yt(3e4,6e4);function Ps(){const n=ye().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function ku(n){return new Promise((e,t)=>{var s,c,h;function r(){Ps(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Ps(),t(me(n,"network-request-failed"))},timeout:Ru.get()})}if((c=(s=ye().gapi)==null?void 0:s.iframes)!=null&&c.Iframe)e(gapi.iframes.getContext());else if((h=ye().gapi)!=null&&h.load)r();else{const f=Al("iframefcb");return ye()[f]=()=>{gapi.load?r():t(me(n,"network-request-failed"))},Vo(`${Tl()}?onload=${f}`).catch(m=>t(m))}}).catch(e=>{throw vn=null,e})}let vn=null;function Ou(n){return vn=vn||ku(n),vn}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nu=new Yt(5e3,15e3),Du="__/auth/iframe",Lu="emulator/auth/iframe",Mu={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Uu=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function xu(n){const e=n.config;C(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?ji(e,Lu):`https://${n.config.authDomain}/${Du}`,r={apiKey:e.apiKey,appName:n.name,v:Et},s=Uu.get(n.config.apiHost);s&&(r.eid=s);const c=n._getFrameworks();return c.length&&(r.fw=c.join(",")),`${t}?${Xt(r).slice(1)}`}async function Fu(n){const e=await Ou(n),t=ye().gapi;return C(t,n,"internal-error"),e.open({where:document.body,url:xu(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Mu,dontclear:!0},r=>new Promise(async(s,c)=>{await r.restyle({setHideOnLeave:!1});const h=me(n,"network-request-failed"),f=ye().setTimeout(()=>{c(h)},Nu.get());function m(){ye().clearTimeout(f),s(r)}r.ping(m).then(m,()=>{c(h)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vu={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},ju=500,Bu=600,$u="_blank",Hu="http://localhost";class Rs{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Wu(n,e,t,r=ju,s=Bu){const c=Math.max((window.screen.availHeight-s)/2,0).toString(),h=Math.max((window.screen.availWidth-r)/2,0).toString();let f="";const m={...Vu,width:r.toString(),height:s.toString(),top:c,left:h},v=K().toLowerCase();t&&(f=No(v)?$u:t),ko(v)&&(e=e||Hu,m.scrollbars="yes");const b=Object.entries(m).reduce((A,[x,L])=>`${A}${x}=${L},`,"");if(pl(v)&&f!=="_self")return qu(e||"",f),new Rs(null);const S=window.open(e||"",f,b);C(S,n,"popup-blocked");try{S.focus()}catch{}return new Rs(S)}function qu(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zu="__/auth/handler",Gu="emulator/auth/handler",Ku=encodeURIComponent("fac");async function ks(n,e,t,r,s,c){C(n.config.authDomain,n,"auth-domain-config-required"),C(n.config.apiKey,n,"invalid-api-key");const h={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Et,eventId:s};if(e instanceof $o){e.setDefaultLanguage(n.languageCode),h.providerId=e.providerId||"",Nc(e.getCustomParameters())||(h.customParameters=JSON.stringify(e.getCustomParameters()));for(const[b,S]of Object.entries({}))h[b]=S}if(e instanceof Zt){const b=e.getScopes().filter(S=>S!=="");b.length>0&&(h.scopes=b.join(","))}n.tenantId&&(h.tid=n.tenantId);const f=h;for(const b of Object.keys(f))f[b]===void 0&&delete f[b];const m=await n._getAppCheckToken(),v=m?`#${Ku}=${encodeURIComponent(m)}`:"";return`${Ju(n)}?${Xt(f).slice(1)}${v}`}function Ju({config:n}){return n.emulator?ji(n,Gu):`https://${n.authDomain}/${zu}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wi="webStorageSupport";class Xu{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Jo,this._completeRedirectFn=Iu,this._overrideRedirectResult=yu}async _openPopup(e,t,r,s){var h;Ae((h=this.eventManagers[e._key()])==null?void 0:h.manager,"_initialize() not called before _openPopup()");const c=await ks(e,t,r,ki(),s);return Wu(e,c,qi())}async _openRedirect(e,t,r,s){await this._originValidation(e);const c=await ks(e,t,r,ki(),s);return Zl(c),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:c}=this.eventManagers[t];return s?Promise.resolve(s):(Ae(c,"If manager is not set, promise should be"),c)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Fu(e),r=new vu(e);return t.register("authEvent",s=>(C(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(wi,{type:wi},s=>{var h;const c=(h=s==null?void 0:s[0])==null?void 0:h[wi];c!==void 0&&t(!!c),he(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Cu(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return xo()||Oo()||$i()}}const Yu=Xu;var Os="@firebase/auth",Ns="1.12.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qu{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){C(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zu(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function ed(n){_e(new ce("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),c=e.getProvider("app-check-internal"),{apiKey:h,authDomain:f}=r.options;C(h&&!h.includes(":"),"invalid-api-key",{appName:r.name});const m={apiKey:h,authDomain:f,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Fo(n)},v=new Il(r,s,c,m);return kl(v,t),v},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),_e(new ce("auth-internal",e=>{const t=ct(e.getProvider("auth").getImmediate());return(r=>new Qu(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),re(Os,Ns,Zu(n)),re(Os,Ns,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const td=5*60,nd=lo("authIdTokenMaxAge")||td;let Ds=null;const id=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>nd)return;const s=t==null?void 0:t.token;Ds!==s&&(Ds=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function lp(n=Fi()){const e=at(n,"auth");if(e.isInitialized())return e.getImmediate();const t=Rl(n,{popupRedirectResolver:Yu,persistence:[cu,Xl,Jo]}),r=lo("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const c=new URL(r,location.origin);if(location.origin===c.origin){const h=id(c.toString());Gl(t,h,()=>h(t.currentUser)),zl(t,f=>h(f))}}const s=co("auth");return s&&Ol(t,`http://${s}`),t}function rd(){var n;return((n=document.getElementsByTagName("head"))==null?void 0:n[0])??document}El({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const c=me("internal-error");c.customData=s,t(c)},r.type="text/javascript",r.charset="UTF-8",rd().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});ed("Browser");var sd="firebase",od="12.7.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */re(sd,od,"app");const na="@firebase/installations",Gi="0.6.19";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ia=1e4,ra=`w:${Gi}`,sa="FIS_v2",ad="https://firebaseinstallations.googleapis.com/v1",cd=60*60*1e3,hd="installations",ld="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ud={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},it=new ot(hd,ld,ud);function oa(n){return n instanceof le&&n.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aa({projectId:n}){return`${ad}/projects/${n}/installations`}function ca(n){return{token:n.token,requestStatus:2,expiresIn:fd(n.expiresIn),creationTime:Date.now()}}async function ha(n,e){const r=(await e.json()).error;return it.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function la({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function dd(n,{refreshToken:e}){const t=la(n);return t.append("Authorization",pd(e)),t}async function ua(n){const e=await n();return e.status>=500&&e.status<600?n():e}function fd(n){return Number(n.replace("s","000"))}function pd(n){return`${sa} ${n}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gd({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const r=aa(n),s=la(n),c=e.getImmediate({optional:!0});if(c){const v=await c.getHeartbeatsHeader();v&&s.append("x-firebase-client",v)}const h={fid:t,authVersion:sa,appId:n.appId,sdkVersion:ra},f={method:"POST",headers:s,body:JSON.stringify(h)},m=await ua(()=>fetch(r,f));if(m.ok){const v=await m.json();return{fid:v.fid||t,registrationStatus:2,refreshToken:v.refreshToken,authToken:ca(v.authToken)}}else throw await ha("Create Installation",m)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function da(n){return new Promise(e=>{setTimeout(e,n)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function md(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yd=/^[cdef][\w-]{21}$/,Li="";function _d(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=wd(n);return yd.test(t)?t:Li}catch{return Li}}function wd(n){return md(n).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vn(n){return`${n.appName}!${n.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fa=new Map;function pa(n,e){const t=Vn(n);ga(t,e),Id(t,e)}function ga(n,e){const t=fa.get(n);if(t)for(const r of t)r(e)}function Id(n,e){const t=Ed();t&&t.postMessage({key:n,fid:e}),vd()}let Ye=null;function Ed(){return!Ye&&"BroadcastChannel"in self&&(Ye=new BroadcastChannel("[Firebase] FID Change"),Ye.onmessage=n=>{ga(n.data.key,n.data.fid)}),Ye}function vd(){fa.size===0&&Ye&&(Ye.close(),Ye=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Td="firebase-installations-database",Ad=1,rt="firebase-installations-store";let Ii=null;function Ki(){return Ii||(Ii=wo(Td,Ad,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(rt)}}})),Ii}async function Nn(n,e){const t=Vn(n),s=(await Ki()).transaction(rt,"readwrite"),c=s.objectStore(rt),h=await c.get(t);return await c.put(e,t),await s.done,(!h||h.fid!==e.fid)&&pa(n,e.fid),e}async function ma(n){const e=Vn(n),r=(await Ki()).transaction(rt,"readwrite");await r.objectStore(rt).delete(e),await r.done}async function jn(n,e){const t=Vn(n),s=(await Ki()).transaction(rt,"readwrite"),c=s.objectStore(rt),h=await c.get(t),f=e(h);return f===void 0?await c.delete(t):await c.put(f,t),await s.done,f&&(!h||h.fid!==f.fid)&&pa(n,f.fid),f}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ji(n){let e;const t=await jn(n.appConfig,r=>{const s=Sd(r),c=bd(n,s);return e=c.registrationPromise,c.installationEntry});return t.fid===Li?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function Sd(n){const e=n||{fid:_d(),registrationStatus:0};return ya(e)}function bd(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(it.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=Cd(n,t);return{installationEntry:t,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:Pd(n)}:{installationEntry:e}}async function Cd(n,e){try{const t=await gd(n,e);return Nn(n.appConfig,t)}catch(t){throw oa(t)&&t.customData.serverCode===409?await ma(n.appConfig):await Nn(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function Pd(n){let e=await Ls(n.appConfig);for(;e.registrationStatus===1;)await da(100),e=await Ls(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:r}=await Ji(n);return r||t}return e}function Ls(n){return jn(n,e=>{if(!e)throw it.create("installation-not-found");return ya(e)})}function ya(n){return Rd(n)?{fid:n.fid,registrationStatus:0}:n}function Rd(n){return n.registrationStatus===1&&n.registrationTime+ia<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kd({appConfig:n,heartbeatServiceProvider:e},t){const r=Od(n,t),s=dd(n,t),c=e.getImmediate({optional:!0});if(c){const v=await c.getHeartbeatsHeader();v&&s.append("x-firebase-client",v)}const h={installation:{sdkVersion:ra,appId:n.appId}},f={method:"POST",headers:s,body:JSON.stringify(h)},m=await ua(()=>fetch(r,f));if(m.ok){const v=await m.json();return ca(v)}else throw await ha("Generate Auth Token",m)}function Od(n,{fid:e}){return`${aa(n)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xi(n,e=!1){let t;const r=await jn(n.appConfig,c=>{if(!_a(c))throw it.create("not-registered");const h=c.authToken;if(!e&&Ld(h))return c;if(h.requestStatus===1)return t=Nd(n,e),c;{if(!navigator.onLine)throw it.create("app-offline");const f=Ud(c);return t=Dd(n,f),f}});return t?await t:r.authToken}async function Nd(n,e){let t=await Ms(n.appConfig);for(;t.authToken.requestStatus===1;)await da(100),t=await Ms(n.appConfig);const r=t.authToken;return r.requestStatus===0?Xi(n,e):r}function Ms(n){return jn(n,e=>{if(!_a(e))throw it.create("not-registered");const t=e.authToken;return xd(t)?{...e,authToken:{requestStatus:0}}:e})}async function Dd(n,e){try{const t=await kd(n,e),r={...e,authToken:t};return await Nn(n.appConfig,r),t}catch(t){if(oa(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await ma(n.appConfig);else{const r={...e,authToken:{requestStatus:0}};await Nn(n.appConfig,r)}throw t}}function _a(n){return n!==void 0&&n.registrationStatus===2}function Ld(n){return n.requestStatus===2&&!Md(n)}function Md(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+cd}function Ud(n){const e={requestStatus:1,requestTime:Date.now()};return{...n,authToken:e}}function xd(n){return n.requestStatus===1&&n.requestTime+ia<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fd(n){const e=n,{installationEntry:t,registrationPromise:r}=await Ji(e);return r?r.catch(console.error):Xi(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vd(n,e=!1){const t=n;return await jd(t),(await Xi(t,e)).token}async function jd(n){const{registrationPromise:e}=await Ji(n);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bd(n){if(!n||!n.options)throw Ei("App Configuration");if(!n.name)throw Ei("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw Ei(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function Ei(n){return it.create("missing-app-config-values",{valueName:n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wa="installations",$d="installations-internal",Hd=n=>{const e=n.getProvider("app").getImmediate(),t=Bd(e),r=at(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},Wd=n=>{const e=n.getProvider("app").getImmediate(),t=at(e,wa).getImmediate();return{getId:()=>Fd(t),getToken:s=>Vd(t,s)}};function qd(){_e(new ce(wa,Hd,"PUBLIC")),_e(new ce($d,Wd,"PRIVATE"))}qd();re(na,Gi);re(na,Gi,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dn="analytics",zd="firebase_id",Gd="origin",Kd=60*1e3,Jd="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Yi="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const G=new Mn("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xd={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},Q=new ot("analytics","Analytics",Xd);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yd(n){if(!n.startsWith(Yi)){const e=Q.create("invalid-gtag-resource",{gtagURL:n});return G.warn(e.message),""}return n}function Ia(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function Qd(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function Zd(n,e){const t=Qd("firebase-js-sdk-policy",{createScriptURL:Yd}),r=document.createElement("script"),s=`${Yi}?l=${n}&id=${e}`;r.src=t?t==null?void 0:t.createScriptURL(s):s,r.async=!0,document.head.appendChild(r)}function ef(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function tf(n,e,t,r,s,c){const h=r[s];try{if(h)await e[h];else{const m=(await Ia(t)).find(v=>v.measurementId===s);m&&await e[m.appId]}}catch(f){G.error(f)}n("config",s,c)}async function nf(n,e,t,r,s){try{let c=[];if(s&&s.send_to){let h=s.send_to;Array.isArray(h)||(h=[h]);const f=await Ia(t);for(const m of h){const v=f.find(S=>S.measurementId===m),b=v&&e[v.appId];if(b)c.push(b);else{c=[];break}}}c.length===0&&(c=Object.values(e)),await Promise.all(c),n("event",r,s||{})}catch(c){G.error(c)}}function rf(n,e,t,r){async function s(c,...h){try{if(c==="event"){const[f,m]=h;await nf(n,e,t,f,m)}else if(c==="config"){const[f,m]=h;await tf(n,e,t,r,f,m)}else if(c==="consent"){const[f,m]=h;n("consent",f,m)}else if(c==="get"){const[f,m,v]=h;n("get",f,m,v)}else if(c==="set"){const[f]=h;n("set",f)}else n(c,...h)}catch(f){G.error(f)}}return s}function sf(n,e,t,r,s){let c=function(...h){window[r].push(arguments)};return window[s]&&typeof window[s]=="function"&&(c=window[s]),window[s]=rf(c,n,e,t),{gtagCore:c,wrappedGtag:window[s]}}function of(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(Yi)&&t.src.includes(n))return t;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const af=30,cf=1e3;class hf{constructor(e={},t=cf){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const Ea=new hf;function lf(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function uf(n){var h;const{appId:e,apiKey:t}=n,r={method:"GET",headers:lf(t)},s=Jd.replace("{app-id}",e),c=await fetch(s,r);if(c.status!==200&&c.status!==304){let f="";try{const m=await c.json();(h=m.error)!=null&&h.message&&(f=m.error.message)}catch{}throw Q.create("config-fetch-failed",{httpStatus:c.status,responseMessage:f})}return c.json()}async function df(n,e=Ea,t){const{appId:r,apiKey:s,measurementId:c}=n.options;if(!r)throw Q.create("no-app-id");if(!s){if(c)return{measurementId:c,appId:r};throw Q.create("no-api-key")}const h=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},f=new gf;return setTimeout(async()=>{f.abort()},Kd),va({appId:r,apiKey:s,measurementId:c},h,f,e)}async function va(n,{throttleEndTimeMillis:e,backoffCount:t},r,s=Ea){var f;const{appId:c,measurementId:h}=n;try{await ff(r,e)}catch(m){if(h)return G.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${h} provided in the "measurementId" field in the local Firebase config. [${m==null?void 0:m.message}]`),{appId:c,measurementId:h};throw m}try{const m=await uf(n);return s.deleteThrottleMetadata(c),m}catch(m){const v=m;if(!pf(v)){if(s.deleteThrottleMetadata(c),h)return G.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${h} provided in the "measurementId" field in the local Firebase config. [${v==null?void 0:v.message}]`),{appId:c,measurementId:h};throw m}const b=Number((f=v==null?void 0:v.customData)==null?void 0:f.httpStatus)===503?os(t,s.intervalMillis,af):os(t,s.intervalMillis),S={throttleEndTimeMillis:Date.now()+b,backoffCount:t+1};return s.setThrottleMetadata(c,S),G.debug(`Calling attemptFetch again in ${b} millis`),va(n,S,r,s)}}function ff(n,e){return new Promise((t,r)=>{const s=Math.max(e-Date.now(),0),c=setTimeout(t,s);n.addEventListener(()=>{clearTimeout(c),r(Q.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function pf(n){if(!(n instanceof le)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class gf{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function mf(n,e,t,r,s){if(s&&s.global){n("event",t,r);return}else{const c=await e,h={...r,send_to:c};n("event",t,h)}}async function yf(n,e,t,r){if(r&&r.global){const s={};for(const c of Object.keys(t))s[`user_properties.${c}`]=t[c];return n("set",s),Promise.resolve()}else{const s=await e;n("config",s,{update:!0,user_properties:t})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _f(){if(go())try{await mo()}catch(n){return G.warn(Q.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return G.warn(Q.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function wf(n,e,t,r,s,c,h){const f=df(n);f.then(A=>{t[A.measurementId]=A.appId,n.options.measurementId&&A.measurementId!==n.options.measurementId&&G.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${A.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(A=>G.error(A)),e.push(f);const m=_f().then(A=>{if(A)return r.getId()}),[v,b]=await Promise.all([f,m]);of(c)||Zd(c,v.measurementId),s("js",new Date);const S=(h==null?void 0:h.config)??{};return S[Gd]="firebase",S.update=!0,b!=null&&(S[zd]=b),s("config",v.measurementId,S),v.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class If{constructor(e){this.app=e}_delete(){return delete yt[this.app.options.appId],Promise.resolve()}}let yt={},Us=[];const xs={};let vi="dataLayer",Ef="gtag",Fs,Qi,Vs=!1;function vf(){const n=[];if(po()&&n.push("This is a browser extension environment."),Pc()||n.push("Cookies are not available."),n.length>0){const e=n.map((r,s)=>`(${s+1}) ${r}`).join(" "),t=Q.create("invalid-analytics-context",{errorInfo:e});G.warn(t.message)}}function Tf(n,e,t){vf();const r=n.options.appId;if(!r)throw Q.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)G.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw Q.create("no-api-key");if(yt[r]!=null)throw Q.create("already-exists",{id:r});if(!Vs){ef(vi);const{wrappedGtag:c,gtagCore:h}=sf(yt,Us,xs,vi,Ef);Qi=c,Fs=h,Vs=!0}return yt[r]=wf(n,Us,xs,e,Fs,vi,t),new If(n)}function up(n=Fi()){n=Z(n);const e=at(n,Dn);return e.isInitialized()?e.getImmediate():Af(n)}function Af(n,e={}){const t=at(n,Dn);if(t.isInitialized()){const s=t.getImmediate();if(Be(e,t.getOptions()))return s;throw Q.create("already-initialized")}return t.initialize({options:e})}function Sf(n,e,t){n=Z(n),yf(Qi,yt[n.app.options.appId],e,t).catch(r=>G.error(r))}function bf(n,e,t,r){n=Z(n),mf(Qi,yt[n.app.options.appId],e,t,r).catch(s=>G.error(s))}const js="@firebase/analytics",Bs="0.10.19";function Cf(){_e(new ce(Dn,(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return Tf(r,s,t)},"PUBLIC")),_e(new ce("analytics-internal",n,"PRIVATE")),re(js,Bs),re(js,Bs,"esm2020");function n(e){try{const t=e.getProvider(Dn).getImmediate();return{logEvent:(r,s,c)=>bf(t,r,s,c),setUserProperties:(r,s)=>Sf(t,r,s)}}catch(t){throw Q.create("interop-component-reg-failed",{reason:t})}}}Cf();var $s=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Zi;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(y,u){function p(){}p.prototype=u.prototype,y.F=u.prototype,y.prototype=new p,y.prototype.constructor=y,y.D=function(_,g,I){for(var d=Array(arguments.length-2),J=2;J<arguments.length;J++)d[J-2]=arguments[J];return u.prototype[g].apply(_,d)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(y,u,p){p||(p=0);const _=Array(16);if(typeof u=="string")for(var g=0;g<16;++g)_[g]=u.charCodeAt(p++)|u.charCodeAt(p++)<<8|u.charCodeAt(p++)<<16|u.charCodeAt(p++)<<24;else for(g=0;g<16;++g)_[g]=u[p++]|u[p++]<<8|u[p++]<<16|u[p++]<<24;u=y.g[0],p=y.g[1],g=y.g[2];let I=y.g[3],d;d=u+(I^p&(g^I))+_[0]+3614090360&4294967295,u=p+(d<<7&4294967295|d>>>25),d=I+(g^u&(p^g))+_[1]+3905402710&4294967295,I=u+(d<<12&4294967295|d>>>20),d=g+(p^I&(u^p))+_[2]+606105819&4294967295,g=I+(d<<17&4294967295|d>>>15),d=p+(u^g&(I^u))+_[3]+3250441966&4294967295,p=g+(d<<22&4294967295|d>>>10),d=u+(I^p&(g^I))+_[4]+4118548399&4294967295,u=p+(d<<7&4294967295|d>>>25),d=I+(g^u&(p^g))+_[5]+1200080426&4294967295,I=u+(d<<12&4294967295|d>>>20),d=g+(p^I&(u^p))+_[6]+2821735955&4294967295,g=I+(d<<17&4294967295|d>>>15),d=p+(u^g&(I^u))+_[7]+4249261313&4294967295,p=g+(d<<22&4294967295|d>>>10),d=u+(I^p&(g^I))+_[8]+1770035416&4294967295,u=p+(d<<7&4294967295|d>>>25),d=I+(g^u&(p^g))+_[9]+2336552879&4294967295,I=u+(d<<12&4294967295|d>>>20),d=g+(p^I&(u^p))+_[10]+4294925233&4294967295,g=I+(d<<17&4294967295|d>>>15),d=p+(u^g&(I^u))+_[11]+2304563134&4294967295,p=g+(d<<22&4294967295|d>>>10),d=u+(I^p&(g^I))+_[12]+1804603682&4294967295,u=p+(d<<7&4294967295|d>>>25),d=I+(g^u&(p^g))+_[13]+4254626195&4294967295,I=u+(d<<12&4294967295|d>>>20),d=g+(p^I&(u^p))+_[14]+2792965006&4294967295,g=I+(d<<17&4294967295|d>>>15),d=p+(u^g&(I^u))+_[15]+1236535329&4294967295,p=g+(d<<22&4294967295|d>>>10),d=u+(g^I&(p^g))+_[1]+4129170786&4294967295,u=p+(d<<5&4294967295|d>>>27),d=I+(p^g&(u^p))+_[6]+3225465664&4294967295,I=u+(d<<9&4294967295|d>>>23),d=g+(u^p&(I^u))+_[11]+643717713&4294967295,g=I+(d<<14&4294967295|d>>>18),d=p+(I^u&(g^I))+_[0]+3921069994&4294967295,p=g+(d<<20&4294967295|d>>>12),d=u+(g^I&(p^g))+_[5]+3593408605&4294967295,u=p+(d<<5&4294967295|d>>>27),d=I+(p^g&(u^p))+_[10]+38016083&4294967295,I=u+(d<<9&4294967295|d>>>23),d=g+(u^p&(I^u))+_[15]+3634488961&4294967295,g=I+(d<<14&4294967295|d>>>18),d=p+(I^u&(g^I))+_[4]+3889429448&4294967295,p=g+(d<<20&4294967295|d>>>12),d=u+(g^I&(p^g))+_[9]+568446438&4294967295,u=p+(d<<5&4294967295|d>>>27),d=I+(p^g&(u^p))+_[14]+3275163606&4294967295,I=u+(d<<9&4294967295|d>>>23),d=g+(u^p&(I^u))+_[3]+4107603335&4294967295,g=I+(d<<14&4294967295|d>>>18),d=p+(I^u&(g^I))+_[8]+1163531501&4294967295,p=g+(d<<20&4294967295|d>>>12),d=u+(g^I&(p^g))+_[13]+2850285829&4294967295,u=p+(d<<5&4294967295|d>>>27),d=I+(p^g&(u^p))+_[2]+4243563512&4294967295,I=u+(d<<9&4294967295|d>>>23),d=g+(u^p&(I^u))+_[7]+1735328473&4294967295,g=I+(d<<14&4294967295|d>>>18),d=p+(I^u&(g^I))+_[12]+2368359562&4294967295,p=g+(d<<20&4294967295|d>>>12),d=u+(p^g^I)+_[5]+4294588738&4294967295,u=p+(d<<4&4294967295|d>>>28),d=I+(u^p^g)+_[8]+2272392833&4294967295,I=u+(d<<11&4294967295|d>>>21),d=g+(I^u^p)+_[11]+1839030562&4294967295,g=I+(d<<16&4294967295|d>>>16),d=p+(g^I^u)+_[14]+4259657740&4294967295,p=g+(d<<23&4294967295|d>>>9),d=u+(p^g^I)+_[1]+2763975236&4294967295,u=p+(d<<4&4294967295|d>>>28),d=I+(u^p^g)+_[4]+1272893353&4294967295,I=u+(d<<11&4294967295|d>>>21),d=g+(I^u^p)+_[7]+4139469664&4294967295,g=I+(d<<16&4294967295|d>>>16),d=p+(g^I^u)+_[10]+3200236656&4294967295,p=g+(d<<23&4294967295|d>>>9),d=u+(p^g^I)+_[13]+681279174&4294967295,u=p+(d<<4&4294967295|d>>>28),d=I+(u^p^g)+_[0]+3936430074&4294967295,I=u+(d<<11&4294967295|d>>>21),d=g+(I^u^p)+_[3]+3572445317&4294967295,g=I+(d<<16&4294967295|d>>>16),d=p+(g^I^u)+_[6]+76029189&4294967295,p=g+(d<<23&4294967295|d>>>9),d=u+(p^g^I)+_[9]+3654602809&4294967295,u=p+(d<<4&4294967295|d>>>28),d=I+(u^p^g)+_[12]+3873151461&4294967295,I=u+(d<<11&4294967295|d>>>21),d=g+(I^u^p)+_[15]+530742520&4294967295,g=I+(d<<16&4294967295|d>>>16),d=p+(g^I^u)+_[2]+3299628645&4294967295,p=g+(d<<23&4294967295|d>>>9),d=u+(g^(p|~I))+_[0]+4096336452&4294967295,u=p+(d<<6&4294967295|d>>>26),d=I+(p^(u|~g))+_[7]+1126891415&4294967295,I=u+(d<<10&4294967295|d>>>22),d=g+(u^(I|~p))+_[14]+2878612391&4294967295,g=I+(d<<15&4294967295|d>>>17),d=p+(I^(g|~u))+_[5]+4237533241&4294967295,p=g+(d<<21&4294967295|d>>>11),d=u+(g^(p|~I))+_[12]+1700485571&4294967295,u=p+(d<<6&4294967295|d>>>26),d=I+(p^(u|~g))+_[3]+2399980690&4294967295,I=u+(d<<10&4294967295|d>>>22),d=g+(u^(I|~p))+_[10]+4293915773&4294967295,g=I+(d<<15&4294967295|d>>>17),d=p+(I^(g|~u))+_[1]+2240044497&4294967295,p=g+(d<<21&4294967295|d>>>11),d=u+(g^(p|~I))+_[8]+1873313359&4294967295,u=p+(d<<6&4294967295|d>>>26),d=I+(p^(u|~g))+_[15]+4264355552&4294967295,I=u+(d<<10&4294967295|d>>>22),d=g+(u^(I|~p))+_[6]+2734768916&4294967295,g=I+(d<<15&4294967295|d>>>17),d=p+(I^(g|~u))+_[13]+1309151649&4294967295,p=g+(d<<21&4294967295|d>>>11),d=u+(g^(p|~I))+_[4]+4149444226&4294967295,u=p+(d<<6&4294967295|d>>>26),d=I+(p^(u|~g))+_[11]+3174756917&4294967295,I=u+(d<<10&4294967295|d>>>22),d=g+(u^(I|~p))+_[2]+718787259&4294967295,g=I+(d<<15&4294967295|d>>>17),d=p+(I^(g|~u))+_[9]+3951481745&4294967295,y.g[0]=y.g[0]+u&4294967295,y.g[1]=y.g[1]+(g+(d<<21&4294967295|d>>>11))&4294967295,y.g[2]=y.g[2]+g&4294967295,y.g[3]=y.g[3]+I&4294967295}r.prototype.v=function(y,u){u===void 0&&(u=y.length);const p=u-this.blockSize,_=this.C;let g=this.h,I=0;for(;I<u;){if(g==0)for(;I<=p;)s(this,y,I),I+=this.blockSize;if(typeof y=="string"){for(;I<u;)if(_[g++]=y.charCodeAt(I++),g==this.blockSize){s(this,_),g=0;break}}else for(;I<u;)if(_[g++]=y[I++],g==this.blockSize){s(this,_),g=0;break}}this.h=g,this.o+=u},r.prototype.A=function(){var y=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);y[0]=128;for(var u=1;u<y.length-8;++u)y[u]=0;u=this.o*8;for(var p=y.length-8;p<y.length;++p)y[p]=u&255,u/=256;for(this.v(y),y=Array(16),u=0,p=0;p<4;++p)for(let _=0;_<32;_+=8)y[u++]=this.g[p]>>>_&255;return y};function c(y,u){var p=f;return Object.prototype.hasOwnProperty.call(p,y)?p[y]:p[y]=u(y)}function h(y,u){this.h=u;const p=[];let _=!0;for(let g=y.length-1;g>=0;g--){const I=y[g]|0;_&&I==u||(p[g]=I,_=!1)}this.g=p}var f={};function m(y){return-128<=y&&y<128?c(y,function(u){return new h([u|0],u<0?-1:0)}):new h([y|0],y<0?-1:0)}function v(y){if(isNaN(y)||!isFinite(y))return S;if(y<0)return U(v(-y));const u=[];let p=1;for(let _=0;y>=p;_++)u[_]=y/p|0,p*=4294967296;return new h(u,0)}function b(y,u){if(y.length==0)throw Error("number format error: empty string");if(u=u||10,u<2||36<u)throw Error("radix out of range: "+u);if(y.charAt(0)=="-")return U(b(y.substring(1),u));if(y.indexOf("-")>=0)throw Error('number format error: interior "-" character');const p=v(Math.pow(u,8));let _=S;for(let I=0;I<y.length;I+=8){var g=Math.min(8,y.length-I);const d=parseInt(y.substring(I,I+g),u);g<8?(g=v(Math.pow(u,g)),_=_.j(g).add(v(d))):(_=_.j(p),_=_.add(v(d)))}return _}var S=m(0),A=m(1),x=m(16777216);n=h.prototype,n.m=function(){if(V(this))return-U(this).m();let y=0,u=1;for(let p=0;p<this.g.length;p++){const _=this.i(p);y+=(_>=0?_:4294967296+_)*u,u*=4294967296}return y},n.toString=function(y){if(y=y||10,y<2||36<y)throw Error("radix out of range: "+y);if(L(this))return"0";if(V(this))return"-"+U(this).toString(y);const u=v(Math.pow(y,6));var p=this;let _="";for(;;){const g=be(p,u).g;p=X(p,g.j(u));let I=((p.g.length>0?p.g[0]:p.h)>>>0).toString(y);if(p=g,L(p))return I+_;for(;I.length<6;)I="0"+I;_=I+_}},n.i=function(y){return y<0?0:y<this.g.length?this.g[y]:this.h};function L(y){if(y.h!=0)return!1;for(let u=0;u<y.g.length;u++)if(y.g[u]!=0)return!1;return!0}function V(y){return y.h==-1}n.l=function(y){return y=X(this,y),V(y)?-1:L(y)?0:1};function U(y){const u=y.g.length,p=[];for(let _=0;_<u;_++)p[_]=~y.g[_];return new h(p,~y.h).add(A)}n.abs=function(){return V(this)?U(this):this},n.add=function(y){const u=Math.max(this.g.length,y.g.length),p=[];let _=0;for(let g=0;g<=u;g++){let I=_+(this.i(g)&65535)+(y.i(g)&65535),d=(I>>>16)+(this.i(g)>>>16)+(y.i(g)>>>16);_=d>>>16,I&=65535,d&=65535,p[g]=d<<16|I}return new h(p,p[p.length-1]&-2147483648?-1:0)};function X(y,u){return y.add(U(u))}n.j=function(y){if(L(this)||L(y))return S;if(V(this))return V(y)?U(this).j(U(y)):U(U(this).j(y));if(V(y))return U(this.j(U(y)));if(this.l(x)<0&&y.l(x)<0)return v(this.m()*y.m());const u=this.g.length+y.g.length,p=[];for(var _=0;_<2*u;_++)p[_]=0;for(_=0;_<this.g.length;_++)for(let g=0;g<y.g.length;g++){const I=this.i(_)>>>16,d=this.i(_)&65535,J=y.i(g)>>>16,We=y.i(g)&65535;p[2*_+2*g]+=d*We,Y(p,2*_+2*g),p[2*_+2*g+1]+=I*We,Y(p,2*_+2*g+1),p[2*_+2*g+1]+=d*J,Y(p,2*_+2*g+1),p[2*_+2*g+2]+=I*J,Y(p,2*_+2*g+2)}for(y=0;y<u;y++)p[y]=p[2*y+1]<<16|p[2*y];for(y=u;y<2*u;y++)p[y]=0;return new h(p,0)};function Y(y,u){for(;(y[u]&65535)!=y[u];)y[u+1]+=y[u]>>>16,y[u]&=65535,u++}function ee(y,u){this.g=y,this.h=u}function be(y,u){if(L(u))throw Error("division by zero");if(L(y))return new ee(S,S);if(V(y))return u=be(U(y),u),new ee(U(u.g),U(u.h));if(V(u))return u=be(y,U(u)),new ee(U(u.g),u.h);if(y.g.length>30){if(V(y)||V(u))throw Error("slowDivide_ only works with positive integers.");for(var p=A,_=u;_.l(y)<=0;)p=Ce(p),_=Ce(_);var g=te(p,1),I=te(_,1);for(_=te(_,2),p=te(p,2);!L(_);){var d=I.add(_);d.l(y)<=0&&(g=g.add(p),I=d),_=te(_,1),p=te(p,1)}return u=X(y,g.j(u)),new ee(g,u)}for(g=S;y.l(u)>=0;){for(p=Math.max(1,Math.floor(y.m()/u.m())),_=Math.ceil(Math.log(p)/Math.LN2),_=_<=48?1:Math.pow(2,_-48),I=v(p),d=I.j(u);V(d)||d.l(y)>0;)p-=_,I=v(p),d=I.j(u);L(I)&&(I=A),g=g.add(I),y=X(y,d)}return new ee(g,y)}n.B=function(y){return be(this,y).h},n.and=function(y){const u=Math.max(this.g.length,y.g.length),p=[];for(let _=0;_<u;_++)p[_]=this.i(_)&y.i(_);return new h(p,this.h&y.h)},n.or=function(y){const u=Math.max(this.g.length,y.g.length),p=[];for(let _=0;_<u;_++)p[_]=this.i(_)|y.i(_);return new h(p,this.h|y.h)},n.xor=function(y){const u=Math.max(this.g.length,y.g.length),p=[];for(let _=0;_<u;_++)p[_]=this.i(_)^y.i(_);return new h(p,this.h^y.h)};function Ce(y){const u=y.g.length+1,p=[];for(let _=0;_<u;_++)p[_]=y.i(_)<<1|y.i(_-1)>>>31;return new h(p,y.h)}function te(y,u){const p=u>>5;u%=32;const _=y.g.length-p,g=[];for(let I=0;I<_;I++)g[I]=u>0?y.i(I+p)>>>u|y.i(I+p+1)<<32-u:y.i(I+p);return new h(g,y.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.B,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=v,h.fromString=b,Zi=h}).apply(typeof $s<"u"?$s:typeof self<"u"?self:typeof window<"u"?window:{});var yn=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var n,e=Object.defineProperty;function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof yn=="object"&&yn];for(var o=0;o<i.length;++o){var a=i[o];if(a&&a.Math==Math)return a}throw Error("Cannot find global object")}var r=t(this);function s(i,o){if(o)e:{var a=r;i=i.split(".");for(var l=0;l<i.length-1;l++){var w=i[l];if(!(w in a))break e;a=a[w]}i=i[i.length-1],l=a[i],o=o(l),o!=l&&o!=null&&e(a,i,{configurable:!0,writable:!0,value:o})}}s("Symbol.dispose",function(i){return i||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(i){return i||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(i){return i||function(o){var a=[],l;for(l in o)Object.prototype.hasOwnProperty.call(o,l)&&a.push([l,o[l]]);return a}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var c=c||{},h=this||self;function f(i){var o=typeof i;return o=="object"&&i!=null||o=="function"}function m(i,o,a){return i.call.apply(i.bind,arguments)}function v(i,o,a){return v=m,v.apply(null,arguments)}function b(i,o){var a=Array.prototype.slice.call(arguments,1);return function(){var l=a.slice();return l.push.apply(l,arguments),i.apply(this,l)}}function S(i,o){function a(){}a.prototype=o.prototype,i.Z=o.prototype,i.prototype=new a,i.prototype.constructor=i,i.Ob=function(l,w,E){for(var T=Array(arguments.length-2),P=2;P<arguments.length;P++)T[P-2]=arguments[P];return o.prototype[w].apply(l,T)}}var A=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?i=>i&&AsyncContext.Snapshot.wrap(i):i=>i;function x(i){const o=i.length;if(o>0){const a=Array(o);for(let l=0;l<o;l++)a[l]=i[l];return a}return[]}function L(i,o){for(let l=1;l<arguments.length;l++){const w=arguments[l];var a=typeof w;if(a=a!="object"?a:w?Array.isArray(w)?"array":a:"null",a=="array"||a=="object"&&typeof w.length=="number"){a=i.length||0;const E=w.length||0;i.length=a+E;for(let T=0;T<E;T++)i[a+T]=w[T]}else i.push(w)}}class V{constructor(o,a){this.i=o,this.j=a,this.h=0,this.g=null}get(){let o;return this.h>0?(this.h--,o=this.g,this.g=o.next,o.next=null):o=this.i(),o}}function U(i){h.setTimeout(()=>{throw i},0)}function X(){var i=y;let o=null;return i.g&&(o=i.g,i.g=i.g.next,i.g||(i.h=null),o.next=null),o}class Y{constructor(){this.h=this.g=null}add(o,a){const l=ee.get();l.set(o,a),this.h?this.h.next=l:this.g=l,this.h=l}}var ee=new V(()=>new be,i=>i.reset());class be{constructor(){this.next=this.g=this.h=null}set(o,a){this.h=o,this.g=a,this.next=null}reset(){this.next=this.g=this.h=null}}let Ce,te=!1,y=new Y,u=()=>{const i=Promise.resolve(void 0);Ce=()=>{i.then(p)}};function p(){for(var i;i=X();){try{i.h.call(i.g)}catch(a){U(a)}var o=ee;o.j(i),o.h<100&&(o.h++,i.next=o.g,o.g=i)}te=!1}function _(){this.u=this.u,this.C=this.C}_.prototype.u=!1,_.prototype.dispose=function(){this.u||(this.u=!0,this.N())},_.prototype[Symbol.dispose]=function(){this.dispose()},_.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function g(i,o){this.type=i,this.g=this.target=o,this.defaultPrevented=!1}g.prototype.h=function(){this.defaultPrevented=!0};var I=function(){if(!h.addEventListener||!Object.defineProperty)return!1;var i=!1,o=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const a=()=>{};h.addEventListener("test",a,o),h.removeEventListener("test",a,o)}catch{}return i}();function d(i){return/^[\s\xa0]*$/.test(i)}function J(i,o){g.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i&&this.init(i,o)}S(J,g),J.prototype.init=function(i,o){const a=this.type=i.type,l=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;this.target=i.target||i.srcElement,this.g=o,o=i.relatedTarget,o||(a=="mouseover"?o=i.fromElement:a=="mouseout"&&(o=i.toElement)),this.relatedTarget=o,l?(this.clientX=l.clientX!==void 0?l.clientX:l.pageX,this.clientY=l.clientY!==void 0?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=i.pointerType,this.state=i.state,this.i=i,i.defaultPrevented&&J.Z.h.call(this)},J.prototype.h=function(){J.Z.h.call(this);const i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var We="closure_listenable_"+(Math.random()*1e6|0),Oa=0;function Na(i,o,a,l,w){this.listener=i,this.proxy=null,this.src=o,this.type=a,this.capture=!!l,this.ha=w,this.key=++Oa,this.da=this.fa=!1}function rn(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function sn(i,o,a){for(const l in i)o.call(a,i[l],l,i)}function Da(i,o){for(const a in i)o.call(void 0,i[a],a,i)}function rr(i){const o={};for(const a in i)o[a]=i[a];return o}const sr="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function or(i,o){let a,l;for(let w=1;w<arguments.length;w++){l=arguments[w];for(a in l)i[a]=l[a];for(let E=0;E<sr.length;E++)a=sr[E],Object.prototype.hasOwnProperty.call(l,a)&&(i[a]=l[a])}}function on(i){this.src=i,this.g={},this.h=0}on.prototype.add=function(i,o,a,l,w){const E=i.toString();i=this.g[E],i||(i=this.g[E]=[],this.h++);const T=$n(i,o,l,w);return T>-1?(o=i[T],a||(o.fa=!1)):(o=new Na(o,this.src,E,!!l,w),o.fa=a,i.push(o)),o};function Bn(i,o){const a=o.type;if(a in i.g){var l=i.g[a],w=Array.prototype.indexOf.call(l,o,void 0),E;(E=w>=0)&&Array.prototype.splice.call(l,w,1),E&&(rn(o),i.g[a].length==0&&(delete i.g[a],i.h--))}}function $n(i,o,a,l){for(let w=0;w<i.length;++w){const E=i[w];if(!E.da&&E.listener==o&&E.capture==!!a&&E.ha==l)return w}return-1}var Hn="closure_lm_"+(Math.random()*1e6|0),Wn={};function ar(i,o,a,l,w){if(Array.isArray(o)){for(let E=0;E<o.length;E++)ar(i,o[E],a,l,w);return null}return a=lr(a),i&&i[We]?i.J(o,a,f(l)?!!l.capture:!1,w):La(i,o,a,!1,l,w)}function La(i,o,a,l,w,E){if(!o)throw Error("Invalid event type");const T=f(w)?!!w.capture:!!w;let P=zn(i);if(P||(i[Hn]=P=new on(i)),a=P.add(o,a,l,T,E),a.proxy)return a;if(l=Ma(),a.proxy=l,l.src=i,l.listener=a,i.addEventListener)I||(w=T),w===void 0&&(w=!1),i.addEventListener(o.toString(),l,w);else if(i.attachEvent)i.attachEvent(hr(o.toString()),l);else if(i.addListener&&i.removeListener)i.addListener(l);else throw Error("addEventListener and attachEvent are unavailable.");return a}function Ma(){function i(a){return o.call(i.src,i.listener,a)}const o=Ua;return i}function cr(i,o,a,l,w){if(Array.isArray(o))for(var E=0;E<o.length;E++)cr(i,o[E],a,l,w);else l=f(l)?!!l.capture:!!l,a=lr(a),i&&i[We]?(i=i.i,E=String(o).toString(),E in i.g&&(o=i.g[E],a=$n(o,a,l,w),a>-1&&(rn(o[a]),Array.prototype.splice.call(o,a,1),o.length==0&&(delete i.g[E],i.h--)))):i&&(i=zn(i))&&(o=i.g[o.toString()],i=-1,o&&(i=$n(o,a,l,w)),(a=i>-1?o[i]:null)&&qn(a))}function qn(i){if(typeof i!="number"&&i&&!i.da){var o=i.src;if(o&&o[We])Bn(o.i,i);else{var a=i.type,l=i.proxy;o.removeEventListener?o.removeEventListener(a,l,i.capture):o.detachEvent?o.detachEvent(hr(a),l):o.addListener&&o.removeListener&&o.removeListener(l),(a=zn(o))?(Bn(a,i),a.h==0&&(a.src=null,o[Hn]=null)):rn(i)}}}function hr(i){return i in Wn?Wn[i]:Wn[i]="on"+i}function Ua(i,o){if(i.da)i=!0;else{o=new J(o,this);const a=i.listener,l=i.ha||i.src;i.fa&&qn(i),i=a.call(l,o)}return i}function zn(i){return i=i[Hn],i instanceof on?i:null}var Gn="__closure_events_fn_"+(Math.random()*1e9>>>0);function lr(i){return typeof i=="function"?i:(i[Gn]||(i[Gn]=function(o){return i.handleEvent(o)}),i[Gn])}function H(){_.call(this),this.i=new on(this),this.M=this,this.G=null}S(H,_),H.prototype[We]=!0,H.prototype.removeEventListener=function(i,o,a,l){cr(this,i,o,a,l)};function W(i,o){var a,l=i.G;if(l)for(a=[];l;l=l.G)a.push(l);if(i=i.M,l=o.type||o,typeof o=="string")o=new g(o,i);else if(o instanceof g)o.target=o.target||i;else{var w=o;o=new g(l,i),or(o,w)}w=!0;let E,T;if(a)for(T=a.length-1;T>=0;T--)E=o.g=a[T],w=an(E,l,!0,o)&&w;if(E=o.g=i,w=an(E,l,!0,o)&&w,w=an(E,l,!1,o)&&w,a)for(T=0;T<a.length;T++)E=o.g=a[T],w=an(E,l,!1,o)&&w}H.prototype.N=function(){if(H.Z.N.call(this),this.i){var i=this.i;for(const o in i.g){const a=i.g[o];for(let l=0;l<a.length;l++)rn(a[l]);delete i.g[o],i.h--}}this.G=null},H.prototype.J=function(i,o,a,l){return this.i.add(String(i),o,!1,a,l)},H.prototype.K=function(i,o,a,l){return this.i.add(String(i),o,!0,a,l)};function an(i,o,a,l){if(o=i.i.g[String(o)],!o)return!0;o=o.concat();let w=!0;for(let E=0;E<o.length;++E){const T=o[E];if(T&&!T.da&&T.capture==a){const P=T.listener,B=T.ha||T.src;T.fa&&Bn(i.i,T),w=P.call(B,l)!==!1&&w}}return w&&!l.defaultPrevented}function xa(i,o){if(typeof i!="function")if(i&&typeof i.handleEvent=="function")i=v(i.handleEvent,i);else throw Error("Invalid listener argument");return Number(o)>2147483647?-1:h.setTimeout(i,o||0)}function ur(i){i.g=xa(()=>{i.g=null,i.i&&(i.i=!1,ur(i))},i.l);const o=i.h;i.h=null,i.m.apply(null,o)}class Fa extends _{constructor(o,a){super(),this.m=o,this.l=a,this.h=null,this.i=!1,this.g=null}j(o){this.h=arguments,this.g?this.i=!0:ur(this)}N(){super.N(),this.g&&(h.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Tt(i){_.call(this),this.h=i,this.g={}}S(Tt,_);var dr=[];function fr(i){sn(i.g,function(o,a){this.g.hasOwnProperty(a)&&qn(o)},i),i.g={}}Tt.prototype.N=function(){Tt.Z.N.call(this),fr(this)},Tt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Kn=h.JSON.stringify,Va=h.JSON.parse,ja=class{stringify(i){return h.JSON.stringify(i,void 0)}parse(i){return h.JSON.parse(i,void 0)}};function pr(){}function Ba(){}var At={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Jn(){g.call(this,"d")}S(Jn,g);function Xn(){g.call(this,"c")}S(Xn,g);var ht={},gr=null;function Yn(){return gr=gr||new H}ht.Ia="serverreachability";function mr(i){g.call(this,ht.Ia,i)}S(mr,g);function St(i){const o=Yn();W(o,new mr(o))}ht.STAT_EVENT="statevent";function yr(i,o){g.call(this,ht.STAT_EVENT,i),this.stat=o}S(yr,g);function q(i){const o=Yn();W(o,new yr(o,i))}ht.Ja="timingevent";function _r(i,o){g.call(this,ht.Ja,i),this.size=o}S(_r,g);function bt(i,o){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return h.setTimeout(function(){i()},o)}function Ct(){this.g=!0}Ct.prototype.ua=function(){this.g=!1};function $a(i,o,a,l,w,E){i.info(function(){if(i.g)if(E){var T="",P=E.split("&");for(let D=0;D<P.length;D++){var B=P[D].split("=");if(B.length>1){const $=B[0];B=B[1];const de=$.split("_");T=de.length>=2&&de[1]=="type"?T+($+"="+B+"&"):T+($+"=redacted&")}}}else T=null;else T=E;return"XMLHTTP REQ ("+l+") [attempt "+w+"]: "+o+`
`+a+`
`+T})}function Ha(i,o,a,l,w,E,T){i.info(function(){return"XMLHTTP RESP ("+l+") [ attempt "+w+"]: "+o+`
`+a+`
`+E+" "+T})}function lt(i,o,a,l){i.info(function(){return"XMLHTTP TEXT ("+o+"): "+qa(i,a)+(l?" "+l:"")})}function Wa(i,o){i.info(function(){return"TIMEOUT: "+o})}Ct.prototype.info=function(){};function qa(i,o){if(!i.g)return o;if(!o)return null;try{const E=JSON.parse(o);if(E){for(i=0;i<E.length;i++)if(Array.isArray(E[i])){var a=E[i];if(!(a.length<2)){var l=a[1];if(Array.isArray(l)&&!(l.length<1)){var w=l[0];if(w!="noop"&&w!="stop"&&w!="close")for(let T=1;T<l.length;T++)l[T]=""}}}}return Kn(E)}catch{return o}}var Qn={NO_ERROR:0,TIMEOUT:8},za={},wr;function Zn(){}S(Zn,pr),Zn.prototype.g=function(){return new XMLHttpRequest},wr=new Zn;function Pt(i){return encodeURIComponent(String(i))}function Ga(i){var o=1;i=i.split(":");const a=[];for(;o>0&&i.length;)a.push(i.shift()),o--;return i.length&&a.push(i.join(":")),a}function Pe(i,o,a,l){this.j=i,this.i=o,this.l=a,this.S=l||1,this.V=new Tt(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Ir}function Ir(){this.i=null,this.g="",this.h=!1}var Er={},ei={};function ti(i,o,a){i.M=1,i.A=hn(ue(o)),i.u=a,i.R=!0,vr(i,null)}function vr(i,o){i.F=Date.now(),cn(i),i.B=ue(i.A);var a=i.B,l=i.S;Array.isArray(l)||(l=[String(l)]),Mr(a.i,"t",l),i.C=0,a=i.j.L,i.h=new Ir,i.g=Zr(i.j,a?o:null,!i.u),i.P>0&&(i.O=new Fa(v(i.Y,i,i.g),i.P)),o=i.V,a=i.g,l=i.ba;var w="readystatechange";Array.isArray(w)||(w&&(dr[0]=w.toString()),w=dr);for(let E=0;E<w.length;E++){const T=ar(a,w[E],l||o.handleEvent,!1,o.h||o);if(!T)break;o.g[T.key]=T}o=i.J?rr(i.J):{},i.u?(i.v||(i.v="POST"),o["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.B,i.v,i.u,o)):(i.v="GET",i.g.ea(i.B,i.v,null,o)),St(),$a(i.i,i.v,i.B,i.l,i.S,i.u)}Pe.prototype.ba=function(i){i=i.target;const o=this.O;o&&Oe(i)==3?o.j():this.Y(i)},Pe.prototype.Y=function(i){try{if(i==this.g)e:{const P=Oe(this.g),B=this.g.ya(),D=this.g.ca();if(!(P<3)&&(P!=3||this.g&&(this.h.h||this.g.la()||$r(this.g)))){this.K||P!=4||B==7||(B==8||D<=0?St(3):St(2)),ni(this);var o=this.g.ca();this.X=o;var a=Ka(this);if(this.o=o==200,Ha(this.i,this.v,this.B,this.l,this.S,P,o),this.o){if(this.U&&!this.L){t:{if(this.g){var l,w=this.g;if((l=w.g?w.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!d(l)){var E=l;break t}}E=null}if(i=E)lt(this.i,this.l,i,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,ii(this,i);else{this.o=!1,this.m=3,q(12),qe(this),Rt(this);break e}}if(this.R){i=!0;let $;for(;!this.K&&this.C<a.length;)if($=Ja(this,a),$==ei){P==4&&(this.m=4,q(14),i=!1),lt(this.i,this.l,null,"[Incomplete Response]");break}else if($==Er){this.m=4,q(15),lt(this.i,this.l,a,"[Invalid Chunk]"),i=!1;break}else lt(this.i,this.l,$,null),ii(this,$);if(Tr(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),P!=4||a.length!=0||this.h.h||(this.m=1,q(16),i=!1),this.o=this.o&&i,!i)lt(this.i,this.l,a,"[Invalid Chunked Response]"),qe(this),Rt(this);else if(a.length>0&&!this.W){this.W=!0;var T=this.j;T.g==this&&T.aa&&!T.P&&(T.j.info("Great, no buffering proxy detected. Bytes received: "+a.length),ui(T),T.P=!0,q(11))}}else lt(this.i,this.l,a,null),ii(this,a);P==4&&qe(this),this.o&&!this.K&&(P==4?Jr(this.j,this):(this.o=!1,cn(this)))}else hc(this.g),o==400&&a.indexOf("Unknown SID")>0?(this.m=3,q(12)):(this.m=0,q(13)),qe(this),Rt(this)}}}catch{}finally{}};function Ka(i){if(!Tr(i))return i.g.la();const o=$r(i.g);if(o==="")return"";let a="";const l=o.length,w=Oe(i.g)==4;if(!i.h.i){if(typeof TextDecoder>"u")return qe(i),Rt(i),"";i.h.i=new h.TextDecoder}for(let E=0;E<l;E++)i.h.h=!0,a+=i.h.i.decode(o[E],{stream:!(w&&E==l-1)});return o.length=0,i.h.g+=a,i.C=0,i.h.g}function Tr(i){return i.g?i.v=="GET"&&i.M!=2&&i.j.Aa:!1}function Ja(i,o){var a=i.C,l=o.indexOf(`
`,a);return l==-1?ei:(a=Number(o.substring(a,l)),isNaN(a)?Er:(l+=1,l+a>o.length?ei:(o=o.slice(l,l+a),i.C=l+a,o)))}Pe.prototype.cancel=function(){this.K=!0,qe(this)};function cn(i){i.T=Date.now()+i.H,Ar(i,i.H)}function Ar(i,o){if(i.D!=null)throw Error("WatchDog timer not null");i.D=bt(v(i.aa,i),o)}function ni(i){i.D&&(h.clearTimeout(i.D),i.D=null)}Pe.prototype.aa=function(){this.D=null;const i=Date.now();i-this.T>=0?(Wa(this.i,this.B),this.M!=2&&(St(),q(17)),qe(this),this.m=2,Rt(this)):Ar(this,this.T-i)};function Rt(i){i.j.I==0||i.K||Jr(i.j,i)}function qe(i){ni(i);var o=i.O;o&&typeof o.dispose=="function"&&o.dispose(),i.O=null,fr(i.V),i.g&&(o=i.g,i.g=null,o.abort(),o.dispose())}function ii(i,o){try{var a=i.j;if(a.I!=0&&(a.g==i||ri(a.h,i))){if(!i.L&&ri(a.h,i)&&a.I==3){try{var l=a.Ba.g.parse(o)}catch{l=null}if(Array.isArray(l)&&l.length==3){var w=l;if(w[0]==0){e:if(!a.v){if(a.g)if(a.g.F+3e3<i.F)pn(a),dn(a);else break e;li(a),q(18)}}else a.xa=w[1],0<a.xa-a.K&&w[2]<37500&&a.F&&a.A==0&&!a.C&&(a.C=bt(v(a.Va,a),6e3));Cr(a.h)<=1&&a.ta&&(a.ta=void 0)}else Ge(a,11)}else if((i.L||a.g==i)&&pn(a),!d(o))for(w=a.Ba.g.parse(o),o=0;o<w.length;o++){let D=w[o];const $=D[0];if(!($<=a.K))if(a.K=$,D=D[1],a.I==2)if(D[0]=="c"){a.M=D[1],a.ba=D[2];const de=D[3];de!=null&&(a.ka=de,a.j.info("VER="+a.ka));const Ke=D[4];Ke!=null&&(a.za=Ke,a.j.info("SVER="+a.za));const Ne=D[5];Ne!=null&&typeof Ne=="number"&&Ne>0&&(l=1.5*Ne,a.O=l,a.j.info("backChannelRequestTimeoutMs_="+l)),l=a;const De=i.g;if(De){const gn=De.g?De.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(gn){var E=l.h;E.g||gn.indexOf("spdy")==-1&&gn.indexOf("quic")==-1&&gn.indexOf("h2")==-1||(E.j=E.l,E.g=new Set,E.h&&(si(E,E.h),E.h=null))}if(l.G){const di=De.g?De.g.getResponseHeader("X-HTTP-Session-Id"):null;di&&(l.wa=di,M(l.J,l.G,di))}}a.I=3,a.l&&a.l.ra(),a.aa&&(a.T=Date.now()-i.F,a.j.info("Handshake RTT: "+a.T+"ms")),l=a;var T=i;if(l.na=Qr(l,l.L?l.ba:null,l.W),T.L){Pr(l.h,T);var P=T,B=l.O;B&&(P.H=B),P.D&&(ni(P),cn(P)),l.g=T}else Gr(l);a.i.length>0&&fn(a)}else D[0]!="stop"&&D[0]!="close"||Ge(a,7);else a.I==3&&(D[0]=="stop"||D[0]=="close"?D[0]=="stop"?Ge(a,7):hi(a):D[0]!="noop"&&a.l&&a.l.qa(D),a.A=0)}}St(4)}catch{}}var Xa=class{constructor(i,o){this.g=i,this.map=o}};function Sr(i){this.l=i||10,h.PerformanceNavigationTiming?(i=h.performance.getEntriesByType("navigation"),i=i.length>0&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(h.chrome&&h.chrome.loadTimes&&h.chrome.loadTimes()&&h.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function br(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function Cr(i){return i.h?1:i.g?i.g.size:0}function ri(i,o){return i.h?i.h==o:i.g?i.g.has(o):!1}function si(i,o){i.g?i.g.add(o):i.h=o}function Pr(i,o){i.h&&i.h==o?i.h=null:i.g&&i.g.has(o)&&i.g.delete(o)}Sr.prototype.cancel=function(){if(this.i=Rr(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function Rr(i){if(i.h!=null)return i.i.concat(i.h.G);if(i.g!=null&&i.g.size!==0){let o=i.i;for(const a of i.g.values())o=o.concat(a.G);return o}return x(i.i)}var kr=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Ya(i,o){if(i){i=i.split("&");for(let a=0;a<i.length;a++){const l=i[a].indexOf("=");let w,E=null;l>=0?(w=i[a].substring(0,l),E=i[a].substring(l+1)):w=i[a],o(w,E?decodeURIComponent(E.replace(/\+/g," ")):"")}}}function Re(i){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let o;i instanceof Re?(this.l=i.l,kt(this,i.j),this.o=i.o,this.g=i.g,Ot(this,i.u),this.h=i.h,oi(this,Ur(i.i)),this.m=i.m):i&&(o=String(i).match(kr))?(this.l=!1,kt(this,o[1]||"",!0),this.o=Nt(o[2]||""),this.g=Nt(o[3]||"",!0),Ot(this,o[4]),this.h=Nt(o[5]||"",!0),oi(this,o[6]||"",!0),this.m=Nt(o[7]||"")):(this.l=!1,this.i=new Lt(null,this.l))}Re.prototype.toString=function(){const i=[];var o=this.j;o&&i.push(Dt(o,Or,!0),":");var a=this.g;return(a||o=="file")&&(i.push("//"),(o=this.o)&&i.push(Dt(o,Or,!0),"@"),i.push(Pt(a).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a=this.u,a!=null&&i.push(":",String(a))),(a=this.h)&&(this.g&&a.charAt(0)!="/"&&i.push("/"),i.push(Dt(a,a.charAt(0)=="/"?ec:Za,!0))),(a=this.i.toString())&&i.push("?",a),(a=this.m)&&i.push("#",Dt(a,nc)),i.join("")},Re.prototype.resolve=function(i){const o=ue(this);let a=!!i.j;a?kt(o,i.j):a=!!i.o,a?o.o=i.o:a=!!i.g,a?o.g=i.g:a=i.u!=null;var l=i.h;if(a)Ot(o,i.u);else if(a=!!i.h){if(l.charAt(0)!="/")if(this.g&&!this.h)l="/"+l;else{var w=o.h.lastIndexOf("/");w!=-1&&(l=o.h.slice(0,w+1)+l)}if(w=l,w==".."||w==".")l="";else if(w.indexOf("./")!=-1||w.indexOf("/.")!=-1){l=w.lastIndexOf("/",0)==0,w=w.split("/");const E=[];for(let T=0;T<w.length;){const P=w[T++];P=="."?l&&T==w.length&&E.push(""):P==".."?((E.length>1||E.length==1&&E[0]!="")&&E.pop(),l&&T==w.length&&E.push("")):(E.push(P),l=!0)}l=E.join("/")}else l=w}return a?o.h=l:a=i.i.toString()!=="",a?oi(o,Ur(i.i)):a=!!i.m,a&&(o.m=i.m),o};function ue(i){return new Re(i)}function kt(i,o,a){i.j=a?Nt(o,!0):o,i.j&&(i.j=i.j.replace(/:$/,""))}function Ot(i,o){if(o){if(o=Number(o),isNaN(o)||o<0)throw Error("Bad port number "+o);i.u=o}else i.u=null}function oi(i,o,a){o instanceof Lt?(i.i=o,ic(i.i,i.l)):(a||(o=Dt(o,tc)),i.i=new Lt(o,i.l))}function M(i,o,a){i.i.set(o,a)}function hn(i){return M(i,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),i}function Nt(i,o){return i?o?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function Dt(i,o,a){return typeof i=="string"?(i=encodeURI(i).replace(o,Qa),a&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function Qa(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Or=/[#\/\?@]/g,Za=/[#\?:]/g,ec=/[#\?]/g,tc=/[#\?@]/g,nc=/#/g;function Lt(i,o){this.h=this.g=null,this.i=i||null,this.j=!!o}function ze(i){i.g||(i.g=new Map,i.h=0,i.i&&Ya(i.i,function(o,a){i.add(decodeURIComponent(o.replace(/\+/g," ")),a)}))}n=Lt.prototype,n.add=function(i,o){ze(this),this.i=null,i=ut(this,i);let a=this.g.get(i);return a||this.g.set(i,a=[]),a.push(o),this.h+=1,this};function Nr(i,o){ze(i),o=ut(i,o),i.g.has(o)&&(i.i=null,i.h-=i.g.get(o).length,i.g.delete(o))}function Dr(i,o){return ze(i),o=ut(i,o),i.g.has(o)}n.forEach=function(i,o){ze(this),this.g.forEach(function(a,l){a.forEach(function(w){i.call(o,w,l,this)},this)},this)};function Lr(i,o){ze(i);let a=[];if(typeof o=="string")Dr(i,o)&&(a=a.concat(i.g.get(ut(i,o))));else for(i=Array.from(i.g.values()),o=0;o<i.length;o++)a=a.concat(i[o]);return a}n.set=function(i,o){return ze(this),this.i=null,i=ut(this,i),Dr(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[o]),this.h+=1,this},n.get=function(i,o){return i?(i=Lr(this,i),i.length>0?String(i[0]):o):o};function Mr(i,o,a){Nr(i,o),a.length>0&&(i.i=null,i.g.set(ut(i,o),x(a)),i.h+=a.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],o=Array.from(this.g.keys());for(let l=0;l<o.length;l++){var a=o[l];const w=Pt(a);a=Lr(this,a);for(let E=0;E<a.length;E++){let T=w;a[E]!==""&&(T+="="+Pt(a[E])),i.push(T)}}return this.i=i.join("&")};function Ur(i){const o=new Lt;return o.i=i.i,i.g&&(o.g=new Map(i.g),o.h=i.h),o}function ut(i,o){return o=String(o),i.j&&(o=o.toLowerCase()),o}function ic(i,o){o&&!i.j&&(ze(i),i.i=null,i.g.forEach(function(a,l){const w=l.toLowerCase();l!=w&&(Nr(this,l),Mr(this,w,a))},i)),i.j=o}function rc(i,o){const a=new Ct;if(h.Image){const l=new Image;l.onload=b(ke,a,"TestLoadImage: loaded",!0,o,l),l.onerror=b(ke,a,"TestLoadImage: error",!1,o,l),l.onabort=b(ke,a,"TestLoadImage: abort",!1,o,l),l.ontimeout=b(ke,a,"TestLoadImage: timeout",!1,o,l),h.setTimeout(function(){l.ontimeout&&l.ontimeout()},1e4),l.src=i}else o(!1)}function sc(i,o){const a=new Ct,l=new AbortController,w=setTimeout(()=>{l.abort(),ke(a,"TestPingServer: timeout",!1,o)},1e4);fetch(i,{signal:l.signal}).then(E=>{clearTimeout(w),E.ok?ke(a,"TestPingServer: ok",!0,o):ke(a,"TestPingServer: server error",!1,o)}).catch(()=>{clearTimeout(w),ke(a,"TestPingServer: error",!1,o)})}function ke(i,o,a,l,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),l(a)}catch{}}function oc(){this.g=new ja}function ai(i){this.i=i.Sb||null,this.h=i.ab||!1}S(ai,pr),ai.prototype.g=function(){return new ln(this.i,this.h)};function ln(i,o){H.call(this),this.H=i,this.o=o,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}S(ln,H),n=ln.prototype,n.open=function(i,o){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=i,this.D=o,this.readyState=1,Ut(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const o={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};i&&(o.body=i),(this.H||h).fetch(new Request(this.D,o)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Mt(this)),this.readyState=0},n.Pa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,Ut(this)),this.g&&(this.readyState=3,Ut(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof h.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;xr(this)}else i.text().then(this.Oa.bind(this),this.ga.bind(this))};function xr(i){i.j.read().then(i.Ma.bind(i)).catch(i.ga.bind(i))}n.Ma=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var o=i.value?i.value:new Uint8Array(0);(o=this.B.decode(o,{stream:!i.done}))&&(this.response=this.responseText+=o)}i.done?Mt(this):Ut(this),this.readyState==3&&xr(this)}},n.Oa=function(i){this.g&&(this.response=this.responseText=i,Mt(this))},n.Na=function(i){this.g&&(this.response=i,Mt(this))},n.ga=function(){this.g&&Mt(this)};function Mt(i){i.readyState=4,i.l=null,i.j=null,i.B=null,Ut(i)}n.setRequestHeader=function(i,o){this.A.append(i,o)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],o=this.h.entries();for(var a=o.next();!a.done;)a=a.value,i.push(a[0]+": "+a[1]),a=o.next();return i.join(`\r
`)};function Ut(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(ln.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Fr(i){let o="";return sn(i,function(a,l){o+=l,o+=":",o+=a,o+=`\r
`}),o}function ci(i,o,a){e:{for(l in a){var l=!1;break e}l=!0}l||(a=Fr(a),typeof i=="string"?a!=null&&Pt(a):M(i,o,a))}function F(i){H.call(this),this.headers=new Map,this.L=i||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}S(F,H);var ac=/^https?$/i,cc=["POST","PUT"];n=F.prototype,n.Fa=function(i){this.H=i},n.ea=function(i,o,a,l){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);o=o?o.toUpperCase():"GET",this.D=i,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():wr.g(),this.g.onreadystatechange=A(v(this.Ca,this));try{this.B=!0,this.g.open(o,String(i),!0),this.B=!1}catch(E){Vr(this,E);return}if(i=a||"",a=new Map(this.headers),l)if(Object.getPrototypeOf(l)===Object.prototype)for(var w in l)a.set(w,l[w]);else if(typeof l.keys=="function"&&typeof l.get=="function")for(const E of l.keys())a.set(E,l.get(E));else throw Error("Unknown input type for opt_headers: "+String(l));l=Array.from(a.keys()).find(E=>E.toLowerCase()=="content-type"),w=h.FormData&&i instanceof h.FormData,!(Array.prototype.indexOf.call(cc,o,void 0)>=0)||l||w||a.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[E,T]of a)this.g.setRequestHeader(E,T);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(i),this.v=!1}catch(E){Vr(this,E)}};function Vr(i,o){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=o,i.o=5,jr(i),un(i)}function jr(i){i.A||(i.A=!0,W(i,"complete"),W(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=i||7,W(this,"complete"),W(this,"abort"),un(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),un(this,!0)),F.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?Br(this):this.Xa())},n.Xa=function(){Br(this)};function Br(i){if(i.h&&typeof c<"u"){if(i.v&&Oe(i)==4)setTimeout(i.Ca.bind(i),0);else if(W(i,"readystatechange"),Oe(i)==4){i.h=!1;try{const E=i.ca();e:switch(E){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var o=!0;break e;default:o=!1}var a;if(!(a=o)){var l;if(l=E===0){let T=String(i.D).match(kr)[1]||null;!T&&h.self&&h.self.location&&(T=h.self.location.protocol.slice(0,-1)),l=!ac.test(T?T.toLowerCase():"")}a=l}if(a)W(i,"complete"),W(i,"success");else{i.o=6;try{var w=Oe(i)>2?i.g.statusText:""}catch{w=""}i.l=w+" ["+i.ca()+"]",jr(i)}}finally{un(i)}}}}function un(i,o){if(i.g){i.m&&(clearTimeout(i.m),i.m=null);const a=i.g;i.g=null,o||W(i,"ready");try{a.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function Oe(i){return i.g?i.g.readyState:0}n.ca=function(){try{return Oe(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(i){if(this.g){var o=this.g.responseText;return i&&o.indexOf(i)==0&&(o=o.substring(i.length)),Va(o)}};function $r(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.F){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function hc(i){const o={};i=(i.g&&Oe(i)>=2&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let l=0;l<i.length;l++){if(d(i[l]))continue;var a=Ga(i[l]);const w=a[0];if(a=a[1],typeof a!="string")continue;a=a.trim();const E=o[w]||[];o[w]=E,E.push(a)}Da(o,function(l){return l.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function xt(i,o,a){return a&&a.internalChannelParams&&a.internalChannelParams[i]||o}function Hr(i){this.za=0,this.i=[],this.j=new Ct,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=xt("failFast",!1,i),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=xt("baseRetryDelayMs",5e3,i),this.Za=xt("retryDelaySeedMs",1e4,i),this.Ta=xt("forwardChannelMaxRetries",2,i),this.va=xt("forwardChannelRequestTimeoutMs",2e4,i),this.ma=i&&i.xmlHttpFactory||void 0,this.Ua=i&&i.Rb||void 0,this.Aa=i&&i.useFetchStreams||!1,this.O=void 0,this.L=i&&i.supportsCrossDomainXhr||!1,this.M="",this.h=new Sr(i&&i.concurrentRequestLimit),this.Ba=new oc,this.S=i&&i.fastHandshake||!1,this.R=i&&i.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=i&&i.Pb||!1,i&&i.ua&&this.j.ua(),i&&i.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&i&&i.detectBufferingProxy||!1,this.ia=void 0,i&&i.longPollingTimeout&&i.longPollingTimeout>0&&(this.ia=i.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=Hr.prototype,n.ka=8,n.I=1,n.connect=function(i,o,a,l){q(0),this.W=i,this.H=o||{},a&&l!==void 0&&(this.H.OSID=a,this.H.OAID=l),this.F=this.X,this.J=Qr(this,null,this.W),fn(this)};function hi(i){if(Wr(i),i.I==3){var o=i.V++,a=ue(i.J);if(M(a,"SID",i.M),M(a,"RID",o),M(a,"TYPE","terminate"),Ft(i,a),o=new Pe(i,i.j,o),o.M=2,o.A=hn(ue(a)),a=!1,h.navigator&&h.navigator.sendBeacon)try{a=h.navigator.sendBeacon(o.A.toString(),"")}catch{}!a&&h.Image&&(new Image().src=o.A,a=!0),a||(o.g=Zr(o.j,null),o.g.ea(o.A)),o.F=Date.now(),cn(o)}Yr(i)}function dn(i){i.g&&(ui(i),i.g.cancel(),i.g=null)}function Wr(i){dn(i),i.v&&(h.clearTimeout(i.v),i.v=null),pn(i),i.h.cancel(),i.m&&(typeof i.m=="number"&&h.clearTimeout(i.m),i.m=null)}function fn(i){if(!br(i.h)&&!i.m){i.m=!0;var o=i.Ea;Ce||u(),te||(Ce(),te=!0),y.add(o,i),i.D=0}}function lc(i,o){return Cr(i.h)>=i.h.j-(i.m?1:0)?!1:i.m?(i.i=o.G.concat(i.i),!0):i.I==1||i.I==2||i.D>=(i.Sa?0:i.Ta)?!1:(i.m=bt(v(i.Ea,i,o),Xr(i,i.D)),i.D++,!0)}n.Ea=function(i){if(this.m)if(this.m=null,this.I==1){if(!i){this.V=Math.floor(Math.random()*1e5),i=this.V++;const w=new Pe(this,this.j,i);let E=this.o;if(this.U&&(E?(E=rr(E),or(E,this.U)):E=this.U),this.u!==null||this.R||(w.J=E,E=null),this.S)e:{for(var o=0,a=0;a<this.i.length;a++){t:{var l=this.i[a];if("__data__"in l.map&&(l=l.map.__data__,typeof l=="string")){l=l.length;break t}l=void 0}if(l===void 0)break;if(o+=l,o>4096){o=a;break e}if(o===4096||a===this.i.length-1){o=a+1;break e}}o=1e3}else o=1e3;o=zr(this,w,o),a=ue(this.J),M(a,"RID",i),M(a,"CVER",22),this.G&&M(a,"X-HTTP-Session-Id",this.G),Ft(this,a),E&&(this.R?o="headers="+Pt(Fr(E))+"&"+o:this.u&&ci(a,this.u,E)),si(this.h,w),this.Ra&&M(a,"TYPE","init"),this.S?(M(a,"$req",o),M(a,"SID","null"),w.U=!0,ti(w,a,null)):ti(w,a,o),this.I=2}}else this.I==3&&(i?qr(this,i):this.i.length==0||br(this.h)||qr(this))};function qr(i,o){var a;o?a=o.l:a=i.V++;const l=ue(i.J);M(l,"SID",i.M),M(l,"RID",a),M(l,"AID",i.K),Ft(i,l),i.u&&i.o&&ci(l,i.u,i.o),a=new Pe(i,i.j,a,i.D+1),i.u===null&&(a.J=i.o),o&&(i.i=o.G.concat(i.i)),o=zr(i,a,1e3),a.H=Math.round(i.va*.5)+Math.round(i.va*.5*Math.random()),si(i.h,a),ti(a,l,o)}function Ft(i,o){i.H&&sn(i.H,function(a,l){M(o,l,a)}),i.l&&sn({},function(a,l){M(o,l,a)})}function zr(i,o,a){a=Math.min(i.i.length,a);const l=i.l?v(i.l.Ka,i.l,i):null;e:{var w=i.i;let P=-1;for(;;){const B=["count="+a];P==-1?a>0?(P=w[0].g,B.push("ofs="+P)):P=0:B.push("ofs="+P);let D=!0;for(let $=0;$<a;$++){var E=w[$].g;const de=w[$].map;if(E-=P,E<0)P=Math.max(0,w[$].g-100),D=!1;else try{E="req"+E+"_"||"";try{var T=de instanceof Map?de:Object.entries(de);for(const[Ke,Ne]of T){let De=Ne;f(Ne)&&(De=Kn(Ne)),B.push(E+Ke+"="+encodeURIComponent(De))}}catch(Ke){throw B.push(E+"type="+encodeURIComponent("_badmap")),Ke}}catch{l&&l(de)}}if(D){T=B.join("&");break e}}T=void 0}return i=i.i.splice(0,a),o.G=i,T}function Gr(i){if(!i.g&&!i.v){i.Y=1;var o=i.Da;Ce||u(),te||(Ce(),te=!0),y.add(o,i),i.A=0}}function li(i){return i.g||i.v||i.A>=3?!1:(i.Y++,i.v=bt(v(i.Da,i),Xr(i,i.A)),i.A++,!0)}n.Da=function(){if(this.v=null,Kr(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var i=4*this.T;this.j.info("BP detection timer enabled: "+i),this.B=bt(v(this.Wa,this),i)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,q(10),dn(this),Kr(this))};function ui(i){i.B!=null&&(h.clearTimeout(i.B),i.B=null)}function Kr(i){i.g=new Pe(i,i.j,"rpc",i.Y),i.u===null&&(i.g.J=i.o),i.g.P=0;var o=ue(i.na);M(o,"RID","rpc"),M(o,"SID",i.M),M(o,"AID",i.K),M(o,"CI",i.F?"0":"1"),!i.F&&i.ia&&M(o,"TO",i.ia),M(o,"TYPE","xmlhttp"),Ft(i,o),i.u&&i.o&&ci(o,i.u,i.o),i.O&&(i.g.H=i.O);var a=i.g;i=i.ba,a.M=1,a.A=hn(ue(o)),a.u=null,a.R=!0,vr(a,i)}n.Va=function(){this.C!=null&&(this.C=null,dn(this),li(this),q(19))};function pn(i){i.C!=null&&(h.clearTimeout(i.C),i.C=null)}function Jr(i,o){var a=null;if(i.g==o){pn(i),ui(i),i.g=null;var l=2}else if(ri(i.h,o))a=o.G,Pr(i.h,o),l=1;else return;if(i.I!=0){if(o.o)if(l==1){a=o.u?o.u.length:0,o=Date.now()-o.F;var w=i.D;l=Yn(),W(l,new _r(l,a)),fn(i)}else Gr(i);else if(w=o.m,w==3||w==0&&o.X>0||!(l==1&&lc(i,o)||l==2&&li(i)))switch(a&&a.length>0&&(o=i.h,o.i=o.i.concat(a)),w){case 1:Ge(i,5);break;case 4:Ge(i,10);break;case 3:Ge(i,6);break;default:Ge(i,2)}}}function Xr(i,o){let a=i.Qa+Math.floor(Math.random()*i.Za);return i.isActive()||(a*=2),a*o}function Ge(i,o){if(i.j.info("Error code "+o),o==2){var a=v(i.bb,i),l=i.Ua;const w=!l;l=new Re(l||"//www.google.com/images/cleardot.gif"),h.location&&h.location.protocol=="http"||kt(l,"https"),hn(l),w?rc(l.toString(),a):sc(l.toString(),a)}else q(2);i.I=0,i.l&&i.l.pa(o),Yr(i),Wr(i)}n.bb=function(i){i?(this.j.info("Successfully pinged google.com"),q(2)):(this.j.info("Failed to ping google.com"),q(1))};function Yr(i){if(i.I=0,i.ja=[],i.l){const o=Rr(i.h);(o.length!=0||i.i.length!=0)&&(L(i.ja,o),L(i.ja,i.i),i.h.i.length=0,x(i.i),i.i.length=0),i.l.oa()}}function Qr(i,o,a){var l=a instanceof Re?ue(a):new Re(a);if(l.g!="")o&&(l.g=o+"."+l.g),Ot(l,l.u);else{var w=h.location;l=w.protocol,o=o?o+"."+w.hostname:w.hostname,w=+w.port;const E=new Re(null);l&&kt(E,l),o&&(E.g=o),w&&Ot(E,w),a&&(E.h=a),l=E}return a=i.G,o=i.wa,a&&o&&M(l,a,o),M(l,"VER",i.ka),Ft(i,l),l}function Zr(i,o,a){if(o&&!i.L)throw Error("Can't create secondary domain capable XhrIo object.");return o=i.Aa&&!i.ma?new F(new ai({ab:a})):new F(i.ma),o.Fa(i.L),o}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function es(){}n=es.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function ne(i,o){H.call(this),this.g=new Hr(o),this.l=i,this.h=o&&o.messageUrlParams||null,i=o&&o.messageHeaders||null,o&&o.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=o&&o.initMessageHeaders||null,o&&o.messageContentType&&(i?i["X-WebChannel-Content-Type"]=o.messageContentType:i={"X-WebChannel-Content-Type":o.messageContentType}),o&&o.sa&&(i?i["X-WebChannel-Client-Profile"]=o.sa:i={"X-WebChannel-Client-Profile":o.sa}),this.g.U=i,(i=o&&o.Qb)&&!d(i)&&(this.g.u=i),this.A=o&&o.supportsCrossDomainXhr||!1,this.v=o&&o.sendRawJson||!1,(o=o&&o.httpSessionIdParam)&&!d(o)&&(this.g.G=o,i=this.h,i!==null&&o in i&&(i=this.h,o in i&&delete i[o])),this.j=new dt(this)}S(ne,H),ne.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},ne.prototype.close=function(){hi(this.g)},ne.prototype.o=function(i){var o=this.g;if(typeof i=="string"){var a={};a.__data__=i,i=a}else this.v&&(a={},a.__data__=Kn(i),i=a);o.i.push(new Xa(o.Ya++,i)),o.I==3&&fn(o)},ne.prototype.N=function(){this.g.l=null,delete this.j,hi(this.g),delete this.g,ne.Z.N.call(this)};function ts(i){Jn.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var o=i.__sm__;if(o){e:{for(const a in o){i=a;break e}i=void 0}(this.i=i)&&(i=this.i,o=o!==null&&i in o?o[i]:void 0),this.data=o}else this.data=i}S(ts,Jn);function ns(){Xn.call(this),this.status=1}S(ns,Xn);function dt(i){this.g=i}S(dt,es),dt.prototype.ra=function(){W(this.g,"a")},dt.prototype.qa=function(i){W(this.g,new ts(i))},dt.prototype.pa=function(i){W(this.g,new ns)},dt.prototype.oa=function(){W(this.g,"b")},ne.prototype.send=ne.prototype.o,ne.prototype.open=ne.prototype.m,ne.prototype.close=ne.prototype.close,Qn.NO_ERROR=0,Qn.TIMEOUT=8,Qn.HTTP_ERROR=6,za.COMPLETE="complete",Ba.EventType=At,At.OPEN="a",At.CLOSE="b",At.ERROR="c",At.MESSAGE="d",H.prototype.listen=H.prototype.J,F.prototype.listenOnce=F.prototype.K,F.prototype.getLastError=F.prototype.Ha,F.prototype.getLastErrorCode=F.prototype.ya,F.prototype.getStatus=F.prototype.ca,F.prototype.getResponseJson=F.prototype.La,F.prototype.getResponseText=F.prototype.la,F.prototype.send=F.prototype.ea,F.prototype.setWithCredentials=F.prototype.Fa}).apply(typeof yn<"u"?yn:typeof self<"u"?self:typeof window<"u"?window:{});const Hs="@firebase/firestore",Ws="4.9.3";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}z.UNAUTHENTICATED=new z(null),z.GOOGLE_CREDENTIALS=new z("google-credentials-uid"),z.FIRST_PARTY=new z("first-party-uid"),z.MOCK_USER=new z("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tn="12.7.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const It=new Mn("@firebase/firestore");function ae(n,...e){if(It.logLevel<=N.DEBUG){const t=e.map(er);It.debug(`Firestore (${tn}): ${n}`,...t)}}function Ta(n,...e){if(It.logLevel<=N.ERROR){const t=e.map(er);It.error(`Firestore (${tn}): ${n}`,...t)}}function Pf(n,...e){if(It.logLevel<=N.WARN){const t=e.map(er);It.warn(`Firestore (${tn}): ${n}`,...t)}}function er(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kt(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,Aa(n,r,t)}function Aa(n,e,t){let r=`FIRESTORE (${tn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw Ta(r),new Error(r)}function Ht(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||Aa(e,s,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class O extends le{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sa{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Rf{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(z.UNAUTHENTICATED))}shutdown(){}}class kf{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Of{constructor(e){this.t=e,this.currentUser=z.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Ht(this.o===void 0,42304);let r=this.i;const s=m=>this.i!==r?(r=this.i,t(m)):Promise.resolve();let c=new Wt;this.o=()=>{this.i++,this.currentUser=this.u(),c.resolve(),c=new Wt,e.enqueueRetryable(()=>s(this.currentUser))};const h=()=>{const m=c;e.enqueueRetryable(async()=>{await m.promise,await s(this.currentUser)})},f=m=>{ae("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=m,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit(m=>f(m)),setTimeout(()=>{if(!this.auth){const m=this.t.getImmediate({optional:!0});m?f(m):(ae("FirebaseAuthCredentialsProvider","Auth not yet detected"),c.resolve(),c=new Wt)}},0),h()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(ae("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Ht(typeof r.accessToken=="string",31837,{l:r}),new Sa(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Ht(e===null||typeof e=="string",2055,{h:e}),new z(e)}}class Nf{constructor(e,t,r){this.P=e,this.T=t,this.I=r,this.type="FirstParty",this.user=z.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class Df{constructor(e,t,r){this.P=e,this.T=t,this.I=r}getToken(){return Promise.resolve(new Nf(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(z.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class qs{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Lf{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,ie(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Ht(this.o===void 0,3512);const r=c=>{c.error!=null&&ae("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${c.error.message}`);const h=c.token!==this.m;return this.m=c.token,ae("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?t(c.token):Promise.resolve()};this.o=c=>{e.enqueueRetryable(()=>r(c))};const s=c=>{ae("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=c,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(c=>s(c)),setTimeout(()=>{if(!this.appCheck){const c=this.V.getImmediate({optional:!0});c?s(c):ae("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new qs(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(Ht(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new qs(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mf(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uf{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=Mf(40);for(let c=0;c<s.length;++c)r.length<20&&s[c]<t&&(r+=e.charAt(s[c]%62))}return r}}function $e(n,e){return n<e?-1:n>e?1:0}function xf(n,e){const t=Math.min(n.length,e.length);for(let r=0;r<t;r++){const s=n.charAt(r),c=e.charAt(r);if(s!==c)return Ti(s)===Ti(c)?$e(s,c):Ti(s)?1:-1}return $e(n.length,e.length)}const Ff=55296,Vf=57343;function Ti(n){const e=n.charCodeAt(0);return e>=Ff&&e<=Vf}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zs="__name__";class fe{constructor(e,t,r){t===void 0?t=0:t>e.length&&Kt(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&Kt(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return fe.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof fe?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const c=fe.compareSegments(e.get(s),t.get(s));if(c!==0)return c}return $e(e.length,t.length)}static compareSegments(e,t){const r=fe.isNumericId(e),s=fe.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?fe.extractNumericId(e).compare(fe.extractNumericId(t)):xf(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Zi.fromString(e.substring(4,e.length-2))}}class se extends fe{construct(e,t,r){return new se(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new O(k.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(s=>s.length>0))}return new se(t)}static emptyPath(){return new se([])}}const jf=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Xe extends fe{construct(e,t,r){return new Xe(e,t,r)}static isValidIdentifier(e){return jf.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Xe.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===zs}static keyField(){return new Xe([zs])}static fromServerFormat(e){const t=[];let r="",s=0;const c=()=>{if(r.length===0)throw new O(k.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let h=!1;for(;s<e.length;){const f=e[s];if(f==="\\"){if(s+1===e.length)throw new O(k.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const m=e[s+1];if(m!=="\\"&&m!=="."&&m!=="`")throw new O(k.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=m,s+=2}else f==="`"?(h=!h,s++):f!=="."||h?(r+=f,s++):(c(),s++)}if(c(),h)throw new O(k.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Xe(t)}static emptyPath(){return new Xe([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qe{constructor(e){this.path=e}static fromPath(e){return new Qe(se.fromString(e))}static fromName(e){return new Qe(se.fromString(e).popFirst(5))}static empty(){return new Qe(se.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&se.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return se.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new Qe(new se(e.slice()))}}function Bf(n,e,t,r){if(e===!0&&r===!0)throw new O(k.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function $f(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Hf(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":Kt(12329,{type:typeof n})}function Wf(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new O(k.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Hf(n);throw new O(k.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j(n,e){const t={typeString:n};return e&&(t.value=e),t}function nn(n,e){if(!$f(n))throw new O(k.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const s=e[r].typeString,c="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const h=n[r];if(s&&typeof h!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(c!==void 0&&h!==c.value){t=`Expected '${r}' field to equal '${c.value}'`;break}}if(t)throw new O(k.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gs=-62135596800,Ks=1e6;class pe{static now(){return pe.fromMillis(Date.now())}static fromDate(e){return pe.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*Ks);return new pe(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new O(k.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new O(k.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Gs)throw new O(k.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new O(k.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Ks}_compareTo(e){return this.seconds===e.seconds?$e(this.nanoseconds,e.nanoseconds):$e(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:pe._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(nn(e,pe._jsonSchema))return new pe(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Gs;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}pe._jsonSchemaVersion="firestore/timestamp/1.0",pe._jsonSchema={type:j("string",pe._jsonSchemaVersion),seconds:j("number"),nanoseconds:j("number")};function qf(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zf extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(c){throw typeof DOMException<"u"&&c instanceof DOMException?new zf("Invalid base64 string: "+c):c}}(e);return new st(t)}static fromUint8Array(e){const t=function(s){let c="";for(let h=0;h<s.length;++h)c+=String.fromCharCode(s[h]);return c}(e);return new st(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return $e(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}st.EMPTY_BYTE_STRING=new st("");const Mi="(default)";class Ln{constructor(e,t){this.projectId=e,this.database=t||Mi}static empty(){return new Ln("","")}get isDefaultDatabase(){return this.database===Mi}isEqual(e){return e instanceof Ln&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gf{constructor(e,t=null,r=[],s=[],c=null,h="F",f=null,m=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=c,this.limitType=h,this.startAt=f,this.endAt=m,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function Kf(n){return new Gf(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Js,R;(R=Js||(Js={}))[R.OK=0]="OK",R[R.CANCELLED=1]="CANCELLED",R[R.UNKNOWN=2]="UNKNOWN",R[R.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",R[R.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",R[R.NOT_FOUND=5]="NOT_FOUND",R[R.ALREADY_EXISTS=6]="ALREADY_EXISTS",R[R.PERMISSION_DENIED=7]="PERMISSION_DENIED",R[R.UNAUTHENTICATED=16]="UNAUTHENTICATED",R[R.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",R[R.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",R[R.ABORTED=10]="ABORTED",R[R.OUT_OF_RANGE=11]="OUT_OF_RANGE",R[R.UNIMPLEMENTED=12]="UNIMPLEMENTED",R[R.INTERNAL=13]="INTERNAL",R[R.UNAVAILABLE=14]="UNAVAILABLE",R[R.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Zi([4294967295,4294967295],0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jf=41943040;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xf=1048576;function Ai(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yf{constructor(e,t,r=1e3,s=1.5,c=6e4){this.Mi=e,this.timerId=t,this.d_=r,this.A_=s,this.R_=c,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(e){this.cancel();const t=Math.floor(this.V_+this.y_()),r=Math.max(0,Date.now()-this.f_),s=Math.max(0,t-r);s>0&&ae("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,s,()=>(this.f_=Date.now(),e())),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tr{constructor(e,t,r,s,c){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=c,this.deferred=new Wt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(h=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,c){const h=Date.now()+r,f=new tr(e,t,h,s,c);return f.start(r),f}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new O(k.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var Xs,Ys;(Ys=Xs||(Xs={})).Ma="default",Ys.Cache="cache";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qf(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qs=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ba="firestore.googleapis.com",Zs=!0;class eo{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new O(k.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=ba,this.ssl=Zs}else this.host=e.host,this.ssl=e.ssl??Zs;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Jf;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Xf)throw new O(k.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Bf("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Qf(e.experimentalLongPollingOptions??{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new O(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new O(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new O(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Ca{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new eo({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new O(k.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new O(k.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new eo(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new Rf;switch(r.type){case"firstParty":return new Df(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new O(k.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=Qs.get(t);r&&(ae("ComponentProvider","Removing Datastore"),Qs.delete(t),r.terminate())}(this),Promise.resolve()}}function Zf(n,e,t,r={}){var v;n=Wf(n,Ca);const s=Jt(e),c=n._getSettings(),h={...c,emulatorOptions:n._getEmulatorOptions()},f=`${e}:${t}`;s&&(uo(`https://${f}`),fo("Firestore",!0)),c.host!==ba&&c.host!==f&&Pf("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const m={...c,host:f,ssl:s,emulatorOptions:r};if(!Be(m,h)&&(n._setSettings(m),r.mockUserToken)){let b,S;if(typeof r.mockUserToken=="string")b=r.mockUserToken,S=z.MOCK_USER;else{b=Ec(r.mockUserToken,(v=n._app)==null?void 0:v.options.projectId);const A=r.mockUserToken.sub||r.mockUserToken.user_id;if(!A)throw new O(k.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");S=new z(A)}n._authCredentials=new kf(new Sa(b,S))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nr{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new nr(this.firestore,e,this._query)}}class ge{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ir(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ge(this.firestore,e,this._key)}toJSON(){return{type:ge._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(nn(t,ge._jsonSchema))return new ge(e,r||null,new Qe(se.fromString(t.referencePath)))}}ge._jsonSchemaVersion="firestore/documentReference/1.0",ge._jsonSchema={type:j("string",ge._jsonSchemaVersion),referencePath:j("string")};class ir extends nr{constructor(e,t,r){super(e,t,Kf(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ge(this.firestore,null,new Qe(e))}withConverter(e){return new ir(this.firestore,e,this._path)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const to="AsyncQueue";class no{constructor(e=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Yf(this,"async_queue_retry"),this._c=()=>{const r=Ai();r&&ae(to,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=e;const t=Ai();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=Ai();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise(()=>{});const t=new Wt;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Xu.push(e),this.lc()))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(e){if(!qf(e))throw e;ae(to,"Operation failed with retryable error: "+e)}this.Xu.length>0&&this.M_.p_(()=>this.lc())}}cc(e){const t=this.ac.then(()=>(this.rc=!0,e().catch(r=>{throw this.nc=r,this.rc=!1,Ta("INTERNAL UNHANDLED ERROR: ",io(r)),r}).then(r=>(this.rc=!1,r))));return this.ac=t,t}enqueueAfterDelay(e,t,r){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const s=tr.createAndSchedule(this,e,t,r,c=>this.hc(c));return this.tc.push(s),s}uc(){this.nc&&Kt(47125,{Pc:io(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then(()=>{this.tc.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()})}dc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function io(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class ep extends Ca{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new no,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new no(e),this._firestoreClient=void 0,await e}}}function dp(n,e){const t=typeof n=="object"?n:Fi(),r=typeof n=="string"?n:Mi,s=at(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const c=wc("firestore");c&&Zf(s,...c)}return s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we{constructor(e){this._byteString=e}static fromBase64String(e){try{return new we(st.fromBase64String(e))}catch(t){throw new O(k.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new we(st.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:we._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(nn(e,we._jsonSchema))return we.fromBase64String(e.bytes)}}we._jsonSchemaVersion="firestore/bytes/1.0",we._jsonSchema={type:j("string",we._jsonSchemaVersion),bytes:j("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pa{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new O(k.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Xe(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new O(k.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new O(k.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return $e(this._lat,e._lat)||$e(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Ze._jsonSchemaVersion}}static fromJSON(e){if(nn(e,Ze._jsonSchema))return new Ze(e.latitude,e.longitude)}}Ze._jsonSchemaVersion="firestore/geoPoint/1.0",Ze._jsonSchema={type:j("string",Ze._jsonSchemaVersion),latitude:j("number"),longitude:j("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,s){if(r.length!==s.length)return!1;for(let c=0;c<r.length;++c)if(r[c]!==s[c])return!1;return!0}(this._values,e._values)}toJSON(){return{type:et._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(nn(e,et._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(t=>typeof t=="number"))return new et(e.vectorValues);throw new O(k.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}et._jsonSchemaVersion="firestore/vectorValue/1.0",et._jsonSchema={type:j("string",et._jsonSchemaVersion),vectorValues:j("object")};const tp=new RegExp("[~\\*/\\[\\]]");function np(n,e,t){if(e.search(tp)>=0)throw ro(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n);try{return new Pa(...e.split("."))._internalPath}catch{throw ro(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n)}}function ro(n,e,t,r,s){let c=`Function ${e}() called with invalid data`;c+=". ";let h="";return new O(k.INVALID_ARGUMENT,c+n+h)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ra{constructor(e,t,r,s,c){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=c}get id(){return this._key.path.lastSegment()}get ref(){return new ge(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new ip(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(ka("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class ip extends Ra{data(){return super.data()}}function ka(n,e){return typeof e=="string"?np(n,e):e instanceof Pa?e._internalPath:e._delegate._internalPath}class _n{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class _t extends Ra{constructor(e,t,r,s,c,h){super(e,t,r,s,h),this._firestore=e,this._firestoreImpl=e,this.metadata=c}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Tn(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(ka("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new O(k.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=_t._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}_t._jsonSchemaVersion="firestore/documentSnapshot/1.0",_t._jsonSchema={type:j("string",_t._jsonSchemaVersion),bundleSource:j("string","DocumentSnapshot"),bundleName:j("string"),bundle:j("string")};class Tn extends _t{data(e={}){return super.data(e)}}class qt{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new _n(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new Tn(this._firestore,this._userDataWriter,r.key,r,new _n(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new O(k.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,c){if(s._snapshot.oldDocs.isEmpty()){let h=0;return s._snapshot.docChanges.map(f=>{const m=new Tn(s._firestore,s._userDataWriter,f.doc.key,f.doc,new _n(s._snapshot.mutatedKeys.has(f.doc.key),s._snapshot.fromCache),s.query.converter);return f.doc,{type:"added",doc:m,oldIndex:-1,newIndex:h++}})}{let h=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(f=>c||f.type!==3).map(f=>{const m=new Tn(s._firestore,s._userDataWriter,f.doc.key,f.doc,new _n(s._snapshot.mutatedKeys.has(f.doc.key),s._snapshot.fromCache),s.query.converter);let v=-1,b=-1;return f.type!==0&&(v=h.indexOf(f.doc.key),h=h.delete(f.doc.key)),f.type!==1&&(h=h.add(f.doc),b=h.indexOf(f.doc.key)),{type:rp(f.type),doc:m,oldIndex:v,newIndex:b}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new O(k.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=qt._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Uf.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],s=[];return this.docs.forEach(c=>{c._document!==null&&(t.push(c._document),r.push(this._userDataWriter.convertObjectMap(c._document.data.value.mapValue.fields,"previous")),s.push(c.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function rp(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Kt(61501,{type:n})}}qt._jsonSchemaVersion="firestore/querySnapshot/1.0",qt._jsonSchema={type:j("string",qt._jsonSchemaVersion),bundleSource:j("string","QuerySnapshot"),bundleName:j("string"),bundle:j("string")};(function(e,t=!0){(function(s){tn=s})(Et),_e(new ce("firestore",(r,{instanceIdentifier:s,options:c})=>{const h=r.getProvider("app").getImmediate(),f=new ep(new Of(r.getProvider("auth-internal")),new Lf(h,r.getProvider("app-check-internal")),function(v,b){if(!Object.prototype.hasOwnProperty.apply(v.options,["projectId"]))throw new O(k.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ln(v.options.projectId,b)}(h,s),h);return c={useFetchStreams:t,...c},f._setSettings(c),f},"PUBLIC").setMultipleInstances(!0)),re(Hs,Ws,e),re(Hs,Ws,"esm2020")})();export{ce as C,le as F,Ue as G,Et as S,_e as _,ie as a,Z as b,at as c,wc as d,Ec as e,xh as f,Fi as g,lp as h,Jt as i,dp as j,up as k,xe as l,sp as m,ap as n,cp as o,uo as p,op as q,re as r,hp as s,bf as t,fo as u};
//# sourceMappingURL=vendor-firebase-DuApojnn.js.map
