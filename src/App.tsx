import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/Layout/Header';
import { UploadArea } from '@/components/Upload/UploadArea';
import { LayerCanvas } from '@/components/LayerPreview/LayerCanvas';
import { LeftToolPanel } from '@/components/Panels/LeftToolPanel';
import { RightLayerPanel } from '@/components/Panels/RightLayerPanel';

function App() {
  const { originalImage, selectText } = useAppStore();
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!exportRef.current) return;
    
    try {
      setIsExporting(true);
      // Deselect any text before capturing
      selectText(null);
      
      // Small delay to ensure UI updates (selection border removal)
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(exportRef.current, {
        useCORS: true,
        backgroundColor: null, // Transparent background if any
        scale: 2, // Higher quality
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `poster-layer-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("导出失败，请重试");
    } finally {
      setIsExporting(false);
    }
  };

  if (!originalImage) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex flex-col font-sans text-foreground">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4 pt-20">
          <UploadArea className="shadow-xl border-gray-200 bg-white" />
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#F5F5F0] flex flex-col font-sans text-foreground overflow-hidden">
      <Header />
      
      {/* Main Editor Layout - Added pt-16 to account for fixed header */}
      <main className="flex-1 flex overflow-hidden relative pt-16">
        {/* Left: Tools */}
        <LeftToolPanel />

        {/* Center: Canvas */}
        <div className="flex-1 relative bg-[#F5F5F0] flex items-center justify-center overflow-hidden">
          <LayerCanvas exportRef={exportRef} />
        </div>

        {/* Right: Layers */}
        <RightLayerPanel onExport={handleExport} isExporting={isExporting} />
      </main>
    </div>
  );
}

export default App;
