import { Container, Graphics, Sprite } from 'pixi.js';
import { gameConfig } from '../config/game-config';
import { Coordinates } from '../models/coordinates.interface';

export class Enemy {

  constructor(x: number, y: number) {
    this.sprite.x = x;
    this.sprite.y = y;

    this.draw();
  }

  public container = new Container();
  private areaSize: number = 50;
  public sprite: Sprite = Sprite.from(gameConfig.enemySprite);

  public move(): void {

  }

  private drawAttackArea() {
    const center: Coordinates = {
      x: this.sprite.x + this.sprite.width / 2,
      y: this.sprite.y + this.sprite.height / 2
    };
    const graphics = new Graphics();

    // Rectangle
    graphics.lineStyle(2, 0xFEEB77, 1);
    graphics.drawRect(center.x - this.areaSize, center.y - this.areaSize, this.areaSize * 2, this.areaSize * 2);
    graphics.endFill();

    this.container.addChild(graphics)
  }

  private draw() {
    this.container.addChild(this.sprite)
    this.drawAttackArea()
  }
}
