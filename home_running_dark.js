<!-- Dark Wave Marketing Science – Animated HTML5 Hero for Carrd Pro Plus -->
<!-- Paste this into a Carrd Embed (Code) element set to Fullscreen. -->
<!-- Set your target link below (CARLOS_URL). No external assets required. -->
<style>
  :root {
    --navy: #011833;
    --charcoal: #1a1f23;
    --ink: #f2f5f7;
    --wave1: #0a1e2a;   /* deepest */
    --wave2: #0d2735;   /* mid */
    --wave3: #103041;   /* top */
    --boat-dark: #0b0d10;     /* hull + silhouette */
    --boat-mid:  #20252b;     /* minor details */
    --light: #ffd54a;         /* port holes + spotlight */
    --spotlight-fade: rgba(255, 213, 74, 0);
  }

  /* Stage fills the Embed area (ideally fullscreen). */
  .dwms-stage {
    position: fixed; /* overlay the entire page above your existing hero */
    inset: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: transparent; /* Let your Carrd page background show through */
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif;
    color: var(--ink);
    pointer-events: none; /* disable clicks to page while overlay is up */
  }

  /* Subtle dusk overlay that fades in as the sun sets */
  .dwms-stage::after {
    content: "";
    position: absolute; inset: 0;
    pointer-events: none;
    background: radial-gradient(120vw 80vh at 80% 0%, rgba(0,0,0,0) 0%, rgba(0,0,0,.25) 40%, rgba(0,0,0,.55) 100%);
    opacity: 0; /* will fade to .9 via sun-set animation */
    transition: opacity 2s ease-out;
  }
  .dwms-stage.dusk::after { opacity: .9; }

  /* Sky layer (for the sun). Keep it transparent by default. */
  .sky {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0));
    z-index: 1;
  }

  /* Sun: small disc that moves down and dims */
  .sun {
    position: absolute; top: 6vh; right: 10vw; z-index: 2;
    width: 9vmin; height: 9vmin;
    filter: blur(.6px) drop-shadow(0 0 18px rgba(255, 244, 200, .25));
    opacity: .85;
    animation: sunSet 10s ease-in forwards 1.25s; /* wait a beat, then set */
  }
  @keyframes sunSet {
    0%   { transform: translateY(0); opacity: .85; }
    70%  { transform: translateY(22vh); opacity: .35; }
    100% { transform: translateY(26vh); opacity: .0; }
  }

  /* Water container: rises like filling a cup and gently sways */
  .water {
    position: absolute; left: 0; right: 0; bottom: 0;
    height: 0vh; /* starts empty */
    z-index: 4;
    overflow: hidden;
    background: linear-gradient(180deg, rgba(1, 24, 51, .88), rgba(1, 10, 20, .96)); /* darkens page as it fills */
    animation: fillUp 6s ease-in forwards 0.75s; /* start soon after load */
  }
  @keyframes fillUp {
    0%   { height: 0vh; }
    100% { height: 40vh; } /* stop at ~40% of the frame */
  }

  /* Waves (3 layers for depth). Each layer sways horizontally while water bobs slightly */
  .waves {
    position: absolute; left: 0; bottom: -2vh; right: 0; height: 52vh; /* extra height to hide seam */
    transform: translateY(6px);
    animation: bob 4.2s ease-in-out infinite;
  }
  @keyframes bob {
    0%,100% { transform: translateY(6px); }
    50%     { transform: translateY(0px); }
  }

  .wave {
    position: absolute; left: -25%; width: 150%; height: 22vh;
    opacity: .9;
    background-repeat: repeat-x;
    background-size: 1200px 100%;
    mask-image: linear-gradient(to top, rgba(0,0,0,1) 55%, rgba(0,0,0,.1) 100%);
  }
  .wave.w1 { bottom: 2vh;  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200"><path fill="%230a1e2a" d="M0 120c60 0 120-40 240-40s180 40 300 40 180-40 300-40 180 40 360 40v80H0z"/></svg>');
              animation: sway1 7s ease-in-out infinite; filter: brightness(1); }
  .wave.w2 { bottom: 6vh;  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200"><path fill="%230d2735" d="M0 120c80 0 160-30 240-30s160 30 240 30 160-30 240-30 160 30 240 30 160-30 240-30v110H0z"/></svg>');
              animation: sway2 9s ease-in-out infinite; filter: brightness(1.05); opacity:.95; }
  .wave.w3 { bottom: 10vh; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200"><path fill="%23103041" d="M0 120c90 0 180-25 270-25s180 25 270 25 180-25 270-25 180 25 270 25 180-25 270-25v130H0z"/></svg>');
              animation: sway3 12s ease-in-out infinite; filter: brightness(1.1); opacity:.98; }

  @keyframes sway1 { 0%,100% { transform: translateX(0); } 50% { transform: translateX(30px); } }
  @keyframes sway2 { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-35px); } }
  @keyframes sway3 { 0%,100% { transform: translateX(0); } 50% { transform: translateX(45px); } }

  /* Boat silhouette – sails right -> left across the scene once water is filled */
  .boat {
    position: absolute; z-index: 6;
    bottom: calc(40vh - 4.5vmin); /* sit on the water line as it finishes filling */
    right: -30vmin; width: 28vmin; height: 16vmin;
    opacity: 0; /* fade in as it starts moving */
    animation: sailAcross 18s ease-in-out 3.8s forwards;
    filter: drop-shadow(0 6px 6px rgba(0,0,0,.5));
  }
  @keyframes sailAcross {
    0%   { transform: translateX(0) translateY(0); opacity: 0; }
    5%   { opacity: .95; }
    50%  { transform: translateX(-55vw) translateY(-0.6vmin); }
    70%  { transform: translateX(-78vw) translateY(0.6vmin); }
    100% { transform: translateX(-115vw) translateY(0); opacity: .9; }
  }
  .boat .bob { animation: bob 3.6s ease-in-out infinite; }

  /* Spotlight – a cone with gradient fade */
  .spotlight {
    position: absolute; right: 8vmin; bottom: 6.5vmin; width: 34vmin; height: 12vmin;
    background: conic-gradient(from 200deg at 0% 50%, var(--light), rgba(255,213,74,.55) 25%, rgba(255,213,74,.25) 45%, var(--spotlight-fade) 60%);
    clip-path: polygon(0% 42%, 100% 0%, 100% 100%);
    opacity: .28; filter: blur(1px);
    transform-origin: right center; transform: rotate(-5deg);
    mix-blend-mode: screen;
  }

  /* Banner text that is "pulled" into frame */
  .banner {
    position: absolute; z-index: 7; right: -60vw; top: 12vh;
    display: inline-flex; flex-direction: column; gap: .3em;
    font-weight: 700; letter-spacing: .04em; text-decoration: none;
    color: var(--ink);
    background: rgba(0,0,0,.6); border: 1px solid rgba(255,255,255,.15);
    padding: 1.1rem 1.25rem; border-radius: 10px;
    box-shadow: 0 12px 30px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.06);
    transform: translateX(0);
    opacity: 0;
    animation: pullIn 10.5s ease-in-out 5.2s forwards; /* synced after boat starts */
    pointer-events: auto; /* clickable even while overlay blocks background */
  }
  .banner span:first-child { font-size: clamp(18px, 3.2vmin, 36px); opacity: .96; }
  .banner span:last-child  { font-size: clamp(14px, 2.2vmin, 22px); opacity: .85; font-weight: 600; }
  .banner:hover { background: rgba(0,0,0,.68); border-color: rgba(255,255,255,.22); }

  @keyframes pullIn {
    0%   { opacity: 0; transform: translateX(0); right: -60vw; }
    30%  { opacity: 1; }
    60%  { right: 10vw; }
    100% { right: 50%; transform: translateX(50%); }
  }

  /* Porthole glow */
  .porthole { fill: var(--light); opacity: .92; }
  .glow { filter: drop-shadow(0 0 6px rgba(255, 213, 74, .9)) drop-shadow(0 0 14px rgba(255, 213, 74, .55)); }

  /* Skip/Enter link */
  .skip {
    position: absolute; right: 14px; bottom: 14px; z-index: 50;
    appearance: none; border: 1px solid rgba(255,255,255,.24); background: rgba(0,0,0,.55);
    color: var(--ink); padding: .55rem .8rem; border-radius: 8px; cursor: pointer;
    font-size: 14px; letter-spacing: .02em;
    transition: background .25s ease, border-color .25s ease, transform .2s;
    pointer-events: auto; /* keep the skip button clickable */
  }
  .skip:hover { background: rgba(0,0,0,.7); border-color: rgba(255,255,255,.35); transform: translateY(-1px); }

  /* Reduced motion: freeze animations, show banner centered immediately */
  @media (prefers-reduced-motion: reduce) {
    .sun, .water, .waves, .wave, .boat, .banner { animation: none !important; }
    .dwms-stage::after { opacity: .75; }
    .water { height: 40vh; }
    .boat { opacity: .95; transform: translateX(-55vw); }
    .banner { right: 50%; transform: translateX(50%); opacity: 1; }
  }
