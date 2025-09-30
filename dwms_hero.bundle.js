/*! Dark Wave Marketing Science – Hero (Bundle v2: SVG Ocean) */
(function(){
  'use strict';

  var DEFAULTS = {
    targetLink: "https://carlos.darkwavemarketing.science",
    skipBehavior: "hide",
    autoRedirect: false,
    autoRedirectDelay: 900
  };

  /* ===== CSS ===== */
  var CSS = `
:root{
  --navy:#0b1522; --ink:#f2f5f7;
  --wave1:#0a1e2a; --wave2:#0d2735; --wave3:#103041;
  --boat-dark:#0b0d10; --boat-mid:#20252b; --light:#ffd54a;
  --spotlight-fade:rgba(255,213,74,0);
}

/* Stage / dusk / sun (unchanged) */
.dwms-stage{position:fixed;inset:0;z-index:9999;width:100vw;height:100vh;overflow:hidden;background:transparent;color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;pointer-events:auto;}
.dwms-stage::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(120vw 80vh at 80% 0%,rgba(0,0,0,0) 0%,rgba(0,0,0,.22) 45%,rgba(0,0,0,.6) 100%);opacity:0;transition:opacity 1.8s ease-out;}
.dwms-stage.dusk::after{opacity:.9;}
.sky{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(255,255,255,.05) 0%,rgba(20,30,45,0) 40%,rgba(10,15,24,0) 100%);}
.sun{position:absolute;top:6vh;right:10vw;z-index:2;width:10vmin;height:10vmin;border-radius:50%;background:radial-gradient(circle at 45% 45%,rgba(255,248,220,.95),rgba(255,248,220,.55) 60%,rgba(255,248,220,0) 70%);filter:drop-shadow(0 0 18px rgba(255,244,200,.25));animation:sunSet 10s ease-in forwards 1.25s;}
@keyframes sunSet{0%{transform:translateY(0);opacity:.9}70%{transform:translateY(22vh);opacity:.35}100%{transform:translateY(26vh);opacity:0}}

/* Water fill (unchanged) */
.water{position:absolute;left:0;right:0;bottom:0;height:0vh;z-index:4;overflow:hidden;background:linear-gradient(180deg,rgba(7,20,34,.9),rgba(3,10,18,.98));animation:fillUp 6.5s cubic-bezier(.2,.7,.1,1) forwards .7s;}
@keyframes fillUp{0%{height:0vh}100%{height:42vh}}
/* subtle shimmer on the waterline */
.water::before{content:"";position:absolute;left:-20%;right:-20%;top:-2px;height:14px;background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,.06),rgba(255,255,255,0));mix-blend-mode:screen;filter:blur(1px);}

/* NEW: single SVG ocean (replaces tiled .waves) */
.ocean{position:absolute;left:-20vw;right:-20vw;bottom:-2vh;height:56vh;width:140vw;z-index:5;pointer-events:none;}
.ocean .layer path{will-change:transform;}
.ocean .back   {animation:drift1 16s ease-in-out infinite;}
.ocean .mid    {animation:drift2 12s ease-in-out infinite;}
.ocean .top    {animation:drift3 9s  ease-in-out infinite;}
.ocean .foam   {mix-blend-mode:screen;opacity:.35;filter:blur(.5px);animation:drift3 9s ease-in-out infinite;}

@keyframes drift1{0%,100%{transform:translateX(0)}50%{transform:translateX(30px)}}
@keyframes drift2{0%,100%{transform:translateX(0)}50%{transform:translateX(-38px)}}
@keyframes drift3{0%,100%{transform:translateX(0)}50%{transform:translateX(48px)}}

/* Boat, reflection, spotlight, banner (as before) */
.boat,.boat-reflection{position:absolute;z-index:6;right:-32vmin;width:30vmin;height:17vmin;filter:drop-shadow(0 6px 6px rgba(0,0,0,.5));opacity:0;animation:sailAcross 20s ease-in-out 3.6s forwards;will-change:transform,opacity;}
.boat{bottom:calc(42vh - 5vmin);}
.boat-reflection{bottom:calc(42vh - 5vmin);transform:scaleY(-1) translateY(-6vmin);opacity:0;filter:blur(2px) drop-shadow(0 0 0 transparent);mask-image:linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,0) 65%);animation:sailAcrossRef 20s ease-in-out 3.6s forwards;}
@keyframes sailAcross{0%{transform:translateX(0) translateY(0);opacity:0}6%{opacity:.96}50%{transform:translateX(-55vw) translateY(-.5vmin)}74%{transform:translateX(-83vw) translateY(.5vmin)}100%{transform:translateX(-120vw) translateY(0);opacity:.92}}
@keyframes sailAcrossRef{0%{transform:scaleY(-1) translateY(-6vmin) translateX(0);opacity:0}6%{opacity:.28}50%{transform:scaleY(-1) translateY(-6vmin) translateX(-55vw)}74%{transform:scaleY(-1) translateY(-6vmin) translateX(-83vw)}100%{transform:scaleY(-1) translateY(-6vmin) translateX(-120vw);opacity:.18}}
.boat.bob{animation:bob 3.6s ease-in-out infinite;}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}

.spotlight{position:absolute;right:8vmin;bottom:6.5vmin;width:38vmin;height:13vmin;background:conic-gradient(from 200deg at 0% 50%, var(--light), rgba(255,213,74,.55) 25%, rgba(255,213,74,.22) 45%, var(--spotlight-fade) 60%);clip-path:polygon(0% 42%, 100% 0%, 100% 100%);opacity:.28;filter:blur(1px);transform-origin:right center;mix-blend-mode:screen;animation:sweep 5.6s ease-in-out infinite alternate 5s;}
@keyframes sweep{0%{transform:rotate(-7deg)}100%{transform:rotate(-2deg)}}

.banner{position:absolute;z-index:7;right:-62vw;top:12vh;display:inline-flex;flex-direction:column;gap:.25em;color:var(--ink);text-decoration:none;font-weight:800;letter-spacing:.03em;background:linear-gradient(180deg, rgba(0,0,0,.66), rgba(0,0,0,.52));border:1px solid rgba(255,255,255,.15);padding:1.05rem 1.2rem;border-radius:12px;box-shadow:0 14px 34px rgba(0,0,0,.38), inset 0 0 0 1px rgba(255,255,255,.06);transform:translateX(0);opacity:0;pointer-events:auto;animation:pullIn 11s cubic-bezier(.18,.9,.15,1) 5.1s forwards;}
.banner span:first-child{font-size:clamp(20px,3.4vmin,38px);opacity:.98}
.banner span:last-child{font-size:clamp(14px,2.2vmin,22px);opacity:.88;font-weight:700}
.banner:hover{background:linear-gradient(180deg, rgba(0,0,0,.7), rgba(0,0,0,.56));border-color:rgba(255,255,255,.22);transform:translateY(-1px)}
@keyframes pullIn{0%{opacity:0;right:-62vw}25%{opacity:1}65%{right:12vw}100%{right:50%;transform:translateX(50%)}}

.porthole{fill:var(--light);opacity:.92}
.glow{filter:drop-shadow(0 0 6px rgba(255,213,74,.9)) drop-shadow(0 0 14px rgba(255,213,74,.55))}

.skip{position:absolute;right:14px;bottom:14px;z-index:50;cursor:pointer;appearance:none;background:rgba(0,0,0,.55);color:var(--ink);border:1px solid rgba(255,255,255,.24);border-radius:10px;padding:.55rem .85rem;font-size:14px;letter-spacing:.02em;transition:background .25s,border-color .25s,transform .2s;pointer-events:auto;}
.skip:hover{background:rgba(0,0,0,.72);border-color:rgba(255,255,255,.36);transform:translateY(-1px)}

@media (prefers-reduced-motion: reduce){
  .sun,.water,.ocean,.boat,.boat-reflection,.banner,.spotlight{animation:none !important}
  .dwms-stage::after{opacity:.75}
  .water{height:42vh}
  .boat{opacity:.96;transform:translateX(-55vw)}
  .banner{right:50%;transform:translateX(50%);opacity:1}
}
`;

  /* ===== HTML =====
     Note: we REMOVED the old .waves structure
     and added an <svg class="ocean"> with layered paths. */
  var HTML = `
<div class="dwms-stage" id="dwmsStage" aria-label="Dark waves fill the screen at dusk; a boat with warm lights crosses and reveals a banner reading Running Dark – Launching Soon.">
  <div class="sky" aria-hidden="true"></div>
  <div class="sun" aria-hidden="true"></div>

  <div class="water" id="water">
    <svg class="ocean" viewBox="0 0 2400 400" preserveAspectRatio="none" aria-hidden="true">
      <!-- back layer -->
      <g class="layer back">
        <path fill="var(--wave1)" d="M0 260
          Q150 220 300 260 T600 260 T900 260 T1200 260 T1500 260 T1800 260 T2100 260 T2400 260
          L2400 400 L0 400 Z"/>
      </g>
      <!-- mid layer -->
      <g class="layer mid">
        <path fill="var(--wave2)" d="M0 240
          Q150 205 300 240 T600 240 T900 240 T1200 240 T1500 240 T1800 240 T2100 240 T2400 240
          L2400 400 L0 400 Z"/>
      </g>
      <!-- top layer -->
      <g class="layer top">
        <path fill="var(--wave3)" d="M0 222
          Q150 198 300 222 T600 222 T900 222 T1200 222 T1500 222 T1800 222 T2100 222 T2400 222
          L2400 400 L0 400 Z"/>
      </g>
      <!-- foam crest -->
      <g class="foam">
        <path fill="#ffffff" d="M0 218
          Q150 196 300 218 T600 218 T900 218 T1200 218 T1500 218 T1800 218 T2100 218 T2400 218
          L2400 230 L0 230 Z"/>
      </g>
    </svg>
  </div>

  <!-- Boat silhouette -->
  <svg class="boat bob" viewBox="0 0 220 130" aria-label="Boat silhouette with warm lights">
    <path d="M10 90 L190 90 L165 110 L35 110 Z" fill="var(--boat-dark)"/>
    <rect x="120" y="58" width="36" height="24" rx="2" fill="var(--boat-mid)"/>
    <rect x="96" y="32" width="4" height="40" fill="var(--boat-mid)"/>
    <path d="M100 72 C110 58, 130 52, 146 54 L146 72 Z" fill="var(--boat-mid)" opacity=".9"/>
    <g class="glow">
      <circle class="porthole" cx="56" cy="98" r="3"/><circle class="porthole" cx="72" cy="98" r="3"/>
      <circle class="porthole" cx="88" cy="98" r="3"/><circle class="porthole" cx="104" cy="98" r="3"/>
    </g>
    <circle class="glow" cx="152" cy="68" r="3" fill="var(--light)"/>
  </svg>

  <!-- Reflection -->
  <svg class="boat-reflection" viewBox="0 0 220 130" aria-hidden="true">
    <path d="M10 90 L190 90 L165 110 L35 110 Z" fill="var(--boat-dark)" opacity=".22"/>
    <rect x="120" y="58" width="36" height="24" rx="2" fill="var(--boat-mid)" opacity=".18"/>
    <rect x="96" y="32" width="4" height="40" fill="var(--boat-mid)" opacity=".18"/>
    <path d="M100 72 C110 58, 130 52, 146 54 L146 72 Z" fill="var(--boat-mid)" opacity=".16"/>
    <g opacity=".2"><circle cx="56" cy="98" r="3" fill="var(--light)"/><circle cx="72" cy="98" r="3" fill="var(--light)"/><circle cx="88" cy="98" r="3" fill="var(--light)"/><circle cx="104" cy="98" r="3" fill="var(--light)"/></g>
  </svg>

  <div class="spotlight" aria-hidden="true"></div>

  <a class="banner" id="dwmsBanner" href="#" aria-label="Go to Carlos">
    <span>Running Dark</span>
    <span>Launching Soon</span>
  </a>

  <button class="skip" id="dwmsSkip" aria-label="Skip animation or enter">Enter →</button>
</div>
`;

  /* ===== helpers & wiring ===== */
  function injectCSSOnce(css){
    if (document.getElementById('__dwms_css__')) return;
    var s = document.createElement('style'); s.id='__dwms_css__'; s.textContent = css; document.head.appendChild(s);
  }
  function injectStageOnce(html){
    var stage = document.getElementById('dwmsStage');
    if (stage) return stage;
    var wrap = document.createElement('div'); wrap.innerHTML = html;
    stage = wrap.firstElementChild; document.body.appendChild(stage);
    return stage;
  }
  function qs(root, sel){ return (root || document).querySelector(sel); }

  function wire(stage, cfg){
    var opts = Object.assign({}, DEFAULTS, cfg||{});
    var banner = qs(stage, '#dwmsBanner');
    var skip   = qs(stage, '#dwmsSkip');
    var boat   = qs(stage, '.boat');
    var boatRef= qs(stage, '.boat-reflection');
    var water  = qs(stage, '#water');

    if (banner) banner.setAttribute('href', opts.targetLink);

    if (skip){
      skip.addEventListener('click', function(){
        if (opts.skipBehavior === 'link') window.location.href = opts.targetLink;
        else stage.parentNode && stage.parentNode.removeChild(stage);
      });
    }
    if (water){ water.addEventListener('animationend', function(){ stage.classList.add('dusk'); }, { once:true }); }

    var onSailEnd = function(){
      if (opts.autoRedirect){ setTimeout(function(){ window.location.href = opts.targetLink; }, opts.autoRedirectDelay); }
      else if (banner){ banner.style.right='50%'; banner.style.transform='translateX(50%)'; banner.style.opacity='1'; }
    };
    if (boat)    boat.addEventListener('animationend', onSailEnd, { once:true });
    if (boatRef) boatRef.addEventListener('animationend', function(){}, { once:true });

    setTimeout(function(){
      if (banner && getComputedStyle(banner).opacity === '0'){
        stage.classList.add('dusk'); banner.style.right='50%'; banner.style.transform='translateX(50%)'; banner.style.opacity='1';
      }
    }, 7000);
  }

  window.DWMSHero = { init: function(cfg){ injectCSSOnce(CSS); var stage = injectStageOnce(HTML); wire(stage, cfg); } };

  if (!window.__DWMS_BOOTED__){
    window.__DWMS_BOOTED__ = true;
    (document.readyState === 'loading')
      ? document.addEventListener('DOMContentLoaded', function(){ window.DWMSHero.init({}); })
      : window.DWMSHero.init({});
  }
})();
