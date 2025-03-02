import Phaser from 'phaser';
import { Stars } from '../components/stars';
import { Spaceship } from '../components/spaceship';
import { Asteroids } from '../components/asteroids';
import { Controls } from '../components/controls';

type GameState = 'MainMenu' | 'Playing' | 'GameOver';

export class GameScene extends Phaser.Scene {
  private gameState: GameState = 'MainMenu';
  private stars!: Stars;
  private spaceship!: Spaceship;
  private asteroids!: Asteroids;
  private controls!: Controls;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private lives: number = 3;
  private hearts: Phaser.GameObjects.Image[] = [];

  constructor() {
    super('Start');
  }

  preload(): void {
    this.load.spritesheet('spaceship', './Lightning.png', {
      frameWidth: 32,
      frameHeight: 32,
      spacing: 0,
    });
    this.load.spritesheet('bullet', './bullet_2_12x20.png', {
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

  create(): void {
    this.stars = new Stars(this);
    this.spaceship = new Spaceship(this);
    this.asteroids = new Asteroids(this);
    this.controls = new Controls(this, this.spaceship);

    const startButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'Start', {
        fontSize: '30px',
        color: '#ffffff',
        backgroundColor: '#333',
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    startButton.on('pointerdown', () => {
      startButton.destroy();
      this.startGame();
    });

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

    this.scoreText = this.add
      .text(this.scale.width - 10, 10, 'Points: 0', {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'Arial',
        align: 'right',
      })
      .setOrigin(1, 0);

    for (let i = 0; i < this.lives; i++) {
      const heart = this.add.image(10 + i * 20, 18, 'heart');
      heart.setScale(0.5);
      heart.setOrigin(0, 0);
      this.hearts.push(heart);
    }

    this.physics.add.collider(
      this.asteroids.getGroup(),
      this.spaceship.getBullets(),
      (asteroid: any, bullet: any) => {
        this.playExplosion(asteroid.x, asteroid.y);
        this.score += 1;
        this.updateScoreText();
        asteroid.destroy();
        bullet.destroy();
      }
    );

    this.physics.add.collider(
      this.asteroids.getGroup(),
      this.spaceship.sprite,
      (ship: any, asteroid: any) => {
        this.loseLife();
        asteroid.destroy();
      }
    );
  }

  updateScoreText() {
    this.scoreText.setText(`Points: ${this.score}`);
  }

  playExplosion(x: number, y: number) {
    const explosion = this.add.sprite(x, y, 'explosion');
    explosion.play('explosion_anim');

    explosion.on('animationcomplete', () => {
      explosion.destroy();
    });
  }

  loseLife() {
    if (this.lives > 0) {
      this.lives -= 1; // 🔥 Életek csökkentése

      const lastHeart = this.hearts.pop();
      if (lastHeart) {
        lastHeart.destroy(); // 🔥 Szív eltüntetése
      }

      if (this.lives === 0) {
        this.gameOver();
      }
    }
  }

  gameOver() {
    this.gameState = 'GameOver';
    this.asteroids.stopSpawning();

    const gameOverText = this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 50, 'GAME OVER', {
        fontSize: '40px',
        color: '#ff0000',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    const restartButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 30, 'Restart', {
        fontSize: '30px',
        color: '#ffffff',
        backgroundColor: '#333',
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    restartButton.on('pointerdown', () => {
      restartButton.destroy();
      gameOverText.destroy();
      this.restartGame();
    });
  }

  restartGame() {
    this.scene.restart();
  }

  startGame() {
    this.gameState = 'Playing';
    this.lives = 3;
    this.score = 0;
    this.updateScoreText();
    this.asteroids.startSpawning();

    this.hearts.forEach((heart) => heart.destroy());
    this.hearts = [];
    for (let i = 0; i < this.lives; i++) {
      const heart = this.add
        .image(10 + i * 20, 18, 'heart')
        .setScale(0.5)
        .setOrigin(0, 0);
      this.hearts.push(heart);
    }
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
