const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/sdk-LxJ6YTVI.js","assets/rolldown-runtime-8BhlS34s.js","assets/AiTaskManager-C8-pyV4q.js","assets/context-BeNGG-uK.js","assets/jsx-runtime-DKm9_HWw.js","assets/motion-EzWKlTWH.js","assets/MarkdownContent-CJUifjzw.js","assets/ScrollArea-b6s4n9F8.js","assets/components-Do_p3IN4.js","assets/MarkdownContent-a_SoIC8g.css","assets/MistakesPage-BMzuNng6.js","assets/dialog-Bz5sfdLO.js","assets/with-selector-P2Ri5VwX.js","assets/StarRating-CLMwQgH3.js","assets/export-selection-C27S-IqL.js","assets/preload-helper-BpBhENcs.js","assets/export-selection-DtjfJqZX.css","assets/Select-V9fURt05.js","assets/MistakesPage-Dw-MU5mX.css","assets/EditorPage-DhLCXpJG.js","assets/ImageRegions-DrTL87j9.js","assets/ImageHistory-Cf1ETLTA.js","assets/ImageHistory-DOg8h1BU.css","assets/EditorPage-DJOnVxEf.css","assets/DetailPage-DWp8QXLm.js","assets/ReviewPage-BV2hf-Yz.js","assets/StatsPage-BlM1avnY.js","assets/clsx-DNZXw_RA.js","assets/SettingsPage-B6SVLdIX.js","assets/SettingsPage-BizY1aqO.css","assets/PageImports-D_Mt498m.js","assets/PageImports-Be4L-udF.css"])))=>i.map(i=>d[i]);
import{i as e,n as t,t as n}from"./rolldown-runtime-8BhlS34s.js";import{a as r,i,n as a,o,t as s}from"./context-BeNGG-uK.js";import{$t as c,Gt as l,N as u,T as d,U as f,Y as p,_n as m,a as h,j as g,jt as _,kn as v,lt as ee,n as y,p as b,pt as x,rn as S,t as C,xn as w,xt as T}from"./jsx-runtime-DKm9_HWw.js";import{n as E,t as D}from"./clsx-DNZXw_RA.js";import{a as O,d as k,l as A,n as j,o as M,r as N,s as P,t as F,u as te}from"./motion-EzWKlTWH.js";import{n as ne,t as I}from"./preload-helper-BpBhENcs.js";import{J as re,K as ie,c as ae,gt as oe,i as se,n as ce,t as le,u as ue}from"./dialog-Bz5sfdLO.js";function de(e,t,n=300){let{scrollHeight:r,style:i}=e;requestAnimationFrame(()=>{i.minHeight=`initial`,i.height=r+`px`,i.transition=`all ${n}ms`,requestAnimationFrame(()=>{i.height=`0`,i.padding=`0`,i.margin=`0`,setTimeout(t,n)})})}function fe({enter:e,exit:t,appendPosition:n=!1,collapse:r=!0,collapseDuration:i=300}){return function({children:a,position:o,preventExitTransition:s,done:c,nodeRef:l,isIn:u,playToast:d}){let f=n?`${e}--${o}`:e,p=n?`${t}--${o}`:t,m=(0,R.useRef)(0);return(0,R.useLayoutEffect)(()=>{let e=l.current,t=f.split(` `),n=r=>{r.target===l.current&&(d(),e.removeEventListener(`animationend`,n),e.removeEventListener(`animationcancel`,n),m.current===0&&r.type!==`animationcancel`&&e.classList.remove(...t))};e.classList.add(...t),e.addEventListener(`animationend`,n),e.addEventListener(`animationcancel`,n)},[]),(0,R.useEffect)(()=>{let e=l.current,t=()=>{e.removeEventListener(`animationend`,t),r?de(e,c,i):c()};u||(s?t():(m.current=1,e.className+=` ${p}`,e.addEventListener(`animationend`,t)))},[u]),R.createElement(R.Fragment,null,a)}}function pe(e,t){return{content:me(e.content,e.props),containerId:e.props.containerId,id:e.props.toastId,theme:e.props.theme,type:e.props.type,data:e.props.data||{},isLoading:e.props.isLoading,icon:e.props.icon,reason:e.removalReason,status:t}}function me(e,t,n=!1){return(0,Ue.isValidElement)(e)&&!W(e.type)?(0,Ue.cloneElement)(e,{closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):G(e)?e({closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):e}function he({closeToast:e,theme:t,ariaLabel:n=`close`}){return We.createElement(`button`,{className:`Toastify__close-button Toastify__close-button--${t}`,type:`button`,onClick:t=>{t.stopPropagation(),e(!0)},"aria-label":n},We.createElement(`svg`,{"aria-hidden":`true`,viewBox:`0 0 14 16`},We.createElement(`path`,{fillRule:`evenodd`,d:`M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z`})))}function ge({delay:e,isRunning:t,closeToast:n,type:r=`default`,hide:i,className:a,controlledProgress:o,progress:s,rtl:c,isIn:l,theme:u}){let d=i||o&&s===0,f={animationDuration:`${e}ms`,animationPlayState:t?`running`:`paused`};o&&(f.transform=`scaleX(${s})`);let p=D(`Toastify__progress-bar`,o?`Toastify__progress-bar--controlled`:`Toastify__progress-bar--animated`,`Toastify__progress-bar-theme--${u}`,`Toastify__progress-bar--${r}`,{"Toastify__progress-bar--rtl":c}),m=G(a)?a({rtl:c,type:r,defaultClassName:p}):D(p,a),h={[o&&s>=1?`onTransitionEnd`:`onAnimationEnd`]:o&&s<1?null:()=>{l&&n()}};return Ge.createElement(`div`,{className:`Toastify__progress-bar--wrp`,"data-hidden":d},Ge.createElement(`div`,{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${u} Toastify__progress-bar--${r}`}),Ge.createElement(`div`,{role:`progressbar`,"aria-hidden":d?`true`:`false`,"aria-label":`notification timer`,"aria-valuenow":o?Math.round(s*100):void 0,"aria-valuemin":0,"aria-valuemax":100,className:m,style:f,...h}))}function _e(e,t,n){let r=1,i=0,a=[],o=[],s=t,c=new Map,l=new Set,u=e=>(l.add(e),()=>l.delete(e)),d=()=>{o=Array.from(c.values()),l.forEach(e=>e())},f=({containerId:t,toastId:n,updateId:r})=>{let i=t?t!==e:e!==1,a=c.has(n)&&r==null;return i||a},p=(e,t)=>{c.forEach(n=>{var r;(t==null||t===n.props.toastId)&&((r=n.toggle)==null||r.call(n,e))})},m=e=>{var t,r;e.isActive&&((r=(t=e.props)?.onClose)==null||r.call(t,e.removalReason),e.isActive=!1,n(pe(e,`removed`)))},h=e=>{if(e==null)c.forEach(m);else{let t=c.get(e);t&&m(t)}d()},g=()=>{i-=a.length,a=[]},_=e=>{var t,r;let{toastId:i,updateId:a}=e.props,o=a==null;e.staleId&&c.delete(e.staleId),e.isActive=!0,c.set(i,e),d(),n(pe(e,o?`added`:`updated`)),o&&((r=(t=e.props).onOpen)==null||r.call(t))};return{id:e,props:s,observe:u,toggle:p,removeToast:h,toasts:c,clearQueue:g,buildToast:(e,t)=>{if(f(t))return;let{toastId:n,updateId:o,data:l,staleId:u,delay:p}=t,m=o==null;m&&i++;let g={...s,style:s.toastStyle,key:r++,...Object.fromEntries(Object.entries(t).filter(([e,t])=>t!=null)),toastId:n,updateId:o,data:l,isIn:!1,className:Xe(t.className||s.toastClassName),progressClassName:Xe(t.progressClassName||s.progressClassName),autoClose:!t.isLoading&&Ze(t.autoClose,s.autoClose),closeToast(e){let t=c.get(n);t&&(t.removalReason=e,h(n))},deleteToast(){if(c.get(n)!=null){if(c.delete(n),i--,i<0&&(i=0),a.length>0){_(a.shift());return}d()}}};g.closeButton=s.closeButton,t.closeButton===!1||Qe(t.closeButton)?g.closeButton=t.closeButton:t.closeButton===!0&&(g.closeButton=!Qe(s.closeButton)||s.closeButton);let v={content:e,props:g,staleId:u};s.limit&&s.limit>0&&i>s.limit&&m?a.push(v):U(p)?setTimeout(()=>{_(v)},p):_(v)},setProps(e){s=e},setToggle:(e,t)=>{let n=c.get(e);n&&(n.toggle=t)},isToastActive:e=>c.get(e)?.isActive,getSnapshot:()=>o}}function ve(){tt.forEach(e=>xe(e.content,e.options)),tt=[]}function ye(e,t){var n;if(t)return!!((n=K.get(t))!=null&&n.isToastActive(e));let r=!1;return K.forEach(t=>{t.isToastActive(e)&&(r=!0)}),r}function be(e){if(!it()){tt=tt.filter(t=>e!=null&&t.options.toastId!==e);return}if(e==null||Ye(e))K.forEach(t=>{t.removeToast(e)});else if(e&&(`containerId`in e||`id`in e)){let t=K.get(e.containerId);t?t.removeToast(e.id):K.forEach(t=>{t.removeToast(e.id)})}}function xe(e,t){Qe(e)&&(it()||tt.push({content:e,options:t}),K.forEach(n=>{n.buildToast(e,t)}))}function Se(e){var t;(t=K.get(e.containerId||1))==null||t.setToggle(e.id,e.fn)}function Ce(e,t){K.forEach(n=>{(t==null||!(t!=null&&t.containerId)||t?.containerId===n.id)&&n.toggle(e,t?.id)})}function we(e){let t=e.containerId||1;return{subscribe(n){let r=_e(t,e,rt);K.set(t,r);let i=r.observe(n);return ve(),()=>{i(),K.delete(t)}},setProps(e){var n;(n=K.get(t))==null||n.setProps(e)},getSnapshot(){return K.get(t)?.getSnapshot()}}}function Te(e){return nt.add(e),()=>{nt.delete(e)}}function Ee(e){return e&&(W(e.toastId)||U(e.toastId))?e.toastId:et()}function De(e,t){return xe(e,t),t.toastId}function Oe(e,t){return{...t,type:t&&t.type||e,toastId:Ee(t)}}function ke(e){return(t,n)=>De(t,Oe(e,n))}function L(e,t){return De(e,Oe(`default`,t))}function Ae(e,{pending:t,error:n,success:r},i){let a;t&&(a=W(t)?L.loading(t,i):L.loading(t.render,{...i,...t}));let o={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},s=(e,t,n)=>{if(t==null){L.dismiss(a);return}let r={type:e,...o,...i,data:n},s=W(t)?{render:t}:t;return a?L.update(a,{...r,...s}):L(s.render,{...r,...s}),n},c=G(e)?e():e;return c.then(e=>s(`success`,r,e)).catch(e=>s(`error`,n,e)),c}function je(e){be(e)}function Me(e){let{subscribe:t,getSnapshot:n,setProps:r}=(0,Ke.useRef)(we(e)).current;r(e);let i=(0,Ke.useSyncExternalStore)(t,n,n)?.slice();function a(t){if(!i)return[];let n=new Map;return e.newestOnTop&&i.reverse(),i.forEach(e=>{let{position:t}=e.props;n.has(t)||n.set(t,[]),n.get(t).push(e)}),Array.from(n,e=>t(e[0],e[1]))}return{getToastToRender:a,isToastActive:ye,count:i?.length}}function Ne(e){let[t,n]=(0,B.useState)(!1),[r,i]=(0,B.useState)(!1),a=(0,B.useRef)(null),o=(0,B.useRef)({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:s,pauseOnHover:c,closeToast:l,onClick:u,closeOnClick:d}=e;Se({id:e.toastId,containerId:e.containerId,fn:n}),(0,B.useEffect)(()=>{if(e.pauseOnFocusLoss)return f(),()=>{p()}},[e.pauseOnFocusLoss]);function f(){document.hasFocus()||_(),window.addEventListener(`focus`,g),window.addEventListener(`blur`,_)}function p(){window.removeEventListener(`focus`,g),window.removeEventListener(`blur`,_)}function m(t){if(e.draggable===!0||e.draggable===t.pointerType){v();let n=a.current;o.canCloseOnClick=!0,o.canDrag=!0,n.style.transition=`none`,e.draggableDirection===`x`?(o.start=t.clientX,o.removalDistance=n.offsetWidth*(e.draggablePercent/100)):(o.start=t.clientY,o.removalDistance=n.offsetHeight*(e.draggablePercent===80?e.draggablePercent*1.5:e.draggablePercent)/100)}}function h(t){let{top:n,bottom:r,left:i,right:o}=a.current.getBoundingClientRect();t.pointerType===`mouse`&&e.pauseOnHover&&t.clientX>=i&&t.clientX<=o&&t.clientY>=n&&t.clientY<=r?_():g()}function g(){n(!0)}function _(){n(!1)}function v(){o.didMove=!1,document.addEventListener(`pointermove`,y),document.addEventListener(`pointerup`,b)}function ee(){document.removeEventListener(`pointermove`,y),document.removeEventListener(`pointerup`,b)}function y(n){let r=a.current;if(o.canDrag&&r){o.didMove=!0,t&&_(),e.draggableDirection===`x`?o.delta=n.clientX-o.start:o.delta=n.clientY-o.start,o.start!==n.clientX&&(o.canCloseOnClick=!1);let i=e.draggableDirection===`x`?`${o.delta}px, var(--y)`:`0, calc(${o.delta}px + var(--y))`;r.style.transform=`translate3d(${i},0)`,r.style.opacity=`${1-Math.abs(o.delta/o.removalDistance)}`}}function b(){ee();let t=a.current;if(o.canDrag&&o.didMove&&t){if(o.canDrag=!1,Math.abs(o.delta)>o.removalDistance){i(!0),e.closeToast(!0),e.collapseAll();return}t.style.transition=`transform 0.2s, opacity 0.2s`,t.style.removeProperty(`transform`),t.style.removeProperty(`opacity`)}}let x={onPointerDown:m,onPointerUp:h};return s&&c&&(x.onMouseEnter=_,e.stacked||(x.onMouseLeave=g)),d&&(x.onClick=e=>{u&&u(e),o.canCloseOnClick&&l(!0)}),{playToast:g,pauseToast:_,isRunning:t,preventExitTransition:r,toastRef:a,eventHandlers:x}}function Pe(e){return H.createElement(ct,{...e},H.createElement(`path`,{d:`M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z`}))}function Fe(e){return H.createElement(ct,{...e},H.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z`}))}function Ie(e){return H.createElement(ct,{...e},H.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z`}))}function Le(e){return H.createElement(ct,{...e},H.createElement(`path`,{d:`M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z`}))}function Re(){return H.createElement(`div`,{className:`Toastify__spinner`})}function ze({theme:e,type:t,isLoading:n,icon:r}){let i=null,a={theme:e,type:t};return r===!1||(G(r)?i=r({...a,isLoading:n}):(0,H.isValidElement)(r)?i=(0,H.cloneElement)(r,a):n?i=lt.spinner():ut(t)&&(i=lt[t](a))),i}function Be(e){let t={...ht,...e},n=e.stacked,[r,i]=(0,z.useState)(!0),a=(0,z.useRef)(null),{getToastToRender:o,isToastActive:s,count:c}=Me(t),{className:l,style:u,rtl:d,containerId:f,hotKeys:p}=t;function m(e){let t=D(`Toastify__toast-container`,`Toastify__toast-container--${e}`,{"Toastify__toast-container--rtl":d});return G(l)?l({position:e,rtl:d,defaultClassName:t}):D(t,Xe(l))}function h(){n&&(i(!0),L.play())}return st(()=>{if(n){let e=a.current.querySelectorAll(`[data-in="true"]`),n=t.position?.includes(`top`),i=0,o=0;Array.from(e).reverse().forEach((e,t)=>{let a=e;a.classList.add(`Toastify__toast--stacked`),t>0&&(a.dataset.collapsed=`${r}`),a.dataset.pos||(a.dataset.pos=n?`top`:`bot`);let s=i*(r?.2:1)+(r?0:12*t),c=Math.max(.5,1-(r?o:0));a.style.setProperty(`--y`,`${n?s:s*-1}px`),a.style.setProperty(`--g`,`12`),a.style.setProperty(`--s`,`${c}`),i+=a.offsetHeight,o+=.025})}},[r,c,n]),(0,z.useEffect)(()=>{function e(e){var t;let n=a.current;p(e)&&((t=n?.querySelector(`[tabIndex="0"]`))==null||t.focus(),i(!1),L.pause()),e.key===`Escape`&&(document.activeElement===n||n!=null&&n.contains(document.activeElement))&&(i(!0),L.play())}return document.addEventListener(`keydown`,e),()=>{document.removeEventListener(`keydown`,e)}},[p]),z.createElement(`section`,{ref:a,className:`Toastify`,id:f,onMouseEnter:()=>{n&&(i(!1),L.pause())},onMouseLeave:h,"aria-live":`polite`,"aria-atomic":`false`,"aria-relevant":`additions text`,"aria-label":t[`aria-label`]},o((e,t)=>{let r=t.length?{...u}:{...u,pointerEvents:`none`};return z.createElement(`div`,{tabIndex:-1,className:m(e),"data-stacked":n,style:r,key:`c-${e}`},t.map(({content:e,props:t})=>z.createElement(dt,{...t,stacked:n,collapseAll:h,isIn:s(t.toastId,t.containerId),key:`t-${t.key}`},e)))}))}function Ve(e){return vt(gt,e.nonce),Je.createElement(Be,{...e})}var He,R,Ue,We,Ge,z,Ke,B,qe,V,H,Je,U,W,G,Ye,Xe,Ze,Qe,$e,et,K,tt,nt,rt,it,at,ot,st,ct,lt,ut,dt,ft,pt,mt,ht,gt,_t,vt,yt=t((()=>{He=e(v(),1),R=e(v(),1),Ue=e(v(),1),We=e(v(),1),Ge=e(v(),1),E(),z=e(v(),1),Ke=e(v(),1),B=e(v(),1),qe=e(v(),1),V=e(v(),1),H=e(v(),1),Je=e(v(),1),U=e=>typeof e==`number`&&!isNaN(e),W=e=>typeof e==`string`,G=e=>typeof e==`function`,Ye=e=>W(e)||U(e),Xe=e=>W(e)||G(e)?e:null,Ze=(e,t)=>e===!1||U(e)&&e>0?e:t,Qe=e=>(0,He.isValidElement)(e)||W(e)||G(e)||U(e),$e=1,et=()=>`${$e++}`,K=new Map,tt=[],nt=new Set,rt=e=>nt.forEach(t=>t(e)),it=()=>K.size>0,at=(e,{containerId:t})=>K.get(t||1)?.toasts.get(e),ot=(e={})=>{K.forEach(t=>{t.props.limit&&(!e.containerId||t.id===e.containerId)&&t.clearQueue()})},L.loading=(e,t)=>De(e,Oe(`default`,{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...t})),L.promise=Ae,L.success=ke(`success`),L.info=ke(`info`),L.error=ke(`error`),L.warning=ke(`warning`),L.warn=L.warning,L.dark=(e,t)=>De(e,Oe(`default`,{theme:`dark`,...t})),L.dismiss=je,L.clearWaitingQueue=ot,L.isActive=ye,L.update=(e,t={})=>{let n=at(e,t);if(n){let{props:r,content:i}=n,a={delay:100,...r,...t,toastId:t.toastId||e,updateId:et()};a.toastId!==e&&(a.staleId=e);let o=a.render||i;delete a.render,De(o,a)}},L.done=e=>{L.update(e,{progress:1})},L.onChange=Te,L.play=e=>Ce(!0,e),L.pause=e=>Ce(!1,e),st=typeof window<`u`?qe.useLayoutEffect:qe.useEffect,ct=({theme:e,type:t,isLoading:n,...r})=>H.createElement(`svg`,{viewBox:`0 0 24 24`,width:`100%`,height:`100%`,fill:e===`colored`?`currentColor`:`var(--toastify-icon-color-${t})`,...r}),lt={info:Fe,warning:Pe,success:Ie,error:Le,spinner:Re},ut=e=>e in lt,dt=e=>{let{isRunning:t,preventExitTransition:n,toastRef:r,eventHandlers:i,playToast:a}=Ne(e),{closeButton:o,children:s,autoClose:c,onClick:l,type:u,hideProgressBar:d,closeToast:f,transition:p,position:m,className:h,style:g,progressClassName:_,updateId:v,role:ee,progress:y,rtl:b,toastId:x,deleteToast:S,isIn:C,isLoading:w,closeOnClick:T,theme:E,ariaLabel:O}=e,k=D(`Toastify__toast`,`Toastify__toast-theme--${E}`,`Toastify__toast--${u}`,{"Toastify__toast--rtl":b},{"Toastify__toast--close-on-click":T}),A=G(h)?h({rtl:b,position:m,type:u,defaultClassName:k}):D(k,h),j=ze(e),M=!!y||!c,N={closeToast:f,type:u,theme:E},P=null;return o===!1||(P=G(o)?o(N):(0,V.isValidElement)(o)?(0,V.cloneElement)(o,N):he(N)),V.createElement(p,{isIn:C,done:S,position:m,preventExitTransition:n,nodeRef:r,playToast:a},V.createElement(`div`,{id:x,tabIndex:0,onClick:l,"data-in":C,className:A,...i,style:g,ref:r,...C&&{role:ee,"aria-label":O}},j!=null&&V.createElement(`div`,{className:D(`Toastify__toast-icon`,{"Toastify--animate-icon Toastify__zoom-enter":!w})},j),me(s,e,!t),P,!e.customProgressBar&&V.createElement(ge,{...v&&!M?{key:`p-${v}`}:{},rtl:b,theme:E,delay:c,isRunning:t,isIn:C,closeToast:f,hide:d,type:u,className:_,controlledProgress:M,progress:y||0})))},ft=(e,t=!1)=>({enter:`Toastify--animate Toastify__${e}-enter`,exit:`Toastify--animate Toastify__${e}-exit`,appendPosition:t}),pt=fe(ft(`bounce`,!0)),mt=fe(ft(`slide`,!0)),fe(ft(`zoom`)),fe(ft(`flip`)),ht={position:`top-right`,transition:pt,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:`touch`,draggablePercent:80,draggableDirection:`x`,role:`alert`,theme:`light`,"aria-label":`Notifications Alt+T`,hotKeys:e=>e.altKey&&e.code===`KeyT`},gt=`:root {
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
`,_t=new Map,vt=(e,t)=>{st(()=>{if(!e||typeof document>`u`)return;let n=document,r=_t.get(n);if(r){t&&r.setAttribute(`nonce`,t);return}let i=n.createElement(`style`);i.textContent=e,t&&i.setAttribute(`nonce`,t),n.head.appendChild(i),_t.set(n,i)},[t])}}));function bt({className:e=``}){return(0,xt.jsx)(`img`,{className:`logo-mark ${e}`,src:`/mistakes/logo.svg`,alt:``,width:`48`,height:`48`})}var xt,St=t((()=>{xt=C()}));function Ct(){return Dt||=I(async()=>{let{FriendlyCaptchaSDK:e}=await import(`./sdk-LxJ6YTVI.js`);return{FriendlyCaptchaSDK:e}},__vite__mapDeps([0,1])).then(({FriendlyCaptchaSDK:e})=>new e).catch(e=>{throw Dt=null,e}),Dt}function wt({sitekey:e,resetKey:t,onChange:n}){let r=(0,Tt.useRef)(null),[i,a]=(0,Tt.useState)(!0);return(0,Tt.useEffect)(()=>{let t=r.current;if(!t)return;let i=document.createElement(`div`);t.append(i);let o=!0,s;a(!0),n({status:`pending`,response:``});let c=e=>{if(!o)return;let{state:t,response:r}=e.detail;n(t===`completed`?{status:`complete`,response:r}:t===`error`?{status:`error`,response:r||`.ERROR`}:t===`expired`?{status:`expired`,response:``}:{status:`pending`,response:``})};return i.addEventListener(`frc:widget.statechange`,c),Ct().then(t=>{o&&(s=t.createWidget({element:i,sitekey:e,apiEndpoint:`global`,startMode:`focus`,theme:`light`}),a(!1),i.closest(`form`)?.contains(document.activeElement)&&s.start())}).catch(()=>{o&&(a(!1),n({status:`error`,response:`.ERROR`}))}),()=>{o=!1,i.removeEventListener(`frc:widget.statechange`,c),s?.destroy(),i.remove()}},[e,t,n]),(0,Et.jsxs)(`div`,{className:`auth-captcha-control`,children:[i&&(0,Et.jsxs)(`div`,{className:`auth-captcha-loading`,role:`status`,children:[(0,Et.jsx)(x,{className:`spin`,size:16}),` 正在加载人机验证…`]}),(0,Et.jsx)(`div`,{className:`auth-captcha-widget`,ref:r})]})}var Tt,Et,Dt,Ot=t((()=>{Tt=e(v()),y(),Et=C(),ne(),Dt=null})),kt=t((()=>{}));function At({open:e,onClose:t,title:n,description:r,children:i,wide:a=!1,suspended:o=!1}){return(0,q.jsx)(se,{open:e,modal:!o,disablePointerDismissal:o,onOpenChange:(e,n)=>{o?n.cancel():e||t()},children:(0,q.jsxs)(ae,{children:[(0,q.jsx)(oe,{className:`photo-dialog-backdrop`}),(0,q.jsxs)(ue,{className:`photo-dialog${a?` photo-dialog-wide`:``}`,children:[(0,q.jsxs)(`div`,{className:`photo-dialog-heading`,children:[(0,q.jsx)(ce,{children:n}),(0,q.jsx)(re,{className:`icon-button`,"aria-label":`关闭`,children:(0,q.jsx)(h,{size:20})})]}),r&&(0,q.jsx)(ie,{className:`photo-dialog-description`,children:r}),i]})]})})}var q,jt=t((()=>{le(),y(),kt(),q=C()})),Mt,Nt,Pt,Ft=t((()=>{Mt=e(v()),Nt=C(),Pt=class extends Mt.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidUpdate(e){this.state.failed&&e.resetKey!==this.props.resetKey&&this.setState({failed:!1})}render(){return this.state.failed?(0,Nt.jsxs)(`div`,{className:`inline-alert`,role:`alert`,children:[`页面加载失败，请刷新后重试。`,(0,Nt.jsx)(`button`,{type:`button`,onClick:()=>window.location.reload(),children:`刷新页面`})]}):this.props.children}}}));function It(e){return{className:`ai-toast-actionable`,closeOnClick:!0,onClick:()=>{window.location.hash===`#${e}`?window.dispatchEvent(new HashChangeEvent(`hashchange`)):k(e)}}}var Lt=t((()=>{A()}));function Rt(){let e=(0,J.useContext)(qt);if(!e)throw Error(`AI tasks context missing`);return e}function zt(){let{jobs:e,openTasks:t}=Rt(),n=e.filter(Wt).length,r=e.filter(e=>Gt(e)||!e.mistakeDeleted&&e.status===`failed`).length,i=n||r;return(0,Y.jsxs)(`button`,{type:`button`,className:`button ghost ai-tasks-trigger`,onClick:t,"aria-label":`AI 任务${i?`，${i} 项${n?`处理中`:`待处理`}`:``}`,children:[(0,Y.jsx)(d,{size:17}),` AI 任务`,i>0&&(0,Y.jsx)(`span`,{className:`count-pill`,children:i})]})}function Bt({children:e}){let{user:t}=r(),[n,i]=(0,J.useState)([]),[a,o]=(0,J.useState)(null),[s,c]=(0,J.useState)(!1),[l,u]=(0,J.useState)(window.location.hash.split(`?`)[0]===`#/ai-tasks`),[d,f]=(0,J.useState)(``),[p,m]=(0,J.useState)(!1),[h,g]=(0,J.useState)(!1),[_,v]=(0,J.useState)(null),[ee,y]=(0,J.useState)(new Set),b=(0,J.useRef)(new Set),[x,S]=(0,J.useState)(!document.hidden),C=(0,J.useRef)(null),w=(0,J.useRef)(null),T=(0,J.useRef)(!1),E=(0,J.useRef)(!1),D=(0,J.useRef)(0),O=(0,J.useRef)(!0),k=`ai-activity-${t.id}`,A=(0,J.useCallback)(e=>{D.current+=1,O.current&&i(t=>[...e,...t.filter(t=>!e.some(e=>e.id===t.id))].sort((e,t)=>t.id-e.id))},[]),M=(0,J.useCallback)((e=!1)=>{if(T.current=!0,E.current||=e,w.current)return w.current;g(!0);let t=(async()=>{do{T.current=!1;let e=D.current,t=E.current;E.current=!1;let[n,r]=await Promise.allSettled([P(`/ai/jobs`,{},{background:!0}),t?P(`/ai/config`,{},{background:!0}):Promise.resolve(null)]);if(!O.current)break;n.status===`fulfilled`&&(e===D.current?(i(n.value),v(Date.now())):T.current=!0),r.status===`fulfilled`&&r.value&&o(r.value),f(n.status===`rejected`?n.reason.message:r.status===`rejected`?r.reason.message:``),m(!0)}while(O.current&&T.current)})().finally(()=>{w.current=null,O.current&&g(!1)});return w.current=t,t},[]),N=(0,J.useCallback)(()=>M(!0),[M]);(0,J.useEffect)(()=>{O.current=!0,N();let e=()=>{M()},t=()=>{N()},n=()=>{S(!document.hidden),document.hidden||N()},r=()=>{c(!1),u(window.location.hash.split(`?`)[0]===`#/ai-tasks`)};return window.addEventListener(`mistakes:updated`,e),window.addEventListener(`focus`,t),window.addEventListener(`hashchange`,r),document.addEventListener(`visibilitychange`,n),()=>{O.current=!1,window.removeEventListener(`mistakes:updated`,e),window.removeEventListener(`focus`,t),window.removeEventListener(`hashchange`,r),document.removeEventListener(`visibilitychange`,n),L.dismiss(k)}},[M,N,k]);let F=n.filter(Wt).length;(0,J.useEffect)(()=>{if(!x)return;let e=setInterval(()=>void M(),F?2e3:15e3);return()=>clearInterval(e)},[F,x,M]),(0,J.useEffect)(()=>{s&&N()},[s,N]),(0,J.useEffect)(()=>{if(C.current)for(let e of n){let t=C.current.get(e.id);if(t&&t!==e.status&&!e.mistakeDeleted){if(e.status===`succeeded`){let t=e.applyStatus!==`applied`,n=t?`/mistakes/${e.mistakeId}/edit?aiJob=${e.id}`:`/mistakes/${e.mistakeId}`;L.success((0,Y.jsxs)(`a`,{className:`ai-toast-link`,href:`#${n}`,children:[(0,Y.jsxs)(`span`,{children:[`记录 #`,e.mistakeId,` `,Ut(e),`完成`,t?`，待校对。`:`，已填入。`]}),(0,Y.jsx)(`small`,{children:t?`点击校对并填入`:`点击查看错题`})]}),{autoClose:8e3,...It(n)})}if(e.status===`failed`){let t=`/ai-tasks?job=${e.id}`;L.error((0,Y.jsxs)(`a`,{className:`ai-toast-link`,href:`#${t}`,children:[(0,Y.jsxs)(`span`,{children:[`记录 #`,e.mistakeId,` `,Ut(e),`失败。`]}),(0,Y.jsx)(`small`,{children:`点击查看原因并重试`})]}),It(t))}}}C.current=new Map(n.map(e=>[e.id,e.status]))},[n]),(0,J.useEffect)(()=>{if(!F||s||l){L.dismiss(k);return}let e=(0,Y.jsxs)(`a`,{className:`ai-toast-link`,href:`#/ai-tasks`,children:[(0,Y.jsxs)(`span`,{children:[F,` 项 AI 操作正在处理`]}),(0,Y.jsx)(`small`,{children:`点击查看任务`})]}),t={type:`info`,autoClose:!1,...It(`/ai-tasks`)};L.isActive(k)?L.update(k,{render:e,...t}):L(e,{toastId:k,...t})},[F,s,l,k]);let ne=(0,J.useCallback)(async e=>{try{let t=await P(`/ai/jobs`,te(e));return A([t]),t}catch(e){throw L.error(e.message),e}},[A]),I=(0,J.useCallback)(async(e,t={})=>{try{let n=await P(`/ai/jobs/${e}/apply`,te(t));return A([n.job]),L.success(`AI 结果已填入。`),n}catch(t){let r=n.find(t=>t.id===e),i=r?`/mistakes/${r.mistakeId}/edit?aiJob=${e}`:`/ai-tasks`;throw L.error((0,Y.jsxs)(`a`,{className:`ai-toast-link`,href:`#${i}`,children:[(0,Y.jsx)(`span`,{children:t.message}),(0,Y.jsx)(`small`,{children:`点击继续校对`})]}),It(i)),N(),t}},[N,A,n]),re=(0,J.useCallback)(async(e,t)=>{let n=[...new Set(e)].filter(e=>!b.current.has(e));if(!n.length)return{jobs:[],errors:[]};n.forEach(e=>b.current.add(e)),y(new Set(b.current));try{let e=await P(`/ai/jobs/batch`,te({ids:n,action:t}));return A(e.jobs),e.jobs.length&&L.success(t===`retry`?`已将 ${e.jobs.length} 项任务重新加入队列。`:`已取消 ${e.jobs.length} 项任务。`),e}finally{n.forEach(e=>b.current.delete(e)),O.current&&(y(new Set(b.current)),M())}},[M,A]);return(0,Y.jsxs)(qt.Provider,{value:{jobs:n,config:a,error:d,loaded:p,refreshing:h,updatedAt:_,busyIds:ee,refresh:N,createJob:ne,applyJob:I,actJobs:re,openTasks:()=>c(!0),closeTasks:()=>c(!1)},children:[e,(0,Y.jsx)(At,{open:s,onClose:()=>c(!1),title:`AI 任务`,description:`离开页面后任务会继续处理，结果保留在这里。`,wide:!0,children:s&&(0,Y.jsx)(Pt,{children:(0,Y.jsx)(J.Suspense,{fallback:(0,Y.jsx)(j,{loading:!0,kind:`rows`,children:null}),children:(0,Y.jsx)(Vt,{compact:!0})})})})]})}var J,Y,Vt,Ht,Ut,Wt,Gt,Kt,qt,Jt=t((()=>{J=e(v()),y(),yt(),A(),a(),jt(),Ft(),O(),Lt(),Y=C(),ne(),Vt=(0,J.lazy)(()=>I(()=>import(`./AiTaskManager-C8-pyV4q.js`).then(e=>({default:e.AiTaskManager})),__vite__mapDeps([2,1,3,4,5,6,7,8,9]))),Ht={question:`题干识别`,answer:`答案识别`,analysis:`生成解析`},Ut=e=>e.mode===`page-entry`?`按页录题`:Ht[e.type],Wt=e=>[`queued`,`running`,`retrying`].includes(e.status),Gt=e=>!e.mistakeDeleted&&e.status===`succeeded`&&e.applyStatus!==`applied`,Kt=e=>Wt(e)||e.status===`failed`||e.status===`succeeded`&&e.applyStatus!==`applied`,qt=(0,J.createContext)(null)})),Yt,Xt,Zt,Qt,$t,en,tn=t((()=>{A(),Yt=class extends Error{constructor(){super(`请求超时，请重试。`)}},Xt=[1e3,2e3,4e3],Zt=e=>({...e,auxiliaryKnowledgePointIds:[...e.auxiliaryKnowledgePointIds]}),Qt=e=>e instanceof Error?e.message:`请求失败，请重试。`,$t=e=>e instanceof M?e.status===408||e.status===429||e.status>=500&&e.status<600:e instanceof TypeError||e instanceof Yt,en=class{batches=new Map;listeners=new Set;snapshot=[];subscribe=e=>(this.listeners.add(e),()=>{this.listeners.delete(e)});getSnapshot=()=>this.snapshot;enqueue({mistakeId:e,purpose:t,input:n,files:r,recognize:i,recognitionPrompt:a}){let o=crypto.randomUUID(),s={view:{id:o,mistakeId:e,purpose:t,total:r.length,imageIds:[],status:`uploading`,message:`图片已压缩，正在后台上传…`,reuseRequested:!1},files:[...r],input:Zt(n),recognize:i,recognitionPrompt:a?.trim()||void 0,recognitionSubmitted:!1,recognitionClientId:crypto.randomUUID(),reuseClientId:crypto.randomUUID(),running:!1,controller:new AbortController};return this.batches.set(o,s),this.publish(),this.run(s),o}reuse(e,t,n){let r=this.batches.get(e);return!r||r.view.purpose!==`question`||r.view.reuseRequested?!1:(r.reuseInput=Zt(t),r.reuseRecognitionPrompt=n?.trim()||void 0,this.update(r,{reuseRequested:!0,reuseStatus:`waiting`}),r.view.imageIds.length===r.view.total&&this.run(r),!0)}retry(e){let t=this.batches.get(e);t&&!t.running&&t.view.status===`failed`&&(t.recognitionError=void 0,t.reuseError=void 0,t.view.reuseStatus===`failed`&&this.update(t,{reuseStatus:`waiting`}),this.run(t))}dispose(){for(let e of this.batches.values())e.controller.abort(),e.files=[];this.batches.clear(),this.snapshot.length&&this.publish()}publish(){this.snapshot=Array.from(this.batches.values(),e=>e.view).reverse(),this.listeners.forEach(e=>e())}update(e,t){e.controller.signal.aborted||(e.view={...e.view,...t},this.publish())}async run(e){if(!(e.running||e.controller.signal.aborted)){e.running=!0;try{try{for(;e.view.imageIds.length<e.view.total;){let t=e.view.imageIds.length,n=e.files[t],r=await this.request(e,`uploading`,`正在后台上传第 ${t+1}/${e.view.total} 张图片…`,9e4,t=>{let r=new FormData;return r.append(`original`,n.original,n.originalName.replace(/\.[^.]+$/,``)+`.jpg`),r.append(`crop`,n.crop,`crop.jpg`),r.append(`purpose`,e.view.purpose),r.append(`clientId`,n.clientId),P(`/mistakes/${e.view.mistakeId}/images`,{method:`POST`,body:r,signal:t},{background:!0})});this.update(e,{imageIds:[...e.view.imageIds,r.id]})}e.files=[]}catch(t){e.controller.signal.aborted||this.update(e,{status:`failed`,message:`图片上传失败：${Qt(t)}`});return}if(e.recognize&&!e.recognitionSubmitted&&!e.recognitionError)try{await this.submitRecognition(e,e.view.purpose,e.input,e.recognitionClientId,e.recognitionPrompt),e.recognitionSubmitted=!0}catch(t){if(e.controller.signal.aborted)return;e.recognitionError=Qt(t)}if(e.reuseInput&&e.view.reuseStatus===`waiting`){this.update(e,{reuseStatus:`submitting`});try{await this.submitRecognition(e,`answer`,e.reuseInput,e.reuseClientId,e.reuseRecognitionPrompt),this.update(e,{reuseStatus:`submitted`})}catch(t){if(e.controller.signal.aborted)return;e.reuseError=Qt(t),this.update(e,{reuseStatus:`failed`})}}let t=[e.recognitionError&&`识别任务提交失败：${e.recognitionError}`,e.reuseError&&`答案复用提交失败：${e.reuseError}`].filter(Boolean);this.update(e,{status:t.length?`failed`:`completed`,message:t.length?t.join(`；`):e.view.reuseStatus===`submitted`?`图片已上传，答案复用已交给后台识别。`:e.recognize?`图片已上传，已交给后台识别。`:`${e.view.total} 张图片已上传。`})}finally{e.running=!1,!e.controller.signal.aborted&&e.view.imageIds.length===e.view.total&&e.view.reuseStatus===`waiting`&&this.run(e)}}}submitRecognition(e,t,n,r,i){return this.request(e,`processing`,`正在后台提交${t===`question`?`题目`:`答案`}识别…`,3e4,a=>P(`/ai/jobs`,{...te({clientId:r,mistakeId:e.view.mistakeId,type:t,imageIds:e.view.imageIds,input:n,recognitionPrompt:i}),signal:a},{background:!0}))}async request(e,t,n,r,i){for(let a=0;;a+=1){e.controller.signal.throwIfAborted(),this.update(e,{status:t,message:n});try{return await this.withTimeout(e,r,i)}catch(t){if(e.controller.signal.aborted||!$t(t)||a>=Xt.length)throw t;let n=Xt[a];this.update(e,{status:`retrying`,message:`网络请求失败，${n/1e3} 秒后自动重试（${a+1}/${Xt.length}）…`}),await this.wait(e,n)}}}async withTimeout(e,t,n){e.controller.signal.throwIfAborted();let r=new AbortController,i=()=>r.abort();e.controller.signal.addEventListener(`abort`,i,{once:!0});let a=!1,o=setTimeout(()=>{a=!0,r.abort()},t);try{return await n(r.signal)}catch(e){throw a?new Yt:e}finally{clearTimeout(o),e.controller.signal.removeEventListener(`abort`,i)}}wait(e,t){return new Promise((n,r)=>{let i=e.controller.signal,a=()=>{clearTimeout(o),r(i.reason)},o=setTimeout(()=>{i.removeEventListener(`abort`,a),n()},t);i.addEventListener(`abort`,a,{once:!0}),i.aborted&&a()})}}}));function nn(){let e=(0,X.useContext)(an);if(!e)throw Error(`Photo uploads context missing`);return e}function rn({children:e}){let[t]=(0,X.useState)(()=>new en),n=(0,X.useRef)(new Map),r=(0,X.useSyncExternalStore)(t.subscribe,t.getSnapshot);return(0,X.useEffect)(()=>()=>{t.getSnapshot().forEach(e=>L.dismiss(`photo-upload-${e.id}`)),t.dispose()},[t]),(0,X.useEffect)(()=>{for(let e of r){if(n.current.get(e.id)===e)continue;n.current.set(e.id,e);let r=`photo-upload-${e.id}`,i=e.status===`completed`||e.status===`failed`,a=`/mistakes/${e.mistakeId}/edit?photo=${e.purpose}`,o=(0,Z.jsxs)(`div`,{className:`ai-toast-copy`,children:[(0,Z.jsxs)(`a`,{className:`ai-toast-link`,href:`#${a}`,children:[(0,Z.jsxs)(`span`,{children:[`记录 #`,e.mistakeId,` · `,e.message]}),(0,Z.jsx)(`small`,{children:`点击打开题目处理`})]}),e.status===`failed`&&(0,Z.jsx)(`button`,{type:`button`,onClick:n=>{n.stopPropagation(),t.retry(e.id)},children:`重试`})]}),s={type:e.status===`failed`?`error`:e.status===`completed`?`success`:`info`,isLoading:!i,autoClose:e.status===`completed`&&4500,closeButton:i,...It(a)};L.isActive(r)?L.update(r,{render:o,...s}):L(o,{toastId:r,...s})}},[r,t]),(0,Z.jsx)(an.Provider,{value:{queue:t,batches:r},children:e})}var X,Z,an,on=t((()=>{X=e(v()),yt(),tn(),Lt(),Z=C(),an=(0,X.createContext)(null)}));function sn({onLogin:e,onNotify:t}){let[n,r]=(0,Q.useState)(!1),[i,a]=(0,Q.useState)(``),[o,s]=(0,Q.useState)(``),[l,u]=(0,Q.useState)(``),[d,f]=(0,Q.useState)(!1),[p,m]=(0,Q.useState)(``),[h,v]=(0,Q.useState)(null),[ee,y]=(0,Q.useState)(``),[b,C]=(0,Q.useState)(0),[T,E]=(0,Q.useState)({status:`pending`,response:``}),[D,O]=(0,Q.useState)(0),k=(0,Q.useRef)(!1);(0,Q.useEffect)(()=>{let e=!0;return v(null),y(``),P(`/auth/config`).then(t=>{e&&v(t)}).catch(t=>{e&&y(t.message)}),()=>{e=!1}},[b]);let A=h!==null&&(!h.enabled||T.status===`complete`||!n&&T.status===`error`);function j(){E({status:`pending`,response:``}),O(e=>e+1)}async function M(r){if(r.preventDefault(),!k.current&&A){k.current=!0,f(!0),m(``);try{let r=await P(n?`/auth/register`:`/auth/login`,te({username:i.trim(),password:o,captchaResponse:h?.enabled?T.response:``,...n?{inviteCode:l.trim()}:{}}));t(n?`欢迎，${r.user.username}！账号已创建。`:`欢迎回来，${r.user.username}！`),e(r.user)}catch(e){m(e.message),L.error(e.message),j()}finally{k.current=!1,f(!1)}}}return(0,$.jsxs)(`div`,{className:`auth-page`,children:[(0,$.jsxs)(`aside`,{className:`auth-story`,children:[(0,$.jsxs)(`a`,{className:`brand`,href:`/`,"aria-label":`返回首页`,children:[(0,$.jsx)(bt,{}),(0,$.jsxs)(`span`,{className:`brand-text`,children:[`拾题`,(0,$.jsx)(`span`,{children:`把错题，学明白。`})]})]}),(0,$.jsxs)(`div`,{className:`auth-story-body`,children:[(0,$.jsxs)(`span`,{className:`small-pill`,children:[(0,$.jsx)(c,{size:16}),` 你的个人错题本`]}),(0,$.jsxs)(`h1`,{children:[`做错的题，`,(0,$.jsx)(`br`,{}),`值得再想一遍。`]}),(0,$.jsxs)(`p`,{children:[`记录卡住你的那一步，梳理知识点。`,(0,$.jsx)(`br`,{}),`再练一次，让「不熟」慢慢变成「掌握」。`]}),(0,$.jsxs)(`div`,{className:`auth-note`,children:[(0,$.jsxs)(`div`,{className:`auth-note-top`,children:[(0,$.jsxs)(`span`,{children:[(0,$.jsx)(c,{size:18}),` 我的学习笔记`]}),(0,$.jsx)(`span`,{className:`note-dots`,children:`•••`})]}),(0,$.jsx)(`div`,{className:`note-rule long`}),(0,$.jsx)(`div`,{className:`note-rule`}),(0,$.jsxs)(`div`,{className:`auth-note-bottom`,children:[(0,$.jsxs)(`span`,{children:[(0,$.jsx)(S,{size:17}),` 记录 · 整理 · 复习`]}),(0,$.jsx)(`span`,{className:`note-check`,children:(0,$.jsx)(S,{size:25})})]})]})]}),(0,$.jsx)(`div`,{className:`auth-story-footer`,children:`记录问题 · 理清思路 · 回顾练习`})]}),(0,$.jsx)(`main`,{className:`auth-form-area`,children:(0,$.jsxs)(`div`,{className:`auth-form-wrap`,children:[(0,$.jsx)(`div`,{className:`auth-icon`,children:(0,$.jsx)(_,{size:30})}),(0,$.jsx)(`h2`,{children:n?`开始积累，遇见进步`:`欢迎回来`}),(0,$.jsx)(`p`,{className:`auth-subtitle`,children:n?`使用邀请码创建账号，开启你的错题本。`:`登录后，继续整理你的学习收获。`}),(0,$.jsxs)(`form`,{onSubmit:M,children:[(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`用户名`}),(0,$.jsx)(`input`,{required:!0,autoComplete:`username`,minLength:3,maxLength:32,placeholder:`输入用户名`,value:i,onChange:e=>a(e.target.value)})]}),(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`密码`}),(0,$.jsx)(`input`,{required:!0,type:`password`,autoComplete:n?`new-password`:`current-password`,minLength:n?8:void 0,maxLength:128,placeholder:n?`至少 8 位密码`:`输入密码`,value:o,onChange:e=>s(e.target.value)})]}),n&&(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`邀请码`}),(0,$.jsx)(`input`,{required:!0,placeholder:`输入管理员提供的邀请码`,value:l,onChange:e=>u(e.target.value)}),(0,$.jsx)(`small`,{children:`邀请码由管理员生成。`})]}),!h&&(ee?(0,$.jsxs)(`div`,{className:`auth-captcha-notice is-error`,role:`alert`,children:[(0,$.jsxs)(`span`,{children:[`安全配置加载失败：`,ee]}),(0,$.jsx)(`button`,{type:`button`,onClick:()=>C(e=>e+1),children:`重新加载`})]}):(0,$.jsxs)(`div`,{className:`auth-captcha-loading`,role:`status`,children:[(0,$.jsx)(x,{className:`spin`,size:16}),` 正在加载安全验证…`]})),h?.enabled&&(0,$.jsxs)(`div`,{className:`auth-captcha`,children:[(0,$.jsx)(wt,{sitekey:h.sitekey,resetKey:D,onChange:E},`${n}-${D}`),(T.status===`error`||T.status===`expired`)&&(0,$.jsxs)(`div`,{className:`auth-captcha-notice`,role:`status`,children:[(0,$.jsx)(`span`,{children:T.status===`expired`?`验证已过期，请重新验证。`:n?`人机验证暂不可用，请重试后再注册。`:`人机验证暂不可用，你可以重试或尝试登录。`}),(0,$.jsx)(`button`,{type:`button`,disabled:d,onClick:j,children:`重新验证`})]})]}),p&&(0,$.jsx)(`div`,{className:`form-error`,role:`alert`,children:p}),(0,$.jsx)(`button`,{className:`button primary auth-submit`,disabled:d||!A,children:d?(0,$.jsx)(x,{className:`spin`,size:18}):(0,$.jsxs)($.Fragment,{children:[n?`创建账号`:`登录`,(0,$.jsx)(w,{size:18})]})})]}),(0,$.jsxs)(`div`,{className:`auth-switch`,children:[n?`已有账号？`:`还没有账号？`,(0,$.jsx)(`button`,{disabled:d,onClick:()=>{k.current||(r(!n),m(``),j())},children:n?`立即登录`:`使用邀请码注册`})]}),(0,$.jsxs)(`div`,{className:`auth-secure`,children:[(0,$.jsx)(g,{size:15}),` 你的错题与笔记，仅对你可见`]})]})})]})}function cn(){let[e,t]=(0,Q.useState)(null),[n,r]=(0,Q.useState)(!0),[a,o]=(0,Q.useState)([]),[c,u]=(0,Q.useState)([]),[d,p]=(0,Q.useState)(``),[h,g]=(0,Q.useState)(!1),[_,v]=(0,Q.useState)(window.location.hash.slice(1)||`/mistakes`),[y,b]=(0,Q.useState)({session:0,recordId:null}),x=(0,Q.useRef)(null);(0,Q.useEffect)(()=>{let e=!0,n=(window.location.hash.slice(1)||`/mistakes`).split(`?`)[0];P(`/auth/me`).then(r=>{e&&(r.user&&[`/mistakes`,`/`].includes(n)&&(x.current=`欢迎回来，${r.user.username}！`),t(r.user))}).catch(()=>{e&&t(null)}).finally(()=>{e&&r(!1)});let i=e=>{let t=window.location.hash.slice(1)||`/mistakes`;if(!window.dispatchEvent(new CustomEvent(`mistakes:before-navigate`,{cancelable:!0,detail:{path:t}}))){window.history.replaceState(null,``,new URL(e.oldURL).hash||`#/mistakes`);return}let n=t.split(`?`)[0];b(e=>n===`/new`?{session:e.session+1,recordId:null}:e.recordId&&n!==`/mistakes/${e.recordId}/edit`?{...e,recordId:null}:e),v(t),window.scrollTo(0,0)};return window.addEventListener(`hashchange`,i),()=>{e=!1,window.removeEventListener(`hashchange`,i)}},[]);let S=(0,Q.useCallback)((e,t=`success`)=>{L[t](e)},[]);(0,Q.useEffect)(()=>{if(e&&x.current){let e=x.current;x.current=null,S(e)}},[e,S]);let C=(0,Q.useCallback)(async()=>{try{let[e,t]=await Promise.all([P(`/subjects`),P(`/knowledge-points`)]);o(e),u(i(t,e)),p(``)}catch(e){p(e.message)}},[]);(0,Q.useEffect)(()=>{e&&C()},[e,C]),(0,Q.useEffect)(()=>{if(!e){g(!1);return}let t=!0,n=!1,r=0,i=async()=>{if(n||document.hidden)return;n=!0;let e=r;try{let n=await P(`/system/status`,{},{background:!0});t&&r===e&&g(n.readOnly)}catch{}finally{n=!1}},a=e=>{let t=e.detail;typeof t?.readOnly==`boolean`&&(r+=1,g(t.readOnly))},o=()=>{i()};window.addEventListener(`mistakes:backup-status`,a),window.addEventListener(`focus`,o),document.addEventListener(`visibilitychange`,o);let s=window.setInterval(()=>{i()},15e3);return i(),()=>{t=!1,window.clearInterval(s),window.removeEventListener(`mistakes:backup-status`,a),window.removeEventListener(`focus`,o),document.removeEventListener(`visibilitychange`,o)}},[e?.id]);let T=(0,Q.useCallback)(async()=>{if(window.dispatchEvent(new Event(`mistakes:before-logout`,{cancelable:!0}))){window.dispatchEvent(new Event(`mistakes:session-ending`));try{await P(`/auth/logout`,te({})),S(`已退出登录。`),t(null),o([]),u([]),window.location.hash=`/mistakes`}catch(e){window.dispatchEvent(new Event(`mistakes:session-resumed`)),S(e.message,`error`)}}},[S]),E=_.split(`?`)[0],D=E.match(/^\/mistakes\/(\d+)(\/edit)?$/),O=D?D[2]?`editor`:`detail`:_n[E]||`library`,k=D?`/mistakes`:E===`/page-imports`?`/new`:E,A;A=E===`/new`?(0,$.jsx)(un,{onCreated:e=>b(t=>({...t,recordId:e}))},`new-${y.session}`):E===`/page-imports`?(0,$.jsx)(hn,{}):D?.[2]?(0,$.jsx)(un,{id:Number(D[1])},y.recordId===Number(D[1])?`new-${y.session}`:E):D?(0,$.jsx)(dn,{id:Number(D[1])},_):E===`/review`?(0,$.jsx)(fn,{},_):E===`/stats`?(0,$.jsx)(pn,{}):E===`/ai-tasks`?(0,$.jsx)(gn,{}):E===`/settings`?(0,$.jsx)(mn,{}):(0,$.jsx)(ln,{});let M=e?(0,$.jsx)(s.Provider,{value:{user:e,updateUser:t,subjects:a,knowledgePoints:c,refreshDirectory:C,notify:S,logout:T},children:(0,$.jsx)(Bt,{children:(0,$.jsx)(rn,{children:(0,$.jsxs)(`div`,{className:`app-shell`,children:[(0,$.jsxs)(`aside`,{className:`sidebar`,children:[(0,$.jsxs)(`a`,{className:`brand`,href:`#/mistakes`,children:[(0,$.jsx)(bt,{}),(0,$.jsxs)(`span`,{className:`brand-text`,children:[`拾题`,(0,$.jsx)(`span`,{children:`把错题，学明白。`})]})]}),(0,$.jsx)(`div`,{className:`sidebar-label`,children:`学习空间`}),(0,$.jsx)(N,{value:k,ariaLabel:`主导航`,items:vn.map(({path:e,label:t,icon:n})=>({id:e,href:`#${e}`,label:(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(n,{size:19,strokeWidth:1.8}),(0,$.jsx)(`span`,{children:t})]})}))}),(0,$.jsxs)(`div`,{className:`sidebar-bottom`,children:[(0,$.jsxs)(`div`,{className:`sidebar-reminder`,children:[(0,$.jsx)(`span`,{className:`reminder-icon`,children:(0,$.jsx)(f,{size:22})}),(0,$.jsx)(`strong`,{children:`温故而知新，可以为师矣`}),(0,$.jsx)(`a`,{href:`#/review`,children:`打开复习页`})]}),(0,$.jsxs)(`div`,{className:`account`,children:[(0,$.jsxs)(`a`,{className:`account-profile`,href:`#/settings`,children:[(0,$.jsx)(`span`,{className:`avatar`,children:e.avatar?(0,$.jsx)(`img`,{src:e.avatar,alt:``}):e.username.slice(0,1).toUpperCase()}),(0,$.jsxs)(`span`,{className:`account-name`,children:[(0,$.jsx)(`strong`,{title:e.username,children:e.username}),(0,$.jsx)(`small`,{children:e.role===`admin`?`管理员`:`我的账号`})]})]}),(0,$.jsx)(`button`,{className:`icon-button`,title:`退出登录`,"aria-label":`退出登录`,onClick:T,children:(0,$.jsx)(ee,{size:17})})]})]})]}),(0,$.jsxs)(`div`,{className:`main-shell`,children:[(0,$.jsxs)(`header`,{className:`topbar`,children:[(0,$.jsxs)(`span`,{className:`topbar-label`,children:[(0,$.jsx)(m,{size:15}),` 个人学习空间`]}),(0,$.jsxs)(`div`,{className:`topbar-right`,children:[(0,$.jsx)(zt,{}),(0,$.jsxs)(`a`,{className:`workspace-state`,href:`/`,children:[(0,$.jsx)(w,{size:16}),` 返回个人主页`]}),(0,$.jsx)(`a`,{className:`topbar-avatar`,href:`#/settings`,"aria-label":`账号设置`,children:e.avatar?(0,$.jsx)(`img`,{src:e.avatar,alt:``}):e.username.slice(0,1).toUpperCase()})]})]}),(0,$.jsxs)(`main`,{className:`main-content`,children:[h&&(0,$.jsxs)(`div`,{className:`backup-readonly-banner`,role:`status`,children:[(0,$.jsx)(l,{size:20}),(0,$.jsxs)(`p`,{children:[(0,$.jsx)(`strong`,{children:`正在备份，暂时只读`}),(0,$.jsx)(`span`,{children:`已输入的内容会保留，请稍后重试保存。`})]})]}),d&&(0,$.jsxs)(`div`,{className:`inline-alert`,role:`alert`,children:[`基础目录加载失败：`,d,(0,$.jsx)(`button`,{onClick:C,children:`重试`})]}),(0,$.jsx)(Pt,{resetKey:E,children:(0,$.jsx)(Q.Suspense,{fallback:(0,$.jsx)(j,{loading:!0,kind:O,children:null}),children:A})}),(0,$.jsx)(`footer`,{className:`page-footer`,children:(0,$.jsxs)(`span`,{children:[`拾题 · © `,new Date().getFullYear(),` ShaoanC`]})})]})]})]})})},e.id)}):(0,$.jsx)(sn,{onLogin:e=>{t(e),v(`/mistakes`),window.location.hash=`/mistakes`},onNotify:e=>{x.current=e}});return(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(F,{}),(0,$.jsx)(j,{loading:n,kind:`shell`,className:`app-entrance`,children:!n&&M})]})}var Q,$,ln,un,dn,fn,pn,mn,hn,gn,_n,vn,yn=t((()=>{Q=e(v()),yt(),y(),A(),a(),O(),St(),Ot(),Jt(),on(),Ft(),$=C(),ne(),ln=(0,Q.lazy)(()=>I(()=>import(`./MistakesPage-BMzuNng6.js`).then(e=>({default:e.MistakesPage})),__vite__mapDeps([10,1,3,4,5,11,12,6,7,8,9,13,14,15,16,17,18]))),un=(0,Q.lazy)(()=>I(()=>import(`./EditorPage-DhLCXpJG.js`).then(e=>({default:e.EditorPage})),__vite__mapDeps([19,1,3,4,5,6,7,8,9,13,20,21,22,23]))),dn=(0,Q.lazy)(()=>I(()=>import(`./DetailPage-DWp8QXLm.js`).then(e=>({default:e.DetailPage})),__vite__mapDeps([24,1,3,4,5,6,7,8,9,13,21,22,14,15,11,12,16]))),fn=(0,Q.lazy)(()=>I(()=>import(`./ReviewPage-BV2hf-Yz.js`).then(e=>({default:e.ReviewPage})),__vite__mapDeps([25,1,3,4,5,6,7,8,9,13,17]))),pn=(0,Q.lazy)(()=>I(()=>import(`./StatsPage-BlM1avnY.js`).then(e=>({default:e.StatsPage})),__vite__mapDeps([26,1,3,4,27,5,12,8]))),mn=(0,Q.lazy)(()=>I(()=>import(`./SettingsPage-B6SVLdIX.js`).then(e=>({default:e.SettingsPage})),__vite__mapDeps([28,1,3,4,5,7,8,29]))),hn=(0,Q.lazy)(()=>I(()=>import(`./PageImports-D_Mt498m.js`).then(e=>({default:e.PageImportsPage})),__vite__mapDeps([30,1,3,4,5,20,31]))),gn=(0,Q.lazy)(()=>I(()=>import(`./AiTaskManager-C8-pyV4q.js`).then(e=>({default:e.AiTasksPage})),__vite__mapDeps([2,1,3,4,5,6,7,8,9]))),_n={"/new":`editor`,"/page-imports":`editor`,"/review":`review`,"/stats":`stats`,"/ai-tasks":`rows`,"/settings":`settings`},vn=[{path:`/mistakes`,label:`我的错题`,icon:T},{path:`/new`,label:`录入错题`,icon:p},{path:`/review`,label:`复习`,icon:f},{path:`/stats`,label:`学习统计`,icon:b},{path:`/ai-tasks`,label:`AI 任务`,icon:d},{path:`/settings`,label:`设置`,icon:u}]})),bn=t((()=>{})),xn=t((()=>{}));n((()=>{var t=e(v()),n=e(o());yt(),yn(),bn(),xn();var r=C();n.createRoot(document.getElementById(`root`)).render((0,r.jsxs)(t.StrictMode,{children:[(0,r.jsx)(cn,{}),(0,r.jsx)(Ve,{className:`mistakes-toast-container`,position:`top-right`,autoClose:4500,transition:mt,theme:`light`,limit:3,newestOnTop:!0,closeOnClick:!1})]}))}))();export{Kt as a,Gt as c,jt as d,yt as f,Ut as i,Rt as l,nn as n,Jt as o,L as p,Ht as r,Wt as s,on as t,At as u};