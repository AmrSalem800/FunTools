import { createClient } from "@metagptx/web-sdk";

const client = createClient();

const AI_MODEL = "deepseek-v3.2";
async function callAI(prompt: string): Promise<string> {
  try {
    const response = await client.ai.gentxt({
      messages: [
        { role: "user", content: prompt },
      ],
      model: AI_MODEL,
      stream: false,
    });
    const text = response.data.content;
    if (!text) {
      throw new Error("Empty AI response");
    }
    return text;
  } catch (err: any) {
    console.error("AI service error:", err);
    const detail = err?.data?.detail || err?.response?.data?.detail || err?.message || "AI request failed";
    throw new Error(detail);
  }
}

/**
 * Fetch a relevant image from Wikipedia for a historical event.
 * Uses English search terms to query English Wikipedia for best results.
 */
export async function fetchEventImage(searchTerm: string, eventYear: string): Promise<string> {
  // Build search queries - try multiple strategies
  const searchQueries = [
    searchTerm,
    `${searchTerm} ${eventYear}`,
    searchTerm.split(/[,،\-()]/)[0].trim(), // First part before punctuation
  ];

  console.log(`[fetchEventImage] Searching for: "${searchTerm}" (year: ${eventYear})`);

  for (const query of searchQueries) {
    try {
      console.log(`[fetchEventImage] Trying query: "${query}"`);
      const url = await searchWikipediaImage(query);
      if (url) {
        console.log(`[fetchEventImage] Found image: ${url.substring(0, 100)}...`);
        return url;
      }
    } catch {
      // Try next query
    }
  }

  console.log(`[fetchEventImage] No image found for: "${searchTerm}"`);
  return "";
}

