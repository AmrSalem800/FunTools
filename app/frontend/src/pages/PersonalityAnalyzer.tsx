import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { translations } from "@/lib/i18n";
import { analyzePersonality, parseJSON } from "@/lib/ai-service";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, ArrowRight, Loader2, Sun, Moon, Globe,
  Brain, Lightbulb, RotateCcw, CheckCircle, XCircle, Briefcase,
} from "lucide-react";

const HERO_IMG = "https://mgx-backend-cdn.metadl.com/generate/images/552332/2026-04-03/a681fb68-443b-491c-b64c-a3fd127ae317.png";

export default function PersonalityAnalyzerPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, lang, toggleLang } = useApp();
  const t = translations[lang];
  const BackArrow = lang === "ar" ? ArrowRight : ArrowLeft;

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (text.trim().length < 100) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await analyzePersonality(text, lang);
      const parsed = parseJSON(res);
      setResult(parsed);
    } catch {
      setError(t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const scoreLabels: Record<string, string> = {
    creativity: lang === "ar" ? "الإبداع" : "Creativity",
    logic: lang === "ar" ? "المنطق" : "Logic",
    empathy: lang === "ar" ? "التعاطف" : "Empathy",
    leadership: lang === "ar" ? "القيادة" : "Leadership",
    detail: lang === "ar" ? "الاهتمام بالتفاصيل" : "Attention to Detail",
  };

  const scoreColors = ["from-purple-500 to-pink-500", "from-blue-500 to-cyan-500", "from-rose-500 to-red-500", "from-amber-500 to-orange-500", "from-emerald-500 to-green-500"];

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 bg-cover bg-center opacity-15 dark:opacity-30"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50/90 via-white/80 to-pink-50/90 dark:from-[#0F0F23]/95 dark:via-[#0F0F23]/90 dark:to-[#1A1A3E]/95" />

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

        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent mb-2">
              {t.personalityTitle}
            </h1>
            <p className="text-muted-foreground">{t.personalityDesc}</p>
          </div>

          {!result && (
            <div className="animate-fade-in-up max-w-xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-20" />
                <div className="relative bg-white/90 dark:bg-[#1A1A3E]/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t.writeText}
                    rows={6}
                    className="w-full p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 border-0 resize-none focus:ring-2 focus:ring-purple-500 transition-all text-base mb-2"
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  />
                  <p className="text-xs text-muted-foreground mb-4 text-end">
                    {text.length} / 200+
                  </p>

                  <Button
                    onClick={handleAnalyze}
                    disabled={text.trim().length < 100 || loading}
                    className="w-full py-4 text-base font-bold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t.analyzing}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        {t.analyzePersonality}
                      </span>
                    )}
                  </Button>
                  {error && <p className="mt-4 text-center text-red-500 text-sm">{error}</p>}
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in-up max-w-2xl mx-auto">
              {/* Personality Type */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl blur-lg opacity-30" />
                <div className="relative bg-white/90 dark:bg-[#1A1A3E]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-white/10 text-center">
                  <div className="text-6xl mb-4">{result.emoji || "🎭"}</div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{t.personalityType}</h2>
                  <p className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {result.personalityType}
                  </p>
                </div>
              </div>

              {/* Scores */}
              {result.scores && (
                <div className="bg-white/60 dark:bg-[#1A1A3E]/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-white/10">
                  <div className="space-y-4">
                    {Object.entries(result.scores).map(([key, value], i) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span className="font-medium">{scoreLabels[key] || key}</span>
                          <span className="font-bold">{value as number}%</span>
                        </div>
                        <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${scoreColors[i % scoreColors.length]} transition-all duration-1000`}
                            style={{ width: `${value as number}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Traits */}
              {result.traits?.length > 0 && (
                <div className="bg-purple-500/10 dark:bg-purple-500/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                  <h3 className="font-bold text-lg mb-3">{t.traits}</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.traits.map((trait: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 text-sm font-medium">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Communication Style */}
              {result.communicationStyle && (
                <div className="bg-blue-500/10 dark:bg-blue-500/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    💬 {t.communicationStyle}
                  </h3>
                  <p className="text-sm leading-relaxed">{result.communicationStyle}</p>
                </div>
              )}

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.strengths?.length > 0 && (
                  <div className="bg-emerald-500/10 backdrop-blur-sm rounded-2xl p-5 border border-emerald-500/20">
                    <h3 className="font-bold mb-2 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4" /> {t.strengths}
                    </h3>
                    <ul className="space-y-1">
                      {result.strengths.map((s: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <span className="text-emerald-500">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.weaknesses?.length > 0 && (
                  <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-5 border border-red-500/20">
                    <h3 className="font-bold mb-2 flex items-center gap-2 text-red-600 dark:text-red-400">
                      <XCircle className="w-4 h-4" /> {t.weaknesses}
                    </h3>
                    <ul className="space-y-1">
                      {result.weaknesses.map((w: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <span className="text-red-500">✗</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Career Suggestions */}
              {result.careerSuggestions?.length > 0 && (
                <div className="bg-amber-500/10 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-amber-500" /> {t.careerSuggestions}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.careerSuggestions.map((c: string, i: number) => (
                      <span key={i} className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 text-sm font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Fun Fact */}
              {result.funFact && (
                <div className="flex items-start gap-2 p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
                  <Lightbulb className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                  <p className="text-sm"><strong>{t.funFact}:</strong> {result.funFact}</p>
                </div>
              )}

              <div className="text-center">
                <Button
                  onClick={() => { setResult(null); setText(""); }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold"
                >
                  <RotateCcw className="w-4 h-4 me-2" />
                  {t.tryAgain}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}