import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { FONT_OPTIONS } from '@/constants/fonts';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { Type, Trash2, AlignLeft, Bold, Italic, RotateCw, Layers } from 'lucide-react';

export const LeftToolPanel: React.FC = () => {
  const { texts, selectedTextId, updateText, removeText, addText } = useAppStore();
  const selectedText = texts.find(t => t.id === selectedTextId);

  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col shadow-2xl z-20">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Type className="w-5 h-5 text-primary" />
          文字工具
        </h2>
        <p className="text-xs text-muted-foreground mt-1">添加并修饰您的海报文字</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Action Button */}
        <Button onClick={addText} className="w-full py-6 text-lg font-medium shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all bg-primary hover:bg-primary-hover">
          <span className="text-2xl mr-2">+</span> 添加文字图层
        </Button>

        {selectedText ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Content Input */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">内容</label>
              <div className="relative">
                <textarea
                  value={selectedText.content}
                  onChange={(e) => updateText(selectedText.id, { content: e.target.value })}
                  className="w-full min-h-[80px] p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all resize-none text-sm"
                  placeholder="输入文字..."
                />
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">字体</label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => updateText(selectedText.id, { fontFamily: font.value })}
                    className={`text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between group ${
                      selectedText.fontFamily === font.value
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary/20'
                        : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span style={{ fontFamily: font.value }} className="text-lg">
                      {font.label}
                    </span>
                    {selectedText.fontFamily === font.value && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Toggles */}
            <div className="flex gap-4">
              <button
                onClick={() => updateText(selectedText.id, { fontWeight: selectedText.fontWeight === 'bold' ? 'normal' : 'bold' })}
                className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                  selectedText.fontWeight === 'bold'
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Bold className="w-4 h-4" /> 粗体
              </button>
              <button
                onClick={() => updateText(selectedText.id, { fontStyle: selectedText.fontStyle === 'italic' ? 'normal' : 'italic' })}
                className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                  selectedText.fontStyle === 'italic'
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Italic className="w-4 h-4" /> 斜体
              </button>
            </div>

            {/* Typography Controls */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex justify-between">
                  大小
                  <span className="text-foreground font-mono">{selectedText.fontSize}px</span>
                </label>
                <Slider
                  min={12}
                  max={200}
                  value={selectedText.fontSize}
                  onChange={(e) => updateText(selectedText.id, { fontSize: Number(e.target.value) })}
                  className="accent-primary"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex justify-between">
                  旋转
                  <span className="text-foreground font-mono">{selectedText.rotation ?? 0}°</span>
                </label>
                <div className="flex items-center gap-3">
                  <RotateCw className="w-4 h-4 text-gray-400" />
                  <Slider
                    min={-180}
                    max={180}
                    value={selectedText.rotation ?? 0}
                    onChange={(e) => updateText(selectedText.id, { rotation: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex justify-between">
                  字间距
                  <span className="text-foreground font-mono">{selectedText.letterSpacing ?? 0}em</span>
                </label>
                <Slider
                  min={-0.1}
                  max={1}
                  step={0.01}
                  value={selectedText.letterSpacing ?? 0}
                  onChange={(e) => updateText(selectedText.id, { letterSpacing: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex justify-between">
                  行高
                  <span className="text-foreground font-mono">{selectedText.lineHeight ?? 1.2}</span>
                </label>
                <Slider
                  min={0.8}
                  max={3}
                  step={0.1}
                  value={selectedText.lineHeight ?? 1.2}
                  onChange={(e) => updateText(selectedText.id, { lineHeight: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex justify-between">
                  阴影深度
                  <span className="text-foreground font-mono">{selectedText.textShadow ?? 0}px</span>
                </label>
                <Slider
                  min={0}
                  max={20}
                  value={selectedText.textShadow ?? 0}
                  onChange={(e) => updateText(selectedText.id, { textShadow: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Color */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">颜色</label>
              <div className="flex gap-3 items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform">
                  <input
                    type="color"
                    value={selectedText.color}
                    onChange={(e) => updateText(selectedText.id, { color: e.target.value })}
                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                  />
                </div>
                <div className="text-xs text-gray-500 font-mono uppercase bg-gray-50 px-2 py-1 rounded border border-gray-100">
                  {selectedText.color}
                </div>
              </div>
            </div>

            {/* Delete */}
            <div className="pt-6 border-t border-gray-100">
              <Button 
                variant="ghost" 
                onClick={() => removeText(selectedText.id)}
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 justify-start h-12"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除当前图层
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-center px-4 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
            <AlignLeft className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">点击画布上的文字<br/>或添加新文字以开始编辑</p>
          </div>
        )}
      </div>
    </div>
  );
};