async function searchWikipediaImage(query: string): Promise<string> {
  try {
    // Step 1: Search English Wikipedia for the event
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return "";
    const searchData = await searchRes.json();
    const results = searchData?.query?.search;
    if (!results || results.length === 0) return "";

    // Step 2: Get page images for the top results
    const pageIds = results.map((r: { pageid: number }) => r.pageid).join("|");
    const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageIds}&prop=pageimages&format=json&pithumbsize=800&origin=*`;
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) return "";
    const imageData = await imageRes.json();
    const pages = imageData?.query?.pages;
    if (!pages) return "";

    // Find the first page with a thumbnail (prefer pages with images)
    for (const pageId of Object.keys(pages)) {
      const page = pages[pageId];
      if (page?.thumbnail?.source) {
        return page.thumbnail.source;
      }
    }

    return "";
  } catch (err) {
    console.error("Wikipedia image search error:", err);
    return "";
  }
}

export async function getHistoricalEvents(
  day: number,
  month: number,
  year: number | null,
  lang: "ar" | "en"
): Promise<string> {
  const langInstruction =
    lang === "ar"
      ? "أجب باللغة العربية فقط."
      : "Answer in English only.";

  const hasYear = year !== null && year > 0;

  const prompt =
    lang === "ar"
      ? `${langInstruction}
أنت مؤرخ خبير. ${
          hasYear
            ? `أخبرني بأهم 4-5 أحداث تاريخية وقعت في يوم ${day} من شهر ${month} من سنة ${year} أو قريباً من هذا التاريخ.`
            : `أخبرني بأهم 4-5 أحداث تاريخية وقعت في يوم ${day} من شهر ${month} (أي شهر ${month} في التقويم الميلادي). يمكن أن تكون الأحداث من أي سنة في التاريخ.`
        }

لكل حدث، أضف مصطلح بحث بالإنجليزية للبحث عنه في ويكيبيديا.

أجب بصيغة JSON فقط بدون أي نص إضافي، بالشكل التالي:
{
  "events": [
    {
      "year": "السنة",
      "title": "عنوان الحدث بالعربية",
      "description": "وصف مختصر للحدث في 2-3 جمل بالعربية",
      "searchTerm": "English Wikipedia search term for this event (e.g. 'Assassination of John F. Kennedy')"
    }
  ]
}`
      : `${langInstruction}
You are an expert historian. ${
          hasYear
            ? `Tell me the most important 4-5 historical events that happened on ${month}/${day}/${year} or around that date.`
            : `Tell me the most important 4-5 historical events that happened on ${month}/${day} (any year in history).`
        }

For each event, add a Wikipedia search term in English.

Answer in JSON format only without any extra text:
{
  "events": [
    {
      "year": "the year",
      "title": "Event title",
      "description": "Brief description in 2-3 sentences",
      "searchTerm": "English Wikipedia search term for this event (e.g. 'Assassination of John F. Kennedy')"
    }
  ]
}`;

  return await callAI(prompt);
}

export async function getInterviewQuestion(
  field: string,
  level: string,
  questionNumber: number,
  previousQA: Array<{ question: string; answer: string }>,
  lang: "ar" | "en"
): Promise<string> {
  const langInstruction =
    lang === "ar"
      ? "أجب باللغة العربية فقط."
      : "Answer in English only.";

  const prevContext =
    previousQA.length > 0
      ? previousQA
          .map(
            (qa, i) =>
              `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`
          )
          .join("\n\n")
      : "No previous questions.";

  const prompt =
    lang === "ar"
      ? `${langInstruction}
أنت مدير توظيف خبير في مجال "${field}" تجري مقابلة وظيفية لمرشح بمستوى "${level}".
هذا هو السؤال رقم ${questionNumber} من 5.

الأسئلة والإجابات السابقة:
${prevContext}

اطرح سؤال مقابلة واقعي ومناسب للمستوى. السؤال يجب أن يكون مختلفاً عن الأسئلة السابقة.

أجب بصيغة JSON فقط:
{
  "question": "نص السؤال"
}`
      : `${langInstruction}
You are an expert hiring manager in "${field}" conducting a job interview for a "${level}" candidate.
This is question ${questionNumber} of 5.

Previous Q&A:
${prevContext}

Ask a realistic interview question appropriate for the level. The question must be different from previous ones.

Answer in JSON format only:
{
  "question": "question text"
}`;

  return await callAI(prompt);
}

export async function evaluateAnswer(
  field: string,
  level: string,
  question: string,
  answer: string,
  lang: "ar" | "en"
): Promise<string> {
  const langInstruction =
    lang === "ar"
      ? "أجب باللغة العربية فقط."
      : "Answer in English only.";

  const prompt =
    lang === "ar"
      ? `${langInstruction}
أنت مدير توظيف خبير في مجال "${field}". قيّم إجابة المرشح (مستوى: ${level}).

السؤال: ${question}
الإجابة: ${answer}

قيّم الإجابة وأعطِ:
1. تقييم (excellent أو good أو needsImprovement)
2. نقاط القوة في الإجابة
3. نقاط الضعف
4. نصيحة للتحسين
5. درجة من 100
6. الإجابة النموذجية التفصيلية

أجب بصيغة JSON فقط:
{
  "rating": "excellent أو good أو needsImprovement",
  "score": 85,
  "feedback": "تعليق مختصر على الإجابة",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "weaknesses": ["نقطة ضعف 1"],
  "tip": "نصيحة للتحسين",
  "modelAnswer": "الإجابة النموذجية التفصيلية الكاملة هنا..."
}`
      : `${langInstruction}
You are an expert hiring manager in "${field}". Evaluate the candidate's answer (level: ${level}).

Question: ${question}
Answer: ${answer}

Evaluate and provide:
1. Rating (excellent, good, or needsImprovement)
2. Strengths
3. Weaknesses
4. Improvement tip
5. Score out of 100
6. Model Answer

Answer in JSON format only:
{
  "rating": "excellent or good or needsImprovement",
  "score": 85,
  "feedback": "Brief comment on the answer",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1"],
  "tip": "Improvement tip",
  "modelAnswer": "The full detailed model answer here..."
}`;

  return await callAI(prompt);
}

export async function getFinalReport(
  field: string,
  level: string,
  questionsAndEvals: Array<{
    question: string;
    answer: string;
    score: number;
    rating: string;
  }>,
  lang: "ar" | "en"
): Promise<string> {
  const langInstruction =
    lang === "ar"
      ? "أجب باللغة العربية فقط."
      : "Answer in English only.";

  const summary = questionsAndEvals
    .map(
      (qe, i) =>
        `Q${i + 1}: ${qe.question}\nAnswer: ${qe.answer}\nScore: ${qe.score}/100\nRating: ${qe.rating}`
    )
    .join("\n\n");

  const prompt =
    lang === "ar"
      ? `${langInstruction}
أنت مدير توظيف خبير. اكتب تقريراً نهائياً شاملاً عن أداء المرشح في مقابلة "${field}" (مستوى: ${level}).

ملخص الأسئلة والتقييمات:
${summary}

أجب بصيغة JSON فقط:
{
  "overallScore": 78,
  "overallRating": "good",
  "summary": "ملخص عام للأداء",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2", "نقطة قوة 3"],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2"],
  "tips": ["نصيحة 1", "نصيحة 2", "نصيحة 3"]
}`
      : `${langInstruction}
