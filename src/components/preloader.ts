import Phaser from 'phaser';

export class Preloader {
  private scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.init();
  }

  init() {
    this.scene.load.spritesheet('spaceship', './Lightning.png', {
      frameWidth: 32,
      frameHeight: 32,
      spacing: 0,
    });
    this.scene.load.spritesheet('bullet', './Bullet_2_12x20.png', {
      frameWidth: 12,
      frameHeight: 20,
    });
    this.scene.load.spritesheet('explosion', './exp2.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.scene.load.image('asteroid', './asteroid.png');
    this.scene.load.image('heart', './heart.png');
  }
}
