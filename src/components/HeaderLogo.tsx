import React, { useEffect, useState } from 'react';
import { sound } from '../utils/audio';
import deloreanWireframeImg from '../assets/images/delorean_wireframe_1790330409446.jpg';
import bttfMovieLogoImg from '../assets/images/bttf_movie_logo_transparent.png';

interface HeaderProps {
  onF1: () => void;
  onF2: () => void;
  isAdmin: boolean;
  onLogout: () => void;
  isCloudConnected?: boolean;
}

export const HeaderLogo: React.FC<HeaderProps> = ({
  onF1,
  onF2,
  isAdmin,
  onLogout,
  isCloudConnected = true,
}) => {
  // Live ticking 1985 clock! Starts at WED OCT 23, 1985 10:04 AM
  const [timeStr, setTimeStr] = useState('WED  OCT 23, 1985   10:04 AM');

  useEffect(() => {
    // Keep 1985 base date, tick minutes/seconds smoothly
    const baseHour = 10;
    const baseMinute = 4;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const totalMinutes = baseMinute + Math.floor(elapsedSeconds / 60);
      const curHour = (baseHour + Math.floor(totalMinutes / 60)) % 12 || 12;
      const curMin = totalMinutes % 60;
      const minStr = curMin < 10 ? `0${curMin}` : `${curMin}`;
      setTimeStr(`WED  OCT 23, 1985   ${curHour}:${minStr} AM`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full flex flex-col select-none border-b border-[#00f0ff]/20 pb-2 mb-2">
      {/* Top command & timestamp status line */}
      <div className="flex items-center justify-between text-[13px] sm:text-[15px] tracking-widest font-mono text-[#00f0ff] mb-1.5 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[#00f0ff] opacity-80">C:\BTTFR&gt;</span>
          <span className="text-[#ff9900] tracking-wider font-semibold">FEEDBACK.EXE</span>
        </div>

        {/* Top Right: Cloud Sync Status & Admin Auth Button & 1985 Live Time Display */}
        <div className="flex items-center gap-3 sm:gap-4 text-right">
          {isCloudConnected ? (
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[#00f0ff] opacity-80 border border-[#00f0ff]/30 px-1.5 py-0.5" title="Connected to Central Hill Valley Mainframe Database">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse"></span>
              <span>MAINFRAME LINK: ONLINE</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[#ff9900] border border-[#ff9900]/30 px-1.5 py-0.5" title="Local storage buffer active">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff9900]"></span>
              <span>STANDALONE MODE</span>
            </div>
          )}

          {isAdmin && (
            <div className="flex items-center gap-1.5 bg-[#33ff77]/10 border border-[#33ff77] px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#33ff77] animate-pulse"></span>
              <span className="text-[11px] font-bold text-[#33ff77]">ADMIN [ROOT]</span>
              <button
                onClick={() => {
                  sound.playKeyClick();
                  onLogout();
                }}
                className="text-[10px] text-[#ff441f] hover:text-white ml-1 border-l border-[#33ff77]/40 pl-1.5 cursor-pointer uppercase font-bold"
                title="Log out of admin mode"
              >
                [LOGOUT]
              </button>
            </div>
          )}

          <div className="text-[#00f0ff] crt-glow-cyan font-bold tracking-widest text-xs sm:text-sm md:text-base">
            {timeStr}
          </div>
        </div>
      </div>

      {/* Main Title Banner & DeLorean Wireframe */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-1 py-1">
        {/* Authentic Back to the Future: Reversed Movie Logo */}
        <div className="flex flex-col select-none max-w-full">
          <div className="relative flex items-center">
            {/* Authentic Theatrical Movie Logo with transparent background and letter contour glow */}
            <div className="relative group max-w-[320px] sm:max-w-[420px] md:max-w-[480px]">
              <img
                src={bttfMovieLogoImg}
                alt="Back to the Future: Reversed Official Movie Logo"
                className="w-full h-auto object-contain filter drop-shadow-[0_0_10px_rgba(255,60,0,0.95)] drop-shadow-[0_0_22px_rgba(255,140,0,0.7)] drop-shadow-[0_0_4px_rgba(255,230,0,0.8)] contrast-110"
              />
            </div>
          </div>

          {/* Subtitle */}
          <div className="text-[12px] sm:text-[14px] md:text-[15px] font-mono tracking-[0.25em] text-[#00f0ff] crt-glow-cyan uppercase mt-1 font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-[#ff441f] rounded-full animate-ping"></span>
            <span>COMMUNITY DEVELOPMENT BOARD // 1985 TERMINAL</span>
          </div>
        </div>

        {/* DeLorean DMC-12 Authentic Time Machine Wireframe Blueprint HUD */}
        <div className="hidden sm:flex items-center justify-end flex-1 max-w-[340px] md:max-w-[380px] pl-3">
          <div className="relative w-full aspect-[16/9] rounded border border-[#00f0ff]/40 bg-black/90 p-1 overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.25)] group">
            {/* High-definition AI Generated DeLorean Time Machine Vector Wireframe */}
            <img
              src={deloreanWireframeImg}
              alt="DeLorean DMC-12 Time Machine Wireframe Blueprint"
              className="w-full h-full object-contain filter contrast-125 brightness-110 drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]"
            />

            {/* Retro CAD HUD Corner Accents */}
            <div className="absolute top-1 left-1.5 text-[8px] font-mono font-bold text-[#00f0ff] opacity-80 tracking-widest pointer-events-none">
              DMC-12 // 88 MPH
            </div>
            <div className="absolute top-1 right-1.5 text-[8px] font-mono text-[#ffd000] opacity-80 tracking-wider pointer-events-none">
              1.21 GW FLUX
            </div>
            <div className="absolute bottom-1 left-1.5 text-[8px] font-mono text-[#33ff77] opacity-80 tracking-wider pointer-events-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#33ff77] animate-pulse"></span>
              TEMPORAL DISPLACEMENT
            </div>

            {/* Subtle retro target reticle corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00f0ff] pointer-events-none" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00f0ff] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00f0ff] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00f0ff] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Function Keys Action Bar: [F1] REPORT MALFUNCTION & [F2] SUBMIT NEW IDEA */}
      <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2 font-mono text-xs sm:text-sm">
        {/* [F1] REPORT MALFUNCTION */}
        <button
          onClick={() => {
            sound.playSelect();
            onF1();
          }}
          className="border border-[#ff441f] bg-[#ff441f]/15 hover:bg-[#ff441f]/35 text-[#ff441f] crt-glow-orange px-3 py-1.5 text-center font-bold tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <span className="font-black">[F1]</span>
          <span>REPORT MALFUNCTION</span>
        </button>

        {/* [F2] SUBMIT NEW IDEA */}
        <button
          onClick={() => {
            sound.playSelect();
            onF2();
          }}
          className="border border-[#ffd000] bg-[#ffd000]/15 hover:bg-[#ffd000]/35 text-[#ffd000] crt-glow-yellow px-3 py-1.5 text-center font-bold tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <span className="font-black">[F2]</span>
          <span>SUBMIT NEW IDEA</span>
        </button>
      </nav>
    </header>
  );
};
