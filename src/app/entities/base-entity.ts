import { AnimatedSprite, Sprite, Texture } from 'pixi.js';

export class BaseEntity {
  constructor(sprite: Sprite | AnimatedSprite) {
    this.healBarWidth = sprite.width;
    this.healthBar = this.drawHealthBar();

    if (sprite instanceof AnimatedSprite) {
      sprite.animationSpeed = 0.207;
    }
  }

  protected sprite: Sprite | AnimatedSprite | undefined;
  public healthValue = 100;
  public healthBar: Sprite;
  public healBarWidth: number;
  public healBarHeight = 2;

  reduceHealth(count: number): void {
    const reduceWidth = this.healBarWidth / (100 / count);

    this.healthBar.width -= reduceWidth;
    this.healthValue -= count;
  }

  addHealth(count: number): void {
    const reduceWidth = this.healBarWidth / (100 / count);

    this.healthBar.width += reduceWidth;
    this.healthValue += count;
  }

  private drawHealthBar(): Sprite {
    const rectangle = Sprite.from(Texture.WHITE);

    rectangle.x = 100;
    rectangle.y = 100;
    rectangle.tint = 0x000;
    rectangle.height = this.healBarHeight;
    rectangle.width = this.healBarWidth;

    return rectangle
  }

  public turnSprite(direction: 'left' | 'right') {
    switch (direction) {
      case 'left':
        this.sprite!.anchor.x = 1;
        this.sprite!.scale.x = -1;
        break;

      case 'right':
        this.sprite!.anchor.x = 0;
        this.sprite!.scale.x = 1;
        break;
    }
  }
}
