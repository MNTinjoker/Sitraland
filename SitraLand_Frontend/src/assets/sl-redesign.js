/* SitraLand UI Redesign v2 – تک‌فایل (CSS + بخش‌های صفحه اصلی)
   این طرح، طرح اصلی و همیشگی سایت است؛ دکمه روشن/خاموش و حالت «طرح عادی» حذف شده‌اند.
   نصب: این فایل در src/assets/ است و در index.html با
   <script src="assets/sl-redesign.js" defer></script> بارگذاری می‌شود. */
(function(){
  var s=document.createElement('style');s.id='sl-v2-css';
  s.textContent=`/* =========================================================
   Sitraland – UI Redesign v2
   فعال می‌شود وقتی <body class="sl-v2"> باشد.
   ========================================================= */
body.sl-v2{
  --sl-primary:#0e7490; --sl-primary-d:#0b4f63; --sl-primary-l:#e0f4f8;
  --sl-accent:#f59e0b;  --sl-accent-d:#d97706;
  --sl-ink:#14212b; --sl-muted:#64748b; --sl-line:#e5eaf0;
  --sl-bg:#f4f7fa; --sl-card:#fff;
  --sl-r:18px; --sl-r-sm:12px;
  --sl-sh:0 1px 2px rgba(15,35,50,.05),0 8px 24px -8px rgba(15,35,50,.12);
  --sl-sh-lg:0 2px 4px rgba(15,35,50,.06),0 18px 40px -12px rgba(14,116,144,.28);
  background:var(--sl-bg)!important; color:var(--sl-ink);
}
html body.sl-v2.sl-v2 .sitra-app-shell{background:
  radial-gradient(900px 400px at 85% -80px,rgba(14,116,144,.10),transparent 70%),
  radial-gradient(700px 360px at 5% 0,rgba(245,158,11,.08),transparent 70%),var(--sl-bg)!important}
html body.sl-v2.sl-v2 .redesign-preview-toggle{display:none!important}

/* ---------- Navbar ---------- */
html body.sl-v2.sl-v2 .navContainer{background:rgba(255,255,255,.82)!important;backdrop-filter:saturate(1.6) blur(14px);
  border-bottom:1px solid var(--sl-line)!important;box-shadow:0 6px 24px -14px rgba(15,35,50,.25)!important}
html body.sl-v2.sl-v2 .nav-inner{max-width:1280px;margin:0 auto}
html body.sl-v2.sl-v2 .nav-logo{border-radius:50%!important;border:2px solid #fff;box-shadow:0 4px 14px rgba(14,116,144,.3)}
html body.sl-v2.sl-v2 .navbar-search .form-control{background:#eef2f6!important;border:1px solid transparent!important;border-radius:999px!important;
  padding-inline:1.1rem;transition:.2s}
html body.sl-v2.sl-v2 .navbar-search .form-control:focus{background:#fff!important;border-color:var(--sl-primary)!important;box-shadow:0 0 0 4px rgba(14,116,144,.15)!important}
html body.sl-v2.sl-v2 .navbar-search .btn{background:linear-gradient(135deg,var(--sl-primary),var(--sl-primary-d))!important;border:0!important;border-radius:50%!important;
  box-shadow:0 6px 14px -4px rgba(14,116,144,.6)}
html body.sl-v2.sl-v2 .nav-action{border-radius:12px!important;padding:.45rem .7rem!important;color:var(--sl-ink)!important;transition:.2s}
html body.sl-v2.sl-v2 .nav-action:hover{background:var(--sl-primary-l)!important;color:var(--sl-primary-d)!important}
html body.sl-v2.sl-v2 .nav-basket .badge{background:var(--sl-accent)!important}

/* ---------- Hero ---------- */
html body.sl-v2.sl-v2 .hero{border-radius:26px!important;overflow:hidden;box-shadow:var(--sl-sh-lg);border:0!important;
  background:linear-gradient(120deg,#0b4f63 0%,#0e7490 55%,#14a3b8 100%)!important}
html body.sl-v2.sl-v2 .hero-media{opacity:.95}
html body.sl-v2.sl-v2 .hero-title{font-weight:800;letter-spacing:-.01em;text-shadow:0 2px 12px rgba(0,0,0,.25)}
html body.sl-v2.sl-v2 .hero-subtitle{opacity:.92}
html body.sl-v2.sl-v2 .btn-accent,html body.sl-v2.sl-v2 .btn-hero{background:linear-gradient(135deg,var(--sl-accent),var(--sl-accent-d))!important;color:#fff!important;border:0!important;
  border-radius:999px!important;padding:.6rem 1.4rem!important;font-weight:700;box-shadow:0 10px 22px -8px rgba(217,119,6,.7);transition:.2s}
html body.sl-v2.sl-v2 .btn-accent:hover,html body.sl-v2.sl-v2 .btn-hero:hover{transform:translateY(-2px);box-shadow:0 14px 26px -8px rgba(217,119,6,.8)}
html body.sl-v2.sl-v2 .btn-hero-ghost{background:rgba(255,255,255,.12)!important;border:1px solid rgba(255,255,255,.55)!important;color:#fff!important;
  border-radius:999px!important;backdrop-filter:blur(6px);box-shadow:none!important}

/* ---------- Section titles ---------- */
html body.sl-v2.sl-v2 .title-text{font-weight:800;font-size:1.15rem;color:var(--sl-ink);display:flex;align-items:center;gap:.6rem}
html body.sl-v2.sl-v2 .title-text::before{content:"";width:6px;height:22px;border-radius:4px;background:linear-gradient(var(--sl-accent),var(--sl-primary))}

/* ---------- Categories ---------- */
html body.sl-v2.sl-v2 .container-category{background:var(--sl-card)!important;border-radius:var(--sl-r)!important;border:1px solid var(--sl-line)!important;box-shadow:var(--sl-sh)!important}
html body.sl-v2.sl-v2 .option-category{border-radius:16px;padding:.7rem .5rem;transition:.25s;cursor:pointer}
html body.sl-v2.sl-v2 .option-category:hover{background:var(--sl-primary-l);transform:translateY(-4px)}
html body.sl-v2.sl-v2 .img-category{filter:drop-shadow(0 6px 8px rgba(14,116,144,.25))}

/* ---------- Product cards ---------- */
html body.sl-v2.sl-v2 .container-carousel{background:var(--sl-card)!important;border-radius:22px!important;border:1px solid var(--sl-line)!important;box-shadow:var(--sl-sh)!important}
html body.sl-v2.sl-v2 .product-card{background:var(--sl-card)!important;border:1px solid var(--sl-line)!important;border-radius:var(--sl-r)!important;overflow:hidden;
  box-shadow:var(--sl-sh)!important;transition:transform .25s,box-shadow .25s,border-color .25s}
html body.sl-v2.sl-v2 .product-card:hover{transform:translateY(-6px);box-shadow:var(--sl-sh-lg)!important;border-color:rgba(14,116,144,.35)!important}
html body.sl-v2.sl-v2 .product-card-media{background:linear-gradient(160deg,#eef6f8,#f8fafc)!important;overflow:hidden}
html body.sl-v2.sl-v2 .product-card-media img{transition:transform .5s}
html body.sl-v2.sl-v2 .product-card:hover .product-card-media img{transform:scale(1.07)}
html body.sl-v2.sl-v2 .product-card-name{font-weight:700;color:var(--sl-ink)}
html body.sl-v2.sl-v2 .stock-badge{border-radius:999px!important;font-weight:600;background:rgba(16,185,129,.95)!important;box-shadow:0 4px 10px -3px rgba(16,185,129,.6)}
html body.sl-v2.sl-v2 .product-card-flag{background:#fff7e6!important;color:var(--sl-accent-d)!important;border-radius:10px!important}
html body.sl-v2.sl-v2 .product-card-footer .btn,html body.sl-v2.sl-v2 .product-card-footer button{background:linear-gradient(135deg,var(--sl-primary),var(--sl-primary-d))!important;
  color:#fff!important;border:0!important;border-radius:12px!important;box-shadow:0 8px 16px -6px rgba(14,116,144,.7);transition:.2s}
html body.sl-v2.sl-v2 .product-card-footer .btn:hover,html body.sl-v2.sl-v2 .product-card-footer button:hover{transform:scale(1.08)}
html body.sl-v2.sl-v2 .p-carousel .p-button{background:#fff!important;color:var(--sl-primary)!important;border:1px solid var(--sl-line)!important;box-shadow:var(--sl-sh)}

/* ---------- Generic buttons / inputs ---------- */
html body.sl-v2.sl-v2 .btn{border-radius:12px!important;font-weight:600;transition:.2s}
html body.sl-v2.sl-v2 .btn-primary{background:linear-gradient(135deg,var(--sl-primary),var(--sl-primary-d))!important;border:0!important;box-shadow:0 8px 18px -8px rgba(14,116,144,.7)}
html body.sl-v2.sl-v2 .btn-primary:hover{transform:translateY(-1px)}
html body.sl-v2.sl-v2 .btn-outline-primary{color:var(--sl-primary)!important;border:1px solid rgba(14,116,144,.4)!important;background:#fff!important}
html body.sl-v2.sl-v2 .btn-outline-primary:hover{background:var(--sl-primary)!important;color:#fff!important}
html body.sl-v2.sl-v2 .btn-outline-danger{border-radius:12px!important}
html body.sl-v2.sl-v2 .form-control,html body.sl-v2.sl-v2 .form-select,html body.sl-v2.sl-v2 .p-inputtext,html body.sl-v2.sl-v2 .p-select,html body.sl-v2.sl-v2 .p-dropdown,html body.sl-v2.sl-v2 textarea{
  border:1px solid var(--sl-line)!important;border-radius:var(--sl-r-sm)!important;background:#fff!important;min-height:42px;transition:.2s}
html body.sl-v2.sl-v2 .form-control:focus,html body.sl-v2.sl-v2 .form-select:focus,html body.sl-v2.sl-v2 .p-inputtext:focus,html body.sl-v2.sl-v2 textarea:focus{
  border-color:var(--sl-primary)!important;box-shadow:0 0 0 4px rgba(14,116,144,.14)!important;outline:0}
html body.sl-v2.sl-v2 label{font-weight:600;color:#334155;font-size:.85rem}

/* ---------- Admin ---------- */
html body.sl-v2.sl-v2 .appContainer,html body.sl-v2.sl-v2 .appUserContainer{max-width:1280px;margin-inline:auto;padding-inline:1rem}
html body.sl-v2.sl-v2 .admin-toolbar{background:var(--sl-card)!important;border:1px solid var(--sl-line)!important;border-radius:var(--sl-r)!important;box-shadow:var(--sl-sh);padding:.6rem 1rem}
html body.sl-v2.sl-v2 .admin-page-header{background:var(--sl-card);border:1px solid var(--sl-line);border-radius:var(--sl-r);box-shadow:var(--sl-sh);padding:.9rem 1.1rem;margin-bottom:1rem}
html body.sl-v2.sl-v2 .admin-page-header h1,html body.sl-v2.sl-v2 .admin-page-header h2,html body.sl-v2.sl-v2 .admin-page-header h3,html body.sl-v2.sl-v2 .admin-page-header h4,html body.sl-v2.sl-v2 .admin-page-header h5,html body.sl-v2.sl-v2 .admin-page-header h6{font-weight:800}
html body.sl-v2.sl-v2 .admin-page-icon{background:linear-gradient(135deg,var(--sl-primary),var(--sl-primary-d))!important;color:#fff!important;border-radius:14px!important;
  width:34px;height:34px;display:inline-flex!important;align-items:center;justify-content:center;
  box-shadow:0 8px 16px -6px rgba(14,116,144,.7)}
/* The helper classes are hidden in the base design and only belong to v2. */
html body.sl-v2.sl-v2 .preview-only{display:block!important}
html body.sl-v2.sl-v2 .preview-only-inline{display:inline-flex!important;align-items:center;justify-content:center}

/* ---------- Tables (PrimeNG) ---------- */
html body.sl-v2.sl-v2 .p-datatable{background:var(--sl-card);border:1px solid var(--sl-line);border-radius:var(--sl-r);box-shadow:var(--sl-sh);overflow:hidden}
html body.sl-v2.sl-v2 .p-datatable-thead>tr>th{background-image:none!important;background-color:#eaf1f5!important;color:#0f3d4c!important;font-weight:800;font-size:.82rem;
  border:0!important;border-bottom:1px solid var(--sl-line)!important;padding:.9rem .8rem!important}
html body.sl-v2.sl-v2 .p-datatable-tbody>tr>td{border:0!important;border-bottom:1px solid #eef2f6!important;padding:.75rem .8rem!important;vertical-align:middle;background:transparent!important}
html body.sl-v2.sl-v2 .p-datatable-tbody>tr:nth-child(even)>td{background:#fafcfd!important}
html body.sl-v2.sl-v2 .p-datatable-tbody>tr{transition:.15s}
html body.sl-v2.sl-v2 .p-datatable-tbody>tr:hover>td{background:var(--sl-primary-l)!important}
html body.sl-v2.sl-v2 .image-fallback,html body.sl-v2.sl-v2 .p-datatable td img{border-radius:12px!important;object-fit:cover}
html body.sl-v2.sl-v2 .p-paginator{background:transparent!important;border:0!important;padding:1rem!important}
html body.sl-v2.sl-v2 .p-paginator-page,html body.sl-v2.sl-v2 .p-paginator button{border-radius:10px!important;min-width:36px;height:36px}
html body.sl-v2.sl-v2 .p-paginator-page.p-paginator-page-selected{background:var(--sl-primary)!important;color:#fff!important}

/* ---------- Cards / panels generic ---------- */
html body.sl-v2.sl-v2 .card,html body.sl-v2.sl-v2 .shadow{border-radius:var(--sl-r)!important;border:1px solid var(--sl-line)!important;box-shadow:var(--sl-sh)!important}
html body.sl-v2.sl-v2 .p-tabs,html body.sl-v2.sl-v2 .p-tablist-tab-list{border-radius:14px}
html body.sl-v2.sl-v2 .p-dialog{border-radius:22px!important;overflow:hidden;box-shadow:0 30px 80px -20px rgba(15,35,50,.45)!important}
html body.sl-v2.sl-v2 .p-editor-container,html body.sl-v2.sl-v2 .ql-container,html body.sl-v2.sl-v2 .ql-toolbar{border-color:var(--sl-line)!important}
html body.sl-v2.sl-v2 .ql-toolbar{border-radius:12px 12px 0 0;background:#f8fafc}
html body.sl-v2.sl-v2 .ql-container{border-radius:0 0 12px 12px;background:#fff}

/* ---------- Footer ---------- */
html body.sl-v2.sl-v2 .footer-container{background:linear-gradient(135deg,#0b3b4a,#0e7490)!important;color:#fff!important;border:0!important;
  border-radius:26px 26px 0 0!important;margin-top:2rem}
html body.sl-v2.sl-v2 .option-card{background:rgba(255,255,255,.08)!important;border:1px solid rgba(255,255,255,.18)!important;border-radius:var(--sl-r)!important;backdrop-filter:blur(6px);transition:.25s}
html body.sl-v2.sl-v2 .option-card:hover{background:rgba(255,255,255,.16)!important;transform:translateY(-4px)}
html body.sl-v2.sl-v2 .footer-phone{color:#fff!important;font-weight:700}

/* ---------- Floating contact buttons ---------- */
html body.sl-v2.sl-v2 .fa-phone,html body.sl-v2.sl-v2 .fa-whatsapp{filter:none}
html body.sl-v2.sl-v2 a[href^="https://wa.me"].fixed,html body.sl-v2.sl-v2 .floating-contact a{box-shadow:0 10px 24px -6px rgba(0,0,0,.35)!important}

/* ---------- Mobile bottom tabs ---------- */
@media(max-width:767px){
  html body.sl-v2.sl-v2 .bottom-tabs{left:12px!important;right:12px!important;bottom:calc(10px + env(safe-area-inset-bottom))!important;border-radius:22px!important;
    background:rgba(255,255,255,.9)!important;backdrop-filter:blur(14px);border:1px solid var(--sl-line)!important;box-shadow:0 18px 40px -12px rgba(15,35,50,.4)!important}
  html body.sl-v2.sl-v2 .bottom-tabs a.active{color:var(--sl-primary)!important;background:var(--sl-primary-l);border-radius:16px}
  html body.sl-v2.sl-v2 .hero{border-radius:20px!important}
}

/* ---------- Scrollbar + selection ---------- */
html body.sl-v2.sl-v2 ::selection{background:rgba(14,116,144,.25)}
html body.sl-v2.sl-v2 ::-webkit-scrollbar{width:10px;height:10px}
html body.sl-v2.sl-v2 ::-webkit-scrollbar-thumb{background:#c3d3dc;border-radius:10px;border:2px solid var(--sl-bg)}

/* =========================================================
   Scrollbar / selection helpers above; the theme is always on.
   ========================================================= */

/* ---------- Layout fix: compact navbar + admin toolbar below it ---------- */
html body.sl-v2.sl-v2 .nav-logo,html body.sl-v2.sl-v2 .nav-brand{width:54px!important;height:54px!important}
html body.sl-v2.sl-v2 .navContainer{padding:.5rem 20px!important}
html body.sl-v2.sl-v2 .nav-inner{height:54px!important;align-items:center}
@media(max-width:767px){html body.sl-v2.sl-v2 .nav-inner{height:auto!important;align-items:center}}
html body.sl-v2.sl-v2 .admin-toolbar{top:var(--sitra-nav-height,70px)!important;background:rgba(255,255,255,.9)!important;backdrop-filter:blur(12px);
  border-radius:0 0 18px 18px!important;border-top:0!important;max-width:1280px;margin:var(--sitra-nav-height,70px) auto 0;left:0;right:0;width:auto!important}
html body.sl-v2.sl-v2 .appContainer{padding-top:.75rem!important}
html body.sl-v2.sl-v2 .appUserContainer{padding-top:calc(var(--sitra-nav-height,5.6rem) + 1.2rem)!important}
html body.sl-v2.sl-v2 .admin-toolbar .btn-primary,html body.sl-v2.sl-v2 .admin-toolbar .active,html body.sl-v2.sl-v2 .admin-toolbar .btn-primary *{color:#fff!important}

/* ================= v2.1: footer کوچک + بخش‌های بیشتر + جزئیات ================= */
html body.sl-v2.sl-v2 .footer-container{margin-top:1.5rem!important;padding:1rem 1.2rem!important;border-radius:22px 22px 0 0!important;
  display:flex;flex-wrap:wrap;align-items:center;gap:.8rem 1.5rem}
html body.sl-v2.sl-v2 .footer-container>*{margin:0!important;padding:0!important;border:0!important}
html body.sl-v2.sl-v2 .optionofsitra{display:flex!important;flex:1 1 100%;gap:.6rem;justify-content:space-between}
html body.sl-v2.sl-v2 .option-card{flex:1;display:flex!important;flex-direction:row!important;align-items:center;justify-content:center;gap:.5rem;padding:.45rem .6rem!important}
html body.sl-v2.sl-v2 .img-option{width:26px!important;height:26px!important;margin:0!important}
html body.sl-v2.sl-v2 .img-text{margin:0!important;font-size:.75rem!important}
html body.sl-v2.sl-v2 .footer-container h6{font-size:.85rem;opacity:.85}
html body.sl-v2.sl-v2 .footer-container a{font-size:.8rem}
html body.sl-v2.sl-v2 .footer-contact{padding:.3rem .5rem!important;background:transparent!important}
html body.sl-v2.sl-v2 .footer-container [class*="col-"]{width:auto!important}
html body.sl-v2.sl-v2 .footer-container ul{margin:0;padding:0;list-style:none;display:flex;gap:.9rem;flex-wrap:wrap}
@media(max-width:767px){html body.sl-v2.sl-v2 .optionofsitra{flex-wrap:wrap}html body.sl-v2.sl-v2 .option-card{flex:1 1 45%}}

/* trust strip */
.sl-extra{max-width:1280px;margin:1.4rem auto;direction:rtl}
.sl-trust{display:grid;grid-template-columns:repeat(4,1fr);gap:.8rem}
.sl-trust-item{display:flex;align-items:center;gap:.8rem;background:#fff;border:1px solid var(--sl-line);border-radius:16px;padding:.9rem 1rem;box-shadow:var(--sl-sh);transition:.25s}
.sl-trust-item:hover{transform:translateY(-3px);box-shadow:var(--sl-sh-lg)}
.sl-trust-item i{width:44px;height:44px;display:grid;place-items:center;border-radius:14px;background:linear-gradient(135deg,var(--sl-primary-l),#fff);color:var(--sl-primary);font-size:1.15rem}
.sl-trust-item b{display:block;font-size:.9rem}.sl-trust-item small{color:var(--sl-muted);font-size:.74rem}
/* steps */
.sl-h{font-weight:800;font-size:1.15rem;display:flex;align-items:center;gap:.6rem;margin:2rem 0 1rem}
.sl-h::before{content:"";width:6px;height:22px;border-radius:4px;background:linear-gradient(var(--sl-accent),var(--sl-primary))}
.sl-steps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.8rem;position:relative}
.sl-step{background:#fff;border:1px solid var(--sl-line);border-radius:18px;padding:1.1rem;text-align:center;box-shadow:var(--sl-sh)}
.sl-step span{display:grid;place-items:center;width:42px;height:42px;margin:0 auto .6rem;border-radius:50%;color:#fff;font-weight:800;background:linear-gradient(135deg,var(--sl-accent),var(--sl-accent-d));box-shadow:0 8px 16px -6px rgba(217,119,6,.7)}
.sl-step b{display:block;font-size:.9rem}.sl-step small{color:var(--sl-muted);font-size:.75rem}
/* CTA */
.sl-cta{margin-top:2rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;padding:1.6rem 2rem;border-radius:26px;color:#fff;
  background:radial-gradient(500px 200px at 10% 0,rgba(245,158,11,.35),transparent 70%),linear-gradient(120deg,#0b4f63,#0e7490);box-shadow:var(--sl-sh-lg)}
.sl-cta h3{font-weight:800;margin:0 0 .3rem;font-size:1.25rem}.sl-cta p{margin:0;opacity:.9;font-size:.9rem}
.sl-cta-btns{display:flex;gap:.6rem}.sl-cta-btns a{padding:.6rem 1.3rem;border-radius:999px;background:#fff;color:#0b4f63;font-weight:700;text-decoration:none;transition:.2s}
.sl-cta-btns a.wa{background:#22c55e;color:#fff}.sl-cta-btns a:hover{transform:translateY(-2px)}
/* FAQ */
.sl-faq details{background:#fff;border:1px solid var(--sl-line);border-radius:14px;margin-bottom:.6rem;padding:.8rem 1rem;box-shadow:var(--sl-sh);transition:.2s}
.sl-faq summary{cursor:pointer;font-weight:700;font-size:.9rem;list-style:none;display:flex;justify-content:space-between}
.sl-faq summary::after{content:"+";color:var(--sl-primary);font-size:1.2rem;line-height:1}
.sl-faq details[open] summary::after{content:"–"}
.sl-faq details[open]{border-color:rgba(14,116,144,.4)}
.sl-faq p{margin:.6rem 0 0;color:var(--sl-muted);font-size:.85rem}
@media(max-width:767px){.sl-trust,.sl-steps-grid{grid-template-columns:repeat(2,1fr)}.sl-cta{padding:1.2rem}}

/* دسته‌بندی: کاشی‌های بزرگ‌تر */
html body.sl-v2.sl-v2 .container-category{display:flex;flex-wrap:wrap;justify-content:center;gap:.6rem;padding:1.1rem!important}
html body.sl-v2.sl-v2 .option-category{min-width:92px;background:#f6fafc;border:1px solid var(--sl-line);padding:1rem .8rem!important}
html body.sl-v2.sl-v2 .img-category{width:46px!important;height:46px!important}
/* hero: الگو و ظاهر */
html body.sl-v2.sl-v2 .hero::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(500px 240px at 90% 0,rgba(255,255,255,.18),transparent 70%)}
html body.sl-v2.sl-v2 .hero{position:relative}
/* ظاهر نرم‌تر صفحه و ورود */
@keyframes slUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
html body.sl-v2.sl-v2 .product-card,html body.sl-v2.sl-v2 .sl-extra>*,html body.sl-v2.sl-v2 .container-category{animation:slUp .5s both}
/* سبد خالی */
html body.sl-v2.sl-v2 .fa-shopping-basket,html body.sl-v2.sl-v2 [class*="empty"] img,html body.sl-v2.sl-v2 [class*="empty"] svg{max-width:150px;max-height:150px;opacity:.55}
html body.sl-v2.sl-v2 .product-card-price,html body.sl-v2.sl-v2 [class*="price"]{color:var(--sl-primary-d);font-weight:800}

/* ---- v2.2 فوتر یک‌ردیفه و کم‌ارتفاع + رفع اسکرول دسته‌بندی ---- */
html body.sl-v2.sl-v2 .footer-container{display:grid!important;grid-template-columns:1.1fr 1fr 1fr;align-items:center;gap:1rem 2rem!important;padding:1.1rem 1.6rem!important}
html body.sl-v2.sl-v2 .optionofsitra{display:grid!important;grid-template-columns:1fr 1fr;width:auto!important;flex:none}
html body.sl-v2.sl-v2 .option-card{width:auto!important;height:auto!important;min-height:0!important;flex-direction:row!important}
html body.sl-v2.sl-v2 .footer-container>div.border-top{width:auto!important;height:auto!important;display:flex;flex-direction:column;align-items:center;gap:.5rem}
html body.sl-v2.sl-v2 .footer-container>div.border-top h6{margin:0!important;text-align:center!important}
html body.sl-v2.sl-v2 .footer-contact{display:flex;align-items:center;gap:.6rem;width:auto!important;height:auto!important}
html body.sl-v2.sl-v2 .footer-contact-btn{padding:.35rem .8rem!important;height:auto!important;font-size:.78rem}
html body.sl-v2.sl-v2 .social-media{display:flex;gap:.6rem;width:auto!important;height:auto!important}
html body.sl-v2.sl-v2 .social{width:30px!important;height:30px!important}
html body.sl-v2.sl-v2 .social-media a{width:30px!important;height:30px!important}
html body.sl-v2.sl-v2 .wrapper-footer{display:flex!important;gap:2rem;width:auto!important;height:auto!important;justify-content:flex-end}
html body.sl-v2.sl-v2 .wrapper-footer>div{width:auto!important;height:auto!important;padding:0!important}
html body.sl-v2.sl-v2 .title-footer{margin:0 0 .3rem!important;font-weight:800;height:auto!important}
html body.sl-v2.sl-v2 .help-shop{height:auto!important;margin:0!important;padding:0!important}
html body.sl-v2.sl-v2 .option-footer{margin:.15rem 0!important;font-size:.78rem;opacity:.9}
@media(max-width:900px){html body.sl-v2.sl-v2 .footer-container{grid-template-columns:1fr}html body.sl-v2.sl-v2 .wrapper-footer{justify-content:center}}
html body.sl-v2.sl-v2 .container-category,html body.sl-v2.sl-v2 .container-category>*{height:auto!important;max-height:none!important;overflow:visible!important}
html body.sl-v2.sl-v2 .option-category{height:auto!important}
html body.sl-v2.sl-v2 .wrapper-footer{flex-direction:row!important;flex-wrap:nowrap!important;justify-content:center!important;text-align:right}
.sl-cta-btns a.wa,.sl-cta-btns a.wa *{color:#fff!important;opacity:1!important}.sl-cta-btns a:not(.wa){color:#0b4f63!important}
`;
  document.head.appendChild(s);
  function boot(){
/* SitraLand v2 is the only design of the site: the classes are always on. */
(function () {
  var OLD_CLASS = 'sitra-redesign-preview';
  // Keys of the old preview builds; a stale "off" value must not come back.
  localStorage.removeItem('sl-v2');
  localStorage.removeItem(OLD_CLASS);

  function apply() {
    document.body.classList.add('sl-v2');
    document.body.classList.remove(OLD_CLASS);
  }

  // Angular can rewrite the body classes, so the theme is applied again.
  new MutationObserver(function () {
    if (!document.body.classList.contains('sl-v2') ||
        document.body.classList.contains(OLD_CLASS)) apply();
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  apply();
})();

/* SitraLand v2 – extra home sections */
(function(){
  function build(){
    var home=document.querySelector('app-home .appUserContainer>div, app-home .appUserContainer');
    var hero=document.querySelector('app-home .hero');
    var car=document.querySelector('app-home app-product-carousel');
    if(!home||!hero||!car||document.getElementById('sl-trust'))return;
    var trust=document.createElement('section');trust.id='sl-trust';trust.className='sl-extra sl-trust';
    trust.innerHTML=[['fa-truck','ارسال سریع','به سراسر کشور'],['fa-shield','ضمانت اصالت','قطعات اورجینال سیترا'],['fa-headphones','پشتیبانی','هر روز ۹ تا ۶'],['fa-credit-card','پرداخت امن','خرید مطمئن']]
      .map(function(x){return '<div class="sl-trust-item"><i class="fa '+x[0]+'"></i><div><b>'+x[1]+'</b><small>'+x[2]+'</small></div></div>'}).join('');
    hero.insertAdjacentElement('afterend',trust);
    var after=document.createElement('div');after.id='sl-after';after.className='sl-extra';
    after.innerHTML=
     '<section class="sl-steps"><h3 class="sl-h">چطور سفارش بدهم؟</h3><div class="sl-steps-grid">'+
      [['۱','قطعه را پیدا کنید','با جستجو یا دسته‌بندی'],['۲','به سبد اضافه کنید','تعداد دلخواه را انتخاب کنید'],['۳','سفارش ثبت شود','تیم ما تماس می‌گیرد'],['۴','درب منزل تحویل بگیرید','ارسال سریع']]
       .map(function(s){return '<div class="sl-step"><span>'+s[0]+'</span><b>'+s[1]+'</b><small>'+s[2]+'</small></div>'}).join('')+'</div></section>'+
     '<section class="sl-cta"><div><h3>دنبال قطعه خاصی هستید؟</h3><p>شماره فنی یا مدل خودرو را بفرستید؛ همکاران ما سریع پیدایش می‌کنند.</p></div>'+
      '<div class="sl-cta-btns"><a href="tel:+989126340914"><i class="fa fa-phone"></i> تماس</a><a class="wa" href="https://wa.me/message/523VQLPPXK7DA1"><i class="fa fa-whatsapp"></i> واتساپ</a></div></section>'+
     '<section class="sl-faq"><h3 class="sl-h">سوالات پرتکرار</h3>'+
      [['آیا قطعات اورجینال هستند؟','بله، همه قطعات از تامین‌کننده معتبر و با ضمانت اصالت عرضه می‌شوند.'],['ارسال چقدر زمان می‌برد؟','معمولاً ۱ تا ۳ روز کاری بسته به شهر مقصد.'],['اگر قطعه مناسب خودرو نبود؟','با پشتیبانی تماس بگیرید؛ قطعه تعویض می‌شود.']]
       .map(function(q){return '<details><summary>'+q[0]+'</summary><p>'+q[1]+'</p></details>'}).join('')+'</section>';
    car.insertAdjacentElement('afterend',after);
  }
  new MutationObserver(function(){ if(document.body.classList.contains('sl-v2')) build(); })
    .observe(document.documentElement,{childList:true,subtree:true});
  build();
})();

  }
  if(document.body)boot();else document.addEventListener('DOMContentLoaded',boot);
})();
