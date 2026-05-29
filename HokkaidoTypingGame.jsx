import { useState, useEffect, useMemo, useRef, useCallback } from "react";

/* ---------- 北海道 全179市町村データ ---------- */
const DATA = [
  // 石狩振興局 (8)
  { name: "札幌市", reading: "さっぽろし", roma: "sapporoshi", region: "石狩", lat: 43.064, lng: 141.347, population: "197万人", specialty: ["スープカレー", "ジンギスカン", "味噌ラーメン"], spots: ["大通公園", "時計台", "北海道神宮"], trivia: "北海道庁所在地・道内最大の政令指定都市" },
  { name: "江別市", reading: "えべつし", roma: "ebetsushi", region: "石狩", lat: 43.104, lng: 141.535, population: "12万人", specialty: ["小麦", "えべつやきもの市"], spots: ["野幌森林公園", "北海道博物館"], trivia: "小麦の生産が盛んで製パン企業が多い農業都市" },
  { name: "千歳市", reading: "ちとせし", roma: "chitoseshi", region: "石狩", lat: 42.821, lng: 141.652, population: "9.7万人", specialty: ["千歳サーモン", "支笏湖ひめます"], spots: ["支笏湖", "新千歳空港"], trivia: "新千歳空港の所在地。支笏湖は日本最北の不凍湖" },
  { name: "恵庭市", reading: "えにわし", roma: "eniwashi", region: "石狩", lat: 42.886, lng: 141.578, population: "7万人", specialty: ["花き", "アスパラガス"], spots: ["えにわ湖", "恵庭渓谷"], trivia: "「花のまち」として知られ、道内有数の花き産地" },
  { name: "北広島市", reading: "きたひろしまし", roma: "kitahiroshimashi", region: "石狩", lat: 42.985, lng: 141.564, population: "5.8万人", specialty: ["アスパラガス", "トマト"], spots: ["エスコンフィールドHOKKAIDO", "島松沢"], trivia: "2023年開業・日本ハムファイターズの本拠地エスコンフィールドがある" },
  { name: "石狩市", reading: "いしかりし", roma: "ishikarishi", region: "石狩", lat: 43.241, lng: 141.354, population: "5.9万人", specialty: ["石狩鍋", "サーモン", "数の子"], spots: ["石狩浜", "はまなすの丘公園"], trivia: "石狩鍋発祥の地。石狩川河口に位置する港町" },
  { name: "当別町", reading: "とうべつちょう", roma: "toubetsuchou", region: "石狩", lat: 43.220, lng: 141.521, population: "2.2万人", specialty: ["当別産米", "スウェーデン交流"], spots: ["スウェーデンヒルズ", "当別ダム"], trivia: "スウェーデンと友好関係を結び、北欧デザインの住宅街「スウェーデンヒルズ」がある" },
  { name: "新篠津村", reading: "しんしのつむら", roma: "shinshinotsumura", region: "石狩", lat: 43.193, lng: 141.640, population: "0.3万人", specialty: ["新篠津米", "ワカサギ"], spots: ["しのつ湖（なまこ池）", "しのつ公園キャンプ場"], trivia: "しのつ湖のワカサギ釣りが有名。石狩川の恵みを受ける農業の村" },

  // 渡島総合振興局 (11)
  { name: "函館市", reading: "はこだてし", roma: "hakodateshi", region: "渡島", lat: 41.769, lng: 140.729, population: "25万人", specialty: ["イカ", "函館塩ラーメン", "昆布"], spots: ["函館山", "元町", "五稜郭"], trivia: "函館山からの夜景は日本三大夜景のひとつ。明治の開港以来の異国情緒ある街並みが残る" },
  { name: "北斗市", reading: "ほくとし", roma: "hokutoshi", region: "渡島", lat: 41.825, lng: 140.659, population: "4.7万人", specialty: ["もち米", "北斗そば"], spots: ["新函館北斗駅", "大野平野"], trivia: "北海道新幹線の北海道側終着駅・新函館北斗駅がある" },
  { name: "松前町", reading: "まつまえちょう", roma: "matsumaechou", region: "渡島", lat: 41.428, lng: 140.110, population: "0.7万人", specialty: ["松前漬け", "マグロ"], spots: ["松前城", "松前公園（桜）"], trivia: "北海道唯一の和式城郭・松前城と1万本の桜で有名" },
  { name: "福島町", reading: "ふくしまちょう", roma: "fukushimachou", region: "渡島", lat: 41.488, lng: 140.249, population: "0.3万人", specialty: ["マグロ", "たこ"], spots: ["横綱千代の山・千代の富士記念館", "福島大神宮"], trivia: "元横綱「千代の富士」の出身地。マグロ漁業でも知られる津軽海峡に面した町" },
  { name: "知内町", reading: "しりうちちょう", roma: "shiriuchichou", region: "渡島", lat: 41.589, lng: 140.430, population: "0.4万人", specialty: ["しりうちたけのこ", "ニラ"], spots: ["知内温泉（道内最古級）", "北海道新幹線湯の里知内信号場"], trivia: "たけのこの産地として有名。道内最古級の知内温泉を持つ" },
  { name: "木古内町", reading: "きこないちょう", roma: "kikonaichou", region: "渡島", lat: 41.679, lng: 140.435, population: "0.4万人", specialty: ["道南杉", "木古内牛"], spots: ["道の駅みそぎの郷きこない", "佐女川神社（みそぎ祭り）"], trivia: "毎年1月に行われる「みそぎ祭り」は氷の張った川でみそぎをする寒中行事で全国的に有名" },
  { name: "七飯町", reading: "ななえちょう", roma: "nanaechou", region: "渡島", lat: 41.886, lng: 140.689, population: "2.8万人", specialty: ["りんご（道南最大産地）", "七飯産米"], spots: ["大沼国定公園", "城岱牧場（函館夜景）"], trivia: "北海道りんご栽培発祥の地。城岱牧場からの「裏夜景」は函館山とは違う絶景" },
  { name: "鹿部町", reading: "しかべちょう", roma: "shikabechou", region: "渡島", lat: 42.039, lng: 140.795, population: "0.35万人", specialty: ["たらこ", "ほたて"], spots: ["鹿部間欠泉（北海道遺産）", "しかべ間欠泉公園"], trivia: "海底から温泉が湧き出る「鹿部間欠泉」は北海道遺産に指定された珍しい自然現象" },
  { name: "森町", reading: "もりまち", roma: "morimachi", region: "渡島", lat: 42.106, lng: 140.575, population: "1.5万人", specialty: ["いかめし", "砂原ワイン"], spots: ["駒ヶ岳", "大沼国定公園"], trivia: "駅弁「いかめし」発祥の地として有名" },
  { name: "八雲町", reading: "やくもちょう", roma: "yakumochou", region: "渡島", lat: 42.255, lng: 140.270, population: "1.7万人", specialty: ["八雲和牛", "牡蠣（噴火湾）"], spots: ["遊楽部川（鮭の遡上）", "八雲町木彫り熊資料館"], trivia: "北海道の木彫り熊文化発祥地のひとつ。噴火湾の牡蠣養殖も盛ん" },
  { name: "長万部町", reading: "おしゃまんべちょう", roma: "oshamambechou", region: "渡島", lat: 42.514, lng: 140.380, population: "0.5万人", specialty: ["かにめし", "ホタテ"], spots: ["長万部温泉", "二股らじうむ温泉"], trivia: "駅弁「かにめし」が有名。難読地名としても知られる" },

  // 檜山振興局 (7)
  { name: "江差町", reading: "えさしちょう", roma: "esashichou", region: "檜山", lat: 41.869, lng: 140.128, population: "0.8万人", specialty: ["ニシン", "江差追分"], spots: ["開陽丸記念館", "姥神大神宮"], trivia: "江差追分の発祥の地。幕末の軍艦・開陽丸の展示がある" },
  { name: "上ノ国町", reading: "かみのくにちょう", roma: "kaminokunichou", region: "檜山", lat: 41.808, lng: 140.114, population: "0.5万人", specialty: ["ウニ", "アワビ"], spots: ["夷王山展望台", "上ノ国町勝山館跡"], trivia: "道内最古の和人の城「勝山館跡」がある。アイヌと和人が交流した歴史の地" },
  { name: "厚沢部町", reading: "あっさぶちょう", roma: "assabuchou", region: "檜山", lat: 41.875, lng: 140.231, population: "0.4万人", specialty: ["メークイン（じゃがいも）", "アスパラ"], spots: ["館城跡（箱館戦争）", "賀老の滝"], trivia: "メークイン発祥の地とされるじゃがいもの産地。箱館戦争の史跡もある" },
  { name: "乙部町", reading: "おとべちょう", roma: "otobechou", region: "檜山", lat: 41.972, lng: 140.140, population: "0.35万人", specialty: ["昆布", "ウニ"], spots: ["館浦海岸（縄文遺跡）", "乙部岳"], trivia: "日本海に面した昆布の産地。縄文時代の遺跡が発掘されている歴史ある町" },
  { name: "奥尻町", reading: "おくしりちょう", roma: "okushirichou", region: "檜山", lat: 42.171, lng: 139.508, population: "0.25万人", specialty: ["ウニ", "アワビ", "うに丼"], spots: ["奥尻島", "賽の河原"], trivia: "1993年北海道南西沖地震の被災地。現在は海の幸が豊富な離島として復興" },
  { name: "今金町", reading: "いまかねちょう", roma: "imakanechou", region: "檜山", lat: 42.434, lng: 140.012, population: "0.5万人", specialty: ["今金男爵（じゃがいも）", "チーズ"], spots: ["今金ピリカ遺跡", "朱太川（清流）"], trivia: "「今金男爵」は北海道を代表するブランドじゃがいも。朱太川の清流でも有名" },
  { name: "せたな町", reading: "せたなちょう", roma: "setanachou", region: "檜山", lat: 42.434, lng: 139.846, population: "0.7万人", specialty: ["ウニ", "ほっけ", "いか"], spots: ["太田山神社（断崖の神社）", "賀老高原"], trivia: "太田山神社は断崖絶壁をよじ登る北海道最難関の神社。命がけの参拝で有名" },

  // 後志総合振興局 (20)
  { name: "小樽市", reading: "おたるし", roma: "otarushi", region: "後志", lat: 43.191, lng: 140.995, population: "11万人", specialty: ["かまぼこ", "海鮮", "ガラス細工", "小樽ビール"], spots: ["小樽運河", "寿司屋通り", "堺町通り"], trivia: "大正ロマンあふれる石造り倉庫群と運河が有名。北海道の銀行・商業の中心地だった" },
  { name: "島牧村", reading: "しままきむら", roma: "shimamakimura", region: "後志", lat: 42.667, lng: 140.124, population: "0.14万人", specialty: ["ウニ", "アワビ", "鮭"], spots: ["賀老の滝（日本の滝百選）", "チセヌプリ"], trivia: "落差70mの「賀老の滝」は日本の滝百選に選ばれた秘境の名瀑" },
  { name: "寿都町", reading: "すっつちょう", roma: "suttsuchou", region: "後志", lat: 42.795, lng: 140.227, population: "0.3万人", specialty: ["ほっけ", "ウニ"], spots: ["弁慶岬", "寿都風力発電所"], trivia: "日本屈指の風の強さを誇る「風の町」。全国に先駆けて風力発電を導入した" },
  { name: "黒松内町", reading: "くろまつないちょう", roma: "kuromatsunaichou", region: "後志", lat: 42.673, lng: 140.317, population: "0.3万人", specialty: ["黒松内牛乳", "チーズ（トワ・ヴェール）"], spots: ["歌才ブナ林（天然記念物）", "黒松内温泉"], trivia: "国の天然記念物「歌才ブナ林」はブナの北限地。世界自然遺産候補にもなっている" },
  { name: "蘭越町", reading: "らんこしちょう", roma: "rankoshichou", region: "後志", lat: 42.804, lng: 140.488, population: "0.5万人", specialty: ["らんこし米（銘柄米）", "わさび"], spots: ["ニセコアンヌプリ（蘭越側）", "目名川ほたる"], trivia: "羊蹄山の伏流水が育む「らんこし米」は粘りと甘みの強い銘柄米" },
  { name: "ニセコ町", reading: "にせこちょう", roma: "nisekochou", region: "後志", lat: 42.806, lng: 140.682, population: "0.5万人", specialty: ["ニセコチーズ", "じゃがいも", "米"], spots: ["グランヒラフ", "羊蹄山", "ニセコ温泉郷"], trivia: "世界有数のパウダースノーで外国人スキーヤーに絶大な人気を誇るリゾート地" },
  { name: "真狩村", reading: "まっかりむら", roma: "makkarimura", region: "後志", lat: 42.770, lng: 140.799, population: "0.2万人", specialty: ["ゆり根（生産量全国一）", "アスパラ"], spots: ["細川たかし記念像", "真狩温泉"], trivia: "ゆり根（百合根）の生産量全国一。演歌歌手・細川たかしの出身地で記念像がある" },
  { name: "留寿都村", reading: "るすつむら", roma: "rusutsumura", region: "後志", lat: 42.741, lng: 140.870, population: "0.2万人", specialty: ["とうもろこし", "じゃがいも"], spots: ["ルスツリゾート（テーマパーク型スキー場）"], trivia: "北海道最大級のテーマパーク型スキーリゾート「ルスツリゾート」がある観光の村" },
  { name: "喜茂別町", reading: "きもべつちょう", roma: "kimobetsuchou", region: "後志", lat: 42.795, lng: 140.916, population: "0.2万人", specialty: ["じゃがいも", "トマト"], spots: ["中山峠（あげいも）", "尻別川"], trivia: "中山峠の名物「あげいも」は北海道ドライブの定番グルメとして親しまれている" },
  { name: "京極町", reading: "きょうごくちょう", roma: "kyougokuchou", region: "後志", lat: 42.873, lng: 140.873, population: "0.3万人", specialty: ["ふきだし湧水", "じゃがいも"], spots: ["ふきだし公園（羊蹄のふきだし湧水）"], trivia: "「羊蹄のふきだし湧水」は名水百選に選ばれた北海道有数の名水" },
  { name: "倶知安町", reading: "くっちゃんちょう", roma: "kucchanchou", region: "後志", lat: 42.901, lng: 140.755, population: "1.6万人", specialty: ["じゃがいも", "ニセコ米"], spots: ["ニセコアンヌプリ", "羊蹄山"], trivia: "ニセコリゾートエリアの中心地。外国人移住者が多く「北海道の国際都市」とも" },
  { name: "共和町", reading: "きょうわちょう", roma: "kyouwachou", region: "後志", lat: 42.991, lng: 140.535, population: "0.6万人", specialty: ["男爵いも（発祥地）", "とうきび"], spots: ["共和町農業センター", "雷電温泉"], trivia: "男爵いも発祥の地のひとつ。川田龍吉男爵がじゃがいも栽培を導入した歴史を持つ" },
  { name: "岩内町", reading: "いわないちょう", roma: "iwanaichou", region: "後志", lat: 42.978, lng: 140.508, population: "1.2万人", specialty: ["タコ", "にしん", "いわない岳こんぶ"], spots: ["岩内温泉", "いわない高原"], trivia: "日本でたこざんまい料理を広めた「タコの町」。ニシン漁で栄えた歴史を持つ" },
  { name: "泊村", reading: "とまりむら", roma: "tomarimura", region: "後志", lat: 43.030, lng: 140.501, population: "0.17万人", specialty: ["ウニ", "いか"], spots: ["北海道電力泊発電所（原子力）", "とまりん館"], trivia: "北海道唯一の原子力発電所がある村。豊富な漁場でウニやいかも水揚げされる" },
  { name: "神恵内村", reading: "かもえないむら", roma: "kamoenaimura", region: "後志", lat: 43.097, lng: 140.434, population: "0.09万人", specialty: ["ウニ", "アワビ", "タコ"], spots: ["神恵内海岸（奇岩）", "西積丹青少年体験活動支援センター"], trivia: "積丹半島の付け根に位置し、透明度の高い海と奇岩が続く景勝地" },
  { name: "積丹町", reading: "しゃこたんちょう", roma: "shakotanchou", region: "後志", lat: 43.281, lng: 140.466, population: "0.2万人", specialty: ["ウニ", "積丹ブルー"], spots: ["積丹岬（積丹ブルー）", "島武意海岸"], trivia: "エメラルドブルーの海「積丹ブルー」と絶品ウニが有名な半島" },
  { name: "古平町", reading: "ふるびらちょう", roma: "furubirachou", region: "後志", lat: 43.218, lng: 140.625, population: "0.3万人", specialty: ["ウニ", "ほたて"], spots: ["フゴッペ洞窟（国史跡・彫刻岩）", "古平川渓谷"], trivia: "国の史跡「フゴッペ洞窟」には約2500年前の古代人が刻んだ彫刻が残る貴重な遺跡" },
  { name: "仁木町", reading: "にきちょう", roma: "nikichou", region: "後志", lat: 43.143, lng: 140.752, population: "0.35万人", specialty: ["さくらんぼ", "ぶどう", "りんご"], spots: ["仁木フルーツ狩り", "然別川"], trivia: "「フルーツ王国」として知られ、特にさくらんぼは北海道トップクラスの産地" },
  { name: "余市町", reading: "よいちちょう", roma: "yoichichou", region: "後志", lat: 43.193, lng: 140.790, population: "1.9万人", specialty: ["ウイスキー", "さくらんぼ", "リンゴ"], spots: ["ニッカウヰスキー余市蒸溜所", "余市宇宙記念館"], trivia: "NHKドラマ「マッサン」の舞台。ニッカウヰスキー発祥の地" },
  { name: "赤井川村", reading: "あかいがわむら", roma: "akaigawamura", region: "後志", lat: 43.085, lng: 140.811, population: "0.1万人", specialty: ["カルデラ米", "りんご"], spots: ["キロロリゾート（スキー）", "赤井川カルデラ"], trivia: "火山噴火でできたカルデラ（くぼ地）の中に広がる珍しい農村。キロロスキー場で有名" },

  // 空知総合振興局 (24)
  { name: "夕張市", reading: "ゆうばりし", roma: "yuubarishi", region: "空知", lat: 43.057, lng: 141.974, population: "0.7万人", specialty: ["夕張メロン"], spots: ["夕張市石炭博物館", "紅葉山公園"], trivia: "夕張メロンで世界的に有名。かつての炭鉱都市で2007年に財政破綻した" },
  { name: "岩見沢市", reading: "いわみざわし", roma: "iwamizawashi", region: "空知", lat: 43.196, lng: 141.776, population: "7.8万人", specialty: ["いわみざわ米", "ばら"], spots: ["いわみざわ公園ばら園", "北海道グリーンランド"], trivia: "バラが市の花。いわみざわ公園のばら園は道内最大規模" },
  { name: "美唄市", reading: "びばいし", roma: "bibaishi", region: "空知", lat: 43.319, lng: 141.854, population: "2.1万人", specialty: ["美唄焼き鳥", "美唄米"], spots: ["アルテピアッツァ美唄", "宮島沼"], trivia: "炭鉱閉山後に生まれた野外彫刻美術館「アルテピアッツァ美唄」が有名" },
  { name: "芦別市", reading: "あしべつし", roma: "ashibetsushi", region: "空知", lat: 43.510, lng: 142.190, population: "1.3万人", specialty: ["ジンギスカン", "そば"], spots: ["三段滝（日本の滝百選）", "星の降る里百年記念館"], trivia: "「銀河の里」として親しまれ、三段滝は日本の滝百選に選ばれた名瀑" },
  { name: "赤平市", reading: "あかびらし", roma: "akabirashi", region: "空知", lat: 43.550, lng: 142.052, population: "1万人", specialty: ["炭鉱遺産", "赤平産米"], spots: ["旧住友赤平炭鉱立坑施設（北海道遺産）"], trivia: "旧住友赤平炭鉱の立坑施設は近代化産業遺産として北海道遺産に指定されている" },
  { name: "三笠市", reading: "みかさし", roma: "mikasashi", region: "空知", lat: 43.252, lng: 141.879, population: "0.8万人", specialty: ["アンモナイト", "クリスタルビューティ（米）"], spots: ["三笠ジオパーク", "幾春別川"], trivia: "世界的に有名なアンモナイト化石の産地。三笠ジオパークに認定" },
  { name: "滝川市", reading: "たきかわし", roma: "takikawashi", region: "空知", lat: 43.557, lng: 141.910, population: "3.9万人", specialty: ["菜の花", "そば", "ひまわり"], spots: ["滝川スカイスポーツ公園", "たきかわ菜の花まつり"], trivia: "グライダーの聖地として知られ、日本一の菜の花畑でも有名" },
  { name: "砂川市", reading: "すながわし", roma: "sunagawashi", region: "空知", lat: 43.493, lng: 141.910, population: "1.6万人", specialty: ["北菓楼（スイーツ）", "砂川れんが"], spots: ["北海道子どもの国", "砂川オアシスパーク"], trivia: "北海道を代表するスイーツブランド「北菓楼」発祥の地" },
  { name: "歌志内市", reading: "うたしないし", roma: "utashinaishi", region: "空知", lat: 43.516, lng: 142.022, population: "0.3万人", specialty: ["チロルの湯（温泉）", "かも川酒造"], spots: ["かもい岳スキー場", "チロルの湯"], trivia: "人口は道内最小の市。かつては炭鉱で栄え、かも川スキー場などで観光に力を入れている" },
  { name: "深川市", reading: "ふかがわし", roma: "fukagawashi", region: "空知", lat: 43.722, lng: 142.054, population: "2万人", specialty: ["深川米", "そば"], spots: ["道の駅ライスランドふかがわ", "音江連山"], trivia: "北海道米の一大産地。「深川米」は全国的に評価が高い" },
  { name: "南幌町", reading: "なんぽろちょう", roma: "namporochou", region: "空知", lat: 43.075, lng: 141.654, population: "0.7万人", specialty: ["南幌メロン", "ゆり"], spots: ["南幌温泉（にじいろの湯）", "花の牧場"], trivia: "メロンとゆりの産地。「にじいろの湯」は道央圏で人気の温泉施設" },
  { name: "奈井江町", reading: "ないえちょう", roma: "naiechou", region: "空知", lat: 43.426, lng: 141.882, population: "0.5万人", specialty: ["奈井江産米", "うど"], spots: ["奈井江温泉", "双子沼自然公園"], trivia: "うどの産地として知られる。かつての炭鉱都市で現在は農業と温泉の町" },
  { name: "上砂川町", reading: "かみすながわちょう", roma: "kamisunagawachou", region: "空知", lat: 43.480, lng: 142.043, population: "0.25万人", specialty: ["上砂川産米", "メロン"], spots: ["北海道地下無重力実験センター跡（旧歌志内）", "道の駅スタープラザ"], trivia: "廃坑を利用した日本唯一の地下無重力実験施設がかつてあった。宇宙研究の歴史を持つ" },
  { name: "由仁町", reading: "ゆにちょう", roma: "yunichou", region: "空知", lat: 42.989, lng: 141.793, population: "0.5万人", specialty: ["ゆにガーデン（花）", "花卉"], spots: ["ゆにガーデン（英国式庭園）", "由仁温泉"], trivia: "英国式庭園「ゆにガーデン」は北海道を代表する花の名所。バラや宿根草が咲き誇る" },
  { name: "長沼町", reading: "ながぬまちょう", roma: "naganumachou", region: "空知", lat: 42.984, lng: 141.708, population: "1万人", specialty: ["長沼メロン", "スイートコーン"], spots: ["マオイの丘公園", "長沼温泉"], trivia: "マオイの丘からは晴れた日に日高山脈が一望できる。道央圏の野菜の一大産地" },
  { name: "栗山町", reading: "くりやまちょう", roma: "kuriyamachou", region: "空知", lat: 43.052, lng: 141.838, population: "1.2万人", specialty: ["くりやまコロッケ", "栗山産米"], spots: ["栗山公園（桜）", "北海道日本ハムファイターズ栗山監督ゆかりの地"], trivia: "WBC2023優勝に導いた栗山英樹元監督の出身地。コロッケで町おこしをしている" },
  { name: "月形町", reading: "つきがたちょう", roma: "tsukigatachou", region: "空知", lat: 43.317, lng: 141.694, population: "0.3万人", specialty: ["月形産米", "つきがたメロン"], spots: ["月形樺戸博物館（旧樺戸集治監）", "月形温泉"], trivia: "明治時代に囚人が開拓した「樺戸集治監（監獄）」跡を博物館として公開している" },
  { name: "浦臼町", reading: "うらうすちょう", roma: "urausuchou", region: "空知", lat: 43.430, lng: 141.776, population: "0.2万人", specialty: ["鶴沼ワイン", "浦臼産米"], spots: ["鶴沼ワイナリー", "浦臼神社（エゾエンゴサク群生）"], trivia: "鶴沼ワイナリーは北海道の代表的なワイン産地。春に咲くエゾエンゴサクの群生が美しい" },
  { name: "新十津川町", reading: "しんとつかわちょう", roma: "shintotsukawachou", region: "空知", lat: 43.547, lng: 141.840, population: "0.6万人", specialty: ["新十津川産米", "砂金（石狩川）"], spots: ["新十津川物産館", "石狩川（砂金採取体験）"], trivia: "奈良県十津川村の水害被災者が1889年に移住し開拓。砂金採りが体験できる" },
  { name: "妹背牛町", reading: "もせうしちょう", roma: "moseushichou", region: "空知", lat: 43.692, lng: 141.937, population: "0.3万人", specialty: ["妹背牛産米", "麦"], spots: ["妹背牛温泉ペペル", "石狩川"], trivia: "「妹背牛」は「もせうし」と読む北海道らしい難読地名。アイヌ語「モセウシ」に由来" },
  { name: "秩父別町", reading: "ちっぷべつちょう", roma: "chippubetsuchou", region: "空知", lat: 43.787, lng: 141.946, population: "0.25万人", specialty: ["ちっぷべつ米", "麦"], spots: ["道の駅ちっぷ・ゆう・じゅ"], trivia: "「秩父別」は「ちっぷべつ」と読む難読地名。アイヌ語「チプ・ウシ（舟を置く所）」に由来" },
  { name: "雨竜町", reading: "うりゅうちょう", roma: "uryuuchou", region: "空知", lat: 43.633, lng: 141.876, population: "0.25万人", specialty: ["雨竜産米", "そば"], spots: ["雨竜沼湿原（ラムサール条約登録）"], trivia: "ラムサール条約登録の「雨竜沼湿原」は高層湿原でニッコウキスゲが咲き誇る" },
  { name: "北竜町", reading: "ほくりゅうちょう", roma: "hokuryuuchou", region: "空知", lat: 43.751, lng: 141.857, population: "0.17万人", specialty: ["ひまわり油", "ひまわり米"], spots: ["ひまわりの里（北竜町）"], trivia: "150万本のひまわりが咲き誇る「ひまわりの里」は北海道の夏の絶景スポット" },
  { name: "沼田町", reading: "ぬまたちょう", roma: "numatachou", region: "空知", lat: 43.819, lng: 141.928, population: "0.3万人", specialty: ["沼田産米", "ほたる"], spots: ["ほたるの里（蛍の名所）", "夜高あんどん祭り"], trivia: "ほたるの乱舞と勇壮な「夜高あんどん祭り」で有名な「光の町」" },

  // 上川総合振興局 (23)
  { name: "旭川市", reading: "あさひかわし", roma: "asahikawashi", region: "上川", lat: 43.770, lng: 142.365, population: "32万人", specialty: ["旭川ラーメン", "旭川家具", "地酒"], spots: ["旭山動物園", "層雲峡", "男山酒造"], trivia: "北海道第二の都市。旭山動物園は「行動展示」で全国入場者数1位を誇った時期もある" },
  { name: "士別市", reading: "しべつし", roma: "shibetsushi", region: "上川", lat: 44.179, lng: 142.401, population: "1.7万人", specialty: ["サフォーク羊肉", "士別米"], spots: ["士別サーキット", "朝日サンライズトレイル"], trivia: "各メーカーの自動車・バイクが雪上・氷上テストを行う「テストドライバーの聖地」" },
  { name: "名寄市", reading: "なよろし", roma: "nayoroshi", region: "上川", lat: 44.353, lng: 142.463, population: "2.6万人", specialty: ["もち米（生産量日本一）", "アスパラガス"], spots: ["なよろ市立天文台「きたすばる」", "名寄ピヤシリスキー場"], trivia: "もち米の生産量日本一。北海道内でも有数の星空観察地" },
  { name: "富良野市", reading: "ふらのし", roma: "furanoshi", region: "上川", lat: 43.343, lng: 142.383, population: "2.1万人", specialty: ["ラベンダー", "富良野メロン", "チーズ"], spots: ["ファーム富田", "ニングルテラス", "フラノマルシェ"], trivia: "ラベンダー畑が広がる観光地。北海道のほぼ中心に位置し「北海道のへそ」とも呼ばれる" },
  { name: "鷹栖町", reading: "たかすちょう", roma: "takasuchou", region: "上川", lat: 43.870, lng: 142.349, population: "0.7万人", specialty: ["鷹栖産米（タカシマイ）", "アスパラ"], spots: ["たかす農場", "忠烈布川"], trivia: "旭川市に隣接し、ブランド米「タカシマイ」で知られる田園都市" },
  { name: "東神楽町", reading: "ひがしかぐらちょう", roma: "higashikagurachou", region: "上川", lat: 43.682, lng: 142.481, population: "1万人", specialty: ["東神楽産米", "花き"], spots: ["花神楽（フラワーパーク）", "旭川空港（隣接）"], trivia: "旭川空港に隣接し、花の生産が盛ん。人口が増え続ける移住人気の住宅都市" },
  { name: "当麻町", reading: "とうまちょう", roma: "toumachou", region: "上川", lat: 43.815, lng: 142.521, population: "0.6万人", specialty: ["当麻産米", "でんすけすいか（隣接産地）"], spots: ["当麻鍾乳洞（北海道遺産）", "当麻山"], trivia: "道内では珍しい「当麻鍾乳洞」は北海道遺産に指定。3億年前のサンゴ礁が起源" },
  { name: "比布町", reading: "ぴっぷちょう", roma: "pippuchou", region: "上川", lat: 43.857, lng: 142.475, population: "0.35万人", specialty: ["ぴっぷスキー場", "比布産米"], spots: ["ぴっぷスキー場", "比布大雪アイスアリーナ"], trivia: "「ぴっぷ」のキャラクターが親しまれるスキーと農業の町。アイヌ語「ピㇷ゚（石の多い川）」に由来" },
  { name: "愛別町", reading: "あいべつちょう", roma: "aibetsuchou", region: "上川", lat: 43.910, lng: 142.580, population: "0.3万人", specialty: ["愛別産米", "そば"], spots: ["あいべつ温泉（きとうし高原）", "石狩川上流域"], trivia: "石狩川上流の山あいに位置するそばの産地。層雲峡へのルート上にある" },
  { name: "上川町", reading: "かみかわちょう", roma: "kamikawachou", region: "上川", lat: 43.851, lng: 142.770, population: "0.35万人", specialty: ["層雲峡温泉", "大雪地ビール"], spots: ["層雲峡（柱状節理の断崖）", "銀河の滝・流星の滝"], trivia: "大雪山系の玄関口。柱状節理の絶壁が続く層雲峡は北海道屈指の景勝地" },
  { name: "東川町", reading: "ひがしかわちょう", roma: "higashikawachou", region: "上川", lat: 43.712, lng: 142.516, population: "0.8万人", specialty: ["東川米（旭川水系）", "家具"], spots: ["旭岳（大雪山系）", "天人峡"], trivia: "水道がない町として有名。大雪山旭岳（2291m）の玄関口で人口が増加中の移住人気の町" },
  { name: "美瑛町", reading: "びえいちょう", roma: "bieichou", region: "上川", lat: 43.589, lng: 142.469, population: "1万人", specialty: ["小麦", "じゃがいも", "アスパラ"], spots: ["青い池", "パッチワークの路", "白金温泉"], trivia: "なだらかな丘陵に広がる農村風景が絶景。「青い池」はApple社の壁紙にも採用された" },
  { name: "上富良野町", reading: "かみふらのちょう", roma: "kamifuranochou", region: "上川", lat: 43.456, lng: 142.456, population: "1.1万人", specialty: ["ラベンダー", "コーン"], spots: ["日の出公園ラベンダー園", "吹上温泉"], trivia: "ラベンダー発祥の地のひとつ。TBS系ドラマ「北の国から」の舞台" },
  { name: "中富良野町", reading: "なかふらのちょう", roma: "nakafuranochou", region: "上川", lat: 43.405, lng: 142.420, population: "0.5万人", specialty: ["ラベンダー", "メロン"], spots: ["ファーム富田（隣接）", "なかふらの八景"], trivia: "ラベンダーの香りが漂う観光農場「ファーム富田」が隣接する" },
  { name: "南富良野町", reading: "みなみふらのちょう", roma: "minamifuranochou", region: "上川", lat: 43.213, lng: 142.586, population: "0.24万人", specialty: ["かなやま湖ラベンダー", "そば"], spots: ["かなやま湖", "旧幾寅駅（映画・鉄道員）"], trivia: "映画「鉄道員（ぽっぽや）」のロケ地・旧幾寅駅（幌舞駅）がある" },
  { name: "占冠村", reading: "しむかっぷむら", roma: "shimukappumura", region: "上川", lat: 43.071, lng: 142.398, population: "0.12万人", specialty: ["ジビエ", "山菜"], spots: ["星野リゾートトマム", "三段滝"], trivia: "「日本で最も読みにくい地名」のひとつ。星野リゾートトマムで国際的に有名" },
  { name: "和寒町", reading: "わっさむちょう", roma: "wassamuchou", region: "上川", lat: 44.026, lng: 142.418, population: "0.35万人", specialty: ["越冬キャベツ（生産量全国一）", "かぼちゃ"], spots: ["塩狩峠（三浦綾子の小説舞台）"], trivia: "越冬キャベツの生産量全国一。三浦綾子の小説「塩狩峠」の舞台として有名" },
  { name: "剣淵町", reading: "けんぶちちょう", roma: "kembuchichou", region: "上川", lat: 44.082, lng: 142.379, population: "0.3万人", specialty: ["けんぶち産米", "ひまわり"], spots: ["絵本の里けんぶち（絵本の館）", "桜岡湖"], trivia: "「絵本の里」として知られ、全国から絵本作家が集まる文化の町。絵本の館は必見" },
  { name: "下川町", reading: "しもかわちょう", roma: "shimokawachou", region: "上川", lat: 44.310, lng: 142.638, population: "0.35万人", specialty: ["下川産木材（FSC認証）", "山菜"], spots: ["下川五味温泉", "一の橋バイオビレッジ"], trivia: "日本初のFSC森林認証を取得した「森のまち」。木質バイオマスで地域熱供給を実現" },
  { name: "美深町", reading: "びふかちょう", roma: "bifukachou", region: "上川", lat: 44.487, lng: 142.357, population: "0.4万人", specialty: ["チョウザメ（国産キャビア）", "牛乳"], spots: ["日本唯一のチョウザメ養殖場", "美深温泉"], trivia: "日本唯一のチョウザメ養殖場があり、高級食材・国産キャビアを生産している" },
  { name: "音威子府村", reading: "おといねっぷむら", roma: "otoineppumura", region: "上川", lat: 44.732, lng: 142.272, population: "0.07万人", specialty: ["音威子府そば（黒いそば）"], spots: ["音威子府駅（秘境駅）", "天塩川"], trivia: "全国でも最小級の村。真っ黒な「音威子府そば」は北海道の名物として有名" },
  { name: "中川町", reading: "なかがわちょう", roma: "nakagawachou", region: "上川", lat: 44.812, lng: 142.072, population: "0.2万人", specialty: ["なかがわ産木材", "アンモナイト化石"], spots: ["なかがわ水遊園（日本最大の淡水魚水族館）", "中川町エコミュージアムセンター"], trivia: "日本最大の淡水魚水族館「なかがわ水遊園」がある天塩川沿いの町" },
  { name: "幌加内町", reading: "ほろかないちょう", roma: "horokanaichou", region: "上川", lat: 44.022, lng: 142.149, population: "0.14万人", specialty: ["そば（生産量日本一）", "鴨"], spots: ["朱鞠内湖（日本最大の人造湖）"], trivia: "そばの作付面積・生産量が日本一の「そばの聖地」。朱鞠内湖は幻のイトウが棲む" },

  // 留萌振興局 (8)
  { name: "留萌市", reading: "るもいし", roma: "rumoishi", region: "留萌", lat: 43.941, lng: 141.637, population: "2万人", specialty: ["数の子", "甘エビ", "ニシン"], spots: ["黄金岬", "留萌本線（廃線）"], trivia: "かずのこの生産・加工が盛ん。「かずのこの町」として知られる" },
  { name: "増毛町", reading: "ましけちょう", roma: "mashikechou", region: "留萌", lat: 43.851, lng: 141.564, population: "0.4万人", specialty: ["甘エビ", "ウニ", "国稀（日本酒）"], spots: ["国稀酒造（最北の酒蔵）", "増毛厳島神社"], trivia: "北海道最北の酒蔵「国稀酒造」がある。増毛（ますげ）という地名がユニーク" },
  { name: "小平町", reading: "おびらちょう", roma: "obirachou", region: "留萌", lat: 44.027, lng: 141.660, population: "0.3万人", specialty: ["おびらにしん", "タコ"], spots: ["旧花田家番屋（国重要文化財）", "鬼鹿海岸"], trivia: "日本最大の木造にしん番屋「旧花田家番屋」は国の重要文化財。にしん漁の繁栄を伝える" },
  { name: "苫前町", reading: "とままえちょう", roma: "tomamaechou", region: "留萌", lat: 44.310, lng: 141.683, population: "0.26万人", specialty: ["風力発電", "甘エビ"], spots: ["苫前風力発電所", "三毛別羆事件跡地"], trivia: "1915年に起きた「三毛別羆事件」（日本最大の熊害）の現場がある" },
  { name: "羽幌町", reading: "はぼろちょう", roma: "haborochou", region: "留萌", lat: 44.358, lng: 141.700, population: "0.7万人", specialty: ["甘エビ", "ウニ"], spots: ["天売島・焼尻島（フェリー乗り場）", "北海道海鳥センター"], trivia: "天売島・焼尻島へのフェリーの玄関口。天売島はウミガラスの繁殖地" },
  { name: "初山別村", reading: "しょさんべつむら", roma: "shosambetsumura", region: "留萌", lat: 44.520, lng: 141.781, population: "0.1万人", specialty: ["コンブ", "甘エビ"], spots: ["星の降る丘オートキャンプ場"], trivia: "人口1千人以下の小村。光害が少なく星空観察の名所として知られる" },
  { name: "遠別町", reading: "えんべつちょう", roma: "embetsuchou", region: "留萌", lat: 44.722, lng: 141.798, population: "0.25万人", specialty: ["てんさい糖", "タコ"], spots: ["サンセットビーチ遠別", "遠別農場"], trivia: "てんさい（砂糖大根）の産地。日本海に沈む夕日が美しいサンセットスポット" },
  { name: "天塩町", reading: "てしおちょう", roma: "teshiochou", region: "留萌", lat: 44.890, lng: 141.745, population: "0.3万人", specialty: ["天塩シジミ", "タコ"], spots: ["天塩川河口（夕日）", "てしお温泉夕映"], trivia: "天塩川河口に位置し、日本海に沈む夕日が絶景。シジミの産地としても知られる" },

  // 宗谷総合振興局 (10)
  { name: "稚内市", reading: "わっかないし", roma: "wakkanaishi", region: "宗谷", lat: 45.416, lng: 141.673, population: "3万人", specialty: ["タコ", "ウニ", "宗谷黒牛"], spots: ["宗谷岬（日本最北端）", "ノシャップ岬", "稚内公園"], trivia: "日本最北端の市。宗谷岬は日本最北の地で、天気がよければサハリンが見える" },
  { name: "猿払村", reading: "さるふつむら", roma: "sarufutsumura", region: "宗谷", lat: 45.314, lng: 142.106, population: "0.25万人", specialty: ["ホタテ（漁獲量日本一）"], spots: ["エサヌカ線（地平線の道）", "猿払公園"], trivia: "ホタテ漁獲量が全国1位の豊かな村。「エサヌカ線」は地平線まで続く直線道路" },
  { name: "浜頓別町", reading: "はまとんべつちょう", roma: "hamatombetsuchou", region: "宗谷", lat: 45.121, lng: 142.348, population: "0.26万人", specialty: ["白鳥観光", "コンブ"], spots: ["クッチャロ湖（ラムサール条約）", "はまとんべつ温泉"], trivia: "クッチャロ湖には毎年数千羽の白鳥が飛来するラムサール条約登録湿地" },
  { name: "中頓別町", reading: "なかとんべつちょう", roma: "nakatombetsuchou", region: "宗谷", lat: 44.985, lng: 142.265, population: "0.17万人", specialty: ["砂金（ペンケナイ川）", "牛乳"], spots: ["ペンケナイ川（砂金採り体験）", "中頓別鍾乳洞"], trivia: "日本で唯一、観光砂金採りが楽しめる川がある。かつては砂金採取で賑わった" },
  { name: "枝幸町", reading: "えさしちょう", roma: "esashichou", region: "宗谷", lat: 44.940, lng: 142.581, population: "0.7万人", specialty: ["ホタテ", "カニ", "ウニ"], spots: ["北海道最大のかにまつり会場", "オホーツク海"], trivia: "毎年8月開催の「かにまつり」に道内外から大勢が訪れる" },
  { name: "豊富町", reading: "とよとみちょう", roma: "toyotomichou", region: "宗谷", lat: 45.105, lng: 141.787, population: "0.38万人", specialty: ["とよとみ牛乳", "温泉牛乳"], spots: ["豊富温泉（石油成分含む）", "サロベツ原野"], trivia: "石油成分を含む珍しい温泉「豊富温泉」は皮膚疾患に効くと有名" },
  { name: "礼文町", reading: "れぶんちょう", roma: "rebunchou", region: "宗谷", lat: 45.302, lng: 141.046, population: "0.25万人", specialty: ["ウニ", "昆布", "ほっけ"], spots: ["桃岩展望台", "澄海岬", "礼文島花の浮島"], trivia: "「花の浮島」として知られる最北の離島。高山植物が海岸近くで咲く稀有な島" },
  { name: "利尻町", reading: "りしりちょう", roma: "rishirichou", region: "宗谷", lat: 45.184, lng: 141.131, population: "0.2万人", specialty: ["利尻昆布", "ウニ"], spots: ["利尻山（利尻富士）", "沼浦展望台"], trivia: "最高級昆布「利尻昆布」の産地。利尻山（1721m）は利尻島のシンボル" },
  { name: "利尻富士町", reading: "りしりふじちょう", roma: "rishirifujichou", region: "宗谷", lat: 45.245, lng: 141.230, population: "0.22万人", specialty: ["利尻昆布", "ウニ", "ほっけ"], spots: ["姫沼", "オタトマリ沼", "利尻山登山口"], trivia: "利尻島の北部を占める町。利尻昆布はだしの最高峰として料亭でも珍重される" },
  { name: "幌延町", reading: "ほろのべちょう", roma: "horonobechou", region: "宗谷", lat: 45.024, lng: 141.829, population: "0.23万人", specialty: ["牛乳", "トナカイ"], spots: ["サロベツ湿原センター", "幌延トナカイ観光牧場"], trivia: "日本ではここだけのトナカイ牧場がある。核廃棄物研究施設があることでも知られる" },

  // オホーツク総合振興局 (18)
  { name: "北見市", reading: "きたみし", roma: "kitamishi", region: "オホーツク", lat: 43.804, lng: 143.892, population: "11万人", specialty: ["タマネギ（全国1位）", "ハッカ", "カーリング"], spots: ["ハッカ記念館", "北見市端野町（カーリング）"], trivia: "タマネギ生産量全国1位。「ハッカの町」として世界シェア70%を誇った歴史を持つ" },
  { name: "網走市", reading: "あばしりし", roma: "abashirishi", region: "オホーツク", lat: 44.020, lng: 144.273, population: "3.3万人", specialty: ["流氷ドラフト", "ホタテ", "鮭"], spots: ["網走監獄（博物館）", "流氷観光砕氷船おーろら"], trivia: "流氷と網走監獄で有名。冬になるとオホーツク海が一面流氷に覆われる" },
  { name: "紋別市", reading: "もんべつし", roma: "mombetsushi", region: "オホーツク", lat: 44.354, lng: 143.354, population: "2.2万人", specialty: ["ズワイガニ", "ホタテ", "毛ガニ"], spots: ["流氷砕氷船ガリンコ号", "モヨロ貝塚"], trivia: "流氷砕氷船「ガリンコ号」で有名。オホーツク海に面した水産業の町" },
  { name: "美幌町", reading: "びほろちょう", roma: "bihorochou", region: "オホーツク", lat: 43.825, lng: 144.117, population: "2万人", specialty: ["小麦", "ビート"], spots: ["美幌峠（屈斜路湖展望）", "道の駅ぐるっとパノラマ美幌峠"], trivia: "美幌峠からは屈斜路湖が一望できる道東屈指の絶景スポット" },
  { name: "津別町", reading: "つべつちょう", roma: "tsubetsuchou", region: "オホーツク", lat: 43.704, lng: 144.025, population: "0.5万人", specialty: ["津別産木材", "牛乳"], spots: ["チミケップ湖（秘境の湖）", "津別峠（雲海）"], trivia: "原生林に囲まれた秘境「チミケップ湖」と絶景の雲海スポット「津別峠」で知られる" },
  { name: "斜里町", reading: "しゃりちょう", roma: "sharichou", region: "オホーツク", lat: 43.910, lng: 144.659, population: "1.2万人", specialty: ["鮭", "ウニ", "じゃがいも"], spots: ["知床五湖", "オシンコシン滝", "知床峠"], trivia: "世界自然遺産・知床の玄関口。知床五湖にはヒグマが生息する手つかずの大自然" },
  { name: "清里町", reading: "きよさとちょう", roma: "kiyosatochou", region: "オホーツク", lat: 43.832, lng: 144.586, population: "0.38万人", specialty: ["じゃがいも", "清里焼酎"], spots: ["さくらの滝（サクラマスの遡上）", "神の子池"], trivia: "エメラルドブルーの「神の子池」と、サクラマスが滝を遡上する光景で有名" },
  { name: "小清水町", reading: "こしみずちょう", roma: "koshimizuchou", region: "オホーツク", lat: 43.913, lng: 144.480, population: "0.5万人", specialty: ["小清水じゃがいも", "アスパラ"], spots: ["小清水原生花園（エゾスカシユリ）", "オホーツク海浜"], trivia: "オホーツク海沿いに広がる「小清水原生花園」はエゾスカシユリや花菖蒲が咲く絶景地" },
  { name: "訓子府町", reading: "くんねっぷちょう", roma: "kunneppuchou", region: "オホーツク", lat: 43.722, lng: 143.741, population: "0.5万人", specialty: ["訓子府産じゃがいも", "スイートコーン"], spots: ["訓子府公園（桜）", "常呂川"], trivia: "じゃがいもとスイートコーンの産地。常呂川沿いに広がる農業の町" },
  { name: "置戸町", reading: "おけとちょう", roma: "oketochou", region: "オホーツク", lat: 43.681, lng: 143.575, population: "0.3万人", specialty: ["オケクラフト（木工）", "牛乳"], spots: ["オケクラフトセンター森夢"], trivia: "木工クラフト「オケクラフト」発祥の地。桶の技術を応用した木製品が全国で人気" },
  { name: "佐呂間町", reading: "さろまちょう", roma: "saromachou", region: "オホーツク", lat: 44.044, lng: 143.787, population: "0.5万人", specialty: ["サロマ湖ホタテ（日本一）", "ホッキ"], spots: ["サロマ湖（日本最大の汽水湖）"], trivia: "日本最大の汽水湖サロマ湖を擁し、ホタテ漁獲量は全国トップクラス" },
  { name: "遠軽町", reading: "えんがるちょう", roma: "engaruchou", region: "オホーツク", lat: 44.064, lng: 143.524, population: "2万人", specialty: ["チューリップ", "アスパラ"], spots: ["瞰望岩（ガンボウ岩）", "太陽の丘えんがる公園チューリップ"], trivia: "100万本以上のチューリップが咲く「太陽の丘えんがる公園」が有名" },
  { name: "湧別町", reading: "ゆうべつちょう", roma: "yuubetsuchou", region: "オホーツク", lat: 44.181, lng: 143.601, population: "0.8万人", specialty: ["チューリップ", "ホタテ"], spots: ["かみゆうべつチューリップ公園", "サンゴ草群落"], trivia: "250万本のチューリップ畑と、珊瑚草（アッケシソウ）の群落が有名" },
  { name: "滝上町", reading: "たきのうえちょう", roma: "takinouechou", region: "オホーツク", lat: 44.196, lng: 143.067, population: "0.24万人", specialty: ["芝ざくら", "そば"], spots: ["たきのうえ芝ざくら滝上公園"], trivia: "10万株以上の芝ざくらが咲き誇る「滝上公園」は毎年多くの観光客が訪れる" },
  { name: "興部町", reading: "おこっぺちょう", roma: "okoppechou", region: "オホーツク", lat: 44.473, lng: 143.131, population: "0.4万人", specialty: ["ホタテ", "牛乳（ノースプレインファーム）"], spots: ["ノースプレインファーム（有機農業・チーズ工房）"], trivia: "有機農業の先駆者「ノースプレインファーム」のチーズ・ヨーグルトが全国で高評価" },
  { name: "西興部村", reading: "にしおこっぺむら", roma: "nishiokoppemura", region: "オホーツク", lat: 44.327, lng: 142.971, population: "0.12万人", specialty: ["エゾシカ（ジビエ）", "牛乳"], spots: ["西興部村猟区（日本唯一の公認ハンティング）", "うぃっく西興部"], trivia: "日本で唯一、公認のハンティング（猟区）がある村。エゾシカのジビエ料理が名物" },
  { name: "雄武町", reading: "おうむちょう", roma: "oumuchou", region: "オホーツク", lat: 44.582, lng: 142.961, population: "0.5万人", specialty: ["ホタテ", "毛ガニ"], spots: ["興浜北線廃線跡", "オホーツク海岸"], trivia: "未成線「興浜北線」の廃線跡が残る。オホーツク海のホタテ・毛ガニ漁業が盛ん" },
  { name: "大空町", reading: "おおぞらちょう", roma: "oozorachou", region: "オホーツク", lat: 43.892, lng: 144.281, population: "0.7万人", specialty: ["女満別トマト", "メロン"], spots: ["女満別空港（道東の空の玄関）", "メルヘンの丘"], trivia: "なだらかな丘にポプラが連なる「メルヘンの丘」は道東を代表する絶景スポット" },

  // 胆振総合振興局 (11)
  { name: "室蘭市", reading: "むろらんし", roma: "muroranshi", region: "胆振", lat: 42.315, lng: 140.974, population: "8万人", specialty: ["室蘭カレーラーメン", "室蘭やきとり（豚肉）"], spots: ["地球岬", "白鳥大橋"], trivia: "地球の丸さが感じられる「地球岬」と日本最長クラスの吊り橋「白鳥大橋」が有名" },
  { name: "苫小牧市", reading: "とまこまいし", roma: "tomakomaishi", region: "胆振", lat: 42.634, lng: 141.605, population: "17万人", specialty: ["ホッキ貝（水揚げ日本一）", "苫小牧の野菜"], spots: ["支笏湖（国立公園）", "ウトナイ湖野鳥保護区"], trivia: "ホッキ貝の水揚げ量日本一。支笏湖は苫小牧市に隣接する透明度抜群の湖" },
  { name: "登別市", reading: "のぼりべつし", roma: "noboribetsushi", region: "胆振", lat: 42.413, lng: 141.114, population: "4.7万人", specialty: ["登別温泉（9種類の泉質）", "鬼グッズ"], spots: ["地獄谷", "登別クマ牧場", "カルルス温泉"], trivia: "9種類の泉質を誇る「登別温泉」は北海道最大の温泉観光地。鬼の像がシンボル" },
  { name: "伊達市", reading: "だてし", roma: "dateshi", region: "胆振", lat: 42.471, lng: 140.886, population: "3.4万人", specialty: ["アスパラガス", "伊達のいちご"], spots: ["有珠善光寺", "だて歴史の杜"], trivia: "雪が少なく温暖なため「北の湘南」と呼ばれる。有珠山の麓にある風光明媚な市" },
  { name: "豊浦町", reading: "とようらちょう", roma: "toyourachou", region: "胆振", lat: 42.567, lng: 140.708, population: "0.4万人", specialty: ["ホタテ", "カキ"], spots: ["礼文華海岸", "噴火湾"], trivia: "噴火湾（内浦湾）に面し、ホタテ・カキの養殖が盛ん" },
  { name: "壮瞥町", reading: "そうべつちょう", roma: "soubetsuchou", region: "胆振", lat: 42.546, lng: 140.829, population: "0.25万人", specialty: ["壮瞥りんご", "洞爺湖温泉"], spots: ["昭和新山", "有珠山ロープウェイ"], trivia: "昭和18年の噴火でできた「昭和新山」は世界的にも珍しい成長中の溶岩ドーム" },
  { name: "白老町", reading: "しらおいちょう", roma: "shiraoichou", region: "胆振", lat: 42.553, lng: 141.355, population: "1.8万人", specialty: ["牛乳", "白老牛"], spots: ["ウポポイ（民族共生象徴空間）", "アイヌ民族博物館"], trivia: "2020年開業の国立アイヌ民族博物館「ウポポイ」はアイヌ文化の発信拠点" },
  { name: "厚真町", reading: "あつまちょう", roma: "atsumachou", region: "胆振", lat: 42.730, lng: 141.876, population: "0.5万人", specialty: ["ハスカップ（生産量全国一）", "牛乳"], spots: ["厚真町ハスカップ農園", "ウトナイ湖（近隣）"], trivia: "ハスカップの生産量全国一。2018年北海道胆振東部地震の震源地で、現在は復興中" },
  { name: "洞爺湖町", reading: "とうやこちょう", roma: "touyakochou", region: "胆振", lat: 42.560, lng: 140.770, population: "0.8万人", specialty: ["洞爺湖温泉", "しいたけ"], spots: ["洞爺湖", "有珠山", "西山火口散策路"], trivia: "2008年のG8サミット開催地。洞爺湖は支笏洞爺国立公園の中心をなすカルデラ湖" },
  { name: "安平町", reading: "あびらちょう", roma: "abirachou", region: "胆振", lat: 42.768, lng: 141.829, population: "0.7万人", specialty: ["安平産じゃがいも", "牛乳"], spots: ["早来（はやきた）温泉らら", "追分コロニー（廃線遺産）"], trivia: "2018年北海道胆振東部地震で大規模な液状化・土砂崩れが発生した地域。鉄道の要衝だった歴史も" },
  { name: "むかわ町", reading: "むかわちょう", roma: "mukawachou", region: "胆振", lat: 42.572, lng: 141.940, population: "0.9万人", specialty: ["ししゃも（本ししゃも）", "トマト"], spots: ["穂別恐竜博物館"], trivia: "本物のシシャモが獲れる数少ない産地のひとつ。恐竜化石の発掘でも話題の町" },

  // 日高振興局 (7)
  { name: "日高町", reading: "ひだかちょう", roma: "hidakachou", region: "日高", lat: 42.834, lng: 142.067, population: "1.2万人", specialty: ["日高昆布（ひだかこんぶ）", "馬"], spots: ["日高山脈（幌尻岳登山口）", "門別競馬場"], trivia: "日高昆布の主要産地。日本百名山「幌尻岳」への登山拠点でもある山と海の町" },
  { name: "平取町", reading: "びらとりちょう", roma: "biratorichou", region: "日高", lat: 42.578, lng: 142.115, population: "0.5万人", specialty: ["トマト（二風谷ファーム）", "サーモン"], spots: ["二風谷アイヌ文化博物館", "沙流川"], trivia: "アイヌ文化の里「二風谷」があり、アイヌ工芸・伝統文化の保存で有名" },
  { name: "新冠町", reading: "にいかっぷちょう", roma: "niikappuchou", region: "日高", lat: 42.337, lng: 142.421, population: "0.5万人", specialty: ["サラブレッド", "新冠メロン"], spots: ["優駿の里AERU", "新冠レコード館"], trivia: "サラブレッドの一大産地。レコード（音楽）コレクションが日本一の「レ・コード館」がある" },
  { name: "浦河町", reading: "うらかわちょう", roma: "urakawachou", region: "日高", lat: 42.166, lng: 142.770, population: "1.2万人", specialty: ["サラブレッド", "昆布"], spots: ["日高山脈（ユネスコエコパーク）"], trivia: "日本のサラブレッド生産量の約半数を占める競走馬の聖地" },
  { name: "様似町", reading: "さまにちょう", roma: "samanichou", region: "日高", lat: 42.124, lng: 142.929, population: "0.4万人", specialty: ["ウニ", "コンブ"], spots: ["アポイ岳（世界ジオパーク）", "様似海岸"], trivia: "世界ジオパーク認定のアポイ岳は世界的にも珍しいかんらん岩の山" },
  { name: "えりも町", reading: "えりもちょう", roma: "erimochou", region: "日高", lat: 42.030, lng: 143.151, population: "0.45万人", specialty: ["コンブ（昆布）", "ゼニガタアザラシ"], spots: ["えりも岬", "えりも岬風の館"], trivia: "日高山脈が太平洋に突き出した「えりも岬」は年間の霧の日数が全国最多レベル" },
  { name: "新ひだか町", reading: "しんひだかちょう", roma: "shinhidakachou", region: "日高", lat: 42.339, lng: 142.598, population: "1.9万人", specialty: ["サラブレッド", "海産物"], spots: ["みついし昆布温泉", "静内二十間道路（桜並木）"], trivia: "「二十間道路」の桜並木（約7km）は北海道最大級の桜の名所" },

  // 十勝総合振興局 (19)
  { name: "帯広市", reading: "おびひろし", roma: "obihiroshi", region: "十勝", lat: 42.924, lng: 143.196, population: "16万人", specialty: ["豚丼", "スイートポテト（十勝）", "チーズ"], spots: ["帯広競馬場（ばんえい競馬）", "十勝川温泉", "真鍋庭園"], trivia: "十勝平野の中心都市。世界で唯一の馬が荷物を引く「ばんえい競馬」の開催地" },
  { name: "音更町", reading: "おとふけちょう", roma: "otofukechou", region: "十勝", lat: 42.985, lng: 143.198, population: "4.5万人", specialty: ["十勝川温泉", "モール温泉"], spots: ["十勝川温泉（モール温泉）", "十勝エコロジーパーク"], trivia: "植物性有機物を含む珍しい「モール温泉」は美肌効果があると人気" },
  { name: "士幌町", reading: "しほろちょう", roma: "shihorochou", region: "十勝", lat: 43.165, lng: 143.241, population: "0.6万人", specialty: ["でんぷん（ポテトスターチ）", "牛乳"], spots: ["旧国鉄士幌線コンクリートアーチ橋梁群"], trivia: "旧士幌線の廃線跡に残るコンクリートアーチ橋梁群は北海道遺産に指定" },
  { name: "上士幌町", reading: "かみしほろちょう", roma: "kamishihorochou", region: "十勝", lat: 43.241, lng: 143.301, population: "0.46万人", specialty: ["ナイタイ高原牛乳", "牛乳"], spots: ["糠平湖（タウシュベツ橋梁）", "ナイタイ高原牧場"], trivia: "幻の橋「タウシュベツ橋梁」は夏に湖面に沈む幻想的な廃橋として人気" },
  { name: "鹿追町", reading: "しかおいちょう", roma: "shikaoichou", region: "十勝", lat: 43.078, lng: 142.999, population: "0.5万人", specialty: ["じゃがいも", "牛乳"], spots: ["然別湖（北海道最高所の湖）", "屈足温泉"], trivia: "北海道で最も標高の高い湖「然別湖」は唯一の自然湖でヒメマスが棲む" },
  { name: "新得町", reading: "しんとくちょう", roma: "shintokuchou", region: "十勝", lat: 43.087, lng: 142.838, population: "0.6万人", specialty: ["そば（日本有数の産地）", "チーズ"], spots: ["サホロリゾート（スキー）", "狩勝峠"], trivia: "日本有数のそば生産地。映画「鉄道員」の舞台となった狩勝峠の近く" },
  { name: "清水町", reading: "しみずちょう", roma: "shimizuchou", region: "十勝", lat: 42.987, lng: 142.875, population: "1万人", specialty: ["牛とろ（十勝牛）", "小麦"], spots: ["道の駅しみず（牛とろ丼）", "狩勝峠展望台"], trivia: "「牛とろ丼」発祥の地。十勝平野を一望できる狩勝峠は雄大な展望台として人気" },
  { name: "芽室町", reading: "めむろちょう", roma: "memurochou", region: "十勝", lat: 42.910, lng: 143.061, population: "1.9万人", specialty: ["スイートコーン", "小麦"], spots: ["芽室公園", "十勝平野の農村風景"], trivia: "スイートコーンの主要産地として知られる十勝平野中部の農業の町" },
  { name: "中札内村", reading: "なかさつないむら", roma: "nakasatsunaimura", region: "十勝", lat: 42.733, lng: 143.146, population: "0.36万人", specialty: ["金時豆（日本一）", "インゲン豆"], spots: ["中札内美術村", "道の駅なかさつない"], trivia: "金時豆の生産量が日本一。農業と芸術が融合した「美術村」がある" },
  { name: "更別村", reading: "さらべつむら", roma: "sarabetsumura", region: "十勝", lat: 42.696, lng: 143.171, population: "0.35万人", specialty: ["更別産小麦", "てんさい"], spots: ["更別村農場（広大な農地）", "カントリーパーク"], trivia: "一戸あたりの耕地面積が全国最大級。北海道大規模農業の先進モデル地区として有名" },
  { name: "大樹町", reading: "たいきちょう", roma: "taikichou", region: "十勝", lat: 42.484, lng: 143.291, population: "0.6万人", specialty: ["牛乳", "カシス"], spots: ["JAXA大樹航空宇宙実験場", "北海道スペースポート（HOSPO）"], trivia: "民間ロケット発射場がある「宇宙のまち」。インターステラテクノロジズが打ち上げを行う" },
  { name: "広尾町", reading: "ひろおちょう", roma: "hiroochou", region: "十勝", lat: 42.281, lng: 143.318, population: "0.6万人", specialty: ["サンマ", "コンブ"], spots: ["サンタランド（広尾町）", "十勝港"], trivia: "「サンタランド」として知られ、フィンランドのサンタ村と友好都市協定を結んでいる" },
  { name: "幕別町", reading: "まくべつちょう", roma: "makubetsuchou", region: "十勝", lat: 42.911, lng: 143.358, population: "2.5万人", specialty: ["幕別スイカ", "ミニトマト"], spots: ["忠類ナウマン象記念館", "チューリップ公園"], trivia: "日本で初めてナウマン象の全身骨格化石が発見された旧忠類村を含む" },
  { name: "池田町", reading: "いけだちょう", roma: "ikedachou", region: "十勝", lat: 42.929, lng: 143.452, population: "0.6万人", specialty: ["十勝ワイン", "豚肉"], spots: ["ワイン城（池田町ブドウ・ブドウ酒研究所）"], trivia: "北海道を代表するワイン産地。「ワイン城」は池田町の赤いシンボル建築" },
  { name: "豊頃町", reading: "とよころちょう", roma: "toyokorochou", region: "十勝", lat: 42.804, lng: 143.514, population: "0.3万人", specialty: ["ハマナスローズヒップ", "牛乳"], spots: ["大津海岸（ジュエリーアイス）"], trivia: "冬に大津海岸に打ち上げられる透明な流氷「ジュエリーアイス」が幻想的" },
  { name: "本別町", reading: "ほんべつちょう", roma: "hombetsuchou", region: "十勝", lat: 43.127, lng: 143.594, population: "0.65万人", specialty: ["小豆", "インゲン豆"], spots: ["本別公園（桜）", "仙美里ファーム"], trivia: "「豆のふる里」として小豆・インゲン豆などの豆類生産が盛ん" },
  { name: "足寄町", reading: "あしょろちょう", roma: "ashorochou", region: "十勝", lat: 43.245, lng: 143.547, population: "0.6万人", specialty: ["ラワンぶき（巨大ふき）", "牛乳"], spots: ["足寄湖", "道の駅あしょろ銀河ホール21"], trivia: "高さ2〜3mにもなる「ラワンぶき」の産地。シンガーソングライター・松山千春の出身地" },
  { name: "陸別町", reading: "りくべつちょう", roma: "rikubetsuchou", region: "十勝", lat: 43.452, lng: 143.731, population: "0.3万人", specialty: ["銀河鉄道（星空）", "牛乳"], spots: ["りくべつ宇宙地球科学館（銀河の森天文台）"], trivia: "全道一の寒さを記録することもある「日本一寒い町」。星空が美しく天文台がある" },
  { name: "浦幌町", reading: "うらほろちょう", roma: "urahorochou", region: "十勝", lat: 42.802, lng: 143.659, population: "0.46万人", specialty: ["うらほろ産牛乳", "コンブ"], spots: ["浦幌原生花園", "十勝太遺跡（縄文）"], trivia: "縄文時代の大規模遺跡「十勝太遺跡」がある。浦幌原生花園は手つかずの自然が残る" },

  // 釧路総合振興局 (8)
  { name: "釧路市", reading: "くしろし", roma: "kushiroshi", region: "釧路", lat: 42.985, lng: 144.382, population: "16万人", specialty: ["ザンギ（釧路発祥）", "釧路炉端焼き", "サンマ"], spots: ["釧路湿原（ラムサール条約）", "和商市場", "幣舞橋"], trivia: "「霧の街」として有名。釧路湿原は日本最大の湿原でラムサール条約登録湿地" },
  { name: "釧路町", reading: "くしろちょう", roma: "kushirochou", region: "釧路", lat: 43.014, lng: 144.480, population: "1.8万人", specialty: ["昆布", "牡蠣"], spots: ["細岡展望台（湿原の展望）", "達古武湖"], trivia: "釧路湿原国立公園の大部分を占める町。タンチョウの生息地でもある" },
  { name: "厚岸町", reading: "あっけしちょう", roma: "akkeshichou", region: "釧路", lat: 43.041, lng: 144.840, population: "0.9万人", specialty: ["厚岸牡蠣（一年中食べられる）", "昆布", "サンマ"], spots: ["厚岸湖", "コンキリエ（道の駅）"], trivia: "一年中生牡蠣が食べられる日本唯一の産地。厚岸湾の牡蠣は旨みが濃厚" },
  { name: "浜中町", reading: "はまなかちょう", roma: "hamanakachou", region: "釧路", lat: 43.097, lng: 145.122, population: "0.5万人", specialty: ["霧多布昆布", "牛乳"], spots: ["霧多布湿原", "湯沸岬灯台"], trivia: "ラムサール条約登録の霧多布湿原には、エゾカンゾウなど多彩な花が咲く" },
  { name: "標茶町", reading: "しべちゃちょう", roma: "shibechachou", region: "釧路", lat: 43.301, lng: 144.602, population: "0.7万人", specialty: ["標茶牛乳", "釧路和牛"], spots: ["コッタロ湿原", "塘路湖（釧路湿原）"], trivia: "釧路湿原のカヌーコースの出発地として知られ、SL冬の湿原号も走る" },
  { name: "弟子屈町", reading: "てしかがちょう", roma: "teshikagachou", region: "釧路", lat: 43.485, lng: 144.460, population: "0.7万人", specialty: ["摩周そば", "川湯温泉"], spots: ["摩周湖（世界有数の透明度）", "屈斜路湖", "硫黄山"], trivia: "世界有数の透明度を誇る「摩周湖」があり、「摩周の霧」は北海道の代名詞" },
  { name: "鶴居村", reading: "つるいむら", roma: "tsuruimura", region: "釧路", lat: 43.225, lng: 144.319, population: "0.25万人", specialty: ["タンチョウ観察", "牛乳"], spots: ["鶴居・伊藤タンチョウサンクチュアリ"], trivia: "国の特別天然記念物タンチョウの越冬地。日本野鳥の会のサンクチュアリがある" },
  { name: "白糠町", reading: "しらぬかちょう", roma: "shiranukachou", region: "釧路", lat: 42.962, lng: 144.083, population: "0.7万人", specialty: ["白糠昆布", "ししゃも"], spots: ["庶路ダム", "白糠海岸"], trivia: "白糠昆布の産地。本物のシシャモ（キュウリウオ科）が漁獲される数少ない産地" },

  // 根室振興局 (5)
  { name: "根室市", reading: "ねむろし", roma: "nemuroshi", region: "根室", lat: 43.331, lng: 145.583, population: "2.5万人", specialty: ["花咲ガニ", "サンマ", "エスカロップ"], spots: ["納沙布岬（日本最東端）", "春国岱（世界自然遺産候補）"], trivia: "日本本土最東端の市。納沙布岬から望む北方領土は4km先にある" },
  { name: "別海町", reading: "べつかいちょう", roma: "betsukaichou", region: "根室", lat: 43.388, lng: 145.122, population: "1.5万人", specialty: ["別海牛乳（生乳生産量日本一）", "ホタテ"], spots: ["野付半島（ナラワラ・トドワラ）", "尾岱沼"], trivia: "生乳生産量が日本一の酪農の町。幻想的な枯れ木の風景「トドワラ」がある" },
  { name: "中標津町", reading: "なかしべつちょう", roma: "nakashibetsuchou", region: "根室", lat: 43.547, lng: 144.965, population: "2.3万人", specialty: ["中標津牛乳", "カマンベールチーズ"], spots: ["開陽台（牧草ロール・地平線）", "養老牛温泉"], trivia: "「地球が丸く見える」開陽台展望台は道東を代表する絶景スポット" },
  { name: "標津町", reading: "しべつちょう", roma: "shibetsuchou", region: "根室", lat: 43.660, lng: 145.135, population: "0.5万人", specialty: ["サーモン（鮭）", "ホタテ"], spots: ["標津サーモン科学館", "標津サーモンパーク"], trivia: "日本最大級のサケの水族館「標津サーモン科学館」がある鮭の聖地" },
  { name: "羅臼町", reading: "らうすちょう", roma: "rausuchou", region: "根室", lat: 44.022, lng: 145.187, population: "0.5万人", specialty: ["羅臼昆布（最高級）", "ほっけ", "ウニ"], spots: ["知床羅臼（世界自然遺産）", "羅臼岳", "羅臼国後展望台"], trivia: "最高級昆布「羅臼昆布」の産地。世界自然遺産・知床の東側の玄関口" },
];

