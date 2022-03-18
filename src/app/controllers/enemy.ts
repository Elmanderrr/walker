import { Container, Graphics, Rectangle, Sprite, Text, TextStyle, Ticker } from 'pixi.js';
import { gameConfig } from '../config/game-config';
import { Position } from '../models/coordinates.interface';
import { testForAABB } from '../helpers';
import { Walker } from './walker';
import { Subject } from 'rxjs';

export class Enemy {

  constructor(x: number, y: number) {
    this.sprite.x = x;
    this.sprite.y = y;
    this.health.x = x + 5;
    this.health.y = y - 15;

    this.draw();
  }

  public died$ = new Subject<Enemy>();
  public container = new Container();
  public attackArea = new Graphics();
  public sprite: Sprite = Sprite.from(gameConfig.enemySprite);
  public inAttackArea: boolean = false;
  private health = new Text('100', new TextStyle({
    fontSize: 10
  }));
  private areaSize: number = 60;
  private ticker = new Ticker();
  private step = 0.1;
  private runLoop: (() => void) | undefined;
  private attackModificatour = 5;
  private attackFrequency = 1000;
  private attackIntervalId: NodeJS.Timer | undefined;

  public inAggroArea(walker: Sprite): boolean {
    const fakeAggroArea = {
      getBounds: () => {
        return this.calculateAggroArea()
      }
    }
    return testForAABB(walker, fakeAggroArea)
  }

  public follow(walker: Walker): void {
    if (this.ticker.started) {
      return;
    }

    this.runLoop = () => this.run(walker);

    this.ticker.add(this.runLoop);
    this.ticker.start();
  }


  public stopFollowing() {
    this.ticker.remove(this.runLoop!);
    this.ticker.stop();
  }

  private run = (walker: Walker) => {
    this.moveEnemyBox(walker.container.y < this.sprite.y ? -this.step : this.step, 'y')
    this.moveEnemyBox(walker.container.x < this.sprite.x ? -this.step : this.step, 'x')

    if (testForAABB(walker.container, this.sprite)) {
      this.stopFollowing();
      this.attack(walker);
      this.inAttackArea = true;
    } else {
      this.stopAttack();
      this.inAttackArea = false;
    }

  }

  private calculateAggroArea(): Pick<Rectangle, 'x' | 'y' | 'width' | 'height'> {
    const center: Position = {
      x: this.sprite.x + this.sprite.width / 2,
      y: this.sprite.y + this.sprite.height / 2
    };

    return {
      x: center.x - this.areaSize,
      y: center.y - this.areaSize,
      height: this.areaSize * 2,
      width: this.areaSize * 2
    }
    //
    // this.attackArea.lineStyle(2, 0xFEEB77, 0.8);
    // this.attackArea.drawRect(this.attackAreaPos.x, this.attackAreaPos.y, this.areaSize * 2, this.areaSize * 2);
    // this.attackArea.endFill();

    // this.container.addChild(this.attackArea)
  }

  private draw() {
    this.container.addChild(this.sprite);
    this.container.addChild(this.health);
  }

  private moveEnemyBox(step: number, axis: 'x' | 'y'): void {
    this.sprite[axis] += step;
    this.attackArea[axis] += step;
    this.health[axis] += step;
  }

  private attack(target: Walker) {
    if (this.attackIntervalId) {
      return;
    }

    this.attackIntervalId = setInterval(() => {
      target.reduceHealth(this.attackModificatour);
    }, this.attackFrequency)
  }

  private stopAttack() {
    clearInterval(this.attackIntervalId!);
    this.attackIntervalId = undefined;
  }

  reduceHealth(count: number): void {
    this.health.text = (Number(this.health.text) - count).toFixed(0);

    if (Number(this.health.text) < 0) {
      this.container.destroy();
      this.stopAttack();
      this.stopFollowing();
      this.died$.next(this);
    }
  }

}
