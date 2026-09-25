import React, { useState } from 'react';
import { Severity, BugReport, ScreenshotItem } from '../types';
import { sound } from '../utils/audio';
import { ScreenshotAttachmentPicker } from './ScreenshotAttachmentPicker';
import alleyWallImg from '../assets/images/delorean_alley_wall_1790324778813.jpg';

interface ReportMalfunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newBug: BugReport) => void;
}

export const ReportMalfunctionModal: React.FC<ReportMalfunctionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<Severity>('MAJOR');
  const [location, setLocation] = useState('Courthouse Square');
  const [description, setDescription] = useState('');
  const [repro, setRepro] = useState('');
  const [reporter, setReporter] = useState('Marty_M');
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      sound.playError();
      return;
    }

    sound.playDriveWrite();

    const newBug: BugReport = {
      id: `bug-${Date.now()}`,
      date: '10/24/85',
      fullDate: '10/24/1985',
      severity,
      title: title.trim(),
      status: 'REPORTED',
      description: description.trim(),
      location: location.trim(),
      reproductionSteps: repro
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      reportedBy: reporter.trim() || 'Anonymous',
      votes: 1,
      hasVoted: true,
      screenshots: screenshots,
      systemLog: `USER_DIAG_REPORT: Recorded by ${reporter.trim()} on OCT 24, 1985. Code: ERR_HV_${Math.floor(
        Math.random() * 900 + 100
      )}.`,
    };

    onSubmit(newBug);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="malfunction-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs select-none"
    >
      <div
        className="w-full max-w-lg max-h-[85vh] flex flex-col border-2 border-[#ff441f] bg-[#030710] shadow-[0_0_20px_rgba(255,68,31,0.4)] relative font-mono text-[#00f0ff]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="flex items-center justify-between border-b border-[#ff441f]/70 px-3 py-2 bg-[#ff441f]/10">
          <div id="malfunction-modal-title" className="text-sm sm:text-base font-black text-[#ff441f] crt-glow-orange flex items-center gap-2">
            <span>[F1]</span>
            <span>REPORT MALFUNCTION // SYS_MAL_01</span>
          </div>
          <button
            onClick={() => {
              sound.playKeyClick();
              onClose();
            }}
            className="text-[#ff441f] hover:text-white px-2 py-0.5 border border-[#ff441f]/50 cursor-pointer text-xs font-bold"
          >
            [ESC]
          </button>
        </div>

        {/* Form Body - scrollable container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 text-xs">
          {/* Title */}
          <div>
            <label className="block text-[#ff441f] font-bold mb-1">
              MALFUNCTION TITLE:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. DeLorean flux capacitor voltage drop"
              className="w-full bg-black/70 border border-[#00f0ff]/50 px-2 py-1 text-[#00f0ff] outline-none focus:border-[#ff441f]"
            />
          </div>

          {/* Severity & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[#ff441f] font-bold mb-1">
                SEVERITY LEVEL:
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full bg-[#030710] border border-[#00f0ff]/50 px-2 py-1 text-[#00f0ff] outline-none focus:border-[#ff441f]"
              >
                <option value="MINOR">MINOR (Visual / Audio)</option>
                <option value="MAJOR">MAJOR (Gameplay Block)</option>
                <option value="CRITICAL">CRITICAL (Crash / Fatal)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#ff441f] font-bold mb-1">
                LOCATION:
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Courthouse Square, Lyon Estates"
                className="w-full bg-black/70 border border-[#00f0ff]/50 px-2 py-1 text-[#00f0ff] outline-none focus:border-[#ff441f]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#ff441f] font-bold mb-1">
              ANOMALY DESCRIPTION:
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what occurred..."
              className="w-full bg-black/70 border border-[#00f0ff]/50 px-2 py-1 text-[#00f0ff] outline-none focus:border-[#ff441f]"
            />
          </div>

          {/* Reproduction Steps */}
          <div>
            <label className="block text-[#ff441f] font-bold mb-1">
              REPRODUCTION SEQUENCE (OPTIONAL):
            </label>
            <textarea
              rows={2}
              value={repro}
              onChange={(e) => setRepro(e.target.value)}
              placeholder="1. Drive toward clock tower...&#10;2. Shift into 3rd gear..."
              className="w-full bg-black/70 border border-[#00f0ff]/50 px-2 py-1 text-[#00f0ff] outline-none focus:border-[#ff441f]"
            />
          </div>

          {/* Screenshot Attachments */}
          <ScreenshotAttachmentPicker
            themeColor="#ff441f"
            screenshots={screenshots}
            onChange={setScreenshots}
          />

          {/* Reporter Call-sign */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-[#00f0ff]/70">REPORTED BY:</span>
            <input
              type="text"
              value={reporter}
              onChange={(e) => setReporter(e.target.value)}
              className="bg-black/70 border border-[#00f0ff]/40 px-2 py-0.5 text-xs text-[#ffd000] w-36 outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#ff441f]/40">
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
              className="px-4 py-1.5 border-2 border-[#ff441f] bg-[#ff441f]/20 hover:bg-[#ff441f]/40 text-[#ff441f] crt-glow-orange font-black tracking-wider transition-colors cursor-pointer"
            >
              [ENTER] TRANSMIT TO BOARD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