const REGIONS = ["石狩","渡島","檜山","後志","空知","上川","留萌","宗谷","オホーツク","胆振","日高","十勝","釧路","根室"];

const REGION_COLORS = {
  "石狩": "#ff6b6b",
  "渡島": "#feca57",
  "檜山": "#ff9ff3",
  "後志": "#48dbfb",
  "空知": "#1dd1a1",
  "上川": "#5f27cd",
  "留萌": "#ee5a6f",
  "宗谷": "#54a0ff",
  "オホーツク": "#00d2d3",
  "胆振": "#ff9f43",
  "日高": "#a29bfe",
  "十勝": "#fd79a8",
  "釧路": "#0abde3",
  "根室": "#10ac84",
};

/* ---------- 地図用投影 ---------- */
const MAP_W = 360;
const MAP_H = 320;
const BOUNDS = { minLat: 41.3, maxLat: 45.6, minLng: 139.4, maxLng: 145.9 };
function project(lat, lng) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * MAP_W;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * MAP_H;
  return [x, y];
}

/* ---------- 北海道の輪郭 ---------- */
const HOKKAIDO_OUTLINE = [
  [45.52, 141.95], [45.42, 141.67], [45.12, 141.79], [44.72, 141.80],
  [44.30, 141.70], [43.93, 141.64], [43.20, 141.00], [43.28, 140.45],
  [42.98, 140.50], [42.67, 140.13], [42.43, 139.85], [41.97, 140.14],
  [41.43, 140.11], [41.49, 140.25], [41.69, 140.44], [41.77, 140.73],
  [42.04, 140.79], [42.21, 140.60], [42.51, 140.38], [42.55, 140.71],
  [42.31, 140.97], [42.55, 141.36], [42.63, 141.60], [42.57, 141.94],
  [42.34, 142.42], [42.17, 142.77], [42.03, 143.15], [42.28, 143.32],
  [42.80, 143.65], [42.96, 144.08], [42.97, 144.43], [43.04, 144.84],
  [43.10, 145.12], [43.33, 145.58], [43.55, 145.30], [43.66, 145.13],
  [44.02, 145.19], [44.34, 145.34], [44.02, 144.27], [44.05, 143.79],
  [44.18, 143.60], [44.35, 143.35], [44.58, 142.96], [44.94, 142.58],
  [45.12, 142.35], [45.31, 142.11],
];
const HOKKAIDO_PATH =
  "M " +
  HOKKAIDO_OUTLINE.map(([lat, lng]) => project(lat, lng).join(",")).join(" L ") +
  " Z";

