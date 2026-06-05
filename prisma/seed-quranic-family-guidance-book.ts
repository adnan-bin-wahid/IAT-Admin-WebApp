import { PrismaClient, DuaStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categoriesData = [
  {
    slug: "family-dua",
    nameEn: "Family Dua",
    nameBn: "পরিবারের দুআ",
    descriptionEn: "Duas related to family, spouse and children.",
    descriptionBn: "পরিবার, জীবনসঙ্গী ও সন্তান-সন্ততির জন্য দুআ।",
    icon: "Users",
    color: "#15803d"
  },
  {
    slug: "guidance-dua",
    nameEn: "Guidance Dua",
    nameBn: "হিদায়াতের দুআ",
    descriptionEn: "Duas asking Allah for guidance, steadfastness and protection from misguidance.",
    descriptionBn: "হিদায়াত,রায় ও পথভ্রষ্টতা থেকে রক্ষার জন্য দুআ।",
    icon: "Compass",
    color: "#0f766e"
  },
  {
    slug: "knowledge-dua",
    nameEn: "Knowledge Dua",
    nameBn: "জ্ঞানের দুআ",
    descriptionEn: "Duas for beneficial knowledge and wisdom.",
    descriptionBn: "উপকারী জ্ঞান ও প্রজ্ঞার জন্য দুআ।",
    icon: "GraduationCap",
    color: "#2563eb"
  },
  {
    slug: "worship-dua",
    nameEn: "Worship Dua",
    nameBn: "ইবাদতের দুআ",
    descriptionEn: "Duas related to salah, worship and obedience.",
    descriptionBn: "সালাত, ইবাদত ও আনুগত্য সম্পর্কিত দুআ।",
    icon: "Heart",
    color: "#7c3aed"
  },
  {
    slug: "forgiveness-dua",
    nameEn: "Forgiveness Dua",
    nameBn: "ক্ষমার দুআ",
    descriptionEn: "Duas seeking forgiveness, mercy and protection.",
    descriptionBn: "ক্ষমা, রহমত ও সুরক্ষার জন্য দুআ।",
    icon: "ShieldCheck",
    color: "#b45309"
  },
  {
    slug: "rizq-gratitude-dua",
    nameEn: "Rizq and Gratitude Dua",
    nameBn: "রিজিক ও কৃতজ্ঞতার দুআ",
    descriptionEn: "Duas for provision, gratitude and righteous use of blessings.",
    descriptionBn: "রিজিক, কৃতজ্ঞতা এবং নিয়ামতের সঠিক ব্যবহারের জন্য দুআ।",
    icon: "HandHeart",
    color: "#ca8a04"
  }
];

const bookData = {
  slug: "quranic-duas-family-guidance-daily-life",
  nameEn: "Quranic Duas for Family, Guidance & Daily Life",
  nameBn: "পরিবার, হিদায়াত ও দৈনন্দিন জীবনের কুরআনিক দুআ",
  subtitleEn: "Selected Quranic supplications for personal, family, spiritual and daily needs",
  subtitleBn: "ব্যতিগত, পারিবারিক, আধ্যাত্মিক ও দৈনন্দিন প্রয়োজনের নির্বাচিত কুরআনিক দুআ",
  descriptionEn: "A curated collection of Quranic duas covering family, guidance, knowledge, worship, forgiveness, provision and success in the Hereafter.",
  descriptionBn: "পরিবার, হিদায়াত, জ্ঞান, ইবাদত, ক্ষমা, রিজিক এবং আখিরাতের সফলতার জন্য কুরআন থেকে নির্বাচিত দুআসমূহের একটি সংকলন।",
  icon: "BookOpen",
  accentColor: "#166534",
  displayOrder: 10,
  status: DuaStatus.published,
  isVisibleInApp: true
};

const indexesData = [
  {
    slug: "family-and-children",
    titleEn: "Family and Children",
    titleBn: "পরিবার ও সন্তান",
    subtitleEn: "Duas for righteous family and descendants",
    subtitleBn: "নেক পরিবার ও সন্তান-সন্ততির জন্য দুআ",
    descriptionEn: "Quranic supplications for spouse, children and family righteousness.",
    descriptionBn: "জীবনসঙ্গী, সন্তান-সন্ততি এবং পরিবারের নেকির জন্য কুরআনিক দুআসমূহ।",
    icon: "Users",
    displayOrder: 1,
    status: DuaStatus.published,
    isVisibleInApp: true
  },
  {
    slug: "guidance-and-steadfastness",
    titleEn: "Guidance and Steadfastness",
    titleBn: "হিদায়াত ও দৃঢ়তা",
    subtitleEn: "Duas for guidance and firmness upon truth",
    subtitleBn: "হিদায়াত ও সত্যের উপর দৃঢ় থাকার দুআ",
    descriptionEn: "Quranic duas asking Allah to guide the heart and keep it firm.",
    descriptionBn: "অন্তরের হিদায়াত ও ঈমানের উপর দৃঢ়তার জন্য কুরআনিক দুআ।",
    icon: "Compass",
    displayOrder: 2,
    status: DuaStatus.published,
    isVisibleInApp: true
  },
  {
    slug: "knowledge-worship-and-gratitude",
    titleEn: "Knowledge, Worship and Gratitude",
    titleBn: "জ্ঞান, ইবাদত ও কৃতজ্ঞতা",
    subtitleEn: "Duas for knowledge, prayer and thankfulness",
    subtitleBn: "জ্ঞান, সালাত ও কৃতজ্ঞতার দুআ",
    descriptionEn: "Quranic duas for increasing knowledge, establishing prayer and being grateful.",
    descriptionBn: "জ্ঞান বৃদ্ধি, সালাত প্রতিষ্ঠা এবং কৃতজ্ঞতা প্রকাশের জন্য কুরআনিক দুআ।",
    icon: "GraduationCap",
    displayOrder: 3,
    status: DuaStatus.published,
    isVisibleInApp: true
  },
  {
    slug: "forgiveness-provision-and-hereafter",
    titleEn: "Forgiveness, Provision and Hereafter",
    titleBn: "ক্ষমা, রিজিক ও আখিরাত",
    subtitleEn: "Duas for mercy, provision and success in the Hereafter",
    subtitleBn: "রহমত, রিজিক ও আখিরাতের সফলতার দুআ",
    descriptionEn: "Quranic supplications for forgiveness, provision, mercy and eternal success.",
    descriptionBn: "ক্ষমা, রিজিক, রহমত এবং চিরস্থায়ী সফলতার জন্য কুরআনিক দুআসমূহ।",
    icon: "ShieldCheck",
    displayOrder: 4,
    status: DuaStatus.published,
    isVisibleInApp: true
  }
];

const duasData = [
  // Index 1
  {
    indexSlug: "family-and-children",
    categorySlug: "family-dua",
    slug: "dua-for-righteous-spouse-and-children",
    titleEn: "Dua for righteous spouse and children",
    titleBn: "নেক জীবনসঙ্গী ও সন্তানের দুআ",
    arabicText: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    banglaMeaning: "হে আমাদের রব, আমাদের জীবনসঙ্গী ও সন্তান-সন্ততির পক্ষ থেকে আমাদের চোখের শীতলতা দান করুন এবং আমাদের মুত্তাকীদের নেতা বানিয়ে দিন।",
    englishMeaning: "Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us an example for the righteous.",
    transliterationBn: "রব্বানা হাব লানা মিন আযওয়াজিনা ওয়া যুররিয়্যাতিনা কুররাতা আ'ইউনিন ওয়াজআলনা লিল মুত্তাকীনা ইমামা।",
    transliterationEn: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama.",
    referenceBn: "সূরা আল-ফুরকান ২৫:৭৪",
    referenceEn: "Quran 25:74",
    benefitsBn: "পরিবার, সন্তান ও নেক নেতৃত্বের জন্য গুরুত্বপূর্ণ কুরআনিক দুআ।",
    benefitsEn: "A Quranic dua for righteous family, children and leadership in piety.",
    notesBn: "পরিবার ও সন্তান-সন্ততির কল্যাণের জন্য নিয়মিত পড়া যেতে পারে।",
    notesEn: "Can be recited regularly for family righteousness and pious descendants.",
    repeatCount: 1,
    tagsBn: ["পরিবার", "সন্তান", "নেক সন্তান", "জীবনসঙ্গী"],
    tagsEn: ["family", "children", "spouse", "righteous family"],
    searchKeywordsBn: "পরিবার সন্তান জীবনসঙ্গী নেক সন্তান মুত্তাকী",
    searchKeywordsEn: "family children spouse righteous offspring muttaqin",
    displayOrder: 1,
    status: DuaStatus.published,
    isVisibleInApp: true
  },
  {
    indexSlug: "family-and-children",
    categorySlug: "family-dua",
    slug: "dua-for-righteous-descendants",
    titleEn: "Dua for righteous descendants",
    titleBn: "নেক বংশধরের দুআ",
    arabicText: "رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ",
    banglaMeaning: "হে আমার রব, আমাকে নেককারদের মধ্য থেকে সন্তান দান করুন।",
    englishMeaning: "My Lord, grant me a child from among the righteous.",
    transliterationBn: "রব্বি হাব লী মিনাস সালিহীন।",
    transliterationEn: "Rabbi hab li minas-salihin.",
    referenceBn: "সূরা আস-সাফফাত ৩৭:১০০",
    referenceEn: "Quran 37:100",
    benefitsBn: "নেক সন্তান ও নেক বংশধরের জন্য সংক্ষিপ্ত কুরআনিক দুআ।",
    benefitsEn: "A concise Quranic dua for righteous children and descendants.",
    notesBn: "সন্তান কামনা ও সন্তানদের নেকির জন্য পড়া যেতে পারে।",
    notesEn: "Can be recited when asking Allah for righteous offspring.",
    repeatCount: 1,
    tagsBn: ["সন্তান", "নেক সন্তান", "বংশধর"],
    tagsEn: ["children", "righteous children", "descendants"],
    searchKeywordsBn: "সন্তান নেক সন্তান বংশধর সালিহীন",
    searchKeywordsEn: "child righteous offspring descendants salihin",
    displayOrder: 2,
    status: DuaStatus.published,
    isVisibleInApp: true
  },
  // Index 2
  {
    indexSlug: "guidance-and-steadfastness",
    categorySlug: "guidance-dua",
    slug: "dua-for-steadfast-hearts",
    titleEn: "Dua for steadfast hearts",
    titleBn: "অন্তরকে দৃঢ় রাখার দুআ",
    arabicText: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
    banglaMeaning: "হে আমাদের রব, আপনি আমাদের হিদায়াত দেওয়ার পর আমাদের অন্তরকে বক্র করবেন না এবং আপনার পক্ষ থেকে আমাদের রহমত দান করুন। নিশ্চয়ই আপনি মহাদাতা।",
    englishMeaning: "Our Lord, do not let our hearts deviate after You have guided us, and grant us mercy from Yourself. Indeed, You are the Bestower.",
    transliterationBn: "রব্বানা লা তুযিগ কুলুবানা বা'দা ইয হাদাইতানা ওয়া হাব লানা মিল্লাদুনকা রহমাহ, ইন্নাকা আনতাল ওয়াহ্হাব।",
    transliterationEn: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana mil ladunka rahmah, innaka antal-Wahhab.",
    referenceBn: "সূরা আলে ইমরান ৩:৮",
    referenceEn: "Quran 3:8",
    benefitsBn: "হিদায়াতের উপর দৃঢ় থাকা এবং অন্তরের সুরক্ষার জন্য গুরুত্বপূর্ণ দুআ।",
    benefitsEn: "A powerful dua for steadfastness, guidance and protection of the heart.",
    notesBn: "ঈমান ও হিদায়াতের উপর স্থির থাকার জন্য পড়া যেতে পারে।",
    notesEn: "Can be recited for firmness upon faith and guidance.",
    repeatCount: 1,
    tagsBn: ["হিদায়াত", "অন্তর", "ঈমান", "দৃঢ়তা"],
    tagsEn: ["guidance", "heart", "faith", "steadfastness"],
    searchKeywordsBn: "হিদায়াত অন্তর ঈমান দৃঢ়তা কুলুব",
    searchKeywordsEn: "guidance heart faith steadfastness qulub",
    displayOrder: 1,
    status: DuaStatus.published,
    isVisibleInApp: true
  },
  {
    indexSlug: "guidance-and-steadfastness",
    categorySlug: "guidance-dua",
    slug: "dua-to-be-among-the-guided",
    titleEn: "Dua to be among the guided",
    titleBn: "হিদায়াতপ্রাপ্তদের অন্তর্ভুক্ত হওয়ার দুআ",
    arabicText: "رَبَّنَا آمَنَّا فَاكْتُبْنَا مَعَ الشَّاهِدِينَ",
    banglaMeaning: "হে আমাদের রব, আমরা ঈমান এনেছি; অতএব আমাদের সাক্ষ্যদানকারীদের সঙ্গে লিখে নিন।",
    englishMeaning: "Our Lord, we have believed, so register us among the witnesses.",
    transliterationBn: "রব্বানা আমান্না ফাকতুবনা মা'আশ শাহিদীন।",
    transliterationEn: "Rabbana amanna faktubna ma'ash-shahidin.",
    referenceBn: "সূরা আল-মায়িদাহ ৫:৮৩",
    referenceEn: "Quran 5:83",
    benefitsBn: "ঈমানের স্বীকৃতি এবং সত্যের সাক্ষীদের অন্তর্ভুক্ত হওয়ার দুআ।",
    benefitsEn: "A dua affirming faith and asking to be counted among the witnesses of truth.",
    notesBn: "ঈমানের দৃঢ়তা ও সত্যের পথে থাকার জন্য পড়া যেতে পারে।",
    notesEn: "Can be recited to affirm faith and remain among the people of truth.",
    repeatCount: 1,
    tagsBn: ["ঈমান", "সত্য", "সাক্ষী", "হিদায়াত"],
    tagsEn: ["faith", "truth", "witnesses", "guidance"],
    searchKeywordsBn: "ঈমান সত্য সাক্ষী হিদায়াত শাহিদীন",
    searchKeywordsEn: "iman faith truth witnesses shahidin guidance",
    displayOrder: 2,
    status: DuaStatus.published,
    isVisibleInApp: true
  },
  // Index 3
  {
    indexSlug: "knowledge-worship-and-gratitude",
    categorySlug: "knowledge-dua",
    slug: "dua-for-increase-in-knowledge",
    titleEn: "Dua for increase in knowledge",
    titleBn: "জ্ঞান বৃদ্ধি পাওয়ার দুআ",
    arabicText: "رَبِّ زِدْنِي عِلْمًا",
    banglaMeaning: "হে আমার রব, আমার জ্ঞান বৃদ্ধি করে দিন।",
    englishMeaning: "My Lord, increase me in knowledge.",
    transliterationBn: "রব্বি যিদনী ইলমা।",
    transliterationEn: "Rabbi zidni ilma.",
    referenceBn: "সূরা ত্বহা ২০:১১৪",
    referenceEn: "Quran 20:114",
    benefitsBn: "উপকারী জ্ঞান বৃদ্ধির জন্য সংক্ষিপ্ত ও গুরুত্বপূর্ণ দুআ।",
    benefitsEn: "A concise and important dua for increase in beneficial knowledge.",
    notesBn: "পড়াশোনা, শিক্ষা ও জ্ঞান অর্জনের সময় পড়া যেতে পারে।",
    notesEn: "Can be recited during study, learning and seeking knowledge.",
    repeatCount: 1,
    tagsBn: ["জ্ঞান", "শিক্ষা", "পড়াশোনা", "ইলম"],
    tagsEn: ["knowledge", "learning", "study", "ilm"],
    searchKeywordsBn: "জ্ঞান শিক্ষা পড়াশোনা ইলম",
    searchKeywordsEn: "knowledge learning study ilm",
    displayOrder: 1,
    status: DuaStatus.published,
    isVisibleInApp: true
  },
  {
    indexSlug: "knowledge-worship-and-gratitude",
    categorySlug: "worship-dua",
    slug: "dua-for-establishing-prayer",
    titleEn: "Dua for establishing prayer",
    titleBn: "সালাত প্রতিষ্ঠার দুআ",
    arabicText: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
    banglaMeaning: "হে আমার রব, আমাকে সালাত প্রতিষ্ঠাকারী বানিয়ে দিন এবং আমার সন্তানদের মধ্য থেকেও। হে আমাদের রব, আমার দুআ কবুল করুন।",
    englishMeaning: "My Lord, make me an establisher of prayer, and many from my descendants. Our Lord, and accept my supplication.",
    transliterationBn: "রব্বিজ আলনী মুকীমাস সালাতি ওয়া মিন যুররিয়্যাতী, রব্বানা ওয়া তাকাব্বাল দু'আ।",
    transliterationEn: "Rabbij'alni muqimas-salati wa min dhurriyyati, Rabbana wa taqabbal du'a.",
    referenceBn: "সূরা ইবরাহীম ১৪:৪০",
    referenceEn: "Quran 14:40",
    benefitsBn: "নিজে ও পরিবারকে সালাত প্রতিষ্ঠাকারী বানানোর জন্য কুরআনিক দুআ।",
    benefitsEn: "A Quranic dua for oneself and descendants to establish prayer.",
    notesBn: "সালাতের প্রতি যত্নবান হওয়ার জন্য নিয়মিত পড়া যেতে পারে।",
    notesEn: "Can be recited regularly to seek consistency in prayer.",
    repeatCount: 1,
    tagsBn: ["সালাত", "নামাজ", "ইবাদত", "সন্তান"],
    tagsEn: ["prayer", "salah", "worship", "descendants"],
    searchKeywordsBn: "সালাত নামাজ ইবাদত সন্তান মুকীমাস সালাত",
    searchKeywordsEn: "salah prayer worship descendants muqimas salat",
    displayOrder: 2,
    status: DuaStatus.published,
    isVisibleInApp: true
  },
  // Index 4
  {
    indexSlug: "forgiveness-provision-and-hereafter",
    categorySlug: "rizq-gratitude-dua",
    slug: "dua-for-gratitude-and-righteous-deeds",
    titleEn: "Dua for gratitude and righteous deeds",
    titleBn: "কৃতজ্ঞতা ও নেক আমলের দুআ",
    arabicText: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ",
    banglaMeaning: "হে আমার রব, আমাকে তাওফিক দিন যেন আমি আপনার সেই নিয়ামতের কৃতজ্ঞতা আদায় করতে পারি, যা আপনি আমাকে ও আমার পিতা-মাতাকে দান করেছেন, এবং এমন নেক আমল করতে পারি যা আপনি পছন্দ করেন।",
    englishMeaning: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents, and to do righteousness of which You approve.",
    transliterationBn: "রব্বি আউযি'নী আন আশকুরা নি'মাতাকাল্লাতী আনআমতা আলাইয়া ওয়া আলা ওয়ালিদাইয়া ওয়া আন আ'মালা সালিহান তারদাহ।",
    transliterationEn: "Rabbi awzi'ni an ashkura ni'mataka allati an'amta 'alayya wa 'ala walidayya wa an a'mala salihan tardah.",
    referenceBn: "সূরা আন-নামল ২৭:১৯",
    referenceEn: "Quran 27:19",
    benefitsBn: "নিয়ামতের কৃতজ্ঞতা ও আল্লাহর পছন্দনীয় নেক আমলের জন্য দুআ।",
    benefitsEn: "A dua for gratitude and righteous deeds pleasing to Allah.",
    notesBn: "কৃতজ্ঞতা, আমল ও পিতা-মাতার প্রতি অনুগ্রহ স্মরণের জন্য পড়া যেতে পারে।",
    notesEn: "Can be recited to remember Allah's blessings and ask for righteous action.",
    repeatCount: 1,
    tagsBn: ["কৃতজ্ঞতা", "নিয়ামত", "নেক আমল", "পিতা-মাতা"],
    tagsEn: ["gratitude", "blessings", "righteous deeds", "parents"],
    searchKeywordsBn: "কৃতজ্ঞতা নিয়ামত নেক আমল পিতা-মাতা",
    searchKeywordsEn: "gratitude blessings righteous deeds parents",
    displayOrder: 1,
    status: DuaStatus.published,
    isVisibleInApp: true
  },
  {
    indexSlug: "forgiveness-provision-and-hereafter",
    categorySlug: "forgiveness-dua",
    slug: "dua-for-forgiveness-for-self-and-parents",
    titleEn: "Dua for forgiveness for self and parents",
    titleBn: "নিজের ও পিতা-মাতার ক্ষমার দুআ",
    arabicText: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    banglaMeaning: "হে আমাদের রব, যেদিন হিসাব প্রতিষ্ঠিত হবে, সেদিন আমাকে, আমার পিতা-মাতাকে এবং মুমিনদের ক্ষমা করুন।",
    englishMeaning: "Our Lord, forgive me and my parents and the believers on the Day the account is established.",
    transliterationBn: "রব্বানাগ ফিরলী ওয়া লিওয়ালিদাইয়া ওয়া লিল মু'মিনীনা ইয়াওমা ইয়াকূমুল হিসাব।",
    transliterationEn: "Rabbanaghfir li wa liwalidayya wa lil-mu'minina yawma yaqumul-hisab.",
    referenceBn: "সূরা ইবরাহীম ১৪:৪১",
    referenceEn: "Quran 14:41",
    benefitsBn: "নিজের, পিতা-মাতা এবং সকল মুমিনের ক্ষমার জন্য কুরআনিক দুআ।",
    benefitsEn: "A Quranic dua for forgiveness for oneself, parents and all believers.",
    notesBn: "পিতা-মাতার জন্য দুআ করার ক্ষেত্রে গুরুত্বপূর্ণ একটি কুরআনিক দুআ।",
    notesEn: "An important Quranic dua for praying for one’s parents and the believers.",
    repeatCount: 1,
    tagsBn: ["ক্ষমা", "পিতা-মাতা", "মুমিন", "আখিরাত"],
    tagsEn: ["forgiveness", "parents", "believers", "hereafter"],
    searchKeywordsBn: "ক্ষমা পিতা-মাতা মুমিন আখিরাত হিসাব",
    searchKeywordsEn: "forgiveness parents believers hereafter account",
    displayOrder: 2,
    status: DuaStatus.published,
    isVisibleInApp: true
  }
];

async function main() {
  console.log("🌱 Starting Quranic Supplications Book Seeding...");

  // 1. Seed Categories
  console.log("Seeding categories...");
  for (const cat of categoriesData) {
    const existing = await prisma.duaCategory.findUnique({
      where: { slug: cat.slug }
    });

    if (existing) {
      await prisma.duaCategory.update({
        where: { slug: cat.slug },
        data: {
          nameBn: cat.nameBn,
          nameEn: cat.nameEn,
          descriptionBn: cat.descriptionBn,
          descriptionEn: cat.descriptionEn,
          icon: cat.icon,
          color: cat.color
        }
      });
    } else {
      await prisma.duaCategory.create({
        data: cat
      });
    }
  }

  // 2. Seed Book
  console.log("Seeding book...");
  const existingBook = await prisma.duaBook.findUnique({
    where: { slug: bookData.slug }
  });

  let bookId = "";
  if (existingBook) {
    bookId = existingBook.id;
    const changed =
      existingBook.nameEn !== bookData.nameEn ||
      existingBook.nameBn !== bookData.nameBn ||
      existingBook.subtitleEn !== bookData.subtitleEn ||
      existingBook.subtitleBn !== bookData.subtitleBn ||
      existingBook.descriptionEn !== bookData.descriptionEn ||
      existingBook.descriptionBn !== bookData.descriptionBn ||
      existingBook.icon !== bookData.icon ||
      existingBook.accentColor !== bookData.accentColor ||
      existingBook.displayOrder !== bookData.displayOrder ||
      existingBook.status !== bookData.status ||
      existingBook.isVisibleInApp !== bookData.isVisibleInApp;

    if (changed) {
      console.log(`Book "${bookData.slug}" has changes. Incrementing version.`);
      await prisma.duaBook.update({
        where: { id: bookId },
        data: {
          nameEn: bookData.nameEn,
          nameBn: bookData.nameBn,
          subtitleEn: bookData.subtitleEn,
          subtitleBn: bookData.subtitleBn,
          descriptionEn: bookData.descriptionEn,
          descriptionBn: bookData.descriptionBn,
          icon: bookData.icon,
          accentColor: bookData.accentColor,
          displayOrder: bookData.displayOrder,
          status: bookData.status,
          isVisibleInApp: bookData.isVisibleInApp,
          version: existingBook.version + 1,
          publishedAt: existingBook.publishedAt || new Date()
        }
      });
    } else {
      console.log(`Book "${bookData.slug}" is unchanged.`);
    }
  } else {
    console.log(`Creating new book "${bookData.slug}"...`);
    const newBook = await prisma.duaBook.create({
      data: {
        ...bookData,
        version: 1,
        publishedAt: new Date()
      }
    });
    bookId = newBook.id;
  }

  // 3. Seed Indexes
  console.log("Seeding indexes...");
  const resolvedIndexes: Record<string, string> = {};
  for (const idx of indexesData) {
    const existingIndex = await prisma.duaIndex.findUnique({
      where: {
        bookId_slug: {
          bookId,
          slug: idx.slug
        }
      }
    });

    if (existingIndex) {
      resolvedIndexes[idx.slug] = existingIndex.id;
      const changed =
        existingIndex.titleEn !== idx.titleEn ||
        existingIndex.titleBn !== idx.titleBn ||
        existingIndex.subtitleEn !== idx.subtitleEn ||
        existingIndex.subtitleBn !== idx.subtitleBn ||
        existingIndex.descriptionEn !== idx.descriptionEn ||
        existingIndex.descriptionBn !== idx.descriptionBn ||
        existingIndex.icon !== idx.icon ||
        existingIndex.displayOrder !== idx.displayOrder ||
        existingIndex.status !== idx.status ||
        existingIndex.isVisibleInApp !== idx.isVisibleInApp;

      if (changed) {
        console.log(`Index "${idx.slug}" has changes. Incrementing version.`);
        await prisma.duaIndex.update({
          where: { id: existingIndex.id },
          data: {
            titleEn: idx.titleEn,
            titleBn: idx.titleBn,
            subtitleEn: idx.subtitleEn,
            subtitleBn: idx.subtitleBn,
            descriptionEn: idx.descriptionEn,
            descriptionBn: idx.descriptionBn,
            icon: idx.icon,
            displayOrder: idx.displayOrder,
            status: idx.status,
            isVisibleInApp: idx.isVisibleInApp,
            version: existingIndex.version + 1,
            publishedAt: existingIndex.publishedAt || new Date()
          }
        });
      } else {
        console.log(`Index "${idx.slug}" is unchanged.`);
      }
    } else {
      console.log(`Creating new index "${idx.slug}"...`);
      const newIndex = await prisma.duaIndex.create({
        data: {
          bookId,
          slug: idx.slug,
          titleEn: idx.titleEn,
          titleBn: idx.titleBn,
          subtitleEn: idx.subtitleEn,
          subtitleBn: idx.subtitleBn,
          descriptionEn: idx.descriptionEn,
          descriptionBn: idx.descriptionBn,
          icon: idx.icon,
          displayOrder: idx.displayOrder,
          status: idx.status,
          isVisibleInApp: idx.isVisibleInApp,
          version: 1,
          publishedAt: new Date()
        }
      });
      resolvedIndexes[idx.slug] = newIndex.id;
    }
  }

  // 4. Seed Duas
  console.log("Seeding supplications...");
  const allCategories = await prisma.duaCategory.findMany();
  const categorySlugMap: Record<string, string> = {};
  allCategories.forEach((cat) => {
    categorySlugMap[cat.slug] = cat.id;
  });

  for (const dua of duasData) {
    const indexId = resolvedIndexes[dua.indexSlug];
    const categoryId = categorySlugMap[dua.categorySlug];

    if (!indexId) {
      throw new Error(`Failed to resolve index ID for slug: ${dua.indexSlug}`);
    }
    if (!categoryId) {
      throw new Error(`Failed to resolve category ID for slug: ${dua.categorySlug}`);
    }

    const existingDua = await prisma.duaItem.findUnique({
      where: {
        indexId_slug: {
          indexId,
          slug: dua.slug
        }
      }
    });

    if (existingDua) {
      const arrayEquals = (a: string[], b: string[]) => {
        if (a.length !== b.length) return false;
        return a.every((val, i) => val === b[i]);
      };

      const changed =
        existingDua.categoryId !== categoryId ||
        existingDua.titleEn !== dua.titleEn ||
        existingDua.titleBn !== dua.titleBn ||
        existingDua.arabicText !== dua.arabicText ||
        existingDua.banglaMeaning !== dua.banglaMeaning ||
        existingDua.englishMeaning !== dua.englishMeaning ||
        existingDua.transliterationEn !== dua.transliterationEn ||
        existingDua.transliterationBn !== dua.transliterationBn ||
        existingDua.referenceEn !== dua.referenceEn ||
        existingDua.referenceBn !== dua.referenceBn ||
        existingDua.benefitsEn !== dua.benefitsEn ||
        existingDua.benefitsBn !== dua.benefitsBn ||
        existingDua.notesEn !== dua.notesEn ||
        existingDua.notesBn !== dua.notesBn ||
        existingDua.repeatCount !== dua.repeatCount ||
        existingDua.displayOrder !== dua.displayOrder ||
        existingDua.status !== dua.status ||
        existingDua.isVisibleInApp !== dua.isVisibleInApp ||
        existingDua.searchKeywordsBn !== dua.searchKeywordsBn ||
        existingDua.searchKeywordsEn !== dua.searchKeywordsEn ||
        !arrayEquals(existingDua.tagsEn, dua.tagsEn) ||
        !arrayEquals(existingDua.tagsBn, dua.tagsBn);

      if (changed) {
        console.log(`Dua "${dua.slug}" has changes. Incrementing version.`);
        await prisma.duaItem.update({
          where: { id: existingDua.id },
          data: {
            categoryId,
            titleEn: dua.titleEn,
            titleBn: dua.titleBn,
            arabicText: dua.arabicText,
            banglaMeaning: dua.banglaMeaning,
            englishMeaning: dua.englishMeaning,
            transliterationEn: dua.transliterationEn,
            transliterationBn: dua.transliterationBn,
            referenceEn: dua.referenceEn,
            referenceBn: dua.referenceBn,
            benefitsEn: dua.benefitsEn,
            benefitsBn: dua.benefitsBn,
            notesEn: dua.notesEn,
            notesBn: dua.notesBn,
            repeatCount: dua.repeatCount,
            tagsEn: dua.tagsEn,
            tagsBn: dua.tagsBn,
            searchKeywordsBn: dua.searchKeywordsBn,
            searchKeywordsEn: dua.searchKeywordsEn,
            displayOrder: dua.displayOrder,
            status: dua.status,
            isVisibleInApp: dua.isVisibleInApp,
            version: existingDua.version + 1,
            publishedAt: existingDua.publishedAt || new Date()
          }
        });
      } else {
        console.log(`Dua "${dua.slug}" is unchanged.`);
      }
    } else {
      console.log(`Creating new Dua "${dua.slug}"...`);
      await prisma.duaItem.create({
        data: {
          bookId,
          indexId,
          categoryId,
          slug: dua.slug,
          titleEn: dua.titleEn,
          titleBn: dua.titleBn,
          arabicText: dua.arabicText,
          banglaMeaning: dua.banglaMeaning,
          englishMeaning: dua.englishMeaning,
          transliterationEn: dua.transliterationEn,
          transliterationBn: dua.transliterationBn,
          referenceEn: dua.referenceEn,
          referenceBn: dua.referenceBn,
          benefitsEn: dua.benefitsEn,
          benefitsBn: dua.benefitsBn,
          notesEn: dua.notesEn,
          notesBn: dua.notesBn,
          repeatCount: dua.repeatCount,
          tagsEn: dua.tagsEn,
          tagsBn: dua.tagsBn,
          searchKeywordsBn: dua.searchKeywordsBn,
          searchKeywordsEn: dua.searchKeywordsEn,
          displayOrder: dua.displayOrder,
          status: dua.status,
          isVisibleInApp: dua.isVisibleInApp,
          version: 1,
          publishedAt: new Date()
        }
      });
    }
  }

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding Quranic book:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
