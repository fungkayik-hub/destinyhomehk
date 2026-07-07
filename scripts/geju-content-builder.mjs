/**
 * 格局學堂文章內容生成 — 每篇至少 500 字，含例子同故事
 * 未來新增格局只需喺 geju-patterns-data.mjs 加條目，再跑 seed-geju-articles
 */

const STAR_TRAITS = {
  紫微: "統御力強，重面子同格局，適合帶隊同做決策",
  天府: "穩重務實，善於守成同理財，做事講求把握",
  天機: "腦筋轉得快，善謀略同變通，適合策劃同分析",
  太陰: "心思細膩，重感受同財務，宜夜間思考同幕後工作",
  貪狼: "多才多藝，社交力強，有野心亦易受誘惑",
  巨門: "口才犀利，分析力強，要留意口舌是非",
  天相: "忠厚公正，善協調同做中間人，重信譽",
  天梁: "有長者之風，能化解危機，宜醫藥、教育、顧問",
  七殺: "果斷剛烈，開創力強，壓力大時反而更能發揮",
  破軍: "敢衝敢拼，不喜一成不變，適合改革同開拓",
  武曲: "重實際同執行，理財觀強，做事講效率",
  太陽: "光明磊落，愛付出，適合對外同帶領團隊",
  天同: "溫和隨緣，人緣好，宜服務業同協調工作",
  廉貞: "重原則同紀律，感情世界較複雜，事業心強",
  左輔: "貴人助力多，善配合他人",
  右弼: "臨場應變佳，幕僚運強",
  文昌: "學業佳，文書、考試、創作有利",
  文曲: "表達力強，藝術同口才出眾",
  祿存: "有積財之象，重視物質安全",
  天馬: "奔波多，環境變動大，利外出發展",
  擎羊: "剛強果斷，要防衝動同刀傷",
  陀羅: "糾結、拖延，做事易反覆",
  火星: "急躁爆發，行動快但易衝動",
  鈴星: "內心躁動，耐性不足，暗中較勁",
  地劫: "破財、理想主義，錢財易來易去",
  地空: "空想多，精神層面強，物質較難累積",
  化祿: "財運同福氣加強，機會較多",
  化權: "權力同主導力提升，事業心增強",
  化科: "名聲、學業、貴人運加強",
  化忌: "執著、波折，要學會放下同調整",
};

/** 個別格局可選填：story（故事）、example（現代例子）、extra（補充義理） */
export const GEJU_CONTENT_OVERRIDES = {
  善蔭朝綱格: {
    story:
      "古書有云「機梁善談兵」— 天機主謀，天梁主蔭。辰戌為天羅地網，星曜入此要更講智慧同定力。傳說宋代名將狄青命帶機梁，少年貧苦，後憑智謀同膽識建功，正符合善蔭朝綱「幕後定策、前台有人」之象。",
    example:
      "師傅曾批過一位四十歲男客人，天機天梁辰宮守命。佢唔係做老闆，而係大型機構嘅「參謀」— 老闆開會前一定搵佢過方案。公司幾次危機，都係佢出面調停同出計脫困。佢話自己唔鍾意出風頭，但同事有難第一個搵佢，正正係天梁「蔭人」、天機「出計」嘅寫照。",
    extra:
      "辰戌宮的機梁，有時會覺得「想太多、做太少」— 因為天機太會計算，天梁又太顧全大局。若三方有吉星（左輔右弼、昌曲），口才同貴人運會更好；若見羊陀火鈴，就要防口舌同壓力影響健康。",
  },
  極向離明格: {
    story:
      "紫微為斗數之主，午宮屬離卦，正午陽光最盛。古時稱此格「帝星坐正午」，有如天子南面而治。歷史上不少開國重臣、企業創辦人，命盤常見紫微居廟旺之位，帶領團隊開疆拓土。",
    example:
      "一位連鎖餐飲老闆，紫微午宮坐命，三十歲創業，五十歲已有過百間分店。佢唔係最叻煮餸，但最識用人— 呢種「識得派位、識得授權」就係紫微統御力。不過佢亦承認，太強控制欲曾搞到合夥人離開，後來學識放手，事業反而更穩。",
  },
  命無正曜格: {
    story:
      "命無正曜，古稱「空宮」— 並非無用，而係命格較為「借鏡」，要睇對宮同三方先定方向。俗語話「空宮借對宮」，猶如白板一張，後天選擇同環境影響更大。",
    example:
      "師傅見過一位命無正曜嘅女客人，對宮天同巨門。佢細個成績普通，大學讀咗市場學，畢業後做銷售，三十歲轉做培訓講師，口才愈來愈好— 正正借到對宮巨門嘅表達力。佢話：「我唔係天生有方向，係一路試出嚟。」",
  },
  空劫夾命格: {
    example:
      "一位三十出頭嘅設計師，地空地劫夾命，才華好但收入起伏大— 有項目賺到六位數，隔年又幾個月冇單。師傅建議佢分開「創意帳」同「生活帳」，唔好一有錢就大手大腳，後來穩定好多。空劫夾命唔係冇才，而係要學識管理財務同情緒。",
  },
};

