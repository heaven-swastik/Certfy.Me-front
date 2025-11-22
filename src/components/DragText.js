import React, { useState, useEffect, useRef } from 'react';

const DragText = ({ containerRef, onPositionChange, textStyles, fontFamily }) => {
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);

  // Initialize position to the middle of the container on mount
  useEffect(() => {
    if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const initialX = width / 2;
        const initialY = height / 2;
        setPosition({ x: initialX, y: initialY });
        onPositionChange(initialX, initialY);
    }
  }, [containerRef.current]);


  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const container = containerRef.current.getBoundingClientRect();
      
      let newX = e.clientX - container.left;
      let newY = e.clientY - container.top;

      // Constrain movement within the image boundary
      newX = Math.max(0, Math.min(newX, container.width));
      newY = Math.max(0, Math.min(newY, container.height));

      setPosition({ x: newX, y: newY });
      onPositionChange(newX, newY);
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, containerRef, onPositionChange]);

  // Styling for the sophisticated light theme
  const guideClass = isDragging 
    ? 'opacity-100 border-blue-600 border-2 bg-blue-100/50' 
    : 'opacity-0 group-hover:opacity-75 border-gray-400 border-2';

  return (
    <div
      ref={dragRef}
      onMouseDown={handleMouseDown}
      style={{
        left: position.x,
        top: position.y,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 50,
      }}
      className="group"
    >
      <div 
        style={{
            fontFamily: fontFamily,
            fontSize: `${textStyles.fontSize}px`,
            color: textStyles.color,
            whiteSpace: 'nowrap',
            userSelect: 'none',
            fontWeight: 'bold', // Sample text is bold for visibility
            // Crucial for vertical alignment match with backend SVG
            lineHeight: 1 
        }}
      >
        [Sample Name Preview]
      </div>

      {/* Dragging Guides (Light Theme Style) */}
      <div className={`absolute inset-0 -m-3 border-dashed rounded-lg transition-opacity pointer-events-none ${guideClass}`}>
          {/* Position Tag */}
          {(isDragging || true) && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                  X:{Math.round(position.x)} Y:{Math.round(position.y)}
              </div>
          )}
      </div>
    </div>
  );
};

export default DragText;