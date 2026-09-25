import React, { useRef } from 'react';
import { ScreenshotItem } from '../types';
import { sound } from '../utils/audio';

interface ScreenshotAttachmentPickerProps {
  themeColor: '#ff441f' | '#ffd000';
  screenshots: ScreenshotItem[];
  onChange: (updated: ScreenshotItem[]) => void;
}

export const ScreenshotAttachmentPicker: React.FC<ScreenshotAttachmentPickerProps> = ({
  themeColor,
  screenshots,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload handler (converts file to data URL safely)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: ScreenshotItem[] = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        processed++;
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          newItems.push({
            id: `usr-ss-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            url: dataUrl,
            title: file.name.toUpperCase().replace(/\.[^/.]+$/, ''),
            caption: `User attached image (${(file.size / 1024).toFixed(1)} KB)`,
            location: 'Terminal Screen Buffer',
          });
        }
        processed++;
        if (processed === files.length && newItems.length > 0) {
          onChange([...screenshots, ...newItems]);
          sound.playDriveWrite();
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    sound.playKeyClick();
    onChange(screenshots.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-2 border border-dashed p-2.5 bg-black/60" style={{ borderColor: themeColor }}>
      <div className="flex items-center justify-between">
        <label className="block font-bold tracking-wider text-xs uppercase" style={{ color: themeColor }}>
          ATTACH SCREENSHOT [{screenshots.length}]
        </label>
        <span className="text-[10px] text-[#00f0ff]/70 font-mono">
          SUPPORTED: PNG, JPG, GIF, WEBP
        </span>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Upload button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            sound.playKeyClick();
            fileInputRef.current?.click();
          }}
          className="px-3 py-1.5 text-xs font-bold border border-[#00f0ff] bg-[#00f0ff]/15 hover:bg-[#00f0ff]/30 text-[#00f0ff] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>[+] UPLOAD SCREENSHOT FROM DISK...</span>
        </button>
      </div>

      {/* Thumbnails of attached screenshots */}
      {screenshots.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {screenshots.map((item, index) => (
            <div
              key={item.id}
              className="relative group border border-[#00f0ff]/40 bg-black/80 p-1 flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black mb-1">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 bg-black/80 px-1 border border-[#00f0ff]/50 text-[9px] text-[#00f0ff] font-mono">
                  #{index + 1}
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#00f0ff] font-mono">
                <span className="truncate max-w-[85px] text-white" title={item.title}>
                  {item.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="text-[#ff441f] hover:text-white px-1 border border-[#ff441f]/40 hover:bg-[#ff441f]/30 cursor-pointer text-[10px]"
                  title="Remove capture"
                >
                  DEL
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-2 border border-dashed border-[#00f0ff]/20 text-center text-[11px] text-[#00f0ff]/50 font-mono">
          [OPTIONAL: NO SCREENSHOT ATTACHED]
        </div>
      )}
    </div>
  );
};
