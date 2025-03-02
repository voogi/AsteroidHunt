import Phaser from 'phaser';
import { Stars } from '../components/stars';
import { Spaceship } from '../components/spaceship';

export class GameScene extends Phaser.Scene {
  private stars!: Stars;
  private spaceship!: Spaceship;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: any;
  private isShooting = false;
  private isTouching = false;

  constructor() {
    super('Start');
  }

  fireBullet(x: number, y: number) {
    const bullet = this.physics.add.sprite(x, y, 'bullet');
    bullet.play('bullet_fly');
    bullet.setVelocityY(-300);
  }

  preload(): void {
    this.load.spritesheet('spaceship', './Lightning.png', {
      frameWidth: 32,
      frameHeight: 32,
      spacing: 0,
    });

    this.load.spritesheet('bullet', 'assets/bullet_2_12x20.png', {
      frameWidth: 12,
      frameHeight: 20,
    });
  }

  create(): void {
    this.stars = new Stars(this);
    this.spaceship = new Spaceship(this);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys('W,A,S,D');

    this.anims.create({
      key: 'bullet_fly',
      frames: this.anims.generateFrameNumbers('bullet', { start: 0, end: 62 }),
      frameRate: 20,
      repeat: -1,
    });

    let startX = 0;
    let startY = 0;
    const maxSpeed = 1;
    const speedMultiplier = 0.04;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.fireBullet(this.spaceship.sprite.x, this.spaceship.sprite.y - 20);
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      startX = pointer.x;
      startY = pointer.y;
      this.isTouching = true;
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isTouching) {
        const deltaX = pointer.x - startX;
        const deltaY = pointer.y - startY;

        const speedX = Phaser.Math.Clamp(
          deltaX * speedMultiplier,
          -maxSpeed,
          maxSpeed
        );
        const speedY = Phaser.Math.Clamp(
          deltaY * speedMultiplier,
          -maxSpeed,
          maxSpeed
        );

        this.spaceship.setJoystickInput(speedX, speedY);
      }
    });

    this.input.on('pointerup', () => {
      this.isTouching = false;
      this.spaceship.setJoystickInput(0, 0);
      this.spaceship.moveToCenter();
    });
  }

  update(): void {
    if (this.stars && this.spaceship) {
      this.stars.update(this.spaceship.getSpeedMultiplier());
      this.spaceship.update();

      let speedX = 0;
      let speedY = 0;
      const speed = 1;

      if (this.isTouching) {
        return;
      }

      if (this.cursors.left.isDown || this.wasd.A.isDown) {
        speedX = -speed;
      } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
        speedX = speed;
      }

      if (this.cursors.space.isDown && !this.isShooting) {
        this.fireBullet(this.spaceship.sprite.x, this.spaceship.sprite.y - 20);
        this.isShooting = true; // 🔥 Flag beállítása, hogy lő
      }

      // 🔥 Flag visszaállítása, ha felengedték a gombot
      if (Phaser.Input.Keyboard.JustUp(this.cursors.space)) {
        this.isShooting = false;
      }

      this.spaceship.setJoystickInput(speedX, speedY);
    }
  }
}
