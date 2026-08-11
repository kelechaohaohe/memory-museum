import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useMemoryStore } from '../store/useMemoryStore';

export function useHoverGlow(id, baseEmissive = '#000000', glowColor = '#ffffff') {
  const materialRef = useRef();
  const setHoveredObject = useMemoryStore((s) => s.setHoveredObject);
  const hoveredObject = useMemoryStore((s) => s.hoveredObject);
  const activeMemory = useMemoryStore((s) => s.activeMemory);

  const isHovered = hoveredObject === id && !activeMemory;

  useFrame(() => {
    if (!materialRef.current) return;
    const target = isHovered ? 0.5 : 0;
    materialRef.current.emissiveIntensity +=
      (target - materialRef.current.emissiveIntensity) * 0.1;
  });

  const handlers = {
    onPointerOver: (e) => {
      e.stopPropagation();
      if (!activeMemory) {
        document.body.style.cursor = 'pointer';
        setHoveredObject(id);
      }
    },
    onPointerOut: (e) => {
      e.stopPropagation();
      document.body.style.cursor = 'auto';
      setHoveredObject(null);
    },
  };

  return { materialRef, handlers, isHovered, glowColor, baseEmissive };
}