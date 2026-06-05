import { Star, Bell, RotateCcw, Share2, Info, Bookmark } from "lucide-react";

interface MobileDuaPreviewProps {
  titleEn: string;
  titleBn: string;
  categoryNameEn?: string | null;
  categoryNameBn?: string | null;
  categoryColor?: string | null;
  arabicText?: string | null;
  repeatCount: number;
  banglaMeaning?: string | null;
  englishMeaning?: string | null;
  transliterationBn?: string | null;
  transliterationEn?: string | null;
  referenceBn?: string | null;
  referenceEn?: string | null;
  notesBn?: string | null;
  notesEn?: string | null;
}

export function MobileDuaPreview({
  titleEn,
  titleBn,
  categoryNameEn,
  categoryNameBn,
  categoryColor = "#10b981",
  arabicText,
  repeatCount = 1,
  banglaMeaning,
  englishMeaning,
  transliterationBn,
  transliterationEn,
  referenceBn,
  referenceEn,
  notesBn,
  notesEn,
}: MobileDuaPreviewProps) {
  const finalColor = categoryColor || "#10b981";

  return (
    <div className="w-full max-w-sm mx-auto bg-slate-900 p-3.5 rounded-[40px] shadow-2xl border-4 border-slate-800 select-none font-sans relative">
      {/* Mock Phone Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center">
        <div className="w-12 h-1 bg-slate-900 rounded-full" />
      </div>

      <div className="bg-[#fcfdfc] rounded-[32px] overflow-hidden min-h-[500px] flex flex-col justify-between border border-slate-100 relative pt-4">
        {/* Mobile Header Bar */}
        <div className="px-5 pt-3 pb-2 flex justify-between items-center border-b border-slate-50">
          <span className="text-[10px] font-bold text-slate-400 font-mono">9:41</span>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
        </div>

        {/* Bottom Sheet Modal Frame wrapper */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-h-[460px] scrollbar-thin">
          {/* Bottom Sheet Handle */}
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-2 shrink-0" />

          {/* Action Row */}
          <div className="flex items-center justify-between">
            {/* Category Pill */}
            <span
              style={{
                backgroundColor: `${finalColor}12`,
                color: finalColor,
                borderColor: `${finalColor}25`,
              }}
              className="text-[10px] font-bold px-2 py-0.5 rounded-full border truncate max-w-[200px]"
            >
              {categoryNameEn
                ? categoryNameBn
                  ? `${categoryNameEn} (${categoryNameBn})`
                  : categoryNameEn
                : "General Supplication"}
            </span>

            {/* Mock Top Actions */}
            <div className="flex items-center gap-2">
              <button type="button" className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <Star className="h-3.5 w-3.5" />
              </button>
              <button type="button" className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <Bell className="h-3.5 w-3.5" />
              </button>
              <button type="button" className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <Share2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Title block */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 leading-tight">
              {titleEn || "Dua Title (English)"}
            </h3>
            <p className="text-[11px] text-emerald-800 font-bold border-l border-emerald-500 pl-1.5 leading-none">
              {titleBn || "দুআর শিরোনাম (বাংলা)"}
            </p>
          </div>

          {/* Arabic Text Block */}
          <div className="p-4 bg-emerald-50/10 border border-emerald-100/30 rounded-2xl flex flex-col gap-2">
            <p dir="rtl" className="text-xl font-medium text-[#022c22] leading-loose text-center py-2 select-text font-serif">
              {arabicText || "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً"}
            </p>
          </div>

          {/* Counter widget mockup */}
          <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-xs flex flex-col items-center gap-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recitation Progression</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                0 / {repeatCount}
              </span>
            </div>
            
            {/* Mock progress bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-0 h-full bg-emerald-600 transition-all" />
            </div>

            {/* Counter controls */}
            <div className="flex items-center justify-center gap-4 mt-1">
              <button type="button" className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                <RotateCcw className="h-3 w-3" />
              </button>
              <button type="button" className="h-8 w-16 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-sm transition-colors">
                Tap
              </button>
            </div>
          </div>

          {/* Bangla Content Area */}
          <div className="bg-white border border-slate-100 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50/60 px-2 py-0.5 rounded-md w-fit">
              <span>বাংলা অনুবাদ ও উচ্চারণ</span>
            </div>

            {transliterationBn && (
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-slate-400">উচ্চারণ:</p>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {transliterationBn}
                </p>
              </div>
            )}

            {banglaMeaning && (
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-slate-400">অর্থ:</p>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {banglaMeaning}
                </p>
              </div>
            )}

            {referenceBn && (
              <p className="text-[10px] text-slate-400 font-semibold italic border-t border-slate-50 pt-1.5 mt-1">
                সূত্র: {referenceBn}
              </p>
            )}
          </div>

          {/* English Content Area */}
          <div className="bg-white border border-slate-100 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md w-fit">
              <span>English Details</span>
            </div>

            {transliterationEn && (
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-slate-400">Transliteration:</p>
                <p className="text-xs text-slate-700 leading-relaxed font-medium italic">
                  {transliterationEn}
                </p>
              </div>
            )}

            {englishMeaning && (
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-slate-400">Meaning:</p>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {englishMeaning}
                </p>
              </div>
            )}

            {referenceEn && (
              <p className="text-[10px] text-slate-400 font-semibold italic border-t border-slate-50 pt-1.5 mt-1">
                Reference: {referenceEn}
              </p>
            )}
          </div>

          {/* Notes Area */}
          {(notesBn || notesEn) && (
            <div className="bg-amber-50/20 border border-amber-100/50 rounded-2xl p-3 space-y-2 shadow-xs">
              <div className="flex items-center gap-1 text-[9px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-md w-fit">
                <Info className="h-2.5 w-2.5" /> Notes / ব্যাখ্যা
              </div>
              {notesBn && (
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {notesBn}
                </p>
              )}
              {notesEn && (
                <p className="text-xs text-slate-500 leading-relaxed font-medium italic border-t border-amber-100/30 pt-1">
                  {notesEn}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Mobile Mock Bottom Navigation */}
        <div className="border-t border-slate-100 bg-white/80 backdrop-blur-md px-6 py-2.5 flex items-center justify-around shrink-0">
          <Bookmark className="h-4 w-4 text-emerald-700" />
          <div className="h-6 w-6 rounded-full bg-emerald-700/10 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-emerald-700" />
          </div>
          <Star className="h-4 w-4 text-slate-300" />
        </div>
      </div>
    </div>
  );
}