You are an expert hiring manager. Write a comprehensive final report on the candidate's performance in a "${field}" interview (level: ${level}).

Q&A Summary:
${summary}

Answer in JSON format only:
{
  "overallScore": 78,
  "overallRating": "good",
  "summary": "Overall performance summary",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "tips": ["tip 1", "tip 2", "tip 3"]
}`;

  return await callAI(prompt);
}

// ===== NEW FEATURES =====

export async function generateExcuse(
  situation: string,
  style: string,
  lang: "ar" | "en"
): Promise<string> {
  const langInstruction = lang === "ar" ? "أجب باللغة العربية فقط." : "Answer in English only.";
  const styleMap: Record<string, string> = {
    convincing: lang === "ar" ? "مقنع وجدي" : "convincing and serious",
    funny: lang === "ar" ? "مضحك وطريف" : "funny and witty",
    creative: lang === "ar" ? "إبداعي وغير متوقع" : "creative and unexpected",
  };

  const prompt = lang === "ar"
    ? `${langInstruction}
أنت خبير في صياغة الأعذار. الموقف: "${situation}". النوع المطلوب: ${styleMap[style]}.

ولّد 3 أعذار مختلفة مع مقياس إقناع لكل واحد.

أجب بصيغة JSON فقط:
{
  "excuses": [
    {
      "excuse": "نص العذر",
      "convincingLevel": 85,
      "deliveryTip": "نصيحة لكيفية إلقاء العذر",
      "warning": "تحذير أو ملاحظة مضحكة"
    }
  ]
}`
    : `${langInstruction}
You are an excuse crafting expert. Situation: "${situation}". Style: ${styleMap[style]}.

Generate 3 different excuses with a convincing meter for each.

Answer in JSON format only:
{
  "excuses": [
    {
      "excuse": "The excuse text",
      "convincingLevel": 85,
      "deliveryTip": "Tip on how to deliver the excuse",
      "warning": "A funny warning or note"
    }
  ]
}`;

  return await callAI(prompt);
}

export async function analyzePersonality(
  text: string,
  lang: "ar" | "en"
): Promise<string> {
  const langInstruction = lang === "ar" ? "أجب باللغة العربية فقط." : "Answer in English only.";

  const prompt = lang === "ar"
    ? `${langInstruction}
أنت عالم نفس خبير في تحليل الشخصية من أسلوب الكتابة. حلل النص التالي:

"${text}"

قدم تحليلاً شاملاً للشخصية.

أجب بصيغة JSON فقط:
{
  "personalityType": "نوع الشخصية (مثل: القائد المبدع)",
  "emoji": "🎭",
  "traits": ["سمة 1", "سمة 2", "سمة 3", "سمة 4"],
  "communicationStyle": "وصف أسلوب التواصل",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2"],
  "careerSuggestions": ["مهنة 1", "مهنة 2", "مهنة 3"],
  "funFact": "حقيقة ممتعة عن هذا النوع من الشخصيات",
  "scores": {
    "creativity": 80,
    "logic": 70,
    "empathy": 85,
    "leadership": 75,
    "detail": 60
  }
}`
    : `${langInstruction}
You are an expert psychologist analyzing personality from writing style. Analyze this text:

"${text}"

Provide a comprehensive personality analysis.

Answer in JSON format only:
{
  "personalityType": "Personality type (e.g., The Creative Leader)",
  "emoji": "🎭",
  "traits": ["trait 1", "trait 2", "trait 3", "trait 4"],
  "communicationStyle": "Communication style description",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "careerSuggestions": ["career 1", "career 2", "career 3"],
  "funFact": "A fun fact about this personality type",
  "scores": {
    "creativity": 80,
    "logic": 70,
    "empathy": 85,
    "leadership": 75,
    "detail": 60
  }
}`;

  return await callAI(prompt);
}

export async function convertTextStyle(
  text: string,
  era: string,
  lang: "ar" | "en"
): Promise<string> {
  const langInstruction = lang === "ar" ? "أجب باللغة العربية فقط." : "Answer in English only.";

  const prompt = lang === "ar"
    ? `${langInstruction}
أنت كاتب خبير في الأساليب الأدبية عبر العصور. حوّل النص التالي لأسلوب "${era}":

"${text}"

أجب بصيغة JSON فقط:
{
  "convertedText": "النص المحوّل بأسلوب الحقبة",
  "eraInfo": "معلومة قصيرة عن أسلوب الكتابة في هذه الحقبة",
  "funNote": "ملاحظة طريفة عن التحويل"
}`
    : `${langInstruction}
