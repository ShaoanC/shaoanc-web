const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/sdk-LxJ6YTVI.js","assets/rolldown-runtime-8BhlS34s.js","assets/AiTaskManager-BXh1FIuE.js","assets/body-fonts-KHXgn7lf.js","assets/jsx-runtime-1iBoLgJP.js","assets/body-fonts-D2pN-qLK.css","assets/MarkdownContent-C1ALVI6f.js","assets/components-BcWDGCeW.js","assets/MarkdownContent-B_AG56q7.css","assets/Select-D6r2duSU.js","assets/library-pagination-Srq0vuK8.js","assets/library-pagination-DqaJHoO0.css","assets/DetailPage-BufPdj70.js","assets/MobileDrawer-CMuk0_jT.js","assets/MobileDrawer-CsUHbD3o.css","assets/export-selection-Qj-TQv3O.js","assets/export-selection-B9fFTg56.css","assets/StarRating-BgFpErSB.js","assets/ImageHistory-CfB4ZYdZ.js","assets/EditorPage-BW8LmWcO.js","assets/ImageRegions-Bl1_htwC.js","assets/EditorPage-DJOnVxEf.css","assets/MistakesPage-DQodx-99.js","assets/ReviewPage-sQjU7I4S.js","assets/StatsPage--Wt8JAzQ.js","assets/clsx-DNZXw_RA.js","assets/SettingsPage-D8FuAY71.js","assets/PageImports-Blv8rn0_.js","assets/PageImports-RKBO6lQU.css"])))=>i.map(i=>d[i]);
import{i as e,n as t,t as n}from"./rolldown-runtime-8BhlS34s.js";import{Dn as r,En as i,Sn as a,Tn as o,a as s,h as c,i as l,l as u,n as d,o as f,p,pt as m,qt as h,r as g,s as _,st as v,t as y,wn as b,xn as x}from"./body-fonts-KHXgn7lf.js";import{$ as S,Ft as ee,N as C,Nn as w,T,Tn as E,Tt as D,_t as te,a as O,an as ne,j as k,n as A,p as j,pt as re,q as ie,qt as ae,t as M,tn as oe,xn as se}from"./jsx-runtime-1iBoLgJP.js";import{n as ce,t as le}from"./clsx-DNZXw_RA.js";import{n as ue,r as de,t as fe}from"./MobileDrawer-CMuk0_jT.js";function pe(e,t,n=300){let{scrollHeight:r,style:i}=e;requestAnimationFrame(()=>{i.minHeight=`initial`,i.height=r+`px`,i.transition=`all ${n}ms`,requestAnimationFrame(()=>{i.height=`0`,i.padding=`0`,i.margin=`0`,setTimeout(t,n)})})}function me({enter:e,exit:t,appendPosition:n=!1,collapse:r=!0,collapseDuration:i=300}){return function({children:a,position:o,preventExitTransition:s,done:c,nodeRef:l,isIn:u,playToast:d}){let f=n?`${e}--${o}`:e,p=n?`${t}--${o}`:t,m=(0,Ge.useRef)(0);return(0,Ge.useLayoutEffect)(()=>{let e=l.current,t=f.split(` `),n=r=>{r.target===l.current&&(d(),e.removeEventListener(`animationend`,n),e.removeEventListener(`animationcancel`,n),m.current===0&&r.type!==`animationcancel`&&e.classList.remove(...t))};e.classList.add(...t),e.addEventListener(`animationend`,n),e.addEventListener(`animationcancel`,n)},[]),(0,Ge.useEffect)(()=>{let e=l.current,t=()=>{e.removeEventListener(`animationend`,t),r?pe(e,c,i):c()};u||(s?t():(m.current=1,e.className+=` ${p}`,e.addEventListener(`animationend`,t)))},[u]),Ge.createElement(Ge.Fragment,null,a)}}function he(e,t){return{content:ge(e.content,e.props),containerId:e.props.containerId,id:e.props.toastId,theme:e.props.theme,type:e.props.type,data:e.props.data||{},isLoading:e.props.isLoading,icon:e.props.icon,reason:e.removalReason,status:t}}function ge(e,t,n=!1){return(0,Ke.isValidElement)(e)&&!nt(e.type)?(0,Ke.cloneElement)(e,{closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):F(e)?e({closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):e}function _e({closeToast:e,theme:t,ariaLabel:n=`close`}){return qe.createElement(`button`,{className:`Toastify__close-button Toastify__close-button--${t}`,type:`button`,onClick:t=>{t.stopPropagation(),e(!0)},"aria-label":n},qe.createElement(`svg`,{"aria-hidden":`true`,viewBox:`0 0 14 16`},qe.createElement(`path`,{fillRule:`evenodd`,d:`M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z`})))}function ve({delay:e,isRunning:t,closeToast:n,type:r=`default`,hide:i,className:a,controlledProgress:o,progress:s,rtl:c,isIn:l,theme:u}){let d=i||o&&s===0,f={animationDuration:`${e}ms`,animationPlayState:t?`running`:`paused`};o&&(f.transform=`scaleX(${s})`);let p=le(`Toastify__progress-bar`,o?`Toastify__progress-bar--controlled`:`Toastify__progress-bar--animated`,`Toastify__progress-bar-theme--${u}`,`Toastify__progress-bar--${r}`,{"Toastify__progress-bar--rtl":c}),m=F(a)?a({rtl:c,type:r,defaultClassName:p}):le(p,a),h={[o&&s>=1?`onTransitionEnd`:`onAnimationEnd`]:o&&s<1?null:()=>{l&&n()}};return Je.createElement(`div`,{className:`Toastify__progress-bar--wrp`,"data-hidden":d},Je.createElement(`div`,{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${u} Toastify__progress-bar--${r}`}),Je.createElement(`div`,{role:`progressbar`,"aria-hidden":d?`true`:`false`,"aria-label":`notification timer`,"aria-valuenow":o?Math.round(s*100):void 0,"aria-valuemin":0,"aria-valuemax":100,className:m,style:f,...h}))}function ye(e,t,n){let r=1,i=0,a=[],o=[],s=t,c=new Map,l=new Set,u=e=>(l.add(e),()=>l.delete(e)),d=()=>{o=Array.from(c.values()),l.forEach(e=>e())},f=({containerId:t,toastId:n,updateId:r})=>{let i=t?t!==e:e!==1,a=c.has(n)&&r==null;return i||a},p=(e,t)=>{c.forEach(n=>{var r;(t==null||t===n.props.toastId)&&((r=n.toggle)==null||r.call(n,e))})},m=e=>{var t,r;e.isActive&&((r=(t=e.props)?.onClose)==null||r.call(t,e.removalReason),e.isActive=!1,n(he(e,`removed`)))},h=e=>{if(e==null)c.forEach(m);else{let t=c.get(e);t&&m(t)}d()},g=()=>{i-=a.length,a=[]},_=e=>{var t,r;let{toastId:i,updateId:a}=e.props,o=a==null;e.staleId&&c.delete(e.staleId),e.isActive=!0,c.set(i,e),d(),n(he(e,o?`added`:`updated`)),o&&((r=(t=e.props).onOpen)==null||r.call(t))};return{id:e,props:s,observe:u,toggle:p,removeToast:h,toasts:c,clearQueue:g,buildToast:(e,t)=>{if(f(t))return;let{toastId:n,updateId:o,data:l,staleId:u,delay:p}=t,m=o==null;m&&i++;let g={...s,style:s.toastStyle,key:r++,...Object.fromEntries(Object.entries(t).filter(([e,t])=>t!=null)),toastId:n,updateId:o,data:l,isIn:!1,className:it(t.className||s.toastClassName),progressClassName:it(t.progressClassName||s.progressClassName),autoClose:!t.isLoading&&at(t.autoClose,s.autoClose),closeToast(e){let t=c.get(n);t&&(t.removalReason=e,h(n))},deleteToast(){if(c.get(n)!=null){if(c.delete(n),i--,i<0&&(i=0),a.length>0){_(a.shift());return}d()}}};g.closeButton=s.closeButton,t.closeButton===!1||ot(t.closeButton)?g.closeButton=t.closeButton:t.closeButton===!0&&(g.closeButton=!ot(s.closeButton)||s.closeButton);let v={content:e,props:g,staleId:u};s.limit&&s.limit>0&&i>s.limit&&m?a.push(v):tt(p)?setTimeout(()=>{_(v)},p):_(v)},setProps(e){s=e},setToggle:(e,t)=>{let n=c.get(e);n&&(n.toggle=t)},isToastActive:e=>c.get(e)?.isActive,getSnapshot:()=>o}}function be(){lt.forEach(e=>Ce(e.content,e.options)),lt=[]}function xe(e,t){var n;if(t)return!!((n=I.get(t))!=null&&n.isToastActive(e));let r=!1;return I.forEach(t=>{t.isToastActive(e)&&(r=!0)}),r}function Se(e){if(!ft()){lt=lt.filter(t=>e!=null&&t.options.toastId!==e);return}if(e==null||rt(e))I.forEach(t=>{t.removeToast(e)});else if(e&&(`containerId`in e||`id`in e)){let t=I.get(e.containerId);t?t.removeToast(e.id):I.forEach(t=>{t.removeToast(e.id)})}}function Ce(e,t){ot(e)&&(ft()||lt.push({content:e,options:t}),I.forEach(n=>{n.buildToast(e,t)}))}function we(e){var t;(t=I.get(e.containerId||1))==null||t.setToggle(e.id,e.fn)}function Te(e,t){I.forEach(n=>{(t==null||!(t!=null&&t.containerId)||t?.containerId===n.id)&&n.toggle(e,t?.id)})}function Ee(e){let t=e.containerId||1;return{subscribe(n){let r=ye(t,e,dt);I.set(t,r);let i=r.observe(n);return be(),()=>{i(),I.delete(t)}},setProps(e){var n;(n=I.get(t))==null||n.setProps(e)},getSnapshot(){return I.get(t)?.getSnapshot()}}}function De(e){return ut.add(e),()=>{ut.delete(e)}}function Oe(e){return e&&(nt(e.toastId)||tt(e.toastId))?e.toastId:ct()}function ke(e,t){return Ce(e,t),t.toastId}function Ae(e,t){return{...t,type:t&&t.type||e,toastId:Oe(t)}}function je(e){return(t,n)=>ke(t,Ae(e,n))}function N(e,t){return ke(e,Ae(`default`,t))}function Me(e,{pending:t,error:n,success:r},i){let a;t&&(a=nt(t)?N.loading(t,i):N.loading(t.render,{...i,...t}));let o={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},s=(e,t,n)=>{if(t==null){N.dismiss(a);return}let r={type:e,...o,...i,data:n},s=nt(t)?{render:t}:t;return a?N.update(a,{...r,...s}):N(s.render,{...r,...s}),n},c=F(e)?e():e;return c.then(e=>s(`success`,r,e)).catch(e=>s(`error`,n,e)),c}function Ne(e){Se(e)}function Pe(e){let{subscribe:t,getSnapshot:n,setProps:r}=(0,Xe.useRef)(Ee(e)).current;r(e);let i=(0,Xe.useSyncExternalStore)(t,n,n)?.slice();function a(t){if(!i)return[];let n=new Map;return e.newestOnTop&&i.reverse(),i.forEach(e=>{let{position:t}=e.props;n.has(t)||n.set(t,[]),n.get(t).push(e)}),Array.from(n,e=>t(e[0],e[1]))}return{getToastToRender:a,isToastActive:xe,count:i?.length}}function Fe(e){let[t,n]=(0,Ze.useState)(!1),[r,i]=(0,Ze.useState)(!1),a=(0,Ze.useRef)(null),o=(0,Ze.useRef)({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:s,pauseOnHover:c,closeToast:l,onClick:u,closeOnClick:d}=e;we({id:e.toastId,containerId:e.containerId,fn:n}),(0,Ze.useEffect)(()=>{if(e.pauseOnFocusLoss)return f(),()=>{p()}},[e.pauseOnFocusLoss]);function f(){document.hasFocus()||_(),window.addEventListener(`focus`,g),window.addEventListener(`blur`,_)}function p(){window.removeEventListener(`focus`,g),window.removeEventListener(`blur`,_)}function m(t){if(e.draggable===!0||e.draggable===t.pointerType){v();let n=a.current;o.canCloseOnClick=!0,o.canDrag=!0,n.style.transition=`none`,e.draggableDirection===`x`?(o.start=t.clientX,o.removalDistance=n.offsetWidth*(e.draggablePercent/100)):(o.start=t.clientY,o.removalDistance=n.offsetHeight*(e.draggablePercent===80?e.draggablePercent*1.5:e.draggablePercent)/100)}}function h(t){let{top:n,bottom:r,left:i,right:o}=a.current.getBoundingClientRect();t.pointerType===`mouse`&&e.pauseOnHover&&t.clientX>=i&&t.clientX<=o&&t.clientY>=n&&t.clientY<=r?_():g()}function g(){n(!0)}function _(){n(!1)}function v(){o.didMove=!1,document.addEventListener(`pointermove`,b),document.addEventListener(`pointerup`,x)}function y(){document.removeEventListener(`pointermove`,b),document.removeEventListener(`pointerup`,x)}function b(n){let r=a.current;if(o.canDrag&&r){o.didMove=!0,t&&_(),e.draggableDirection===`x`?o.delta=n.clientX-o.start:o.delta=n.clientY-o.start,o.start!==n.clientX&&(o.canCloseOnClick=!1);let i=e.draggableDirection===`x`?`${o.delta}px, var(--y)`:`0, calc(${o.delta}px + var(--y))`;r.style.transform=`translate3d(${i},0)`,r.style.opacity=`${1-Math.abs(o.delta/o.removalDistance)}`}}function x(){y();let t=a.current;if(o.canDrag&&o.didMove&&t){if(o.canDrag=!1,Math.abs(o.delta)>o.removalDistance){i(!0),e.closeToast(!0),e.collapseAll();return}t.style.transition=`transform 0.2s, opacity 0.2s`,t.style.removeProperty(`transform`),t.style.removeProperty(`opacity`)}}let S={onPointerDown:m,onPointerUp:h};return s&&c&&(S.onMouseEnter=_,e.stacked||(S.onMouseLeave=g)),d&&(S.onClick=e=>{u&&u(e),o.canCloseOnClick&&l(!0)}),{playToast:g,pauseToast:_,isRunning:t,preventExitTransition:r,toastRef:a,eventHandlers:S}}function Ie(e){return P.createElement(gt,{...e},P.createElement(`path`,{d:`M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z`}))}function Le(e){return P.createElement(gt,{...e},P.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z`}))}function Re(e){return P.createElement(gt,{...e},P.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z`}))}function ze(e){return P.createElement(gt,{...e},P.createElement(`path`,{d:`M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z`}))}function Be(){return P.createElement(`div`,{className:`Toastify__spinner`})}function Ve({theme:e,type:t,isLoading:n,icon:r}){let i=null,a={theme:e,type:t};return r===!1||(F(r)?i=r({...a,isLoading:n}):(0,P.isValidElement)(r)?i=(0,P.cloneElement)(r,a):n?i=_t.spinner():vt(t)&&(i=_t[t](a))),i}function He(e){let t={...Ct,...e},n=e.stacked,[r,i]=(0,Ye.useState)(!0),a=(0,Ye.useRef)(null),{getToastToRender:o,isToastActive:s,count:c}=Pe(t),{className:l,style:u,rtl:d,containerId:f,hotKeys:p}=t;function m(e){let t=le(`Toastify__toast-container`,`Toastify__toast-container--${e}`,{"Toastify__toast-container--rtl":d});return F(l)?l({position:e,rtl:d,defaultClassName:t}):le(t,it(l))}function h(){n&&(i(!0),N.play())}return ht(()=>{if(n){let e=a.current.querySelectorAll(`[data-in="true"]`),n=t.position?.includes(`top`),i=0,o=0;Array.from(e).reverse().forEach((e,t)=>{let a=e;a.classList.add(`Toastify__toast--stacked`),t>0&&(a.dataset.collapsed=`${r}`),a.dataset.pos||(a.dataset.pos=n?`top`:`bot`);let s=i*(r?.2:1)+(r?0:12*t),c=Math.max(.5,1-(r?o:0));a.style.setProperty(`--y`,`${n?s:s*-1}px`),a.style.setProperty(`--g`,`12`),a.style.setProperty(`--s`,`${c}`),i+=a.offsetHeight,o+=.025})}},[r,c,n]),(0,Ye.useEffect)(()=>{function e(e){var t;let n=a.current;p(e)&&((t=n?.querySelector(`[tabIndex="0"]`))==null||t.focus(),i(!1),N.pause()),e.key===`Escape`&&(document.activeElement===n||n!=null&&n.contains(document.activeElement))&&(i(!0),N.play())}return document.addEventListener(`keydown`,e),()=>{document.removeEventListener(`keydown`,e)}},[p]),Ye.createElement(`section`,{ref:a,className:`Toastify`,id:f,onMouseEnter:()=>{n&&(i(!1),N.pause())},onMouseLeave:h,"aria-live":`polite`,"aria-atomic":`false`,"aria-relevant":`additions text`,"aria-label":t[`aria-label`]},o((e,t)=>{let r=t.length?{...u}:{...u,pointerEvents:`none`};return Ye.createElement(`div`,{tabIndex:-1,className:m(e),"data-stacked":n,style:r,key:`c-${e}`},t.map(({content:e,props:t})=>Ye.createElement(yt,{...t,stacked:n,collapseAll:h,isIn:s(t.toastId,t.containerId),key:`t-${t.key}`},e)))}))}function Ue(e){return Et(wt,e.nonce),et.createElement(He,{...e})}var We,Ge,Ke,qe,Je,Ye,Xe,Ze,Qe,$e,P,et,tt,nt,F,rt,it,at,ot,st,ct,I,lt,ut,dt,ft,pt,mt,ht,gt,_t,vt,yt,bt,xt,St,Ct,wt,Tt,Et,Dt=t((()=>{We=e(w(),1),Ge=e(w(),1),Ke=e(w(),1),qe=e(w(),1),Je=e(w(),1),ce(),Ye=e(w(),1),Xe=e(w(),1),Ze=e(w(),1),Qe=e(w(),1),$e=e(w(),1),P=e(w(),1),et=e(w(),1),tt=e=>typeof e==`number`&&!isNaN(e),nt=e=>typeof e==`string`,F=e=>typeof e==`function`,rt=e=>nt(e)||tt(e),it=e=>nt(e)||F(e)?e:null,at=(e,t)=>e===!1||tt(e)&&e>0?e:t,ot=e=>(0,We.isValidElement)(e)||nt(e)||F(e)||tt(e),st=1,ct=()=>`${st++}`,I=new Map,lt=[],ut=new Set,dt=e=>ut.forEach(t=>t(e)),ft=()=>I.size>0,pt=(e,{containerId:t})=>I.get(t||1)?.toasts.get(e),mt=(e={})=>{I.forEach(t=>{t.props.limit&&(!e.containerId||t.id===e.containerId)&&t.clearQueue()})},N.loading=(e,t)=>ke(e,Ae(`default`,{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...t})),N.promise=Me,N.success=je(`success`),N.info=je(`info`),N.error=je(`error`),N.warning=je(`warning`),N.warn=N.warning,N.dark=(e,t)=>ke(e,Ae(`default`,{theme:`dark`,...t})),N.dismiss=Ne,N.clearWaitingQueue=mt,N.isActive=xe,N.update=(e,t={})=>{let n=pt(e,t);if(n){let{props:r,content:i}=n,a={delay:100,...r,...t,toastId:t.toastId||e,updateId:ct()};a.toastId!==e&&(a.staleId=e);let o=a.render||i;delete a.render,ke(o,a)}},N.done=e=>{N.update(e,{progress:1})},N.onChange=De,N.play=e=>Te(!0,e),N.pause=e=>Te(!1,e),ht=typeof window<`u`?Qe.useLayoutEffect:Qe.useEffect,gt=({theme:e,type:t,isLoading:n,...r})=>P.createElement(`svg`,{viewBox:`0 0 24 24`,width:`100%`,height:`100%`,fill:e===`colored`?`currentColor`:`var(--toastify-icon-color-${t})`,...r}),_t={info:Le,warning:Ie,success:Re,error:ze,spinner:Be},vt=e=>e in _t,yt=e=>{let{isRunning:t,preventExitTransition:n,toastRef:r,eventHandlers:i,playToast:a}=Fe(e),{closeButton:o,children:s,autoClose:c,onClick:l,type:u,hideProgressBar:d,closeToast:f,transition:p,position:m,className:h,style:g,progressClassName:_,updateId:v,role:y,progress:b,rtl:x,toastId:S,deleteToast:ee,isIn:C,isLoading:w,closeOnClick:T,theme:E,ariaLabel:D}=e,te=le(`Toastify__toast`,`Toastify__toast-theme--${E}`,`Toastify__toast--${u}`,{"Toastify__toast--rtl":x},{"Toastify__toast--close-on-click":T}),O=F(h)?h({rtl:x,position:m,type:u,defaultClassName:te}):le(te,h),ne=Ve(e),k=!!b||!c,A={closeToast:f,type:u,theme:E},j=null;return o===!1||(j=F(o)?o(A):(0,$e.isValidElement)(o)?(0,$e.cloneElement)(o,A):_e(A)),$e.createElement(p,{isIn:C,done:ee,position:m,preventExitTransition:n,nodeRef:r,playToast:a},$e.createElement(`div`,{id:S,tabIndex:0,onClick:l,"data-in":C,className:O,...i,style:g,ref:r,...C&&{role:y,"aria-label":D}},ne!=null&&$e.createElement(`div`,{className:le(`Toastify__toast-icon`,{"Toastify--animate-icon Toastify__zoom-enter":!w})},ne),ge(s,e,!t),j,!e.customProgressBar&&$e.createElement(ve,{...v&&!k?{key:`p-${v}`}:{},rtl:x,theme:E,delay:c,isRunning:t,isIn:C,closeToast:f,hide:d,type:u,className:_,controlledProgress:k,progress:b||0})))},bt=(e,t=!1)=>({enter:`Toastify--animate Toastify__${e}-enter`,exit:`Toastify--animate Toastify__${e}-exit`,appendPosition:t}),xt=me(bt(`bounce`,!0)),St=me(bt(`slide`,!0)),me(bt(`zoom`)),me(bt(`flip`)),Ct={position:`top-right`,transition:xt,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:`touch`,draggablePercent:80,draggableDirection:`x`,role:`alert`,theme:`light`,"aria-label":`Notifications Alt+T`,hotKeys:e=>e.altKey&&e.code===`KeyT`},wt=`:root {
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
`,Tt=new Map,Et=(e,t)=>{ht(()=>{if(!e||typeof document>`u`)return;let n=document,r=Tt.get(n);if(r){t&&r.setAttribute(`nonce`,t);return}let i=n.createElement(`style`);i.textContent=e,t&&i.setAttribute(`nonce`,t),n.head.appendChild(i),Tt.set(n,i)},[t])}}));function Ot(e){return Rt.add(e),()=>{Rt.delete(e)}}function kt(){return Ft}function At(){return Lt}function jt(e){e>0&&Ft===0&&(It+=1),Ft+=e,Lt={pending:Ft,cycle:It},Rt.forEach(e=>e())}async function L(e,t={},n={}){n.background||jt(1);try{let n=await fetch(`${Pt}${e}`,{...t,credentials:`same-origin`,headers:{...t.body instanceof FormData?{}:{"Content-Type":`application/json`},...t.headers}}),r=await n.json().catch(e=>{if(e instanceof SyntaxError)return null;throw e});if(!n.ok||!r?.success)throw r?.code===`BACKUP_READ_ONLY`&&window.dispatchEvent(new CustomEvent(`mistakes:backup-status`,{detail:{readOnly:!0}})),new zt(r?.message||`请求失败，请稍后重试。`,n.status,r?.code);return t.method&&t.method!==`GET`&&window.dispatchEvent(new Event(`mistakes:updated`)),r.data}finally{n.background||jt(-1)}}function Mt(e,t=!1){let n=new Date(e);return Number.isNaN(n.getTime())?`—`:new Intl.DateTimeFormat(`zh-CN`,t?{month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`}:{year:`numeric`,month:`2-digit`,day:`2-digit`}).format(n)}function Nt(e){window.location.hash=e}var Pt,Ft,It,Lt,Rt,zt,Bt,Vt=t((()=>{Pt=`/api/mistakes`,Ft=0,It=0,Lt={pending:0,cycle:0},Rt=new Set,zt=class extends Error{status;code;constructor(e,t,n){super(e),this.status=t,this.code=n}},Bt=(e,t=`POST`)=>({method:t,body:JSON.stringify(e)})})),Ht=t((()=>{})),Ut=t((()=>{})),Wt=t((()=>{}));function R({children:e}){return(0,V.jsx)(`span`,{className:`skeleton-text skeleton-shimmer`,children:e})}function z({children:e=`保存设置`}){return(0,V.jsx)(`span`,{className:`button skeleton-button`,children:(0,V.jsx)(R,{children:e})})}function B({label:e}){return(0,V.jsxs)(`div`,{className:`field`,children:[(0,V.jsx)(`span`,{children:(0,V.jsx)(R,{children:e})}),(0,V.jsx)(`div`,{className:`skeleton-form-control skeleton-shimmer`,children:(0,V.jsx)(`input`,{disabled:!0,tabIndex:-1})})]})}function Gt({title:e,description:t}){return(0,V.jsxs)(`div`,{className:`panel-title`,children:[(0,V.jsx)(`span`,{className:`panel-title-icon`,children:(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`})}),(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`h2`,{children:(0,V.jsx)(R,{children:e})}),t&&(0,V.jsx)(`p`,{children:(0,V.jsx)(R,{children:t})})]})]})}function Kt({title:e,action:t,description:n}){return(0,V.jsxs)(`div`,{className:`page-header`,children:[(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`h1`,{children:(0,V.jsx)(R,{children:e})}),n&&(0,V.jsx)(`p`,{children:(0,V.jsx)(R,{children:n})})]}),t&&(0,V.jsx)(`div`,{className:`page-header-action`,children:(0,V.jsx)(z,{children:t})})]})}function qt(){return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsxs)(`div`,{className:`stats-grid stats-chart-grid`,children:[(0,V.jsxs)(`section`,{className:`panel stats-chart-panel`,children:[(0,V.jsx)(Gt,{title:`学科分布`,description:`各学科已归档错题的数量。`}),(0,V.jsx)(`div`,{className:`stats-chart-frame stats-subject-chart skeleton-subject-bars`,children:[48,78,35].map(e=>(0,V.jsx)(`span`,{className:`skeleton-shimmer`,style:{height:`${e}%`}},e))})]}),(0,V.jsxs)(`section`,{className:`panel stats-chart-panel stats-mastery-panel`,children:[(0,V.jsx)(Gt,{title:`掌握程度`,description:`按每道错题最近一次复习结果统计。`}),(0,V.jsxs)(`div`,{className:`stats-mastery-layout`,children:[(0,V.jsx)(`div`,{className:`stats-mastery-ring skeleton-mastery-ring`}),(0,V.jsx)(`ul`,{className:`stats-mastery-legend`,children:[`未复习`,`未掌握`,`待巩固`,`已掌握`].map(e=>(0,V.jsxs)(`li`,{className:`stats-mastery-item`,children:[(0,V.jsx)(`span`,{className:`stats-legend-dot skeleton-shimmer`}),(0,V.jsx)(`span`,{children:(0,V.jsx)(R,{children:e})}),(0,V.jsx)(`strong`,{children:(0,V.jsx)(R,{children:`0 道`})}),(0,V.jsx)(`span`,{children:(0,V.jsx)(R,{children:`0%`})})]},e))})]})]})]}),(0,V.jsxs)(`section`,{className:`panel knowledge-chart-panel stats-chart-panel`,children:[(0,V.jsx)(Gt,{title:`知识点分布`,description:`按主知识点查看已归档错题，最多展示数量最多的 8 项。`}),(0,V.jsx)(`div`,{className:`stats-chart-frame stats-knowledge-chart skeleton-knowledge-bars`,children:[74,92,55,38].map(e=>(0,V.jsxs)(`div`,{children:[(0,V.jsx)(R,{children:`知识点名称`}),(0,V.jsx)(`span`,{className:`skeleton-shimmer`,style:{width:`${e}%`}})]},e))})]})]})}function Jt(){return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsxs)(`div`,{className:`task-selection-bar`,children:[(0,V.jsxs)(`label`,{children:[(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,V.jsx)(R,{children:`选择本页可操作任务`})]}),(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`span`,{className:`table-button`,children:[(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,V.jsx)(R,{children:`重试`})]}),(0,V.jsxs)(`span`,{className:`table-button`,children:[(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,V.jsx)(R,{children:`取消`})]})]})]}),(0,V.jsx)(`div`,{className:`task-rows`,children:[0,1,2].map(e=>(0,V.jsxs)(`article`,{className:`task-row`,children:[(0,V.jsxs)(`div`,{className:`task-row-heading`,children:[(0,V.jsxs)(`div`,{className:`task-row-title`,children:[(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,V.jsx)(`h3`,{children:(0,V.jsx)(R,{children:`识别题目`})}),(0,V.jsx)(`span`,{className:`task-id`,children:(0,V.jsx)(R,{children:`#000`})})]}),(0,V.jsx)(`span`,{className:`task-status`,children:(0,V.jsx)(R,{children:`处理中`})})]}),(0,V.jsx)(`div`,{className:`task-excerpt`,children:(0,V.jsx)(R,{children:`正在读取错题内容，整理识别与解析结果。`})}),(0,V.jsxs)(`div`,{className:`task-meta`,children:[(0,V.jsx)(R,{children:`记录 #000`}),(0,V.jsx)(R,{children:`10月24日 12:00`}),(0,V.jsx)(R,{children:`本轮耗时 10 秒`}),(0,V.jsx)(R,{children:`尝试 1/3`})]}),(0,V.jsx)(`div`,{className:`task-row-actions`,children:(0,V.jsx)(z,{children:`打开错题`})})]},e))})]})}function Yt(){return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(Kt,{title:`AI 任务管理`,action:`录入错题`}),(0,V.jsx)(`p`,{className:`task-page-description`,children:(0,V.jsx)(R,{children:`上传后可以继续学习，AI 会在后台处理。完成后，在这里查看结果、校对或重试；不再需要的处理中、失败或待校对任务可直接取消。`})}),(0,V.jsxs)(`section`,{className:`task-manager`,children:[(0,V.jsxs)(`div`,{className:`task-sync-bar`,children:[(0,V.jsxs)(`span`,{children:[(0,V.jsx)(R,{children:`正在加载任务…`}),(0,V.jsx)(`small`,{children:(0,V.jsx)(R,{children:`正在同步任务状态`})})]}),(0,V.jsx)(z,{children:`刷新`})]}),(0,V.jsx)(`div`,{className:`task-filters skeleton-tabs`,children:[`全部`,`处理中`,`待校对`,`失败`,`已填入`,`已取消`].map(e=>(0,V.jsx)(`span`,{children:(0,V.jsxs)(R,{children:[e,` —`]})},e))}),(0,V.jsxs)(`div`,{className:`task-search-bar`,children:[(0,V.jsx)(`div`,{className:`task-search skeleton-input skeleton-shimmer`}),(0,V.jsx)(`div`,{className:`custom-select skeleton-input skeleton-shimmer`})]}),(0,V.jsx)(Jt,{}),(0,V.jsxs)(`div`,{className:`task-pagination`,children:[(0,V.jsx)(R,{children:`共 — 项`}),(0,V.jsx)(z,{children:`上一页　下一页`})]})]})]})}function Xt(){let{user:e}=o(),t=e.role===`admin`;return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(Kt,{title:`设置`,description:t?`管理账号安全、学习目录、AI 服务与全站数据备份。`:`修改用户名、头像与登录密码。`}),(0,V.jsx)(`div`,{className:`settings-tabs skeleton-tabs`,children:[`账号安全`,`知识点目录`,...t?[`AI 设置`,`数据备份`,`邀请码`,`用户账号`,`测试错题`]:[]].map(e=>(0,V.jsxs)(`span`,{children:[(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,V.jsx)(R,{children:e})]},e))}),(0,V.jsxs)(`div`,{className:`settings-account-layout`,children:[(0,V.jsxs)(`div`,{className:`settings-account-forms`,children:[(0,V.jsxs)(`section`,{className:`panel username-panel`,children:[(0,V.jsx)(Gt,{title:`修改用户名`,description:`修改后请使用新用户名登录。`}),(0,V.jsxs)(`div`,{className:`skeleton-settings-form`,children:[(0,V.jsx)(B,{label:`用户名`}),(0,V.jsx)(z,{children:`保存用户名`})]})]}),(0,V.jsxs)(`section`,{className:`panel password-panel`,children:[(0,V.jsx)(Gt,{title:`修改密码`,description:`设置一个只有你知道的密码。`}),(0,V.jsxs)(`div`,{className:`skeleton-settings-form`,children:[(0,V.jsx)(B,{label:`当前密码`}),(0,V.jsx)(B,{label:`新密码`}),(0,V.jsx)(B,{label:`确认新密码`}),(0,V.jsx)(z,{children:`保存新密码`})]})]})]}),(0,V.jsxs)(`aside`,{className:`panel account-summary`,children:[(0,V.jsx)(`span`,{className:`large-avatar skeleton-shimmer`}),(0,V.jsx)(z,{children:`上传头像`}),(0,V.jsxs)(`p`,{className:`avatar-hint`,children:[(0,V.jsx)(R,{children:`JPG、PNG、WebP，最大 5 MB`}),(0,V.jsx)(`br`,{}),(0,V.jsx)(R,{children:`自动居中裁剪为方形`})]}),(0,V.jsx)(`h2`,{children:(0,V.jsx)(R,{children:`用户名`})}),(0,V.jsx)(`span`,{className:`small-pill`,children:(0,V.jsx)(R,{children:`学习账号`})}),(0,V.jsxs)(`div`,{className:`account-summary-note`,children:[(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,V.jsx)(`strong`,{children:(0,V.jsx)(R,{children:`专属于你的错题本`})}),(0,V.jsxs)(`p`,{children:[(0,V.jsx)(R,{children:`整理的题目、笔记与复习记录`}),(0,V.jsx)(`br`,{}),(0,V.jsx)(R,{children:`会保存在你的账号下。`})]})]})]})]})]})}function Zt(){return(0,V.jsxs)(`section`,{className:`panel admin-panel`,children:[(0,V.jsxs)(`div`,{className:`admin-panel-heading`,children:[(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`h2`,{children:(0,V.jsx)(R,{children:`账号与邀请管理`})}),(0,V.jsx)(`p`,{children:(0,V.jsx)(R,{children:`管理账号状态与使用情况。`})})]}),(0,V.jsx)(z,{children:`管理操作`})]}),(0,V.jsxs)(`div`,{className:`skeleton-admin-table`,children:[(0,V.jsx)(`div`,{className:`skeleton-admin-table-heading`,children:[0,1,2,3].map(e=>(0,V.jsx)(R,{children:`栏目名称`},e))}),[0,1,2].map(e=>(0,V.jsx)(`div`,{children:[0,1,2,3].map(e=>(0,V.jsx)(R,{children:`正在加载`},e))},e))]})]})}function Qt(){return(0,V.jsxs)(`div`,{className:`ai-profile-form`,children:[(0,V.jsxs)(`div`,{className:`ai-profile-enable`,children:[(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,V.jsx)(R,{children:`启用服务`})]}),(0,V.jsx)(B,{label:`API 基础地址`}),(0,V.jsx)(B,{label:`模型名称`}),(0,V.jsx)(B,{label:`API 密钥`}),(0,V.jsxs)(`div`,{className:`ai-profile-actions`,children:[(0,V.jsx)(z,{children:`保存服务配置`}),(0,V.jsx)(z,{children:`测试服务`})]})]})}function $t(){return(0,V.jsxs)(`div`,{className:`backup-settings`,children:[(0,V.jsxs)(`section`,{className:`panel backup-create-panel`,children:[(0,V.jsxs)(`div`,{className:`backup-heading`,children:[(0,V.jsx)(Gt,{title:`全站数据备份`,description:`保留一份完整记录，为恢复与迁移做好准备。`}),(0,V.jsx)(z,{children:`立即备份`})]}),(0,V.jsxs)(`div`,{className:`skeleton-copy-lines`,children:[(0,V.jsx)(R,{children:`账号、错题、知识点、复习记录与图片`}),(0,V.jsx)(R,{children:`完整保存服务器配置与学习记录`})]}),(0,V.jsx)(`div`,{className:`backup-sensitive`,children:(0,V.jsx)(R,{children:`备份含账号数据及服务密钥，请妥善保管。`})})]}),(0,V.jsxs)(`section`,{className:`panel backup-schedule-panel`,children:[(0,V.jsx)(Gt,{title:`自动备份`,description:`每天按北京时间执行；停服期间错过的备份不会补跑。`}),(0,V.jsxs)(`div`,{className:`backup-enable`,children:[(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,V.jsx)(R,{children:`启用每日自动备份`})]}),(0,V.jsxs)(`div`,{className:`backup-schedule-fields`,children:[(0,V.jsx)(B,{label:`每天执行时间`}),(0,V.jsx)(B,{label:`自动备份保留份数`})]}),(0,V.jsxs)(`div`,{className:`backup-schedule-footer`,children:[(0,V.jsx)(z,{children:`保存自动备份设置`}),(0,V.jsx)(R,{children:`下次执行时间与最近结果`})]})]}),(0,V.jsxs)(`section`,{className:`panel backup-history-panel`,children:[(0,V.jsx)(`div`,{className:`backup-heading`,children:(0,V.jsx)(`h2`,{children:(0,V.jsx)(R,{children:`备份记录`})})}),[0,1].map(e=>(0,V.jsxs)(`div`,{className:`backup-record`,children:[(0,V.jsx)(R,{children:`备份时间与文件大小`}),(0,V.jsx)(R,{children:`备份状态`}),(0,V.jsx)(z,{children:`下载`})]},e))]})]})}function en(){return(0,V.jsxs)(`section`,{className:`test-data-tools`,children:[(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`strong`,{children:(0,V.jsx)(R,{children:`体验错题本`})}),(0,V.jsx)(`p`,{children:(0,V.jsx)(R,{children:`每次为当前管理员账号生成 6 道示例，带有“测试错题”标签，可用于编辑和复习。当前账号共 — 道测试错题。`})}),(0,V.jsx)(`small`,{children:(0,V.jsx)(R,{children:`移入回收站覆盖所有筛选条件、归档和草稿，仅处理当前账号的测试错题，30 天内可恢复题目及复习记录。测试数据会计入学习统计。`})})]}),(0,V.jsxs)(`div`,{className:`test-data-actions`,children:[(0,V.jsx)(z,{children:`一键生成测试错题`}),(0,V.jsx)(z,{children:`测试错题移入回收站`})]})]})}function tn({answer:e=!1}){return(0,V.jsxs)(`div`,{className:`photo-entry`,children:[(0,V.jsxs)(`div`,{className:`photo-entry-title`,children:[(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,V.jsx)(R,{children:e?`也可以拍下答案`:`从图片录入题目`})]}),(0,V.jsx)(`p`,{children:(0,V.jsx)(R,{children:e?`题目和答案在同一张图里时，可直接复用题干图片识别答案。`:`选中错题部分，多张图片按顺序一起识别。`})}),(0,V.jsx)(`div`,{className:`photo-actions`,children:[e?`拍照识别答案`:`拍照`,`选择图片`,`选择已上传的照片`,...e?[`复用题干图片`]:[]].map(e=>(0,V.jsxs)(`span`,{className:`button secondary skeleton-button`,children:[(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`,style:{width:16,height:16}}),(0,V.jsx)(R,{children:e})]},e))})]})}function nn({label:e,rows:t=5,question:n=!1}){return(0,V.jsxs)(`div`,{className:`field markdown-field`,children:[(0,V.jsxs)(`div`,{className:`markdown-field-heading`,children:[(0,V.jsx)(`label`,{children:(0,V.jsx)(R,{children:e})}),(0,V.jsx)(`div`,{className:`markdown-field-modes`,children:[`编辑`,`预览`].map(e=>(0,V.jsx)(`button`,{type:`button`,disabled:!0,tabIndex:-1,children:(0,V.jsx)(R,{children:e})},e))})]}),(0,V.jsx)(`div`,{className:`skeleton-form-control skeleton-shimmer`,children:(0,V.jsx)(`textarea`,{disabled:!0,tabIndex:-1,rows:t,className:n?`question-editor`:void 0})})]})}function rn({title:e,required:t=!1}){return(0,V.jsxs)(`div`,{className:`editor-block-heading`,children:[(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,V.jsx)(`h2`,{children:(0,V.jsx)(R,{children:e})}),t&&(0,V.jsx)(`span`,{children:(0,V.jsx)(R,{children:`必填`})})]})}function an(){let e=/^#\/mistakes\/\d+\/edit/.test(window.location.hash);return(0,V.jsxs)(V.Fragment,{children:[e&&(0,V.jsx)(`div`,{className:`editor-uploaded`,children:(0,V.jsx)(`span`,{className:`table-button`,children:(0,V.jsx)(R,{children:`查看上传图片`})})}),(0,V.jsx)(`div`,{className:`editor-mobile-tabs`,children:(0,V.jsx)(`div`,{className:`sliding-tabs`,children:[`题干`,`解答`,`笔记`,`归类`].map(e=>(0,V.jsx)(`span`,{className:`sliding-tab`,children:(0,V.jsx)(`i`,{className:`skeleton-text skeleton-shimmer`,children:e})},e))})}),(0,V.jsxs)(`div`,{className:`editor-layout`,children:[(0,V.jsxs)(`div`,{className:`editor-main`,children:[(0,V.jsxs)(`section`,{className:`editor-block editor-question-block`,children:[(0,V.jsx)(rn,{title:`题目`,required:!0}),(0,V.jsx)(tn,{}),(0,V.jsx)(nn,{label:`题干 *`,question:!0})]}),(0,V.jsxs)(`section`,{className:`editor-block editor-answers-block skeleton-editor-secondary`,children:[(0,V.jsx)(rn,{title:`答案与分析`}),(0,V.jsx)(nn,{label:`正确答案　选填`,rows:3}),(0,V.jsx)(tn,{answer:!0}),(0,V.jsx)(`p`,{className:`ai-notice`,children:(0,V.jsx)(R,{children:`手动输入的短答案会在保存时自动生成解析；图片识别的短答案会在填入后生成。`})}),(0,V.jsx)(`div`,{className:`photo-actions`,children:(0,V.jsx)(z,{children:`生成解析`})}),(0,V.jsx)(nn,{label:`解题分析　选填`})]}),(0,V.jsxs)(`section`,{className:`editor-block editor-note-block skeleton-editor-secondary`,children:[(0,V.jsx)(rn,{title:`我的笔记`}),(0,V.jsx)(nn,{label:`我的笔记　选填`})]})]}),(0,V.jsxs)(`aside`,{className:`editor-aside editor-classification editor-block skeleton-editor-secondary`,children:[(0,V.jsx)(rn,{title:`学科与知识点`}),(0,V.jsx)(B,{label:`学科 *`}),(0,V.jsx)(B,{label:`主知识点　选填`}),(0,V.jsxs)(`div`,{className:`field`,children:[(0,V.jsx)(`span`,{children:(0,V.jsx)(R,{children:`辅助知识点　可多选`})}),(0,V.jsxs)(`div`,{className:`knowledge-options skeleton-copy-lines`,children:[(0,V.jsx)(R,{children:`知识点名称`}),(0,V.jsx)(R,{children:`知识点名称`})]})]}),(0,V.jsxs)(`div`,{className:`field`,children:[(0,V.jsx)(`span`,{children:(0,V.jsx)(R,{children:`星级标记　选填`})}),(0,V.jsx)(R,{children:`☆　☆　☆　☆　☆`})]})]})]})]})}function on(){let e=/^#\/mistakes\/\d+\/edit/.test(window.location.hash);return(0,V.jsxs)(`div`,{className:`editor-workbench`,children:[(0,V.jsxs)(`nav`,{className:`editor-navigation`,children:[(0,V.jsxs)(`span`,{className:`back-link`,children:[(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,V.jsx)(R,{children:e?`返回错题详情`:`返回我的错题`})]}),!e&&(0,V.jsxs)(`span`,{className:`table-button editor-batch-entry`,children:[(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,V.jsx)(R,{children:`按页批量录入`})]})]}),(0,V.jsxs)(`header`,{className:`editor-workbench-header`,children:[(0,V.jsx)(`div`,{children:(0,V.jsx)(`h1`,{children:(0,V.jsx)(R,{children:e?`编辑错题`:`录入错题`})})}),(0,V.jsx)(`div`,{className:`editor-workbench-state`,children:(0,V.jsx)(`span`,{className:`editor-mode`,children:(0,V.jsx)(R,{children:`正在编辑`})})})]}),(0,V.jsx)(an,{})]})}function sn(){return(0,V.jsx)(`div`,{className:`review-candidates`,children:[0,1,2].map(e=>(0,V.jsxs)(`div`,{className:`review-candidate`,children:[(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`h3`,{children:(0,V.jsx)(R,{children:`题目条件、问题和需要复习的内容`})}),(0,V.jsx)(`span`,{children:(0,V.jsx)(R,{children:`学科 · 知识点`})}),(0,V.jsx)(`div`,{className:`review-candidate-rating`,children:(0,V.jsx)(R,{children:`☆☆☆☆☆`})})]}),(0,V.jsx)(`span`,{className:`status-badge`,children:(0,V.jsx)(`i`,{className:`skeleton-text skeleton-shimmer`,children:`未复习`})})]},e))})}function cn(){return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(Kt,{title:`开始复习`}),(0,V.jsxs)(`div`,{className:`review-selection-layout`,children:[(0,V.jsxs)(`section`,{className:`library-panel`,children:[(0,V.jsxs)(`div`,{className:`panel-title selection-heading`,children:[(0,V.jsx)(`span`,{className:`panel-title-icon`,children:(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`})}),(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`h2`,{children:(0,V.jsx)(R,{children:`选择今天的练习`})}),(0,V.jsx)(`p`,{children:(0,V.jsx)(R,{children:`仅已归档的错题可以参与复习。`})})]})]}),(0,V.jsx)(`div`,{className:`filter-bar review-filters has-rating-filter`,children:[`全部学科`,`全部知识点`,`全部掌握程度`,`全部星级`].map(e=>(0,V.jsx)(`div`,{className:`custom-select`,children:(0,V.jsxs)(`div`,{className:`custom-select-trigger`,children:[(0,V.jsx)(R,{children:e}),(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`})]})},e))}),(0,V.jsxs)(`div`,{className:`selection-toolbar`,children:[(0,V.jsxs)(`label`,{children:[(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,V.jsx)(R,{children:`全选当前结果`})]}),(0,V.jsx)(`span`,{children:(0,V.jsx)(R,{children:`共 0 道 · 已选 0 道`})})]}),(0,V.jsx)(sn,{})]}),(0,V.jsxs)(`aside`,{className:`review-preparation panel`,children:[(0,V.jsx)(`span`,{className:`prep-icon`,children:(0,V.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`,style:{width:29,height:29}})}),(0,V.jsx)(`h2`,{children:(0,V.jsx)(R,{children:`今天的复习计划`})}),(0,V.jsxs)(`div`,{className:`prep-selected`,children:[(0,V.jsx)(`span`,{children:(0,V.jsx)(R,{children:`本次已选择`})}),(0,V.jsxs)(`strong`,{children:[(0,V.jsx)(R,{children:`0`}),(0,V.jsx)(`small`,{children:(0,V.jsx)(R,{children:`道错题`})})]})]}),(0,V.jsx)(`div`,{className:`prep-steps`,children:[`独立完成题目`,`查看答案与分析`,`记录本次掌握程度`].map((e,t)=>(0,V.jsxs)(`span`,{children:[(0,V.jsx)(`i`,{children:t+1}),(0,V.jsx)(R,{children:e})]},e))}),(0,V.jsx)(z,{children:`开始复习`}),(0,V.jsx)(`small`,{className:`prep-hint`,children:(0,V.jsx)(R,{children:`复习记录会同步更新掌握程度。`})})]})]})]})}var V,ln=t((()=>{a(),Ht(),Ut(),Wt(),V=M()}));function un(){let[e,t]=(0,U.useState)(()=>window.matchMedia(`(prefers-reduced-motion: reduce)`).matches);return(0,U.useEffect)(()=>{let e=window.matchMedia(`(prefers-reduced-motion: reduce)`),n=()=>t(e.matches);return e.addEventListener(`change`,n),()=>e.removeEventListener(`change`,n)},[]),e}function dn(){let e=un(),t=(0,U.useRef)([]),n=(0,U.useCallback)(()=>{t.current.forEach(e=>e.cancel()),t.current=[]},[]),r=(0,U.useCallback)((r,i,a,o)=>{if(n(),e||!r||typeof r.animate!=`function`)return Promise.resolve();let s={duration:Cn,easing:xn,fill:`forwards`};return t.current=[r.animate([{transform:`none`},{transform:`rotate(${i*90}deg) scale(${a})`}],s)],o&&t.current.push(o.element.animate([{height:`${o.from}px`,overflow:`hidden`},{height:`${o.to}px`,overflow:`hidden`}],s)),Promise.all(t.current.map(e=>e.finished)).then(()=>void 0,()=>void 0)},[e,n]);return(0,U.useEffect)(()=>n,[n]),{turn:r,settle:n}}function fn(){let e=(0,U.useSyncExternalStore)(Ot,At),t=e.pending>0,n=un(),r=(0,U.useRef)(null),i=(0,U.useRef)(`idle`),a=(0,U.useRef)(0),o=(0,U.useRef)(0),s=(0,U.useRef)(0),c=(0,U.useRef)(new Set),l=(0,U.useRef)(new Set),[u,d]=(0,U.useState)({visible:!1,progress:0,completing:!1});return(0,U.useEffect)(()=>()=>{c.current.forEach(e=>window.clearTimeout(e)),l.current.forEach(e=>window.cancelAnimationFrame(e)),c.current.clear(),l.current.clear()},[]),(0,U.useEffect)(()=>{function u(){c.current.forEach(e=>window.clearTimeout(e)),l.current.forEach(e=>window.cancelAnimationFrame(e)),c.current.clear(),l.current.clear()}function f(e,t){let n=window.setTimeout(()=>{c.current.delete(n),e()},t);c.current.add(n)}function p(e){let t=window.requestAnimationFrame(()=>{l.current.delete(t),e()});l.current.add(t)}function m(){if(i.current!==`loading`||!kt())return;let e=.92-o.current;e>.003&&(o.current+=e*.18,d({visible:!0,progress:o.current,completing:!1}),f(m,450+o.current*750))}function h(){kt()||(i.current=`completing`,o.current=1,d({visible:!0,progress:1,completing:!0}),f(()=>{i.current=`fading`,d(e=>({...e,visible:!1})),f(()=>{i.current=`idle`,o.current=0,d({visible:!1,progress:0,completing:!1})},n?40:180)},n?100:440))}let g=e.cycle!==s.current;if(s.current=e.cycle,t||g){u(),a.current=performance.now();let e=i.current;if(i.current=`loading`,e===`idle`)o.current=0,d({visible:!0,progress:0,completing:!1}),p(()=>p(()=>{o.current=.3,d({visible:!0,progress:.3,completing:!1}),f(m,n?100:360)}));else{let e=r.current?getComputedStyle(r.current).transform:`none`,t=e===`none`?o.current:new DOMMatrixReadOnly(e).a;o.current=Math.min(.99,Math.max(.3,t)),d({visible:!0,progress:o.current,completing:!1}),f(m,450)}}!t&&i.current===`loading`&&f(()=>{u(),h()},Math.max(0,(n?60:260)-(performance.now()-a.current)))},[t,e.cycle,n]),(0,W.jsx)(`div`,{className:`loading-progress${u.visible?` is-visible`:``}${u.completing?` is-completing`:``}`,"aria-hidden":`true`,style:{opacity:+!!u.visible,transition:`opacity ${n?40:180}ms ${xn}`},children:(0,W.jsx)(`span`,{ref:r,className:`loading-progress-fill`,style:{transform:`scaleX(${u.progress})`,transition:`transform ${n?60:u.completing?320:u.progress<=.3?200:700}ms ${xn}`}})})}function pn({tabs:e,value:t,onChange:n,ariaLabel:r,className:i=``}){let a=(0,U.useRef)(null),o=(0,U.useRef)(!1),[s,c]=(0,U.useState)({x:0,width:0}),[l,u]=(0,U.useState)(!1),d=e.map(e=>e.id).join(`\0`);(0,U.useLayoutEffect)(()=>{let e=a.current;if(!e)return;let n=!1,r=0;function i(){if(n||!e)return;let i=Array.from(e.querySelectorAll(`[role="tab"]`)).find(e=>e.dataset.tabId===t);if(!i)return;let a=i.getBoundingClientRect(),s=e.getBoundingClientRect(),l={x:a.left-s.left+e.scrollLeft-e.clientLeft,width:a.width};c(e=>Math.abs(e.x-l.x)<.1&&Math.abs(e.width-l.width)<.1?e:l),!o.current&&!r&&(r=window.requestAnimationFrame(()=>{o.current=!0,u(!0)}))}i();let s=new ResizeObserver(i);return s.observe(e),e.querySelectorAll(`[role="tab"]`).forEach(e=>s.observe(e)),window.addEventListener(`resize`,i),document.fonts.ready.then(i),()=>{n=!0,s.disconnect(),window.removeEventListener(`resize`,i),window.cancelAnimationFrame(r)}},[t,d]);function f(t,r){let i=r;if(t.key===`ArrowRight`)i=(r+1)%e.length;else if(t.key===`ArrowLeft`)i=(r-1+e.length)%e.length;else if(t.key===`Home`)i=0;else if(t.key===`End`)i=e.length-1;else return;t.preventDefault(),n(e[i].id),a.current?.querySelectorAll(`[role="tab"]`)[i]?.focus()}return(0,W.jsxs)(`div`,{ref:a,className:`sliding-tabs ${i}`.trim(),role:`tablist`,"aria-label":r,children:[e.map((e,r)=>(0,W.jsx)(`button`,{id:e.panelId?`${e.panelId}-tab`:void 0,type:`button`,role:`tab`,"data-tab-id":e.id,"aria-controls":e.panelId,"aria-selected":t===e.id,tabIndex:t===e.id?0:-1,className:`sliding-tab${t===e.id?` is-active`:``}`,onClick:()=>n(e.id),onKeyDown:e=>f(e,r),children:e.label},e.id)),(0,W.jsx)(`span`,{className:`tab-indicator`,"aria-hidden":`true`,style:{width:s.width,transform:`translateX(${s.x}px)`,opacity:+!!l,...l?{}:{transition:`none`}}})]})}function mn({items:e,value:t,ariaLabel:n=`主导航`}){let r=(0,U.useRef)(null),i=(0,U.useRef)(!1),[a,o]=(0,U.useState)(!1),[s,c]=(0,U.useState)({x:0,y:0,width:0,height:0,visible:!1}),l=e.map(e=>e.id).join(`\0`);return(0,U.useLayoutEffect)(()=>{let e=r.current;if(!e)return;let n=!1,a=0;function s(){if(n||!e)return;let r=Array.from(e.querySelectorAll(`.nav-item`)).find(e=>e.dataset.navId===t);if(!r){c(e=>e.visible?{...e,visible:!1}:e);return}let s=getComputedStyle(e),l=s.getPropertyValue(`--nav-indicator-axis`).trim(),u=l?l===`horizontal`:s.display===`grid`||s.flexDirection===`row`,d=parseFloat(s.getPropertyValue(`--nav-indicator-inset`))||(u?10:12),f=parseFloat(s.getPropertyValue(`--nav-indicator-thickness`))||3,p=r.getBoundingClientRect(),m=e.getBoundingClientRect(),h=p.left-m.left+e.scrollLeft-e.clientLeft,g=p.top-m.top+e.scrollTop-e.clientTop,_=u?{x:h+d,y:g+p.height-f,width:Math.max(0,p.width-d*2),height:f,visible:!0}:{x:h,y:g+d,width:f,height:Math.max(0,p.height-d*2),visible:!0};c(e=>e.visible===_.visible&&Math.abs(e.x-_.x)<.1&&Math.abs(e.y-_.y)<.1&&Math.abs(e.width-_.width)<.1&&Math.abs(e.height-_.height)<.1?e:_),!i.current&&!a&&(a=window.requestAnimationFrame(()=>{i.current=!0,o(!0)}))}s();let l=new ResizeObserver(s);return l.observe(e),e.querySelectorAll(`.nav-item`).forEach(e=>l.observe(e)),window.addEventListener(`resize`,s),document.fonts.ready.then(s),()=>{n=!0,l.disconnect(),window.removeEventListener(`resize`,s),window.cancelAnimationFrame(a)}},[t,l]),(0,W.jsxs)(`nav`,{ref:r,className:`navigation`,"aria-label":n,children:[e.map(e=>(0,W.jsx)(`a`,{href:e.href,"data-nav-id":e.id,className:`nav-item${t===e.id?` active`:``}`,"aria-current":t===e.id?`page`:void 0,children:e.label},e.id)),(0,W.jsx)(`span`,{className:`nav-indicator`,"aria-hidden":`true`,style:{transform:`translate(${s.x}px, ${s.y}px)`,width:s.width,height:s.height,opacity:a&&s.visible?1:0,...a?{}:{transition:`none`}}})]})}function H({size:e=`long`}){return(0,W.jsx)(`span`,{className:`skeleton-line skeleton-shimmer ${e}`})}function hn(){return(0,W.jsxs)(`div`,{className:`skeleton-heading`,children:[(0,W.jsxs)(`div`,{className:`skeleton-heading-copy`,children:[(0,W.jsx)(H,{size:`title`}),(0,W.jsx)(H,{size:`medium`})]}),(0,W.jsx)(`span`,{className:`skeleton-block skeleton-shimmer`})]})}function gn({library:e=!1}){return(0,W.jsx)(`div`,{className:`metrics-grid${e?` library-metrics`:``}`,children:(e?[{label:`已归档错题`,tone:`green`},{label:`待巩固`,tone:`amber`},{label:`已掌握`,tone:`green`}]:[{label:`已归档错题`,tone:`violet`},{label:`待完善草稿`,tone:`amber`},{label:`累计复习`,tone:`blue`},{label:`当前掌握率`,tone:`green`}]).map(({label:e,tone:t})=>(0,W.jsxs)(`div`,{className:`metric-card skeleton-metric-card`,children:[(0,W.jsxs)(`div`,{className:`metric-top`,children:[(0,W.jsx)(`span`,{className:`skeleton-metric-label skeleton-shimmer`,children:e}),(0,W.jsx)(`span`,{className:`metric-icon ${t}`,children:(0,W.jsx)(`span`,{className:`skeleton-metric-icon skeleton-shimmer`})})]}),(0,W.jsxs)(`div`,{className:`metric-value`,children:[(0,W.jsx)(`span`,{className:`skeleton-metric-count skeleton-shimmer`}),(0,W.jsx)(`span`,{className:`skeleton-metric-unit skeleton-shimmer`})]})]},e))})}function _n({review:e=!1}){return(0,W.jsxs)(`div`,{className:`skeleton-list`,children:[!e&&(0,W.jsxs)(`div`,{className:`skeleton-toolbar`,children:[(0,W.jsx)(H,{size:`medium`}),(0,W.jsx)(H,{size:`short`})]}),Array.from({length:3},(e,t)=>(0,W.jsxs)(`div`,{className:`skeleton-row`,children:[(0,W.jsx)(`span`,{className:`skeleton-row-index skeleton-shimmer`}),(0,W.jsxs)(`div`,{className:`skeleton-row-copy`,children:[(0,W.jsx)(H,{}),(0,W.jsx)(H,{size:`medium`})]}),(0,W.jsx)(H,{size:`short`}),(0,W.jsx)(H,{size:`short`})]},t))]})}function vn(){return(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)(`div`,{className:`skeleton-reading-header`,children:(0,W.jsx)(hn,{})}),(0,W.jsxs)(`div`,{className:`skeleton-reading-meta`,children:[(0,W.jsx)(H,{size:`short`}),(0,W.jsx)(H,{size:`short`}),(0,W.jsx)(H,{size:`short`})]}),(0,W.jsx)(`div`,{className:`skeleton-panel skeleton-reading-document`,children:[0,1,2].map(e=>(0,W.jsxs)(`section`,{children:[(0,W.jsx)(H,{size:`short`}),(0,W.jsx)(H,{}),(0,W.jsx)(H,{}),(0,W.jsx)(H,{size:`medium`})]},e))}),(0,W.jsxs)(`div`,{className:`skeleton-panel skeleton-reading-history`,children:[(0,W.jsx)(H,{size:`medium`}),(0,W.jsx)(H,{}),(0,W.jsx)(H,{size:`short`})]})]})}function yn({kind:e=`library`}){let t;switch(e){case`summary`:t=(0,W.jsx)(gn,{library:!0});break;case`rows`:t=(0,W.jsx)(_n,{});break;case`review`:t=(0,W.jsx)(sn,{});break;case`review-page`:t=(0,W.jsx)(cn,{});break;case`settings`:t=(0,W.jsx)(Zt,{});break;case`settings-page`:t=(0,W.jsx)(Xt,{});break;case`ai-profile`:t=(0,W.jsx)(Qt,{});break;case`backups`:t=(0,W.jsx)($t,{});break;case`test-data`:t=(0,W.jsx)(en,{});break;case`tasks`:t=(0,W.jsx)(Jt,{});break;case`tasks-page`:t=(0,W.jsx)(Yt,{});break;case`stats-page`:t=(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)(Kt,{title:`学习统计`,action:`去复习`}),(0,W.jsx)(gn,{}),(0,W.jsx)(qt,{})]});break;case`stats`:t=(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)(gn,{}),(0,W.jsx)(qt,{})]});break;case`editor`:t=(0,W.jsx)(an,{});break;case`editor-page`:t=(0,W.jsx)(on,{});break;case`detail`:t=(0,W.jsx)(vn,{});break;case`shell`:t=(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)(hn,{}),(0,W.jsx)(gn,{library:!0}),(0,W.jsx)(_n,{})]});break;default:t=(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)(hn,{}),(0,W.jsx)(gn,{library:!0}),(0,W.jsxs)(`div`,{className:`skeleton-toolbar`,children:[(0,W.jsx)(H,{size:`medium`}),(0,W.jsx)(H,{size:`short`})]}),(0,W.jsx)(_n,{})]})}return(0,W.jsx)(`div`,{className:`skeleton-screen skeleton-${e}`,"aria-hidden":`true`,children:t})}function bn({loading:e,kind:t=`library`,className:n=``,children:r}){let i=un(),[a,o]=(0,U.useState)(e);return(0,U.useEffect)(()=>{if(e){o(!0);return}let t=window.setTimeout(()=>o(!1),i?40:Sn);return()=>window.clearTimeout(t)},[e,i]),(0,W.jsxs)(`div`,{className:`loading-content loading-kind-${t} ${e?`is-loading`:`is-ready`} ${n}`.trim(),"aria-busy":e,children:[(0,W.jsx)(`div`,{className:`loading-content-body`,inert:e,"aria-hidden":e||void 0,children:r}),(a||e)&&(0,W.jsxs)(`div`,{className:`loading-content-placeholder`,"aria-hidden":!e||void 0,children:[(0,W.jsx)(`span`,{className:`visually-hidden`,role:`status`,children:`正在加载…`}),(0,W.jsx)(yn,{kind:t})]})]})}var U,W,xn,Sn,Cn,wn=t((()=>{U=e(w()),ln(),Vt(),W=M(),xn=`cubic-bezier(0.22, 0.61, 0.36, 1)`,Sn=260,Cn=280}));function Tn({className:e=``}){return(0,En.jsx)(`img`,{className:`logo-mark ${e}`,src:`/mistakes/logo.svg`,alt:``,width:`48`,height:`48`})}var En,Dn=t((()=>{En=M()})),On,kn,An,jn,G,Mn=t((()=>{On=`modulepreload`,kn=function(e){return`/mistakes/`+e},An={},jn=function(e){return e.pathname.endsWith(`.css`)},G=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=kn(t,n);let r=s(t);if(r.href in An)return;An[r.href]=!0;let i=jn(r);if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let o=document.createElement(`link`);if(o.rel=i?`stylesheet`:On,i||(o.as=`script`),o.crossOrigin=``,o.href=r.href,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),i)return new Promise((e,t)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${r}`)))})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})}}));function Nn(){return Ln||=G(async()=>{let{FriendlyCaptchaSDK:e}=await import(`./sdk-LxJ6YTVI.js`);return{FriendlyCaptchaSDK:e}},__vite__mapDeps([0,1])).then(({FriendlyCaptchaSDK:e})=>new e).catch(e=>{throw Ln=null,e}),Ln}function Pn({sitekey:e,resetKey:t,onChange:n}){let r=(0,Fn.useRef)(null),[i,a]=(0,Fn.useState)(!0);return(0,Fn.useEffect)(()=>{let t=r.current;if(!t)return;let i=document.createElement(`div`);t.append(i);let o=!0,s;a(!0),n({status:`pending`,response:``});let c=e=>{if(!o)return;let{state:t,response:r}=e.detail;n(t===`completed`?{status:`complete`,response:r}:t===`error`?{status:`error`,response:r||`.ERROR`}:t===`expired`?{status:`expired`,response:``}:{status:`pending`,response:``})};return i.addEventListener(`frc:widget.statechange`,c),Nn().then(t=>{o&&(s=t.createWidget({element:i,sitekey:e,apiEndpoint:`global`,startMode:`focus`,theme:`light`}),a(!1),i.closest(`form`)?.contains(document.activeElement)&&s.start())}).catch(()=>{o&&(a(!1),n({status:`error`,response:`.ERROR`}))}),()=>{o=!1,i.removeEventListener(`frc:widget.statechange`,c),s?.destroy(),i.remove()}},[e,t,n]),(0,In.jsxs)(`div`,{className:`auth-captcha-control`,children:[i&&(0,In.jsxs)(`div`,{className:`auth-captcha-loading`,role:`status`,children:[(0,In.jsx)(te,{className:`spin`,size:16}),` 正在加载人机验证…`]}),(0,In.jsx)(`div`,{className:`auth-captcha-widget`,ref:r})]})}var Fn,In,Ln,Rn=t((()=>{Fn=e(w()),A(),In=M(),Mn(),Ln=null})),zn=t((()=>{}));function Bn({open:e,onClose:t,title:n,description:r,children:i,wide:a=!1,suspended:o=!1,className:s=``,backdropClassName:d=``,scrollBody:f=!1}){let[g,y]=(0,Vn.useState)(null);return(0,K.jsx)(u,{open:e,modal:!o,disablePointerDismissal:o,onOpenChange:(e,n)=>{o?n.cancel():e||t()},children:(0,K.jsxs)(p,{children:[(0,K.jsx)(h,{className:`photo-dialog-backdrop ${d}`.trim()}),(0,K.jsxs)(c,{ref:y,className:`photo-dialog${a?` photo-dialog-wide`:``} ${s}`.trim(),children:[(0,K.jsxs)(`div`,{className:`photo-dialog-heading`,children:[(0,K.jsx)(_,{children:n}),(0,K.jsx)(m,{className:`icon-button`,"aria-label":`关闭`,children:(0,K.jsx)(O,{size:20})})]}),r&&(0,K.jsx)(v,{className:`photo-dialog-description`,children:r}),(0,K.jsx)(Hn.Provider,{value:g,children:f?(0,K.jsx)(l,{className:`photo-dialog-body`,children:i}):i})]})]})})}var Vn,K,Hn,Un,Wn=t((()=>{f(),A(),Vn=e(w()),s(),zn(),K=M(),Hn=(0,Vn.createContext)(null),Un=()=>(0,Vn.useContext)(Hn)})),Gn=t((()=>{}));function Kn({open:e,onOpenChange:t,title:n,description:r,closeLabel:i=`关闭`,triggerRef:a,className:o=``,children:s}){return de()?(0,qn.jsx)(fe,{open:e,onOpenChange:t,title:n,description:r,closeLabel:i,triggerRef:a,className:`ai-tasks-mobile-drawer ${o}`.trim(),children:s}):(0,qn.jsx)(Bn,{open:e,onClose:()=>t(!1),title:n,description:r,wide:!0,scrollBody:!0,className:`ai-tasks-dialog ${o}`.trim(),backdropClassName:`ai-tasks-dialog-backdrop`,children:s(null)})}var qn,Jn=t((()=>{Wn(),ue(),Gn(),qn=M()})),Yn,Xn,Zn,Qn=t((()=>{Yn=e(w()),Xn=M(),Zn=class extends Yn.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidUpdate(e){this.state.failed&&e.resetKey!==this.props.resetKey&&this.setState({failed:!1})}render(){return this.state.failed?(0,Xn.jsxs)(`div`,{className:`inline-alert`,role:`alert`,children:[`页面加载失败，请刷新后重试。`,(0,Xn.jsx)(`button`,{type:`button`,onClick:()=>window.location.reload(),children:`刷新页面`})]}):this.props.children}}}));function $n(e){let t=e.split(`?`)[0].match(/^\/mistakes\/(\d+)(\/edit)?$/);return t?{id:Number(t[1]),editing:!!t[2]}:null}var er,tr,nr,rr,ir=t((()=>{er=e(w()),tr=(0,er.createContext)(null),nr=()=>(0,er.useContext)(tr),rr=`mistakes:open-toast-record`}));function ar(e){return{className:`ai-toast-actionable`,closeOnClick:!0,onClick:t=>{if(window.matchMedia(`(max-width: 640px)`).matches&&$n(e)){t.preventDefault(),window.dispatchEvent(new CustomEvent(rr,{cancelable:!0,detail:{path:e}}));return}if(window.matchMedia(`(max-width: 640px)`).matches&&e.startsWith(`/ai-tasks`)){t.preventDefault(),window.dispatchEvent(new CustomEvent(`mistakes:open-ai-tasks`,{detail:{path:e}}));return}window.location.hash===`#${e}`?window.dispatchEvent(new HashChangeEvent(`hashchange`)):Nt(e)}}}var or=t((()=>{Vt(),ir()}));function sr(e){let t=(0,cr.useRef)(new Map),n=(0,cr.useRef)(null),r=(0,cr.useRef)(0);return(0,cr.useEffect)(()=>()=>{n.current&&clearTimeout(n.current),N.dismiss(e)},[e]),(0,cr.useCallback)(i=>{if(i.length){if(Date.now()-r.current>8e3)for(let[e,n]of t.current)n.status===`completed`&&t.current.delete(e);r.current=Date.now(),i.forEach(e=>t.current.set(e.id,e)),!n.current&&(n.current=setTimeout(()=>{n.current=null;let r=[...t.current.values()],i=r.filter(e=>e.status===`failed`).length,a=r.filter(e=>e.status===`active`).length,o=r.length-i-a,s=t=>(0,q.jsxs)(`div`,{className:`ai-toast-copy`,children:[(0,q.jsxs)(`a`,{className:`ai-toast-link`,href:`#${t.path}`,onClick:n=>{ar(t.path).onClick?.(n),N.dismiss(e)},children:[(0,q.jsx)(`span`,{children:t.message}),(0,q.jsx)(`small`,{children:`点击查看处理`})]}),t.retry&&(0,q.jsx)(`button`,{type:`button`,onClick:t.retry,children:`重试`})]},t.id),c=r.length===1?s(r[0]):(0,q.jsxs)(`div`,{className:`ai-toast-copy`,children:[(0,q.jsx)(`span`,{children:[a&&`${a} 项处理中`,o&&`${o} 项完成`,i&&`${i} 项失败`].filter(Boolean).join(` · `)}),(0,q.jsxs)(`details`,{className:`activity-toast-details`,children:[(0,q.jsxs)(`summary`,{children:[`查看 `,r.length,` 项记录`,i?`并重试`:``]}),(0,q.jsx)(`div`,{children:[...r].sort((e,t)=>Number(t.status===`failed`)-Number(e.status===`failed`)).map(s)})]})]}),l={type:i?`error`:a?`info`:`success`,isLoading:!(!a||i),autoClose:a||i?!1:4500,closeButton:!0,closeOnClick:!1,onClose:()=>{t.current.clear()}};N.isActive(e)?N.update(e,{render:c,...l}):N(c,{toastId:e,...l})},400))}},[e])}var cr,q,lr=t((()=>{cr=e(w()),Dt(),or(),q=M()}));function ur(){let e=(0,J.useContext)(yr);if(!e)throw Error(`AI tasks context missing`);return e}function dr(){let{jobs:e,openTasks:t}=ur(),n=e.filter(gr).length,r=e.filter(e=>_r(e)||!e.mistakeDeleted&&e.status===`failed`).length,i=n||r;return(0,Y.jsxs)(`button`,{type:`button`,className:`button ghost ai-tasks-trigger`,onClick:t,"aria-label":`AI 任务${i?`，${i} 项${n?`处理中`:`待处理`}`:``}`,children:[(0,Y.jsx)(T,{size:17}),` AI 任务`,i>0&&(0,Y.jsx)(`span`,{className:`count-pill`,children:i})]})}function fr({children:e}){let{user:t}=o(),[n,r]=(0,J.useState)([]),[i,a]=(0,J.useState)(null),[s,c]=(0,J.useState)(!1),l=(0,J.useRef)(null),[u,d]=(0,J.useState)(window.location.hash.split(`?`)[0]===`#/ai-tasks`),[f,p]=(0,J.useState)(``),[m,h]=(0,J.useState)(!1),[g,_]=(0,J.useState)(!1),[v,y]=(0,J.useState)(null),[b,x]=(0,J.useState)(new Set),S=(0,J.useRef)(new Set),[ee,C]=(0,J.useState)(!document.hidden),w=(0,J.useRef)(null),T=(0,J.useRef)(null),E=(0,J.useRef)(!1),D=(0,J.useRef)(!1),te=(0,J.useRef)(0),O=(0,J.useRef)(!0),ne=sr(`ai-results-${t.id}`),k=(0,J.useCallback)(e=>{te.current+=1,O.current&&r(t=>[...e,...t.filter(t=>!e.some(e=>e.id===t.id))].sort((e,t)=>t.id-e.id))},[]),A=(0,J.useCallback)((e=!1)=>{if(E.current=!0,D.current||=e,T.current)return T.current;_(!0);let t=(async()=>{do{E.current=!1;let e=te.current,t=D.current;D.current=!1;let[n,i]=await Promise.allSettled([L(`/ai/jobs`,{},{background:!0}),t?L(`/ai/config`,{},{background:!0}):Promise.resolve(null)]);if(!O.current)break;n.status===`fulfilled`&&(e===te.current?(r(n.value),y(Date.now())):E.current=!0),i.status===`fulfilled`&&i.value&&a(i.value),p(n.status===`rejected`?n.reason.message:i.status===`rejected`?i.reason.message:``),h(!0)}while(O.current&&E.current)})().finally(()=>{T.current=null,O.current&&_(!1)});return T.current=t,t},[]),j=(0,J.useCallback)(()=>A(!0),[A]);(0,J.useEffect)(()=>{O.current=!0,j();let e=()=>{A()},t=()=>{j()},n=()=>{C(!document.hidden),document.hidden||j()},r=()=>{c(!1),d(window.location.hash.split(`?`)[0]===`#/ai-tasks`)},i=e=>{let t=e.detail.path.split(`?`)[1]||``,n=Number(new URLSearchParams(t).get(`job`))||null;n&&window.dispatchEvent(new CustomEvent(`mistakes:ai-task-toast-target`,{detail:{jobId:n}})),l.current=null,c(!0)};return window.addEventListener(`mistakes:updated`,e),window.addEventListener(`focus`,t),window.addEventListener(`hashchange`,r),window.addEventListener(`mistakes:open-ai-tasks`,i),document.addEventListener(`visibilitychange`,n),()=>{O.current=!1,window.removeEventListener(`mistakes:updated`,e),window.removeEventListener(`focus`,t),window.removeEventListener(`hashchange`,r),window.removeEventListener(`mistakes:open-ai-tasks`,i),document.removeEventListener(`visibilitychange`,n)}},[A,j]);let re=n.filter(gr).length;(0,J.useEffect)(()=>{if(!ee)return;let e=setInterval(()=>void A(),re?2e3:15e3);return()=>clearInterval(e)},[re,ee,A]),(0,J.useEffect)(()=>{s&&j()},[s,j]),(0,J.useEffect)(()=>{let e=[];if(w.current)for(let t of n){let n=w.current.get(t.id);if(n&&n!==t.status&&!t.mistakeDeleted){if(t.status===`succeeded`){let n=t.applyStatus!==`applied`,r=n?`/mistakes/${t.mistakeId}/edit?aiJob=${t.id}`:`/mistakes/${t.mistakeId}`;e.push({id:String(t.id),path:r,status:`completed`,message:`记录 #${t.mistakeId} ${hr(t)}完成${n?`，待校对。`:`，已填入。`}`})}if(t.status===`failed`){let n=`/ai-tasks?job=${t.id}`;e.push({id:String(t.id),path:n,status:`failed`,message:`记录 #${t.mistakeId} ${hr(t)}失败，点击查看原因并重试。`})}}}w.current=new Map(n.map(e=>[e.id,e.status])),!s&&!u&&ne(e)},[n,ne,s,u]);let ie=(0,J.useCallback)(async e=>{try{let t=await L(`/ai/jobs`,Bt(e));return k([t]),t}catch(e){throw N.error(e.message),e}},[k]),ae=(0,J.useCallback)(async(e,t={})=>{try{let n=await L(`/ai/jobs/${e}/apply`,Bt(t));return k([n.job]),N.success(`AI 结果已填入。`),n}catch(t){let r=n.find(t=>t.id===e),i=r?`/mistakes/${r.mistakeId}/edit?aiJob=${e}`:`/ai-tasks`;throw N.error((0,Y.jsxs)(`a`,{className:`ai-toast-link`,href:`#${i}`,children:[(0,Y.jsx)(`span`,{children:t.message}),(0,Y.jsx)(`small`,{children:`点击继续校对`})]}),ar(i)),j(),t}},[j,k,n]),M=(0,J.useCallback)(async(e,t)=>{let n=[...new Set(e)].filter(e=>!S.current.has(e));if(!n.length)return{jobs:[],errors:[]};n.forEach(e=>S.current.add(e)),x(new Set(S.current));try{let e=await L(`/ai/jobs/batch`,Bt({ids:n,action:t}));return k(e.jobs),e.jobs.length&&N.success(t===`retry`?`已将 ${e.jobs.length} 项任务重新加入队列。`:`已取消 ${e.jobs.length} 项任务。`),e}finally{n.forEach(e=>S.current.delete(e)),O.current&&(x(new Set(S.current)),A())}},[A,k]);return(0,Y.jsxs)(yr.Provider,{value:{jobs:n,config:i,error:f,loaded:m,refreshing:g,updatedAt:v,busyIds:b,refresh:j,createJob:ie,applyJob:ae,actJobs:M,openTasks:()=>{l.current=document.activeElement instanceof HTMLElement?document.activeElement:null,c(!0)},closeTasks:()=>c(!1)},children:[e,(0,Y.jsx)(Kn,{open:s,onOpenChange:c,title:`AI 任务`,description:`离开页面后任务会继续处理，结果保留在这里。`,closeLabel:`关闭 AI 任务`,triggerRef:l,children:e=>(0,Y.jsx)(Zn,{children:(0,Y.jsx)(J.Suspense,{fallback:(0,Y.jsx)(bn,{loading:!0,kind:`tasks`,children:null}),children:(0,Y.jsx)(pr,{compact:!0,portalContainer:e})})})})]})}var J,Y,pr,mr,hr,gr,_r,vr,yr,br=t((()=>{J=e(w()),A(),Dt(),Vt(),a(),Jn(),Qn(),wn(),or(),lr(),Y=M(),Mn(),pr=(0,J.lazy)(()=>G(()=>import(`./AiTaskManager-BXh1FIuE.js`).then(e=>({default:e.AiTaskManager})),__vite__mapDeps([2,1,3,4,5,6,7,8,9,10,11]))),mr={question:`题干识别`,answer:`答案识别`,analysis:`生成解析`},hr=e=>e.mode===`page-entry`?`按页录题`:mr[e.type],gr=e=>[`queued`,`running`,`retrying`].includes(e.status),_r=e=>!e.mistakeDeleted&&e.status===`succeeded`&&e.applyStatus!==`applied`,vr=e=>gr(e)||e.status===`failed`||e.status===`succeeded`&&e.applyStatus!==`applied`,yr=(0,J.createContext)(null)})),xr,Sr,Cr,wr,Tr,Er,Dr=t((()=>{Vt(),xr=class extends Error{constructor(){super(`请求超时，请重试。`)}},Sr=[1e3,2e3,4e3],Cr=e=>({...e,auxiliaryKnowledgePointIds:[...e.auxiliaryKnowledgePointIds]}),wr=e=>e instanceof Error?e.message:`请求失败，请重试。`,Tr=e=>e instanceof zt?e.status===408||e.status===429||e.status>=500&&e.status<600:e instanceof TypeError||e instanceof xr,Er=class{batches=new Map;listeners=new Set;snapshot=[];subscribe=e=>(this.listeners.add(e),()=>{this.listeners.delete(e)});getSnapshot=()=>this.snapshot;enqueue({mistakeId:e,purpose:t,input:n,files:r,recognize:i,recognitionPrompt:a}){let o=crypto.randomUUID(),s={view:{id:o,mistakeId:e,purpose:t,total:r.length,imageIds:[],status:`uploading`,message:`图片已压缩，正在后台上传…`,reuseRequested:!1},files:[...r],input:Cr(n),recognize:i,recognitionPrompt:a?.trim()||void 0,recognitionSubmitted:!1,recognitionClientId:crypto.randomUUID(),reuseClientId:crypto.randomUUID(),running:!1,controller:new AbortController};return this.batches.set(o,s),this.publish(),this.run(s),o}reuse(e,t,n){let r=this.batches.get(e);return!r||r.view.purpose!==`question`||r.view.reuseRequested?!1:(r.reuseInput=Cr(t),r.reuseRecognitionPrompt=n?.trim()||void 0,this.update(r,{reuseRequested:!0,reuseStatus:`waiting`}),r.view.imageIds.length===r.view.total&&this.run(r),!0)}retry(e){let t=this.batches.get(e);t&&!t.running&&t.view.status===`failed`&&(t.recognitionError=void 0,t.reuseError=void 0,t.view.reuseStatus===`failed`&&this.update(t,{reuseStatus:`waiting`}),this.run(t))}dispose(){for(let e of this.batches.values())e.controller.abort(),e.files=[];this.batches.clear(),this.snapshot.length&&this.publish()}publish(){this.snapshot=Array.from(this.batches.values(),e=>e.view).reverse(),this.listeners.forEach(e=>e())}update(e,t){e.controller.signal.aborted||(e.view={...e.view,...t},this.publish())}async run(e){if(!(e.running||e.controller.signal.aborted)){e.running=!0;try{try{for(;e.view.imageIds.length<e.view.total;){let t=e.view.imageIds.length,n=e.files[t],r=await this.request(e,`uploading`,`正在后台上传第 ${t+1}/${e.view.total} 张图片…`,9e4,t=>{let r=new FormData;return r.append(`original`,n.original,n.originalName.replace(/\.[^.]+$/,``)+`.jpg`),r.append(`crop`,n.crop,`crop.jpg`),r.append(`purpose`,e.view.purpose),r.append(`clientId`,n.clientId),L(`/mistakes/${e.view.mistakeId}/images`,{method:`POST`,body:r,signal:t},{background:!0})});this.update(e,{imageIds:[...e.view.imageIds,r.id]})}e.files=[]}catch(t){e.controller.signal.aborted||this.update(e,{status:`failed`,message:`图片上传失败：${wr(t)}`});return}if(e.recognize&&!e.recognitionSubmitted&&!e.recognitionError)try{await this.submitRecognition(e,e.view.purpose,e.input,e.recognitionClientId,e.recognitionPrompt),e.recognitionSubmitted=!0}catch(t){if(e.controller.signal.aborted)return;e.recognitionError=wr(t)}if(e.reuseInput&&e.view.reuseStatus===`waiting`){this.update(e,{reuseStatus:`submitting`});try{await this.submitRecognition(e,`answer`,e.reuseInput,e.reuseClientId,e.reuseRecognitionPrompt),this.update(e,{reuseStatus:`submitted`})}catch(t){if(e.controller.signal.aborted)return;e.reuseError=wr(t),this.update(e,{reuseStatus:`failed`})}}let t=[e.recognitionError&&`识别任务提交失败：${e.recognitionError}`,e.reuseError&&`答案复用提交失败：${e.reuseError}`].filter(Boolean);this.update(e,{status:t.length?`failed`:`completed`,message:t.length?t.join(`；`):e.view.reuseStatus===`submitted`?`图片已上传，答案复用已交给后台识别。`:e.recognize?`图片已上传，已交给后台识别。`:`${e.view.total} 张图片已上传。`})}finally{e.running=!1,!e.controller.signal.aborted&&e.view.imageIds.length===e.view.total&&e.view.reuseStatus===`waiting`&&this.run(e)}}}submitRecognition(e,t,n,r,i){return this.request(e,`processing`,`正在后台提交${t===`question`?`题目`:`答案`}识别…`,3e4,a=>L(`/ai/jobs`,{...Bt({clientId:r,mistakeId:e.view.mistakeId,type:t,imageIds:e.view.imageIds,input:n,recognitionPrompt:i}),signal:a},{background:!0}))}async request(e,t,n,r,i){for(let a=0;;a+=1){e.controller.signal.throwIfAborted(),this.update(e,{status:t,message:n});try{return await this.withTimeout(e,r,i)}catch(t){if(e.controller.signal.aborted||!Tr(t)||a>=Sr.length)throw t;let n=Sr[a];this.update(e,{status:`retrying`,message:`网络请求失败，${n/1e3} 秒后自动重试（${a+1}/${Sr.length}）…`}),await this.wait(e,n)}}}async withTimeout(e,t,n){e.controller.signal.throwIfAborted();let r=new AbortController,i=()=>r.abort();e.controller.signal.addEventListener(`abort`,i,{once:!0});let a=!1,o=setTimeout(()=>{a=!0,r.abort()},t);try{return await n(r.signal)}catch(e){throw a?new xr:e}finally{clearTimeout(o),e.controller.signal.removeEventListener(`abort`,i)}}wait(e,t){return new Promise((n,r)=>{let i=e.controller.signal,a=()=>{clearTimeout(o),r(i.reason)},o=setTimeout(()=>{i.removeEventListener(`abort`,a),n()},t);i.addEventListener(`abort`,a,{once:!0}),i.aborted&&a()})}}}));function Or(){let e=(0,Ar.useContext)(Mr);if(!e)throw Error(`Photo uploads context missing`);return e}function kr({children:e}){let[t]=(0,Ar.useState)(()=>new Er),n=(0,Ar.useRef)(new Map),r=(0,Ar.useSyncExternalStore)(t.subscribe,t.getSnapshot),i=sr(`photo-uploads`);return(0,Ar.useEffect)(()=>()=>{t.dispose()},[t]),(0,Ar.useEffect)(()=>{let e=[];for(let i of r){if(n.current.get(i.id)===i)continue;n.current.set(i.id,i);let r=`/mistakes/${i.mistakeId}/edit?photo=${i.purpose}`;e.push({id:i.id,path:r,message:`记录 #${i.mistakeId} · ${i.message}`,status:i.status===`failed`?`failed`:i.status===`completed`?`completed`:`active`,retry:i.status===`failed`?()=>t.retry(i.id):void 0})}i(e)},[r,t,i]),(0,jr.jsx)(Mr.Provider,{value:{queue:t,batches:r},children:e})}var Ar,jr,Mr,Nr=t((()=>{Ar=e(w()),Dr(),lr(),jr=M(),Mr=(0,Ar.createContext)(null)})),Pr=t((()=>{}));function Fr({path:e,editorId:t,skeletonKind:n,children:r}){let[i]=(0,X.useState)(()=>document.createElement(`div`)),a=(0,X.useRef)(null),[o,s]=(0,X.useState)(null),[c,l]=(0,X.useState)(null),[u,d]=(0,X.useState)(null),[f,p]=(0,X.useState)(!1),m=(0,X.useRef)(null),h=(0,X.useRef)(0),g=(0,X.useRef)({hash:``,x:0,y:0}),_=(0,X.useRef)(new Set),v=(0,X.useRef)({target:u,editorId:t,open:f});v.current={target:u,editorId:t,open:f};let y=!!(u?.editing&&t===u.id),b=(0,X.useCallback)(e=>{let{target:t,editorId:n}=v.current;return!t?.editing||t.id===n||!!e?.editing&&e.id===t.id||!m.current||m.current()},[]),x=(0,X.useCallback)(()=>{b(null)&&p(!1)},[b]),S=(0,X.useCallback)(e=>{let t=$n(e);if(!t){Nt(e);return}b(t)&&(v.current.target||(g.current={hash:window.location.hash,x:window.scrollX,y:window.scrollY}),d({...t,path:e,requestId:++h.current}),p(!0))},[b]),ee=(0,X.useCallback)(e=>(m.current=e,()=>{m.current===e&&(m.current=null)}),[]),C=(0,X.useCallback)(e=>{if(!(e||v.current.open)){d(null);for(let e of _.current)window.dispatchEvent(new CustomEvent(`mistakes:record-view-updated`,{detail:{id:e}}));_.current.clear(),window.location.hash===g.current.hash&&requestAnimationFrame(()=>window.scrollTo(g.current.x,g.current.y))}},[]);(0,X.useEffect)(()=>{let e=e=>{let t=e.detail.path;e.preventDefault(),S(t)},t=()=>{v.current.target&&window.location.hash!==g.current.hash&&p(!1)},n=()=>{v.current.target&&_.current.add(v.current.target.id)};return window.addEventListener(rr,e),window.addEventListener(`hashchange`,t),window.addEventListener(`mistakes:updated`,n),()=>{window.removeEventListener(rr,e),window.removeEventListener(`hashchange`,t),window.removeEventListener(`mistakes:updated`,n)}},[S]),(0,X.useLayoutEffect)(()=>{let e=y?o:a.current;e&&i.parentElement!==e&&(y&&a.current&&(a.current.style.minHeight=`${a.current.getBoundingClientRect().height}px`),e.appendChild(i),!y&&a.current&&(a.current.style.minHeight=``))},[i,y,o]);let w=e=>{if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;let t=e.target.closest(`a[href^="#/"]`);if(!t||t.target===`_blank`||t.hasAttribute(`download`))return;let n=t.getAttribute(`href`).slice(1);$n(n)&&(e.preventDefault(),S(n))},T=u?{path:u.path,requestId:u.requestId,navigate:S,registerLeaveCheck:ee,actionsContainer:c,retainsEditor:y,saved:()=>{v.current.target?.id===u.id&&x()},updated:e=>{_.current.delete(e),window.dispatchEvent(new CustomEvent(`mistakes:record-view-updated`,{detail:{id:e}}))}}:null,E=u?.editing?`editor`:`detail`;return(0,Z.jsxs)(Z.Fragment,{children:[(0,Z.jsx)(`div`,{ref:a,className:`record-page-slot`}),(0,Ir.createPortal)((0,Z.jsx)(tr.Provider,{value:y?T:null,children:(0,Z.jsx)(Zn,{resetKey:e.split(`?`)[0],children:(0,Z.jsx)(X.Suspense,{fallback:(0,Z.jsx)(bn,{loading:!0,kind:n,children:null}),children:r})})}),i),u&&(0,Z.jsx)(fe,{open:f,onOpenChange:e=>e?p(!0):x(),onOpenChangeComplete:C,title:u.editing?`编辑错题`:`错题详情`,closeLabel:`关闭题目`,className:`record-view-drawer`,footer:(0,Z.jsx)(`div`,{ref:l,className:`record-view-actions`,onClickCapture:w}),children:()=>(0,Z.jsx)(`div`,{ref:s,className:`record-view-slot`,onClickCapture:w,children:!y&&(0,Z.jsx)(tr.Provider,{value:T,children:(0,Z.jsx)(Zn,{resetKey:u.path,children:(0,Z.jsx)(X.Suspense,{fallback:(0,Z.jsx)(bn,{loading:!0,kind:E,children:null}),children:u.editing?(0,Z.jsx)(Rr,{id:u.id},`editor-${u.id}`):(0,Z.jsx)(Lr,{id:u.id},`detail-${u.id}`)})})})})})]})}var X,Ir,Z,Lr,Rr,zr=t((()=>{X=e(w()),Ir=e(r()),Vt(),ue(),wn(),Qn(),ir(),Pr(),Z=M(),Mn(),Lr=(0,X.lazy)(()=>G(()=>import(`./DetailPage-BufPdj70.js`).then(e=>({default:e.DetailPage})),__vite__mapDeps([12,1,3,4,5,13,14,15,7,9,16,6,8,17,18]))),Rr=(0,X.lazy)(()=>G(()=>import(`./EditorPage-BW8LmWcO.js`).then(e=>({default:e.EditorPage})),__vite__mapDeps([19,1,3,4,5,6,7,8,17,20,18,21])))})),Br,Vr,Hr,Ur,Wr=t((()=>{Br=e(w()),Vr=(0,Br.createContext)(null),Hr=()=>(0,Br.useContext)(Vr),Ur=e=>[`/`,`/mistakes`].includes(e.split(`?`)[0])}));function Gr({onLogin:e,onNotify:t}){let[n,r]=(0,Q.useState)(!1),[i,a]=(0,Q.useState)(``),[o,s]=(0,Q.useState)(``),[c,l]=(0,Q.useState)(``),[u,d]=(0,Q.useState)(!1),[f,p]=(0,Q.useState)(``),[m,h]=(0,Q.useState)(null),[g,_]=(0,Q.useState)(``),[v,y]=(0,Q.useState)(0),[b,x]=(0,Q.useState)({status:`pending`,response:``}),[S,C]=(0,Q.useState)(0),w=(0,Q.useRef)(!1);(0,Q.useEffect)(()=>{let e=!0;return h(null),_(``),L(`/auth/config`).then(t=>{e&&h(t)}).catch(t=>{e&&_(t.message)}),()=>{e=!1}},[v]);let T=m!==null&&(!m.enabled||b.status===`complete`||!n&&b.status===`error`);function D(){x({status:`pending`,response:``}),C(e=>e+1)}async function O(r){if(r.preventDefault(),!w.current&&T){w.current=!0,d(!0),p(``);try{let r=await L(n?`/auth/register`:`/auth/login`,Bt({username:i.trim(),password:o,captchaResponse:m?.enabled?b.response:``,...n?{inviteCode:c.trim()}:{}}));t(n?`欢迎，${r.user.username}！账号已创建。`:`欢迎回来，${r.user.username}！`),e(r.user)}catch(e){p(e.message),N.error(e.message),D()}finally{w.current=!1,d(!1)}}}return(0,$.jsxs)(`div`,{className:`auth-page`,children:[(0,$.jsxs)(`aside`,{className:`auth-story`,children:[(0,$.jsxs)(`a`,{className:`brand`,href:`/`,"aria-label":`返回首页`,children:[(0,$.jsx)(Tn,{}),(0,$.jsxs)(`span`,{className:`brand-text`,children:[`拾题`,(0,$.jsx)(`span`,{children:`把错题，学明白。`})]})]}),(0,$.jsxs)(`div`,{className:`auth-story-body`,children:[(0,$.jsxs)(`span`,{className:`small-pill`,children:[(0,$.jsx)(oe,{size:16}),` 你的个人错题本`]}),(0,$.jsxs)(`h1`,{children:[`做错的题，`,(0,$.jsx)(`br`,{}),`值得再想一遍。`]}),(0,$.jsxs)(`p`,{children:[`记录卡住你的那一步，梳理知识点。`,(0,$.jsx)(`br`,{}),`再练一次，让「不熟」慢慢变成「掌握」。`]}),(0,$.jsxs)(`div`,{className:`auth-note`,children:[(0,$.jsxs)(`div`,{className:`auth-note-top`,children:[(0,$.jsxs)(`span`,{children:[(0,$.jsx)(oe,{size:18}),` 我的学习笔记`]}),(0,$.jsx)(`span`,{className:`note-dots`,children:`•••`})]}),(0,$.jsx)(`div`,{className:`note-rule long`}),(0,$.jsx)(`div`,{className:`note-rule`}),(0,$.jsxs)(`div`,{className:`auth-note-bottom`,children:[(0,$.jsxs)(`span`,{children:[(0,$.jsx)(ne,{size:17}),` 记录 · 整理 · 复习`]}),(0,$.jsx)(`span`,{className:`note-check`,children:(0,$.jsx)(ne,{size:25})})]})]})]}),(0,$.jsx)(`div`,{className:`auth-story-footer`,children:`记录问题 · 理清思路 · 回顾练习`})]}),(0,$.jsx)(`main`,{className:`auth-form-area`,children:(0,$.jsxs)(`div`,{className:`auth-form-wrap`,children:[(0,$.jsx)(`div`,{className:`auth-icon`,children:(0,$.jsx)(ee,{size:30})}),(0,$.jsx)(`h2`,{children:n?`开始积累，遇见进步`:`欢迎回来`}),(0,$.jsx)(`p`,{className:`auth-subtitle`,children:n?`使用邀请码创建账号，开启你的错题本。`:`登录后，继续整理你的学习收获。`}),(0,$.jsxs)(`form`,{onSubmit:O,children:[(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`用户名`}),(0,$.jsx)(`input`,{required:!0,autoComplete:`username`,minLength:3,maxLength:32,placeholder:`输入用户名`,value:i,onChange:e=>a(e.target.value)})]}),(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`密码`}),(0,$.jsx)(`input`,{required:!0,type:`password`,autoComplete:n?`new-password`:`current-password`,minLength:n?8:void 0,maxLength:128,placeholder:n?`至少 8 位密码`:`输入密码`,value:o,onChange:e=>s(e.target.value)})]}),n&&(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`邀请码`}),(0,$.jsx)(`input`,{required:!0,placeholder:`输入管理员提供的邀请码`,value:c,onChange:e=>l(e.target.value)}),(0,$.jsx)(`small`,{children:`邀请码由管理员生成。`})]}),!m&&(g?(0,$.jsxs)(`div`,{className:`auth-captcha-notice is-error`,role:`alert`,children:[(0,$.jsxs)(`span`,{children:[`安全配置加载失败：`,g]}),(0,$.jsx)(`button`,{type:`button`,onClick:()=>y(e=>e+1),children:`重新加载`})]}):(0,$.jsxs)(`div`,{className:`auth-captcha-loading`,role:`status`,children:[(0,$.jsx)(te,{className:`spin`,size:16}),` 正在加载安全验证…`]})),m?.enabled&&(0,$.jsxs)(`div`,{className:`auth-captcha`,children:[(0,$.jsx)(Pn,{sitekey:m.sitekey,resetKey:S,onChange:x},`${n}-${S}`),(b.status===`error`||b.status===`expired`)&&(0,$.jsxs)(`div`,{className:`auth-captcha-notice`,role:`status`,children:[(0,$.jsx)(`span`,{children:b.status===`expired`?`验证已过期，请重新验证。`:n?`人机验证暂不可用，请重试后再注册。`:`人机验证暂不可用，你可以重试或尝试登录。`}),(0,$.jsx)(`button`,{type:`button`,disabled:u,onClick:D,children:`重新验证`})]})]}),f&&(0,$.jsx)(`div`,{className:`form-error`,role:`alert`,children:f}),(0,$.jsx)(`button`,{className:`button primary auth-submit`,disabled:u||!T,children:u?(0,$.jsx)(te,{className:`spin`,size:18}):(0,$.jsxs)($.Fragment,{children:[n?`创建账号`:`登录`,(0,$.jsx)(E,{size:18})]})})]}),(0,$.jsxs)(`div`,{className:`auth-switch`,children:[n?`已有账号？`:`还没有账号？`,(0,$.jsx)(`button`,{disabled:u,onClick:()=>{w.current||(r(!n),p(``),D())},children:n?`立即登录`:`使用邀请码注册`})]}),(0,$.jsxs)(`div`,{className:`auth-secure`,children:[(0,$.jsx)(k,{size:15}),` 你的错题与笔记，仅对你可见`]})]})})]})}function Kr(){let[e,t]=(0,Q.useState)(null),[n,r]=(0,Q.useState)(!0),[i,a]=(0,Q.useState)([]),[o,s]=(0,Q.useState)([]),[c,l]=(0,Q.useState)(``),[u,d]=(0,Q.useState)(!1),[f,p]=(0,Q.useState)(window.location.hash.slice(1)||`/mistakes`),[m,h]=(0,Q.useState)({session:0,recordId:null}),g=(0,Q.useRef)(null),_=(0,Q.useRef)(null),v=(0,Q.useRef)(!1);(0,Q.useEffect)(()=>{let e=!0,n=window.history.scrollRestoration;window.history.scrollRestoration=`manual`;let i=(window.location.hash.slice(1)||`/mistakes`).split(`?`)[0];L(`/auth/me`).then(n=>{e&&(n.user&&[`/mistakes`,`/`].includes(i)&&(g.current=`欢迎回来，${n.user.username}！`),t(n.user))}).catch(()=>{e&&t(null)}).finally(()=>{e&&r(!1)});let a=e=>{let t=window.location.hash.slice(1)||`/mistakes`;if(!window.dispatchEvent(new CustomEvent(`mistakes:before-navigate`,{cancelable:!0,detail:{path:t}}))){window.history.replaceState(null,``,new URL(e.oldURL).hash||`#/mistakes`);return}let n=t.split(`?`)[0],r=new URL(e.oldURL||window.location.href).hash.slice(1)||`/mistakes`;Ur(r)&&!Ur(t)&&(_.current={path:r,x:window.scrollX,y:window.scrollY}),!Ur(t)&&!/^\/mistakes\/\d+(\/edit)?$/.test(n)&&(_.current=null),h(e=>n===`/new`?{session:e.session+1,recordId:null}:e.recordId&&n!==`/mistakes/${e.recordId}/edit`?{...e,recordId:null}:e),p(t)};return window.addEventListener(`hashchange`,a),()=>{e=!1,window.removeEventListener(`hashchange`,a),window.history.scrollRestoration=n}},[]),(0,Q.useLayoutEffect)(()=>{let e=Ur(f)?_.current:null;window.scrollTo({left:e?.x||0,top:e?.y||0,behavior:`instant`})},[f]);let y=(0,Q.useCallback)((e,t=`success`)=>{N[t](e)},[]);(0,Q.useEffect)(()=>{if(e&&g.current){let e=g.current;g.current=null,y(e)}},[e,y]);let S=(0,Q.useCallback)(async()=>{try{let[e,t]=await Promise.all([L(`/subjects`),L(`/knowledge-points`)]);a(e),s(b(t,e)),l(``)}catch(e){l(e.message)}},[]);(0,Q.useEffect)(()=>{e&&S()},[e,S]),(0,Q.useEffect)(()=>{if(!e){d(!1);return}let t=!0,n=!1,r=0,i=async()=>{if(n||document.hidden)return;n=!0;let e=r;try{let n=await L(`/system/status`,{},{background:!0});t&&r===e&&d(n.readOnly)}catch{}finally{n=!1}},a=e=>{let t=e.detail;typeof t?.readOnly==`boolean`&&(r+=1,d(t.readOnly))},o=()=>{i()};window.addEventListener(`mistakes:backup-status`,a),window.addEventListener(`focus`,o),document.addEventListener(`visibilitychange`,o);let s=window.setInterval(()=>{i()},15e3);return i(),()=>{t=!1,window.clearInterval(s),window.removeEventListener(`mistakes:backup-status`,a),window.removeEventListener(`focus`,o),document.removeEventListener(`visibilitychange`,o)}},[e?.id]);let ee=(0,Q.useCallback)(async()=>{if(window.dispatchEvent(new Event(`mistakes:before-logout`,{cancelable:!0}))){window.dispatchEvent(new Event(`mistakes:session-ending`));try{await L(`/auth/logout`,Bt({})),y(`已退出登录。`),t(null),a([]),s([]),_.current=null,v.current=!1,window.location.hash=`/mistakes`}catch(e){window.dispatchEvent(new Event(`mistakes:session-resumed`)),y(e.message,`error`)}}},[y]),C=f.split(`?`)[0],w=C.match(/^\/mistakes\/(\d+)(\/edit)?$/),T=w&&_.current?_.current.path:`/mistakes`,D=Ur(f);D?v.current=!0:w||(v.current=!1);let te=w?w[2]?`editor-page`:`detail`:ti[C]||`library`,O=w?`/mistakes`:C===`/page-imports`?`/new`:C,ne=C===`/new`?m.recordId:w?.[2]?Number(w[1]):null,k;k=C===`/new`?(0,$.jsx)(Jr,{onCreated:e=>h(t=>({...t,recordId:e}))},`new-${m.session}`):C===`/page-imports`?(0,$.jsx)($r,{}):w?.[2]?(0,$.jsx)(Jr,{id:Number(w[1])},m.recordId===Number(w[1])?`new-${m.session}`:C):w?(0,$.jsx)(Yr,{id:Number(w[1])},f):C===`/review`?(0,$.jsx)(Xr,{},f):C===`/stats`?(0,$.jsx)(Zr,{}):C===`/ai-tasks`?(0,$.jsx)(ei,{}):C===`/settings`?(0,$.jsx)(Qr,{}):D?null:(0,$.jsx)(qr,{}),k=(0,$.jsxs)(Vr.Provider,{value:_.current?.path||null,children:[v.current&&(0,$.jsx)(`div`,{hidden:!D,children:(0,$.jsx)(qr,{active:D})},`library`),!D&&k]});let A=e?(0,$.jsx)(x.Provider,{value:{user:e,updateUser:t,subjects:i,knowledgePoints:o,refreshDirectory:S,notify:y,logout:ee},children:(0,$.jsx)(fr,{children:(0,$.jsx)(kr,{children:(0,$.jsxs)(`div`,{className:`app-shell`,children:[(0,$.jsxs)(`aside`,{className:`sidebar`,children:[(0,$.jsxs)(`a`,{className:`brand`,href:`#${T}`,children:[(0,$.jsx)(Tn,{}),(0,$.jsxs)(`span`,{className:`brand-text`,children:[`拾题`,(0,$.jsx)(`span`,{children:`把错题，学明白。`})]})]}),(0,$.jsx)(`div`,{className:`sidebar-label`,children:`学习空间`}),(0,$.jsx)(mn,{value:O,ariaLabel:`主导航`,items:ni.map(({path:e,label:t,icon:n})=>({id:e,href:`#${e===`/mistakes`?T:e}`,label:(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(n,{size:19,strokeWidth:1.8}),(0,$.jsx)(`span`,{children:t})]})}))}),(0,$.jsxs)(`div`,{className:`sidebar-bottom`,children:[(0,$.jsxs)(`div`,{className:`sidebar-reminder`,children:[(0,$.jsx)(`span`,{className:`reminder-icon`,children:(0,$.jsx)(ie,{size:22})}),(0,$.jsx)(`strong`,{children:`温故而知新，可以为师矣`}),(0,$.jsx)(`a`,{href:`#/review`,children:`打开复习页`})]}),(0,$.jsxs)(`div`,{className:`account`,children:[(0,$.jsxs)(`a`,{className:`account-profile`,href:`#/settings`,children:[(0,$.jsx)(`span`,{className:`avatar`,children:e.avatar?(0,$.jsx)(`img`,{src:e.avatar,alt:``}):e.username.slice(0,1).toUpperCase()}),(0,$.jsxs)(`span`,{className:`account-name`,children:[(0,$.jsx)(`strong`,{title:e.username,children:e.username}),(0,$.jsx)(`small`,{children:e.role===`admin`?`管理员`:`我的账号`})]})]}),(0,$.jsx)(`button`,{className:`icon-button`,title:`退出登录`,"aria-label":`退出登录`,onClick:ee,children:(0,$.jsx)(re,{size:17})})]})]})]}),(0,$.jsxs)(`div`,{className:`main-shell`,children:[(0,$.jsxs)(`header`,{className:`topbar`,children:[(0,$.jsxs)(`span`,{className:`topbar-label`,children:[(0,$.jsx)(se,{size:15}),` 个人学习空间`]}),(0,$.jsxs)(`div`,{className:`topbar-right`,children:[(0,$.jsx)(dr,{}),(0,$.jsxs)(`a`,{className:`workspace-state`,href:`/`,children:[(0,$.jsx)(E,{size:16}),` 返回个人主页`]}),(0,$.jsx)(`a`,{className:`topbar-avatar`,href:`#/settings`,"aria-label":`账号设置`,children:e.avatar?(0,$.jsx)(`img`,{src:e.avatar,alt:``}):e.username.slice(0,1).toUpperCase()})]})]}),(0,$.jsxs)(`main`,{className:`main-content`,children:[u&&(0,$.jsxs)(`div`,{className:`backup-readonly-banner`,role:`status`,children:[(0,$.jsx)(ae,{size:20}),(0,$.jsxs)(`p`,{children:[(0,$.jsx)(`strong`,{children:`正在备份，暂时只读`}),(0,$.jsx)(`span`,{children:`已输入的内容会保留，请稍后重试保存。`})]})]}),c&&(0,$.jsxs)(`div`,{className:`inline-alert`,role:`alert`,children:[`基础目录加载失败：`,c,(0,$.jsx)(`button`,{onClick:S,children:`重试`})]}),(0,$.jsx)(Fr,{path:f,editorId:ne,skeletonKind:te,children:k}),(0,$.jsx)(`footer`,{className:`page-footer`,children:(0,$.jsxs)(`span`,{children:[`拾题 · © `,new Date().getFullYear(),` ShaoanC`]})})]})]})]})})},e.id)}):(0,$.jsx)(Gr,{onLogin:e=>{t(e),p(`/mistakes`),window.location.hash=`/mistakes`},onNotify:e=>{g.current=e}});return(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(fn,{}),(0,$.jsx)(bn,{loading:n,kind:`shell`,className:`app-entrance`,children:!n&&A})]})}var Q,$,qr,Jr,Yr,Xr,Zr,Qr,$r,ei,ti,ni,ri=t((()=>{Q=e(w()),Dt(),A(),Vt(),a(),wn(),Dn(),Rn(),br(),Nr(),zr(),Wr(),$=M(),Mn(),qr=(0,Q.lazy)(()=>G(()=>import(`./MistakesPage-DQodx-99.js`).then(e=>({default:e.MistakesPage})),__vite__mapDeps([22,1,3,4,5,13,14,15,7,9,16,6,8,17,10,11]))),Jr=(0,Q.lazy)(()=>G(()=>import(`./EditorPage-BW8LmWcO.js`).then(e=>({default:e.EditorPage})),__vite__mapDeps([19,1,3,4,5,6,7,8,17,20,18,21]))),Yr=(0,Q.lazy)(()=>G(()=>import(`./DetailPage-BufPdj70.js`).then(e=>({default:e.DetailPage})),__vite__mapDeps([12,1,3,4,5,13,14,15,7,9,16,6,8,17,18]))),Xr=(0,Q.lazy)(()=>G(()=>import(`./ReviewPage-sQjU7I4S.js`).then(e=>({default:e.ReviewPage})),__vite__mapDeps([23,1,3,4,5,6,7,8,17,9]))),Zr=(0,Q.lazy)(()=>G(()=>import(`./StatsPage--Wt8JAzQ.js`).then(e=>({default:e.StatsPage})),__vite__mapDeps([24,1,3,4,5,25,7]))),Qr=(0,Q.lazy)(()=>G(()=>import(`./SettingsPage-D8FuAY71.js`).then(e=>({default:e.SettingsPage})),__vite__mapDeps([26,1,3,4,5,7]))),$r=(0,Q.lazy)(()=>G(()=>import(`./PageImports-Blv8rn0_.js`).then(e=>({default:e.PageImportsPage})),__vite__mapDeps([27,1,3,4,5,20,28]))),ei=(0,Q.lazy)(()=>G(()=>import(`./AiTaskManager-BXh1FIuE.js`).then(e=>({default:e.AiTasksPage})),__vite__mapDeps([2,1,3,4,5,6,7,8,9,10,11]))),ti={"/new":`editor-page`,"/page-imports":`editor`,"/review":`review-page`,"/stats":`stats-page`,"/ai-tasks":`tasks-page`,"/settings":`settings-page`},ni=[{path:`/mistakes`,label:`我的错题`,icon:D},{path:`/new`,label:`录入错题`,icon:S},{path:`/review`,label:`复习`,icon:ie},{path:`/stats`,label:`学习统计`,icon:j},{path:`/ai-tasks`,label:`AI 任务`,icon:T},{path:`/settings`,label:`设置`,icon:C}]})),ii=t((()=>{})),ai=t((()=>{})),oi=t((()=>{}));n((()=>{var t=e(w()),n=e(i());Dt(),ri(),g(),ii(),d(),y(),ai(),oi();var r=M();n.createRoot(document.getElementById(`root`)).render((0,r.jsxs)(t.StrictMode,{children:[(0,r.jsx)(Kr,{}),(0,r.jsx)(Ue,{className:`mistakes-toast-container`,position:`top-right`,autoClose:4500,transition:St,theme:`light`,limit:3,newestOnTop:!0,closeOnClick:!1,draggablePercent:15})]}))}))();export{Mt as A,pn as C,Ht as D,Ut as E,N as F,Bt as M,Nt as N,zt as O,Dt as P,bn as S,dn as T,Bn as _,Or as a,G as b,vr as c,_r as d,ur as f,Jn as g,Kn as h,Nr as i,Vt as j,L as k,br as l,nr as m,Ur as n,mr as o,ir as p,Hr as r,hr as s,Wr as t,gr as u,Wn as v,wn as w,Mn as x,Un as y};