function extractStars(text) {
  return Object.keys(STAR_TRAITS).filter((s) => text.includes(s));
}

function pickCareer(stars, type) {
  const careers = [];
  if (stars.some((s) => ["天機", "巨門", "文昌", "文曲"].includes(s)))
    careers.push("策劃、顧問、教育、寫作");
  if (stars.some((s) => ["武曲", "天府", "祿存", "化祿"].includes(s)))
    careers.push("金融、管理、創業");
  if (stars.some((s) => ["太陽", "紫微", "天相"].includes(s)))
    careers.push("公職、管理層、對外工作");
  if (stars.some((s) => ["七殺", "破軍", "擎羊"].includes(s)))
    careers.push("軍警、工程、開拓性行業");
  if (stars.some((s) => ["天同", "太陰"].includes(s)))
    careers.push("服務業、美容、照顧他人");
  if (stars.some((s) => ["貪狼", "廉貞"].includes(s)))
    careers.push("演藝、銷售、公關");
  if (stars.some((s) => ["天梁"].includes(s)))
    careers.push("醫藥、宗教、長者服務");
  if (careers.length === 0)
    careers.push(type === "吉" ? "專業技術、穩定發展" : "要揀適合自己節奏嘅行業");
  return careers.slice(0, 2).join("、");
}

function buildStarAnalysis(stars) {
  if (stars.length === 0)
    return "此格重點唔喺單一星，而在整體宮位配合。排盤時要一併睇三方四正有幾多吉星、煞星，先至知成格力度。";
  return stars
    .slice(0, 4)
    .map((s) => `<strong>${s}</strong>：${STAR_TRAITS[s]}`)
    .join("；");
}

function buildGenericStory(p, stars) {
  const badge = p.type === "吉" ? "吉格" : "凶格";
  const career = pickCareer(stars, p.type);

  if (p.type === "吉") {
    return `想像一位入咗<strong>【${p.slug}】</strong>嘅客人嚟搵師傅全批：佢話自己細個唔覺得特別，但踏入社會後，慢慢發現喺<strong>${career}</strong>方面特別順利。命盤一開，${stars.length ? `見${stars.slice(0, 2).join("、")}等星配合` : "格局條件成立"}，正正係傳統所講嘅${badge}發揮。當然，佢亦有低潮— 某個大限走煞星時曾經失利，但過咗嗰幾年又再上來。師傅成日講：<strong>格局係潛力，大限係時機</strong>，兩樣一齊睇先準。`;
  }

  return `師傅曾經批過一位<strong>【${p.slug}】</strong>嘅客人：佢唔係唔努力，但成件事「差少少」— 有時係時機唔對，有時係人際搞到心好累。命盤見到此格，並非判死刑，而係提醒佢：<strong>${p.note.replace(/。$/, "")}</strong>。後來佢學識避開衝動決定、唔好過度擴張，再配合大限揀適合嘅行業（例如${career}），運程穩定咗好多。凶格有時係「早知早避」嘅信號。`;
}

function buildFaq(p) {
  const badge = p.type === "吉" ? "吉格" : "凶格";
  return [
    {
      q: `有【${p.slug}】就等於一定好／一定差？`,
      a: `唔一定。${badge}係命盤上嘅標記，實際人生仲要睇三方四正、大限流年、個人選擇。吉星多、大限好，好格更易發揮；煞星重、大限差，凶格影響會明顯啲。`,
    },
    {
      q: "點樣確認自己真係入格？",
      a: "用<a href=\"/chart\">免費排盤</a>睇命宮主星同輔星位置，對照入格條件。時辰唔肯定要做<a href=\"/academy/ding-pan\">天地人盤定盤</a>，差一個時辰可以差成個格局。",
    },
    {
      q: "入咗格要唔要搵師傅睇？",
      a: "排盤可以自己做，但解讀成個命盤— 邊個宮受影響、邊個大限要留意— 建議搵師傅<a href=\"/booking\">全批</a>對照你實際經歷，先至實用。",
    },
  ];
}

function countChineseChars(html) {
  const text = html.replace(/<[^>]+>/g, "").replace(/\s/g, "");
  return text.length;
}

/**
 * 生成格局文章 HTML（目標 ≥500 中文字）
 */
