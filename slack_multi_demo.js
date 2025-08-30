
// slack-demo.js
(function () {
  // Wait until the page is ready (safer for Carrd)
  function ready(fn) {
    /in/.test(document.readyState) ? setTimeout(() => ready(fn), 9) : fn();
  }

  ready(function () {
    const ASSETS = {
      carlosAvatar:
        "https://raw.githubusercontent.com/MrPhilphiliberto/assets/refs/heads/main/ChatGPT%20Image%20Jul%2028%2C%202025%2C%2005_10_59%20PM.png",
      corr:
        "https://raw.githubusercontent.com/MrPhilphiliberto/assets/refs/heads/main/plot_phase1_turn1.png",
      hist:
        "https://raw.githubusercontent.com/MrPhilphiliberto/assets/refs/heads/main/plot_phase5_turn22.png",
      scatter:
        "https://raw.githubusercontent.com/MrPhilphiliberto/assets/refs/heads/main/plot_phase7_turn30.png",
      forecast:
        "https://raw.githubusercontent.com/MrPhilphiliberto/assets/refs/heads/main/forecastor_pseudo.png",
    };

    // --- SCENARIOS ---
    // 1) Priya + Sam + Carlos: only the forecast line chart at the end
    const SCENARIO_PRIYA_SAM = {
      channel: "#carlos",
      script: [
        {
          from: "priya",
          ts: "9:12 AM",
          text:
            '<span class="mention">@Carlos – Dark Wave</span> can you give me the current performance break down, across tactics?',
        },
        {
          from: "carlos",
          ts: "9:13 AM",
          text: `<strong>📊 Performance Summary — All Tactics</strong><br>
<strong>Week of 08/17/2025</strong><br>
- Spend: $128,000<br>
- Total Checkout Starts: 4,210<br>
- Total Conversions: 1,980<br>
- CPA: $56.70<br>
↳ vs 3W MA: $54.10 (↑ 4.8%)<br>
↳ vs 6W MA: $53.40 (↑ 6.2%)<br>
↳ vs 12W MA: $55.20 (↑ 2.7%)<br><br>

<strong>Top 5 Tactics by Conversion Volume (62% of Spend)</strong><br>
1) Brand Search Exact — Conversions: 1,120 — Spend: $34,200 — CPA: $30.54<br>
2) Paid Social Prospecting — Conversions: 890 — Spend: $27,000 — CPA: $30.34<br>
3) Brand Search Broad — Conversions: 620 — Spend: $14,700 — CPA: $23.71<br>
4) Site Retargeting — Conversions: 410 — Spend: $12,500 — CPA: $30.49<br>
5) Programmatic Contextual — Conversions: 345 — Spend: $9,600 — CPA: $27.83<br><br>

<strong>Monthly (August 2025)</strong><br>
- Spend: $502,000 — Conversions: 7,980 — CPA: $58.90<br>
↳ vs 3M MA: $56.40 (↑ 4.4%) • vs 6M MA: $55.90 (↑ 5.4%)<br><br>

<strong>Decomposition by Tactic Bucket (abridged)</strong><br>
- Brand Search: 36.9% Conversions • 31.5% Spend • CPA: $31.40<br>
- Paid Social: 26.4% Conversions • 27.1% Spend • CPA: $34.60<br>
- Programmatic: 17.2% Conversions • 20.3% Spend • CPA: $41.10`,
        },
        {
          from: "sam",
          ts: "9:14 AM",
          text:
            "Thanks. Can you break down Brand Search's performance specifically within that?",
        },
        {
          from: "carlos",
          ts: "9:14 AM",
          text: `<strong>🔎 Brand Search — Weekly Snapshot (Week of 08/17/2025)</strong><br>
- Spend: $48,900<br>
- Conversions: 1,740<br>
- CPA: $28.10<br>
- Share of Spend: 38% • Share of Conversions: 44%<br>
- Efficiency vs. Aggregate CPA: 50.5% better (aggregate = $56.70)<br><br>

<strong>Breakout</strong><br>
• <em>Brand Search Exact</em> — Spend: $34,200 • Conversions: 1,120 • CPA: $30.54<br>
• <em>Brand Search Broad</em> — Spend: $14,700 • Conversions: 620 • CPA: $23.71<br><br>

<strong>Trend</strong><br>
CPA steady vs last 3 weeks (±2%), volume up ~6% w/w on stable spend.`,
        },
        {
          from: "priya",
          ts: "9:15 AM",
          text: "Great. Please forecast next week for <em>Brand Search Exact</em> too.",
        },
        {
          from: "carlos",
          ts: "9:15 AM",
          text: `<strong>🔮 Forecast — Brand Search Exact (t+1)</strong><br>
Using a 3-week moving-average spend assumption:<br>
- Total Checkout Starts (t+1): <strong>1,160.4</strong><br>
- Total Conversions (t+1): <strong>610.7</strong><br>
- Avg Cost to Acquire (CPA): <strong>$29.85</strong><br>
Forecast week of <strong>08/24/2025</strong>.`,
          attachments: [
            {
              url: ASSETS.forecast,
              caption: "Forecast vs Fitted (t+1) — Brand Search Exact",
            },
          ],
        },
      ],
    };

    // 2) Naomi + Carlos: diagnostics only (heat map, histogram, scatter) — EXACT format from your single-scenario snippet
    const SCENARIO_NAOMI = {
      channel: "#analytics-lab",
      script: [
        {
          from: "naomi",
          ts: "6:04 PM",
          text:
            '<span class="mention">@Carlos – Dark Wave</span> can you evaluate drivers of performance on our total conversion volume?',
        },
        {
          from: "carlos",
          ts: "6:04 PM",
          text: "On it. I'll be right back with my findings.",
        },
        {
          from: "carlos",
          ts: "6:05 PM",
          text:
            "Currently, Brand Search and Social tactics are driving conversions, while acquisition costs are climbing in Programmatic, suppressing our total conversion count.",
        },
        {
          from: "carlos",
          ts: "6:06 PM",
          text:
            "Here’s the distribution and correlation matrix, with a fairly accurate regression model fit. I'd recommend that we evaluate shifting budget into top performing tactics. Would you like a full budget optimization recommendation?",
          attachments: [
            { url: ASSETS.hist, caption: "Histogram: Total Conversions" },
            { url: ASSETS.corr, caption: "Correlation Matrix" },
            { url: ASSETS.scatter, caption: "Predicted vs Actual Conversions" },
          ],
        },
      ],
    };

    const SCENARIOS = [SCENARIO_PRIYA_SAM, SCENARIO_NAOMI];

    // ---- Mount + UI Shell ----
    const mounts = document.querySelectorAll(".slack-demo");
    if (!mounts.length) return;

    mounts.forEach((mount) => {
      // Static chrome
      mount.innerHTML = [
        '<div class="sd-sidebar">',
        '<div class="sd-org">🪐</div>',
        '<div class="sd-nav">',
        "<h4>Channels</h4>",
        '<div class="sd-item active"><span class="sd-ic"></span><span class="sd-chan-label">#carlos</span></div>',
        '<div class="sd-item"><span class="sd-ic"></span><span>#all-dark-wave</span></div>',
        "<h4>Apps</h4>",
        '<div class="sd-item"><span class="sd-ic"></span><span>Slackbot</span></div>',
        '<div class="sd-item"><span class="sd-ic"></span><span>Carlos – Dark Wave</span></div>',
        "</div>",
        "</div>",
        '<div class="sd-header">',
        '<div class="sd-dots"><span class="sd-dot"></span><span class="sd-dot"></span><span class="sd-dot"></span></div>',
        '<span class="sd-header-title">#carlos • Dark Wave Marketing Science</span>',
        "</div>",
        '<div class="sd-body">',
        '<div class="sd-scroll"></div>',
        '<button class="jump-bottom" title="Jump to latest" aria-label="Jump to latest">',
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">',
        '<path fill-rule="evenodd" d="M1.5 5.5l6 6 6-6H1.5z"/>',
        "</svg>",
        "</button>",
        "</div>",
      ].join("");

      const scroll = mount.querySelector(".sd-scroll");
      const jump = mount.querySelector(".jump-bottom");
      const chanLabel = mount.querySelector(".sd-chan-label");
      const headerTitle = mount.querySelector(".sd-header-title");

      // --- Jump-to-bottom ---
      function isAtBottom() {
        return scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight) < 24;
      }
      function updateJump() {
        isAtBottom() ? jump.classList.remove("show") : jump.classList.add("show");
      }
      function smoothToBottom() {
        const start = scroll.scrollTop;
        const end = scroll.scrollHeight - scroll.clientHeight;
        const dur = 600, t0 = performance.now();
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

      // --- Thread reply counter (per scenario) ---
      let replyCount = 0, dividerEl = null, dividerLabelEl = null;
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
        if (!dividerEl) return;
        dividerLabelEl.textContent = replyCount === 1 ? "1 reply" : `${replyCount} replies`;
      }

      // --- Avatars ---
      const avatar = (who) => {
        const el = document.createElement("div");
        el.className = "avatar";
        if (who === "carlos") {
          const img = document.createElement("img");
          img.src = ASSETS.carlosAvatar;
          img.alt = "Carlos – Dark Wave";
          el.appendChild(img);
        } else {
          const initials =
            who === "sam" ? "S" :
            who === "priya" ? "P" :
            who === "naomi" ? "N" : "?";
          el.textContent = initials;
        }
        return el;
      };

      // --- Message add ---
      function addMsg(item) {
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
        row.className = "msg from-" + item.from;
        row.appendChild(avatar(item.from));

        const content = document.createElement("div");
        content.className = "msg-content";

        const head = document.createElement("div");
        head.className = "head";
        const nm = document.createElement("span");
        nm.className = "name";
        nm.textContent =
          item.from === "carlos" ? "Carlos – Dark Wave"
          : item.from === "sam" ? "Sam T."
          : item.from === "priya" ? "Priya N."
          : item.from === "naomi" ? "Naomi I."
          : item.from;
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
        p.innerHTML = item.text;

        content.appendChild(head);
        content.appendChild(p);

        if (item.attachments) {
          item.attachments.forEach((a) => {
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
        requestAnimationFrame(() => row.classList.add("show"));
        updateJump();
      }

      // --- Sequenced playback across scenarios ---
      const MESSAGE_DELAY = 2800;             // delay between messages
      const BETWEEN_SCENARIOS_DELAY = 0;      // remove lag between scenarios
      const SCENARIO_END_HOLD = 12000;        // longer hold before clearing & switching
      const REFRESH_DELAY = 20000;            // (kept if you ever need a wrap pause)

      let scenarioIndex = 0, msgIndex = 0, started = false;

      function setChannelUI(channel) {
        const label = mount.querySelector(".sd-chan-label");
        const title = mount.querySelector(".sd-header-title");
        if (label) label.textContent = channel;
        if (title) title.textContent = `${channel} • Dark Wave Marketing Science`;
      }

      function playNextMessage() {
        const scenario = SCENARIOS[scenarioIndex];
        if (msgIndex >= scenario.script.length) {
          // Scenario finished → HOLD, then wipe and immediately move to next (no inter-scenario lag)
          setTimeout(() => {
            scroll.innerHTML = "";
            resetThread();
            msgIndex = 0;

            scenarioIndex = (scenarioIndex + 1) % SCENARIOS.length;
            const nextScenario = SCENARIOS[scenarioIndex];
            setChannelUI(nextScenario.channel);

            // Start next scenario immediately after the hold
            setTimeout(playNextMessage, BETWEEN_SCENARIOS_DELAY);
          }, SCENARIO_END_HOLD);
          return;
        }

        addMsg(scenario.script[msgIndex++]);
        setTimeout(playNextMessage, MESSAGE_DELAY);
      }

      function startIfVisible() {
        if (started) return;
        started = true;
        setChannelUI(SCENARIOS[scenarioIndex].channel);
        playNextMessage();
      }

      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting && e.intersectionRatio >= 0.35) {
                startIfVisible();
                io.disconnect();
              }
            });
          },
          { threshold: [0, 0.2, 0.35, 0.6, 1] }
        );
        io.observe(mount);
      } else {
        setTimeout(startIfVisible, 1000);
      }
    });
  });
})();

