// slack_multi_demo.js
// Multi-scenario Slack-style simulator for Carlos – Dark Wave.
// Expects scenario files to register under either:
//   window.DWMS_DEMO_REGISTRY or window.CarlosSlackDemos

(function () {
  "use strict";

  // --- Config ---
  const MESSAGE_DELAY = 2600;        // delay between messages
  const SCENARIO_END_HOLD = 9000;    // pause at end of script
  const AUTOPLAY_INTERVAL = 14000;   // delay before auto-advancing to next demo

  // Tabs (value labels only)
  const MODES = [
    { key: "descriptor",      labelMain: "Performance Analytics" },
    { key: "explainer",       labelMain: "Driver Identification" },
    { key: "forecaster",      labelMain: "Advanced Forecasting" },
    { key: "snippet_runner",  labelMain: "Bespoke Workflows" },
    { key: "thought",         labelMain: "Thought Development" },
  ];

  // --- Helpers ---

  function getRegistry() {
    const out = {};
    if (window.CarlosSlackDemos) {
      Object.assign(out, window.CarlosSlackDemos);
    }
    if (window.DWMS_DEMO_REGISTRY) {
      Object.assign(out, window.DWMS_DEMO_REGISTRY);
    }
    return out;
  }

  // Lazy demo lookup so we always see any scenarios registered
  // by other scripts, even if they load after this file.
  function getDemos() {
    return getRegistry();
  }


  function emojiFor(name) {
    switch (name) {
      case "eyes": return "👀";
      case "hourglass_flowing_sand": return "⏳";
      case "white_check_mark": return "✅";
      default: return ":" + name + ":";
    }
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  // --- Slack shell per mount ---

  function setupMount(mountEl) {
    // Static chrome
    mountEl.innerHTML = [
      '<div class="sd-sidebar">',
      '  <div class="sd-org">🪐</div>',
      '  <div class="sd-nav">',
      '    <h4>Channels</h4>',
      '    <div class="sd-item active"><span class="sd-ic"></span><span class="sd-chan-label">#carlos</span></div>',
      '    <div class="sd-item"><span class="sd-ic"></span><span>#all-dark-wave</span></div>',
      '    <h4>Apps</h4>',
      '    <div class="sd-item"><span class="sd-ic"></span><span>Slackbot</span></div>',
      '    <div class="sd-item"><span class="sd-ic"></span><span>Carlos – Dark Wave</span></div>',
      "  </div>",
      "</div>",
      '<div class="sd-header">',
      '  <div class="sd-dots"><span class="sd-dot"></span><span class="sd-dot"></span><span class="sd-dot"></span></div>',
      '  <span class="sd-header-title">#carlos • Dark Wave Marketing Science</span>',
      "</div>",
      '<div class="sd-body">',
      '  <div class="sd-scroll"></div>',
      '  <button class="jump-bottom" title="Jump to latest" aria-label="Jump to latest">',
      '    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">',
      '      <path fill-rule="evenodd" d="M1.5 5.5l6 6 6-6H1.5z"/>',
      "    </svg>",
      "  </button>",
      "</div>",
    ].join("");

    const scroll = mountEl.querySelector(".sd-scroll");
    const jump = mountEl.querySelector(".jump-bottom");
    const chanLabel = mountEl.querySelector(".sd-chan-label");
    const headerTitle = mountEl.querySelector(".sd-header-title");

    function isAtBottom() {
      return scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight) < 24;
    }
    function updateJump() {
      if (isAtBottom()) jump.classList.remove("show");
      else jump.classList.add("show");
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

    return {
      el: mountEl,
      scroll,
      jump,
      chanLabel,
      headerTitle,
      replyCount: 0,
      dividerEl: null,
      dividerLabelEl: null,
      reactionEl: null,
      resetThread() {
        this.replyCount = 0;
        this.dividerEl = null;
        this.dividerLabelEl = null;
        this.reactionEl = null;
      },
      clear() {
        this.scroll.innerHTML = "";
        this.resetThread();
      },
      setChannel(channel) {
        if (this.chanLabel) this.chanLabel.textContent = channel;
        if (this.headerTitle) {
          this.headerTitle.textContent = channel + " • Dark Wave Marketing Science";
        }
      },
      scrollToBottom: smoothToBottom,
      updateJump,
    };
  }

  // --- File card + reactions + controls helpers ---

  function buildFileCard(file) {
    const card = document.createElement("div");
    card.className = "file-card";

    const header = document.createElement("div");
    header.className = "file-card-header";

    const icon = document.createElement("div");
    icon.className = "file-card-icon";
    icon.textContent = (file && file.name && file.name.split(".").pop() || "CSV").toUpperCase();

    const name = document.createElement("div");
    name.className = "file-card-name";
    name.textContent = file.name || "file.csv";

    header.appendChild(icon);
    header.appendChild(name);
    card.appendChild(header);

    if (file.columns && file.columns.length) {
      const table = document.createElement("div");
      table.className = "file-card-table";

      const cols = document.createElement("div");
      cols.className = "cols";
      cols.textContent = file.columns.join(" | ");
      table.appendChild(cols);

      const maxRows = Math.min(3, (file.rows && file.rows.length) || 0);
      for (let i = 0; i < maxRows; i++) {
        const r = document.createElement("div");
        r.textContent = file.rows[i].join(" | ");
        table.appendChild(r);
      }
      card.appendChild(table);
    }

    if (file.note) {
      const note = document.createElement("div");
      note.className = "file-card-note";
      note.textContent = file.note;
      card.appendChild(note);
    }

    return card;
  }

  function renderControls(container, controls) {
    if (!controls) return;
    const wrap = document.createElement("div");
    wrap.className = "sd-controls";

    if (controls.primary) {
      const btn1 = document.createElement("button");
      btn1.className = "sd-btn primary";
      btn1.type = "button";
      btn1.textContent = controls.primary;
      wrap.appendChild(btn1);
    }
    if (controls.secondary) {
      const btn2 = document.createElement("button");
      btn2.className = "sd-btn secondary";
      btn2.type = "button";
      btn2.textContent = controls.secondary;
      wrap.appendChild(btn2);
    }

    container.appendChild(wrap);
  }

  // --- Reactions (eyes → hourglass → check) ---

  function setReactionPhase(state, phaseIndex) {
    const rf = state.reaction;
    if (!rf || !rf.names || !rf.names.length) return;
    const clamped = Math.max(0, Math.min(phaseIndex, rf.names.length - 1));
    rf.phase = clamped;
    const name = rf.names[clamped];
    const emoji = emojiFor(name);

    state.mounts.forEach((m) => {
      if (!m.reactionEl) return;
      m.reactionEl.innerHTML = "";
      const pill = document.createElement("div");
      pill.className = "reaction-pill";

      const eSpan = document.createElement("span");
      eSpan.className = "emoji";
      eSpan.textContent = emoji;

      const cSpan = document.createElement("span");
      cSpan.className = "count";
      cSpan.textContent = "1";

      pill.appendChild(eSpan);
      pill.appendChild(cSpan);
      m.reactionEl.appendChild(pill);
    });
  }

  function handleReactionProgress(state, msg) {
    const rf = state.reaction;
    if (!rf || !rf.names || !rf.names.length) return;

    // First app message => "working"
    if (msg.role === "app" && (rf.phase === 0 || rf.phase === -1)) {
      if (rf.names.length > 1) setReactionPhase(state, 1);
    }

    // Summary/attachment/answer => "done"
    if (
      msg.role === "app" &&
      (msg.type === "summary" || msg.type === "attachment" || msg.type === "answer")
    ) {
      if (rf.names.length > 1) {
        setReactionPhase(state, rf.names.length - 1);
      }
    }
  }

  // --- Render a single message into a mount ---

  function renderMessageOnMount(mountState, scenario, msg, opts) {
    const scroll = mountState.scroll;

    // Thread divider based on Carlos replies
    if (msg.from === "carlos") {
      if (!mountState.dividerEl) {
        mountState.replyCount = 1;
        const div = document.createElement("div");
        div.className = "thread-break";

        const label = document.createElement("div");
        label.className = "reply-count";
        label.textContent = "1 reply";

        const line = document.createElement("div");
        line.className = "thread-line";

        div.appendChild(label);
        div.appendChild(line);
        scroll.appendChild(div);

        mountState.dividerEl = div;
        mountState.dividerLabelEl = label;
      } else {
        mountState.replyCount += 1;
        mountState.dividerLabelEl.textContent =
          mountState.replyCount === 1
            ? "1 reply"
            : mountState.replyCount + " replies";
      }
    }

    const row = document.createElement("div");
    row.className = "msg from-" + msg.from;

    // Avatar
    const avatar = document.createElement("div");
    avatar.className = "avatar";

    if (msg.from === "carlos") {
      const img = document.createElement("img");
      img.src =
        "https://raw.githubusercontent.com/MrPhilphiliberto/assets/refs/heads/main/ChatGPT%20Image%20Jul%2028%2C%202025%2C%2005_10_59%20PM.png";
      img.alt = "Carlos – Dark Wave";
      avatar.appendChild(img);
    } else {
      // initials from participants if available
      const pmap = scenario.participants || {};
      const pdata = pmap[msg.from] || {};
      const label = (pdata.displayName || msg.from || "?").trim();
      const initials = label
        .split(/\s+/)
        .map((s) => s[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      avatar.textContent = initials || "?";
    }

    row.appendChild(avatar);

    const content = document.createElement("div");
    content.className = "msg-content";

    // Header line
    const head = document.createElement("div");
    head.className = "head";

    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    if (msg.from === "carlos") {
      nameSpan.textContent = "Carlos – Dark Wave";
    } else {
      const pdata = (scenario.participants || {})[msg.from];
      nameSpan.textContent = (pdata && pdata.displayName) || msg.from;
    }
    head.appendChild(nameSpan);

    if (msg.from === "carlos") {
      const app = document.createElement("span");
      app.className = "app-badge";
      app.textContent = "APP";
      head.appendChild(app);
    }

    const meta = document.createElement("span");
    meta.className = "meta";
    meta.textContent = msg.ts || "";
    head.appendChild(meta);

    content.appendChild(head);

    // Body text
    if (msg.text) {
      const p = document.createElement("p");
      p.className = "body-text";
      p.innerHTML = msg.text;
      content.appendChild(p);
    }

    // File card on user message
    if (msg.file) {
      content.appendChild(buildFileCard(msg.file));
    }

    // Attachments (plots/images)
    if (Array.isArray(msg.attachments)) {
      msg.attachments.forEach((a) => {
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

    // Controls row (buttons)
    if (msg.controls) {
      renderControls(content, msg.controls);
    }

    // Reactions container for first user message
    if (opts && opts.isFirstUser) {
      const react = document.createElement("div");
      react.className = "msg-reactions";
      content.appendChild(react);
      mountState.reactionEl = react;
    }

    row.appendChild(content);
    scroll.appendChild(row);

    requestAnimationFrame(() => row.classList.add("show"));
    mountState.updateJump();
  }

  // --- Per-wrap orchestration ---

  function setupWrap(wrapEl) {
    const desktop = wrapEl.querySelector(".slack-demo.only-desktop");
    const mobile = wrapEl.querySelector(".slack-demo.only-mobile");
    if (!desktop && !mobile) return null;

    const mounts = [];
    if (desktop) mounts.push(setupMount(desktop));
    if (mobile) mounts.push(setupMount(mobile));


    // Determine which modes actually have demos defined
    const demosNow = getDemos();
    const modeKeys = MODES.filter((m) => demosNow[m.key]).map((m) => m.key);
    if (!modeKeys.length) return null;

    const state = {
      wrap: wrapEl,
      mounts,
      modeKeys,
      currentModeIdx: 0,
      timers: [],
      autoplayTimer: null,
      autoplayOn: true,
      started: false,
      reaction: null,
      tabEls: [],
      autoplayToggleEl: null,
    };


    // Build single mode bar for this wrap (above both desktop & mobile)
    const firstDemo = desktop || mobile;
    const modeBar = document.createElement("div");
    modeBar.className = "sd-mode-bar";

    const tabList = document.createElement("div");
    tabList.className = "sd-tab-list";

    MODES.forEach((m, idx) => {
      if (!DEMOS[m.key]) return;
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "sd-tab";
      tab.dataset.modeKey = m.key;

      const main = document.createElement("span");
      main.className = "sd-tab-label-main";
      main.textContent = m.labelMain;

      tab.appendChild(main);
      tabList.appendChild(tab);

      state.tabEls.push({ key: m.key, el: tab });

      tab.addEventListener("click", () => {
        state.autoplayOn = false; // manual switch pauses auto-advance
        updateAutoplayToggle(state);
        switchToMode(state, m.key);
      });

      if (idx === 0) {
        tab.classList.add("active");
      }
    });

    const right = document.createElement("div");
    right.className = "sd-mode-right";

    // Play / pause rectangular button (sand → navy when on/off)
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sd-autoplay-btn on";
    btn.innerHTML = '<span class="sd-autoplay-icon">⏸</span>';
    state.autoplayToggleEl = btn;

    btn.addEventListener("click", () => {
      state.autoplayOn = !state.autoplayOn;
      updateAutoplayToggle(state);
      if (state.autoplayOn) {
        // restart auto-advance timer from now
        scheduleAutoplayAdvance(state);
      } else if (state.autoplayTimer) {
        clearTimeout(state.autoplayTimer);
        state.autoplayTimer = null;
      }
    });

    right.appendChild(btn);

    modeBar.appendChild(tabList);
    modeBar.appendChild(right);


    wrapEl.insertBefore(modeBar, firstDemo);

    // Lazy-start when wrap becomes visible
    function startIfVisible() {
      if (state.started) return;
      state.started = true;
      switchToMode(state, state.modeKeys[0]);
    }

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && e.intersectionRatio >= 0.3) {
              startIfVisible();
              io.disconnect();
            }
          });
        },
        { threshold: [0, 0.3, 0.6, 1] }
      );
      io.observe(wrapEl);
    } else {
      setTimeout(startIfVisible, 1000);
    }

    return state;
  }

  function updateAutoplayToggle(state) {
    const btn = state.autoplayToggleEl;
    if (!btn) return;
    if (state.autoplayOn) {
      btn.classList.add("on");
      btn.innerHTML = '<span class="sd-autoplay-icon">⏸</span>';
    } else {
      btn.classList.remove("on");
      btn.innerHTML = '<span class="sd-autoplay-icon">▶</span>';
    }
  }


  function clearTimers(state) {
    state.timers.forEach((t) => clearTimeout(t));
    state.timers = [];
    if (state.autoplayTimer) {
      clearTimeout(state.autoplayTimer);
      state.autoplayTimer = null;
    }
  }

  function scheduleAutoplayAdvance(state) {
    if (!state.autoplayOn) return;
    if (state.autoplayTimer) {
      clearTimeout(state.autoplayTimer);
    }
    state.autoplayTimer = setTimeout(() => {
      const idx = state.modeKeys.indexOf(state.currentModeKey);
      const nextIdx = (idx + 1) % state.modeKeys.length;
      const nextKey = state.modeKeys[nextIdx];
      switchToMode(state, nextKey);
    }, AUTOPLAY_INTERVAL);
  }

  function switchToMode(state, modeKey) {
    const demosNow = getDemos();
    const demo = demosNow[modeKey];
    if (!demo) return;

    clearTimers(state);
    state.currentModeKey = modeKey;

    // Tabs active state
    state.tabEls.forEach((t) => {
      if (t.key === modeKey) t.el.classList.add("active");
      else t.el.classList.remove("active");
    });

    // Reset mounts
    state.mounts.forEach((m) => {
      m.clear();
      m.setChannel(demo.channel || "#carlos");
    });

    // Reset reaction flow
    state.reaction = null;

    const script = demo.script || [];
    let idx = 0;

    function step() {
      if (idx >= script.length) {
        scheduleAutoplayAdvance(state);
        return;
      }
      const msg = script[idx++];
      const isUser = msg.role === "user";

      // First user message: seed reaction flow
      let isFirstUser = false;
      if (isUser && !state.reaction) {
        isFirstUser = true;
        if (Array.isArray(msg.reactions) && msg.reactions.length) {
          state.reaction = { names: msg.reactions.slice(), phase: -1 };
          setReactionPhase(state, 0); // 👀
        }
      }

      // Render into each mount
      state.mounts.forEach((m) =>
        renderMessageOnMount(m, demo, msg, { isFirstUser })
      );

      // Progress emoji flow based on message type
      handleReactionProgress(state, msg);

      const t = setTimeout(step, MESSAGE_DELAY);
      state.timers.push(t);
    }

    step();
  }

  // --- Boot ---

  ready(function () {
    const wraps = document.querySelectorAll(".dwms-slack-wrap");
    if (!wraps.length) return;
    wraps.forEach(setupWrap);
  });
})();
