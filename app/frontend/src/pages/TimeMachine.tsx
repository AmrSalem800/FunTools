import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { translations } from "@/lib/i18n";
import { getHistoricalEvents, fetchEventImage, parseJSON } from "@/lib/ai-service";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock, Loader2, RotateCcw, Sparkles, Sun, Moon, Globe } from "lucide-react";

const NEWSPAPER_TEXTURE = "https://mgx-backend-cdn.metadl.com/generate/images/552332/2026-04-03/407c2cf9-3ded-4368-af94-601e398f7a4f.png";

interface HistoricalEvent {
  year: string;
  title: string;
  description: string;
  searchTerm?: string;
  imagePrompt?: string;
  imageUrl?: string;
}

export default function TimeMachinePage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, lang, toggleLang } = useApp();
  const t = translations[lang];
  const BackArrow = lang === "ar" ? ArrowRight : ArrowLeft;

  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [events, setEvents] = useState<HistoricalEvent[] | null>(null);
  const [error, setError] = useState("");
  const [showNewspaper, setShowNewspaper] = useState(false);

  const handleTravel = async () => {
    setLoading(true);
    setError("");
    setEvents(null);
    setShowNewspaper(false);

    try {
      const result = await getHistoricalEvents(day, month, year, lang);
      const parsed = parseJSON(result);
      const evts: HistoricalEvent[] = parsed.events || [];
      setEvents(evts);
      setTimeout(() => setShowNewspaper(true), 300);

      // Fetch real images from Wikipedia for all events
      // Use searchTerm (English) for Wikipedia search, fallback to imagePrompt or title
      setLoadingImages(true);
      const imagePromises = evts.map(async (evt, idx) => {
        try {
          const searchQuery = evt.searchTerm || evt.imagePrompt || evt.title;
          const url = await fetchEventImage(searchQuery, evt.year);
          return { idx, url };
        } catch {
          return { idx, url: "" };
        }
      });

      const imgResults = await Promise.allSettled(imagePromises);
      setEvents(prev => {
        if (!prev) return prev;
        const updated = [...prev];
        imgResults.forEach(r => {
          if (r.status === "fulfilled" && r.value.url) {
            updated[r.value.idx] = { ...updated[r.value.idx], imageUrl: r.value.url };
          }
        });
        return updated;
      });
      setLoadingImages(false);
    } catch {
      setError(t.errorOccurred + ". " + t.tryAgainLater);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEvents(null);
    setShowNewspaper(false);
    setError("");
    setLoadingImages(false);
  };

  const renderEventImage = (event: HistoricalEvent, index: number) => {
    if (event.imageUrl) {
      return (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
          style={{ filter: "sepia(0.3)" }}
          onError={(e) => {
            // Hide broken image and show placeholder
            const target = e.currentTarget;
            target.style.display = "none";
            // Update state to clear the broken URL
            setEvents(prev => {
              if (!prev) return prev;
              const updated = [...prev];
              updated[index] = { ...updated[index], imageUrl: "" };
              return updated;
            });
          }}
        />
      );
    }
    if (loadingImages) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-[#3d2b1f]/40 dark:text-amber-200/40" />
        </div>
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#e8d5b0] dark:bg-[#3d2b1f]">
        <span className="text-[#3d2b1f]/30 dark:text-amber-200/30 text-2xl">&#x1F4F0;</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-gradient-to-br from-amber-50/90 via-orange-50/80 to-yellow-50/90 dark:from-[#0F0F23] dark:via-[#1A1A3E] dark:to-[#0F0F23] transition-colors duration-500" />

      <div className="relative z-10">
        <nav className="flex items-center justify-between p-4 md:p-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:bg-amber-100 dark:hover:bg-amber-900/20"
          >
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
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <Clock className="w-10 h-10 text-amber-500 animate-spin-slow" />
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                {t.timeMachineTitle}
              </h1>
            </div>
            <p className="text-muted-foreground">{t.timeMachineDesc}</p>
          </div>

          {/* Date Selector */}
          {!events && (
            <div className="animate-fade-in-up">
              <div className="relative max-w-md mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur-lg opacity-30" />
                <div className="relative bg-white/90 dark:bg-[#1A1A3E]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-white/10">
                  <h2 className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    {t.selectDate}
                  </h2>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted-foreground">{t.day}</label>
                      <select
                        value={day}
                        onChange={(e) => setDay(Number(e.target.value))}
                        className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 text-lg font-semibold text-center focus:ring-2 focus:ring-amber-500 transition-all"
                      >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted-foreground">{t.month}</label>
                      <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 text-lg font-semibold text-center focus:ring-2 focus:ring-amber-500 transition-all"
                      >
                        {t.months.map((m: string, i: number) => (
                          <option key={i} value={i + 1}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted-foreground">{t.year}</label>
                      <select
                        value={year ?? ""}
                        onChange={(e) => setYear(e.target.value ? Number(e.target.value) : null)}
                        className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 text-lg font-semibold text-center focus:ring-2 focus:ring-amber-500 transition-all"
                      >
                        <option value="">{lang === "ar" ? "أي سنة" : "Any"}</option>
                        {Array.from({ length: 225 }, (_, i) => 2025 - i).map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleTravel}
                    disabled={loading}
                    className="w-full py-6 text-lg font-bold rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t.traveling}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        {t.travelInTime}
                      </span>
                    )}
                  </Button>

                  {error && <p className="mt-4 text-center text-red-500 text-sm">{error}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Classic Newspaper Display */}
          {events && (
            <div className={`transition-all duration-700 ${showNewspaper ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="relative max-w-3xl mx-auto">
                <div
                  className="relative rounded-sm overflow-hidden"
                  style={{
                    backgroundImage: `url(${NEWSPAPER_TEXTURE})`,
                    backgroundSize: "cover",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3), inset 0 0 80px rgba(61,43,31,0.1)",
                  }}
                >
                  <div
                    className="bg-[#f5e6c8]/90 dark:bg-[#2a2218]/90 p-6 md:p-10"
                    style={{ fontFamily: "'Playfair Display', 'Noto Serif', Georgia, serif" }}
                  >
                    {/* Decorative top border */}
                    <div className="border-t-[3px] border-[#3d2b1f]/70 dark:border-amber-200/50 mb-1" />
                    <div className="border-t border-[#3d2b1f]/40 dark:border-amber-200/30 mb-3" />

                    {/* Newspaper Header */}
                    <p className="text-center text-[10px] tracking-[0.5em] uppercase text-[#3d2b1f]/50 dark:text-amber-200/50 mb-1">
                      {t.edition}
                    </p>

                    <h2 className="text-center text-4xl md:text-6xl font-black text-[#3d2b1f] dark:text-amber-100 mb-1 leading-none tracking-tight">
                      {t.newspaperTitle}
                    </h2>

                    <div className="flex items-center gap-3 text-[10px] text-[#3d2b1f]/50 dark:text-amber-200/50 mb-2">
                      <span className="flex-1 border-b border-[#3d2b1f]/30 dark:border-amber-200/30" />
                      <span>{day} {t.months[month - 1]} {year || ""}</span>
                      <span>&#x2726;</span>
                      <span>{t.price}</span>
                      <span className="flex-1 border-b border-[#3d2b1f]/30 dark:border-amber-200/30" />
                    </div>

                    {/* Double line separator */}
                    <div className="border-t border-[#3d2b1f]/40 dark:border-amber-200/30 mb-0.5" />
                    <div className="border-t-[3px] border-[#3d2b1f]/70 dark:border-amber-200/50 mb-5" />

                    {/* Breaking News Banner */}
                    <div className="bg-[#3d2b1f] dark:bg-amber-800 text-[#f5e6c8] text-center py-1.5 px-4 mb-6">
                      <span className="font-bold tracking-[0.2em] text-xs uppercase">
                        &#x2605; {t.breakingNews} &#x2605;
                      </span>
                    </div>

                    {loadingImages && (
                      <div className="flex items-center justify-center gap-2 mb-4 text-sm text-[#3d2b1f]/60 dark:text-amber-200/60 italic">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t.generatingImages}</span>
                      </div>
                    )}

                    {/* Events as newspaper articles */}
                    <div className="space-y-6">
                      {events.map((event, index) => {
                        const isFirst = index === 0;
                        return (
                          <article
                            key={index}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 200}ms` }}
                          >
                            {isFirst ? (
                              /* Lead story - full width with large image */
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="inline-block bg-[#3d2b1f] dark:bg-amber-700 text-[#f5e6c8] text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase">
                                    {event.year}
                                  </span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-[#3d2b1f] dark:text-amber-100 mb-3 leading-tight">
                                  {event.title}
                                </h3>
                                <div className="w-full h-48 md:h-56 rounded-sm overflow-hidden border border-[#3d2b1f]/20 dark:border-amber-200/20 mb-3 bg-[#e8d5b0] dark:bg-[#3d2b1f]">
                                  {renderEventImage(event, index)}
                                </div>
                                <p className="text-sm text-[#3d2b1f]/80 dark:text-amber-200/80 leading-relaxed first-letter:text-3xl first-letter:font-bold first-letter:float-start first-letter:me-1">
                                  {event.description}
                                </p>
                              </div>
                            ) : (
                              /* Secondary stories - side by side image and text */
                              <div className="flex gap-4">
                                <div className="hidden sm:block w-28 h-20 shrink-0 rounded-sm overflow-hidden border border-[#3d2b1f]/20 dark:border-amber-200/20 bg-[#e8d5b0] dark:bg-[#3d2b1f]">
                                  {renderEventImage(event, index)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-block bg-[#3d2b1f] dark:bg-amber-700 text-[#f5e6c8] text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase">
                                      {event.year}
                                    </span>
                                  </div>
                                  <h3 className="text-lg md:text-xl font-bold text-[#3d2b1f] dark:text-amber-100 mb-1 leading-tight">
                                    {event.title}
                                  </h3>
                                  <p className="text-sm text-[#3d2b1f]/80 dark:text-amber-200/80 leading-relaxed">
                                    {event.description}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Article separator */}
                            {index < events.length - 1 && (
                              <div className="mt-5 border-b border-[#3d2b1f]/20 dark:border-amber-200/20" />
                            )}
                          </article>
                        );
                      })}
                    </div>

                    {/* Bottom border */}
                    <div className="mt-6 border-t border-[#3d2b1f]/40 dark:border-amber-200/30 pt-0.5" />
                    <div className="border-t-[3px] border-[#3d2b1f]/70 dark:border-amber-200/50" />
                  </div>
                </div>
              </div>

              {/* New Travel Button */}
              <div className="text-center mt-8">
                <Button
                  onClick={handleReset}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg"
                >
                  <RotateCcw className="w-4 h-4 me-2" />
                  {t.newTravel}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}