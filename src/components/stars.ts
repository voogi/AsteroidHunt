import Phaser from 'phaser';

interface Star {
    x: number;
    y: number;
    size: number;
    color: number;
    speed: number;
}

export class Stars {
    private scene: Phaser.Scene;
    private stars: Star[] = [];
    private texture!: Phaser.GameObjects.RenderTexture;
    private starGraphics!: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.create();
    }

    private create() {
        this.texture = this.scene.add.renderTexture(0, 0, this.scene.scale.width, this.scene.scale.height).setOrigin(0, 0);
        this.starGraphics = this.scene.add.graphics();
        for (let i = 0; i < 100; i++) {
            this.stars.push(this.createStar());
        }
    }

    private createStar(): Star {
        const x = Phaser.Math.Between(0, this.scene.scale.width);
        const y = Phaser.Math.Between(0, this.scene.scale.height);

        const size = Phaser.Math.FloatBetween(1, 2);

        const colors = [0xffffff, 0xffd700, 0xadd8e6];
        const color = Phaser.Math.RND.pick(colors);

        return { x, y, size, color, speed: size * 0.5 };
    }

    update(speedMultiplier: number = 1) {
        this.texture.clear();

        this.stars.forEach(star => {
            star.y += star.speed * speedMultiplier;

            if (star.y > this.scene.scale.height) {
                star.y = 0;
                star.x = Phaser.Math.Between(0, this.scene.scale.width);
            }

            this.starGraphics.clear();
            this.starGraphics.fillStyle(star.color, 1);
            this.starGraphics.fillCircle(0, 0, star.size);

            this.texture.draw(this.starGraphics, star.x, star.y);
        });
    }
}
