import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (success) {
      sound.playSelect();
      setPassword('');
      setErrorMsg('');
      onClose();
    } else {
      sound.playError();
      setErrorMsg('ACCESS DENIED: INVALID SECURITY KEY');
      setPassword('');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-auth-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md select-none font-mono"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm border-2 border-[#33ff77] bg-[#020704] p-4 sm:p-5 shadow-[0_0_25px_rgba(51,255,119,0.35)] relative text-[#33ff77]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#33ff77]/50 pb-2 mb-3">
          <div id="admin-auth-title" className="text-sm font-black tracking-wider uppercase flex items-center gap-2 crt-glow-green">
            <span>[LOGIN]</span>
            <span>ADMIN SECURITY GATE</span>
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

        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-[11px] text-[#33ff77]/80">
            ENTER SUPERUSER SECURITY PASSWORD TO UNLOCK EDIT & PURGE CAPABILITIES:
          </p>

          <div>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="ENTER ADMIN PASSWORD..."
              className="w-full bg-black border border-[#33ff77]/70 px-3 py-1.5 text-xs text-[#33ff77] font-bold outline-none focus:border-white tracking-widest placeholder-[#33ff77]/30"
            />
          </div>

          {errorMsg && (
            <div className="text-[11px] text-[#ff441f] font-bold tracking-wider animate-pulse">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-[#33ff77]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border border-[#33ff77]/50 hover:bg-[#33ff77]/20 text-xs font-bold text-[#33ff77] cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1 border-2 border-[#33ff77] bg-[#33ff77]/20 hover:bg-[#33ff77]/40 text-xs font-black text-white cursor-pointer transition-colors"
            >
              AUTHENTICATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
