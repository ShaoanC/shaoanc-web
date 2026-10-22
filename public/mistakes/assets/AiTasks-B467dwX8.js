const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/AiTaskManager-CNFtqiVu.js","assets/rolldown-runtime-8BhlS34s.js","assets/jsx-runtime-D2hD0Hkr.js","assets/context-CEc0V9dW.js","assets/components-DirhZJyR.js","assets/MarkdownContent-Czp3JOCV.js","assets/ScrollArea-DFSFFYSG.js","assets/MarkdownContent-a_SoIC8g.css"])))=>i.map(i=>d[i]);
import{i as e,n as t}from"./rolldown-runtime-8BhlS34s.js";import{Ln as n,P as r,c as i,d as a,l as o,m as s,r as c,s as l,t as u}from"./jsx-runtime-D2hD0Hkr.js";import{n as d,t as f}from"./clsx-DNZXw_RA.js";import{a as p,n as m}from"./context-CEc0V9dW.js";import{J as h,K as g,c as _,gt as v,i as ee,n as y,t as b,u as x}from"./dialog-lXfx84qS.js";function S(e,t,n=300){let{scrollHeight:r,style:i}=e;requestAnimationFrame(()=>{i.minHeight=`initial`,i.height=r+`px`,i.transition=`all ${n}ms`,requestAnimationFrame(()=>{i.height=`0`,i.padding=`0`,i.margin=`0`,setTimeout(t,n)})})}function C({enter:e,exit:t,appendPosition:n=!1,collapse:r=!0,collapseDuration:i=300}){return function({children:a,position:o,preventExitTransition:s,done:c,nodeRef:l,isIn:u,playToast:d}){let f=n?`${e}--${o}`:e,p=n?`${t}--${o}`:t,m=(0,z.useRef)(0);return(0,z.useLayoutEffect)(()=>{let e=l.current,t=f.split(` `),n=r=>{r.target===l.current&&(d(),e.removeEventListener(`animationend`,n),e.removeEventListener(`animationcancel`,n),m.current===0&&r.type!==`animationcancel`&&e.classList.remove(...t))};e.classList.add(...t),e.addEventListener(`animationend`,n),e.addEventListener(`animationcancel`,n)},[]),(0,z.useEffect)(()=>{let e=l.current,t=()=>{e.removeEventListener(`animationend`,t),r?S(e,c,i):c()};u||(s?t():(m.current=1,e.className+=` ${p}`,e.addEventListener(`animationend`,t)))},[u]),z.createElement(z.Fragment,null,a)}}function w(e,t){return{content:T(e.content,e.props),containerId:e.props.containerId,id:e.props.toastId,theme:e.props.theme,type:e.props.type,data:e.props.data||{},isLoading:e.props.isLoading,icon:e.props.icon,reason:e.removalReason,status:t}}function T(e,t,n=!1){return(0,_e.isValidElement)(e)&&!G(e.type)?(0,_e.cloneElement)(e,{closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):K(e)?e({closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):e}function E({closeToast:e,theme:t,ariaLabel:n=`close`}){return ve.createElement(`button`,{className:`Toastify__close-button Toastify__close-button--${t}`,type:`button`,onClick:t=>{t.stopPropagation(),e(!0)},"aria-label":n},ve.createElement(`svg`,{"aria-hidden":`true`,viewBox:`0 0 14 16`},ve.createElement(`path`,{fillRule:`evenodd`,d:`M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z`})))}function D({delay:e,isRunning:t,closeToast:n,type:r=`default`,hide:i,className:a,controlledProgress:o,progress:s,rtl:c,isIn:l,theme:u}){let d=i||o&&s===0,p={animationDuration:`${e}ms`,animationPlayState:t?`running`:`paused`};o&&(p.transform=`scaleX(${s})`);let m=f(`Toastify__progress-bar`,o?`Toastify__progress-bar--controlled`:`Toastify__progress-bar--animated`,`Toastify__progress-bar-theme--${u}`,`Toastify__progress-bar--${r}`,{"Toastify__progress-bar--rtl":c}),h=K(a)?a({rtl:c,type:r,defaultClassName:m}):f(m,a),g={[o&&s>=1?`onTransitionEnd`:`onAnimationEnd`]:o&&s<1?null:()=>{l&&n()}};return ye.createElement(`div`,{className:`Toastify__progress-bar--wrp`,"data-hidden":d},ye.createElement(`div`,{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${u} Toastify__progress-bar--${r}`}),ye.createElement(`div`,{role:`progressbar`,"aria-hidden":d?`true`:`false`,"aria-label":`notification timer`,"aria-valuenow":o?Math.round(s*100):void 0,"aria-valuemin":0,"aria-valuemax":100,className:h,style:p,...g}))}function O(e,t,n){let r=1,i=0,a=[],o=[],s=t,c=new Map,l=new Set,u=e=>(l.add(e),()=>l.delete(e)),d=()=>{o=Array.from(c.values()),l.forEach(e=>e())},f=({containerId:t,toastId:n,updateId:r})=>{let i=t?t!==e:e!==1,a=c.has(n)&&r==null;return i||a},p=(e,t)=>{c.forEach(n=>{var r;(t==null||t===n.props.toastId)&&((r=n.toggle)==null||r.call(n,e))})},m=e=>{var t,r;e.isActive&&((r=(t=e.props)?.onClose)==null||r.call(t,e.removalReason),e.isActive=!1,n(w(e,`removed`)))},h=e=>{if(e==null)c.forEach(m);else{let t=c.get(e);t&&m(t)}d()},g=()=>{i-=a.length,a=[]},_=e=>{var t,r;let{toastId:i,updateId:a}=e.props,o=a==null;e.staleId&&c.delete(e.staleId),e.isActive=!0,c.set(i,e),d(),n(w(e,o?`added`:`updated`)),o&&((r=(t=e.props).onOpen)==null||r.call(t))};return{id:e,props:s,observe:u,toggle:p,removeToast:h,toasts:c,clearQueue:g,buildToast:(e,t)=>{if(f(t))return;let{toastId:n,updateId:o,data:l,staleId:u,delay:p}=t,m=o==null;m&&i++;let g={...s,style:s.toastStyle,key:r++,...Object.fromEntries(Object.entries(t).filter(([e,t])=>t!=null)),toastId:n,updateId:o,data:l,isIn:!1,className:we(t.className||s.toastClassName),progressClassName:we(t.progressClassName||s.progressClassName),autoClose:!t.isLoading&&Te(t.autoClose,s.autoClose),closeToast(e){let t=c.get(n);t&&(t.removalReason=e,h(n))},deleteToast(){if(c.get(n)!=null){if(c.delete(n),i--,i<0&&(i=0),a.length>0){_(a.shift());return}d()}}};g.closeButton=s.closeButton,t.closeButton===!1||Ee(t.closeButton)?g.closeButton=t.closeButton:t.closeButton===!0&&(g.closeButton=!Ee(s.closeButton)||s.closeButton);let v={content:e,props:g,staleId:u};s.limit&&s.limit>0&&i>s.limit&&m?a.push(v):W(p)?setTimeout(()=>{_(v)},p):_(v)},setProps(e){s=e},setToggle:(e,t)=>{let n=c.get(e);n&&(n.toggle=t)},isToastActive:e=>c.get(e)?.isActive,getSnapshot:()=>o}}function k(){J.forEach(e=>M(e.content,e.options)),J=[]}function A(e,t){var n;if(t)return!!((n=q.get(t))!=null&&n.isToastActive(e));let r=!1;return q.forEach(t=>{t.isToastActive(e)&&(r=!0)}),r}function j(e){if(!je()){J=J.filter(t=>e!=null&&t.options.toastId!==e);return}if(e==null||Ce(e))q.forEach(t=>{t.removeToast(e)});else if(e&&(`containerId`in e||`id`in e)){let t=q.get(e.containerId);t?t.removeToast(e.id):q.forEach(t=>{t.removeToast(e.id)})}}function M(e,t){Ee(e)&&(je()||J.push({content:e,options:t}),q.forEach(n=>{n.buildToast(e,t)}))}function N(e){var t;(t=q.get(e.containerId||1))==null||t.setToggle(e.id,e.fn)}function P(e,t){q.forEach(n=>{(t==null||!(t!=null&&t.containerId)||t?.containerId===n.id)&&n.toggle(e,t?.id)})}function F(e){let t=e.containerId||1;return{subscribe(n){let r=O(t,e,Ae);q.set(t,r);let i=r.observe(n);return k(),()=>{i(),q.delete(t)}},setProps(e){var n;(n=q.get(t))==null||n.setProps(e)},getSnapshot(){return q.get(t)?.getSnapshot()}}}function I(e){return ke.add(e),()=>{ke.delete(e)}}function te(e){return e&&(G(e.toastId)||W(e.toastId))?e.toastId:Oe()}function L(e,t){return M(e,t),t.toastId}function ne(e,t){return{...t,type:t&&t.type||e,toastId:te(t)}}function re(e){return(t,n)=>L(t,ne(e,n))}function R(e,t){return L(e,ne(`default`,t))}function ie(e,{pending:t,error:n,success:r},i){let a;t&&(a=G(t)?R.loading(t,i):R.loading(t.render,{...i,...t}));let o={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},s=(e,t,n)=>{if(t==null){R.dismiss(a);return}let r={type:e,...o,...i,data:n},s=G(t)?{render:t}:t;return a?R.update(a,{...r,...s}):R(s.render,{...r,...s}),n},c=K(e)?e():e;return c.then(e=>s(`success`,r,e)).catch(e=>s(`error`,n,e)),c}function ae(e){j(e)}function oe(e){let{subscribe:t,getSnapshot:n,setProps:r}=(0,be.useRef)(F(e)).current;r(e);let i=(0,be.useSyncExternalStore)(t,n,n)?.slice();function a(t){if(!i)return[];let n=new Map;return e.newestOnTop&&i.reverse(),i.forEach(e=>{let{position:t}=e.props;n.has(t)||n.set(t,[]),n.get(t).push(e)}),Array.from(n,e=>t(e[0],e[1]))}return{getToastToRender:a,isToastActive:A,count:i?.length}}function se(e){let[t,n]=(0,V.useState)(!1),[r,i]=(0,V.useState)(!1),a=(0,V.useRef)(null),o=(0,V.useRef)({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:s,pauseOnHover:c,closeToast:l,onClick:u,closeOnClick:d}=e;N({id:e.toastId,containerId:e.containerId,fn:n}),(0,V.useEffect)(()=>{if(e.pauseOnFocusLoss)return f(),()=>{p()}},[e.pauseOnFocusLoss]);function f(){document.hasFocus()||_(),window.addEventListener(`focus`,g),window.addEventListener(`blur`,_)}function p(){window.removeEventListener(`focus`,g),window.removeEventListener(`blur`,_)}function m(t){if(e.draggable===!0||e.draggable===t.pointerType){v();let n=a.current;o.canCloseOnClick=!0,o.canDrag=!0,n.style.transition=`none`,e.draggableDirection===`x`?(o.start=t.clientX,o.removalDistance=n.offsetWidth*(e.draggablePercent/100)):(o.start=t.clientY,o.removalDistance=n.offsetHeight*(e.draggablePercent===80?e.draggablePercent*1.5:e.draggablePercent)/100)}}function h(t){let{top:n,bottom:r,left:i,right:o}=a.current.getBoundingClientRect();t.pointerType===`mouse`&&e.pauseOnHover&&t.clientX>=i&&t.clientX<=o&&t.clientY>=n&&t.clientY<=r?_():g()}function g(){n(!0)}function _(){n(!1)}function v(){o.didMove=!1,document.addEventListener(`pointermove`,y),document.addEventListener(`pointerup`,b)}function ee(){document.removeEventListener(`pointermove`,y),document.removeEventListener(`pointerup`,b)}function y(n){let r=a.current;if(o.canDrag&&r){o.didMove=!0,t&&_(),e.draggableDirection===`x`?o.delta=n.clientX-o.start:o.delta=n.clientY-o.start,o.start!==n.clientX&&(o.canCloseOnClick=!1);let i=e.draggableDirection===`x`?`${o.delta}px, var(--y)`:`0, calc(${o.delta}px + var(--y))`;r.style.transform=`translate3d(${i},0)`,r.style.opacity=`${1-Math.abs(o.delta/o.removalDistance)}`}}function b(){ee();let t=a.current;if(o.canDrag&&o.didMove&&t){if(o.canDrag=!1,Math.abs(o.delta)>o.removalDistance){i(!0),e.closeToast(!0),e.collapseAll();return}t.style.transition=`transform 0.2s, opacity 0.2s`,t.style.removeProperty(`transform`),t.style.removeProperty(`opacity`)}}let x={onPointerDown:m,onPointerUp:h};return s&&c&&(x.onMouseEnter=_,e.stacked||(x.onMouseLeave=g)),d&&(x.onClick=e=>{u&&u(e),o.canCloseOnClick&&l(!0)}),{playToast:g,pauseToast:_,isRunning:t,preventExitTransition:r,toastRef:a,eventHandlers:x}}function ce(e){return U.createElement(Y,{...e},U.createElement(`path`,{d:`M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z`}))}function le(e){return U.createElement(Y,{...e},U.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z`}))}function ue(e){return U.createElement(Y,{...e},U.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z`}))}function de(e){return U.createElement(Y,{...e},U.createElement(`path`,{d:`M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z`}))}function fe(){return U.createElement(`div`,{className:`Toastify__spinner`})}function pe({theme:e,type:t,isLoading:n,icon:r}){let i=null,a={theme:e,type:t};return r===!1||(K(r)?i=r({...a,isLoading:n}):(0,U.isValidElement)(r)?i=(0,U.cloneElement)(r,a):n?i=Fe.spinner():Ie(t)&&(i=Fe[t](a))),i}function me(e){let t={...Be,...e},n=e.stacked,[r,i]=(0,B.useState)(!0),a=(0,B.useRef)(null),{getToastToRender:o,isToastActive:s,count:c}=oe(t),{className:l,style:u,rtl:d,containerId:p,hotKeys:m}=t;function h(e){let t=f(`Toastify__toast-container`,`Toastify__toast-container--${e}`,{"Toastify__toast-container--rtl":d});return K(l)?l({position:e,rtl:d,defaultClassName:t}):f(t,we(l))}function g(){n&&(i(!0),R.play())}return Pe(()=>{if(n){let e=a.current.querySelectorAll(`[data-in="true"]`),n=t.position?.includes(`top`),i=0,o=0;Array.from(e).reverse().forEach((e,t)=>{let a=e;a.classList.add(`Toastify__toast--stacked`),t>0&&(a.dataset.collapsed=`${r}`),a.dataset.pos||(a.dataset.pos=n?`top`:`bot`);let s=i*(r?.2:1)+(r?0:12*t),c=Math.max(.5,1-(r?o:0));a.style.setProperty(`--y`,`${n?s:s*-1}px`),a.style.setProperty(`--g`,`12`),a.style.setProperty(`--s`,`${c}`),i+=a.offsetHeight,o+=.025})}},[r,c,n]),(0,B.useEffect)(()=>{function e(e){var t;let n=a.current;m(e)&&((t=n?.querySelector(`[tabIndex="0"]`))==null||t.focus(),i(!1),R.pause()),e.key===`Escape`&&(document.activeElement===n||n!=null&&n.contains(document.activeElement))&&(i(!0),R.play())}return document.addEventListener(`keydown`,e),()=>{document.removeEventListener(`keydown`,e)}},[m]),B.createElement(`section`,{ref:a,className:`Toastify`,id:p,onMouseEnter:()=>{n&&(i(!1),R.pause())},onMouseLeave:g,"aria-live":`polite`,"aria-atomic":`false`,"aria-relevant":`additions text`,"aria-label":t[`aria-label`]},o((e,t)=>{let r=t.length?{...u}:{...u,pointerEvents:`none`};return B.createElement(`div`,{tabIndex:-1,className:h(e),"data-stacked":n,style:r,key:`c-${e}`},t.map(({content:e,props:t})=>B.createElement(Le,{...t,stacked:n,collapseAll:g,isIn:s(t.toastId,t.containerId),key:`t-${t.key}`},e)))}))}function he(e){return Ue(Ve,e.nonce),Se.createElement(me,{...e})}var ge,z,_e,ve,ye,B,be,V,xe,H,U,Se,W,G,K,Ce,we,Te,Ee,De,Oe,q,J,ke,Ae,je,Me,Ne,Pe,Y,Fe,Ie,Le,X,Re,ze,Be,Ve,He,Ue,We=t((()=>{ge=e(n(),1),z=e(n(),1),_e=e(n(),1),ve=e(n(),1),ye=e(n(),1),d(),B=e(n(),1),be=e(n(),1),V=e(n(),1),xe=e(n(),1),H=e(n(),1),U=e(n(),1),Se=e(n(),1),W=e=>typeof e==`number`&&!isNaN(e),G=e=>typeof e==`string`,K=e=>typeof e==`function`,Ce=e=>G(e)||W(e),we=e=>G(e)||K(e)?e:null,Te=(e,t)=>e===!1||W(e)&&e>0?e:t,Ee=e=>(0,ge.isValidElement)(e)||G(e)||K(e)||W(e),De=1,Oe=()=>`${De++}`,q=new Map,J=[],ke=new Set,Ae=e=>ke.forEach(t=>t(e)),je=()=>q.size>0,Me=(e,{containerId:t})=>q.get(t||1)?.toasts.get(e),Ne=(e={})=>{q.forEach(t=>{t.props.limit&&(!e.containerId||t.id===e.containerId)&&t.clearQueue()})},R.loading=(e,t)=>L(e,ne(`default`,{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...t})),R.promise=ie,R.success=re(`success`),R.info=re(`info`),R.error=re(`error`),R.warning=re(`warning`),R.warn=R.warning,R.dark=(e,t)=>L(e,ne(`default`,{theme:`dark`,...t})),R.dismiss=ae,R.clearWaitingQueue=Ne,R.isActive=A,R.update=(e,t={})=>{let n=Me(e,t);if(n){let{props:r,content:i}=n,a={delay:100,...r,...t,toastId:t.toastId||e,updateId:Oe()};a.toastId!==e&&(a.staleId=e);let o=a.render||i;delete a.render,L(o,a)}},R.done=e=>{R.update(e,{progress:1})},R.onChange=I,R.play=e=>P(!0,e),R.pause=e=>P(!1,e),Pe=typeof window<`u`?xe.useLayoutEffect:xe.useEffect,Y=({theme:e,type:t,isLoading:n,...r})=>U.createElement(`svg`,{viewBox:`0 0 24 24`,width:`100%`,height:`100%`,fill:e===`colored`?`currentColor`:`var(--toastify-icon-color-${t})`,...r}),Fe={info:le,warning:ce,success:ue,error:de,spinner:fe},Ie=e=>e in Fe,Le=e=>{let{isRunning:t,preventExitTransition:n,toastRef:r,eventHandlers:i,playToast:a}=se(e),{closeButton:o,children:s,autoClose:c,onClick:l,type:u,hideProgressBar:d,closeToast:p,transition:m,position:h,className:g,style:_,progressClassName:v,updateId:ee,role:y,progress:b,rtl:x,toastId:S,deleteToast:C,isIn:w,isLoading:O,closeOnClick:k,theme:A,ariaLabel:j}=e,M=f(`Toastify__toast`,`Toastify__toast-theme--${A}`,`Toastify__toast--${u}`,{"Toastify__toast--rtl":x},{"Toastify__toast--close-on-click":k}),N=K(g)?g({rtl:x,position:h,type:u,defaultClassName:M}):f(M,g),P=pe(e),F=!!b||!c,I={closeToast:p,type:u,theme:A},te=null;return o===!1||(te=K(o)?o(I):(0,H.isValidElement)(o)?(0,H.cloneElement)(o,I):E(I)),H.createElement(m,{isIn:w,done:C,position:h,preventExitTransition:n,nodeRef:r,playToast:a},H.createElement(`div`,{id:S,tabIndex:0,onClick:l,"data-in":w,className:N,...i,style:_,ref:r,...w&&{role:y,"aria-label":j}},P!=null&&H.createElement(`div`,{className:f(`Toastify__toast-icon`,{"Toastify--animate-icon Toastify__zoom-enter":!O})},P),T(s,e,!t),te,!e.customProgressBar&&H.createElement(D,{...ee&&!F?{key:`p-${ee}`}:{},rtl:x,theme:A,delay:c,isRunning:t,isIn:w,closeToast:p,hide:d,type:u,className:v,controlledProgress:F,progress:b||0})))},X=(e,t=!1)=>({enter:`Toastify--animate Toastify__${e}-enter`,exit:`Toastify--animate Toastify__${e}-exit`,appendPosition:t}),Re=C(X(`bounce`,!0)),ze=C(X(`slide`,!0)),C(X(`zoom`)),C(X(`flip`)),Be={position:`top-right`,transition:Re,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:`touch`,draggablePercent:80,draggableDirection:`x`,role:`alert`,theme:`light`,"aria-label":`Notifications Alt+T`,hotKeys:e=>e.altKey&&e.code===`KeyT`},Ve=`:root {
  --toastify-color-light: #fff;
  --toastify-color-dark: #121212;
  --toastify-color-info: #3498db;
  --toastify-color-success: #07bc0c;
  --toastify-color-warning: #f1c40f;
  --toastify-color-error: hsl(6, 78%, 57%);
  --toastify-color-transparent: rgba(255, 255, 255, 0.7);

  --toastify-icon-color-info: var(--toastify-color-info);
  --toastify-icon-color-success: var(--toastify-color-success);
  --toastify-icon-color-warning: var(--toastify-color-warning);
  --toastify-icon-color-error: var(--toastify-color-error);

  --toastify-container-width: fit-content;
  --toastify-toast-width: 320px;
  --toastify-toast-offset: 16px;
  --toastify-toast-top: max(var(--toastify-toast-offset), env(safe-area-inset-top));
  --toastify-toast-right: max(var(--toastify-toast-offset), env(safe-area-inset-right));
  --toastify-toast-left: max(var(--toastify-toast-offset), env(safe-area-inset-left));
  --toastify-toast-bottom: max(var(--toastify-toast-offset), env(safe-area-inset-bottom));
  --toastify-toast-background: #fff;
  --toastify-toast-padding: 14px;
  --toastify-toast-min-height: 64px;
  --toastify-toast-max-height: 800px;
  --toastify-toast-bd-radius: 6px;
  --toastify-toast-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  --toastify-font-family: sans-serif;
  --toastify-z-index: 9999;
  --toastify-text-color-light: #757575;
  --toastify-text-color-dark: #fff;

  /* Used only for colored theme */
  --toastify-text-color-info: #fff;
  --toastify-text-color-success: #fff;
  --toastify-text-color-warning: #fff;
  --toastify-text-color-error: #fff;

  --toastify-spinner-color: #616161;
  --toastify-spinner-color-empty-area: #e0e0e0;
  --toastify-color-progress-light: linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55);
  --toastify-color-progress-dark: #bb86fc;
  --toastify-color-progress-info: var(--toastify-color-info);
  --toastify-color-progress-success: var(--toastify-color-success);
  --toastify-color-progress-warning: var(--toastify-color-warning);
  --toastify-color-progress-error: var(--toastify-color-error);
  /* used to control the opacity of the progress trail */
  --toastify-color-progress-bgo: 0.2;
}

.Toastify__toast-container {
  z-index: var(--toastify-z-index);
  -webkit-transform: translate3d(0, 0, var(--toastify-z-index));
  position: fixed;
  width: var(--toastify-container-width);
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.Toastify__toast-container--top-left {
  top: var(--toastify-toast-top);
  left: var(--toastify-toast-left);
}
.Toastify__toast-container--top-center {
  top: var(--toastify-toast-top);
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}
.Toastify__toast-container--top-right {
  top: var(--toastify-toast-top);
  right: var(--toastify-toast-right);
  align-items: end;
}
.Toastify__toast-container--bottom-left {
  bottom: var(--toastify-toast-bottom);
  left: var(--toastify-toast-left);
}
.Toastify__toast-container--bottom-center {
  bottom: var(--toastify-toast-bottom);
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}
.Toastify__toast-container--bottom-right {
  bottom: var(--toastify-toast-bottom);
  right: var(--toastify-toast-right);
  align-items: end;
}

.Toastify__toast {
  --y: 0px;
  position: relative;
  touch-action: none;
  width: var(--toastify-toast-width);
  min-height: var(--toastify-toast-min-height);
  box-sizing: border-box;
  margin-bottom: 1rem;
  padding: var(--toastify-toast-padding);
  border-radius: var(--toastify-toast-bd-radius);
  box-shadow: var(--toastify-toast-shadow);
  max-height: var(--toastify-toast-max-height);
  font-family: var(--toastify-font-family);
  /* webkit only issue #791 */
  z-index: 0;
  /* inner swag */
  display: flex;
  flex: 1 auto;
  align-items: center;
  word-break: break-word;
}

@media only screen and (max-width: 480px) {
  .Toastify__toast-container {
    width: 100vw;
    left: env(safe-area-inset-left);
    margin: 0;
  }
  .Toastify__toast-container--top-left,
  .Toastify__toast-container--top-center,
  .Toastify__toast-container--top-right {
    top: env(safe-area-inset-top);
    transform: translateX(0);
  }
  .Toastify__toast-container--bottom-left,
  .Toastify__toast-container--bottom-center,
  .Toastify__toast-container--bottom-right {
    bottom: env(safe-area-inset-bottom);
    transform: translateX(0);
  }
  .Toastify__toast-container--rtl {
    right: env(safe-area-inset-right);
    left: initial;
  }
  .Toastify__toast {
    --toastify-toast-width: 100%;
    margin-bottom: 0;
    border-radius: 0;
  }
}

.Toastify__toast-container[data-stacked='true'] {
  width: var(--toastify-toast-width);
}

@media only screen and (max-width: 480px) {
  .Toastify__toast-container[data-stacked='true'] {
    width: 100vw;
  }
}

.Toastify__toast--stacked {
  position: absolute;
  width: 100%;
  transform: translate3d(0, var(--y), 0) scale(var(--s));
  transition: transform 0.3s;
}

.Toastify__toast--stacked[data-collapsed] .Toastify__toast-body,
.Toastify__toast--stacked[data-collapsed] .Toastify__close-button {
  transition: opacity 0.1s;
}

.Toastify__toast--stacked[data-collapsed='false'] {
  overflow: visible;
}

.Toastify__toast--stacked[data-collapsed='true']:not(:last-child) > * {
  opacity: 0;
}

.Toastify__toast--stacked:after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: calc(var(--g) * 1px);
  bottom: 100%;
}

.Toastify__toast--stacked[data-pos='top'] {
  top: 0;
}

.Toastify__toast--stacked[data-pos='bot'] {
  bottom: 0;
}

.Toastify__toast--stacked[data-pos='bot'].Toastify__toast--stacked:before {
  transform-origin: top;
}

.Toastify__toast--stacked[data-pos='top'].Toastify__toast--stacked:before {
  transform-origin: bottom;
}

.Toastify__toast--stacked:before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  transform: scaleY(3);
  z-index: -1;
}

.Toastify__toast--rtl {
  direction: rtl;
}

.Toastify__toast--close-on-click {
  cursor: pointer;
}

.Toastify__toast-icon {
  margin-inline-end: 10px;
  width: 22px;
  flex-shrink: 0;
  display: flex;
}

.Toastify--animate {
  animation-fill-mode: both;
  animation-duration: 0.5s;
}

.Toastify--animate-icon {
  animation-fill-mode: both;
  animation-duration: 0.3s;
}

.Toastify__toast-theme--dark {
  background: var(--toastify-color-dark);
  color: var(--toastify-text-color-dark);
}

.Toastify__toast-theme--light {
  background: var(--toastify-color-light);
  color: var(--toastify-text-color-light);
}

.Toastify__toast-theme--colored.Toastify__toast--default {
  background: var(--toastify-color-light);
  color: var(--toastify-text-color-light);
}

.Toastify__toast-theme--colored.Toastify__toast--info {
  color: var(--toastify-text-color-info);
  background: var(--toastify-color-info);
}

.Toastify__toast-theme--colored.Toastify__toast--success {
  color: var(--toastify-text-color-success);
  background: var(--toastify-color-success);
}

.Toastify__toast-theme--colored.Toastify__toast--warning {
  color: var(--toastify-text-color-warning);
  background: var(--toastify-color-warning);
}

.Toastify__toast-theme--colored.Toastify__toast--error {
  color: var(--toastify-text-color-error);
  background: var(--toastify-color-error);
}

.Toastify__progress-bar-theme--light {
  background: var(--toastify-color-progress-light);
}

.Toastify__progress-bar-theme--dark {
  background: var(--toastify-color-progress-dark);
}

.Toastify__progress-bar--info {
  background: var(--toastify-color-progress-info);
}

.Toastify__progress-bar--success {
  background: var(--toastify-color-progress-success);
}

.Toastify__progress-bar--warning {
  background: var(--toastify-color-progress-warning);
}

.Toastify__progress-bar--error {
  background: var(--toastify-color-progress-error);
}

.Toastify__progress-bar-theme--colored.Toastify__progress-bar--info,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--success,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--warning,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--error {
  background: var(--toastify-color-transparent);
}

.Toastify__close-button {
  color: #fff;
  position: absolute;
  top: 6px;
  right: 6px;
  background: transparent;
  outline: none;
  border: none;
  padding: 0;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.3s ease;
  z-index: 1;
}

.Toastify__toast--rtl .Toastify__close-button {
  left: 6px;
  right: unset;
}

.Toastify__close-button--light {
  color: #000;
  opacity: 0.3;
}

.Toastify__close-button > svg {
  fill: currentColor;
  height: 16px;
  width: 14px;
}

.Toastify__close-button:hover,
.Toastify__close-button:focus {
  opacity: 1;
}

@keyframes Toastify__trackProgress {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0);
  }
}

