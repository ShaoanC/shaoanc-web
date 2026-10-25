const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/sdk-LxJ6YTVI.js","assets/rolldown-runtime-8BhlS34s.js","assets/AiTaskManager-DU4guYvD.js","assets/number-fonts-CUZ-TPrw.js","assets/jsx-runtime-1iBoLgJP.js","assets/number-fonts-dGrRGmzm.css","assets/MarkdownContent-J7hPW0IH.js","assets/components-BcWDGCeW.js","assets/MarkdownContent-DJrlGixw.css","assets/Select-Ckt0NEHt.js","assets/library-pagination-Srq0vuK8.js","assets/library-pagination-DqaJHoO0.css","assets/DetailPage-B2lihpX_.js","assets/MobileDrawer-D99Xvq1w.js","assets/MobileDrawer-BHb4s3Rg.css","assets/export-selection-DDHfW3p7.js","assets/export-selection-D5i7lbTI.css","assets/StarRating-BgFpErSB.js","assets/ImageHistory-BKK30pns.js","assets/EditorPage-BOJVp9n8.js","assets/ImageRegions-Cs37aI_Z.js","assets/EditorPage-DJOnVxEf.css","assets/MistakesPage-B1Y2lg8a.js","assets/ReviewPage-DfVwsp07.js","assets/StatsPage-CmDA7gop.js","assets/clsx-DNZXw_RA.js","assets/SettingsPage-BVXhYd_2.js","assets/PageImports-BvkH8Ya4.js","assets/PageImports-Be4L-udF.css"])))=>i.map(i=>d[i]);
import{i as e,n as t,t as n}from"./rolldown-runtime-8BhlS34s.js";import{Cn as r,En as i,Kt as a,Tn as o,a as s,bn as c,c as l,f as u,ft as d,i as f,m as p,n as m,o as h,ot as g,r as _,t as v,wn as y,xn as b}from"./number-fonts-CUZ-TPrw.js";import{$ as x,Ft as S,N as C,Nn as w,T,Tn as ee,Tt as E,_t as te,a as D,an as O,j as k,n as A,p as j,pt as M,q as ne,qt as re,t as N,tn as ie,xn as ae}from"./jsx-runtime-1iBoLgJP.js";import{n as oe,t as se}from"./clsx-DNZXw_RA.js";import{n as ce,r as le,t as ue}from"./MobileDrawer-D99Xvq1w.js";function de(e,t,n=300){let{scrollHeight:r,style:i}=e;requestAnimationFrame(()=>{i.minHeight=`initial`,i.height=r+`px`,i.transition=`all ${n}ms`,requestAnimationFrame(()=>{i.height=`0`,i.padding=`0`,i.margin=`0`,setTimeout(t,n)})})}function fe({enter:e,exit:t,appendPosition:n=!1,collapse:r=!0,collapseDuration:i=300}){return function({children:a,position:o,preventExitTransition:s,done:c,nodeRef:l,isIn:u,playToast:d}){let f=n?`${e}--${o}`:e,p=n?`${t}--${o}`:t,m=(0,Ue.useRef)(0);return(0,Ue.useLayoutEffect)(()=>{let e=l.current,t=f.split(` `),n=r=>{r.target===l.current&&(d(),e.removeEventListener(`animationend`,n),e.removeEventListener(`animationcancel`,n),m.current===0&&r.type!==`animationcancel`&&e.classList.remove(...t))};e.classList.add(...t),e.addEventListener(`animationend`,n),e.addEventListener(`animationcancel`,n)},[]),(0,Ue.useEffect)(()=>{let e=l.current,t=()=>{e.removeEventListener(`animationend`,t),r?de(e,c,i):c()};u||(s?t():(m.current=1,e.className+=` ${p}`,e.addEventListener(`animationend`,t)))},[u]),Ue.createElement(Ue.Fragment,null,a)}}function pe(e,t){return{content:me(e.content,e.props),containerId:e.props.containerId,id:e.props.toastId,theme:e.props.theme,type:e.props.type,data:e.props.data||{},isLoading:e.props.isLoading,icon:e.props.icon,reason:e.removalReason,status:t}}function me(e,t,n=!1){return(0,We.isValidElement)(e)&&!et(e.type)?(0,We.cloneElement)(e,{closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):I(e)?e({closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):e}function he({closeToast:e,theme:t,ariaLabel:n=`close`}){return Ge.createElement(`button`,{className:`Toastify__close-button Toastify__close-button--${t}`,type:`button`,onClick:t=>{t.stopPropagation(),e(!0)},"aria-label":n},Ge.createElement(`svg`,{"aria-hidden":`true`,viewBox:`0 0 14 16`},Ge.createElement(`path`,{fillRule:`evenodd`,d:`M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z`})))}function ge({delay:e,isRunning:t,closeToast:n,type:r=`default`,hide:i,className:a,controlledProgress:o,progress:s,rtl:c,isIn:l,theme:u}){let d=i||o&&s===0,f={animationDuration:`${e}ms`,animationPlayState:t?`running`:`paused`};o&&(f.transform=`scaleX(${s})`);let p=se(`Toastify__progress-bar`,o?`Toastify__progress-bar--controlled`:`Toastify__progress-bar--animated`,`Toastify__progress-bar-theme--${u}`,`Toastify__progress-bar--${r}`,{"Toastify__progress-bar--rtl":c}),m=I(a)?a({rtl:c,type:r,defaultClassName:p}):se(p,a),h={[o&&s>=1?`onTransitionEnd`:`onAnimationEnd`]:o&&s<1?null:()=>{l&&n()}};return Ke.createElement(`div`,{className:`Toastify__progress-bar--wrp`,"data-hidden":d},Ke.createElement(`div`,{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${u} Toastify__progress-bar--${r}`}),Ke.createElement(`div`,{role:`progressbar`,"aria-hidden":d?`true`:`false`,"aria-label":`notification timer`,"aria-valuenow":o?Math.round(s*100):void 0,"aria-valuemin":0,"aria-valuemax":100,className:m,style:f,...h}))}function _e(e,t,n){let r=1,i=0,a=[],o=[],s=t,c=new Map,l=new Set,u=e=>(l.add(e),()=>l.delete(e)),d=()=>{o=Array.from(c.values()),l.forEach(e=>e())},f=({containerId:t,toastId:n,updateId:r})=>{let i=t?t!==e:e!==1,a=c.has(n)&&r==null;return i||a},p=(e,t)=>{c.forEach(n=>{var r;(t==null||t===n.props.toastId)&&((r=n.toggle)==null||r.call(n,e))})},m=e=>{var t,r;e.isActive&&((r=(t=e.props)?.onClose)==null||r.call(t,e.removalReason),e.isActive=!1,n(pe(e,`removed`)))},h=e=>{if(e==null)c.forEach(m);else{let t=c.get(e);t&&m(t)}d()},g=()=>{i-=a.length,a=[]},_=e=>{var t,r;let{toastId:i,updateId:a}=e.props,o=a==null;e.staleId&&c.delete(e.staleId),e.isActive=!0,c.set(i,e),d(),n(pe(e,o?`added`:`updated`)),o&&((r=(t=e.props).onOpen)==null||r.call(t))};return{id:e,props:s,observe:u,toggle:p,removeToast:h,toasts:c,clearQueue:g,buildToast:(e,t)=>{if(f(t))return;let{toastId:n,updateId:o,data:l,staleId:u,delay:p}=t,m=o==null;m&&i++;let g={...s,style:s.toastStyle,key:r++,...Object.fromEntries(Object.entries(t).filter(([e,t])=>t!=null)),toastId:n,updateId:o,data:l,isIn:!1,className:nt(t.className||s.toastClassName),progressClassName:nt(t.progressClassName||s.progressClassName),autoClose:!t.isLoading&&rt(t.autoClose,s.autoClose),closeToast(e){let t=c.get(n);t&&(t.removalReason=e,h(n))},deleteToast(){if(c.get(n)!=null){if(c.delete(n),i--,i<0&&(i=0),a.length>0){_(a.shift());return}d()}}};g.closeButton=s.closeButton,t.closeButton===!1||it(t.closeButton)?g.closeButton=t.closeButton:t.closeButton===!0&&(g.closeButton=!it(s.closeButton)||s.closeButton);let v={content:e,props:g,staleId:u};s.limit&&s.limit>0&&i>s.limit&&m?a.push(v):$e(p)?setTimeout(()=>{_(v)},p):_(v)},setProps(e){s=e},setToggle:(e,t)=>{let n=c.get(e);n&&(n.toggle=t)},isToastActive:e=>c.get(e)?.isActive,getSnapshot:()=>o}}function ve(){st.forEach(e=>xe(e.content,e.options)),st=[]}function ye(e,t){var n;if(t)return!!((n=L.get(t))!=null&&n.isToastActive(e));let r=!1;return L.forEach(t=>{t.isToastActive(e)&&(r=!0)}),r}function be(e){if(!ut()){st=st.filter(t=>e!=null&&t.options.toastId!==e);return}if(e==null||tt(e))L.forEach(t=>{t.removeToast(e)});else if(e&&(`containerId`in e||`id`in e)){let t=L.get(e.containerId);t?t.removeToast(e.id):L.forEach(t=>{t.removeToast(e.id)})}}function xe(e,t){it(e)&&(ut()||st.push({content:e,options:t}),L.forEach(n=>{n.buildToast(e,t)}))}function Se(e){var t;(t=L.get(e.containerId||1))==null||t.setToggle(e.id,e.fn)}function Ce(e,t){L.forEach(n=>{(t==null||!(t!=null&&t.containerId)||t?.containerId===n.id)&&n.toggle(e,t?.id)})}function we(e){let t=e.containerId||1;return{subscribe(n){let r=_e(t,e,lt);L.set(t,r);let i=r.observe(n);return ve(),()=>{i(),L.delete(t)}},setProps(e){var n;(n=L.get(t))==null||n.setProps(e)},getSnapshot(){return L.get(t)?.getSnapshot()}}}function Te(e){return ct.add(e),()=>{ct.delete(e)}}function Ee(e){return e&&(et(e.toastId)||$e(e.toastId))?e.toastId:ot()}function De(e,t){return xe(e,t),t.toastId}function Oe(e,t){return{...t,type:t&&t.type||e,toastId:Ee(t)}}function ke(e){return(t,n)=>De(t,Oe(e,n))}function P(e,t){return De(e,Oe(`default`,t))}function Ae(e,{pending:t,error:n,success:r},i){let a;t&&(a=et(t)?P.loading(t,i):P.loading(t.render,{...i,...t}));let o={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},s=(e,t,n)=>{if(t==null){P.dismiss(a);return}let r={type:e,...o,...i,data:n},s=et(t)?{render:t}:t;return a?P.update(a,{...r,...s}):P(s.render,{...r,...s}),n},c=I(e)?e():e;return c.then(e=>s(`success`,r,e)).catch(e=>s(`error`,n,e)),c}function je(e){be(e)}function Me(e){let{subscribe:t,getSnapshot:n,setProps:r}=(0,Je.useRef)(we(e)).current;r(e);let i=(0,Je.useSyncExternalStore)(t,n,n)?.slice();function a(t){if(!i)return[];let n=new Map;return e.newestOnTop&&i.reverse(),i.forEach(e=>{let{position:t}=e.props;n.has(t)||n.set(t,[]),n.get(t).push(e)}),Array.from(n,e=>t(e[0],e[1]))}return{getToastToRender:a,isToastActive:ye,count:i?.length}}function Ne(e){let[t,n]=(0,Ye.useState)(!1),[r,i]=(0,Ye.useState)(!1),a=(0,Ye.useRef)(null),o=(0,Ye.useRef)({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:s,pauseOnHover:c,closeToast:l,onClick:u,closeOnClick:d}=e;Se({id:e.toastId,containerId:e.containerId,fn:n}),(0,Ye.useEffect)(()=>{if(e.pauseOnFocusLoss)return f(),()=>{p()}},[e.pauseOnFocusLoss]);function f(){document.hasFocus()||_(),window.addEventListener(`focus`,g),window.addEventListener(`blur`,_)}function p(){window.removeEventListener(`focus`,g),window.removeEventListener(`blur`,_)}function m(t){if(e.draggable===!0||e.draggable===t.pointerType){v();let n=a.current;o.canCloseOnClick=!0,o.canDrag=!0,n.style.transition=`none`,e.draggableDirection===`x`?(o.start=t.clientX,o.removalDistance=n.offsetWidth*(e.draggablePercent/100)):(o.start=t.clientY,o.removalDistance=n.offsetHeight*(e.draggablePercent===80?e.draggablePercent*1.5:e.draggablePercent)/100)}}function h(t){let{top:n,bottom:r,left:i,right:o}=a.current.getBoundingClientRect();t.pointerType===`mouse`&&e.pauseOnHover&&t.clientX>=i&&t.clientX<=o&&t.clientY>=n&&t.clientY<=r?_():g()}function g(){n(!0)}function _(){n(!1)}function v(){o.didMove=!1,document.addEventListener(`pointermove`,b),document.addEventListener(`pointerup`,x)}function y(){document.removeEventListener(`pointermove`,b),document.removeEventListener(`pointerup`,x)}function b(n){let r=a.current;if(o.canDrag&&r){o.didMove=!0,t&&_(),e.draggableDirection===`x`?o.delta=n.clientX-o.start:o.delta=n.clientY-o.start,o.start!==n.clientX&&(o.canCloseOnClick=!1);let i=e.draggableDirection===`x`?`${o.delta}px, var(--y)`:`0, calc(${o.delta}px + var(--y))`;r.style.transform=`translate3d(${i},0)`,r.style.opacity=`${1-Math.abs(o.delta/o.removalDistance)}`}}function x(){y();let t=a.current;if(o.canDrag&&o.didMove&&t){if(o.canDrag=!1,Math.abs(o.delta)>o.removalDistance){i(!0),e.closeToast(!0),e.collapseAll();return}t.style.transition=`transform 0.2s, opacity 0.2s`,t.style.removeProperty(`transform`),t.style.removeProperty(`opacity`)}}let S={onPointerDown:m,onPointerUp:h};return s&&c&&(S.onMouseEnter=_,e.stacked||(S.onMouseLeave=g)),d&&(S.onClick=e=>{u&&u(e),o.canCloseOnClick&&l(!0)}),{playToast:g,pauseToast:_,isRunning:t,preventExitTransition:r,toastRef:a,eventHandlers:S}}function Pe(e){return F.createElement(mt,{...e},F.createElement(`path`,{d:`M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z`}))}function Fe(e){return F.createElement(mt,{...e},F.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z`}))}function Ie(e){return F.createElement(mt,{...e},F.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z`}))}function Le(e){return F.createElement(mt,{...e},F.createElement(`path`,{d:`M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z`}))}function Re(){return F.createElement(`div`,{className:`Toastify__spinner`})}function ze({theme:e,type:t,isLoading:n,icon:r}){let i=null,a={theme:e,type:t};return r===!1||(I(r)?i=r({...a,isLoading:n}):(0,F.isValidElement)(r)?i=(0,F.cloneElement)(r,a):n?i=ht.spinner():gt(t)&&(i=ht[t](a))),i}function Be(e){let t={...xt,...e},n=e.stacked,[r,i]=(0,qe.useState)(!0),a=(0,qe.useRef)(null),{getToastToRender:o,isToastActive:s,count:c}=Me(t),{className:l,style:u,rtl:d,containerId:f,hotKeys:p}=t;function m(e){let t=se(`Toastify__toast-container`,`Toastify__toast-container--${e}`,{"Toastify__toast-container--rtl":d});return I(l)?l({position:e,rtl:d,defaultClassName:t}):se(t,nt(l))}function h(){n&&(i(!0),P.play())}return pt(()=>{if(n){let e=a.current.querySelectorAll(`[data-in="true"]`),n=t.position?.includes(`top`),i=0,o=0;Array.from(e).reverse().forEach((e,t)=>{let a=e;a.classList.add(`Toastify__toast--stacked`),t>0&&(a.dataset.collapsed=`${r}`),a.dataset.pos||(a.dataset.pos=n?`top`:`bot`);let s=i*(r?.2:1)+(r?0:12*t),c=Math.max(.5,1-(r?o:0));a.style.setProperty(`--y`,`${n?s:s*-1}px`),a.style.setProperty(`--g`,`12`),a.style.setProperty(`--s`,`${c}`),i+=a.offsetHeight,o+=.025})}},[r,c,n]),(0,qe.useEffect)(()=>{function e(e){var t;let n=a.current;p(e)&&((t=n?.querySelector(`[tabIndex="0"]`))==null||t.focus(),i(!1),P.pause()),e.key===`Escape`&&(document.activeElement===n||n!=null&&n.contains(document.activeElement))&&(i(!0),P.play())}return document.addEventListener(`keydown`,e),()=>{document.removeEventListener(`keydown`,e)}},[p]),qe.createElement(`section`,{ref:a,className:`Toastify`,id:f,onMouseEnter:()=>{n&&(i(!1),P.pause())},onMouseLeave:h,"aria-live":`polite`,"aria-atomic":`false`,"aria-relevant":`additions text`,"aria-label":t[`aria-label`]},o((e,t)=>{let r=t.length?{...u}:{...u,pointerEvents:`none`};return qe.createElement(`div`,{tabIndex:-1,className:m(e),"data-stacked":n,style:r,key:`c-${e}`},t.map(({content:e,props:t})=>qe.createElement(_t,{...t,stacked:n,collapseAll:h,isIn:s(t.toastId,t.containerId),key:`t-${t.key}`},e)))}))}function Ve(e){return wt(St,e.nonce),Qe.createElement(Be,{...e})}var He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze,F,Qe,$e,et,I,tt,nt,rt,it,at,ot,L,st,ct,lt,ut,dt,ft,pt,mt,ht,gt,_t,vt,yt,bt,xt,St,Ct,wt,Tt=t((()=>{He=e(w(),1),Ue=e(w(),1),We=e(w(),1),Ge=e(w(),1),Ke=e(w(),1),oe(),qe=e(w(),1),Je=e(w(),1),Ye=e(w(),1),Xe=e(w(),1),Ze=e(w(),1),F=e(w(),1),Qe=e(w(),1),$e=e=>typeof e==`number`&&!isNaN(e),et=e=>typeof e==`string`,I=e=>typeof e==`function`,tt=e=>et(e)||$e(e),nt=e=>et(e)||I(e)?e:null,rt=(e,t)=>e===!1||$e(e)&&e>0?e:t,it=e=>(0,He.isValidElement)(e)||et(e)||I(e)||$e(e),at=1,ot=()=>`${at++}`,L=new Map,st=[],ct=new Set,lt=e=>ct.forEach(t=>t(e)),ut=()=>L.size>0,dt=(e,{containerId:t})=>L.get(t||1)?.toasts.get(e),ft=(e={})=>{L.forEach(t=>{t.props.limit&&(!e.containerId||t.id===e.containerId)&&t.clearQueue()})},P.loading=(e,t)=>De(e,Oe(`default`,{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...t})),P.promise=Ae,P.success=ke(`success`),P.info=ke(`info`),P.error=ke(`error`),P.warning=ke(`warning`),P.warn=P.warning,P.dark=(e,t)=>De(e,Oe(`default`,{theme:`dark`,...t})),P.dismiss=je,P.clearWaitingQueue=ft,P.isActive=ye,P.update=(e,t={})=>{let n=dt(e,t);if(n){let{props:r,content:i}=n,a={delay:100,...r,...t,toastId:t.toastId||e,updateId:ot()};a.toastId!==e&&(a.staleId=e);let o=a.render||i;delete a.render,De(o,a)}},P.done=e=>{P.update(e,{progress:1})},P.onChange=Te,P.play=e=>Ce(!0,e),P.pause=e=>Ce(!1,e),pt=typeof window<`u`?Xe.useLayoutEffect:Xe.useEffect,mt=({theme:e,type:t,isLoading:n,...r})=>F.createElement(`svg`,{viewBox:`0 0 24 24`,width:`100%`,height:`100%`,fill:e===`colored`?`currentColor`:`var(--toastify-icon-color-${t})`,...r}),ht={info:Fe,warning:Pe,success:Ie,error:Le,spinner:Re},gt=e=>e in ht,_t=e=>{let{isRunning:t,preventExitTransition:n,toastRef:r,eventHandlers:i,playToast:a}=Ne(e),{closeButton:o,children:s,autoClose:c,onClick:l,type:u,hideProgressBar:d,closeToast:f,transition:p,position:m,className:h,style:g,progressClassName:_,updateId:v,role:y,progress:b,rtl:x,toastId:S,deleteToast:C,isIn:w,isLoading:T,closeOnClick:ee,theme:E,ariaLabel:te}=e,D=se(`Toastify__toast`,`Toastify__toast-theme--${E}`,`Toastify__toast--${u}`,{"Toastify__toast--rtl":x},{"Toastify__toast--close-on-click":ee}),O=I(h)?h({rtl:x,position:m,type:u,defaultClassName:D}):se(D,h),k=ze(e),A=!!b||!c,j={closeToast:f,type:u,theme:E},M=null;return o===!1||(M=I(o)?o(j):(0,Ze.isValidElement)(o)?(0,Ze.cloneElement)(o,j):he(j)),Ze.createElement(p,{isIn:w,done:C,position:m,preventExitTransition:n,nodeRef:r,playToast:a},Ze.createElement(`div`,{id:S,tabIndex:0,onClick:l,"data-in":w,className:O,...i,style:g,ref:r,...w&&{role:y,"aria-label":te}},k!=null&&Ze.createElement(`div`,{className:se(`Toastify__toast-icon`,{"Toastify--animate-icon Toastify__zoom-enter":!T})},k),me(s,e,!t),M,!e.customProgressBar&&Ze.createElement(ge,{...v&&!A?{key:`p-${v}`}:{},rtl:x,theme:E,delay:c,isRunning:t,isIn:w,closeToast:f,hide:d,type:u,className:_,controlledProgress:A,progress:b||0})))},vt=(e,t=!1)=>({enter:`Toastify--animate Toastify__${e}-enter`,exit:`Toastify--animate Toastify__${e}-exit`,appendPosition:t}),yt=fe(vt(`bounce`,!0)),bt=fe(vt(`slide`,!0)),fe(vt(`zoom`)),fe(vt(`flip`)),xt={position:`top-right`,transition:yt,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:`touch`,draggablePercent:80,draggableDirection:`x`,role:`alert`,theme:`light`,"aria-label":`Notifications Alt+T`,hotKeys:e=>e.altKey&&e.code===`KeyT`},St=`:root {
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
`,Ct=new Map,wt=(e,t)=>{pt(()=>{if(!e||typeof document>`u`)return;let n=document,r=Ct.get(n);if(r){t&&r.setAttribute(`nonce`,t);return}let i=n.createElement(`style`);i.textContent=e,t&&i.setAttribute(`nonce`,t),n.head.appendChild(i),Ct.set(n,i)},[t])}}));function Et(e){return It.add(e),()=>{It.delete(e)}}function Dt(){return Nt}function Ot(){return Ft}function kt(e){e>0&&Nt===0&&(Pt+=1),Nt+=e,Ft={pending:Nt,cycle:Pt},It.forEach(e=>e())}async function R(e,t={},n={}){n.background||kt(1);try{let n=await fetch(`${Mt}${e}`,{...t,credentials:`same-origin`,headers:{...t.body instanceof FormData?{}:{"Content-Type":`application/json`},...t.headers}}),r=await n.json().catch(e=>{if(e instanceof SyntaxError)return null;throw e});if(!n.ok||!r?.success)throw r?.code===`BACKUP_READ_ONLY`&&window.dispatchEvent(new CustomEvent(`mistakes:backup-status`,{detail:{readOnly:!0}})),new Lt(r?.message||`请求失败，请稍后重试。`,n.status,r?.code);return t.method&&t.method!==`GET`&&window.dispatchEvent(new Event(`mistakes:updated`)),r.data}finally{n.background||kt(-1)}}function At(e,t=!1){let n=new Date(e);return Number.isNaN(n.getTime())?`—`:new Intl.DateTimeFormat(`zh-CN`,t?{month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`}:{year:`numeric`,month:`2-digit`,day:`2-digit`}).format(n)}function jt(e){window.location.hash=e}var Mt,Nt,Pt,Ft,It,Lt,Rt,zt=t((()=>{Mt=`/api/mistakes`,Nt=0,Pt=0,Ft={pending:0,cycle:0},It=new Set,Lt=class extends Error{status;code;constructor(e,t,n){super(e),this.status=t,this.code=n}},Rt=(e,t=`POST`)=>({method:t,body:JSON.stringify(e)})})),Bt=t((()=>{})),Vt=t((()=>{})),Ht=t((()=>{}));function z({children:e}){return(0,H.jsx)(`span`,{className:`skeleton-text skeleton-shimmer`,children:e})}function B({children:e=`保存设置`}){return(0,H.jsx)(`span`,{className:`button skeleton-button`,children:(0,H.jsx)(z,{children:e})})}function V({label:e}){return(0,H.jsxs)(`div`,{className:`field`,children:[(0,H.jsx)(`span`,{children:(0,H.jsx)(z,{children:e})}),(0,H.jsx)(`div`,{className:`skeleton-form-control skeleton-shimmer`,children:(0,H.jsx)(`input`,{disabled:!0,tabIndex:-1})})]})}function Ut({title:e,description:t}){return(0,H.jsxs)(`div`,{className:`panel-title`,children:[(0,H.jsx)(`span`,{className:`panel-title-icon`,children:(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`})}),(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`h2`,{children:(0,H.jsx)(z,{children:e})}),t&&(0,H.jsx)(`p`,{children:(0,H.jsx)(z,{children:t})})]})]})}function Wt({title:e,action:t,description:n}){return(0,H.jsxs)(`div`,{className:`page-header`,children:[(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`h1`,{children:(0,H.jsx)(z,{children:e})}),n&&(0,H.jsx)(`p`,{children:(0,H.jsx)(z,{children:n})})]}),t&&(0,H.jsx)(`div`,{className:`page-header-action`,children:(0,H.jsx)(B,{children:t})})]})}function Gt(){return(0,H.jsxs)(H.Fragment,{children:[(0,H.jsxs)(`div`,{className:`stats-grid stats-chart-grid`,children:[(0,H.jsxs)(`section`,{className:`panel stats-chart-panel`,children:[(0,H.jsx)(Ut,{title:`学科分布`,description:`各学科已归档错题的数量。`}),(0,H.jsx)(`div`,{className:`stats-chart-frame stats-subject-chart skeleton-subject-bars`,children:[48,78,35].map(e=>(0,H.jsx)(`span`,{className:`skeleton-shimmer`,style:{height:`${e}%`}},e))})]}),(0,H.jsxs)(`section`,{className:`panel stats-chart-panel stats-mastery-panel`,children:[(0,H.jsx)(Ut,{title:`掌握程度`,description:`按每道错题最近一次复习结果统计。`}),(0,H.jsxs)(`div`,{className:`stats-mastery-layout`,children:[(0,H.jsx)(`div`,{className:`stats-mastery-ring skeleton-mastery-ring`}),(0,H.jsx)(`ul`,{className:`stats-mastery-legend`,children:[`未复习`,`未掌握`,`待巩固`,`已掌握`].map(e=>(0,H.jsxs)(`li`,{className:`stats-mastery-item`,children:[(0,H.jsx)(`span`,{className:`stats-legend-dot skeleton-shimmer`}),(0,H.jsx)(`span`,{children:(0,H.jsx)(z,{children:e})}),(0,H.jsx)(`strong`,{children:(0,H.jsx)(z,{children:`0 道`})}),(0,H.jsx)(`span`,{children:(0,H.jsx)(z,{children:`0%`})})]},e))})]})]})]}),(0,H.jsxs)(`section`,{className:`panel knowledge-chart-panel stats-chart-panel`,children:[(0,H.jsx)(Ut,{title:`知识点分布`,description:`按主知识点查看已归档错题，最多展示数量最多的 8 项。`}),(0,H.jsx)(`div`,{className:`stats-chart-frame stats-knowledge-chart skeleton-knowledge-bars`,children:[74,92,55,38].map(e=>(0,H.jsxs)(`div`,{children:[(0,H.jsx)(z,{children:`知识点名称`}),(0,H.jsx)(`span`,{className:`skeleton-shimmer`,style:{width:`${e}%`}})]},e))})]})]})}function Kt(){return(0,H.jsxs)(H.Fragment,{children:[(0,H.jsxs)(`div`,{className:`task-selection-bar`,children:[(0,H.jsxs)(`label`,{children:[(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,H.jsx)(z,{children:`选择本页可操作任务`})]}),(0,H.jsxs)(`div`,{children:[(0,H.jsxs)(`span`,{className:`table-button`,children:[(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,H.jsx)(z,{children:`重试`})]}),(0,H.jsxs)(`span`,{className:`table-button`,children:[(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,H.jsx)(z,{children:`取消`})]})]})]}),(0,H.jsx)(`div`,{className:`task-rows`,children:[0,1,2].map(e=>(0,H.jsxs)(`article`,{className:`task-row`,children:[(0,H.jsxs)(`div`,{className:`task-row-heading`,children:[(0,H.jsxs)(`div`,{className:`task-row-title`,children:[(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,H.jsx)(`h3`,{children:(0,H.jsx)(z,{children:`识别题目`})}),(0,H.jsx)(`span`,{className:`task-id`,children:(0,H.jsx)(z,{children:`#000`})})]}),(0,H.jsx)(`span`,{className:`task-status`,children:(0,H.jsx)(z,{children:`处理中`})})]}),(0,H.jsx)(`div`,{className:`task-excerpt`,children:(0,H.jsx)(z,{children:`正在读取错题内容，整理识别与解析结果。`})}),(0,H.jsxs)(`div`,{className:`task-meta`,children:[(0,H.jsx)(z,{children:`记录 #000`}),(0,H.jsx)(z,{children:`10月24日 12:00`}),(0,H.jsx)(z,{children:`本轮耗时 10 秒`}),(0,H.jsx)(z,{children:`尝试 1/3`})]}),(0,H.jsx)(`div`,{className:`task-row-actions`,children:(0,H.jsx)(B,{children:`打开错题`})})]},e))})]})}function qt(){return(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(Wt,{title:`AI 任务管理`,action:`录入错题`}),(0,H.jsx)(`p`,{className:`task-page-description`,children:(0,H.jsx)(z,{children:`上传后可以继续学习，AI 会在后台处理。完成后，在这里查看结果、校对或重试；不再需要的处理中、失败或待校对任务可直接取消。`})}),(0,H.jsxs)(`section`,{className:`task-manager`,children:[(0,H.jsxs)(`div`,{className:`task-sync-bar`,children:[(0,H.jsxs)(`span`,{children:[(0,H.jsx)(z,{children:`正在加载任务…`}),(0,H.jsx)(`small`,{children:(0,H.jsx)(z,{children:`正在同步任务状态`})})]}),(0,H.jsx)(B,{children:`刷新`})]}),(0,H.jsx)(`div`,{className:`task-filters skeleton-tabs`,children:[`全部`,`处理中`,`待校对`,`失败`,`已填入`,`已取消`].map(e=>(0,H.jsx)(`span`,{children:(0,H.jsxs)(z,{children:[e,` —`]})},e))}),(0,H.jsxs)(`div`,{className:`task-search-bar`,children:[(0,H.jsx)(`div`,{className:`task-search skeleton-input skeleton-shimmer`}),(0,H.jsx)(`div`,{className:`custom-select skeleton-input skeleton-shimmer`})]}),(0,H.jsx)(Kt,{}),(0,H.jsxs)(`div`,{className:`task-pagination`,children:[(0,H.jsx)(z,{children:`共 — 项`}),(0,H.jsx)(B,{children:`上一页　下一页`})]})]})]})}function Jt(){let{user:e}=y(),t=e.role===`admin`;return(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(Wt,{title:`设置`,description:t?`管理账号安全、学习目录、AI 服务与全站数据备份。`:`修改用户名、头像与登录密码。`}),(0,H.jsx)(`div`,{className:`settings-tabs skeleton-tabs`,children:[`账号安全`,`知识点目录`,...t?[`AI 设置`,`数据备份`,`邀请码`,`用户账号`,`测试错题`]:[]].map(e=>(0,H.jsxs)(`span`,{children:[(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,H.jsx)(z,{children:e})]},e))}),(0,H.jsxs)(`div`,{className:`settings-account-layout`,children:[(0,H.jsxs)(`div`,{className:`settings-account-forms`,children:[(0,H.jsxs)(`section`,{className:`panel username-panel`,children:[(0,H.jsx)(Ut,{title:`修改用户名`,description:`修改后请使用新用户名登录。`}),(0,H.jsxs)(`div`,{className:`skeleton-settings-form`,children:[(0,H.jsx)(V,{label:`用户名`}),(0,H.jsx)(B,{children:`保存用户名`})]})]}),(0,H.jsxs)(`section`,{className:`panel password-panel`,children:[(0,H.jsx)(Ut,{title:`修改密码`,description:`设置一个只有你知道的密码。`}),(0,H.jsxs)(`div`,{className:`skeleton-settings-form`,children:[(0,H.jsx)(V,{label:`当前密码`}),(0,H.jsx)(V,{label:`新密码`}),(0,H.jsx)(V,{label:`确认新密码`}),(0,H.jsx)(B,{children:`保存新密码`})]})]})]}),(0,H.jsxs)(`aside`,{className:`panel account-summary`,children:[(0,H.jsx)(`span`,{className:`large-avatar skeleton-shimmer`}),(0,H.jsx)(B,{children:`上传头像`}),(0,H.jsxs)(`p`,{className:`avatar-hint`,children:[(0,H.jsx)(z,{children:`JPG、PNG、WebP，最大 5 MB`}),(0,H.jsx)(`br`,{}),(0,H.jsx)(z,{children:`自动居中裁剪为方形`})]}),(0,H.jsx)(`h2`,{children:(0,H.jsx)(z,{children:`用户名`})}),(0,H.jsx)(`span`,{className:`small-pill`,children:(0,H.jsx)(z,{children:`学习账号`})}),(0,H.jsxs)(`div`,{className:`account-summary-note`,children:[(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,H.jsx)(`strong`,{children:(0,H.jsx)(z,{children:`专属于你的错题本`})}),(0,H.jsxs)(`p`,{children:[(0,H.jsx)(z,{children:`整理的题目、笔记与复习记录`}),(0,H.jsx)(`br`,{}),(0,H.jsx)(z,{children:`会保存在你的账号下。`})]})]})]})]})]})}function Yt(){return(0,H.jsxs)(`section`,{className:`panel admin-panel`,children:[(0,H.jsxs)(`div`,{className:`admin-panel-heading`,children:[(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`h2`,{children:(0,H.jsx)(z,{children:`账号与邀请管理`})}),(0,H.jsx)(`p`,{children:(0,H.jsx)(z,{children:`管理账号状态与使用情况。`})})]}),(0,H.jsx)(B,{children:`管理操作`})]}),(0,H.jsxs)(`div`,{className:`skeleton-admin-table`,children:[(0,H.jsx)(`div`,{className:`skeleton-admin-table-heading`,children:[0,1,2,3].map(e=>(0,H.jsx)(z,{children:`栏目名称`},e))}),[0,1,2].map(e=>(0,H.jsx)(`div`,{children:[0,1,2,3].map(e=>(0,H.jsx)(z,{children:`正在加载`},e))},e))]})]})}function Xt(){return(0,H.jsxs)(`div`,{className:`ai-profile-form`,children:[(0,H.jsxs)(`div`,{className:`ai-profile-enable`,children:[(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,H.jsx)(z,{children:`启用服务`})]}),(0,H.jsx)(V,{label:`API 基础地址`}),(0,H.jsx)(V,{label:`模型名称`}),(0,H.jsx)(V,{label:`API 密钥`}),(0,H.jsxs)(`div`,{className:`ai-profile-actions`,children:[(0,H.jsx)(B,{children:`保存服务配置`}),(0,H.jsx)(B,{children:`测试服务`})]})]})}function Zt(){return(0,H.jsxs)(`div`,{className:`backup-settings`,children:[(0,H.jsxs)(`section`,{className:`panel backup-create-panel`,children:[(0,H.jsxs)(`div`,{className:`backup-heading`,children:[(0,H.jsx)(Ut,{title:`全站数据备份`,description:`保留一份完整记录，为恢复与迁移做好准备。`}),(0,H.jsx)(B,{children:`立即备份`})]}),(0,H.jsxs)(`div`,{className:`skeleton-copy-lines`,children:[(0,H.jsx)(z,{children:`账号、错题、知识点、复习记录与图片`}),(0,H.jsx)(z,{children:`完整保存服务器配置与学习记录`})]}),(0,H.jsx)(`div`,{className:`backup-sensitive`,children:(0,H.jsx)(z,{children:`备份含账号数据及服务密钥，请妥善保管。`})})]}),(0,H.jsxs)(`section`,{className:`panel backup-schedule-panel`,children:[(0,H.jsx)(Ut,{title:`自动备份`,description:`每天按北京时间执行；停服期间错过的备份不会补跑。`}),(0,H.jsxs)(`div`,{className:`backup-enable`,children:[(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,H.jsx)(z,{children:`启用每日自动备份`})]}),(0,H.jsxs)(`div`,{className:`backup-schedule-fields`,children:[(0,H.jsx)(V,{label:`每天执行时间`}),(0,H.jsx)(V,{label:`自动备份保留份数`})]}),(0,H.jsxs)(`div`,{className:`backup-schedule-footer`,children:[(0,H.jsx)(B,{children:`保存自动备份设置`}),(0,H.jsx)(z,{children:`下次执行时间与最近结果`})]})]}),(0,H.jsxs)(`section`,{className:`panel backup-history-panel`,children:[(0,H.jsx)(`div`,{className:`backup-heading`,children:(0,H.jsx)(`h2`,{children:(0,H.jsx)(z,{children:`备份记录`})})}),[0,1].map(e=>(0,H.jsxs)(`div`,{className:`backup-record`,children:[(0,H.jsx)(z,{children:`备份时间与文件大小`}),(0,H.jsx)(z,{children:`备份状态`}),(0,H.jsx)(B,{children:`下载`})]},e))]})]})}function Qt(){return(0,H.jsxs)(`section`,{className:`test-data-tools`,children:[(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`strong`,{children:(0,H.jsx)(z,{children:`体验错题本`})}),(0,H.jsx)(`p`,{children:(0,H.jsx)(z,{children:`每次为当前管理员账号生成 6 道示例，带有“测试错题”标签，可用于编辑和复习。当前账号共 — 道测试错题。`})}),(0,H.jsx)(`small`,{children:(0,H.jsx)(z,{children:`移入回收站覆盖所有筛选条件、归档和草稿，仅处理当前账号的测试错题，30 天内可恢复题目及复习记录。测试数据会计入学习统计。`})})]}),(0,H.jsxs)(`div`,{className:`test-data-actions`,children:[(0,H.jsx)(B,{children:`一键生成测试错题`}),(0,H.jsx)(B,{children:`测试错题移入回收站`})]})]})}function $t({answer:e=!1}){return(0,H.jsxs)(`div`,{className:`photo-entry`,children:[(0,H.jsxs)(`div`,{className:`photo-entry-title`,children:[(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,H.jsx)(z,{children:e?`也可以拍下答案`:`从图片录入题目`})]}),(0,H.jsx)(`p`,{children:(0,H.jsx)(z,{children:e?`题目和答案在同一张图里时，可直接复用题干图片识别答案。`:`选中错题部分，多张图片按顺序一起识别。`})}),(0,H.jsx)(`div`,{className:`photo-actions`,children:[e?`拍照识别答案`:`拍照`,`选择图片`,`选择已上传的照片`,...e?[`复用题干图片`]:[]].map(e=>(0,H.jsxs)(`span`,{className:`button secondary skeleton-button`,children:[(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`,style:{width:16,height:16}}),(0,H.jsx)(z,{children:e})]},e))})]})}function en({label:e,rows:t=5,question:n=!1}){return(0,H.jsxs)(`div`,{className:`field markdown-field`,children:[(0,H.jsxs)(`div`,{className:`markdown-field-heading`,children:[(0,H.jsx)(`label`,{children:(0,H.jsx)(z,{children:e})}),(0,H.jsx)(`div`,{className:`markdown-field-modes`,children:[`编辑`,`预览`].map(e=>(0,H.jsx)(`button`,{type:`button`,disabled:!0,tabIndex:-1,children:(0,H.jsx)(z,{children:e})},e))})]}),(0,H.jsx)(`div`,{className:`skeleton-form-control skeleton-shimmer`,children:(0,H.jsx)(`textarea`,{disabled:!0,tabIndex:-1,rows:t,className:n?`question-editor`:void 0})})]})}function tn({title:e,required:t=!1}){return(0,H.jsxs)(`div`,{className:`editor-block-heading`,children:[(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,H.jsx)(`h2`,{children:(0,H.jsx)(z,{children:e})}),t&&(0,H.jsx)(`span`,{children:(0,H.jsx)(z,{children:`必填`})})]})}function nn(){let e=/^#\/mistakes\/\d+\/edit/.test(window.location.hash);return(0,H.jsxs)(H.Fragment,{children:[e&&(0,H.jsx)(`div`,{className:`editor-uploaded`,children:(0,H.jsx)(`span`,{className:`table-button`,children:(0,H.jsx)(z,{children:`查看上传图片`})})}),(0,H.jsx)(`div`,{className:`editor-mobile-tabs`,children:(0,H.jsx)(`div`,{className:`sliding-tabs`,children:[`题干`,`解答`,`笔记`,`归类`].map(e=>(0,H.jsx)(`span`,{className:`sliding-tab`,children:(0,H.jsx)(`i`,{className:`skeleton-text skeleton-shimmer`,children:e})},e))})}),(0,H.jsxs)(`div`,{className:`editor-layout`,children:[(0,H.jsxs)(`div`,{className:`editor-main`,children:[(0,H.jsxs)(`section`,{className:`editor-block editor-question-block`,children:[(0,H.jsx)(tn,{title:`题目`,required:!0}),(0,H.jsx)($t,{}),(0,H.jsx)(en,{label:`题干 *`,question:!0})]}),(0,H.jsxs)(`section`,{className:`editor-block editor-answers-block skeleton-editor-secondary`,children:[(0,H.jsx)(tn,{title:`答案与分析`}),(0,H.jsx)(en,{label:`正确答案　选填`,rows:3}),(0,H.jsx)($t,{answer:!0}),(0,H.jsx)(`p`,{className:`ai-notice`,children:(0,H.jsx)(z,{children:`手动输入的短答案会在保存时自动生成解析；图片识别的短答案会在填入后生成。`})}),(0,H.jsx)(`div`,{className:`photo-actions`,children:(0,H.jsx)(B,{children:`生成解析`})}),(0,H.jsx)(en,{label:`解题分析　选填`})]}),(0,H.jsxs)(`section`,{className:`editor-block editor-note-block skeleton-editor-secondary`,children:[(0,H.jsx)(tn,{title:`我的笔记`}),(0,H.jsx)(en,{label:`我的笔记　选填`})]})]}),(0,H.jsxs)(`aside`,{className:`editor-aside editor-classification editor-block skeleton-editor-secondary`,children:[(0,H.jsx)(tn,{title:`学科与知识点`}),(0,H.jsx)(V,{label:`学科 *`}),(0,H.jsx)(V,{label:`主知识点　选填`}),(0,H.jsxs)(`div`,{className:`field`,children:[(0,H.jsx)(`span`,{children:(0,H.jsx)(z,{children:`辅助知识点　可多选`})}),(0,H.jsxs)(`div`,{className:`knowledge-options skeleton-copy-lines`,children:[(0,H.jsx)(z,{children:`知识点名称`}),(0,H.jsx)(z,{children:`知识点名称`})]})]}),(0,H.jsxs)(`div`,{className:`field`,children:[(0,H.jsx)(`span`,{children:(0,H.jsx)(z,{children:`星级标记　选填`})}),(0,H.jsx)(z,{children:`☆　☆　☆　☆　☆`})]})]})]})]})}function rn(){let e=/^#\/mistakes\/\d+\/edit/.test(window.location.hash);return(0,H.jsxs)(`div`,{className:`editor-workbench`,children:[(0,H.jsxs)(`nav`,{className:`editor-navigation`,children:[(0,H.jsxs)(`span`,{className:`back-link`,children:[(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,H.jsx)(z,{children:e?`返回错题详情`:`返回我的错题`})]}),!e&&(0,H.jsxs)(`span`,{className:`table-button editor-batch-entry`,children:[(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,H.jsx)(z,{children:`按页批量录入`})]})]}),(0,H.jsxs)(`header`,{className:`editor-workbench-header`,children:[(0,H.jsx)(`div`,{children:(0,H.jsx)(`h1`,{children:(0,H.jsx)(z,{children:e?`编辑错题`:`录入错题`})})}),(0,H.jsx)(`div`,{className:`editor-workbench-state`,children:(0,H.jsx)(`span`,{className:`editor-mode`,children:(0,H.jsx)(z,{children:`正在编辑`})})})]}),(0,H.jsx)(nn,{})]})}function an(){return(0,H.jsx)(`div`,{className:`review-candidates`,children:[0,1,2].map(e=>(0,H.jsxs)(`div`,{className:`review-candidate`,children:[(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`h3`,{children:(0,H.jsx)(z,{children:`题目条件、问题和需要复习的内容`})}),(0,H.jsx)(`span`,{children:(0,H.jsx)(z,{children:`学科 · 知识点`})}),(0,H.jsx)(`div`,{className:`review-candidate-rating`,children:(0,H.jsx)(z,{children:`☆☆☆☆☆`})})]}),(0,H.jsx)(`span`,{className:`status-badge`,children:(0,H.jsx)(`i`,{className:`skeleton-text skeleton-shimmer`,children:`未复习`})})]},e))})}function on(){return(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(Wt,{title:`开始复习`}),(0,H.jsxs)(`div`,{className:`review-selection-layout`,children:[(0,H.jsxs)(`section`,{className:`library-panel`,children:[(0,H.jsxs)(`div`,{className:`panel-title selection-heading`,children:[(0,H.jsx)(`span`,{className:`panel-title-icon`,children:(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`})}),(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`h2`,{children:(0,H.jsx)(z,{children:`选择今天的练习`})}),(0,H.jsx)(`p`,{children:(0,H.jsx)(z,{children:`仅已归档的错题可以参与复习。`})})]})]}),(0,H.jsx)(`div`,{className:`filter-bar review-filters has-rating-filter`,children:[`全部学科`,`全部知识点`,`全部掌握程度`,`全部星级`].map(e=>(0,H.jsx)(`div`,{className:`custom-select`,children:(0,H.jsxs)(`div`,{className:`custom-select-trigger`,children:[(0,H.jsx)(z,{children:e}),(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`})]})},e))}),(0,H.jsxs)(`div`,{className:`selection-toolbar`,children:[(0,H.jsxs)(`label`,{children:[(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,H.jsx)(z,{children:`全选当前结果`})]}),(0,H.jsx)(`span`,{children:(0,H.jsx)(z,{children:`共 0 道 · 已选 0 道`})})]}),(0,H.jsx)(an,{})]}),(0,H.jsxs)(`aside`,{className:`review-preparation panel`,children:[(0,H.jsx)(`span`,{className:`prep-icon`,children:(0,H.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`,style:{width:29,height:29}})}),(0,H.jsx)(`h2`,{children:(0,H.jsx)(z,{children:`今天的复习计划`})}),(0,H.jsxs)(`div`,{className:`prep-selected`,children:[(0,H.jsx)(`span`,{children:(0,H.jsx)(z,{children:`本次已选择`})}),(0,H.jsxs)(`strong`,{children:[(0,H.jsx)(z,{children:`0`}),(0,H.jsx)(`small`,{children:(0,H.jsx)(z,{children:`道错题`})})]})]}),(0,H.jsx)(`div`,{className:`prep-steps`,children:[`独立完成题目`,`查看答案与分析`,`记录本次掌握程度`].map((e,t)=>(0,H.jsxs)(`span`,{children:[(0,H.jsx)(`i`,{children:t+1}),(0,H.jsx)(z,{children:e})]},e))}),(0,H.jsx)(B,{children:`开始复习`}),(0,H.jsx)(`small`,{className:`prep-hint`,children:(0,H.jsx)(z,{children:`复习记录会同步更新掌握程度。`})})]})]})]})}var H,sn=t((()=>{b(),Bt(),Vt(),Ht(),H=N()}));function cn(){let[e,t]=(0,W.useState)(()=>window.matchMedia(`(prefers-reduced-motion: reduce)`).matches);return(0,W.useEffect)(()=>{let e=window.matchMedia(`(prefers-reduced-motion: reduce)`),n=()=>t(e.matches);return e.addEventListener(`change`,n),()=>e.removeEventListener(`change`,n)},[]),e}function ln(){let e=(0,W.useSyncExternalStore)(Et,Ot),t=e.pending>0,n=cn(),r=(0,W.useRef)(null),i=(0,W.useRef)(`idle`),a=(0,W.useRef)(0),o=(0,W.useRef)(0),s=(0,W.useRef)(0),c=(0,W.useRef)(new Set),l=(0,W.useRef)(new Set),[u,d]=(0,W.useState)({visible:!1,progress:0,completing:!1});return(0,W.useEffect)(()=>()=>{c.current.forEach(e=>window.clearTimeout(e)),l.current.forEach(e=>window.cancelAnimationFrame(e)),c.current.clear(),l.current.clear()},[]),(0,W.useEffect)(()=>{function u(){c.current.forEach(e=>window.clearTimeout(e)),l.current.forEach(e=>window.cancelAnimationFrame(e)),c.current.clear(),l.current.clear()}function f(e,t){let n=window.setTimeout(()=>{c.current.delete(n),e()},t);c.current.add(n)}function p(e){let t=window.requestAnimationFrame(()=>{l.current.delete(t),e()});l.current.add(t)}function m(){if(i.current!==`loading`||!Dt())return;let e=.92-o.current;e>.003&&(o.current+=e*.18,d({visible:!0,progress:o.current,completing:!1}),f(m,450+o.current*750))}function h(){Dt()||(i.current=`completing`,o.current=1,d({visible:!0,progress:1,completing:!0}),f(()=>{i.current=`fading`,d(e=>({...e,visible:!1})),f(()=>{i.current=`idle`,o.current=0,d({visible:!1,progress:0,completing:!1})},n?40:180)},n?100:440))}let g=e.cycle!==s.current;if(s.current=e.cycle,t||g){u(),a.current=performance.now();let e=i.current;if(i.current=`loading`,e===`idle`)o.current=0,d({visible:!0,progress:0,completing:!1}),p(()=>p(()=>{o.current=.3,d({visible:!0,progress:.3,completing:!1}),f(m,n?100:360)}));else{let e=r.current?getComputedStyle(r.current).transform:`none`,t=e===`none`?o.current:new DOMMatrixReadOnly(e).a;o.current=Math.min(.99,Math.max(.3,t)),d({visible:!0,progress:o.current,completing:!1}),f(m,450)}}!t&&i.current===`loading`&&f(()=>{u(),h()},Math.max(0,(n?60:260)-(performance.now()-a.current)))},[t,e.cycle,n]),(0,G.jsx)(`div`,{className:`loading-progress${u.visible?` is-visible`:``}${u.completing?` is-completing`:``}`,"aria-hidden":`true`,style:{opacity:+!!u.visible,transition:`opacity ${n?40:180}ms ${vn}`},children:(0,G.jsx)(`span`,{ref:r,className:`loading-progress-fill`,style:{transform:`scaleX(${u.progress})`,transition:`transform ${n?60:u.completing?320:u.progress<=.3?200:700}ms ${vn}`}})})}function un({tabs:e,value:t,onChange:n,ariaLabel:r,className:i=``}){let a=(0,W.useRef)(null),o=(0,W.useRef)(!1),[s,c]=(0,W.useState)({x:0,width:0}),[l,u]=(0,W.useState)(!1),d=e.map(e=>e.id).join(`\0`);(0,W.useLayoutEffect)(()=>{let e=a.current;if(!e)return;let n=!1,r=0;function i(){if(n||!e)return;let i=Array.from(e.querySelectorAll(`[role="tab"]`)).find(e=>e.dataset.tabId===t);if(!i)return;let a=i.getBoundingClientRect(),s=e.getBoundingClientRect(),l={x:a.left-s.left+e.scrollLeft-e.clientLeft,width:a.width};c(e=>Math.abs(e.x-l.x)<.1&&Math.abs(e.width-l.width)<.1?e:l),!o.current&&!r&&(r=window.requestAnimationFrame(()=>{o.current=!0,u(!0)}))}i();let s=new ResizeObserver(i);return s.observe(e),e.querySelectorAll(`[role="tab"]`).forEach(e=>s.observe(e)),window.addEventListener(`resize`,i),document.fonts.ready.then(i),()=>{n=!0,s.disconnect(),window.removeEventListener(`resize`,i),window.cancelAnimationFrame(r)}},[t,d]);function f(t,r){let i=r;if(t.key===`ArrowRight`)i=(r+1)%e.length;else if(t.key===`ArrowLeft`)i=(r-1+e.length)%e.length;else if(t.key===`Home`)i=0;else if(t.key===`End`)i=e.length-1;else return;t.preventDefault(),n(e[i].id),a.current?.querySelectorAll(`[role="tab"]`)[i]?.focus()}return(0,G.jsxs)(`div`,{ref:a,className:`sliding-tabs ${i}`.trim(),role:`tablist`,"aria-label":r,children:[e.map((e,r)=>(0,G.jsx)(`button`,{id:e.panelId?`${e.panelId}-tab`:void 0,type:`button`,role:`tab`,"data-tab-id":e.id,"aria-controls":e.panelId,"aria-selected":t===e.id,tabIndex:t===e.id?0:-1,className:`sliding-tab${t===e.id?` is-active`:``}`,onClick:()=>n(e.id),onKeyDown:e=>f(e,r),children:e.label},e.id)),(0,G.jsx)(`span`,{className:`tab-indicator`,"aria-hidden":`true`,style:{width:s.width,transform:`translateX(${s.x}px)`,opacity:+!!l,...l?{}:{transition:`none`}}})]})}function dn({items:e,value:t,ariaLabel:n=`主导航`}){let r=(0,W.useRef)(null),i=(0,W.useRef)(!1),[a,o]=(0,W.useState)(!1),[s,c]=(0,W.useState)({x:0,y:0,width:0,height:0,visible:!1}),l=e.map(e=>e.id).join(`\0`);return(0,W.useLayoutEffect)(()=>{let e=r.current;if(!e)return;let n=!1,a=0;function s(){if(n||!e)return;let r=Array.from(e.querySelectorAll(`.nav-item`)).find(e=>e.dataset.navId===t);if(!r){c(e=>e.visible?{...e,visible:!1}:e);return}let s=getComputedStyle(e),l=s.getPropertyValue(`--nav-indicator-axis`).trim(),u=l?l===`horizontal`:s.display===`grid`||s.flexDirection===`row`,d=parseFloat(s.getPropertyValue(`--nav-indicator-inset`))||(u?10:12),f=parseFloat(s.getPropertyValue(`--nav-indicator-thickness`))||3,p=r.getBoundingClientRect(),m=e.getBoundingClientRect(),h=p.left-m.left+e.scrollLeft-e.clientLeft,g=p.top-m.top+e.scrollTop-e.clientTop,_=u?{x:h+d,y:g+p.height-f,width:Math.max(0,p.width-d*2),height:f,visible:!0}:{x:h,y:g+d,width:f,height:Math.max(0,p.height-d*2),visible:!0};c(e=>e.visible===_.visible&&Math.abs(e.x-_.x)<.1&&Math.abs(e.y-_.y)<.1&&Math.abs(e.width-_.width)<.1&&Math.abs(e.height-_.height)<.1?e:_),!i.current&&!a&&(a=window.requestAnimationFrame(()=>{i.current=!0,o(!0)}))}s();let l=new ResizeObserver(s);return l.observe(e),e.querySelectorAll(`.nav-item`).forEach(e=>l.observe(e)),window.addEventListener(`resize`,s),document.fonts.ready.then(s),()=>{n=!0,l.disconnect(),window.removeEventListener(`resize`,s),window.cancelAnimationFrame(a)}},[t,l]),(0,G.jsxs)(`nav`,{ref:r,className:`navigation`,"aria-label":n,children:[e.map(e=>(0,G.jsx)(`a`,{href:e.href,"data-nav-id":e.id,className:`nav-item${t===e.id?` active`:``}`,"aria-current":t===e.id?`page`:void 0,children:e.label},e.id)),(0,G.jsx)(`span`,{className:`nav-indicator`,"aria-hidden":`true`,style:{transform:`translate(${s.x}px, ${s.y}px)`,width:s.width,height:s.height,opacity:a&&s.visible?1:0,...a?{}:{transition:`none`}}})]})}function U({size:e=`long`}){return(0,G.jsx)(`span`,{className:`skeleton-line skeleton-shimmer ${e}`})}function fn(){return(0,G.jsxs)(`div`,{className:`skeleton-heading`,children:[(0,G.jsxs)(`div`,{className:`skeleton-heading-copy`,children:[(0,G.jsx)(U,{size:`title`}),(0,G.jsx)(U,{size:`medium`})]}),(0,G.jsx)(`span`,{className:`skeleton-block skeleton-shimmer`})]})}function pn({library:e=!1}){return(0,G.jsx)(`div`,{className:`metrics-grid${e?` library-metrics`:``}`,children:(e?[{label:`已归档错题`,tone:`green`},{label:`待巩固`,tone:`amber`},{label:`已掌握`,tone:`green`}]:[{label:`已归档错题`,tone:`violet`},{label:`待完善草稿`,tone:`amber`},{label:`累计复习`,tone:`blue`},{label:`当前掌握率`,tone:`green`}]).map(({label:e,tone:t})=>(0,G.jsxs)(`div`,{className:`metric-card skeleton-metric-card`,children:[(0,G.jsxs)(`div`,{className:`metric-top`,children:[(0,G.jsx)(`span`,{className:`skeleton-metric-label skeleton-shimmer`,children:e}),(0,G.jsx)(`span`,{className:`metric-icon ${t}`,children:(0,G.jsx)(`span`,{className:`skeleton-metric-icon skeleton-shimmer`})})]}),(0,G.jsxs)(`div`,{className:`metric-value`,children:[(0,G.jsx)(`span`,{className:`skeleton-metric-count skeleton-shimmer`}),(0,G.jsx)(`span`,{className:`skeleton-metric-unit skeleton-shimmer`})]})]},e))})}function mn({review:e=!1}){return(0,G.jsxs)(`div`,{className:`skeleton-list`,children:[!e&&(0,G.jsxs)(`div`,{className:`skeleton-toolbar`,children:[(0,G.jsx)(U,{size:`medium`}),(0,G.jsx)(U,{size:`short`})]}),Array.from({length:3},(e,t)=>(0,G.jsxs)(`div`,{className:`skeleton-row`,children:[(0,G.jsx)(`span`,{className:`skeleton-row-index skeleton-shimmer`}),(0,G.jsxs)(`div`,{className:`skeleton-row-copy`,children:[(0,G.jsx)(U,{}),(0,G.jsx)(U,{size:`medium`})]}),(0,G.jsx)(U,{size:`short`}),(0,G.jsx)(U,{size:`short`})]},t))]})}function hn(){return(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(`div`,{className:`skeleton-reading-header`,children:(0,G.jsx)(fn,{})}),(0,G.jsxs)(`div`,{className:`skeleton-reading-meta`,children:[(0,G.jsx)(U,{size:`short`}),(0,G.jsx)(U,{size:`short`}),(0,G.jsx)(U,{size:`short`})]}),(0,G.jsx)(`div`,{className:`skeleton-panel skeleton-reading-document`,children:[0,1,2].map(e=>(0,G.jsxs)(`section`,{children:[(0,G.jsx)(U,{size:`short`}),(0,G.jsx)(U,{}),(0,G.jsx)(U,{}),(0,G.jsx)(U,{size:`medium`})]},e))}),(0,G.jsxs)(`div`,{className:`skeleton-panel skeleton-reading-history`,children:[(0,G.jsx)(U,{size:`medium`}),(0,G.jsx)(U,{}),(0,G.jsx)(U,{size:`short`})]})]})}function gn({kind:e=`library`}){let t;switch(e){case`summary`:t=(0,G.jsx)(pn,{library:!0});break;case`rows`:t=(0,G.jsx)(mn,{});break;case`review`:t=(0,G.jsx)(an,{});break;case`review-page`:t=(0,G.jsx)(on,{});break;case`settings`:t=(0,G.jsx)(Yt,{});break;case`settings-page`:t=(0,G.jsx)(Jt,{});break;case`ai-profile`:t=(0,G.jsx)(Xt,{});break;case`backups`:t=(0,G.jsx)(Zt,{});break;case`test-data`:t=(0,G.jsx)(Qt,{});break;case`tasks`:t=(0,G.jsx)(Kt,{});break;case`tasks-page`:t=(0,G.jsx)(qt,{});break;case`stats-page`:t=(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(Wt,{title:`学习统计`,action:`去复习`}),(0,G.jsx)(pn,{}),(0,G.jsx)(Gt,{})]});break;case`stats`:t=(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(pn,{}),(0,G.jsx)(Gt,{})]});break;case`editor`:t=(0,G.jsx)(nn,{});break;case`editor-page`:t=(0,G.jsx)(rn,{});break;case`detail`:t=(0,G.jsx)(hn,{});break;case`shell`:t=(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(fn,{}),(0,G.jsx)(pn,{library:!0}),(0,G.jsx)(mn,{})]});break;default:t=(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(fn,{}),(0,G.jsx)(pn,{library:!0}),(0,G.jsxs)(`div`,{className:`skeleton-toolbar`,children:[(0,G.jsx)(U,{size:`medium`}),(0,G.jsx)(U,{size:`short`})]}),(0,G.jsx)(mn,{})]})}return(0,G.jsx)(`div`,{className:`skeleton-screen skeleton-${e}`,"aria-hidden":`true`,children:t})}function _n({loading:e,kind:t=`library`,className:n=``,children:r}){let i=cn(),[a,o]=(0,W.useState)(e);return(0,W.useEffect)(()=>{if(e){o(!0);return}let t=window.setTimeout(()=>o(!1),i?40:yn);return()=>window.clearTimeout(t)},[e,i]),(0,G.jsxs)(`div`,{className:`loading-content loading-kind-${t} ${e?`is-loading`:`is-ready`} ${n}`.trim(),"aria-busy":e,children:[(0,G.jsx)(`div`,{className:`loading-content-body`,inert:e,"aria-hidden":e||void 0,children:r}),(a||e)&&(0,G.jsxs)(`div`,{className:`loading-content-placeholder`,"aria-hidden":!e||void 0,children:[(0,G.jsx)(`span`,{className:`visually-hidden`,role:`status`,children:`正在加载…`}),(0,G.jsx)(gn,{kind:t})]})]})}var W,G,vn,yn,bn=t((()=>{W=e(w()),sn(),zt(),G=N(),vn=`cubic-bezier(0.22, 0.61, 0.36, 1)`,yn=260}));function xn({className:e=``}){return(0,Sn.jsx)(`img`,{className:`logo-mark ${e}`,src:`/mistakes/logo.svg`,alt:``,width:`48`,height:`48`})}var Sn,Cn=t((()=>{Sn=N()})),wn,Tn,En,Dn,K,On=t((()=>{wn=`modulepreload`,Tn=function(e){return`/mistakes/`+e},En={},Dn=function(e){return e.pathname.endsWith(`.css`)},K=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=Tn(t,n);let r=s(t);if(r.href in En)return;En[r.href]=!0;let i=Dn(r);if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let o=document.createElement(`link`);if(o.rel=i?`stylesheet`:wn,i||(o.as=`script`),o.crossOrigin=``,o.href=r.href,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),i)return new Promise((e,t)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${r}`)))})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})}}));function kn(){return Nn||=K(async()=>{let{FriendlyCaptchaSDK:e}=await import(`./sdk-LxJ6YTVI.js`);return{FriendlyCaptchaSDK:e}},__vite__mapDeps([0,1])).then(({FriendlyCaptchaSDK:e})=>new e).catch(e=>{throw Nn=null,e}),Nn}function An({sitekey:e,resetKey:t,onChange:n}){let r=(0,jn.useRef)(null),[i,a]=(0,jn.useState)(!0);return(0,jn.useEffect)(()=>{let t=r.current;if(!t)return;let i=document.createElement(`div`);t.append(i);let o=!0,s;a(!0),n({status:`pending`,response:``});let c=e=>{if(!o)return;let{state:t,response:r}=e.detail;n(t===`completed`?{status:`complete`,response:r}:t===`error`?{status:`error`,response:r||`.ERROR`}:t===`expired`?{status:`expired`,response:``}:{status:`pending`,response:``})};return i.addEventListener(`frc:widget.statechange`,c),kn().then(t=>{o&&(s=t.createWidget({element:i,sitekey:e,apiEndpoint:`global`,startMode:`focus`,theme:`light`}),a(!1),i.closest(`form`)?.contains(document.activeElement)&&s.start())}).catch(()=>{o&&(a(!1),n({status:`error`,response:`.ERROR`}))}),()=>{o=!1,i.removeEventListener(`frc:widget.statechange`,c),s?.destroy(),i.remove()}},[e,t,n]),(0,Mn.jsxs)(`div`,{className:`auth-captcha-control`,children:[i&&(0,Mn.jsxs)(`div`,{className:`auth-captcha-loading`,role:`status`,children:[(0,Mn.jsx)(te,{className:`spin`,size:16}),` 正在加载人机验证…`]}),(0,Mn.jsx)(`div`,{className:`auth-captcha-widget`,ref:r})]})}var jn,Mn,Nn,Pn=t((()=>{jn=e(w()),A(),Mn=N(),On(),Nn=null})),Fn=t((()=>{}));function In({open:e,onClose:t,title:n,description:r,children:i,wide:o=!1,suspended:s=!1,className:c=``,backdropClassName:f=``,scrollBody:m=!1}){let[v,y]=(0,Ln.useState)(null);return(0,q.jsx)(l,{open:e,modal:!s,disablePointerDismissal:s,onOpenChange:(e,n)=>{s?n.cancel():e||t()},children:(0,q.jsxs)(u,{children:[(0,q.jsx)(a,{className:`photo-dialog-backdrop ${f}`.trim()}),(0,q.jsxs)(p,{ref:y,className:`photo-dialog${o?` photo-dialog-wide`:``} ${c}`.trim(),children:[(0,q.jsxs)(`div`,{className:`photo-dialog-heading`,children:[(0,q.jsx)(h,{children:n}),(0,q.jsx)(d,{className:`icon-button`,"aria-label":`关闭`,children:(0,q.jsx)(D,{size:20})})]}),r&&(0,q.jsx)(g,{className:`photo-dialog-description`,children:r}),(0,q.jsx)(Rn.Provider,{value:v,children:m?(0,q.jsx)(_,{className:`photo-dialog-body`,children:i}):i})]})]})})}var Ln,q,Rn,zn,Bn=t((()=>{s(),A(),Ln=e(w()),f(),Fn(),q=N(),Rn=(0,Ln.createContext)(null),zn=()=>(0,Ln.useContext)(Rn)})),Vn=t((()=>{}));function Hn({open:e,onOpenChange:t,title:n,description:r,closeLabel:i=`关闭`,triggerRef:a,className:o=``,children:s}){return le()?(0,Un.jsx)(ue,{open:e,onOpenChange:t,title:n,description:r,closeLabel:i,triggerRef:a,className:`ai-tasks-mobile-drawer ${o}`.trim(),children:s}):(0,Un.jsx)(In,{open:e,onClose:()=>t(!1),title:n,description:r,wide:!0,scrollBody:!0,className:`ai-tasks-dialog ${o}`.trim(),backdropClassName:`ai-tasks-dialog-backdrop`,children:s(null)})}var Un,Wn=t((()=>{Bn(),ce(),Vn(),Un=N()})),Gn,Kn,qn,Jn=t((()=>{Gn=e(w()),Kn=N(),qn=class extends Gn.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidUpdate(e){this.state.failed&&e.resetKey!==this.props.resetKey&&this.setState({failed:!1})}render(){return this.state.failed?(0,Kn.jsxs)(`div`,{className:`inline-alert`,role:`alert`,children:[`页面加载失败，请刷新后重试。`,(0,Kn.jsx)(`button`,{type:`button`,onClick:()=>window.location.reload(),children:`刷新页面`})]}):this.props.children}}}));function Yn(e){let t=e.split(`?`)[0].match(/^\/mistakes\/(\d+)(\/edit)?$/);return t?{id:Number(t[1]),editing:!!t[2]}:null}var Xn,Zn,Qn,$n,er=t((()=>{Xn=e(w()),Zn=(0,Xn.createContext)(null),Qn=()=>(0,Xn.useContext)(Zn),$n=`mistakes:open-toast-record`}));function tr(e){return{className:`ai-toast-actionable`,closeOnClick:!0,onClick:t=>{if(window.matchMedia(`(max-width: 640px)`).matches&&Yn(e)){t.preventDefault(),window.dispatchEvent(new CustomEvent($n,{cancelable:!0,detail:{path:e}}));return}if(window.matchMedia(`(max-width: 640px)`).matches&&e.startsWith(`/ai-tasks`)){t.preventDefault(),window.dispatchEvent(new CustomEvent(`mistakes:open-ai-tasks`,{detail:{path:e}}));return}window.location.hash===`#${e}`?window.dispatchEvent(new HashChangeEvent(`hashchange`)):jt(e)}}}var nr=t((()=>{zt(),er()}));function rr(){let e=(0,J.useContext)(fr);if(!e)throw Error(`AI tasks context missing`);return e}function ir(){let{jobs:e,openTasks:t}=rr(),n=e.filter(lr).length,r=e.filter(e=>ur(e)||!e.mistakeDeleted&&e.status===`failed`).length,i=n||r;return(0,Y.jsxs)(`button`,{type:`button`,className:`button ghost ai-tasks-trigger`,onClick:t,"aria-label":`AI 任务${i?`，${i} 项${n?`处理中`:`待处理`}`:``}`,children:[(0,Y.jsx)(T,{size:17}),` AI 任务`,i>0&&(0,Y.jsx)(`span`,{className:`count-pill`,children:i})]})}function ar({children:e}){let{user:t}=y(),[n,r]=(0,J.useState)([]),[i,a]=(0,J.useState)(null),[o,s]=(0,J.useState)(!1),c=(0,J.useRef)(null),[l,u]=(0,J.useState)(window.location.hash.split(`?`)[0]===`#/ai-tasks`),[d,f]=(0,J.useState)(``),[p,m]=(0,J.useState)(!1),[h,g]=(0,J.useState)(!1),[_,v]=(0,J.useState)(null),[b,x]=(0,J.useState)(new Set),S=(0,J.useRef)(new Set),[C,w]=(0,J.useState)(!document.hidden),T=(0,J.useRef)(null),ee=(0,J.useRef)(null),E=(0,J.useRef)(!1),te=(0,J.useRef)(!1),D=(0,J.useRef)(0),O=(0,J.useRef)(!0),k=`ai-activity-${t.id}`,A=(0,J.useCallback)(e=>{D.current+=1,O.current&&r(t=>[...e,...t.filter(t=>!e.some(e=>e.id===t.id))].sort((e,t)=>t.id-e.id))},[]),j=(0,J.useCallback)((e=!1)=>{if(E.current=!0,te.current||=e,ee.current)return ee.current;g(!0);let t=(async()=>{do{E.current=!1;let e=D.current,t=te.current;te.current=!1;let[n,i]=await Promise.allSettled([R(`/ai/jobs`,{},{background:!0}),t?R(`/ai/config`,{},{background:!0}):Promise.resolve(null)]);if(!O.current)break;n.status===`fulfilled`&&(e===D.current?(r(n.value),v(Date.now())):E.current=!0),i.status===`fulfilled`&&i.value&&a(i.value),f(n.status===`rejected`?n.reason.message:i.status===`rejected`?i.reason.message:``),m(!0)}while(O.current&&E.current)})().finally(()=>{ee.current=null,O.current&&g(!1)});return ee.current=t,t},[]),M=(0,J.useCallback)(()=>j(!0),[j]);(0,J.useEffect)(()=>{O.current=!0,M();let e=()=>{j()},t=()=>{M()},n=()=>{w(!document.hidden),document.hidden||M()},r=()=>{s(!1),u(window.location.hash.split(`?`)[0]===`#/ai-tasks`)},i=e=>{let t=e.detail.path.split(`?`)[1]||``,n=Number(new URLSearchParams(t).get(`job`))||null;n&&window.dispatchEvent(new CustomEvent(`mistakes:ai-task-toast-target`,{detail:{jobId:n}})),c.current=null,s(!0)};return window.addEventListener(`mistakes:updated`,e),window.addEventListener(`focus`,t),window.addEventListener(`hashchange`,r),window.addEventListener(`mistakes:open-ai-tasks`,i),document.addEventListener(`visibilitychange`,n),()=>{O.current=!1,window.removeEventListener(`mistakes:updated`,e),window.removeEventListener(`focus`,t),window.removeEventListener(`hashchange`,r),window.removeEventListener(`mistakes:open-ai-tasks`,i),document.removeEventListener(`visibilitychange`,n),P.dismiss(k)}},[j,M,k]);let ne=n.filter(lr).length;(0,J.useEffect)(()=>{if(!C)return;let e=setInterval(()=>void j(),ne?2e3:15e3);return()=>clearInterval(e)},[ne,C,j]),(0,J.useEffect)(()=>{o&&M()},[o,M]),(0,J.useEffect)(()=>{if(T.current)for(let e of n){let t=T.current.get(e.id);if(t&&t!==e.status&&!e.mistakeDeleted){if(e.status===`succeeded`){let t=e.applyStatus!==`applied`,n=t?`/mistakes/${e.mistakeId}/edit?aiJob=${e.id}`:`/mistakes/${e.mistakeId}`;P.success((0,Y.jsxs)(`a`,{className:`ai-toast-link`,href:`#${n}`,children:[(0,Y.jsxs)(`span`,{children:[`记录 #`,e.mistakeId,` `,cr(e),`完成`,t?`，待校对。`:`，已填入。`]}),(0,Y.jsx)(`small`,{children:t?`点击校对并填入`:`点击查看错题`})]}),{autoClose:8e3,...tr(n)})}if(e.status===`failed`){let t=`/ai-tasks?job=${e.id}`;P.error((0,Y.jsxs)(`a`,{className:`ai-toast-link`,href:`#${t}`,children:[(0,Y.jsxs)(`span`,{children:[`记录 #`,e.mistakeId,` `,cr(e),`失败。`]}),(0,Y.jsx)(`small`,{children:`点击查看原因并重试`})]}),tr(t))}}}T.current=new Map(n.map(e=>[e.id,e.status]))},[n]),(0,J.useEffect)(()=>{if(!ne||o||l){P.dismiss(k);return}let e=(0,Y.jsxs)(`a`,{className:`ai-toast-link`,href:`#/ai-tasks`,children:[(0,Y.jsxs)(`span`,{children:[ne,` 项 AI 操作正在处理`]}),(0,Y.jsx)(`small`,{children:`点击查看任务`})]}),t={type:`info`,autoClose:!1,...tr(`/ai-tasks`)};P.isActive(k)?P.update(k,{render:e,...t}):P(e,{toastId:k,...t})},[ne,o,l,k]);let re=(0,J.useCallback)(async e=>{try{let t=await R(`/ai/jobs`,Rt(e));return A([t]),t}catch(e){throw P.error(e.message),e}},[A]),N=(0,J.useCallback)(async(e,t={})=>{try{let n=await R(`/ai/jobs/${e}/apply`,Rt(t));return A([n.job]),P.success(`AI 结果已填入。`),n}catch(t){let r=n.find(t=>t.id===e),i=r?`/mistakes/${r.mistakeId}/edit?aiJob=${e}`:`/ai-tasks`;throw P.error((0,Y.jsxs)(`a`,{className:`ai-toast-link`,href:`#${i}`,children:[(0,Y.jsx)(`span`,{children:t.message}),(0,Y.jsx)(`small`,{children:`点击继续校对`})]}),tr(i)),M(),t}},[M,A,n]),ie=(0,J.useCallback)(async(e,t)=>{let n=[...new Set(e)].filter(e=>!S.current.has(e));if(!n.length)return{jobs:[],errors:[]};n.forEach(e=>S.current.add(e)),x(new Set(S.current));try{let e=await R(`/ai/jobs/batch`,Rt({ids:n,action:t}));return A(e.jobs),e.jobs.length&&P.success(t===`retry`?`已将 ${e.jobs.length} 项任务重新加入队列。`:`已取消 ${e.jobs.length} 项任务。`),e}finally{n.forEach(e=>S.current.delete(e)),O.current&&(x(new Set(S.current)),j())}},[j,A]);return(0,Y.jsxs)(fr.Provider,{value:{jobs:n,config:i,error:d,loaded:p,refreshing:h,updatedAt:_,busyIds:b,refresh:M,createJob:re,applyJob:N,actJobs:ie,openTasks:()=>{c.current=document.activeElement instanceof HTMLElement?document.activeElement:null,s(!0)},closeTasks:()=>s(!1)},children:[e,(0,Y.jsx)(Hn,{open:o,onOpenChange:s,title:`AI 任务`,description:`离开页面后任务会继续处理，结果保留在这里。`,closeLabel:`关闭 AI 任务`,triggerRef:c,children:e=>(0,Y.jsx)(qn,{children:(0,Y.jsx)(J.Suspense,{fallback:(0,Y.jsx)(_n,{loading:!0,kind:`tasks`,children:null}),children:(0,Y.jsx)(or,{compact:!0,portalContainer:e})})})})]})}var J,Y,or,sr,cr,lr,ur,dr,fr,pr=t((()=>{J=e(w()),A(),Tt(),zt(),b(),Wn(),Jn(),bn(),nr(),Y=N(),On(),or=(0,J.lazy)(()=>K(()=>import(`./AiTaskManager-DU4guYvD.js`).then(e=>({default:e.AiTaskManager})),__vite__mapDeps([2,1,3,4,5,6,7,8,9,10,11]))),sr={question:`题干识别`,answer:`答案识别`,analysis:`生成解析`},cr=e=>e.mode===`page-entry`?`按页录题`:sr[e.type],lr=e=>[`queued`,`running`,`retrying`].includes(e.status),ur=e=>!e.mistakeDeleted&&e.status===`succeeded`&&e.applyStatus!==`applied`,dr=e=>lr(e)||e.status===`failed`||e.status===`succeeded`&&e.applyStatus!==`applied`,fr=(0,J.createContext)(null)})),mr,hr,gr,_r,vr,yr,br=t((()=>{zt(),mr=class extends Error{constructor(){super(`请求超时，请重试。`)}},hr=[1e3,2e3,4e3],gr=e=>({...e,auxiliaryKnowledgePointIds:[...e.auxiliaryKnowledgePointIds]}),_r=e=>e instanceof Error?e.message:`请求失败，请重试。`,vr=e=>e instanceof Lt?e.status===408||e.status===429||e.status>=500&&e.status<600:e instanceof TypeError||e instanceof mr,yr=class{batches=new Map;listeners=new Set;snapshot=[];subscribe=e=>(this.listeners.add(e),()=>{this.listeners.delete(e)});getSnapshot=()=>this.snapshot;enqueue({mistakeId:e,purpose:t,input:n,files:r,recognize:i,recognitionPrompt:a}){let o=crypto.randomUUID(),s={view:{id:o,mistakeId:e,purpose:t,total:r.length,imageIds:[],status:`uploading`,message:`图片已压缩，正在后台上传…`,reuseRequested:!1},files:[...r],input:gr(n),recognize:i,recognitionPrompt:a?.trim()||void 0,recognitionSubmitted:!1,recognitionClientId:crypto.randomUUID(),reuseClientId:crypto.randomUUID(),running:!1,controller:new AbortController};return this.batches.set(o,s),this.publish(),this.run(s),o}reuse(e,t,n){let r=this.batches.get(e);return!r||r.view.purpose!==`question`||r.view.reuseRequested?!1:(r.reuseInput=gr(t),r.reuseRecognitionPrompt=n?.trim()||void 0,this.update(r,{reuseRequested:!0,reuseStatus:`waiting`}),r.view.imageIds.length===r.view.total&&this.run(r),!0)}retry(e){let t=this.batches.get(e);t&&!t.running&&t.view.status===`failed`&&(t.recognitionError=void 0,t.reuseError=void 0,t.view.reuseStatus===`failed`&&this.update(t,{reuseStatus:`waiting`}),this.run(t))}dispose(){for(let e of this.batches.values())e.controller.abort(),e.files=[];this.batches.clear(),this.snapshot.length&&this.publish()}publish(){this.snapshot=Array.from(this.batches.values(),e=>e.view).reverse(),this.listeners.forEach(e=>e())}update(e,t){e.controller.signal.aborted||(e.view={...e.view,...t},this.publish())}async run(e){if(!(e.running||e.controller.signal.aborted)){e.running=!0;try{try{for(;e.view.imageIds.length<e.view.total;){let t=e.view.imageIds.length,n=e.files[t],r=await this.request(e,`uploading`,`正在后台上传第 ${t+1}/${e.view.total} 张图片…`,9e4,t=>{let r=new FormData;return r.append(`original`,n.original,n.originalName.replace(/\.[^.]+$/,``)+`.jpg`),r.append(`crop`,n.crop,`crop.jpg`),r.append(`purpose`,e.view.purpose),r.append(`clientId`,n.clientId),R(`/mistakes/${e.view.mistakeId}/images`,{method:`POST`,body:r,signal:t},{background:!0})});this.update(e,{imageIds:[...e.view.imageIds,r.id]})}e.files=[]}catch(t){e.controller.signal.aborted||this.update(e,{status:`failed`,message:`图片上传失败：${_r(t)}`});return}if(e.recognize&&!e.recognitionSubmitted&&!e.recognitionError)try{await this.submitRecognition(e,e.view.purpose,e.input,e.recognitionClientId,e.recognitionPrompt),e.recognitionSubmitted=!0}catch(t){if(e.controller.signal.aborted)return;e.recognitionError=_r(t)}if(e.reuseInput&&e.view.reuseStatus===`waiting`){this.update(e,{reuseStatus:`submitting`});try{await this.submitRecognition(e,`answer`,e.reuseInput,e.reuseClientId,e.reuseRecognitionPrompt),this.update(e,{reuseStatus:`submitted`})}catch(t){if(e.controller.signal.aborted)return;e.reuseError=_r(t),this.update(e,{reuseStatus:`failed`})}}let t=[e.recognitionError&&`识别任务提交失败：${e.recognitionError}`,e.reuseError&&`答案复用提交失败：${e.reuseError}`].filter(Boolean);this.update(e,{status:t.length?`failed`:`completed`,message:t.length?t.join(`；`):e.view.reuseStatus===`submitted`?`图片已上传，答案复用已交给后台识别。`:e.recognize?`图片已上传，已交给后台识别。`:`${e.view.total} 张图片已上传。`})}finally{e.running=!1,!e.controller.signal.aborted&&e.view.imageIds.length===e.view.total&&e.view.reuseStatus===`waiting`&&this.run(e)}}}submitRecognition(e,t,n,r,i){return this.request(e,`processing`,`正在后台提交${t===`question`?`题目`:`答案`}识别…`,3e4,a=>R(`/ai/jobs`,{...Rt({clientId:r,mistakeId:e.view.mistakeId,type:t,imageIds:e.view.imageIds,input:n,recognitionPrompt:i}),signal:a},{background:!0}))}async request(e,t,n,r,i){for(let a=0;;a+=1){e.controller.signal.throwIfAborted(),this.update(e,{status:t,message:n});try{return await this.withTimeout(e,r,i)}catch(t){if(e.controller.signal.aborted||!vr(t)||a>=hr.length)throw t;let n=hr[a];this.update(e,{status:`retrying`,message:`网络请求失败，${n/1e3} 秒后自动重试（${a+1}/${hr.length}）…`}),await this.wait(e,n)}}}async withTimeout(e,t,n){e.controller.signal.throwIfAborted();let r=new AbortController,i=()=>r.abort();e.controller.signal.addEventListener(`abort`,i,{once:!0});let a=!1,o=setTimeout(()=>{a=!0,r.abort()},t);try{return await n(r.signal)}catch(e){throw a?new mr:e}finally{clearTimeout(o),e.controller.signal.removeEventListener(`abort`,i)}}wait(e,t){return new Promise((n,r)=>{let i=e.controller.signal,a=()=>{clearTimeout(o),r(i.reason)},o=setTimeout(()=>{i.removeEventListener(`abort`,a),n()},t);i.addEventListener(`abort`,a,{once:!0}),i.aborted&&a()})}}}));function xr(){let e=(0,Cr.useContext)(Tr);if(!e)throw Error(`Photo uploads context missing`);return e}function Sr({children:e}){let[t]=(0,Cr.useState)(()=>new yr),n=(0,Cr.useRef)(new Map),r=(0,Cr.useSyncExternalStore)(t.subscribe,t.getSnapshot);return(0,Cr.useEffect)(()=>()=>{t.getSnapshot().forEach(e=>P.dismiss(`photo-upload-${e.id}`)),t.dispose()},[t]),(0,Cr.useEffect)(()=>{for(let e of r){if(n.current.get(e.id)===e)continue;n.current.set(e.id,e);let r=`photo-upload-${e.id}`,i=e.status===`completed`||e.status===`failed`,a=`/mistakes/${e.mistakeId}/edit?photo=${e.purpose}`,o=(0,wr.jsxs)(`div`,{className:`ai-toast-copy`,children:[(0,wr.jsxs)(`a`,{className:`ai-toast-link`,href:`#${a}`,children:[(0,wr.jsxs)(`span`,{children:[`记录 #`,e.mistakeId,` · `,e.message]}),(0,wr.jsx)(`small`,{children:`点击打开题目处理`})]}),e.status===`failed`&&(0,wr.jsx)(`button`,{type:`button`,onClick:n=>{n.stopPropagation(),t.retry(e.id)},children:`重试`})]}),s={type:e.status===`failed`?`error`:e.status===`completed`?`success`:`info`,isLoading:!i,autoClose:e.status===`completed`&&4500,closeButton:i,...tr(a)};P.isActive(r)?P.update(r,{render:o,...s}):P(o,{toastId:r,...s})}},[r,t]),(0,wr.jsx)(Tr.Provider,{value:{queue:t,batches:r},children:e})}var Cr,wr,Tr,Er=t((()=>{Cr=e(w()),Tt(),br(),nr(),wr=N(),Tr=(0,Cr.createContext)(null)})),Dr=t((()=>{}));function Or({path:e,editorId:t,skeletonKind:n,children:r}){let[i]=(0,X.useState)(()=>document.createElement(`div`)),a=(0,X.useRef)(null),[o,s]=(0,X.useState)(null),[c,l]=(0,X.useState)(null),[u,d]=(0,X.useState)(null),[f,p]=(0,X.useState)(!1),m=(0,X.useRef)(null),h=(0,X.useRef)(0),g=(0,X.useRef)({hash:``,x:0,y:0}),_=(0,X.useRef)(new Set),v=(0,X.useRef)({target:u,editorId:t,open:f});v.current={target:u,editorId:t,open:f};let y=!!(u?.editing&&t===u.id),b=(0,X.useCallback)(e=>{let{target:t,editorId:n}=v.current;return!t?.editing||t.id===n||!!e?.editing&&e.id===t.id||!m.current||m.current()},[]),x=(0,X.useCallback)(()=>{b(null)&&p(!1)},[b]),S=(0,X.useCallback)(e=>{let t=Yn(e);if(!t){jt(e);return}b(t)&&(v.current.target||(g.current={hash:window.location.hash,x:window.scrollX,y:window.scrollY}),d({...t,path:e,requestId:++h.current}),p(!0))},[b]),C=(0,X.useCallback)(e=>(m.current=e,()=>{m.current===e&&(m.current=null)}),[]),w=(0,X.useCallback)(e=>{if(!(e||v.current.open)){d(null);for(let e of _.current)window.dispatchEvent(new CustomEvent(`mistakes:record-view-updated`,{detail:{id:e}}));_.current.clear(),window.location.hash===g.current.hash&&requestAnimationFrame(()=>window.scrollTo(g.current.x,g.current.y))}},[]);(0,X.useEffect)(()=>{let e=e=>{let t=e.detail.path;e.preventDefault(),S(t)},t=()=>{v.current.target&&window.location.hash!==g.current.hash&&p(!1)},n=()=>{v.current.target&&_.current.add(v.current.target.id)};return window.addEventListener($n,e),window.addEventListener(`hashchange`,t),window.addEventListener(`mistakes:updated`,n),()=>{window.removeEventListener($n,e),window.removeEventListener(`hashchange`,t),window.removeEventListener(`mistakes:updated`,n)}},[S]),(0,X.useLayoutEffect)(()=>{let e=y?o:a.current;e&&i.parentElement!==e&&(y&&a.current&&(a.current.style.minHeight=`${a.current.getBoundingClientRect().height}px`),e.appendChild(i),!y&&a.current&&(a.current.style.minHeight=``))},[i,y,o]);let T=e=>{if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;let t=e.target.closest(`a[href^="#/"]`);if(!t||t.target===`_blank`||t.hasAttribute(`download`))return;let n=t.getAttribute(`href`).slice(1);Yn(n)&&(e.preventDefault(),S(n))},ee=u?{path:u.path,requestId:u.requestId,navigate:S,registerLeaveCheck:C,actionsContainer:c,retainsEditor:y,saved:()=>{v.current.target?.id===u.id&&x()},updated:e=>{_.current.delete(e),window.dispatchEvent(new CustomEvent(`mistakes:record-view-updated`,{detail:{id:e}}))}}:null,E=u?.editing?`editor`:`detail`;return(0,Z.jsxs)(Z.Fragment,{children:[(0,Z.jsx)(`div`,{ref:a,className:`record-page-slot`}),(0,kr.createPortal)((0,Z.jsx)(Zn.Provider,{value:y?ee:null,children:(0,Z.jsx)(qn,{resetKey:e.split(`?`)[0],children:(0,Z.jsx)(X.Suspense,{fallback:(0,Z.jsx)(_n,{loading:!0,kind:n,children:null}),children:r})})}),i),u&&(0,Z.jsx)(ue,{open:f,onOpenChange:e=>e?p(!0):x(),onOpenChangeComplete:w,title:u.editing?`编辑错题`:`错题详情`,closeLabel:`关闭题目`,className:`record-view-drawer`,footer:(0,Z.jsx)(`div`,{ref:l,className:`record-view-actions`,onClickCapture:T}),children:()=>(0,Z.jsx)(`div`,{ref:s,className:`record-view-slot`,onClickCapture:T,children:!y&&(0,Z.jsx)(Zn.Provider,{value:ee,children:(0,Z.jsx)(qn,{resetKey:u.path,children:(0,Z.jsx)(X.Suspense,{fallback:(0,Z.jsx)(_n,{loading:!0,kind:E,children:null}),children:u.editing?(0,Z.jsx)(jr,{id:u.id},`editor-${u.id}`):(0,Z.jsx)(Ar,{id:u.id},`detail-${u.id}`)})})})})})]})}var X,kr,Z,Ar,jr,Mr=t((()=>{X=e(w()),kr=e(i()),zt(),ce(),bn(),Jn(),er(),Dr(),Z=N(),On(),Ar=(0,X.lazy)(()=>K(()=>import(`./DetailPage-B2lihpX_.js`).then(e=>({default:e.DetailPage})),__vite__mapDeps([12,1,3,4,5,13,14,15,7,9,16,6,8,17,18]))),jr=(0,X.lazy)(()=>K(()=>import(`./EditorPage-BOJVp9n8.js`).then(e=>({default:e.EditorPage})),__vite__mapDeps([19,1,3,4,5,6,7,8,17,20,18,21])))}));function Nr({onLogin:e,onNotify:t}){let[n,r]=(0,Q.useState)(!1),[i,a]=(0,Q.useState)(``),[o,s]=(0,Q.useState)(``),[c,l]=(0,Q.useState)(``),[u,d]=(0,Q.useState)(!1),[f,p]=(0,Q.useState)(``),[m,h]=(0,Q.useState)(null),[g,_]=(0,Q.useState)(``),[v,y]=(0,Q.useState)(0),[b,x]=(0,Q.useState)({status:`pending`,response:``}),[C,w]=(0,Q.useState)(0),T=(0,Q.useRef)(!1);(0,Q.useEffect)(()=>{let e=!0;return h(null),_(``),R(`/auth/config`).then(t=>{e&&h(t)}).catch(t=>{e&&_(t.message)}),()=>{e=!1}},[v]);let E=m!==null&&(!m.enabled||b.status===`complete`||!n&&b.status===`error`);function D(){x({status:`pending`,response:``}),w(e=>e+1)}async function A(r){if(r.preventDefault(),!T.current&&E){T.current=!0,d(!0),p(``);try{let r=await R(n?`/auth/register`:`/auth/login`,Rt({username:i.trim(),password:o,captchaResponse:m?.enabled?b.response:``,...n?{inviteCode:c.trim()}:{}}));t(n?`欢迎，${r.user.username}！账号已创建。`:`欢迎回来，${r.user.username}！`),e(r.user)}catch(e){p(e.message),P.error(e.message),D()}finally{T.current=!1,d(!1)}}}return(0,$.jsxs)(`div`,{className:`auth-page`,children:[(0,$.jsxs)(`aside`,{className:`auth-story`,children:[(0,$.jsxs)(`a`,{className:`brand`,href:`/`,"aria-label":`返回首页`,children:[(0,$.jsx)(xn,{}),(0,$.jsxs)(`span`,{className:`brand-text`,children:[`拾题`,(0,$.jsx)(`span`,{children:`把错题，学明白。`})]})]}),(0,$.jsxs)(`div`,{className:`auth-story-body`,children:[(0,$.jsxs)(`span`,{className:`small-pill`,children:[(0,$.jsx)(ie,{size:16}),` 你的个人错题本`]}),(0,$.jsxs)(`h1`,{children:[`做错的题，`,(0,$.jsx)(`br`,{}),`值得再想一遍。`]}),(0,$.jsxs)(`p`,{children:[`记录卡住你的那一步，梳理知识点。`,(0,$.jsx)(`br`,{}),`再练一次，让「不熟」慢慢变成「掌握」。`]}),(0,$.jsxs)(`div`,{className:`auth-note`,children:[(0,$.jsxs)(`div`,{className:`auth-note-top`,children:[(0,$.jsxs)(`span`,{children:[(0,$.jsx)(ie,{size:18}),` 我的学习笔记`]}),(0,$.jsx)(`span`,{className:`note-dots`,children:`•••`})]}),(0,$.jsx)(`div`,{className:`note-rule long`}),(0,$.jsx)(`div`,{className:`note-rule`}),(0,$.jsxs)(`div`,{className:`auth-note-bottom`,children:[(0,$.jsxs)(`span`,{children:[(0,$.jsx)(O,{size:17}),` 记录 · 整理 · 复习`]}),(0,$.jsx)(`span`,{className:`note-check`,children:(0,$.jsx)(O,{size:25})})]})]})]}),(0,$.jsx)(`div`,{className:`auth-story-footer`,children:`记录问题 · 理清思路 · 回顾练习`})]}),(0,$.jsx)(`main`,{className:`auth-form-area`,children:(0,$.jsxs)(`div`,{className:`auth-form-wrap`,children:[(0,$.jsx)(`div`,{className:`auth-icon`,children:(0,$.jsx)(S,{size:30})}),(0,$.jsx)(`h2`,{children:n?`开始积累，遇见进步`:`欢迎回来`}),(0,$.jsx)(`p`,{className:`auth-subtitle`,children:n?`使用邀请码创建账号，开启你的错题本。`:`登录后，继续整理你的学习收获。`}),(0,$.jsxs)(`form`,{onSubmit:A,children:[(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`用户名`}),(0,$.jsx)(`input`,{required:!0,autoComplete:`username`,minLength:3,maxLength:32,placeholder:`输入用户名`,value:i,onChange:e=>a(e.target.value)})]}),(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`密码`}),(0,$.jsx)(`input`,{required:!0,type:`password`,autoComplete:n?`new-password`:`current-password`,minLength:n?8:void 0,maxLength:128,placeholder:n?`至少 8 位密码`:`输入密码`,value:o,onChange:e=>s(e.target.value)})]}),n&&(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`邀请码`}),(0,$.jsx)(`input`,{required:!0,placeholder:`输入管理员提供的邀请码`,value:c,onChange:e=>l(e.target.value)}),(0,$.jsx)(`small`,{children:`邀请码由管理员生成。`})]}),!m&&(g?(0,$.jsxs)(`div`,{className:`auth-captcha-notice is-error`,role:`alert`,children:[(0,$.jsxs)(`span`,{children:[`安全配置加载失败：`,g]}),(0,$.jsx)(`button`,{type:`button`,onClick:()=>y(e=>e+1),children:`重新加载`})]}):(0,$.jsxs)(`div`,{className:`auth-captcha-loading`,role:`status`,children:[(0,$.jsx)(te,{className:`spin`,size:16}),` 正在加载安全验证…`]})),m?.enabled&&(0,$.jsxs)(`div`,{className:`auth-captcha`,children:[(0,$.jsx)(An,{sitekey:m.sitekey,resetKey:C,onChange:x},`${n}-${C}`),(b.status===`error`||b.status===`expired`)&&(0,$.jsxs)(`div`,{className:`auth-captcha-notice`,role:`status`,children:[(0,$.jsx)(`span`,{children:b.status===`expired`?`验证已过期，请重新验证。`:n?`人机验证暂不可用，请重试后再注册。`:`人机验证暂不可用，你可以重试或尝试登录。`}),(0,$.jsx)(`button`,{type:`button`,disabled:u,onClick:D,children:`重新验证`})]})]}),f&&(0,$.jsx)(`div`,{className:`form-error`,role:`alert`,children:f}),(0,$.jsx)(`button`,{className:`button primary auth-submit`,disabled:u||!E,children:u?(0,$.jsx)(te,{className:`spin`,size:18}):(0,$.jsxs)($.Fragment,{children:[n?`创建账号`:`登录`,(0,$.jsx)(ee,{size:18})]})})]}),(0,$.jsxs)(`div`,{className:`auth-switch`,children:[n?`已有账号？`:`还没有账号？`,(0,$.jsx)(`button`,{disabled:u,onClick:()=>{T.current||(r(!n),p(``),D())},children:n?`立即登录`:`使用邀请码注册`})]}),(0,$.jsxs)(`div`,{className:`auth-secure`,children:[(0,$.jsx)(k,{size:15}),` 你的错题与笔记，仅对你可见`]})]})})]})}function Pr(){let[e,t]=(0,Q.useState)(null),[n,i]=(0,Q.useState)(!0),[a,o]=(0,Q.useState)([]),[s,l]=(0,Q.useState)([]),[u,d]=(0,Q.useState)(``),[f,p]=(0,Q.useState)(!1),[m,h]=(0,Q.useState)(window.location.hash.slice(1)||`/mistakes`),[g,_]=(0,Q.useState)({session:0,recordId:null}),v=(0,Q.useRef)(null);(0,Q.useEffect)(()=>{let e=!0,n=(window.location.hash.slice(1)||`/mistakes`).split(`?`)[0];R(`/auth/me`).then(r=>{e&&(r.user&&[`/mistakes`,`/`].includes(n)&&(v.current=`欢迎回来，${r.user.username}！`),t(r.user))}).catch(()=>{e&&t(null)}).finally(()=>{e&&i(!1)});let r=e=>{let t=window.location.hash.slice(1)||`/mistakes`;if(!window.dispatchEvent(new CustomEvent(`mistakes:before-navigate`,{cancelable:!0,detail:{path:t}}))){window.history.replaceState(null,``,new URL(e.oldURL).hash||`#/mistakes`);return}let n=t.split(`?`)[0];_(e=>n===`/new`?{session:e.session+1,recordId:null}:e.recordId&&n!==`/mistakes/${e.recordId}/edit`?{...e,recordId:null}:e),h(t),window.scrollTo(0,0)};return window.addEventListener(`hashchange`,r),()=>{e=!1,window.removeEventListener(`hashchange`,r)}},[]);let y=(0,Q.useCallback)((e,t=`success`)=>{P[t](e)},[]);(0,Q.useEffect)(()=>{if(e&&v.current){let e=v.current;v.current=null,y(e)}},[e,y]);let b=(0,Q.useCallback)(async()=>{try{let[e,t]=await Promise.all([R(`/subjects`),R(`/knowledge-points`)]);o(e),l(r(t,e)),d(``)}catch(e){d(e.message)}},[]);(0,Q.useEffect)(()=>{e&&b()},[e,b]),(0,Q.useEffect)(()=>{if(!e){p(!1);return}let t=!0,n=!1,r=0,i=async()=>{if(n||document.hidden)return;n=!0;let e=r;try{let n=await R(`/system/status`,{},{background:!0});t&&r===e&&p(n.readOnly)}catch{}finally{n=!1}},a=e=>{let t=e.detail;typeof t?.readOnly==`boolean`&&(r+=1,p(t.readOnly))},o=()=>{i()};window.addEventListener(`mistakes:backup-status`,a),window.addEventListener(`focus`,o),document.addEventListener(`visibilitychange`,o);let s=window.setInterval(()=>{i()},15e3);return i(),()=>{t=!1,window.clearInterval(s),window.removeEventListener(`mistakes:backup-status`,a),window.removeEventListener(`focus`,o),document.removeEventListener(`visibilitychange`,o)}},[e?.id]);let x=(0,Q.useCallback)(async()=>{if(window.dispatchEvent(new Event(`mistakes:before-logout`,{cancelable:!0}))){window.dispatchEvent(new Event(`mistakes:session-ending`));try{await R(`/auth/logout`,Rt({})),y(`已退出登录。`),t(null),o([]),l([]),window.location.hash=`/mistakes`}catch(e){window.dispatchEvent(new Event(`mistakes:session-resumed`)),y(e.message,`error`)}}},[y]),S=m.split(`?`)[0],C=S.match(/^\/mistakes\/(\d+)(\/edit)?$/),w=C?C[2]?`editor-page`:`detail`:Ur[S]||`library`,T=C?`/mistakes`:S===`/page-imports`?`/new`:S,E=S===`/new`?g.recordId:C?.[2]?Number(C[1]):null,te;te=S===`/new`?(0,$.jsx)(Ir,{onCreated:e=>_(t=>({...t,recordId:e}))},`new-${g.session}`):S===`/page-imports`?(0,$.jsx)(Vr,{}):C?.[2]?(0,$.jsx)(Ir,{id:Number(C[1])},g.recordId===Number(C[1])?`new-${g.session}`:S):C?(0,$.jsx)(Lr,{id:Number(C[1])},m):S===`/review`?(0,$.jsx)(Rr,{},m):S===`/stats`?(0,$.jsx)(zr,{}):S===`/ai-tasks`?(0,$.jsx)(Hr,{}):S===`/settings`?(0,$.jsx)(Br,{}):(0,$.jsx)(Fr,{});let D=e?(0,$.jsx)(c.Provider,{value:{user:e,updateUser:t,subjects:a,knowledgePoints:s,refreshDirectory:b,notify:y,logout:x},children:(0,$.jsx)(ar,{children:(0,$.jsx)(Sr,{children:(0,$.jsxs)(`div`,{className:`app-shell`,children:[(0,$.jsxs)(`aside`,{className:`sidebar`,children:[(0,$.jsxs)(`a`,{className:`brand`,href:`#/mistakes`,children:[(0,$.jsx)(xn,{}),(0,$.jsxs)(`span`,{className:`brand-text`,children:[`拾题`,(0,$.jsx)(`span`,{children:`把错题，学明白。`})]})]}),(0,$.jsx)(`div`,{className:`sidebar-label`,children:`学习空间`}),(0,$.jsx)(dn,{value:T,ariaLabel:`主导航`,items:Wr.map(({path:e,label:t,icon:n})=>({id:e,href:`#${e}`,label:(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(n,{size:19,strokeWidth:1.8}),(0,$.jsx)(`span`,{children:t})]})}))}),(0,$.jsxs)(`div`,{className:`sidebar-bottom`,children:[(0,$.jsxs)(`div`,{className:`sidebar-reminder`,children:[(0,$.jsx)(`span`,{className:`reminder-icon`,children:(0,$.jsx)(ne,{size:22})}),(0,$.jsx)(`strong`,{children:`温故而知新，可以为师矣`}),(0,$.jsx)(`a`,{href:`#/review`,children:`打开复习页`})]}),(0,$.jsxs)(`div`,{className:`account`,children:[(0,$.jsxs)(`a`,{className:`account-profile`,href:`#/settings`,children:[(0,$.jsx)(`span`,{className:`avatar`,children:e.avatar?(0,$.jsx)(`img`,{src:e.avatar,alt:``}):e.username.slice(0,1).toUpperCase()}),(0,$.jsxs)(`span`,{className:`account-name`,children:[(0,$.jsx)(`strong`,{title:e.username,children:e.username}),(0,$.jsx)(`small`,{children:e.role===`admin`?`管理员`:`我的账号`})]})]}),(0,$.jsx)(`button`,{className:`icon-button`,title:`退出登录`,"aria-label":`退出登录`,onClick:x,children:(0,$.jsx)(M,{size:17})})]})]})]}),(0,$.jsxs)(`div`,{className:`main-shell`,children:[(0,$.jsxs)(`header`,{className:`topbar`,children:[(0,$.jsxs)(`span`,{className:`topbar-label`,children:[(0,$.jsx)(ae,{size:15}),` 个人学习空间`]}),(0,$.jsxs)(`div`,{className:`topbar-right`,children:[(0,$.jsx)(ir,{}),(0,$.jsxs)(`a`,{className:`workspace-state`,href:`/`,children:[(0,$.jsx)(ee,{size:16}),` 返回个人主页`]}),(0,$.jsx)(`a`,{className:`topbar-avatar`,href:`#/settings`,"aria-label":`账号设置`,children:e.avatar?(0,$.jsx)(`img`,{src:e.avatar,alt:``}):e.username.slice(0,1).toUpperCase()})]})]}),(0,$.jsxs)(`main`,{className:`main-content`,children:[f&&(0,$.jsxs)(`div`,{className:`backup-readonly-banner`,role:`status`,children:[(0,$.jsx)(re,{size:20}),(0,$.jsxs)(`p`,{children:[(0,$.jsx)(`strong`,{children:`正在备份，暂时只读`}),(0,$.jsx)(`span`,{children:`已输入的内容会保留，请稍后重试保存。`})]})]}),u&&(0,$.jsxs)(`div`,{className:`inline-alert`,role:`alert`,children:[`基础目录加载失败：`,u,(0,$.jsx)(`button`,{onClick:b,children:`重试`})]}),(0,$.jsx)(Or,{path:m,editorId:E,skeletonKind:w,children:te}),(0,$.jsx)(`footer`,{className:`page-footer`,children:(0,$.jsxs)(`span`,{children:[`拾题 · © `,new Date().getFullYear(),` ShaoanC`]})})]})]})]})})},e.id)}):(0,$.jsx)(Nr,{onLogin:e=>{t(e),h(`/mistakes`),window.location.hash=`/mistakes`},onNotify:e=>{v.current=e}});return(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(ln,{}),(0,$.jsx)(_n,{loading:n,kind:`shell`,className:`app-entrance`,children:!n&&D})]})}var Q,$,Fr,Ir,Lr,Rr,zr,Br,Vr,Hr,Ur,Wr,Gr=t((()=>{Q=e(w()),Tt(),A(),zt(),b(),bn(),Cn(),Pn(),pr(),Er(),Mr(),$=N(),On(),Fr=(0,Q.lazy)(()=>K(()=>import(`./MistakesPage-B1Y2lg8a.js`).then(e=>({default:e.MistakesPage})),__vite__mapDeps([22,1,3,4,5,13,14,15,7,9,16,6,8,17,10,11]))),Ir=(0,Q.lazy)(()=>K(()=>import(`./EditorPage-BOJVp9n8.js`).then(e=>({default:e.EditorPage})),__vite__mapDeps([19,1,3,4,5,6,7,8,17,20,18,21]))),Lr=(0,Q.lazy)(()=>K(()=>import(`./DetailPage-B2lihpX_.js`).then(e=>({default:e.DetailPage})),__vite__mapDeps([12,1,3,4,5,13,14,15,7,9,16,6,8,17,18]))),Rr=(0,Q.lazy)(()=>K(()=>import(`./ReviewPage-DfVwsp07.js`).then(e=>({default:e.ReviewPage})),__vite__mapDeps([23,1,3,4,5,6,7,8,17,9]))),zr=(0,Q.lazy)(()=>K(()=>import(`./StatsPage-CmDA7gop.js`).then(e=>({default:e.StatsPage})),__vite__mapDeps([24,1,3,4,5,25,7]))),Br=(0,Q.lazy)(()=>K(()=>import(`./SettingsPage-BVXhYd_2.js`).then(e=>({default:e.SettingsPage})),__vite__mapDeps([26,1,3,4,5,7]))),Vr=(0,Q.lazy)(()=>K(()=>import(`./PageImports-BvkH8Ya4.js`).then(e=>({default:e.PageImportsPage})),__vite__mapDeps([27,1,3,4,5,20,28]))),Hr=(0,Q.lazy)(()=>K(()=>import(`./AiTaskManager-DU4guYvD.js`).then(e=>({default:e.AiTasksPage})),__vite__mapDeps([2,1,3,4,5,6,7,8,9,10,11]))),Ur={"/new":`editor-page`,"/page-imports":`editor`,"/review":`review-page`,"/stats":`stats-page`,"/ai-tasks":`tasks-page`,"/settings":`settings-page`},Wr=[{path:`/mistakes`,label:`我的错题`,icon:E},{path:`/new`,label:`录入错题`,icon:x},{path:`/review`,label:`复习`,icon:ne},{path:`/stats`,label:`学习统计`,icon:j},{path:`/ai-tasks`,label:`AI 任务`,icon:T},{path:`/settings`,label:`设置`,icon:C}]})),Kr=t((()=>{})),qr=t((()=>{}));n((()=>{var t=e(w()),n=e(o());Tt(),Gr(),m(),Kr(),v(),qr();var r=N();n.createRoot(document.getElementById(`root`)).render((0,r.jsxs)(t.StrictMode,{children:[(0,r.jsx)(Pr,{}),(0,r.jsx)(Ve,{className:`mistakes-toast-container`,position:`top-right`,autoClose:4500,transition:bt,theme:`light`,limit:3,newestOnTop:!0,closeOnClick:!1,draggablePercent:15})]}))}))();export{Tt as A,Bt as C,zt as D,At as E,Rt as O,Vt as S,R as T,K as _,dr as a,un as b,ur as c,Qn as d,Hn as f,zn as g,Bn as h,cr as i,P as j,jt as k,rr as l,In as m,xr as n,pr as o,Wn as p,sr as r,lr as s,Er as t,er as u,On as v,Lt as w,bn as x,_n as y};