import React, { useRef, useEffect } from 'react';
import Moveable from 'react-moveable';
import { TextLayer, useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface TextLayerItemProps {
  layer: TextLayer;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const TextLayerItem: React.FC<TextLayerItemProps> = ({ layer, containerRef }) => {
  const { updateText, selectText, selectedTextId } = useAppStore();
  const targetRef = useRef<HTMLDivElement>(null);
  
  const isSelected = selectedTextId === layer.id;

  // Handle click to select
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectText(layer.id);
  };

  return (
    <>
      <div
        ref={targetRef}
        className={cn(
          "absolute inline-block whitespace-nowrap p-2 cursor-pointer z-20 origin-center select-none",
          isSelected ? "ring-1 ring-primary/50" : "hover:ring-1 hover:ring-gray-300/50"
        )}
        style={{
          fontSize: `${layer.fontSize}px`,
          color: layer.color,
          fontFamily: layer.fontFamily,
          letterSpacing: `${layer.letterSpacing ?? 0}em`,
          lineHeight: layer.lineHeight ?? 1.2,
          fontWeight: layer.fontWeight ?? 'normal',
          fontStyle: layer.fontStyle ?? 'normal',
          textShadow: `0 2px ${layer.textShadow ?? 0}px rgba(0,0,0,0.3)`,
          WebkitTextStroke: '1px rgba(255,255,255,0.3)',
          transform: `translate(${layer.x}px, ${layer.y}px) rotate(${layer.rotation ?? 0}deg)`,
          // We use translate instead of left/top for better performance and compatibility with Moveable
          left: 0,
          top: 0,
        }}
        onClick={handleClick}
      >
        {layer.content}
      </div>

      {isSelected && (
        <Moveable
          target={targetRef}
          container={containerRef.current}
          
          /* Draggable */
          draggable={true}
          throttleDrag={0}
          onDrag={({ beforeTranslate }) => {
            updateText(layer.id, { x: beforeTranslate[0], y: beforeTranslate[1] });
          }}

          /* Rotatable */
          rotatable={true}
          throttleRotate={0}
          rotationPosition={"top"}
          onRotate={({ beforeRotate }) => {
             updateText(layer.id, { rotation: beforeRotate });
          }}

          /* Resizable (Adjust Font Size) */
          resizable={true}
          keepRatio={true}
          throttleResize={0}
          renderDirections={["nw", "ne", "sw", "se"]}
          onResize={({ width, height, drag }) => {
             // drag.beforeTranslate is essential to keep the element in place while resizing from top/left
             // Calculate new font size based on height change ratio
             const currentHeight = targetRef.current?.offsetHeight || 1;
             const scaleFactor = height / currentHeight;
             
             updateText(layer.id, { 
               x: drag.beforeTranslate[0], 
               y: drag.beforeTranslate[1],
               fontSize: Math.max(12, layer.fontSize * scaleFactor)
             });
          }}
        />
      )}
    </>
  );
};
