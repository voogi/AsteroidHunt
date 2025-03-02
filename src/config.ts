export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: 'Rocket',
  parent: 'game-container',
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: false,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
  input: {
    activePointers: 3,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  plugins: {},
};
