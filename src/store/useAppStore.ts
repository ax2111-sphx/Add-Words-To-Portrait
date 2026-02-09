import { create } from 'zustand';

export interface TextLayer {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  letterSpacing: number; // in em
  lineHeight: number; // unitless multiplier
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  rotation: number; // degrees
  textShadow: number; // shadow blur radius
}

interface AppState {
  originalImage: string | null;
  processedImage: string | null; // The person cut-out with transparent background
  texts: TextLayer[];
  selectedTextId: string | null;
  isUploading: boolean;
  isProcessing: boolean;

  setOriginalImage: (url: string | null) => void;
  setProcessedImage: (url: string | null) => void;
  setIsUploading: (isUploading: boolean) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  
  addText: () => void;
  updateText: (id: string, updates: Partial<TextLayer>) => void;
  removeText: (id: string) => void;
  selectText: (id: string | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  originalImage: null,
  processedImage: null,
  texts: [],
  selectedTextId: null,
  isUploading: false,
  isProcessing: false,

  setOriginalImage: (url) => set({ originalImage: url }),
  setProcessedImage: (url) => set({ processedImage: url }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),

  addText: () => set((state) => {
    const newText: TextLayer = {
      id: crypto.randomUUID(),
      content: 'Double click to edit',
      x: 50, // Percentage or pixels? Let's assume percentage for responsiveness or pixels relative to container. Let's use percentage (0-100) to be safe across sizes, or just pixels. Let's start with center-ish.
      y: 50,
      fontSize: 24,
      color: '#ffffff',
      fontFamily: 'Noto Sans SC',
      letterSpacing: 0,
      lineHeight: 1.2,
      fontWeight: 'normal',
      fontStyle: 'normal',
      rotation: 0,
      textShadow: 0,
    };
    return { 
      texts: [...state.texts, newText],
      selectedTextId: newText.id
    };
  }),

  updateText: (id, updates) => set((state) => ({
    texts: state.texts.map((t) => (t.id === id ? { ...t, ...updates } : t)),
  })),

  removeText: (id) => set((state) => ({
    texts: state.texts.filter((t) => t.id !== id),
    selectedTextId: state.selectedTextId === id ? null : state.selectedTextId,
  })),

  selectText: (id) => set({ selectedTextId: id }),

  reset: () => set({
    originalImage: null,
    processedImage: null,
    texts: [],
    selectedTextId: null,
    isUploading: false,
    isProcessing: false,
  }),
}));