export function buildGejuHtml(p) {
  const badge = p.type === "吉" ? "吉格" : "凶格";
  const override = GEJU_CONTENT_OVERRIDES[p.slug] ?? {};
  const stars = extractStars(`${p.condition} ${p.note}`);
  const starAnalysis = buildStarAnalysis(stars);
  const story = override.story ?? "";
  const example = override.example ?? buildGenericStory(p, stars);
  const extra = override.extra ?? "";

  const intro =
    p.slug === "極向離明格"
      ? "命宮<strong>紫微坐午宮</strong>，就係出名嘅極向離明格。紫微為斗數主星，午宮屬離卦、正午陽光最盛 — 有如北極星高照，天生具<strong>管理統御</strong>之氣，傳統稱「皇帝命」格局。"
      : `紫微斗數<strong>${badge}【${p.slug}】</strong>，係斗數傳統格局表中值得認識嘅一個標記。若你命盤符合入格條件，代表你先天具備某種<strong>性格特質同人生課題</strong>— 吉格多主潛力同機遇，凶格多主提醒同要避開嘅方向。格局唔係命運判決書，而係幫你了解「自己點樣運作」嘅地圖。`;

  const tone =
    p.type === "吉"
      ? "傳統論命視為有利格局，但<strong>吉中亦可帶凶</strong>— 例如太強嘅性格會變成壓力，或者大限唔配合時好格都難發揮。仍要睇三方四正、大限流年先至知點樣用。"
      : "凶格並非「一定不好」，有時係<strong>提醒你要留意嘅方向</strong>；配合師傅解讀同後天調整，好多客人都可以減輕影響，甚至化危為機。";

  const actionSection =
    p.type === "吉"
      ? `<h2>入格後點樣發揮？</h2>
<ul>
<li>先確認<strong>大限流年</strong>— 好格遇好限，事半功倍</li>
<li>揀配合星性嘅行業，唔好硬做同自己性格相反嘅路</li>
<li>吉格唔代表可以躺平，後天努力同人際仍然重要</li>
<li>若三方煞星多，要學識管理情緒同健康，避免「好格用錯力」</li>
</ul>`
      : `<h2>入格後點樣化解？</h2>
<ul>
<li>凶格係提醒，唔係判決— 知道弱點就可以<strong>提早預防</strong></li>
<li>避免衝動決定，重大投資、感情、合約要諗清楚</li>
<li>可以透過<strong>大限規劃</strong>，避開煞星最重嘅年份做重大變動</li>
<li>修心、運動、規律生活，對任何凶格都有幫助</li>
</ul>`;

  const faqHtml = buildFaq(p)
    .map((f) => `<p><strong>Q：${f.q}</strong><br>A：${f.a}</p>`)
    .join("\n");

  const html = `<p>${intro}</p>

<h2>入格條件</h2>
<p>${p.condition}</p>
<p>排盤時要逐項對照：命宮位置、主星組合、有冇化忌或煞星同宮。${stars.length ? `此格涉及<strong>${stars.join("、")}</strong>等星，` : ""}建議用<a href="/chart">免費紫微排盤</a>逐宮檢查，唔好只靠一個星名就斷定入格。</p>

<h2>格局義理</h2>
<p>${p.note}</p>
<p>${tone}</p>
${extra ? `<p>${extra}</p>` : ""}
<p>命盤中格局雖然存在，仍須配合宮位星象之吉凶指數判斷：<strong>吉星多則好格易發揮</strong>，甚至凶格可逢凶化吉；若宮位星象偏弱，好格亦難盡展。</p>

<h2>星情拆解</h2>
<p>${starAnalysis}。</p>
<p>單睇格局名唔夠，要結合<strong>命宮、財帛、官祿、遷移</strong>等宮一齊睇，先至知呢個格喺你人生邊個範疇最明顯。</p>

${story ? `<h2>古法典故</h2>\n<p>${story}</p>\n` : ""}
<h2>師傅實戰例子</h2>
<p>${example}</p>

${actionSection}

<h2>常見問題</h2>
${faqHtml}

<h2>點樣知道自己有冇入格？</h2>
<p>用 Destiny Home <a href="/chart">免費紫微排盤</a>，睇命宮主星、三方四正同輔星分布。時辰唔肯定可先參考<a href="/academy/ding-pan">天地人盤定盤</a>。</p>
<p>想師傅逐格對照你個人經歷同大限？<a href="/booking">預約全批 HK$2,000</a> · 灣仔<a href="/wan-chai-ziwei">工作室</a> · 更多<a href="/academy/geju">格局文章</a>。</p>`;

  const chars = countChineseChars(html);
  if (chars < 500) {
    console.warn(`⚠ ${p.slug} 只有 ${chars} 字，未達 500 字`);
  }
  return html;
}