.Toastify__progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.7;
  transform-origin: left;
}

.Toastify__progress-bar--animated {
  animation: Toastify__trackProgress linear 1 forwards;
}

.Toastify__progress-bar--controlled {
  transition: transform 0.2s;
}

.Toastify__progress-bar--rtl {
  right: 0;
  left: initial;
  transform-origin: right;
  border-bottom-left-radius: initial;
}

.Toastify__progress-bar--wrp {
  position: absolute;
  overflow: hidden;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  border-bottom-left-radius: var(--toastify-toast-bd-radius);
  border-bottom-right-radius: var(--toastify-toast-bd-radius);
}

.Toastify__progress-bar--wrp[data-hidden='true'] {
  opacity: 0;
}

.Toastify__progress-bar--bg {
  opacity: var(--toastify-color-progress-bgo);
  width: 100%;
  height: 100%;
}

.Toastify__spinner {
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: var(--toastify-spinner-color-empty-area);
  border-right-color: var(--toastify-spinner-color);
  animation: Toastify__spin 0.65s linear infinite;
}

@keyframes Toastify__bounceInRight {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  from {
    opacity: 0;
    transform: translate3d(3000px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(-25px, 0, 0);
  }
  75% {
    transform: translate3d(10px, 0, 0);
  }
  90% {
    transform: translate3d(-5px, 0, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutRight {
  20% {
    opacity: 1;
    transform: translate3d(-20px, var(--y), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(2000px, var(--y), 0);
  }
}

@keyframes Toastify__bounceInLeft {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: translate3d(-3000px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(25px, 0, 0);
  }
  75% {
    transform: translate3d(-10px, 0, 0);
  }
  90% {
    transform: translate3d(5px, 0, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutLeft {
  20% {
    opacity: 1;
    transform: translate3d(20px, var(--y), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(-2000px, var(--y), 0);
  }
}

@keyframes Toastify__bounceInUp {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  from {
    opacity: 0;
    transform: translate3d(0, 3000px, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, -20px, 0);
  }
  75% {
    transform: translate3d(0, 10px, 0);
  }
  90% {
    transform: translate3d(0, -5px, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes Toastify__bounceOutUp {
  20% {
    transform: translate3d(0, calc(var(--y) - 10px), 0);
  }
  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, calc(var(--y) + 20px), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, -2000px, 0);
  }
}

@keyframes Toastify__bounceInDown {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: translate3d(0, -3000px, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, 25px, 0);
  }
  75% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, 5px, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutDown {
  20% {
    transform: translate3d(0, calc(var(--y) - 10px), 0);
  }
  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, calc(var(--y) + 20px), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, 2000px, 0);
  }
}

.Toastify__bounce-enter--top-left,
.Toastify__bounce-enter--bottom-left {
  animation-name: Toastify__bounceInLeft;
}

.Toastify__bounce-enter--top-right,
.Toastify__bounce-enter--bottom-right {
  animation-name: Toastify__bounceInRight;
}

.Toastify__bounce-enter--top-center {
  animation-name: Toastify__bounceInDown;
}

.Toastify__bounce-enter--bottom-center {
  animation-name: Toastify__bounceInUp;
}

.Toastify__bounce-exit--top-left,
.Toastify__bounce-exit--bottom-left {
  animation-name: Toastify__bounceOutLeft;
}

.Toastify__bounce-exit--top-right,
.Toastify__bounce-exit--bottom-right {
  animation-name: Toastify__bounceOutRight;
}

.Toastify__bounce-exit--top-center {
  animation-name: Toastify__bounceOutUp;
}

.Toastify__bounce-exit--bottom-center {
  animation-name: Toastify__bounceOutDown;
}

@keyframes Toastify__zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  50% {
    opacity: 1;
  }
}

@keyframes Toastify__zoomOut {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
    transform: translate3d(0, var(--y), 0) scale3d(0.3, 0.3, 0.3);
  }
  to {
    opacity: 0;
  }
}

.Toastify__zoom-enter {
  animation-name: Toastify__zoomIn;
}

.Toastify__zoom-exit {
  animation-name: Toastify__zoomOut;
}

@keyframes Toastify__flipIn {
  from {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }
  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    animation-timing-function: ease-in;
  }
  60% {
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }
  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }
  to {
    transform: perspective(400px);
  }
}

@keyframes Toastify__flipOut {
  from {
    transform: translate3d(0, var(--y), 0) perspective(400px);
  }
  30% {
    transform: translate3d(0, var(--y), 0) perspective(400px) rotate3d(1, 0, 0, -20deg);
    opacity: 1;
  }
  to {
    transform: translate3d(0, var(--y), 0) perspective(400px) rotate3d(1, 0, 0, 90deg);
    opacity: 0;
  }
}

.Toastify__flip-enter {
  animation-name: Toastify__flipIn;
}

.Toastify__flip-exit {
  animation-name: Toastify__flipOut;
}

@keyframes Toastify__slideInRight {
  from {
    transform: translate3d(110%, 0, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInLeft {
  from {
    transform: translate3d(-110%, 0, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInUp {
  from {
    transform: translate3d(0, 110%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInDown {
  from {
    transform: translate3d(0, -110%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideOutRight {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(110%, var(--y), 0);
  }
}

@keyframes Toastify__slideOutLeft {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(-110%, var(--y), 0);
  }
}

@keyframes Toastify__slideOutDown {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(0, 500px, 0);
  }
}

@keyframes Toastify__slideOutUp {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(0, -500px, 0);
  }
}

.Toastify__slide-enter--top-left,
.Toastify__slide-enter--bottom-left {
  animation-name: Toastify__slideInLeft;
}

.Toastify__slide-enter--top-right,
.Toastify__slide-enter--bottom-right {
  animation-name: Toastify__slideInRight;
}

.Toastify__slide-enter--top-center {
  animation-name: Toastify__slideInDown;
}

.Toastify__slide-enter--bottom-center {
  animation-name: Toastify__slideInUp;
}

.Toastify__slide-exit--top-left,
.Toastify__slide-exit--bottom-left {
  animation-name: Toastify__slideOutLeft;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--top-right,
.Toastify__slide-exit--bottom-right {
  animation-name: Toastify__slideOutRight;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--top-center {
  animation-name: Toastify__slideOutUp;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--bottom-center {
  animation-name: Toastify__slideOutDown;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

@keyframes Toastify__spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`,He=new Map,Ue=(e,t)=>{Pe(()=>{if(!e||typeof document>`u`)return;let n=document,r=He.get(n);if(r){t&&r.setAttribute(`nonce`,t);return}let i=n.createElement(`style`);i.textContent=e,t&&i.setAttribute(`nonce`,t),n.head.appendChild(i),He.set(n,i)},[t])}})),Ge,Ke,qe,Je,Ye,Xe=t((()=>{Ge=`modulepreload`,Ke=function(e){return`/mistakes/`+e},qe={},Je=function(e){return e.pathname.endsWith(`.css`)},Ye=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=Ke(t,n);let r=s(t);if(r.href in qe)return;qe[r.href]=!0;let i=Je(r);if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let o=document.createElement(`link`);if(o.rel=i?`stylesheet`:Ge,i||(o.as=`script`),o.crossOrigin=``,o.href=r.href,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),i)return new Promise((e,t)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${r}`)))})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})}})),Ze=t((()=>{}));function Qe({open:e,onClose:t,title:n,description:r,children:i,wide:a=!1}){return(0,Z.jsx)(ee,{open:e,onOpenChange:e=>{e||t()},children:(0,Z.jsxs)(_,{children:[(0,Z.jsx)(v,{className:`photo-dialog-backdrop`}),(0,Z.jsxs)(x,{className:`photo-dialog${a?` photo-dialog-wide`:``}`,children:[(0,Z.jsxs)(`div`,{className:`photo-dialog-heading`,children:[(0,Z.jsx)(y,{children:n}),(0,Z.jsx)(h,{className:`icon-button`,"aria-label":`关闭`,children:(0,Z.jsx)(s,{size:20})})]}),r&&(0,Z.jsx)(g,{className:`photo-dialog-description`,children:r}),i]})]})})}var Z,$e=t((()=>{b(),a(),Ze(),Z=u()})),et,tt,nt,rt=t((()=>{et=e(n()),tt=u(),nt=class extends et.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidUpdate(e){this.state.failed&&e.resetKey!==this.props.resetKey&&this.setState({failed:!1})}render(){return this.state.failed?(0,tt.jsxs)(`div`,{className:`inline-alert`,role:`alert`,children:[`页面加载失败，请刷新后重试。`,(0,tt.jsx)(`button`,{type:`button`,onClick:()=>window.location.reload(),children:`刷新页面`})]}):this.props.children}}}));function it(e){return{className:`ai-toast-actionable`,closeOnClick:!0,onClick:()=>{window.location.hash===`#${e}`?window.dispatchEvent(new HashChangeEvent(`hashchange`)):o(e)}}}var at=t((()=>{l()}));function ot(){let e=(0,Q.useContext)(ht);if(!e)throw Error(`AI tasks context missing`);return e}function st(){let{jobs:e,openTasks:t}=ot(),n=e.filter(ft).length,i=e.filter(e=>pt(e)||!e.mistakeDeleted&&e.status===`failed`).length,a=n||i;return(0,$.jsxs)(`button`,{type:`button`,className:`button ghost ai-tasks-trigger`,onClick:t,"aria-label":`AI 任务${a?`，${a} 项${n?`处理中`:`待处理`}`:``}`,children:[(0,$.jsx)(r,{size:17}),` AI 任务`,a>0&&(0,$.jsx)(`span`,{className:`count-pill`,children:a})]})}function ct({children:e}){let{user:t}=p(),[n,r]=(0,Q.useState)([]),[a,o]=(0,Q.useState)(null),[s,l]=(0,Q.useState)(!1),[u,d]=(0,Q.useState)(window.location.hash.split(`?`)[0]===`#/ai-tasks`),[f,m]=(0,Q.useState)(``),[h,g]=(0,Q.useState)(!1),[_,v]=(0,Q.useState)(!1),[ee,y]=(0,Q.useState)(null),[b,x]=(0,Q.useState)(new Set),S=(0,Q.useRef)(new Set),[C,w]=(0,Q.useState)(!document.hidden),T=(0,Q.useRef)(null),E=(0,Q.useRef)(null),D=(0,Q.useRef)(!1),O=(0,Q.useRef)(!1),k=(0,Q.useRef)(0),A=(0,Q.useRef)(!0),j=`ai-activity-${t.id}`,M=(0,Q.useCallback)(e=>{k.current+=1,A.current&&r(t=>[...e,...t.filter(t=>!e.some(e=>e.id===t.id))].sort((e,t)=>t.id-e.id))},[]),N=(0,Q.useCallback)((e=!1)=>{if(D.current=!0,O.current||=e,E.current)return E.current;v(!0);let t=(async()=>{do{D.current=!1;let e=k.current,t=O.current;O.current=!1;let[n,i]=await Promise.allSettled([c(`/ai/jobs`,{},{background:!0}),t?c(`/ai/config`,{},{background:!0}):Promise.resolve(null)]);if(!A.current)break;n.status===`fulfilled`&&(e===k.current?(r(n.value),y(Date.now())):D.current=!0),i.status===`fulfilled`&&i.value&&o(i.value),m(n.status===`rejected`?n.reason.message:i.status===`rejected`?i.reason.message:``),g(!0)}while(A.current&&D.current)})().finally(()=>{E.current=null,A.current&&v(!1)});return E.current=t,t},[]),P=(0,Q.useCallback)(()=>N(!0),[N]);(0,Q.useEffect)(()=>{A.current=!0,P();let e=()=>{N()},t=()=>{P()},n=()=>{w(!document.hidden),document.hidden||P()},r=()=>{l(!1),d(window.location.hash.split(`?`)[0]===`#/ai-tasks`)};return window.addEventListener(`mistakes:updated`,e),window.addEventListener(`focus`,t),window.addEventListener(`hashchange`,r),document.addEventListener(`visibilitychange`,n),()=>{A.current=!1,window.removeEventListener(`mistakes:updated`,e),window.removeEventListener(`focus`,t),window.removeEventListener(`hashchange`,r),document.removeEventListener(`visibilitychange`,n),R.dismiss(j)}},[N,P,j]);let F=n.filter(ft).length;(0,Q.useEffect)(()=>{if(!C)return;let e=setInterval(()=>void N(),F?2e3:15e3);return()=>clearInterval(e)},[F,C,N]),(0,Q.useEffect)(()=>{s&&P()},[s,P]),(0,Q.useEffect)(()=>{if(T.current)for(let e of n){let t=T.current.get(e.id);if(t&&t!==e.status&&!e.mistakeDeleted){if(e.status===`succeeded`){let t=e.applyStatus!==`applied`,n=t?`/mistakes/${e.mistakeId}/edit?aiJob=${e.id}`:`/mistakes/${e.mistakeId}`;R.success((0,$.jsxs)(`a`,{className:`ai-toast-link`,href:`#${n}`,children:[(0,$.jsxs)(`span`,{children:[`记录 #`,e.mistakeId,` `,dt(e),`完成`,t?`，待校对。`:`，已填入。`]}),(0,$.jsx)(`small`,{children:t?`点击校对并填入`:`点击查看错题`})]}),{autoClose:8e3,...it(n)})}if(e.status===`failed`){let t=`/ai-tasks?job=${e.id}`;R.error((0,$.jsxs)(`a`,{className:`ai-toast-link`,href:`#${t}`,children:[(0,$.jsxs)(`span`,{children:[`记录 #`,e.mistakeId,` `,dt(e),`失败。`]}),(0,$.jsx)(`small`,{children:`点击查看原因并重试`})]}),it(t))}}}T.current=new Map(n.map(e=>[e.id,e.status]))},[n]),(0,Q.useEffect)(()=>{if(!F||s||u){R.dismiss(j);return}let e=(0,$.jsxs)(`a`,{className:`ai-toast-link`,href:`#/ai-tasks`,children:[(0,$.jsxs)(`span`,{children:[F,` 项 AI 操作正在处理`]}),(0,$.jsx)(`small`,{children:`点击查看任务`})]}),t={type:`info`,autoClose:!1,...it(`/ai-tasks`)};R.isActive(j)?R.update(j,{render:e,...t}):R(e,{toastId:j,...t})},[F,s,u,j]);let I=(0,Q.useCallback)(async e=>{try{let t=await c(`/ai/jobs`,i(e));return M([t]),t}catch(e){throw R.error(e.message),e}},[M]),te=(0,Q.useCallback)(async(e,t={})=>{try{let n=await c(`/ai/jobs/${e}/apply`,i(t));return M([n.job]),R.success(`AI 结果已填入。`),n}catch(t){let r=n.find(t=>t.id===e),i=r?`/mistakes/${r.mistakeId}/edit?aiJob=${e}`:`/ai-tasks`;throw R.error((0,$.jsxs)(`a`,{className:`ai-toast-link`,href:`#${i}`,children:[(0,$.jsx)(`span`,{children:t.message}),(0,$.jsx)(`small`,{children:`点击继续校对`})]}),it(i)),P(),t}},[P,M,n]),L=(0,Q.useCallback)(async(e,t)=>{let n=[...new Set(e)].filter(e=>!S.current.has(e));if(!n.length)return{jobs:[],errors:[]};n.forEach(e=>S.current.add(e)),x(new Set(S.current));try{let e=await c(`/ai/jobs/batch`,i({ids:n,action:t}));return M(e.jobs),e.jobs.length&&R.success(t===`retry`?`已将 ${e.jobs.length} 项任务重新加入队列。`:`已取消 ${e.jobs.length} 项任务。`),e}finally{n.forEach(e=>S.current.delete(e)),A.current&&(x(new Set(S.current)),N())}},[N,M]);return(0,$.jsxs)(ht.Provider,{value:{jobs:n,config:a,error:f,loaded:h,refreshing:_,updatedAt:ee,busyIds:b,refresh:P,createJob:I,applyJob:te,actJobs:L,openTasks:()=>l(!0),closeTasks:()=>l(!1)},children:[e,(0,$.jsx)(Qe,{open:s,onClose:()=>l(!1),title:`AI 任务`,description:`离开页面后任务会继续处理，结果保留在这里。`,wide:!0,children:s&&(0,$.jsx)(nt,{children:(0,$.jsx)(Q.Suspense,{fallback:(0,$.jsx)(`p`,{role:`status`,children:`正在加载 AI 任务…`}),children:(0,$.jsx)(lt,{compact:!0})})})})]})}var Q,$,lt,ut,dt,ft,pt,mt,ht,gt=t((()=>{Q=e(n()),a(),We(),l(),m(),$e(),rt(),at(),$=u(),Xe(),lt=(0,Q.lazy)(()=>Ye(()=>import(`./AiTaskManager-CNFtqiVu.js`).then(e=>({default:e.AiTaskManager})),__vite__mapDeps([0,1,2,3,4,5,6,7]))),ut={question:`题干识别`,answer:`答案识别`,analysis:`生成解析`},dt=e=>e.mode===`page-entry`?`按页录题`:ut[e.type],ft=e=>[`queued`,`running`,`retrying`].includes(e.status),pt=e=>!e.mistakeDeleted&&e.status===`succeeded`&&e.applyStatus!==`applied`,mt=e=>ft(e)||e.status===`failed`||e.status===`succeeded`&&e.applyStatus!==`applied`,ht=(0,Q.createContext)(null)}));export{Xe as _,mt as a,he as b,pt as c,it as d,nt as f,Ye as g,$e as h,dt as i,ot as l,Qe as m,st as n,gt as o,rt as p,ct as r,ft as s,ut as t,at as u,We as v,R as x,ze as y};