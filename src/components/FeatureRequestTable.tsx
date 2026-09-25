import React from 'react';
import { FeatureRequest } from '../types';
import { sound } from '../utils/audio';

interface FeatureRequestTableProps {
  features: FeatureRequest[];
  selectedId: string;
  onSelect: (feature: FeatureRequest) => void;
  isActiveList: boolean;
  isAdmin?: boolean;
  onAdminEdit?: (feature: FeatureRequest) => void;
}

export const FeatureRequestTable: React.FC<FeatureRequestTableProps> = ({
  features,
  selectedId,
  onSelect,
  isActiveList,
  isAdmin,
  onAdminEdit,
}) => {
  return (
    <div
      className={`flex flex-col border-2 transition-colors relative bg-[#040810]/70 select-none ${
        isActiveList ? 'border-[#ffd000]' : 'border-[#ffd000]/70'
      }`}
      style={{
        boxShadow: isActiveList ? '0 0 12px rgba(255, 208, 0, 0.25)' : 'none',
      }}
    >
      {/* Box Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#ffd000]/80 bg-[#ffd000]/10">
        <h2 className="text-[#ffd000] font-mono text-sm sm:text-base font-black tracking-widest uppercase crt-glow-yellow flex items-center gap-2">
          FEATURE REQUESTS
        </h2>
        <div className="text-xs sm:text-sm font-mono text-[#ffd000] tracking-wider font-bold">
          [ TOTAL: {features.length} ]
        </div>
      </div>

      {/* Column Titles Bar */}
      <div className="grid grid-cols-12 text-[11px] sm:text-xs font-mono font-bold text-[#00f0ff] px-2 py-1 border-b border-[#ffd000]/40 bg-black/40 tracking-wider">
        <div className="col-span-2">DATE</div>
        <div className="col-span-2 text-center">VOTES</div>
        <div className={isAdmin ? 'col-span-5' : 'col-span-6'}>TITLE</div>
        <div className="col-span-2 text-right">STATUS</div>
        {isAdmin && <div className="col-span-1 text-center">EDIT</div>}
      </div>

      {/* Rows Container */}
      <div className="flex-1 overflow-y-auto min-h-[160px] max-h-[220px] font-mono text-[12px] sm:text-[13px] relative divide-y divide-[#ffd000]/10">
        {features.length === 0 ? (
          <div className="h-full min-h-[140px] flex flex-col items-center justify-center p-4 text-center text-[#ffd000]/70">
            <span className="text-xs tracking-wider mb-1 font-bold">[ NO FEATURE PROPOSALS CURRENTLY LOGGED ]</span>
            <span className="text-[11px] text-[#00f0ff]/60">PRESS [F2] OR TYPE IDEA TO SUBMIT PROPOSAL</span>
          </div>
        ) : (
          features.map((feat) => {
            const isSelected = feat.id === selectedId;

          // Status color helper
          const getStatusColor = () => {
            if (isSelected) return 'text-black font-black';
            switch (feat.status) {
              case 'WORKING ON':
                return 'text-[#33ff77] font-bold crt-glow-green';
              case 'PLANNED':
                return 'text-[#ffd000] font-bold crt-glow-yellow';
              case 'CONSIDERING':
                return 'text-[#ffd000] font-semibold';
              case 'SUGGESTED':
              default:
                return 'text-[#ffd000]/80';
            }
          };

          return (
            <div
              key={feat.id}
              onClick={() => {
                sound.playKeyClick();
                onSelect(feat);
              }}
              className={`grid grid-cols-12 px-2 py-1 items-center cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-[#ffd000] text-black font-bold'
                  : 'hover:bg-[#ffd000]/15 text-[#00f0ff]'
              }`}
            >
              {/* Date */}
              <div
                className={`col-span-2 truncate ${
                  isSelected ? 'text-black' : 'text-[#ffd000]/80'
                }`}
              >
                {feat.date}
              </div>

              {/* Votes */}
              <div
                className={`col-span-2 text-center tabular-nums font-bold ${
                  isSelected ? 'text-black font-black' : 'text-[#00f0ff]'
                }`}
              >
                {feat.votes}
              </div>

              {/* Title */}
              <div
                className={`${
                  isAdmin ? 'col-span-5' : 'col-span-6'
                } truncate pr-1 ${
                  isSelected ? 'text-black font-black' : 'text-[#00f0ff]'
                }`}
                title={feat.title}
              >
                {feat.title}
              </div>

              {/* Status */}
              <div className={`col-span-2 text-right truncate ${getStatusColor()}`}>
                {feat.status}
              </div>

              {/* Admin Pen Icon Button */}
              {isAdmin && (
                <div className="col-span-1 text-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playSelect();
                      onSelect(feat);
                      if (onAdminEdit) onAdminEdit(feat);
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
      <div className="flex justify-end px-2 py-0.5 text-[10px] text-[#ffd000] font-mono border-t border-[#ffd000]/20 bg-black/50">
        <span className="animate-bounce">v</span>
      </div>
    </div>
  );
};
