import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../utils/audio';

interface TerminalPromptProps {
  onCommand: (cmd: string) => void;
  outputLog: string[];
  onClearLog: () => void;
}

export const TerminalPrompt: React.FC<TerminalPromptProps> = ({
  onCommand,
  outputLog,
  onClearLog,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputLog.length > 0) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [outputLog]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Play subtle key click on typing
    sound.playKeyClick();

    if (e.key === 'Enter') {
      const trimmed = inputVal.trim();
      if (trimmed) {
        setHistory((prev) => [...prev, trimmed]);
        setHistoryIdx(-1);
        onCommand(trimmed);
        setInputVal('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < history.length) {
          setHistoryIdx(nextIdx);
          setInputVal(history[nextIdx] || '');
        } else {
          setHistoryIdx(-1);
          setInputVal('');
        }
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="w-full flex flex-col text-xs sm:text-sm font-mono text-[#00f0ff] pt-1 px-1 cursor-text"
    >
      {/* Command history output if any commands were executed */}
      {outputLog.length > 0 && (
        <div className="max-h-28 overflow-y-auto mb-1 p-1.5 bg-black/60 border border-[#00f0ff]/30 text-[#00f0ff]/90 space-y-0.5">
          {outputLog.map((log, i) => (
            <div key={i} className="whitespace-pre-wrap leading-tight text-[11px] sm:text-xs">
              {log}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      )}

      {/* Primary C:\BTTFR> Prompt line matching the screenshot! */}
      <div className="flex items-center gap-1.5 select-none font-bold">
        <span className="text-[#00f0ff] crt-glow-cyan">C:\BTTFR&gt;</span>
        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            className="w-full bg-transparent border-none outline-none text-[#00f0ff] font-mono tracking-wider p-0 focus:ring-0 uppercase placeholder-[#00f0ff]/30"
            placeholder=""
          />
          {/* Authentic retro blinking block cursor when empty */}
          {inputVal === '' && (
            <span className="inline-block w-2.5 h-4 bg-[#00f0ff] animate-pulse -ml-px shadow-[0_0_8px_#00f0ff]"></span>
          )}
        </div>
      </div>
    </div>
  );
};
