(this.webpackJsonprallytrip=this.webpackJsonprallytrip||[]).push([[5],{167:function(e,t,a){},168:function(e,t,a){},177:function(e,t,a){"use strict";a.r(t);var n=a(7),l=a(0),r=a.n(l),c=a(44),o=a(88),i=a(48),u=a(66),s=a(74),m=a.n(s),d=a(175),p=a(75),f=a(55),b=a.n(f),g=(a(167),function(e){var t=e.product,a=e.uploadedImage,c=e.register,o=Object(l.useState)(),i=Object(n.a)(o,2),u=i[0],s=i[1];return Object(l.useEffect)((function(){var e;a&&a.length&&a[0]instanceof Blob?(e=a[0],new Promise((function(t,a){var n=new FileReader;n.onload=function(){2===n.readyState&&t(n.result)},e instanceof Blob?n.readAsDataURL(e):a("error - the function requires a Blob or File in order to convert to base64")}))).then((function(e){return s(e)})).catch((function(e){return console.log(e)})):t&&t.image?s(t.image):s("")}),[t,a]),r.a.createElement("div",{style:{display:"flex",alignItems:"flex-end"}},r.a.createElement("div",{className:"img-preview-container"},r.a.createElement("div",{className:"img-placeholder"},"\u05d0\u05d9\u05df \u05ea\u05de\u05d5\u05e0\u05d4"),u?r.a.createElement("img",{src:u,alt:"preview",className:"img-preview"}):null),r.a.createElement("div",null,r.a.createElement("input",{type:"file",ref:c,name:"image",id:"file",className:"inputfile",accept:"image/*"}),r.a.createElement("label",{htmlFor:"file",className:"button",style:{display:"inline-block",marginRight:"5px"}}," ",u?"\u05d4\u05d7\u05dc\u05e3 \u05ea\u05de\u05d5\u05e0\u05d4":"\u05d4\u05e2\u05dc\u05d0\u05ea \u05ea\u05de\u05d5\u05e0\u05d4"," ")))});var E=a(15),h=(a(168),function(e){var t=e.setDialogContent,a=e.dialogContent;return a?r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"dialog"},r.a.createElement("div",null,a),r.a.createElement("button",{className:"confirm",onClick:function(){return t((function(e){return!e}))}},"\u05d0\u05d9\u05e9\u05d5\u05e8")),r.a.createElement(E.a,{setWindowOpen:t})):null}),v=a(10),y={toolbar:[[{size:["small",!1,"large","huge"]}],["bold","italic","underline","strike"],[{list:"ordered"},{list:"bullet"},{indent:"-1"},{indent:"+1"}],[{direction:"rtl"},{align:[]}],[{color:[]},{background:[]}],["link","image","video"],["clean"]]},O=["size","bold","italic","underline","strike","list","bullet","indent","link","image","video","direction","color","background","align"],j=(a(87),a(70),v.a.map((function(e){return r.a.createElement("option",{key:e.path,value:e.path.slice(e.path.lastIndexOf("/")+1)},e.name)})));function k(e,t,a){return N.apply(this,arguments)}function N(){return(N=Object(p.a)(m.a.mark((function e(t,a,n){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,l){var r=c.c.ref().child("products/".concat(t,"/").concat(n,".png")).put(a);r.on("state_changed",(function(e){var t=e.bytesTransferred/e.totalBytes*100;console.log("Upload is "+t+"% done")}),(function(e){console.log(e),l()}),(function(){r.snapshot.ref.getDownloadURL().then((function(t){console.log("Uploaded image available at",t),e(t)}))}))})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var w=function(e){var t=e.action,a=Object(o.a)(),s=a.register,f=a.handleSubmit,E=a.errors,N=a.watch,w=a.reset,x=Object(o.a)({defaultValues:{todo:"add"}}),S=x.register,q=x.watch,C=Object(l.useState)(""),I=Object(n.a)(C,2),F=I[0],A=I[1],D=Object(l.useState)([]),U=Object(n.a)(D,2),B=U[0],R=U[1],L=Object(l.useState)({}),P=Object(n.a)(L,2),z=P[0],K=P[1],W=Object(l.useState)([]),T=Object(n.a)(W,2),Y=T[0],J=T[1],M=Object(l.useState)([]),Q=Object(n.a)(M,2),Z=Q[0],G=Q[1],V=Object(l.useState)(),_=Object(n.a)(V,2),H=_[0],X=_[1],$=Object(l.useState)(!1),ee=Object(n.a)($,2),te=ee[0],ae=ee[1],ne=Object(l.useState)(!1),le=Object(n.a)(ne,2),re=le[0],ce=le[1],oe=q("category"),ie=q("subcategory"),ue=q("product-id"),se=N("category"),me=N("image"),de=function(){var e=Object(p.a)(m.a.mark((function e(t){var a,n,l,r,o;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log("Upload proccess begun"),ae(!0),a=t.image,n=Object(d.a)(t,["image"]),l=H,n.subcategory||(n.subcategory="sc"),l||(l=c.b.ref().child("products").push().key),!a[0]){e.next=13;break}return e.next=9,k(l,a[0],"image");case 9:r=e.sent,n.image=r,e.next=14;break;case 13:z[H]&&z[H].image&&(n.image=z[H].image);case 14:(o={})["/products/"+l]=n,o["/quill/"+l]=F,c.b.ref().update(o,(function(e){e?(ae(!1),ce("\u05ea\u05e7\u05dc\u05d4 :"+e)):(ae(!1),ce("\u05d4\u05d4\u05e2\u05dc\u05d0\u05d4 \u05d1\u05d5\u05e6\u05e2\u05d4 \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4"),H||(w({}),A('<p class="ql-align-right ql-direction-rtl"><br></p>')),X())}));case 18:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(l.useEffect)((function(){if(H){var e=z[H],t=e.title,a=void 0===t?"":t,n=e.description,l=void 0===n?"":n,r=e.price,o=void 0===r?0:r,i=e.stock,u=void 0===i?0:i,s=e.category,m=void 0===s?"":s,d=e.subcategory,p=void 0===d?"":d,f=e.priority;w({title:a,description:l,price:o,stock:u,category:m,subcategory:p,priority:void 0===f?0:f}),c.b.ref("quill/".concat(H)).once("value",(function(e){null!=e.val()&&A(e.val())}))}else w({}),A('<p class="ql-align-right ql-direction-rtl"><br></p>')}),[H,z,w]),Object(l.useEffect)((function(){"update product"===t&&0===Object.keys(z).length&&z.constructor===Object&&c.b.ref().child("products").on("value",(function(e){null!=e.val()&&K(Object(u.a)({},e.val()))})),"add product"===t&&X()}),[t,z,w]),Object(l.useEffect)((function(){var e=Object.keys(z).filter((function(e){return!oe||oe===z[e].category&&!ie||ie===z[e].subcategory})).map((function(e){return r.a.createElement("option",{key:e,value:e},z[e].title)}));R(r.a.createElement(r.a.Fragment,null,r.a.createElement("label",null,"\u05e9\u05dd \u05de\u05d5\u05e6\u05e8: "),r.a.createElement("select",{name:"product-id",ref:S({required:!0})},e)))}),[oe,ie,z,S]),Object(l.useEffect)((function(){v.a.forEach((function(e){e.path.includes(oe)&&(e.routes.length?J(r.a.createElement(r.a.Fragment,null,r.a.createElement("label",null,"\u05ea\u05ea \u05e7\u05d8\u05d2\u05d5\u05e8\u05d9\u05d4: "),r.a.createElement("select",{name:"subcategory",ref:S({required:!0})},e.routes.map((function(e){return r.a.createElement("option",{key:e.path,value:e.path.slice(e.path.lastIndexOf("/")+1)},e.name)}))))):J([]))}))}),[oe,S]),Object(l.useEffect)((function(){v.a.forEach((function(e){e.path.includes(se)&&(e.routes.length?G(r.a.createElement(r.a.Fragment,null,r.a.createElement("label",null," \u05ea\u05ea \u05e7\u05d8\u05d2\u05d5\u05e8\u05d9\u05d4:  "),r.a.createElement("select",{name:"subcategory",ref:s({required:!0})},e.routes.map((function(e){return r.a.createElement("option",{key:e.path,value:e.path.slice(e.path.lastIndexOf("/")+1)},e.name)}))))):G([]))}))}),[se,s]),r.a.createElement("article",null,r.a.createElement(h,{dialogContent:re,setDialogContent:ce}),r.a.createElement("form",{className:"form--compressed"},"update product"===t?r.a.createElement(r.a.Fragment,null,r.a.createElement("h3",null,"\u05d1\u05d7\u05d9\u05e8\u05ea \u05de\u05d5\u05e6\u05e8 \u05dc\u05e2\u05e8\u05d9\u05db\u05d4/\u05de\u05d7\u05d9\u05e7\u05d4"),r.a.createElement("label",null,"\u05e7\u05d8\u05d2\u05d5\u05e8\u05d9\u05d4: "),r.a.createElement("select",{name:"category",ref:S({required:!0})},j),Y,B,r.a.createElement("div",null,r.a.createElement("button",{className:"button green",type:"button",onClick:function(){return X(ue)}},"\u05e2\u05e8\u05d5\u05da \u05de\u05d5\u05e6\u05e8 \u05e0\u05d1\u05d7\u05e8"))):null),"update product"!==t||H?r.a.createElement("form",{onSubmit:f(de),className:"form"},r.a.createElement("h2",{style:{paddingBottom:"10px"}},H?'\u05e2\u05d3\u05db\u05d5\u05df \u05de\u05d5\u05e6\u05e8 "'.concat(z[H].title,'"'):"\u05d4\u05d5\u05e1\u05e4\u05ea \u05de\u05d5\u05e6\u05e8"),r.a.createElement("label",null,"\u05db\u05d5\u05ea\u05e8\u05ea"),r.a.createElement("input",{type:"text",name:"title",ref:s({required:!0}),placeholder:"\u05db\u05d5\u05ea\u05e8\u05ea"}),E.title&&r.a.createElement("span",{className:"error"},"\u05d9\u05e9 \u05dc\u05d4\u05db\u05e0\u05d9\u05e1 \u05db\u05d5\u05ea\u05e8\u05ea"),r.a.createElement("label",null,"\u05de\u05d7\u05d9\u05e8"),r.a.createElement("input",{type:"number",name:"price",ref:s({required:!0}),placeholder:"\u05de\u05d7\u05d9\u05e8"}),E.price&&r.a.createElement("span",{className:"error"},'\u05d9\u05e9 \u05dc\u05e6\u05d9\u05d9\u05df \u05de\u05d7\u05d9\u05e8. \u05db\u05d3\u05d9 \u05e9\u05d9\u05d5\u05e4\u05d9\u05e2 "\u05e6\u05d5\u05e8 \u05e7\u05e9\u05e8 \u05dc\u05e7\u05d1\u05dc\u05ea \u05de\u05d7\u05d9\u05e8", \u05d9\u05e9 \u05dc\u05e6\u05d9\u05d9\u05df \u05de\u05d7\u05d9\u05e8 0'),r.a.createElement("label",null,"\u05ea\u05d9\u05d0\u05d5\u05e8"),r.a.createElement("textarea",{name:"description",ref:s,placeholder:"\u05ea\u05d9\u05d0\u05d5\u05e8"}),r.a.createElement("label",null,"\u05e7\u05d8\u05d2\u05d5\u05e8\u05d9\u05d4"),r.a.createElement("select",{name:"category",ref:s({required:!0})},j),Z,r.a.createElement("label",null,"\u05de\u05dc\u05d0\u05d9"),r.a.createElement("input",{type:"number",name:"stock",ref:s({required:!0}),placeholder:"\u05de\u05dc\u05d0\u05d9"}),E.stock&&r.a.createElement("span",{className:"error"},"\u05d9\u05e9 \u05dc\u05d4\u05db\u05e0\u05d9\u05e1 \u05de\u05e1\u05e4\u05e8 \u05de\u05d5\u05e6\u05e8\u05d9\u05dd \u05d1\u05de\u05dc\u05d0\u05d9"),r.a.createElement("label",null," \u05e2\u05d3\u05d9\u05e4\u05d5\u05ea (\u05de\u05d5\u05e6\u05e8 \u05d1\u05e2\u05dc \u05e2\u05e8\u05da \u05d2\u05d1\u05d5\u05d4 \u05d9\u05d5\u05e6\u05d2 \u05d9\u05d5\u05ea\u05e8 \u05dc\u05de\u05e2\u05dc\u05d4)"),r.a.createElement("input",{type:"number",name:"priority",ref:s,placeholder:"\u05e2\u05d3\u05d9\u05e4\u05d5\u05ea"}),r.a.createElement("label",null,"\u05ea\u05de\u05d5\u05e0\u05d4"),r.a.createElement(g,{product:z[H],uploadedImage:me,register:s}),r.a.createElement("label",{style:{padding:"5px 0px 7px"}},"\u05de\u05d9\u05d3\u05e2 \u05e0\u05d5\u05e1\u05e3"),r.a.createElement(b.a,{theme:"snow",value:F,onChange:A,modules:y,formats:O}),r.a.createElement("div",null,r.a.createElement("input",{type:"submit",value:"add product"===t?"\u05d4\u05e2\u05dc\u05d4 \u05de\u05d5\u05e6\u05e8":"\u05e9\u05de\u05d5\u05e8 \u05e9\u05d9\u05e0\u05d5\u05d9\u05d9\u05dd",className:"button green big"}),H?r.a.createElement("button",{className:"button red big",type:"button",onClick:function(){if(window.confirm('\u05d0\u05ea\u05d4 \u05e2\u05d5\u05de\u05d3 \u05dc\u05de\u05d7\u05d5\u05e7 \u05d0\u05ea \u05d4\u05de\u05d5\u05e6\u05e8 "'.concat(z[H].title,'". \u05d4\u05d0\u05dd \u05d0\u05ea\u05d4 \u05d1\u05d8\u05d5\u05d7?'))){ae(!0),z[H]&&z[H].image&&c.c.refFromURL(z[H].image).delete().then((function(){console.log("image deleted successfully!")})).catch((function(e){console.log("error in deleting image:"+e)}));var e={};e["/products/"+H]=null,e["/quill/"+H]=null,X(),c.b.ref().update(e,(function(e){e?(ae(!1),ce("\u05ea\u05e7\u05dc\u05d4 :"+e)):(ae(!1),ce("\u05d4\u05de\u05d5\u05e6\u05e8 \u05e0\u05de\u05d7\u05e7 \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4"))}))}}},"\u05de\u05d7\u05e7 \u05de\u05d5\u05e6\u05e8"):null)):null,te?r.a.createElement(i.a,{fullscreen:!0}):null)},x=function(){var e=Object(l.useState)('<p class="ql-align-right ql-direction-rtl"><br></p>'),t=Object(n.a)(e,2),a=t[0],o=t[1],u=Object(l.useState)(!1),s=Object(n.a)(u,2),m=s[0],d=s[1],p=Object(l.useState)(!1),f=Object(n.a)(p,2),g=f[0],E=f[1];return Object(l.useEffect)((function(){c.b.ref("abroad").on("value",(function(e){null!=e.val()&&o(e.val())}))}),[]),r.a.createElement("article",{className:"abroad-edit"},r.a.createElement("div",null,r.a.createElement(b.a,{theme:"snow",value:a,onChange:o,modules:y,formats:O}),r.a.createElement("button",{className:"button green big",onClick:function(){return d(!0),void c.b.ref().update({abroad:a},(function(e){e?(d(!1),E("\u05ea\u05e7\u05dc\u05d4 :"+e)):(d(!1),E("\u05d4\u05e2\u05d3\u05db\u05d5\u05df \u05d1\u05d5\u05e6\u05e2 \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4"))}))}},"\u05e2\u05d3\u05db\u05df")),m?r.a.createElement(i.a,{fullscreen:!0}):null,r.a.createElement(h,{dialogContent:g,setDialogContent:E}))};t.default=function(){var e=Object(o.a)(),t=e.register,a=e.handleSubmit,u=e.errors,s=e.setError,m=e.clearErrors,d=Object(o.a)(),p=d.register,f=d.watch,b=Object(l.useState)(!1),g=Object(n.a)(b,2),E=g[0],h=g[1],v=Object(l.useState)(!1),y=Object(n.a)(v,2),O=y[0],j=y[1],k=f("action"),N=null;return Object(l.useEffect)((function(){c.a.onAuthStateChanged((function(e){e?(console.log("You are logged in!"),h(e)):(console.log("No user is logged in."),h(!1))}))}),[]),"add product"===k||"update product"===k?N=r.a.createElement(w,{action:k}):"set rally abroad"===k&&(N=r.a.createElement(x,null)),E?r.a.createElement("article",{className:"page-container"},r.a.createElement("h2",null,"\u05e2\u05de\u05d5\u05d3 \u05de\u05e0\u05d4\u05dc"),r.a.createElement("button",{className:"button",onClick:function(){c.a.signOut().then((function(){console.log("signed out successfully")})).catch((function(e){console.log(e)}))}},"\u05d4\u05ea\u05e0\u05ea\u05e7"),r.a.createElement("form",{className:"form--compressed"},r.a.createElement("input",{name:"action",type:"radio",value:"add product",ref:p}),r.a.createElement("label",null,"\u05de\u05d5\u05e6\u05e8 \u05d7\u05d3\u05e9"),r.a.createElement("input",{name:"action",type:"radio",value:"update product",ref:p}),r.a.createElement("label",null,"\u05e2\u05e8\u05d9\u05db\u05ea \u05de\u05d5\u05e6\u05e8"),r.a.createElement("input",{name:"action",type:"radio",value:"set rally abroad",ref:p}),r.a.createElement("label",null,'\u05e2\u05e8\u05d9\u05db\u05ea \u05ea\u05d5\u05db\u05df \u05e8\u05d0\u05dc\u05d9\u05d9\u05dd \u05d1\u05d7\u05d5"\u05dc')),N):r.a.createElement("article",{className:"page-container"},r.a.createElement("form",{onSubmit:a((function(e){var t,a=e.email,n=e.password,l=e.persistence;j(!0),t=!0===l?c.d.auth.Auth.Persistence.LOCAL:c.d.auth.Auth.Persistence.NONE,c.a.setPersistence(t).then((function(){return c.a.signInWithEmailAndPassword(a,n)})).then(j(!1)).catch((function(e){console.log("Error code: ".concat(e.code)),console.log("Error message: ".concat(e.message)),s("login",{type:"manual",message:"\u05d0\u05d9\u05de\u05d9\u05d9\u05dc \u05d0\u05d5 \u05e1\u05d9\u05e1\u05de\u05d4 \u05e9\u05d2\u05d5\u05d9\u05d9\u05dd"})}))})),className:"form small"},r.a.createElement("h2",{style:{padding:"0px 0px 10px"}},"\u05db\u05e0\u05d9\u05e1\u05ea \u05de\u05e0\u05d4\u05dc"),r.a.createElement("label",null,"\u05d0\u05d9\u05de\u05d9\u05d9\u05dc"),r.a.createElement("input",{type:"text",name:"email",ref:t({required:!0}),placeholder:"\u05d0\u05d9\u05de\u05d9\u05d9\u05dc"}),u.email&&r.a.createElement("span",{className:"error"},"\u05d9\u05e9 \u05dc\u05d4\u05db\u05e0\u05d9\u05e1 \u05d0\u05d9\u05de\u05d9\u05d9\u05dc"),r.a.createElement("label",null,"\u05e1\u05d9\u05e1\u05de\u05d0"),r.a.createElement("input",{type:"password",name:"password",ref:t({required:!0}),placeholder:"\u05e1\u05d9\u05e1\u05de\u05d0"}),u.password&&r.a.createElement("span",{className:"error"},"\u05d9\u05e9 \u05dc\u05d4\u05db\u05e0\u05d9\u05e1 \u05e1\u05d9\u05e1\u05de\u05d0"),r.a.createElement("div",null,r.a.createElement("input",{type:"checkbox",name:"persistence",defaultChecked:!0,ref:t}),r.a.createElement("label",null,"\u05d4\u05d9\u05e9\u05d0\u05e8 \u05de\u05d7\u05d5\u05d1\u05e8")),O?r.a.createElement(i.a,null):r.a.createElement("input",{type:"submit",value:"\u05d4\u05ea\u05d7\u05d1\u05e8",className:"button",onClick:function(){return m("login")}}),u.login&&r.a.createElement("span",{className:"error"},u.login.message)))}},44:function(e,t,a){"use strict";a.d(t,"b",(function(){return r})),a.d(t,"a",(function(){return c})),a.d(t,"c",(function(){return o}));var n=a(46),l=a.n(n);a.d(t,"d",(function(){return l.a}));a(63),a(72),a(64),a(73);l.a.initializeApp({apiKey:"AIzaSyB2sTZWeYTKMQmoyMWKNr8pYil0ZOkrUrk",authDomain:"rally-trip-dev.firebaseapp.com",databaseURL:"https://rally-trip-dev.firebaseio.com",projectId:"rally-trip-dev",storageBucket:"rally-trip-dev.appspot.com",messagingSenderId:"45699978518",appId:"1:45699978518:web:e9ec13a6261e93ccafac37",measurementId:"G-RDDKEQ1EN7"}),l.a.analytics();var r=l.a.database(),c=l.a.auth(),o=l.a.storage()},48:function(e,t,a){"use strict";var n=a(0),l=a.n(n),r=a(15);a(65);t.a=function(e){return e.fullscreen?l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"loader fullscreen"}," "),l.a.createElement(r.a,null)):l.a.createElement("div",{className:"loader"})}},65:function(e,t,a){},70:function(e,t,a){}}]);
//# sourceMappingURL=5.6702f265.chunk.js.map