</style>

<div class="dwms-stage" id="dwmsStage" aria-label="Dark waves fill the screen at dusk; a boat passes with lights aglow pulling in a banner that reads Running Dark – Launching Soon.">
  <div class="sky" aria-hidden="true"></div>
  <svg class="sun" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="50" fill="rgba(255, 240, 200, .9)"/></svg>

  <div class="water" id="water">
    <div class="waves">
      <div class="wave w1" aria-hidden="true"></div>
      <div class="wave w2" aria-hidden="true"></div>
      <div class="wave w3" aria-hidden="true"></div>
    </div>
  </div>

  <!-- Boat silhouette (grouped shapes) -->
  <svg class="boat bob" viewBox="0 0 220 130" aria-label="Boat silhouette with warm lights">
    <!-- Hull -->
    <path d="M10 90 L190 90 L165 110 L35 110 Z" fill="var(--boat-dark)" />
    <!-- Cabin / wheelhouse -->
    <rect x="120" y="58" width="36" height="24" rx="2" fill="var(--boat-mid)" />
    <!-- Mast -->
    <rect x="96" y="32" width="4" height="40" fill="var(--boat-mid)" />
    <!-- Sail (furled-ish) -->
    <path d="M100 72 C110 58, 130 52, 146 54 L146 72 Z" fill="var(--boat-mid)" opacity=".9" />

    <!-- Portholes -->
    <g class="glow">
      <circle class="porthole" cx="56" cy="98" r="3" />
      <circle class="porthole" cx="72" cy="98" r="3" />
      <circle class="porthole" cx="88" cy="98" r="3" />
      <circle class="porthole" cx="104" cy="98" r="3" />
    </g>

    <!-- Wheelhouse light (subtle) -->
    <circle class="glow" cx="152" cy="68" r="3" fill="var(--light)" />
  </svg>

  <!-- Spotlight sweeping forward from wheelhouse area -->
  <div class="spotlight" aria-hidden="true"></div>

  <!-- Banner CTA (clickable) -->
  <a class="banner" id="dwmsBanner" href="#" aria-label="Go to Carlos">
    <span>Running Dark</span>
    <span>Launching Soon</span>
  </a>

  <!-- Skip / Enter control -->
  <button class="skip" id="dwmsSkip" aria-label="Skip animation or enter">Enter →</button>
