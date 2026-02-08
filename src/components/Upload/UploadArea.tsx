import React, { useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { readFileAsDataURL, removeBackground } from '@/utils/imageProcessor';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface UploadAreaProps {
  className?: string;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ className }) => {
  const { 
    setOriginalImage, 
    setProcessedImage, 
    setIsUploading, 
    setIsProcessing,
    isProcessing 
  } = useAppStore();

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件 (JPG, PNG)');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('图片大小不能超过 10MB');
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await readFileAsDataURL(file);
      setOriginalImage(imageUrl);
      setIsUploading(false);

      // Trigger AI processing
      setIsProcessing(true);
      const processedUrl = await removeBackground(imageUrl);
      setProcessedImage(processedUrl);
      setIsProcessing(false);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setIsProcessing(false);
      alert('上传或处理失败，请重试');
    }
  }, [setOriginalImage, setProcessedImage, setIsUploading, setIsProcessing]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center w-full max-w-lg mx-auto h-[400px] border-2 border-dashed rounded-xl transition-all duration-200 bg-white",
        isProcessing ? "border-primary/50 bg-primary/5" : "border-gray-300 hover:border-primary hover:bg-gray-50",
        className
      )}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {isProcessing ? (
        <div className="flex flex-col items-center gap-4 text-center p-8">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-foreground">正在进行AI抠图...</h3>
            <p className="text-sm text-muted-foreground">智能识别人物主体，马上就好</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 text-center p-8">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <UploadCloud className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-foreground">上传旅行照片</h3>
            <p className="text-sm text-muted-foreground">点击或拖拽上传，支持 JPG/PNG (最大 10MB)</p>
          </div>
          
          <div className="relative">
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={onFileSelect}
            />
            <Button size="lg" className="px-8">
              <ImageIcon className="w-5 h-5 mr-2" />
              选择图片
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
