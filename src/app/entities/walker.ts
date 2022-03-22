import { AnimatedSprite, Container, Sprite } from 'pixi.js';
import { keyCodes } from '../models/key-codes';
import { appConfig } from '../config/app-config';
import { Subject } from 'rxjs';
import { Enemy } from './enemy';
import { BaseEntity } from './base-entity';
import { CanAttack } from '../interfaces/can-attack.interface';

export class Walker extends BaseEntity implements CanAttack {
  constructor(x: number, y: number, sprite: AnimatedSprite) {
    super(sprite);

    this.sprite = sprite;

    this.container.x = x;
    this.container.y = y;

    this.sprite.x = 0;
    this.sprite.y = 0;

    this.healthBar.x = 0;
    this.healthBar.y = - this.healBarHeight - 4;
    this.draw();
  }

  public sprite: AnimatedSprite;
  public walk$ = new Subject<Sprite>();
  public stopWalk$ = new Subject<Sprite>();
  public container = new Container();
  public attackPower = 20;
  public attackFrequency = 1000;
  private step = 1;

  public movement(code: string): void {

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
        this.turnSprite('right');
        break;

      case keyCodes.left:
        this.container.x -= this.step;
        this.turnSprite('left');
        break;
    }

    this.walk$.next(this.sprite);
    this.sprite.play();
  }

  private cantMove(code: string): boolean {

    return this.container.x - this.step < 0 && code === keyCodes.left
      || this.container.y - this.step < 0 && code === keyCodes.top
      || this.container.y + this.sprite.height + this.step > appConfig.height! && code === keyCodes.bottom
      || this.container.x + this.sprite.width + this.step > appConfig.width! && code === keyCodes.right
  }

  private draw() {
    this.container.addChild(this.sprite);
    this.container.addChild(this.healthBar)
  }

  attack(enemy: Enemy): void {
    enemy.reduceHealth(this.attackPower)
  }

  gameLoop(pressedKeys: { [key: string]: boolean }): void {
    const movementKeys = [keyCodes.top, keyCodes.bottom, keyCodes.left, keyCodes.right];

    movementKeys.forEach(code => {
      if (pressedKeys[code]) {
        this.movement(code)
      }
    });

    if (movementKeys.every(code => {
      return !pressedKeys[code]
    })) {
      if (this.sprite.playing) {
        this.sprite.stop();
      }
    }

  }

}
