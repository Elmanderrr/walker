import { AnimatedSprite, Container, Graphics, Rectangle, Sprite, Ticker } from 'pixi.js';
import { Position } from '../models/coordinates.interface';
import { testForAABB } from '../helpers';
import { Walker } from './walker';
import { Subject } from 'rxjs';
import { BaseEnemy } from './base-enemy';
import { CanAttack } from '../interfaces/can-attack.interface';

export interface EnemyConfig extends Pick<CanAttack, 'attackFrequency' | 'attackPower' >{
  x: number;
  y: number;
  sprite: Sprite | AnimatedSprite;
}

export class Enemy extends BaseEnemy implements CanAttack {

  constructor(props: EnemyConfig) {
    super(props.sprite);

    this.sprite = props.sprite;

    this.sprite.x = props.x ;
    this.sprite.y = props.y;
    this.healthBar.x = props.x ;
    this.healthBar.y = props.y - this.healBarHeight - 4;

    this.attackFrequency = props.attackFrequency;
    this.attackPower = props.attackPower;
    this.areaSize = this.sprite.width * 1.4;

    this.draw();

  }

  public sprite: Sprite | AnimatedSprite;
  public died$ = new Subject<Enemy>();
  public container = new Container();
  public attackArea = new Graphics();
  public inAttackArea: boolean = false;
  public attackPower: number;
  public attackFrequency:number;

  private areaSize: number;
  private ticker = new Ticker();
  private step = 0.1;
  private runLoop: (() => void) | undefined;
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
    if (this.sprite instanceof AnimatedSprite) {
      this.sprite.stop();
    }
  }

  private run = (walker: Walker) => {
    this.moveEnemyBox(walker.container.y < this.sprite.y ? -this.step : this.step, 'y');
    this.moveEnemyBox(walker.container.x < this.sprite.x ? -this.step : this.step, 'x');

    this.turnSprite(walker.container.x < this.sprite.x ? 'left' : 'right')

    if (this.sprite instanceof AnimatedSprite) {
      this.sprite.play();
    }

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

  }

  private draw() {
    this.container.addChild(this.sprite);
    this.container.addChild(this.healthBar);




    this.attackArea.lineStyle(2, 0xFEEB77, 0.8);
    this.attackArea.drawRect(this.calculateAggroArea().x,  this.calculateAggroArea().y, this.areaSize * 2, this.areaSize * 2);
    this.attackArea.endFill();

    this.container.addChild(this.attackArea)

  }

  private moveEnemyBox(step: number, axis: 'x' | 'y'): void {
    this.sprite[axis] += step;
    this.attackArea[axis] += step;
    this.healthBar[axis] += step;
  }

  public attack(walker: Walker): void {
    if (this.attackIntervalId) {
      return;
    }

    this.attackIntervalId = setInterval(() => {
      walker.reduceHealth(this.attackPower);
    }, this.attackFrequency * 1000)
  }

  private stopAttack() {
    clearInterval(this.attackIntervalId!);
    this.attackIntervalId = undefined;
  }

  public reduceHealth(count: number): void {
    super.reduceHealth(count);

    if (this.healthValue <= 0) {
      this.container.destroy();
      this.stopAttack();
      this.stopFollowing();
      this.died$.next(this);
    }
  }

}
