import React, { useState } from 'react';
import { FeatureRequest, ScreenshotItem } from '../types';
import { sound } from '../utils/audio';
import { ScreenshotAttachmentPicker } from './ScreenshotAttachmentPicker';
import west1885Img from '../assets/images/delorean_1885_west_1790324807721.jpg';

interface SubmitIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newFeat: FeatureRequest) => void;
}

export const SubmitIdeaModal: React.FC<SubmitIdeaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Vehicles & Gadgets');
  const [description, setDescription] = useState('');
  const [suggester, setSuggester] = useState('Marty_1985');
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      sound.playError();
      return;
    }

    sound.playDriveWrite();

    const newFeat: FeatureRequest = {
      id: `feat-${Date.now()}`,
      date: '10/24/85',
      fullDate: '10/24/1985',
      votes: 1,
      hasVoted: true,
      title: title.trim(),
      status: 'SUGGESTED',
      description: description.trim(),
      suggestedBy: suggester.trim() || 'Community Innovator',
      category: category.trim(),
      plannedTimeline: 'Community Backlog',
      screenshots: screenshots,
      createdAt: Date.now(),
    };

    onSubmit(newFeat);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="idea-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs select-none"
    >
      <div
        className="w-full max-w-lg max-h-[85vh] flex flex-col border-2 border-[#ffd000] bg-[#030710] shadow-[0_0_20px_rgba(255,208,0,0.4)] relative font-mono text-[#00f0ff]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="flex items-center justify-between border-b border-[#ffd000]/70 px-3 py-2 bg-[#ffd000]/10">
          <div id="idea-modal-title" className="text-sm sm:text-base font-black text-[#ffd000] crt-glow-yellow flex items-center gap-2">
            <span>[F2]</span>
            <span>SUBMIT NEW IDEA // CONCEPT_SPEC</span>
          </div>
          <button
            onClick={() => {
              sound.playKeyClick();
              onClose();
            }}
            className="text-[#ffd000] hover:text-white px-2 py-0.5 border border-[#ffd000]/50 cursor-pointer text-xs font-bold"
          >
            [ESC]
          </button>
        </div>

        {/* Form Body - scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 text-xs">
          {/* Title */}
          <div>
            <label className="block text-[#ffd000] font-bold mb-1">
              PROPOSAL TITLE:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Add 2015 Hoverboard race circuit"
              className="w-full bg-black/70 border border-[#00f0ff]/50 px-2 py-1 text-[#00f0ff] outline-none focus:border-[#ffd000]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[#ffd000] font-bold mb-1">
              EXPANSION CATEGORY:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#030710] border border-[#00f0ff]/50 px-2 py-1 text-[#00f0ff] outline-none focus:border-[#ffd000]"
            >
              <option value="World & Timeline Expansion">World & Timeline Expansion</option>
              <option value="Vehicles & Gadgets">Vehicles & Gadgets</option>
              <option value="Playable Characters">Playable Characters</option>
              <option value="Environment Engine">Environment & Physics</option>
              <option value="AI & Law Enforcement">AI & Law Enforcement</option>
              <option value="Soundtrack & Radio">Soundtrack & Radio</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#ffd000] font-bold mb-1">
              CONCEPT DETAILS & GAMEPLAY IMPACT:
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe how this feature will enhance Back to the Future: Reversed..."
              className="w-full bg-black/70 border border-[#00f0ff]/50 px-2 py-1 text-[#00f0ff] outline-none focus:border-[#ffd000]"
            />
          </div>

          {/* Screenshot Attachments */}
          <ScreenshotAttachmentPicker
            themeColor="#ffd000"
            screenshots={screenshots}
            onChange={setScreenshots}
          />

          {/* Submitter */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-[#00f0ff]/70">SUBMITTED BY:</span>
            <input
              type="text"
              value={suggester}
              onChange={(e) => setSuggester(e.target.value)}
              className="bg-black/70 border border-[#00f0ff]/40 px-2 py-0.5 text-xs text-[#ffd000] w-36 outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#ffd000]/40">
            <button
              type="button"
              onClick={() => {
                sound.playKeyClick();
                onClose();
              }}
              className="px-3 py-1.5 border border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff]/20 font-bold transition-colors cursor-pointer"
            >
              [ESC] CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 border-2 border-[#ffd000] bg-[#ffd000]/20 hover:bg-[#ffd000]/40 text-[#ffd000] crt-glow-yellow font-black tracking-wider transition-colors cursor-pointer"
            >
              [ENTER] SUBMIT TO VOTING
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
