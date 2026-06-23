/**
 * 匯入 SEO 學堂長文（可重複執行，已存在則更新）
 * 執行：npm run seed-seo-articles
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../src/data/articles.json");

const ARTICLES = [
  {
    slug: "結婚擇日香港攻略",
    category: "daily-insights",
    title: "結婚擇日香港攻略 — 收費、流程、要準備咩？",
    publishedAt: "2026-06-23",
    image: "/images/site/sunny_1.jpg",
    contentHtml: `<p>香港結婚除咗酒店、攝影、婚紗，仲有一樣好多新人會忽略：<strong>擇日及吉時</strong>。上頭、過大禮、出門、入門、開席 — 傳統上每個環節都可以揀過日子。呢篇係 Destiny Home Sunny 師傅整理嘅<strong>結婚擇日香港攻略</strong>，幫你了解收費、流程同要準備咩資料。</p>

<h2>結婚擇日收費幾多？</h2>
<p>Destiny Home <strong>擇日及吉時 HK$800</strong>，需時約 15–30 分鐘。師傅會按<strong>新郎新娘雙方生辰</strong>，結合農曆宜忌同你哋嘅實際安排，揀出合適日期同時辰。</p>
<p>詳細價目可參考<a href="/booking">收費及預約</a>；想直接預約可去<a href="/wedding-date">結婚擇日</a>專頁 WhatsApp 查詢。</p>

<h2>擇日要準備咩資料？</h2>
<ol>
<li><strong>新郎、新娘出生年、月、日、時</strong>（愈準確愈好）</li>
<li><strong>曆法</strong>：陽曆定農曆註明清楚</li>
<li><strong>想辦嘅儀式</strong>：上頭、過大禮、註冊、擺酒、入伙等</li>
<li><strong>大概月份範圍</strong>：例如「想喺 2026 年下半年」</li>
<li>如有長輩意見或家族習俗，預早講俾師傅知</li>
</ol>
<p>如果一方時辰唔肯定，建議先<a href="/chart">免費排盤</a>或預約<a href="/academy/ding-pan">定盤</a>，避免擇日基於錯誤時辰。</p>

<h2>擇日流程係點？</h2>
<ol>
<li>WhatsApp 提供雙方出生資料同想辦嘅儀式</li>
<li>師傅排盤、對照黃曆同雙方命盤</li>
<li>提供建議日期、吉時同注意事項</li>
<li>你哋同家人商量後確認</li>
</ol>
<p>一般幾個工作天內可以收到建議；旺季（如年尾婚期）建議<strong>提早 2–3 個月</strong>預約。</p>

<h2>擇日同流日黃曆有咩分別？</h2>
<p><a href="/daily">每日流日</a>係通用黃曆，睇當日整體宜忌，適合大家參考。結婚擇日就要結合<strong>雙方八字／紫微命盤</strong>，同你哋嘅大限流年，先至係個人化嘅吉日。</p>
<p>簡單講：流日話「今日宜嫁娶」唔代表每一對新人都適合；擇日係為<strong>你哋兩個</strong>揀日子。</p>

<h2>常見問題</h2>
<p><strong>Q：只擇擺酒日子得唔得？</strong><br>A：可以。師傅可按你需要擇單一儀式或多個環節。</p>
<p><strong>Q：同風水有關嗎？</strong><br>A：擇日重時間同氣場；新居入伙、婚房佈局就屬風水範疇，可以另外預約<a href="/booking">風水陽宅</a>。</p>
<p><strong>Q：邊度預約？</strong><br>A：灣仔<a href="/wan-chai-ziwei">駱克道382號1807室</a>，或 WhatsApp 遙距處理擇日。</p>

<h2>總結</h2>
<p><strong>結婚擇日香港</strong>唔使複雜：準備雙方出生資料、講清楚想辦咩儀式、提早預約。HK$800 由 Sunny 師傅親自揀日，過千好評，歡迎 WhatsApp 查詢。</p>`,
  },
  {
    slug: "流日黃曆同命盤分別",
    category: "daily-insights",
    title: "流日黃曆同紫微命盤有咩分別？",
    publishedAt: "2026-06-24",
    image: "/images/chart-cover.png",
    contentHtml: `<p>好多客人問：「我睇咗<a href="/daily">每日流日</a>，今日宜嫁娶，係咪一定好？」又或者：「我已經<a href="/chart">排盤</a>，仲使唔使睇黃曆？」其實<strong>流日黃曆</strong>同<strong>紫微命盤</strong>係兩套系統，各有用途。Sunny 師傅用淺白方式同你分清楚。</p>

<h2>流日黃曆係咩？</h2>
<p>流日（通勝、黃曆）根據<strong>農曆干支</strong>同傳統曆法，列出當日：</p>
<ul>
<li>建除十二神、宜忌事項</li>
<li>吉神凶煞</li>
<li>生肖相冲提示</li>
</ul>
<p>Destiny Home 網站<a href="/daily">每日流日</a>每日 00:01（香港時間）自動更新，方便你發 IG Story 或參考當日氣場。</p>
<p><strong>重點：流日係「大家共用」嘅曆法，唔係個人專屬運程。</strong></p>

<h2>紫微命盤係咩？</h2>
<p>紫微斗數要你用<strong>出生年、月、日、時</strong>起盤，睇十二宮、十四主星、大限十年、流年流月。每個人張盤都唔同。</p>
<p>網站<a href="/chart">免費排盤</a>可以即時睇基本命格；深入解讀就要師傅<a href="/booking">全批</a>定盤。</p>

<h2>兩者點樣一齊用？</h2>
<p>舉個例：</p>
<ul>
<li>流日話今日宜簽約 — 可以作參考，但你要睇自己<strong>官祿宮、財帛宮流年</strong>先決定係咪真係適合</li>
<li>流日話今日忌動土 — 一般建議避開，除非你命盤當日有特別吉星化解（要師傅睇）</li>
<li>結婚擇日 — 唔可以只睇通勝，要<a href="/wedding-date">按雙方生辰擇日</a></li>
</ul>

<h2>邊種情況睇流日就夠？</h2>
<ul>
<li>今日大致宜忌、心情節奏</li>
<li>擇日初步篩選（再交師傅精選）</li>
<li>發社交媒體、提醒客人當日氣場</li>
</ul>

<h2>邊種情況一定要睇命盤？</h2>
<ul>
<li>轉工、創業、投資</li>
<li>感情、結婚、離婚</li>
<li>健康、家人、子女</li>
<li>想知未來十年大限方向</li>
</ul>

<h2>總結</h2>
<p><strong>流日係天氣預報，命盤係你個人嘅人生地圖。</strong>兩樣可以一齊用，但重大決定請預約師傅全批。每日流日免費睇，命盤亦可以<a href="/chart">免費即時排盤</a>開始。</p>`,
  },
  {
    slug: "紫微斗數定盤攻略",
    category: "daily-insights",
    title: "出生時辰唔肯定？紫微斗數定盤攻略",
    publishedAt: "2026-06-25",
    image: "/images/site/sunny_star1.jpg",
    contentHtml: `<p>「我媽話我係下晝出世，但唔記得幾點。」「出生證明淨係寫日期，冇時間。」如果你都有呢啲疑問，<strong>定盤</strong>就係紫微斗數最重要嘅一步。時辰差一個時辰（2 小時），命盤可以完全不同。</p>

<h2>咩係定盤？</h2>
<p>定盤係師傅根據你<strong>過去人生大事</strong>（例如學歷、工作轉折、戀愛、結婚、搬屋）同性格特徵，反推邊個時辰最符合你嘅命盤。</p>
<p>Destiny Home 學堂有專文介紹<a href="/academy/ding-pan">天地人與定盤</a>；實際操作建議預約 Sunny 師傅全批時一併處理。</p>

<h2>點解時辰咁重要？</h2>
<p>紫微斗數以出生<strong>年、月、日、時</strong>安星。時辰決定：</p>
<ul>
<li>命宮位置</li>
<li>身宮位置</li>
<li>大限起運年齡</li>
<li>部分星曜分布</li>
</ul>
<p>所以網上<a href="/chart">免費排盤</a>雖然方便，若時辰唔準，分析只供參考。</p>

<h2>定盤前你可以準備咩？</h2>
<ol>
<li>出生證明、舊曆書、醫院紀錄（如有時間）</li>
<li>問父母、長輩記憶中最接近嘅時段（朝早、下晝、夜晚）</li>
<li>列出 3–5 件人生大事同發生年份</li>
<li>描述性格：內向定外向、愛冒險定穩陣等</li>
</ol>
<p>網站已支援<strong>真太陽時</strong>校正（按出生地經度），填寫時記得選出生地。</p>

<h2>定盤流程（師傅全批時）</h2>
<ol>
<li>先用你提供嘅時間起一盤</li>
<li>對照性格、六親、過去大事</li>
<li>如有偏差，嘗試相鄰時辰再驗證</li>
<li>確定後再深入講大限、流年</li>
</ol>
<p>全批 HK$2,000，需時 60–90 分鐘，詳見<a href="/booking">收費及預約</a>。</p>

<h2>常見問題</h2>
<p><strong>Q：完全唔知幾點出世，可唔可以算？</strong><br>A：可以嘗試定盤，但需時較長，建議面談。</p>
<p><strong>Q：定盤之後可唔可以改？</strong><br>A：師傅定盤後會鎖定時辰；若日後搵到新證據可再核對。</p>
<p><strong>Q：子時（23:00–01:00）點算？</strong><br>A：早子、晚子有分別，一定要師傅處理，唔好自己估。</p>

<h2>總結</h2>
<p>時辰唔肯定唔代表唔可以睇命 — 代表你需要<strong>定盤</strong>。先<a href="/chart">免費排盤</a>睇個大概，再 WhatsApp 預約 Sunny 師傅幫你對準命盤。</p>`,
  },
  {
    slug: "免費紫微排盤準唔準",
    category: "daily-insights",
    title: "香港免費紫微排盤準唔準？幾時要搵師傅全批？",
    publishedAt: "2026-06-26",
    image: "/images/chart-cover.png",
    contentHtml: `<p>網上<strong>免費紫微排盤</strong>工具越來越多，Destiny Home 都提供<a href="/chart">即時排盤及 AI 分析</a>。好多客人問：「免費版準唔準？使唔使搵師傅？」呢篇一次過講清楚。</p>

<h2>免費排盤準嘅部分</h2>
<ul>
<li><strong>安星起盤</strong>：採用中洲派三合派，星曜位置按曆法計算</li>
<li><strong>十二宮分布</strong>：命宮、財帛、夫妻等宮位結構</li>
<li><strong>基本性格方向</strong>：主星特質、簡單宮位提示</li>
<li><strong>真太陽時</strong>：可按出生地校正時辰</li>
</ul>
<p>若出生時間準確，免費盤已經可以幫你了解「大概係邊種人」。</p>

<h2>免費排盤局限</h2>
<ul>
<li>AI 分析只係參考，唔會針對你個人問題深入</li>
<li>大限、流年、四化飛星組合需要師傅經驗判斷</li>
<li>時辰唔肯定時，免費盤可能起錯盤</li>
<li>重大決定（結婚、轉工）唔建議只靠 AI</li>
</ul>

<h2>幾時要搵師傅全批？</h2>
<p>建議預約<strong>全批 HK$2,000</strong>如果：</p>
<ul>
<li>人生十字路口：轉工、創業、進修、移民</li>
<li>感情：拍拖、結婚、合婚、離婚考慮</li>
<li>想知未來十年大限</li>
<li>免費排盤睇完覺得「好似準又好似唔準」— 可能係定盤問題</li>
<li>想問具體問題，要師傅即場解答</li>
</ul>
<p>預約：<a href="/booking">收費及預約</a> · 灣仔<a href="/wan-chai-ziwei">工作室</a></p>

<h2>同其他網站有咩分別？</h2>
<p>Destiny Home 唔賣月費 AI 訂閱。免費工具係為咗等你有緣試用，真正深入解讀由<strong>真人師傅 Sunny</strong>負責 — 過千好評，中洲派紫微。</p>
<p>你可以無限次<a href="/chart">排盤</a>、用<a href="/compatibility">夾桃花</a>睇配對、睇<a href="/daily">流日</a>，然後 WhatsApp 預約師傅親批。</p>

<h2>總結</h2>
<p><strong>免費排盤準用於了解基本命格；全批準用於人生重大決定。</strong>兩者互補，唔使二選一。而家就可以免費起盤試吓。</p>`,
  },
  {
    slug: "夾桃花配對合婚攻略",
    category: "daily-insights",
    title: "夾桃花配對有用嗎？合婚前要知嘅事",
    publishedAt: "2026-06-27",
    image: "/images/chart-cover.png",
    contentHtml: `<p>拍拖穩定之後，好多情侶會問：「我哋夾唔夾？」Destiny Home 網站有<a href="/compatibility">夾桃花配對</a>功能，免費睇雙方紫微命盤配對分數。呢篇講配對有用嗎、同結婚前應該點樣用。</p>

<h2>夾桃花點計？</h2>
<p>系統根據雙方出生資料起盤，對照：</p>
<ul>
<li>夫妻宮、命宮交叉</li>
<li>福德宮、遷移宮等相處維度</li>
<li>主星組合與相處提示</li>
</ul>
<p>產生配對分數同簡短建議，供<strong>參考</strong>，唔係「分數低就唔可以一齊」。</p>

<h2>配對分數高代表咩？</h2>
<p>通常表示命盤上相處模式較順、價值觀接近、夫妻宮配合較好。但感情仲要睇：</p>
<ul>
<li>雙方有冇用心溝通</li>
<li>大限流年 — 邊幾年感情壓力較大</li>
<li>家庭背景、生活習慣</li>
</ul>

<h2>配對分數低代表咩？</h2>
<p>唔等於唔適合。可能代表：</p>
<ul>
<li>性格差異大，需要更多磨合</li>
<li>一方時辰唔準，影響結果</li>
<li>某個宮位有挑戰，但可以用相處方式補足</li>
</ul>
<p>想深入了解，建議預約師傅<strong>合婚全批</strong>或<a href="/wedding-date">結婚擇日</a>一併處理。</p>

<h2>結婚前建議做咩？</h2>
<ol>
<li><a href="/compatibility">免費夾桃花</a> — 初步了解相處模式</li>
<li>雙方確認出生時間（必要時<a href="/chart">排盤</a>或定盤）</li>
<li>預約師傅合婚／全批 — 講大限感情、結婚時機</li>
<li><a href="/wedding-date">擇日</a> — 揀註冊、擺酒吉時（HK$800）</li>
</ol>

<h2>常見問題</h2>
<p><strong>Q：只俾一方出生時間得唔得？</strong><br>A：要雙方資料先可以合盤。</p>
<p><strong>Q：同八字合婚有咩分別？</strong><br>A：紫微重宮位同星曜組合，角度同八字不同，可以互補參考。</p>

<h2>總結</h2>
<p><strong>夾桃花係合婚第一步</strong>，方便又免費。真正結婚前，建議搵 Sunny 師傅全批同擇日 — WhatsApp 預約，灣仔<a href="/wan-chai-ziwei">駱克道382號1807室</a>。</p>`,
  },
];

function main() {
  const db = JSON.parse(fs.readFileSync(OUT, "utf8"));
  let added = 0;
  let updated = 0;

  for (const item of ARTICLES) {
    const article = {
      slug: item.slug,
      category: item.category,
      title: item.title,
      content: item.contentHtml,
      image: item.image ?? null,
      publishedAt: item.publishedAt,
      sourceUrl: `https://www.destinyhomehk.com/academy/${item.category}/${encodeURIComponent(item.slug)}`,
      type: "blog",
    };

    const idx = db.articles.findIndex(
      (a) => a.category === article.category && a.slug === article.slug,
    );

    if (idx >= 0) {
      db.articles[idx] = article;
      updated++;
      console.log(`更新：${article.category}/${article.slug}`);
    } else {
      db.articles.unshift(article);
      added++;
      console.log(`新增：${article.category}/${article.slug}`);
    }
  }

  db.importedAt = new Date().toISOString();
  fs.writeFileSync(OUT, JSON.stringify(db, null, 2), "utf8");
  console.log(`\n完成：新增 ${added} 篇、更新 ${updated} 篇 · 共 ${db.articles.length} 篇`);
}

main();
