import React, { useCallback, useEffect } from 'react';

import { EventBus } from '@/phaser/EventBus';
import { GameEvent } from '@/phaser/events';
import { GameScene } from '@/phaser/scenes';

export function useGameEvents(
  eventRef: React.RefObject<HTMLDivElement | null>
) {
  const handleGameSceneReady = useCallback(
    (scene: GameScene) => {
      eventRef.current?.dispatchEvent(
        new CustomEvent(GameEvent.GAME_SCENE_READY, { detail: scene })
      );
    },
    [eventRef]
  );

  useEffect(() => {
    EventBus.on(GameEvent.GAME_SCENE_READY, handleGameSceneReady);

    return () => {
      EventBus.removeListener(GameEvent.GAME_SCENE_READY, handleGameSceneReady);
    };
  }, [handleGameSceneReady]);
}
