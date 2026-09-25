import React from 'react';
import { ScreenshotItem } from '../types';
import { sound } from '../utils/audio';

interface ScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenshots: ScreenshotItem[];
}

export const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  isOpen,
  onClose,
  screenshots,
}) => {
  if (!isOpen) return null;

  const currentSS = screenshots && screenshots.length > 0 ? screenshots[0] : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="screenshot-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl border-2 border-[#00f0ff] bg-[#02050b] p-3 sm:p-4 shadow-[0_0_30px_rgba(0,240,255,0.4)] relative font-mono text-[#00f0ff]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00f0ff]/50 pb-2 mb-3">
          <div id="screenshot-modal-title" className="text-sm sm:text-base font-bold text-[#00f0ff] crt-glow-cyan flex items-center gap-2">
            <span>[OPTICAL_INSPECTOR]</span>
            <span className="text-white truncate">{currentSS?.title || 'ATTACHED SCREENSHOT'}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#ffd000] tabular-nums">
              [1/1]
            </span>
            <button
              onClick={() => {
                sound.playKeyClick();
                onClose();
              }}
              className="text-[#00f0ff] hover:text-white px-2 py-0.5 border border-[#00f0ff]/60 text-xs font-bold cursor-pointer"
            >
              [ESC] CLOSE
            </button>
          </div>
        </div>

        {/* Big Image Viewer with CRT Scanlines & Radar Overlay */}
        <div className="relative w-full aspect-[4/3] max-h-[65vh] overflow-hidden border border-[#00f0ff]/60 bg-black flex items-center justify-center">
          {currentSS?.url ? (
            <img
              src={currentSS.url}
              alt={currentSS.title || 'Attached Screenshot'}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-sm text-[#00f0ff]/60">[NO IMAGE SIGNAL]</div>
          )}

          {/* CRT Scanline Overlay */}
          <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-40"></div>

          {/* Mini-Radar Display on bottom-left */}
          <div className="absolute bottom-3 left-3 w-16 h-16 border-2 border-[#ffd000] bg-black/85 p-1 pointer-events-none">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 border border-[#ffd000]/50"></div>
              <div className="absolute top-1/2 left-0 right-0 border-t border-[#ffd000]/50"></div>
              <div className="absolute left-1/2 top-0 bottom-0 border-l border-[#ffd000]/50"></div>
              <div className="absolute top-[40%] left-[45%] w-2 h-2 bg-[#ff441f] rounded-full animate-ping"></div>
              <div className="absolute top-[40%] left-[45%] w-2 h-2 bg-[#ff441f] rounded-full"></div>
            </div>
            <div className="absolute -top-3 left-0 text-[8px] bg-black text-[#ffd000] px-1 border border-[#ffd000]/40">
              RADAR: ACTIVE
            </div>
          </div>
        </div>

        {/* Caption & Metadata Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3 pt-2 border-t border-[#00f0ff]/30 text-xs">
          <div className="text-[#00f0ff]/80 text-center sm:text-left">
            {currentSS?.caption && <p>{currentSS.caption}</p>}
            {currentSS?.location && (
              <span className="text-[#ffd000] text-[11px]">
                SECTOR: {currentSS.location}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playKeyClick();
                onClose();
              }}
              className="border border-[#00f0ff] hover:bg-[#00f0ff]/20 px-3 py-1 font-bold cursor-pointer"
            >
              [ESC] RETURN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
