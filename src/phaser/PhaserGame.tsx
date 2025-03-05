import { useGameEvents } from '@/hooks/useGameEvents';
import { usePhaserGame } from '@/hooks/usePhaserGame';

import { config } from './config';
import React from 'react';

export interface GameRendererProps {
  eventRef: React.RefObject<HTMLDivElement | null>;
}

export default function PhaserGame({ eventRef }: GameRendererProps) {
  const parent = 'phaser-container';

  useGameEvents(eventRef);
  usePhaserGame({ ...config, parent });

  return <div id={parent} />;
}
