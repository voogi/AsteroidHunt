'use client';

import { useRef } from 'react';

import { GameProvider } from '@/providers/GameProvider';

import { GameCanvas } from './GameCanvas';

export function Game() {
  const eventRef = useRef<HTMLDivElement | null>(null);

  return (
    <GameProvider eventRef={eventRef}>
      <GameCanvas eventRef={eventRef} />
    </GameProvider>
  );
}
