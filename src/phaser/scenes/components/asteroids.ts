import Phaser from 'phaser';
import { Spaceship } from './spaceship';

interface AsteroidConfig {
  size: number;
  health: number;
  x: number;
  y: number;
}

interface AsteroidSettings {
  count: number;
  mobility: number;
  size: number;
  health: number;
}

export class Asteroids {
  private scene: Phaser.Scene;
  private ship: Spaceship;
  private asteroids: Phaser.Physics.Arcade.Group;
  private stage: number;
  private timeEvent: Phaser.Time.TimerEvent | null = null;
  private settings: AsteroidSettings = {
    count: 8,
    mobility: 1,
    size: 1,
    health: 1,
  };

  constructor(scene: Phaser.Scene, ship: Spaceship, stage: number = 1) {
    this.scene = scene;
    this.ship = ship;
    this.asteroids = this.scene.physics.add.group();
    this.stage = stage;
  }

  updateSettings(newSettings: AsteroidSettings) {
    this.settings = newSettings;
  }

  private spawnAsteroid(config: AsteroidConfig) {
    const speed = Phaser.Math.Between(50, 200) * this.settings.mobility;
    console.log('speed', speed);
    const rotationSpeed =
      Phaser.Math.FloatBetween(-1, 1) * this.settings.mobility;

    const asteroid = this.asteroids.create(
      config.x,
      config.y,
      'asteroid'
    ) as Phaser.Physics.Arcade.Sprite;
    asteroid.setImmovable(true);
    asteroid.setVelocityY(speed);
    asteroid.setRotation(rotationSpeed);
    asteroid.setScale(config.size * 0.5);
    asteroid.setData('size', config.size);
    asteroid.setData('health', config.health);
    asteroid.setCollideWorldBounds(false);
    return asteroid;
  }

  startSpawning() {
    if (this.timeEvent) {
      this.timeEvent.remove();
    }

    const spawnInterval = Math.max(500, 1000 / this.settings.count);

    this.timeEvent = this.scene.time.addEvent({
      delay: spawnInterval,
      callback: () => {
        const size = Phaser.Math.Clamp(this.settings.size, 1, 5);
        const health = Phaser.Math.Clamp(this.settings.health, 1, 5);
        const x = Phaser.Math.Between(0, this.scene.scale.width);
        this.spawnAsteroid({ size, health, x, y: 0 });
      },
      callbackScope: this,
      loop: true,
    });
  }

  stopSpawning() {
    if (this.timeEvent) {
      this.timeEvent.remove();
      this.timeEvent = null;
    }
  }

  private splitAsteroid(asteroid: Phaser.Physics.Arcade.Sprite) {
    const size = asteroid.getData('size');

    if (size > 1) {
      for (let i = 0; i < size; i++) {
        const x = Phaser.Math.Between(asteroid.x - 10, asteroid.x + 10);
        const y = Phaser.Math.Between(asteroid.y - 10, asteroid.y + 10);
        this.spawnAsteroid({ size: 1, health: 1, x, y });
      }
    }
  }

  update() {
    // @ts-ignore
    this.asteroids.children.iterate((asteroid: any) => {
      if (
        asteroid &&
        (asteroid as Phaser.Physics.Arcade.Sprite).y > this.scene.scale.height
      ) {
        (asteroid as Phaser.Physics.Arcade.Sprite).destroy();
      }
    });
  }

  hitAsteroid(asteroid: Phaser.Physics.Arcade.Sprite) {
    const health = asteroid.getData('health') - this.ship.damage;
    if (health <= 0) {
      this.splitAsteroid(asteroid);
      asteroid.destroy();
    } else {
      asteroid.setData('health', health);
    }
  }

  getGroup() {
    return this.asteroids;
  }
}
