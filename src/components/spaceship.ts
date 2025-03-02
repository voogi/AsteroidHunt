import Phaser from 'phaser';

export class Spaceship {
  private scene: Phaser.Scene;
  sprite: Phaser.Physics.Arcade.Sprite;
  public isShooting = false;
  private speedMultiplier: number;
  private joystickX: number;
  private joystickY: number;
  private bullets: Phaser.Physics.Arcade.Group;

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
    this.sprite.setImmovable(true);
    this.sprite.setBounce(0);
    this.speedMultiplier = 1;
    this.joystickX = 0;
    this.joystickY = 0;

    this.bullets = this.scene.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 20, // 🔥 Maximum 20 lövedék egyszerre
    });
  }

  setJoystickInput(x: number, y: number): void {
    this.joystickX = x;
    this.joystickY = y;
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

    this.bullets.children.iterate(
      // @ts-ignore
      (bullet: Phaser.GameObjects.GameObject | null) => {
        // @ts-ignore
        if (bullet && bullet.y < 0) {
          bullet.destroy();
        }
      }
    );
  }

  fireBullet() {
    const bullet = this.bullets.get(this.sprite.x, this.sprite.y - 20);
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.setVelocityY(-300);
      bullet.play('bullet_fly');
    }
  }

  getBullets() {
    return this.bullets;
  }

  getSpeedMultiplier(): number {
    return this.speedMultiplier;
  }
}