</div>

<script>
  (function(){
    // === Configuration ===
    var CARLOS_URL = "https://carlos.darkwavemarketing.science"; // <- Set your destination
    var AUTO_REDIRECT = false;  // if true, auto-nav when boat leaves
    var AUTO_REDIRECT_DELAY = 900; // ms after boat exits
    var SKIP_BEHAVIOR = "hide"; // "hide" to reveal page beneath; "link" to go to CARLOS_URL // ms after boat exits

    // Elements
    var stage = document.getElementById('dwmsStage');
    var banner = document.getElementById('dwmsBanner');
    var skip   = document.getElementById('dwmsSkip');
    var sun    = document.querySelector('.sun');
    var boat   = document.querySelector('.boat');

    // Link targets
    banner.setAttribute('href', CARLOS_URL);
    // Skip behavior: either hide overlay to reveal your original page or link out
    skip.addEventListener('click', function(){
      if (SKIP_BEHAVIOR === 'link') {
        window.location.href = CARLOS_URL;
      } else {
        stage.parentNode && stage.parentNode.removeChild(stage);
      }
    });

    // Deepen dusk overlay once water fill completes (feels like sunset as water rises)
    var water = document.getElementById('water');
    water.addEventListener('animationend', function(){ stage.classList.add('dusk'); }, { once: true }); }, { once: true });

    // When the boat completes its sail, optionally auto-redirect; otherwise ensure CTA is visible
    boat.addEventListener('animationend', function(){
      if (AUTO_REDIRECT) {
        setTimeout(function(){ window.location.href = CARLOS_URL; }, AUTO_REDIRECT_DELAY);
      } else {
        // Ensure banner remains fully visible + clickable if user missed it in motion
        banner.style.right = '50%';
        banner.style.transform = 'translateX(50%)';
        banner.style.opacity = '1';
      }
    }, { once: true });

    // Resilience: if something blocks animations, show a usable state after a timeout
    setTimeout(function(){
      var computed = getComputedStyle(banner);
      if (computed.opacity === '0') {
        stage.classList.add('dusk');
        banner.style.right = '50%';
        banner.style.transform = 'translateX(50%)';
        banner.style.opacity = '1';
      }
    }, 7000);
  })();
</script>
