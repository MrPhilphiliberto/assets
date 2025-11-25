// thought_dev_demo.js
// Scenario spec for the "Thought Development" demo (natural conversation only).

(function () {
  "use strict";

  const SCRIPT = [
    {
      role: "user",
      from: "marcus",
      ts: "3:03 PM",
      type: "question",
      text:
        '<span class="mention">@Carlos – Dark Wave</span> I was in a meeting with my boss where I proposed increasing Search Brand’s budget to an all-time high, since we’re seeing strong conversion volumes. He pushed back and said he was worried about diminishing returns. What is that?',
    },

    {
      role: "app",
      from: "carlos",
      ts: "3:03 PM",
      type: "answer",
      text:
        "Diminishing returns in marketing contexts means that after a certain point, each extra dollar of spend produces less incremental outcome than the dollars before it.<br><br>" +
        "For something like Search Brand, that usually looks like:<br>" +
        "• You scale budget, but conversions stop growing 1:1 with spend.<br>" +
        "• Your marginal CPA (cost per extra conversion) gets worse, even if the average CPA still looks strong.<br><br>" +
        "In other words: the channel can still be good, but the <em>next</em> dollar isn’t as powerful as the earlier ones. If you’d like, we can walk through how to spot that pattern in your brand search data.",
    },

    {
      role: "user",
      from: "marcus",
      ts: "3:04 PM",
      type: "followup",
      text:
        "Okay, so more money doesn’t buy the same amount of extra conversions. But what would actually cause that in this context?",
    },

    {
      role: "app",
      from: "carlos",
      ts: "3:04 PM",
      type: "answer",
      text:
        "Great question. A few common drivers for diminishing returns in Search Brand:<br><br>" +
        "1. Query saturation – you’ve already captured most high-intent brand queries during peak hours. Extra budget starts buying marginal impressions at the edges (odd hours, low-quality variants).<br>" +
        "2. Auction pressure – as you raise bids and budgets, you sometimes pay more per click to defend the same impression share.<br>" +
        "3. Broader traffic mix – automation may expand into looser brand / near-brand queries that don’t convert as well.<br><br>" +
        "Compare that to Paid Social: it also has diminishing returns, but the pattern is different. There, you might see:<br>" +
        "• Frequency and audience fatigue climbing.<br>" +
        "• Reach extending into less qualified lookalike audiences.<br><br>" +
        "So both channels hit diminishing returns, but <em>where</em> and <em>how sharply</em> it happens can differ.",
    },

    {
      role: "user",
      from: "marcus",
      ts: "3:05 PM",
      type: "followup",
      text:
        "So is it fair to say that as we scale, CPC climbs and conversion rate falls, and together that’s what drives worse marginal performance?",
    },

    {
      role: "app",
      from: "carlos",
      ts: "3:05 PM",
      type: "answer",
      text:
        "That’s a good intuition, and it’s often what we see:<br><br>" +
        "• CPC drifts up as you push harder in the auction.<br>" +
        "• CVR drifts down as you start buying more marginal queries and positions.<br><br>" +
        "Those two effects combine into a higher marginal CPA. The data won’t always be perfectly clean, but if we plot conversions vs. spend over time and fit a response curve, we can usually see the <em>flattening</em> that signals diminishing returns.",
    },

    {
      role: "user",
      from: "marcus",
      ts: "3:06 PM",
      type: "followup",
      text:
        "Got it. I’d like help figuring out how far we can scale Brand Search before it’s not worth it anymore.",
    },

    {
      role: "app",
      from: "carlos",
      ts: "3:06 PM",
      type: "answer",
      text:
        "To answer that, we’d:<br><br>" +
        "1. Build a response curve for Brand Search (for example, a Hill-type curve or flexible regression) using historical spend and conversions.<br>" +
        "2. Compute the marginal CPA at different spend levels.<br>" +
        "3. Mark the ranges where:<br>" +
        "&nbsp;&nbsp;• Marginal CPA is still attractive, and<br>" +
        "&nbsp;&nbsp;• It starts to exceed either your target CPA or what other tactics can achieve.<br><br>" +
        "That gives you a recommended budget range (for example, “efficient,” “stretch,” and “over-investment” zones) you can take back to your boss.",
    },

    {
      role: "user",
      from: "marcus",
      ts: "3:07 PM",
      type: "followup",
      text:
        "Should we look only at Brand Search’s past performance, or include other tactics too?",
    },

    {
      role: "app",
      from: "carlos",
      ts: "3:07 PM",
      type: "answer",
      text:
        "We should absolutely include other tactics.<br><br>" +
        "Even if Brand Search is starting to hit diminishing returns, it might <em>still</em> be more efficient than, say, Paid Social prospecting. The decision isn’t “Is Brand good or bad?” but:<br><br>" +
        "<em>“Is the next dollar better spent in Brand Search or somewhere else in the mix?”</em><br><br>" +
        "So the full analysis would:<br>" +
        "• Estimate response curves for Brand Search, Non-Brand, and Paid Social at least.<br>" +
        "• Compare marginal CPA (or ROAS) across tactics at different budget levels.<br>" +
        "• Recommend a rebalanced mix where each tactic is funded up to the point where its marginal return is competitive.<br><br>" +
        "If you’re ready to share a recent export (spend + conversions by tactic and week), we can sketch that view and see where Brand Search stops being the best home for the next dollar.",
    },
  ];

  window.DWMS_DEMO_REGISTRY = window.DWMS_DEMO_REGISTRY || {};
  window.DWMS_DEMO_REGISTRY.thought = {
    id: "thought",
    tabLabel: "Thought Development",
    channel: "#carlos",
    participants: {
      marcus: {
        displayName: "Marcus J.",
        fullName: "Marcus Johnson",
        role: "user",
      },
      carlos: {
        displayName: "Carlos – Dark Wave",
        role: "app",
      },
    },
    script: SCRIPT,
  };
})();
