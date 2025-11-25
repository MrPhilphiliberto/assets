// forecaster_demo.js
// Scenario spec for the "Advanced Forecasting" (Forecaster) demo.
// A parent script is expected to render the Slack-like UI and play this script.

(function () {
  "use strict";

  // Static assets for this scenario (the hosting layer will convert this path to a URL)
  const ASSETS = {
    forecastRevenue: "https://raw.githubusercontent.com/MrPhilphiliberto/assets/main/forecaster_time_series%20plot.png",
  };

  /**
   * Message script:
   *  - role: 'user' | 'app'
   *  - from: id for avatar / display name lookup
   *  - ts: timestamp label
   *  - type: optional hint ('controls', 'summary', 'attachment', 'status')
   *  - text: HTML-renderable string
   *  - file: optional file preview for the first user message
   *  - attachments: optional images for app messages
   *  - reactions: emoji names shown on the user message
   *  - controls: optional { primary, secondary } for inline buttons
   */
  const SCRIPT = [
    {
      role: "user",
      from: "diego",
      ts: "10:14 AM",
      text:
        '<span class="mention">@Carlos – Dark Wave</span> can you please forecast next period Sales Revenue?',
      file: {
        name: "sales_macro_2024-2025_to_date.csv",
        columns: [
          "Date",
          "Spend",
          "Impressions",
          "Cart Adds",
          "Checkout Starts",
          "Sales Units",
          "Sales Revenue",
          "CPI_YoY",
          "UnemploymentRate",
          "ConsumerSentiment",
          "FedFundsRate",
          "GasPrice",
          "USD_Index",
          "RetailSales_YoY",
          "MacroDemandIndex",
          "MacroCostIndex",
          "AOV",
        ],
        rows: [
          [
            "2024-01-01",
            11287.36,
            2454189.0,
            45624,
            30222,
            24025,
            1223018.52,
            0.02,
            0.059,
            92.0,
            0.048,
            3.2,
            102.8,
            0.032,
            0.8264933234677144,
            1.1722904213280814,
            50.91,
          ],
          [
            "2024-01-02",
            11567.85,
            2031426.0,
            47226,
            31886,
            25257,
            1257946.44,
            0.021851246471371325,
            0.05738344247002217,
            92.54638851506553,
            0.04796863384184375,
            3.192705672966406,
            102.77910183065076,
            0.030241176420087914,
            0.839417412720443,
            1.2579247078509246,
            49.81,
          ],
          [
            "2024-01-03",
            12076.89,
            2488886.0,
            53355,
            36634,
            29830,
            1544453.54,
            0.022320950680129063,
            0.05653466257578382,
            93.62194831599437,
            0.048060066417410514,
            3.1506341149370414,
            102.34146488211056,
            0.03206464838041088,
            0.9552815744414712,
            1.2299871688608157,
            51.78,
          ],
          [
            "2024-01-04",
            12157.66,
            1855049.0,
            38061,
            26074,
            19953,
            1034268.49,
            0.023068786770624624,
            0.055693902542401336,
            93.28300833729713,
            0.049341470458208574,
            3.218671747694975,
            102.78440691324454,
            0.030964978811229896,
            0.9146249712985897,
            1.4474796538893715,
            51.84,
          ],
          [
            "2024-01-05",
            12052.9,
            2476183.0,
            56024,
            38143,
            29886,
            1677313.79,
            0.022395521267397647,
            0.056535341474642425,
            92.91388857538116,
            0.04997222073770266,
            3.2206650676615696,
            102.47402080212765,
            0.03448963822404129,
            0.9656986301261921,
            1.434260279701481,
            56.12,
          ],
          [
            "2024-01-06",
            11602.71,
            1881945.0,
            28286,
            18969,
            14478,
            734885.29,
            0.02408856419759848,
            0.0591111827773192,
            93.16766286729568,
            0.047169094527922284,
            3.2388964373323508,
            102.44308218554093,
            0.03766987668706094,
            0.9197443634839116,
            1.3348918933781455,
            50.76,
          ],
          [
            "2024-01-07",
            10135.79,
            1523605.0,
            27962,
            19594,
            15634,
            790004.07,
            0.020575843019489632,
            0.059787506373099396,
            93.1269773514273,
            0.04834553964394253,
            3.3601907704485434,
            102.43291991282936,
            0.03472628285718648,
            0.827542027992662,
            1.3159665447386024,
            50.53,
          ],
          [
            "2024-01-08",
            10545.79,
            1423004.0,
            24835,
            16976,
            12976,
            660702.88,
            0.022911888867491244,
            0.059945036521749755,
            93.73361947953249,
            0.049961451865019615,
            3.3226091704502907,
            102.11378773064916,
            0.033578992193604565,
            0.798429052620329,
            1.5241040620780877,
            50.92,
          ],
          [
            "2024-01-09",
            11896.67,
            1626363.0,
            32580,
            22584,
            17830,
            920461.29,
            0.02207884066250684,
            0.05978151549915224,
            93.56770405348955,
            0.0494393906366362,
            3.465923044268382,
            102.06651286975327,
            0.030314915307242805,
            0.7003387062091817,
            1.5498915809729072,
            51.62,
          ],
        ],
      },
      reactions: ["eyes", "white_check_mark"],
    },

    {
      role: "app",
      from: "carlos",
      ts: "10:14 AM",
      type: "controls",
      text: "Forecast — Controls  ·  adjust settings or export",
      controls: {
        primary: "Controls",
        secondary: "Save & Export",
      },
    },

    {
      role: "app",
      from: "carlos",
      ts: "10:14 AM",
      type: "summary",
      text:
        "Forecasts ready ✅<br><br>" +
        "🧠 Summary<br>" +
        'The forecast for Sales Revenue indicates a predicted value of yhat "9,946,131.2" for the next period, specifically the week starting on date "2025-07-06", with a prediction interval of pi "8,299,662.0–11,592,600.5". The model selected is the ENSEMBLE_s6, which shows strong performance metrics with a smape of "8.2", mase of "1.04", and rmse of "1,201,161.9". Seasonality has been applied with a period of 6, indicating that the model has sufficient historical data to support this decision. All models converge on the forecast, and the Ljung–Box test indicates residual autocorrelation is present, with a ljung_box_p of "0.00". The exogenous variable used in the model is "Spend", transformed with a moving average of 3 and no lag, which aligns with the guidance to select a variable that drives the target without being synonymous with it.<br><br>" +
        "See less",
    },

    {
      role: "app",
      from: "carlos",
      ts: "10:14 AM",
      type: "attachment",
      text: "Generated plot from tool.",
      attachments: [
        {
          url: ASSETS.forecastRevenue,
          caption: "Sales Revenue — Forecast (Next Week)",
        },
      ],
    },

    {
      role: "user",
      from: "diego",
      ts: "10:15 AM",
      text:
        "Thanks! Could you simplify the summary for me a bit? I'm not very familiar with all of these terms.",
      reactions: ["eyes", "white_check_mark"],
    },

    {
      role: "app",
      from: "carlos",
      ts: "10:15 AM",
      type: "summary",
      text:
        'Sure! For the first week of July 2025, we expect sales revenue to be around $9.95 million, with a possible range between $8.30 million and $11.59 million. The best forecasting method used is called "ENSEMBLE_s6," which has a good accuracy score. However, there are some patterns in the data that suggest we might need to look closer at the results.',
    },
  ];

  // Register scenario on a global container for the parent wrapper.
  window.DWMS_DEMO_REGISTRY = window.DWMS_DEMO_REGISTRY || {};
  window.DWMS_DEMO_REGISTRY.forecaster = {
    id: "forecaster",
    tabLabel: "Advanced Forecasting",
    channel: "#carlos",
    participants: {
      diego: {
        displayName: "Diego M.",
        fullName: "Diego Morales",
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