You are an expert writer in literary styles across eras. Convert this text to "${era}" style:

"${text}"

Answer in JSON format only:
{
  "convertedText": "The text converted to the era's style",
  "eraInfo": "A short note about the writing style of this era",
  "funNote": "A fun note about the conversion"
}`;

  return await callAI(prompt);
}

export async function translateEmotion(
  message: string,
  tone: string,
  lang: "ar" | "en"
): Promise<string> {
  const langInstruction = lang === "ar" ? "أجب باللغة العربية فقط." : "Answer in English only.";

  const prompt = lang === "ar"
    ? `${langInstruction}
أنت خبير في التواصل والمشاعر. أعد صياغة الرسالة التالية بنبرة "${tone}":

"${message}"

أجب بصيغة JSON فقط:
{
  "translatedMessage": "الرسالة بالنبرة الجديدة",
  "emotionAnalysis": "تحليل مختصر للمشاعر في النص الأصلي",
  "tip": "نصيحة لاستخدام هذه النبرة"
}`
    : `${langInstruction}
You are a communication and emotions expert. Rephrase this message in a "${tone}" tone:

"${message}"

Answer in JSON format only:
{
  "translatedMessage": "The message in the new tone",
  "emotionAnalysis": "Brief analysis of emotions in the original text",
  "tip": "Tip for using this tone"
}`;

  return await callAI(prompt);
}

export async function simulateWhatIf(
  scenario: string,
  lang: "ar" | "en"
): Promise<string> {
  const langInstruction = lang === "ar" ? "أجب باللغة العربية فقط." : "Answer in English only.";

  const prompt = lang === "ar"
    ? `${langInstruction}
أنت مؤرخ ومفكر خبير في السيناريوهات البديلة. استكشف هذا السيناريو:

"${scenario}"

اكتب قصة تفصيلية عن ماذا كان سيحدث.

أجب بصيغة JSON فقط:
{
  "title": "عنوان السيناريو البديل",
  "timeline": [
    {"year": "السنة", "event": "ما حدث في هذا التاريخ البديل"}
  ],
  "conclusion": "الخلاصة والتأثير على العالم اليوم",
  "funFact": "حقيقة ممتعة أو مفارقة"
}`
    : `${langInstruction}
You are an expert historian and thinker in alternate scenarios. Explore this scenario:

"${scenario}"

Write a detailed story about what would have happened.

Answer in JSON format only:
{
  "title": "Alternate scenario title",
  "timeline": [
    {"year": "Year", "event": "What happened in this alternate timeline"}
  ],
  "conclusion": "Conclusion and impact on today's world",
  "funFact": "A fun fact or irony"
}`;

  return await callAI(prompt);
}

export async function generateFridgeRecipe(
  ingredients: string,
  lang: "ar" | "en"
): Promise<string> {
  const langInstruction = lang === "ar" ? "أجب باللغة العربية فقط." : "Answer in English only.";

  const prompt = lang === "ar"
    ? `${langInstruction}
أنت شيف محترف ومبدع. المكونات المتاحة: ${ingredients}

اقترح وصفة لذيذة يمكن تحضيرها من هذه المكونات.

أجب بصيغة JSON فقط:
{
  "recipeName": "اسم الوصفة",
  "emoji": "🍽️",
  "description": "وصف مختصر وشهي للوصفة",
  "ingredients": ["مكون 1 - الكمية", "مكون 2 - الكمية"],
  "steps": ["الخطوة 1", "الخطوة 2", "الخطوة 3"],
  "cookingTime": "30 دقيقة",
  "difficulty": "سهل",
  "tip": "نصيحة من الشيف"
}`
    : `${langInstruction}
You are a professional and creative chef. Available ingredients: ${ingredients}

Suggest a delicious recipe that can be made from these ingredients.

Answer in JSON format only:
{
  "recipeName": "Recipe name",
  "emoji": "🍽️",
  "description": "A short appetizing description",
  "ingredients": ["ingredient 1 - amount", "ingredient 2 - amount"],
  "steps": ["Step 1", "Step 2", "Step 3"],
  "cookingTime": "30 minutes",
  "difficulty": "Easy",
  "tip": "Chef's tip"
}`;

  return await callAI(prompt);
}

export function parseJSON(text: string): any {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1].trim());
    } catch {
      // continue
    }
  }

  try {
    return JSON.parse(text.trim());
  } catch {
    // continue
  }

  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]);
    } catch {
      // continue
    }
  }

  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch {
      // fall through
    }
  }

  throw new Error("Could not parse JSON from response");
}