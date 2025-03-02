import Phaser from 'phaser';

export class Asteroids {
  private scene: Phaser.Scene;
  private readonly asteroids: Phaser.Physics.Arcade.Group;
  private spawnEvent: Phaser.Time.TimerEvent | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.asteroids = this.scene.physics.add.group();
  }

  startSpawning() {
    if (this.spawnEvent) {
      this.spawnEvent.remove(); // 🔥 Ha már fut, először töröljük
    }

    this.spawnEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: this.spawnAsteroid,
      callbackScope: this,
      loop: true,
    });
  }

  stopSpawning() {
    if (this.spawnEvent) {
      this.spawnEvent.remove();
      this.spawnEvent = null;
    }
  }

  private spawnAsteroid() {
    const x = Phaser.Math.Between(0, this.scene.scale.width);
    const speed = Phaser.Math.Between(100, 300);

    const asteroid = this.asteroids.create(x, 0, 'asteroid');
    asteroid.setVelocityY(speed);
    asteroid.setScale(Phaser.Math.FloatBetween(0.5, 1.5));
    asteroid.setAngle(Phaser.Math.Between(0, 360));
    asteroid.setCollideWorldBounds(false);
  }

  update() {
    this.asteroids.children.iterate(
      // @ts-ignore
      (asteroid: Phaser.GameObjects.GameObject | null) => {
        // @ts-ignore
        if (asteroid && asteroid.y > this.scene.scale.height) {
          asteroid.destroy();
        }
      }
    );
  }

  getGroup() {
    return this.asteroids;
  }
}
