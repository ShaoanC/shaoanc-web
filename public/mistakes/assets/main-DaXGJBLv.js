const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/sdk-LxJ6YTVI.js","assets/rolldown-runtime-8BhlS34s.js","assets/AiQuickPanel-t_zcc-WU.js","assets/body-fonts-B65LsYTj.js","assets/lucide-react-BK1UzKeB.js","assets/body-fonts-D2pN-qLK.css","assets/dialog-BBYUtc01.js","assets/editor-draft-C-mtxzaV.js","assets/MarkdownContent-O1h_SDwC.js","assets/ScrollArea-CMPedwjI.js","assets/components-Dq4BMxrf.js","assets/MarkdownContent-B_AG56q7.css","assets/ImageRegions-B8eaFSKc.js","assets/AiDialog-Dm5_Hzyd.js","assets/AiDialog-BHkByL89.css","assets/DetailPage-BTYU-rtL.js","assets/export-selection-WLVLDjdz.js","assets/Select-BTxA2wP7.js","assets/export-selection-DojGCrBo.css","assets/StarRating-Dh8MLEIw.js","assets/ImageHistory-D8qPdt-T.js","assets/EditorPage-CejYDB9Q.js","assets/photo-rotation-BMZRYkRY.js","assets/EditorPage-nW3thV_y.css","assets/MistakesPage-DQXTfPLR.js","assets/library-pagination-DLQr9GFi.js","assets/library-pagination-yghQomn8.css","assets/MistakeFilterFields-CF0JFOjg.js","assets/ReviewPage-4QUxfiDf.js","assets/StatsPage-DwbVRf6C.js","assets/clsx-DNZXw_RA.js","assets/SettingsPage-DhSL9OPr.js","assets/PageImports-ObUZFAfx.js","assets/PageImports-RKBO6lQU.css","assets/AiTaskManager-D-0XbeAv.js"])))=>i.map(i=>d[i]);
import{i as e,n as t,t as n}from"./rolldown-runtime-8BhlS34s.js";import{$ as r,A as i,B as a,Bt as o,C as s,D as c,Dt as l,F as u,Ft as d,G as f,Gt as p,Ht as m,I as h,It as g,J as _,Jt as v,Kt as y,Lt as b,M as x,P as S,Rt as C,S as w,Ut as T,V as E,Vt as D,W as O,Wt as k,X as A,Y as j,Yt as M,Z as ee,_ as N,_n as te,_t as ne,a as P,an as re,at as ie,b as F,bn as I,c as ae,cn as oe,ct as L,d as R,dn as se,et as ce,f as le,g as ue,gn as z,gt as de,h as fe,ht as pe,i as me,in as he,it as ge,j as _e,jt as ve,kt as ye,l as be,ln as xe,lt as Se,m as Ce,mt as B,n as we,nn as Te,on as Ee,p as De,q as Oe,qt as ke,r as Ae,s as je,t as Me,tn as Ne,u as Pe,un as Fe,v as Ie,vn as Le,x as Re,xn as ze,y as Be,yn as Ve,zt as He}from"./body-fonts-B65LsYTj.js";import{A as Ue,En as We,Fn as V,K as Ge,Kt as Ke,M as qe,Pn as Je,Pt as Ye,Q as Xe,Sn as Ze,Wt as Qe,en as $e,f as et,ft as tt,gt as nt,i as rt,in as it,mt as at,t as ot,w as st,wt as ct}from"./lucide-react-BK1UzKeB.js";import{n as lt,t as ut}from"./clsx-DNZXw_RA.js";function dt(e,t,n=300){let{scrollHeight:r,style:i}=e;requestAnimationFrame(()=>{i.minHeight=`initial`,i.height=r+`px`,i.transition=`all ${n}ms`,requestAnimationFrame(()=>{i.height=`0`,i.padding=`0`,i.margin=`0`,setTimeout(t,n)})})}function ft({enter:e,exit:t,appendPosition:n=!1,collapse:r=!0,collapseDuration:i=300}){return function({children:a,position:o,preventExitTransition:s,done:c,nodeRef:l,isIn:u,playToast:d}){let f=n?`${e}--${o}`:e,p=n?`${t}--${o}`:t,m=(0,Ut.useRef)(0);return(0,Ut.useLayoutEffect)(()=>{let e=l.current,t=f.split(` `),n=r=>{r.target===l.current&&(d(),e.removeEventListener(`animationend`,n),e.removeEventListener(`animationcancel`,n),m.current===0&&r.type!==`animationcancel`&&e.classList.remove(...t))};e.classList.add(...t),e.addEventListener(`animationend`,n),e.addEventListener(`animationcancel`,n)},[]),(0,Ut.useEffect)(()=>{let e=l.current,t=()=>{e.removeEventListener(`animationend`,t),r?dt(e,c,i):c()};u||(s?t():(m.current=1,e.className+=` ${p}`,e.addEventListener(`animationend`,t)))},[u]),Ut.createElement(Ut.Fragment,null,a)}}function pt(e,t){return{content:mt(e.content,e.props),containerId:e.props.containerId,id:e.props.toastId,theme:e.props.theme,type:e.props.type,data:e.props.data||{},isLoading:e.props.isLoading,icon:e.props.icon,reason:e.removalReason,status:t}}function mt(e,t,n=!1){return(0,Wt.isValidElement)(e)&&!tn(e.type)?(0,Wt.cloneElement)(e,{closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):nn(e)?e({closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):e}function ht({closeToast:e,theme:t,ariaLabel:n=`close`}){return Gt.createElement(`button`,{className:`Toastify__close-button Toastify__close-button--${t}`,type:`button`,onClick:t=>{t.stopPropagation(),e(!0)},"aria-label":n},Gt.createElement(`svg`,{"aria-hidden":`true`,viewBox:`0 0 14 16`},Gt.createElement(`path`,{fillRule:`evenodd`,d:`M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z`})))}function gt({delay:e,isRunning:t,closeToast:n,type:r=`default`,hide:i,className:a,controlledProgress:o,progress:s,rtl:c,isIn:l,theme:u}){let d=i||o&&s===0,f={animationDuration:`${e}ms`,animationPlayState:t?`running`:`paused`};o&&(f.transform=`scaleX(${s})`);let p=ut(`Toastify__progress-bar`,o?`Toastify__progress-bar--controlled`:`Toastify__progress-bar--animated`,`Toastify__progress-bar-theme--${u}`,`Toastify__progress-bar--${r}`,{"Toastify__progress-bar--rtl":c}),m=nn(a)?a({rtl:c,type:r,defaultClassName:p}):ut(p,a),h={[o&&s>=1?`onTransitionEnd`:`onAnimationEnd`]:o&&s<1?null:()=>{l&&n()}};return Kt.createElement(`div`,{className:`Toastify__progress-bar--wrp`,"data-hidden":d},Kt.createElement(`div`,{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${u} Toastify__progress-bar--${r}`}),Kt.createElement(`div`,{role:`progressbar`,"aria-hidden":d?`true`:`false`,"aria-label":`notification timer`,"aria-valuenow":o?Math.round(s*100):void 0,"aria-valuemin":0,"aria-valuemax":100,className:m,style:f,...h}))}function _t(e,t,n){let r=1,i=0,a=[],o=[],s=t,c=new Map,l=new Set,u=e=>(l.add(e),()=>l.delete(e)),d=()=>{o=Array.from(c.values()),l.forEach(e=>e())},f=({containerId:t,toastId:n,updateId:r})=>{let i=t?t!==e:e!==1,a=c.has(n)&&r==null;return i||a},p=(e,t)=>{c.forEach(n=>{var r;(t==null||t===n.props.toastId)&&((r=n.toggle)==null||r.call(n,e))})},m=e=>{var t,r;e.isActive&&((r=(t=e.props)?.onClose)==null||r.call(t,e.removalReason),e.isActive=!1,n(pt(e,`removed`)))},h=e=>{if(e==null)c.forEach(m);else{let t=c.get(e);t&&m(t)}d()},g=()=>{i-=a.length,a=[]},_=e=>{var t,r;let{toastId:i,updateId:a}=e.props,o=a==null;e.staleId&&c.delete(e.staleId),e.isActive=!0,c.set(i,e),d(),n(pt(e,o?`added`:`updated`)),o&&((r=(t=e.props).onOpen)==null||r.call(t))};return{id:e,props:s,observe:u,toggle:p,removeToast:h,toasts:c,clearQueue:g,buildToast:(e,t)=>{if(f(t))return;let{toastId:n,updateId:o,data:l,staleId:u,delay:p}=t,m=o==null;m&&i++;let g={...s,style:s.toastStyle,key:r++,...Object.fromEntries(Object.entries(t).filter(([e,t])=>t!=null)),toastId:n,updateId:o,data:l,isIn:!1,className:an(t.className||s.toastClassName),progressClassName:an(t.progressClassName||s.progressClassName),autoClose:!t.isLoading&&on(t.autoClose,s.autoClose),closeToast(e){let t=c.get(n);t&&(t.removalReason=e,h(n))},deleteToast(){if(c.get(n)!=null){if(c.delete(n),i--,i<0&&(i=0),a.length>0){_(a.shift());return}d()}}};g.closeButton=s.closeButton,t.closeButton===!1||sn(t.closeButton)?g.closeButton=t.closeButton:t.closeButton===!0&&(g.closeButton=!sn(s.closeButton)||s.closeButton);let v={content:e,props:g,staleId:u};s.limit&&s.limit>0&&i>s.limit&&m?a.push(v):en(p)?setTimeout(()=>{_(v)},p):_(v)},setProps(e){s=e},setToggle:(e,t)=>{let n=c.get(e);n&&(n.toggle=t)},isToastActive:e=>c.get(e)?.isActive,getSnapshot:()=>o}}function vt(){dn.forEach(e=>xt(e.content,e.options)),dn=[]}function yt(e,t){var n;if(t)return!!((n=un.get(t))!=null&&n.isToastActive(e));let r=!1;return un.forEach(t=>{t.isToastActive(e)&&(r=!0)}),r}function bt(e){if(!mn()){dn=dn.filter(t=>e!=null&&t.options.toastId!==e);return}if(e==null||rn(e))un.forEach(t=>{t.removeToast(e)});else if(e&&(`containerId`in e||`id`in e)){let t=un.get(e.containerId);t?t.removeToast(e.id):un.forEach(t=>{t.removeToast(e.id)})}}function xt(e,t){sn(e)&&(mn()||dn.push({content:e,options:t}),un.forEach(n=>{n.buildToast(e,t)}))}function St(e){var t;(t=un.get(e.containerId||1))==null||t.setToggle(e.id,e.fn)}function Ct(e,t){un.forEach(n=>{(t==null||!(t!=null&&t.containerId)||t?.containerId===n.id)&&n.toggle(e,t?.id)})}function wt(e){let t=e.containerId||1;return{subscribe(n){let r=_t(t,e,pn);un.set(t,r);let i=r.observe(n);return vt(),()=>{i(),un.delete(t)}},setProps(e){var n;(n=un.get(t))==null||n.setProps(e)},getSnapshot(){return un.get(t)?.getSnapshot()}}}function Tt(e){return fn.add(e),()=>{fn.delete(e)}}function Et(e){return e&&(tn(e.toastId)||en(e.toastId))?e.toastId:ln()}function Dt(e,t){return xt(e,t),t.toastId}function Ot(e,t){return{...t,type:t&&t.type||e,toastId:Et(t)}}function kt(e){return(t,n)=>Dt(t,Ot(e,n))}function H(e,t){return Dt(e,Ot(`default`,t))}function At(e,{pending:t,error:n,success:r},i){let a;t&&(a=tn(t)?H.loading(t,i):H.loading(t.render,{...i,...t}));let o={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},s=(e,t,n)=>{if(t==null){H.dismiss(a);return}let r={type:e,...o,...i,data:n},s=tn(t)?{render:t}:t;return a?H.update(a,{...r,...s}):H(s.render,{...r,...s}),n},c=nn(e)?e():e;return c.then(e=>s(`success`,r,e)).catch(e=>s(`error`,n,e)),c}function jt(e){bt(e)}function Mt(e){let{subscribe:t,getSnapshot:n,setProps:r}=(0,Jt.useRef)(wt(e)).current;r(e);let i=(0,Jt.useSyncExternalStore)(t,n,n)?.slice();function a(t){if(!i)return[];let n=new Map;return e.newestOnTop&&i.reverse(),i.forEach(e=>{let{position:t}=e.props;n.has(t)||n.set(t,[]),n.get(t).push(e)}),Array.from(n,e=>t(e[0],e[1]))}return{getToastToRender:a,isToastActive:yt,count:i?.length}}function Nt(e){let[t,n]=(0,Yt.useState)(!1),[r,i]=(0,Yt.useState)(!1),a=(0,Yt.useRef)(null),o=(0,Yt.useRef)({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:s,pauseOnHover:c,closeToast:l,onClick:u,closeOnClick:d}=e;St({id:e.toastId,containerId:e.containerId,fn:n}),(0,Yt.useEffect)(()=>{if(e.pauseOnFocusLoss)return f(),()=>{p()}},[e.pauseOnFocusLoss]);function f(){document.hasFocus()||_(),window.addEventListener(`focus`,g),window.addEventListener(`blur`,_)}function p(){window.removeEventListener(`focus`,g),window.removeEventListener(`blur`,_)}function m(t){if(e.draggable===!0||e.draggable===t.pointerType){v();let n=a.current;o.canCloseOnClick=!0,o.canDrag=!0,n.style.transition=`none`,e.draggableDirection===`x`?(o.start=t.clientX,o.removalDistance=n.offsetWidth*(e.draggablePercent/100)):(o.start=t.clientY,o.removalDistance=n.offsetHeight*(e.draggablePercent===80?e.draggablePercent*1.5:e.draggablePercent)/100)}}function h(t){let{top:n,bottom:r,left:i,right:o}=a.current.getBoundingClientRect();t.pointerType===`mouse`&&e.pauseOnHover&&t.clientX>=i&&t.clientX<=o&&t.clientY>=n&&t.clientY<=r?_():g()}function g(){n(!0)}function _(){n(!1)}function v(){o.didMove=!1,document.addEventListener(`pointermove`,b),document.addEventListener(`pointerup`,x)}function y(){document.removeEventListener(`pointermove`,b),document.removeEventListener(`pointerup`,x)}function b(n){let r=a.current;if(o.canDrag&&r){o.didMove=!0,t&&_(),e.draggableDirection===`x`?o.delta=n.clientX-o.start:o.delta=n.clientY-o.start,o.start!==n.clientX&&(o.canCloseOnClick=!1);let i=e.draggableDirection===`x`?`${o.delta}px, var(--y)`:`0, calc(${o.delta}px + var(--y))`;r.style.transform=`translate3d(${i},0)`,r.style.opacity=`${1-Math.abs(o.delta/o.removalDistance)}`}}function x(){y();let t=a.current;if(o.canDrag&&o.didMove&&t){if(o.canDrag=!1,Math.abs(o.delta)>o.removalDistance){i(!0),e.closeToast(!0),e.collapseAll();return}t.style.transition=`transform 0.2s, opacity 0.2s`,t.style.removeProperty(`transform`),t.style.removeProperty(`opacity`)}}let S={onPointerDown:m,onPointerUp:h};return s&&c&&(S.onMouseEnter=_,e.stacked||(S.onMouseLeave=g)),d&&(S.onClick=e=>{u&&u(e),o.canCloseOnClick&&l(!0)}),{playToast:g,pauseToast:_,isRunning:t,preventExitTransition:r,toastRef:a,eventHandlers:S}}function Pt(e){return Qt.createElement(vn,{...e},Qt.createElement(`path`,{d:`M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z`}))}function Ft(e){return Qt.createElement(vn,{...e},Qt.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z`}))}function It(e){return Qt.createElement(vn,{...e},Qt.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z`}))}function Lt(e){return Qt.createElement(vn,{...e},Qt.createElement(`path`,{d:`M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z`}))}function Rt(){return Qt.createElement(`div`,{className:`Toastify__spinner`})}function zt({theme:e,type:t,isLoading:n,icon:r}){let i=null,a={theme:e,type:t};return r===!1||(nn(r)?i=r({...a,isLoading:n}):(0,Qt.isValidElement)(r)?i=(0,Qt.cloneElement)(r,a):n?i=yn.spinner():bn(t)&&(i=yn[t](a))),i}function Bt(e){let t={...Tn,...e},n=e.stacked,[r,i]=(0,qt.useState)(!0),a=(0,qt.useRef)(null),{getToastToRender:o,isToastActive:s,count:c}=Mt(t),{className:l,style:u,rtl:d,containerId:f,hotKeys:p}=t;function m(e){let t=ut(`Toastify__toast-container`,`Toastify__toast-container--${e}`,{"Toastify__toast-container--rtl":d});return nn(l)?l({position:e,rtl:d,defaultClassName:t}):ut(t,an(l))}function h(){n&&(i(!0),H.play())}return _n(()=>{if(n){let e=a.current.querySelectorAll(`[data-in="true"]`),n=t.position?.includes(`top`),i=0,o=0;Array.from(e).reverse().forEach((e,t)=>{let a=e;a.classList.add(`Toastify__toast--stacked`),t>0&&(a.dataset.collapsed=`${r}`),a.dataset.pos||(a.dataset.pos=n?`top`:`bot`);let s=i*(r?.2:1)+(r?0:12*t),c=Math.max(.5,1-(r?o:0));a.style.setProperty(`--y`,`${n?s:s*-1}px`),a.style.setProperty(`--g`,`12`),a.style.setProperty(`--s`,`${c}`),i+=a.offsetHeight,o+=.025})}},[r,c,n]),(0,qt.useEffect)(()=>{function e(e){var t;let n=a.current;p(e)&&((t=n?.querySelector(`[tabIndex="0"]`))==null||t.focus(),i(!1),H.pause()),e.key===`Escape`&&(document.activeElement===n||n!=null&&n.contains(document.activeElement))&&(i(!0),H.play())}return document.addEventListener(`keydown`,e),()=>{document.removeEventListener(`keydown`,e)}},[p]),qt.createElement(`section`,{ref:a,className:`Toastify`,id:f,onMouseEnter:()=>{n&&(i(!1),H.pause())},onMouseLeave:h,"aria-live":`polite`,"aria-atomic":`false`,"aria-relevant":`additions text`,"aria-label":t[`aria-label`]},o((e,t)=>{let r=t.length?{...u}:{...u,pointerEvents:`none`};return qt.createElement(`div`,{tabIndex:-1,className:m(e),"data-stacked":n,style:r,key:`c-${e}`},t.map(({content:e,props:t})=>qt.createElement(xn,{...t,stacked:n,collapseAll:h,isIn:s(t.toastId,t.containerId),key:`t-${t.key}`},e)))}))}function Vt(e){return On(En,e.nonce),$t.createElement(Bt,{...e})}var Ht,Ut,Wt,Gt,Kt,qt,Jt,Yt,Xt,Zt,Qt,$t,en,tn,nn,rn,an,on,sn,cn,ln,un,dn,fn,pn,mn,hn,gn,_n,vn,yn,bn,xn,Sn,Cn,wn,Tn,En,Dn,On,kn=t((()=>{Ht=e(V(),1),Ut=e(V(),1),Wt=e(V(),1),Gt=e(V(),1),Kt=e(V(),1),lt(),qt=e(V(),1),Jt=e(V(),1),Yt=e(V(),1),Xt=e(V(),1),Zt=e(V(),1),Qt=e(V(),1),$t=e(V(),1),en=e=>typeof e==`number`&&!isNaN(e),tn=e=>typeof e==`string`,nn=e=>typeof e==`function`,rn=e=>tn(e)||en(e),an=e=>tn(e)||nn(e)?e:null,on=(e,t)=>e===!1||en(e)&&e>0?e:t,sn=e=>(0,Ht.isValidElement)(e)||tn(e)||nn(e)||en(e),cn=1,ln=()=>`${cn++}`,un=new Map,dn=[],fn=new Set,pn=e=>fn.forEach(t=>t(e)),mn=()=>un.size>0,hn=(e,{containerId:t})=>un.get(t||1)?.toasts.get(e),gn=(e={})=>{un.forEach(t=>{t.props.limit&&(!e.containerId||t.id===e.containerId)&&t.clearQueue()})},H.loading=(e,t)=>Dt(e,Ot(`default`,{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...t})),H.promise=At,H.success=kt(`success`),H.info=kt(`info`),H.error=kt(`error`),H.warning=kt(`warning`),H.warn=H.warning,H.dark=(e,t)=>Dt(e,Ot(`default`,{theme:`dark`,...t})),H.dismiss=jt,H.clearWaitingQueue=gn,H.isActive=yt,H.update=(e,t={})=>{let n=hn(e,t);if(n){let{props:r,content:i}=n,a={delay:100,...r,...t,toastId:t.toastId||e,updateId:ln()};a.toastId!==e&&(a.staleId=e);let o=a.render||i;delete a.render,Dt(o,a)}},H.done=e=>{H.update(e,{progress:1})},H.onChange=Tt,H.play=e=>Ct(!0,e),H.pause=e=>Ct(!1,e),_n=typeof window<`u`?Xt.useLayoutEffect:Xt.useEffect,vn=({theme:e,type:t,isLoading:n,...r})=>Qt.createElement(`svg`,{viewBox:`0 0 24 24`,width:`100%`,height:`100%`,fill:e===`colored`?`currentColor`:`var(--toastify-icon-color-${t})`,...r}),yn={info:Ft,warning:Pt,success:It,error:Lt,spinner:Rt},bn=e=>e in yn,xn=e=>{let{isRunning:t,preventExitTransition:n,toastRef:r,eventHandlers:i,playToast:a}=Nt(e),{closeButton:o,children:s,autoClose:c,onClick:l,type:u,hideProgressBar:d,closeToast:f,transition:p,position:m,className:h,style:g,progressClassName:_,updateId:v,role:y,progress:b,rtl:x,toastId:S,deleteToast:C,isIn:w,isLoading:T,closeOnClick:E,theme:D,ariaLabel:O}=e,k=ut(`Toastify__toast`,`Toastify__toast-theme--${D}`,`Toastify__toast--${u}`,{"Toastify__toast--rtl":x},{"Toastify__toast--close-on-click":E}),A=nn(h)?h({rtl:x,position:m,type:u,defaultClassName:k}):ut(k,h),j=zt(e),M=!!b||!c,ee={closeToast:f,type:u,theme:D},N=null;return o===!1||(N=nn(o)?o(ee):(0,Zt.isValidElement)(o)?(0,Zt.cloneElement)(o,ee):ht(ee)),Zt.createElement(p,{isIn:w,done:C,position:m,preventExitTransition:n,nodeRef:r,playToast:a},Zt.createElement(`div`,{id:S,tabIndex:0,onClick:l,"data-in":w,className:A,...i,style:g,ref:r,...w&&{role:y,"aria-label":O}},j!=null&&Zt.createElement(`div`,{className:ut(`Toastify__toast-icon`,{"Toastify--animate-icon Toastify__zoom-enter":!T})},j),mt(s,e,!t),N,!e.customProgressBar&&Zt.createElement(gt,{...v&&!M?{key:`p-${v}`}:{},rtl:x,theme:D,delay:c,isRunning:t,isIn:w,closeToast:f,hide:d,type:u,className:_,controlledProgress:M,progress:b||0})))},Sn=(e,t=!1)=>({enter:`Toastify--animate Toastify__${e}-enter`,exit:`Toastify--animate Toastify__${e}-exit`,appendPosition:t}),Cn=ft(Sn(`bounce`,!0)),wn=ft(Sn(`slide`,!0)),ft(Sn(`zoom`)),ft(Sn(`flip`)),Tn={position:`top-right`,transition:Cn,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:`touch`,draggablePercent:80,draggableDirection:`x`,role:`alert`,theme:`light`,"aria-label":`Notifications Alt+T`,hotKeys:e=>e.altKey&&e.code===`KeyT`},En=`:root {
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
`,Dn=new Map,On=(e,t)=>{_n(()=>{if(!e||typeof document>`u`)return;let n=document,r=Dn.get(n);if(r){t&&r.setAttribute(`nonce`,t);return}let i=n.createElement(`style`);i.textContent=e,t&&i.setAttribute(`nonce`,t),n.head.appendChild(i),Dn.set(n,i)},[t])}})),An,jn,Mn,Nn,Pn,Fn,In,Ln=t((()=>{An=`--nested-drawers`,jn=`--drawer-height`,Mn=`--drawer-frontmost-height`,Nn=`--drawer-swipe-movement-x`,Pn=`--drawer-swipe-movement-y`,Fn=`--drawer-snap-point-offset`,In=`--drawer-swipe-strength`})),Rn,zn=t((()=>{Rn=`--drawer-swipe-progress`})),Bn,Vn,Hn=t((()=>{Bn=e(V(),1),z(),he(),v(),Ln(),zn(),Vn=Bn.forwardRef(function(e,t){let{render:n,className:r,style:i,forceRender:a=!1,...o}=e,s=te(),c=s.useState(`open`),l=s.useState(`nested`),u=s.useState(`mounted`),d={open:c,transitionStatus:s.useState(`transitionStatus`)};return re(`div`,e,{state:d,ref:[s.context.backdropRef,t],stateAttributesMapping:M,props:[{role:`presentation`,hidden:!u,style:{pointerEvents:c?void 0:`none`,userSelect:`none`,WebkitUserSelect:`none`,[Rn]:`0`,[In]:`1`}},o],enabled:a||!l})})})),Un,Wn=t((()=>{pe(),Un=B})),Gn,Kn=t((()=>{Gn=`data-drawer-content`})),qn,Jn,Yn=t((()=>{qn=e(V(),1),z(),he(),Kn(),Jn=qn.forwardRef(function(e,t){let{render:n,className:r,style:i,...a}=e;return te(),re(`div`,e,{ref:t,props:[{[Gn]:``},a]})})})),Xn,Zn=t((()=>{Se(),Xn=L}));function Qn(){return $n.useContext(er)}var $n,er,tr=t((()=>{$n=e(V(),1),er=$n.createContext(void 0)})),nr,rr,ir,ar,or,sr,cr=t((()=>{v(),nr=`data-expanded`,rr=`data-nested-drawer-open`,ir=`data-nested-drawer-swiping`,ar=`data-swipe-dismiss`,or=`data-swipe-direction`,sr=`data-swiping`}));function lr(e){let t=ur.useContext(dr);if(e!==!0&&t===void 0)throw Error(Le(90));return t}var ur,dr,fr=t((()=>{Ve(),ur=e(V(),1),dr=ur.createContext(void 0)}));function pr(e,t=-(2**53-1),n=2**53-1){return Math.max(t,Math.min(e,n))}var mr=t((()=>{}));function hr(e,t){let n=e+t;return n>=0?t:-Math.sqrt(-n)-e}function gr(e,t,n){if(!Number.isFinite(t)||t<=0)return null;if(typeof e==`number`)return Number.isFinite(e)?e<=1?pr(e,0,1)*t:e:null;let r=e.trim();if(r.endsWith(`px`)){let e=Number.parseFloat(r);return Number.isFinite(e)?e:null}if(r.endsWith(`rem`)){let e=Number.parseFloat(r);return Number.isFinite(e)?e*n:null}return null}function _r(e,t){let n=-1,r=1/0;for(let i=0;i<e.length;i+=1){let a=Math.abs(e[i]-t);a<r&&(r=a,n=i)}return n}function vr(){let e=te(),{snapPoints:t,activeSnapPoint:n,setActiveSnapPoint:r,popupHeight:i}=lr(),a=e.useState(`viewportElement`),[s,c]=yr.useState(0),[l,u]=yr.useState(16),d=o(()=>{let e=g(a).documentElement;c(a?a.offsetHeight:e.clientHeight);let t=parseFloat(getComputedStyle(e).fontSize);Number.isFinite(t)&&u(t)});C(()=>{if(d(),!a||typeof ResizeObserver!=`function`)return;let e=new ResizeObserver(d);return e.observe(a),()=>{e.disconnect()}},[d,a]);let f=yr.useMemo(()=>{if(!t||t.length===0||s<=0||i<=0)return[];let e=Math.min(i,s),n=t.map(t=>{let n=gr(t,s,l);if(n===null)return null;let r=pr(n,0,e);return{value:t,height:r,offset:Math.max(0,i-r)}}).filter(e=>!!e);if(n.length<=1)return n;let r=[],a=[];for(let e=n.length-1;e>=0;--e){let t=n[e];a.some(e=>Math.abs(e-t.height)<=1)||(a.push(t.height),r.push(t))}return r.reverse(),r},[i,l,t,s]);return{snapPoints:t,activeSnapPoint:n,setActiveSnapPoint:r,popupHeight:i,viewportHeight:s,resolvedSnapPoints:f,activeSnapPointOffset:yr.useMemo(()=>{if(n===null)return;let e=f.find(e=>Object.is(e.value,n));if(e)return e;let t=Math.min(i,s),r=gr(n,s,l);if(r===null)return;let a=pr(r,0,t);return f[_r(f.map(e=>e.height),a)]},[n,i,f,l,s])?.offset??null}}var yr,br=t((()=>{yr=e(V(),1),b(),He(),d(),mr(),z(),fr()}));function xr(){return Sr.useContext(Cr)}var Sr,Cr,wr=t((()=>{Sr=e(V(),1),Cr=Sr.createContext(null)}));function Tr(){Or||=(typeof CSS<`u`&&`registerProperty`in CSS&&([Nn,Pn,Fn].forEach(e=>{try{CSS.registerProperty({name:e,syntax:`<length>`,inherits:!1,initialValue:`0px`})}catch{}}),[{name:Rn,initialValue:`0`},{name:In,initialValue:`1`}].forEach(({name:e,initialValue:t})=>{try{CSS.registerProperty({name:e,syntax:`<number>`,inherits:!1,initialValue:t})}catch{}})),!0)}var Er,Dr,Or,kr,Ar,jr=t((()=>{Er=e(V(),1),b(),He(),se(),Re(),z(),he(),v(),zn(),Ln(),cr(),Be(),i(),Ie(),fr(),br(),wr(),w(),Dr=Je(),Or=!1,kr={...M,expanded(e){return e?{[nr]:``}:null},nestedDrawerOpen(e){return e?{[rr]:``}:null},nestedDrawerSwiping(e){return e?{[ir]:``}:null},swipeDirection(e){return{[or]:e}},swiping(e){return e?{[sr]:``}:null}},Ar=Er.forwardRef(function(e,t){let{render:n,className:r,style:i,finalFocus:a,initialFocus:s,...l}=e,u=te(),d=u.context.popupRef,{swipeDirection:f,frontmostHeight:p,hasNestedDrawer:m,nestedSwiping:h,nestedSwipeProgressStore:g,onPopupHeightChange:_,notifyParentFrontmostHeight:v,notifyParentHasNestedDrawer:y}=lr(),b=u.useState(`descriptionElementId`),S=u.useState(`disablePointerDismissal`),w=u.useState(`floatingRootContext`),T=u.useState(`popupProps`),E=u.useState(`modal`),D=u.useState(`mounted`),O=u.useState(`nested`),k=u.useState(`nestedOpenDrawerCount`),A=u.useState(`transitionStatus`),j=u.useState(`open`),M=u.useState(`openMethod`),ee=u.useState(`titleElementId`),ne=u.useState(`role`),P=w.useState(`floatingId`),ie=l.id??P,I=xr();F();let{snapPoints:ae,activeSnapPoint:oe,activeSnapPointOffset:L}=vr(),R=k>0,se=I?.swiping??!1,ce=I?.swipeStrength??null,[le,ue]=Er.useState(0),z=Er.useRef(0),de=o(()=>{let e=d.current;if(!e)return;let t=e.offsetHeight;if(z.current>0&&p>z.current&&t>z.current)return;if(z.current>0&&m){let e=z.current;ue(e),_(e);return}let n=t;n!==z.current&&(z.current=n,ue(n),_(n))});C(()=>{if(!D){z.current=0,ue(0),_(0);return}let e=d.current;if(!e||(Tr(),de(),typeof ResizeObserver!=`function`))return;let t=new ResizeObserver(de);return t.observe(e),()=>{t.disconnect()}},[de,D,R,_,d]),C(()=>{let e=()=>{let e=d.current;if(!e)return;let t=g.getSnapshot();t>0?e.style.setProperty(Rn,`${t}`):e.style.setProperty(Rn,`0`)};e();let t=g.subscribe(e),n=d.current;return()=>{t(),n&&n.style.setProperty(Rn,`0`)}},[g,d]),C(()=>{if(j)return v?.(p),()=>{v?.(0)}},[p,j,v]),C(()=>{if(y)return y(j||A===`ending`),()=>{y(!1)}},[y,j,A]),_e({open:j,ref:d,onComplete(){j&&u.context.onOpenChangeComplete?.(!0)}});let fe=s===void 0?d:s,pe=u.useStateSetter(`popupElement`),me={open:j,nested:O,transitionStatus:A,expanded:oe===1,nestedDrawerOpen:R,nestedDrawerSwiping:h,swipeDirection:f,swiping:se},he;le&&(m||A===`ending`)&&(he=`${le}px`);let ge=ae&&ae.length>0&&(f===`down`||f===`up`),ve=null;ge&&L!==null&&(ve=f===`up`?-L:L);let ye=I?I.getDragStyles():xe;if(ge&&f===`down`){let e=L??0,t=Number.parseFloat(String(ye[Pn]));ye=se&&Number.isFinite(t)?{...ye,transform:void 0,[Pn]:`${hr(e,t)}px`}:{...ye,transform:void 0}}let be=re(`div`,e,{state:me,props:[T,{id:ie,"aria-labelledby":ee,"aria-describedby":b,role:ne,...c,hidden:!D,onKeyDown(e){N.has(e.key)&&e.stopPropagation()},style:{...ye,[Rn]:`0`,[An]:k,[jn]:he,[Fn]:typeof ve==`number`?`${ve}px`:`0px`,[Mn]:p?`${p}px`:void 0,[In]:typeof ce==`number`&&Number.isFinite(ce)&&ce>0?`${ce}`:`1`}},l],ref:[t,d,pe],stateAttributesMapping:kr});return(0,Dr.jsx)(x,{context:w,openInteractionType:M,disabled:!D,closeOnFocusOut:!S,initialFocus:fe,returnFocus:a,modal:E!==!1,restoreFocus:`popup`,children:be})})})),Mr,Nr=t((()=>{ue(),Mr=fe}));function Pr({controlled:e,default:t,name:n,state:r=`value`}){let{current:i}=Fr.useRef(e!==void 0),[a,o]=Fr.useState(()=>t);return[i&&e!==void 0?e:a,Fr.useCallback(e=>{i||o(e)},[])]}var Fr,Ir=t((()=>{Fr=e(V(),1)}));function Lr(e){let{children:t,open:n,defaultOpen:r=!1,onOpenChange:i,onOpenChangeComplete:a,disablePointerDismissal:s=!1,modal:c=!0,actionsRef:l,handle:u,triggerId:d,defaultTriggerId:f=null,swipeDirection:p=`down`,snapToSequentialPoints:m=!1,snapPoints:h,snapPoint:g,defaultSnapPoint:_,onSnapPointChange:v}=e,y=lr(!0),b=y?.onNestedSwipeProgressChange,x=y?.onNestedFrontmostHeightChange,S=y?.onNestedSwipingChange,C=y?.onNestedDrawerPresenceChange,[w,T]=Br.useState(0),[E,D]=Br.useState(0),[O,k]=Br.useState(!1),[A,j]=Br.useState(!1),[M]=Br.useState(Rr),ee=_===void 0?h?.[0]??null:_,N=g!==void 0,[te,ne]=Pr({controlled:g,default:ee,name:`Drawer`,state:`snapPoint`}),P=Br.useRef(!1),re=Br.useRef(!1),ie=o((e,t)=>{let n=t??ye(`none`);v?.(e,n),!n.isCanceled&&ne(e)}),F=Br.useMemo(()=>N||!h||h.length===0?te:te===null||!h.some(e=>Object.is(e,te))?ee:te,[te,N,ee,h]),I=o(e=>{T(e),!P.current&&e>0&&D(e)}),ae=o(e=>{if(e>0){P.current=!0,D(e);return}P.current=!1,w>0&&D(w)}),oe=o(e=>{k(e)}),L=o(e=>{M.set(e),b?.(e)}),R=o(e=>{j(e),S?.(e)}),se=o((e,t)=>{i?.(e,t),!t.isCanceled&&!e&&h&&h.length>0&&ie(ee,ye(t.reason,t.event,t.trigger))}),ce=Br.useMemo(()=>({swipeDirection:p,swipeAreaActiveRef:re,snapToSequentialPoints:m,snapPoints:h,activeSnapPoint:F,setActiveSnapPoint:ie,frontmostHeight:E,popupHeight:w,hasNestedDrawer:O,nestedSwiping:A,nestedSwipeProgressStore:M,onNestedDrawerPresenceChange:oe,onPopupHeightChange:I,onNestedFrontmostHeightChange:ae,onNestedSwipingChange:R,onNestedSwipeProgressChange:L,notifyParentFrontmostHeight:x,notifyParentSwipingChange:S,notifyParentSwipeProgressChange:b,notifyParentHasNestedDrawer:C}),[F,E,O,A,M,C,b,S,x,oe,ae,L,R,I,w,ie,h,m,re,p]),le=typeof t==`function`?e=>(0,Vr.jsxs)(Br.Fragment,{children:[Hr||=(0,Vr.jsx)(zr,{}),t(e)]}):(0,Vr.jsxs)(Br.Fragment,{children:[Ur||=(0,Vr.jsx)(zr,{}),t]}),ue=Ce(`drawer`,{open:n,defaultOpen:r,onOpenChange:se,onOpenChangeComplete:a,disablePointerDismissal:s,modal:c,actionsRef:l,handle:u,triggerId:d,defaultTriggerId:f,children:le});return(0,Vr.jsx)(dr.Provider,{value:ce,children:ue})}function Rr(){let e=0,t=new Set;return{getSnapshot:()=>e,set(n){let r=Number.isFinite(n)?n:0;r!==e&&(e=r,t.forEach(e=>{e()}))},subscribe(e){return t.add(e),()=>{t.delete(e)}}}}function zr(){let e=Qn(),t=te(!1),n=e?.setDrawerOpen,r=e?.removeDrawer,i=t.useState(`open`),a=t.useState(`nestedOpenDialogCount`),o=t.useState(`popupElement`),s=a===0;return C(()=>{if(r)return()=>{r(t)}},[r,t]),C(()=>{n?.(t,i)},[i,n,t]),Br.useEffect(()=>{if(!i||!s||!ce)return;let e=T(o).CloseWatcher;if(!e)return;function n(e){if(!t.select(`open`))return;let n=ye(ne,e);e.cancelable||(n.cancel=Fe),t.setOpen(!1,n),n.isCanceled&&e.preventDefault()}let r=new e,a=O(r,`cancel`,n);return()=>{a(),r.destroy()}},[t,s,i,o]),null}var Br,Vr,Hr,Ur,Wr=t((()=>{Br=e(V(),1),f(),se(),Ir(),b(),He(),d(),r(),fr(),ve(),de(),z(),De(),tr(),Vr=Je()}));function Gr(e,t=!1){let{overflowY:n}=D(e);return n!==`auto`&&n!==`scroll`?!1:t?e.clientHeight>0:e.scrollHeight>e.clientHeight}function Kr(e,t=!1){let{overflowX:n}=D(e);return n!==`auto`&&n!==`scroll`?!1:t?e.clientWidth>0:e.scrollWidth>e.clientWidth}function qr(e,t,n=!1){return t===`vertical`?Gr(e,n):Kr(e,n)}function Jr(e,t,n,r=!1){let i=e;for(;p(i)&&i!==t&&!ke(i);){if(y(i)&&qr(i,n,r))return i;i=m(i)}return null}function Yr(e,t,n=`vertical`,r=!1){return Jr(e,t,n,r)??(qr(t,n,r)?t:null)}var Xr=t((()=>{k()}));function Zr(e,t,n){return typeof e?.elementFromPoint==`function`?e.elementFromPoint(t,n):null}var Qr=t((()=>{}));function $r(e,t){let n=(t??T(e).getComputedStyle(e)).transform,r=0,i=0,a=1;if(n&&n!==`none`){let e=n.match(/matrix(?:3d)?\(([^)]+)\)/);if(e){let t=e[1].split(`, `).map(parseFloat);t.length===6?(r=t[4],i=t[5],a=Math.sqrt(t[0]*t[0]+t[1]*t[1])):t.length===16&&(r=t[12],i=t[13],a=t[0])}}return{x:r,y:i,scale:a}}var ei=t((()=>{d()}));function ti(e,t,n){switch(e){case`up`:return-n;case`down`:return n;case`left`:return-t;case`right`:return t;default:return 0}}function ni(e){return Number.isFinite(e)&&e>0?e:null}function ri(e,t){return`translate3d(${e.x}px,${e.y}px,0) scale(${t})`}function ii(e){return e%2==1}function ai(e,t,n){let r=e[n];if(typeof r==`function`)try{r.call(e,t)}catch(e){if(e&&typeof e==`object`&&`name`in e&&e.name===`NotFoundError`)return;throw e}}function oi(e){let{enabled:t,directions:n,elementRef:r,movementCssVars:i,canStart:a,ignoreSelectorWhenTouch:s=!0,ignoreScrollableAncestors:c=!1,swipeThreshold:l,onDismiss:u,onProgress:d,onCancel:f,onSwipeStart:p,onRelease:m,onSwipingChange:h,trackDrag:_=!0}=e,v=pi,y=n.length===1?n[0]:void 0,b=Math.max(0,typeof l==`number`?l:si),x=n.includes(`left`),S=n.includes(`right`),C=n.includes(`up`),w=n.includes(`down`),T=x||S,E=C||w,D=T?`horizontal`:`vertical`,[O,k]=U.useState(void 0),[M,N]=U.useState(!1),[te,ne]=U.useState(!1),P=U.useRef({x:0,y:0}),re=U.useRef({x:0,y:0}),ie=U.useRef(null),F=U.useRef({x:0,y:0,scale:1}),I=U.useRef(void 0),ae=U.useRef(0),oe=U.useRef(!1),L=U.useRef({x:0,y:0}),R=U.useRef(!1),se=U.useRef(!1),ce=U.useRef(null),le=U.useRef(!1),ue=U.useRef(!1),z=U.useRef({width:0,height:0}),de=U.useRef(0),fe=U.useRef(b),pe=U.useRef(null),me=U.useRef(null),he=U.useRef(null),ge=U.useRef(!1),_e=U.useRef({x:0,y:0}),ve=U.useRef(null),ye=U.useRef(!1),be=U.useRef(null),xe=o(e=>{ye.current!==e&&(ye.current=e,N(e),h?.(e))});function Se(e){if(!e)return;let t=r.current,n=pe.current;if(!t||!n)return;let i=n({element:t,direction:e});fe.current=Math.max(0,i)}let Ce=o((e,t)=>{let n=Number.isFinite(e)?pr(e,0,1):0,r=n!==de.current,i=!1;if(t){let e=ve.current;i=!e||e.deltaX!==t.deltaX||e.deltaY!==t.deltaY||e.direction!==t.direction}(r||i)&&(de.current=n,t?ve.current=t:r&&(ve.current=null),d?.(n,t))}),B=o(e=>{let t=r.current;if(!_||!t){e||(be.current=null);return}let n=t.style,a=be.current;e?(a||(be.current=[n.transition,n.transform]),n.transition=`none`):a&&([n.transition,n.transform]=a,be.current=null);let o=re.current,s=F.current,c=o.x-s.x,l=o.y-s.y;e&&(n.transform=ri(o,s.scale)),n.setProperty(i.x,`${c}px`),n.setProperty(i.y,`${l}px`)});function we(e,t){if(t===null)return;let n=he.current;if(n&&t>n.time){let r=Math.abs(e.x-n.x)<fi&&Math.abs(e.y-n.y)<fi,i=r&&!ge.current;if(ge.current=r,i)return;let a=Math.max(t-n.time,ui);_e.current={x:(e.x-n.x)/a,y:(e.y-n.y)/a}}he.current={x:e.x,y:e.y,time:t}}let Te=U.useCallback(()=>{k(void 0),xe(!1),ne(!1),Ce(0),fe.current=b,pe.current=null,P.current={x:0,y:0},re.current={x:0,y:0},F.current={x:0,y:0,scale:1},I.current=void 0,ae.current=0,oe.current=!1,L.current={x:0,y:0},R.current=!1,ie.current=null,se.current=!1,ce.current=null,le.current=!1,ue.current=!1,z.current={width:0,height:0},me.current=null,he.current=null,ge.current=!1,_e.current={x:0,y:0},ve.current=null,B(!1)},[xe,b,B,Ce]);function Ee(e){if(`touches`in e){let t=e.touches[0];return t?{x:t.clientX,y:t.clientY}:null}return{x:e.clientX,y:e.clientY}}function De(e){return`touches`in e||e.pointerType===`touch`}function Oe(e,t){let n=r.current?.getRootNode();return Zr(n,e.x,e.y)??ee(t)}function ke(e,t){return(n=>{let r=Yr(e,t,n),i=g(r);return r===i.body||r===i.documentElement?null:r})(D)}function Ae(e,t,n){le.current=!1;let i=De(e),a=Oe(t,e.nativeEvent),o=g(r.current).body,u=i&&o?ke(a,o):null,d=n?.ignoreScrollableTarget??!1;if(u&&!d||(le.current=!!(u&&d),j(a,v)&&(!i||s)))return!1;let f=r.current;if(c&&f&&a&&!(n?.ignoreScrollableAncestors??!1)&&Jr(a,f,D)!=null)return!1;if(oe.current=!1,I.current=void 0,ae.current=0,P.current=t,me.current=ni(e.timeStamp),he.current=null,ge.current=!1,_e.current={x:0,y:0},L.current=t,ie.current=t,fe.current=b,pe.current=typeof l==`function`?l:null,f){z.current={width:f.offsetWidth,height:f.offsetHeight},Se(y);let t=$r(f);F.current=t,re.current={x:t.x,y:t.y},we({x:t.x,y:t.y},me.current),`touches`in e||ai(f,e.pointerId,`setPointerCapture`)}return p?.(e.nativeEvent),xe(!0),R.current=!0,Ce(0),B(!0),!0}function je(){Me(),le.current=!1,ie.current=null}function Me(){se.current=!1,ce.current=null}function Ne(e){if(je(),!ye.current)return;xe(!1);let t=F.current;re.current={x:t.x,y:t.y},k(void 0),ue.current=!1,B(!1);let n=r.current;n&&ai(n,e.pointerId,`releasePointerCapture`),Ce(0,{deltaX:0,deltaY:0,direction:void 0}),f?.(e.nativeEvent)}function Pe(e,t){let n=e=>Math.sign(e)*Math.abs(e)**.5,r=(e,t,r)=>!t&&e<0||!r&&e>0?n(e):e;return{x:T?r(e,x,S):n(e),y:E?r(t,C,w):n(t)}}function Fe(e,t,n){let r=(e,t,n,r,i)=>e>0&&t<=0&&r||e<0&&t>=Math.max(0,n)&&i;return E&&n!==0?r(n,e.scrollTop,e.scrollHeight-e.clientHeight,w,C):T&&t!==0?r(t,e.scrollLeft,e.scrollWidth-e.clientWidth,S,x):null}let Ie=o(e=>{if(!t||e.defaultPrevented||e.nativeEvent.defaultPrevented||!(`touches`in e)&&e.button!==0)return;let n=Ee(e);n&&(se.current=!0,ce.current=n,le.current=!1,ue.current=!(`touches`in e),(!a||a(n,{nativeEvent:e.nativeEvent,direction:y}))&&Ae(e,n)&&Me())});function Le(e,n,r){if(!t||!ye.current)return;let i=ee(e.nativeEvent);if(De(e)&&!le.current){let t=e.currentTarget;if(ke(i,t))return}if(`touches`in e||e.preventDefault(),R.current&&(R.current=!1,_)){P.current=n;let t=ni(e.timeStamp);t!==null&&(me.current=t),he.current=null,ge.current=!1}let a=n.x,o=n.y,s=r.x,c=r.y;(c<0&&o>L.current.y||c>0&&o<L.current.y)&&(L.current={x:L.current.x,y:o}),(s<0&&a>L.current.x||s>0&&a<L.current.x)&&(L.current={x:a,y:L.current.y});let l=a-P.current.x,u=o-P.current.y,d=o-L.current.y,f=a-L.current.x,p;if(!I.current)p=Math.abs(l)>=Math.abs(u)?l>0?`right`:`left`:u>0?`down`:`up`,p&&(p===`left`&&x||p===`right`&&S||p===`up`&&C||p===`down`&&w)&&(I.current=p,ae.current=ti(p,l,u),k(p),Se(p));else{let e=I.current,t=ti(e,f,d);t>fe.current?(oe.current=!1,k(e)):!(x&&S)&&!(C&&w)&&ae.current-t>=ci&&(oe.current=!0)}let m=Pe(l,u),h=F.current.x,g=F.current.y;T&&(h+=m.x),E&&(g+=m.y);let v=re.current,b=h!==v.x||g!==v.y;re.current={x:h,y:g},b&&B(!0),we({x:h,y:g},ni(e.timeStamp));let D=h-F.current.x,O=g-F.current.y,A={deltaX:D,deltaY:O,direction:I.current},j=0,M=y??I.current;if(M){let e=M===`left`||M===`right`?z.current.width:z.current.height,t=F.current.scale||1,n=ti(M,D,O);e>0&&t>0&&n>0&&(j=n/(e*t))}Ce(j,A)}let Re=o(e=>{if(!t)return;let i=re.current,a=F.current,o=i.x-a.x,s=i.y-a.y,c={deltaX:o,deltaY:s,direction:I.current};if(!ye.current){je(),Ce(0,c);return}xe(!1),je(),ue.current=!1;let l=r.current;l&&(`touches`in e||ai(l,e.pointerId,`releasePointerCapture`));let d=o,f=s,p=me.current,h=ni(e.timeStamp),g=p!==null&&h!==null&&h>p?h-p:0,_=g>0?Math.max(g,li):0,v=_>0?d/_:0,b=_>0?f/_:0,x=_e.current.x,S=_e.current.y,C=he.current;if(C&&h!==null&&h>=C.time){let e=h-C.time;if(e<=di){let t=Math.max(e,ui),n=i.x-C.x,r=i.y-C.y,a=n/t,o=r/t;Math.abs(n)>=fi&&(x=a),Math.abs(r)>=fi&&(S=o)}else x=0,S=0}let w=m?.({event:e.nativeEvent,direction:I.current,deltaX:d,deltaY:f,velocityX:v,velocityY:b,releaseVelocityX:x,releaseVelocityY:S}),T=typeof w==`boolean`;if(oe.current&&!T){re.current={x:a.x,y:a.y},k(void 0),B(!1),Ce(0,c);return}let E=!1,D;if(T)E=w,D=I.current??y;else for(let e of n)if(ti(e,d,f)>fe.current){E=!0,D=e;break}E&&D?(k(D),ne(!0),B(!1),u?.(e.nativeEvent,{direction:D})):(re.current={x:a.x,y:a.y},k(void 0),B(!1),Ce(0,c))}),ze=o(e=>{let t=Ee(e);if(!t)return;let n=!1;if(!(`touches`in e)){let t=ii(e.buttons);if(t&&(ue.current=!0),e.buttons!==0&&!t){Ne(e);return}if(e.buttons===0&&ue.current){if(!ye.current){Re(e);return}n=!0}}if(!M&&se.current){if(!De(e)&&(e.defaultPrevented||e.nativeEvent.defaultPrevented)){je();return}if(!a||a(t,{nativeEvent:e.nativeEvent,direction:y})){let n=ce.current,i=!1;if(De(e)){let a=r.current;if(n&&a){let r=Oe(t,e.nativeEvent),o=g(a).body,s=o?ke(r,o):null;if(s&&(A(a,s)||A(s,a))){let e=Fe(s,t.x-n.x,t.y-n.y);if(e===!1)return;e===!0&&(i=!0)}}}Ae(e,t,{ignoreScrollableTarget:i,ignoreScrollableAncestors:i})&&(n&&i?(Me(),P.current=n,L.current=n,ie.current=n,R.current=!1):(Me(),le.current=!1))}}let i=ie.current,o=i===null?{x:0,y:0}:{x:t.x-i.x,y:t.y-i.y};ie.current=t,Le(e,t,o),n&&!(`touches`in e)&&Re(e)}),Be=o((e,t)=>{ze({touches:e.touches,currentTarget:t,nativeEvent:e,defaultPrevented:e.defaultPrevented,timeStamp:e.timeStamp})}),Ve=U.useCallback(()=>{let e=ye.current,t=re.current,n=F.current,r=t.x-n.x,a=t.y-n.y;return!e&&r===0&&a===0&&!te?{[i.x]:`0px`,[i.y]:`0px`}:{transition:e?`none`:void 0,transform:e?ri(t,n.scale):void 0,[i.x]:`${r}px`,[i.y]:`${a}px`}},[te,i]);return{swiping:M,swipeDirection:O,dragDismissed:te,getPointerProps:U.useCallback(()=>t?{onPointerDown:Ie,onPointerMove:ze,onPointerUp:Re,onPointerCancel:Re}:{},[t,Re,ze,Ie]),getTouchProps:U.useCallback(()=>t?{onTouchStart:Ie,onTouchMove:ze,onTouchEnd:Re,onTouchCancel:Re}:{},[t,Re,ze,Ie]),moveNative:Be,getDragStyles:Ve,reset:Te}}var U,si,ci,li,ui,di,fi,pi,mi=t((()=>{U=e(V(),1),mr(),He(),d(),s(),Xr(),Qr(),ei(),si=40,ci=10,li=50,ui=4,di=80,fi=1,pi=`button,a,input,select,textarea,label,[role="button"]`})),hi,gi=t((()=>{le(),hi=R})),_i,vi,yi=t((()=>{_i=e(V(),1),he(),z(),Be(),Pe(),vi=_i.forwardRef(function(e,t){let{render:n,className:r,style:i,children:a,...o}=e,s=F(),c=te(),l=c.useState(`open`),u=c.useState(`nested`),d=c.useState(`transitionStatus`),f=c.useState(`nestedOpenDialogCount`),p=c.useState(`mounted`),m=c.useStateSetter(`viewportElement`);return re(`div`,e,{enabled:s||p,state:{open:l,nested:u,transitionStatus:d,nestedDialogOpen:f>0},ref:[t,m],stateAttributesMapping:be,props:[{role:`presentation`,hidden:!p,style:{pointerEvents:l?void 0:`none`},children:a},o]})})})),bi,xi=t((()=>{v(),bi=`data-nested-dialog-open`}));function Si(){return Ci.useContext(wi)}var Ci,wi,Ti=t((()=>{Ci=e(V(),1),wi=Ci.createContext(void 0)}));function Ei(e,t){e?.toggleAttribute(sr,t)}function Di(e){return!!j(e,u)}function Oi(e){return!!j(e,aa)}function ki(e,t){return t===`left`||t===`right`?e.offsetWidth:e.offsetHeight}function Ai(e,t){return Math.max(ki(e,t)*.5,qi)}function ji(e,t){return e instanceof t.HTMLInputElement&&e.type===`range`}function Mi(e){return e.tagName===`INPUT`||e.tagName===`TEXTAREA`}function Ni(e,t){let n=p(e.anchorNode)?e.anchorNode:e.anchorNode?.parentElement,r=p(e.focusNode)?e.focusNode:e.focusNode?.parentElement;return e.containsNode(t,!0)||A(t,n)||A(t,r)}function Pi(e,t){let n=_(e);if(n&&A(t,n)&&Mi(n)){let{selectionStart:e,selectionEnd:t}=n;if(e!=null&&t!=null&&e<t)return!0}let r=e.getSelection?.();return!r||r.isCollapsed?!1:Ni(r,t)}function Fi(e,t){return e.composedPath().some(e=>ji(e,t))}function Ii(e){return Fi(e.nativeEvent,T(e.currentTarget))}function Li(e,t){e.lastX=t.clientX,e.lastY=t.clientY}function Ri(e,t,n,r){if(e.preserveNativeCrossAxisScroll)return!0;if(e.drawerAxisAttributed||e.allowSwipe===!0||!e.hasCrossAxisGestureTarget)return!1;if(!t.cancelable)return e.preserveNativeCrossAxisScroll=!0,!0;let i=r?n.clientY-e.startY:n.clientX-e.startX,a=r?n.clientX-e.startX:n.clientY-e.startY,o=Math.abs(i),s=Math.abs(a);return s>=ra&&s>o+ia?(e.preserveNativeCrossAxisScroll=!0,!0):o>=ra?(e.drawerAxisAttributed=!0,!1):!0}function zi(e,t){return Bi(e,t).max>0}function Bi(e,t){if(t===`vertical`){let t=Math.max(0,e.scrollHeight-e.clientHeight);return{offset:e.scrollTop,max:t}}let n=Math.max(0,e.scrollWidth-e.clientWidth);return{offset:e.scrollLeft,max:n}}function Vi(e,t,n){let r=Ui(n,t),{offset:i,max:a}=Bi(e,t);return r?i<=0:i>=a}function Hi(e,t,n,r){return(Ui(n,t)?r>0:r<0)&&Vi(e,t,n)}function Ui(e,t){return t===`vertical`?e===`down`:e===`right`}var Wi,Gi,Ki,qi,Ji,Yi,Xi,Zi,Qi,$i,ea,ta,na,ra,ia,aa,oa,sa,ca=t((()=>{Wi=e(V(),1),Gi=e(ze(),1),k(),f(),d(),a(),b(),He(),mr(),z(),yi(),xi(),Ee(),fr(),br(),tr(),mi(),Ln(),cr(),zn(),Kn(),de(),ve(),s(),wr(),Ne(),Xr(),h(),Qr(),Ti(),Ki=Je(),qi=10,Ji=.5,Yi=.5,Xi=300,Zi=4,Qi=.2,$i=4,ea=80,ta=360,na=.1,ra=6,ia=2,aa=`[${Gn}]`,oa={horizontal:`[${S}="x"]`,vertical:`[${S}="y"]`},sa=Wi.forwardRef(function(e,t){let{render:n,className:r,style:i,children:a,...s}=e,c=te(),d=c.context.popupRef,f=c.context.backdropRef,{swipeDirection:m,notifyParentSwipingChange:h,notifyParentSwipeProgressChange:_,frontmostHeight:v,snapToSequentialPoints:y,swipeAreaActiveRef:b}=lr(),x=Qn(),{snapPoints:S,resolvedSnapPoints:w,activeSnapPoint:T,activeSnapPointOffset:D,setActiveSnapPoint:k,popupHeight:M}=vr(),N=c.useState(`open`),ne=c.useState(`mounted`),P=c.useState(`nested`),re=c.useState(`nestedOpenDrawerCount`),ie=c.useState(`viewportElement`),F=c.useState(`popupElement`),I=x?.visualStateStore,ae=re>0,L=m===`left`||m===`right`?`horizontal`:`vertical`,R=L===`vertical`,se=R?`horizontal`:`vertical`,[ce,le]=Wi.useState(null),ue=Wi.useRef(void 0),z=Wi.useRef(null),de=E(),fe=Wi.useRef(!1),pe=Wi.useRef(!1),me=Wi.useRef(``),he=Wi.useRef(!1),ge=Wi.useRef(!1),_e=Wi.useRef(null),ve=Si(),be=Wi.useMemo(()=>{if(!S||S.length<2||w.length<2||m!==`down`&&m!==`up`)return null;let e=w.map(e=>e.offset).sort((e,t)=>e-t),t=e[0];return{minOffset:t,range:e[1]-t}},[w,S,m]),xe=Wi.useMemo(()=>!be||D===null?null:pr((D-be.minOffset)/be.range,0,1),[D,be]),Se=Wi.useMemo(()=>S&&S.length>0&&(m===`down`||m===`up`)?m===`down`?[`down`,`up`]:[`up`,`down`]:[m],[S,m]),Ce=o(e=>{d.current?.toggleAttribute(ar,e),f.current?.toggleAttribute(ar,e)}),B=o(()=>{Ce(!1),d.current?.removeAttribute(Te),le(null)}),we=o(()=>{pe.current&&(pe.current=!1,h?.(!1))}),Ee=o((e,t,n)=>{let r=N&&!P&&t,i=r?e:0,a=N&&t?e:0;n&&_&&(_(a),a<=0&&we()),I?.set({swipeProgress:i,frontmostHeight:i>0?v:0});let o=f.current;if(!o)return;let s=r&&i>0;o.style.setProperty(Rn,s?`${i}`:`0`),s&&v>0?o.style.setProperty(jn,`${v}px`):o.style.removeProperty(jn)});function De(e,t,n,r,i,a,o,s){let c=ki(e,t);if(c<=0)return null;let l=((t===`down`||t===`up`)&&S&&S.length>0?D??0:0)+ti(t,n,r),u=Math.max(0,c-l);if(u<=0)return null;let d=ti(t,o,s),f=Math.abs(d)>0?d:ti(t,i,a);if(f<=Qi)return null;let p=(pr(u/pr(f,Qi,$i),ea,ta)-ea)/280;return na+p*.9}function Oe(e){if(pe.current||!e)return;let t=ti(e.direction??m,e.deltaX,e.deltaY);Math.abs(t)<qi||(pe.current=!0,h?.(!0))}let ke=oi({enabled:ne&&!ae,directions:Se,elementRef:c.context.popupRef,ignoreSelectorWhenTouch:!1,ignoreScrollableAncestors:!0,movementCssVars:{x:Nn,y:Pn},onSwipeStart(e){if(`touches`in e||e.pointerType===`touch`)return;let t=d.current,n=g(t).getSelection?.();if(!n||n.isCollapsed)return;let r=p(n.anchorNode)?n.anchorNode:n.anchorNode?.parentElement,i=p(n.focusNode)?n.focusNode:n.focusNode?.parentElement;(A(t,r)||A(t,i))&&n.removeAllRanges()},onSwipingChange(e){fe.current=e,Ei(c.context.backdropRef.current,e),!e&&!_&&we()},swipeThreshold({element:e,direction:t}){return Ai(e,t)},canStart(e,t){let n=c.context.popupRef.current;if(!n)return!1;let r=t.nativeEvent,i=`touches`in r||r.pointerType===`touch`,a=i?_e.current:null,o=n.ownerDocument,s=Zr(n.getRootNode(),e.x,e.y);return!(!a?.startedInPopup&&!A(n,s)||i&&Pi(o,n)||a?.hasCrossAxisGestureTarget&&!a.drawerAxisAttributed&&a.allowSwipe!==!0)},onProgress(e,t){let n=fe.current;n&&Oe(t);let r=!!(S&&S.length>0);if(n&&m===`down`&&r&&t){let e=c.context.popupRef.current;e&&(e.style.removeProperty(`transform`),e.style.setProperty(Pn,`${hr(D??0,t.deltaY)}px`))}let i=e;if(be&&M>0){let e=D??be.minOffset;n&&t&&Number.isFinite(t.deltaY)?i=(e=>pr((e-be.minOffset)/be.range,0,1))(pr(e+t.deltaY,0,M)):xe!==null&&(i=xe)}n||(_?.(0),we()),Ee(i,!0,n)},onRelease({event:e,deltaX:t,deltaY:n,direction:r,velocityX:i,velocityY:a,releaseVelocityX:o,releaseVelocityY:s}){let u=c.context.popupRef.current;if(!u){B();return}let d=u;function f(e){we(),Ce(!0),d.style.removeProperty(`transition`),d.setAttribute(Te,``),Gi.flushSync(()=>{le(De(d,e,t,n,i,a,o,s))})}if(!S||S.length===0){if(!r){B();return}let e=ti(r,t,n);if(e<=0)return B(),!1;if(ti(r,i,a)>=Ji)return f(r),!0;let o=e>Ai(d,r);return o?f(r):B(),o}if(m!==`down`&&m!==`up`){B();return}if(!M)return B(),!1;if(w.length===0){B();return}let p=m===`down`?n:-n,h=Math.sign(p),g=m===`down`?s:-s,_=m===`down`?a:-a,v=g;if(h!==0&&Math.abs(p)>=qi){let e=Math.sign(v);e!==0&&e!==h&&(v=_)}let b=D??0,x=pr(b+p,0,M),C=Math.abs(v)>=Yi?pr(v,-4,Zi)*Xi:0,E=y?x:pr(x+C,0,M),O=ye(l,e),A=()=>(Ee(0,!0,!0),B(),!1),j=e=>(k(e.value,O),A()),ee=e=>r?(k(null,O),O.isCanceled?A():(ue.current=T,f(m),!0)):j(e);if(y){let e=[...w].sort((e,t)=>e.offset-t.offset),t=e.map(e=>e.offset),n=_r(t,b),r=e[_r(t,E)],i=Math.sign(v),a=h!==0&&i!==0&&i===h&&Math.abs(v)>=Yi,o=E;if(a){let t=pr(n+h,0,e.length-1);if(t!==n){let n=e[t];(h>0?E<n.offset:E>n.offset)&&(r=n,o=n.offset)}else if(h>0)return ee(r)}return Math.abs(o-M)<Math.abs(o-r.offset)?ee(r):j(r)}let N=w[_r(w.map(e=>e.offset),E)];return v>=Ji&&p>0||Math.abs(E-M)<Math.abs(E-N.offset)?ee(N):j(N)},onDismiss(e){I?.set({swipeProgress:0,frontmostHeight:0});let t=c.context.backdropRef.current;t&&(t.style.setProperty(Rn,`0`),t.style.removeProperty(jn));let n=ye(l,e);if(c.setOpen(!1,n),n.isCanceled){let t=ue.current;t!==void 0&&k(t,ye(l,e)),ue.current=void 0,z.current?.(),B();return}if(c.select(`open`)){let t=e;de.request(()=>{if(c.select(`open`)){let e=ue.current;e!==void 0&&k(e,ye(l,t)),ue.current=void 0,B(),z.current?.()}else ue.current=void 0});return}ue.current=void 0,Ce(!0)}}),Ae=ke.getPointerProps(),je=ke.getTouchProps(),{moveNative:Me,reset:Ne}=ke;z.current=Ne,Wi.useEffect(()=>{let e=ie??F;if(!e||!N||!ne)return;let t=e,n=g(t);function r(e,r,i){let a=R?i.clientY-r.lastY:i.clientX-r.lastX;if(e.touches.length===2||Pi(n,t)||ae||Ri(r,e,i,R))return;let o=r.scrollTarget;if(!o||o===n.documentElement||o===n.body){e.cancelable&&e.preventDefault(),e.stopPropagation(),Me(e,t);return}if(!zi(o,L)){e.cancelable&&e.preventDefault(),e.stopPropagation();return}if(a!==0){let t=Hi(o,L,m,a);r.allowSwipe?e.cancelable&&e.preventDefault():e.cancelable&&t?(r.allowSwipe=!0,e.preventDefault()):r.allowSwipe=!1}r.allowSwipe===!0&&(e.stopPropagation(),Me(e,t))}function i(e){if(ve?.onTouchMove(e),ge.current)return;let t=_e.current,n=e.touches[0];n&&t&&(r(e,t,n),Li(t,n))}return O(n,`touchmove`,i,{passive:!1,capture:!0})},[ne,ae,N,F,R,L,m,Me,ie,ve]),C(()=>{be&&!ke.swiping&&Ee(!N||P?0:xe??0,!0,!1)},[Ee,v,P,_,N,xe,be,ke.swiping,c,I]),C(()=>{if(_)return N||_(0),()=>{_(0)}},[_,N]),C(()=>{N&&(b.current||Ne(),B())},[B,N,Ne,b]),C(()=>{let e=f.current;return()=>{I?.set({swipeProgress:0,frontmostHeight:0}),Ei(e,!1);let t=f.current;t!==e&&Ei(t,!1),we()}},[f,we,I]);let Pe=Wi.useMemo(()=>({swiping:ke.swiping,getDragStyles:ke.getDragStyles,swipeStrength:ce??null,setSwipeDismissed:Ce}),[Ce,ke.getDragStyles,ke.swiping,ce]);function Fe(e){ge.current=e,_e.current=null}function Ie(){Fe(!1),me.current=``,he.current=!1}function Le(e){return me.current=``,e.pointerType!==`touch`}return(0,Ki.jsx)(vi,{ref:t,className:r,style:i,render:n,...oe(s,{onPointerDown(e){if(me.current=e.pointerType,he.current=e.pointerType===`pen`,!N||!ne||ae)return;let t=Zr(e.currentTarget.getRootNode(),e.clientX,e.clientY);Di(t)||Oi(t)||e.pointerType!==`touch`&&Ae.onPointerDown?.(e)},onPointerMove(e){e.pointerType!==`touch`&&Ae.onPointerMove?.(e)},onPointerUp(e){Le(e)&&Ae.onPointerUp?.(e)},onPointerCancel(e){Le(e)&&Ae.onPointerCancel?.(e)},onTouchStart(e){if(me.current===`pen`&&he.current){he.current=!1,Fe(!1);return}if(!N||!ne||ae){Fe(!1);return}let t=e.touches[0];if(!t)return;if(Ii(e)){Fe(!1);return}let n=e.currentTarget,r=Zr(n.getRootNode(),t.clientX,t.clientY),i=ee(e.nativeEvent),a=p(i)?i:n;if(!A(n,a)){Fe(!0);return}if(ve?.onTouchStart(e),j(r,`${u}:not(${oa[se]})`)){Fe(!0);return}ge.current=!1;let o=Yr(a,n,L),s=Yr(a,n,se)!=null||j(r,oa[se])!=null,c=null;o&&(c=Vi(o,L,m)?null:!1),_e.current={startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastY:t.clientY,startedInPopup:A(d.current,r),scrollTarget:o,hasCrossAxisGestureTarget:s,allowSwipe:c,preserveNativeCrossAxisScroll:!1,drawerAxisAttributed:!1},je.onTouchStart?.(e)},onTouchEnd(e){ve?.onTouchEnd(e),Ie(),je.onTouchEnd?.(e)},onTouchCancel(e){ve?.onTouchCancel(),Ie(),je.onTouchCancel?.(e)},[bi]:void 0}),children:(0,Ki.jsx)(Cr.Provider,{value:Pe,children:a})})})})),la,ua=t((()=>{la=`--drawer-keyboard-inset`}));function da(e){let{children:t}=e,n=te(),r=n.useState(`open`),i=n.useState(`mounted`),a=n.useState(`modal`),s=n.useState(`nestedOpenDialogCount`),c=n.useState(`viewportElement`),l=s>0,u=xa.useRef(!1),d=xa.useRef(null),f=xa.useRef(null),p=xa.useRef(null),m=xa.useRef(!1),h=xa.useRef(null),v=E(),y=ie(),b=o(()=>{let e=p.current;e&&(e.element.style.overflowAnchor=e.overflowAnchor,e.element.style.paddingBottom=e.paddingBottom,e.element.style.scrollPaddingBottom=e.scrollPaddingBottom,p.current=null)}),x=o((e,t)=>{let n=Math.max(0,Math.ceil(t)),r=p.current;if(r&&!r.element.isConnected&&(b(),r=null),n===0){b();return}if(r&&r.element!==e&&(b(),r=null),!r){let t=D(e);r={element:e,overflowAnchor:e.style.overflowAnchor,paddingBottom:e.style.paddingBottom,scrollPaddingBottom:e.style.scrollPaddingBottom,computedPaddingBottom:Number.parseFloat(t.paddingBottom)||0,computedScrollPaddingBottom:Number.parseFloat(t.scrollPaddingBottom)||0},p.current=r}e.style.overflowAnchor=`none`,e.style.paddingBottom=`${n+Math.max(r.computedPaddingBottom,wa)}px`,e.style.scrollPaddingBottom=`${r.computedScrollPaddingBottom+wa}px`}),S=o((e,t)=>{let n=T(e).matchMedia?.(`(prefers-reduced-motion: reduce)`)?.matches?`auto`:`smooth`;e.scrollTo({top:t,behavior:n})}),C=o(()=>{u.current=!1,d.current=null});xa.useEffect(()=>{if(!i||!r){f.current=null,b(),v.cancel();return}if(!c){b();return}let e=g(c),t=T(c),n=t.visualViewport,o=null,s=0,u=0,d=-1,p=-1,C=null,w=()=>{if(!n||n.scale!==1)return null;let r=t.innerHeight,i=n.height;if(r-i>Ca)p=i;else if(Math.abs(i-p)>Ca)return p=-1,null;C||(C=e.createElement(`div`),C.style.cssText=`position:fixed;top:0;height:100svh;visibility:hidden`,e.body.appendChild(C));let a=C.offsetHeight-i<=Ca,o=Math.max(0,n.offsetTop);return{top:o,bottom:a?r:Math.min(r,o+i),resizing:a&&Math.abs(r-i)>=1}};h.current=w;let E=e=>{c.style.setProperty(la,`${Math.max(0,Math.ceil(e))}px`)},D=t.scrollX,k=t.scrollY,j=()=>a!==!0||l||!f.current||t.scrollX===D&&t.scrollY===k||w()==null?!1:(t.scrollTo({left:D,top:k,behavior:`instant`}),!0),M=null,N=()=>{M?.(),M=null},te=(e,t)=>{N();let n=e.getBoundingClientRect();M=ya(e,(t.top+t.bottom-n.top-n.bottom)/2)},ne=()=>{N();let e=f.current;if(l||!e||!A(c,e)){E(0),b();return}j();let n=w();if(!n){E(0),b();return}E(Math.max(0,t.innerHeight-n.bottom));let r=ba(e,c);if(!r){b();return}let i=r.getBoundingClientRect(),a=Math.min(i.bottom,n.bottom),p=Math.max(0,i.bottom-n.bottom);x(r,p);let m=Math.max(0,r.scrollHeight-r.clientHeight);if(m<=0)return;let h=Math.max(i.top,n.top)+wa,g=a-wa;if(g<=h)return;let _=e.getBoundingClientRect(),y=r.scrollTop+(_.top+_.bottom-h-g)/2,C=Math.round(pr(y,0,m));if(!(o===r&&!n.resizing&&Math.abs(s-C)<=1)){let e=o===r?u+1:1;if(o=r,s=C,u=e,d=-1,e<=Da){v.request(ne);return}}else if(d>=0){let e=r.scrollTop;if(Math.abs(e-C)<=1)return;if(e!==d){d=e;return}}o=r,s=C,u=0,d=r.scrollTop,S(r,C)},P=()=>{v.request(ne)},re=()=>{let e=Ea,t=()=>{ne(),--e,e>0&&y.start(Ta,t)};y.start(Ta,t)},ie=()=>{f.current=null,p=-1,y.clear(),P()},F=e=>{if(l)return!1;let t=pa(e);return!t||!A(c,t)?!1:(f.current!==t&&(o=null),f.current=t,!0)},I=e=>{let t=f.current;M&&t&&t===ee(e)&&t.focus({preventScroll:!0})},ae=e=>{if(m.current=!1,N(),!F(ee(e))){ie();return}w()!=null&&re(),P()},oe=e=>{if(!m.current){if(F(e.relatedTarget)){let e=f.current,t=w();e&&t&&te(e,t),P();return}ie()}},L=()=>{(f.current||F(_(e)))&&P()},R=[];return n&&R.push(O(n,`resize`,L),O(n,`scroll`,L),O(t,`resize`,L)),R.push(O(e,`focus`,I,!0),O(e,`focusin`,ae,!0),O(e,`focusout`,oe,!0),O(t,`scroll`,()=>{j()&&P()}),O(e,`pointerdown`,()=>{f.current&&v.cancel(),y.clear(),o=null},!0)),F(_(e))&&P(),()=>{R.forEach(e=>e()),N(),f.current=null,b(),v.cancel(),y.clear(),h.current=null,C?.remove(),c.style.removeProperty(la)}},[S,v,y,a,i,l,r,b,c,x]);let w=o(e=>{let t=e.touches[0];u.current=!1,d.current={x:t.clientX,y:t.clientY}}),k=o(e=>{let t=e.touches[0],n=d.current;t&&n&&!u.current&&(Math.abs(t.clientX-n.x)>Oa||Math.abs(t.clientY-n.y)>Oa)&&(u.current=!0)}),j=o(e=>{if(!r||!i||l||!c||!d.current||u.current){C();return}let t=e.changedTouches[0]??e.touches[0],n=c.getRootNode(),a=ee(e.nativeEvent),o=t?ga(n,t.clientX,t.clientY):null;if(o===ja){C();return}let s=t&&(o??ma(a));if(s&&(!A(c,s.focusTarget)||!A(c,s.clickTarget))){C();return}if(s){let{clickTarget:n,focusTarget:r}=s,i=T(r);if(i.visualViewport&&i.visualViewport.scale!==1){C();return}if(_(g(r))===r&&(!i.visualViewport||h.current?.()!=null)){C();return}e.preventDefault(),m.current=!0;try{va(r)}finally{m.current=!1}_a(n,t),n!==r&&_(g(r))===r&&r.focus({preventScroll:!0}),C();return}C()}),M=xa.useMemo(()=>({onTouchStart:w,onTouchMove:k,onTouchEnd:j,onTouchCancel:C}),[j,k,w,C]);return(0,Sa.jsx)(wi.Provider,{value:M,children:t})}function fa(e){if(e.isContentEditable)return!0;let t=T(e);return e instanceof t.HTMLTextAreaElement||e instanceof t.HTMLInputElement&&Aa.has(e.type)?!e.matches(`:disabled`):!1}function pa(e){if(!y(e))return null;if(fa(e))return e.isContentEditable?ha(e):e;let t=j(e,`label`)?.control??null;return y(t)&&fa(t)?t:null}function ma(e){if(!y(e))return null;let t=pa(e);return t?{focusTarget:t,clickTarget:e}:null}function ha(e){let t=e;for(;t.parentElement?.isContentEditable;)t=t.parentElement;return t}function ga(e,t,n){let r=Zr(e,t,n);if(y(r)){let e=pa(r);if(e)return{focusTarget:e,clickTarget:r}}if(Oe(r)||j(r,`label`)!=null)return ja;for(let[r,i]of[[0,ka],[0,-16],[ka,0],[-16,0]]){let a=pa(Zr(e,t+r,n+i));if(a)return{focusTarget:a,clickTarget:a}}return null}function _a(e,t){let n=T(e),r=n.PointerEvent??n.MouseEvent;e.dispatchEvent(new r(`click`,{bubbles:!0,cancelable:!0,clientX:t.clientX,clientY:t.clientY,detail:1,view:n}))}function va(e){let t=_(g(e))===e,n=ya(e,-2e3);try{t&&e.blur(),e.focus({preventScroll:!0})}finally{n()}}function ya(e,t){let n=e.style.opacity,r=e.style.transform,i=e.style.transition;return e.style.transition=`none`,e.style.opacity=`0`,e.style.transform=`translateY(${t}px)`,()=>{e.style.opacity=n,e.style.transform=r,e.style.transition=i}}function ba(e,t){let n=m(e);return Yr(n,t,`vertical`)??Yr(n,t,`vertical`,!0)}var xa,Sa,Ca,wa,Ta,Ea,Da,Oa,ka,Aa,ja,Ma=t((()=>{xa=e(V(),1),k(),f(),d(),a(),He(),mr(),ge(),z(),s(),Xr(),Qr(),ua(),Ti(),Sa=Je(),Ca=60,wa=16,Ta=150,Ea=4,Da=60,Oa=10,ka=16,Aa=new Set([`email`,`number`,`password`,`search`,`tel`,`text`,`url`]),ja=Symbol(`KeyboardTapBlocked`)})),Na=t((()=>{Hn(),Wn(),Yn(),Zn(),tr(),zn(),Ln(),jr(),Nr(),Wr(),mi(),ei(),cr(),fr(),gi(),ca(),Ma()})),Pa=t((()=>{Na(),zn(),Ln(),cr(),ua()})),Fa=t((()=>{}));function Ia(){let[e,t]=(0,Ra.useState)(()=>window.matchMedia(`(max-width: 640px)`).matches);return(0,Ra.useEffect)(()=>{let e=window.matchMedia(`(max-width: 640px)`),n=()=>t(e.matches);return e.addEventListener(`change`,n),()=>e.removeEventListener(`change`,n)},[]),e}function La({open:e,onOpenChange:t,onOpenChangeComplete:n,title:r,description:i,closeLabel:a=`关闭`,triggerRef:o,className:s=``,footer:c,children:l}){let[u,d]=(0,Ra.useState)(!1),[f,p]=(0,Ra.useState)(null),m=(0,Ra.useRef)(null);return(0,Ra.useEffect)(()=>d(!0),[]),(0,za.jsx)(Lr,{open:u&&e,onOpenChange:t,onOpenChangeComplete:n,modal:!0,swipeDirection:`down`,children:(0,za.jsx)(da,{children:(0,za.jsxs)(Mr,{children:[(0,za.jsx)(Vn,{className:`mobile-filters-backdrop`}),(0,za.jsx)(sa,{className:`mobile-filters-viewport`,children:(0,za.jsxs)(Ar,{ref:p,className:`mobile-filters-popup mobile-drawer-popup ${s}`.trim(),initialFocus:m,finalFocus:o,children:[(0,za.jsx)(`div`,{className:`mobile-filters-drag-area`,"aria-hidden":`true`,children:(0,za.jsx)(`span`,{className:`mobile-filters-handle`})}),(0,za.jsxs)(`header`,{className:`mobile-filters-heading`,"data-base-ui-swipe-ignore":!0,children:[(0,za.jsxs)(`div`,{children:[(0,za.jsx)(hi,{className:`mobile-filters-title`,children:r}),i&&(0,za.jsx)(Xn,{className:`mobile-filters-description`,children:i})]}),(0,za.jsx)(Un,{ref:m,className:`icon-button mobile-filters-close`,"aria-label":a,children:(0,za.jsx)(rt,{size:20})})]}),(0,za.jsx)(Jn,{className:`mobile-filters-content scroll-area scroll-area--vertical`,"data-base-ui-swipe-ignore":!0,children:l(f)}),c&&(0,za.jsx)(`footer`,{className:`mobile-filters-footer`,"data-base-ui-swipe-ignore":!0,children:c})]})})]})})})}var Ra,za,Ba=t((()=>{Ra=e(V()),Pa(),ot(),Fa(),za=Je()}));function Va(){let e=Ia();return(0,Ha.useEffect)(()=>{let e=()=>{let e=document.querySelector(window.matchMedia(`(max-width: 960px)`).matches?`.sidebar`:`.topbar`)?.getBoundingClientRect().bottom||0;document.documentElement.style.setProperty(`--workspace-header-bottom`,`${Math.max(0,e)}px`)},t=new ResizeObserver(e),n=[],r=()=>{let r=[...document.querySelectorAll(`.sidebar, .topbar`)];(r.length!==n.length||r.some((e,t)=>e!==n[t]))&&(t.disconnect(),r.forEach(e=>t.observe(e)),n=r),e()},i=new MutationObserver(r);return i.observe(document.getElementById(`root`),{childList:!0,subtree:!0}),window.addEventListener(`resize`,e),r(),()=>{t.disconnect(),i.disconnect(),window.removeEventListener(`resize`,e)}},[]),(0,Ua.jsx)(Vt,{className:`mistakes-toast-container`,position:`top-right`,autoClose:4500,transition:wn,theme:`light`,limit:e?1:3,newestOnTop:!0,closeOnClick:!1,draggablePercent:15})}var Ha,Ua,Wa=t((()=>{Ha=e(V()),kn(),Ba(),Ua=Je()}));function Ga(e){return no.add(e),()=>{no.delete(e)}}function Ka(){return $a}function qa(){return to}function Ja(e){e>0&&$a===0&&(eo+=1),$a+=e,to={pending:$a,cycle:eo},no.forEach(e=>e())}async function Ya(e,t={},n={}){n.background||Ja(1);try{let n=await fetch(`${Qa}${e}`,{...t,credentials:`same-origin`,headers:{...t.body instanceof FormData?{}:{"Content-Type":`application/json`},...t.headers}}),r=await n.json().catch(e=>{if(e instanceof SyntaxError)return null;throw e});if(!n.ok||!r?.success)throw r?.code===`ACCOUNT_FROZEN`&&window.dispatchEvent(new Event(`mistakes:account-frozen`)),r?.code===`BACKUP_READ_ONLY`&&window.dispatchEvent(new CustomEvent(`mistakes:backup-status`,{detail:{readOnly:!0}})),new ro(r?.message||`请求失败，请稍后重试。`,n.status,r?.code);return t.method&&t.method!==`GET`&&window.dispatchEvent(new Event(`mistakes:updated`)),r.data}finally{n.background||Ja(-1)}}function Xa(e,t=!1){let n=new Date(e);return Number.isNaN(n.getTime())?`—`:new Intl.DateTimeFormat(`zh-CN`,t?{month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`}:{year:`numeric`,month:`2-digit`,day:`2-digit`}).format(n)}function Za(e){window.location.hash=e}var Qa,$a,eo,to,no,ro,io,ao=t((()=>{Qa=`/api/mistakes`,$a=0,eo=0,to={pending:0,cycle:0},no=new Set,ro=class extends Error{status;code;constructor(e,t,n){super(e),this.status=t,this.code=n}},io=(e,t=`POST`)=>({method:t,body:JSON.stringify(e)})})),oo=t((()=>{})),so=t((()=>{})),co=t((()=>{}));function W({children:e}){return(0,G.jsx)(`span`,{className:`skeleton-text skeleton-shimmer`,children:e})}function lo({children:e=`保存设置`}){return(0,G.jsx)(`span`,{className:`button skeleton-button`,children:(0,G.jsx)(W,{children:e})})}function uo({label:e}){return(0,G.jsxs)(`div`,{className:`field`,children:[(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:e})}),(0,G.jsx)(`div`,{className:`skeleton-form-control skeleton-shimmer`,children:(0,G.jsx)(`input`,{disabled:!0,tabIndex:-1})})]})}function fo({title:e,description:t}){return(0,G.jsxs)(`div`,{className:`panel-title`,children:[(0,G.jsx)(`span`,{className:`panel-title-icon`,children:(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`})}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h2`,{children:(0,G.jsx)(W,{children:e})}),t&&(0,G.jsx)(`p`,{children:(0,G.jsx)(W,{children:t})})]})]})}function po({title:e,action:t,description:n}){return(0,G.jsxs)(`div`,{className:`page-header`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h1`,{children:(0,G.jsx)(W,{children:e})}),n&&(0,G.jsx)(`p`,{children:(0,G.jsx)(W,{children:n})})]}),t&&(0,G.jsx)(`div`,{className:`page-header-action`,children:(0,G.jsx)(lo,{children:t})})]})}function mo(){return(0,G.jsxs)(G.Fragment,{children:[(0,G.jsxs)(`div`,{className:`stats-grid stats-chart-grid`,children:[(0,G.jsxs)(`section`,{className:`panel stats-chart-panel`,children:[(0,G.jsx)(fo,{title:`学科分布`,description:`各学科已归档错题的数量。`}),(0,G.jsx)(`div`,{className:`stats-chart-frame stats-subject-chart skeleton-subject-bars`,children:[48,78,35].map(e=>(0,G.jsx)(`span`,{className:`skeleton-shimmer`,style:{height:`${e}%`}},e))})]}),(0,G.jsxs)(`section`,{className:`panel stats-chart-panel stats-mastery-panel`,children:[(0,G.jsx)(fo,{title:`掌握程度`,description:`按每道错题最近一次复习结果统计。`}),(0,G.jsxs)(`div`,{className:`stats-mastery-layout`,children:[(0,G.jsx)(`div`,{className:`stats-mastery-ring skeleton-mastery-ring`}),(0,G.jsx)(`ul`,{className:`stats-mastery-legend`,children:[`未复习`,`未掌握`,`待巩固`,`已掌握`].map(e=>(0,G.jsxs)(`li`,{className:`stats-mastery-item`,children:[(0,G.jsx)(`span`,{className:`stats-legend-dot skeleton-shimmer`}),(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:e})}),(0,G.jsx)(`strong`,{children:(0,G.jsx)(W,{children:`0 道`})}),(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:`0%`})})]},e))})]})]})]}),(0,G.jsxs)(`section`,{className:`panel knowledge-chart-panel stats-chart-panel`,children:[(0,G.jsx)(fo,{title:`知识点分布`,description:`按主知识点查看已归档错题，最多展示数量最多的 8 项。`}),(0,G.jsx)(`div`,{className:`stats-chart-frame stats-knowledge-chart skeleton-knowledge-bars`,children:[74,92,55,38].map(e=>(0,G.jsxs)(`div`,{children:[(0,G.jsx)(W,{children:`知识点名称`}),(0,G.jsx)(`span`,{className:`skeleton-shimmer`,style:{width:`${e}%`}})]},e))})]})]})}function ho(){return(0,G.jsxs)(G.Fragment,{children:[(0,G.jsxs)(`div`,{className:`task-selection-bar`,children:[(0,G.jsxs)(`label`,{children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:`选择本页可操作任务`})]}),(0,G.jsxs)(`div`,{children:[(0,G.jsxs)(`span`,{className:`table-button`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:`重试`})]}),(0,G.jsxs)(`span`,{className:`table-button`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:`取消`})]})]})]}),(0,G.jsx)(`div`,{className:`task-rows`,children:[0,1,2].map(e=>(0,G.jsxs)(`article`,{className:`task-row`,children:[(0,G.jsxs)(`div`,{className:`task-row-heading`,children:[(0,G.jsxs)(`div`,{className:`task-row-title`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(`h3`,{children:(0,G.jsx)(W,{children:`识别题目`})}),(0,G.jsx)(`span`,{className:`task-id`,children:(0,G.jsx)(W,{children:`#000`})})]}),(0,G.jsx)(`span`,{className:`task-status`,children:(0,G.jsx)(W,{children:`处理中`})})]}),(0,G.jsx)(`div`,{className:`task-excerpt`,children:(0,G.jsx)(W,{children:`正在读取错题内容，整理识别与解析结果。`})}),(0,G.jsxs)(`div`,{className:`task-meta`,children:[(0,G.jsx)(W,{children:`记录 #000`}),(0,G.jsx)(W,{children:`10月24日 12:00`}),(0,G.jsx)(W,{children:`本轮耗时 10 秒`}),(0,G.jsx)(W,{children:`尝试 1/3`})]}),(0,G.jsx)(`div`,{className:`task-row-actions`,children:(0,G.jsx)(lo,{children:`打开错题`})})]},e))})]})}function go(){return(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(po,{title:`AI 任务管理`,action:`录入错题`}),(0,G.jsx)(`p`,{className:`task-page-description`,children:(0,G.jsx)(W,{children:`上传后可以继续学习，AI 会在后台处理。完成后，在这里查看结果、校对或重试；不再需要的处理中、失败或待校对任务可直接取消。`})}),(0,G.jsxs)(`section`,{className:`task-manager`,children:[(0,G.jsxs)(`div`,{className:`task-sync-bar`,children:[(0,G.jsxs)(`span`,{children:[(0,G.jsx)(W,{children:`正在加载任务…`}),(0,G.jsx)(`small`,{children:(0,G.jsx)(W,{children:`正在同步任务状态`})})]}),(0,G.jsx)(lo,{children:`刷新`})]}),(0,G.jsx)(`div`,{className:`task-filters skeleton-tabs`,children:[`全部`,`处理中`,`待校对`,`失败`,`已填入`,`已取消`].map(e=>(0,G.jsx)(`span`,{children:(0,G.jsxs)(W,{children:[e,` —`]})},e))}),(0,G.jsxs)(`div`,{className:`task-search-bar`,children:[(0,G.jsx)(`div`,{className:`task-search skeleton-input skeleton-shimmer`}),(0,G.jsx)(`div`,{className:`custom-select skeleton-input skeleton-shimmer`})]}),(0,G.jsx)(ho,{}),(0,G.jsxs)(`div`,{className:`task-pagination`,children:[(0,G.jsx)(W,{children:`共 — 项`}),(0,G.jsx)(lo,{children:`上一页　下一页`})]})]})]})}function _o(){let{user:e}=ae(),t=e.role===`admin`;return(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(po,{title:`设置`,description:t?`管理账号安全、学习目录、AI 服务与全站数据备份。`:`修改用户名、头像与登录密码。`}),(0,G.jsx)(`div`,{className:`settings-tabs skeleton-tabs`,children:[`账号安全`,`知识点目录`,...t?[`AI 设置`,`数据备份`,`邀请码`,`用户账号`,`测试错题`]:[]].map(e=>(0,G.jsxs)(`span`,{children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:e})]},e))}),(0,G.jsxs)(`div`,{className:`settings-account-layout`,children:[(0,G.jsxs)(`div`,{className:`settings-account-forms`,children:[(0,G.jsxs)(`section`,{className:`panel username-panel`,children:[(0,G.jsx)(fo,{title:`修改用户名`,description:`修改后请使用新用户名登录。`}),(0,G.jsxs)(`div`,{className:`skeleton-settings-form`,children:[(0,G.jsx)(uo,{label:`用户名`}),(0,G.jsx)(lo,{children:`保存用户名`})]})]}),(0,G.jsxs)(`section`,{className:`panel password-panel`,children:[(0,G.jsx)(fo,{title:`修改密码`,description:`设置一个只有你知道的密码。`}),(0,G.jsxs)(`div`,{className:`skeleton-settings-form`,children:[(0,G.jsx)(uo,{label:`当前密码`}),(0,G.jsx)(uo,{label:`新密码`}),(0,G.jsx)(uo,{label:`确认新密码`}),(0,G.jsx)(lo,{children:`保存新密码`})]})]})]}),(0,G.jsxs)(`aside`,{className:`panel account-summary`,children:[(0,G.jsx)(`span`,{className:`large-avatar skeleton-shimmer`}),(0,G.jsx)(lo,{children:`上传头像`}),(0,G.jsxs)(`p`,{className:`avatar-hint`,children:[(0,G.jsx)(W,{children:`JPG、PNG、WebP，最大 5 MB`}),(0,G.jsx)(`br`,{}),(0,G.jsx)(W,{children:`自动居中裁剪为方形`})]}),(0,G.jsx)(`h2`,{children:(0,G.jsx)(W,{children:`用户名`})}),(0,G.jsx)(`span`,{className:`small-pill`,children:(0,G.jsx)(W,{children:`学习账号`})}),(0,G.jsxs)(`div`,{className:`account-summary-note`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(`strong`,{children:(0,G.jsx)(W,{children:`专属于你的错题本`})}),(0,G.jsxs)(`p`,{children:[(0,G.jsx)(W,{children:`整理的题目、笔记与复习记录`}),(0,G.jsx)(`br`,{}),(0,G.jsx)(W,{children:`会保存在你的账号下。`})]})]})]})]})]})}function vo(){return(0,G.jsxs)(`section`,{className:`panel admin-panel`,children:[(0,G.jsxs)(`div`,{className:`admin-panel-heading`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h2`,{children:(0,G.jsx)(W,{children:`账号与邀请管理`})}),(0,G.jsx)(`p`,{children:(0,G.jsx)(W,{children:`管理账号状态与使用情况。`})})]}),(0,G.jsx)(lo,{children:`管理操作`})]}),(0,G.jsxs)(`div`,{className:`skeleton-admin-table`,children:[(0,G.jsx)(`div`,{className:`skeleton-admin-table-heading`,children:[0,1,2,3].map(e=>(0,G.jsx)(W,{children:`栏目名称`},e))}),[0,1,2].map(e=>(0,G.jsx)(`div`,{children:[0,1,2,3].map(e=>(0,G.jsx)(W,{children:`正在加载`},e))},e))]})]})}function yo(){return(0,G.jsxs)(`div`,{className:`ai-profile-form`,children:[(0,G.jsxs)(`div`,{className:`ai-profile-enable`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:`启用服务`})]}),(0,G.jsx)(uo,{label:`API 基础地址`}),(0,G.jsx)(uo,{label:`模型名称`}),(0,G.jsx)(uo,{label:`API 密钥`}),(0,G.jsxs)(`div`,{className:`ai-profile-actions`,children:[(0,G.jsx)(lo,{children:`保存服务配置`}),(0,G.jsx)(lo,{children:`测试服务`})]})]})}function bo(){return(0,G.jsxs)(`div`,{className:`backup-settings`,children:[(0,G.jsxs)(`section`,{className:`panel backup-create-panel`,children:[(0,G.jsxs)(`div`,{className:`backup-heading`,children:[(0,G.jsx)(fo,{title:`全站数据备份`,description:`保留一份完整记录，为恢复与迁移做好准备。`}),(0,G.jsx)(lo,{children:`立即备份`})]}),(0,G.jsxs)(`div`,{className:`skeleton-copy-lines`,children:[(0,G.jsx)(W,{children:`账号、错题、知识点、复习记录与图片`}),(0,G.jsx)(W,{children:`完整保存服务器配置与学习记录`})]}),(0,G.jsx)(`div`,{className:`backup-sensitive`,children:(0,G.jsx)(W,{children:`备份含账号数据及服务密钥，请妥善保管。`})})]}),(0,G.jsxs)(`section`,{className:`panel backup-schedule-panel`,children:[(0,G.jsx)(fo,{title:`自动备份`,description:`每天按北京时间执行；停服期间错过的备份不会补跑。`}),(0,G.jsxs)(`div`,{className:`backup-enable`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:`启用每日自动备份`})]}),(0,G.jsxs)(`div`,{className:`backup-schedule-fields`,children:[(0,G.jsx)(uo,{label:`每天执行时间`}),(0,G.jsx)(uo,{label:`自动备份保留份数`})]}),(0,G.jsxs)(`div`,{className:`backup-schedule-footer`,children:[(0,G.jsx)(lo,{children:`保存自动备份设置`}),(0,G.jsx)(W,{children:`下次执行时间与最近结果`})]})]}),(0,G.jsxs)(`section`,{className:`panel backup-history-panel`,children:[(0,G.jsx)(`div`,{className:`backup-heading`,children:(0,G.jsx)(`h2`,{children:(0,G.jsx)(W,{children:`备份记录`})})}),[0,1].map(e=>(0,G.jsxs)(`div`,{className:`backup-record`,children:[(0,G.jsx)(W,{children:`备份时间与文件大小`}),(0,G.jsx)(W,{children:`备份状态`}),(0,G.jsx)(lo,{children:`下载`})]},e))]})]})}function xo(){return(0,G.jsxs)(`section`,{className:`test-data-tools`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`strong`,{children:(0,G.jsx)(W,{children:`体验错题本`})}),(0,G.jsx)(`p`,{children:(0,G.jsx)(W,{children:`每次为当前管理员账号生成 6 道示例，带有“测试错题”标签，可用于编辑和复习。当前账号共 — 道测试错题。`})}),(0,G.jsx)(`small`,{children:(0,G.jsx)(W,{children:`移入回收站覆盖所有筛选条件、归档和草稿，仅处理当前账号的测试错题，30 天内可恢复题目及复习记录。测试数据会计入学习统计。`})})]}),(0,G.jsxs)(`div`,{className:`test-data-actions`,children:[(0,G.jsx)(lo,{children:`一键生成测试错题`}),(0,G.jsx)(lo,{children:`测试错题移入回收站`})]})]})}function So({answer:e=!1}){return(0,G.jsxs)(`div`,{className:`photo-entry`,children:[(0,G.jsxs)(`div`,{className:`photo-entry-title`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:e?`也可以拍下答案`:`从图片录入题目`})]}),(0,G.jsx)(`div`,{className:`photo-actions`,children:[e?`拍照识别答案`:`拍照`,`选择图片`,`选择已上传的照片`,...e?[`复用题干图片`]:[]].map(e=>(0,G.jsxs)(`span`,{className:`button secondary skeleton-button`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`,style:{width:16,height:16}}),(0,G.jsx)(W,{children:e})]},e))})]})}function Co({label:e,rows:t=5,question:n=!1}){return(0,G.jsxs)(`div`,{className:`field markdown-field`,children:[(0,G.jsxs)(`div`,{className:`markdown-field-heading`,children:[(0,G.jsx)(`label`,{children:(0,G.jsx)(W,{children:e})}),(0,G.jsx)(`div`,{className:`markdown-field-modes`,children:[`编辑`,`预览`].map(e=>(0,G.jsx)(`button`,{type:`button`,disabled:!0,tabIndex:-1,children:(0,G.jsx)(W,{children:e})},e))})]}),(0,G.jsx)(`div`,{className:`skeleton-form-control skeleton-shimmer`,children:(0,G.jsx)(`textarea`,{disabled:!0,tabIndex:-1,rows:t,className:n?`question-editor`:void 0})})]})}function wo({title:e,required:t=!1}){return(0,G.jsxs)(`div`,{className:`editor-block-heading`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(`h2`,{children:(0,G.jsx)(W,{children:e})}),t&&(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:`必填`})})]})}function To(){let e=/^#\/mistakes\/\d+\/edit/.test(window.location.hash);return(0,G.jsxs)(G.Fragment,{children:[e&&(0,G.jsx)(`div`,{className:`editor-uploaded`,children:(0,G.jsx)(`span`,{className:`table-button`,children:(0,G.jsx)(W,{children:`查看上传图片`})})}),(0,G.jsx)(`div`,{className:`editor-mobile-tabs`,children:(0,G.jsx)(`div`,{className:`sliding-tabs`,children:[`题干`,`解答`,`笔记`,`归类`].map(e=>(0,G.jsx)(`span`,{className:`sliding-tab`,children:(0,G.jsx)(`i`,{className:`skeleton-text skeleton-shimmer`,children:e})},e))})}),(0,G.jsxs)(`div`,{className:`editor-layout`,children:[(0,G.jsxs)(`div`,{className:`editor-main`,children:[(0,G.jsxs)(`section`,{className:`editor-block editor-question-block`,children:[(0,G.jsx)(wo,{title:`题目`,required:!0}),(0,G.jsx)(So,{}),(0,G.jsx)(Co,{label:`题干 *`,question:!0})]}),(0,G.jsxs)(`section`,{className:`editor-block editor-answers-block skeleton-editor-secondary`,children:[(0,G.jsx)(wo,{title:`答案与分析`}),(0,G.jsx)(Co,{label:`正确答案　选填`,rows:3}),(0,G.jsx)(So,{answer:!0}),(0,G.jsx)(`div`,{className:`photo-actions`,children:(0,G.jsx)(lo,{children:`生成解析`})}),(0,G.jsx)(Co,{label:`解题分析　选填`})]}),(0,G.jsxs)(`section`,{className:`editor-block editor-note-block skeleton-editor-secondary`,children:[(0,G.jsx)(wo,{title:`我的笔记`}),(0,G.jsx)(Co,{label:`我的笔记　选填`})]})]}),(0,G.jsxs)(`aside`,{className:`editor-aside editor-classification editor-block skeleton-editor-secondary`,children:[(0,G.jsx)(wo,{title:`学科与知识点`}),(0,G.jsx)(uo,{label:`学科 *`}),(0,G.jsx)(uo,{label:`主知识点　选填`}),(0,G.jsxs)(`div`,{className:`field`,children:[(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:`辅助知识点　可多选`})}),(0,G.jsxs)(`div`,{className:`knowledge-options skeleton-copy-lines`,children:[(0,G.jsx)(W,{children:`知识点名称`}),(0,G.jsx)(W,{children:`知识点名称`})]})]}),(0,G.jsxs)(`div`,{className:`field`,children:[(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:`星级标记　选填`})}),(0,G.jsx)(W,{children:`☆　☆　☆　☆　☆`})]})]})]})]})}function Eo(){let e=/^#\/mistakes\/\d+\/edit/.test(window.location.hash);return(0,G.jsxs)(`div`,{className:`editor-workbench`,children:[(0,G.jsxs)(`nav`,{className:`editor-navigation`,children:[(0,G.jsxs)(`span`,{className:`back-link`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:e?`返回错题详情`:`返回我的错题`})]}),!e&&(0,G.jsxs)(`span`,{className:`table-button editor-batch-entry`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:`按页批量录入`})]})]}),(0,G.jsxs)(`header`,{className:`editor-workbench-header`,children:[(0,G.jsx)(`div`,{children:(0,G.jsx)(`h1`,{children:(0,G.jsx)(W,{children:e?`编辑错题`:`录入错题`})})}),(0,G.jsx)(`div`,{className:`editor-workbench-state`,children:(0,G.jsx)(`span`,{className:`editor-mode`,children:(0,G.jsx)(W,{children:`正在编辑`})})})]}),(0,G.jsx)(To,{})]})}function Do(){return(0,G.jsx)(`div`,{className:`review-candidates`,children:[0,1,2].map(e=>(0,G.jsxs)(`div`,{className:`review-candidate`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h3`,{children:(0,G.jsx)(W,{children:`题目条件、问题和需要复习的内容`})}),(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:`学科 · 知识点`})}),(0,G.jsx)(`div`,{className:`review-candidate-rating`,children:(0,G.jsx)(W,{children:`☆☆☆☆☆`})})]}),(0,G.jsx)(`span`,{className:`status-badge`,children:(0,G.jsx)(`i`,{className:`skeleton-text skeleton-shimmer`,children:`未复习`})})]},e))})}function Oo(){return(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(po,{title:`开始复习`}),(0,G.jsxs)(`div`,{className:`review-selection-layout`,children:[(0,G.jsxs)(`section`,{className:`library-panel`,children:[(0,G.jsxs)(`div`,{className:`panel-title selection-heading`,children:[(0,G.jsx)(`span`,{className:`panel-title-icon`,children:(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`})}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h2`,{children:(0,G.jsx)(W,{children:`选择今天的练习`})}),(0,G.jsx)(`p`,{children:(0,G.jsx)(W,{children:`仅已归档的错题可以参与复习。`})})]})]}),(0,G.jsx)(`div`,{className:`filter-bar review-filters has-rating-filter`,children:[`全部学科`,`全部知识点`,`全部掌握程度`,`全部星级`].map(e=>(0,G.jsx)(`div`,{className:`custom-select`,children:(0,G.jsxs)(`div`,{className:`custom-select-trigger`,children:[(0,G.jsx)(W,{children:e}),(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`})]})},e))}),(0,G.jsxs)(`div`,{className:`selection-toolbar`,children:[(0,G.jsxs)(`label`,{children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:`全选当前结果`})]}),(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:`共 0 道 · 已选 0 道`})})]}),(0,G.jsx)(Do,{})]}),(0,G.jsxs)(`aside`,{className:`review-preparation panel`,children:[(0,G.jsx)(`span`,{className:`prep-icon`,children:(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`,style:{width:29,height:29}})}),(0,G.jsx)(`h2`,{children:(0,G.jsx)(W,{children:`今天的复习计划`})}),(0,G.jsxs)(`div`,{className:`prep-selected`,children:[(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:`本次已选择`})}),(0,G.jsxs)(`strong`,{children:[(0,G.jsx)(W,{children:`0`}),(0,G.jsx)(`small`,{children:(0,G.jsx)(W,{children:`道错题`})})]})]}),(0,G.jsx)(`div`,{className:`prep-steps`,children:[`独立完成题目`,`查看答案与分析`,`记录本次掌握程度`].map((e,t)=>(0,G.jsxs)(`span`,{children:[(0,G.jsx)(`i`,{children:t+1}),(0,G.jsx)(W,{children:e})]},e))}),(0,G.jsx)(lo,{children:`开始复习`}),(0,G.jsx)(`small`,{className:`prep-hint`,children:(0,G.jsx)(W,{children:`复习记录会同步更新掌握程度。`})})]})]})]})}var G,ko=t((()=>{P(),oo(),so(),co(),G=Je()}));function Ao(){let[e,t]=(0,K.useState)(()=>window.matchMedia(`(prefers-reduced-motion: reduce)`).matches);return(0,K.useEffect)(()=>{let e=window.matchMedia(`(prefers-reduced-motion: reduce)`),n=()=>t(e.matches);return e.addEventListener(`change`,n),()=>e.removeEventListener(`change`,n)},[]),e}function jo(){let e=Ao(),t=(0,K.useRef)([]),n=(0,K.useCallback)(()=>{t.current.forEach(e=>e.cancel()),t.current=[]},[]),r=(0,K.useCallback)((r,i,a,o)=>{if(n(),e||!r||typeof r.animate!=`function`)return Promise.resolve();let s={duration:Wo,easing:Ho,fill:`forwards`};return t.current=[r.animate([{transform:`none`},{transform:`rotate(${i*90}deg) scale(${a})`}],s)],o&&t.current.push(o.element.animate([{height:`${o.from}px`,overflow:`hidden`},{height:`${o.to}px`,overflow:`hidden`}],s)),Promise.all(t.current.map(e=>e.finished)).then(()=>void 0,()=>void 0)},[e,n]);return(0,K.useEffect)(()=>n,[n]),{turn:r,settle:n}}function Mo(){let e=(0,K.useSyncExternalStore)(Ga,qa),t=e.pending>0,n=Ao(),r=(0,K.useRef)(null),i=(0,K.useRef)(`idle`),a=(0,K.useRef)(0),o=(0,K.useRef)(0),s=(0,K.useRef)(0),c=(0,K.useRef)(new Set),l=(0,K.useRef)(new Set),[u,d]=(0,K.useState)({visible:!1,progress:0,completing:!1});return(0,K.useEffect)(()=>()=>{c.current.forEach(e=>window.clearTimeout(e)),l.current.forEach(e=>window.cancelAnimationFrame(e)),c.current.clear(),l.current.clear()},[]),(0,K.useEffect)(()=>{function u(){c.current.forEach(e=>window.clearTimeout(e)),l.current.forEach(e=>window.cancelAnimationFrame(e)),c.current.clear(),l.current.clear()}function f(e,t){let n=window.setTimeout(()=>{c.current.delete(n),e()},t);c.current.add(n)}function p(e){let t=window.requestAnimationFrame(()=>{l.current.delete(t),e()});l.current.add(t)}function m(){if(i.current!==`loading`||!Ka())return;let e=.92-o.current;e>.003&&(o.current+=e*.18,d({visible:!0,progress:o.current,completing:!1}),f(m,450+o.current*750))}function h(){Ka()||(i.current=`completing`,o.current=1,d({visible:!0,progress:1,completing:!0}),f(()=>{i.current=`fading`,d(e=>({...e,visible:!1})),f(()=>{i.current=`idle`,o.current=0,d({visible:!1,progress:0,completing:!1})},n?40:180)},n?100:440))}let g=e.cycle!==s.current;if(s.current=e.cycle,t||g){u(),a.current=performance.now();let e=i.current;if(i.current=`loading`,e===`idle`)o.current=0,d({visible:!0,progress:0,completing:!1}),p(()=>p(()=>{o.current=.3,d({visible:!0,progress:.3,completing:!1}),f(m,n?100:360)}));else{let e=r.current?getComputedStyle(r.current).transform:`none`,t=e===`none`?o.current:new DOMMatrixReadOnly(e).a;o.current=Math.min(.99,Math.max(.3,t)),d({visible:!0,progress:o.current,completing:!1}),f(m,450)}}!t&&i.current===`loading`&&f(()=>{u(),h()},Math.max(0,(n?60:260)-(performance.now()-a.current)))},[t,e.cycle,n]),(0,q.jsx)(`div`,{className:`loading-progress${u.visible?` is-visible`:``}${u.completing?` is-completing`:``}`,"aria-hidden":`true`,style:{opacity:+!!u.visible,transition:`opacity ${n?40:180}ms ${Ho}`},children:(0,q.jsx)(`span`,{ref:r,className:`loading-progress-fill`,style:{transform:`scaleX(${u.progress})`,transition:`transform ${n?60:u.completing?320:u.progress<=.3?200:700}ms ${Ho}`}})})}function No({tabs:e,value:t,onChange:n,ariaLabel:r,className:i=``}){let a=(0,K.useRef)(null),o=(0,K.useRef)(!1),[s,c]=(0,K.useState)({x:0,width:0}),[l,u]=(0,K.useState)(!1),d=e.map(e=>e.id).join(`\0`);(0,K.useLayoutEffect)(()=>{let e=a.current;if(!e)return;let n=!1,r=0;function i(){if(n||!e)return;let i=Array.from(e.querySelectorAll(`[role="tab"]`)).find(e=>e.dataset.tabId===t);if(!i)return;let a=i.getBoundingClientRect(),s=e.getBoundingClientRect(),l={x:a.left-s.left+e.scrollLeft-e.clientLeft,width:a.width};c(e=>Math.abs(e.x-l.x)<.1&&Math.abs(e.width-l.width)<.1?e:l),!o.current&&!r&&(r=window.requestAnimationFrame(()=>{o.current=!0,u(!0)}))}i();let s=new ResizeObserver(i);return s.observe(e),e.querySelectorAll(`[role="tab"]`).forEach(e=>s.observe(e)),window.addEventListener(`resize`,i),document.fonts.ready.then(i),()=>{n=!0,s.disconnect(),window.removeEventListener(`resize`,i),window.cancelAnimationFrame(r)}},[t,d]);function f(t,r){let i=r;if(t.key===`ArrowRight`)i=(r+1)%e.length;else if(t.key===`ArrowLeft`)i=(r-1+e.length)%e.length;else if(t.key===`Home`)i=0;else if(t.key===`End`)i=e.length-1;else return;t.preventDefault(),n(e[i].id),a.current?.querySelectorAll(`[role="tab"]`)[i]?.focus()}return(0,q.jsxs)(`div`,{ref:a,className:`sliding-tabs ${i}`.trim(),role:`tablist`,"aria-label":r,children:[e.map((e,r)=>(0,q.jsx)(`button`,{id:e.panelId?`${e.panelId}-tab`:void 0,type:`button`,role:`tab`,"data-tab-id":e.id,"aria-controls":e.panelId,"aria-selected":t===e.id,tabIndex:t===e.id?0:-1,className:`sliding-tab${t===e.id?` is-active`:``}`,onClick:()=>n(e.id),onKeyDown:e=>f(e,r),children:e.label},e.id)),(0,q.jsx)(`span`,{className:`tab-indicator`,"aria-hidden":`true`,style:{width:s.width,transform:`translateX(${s.x}px)`,opacity:+!!l,...l?{}:{transition:`none`}}})]})}function Po({items:e,value:t,ariaLabel:n=`主导航`}){let r=(0,K.useRef)(null),i=(0,K.useRef)(!1),[a,o]=(0,K.useState)(!1),[s,c]=(0,K.useState)({x:0,y:0,width:0,height:0,visible:!1}),l=e.map(e=>e.id).join(`\0`);return(0,K.useLayoutEffect)(()=>{let e=r.current;if(!e)return;let n=!1,a=0;function s(){if(n||!e)return;let r=Array.from(e.querySelectorAll(`.nav-item`)).find(e=>e.dataset.navId===t);if(!r){c(e=>e.visible?{...e,visible:!1}:e);return}let s=getComputedStyle(e),l=s.getPropertyValue(`--nav-indicator-axis`).trim(),u=l?l===`horizontal`:s.display===`grid`||s.flexDirection===`row`,d=parseFloat(s.getPropertyValue(`--nav-indicator-inset`))||(u?10:12),f=parseFloat(s.getPropertyValue(`--nav-indicator-thickness`))||3,p=r.getBoundingClientRect(),m=e.getBoundingClientRect(),h=p.left-m.left+e.scrollLeft-e.clientLeft,g=p.top-m.top+e.scrollTop-e.clientTop,_=u?{x:h+d,y:g+p.height-f,width:Math.max(0,p.width-d*2),height:f,visible:!0}:{x:h,y:g+d,width:f,height:Math.max(0,p.height-d*2),visible:!0};c(e=>e.visible===_.visible&&Math.abs(e.x-_.x)<.1&&Math.abs(e.y-_.y)<.1&&Math.abs(e.width-_.width)<.1&&Math.abs(e.height-_.height)<.1?e:_),!i.current&&!a&&(a=window.requestAnimationFrame(()=>{i.current=!0,o(!0)}))}s();let l=new ResizeObserver(s);return l.observe(e),e.querySelectorAll(`.nav-item`).forEach(e=>l.observe(e)),window.addEventListener(`resize`,s),document.fonts.ready.then(s),()=>{n=!0,l.disconnect(),window.removeEventListener(`resize`,s),window.cancelAnimationFrame(a)}},[t,l]),(0,q.jsxs)(`nav`,{ref:r,className:`navigation`,"aria-label":n,children:[e.map(e=>e.element?(0,q.jsx)(`span`,{className:`nav-custom-item`,children:e.element},e.id):(0,q.jsx)(`a`,{href:e.href,"data-nav-id":e.id,className:`nav-item${t===e.id?` active`:``}`,"aria-current":t===e.id?`page`:void 0,children:e.label},e.id)),(0,q.jsx)(`span`,{className:`nav-indicator`,"aria-hidden":`true`,style:{transform:`translate(${s.x}px, ${s.y}px)`,width:s.width,height:s.height,opacity:a&&s.visible?1:0,...a?{}:{transition:`none`}}})]})}function Fo({size:e=`long`}){return(0,q.jsx)(`span`,{className:`skeleton-line skeleton-shimmer ${e}`})}function Io(){return(0,q.jsxs)(`div`,{className:`skeleton-heading`,children:[(0,q.jsxs)(`div`,{className:`skeleton-heading-copy`,children:[(0,q.jsx)(Fo,{size:`title`}),(0,q.jsx)(Fo,{size:`medium`})]}),(0,q.jsx)(`span`,{className:`skeleton-block skeleton-shimmer`})]})}function Lo({library:e=!1}){return(0,q.jsx)(`div`,{className:`metrics-grid${e?` library-metrics`:``}`,children:(e?[{label:`已归档错题`,tone:`green`},{label:`待巩固`,tone:`amber`},{label:`已掌握`,tone:`green`}]:[{label:`已归档错题`,tone:`violet`},{label:`待完善草稿`,tone:`amber`},{label:`累计复习`,tone:`blue`},{label:`当前掌握率`,tone:`green`}]).map(({label:e,tone:t})=>(0,q.jsxs)(`div`,{className:`metric-card skeleton-metric-card`,children:[(0,q.jsxs)(`div`,{className:`metric-top`,children:[(0,q.jsx)(`span`,{className:`skeleton-metric-label skeleton-shimmer`,children:e}),(0,q.jsx)(`span`,{className:`metric-icon ${t}`,children:(0,q.jsx)(`span`,{className:`skeleton-metric-icon skeleton-shimmer`})})]}),(0,q.jsxs)(`div`,{className:`metric-value`,children:[(0,q.jsx)(`span`,{className:`skeleton-metric-count skeleton-shimmer`}),(0,q.jsx)(`span`,{className:`skeleton-metric-unit skeleton-shimmer`})]})]},e))})}function Ro({review:e=!1}){return(0,q.jsxs)(`div`,{className:`skeleton-list`,children:[!e&&(0,q.jsxs)(`div`,{className:`skeleton-toolbar`,children:[(0,q.jsx)(Fo,{size:`medium`}),(0,q.jsx)(Fo,{size:`short`})]}),Array.from({length:3},(e,t)=>(0,q.jsxs)(`div`,{className:`skeleton-row`,children:[(0,q.jsx)(`span`,{className:`skeleton-row-index skeleton-shimmer`}),(0,q.jsxs)(`div`,{className:`skeleton-row-copy`,children:[(0,q.jsx)(Fo,{}),(0,q.jsx)(Fo,{size:`medium`})]}),(0,q.jsx)(Fo,{size:`short`}),(0,q.jsx)(Fo,{size:`short`})]},t))]})}function zo(){return(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`div`,{className:`skeleton-reading-header`,children:(0,q.jsx)(Io,{})}),(0,q.jsxs)(`div`,{className:`skeleton-reading-meta`,children:[(0,q.jsx)(Fo,{size:`short`}),(0,q.jsx)(Fo,{size:`short`}),(0,q.jsx)(Fo,{size:`short`})]}),(0,q.jsx)(`div`,{className:`skeleton-panel skeleton-reading-document`,children:[0,1,2].map(e=>(0,q.jsxs)(`section`,{children:[(0,q.jsx)(Fo,{size:`short`}),(0,q.jsx)(Fo,{}),(0,q.jsx)(Fo,{}),(0,q.jsx)(Fo,{size:`medium`})]},e))}),(0,q.jsxs)(`div`,{className:`skeleton-panel skeleton-reading-history`,children:[(0,q.jsx)(Fo,{size:`medium`}),(0,q.jsx)(Fo,{}),(0,q.jsx)(Fo,{size:`short`})]})]})}function Bo({kind:e=`library`}){let t;switch(e){case`summary`:t=(0,q.jsx)(Lo,{library:!0});break;case`rows`:t=(0,q.jsx)(Ro,{});break;case`review`:t=(0,q.jsx)(Do,{});break;case`review-page`:t=(0,q.jsx)(Oo,{});break;case`settings`:t=(0,q.jsx)(vo,{});break;case`settings-page`:t=(0,q.jsx)(_o,{});break;case`ai-profile`:t=(0,q.jsx)(yo,{});break;case`backups`:t=(0,q.jsx)(bo,{});break;case`test-data`:t=(0,q.jsx)(xo,{});break;case`tasks`:t=(0,q.jsx)(ho,{});break;case`tasks-page`:t=(0,q.jsx)(go,{});break;case`stats-page`:t=(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(po,{title:`学习统计`,action:`去复习`}),(0,q.jsx)(Lo,{}),(0,q.jsx)(mo,{})]});break;case`stats`:t=(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(Lo,{}),(0,q.jsx)(mo,{})]});break;case`editor`:t=(0,q.jsx)(To,{});break;case`editor-page`:t=(0,q.jsx)(Eo,{});break;case`detail`:t=(0,q.jsx)(zo,{});break;case`shell`:t=(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(Io,{}),(0,q.jsx)(Lo,{library:!0}),(0,q.jsx)(Ro,{})]});break;default:t=(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(Io,{}),(0,q.jsx)(Lo,{library:!0}),(0,q.jsxs)(`div`,{className:`skeleton-toolbar`,children:[(0,q.jsx)(Fo,{size:`medium`}),(0,q.jsx)(Fo,{size:`short`})]}),(0,q.jsx)(Ro,{})]})}return(0,q.jsx)(`div`,{className:`skeleton-screen skeleton-${e}`,"aria-hidden":`true`,children:t})}function Vo({loading:e,kind:t=`library`,className:n=``,children:r}){let i=Ao(),[a,o]=(0,K.useState)(e);return(0,K.useEffect)(()=>{if(e){o(!0);return}let t=window.setTimeout(()=>o(!1),i?40:Uo);return()=>window.clearTimeout(t)},[e,i]),(0,q.jsxs)(`div`,{className:`loading-content loading-kind-${t} ${e?`is-loading`:`is-ready`} ${n}`.trim(),"aria-busy":e,children:[(0,q.jsx)(`div`,{className:`loading-content-body`,inert:e,"aria-hidden":e||void 0,children:r}),(a||e)&&(0,q.jsxs)(`div`,{className:`loading-content-placeholder`,"aria-hidden":!e||void 0,children:[(0,q.jsx)(`span`,{className:`visually-hidden`,role:`status`,children:`正在加载…`}),(0,q.jsx)(Bo,{kind:t})]})]})}var K,q,Ho,Uo,Wo,Go=t((()=>{K=e(V()),ko(),ao(),q=Je(),Ho=`cubic-bezier(0.22, 0.61, 0.36, 1)`,Uo=260,Wo=280}));function Ko({className:e=``}){return(0,qo.jsx)(`img`,{className:`logo-mark ${e}`,src:`/mistakes/logo.svg`,alt:``,width:`48`,height:`48`})}var qo,Jo=t((()=>{qo=Je()})),Yo=t((()=>{}));function Xo({user:e,logout:t}){let[n,r]=(0,Zo.useState)(!1),[i,a]=(0,Zo.useState)(``);async function o(){r(!0),a(``);try{let e=await fetch(`/api/mistakes/auth/data-export`,{credentials:`same-origin`});if(!e.ok){let t=await e.json().catch(()=>null);throw Error(t?.message||`下载失败，请稍后重试。`)}let t=await e.blob(),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`shiti-my-data-${new Date().toISOString().slice(0,10)}.zip`,document.body.appendChild(r),r.click(),r.remove(),window.setTimeout(()=>URL.revokeObjectURL(n),6e4)}catch(e){a(e.message)}finally{r(!1)}}return(0,J.jsxs)(`main`,{className:`frozen-page`,children:[(0,J.jsxs)(`header`,{className:`frozen-header`,children:[(0,J.jsxs)(`span`,{className:`brand`,children:[(0,J.jsx)(Ko,{}),(0,J.jsx)(`span`,{children:`拾题`})]}),(0,J.jsx)(`span`,{className:`frozen-username`,children:e.username})]}),(0,J.jsxs)(`section`,{className:`frozen-content`,"aria-labelledby":`frozen-title`,children:[(0,J.jsx)(at,{size:32,strokeWidth:1.5,className:`frozen-icon`}),(0,J.jsx)(`h1`,{id:`frozen-title`,children:`您的账号已被冻结`}),(0,J.jsx)(`p`,{className:`frozen-reassurance`,children:`请放心，您的学习数据仍被妥善保管，不会因账号冻结而删除。`}),(0,J.jsxs)(`div`,{className:`frozen-download`,children:[(0,J.jsxs)(`button`,{className:`button primary`,disabled:n,onClick:()=>void o(),children:[n?(0,J.jsx)(nt,{size:18,className:`spin`}):(0,J.jsx)(Qe,{size:18}),n?`正在打包并下载…`:`下载我的数据`]}),(0,J.jsx)(`p`,{children:`下载包含错题、答案、解析、笔记、知识点、复习记录和现存图片，也包括草稿与回收站内容。`}),i&&(0,J.jsxs)(`p`,{className:`inline-alert`,role:`alert`,children:[i,` 请重试；若登录已过期，请退出后重新登录。`]})]}),(0,J.jsxs)(`button`,{className:`button ghost`,onClick:()=>void t(),children:[(0,J.jsx)(tt,{size:17}),`退出登录`]})]}),(0,J.jsx)(`footer`,{className:`frozen-footer`,children:(0,J.jsx)(`p`,{children:`冻结期间暂时无法使用学习功能，您仍可下载自己的数据。如需恢复使用，请联系管理员。`})})]})}var Zo,J,Qo=t((()=>{Zo=e(V()),ot(),Jo(),Yo(),J=Je()})),$o,es,ts,ns,rs,is=t((()=>{$o=`modulepreload`,es=function(e){return`/mistakes/`+e},ts={},ns=function(e){return e.pathname.endsWith(`.css`)},rs=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=es(t,n);let r=s(t);if(r.href in ts)return;ts[r.href]=!0;let i=ns(r);if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let o=document.createElement(`link`);if(o.rel=i?`stylesheet`:$o,i||(o.as=`script`),o.crossOrigin=``,o.href=r.href,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),i)return new Promise((e,t)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${r}`)))})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})}}));function as(){return ls||=rs(async()=>{let{FriendlyCaptchaSDK:e}=await import(`./sdk-LxJ6YTVI.js`);return{FriendlyCaptchaSDK:e}},__vite__mapDeps([0,1])).then(({FriendlyCaptchaSDK:e})=>new e).catch(e=>{throw ls=null,e}),ls}function os({sitekey:e,resetKey:t,onChange:n}){let r=(0,ss.useRef)(null),[i,a]=(0,ss.useState)(!0);return(0,ss.useEffect)(()=>{let t=r.current;if(!t)return;let i=document.createElement(`div`);t.append(i);let o=!0,s;a(!0),n({status:`pending`,response:``});let c=e=>{if(!o)return;let{state:t,response:r}=e.detail;n(t===`completed`?{status:`complete`,response:r}:t===`error`?{status:`error`,response:r||`.ERROR`}:t===`expired`?{status:`expired`,response:``}:{status:`pending`,response:``})};return i.addEventListener(`frc:widget.statechange`,c),as().then(t=>{o&&(s=t.createWidget({element:i,sitekey:e,apiEndpoint:`global`,startMode:`focus`,theme:`light`}),a(!1),i.closest(`form`)?.contains(document.activeElement)&&s.start())}).catch(()=>{o&&(a(!1),n({status:`error`,response:`.ERROR`}))}),()=>{o=!1,i.removeEventListener(`frc:widget.statechange`,c),s?.destroy(),i.remove()}},[e,t,n]),(0,cs.jsxs)(`div`,{className:`auth-captcha-control`,children:[i&&(0,cs.jsxs)(`div`,{className:`auth-captcha-loading`,role:`status`,children:[(0,cs.jsx)(nt,{className:`spin`,size:16}),` 正在加载人机验证…`]}),(0,cs.jsx)(`div`,{className:`auth-captcha-widget`,ref:r})]})}var ss,cs,ls,us=t((()=>{ss=e(V()),ot(),cs=Je(),is(),ls=null})),ds,fs,ps,ms=t((()=>{ds=e(V()),fs=Je(),ps=class extends ds.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidUpdate(e){this.state.failed&&e.resetKey!==this.props.resetKey&&this.setState({failed:!1})}render(){return this.state.failed?(0,fs.jsxs)(`div`,{className:`inline-alert`,role:`alert`,children:[`页面加载失败，请刷新后重试。`,(0,fs.jsx)(`button`,{type:`button`,onClick:()=>window.location.reload(),children:`刷新页面`})]}):this.props.children}}}));function hs(e){let t=e.split(`?`)[0].match(/^\/mistakes\/(\d+)(\/edit)?$/);return t?{id:Number(t[1]),editing:!!t[2]}:null}var gs,_s,vs,ys,bs=t((()=>{gs=e(V()),_s=(0,gs.createContext)(null),vs=()=>(0,gs.useContext)(_s),ys=`mistakes:open-toast-record`}));function xs(e){return{className:`ai-toast-actionable`,closeOnClick:!0,onClick:t=>{if(window.matchMedia(`(max-width: 640px)`).matches&&hs(e)){t.preventDefault(),window.dispatchEvent(new CustomEvent(ys,{cancelable:!0,detail:{path:e}}));return}if(e.startsWith(`/ai-tasks`)){t.preventDefault(),window.dispatchEvent(new CustomEvent(`mistakes:open-ai-tasks`,{detail:{path:e}}));return}window.location.hash===`#${e}`?window.dispatchEvent(new HashChangeEvent(`hashchange`)):Za(e)}}}var Ss=t((()=>{ao(),bs()}));function Cs(e){let t=(0,ws.useRef)(new Map),n=(0,ws.useRef)(null),r=(0,ws.useRef)(0);return(0,ws.useEffect)(()=>()=>{n.current&&clearTimeout(n.current),H.dismiss(e)},[e]),(0,ws.useCallback)(i=>{if(i.length){if(Date.now()-r.current>8e3)for(let[e,n]of t.current)n.status===`completed`&&t.current.delete(e);r.current=Date.now(),i.forEach(e=>t.current.set(e.id,e)),!n.current&&(n.current=setTimeout(()=>{n.current=null;let r=[...t.current.values()],i=r.filter(e=>e.status===`failed`).length,a=r.filter(e=>e.status===`active`).length,o=r.length-i-a,s=t=>(0,Ts.jsxs)(`div`,{className:`ai-toast-copy`,children:[(0,Ts.jsxs)(`a`,{className:`ai-toast-link`,href:`#${t.path}`,onClick:n=>{xs(t.path).onClick?.(n),H.dismiss(e)},children:[(0,Ts.jsx)(`span`,{children:t.message}),(0,Ts.jsx)(`small`,{children:`点击查看处理`})]}),t.retry&&(0,Ts.jsx)(`button`,{type:`button`,onClick:t.retry,children:`重试`})]},t.id),c=r.length===1?s(r[0]):(0,Ts.jsxs)(`div`,{className:`ai-toast-copy`,children:[(0,Ts.jsx)(`span`,{children:[a&&`${a} 项处理中`,o&&`${o} 项完成`,i&&`${i} 项失败`].filter(Boolean).join(` · `)}),r.every(e=>e.path.startsWith(`/ai-tasks`))?(0,Ts.jsxs)(`a`,{href:`#/ai-tasks`,onClick:t=>{xs(`/ai-tasks`).onClick?.(t),H.dismiss(e)},children:[`查看 `,r.length,` 项任务`]}):(0,Ts.jsxs)(`details`,{className:`activity-toast-details`,children:[(0,Ts.jsxs)(`summary`,{children:[`查看 `,r.length,` 项记录`,i?`并重试`:``]}),(0,Ts.jsx)(`div`,{children:[...r].sort((e,t)=>Number(t.status===`failed`)-Number(e.status===`failed`)).map(s)})]})]}),l={type:i?`error`:a?`info`:`success`,isLoading:!(!a||i),autoClose:a||i?!1:4500,closeButton:!0,closeOnClick:!1,onClose:()=>{t.current.clear()}};H.isActive(e)?H.update(e,{render:c,...l}):H(c,{toastId:e,...l})},400))}},[e])}var ws,Ts,Es=t((()=>{ws=e(V()),kn(),Ss(),Ts=Je()}));function Ds(){let e=(0,Y.useContext)(Rs);if(!e)throw Error(`AI tasks context missing`);return e}function Os({className:e=``}){let{jobs:t,feedback:n,openTasks:r,open:i}=Ds(),a=t.filter(Ps),o=t.some(e=>Fs(e)||!e.mistakeDeleted&&e.status===`failed`),s=a.length,c=a.map(e=>e.id).sort((e,t)=>e-t).join(`,`),l=`${s?`，${s} 项处理中`:``}${o?`，有待校对或失败任务`:``}`;return(0,X.jsxs)(`button`,{type:`button`,className:`button ghost ai-tasks-trigger ${e}${s?` has-active-tasks`:``}`,"aria-expanded":i,onClick:()=>r(),"aria-haspopup":`dialog`,"aria-label":`AI 任务${l}`,title:`AI 任务`,children:[(0,X.jsxs)(`span`,{className:`ai-task-icon`,"aria-hidden":`true`,children:[s>0&&(0,X.jsx)(`span`,{className:`ai-task-orbit`}),(0,X.jsx)(`span`,{className:`ai-task-sparkles`,"data-feedback":n?.tone,children:(0,X.jsx)(st,{size:19,strokeWidth:1.8})},n?.revision)]}),(0,X.jsx)(`span`,{className:`ai-task-label`,children:`AI 任务`}),(0,X.jsxs)(`span`,{className:`ai-task-indicators`,children:[(0,X.jsx)(ks,{count:s,signature:c}),o&&(0,X.jsx)(`span`,{className:`ai-task-attention`,"aria-hidden":`true`})]})]})}function ks({count:e,signature:t}){let[n,r]=(0,Y.useState)({signature:t,count:e,revision:0,motion:``,visible:e>0});return n.signature!==t&&r({signature:t,count:e,revision:n.revision+1,motion:e===0?`exit`:e>n.count?`increase`:e<n.count?`decrease`:`replace`,visible:e>0||n.count>0}),(0,Y.useEffect)(()=>{if(n.count||!n.visible)return;let e=window.setTimeout(()=>r(e=>({...e,visible:!1})),360);return()=>window.clearTimeout(e)},[n.count,n.visible,n.revision]),n.visible?(0,X.jsx)(`span`,{"aria-hidden":`true`,className:`count-pill ai-task-count${n.motion?` ai-task-count-${n.motion}`:``}`,children:e},n.revision):null}function As({children:e}){let{user:t}=ae(),[n,r]=(0,Y.useState)([]),[i,a]=(0,Y.useState)(null),[o,s]=(0,Y.useState)(!1),c=(0,Y.useRef)(null),[l,u]=(0,Y.useState)({revision:0}),d=(0,Y.useRef)(new Map),f=(0,Y.useCallback)((e,t)=>(d.current.set(e,t),()=>{d.current.get(e)===t&&d.current.delete(e)}),[]),p=(0,Y.useCallback)(e=>d.current.get(e),[]),m=(0,Y.useCallback)((e={})=>{c.current=document.activeElement instanceof HTMLElement?document.activeElement:null,u(t=>({...e,revision:t.revision+1})),s(!0)},[]),[h,g]=(0,Y.useState)(window.location.hash.split(`?`)[0]===`#/ai-tasks`),[_,v]=(0,Y.useState)(``),[y,b]=(0,Y.useState)(!1),[x,S]=(0,Y.useState)(!1),[C,w]=(0,Y.useState)(null),[T,E]=(0,Y.useState)(null),D=(0,Y.useRef)(null),[O,k]=(0,Y.useState)(new Set),A=(0,Y.useRef)(new Set),[j,M]=(0,Y.useState)(!document.hidden),ee=(0,Y.useRef)(!1),N=(0,Y.useRef)(new Set),te=(0,Y.useRef)(null),ne=(0,Y.useRef)(null),P=(0,Y.useRef)(!1),re=(0,Y.useRef)(!1),ie=(0,Y.useRef)(0),F=(0,Y.useRef)(!0),I=Cs(`ai-results-${t.id}`),oe=(0,Y.useCallback)(e=>{ie.current+=1,F.current&&r(t=>[...e,...t.filter(t=>!e.some(e=>e.id===t.id))].sort((e,t)=>t.id-e.id))},[]),L=(0,Y.useCallback)((e=!1)=>{if(P.current=!0,re.current||=e,ne.current)return ne.current;S(!0);let t=(async()=>{do{P.current=!1;let e=ie.current,t=re.current;re.current=!1;let[n,i]=await Promise.allSettled([Ya(`/ai/jobs`,{},{background:!0}),t?Ya(`/ai/config`,{},{background:!0}):Promise.resolve(null)]);if(!F.current)break;n.status===`fulfilled`&&(e===ie.current?(r(n.value),w(Date.now())):P.current=!0),i.status===`fulfilled`&&i.value&&a(i.value),v(n.status===`rejected`?n.reason.message:i.status===`rejected`?i.reason.message:``),b(!0)}while(F.current&&P.current)})().finally(()=>{ne.current=null,F.current&&S(!1)});return ne.current=t,t},[]),R=(0,Y.useCallback)(()=>L(!0),[L]);(0,Y.useEffect)(()=>{F.current=!0,R();let e=()=>{L()},t=()=>{R()},n=()=>{M(!document.hidden),document.hidden||R()},r=()=>{s(!1),g(window.location.hash.split(`?`)[0]===`#/ai-tasks`)},i=e=>{let t=e.detail.path.split(`?`)[1]||``,n=Number(new URLSearchParams(t).get(`job`))||null;m({jobId:n||void 0,view:new URLSearchParams(t).get(`view`)===`review`?`review`:`list`})};return window.addEventListener(`mistakes:updated`,e),window.addEventListener(`focus`,t),window.addEventListener(`hashchange`,r),window.addEventListener(`mistakes:open-ai-tasks`,i),document.addEventListener(`visibilitychange`,n),()=>{F.current=!1,window.removeEventListener(`mistakes:updated`,e),window.removeEventListener(`focus`,t),window.removeEventListener(`hashchange`,r),window.removeEventListener(`mistakes:open-ai-tasks`,i),document.removeEventListener(`visibilitychange`,n)}},[L,R,m]);let se=n.filter(Ps).length;(0,Y.useEffect)(()=>{if(!j)return;let e=setInterval(()=>void L(),se?2e3:15e3);return()=>clearInterval(e)},[se,j,L]),(0,Y.useEffect)(()=>{o&&R()},[o,R]),(0,Y.useEffect)(()=>{if(C===null)return;let e=D.current;if(D.current=new Map(n.map(({id:e,status:t,applyStatus:n})=>[e,{status:t,applyStatus:n}])),!e)return;let t=null;for(let r of n){let n=e.get(r.id);if(r.mistakeDeleted||n?.status===r.status&&n.applyStatus===r.applyStatus)continue;let i=r.status===`failed`?`failed`:Fs(r)?`review`:r.status===`cancelled`?`cancelled`:`active`;(t===null||Ls[i]>Ls[t])&&(t=i)}if(t!==null){let e=t;E(t=>({revision:(t?.revision??0)+1,tone:e}))}},[n,C]),(0,Y.useEffect)(()=>{let e=[];if(te.current)for(let t of n){let n=te.current.get(t.id);if(n&&n!==t.status&&!t.mistakeDeleted){if(t.status===`succeeded`){let n=t.applyStatus!==`applied`,r=`/ai-tasks?job=${t.id}${n?`&view=review`:``}`;e.push({id:String(t.id),path:r,status:`completed`,message:`记录 #${t.mistakeId} ${Ns(t)}完成${n?`，待校对。`:`，已填入。`}`})}if(t.status===`failed`){let n=`/ai-tasks?job=${t.id}`;e.push({id:String(t.id),path:n,status:`failed`,message:`记录 #${t.mistakeId} ${Ns(t)}失败，点击查看原因并重试。`})}}}te.current=new Map(n.map(e=>[e.id,e.status])),!o&&!h&&I(e)},[n,I,o,h]),(0,Y.useEffect)(()=>{if(y){for(let e of n){if(!e.analysisRoute||e.mistakeDeleted)continue;let t=`${e.id}:${e.analysisRoute.at}`;if(N.current.has(t)||(N.current.add(t),!ee.current&&!Ps(e)))continue;let n=`/ai-tasks?job=${e.id}`,r=e.analysisRoute.reason===`model_request`?`常规模型请求升级`:`解析响应超时`;o||H.info((0,X.jsxs)(`a`,{className:`ai-toast-link`,href:`#${n}`,children:[(0,X.jsxs)(`span`,{children:[`记录 #`,e.mistakeId,` `,r,`，已自动切换至升级模型 `,e.analysisRoute.model,`。`]}),(0,X.jsx)(`small`,{children:`查看任务进度`})]}),{...xs(n),toastId:`analysis-route-${t}`})}ee.current=!0}},[n,y,o]);let ce=(0,Y.useCallback)(async e=>{try{let t=await Ya(`/ai/jobs`,io(e));return oe([t]),t}catch(e){throw H.error(e.message),e}},[oe]),le=(0,Y.useCallback)(async(e,t={})=>{try{let n=await Ya(`/ai/jobs/${e}/apply`,io(t));return oe([n.job]),o||H.success(`AI 结果已填入。`),n}catch(t){let r=n.find(t=>t.id===e),i=r?`/mistakes/${r.mistakeId}/edit?aiJob=${e}`:`/ai-tasks`;throw o||H.error((0,X.jsxs)(`a`,{className:`ai-toast-link`,href:`#${i}`,children:[(0,X.jsx)(`span`,{children:t.message}),(0,X.jsx)(`small`,{children:`点击继续校对`})]}),xs(i)),R(),t}},[R,oe,n,o]),ue=(0,Y.useCallback)(async(e,t)=>{let n=[...new Set(e)].filter(e=>!A.current.has(e));if(!n.length)return{jobs:[],errors:[]};n.forEach(e=>A.current.add(e)),k(new Set(A.current));try{let e=await Ya(`/ai/jobs/batch`,io({ids:n,action:t}));return oe(e.jobs),e.jobs.length&&!o&&H.success(t===`retry`?`已将 ${e.jobs.length} 项任务重新加入队列。`:`已取消 ${e.jobs.length} 项任务。`),e}finally{n.forEach(e=>A.current.delete(e)),F.current&&(k(new Set(A.current)),L())}},[L,oe,o]);return(0,X.jsxs)(Rs.Provider,{value:{jobs:n,config:i,error:_,loaded:y,refreshing:x,updatedAt:C,feedback:T,busyIds:O,refresh:R,createJob:ce,applyJob:le,actJobs:ue,open:o,openTasks:m,registerEditor:f,editorSession:p,closeTasks:()=>s(!1)},children:[e,(0,X.jsx)(ps,{children:(0,X.jsx)(Y.Suspense,{fallback:null,children:(0,X.jsx)(js,{open:o,onOpenChange:s,request:l,triggerRef:c},l.revision)})})]})}var Y,X,js,Ms,Ns,Ps,Fs,Is,Ls,Rs,zs=t((()=>{Y=e(V()),ot(),kn(),ao(),P(),ms(),Ss(),Es(),X=Je(),is(),js=(0,Y.lazy)(()=>rs(()=>import(`./AiQuickPanel-t_zcc-WU.js`).then(e=>({default:e.AiQuickPanel})),__vite__mapDeps([2,1,3,4,5,6,7,8,9,10,11,12,13,14]))),Ms={question:`题干识别`,answer:`答案识别`,analysis:`生成解析`},Ns=e=>e.mode===`page-entry`?`按页录题`:Ms[e.type],Ps=e=>[`queued`,`running`,`retrying`].includes(e.status),Fs=e=>!e.mistakeDeleted&&e.status===`succeeded`&&e.applyStatus!==`applied`,Is=e=>Ps(e)||e.status===`failed`||e.status===`succeeded`&&e.applyStatus!==`applied`,Ls={cancelled:0,active:1,review:2,failed:3},Rs=(0,Y.createContext)(null)})),Bs,Vs,Hs,Us,Ws,Gs,Ks=t((()=>{ao(),Bs=class extends Error{constructor(){super(`请求超时，请重试。`)}},Vs=[1e3,2e3,4e3],Hs=e=>({...e,auxiliaryKnowledgePointIds:[...e.auxiliaryKnowledgePointIds]}),Us=e=>e instanceof Error?e.message:`请求失败，请重试。`,Ws=e=>e instanceof ro?e.status===408||e.status===429||e.status>=500&&e.status<600:e instanceof TypeError||e instanceof Bs,Gs=class{batches=new Map;listeners=new Set;snapshot=[];subscribe=e=>(this.listeners.add(e),()=>{this.listeners.delete(e)});getSnapshot=()=>this.snapshot;enqueue({mistakeId:e,purpose:t,input:n,files:r,recognize:i,recognitionPrompt:a}){let o=crypto.randomUUID(),s={view:{id:o,mistakeId:e,purpose:t,total:r.length,imageIds:[],status:`uploading`,message:`图片已压缩，正在后台上传…`,reuseRequested:!1},files:[...r],input:Hs(n),recognize:i,recognitionPrompt:a?.trim()||void 0,recognitionSubmitted:!1,recognitionClientId:crypto.randomUUID(),reuseClientId:crypto.randomUUID(),running:!1,controller:new AbortController};return this.batches.set(o,s),this.publish(),this.run(s),o}reuse(e,t,n){let r=this.batches.get(e);return!r||r.view.purpose!==`question`||r.view.reuseRequested?!1:(r.reuseInput=Hs(t),r.reuseRecognitionPrompt=n?.trim()||r.recognitionPrompt,this.update(r,{reuseRequested:!0,reuseStatus:`waiting`}),r.view.imageIds.length===r.view.total&&this.run(r),!0)}retry(e){let t=this.batches.get(e);t&&!t.running&&t.view.status===`failed`&&(t.recognitionError=void 0,t.reuseError=void 0,t.view.reuseStatus===`failed`&&this.update(t,{reuseStatus:`waiting`}),this.run(t))}dispose(){for(let e of this.batches.values())e.controller.abort(),e.files=[];this.batches.clear(),this.snapshot.length&&this.publish()}publish(){this.snapshot=Array.from(this.batches.values(),e=>e.view).reverse(),this.listeners.forEach(e=>e())}update(e,t){e.controller.signal.aborted||(e.view={...e.view,...t},this.publish())}async run(e){if(!(e.running||e.controller.signal.aborted)){e.running=!0;try{try{for(;e.view.imageIds.length<e.view.total;){let t=e.view.imageIds.length,n=e.files[t],r=await this.request(e,`uploading`,`正在后台上传第 ${t+1}/${e.view.total} 张图片…`,9e4,t=>{if(n.source)return Ya(`/mistakes/${e.view.mistakeId}/reuse-photo`,{...io({...n.source,purpose:e.view.purpose,clientId:n.clientId}),signal:t},{background:!0});let r=new FormData;return r.append(`original`,n.original,n.originalName.replace(/\.[^.]+$/,``)+`.jpg`),r.append(`crop`,n.crop,`crop.jpg`),r.append(`purpose`,e.view.purpose),r.append(`clientId`,n.clientId),Ya(`/mistakes/${e.view.mistakeId}/images`,{method:`POST`,body:r,signal:t},{background:!0})});this.update(e,{imageIds:[...e.view.imageIds,r.id]})}e.files=[]}catch(t){e.controller.signal.aborted||this.update(e,{status:`failed`,message:`图片上传失败：${Us(t)}`});return}if(e.recognize&&!e.recognitionSubmitted&&!e.recognitionError)try{await this.submitRecognition(e,e.view.purpose,e.input,e.recognitionClientId,e.recognitionPrompt),e.recognitionSubmitted=!0}catch(t){if(e.controller.signal.aborted)return;e.recognitionError=Us(t)}if(e.reuseInput&&e.view.reuseStatus===`waiting`){this.update(e,{reuseStatus:`submitting`});try{await this.submitRecognition(e,`answer`,e.reuseInput,e.reuseClientId,e.reuseRecognitionPrompt),this.update(e,{reuseStatus:`submitted`})}catch(t){if(e.controller.signal.aborted)return;e.reuseError=Us(t),this.update(e,{reuseStatus:`failed`})}}let t=[e.recognitionError&&`识别任务提交失败：${e.recognitionError}`,e.reuseError&&`答案复用提交失败：${e.reuseError}`].filter(Boolean);this.update(e,{status:t.length?`failed`:`completed`,message:t.length?t.join(`；`):e.view.reuseStatus===`submitted`?`图片已上传，答案复用已交给后台识别。`:e.recognize?`图片已上传，已交给后台识别。`:`${e.view.total} 张图片已上传。`})}finally{e.running=!1,!e.controller.signal.aborted&&e.view.imageIds.length===e.view.total&&e.view.reuseStatus===`waiting`&&this.run(e)}}}submitRecognition(e,t,n,r,i){return this.request(e,`processing`,`正在后台提交${t===`question`?`题目`:`答案`}识别…`,3e4,a=>Ya(`/ai/jobs`,{...io({clientId:r,mistakeId:e.view.mistakeId,type:t,imageIds:e.view.imageIds,input:n,recognitionPrompt:i}),signal:a},{background:!0}))}async request(e,t,n,r,i){for(let a=0;;a+=1){e.controller.signal.throwIfAborted(),this.update(e,{status:t,message:n});try{return await this.withTimeout(e,r,i)}catch(t){if(e.controller.signal.aborted||!Ws(t)||a>=Vs.length)throw t;let n=Vs[a];this.update(e,{status:`retrying`,message:`网络请求失败，${n/1e3} 秒后自动重试（${a+1}/${Vs.length}）…`}),await this.wait(e,n)}}}async withTimeout(e,t,n){e.controller.signal.throwIfAborted();let r=new AbortController,i=()=>r.abort();e.controller.signal.addEventListener(`abort`,i,{once:!0});let a=!1,o=setTimeout(()=>{a=!0,r.abort()},t);try{return await n(r.signal)}catch(e){throw a?new Bs:e}finally{clearTimeout(o),e.controller.signal.removeEventListener(`abort`,i)}}wait(e,t){return new Promise((n,r)=>{let i=e.controller.signal,a=()=>{clearTimeout(o),r(i.reason)},o=setTimeout(()=>{i.removeEventListener(`abort`,a),n()},t);i.addEventListener(`abort`,a,{once:!0}),i.aborted&&a()})}}}));function qs(){let e=(0,Ys.useContext)(Zs);if(!e)throw Error(`Photo uploads context missing`);return e}function Js({children:e}){let[t]=(0,Ys.useState)(()=>new Gs),n=(0,Ys.useRef)(new Map),r=(0,Ys.useSyncExternalStore)(t.subscribe,t.getSnapshot),i=Cs(`photo-uploads`);return(0,Ys.useEffect)(()=>()=>{t.dispose()},[t]),(0,Ys.useEffect)(()=>{let e=[];for(let i of r){if(n.current.get(i.id)===i)continue;n.current.set(i.id,i);let r=`/mistakes/${i.mistakeId}/edit?photo=${i.purpose}`;e.push({id:i.id,path:r,message:`记录 #${i.mistakeId} · ${i.message}`,status:i.status===`failed`?`failed`:i.status===`completed`?`completed`:`active`,retry:i.status===`failed`?()=>t.retry(i.id):void 0})}i(e)},[r,t,i]),(0,Xs.jsx)(Zs.Provider,{value:{queue:t,batches:r},children:e})}var Ys,Xs,Zs,Qs=t((()=>{Ys=e(V()),Ks(),Es(),Xs=Je(),Zs=(0,Ys.createContext)(null)})),$s=t((()=>{}));function ec({path:e,editorId:t,skeletonKind:n,children:r}){let[i]=(0,Z.useState)(()=>document.createElement(`div`)),a=(0,Z.useRef)(null),[o,s]=(0,Z.useState)(null),[c,l]=(0,Z.useState)(null),[u,d]=(0,Z.useState)(null),[f,p]=(0,Z.useState)(!1),m=(0,Z.useRef)(null),h=(0,Z.useRef)(0),g=(0,Z.useRef)({hash:``,x:0,y:0}),_=(0,Z.useRef)(new Set),v=(0,Z.useRef)({target:u,editorId:t,open:f});v.current={target:u,editorId:t,open:f};let y=!!(u?.editing&&t===u.id),b=(0,Z.useCallback)(e=>{let{target:t,editorId:n}=v.current;return!t?.editing||t.id===n||!!e?.editing&&e.id===t.id||!m.current||m.current()},[]),x=(0,Z.useCallback)(()=>{b(null)&&p(!1)},[b]),S=(0,Z.useCallback)(e=>{let t=hs(e);if(!t){Za(e);return}b(t)&&(v.current.target||(g.current={hash:window.location.hash,x:window.scrollX,y:window.scrollY}),d({...t,path:e,requestId:++h.current}),p(!0))},[b]),C=(0,Z.useCallback)(e=>(m.current=e,()=>{m.current===e&&(m.current=null)}),[]),w=(0,Z.useCallback)(e=>{if(!(e||v.current.open)){d(null);for(let e of _.current)window.dispatchEvent(new CustomEvent(`mistakes:record-view-updated`,{detail:{id:e}}));_.current.clear(),window.location.hash===g.current.hash&&requestAnimationFrame(()=>window.scrollTo(g.current.x,g.current.y))}},[]);(0,Z.useEffect)(()=>{let e=e=>{let t=e.detail.path;e.preventDefault(),S(t)},t=()=>{v.current.target&&window.location.hash!==g.current.hash&&p(!1)},n=()=>{v.current.target&&_.current.add(v.current.target.id)};return window.addEventListener(ys,e),window.addEventListener(`hashchange`,t),window.addEventListener(`mistakes:updated`,n),()=>{window.removeEventListener(ys,e),window.removeEventListener(`hashchange`,t),window.removeEventListener(`mistakes:updated`,n)}},[S]),(0,Z.useLayoutEffect)(()=>{let e=y?o:a.current;e&&i.parentElement!==e&&(y&&a.current&&(a.current.style.minHeight=`${a.current.getBoundingClientRect().height}px`),e.appendChild(i),!y&&a.current&&(a.current.style.minHeight=``))},[i,y,o]);let T=e=>{if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;let t=e.target.closest(`a[href^="#/"]`);if(!t||t.target===`_blank`||t.hasAttribute(`download`))return;let n=t.getAttribute(`href`).slice(1);hs(n)&&(e.preventDefault(),S(n))},E=u?{path:u.path,requestId:u.requestId,navigate:S,registerLeaveCheck:C,actionsContainer:c,retainsEditor:y,saved:()=>{v.current.target?.id===u.id&&x()},updated:e=>{_.current.delete(e),window.dispatchEvent(new CustomEvent(`mistakes:record-view-updated`,{detail:{id:e}}))}}:null,D=u?.editing?`editor`:`detail`;return(0,nc.jsxs)(nc.Fragment,{children:[(0,nc.jsx)(`div`,{ref:a,className:`record-page-slot`}),(0,tc.createPortal)((0,nc.jsx)(_s.Provider,{value:y?E:null,children:(0,nc.jsx)(ps,{resetKey:e.split(`?`)[0],children:(0,nc.jsx)(Z.Suspense,{fallback:(0,nc.jsx)(Vo,{loading:!0,kind:n,children:null}),children:r})})}),i),u&&(0,nc.jsx)(La,{open:f,onOpenChange:e=>e?p(!0):x(),onOpenChangeComplete:w,title:u.editing?`编辑错题`:`错题详情`,closeLabel:`关闭题目`,className:`record-view-drawer`,footer:(0,nc.jsx)(`div`,{ref:l,className:`record-view-actions`,onClickCapture:T}),children:()=>(0,nc.jsx)(`div`,{ref:s,className:`record-view-slot`,onClickCapture:T,children:!y&&(0,nc.jsx)(_s.Provider,{value:E,children:(0,nc.jsx)(ps,{resetKey:u.path,children:(0,nc.jsx)(Z.Suspense,{fallback:(0,nc.jsx)(Vo,{loading:!0,kind:D,children:null}),children:u.editing?(0,nc.jsx)(ic,{id:u.id},`editor-${u.id}`):(0,nc.jsx)(rc,{id:u.id},`detail-${u.id}`)})})})})})]})}var Z,tc,nc,rc,ic,ac=t((()=>{Z=e(V()),tc=e(ze()),ao(),Ba(),Go(),ms(),bs(),$s(),nc=Je(),is(),rc=(0,Z.lazy)(()=>rs(()=>import(`./DetailPage-BTYU-rtL.js`).then(e=>({default:e.DetailPage})),__vite__mapDeps([15,1,3,4,5,16,9,10,6,17,18,8,11,19,20,13,14]))),ic=(0,Z.lazy)(()=>rs(()=>import(`./EditorPage-CejYDB9Q.js`).then(e=>({default:e.EditorPage})),__vite__mapDeps([21,1,3,4,5,8,9,10,6,11,19,7,12,13,14,22,20,23])))})),oc,sc,cc,lc,uc=t((()=>{oc=e(V()),sc=(0,oc.createContext)(null),cc=()=>(0,oc.useContext)(sc),lc=e=>[`/`,`/mistakes`].includes(e.split(`?`)[0])}));function dc({onLogin:e,onNotify:t}){let[n,r]=(0,Q.useState)(!1),[i,a]=(0,Q.useState)(``),[o,s]=(0,Q.useState)(``),[c,l]=(0,Q.useState)(``),[u,d]=(0,Q.useState)(!1),[f,p]=(0,Q.useState)(``),[m,h]=(0,Q.useState)(null),[g,_]=(0,Q.useState)(``),[v,y]=(0,Q.useState)(0),[b,x]=(0,Q.useState)({status:`pending`,response:``}),[S,C]=(0,Q.useState)(0),w=(0,Q.useRef)(!1);(0,Q.useEffect)(()=>{let e=!0;return h(null),_(``),Ya(`/auth/config`).then(t=>{e&&h(t)}).catch(t=>{e&&_(t.message)}),()=>{e=!1}},[v]);let T=m!==null&&(!m.enabled||b.status===`complete`||!n&&b.status===`error`);function E(){x({status:`pending`,response:``}),C(e=>e+1)}async function D(r){if(r.preventDefault(),!w.current&&T){w.current=!0,d(!0),p(``);try{let r=await Ya(n?`/auth/register`:`/auth/login`,io({username:i.trim(),password:o,captchaResponse:m?.enabled?b.response:``,...n?{inviteCode:c.trim()}:{}}));r.user.active&&t(n?`欢迎，${r.user.username}！账号已创建。`:`欢迎回来，${r.user.username}！`),e(r.user)}catch(e){p(e.message),H.error(e.message),E()}finally{w.current=!1,d(!1)}}}return(0,$.jsxs)(`div`,{className:`auth-page`,children:[(0,$.jsxs)(`aside`,{className:`auth-story`,children:[(0,$.jsxs)(`a`,{className:`brand`,href:`/`,"aria-label":`返回首页`,children:[(0,$.jsx)(Ko,{}),(0,$.jsxs)(`span`,{className:`brand-text`,children:[`拾题`,(0,$.jsx)(`span`,{children:`把错题，学明白。`})]})]}),(0,$.jsxs)(`div`,{className:`auth-story-body`,children:[(0,$.jsxs)(`span`,{className:`small-pill`,children:[(0,$.jsx)($e,{size:16}),` 你的个人错题本`]}),(0,$.jsxs)(`h1`,{children:[`做错的题，`,(0,$.jsx)(`br`,{}),`值得再想一遍。`]}),(0,$.jsxs)(`p`,{children:[`记录卡住你的那一步，梳理知识点。`,(0,$.jsx)(`br`,{}),`再练一次，让「不熟」慢慢变成「掌握」。`]}),(0,$.jsxs)(`div`,{className:`auth-note`,children:[(0,$.jsxs)(`div`,{className:`auth-note-top`,children:[(0,$.jsxs)(`span`,{children:[(0,$.jsx)($e,{size:18}),` 我的学习笔记`]}),(0,$.jsx)(`span`,{className:`note-dots`,children:`•••`})]}),(0,$.jsx)(`div`,{className:`note-rule long`}),(0,$.jsx)(`div`,{className:`note-rule`}),(0,$.jsxs)(`div`,{className:`auth-note-bottom`,children:[(0,$.jsxs)(`span`,{children:[(0,$.jsx)(it,{size:17}),` 记录 · 整理 · 复习`]}),(0,$.jsx)(`span`,{className:`note-check`,children:(0,$.jsx)(it,{size:25})})]})]})]}),(0,$.jsx)(`div`,{className:`auth-story-footer`,children:`记录问题 · 理清思路 · 回顾练习`})]}),(0,$.jsx)(`main`,{className:`auth-form-area`,children:(0,$.jsxs)(`div`,{className:`auth-form-wrap`,children:[(0,$.jsx)(`div`,{className:`auth-icon`,children:(0,$.jsx)(Ye,{size:30})}),(0,$.jsx)(`h2`,{children:n?`开始积累，遇见进步`:`欢迎回来`}),(0,$.jsx)(`p`,{className:`auth-subtitle`,children:n?`使用邀请码创建账号，开启你的错题本。`:`登录后，继续整理你的学习收获。`}),(0,$.jsxs)(`form`,{onSubmit:D,children:[(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`用户名`}),(0,$.jsx)(`input`,{required:!0,autoComplete:`username`,minLength:3,maxLength:32,placeholder:`输入用户名`,value:i,onChange:e=>a(e.target.value)})]}),(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`密码`}),(0,$.jsx)(`input`,{required:!0,type:`password`,autoComplete:n?`new-password`:`current-password`,minLength:n?8:void 0,maxLength:128,placeholder:n?`至少 8 位密码`:`输入密码`,value:o,onChange:e=>s(e.target.value)})]}),n&&(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`邀请码`}),(0,$.jsx)(`input`,{required:!0,placeholder:`输入管理员提供的邀请码`,value:c,onChange:e=>l(e.target.value)}),(0,$.jsx)(`small`,{children:`邀请码由管理员生成。`})]}),!m&&(g?(0,$.jsxs)(`div`,{className:`auth-captcha-notice is-error`,role:`alert`,children:[(0,$.jsxs)(`span`,{children:[`安全配置加载失败：`,g]}),(0,$.jsx)(`button`,{type:`button`,onClick:()=>y(e=>e+1),children:`重新加载`})]}):(0,$.jsxs)(`div`,{className:`auth-captcha-loading`,role:`status`,children:[(0,$.jsx)(nt,{className:`spin`,size:16}),` 正在加载安全验证…`]})),m?.enabled&&(0,$.jsxs)(`div`,{className:`auth-captcha`,children:[(0,$.jsx)(os,{sitekey:m.sitekey,resetKey:S,onChange:x},`${n}-${S}`),(b.status===`error`||b.status===`expired`)&&(0,$.jsxs)(`div`,{className:`auth-captcha-notice`,role:`status`,children:[(0,$.jsx)(`span`,{children:b.status===`expired`?`验证已过期，请重新验证。`:n?`人机验证暂不可用，请重试后再注册。`:`人机验证暂不可用，你可以重试或尝试登录。`}),(0,$.jsx)(`button`,{type:`button`,disabled:u,onClick:E,children:`重新验证`})]})]}),f&&(0,$.jsx)(`div`,{className:`form-error`,role:`alert`,children:f}),(0,$.jsx)(`button`,{className:`button primary auth-submit`,disabled:u||!T,children:u?(0,$.jsx)(nt,{className:`spin`,size:18}):(0,$.jsxs)($.Fragment,{children:[n?`创建账号`:`登录`,(0,$.jsx)(We,{size:18})]})})]}),(0,$.jsxs)(`div`,{className:`auth-switch`,children:[n?`已有账号？`:`还没有账号？`,(0,$.jsx)(`button`,{disabled:u,onClick:()=>{w.current||(r(!n),p(``),E())},children:n?`立即登录`:`使用邀请码注册`})]}),(0,$.jsxs)(`div`,{className:`auth-secure`,children:[(0,$.jsx)(Ue,{size:15}),` 你的错题与笔记，仅对你可见`]})]})})]})}function fc(){let[e,t]=(0,Q.useState)(null),[n,r]=(0,Q.useState)(!0),[i,a]=(0,Q.useState)([]),[o,s]=(0,Q.useState)([]),[c,l]=(0,Q.useState)(``),[u,d]=(0,Q.useState)(!1),[f,p]=(0,Q.useState)(window.location.hash.slice(1)||`/mistakes`),[m,h]=(0,Q.useState)({session:0,recordId:null}),g=(0,Q.useRef)(null),_=(0,Q.useRef)(null),v=(0,Q.useRef)(!1);(0,Q.useEffect)(()=>{let e=!0,n=window.history.scrollRestoration;window.history.scrollRestoration=`manual`;let i=(window.location.hash.slice(1)||`/mistakes`).split(`?`)[0];Ya(`/auth/me`).then(n=>{e&&(n.user?.active&&[`/mistakes`,`/`].includes(i)&&(g.current=`欢迎回来，${n.user.username}！`),t(n.user))}).catch(()=>{e&&t(null)}).finally(()=>{e&&r(!1)});let a=e=>{let t=window.location.hash.slice(1)||`/mistakes`;if(!window.dispatchEvent(new CustomEvent(`mistakes:before-navigate`,{cancelable:!0,detail:{path:t}}))){window.history.replaceState(null,``,new URL(e.oldURL).hash||`#/mistakes`);return}let n=t.split(`?`)[0],r=new URL(e.oldURL||window.location.href).hash.slice(1)||`/mistakes`;lc(r)&&!lc(t)&&(_.current={path:r,x:window.scrollX,y:window.scrollY}),!lc(t)&&!/^\/mistakes\/\d+(\/edit)?$/.test(n)&&(_.current=null),h(e=>n===`/new`?{session:e.session+1,recordId:null}:e.recordId&&n!==`/mistakes/${e.recordId}/edit`?{...e,recordId:null}:e),p(t)};return window.addEventListener(`hashchange`,a),()=>{e=!1,window.removeEventListener(`hashchange`,a),window.history.scrollRestoration=n}},[]),(0,Q.useLayoutEffect)(()=>{let e=lc(f)?_.current:null;window.scrollTo({left:e?.x||0,top:e?.y||0,behavior:`instant`})},[f]);let y=(0,Q.useCallback)((e,t=`success`)=>{H[t](e)},[]);(0,Q.useEffect)(()=>{if(e?.active&&g.current){let e=g.current;g.current=null,y(e)}},[e,y]);let b=(0,Q.useCallback)(async()=>{try{let[e,t]=await Promise.all([Ya(`/subjects`),Ya(`/knowledge-points`)]);a(e),s(je(t,e)),l(``)}catch(e){l(e.message)}},[]);(0,Q.useEffect)(()=>{e?.active&&b()},[e,b]),(0,Q.useEffect)(()=>{if(!e?.active){d(!1);return}let t=!0,n=!1,r=0,i=async()=>{if(n||document.hidden)return;n=!0;let e=r;try{let n=await Ya(`/system/status`,{},{background:!0});t&&r===e&&d(n.readOnly)}catch{}finally{n=!1}},a=e=>{let t=e.detail;typeof t?.readOnly==`boolean`&&(r+=1,d(t.readOnly))},o=()=>{i()};window.addEventListener(`mistakes:backup-status`,a),window.addEventListener(`focus`,o),document.addEventListener(`visibilitychange`,o);let s=window.setInterval(()=>{i()},15e3);return i(),()=>{t=!1,window.clearInterval(s),window.removeEventListener(`mistakes:backup-status`,a),window.removeEventListener(`focus`,o),document.removeEventListener(`visibilitychange`,o)}},[e?.id,e?.active]),(0,Q.useEffect)(()=>{let e=()=>{g.current=null,t(e=>e&&{...e,active:!1}),window.location.hash=`/frozen`};return window.addEventListener(`mistakes:account-frozen`,e),()=>window.removeEventListener(`mistakes:account-frozen`,e)},[]);let x=(0,Q.useCallback)(async()=>{if(window.dispatchEvent(new Event(`mistakes:before-logout`,{cancelable:!0}))){window.dispatchEvent(new Event(`mistakes:session-ending`));try{await Ya(`/auth/logout`,io({})),y(`已退出登录。`),t(null),a([]),s([]),_.current=null,v.current=!1,window.location.hash=`/mistakes`}catch(e){window.dispatchEvent(new Event(`mistakes:session-resumed`)),y(e.message,`error`)}}},[y]),S=f.split(`?`)[0],C=S.match(/^\/mistakes\/(\d+)(\/edit)?$/),w=C&&_.current?_.current.path:`/mistakes`,T=lc(f);T?v.current=!0:C||(v.current=!1);let E=C?C[2]?`editor-page`:`detail`:xc[S]||`library`,D=C?`/mistakes`:S===`/page-imports`?`/new`:S,O=S===`/new`?m.recordId:C?.[2]?Number(C[1]):null,k;k=S===`/new`?(0,$.jsx)(mc,{onCreated:e=>h(t=>({...t,recordId:e}))},`new-${m.session}`):S===`/page-imports`?(0,$.jsx)(yc,{}):C?.[2]?(0,$.jsx)(mc,{id:Number(C[1])},m.recordId===Number(C[1])?`new-${m.session}`:S):C?(0,$.jsx)(hc,{id:Number(C[1])},f):S===`/review`?(0,$.jsx)(gc,{},f):S===`/stats`?(0,$.jsx)(_c,{}):S===`/ai-tasks`?(0,$.jsx)(bc,{}):S===`/settings`?(0,$.jsx)(vc,{}):T?null:(0,$.jsx)(pc,{}),k=(0,$.jsxs)(sc.Provider,{value:_.current?.path||null,children:[v.current&&(0,$.jsx)(`div`,{hidden:!T,children:(0,$.jsx)(pc,{active:T})},`library`),!T&&k]});let A=e&&!e.active?(0,$.jsx)(Xo,{user:e,logout:x}):e?(0,$.jsx)(me.Provider,{value:{user:e,updateUser:t,subjects:i,knowledgePoints:o,refreshDirectory:b,notify:y,logout:x},children:(0,$.jsx)(As,{children:(0,$.jsx)(Js,{children:(0,$.jsxs)(`div`,{className:`app-shell`,children:[(0,$.jsxs)(`aside`,{className:`sidebar`,children:[(0,$.jsxs)(`a`,{className:`brand`,href:`#${w}`,children:[(0,$.jsx)(Ko,{}),(0,$.jsxs)(`span`,{className:`brand-text`,children:[`拾题`,(0,$.jsx)(`span`,{children:`把错题，学明白。`})]})]}),(0,$.jsx)(`div`,{className:`sidebar-label`,children:`学习空间`}),(0,$.jsx)(Po,{value:D,ariaLabel:`主导航`,items:Sc.map(({path:e,label:t,icon:n})=>({id:e,href:`#${e===`/mistakes`?w:e}`,label:(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(n,{size:19,strokeWidth:1.8}),(0,$.jsx)(`span`,{children:t})]})}))}),(0,$.jsxs)(`div`,{className:`sidebar-bottom`,children:[(0,$.jsxs)(`div`,{className:`sidebar-reminder`,children:[(0,$.jsx)(`span`,{className:`reminder-icon`,children:(0,$.jsx)(Ge,{size:22})}),(0,$.jsx)(`strong`,{children:`温故而知新，可以为师矣`}),(0,$.jsx)(`a`,{href:`#/review`,children:`打开复习页`})]}),(0,$.jsxs)(`div`,{className:`account`,children:[(0,$.jsx)(Os,{className:`mobile-task-trigger`}),(0,$.jsxs)(`a`,{className:`account-profile`,href:`#/settings`,children:[(0,$.jsx)(`span`,{className:`avatar`,children:e.avatar?(0,$.jsx)(`img`,{src:e.avatar,alt:``}):e.username.slice(0,1).toUpperCase()}),(0,$.jsxs)(`span`,{className:`account-name`,children:[(0,$.jsx)(`strong`,{title:e.username,children:e.username}),(0,$.jsx)(`small`,{children:e.role===`admin`?`管理员`:`我的账号`})]})]}),(0,$.jsx)(`button`,{className:`icon-button`,title:`退出登录`,"aria-label":`退出登录`,onClick:x,children:(0,$.jsx)(tt,{size:17})})]})]})]}),(0,$.jsxs)(`div`,{className:`main-shell`,children:[(0,$.jsxs)(`header`,{className:`topbar`,children:[(0,$.jsxs)(`span`,{className:`topbar-label`,children:[(0,$.jsx)(Ze,{size:15}),` 个人学习空间`]}),(0,$.jsxs)(`div`,{className:`topbar-right`,children:[(0,$.jsx)(Os,{className:`desktop-task-trigger`}),(0,$.jsx)(`a`,{className:`topbar-avatar`,href:`#/settings`,"aria-label":`账号设置`,children:e.avatar?(0,$.jsx)(`img`,{src:e.avatar,alt:``}):e.username.slice(0,1).toUpperCase()})]})]}),(0,$.jsxs)(`main`,{className:`main-content`,children:[u&&(0,$.jsxs)(`div`,{className:`backup-readonly-banner`,role:`status`,children:[(0,$.jsx)(Ke,{size:20}),(0,$.jsxs)(`p`,{children:[(0,$.jsx)(`strong`,{children:`正在备份，暂时只读`}),(0,$.jsx)(`span`,{children:`已输入的内容会保留，请稍后重试保存。`})]})]}),c&&(0,$.jsxs)(`div`,{className:`inline-alert`,role:`alert`,children:[`基础目录加载失败：`,c,(0,$.jsx)(`button`,{onClick:b,children:`重试`})]}),(0,$.jsx)(ec,{path:f,editorId:O,skeletonKind:E,children:k}),(0,$.jsx)(`footer`,{className:`page-footer`,children:(0,$.jsxs)(`span`,{children:[`拾题 · © `,new Date().getFullYear(),` ShaoanC`]})})]})]})]})})},e.id)}):(0,$.jsx)(dc,{onLogin:e=>{t(e),p(e.active?`/mistakes`:`/frozen`),window.location.hash=e.active?`/mistakes`:`/frozen`},onNotify:e=>{g.current=e}});return(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(Mo,{}),(0,$.jsx)(Vo,{loading:n,kind:`shell`,className:`app-entrance`,children:!n&&A})]})}var Q,$,pc,mc,hc,gc,_c,vc,yc,bc,xc,Sc,Cc=t((()=>{Q=e(V()),kn(),ot(),ao(),P(),Go(),Jo(),Qo(),us(),zs(),Qs(),ac(),uc(),$=Je(),is(),pc=(0,Q.lazy)(()=>rs(()=>import(`./MistakesPage-DQXTfPLR.js`).then(e=>({default:e.MistakesPage})),__vite__mapDeps([24,1,3,4,5,16,9,10,6,17,18,8,11,19,25,26,27]))),mc=(0,Q.lazy)(()=>rs(()=>import(`./EditorPage-CejYDB9Q.js`).then(e=>({default:e.EditorPage})),__vite__mapDeps([21,1,3,4,5,8,9,10,6,11,19,7,12,13,14,22,20,23]))),hc=(0,Q.lazy)(()=>rs(()=>import(`./DetailPage-BTYU-rtL.js`).then(e=>({default:e.DetailPage})),__vite__mapDeps([15,1,3,4,5,16,9,10,6,17,18,8,11,19,20,13,14]))),gc=(0,Q.lazy)(()=>rs(()=>import(`./ReviewPage-4QUxfiDf.js`).then(e=>({default:e.ReviewPage})),__vite__mapDeps([28,1,3,4,5,8,9,10,6,11,19,27,17]))),_c=(0,Q.lazy)(()=>rs(()=>import(`./StatsPage-DwbVRf6C.js`).then(e=>({default:e.StatsPage})),__vite__mapDeps([29,1,3,4,5,30,10]))),vc=(0,Q.lazy)(()=>rs(()=>import(`./SettingsPage-DhSL9OPr.js`).then(e=>({default:e.SettingsPage})),__vite__mapDeps([31,1,3,4,5,9,10]))),yc=(0,Q.lazy)(()=>rs(()=>import(`./PageImports-ObUZFAfx.js`).then(e=>({default:e.PageImportsPage})),__vite__mapDeps([32,1,3,4,5,12,13,9,6,14,22,33]))),bc=(0,Q.lazy)(()=>rs(()=>import(`./AiTaskManager-D-0XbeAv.js`).then(e=>({default:e.AiTasksPage})),__vite__mapDeps([34,1,3,4,5,8,9,10,6,11,13,14,17,25,26]))),xc={"/new":`editor-page`,"/page-imports":`editor`,"/review":`review-page`,"/stats":`stats-page`,"/ai-tasks":`tasks-page`,"/settings":`settings-page`},Sc=[{path:`/mistakes`,label:`我的错题`,icon:ct},{path:`/new`,label:`录入错题`,icon:Xe},{path:`/review`,label:`复习`,icon:Ge},{path:`/stats`,label:`学习统计`,icon:et},{path:`/settings`,label:`设置`,icon:qe}]})),wc=t((()=>{})),Tc=t((()=>{})),Ec=t((()=>{})),Dc=t((()=>{}));n((()=>{var t=e(V()),n=e(I());Wa(),Cc(),Ae(),wc(),we(),Me(),Tc(),Ec();var r=Je();Dc(),n.createRoot(document.getElementById(`root`)).render((0,r.jsxs)(t.StrictMode,{children:[(0,r.jsx)(fc,{}),(0,r.jsx)(Va,{})]}))}))();export{La as A,oo as C,ao as D,Xa as E,pr as F,mr as I,kn as L,Ia as M,Ir as N,io as O,Pr as P,H as R,so as S,Ya as T,is as _,Qs as a,Go as b,Ns as c,Ps as d,Fs as f,rs as g,vs as h,cc as i,Ba as j,Za as k,Is as l,bs as m,uc as n,qs as o,Ds as p,lc as r,Ms as s,Dc as t,zs as u,Vo as v,ro as w,jo as x,No as y};