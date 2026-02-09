import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Layers, Download, Image as ImageIcon, Type, Trash2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RightLayerPanelProps {
  onExport: () => void;
  isExporting: boolean;
}

export const RightLayerPanel: React.FC<RightLayerPanelProps> = ({ onExport, isExporting }) => {
  const { texts, selectText, selectedTextId, removeText, originalImage, processedImage, reset } = useAppStore();

  return (
    <div className="w-72 h-full bg-white border-l border-gray-200 flex flex-col shadow-2xl z-20">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          Layer Management
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Top Layer: Person */}
        {processedImage && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 opacity-80 cursor-not-allowed">
            <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
              <img src={processedImage} className="w-full h-full object-cover" alt="Cutout" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Subject</p>
              <p className="text-xs text-gray-500">Top (Auto)</p>
            </div>
          </div>
        )}

        {/* Middle Layers: Text */}
        {texts.slice().reverse().map((text, index) => (
          <div
            key={text.id}
            onClick={() => selectText(text.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all group ${
              selectedTextId === text.id
                ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary'
                : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
              <Type className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {text.content || 'Empty Text'}
              </p>
              <p className="text-xs text-gray-500">Text Layer {texts.length - index}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeText(text.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Bottom Layer: Original */}
        {originalImage && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 opacity-80">
            <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
              <img src={originalImage} className="w-full h-full object-cover" alt="Original" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Background</p>
              <p className="text-xs text-gray-500">Bottom (Locked)</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-100 space-y-4 bg-gray-50/50">
        <Button 
          onClick={onExport} 
          isLoading={isExporting} 
          className="w-full h-12 text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Download className="w-5 h-5 mr-2" />
          Export Poster
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all content?')) {
              reset();
            }
          }}
          className="w-full text-gray-500 hover:text-red-500 hover:bg-red-50"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Start Over
        </Button>
      </div>
    </div>
  );
};
