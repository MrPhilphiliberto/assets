// snippet_runner_demo.js
// Scenario spec for the "Bespoke Workflows" (Snippet Runner) demo.

(function () {
  "use strict";

  // Static assets for this scenario (hosted on GitHub)
  const ASSETS = {
    // Raw CSV used in the example
    surveyCsv:
      "https://raw.githubusercontent.com/MrPhilphiliberto/assets/main/mailer_aware_survey_response.csv",
    // Plot output from the snippet run
    liftPlot:
      "https://raw.githubusercontent.com/MrPhilphiliberto/assets/main/figure_post_1.png",
    // Screenshot of the Slack CSV upload preview
    csvPreview:
      "https://raw.githubusercontent.com/MrPhilphiliberto/assets/main/snippet_csv_preview.png",
  };

  /**
   * Message script:
   *  - role: 'user' | 'app'
   *  - from: id for avatar / display name lookup
   *  - ts: timestamp label
   *  - type: optional hint ('controls', 'summary', 'attachment', 'status', 'snippet')
   *  - text: HTML-renderable string
   *  - file: optional file preview object
   *  - attachments: optional [{ url, caption }]
   *  - reactions: emoji reaction names
   */
  const SCRIPT = [
    {
      role: "user",
      from: "luis",
      ts: "3:04 PM",
      type: "question",
      text:
        '<span class="mention">@Carlos – Dark Wave</span> we ran a direct mail campaign to increase brand awareness. I have attached a survey of mailer recipients that were separated into treatment &amp; control, identified via the column <code>Exposure_Status</code> in the attached csv, before mailers went out. Can you please generate a python snippet that evaluates the lift in the metrics of "favorability" &amp; "awareness" through a z-test? Validate statistical significance and ensure your code produces a pertinent plot demonstrating the lift.',
      file: {
        name: "mailer_aware_survey_response.csv",
        columns: ["Exposure_Status", "favorability", "awareness"],
        rows: [
          ["control", 1, 0],
          ["control", 0, 0],
          ["control", 1, 0],
          ["control", 0, 1],
          ["control", 0, 1],
          ["control", 1, 0],
          ["control", 0, 0],
          ["control", 1, 0],
          ["control", 0, 0],
        ],
        note: "Click to expand inline (2,002 lines)",
        url: ASSETS.surveyCsv,
      },
      // 👀 → ⏳ → ✅ flow
      reactions: ["eyes", "hourglass_flowing_sand", "white_check_mark"],
      // Append the CSV upload screenshot as a visual preview
      attachments: [
        {
          url: ASSETS.csvPreview,
          caption: "mailer_aware_survey_response.csv — Slack preview",
        },
      ],
    },

    {
      role: "app",
      from: "carlos",
      ts: "3:05 PM",
      type: "snippet",
      text: (() => {
        const intro =
          'Sure, I can help with that! To evaluate the lift in the metrics of "favorability" and "awareness" through a z-test, we first need to calculate the mean values of these metrics for the treatment and control groups. Then we can perform a z-test to determine if there is a statistically significant difference between the two groups.<br><br>' +
          "Here's a Python snippet that you can use for this analysis:<br>";
        const code = `python
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

# Calculate mean favorability and awareness for treatment and control groups
treatment_favorability_mean = df[df['Exposure_Status'] == 'treatment']['favorability'].mean()
control_favorability_mean = df[df['Exposure_Status'] == 'control']['favorability'].mean()

treatment_awareness_mean = df[df['Exposure_Status'] == 'treatment']['awareness'].mean()
control_awareness_mean = df[df['Exposure_Status'] == 'control']['awareness'].mean()

# Perform z-test for favorability
favorability_z_score, favorability_p_value = stats.ttest_ind(
    df[df['Exposure_Status'] == 'treatment']['favorability'],
    df[df['Exposure_Status'] == 'control']['favorability']
)

# Perform z-test for awareness
awareness_z_score, awareness_p_value = stats.ttest_ind(
    df[df['Exposure_Status'] == 'treatment']['awareness'],
    df[df['Exposure_Status'] == 'control']['awareness']
)

# Plot the lift in favorability and awareness
plt.bar(
    ['Favorability', 'Awareness'],
    [treatment_favorability_mean - control_favorability_mean,
     treatment_awareness_mean - control_awareness_mean]
)
plt.ylabel('Lift')
plt.title('Lift in Favorability and Awareness between Treatment and Control Groups')
plt.show()

# Print z-test results
print(f'Z-test for Favorability - Z-score: {favorability_z_score}, P-value: {favorability_p_value}')
print(f'Z-test for Awareness - Z-score: {awareness_z_score}, P-value: {awareness_p_value}')`;
        return (
          intro +
          '<pre class="code-block"><code>' +
          code.replace(/&/g, "&amp;").replace(/</g, "&lt;") +
          "</code></pre>" +
          "This snippet will calculate the mean values, perform z-tests, and plot the lift in favorability and awareness between the treatment and control groups. Let me know if you need any further assistance!"
        );
      })(),
    },

    {
      role: "app",
      from: "carlos",
      ts: "3:05 PM",
      type: "controls",
      text: "I wrote a Python snippet — run it in the sandbox?",
      controls: {
        primary: "Run snippet",
        secondary: "Dismiss",
      },
      reactions: ["white_check_mark"],
    },

    {
      role: "app",
      from: "carlos",
      ts: "3:05 PM",
      type: "status",
      text: (() => {
        const out = `Z-test for Favorability - Z-score: 6.860998355146238, P-value: 9.088688177636136e-12
Z-test for Awareness - Z-score: 9.584470197434868, P-value: 2.647646709993892e-21
[snippet_runner] post-exec saved 1 figure(s) to /tmp/snippet_c5a2ac64/out`;
        return (
          "Snippet Runner — Completed  •  3460 ms<br><br>" +
          "Script Output:<br>" +
          '<pre class="code-block"><code>' +
          out.replace(/&/g, "&amp;").replace(/</g, "&lt;") +
          "</code></pre>"
        );
      })(),
    },

    {
      role: "app",
      from: "carlos",
      ts: "3:05 PM",
      type: "artifact",
      text: "Artifact<br><strong>input_df.csv</strong>",
      file: {
        name: "input_df.csv",
        columns: ["Exposure_Status", "favorability", "awareness"],
        rows: [
          ["control", 1, 0],
          ["control", 0, 0],
          ["control", 1, 0],
          ["control", 0, 1],
          ["control", 0, 1],
          ["control", 1, 0],
          ["control", 0, 0],
          ["control", 1, 0],
          ["control", 0, 0],
        ],
        note: "Click to expand inline (2,002 lines)",
        url: ASSETS.surveyCsv,
      },
    },

    {
      role: "app",
      from: "carlos",
      ts: "3:05 PM",
      type: "attachment",
      text: "Artifact<br><strong>figure_post_1.png</strong>",
      attachments: [
        {
          url: ASSETS.liftPlot,
          caption:
            "Lift in Favorability and Awareness between Treatment and Control Groups",
        },
      ],
    },

    {
      role: "user",
      from: "mei",
      ts: "3:06 PM",
      type: "followup",
      text:
        "how should I interpret the Z-scores?<br>" +
        '<pre class="code-block"><code>' +
        "Z-test for Favorability - Z-score: 6.860998355146238, P-value: 9.088688177636136e-12\n" +
        "Z-test for Awareness - Z-score: 9.584470197434868, P-value: 2.647646709993892e-21" +
        "</code></pre>",
      reactions: ["eyes", "hourglass_flowing_sand", "white_check_mark"],
    },

    {
      role: "app",
      from: "carlos",
      ts: "3:06 PM",
      type: "answer",
      text:
        "The Z-scores you provided indicate a significant difference between the treatment and control groups for both favorability and awareness.<br><br>" +
        "For favorability, the Z-score of 6.86 with a very small p-value of 9.09e-12 suggests a substantial difference in favorability ratings between the two groups. " +
        "Similarly, the Z-score of 9.58 with a p-value of 2.65e-21 for awareness indicates a significant distinction between the treatment and control groups in terms of awareness levels.<br><br>" +
        "These results strongly support the effectiveness of the direct mail campaign in increasing both favorability and awareness among the recipients. " +
        "The high Z-scores and very low p-values indicate a statistically significant lift in these metrics due to the campaign. This is a positive outcome that shows the impact of the campaign on brand perception. If you have any more questions or need further clarification, feel free to ask!",
    },
  ];

  // Register scenario on the shared registry that slack_multi_demo.js reads.
  window.DWMS_DEMO_REGISTRY = window.DWMS_DEMO_REGISTRY || {};
  window.DWMS_DEMO_REGISTRY.snippet_runner = {
    id: "snippet_runner",
    tabLabel: "Bespoke Workflows",
    channel: "#carlos",
    participants: {
      luis: {
        displayName: "Luis M.",
        fullName: "Luis Martinez",
        role: "user",
      },
      mei: {
        displayName: "Mei L.",
        fullName: "Mei Liu",
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
