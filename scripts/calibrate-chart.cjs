/**
 * 命盤校正測試 — 1993-02-01 10:45 男命
 * 執行: node scripts/calibrate-chart.cjs
 */
const { astro } = require("iztro");

const EXPECTED = {
  solarDate: "1993-2-1",
  lunarDate: "一九九三年正月初十",
  chineseDate: "癸酉 甲寅 癸丑 丁巳",
  fiveElementsClass: "木三局",
  soulPalace: "酉",
  bodyPalace: "未",
  soul: "文曲",
  body: "天同",
  soulMajorStars: ["天府"],
};

function run() {
  const astrolabe = astro.bySolar("1993-2-1", 5, "男");
  const soulPalace = astrolabe.palaces.find((p) => p.name === "命宫");
  const soulMajorStars = soulPalace?.majorStars.map((s) => s.name) ?? [];

  const checks = [
    ["陽曆", astrolabe.solarDate, EXPECTED.solarDate],
    ["農曆", astrolabe.lunarDate, EXPECTED.lunarDate],
    ["四柱", astrolabe.chineseDate, EXPECTED.chineseDate],
    ["五行局", astrolabe.fiveElementsClass, EXPECTED.fiveElementsClass],
    ["命宮地支", astrolabe.earthlyBranchOfSoulPalace, EXPECTED.soulPalace],
    ["身宮地支", astrolabe.earthlyBranchOfBodyPalace, EXPECTED.bodyPalace],
    ["命主", astrolabe.soul, EXPECTED.soul],
    ["身主", astrolabe.body, EXPECTED.body],
    ["命宮主星", soulMajorStars.join(","), EXPECTED.soulMajorStars.join(",")],
  ];

  let passed = 0;
  console.log("=== 命盤校正測試: 1993-02-01 10:45 男 ===\n");

  for (const [label, actual, expected] of checks) {
    const ok = actual === expected;
    console.log(`${ok ? "✓" : "✗"} ${label}: ${actual}${ok ? "" : ` (預期: ${expected})`}`);
    if (ok) passed++;
  }

  console.log(`\n結果: ${passed}/${checks.length} 通過`);
  process.exit(passed === checks.length ? 0 : 1);
}

run();
