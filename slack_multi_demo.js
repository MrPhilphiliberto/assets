// slack_multi_demo.js
(function () {
  // Simple DOM ready, works well in Carrd
  function ready(fn) {
    /in/.test(document.readyState) ? setTimeout(function () { ready(fn); }, 9) : fn();
  }

  ready(function () {
    // Avatar for Carlos
    const ASSETS = {
      carlosAvatar:
        "https://raw.githubusercontent.com/MrPhilphiliberto/assets/refs/heads/main/ChatGPT%20Image%20Jul%2028%2C%202025%2C%2005_10_59%20PM.png"
    };

    // Modes <-> demo keys
    const MODES = [
      { id: "descriptor", labelMain: "Performance Analytics", labelSub: "Descriptor" },
      { id: "explainer",  labelMain: "Driver Identification", labelSub: "Explainer" },
      { id: "forecaster", labelMain: "Advanced Forecasting",  labelSub: "Forecaster" },
      { id: "snippet",    labelMain: "Bespoke Workflows",     labelSub: "Snippet Runner" },
      { id: "thought",    labelMain: "Thought Development",   labelSub: "Conversation" }
    ];

    // Where per-tool demo files should register their scenarios
    const REGISTRY = window.DWMS_DEMO_REGISTRY || {};

    const MESSAGE_DELAY = 2600;      // between messages within a scenario
    const SCENARIO_END_HOLD = 14000; // hold before auto-switch to next mode

    const mounts = document.querySelectorAll(".slack-demo");
    if (!mounts.length) return;

    mounts.forEach(function (mount) {
      // --- State per mount ---
      let autoplayOn = true;
      let modeIndex = 0;
      let currentScenario = null;
      let msgIndex = 0;
      let timer = null;
      let started = false;

      let replyCount = 0;
      let dividerEl = null;
      let dividerLabelEl = null;

      // -----------------------------
      // Build wrapper + mode tabs
      // -----------------------------
      function buildModeBar(wrapper) {
        const bar = document.createElement("div");
        bar.className = "sd-mode-bar";

        const list = document.createElement("div");
        list.className = "sd-tab-list";

        MODES.forEach(function (mode, idx) {
          const tab = document.createElement("button");
          tab.type = "button";
          tab.className = "sd-tab" + (idx === modeIndex ? " active" : "");
          tab.setAttribute("data-mode-id", mode.id);

          const main = document.createElement("span");
          main.className = "sd-tab-label-main";
          main.textContent = mode.labelMain;

          const sub = document.createElement("span");
          sub.className = "sd-tab-label-sub";
          sub.textContent = mode.labelSub;

          tab.appendChild(main);
          tab.appendChild(sub);

          tab.addEventListener("click", function () {
            switchMode(idx, true);
          });

          list.appendChild(tab);
        });

        const right = document.createElement("div");
        right.className = "sd-mode-right";

        const lab = document.createElement("span");
        lab.className = "sd-autoplay-label";
        lab.textContent = "Autoplay";

        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "sd-autoplay-toggle on";
        toggle.setAttribute("aria-pressed", "true");

        const knob = document.createElement("span");
        knob.className = "sd-autoplay-toggle-knob";
        toggle.appendChild(knob);

        toggle.addEventListener("click", function () {
          autoplayOn = !autoplayOn;
          if (autoplayOn) {
            toggle.classList.add("on");
            toggle.setAttribute("aria-pressed", "true");
          } else {
            toggle.classList.remove("on");
            toggle.setAttribute("aria-pressed", "false");
          }
        });

        right.appendChild(lab);
        right.appendChild(toggle);

        bar.appendChild(list);
        bar.appendChild(right);

        wrapper.appendChild(bar);
      }

      // Wrap .slack-demo with .dwms-slack-wrap and inject the mode bar
      (function wrapAndChrome() {
        const wrapper = document.createElement("div");
        wrapper.className = "dwms-slack-wrap";

        const parent = mount.parentNode;
        if (parent) {
          parent.insertBefore(wrapper, mount);
          wrapper.appendChild(mount);
        }

        // Insert mode tabs above the Slack box
        wrapper.insertBefore(mount, null); // ensure Slack box is last child
        buildModeBar(wrapper);

        // Now build the Slack chrome inside the .slack-demo
        mount.innerHTML = [
          '<div class="sd-sidebar">',
          '  <div class="sd-org">🪐</div>',
          '  <div class="sd-nav">',
          '    <h4>Channels</h4>',
          '    <div class="sd-item active"><span class="sd-ic"></span><span class="sd-chan-label">#carlos</span></div>',
          '    <div class="sd-item"><span class="sd-ic"></span><span>#all-dark-wave</span></div>',
          '    <h4>Apps</h4>',
          '    <div class="sd-item"><span class="sd-ic"></span><span>Slackbot</span></div>',
          '    <div class="sd-item"><span class="sd-ic"></span><span>Carlos – Dark Wave</span></div>',
          '  </div>',
          '</div>',
          '<div class="sd-header">',
          '  <div class="sd-dots"><span class="sd-dot"></span><span class="sd-dot"></span><span class="sd-dot"></span></div>',
          '  <span class="sd-header-title">#carlos • Dark Wave Marketing Science</span>',
          '</div>',
          '<div class="sd-body">',
          '  <div class="sd-scroll"></div>',
          '  <button class="jump-bottom" title="Jump to latest" aria-label="Jump to latest">',
          '    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">',
          '      <path fill-rule="evenodd" d="M1.5 5.5l6 6 6-6H1.5z"/>',
          '    </svg>',
          '  </button>',
          '</div>'
        ].join("");

        // Expose some refs for the rest of the logic
      })();

      const scroll = mount.querySelector(".sd-scroll");
      const jump = mount.querySelector(".jump-bottom");
      const chanLabel = mount.querySelector(".sd-chan-label");
      const headerTitle = mount.querySelector(".sd-header-title");

      if (!scroll || !jump || !chanLabel || !headerTitle) return;

      // -----------------------------
      // Chrome helpers
      // -----------------------------
      function setChannelUI(channel) {
        chanLabel.textContent = channel || "#carlos";
        headerTitle.textContent = (channel || "#carlos") + " • Dark Wave Marketing Science";
      }

      function isAtBottom() {
        return scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight) < 24;
      }
      function updateJump() {
        if (isAtBottom()) {
          jump.classList.remove("show");
        } else {
          jump.classList.add("show");
        }
      }
      function smoothToBottom() {
        const start = scroll.scrollTop;
        const end = scroll.scrollHeight - scroll.clientHeight;
        const dur = 600;
        const t0 = performance.now();
        function anim(t) {
          const p = Math.min((t - t0) / dur, 1);
          scroll.scrollTop = start + (end - start) * p;
          if (p < 1) requestAnimationFrame(anim);
          else updateJump();
        }
        requestAnimationFrame(anim);
      }
      jump.addEventListener("click", smoothToBottom);
      scroll.addEventListener("scroll", updateJump);

      // Thread divider
      function resetThread() {
        replyCount = 0;
        dividerEl = null;
        dividerLabelEl = null;
      }
      function ensureDivider() {
        if (dividerEl) return;
        dividerEl = document.createElement("div");
        dividerEl.className = "thread-break";
        dividerLabelEl = document.createElement("div");
        dividerLabelEl.className = "reply-count";
        dividerLabelEl.textContent = "1 reply";
        const line = document.createElement("div");
        line.className = "thread-line";
        dividerEl.appendChild(dividerLabelEl);
        dividerEl.appendChild(line);
        scroll.appendChild(dividerEl);
        updateJump();
      }
      function updateDivider() {
        if (!dividerEl || !dividerLabelEl) return;
        dividerLabelEl.textContent = replyCount === 1 ? "1 reply" : replyCount + " replies";
      }

      // Avatars and display names
      function avatar(who) {
        const el = document.createElement("div");
        el.className = "avatar";
        if (who === "carlos") {
          const img = document.createElement("img");
          img.src = ASSETS.carlosAvatar;
          img.alt = "Carlos – Dark Wave";
          el.appendChild(img);
        } else {
          const initials = (who || "?")
            .split(/\s+/)[0]
            .charAt(0)
            .toUpperCase();
          el.textContent = initials || "?";
        }
        return el;
      }

      function displayName(who) {
        if (who === "carlos") return "Carlos – Dark Wave";
        if (who === "nina") return "Nina L.";
        if (who === "diego") return "Diego M.";
        if (who === "amira") return "Amira K.";
        if (who === "elena") return "Elena R.";
        if (who === "jordan") return "Jordan B.";
        if (who === "malik") return "Malik J.";
        if (!who) return "";
        return who.charAt(0).toUpperCase() + who.slice(1);
      }

      // Add a single message row
      function addMsg(item) {
        if (!item) return;

        // Divider + counter only for Carlos messages
        if (item.from === "carlos") {
          if (!dividerEl) {
            replyCount = 1;
            ensureDivider();
            updateDivider();
          } else {
            replyCount += 1;
            updateDivider();
          }
        }

        const row = document.createElement("div");
        row.className = "msg from-" + (item.from || "user");
        row.appendChild(avatar(item.from));

        const content = document.createElement("div");
        content.className = "msg-content";

        const head = document.createElement("div");
        head.className = "head";

        const nm = document.createElement("span");
        nm.className = "name";
        nm.textContent = displayName(item.from);
        head.appendChild(nm);

        if (item.from === "carlos") {
          const app = document.createElement("span");
          app.className = "app-badge";
          app.textContent = "APP";
          head.appendChild(app);
        }

        const meta = document.createElement("span");
        meta.className = "meta";
        meta.textContent = item.ts || "";
        head.appendChild(meta);

        const p = document.createElement("p");
        p.className = "body-text";
        p.innerHTML = item.text || "";

        content.appendChild(head);
        content.appendChild(p);

        if (item.attachments && item.attachments.length) {
          item.attachments.forEach(function (a) {
            const card = document.createElement("div");
            card.className = "attach";
            const img = document.createElement("img");
            img.loading = "lazy";
            img.src = a.url;
            img.alt = a.caption || "Attachment";
            const cap = document.createElement("div");
            cap.className = "attach-cap";
            cap.textContent = a.caption || "";
            card.appendChild(img);
            card.appendChild(cap);
            content.appendChild(card);
          });
        }

        row.appendChild(content);
        scroll.appendChild(row);
        requestAnimationFrame(function () { row.classList.add("show"); });
        updateJump();
      }

      // -----------------------------
      // Playback logic
      // -----------------------------
      function clearTimer() {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      }

      function playNextMessage() {
        if (!currentScenario || !currentScenario.script || !currentScenario.script.length) return;

        if (msgIndex >= currentScenario.script.length) {
          // end of this scenario
          if (!autoplayOn) return;
          timer = setTimeout(function () {
            const nextIndex = (modeIndex + 1) % MODES.length;
            switchMode(nextIndex, false);
          }, SCENARIO_END_HOLD);
          return;
        }

        addMsg(currentScenario.script[msgIndex++]);
        timer = setTimeout(playNextMessage, MESSAGE_DELAY);
      }

      function switchMode(newIndex, fromClick) {
        clearTimer();
        modeIndex = newIndex;
        msgIndex = 0;
        scroll.innerHTML = "";
        resetThread();

        // Update active tab
        const wrapper = mount.closest(".dwms-slack-wrap");
        if (wrapper) {
          const tabs = wrapper.querySelectorAll(".sd-tab");
          tabs.forEach(function (tab, idx) {
            tab.classList.toggle("active", idx === modeIndex);
          });
        }

        const mode = MODES[modeIndex];
        const scenario = REGISTRY[mode.id];

        if (!scenario || !scenario.script || !scenario.script.length) {
          currentScenario = null;
          return;
        }

        currentScenario = scenario;
        setChannelUI(scenario.channel || "#carlos");
        playNextMessage();
      }

      function begin() {
        if (started) return;
        started = true;
        switchMode(modeIndex, false);
      }

      // Start when visible
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting && e.intersectionRatio >= 0.35) {
                begin();
                io.disconnect();
              }
            });
          },
          { threshold: [0, 0.2, 0.35, 0.6, 1] }
        );
        io.observe(mount);
      } else {
        setTimeout(begin, 1000);
      }
    });
  });
})();
