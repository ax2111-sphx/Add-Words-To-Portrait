import React, { useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { TextLayerItem } from './TextLayerItem';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LayerCanvasProps {
  exportRef: React.RefObject<HTMLDivElement>;
}

export const LayerCanvas: React.FC<LayerCanvasProps> = ({ exportRef }) => {
  const { originalImage, processedImage, texts, reset, selectText } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);

  if (!originalImage) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 overflow-hidden">
      {/* Canvas Container */}
      <div 
        ref={exportRef}
        className="relative shadow-2xl ring-4 ring-white/50 rounded-sm overflow-hidden bg-white select-none transition-transform duration-300"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
        onClick={() => selectText(null)} // Deselect text when clicking background
      >
        {/* Layer 1: Original Background */}
        <img 
          src={originalImage} 
          alt="Original Background" 
          className="block max-w-full max-h-[80vh] object-contain relative z-10"
          onLoad={(e) => {
            // Optional: Adjust container size if needed, but img handles it naturally
          }}
        />

        {/* Layer 2: Text Layers */}
        <div className="absolute inset-0 z-20 overflow-hidden" ref={containerRef}>
          {texts.map((layer) => (
            <TextLayerItem 
              key={layer.id} 
              layer={layer} 
              containerRef={containerRef} 
            />
          ))}
        </div>

        {/* Layer 3: Processed Foreground (Person) */}
        {processedImage && (
          <img 
            src={processedImage} 
            alt="Foreground Person" 
            className="absolute inset-0 w-full h-full object-contain z-30 pointer-events-none"
          />
        )}
      </div>
    </div>
  );
};