/* ---------- ユーティリティ ---------- */
/**
 * "0.1万人" → "1千人"、"0.07万人" → "700人"、"32万人" → "32万人" に変換
 */
function formatPopulation(pop) {
  const m = pop.match(/^([\d.]+)万人$/);
  if (!m) return pop;
  const n = Math.round(parseFloat(m[1]) * 10000);
  if (n >= 10000) {
    const man = n / 10000;
    return `${Number.isInteger(man) ? man : man.toFixed(1)}万人`;
  }
  if (n >= 1000) {
    const sen = n / 1000;
    return `${Number.isInteger(sen) ? sen : sen.toFixed(1)}千人`;
  }
  return `${n}人`;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- メインコンポーネント ---------- */
export default function HokkaidoTypingGame() {
  const [screen, setScreen] = useState("menu"); // "menu" | "playing"
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [phase, setPhase] = useState("question"); // "question" | "answer"
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [input, setInput] = useState("");
  const [wrongFlash, setWrongFlash] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, streak: 0, best: 0, total: 0 });
  const [correctSet, setCorrectSet] = useState(new Set());
  const [wrongCounts, setWrongCounts] = useState({});
  const inputRef = useRef(null);
  const isComposingRef = useRef(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=JetBrains+Mono:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { if (document.head.contains(link)) document.head.removeChild(link); };
  }, []);

  const pool = useMemo(() => {
    return selectedRegion === "all" ? DATA : DATA.filter((d) => d.region === selectedRegion);
  }, [selectedRegion]);

  function startGame(region) {
    const p = region === "all" ? DATA : DATA.filter((d) => d.region === region);
    const sh = shuffle(p);
    setSelectedRegion(region);
    setQueue(sh.slice(1));
    setCurrent(sh[0]);
    setPhase("question");
    setInput("");
    setStats({ correct: 0, wrong: 0, streak: 0, best: 0, total: 0 });
    setCorrectSet(new Set());
    setWrongCounts({});
    setScreen("playing");
  }

  function backToMenu() {
    setScreen("menu");
    setCurrent(null);
    setQueue([]);
    setInput("");
    setStats({ correct: 0, wrong: 0, streak: 0, best: 0, total: 0 });
    setCorrectSet(new Set());
    setWrongCounts({});
  }

  useEffect(() => {
    if (phase === "question" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase, current]);

  function next() {
    if (correctSet.size >= poolSize) {
      setScreen("complete");
      return;
    }
    if (queue.length === 0) {
      const sh = shuffle(pool);
      setQueue(sh.slice(1));
      setCurrent(sh[0]);
    } else {
      const [n, ...rest] = queue;
      setCurrent(n);
      setQueue(rest);
    }
    setPhase("question");
    setInput("");
  }

  const handleInput = useCallback(
    (e) => {
      if (phase !== "question" || !current) return;
      // IME変換中はローマ字をそのまま表示し、確定後にひらがなのみ残す
      const v = isComposingRef.current
        ? e.target.value
        : e.target.value.replace(/[^ぁ-ゖー]/g, "");
      setInput(v);
      if (wrongFlash) setWrongFlash(false);
    },
    [phase, current, wrongFlash]
  );

  function handleSubmit() {
    if (phase !== "question" || !current) return;
    if (input.length === 0) return;
    const correct = input === current.reading;
    if (correct) {
      setCorrectSet((prev) => new Set([...prev, current.name]));
      setStats((s) => {
        const streak = s.streak + 1;
        return { correct: s.correct + 1, wrong: s.wrong, streak, best: Math.max(s.best, streak), total: s.total + 1 };
      });
      setPhase("answer");
    } else {
      setWrongCounts((prev) => ({ ...prev, [current.name]: (prev[current.name] || 0) + 1 }));
      setStats((s) => ({ correct: s.correct, wrong: s.wrong + 1, streak: 0, best: s.best, total: s.total + 1 }));
      setWrongFlash(true);
      setTimeout(() => { setWrongFlash(false); setPhase("answer"); }, 600);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleSkip() {
    setWrongCounts((prev) => ({ ...prev, [current.name]: (prev[current.name] || 0) + 1 }));
    setStats((s) => ({ ...s, wrong: s.wrong + 1, streak: 0, total: s.total + 1 }));
    setPhase("answer");
  }

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const poolSize = selectedRegion === "all" ? DATA.length : DATA.filter((d) => d.region === selectedRegion).length;
  const progressPct = poolSize > 0 ? Math.round((correctSet.size / poolSize) * 100) : 0;

  function handleShare() {
    const regionLabel = selectedRegion === "all" ? "全179市町村" : `${selectedRegion}振興局`;
    const isComplete = correctSet.size >= poolSize;
    const header = isComplete ? `🎉 ${regionLabel} 制覇！` : `🗾 よめるべや？北海道`;
    const text = [
      header,
      "",
      `📍 ${regionLabel}`,
      `✅ ${stats.correct} / ${poolSize} 完了（${progressPct}%）`,
      `🎯 正答率 ${accuracy}%`,
      `🔥 最大連続 ${stats.best}問正解`,
      "",
      "北海道の市町村、よめるべや？",
      "#北海道 #地名クイズ #よめるべや",
    ].join("\n");
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const fontHead = "'Shippori Mincho', serif";
  const fontBody = "'Zen Kaku Gothic New', sans-serif";
  const fontMono = "'JetBrains Mono', monospace";

  const bgStyle = {
    background: "radial-gradient(ellipse at top, #FFF6E6 0%, #FBEFDC 50%, #F6E8CE 100%)",
    fontFamily: fontBody,
    color: "#3D2E26",
  };

  /* ===== メニュー画面 ===== */
  if (screen === "menu") {
    return (
      <div className="min-h-screen w-full" style={bgStyle}>
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(255,180,120,0.18) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(135,200,180,0.18) 0%, transparent 45%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 py-10 sm:py-16">
          {/* タイトル */}
          <div className="text-center mb-10">
            <div
              style={{
                fontFamily: fontHead,
                fontWeight: 800,
                fontSize: "clamp(2rem, 8vw, 3.2rem)",
                color: "#F08856",
                letterSpacing: "0.05em",
                lineHeight: 1.2,
              }}
            >
              よめるべや？
            </div>
            <div
              style={{
                fontFamily: fontHead,
                fontWeight: 700,
                fontSize: "clamp(1.4rem, 5vw, 2rem)",
                color: "#3D2E26",
                letterSpacing: "0.08em",
                marginTop: "0.3rem",
              }}
            >
              北海道 全179市町村
            </div>
            <div
              className="mt-3 mx-auto"
              style={{
                width: "6rem",
                height: "3px",
                background: "linear-gradient(to right, #F08856, #F4C95D)",
                borderRadius: "9999px",
              }}
            />
            <p
              className="mt-4 text-sm"
              style={{ color: "#8B7D6E", fontFamily: fontBody, letterSpacing: "0.1em" }}
            >
              エリアを選んでゲームスタート
            </p>
          </div>

          {/* 全179ボタン */}
          <button
            onClick={() => startGame("all")}
            className="w-full rounded-3xl py-6 mb-8 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #F08856 0%, #F4B53D 100%)",
              color: "#fff",
              fontFamily: fontHead,
              fontWeight: 800,
              fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
              letterSpacing: "0.1em",
              boxShadow: "0 10px 30px rgba(240,136,86,0.40)",
              border: "none",
              cursor: "pointer",
            }}
          >
            全179市町村に挑戦 →
          </button>

          {/* 振興局グリッド */}
          <div
            className="rounded-3xl p-5"
            style={{
              background: "#FFFFFF",
              border: "1px solid #EADCC4",
              boxShadow: "0 4px 20px rgba(180,140,80,0.10)",
            }}
          >
            <p
              className="text-center text-xs mb-4"
              style={{ color: "#8B7D6E", letterSpacing: "0.2em", fontFamily: fontBody }}
            >
              振興局・支庁別
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REGIONS.map((r) => {
                const count = DATA.filter((d) => d.region === r).length;
                return (
                  <button
                    key={r}
                    onClick={() => startGame(r)}
                    className="rounded-2xl px-3 py-3 text-left transition-all hover:scale-[1.03] active:scale-[0.97]"
                    style={{
                      background: `${REGION_COLORS[r]}18`,
                      border: `1.5px solid ${REGION_COLORS[r]}55`,
                      cursor: "pointer",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: REGION_COLORS[r] }}
                      />
                      <span
                        style={{
                          fontFamily: fontHead,
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          color: "#3D2E26",
                        }}
                      >
                        {r}
                      </span>
                    </div>
                    <div
                      className="mt-0.5 pl-4"
                      style={{ fontSize: "0.72rem", color: "#8B7D6E", letterSpacing: "0.05em" }}
                    >
                      {count}市町村
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ===== 全問クリア画面 ===== */
  if (screen === "complete") {
    const regionLabel = selectedRegion === "all" ? "全179市町村" : `${selectedRegion}振興局`;
    const hardList = Object.entries(wrongCounts)
      .map(([name, count]) => ({ item: DATA.find((d) => d.name === name), count }))
      .filter((x) => x.item)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    function shareComplete() {
      const hard = hardList
        .slice(0, 3)
        .map(({ item, count }) => `${item.name}(${count}回)`)
        .join("・");
      const text = [
        `🎉 よめるべや？北海道 ${regionLabel} 制覇！`,
        "",
        `📍 ${regionLabel} 全 ${poolSize} 市町村クリア`,
        `🎯 正答率 ${accuracy}%`,
        `🔥 最大連続 ${stats.best}問正解`,
        hard ? `😅 苦手: ${hard}` : "",
        "",
        "北海道の市町村、あなたは何問読める？",
        "#北海道 #地名クイズ #HokkaidoQuiz",
      ]
        .filter(Boolean)
        .join("\n");
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }

    return (
      <div className="min-h-screen w-full" style={bgStyle}>
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(255,180,120,0.18) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(135,200,180,0.18) 0%, transparent 45%)",
          }}
        />
        <div className="relative max-w-2xl mx-auto px-4 py-10 sm:py-16">
          {/* 祝福ヘッダー */}
          <div className="text-center mb-8">
            <div style={{ fontSize: "4rem", lineHeight: 1 }}>🎉</div>
            <div
              style={{
                fontFamily: fontHead,
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
                color: "#F08856",
                marginTop: "0.5rem",
                letterSpacing: "0.05em",
              }}
            >
              {regionLabel} 制覇！
            </div>
            <div
              style={{
                fontFamily: fontBody,
                color: "#8B7D6E",
                fontSize: "0.95rem",
                marginTop: "0.5rem",
                letterSpacing: "0.1em",
              }}
            >
              全 {poolSize} 市町村の読み方をマスターした！
            </div>
          </div>

          {/* スタッツ */}
          <div
            className="rounded-3xl p-5 grid grid-cols-4 gap-3 text-center mb-5"
            style={{
              background: "#FFFFFF",
              border: "1px solid #EADCC4",
              boxShadow: "0 4px 16px rgba(180,140,80,0.08)",
            }}
          >
            <Stat label="正解" value={stats.correct} color="#5BA982" font={fontHead} />
            <Stat label="ミス" value={stats.wrong} color="#E76F51" font={fontHead} />
            <Stat label="最大連続" value={stats.best} color="#F4B53D" font={fontHead} />
            <Stat label="正答率" value={`${accuracy}%`} color="#6BA8C7" font={fontHead} />
          </div>

          {/* 苦手だった地名 */}
          {hardList.length > 0 && (
            <div
              className="rounded-3xl p-5 mb-5"
              style={{
                background: "#FFFFFF",
                border: "1px solid #EADCC4",
                boxShadow: "0 4px 16px rgba(180,140,80,0.08)",
              }}
            >
              <div
                style={{
                  fontFamily: fontHead,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: "#8B7D6E",
                  letterSpacing: "0.12em",
                  marginBottom: "0.75rem",
                }}
              >
                😅 苦手だった地名
              </div>
              <div className="flex flex-col gap-2.5">
                {hardList.map(({ item, count }, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          fontFamily: fontHead,
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          color: REGION_COLORS[item.region],
                          width: "1.2rem",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        style={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.05rem", color: "#3D2E26" }}
                      >
                        {item.name}
                      </span>
                      <span style={{ fontFamily: fontHead, fontSize: "0.85rem", color: "#8B7D6E" }}>
                        （{item.reading}）
                      </span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs flex-shrink-0"
                      style={{ background: "#FBE3DC", color: "#E76F51", fontWeight: 700 }}
                    >
                      {count}回ミス
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ボタン群 */}
          <div className="flex flex-col gap-3">
            <button
              onClick={shareComplete}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "#000",
                color: "#fff",
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "0.1em",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(0,0,0,0.22)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Xで結果をシェア
            </button>
            <button
              onClick={() => startGame(selectedRegion)}
              className="w-full py-4 rounded-2xl transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #F08856 0%, #F4B53D 100%)",
                color: "#fff",
                fontFamily: fontHead,
                fontWeight: 700,
                fontSize: "1.05rem",
                letterSpacing: "0.12em",
                boxShadow: "0 6px 20px rgba(240,136,86,0.35)",
                border: "none",
                cursor: "pointer",
              }}
            >
              もう一度挑戦 →
            </button>
            <button
              onClick={backToMenu}
              className="text-sm py-2"
              style={{ color: "#8B7D6E", background: "none", border: "none", cursor: "pointer" }}
            >
              ← メニューに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ===== プレイ画面 ===== */
  return (
    <div className="min-h-screen w-full" style={bgStyle}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(255,180,120,0.18) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(135,200,180,0.18) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(244,201,93,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 py-6 sm:py-10">
        {/* ヘッダー */}
        <header className="mb-6 sm:mb-8">
          <button
            onClick={backToMenu}
            className="mb-3 text-sm flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: "#8B7D6E", fontFamily: fontBody, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            ← モード選択へ戻る
          </button>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span
              style={{
                fontFamily: fontHead,
                fontWeight: 800,
                fontSize: "1.8rem",
                color: "#F08856",
                letterSpacing: "0.05em",
              }}
            >
              北海道
            </span>
            <span
              style={{
                fontFamily: fontHead,
                fontWeight: 500,
                fontSize: "1.1rem",
                color: "#8B7D6E",
                letterSpacing: "0.3em",
              }}
            >
              {selectedRegion === "all" ? "全179市町村" : `${selectedRegion}振興局`}
            </span>
          </div>
          <h1
            style={{
              fontFamily: fontHead,
              fontWeight: 700,
              fontSize: "2rem",
              lineHeight: 1.1,
              marginTop: "0.3rem",
              letterSpacing: "0.02em",
              color: "#3D2E26",
            }}
          >
            よめるべや？
          </h1>
          <div
            className="mt-2 h-px"
            style={{ background: "linear-gradient(to right, #F08856 0%, #F4C95D 30%, transparent 100%)" }}
          />
        </header>

        {/* 問題カード */}
        {current && phase === "question" && (
          <div
            className="rounded-3xl p-6 sm:p-10 mb-4"
            style={{
              background: "#FFFFFF",
              border: "1px solid #EADCC4",
              boxShadow: "0 8px 30px rgba(180,140,80,0.12)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: REGION_COLORS[current.region] }}
              />
              <span style={{ color: "#8B7D6E", fontSize: "0.8rem", letterSpacing: "0.15em" }}>
                {current.region}振興局
              </span>
            </div>

            <div
              style={{
                fontFamily: fontHead,
                fontSize: "clamp(2.4rem, 9vw, 4.5rem)",
                fontWeight: 800,
                letterSpacing: "0.05em",
                lineHeight: 1.15,
                color: "#3D2E26",
              }}
            >
              {current.name}
            </div>

            <div className="mt-6">
              <div
                className="mb-3"
                style={{
                  fontFamily: fontHead,
                  fontSize: "clamp(1.4rem, 5vw, 2rem)",
                  letterSpacing: "0.1em",
                  color: "#3D2E26",
                  fontWeight: 700,
                  minHeight: "2.2em",
                }}
              >
                {input || (
                  <span style={{ color: "#C0B5A0", fontWeight: 500 }}>ひらがなで答えてね</span>
                )}
              </div>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => { isComposingRef.current = true; }}
                onCompositionEnd={(e) => {
                  isComposingRef.current = false;
                  setInput(e.target.value.replace(/[^ぁ-ゖー]/g, ""));
                }}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                placeholder="ひらがなで回答"
                lang="ja"
                inputMode="text"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  background: wrongFlash ? "#FBE3DC" : "#FBF5EA",
                  border: wrongFlash ? "2px solid #E76F51" : "2px solid #EADCC4",
                  color: "#3D2E26",
                  fontSize: "1.1rem",
                  fontFamily: fontHead,
                  letterSpacing: "0.05em",
                  transition: "background 0.15s, border 0.15s",
                }}
              />
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleSubmit}
                  disabled={input.length === 0}
                  className="px-6 py-3 rounded-2xl transition"
                  style={{
                    background: input.length === 0 ? "#E8DDC8" : "#F08856",
                    color: input.length === 0 ? "#B8AC9A" : "#fff",
                    fontFamily: fontBody,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    boxShadow: input.length === 0 ? "none" : "0 6px 18px rgba(240,136,86,0.35)",
                    cursor: input.length === 0 ? "not-allowed" : "pointer",
                    border: "none",
                  }}
                >
                  解答する
                </button>
                <button
                  onClick={handleSkip}
                  className="text-xs underline"
                  style={{ color: "#8B7D6E", background: "none", border: "none", cursor: "pointer" }}
                >
                  わからない → 答えを見る
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 答え合わせカード */}
        {current && phase === "answer" && (
          <div
            className="rounded-3xl p-6 sm:p-8 mb-4"
            style={{
              background: "#FFFFFF",
              border: "1px solid #EADCC4",
              boxShadow: "0 8px 30px rgba(180,140,80,0.12)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: REGION_COLORS[current.region] }}
              />
              <span style={{ color: "#8B7D6E", fontSize: "0.8rem", letterSpacing: "0.15em" }}>
                {current.region}振興局
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* 答え情報 */}
              <div>
                <div
                  style={{
                    fontFamily: fontHead,
                    fontSize: "clamp(2.5rem, 8vw, 4rem)",
                    fontWeight: 800,
                    color: "#3D2E26",
                    lineHeight: 1.1,
                    letterSpacing: "0.03em",
                  }}
                >
                  {current.name}
                </div>
                <div
                  className="mt-1"
                  style={{ fontFamily: fontHead, fontSize: "1.1rem", color: "#8B7D6E", letterSpacing: "0.1em" }}
                >
                  {current.reading}
                </div>
                <div
                  className="mt-1"
                  style={{ fontFamily: fontMono, fontSize: "0.95rem", color: "#B8AC9A", letterSpacing: "0.08em" }}
                >
                  {current.roma}
                </div>

                {/* 人口 */}
                {current.population && (
                  <div className="mt-4 flex items-baseline gap-2">
                    <span
                      style={{ fontSize: "0.75rem", color: "#8B7D6E", fontFamily: fontBody, letterSpacing: "0.12em" }}
                    >
                      人口
                    </span>
                    <span
                      style={{
                        fontFamily: fontHead,
                        fontWeight: 800,
                        fontSize: "1.8rem",
                        color: "#3D2E26",
                        letterSpacing: "0.04em",
                        lineHeight: 1,
                      }}
                    >
                      約{formatPopulation(current.population)}
                    </span>
                  </div>
                )}

              </div>

              {/* 地図 */}
              <div>
                <svg
                  viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                  className="w-full"
                  style={{ background: "#FBF5EA", borderRadius: "1rem" }}
                >
                  <path
                    d={HOKKAIDO_PATH}
                    fill="#F4E6CB"
                    stroke="#D8C29A"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  {(() => {
                    const [x, y] = project(current.lat, current.lng);
                    return (
                      <>
                        <circle cx={x} cy={y} r={18} fill="none" stroke="#F08856" strokeWidth="2" opacity="0.5">
                          <animate attributeName="r" from="8" to="24" dur="1.6s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.7" to="0" dur="1.6s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={x} cy={y} r={7} fill="#F08856" stroke="#fff" strokeWidth="2" />
                        <text
                          x={x + 12}
                          y={y + 5}
                          fill="#3D2E26"
                          style={{ fontFamily: fontHead, fontSize: "13px", fontWeight: 700 }}
                          stroke="#FBF5EA"
                          strokeWidth="3"
                          paintOrder="stroke"
                        >
                          {current.name}
                        </text>
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* 拡張情報セクション */}
            {(current.trivia || current.specialty || current.spots) && (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {current.trivia && (
                  <InfoCard icon="💡" label="北海道雑学" fontHead={fontHead} accentColor="#F4B53D">
                    <p style={{ fontSize: "0.88rem", color: "#3D2E26", lineHeight: 1.6 }}>{current.trivia}</p>
                  </InfoCard>
                )}
                {current.specialty && current.specialty.length > 0 && (
                  <InfoCard icon="🍱" label="特産品・グルメ" fontHead={fontHead} accentColor="#5BA982">
                    <div className="flex flex-wrap gap-1.5">
                      {current.specialty.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{ background: "#EAF6EE", color: "#3D7A5A", fontWeight: 500 }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </InfoCard>
                )}
                {current.spots && current.spots.length > 0 && (
                  <InfoCard icon="🗺" label="観光スポット" fontHead={fontHead} accentColor="#6BA8C7">
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {current.spots.map((s) => (
                        <li
                          key={s}
                          className="flex items-start gap-1.5"
                          style={{ fontSize: "0.85rem", color: "#3D2E26", lineHeight: 1.6 }}
                        >
                          <span style={{ color: "#6BA8C7", flexShrink: 0 }}>▸</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </InfoCard>
                )}
              </div>
            )}

            {/* 次の問題ボタン — 情報を読み終えたあと */}
            <div
              className="mt-6 pt-5"
              style={{ borderTop: "1px solid #EADCC4" }}
            >
              <button
                onClick={next}
                className="w-full py-4 rounded-2xl transition-all hover:opacity-90 active:scale-[0.99]"
                style={{
                  background: "linear-gradient(135deg, #F08856 0%, #F4B53D 100%)",
                  color: "#fff",
                  fontFamily: fontHead,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  letterSpacing: "0.12em",
                  boxShadow: "0 6px 20px rgba(240,136,86,0.35)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                次の問題 →
              </button>
            </div>
          </div>
        )}

        {/* スタッツ */}
        <div
          className="rounded-3xl p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-3"
          style={{
            background: "#FFFFFF",
            border: "1px solid #EADCC4",
            boxShadow: "0 4px 16px rgba(180,140,80,0.08)",
          }}
        >
          <Stat label="正解" value={stats.correct} color="#5BA982" font={fontHead} />
          <Stat label="ミス" value={stats.wrong} color="#E76F51" font={fontHead} />
          <Stat label="連続" value={stats.streak} color="#F4B53D" font={fontHead} />
          <Stat label="正答率" value={`${accuracy}%`} color="#6BA8C7" font={fontHead} />
        </div>

        {/* 達成率プログレスバー */}
        <div
          className="rounded-2xl px-5 py-3 flex items-center justify-between gap-4"
          style={{
            background: "#FFFFFF",
            border: "1px solid #EADCC4",
            boxShadow: "0 2px 8px rgba(180,140,80,0.06)",
          }}
        >
          <div style={{ fontSize: "0.85rem", color: "#8B7D6E", letterSpacing: "0.08em" }}>
            <span style={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", color: "#3D2E26" }}>
              {correctSet.size}
            </span>
            <span className="mx-1" style={{ color: "#C0B5A0" }}>/</span>
            <span>{poolSize}</span>
            <span className="ml-2">完了</span>
          </div>
          <div className="flex-1 max-w-40">
            <div
              className="rounded-full overflow-hidden"
              style={{ height: "6px", background: "#F0E8D5" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  background: "linear-gradient(to right, #F08856, #F4C95D)",
                }}
              />
            </div>
          </div>
          <div
            style={{
              fontFamily: fontHead,
              fontWeight: 700,
              fontSize: "1rem",
              color: "#F08856",
              letterSpacing: "0.05em",
            }}
          >
            {progressPct}%
          </div>
          {stats.correct > 0 && (
            <button
              onClick={handleShare}
              title="結果をXでシェア"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 flex-shrink-0"
              style={{
                background: "#000",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontFamily: fontBody,
                fontWeight: 700,
                letterSpacing: "0.05em",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              シェア
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, children, fontHead, accentColor }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "#FDFAF4",
        border: `1.5px solid ${accentColor}33`,
      }}
    >
      <div
        className="flex items-center gap-1.5 mb-2"
        style={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.8rem", color: accentColor, letterSpacing: "0.1em" }}
      >
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value, color, font }) {
  return (
    <div>
      <div style={{ fontFamily: font, fontSize: "1.7rem", fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: "0.7rem", color: "#8B7D6E", letterSpacing: "0.15em", marginTop: "0.1rem" }}>{label}</div>
    </div>
  );
}
