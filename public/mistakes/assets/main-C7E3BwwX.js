const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/sdk-LxJ6YTVI.js","assets/rolldown-runtime-8BhlS34s.js","assets/AiTaskManager-DH_ohNyF.js","assets/ScrollArea-DhMGDbCc.js","assets/jsx-runtime-Bn2T453b.js","assets/MarkdownContent-czR3hhkr.js","assets/components-Cev9ESD7.js","assets/MarkdownContent-DJrlGixw.css","assets/Select-4wL-1bA_.js","assets/library-pagination-Srq0vuK8.js","assets/library-pagination-DqaJHoO0.css","assets/DetailPage-DyFukvFq.js","assets/export-selection-Br5PjXp_.js","assets/MobileDrawer-C4rSnLpt.js","assets/MobileDrawer-BVO7v4j8.css","assets/export-selection-DNGqwLjh.css","assets/StarRating-CDQrtqE0.js","assets/ImageHistory-Cg1Y1nxH.js","assets/EditorPage-7XBJxpCf.js","assets/ImageRegions-D7cdKpcy.js","assets/EditorPage-DJOnVxEf.css","assets/MistakesPage-EDBKnyN_.js","assets/ReviewPage-C0wYE3gj.js","assets/StatsPage-Bp7G1j2D.js","assets/clsx-DNZXw_RA.js","assets/SettingsPage-YyA-zxWb.js","assets/SettingsPage-BizY1aqO.css","assets/PageImports-B-QcK4hs.js","assets/PageImports-Be4L-udF.css"])))=>i.map(i=>d[i]);
import{i as e,n as t,t as n}from"./rolldown-runtime-8BhlS34s.js";import{Cn as r,Sn as i,Wt as a,f as o,i as s,it as c,n as l,o as u,r as d,t as f,u as p,ut as m,vn as h,wn as g,xn as _,yn as v}from"./ScrollArea-DhMGDbCc.js";import{N as y,T as b,U as x,Ut as S,Y as C,Zt as w,_n as T,a as E,j as D,jt as ee,kn as O,lt as te,n as k,p as A,pt as j,t as M,tn as N,xn as ne,xt as re}from"./jsx-runtime-Bn2T453b.js";import{n as ie,t as P}from"./clsx-DNZXw_RA.js";import{n as ae,r as oe,t as se}from"./MobileDrawer-C4rSnLpt.js";function ce(e,t,n=300){let{scrollHeight:r,style:i}=e;requestAnimationFrame(()=>{i.minHeight=`initial`,i.height=r+`px`,i.transition=`all ${n}ms`,requestAnimationFrame(()=>{i.height=`0`,i.padding=`0`,i.margin=`0`,setTimeout(t,n)})})}function le({enter:e,exit:t,appendPosition:n=!1,collapse:r=!0,collapseDuration:i=300}){return function({children:a,position:o,preventExitTransition:s,done:c,nodeRef:l,isIn:u,playToast:d}){let f=n?`${e}--${o}`:e,p=n?`${t}--${o}`:t,m=(0,Be.useRef)(0);return(0,Be.useLayoutEffect)(()=>{let e=l.current,t=f.split(` `),n=r=>{r.target===l.current&&(d(),e.removeEventListener(`animationend`,n),e.removeEventListener(`animationcancel`,n),m.current===0&&r.type!==`animationcancel`&&e.classList.remove(...t))};e.classList.add(...t),e.addEventListener(`animationend`,n),e.addEventListener(`animationcancel`,n)},[]),(0,Be.useEffect)(()=>{let e=l.current,t=()=>{e.removeEventListener(`animationend`,t),r?ce(e,c,i):c()};u||(s?t():(m.current=1,e.className+=` ${p}`,e.addEventListener(`animationend`,t)))},[u]),Be.createElement(Be.Fragment,null,a)}}function ue(e,t){return{content:de(e.content,e.props),containerId:e.props.containerId,id:e.props.toastId,theme:e.props.theme,type:e.props.type,data:e.props.data||{},isLoading:e.props.isLoading,icon:e.props.icon,reason:e.removalReason,status:t}}function de(e,t,n=!1){return(0,Ve.isValidElement)(e)&&!L(e.type)?(0,Ve.cloneElement)(e,{closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):R(e)?e({closeToast:t.closeToast,toastProps:t,data:t.data,isPaused:n}):e}function fe({closeToast:e,theme:t,ariaLabel:n=`close`}){return He.createElement(`button`,{className:`Toastify__close-button Toastify__close-button--${t}`,type:`button`,onClick:t=>{t.stopPropagation(),e(!0)},"aria-label":n},He.createElement(`svg`,{"aria-hidden":`true`,viewBox:`0 0 14 16`},He.createElement(`path`,{fillRule:`evenodd`,d:`M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z`})))}function pe({delay:e,isRunning:t,closeToast:n,type:r=`default`,hide:i,className:a,controlledProgress:o,progress:s,rtl:c,isIn:l,theme:u}){let d=i||o&&s===0,f={animationDuration:`${e}ms`,animationPlayState:t?`running`:`paused`};o&&(f.transform=`scaleX(${s})`);let p=P(`Toastify__progress-bar`,o?`Toastify__progress-bar--controlled`:`Toastify__progress-bar--animated`,`Toastify__progress-bar-theme--${u}`,`Toastify__progress-bar--${r}`,{"Toastify__progress-bar--rtl":c}),m=R(a)?a({rtl:c,type:r,defaultClassName:p}):P(p,a),h={[o&&s>=1?`onTransitionEnd`:`onAnimationEnd`]:o&&s<1?null:()=>{l&&n()}};return Ue.createElement(`div`,{className:`Toastify__progress-bar--wrp`,"data-hidden":d},Ue.createElement(`div`,{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${u} Toastify__progress-bar--${r}`}),Ue.createElement(`div`,{role:`progressbar`,"aria-hidden":d?`true`:`false`,"aria-label":`notification timer`,"aria-valuenow":o?Math.round(s*100):void 0,"aria-valuemin":0,"aria-valuemax":100,className:m,style:f,...h}))}function me(e,t,n){let r=1,i=0,a=[],o=[],s=t,c=new Map,l=new Set,u=e=>(l.add(e),()=>l.delete(e)),d=()=>{o=Array.from(c.values()),l.forEach(e=>e())},f=({containerId:t,toastId:n,updateId:r})=>{let i=t?t!==e:e!==1,a=c.has(n)&&r==null;return i||a},p=(e,t)=>{c.forEach(n=>{var r;(t==null||t===n.props.toastId)&&((r=n.toggle)==null||r.call(n,e))})},m=e=>{var t,r;e.isActive&&((r=(t=e.props)?.onClose)==null||r.call(t,e.removalReason),e.isActive=!1,n(ue(e,`removed`)))},h=e=>{if(e==null)c.forEach(m);else{let t=c.get(e);t&&m(t)}d()},g=()=>{i-=a.length,a=[]},_=e=>{var t,r;let{toastId:i,updateId:a}=e.props,o=a==null;e.staleId&&c.delete(e.staleId),e.isActive=!0,c.set(i,e),d(),n(ue(e,o?`added`:`updated`)),o&&((r=(t=e.props).onOpen)==null||r.call(t))};return{id:e,props:s,observe:u,toggle:p,removeToast:h,toasts:c,clearQueue:g,buildToast:(e,t)=>{if(f(t))return;let{toastId:n,updateId:o,data:l,staleId:u,delay:p}=t,m=o==null;m&&i++;let g={...s,style:s.toastStyle,key:r++,...Object.fromEntries(Object.entries(t).filter(([e,t])=>t!=null)),toastId:n,updateId:o,data:l,isIn:!1,className:Qe(t.className||s.toastClassName),progressClassName:Qe(t.progressClassName||s.progressClassName),autoClose:!t.isLoading&&$e(t.autoClose,s.autoClose),closeToast(e){let t=c.get(n);t&&(t.removalReason=e,h(n))},deleteToast(){if(c.get(n)!=null){if(c.delete(n),i--,i<0&&(i=0),a.length>0){_(a.shift());return}d()}}};g.closeButton=s.closeButton,t.closeButton===!1||et(t.closeButton)?g.closeButton=t.closeButton:t.closeButton===!0&&(g.closeButton=!et(s.closeButton)||s.closeButton);let v={content:e,props:g,staleId:u};s.limit&&s.limit>0&&i>s.limit&&m?a.push(v):Xe(p)?setTimeout(()=>{_(v)},p):_(v)},setProps(e){s=e},setToggle:(e,t)=>{let n=c.get(e);n&&(n.toggle=t)},isToastActive:e=>c.get(e)?.isActive,getSnapshot:()=>o}}function he(){rt.forEach(e=>ve(e.content,e.options)),rt=[]}function ge(e,t){var n;if(t)return!!((n=z.get(t))!=null&&n.isToastActive(e));let r=!1;return z.forEach(t=>{t.isToastActive(e)&&(r=!0)}),r}function _e(e){if(!ot()){rt=rt.filter(t=>e!=null&&t.options.toastId!==e);return}if(e==null||Ze(e))z.forEach(t=>{t.removeToast(e)});else if(e&&(`containerId`in e||`id`in e)){let t=z.get(e.containerId);t?t.removeToast(e.id):z.forEach(t=>{t.removeToast(e.id)})}}function ve(e,t){et(e)&&(ot()||rt.push({content:e,options:t}),z.forEach(n=>{n.buildToast(e,t)}))}function ye(e){var t;(t=z.get(e.containerId||1))==null||t.setToggle(e.id,e.fn)}function be(e,t){z.forEach(n=>{(t==null||!(t!=null&&t.containerId)||t?.containerId===n.id)&&n.toggle(e,t?.id)})}function xe(e){let t=e.containerId||1;return{subscribe(n){let r=me(t,e,at);z.set(t,r);let i=r.observe(n);return he(),()=>{i(),z.delete(t)}},setProps(e){var n;(n=z.get(t))==null||n.setProps(e)},getSnapshot(){return z.get(t)?.getSnapshot()}}}function Se(e){return it.add(e),()=>{it.delete(e)}}function Ce(e){return e&&(L(e.toastId)||Xe(e.toastId))?e.toastId:nt()}function we(e,t){return ve(e,t),t.toastId}function Te(e,t){return{...t,type:t&&t.type||e,toastId:Ce(t)}}function Ee(e){return(t,n)=>we(t,Te(e,n))}function F(e,t){return we(e,Te(`default`,t))}function De(e,{pending:t,error:n,success:r},i){let a;t&&(a=L(t)?F.loading(t,i):F.loading(t.render,{...i,...t}));let o={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},s=(e,t,n)=>{if(t==null){F.dismiss(a);return}let r={type:e,...o,...i,data:n},s=L(t)?{render:t}:t;return a?F.update(a,{...r,...s}):F(s.render,{...r,...s}),n},c=R(e)?e():e;return c.then(e=>s(`success`,r,e)).catch(e=>s(`error`,n,e)),c}function Oe(e){_e(e)}function ke(e){let{subscribe:t,getSnapshot:n,setProps:r}=(0,Ge.useRef)(xe(e)).current;r(e);let i=(0,Ge.useSyncExternalStore)(t,n,n)?.slice();function a(t){if(!i)return[];let n=new Map;return e.newestOnTop&&i.reverse(),i.forEach(e=>{let{position:t}=e.props;n.has(t)||n.set(t,[]),n.get(t).push(e)}),Array.from(n,e=>t(e[0],e[1]))}return{getToastToRender:a,isToastActive:ge,count:i?.length}}function Ae(e){let[t,n]=(0,Ke.useState)(!1),[r,i]=(0,Ke.useState)(!1),a=(0,Ke.useRef)(null),o=(0,Ke.useRef)({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:s,pauseOnHover:c,closeToast:l,onClick:u,closeOnClick:d}=e;ye({id:e.toastId,containerId:e.containerId,fn:n}),(0,Ke.useEffect)(()=>{if(e.pauseOnFocusLoss)return f(),()=>{p()}},[e.pauseOnFocusLoss]);function f(){document.hasFocus()||_(),window.addEventListener(`focus`,g),window.addEventListener(`blur`,_)}function p(){window.removeEventListener(`focus`,g),window.removeEventListener(`blur`,_)}function m(t){if(e.draggable===!0||e.draggable===t.pointerType){v();let n=a.current;o.canCloseOnClick=!0,o.canDrag=!0,n.style.transition=`none`,e.draggableDirection===`x`?(o.start=t.clientX,o.removalDistance=n.offsetWidth*(e.draggablePercent/100)):(o.start=t.clientY,o.removalDistance=n.offsetHeight*(e.draggablePercent===80?e.draggablePercent*1.5:e.draggablePercent)/100)}}function h(t){let{top:n,bottom:r,left:i,right:o}=a.current.getBoundingClientRect();t.pointerType===`mouse`&&e.pauseOnHover&&t.clientX>=i&&t.clientX<=o&&t.clientY>=n&&t.clientY<=r?_():g()}function g(){n(!0)}function _(){n(!1)}function v(){o.didMove=!1,document.addEventListener(`pointermove`,b),document.addEventListener(`pointerup`,x)}function y(){document.removeEventListener(`pointermove`,b),document.removeEventListener(`pointerup`,x)}function b(n){let r=a.current;if(o.canDrag&&r){o.didMove=!0,t&&_(),e.draggableDirection===`x`?o.delta=n.clientX-o.start:o.delta=n.clientY-o.start,o.start!==n.clientX&&(o.canCloseOnClick=!1);let i=e.draggableDirection===`x`?`${o.delta}px, var(--y)`:`0, calc(${o.delta}px + var(--y))`;r.style.transform=`translate3d(${i},0)`,r.style.opacity=`${1-Math.abs(o.delta/o.removalDistance)}`}}function x(){y();let t=a.current;if(o.canDrag&&o.didMove&&t){if(o.canDrag=!1,Math.abs(o.delta)>o.removalDistance){i(!0),e.closeToast(!0),e.collapseAll();return}t.style.transition=`transform 0.2s, opacity 0.2s`,t.style.removeProperty(`transform`),t.style.removeProperty(`opacity`)}}let S={onPointerDown:m,onPointerUp:h};return s&&c&&(S.onMouseEnter=_,e.stacked||(S.onMouseLeave=g)),d&&(S.onClick=e=>{u&&u(e),o.canCloseOnClick&&l(!0)}),{playToast:g,pauseToast:_,isRunning:t,preventExitTransition:r,toastRef:a,eventHandlers:S}}function je(e){return I.createElement(ut,{...e},I.createElement(`path`,{d:`M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z`}))}function Me(e){return I.createElement(ut,{...e},I.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z`}))}function Ne(e){return I.createElement(ut,{...e},I.createElement(`path`,{d:`M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z`}))}function Pe(e){return I.createElement(ut,{...e},I.createElement(`path`,{d:`M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z`}))}function Fe(){return I.createElement(`div`,{className:`Toastify__spinner`})}function Ie({theme:e,type:t,isLoading:n,icon:r}){let i=null,a={theme:e,type:t};return r===!1||(R(r)?i=r({...a,isLoading:n}):(0,I.isValidElement)(r)?i=(0,I.cloneElement)(r,a):n?i=dt.spinner():ft(t)&&(i=dt[t](a))),i}function Le(e){let t={..._t,...e},n=e.stacked,[r,i]=(0,We.useState)(!0),a=(0,We.useRef)(null),{getToastToRender:o,isToastActive:s,count:c}=ke(t),{className:l,style:u,rtl:d,containerId:f,hotKeys:p}=t;function m(e){let t=P(`Toastify__toast-container`,`Toastify__toast-container--${e}`,{"Toastify__toast-container--rtl":d});return R(l)?l({position:e,rtl:d,defaultClassName:t}):P(t,Qe(l))}function h(){n&&(i(!0),F.play())}return lt(()=>{if(n){let e=a.current.querySelectorAll(`[data-in="true"]`),n=t.position?.includes(`top`),i=0,o=0;Array.from(e).reverse().forEach((e,t)=>{let a=e;a.classList.add(`Toastify__toast--stacked`),t>0&&(a.dataset.collapsed=`${r}`),a.dataset.pos||(a.dataset.pos=n?`top`:`bot`);let s=i*(r?.2:1)+(r?0:12*t),c=Math.max(.5,1-(r?o:0));a.style.setProperty(`--y`,`${n?s:s*-1}px`),a.style.setProperty(`--g`,`12`),a.style.setProperty(`--s`,`${c}`),i+=a.offsetHeight,o+=.025})}},[r,c,n]),(0,We.useEffect)(()=>{function e(e){var t;let n=a.current;p(e)&&((t=n?.querySelector(`[tabIndex="0"]`))==null||t.focus(),i(!1),F.pause()),e.key===`Escape`&&(document.activeElement===n||n!=null&&n.contains(document.activeElement))&&(i(!0),F.play())}return document.addEventListener(`keydown`,e),()=>{document.removeEventListener(`keydown`,e)}},[p]),We.createElement(`section`,{ref:a,className:`Toastify`,id:f,onMouseEnter:()=>{n&&(i(!1),F.pause())},onMouseLeave:h,"aria-live":`polite`,"aria-atomic":`false`,"aria-relevant":`additions text`,"aria-label":t[`aria-label`]},o((e,t)=>{let r=t.length?{...u}:{...u,pointerEvents:`none`};return We.createElement(`div`,{tabIndex:-1,className:m(e),"data-stacked":n,style:r,key:`c-${e}`},t.map(({content:e,props:t})=>We.createElement(pt,{...t,stacked:n,collapseAll:h,isIn:s(t.toastId,t.containerId),key:`t-${t.key}`},e)))}))}function Re(e){return bt(vt,e.nonce),Ye.createElement(Le,{...e})}var ze,Be,Ve,He,Ue,We,Ge,Ke,qe,Je,I,Ye,Xe,L,R,Ze,Qe,$e,et,tt,nt,z,rt,it,at,ot,st,ct,lt,ut,dt,ft,pt,mt,ht,gt,_t,vt,yt,bt,xt=t((()=>{ze=e(O(),1),Be=e(O(),1),Ve=e(O(),1),He=e(O(),1),Ue=e(O(),1),ie(),We=e(O(),1),Ge=e(O(),1),Ke=e(O(),1),qe=e(O(),1),Je=e(O(),1),I=e(O(),1),Ye=e(O(),1),Xe=e=>typeof e==`number`&&!isNaN(e),L=e=>typeof e==`string`,R=e=>typeof e==`function`,Ze=e=>L(e)||Xe(e),Qe=e=>L(e)||R(e)?e:null,$e=(e,t)=>e===!1||Xe(e)&&e>0?e:t,et=e=>(0,ze.isValidElement)(e)||L(e)||R(e)||Xe(e),tt=1,nt=()=>`${tt++}`,z=new Map,rt=[],it=new Set,at=e=>it.forEach(t=>t(e)),ot=()=>z.size>0,st=(e,{containerId:t})=>z.get(t||1)?.toasts.get(e),ct=(e={})=>{z.forEach(t=>{t.props.limit&&(!e.containerId||t.id===e.containerId)&&t.clearQueue()})},F.loading=(e,t)=>we(e,Te(`default`,{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...t})),F.promise=De,F.success=Ee(`success`),F.info=Ee(`info`),F.error=Ee(`error`),F.warning=Ee(`warning`),F.warn=F.warning,F.dark=(e,t)=>we(e,Te(`default`,{theme:`dark`,...t})),F.dismiss=Oe,F.clearWaitingQueue=ct,F.isActive=ge,F.update=(e,t={})=>{let n=st(e,t);if(n){let{props:r,content:i}=n,a={delay:100,...r,...t,toastId:t.toastId||e,updateId:nt()};a.toastId!==e&&(a.staleId=e);let o=a.render||i;delete a.render,we(o,a)}},F.done=e=>{F.update(e,{progress:1})},F.onChange=Se,F.play=e=>be(!0,e),F.pause=e=>be(!1,e),lt=typeof window<`u`?qe.useLayoutEffect:qe.useEffect,ut=({theme:e,type:t,isLoading:n,...r})=>I.createElement(`svg`,{viewBox:`0 0 24 24`,width:`100%`,height:`100%`,fill:e===`colored`?`currentColor`:`var(--toastify-icon-color-${t})`,...r}),dt={info:Me,warning:je,success:Ne,error:Pe,spinner:Fe},ft=e=>e in dt,pt=e=>{let{isRunning:t,preventExitTransition:n,toastRef:r,eventHandlers:i,playToast:a}=Ae(e),{closeButton:o,children:s,autoClose:c,onClick:l,type:u,hideProgressBar:d,closeToast:f,transition:p,position:m,className:h,style:g,progressClassName:_,updateId:v,role:y,progress:b,rtl:x,toastId:S,deleteToast:C,isIn:w,isLoading:T,closeOnClick:E,theme:D,ariaLabel:ee}=e,O=P(`Toastify__toast`,`Toastify__toast-theme--${D}`,`Toastify__toast--${u}`,{"Toastify__toast--rtl":x},{"Toastify__toast--close-on-click":E}),te=R(h)?h({rtl:x,position:m,type:u,defaultClassName:O}):P(O,h),k=Ie(e),A=!!b||!c,j={closeToast:f,type:u,theme:D},M=null;return o===!1||(M=R(o)?o(j):(0,Je.isValidElement)(o)?(0,Je.cloneElement)(o,j):fe(j)),Je.createElement(p,{isIn:w,done:C,position:m,preventExitTransition:n,nodeRef:r,playToast:a},Je.createElement(`div`,{id:S,tabIndex:0,onClick:l,"data-in":w,className:te,...i,style:g,ref:r,...w&&{role:y,"aria-label":ee}},k!=null&&Je.createElement(`div`,{className:P(`Toastify__toast-icon`,{"Toastify--animate-icon Toastify__zoom-enter":!T})},k),de(s,e,!t),M,!e.customProgressBar&&Je.createElement(pe,{...v&&!A?{key:`p-${v}`}:{},rtl:x,theme:D,delay:c,isRunning:t,isIn:w,closeToast:f,hide:d,type:u,className:_,controlledProgress:A,progress:b||0})))},mt=(e,t=!1)=>({enter:`Toastify--animate Toastify__${e}-enter`,exit:`Toastify--animate Toastify__${e}-exit`,appendPosition:t}),ht=le(mt(`bounce`,!0)),gt=le(mt(`slide`,!0)),le(mt(`zoom`)),le(mt(`flip`)),_t={position:`top-right`,transition:ht,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:`touch`,draggablePercent:80,draggableDirection:`x`,role:`alert`,theme:`light`,"aria-label":`Notifications Alt+T`,hotKeys:e=>e.altKey&&e.code===`KeyT`},vt=`:root {
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
`,yt=new Map,bt=(e,t)=>{lt(()=>{if(!e||typeof document>`u`)return;let n=document,r=yt.get(n);if(r){t&&r.setAttribute(`nonce`,t);return}let i=n.createElement(`style`);i.textContent=e,t&&i.setAttribute(`nonce`,t),n.head.appendChild(i),yt.set(n,i)},[t])}}));function St(e){return Mt.add(e),()=>{Mt.delete(e)}}function Ct(){return kt}function wt(){return jt}function Tt(e){e>0&&kt===0&&(At+=1),kt+=e,jt={pending:kt,cycle:At},Mt.forEach(e=>e())}async function B(e,t={},n={}){n.background||Tt(1);try{let n=await fetch(`${Ot}${e}`,{...t,credentials:`same-origin`,headers:{...t.body instanceof FormData?{}:{"Content-Type":`application/json`},...t.headers}}),r=await n.json().catch(e=>{if(e instanceof SyntaxError)return null;throw e});if(!n.ok||!r?.success)throw r?.code===`BACKUP_READ_ONLY`&&window.dispatchEvent(new CustomEvent(`mistakes:backup-status`,{detail:{readOnly:!0}})),new Nt(r?.message||`请求失败，请稍后重试。`,n.status,r?.code);return t.method&&t.method!==`GET`&&window.dispatchEvent(new Event(`mistakes:updated`)),r.data}finally{n.background||Tt(-1)}}function Et(e,t=!1){let n=new Date(e);return Number.isNaN(n.getTime())?`—`:new Intl.DateTimeFormat(`zh-CN`,t?{month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`}:{year:`numeric`,month:`2-digit`,day:`2-digit`}).format(n)}function Dt(e){window.location.hash=e}var Ot,kt,At,jt,Mt,Nt,V,Pt=t((()=>{Ot=`/api/mistakes`,kt=0,At=0,jt={pending:0,cycle:0},Mt=new Set,Nt=class extends Error{status;code;constructor(e,t,n){super(e),this.status=t,this.code=n}},V=(e,t=`POST`)=>({method:t,body:JSON.stringify(e)})}));function Ft(){let[e,t]=(0,U.useState)(()=>window.matchMedia(`(prefers-reduced-motion: reduce)`).matches);return(0,U.useEffect)(()=>{let e=window.matchMedia(`(prefers-reduced-motion: reduce)`),n=()=>t(e.matches);return e.addEventListener(`change`,n),()=>e.removeEventListener(`change`,n)},[]),e}function It(){let e=(0,U.useSyncExternalStore)(St,wt),t=e.pending>0,n=Ft(),r=(0,U.useRef)(null),i=(0,U.useRef)(`idle`),a=(0,U.useRef)(0),o=(0,U.useRef)(0),s=(0,U.useRef)(0),c=(0,U.useRef)(new Set),l=(0,U.useRef)(new Set),[u,d]=(0,U.useState)({visible:!1,progress:0,completing:!1});return(0,U.useEffect)(()=>()=>{c.current.forEach(e=>window.clearTimeout(e)),l.current.forEach(e=>window.cancelAnimationFrame(e)),c.current.clear(),l.current.clear()},[]),(0,U.useEffect)(()=>{function u(){c.current.forEach(e=>window.clearTimeout(e)),l.current.forEach(e=>window.cancelAnimationFrame(e)),c.current.clear(),l.current.clear()}function f(e,t){let n=window.setTimeout(()=>{c.current.delete(n),e()},t);c.current.add(n)}function p(e){let t=window.requestAnimationFrame(()=>{l.current.delete(t),e()});l.current.add(t)}function m(){if(i.current!==`loading`||!Ct())return;let e=.92-o.current;e>.003&&(o.current+=e*.18,d({visible:!0,progress:o.current,completing:!1}),f(m,450+o.current*750))}function h(){Ct()||(i.current=`completing`,o.current=1,d({visible:!0,progress:1,completing:!0}),f(()=>{i.current=`fading`,d(e=>({...e,visible:!1})),f(()=>{i.current=`idle`,o.current=0,d({visible:!1,progress:0,completing:!1})},n?40:180)},n?100:440))}let g=e.cycle!==s.current;if(s.current=e.cycle,t||g){u(),a.current=performance.now();let e=i.current;if(i.current=`loading`,e===`idle`)o.current=0,d({visible:!0,progress:0,completing:!1}),p(()=>p(()=>{o.current=.3,d({visible:!0,progress:.3,completing:!1}),f(m,n?100:360)}));else{let e=r.current?getComputedStyle(r.current).transform:`none`,t=e===`none`?o.current:new DOMMatrixReadOnly(e).a;o.current=Math.min(.99,Math.max(.3,t)),d({visible:!0,progress:o.current,completing:!1}),f(m,450)}}!t&&i.current===`loading`&&f(()=>{u(),h()},Math.max(0,(n?60:260)-(performance.now()-a.current)))},[t,e.cycle,n]),(0,W.jsx)(`div`,{className:`loading-progress${u.visible?` is-visible`:``}${u.completing?` is-completing`:``}`,"aria-hidden":`true`,style:{opacity:+!!u.visible,transition:`opacity ${n?40:180}ms ${Jt}`},children:(0,W.jsx)(`span`,{ref:r,className:`loading-progress-fill`,style:{transform:`scaleX(${u.progress})`,transition:`transform ${n?60:u.completing?320:u.progress<=.3?200:700}ms ${Jt}`}})})}function Lt({tabs:e,value:t,onChange:n,ariaLabel:r,className:i=``}){let a=(0,U.useRef)(null),o=(0,U.useRef)(!1),[s,c]=(0,U.useState)({x:0,width:0}),[l,u]=(0,U.useState)(!1),d=e.map(e=>e.id).join(`\0`);(0,U.useLayoutEffect)(()=>{let e=a.current;if(!e)return;let n=!1,r=0;function i(){if(n||!e)return;let i=Array.from(e.querySelectorAll(`[role="tab"]`)).find(e=>e.dataset.tabId===t);if(!i)return;let a=i.getBoundingClientRect(),s=e.getBoundingClientRect(),l={x:a.left-s.left+e.scrollLeft-e.clientLeft,width:a.width};c(e=>Math.abs(e.x-l.x)<.1&&Math.abs(e.width-l.width)<.1?e:l),!o.current&&!r&&(r=window.requestAnimationFrame(()=>{o.current=!0,u(!0)}))}i();let s=new ResizeObserver(i);return s.observe(e),e.querySelectorAll(`[role="tab"]`).forEach(e=>s.observe(e)),window.addEventListener(`resize`,i),document.fonts.ready.then(i),()=>{n=!0,s.disconnect(),window.removeEventListener(`resize`,i),window.cancelAnimationFrame(r)}},[t,d]);function f(t,r){let i=r;if(t.key===`ArrowRight`)i=(r+1)%e.length;else if(t.key===`ArrowLeft`)i=(r-1+e.length)%e.length;else if(t.key===`Home`)i=0;else if(t.key===`End`)i=e.length-1;else return;t.preventDefault(),n(e[i].id),a.current?.querySelectorAll(`[role="tab"]`)[i]?.focus()}return(0,W.jsxs)(`div`,{ref:a,className:`sliding-tabs ${i}`.trim(),role:`tablist`,"aria-label":r,children:[e.map((e,r)=>(0,W.jsx)(`button`,{id:e.panelId?`${e.panelId}-tab`:void 0,type:`button`,role:`tab`,"data-tab-id":e.id,"aria-controls":e.panelId,"aria-selected":t===e.id,tabIndex:t===e.id?0:-1,className:`sliding-tab${t===e.id?` is-active`:``}`,onClick:()=>n(e.id),onKeyDown:e=>f(e,r),children:e.label},e.id)),(0,W.jsx)(`span`,{className:`tab-indicator`,"aria-hidden":`true`,style:{width:s.width,transform:`translateX(${s.x}px)`,opacity:+!!l,...l?{}:{transition:`none`}}})]})}function Rt({items:e,value:t,ariaLabel:n=`主导航`}){let r=(0,U.useRef)(null),i=(0,U.useRef)(!1),[a,o]=(0,U.useState)(!1),[s,c]=(0,U.useState)({x:0,y:0,width:0,height:0,visible:!1}),l=e.map(e=>e.id).join(`\0`);return(0,U.useLayoutEffect)(()=>{let e=r.current;if(!e)return;let n=!1,a=0;function s(){if(n||!e)return;let r=Array.from(e.querySelectorAll(`.nav-item`)).find(e=>e.dataset.navId===t);if(!r){c(e=>e.visible?{...e,visible:!1}:e);return}let s=getComputedStyle(e),l=s.getPropertyValue(`--nav-indicator-axis`).trim(),u=l?l===`horizontal`:s.display===`grid`||s.flexDirection===`row`,d=parseFloat(s.getPropertyValue(`--nav-indicator-inset`))||(u?10:12),f=parseFloat(s.getPropertyValue(`--nav-indicator-thickness`))||3,p=r.getBoundingClientRect(),m=e.getBoundingClientRect(),h=p.left-m.left+e.scrollLeft-e.clientLeft,g=p.top-m.top+e.scrollTop-e.clientTop,_=u?{x:h+d,y:g+p.height-f,width:Math.max(0,p.width-d*2),height:f,visible:!0}:{x:h,y:g+d,width:f,height:Math.max(0,p.height-d*2),visible:!0};c(e=>e.visible===_.visible&&Math.abs(e.x-_.x)<.1&&Math.abs(e.y-_.y)<.1&&Math.abs(e.width-_.width)<.1&&Math.abs(e.height-_.height)<.1?e:_),!i.current&&!a&&(a=window.requestAnimationFrame(()=>{i.current=!0,o(!0)}))}s();let l=new ResizeObserver(s);return l.observe(e),e.querySelectorAll(`.nav-item`).forEach(e=>l.observe(e)),window.addEventListener(`resize`,s),document.fonts.ready.then(s),()=>{n=!0,l.disconnect(),window.removeEventListener(`resize`,s),window.cancelAnimationFrame(a)}},[t,l]),(0,W.jsxs)(`nav`,{ref:r,className:`navigation`,"aria-label":n,children:[e.map(e=>(0,W.jsx)(`a`,{href:e.href,"data-nav-id":e.id,className:`nav-item${t===e.id?` active`:``}`,"aria-current":t===e.id?`page`:void 0,children:e.label},e.id)),(0,W.jsx)(`span`,{className:`nav-indicator`,"aria-hidden":`true`,style:{transform:`translate(${s.x}px, ${s.y}px)`,width:s.width,height:s.height,opacity:a&&s.visible?1:0,...a?{}:{transition:`none`}}})]})}function H({size:e=`long`}){return(0,W.jsx)(`span`,{className:`skeleton-line skeleton-shimmer ${e}`})}function zt(){return(0,W.jsxs)(`div`,{className:`skeleton-heading`,children:[(0,W.jsxs)(`div`,{className:`skeleton-heading-copy`,children:[(0,W.jsx)(H,{size:`title`}),(0,W.jsx)(H,{size:`medium`})]}),(0,W.jsx)(`span`,{className:`skeleton-block skeleton-shimmer`})]})}function Bt(){return(0,W.jsx)(`div`,{className:`skeleton-summary-grid`,children:Array.from({length:4},(e,t)=>(0,W.jsxs)(`div`,{className:`skeleton-summary`,children:[(0,W.jsx)(H,{size:`medium`}),(0,W.jsx)(H,{size:`title`}),(0,W.jsx)(H,{size:`long`})]},t))})}function Vt({review:e=!1}){return(0,W.jsxs)(`div`,{className:`skeleton-list`,children:[!e&&(0,W.jsxs)(`div`,{className:`skeleton-toolbar`,children:[(0,W.jsx)(H,{size:`medium`}),(0,W.jsx)(H,{size:`short`})]}),Array.from({length:3},(e,t)=>(0,W.jsxs)(`div`,{className:`skeleton-row`,children:[(0,W.jsx)(`span`,{className:`skeleton-row-index skeleton-shimmer`}),(0,W.jsxs)(`div`,{className:`skeleton-row-copy`,children:[(0,W.jsx)(H,{}),(0,W.jsx)(H,{size:`medium`})]}),(0,W.jsx)(H,{size:`short`}),(0,W.jsx)(H,{size:`short`})]},t))]})}function Ht({chart:e=!1,editor:t=!1}){return(0,W.jsxs)(`div`,{className:`skeleton-panel${e?` skeleton-chart`:``}`,children:[(0,W.jsx)(H,{size:`medium`}),(0,W.jsx)(H,{size:`short`}),e?(0,W.jsx)(`div`,{className:`skeleton-bars`,children:[74,92,55,38].map((e,t)=>(0,W.jsx)(`span`,{className:`skeleton-line skeleton-shimmer`,style:{width:`${e}%`}},t))}):t?(0,W.jsx)(W.Fragment,{children:[0,1,2].map(e=>(0,W.jsxs)(`div`,{className:`skeleton-field`,children:[(0,W.jsx)(H,{size:`short`}),(0,W.jsx)(`span`,{className:`skeleton-block skeleton-shimmer`})]},e))}):(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)(H,{}),(0,W.jsx)(H,{}),(0,W.jsx)(H,{size:`medium`})]})]})}function Ut(){return(0,W.jsxs)(`div`,{className:`skeleton-field`,children:[(0,W.jsx)(H,{size:`short`}),(0,W.jsx)(`span`,{className:`skeleton-block skeleton-shimmer`})]})}function Wt(){return(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)(`div`,{className:`skeleton-workbench-tabs`,children:[0,1,2,3].map(e=>(0,W.jsx)(H,{size:`short`},e))}),(0,W.jsxs)(`div`,{className:`skeleton-workbench-layout`,children:[(0,W.jsxs)(`div`,{className:`skeleton-workbench-main`,children:[(0,W.jsxs)(`div`,{className:`skeleton-panel`,children:[(0,W.jsx)(H,{size:`medium`}),(0,W.jsx)(Ut,{})]}),(0,W.jsxs)(`div`,{className:`skeleton-panel skeleton-workbench-answers`,children:[(0,W.jsx)(H,{size:`medium`}),(0,W.jsx)(Ut,{}),(0,W.jsx)(Ut,{})]}),(0,W.jsxs)(`div`,{className:`skeleton-panel skeleton-workbench-note`,children:[(0,W.jsx)(H,{size:`medium`}),(0,W.jsx)(Ut,{})]})]}),(0,W.jsxs)(`div`,{className:`skeleton-panel skeleton-workbench-classification`,children:[(0,W.jsx)(H,{size:`medium`}),(0,W.jsx)(Ut,{}),(0,W.jsx)(Ut,{})]})]})]})}function Gt(){return(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)(`div`,{className:`skeleton-reading-header`,children:(0,W.jsx)(zt,{})}),(0,W.jsxs)(`div`,{className:`skeleton-reading-meta`,children:[(0,W.jsx)(H,{size:`short`}),(0,W.jsx)(H,{size:`short`}),(0,W.jsx)(H,{size:`short`})]}),(0,W.jsx)(`div`,{className:`skeleton-panel skeleton-reading-document`,children:[0,1,2].map(e=>(0,W.jsxs)(`section`,{children:[(0,W.jsx)(H,{size:`short`}),(0,W.jsx)(H,{}),(0,W.jsx)(H,{}),(0,W.jsx)(H,{size:`medium`})]},e))}),(0,W.jsxs)(`div`,{className:`skeleton-panel skeleton-reading-history`,children:[(0,W.jsx)(H,{size:`medium`}),(0,W.jsx)(H,{}),(0,W.jsx)(H,{size:`short`})]})]})}function Kt({kind:e=`library`}){let t;switch(e){case`summary`:t=(0,W.jsx)(Bt,{});break;case`rows`:t=(0,W.jsx)(Vt,{});break;case`review`:t=(0,W.jsx)(Vt,{review:!0});break;case`settings`:t=(0,W.jsxs)(W.Fragment,{children:[(0,W.jsxs)(`div`,{className:`skeleton-toolbar`,children:[(0,W.jsx)(H,{size:`medium`}),(0,W.jsx)(H,{size:`short`})]}),(0,W.jsx)(Vt,{})]});break;case`stats`:t=(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)(Bt,{}),(0,W.jsxs)(`div`,{className:`skeleton-columns`,children:[(0,W.jsx)(Ht,{chart:!0}),(0,W.jsx)(Ht,{chart:!0})]}),(0,W.jsx)(Ht,{chart:!0})]});break;case`editor`:t=(0,W.jsx)(Wt,{});break;case`detail`:t=(0,W.jsx)(Gt,{});break;case`shell`:t=(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)(zt,{}),(0,W.jsx)(Bt,{}),(0,W.jsx)(Vt,{})]});break;default:t=(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)(zt,{}),(0,W.jsx)(Bt,{}),(0,W.jsxs)(`div`,{className:`skeleton-toolbar`,children:[(0,W.jsx)(H,{size:`medium`}),(0,W.jsx)(H,{size:`short`})]}),(0,W.jsx)(Vt,{})]})}return(0,W.jsx)(`div`,{className:`skeleton-screen skeleton-${e}`,"aria-hidden":`true`,children:t})}function qt({loading:e,kind:t=`library`,className:n=``,children:r}){let i=Ft(),[a,o]=(0,U.useState)(e);return(0,U.useEffect)(()=>{if(e){o(!0);return}let t=window.setTimeout(()=>o(!1),i?40:Yt);return()=>window.clearTimeout(t)},[e,i]),(0,W.jsxs)(`div`,{className:`loading-content loading-kind-${t} ${e?`is-loading`:`is-ready`} ${n}`.trim(),"aria-busy":e,children:[(0,W.jsx)(`div`,{className:`loading-content-body`,inert:e,"aria-hidden":e||void 0,children:r}),(a||e)&&(0,W.jsxs)(`div`,{className:`loading-content-placeholder`,"aria-hidden":!e||void 0,children:[(0,W.jsx)(`span`,{className:`visually-hidden`,role:`status`,children:`正在加载…`}),(0,W.jsx)(Kt,{kind:t})]})]})}var U,W,Jt,Yt,Xt=t((()=>{U=e(O()),Pt(),W=M(),Jt=`cubic-bezier(0.22, 0.61, 0.36, 1)`,Yt=260}));function Zt({className:e=``}){return(0,Qt.jsx)(`img`,{className:`logo-mark ${e}`,src:`/mistakes/logo.svg`,alt:``,width:`48`,height:`48`})}var Qt,$t=t((()=>{Qt=M()})),en,tn,nn,rn,G,an=t((()=>{en=`modulepreload`,tn=function(e){return`/mistakes/`+e},nn={},rn=function(e){return e.pathname.endsWith(`.css`)},G=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=tn(t,n);let r=s(t);if(r.href in nn)return;nn[r.href]=!0;let i=rn(r);if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let o=document.createElement(`link`);if(o.rel=i?`stylesheet`:en,i||(o.as=`script`),o.crossOrigin=``,o.href=r.href,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),i)return new Promise((e,t)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${r}`)))})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})}}));function on(){return un||=G(async()=>{let{FriendlyCaptchaSDK:e}=await import(`./sdk-LxJ6YTVI.js`);return{FriendlyCaptchaSDK:e}},__vite__mapDeps([0,1])).then(({FriendlyCaptchaSDK:e})=>new e).catch(e=>{throw un=null,e}),un}function sn({sitekey:e,resetKey:t,onChange:n}){let r=(0,cn.useRef)(null),[i,a]=(0,cn.useState)(!0);return(0,cn.useEffect)(()=>{let t=r.current;if(!t)return;let i=document.createElement(`div`);t.append(i);let o=!0,s;a(!0),n({status:`pending`,response:``});let c=e=>{if(!o)return;let{state:t,response:r}=e.detail;n(t===`completed`?{status:`complete`,response:r}:t===`error`?{status:`error`,response:r||`.ERROR`}:t===`expired`?{status:`expired`,response:``}:{status:`pending`,response:``})};return i.addEventListener(`frc:widget.statechange`,c),on().then(t=>{o&&(s=t.createWidget({element:i,sitekey:e,apiEndpoint:`global`,startMode:`focus`,theme:`light`}),a(!1),i.closest(`form`)?.contains(document.activeElement)&&s.start())}).catch(()=>{o&&(a(!1),n({status:`error`,response:`.ERROR`}))}),()=>{o=!1,i.removeEventListener(`frc:widget.statechange`,c),s?.destroy(),i.remove()}},[e,t,n]),(0,ln.jsxs)(`div`,{className:`auth-captcha-control`,children:[i&&(0,ln.jsxs)(`div`,{className:`auth-captcha-loading`,role:`status`,children:[(0,ln.jsx)(j,{className:`spin`,size:16}),` 正在加载人机验证…`]}),(0,ln.jsx)(`div`,{className:`auth-captcha-widget`,ref:r})]})}var cn,ln,un,dn=t((()=>{cn=e(O()),k(),ln=M(),an(),un=null})),fn=t((()=>{}));function pn({open:e,onClose:t,title:n,description:r,children:i,wide:l=!1,suspended:d=!1,className:h=``,backdropClassName:g=``,scrollBody:_=!1}){let[v,y]=(0,mn.useState)(null);return(0,K.jsx)(u,{open:e,modal:!d,disablePointerDismissal:d,onOpenChange:(e,n)=>{d?n.cancel():e||t()},children:(0,K.jsxs)(p,{children:[(0,K.jsx)(a,{className:`photo-dialog-backdrop ${g}`.trim()}),(0,K.jsxs)(o,{ref:y,className:`photo-dialog${l?` photo-dialog-wide`:``} ${h}`.trim(),children:[(0,K.jsxs)(`div`,{className:`photo-dialog-heading`,children:[(0,K.jsx)(s,{children:n}),(0,K.jsx)(m,{className:`icon-button`,"aria-label":`关闭`,children:(0,K.jsx)(E,{size:20})})]}),r&&(0,K.jsx)(c,{className:`photo-dialog-description`,children:r}),(0,K.jsx)(hn.Provider,{value:v,children:_?(0,K.jsx)(f,{className:`photo-dialog-body`,children:i}):i})]})]})})}var mn,K,hn,gn,_n=t((()=>{d(),k(),mn=e(O()),l(),fn(),K=M(),hn=(0,mn.createContext)(null),gn=()=>(0,mn.useContext)(hn)})),vn,yn,bn,xn=t((()=>{vn=e(O()),yn=M(),bn=class extends vn.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidUpdate(e){this.state.failed&&e.resetKey!==this.props.resetKey&&this.setState({failed:!1})}render(){return this.state.failed?(0,yn.jsxs)(`div`,{className:`inline-alert`,role:`alert`,children:[`页面加载失败，请刷新后重试。`,(0,yn.jsx)(`button`,{type:`button`,onClick:()=>window.location.reload(),children:`刷新页面`})]}):this.props.children}}}));function Sn(e){let t=e.split(`?`)[0].match(/^\/mistakes\/(\d+)(\/edit)?$/);return t?{id:Number(t[1]),editing:!!t[2]}:null}var Cn,wn,Tn,En,Dn=t((()=>{Cn=e(O()),wn=(0,Cn.createContext)(null),Tn=()=>(0,Cn.useContext)(wn),En=`mistakes:open-toast-record`}));function On(e){return{className:`ai-toast-actionable`,closeOnClick:!0,onClick:t=>{if(window.matchMedia(`(max-width: 640px)`).matches&&Sn(e)){t.preventDefault(),window.dispatchEvent(new CustomEvent(En,{cancelable:!0,detail:{path:e}}));return}if(window.matchMedia(`(max-width: 640px)`).matches&&e.startsWith(`/ai-tasks`)){t.preventDefault(),window.dispatchEvent(new CustomEvent(`mistakes:open-ai-tasks`,{detail:{path:e}}));return}window.location.hash===`#${e}`?window.dispatchEvent(new HashChangeEvent(`hashchange`)):Dt(e)}}}var kn=t((()=>{Pt(),Dn()})),An=t((()=>{}));function jn(){let e=(0,q.useContext)(Bn);if(!e)throw Error(`AI tasks context missing`);return e}function Mn(){let{jobs:e,openTasks:t}=jn(),n=e.filter(Ln).length,r=e.filter(e=>Rn(e)||!e.mistakeDeleted&&e.status===`failed`).length,i=n||r;return(0,J.jsxs)(`button`,{type:`button`,className:`button ghost ai-tasks-trigger`,onClick:t,"aria-label":`AI 任务${i?`，${i} 项${n?`处理中`:`待处理`}`:``}`,children:[(0,J.jsx)(b,{size:17}),` AI 任务`,i>0&&(0,J.jsx)(`span`,{className:`count-pill`,children:i})]})}function Nn({children:e}){let{user:t}=i(),[n,r]=(0,q.useState)([]),[a,o]=(0,q.useState)(null),[s,c]=(0,q.useState)(!1),l=oe(),u=(0,q.useRef)(null),[d,f]=(0,q.useState)(window.location.hash.split(`?`)[0]===`#/ai-tasks`),[p,m]=(0,q.useState)(``),[h,g]=(0,q.useState)(!1),[_,v]=(0,q.useState)(!1),[y,b]=(0,q.useState)(null),[x,S]=(0,q.useState)(new Set),C=(0,q.useRef)(new Set),[w,T]=(0,q.useState)(!document.hidden),E=(0,q.useRef)(null),D=(0,q.useRef)(null),ee=(0,q.useRef)(!1),O=(0,q.useRef)(!1),te=(0,q.useRef)(0),k=(0,q.useRef)(!0),A=`ai-activity-${t.id}`,j=(0,q.useCallback)(e=>{te.current+=1,k.current&&r(t=>[...e,...t.filter(t=>!e.some(e=>e.id===t.id))].sort((e,t)=>t.id-e.id))},[]),M=(0,q.useCallback)((e=!1)=>{if(ee.current=!0,O.current||=e,D.current)return D.current;v(!0);let t=(async()=>{do{ee.current=!1;let e=te.current,t=O.current;O.current=!1;let[n,i]=await Promise.allSettled([B(`/ai/jobs`,{},{background:!0}),t?B(`/ai/config`,{},{background:!0}):Promise.resolve(null)]);if(!k.current)break;n.status===`fulfilled`&&(e===te.current?(r(n.value),b(Date.now())):ee.current=!0),i.status===`fulfilled`&&i.value&&o(i.value),m(n.status===`rejected`?n.reason.message:i.status===`rejected`?i.reason.message:``),g(!0)}while(k.current&&ee.current)})().finally(()=>{D.current=null,k.current&&v(!1)});return D.current=t,t},[]),N=(0,q.useCallback)(()=>M(!0),[M]);(0,q.useEffect)(()=>{k.current=!0,N();let e=()=>{M()},t=()=>{N()},n=()=>{T(!document.hidden),document.hidden||N()},r=()=>{c(!1),f(window.location.hash.split(`?`)[0]===`#/ai-tasks`)},i=e=>{let t=e.detail.path.split(`?`)[1]||``,n=Number(new URLSearchParams(t).get(`job`))||null;n&&window.dispatchEvent(new CustomEvent(`mistakes:ai-task-toast-target`,{detail:{jobId:n}})),u.current=null,c(!0)};return window.addEventListener(`mistakes:updated`,e),window.addEventListener(`focus`,t),window.addEventListener(`hashchange`,r),window.addEventListener(`mistakes:open-ai-tasks`,i),document.addEventListener(`visibilitychange`,n),()=>{k.current=!1,window.removeEventListener(`mistakes:updated`,e),window.removeEventListener(`focus`,t),window.removeEventListener(`hashchange`,r),window.removeEventListener(`mistakes:open-ai-tasks`,i),document.removeEventListener(`visibilitychange`,n),F.dismiss(A)}},[M,N,A]);let ne=n.filter(Ln).length;(0,q.useEffect)(()=>{if(!w)return;let e=setInterval(()=>void M(),ne?2e3:15e3);return()=>clearInterval(e)},[ne,w,M]),(0,q.useEffect)(()=>{s&&N()},[s,N]),(0,q.useEffect)(()=>{if(E.current)for(let e of n){let t=E.current.get(e.id);if(t&&t!==e.status&&!e.mistakeDeleted){if(e.status===`succeeded`){let t=e.applyStatus!==`applied`,n=t?`/mistakes/${e.mistakeId}/edit?aiJob=${e.id}`:`/mistakes/${e.mistakeId}`;F.success((0,J.jsxs)(`a`,{className:`ai-toast-link`,href:`#${n}`,children:[(0,J.jsxs)(`span`,{children:[`记录 #`,e.mistakeId,` `,In(e),`完成`,t?`，待校对。`:`，已填入。`]}),(0,J.jsx)(`small`,{children:t?`点击校对并填入`:`点击查看错题`})]}),{autoClose:8e3,...On(n)})}if(e.status===`failed`){let t=`/ai-tasks?job=${e.id}`;F.error((0,J.jsxs)(`a`,{className:`ai-toast-link`,href:`#${t}`,children:[(0,J.jsxs)(`span`,{children:[`记录 #`,e.mistakeId,` `,In(e),`失败。`]}),(0,J.jsx)(`small`,{children:`点击查看原因并重试`})]}),On(t))}}}E.current=new Map(n.map(e=>[e.id,e.status]))},[n]),(0,q.useEffect)(()=>{if(!ne||s||d){F.dismiss(A);return}let e=(0,J.jsxs)(`a`,{className:`ai-toast-link`,href:`#/ai-tasks`,children:[(0,J.jsxs)(`span`,{children:[ne,` 项 AI 操作正在处理`]}),(0,J.jsx)(`small`,{children:`点击查看任务`})]}),t={type:`info`,autoClose:!1,...On(`/ai-tasks`)};F.isActive(A)?F.update(A,{render:e,...t}):F(e,{toastId:A,...t})},[ne,s,d,A]);let re=(0,q.useCallback)(async e=>{try{let t=await B(`/ai/jobs`,V(e));return j([t]),t}catch(e){throw F.error(e.message),e}},[j]),ie=(0,q.useCallback)(async(e,t={})=>{try{let n=await B(`/ai/jobs/${e}/apply`,V(t));return j([n.job]),F.success(`AI 结果已填入。`),n}catch(t){let r=n.find(t=>t.id===e),i=r?`/mistakes/${r.mistakeId}/edit?aiJob=${e}`:`/ai-tasks`;throw F.error((0,J.jsxs)(`a`,{className:`ai-toast-link`,href:`#${i}`,children:[(0,J.jsx)(`span`,{children:t.message}),(0,J.jsx)(`small`,{children:`点击继续校对`})]}),On(i)),N(),t}},[N,j,n]),P=(0,q.useCallback)(async(e,t)=>{let n=[...new Set(e)].filter(e=>!C.current.has(e));if(!n.length)return{jobs:[],errors:[]};n.forEach(e=>C.current.add(e)),S(new Set(C.current));try{let e=await B(`/ai/jobs/batch`,V({ids:n,action:t}));return j(e.jobs),e.jobs.length&&F.success(t===`retry`?`已将 ${e.jobs.length} 项任务重新加入队列。`:`已取消 ${e.jobs.length} 项任务。`),e}finally{n.forEach(e=>C.current.delete(e)),k.current&&(S(new Set(C.current)),M())}},[M,j]);return(0,J.jsxs)(Bn.Provider,{value:{jobs:n,config:a,error:p,loaded:h,refreshing:_,updatedAt:y,busyIds:x,refresh:N,createJob:re,applyJob:ie,actJobs:P,openTasks:()=>{u.current=document.activeElement instanceof HTMLElement?document.activeElement:null,c(!0)},closeTasks:()=>c(!1)},children:[e,l?(0,J.jsx)(se,{open:s,onOpenChange:c,title:`AI 任务`,description:`离开页面后任务会继续处理，结果保留在这里。`,closeLabel:`关闭 AI 任务`,triggerRef:u,className:`ai-tasks-mobile-drawer`,children:e=>(0,J.jsx)(bn,{children:(0,J.jsx)(q.Suspense,{fallback:(0,J.jsx)(qt,{loading:!0,kind:`rows`,children:null}),children:(0,J.jsx)(Pn,{compact:!0,portalContainer:e})})})}):(0,J.jsx)(pn,{open:s,onClose:()=>c(!1),title:`AI 任务`,description:`离开页面后任务会继续处理，结果保留在这里。`,wide:!0,scrollBody:!0,className:`ai-tasks-dialog`,backdropClassName:`ai-tasks-dialog-backdrop`,children:(0,J.jsx)(bn,{children:(0,J.jsx)(q.Suspense,{fallback:(0,J.jsx)(qt,{loading:!0,kind:`rows`,children:null}),children:(0,J.jsx)(Pn,{compact:!0})})})})]})}var q,J,Pn,Fn,In,Ln,Rn,zn,Bn,Vn=t((()=>{q=e(O()),k(),xt(),Pt(),v(),_n(),ae(),xn(),Xt(),kn(),An(),J=M(),an(),Pn=(0,q.lazy)(()=>G(()=>import(`./AiTaskManager-DH_ohNyF.js`).then(e=>({default:e.AiTaskManager})),__vite__mapDeps([2,1,3,4,5,6,7,8,9,10]))),Fn={question:`题干识别`,answer:`答案识别`,analysis:`生成解析`},In=e=>e.mode===`page-entry`?`按页录题`:Fn[e.type],Ln=e=>[`queued`,`running`,`retrying`].includes(e.status),Rn=e=>!e.mistakeDeleted&&e.status===`succeeded`&&e.applyStatus!==`applied`,zn=e=>Ln(e)||e.status===`failed`||e.status===`succeeded`&&e.applyStatus!==`applied`,Bn=(0,q.createContext)(null)})),Hn,Un,Wn,Gn,Kn,qn,Jn=t((()=>{Pt(),Hn=class extends Error{constructor(){super(`请求超时，请重试。`)}},Un=[1e3,2e3,4e3],Wn=e=>({...e,auxiliaryKnowledgePointIds:[...e.auxiliaryKnowledgePointIds]}),Gn=e=>e instanceof Error?e.message:`请求失败，请重试。`,Kn=e=>e instanceof Nt?e.status===408||e.status===429||e.status>=500&&e.status<600:e instanceof TypeError||e instanceof Hn,qn=class{batches=new Map;listeners=new Set;snapshot=[];subscribe=e=>(this.listeners.add(e),()=>{this.listeners.delete(e)});getSnapshot=()=>this.snapshot;enqueue({mistakeId:e,purpose:t,input:n,files:r,recognize:i,recognitionPrompt:a}){let o=crypto.randomUUID(),s={view:{id:o,mistakeId:e,purpose:t,total:r.length,imageIds:[],status:`uploading`,message:`图片已压缩，正在后台上传…`,reuseRequested:!1},files:[...r],input:Wn(n),recognize:i,recognitionPrompt:a?.trim()||void 0,recognitionSubmitted:!1,recognitionClientId:crypto.randomUUID(),reuseClientId:crypto.randomUUID(),running:!1,controller:new AbortController};return this.batches.set(o,s),this.publish(),this.run(s),o}reuse(e,t,n){let r=this.batches.get(e);return!r||r.view.purpose!==`question`||r.view.reuseRequested?!1:(r.reuseInput=Wn(t),r.reuseRecognitionPrompt=n?.trim()||void 0,this.update(r,{reuseRequested:!0,reuseStatus:`waiting`}),r.view.imageIds.length===r.view.total&&this.run(r),!0)}retry(e){let t=this.batches.get(e);t&&!t.running&&t.view.status===`failed`&&(t.recognitionError=void 0,t.reuseError=void 0,t.view.reuseStatus===`failed`&&this.update(t,{reuseStatus:`waiting`}),this.run(t))}dispose(){for(let e of this.batches.values())e.controller.abort(),e.files=[];this.batches.clear(),this.snapshot.length&&this.publish()}publish(){this.snapshot=Array.from(this.batches.values(),e=>e.view).reverse(),this.listeners.forEach(e=>e())}update(e,t){e.controller.signal.aborted||(e.view={...e.view,...t},this.publish())}async run(e){if(!(e.running||e.controller.signal.aborted)){e.running=!0;try{try{for(;e.view.imageIds.length<e.view.total;){let t=e.view.imageIds.length,n=e.files[t],r=await this.request(e,`uploading`,`正在后台上传第 ${t+1}/${e.view.total} 张图片…`,9e4,t=>{let r=new FormData;return r.append(`original`,n.original,n.originalName.replace(/\.[^.]+$/,``)+`.jpg`),r.append(`crop`,n.crop,`crop.jpg`),r.append(`purpose`,e.view.purpose),r.append(`clientId`,n.clientId),B(`/mistakes/${e.view.mistakeId}/images`,{method:`POST`,body:r,signal:t},{background:!0})});this.update(e,{imageIds:[...e.view.imageIds,r.id]})}e.files=[]}catch(t){e.controller.signal.aborted||this.update(e,{status:`failed`,message:`图片上传失败：${Gn(t)}`});return}if(e.recognize&&!e.recognitionSubmitted&&!e.recognitionError)try{await this.submitRecognition(e,e.view.purpose,e.input,e.recognitionClientId,e.recognitionPrompt),e.recognitionSubmitted=!0}catch(t){if(e.controller.signal.aborted)return;e.recognitionError=Gn(t)}if(e.reuseInput&&e.view.reuseStatus===`waiting`){this.update(e,{reuseStatus:`submitting`});try{await this.submitRecognition(e,`answer`,e.reuseInput,e.reuseClientId,e.reuseRecognitionPrompt),this.update(e,{reuseStatus:`submitted`})}catch(t){if(e.controller.signal.aborted)return;e.reuseError=Gn(t),this.update(e,{reuseStatus:`failed`})}}let t=[e.recognitionError&&`识别任务提交失败：${e.recognitionError}`,e.reuseError&&`答案复用提交失败：${e.reuseError}`].filter(Boolean);this.update(e,{status:t.length?`failed`:`completed`,message:t.length?t.join(`；`):e.view.reuseStatus===`submitted`?`图片已上传，答案复用已交给后台识别。`:e.recognize?`图片已上传，已交给后台识别。`:`${e.view.total} 张图片已上传。`})}finally{e.running=!1,!e.controller.signal.aborted&&e.view.imageIds.length===e.view.total&&e.view.reuseStatus===`waiting`&&this.run(e)}}}submitRecognition(e,t,n,r,i){return this.request(e,`processing`,`正在后台提交${t===`question`?`题目`:`答案`}识别…`,3e4,a=>B(`/ai/jobs`,{...V({clientId:r,mistakeId:e.view.mistakeId,type:t,imageIds:e.view.imageIds,input:n,recognitionPrompt:i}),signal:a},{background:!0}))}async request(e,t,n,r,i){for(let a=0;;a+=1){e.controller.signal.throwIfAborted(),this.update(e,{status:t,message:n});try{return await this.withTimeout(e,r,i)}catch(t){if(e.controller.signal.aborted||!Kn(t)||a>=Un.length)throw t;let n=Un[a];this.update(e,{status:`retrying`,message:`网络请求失败，${n/1e3} 秒后自动重试（${a+1}/${Un.length}）…`}),await this.wait(e,n)}}}async withTimeout(e,t,n){e.controller.signal.throwIfAborted();let r=new AbortController,i=()=>r.abort();e.controller.signal.addEventListener(`abort`,i,{once:!0});let a=!1,o=setTimeout(()=>{a=!0,r.abort()},t);try{return await n(r.signal)}catch(e){throw a?new Hn:e}finally{clearTimeout(o),e.controller.signal.removeEventListener(`abort`,i)}}wait(e,t){return new Promise((n,r)=>{let i=e.controller.signal,a=()=>{clearTimeout(o),r(i.reason)},o=setTimeout(()=>{i.removeEventListener(`abort`,a),n()},t);i.addEventListener(`abort`,a,{once:!0}),i.aborted&&a()})}}}));function Yn(){let e=(0,Y.useContext)(Qn);if(!e)throw Error(`Photo uploads context missing`);return e}function Xn({children:e}){let[t]=(0,Y.useState)(()=>new qn),n=(0,Y.useRef)(new Map),r=(0,Y.useSyncExternalStore)(t.subscribe,t.getSnapshot);return(0,Y.useEffect)(()=>()=>{t.getSnapshot().forEach(e=>F.dismiss(`photo-upload-${e.id}`)),t.dispose()},[t]),(0,Y.useEffect)(()=>{for(let e of r){if(n.current.get(e.id)===e)continue;n.current.set(e.id,e);let r=`photo-upload-${e.id}`,i=e.status===`completed`||e.status===`failed`,a=`/mistakes/${e.mistakeId}/edit?photo=${e.purpose}`,o=(0,Zn.jsxs)(`div`,{className:`ai-toast-copy`,children:[(0,Zn.jsxs)(`a`,{className:`ai-toast-link`,href:`#${a}`,children:[(0,Zn.jsxs)(`span`,{children:[`记录 #`,e.mistakeId,` · `,e.message]}),(0,Zn.jsx)(`small`,{children:`点击打开题目处理`})]}),e.status===`failed`&&(0,Zn.jsx)(`button`,{type:`button`,onClick:n=>{n.stopPropagation(),t.retry(e.id)},children:`重试`})]}),s={type:e.status===`failed`?`error`:e.status===`completed`?`success`:`info`,isLoading:!i,autoClose:e.status===`completed`&&4500,closeButton:i,...On(a)};F.isActive(r)?F.update(r,{render:o,...s}):F(o,{toastId:r,...s})}},[r,t]),(0,Zn.jsx)(Qn.Provider,{value:{queue:t,batches:r},children:e})}var Y,Zn,Qn,$n=t((()=>{Y=e(O()),xt(),Jn(),kn(),Zn=M(),Qn=(0,Y.createContext)(null)})),er=t((()=>{}));function tr({path:e,editorId:t,skeletonKind:n,children:r}){let[i]=(0,X.useState)(()=>document.createElement(`div`)),a=(0,X.useRef)(null),[o,s]=(0,X.useState)(null),[c,l]=(0,X.useState)(null),[u,d]=(0,X.useState)(null),[f,p]=(0,X.useState)(!1),m=(0,X.useRef)(null),h=(0,X.useRef)(0),g=(0,X.useRef)({hash:``,x:0,y:0}),_=(0,X.useRef)(new Set),v=(0,X.useRef)({target:u,editorId:t,open:f});v.current={target:u,editorId:t,open:f};let y=!!(u?.editing&&t===u.id),b=(0,X.useCallback)(e=>{let{target:t,editorId:n}=v.current;return!t?.editing||t.id===n||!!e?.editing&&e.id===t.id||!m.current||m.current()},[]),x=(0,X.useCallback)(()=>{b(null)&&p(!1)},[b]),S=(0,X.useCallback)(e=>{let t=Sn(e);if(!t){Dt(e);return}b(t)&&(v.current.target||(g.current={hash:window.location.hash,x:window.scrollX,y:window.scrollY}),d({...t,path:e,requestId:++h.current}),p(!0))},[b]),C=(0,X.useCallback)(e=>(m.current=e,()=>{m.current===e&&(m.current=null)}),[]),w=(0,X.useCallback)(e=>{if(!(e||v.current.open)){d(null);for(let e of _.current)window.dispatchEvent(new CustomEvent(`mistakes:record-view-updated`,{detail:{id:e}}));_.current.clear(),window.location.hash===g.current.hash&&requestAnimationFrame(()=>window.scrollTo(g.current.x,g.current.y))}},[]);(0,X.useEffect)(()=>{let e=e=>{let t=e.detail.path;e.preventDefault(),S(t)},t=()=>{v.current.target&&window.location.hash!==g.current.hash&&p(!1)},n=()=>{v.current.target&&_.current.add(v.current.target.id)};return window.addEventListener(En,e),window.addEventListener(`hashchange`,t),window.addEventListener(`mistakes:updated`,n),()=>{window.removeEventListener(En,e),window.removeEventListener(`hashchange`,t),window.removeEventListener(`mistakes:updated`,n)}},[S]),(0,X.useLayoutEffect)(()=>{let e=y?o:a.current;e&&i.parentElement!==e&&(y&&a.current&&(a.current.style.minHeight=`${a.current.getBoundingClientRect().height}px`),e.appendChild(i),!y&&a.current&&(a.current.style.minHeight=``))},[i,y,o]);let T=e=>{if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;let t=e.target.closest(`a[href^="#/"]`);if(!t||t.target===`_blank`||t.hasAttribute(`download`))return;let n=t.getAttribute(`href`).slice(1);Sn(n)&&(e.preventDefault(),S(n))},E=u?{path:u.path,requestId:u.requestId,navigate:S,registerLeaveCheck:C,actionsContainer:c,retainsEditor:y,saved:()=>{v.current.target?.id===u.id&&x()},updated:e=>{_.current.delete(e),window.dispatchEvent(new CustomEvent(`mistakes:record-view-updated`,{detail:{id:e}}))}}:null,D=u?.editing?`editor`:`detail`;return(0,Z.jsxs)(Z.Fragment,{children:[(0,Z.jsx)(`div`,{ref:a,className:`record-page-slot`}),(0,nr.createPortal)((0,Z.jsx)(wn.Provider,{value:y?E:null,children:(0,Z.jsx)(bn,{resetKey:e.split(`?`)[0],children:(0,Z.jsx)(X.Suspense,{fallback:(0,Z.jsx)(qt,{loading:!0,kind:n,children:null}),children:r})})}),i),u&&(0,Z.jsx)(se,{open:f,onOpenChange:e=>e?p(!0):x(),onOpenChangeComplete:w,title:u.editing?`编辑错题`:`错题详情`,closeLabel:`关闭题目`,className:`record-view-drawer`,footer:(0,Z.jsx)(`div`,{ref:l,className:`record-view-actions`,onClickCapture:T}),children:()=>(0,Z.jsx)(`div`,{ref:s,className:`record-view-slot`,onClickCapture:T,children:!y&&(0,Z.jsx)(wn.Provider,{value:E,children:(0,Z.jsx)(bn,{resetKey:u.path,children:(0,Z.jsx)(X.Suspense,{fallback:(0,Z.jsx)(qt,{loading:!0,kind:D,children:null}),children:u.editing?(0,Z.jsx)(ir,{id:u.id},`editor-${u.id}`):(0,Z.jsx)(rr,{id:u.id},`detail-${u.id}`)})})})})})]})}var X,nr,Z,rr,ir,ar=t((()=>{X=e(O()),nr=e(g()),Pt(),ae(),Xt(),xn(),Dn(),er(),Z=M(),an(),rr=(0,X.lazy)(()=>G(()=>import(`./DetailPage-DyFukvFq.js`).then(e=>({default:e.DetailPage})),__vite__mapDeps([11,1,3,4,12,13,14,6,8,15,5,7,16,17]))),ir=(0,X.lazy)(()=>G(()=>import(`./EditorPage-7XBJxpCf.js`).then(e=>({default:e.EditorPage})),__vite__mapDeps([18,1,3,4,5,6,7,16,19,17,20])))}));function or({onLogin:e,onNotify:t}){let[n,r]=(0,Q.useState)(!1),[i,a]=(0,Q.useState)(``),[o,s]=(0,Q.useState)(``),[c,l]=(0,Q.useState)(``),[u,d]=(0,Q.useState)(!1),[f,p]=(0,Q.useState)(``),[m,h]=(0,Q.useState)(null),[g,_]=(0,Q.useState)(``),[v,y]=(0,Q.useState)(0),[b,x]=(0,Q.useState)({status:`pending`,response:``}),[S,C]=(0,Q.useState)(0),T=(0,Q.useRef)(!1);(0,Q.useEffect)(()=>{let e=!0;return h(null),_(``),B(`/auth/config`).then(t=>{e&&h(t)}).catch(t=>{e&&_(t.message)}),()=>{e=!1}},[v]);let E=m!==null&&(!m.enabled||b.status===`complete`||!n&&b.status===`error`);function O(){x({status:`pending`,response:``}),C(e=>e+1)}async function te(r){if(r.preventDefault(),!T.current&&E){T.current=!0,d(!0),p(``);try{let r=await B(n?`/auth/register`:`/auth/login`,V({username:i.trim(),password:o,captchaResponse:m?.enabled?b.response:``,...n?{inviteCode:c.trim()}:{}}));t(n?`欢迎，${r.user.username}！账号已创建。`:`欢迎回来，${r.user.username}！`),e(r.user)}catch(e){p(e.message),F.error(e.message),O()}finally{T.current=!1,d(!1)}}}return(0,$.jsxs)(`div`,{className:`auth-page`,children:[(0,$.jsxs)(`aside`,{className:`auth-story`,children:[(0,$.jsxs)(`a`,{className:`brand`,href:`/`,"aria-label":`返回首页`,children:[(0,$.jsx)(Zt,{}),(0,$.jsxs)(`span`,{className:`brand-text`,children:[`拾题`,(0,$.jsx)(`span`,{children:`把错题，学明白。`})]})]}),(0,$.jsxs)(`div`,{className:`auth-story-body`,children:[(0,$.jsxs)(`span`,{className:`small-pill`,children:[(0,$.jsx)(w,{size:16}),` 你的个人错题本`]}),(0,$.jsxs)(`h1`,{children:[`做错的题，`,(0,$.jsx)(`br`,{}),`值得再想一遍。`]}),(0,$.jsxs)(`p`,{children:[`记录卡住你的那一步，梳理知识点。`,(0,$.jsx)(`br`,{}),`再练一次，让「不熟」慢慢变成「掌握」。`]}),(0,$.jsxs)(`div`,{className:`auth-note`,children:[(0,$.jsxs)(`div`,{className:`auth-note-top`,children:[(0,$.jsxs)(`span`,{children:[(0,$.jsx)(w,{size:18}),` 我的学习笔记`]}),(0,$.jsx)(`span`,{className:`note-dots`,children:`•••`})]}),(0,$.jsx)(`div`,{className:`note-rule long`}),(0,$.jsx)(`div`,{className:`note-rule`}),(0,$.jsxs)(`div`,{className:`auth-note-bottom`,children:[(0,$.jsxs)(`span`,{children:[(0,$.jsx)(N,{size:17}),` 记录 · 整理 · 复习`]}),(0,$.jsx)(`span`,{className:`note-check`,children:(0,$.jsx)(N,{size:25})})]})]})]}),(0,$.jsx)(`div`,{className:`auth-story-footer`,children:`记录问题 · 理清思路 · 回顾练习`})]}),(0,$.jsx)(`main`,{className:`auth-form-area`,children:(0,$.jsxs)(`div`,{className:`auth-form-wrap`,children:[(0,$.jsx)(`div`,{className:`auth-icon`,children:(0,$.jsx)(ee,{size:30})}),(0,$.jsx)(`h2`,{children:n?`开始积累，遇见进步`:`欢迎回来`}),(0,$.jsx)(`p`,{className:`auth-subtitle`,children:n?`使用邀请码创建账号，开启你的错题本。`:`登录后，继续整理你的学习收获。`}),(0,$.jsxs)(`form`,{onSubmit:te,children:[(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`用户名`}),(0,$.jsx)(`input`,{required:!0,autoComplete:`username`,minLength:3,maxLength:32,placeholder:`输入用户名`,value:i,onChange:e=>a(e.target.value)})]}),(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`密码`}),(0,$.jsx)(`input`,{required:!0,type:`password`,autoComplete:n?`new-password`:`current-password`,minLength:n?8:void 0,maxLength:128,placeholder:n?`至少 8 位密码`:`输入密码`,value:o,onChange:e=>s(e.target.value)})]}),n&&(0,$.jsxs)(`label`,{className:`field`,children:[(0,$.jsx)(`span`,{children:`邀请码`}),(0,$.jsx)(`input`,{required:!0,placeholder:`输入管理员提供的邀请码`,value:c,onChange:e=>l(e.target.value)}),(0,$.jsx)(`small`,{children:`邀请码由管理员生成。`})]}),!m&&(g?(0,$.jsxs)(`div`,{className:`auth-captcha-notice is-error`,role:`alert`,children:[(0,$.jsxs)(`span`,{children:[`安全配置加载失败：`,g]}),(0,$.jsx)(`button`,{type:`button`,onClick:()=>y(e=>e+1),children:`重新加载`})]}):(0,$.jsxs)(`div`,{className:`auth-captcha-loading`,role:`status`,children:[(0,$.jsx)(j,{className:`spin`,size:16}),` 正在加载安全验证…`]})),m?.enabled&&(0,$.jsxs)(`div`,{className:`auth-captcha`,children:[(0,$.jsx)(sn,{sitekey:m.sitekey,resetKey:S,onChange:x},`${n}-${S}`),(b.status===`error`||b.status===`expired`)&&(0,$.jsxs)(`div`,{className:`auth-captcha-notice`,role:`status`,children:[(0,$.jsx)(`span`,{children:b.status===`expired`?`验证已过期，请重新验证。`:n?`人机验证暂不可用，请重试后再注册。`:`人机验证暂不可用，你可以重试或尝试登录。`}),(0,$.jsx)(`button`,{type:`button`,disabled:u,onClick:O,children:`重新验证`})]})]}),f&&(0,$.jsx)(`div`,{className:`form-error`,role:`alert`,children:f}),(0,$.jsx)(`button`,{className:`button primary auth-submit`,disabled:u||!E,children:u?(0,$.jsx)(j,{className:`spin`,size:18}):(0,$.jsxs)($.Fragment,{children:[n?`创建账号`:`登录`,(0,$.jsx)(ne,{size:18})]})})]}),(0,$.jsxs)(`div`,{className:`auth-switch`,children:[n?`已有账号？`:`还没有账号？`,(0,$.jsx)(`button`,{disabled:u,onClick:()=>{T.current||(r(!n),p(``),O())},children:n?`立即登录`:`使用邀请码注册`})]}),(0,$.jsxs)(`div`,{className:`auth-secure`,children:[(0,$.jsx)(D,{size:15}),` 你的错题与笔记，仅对你可见`]})]})})]})}function sr(){let[e,t]=(0,Q.useState)(null),[n,r]=(0,Q.useState)(!0),[i,a]=(0,Q.useState)([]),[o,s]=(0,Q.useState)([]),[c,l]=(0,Q.useState)(``),[u,d]=(0,Q.useState)(!1),[f,p]=(0,Q.useState)(window.location.hash.slice(1)||`/mistakes`),[m,g]=(0,Q.useState)({session:0,recordId:null}),v=(0,Q.useRef)(null);(0,Q.useEffect)(()=>{let e=!0,n=(window.location.hash.slice(1)||`/mistakes`).split(`?`)[0];B(`/auth/me`).then(r=>{e&&(r.user&&[`/mistakes`,`/`].includes(n)&&(v.current=`欢迎回来，${r.user.username}！`),t(r.user))}).catch(()=>{e&&t(null)}).finally(()=>{e&&r(!1)});let i=e=>{let t=window.location.hash.slice(1)||`/mistakes`;if(!window.dispatchEvent(new CustomEvent(`mistakes:before-navigate`,{cancelable:!0,detail:{path:t}}))){window.history.replaceState(null,``,new URL(e.oldURL).hash||`#/mistakes`);return}let n=t.split(`?`)[0];g(e=>n===`/new`?{session:e.session+1,recordId:null}:e.recordId&&n!==`/mistakes/${e.recordId}/edit`?{...e,recordId:null}:e),p(t),window.scrollTo(0,0)};return window.addEventListener(`hashchange`,i),()=>{e=!1,window.removeEventListener(`hashchange`,i)}},[]);let y=(0,Q.useCallback)((e,t=`success`)=>{F[t](e)},[]);(0,Q.useEffect)(()=>{if(e&&v.current){let e=v.current;v.current=null,y(e)}},[e,y]);let b=(0,Q.useCallback)(async()=>{try{let[e,t]=await Promise.all([B(`/subjects`),B(`/knowledge-points`)]);a(e),s(_(t,e)),l(``)}catch(e){l(e.message)}},[]);(0,Q.useEffect)(()=>{e&&b()},[e,b]),(0,Q.useEffect)(()=>{if(!e){d(!1);return}let t=!0,n=!1,r=0,i=async()=>{if(n||document.hidden)return;n=!0;let e=r;try{let n=await B(`/system/status`,{},{background:!0});t&&r===e&&d(n.readOnly)}catch{}finally{n=!1}},a=e=>{let t=e.detail;typeof t?.readOnly==`boolean`&&(r+=1,d(t.readOnly))},o=()=>{i()};window.addEventListener(`mistakes:backup-status`,a),window.addEventListener(`focus`,o),document.addEventListener(`visibilitychange`,o);let s=window.setInterval(()=>{i()},15e3);return i(),()=>{t=!1,window.clearInterval(s),window.removeEventListener(`mistakes:backup-status`,a),window.removeEventListener(`focus`,o),document.removeEventListener(`visibilitychange`,o)}},[e?.id]);let C=(0,Q.useCallback)(async()=>{if(window.dispatchEvent(new Event(`mistakes:before-logout`,{cancelable:!0}))){window.dispatchEvent(new Event(`mistakes:session-ending`));try{await B(`/auth/logout`,V({})),y(`已退出登录。`),t(null),a([]),s([]),window.location.hash=`/mistakes`}catch(e){window.dispatchEvent(new Event(`mistakes:session-resumed`)),y(e.message,`error`)}}},[y]),w=f.split(`?`)[0],E=w.match(/^\/mistakes\/(\d+)(\/edit)?$/),D=E?E[2]?`editor`:`detail`:gr[w]||`library`,ee=E?`/mistakes`:w===`/page-imports`?`/new`:w,O=w===`/new`?m.recordId:E?.[2]?Number(E[1]):null,k;k=w===`/new`?(0,$.jsx)(lr,{onCreated:e=>g(t=>({...t,recordId:e}))},`new-${m.session}`):w===`/page-imports`?(0,$.jsx)(mr,{}):E?.[2]?(0,$.jsx)(lr,{id:Number(E[1])},m.recordId===Number(E[1])?`new-${m.session}`:w):E?(0,$.jsx)(ur,{id:Number(E[1])},f):w===`/review`?(0,$.jsx)(dr,{},f):w===`/stats`?(0,$.jsx)(fr,{}):w===`/ai-tasks`?(0,$.jsx)(hr,{}):w===`/settings`?(0,$.jsx)(pr,{}):(0,$.jsx)(cr,{});let A=e?(0,$.jsx)(h.Provider,{value:{user:e,updateUser:t,subjects:i,knowledgePoints:o,refreshDirectory:b,notify:y,logout:C},children:(0,$.jsx)(Nn,{children:(0,$.jsx)(Xn,{children:(0,$.jsxs)(`div`,{className:`app-shell`,children:[(0,$.jsxs)(`aside`,{className:`sidebar`,children:[(0,$.jsxs)(`a`,{className:`brand`,href:`#/mistakes`,children:[(0,$.jsx)(Zt,{}),(0,$.jsxs)(`span`,{className:`brand-text`,children:[`拾题`,(0,$.jsx)(`span`,{children:`把错题，学明白。`})]})]}),(0,$.jsx)(`div`,{className:`sidebar-label`,children:`学习空间`}),(0,$.jsx)(Rt,{value:ee,ariaLabel:`主导航`,items:_r.map(({path:e,label:t,icon:n})=>({id:e,href:`#${e}`,label:(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(n,{size:19,strokeWidth:1.8}),(0,$.jsx)(`span`,{children:t})]})}))}),(0,$.jsxs)(`div`,{className:`sidebar-bottom`,children:[(0,$.jsxs)(`div`,{className:`sidebar-reminder`,children:[(0,$.jsx)(`span`,{className:`reminder-icon`,children:(0,$.jsx)(x,{size:22})}),(0,$.jsx)(`strong`,{children:`温故而知新，可以为师矣`}),(0,$.jsx)(`a`,{href:`#/review`,children:`打开复习页`})]}),(0,$.jsxs)(`div`,{className:`account`,children:[(0,$.jsxs)(`a`,{className:`account-profile`,href:`#/settings`,children:[(0,$.jsx)(`span`,{className:`avatar`,children:e.avatar?(0,$.jsx)(`img`,{src:e.avatar,alt:``}):e.username.slice(0,1).toUpperCase()}),(0,$.jsxs)(`span`,{className:`account-name`,children:[(0,$.jsx)(`strong`,{title:e.username,children:e.username}),(0,$.jsx)(`small`,{children:e.role===`admin`?`管理员`:`我的账号`})]})]}),(0,$.jsx)(`button`,{className:`icon-button`,title:`退出登录`,"aria-label":`退出登录`,onClick:C,children:(0,$.jsx)(te,{size:17})})]})]})]}),(0,$.jsxs)(`div`,{className:`main-shell`,children:[(0,$.jsxs)(`header`,{className:`topbar`,children:[(0,$.jsxs)(`span`,{className:`topbar-label`,children:[(0,$.jsx)(T,{size:15}),` 个人学习空间`]}),(0,$.jsxs)(`div`,{className:`topbar-right`,children:[(0,$.jsx)(Mn,{}),(0,$.jsxs)(`a`,{className:`workspace-state`,href:`/`,children:[(0,$.jsx)(ne,{size:16}),` 返回个人主页`]}),(0,$.jsx)(`a`,{className:`topbar-avatar`,href:`#/settings`,"aria-label":`账号设置`,children:e.avatar?(0,$.jsx)(`img`,{src:e.avatar,alt:``}):e.username.slice(0,1).toUpperCase()})]})]}),(0,$.jsxs)(`main`,{className:`main-content`,children:[u&&(0,$.jsxs)(`div`,{className:`backup-readonly-banner`,role:`status`,children:[(0,$.jsx)(S,{size:20}),(0,$.jsxs)(`p`,{children:[(0,$.jsx)(`strong`,{children:`正在备份，暂时只读`}),(0,$.jsx)(`span`,{children:`已输入的内容会保留，请稍后重试保存。`})]})]}),c&&(0,$.jsxs)(`div`,{className:`inline-alert`,role:`alert`,children:[`基础目录加载失败：`,c,(0,$.jsx)(`button`,{onClick:b,children:`重试`})]}),(0,$.jsx)(tr,{path:f,editorId:O,skeletonKind:D,children:k}),(0,$.jsx)(`footer`,{className:`page-footer`,children:(0,$.jsxs)(`span`,{children:[`拾题 · © `,new Date().getFullYear(),` ShaoanC`]})})]})]})]})})},e.id)}):(0,$.jsx)(or,{onLogin:e=>{t(e),p(`/mistakes`),window.location.hash=`/mistakes`},onNotify:e=>{v.current=e}});return(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(It,{}),(0,$.jsx)(qt,{loading:n,kind:`shell`,className:`app-entrance`,children:!n&&A})]})}var Q,$,cr,lr,ur,dr,fr,pr,mr,hr,gr,_r,vr=t((()=>{Q=e(O()),xt(),k(),Pt(),v(),Xt(),$t(),dn(),Vn(),$n(),ar(),$=M(),an(),cr=(0,Q.lazy)(()=>G(()=>import(`./MistakesPage-EDBKnyN_.js`).then(e=>({default:e.MistakesPage})),__vite__mapDeps([21,1,3,4,13,14,12,6,8,15,5,7,16,9,10]))),lr=(0,Q.lazy)(()=>G(()=>import(`./EditorPage-7XBJxpCf.js`).then(e=>({default:e.EditorPage})),__vite__mapDeps([18,1,3,4,5,6,7,16,19,17,20]))),ur=(0,Q.lazy)(()=>G(()=>import(`./DetailPage-DyFukvFq.js`).then(e=>({default:e.DetailPage})),__vite__mapDeps([11,1,3,4,12,13,14,6,8,15,5,7,16,17]))),dr=(0,Q.lazy)(()=>G(()=>import(`./ReviewPage-C0wYE3gj.js`).then(e=>({default:e.ReviewPage})),__vite__mapDeps([22,1,3,4,5,6,7,16,8]))),fr=(0,Q.lazy)(()=>G(()=>import(`./StatsPage-Bp7G1j2D.js`).then(e=>({default:e.StatsPage})),__vite__mapDeps([23,1,3,4,24,6]))),pr=(0,Q.lazy)(()=>G(()=>import(`./SettingsPage-YyA-zxWb.js`).then(e=>({default:e.SettingsPage})),__vite__mapDeps([25,1,3,4,6,26]))),mr=(0,Q.lazy)(()=>G(()=>import(`./PageImports-B-QcK4hs.js`).then(e=>({default:e.PageImportsPage})),__vite__mapDeps([27,1,3,4,19,28]))),hr=(0,Q.lazy)(()=>G(()=>import(`./AiTaskManager-DH_ohNyF.js`).then(e=>({default:e.AiTasksPage})),__vite__mapDeps([2,1,3,4,5,6,7,8,9,10]))),gr={"/new":`editor`,"/page-imports":`editor`,"/review":`review`,"/stats":`stats`,"/ai-tasks":`rows`,"/settings":`settings`},_r=[{path:`/mistakes`,label:`我的错题`,icon:re},{path:`/new`,label:`录入错题`,icon:C},{path:`/review`,label:`复习`,icon:x},{path:`/stats`,label:`学习统计`,icon:A},{path:`/ai-tasks`,label:`AI 任务`,icon:b},{path:`/settings`,label:`设置`,icon:y}]})),yr=t((()=>{})),br=t((()=>{}));n((()=>{var t=e(O()),n=e(r());xt(),vr(),yr(),br();var i=M();n.createRoot(document.getElementById(`root`)).render((0,i.jsxs)(t.StrictMode,{children:[(0,i.jsx)(sr,{}),(0,i.jsx)(Re,{className:`mistakes-toast-container`,position:`top-right`,autoClose:4500,transition:gt,theme:`light`,limit:3,newestOnTop:!0,closeOnClick:!1,draggablePercent:15})]}))}))();export{Pt as C,F as D,xt as E,Et as S,Dt as T,qt as _,zn as a,Nt as b,Rn as c,Tn as d,pn as f,an as g,G as h,In as i,jn as l,gn as m,Yn as n,Vn as o,_n as p,Fn as r,Ln as s,$n as t,Dn as u,Lt as v,V as w,B as x,Xt as y};