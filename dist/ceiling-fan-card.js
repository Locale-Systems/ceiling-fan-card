function t(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,f=globalThis,g=f.trustedTypes,_=g?g.emptyScript:"",m=f.reactiveElementPolyfillSupport,v=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!l(t,e),y={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);o?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=s;const n=o.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const n=this.constructor;if(!1===s&&(o=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??b)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,m?.({ReactiveElement:w}),(f.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,A=t=>t,E=x.trustedTypes,S=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+k,O=`<${P}>`,M=document,U=()=>M.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,D="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,z=/>/g,j=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,V=/"/g,I=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),F=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,K=M.createTreeWalker(M,129);function Y(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=H;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(r.lastIndex=h,l=r.exec(i),null!==l);)h=r.lastIndex,r===H?"!--"===l[1]?r=R:void 0!==l[1]?r=z:void 0!==l[2]?(I.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=j):void 0!==l[3]&&(r=j):r===j?">"===l[0]?(r=o??H,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?j:'"'===l[3]?V:L):r===V||r===L?r=j:r===R||r===z?r=H:(r=j,o=void 0);const d=r===j&&t[e+1].startsWith("/>")?" ":"";n+=r===H?i+O:c>=0?(s.push(a),i.slice(0,c)+C+i.slice(c)+k+d):i+k+(-2===c?e:d)}return[Y(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[l,c]=Z(t,e);if(this.el=G.createElement(l,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=c[n++],i=s.getAttribute(t).split(k),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?et:"?"===r[1]?it:"@"===r[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(I.test(s.tagName)){const t=s.textContent.split(k),e=t.length-1;if(e>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],U()),K.nextNode(),a.push({type:2,index:++o});s.append(t[e],U())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(k,t+1));)a.push({type:7,index:o}),t+=k.length-1}o++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===F)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=T(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=J(t,o._$AS(t,e.values),o,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??M).importNode(e,!0);K.currentNode=s;let o=K.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Q(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new ot(o,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(o=K.nextNode(),n++)}return K.currentNode=M,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),T(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new G(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new Q(this.O(U()),this.O(U()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=J(this,t,e,0),n=!T(t)||t!==this._$AH&&t!==F,n&&(this._$AH=t);else{const s=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=J(this,s[i+r],e,r),a===F&&(a=this._$AH[r]),n||=!T(a)||a!==this._$AH[r],a===W?t=W:t!==W&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class st extends tt{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??W)===F)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const nt=x.litHtmlPolyfillSupport;nt?.(G,Q),(x.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;let at=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new Q(e.insertBefore(U(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}};at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const lt=rt.litElementPolyfillSupport;lt?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.2");const ct=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:b},dt=(t=ht,e,i)=>{const{kind:s,metadata:o}=i;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ut(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return ut({...t,state:!0,attribute:!1})}const ft=1;let gt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const _t="important",mt=" !"+_t,vt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends gt{constructor(t){if(super(t),t.type!==ft||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith(mt);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?_t:""):i[t]=s}}return F}}),$t="ceiling-fan-card",bt="ceiling-fan-card-editor",yt=1,wt=2,xt=4,At=["unavailable","unknown"],Et=(t,e,i)=>Math.min(i,Math.max(e,t)),St=(t,e)=>0!==((t?.attributes.supported_features??0)&e),Ct=t=>!0===t?.attributes.oscillating,kt=t=>!t||At.includes(t.state),Pt=t=>{const e=Number(t?.attributes.percentage_step);return Number.isFinite(e)&&e>0&&e<=100?e:1},Ot=t=>Math.max(1,Math.round(100/t)),Mt=(t,e)=>t>=Ot(e)?100:Math.round(t*e*100)/100,Ut=t=>t?Et(Math.round(t/255*100),1,100):0,Tt=(t,e="auto")=>{if("auto"!==e)return e;if(!t)return!1;const i=t.attributes.supported_color_modes;return Array.isArray(i)&&i.length?i.some(t=>"onoff"!==t):void 0!==t.attributes.brightness},Nt=(t,e)=>t?.attributes.friendly_name??e,Dt=(t,e,i)=>{t.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))};let Ht=class extends at{constructor(){super(...arguments),this.value=0,this.min=0,this.max=100,this.step=1,this.disabled=!1,this.inactive=!1,this.ticks=!1,this.label="",this.valueText=""}get _current(){return this._dragValue??this.value}get _stepCount(){return Math.round((this.max-this.min)/this.step)}_snap(t){const e=Et(Math.round((t-this.min)/this.step),0,this._stepCount);return e===this._stepCount?this.max:Math.round(100*(this.min+e*this.step))/100}_fraction(t){const e=this.max-this.min;return e<=0?1:Et((t-this.min)/e,0,1)}_valueFromPointer(t){const e=this._slider.getBoundingClientRect(),i=this._thumbWidth(),s=Math.max(1,e.width-i),o=Et((t.clientX-e.left-i/2)/s,0,1);return this._snap(this.min+o*(this.max-this.min))}_thumbWidth(){const t=getComputedStyle(this).getPropertyValue("--cfc-slider-thumb-width");return parseFloat(t)||56}_onPointerDown(t){this.disabled||"mouse"===t.pointerType&&0!==t.button||(t.preventDefault(),this._slider.setPointerCapture(t.pointerId),this._slider.focus({preventScroll:!0}),this._setDrag(this._valueFromPointer(t)))}_onPointerMove(t){void 0!==this._dragValue&&this._setDrag(this._valueFromPointer(t))}_onPointerUp(t){if(void 0===this._dragValue)return;const e=this._dragValue;this._dragValue=void 0,this._slider.hasPointerCapture(t.pointerId)&&this._slider.releasePointerCapture(t.pointerId),this.value=e,Dt(this,"value-changed",{value:e})}_setDrag(t){t!==this._dragValue&&(this._dragValue=t,Dt(this,"value-changing",{value:t}))}_onKeyDown(t){if(this.disabled)return;const e=Math.max(this.step,(this.max-this.min)/10);let i;switch(t.key){case"ArrowRight":case"ArrowUp":i=this._current+this.step;break;case"ArrowLeft":case"ArrowDown":i=this._current-this.step;break;case"PageUp":i=this._current+e;break;case"PageDown":i=this._current-e;break;case"Home":i=this.min;break;case"End":i=this.max;break;default:return}t.preventDefault();const s=this._snap(i);(s!==this.value||this.inactive)&&(this.value=s,Dt(this,"value-changed",{value:s}))}willUpdate(t){t.has("disabled")&&this.disabled&&(this._dragValue=void 0)}render(){const t=this._fraction(this._current),e=this.ticks&&this._stepCount>0&&this._stepCount<=10;return B`
      <div
        class="slider ${void 0!==this._dragValue?"dragging":""}"
        role="slider"
        tabindex=${this.disabled?-1:0}
        aria-label=${this.label||W}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-valuenow=${this._current}
        aria-valuetext=${this.valueText||W}
        aria-disabled=${this.disabled?"true":"false"}
        style="--fraction: ${t}"
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @lostpointercapture=${this._onPointerUp}
        @keydown=${this._onKeyDown}
      >
        <div class="track"></div>
        ${e?B`<div class="ticks">
              ${Array.from({length:this._stepCount+1},(e,i)=>{const s=i/this._stepCount;return B`<span
                  class="tick ${s<=t?"covered":""}"
                  style="--pos: ${s}"
                ></span>`})}
            </div>`:W}
        <div class="fill"><div class="handle"></div></div>
      </div>
    `}};Ht.styles=r`
    :host {
      --cfc-slider-height: 72px;
      --cfc-slider-thumb-width: 56px;
      --cfc-slider-radius: 18px;
      --_color: var(--cfc-slider-color, var(--primary-color, #03a9f4));
      display: block;
      -webkit-tap-highlight-color: transparent;
    }
    :host([inactive]) {
      --_color: var(--cfc-slider-inactive-color, var(--disabled-color, #9e9e9e));
    }
    :host([disabled]) {
      opacity: 0.45;
      pointer-events: none;
    }
    .slider {
      position: relative;
      height: var(--cfc-slider-height);
      border-radius: var(--cfc-slider-radius);
      overflow: hidden;
      cursor: pointer;
      touch-action: none;
      user-select: none;
      outline: none;
      isolation: isolate;
    }
    .slider:focus-visible {
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--_color) 50%, transparent);
    }
    .track {
      position: absolute;
      inset: 0;
      background: var(--_color);
      opacity: 0.18;
    }
    .fill {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: calc(
        var(--cfc-slider-thumb-width) +
          (100% - var(--cfc-slider-thumb-width)) * var(--fraction)
      );
      background: var(--_color);
      border-radius: var(--cfc-slider-radius);
      transition: width 180ms ease-out, background-color 180ms;
    }
    .dragging .fill {
      transition: background-color 180ms;
    }
    .handle {
      position: absolute;
      top: 50%;
      right: calc(var(--cfc-slider-thumb-width) / 2 - 3px);
      width: 6px;
      height: 44%;
      transform: translateY(-50%);
      border-radius: 3px;
      background: var(--cfc-slider-handle-color, #fff);
      opacity: 0.9;
    }
    .ticks {
      position: absolute;
      inset: 0 calc(var(--cfc-slider-thumb-width) / 2);
      pointer-events: none;
      z-index: 1;
    }
    .tick {
      position: absolute;
      top: 50%;
      left: calc(100% * var(--pos));
      width: 6px;
      height: 6px;
      margin: -3px 0 0 -3px;
      border-radius: 50%;
      background: var(--_color);
      opacity: 0.7;
    }
    .tick.covered {
      background: var(--cfc-slider-handle-color, #fff);
      opacity: 0.55;
    }
  `,t([ut({type:Number})],Ht.prototype,"value",void 0),t([ut({type:Number})],Ht.prototype,"min",void 0),t([ut({type:Number})],Ht.prototype,"max",void 0),t([ut({type:Number})],Ht.prototype,"step",void 0),t([ut({type:Boolean,reflect:!0})],Ht.prototype,"disabled",void 0),t([ut({type:Boolean,reflect:!0})],Ht.prototype,"inactive",void 0),t([ut({type:Boolean})],Ht.prototype,"ticks",void 0),t([ut()],Ht.prototype,"label",void 0),t([ut({attribute:"value-text"})],Ht.prototype,"valueText",void 0),t([pt()],Ht.prototype,"_dragValue",void 0),t([function(t){return(e,i,s)=>((t,e,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,i),i))(e,i,{get(){return(e=>e.renderRoot?.querySelector(t)??null)(this)}})}(".slider")],Ht.prototype,"_slider",void 0),Ht=t([ct("cfc-big-slider")],Ht);const Rt=t=>{const e={},i=[];for(const[i,s]of Object.entries(t))/^light\d+$/.test(i)||""!==s&&void 0!==s&&(e[i]=s);for(let e=1;e<=2;e++){const s=t[`light${e}`];if(!s?.entity)continue;const o={entity:s.entity};s.name&&(o.name=s.name),s.icon&&(o.icon=s.icon),"true"===s.dimmable?o.dimmable=!0:"false"===s.dimmable&&(o.dimmable=!1),i.push(o)}return i.length&&(e.lights=i),!0===e.show_direction&&delete e.show_direction,!0===e.show_oscillation&&delete e.show_oscillation,!0===e.slider_turns_on&&delete e.slider_turns_on,e},zt=[{name:"fan",required:!0,selector:{entity:{filter:{domain:"fan"}}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{type:"grid",name:"",schema:[{name:"show_direction",selector:{boolean:{}}},{name:"show_oscillation",selector:{boolean:{}}},{name:"slider_turns_on",selector:{boolean:{}}}]},...Array.from({length:2},(t,e)=>{return{name:`light${i=e+1}`,type:"expandable",title:`Light ${i}`,icon:"mdi:lightbulb-outline",schema:[{name:"entity",selector:{entity:{filter:{domain:"light"}}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"dimmable",selector:{select:{mode:"dropdown",options:[{value:"auto",label:"Auto-detect"},{value:"true",label:"Yes (show brightness slider)"},{value:"false",label:"No (on/off only)"}]}}}]};var i})],jt={fan:"Fan entity",entity:"Light entity",name:"Name (optional)",icon:"Icon (optional)",show_direction:"Show direction control",show_oscillation:"Show oscillation control",slider_turns_on:"Speed slider turns fan on",dimmable:"Dimmable"},Lt={show_oscillation:"Only shown if the fan supports oscillation",slider_turns_on:"When off, moving the slider powers the fan on at that speed"};let Vt=class extends at{constructor(){super(...arguments),this._computeLabel=t=>jt[t.name]??t.name,this._computeHelper=t=>Lt[t.name]}setConfig(t){this._config=t}connectedCallback(){super.connectedCallback(),customElements.get("ha-form")||customElements.get("hui-entities-card")?.getConfigElement?.()}_valueChanged(t){t.stopPropagation();const e={...Rt(t.detail.value),type:this._config.type};Dt(this,"config-changed",{config:e})}render(){return this.hass&&this._config?B`
      <ha-form
        .hass=${this.hass}
        .data=${(t=>{const{lights:e=[],...i}=t,s={show_direction:!0,show_oscillation:!0,slider_turns_on:!0,...i};for(let t=0;t<2;t++){const i=e[t];s[`light${t+1}`]=i?{...i,dimmable:String(i.dimmable??"auto")}:{dimmable:"auto"}}return s})(this._config)}
        .schema=${zt}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:W}};Vt.styles=r`
    :host {
      display: block;
    }
  `,t([ut({attribute:!1})],Vt.prototype,"hass",void 0),t([pt()],Vt.prototype,"_config",void 0),Vt=t([ct(bt)],Vt);const It=r`
  :host {
    --cfc-gap: 16px;
    --cfc-button-size: 56px;
    --cfc-light-on-color: var(--state-light-on-color, #ffb300);
    --cfc-fan-on-color: var(--state-fan-on-color, var(--primary-color, #03a9f4));
  }
  ha-card {
    padding: var(--cfc-gap);
    display: flex;
    flex-direction: column;
    gap: var(--cfc-gap);
  }
  .section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .section + .section {
    border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
    padding-top: var(--cfc-gap);
  }
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: var(--cfc-button-size);
  }
  .icon {
    flex: none;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--_icon-color) 18%, transparent);
    color: var(--_icon-color);
    cursor: pointer;
    --_icon-color: var(--state-icon-color, var(--secondary-text-color, #888));
    --mdc-icon-size: 26px;
    transition: color 180ms, background-color 180ms;
  }
  .fan .icon.on {
    --_icon-color: var(--cfc-fan-on-color);
  }
  .light .icon.on {
    --_icon-color: var(--_light-color, var(--cfc-light-on-color));
  }
  .icon ha-icon {
    display: flex;
  }
  .fan .icon.on ha-icon {
    animation: spin var(--_spin-duration, 2s) linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .fan .icon.on ha-icon {
      animation: none;
    }
  }
  .info {
    flex: 1;
    min-width: 0;
  }
  .name {
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fan .name {
    font-size: 18px;
  }
  .state {
    font-size: 14px;
    line-height: 20px;
    color: var(--secondary-text-color);
  }
  .power {
    flex: none;
    display: grid;
    place-items: center;
    width: var(--cfc-button-size);
    height: var(--cfc-button-size);
    border: none;
    border-radius: 50%;
    padding: 0;
    cursor: pointer;
    font: inherit;
    color: var(--primary-text-color);
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    --mdc-icon-size: 28px;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 180ms, color 180ms, transform 80ms;
  }
  .power:active {
    transform: scale(0.94);
  }
  .power:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--primary-color) 50%, transparent);
    outline-offset: 2px;
  }
  .fan .power.on {
    background: var(--cfc-fan-on-color);
    color: var(--text-primary-color, #fff);
  }
  .light .power.on {
    background: var(--_light-color, var(--cfc-light-on-color));
    color: #000;
  }
  .power[disabled] {
    opacity: 0.45;
    cursor: default;
  }
  .light cfc-big-slider {
    --cfc-slider-color: var(--_light-color, var(--cfc-light-on-color));
    --cfc-slider-handle-color: rgba(0, 0, 0, 0.55);
  }
  .fan cfc-big-slider {
    --cfc-slider-color: var(--cfc-fan-on-color);
  }
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .direction {
    flex: 2 1 220px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    padding: 4px;
    border-radius: 16px;
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
  }
  .direction button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 48px;
    border: none;
    border-radius: 12px;
    background: transparent;
    color: var(--secondary-text-color);
    font: inherit;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 180ms, color 180ms;
  }
  .direction button.active {
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
  }
  .direction button:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--primary-color) 50%, transparent);
  }
  .direction button[disabled] {
    opacity: 0.45;
    cursor: default;
  }
  .oscillate {
    flex: 1 1 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 56px;
    border: none;
    border-radius: 16px;
    padding: 0 16px;
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    color: var(--secondary-text-color);
    font: inherit;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 180ms, color 180ms, transform 80ms;
  }
  .oscillate:active {
    transform: scale(0.97);
  }
  .oscillate.active {
    background: color-mix(in srgb, var(--cfc-fan-on-color) 20%, transparent);
    color: var(--cfc-fan-on-color);
  }
  .oscillate[disabled] {
    opacity: 0.45;
    cursor: default;
  }
  .oscillate[disabled]:active {
    transform: none;
  }
  .oscillate:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--primary-color) 50%, transparent);
    outline-offset: 2px;
  }
  .warning {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border-radius: 12px;
    color: var(--primary-text-color);
    background: color-mix(in srgb, var(--warning-color, #ffa600) 20%, transparent);
    font-size: 14px;
  }
`;console.info("%c CEILING-FAN-CARD %c v0.2.0 ","color: white; background: #03a9f4; font-weight: 700;","color: #03a9f4; background: white; font-weight: 700;");let Bt=class extends at{constructor(){super(...arguments),this._optimistic={},this._lastValue={},this._holdTimers={}}setConfig(t){if(!t?.fan)throw new Error("You must define a fan entity (fan: fan.xyz)");if("fan"!==t.fan.split(".")[0])throw new Error(`"${t.fan}" is not a fan entity`);if(void 0!==t.lights&&!Array.isArray(t.lights))throw new Error("lights must be a list");if((t.lights?.length??0)>2)throw new Error("At most 2 lights are supported");t.lights?.forEach((t,e)=>{if(!t?.entity)throw new Error(`lights[${e}] is missing an entity`)}),this._config={show_direction:!0,show_oscillation:!0,slider_turns_on:!0,...t,lights:t.lights??[]}}getCardSize(){const t=this._config?.lights??[];let e=3;(this._config?.show_direction||this._config?.show_oscillation)&&(e+=1);for(const i of t)e+=Tt(this.hass?.states[i.entity],i.dimmable)?2:1;return e}getGridOptions(){return{columns:12,min_columns:6}}static getConfigElement(){return document.createElement(bt)}static getStubConfig(t){const e=Object.keys(t.states),i=e.find(t=>t.startsWith("fan."))??"fan.ceiling_fan",s=e.find(t=>t.startsWith("light."));return{fan:i,lights:s?[{entity:s}]:[]}}shouldUpdate(t){if(t.size>1||!t.has("hass")||!this._config)return!0;const e=t.get("hass");return!e||!this.hass||this._entityIds().some(t=>e.states[t]!==this.hass.states[t])}willUpdate(){if(!this.hass||!this._config)return;const t=this.hass.states[this._config.fan];"on"===t?.state&&t.attributes.percentage>0&&(this._lastValue[this._config.fan]=t.attributes.percentage);for(const t of this._config.lights??[]){const e=Ut(this.hass.states[t.entity]?.attributes.brightness);e>0&&(this._lastValue[t.entity]=e)}}disconnectedCallback(){super.disconnectedCallback(),Object.values(this._holdTimers).forEach(t=>clearTimeout(t)),this._holdTimers={}}_entityIds(){return this._config?[this._config.fan,...(this._config.lights??[]).map(t=>t.entity)]:[]}_optimisticValue(t){const e=this._optimistic[t];return e&&e.until>Date.now()?e.value:void 0}_setOptimistic(t,e,i){clearTimeout(this._holdTimers[t]);const s=i?1/0:Date.now()+1500;this._optimistic={...this._optimistic,[t]:{value:e,until:s}},i||(this._holdTimers[t]=window.setTimeout(()=>{const{[t]:e,...i}=this._optimistic;this._optimistic=i},1500))}_call(t,e,i){this.hass?.callService(t,e,i).catch(i=>{console.error(`ceiling-fan-card: ${t}.${e} failed`,i)})}_toggleFan(){const t=this._fanState();t&&!kt(t)&&this._call("fan","on"===t.state?"turn_off":"turn_on",{entity_id:t.entity_id})}_fanSliderChanging(t){this._setOptimistic(this._config.fan,t.detail.value,!0)}_fanSliderChanged(t){const e=this._fanState();if(!e)return;const i=((t,e)=>{const i=Ot(e),s=Et(Math.round(t/e),1,i);return Mt(s,e)})(t.detail.value,Pt(e));this._setOptimistic(e.entity_id,i,!1),"on"===e.state?this._call("fan","set_percentage",{entity_id:e.entity_id,percentage:i}):this._call("fan","turn_on",{entity_id:e.entity_id,percentage:i})}_setDirection(t){const e=this._fanState();e&&e.attributes.direction!==t&&this._call("fan","set_direction",{entity_id:e.entity_id,direction:t})}_toggleOscillation(){const t=this._fanState();t&&!kt(t)&&"on"===t.state&&this._call("fan","oscillate",{entity_id:t.entity_id,oscillating:!Ct(t)})}_toggleLight(t){const e=this.hass?.states[t];e&&!kt(e)&&this._call("light","on"===e.state?"turn_off":"turn_on",{entity_id:t})}_lightSliderChanging(t,e){this._setOptimistic(t,e.detail.value,!0)}_lightSliderChanged(t,e){const i=Math.round(e.detail.value);this._setOptimistic(t,i,!1),this._call("light","turn_on",{entity_id:t,brightness_pct:i})}_moreInfo(t){Dt(this,"hass-more-info",{entityId:t})}_fanState(){return this._config?this.hass?.states[this._config.fan]:void 0}render(){return this._config&&this.hass?B`
      <ha-card>
        ${this._renderFan()}
        ${(this._config.lights??[]).map(t=>this._renderLight(t))}
      </ha-card>
    `:W}_renderWarning(t){return B`<div class="section">
      <div class="warning">
        <ha-icon icon="mdi:alert-outline"></ha-icon>
        Entity not found: ${t}
      </div>
    </div>`}_renderFan(){const t=this._config,e=this._fanState();if(!e)return this._renderWarning(t.fan);const i=kt(e),s="on"===e.state,o=Pt(e),n=Ot(o),r=St(e,yt)&&n>1,a=t.show_direction&&St(e,xt),l=t.show_oscillation&&St(e,wt),c=Ct(e),h=s?e.attributes.percentage??0:0,d=this._optimisticValue(e.entity_id)??(h>0?h:this._lastValue[e.entity_id]??Mt(1,o)),u=((t,e)=>t<=0?0:Et(Math.round(t/e),1,Ot(e)))(d,o),p=o>=5?`Speed ${u} of ${n}`:`${Math.round(d)}%`;let f;f=i?"Unavailable":s?r?`On · ${p}`:"On":"Off";const g=`${(2.2-d/100*1.8).toFixed(2)}s`,_=e.attributes.direction;return B`
      <div class="section fan">
        <div class="header">
          <div
            class="icon ${s?"on":""}"
            style=${vt({"--_spin-duration":g})}
            @click=${()=>this._moreInfo(e.entity_id)}
          >
            <ha-icon
              icon=${t.icon??e.attributes.icon??"mdi:ceiling-fan"}
              style=${"reverse"===_?"animation-direction: reverse":""}
            ></ha-icon>
          </div>
          <div class="info">
            <div class="name">${t.name??Nt(e,t.fan)}</div>
            <div class="state">${f}</div>
          </div>
          <button
            class="power ${s?"on":""}"
            ?disabled=${i}
            aria-label=${s?"Turn fan off":"Turn fan on"}
            aria-pressed=${s?"true":"false"}
            @click=${this._toggleFan}
          >
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
        </div>

        ${r&&!i?B`<cfc-big-slider
              label="Fan speed"
              .valueText=${p}
              .min=${Mt(1,o)}
              .max=${100}
              .step=${o}
              .value=${d}
              .ticks=${o>=5}
              .inactive=${!s}
              .disabled=${!s&&!t.slider_turns_on}
              @value-changing=${this._fanSliderChanging}
              @value-changed=${this._fanSliderChanged}
            ></cfc-big-slider>`:W}
        ${!a&&!l||i?W:B`<div class="controls">
              ${a?B`<div class="direction" role="group" aria-label="Fan direction">
                    ${this._renderDirectionButton("forward","Forward","mdi:rotate-right",_)}
                    ${this._renderDirectionButton("reverse","Reverse","mdi:rotate-left",_)}
                  </div>`:W}
              ${l?B`<button
                    class="oscillate ${c?"active":""}"
                    aria-pressed=${c?"true":"false"}
                    ?disabled=${!s}
                    title=${s?"":"Turn the fan on to change oscillation"}
                    @click=${this._toggleOscillation}
                  >
                    <ha-icon icon="mdi:arrow-oscillating"></ha-icon>Oscillate
                  </button>`:W}
            </div>`}
      </div>
    `}_renderDirectionButton(t,e,i,s){const o=s===t;return B`<button
      class=${o?"active":""}
      aria-pressed=${o?"true":"false"}
      @click=${()=>this._setDirection(t)}
    >
      <ha-icon icon=${i}></ha-icon>${e}
    </button>`}_renderLight(t){const e=this.hass.states[t.entity];if(!e)return this._renderWarning(t.entity);const i=kt(e),s="on"===e.state,o=Tt(e,t.dimmable??"auto"),n=s?Ut(e.attributes.brightness):0,r=this._optimisticValue(t.entity)??(n>0?n:this._lastValue[t.entity]??100);let a;a=i?"Unavailable":s?o?`On · ${Math.round(r)}%`:"On":"Off";const l=e.attributes.rgb_color,c=vt({"--_light-color":s&&l?`rgb(${l.join(",")})`:void 0});return B`
      <div class="section light" style=${c}>
        <div class="header">
          <div
            class="icon ${s?"on":""}"
            @click=${()=>this._moreInfo(t.entity)}
          >
            <ha-icon
              icon=${t.icon??e.attributes.icon??(s?"mdi:lightbulb":"mdi:lightbulb-outline")}
            ></ha-icon>
          </div>
          <div class="info">
            <div class="name">${t.name??Nt(e,t.entity)}</div>
            <div class="state">${a}</div>
          </div>
          <button
            class="power ${s?"on":""}"
            ?disabled=${i}
            aria-label=${s?"Turn light off":"Turn light on"}
            aria-pressed=${s?"true":"false"}
            @click=${()=>this._toggleLight(t.entity)}
          >
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
        </div>
        ${o&&!i?B`<cfc-big-slider
              label="Brightness"
              .valueText=${`${Math.round(r)}%`}
              .min=${1}
              .max=${100}
              .step=${1}
              .value=${r}
              .inactive=${!s}
              @value-changing=${e=>this._lightSliderChanging(t.entity,e)}
              @value-changed=${e=>this._lightSliderChanged(t.entity,e)}
            ></cfc-big-slider>`:W}
      </div>
    `}};Bt.styles=It,t([ut({attribute:!1})],Bt.prototype,"hass",void 0),t([pt()],Bt.prototype,"_config",void 0),t([pt()],Bt.prototype,"_optimistic",void 0),Bt=t([ct($t)],Bt),window.customCards=window.customCards??[],window.customCards.push({type:$t,name:"Ceiling Fan Card",description:"Control a ceiling fan's speed, direction and oscillation plus up to two lights.",preview:!0});export{Bt as CeilingFanCard};
