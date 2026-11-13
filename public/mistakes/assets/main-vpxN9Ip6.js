const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/sdk-LxJ6YTVI.js","assets/rolldown-runtime-8BhlS34s.js","assets/AiQuickPanel-qshByWxt.js","assets/body-fonts-B65LsYTj.js","assets/lucide-react-BK1UzKeB.js","assets/body-fonts-D2pN-qLK.css","assets/dialog-BBYUtc01.js","assets/editor-draft-J9dN7fbN.js","assets/MarkdownContent-O1h_SDwC.js","assets/ScrollArea-CMPedwjI.js","assets/components-Dq4BMxrf.js","assets/MarkdownContent-B_AG56q7.css","assets/ImageRegions-B8eaFSKc.js","assets/AiDialog-Dj28TniB.js","assets/AiDialog-DuIo2fG4.css","assets/DetailPage-DpwGRfOX.js","assets/export-selection-Dul8zyt6.js","assets/Select-SJKzRjtn.js","assets/export-selection-B9fFTg56.css","assets/StarRating-Dh8MLEIw.js","assets/ImageHistory-CTbKEO46.js","assets/EditorPage-zWyUnv_X.js","assets/photo-rotation-BMZRYkRY.js","assets/EditorPage-nW3thV_y.css","assets/MistakesPage-D7MZtmu-.js","assets/library-pagination-DLQr9GFi.js","assets/library-pagination-yghQomn8.css","assets/MistakeFilterFields-BDMZBsC8.js","assets/ReviewPage-C_imBrqO.js","assets/StatsPage-eQLYIG93.js","assets/clsx-DNZXw_RA.js","assets/SettingsPage-DX1f9ztq.js","assets/PageImports-D7gSSDXf.js","assets/PageImports-RKBO6lQU.css","assets/AiTaskManager-C8bDbxLc.js"])))=>i.map(i=>d[i]);
import{i as e,n as t,t as n}from"./rolldown-runtime-8BhlS34s.js";import{$ as r,A as i,B as a,Bt as o,C as s,D as c,Dt as l,F as u,Ft as d,G as f,Gt as p,Ht as m,I as h,It as g,J as _,Jt as v,Kt as y,Lt as b,M as x,P as S,Rt as C,S as w,Ut as T,V as E,Vt as D,W as O,Wt as k,X as A,Y as j,Yt as M,Z as N,_ as P,_n as ee,_t as te,a as F,an as ne,at as I,b as L,bn as R,c as re,cn as ie,ct as z,d as ae,dn as oe,et as se,f as ce,g as le,gn as B,gt as ue,h as de,ht as fe,i as pe,in as me,it as he,j as ge,jt as _e,kt as ve,l as ye,ln as be,lt as xe,m as Se,mt as V,n as Ce,nn as we,on as Te,p as Ee,q as De,qt as Oe,r as ke,s as Ae,t as je,tn as Me,u as Ne,un as Pe,v as Fe,vn as Ie,x as Le,xn as Re,y as ze,yn as Be,zt as Ve}from"./body-fonts-B65LsYTj.js";import{A as He,En as Ue,Fn as H,K as We,Kt as Ge,M as Ke,Pn as qe,Pt as Je,Q as Ye,Sn as Xe,en as Ze,f as Qe,ft as $e,gt as et,i as tt,in as nt,t as rt,w as it,wt as at}from"./lucide-react-BK1UzKeB.js";import{n as ot,t as st}from"./clsx-DNZXw_RA.js";function ct(e,t,n=300){let{scrollHeight:r,style:i}=e;requestAnimationFrame(()=>{i.minHeight=`initial`,i.height=r+`px`,i.transition=`all ${n}ms`,requestAnimationFrame(()=>{i.height=`0`,i.padding=`0`,i.margin=`0`,setTimeout(t,n)})})}function lt({enter:e,exit:t,appendPosition:n=!1,collapse:r=!0,collapseDuration:i=300}){return function({children:a,position:o,preventExitTransition:s,done:c,nodeRef:l,isIn:u,playToast:d}){let f=n?`${e}--${o}`:e,p=n?`${t}--${o}`:t,m=(0,Bt.useRef)(0);return(0,Bt.useLayoutEffect)(()=>{let e=l.current,t=f.split(` `),n=r=>{r.target===l.current&&(d(),e.removeEventListener(`animationend`,n),e.removeEventListener(`animationcancel`,n),m.current===0&&r.type!==`animationcancel`&&e.classList.remove(...t))};e.classList.add(...t),e.addEventListener(`animationend`,n),e.addEventListener(`animationcancel`,n)},[]),(0,Bt.useEffect)(()=>{let e=l.current,t=()=>{e.removeEventListener(`animationend`,t),r?ct(e,c,i):c()};u||(s?t():(m.current=1,e.className+=` ${p}`,e.addEventListener(`animationend`,t)))},[u]),Bt.createElement(Bt.Fragment,null,a)}}function ut(e,t){return{content:dt(e.content,e.props),containerId:e.props.containerId,id:e.props.toastId,theme:e.props.theme,type:e.props.type,data:e.props.data||{},isLoading:e.props.isLoading,icon:e.props.icon,reason:e.removalReason,status:t}}function dt(e,t,n=!1){return(0,Vt.isValidElement)(e)&&!Qt(e.type)?(0,Vt.cloneElement)(e,{closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):$t(e)?e({closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):e}function ft({closeToast:e,theme:t,ariaLabel:n=`close`}){return Ht.createElement(`button`,{className:`Toastify__close-button Toastify__close-button--${t}`,type:`button`,onClick:t=>{t.stopPropagation(),e(!0)},"aria-label":n},Ht.createElement(`svg`,{"aria-hidden":`true`,viewBox:`0 0 14 16`},Ht.createElement(`path`,{fillRule:`evenodd`,d:`M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z`})))}function pt({delay:e,isRunning:t,closeToast:n,type:r=`default`,hide:i,className:a,controlledProgress:o,progress:s,rtl:c,isIn:l,theme:u}){let d=i||o&&s===0,f={animationDuration:`${e}ms`,animationPlayState:t?`running`:`paused`};o&&(f.transform=`scaleX(${s})`);let p=st(`Toastify__progress-bar`,o?`Toastify__progress-bar--controlled`:`Toastify__progress-bar--animated`,`Toastify__progress-bar-theme--${u}`,`Toastify__progress-bar--${r}`,{"Toastify__progress-bar--rtl":c}),m=$t(a)?a({rtl:c,type:r,defaultClassName:p}):st(p,a),h={[o&&s>=1?`onTransitionEnd`:`onAnimationEnd`]:o&&s<1?null:()=>{l&&n()}};return Ut.createElement(`div`,{className:`Toastify__progress-bar--wrp`,"data-hidden":d},Ut.createElement(`div`,{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${u} Toastify__progress-bar--${r}`}),Ut.createElement(`div`,{role:`progressbar`,"aria-hidden":d?`true`:`false`,"aria-label":`notification timer`,"aria-valuenow":o?Math.round(s*100):void 0,"aria-valuemin":0,"aria-valuemax":100,className:m,style:f,...h}))}function mt(e,t,n){let r=1,i=0,a=[],o=[],s=t,c=new Map,l=new Set,u=e=>(l.add(e),()=>l.delete(e)),d=()=>{o=Array.from(c.values()),l.forEach(e=>e())},f=({containerId:t,toastId:n,updateId:r})=>{let i=t?t!==e:e!==1,a=c.has(n)&&r==null;return i||a},p=(e,t)=>{c.forEach(n=>{var r;(t==null||t===n.props.toastId)&&((r=n.toggle)==null||r.call(n,e))})},m=e=>{var t,r;e.isActive&&((r=(t=e.props)?.onClose)==null||r.call(t,e.removalReason),e.isActive=!1,n(ut(e,`removed`)))},h=e=>{if(e==null)c.forEach(m);else{let t=c.get(e);t&&m(t)}d()},g=()=>{i-=a.length,a=[]},_=e=>{var t,r;let{toastId:i,updateId:a}=e.props,o=a==null;e.staleId&&c.delete(e.staleId),e.isActive=!0,c.set(i,e),d(),n(ut(e,o?`added`:`updated`)),o&&((r=(t=e.props).onOpen)==null||r.call(t))};return{id:e,props:s,observe:u,toggle:p,removeToast:h,toasts:c,clearQueue:g,buildToast:(e,t)=>{if(f(t))return;let{toastId:n,updateId:o,data:l,staleId:u,delay:p}=t,m=o==null;m&&i++;let g={...s,style:s.toastStyle,key:r++,...Object.fromEntries(Object.entries(t).filter(([e,t])=>t!=null)),toastId:n,updateId:o,data:l,isIn:!1,className:tn(t.className||s.toastClassName),progressClassName:tn(t.progressClassName||s.progressClassName),autoClose:!t.isLoading&&nn(t.autoClose,s.autoClose),closeToast(e){let t=c.get(n);t&&(t.removalReason=e,h(n))},deleteToast(){if(c.get(n)!=null){if(c.delete(n),i--,i<0&&(i=0),a.length>0){_(a.shift());return}d()}}};g.closeButton=s.closeButton,t.closeButton===!1||rn(t.closeButton)?g.closeButton=t.closeButton:t.closeButton===!0&&(g.closeButton=!rn(s.closeButton)||s.closeButton);let v={content:e,props:g,staleId:u};s.limit&&s.limit>0&&i>s.limit&&m?a.push(v):Zt(p)?setTimeout(()=>{_(v)},p):_(v)},setProps(e){s=e},setToggle:(e,t)=>{let n=c.get(e);n&&(n.toggle=t)},isToastActive:e=>c.get(e)?.isActive,getSnapshot:()=>o}}function ht(){cn.forEach(e=>vt(e.content,e.options)),cn=[]}function gt(e,t){var n;if(t)return!!((n=sn.get(t))!=null&&n.isToastActive(e));let r=!1;return sn.forEach(t=>{t.isToastActive(e)&&(r=!0)}),r}function _t(e){if(!dn()){cn=cn.filter(t=>e!=null&&t.options.toastId!==e);return}if(e==null||en(e))sn.forEach(t=>{t.removeToast(e)});else if(e&&(`containerId`in e||`id`in e)){let t=sn.get(e.containerId);t?t.removeToast(e.id):sn.forEach(t=>{t.removeToast(e.id)})}}function vt(e,t){rn(e)&&(dn()||cn.push({content:e,options:t}),sn.forEach(n=>{n.buildToast(e,t)}))}function yt(e){var t;(t=sn.get(e.containerId||1))==null||t.setToggle(e.id,e.fn)}function bt(e,t){sn.forEach(n=>{(t==null||!(t!=null&&t.containerId)||t?.containerId===n.id)&&n.toggle(e,t?.id)})}function xt(e){let t=e.containerId||1;return{subscribe(n){let r=mt(t,e,un);sn.set(t,r);let i=r.observe(n);return ht(),()=>{i(),sn.delete(t)}},setProps(e){var n;(n=sn.get(t))==null||n.setProps(e)},getSnapshot(){return sn.get(t)?.getSnapshot()}}}function St(e){return ln.add(e),()=>{ln.delete(e)}}function Ct(e){return e&&(Qt(e.toastId)||Zt(e.toastId))?e.toastId:on()}function wt(e,t){return vt(e,t),t.toastId}function Tt(e,t){return{...t,type:t&&t.type||e,toastId:Ct(t)}}function Et(e){return(t,n)=>wt(t,Tt(e,n))}function U(e,t){return wt(e,Tt(`default`,t))}function Dt(e,{pending:t,error:n,success:r},i){let a;t&&(a=Qt(t)?U.loading(t,i):U.loading(t.render,{...i,...t}));let o={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},s=(e,t,n)=>{if(t==null){U.dismiss(a);return}let r={type:e,...o,...i,data:n},s=Qt(t)?{render:t}:t;return a?U.update(a,{...r,...s}):U(s.render,{...r,...s}),n},c=$t(e)?e():e;return c.then(e=>s(`success`,r,e)).catch(e=>s(`error`,n,e)),c}function Ot(e){_t(e)}function kt(e){let{subscribe:t,getSnapshot:n,setProps:r}=(0,Gt.useRef)(xt(e)).current;r(e);let i=(0,Gt.useSyncExternalStore)(t,n,n)?.slice();function a(t){if(!i)return[];let n=new Map;return e.newestOnTop&&i.reverse(),i.forEach(e=>{let{position:t}=e.props;n.has(t)||n.set(t,[]),n.get(t).push(e)}),Array.from(n,e=>t(e[0],e[1]))}return{getToastToRender:a,isToastActive:gt,count:i?.length}}function At(e){let[t,n]=(0,Kt.useState)(!1),[r,i]=(0,Kt.useState)(!1),a=(0,Kt.useRef)(null),o=(0,Kt.useRef)({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:s,pauseOnHover:c,closeToast:l,onClick:u,closeOnClick:d}=e;yt({id:e.toastId,containerId:e.containerId,fn:n}),(0,Kt.useEffect)(()=>{if(e.pauseOnFocusLoss)return f(),()=>{p()}},[e.pauseOnFocusLoss]);function f(){document.hasFocus()||_(),window.addEventListener(`focus`,g),window.addEventListener(`blur`,_)}function p(){window.removeEventListener(`focus`,g),window.removeEventListener(`blur`,_)}function m(t){if(e.draggable===!0||e.draggable===t.pointerType){v();let n=a.current;o.canCloseOnClick=!0,o.canDrag=!0,n.style.transition=`none`,e.draggableDirection===`x`?(o.start=t.clientX,o.removalDistance=n.offsetWidth*(e.draggablePercent/100)):(o.start=t.clientY,o.removalDistance=n.offsetHeight*(e.draggablePercent===80?e.draggablePercent*1.5:e.draggablePercent)/100)}}function h(t){let{top:n,bottom:r,left:i,right:o}=a.current.getBoundingClientRect();t.pointerType===`mouse`&&e.pauseOnHover&&t.clientX>=i&&t.clientX<=o&&t.clientY>=n&&t.clientY<=r?_():g()}function g(){n(!0)}function _(){n(!1)}function v(){o.didMove=!1,document.addEventListener(`pointermove`,b),document.addEventListener(`pointerup`,x)}function y(){document.removeEventListener(`pointermove`,b),document.removeEventListener(`pointerup`,x)}function b(n){let r=a.current;if(o.canDrag&&r){o.didMove=!0,t&&_(),e.draggableDirection===`x`?o.delta=n.clientX-o.start:o.delta=n.clientY-o.start,o.start!==n.clientX&&(o.canCloseOnClick=!1);let i=e.draggableDirection===`x`?`${o.delta}px, var(--y)`:`0, calc(${o.delta}px + var(--y))`;r.style.transform=`translate3d(${i},0)`,r.style.opacity=`${1-Math.abs(o.delta/o.removalDistance)}`}}function x(){y();let t=a.current;if(o.canDrag&&o.didMove&&t){if(o.canDrag=!1,Math.abs(o.delta)>o.removalDistance){i(!0),e.closeToast(!0),e.collapseAll();return}t.style.transition=`transform 0.2s, opacity 0.2s`,t.style.removeProperty(`transform`),t.style.removeProperty(`opacity`)}}let S={onPointerDown:m,onPointerUp:h};return s&&c&&(S.onMouseEnter=_,e.stacked||(S.onMouseLeave=g)),d&&(S.onClick=e=>{u&&u(e),o.canCloseOnClick&&l(!0)}),{playToast:g,pauseToast:_,isRunning:t,preventExitTransition:r,toastRef:a,eventHandlers:S}}function jt(e){return Yt.createElement(hn,{...e},Yt.createElement(`path`,{d:`M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z`}))}function Mt(e){return Yt.createElement(hn,{...e},Yt.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z`}))}function Nt(e){return Yt.createElement(hn,{...e},Yt.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z`}))}function Pt(e){return Yt.createElement(hn,{...e},Yt.createElement(`path`,{d:`M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z`}))}function Ft(){return Yt.createElement(`div`,{className:`Toastify__spinner`})}function It({theme:e,type:t,isLoading:n,icon:r}){let i=null,a={theme:e,type:t};return r===!1||($t(r)?i=r({...a,isLoading:n}):(0,Yt.isValidElement)(r)?i=(0,Yt.cloneElement)(r,a):n?i=gn.spinner():_n(t)&&(i=gn[t](a))),i}function Lt(e){let t={...Sn,...e},n=e.stacked,[r,i]=(0,Wt.useState)(!0),a=(0,Wt.useRef)(null),{getToastToRender:o,isToastActive:s,count:c}=kt(t),{className:l,style:u,rtl:d,containerId:f,hotKeys:p}=t;function m(e){let t=st(`Toastify__toast-container`,`Toastify__toast-container--${e}`,{"Toastify__toast-container--rtl":d});return $t(l)?l({position:e,rtl:d,defaultClassName:t}):st(t,tn(l))}function h(){n&&(i(!0),U.play())}return mn(()=>{if(n){let e=a.current.querySelectorAll(`[data-in="true"]`),n=t.position?.includes(`top`),i=0,o=0;Array.from(e).reverse().forEach((e,t)=>{let a=e;a.classList.add(`Toastify__toast--stacked`),t>0&&(a.dataset.collapsed=`${r}`),a.dataset.pos||(a.dataset.pos=n?`top`:`bot`);let s=i*(r?.2:1)+(r?0:12*t),c=Math.max(.5,1-(r?o:0));a.style.setProperty(`--y`,`${n?s:s*-1}px`),a.style.setProperty(`--g`,`12`),a.style.setProperty(`--s`,`${c}`),i+=a.offsetHeight,o+=.025})}},[r,c,n]),(0,Wt.useEffect)(()=>{function e(e){var t;let n=a.current;p(e)&&((t=n?.querySelector(`[tabIndex="0"]`))==null||t.focus(),i(!1),U.pause()),e.key===`Escape`&&(document.activeElement===n||n!=null&&n.contains(document.activeElement))&&(i(!0),U.play())}return document.addEventListener(`keydown`,e),()=>{document.removeEventListener(`keydown`,e)}},[p]),Wt.createElement(`section`,{ref:a,className:`Toastify`,id:f,onMouseEnter:()=>{n&&(i(!1),U.pause())},onMouseLeave:h,"aria-live":`polite`,"aria-atomic":`false`,"aria-relevant":`additions text`,"aria-label":t[`aria-label`]},o((e,t)=>{let r=t.length?{...u}:{...u,pointerEvents:`none`};return Wt.createElement(`div`,{tabIndex:-1,className:m(e),"data-stacked":n,style:r,key:`c-${e}`},t.map(({content:e,props:t})=>Wt.createElement(vn,{...t,stacked:n,collapseAll:h,isIn:s(t.toastId,t.containerId),key:`t-${t.key}`},e)))}))}function Rt(e){return Tn(Cn,e.nonce),Xt.createElement(Lt,{...e})}var zt,Bt,Vt,Ht,Ut,Wt,Gt,Kt,qt,Jt,Yt,Xt,Zt,Qt,$t,en,tn,nn,rn,an,on,sn,cn,ln,un,dn,fn,pn,mn,hn,gn,_n,vn,yn,bn,xn,Sn,Cn,wn,Tn,En=t((()=>{zt=e(H(),1),Bt=e(H(),1),Vt=e(H(),1),Ht=e(H(),1),Ut=e(H(),1),ot(),Wt=e(H(),1),Gt=e(H(),1),Kt=e(H(),1),qt=e(H(),1),Jt=e(H(),1),Yt=e(H(),1),Xt=e(H(),1),Zt=e=>typeof e==`number`&&!isNaN(e),Qt=e=>typeof e==`string`,$t=e=>typeof e==`function`,en=e=>Qt(e)||Zt(e),tn=e=>Qt(e)||$t(e)?e:null,nn=(e,t)=>e===!1||Zt(e)&&e>0?e:t,rn=e=>(0,zt.isValidElement)(e)||Qt(e)||$t(e)||Zt(e),an=1,on=()=>`${an++}`,sn=new Map,cn=[],ln=new Set,un=e=>ln.forEach(t=>t(e)),dn=()=>sn.size>0,fn=(e,{containerId:t})=>sn.get(t||1)?.toasts.get(e),pn=(e={})=>{sn.forEach(t=>{t.props.limit&&(!e.containerId||t.id===e.containerId)&&t.clearQueue()})},U.loading=(e,t)=>wt(e,Tt(`default`,{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...t})),U.promise=Dt,U.success=Et(`success`),U.info=Et(`info`),U.error=Et(`error`),U.warning=Et(`warning`),U.warn=U.warning,U.dark=(e,t)=>wt(e,Tt(`default`,{theme:`dark`,...t})),U.dismiss=Ot,U.clearWaitingQueue=pn,U.isActive=gt,U.update=(e,t={})=>{let n=fn(e,t);if(n){let{props:r,content:i}=n,a={delay:100,...r,...t,toastId:t.toastId||e,updateId:on()};a.toastId!==e&&(a.staleId=e);let o=a.render||i;delete a.render,wt(o,a)}},U.done=e=>{U.update(e,{progress:1})},U.onChange=St,U.play=e=>bt(!0,e),U.pause=e=>bt(!1,e),mn=typeof window<`u`?qt.useLayoutEffect:qt.useEffect,hn=({theme:e,type:t,isLoading:n,...r})=>Yt.createElement(`svg`,{viewBox:`0 0 24 24`,width:`100%`,height:`100%`,fill:e===`colored`?`currentColor`:`var(--toastify-icon-color-${t})`,...r}),gn={info:Mt,warning:jt,success:Nt,error:Pt,spinner:Ft},_n=e=>e in gn,vn=e=>{let{isRunning:t,preventExitTransition:n,toastRef:r,eventHandlers:i,playToast:a}=At(e),{closeButton:o,children:s,autoClose:c,onClick:l,type:u,hideProgressBar:d,closeToast:f,transition:p,position:m,className:h,style:g,progressClassName:_,updateId:v,role:y,progress:b,rtl:x,toastId:S,deleteToast:C,isIn:w,isLoading:T,closeOnClick:E,theme:D,ariaLabel:O}=e,k=st(`Toastify__toast`,`Toastify__toast-theme--${D}`,`Toastify__toast--${u}`,{"Toastify__toast--rtl":x},{"Toastify__toast--close-on-click":E}),A=$t(h)?h({rtl:x,position:m,type:u,defaultClassName:k}):st(k,h),j=It(e),M=!!b||!c,N={closeToast:f,type:u,theme:D},P=null;return o===!1||(P=$t(o)?o(N):(0,Jt.isValidElement)(o)?(0,Jt.cloneElement)(o,N):ft(N)),Jt.createElement(p,{isIn:w,done:C,position:m,preventExitTransition:n,nodeRef:r,playToast:a},Jt.createElement(`div`,{id:S,tabIndex:0,onClick:l,"data-in":w,className:A,...i,style:g,ref:r,...w&&{role:y,"aria-label":O}},j!=null&&Jt.createElement(`div`,{className:st(`Toastify__toast-icon`,{"Toastify--animate-icon Toastify__zoom-enter":!T})},j),dt(s,e,!t),P,!e.customProgressBar&&Jt.createElement(pt,{...v&&!M?{key:`p-${v}`}:{},rtl:x,theme:D,delay:c,isRunning:t,isIn:w,closeToast:f,hide:d,type:u,className:_,controlledProgress:M,progress:b||0})))},yn=(e,t=!1)=>({enter:`Toastify--animate Toastify__${e}-enter`,exit:`Toastify--animate Toastify__${e}-exit`,appendPosition:t}),bn=lt(yn(`bounce`,!0)),xn=lt(yn(`slide`,!0)),lt(yn(`zoom`)),lt(yn(`flip`)),Sn={position:`top-right`,transition:bn,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:`touch`,draggablePercent:80,draggableDirection:`x`,role:`alert`,theme:`light`,"aria-label":`Notifications Alt+T`,hotKeys:e=>e.altKey&&e.code===`KeyT`},Cn=`:root {
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
`,wn=new Map,Tn=(e,t)=>{mn(()=>{if(!e||typeof document>`u`)return;let n=document,r=wn.get(n);if(r){t&&r.setAttribute(`nonce`,t);return}let i=n.createElement(`style`);i.textContent=e,t&&i.setAttribute(`nonce`,t),n.head.appendChild(i),wn.set(n,i)},[t])}})),Dn,On,kn,An,jn,Mn,Nn,Pn=t((()=>{Dn=`--nested-drawers`,On=`--drawer-height`,kn=`--drawer-frontmost-height`,An=`--drawer-swipe-movement-x`,jn=`--drawer-swipe-movement-y`,Mn=`--drawer-snap-point-offset`,Nn=`--drawer-swipe-strength`})),Fn,In=t((()=>{Fn=`--drawer-swipe-progress`})),Ln,Rn,zn=t((()=>{Ln=e(H(),1),B(),me(),v(),Pn(),In(),Rn=Ln.forwardRef(function(e,t){let{render:n,className:r,style:i,forceRender:a=!1,...o}=e,s=ee(),c=s.useState(`open`),l=s.useState(`nested`),u=s.useState(`mounted`),d={open:c,transitionStatus:s.useState(`transitionStatus`)};return ne(`div`,e,{state:d,ref:[s.context.backdropRef,t],stateAttributesMapping:M,props:[{role:`presentation`,hidden:!u,style:{pointerEvents:c?void 0:`none`,userSelect:`none`,WebkitUserSelect:`none`,[Fn]:`0`,[Nn]:`1`}},o],enabled:a||!l})})})),Bn,Vn=t((()=>{fe(),Bn=V})),Hn,Un=t((()=>{Hn=`data-drawer-content`})),Wn,Gn,Kn=t((()=>{Wn=e(H(),1),B(),me(),Un(),Gn=Wn.forwardRef(function(e,t){let{render:n,className:r,style:i,...a}=e;return ee(),ne(`div`,e,{ref:t,props:[{[Hn]:``},a]})})})),qn,Jn=t((()=>{xe(),qn=z}));function Yn(){return Xn.useContext(Zn)}var Xn,Zn,Qn=t((()=>{Xn=e(H(),1),Zn=Xn.createContext(void 0)})),$n,er,tr,nr,rr,ir,ar=t((()=>{v(),$n=`data-expanded`,er=`data-nested-drawer-open`,tr=`data-nested-drawer-swiping`,nr=`data-swipe-dismiss`,rr=`data-swipe-direction`,ir=`data-swiping`}));function or(e){let t=sr.useContext(cr);if(e!==!0&&t===void 0)throw Error(Ie(90));return t}var sr,cr,lr=t((()=>{Be(),sr=e(H(),1),cr=sr.createContext(void 0)}));function ur(e,t=-(2**53-1),n=2**53-1){return Math.max(t,Math.min(e,n))}var dr=t((()=>{}));function fr(e,t){let n=e+t;return n>=0?t:-Math.sqrt(-n)-e}function pr(e,t,n){if(!Number.isFinite(t)||t<=0)return null;if(typeof e==`number`)return Number.isFinite(e)?e<=1?ur(e,0,1)*t:e:null;let r=e.trim();if(r.endsWith(`px`)){let e=Number.parseFloat(r);return Number.isFinite(e)?e:null}if(r.endsWith(`rem`)){let e=Number.parseFloat(r);return Number.isFinite(e)?e*n:null}return null}function mr(e,t){let n=-1,r=1/0;for(let i=0;i<e.length;i+=1){let a=Math.abs(e[i]-t);a<r&&(r=a,n=i)}return n}function hr(){let e=ee(),{snapPoints:t,activeSnapPoint:n,setActiveSnapPoint:r,popupHeight:i}=or(),a=e.useState(`viewportElement`),[s,c]=gr.useState(0),[l,u]=gr.useState(16),d=o(()=>{let e=g(a).documentElement;c(a?a.offsetHeight:e.clientHeight);let t=parseFloat(getComputedStyle(e).fontSize);Number.isFinite(t)&&u(t)});C(()=>{if(d(),!a||typeof ResizeObserver!=`function`)return;let e=new ResizeObserver(d);return e.observe(a),()=>{e.disconnect()}},[d,a]);let f=gr.useMemo(()=>{if(!t||t.length===0||s<=0||i<=0)return[];let e=Math.min(i,s),n=t.map(t=>{let n=pr(t,s,l);if(n===null)return null;let r=ur(n,0,e);return{value:t,height:r,offset:Math.max(0,i-r)}}).filter(e=>!!e);if(n.length<=1)return n;let r=[],a=[];for(let e=n.length-1;e>=0;--e){let t=n[e];a.some(e=>Math.abs(e-t.height)<=1)||(a.push(t.height),r.push(t))}return r.reverse(),r},[i,l,t,s]);return{snapPoints:t,activeSnapPoint:n,setActiveSnapPoint:r,popupHeight:i,viewportHeight:s,resolvedSnapPoints:f,activeSnapPointOffset:gr.useMemo(()=>{if(n===null)return;let e=f.find(e=>Object.is(e.value,n));if(e)return e;let t=Math.min(i,s),r=pr(n,s,l);if(r===null)return;let a=ur(r,0,t);return f[mr(f.map(e=>e.height),a)]},[n,i,f,l,s])?.offset??null}}var gr,_r=t((()=>{gr=e(H(),1),b(),Ve(),d(),dr(),B(),lr()}));function vr(){return yr.useContext(br)}var yr,br,xr=t((()=>{yr=e(H(),1),br=yr.createContext(null)}));function Sr(){Tr||=(typeof CSS<`u`&&`registerProperty`in CSS&&([An,jn,Mn].forEach(e=>{try{CSS.registerProperty({name:e,syntax:`<length>`,inherits:!1,initialValue:`0px`})}catch{}}),[{name:Fn,initialValue:`0`},{name:Nn,initialValue:`1`}].forEach(({name:e,initialValue:t})=>{try{CSS.registerProperty({name:e,syntax:`<number>`,inherits:!1,initialValue:t})}catch{}})),!0)}var Cr,wr,Tr,Er,Dr,Or=t((()=>{Cr=e(H(),1),b(),Ve(),oe(),Le(),B(),me(),v(),In(),Pn(),ar(),ze(),i(),Fe(),lr(),_r(),xr(),w(),wr=qe(),Tr=!1,Er={...M,expanded(e){return e?{[$n]:``}:null},nestedDrawerOpen(e){return e?{[er]:``}:null},nestedDrawerSwiping(e){return e?{[tr]:``}:null},swipeDirection(e){return{[rr]:e}},swiping(e){return e?{[ir]:``}:null}},Dr=Cr.forwardRef(function(e,t){let{render:n,className:r,style:i,finalFocus:a,initialFocus:s,...l}=e,u=ee(),d=u.context.popupRef,{swipeDirection:f,frontmostHeight:p,hasNestedDrawer:m,nestedSwiping:h,nestedSwipeProgressStore:g,onPopupHeightChange:_,notifyParentFrontmostHeight:v,notifyParentHasNestedDrawer:y}=or(),b=u.useState(`descriptionElementId`),S=u.useState(`disablePointerDismissal`),w=u.useState(`floatingRootContext`),T=u.useState(`popupProps`),E=u.useState(`modal`),D=u.useState(`mounted`),O=u.useState(`nested`),k=u.useState(`nestedOpenDrawerCount`),A=u.useState(`transitionStatus`),j=u.useState(`open`),M=u.useState(`openMethod`),N=u.useState(`titleElementId`),te=u.useState(`role`),F=w.useState(`floatingId`),I=l.id??F,R=vr();L();let{snapPoints:re,activeSnapPoint:ie,activeSnapPointOffset:z}=hr(),ae=k>0,oe=R?.swiping??!1,se=R?.swipeStrength??null,[ce,le]=Cr.useState(0),B=Cr.useRef(0),ue=o(()=>{let e=d.current;if(!e)return;let t=e.offsetHeight;if(B.current>0&&p>B.current&&t>B.current)return;if(B.current>0&&m){let e=B.current;le(e),_(e);return}let n=t;n!==B.current&&(B.current=n,le(n),_(n))});C(()=>{if(!D){B.current=0,le(0),_(0);return}let e=d.current;if(!e||(Sr(),ue(),typeof ResizeObserver!=`function`))return;let t=new ResizeObserver(ue);return t.observe(e),()=>{t.disconnect()}},[ue,D,ae,_,d]),C(()=>{let e=()=>{let e=d.current;if(!e)return;let t=g.getSnapshot();t>0?e.style.setProperty(Fn,`${t}`):e.style.setProperty(Fn,`0`)};e();let t=g.subscribe(e),n=d.current;return()=>{t(),n&&n.style.setProperty(Fn,`0`)}},[g,d]),C(()=>{if(j)return v?.(p),()=>{v?.(0)}},[p,j,v]),C(()=>{if(y)return y(j||A===`ending`),()=>{y(!1)}},[y,j,A]),ge({open:j,ref:d,onComplete(){j&&u.context.onOpenChangeComplete?.(!0)}});let de=s===void 0?d:s,fe=u.useStateSetter(`popupElement`),pe={open:j,nested:O,transitionStatus:A,expanded:ie===1,nestedDrawerOpen:ae,nestedDrawerSwiping:h,swipeDirection:f,swiping:oe},me;ce&&(m||A===`ending`)&&(me=`${ce}px`);let he=re&&re.length>0&&(f===`down`||f===`up`),_e=null;he&&z!==null&&(_e=f===`up`?-z:z);let ve=R?R.getDragStyles():be;if(he&&f===`down`){let e=z??0,t=Number.parseFloat(String(ve[jn]));ve=oe&&Number.isFinite(t)?{...ve,transform:void 0,[jn]:`${fr(e,t)}px`}:{...ve,transform:void 0}}let ye=ne(`div`,e,{state:pe,props:[T,{id:I,"aria-labelledby":N,"aria-describedby":b,role:te,...c,hidden:!D,onKeyDown(e){P.has(e.key)&&e.stopPropagation()},style:{...ve,[Fn]:`0`,[Dn]:k,[On]:me,[Mn]:typeof _e==`number`?`${_e}px`:`0px`,[kn]:p?`${p}px`:void 0,[Nn]:typeof se==`number`&&Number.isFinite(se)&&se>0?`${se}`:`1`}},l],ref:[t,d,fe],stateAttributesMapping:Er});return(0,wr.jsx)(x,{context:w,openInteractionType:M,disabled:!D,closeOnFocusOut:!S,initialFocus:de,returnFocus:a,modal:E!==!1,restoreFocus:`popup`,children:ye})})})),kr,Ar=t((()=>{le(),kr=de}));function jr({controlled:e,default:t,name:n,state:r=`value`}){let{current:i}=Mr.useRef(e!==void 0),[a,o]=Mr.useState(()=>t);return[i&&e!==void 0?e:a,Mr.useCallback(e=>{i||o(e)},[])]}var Mr,Nr=t((()=>{Mr=e(H(),1)}));function Pr(e){let{children:t,open:n,defaultOpen:r=!1,onOpenChange:i,onOpenChangeComplete:a,disablePointerDismissal:s=!1,modal:c=!0,actionsRef:l,handle:u,triggerId:d,defaultTriggerId:f=null,swipeDirection:p=`down`,snapToSequentialPoints:m=!1,snapPoints:h,snapPoint:g,defaultSnapPoint:_,onSnapPointChange:v}=e,y=or(!0),b=y?.onNestedSwipeProgressChange,x=y?.onNestedFrontmostHeightChange,S=y?.onNestedSwipingChange,C=y?.onNestedDrawerPresenceChange,[w,T]=Lr.useState(0),[E,D]=Lr.useState(0),[O,k]=Lr.useState(!1),[A,j]=Lr.useState(!1),[M]=Lr.useState(Fr),N=_===void 0?h?.[0]??null:_,P=g!==void 0,[ee,te]=jr({controlled:g,default:N,name:`Drawer`,state:`snapPoint`}),F=Lr.useRef(!1),ne=Lr.useRef(!1),I=o((e,t)=>{let n=t??ve(`none`);v?.(e,n),!n.isCanceled&&te(e)}),L=Lr.useMemo(()=>P||!h||h.length===0?ee:ee===null||!h.some(e=>Object.is(e,ee))?N:ee,[ee,P,N,h]),R=o(e=>{T(e),!F.current&&e>0&&D(e)}),re=o(e=>{if(e>0){F.current=!0,D(e);return}F.current=!1,w>0&&D(w)}),ie=o(e=>{k(e)}),z=o(e=>{M.set(e),b?.(e)}),ae=o(e=>{j(e),S?.(e)}),oe=o((e,t)=>{i?.(e,t),!t.isCanceled&&!e&&h&&h.length>0&&I(N,ve(t.reason,t.event,t.trigger))}),se=Lr.useMemo(()=>({swipeDirection:p,swipeAreaActiveRef:ne,snapToSequentialPoints:m,snapPoints:h,activeSnapPoint:L,setActiveSnapPoint:I,frontmostHeight:E,popupHeight:w,hasNestedDrawer:O,nestedSwiping:A,nestedSwipeProgressStore:M,onNestedDrawerPresenceChange:ie,onPopupHeightChange:R,onNestedFrontmostHeightChange:re,onNestedSwipingChange:ae,onNestedSwipeProgressChange:z,notifyParentFrontmostHeight:x,notifyParentSwipingChange:S,notifyParentSwipeProgressChange:b,notifyParentHasNestedDrawer:C}),[L,E,O,A,M,C,b,S,x,ie,re,z,ae,R,w,I,h,m,ne,p]),ce=typeof t==`function`?e=>(0,Rr.jsxs)(Lr.Fragment,{children:[zr||=(0,Rr.jsx)(Ir,{}),t(e)]}):(0,Rr.jsxs)(Lr.Fragment,{children:[Br||=(0,Rr.jsx)(Ir,{}),t]}),le=Se(`drawer`,{open:n,defaultOpen:r,onOpenChange:oe,onOpenChangeComplete:a,disablePointerDismissal:s,modal:c,actionsRef:l,handle:u,triggerId:d,defaultTriggerId:f,children:ce});return(0,Rr.jsx)(cr.Provider,{value:se,children:le})}function Fr(){let e=0,t=new Set;return{getSnapshot:()=>e,set(n){let r=Number.isFinite(n)?n:0;r!==e&&(e=r,t.forEach(e=>{e()}))},subscribe(e){return t.add(e),()=>{t.delete(e)}}}}function Ir(){let e=Yn(),t=ee(!1),n=e?.setDrawerOpen,r=e?.removeDrawer,i=t.useState(`open`),a=t.useState(`nestedOpenDialogCount`),o=t.useState(`popupElement`),s=a===0;return C(()=>{if(r)return()=>{r(t)}},[r,t]),C(()=>{n?.(t,i)},[i,n,t]),Lr.useEffect(()=>{if(!i||!s||!se)return;let e=T(o).CloseWatcher;if(!e)return;function n(e){if(!t.select(`open`))return;let n=ve(te,e);e.cancelable||(n.cancel=Pe),t.setOpen(!1,n),n.isCanceled&&e.preventDefault()}let r=new e,a=O(r,`cancel`,n);return()=>{a(),r.destroy()}},[t,s,i,o]),null}var Lr,Rr,zr,Br,Vr=t((()=>{Lr=e(H(),1),f(),oe(),Nr(),b(),Ve(),d(),r(),lr(),_e(),ue(),B(),Ee(),Qn(),Rr=qe()}));function Hr(e,t=!1){let{overflowY:n}=D(e);return n!==`auto`&&n!==`scroll`?!1:t?e.clientHeight>0:e.scrollHeight>e.clientHeight}function Ur(e,t=!1){let{overflowX:n}=D(e);return n!==`auto`&&n!==`scroll`?!1:t?e.clientWidth>0:e.scrollWidth>e.clientWidth}function Wr(e,t,n=!1){return t===`vertical`?Hr(e,n):Ur(e,n)}function Gr(e,t,n,r=!1){let i=e;for(;p(i)&&i!==t&&!Oe(i);){if(y(i)&&Wr(i,n,r))return i;i=m(i)}return null}function Kr(e,t,n=`vertical`,r=!1){return Gr(e,t,n,r)??(Wr(t,n,r)?t:null)}var qr=t((()=>{k()}));function Jr(e,t,n){return typeof e?.elementFromPoint==`function`?e.elementFromPoint(t,n):null}var Yr=t((()=>{}));function Xr(e,t){let n=(t??T(e).getComputedStyle(e)).transform,r=0,i=0,a=1;if(n&&n!==`none`){let e=n.match(/matrix(?:3d)?\(([^)]+)\)/);if(e){let t=e[1].split(`, `).map(parseFloat);t.length===6?(r=t[4],i=t[5],a=Math.sqrt(t[0]*t[0]+t[1]*t[1])):t.length===16&&(r=t[12],i=t[13],a=t[0])}}return{x:r,y:i,scale:a}}var Zr=t((()=>{d()}));function Qr(e,t,n){switch(e){case`up`:return-n;case`down`:return n;case`left`:return-t;case`right`:return t;default:return 0}}function $r(e){return Number.isFinite(e)&&e>0?e:null}function ei(e,t){return`translate3d(${e.x}px,${e.y}px,0) scale(${t})`}function ti(e){return e%2==1}function ni(e,t,n){let r=e[n];if(typeof r==`function`)try{r.call(e,t)}catch(e){if(e&&typeof e==`object`&&`name`in e&&e.name===`NotFoundError`)return;throw e}}function ri(e){let{enabled:t,directions:n,elementRef:r,movementCssVars:i,canStart:a,ignoreSelectorWhenTouch:s=!0,ignoreScrollableAncestors:c=!1,swipeThreshold:l,onDismiss:u,onProgress:d,onCancel:f,onSwipeStart:p,onRelease:m,onSwipingChange:h,trackDrag:_=!0}=e,v=ui,y=n.length===1?n[0]:void 0,b=Math.max(0,typeof l==`number`?l:ii),x=n.includes(`left`),S=n.includes(`right`),C=n.includes(`up`),w=n.includes(`down`),T=x||S,E=C||w,D=T?`horizontal`:`vertical`,[O,k]=W.useState(void 0),[M,P]=W.useState(!1),[ee,te]=W.useState(!1),F=W.useRef({x:0,y:0}),ne=W.useRef({x:0,y:0}),I=W.useRef(null),L=W.useRef({x:0,y:0,scale:1}),R=W.useRef(void 0),re=W.useRef(0),ie=W.useRef(!1),z=W.useRef({x:0,y:0}),ae=W.useRef(!1),oe=W.useRef(!1),se=W.useRef(null),ce=W.useRef(!1),le=W.useRef(!1),B=W.useRef({width:0,height:0}),ue=W.useRef(0),de=W.useRef(b),fe=W.useRef(null),pe=W.useRef(null),me=W.useRef(null),he=W.useRef(!1),ge=W.useRef({x:0,y:0}),_e=W.useRef(null),ve=W.useRef(!1),ye=W.useRef(null),be=o(e=>{ve.current!==e&&(ve.current=e,P(e),h?.(e))});function xe(e){if(!e)return;let t=r.current,n=fe.current;if(!t||!n)return;let i=n({element:t,direction:e});de.current=Math.max(0,i)}let Se=o((e,t)=>{let n=Number.isFinite(e)?ur(e,0,1):0,r=n!==ue.current,i=!1;if(t){let e=_e.current;i=!e||e.deltaX!==t.deltaX||e.deltaY!==t.deltaY||e.direction!==t.direction}(r||i)&&(ue.current=n,t?_e.current=t:r&&(_e.current=null),d?.(n,t))}),V=o(e=>{let t=r.current;if(!_||!t){e||(ye.current=null);return}let n=t.style,a=ye.current;e?(a||(ye.current=[n.transition,n.transform]),n.transition=`none`):a&&([n.transition,n.transform]=a,ye.current=null);let o=ne.current,s=L.current,c=o.x-s.x,l=o.y-s.y;e&&(n.transform=ei(o,s.scale)),n.setProperty(i.x,`${c}px`),n.setProperty(i.y,`${l}px`)});function Ce(e,t){if(t===null)return;let n=me.current;if(n&&t>n.time){let r=Math.abs(e.x-n.x)<li&&Math.abs(e.y-n.y)<li,i=r&&!he.current;if(he.current=r,i)return;let a=Math.max(t-n.time,si);ge.current={x:(e.x-n.x)/a,y:(e.y-n.y)/a}}me.current={x:e.x,y:e.y,time:t}}let we=W.useCallback(()=>{k(void 0),be(!1),te(!1),Se(0),de.current=b,fe.current=null,F.current={x:0,y:0},ne.current={x:0,y:0},L.current={x:0,y:0,scale:1},R.current=void 0,re.current=0,ie.current=!1,z.current={x:0,y:0},ae.current=!1,I.current=null,oe.current=!1,se.current=null,ce.current=!1,le.current=!1,B.current={width:0,height:0},pe.current=null,me.current=null,he.current=!1,ge.current={x:0,y:0},_e.current=null,V(!1)},[be,b,V,Se]);function Te(e){if(`touches`in e){let t=e.touches[0];return t?{x:t.clientX,y:t.clientY}:null}return{x:e.clientX,y:e.clientY}}function Ee(e){return`touches`in e||e.pointerType===`touch`}function De(e,t){let n=r.current?.getRootNode();return Jr(n,e.x,e.y)??N(t)}function Oe(e,t){return(n=>{let r=Kr(e,t,n),i=g(r);return r===i.body||r===i.documentElement?null:r})(D)}function ke(e,t,n){ce.current=!1;let i=Ee(e),a=De(t,e.nativeEvent),o=g(r.current).body,u=i&&o?Oe(a,o):null,d=n?.ignoreScrollableTarget??!1;if(u&&!d||(ce.current=!!(u&&d),j(a,v)&&(!i||s)))return!1;let f=r.current;if(c&&f&&a&&!(n?.ignoreScrollableAncestors??!1)&&Gr(a,f,D)!=null)return!1;if(ie.current=!1,R.current=void 0,re.current=0,F.current=t,pe.current=$r(e.timeStamp),me.current=null,he.current=!1,ge.current={x:0,y:0},z.current=t,I.current=t,de.current=b,fe.current=typeof l==`function`?l:null,f){B.current={width:f.offsetWidth,height:f.offsetHeight},xe(y);let t=Xr(f);L.current=t,ne.current={x:t.x,y:t.y},Ce({x:t.x,y:t.y},pe.current),`touches`in e||ni(f,e.pointerId,`setPointerCapture`)}return p?.(e.nativeEvent),be(!0),ae.current=!0,Se(0),V(!0),!0}function Ae(){je(),ce.current=!1,I.current=null}function je(){oe.current=!1,se.current=null}function Me(e){if(Ae(),!ve.current)return;be(!1);let t=L.current;ne.current={x:t.x,y:t.y},k(void 0),le.current=!1,V(!1);let n=r.current;n&&ni(n,e.pointerId,`releasePointerCapture`),Se(0,{deltaX:0,deltaY:0,direction:void 0}),f?.(e.nativeEvent)}function Ne(e,t){let n=e=>Math.sign(e)*Math.abs(e)**.5,r=(e,t,r)=>!t&&e<0||!r&&e>0?n(e):e;return{x:T?r(e,x,S):n(e),y:E?r(t,C,w):n(t)}}function Pe(e,t,n){let r=(e,t,n,r,i)=>e>0&&t<=0&&r||e<0&&t>=Math.max(0,n)&&i;return E&&n!==0?r(n,e.scrollTop,e.scrollHeight-e.clientHeight,w,C):T&&t!==0?r(t,e.scrollLeft,e.scrollWidth-e.clientWidth,S,x):null}let Fe=o(e=>{if(!t||e.defaultPrevented||e.nativeEvent.defaultPrevented||!(`touches`in e)&&e.button!==0)return;let n=Te(e);n&&(oe.current=!0,se.current=n,ce.current=!1,le.current=!(`touches`in e),(!a||a(n,{nativeEvent:e.nativeEvent,direction:y}))&&ke(e,n)&&je())});function Ie(e,n,r){if(!t||!ve.current)return;let i=N(e.nativeEvent);if(Ee(e)&&!ce.current){let t=e.currentTarget;if(Oe(i,t))return}if(`touches`in e||e.preventDefault(),ae.current&&(ae.current=!1,_)){F.current=n;let t=$r(e.timeStamp);t!==null&&(pe.current=t),me.current=null,he.current=!1}let a=n.x,o=n.y,s=r.x,c=r.y;(c<0&&o>z.current.y||c>0&&o<z.current.y)&&(z.current={x:z.current.x,y:o}),(s<0&&a>z.current.x||s>0&&a<z.current.x)&&(z.current={x:a,y:z.current.y});let l=a-F.current.x,u=o-F.current.y,d=o-z.current.y,f=a-z.current.x,p;if(!R.current)p=Math.abs(l)>=Math.abs(u)?l>0?`right`:`left`:u>0?`down`:`up`,p&&(p===`left`&&x||p===`right`&&S||p===`up`&&C||p===`down`&&w)&&(R.current=p,re.current=Qr(p,l,u),k(p),xe(p));else{let e=R.current,t=Qr(e,f,d);t>de.current?(ie.current=!1,k(e)):!(x&&S)&&!(C&&w)&&re.current-t>=ai&&(ie.current=!0)}let m=Ne(l,u),h=L.current.x,g=L.current.y;T&&(h+=m.x),E&&(g+=m.y);let v=ne.current,b=h!==v.x||g!==v.y;ne.current={x:h,y:g},b&&V(!0),Ce({x:h,y:g},$r(e.timeStamp));let D=h-L.current.x,O=g-L.current.y,A={deltaX:D,deltaY:O,direction:R.current},j=0,M=y??R.current;if(M){let e=M===`left`||M===`right`?B.current.width:B.current.height,t=L.current.scale||1,n=Qr(M,D,O);e>0&&t>0&&n>0&&(j=n/(e*t))}Se(j,A)}let Le=o(e=>{if(!t)return;let i=ne.current,a=L.current,o=i.x-a.x,s=i.y-a.y,c={deltaX:o,deltaY:s,direction:R.current};if(!ve.current){Ae(),Se(0,c);return}be(!1),Ae(),le.current=!1;let l=r.current;l&&(`touches`in e||ni(l,e.pointerId,`releasePointerCapture`));let d=o,f=s,p=pe.current,h=$r(e.timeStamp),g=p!==null&&h!==null&&h>p?h-p:0,_=g>0?Math.max(g,oi):0,v=_>0?d/_:0,b=_>0?f/_:0,x=ge.current.x,S=ge.current.y,C=me.current;if(C&&h!==null&&h>=C.time){let e=h-C.time;if(e<=ci){let t=Math.max(e,si),n=i.x-C.x,r=i.y-C.y,a=n/t,o=r/t;Math.abs(n)>=li&&(x=a),Math.abs(r)>=li&&(S=o)}else x=0,S=0}let w=m?.({event:e.nativeEvent,direction:R.current,deltaX:d,deltaY:f,velocityX:v,velocityY:b,releaseVelocityX:x,releaseVelocityY:S}),T=typeof w==`boolean`;if(ie.current&&!T){ne.current={x:a.x,y:a.y},k(void 0),V(!1),Se(0,c);return}let E=!1,D;if(T)E=w,D=R.current??y;else for(let e of n)if(Qr(e,d,f)>de.current){E=!0,D=e;break}E&&D?(k(D),te(!0),V(!1),u?.(e.nativeEvent,{direction:D})):(ne.current={x:a.x,y:a.y},k(void 0),V(!1),Se(0,c))}),Re=o(e=>{let t=Te(e);if(!t)return;let n=!1;if(!(`touches`in e)){let t=ti(e.buttons);if(t&&(le.current=!0),e.buttons!==0&&!t){Me(e);return}if(e.buttons===0&&le.current){if(!ve.current){Le(e);return}n=!0}}if(!M&&oe.current){if(!Ee(e)&&(e.defaultPrevented||e.nativeEvent.defaultPrevented)){Ae();return}if(!a||a(t,{nativeEvent:e.nativeEvent,direction:y})){let n=se.current,i=!1;if(Ee(e)){let a=r.current;if(n&&a){let r=De(t,e.nativeEvent),o=g(a).body,s=o?Oe(r,o):null;if(s&&(A(a,s)||A(s,a))){let e=Pe(s,t.x-n.x,t.y-n.y);if(e===!1)return;e===!0&&(i=!0)}}}ke(e,t,{ignoreScrollableTarget:i,ignoreScrollableAncestors:i})&&(n&&i?(je(),F.current=n,z.current=n,I.current=n,ae.current=!1):(je(),ce.current=!1))}}let i=I.current,o=i===null?{x:0,y:0}:{x:t.x-i.x,y:t.y-i.y};I.current=t,Ie(e,t,o),n&&!(`touches`in e)&&Le(e)}),ze=o((e,t)=>{Re({touches:e.touches,currentTarget:t,nativeEvent:e,defaultPrevented:e.defaultPrevented,timeStamp:e.timeStamp})}),Be=W.useCallback(()=>{let e=ve.current,t=ne.current,n=L.current,r=t.x-n.x,a=t.y-n.y;return!e&&r===0&&a===0&&!ee?{[i.x]:`0px`,[i.y]:`0px`}:{transition:e?`none`:void 0,transform:e?ei(t,n.scale):void 0,[i.x]:`${r}px`,[i.y]:`${a}px`}},[ee,i]);return{swiping:M,swipeDirection:O,dragDismissed:ee,getPointerProps:W.useCallback(()=>t?{onPointerDown:Fe,onPointerMove:Re,onPointerUp:Le,onPointerCancel:Le}:{},[t,Le,Re,Fe]),getTouchProps:W.useCallback(()=>t?{onTouchStart:Fe,onTouchMove:Re,onTouchEnd:Le,onTouchCancel:Le}:{},[t,Le,Re,Fe]),moveNative:ze,getDragStyles:Be,reset:we}}var W,ii,ai,oi,si,ci,li,ui,di=t((()=>{W=e(H(),1),dr(),Ve(),d(),s(),qr(),Yr(),Zr(),ii=40,ai=10,oi=50,si=4,ci=80,li=1,ui=`button,a,input,select,textarea,label,[role="button"]`})),fi,pi=t((()=>{ce(),fi=ae})),mi,hi,gi=t((()=>{mi=e(H(),1),me(),B(),ze(),Ne(),hi=mi.forwardRef(function(e,t){let{render:n,className:r,style:i,children:a,...o}=e,s=L(),c=ee(),l=c.useState(`open`),u=c.useState(`nested`),d=c.useState(`transitionStatus`),f=c.useState(`nestedOpenDialogCount`),p=c.useState(`mounted`),m=c.useStateSetter(`viewportElement`);return ne(`div`,e,{enabled:s||p,state:{open:l,nested:u,transitionStatus:d,nestedDialogOpen:f>0},ref:[t,m],stateAttributesMapping:ye,props:[{role:`presentation`,hidden:!p,style:{pointerEvents:l?void 0:`none`},children:a},o]})})})),_i,vi=t((()=>{v(),_i=`data-nested-dialog-open`}));function yi(){return bi.useContext(xi)}var bi,xi,Si=t((()=>{bi=e(H(),1),xi=bi.createContext(void 0)}));function Ci(e,t){e?.toggleAttribute(ir,t)}function wi(e){return!!j(e,u)}function Ti(e){return!!j(e,na)}function Ei(e,t){return t===`left`||t===`right`?e.offsetWidth:e.offsetHeight}function Di(e,t){return Math.max(Ei(e,t)*.5,Wi)}function Oi(e,t){return e instanceof t.HTMLInputElement&&e.type===`range`}function ki(e){return e.tagName===`INPUT`||e.tagName===`TEXTAREA`}function Ai(e,t){let n=p(e.anchorNode)?e.anchorNode:e.anchorNode?.parentElement,r=p(e.focusNode)?e.focusNode:e.focusNode?.parentElement;return e.containsNode(t,!0)||A(t,n)||A(t,r)}function ji(e,t){let n=_(e);if(n&&A(t,n)&&ki(n)){let{selectionStart:e,selectionEnd:t}=n;if(e!=null&&t!=null&&e<t)return!0}let r=e.getSelection?.();return!r||r.isCollapsed?!1:Ai(r,t)}function Mi(e,t){return e.composedPath().some(e=>Oi(e,t))}function Ni(e){return Mi(e.nativeEvent,T(e.currentTarget))}function Pi(e,t){e.lastX=t.clientX,e.lastY=t.clientY}function Fi(e,t,n,r){if(e.preserveNativeCrossAxisScroll)return!0;if(e.drawerAxisAttributed||e.allowSwipe===!0||!e.hasCrossAxisGestureTarget)return!1;if(!t.cancelable)return e.preserveNativeCrossAxisScroll=!0,!0;let i=r?n.clientY-e.startY:n.clientX-e.startX,a=r?n.clientX-e.startX:n.clientY-e.startY,o=Math.abs(i),s=Math.abs(a);return s>=ea&&s>o+ta?(e.preserveNativeCrossAxisScroll=!0,!0):o>=ea?(e.drawerAxisAttributed=!0,!1):!0}function Ii(e,t){return Li(e,t).max>0}function Li(e,t){if(t===`vertical`){let t=Math.max(0,e.scrollHeight-e.clientHeight);return{offset:e.scrollTop,max:t}}let n=Math.max(0,e.scrollWidth-e.clientWidth);return{offset:e.scrollLeft,max:n}}function Ri(e,t,n){let r=Bi(n,t),{offset:i,max:a}=Li(e,t);return r?i<=0:i>=a}function zi(e,t,n,r){return(Bi(n,t)?r>0:r<0)&&Ri(e,t,n)}function Bi(e,t){return t===`vertical`?e===`down`:e===`right`}var Vi,Hi,Ui,Wi,Gi,Ki,qi,Ji,Yi,Xi,Zi,Qi,$i,ea,ta,na,ra,ia,aa=t((()=>{Vi=e(H(),1),Hi=e(Re(),1),k(),f(),d(),a(),b(),Ve(),dr(),B(),gi(),vi(),Te(),lr(),_r(),Qn(),di(),Pn(),ar(),In(),Un(),ue(),_e(),s(),xr(),Me(),qr(),h(),Yr(),Si(),Ui=qe(),Wi=10,Gi=.5,Ki=.5,qi=300,Ji=4,Yi=.2,Xi=4,Zi=80,Qi=360,$i=.1,ea=6,ta=2,na=`[${Hn}]`,ra={horizontal:`[${S}="x"]`,vertical:`[${S}="y"]`},ia=Vi.forwardRef(function(e,t){let{render:n,className:r,style:i,children:a,...s}=e,c=ee(),d=c.context.popupRef,f=c.context.backdropRef,{swipeDirection:m,notifyParentSwipingChange:h,notifyParentSwipeProgressChange:_,frontmostHeight:v,snapToSequentialPoints:y,swipeAreaActiveRef:b}=or(),x=Yn(),{snapPoints:S,resolvedSnapPoints:w,activeSnapPoint:T,activeSnapPointOffset:D,setActiveSnapPoint:k,popupHeight:M}=hr(),P=c.useState(`open`),te=c.useState(`mounted`),F=c.useState(`nested`),ne=c.useState(`nestedOpenDrawerCount`),I=c.useState(`viewportElement`),L=c.useState(`popupElement`),R=x?.visualStateStore,re=ne>0,z=m===`left`||m===`right`?`horizontal`:`vertical`,ae=z===`vertical`,oe=ae?`horizontal`:`vertical`,[se,ce]=Vi.useState(null),le=Vi.useRef(void 0),B=Vi.useRef(null),ue=E(),de=Vi.useRef(!1),fe=Vi.useRef(!1),pe=Vi.useRef(``),me=Vi.useRef(!1),he=Vi.useRef(!1),ge=Vi.useRef(null),_e=yi(),ye=Vi.useMemo(()=>{if(!S||S.length<2||w.length<2||m!==`down`&&m!==`up`)return null;let e=w.map(e=>e.offset).sort((e,t)=>e-t),t=e[0];return{minOffset:t,range:e[1]-t}},[w,S,m]),be=Vi.useMemo(()=>!ye||D===null?null:ur((D-ye.minOffset)/ye.range,0,1),[D,ye]),xe=Vi.useMemo(()=>S&&S.length>0&&(m===`down`||m===`up`)?m===`down`?[`down`,`up`]:[`up`,`down`]:[m],[S,m]),Se=o(e=>{d.current?.toggleAttribute(nr,e),f.current?.toggleAttribute(nr,e)}),V=o(()=>{Se(!1),d.current?.removeAttribute(we),ce(null)}),Ce=o(()=>{fe.current&&(fe.current=!1,h?.(!1))}),Te=o((e,t,n)=>{let r=P&&!F&&t,i=r?e:0,a=P&&t?e:0;n&&_&&(_(a),a<=0&&Ce()),R?.set({swipeProgress:i,frontmostHeight:i>0?v:0});let o=f.current;if(!o)return;let s=r&&i>0;o.style.setProperty(Fn,s?`${i}`:`0`),s&&v>0?o.style.setProperty(On,`${v}px`):o.style.removeProperty(On)});function Ee(e,t,n,r,i,a,o,s){let c=Ei(e,t);if(c<=0)return null;let l=((t===`down`||t===`up`)&&S&&S.length>0?D??0:0)+Qr(t,n,r),u=Math.max(0,c-l);if(u<=0)return null;let d=Qr(t,o,s),f=Math.abs(d)>0?d:Qr(t,i,a);if(f<=Yi)return null;let p=(ur(u/ur(f,Yi,Xi),Zi,Qi)-Zi)/280;return $i+p*.9}function De(e){if(fe.current||!e)return;let t=Qr(e.direction??m,e.deltaX,e.deltaY);Math.abs(t)<Wi||(fe.current=!0,h?.(!0))}let Oe=ri({enabled:te&&!re,directions:xe,elementRef:c.context.popupRef,ignoreSelectorWhenTouch:!1,ignoreScrollableAncestors:!0,movementCssVars:{x:An,y:jn},onSwipeStart(e){if(`touches`in e||e.pointerType===`touch`)return;let t=d.current,n=g(t).getSelection?.();if(!n||n.isCollapsed)return;let r=p(n.anchorNode)?n.anchorNode:n.anchorNode?.parentElement,i=p(n.focusNode)?n.focusNode:n.focusNode?.parentElement;(A(t,r)||A(t,i))&&n.removeAllRanges()},onSwipingChange(e){de.current=e,Ci(c.context.backdropRef.current,e),!e&&!_&&Ce()},swipeThreshold({element:e,direction:t}){return Di(e,t)},canStart(e,t){let n=c.context.popupRef.current;if(!n)return!1;let r=t.nativeEvent,i=`touches`in r||r.pointerType===`touch`,a=i?ge.current:null,o=n.ownerDocument,s=Jr(n.getRootNode(),e.x,e.y);return!(!a?.startedInPopup&&!A(n,s)||i&&ji(o,n)||a?.hasCrossAxisGestureTarget&&!a.drawerAxisAttributed&&a.allowSwipe!==!0)},onProgress(e,t){let n=de.current;n&&De(t);let r=!!(S&&S.length>0);if(n&&m===`down`&&r&&t){let e=c.context.popupRef.current;e&&(e.style.removeProperty(`transform`),e.style.setProperty(jn,`${fr(D??0,t.deltaY)}px`))}let i=e;if(ye&&M>0){let e=D??ye.minOffset;n&&t&&Number.isFinite(t.deltaY)?i=(e=>ur((e-ye.minOffset)/ye.range,0,1))(ur(e+t.deltaY,0,M)):be!==null&&(i=be)}n||(_?.(0),Ce()),Te(i,!0,n)},onRelease({event:e,deltaX:t,deltaY:n,direction:r,velocityX:i,velocityY:a,releaseVelocityX:o,releaseVelocityY:s}){let u=c.context.popupRef.current;if(!u){V();return}let d=u;function f(e){Ce(),Se(!0),d.style.removeProperty(`transition`),d.setAttribute(we,``),Hi.flushSync(()=>{ce(Ee(d,e,t,n,i,a,o,s))})}if(!S||S.length===0){if(!r){V();return}let e=Qr(r,t,n);if(e<=0)return V(),!1;if(Qr(r,i,a)>=Gi)return f(r),!0;let o=e>Di(d,r);return o?f(r):V(),o}if(m!==`down`&&m!==`up`){V();return}if(!M)return V(),!1;if(w.length===0){V();return}let p=m===`down`?n:-n,h=Math.sign(p),g=m===`down`?s:-s,_=m===`down`?a:-a,v=g;if(h!==0&&Math.abs(p)>=Wi){let e=Math.sign(v);e!==0&&e!==h&&(v=_)}let b=D??0,x=ur(b+p,0,M),C=Math.abs(v)>=Ki?ur(v,-4,Ji)*qi:0,E=y?x:ur(x+C,0,M),O=ve(l,e),A=()=>(Te(0,!0,!0),V(),!1),j=e=>(k(e.value,O),A()),N=e=>r?(k(null,O),O.isCanceled?A():(le.current=T,f(m),!0)):j(e);if(y){let e=[...w].sort((e,t)=>e.offset-t.offset),t=e.map(e=>e.offset),n=mr(t,b),r=e[mr(t,E)],i=Math.sign(v),a=h!==0&&i!==0&&i===h&&Math.abs(v)>=Ki,o=E;if(a){let t=ur(n+h,0,e.length-1);if(t!==n){let n=e[t];(h>0?E<n.offset:E>n.offset)&&(r=n,o=n.offset)}else if(h>0)return N(r)}return Math.abs(o-M)<Math.abs(o-r.offset)?N(r):j(r)}let P=w[mr(w.map(e=>e.offset),E)];return v>=Gi&&p>0||Math.abs(E-M)<Math.abs(E-P.offset)?N(P):j(P)},onDismiss(e){R?.set({swipeProgress:0,frontmostHeight:0});let t=c.context.backdropRef.current;t&&(t.style.setProperty(Fn,`0`),t.style.removeProperty(On));let n=ve(l,e);if(c.setOpen(!1,n),n.isCanceled){let t=le.current;t!==void 0&&k(t,ve(l,e)),le.current=void 0,B.current?.(),V();return}if(c.select(`open`)){let t=e;ue.request(()=>{if(c.select(`open`)){let e=le.current;e!==void 0&&k(e,ve(l,t)),le.current=void 0,V(),B.current?.()}else le.current=void 0});return}le.current=void 0,Se(!0)}}),ke=Oe.getPointerProps(),Ae=Oe.getTouchProps(),{moveNative:je,reset:Me}=Oe;B.current=Me,Vi.useEffect(()=>{let e=I??L;if(!e||!P||!te)return;let t=e,n=g(t);function r(e,r,i){let a=ae?i.clientY-r.lastY:i.clientX-r.lastX;if(e.touches.length===2||ji(n,t)||re||Fi(r,e,i,ae))return;let o=r.scrollTarget;if(!o||o===n.documentElement||o===n.body){e.cancelable&&e.preventDefault(),e.stopPropagation(),je(e,t);return}if(!Ii(o,z)){e.cancelable&&e.preventDefault(),e.stopPropagation();return}if(a!==0){let t=zi(o,z,m,a);r.allowSwipe?e.cancelable&&e.preventDefault():e.cancelable&&t?(r.allowSwipe=!0,e.preventDefault()):r.allowSwipe=!1}r.allowSwipe===!0&&(e.stopPropagation(),je(e,t))}function i(e){if(_e?.onTouchMove(e),he.current)return;let t=ge.current,n=e.touches[0];n&&t&&(r(e,t,n),Pi(t,n))}return O(n,`touchmove`,i,{passive:!1,capture:!0})},[te,re,P,L,ae,z,m,je,I,_e]),C(()=>{ye&&!Oe.swiping&&Te(!P||F?0:be??0,!0,!1)},[Te,v,F,_,P,be,ye,Oe.swiping,c,R]),C(()=>{if(_)return P||_(0),()=>{_(0)}},[_,P]),C(()=>{P&&(b.current||Me(),V())},[V,P,Me,b]),C(()=>{let e=f.current;return()=>{R?.set({swipeProgress:0,frontmostHeight:0}),Ci(e,!1);let t=f.current;t!==e&&Ci(t,!1),Ce()}},[f,Ce,R]);let Ne=Vi.useMemo(()=>({swiping:Oe.swiping,getDragStyles:Oe.getDragStyles,swipeStrength:se??null,setSwipeDismissed:Se}),[Se,Oe.getDragStyles,Oe.swiping,se]);function Pe(e){he.current=e,ge.current=null}function Fe(){Pe(!1),pe.current=``,me.current=!1}function Ie(e){return pe.current=``,e.pointerType!==`touch`}return(0,Ui.jsx)(hi,{ref:t,className:r,style:i,render:n,...ie(s,{onPointerDown(e){if(pe.current=e.pointerType,me.current=e.pointerType===`pen`,!P||!te||re)return;let t=Jr(e.currentTarget.getRootNode(),e.clientX,e.clientY);wi(t)||Ti(t)||e.pointerType!==`touch`&&ke.onPointerDown?.(e)},onPointerMove(e){e.pointerType!==`touch`&&ke.onPointerMove?.(e)},onPointerUp(e){Ie(e)&&ke.onPointerUp?.(e)},onPointerCancel(e){Ie(e)&&ke.onPointerCancel?.(e)},onTouchStart(e){if(pe.current===`pen`&&me.current){me.current=!1,Pe(!1);return}if(!P||!te||re){Pe(!1);return}let t=e.touches[0];if(!t)return;if(Ni(e)){Pe(!1);return}let n=e.currentTarget,r=Jr(n.getRootNode(),t.clientX,t.clientY),i=N(e.nativeEvent),a=p(i)?i:n;if(!A(n,a)){Pe(!0);return}if(_e?.onTouchStart(e),j(r,`${u}:not(${ra[oe]})`)){Pe(!0);return}he.current=!1;let o=Kr(a,n,z),s=Kr(a,n,oe)!=null||j(r,ra[oe])!=null,c=null;o&&(c=Ri(o,z,m)?null:!1),ge.current={startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastY:t.clientY,startedInPopup:A(d.current,r),scrollTarget:o,hasCrossAxisGestureTarget:s,allowSwipe:c,preserveNativeCrossAxisScroll:!1,drawerAxisAttributed:!1},Ae.onTouchStart?.(e)},onTouchEnd(e){_e?.onTouchEnd(e),Fe(),Ae.onTouchEnd?.(e)},onTouchCancel(e){_e?.onTouchCancel(),Fe(),Ae.onTouchCancel?.(e)},[_i]:void 0}),children:(0,Ui.jsx)(br.Provider,{value:Ne,children:a})})})})),oa,sa=t((()=>{oa=`--drawer-keyboard-inset`}));function ca(e){let{children:t}=e,n=ee(),r=n.useState(`open`),i=n.useState(`mounted`),a=n.useState(`modal`),s=n.useState(`nestedOpenDialogCount`),c=n.useState(`viewportElement`),l=s>0,u=va.useRef(!1),d=va.useRef(null),f=va.useRef(null),p=va.useRef(null),m=va.useRef(!1),h=va.useRef(null),v=E(),y=I(),b=o(()=>{let e=p.current;e&&(e.element.style.overflowAnchor=e.overflowAnchor,e.element.style.paddingBottom=e.paddingBottom,e.element.style.scrollPaddingBottom=e.scrollPaddingBottom,p.current=null)}),x=o((e,t)=>{let n=Math.max(0,Math.ceil(t)),r=p.current;if(r&&!r.element.isConnected&&(b(),r=null),n===0){b();return}if(r&&r.element!==e&&(b(),r=null),!r){let t=D(e);r={element:e,overflowAnchor:e.style.overflowAnchor,paddingBottom:e.style.paddingBottom,scrollPaddingBottom:e.style.scrollPaddingBottom,computedPaddingBottom:Number.parseFloat(t.paddingBottom)||0,computedScrollPaddingBottom:Number.parseFloat(t.scrollPaddingBottom)||0},p.current=r}e.style.overflowAnchor=`none`,e.style.paddingBottom=`${n+Math.max(r.computedPaddingBottom,xa)}px`,e.style.scrollPaddingBottom=`${r.computedScrollPaddingBottom+xa}px`}),S=o((e,t)=>{let n=T(e).matchMedia?.(`(prefers-reduced-motion: reduce)`)?.matches?`auto`:`smooth`;e.scrollTo({top:t,behavior:n})}),C=o(()=>{u.current=!1,d.current=null});va.useEffect(()=>{if(!i||!r){f.current=null,b(),v.cancel();return}if(!c){b();return}let e=g(c),t=T(c),n=t.visualViewport,o=null,s=0,u=0,d=-1,p=-1,C=null,w=()=>{if(!n||n.scale!==1)return null;let r=t.innerHeight,i=n.height;if(r-i>ba)p=i;else if(Math.abs(i-p)>ba)return p=-1,null;C||(C=e.createElement(`div`),C.style.cssText=`position:fixed;top:0;height:100svh;visibility:hidden`,e.body.appendChild(C));let a=C.offsetHeight-i<=ba,o=Math.max(0,n.offsetTop);return{top:o,bottom:a?r:Math.min(r,o+i),resizing:a&&Math.abs(r-i)>=1}};h.current=w;let E=e=>{c.style.setProperty(oa,`${Math.max(0,Math.ceil(e))}px`)},D=t.scrollX,k=t.scrollY,j=()=>a!==!0||l||!f.current||t.scrollX===D&&t.scrollY===k||w()==null?!1:(t.scrollTo({left:D,top:k,behavior:`instant`}),!0),M=null,P=()=>{M?.(),M=null},ee=(e,t)=>{P();let n=e.getBoundingClientRect();M=ga(e,(t.top+t.bottom-n.top-n.bottom)/2)},te=()=>{P();let e=f.current;if(l||!e||!A(c,e)){E(0),b();return}j();let n=w();if(!n){E(0),b();return}E(Math.max(0,t.innerHeight-n.bottom));let r=_a(e,c);if(!r){b();return}let i=r.getBoundingClientRect(),a=Math.min(i.bottom,n.bottom),p=Math.max(0,i.bottom-n.bottom);x(r,p);let m=Math.max(0,r.scrollHeight-r.clientHeight);if(m<=0)return;let h=Math.max(i.top,n.top)+xa,g=a-xa;if(g<=h)return;let _=e.getBoundingClientRect(),y=r.scrollTop+(_.top+_.bottom-h-g)/2,C=Math.round(ur(y,0,m));if(!(o===r&&!n.resizing&&Math.abs(s-C)<=1)){let e=o===r?u+1:1;if(o=r,s=C,u=e,d=-1,e<=wa){v.request(te);return}}else if(d>=0){let e=r.scrollTop;if(Math.abs(e-C)<=1)return;if(e!==d){d=e;return}}o=r,s=C,u=0,d=r.scrollTop,S(r,C)},F=()=>{v.request(te)},ne=()=>{let e=Ca,t=()=>{te(),--e,e>0&&y.start(Sa,t)};y.start(Sa,t)},I=()=>{f.current=null,p=-1,y.clear(),F()},L=e=>{if(l)return!1;let t=ua(e);return!t||!A(c,t)?!1:(f.current!==t&&(o=null),f.current=t,!0)},R=e=>{let t=f.current;M&&t&&t===N(e)&&t.focus({preventScroll:!0})},re=e=>{if(m.current=!1,P(),!L(N(e))){I();return}w()!=null&&ne(),F()},ie=e=>{if(!m.current){if(L(e.relatedTarget)){let e=f.current,t=w();e&&t&&ee(e,t),F();return}I()}},z=()=>{(f.current||L(_(e)))&&F()},ae=[];return n&&ae.push(O(n,`resize`,z),O(n,`scroll`,z),O(t,`resize`,z)),ae.push(O(e,`focus`,R,!0),O(e,`focusin`,re,!0),O(e,`focusout`,ie,!0),O(t,`scroll`,()=>{j()&&F()}),O(e,`pointerdown`,()=>{f.current&&v.cancel(),y.clear(),o=null},!0)),L(_(e))&&F(),()=>{ae.forEach(e=>e()),P(),f.current=null,b(),v.cancel(),y.clear(),h.current=null,C?.remove(),c.style.removeProperty(oa)}},[S,v,y,a,i,l,r,b,c,x]);let w=o(e=>{let t=e.touches[0];u.current=!1,d.current={x:t.clientX,y:t.clientY}}),k=o(e=>{let t=e.touches[0],n=d.current;t&&n&&!u.current&&(Math.abs(t.clientX-n.x)>Ta||Math.abs(t.clientY-n.y)>Ta)&&(u.current=!0)}),j=o(e=>{if(!r||!i||l||!c||!d.current||u.current){C();return}let t=e.changedTouches[0]??e.touches[0],n=c.getRootNode(),a=N(e.nativeEvent),o=t?pa(n,t.clientX,t.clientY):null;if(o===Oa){C();return}let s=t&&(o??da(a));if(s&&(!A(c,s.focusTarget)||!A(c,s.clickTarget))){C();return}if(s){let{clickTarget:n,focusTarget:r}=s,i=T(r);if(i.visualViewport&&i.visualViewport.scale!==1){C();return}if(_(g(r))===r&&(!i.visualViewport||h.current?.()!=null)){C();return}e.preventDefault(),m.current=!0;try{ha(r)}finally{m.current=!1}ma(n,t),n!==r&&_(g(r))===r&&r.focus({preventScroll:!0}),C();return}C()}),M=va.useMemo(()=>({onTouchStart:w,onTouchMove:k,onTouchEnd:j,onTouchCancel:C}),[j,k,w,C]);return(0,ya.jsx)(xi.Provider,{value:M,children:t})}function la(e){if(e.isContentEditable)return!0;let t=T(e);return e instanceof t.HTMLTextAreaElement||e instanceof t.HTMLInputElement&&Da.has(e.type)?!e.matches(`:disabled`):!1}function ua(e){if(!y(e))return null;if(la(e))return e.isContentEditable?fa(e):e;let t=j(e,`label`)?.control??null;return y(t)&&la(t)?t:null}function da(e){if(!y(e))return null;let t=ua(e);return t?{focusTarget:t,clickTarget:e}:null}function fa(e){let t=e;for(;t.parentElement?.isContentEditable;)t=t.parentElement;return t}function pa(e,t,n){let r=Jr(e,t,n);if(y(r)){let e=ua(r);if(e)return{focusTarget:e,clickTarget:r}}if(De(r)||j(r,`label`)!=null)return Oa;for(let[r,i]of[[0,Ea],[0,-16],[Ea,0],[-16,0]]){let a=ua(Jr(e,t+r,n+i));if(a)return{focusTarget:a,clickTarget:a}}return null}function ma(e,t){let n=T(e),r=n.PointerEvent??n.MouseEvent;e.dispatchEvent(new r(`click`,{bubbles:!0,cancelable:!0,clientX:t.clientX,clientY:t.clientY,detail:1,view:n}))}function ha(e){let t=_(g(e))===e,n=ga(e,-2e3);try{t&&e.blur(),e.focus({preventScroll:!0})}finally{n()}}function ga(e,t){let n=e.style.opacity,r=e.style.transform,i=e.style.transition;return e.style.transition=`none`,e.style.opacity=`0`,e.style.transform=`translateY(${t}px)`,()=>{e.style.opacity=n,e.style.transform=r,e.style.transition=i}}function _a(e,t){let n=m(e);return Kr(n,t,`vertical`)??Kr(n,t,`vertical`,!0)}var va,ya,ba,xa,Sa,Ca,wa,Ta,Ea,Da,Oa,ka=t((()=>{va=e(H(),1),k(),f(),d(),a(),Ve(),dr(),he(),B(),s(),qr(),Yr(),sa(),Si(),ya=qe(),ba=60,xa=16,Sa=150,Ca=4,wa=60,Ta=10,Ea=16,Da=new Set([`email`,`number`,`password`,`search`,`tel`,`text`,`url`]),Oa=Symbol(`KeyboardTapBlocked`)})),Aa=t((()=>{zn(),Vn(),Kn(),Jn(),Qn(),In(),Pn(),Or(),Ar(),Vr(),di(),Zr(),ar(),lr(),pi(),aa(),ka()})),ja=t((()=>{Aa(),In(),Pn(),ar(),sa()})),Ma=t((()=>{}));function Na(){let[e,t]=(0,Fa.useState)(()=>window.matchMedia(`(max-width: 640px)`).matches);return(0,Fa.useEffect)(()=>{let e=window.matchMedia(`(max-width: 640px)`),n=()=>t(e.matches);return e.addEventListener(`change`,n),()=>e.removeEventListener(`change`,n)},[]),e}function Pa({open:e,onOpenChange:t,onOpenChangeComplete:n,title:r,description:i,closeLabel:a=`关闭`,triggerRef:o,className:s=``,footer:c,children:l}){let[u,d]=(0,Fa.useState)(!1),[f,p]=(0,Fa.useState)(null),m=(0,Fa.useRef)(null);return(0,Fa.useEffect)(()=>d(!0),[]),(0,Ia.jsx)(Pr,{open:u&&e,onOpenChange:t,onOpenChangeComplete:n,modal:!0,swipeDirection:`down`,children:(0,Ia.jsx)(ca,{children:(0,Ia.jsxs)(kr,{children:[(0,Ia.jsx)(Rn,{className:`mobile-filters-backdrop`}),(0,Ia.jsx)(ia,{className:`mobile-filters-viewport`,children:(0,Ia.jsxs)(Dr,{ref:p,className:`mobile-filters-popup mobile-drawer-popup ${s}`.trim(),initialFocus:m,finalFocus:o,children:[(0,Ia.jsx)(`div`,{className:`mobile-filters-drag-area`,"aria-hidden":`true`,children:(0,Ia.jsx)(`span`,{className:`mobile-filters-handle`})}),(0,Ia.jsxs)(`header`,{className:`mobile-filters-heading`,"data-base-ui-swipe-ignore":!0,children:[(0,Ia.jsxs)(`div`,{children:[(0,Ia.jsx)(fi,{className:`mobile-filters-title`,children:r}),i&&(0,Ia.jsx)(qn,{className:`mobile-filters-description`,children:i})]}),(0,Ia.jsx)(Bn,{ref:m,className:`icon-button mobile-filters-close`,"aria-label":a,children:(0,Ia.jsx)(tt,{size:20})})]}),(0,Ia.jsx)(Gn,{className:`mobile-filters-content scroll-area scroll-area--vertical`,"data-base-ui-swipe-ignore":!0,children:l(f)}),c&&(0,Ia.jsx)(`footer`,{className:`mobile-filters-footer`,"data-base-ui-swipe-ignore":!0,children:c})]})})]})})})}var Fa,Ia,La=t((()=>{Fa=e(H()),ja(),rt(),Ma(),Ia=qe()}));function Ra(){let e=Na();return(0,za.useEffect)(()=>{let e=()=>{let e=document.querySelector(window.matchMedia(`(max-width: 960px)`).matches?`.sidebar`:`.topbar`)?.getBoundingClientRect().bottom||0;document.documentElement.style.setProperty(`--workspace-header-bottom`,`${Math.max(0,e)}px`)},t=new ResizeObserver(e),n=[],r=()=>{let r=[...document.querySelectorAll(`.sidebar, .topbar`)];(r.length!==n.length||r.some((e,t)=>e!==n[t]))&&(t.disconnect(),r.forEach(e=>t.observe(e)),n=r),e()},i=new MutationObserver(r);return i.observe(document.getElementById(`root`),{childList:!0,subtree:!0}),window.addEventListener(`resize`,e),r(),()=>{t.disconnect(),i.disconnect(),window.removeEventListener(`resize`,e)}},[]),(0,Ba.jsx)(Rt,{className:`mistakes-toast-container`,position:`top-right`,autoClose:4500,transition:xn,theme:`light`,limit:e?1:3,newestOnTop:!0,closeOnClick:!1,draggablePercent:15})}var za,Ba,Va=t((()=>{za=e(H()),En(),La(),Ba=qe()}));function Ha(e){return $a.add(e),()=>{$a.delete(e)}}function Ua(){return Xa}function Wa(){return Qa}function Ga(e){e>0&&Xa===0&&(Za+=1),Xa+=e,Qa={pending:Xa,cycle:Za},$a.forEach(e=>e())}async function Ka(e,t={},n={}){n.background||Ga(1);try{let n=await fetch(`${Ya}${e}`,{...t,credentials:`same-origin`,headers:{...t.body instanceof FormData?{}:{"Content-Type":`application/json`},...t.headers}}),r=await n.json().catch(e=>{if(e instanceof SyntaxError)return null;throw e});if(!n.ok||!r?.success)throw r?.code===`BACKUP_READ_ONLY`&&window.dispatchEvent(new CustomEvent(`mistakes:backup-status`,{detail:{readOnly:!0}})),new eo(r?.message||`请求失败，请稍后重试。`,n.status,r?.code);return t.method&&t.method!==`GET`&&window.dispatchEvent(new Event(`mistakes:updated`)),r.data}finally{n.background||Ga(-1)}}function qa(e,t=!1){let n=new Date(e);return Number.isNaN(n.getTime())?`—`:new Intl.DateTimeFormat(`zh-CN`,t?{month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`}:{year:`numeric`,month:`2-digit`,day:`2-digit`}).format(n)}function Ja(e){window.location.hash=e}var Ya,Xa,Za,Qa,$a,eo,to,no=t((()=>{Ya=`/api/mistakes`,Xa=0,Za=0,Qa={pending:0,cycle:0},$a=new Set,eo=class extends Error{status;code;constructor(e,t,n){super(e),this.status=t,this.code=n}},to=(e,t=`POST`)=>({method:t,body:JSON.stringify(e)})})),ro=t((()=>{})),io=t((()=>{})),ao=t((()=>{}));function G({children:e}){return(0,K.jsx)(`span`,{className:`skeleton-text skeleton-shimmer`,children:e})}function oo({children:e=`保存设置`}){return(0,K.jsx)(`span`,{className:`button skeleton-button`,children:(0,K.jsx)(G,{children:e})})}function so({label:e}){return(0,K.jsxs)(`div`,{className:`field`,children:[(0,K.jsx)(`span`,{children:(0,K.jsx)(G,{children:e})}),(0,K.jsx)(`div`,{className:`skeleton-form-control skeleton-shimmer`,children:(0,K.jsx)(`input`,{disabled:!0,tabIndex:-1})})]})}function co({title:e,description:t}){return(0,K.jsxs)(`div`,{className:`panel-title`,children:[(0,K.jsx)(`span`,{className:`panel-title-icon`,children:(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`})}),(0,K.jsxs)(`div`,{children:[(0,K.jsx)(`h2`,{children:(0,K.jsx)(G,{children:e})}),t&&(0,K.jsx)(`p`,{children:(0,K.jsx)(G,{children:t})})]})]})}function lo({title:e,action:t,description:n}){return(0,K.jsxs)(`div`,{className:`page-header`,children:[(0,K.jsxs)(`div`,{children:[(0,K.jsx)(`h1`,{children:(0,K.jsx)(G,{children:e})}),n&&(0,K.jsx)(`p`,{children:(0,K.jsx)(G,{children:n})})]}),t&&(0,K.jsx)(`div`,{className:`page-header-action`,children:(0,K.jsx)(oo,{children:t})})]})}function uo(){return(0,K.jsxs)(K.Fragment,{children:[(0,K.jsxs)(`div`,{className:`stats-grid stats-chart-grid`,children:[(0,K.jsxs)(`section`,{className:`panel stats-chart-panel`,children:[(0,K.jsx)(co,{title:`学科分布`,description:`各学科已归档错题的数量。`}),(0,K.jsx)(`div`,{className:`stats-chart-frame stats-subject-chart skeleton-subject-bars`,children:[48,78,35].map(e=>(0,K.jsx)(`span`,{className:`skeleton-shimmer`,style:{height:`${e}%`}},e))})]}),(0,K.jsxs)(`section`,{className:`panel stats-chart-panel stats-mastery-panel`,children:[(0,K.jsx)(co,{title:`掌握程度`,description:`按每道错题最近一次复习结果统计。`}),(0,K.jsxs)(`div`,{className:`stats-mastery-layout`,children:[(0,K.jsx)(`div`,{className:`stats-mastery-ring skeleton-mastery-ring`}),(0,K.jsx)(`ul`,{className:`stats-mastery-legend`,children:[`未复习`,`未掌握`,`待巩固`,`已掌握`].map(e=>(0,K.jsxs)(`li`,{className:`stats-mastery-item`,children:[(0,K.jsx)(`span`,{className:`stats-legend-dot skeleton-shimmer`}),(0,K.jsx)(`span`,{children:(0,K.jsx)(G,{children:e})}),(0,K.jsx)(`strong`,{children:(0,K.jsx)(G,{children:`0 道`})}),(0,K.jsx)(`span`,{children:(0,K.jsx)(G,{children:`0%`})})]},e))})]})]})]}),(0,K.jsxs)(`section`,{className:`panel knowledge-chart-panel stats-chart-panel`,children:[(0,K.jsx)(co,{title:`知识点分布`,description:`按主知识点查看已归档错题，最多展示数量最多的 8 项。`}),(0,K.jsx)(`div`,{className:`stats-chart-frame stats-knowledge-chart skeleton-knowledge-bars`,children:[74,92,55,38].map(e=>(0,K.jsxs)(`div`,{children:[(0,K.jsx)(G,{children:`知识点名称`}),(0,K.jsx)(`span`,{className:`skeleton-shimmer`,style:{width:`${e}%`}})]},e))})]})]})}function fo(){return(0,K.jsxs)(K.Fragment,{children:[(0,K.jsxs)(`div`,{className:`task-selection-bar`,children:[(0,K.jsxs)(`label`,{children:[(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,K.jsx)(G,{children:`选择本页可操作任务`})]}),(0,K.jsxs)(`div`,{children:[(0,K.jsxs)(`span`,{className:`table-button`,children:[(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,K.jsx)(G,{children:`重试`})]}),(0,K.jsxs)(`span`,{className:`table-button`,children:[(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,K.jsx)(G,{children:`取消`})]})]})]}),(0,K.jsx)(`div`,{className:`task-rows`,children:[0,1,2].map(e=>(0,K.jsxs)(`article`,{className:`task-row`,children:[(0,K.jsxs)(`div`,{className:`task-row-heading`,children:[(0,K.jsxs)(`div`,{className:`task-row-title`,children:[(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,K.jsx)(`h3`,{children:(0,K.jsx)(G,{children:`识别题目`})}),(0,K.jsx)(`span`,{className:`task-id`,children:(0,K.jsx)(G,{children:`#000`})})]}),(0,K.jsx)(`span`,{className:`task-status`,children:(0,K.jsx)(G,{children:`处理中`})})]}),(0,K.jsx)(`div`,{className:`task-excerpt`,children:(0,K.jsx)(G,{children:`正在读取错题内容，整理识别与解析结果。`})}),(0,K.jsxs)(`div`,{className:`task-meta`,children:[(0,K.jsx)(G,{children:`记录 #000`}),(0,K.jsx)(G,{children:`10月24日 12:00`}),(0,K.jsx)(G,{children:`本轮耗时 10 秒`}),(0,K.jsx)(G,{children:`尝试 1/3`})]}),(0,K.jsx)(`div`,{className:`task-row-actions`,children:(0,K.jsx)(oo,{children:`打开错题`})})]},e))})]})}function po(){return(0,K.jsxs)(K.Fragment,{children:[(0,K.jsx)(lo,{title:`AI 任务管理`,action:`录入错题`}),(0,K.jsx)(`p`,{className:`task-page-description`,children:(0,K.jsx)(G,{children:`上传后可以继续学习，AI 会在后台处理。完成后，在这里查看结果、校对或重试；不再需要的处理中、失败或待校对任务可直接取消。`})}),(0,K.jsxs)(`section`,{className:`task-manager`,children:[(0,K.jsxs)(`div`,{className:`task-sync-bar`,children:[(0,K.jsxs)(`span`,{children:[(0,K.jsx)(G,{children:`正在加载任务…`}),(0,K.jsx)(`small`,{children:(0,K.jsx)(G,{children:`正在同步任务状态`})})]}),(0,K.jsx)(oo,{children:`刷新`})]}),(0,K.jsx)(`div`,{className:`task-filters skeleton-tabs`,children:[`全部`,`处理中`,`待校对`,`失败`,`已填入`,`已取消`].map(e=>(0,K.jsx)(`span`,{children:(0,K.jsxs)(G,{children:[e,` —`]})},e))}),(0,K.jsxs)(`div`,{className:`task-search-bar`,children:[(0,K.jsx)(`div`,{className:`task-search skeleton-input skeleton-shimmer`}),(0,K.jsx)(`div`,{className:`custom-select skeleton-input skeleton-shimmer`})]}),(0,K.jsx)(fo,{}),(0,K.jsxs)(`div`,{className:`task-pagination`,children:[(0,K.jsx)(G,{children:`共 — 项`}),(0,K.jsx)(oo,{children:`上一页　下一页`})]})]})]})}function mo(){let{user:e}=re(),t=e.role===`admin`;return(0,K.jsxs)(K.Fragment,{children:[(0,K.jsx)(lo,{title:`设置`,description:t?`管理账号安全、学习目录、AI 服务与全站数据备份。`:`修改用户名、头像与登录密码。`}),(0,K.jsx)(`div`,{className:`settings-tabs skeleton-tabs`,children:[`账号安全`,`知识点目录`,...t?[`AI 设置`,`数据备份`,`邀请码`,`用户账号`,`测试错题`]:[]].map(e=>(0,K.jsxs)(`span`,{children:[(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,K.jsx)(G,{children:e})]},e))}),(0,K.jsxs)(`div`,{className:`settings-account-layout`,children:[(0,K.jsxs)(`div`,{className:`settings-account-forms`,children:[(0,K.jsxs)(`section`,{className:`panel username-panel`,children:[(0,K.jsx)(co,{title:`修改用户名`,description:`修改后请使用新用户名登录。`}),(0,K.jsxs)(`div`,{className:`skeleton-settings-form`,children:[(0,K.jsx)(so,{label:`用户名`}),(0,K.jsx)(oo,{children:`保存用户名`})]})]}),(0,K.jsxs)(`section`,{className:`panel password-panel`,children:[(0,K.jsx)(co,{title:`修改密码`,description:`设置一个只有你知道的密码。`}),(0,K.jsxs)(`div`,{className:`skeleton-settings-form`,children:[(0,K.jsx)(so,{label:`当前密码`}),(0,K.jsx)(so,{label:`新密码`}),(0,K.jsx)(so,{label:`确认新密码`}),(0,K.jsx)(oo,{children:`保存新密码`})]})]})]}),(0,K.jsxs)(`aside`,{className:`panel account-summary`,children:[(0,K.jsx)(`span`,{className:`large-avatar skeleton-shimmer`}),(0,K.jsx)(oo,{children:`上传头像`}),(0,K.jsxs)(`p`,{className:`avatar-hint`,children:[(0,K.jsx)(G,{children:`JPG、PNG、WebP，最大 5 MB`}),(0,K.jsx)(`br`,{}),(0,K.jsx)(G,{children:`自动居中裁剪为方形`})]}),(0,K.jsx)(`h2`,{children:(0,K.jsx)(G,{children:`用户名`})}),(0,K.jsx)(`span`,{className:`small-pill`,children:(0,K.jsx)(G,{children:`学习账号`})}),(0,K.jsxs)(`div`,{className:`account-summary-note`,children:[(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,K.jsx)(`strong`,{children:(0,K.jsx)(G,{children:`专属于你的错题本`})}),(0,K.jsxs)(`p`,{children:[(0,K.jsx)(G,{children:`整理的题目、笔记与复习记录`}),(0,K.jsx)(`br`,{}),(0,K.jsx)(G,{children:`会保存在你的账号下。`})]})]})]})]})]})}function ho(){return(0,K.jsxs)(`section`,{className:`panel admin-panel`,children:[(0,K.jsxs)(`div`,{className:`admin-panel-heading`,children:[(0,K.jsxs)(`div`,{children:[(0,K.jsx)(`h2`,{children:(0,K.jsx)(G,{children:`账号与邀请管理`})}),(0,K.jsx)(`p`,{children:(0,K.jsx)(G,{children:`管理账号状态与使用情况。`})})]}),(0,K.jsx)(oo,{children:`管理操作`})]}),(0,K.jsxs)(`div`,{className:`skeleton-admin-table`,children:[(0,K.jsx)(`div`,{className:`skeleton-admin-table-heading`,children:[0,1,2,3].map(e=>(0,K.jsx)(G,{children:`栏目名称`},e))}),[0,1,2].map(e=>(0,K.jsx)(`div`,{children:[0,1,2,3].map(e=>(0,K.jsx)(G,{children:`正在加载`},e))},e))]})]})}function go(){return(0,K.jsxs)(`div`,{className:`ai-profile-form`,children:[(0,K.jsxs)(`div`,{className:`ai-profile-enable`,children:[(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,K.jsx)(G,{children:`启用服务`})]}),(0,K.jsx)(so,{label:`API 基础地址`}),(0,K.jsx)(so,{label:`模型名称`}),(0,K.jsx)(so,{label:`API 密钥`}),(0,K.jsxs)(`div`,{className:`ai-profile-actions`,children:[(0,K.jsx)(oo,{children:`保存服务配置`}),(0,K.jsx)(oo,{children:`测试服务`})]})]})}function _o(){return(0,K.jsxs)(`div`,{className:`backup-settings`,children:[(0,K.jsxs)(`section`,{className:`panel backup-create-panel`,children:[(0,K.jsxs)(`div`,{className:`backup-heading`,children:[(0,K.jsx)(co,{title:`全站数据备份`,description:`保留一份完整记录，为恢复与迁移做好准备。`}),(0,K.jsx)(oo,{children:`立即备份`})]}),(0,K.jsxs)(`div`,{className:`skeleton-copy-lines`,children:[(0,K.jsx)(G,{children:`账号、错题、知识点、复习记录与图片`}),(0,K.jsx)(G,{children:`完整保存服务器配置与学习记录`})]}),(0,K.jsx)(`div`,{className:`backup-sensitive`,children:(0,K.jsx)(G,{children:`备份含账号数据及服务密钥，请妥善保管。`})})]}),(0,K.jsxs)(`section`,{className:`panel backup-schedule-panel`,children:[(0,K.jsx)(co,{title:`自动备份`,description:`每天按北京时间执行；停服期间错过的备份不会补跑。`}),(0,K.jsxs)(`div`,{className:`backup-enable`,children:[(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,K.jsx)(G,{children:`启用每日自动备份`})]}),(0,K.jsxs)(`div`,{className:`backup-schedule-fields`,children:[(0,K.jsx)(so,{label:`每天执行时间`}),(0,K.jsx)(so,{label:`自动备份保留份数`})]}),(0,K.jsxs)(`div`,{className:`backup-schedule-footer`,children:[(0,K.jsx)(oo,{children:`保存自动备份设置`}),(0,K.jsx)(G,{children:`下次执行时间与最近结果`})]})]}),(0,K.jsxs)(`section`,{className:`panel backup-history-panel`,children:[(0,K.jsx)(`div`,{className:`backup-heading`,children:(0,K.jsx)(`h2`,{children:(0,K.jsx)(G,{children:`备份记录`})})}),[0,1].map(e=>(0,K.jsxs)(`div`,{className:`backup-record`,children:[(0,K.jsx)(G,{children:`备份时间与文件大小`}),(0,K.jsx)(G,{children:`备份状态`}),(0,K.jsx)(oo,{children:`下载`})]},e))]})]})}function vo(){return(0,K.jsxs)(`section`,{className:`test-data-tools`,children:[(0,K.jsxs)(`div`,{children:[(0,K.jsx)(`strong`,{children:(0,K.jsx)(G,{children:`体验错题本`})}),(0,K.jsx)(`p`,{children:(0,K.jsx)(G,{children:`每次为当前管理员账号生成 6 道示例，带有“测试错题”标签，可用于编辑和复习。当前账号共 — 道测试错题。`})}),(0,K.jsx)(`small`,{children:(0,K.jsx)(G,{children:`移入回收站覆盖所有筛选条件、归档和草稿，仅处理当前账号的测试错题，30 天内可恢复题目及复习记录。测试数据会计入学习统计。`})})]}),(0,K.jsxs)(`div`,{className:`test-data-actions`,children:[(0,K.jsx)(oo,{children:`一键生成测试错题`}),(0,K.jsx)(oo,{children:`测试错题移入回收站`})]})]})}function yo({answer:e=!1}){return(0,K.jsxs)(`div`,{className:`photo-entry`,children:[(0,K.jsxs)(`div`,{className:`photo-entry-title`,children:[(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,K.jsx)(G,{children:e?`也可以拍下答案`:`从图片录入题目`})]}),(0,K.jsx)(`div`,{className:`photo-actions`,children:[e?`拍照识别答案`:`拍照`,`选择图片`,`选择已上传的照片`,...e?[`复用题干图片`]:[]].map(e=>(0,K.jsxs)(`span`,{className:`button secondary skeleton-button`,children:[(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`,style:{width:16,height:16}}),(0,K.jsx)(G,{children:e})]},e))})]})}function bo({label:e,rows:t=5,question:n=!1}){return(0,K.jsxs)(`div`,{className:`field markdown-field`,children:[(0,K.jsxs)(`div`,{className:`markdown-field-heading`,children:[(0,K.jsx)(`label`,{children:(0,K.jsx)(G,{children:e})}),(0,K.jsx)(`div`,{className:`markdown-field-modes`,children:[`编辑`,`预览`].map(e=>(0,K.jsx)(`button`,{type:`button`,disabled:!0,tabIndex:-1,children:(0,K.jsx)(G,{children:e})},e))})]}),(0,K.jsx)(`div`,{className:`skeleton-form-control skeleton-shimmer`,children:(0,K.jsx)(`textarea`,{disabled:!0,tabIndex:-1,rows:t,className:n?`question-editor`:void 0})})]})}function xo({title:e,required:t=!1}){return(0,K.jsxs)(`div`,{className:`editor-block-heading`,children:[(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,K.jsx)(`h2`,{children:(0,K.jsx)(G,{children:e})}),t&&(0,K.jsx)(`span`,{children:(0,K.jsx)(G,{children:`必填`})})]})}function So(){let e=/^#\/mistakes\/\d+\/edit/.test(window.location.hash);return(0,K.jsxs)(K.Fragment,{children:[e&&(0,K.jsx)(`div`,{className:`editor-uploaded`,children:(0,K.jsx)(`span`,{className:`table-button`,children:(0,K.jsx)(G,{children:`查看上传图片`})})}),(0,K.jsx)(`div`,{className:`editor-mobile-tabs`,children:(0,K.jsx)(`div`,{className:`sliding-tabs`,children:[`题干`,`解答`,`笔记`,`归类`].map(e=>(0,K.jsx)(`span`,{className:`sliding-tab`,children:(0,K.jsx)(`i`,{className:`skeleton-text skeleton-shimmer`,children:e})},e))})}),(0,K.jsxs)(`div`,{className:`editor-layout`,children:[(0,K.jsxs)(`div`,{className:`editor-main`,children:[(0,K.jsxs)(`section`,{className:`editor-block editor-question-block`,children:[(0,K.jsx)(xo,{title:`题目`,required:!0}),(0,K.jsx)(yo,{}),(0,K.jsx)(bo,{label:`题干 *`,question:!0})]}),(0,K.jsxs)(`section`,{className:`editor-block editor-answers-block skeleton-editor-secondary`,children:[(0,K.jsx)(xo,{title:`答案与分析`}),(0,K.jsx)(bo,{label:`正确答案　选填`,rows:3}),(0,K.jsx)(yo,{answer:!0}),(0,K.jsx)(`div`,{className:`photo-actions`,children:(0,K.jsx)(oo,{children:`生成解析`})}),(0,K.jsx)(bo,{label:`解题分析　选填`})]}),(0,K.jsxs)(`section`,{className:`editor-block editor-note-block skeleton-editor-secondary`,children:[(0,K.jsx)(xo,{title:`我的笔记`}),(0,K.jsx)(bo,{label:`我的笔记　选填`})]})]}),(0,K.jsxs)(`aside`,{className:`editor-aside editor-classification editor-block skeleton-editor-secondary`,children:[(0,K.jsx)(xo,{title:`学科与知识点`}),(0,K.jsx)(so,{label:`学科 *`}),(0,K.jsx)(so,{label:`主知识点　选填`}),(0,K.jsxs)(`div`,{className:`field`,children:[(0,K.jsx)(`span`,{children:(0,K.jsx)(G,{children:`辅助知识点　可多选`})}),(0,K.jsxs)(`div`,{className:`knowledge-options skeleton-copy-lines`,children:[(0,K.jsx)(G,{children:`知识点名称`}),(0,K.jsx)(G,{children:`知识点名称`})]})]}),(0,K.jsxs)(`div`,{className:`field`,children:[(0,K.jsx)(`span`,{children:(0,K.jsx)(G,{children:`星级标记　选填`})}),(0,K.jsx)(G,{children:`☆　☆　☆　☆　☆`})]})]})]})]})}function Co(){let e=/^#\/mistakes\/\d+\/edit/.test(window.location.hash);return(0,K.jsxs)(`div`,{className:`editor-workbench`,children:[(0,K.jsxs)(`nav`,{className:`editor-navigation`,children:[(0,K.jsxs)(`span`,{className:`back-link`,children:[(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,K.jsx)(G,{children:e?`返回错题详情`:`返回我的错题`})]}),!e&&(0,K.jsxs)(`span`,{className:`table-button editor-batch-entry`,children:[(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,K.jsx)(G,{children:`按页批量录入`})]})]}),(0,K.jsxs)(`header`,{className:`editor-workbench-header`,children:[(0,K.jsx)(`div`,{children:(0,K.jsx)(`h1`,{children:(0,K.jsx)(G,{children:e?`编辑错题`:`录入错题`})})}),(0,K.jsx)(`div`,{className:`editor-workbench-state`,children:(0,K.jsx)(`span`,{className:`editor-mode`,children:(0,K.jsx)(G,{children:`正在编辑`})})})]}),(0,K.jsx)(So,{})]})}function wo(){return(0,K.jsx)(`div`,{className:`review-candidates`,children:[0,1,2].map(e=>(0,K.jsxs)(`div`,{className:`review-candidate`,children:[(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,K.jsxs)(`div`,{children:[(0,K.jsx)(`h3`,{children:(0,K.jsx)(G,{children:`题目条件、问题和需要复习的内容`})}),(0,K.jsx)(`span`,{children:(0,K.jsx)(G,{children:`学科 · 知识点`})}),(0,K.jsx)(`div`,{className:`review-candidate-rating`,children:(0,K.jsx)(G,{children:`☆☆☆☆☆`})})]}),(0,K.jsx)(`span`,{className:`status-badge`,children:(0,K.jsx)(`i`,{className:`skeleton-text skeleton-shimmer`,children:`未复习`})})]},e))})}function To(){return(0,K.jsxs)(K.Fragment,{children:[(0,K.jsx)(lo,{title:`开始复习`}),(0,K.jsxs)(`div`,{className:`review-selection-layout`,children:[(0,K.jsxs)(`section`,{className:`library-panel`,children:[(0,K.jsxs)(`div`,{className:`panel-title selection-heading`,children:[(0,K.jsx)(`span`,{className:`panel-title-icon`,children:(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`})}),(0,K.jsxs)(`div`,{children:[(0,K.jsx)(`h2`,{children:(0,K.jsx)(G,{children:`选择今天的练习`})}),(0,K.jsx)(`p`,{children:(0,K.jsx)(G,{children:`仅已归档的错题可以参与复习。`})})]})]}),(0,K.jsx)(`div`,{className:`filter-bar review-filters has-rating-filter`,children:[`全部学科`,`全部知识点`,`全部掌握程度`,`全部星级`].map(e=>(0,K.jsx)(`div`,{className:`custom-select`,children:(0,K.jsxs)(`div`,{className:`custom-select-trigger`,children:[(0,K.jsx)(G,{children:e}),(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`})]})},e))}),(0,K.jsxs)(`div`,{className:`selection-toolbar`,children:[(0,K.jsxs)(`label`,{children:[(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,K.jsx)(G,{children:`全选当前结果`})]}),(0,K.jsx)(`span`,{children:(0,K.jsx)(G,{children:`共 0 道 · 已选 0 道`})})]}),(0,K.jsx)(wo,{})]}),(0,K.jsxs)(`aside`,{className:`review-preparation panel`,children:[(0,K.jsx)(`span`,{className:`prep-icon`,children:(0,K.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`,style:{width:29,height:29}})}),(0,K.jsx)(`h2`,{children:(0,K.jsx)(G,{children:`今天的复习计划`})}),(0,K.jsxs)(`div`,{className:`prep-selected`,children:[(0,K.jsx)(`span`,{children:(0,K.jsx)(G,{children:`本次已选择`})}),(0,K.jsxs)(`strong`,{children:[(0,K.jsx)(G,{children:`0`}),(0,K.jsx)(`small`,{children:(0,K.jsx)(G,{children:`道错题`})})]})]}),(0,K.jsx)(`div`,{className:`prep-steps`,children:[`独立完成题目`,`查看答案与分析`,`记录本次掌握程度`].map((e,t)=>(0,K.jsxs)(`span`,{children:[(0,K.jsx)(`i`,{children:t+1}),(0,K.jsx)(G,{children:e})]},e))}),(0,K.jsx)(oo,{children:`开始复习`}),(0,K.jsx)(`small`,{className:`prep-hint`,children:(0,K.jsx)(G,{children:`复习记录会同步更新掌握程度。`})})]})]})]})}var K,Eo=t((()=>{F(),ro(),io(),ao(),K=qe()}));function Do(){let[e,t]=(0,q.useState)(()=>window.matchMedia(`(prefers-reduced-motion: reduce)`).matches);return(0,q.useEffect)(()=>{let e=window.matchMedia(`(prefers-reduced-motion: reduce)`),n=()=>t(e.matches);return e.addEventListener(`change`,n),()=>e.removeEventListener(`change`,n)},[]),e}function Oo(){let e=Do(),t=(0,q.useRef)([]),n=(0,q.useCallback)(()=>{t.current.forEach(e=>e.cancel()),t.current=[]},[]),r=(0,q.useCallback)((r,i,a,o)=>{if(n(),e||!r||typeof r.animate!=`function`)return Promise.resolve();let s={duration:Vo,easing:zo,fill:`forwards`};return t.current=[r.animate([{transform:`none`},{transform:`rotate(${i*90}deg) scale(${a})`}],s)],o&&t.current.push(o.element.animate([{height:`${o.from}px`,overflow:`hidden`},{height:`${o.to}px`,overflow:`hidden`}],s)),Promise.all(t.current.map(e=>e.finished)).then(()=>void 0,()=>void 0)},[e,n]);return(0,q.useEffect)(()=>n,[n]),{turn:r,settle:n}}function ko(){let e=(0,q.useSyncExternalStore)(Ha,Wa),t=e.pending>0,n=Do(),r=(0,q.useRef)(null),i=(0,q.useRef)(`idle`),a=(0,q.useRef)(0),o=(0,q.useRef)(0),s=(0,q.useRef)(0),c=(0,q.useRef)(new Set),l=(0,q.useRef)(new Set),[u,d]=(0,q.useState)({visible:!1,progress:0,completing:!1});return(0,q.useEffect)(()=>()=>{c.current.forEach(e=>window.clearTimeout(e)),l.current.forEach(e=>window.cancelAnimationFrame(e)),c.current.clear(),l.current.clear()},[]),(0,q.useEffect)(()=>{function u(){c.current.forEach(e=>window.clearTimeout(e)),l.current.forEach(e=>window.cancelAnimationFrame(e)),c.current.clear(),l.current.clear()}function f(e,t){let n=window.setTimeout(()=>{c.current.delete(n),e()},t);c.current.add(n)}function p(e){let t=window.requestAnimationFrame(()=>{l.current.delete(t),e()});l.current.add(t)}function m(){if(i.current!==`loading`||!Ua())return;let e=.92-o.current;e>.003&&(o.current+=e*.18,d({visible:!0,progress:o.current,completing:!1}),f(m,450+o.current*750))}function h(){Ua()||(i.current=`completing`,o.current=1,d({visible:!0,progress:1,completing:!0}),f(()=>{i.current=`fading`,d(e=>({...e,visible:!1})),f(()=>{i.current=`idle`,o.current=0,d({visible:!1,progress:0,completing:!1})},n?40:180)},n?100:440))}let g=e.cycle!==s.current;if(s.current=e.cycle,t||g){u(),a.current=performance.now();let e=i.current;if(i.current=`loading`,e===`idle`)o.current=0,d({visible:!0,progress:0,completing:!1}),p(()=>p(()=>{o.current=.3,d({visible:!0,progress:.3,completing:!1}),f(m,n?100:360)}));else{let e=r.current?getComputedStyle(r.current).transform:`none`,t=e===`none`?o.current:new DOMMatrixReadOnly(e).a;o.current=Math.min(.99,Math.max(.3,t)),d({visible:!0,progress:o.current,completing:!1}),f(m,450)}}!t&&i.current===`loading`&&f(()=>{u(),h()},Math.max(0,(n?60:260)-(performance.now()-a.current)))},[t,e.cycle,n]),(0,J.jsx)(`div`,{className:`loading-progress${u.visible?` is-visible`:``}${u.completing?` is-completing`:``}`,"aria-hidden":`true`,style:{opacity:+!!u.visible,transition:`opacity ${n?40:180}ms ${zo}`},children:(0,J.jsx)(`span`,{ref:r,className:`loading-progress-fill`,style:{transform:`scaleX(${u.progress})`,transition:`transform ${n?60:u.completing?320:u.progress<=.3?200:700}ms ${zo}`}})})}function Ao({tabs:e,value:t,onChange:n,ariaLabel:r,className:i=``}){let a=(0,q.useRef)(null),o=(0,q.useRef)(!1),[s,c]=(0,q.useState)({x:0,width:0}),[l,u]=(0,q.useState)(!1),d=e.map(e=>e.id).join(`\0`);(0,q.useLayoutEffect)(()=>{let e=a.current;if(!e)return;let n=!1,r=0;function i(){if(n||!e)return;let i=Array.from(e.querySelectorAll(`[role="tab"]`)).find(e=>e.dataset.tabId===t);if(!i)return;let a=i.getBoundingClientRect(),s=e.getBoundingClientRect(),l={x:a.left-s.left+e.scrollLeft-e.clientLeft,width:a.width};c(e=>Math.abs(e.x-l.x)<.1&&Math.abs(e.width-l.width)<.1?e:l),!o.current&&!r&&(r=window.requestAnimationFrame(()=>{o.current=!0,u(!0)}))}i();let s=new ResizeObserver(i);return s.observe(e),e.querySelectorAll(`[role="tab"]`).forEach(e=>s.observe(e)),window.addEventListener(`resize`,i),document.fonts.ready.then(i),()=>{n=!0,s.disconnect(),window.removeEventListener(`resize`,i),window.cancelAnimationFrame(r)}},[t,d]);function f(t,r){let i=r;if(t.key===`ArrowRight`)i=(r+1)%e.length;else if(t.key===`ArrowLeft`)i=(r-1+e.length)%e.length;else if(t.key===`Home`)i=0;else if(t.key===`End`)i=e.length-1;else return;t.preventDefault(),n(e[i].id),a.current?.querySelectorAll(`[role="tab"]`)[i]?.focus()}return(0,J.jsxs)(`div`,{ref:a,className:`sliding-tabs ${i}`.trim(),role:`tablist`,"aria-label":r,children:[e.map((e,r)=>(0,J.jsx)(`button`,{id:e.panelId?`${e.panelId}-tab`:void 0,type:`button`,role:`tab`,"data-tab-id":e.id,"aria-controls":e.panelId,"aria-selected":t===e.id,tabIndex:t===e.id?0:-1,className:`sliding-tab${t===e.id?` is-active`:``}`,onClick:()=>n(e.id),onKeyDown:e=>f(e,r),children:e.label},e.id)),(0,J.jsx)(`span`,{className:`tab-indicator`,"aria-hidden":`true`,style:{width:s.width,transform:`translateX(${s.x}px)`,opacity:+!!l,...l?{}:{transition:`none`}}})]})}function jo({items:e,value:t,ariaLabel:n=`主导航`}){let r=(0,q.useRef)(null),i=(0,q.useRef)(!1),[a,o]=(0,q.useState)(!1),[s,c]=(0,q.useState)({x:0,y:0,width:0,height:0,visible:!1}),l=e.map(e=>e.id).join(`\0`);return(0,q.useLayoutEffect)(()=>{let e=r.current;if(!e)return;let n=!1,a=0;function s(){if(n||!e)return;let r=Array.from(e.querySelectorAll(`.nav-item`)).find(e=>e.dataset.navId===t);if(!r){c(e=>e.visible?{...e,visible:!1}:e);return}let s=getComputedStyle(e),l=s.getPropertyValue(`--nav-indicator-axis`).trim(),u=l?l===`horizontal`:s.display===`grid`||s.flexDirection===`row`,d=parseFloat(s.getPropertyValue(`--nav-indicator-inset`))||(u?10:12),f=parseFloat(s.getPropertyValue(`--nav-indicator-thickness`))||3,p=r.getBoundingClientRect(),m=e.getBoundingClientRect(),h=p.left-m.left+e.scrollLeft-e.clientLeft,g=p.top-m.top+e.scrollTop-e.clientTop,_=u?{x:h+d,y:g+p.height-f,width:Math.max(0,p.width-d*2),height:f,visible:!0}:{x:h,y:g+d,width:f,height:Math.max(0,p.height-d*2),visible:!0};c(e=>e.visible===_.visible&&Math.abs(e.x-_.x)<.1&&Math.abs(e.y-_.y)<.1&&Math.abs(e.width-_.width)<.1&&Math.abs(e.height-_.height)<.1?e:_),!i.current&&!a&&(a=window.requestAnimationFrame(()=>{i.current=!0,o(!0)}))}s();let l=new ResizeObserver(s);return l.observe(e),e.querySelectorAll(`.nav-item`).forEach(e=>l.observe(e)),window.addEventListener(`resize`,s),document.fonts.ready.then(s),()=>{n=!0,l.disconnect(),window.removeEventListener(`resize`,s),window.cancelAnimationFrame(a)}},[t,l]),(0,J.jsxs)(`nav`,{ref:r,className:`navigation`,"aria-label":n,children:[e.map(e=>e.element?(0,J.jsx)(`span`,{className:`nav-custom-item`,children:e.element},e.id):(0,J.jsx)(`a`,{href:e.href,"data-nav-id":e.id,className:`nav-item${t===e.id?` active`:``}`,"aria-current":t===e.id?`page`:void 0,children:e.label},e.id)),(0,J.jsx)(`span`,{className:`nav-indicator`,"aria-hidden":`true`,style:{transform:`translate(${s.x}px, ${s.y}px)`,width:s.width,height:s.height,opacity:a&&s.visible?1:0,...a?{}:{transition:`none`}}})]})}function Mo({size:e=`long`}){return(0,J.jsx)(`span`,{className:`skeleton-line skeleton-shimmer ${e}`})}function No(){return(0,J.jsxs)(`div`,{className:`skeleton-heading`,children:[(0,J.jsxs)(`div`,{className:`skeleton-heading-copy`,children:[(0,J.jsx)(Mo,{size:`title`}),(0,J.jsx)(Mo,{size:`medium`})]}),(0,J.jsx)(`span`,{className:`skeleton-block skeleton-shimmer`})]})}function Po({library:e=!1}){return(0,J.jsx)(`div`,{className:`metrics-grid${e?` library-metrics`:``}`,children:(e?[{label:`已归档错题`,tone:`green`},{label:`待巩固`,tone:`amber`},{label:`已掌握`,tone:`green`}]:[{label:`已归档错题`,tone:`violet`},{label:`待完善草稿`,tone:`amber`},{label:`累计复习`,tone:`blue`},{label:`当前掌握率`,tone:`green`}]).map(({label:e,tone:t})=>(0,J.jsxs)(`div`,{className:`metric-card skeleton-metric-card`,children:[(0,J.jsxs)(`div`,{className:`metric-top`,children:[(0,J.jsx)(`span`,{className:`skeleton-metric-label skeleton-shimmer`,children:e}),(0,J.jsx)(`span`,{className:`metric-icon ${t}`,children:(0,J.jsx)(`span`,{className:`skeleton-metric-icon skeleton-shimmer`})})]}),(0,J.jsxs)(`div`,{className:`metric-value`,children:[(0,J.jsx)(`span`,{className:`skeleton-metric-count skeleton-shimmer`}),(0,J.jsx)(`span`,{className:`skeleton-metric-unit skeleton-shimmer`})]})]},e))})}function Fo({review:e=!1}){return(0,J.jsxs)(`div`,{className:`skeleton-list`,children:[!e&&(0,J.jsxs)(`div`,{className:`skeleton-toolbar`,children:[(0,J.jsx)(Mo,{size:`medium`}),(0,J.jsx)(Mo,{size:`short`})]}),Array.from({length:3},(e,t)=>(0,J.jsxs)(`div`,{className:`skeleton-row`,children:[(0,J.jsx)(`span`,{className:`skeleton-row-index skeleton-shimmer`}),(0,J.jsxs)(`div`,{className:`skeleton-row-copy`,children:[(0,J.jsx)(Mo,{}),(0,J.jsx)(Mo,{size:`medium`})]}),(0,J.jsx)(Mo,{size:`short`}),(0,J.jsx)(Mo,{size:`short`})]},t))]})}function Io(){return(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)(`div`,{className:`skeleton-reading-header`,children:(0,J.jsx)(No,{})}),(0,J.jsxs)(`div`,{className:`skeleton-reading-meta`,children:[(0,J.jsx)(Mo,{size:`short`}),(0,J.jsx)(Mo,{size:`short`}),(0,J.jsx)(Mo,{size:`short`})]}),(0,J.jsx)(`div`,{className:`skeleton-panel skeleton-reading-document`,children:[0,1,2].map(e=>(0,J.jsxs)(`section`,{children:[(0,J.jsx)(Mo,{size:`short`}),(0,J.jsx)(Mo,{}),(0,J.jsx)(Mo,{}),(0,J.jsx)(Mo,{size:`medium`})]},e))}),(0,J.jsxs)(`div`,{className:`skeleton-panel skeleton-reading-history`,children:[(0,J.jsx)(Mo,{size:`medium`}),(0,J.jsx)(Mo,{}),(0,J.jsx)(Mo,{size:`short`})]})]})}function Lo({kind:e=`library`}){let t;switch(e){case`summary`:t=(0,J.jsx)(Po,{library:!0});break;case`rows`:t=(0,J.jsx)(Fo,{});break;case`review`:t=(0,J.jsx)(wo,{});break;case`review-page`:t=(0,J.jsx)(To,{});break;case`settings`:t=(0,J.jsx)(ho,{});break;case`settings-page`:t=(0,J.jsx)(mo,{});break;case`ai-profile`:t=(0,J.jsx)(go,{});break;case`backups`:t=(0,J.jsx)(_o,{});break;case`test-data`:t=(0,J.jsx)(vo,{});break;case`tasks`:t=(0,J.jsx)(fo,{});break;case`tasks-page`:t=(0,J.jsx)(po,{});break;case`stats-page`:t=(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)(lo,{title:`学习统计`,action:`去复习`}),(0,J.jsx)(Po,{}),(0,J.jsx)(uo,{})]});break;case`stats`:t=(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)(Po,{}),(0,J.jsx)(uo,{})]});break;case`editor`:t=(0,J.jsx)(So,{});break;case`editor-page`:t=(0,J.jsx)(Co,{});break;case`detail`:t=(0,J.jsx)(Io,{});break;case`shell`:t=(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)(No,{}),(0,J.jsx)(Po,{library:!0}),(0,J.jsx)(Fo,{})]});break;default:t=(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)(No,{}),(0,J.jsx)(Po,{library:!0}),(0,J.jsxs)(`div`,{className:`skeleton-toolbar`,children:[(0,J.jsx)(Mo,{size:`medium`}),(0,J.jsx)(Mo,{size:`short`})]}),(0,J.jsx)(Fo,{})]})}return(0,J.jsx)(`div`,{className:`skeleton-screen skeleton-${e}`,"aria-hidden":`true`,children:t})}function Ro({loading:e,kind:t=`library`,className:n=``,children:r}){let i=Do(),[a,o]=(0,q.useState)(e);return(0,q.useEffect)(()=>{if(e){o(!0);return}let t=window.setTimeout(()=>o(!1),i?40:Bo);return()=>window.clearTimeout(t)},[e,i]),(0,J.jsxs)(`div`,{className:`loading-content loading-kind-${t} ${e?`is-loading`:`is-ready`} ${n}`.trim(),"aria-busy":e,children:[(0,J.jsx)(`div`,{className:`loading-content-body`,inert:e,"aria-hidden":e||void 0,children:r}),(a||e)&&(0,J.jsxs)(`div`,{className:`loading-content-placeholder`,"aria-hidden":!e||void 0,children:[(0,J.jsx)(`span`,{className:`visually-hidden`,role:`status`,children:`正在加载…`}),(0,J.jsx)(Lo,{kind:t})]})]})}var q,J,zo,Bo,Vo,Ho=t((()=>{q=e(H()),Eo(),no(),J=qe(),zo=`cubic-bezier(0.22, 0.61, 0.36, 1)`,Bo=260,Vo=280}));function Uo({className:e=``}){return(0,Wo.jsx)(`img`,{className:`logo-mark ${e}`,src:`/mistakes/logo.svg`,alt:``,width:`48`,height:`48`})}var Wo,Go=t((()=>{Wo=qe()})),Ko,qo,Jo,Yo,Xo,Zo=t((()=>{Ko=`modulepreload`,qo=function(e){return`/mistakes/`+e},Jo={},Yo=function(e){return e.pathname.endsWith(`.css`)},Xo=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=qo(t,n);let r=s(t);if(r.href in Jo)return;Jo[r.href]=!0;let i=Yo(r);if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let o=document.createElement(`link`);if(o.rel=i?`stylesheet`:Ko,i||(o.as=`script`),o.crossOrigin=``,o.href=r.href,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),i)return new Promise((e,t)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${r}`)))})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})}}));function Qo(){return ns||=Xo(async()=>{let{FriendlyCaptchaSDK:e}=await import(`./sdk-LxJ6YTVI.js`);return{FriendlyCaptchaSDK:e}},__vite__mapDeps([0,1])).then(({FriendlyCaptchaSDK:e})=>new e).catch(e=>{throw ns=null,e}),ns}function $o({sitekey:e,resetKey:t,onChange:n}){let r=(0,es.useRef)(null),[i,a]=(0,es.useState)(!0);return(0,es.useEffect)(()=>{let t=r.current;if(!t)return;let i=document.createElement(`div`);t.append(i);let o=!0,s;a(!0),n({status:`pending`,response:``});let c=e=>{if(!o)return;let{state:t,response:r}=e.detail;n(t===`completed`?{status:`complete`,response:r}:t===`error`?{status:`error`,response:r||`.ERROR`}:t===`expired`?{status:`expired`,response:``}:{status:`pending`,response:``})};return i.addEventListener(`frc:widget.statechange`,c),Qo().then(t=>{o&&(s=t.createWidget({element:i,sitekey:e,apiEndpoint:`global`,startMode:`focus`,theme:`light`}),a(!1),i.closest(`form`)?.contains(document.activeElement)&&s.start())}).catch(()=>{o&&(a(!1),n({status:`error`,response:`.ERROR`}))}),()=>{o=!1,i.removeEventListener(`frc:widget.statechange`,c),s?.destroy(),i.remove()}},[e,t,n]),(0,ts.jsxs)(`div`,{className:`auth-captcha-control`,children:[i&&(0,ts.jsxs)(`div`,{className:`auth-captcha-loading`,role:`status`,children:[(0,ts.jsx)(et,{className:`spin`,size:16}),` 正在加载人机验证…`]}),(0,ts.jsx)(`div`,{className:`auth-captcha-widget`,ref:r})]})}var es,ts,ns,rs=t((()=>{es=e(H()),rt(),ts=qe(),Zo(),ns=null})),is,as,os,ss=t((()=>{is=e(H()),as=qe(),os=class extends is.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidUpdate(e){this.state.failed&&e.resetKey!==this.props.resetKey&&this.setState({failed:!1})}render(){return this.state.failed?(0,as.jsxs)(`div`,{className:`inline-alert`,role:`alert`,children:[`页面加载失败，请刷新后重试。`,(0,as.jsx)(`button`,{type:`button`,onClick:()=>window.location.reload(),children:`刷新页面`})]}):this.props.children}}}));function cs(e){let t=e.split(`?`)[0].match(/^\/mistakes\/(\d+)(\/edit)?$/);return t?{id:Number(t[1]),editing:!!t[2]}:null}var ls,us,ds,fs,ps=t((()=>{ls=e(H()),us=(0,ls.createContext)(null),ds=()=>(0,ls.useContext)(us),fs=`mistakes:open-toast-record`}));function ms(e){return{className:`ai-toast-actionable`,closeOnClick:!0,onClick:t=>{if(window.matchMedia(`(max-width: 640px)`).matches&&cs(e)){t.preventDefault(),window.dispatchEvent(new CustomEvent(fs,{cancelable:!0,detail:{path:e}}));return}if(e.startsWith(`/ai-tasks`)){t.preventDefault(),window.dispatchEvent(new CustomEvent(`mistakes:open-ai-tasks`,{detail:{path:e}}));return}window.location.hash===`#${e}`?window.dispatchEvent(new HashChangeEvent(`hashchange`)):Ja(e)}}}var hs=t((()=>{no(),ps()}));function gs(e){let t=(0,_s.useRef)(new Map),n=(0,_s.useRef)(null),r=(0,_s.useRef)(0);return(0,_s.useEffect)(()=>()=>{n.current&&clearTimeout(n.current),U.dismiss(e)},[e]),(0,_s.useCallback)(i=>{if(i.length){if(Date.now()-r.current>8e3)for(let[e,n]of t.current)n.status===`completed`&&t.current.delete(e);r.current=Date.now(),i.forEach(e=>t.current.set(e.id,e)),!n.current&&(n.current=setTimeout(()=>{n.current=null;let r=[...t.current.values()],i=r.filter(e=>e.status===`failed`).length,a=r.filter(e=>e.status===`active`).length,o=r.length-i-a,s=t=>(0,vs.jsxs)(`div`,{className:`ai-toast-copy`,children:[(0,vs.jsxs)(`a`,{className:`ai-toast-link`,href:`#${t.path}`,onClick:n=>{ms(t.path).onClick?.(n),U.dismiss(e)},children:[(0,vs.jsx)(`span`,{children:t.message}),(0,vs.jsx)(`small`,{children:`点击查看处理`})]}),t.retry&&(0,vs.jsx)(`button`,{type:`button`,onClick:t.retry,children:`重试`})]},t.id),c=r.length===1?s(r[0]):(0,vs.jsxs)(`div`,{className:`ai-toast-copy`,children:[(0,vs.jsx)(`span`,{children:[a&&`${a} 项处理中`,o&&`${o} 项完成`,i&&`${i} 项失败`].filter(Boolean).join(` · `)}),r.every(e=>e.path.startsWith(`/ai-tasks`))?(0,vs.jsxs)(`a`,{href:`#/ai-tasks`,onClick:t=>{ms(`/ai-tasks`).onClick?.(t),U.dismiss(e)},children:[`查看 `,r.length,` 项任务`]}):(0,vs.jsxs)(`details`,{className:`activity-toast-details`,children:[(0,vs.jsxs)(`summary`,{children:[`查看 `,r.length,` 项记录`,i?`并重试`:``]}),(0,vs.jsx)(`div`,{children:[...r].sort((e,t)=>Number(t.status===`failed`)-Number(e.status===`failed`)).map(s)})]})]}),l={type:i?`error`:a?`info`:`success`,isLoading:!(!a||i),autoClose:a||i?!1:4500,closeButton:!0,closeOnClick:!1,onClose:()=>{t.current.clear()}};U.isActive(e)?U.update(e,{render:c,...l}):U(c,{toastId:e,...l})},400))}},[e])}var _s,vs,ys=t((()=>{_s=e(H()),En(),hs(),vs=qe()}));function bs(){let e=(0,Y.useContext)(As);if(!e)throw Error(`AI tasks context missing`);return e}function xs({className:e=``}){let{jobs:t,loaded:n,openTasks:r,open:i}=bs(),a=t.filter(Ds),o=t.some(e=>Os(e)||!e.mistakeDeleted&&e.status===`failed`),s=a.length,c=a.map(e=>e.id).sort((e,t)=>e-t).join(`,`),l=`${s?`，${s} 项处理中`:``}${o?`，有待校对或失败任务`:``}`,u=t.map(e=>`${e.id}:${e.status}:${e.applyStatus}:${e.attempts}:${e.analysisRoute?.model||``}`).sort().join(`,`),d=(0,Y.useRef)(null),[f,p]=(0,Y.useState)(0);return(0,Y.useEffect)(()=>{n&&(d.current!==null&&d.current!==u&&p(e=>e+1),d.current=u)},[n,u]),(0,X.jsxs)(`button`,{type:`button`,className:`button ghost ai-tasks-trigger ${e}${s?` has-active-tasks`:``}`,"aria-expanded":i,onClick:()=>r(),"aria-haspopup":`dialog`,"aria-label":`AI 任务${l}`,title:`AI 任务`,children:[(0,X.jsxs)(`span`,{className:`ai-task-icon`,"aria-hidden":`true`,children:[s>0&&(0,X.jsx)(`span`,{className:`ai-task-orbit`}),(0,X.jsx)(it,{size:19,strokeWidth:1.8})]}),(0,X.jsx)(`span`,{className:`ai-task-label`,children:`AI 任务`}),(0,X.jsxs)(`span`,{className:`ai-task-indicators`,children:[(0,X.jsx)(Ss,{count:s,signature:c}),o&&(0,X.jsx)(`span`,{className:`ai-task-attention`,"aria-hidden":`true`})]}),f>0&&(0,X.jsx)(`span`,{className:`ai-task-update-flash`,"aria-hidden":`true`},f)]})}function Ss({count:e,signature:t}){let[n,r]=(0,Y.useState)({signature:t,count:e,revision:0,motion:``,visible:e>0});return n.signature!==t&&r({signature:t,count:e,revision:n.revision+1,motion:e===0?`exit`:e>n.count?`increase`:e<n.count?`decrease`:`replace`,visible:e>0||n.count>0}),(0,Y.useEffect)(()=>{if(n.count||!n.visible)return;let e=window.setTimeout(()=>r(e=>({...e,visible:!1})),360);return()=>window.clearTimeout(e)},[n.count,n.visible,n.revision]),n.visible?(0,X.jsx)(`span`,{"aria-hidden":`true`,className:`count-pill ai-task-count${n.motion?` ai-task-count-${n.motion}`:``}`,children:e},n.revision):null}function Cs({children:e}){let{user:t}=re(),[n,r]=(0,Y.useState)([]),[i,a]=(0,Y.useState)(null),[o,s]=(0,Y.useState)(!1),c=(0,Y.useRef)(null),[l,u]=(0,Y.useState)({revision:0}),d=(0,Y.useRef)(new Map),f=(0,Y.useCallback)((e,t)=>(d.current.set(e,t),()=>{d.current.get(e)===t&&d.current.delete(e)}),[]),p=(0,Y.useCallback)(e=>d.current.get(e),[]),m=(0,Y.useCallback)((e={})=>{c.current=document.activeElement instanceof HTMLElement?document.activeElement:null,u(t=>({...e,revision:t.revision+1})),s(!0)},[]),[h,g]=(0,Y.useState)(window.location.hash.split(`?`)[0]===`#/ai-tasks`),[_,v]=(0,Y.useState)(``),[y,b]=(0,Y.useState)(!1),[x,S]=(0,Y.useState)(!1),[C,w]=(0,Y.useState)(null),[T,E]=(0,Y.useState)(new Set),D=(0,Y.useRef)(new Set),[O,k]=(0,Y.useState)(!document.hidden),A=(0,Y.useRef)(!1),j=(0,Y.useRef)(new Set),M=(0,Y.useRef)(null),N=(0,Y.useRef)(null),P=(0,Y.useRef)(!1),ee=(0,Y.useRef)(!1),te=(0,Y.useRef)(0),F=(0,Y.useRef)(!0),ne=gs(`ai-results-${t.id}`),I=(0,Y.useCallback)(e=>{te.current+=1,F.current&&r(t=>[...e,...t.filter(t=>!e.some(e=>e.id===t.id))].sort((e,t)=>t.id-e.id))},[]),L=(0,Y.useCallback)((e=!1)=>{if(P.current=!0,ee.current||=e,N.current)return N.current;S(!0);let t=(async()=>{do{P.current=!1;let e=te.current,t=ee.current;ee.current=!1;let[n,i]=await Promise.allSettled([Ka(`/ai/jobs`,{},{background:!0}),t?Ka(`/ai/config`,{},{background:!0}):Promise.resolve(null)]);if(!F.current)break;n.status===`fulfilled`&&(e===te.current?(r(n.value),w(Date.now())):P.current=!0),i.status===`fulfilled`&&i.value&&a(i.value),v(n.status===`rejected`?n.reason.message:i.status===`rejected`?i.reason.message:``),b(!0)}while(F.current&&P.current)})().finally(()=>{N.current=null,F.current&&S(!1)});return N.current=t,t},[]),R=(0,Y.useCallback)(()=>L(!0),[L]);(0,Y.useEffect)(()=>{F.current=!0,R();let e=()=>{L()},t=()=>{R()},n=()=>{k(!document.hidden),document.hidden||R()},r=()=>{s(!1),g(window.location.hash.split(`?`)[0]===`#/ai-tasks`)},i=e=>{let t=e.detail.path.split(`?`)[1]||``,n=Number(new URLSearchParams(t).get(`job`))||null;m({jobId:n||void 0,view:new URLSearchParams(t).get(`view`)===`review`?`review`:`list`})};return window.addEventListener(`mistakes:updated`,e),window.addEventListener(`focus`,t),window.addEventListener(`hashchange`,r),window.addEventListener(`mistakes:open-ai-tasks`,i),document.addEventListener(`visibilitychange`,n),()=>{F.current=!1,window.removeEventListener(`mistakes:updated`,e),window.removeEventListener(`focus`,t),window.removeEventListener(`hashchange`,r),window.removeEventListener(`mistakes:open-ai-tasks`,i),document.removeEventListener(`visibilitychange`,n)}},[L,R,m]);let ie=n.filter(Ds).length;(0,Y.useEffect)(()=>{if(!O)return;let e=setInterval(()=>void L(),ie?2e3:15e3);return()=>clearInterval(e)},[ie,O,L]),(0,Y.useEffect)(()=>{o&&R()},[o,R]),(0,Y.useEffect)(()=>{let e=[];if(M.current)for(let t of n){let n=M.current.get(t.id);if(n&&n!==t.status&&!t.mistakeDeleted){if(t.status===`succeeded`){let n=t.applyStatus!==`applied`,r=`/ai-tasks?job=${t.id}${n?`&view=review`:``}`;e.push({id:String(t.id),path:r,status:`completed`,message:`记录 #${t.mistakeId} ${Es(t)}完成${n?`，待校对。`:`，已填入。`}`})}if(t.status===`failed`){let n=`/ai-tasks?job=${t.id}`;e.push({id:String(t.id),path:n,status:`failed`,message:`记录 #${t.mistakeId} ${Es(t)}失败，点击查看原因并重试。`})}}}M.current=new Map(n.map(e=>[e.id,e.status])),!o&&!h&&ne(e)},[n,ne,o,h]),(0,Y.useEffect)(()=>{if(y){for(let e of n){if(!e.analysisRoute||e.mistakeDeleted)continue;let t=`${e.id}:${e.analysisRoute.at}`;if(j.current.has(t)||(j.current.add(t),!A.current&&!Ds(e)))continue;let n=`/ai-tasks?job=${e.id}`;o||U.info((0,X.jsxs)(`a`,{className:`ai-toast-link`,href:`#${n}`,children:[(0,X.jsxs)(`span`,{children:[`记录 #`,e.mistakeId,` 解析响应超时，已自动切换至升级模型 `,e.analysisRoute.model,`。`]}),(0,X.jsx)(`small`,{children:`查看任务进度`})]}),{...ms(n),toastId:`analysis-route-${t}`})}A.current=!0}},[n,y,o]);let z=(0,Y.useCallback)(async e=>{try{let t=await Ka(`/ai/jobs`,to(e));return I([t]),t}catch(e){throw U.error(e.message),e}},[I]),ae=(0,Y.useCallback)(async(e,t={})=>{try{let n=await Ka(`/ai/jobs/${e}/apply`,to(t));return I([n.job]),o||U.success(`AI 结果已填入。`),n}catch(t){let r=n.find(t=>t.id===e),i=r?`/mistakes/${r.mistakeId}/edit?aiJob=${e}`:`/ai-tasks`;throw o||U.error((0,X.jsxs)(`a`,{className:`ai-toast-link`,href:`#${i}`,children:[(0,X.jsx)(`span`,{children:t.message}),(0,X.jsx)(`small`,{children:`点击继续校对`})]}),ms(i)),R(),t}},[R,I,n,o]),oe=(0,Y.useCallback)(async(e,t)=>{let n=[...new Set(e)].filter(e=>!D.current.has(e));if(!n.length)return{jobs:[],errors:[]};n.forEach(e=>D.current.add(e)),E(new Set(D.current));try{let e=await Ka(`/ai/jobs/batch`,to({ids:n,action:t}));return I(e.jobs),e.jobs.length&&!o&&U.success(t===`retry`?`已将 ${e.jobs.length} 项任务重新加入队列。`:`已取消 ${e.jobs.length} 项任务。`),e}finally{n.forEach(e=>D.current.delete(e)),F.current&&(E(new Set(D.current)),L())}},[L,I,o]);return(0,X.jsxs)(As.Provider,{value:{jobs:n,config:i,error:_,loaded:y,refreshing:x,updatedAt:C,busyIds:T,refresh:R,createJob:z,applyJob:ae,actJobs:oe,open:o,openTasks:m,registerEditor:f,editorSession:p,closeTasks:()=>s(!1)},children:[e,(0,X.jsx)(os,{children:(0,X.jsx)(Y.Suspense,{fallback:null,children:(0,X.jsx)(ws,{open:o,onOpenChange:s,request:l,triggerRef:c},l.revision)})})]})}var Y,X,ws,Ts,Es,Ds,Os,ks,As,js=t((()=>{Y=e(H()),rt(),En(),no(),F(),ss(),hs(),ys(),X=qe(),Zo(),ws=(0,Y.lazy)(()=>Xo(()=>import(`./AiQuickPanel-qshByWxt.js`).then(e=>({default:e.AiQuickPanel})),__vite__mapDeps([2,1,3,4,5,6,7,8,9,10,11,12,13,14]))),Ts={question:`题干识别`,answer:`答案识别`,analysis:`生成解析`},Es=e=>e.mode===`page-entry`?`按页录题`:Ts[e.type],Ds=e=>[`queued`,`running`,`retrying`].includes(e.status),Os=e=>!e.mistakeDeleted&&e.status===`succeeded`&&e.applyStatus!==`applied`,ks=e=>Ds(e)||e.status===`failed`||e.status===`succeeded`&&e.applyStatus!==`applied`,As=(0,Y.createContext)(null)})),Ms,Ns,Ps,Fs,Is,Ls,Rs=t((()=>{no(),Ms=class extends Error{constructor(){super(`请求超时，请重试。`)}},Ns=[1e3,2e3,4e3],Ps=e=>({...e,auxiliaryKnowledgePointIds:[...e.auxiliaryKnowledgePointIds]}),Fs=e=>e instanceof Error?e.message:`请求失败，请重试。`,Is=e=>e instanceof eo?e.status===408||e.status===429||e.status>=500&&e.status<600:e instanceof TypeError||e instanceof Ms,Ls=class{batches=new Map;listeners=new Set;snapshot=[];subscribe=e=>(this.listeners.add(e),()=>{this.listeners.delete(e)});getSnapshot=()=>this.snapshot;enqueue({mistakeId:e,purpose:t,input:n,files:r,recognize:i,recognitionPrompt:a}){let o=crypto.randomUUID(),s={view:{id:o,mistakeId:e,purpose:t,total:r.length,imageIds:[],status:`uploading`,message:`图片已压缩，正在后台上传…`,reuseRequested:!1},files:[...r],input:Ps(n),recognize:i,recognitionPrompt:a?.trim()||void 0,recognitionSubmitted:!1,recognitionClientId:crypto.randomUUID(),reuseClientId:crypto.randomUUID(),running:!1,controller:new AbortController};return this.batches.set(o,s),this.publish(),this.run(s),o}reuse(e,t,n){let r=this.batches.get(e);return!r||r.view.purpose!==`question`||r.view.reuseRequested?!1:(r.reuseInput=Ps(t),r.reuseRecognitionPrompt=n?.trim()||r.recognitionPrompt,this.update(r,{reuseRequested:!0,reuseStatus:`waiting`}),r.view.imageIds.length===r.view.total&&this.run(r),!0)}retry(e){let t=this.batches.get(e);t&&!t.running&&t.view.status===`failed`&&(t.recognitionError=void 0,t.reuseError=void 0,t.view.reuseStatus===`failed`&&this.update(t,{reuseStatus:`waiting`}),this.run(t))}dispose(){for(let e of this.batches.values())e.controller.abort(),e.files=[];this.batches.clear(),this.snapshot.length&&this.publish()}publish(){this.snapshot=Array.from(this.batches.values(),e=>e.view).reverse(),this.listeners.forEach(e=>e())}update(e,t){e.controller.signal.aborted||(e.view={...e.view,...t},this.publish())}async run(e){if(!(e.running||e.controller.signal.aborted)){e.running=!0;try{try{for(;e.view.imageIds.length<e.view.total;){let t=e.view.imageIds.length,n=e.files[t],r=await this.request(e,`uploading`,`正在后台上传第 ${t+1}/${e.view.total} 张图片…`,9e4,t=>{if(n.source)return Ka(`/mistakes/${e.view.mistakeId}/reuse-photo`,{...to({...n.source,purpose:e.view.purpose,clientId:n.clientId}),signal:t},{background:!0});let r=new FormData;return r.append(`original`,n.original,n.originalName.replace(/\.[^.]+$/,``)+`.jpg`),r.append(`crop`,n.crop,`crop.jpg`),r.append(`purpose`,e.view.purpose),r.append(`clientId`,n.clientId),Ka(`/mistakes/${e.view.mistakeId}/images`,{method:`POST`,body:r,signal:t},{background:!0})});this.update(e,{imageIds:[...e.view.imageIds,r.id]})}e.files=[]}catch(t){e.controller.signal.aborted||this.update(e,{status:`failed`,message:`图片上传失败：${Fs(t)}`});return}if(e.recognize&&!e.recognitionSubmitted&&!e.recognitionError)try{await this.submitRecognition(e,e.view.purpose,e.input,e.recognitionClientId,e.recognitionPrompt),e.recognitionSubmitted=!0}catch(t){if(e.controller.signal.aborted)return;e.recognitionError=Fs(t)}if(e.reuseInput&&e.view.reuseStatus===`waiting`){this.update(e,{reuseStatus:`submitting`});try{await this.submitRecognition(e,`answer`,e.reuseInput,e.reuseClientId,e.reuseRecognitionPrompt),this.update(e,{reuseStatus:`submitted`})}catch(t){if(e.controller.signal.aborted)return;e.reuseError=Fs(t),this.update(e,{reuseStatus:`failed`})}}let t=[e.recognitionError&&`识别任务提交失败：${e.recognitionError}`,e.reuseError&&`答案复用提交失败：${e.reuseError}`].filter(Boolean);this.update(e,{status:t.length?`failed`:`completed`,message:t.length?t.join(`；`):e.view.reuseStatus===`submitted`?`图片已上传，答案复用已交给后台识别。`:e.recognize?`图片已上传，已交给后台识别。`:`${e.view.total} 张图片已上传。`})}finally{e.running=!1,!e.controller.signal.aborted&&e.view.imageIds.length===e.view.total&&e.view.reuseStatus===`waiting`&&this.run(e)}}}submitRecognition(e,t,n,r,i){return this.request(e,`processing`,`正在后台提交${t===`question`?`题目`:`答案`}识别…`,3e4,a=>Ka(`/ai/jobs`,{...to({clientId:r,mistakeId:e.view.mistakeId,type:t,imageIds:e.view.imageIds,input:n,recognitionPrompt:i}),signal:a},{background:!0}))}async request(e,t,n,r,i){for(let a=0;;a+=1){e.controller.signal.throwIfAborted(),this.update(e,{status:t,message:n});try{return await this.withTimeout(e,r,i)}catch(t){if(e.controller.signal.aborted||!Is(t)||a>=Ns.length)throw t;let n=Ns[a];this.update(e,{status:`retrying`,message:`网络请求失败，${n/1e3} 秒后自动重试（${a+1}/${Ns.length}）…`}),await this.wait(e,n)}}}async withTimeout(e,t,n){e.controller.signal.throwIfAborted();let r=new AbortController,i=()=>r.abort();e.controller.signal.addEventListener(`abort`,i,{once:!0});let a=!1,o=setTimeout(()=>{a=!0,r.abort()},t);try{return await n(r.signal)}catch(e){throw a?new Ms:e}finally{clearTimeout(o),e.controller.signal.removeEventListener(`abort`,i)}}wait(e,t){return new Promise((n,r)=>{let i=e.controller.signal,a=()=>{clearTimeout(o),r(i.reason)},o=setTimeout(()=>{i.removeEventListener(`abort`,a),n()},t);i.addEventListener(`abort`,a,{once:!0}),i.aborted&&a()})}}}));function zs(){let e=(0,Vs.useContext)(Us);if(!e)throw Error(`Photo uploads context missing`);return e}function Bs({children:e}){let[t]=(0,Vs.useState)(()=>new Ls),n=(0,Vs.useRef)(new Map),r=(0,Vs.useSyncExternalStore)(t.subscribe,t.getSnapshot),i=gs(`photo-uploads`);return(0,Vs.useEffect)(()=>()=>{t.dispose()},[t]),(0,Vs.useEffect)(()=>{let e=[];for(let i of r){if(n.current.get(i.id)===i)continue;n.current.set(i.id,i);let r=`/mistakes/${i.mistakeId}/edit?photo=${i.purpose}`;e.push({id:i.id,path:r,message:`记录 #${i.mistakeId} · ${i.message}`,status:i.status===`failed`?`failed`:i.status===`completed`?`completed`:`active`,retry:i.status===`failed`?()=>t.retry(i.id):void 0})}i(e)},[r,t,i]),(0,Hs.jsx)(Us.Provider,{value:{queue:t,batches:r},children:e})}var Vs,Hs,Us,Ws=t((()=>{Vs=e(H()),Rs(),ys(),Hs=qe(),Us=(0,Vs.createContext)(null)})),Gs=t((()=>{}));function Ks({path:e,editorId:t,skeletonKind:n,children:r}){let[i]=(0,Z.useState)(()=>document.createElement(`div`)),a=(0,Z.useRef)(null),[o,s]=(0,Z.useState)(null),[c,l]=(0,Z.useState)(null),[u,d]=(0,Z.useState)(null),[f,p]=(0,Z.useState)(!1),m=(0,Z.useRef)(null),h=(0,Z.useRef)(0),g=(0,Z.useRef)({hash:``,x:0,y:0}),_=(0,Z.useRef)(new Set),v=(0,Z.useRef)({target:u,editorId:t,open:f});v.current={target:u,editorId:t,open:f};let y=!!(u?.editing&&t===u.id),b=(0,Z.useCallback)(e=>{let{target:t,editorId:n}=v.current;return!t?.editing||t.id===n||!!e?.editing&&e.id===t.id||!m.current||m.current()},[]),x=(0,Z.useCallback)(()=>{b(null)&&p(!1)},[b]),S=(0,Z.useCallback)(e=>{let t=cs(e);if(!t){Ja(e);return}b(t)&&(v.current.target||(g.current={hash:window.location.hash,x:window.scrollX,y:window.scrollY}),d({...t,path:e,requestId:++h.current}),p(!0))},[b]),C=(0,Z.useCallback)(e=>(m.current=e,()=>{m.current===e&&(m.current=null)}),[]),w=(0,Z.useCallback)(e=>{if(!(e||v.current.open)){d(null);for(let e of _.current)window.dispatchEvent(new CustomEvent(`mistakes:record-view-updated`,{detail:{id:e}}));_.current.clear(),window.location.hash===g.current.hash&&requestAnimationFrame(()=>window.scrollTo(g.current.x,g.current.y))}},[]);(0,Z.useEffect)(()=>{let e=e=>{let t=e.detail.path;e.preventDefault(),S(t)},t=()=>{v.current.target&&window.location.hash!==g.current.hash&&p(!1)},n=()=>{v.current.target&&_.current.add(v.current.target.id)};return window.addEventListener(fs,e),window.addEventListener(`hashchange`,t),window.addEventListener(`mistakes:updated`,n),()=>{window.removeEventListener(fs,e),window.removeEventListener(`hashchange`,t),window.removeEventListener(`mistakes:updated`,n)}},[S]),(0,Z.useLayoutEffect)(()=>{let e=y?o:a.current;e&&i.parentElement!==e&&(y&&a.current&&(a.current.style.minHeight=`${a.current.getBoundingClientRect().height}px`),e.appendChild(i),!y&&a.current&&(a.current.style.minHeight=``))},[i,y,o]);let T=e=>{if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;let t=e.target.closest(`a[href^="#/"]`);if(!t||t.target===`_blank`||t.hasAttribute(`download`))return;let n=t.getAttribute(`href`).slice(1);cs(n)&&(e.preventDefault(),S(n))},E=u?{path:u.path,requestId:u.requestId,navigate:S,registerLeaveCheck:C,actionsContainer:c,retainsEditor:y,saved:()=>{v.current.target?.id===u.id&&x()},updated:e=>{_.current.delete(e),window.dispatchEvent(new CustomEvent(`mistakes:record-view-updated`,{detail:{id:e}}))}}:null,D=u?.editing?`editor`:`detail`;return(0,Js.jsxs)(Js.Fragment,{children:[(0,Js.jsx)(`div`,{ref:a,className:`record-page-slot`}),(0,qs.createPortal)((0,Js.jsx)(us.Provider,{value:y?E:null,children:(0,Js.jsx)(os,{resetKey:e.split(`?`)[0],children:(0,Js.jsx)(Z.Suspense,{fallback:(0,Js.jsx)(Ro,{loading:!0,kind:n,children:null}),children:r})})}),i),u&&(0,Js.jsx)(Pa,{open:f,onOpenChange:e=>e?p(!0):x(),onOpenChangeComplete:w,title:u.editing?`编辑错题`:`错题详情`,closeLabel:`关闭题目`,className:`record-view-drawer`,footer:(0,Js.jsx)(`div`,{ref:l,className:`record-view-actions`,onClickCapture:T}),children:()=>(0,Js.jsx)(`div`,{ref:s,className:`record-view-slot`,onClickCapture:T,children:!y&&(0,Js.jsx)(us.Provider,{value:E,children:(0,Js.jsx)(os,{resetKey:u.path,children:(0,Js.jsx)(Z.Suspense,{fallback:(0,Js.jsx)(Ro,{loading:!0,kind:D,children:null}),children:u.editing?(0,Js.jsx)(Xs,{id:u.id},`editor-${u.id}`):(0,Js.jsx)(Ys,{id:u.id},`detail-${u.id}`)})})})})})]})}var Z,qs,Js,Ys,Xs,Zs=t((()=>{Z=e(H()),qs=e(Re()),no(),La(),Ho(),ss(),ps(),Gs(),Js=qe(),Zo(),Ys=(0,Z.lazy)(()=>Xo(()=>import(`./DetailPage-DpwGRfOX.js`).then(e=>({default:e.DetailPage})),__vite__mapDeps([15,1,3,4,5,16,9,10,6,17,18,8,11,19,20,13,14]))),Xs=(0,Z.lazy)(()=>Xo(()=>import(`./EditorPage-zWyUnv_X.js`).then(e=>({default:e.EditorPage})),__vite__mapDeps([21,1,3,4,5,8,9,10,6,11,19,7,12,13,14,22,20,23])))})),Qs,$s,ec,tc,nc=t((()=>{Qs=e(H()),$s=(0,Qs.createContext)(null),ec=()=>(0,Qs.useContext)($s),tc=e=>[`/`,`/mistakes`].includes(e.split(`?`)[0])}));function rc({onLogin:e,onNotify:t}){let[n,r]=(0,Q.useState)(!1),[i,a]=(0,Q.useState)(``),[o,s]=(0,Q.useState)(``),[c,l]=(0,Q.useState)(``),[u,d]=(0,Q.useState)(!1),[f,p]=(0,Q.useState)(``),[m,h]=(0,Q.useState)(null),[g,_]=(0,Q.useState)(``),[v,y]=(0,Q.useState)(0),[b,x]=(0,Q.useState)({status:`pending`,response:``}),[S,C]=(0,Q.useState)(0),w=(0,Q.useRef)(!1);(0,Q.useEffect)(()=>{let e=!0;return h(null),_(``),Ka(`/auth/config`).then(t=>{e&&h(t)}).catch(t=>{e&&_(t.message)}),()=>{e=!1}},[v]);let T=m!==null&&(!m.enabled||b.status===`complete`||!n&&b.status===`error`);function E(){x({status:`pending`,response:``}),C(e=>e+1)}async function D(r){if(r.preventDefault(),!w.current&&T){w.current=!0,d(!0),p(``);try{let r=await Ka(n?`/auth/register`:`/auth/login`,to({username:i.trim(),password:o,captchaResponse:m?.enabled?b.response:``,...n?{inviteCode:c.trim()}:{}}));t(n?`欢迎，${r.user.username}！账号已创建。`:`欢迎回来，${r.user.username}！`),e(r.user)}catch(e){p(e.message),U.error(e.message),E()}finally{w.current=!1,d(!1)}}}return(0,$.jsxs)(`div`,{className:`auth-page`,children:[(0,$.jsxs)(`aside`,{className:`auth-story`,children:[(0,$.jsxs)(`a`,{className:`brand`,href:`/`,"aria-label":`返回首页`,children:[(0,$.jsx)(Uo,{}),(0,$.jsxs)(`span`,{className:`brand-text`,children:[`拾题`,(0,$.jsx)(`span`,{children:`把错题，学明白。`})]})]}),(0,$.jsxs)(`div`,{className:`auth-story-body`,children:[(0,$.jsxs)(`span`,{className:`small-pill`,children:[(0,$.jsx)(Ze,{size:16}),` 你的个人错题本`]}),(0,$.jsxs)(`h1`,{children:[`做错的题，`,(0,$.jsx)(`br`,{}),`值得再想一遍。`]}),(0,$.jsxs)(`p`,{children:[`记录卡住你的那一步，梳理知识点。`,(0,$.jsx)(`br`,{}),`再练一次，让「不熟」慢慢变成「掌握」。`]}),(0,$.jsxs)(`div`,{className:`auth-note`,children:[(0,$.jsxs)(`div`,{className:`auth-note-top`,children:[(0,$.jsxs)(`span`,{children:[(0,$.jsx)(Ze,{size:18}),` 我的学习笔记`]}),(0,$.jsx)(`span`,{className:`note-dots`,children:`•••`})]}),(0,$.jsx)(`div`,{className:`note-rule long`}),(0,$.jsx)(`div`,{className:`note-rule`}),(0,$.jsxs)(`div`,{className:`auth-note-bottom`,children:[(0,$.jsxs)(`span`,{children:[(0,$.jsx)(nt,{size:17}),` 记录 · 整理 · 复习`]}),(0,$.jsx)(`span`,{className:`note-check`,children:(0,$.jsx)(nt,{size:25})})]})]})]}),(0,$.jsx)(`div`,{className:`auth-story-footer`,children:`记录问题 · 理清思路 · 回顾练习`})]}),(0,$.jsx)(`main`,{className:`auth-form-area`,children:(0,$.jsxs)(`div`,{className:`auth-form-wrap`,children:[(0,$.jsx)(`div`,{className:`auth-icon`,children:(0,$.jsx)(Je,{size:30})}),(0,$.jsx)(`h2`,{children:n?`开始积累，遇见进步`:`欢迎回来`}),(0,$.jsx)(`p`,{className:`auth-subtitle`,children:n?`使用邀请码创建账号，开启你的错题本。`:`登录后，继续整理你的学习收获。`}),(0,$.jsxs)(`form`,{onSubmit:D,children:[(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`用户名`}),(0,$.jsx)(`input`,{required:!0,autoComplete:`username`,minLength:3,maxLength:32,placeholder:`输入用户名`,value:i,onChange:e=>a(e.target.value)})]}),(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`密码`}),(0,$.jsx)(`input`,{required:!0,type:`password`,autoComplete:n?`new-password`:`current-password`,minLength:n?8:void 0,maxLength:128,placeholder:n?`至少 8 位密码`:`输入密码`,value:o,onChange:e=>s(e.target.value)})]}),n&&(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`邀请码`}),(0,$.jsx)(`input`,{required:!0,placeholder:`输入管理员提供的邀请码`,value:c,onChange:e=>l(e.target.value)}),(0,$.jsx)(`small`,{children:`邀请码由管理员生成。`})]}),!m&&(g?(0,$.jsxs)(`div`,{className:`auth-captcha-notice is-error`,role:`alert`,children:[(0,$.jsxs)(`span`,{children:[`安全配置加载失败：`,g]}),(0,$.jsx)(`button`,{type:`button`,onClick:()=>y(e=>e+1),children:`重新加载`})]}):(0,$.jsxs)(`div`,{className:`auth-captcha-loading`,role:`status`,children:[(0,$.jsx)(et,{className:`spin`,size:16}),` 正在加载安全验证…`]})),m?.enabled&&(0,$.jsxs)(`div`,{className:`auth-captcha`,children:[(0,$.jsx)($o,{sitekey:m.sitekey,resetKey:S,onChange:x},`${n}-${S}`),(b.status===`error`||b.status===`expired`)&&(0,$.jsxs)(`div`,{className:`auth-captcha-notice`,role:`status`,children:[(0,$.jsx)(`span`,{children:b.status===`expired`?`验证已过期，请重新验证。`:n?`人机验证暂不可用，请重试后再注册。`:`人机验证暂不可用，你可以重试或尝试登录。`}),(0,$.jsx)(`button`,{type:`button`,disabled:u,onClick:E,children:`重新验证`})]})]}),f&&(0,$.jsx)(`div`,{className:`form-error`,role:`alert`,children:f}),(0,$.jsx)(`button`,{className:`button primary auth-submit`,disabled:u||!T,children:u?(0,$.jsx)(et,{className:`spin`,size:18}):(0,$.jsxs)($.Fragment,{children:[n?`创建账号`:`登录`,(0,$.jsx)(Ue,{size:18})]})})]}),(0,$.jsxs)(`div`,{className:`auth-switch`,children:[n?`已有账号？`:`还没有账号？`,(0,$.jsx)(`button`,{disabled:u,onClick:()=>{w.current||(r(!n),p(``),E())},children:n?`立即登录`:`使用邀请码注册`})]}),(0,$.jsxs)(`div`,{className:`auth-secure`,children:[(0,$.jsx)(He,{size:15}),` 你的错题与笔记，仅对你可见`]})]})})]})}function ic(){let[e,t]=(0,Q.useState)(null),[n,r]=(0,Q.useState)(!0),[i,a]=(0,Q.useState)([]),[o,s]=(0,Q.useState)([]),[c,l]=(0,Q.useState)(``),[u,d]=(0,Q.useState)(!1),[f,p]=(0,Q.useState)(window.location.hash.slice(1)||`/mistakes`),[m,h]=(0,Q.useState)({session:0,recordId:null}),g=(0,Q.useRef)(null),_=(0,Q.useRef)(null),v=(0,Q.useRef)(!1);(0,Q.useEffect)(()=>{let e=!0,n=window.history.scrollRestoration;window.history.scrollRestoration=`manual`;let i=(window.location.hash.slice(1)||`/mistakes`).split(`?`)[0];Ka(`/auth/me`).then(n=>{e&&(n.user&&[`/mistakes`,`/`].includes(i)&&(g.current=`欢迎回来，${n.user.username}！`),t(n.user))}).catch(()=>{e&&t(null)}).finally(()=>{e&&r(!1)});let a=e=>{let t=window.location.hash.slice(1)||`/mistakes`;if(!window.dispatchEvent(new CustomEvent(`mistakes:before-navigate`,{cancelable:!0,detail:{path:t}}))){window.history.replaceState(null,``,new URL(e.oldURL).hash||`#/mistakes`);return}let n=t.split(`?`)[0],r=new URL(e.oldURL||window.location.href).hash.slice(1)||`/mistakes`;tc(r)&&!tc(t)&&(_.current={path:r,x:window.scrollX,y:window.scrollY}),!tc(t)&&!/^\/mistakes\/\d+(\/edit)?$/.test(n)&&(_.current=null),h(e=>n===`/new`?{session:e.session+1,recordId:null}:e.recordId&&n!==`/mistakes/${e.recordId}/edit`?{...e,recordId:null}:e),p(t)};return window.addEventListener(`hashchange`,a),()=>{e=!1,window.removeEventListener(`hashchange`,a),window.history.scrollRestoration=n}},[]),(0,Q.useLayoutEffect)(()=>{let e=tc(f)?_.current:null;window.scrollTo({left:e?.x||0,top:e?.y||0,behavior:`instant`})},[f]);let y=(0,Q.useCallback)((e,t=`success`)=>{U[t](e)},[]);(0,Q.useEffect)(()=>{if(e&&g.current){let e=g.current;g.current=null,y(e)}},[e,y]);let b=(0,Q.useCallback)(async()=>{try{let[e,t]=await Promise.all([Ka(`/subjects`),Ka(`/knowledge-points`)]);a(e),s(Ae(t,e)),l(``)}catch(e){l(e.message)}},[]);(0,Q.useEffect)(()=>{e&&b()},[e,b]),(0,Q.useEffect)(()=>{if(!e){d(!1);return}let t=!0,n=!1,r=0,i=async()=>{if(n||document.hidden)return;n=!0;let e=r;try{let n=await Ka(`/system/status`,{},{background:!0});t&&r===e&&d(n.readOnly)}catch{}finally{n=!1}},a=e=>{let t=e.detail;typeof t?.readOnly==`boolean`&&(r+=1,d(t.readOnly))},o=()=>{i()};window.addEventListener(`mistakes:backup-status`,a),window.addEventListener(`focus`,o),document.addEventListener(`visibilitychange`,o);let s=window.setInterval(()=>{i()},15e3);return i(),()=>{t=!1,window.clearInterval(s),window.removeEventListener(`mistakes:backup-status`,a),window.removeEventListener(`focus`,o),document.removeEventListener(`visibilitychange`,o)}},[e?.id]);let x=(0,Q.useCallback)(async()=>{if(window.dispatchEvent(new Event(`mistakes:before-logout`,{cancelable:!0}))){window.dispatchEvent(new Event(`mistakes:session-ending`));try{await Ka(`/auth/logout`,to({})),y(`已退出登录。`),t(null),a([]),s([]),_.current=null,v.current=!1,window.location.hash=`/mistakes`}catch(e){window.dispatchEvent(new Event(`mistakes:session-resumed`)),y(e.message,`error`)}}},[y]),S=f.split(`?`)[0],C=S.match(/^\/mistakes\/(\d+)(\/edit)?$/),w=C&&_.current?_.current.path:`/mistakes`,T=tc(f);T?v.current=!0:C||(v.current=!1);let E=C?C[2]?`editor-page`:`detail`:pc[S]||`library`,D=C?`/mistakes`:S===`/page-imports`?`/new`:S,O=S===`/new`?m.recordId:C?.[2]?Number(C[1]):null,k;k=S===`/new`?(0,$.jsx)(oc,{onCreated:e=>h(t=>({...t,recordId:e}))},`new-${m.session}`):S===`/page-imports`?(0,$.jsx)(dc,{}):C?.[2]?(0,$.jsx)(oc,{id:Number(C[1])},m.recordId===Number(C[1])?`new-${m.session}`:S):C?(0,$.jsx)(sc,{id:Number(C[1])},f):S===`/review`?(0,$.jsx)(cc,{},f):S===`/stats`?(0,$.jsx)(lc,{}):S===`/ai-tasks`?(0,$.jsx)(fc,{}):S===`/settings`?(0,$.jsx)(uc,{}):T?null:(0,$.jsx)(ac,{}),k=(0,$.jsxs)($s.Provider,{value:_.current?.path||null,children:[v.current&&(0,$.jsx)(`div`,{hidden:!T,children:(0,$.jsx)(ac,{active:T})},`library`),!T&&k]});let A=e?(0,$.jsx)(pe.Provider,{value:{user:e,updateUser:t,subjects:i,knowledgePoints:o,refreshDirectory:b,notify:y,logout:x},children:(0,$.jsx)(Cs,{children:(0,$.jsx)(Bs,{children:(0,$.jsxs)(`div`,{className:`app-shell`,children:[(0,$.jsxs)(`aside`,{className:`sidebar`,children:[(0,$.jsxs)(`a`,{className:`brand`,href:`#${w}`,children:[(0,$.jsx)(Uo,{}),(0,$.jsxs)(`span`,{className:`brand-text`,children:[`拾题`,(0,$.jsx)(`span`,{children:`把错题，学明白。`})]})]}),(0,$.jsx)(`div`,{className:`sidebar-label`,children:`学习空间`}),(0,$.jsx)(jo,{value:D,ariaLabel:`主导航`,items:mc.map(({path:e,label:t,icon:n})=>({id:e,href:`#${e===`/mistakes`?w:e}`,label:(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(n,{size:19,strokeWidth:1.8}),(0,$.jsx)(`span`,{children:t})]})}))}),(0,$.jsxs)(`div`,{className:`sidebar-bottom`,children:[(0,$.jsxs)(`div`,{className:`sidebar-reminder`,children:[(0,$.jsx)(`span`,{className:`reminder-icon`,children:(0,$.jsx)(We,{size:22})}),(0,$.jsx)(`strong`,{children:`温故而知新，可以为师矣`}),(0,$.jsx)(`a`,{href:`#/review`,children:`打开复习页`})]}),(0,$.jsxs)(`div`,{className:`account`,children:[(0,$.jsx)(xs,{className:`mobile-task-trigger`}),(0,$.jsxs)(`a`,{className:`account-profile`,href:`#/settings`,children:[(0,$.jsx)(`span`,{className:`avatar`,children:e.avatar?(0,$.jsx)(`img`,{src:e.avatar,alt:``}):e.username.slice(0,1).toUpperCase()}),(0,$.jsxs)(`span`,{className:`account-name`,children:[(0,$.jsx)(`strong`,{title:e.username,children:e.username}),(0,$.jsx)(`small`,{children:e.role===`admin`?`管理员`:`我的账号`})]})]}),(0,$.jsx)(`button`,{className:`icon-button`,title:`退出登录`,"aria-label":`退出登录`,onClick:x,children:(0,$.jsx)($e,{size:17})})]})]})]}),(0,$.jsxs)(`div`,{className:`main-shell`,children:[(0,$.jsxs)(`header`,{className:`topbar`,children:[(0,$.jsxs)(`span`,{className:`topbar-label`,children:[(0,$.jsx)(Xe,{size:15}),` 个人学习空间`]}),(0,$.jsxs)(`div`,{className:`topbar-right`,children:[(0,$.jsx)(xs,{className:`desktop-task-trigger`}),(0,$.jsx)(`a`,{className:`topbar-avatar`,href:`#/settings`,"aria-label":`账号设置`,children:e.avatar?(0,$.jsx)(`img`,{src:e.avatar,alt:``}):e.username.slice(0,1).toUpperCase()})]})]}),(0,$.jsxs)(`main`,{className:`main-content`,children:[u&&(0,$.jsxs)(`div`,{className:`backup-readonly-banner`,role:`status`,children:[(0,$.jsx)(Ge,{size:20}),(0,$.jsxs)(`p`,{children:[(0,$.jsx)(`strong`,{children:`正在备份，暂时只读`}),(0,$.jsx)(`span`,{children:`已输入的内容会保留，请稍后重试保存。`})]})]}),c&&(0,$.jsxs)(`div`,{className:`inline-alert`,role:`alert`,children:[`基础目录加载失败：`,c,(0,$.jsx)(`button`,{onClick:b,children:`重试`})]}),(0,$.jsx)(Ks,{path:f,editorId:O,skeletonKind:E,children:k}),(0,$.jsx)(`footer`,{className:`page-footer`,children:(0,$.jsxs)(`span`,{children:[`拾题 · © `,new Date().getFullYear(),` ShaoanC`]})})]})]})]})})},e.id)}):(0,$.jsx)(rc,{onLogin:e=>{t(e),p(`/mistakes`),window.location.hash=`/mistakes`},onNotify:e=>{g.current=e}});return(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(ko,{}),(0,$.jsx)(Ro,{loading:n,kind:`shell`,className:`app-entrance`,children:!n&&A})]})}var Q,$,ac,oc,sc,cc,lc,uc,dc,fc,pc,mc,hc=t((()=>{Q=e(H()),En(),rt(),no(),F(),Ho(),Go(),rs(),js(),Ws(),Zs(),nc(),$=qe(),Zo(),ac=(0,Q.lazy)(()=>Xo(()=>import(`./MistakesPage-D7MZtmu-.js`).then(e=>({default:e.MistakesPage})),__vite__mapDeps([24,1,3,4,5,16,9,10,6,17,18,8,11,19,25,26,27]))),oc=(0,Q.lazy)(()=>Xo(()=>import(`./EditorPage-zWyUnv_X.js`).then(e=>({default:e.EditorPage})),__vite__mapDeps([21,1,3,4,5,8,9,10,6,11,19,7,12,13,14,22,20,23]))),sc=(0,Q.lazy)(()=>Xo(()=>import(`./DetailPage-DpwGRfOX.js`).then(e=>({default:e.DetailPage})),__vite__mapDeps([15,1,3,4,5,16,9,10,6,17,18,8,11,19,20,13,14]))),cc=(0,Q.lazy)(()=>Xo(()=>import(`./ReviewPage-C_imBrqO.js`).then(e=>({default:e.ReviewPage})),__vite__mapDeps([28,1,3,4,5,8,9,10,6,11,19,27,17]))),lc=(0,Q.lazy)(()=>Xo(()=>import(`./StatsPage-eQLYIG93.js`).then(e=>({default:e.StatsPage})),__vite__mapDeps([29,1,3,4,5,30,10]))),uc=(0,Q.lazy)(()=>Xo(()=>import(`./SettingsPage-DX1f9ztq.js`).then(e=>({default:e.SettingsPage})),__vite__mapDeps([31,1,3,4,5,9,10]))),dc=(0,Q.lazy)(()=>Xo(()=>import(`./PageImports-D7gSSDXf.js`).then(e=>({default:e.PageImportsPage})),__vite__mapDeps([32,1,3,4,5,12,13,9,6,14,22,33]))),fc=(0,Q.lazy)(()=>Xo(()=>import(`./AiTaskManager-C8bDbxLc.js`).then(e=>({default:e.AiTasksPage})),__vite__mapDeps([34,1,3,4,5,8,9,10,6,11,13,14,17,25,26]))),pc={"/new":`editor-page`,"/page-imports":`editor`,"/review":`review-page`,"/stats":`stats-page`,"/ai-tasks":`tasks-page`,"/settings":`settings-page`},mc=[{path:`/mistakes`,label:`我的错题`,icon:at},{path:`/new`,label:`录入错题`,icon:Ye},{path:`/review`,label:`复习`,icon:We},{path:`/stats`,label:`学习统计`,icon:Qe},{path:`/settings`,label:`设置`,icon:Ke}]})),gc=t((()=>{})),_c=t((()=>{})),vc=t((()=>{})),yc=t((()=>{}));n((()=>{var t=e(H()),n=e(R());Va(),hc(),ke(),gc(),Ce(),je(),_c(),vc();var r=qe();yc(),n.createRoot(document.getElementById(`root`)).render((0,r.jsxs)(t.StrictMode,{children:[(0,r.jsx)(ic,{}),(0,r.jsx)(Ra,{})]}))}))();export{Pa as A,ro as C,no as D,qa as E,ur as F,dr as I,En as L,Na as M,Nr as N,to as O,jr as P,U as R,io as S,Ka as T,Zo as _,Ws as a,Ho as b,Es as c,Ds as d,Os as f,Xo as g,ds as h,ec as i,La as j,Ja as k,ks as l,ps as m,nc as n,zs as o,bs as p,tc as r,Ts as s,yc as t,js as u,Ro as v,eo as w,Oo as x,Ao as y};