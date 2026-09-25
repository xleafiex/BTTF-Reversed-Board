import React from 'react';
import { BugReport, FeatureRequest, ScreenshotItem } from '../types';
import { sound } from '../utils/audio';

interface DetailPanelProps {
  item: BugReport | FeatureRequest;
  isBug: boolean;
  onEnterFullReport: () => void;
  onVote: () => void;
  onBackToList: () => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  item,
  isBug,
  onEnterFullReport,
  onVote,
  onBackToList,
}) => {
  const bug = isBug ? (item as BugReport) : null;
  const feat = !isBug ? (item as FeatureRequest) : null;

  const screenshots: ScreenshotItem[] = item.screenshots || [];
  const hasScreenshot = screenshots.length > 0 && !!screenshots[0]?.url;
  const currentSS = hasScreenshot ? screenshots[0] : null;

  return (
    <div className="flex flex-col gap-2 mt-2 select-none">
      {/* Two columns if screenshot exists for selected topic; otherwise full width detail box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
        {/* Detail Specs Box */}
        <div
          className={`${
            hasScreenshot ? 'md:col-span-7' : 'md:col-span-12'
          } flex flex-col border-2 p-3 bg-[#040810]/75 relative transition-all ${
            isBug ? 'border-[#ff441f]' : 'border-[#ffd000]'
          }`}
          style={{
            boxShadow: isBug
              ? '0 0 10px rgba(255, 68, 31, 0.2)'
              : '0 0 10px rgba(255, 208, 0, 0.2)',
          }}
        >
          {/* Header Title */}
          <div
            className={`font-mono text-sm sm:text-base font-black tracking-wider uppercase mb-2 ${
              isBug ? 'text-[#ff441f] crt-glow-orange' : 'text-[#ffd000] crt-glow-yellow'
            }`}
          >
            {isBug ? `BUG REPORT: ${item.title}` : `FEATURE REQUEST: ${item.title}`}
          </div>

          {/* Key-Value Metadata */}
          <div className="font-mono text-xs sm:text-[13px] space-y-1 text-[#00f0ff]">
            <div className="flex items-center">
              <span className="w-24 text-[#00f0ff] opacity-90">STATUS</span>
              <span className="mr-2 text-[#00f0ff]">:</span>
              <span
                className={`font-bold tracking-wide ${
                  item.status === 'FIXED' || item.status === 'WORKING ON'
                    ? 'text-[#33ff77] crt-glow-green'
                    : isBug
                    ? 'text-[#ff441f] crt-glow-orange'
                    : 'text-[#ffd000] crt-glow-yellow'
                }`}
              >
                {item.status}
              </span>
            </div>

            {isBug && bug && (
              <div className="flex items-center">
                <span className="w-24 text-[#00f0ff] opacity-90">SEVERITY</span>
                <span className="mr-2 text-[#00f0ff]">:</span>
                <span
                  className={`font-bold tracking-wide ${
                    bug.severity === 'CRITICAL'
                      ? 'text-[#ffd000] crt-glow-yellow'
                      : 'text-[#ff441f]'
                  }`}
                >
                  {bug.severity}
                </span>
              </div>
            )}

            {!isBug && feat && (
              <div className="flex items-center">
                <span className="w-24 text-[#00f0ff] opacity-90">VOTES</span>
                <span className="mr-2 text-[#00f0ff]">:</span>
                <span className="text-[#ffd000] font-bold tabular-nums">
                  {feat.votes} SUPPORTED
                </span>
                {feat.category && (
                  <span className="ml-4 text-[#00f0ff]/70 text-[11px]">
                    [{feat.category}]
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center">
              <span className="w-24 text-[#00f0ff] opacity-90">DATE</span>
              <span className="mr-2 text-[#00f0ff]">:</span>
              <span className="text-[#00f0ff] tracking-wider">{item.fullDate}</span>
            </div>
          </div>

          {/* Cyan Dashed Divider */}
          <div className="my-2 border-t-2 border-dashed border-[#00f0ff]/50"></div>

          {/* Description */}
          <div className="font-mono text-xs sm:text-sm text-[#00f0ff] leading-relaxed tracking-wide opacity-95">
            {item.description}
          </div>

          {/* Optional location badge if present */}
          {bug?.location && (
            <div className="mt-2 text-[11px] font-mono text-[#00f0ff]/70">
              LOCATION: <span className="text-[#ffd000]">{bug.location}</span>
            </div>
          )}
        </div>

        {/* Right: Clean Attached Screenshot Box without next, prev, open buttons or 1/1 counter */}
        {hasScreenshot && currentSS && (
          <div
            className="md:col-span-5 flex flex-col border-2 border-[#00f0ff] p-2 bg-[#040810]/75 relative"
            style={{ boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)' }}
          >
            {/* Header: Pure clean title */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-[#00f0ff] font-bold tracking-wider mb-1.5 px-1">
              <span className="crt-glow-cyan uppercase">ATTACHED SCREENSHOT</span>
            </div>

            {/* Clean Screenshot Display with Retro Radar Blip */}
            <div className="flex-1 w-full flex items-center justify-center">
              <div className="relative w-full aspect-[4/3] max-h-[175px] overflow-hidden border border-[#00f0ff]/40 bg-black">
                <img
                  src={currentSS.url}
                  alt={currentSS.title || 'Attached Screenshot'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Retro Mini Radar Overlay on bottom-left, matching the picture! */}
                <div className="absolute bottom-1.5 left-1.5 w-10 h-10 border border-[#ffd000] bg-black/75 p-0.5 pointer-events-none flex flex-col justify-between">
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 border border-[#ffd000]/40"></div>
                    <div className="absolute top-1/2 left-0 right-0 border-t border-[#ffd000]/40"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 border-l border-[#ffd000]/40"></div>
                    <div className="absolute top-[40%] left-[45%] w-1.5 h-1.5 bg-[#ff441f] rounded-full animate-ping"></div>
                    <div className="absolute top-[40%] left-[45%] w-1.5 h-1.5 bg-[#ff441f] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Keys Bar: [ENTER] VIEW FULL REPORT   [S] SUPPORT / VOTE   [ESC] BACK TO LIST */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 px-2 py-1 font-mono text-xs sm:text-sm font-bold tracking-wider text-[#ffd000] border-t border-[#00f0ff]/20 pt-1.5">
        <button
          onClick={() => {
            sound.playSelect();
            onEnterFullReport();
          }}
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span className="text-[#ffd000] font-black">[ENTER]</span>
          <span className="text-[#00f0ff]">VIEW FULL REPORT</span>
        </button>

        <button
          onClick={() => {
            sound.playVote();
            onVote();
          }}
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span className="text-[#ffd000] font-black">[S]</span>
          <span className="text-[#00f0ff]">
            SUPPORT / VOTE ({item.votes || 0})
            {item.hasVoted && <span className="text-[#33ff77] ml-1">✓</span>}
          </span>
        </button>

        <button
          onClick={() => {
            sound.playKeyClick();
            onBackToList();
          }}
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span className="text-[#ffd000] font-black">[ESC]</span>
          <span className="text-[#00f0ff]">BACK TO LIST</span>
        </button>
      </div>
    </div>
  );
};
