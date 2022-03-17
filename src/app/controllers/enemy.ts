import { Container, Graphics, Sprite } from 'pixi.js';
import { gameConfig } from '../config/game-config';
import { Position } from '../models/coordinates.interface';
import { testForAABB } from '../helpers';
import { Walker } from './walker';
import Timeout = NodeJS.Timeout;

export class Enemy {

  constructor(x: number, y: number) {
    this.sprite.x = x;
    this.sprite.y = y;

    this.draw();
  }

  public container = new Container();
  public attackArea = new Graphics();
  public sprite: Sprite = Sprite.from(gameConfig.enemySprite);
  private areaSize: number = 70;
  private attackAreaPos: Position | undefined;
  private intervalId: Timeout | undefined;

  public inAttackArea(el: Sprite): boolean {
    return testForAABB(el, this.attackArea)
  }

  public attack(walker: Walker): void {
    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(() => {
      if (walker.sprite.x > this.sprite.x) {
        this.sprite.x += 1;
        this.attackArea.x += 1;
      } else {
        this.sprite.x -= 1;
        this.attackArea.x -= 1;
      }

      if (walker.sprite.y > this.sprite.y) {
        this.sprite.y += 1;
        this.attackArea.y += 1;
      } else {
        this.sprite.y -= 1;
        this.attackArea.y -=1;
      }

      if (testForAABB(walker.sprite, this.sprite)) {
        this.stopFollowing();
      }

    }, 100);
  }


  stopFollowing() {
    clearInterval(this.intervalId!);
    this.intervalId = undefined;
  }

  private drawAttackArea() {
    const center: Position = {
      x: this.sprite.x + this.sprite.width / 2,
      y: this.sprite.y + this.sprite.height / 2
    };
    this.attackAreaPos = {
      x: center.x - this.areaSize,
      y: center.y - this.areaSize
    };


    this.attackArea.lineStyle(2, 0xFEEB77, 1);
    this.attackArea.drawRect(this.attackAreaPos.x, this.attackAreaPos.y, this.areaSize * 2, this.areaSize * 2);
    this.attackArea.endFill();

    this.container.addChild(this.attackArea)
  }

  private draw() {
    this.container.addChild(this.sprite)

    this.sprite.texture.baseTexture.on('loaded', () => {
      this.drawAttackArea()
    })
  }

}
