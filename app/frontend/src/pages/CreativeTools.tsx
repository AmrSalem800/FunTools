import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { translations } from "@/lib/i18n";
import {
  convertTextStyle, translateEmotion, simulateWhatIf, generateFridgeRecipe, parseJSON,
} from "@/lib/ai-service";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, ArrowRight, Loader2, Sun, Moon, Globe,
  Sparkles, RotateCcw, Clock, MessageSquare, HelpCircle, ChefHat,
} from "lucide-react";

const HERO_IMG = "https://mgx-backend-cdn.metadl.com/generate/images/552332/2026-04-03/b8660f24-ae22-450e-a3ad-7bbd7f38b387.png";

type ToolTab = "style" | "emotion" | "whatif" | "fridge";

export default function CreativeToolsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, lang, toggleLang } = useApp();
  const t = translations[lang];
  const BackArrow = lang === "ar" ? ArrowRight : ArrowLeft;

  const [activeTab, setActiveTab] = useState<ToolTab>("style");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Style Time Travel
  const [styleText, setStyleText] = useState("");
  const [selectedEra, setSelectedEra] = useState("");
  const [styleResult, setStyleResult] = useState<any>(null);

  // Emotion Translator
  const [emotionMsg, setEmotionMsg] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [emotionResult, setEmotionResult] = useState<any>(null);

  // What-If
  const [whatIfText, setWhatIfText] = useState("");
  const [whatIfResult, setWhatIfResult] = useState<any>(null);

  // Fridge
  const [ingredientsText, setIngredientsText] = useState("");
  const [fridgeResult, setFridgeResult] = useState<any>(null);

  const tabs = [
    { key: "style" as ToolTab, icon: <Clock className="w-4 h-4" />, label: t.styleTimeTitle, emoji: "⏳" },
    { key: "emotion" as ToolTab, icon: <MessageSquare className="w-4 h-4" />, label: t.emotionTitle, emoji: "💬" },
    { key: "whatif" as ToolTab, icon: <HelpCircle className="w-4 h-4" />, label: t.whatIfTitle, emoji: "🔮" },
    { key: "fridge" as ToolTab, icon: <ChefHat className="w-4 h-4" />, label: t.fridgeTitle, emoji: "🍳" },
  ];

  const eras = [
    { key: "ancient", label: t.eraAncient },
    { key: "islamic", label: t.eraIslamic },
    { key: "ottoman", label: t.eraOttoman },
    { key: "modern", label: t.eraModern },
    { key: "future", label: t.eraFuture },
  ];

  const tones = [
    { key: "polite", label: t.tonePolite, emoji: "🎩" },
    { key: "friendly", label: t.toneFriendly, emoji: "🤗" },
    { key: "angry", label: t.toneAngry, emoji: "😤" },
    { key: "sarcastic", label: t.toneSarcastic, emoji: "😏" },
    { key: "romantic", label: t.toneRomantic, emoji: "💕" },
  ];

  const handleStyleConvert = async () => {
    if (!styleText.trim() || !selectedEra) return;
    setLoading(true); setError(""); setStyleResult(null);
    try {
      const eraLabel = eras.find(e => e.key === selectedEra)?.label || selectedEra;
      const res = await convertTextStyle(styleText, eraLabel, lang);
      setStyleResult(parseJSON(res));
    } catch { setError(t.errorOccurred); }
    finally { setLoading(false); }
  };

  const handleEmotionTranslate = async () => {
    if (!emotionMsg.trim() || !selectedTone) return;
    setLoading(true); setError(""); setEmotionResult(null);
    try {
      const toneLabel = tones.find(tn => tn.key === selectedTone)?.label || selectedTone;
      const res = await translateEmotion(emotionMsg, toneLabel, lang);
      setEmotionResult(parseJSON(res));
    } catch { setError(t.errorOccurred); }
    finally { setLoading(false); }
  };

  const handleWhatIf = async () => {
    if (!whatIfText.trim()) return;
    setLoading(true); setError(""); setWhatIfResult(null);
    try {
      const res = await simulateWhatIf(whatIfText, lang);
      setWhatIfResult(parseJSON(res));
    } catch { setError(t.errorOccurred); }
    finally { setLoading(false); }
  };

  const handleFridge = async () => {
    if (!ingredientsText.trim()) return;
    setLoading(true); setError(""); setFridgeResult(null);
    try {
      const res = await generateFridgeRecipe(ingredientsText, lang);
      setFridgeResult(parseJSON(res));
    } catch { setError(t.errorOccurred); }
    finally { setLoading(false); }
  };

  const resetCurrent = () => {
    setError("");
    if (activeTab === "style") { setStyleResult(null); setStyleText(""); }
    if (activeTab === "emotion") { setEmotionResult(null); setEmotionMsg(""); }
    if (activeTab === "whatif") { setWhatIfResult(null); setWhatIfText(""); }
    if (activeTab === "fridge") { setFridgeResult(null); setIngredientsText(""); }
  };

  const gradientColors: Record<ToolTab, string> = {
    style: "from-amber-500 via-orange-500 to-red-500",
    emotion: "from-rose-500 via-pink-500 to-purple-500",
    whatif: "from-indigo-500 via-purple-500 to-pink-500",
    fridge: "from-emerald-500 via-teal-500 to-cyan-500",
  };

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 bg-cover bg-center opacity-15 dark:opacity-30"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-teal-50/90 via-white/80 to-cyan-50/90 dark:from-[#0F0F23]/95 dark:via-[#0F0F23]/90 dark:to-[#1A1A3E]/95" />

      <div className="relative z-10">
        <nav className="flex items-center justify-between p-4 md:p-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
            <BackArrow className="w-4 h-4" />
            <span>{t.back}</span>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-full">
              <Globe className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-6 animate-fade-in-up">
            <h1 className={`text-3xl md:text-5xl font-bold bg-gradient-to-r ${gradientColors[activeTab]} bg-clip-text text-transparent mb-2`}>
              {t.creativeToolsTitle}
            </h1>
            <p className="text-muted-foreground">{t.creativeToolsDesc}</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setError(""); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r " + gradientColors[tab.key] + " text-white shadow-lg scale-105"
                    : "bg-white/60 dark:bg-[#1A1A3E]/60 hover:bg-white/80 dark:hover:bg-[#1A1A3E]/80"
                }`}
              >
                <span>{tab.emoji}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* STYLE TIME TRAVEL */}
          {activeTab === "style" && (
            <div className="max-w-2xl mx-auto animate-fade-in-up">
              {!styleResult ? (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-red-500 rounded-2xl blur-lg opacity-20" />
                  <div className="relative bg-white/90 dark:bg-[#1A1A3E]/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10">
                    <h2 className="text-xl font-bold mb-4">{t.styleTimeTitle}</h2>
                    <p className="text-sm text-muted-foreground mb-4">{t.styleTimeDesc}</p>
                    <textarea
                      value={styleText}
                      onChange={(e) => setStyleText(e.target.value)}
                      placeholder={t.enterText}
                      rows={3}
                      className="w-full p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 border-0 resize-none focus:ring-2 focus:ring-amber-500 text-base mb-4"
                      dir={lang === "ar" ? "rtl" : "ltr"}
                    />
                    <p className="text-sm font-semibold mb-3">{t.selectEra}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {eras.map((era) => (
                        <button
                          key={era.key}
                          onClick={() => setSelectedEra(era.key)}
                          className={`px-4 py-2 rounded-xl text-sm transition-all border-2 ${
                            selectedEra === era.key
                              ? "border-amber-500 bg-amber-500/10 font-bold"
                              : "border-transparent bg-gray-100 dark:bg-gray-800/50 hover:border-amber-300"
                          }`}
                        >
                          {era.label}
                        </button>
                      ))}
                    </div>
                    <Button
                      onClick={handleStyleConvert}
                      disabled={!styleText.trim() || !selectedEra || loading}
                      className="w-full py-4 font-bold rounded-xl bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4 me-2" />{t.convertStyle}</>}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white/90 dark:bg-[#1A1A3E]/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10">
                    <p className="text-base leading-relaxed whitespace-pre-line bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                      {styleResult.convertedText}
                    </p>
                    {styleResult.eraInfo && (
                      <p className="mt-4 text-sm text-muted-foreground">📜 {styleResult.eraInfo}</p>
                    )}
                    {styleResult.funNote && (
                      <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">😄 {styleResult.funNote}</p>
                    )}
                  </div>
                  <div className="text-center">
                    <Button onClick={resetCurrent} className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold">
                      <RotateCcw className="w-4 h-4 me-2" />{t.tryAgain}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EMOTION TRANSLATOR */}
          {activeTab === "emotion" && (
            <div className="max-w-2xl mx-auto animate-fade-in-up">
              {!emotionResult ? (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-purple-500 rounded-2xl blur-lg opacity-20" />
                  <div className="relative bg-white/90 dark:bg-[#1A1A3E]/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10">
                    <h2 className="text-xl font-bold mb-4">{t.emotionTitle}</h2>
                    <p className="text-sm text-muted-foreground mb-4">{t.emotionDesc}</p>
                    <textarea
                      value={emotionMsg}
                      onChange={(e) => setEmotionMsg(e.target.value)}
                      placeholder={t.enterMessage}
                      rows={3}
                      className="w-full p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 border-0 resize-none focus:ring-2 focus:ring-rose-500 text-base mb-4"
                      dir={lang === "ar" ? "rtl" : "ltr"}
                    />
                    <p className="text-sm font-semibold mb-3">{t.selectTone}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
                      {tones.map((tn) => (
                        <button
                          key={tn.key}
                          onClick={() => setSelectedTone(tn.key)}
                          className={`p-3 rounded-xl text-center transition-all border-2 ${
                            selectedTone === tn.key
                              ? "border-rose-500 bg-rose-500/10 scale-105"
                              : "border-transparent bg-gray-100 dark:bg-gray-800/50 hover:border-rose-300"
                          }`}
                        >
                          <div className="text-xl mb-1">{tn.emoji}</div>
                          <p className="text-xs font-medium">{tn.label}</p>
                        </button>
                      ))}
                    </div>
                    <Button
                      onClick={handleEmotionTranslate}
                      disabled={!emotionMsg.trim() || !selectedTone || loading}
                      className="w-full py-4 font-bold rounded-xl bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><MessageSquare className="w-4 h-4 me-2" />{t.translateEmotion}</>}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white/90 dark:bg-[#1A1A3E]/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10">
                    <p className="text-base leading-relaxed whitespace-pre-line bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-200 dark:border-rose-800 mb-4">
                      {emotionResult.translatedMessage}
                    </p>
                    {emotionResult.emotionAnalysis && (
                      <p className="text-sm text-muted-foreground mb-2">🔍 {emotionResult.emotionAnalysis}</p>
                    )}
                    {emotionResult.tip && (
                      <p className="text-sm text-rose-600 dark:text-rose-400">💡 {emotionResult.tip}</p>
                    )}
                  </div>
                  <div className="text-center">
                    <Button onClick={resetCurrent} className="px-8 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-500 text-white font-bold">
                      <RotateCcw className="w-4 h-4 me-2" />{t.tryAgain}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* WHAT-IF SIMULATOR */}
          {activeTab === "whatif" && (
            <div className="max-w-2xl mx-auto animate-fade-in-up">
              {!whatIfResult ? (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-2xl blur-lg opacity-20" />
                  <div className="relative bg-white/90 dark:bg-[#1A1A3E]/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10">
                    <h2 className="text-xl font-bold mb-4">{t.whatIfTitle}</h2>
                    <p className="text-sm text-muted-foreground mb-4">{t.whatIfDesc}</p>
                    <textarea
                      value={whatIfText}
                      onChange={(e) => setWhatIfText(e.target.value)}
                      placeholder={t.enterScenario}
                      rows={3}
                      className="w-full p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 border-0 resize-none focus:ring-2 focus:ring-indigo-500 text-base mb-4"
                      dir={lang === "ar" ? "rtl" : "ltr"}
                    />
                    <Button
                      onClick={handleWhatIf}
                      disabled={!whatIfText.trim() || loading}
                      className="w-full py-4 font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><HelpCircle className="w-4 h-4 me-2" />{t.simulateScenario}</>}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white/90 dark:bg-[#1A1A3E]/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10">
                    <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
                      🔮 {whatIfResult.title}
                    </h2>
                    {whatIfResult.timeline?.map((item: any, i: number) => (
                      <div key={i} className="flex gap-4 mb-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                            {item.year}
                          </div>
                          {i < (whatIfResult.timeline?.length || 0) - 1 && (
                            <div className="w-0.5 flex-1 bg-indigo-500/20 mt-1" />
                          )}
                        </div>
                        <p className="text-sm leading-relaxed pt-2">{item.event}</p>
                      </div>
                    ))}
                    {whatIfResult.conclusion && (
                      <div className="mt-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                        <p className="text-sm font-medium">📌 {whatIfResult.conclusion}</p>
                      </div>
                    )}
                    {whatIfResult.funFact && (
                      <p className="mt-3 text-sm text-indigo-600 dark:text-indigo-400">😄 {whatIfResult.funFact}</p>
                    )}
                  </div>
                  <div className="text-center">
                    <Button onClick={resetCurrent} className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold">
                      <RotateCcw className="w-4 h-4 me-2" />{t.tryAgain}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FRIDGE RECIPES */}
          {activeTab === "fridge" && (
            <div className="max-w-2xl mx-auto animate-fade-in-up">
              {!fridgeResult ? (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-lg opacity-20" />
                  <div className="relative bg-white/90 dark:bg-[#1A1A3E]/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10">
                    <h2 className="text-xl font-bold mb-4">{t.fridgeTitle}</h2>
                    <p className="text-sm text-muted-foreground mb-4">{t.fridgeDesc}</p>
                    <textarea
                      value={ingredientsText}
                      onChange={(e) => setIngredientsText(e.target.value)}
                      placeholder={t.enterIngredients}
                      rows={3}
                      className="w-full p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 border-0 resize-none focus:ring-2 focus:ring-emerald-500 text-base mb-4"
                      dir={lang === "ar" ? "rtl" : "ltr"}
                    />
                    <Button
                      onClick={handleFridge}
                      disabled={!ingredientsText.trim() || loading}
                      className="w-full py-4 font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ChefHat className="w-4 h-4 me-2" />{t.generateRecipe}</>}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white/90 dark:bg-[#1A1A3E]/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10">
                    <div className="text-center mb-4">
                      <span className="text-5xl">{fridgeResult.emoji || "🍽️"}</span>
                      <h2 className="text-2xl font-bold mt-2">{fridgeResult.recipeName}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{fridgeResult.description}</p>
                    </div>

                    <div className="flex gap-4 justify-center mb-6 text-sm">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        ⏱️ {fridgeResult.cookingTime}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        📊 {fridgeResult.difficulty}
                      </span>
                    </div>

                    {fridgeResult.ingredients?.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-bold mb-2">{t.ingredients}</h3>
                        <ul className="space-y-1">
                          {fridgeResult.ingredients.map((ing: string, i: number) => (
                            <li key={i} className="text-sm flex items-center gap-2">
                              <span className="text-emerald-500">•</span> {ing}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {fridgeResult.steps?.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-bold mb-2">{t.steps}</h3>
                        <ol className="space-y-2">
                          {fridgeResult.steps.map((step: string, i: number) => (
                            <li key={i} className="text-sm flex gap-3">
                              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                {i + 1}
                              </span>
                              <span className="pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {fridgeResult.tip && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-sm">👨‍🍳 {fridgeResult.tip}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <Button onClick={resetCurrent} className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold">
                      <RotateCcw className="w-4 h-4 me-2" />{t.tryAgain}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && <p className="mt-4 text-center text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}