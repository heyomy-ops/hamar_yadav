import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Minus, Plus, RotateCcw } from 'lucide-react';

const Canvas = ({ children }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Zoom constraints
  const minScale = 0.4;
  const maxScale = 2.0;

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const newScale = scale - e.deltaY * 0.001;
      setScale(Math.min(Math.max(newScale, minScale), maxScale));
    }
  };

  // Add non-passive wheel listener to prevent browser zoom
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [scale]);

  const zoomIn = () => setScale(Math.min(scale + 0.2, maxScale));
  const zoomOut = () => setScale(Math.max(scale - 0.2, minScale));
  const resetView = () => {
    setScale(1);
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-notebook-gray">
      {/* Dot Grid Background */}
      <div 
        className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none"
        style={{
          transform: `scale(${scale}) translate(${x.get()}px, ${y.get()}px)`,
          transformOrigin: '0 0' 
        }}
      />

      {/* Infinite Canvas */}
      <motion.div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        drag
        dragMomentum={false}
        style={{ x, y }}
      >
        <motion.div
          className="w-full h-full flex items-center justify-center origin-center"
          style={{ scale }}
        >
          {children}
        </motion.div>
      </motion.div>

      {/* Floating Toolbar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-full glass-panel z-50">
        <button onClick={zoomOut} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <Minus size={20} className="text-gray-600" />
        </button>
        <span className="text-xs font-medium text-gray-500 w-12 text-center">
          {Math.round(scale * 100)}%
        </span>
        <button onClick={zoomIn} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <Plus size={20} className="text-gray-600" />
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <button onClick={resetView} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <RotateCcw size={18} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default Canvas;
