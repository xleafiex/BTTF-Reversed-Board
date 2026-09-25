import React, { useState } from 'react';
import { BugReport, FeatureRequest } from '../types';
import { sound } from '../utils/audio';

interface FullReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BugReport | FeatureRequest;
  isBug: boolean;
  onVote: () => void;
}

export const FullReportModal: React.FC<FullReportModalProps> = ({
  isOpen,
  onClose,
  item,
  isBug,
  onVote,
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<
    Array<{ author: string; time: string; text: string }>
  >([
    {
      author: 'DocBrown_1985',
      time: '10/23/85 10:15 AM',
      text: 'Great Scott! We investigated the raycast threshold. When geometry is within 45cm, the gull-wing pneumatic actuator triggers an abort.',
    },
    {
      author: 'MartyMcFly',
      time: '10/23/85 10:48 AM',
      text: 'This heavy! Got stuck behind the diner twice yesterday trying to deliver the plutonium.',
    },
  ]);

  if (!isOpen) return null;

  const bug = isBug ? (item as BugReport) : null;
  const feat = !isBug ? (item as FeatureRequest) : null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    sound.playKeyClick();
    setComments((prev) => [
      ...prev,
      {
        author: 'Guest_Pilot',
        time: '10/23/85 11:02 AM',
        text: commentInput.trim(),
      },
    ]);
    setCommentInput('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs select-none"
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] flex flex-col border-2 bg-[#030710] shadow-[0_0_25px_rgba(0,240,255,0.3)] relative font-mono text-[#00f0ff] overflow-hidden"
        style={{
          borderColor: isBug ? '#ff441f' : '#ffd000',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          className={`flex items-center justify-between px-4 py-2 border-b bg-black/50 ${
            isBug ? 'border-[#ff441f]/70 text-[#ff441f]' : 'border-[#ffd000]/70 text-[#ffd000]'
          }`}
        >
          <div id="report-modal-title" className="text-sm sm:text-base font-black tracking-widest uppercase flex items-center gap-2">
            <span>[DOS-DEBUG]</span>
            <span className="truncate">{item.title}</span>
          </div>

          <button
            onClick={() => {
              sound.playKeyClick();
              onClose();
            }}
            className="hover:text-white px-2 py-0.5 border border-current text-xs font-bold cursor-pointer"
          >
            [ESC] CLOSE
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-black/60 border border-[#00f0ff]/30 text-xs">
            <div>
              <span className="text-[#00f0ff]/60 block text-[10px]">RECORD ID:</span>
              <span className="font-bold text-white">{item.id}</span>
            </div>
            <div>
              <span className="text-[#00f0ff]/60 block text-[10px]">STATUS:</span>
              <span
                className={`font-black ${
                  item.status === 'FIXED' ? 'text-[#33ff77]' : 'text-[#ffd000]'
                }`}
              >
                {item.status}
              </span>
            </div>
            <div>
              <span className="text-[#00f0ff]/60 block text-[10px]">TIMESTAMP:</span>
              <span className="font-bold text-white">{item.fullDate}</span>
            </div>
            <div>
              <span className="text-[#00f0ff]/60 block text-[10px]">COMMUNITY VOTES:</span>
              <div className="flex items-center gap-2">
                <span className="font-black text-[#ffd000]">{item.votes}</span>
                <button
                  onClick={onVote}
                  className="px-1.5 py-0.2 border border-[#ffd000] text-[10px] text-[#ffd000] hover:bg-[#ffd000]/20 cursor-pointer"
                >
                  +1 VOTE
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-[#ffd000] tracking-wider uppercase">
              OVERVIEW & DETAILS:
            </h3>
            <p className="p-3 bg-black/40 border border-[#00f0ff]/20 text-[#00f0ff] leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Reproduction Protocol for Bugs */}
          {bug?.reproductionSteps && bug.reproductionSteps.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-[#ff441f] tracking-wider uppercase">
                REPRODUCTION PROTOCOL:
              </h3>
              <div className="p-3 bg-black/40 border border-[#ff441f]/30 text-xs space-y-1 text-white/90">
                {bug.reproductionSteps.map((step, idx) => (
                  <div key={idx} className="font-mono">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Diagnostics Log if any */}
          {bug?.systemLog && (
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-[#00f0ff] tracking-wider uppercase">
                CRASH MEMORY DUMP / TELEMETRY:
              </h3>
              <pre className="p-2.5 bg-black border border-[#00f0ff]/40 text-[#33ff77] text-[11px] overflow-x-auto">
                {bug.systemLog}
              </pre>
            </div>
          )}

          {/* Attached Visuals Gallery */}
          {item.screenshots && item.screenshots.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#00f0ff] tracking-wider uppercase">
                RECORDED FRAME CAPTURES:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.screenshots.map((ss) => (
                  <div key={ss.id} className="border border-[#00f0ff]/40 bg-black/60 p-2">
                    <img
                      src={ss.url}
                      alt={ss.title}
                      className="w-full aspect-[4/3] object-cover border border-[#00f0ff]/30 mb-1.5"
                    />
                    <div className="text-xs font-bold text-white">{ss.title}</div>
                    {ss.caption && (
                      <div className="text-[11px] text-[#00f0ff]/70 mt-0.5">{ss.caption}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Feedback Thread */}
          <div className="space-y-2 pt-2 border-t border-[#00f0ff]/20">
            <h3 className="text-xs font-bold text-[#ffd000] tracking-wider uppercase">
              DEVELOPER & COMMUNITY LOG ({comments.length}):
            </h3>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {comments.map((c, i) => (
                <div key={i} className="p-2 bg-black/50 border border-[#00f0ff]/20 text-xs">
                  <div className="flex justify-between text-[11px] text-[#ffd000] mb-1">
                    <span className="font-bold">{c.author}</span>
                    <span className="text-[#00f0ff]/60">{c.time}</span>
                  </div>
                  <div className="text-[#00f0ff]/90">{c.text}</div>
                </div>
              ))}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Type community feedback or diagnostic note..."
                className="flex-1 bg-black border border-[#00f0ff]/50 px-2.5 py-1 text-xs text-[#00f0ff] outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1 border border-[#00f0ff] bg-[#00f0ff]/20 hover:bg-[#00f0ff]/40 text-xs font-bold cursor-pointer"
              >
                POST
              </button>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center px-4 py-2 border-t border-[#00f0ff]/30 bg-black/60 text-xs">
          <button
            onClick={() => {
              sound.playVote();
              onVote();
            }}
            className="border border-[#ffd000] text-[#ffd000] bg-[#ffd000]/10 hover:bg-[#ffd000]/25 px-3 py-1 font-bold cursor-pointer"
          >
            [S] SUPPORT THIS ENTRY ({item.votes})
          </button>
          <button
            onClick={() => {
              sound.playKeyClick();
              onClose();
            }}
            className="border border-[#00f0ff]/60 hover:bg-[#00f0ff]/20 px-3 py-1 font-bold cursor-pointer"
          >
            [ESC] RETURN TO BOARD
          </button>
        </div>
      </div>
    </div>
  );
};
