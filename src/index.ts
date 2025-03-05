import Phaser from 'phaser';
import { config } from './phaser/config';
import { GameScene } from './game/scenes/game';

new Phaser.Game(
  Object.assign(config, {
    scene: [GameScene],
  })
);
