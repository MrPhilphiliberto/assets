/*! Dark Wave Marketing Science – Animated HTML5 Hero (Refined) */
(function(){
  'use strict';

  var DEFAULTS = {
    targetLink: "https://carlos.darkwavemarketing.science",
    skipBehavior: "hide",   // "hide" or "link"
    autoRedirect: false,
    autoRedirectDelay: 900,
    htmlUrl: null           // override or use <script data-html="...">
  };

  function qs(root, sel){ return (root || document).querySelector(sel); }

  function ensureStageInserted(opts){
    // Already present?
    var stage = qs(document, '#dwmsStage');
    if (stage) return Promise.resolve(stage);

    // Determine HTML URL
    var script = (function(){
      var scripts = document.getElementsByTagName('script');
      for (var i=scripts.length-1; i>=0; i--) {
        if (scripts[i].src && scripts[i].src.indexOf('home_running_dark.js') !== -1) return scripts[i];
      }
      return null;
    })();

    var htmlUrl = (opts && opts.htmlUrl) || (script && script.dataset && script.dataset.html);

    // Fallback minimal template (valid DOM, not just text)
    var injectFallback = function(){
      var wrapper = document.createElement('div');
      wrapper.innerHTML =
        '<div class="dwms-stage" id="dwmsStage">' +
          '<div class="sky"></div>' +
          '<div class="sun"></div>' +
          '<div class="water" id="water">' +
            '<div class="waves">' +
              '<div class="wave w1"></div>' +
              '<div class="wave w2"></div>' +
              '<div class="wave w3"></div>' +
            '</div>' +
          '</div>' +
          '<svg class="boat bob" viewBox="0 0 220 130">' +
            '<path d="M10 90 L190 90 L165 110 L35 110 Z" fill="var(--boat-dark)"></path>' +
            '<rect x="120" y="58" width="36" height="24" rx="2" fill="var(--boat-mid)"></rect>' +
            '<rect x="96" y="32" width="4" height="40" fill="var(--boat-mid)"></rect>' +
            '<path d="M100 72 C110 58, 130 52, 146 54 L146 72 Z" fill="var(--boat-mid)" opacity=".9"></path>' +
          '</svg>' +
          '<svg class="boat-reflection" viewBox="0 0 220 130" aria-hidden="true">' +
            '<path d="M10 90 L190 90 L165 110 L35 110 Z" fill="var(--boat-dark)" opacity=".22"></path>' +
          '</svg>' +
          '<div class="spotlight"></div>' +
          '<a class="banner" id="dwmsBanner" href="#"><span>Running Dark</span><span>Launching Soon</span></a>' +
          '<button class="skip" id="dwmsSkip">Enter →</button>' +
        '</div>';
      var node = wrapper.firstElementChild;
      document.body.appendChild(node);
      return node;
    };

    if (!htmlUrl){
      return Promise.resolve(injectFallback());
    }

    // Fetch external HTML and inject
    return fetch(htmlUrl, { credentials: 'omit' })
      .then(function(res){ return res.text(); })
      .then(function(html){
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        var node = wrapper.firstElementChild;
        if (!node) throw new Error('HTML file empty.');
        document.body.appendChild(node);
        return node;
      })
      .catch(function(err){
        console.error('[DWMSHero] Failed to fetch HTML, falling back:', err);
        return injectFallback();
      });
  }

  function wire(stage, cfg){
    var banner = qs(stage, '#dwmsBanner');
    var skip   = qs(stage, '#dwmsSkip');
    var boat   = qs(stage, '.boat');
    var boatRef= qs(stage, '.boat-reflection');
    var water  = qs(stage, '#water');

    if (banner) banner.setAttribute('href', cfg.targetLink || DEFAULTS.targetLink);

    if (skip){
      skip.addEventListener('click', function(){
        if ((cfg.skipBehavior || DEFAULTS.skipBehavior) === 'link') {
          window.location.href = cfg.targetLink || DEFAULTS.targetLink;
        } else {
          stage.parentNode && stage.parentNode.removeChild(stage);
        }
      });
    }

    if (water){
      water.addEventListener('animationend', function(){
        stage.classList.add('dusk');
      }, { once:true });
    }

    var onSailEnd = function(){
      if (cfg.autoRedirect || DEFAULTS.autoRedirect){
        setTimeout(function(){
          window.location.href = cfg.targetLink || DEFAULTS.targetLink;
        }, cfg.autoRedirectDelay || DEFAULTS.autoRedirectDelay);
      } else if (banner){
        banner.style.right = '50%';
        banner.style.transform = 'translateX(50%)';
        banner.style.opacity = '1';
      }
    };
    if (boat)    boat.addEventListener('animationend', onSailEnd, { once:true });
    if (boatRef) boatRef.addEventListener('animationend', function(){}, { once:true });

    // Fallback if animations are blocked
    setTimeout(function(){
      if (banner && getComputedStyle(banner).opacity === '0'){
        stage.classList.add('dusk');
        banner.style.right = '50%';
        banner.style.transform = 'translateX(50%)';
        banner.style.opacity = '1';
      }
    }, 7000);
  }

  // Public API
  window.DWMSHero = {
    init: function(options){
      var cfg = Object.assign({}, DEFAULTS, options || {});
      ensureStageInserted(cfg).then(function(stage){ wire(stage, cfg); });
    }
  };

  // Auto-boot with defaults if init() not called
  document.addEventListener('DOMContentLoaded', function(){
    if (!window.__DWMS_BOOTED__) {
      window.__DWMS_BOOTED__ = true;
      window.DWMSHero.init({});
    }
  });
})();
