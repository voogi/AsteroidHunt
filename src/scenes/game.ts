import Phaser from 'phaser';
import { Stars } from '../components/stars';
import { Spaceship } from '../components/spaceship';
import { Asteroids } from '../components/asteroids';
import { Controls } from '../components/controls';
import { Preloader } from '../components/preloader';
import { UserInterface } from '../components/user-interface';

type GameState = 'MainMenu' | 'Playing' | 'GameOver';

export class GameScene extends Phaser.Scene {
  private gameState: GameState = 'MainMenu';
  private stars!: Stars;
  private spaceship!: Spaceship;
  private asteroids!: Asteroids;
  private userInterface!: UserInterface;
  private controls!: Controls;
  private loader!: Preloader;
  public stage: number = 1;
  private baseSpeed: number = 1;
  private stageTimer!: Phaser.Time.TimerEvent;
  private baseStageLength = 10000;
  private maxStageTime = 600000;

  constructor() {
    super('Start');
  }

  preload(): void {
    this.loader = new Preloader(this);
    this.loader.init();
  }

  create(): void {
    this.stars = new Stars(this);
    this.spaceship = new Spaceship(this);
    this.asteroids = new Asteroids(this, this.spaceship);
    this.controls = new Controls(this, this.spaceship);
    this.userInterface = new UserInterface(this);
    this.userInterface.create();

    this.anims.create({
      key: 'bullet_fly',
      frames: this.anims.generateFrameNumbers('bullet', { start: 0, end: 62 }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: 'explosion_anim',
      frames: this.anims.generateFrameNumbers('explosion', {
        start: 0,
        end: 62,
      }),
      frameRate: 30,
      repeat: 0,
    });

    this.physics.add.collider(
      this.asteroids.getGroup(),
      this.spaceship.getBullets(),
      // @ts-ignore
      (
        asteroid: Phaser.Physics.Arcade.Sprite,
        bullet: Phaser.Physics.Arcade.Sprite
      ) => {
        this.asteroids.hitAsteroid(asteroid);
        bullet.destroy();
        this.playExplosion(asteroid.x, asteroid.y);
        this.userInterface.score += 1;
        this.userInterface.updateScoreText();
      }
    );

    this.physics.add.collider(
      this.asteroids.getGroup(),
      this.spaceship.sprite,
      (ship: any, asteroid: any) => {
        this.userInterface.loseLife();
        asteroid.destroy();
      }
    );
  }

  playExplosion(x: number, y: number) {
    const explosion = this.add.sprite(x, y, 'explosion');
    explosion.setScale(3);
    explosion.play('explosion_anim');

    explosion.on('animationcomplete', () => {
      explosion.destroy();
    });
  }

  gameOver() {
    this.gameState = 'GameOver';
    this.asteroids.stopSpawning();
    this.userInterface.gameOver();
    this.stageTimer.remove();
  }

  restartGame() {
    this.stage = 1;
    this.scene.restart();
  }

  startGame() {
    this.gameState = 'Playing';
    this.asteroids.startSpawning();
    this.userInterface.newGame();

    this.stageTimer = this.time.addEvent({
      delay: Math.min(
        this.maxStageTime,
        this.baseStageLength * (1 + 0.1 * this.stage)
      ),
      callback: () => {
        this.stage += 1;
        this.userInterface.updateStageText();
        this.updateStageSettings();
      },
      loop: true,
    });
  }

  private updateStageSettings() {
    const {
      gameSpeed,
      asteroidCount,
      asteroidMobility,
      asteroidSize,
      asteroidHealth,
    } = this.calculateStageSettings();

    this.stars.setSpeed(gameSpeed);
    this.asteroids.updateSettings({
      count: asteroidCount,
      mobility: asteroidMobility,
      size: asteroidSize,
      health: asteroidHealth,
    });
  }

  private calculateStageSettings() {
    const gameSpeed = this.baseSpeed * (1 + 1 * this.stage);
    const asteroidCount = Math.round(8 * (1 + 0.2 * this.stage));
    const asteroidMobility = 1 * (1 + 0.15 * this.stage);
    const asteroidSize = Math.min(5, Math.floor(1 + 0.2 * this.stage));
    const asteroidHealth = Math.min(5, Math.floor(1 + 0.2 * this.stage));
    const cometProbability = Math.min(20, 0.2 * this.stage);
    const powerupProbability = Math.min(30, 0.3 * this.stage);

    return {
      gameSpeed,
      asteroidCount,
      asteroidMobility,
      asteroidSize,
      asteroidHealth,
      cometProbability,
      powerupProbability,
    };
  }

  update(): void {
    if (this.gameState === 'Playing') {
      if (this.stars && this.spaceship) {
        this.stars.update(this.spaceship.getSpeedMultiplier());
        this.spaceship.update();
        this.asteroids.update();
        this.controls.update();
      }
    }
  }
}
