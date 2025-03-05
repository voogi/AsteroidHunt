export class LoaderScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'loader',
      active: false,
      visible: false,
    });
  }

  preload() {
    this.load.spritesheet('spaceship', './Lightning.png', {
      frameWidth: 32,
      frameHeight: 32,
      spacing: 0,
    });
    this.load.spritesheet('bullet', './Bullet_2_12x20.png', {
      frameWidth: 12,
      frameHeight: 20,
    });
    this.load.spritesheet('explosion', './exp2.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image('asteroid', './asteroid.png');
    this.load.image('heart', './heart.png');
  }

  create() {
    this.scene.start('game');
  }
}
