const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/sdk-LxJ6YTVI.js","assets/rolldown-runtime-8BhlS34s.js","assets/AiQuickPanel-kEngaTrn.js","assets/body-fonts-D1jSfKJt.js","assets/lucide-react-T23BayZd.js","assets/body-fonts-D2pN-qLK.css","assets/dialog-_VqppbY1.js","assets/editor-draft-CRh2IA56.js","assets/MarkdownContent-B6wsbZKC.js","assets/ScrollArea-asHdrArm.js","assets/components-B2ATPsZA.js","assets/MarkdownContent-B_AG56q7.css","assets/ImageRegions-By30Q9vD.js","assets/AiDialog-B01xXHNR.js","assets/AiDialog-CvSDZtUz.css","assets/AiTaskCard-BP65B694.js","assets/AiTaskCard-C9752rqs.css","assets/DetailPage-C_044r0-.js","assets/export-selection-CtgGcTV1.js","assets/Select-4SWeMDfn.js","assets/export-selection-BxvDv5gF.css","assets/StarRating-CN9Mzrhw.js","assets/ImageHistory-uTLI4huB.js","assets/EditorPage-_J14AYvB.js","assets/photo-rotation-BMZRYkRY.js","assets/EditorPage-uFFyAtXV.css","assets/MistakesPage-BSNh1UgZ.js","assets/library-pagination-DLQr9GFi.js","assets/library-pagination-yghQomn8.css","assets/MistakeFilterFields-g5iebSlM.js","assets/ReviewPage-zxdHaU_H.js","assets/StatsPage-99FJ9XNY.js","assets/clsx-DNZXw_RA.js","assets/SettingsPage-BMQT00kV.js","assets/PageImports-C5FE3gWh.js","assets/PageImports-H1u3vXXK.css","assets/AiTaskManager-DFjj9OKH.js"])))=>i.map(i=>d[i]);
import{i as e,n as t,t as n}from"./rolldown-runtime-8BhlS34s.js";import{$ as r,Bt as i,C as a,Cn as o,Gt as s,H as c,Ht as l,I as u,Jt as d,K as f,Kt as p,L as m,Lt as h,M as g,N as _,Nt as v,P as y,Q as b,R as x,Rt as S,S as C,Sn as w,T,U as E,Ut as D,Vt as O,Wt as ee,X as k,Xt as A,Y as j,Yt as M,Z as te,Zt as ne,_ as re,_t as N,a as P,b as F,bn as I,c as L,cn as ie,dn as ae,dt as R,fn as z,g as oe,gt as se,h as ce,i as le,in as ue,jt as de,k as fe,kt as pe,l as me,m as he,n as ge,nt as _e,on as ve,ot as ye,p as be,pn as xe,q as Se,qt as Ce,r as B,rn as we,s as Te,sn as Ee,st as De,t as Oe,tt as ke,u as Ae,un as je,ut as Me,v as Ne,vn as Pe,vt as Fe,w as Ie,x as Le,xn as Re,y as ze,yn as Be,yt as Ve,zt as He}from"./body-fonts-D1jSfKJt.js";import{Bn as Ue,E as We,En as Ge,J as Ke,Jt as qe,M as Je,Mn as Ye,Ot as Xe,P as Ze,Rt as Qe,Vn as V,Xt as $e,bt as et,cn as tt,et as nt,f as rt,gt as it,i as at,in as ot,t as st,vt as ct}from"./lucide-react-T23BayZd.js";import{n as lt,t as ut}from"./clsx-DNZXw_RA.js";function dt(e,t,n=300){let{scrollHeight:r,style:i}=e;requestAnimationFrame(()=>{i.minHeight=`initial`,i.height=r+`px`,i.transition=`all ${n}ms`,requestAnimationFrame(()=>{i.height=`0`,i.padding=`0`,i.margin=`0`,setTimeout(t,n)})})}function ft({enter:e,exit:t,appendPosition:n=!1,collapse:r=!0,collapseDuration:i=300}){return function({children:a,position:o,preventExitTransition:s,done:c,nodeRef:l,isIn:u,playToast:d}){let f=n?`${e}--${o}`:e,p=n?`${t}--${o}`:t,m=(0,Ut.useRef)(0);return(0,Ut.useLayoutEffect)(()=>{let e=l.current,t=f.split(` `),n=r=>{r.target===l.current&&(d(),e.removeEventListener(`animationend`,n),e.removeEventListener(`animationcancel`,n),m.current===0&&r.type!==`animationcancel`&&e.classList.remove(...t))};e.classList.add(...t),e.addEventListener(`animationend`,n),e.addEventListener(`animationcancel`,n)},[]),(0,Ut.useEffect)(()=>{let e=l.current,t=()=>{e.removeEventListener(`animationend`,t),r?dt(e,c,i):c()};u||(s?t():(m.current=1,e.className+=` ${p}`,e.addEventListener(`animationend`,t)))},[u]),Ut.createElement(Ut.Fragment,null,a)}}function pt(e,t){return{content:mt(e.content,e.props),containerId:e.props.containerId,id:e.props.toastId,theme:e.props.theme,type:e.props.type,data:e.props.data||{},isLoading:e.props.isLoading,icon:e.props.icon,reason:e.removalReason,status:t}}function mt(e,t,n=!1){return(0,Wt.isValidElement)(e)&&!tn(e.type)?(0,Wt.cloneElement)(e,{closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):nn(e)?e({closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):e}function ht({closeToast:e,theme:t,ariaLabel:n=`close`}){return Gt.createElement(`button`,{className:`Toastify__close-button Toastify__close-button--${t}`,type:`button`,onClick:t=>{t.stopPropagation(),e(!0)},"aria-label":n},Gt.createElement(`svg`,{"aria-hidden":`true`,viewBox:`0 0 14 16`},Gt.createElement(`path`,{fillRule:`evenodd`,d:`M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z`})))}function gt({delay:e,isRunning:t,closeToast:n,type:r=`default`,hide:i,className:a,controlledProgress:o,progress:s,rtl:c,isIn:l,theme:u}){let d=i||o&&s===0,f={animationDuration:`${e}ms`,animationPlayState:t?`running`:`paused`};o&&(f.transform=`scaleX(${s})`);let p=ut(`Toastify__progress-bar`,o?`Toastify__progress-bar--controlled`:`Toastify__progress-bar--animated`,`Toastify__progress-bar-theme--${u}`,`Toastify__progress-bar--${r}`,{"Toastify__progress-bar--rtl":c}),m=nn(a)?a({rtl:c,type:r,defaultClassName:p}):ut(p,a),h={[o&&s>=1?`onTransitionEnd`:`onAnimationEnd`]:o&&s<1?null:()=>{l&&n()}};return Kt.createElement(`div`,{className:`Toastify__progress-bar--wrp`,"data-hidden":d},Kt.createElement(`div`,{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${u} Toastify__progress-bar--${r}`}),Kt.createElement(`div`,{role:`progressbar`,"aria-hidden":d?`true`:`false`,"aria-label":`notification timer`,"aria-valuenow":o?Math.round(s*100):void 0,"aria-valuemin":0,"aria-valuemax":100,className:m,style:f,...h}))}function _t(e,t,n){let r=1,i=0,a=[],o=[],s=t,c=new Map,l=new Set,u=e=>(l.add(e),()=>l.delete(e)),d=()=>{o=Array.from(c.values()),l.forEach(e=>e())},f=({containerId:t,toastId:n,updateId:r})=>{let i=t?t!==e:e!==1,a=c.has(n)&&r==null;return i||a},p=(e,t)=>{c.forEach(n=>{var r;(t==null||t===n.props.toastId)&&((r=n.toggle)==null||r.call(n,e))})},m=e=>{var t,r;e.isActive&&((r=(t=e.props)?.onClose)==null||r.call(t,e.removalReason),e.isActive=!1,n(pt(e,`removed`)))},h=e=>{if(e==null)c.forEach(m);else{let t=c.get(e);t&&m(t)}d()},g=()=>{i-=a.length,a=[]},_=e=>{var t,r;let{toastId:i,updateId:a}=e.props,o=a==null;e.staleId&&c.delete(e.staleId),e.isActive=!0,c.set(i,e),d(),n(pt(e,o?`added`:`updated`)),o&&((r=(t=e.props).onOpen)==null||r.call(t))};return{id:e,props:s,observe:u,toggle:p,removeToast:h,toasts:c,clearQueue:g,buildToast:(e,t)=>{if(f(t))return;let{toastId:n,updateId:o,data:l,staleId:u,delay:p}=t,m=o==null;m&&i++;let g={...s,style:s.toastStyle,key:r++,...Object.fromEntries(Object.entries(t).filter(([e,t])=>t!=null)),toastId:n,updateId:o,data:l,isIn:!1,className:an(t.className||s.toastClassName),progressClassName:an(t.progressClassName||s.progressClassName),autoClose:!t.isLoading&&on(t.autoClose,s.autoClose),closeToast(e){let t=c.get(n);t&&(t.removalReason=e,h(n))},deleteToast(){if(c.get(n)!=null){if(c.delete(n),i--,i<0&&(i=0),a.length>0){_(a.shift());return}d()}}};g.closeButton=s.closeButton,t.closeButton===!1||sn(t.closeButton)?g.closeButton=t.closeButton:t.closeButton===!0&&(g.closeButton=!sn(s.closeButton)||s.closeButton);let v={content:e,props:g,staleId:u};s.limit&&s.limit>0&&i>s.limit&&m?a.push(v):en(p)?setTimeout(()=>{_(v)},p):_(v)},setProps(e){s=e},setToggle:(e,t)=>{let n=c.get(e);n&&(n.toggle=t)},isToastActive:e=>c.get(e)?.isActive,getSnapshot:()=>o}}function vt(){dn.forEach(e=>xt(e.content,e.options)),dn=[]}function yt(e,t){var n;if(t)return!!((n=un.get(t))!=null&&n.isToastActive(e));let r=!1;return un.forEach(t=>{t.isToastActive(e)&&(r=!0)}),r}function bt(e){if(!mn()){dn=dn.filter(t=>e!=null&&t.options.toastId!==e);return}if(e==null||rn(e))un.forEach(t=>{t.removeToast(e)});else if(e&&(`containerId`in e||`id`in e)){let t=un.get(e.containerId);t?t.removeToast(e.id):un.forEach(t=>{t.removeToast(e.id)})}}function xt(e,t){sn(e)&&(mn()||dn.push({content:e,options:t}),un.forEach(n=>{n.buildToast(e,t)}))}function St(e){var t;(t=un.get(e.containerId||1))==null||t.setToggle(e.id,e.fn)}function Ct(e,t){un.forEach(n=>{(t==null||!(t!=null&&t.containerId)||t?.containerId===n.id)&&n.toggle(e,t?.id)})}function wt(e){let t=e.containerId||1;return{subscribe(n){let r=_t(t,e,pn);un.set(t,r);let i=r.observe(n);return vt(),()=>{i(),un.delete(t)}},setProps(e){var n;(n=un.get(t))==null||n.setProps(e)},getSnapshot(){return un.get(t)?.getSnapshot()}}}function Tt(e){return fn.add(e),()=>{fn.delete(e)}}function Et(e){return e&&(tn(e.toastId)||en(e.toastId))?e.toastId:ln()}function Dt(e,t){return xt(e,t),t.toastId}function Ot(e,t){return{...t,type:t&&t.type||e,toastId:Et(t)}}function kt(e){return(t,n)=>Dt(t,Ot(e,n))}function H(e,t){return Dt(e,Ot(`default`,t))}function At(e,{pending:t,error:n,success:r},i){let a;t&&(a=tn(t)?H.loading(t,i):H.loading(t.render,{...i,...t}));let o={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},s=(e,t,n)=>{if(t==null){H.dismiss(a);return}let r={type:e,...o,...i,data:n},s=tn(t)?{render:t}:t;return a?H.update(a,{...r,...s}):H(s.render,{...r,...s}),n},c=nn(e)?e():e;return c.then(e=>s(`success`,r,e)).catch(e=>s(`error`,n,e)),c}function jt(e){bt(e)}function Mt(e){let{subscribe:t,getSnapshot:n,setProps:r}=(0,Jt.useRef)(wt(e)).current;r(e);let i=(0,Jt.useSyncExternalStore)(t,n,n)?.slice();function a(t){if(!i)return[];let n=new Map;return e.newestOnTop&&i.reverse(),i.forEach(e=>{let{position:t}=e.props;n.has(t)||n.set(t,[]),n.get(t).push(e)}),Array.from(n,e=>t(e[0],e[1]))}return{getToastToRender:a,isToastActive:yt,count:i?.length}}function Nt(e){let[t,n]=(0,Yt.useState)(!1),[r,i]=(0,Yt.useState)(!1),a=(0,Yt.useRef)(null),o=(0,Yt.useRef)({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:s,pauseOnHover:c,closeToast:l,onClick:u,closeOnClick:d}=e;St({id:e.toastId,containerId:e.containerId,fn:n}),(0,Yt.useEffect)(()=>{if(e.pauseOnFocusLoss)return f(),()=>{p()}},[e.pauseOnFocusLoss]);function f(){document.hasFocus()||_(),window.addEventListener(`focus`,g),window.addEventListener(`blur`,_)}function p(){window.removeEventListener(`focus`,g),window.removeEventListener(`blur`,_)}function m(t){if(e.draggable===!0||e.draggable===t.pointerType){v();let n=a.current;o.canCloseOnClick=!0,o.canDrag=!0,n.style.transition=`none`,e.draggableDirection===`x`?(o.start=t.clientX,o.removalDistance=n.offsetWidth*(e.draggablePercent/100)):(o.start=t.clientY,o.removalDistance=n.offsetHeight*(e.draggablePercent===80?e.draggablePercent*1.5:e.draggablePercent)/100)}}function h(t){let{top:n,bottom:r,left:i,right:o}=a.current.getBoundingClientRect();t.pointerType===`mouse`&&e.pauseOnHover&&t.clientX>=i&&t.clientX<=o&&t.clientY>=n&&t.clientY<=r?_():g()}function g(){n(!0)}function _(){n(!1)}function v(){o.didMove=!1,document.addEventListener(`pointermove`,b),document.addEventListener(`pointerup`,x)}function y(){document.removeEventListener(`pointermove`,b),document.removeEventListener(`pointerup`,x)}function b(n){let r=a.current;if(o.canDrag&&r){o.didMove=!0,t&&_(),e.draggableDirection===`x`?o.delta=n.clientX-o.start:o.delta=n.clientY-o.start,o.start!==n.clientX&&(o.canCloseOnClick=!1);let i=e.draggableDirection===`x`?`${o.delta}px, var(--y)`:`0, calc(${o.delta}px + var(--y))`;r.style.transform=`translate3d(${i},0)`,r.style.opacity=`${1-Math.abs(o.delta/o.removalDistance)}`}}function x(){y();let t=a.current;if(o.canDrag&&o.didMove&&t){if(o.canDrag=!1,Math.abs(o.delta)>o.removalDistance){i(!0),e.closeToast(!0),e.collapseAll();return}t.style.transition=`transform 0.2s, opacity 0.2s`,t.style.removeProperty(`transform`),t.style.removeProperty(`opacity`)}}let S={onPointerDown:m,onPointerUp:h};return s&&c&&(S.onMouseEnter=_,e.stacked||(S.onMouseLeave=g)),d&&(S.onClick=e=>{u&&u(e),o.canCloseOnClick&&l(!0)}),{playToast:g,pauseToast:_,isRunning:t,preventExitTransition:r,toastRef:a,eventHandlers:S}}function Pt(e){return Qt.createElement(vn,{...e},Qt.createElement(`path`,{d:`M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z`}))}function Ft(e){return Qt.createElement(vn,{...e},Qt.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z`}))}function It(e){return Qt.createElement(vn,{...e},Qt.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z`}))}function Lt(e){return Qt.createElement(vn,{...e},Qt.createElement(`path`,{d:`M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z`}))}function Rt(){return Qt.createElement(`div`,{className:`Toastify__spinner`})}function zt({theme:e,type:t,isLoading:n,icon:r}){let i=null,a={theme:e,type:t};return r===!1||(nn(r)?i=r({...a,isLoading:n}):(0,Qt.isValidElement)(r)?i=(0,Qt.cloneElement)(r,a):n?i=yn.spinner():bn(t)&&(i=yn[t](a))),i}function Bt(e){let t={...Tn,...e},n=e.stacked,[r,i]=(0,qt.useState)(!0),a=(0,qt.useRef)(null),{getToastToRender:o,isToastActive:s,count:c}=Mt(t),{className:l,style:u,rtl:d,containerId:f,hotKeys:p}=t;function m(e){let t=ut(`Toastify__toast-container`,`Toastify__toast-container--${e}`,{"Toastify__toast-container--rtl":d});return nn(l)?l({position:e,rtl:d,defaultClassName:t}):ut(t,an(l))}function h(){n&&(i(!0),H.play())}return _n(()=>{if(n){let e=a.current.querySelectorAll(`[data-in="true"]`),n=t.position?.includes(`top`),i=0,o=0;Array.from(e).reverse().forEach((e,t)=>{let a=e;a.classList.add(`Toastify__toast--stacked`),t>0&&(a.dataset.collapsed=`${r}`),a.dataset.pos||(a.dataset.pos=n?`top`:`bot`);let s=i*(r?.2:1)+(r?0:12*t),c=Math.max(.5,1-(r?o:0));a.style.setProperty(`--y`,`${n?s:s*-1}px`),a.style.setProperty(`--g`,`12`),a.style.setProperty(`--s`,`${c}`),i+=a.offsetHeight,o+=.025})}},[r,c,n]),(0,qt.useEffect)(()=>{function e(e){var t;let n=a.current;p(e)&&((t=n?.querySelector(`[tabIndex="0"]`))==null||t.focus(),i(!1),H.pause()),e.key===`Escape`&&(document.activeElement===n||n!=null&&n.contains(document.activeElement))&&(i(!0),H.play())}return document.addEventListener(`keydown`,e),()=>{document.removeEventListener(`keydown`,e)}},[p]),qt.createElement(`section`,{ref:a,className:`Toastify`,id:f,onMouseEnter:()=>{n&&(i(!1),H.pause())},onMouseLeave:h,"aria-live":`polite`,"aria-atomic":`false`,"aria-relevant":`additions text`,"aria-label":t[`aria-label`]},o((e,t)=>{let r=t.length?{...u}:{...u,pointerEvents:`none`};return qt.createElement(`div`,{tabIndex:-1,className:m(e),"data-stacked":n,style:r,key:`c-${e}`},t.map(({content:e,props:t})=>qt.createElement(xn,{...t,stacked:n,collapseAll:h,isIn:s(t.toastId,t.containerId),key:`t-${t.key}`},e)))}))}function Vt(e){return On(En,e.nonce),$t.createElement(Bt,{...e})}var Ht,Ut,Wt,Gt,Kt,qt,Jt,Yt,Xt,Zt,Qt,$t,en,tn,nn,rn,an,on,sn,cn,ln,un,dn,fn,pn,mn,hn,gn,_n,vn,yn,bn,xn,Sn,Cn,wn,Tn,En,Dn,On,kn=t((()=>{Ht=e(V(),1),Ut=e(V(),1),Wt=e(V(),1),Gt=e(V(),1),Kt=e(V(),1),lt(),qt=e(V(),1),Jt=e(V(),1),Yt=e(V(),1),Xt=e(V(),1),Zt=e(V(),1),Qt=e(V(),1),$t=e(V(),1),en=e=>typeof e==`number`&&!isNaN(e),tn=e=>typeof e==`string`,nn=e=>typeof e==`function`,rn=e=>tn(e)||en(e),an=e=>tn(e)||nn(e)?e:null,on=(e,t)=>e===!1||en(e)&&e>0?e:t,sn=e=>(0,Ht.isValidElement)(e)||tn(e)||nn(e)||en(e),cn=1,ln=()=>`${cn++}`,un=new Map,dn=[],fn=new Set,pn=e=>fn.forEach(t=>t(e)),mn=()=>un.size>0,hn=(e,{containerId:t})=>un.get(t||1)?.toasts.get(e),gn=(e={})=>{un.forEach(t=>{t.props.limit&&(!e.containerId||t.id===e.containerId)&&t.clearQueue()})},H.loading=(e,t)=>Dt(e,Ot(`default`,{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...t})),H.promise=At,H.success=kt(`success`),H.info=kt(`info`),H.error=kt(`error`),H.warning=kt(`warning`),H.warn=H.warning,H.dark=(e,t)=>Dt(e,Ot(`default`,{theme:`dark`,...t})),H.dismiss=jt,H.clearWaitingQueue=gn,H.isActive=yt,H.update=(e,t={})=>{let n=hn(e,t);if(n){let{props:r,content:i}=n,a={delay:100,...r,...t,toastId:t.toastId||e,updateId:ln()};a.toastId!==e&&(a.staleId=e);let o=a.render||i;delete a.render,Dt(o,a)}},H.done=e=>{H.update(e,{progress:1})},H.onChange=Tt,H.play=e=>Ct(!0,e),H.pause=e=>Ct(!1,e),_n=typeof window<`u`?Xt.useLayoutEffect:Xt.useEffect,vn=({theme:e,type:t,isLoading:n,...r})=>Qt.createElement(`svg`,{viewBox:`0 0 24 24`,width:`100%`,height:`100%`,fill:e===`colored`?`currentColor`:`var(--toastify-icon-color-${t})`,...r}),yn={info:Ft,warning:Pt,success:It,error:Lt,spinner:Rt},bn=e=>e in yn,xn=e=>{let{isRunning:t,preventExitTransition:n,toastRef:r,eventHandlers:i,playToast:a}=Nt(e),{closeButton:o,children:s,autoClose:c,onClick:l,type:u,hideProgressBar:d,closeToast:f,transition:p,position:m,className:h,style:g,progressClassName:_,updateId:v,role:y,progress:b,rtl:x,toastId:S,deleteToast:C,isIn:w,isLoading:T,closeOnClick:E,theme:D,ariaLabel:O}=e,ee=ut(`Toastify__toast`,`Toastify__toast-theme--${D}`,`Toastify__toast--${u}`,{"Toastify__toast--rtl":x},{"Toastify__toast--close-on-click":E}),k=nn(h)?h({rtl:x,position:m,type:u,defaultClassName:ee}):ut(ee,h),A=zt(e),j=!!b||!c,M={closeToast:f,type:u,theme:D},te=null;return o===!1||(te=nn(o)?o(M):(0,Zt.isValidElement)(o)?(0,Zt.cloneElement)(o,M):ht(M)),Zt.createElement(p,{isIn:w,done:C,position:m,preventExitTransition:n,nodeRef:r,playToast:a},Zt.createElement(`div`,{id:S,tabIndex:0,onClick:l,"data-in":w,className:k,...i,style:g,ref:r,...w&&{role:y,"aria-label":O}},A!=null&&Zt.createElement(`div`,{className:ut(`Toastify__toast-icon`,{"Toastify--animate-icon Toastify__zoom-enter":!T})},A),mt(s,e,!t),te,!e.customProgressBar&&Zt.createElement(gt,{...v&&!j?{key:`p-${v}`}:{},rtl:x,theme:D,delay:c,isRunning:t,isIn:w,closeToast:f,hide:d,type:u,className:_,controlledProgress:j,progress:b||0})))},Sn=(e,t=!1)=>({enter:`Toastify--animate Toastify__${e}-enter`,exit:`Toastify--animate Toastify__${e}-exit`,appendPosition:t}),Cn=ft(Sn(`bounce`,!0)),wn=ft(Sn(`slide`,!0)),ft(Sn(`zoom`)),ft(Sn(`flip`)),Tn={position:`top-right`,transition:Cn,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:`touch`,draggablePercent:80,draggableDirection:`x`,role:`alert`,theme:`light`,"aria-label":`Notifications Alt+T`,hotKeys:e=>e.altKey&&e.code===`KeyT`},En=`:root {
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
`,Dn=new Map,On=(e,t)=>{_n(()=>{if(!e||typeof document>`u`)return;let n=document,r=Dn.get(n);if(r){t&&r.setAttribute(`nonce`,t);return}let i=n.createElement(`style`);i.textContent=e,t&&i.setAttribute(`nonce`,t),n.head.appendChild(i),Dn.set(n,i)},[t])}})),An,jn,Mn,Nn,Pn,Fn,In,Ln=t((()=>{An=`--nested-drawers`,jn=`--drawer-height`,Mn=`--drawer-frontmost-height`,Nn=`--drawer-swipe-movement-x`,Pn=`--drawer-swipe-movement-y`,Fn=`--drawer-snap-point-offset`,In=`--drawer-swipe-strength`})),Rn,zn=t((()=>{Rn=`--drawer-swipe-progress`})),Bn,Vn,Hn=t((()=>{Bn=e(V(),1),Pe(),ve(),A(),Ln(),zn(),Vn=Bn.forwardRef(function(e,t){let{render:n,className:r,style:i,forceRender:a=!1,...o}=e,s=Be(),c=s.useState(`open`),l=s.useState(`nested`),u=s.useState(`mounted`),d={open:c,transitionStatus:s.useState(`transitionStatus`)};return Ee(`div`,e,{state:d,ref:[s.context.backdropRef,t],stateAttributesMapping:ne,props:[{role:`presentation`,hidden:!u,style:{pointerEvents:c?void 0:`none`,userSelect:`none`,WebkitUserSelect:`none`,[Rn]:`0`,[In]:`1`}},o],enabled:a||!l})})})),Un,Wn=t((()=>{N(),Un=se})),Gn,Kn=t((()=>{Gn=`data-drawer-content`})),qn,Jn,Yn=t((()=>{qn=e(V(),1),Pe(),ve(),Kn(),Jn=qn.forwardRef(function(e,t){let{render:n,className:r,style:i,...a}=e;return Be(),Ee(`div`,e,{ref:t,props:[{[Gn]:``},a]})})})),Xn,Zn=t((()=>{R(),Xn=Me}));function Qn(){return $n.useContext(er)}var $n,er,tr=t((()=>{$n=e(V(),1),er=$n.createContext(void 0)})),nr,rr,ir,ar,or,sr,cr=t((()=>{A(),nr=`data-expanded`,rr=`data-nested-drawer-open`,ir=`data-nested-drawer-swiping`,ar=`data-swipe-dismiss`,or=`data-swipe-direction`,sr=`data-swiping`}));function lr(e){let t=ur.useContext(dr);if(e!==!0&&t===void 0)throw Error(I(90));return t}var ur,dr,fr=t((()=>{Re(),ur=e(V(),1),dr=ur.createContext(void 0)}));function pr(e,t=-(2**53-1),n=2**53-1){return Math.max(t,Math.min(e,n))}var mr=t((()=>{}));function hr(e,t){let n=e+t;return n>=0?t:-Math.sqrt(-n)-e}function gr(e,t,n){if(!Number.isFinite(t)||t<=0)return null;if(typeof e==`number`)return Number.isFinite(e)?e<=1?pr(e,0,1)*t:e:null;let r=e.trim();if(r.endsWith(`px`)){let e=Number.parseFloat(r);return Number.isFinite(e)?e:null}if(r.endsWith(`rem`)){let e=Number.parseFloat(r);return Number.isFinite(e)?e*n:null}return null}function _r(e,t){let n=-1,r=1/0;for(let i=0;i<e.length;i+=1){let a=Math.abs(e[i]-t);a<r&&(r=a,n=i)}return n}function vr(){let e=Be(),{snapPoints:t,activeSnapPoint:n,setActiveSnapPoint:r,popupHeight:a}=lr(),o=e.useState(`viewportElement`),[s,c]=yr.useState(0),[u,d]=yr.useState(16),f=l(()=>{let e=S(o).documentElement;c(o?o.offsetHeight:e.clientHeight);let t=parseFloat(getComputedStyle(e).fontSize);Number.isFinite(t)&&d(t)});i(()=>{if(f(),!o||typeof ResizeObserver!=`function`)return;let e=new ResizeObserver(f);return e.observe(o),()=>{e.disconnect()}},[f,o]);let p=yr.useMemo(()=>{if(!t||t.length===0||s<=0||a<=0)return[];let e=Math.min(a,s),n=t.map(t=>{let n=gr(t,s,u);if(n===null)return null;let r=pr(n,0,e);return{value:t,height:r,offset:Math.max(0,a-r)}}).filter(e=>!!e);if(n.length<=1)return n;let r=[],i=[];for(let e=n.length-1;e>=0;--e){let t=n[e];i.some(e=>Math.abs(e-t.height)<=1)||(i.push(t.height),r.push(t))}return r.reverse(),r},[a,u,t,s]);return{snapPoints:t,activeSnapPoint:n,setActiveSnapPoint:r,popupHeight:a,viewportHeight:s,resolvedSnapPoints:p,activeSnapPointOffset:yr.useMemo(()=>{if(n===null)return;let e=p.find(e=>Object.is(e.value,n));if(e)return e;let t=Math.min(a,s),r=gr(n,s,u);if(r===null)return;let i=pr(r,0,t);return p[_r(p.map(e=>e.height),i)]},[n,a,p,u,s])?.offset??null}}var yr,br=t((()=>{yr=e(V(),1),He(),O(),h(),mr(),Pe(),fr()}));function xr(){return Sr.useContext(Cr)}var Sr,Cr,wr=t((()=>{Sr=e(V(),1),Cr=Sr.createContext(null)}));function Tr(){Or||=(typeof CSS<`u`&&`registerProperty`in CSS&&([Nn,Pn,Fn].forEach(e=>{try{CSS.registerProperty({name:e,syntax:`<length>`,inherits:!1,initialValue:`0px`})}catch{}}),[{name:Rn,initialValue:`0`},{name:In,initialValue:`1`}].forEach(({name:e,initialValue:t})=>{try{CSS.registerProperty({name:e,syntax:`<number>`,inherits:!1,initialValue:t})}catch{}})),!0)}var Er,Dr,Or,kr,Ar,jr=t((()=>{Er=e(V(),1),He(),O(),xe(),a(),Pe(),ve(),A(),zn(),Ln(),cr(),Le(),g(),F(),fr(),br(),wr(),Ie(),Dr=Ue(),Or=!1,kr={...ne,expanded(e){return e?{[nr]:``}:null},nestedDrawerOpen(e){return e?{[rr]:``}:null},nestedDrawerSwiping(e){return e?{[ir]:``}:null},swipeDirection(e){return{[or]:e}},swiping(e){return e?{[sr]:``}:null}},Ar=Er.forwardRef(function(e,t){let{render:n,className:r,style:a,finalFocus:o,initialFocus:s,...c}=e,u=Be(),d=u.context.popupRef,{swipeDirection:f,frontmostHeight:p,hasNestedDrawer:m,nestedSwiping:h,nestedSwipeProgressStore:g,onPopupHeightChange:v,notifyParentFrontmostHeight:b,notifyParentHasNestedDrawer:x}=lr(),S=u.useState(`descriptionElementId`),w=u.useState(`disablePointerDismissal`),T=u.useState(`floatingRootContext`),E=u.useState(`popupProps`),D=u.useState(`modal`),O=u.useState(`mounted`),ee=u.useState(`nested`),k=u.useState(`nestedOpenDrawerCount`),A=u.useState(`transitionStatus`),j=u.useState(`open`),M=u.useState(`openMethod`),te=u.useState(`titleElementId`),ne=u.useState(`role`),re=T.useState(`floatingId`),N=c.id??re,P=xr();C();let{snapPoints:F,activeSnapPoint:I,activeSnapPointOffset:L}=vr(),ie=k>0,R=P?.swiping??!1,z=P?.swipeStrength??null,[oe,se]=Er.useState(0),ce=Er.useRef(0),le=l(()=>{let e=d.current;if(!e)return;let t=e.offsetHeight;if(ce.current>0&&p>ce.current&&t>ce.current)return;if(ce.current>0&&m){let e=ce.current;se(e),v(e);return}let n=t;n!==ce.current&&(ce.current=n,se(n),v(n))});i(()=>{if(!O){ce.current=0,se(0),v(0);return}let e=d.current;if(!e||(Tr(),le(),typeof ResizeObserver!=`function`))return;let t=new ResizeObserver(le);return t.observe(e),()=>{t.disconnect()}},[le,O,ie,v,d]),i(()=>{let e=()=>{let e=d.current;if(!e)return;let t=g.getSnapshot();t>0?e.style.setProperty(Rn,`${t}`):e.style.setProperty(Rn,`0`)};e();let t=g.subscribe(e),n=d.current;return()=>{t(),n&&n.style.setProperty(Rn,`0`)}},[g,d]),i(()=>{if(j)return b?.(p),()=>{b?.(0)}},[p,j,b]),i(()=>{if(x)return x(j||A===`ending`),()=>{x(!1)}},[x,j,A]),_({open:j,ref:d,onComplete(){j&&u.context.onOpenChangeComplete?.(!0)}});let ue=s===void 0?d:s,de=u.useStateSetter(`popupElement`),pe={open:j,nested:ee,transitionStatus:A,expanded:I===1,nestedDrawerOpen:ie,nestedDrawerSwiping:h,swipeDirection:f,swiping:R},me;oe&&(m||A===`ending`)&&(me=`${oe}px`);let he=F&&F.length>0&&(f===`down`||f===`up`),ge=null;he&&L!==null&&(ge=f===`up`?-L:L);let _e=P?P.getDragStyles():ae;if(he&&f===`down`){let e=L??0,t=Number.parseFloat(String(_e[Pn]));_e=R&&Number.isFinite(t)?{..._e,transform:void 0,[Pn]:`${hr(e,t)}px`}:{..._e,transform:void 0}}let ve=Ee(`div`,e,{state:pe,props:[E,{id:N,"aria-labelledby":te,"aria-describedby":S,role:ne,...fe,hidden:!O,onKeyDown(e){ze.has(e.key)&&e.stopPropagation()},style:{..._e,[Rn]:`0`,[An]:k,[jn]:me,[Fn]:typeof ge==`number`?`${ge}px`:`0px`,[Mn]:p?`${p}px`:void 0,[In]:typeof z==`number`&&Number.isFinite(z)&&z>0?`${z}`:`1`}},c],ref:[t,d,de],stateAttributesMapping:kr});return(0,Dr.jsx)(y,{context:T,openInteractionType:M,disabled:!O,closeOnFocusOut:!w,initialFocus:ue,returnFocus:o,modal:D!==!1,restoreFocus:`popup`,children:ve})})})),Mr,Nr=t((()=>{Ne(),Mr=re}));function Pr({controlled:e,default:t,name:n,state:r=`value`}){let{current:i}=Fr.useRef(e!==void 0),[a,o]=Fr.useState(()=>t);return[i&&e!==void 0?e:a,Fr.useCallback(e=>{i||o(e)},[])]}var Fr,Ir=t((()=>{Fr=e(V(),1)}));function Lr(e){let{children:t,open:n,defaultOpen:r=!1,onOpenChange:i,onOpenChangeComplete:a,disablePointerDismissal:o=!1,modal:s=!0,actionsRef:c,handle:u,triggerId:d,defaultTriggerId:f=null,swipeDirection:p=`down`,snapToSequentialPoints:m=!1,snapPoints:h,snapPoint:g,defaultSnapPoint:_,onSnapPointChange:v}=e,y=lr(!0),b=y?.onNestedSwipeProgressChange,x=y?.onNestedFrontmostHeightChange,S=y?.onNestedSwipingChange,C=y?.onNestedDrawerPresenceChange,[w,T]=Br.useState(0),[E,D]=Br.useState(0),[O,ee]=Br.useState(!1),[k,A]=Br.useState(!1),[j]=Br.useState(Rr),M=_===void 0?h?.[0]??null:_,te=g!==void 0,[ne,re]=Pr({controlled:g,default:M,name:`Drawer`,state:`snapPoint`}),N=Br.useRef(!1),P=Br.useRef(!1),F=l((e,t)=>{let n=t??de(`none`);v?.(e,n),!n.isCanceled&&re(e)}),I=Br.useMemo(()=>te||!h||h.length===0?ne:ne===null||!h.some(e=>Object.is(e,ne))?M:ne,[ne,te,M,h]),L=l(e=>{T(e),!N.current&&e>0&&D(e)}),ie=l(e=>{if(e>0){N.current=!0,D(e);return}N.current=!1,w>0&&D(w)}),ae=l(e=>{ee(e)}),R=l(e=>{j.set(e),b?.(e)}),z=l(e=>{A(e),S?.(e)}),se=l((e,t)=>{i?.(e,t),!t.isCanceled&&!e&&h&&h.length>0&&F(M,de(t.reason,t.event,t.trigger))}),ce=Br.useMemo(()=>({swipeDirection:p,swipeAreaActiveRef:P,snapToSequentialPoints:m,snapPoints:h,activeSnapPoint:I,setActiveSnapPoint:F,frontmostHeight:E,popupHeight:w,hasNestedDrawer:O,nestedSwiping:k,nestedSwipeProgressStore:j,onNestedDrawerPresenceChange:ae,onPopupHeightChange:L,onNestedFrontmostHeightChange:ie,onNestedSwipingChange:z,onNestedSwipeProgressChange:R,notifyParentFrontmostHeight:x,notifyParentSwipingChange:S,notifyParentSwipeProgressChange:b,notifyParentHasNestedDrawer:C}),[I,E,O,k,j,C,b,S,x,ae,ie,R,z,L,w,F,h,m,P,p]),le=typeof t==`function`?e=>(0,Vr.jsxs)(Br.Fragment,{children:[Hr||=(0,Vr.jsx)(zr,{}),t(e)]}):(0,Vr.jsxs)(Br.Fragment,{children:[Ur||=(0,Vr.jsx)(zr,{}),t]}),ue=oe(`drawer`,{open:n,defaultOpen:r,onOpenChange:se,onOpenChangeComplete:a,disablePointerDismissal:o,modal:s,actionsRef:c,handle:u,triggerId:d,defaultTriggerId:f,children:le});return(0,Vr.jsx)(dr.Provider,{value:ce,children:ue})}function Rr(){let e=0,t=new Set;return{getSnapshot:()=>e,set(n){let r=Number.isFinite(n)?n:0;r!==e&&(e=r,t.forEach(e=>{e()}))},subscribe(e){return t.add(e),()=>{t.delete(e)}}}}function zr(){let e=Qn(),t=Be(!1),n=e?.setDrawerOpen,r=e?.removeDrawer,a=t.useState(`open`),o=t.useState(`nestedOpenDialogCount`),c=t.useState(`popupElement`),l=o===0;return i(()=>{if(r)return()=>{r(t)}},[r,t]),i(()=>{n?.(t,a)},[a,n,t]),Br.useEffect(()=>{if(!a||!l||!_e)return;let e=s(c).CloseWatcher;if(!e)return;function n(e){if(!t.select(`open`))return;let n=de(Ve,e);e.cancelable||(n.cancel=z),t.setOpen(!1,n),n.isCanceled&&e.preventDefault()}let r=new e,i=f(r,`cancel`,n);return()=>{i(),r.destroy()}},[t,l,a,c]),null}var Br,Vr,Hr,Ur,Wr=t((()=>{Br=e(V(),1),Se(),xe(),Ir(),He(),O(),h(),ke(),fr(),v(),Fe(),Pe(),ce(),tr(),Vr=Ue()}));function Gr(e,t=!1){let{overflowY:n}=D(e);return n!==`auto`&&n!==`scroll`?!1:t?e.clientHeight>0:e.scrollHeight>e.clientHeight}function Kr(e,t=!1){let{overflowX:n}=D(e);return n!==`auto`&&n!==`scroll`?!1:t?e.clientWidth>0:e.scrollWidth>e.clientWidth}function qr(e,t,n=!1){return t===`vertical`?Gr(e,n):Kr(e,n)}function Jr(e,t,n,r=!1){let i=e;for(;Ce(i)&&i!==t&&!M(i);){if(d(i)&&qr(i,n,r))return i;i=ee(i)}return null}function Yr(e,t,n=`vertical`,r=!1){return Jr(e,t,n,r)??(qr(t,n,r)?t:null)}var Xr=t((()=>{p()}));function Zr(e,t,n){return typeof e?.elementFromPoint==`function`?e.elementFromPoint(t,n):null}var Qr=t((()=>{}));function $r(e,t){let n=(t??s(e).getComputedStyle(e)).transform,r=0,i=0,a=1;if(n&&n!==`none`){let e=n.match(/matrix(?:3d)?\(([^)]+)\)/);if(e){let t=e[1].split(`, `).map(parseFloat);t.length===6?(r=t[4],i=t[5],a=Math.sqrt(t[0]*t[0]+t[1]*t[1])):t.length===16&&(r=t[12],i=t[13],a=t[0])}}return{x:r,y:i,scale:a}}var ei=t((()=>{h()}));function ti(e,t,n){switch(e){case`up`:return-n;case`down`:return n;case`left`:return-t;case`right`:return t;default:return 0}}function ni(e){return Number.isFinite(e)&&e>0?e:null}function ri(e,t){return`translate3d(${e.x}px,${e.y}px,0) scale(${t})`}function ii(e){return e%2==1}function ai(e,t,n){let r=e[n];if(typeof r==`function`)try{r.call(e,t)}catch(e){if(e&&typeof e==`object`&&`name`in e&&e.name===`NotFoundError`)return;throw e}}function oi(e){let{enabled:t,directions:n,elementRef:i,movementCssVars:a,canStart:o,ignoreSelectorWhenTouch:s=!0,ignoreScrollableAncestors:c=!1,swipeThreshold:u,onDismiss:d,onProgress:f,onCancel:p,onSwipeStart:m,onRelease:h,onSwipingChange:g,trackDrag:_=!0}=e,v=pi,y=n.length===1?n[0]:void 0,x=Math.max(0,typeof u==`number`?u:si),C=n.includes(`left`),w=n.includes(`right`),T=n.includes(`up`),E=n.includes(`down`),D=C||w,O=T||E,ee=D?`horizontal`:`vertical`,[k,A]=U.useState(void 0),[j,M]=U.useState(!1),[ne,re]=U.useState(!1),N=U.useRef({x:0,y:0}),P=U.useRef({x:0,y:0}),F=U.useRef(null),I=U.useRef({x:0,y:0,scale:1}),L=U.useRef(void 0),ie=U.useRef(0),ae=U.useRef(!1),R=U.useRef({x:0,y:0}),z=U.useRef(!1),oe=U.useRef(!1),se=U.useRef(null),ce=U.useRef(!1),le=U.useRef(!1),ue=U.useRef({width:0,height:0}),de=U.useRef(0),fe=U.useRef(x),pe=U.useRef(null),me=U.useRef(null),he=U.useRef(null),ge=U.useRef(!1),_e=U.useRef({x:0,y:0}),ve=U.useRef(null),ye=U.useRef(!1),be=U.useRef(null),xe=l(e=>{ye.current!==e&&(ye.current=e,M(e),g?.(e))});function Se(e){if(!e)return;let t=i.current,n=pe.current;if(!t||!n)return;let r=n({element:t,direction:e});fe.current=Math.max(0,r)}let Ce=l((e,t)=>{let n=Number.isFinite(e)?pr(e,0,1):0,r=n!==de.current,i=!1;if(t){let e=ve.current;i=!e||e.deltaX!==t.deltaX||e.deltaY!==t.deltaY||e.direction!==t.direction}(r||i)&&(de.current=n,t?ve.current=t:r&&(ve.current=null),f?.(n,t))}),B=l(e=>{let t=i.current;if(!_||!t){e||(be.current=null);return}let n=t.style,r=be.current;e?(r||(be.current=[n.transition,n.transform]),n.transition=`none`):r&&([n.transition,n.transform]=r,be.current=null);let o=P.current,s=I.current,c=o.x-s.x,l=o.y-s.y;e&&(n.transform=ri(o,s.scale)),n.setProperty(a.x,`${c}px`),n.setProperty(a.y,`${l}px`)});function we(e,t){if(t===null)return;let n=he.current;if(n&&t>n.time){let r=Math.abs(e.x-n.x)<fi&&Math.abs(e.y-n.y)<fi,i=r&&!ge.current;if(ge.current=r,i)return;let a=Math.max(t-n.time,ui);_e.current={x:(e.x-n.x)/a,y:(e.y-n.y)/a}}he.current={x:e.x,y:e.y,time:t}}let Te=U.useCallback(()=>{A(void 0),xe(!1),re(!1),Ce(0),fe.current=x,pe.current=null,N.current={x:0,y:0},P.current={x:0,y:0},I.current={x:0,y:0,scale:1},L.current=void 0,ie.current=0,ae.current=!1,R.current={x:0,y:0},z.current=!1,F.current=null,oe.current=!1,se.current=null,ce.current=!1,le.current=!1,ue.current={width:0,height:0},me.current=null,he.current=null,ge.current=!1,_e.current={x:0,y:0},ve.current=null,B(!1)},[xe,x,B,Ce]);function Ee(e){if(`touches`in e){let t=e.touches[0];return t?{x:t.clientX,y:t.clientY}:null}return{x:e.clientX,y:e.clientY}}function De(e){return`touches`in e||e.pointerType===`touch`}function Oe(e,t){let n=i.current?.getRootNode();return Zr(n,e.x,e.y)??r(t)}function ke(e,t){return(n=>{let r=Yr(e,t,n),i=S(r);return r===i.body||r===i.documentElement?null:r})(ee)}function Ae(e,t,n){ce.current=!1;let r=De(e),a=Oe(t,e.nativeEvent),o=S(i.current).body,l=r&&o?ke(a,o):null,d=n?.ignoreScrollableTarget??!1;if(l&&!d||(ce.current=!!(l&&d),te(a,v)&&(!r||s)))return!1;let f=i.current;if(c&&f&&a&&!(n?.ignoreScrollableAncestors??!1)&&Jr(a,f,ee)!=null)return!1;if(ae.current=!1,L.current=void 0,ie.current=0,N.current=t,me.current=ni(e.timeStamp),he.current=null,ge.current=!1,_e.current={x:0,y:0},R.current=t,F.current=t,fe.current=x,pe.current=typeof u==`function`?u:null,f){ue.current={width:f.offsetWidth,height:f.offsetHeight},Se(y);let t=$r(f);I.current=t,P.current={x:t.x,y:t.y},we({x:t.x,y:t.y},me.current),`touches`in e||ai(f,e.pointerId,`setPointerCapture`)}return m?.(e.nativeEvent),xe(!0),z.current=!0,Ce(0),B(!0),!0}function je(){Me(),ce.current=!1,F.current=null}function Me(){oe.current=!1,se.current=null}function Ne(e){if(je(),!ye.current)return;xe(!1);let t=I.current;P.current={x:t.x,y:t.y},A(void 0),le.current=!1,B(!1);let n=i.current;n&&ai(n,e.pointerId,`releasePointerCapture`),Ce(0,{deltaX:0,deltaY:0,direction:void 0}),p?.(e.nativeEvent)}function Pe(e,t){let n=e=>Math.sign(e)*Math.abs(e)**.5,r=(e,t,r)=>!t&&e<0||!r&&e>0?n(e):e;return{x:D?r(e,C,w):n(e),y:O?r(t,T,E):n(t)}}function Fe(e,t,n){let r=(e,t,n,r,i)=>e>0&&t<=0&&r||e<0&&t>=Math.max(0,n)&&i;return O&&n!==0?r(n,e.scrollTop,e.scrollHeight-e.clientHeight,E,T):D&&t!==0?r(t,e.scrollLeft,e.scrollWidth-e.clientWidth,w,C):null}let Ie=l(e=>{if(!t||e.defaultPrevented||e.nativeEvent.defaultPrevented||!(`touches`in e)&&e.button!==0)return;let n=Ee(e);n&&(oe.current=!0,se.current=n,ce.current=!1,le.current=!(`touches`in e),(!o||o(n,{nativeEvent:e.nativeEvent,direction:y}))&&Ae(e,n)&&Me())});function Le(e,n,i){if(!t||!ye.current)return;let a=r(e.nativeEvent);if(De(e)&&!ce.current){let t=e.currentTarget;if(ke(a,t))return}if(`touches`in e||e.preventDefault(),z.current&&(z.current=!1,_)){N.current=n;let t=ni(e.timeStamp);t!==null&&(me.current=t),he.current=null,ge.current=!1}let o=n.x,s=n.y,c=i.x,l=i.y;(l<0&&s>R.current.y||l>0&&s<R.current.y)&&(R.current={x:R.current.x,y:s}),(c<0&&o>R.current.x||c>0&&o<R.current.x)&&(R.current={x:o,y:R.current.y});let u=o-N.current.x,d=s-N.current.y,f=s-R.current.y,p=o-R.current.x,m;if(!L.current)m=Math.abs(u)>=Math.abs(d)?u>0?`right`:`left`:d>0?`down`:`up`,m&&(m===`left`&&C||m===`right`&&w||m===`up`&&T||m===`down`&&E)&&(L.current=m,ie.current=ti(m,u,d),A(m),Se(m));else{let e=L.current,t=ti(e,p,f);t>fe.current?(ae.current=!1,A(e)):!(C&&w)&&!(T&&E)&&ie.current-t>=ci&&(ae.current=!0)}let h=Pe(u,d),g=I.current.x,v=I.current.y;D&&(g+=h.x),O&&(v+=h.y);let b=P.current,x=g!==b.x||v!==b.y;P.current={x:g,y:v},x&&B(!0),we({x:g,y:v},ni(e.timeStamp));let S=g-I.current.x,ee=v-I.current.y,k={deltaX:S,deltaY:ee,direction:L.current},j=0,M=y??L.current;if(M){let e=M===`left`||M===`right`?ue.current.width:ue.current.height,t=I.current.scale||1,n=ti(M,S,ee);e>0&&t>0&&n>0&&(j=n/(e*t))}Ce(j,k)}let Re=l(e=>{if(!t)return;let r=P.current,a=I.current,o=r.x-a.x,s=r.y-a.y,c={deltaX:o,deltaY:s,direction:L.current};if(!ye.current){je(),Ce(0,c);return}xe(!1),je(),le.current=!1;let l=i.current;l&&(`touches`in e||ai(l,e.pointerId,`releasePointerCapture`));let u=o,f=s,p=me.current,m=ni(e.timeStamp),g=p!==null&&m!==null&&m>p?m-p:0,_=g>0?Math.max(g,li):0,v=_>0?u/_:0,b=_>0?f/_:0,x=_e.current.x,S=_e.current.y,C=he.current;if(C&&m!==null&&m>=C.time){let e=m-C.time;if(e<=di){let t=Math.max(e,ui),n=r.x-C.x,i=r.y-C.y,a=n/t,o=i/t;Math.abs(n)>=fi&&(x=a),Math.abs(i)>=fi&&(S=o)}else x=0,S=0}let w=h?.({event:e.nativeEvent,direction:L.current,deltaX:u,deltaY:f,velocityX:v,velocityY:b,releaseVelocityX:x,releaseVelocityY:S}),T=typeof w==`boolean`;if(ae.current&&!T){P.current={x:a.x,y:a.y},A(void 0),B(!1),Ce(0,c);return}let E=!1,D;if(T)E=w,D=L.current??y;else for(let e of n)if(ti(e,u,f)>fe.current){E=!0,D=e;break}E&&D?(A(D),re(!0),B(!1),d?.(e.nativeEvent,{direction:D})):(P.current={x:a.x,y:a.y},A(void 0),B(!1),Ce(0,c))}),ze=l(e=>{let t=Ee(e);if(!t)return;let n=!1;if(!(`touches`in e)){let t=ii(e.buttons);if(t&&(le.current=!0),e.buttons!==0&&!t){Ne(e);return}if(e.buttons===0&&le.current){if(!ye.current){Re(e);return}n=!0}}if(!j&&oe.current){if(!De(e)&&(e.defaultPrevented||e.nativeEvent.defaultPrevented)){je();return}if(!o||o(t,{nativeEvent:e.nativeEvent,direction:y})){let n=se.current,r=!1;if(De(e)){let a=i.current;if(n&&a){let i=Oe(t,e.nativeEvent),o=S(a).body,s=o?ke(i,o):null;if(s&&(b(a,s)||b(s,a))){let e=Fe(s,t.x-n.x,t.y-n.y);if(e===!1)return;e===!0&&(r=!0)}}}Ae(e,t,{ignoreScrollableTarget:r,ignoreScrollableAncestors:r})&&(n&&r?(Me(),N.current=n,R.current=n,F.current=n,z.current=!1):(Me(),ce.current=!1))}}let r=F.current,a=r===null?{x:0,y:0}:{x:t.x-r.x,y:t.y-r.y};F.current=t,Le(e,t,a),n&&!(`touches`in e)&&Re(e)}),Be=l((e,t)=>{ze({touches:e.touches,currentTarget:t,nativeEvent:e,defaultPrevented:e.defaultPrevented,timeStamp:e.timeStamp})}),Ve=U.useCallback(()=>{let e=ye.current,t=P.current,n=I.current,r=t.x-n.x,i=t.y-n.y;return!e&&r===0&&i===0&&!ne?{[a.x]:`0px`,[a.y]:`0px`}:{transition:e?`none`:void 0,transform:e?ri(t,n.scale):void 0,[a.x]:`${r}px`,[a.y]:`${i}px`}},[ne,a]);return{swiping:j,swipeDirection:k,dragDismissed:ne,getPointerProps:U.useCallback(()=>t?{onPointerDown:Ie,onPointerMove:ze,onPointerUp:Re,onPointerCancel:Re}:{},[t,Re,ze,Ie]),getTouchProps:U.useCallback(()=>t?{onTouchStart:Ie,onTouchMove:ze,onTouchEnd:Re,onTouchCancel:Re}:{},[t,Re,ze,Ie]),moveNative:Be,getDragStyles:Ve,reset:Te}}var U,si,ci,li,ui,di,fi,pi,mi=t((()=>{U=e(V(),1),mr(),O(),h(),T(),Xr(),Qr(),ei(),si=40,ci=10,li=50,ui=4,di=80,fi=1,pi=`button,a,input,select,textarea,label,[role="button"]`})),hi,gi=t((()=>{he(),hi=be})),_i,vi=t((()=>{A(),_i=`data-nested-dialog-open`}));function yi(){return bi.useContext(xi)}var bi,xi,Si=t((()=>{bi=e(V(),1),xi=bi.createContext(void 0)}));function Ci(e,t){e?.toggleAttribute(sr,t)}function wi(e){return!!te(e,m)}function Ti(e){return!!te(e,na)}function Ei(e,t){return t===`left`||t===`right`?e.offsetWidth:e.offsetHeight}function Di(e,t){return Math.max(Ei(e,t)*.5,Wi)}function Oi(e,t){return e instanceof t.HTMLInputElement&&e.type===`range`}function ki(e){return e.tagName===`INPUT`||e.tagName===`TEXTAREA`}function Ai(e,t){let n=Ce(e.anchorNode)?e.anchorNode:e.anchorNode?.parentElement,r=Ce(e.focusNode)?e.focusNode:e.focusNode?.parentElement;return e.containsNode(t,!0)||b(t,n)||b(t,r)}function ji(e,t){let n=k(e);if(n&&b(t,n)&&ki(n)){let{selectionStart:e,selectionEnd:t}=n;if(e!=null&&t!=null&&e<t)return!0}let r=e.getSelection?.();return!r||r.isCollapsed?!1:Ai(r,t)}function Mi(e,t){return e.composedPath().some(e=>Oi(e,t))}function Ni(e){return Mi(e.nativeEvent,s(e.currentTarget))}function Pi(e,t){e.lastX=t.clientX,e.lastY=t.clientY}function Fi(e,t,n,r){if(e.preserveNativeCrossAxisScroll)return!0;if(e.drawerAxisAttributed||e.allowSwipe===!0||!e.hasCrossAxisGestureTarget)return!1;if(!t.cancelable)return e.preserveNativeCrossAxisScroll=!0,!0;let i=r?n.clientY-e.startY:n.clientX-e.startX,a=r?n.clientX-e.startX:n.clientY-e.startY,o=Math.abs(i),s=Math.abs(a);return s>=ea&&s>o+ta?(e.preserveNativeCrossAxisScroll=!0,!0):o>=ea?(e.drawerAxisAttributed=!0,!1):!0}function Ii(e,t){return Li(e,t).max>0}function Li(e,t){if(t===`vertical`){let t=Math.max(0,e.scrollHeight-e.clientHeight);return{offset:e.scrollTop,max:t}}let n=Math.max(0,e.scrollWidth-e.clientWidth);return{offset:e.scrollLeft,max:n}}function Ri(e,t,n){let r=Bi(n,t),{offset:i,max:a}=Li(e,t);return r?i<=0:i>=a}function zi(e,t,n,r){return(Bi(n,t)?r>0:r<0)&&Ri(e,t,n)}function Bi(e,t){return t===`vertical`?e===`down`:e===`right`}var Vi,Hi,Ui,Wi,Gi,Ki,qi,Ji,Yi,Xi,Zi,Qi,$i,ea,ta,na,ra,ia,aa=t((()=>{Vi=e(V(),1),Hi=e(o(),1),p(),Se(),h(),c(),He(),O(),mr(),Pe(),Ae(),vi(),ie(),fr(),br(),tr(),mi(),Ln(),cr(),zn(),Kn(),Fe(),v(),T(),wr(),we(),Xr(),x(),Qr(),Si(),Ui=Ue(),Wi=10,Gi=.5,Ki=.5,qi=300,Ji=4,Yi=.2,Xi=4,Zi=80,Qi=360,$i=.1,ea=6,ta=2,na=`[${Gn}]`,ra={horizontal:`[${u}="x"]`,vertical:`[${u}="y"]`},ia=Vi.forwardRef(function(e,t){let{render:n,className:a,style:o,children:s,...c}=e,u=Be(),d=u.context.popupRef,p=u.context.backdropRef,{swipeDirection:h,notifyParentSwipingChange:g,notifyParentSwipeProgressChange:_,frontmostHeight:v,snapToSequentialPoints:y,swipeAreaActiveRef:x}=lr(),C=Qn(),{snapPoints:w,resolvedSnapPoints:T,activeSnapPoint:D,activeSnapPointOffset:O,setActiveSnapPoint:ee,popupHeight:k}=vr(),A=u.useState(`open`),j=u.useState(`mounted`),M=u.useState(`nested`),ne=u.useState(`nestedOpenDrawerCount`),re=u.useState(`viewportElement`),N=u.useState(`popupElement`),P=C?.visualStateStore,F=ne>0,I=h===`left`||h===`right`?`horizontal`:`vertical`,L=I===`vertical`,ie=L?`horizontal`:`vertical`,[ae,R]=Vi.useState(null),z=Vi.useRef(void 0),oe=Vi.useRef(null),se=E(),ce=Vi.useRef(!1),le=Vi.useRef(!1),fe=Vi.useRef(``),he=Vi.useRef(!1),ge=Vi.useRef(!1),_e=Vi.useRef(null),ve=yi(),ye=Vi.useMemo(()=>{if(!w||w.length<2||T.length<2||h!==`down`&&h!==`up`)return null;let e=T.map(e=>e.offset).sort((e,t)=>e-t),t=e[0];return{minOffset:t,range:e[1]-t}},[T,w,h]),be=Vi.useMemo(()=>!ye||O===null?null:pr((O-ye.minOffset)/ye.range,0,1),[O,ye]),xe=Vi.useMemo(()=>w&&w.length>0&&(h===`down`||h===`up`)?h===`down`?[`down`,`up`]:[`up`,`down`]:[h],[w,h]),Se=l(e=>{d.current?.toggleAttribute(ar,e),p.current?.toggleAttribute(ar,e)}),B=l(()=>{Se(!1),d.current?.removeAttribute(ue),R(null)}),we=l(()=>{le.current&&(le.current=!1,g?.(!1))}),Te=l((e,t,n)=>{let r=A&&!M&&t,i=r?e:0,a=A&&t?e:0;n&&_&&(_(a),a<=0&&we()),P?.set({swipeProgress:i,frontmostHeight:i>0?v:0});let o=p.current;if(!o)return;let s=r&&i>0;o.style.setProperty(Rn,s?`${i}`:`0`),s&&v>0?o.style.setProperty(jn,`${v}px`):o.style.removeProperty(jn)});function Ee(e,t,n,r,i,a,o,s){let c=Ei(e,t);if(c<=0)return null;let l=((t===`down`||t===`up`)&&w&&w.length>0?O??0:0)+ti(t,n,r),u=Math.max(0,c-l);if(u<=0)return null;let d=ti(t,o,s),f=Math.abs(d)>0?d:ti(t,i,a);if(f<=Yi)return null;let p=(pr(u/pr(f,Yi,Xi),Zi,Qi)-Zi)/280;return $i+p*.9}function De(e){if(le.current||!e)return;let t=ti(e.direction??h,e.deltaX,e.deltaY);Math.abs(t)<Wi||(le.current=!0,g?.(!0))}let Oe=oi({enabled:j&&!F,directions:xe,elementRef:u.context.popupRef,ignoreSelectorWhenTouch:!1,ignoreScrollableAncestors:!0,movementCssVars:{x:Nn,y:Pn},onSwipeStart(e){if(`touches`in e||e.pointerType===`touch`)return;let t=d.current,n=S(t).getSelection?.();if(!n||n.isCollapsed)return;let r=Ce(n.anchorNode)?n.anchorNode:n.anchorNode?.parentElement,i=Ce(n.focusNode)?n.focusNode:n.focusNode?.parentElement;(b(t,r)||b(t,i))&&n.removeAllRanges()},onSwipingChange(e){ce.current=e,Ci(u.context.backdropRef.current,e),!e&&!_&&we()},swipeThreshold({element:e,direction:t}){return Di(e,t)},canStart(e,t){let n=u.context.popupRef.current;if(!n)return!1;let r=t.nativeEvent,i=`touches`in r||r.pointerType===`touch`,a=i?_e.current:null,o=n.ownerDocument,s=Zr(n.getRootNode(),e.x,e.y);return!(!a?.startedInPopup&&!b(n,s)||i&&ji(o,n)||a?.hasCrossAxisGestureTarget&&!a.drawerAxisAttributed&&a.allowSwipe!==!0)},onProgress(e,t){let n=ce.current;n&&De(t);let r=!!(w&&w.length>0);if(n&&h===`down`&&r&&t){let e=u.context.popupRef.current;e&&(e.style.removeProperty(`transform`),e.style.setProperty(Pn,`${hr(O??0,t.deltaY)}px`))}let i=e;if(ye&&k>0){let e=O??ye.minOffset;n&&t&&Number.isFinite(t.deltaY)?i=(e=>pr((e-ye.minOffset)/ye.range,0,1))(pr(e+t.deltaY,0,k)):be!==null&&(i=be)}n||(_?.(0),we()),Te(i,!0,n)},onRelease({event:e,deltaX:t,deltaY:n,direction:r,velocityX:i,velocityY:a,releaseVelocityX:o,releaseVelocityY:s}){let c=u.context.popupRef.current;if(!c){B();return}let l=c;function d(e){we(),Se(!0),l.style.removeProperty(`transition`),l.setAttribute(ue,``),Hi.flushSync(()=>{R(Ee(l,e,t,n,i,a,o,s))})}if(!w||w.length===0){if(!r){B();return}let e=ti(r,t,n);if(e<=0)return B(),!1;if(ti(r,i,a)>=Gi)return d(r),!0;let o=e>Di(l,r);return o?d(r):B(),o}if(h!==`down`&&h!==`up`){B();return}if(!k)return B(),!1;if(T.length===0){B();return}let f=h===`down`?n:-n,p=Math.sign(f),m=h===`down`?s:-s,g=h===`down`?a:-a,_=m;if(p!==0&&Math.abs(f)>=Wi){let e=Math.sign(_);e!==0&&e!==p&&(_=g)}let v=O??0,b=pr(v+f,0,k),x=Math.abs(_)>=Ki?pr(_,-4,Ji)*qi:0,S=y?b:pr(b+x,0,k),C=de(pe,e),E=()=>(Te(0,!0,!0),B(),!1),A=e=>(ee(e.value,C),E()),j=e=>r?(ee(null,C),C.isCanceled?E():(z.current=D,d(h),!0)):A(e);if(y){let e=[...T].sort((e,t)=>e.offset-t.offset),t=e.map(e=>e.offset),n=_r(t,v),r=e[_r(t,S)],i=Math.sign(_),a=p!==0&&i!==0&&i===p&&Math.abs(_)>=Ki,o=S;if(a){let t=pr(n+p,0,e.length-1);if(t!==n){let n=e[t];(p>0?S<n.offset:S>n.offset)&&(r=n,o=n.offset)}else if(p>0)return j(r)}return Math.abs(o-k)<Math.abs(o-r.offset)?j(r):A(r)}let M=T[_r(T.map(e=>e.offset),S)];return _>=Gi&&f>0||Math.abs(S-k)<Math.abs(S-M.offset)?j(M):A(M)},onDismiss(e){P?.set({swipeProgress:0,frontmostHeight:0});let t=u.context.backdropRef.current;t&&(t.style.setProperty(Rn,`0`),t.style.removeProperty(jn));let n=de(pe,e);if(u.setOpen(!1,n),n.isCanceled){let t=z.current;t!==void 0&&ee(t,de(pe,e)),z.current=void 0,oe.current?.(),B();return}if(u.select(`open`)){let t=e;se.request(()=>{if(u.select(`open`)){let e=z.current;e!==void 0&&ee(e,de(pe,t)),z.current=void 0,B(),oe.current?.()}else z.current=void 0});return}z.current=void 0,Se(!0)}}),ke=Oe.getPointerProps(),Ae=Oe.getTouchProps(),{moveNative:Me,reset:Ne}=Oe;oe.current=Ne,Vi.useEffect(()=>{let e=re??N;if(!e||!A||!j)return;let t=e,n=S(t);function r(e,r,i){let a=L?i.clientY-r.lastY:i.clientX-r.lastX;if(e.touches.length===2||ji(n,t)||F||Fi(r,e,i,L))return;let o=r.scrollTarget;if(!o||o===n.documentElement||o===n.body){e.cancelable&&e.preventDefault(),e.stopPropagation(),Me(e,t);return}if(!Ii(o,I)){e.cancelable&&e.preventDefault(),e.stopPropagation();return}if(a!==0){let t=zi(o,I,h,a);r.allowSwipe?e.cancelable&&e.preventDefault():e.cancelable&&t?(r.allowSwipe=!0,e.preventDefault()):r.allowSwipe=!1}r.allowSwipe===!0&&(e.stopPropagation(),Me(e,t))}function i(e){if(ve?.onTouchMove(e),ge.current)return;let t=_e.current,n=e.touches[0];n&&t&&(r(e,t,n),Pi(t,n))}return f(n,`touchmove`,i,{passive:!1,capture:!0})},[j,F,A,N,L,I,h,Me,re,ve]),i(()=>{ye&&!Oe.swiping&&Te(!A||M?0:be??0,!0,!1)},[Te,v,M,_,A,be,ye,Oe.swiping,u,P]),i(()=>{if(_)return A||_(0),()=>{_(0)}},[_,A]),i(()=>{A&&(x.current||Ne(),B())},[B,A,Ne,x]),i(()=>{let e=p.current;return()=>{P?.set({swipeProgress:0,frontmostHeight:0}),Ci(e,!1);let t=p.current;t!==e&&Ci(t,!1),we()}},[p,we,P]);let Pe=Vi.useMemo(()=>({swiping:Oe.swiping,getDragStyles:Oe.getDragStyles,swipeStrength:ae??null,setSwipeDismissed:Se}),[Se,Oe.getDragStyles,Oe.swiping,ae]);function Fe(e){ge.current=e,_e.current=null}function Ie(){Fe(!1),fe.current=``,he.current=!1}function Le(e){return fe.current=``,e.pointerType!==`touch`}return(0,Ui.jsx)(me,{ref:t,className:a,style:o,render:n,...je(c,{onPointerDown(e){if(fe.current=e.pointerType,he.current=e.pointerType===`pen`,!A||!j||F)return;let t=Zr(e.currentTarget.getRootNode(),e.clientX,e.clientY);wi(t)||Ti(t)||e.pointerType!==`touch`&&ke.onPointerDown?.(e)},onPointerMove(e){e.pointerType!==`touch`&&ke.onPointerMove?.(e)},onPointerUp(e){Le(e)&&ke.onPointerUp?.(e)},onPointerCancel(e){Le(e)&&ke.onPointerCancel?.(e)},onTouchStart(e){if(fe.current===`pen`&&he.current){he.current=!1,Fe(!1);return}if(!A||!j||F){Fe(!1);return}let t=e.touches[0];if(!t)return;if(Ni(e)){Fe(!1);return}let n=e.currentTarget,i=Zr(n.getRootNode(),t.clientX,t.clientY),a=r(e.nativeEvent),o=Ce(a)?a:n;if(!b(n,o)){Fe(!0);return}if(ve?.onTouchStart(e),te(i,`${m}:not(${ra[ie]})`)){Fe(!0);return}ge.current=!1;let s=Yr(o,n,I),c=Yr(o,n,ie)!=null||te(i,ra[ie])!=null,l=null;s&&(l=Ri(s,I,h)?null:!1),_e.current={startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastY:t.clientY,startedInPopup:b(d.current,i),scrollTarget:s,hasCrossAxisGestureTarget:c,allowSwipe:l,preserveNativeCrossAxisScroll:!1,drawerAxisAttributed:!1},Ae.onTouchStart?.(e)},onTouchEnd(e){ve?.onTouchEnd(e),Ie(),Ae.onTouchEnd?.(e)},onTouchCancel(e){ve?.onTouchCancel(),Ie(),Ae.onTouchCancel?.(e)},[_i]:void 0}),children:(0,Ui.jsx)(Cr.Provider,{value:Pe,children:s})})})})),oa,sa=t((()=>{oa=`--drawer-keyboard-inset`}));function ca(e){let{children:t}=e,n=Be(),i=n.useState(`open`),a=n.useState(`mounted`),o=n.useState(`modal`),c=n.useState(`nestedOpenDialogCount`),u=n.useState(`viewportElement`),d=c>0,p=va.useRef(!1),m=va.useRef(null),h=va.useRef(null),g=va.useRef(null),_=va.useRef(!1),v=va.useRef(null),y=E(),x=De(),C=l(()=>{let e=g.current;e&&(e.element.style.overflowAnchor=e.overflowAnchor,e.element.style.paddingBottom=e.paddingBottom,e.element.style.scrollPaddingBottom=e.scrollPaddingBottom,g.current=null)}),w=l((e,t)=>{let n=Math.max(0,Math.ceil(t)),r=g.current;if(r&&!r.element.isConnected&&(C(),r=null),n===0){C();return}if(r&&r.element!==e&&(C(),r=null),!r){let t=D(e);r={element:e,overflowAnchor:e.style.overflowAnchor,paddingBottom:e.style.paddingBottom,scrollPaddingBottom:e.style.scrollPaddingBottom,computedPaddingBottom:Number.parseFloat(t.paddingBottom)||0,computedScrollPaddingBottom:Number.parseFloat(t.scrollPaddingBottom)||0},g.current=r}e.style.overflowAnchor=`none`,e.style.paddingBottom=`${n+Math.max(r.computedPaddingBottom,xa)}px`,e.style.scrollPaddingBottom=`${r.computedScrollPaddingBottom+xa}px`}),T=l((e,t)=>{let n=s(e).matchMedia?.(`(prefers-reduced-motion: reduce)`)?.matches?`auto`:`smooth`;e.scrollTo({top:t,behavior:n})}),O=l(()=>{p.current=!1,m.current=null});va.useEffect(()=>{if(!a||!i){h.current=null,C(),y.cancel();return}if(!u){C();return}let e=S(u),t=s(u),n=t.visualViewport,c=null,l=0,p=0,m=-1,g=-1,E=null,D=()=>{if(!n||n.scale!==1)return null;let r=t.innerHeight,i=n.height;if(r-i>ba)g=i;else if(Math.abs(i-g)>ba)return g=-1,null;E||(E=e.createElement(`div`),E.style.cssText=`position:fixed;top:0;height:100svh;visibility:hidden`,e.body.appendChild(E));let a=E.offsetHeight-i<=ba,o=Math.max(0,n.offsetTop);return{top:o,bottom:a?r:Math.min(r,o+i),resizing:a&&Math.abs(r-i)>=1}};v.current=D;let O=e=>{u.style.setProperty(oa,`${Math.max(0,Math.ceil(e))}px`)},ee=t.scrollX,A=t.scrollY,j=()=>o!==!0||d||!h.current||t.scrollX===ee&&t.scrollY===A||D()==null?!1:(t.scrollTo({left:ee,top:A,behavior:`instant`}),!0),M=null,te=()=>{M?.(),M=null},ne=(e,t)=>{te();let n=e.getBoundingClientRect();M=ga(e,(t.top+t.bottom-n.top-n.bottom)/2)},re=()=>{te();let e=h.current;if(d||!e||!b(u,e)){O(0),C();return}j();let n=D();if(!n){O(0),C();return}O(Math.max(0,t.innerHeight-n.bottom));let r=_a(e,u);if(!r){C();return}let i=r.getBoundingClientRect(),a=Math.min(i.bottom,n.bottom),o=Math.max(0,i.bottom-n.bottom);w(r,o);let s=Math.max(0,r.scrollHeight-r.clientHeight);if(s<=0)return;let f=Math.max(i.top,n.top)+xa,g=a-xa;if(g<=f)return;let _=e.getBoundingClientRect(),v=r.scrollTop+(_.top+_.bottom-f-g)/2,x=Math.round(pr(v,0,s));if(!(c===r&&!n.resizing&&Math.abs(l-x)<=1)){let e=c===r?p+1:1;if(c=r,l=x,p=e,m=-1,e<=wa){y.request(re);return}}else if(m>=0){let e=r.scrollTop;if(Math.abs(e-x)<=1)return;if(e!==m){m=e;return}}c=r,l=x,p=0,m=r.scrollTop,T(r,x)},N=()=>{y.request(re)},P=()=>{let e=Ca,t=()=>{re(),--e,e>0&&x.start(Sa,t)};x.start(Sa,t)},F=()=>{h.current=null,g=-1,x.clear(),N()},I=e=>{if(d)return!1;let t=ua(e);return!t||!b(u,t)?!1:(h.current!==t&&(c=null),h.current=t,!0)},L=e=>{let t=h.current;M&&t&&t===r(e)&&t.focus({preventScroll:!0})},ie=e=>{if(_.current=!1,te(),!I(r(e))){F();return}D()!=null&&P(),N()},ae=e=>{if(!_.current){if(I(e.relatedTarget)){let e=h.current,t=D();e&&t&&ne(e,t),N();return}F()}},R=()=>{(h.current||I(k(e)))&&N()},z=[];return n&&z.push(f(n,`resize`,R),f(n,`scroll`,R),f(t,`resize`,R)),z.push(f(e,`focus`,L,!0),f(e,`focusin`,ie,!0),f(e,`focusout`,ae,!0),f(t,`scroll`,()=>{j()&&N()}),f(e,`pointerdown`,()=>{h.current&&y.cancel(),x.clear(),c=null},!0)),I(k(e))&&N(),()=>{z.forEach(e=>e()),te(),h.current=null,C(),y.cancel(),x.clear(),v.current=null,E?.remove(),u.style.removeProperty(oa)}},[T,y,x,o,a,d,i,C,u,w]);let ee=l(e=>{let t=e.touches[0];p.current=!1,m.current={x:t.clientX,y:t.clientY}}),A=l(e=>{let t=e.touches[0],n=m.current;t&&n&&!p.current&&(Math.abs(t.clientX-n.x)>Ta||Math.abs(t.clientY-n.y)>Ta)&&(p.current=!0)}),j=l(e=>{if(!i||!a||d||!u||!m.current||p.current){O();return}let t=e.changedTouches[0]??e.touches[0],n=u.getRootNode(),o=r(e.nativeEvent),c=t?pa(n,t.clientX,t.clientY):null;if(c===Oa){O();return}let l=t&&(c??da(o));if(l&&(!b(u,l.focusTarget)||!b(u,l.clickTarget))){O();return}if(l){let{clickTarget:n,focusTarget:r}=l,i=s(r);if(i.visualViewport&&i.visualViewport.scale!==1){O();return}if(k(S(r))===r&&(!i.visualViewport||v.current?.()!=null)){O();return}e.preventDefault(),_.current=!0;try{ha(r)}finally{_.current=!1}ma(n,t),n!==r&&k(S(r))===r&&r.focus({preventScroll:!0}),O();return}O()}),M=va.useMemo(()=>({onTouchStart:ee,onTouchMove:A,onTouchEnd:j,onTouchCancel:O}),[j,A,ee,O]);return(0,ya.jsx)(xi.Provider,{value:M,children:t})}function la(e){if(e.isContentEditable)return!0;let t=s(e);return e instanceof t.HTMLTextAreaElement||e instanceof t.HTMLInputElement&&Da.has(e.type)?!e.matches(`:disabled`):!1}function ua(e){if(!d(e))return null;if(la(e))return e.isContentEditable?fa(e):e;let t=te(e,`label`)?.control??null;return d(t)&&la(t)?t:null}function da(e){if(!d(e))return null;let t=ua(e);return t?{focusTarget:t,clickTarget:e}:null}function fa(e){let t=e;for(;t.parentElement?.isContentEditable;)t=t.parentElement;return t}function pa(e,t,n){let r=Zr(e,t,n);if(d(r)){let e=ua(r);if(e)return{focusTarget:e,clickTarget:r}}if(j(r)||te(r,`label`)!=null)return Oa;for(let[r,i]of[[0,Ea],[0,-16],[Ea,0],[-16,0]]){let a=ua(Zr(e,t+r,n+i));if(a)return{focusTarget:a,clickTarget:a}}return null}function ma(e,t){let n=s(e),r=n.PointerEvent??n.MouseEvent;e.dispatchEvent(new r(`click`,{bubbles:!0,cancelable:!0,clientX:t.clientX,clientY:t.clientY,detail:1,view:n}))}function ha(e){let t=k(S(e))===e,n=ga(e,-2e3);try{t&&e.blur(),e.focus({preventScroll:!0})}finally{n()}}function ga(e,t){let n=e.style.opacity,r=e.style.transform,i=e.style.transition;return e.style.transition=`none`,e.style.opacity=`0`,e.style.transform=`translateY(${t}px)`,()=>{e.style.opacity=n,e.style.transform=r,e.style.transition=i}}function _a(e,t){let n=ee(e);return Yr(n,t,`vertical`)??Yr(n,t,`vertical`,!0)}var va,ya,ba,xa,Sa,Ca,wa,Ta,Ea,Da,Oa,ka=t((()=>{va=e(V(),1),p(),Se(),h(),c(),O(),mr(),ye(),Pe(),T(),Xr(),Qr(),sa(),Si(),ya=Ue(),ba=60,xa=16,Sa=150,Ca=4,wa=60,Ta=10,Ea=16,Da=new Set([`email`,`number`,`password`,`search`,`tel`,`text`,`url`]),Oa=Symbol(`KeyboardTapBlocked`)})),Aa=t((()=>{Hn(),Wn(),Yn(),Zn(),tr(),zn(),Ln(),jr(),Nr(),Wr(),mi(),ei(),cr(),fr(),gi(),aa(),ka()})),ja=t((()=>{Aa(),zn(),Ln(),cr(),sa()})),Ma=t((()=>{}));function Na(){let[e,t]=(0,Fa.useState)(()=>window.matchMedia(`(max-width: 640px)`).matches);return(0,Fa.useEffect)(()=>{let e=window.matchMedia(`(max-width: 640px)`),n=()=>t(e.matches);return e.addEventListener(`change`,n),()=>e.removeEventListener(`change`,n)},[]),e}function Pa({open:e,onOpenChange:t,onOpenChangeComplete:n,title:r,description:i,closeLabel:a=`关闭`,triggerRef:o,className:s=``,footer:c,heading:l,headerActions:u,children:d}){let[f,p]=(0,Fa.useState)(!1),[m,h]=(0,Fa.useState)(null),g=(0,Fa.useRef)(null);return(0,Fa.useEffect)(()=>p(!0),[]),(0,Ia.jsx)(Lr,{open:f&&e,onOpenChange:t,onOpenChangeComplete:n,modal:!0,swipeDirection:`down`,children:(0,Ia.jsx)(ca,{children:(0,Ia.jsxs)(Mr,{children:[(0,Ia.jsx)(Vn,{className:`mobile-filters-backdrop`}),(0,Ia.jsx)(ia,{className:`mobile-filters-viewport`,children:(0,Ia.jsxs)(Ar,{ref:h,className:`mobile-filters-popup mobile-drawer-popup ${s}`.trim(),initialFocus:g,finalFocus:o,children:[(0,Ia.jsx)(`div`,{className:`mobile-filters-drag-area`,"aria-hidden":`true`,children:(0,Ia.jsx)(`span`,{className:`mobile-filters-handle`})}),(0,Ia.jsxs)(`header`,{className:`mobile-filters-heading`,"data-base-ui-swipe-ignore":!0,children:[l??(0,Ia.jsxs)(`div`,{children:[(0,Ia.jsx)(hi,{className:`mobile-filters-title`,children:r}),i&&(0,Ia.jsx)(Xn,{className:`mobile-filters-description`,children:i})]}),u,(0,Ia.jsx)(Un,{ref:g,className:`icon-button mobile-filters-close`,"aria-label":a,children:(0,Ia.jsx)(at,{size:20})})]}),(0,Ia.jsx)(Jn,{className:`mobile-filters-content scroll-area scroll-area--vertical`,"data-base-ui-swipe-ignore":!0,children:d(m)}),c&&(0,Ia.jsx)(`footer`,{className:`mobile-filters-footer`,"data-base-ui-swipe-ignore":!0,children:c})]})})]})})})}var Fa,Ia,La=t((()=>{Fa=e(V()),ja(),st(),Ma(),Ia=Ue()}));function Ra(){let e=Na();return(0,za.useEffect)(()=>{let e=()=>{let e=document.querySelector(window.matchMedia(`(max-width: 960px)`).matches?`.sidebar`:`.topbar`)?.getBoundingClientRect().bottom||0;document.documentElement.style.setProperty(`--workspace-header-bottom`,`${Math.max(0,e)}px`)},t=new ResizeObserver(e),n=[],r=()=>{let r=[...document.querySelectorAll(`.sidebar, .topbar`)];(r.length!==n.length||r.some((e,t)=>e!==n[t]))&&(t.disconnect(),r.forEach(e=>t.observe(e)),n=r),e()},i=new MutationObserver(r);return i.observe(document.getElementById(`root`),{childList:!0,subtree:!0}),window.addEventListener(`resize`,e),r(),()=>{t.disconnect(),i.disconnect(),window.removeEventListener(`resize`,e)}},[]),(0,Ba.jsx)(Vt,{className:`mistakes-toast-container`,position:`top-right`,autoClose:4500,transition:wn,theme:`light`,limit:e?1:3,newestOnTop:!0,closeOnClick:!1,draggablePercent:15})}var za,Ba,Va=t((()=>{za=e(V()),kn(),La(),Ba=Ue()}));function Ha(e){return $a.add(e),()=>{$a.delete(e)}}function Ua(){return Xa}function Wa(){return Qa}function Ga(e){e>0&&Xa===0&&(Za+=1),Xa+=e,Qa={pending:Xa,cycle:Za},$a.forEach(e=>e())}async function Ka(e,t={},n={}){n.background||Ga(1);try{let n=await fetch(`${Ya}${e}`,{...t,credentials:`same-origin`,headers:{...t.body instanceof FormData?{}:{"Content-Type":`application/json`},...t.headers}}),r=await n.json().catch(e=>{if(e instanceof SyntaxError)return null;throw e});if(!n.ok||!r?.success)throw r?.code===`ACCOUNT_FROZEN`&&window.dispatchEvent(new Event(`mistakes:account-frozen`)),r?.code===`BACKUP_READ_ONLY`&&window.dispatchEvent(new CustomEvent(`mistakes:backup-status`,{detail:{readOnly:!0}})),new eo(r?.message||`请求失败，请稍后重试。`,n.status,r?.code);return t.method&&t.method!==`GET`&&window.dispatchEvent(new Event(`mistakes:updated`)),r.data}finally{n.background||Ga(-1)}}function qa(e,t=!1){let n=new Date(e);return Number.isNaN(n.getTime())?`—`:new Intl.DateTimeFormat(`zh-CN`,t?{month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`}:{year:`numeric`,month:`2-digit`,day:`2-digit`}).format(n)}function Ja(e){window.location.hash=e}var Ya,Xa,Za,Qa,$a,eo,to,no=t((()=>{Ya=`/api/mistakes`,Xa=0,Za=0,Qa={pending:0,cycle:0},$a=new Set,eo=class extends Error{status;code;constructor(e,t,n){super(e),this.status=t,this.code=n}},to=(e,t=`POST`)=>({method:t,body:JSON.stringify(e)})})),ro=t((()=>{})),io=t((()=>{})),ao=t((()=>{}));function W({children:e}){return(0,G.jsx)(`span`,{className:`skeleton-text skeleton-shimmer`,children:e})}function oo({children:e=`保存设置`}){return(0,G.jsx)(`span`,{className:`button skeleton-button`,children:(0,G.jsx)(W,{children:e})})}function so({label:e}){return(0,G.jsxs)(`div`,{className:`field`,children:[(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:e})}),(0,G.jsx)(`div`,{className:`skeleton-form-control skeleton-shimmer`,children:(0,G.jsx)(`input`,{disabled:!0,tabIndex:-1})})]})}function co({title:e,description:t}){return(0,G.jsxs)(`div`,{className:`panel-title`,children:[(0,G.jsx)(`span`,{className:`panel-title-icon`,children:(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`})}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h2`,{children:(0,G.jsx)(W,{children:e})}),t&&(0,G.jsx)(`p`,{children:(0,G.jsx)(W,{children:t})})]})]})}function lo({title:e,action:t,description:n}){return(0,G.jsxs)(`div`,{className:`page-header`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h1`,{children:(0,G.jsx)(W,{children:e})}),n&&(0,G.jsx)(`p`,{children:(0,G.jsx)(W,{children:n})})]}),t&&(0,G.jsx)(`div`,{className:`page-header-action`,children:(0,G.jsx)(oo,{children:t})})]})}function uo(){return(0,G.jsxs)(G.Fragment,{children:[(0,G.jsxs)(`div`,{className:`stats-grid stats-chart-grid`,children:[(0,G.jsxs)(`section`,{className:`panel stats-chart-panel`,children:[(0,G.jsx)(co,{title:`学科分布`,description:`各学科已归档错题的数量。`}),(0,G.jsx)(`div`,{className:`stats-chart-frame stats-subject-chart skeleton-subject-bars`,children:[48,78,35].map(e=>(0,G.jsx)(`span`,{className:`skeleton-shimmer`,style:{height:`${e}%`}},e))})]}),(0,G.jsxs)(`section`,{className:`panel stats-chart-panel stats-mastery-panel`,children:[(0,G.jsx)(co,{title:`掌握程度`,description:`按每道错题最近一次复习结果统计。`}),(0,G.jsxs)(`div`,{className:`stats-mastery-layout`,children:[(0,G.jsx)(`div`,{className:`stats-mastery-ring skeleton-mastery-ring`}),(0,G.jsx)(`ul`,{className:`stats-mastery-legend`,children:[`未复习`,`未掌握`,`待巩固`,`已掌握`].map(e=>(0,G.jsxs)(`li`,{className:`stats-mastery-item`,children:[(0,G.jsx)(`span`,{className:`stats-legend-dot skeleton-shimmer`}),(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:e})}),(0,G.jsx)(`strong`,{children:(0,G.jsx)(W,{children:`0 道`})}),(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:`0%`})})]},e))})]})]})]}),(0,G.jsxs)(`section`,{className:`panel knowledge-chart-panel stats-chart-panel`,children:[(0,G.jsx)(co,{title:`知识点分布`,description:`按主知识点查看已归档错题，最多展示数量最多的 8 项。`}),(0,G.jsx)(`div`,{className:`stats-chart-frame stats-knowledge-chart skeleton-knowledge-bars`,children:[74,92,55,38].map(e=>(0,G.jsxs)(`div`,{children:[(0,G.jsx)(W,{children:`知识点名称`}),(0,G.jsx)(`span`,{className:`skeleton-shimmer`,style:{width:`${e}%`}})]},e))})]})]})}function fo(){return(0,G.jsxs)(G.Fragment,{children:[(0,G.jsxs)(`div`,{className:`task-selection-bar`,children:[(0,G.jsxs)(`label`,{children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:`选择本页可操作任务`})]}),(0,G.jsxs)(`div`,{children:[(0,G.jsxs)(`span`,{className:`table-button`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:`重试`})]}),(0,G.jsxs)(`span`,{className:`table-button`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:`取消`})]})]})]}),(0,G.jsx)(`div`,{className:`task-rows`,children:[0,1,2].map(e=>(0,G.jsxs)(`article`,{className:`task-row`,children:[(0,G.jsxs)(`div`,{className:`task-row-heading`,children:[(0,G.jsxs)(`div`,{className:`task-row-title`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(`h3`,{children:(0,G.jsx)(W,{children:`识别题目`})}),(0,G.jsx)(`span`,{className:`task-id`,children:(0,G.jsx)(W,{children:`#000`})})]}),(0,G.jsx)(`span`,{className:`task-status`,children:(0,G.jsx)(W,{children:`处理中`})})]}),(0,G.jsx)(`div`,{className:`task-excerpt`,children:(0,G.jsx)(W,{children:`正在读取错题内容，整理识别与解析结果。`})}),(0,G.jsxs)(`div`,{className:`task-meta`,children:[(0,G.jsx)(W,{children:`记录 #000`}),(0,G.jsx)(W,{children:`10月24日 12:00`}),(0,G.jsx)(W,{children:`本轮耗时 10 秒`}),(0,G.jsx)(W,{children:`尝试 1/3`})]}),(0,G.jsx)(`div`,{className:`task-row-actions`,children:(0,G.jsx)(oo,{children:`打开错题`})})]},e))})]})}function po(){return(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(lo,{title:`AI 任务管理`,action:`录入错题`}),(0,G.jsx)(`p`,{className:`task-page-description`,children:(0,G.jsx)(W,{children:`上传后可以继续学习，AI 会在后台处理。完成后，在这里查看结果、校对或重试；不再需要的处理中、失败或待校对任务可直接取消。`})}),(0,G.jsxs)(`section`,{className:`task-manager`,children:[(0,G.jsxs)(`div`,{className:`task-sync-bar`,children:[(0,G.jsxs)(`span`,{children:[(0,G.jsx)(W,{children:`正在加载任务…`}),(0,G.jsx)(`small`,{children:(0,G.jsx)(W,{children:`正在同步任务状态`})})]}),(0,G.jsx)(oo,{children:`刷新`})]}),(0,G.jsx)(`div`,{className:`task-filters skeleton-tabs`,children:[`全部`,`处理中`,`待校对`,`失败`,`已填入`,`已取消`].map(e=>(0,G.jsx)(`span`,{children:(0,G.jsxs)(W,{children:[e,` —`]})},e))}),(0,G.jsxs)(`div`,{className:`task-search-bar`,children:[(0,G.jsx)(`div`,{className:`task-search skeleton-input skeleton-shimmer`}),(0,G.jsx)(`div`,{className:`custom-select skeleton-input skeleton-shimmer`})]}),(0,G.jsx)(fo,{}),(0,G.jsxs)(`div`,{className:`task-pagination`,children:[(0,G.jsx)(W,{children:`共 — 项`}),(0,G.jsx)(oo,{children:`上一页　下一页`})]})]})]})}function mo(){let{user:e}=L(),t=e.role===`admin`;return(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(lo,{title:`设置`,description:t?`管理账号安全、学习目录、AI 服务与全站数据备份。`:`修改用户名、头像与登录密码。`}),(0,G.jsx)(`div`,{className:`settings-tabs skeleton-tabs`,children:[`账号安全`,`知识点目录`,...t?[`AI 设置`,`数据备份`,`邀请码`,`用户账号`,`测试错题`]:[]].map(e=>(0,G.jsxs)(`span`,{children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:e})]},e))}),(0,G.jsxs)(`div`,{className:`settings-account-layout`,children:[(0,G.jsxs)(`div`,{className:`settings-account-forms`,children:[(0,G.jsxs)(`section`,{className:`panel username-panel`,children:[(0,G.jsx)(co,{title:`修改用户名`,description:`修改后请使用新用户名登录。`}),(0,G.jsxs)(`div`,{className:`skeleton-settings-form`,children:[(0,G.jsx)(so,{label:`用户名`}),(0,G.jsx)(oo,{children:`保存用户名`})]})]}),(0,G.jsxs)(`section`,{className:`panel password-panel`,children:[(0,G.jsx)(co,{title:`修改密码`,description:`设置一个只有你知道的密码。`}),(0,G.jsxs)(`div`,{className:`skeleton-settings-form`,children:[(0,G.jsx)(so,{label:`当前密码`}),(0,G.jsx)(so,{label:`新密码`}),(0,G.jsx)(so,{label:`确认新密码`}),(0,G.jsx)(oo,{children:`保存新密码`})]})]})]}),(0,G.jsxs)(`aside`,{className:`panel account-summary`,children:[(0,G.jsx)(`span`,{className:`large-avatar skeleton-shimmer`}),(0,G.jsx)(oo,{children:`上传头像`}),(0,G.jsxs)(`p`,{className:`avatar-hint`,children:[(0,G.jsx)(W,{children:`JPG、PNG、WebP，最大 5 MB`}),(0,G.jsx)(`br`,{}),(0,G.jsx)(W,{children:`自动居中裁剪为方形`})]}),(0,G.jsx)(`h2`,{children:(0,G.jsx)(W,{children:`用户名`})}),(0,G.jsx)(`span`,{className:`small-pill`,children:(0,G.jsx)(W,{children:`学习账号`})}),(0,G.jsxs)(`div`,{className:`account-summary-note`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(`strong`,{children:(0,G.jsx)(W,{children:`专属于你的错题本`})}),(0,G.jsxs)(`p`,{children:[(0,G.jsx)(W,{children:`整理的题目、笔记与复习记录`}),(0,G.jsx)(`br`,{}),(0,G.jsx)(W,{children:`会保存在你的账号下。`})]})]})]})]})]})}function ho(){return(0,G.jsxs)(`section`,{className:`panel admin-panel`,children:[(0,G.jsxs)(`div`,{className:`admin-panel-heading`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h2`,{children:(0,G.jsx)(W,{children:`账号与邀请管理`})}),(0,G.jsx)(`p`,{children:(0,G.jsx)(W,{children:`管理账号状态与使用情况。`})})]}),(0,G.jsx)(oo,{children:`管理操作`})]}),(0,G.jsxs)(`div`,{className:`skeleton-admin-table`,children:[(0,G.jsx)(`div`,{className:`skeleton-admin-table-heading`,children:[0,1,2,3].map(e=>(0,G.jsx)(W,{children:`栏目名称`},e))}),[0,1,2].map(e=>(0,G.jsx)(`div`,{children:[0,1,2,3].map(e=>(0,G.jsx)(W,{children:`正在加载`},e))},e))]})]})}function go(){return(0,G.jsxs)(`div`,{className:`ai-profile-form`,children:[(0,G.jsxs)(`div`,{className:`ai-profile-enable`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:`启用服务`})]}),(0,G.jsx)(so,{label:`API 基础地址`}),(0,G.jsx)(so,{label:`模型名称`}),(0,G.jsx)(so,{label:`API 密钥`}),(0,G.jsxs)(`div`,{className:`ai-profile-actions`,children:[(0,G.jsx)(oo,{children:`保存服务配置`}),(0,G.jsx)(oo,{children:`测试服务`})]})]})}function _o(){return(0,G.jsxs)(`div`,{className:`backup-settings`,children:[(0,G.jsxs)(`section`,{className:`panel backup-create-panel`,children:[(0,G.jsxs)(`div`,{className:`backup-heading`,children:[(0,G.jsx)(co,{title:`全站数据备份`,description:`保留一份完整记录，为恢复与迁移做好准备。`}),(0,G.jsx)(oo,{children:`立即备份`})]}),(0,G.jsxs)(`div`,{className:`skeleton-copy-lines`,children:[(0,G.jsx)(W,{children:`账号、错题、知识点、复习记录与图片`}),(0,G.jsx)(W,{children:`完整保存服务器配置与学习记录`})]}),(0,G.jsx)(`div`,{className:`backup-sensitive`,children:(0,G.jsx)(W,{children:`备份含账号数据及服务密钥，请妥善保管。`})})]}),(0,G.jsxs)(`section`,{className:`panel backup-schedule-panel`,children:[(0,G.jsx)(co,{title:`自动备份`,description:`每天按北京时间执行；停服期间错过的备份不会补跑。`}),(0,G.jsxs)(`div`,{className:`backup-enable`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:`启用每日自动备份`})]}),(0,G.jsxs)(`div`,{className:`backup-schedule-fields`,children:[(0,G.jsx)(so,{label:`每天执行时间`}),(0,G.jsx)(so,{label:`自动备份保留份数`})]}),(0,G.jsxs)(`div`,{className:`backup-schedule-footer`,children:[(0,G.jsx)(oo,{children:`保存自动备份设置`}),(0,G.jsx)(W,{children:`下次执行时间与最近结果`})]})]}),(0,G.jsxs)(`section`,{className:`panel backup-history-panel`,children:[(0,G.jsx)(`div`,{className:`backup-heading`,children:(0,G.jsx)(`h2`,{children:(0,G.jsx)(W,{children:`备份记录`})})}),[0,1].map(e=>(0,G.jsxs)(`div`,{className:`backup-record`,children:[(0,G.jsx)(W,{children:`备份时间与文件大小`}),(0,G.jsx)(W,{children:`备份状态`}),(0,G.jsx)(oo,{children:`下载`})]},e))]})]})}function vo(){return(0,G.jsxs)(`section`,{className:`test-data-tools`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`strong`,{children:(0,G.jsx)(W,{children:`体验错题本`})}),(0,G.jsx)(`p`,{children:(0,G.jsx)(W,{children:`每次为当前管理员账号生成 6 道示例，带有“测试错题”标签，可用于编辑和复习。当前账号共 — 道测试错题。`})}),(0,G.jsx)(`small`,{children:(0,G.jsx)(W,{children:`移入回收站覆盖所有筛选条件、归档和草稿，仅处理当前账号的测试错题，30 天内可恢复题目及复习记录。测试数据会计入学习统计。`})})]}),(0,G.jsxs)(`div`,{className:`test-data-actions`,children:[(0,G.jsx)(oo,{children:`一键生成测试错题`}),(0,G.jsx)(oo,{children:`测试错题移入回收站`})]})]})}function yo({answer:e=!1}){return(0,G.jsxs)(`div`,{className:`photo-entry`,children:[(0,G.jsxs)(`div`,{className:`photo-entry-title`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:e?`也可以拍下答案`:`从图片录入题目`})]}),(0,G.jsx)(`div`,{className:`photo-actions`,children:[e?`拍照识别答案`:`拍照`,`选择图片`,`选择已上传的照片`,...e?[`复用题干图片`]:[]].map(e=>(0,G.jsxs)(`span`,{className:`button secondary skeleton-button`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`,style:{width:16,height:16}}),(0,G.jsx)(W,{children:e})]},e))})]})}function bo({label:e,rows:t=5,question:n=!1}){return(0,G.jsxs)(`div`,{className:`field markdown-field`,children:[(0,G.jsxs)(`div`,{className:`markdown-field-heading`,children:[(0,G.jsx)(`label`,{children:(0,G.jsx)(W,{children:e})}),(0,G.jsx)(`div`,{className:`markdown-field-modes`,children:[`编辑`,`预览`].map(e=>(0,G.jsx)(`button`,{type:`button`,disabled:!0,tabIndex:-1,children:(0,G.jsx)(W,{children:e})},e))})]}),(0,G.jsx)(`div`,{className:`skeleton-form-control skeleton-shimmer`,children:(0,G.jsx)(`textarea`,{disabled:!0,tabIndex:-1,rows:t,className:n?`question-editor`:void 0})})]})}function xo({title:e,required:t=!1}){return(0,G.jsxs)(`div`,{className:`editor-block-heading`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(`h2`,{children:(0,G.jsx)(W,{children:e})}),t&&(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:`必填`})})]})}function So(){let e=/^#\/mistakes\/\d+\/edit/.test(window.location.hash);return(0,G.jsxs)(G.Fragment,{children:[e&&(0,G.jsx)(`div`,{className:`editor-uploaded`,children:(0,G.jsx)(`span`,{className:`table-button`,children:(0,G.jsx)(W,{children:`查看上传图片`})})}),(0,G.jsx)(`div`,{className:`editor-mobile-tabs`,children:(0,G.jsx)(`div`,{className:`sliding-tabs`,children:[`题干`,`解答`,`笔记`,`归类`].map(e=>(0,G.jsx)(`span`,{className:`sliding-tab`,children:(0,G.jsx)(`i`,{className:`skeleton-text skeleton-shimmer`,children:e})},e))})}),(0,G.jsxs)(`div`,{className:`editor-layout`,children:[(0,G.jsxs)(`div`,{className:`editor-main`,children:[(0,G.jsxs)(`section`,{className:`editor-block editor-question-block`,children:[(0,G.jsx)(xo,{title:`题目`,required:!0}),(0,G.jsx)(yo,{}),(0,G.jsx)(bo,{label:`题干 *`,question:!0})]}),(0,G.jsxs)(`section`,{className:`editor-block editor-answers-block skeleton-editor-secondary`,children:[(0,G.jsx)(xo,{title:`答案与分析`}),(0,G.jsx)(bo,{label:`正确答案　选填`,rows:3}),(0,G.jsx)(yo,{answer:!0}),(0,G.jsx)(`div`,{className:`photo-actions`,children:(0,G.jsx)(oo,{children:`生成解析`})}),(0,G.jsx)(bo,{label:`解题分析　选填`})]}),(0,G.jsxs)(`section`,{className:`editor-block editor-note-block skeleton-editor-secondary`,children:[(0,G.jsx)(xo,{title:`我的笔记`}),(0,G.jsx)(bo,{label:`我的笔记　选填`})]})]}),(0,G.jsxs)(`aside`,{className:`editor-aside editor-classification editor-block skeleton-editor-secondary`,children:[(0,G.jsx)(xo,{title:`学科与知识点`}),(0,G.jsx)(so,{label:`学科 *`}),(0,G.jsx)(so,{label:`主知识点　选填`}),(0,G.jsxs)(`div`,{className:`field`,children:[(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:`辅助知识点　可多选`})}),(0,G.jsxs)(`div`,{className:`knowledge-options skeleton-copy-lines`,children:[(0,G.jsx)(W,{children:`知识点名称`}),(0,G.jsx)(W,{children:`知识点名称`})]})]}),(0,G.jsxs)(`div`,{className:`field`,children:[(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:`星级标记　选填`})}),(0,G.jsx)(W,{children:`☆　☆　☆　☆　☆`})]})]})]})]})}function Co(){let e=/^#\/mistakes\/\d+\/edit/.test(window.location.hash);return(0,G.jsxs)(`div`,{className:`editor-workbench`,children:[(0,G.jsxs)(`nav`,{className:`editor-navigation`,children:[(0,G.jsxs)(`span`,{className:`back-link`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:e?`返回错题详情`:`返回我的错题`})]}),!e&&(0,G.jsxs)(`span`,{className:`table-button editor-batch-entry`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:`按页批量录入`})]})]}),(0,G.jsxs)(`header`,{className:`editor-workbench-header`,children:[(0,G.jsx)(`div`,{children:(0,G.jsx)(`h1`,{children:(0,G.jsx)(W,{children:e?`编辑错题`:`录入错题`})})}),(0,G.jsx)(`div`,{className:`editor-workbench-state`,children:(0,G.jsx)(`span`,{className:`editor-mode`,children:(0,G.jsx)(W,{children:`正在编辑`})})})]}),(0,G.jsx)(So,{})]})}function wo(){return(0,G.jsx)(`div`,{className:`review-candidates`,children:[0,1,2].map(e=>(0,G.jsxs)(`div`,{className:`review-candidate`,children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h3`,{children:(0,G.jsx)(W,{children:`题目条件、问题和需要复习的内容`})}),(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:`学科 · 知识点`})}),(0,G.jsx)(`div`,{className:`review-candidate-rating`,children:(0,G.jsx)(W,{children:`☆☆☆☆☆`})})]}),(0,G.jsx)(`span`,{className:`status-badge`,children:(0,G.jsx)(`i`,{className:`skeleton-text skeleton-shimmer`,children:`未复习`})})]},e))})}function To(){return(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(lo,{title:`开始复习`}),(0,G.jsxs)(`div`,{className:`review-selection-layout`,children:[(0,G.jsxs)(`section`,{className:`library-panel`,children:[(0,G.jsxs)(`div`,{className:`panel-title selection-heading`,children:[(0,G.jsx)(`span`,{className:`panel-title-icon`,children:(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`})}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h2`,{children:(0,G.jsx)(W,{children:`选择今天的练习`})}),(0,G.jsx)(`p`,{children:(0,G.jsx)(W,{children:`仅已归档的错题可以参与复习。`})})]})]}),(0,G.jsx)(`div`,{className:`filter-bar review-filters has-rating-filter`,children:[`全部学科`,`全部知识点`,`全部掌握程度`,`全部星级`].map(e=>(0,G.jsx)(`div`,{className:`custom-select`,children:(0,G.jsxs)(`div`,{className:`custom-select-trigger`,children:[(0,G.jsx)(W,{children:e}),(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`})]})},e))}),(0,G.jsxs)(`div`,{className:`selection-toolbar`,children:[(0,G.jsxs)(`label`,{children:[(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`}),(0,G.jsx)(W,{children:`全选当前结果`})]}),(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:`共 0 道 · 已选 0 道`})})]}),(0,G.jsx)(wo,{})]}),(0,G.jsxs)(`aside`,{className:`review-preparation panel`,children:[(0,G.jsx)(`span`,{className:`prep-icon`,children:(0,G.jsx)(`span`,{className:`skeleton-symbol skeleton-shimmer`,style:{width:29,height:29}})}),(0,G.jsx)(`h2`,{children:(0,G.jsx)(W,{children:`今天的复习计划`})}),(0,G.jsxs)(`div`,{className:`prep-selected`,children:[(0,G.jsx)(`span`,{children:(0,G.jsx)(W,{children:`本次已选择`})}),(0,G.jsxs)(`strong`,{children:[(0,G.jsx)(W,{children:`0`}),(0,G.jsx)(`small`,{children:(0,G.jsx)(W,{children:`道错题`})})]})]}),(0,G.jsx)(`div`,{className:`prep-steps`,children:[`独立完成题目`,`查看答案与分析`,`记录本次掌握程度`].map((e,t)=>(0,G.jsxs)(`span`,{children:[(0,G.jsx)(`i`,{children:t+1}),(0,G.jsx)(W,{children:e})]},e))}),(0,G.jsx)(oo,{children:`开始复习`}),(0,G.jsx)(`small`,{className:`prep-hint`,children:(0,G.jsx)(W,{children:`复习记录会同步更新掌握程度。`})})]})]})]})}var G,Eo=t((()=>{P(),ro(),io(),ao(),G=Ue()})),Do,Oo,ko,Ao,jo=t((()=>{Do=e(V()),Oo=(0,Do.createContext)(null),ko=()=>(0,Do.useContext)(Oo),Ao=e=>[`/`,`/mistakes`].includes(e.split(`?`)[0])}));function Mo(){let[e,t]=(0,K.useState)(()=>window.matchMedia(`(prefers-reduced-motion: reduce)`).matches);return(0,K.useEffect)(()=>{let e=window.matchMedia(`(prefers-reduced-motion: reduce)`),n=()=>t(e.matches);return e.addEventListener(`change`,n),()=>e.removeEventListener(`change`,n)},[]),e}function No(){let e=Mo(),t=(0,K.useRef)([]),n=(0,K.useCallback)(()=>{t.current.forEach(e=>e.cancel()),t.current=[]},[]),r=(0,K.useCallback)((r,i,a,o)=>{if(n(),e||!r||typeof r.animate!=`function`)return Promise.resolve();let s={duration:es,easing:Xo,fill:`forwards`};return t.current=[r.animate([{transform:`none`},{transform:`rotate(${i*90}deg) scale(${a})`}],s)],o&&t.current.push(o.element.animate([{height:`${o.from}px`,overflow:`hidden`},{height:`${o.to}px`,overflow:`hidden`}],s)),Promise.all(t.current.map(e=>e.finished)).then(()=>void 0,()=>void 0)},[e,n]);return(0,K.useEffect)(()=>n,[n]),{turn:r,settle:n}}function Po(e){if(Ao(e))return[`mistakes`,0];let t=e.match(/^\/mistakes\/\d+(\/edit)?$/);return t?[`mistakes`,t[1]?2:1]:e===`/new`?[`new`,0]:e===`/page-imports`?[`new`,1]:null}function Fo(e,t){let n=e.split(`?`)[0],r=t.split(`?`)[0];if(n===r||Ao(n)&&Ao(r))return null;let i=Po(n),a=Po(r);return i&&a&&i[0]===a[0]&&i[1]!==a[1]?a[1]>i[1]?`forward`:`back`:`swap`}function Io(e,t){let n=document.documentElement;if(!e||$o()||document.visibilityState!==`visible`||document.querySelector(`[role="dialog"], [role="alertdialog"]`)){t();return}let r=++ts;if(n.dataset.routeDirection=e,typeof document.startViewTransition!=`function`){window.clearTimeout(ns),n.dataset.routeEnter=e,t(),ns=window.setTimeout(()=>{delete n.dataset.routeEnter,r===ts&&delete n.dataset.routeDirection},400);return}n.dataset.routePhase=`old`;let i=document.startViewTransition(()=>{r===ts&&(n.dataset.routePhase=`new`),(0,Yo.flushSync)(t)}),a=()=>{r===ts&&(delete n.dataset.routePhase,delete n.dataset.routeDirection)};i.ready.catch(()=>void 0),i.finished.then(a,a)}function Lo(e){if($o())return;let t=document.querySelector(`.route-view:not([hidden]) .mistake-row[data-mistake-id="${e}"]`);t&&(t.classList.add(`is-returned`),window.setTimeout(()=>t.classList.remove(`is-returned`),1600))}function Ro(e){(0,K.useLayoutEffect)(()=>{let t=e.current;if(!t||typeof t.animate!=`function`||$o())return;let n=performance.now();is=n-rs<50?is+1:0,rs=n;let r=t.animate([{opacity:0,transform:`translateY(10px)`},{opacity:1,transform:`none`}],{duration:360,delay:Math.min(is,8)*30,easing:Zo,fill:`backwards`});return()=>r.cancel()},[e])}function zo(){let e=(0,K.useSyncExternalStore)(Ha,Wa),t=e.pending>0,n=Mo(),r=(0,K.useRef)(null),i=(0,K.useRef)(`idle`),a=(0,K.useRef)(0),o=(0,K.useRef)(0),s=(0,K.useRef)(0),c=(0,K.useRef)(new Set),l=(0,K.useRef)(new Set),[u,d]=(0,K.useState)({visible:!1,progress:0,completing:!1});return(0,K.useEffect)(()=>()=>{c.current.forEach(e=>window.clearTimeout(e)),l.current.forEach(e=>window.cancelAnimationFrame(e)),c.current.clear(),l.current.clear()},[]),(0,K.useEffect)(()=>{function u(){c.current.forEach(e=>window.clearTimeout(e)),l.current.forEach(e=>window.cancelAnimationFrame(e)),c.current.clear(),l.current.clear()}function f(e,t){let n=window.setTimeout(()=>{c.current.delete(n),e()},t);c.current.add(n)}function p(e){let t=window.requestAnimationFrame(()=>{l.current.delete(t),e()});l.current.add(t)}function m(){if(i.current!==`loading`||!Ua())return;let e=.92-o.current;e>.003&&(o.current+=e*.18,d({visible:!0,progress:o.current,completing:!1}),f(m,450+o.current*750))}function h(){Ua()||(i.current=`completing`,o.current=1,d({visible:!0,progress:1,completing:!0}),f(()=>{i.current=`fading`,d(e=>({...e,visible:!1})),f(()=>{i.current=`idle`,o.current=0,d({visible:!1,progress:0,completing:!1})},n?40:180)},n?100:440))}let g=e.cycle!==s.current;if(s.current=e.cycle,t||g){u(),a.current=performance.now();let e=i.current;if(i.current=`loading`,e===`idle`)o.current=0,d({visible:!0,progress:0,completing:!1}),p(()=>p(()=>{o.current=.3,d({visible:!0,progress:.3,completing:!1}),f(m,n?100:360)}));else{let e=r.current?getComputedStyle(r.current).transform:`none`,t=e===`none`?o.current:new DOMMatrixReadOnly(e).a;o.current=Math.min(.99,Math.max(.3,t)),d({visible:!0,progress:o.current,completing:!1}),f(m,450)}}!t&&i.current===`loading`&&f(()=>{u(),h()},Math.max(0,(n?60:260)-(performance.now()-a.current)))},[t,e.cycle,n]),(0,q.jsx)(`div`,{className:`loading-progress${u.visible?` is-visible`:``}${u.completing?` is-completing`:``}`,"aria-hidden":`true`,style:{opacity:+!!u.visible,transition:`opacity ${n?40:180}ms ${Xo}`},children:(0,q.jsx)(`span`,{ref:r,className:`loading-progress-fill`,style:{transform:`scaleX(${u.progress})`,transition:`transform ${n?60:u.completing?320:u.progress<=.3?200:700}ms ${Xo}`}})})}function Bo({tabs:e,value:t,onChange:n,ariaLabel:r,className:i=``}){let a=(0,K.useRef)(null),o=(0,K.useRef)(!1),[s,c]=(0,K.useState)({x:0,width:0}),[l,u]=(0,K.useState)(!1),d=e.map(e=>e.id).join(`\0`);(0,K.useLayoutEffect)(()=>{let e=a.current;if(!e)return;let n=!1,r=0;function i(){if(n||!e)return;let i=Array.from(e.querySelectorAll(`[role="tab"]`)).find(e=>e.dataset.tabId===t);if(!i)return;let a=i.getBoundingClientRect(),s=e.getBoundingClientRect(),l={x:a.left-s.left+e.scrollLeft-e.clientLeft,width:a.width};c(e=>Math.abs(e.x-l.x)<.1&&Math.abs(e.width-l.width)<.1?e:l),!o.current&&!r&&(r=window.requestAnimationFrame(()=>{o.current=!0,u(!0)}))}i();let s=new ResizeObserver(i);return s.observe(e),e.querySelectorAll(`[role="tab"]`).forEach(e=>s.observe(e)),window.addEventListener(`resize`,i),document.fonts.ready.then(i),()=>{n=!0,s.disconnect(),window.removeEventListener(`resize`,i),window.cancelAnimationFrame(r)}},[t,d]);function f(t,r){let i=r;if(t.key===`ArrowRight`)i=(r+1)%e.length;else if(t.key===`ArrowLeft`)i=(r-1+e.length)%e.length;else if(t.key===`Home`)i=0;else if(t.key===`End`)i=e.length-1;else return;t.preventDefault(),n(e[i].id),a.current?.querySelectorAll(`[role="tab"]`)[i]?.focus()}return(0,q.jsxs)(`div`,{ref:a,className:`sliding-tabs ${i}`.trim(),role:`tablist`,"aria-label":r,children:[e.map((e,r)=>(0,q.jsx)(`button`,{id:e.panelId?`${e.panelId}-tab`:void 0,type:`button`,role:`tab`,"data-tab-id":e.id,"aria-controls":e.panelId,"aria-selected":t===e.id,tabIndex:t===e.id?0:-1,className:`sliding-tab${t===e.id?` is-active`:``}`,onClick:()=>n(e.id),onKeyDown:e=>f(e,r),children:e.label},e.id)),(0,q.jsx)(`span`,{className:`tab-indicator`,"aria-hidden":`true`,style:{width:s.width,transform:`translateX(${s.x}px)`,opacity:+!!l,...l?{}:{transition:`none`}}})]})}function Vo({items:e,value:t,ariaLabel:n=`主导航`}){let r=(0,K.useRef)(null),i=(0,K.useRef)(!1),[a,o]=(0,K.useState)(!1),[s,c]=(0,K.useState)({x:0,y:0,width:0,height:0,visible:!1}),l=e.map(e=>e.id).join(`\0`);return(0,K.useLayoutEffect)(()=>{let e=r.current;if(!e)return;let n=!1,a=0;function s(){if(n||!e)return;let r=Array.from(e.querySelectorAll(`.nav-item`)).find(e=>e.dataset.navId===t);if(!r){c(e=>e.visible?{...e,visible:!1}:e);return}let s=getComputedStyle(e),l=s.getPropertyValue(`--nav-indicator-axis`).trim(),u=l?l===`horizontal`:s.display===`grid`||s.flexDirection===`row`,d=parseFloat(s.getPropertyValue(`--nav-indicator-inset`))||(u?10:12),f=parseFloat(s.getPropertyValue(`--nav-indicator-thickness`))||3,p=r.getBoundingClientRect(),m=e.getBoundingClientRect(),h=p.left-m.left+e.scrollLeft-e.clientLeft,g=p.top-m.top+e.scrollTop-e.clientTop,_=u?{x:h+d,y:g+p.height-f,width:Math.max(0,p.width-d*2),height:f,visible:!0}:{x:h,y:g+d,width:f,height:Math.max(0,p.height-d*2),visible:!0};c(e=>e.visible===_.visible&&Math.abs(e.x-_.x)<.1&&Math.abs(e.y-_.y)<.1&&Math.abs(e.width-_.width)<.1&&Math.abs(e.height-_.height)<.1?e:_),!i.current&&!a&&(a=window.requestAnimationFrame(()=>{i.current=!0,o(!0)}))}s();let l=new ResizeObserver(s);return l.observe(e),e.querySelectorAll(`.nav-item`).forEach(e=>l.observe(e)),window.addEventListener(`resize`,s),document.fonts.ready.then(s),()=>{n=!0,l.disconnect(),window.removeEventListener(`resize`,s),window.cancelAnimationFrame(a)}},[t,l]),(0,q.jsxs)(`nav`,{ref:r,className:`navigation`,"aria-label":n,children:[e.map(e=>e.element?(0,q.jsx)(`span`,{className:`nav-custom-item`,children:e.element},e.id):(0,q.jsx)(`a`,{href:e.href,"data-nav-id":e.id,className:`nav-item${t===e.id?` active`:``}`,"aria-current":t===e.id?`page`:void 0,children:e.label},e.id)),(0,q.jsx)(`span`,{className:`nav-indicator`,"aria-hidden":`true`,style:{transform:`translate(${s.x}px, ${s.y}px)`,width:s.width,height:s.height,opacity:a&&s.visible?1:0,...a?{}:{transition:`none`}}})]})}function Ho({size:e=`long`}){return(0,q.jsx)(`span`,{className:`skeleton-line skeleton-shimmer ${e}`})}function Uo(){return(0,q.jsxs)(`div`,{className:`skeleton-heading`,children:[(0,q.jsxs)(`div`,{className:`skeleton-heading-copy`,children:[(0,q.jsx)(Ho,{size:`title`}),(0,q.jsx)(Ho,{size:`medium`})]}),(0,q.jsx)(`span`,{className:`skeleton-block skeleton-shimmer`})]})}function Wo({library:e=!1}){return(0,q.jsx)(`div`,{className:`metrics-grid${e?` library-metrics`:``}`,children:(e?[{label:`已归档错题`,tone:`green`},{label:`待巩固`,tone:`amber`},{label:`已掌握`,tone:`green`}]:[{label:`已归档错题`,tone:`violet`},{label:`待完善草稿`,tone:`amber`},{label:`累计复习`,tone:`blue`},{label:`当前掌握率`,tone:`green`}]).map(({label:e,tone:t})=>(0,q.jsxs)(`div`,{className:`metric-card skeleton-metric-card`,children:[(0,q.jsxs)(`div`,{className:`metric-top`,children:[(0,q.jsx)(`span`,{className:`skeleton-metric-label skeleton-shimmer`,children:e}),(0,q.jsx)(`span`,{className:`metric-icon ${t}`,children:(0,q.jsx)(`span`,{className:`skeleton-metric-icon skeleton-shimmer`})})]}),(0,q.jsxs)(`div`,{className:`metric-value`,children:[(0,q.jsx)(`span`,{className:`skeleton-metric-count skeleton-shimmer`}),(0,q.jsx)(`span`,{className:`skeleton-metric-unit skeleton-shimmer`})]})]},e))})}function Go({review:e=!1}){return(0,q.jsxs)(`div`,{className:`skeleton-list`,children:[!e&&(0,q.jsxs)(`div`,{className:`skeleton-toolbar`,children:[(0,q.jsx)(Ho,{size:`medium`}),(0,q.jsx)(Ho,{size:`short`})]}),Array.from({length:3},(e,t)=>(0,q.jsxs)(`div`,{className:`skeleton-row`,children:[(0,q.jsx)(`span`,{className:`skeleton-row-index skeleton-shimmer`}),(0,q.jsxs)(`div`,{className:`skeleton-row-copy`,children:[(0,q.jsx)(Ho,{}),(0,q.jsx)(Ho,{size:`medium`})]}),(0,q.jsx)(Ho,{size:`short`}),(0,q.jsx)(Ho,{size:`short`})]},t))]})}function Ko(){return(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`div`,{className:`skeleton-reading-header`,children:(0,q.jsx)(Uo,{})}),(0,q.jsxs)(`div`,{className:`skeleton-reading-meta`,children:[(0,q.jsx)(Ho,{size:`short`}),(0,q.jsx)(Ho,{size:`short`}),(0,q.jsx)(Ho,{size:`short`})]}),(0,q.jsx)(`div`,{className:`skeleton-panel skeleton-reading-document`,children:[0,1,2].map(e=>(0,q.jsxs)(`section`,{children:[(0,q.jsx)(Ho,{size:`short`}),(0,q.jsx)(Ho,{}),(0,q.jsx)(Ho,{}),(0,q.jsx)(Ho,{size:`medium`})]},e))}),(0,q.jsxs)(`div`,{className:`skeleton-panel skeleton-reading-history`,children:[(0,q.jsx)(Ho,{size:`medium`}),(0,q.jsx)(Ho,{}),(0,q.jsx)(Ho,{size:`short`})]})]})}function qo({kind:e=`library`}){let t;switch(e){case`summary`:t=(0,q.jsx)(Wo,{library:!0});break;case`rows`:t=(0,q.jsx)(Go,{});break;case`review`:t=(0,q.jsx)(wo,{});break;case`review-page`:t=(0,q.jsx)(To,{});break;case`settings`:t=(0,q.jsx)(ho,{});break;case`settings-page`:t=(0,q.jsx)(mo,{});break;case`ai-profile`:t=(0,q.jsx)(go,{});break;case`backups`:t=(0,q.jsx)(_o,{});break;case`test-data`:t=(0,q.jsx)(vo,{});break;case`tasks`:t=(0,q.jsx)(fo,{});break;case`tasks-page`:t=(0,q.jsx)(po,{});break;case`stats-page`:t=(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(lo,{title:`学习统计`,action:`去复习`}),(0,q.jsx)(Wo,{}),(0,q.jsx)(uo,{})]});break;case`stats`:t=(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(Wo,{}),(0,q.jsx)(uo,{})]});break;case`editor`:t=(0,q.jsx)(So,{});break;case`editor-page`:t=(0,q.jsx)(Co,{});break;case`detail`:t=(0,q.jsx)(Ko,{});break;case`shell`:t=(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(Uo,{}),(0,q.jsx)(Wo,{library:!0}),(0,q.jsx)(Go,{})]});break;default:t=(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(Uo,{}),(0,q.jsx)(Wo,{library:!0}),(0,q.jsxs)(`div`,{className:`skeleton-toolbar`,children:[(0,q.jsx)(Ho,{size:`medium`}),(0,q.jsx)(Ho,{size:`short`})]}),(0,q.jsx)(Go,{})]})}return(0,q.jsx)(`div`,{className:`skeleton-screen skeleton-${e}`,"aria-hidden":`true`,children:t})}function Jo({loading:e,kind:t=`library`,className:n=``,children:r}){let i=Mo(),[a,o]=(0,K.useState)(e);return(0,K.useEffect)(()=>{if(e){o(!0);return}let t=window.setTimeout(()=>o(!1),i?40:Qo);return()=>window.clearTimeout(t)},[e,i]),(0,q.jsxs)(`div`,{className:`loading-content loading-kind-${t} ${e?`is-loading`:`is-ready`} ${n}`.trim(),"aria-busy":e,children:[(0,q.jsx)(`div`,{className:`loading-content-body`,inert:e,"aria-hidden":e||void 0,children:r}),(a||e)&&(0,q.jsxs)(`div`,{className:`loading-content-placeholder`,"aria-hidden":!e||void 0,children:[(0,q.jsx)(`span`,{className:`visually-hidden`,role:`status`,children:`正在加载…`}),(0,q.jsx)(qo,{kind:t})]})]})}var K,Yo,q,Xo,Zo,Qo,$o,es,ts,ns,rs,is,as=t((()=>{K=e(V()),Yo=e(o()),Eo(),no(),jo(),q=Ue(),Xo=`cubic-bezier(0.22, 0.61, 0.36, 1)`,Zo=`cubic-bezier(0.16, 1, 0.3, 1)`,Qo=260,$o=()=>window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,es=280,ts=0,ns=0,rs=0,is=0}));function os({className:e=``}){return(0,ss.jsx)(`img`,{className:`logo-mark ${e}`,src:`/mistakes/logo.svg`,alt:``,width:`48`,height:`48`})}var ss,cs=t((()=>{ss=Ue()})),ls=t((()=>{}));function us({user:e,logout:t}){let[n,r]=(0,ds.useState)(!1),[i,a]=(0,ds.useState)(``);async function o(){r(!0),a(``);try{let e=await fetch(`/api/mistakes/auth/data-export`,{credentials:`same-origin`});if(!e.ok){let t=await e.json().catch(()=>null);throw Error(t?.message||`下载失败，请稍后重试。`)}let t=await e.blob(),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`shiti-my-data-${new Date().toISOString().slice(0,10)}.zip`,document.body.appendChild(r),r.click(),r.remove(),window.setTimeout(()=>URL.revokeObjectURL(n),6e4)}catch(e){a(e.message)}finally{r(!1)}}return(0,J.jsxs)(`main`,{className:`frozen-page`,children:[(0,J.jsxs)(`header`,{className:`frozen-header`,children:[(0,J.jsxs)(`span`,{className:`brand`,children:[(0,J.jsx)(os,{}),(0,J.jsx)(`span`,{children:`拾题`})]}),(0,J.jsx)(`span`,{className:`frozen-username`,children:e.username})]}),(0,J.jsxs)(`section`,{className:`frozen-content`,"aria-labelledby":`frozen-title`,children:[(0,J.jsx)(ct,{size:32,strokeWidth:1.5,className:`frozen-icon`}),(0,J.jsx)(`h1`,{id:`frozen-title`,children:`您的账号已被冻结`}),(0,J.jsx)(`p`,{className:`frozen-reassurance`,children:`请放心，您的学习数据仍被妥善保管，不会因账号冻结而删除。`}),(0,J.jsxs)(`div`,{className:`frozen-download`,children:[(0,J.jsxs)(`button`,{className:`button primary`,disabled:n,onClick:()=>void o(),children:[n?(0,J.jsx)(et,{size:18,className:`spin`}):(0,J.jsx)(qe,{size:18}),n?`正在打包并下载…`:`下载我的数据`]}),(0,J.jsx)(`p`,{children:`下载包含错题、答案、解析、笔记、知识点、复习记录和现存图片，也包括草稿与回收站内容。`}),i&&(0,J.jsxs)(`p`,{className:`inline-alert`,role:`alert`,children:[i,` 请重试；若登录已过期，请退出后重新登录。`]})]}),(0,J.jsxs)(`button`,{className:`button ghost`,onClick:()=>void t(),children:[(0,J.jsx)(it,{size:17}),`退出登录`]})]}),(0,J.jsx)(`footer`,{className:`frozen-footer`,children:(0,J.jsx)(`p`,{children:`冻结期间暂时无法使用学习功能，您仍可下载自己的数据。如需恢复使用，请联系管理员。`})})]})}var ds,J,fs=t((()=>{ds=e(V()),st(),cs(),ls(),J=Ue()})),ps,ms,hs,gs,_s,vs=t((()=>{ps=`modulepreload`,ms=function(e){return`/mistakes/`+e},hs={},gs=function(e){return e.pathname.endsWith(`.css`)},_s=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=ms(t,n);let r=s(t);if(r.href in hs)return;hs[r.href]=!0;let i=gs(r);if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let o=document.createElement(`link`);if(o.rel=i?`stylesheet`:ps,i||(o.as=`script`),o.crossOrigin=``,o.href=r.href,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),i)return new Promise((e,t)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${r}`)))})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})}}));function ys(){return Cs||=_s(async()=>{let{FriendlyCaptchaSDK:e}=await import(`./sdk-LxJ6YTVI.js`);return{FriendlyCaptchaSDK:e}},__vite__mapDeps([0,1])).then(({FriendlyCaptchaSDK:e})=>new e).catch(e=>{throw Cs=null,e}),Cs}function bs({sitekey:e,resetKey:t,onChange:n}){let r=(0,xs.useRef)(null),[i,a]=(0,xs.useState)(!0);return(0,xs.useEffect)(()=>{let t=r.current;if(!t)return;let i=document.createElement(`div`);t.append(i);let o=!0,s;a(!0),n({status:`pending`,response:``});let c=e=>{if(!o)return;let{state:t,response:r}=e.detail;n(t===`completed`?{status:`complete`,response:r}:t===`error`?{status:`error`,response:r||`.ERROR`}:t===`expired`?{status:`expired`,response:``}:{status:`pending`,response:``})};return i.addEventListener(`frc:widget.statechange`,c),ys().then(t=>{o&&(s=t.createWidget({element:i,sitekey:e,apiEndpoint:`global`,startMode:`focus`,theme:`light`}),a(!1),i.closest(`form`)?.contains(document.activeElement)&&s.start())}).catch(()=>{o&&(a(!1),n({status:`error`,response:`.ERROR`}))}),()=>{o=!1,i.removeEventListener(`frc:widget.statechange`,c),s?.destroy(),i.remove()}},[e,t,n]),(0,Ss.jsxs)(`div`,{className:`auth-captcha-control`,children:[i&&(0,Ss.jsxs)(`div`,{className:`auth-captcha-loading`,role:`status`,children:[(0,Ss.jsx)(et,{className:`spin`,size:16}),` 正在加载人机验证…`]}),(0,Ss.jsx)(`div`,{className:`auth-captcha-widget`,ref:r})]})}var xs,Ss,Cs,ws=t((()=>{xs=e(V()),st(),Ss=Ue(),vs(),Cs=null})),Ts,Es,Ds,Os=t((()=>{Ts=e(V()),Es=Ue(),Ds=class extends Ts.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidUpdate(e){this.state.failed&&e.resetKey!==this.props.resetKey&&this.setState({failed:!1})}render(){return this.state.failed?(0,Es.jsxs)(`div`,{className:`inline-alert`,role:`alert`,children:[`页面加载失败，请刷新后重试。`,(0,Es.jsx)(`button`,{type:`button`,onClick:()=>window.location.reload(),children:`刷新页面`})]}):this.props.children}}}));function ks(e){let t=e.split(`?`)[0].match(/^\/mistakes\/(\d+)(\/edit)?$/);return t?{id:Number(t[1]),editing:!!t[2]}:null}var As,js,Ms,Ns,Ps=t((()=>{As=e(V()),js=(0,As.createContext)(null),Ms=()=>(0,As.useContext)(js),Ns=`mistakes:open-toast-record`}));function Fs(e){return{className:`ai-toast-actionable`,closeOnClick:!0,onClick:t=>{if(window.matchMedia(`(max-width: 640px)`).matches&&ks(e)){t.preventDefault(),window.dispatchEvent(new CustomEvent(Ns,{cancelable:!0,detail:{path:e}}));return}if(e.startsWith(`/ai-tasks`)){t.preventDefault(),window.dispatchEvent(new CustomEvent(`mistakes:open-ai-tasks`,{detail:{path:e}}));return}window.location.hash===`#${e}`?window.dispatchEvent(new HashChangeEvent(`hashchange`)):Ja(e)}}}var Is=t((()=>{no(),Ps()}));function Ls(e){let t=(0,Rs.useRef)(new Map),n=(0,Rs.useRef)(null),r=(0,Rs.useRef)(0);return(0,Rs.useEffect)(()=>()=>{n.current&&clearTimeout(n.current),H.dismiss(e)},[e]),(0,Rs.useCallback)(i=>{if(i.length){if(Date.now()-r.current>8e3)for(let[e,n]of t.current)n.status===`completed`&&t.current.delete(e);r.current=Date.now(),i.forEach(e=>t.current.set(e.id,e)),!n.current&&(n.current=setTimeout(()=>{n.current=null;let r=[...t.current.values()],i=r.filter(e=>e.status===`failed`).length,a=r.filter(e=>e.status===`active`).length,o=r.length-i-a,s=t=>(0,zs.jsxs)(`div`,{className:`ai-toast-copy`,children:[(0,zs.jsxs)(`a`,{className:`ai-toast-link`,href:`#${t.path}`,onClick:n=>{Fs(t.path).onClick?.(n),H.dismiss(e)},children:[(0,zs.jsx)(`span`,{children:t.message}),(0,zs.jsx)(`small`,{children:`点击查看处理`})]}),t.retry&&(0,zs.jsx)(`button`,{type:`button`,onClick:t.retry,children:`重试`})]},t.id),c=r.length===1?s(r[0]):(0,zs.jsxs)(`div`,{className:`ai-toast-copy`,children:[(0,zs.jsx)(`span`,{children:[a&&`${a} 项处理中`,o&&`${o} 项完成`,i&&`${i} 项失败`].filter(Boolean).join(` · `)}),r.every(e=>e.path.startsWith(`/ai-tasks`))?(0,zs.jsxs)(`a`,{href:`#/ai-tasks`,onClick:t=>{Fs(`/ai-tasks`).onClick?.(t),H.dismiss(e)},children:[`查看 `,r.length,` 项任务`]}):(0,zs.jsxs)(`details`,{className:`activity-toast-details`,children:[(0,zs.jsxs)(`summary`,{children:[`查看 `,r.length,` 项记录`,i?`并重试`:``]}),(0,zs.jsx)(`div`,{children:[...r].sort((e,t)=>Number(t.status===`failed`)-Number(e.status===`failed`)).map(s)})]})]}),l={type:i?`error`:a?`info`:`success`,isLoading:!(!a||i),autoClose:a||i?!1:4500,closeButton:!0,closeOnClick:!1,onClose:()=>{t.current.clear()}};H.isActive(e)?H.update(e,{render:c,...l}):H(c,{toastId:e,...l})},400))}},[e])}var Rs,zs,Bs=t((()=>{Rs=e(V()),kn(),Is(),zs=Ue()}));function Vs(e){return e.status===`failed`?`failed`:e.status===`cancelled`?`cancelled`:Xs(e)?`active`:Zs(e)?`review`:`done`}function Hs(){let e=(0,Y.useContext)(rc);if(!e)throw Error(`AI tasks context missing`);return e}function Us({className:e=``}){let{jobs:t,feedback:n,openTasks:r,open:i}=Hs(),a=t.filter(Xs),o=t.some(e=>!e.mistakeDeleted&&e.status===`failed`)?`failed`:t.some(Zs)?`review`:null,s=a.length,c=a.map(e=>e.id).sort((e,t)=>e-t).join(`,`),l=`${s?`，${s} 项处理中`:``}${o===`failed`?`，有失败任务`:o?`，有待校对任务`:``}`;return(0,X.jsxs)(`button`,{type:`button`,className:`button ghost ai-tasks-trigger ${e}${s?` has-active-tasks`:``}`,"aria-expanded":i,onClick:()=>r(),"aria-haspopup":`dialog`,"aria-label":`AI 任务${l}`,title:`AI 任务`,children:[(0,X.jsx)(Ws,{active:s>0,feedback:n}),(0,X.jsx)(`span`,{className:`ai-task-label`,children:`AI 任务`}),(0,X.jsxs)(`span`,{className:`ai-task-indicators`,children:[(0,X.jsx)(Gs,{count:s,signature:c}),o&&(0,X.jsx)(`span`,{className:`ai-task-attention`,"data-tone":o,"aria-hidden":`true`})]})]})}function Ws({active:e,feedback:t}){let[n,r]=(0,Y.useState)(e?`running`:`idle`);e&&n!==`running`?r(`running`):!e&&n===`running`&&r(`settling`);let i=(0,Y.useRef)(null),[a,o]=(0,Y.useState)(0),[s,c]=(0,Y.useState)(null),l=(0,Y.useRef)(t?.revision);(0,Y.useLayoutEffect)(()=>{if(n!==`settling`)return;let e=i.current?getComputedStyle(i.current).transform:`none`;if(e&&e!==`none`){let t=new DOMMatrixReadOnly(e);o(Math.round(Math.atan2(t.b,t.a)*180/Math.PI))}let t=window.setTimeout(()=>r(`idle`),tc);return()=>window.clearTimeout(t)},[n]),(0,Y.useEffect)(()=>{if(!t||t.revision===l.current)return;if(l.current=t.revision,n!==`running`){c(null);return}c(t.revision);let e=window.setTimeout(()=>c(null),nc);return()=>window.clearTimeout(e)},[t?.revision]);let u=n===`settling`?t?.tone??`done`:s===null?void 0:t?.tone;return(0,X.jsxs)(`span`,{className:`ai-task-icon`,"data-phase":n,"data-tone":u,"aria-hidden":`true`,children:[(0,X.jsxs)(`span`,{className:`ai-orbit`,children:[(0,X.jsx)(`span`,{className:`ai-orbit-track`}),(0,X.jsxs)(`span`,{ref:i,className:`ai-orbit-rotor motion-essential`,children:[(0,X.jsx)(`span`,{className:`ai-orbit-comet`}),(0,X.jsx)(`span`,{className:`ai-orbit-head`})]}),(0,X.jsx)(`span`,{className:`ai-orbit-halo motion-essential`,"data-flash":s!==null||void 0,style:{"--orbit-from":`${a}deg`}},n===`settling`?`settle`:s===null?`rest`:`flash-${s}`)]}),(0,X.jsx)(`span`,{className:`ai-task-sparkles`,"data-feedback":t?.tone,children:(0,X.jsx)(We,{size:19,strokeWidth:1.8})},t?.revision)]})}function Gs({count:e,signature:t}){let[n,r]=(0,Y.useState)({signature:t,count:e,revision:0,motion:``,visible:e>0});return n.signature!==t&&r({signature:t,count:e,revision:n.revision+1,motion:e===0?`exit`:e>n.count?`increase`:e<n.count?`decrease`:`replace`,visible:e>0||n.count>0}),(0,Y.useEffect)(()=>{if(n.count||!n.visible)return;let e=window.setTimeout(()=>r(e=>({...e,visible:!1})),360);return()=>window.clearTimeout(e)},[n.count,n.visible,n.revision]),n.visible?(0,X.jsx)(`span`,{"aria-hidden":`true`,className:`count-pill ai-task-count${n.motion?` ai-task-count-${n.motion}`:``}`,children:e},n.revision):null}function Ks({children:e}){let{user:t}=L(),[n,r]=(0,Y.useState)([]),[i,a]=(0,Y.useState)(null),[o,s]=(0,Y.useState)(!1),c=(0,Y.useRef)(null),[l,u]=(0,Y.useState)({revision:0}),d=(0,Y.useRef)(new Map),f=(0,Y.useCallback)((e,t)=>(d.current.set(e,t),()=>{d.current.get(e)===t&&d.current.delete(e)}),[]),p=(0,Y.useCallback)(e=>d.current.get(e),[]),m=(0,Y.useCallback)((e={})=>{c.current=document.activeElement instanceof HTMLElement?document.activeElement:null,u(t=>({...e,revision:t.revision+1})),s(!0)},[]),[h,g]=(0,Y.useState)(window.location.hash.split(`?`)[0]===`#/ai-tasks`),[_,v]=(0,Y.useState)(``),[y,b]=(0,Y.useState)(!1),[x,S]=(0,Y.useState)(!1),[C,w]=(0,Y.useState)(null),[T,E]=(0,Y.useState)(null),D=(0,Y.useRef)(null),[O,ee]=(0,Y.useState)(new Set),k=(0,Y.useRef)(new Set),[A,j]=(0,Y.useState)(!document.hidden),M=(0,Y.useRef)(!1),te=(0,Y.useRef)(new Set),ne=(0,Y.useRef)(null),re=(0,Y.useRef)(null),N=(0,Y.useRef)(!1),P=(0,Y.useRef)(!1),F=(0,Y.useRef)(0),I=(0,Y.useRef)(!0),ie=Ls(`ai-results-${t.id}`),ae=(0,Y.useCallback)(e=>{F.current+=1,I.current&&r(t=>[...e,...t.filter(t=>!e.some(e=>e.id===t.id))].sort((e,t)=>t.id-e.id))},[]),R=(0,Y.useCallback)((e=!1)=>{if(N.current=!0,P.current||=e,re.current)return re.current;S(!0);let t=(async()=>{do{N.current=!1;let e=F.current,t=P.current;P.current=!1;let[n,i]=await Promise.allSettled([Ka(`/ai/jobs`,{},{background:!0}),t?Ka(`/ai/config`,{},{background:!0}):Promise.resolve(null)]);if(!I.current)break;n.status===`fulfilled`&&(e===F.current?(r(n.value),w(Date.now())):N.current=!0),i.status===`fulfilled`&&i.value&&a(i.value),v(n.status===`rejected`?n.reason.message:i.status===`rejected`?i.reason.message:``),b(!0)}while(I.current&&N.current)})().finally(()=>{re.current=null,I.current&&S(!1)});return re.current=t,t},[]),z=(0,Y.useCallback)(()=>R(!0),[R]);(0,Y.useEffect)(()=>{I.current=!0,z();let e=()=>{R()},t=()=>{z()},n=()=>{j(!document.hidden),document.hidden||z()},r=()=>{s(!1),g(window.location.hash.split(`?`)[0]===`#/ai-tasks`)},i=e=>{let t=e.detail.path.split(`?`)[1]||``,n=Number(new URLSearchParams(t).get(`job`))||null;m({jobId:n||void 0,view:new URLSearchParams(t).get(`view`)===`review`?`review`:`list`})};return window.addEventListener(`mistakes:updated`,e),window.addEventListener(`focus`,t),window.addEventListener(`hashchange`,r),window.addEventListener(`mistakes:open-ai-tasks`,i),document.addEventListener(`visibilitychange`,n),()=>{I.current=!1,window.removeEventListener(`mistakes:updated`,e),window.removeEventListener(`focus`,t),window.removeEventListener(`hashchange`,r),window.removeEventListener(`mistakes:open-ai-tasks`,i),document.removeEventListener(`visibilitychange`,n)}},[R,z,m]);let oe=n.filter(Xs).length;(0,Y.useEffect)(()=>{if(!A)return;let e=setInterval(()=>void R(),oe?2e3:15e3);return()=>clearInterval(e)},[oe,A,R]),(0,Y.useEffect)(()=>{o&&z()},[o,z]),(0,Y.useEffect)(()=>{if(C===null)return;let e=D.current;if(D.current=new Map(n.map(({id:e,status:t,applyStatus:n})=>[e,{status:t,applyStatus:n}])),!e)return;let t=null;for(let r of n){let n=e.get(r.id);if(r.mistakeDeleted||n?.status===r.status&&n.applyStatus===r.applyStatus||Xs(r)&&n&&Xs(n))continue;let i=Vs(r);(t===null||ec[i]>ec[t])&&(t=i)}if(t!==null){let e=t;E(t=>({revision:(t?.revision??0)+1,tone:e}))}},[n,C]),(0,Y.useEffect)(()=>{let e=[];if(ne.current)for(let t of n){let n=ne.current.get(t.id);if(n&&n!==t.status&&!t.mistakeDeleted){if(t.status===`succeeded`){let n=t.applyStatus!==`applied`,r=`/ai-tasks?job=${t.id}${n?`&view=review`:``}`;e.push({id:String(t.id),path:r,status:`completed`,message:`记录 #${t.mistakeId} ${Ys(t)}完成${n?`，待校对。`:`，已填入。`}`})}if(t.status===`failed`){let n=`/ai-tasks?job=${t.id}`;e.push({id:String(t.id),path:n,status:`failed`,message:`记录 #${t.mistakeId} ${Ys(t)}失败，点击查看原因并重试。`})}}}ne.current=new Map(n.map(e=>[e.id,e.status])),!o&&!h&&ie(e)},[n,ie,o,h]),(0,Y.useEffect)(()=>{if(y){for(let e of n){if(!e.analysisRoute||e.mistakeDeleted)continue;let t=`${e.id}:${e.analysisRoute.at}`;if(te.current.has(t)||(te.current.add(t),!M.current&&!Xs(e)))continue;let n=`/ai-tasks?job=${e.id}`,r=e.analysisRoute.reason===`model_request`?`常规模型请求升级`:`解析响应超时`;o||H.info((0,X.jsxs)(`a`,{className:`ai-toast-link`,href:`#${n}`,children:[(0,X.jsxs)(`span`,{children:[`记录 #`,e.mistakeId,` `,r,`，已自动切换至升级模型 `,e.analysisRoute.model,`。`]}),(0,X.jsx)(`small`,{children:`查看任务进度`})]}),{...Fs(n),toastId:`analysis-route-${t}`})}M.current=!0}},[n,y,o]);let se=(0,Y.useCallback)(async e=>{try{let t=await Ka(`/ai/jobs`,to(e));return ae([t]),t}catch(e){throw H.error(e.message),e}},[ae]),ce=(0,Y.useCallback)(async(e,t={})=>{try{let n=await Ka(`/ai/jobs/${e}/apply`,to(t));return ae([n.job]),o||H.success(`AI 结果已填入。`),n}catch(t){let r=n.find(t=>t.id===e),i=r?`/mistakes/${r.mistakeId}/edit?aiJob=${e}`:`/ai-tasks`;throw o||H.error((0,X.jsxs)(`a`,{className:`ai-toast-link`,href:`#${i}`,children:[(0,X.jsx)(`span`,{children:t.message}),(0,X.jsx)(`small`,{children:`点击继续校对`})]}),Fs(i)),z(),t}},[z,ae,n,o]),le=(0,Y.useCallback)(async(e,t)=>{let n=[...new Set(e)].filter(e=>!k.current.has(e));if(!n.length)return{jobs:[],errors:[]};n.forEach(e=>k.current.add(e)),ee(new Set(k.current));try{let e=await Ka(`/ai/jobs/batch`,to({ids:n,action:t}));return ae(e.jobs),e.jobs.length&&!o&&H.success(t===`retry`?`已将 ${e.jobs.length} 项任务重新加入队列。`:`已取消 ${e.jobs.length} 项任务。`),e}finally{n.forEach(e=>k.current.delete(e)),I.current&&(ee(new Set(k.current)),R())}},[R,ae,o]);return(0,X.jsxs)(rc.Provider,{value:{jobs:n,config:i,error:_,loaded:y,refreshing:x,updatedAt:C,feedback:T,busyIds:O,refresh:z,createJob:se,applyJob:ce,actJobs:le,open:o,openTasks:m,registerEditor:f,editorSession:p,closeTasks:()=>s(!1)},children:[e,(0,X.jsx)(Ds,{children:(0,X.jsx)(Y.Suspense,{fallback:null,children:(0,X.jsx)(qs,{open:o,onOpenChange:s,request:l,triggerRef:c},l.revision)})})]})}var Y,X,qs,Js,Ys,Xs,Zs,Qs,$s,ec,tc,nc,rc,ic=t((()=>{Y=e(V()),st(),kn(),no(),P(),Os(),Is(),Bs(),X=Ue(),vs(),qs=(0,Y.lazy)(()=>_s(()=>import(`./AiQuickPanel-kEngaTrn.js`).then(e=>({default:e.AiQuickPanel})),__vite__mapDeps([2,1,3,4,5,6,7,8,9,10,11,12,13,14,15,16]))),Js={question:`题干识别`,answer:`答案识别`,analysis:`生成解析`},Ys=e=>e.mode===`page-entry`?`按页录题`:Js[e.type],Xs=e=>[`queued`,`running`,`retrying`].includes(e.status),Zs=e=>!e.mistakeDeleted&&e.status===`succeeded`&&e.applyStatus!==`applied`,Qs=e=>Xs(e)||e.status===`failed`||e.status===`succeeded`&&e.applyStatus!==`applied`,$s=e=>!e.mistakeDeleted&&[`failed`,`cancelled`].includes(e.status),ec={cancelled:0,active:1,done:2,review:3,failed:4},tc=900,nc=680,rc=(0,Y.createContext)(null)})),ac,oc,sc,cc,lc,uc,dc=t((()=>{no(),ac=class extends Error{constructor(){super(`请求超时，请重试。`)}},oc=[1e3,2e3,4e3],sc=e=>({...e,auxiliaryKnowledgePointIds:[...e.auxiliaryKnowledgePointIds]}),cc=e=>e instanceof Error?e.message:`请求失败，请重试。`,lc=e=>e instanceof eo?e.status===408||e.status===429||e.status>=500&&e.status<600:e instanceof TypeError||e instanceof ac,uc=class{batches=new Map;listeners=new Set;snapshot=[];subscribe=e=>(this.listeners.add(e),()=>{this.listeners.delete(e)});getSnapshot=()=>this.snapshot;enqueue({mistakeId:e,purpose:t,input:n,files:r,recognize:i,recognitionPrompt:a}){let o=crypto.randomUUID(),s={view:{id:o,mistakeId:e,purpose:t,total:r.length,imageIds:[],status:`uploading`,message:`图片已压缩，正在后台上传…`,reuseRequested:!1},files:[...r],input:sc(n),recognize:i,recognitionPrompt:a?.trim()||void 0,recognitionSubmitted:!1,recognitionClientId:crypto.randomUUID(),reuseClientId:crypto.randomUUID(),running:!1,controller:new AbortController};return this.batches.set(o,s),this.publish(),this.run(s),o}reuse(e,t,n){let r=this.batches.get(e);return!r||r.view.purpose!==`question`||r.view.reuseRequested?!1:(r.reuseInput=sc(t),r.reuseRecognitionPrompt=n?.trim()||r.recognitionPrompt,this.update(r,{reuseRequested:!0,reuseStatus:`waiting`}),r.view.imageIds.length===r.view.total&&this.run(r),!0)}retry(e){let t=this.batches.get(e);t&&!t.running&&t.view.status===`failed`&&(t.recognitionError=void 0,t.reuseError=void 0,t.view.reuseStatus===`failed`&&this.update(t,{reuseStatus:`waiting`}),this.run(t))}dispose(){for(let e of this.batches.values())e.controller.abort(),e.files=[];this.batches.clear(),this.snapshot.length&&this.publish()}publish(){this.snapshot=Array.from(this.batches.values(),e=>e.view).reverse(),this.listeners.forEach(e=>e())}update(e,t){e.controller.signal.aborted||(e.view={...e.view,...t},this.publish())}async run(e){if(!(e.running||e.controller.signal.aborted)){e.running=!0;try{try{for(;e.view.imageIds.length<e.view.total;){let t=e.view.imageIds.length,n=e.files[t],r=await this.request(e,`uploading`,`正在后台上传第 ${t+1}/${e.view.total} 张图片…`,9e4,t=>{if(n.source)return Ka(`/mistakes/${e.view.mistakeId}/reuse-photo`,{...to({...n.source,purpose:e.view.purpose,clientId:n.clientId}),signal:t},{background:!0});let r=new FormData;return r.append(`original`,n.original,n.originalName.replace(/\.[^.]+$/,``)+`.jpg`),r.append(`crop`,n.crop,`crop.jpg`),r.append(`purpose`,e.view.purpose),r.append(`clientId`,n.clientId),Ka(`/mistakes/${e.view.mistakeId}/images`,{method:`POST`,body:r,signal:t},{background:!0})});this.update(e,{imageIds:[...e.view.imageIds,r.id]})}e.files=[]}catch(t){e.controller.signal.aborted||this.update(e,{status:`failed`,message:`图片上传失败：${cc(t)}`});return}if(e.recognize&&!e.recognitionSubmitted&&!e.recognitionError)try{await this.submitRecognition(e,e.view.purpose,e.input,e.recognitionClientId,e.recognitionPrompt),e.recognitionSubmitted=!0}catch(t){if(e.controller.signal.aborted)return;e.recognitionError=cc(t)}if(e.reuseInput&&e.view.reuseStatus===`waiting`){this.update(e,{reuseStatus:`submitting`});try{await this.submitRecognition(e,`answer`,e.reuseInput,e.reuseClientId,e.reuseRecognitionPrompt),this.update(e,{reuseStatus:`submitted`})}catch(t){if(e.controller.signal.aborted)return;e.reuseError=cc(t),this.update(e,{reuseStatus:`failed`})}}let t=[e.recognitionError&&`识别任务提交失败：${e.recognitionError}`,e.reuseError&&`答案复用提交失败：${e.reuseError}`].filter(Boolean);this.update(e,{status:t.length?`failed`:`completed`,message:t.length?t.join(`；`):e.view.reuseStatus===`submitted`?`图片已上传，答案复用已交给后台识别。`:e.recognize?`图片已上传，已交给后台识别。`:`${e.view.total} 张图片已上传。`})}finally{e.running=!1,!e.controller.signal.aborted&&e.view.imageIds.length===e.view.total&&e.view.reuseStatus===`waiting`&&this.run(e)}}}submitRecognition(e,t,n,r,i){return this.request(e,`processing`,`正在后台提交${t===`question`?`题目`:`答案`}识别…`,3e4,a=>Ka(`/ai/jobs`,{...to({clientId:r,mistakeId:e.view.mistakeId,type:t,imageIds:e.view.imageIds,input:n,recognitionPrompt:i}),signal:a},{background:!0}))}async request(e,t,n,r,i){for(let a=0;;a+=1){e.controller.signal.throwIfAborted(),this.update(e,{status:t,message:n});try{return await this.withTimeout(e,r,i)}catch(t){if(e.controller.signal.aborted||!lc(t)||a>=oc.length)throw t;let n=oc[a];this.update(e,{status:`retrying`,message:`网络请求失败，${n/1e3} 秒后自动重试（${a+1}/${oc.length}）…`}),await this.wait(e,n)}}}async withTimeout(e,t,n){e.controller.signal.throwIfAborted();let r=new AbortController,i=()=>r.abort();e.controller.signal.addEventListener(`abort`,i,{once:!0});let a=!1,o=setTimeout(()=>{a=!0,r.abort()},t);try{return await n(r.signal)}catch(e){throw a?new ac:e}finally{clearTimeout(o),e.controller.signal.removeEventListener(`abort`,i)}}wait(e,t){return new Promise((n,r)=>{let i=e.controller.signal,a=()=>{clearTimeout(o),r(i.reason)},o=setTimeout(()=>{i.removeEventListener(`abort`,a),n()},t);i.addEventListener(`abort`,a,{once:!0}),i.aborted&&a()})}}}));function fc(){let e=(0,mc.useContext)(gc);if(!e)throw Error(`Photo uploads context missing`);return e}function pc({children:e}){let[t]=(0,mc.useState)(()=>new uc),n=(0,mc.useRef)(new Map),r=(0,mc.useSyncExternalStore)(t.subscribe,t.getSnapshot),i=Ls(`photo-uploads`);return(0,mc.useEffect)(()=>()=>{t.dispose()},[t]),(0,mc.useEffect)(()=>{let e=[];for(let i of r){if(n.current.get(i.id)===i)continue;n.current.set(i.id,i);let r=`/mistakes/${i.mistakeId}/edit?photo=${i.purpose}`;e.push({id:i.id,path:r,message:`记录 #${i.mistakeId} · ${i.message}`,status:i.status===`failed`?`failed`:i.status===`completed`?`completed`:`active`,retry:i.status===`failed`?()=>t.retry(i.id):void 0})}i(e)},[r,t,i]),(0,hc.jsx)(gc.Provider,{value:{queue:t,batches:r},children:e})}var mc,hc,gc,_c=t((()=>{mc=e(V()),dc(),Bs(),hc=Ue(),gc=(0,mc.createContext)(null)})),vc=t((()=>{}));function yc({path:e,editorId:t,skeletonKind:n,children:r}){let[i]=(0,Z.useState)(()=>document.createElement(`div`)),a=(0,Z.useRef)(null),[o,s]=(0,Z.useState)(null),[c,l]=(0,Z.useState)(null),[u,d]=(0,Z.useState)(null),[f,p]=(0,Z.useState)(!1),m=(0,Z.useRef)(null),h=(0,Z.useRef)(0),g=(0,Z.useRef)({hash:``,x:0,y:0}),_=(0,Z.useRef)(new Set),v=(0,Z.useRef)({target:u,editorId:t,open:f});v.current={target:u,editorId:t,open:f};let y=!!(u?.editing&&t===u.id),b=(0,Z.useCallback)(e=>{let{target:t,editorId:n}=v.current;return!t?.editing||t.id===n||!!e?.editing&&e.id===t.id||!m.current||m.current()},[]),x=(0,Z.useCallback)(()=>{b(null)&&p(!1)},[b]),S=(0,Z.useCallback)(e=>{let t=ks(e);if(!t){Ja(e);return}b(t)&&(v.current.target||(g.current={hash:window.location.hash,x:window.scrollX,y:window.scrollY}),d({...t,path:e,requestId:++h.current}),p(!0))},[b]),C=(0,Z.useCallback)(e=>(m.current=e,()=>{m.current===e&&(m.current=null)}),[]),w=(0,Z.useCallback)(e=>{if(!(e||v.current.open)){d(null);for(let e of _.current)window.dispatchEvent(new CustomEvent(`mistakes:record-view-updated`,{detail:{id:e}}));_.current.clear(),window.location.hash===g.current.hash&&requestAnimationFrame(()=>window.scrollTo(g.current.x,g.current.y))}},[]);(0,Z.useEffect)(()=>{let e=e=>{let t=e.detail.path;e.preventDefault(),S(t)},t=()=>{v.current.target&&window.location.hash!==g.current.hash&&p(!1)},n=()=>{v.current.target&&_.current.add(v.current.target.id)};return window.addEventListener(Ns,e),window.addEventListener(`hashchange`,t),window.addEventListener(`mistakes:updated`,n),()=>{window.removeEventListener(Ns,e),window.removeEventListener(`hashchange`,t),window.removeEventListener(`mistakes:updated`,n)}},[S]),(0,Z.useLayoutEffect)(()=>{let e=y?o:a.current;e&&i.parentElement!==e&&(y&&a.current&&(a.current.style.minHeight=`${a.current.getBoundingClientRect().height}px`),e.appendChild(i),!y&&a.current&&(a.current.style.minHeight=``))},[i,y,o]);let T=e=>{if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;let t=e.target.closest(`a[href^="#/"]`);if(!t||t.target===`_blank`||t.hasAttribute(`download`))return;let n=t.getAttribute(`href`).slice(1);ks(n)&&(e.preventDefault(),S(n))},E=u?{path:u.path,requestId:u.requestId,navigate:S,registerLeaveCheck:C,actionsContainer:c,retainsEditor:y,saved:()=>{v.current.target?.id===u.id&&x()},updated:e=>{_.current.delete(e),window.dispatchEvent(new CustomEvent(`mistakes:record-view-updated`,{detail:{id:e}}))}}:null,D=u?.editing?`editor`:`detail`;return(0,xc.jsxs)(xc.Fragment,{children:[(0,xc.jsx)(`div`,{ref:a,className:`record-page-slot`}),(0,bc.createPortal)((0,xc.jsx)(js.Provider,{value:y?E:null,children:(0,xc.jsx)(Ds,{resetKey:e.split(`?`)[0],children:(0,xc.jsx)(Z.Suspense,{fallback:(0,xc.jsx)(Jo,{loading:!0,kind:n,children:null}),children:r})})}),i),u&&(0,xc.jsx)(Pa,{open:f,onOpenChange:e=>e?p(!0):x(),onOpenChangeComplete:w,title:u.editing?`编辑错题`:`错题详情`,closeLabel:`关闭题目`,className:`record-view-drawer`,footer:(0,xc.jsx)(`div`,{ref:l,className:`record-view-actions`,onClickCapture:T}),children:()=>(0,xc.jsx)(`div`,{ref:s,className:`record-view-slot`,onClickCapture:T,children:!y&&(0,xc.jsx)(js.Provider,{value:E,children:(0,xc.jsx)(Ds,{resetKey:u.path,children:(0,xc.jsx)(Z.Suspense,{fallback:(0,xc.jsx)(Jo,{loading:!0,kind:D,children:null}),children:u.editing?(0,xc.jsx)(Cc,{id:u.id},`editor-${u.id}`):(0,xc.jsx)(Sc,{id:u.id},`detail-${u.id}`)})})})})})]})}var Z,bc,xc,Sc,Cc,wc=t((()=>{Z=e(V()),bc=e(o()),no(),La(),as(),Os(),Ps(),vc(),xc=Ue(),vs(),Sc=(0,Z.lazy)(()=>_s(()=>import(`./DetailPage-C_044r0-.js`).then(e=>({default:e.DetailPage})),__vite__mapDeps([17,1,3,4,5,18,9,6,10,19,20,8,11,21,22,13,14]))),Cc=(0,Z.lazy)(()=>_s(()=>import(`./EditorPage-_J14AYvB.js`).then(e=>({default:e.EditorPage})),__vite__mapDeps([23,1,3,4,5,8,9,6,10,11,21,7,12,13,14,24,22,25])))}));function Tc({onLogin:e,onNotify:t}){let[n,r]=(0,Q.useState)(!1),[i,a]=(0,Q.useState)(``),[o,s]=(0,Q.useState)(``),[c,l]=(0,Q.useState)(``),[u,d]=(0,Q.useState)(!1),[f,p]=(0,Q.useState)(``),[m,h]=(0,Q.useState)(null),[g,_]=(0,Q.useState)(``),[v,y]=(0,Q.useState)(0),[b,x]=(0,Q.useState)({status:`pending`,response:``}),[S,C]=(0,Q.useState)(0),w=(0,Q.useRef)(!1);(0,Q.useEffect)(()=>{let e=!0;return h(null),_(``),Ka(`/auth/config`).then(t=>{e&&h(t)}).catch(t=>{e&&_(t.message)}),()=>{e=!1}},[v]);let T=m!==null&&(!m.enabled||b.status===`complete`||!n&&b.status===`error`);function E(){x({status:`pending`,response:``}),C(e=>e+1)}async function D(r){if(r.preventDefault(),!w.current&&T){w.current=!0,d(!0),p(``);try{let r=await Ka(n?`/auth/register`:`/auth/login`,to({username:i.trim(),password:o,captchaResponse:m?.enabled?b.response:``,...n?{inviteCode:c.trim()}:{}}));r.user.active&&t(n?`欢迎，${r.user.username}！账号已创建。`:`欢迎回来，${r.user.username}！`),e(r.user)}catch(e){p(e.message),H.error(e.message),E()}finally{w.current=!1,d(!1)}}}return(0,$.jsxs)(`div`,{className:`auth-page`,children:[(0,$.jsxs)(`aside`,{className:`auth-story`,children:[(0,$.jsxs)(`a`,{className:`brand`,href:`/`,"aria-label":`返回首页`,children:[(0,$.jsx)(os,{}),(0,$.jsxs)(`span`,{className:`brand-text`,children:[`拾题`,(0,$.jsx)(`span`,{children:`把错题，学明白。`})]})]}),(0,$.jsxs)(`div`,{className:`auth-story-body`,children:[(0,$.jsxs)(`span`,{className:`small-pill`,children:[(0,$.jsx)(ot,{size:16}),` 你的个人错题本`]}),(0,$.jsxs)(`h1`,{children:[`做错的题，`,(0,$.jsx)(`br`,{}),`值得再想一遍。`]}),(0,$.jsxs)(`p`,{children:[`记录卡住你的那一步，梳理知识点。`,(0,$.jsx)(`br`,{}),`再练一次，让「不熟」慢慢变成「掌握」。`]}),(0,$.jsxs)(`div`,{className:`auth-note`,children:[(0,$.jsxs)(`div`,{className:`auth-note-top`,children:[(0,$.jsxs)(`span`,{children:[(0,$.jsx)(ot,{size:18}),` 我的学习笔记`]}),(0,$.jsx)(`span`,{className:`note-dots`,children:`•••`})]}),(0,$.jsx)(`div`,{className:`note-rule long`}),(0,$.jsx)(`div`,{className:`note-rule`}),(0,$.jsxs)(`div`,{className:`auth-note-bottom`,children:[(0,$.jsxs)(`span`,{children:[(0,$.jsx)(tt,{size:17}),` 记录 · 整理 · 复习`]}),(0,$.jsx)(`span`,{className:`note-check`,children:(0,$.jsx)(tt,{size:25})})]})]})]}),(0,$.jsx)(`div`,{className:`auth-story-footer`,children:`记录问题 · 理清思路 · 回顾练习`})]}),(0,$.jsx)(`main`,{className:`auth-form-area`,children:(0,$.jsxs)(`div`,{className:`auth-form-wrap`,children:[(0,$.jsx)(`div`,{className:`auth-icon`,children:(0,$.jsx)(Qe,{size:30})}),(0,$.jsx)(`h2`,{children:n?`开始积累，遇见进步`:`欢迎回来`}),(0,$.jsx)(`p`,{className:`auth-subtitle`,children:n?`使用邀请码创建账号，开启你的错题本。`:`登录后，继续整理你的学习收获。`}),(0,$.jsxs)(`form`,{onSubmit:D,children:[(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`用户名`}),(0,$.jsx)(`input`,{required:!0,autoComplete:`username`,minLength:3,maxLength:32,placeholder:`输入用户名`,value:i,onChange:e=>a(e.target.value)})]}),(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`密码`}),(0,$.jsx)(`input`,{required:!0,type:`password`,autoComplete:n?`new-password`:`current-password`,minLength:n?8:void 0,maxLength:128,placeholder:n?`至少 8 位密码`:`输入密码`,value:o,onChange:e=>s(e.target.value)})]}),n&&(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`邀请码`}),(0,$.jsx)(`input`,{required:!0,placeholder:`输入管理员提供的邀请码`,value:c,onChange:e=>l(e.target.value)}),(0,$.jsx)(`small`,{children:`邀请码由管理员生成。`})]}),!m&&(g?(0,$.jsxs)(`div`,{className:`auth-captcha-notice is-error`,role:`alert`,children:[(0,$.jsxs)(`span`,{children:[`安全配置加载失败：`,g]}),(0,$.jsx)(`button`,{type:`button`,onClick:()=>y(e=>e+1),children:`重新加载`})]}):(0,$.jsxs)(`div`,{className:`auth-captcha-loading`,role:`status`,children:[(0,$.jsx)(et,{className:`spin`,size:16}),` 正在加载安全验证…`]})),m?.enabled&&(0,$.jsxs)(`div`,{className:`auth-captcha`,children:[(0,$.jsx)(bs,{sitekey:m.sitekey,resetKey:S,onChange:x},`${n}-${S}`),(b.status===`error`||b.status===`expired`)&&(0,$.jsxs)(`div`,{className:`auth-captcha-notice`,role:`status`,children:[(0,$.jsx)(`span`,{children:b.status===`expired`?`验证已过期，请重新验证。`:n?`人机验证暂不可用，请重试后再注册。`:`人机验证暂不可用，你可以重试或尝试登录。`}),(0,$.jsx)(`button`,{type:`button`,disabled:u,onClick:E,children:`重新验证`})]})]}),f&&(0,$.jsx)(`div`,{className:`form-error`,role:`alert`,children:f}),(0,$.jsx)(`button`,{className:`button primary auth-submit`,disabled:u||!T,children:u?(0,$.jsx)(et,{className:`spin`,size:18}):(0,$.jsxs)($.Fragment,{children:[n?`创建账号`:`登录`,(0,$.jsx)(Ye,{size:18})]})})]}),(0,$.jsxs)(`div`,{className:`auth-switch`,children:[n?`已有账号？`:`还没有账号？`,(0,$.jsx)(`button`,{disabled:u,onClick:()=>{w.current||(r(!n),p(``),E())},children:n?`立即登录`:`使用邀请码注册`})]}),(0,$.jsxs)(`div`,{className:`auth-secure`,children:[(0,$.jsx)(Je,{size:15}),` 你的错题与笔记，仅对你可见`]})]})})]})}function Ec(){let[e,t]=(0,Q.useState)(null),[n,r]=(0,Q.useState)(!0),[i,a]=(0,Q.useState)([]),[o,s]=(0,Q.useState)([]),[c,l]=(0,Q.useState)(``),[u,d]=(0,Q.useState)(!1),[f,p]=(0,Q.useState)(window.location.hash.slice(1)||`/mistakes`),[m,h]=(0,Q.useState)({session:0,recordId:null}),g=(0,Q.useRef)(m);g.current=m;let _=(0,Q.useRef)(null),v=(0,Q.useRef)(null),y=(0,Q.useRef)(null),b=(0,Q.useRef)(!1);(0,Q.useEffect)(()=>{let e=!0,n=window.history.scrollRestoration;window.history.scrollRestoration=`manual`;let i=(window.location.hash.slice(1)||`/mistakes`).split(`?`)[0];Ka(`/auth/me`).then(n=>{e&&(n.user?.active&&[`/mistakes`,`/`].includes(i)&&(v.current=`欢迎回来，${n.user.username}！`),t(n.user))}).catch(()=>{e&&t(null)}).finally(()=>{e&&r(!1)});let a=e=>{let t=window.location.hash.slice(1)||`/mistakes`;if(!window.dispatchEvent(new CustomEvent(`mistakes:before-navigate`,{cancelable:!0,detail:{path:t}}))){window.history.replaceState(null,``,new URL(e.oldURL).hash||`#/mistakes`);return}let n=t.split(`?`)[0],r=new URL(e.oldURL||window.location.href).hash.slice(1)||`/mistakes`;Ao(r)&&!Ao(t)&&(y.current={path:r,x:window.scrollX,y:window.scrollY}),!Ao(t)&&!/^\/mistakes\/\d+(\/edit)?$/.test(n)&&(y.current=null);let i=r.split(`?`)[0];_.current=Ao(t)&&Number(i.match(/^\/mistakes\/(\d+)/)?.[1])||null,Io(i===`/new`&&n===`/mistakes/${g.current.recordId}/edit`?null:Fo(r,t),()=>{h(e=>n===`/new`?{session:e.session+1,recordId:null}:e.recordId&&n!==`/mistakes/${e.recordId}/edit`?{...e,recordId:null}:e),p(t)})};return window.addEventListener(`hashchange`,a),()=>{e=!1,window.removeEventListener(`hashchange`,a),window.history.scrollRestoration=n}},[]),(0,Q.useLayoutEffect)(()=>{let e=Ao(f)?y.current:null;window.scrollTo({left:e?.x||0,top:e?.y||0,behavior:`instant`});let t=_.current;_.current=null,t&&Ao(f)&&Lo(t)},[f]);let x=(0,Q.useCallback)((e,t=`success`)=>{H[t](e)},[]);(0,Q.useEffect)(()=>{if(e?.active&&v.current){let e=v.current;v.current=null,x(e)}},[e,x]);let S=(0,Q.useCallback)(async()=>{try{let[e,t]=await Promise.all([Ka(`/subjects`),Ka(`/knowledge-points`)]);a(e),s(Te(t,e)),l(``)}catch(e){l(e.message)}},[]);(0,Q.useEffect)(()=>{e?.active&&S()},[e,S]),(0,Q.useEffect)(()=>{if(!e?.active)return;let t=window.setTimeout(()=>{_s(()=>import(`./DetailPage-C_044r0-.js`),__vite__mapDeps([17,1,3,4,5,18,9,6,10,19,20,8,11,21,22,13,14]))},1500);return()=>window.clearTimeout(t)},[e?.active]),(0,Q.useEffect)(()=>{if(!e?.active){d(!1);return}let t=!0,n=!1,r=0,i=async()=>{if(n||document.hidden)return;n=!0;let e=r;try{let n=await Ka(`/system/status`,{},{background:!0});t&&r===e&&d(n.readOnly)}catch{}finally{n=!1}},a=e=>{let t=e.detail;typeof t?.readOnly==`boolean`&&(r+=1,d(t.readOnly))},o=()=>{i()};window.addEventListener(`mistakes:backup-status`,a),window.addEventListener(`focus`,o),document.addEventListener(`visibilitychange`,o);let s=window.setInterval(()=>{i()},15e3);return i(),()=>{t=!1,window.clearInterval(s),window.removeEventListener(`mistakes:backup-status`,a),window.removeEventListener(`focus`,o),document.removeEventListener(`visibilitychange`,o)}},[e?.id,e?.active]),(0,Q.useEffect)(()=>{let e=()=>{v.current=null,t(e=>e&&{...e,active:!1}),window.location.hash=`/frozen`};return window.addEventListener(`mistakes:account-frozen`,e),()=>window.removeEventListener(`mistakes:account-frozen`,e)},[]);let C=(0,Q.useCallback)(async()=>{if(window.dispatchEvent(new Event(`mistakes:before-logout`,{cancelable:!0}))){window.dispatchEvent(new Event(`mistakes:session-ending`));try{await Ka(`/auth/logout`,to({})),x(`已退出登录。`),t(null),a([]),s([]),y.current=null,b.current=!1,window.location.hash=`/mistakes`}catch(e){window.dispatchEvent(new Event(`mistakes:session-resumed`)),x(e.message,`error`)}}},[x]),w=f.split(`?`)[0],T=w.match(/^\/mistakes\/(\d+)(\/edit)?$/),E=T&&y.current?y.current.path:`/mistakes`,D=Ao(f);D?b.current=!0:T||(b.current=!1);let O=T?T[2]?`editor-page`:`detail`:Fc[w]||`library`,ee=T?`/mistakes`:w===`/page-imports`?`/new`:w,k=w===`/new`?m.recordId:T?.[2]?Number(T[1]):null,A;A=w===`/new`?(0,$.jsx)(Oc,{onCreated:e=>h(t=>({...t,recordId:e}))},`new-${m.session}`):w===`/page-imports`?(0,$.jsx)(Nc,{}):T?.[2]?(0,$.jsx)(Oc,{id:Number(T[1])},m.recordId===Number(T[1])?`new-${m.session}`:w):T?(0,$.jsx)(kc,{id:Number(T[1])},f):w===`/review`?(0,$.jsx)(Ac,{},f):w===`/stats`?(0,$.jsx)(jc,{}):w===`/ai-tasks`?(0,$.jsx)(Pc,{}):w===`/settings`?(0,$.jsx)(Mc,{}):D?null:(0,$.jsx)(Dc,{}),A=(0,$.jsxs)(Oo.Provider,{value:y.current?.path||null,children:[b.current&&(0,$.jsx)(`div`,{className:`route-view`,hidden:!D,children:(0,$.jsx)(Dc,{active:D})},`library`),!D&&(0,$.jsx)(`div`,{className:`route-view`,children:(0,$.jsx)(Q.Suspense,{fallback:(0,$.jsx)(Jo,{loading:!0,kind:O,children:null}),children:A})},`page`)]});let j=e&&!e.active?(0,$.jsx)(us,{user:e,logout:C}):e?(0,$.jsx)(le.Provider,{value:{user:e,updateUser:t,subjects:i,knowledgePoints:o,refreshDirectory:S,notify:x,logout:C},children:(0,$.jsx)(Ks,{children:(0,$.jsx)(pc,{children:(0,$.jsxs)(`div`,{className:`app-shell`,children:[(0,$.jsxs)(`aside`,{className:`sidebar`,children:[(0,$.jsxs)(`a`,{className:`brand`,href:`#${E}`,children:[(0,$.jsx)(os,{}),(0,$.jsxs)(`span`,{className:`brand-text`,children:[`拾题`,(0,$.jsx)(`span`,{children:`把错题，学明白。`})]})]}),(0,$.jsx)(`div`,{className:`sidebar-label`,children:`学习空间`}),(0,$.jsx)(Vo,{value:ee,ariaLabel:`主导航`,items:Ic.map(({path:e,label:t,icon:n})=>({id:e,href:`#${e===`/mistakes`?E:e}`,label:(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(n,{size:19,strokeWidth:1.8}),(0,$.jsx)(`span`,{children:t})]})}))}),(0,$.jsxs)(`div`,{className:`sidebar-bottom`,children:[(0,$.jsxs)(`div`,{className:`sidebar-reminder`,children:[(0,$.jsx)(`span`,{className:`reminder-icon`,children:(0,$.jsx)(Ke,{size:22})}),(0,$.jsx)(`strong`,{children:`温故而知新，可以为师矣`}),(0,$.jsx)(`a`,{href:`#/review`,children:`打开复习页`})]}),(0,$.jsxs)(`div`,{className:`account`,children:[(0,$.jsx)(Us,{className:`mobile-task-trigger`}),(0,$.jsxs)(`a`,{className:`account-profile`,href:`#/settings`,children:[(0,$.jsx)(`span`,{className:`avatar`,children:e.avatar?(0,$.jsx)(`img`,{src:e.avatar,alt:``}):e.username.slice(0,1).toUpperCase()}),(0,$.jsxs)(`span`,{className:`account-name`,children:[(0,$.jsx)(`strong`,{title:e.username,children:e.username}),(0,$.jsx)(`small`,{children:e.role===`admin`?`管理员`:`我的账号`})]})]}),(0,$.jsx)(`button`,{className:`icon-button`,title:`退出登录`,"aria-label":`退出登录`,onClick:C,children:(0,$.jsx)(it,{size:17})})]})]})]}),(0,$.jsxs)(`div`,{className:`main-shell`,children:[(0,$.jsxs)(`header`,{className:`topbar`,children:[(0,$.jsxs)(`span`,{className:`topbar-label`,children:[(0,$.jsx)(Ge,{size:15}),` 个人学习空间`]}),(0,$.jsxs)(`div`,{className:`topbar-right`,children:[(0,$.jsx)(Us,{className:`desktop-task-trigger`}),(0,$.jsx)(`a`,{className:`topbar-avatar`,href:`#/settings`,"aria-label":`账号设置`,children:e.avatar?(0,$.jsx)(`img`,{src:e.avatar,alt:``}):e.username.slice(0,1).toUpperCase()})]})]}),(0,$.jsxs)(`main`,{className:`main-content`,children:[u&&(0,$.jsxs)(`div`,{className:`backup-readonly-banner`,role:`status`,children:[(0,$.jsx)($e,{size:20}),(0,$.jsxs)(`p`,{children:[(0,$.jsx)(`strong`,{children:`正在备份，暂时只读`}),(0,$.jsx)(`span`,{children:`已输入的内容会保留，请稍后重试保存。`})]})]}),c&&(0,$.jsxs)(`div`,{className:`inline-alert`,role:`alert`,children:[`基础目录加载失败：`,c,(0,$.jsx)(`button`,{onClick:S,children:`重试`})]}),(0,$.jsx)(yc,{path:f,editorId:k,skeletonKind:O,children:A}),(0,$.jsx)(`footer`,{className:`page-footer`,children:(0,$.jsxs)(`span`,{children:[`拾题 · © `,new Date().getFullYear(),` ShaoanC`]})})]})]})]})})},e.id)}):(0,$.jsx)(Tc,{onLogin:e=>{t(e),p(e.active?`/mistakes`:`/frozen`),window.location.hash=e.active?`/mistakes`:`/frozen`},onNotify:e=>{v.current=e}});return(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(zo,{}),(0,$.jsx)(Jo,{loading:n,kind:`shell`,className:`app-entrance`,children:!n&&j})]})}var Q,$,Dc,Oc,kc,Ac,jc,Mc,Nc,Pc,Fc,Ic,Lc=t((()=>{Q=e(V()),kn(),st(),no(),P(),as(),cs(),fs(),ws(),ic(),_c(),wc(),jo(),$=Ue(),vs(),Dc=(0,Q.lazy)(()=>_s(()=>import(`./MistakesPage-BSNh1UgZ.js`).then(e=>({default:e.MistakesPage})),__vite__mapDeps([26,1,3,4,5,18,9,6,10,19,20,8,11,21,27,28,29]))),Oc=(0,Q.lazy)(()=>_s(()=>import(`./EditorPage-_J14AYvB.js`).then(e=>({default:e.EditorPage})),__vite__mapDeps([23,1,3,4,5,8,9,6,10,11,21,7,12,13,14,24,22,25]))),kc=(0,Q.lazy)(()=>_s(()=>import(`./DetailPage-C_044r0-.js`).then(e=>({default:e.DetailPage})),__vite__mapDeps([17,1,3,4,5,18,9,6,10,19,20,8,11,21,22,13,14]))),Ac=(0,Q.lazy)(()=>_s(()=>import(`./ReviewPage-zxdHaU_H.js`).then(e=>({default:e.ReviewPage})),__vite__mapDeps([30,1,3,4,5,8,9,6,10,11,21,29,19]))),jc=(0,Q.lazy)(()=>_s(()=>import(`./StatsPage-99FJ9XNY.js`).then(e=>({default:e.StatsPage})),__vite__mapDeps([31,1,3,4,5,32,10,6]))),Mc=(0,Q.lazy)(()=>_s(()=>import(`./SettingsPage-BMQT00kV.js`).then(e=>({default:e.SettingsPage})),__vite__mapDeps([33,1,3,4,5,9,10,6]))),Nc=(0,Q.lazy)(()=>_s(()=>import(`./PageImports-C5FE3gWh.js`).then(e=>({default:e.PageImportsPage})),__vite__mapDeps([34,1,3,4,5,12,13,9,6,14,24,35]))),Pc=(0,Q.lazy)(()=>_s(()=>import(`./AiTaskManager-DFjj9OKH.js`).then(e=>({default:e.AiTasksPage})),__vite__mapDeps([36,1,3,4,5,8,9,6,10,11,13,14,15,16,19,27,28]))),Fc={"/new":`editor-page`,"/page-imports":`editor`,"/review":`review-page`,"/stats":`stats-page`,"/ai-tasks":`tasks-page`,"/settings":`settings-page`},Ic=[{path:`/mistakes`,label:`我的错题`,icon:Xe},{path:`/new`,label:`录入错题`,icon:nt},{path:`/review`,label:`复习`,icon:Ke},{path:`/stats`,label:`学习统计`,icon:rt},{path:`/settings`,label:`设置`,icon:Ze}]})),Rc=t((()=>{})),zc=t((()=>{})),Bc=t((()=>{})),Vc=t((()=>{})),Hc=t((()=>{}));n((()=>{var t=e(V()),n=e(w());Va(),Lc(),B(),Rc(),ge(),Oe(),zc(),Bc();var r=Ue();Vc(),Hc(),n.createRoot(document.getElementById(`root`)).render((0,r.jsxs)(t.StrictMode,{children:[(0,r.jsx)(Ec,{}),(0,r.jsx)(Ra,{})]}))}))();export{no as A,kn as B,Ao as C,eo as D,ro as E,Na as F,Ir as I,Pr as L,Ja as M,Pa as N,Ka as O,La as P,pr as R,jo as S,io as T,H as V,Jo as _,Ys as a,Ro as b,ic as c,Vs as d,Hs as f,vs as g,_s as h,Js as i,to as j,qa as k,Xs as l,Ms as m,_c as n,Qs as o,Ps as p,fc as r,$s as s,Hc as t,Zs as u,Bo as v,ko as w,No as x,as as y,mr as z};