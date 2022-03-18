import { Container, Sprite, Text, TextStyle } from 'pixi.js';
import { gameConfig } from '../config/game-config';
import { keyCodes } from '../models/key-codes';
import { appConfig } from '../config/app-config';
import { Subject } from 'rxjs';
import { Enemy } from './enemy';

export class Walker {
  constructor() {
    this.draw();
  }

  public walk$ = new Subject<Sprite>();

  public container = new Container();

  public sprite: Sprite = Sprite.from(gameConfig.walkerSprite);
  private health = new Text('100', new TextStyle({
    fontSize: 10
  }));
  private step = 1;
  private attackModificatour = 20;

  public interactions(code: string): void {
    if (this.cantMove(code)) {
      return
    }

    switch (code) {
      case keyCodes.top:
        this.container.y -= this.step;
        break;
      case keyCodes.bottom:
        this.container.y += this.step;
        break;

      case keyCodes.right:
        this.container.x += this.step;
        break;

      case keyCodes.left:
        this.container.x -= this.step;
        break;


    }

    this.walk$.next(this.sprite)
  }

  private cantMove(code: string): boolean {
    return this.container.x - this.step < 0 && code === keyCodes.left
      || this.container.y - this.step < 0 && code === keyCodes.top
      || this.container.y + this.container.height + this.step > appConfig.height! && code === keyCodes.bottom
      || this.container.x + this.sprite.width + this.step > appConfig.width! && code === keyCodes.right
  }

  private draw() {
    this.sprite.y = 15;
    this.health.x = 5;
    this.container.addChild(this.sprite);
    this.container.addChild(this.health)
  }

  addHealth(count: number): void {
    this.health.text = (Number(this.health.text) + count).toFixed(0);
  }

  reduceHealth(count: number): void {
    this.health.text = (Number(this.health.text) - count).toFixed(0);
  }

  attack(enemy: Enemy): void {
    enemy.reduceHealth(this.attackModificatour)
  }
}
