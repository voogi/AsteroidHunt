import Phaser from 'phaser';

export class Spaceship {
  private scene: Phaser.Scene;
  sprite: Phaser.Physics.Arcade.Sprite;
  private speedMultiplier: number;
  private joystickX: number;
  private joystickY: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.sprite = this.scene.physics.add
      .sprite(
        this.scene.scale.width / 2,
        this.scene.scale.height - 100,
        'spaceship'
      )
      .setOrigin(0.5, 0.5);

    this.sprite.setCollideWorldBounds(true);
    this.speedMultiplier = 1;
    this.joystickX = 0;
    this.joystickY = 0;
  }

  setJoystickInput(x: number, y: number): void {
    this.sprite.setVelocity(x, y);
  }

  moveToCenter(): void {
    const centerX = this.scene.scale.width / 2;

    this.scene.tweens.add({
      targets: this.sprite,
      x: centerX,
      duration: 300,
      ease: 'Power2',
    });
  }

  update(): void {
    this.sprite.setVelocityX(this.joystickX * 200);

    if (this.joystickY < -0.5) {
      this.speedMultiplier = 2; // Ha felfelé nyomják, gyorsulás
    } else {
      this.speedMultiplier = 1;
    }
  }

  getSpeedMultiplier(): number {
    return this.speedMultiplier;
  }
}
