import React from 'react';
import { Layers } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
          <Layers className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">PosterLayer AI</h1>
      </div>
    </header>
  );
};
