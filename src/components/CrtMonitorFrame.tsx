import React from 'react';

interface CrtMonitorFrameProps {
  children: React.ReactNode;
  isCurved?: boolean;
}

export const CrtMonitorFrame: React.FC<CrtMonitorFrameProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#03060c] text-[#00f0ff] p-2 sm:p-4 md:p-6 flex flex-col font-mono select-none overflow-x-hidden crt-screen-active">
      {/* Authentic CRT scanlines across the full page */}
      <div className="fixed inset-0 crt-scanlines pointer-events-none z-30 opacity-35" />

      {/* Subtle CRT corner curvature vignette glow */}
      <div className="fixed inset-0 crt-vignette pointer-events-none z-30 opacity-45" />

      {/* Subtle Phosphor RGB Subpixel Mesh */}
      <div
        className="fixed inset-0 pointer-events-none z-30 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 240, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '3px 3px',
        }}
      />

      {/* Page Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};
