export type Language = "ar" | "en";

export const translations = {
  ar: {
    // Navigation & General
    appName: "عبقرينو",
    appTagline: "أدوات ذكية بالذكاء الاصطناعي",
    home: "الرئيسية",
    lightMode: "وضع فاتح",
    darkMode: "وضع داكن",
    language: "English",
    loading: "جاري التحميل...",
    back: "رجوع",
    
    // Home Page
    heroTitle: "مرحباً بك في عبقرينو",
    heroSubtitle: "اكتشف أدوات ذكية مدعومة بالذكاء الاصطناعي لتجربة فريدة من نوعها",
    
    // Time Machine
    timeMachineTitle: "آلة الزمن الإخبارية",
    timeMachineDesc: "سافر عبر الزمن واكتشف أهم الأحداث التي وقعت في أي يوم من التاريخ",
    timeMachineButton: "ابدأ الرحلة",
    selectDate: "اختر التاريخ",
    day: "اليوم",
    month: "الشهر",
    year: "السنة",
    travelInTime: "سافر عبر الزمن!",
    traveling: "جاري السفر عبر الزمن...",
    newspaperTitle: "جريدة الزمن",
    edition: "طبعة خاصة",
    price: "السعر: قرش واحد",
    breakingNews: "أخبار عاجلة",
    newTravel: "رحلة جديدة",
    generatingImages: "جاري توليد الصور...",
    
    // Interview
    interviewTitle: "محاكي المقابلات الوظيفية",
    interviewDesc: "تدرب على المقابلات الوظيفية مع مدرب ذكاء اصطناعي يقيّم أداءك",
    interviewButton: "ابدأ التدريب",
    selectField: "اختر المجال الوظيفي",
    selectLevel: "اختر مستوى الخبرة",
    startInterview: "ابدأ المقابلة",
    starting: "جاري تحضير الأسئلة...",
    yourAnswer: "اكتب إجابتك هنا...",
    submitAnswer: "إرسال الإجابة",
    evaluating: "جاري التقييم...",
    nextQuestion: "السؤال التالي",
    finishInterview: "إنهاء المقابلة",
    question: "السؤال",
    of: "من",
    
    // Excuses Generator
    excusesTitle: "مولّد الأعذار الذكي",
    excusesDesc: "احصل على أعذار مقنعة أو مضحكة لأي موقف مع مقياس الإقناع",
    excusesButton: "جرّب الآن",
    excuseSituation: "صف الموقف الذي تحتاج عذراً له...",
    excuseStyle: "نوع العذر",
    excuseStyleConvincing: "مقنع وجدي",
    excuseStyleFunny: "مضحك وطريف",
    excuseStyleCreative: "إبداعي وغير متوقع",
    generateExcuse: "ولّد العذر!",
    generating: "جاري التوليد...",
    convincingLevel: "مستوى الإقناع",
    excuseResult: "العذر",
    howToDeliver: "نصيحة للإلقاء",
    warningNote: "تحذير",
    
    // Personality Analyzer
    personalityTitle: "محلل الشخصية من الكتابة",
    personalityDesc: "اكتشف شخصيتك من خلال طريقة كتابتك مع تقرير تفصيلي",
    personalityButton: "حلل شخصيتك",
    writeText: "اكتب نصاً حراً (200 حرف على الأقل) لتحليل شخصيتك...",
    analyzePersonality: "حلل شخصيتي!",
    analyzing: "جاري التحليل...",
    personalityType: "نوع الشخصية",
    traits: "السمات الرئيسية",
    communicationStyle: "أسلوب التواصل",
    careerSuggestions: "اقتراحات مهنية",
    funFact: "حقيقة ممتعة",
    
    // Creative Tools
    creativeToolsTitle: "أدوات إبداعية",
    creativeToolsDesc: "مجموعة أدوات ذكية للإبداع والمرح",
    creativeToolsButton: "استكشف الأدوات",
    
    // Style Time Travel
    styleTimeTitle: "آلة السفر عبر الأنماط",
    styleTimeDesc: "حوّل نصك لأسلوب كتابة من حقبة زمنية مختلفة",
    enterText: "اكتب النص المراد تحويله...",
    selectEra: "اختر الحقبة الزمنية",
    eraAncient: "العصر الجاهلي",
    eraIslamic: "العصر الإسلامي الذهبي",
    eraOttoman: "العصر العثماني",
    eraModern: "العصر الحديث (الخمسينات)",
    eraFuture: "المستقبل (2100)",
    convertStyle: "حوّل النص!",
    converting: "جاري التحويل...",
    
    // Emotion Translator
    emotionTitle: "مترجم المشاعر",
    emotionDesc: "أعد صياغة رسالتك بنبرات مختلفة",
    enterMessage: "اكتب رسالتك هنا...",
    selectTone: "اختر النبرة",
    tonePolite: "مهذب ورسمي",
    toneFriendly: "ودود وحميمي",
    toneAngry: "غاضب وحازم",
    toneSarcastic: "ساخر وذكي",
    toneRomantic: "رومانسي وشاعري",
    translateEmotion: "ترجم المشاعر!",
    translating: "جاري الترجمة...",
    
    // What-If Simulator
    whatIfTitle: "محاكي ماذا لو",
    whatIfDesc: "استكشف سيناريوهات تاريخية بديلة",
    enterScenario: "اكتب سيناريو ماذا لو... (مثال: ماذا لو لم تُكتشف أمريكا؟)",
    simulateScenario: "حاكي السيناريو!",
    simulating: "جاري المحاكاة...",
    
    // Fridge Recipes
    fridgeTitle: "مولّد الوصفات من الثلاجة",
    fridgeDesc: "أخبرنا بالمكونات المتاحة وسنقترح وصفات لذيذة",
    enterIngredients: "اكتب المكونات المتاحة لديك (مفصولة بفواصل)...",
    generateRecipe: "اقترح وصفة!",
    generatingRecipe: "جاري تحضير الوصفة...",
    recipeName: "اسم الوصفة",
    ingredients: "المكونات",
    steps: "خطوات التحضير",
    cookingTime: "وقت الطهي",
    difficulty: "مستوى الصعوبة",
    
    // Fields
    fields: {
      programming: "البرمجة والتطوير",
      marketing: "التسويق الرقمي",
      design: "التصميم الجرافيكي",
      management: "إدارة الأعمال",
      medicine: "الطب والرعاية الصحية",
      engineering: "الهندسة",
      finance: "المالية والمحاسبة",
      education: "التعليم والتدريب",
    },
    
    // Levels
    levels: {
      junior: "مبتدئ",
      mid: "متوسط",
      senior: "خبير",
    },
    
    // Ratings
    ratings: {
      excellent: "ممتاز",
      good: "جيد",
      needsImprovement: "يحتاج تحسين",
    },
    
    // Report
    reportTitle: "تقرير الأداء النهائي",
    overallScore: "النتيجة الإجمالية",
    strengths: "نقاط القوة",
    weaknesses: "نقاط الضعف",
    tips: "نصائح للتحسين",
    tryAgain: "حاول مرة أخرى",
    backToHome: "العودة للرئيسية",
    questionReview: "مراجعة الأسئلة",
    yourAnswerLabel: "إجابتك",
    aiEvaluation: "تقييم الذكاء الاصطناعي",
    modelAnswer: "الإجابة النموذجية",
    
    // Errors
    errorOccurred: "حدث خطأ",
    tryAgainLater: "يرجى المحاولة مرة أخرى لاحقاً",
    
    // Months
    months: [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ],
  },
  en: {
    appName: "Abqarino",
    appTagline: "Smart AI-Powered Tools",
    home: "Home",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    language: "العربية",
    loading: "Loading...",
    back: "Back",
    
    heroTitle: "Welcome to Abqarino",
    heroSubtitle: "Discover smart AI-powered tools for a unique experience",
    
    timeMachineTitle: "News Time Machine",
    timeMachineDesc: "Travel through time and discover the most important events on any day in history",
    timeMachineButton: "Start Journey",
    selectDate: "Select Date",
    day: "Day",
    month: "Month",
    year: "Year",
    travelInTime: "Travel in Time!",
    traveling: "Traveling through time...",
    newspaperTitle: "The Time Gazette",
    edition: "Special Edition",
    price: "Price: One Penny",
    breakingNews: "Breaking News",
    newTravel: "New Journey",
    generatingImages: "Generating images...",
    
    interviewTitle: "AI Interview Simulator",
    interviewDesc: "Practice job interviews with an AI coach that evaluates your performance",
    interviewButton: "Start Training",
    selectField: "Select Job Field",
    selectLevel: "Select Experience Level",
    startInterview: "Start Interview",
    starting: "Preparing questions...",
    yourAnswer: "Type your answer here...",
    submitAnswer: "Submit Answer",
    evaluating: "Evaluating...",
    nextQuestion: "Next Question",
    finishInterview: "Finish Interview",
    question: "Question",
    of: "of",
    
    // Excuses
    excusesTitle: "Smart Excuse Generator",
    excusesDesc: "Get convincing or funny excuses for any situation with a persuasion meter",
    excusesButton: "Try Now",
    excuseSituation: "Describe the situation you need an excuse for...",
    excuseStyle: "Excuse Style",
    excuseStyleConvincing: "Convincing & Serious",
    excuseStyleFunny: "Funny & Witty",
    excuseStyleCreative: "Creative & Unexpected",
    generateExcuse: "Generate Excuse!",
    generating: "Generating...",
    convincingLevel: "Convincing Level",
    excuseResult: "The Excuse",
    howToDeliver: "Delivery Tip",
    warningNote: "Warning",
    
    // Personality
    personalityTitle: "Writing Personality Analyzer",
    personalityDesc: "Discover your personality through your writing style with a detailed report",
    personalityButton: "Analyze Yourself",
    writeText: "Write a free text (at least 200 characters) to analyze your personality...",
    analyzePersonality: "Analyze My Personality!",
    analyzing: "Analyzing...",
    personalityType: "Personality Type",
    traits: "Key Traits",
    communicationStyle: "Communication Style",
    careerSuggestions: "Career Suggestions",
    funFact: "Fun Fact",
    
    // Creative Tools
    creativeToolsTitle: "Creative Tools",
    creativeToolsDesc: "A collection of smart tools for creativity and fun",
    creativeToolsButton: "Explore Tools",
    
    // Style Time Travel
    styleTimeTitle: "Style Time Machine",
    styleTimeDesc: "Transform your text into a writing style from a different era",
    enterText: "Enter the text to transform...",
    selectEra: "Select Era",
    eraAncient: "Ancient/Classical Era",
    eraIslamic: "Islamic Golden Age",
    eraOttoman: "Ottoman Era",
    eraModern: "Modern Era (1950s)",
    eraFuture: "The Future (2100)",
    convertStyle: "Transform Text!",
    converting: "Transforming...",
    
    // Emotion Translator
    emotionTitle: "Emotion Translator",
    emotionDesc: "Rephrase your message in different tones",
    enterMessage: "Type your message here...",
    selectTone: "Select Tone",
    tonePolite: "Polite & Formal",
    toneFriendly: "Friendly & Warm",
    toneAngry: "Angry & Firm",
    toneSarcastic: "Sarcastic & Witty",
    toneRomantic: "Romantic & Poetic",
    translateEmotion: "Translate Emotion!",
    translating: "Translating...",
    
    // What-If
    whatIfTitle: "What-If Simulator",
    whatIfDesc: "Explore alternate historical scenarios",
    enterScenario: "Write a what-if scenario... (e.g., What if America was never discovered?)",
    simulateScenario: "Simulate Scenario!",
    simulating: "Simulating...",
    
    // Fridge Recipes
    fridgeTitle: "Fridge Recipe Generator",
    fridgeDesc: "Tell us what ingredients you have and we'll suggest delicious recipes",
    enterIngredients: "Enter available ingredients (comma separated)...",
    generateRecipe: "Suggest Recipe!",
    generatingRecipe: "Preparing recipe...",
    recipeName: "Recipe Name",
    ingredients: "Ingredients",
    steps: "Preparation Steps",
    cookingTime: "Cooking Time",
    difficulty: "Difficulty",
    
    fields: {
      programming: "Programming & Development",
      marketing: "Digital Marketing",
      design: "Graphic Design",
      management: "Business Management",
      medicine: "Medicine & Healthcare",
      engineering: "Engineering",
      finance: "Finance & Accounting",
      education: "Education & Training",
    },
    
    levels: {
      junior: "Junior",
      mid: "Mid-Level",
      senior: "Senior",
    },
    
    ratings: {
      excellent: "Excellent",
      good: "Good",
      needsImprovement: "Needs Improvement",
    },
    
    reportTitle: "Final Performance Report",
    overallScore: "Overall Score",
    strengths: "Strengths",
    weaknesses: "Weaknesses",
    tips: "Tips for Improvement",
    tryAgain: "Try Again",
    backToHome: "Back to Home",
    questionReview: "Question Review",
    yourAnswerLabel: "Your Answer",
    aiEvaluation: "AI Evaluation",
    modelAnswer: "Model Answer",
    
    errorOccurred: "An error occurred",
    tryAgainLater: "Please try again later",
    
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
  },
} as const;

export type TranslationKey = keyof typeof translations.ar;

export function t(lang: Language, key: string): any {
  const keys = key.split(".");
  let value: any = translations[lang];
  for (const k of keys) {
    value = value?.[k];
  }
  return value ?? key;
}