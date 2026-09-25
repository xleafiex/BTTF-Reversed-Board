import React from 'react';
import { BugReport } from '../types';
import { sound } from '../utils/audio';

interface BugReportTableProps {
  bugs: BugReport[];
  selectedId: string;
  onSelect: (bug: BugReport) => void;
  isActiveList: boolean;
  isAdmin?: boolean;
  onAdminEdit?: (bug: BugReport) => void;
}

export const BugReportTable: React.FC<BugReportTableProps> = ({
  bugs,
  selectedId,
  onSelect,
  isActiveList,
  isAdmin,
  onAdminEdit,
}) => {
  return (
    <div
      className={`flex flex-col border-2 transition-colors relative bg-[#040810]/70 select-none ${
        isActiveList ? 'border-[#ff441f]' : 'border-[#ff441f]/70'
      }`}
      style={{
        boxShadow: isActiveList ? '0 0 12px rgba(255, 68, 31, 0.25)' : 'none',
      }}
    >
      {/* Box Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#ff441f]/80 bg-[#ff441f]/10">
        <h2 className="text-[#ff441f] font-mono text-sm sm:text-base font-black tracking-widest uppercase crt-glow-orange flex items-center gap-2">
          BUG REPORTS
        </h2>
        <div className="text-xs sm:text-sm font-mono text-[#ff441f] tracking-wider font-bold">
          [ TOTAL: {bugs.length} ]
        </div>
      </div>

      {/* Column Titles Bar */}
      <div className="grid grid-cols-12 text-[11px] sm:text-xs font-mono font-bold text-[#00f0ff] px-2 py-1 border-b border-[#ff441f]/40 bg-black/40 tracking-wider">
        <div className="col-span-2">DATE</div>
        <div className="col-span-2">SEVERITY</div>
        <div className={isAdmin ? 'col-span-5' : 'col-span-6'}>TITLE</div>
        <div className="col-span-2 text-right">STATUS</div>
        {isAdmin && <div className="col-span-1 text-center">EDIT</div>}
      </div>

      {/* Rows Container */}
      <div className="flex-1 overflow-y-auto min-h-[160px] max-h-[220px] font-mono text-[12px] sm:text-[13px] relative divide-y divide-[#ff441f]/10">
        {bugs.length === 0 ? (
          <div className="h-full min-h-[140px] flex flex-col items-center justify-center p-4 text-center text-[#ff441f]/70">
            <span className="text-xs tracking-wider mb-1 font-bold">[ NO MALFUNCTIONS CURRENTLY LOGGED ]</span>
            <span className="text-[11px] text-[#00f0ff]/60">PRESS [F1] OR TYPE REPORT TO SUBMIT TELEMETRY</span>
          </div>
        ) : (
          bugs.map((bug) => {
            const isSelected = bug.id === selectedId;

          // Severity color helper
          const getSeverityColor = () => {
            if (isSelected) return 'text-black font-black';
            switch (bug.severity) {
              case 'CRITICAL':
                return 'text-[#ffd000] font-black crt-glow-yellow';
              case 'MAJOR':
                return 'text-[#ff441f] font-bold crt-glow-orange';
              case 'MINOR':
              default:
                return 'text-[#ffd000]/90';
            }
          };

          // Status color helper
          const getStatusColor = () => {
            if (isSelected) return 'text-black font-black';
            switch (bug.status) {
              case 'FIXED':
                return 'text-[#33ff77] font-bold crt-glow-green';
              case 'CONFIRMED':
                return 'text-[#ff441f] font-bold';
              case 'FIXING':
                return 'text-[#ff441f] font-bold crt-glow-orange';
              case 'REPORTED':
              default:
                return 'text-[#ff441f] font-semibold';
            }
          };

          return (
            <div
              key={bug.id}
              onClick={() => {
                sound.playKeyClick();
                onSelect(bug);
              }}
              className={`grid grid-cols-12 px-2 py-1 items-center cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-[#ff441f] text-black font-bold'
                  : 'hover:bg-[#ff441f]/15 text-[#00f0ff]'
              }`}
            >
              {/* Date */}
              <div
                className={`col-span-2 truncate ${
                  isSelected ? 'text-black' : 'text-[#ff9955]'
                }`}
              >
                {bug.date}
              </div>

              {/* Severity */}
              <div className={`col-span-2 truncate ${getSeverityColor()}`}>
                {bug.severity}
              </div>

              {/* Title */}
              <div
                className={`${
                  isAdmin ? 'col-span-5' : 'col-span-6'
                } truncate pr-1 ${
                  isSelected ? 'text-black font-black' : 'text-[#00f0ff]'
                }`}
                title={bug.title}
              >
                {bug.title}
              </div>

              {/* Status */}
              <div className={`col-span-2 text-right truncate ${getStatusColor()}`}>
                {bug.status}
              </div>

              {/* Admin Pen Icon Button */}
              {isAdmin && (
                <div className="col-span-1 text-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playSelect();
                      onSelect(bug);
                      if (onAdminEdit) onAdminEdit(bug);
                    }}
                    title="Edit Status / Purge Topic"
                    className={`px-1 py-0.5 rounded cursor-pointer transition-transform hover:scale-125 inline-flex items-center justify-center ${
                      isSelected
                        ? 'text-black hover:bg-black/20'
                        : 'text-[#33ff77] hover:bg-[#33ff77]/20 crt-glow-green'
                    }`}
                  >
                    {/* Retro pixelated pen/pencil icon */}
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 fill-none stroke-current"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })
        )}
      </div>

      {/* Bottom subtle scroll arrow indicator */}
      <div className="flex justify-end px-2 py-0.5 text-[10px] text-[#ff441f] font-mono border-t border-[#ff441f]/20 bg-black/50">
        <span className="animate-bounce">v</span>
      </div>
    </div>
  );
};
