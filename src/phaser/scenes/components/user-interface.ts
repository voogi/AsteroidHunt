import Phaser from 'phaser';
import { GameScene } from '../../../../../../../../../WebstormProjects/AsteroidHunt/src/scenes/game';

export class UserInterface {
  private scene: GameScene;
  private scoreText!: Phaser.GameObjects.Text;
  private stageText!: Phaser.GameObjects.Text;
  public score = 0;
  private lives: number = 3;
  private hearts: Phaser.GameObjects.Image[] = [];

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  create() {
    const startButton = this.scene.add
      .text(this.scene.scale.width / 2, this.scene.scale.height / 2, 'Start', {
        fontSize: '30px',
        color: '#ffffff',
        backgroundColor: '#333',
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    startButton.on('pointerdown', () => {
      startButton.destroy();
      this.scene.startGame();
    });

    this.scoreText = this.scene.add
      .text(this.scene.scale.width - 10, 10, 'Points: 0', {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'Arial',
        align: 'right',
      })
      .setOrigin(1, 0);

    this.stageText = this.scene.add
      .text(10, 40, `Stage: ${this.scene.stage}`, {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'Arial',
      })
      .setOrigin(0, 0);

    for (let i = 0; i < this.lives; i++) {
      const heart = this.scene.add.image(10 + i * 20, 18, 'heart');
      heart.setScale(0.5);
      heart.setOrigin(0, 0);
      this.hearts.push(heart);
    }
  }

  updateScoreText() {
    this.scoreText.setText(`Points: ${this.score}`);
  }

  updateStageText() {
    this.stageText.setText(`Stage: ${this.scene.stage}`);
  }

  loseLife() {
    if (this.lives > 0) {
      this.lives -= 1;

      const lastHeart = this.hearts.pop();
      if (lastHeart) {
        lastHeart.destroy(); // 🔥 Szív eltüntetése
      }

      if (this.lives === 0) {
        this.scene.gameOver();
      }
    }
  }

  newGame() {
    this.lives = 3;
    this.score = 0;
    this.updateScoreText();
    this.hearts.forEach((heart) => heart.destroy());
    this.hearts = [];

    for (let i = 0; i < this.lives; i++) {
      const heart = this.scene.add
        .image(10 + i * 20, 18, 'heart')
        .setScale(0.5)
        .setOrigin(0, 0);
      this.hearts.push(heart);
    }
  }

  gameOver() {
    const gameOverText = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2 - 50,
        'GAME OVER',
        {
          fontSize: '40px',
          color: '#ff0000',
          fontFamily: 'Arial',
        }
      )
      .setOrigin(0.5);

    const restartButton = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2 + 30,
        'Restart',
        {
          fontSize: '30px',
          color: '#ffffff',
          backgroundColor: '#333',
          padding: { x: 20, y: 10 },
        }
      )
      .setOrigin(0.5)
      .setInteractive();

    restartButton.on('pointerdown', () => {
      restartButton.destroy();
      gameOverText.destroy();
      this.scene.restartGame();
    });
  }
}
