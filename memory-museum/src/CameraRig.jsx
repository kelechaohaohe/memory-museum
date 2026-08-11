import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useMemoryStore } from '../src/stores/useMemoryStore';
import { MEMORY_CONFIG } from '../src/libs/memoryConfig';

const DESK_VIEW = { position: [0, 2.6, 4.2], lookAt: [0, 0.7, 0] };

export default function CameraRig() {
  const { camera } = useThree();
  const activeMemory = useMemoryStore((s) => s.activeMemory);
  const finishTransition = useMemoryStore((s) => s.finishTransition);
  const introComplete = useMemoryStore((s) => s.introComplete);

  const lookAtTarget = useRef({ x: 0, y: 0.7, z: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  useEffect(() => {
    if (!introComplete) return;

    const target = activeMemory
      ? memoryConfig[activeMemory].cameraTarget
      : DESK_VIEW;

    const tl = gsap.timeline({
      onComplete: () => finishTransition(),
    });

    tl.to(camera.position, {
      x: target.position[0],
      y: target.position[1],
      z: target.position[2],
      duration: 1.4,
      ease: 'power3.inOut',
    }, 0);

    tl.to(lookAtTarget.current, {
      x: target.lookAt[0],
      y: target.lookAt[1],
      z: target.lookAt[2],
      duration: 1.4,
      ease: 'power3.inOut',
      onUpdate: () => camera.lookAt(lookAtTarget.current.x, lookAtTarget.current.y, lookAtTarget.current.z),
    }, 0);
  }, [activeMemory, introComplete]);

  useFrame(() => {
    if (activeMemory || !introComplete) return;
    const targetX = DESK_VIEW.position[0] + mouse.current.x * 0.25;
    const targetY = DESK_VIEW.position[1] + mouse.current.y * 0.12;
    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (targetY - camera.position.y) * 0.03;
    camera.lookAt(DESK_VIEW.lookAt[0], DESK_VIEW.lookAt[1], DESK_VIEW.lookAt[2]);
  });

  return null;
}