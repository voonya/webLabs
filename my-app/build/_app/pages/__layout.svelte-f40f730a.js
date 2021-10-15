import{D as dt,S as at,i as lt,s as nt,e as p,k as A,E as V,t as M,c as h,a as u,d as l,n as L,F as z,g as j,G as pt,b as s,H as N,f as B,I as a,J as ot,K as ht,L as it,j as _t,m as mt,o as gt,M as ct,N as ft,O as ut,x as Z,u as J,v as bt}from"../chunks/vendor-32865f89.js";const wt=()=>{const o=dt("__svelte__");return{page:{subscribe:o.page.subscribe},navigating:{subscribe:o.navigating.subscribe},get preloading(){return console.error("stores.preloading is deprecated; use stores.navigating instead"),{subscribe:o.navigating.subscribe}},session:o.session}},$t={subscribe(o){return wt().page.subscribe(o)}};var Et="/_app/assets/svelte-logo-87df40b8.svg";function qt(o){let t,v,n,i,c,e,f,m,E,k,b,g,w,_,r,d,q,I,C,x,S,F,G,H,D,R,O;return{c(){t=p("header"),v=p("div"),n=p("a"),i=p("img"),e=A(),f=p("nav"),m=V("svg"),E=V("path"),k=A(),b=p("ul"),g=p("li"),w=p("a"),_=M("Home"),r=A(),d=p("li"),q=p("a"),I=M("About"),C=A(),x=p("li"),S=p("a"),F=M("Todos"),G=A(),H=V("svg"),D=V("path"),R=A(),O=p("div"),this.h()},l(y){t=h(y,"HEADER",{class:!0});var $=u(t);v=h($,"DIV",{class:!0});var P=u(v);n=h(P,"A",{href:!0,class:!0});var U=u(n);i=h(U,"IMG",{src:!0,alt:!0,class:!0}),U.forEach(l),P.forEach(l),e=L($),f=h($,"NAV",{class:!0});var K=u(f);m=z(K,"svg",{viewBox:!0,"aria-hidden":!0,class:!0});var Y=u(m);E=z(Y,"path",{d:!0,class:!0}),u(E).forEach(l),Y.forEach(l),k=L(K),b=h(K,"UL",{class:!0});var T=u(b);g=h(T,"LI",{class:!0});var Q=u(g);w=h(Q,"A",{"sveltekit:prefetch":!0,href:!0,class:!0});var W=u(w);_=j(W,"Home"),W.forEach(l),Q.forEach(l),r=L(T),d=h(T,"LI",{class:!0});var X=u(d);q=h(X,"A",{"sveltekit:prefetch":!0,href:!0,class:!0});var tt=u(q);I=j(tt,"About"),tt.forEach(l),X.forEach(l),C=L(T),x=h(T,"LI",{class:!0});var et=u(x);S=h(et,"A",{"sveltekit:prefetch":!0,href:!0,class:!0});var st=u(S);F=j(st,"Todos"),st.forEach(l),et.forEach(l),T.forEach(l),G=L(K),H=z(K,"svg",{viewBox:!0,"aria-hidden":!0,class:!0});var rt=u(H);D=z(rt,"path",{d:!0,class:!0}),u(D).forEach(l),rt.forEach(l),K.forEach(l),R=L($),O=h($,"DIV",{class:!0});var vt=u(O);vt.forEach(l),$.forEach(l),this.h()},h(){pt(i.src,c=Et)||s(i,"src",c),s(i,"alt","SvelteKit"),s(i,"class","svelte-t2wq17"),s(n,"href","https://kit.svelte.dev"),s(n,"class","svelte-t2wq17"),s(v,"class","corner svelte-t2wq17"),s(E,"d","M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z"),s(E,"class","svelte-t2wq17"),s(m,"viewBox","0 0 2 3"),s(m,"aria-hidden","true"),s(m,"class","svelte-t2wq17"),s(w,"sveltekit:prefetch",""),s(w,"href","/"),s(w,"class","svelte-t2wq17"),s(g,"class","svelte-t2wq17"),N(g,"active",o[0].path==="/"),s(q,"sveltekit:prefetch",""),s(q,"href","/about"),s(q,"class","svelte-t2wq17"),s(d,"class","svelte-t2wq17"),N(d,"active",o[0].path==="/about"),s(S,"sveltekit:prefetch",""),s(S,"href","/todos"),s(S,"class","svelte-t2wq17"),s(x,"class","svelte-t2wq17"),N(x,"active",o[0].path==="/todos"),s(b,"class","svelte-t2wq17"),s(D,"d","M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z"),s(D,"class","svelte-t2wq17"),s(H,"viewBox","0 0 2 3"),s(H,"aria-hidden","true"),s(H,"class","svelte-t2wq17"),s(f,"class","svelte-t2wq17"),s(O,"class","corner svelte-t2wq17"),s(t,"class","svelte-t2wq17")},m(y,$){B(y,t,$),a(t,v),a(v,n),a(n,i),a(t,e),a(t,f),a(f,m),a(m,E),a(f,k),a(f,b),a(b,g),a(g,w),a(w,_),a(b,r),a(b,d),a(d,q),a(q,I),a(b,C),a(b,x),a(x,S),a(S,F),a(f,G),a(f,H),a(H,D),a(t,R),a(t,O)},p(y,[$]){$&1&&N(g,"active",y[0].path==="/"),$&1&&N(d,"active",y[0].path==="/about"),$&1&&N(x,"active",y[0].path==="/todos")},i:ot,o:ot,d(y){y&&l(t)}}}function xt(o,t,v){let n;return ht(o,$t,i=>v(0,n=i)),[n]}class kt extends at{constructor(t){super();lt(this,t,xt,qt,nt,{})}}function yt(o){let t,v,n,i,c,e,f,m,E,k,b,g;const w=o[0].default,_=it(w,o,o[1],null);return{c(){t=p("main"),_&&_.c(),v=A(),n=p("footer"),i=p("p"),c=M("visit "),e=p("a"),f=M("kit.svelte.dev"),m=M(" to learn SvelteKit"),E=A(),k=p("style"),b=M(`main {\r
			flex: 1;\r
			display: flex;\r
			flex-direction: column;\r
			padding: 1rem;\r
			width: 100%;\r
			max-width: 1024px;\r
			margin: 0 auto;\r
			box-sizing: border-box;\r
		}\r
\r
		footer {\r
			display: flex;\r
			flex-direction: column;\r
			justify-content: center;\r
			align-items: center;\r
			padding: 40px;\r
		}\r
\r
		footer a {\r
			font-weight: bold;\r
		}\r
\r
		@media (min-width: 480px) {\r
			footer {\r
				padding: 40px 0;\r
			}\r
		}`),this.h()},l(r){t=h(r,"MAIN",{});var d=u(t);_&&_.l(d),d.forEach(l),v=L(r),n=h(r,"FOOTER",{});var q=u(n);i=h(q,"P",{});var I=u(i);c=j(I,"visit "),e=h(I,"A",{href:!0});var C=u(e);f=j(C,"kit.svelte.dev"),C.forEach(l),m=j(I," to learn SvelteKit"),I.forEach(l),q.forEach(l),E=L(r),k=h(r,"STYLE",{});var x=u(k);b=j(x,`main {\r
			flex: 1;\r
			display: flex;\r
			flex-direction: column;\r
			padding: 1rem;\r
			width: 100%;\r
			max-width: 1024px;\r
			margin: 0 auto;\r
			box-sizing: border-box;\r
		}\r
\r
		footer {\r
			display: flex;\r
			flex-direction: column;\r
			justify-content: center;\r
			align-items: center;\r
			padding: 40px;\r
		}\r
\r
		footer a {\r
			font-weight: bold;\r
		}\r
\r
		@media (min-width: 480px) {\r
			footer {\r
				padding: 40px 0;\r
			}\r
		}`),x.forEach(l),this.h()},h(){s(e,"href","https://kit.svelte.dev")},m(r,d){B(r,t,d),_&&_.m(t,null),B(r,v,d),B(r,n,d),a(n,i),a(i,c),a(i,e),a(e,f),a(i,m),B(r,E,d),B(r,k,d),a(k,b),g=!0},p(r,d){_&&_.p&&(!g||d&2)&&ct(_,w,r,r[1],g?ut(w,r[1],d,null):ft(r[1]),null)},i(r){g||(Z(_,r),g=!0)},o(r){J(_,r),g=!1},d(r){r&&l(t),_&&_.d(r),r&&l(v),r&&l(n),r&&l(E),r&&l(k)}}}function At(o){let t,v,n;t=new kt({props:{$$slots:{default:[yt]},$$scope:{ctx:o}}});const i=o[0].default,c=it(i,o,o[1],null);return{c(){_t(t.$$.fragment),v=A(),c&&c.c()},l(e){mt(t.$$.fragment,e),v=L(e),c&&c.l(e)},m(e,f){gt(t,e,f),B(e,v,f),c&&c.m(e,f),n=!0},p(e,[f]){const m={};f&2&&(m.$$scope={dirty:f,ctx:e}),t.$set(m),c&&c.p&&(!n||f&2)&&ct(c,i,e,e[1],n?ut(i,e[1],f,null):ft(e[1]),null)},i(e){n||(Z(t.$$.fragment,e),Z(c,e),n=!0)},o(e){J(t.$$.fragment,e),J(c,e),n=!1},d(e){bt(t,e),e&&l(v),c&&c.d(e)}}}function Lt(o,t,v){let{$$slots:n={},$$scope:i}=t;return o.$$set=c=>{"$$scope"in c&&v(1,i=c.$$scope)},[n,i]}class St extends at{constructor(t){super();lt(this,t,Lt,At,nt,{})}}export{St as default};
