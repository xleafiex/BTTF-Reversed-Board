import React, { useState } from 'react';
import { BugReport, FeatureRequest, BugStatus, FeatureStatus } from '../types';
import { sound } from '../utils/audio';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem: BugReport | FeatureRequest;
  isBug: boolean;
  onUpdateStatus: (id: string, newStatus: string, isBug: boolean) => void;
  onDeleteTopic: (id: string, isBug: boolean) => void;
  onLogout: () => void;
}

const BUG_STATUS_OPTIONS: BugStatus[] = ['REPORTED', 'CONFIRMED', 'FIXING', 'FIXED'];
const FEATURE_STATUS_OPTIONS: FeatureStatus[] = ['SUGGESTED', 'CONSIDERING', 'WORKING ON', 'PLANNED'];

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  activeItem,
  isBug,
  onUpdateStatus,
  onDeleteTopic,
  onLogout,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(activeItem.status);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const handleApplyStatus = () => {
    sound.playDriveWrite();
    onUpdateStatus(activeItem.id, selectedStatus, isBug);
    onClose();
  };

  const handleDelete = () => {
    sound.playDriveWrite();
    onDeleteTopic(activeItem.id, isBug);
    setConfirmDelete(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md select-none font-mono"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg border-2 border-[#33ff77] bg-[#020704] p-4 sm:p-5 shadow-[0_0_25px_rgba(51,255,119,0.35)] relative text-[#33ff77]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#33ff77]/50 pb-2 mb-3">
          <div id="admin-modal-title" className="text-sm sm:text-base font-black tracking-wider uppercase flex items-center gap-2 crt-glow-green">
            <span>[SYS_ADMIN]</span>
            <span>SUPERUSER CONSOLE // AUTHENTICATED</span>
          </div>
          <button
            onClick={() => {
              sound.playKeyClick();
              onClose();
            }}
            className="text-[#33ff77] hover:text-white px-2 py-0.5 border border-[#33ff77]/50 text-xs font-bold cursor-pointer"
          >
            [ESC]
          </button>
        </div>

        {/* Selected Topic Info */}
        <div className="mb-4 p-2.5 border border-[#33ff77]/30 bg-black/60 text-xs space-y-1">
          <div className="text-white font-bold truncate">
            {isBug ? '[BUG] ' : '[IDEA] '} {activeItem.title}
          </div>
          <div className="text-[#33ff77]/70 text-[11px] flex justify-between">
            <span>ID: {activeItem.id}</span>
            <span>CURRENT STATUS: <strong className="text-white">{activeItem.status}</strong></span>
          </div>
        </div>

        {/* Change Status Form */}
        <div className="space-y-2 mb-5">
          <label className="block text-xs font-bold tracking-wider uppercase text-[#33ff77]">
            UPDATE STATUS:
          </label>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 bg-black border border-[#33ff77]/60 px-2.5 py-1.5 text-xs text-[#33ff77] font-bold outline-none"
            >
              {isBug
                ? BUG_STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))
                : FEATURE_STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
            </select>
            <button
              onClick={handleApplyStatus}
              className="px-3 py-1.5 border border-[#33ff77] bg-[#33ff77]/20 hover:bg-[#33ff77]/40 text-xs font-bold text-white cursor-pointer transition-colors"
            >
              SET STATUS
            </button>
          </div>
        </div>

        {/* Danger Zone: Delete Topic */}
        <div className="border-t border-[#33ff77]/30 pt-3 mb-4">
          <label className="block text-xs font-bold tracking-wider uppercase text-[#ff441f] mb-2">
            DANGER ZONE // PURGE TOPIC:
          </label>
          {!confirmDelete ? (
            <button
              onClick={() => {
                sound.playError();
                setConfirmDelete(true);
              }}
              className="w-full py-1.5 border border-[#ff441f] bg-[#ff441f]/15 hover:bg-[#ff441f]/30 text-[#ff441f] text-xs font-bold cursor-pointer transition-colors text-center"
            >
              [!] PURGE THIS TOPIC FROM BOARD
            </button>
          ) : (
            <div className="space-y-2 bg-[#ff441f]/10 p-2.5 border border-[#ff441f]">
              <div className="text-xs text-[#ff441f] font-bold text-center">
                ARE YOU SURE YOU WANT TO PERMANENTLY DELETE THIS ENTRY?
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleDelete}
                  className="px-4 py-1 border border-[#ff441f] bg-[#ff441f] text-black text-xs font-black cursor-pointer hover:bg-white transition-colors"
                >
                  CONFIRM DELETE
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-1 border border-white/50 text-white text-xs font-bold cursor-pointer hover:bg-white/20"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-[#33ff77]/30 text-[11px]">
          <button
            onClick={() => {
              sound.playKeyClick();
              onLogout();
              onClose();
            }}
            className="text-[#ff441f] hover:underline cursor-pointer"
          >
            LOGOUT ADMIN
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 border border-[#33ff77]/50 hover:bg-[#33ff77]/20 text-[#33ff77] cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
