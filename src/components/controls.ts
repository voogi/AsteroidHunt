import Phaser from 'phaser';
import { Spaceship } from './spaceship';

export class Controls {
  private scene: Phaser.Scene;
  private ship: Spaceship;
  private startX: number = 0;
  private startY: number = 0;
  private maxSpeed: number = 1;
  private speedMultiplier = 0.04;
  public isTouching = false;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: any;
  private pointer1!: Phaser.Input.Pointer; // 🔥 Bal ujj (irányítás)
  private pointer2!: Phaser.Input.Pointer; // 🔥 Jobb ujj (lövés)

  constructor(scene: Phaser.Scene, ship: Spaceship) {
    this.scene = scene;
    this.ship = ship;
    this.start();
  }

  private start() {
    this.cursors = this.scene.input.keyboard!.createCursorKeys();
    this.wasd = this.scene.input.keyboard!.addKeys('W,A,S,D');

    // 🔥 Kezdeti pointerek
    this.pointer1 = this.scene.input.pointer1;
    this.pointer2 = this.scene.input.pointer2;

    // 🔥 Jobb ujj (lövés)
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer === this.pointer2) {
        this.ship.fireBullet();
      }
    });

    // 🔥 Bal ujj (irányítás)
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer === this.pointer1) {
        this.startX = pointer.x;
        this.startY = pointer.y;
        this.isTouching = true;
      }
    });

    // 🔥 Bal ujj mozgás
    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer === this.pointer1 && this.isTouching) {
        const deltaX = pointer.x - this.startX;
        const deltaY = pointer.y - this.startY;

        const speedX = Phaser.Math.Clamp(
          deltaX * this.speedMultiplier,
          -this.maxSpeed,
          this.maxSpeed
        );
        const speedY = Phaser.Math.Clamp(
          deltaY * this.speedMultiplier,
          -this.maxSpeed,
          this.maxSpeed
        );

        this.ship.setJoystickInput(speedX, speedY);
      }
    });

    // 🔥 Bal ujj felengedése (csak ilyenkor reseteljen középre)
    this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (pointer === this.pointer1) {
        this.isTouching = false;
        this.ship.setJoystickInput(0, 0);
        this.ship.moveToCenter(); // 🔥 Csak bal ujj reseteljen középre
      }
    });
  }

  public update() {
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

    if (this.cursors.space.isDown && !this.ship.isShooting) {
      this.ship.fireBullet();
      this.ship.isShooting = true;
    }

    if (Phaser.Input.Keyboard.JustUp(this.cursors.space)) {
      this.ship.isShooting = false;
    }

    this.ship.setJoystickInput(speedX, speedY);
  }
}
