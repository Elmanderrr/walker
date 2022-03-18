import { Sprite } from 'pixi.js';
import { gameConfig } from '../config/game-config';
import { keyCodes } from '../models/key-codes';
import { appConfig } from '../config/app-config';
import { Subject } from 'rxjs';

export class Walker {
  constructor() {

  }

  private step = 2;
  public sprite: Sprite = Sprite.from(gameConfig.walkerSprite);

  public walk$ = new Subject<Sprite>();

  public interactions(code: string): void {
    if (this.cantMove(code)) {
      return
    }

    switch (code) {
      case keyCodes.top:
        this.sprite.y -= this.step;
        break;
      case keyCodes.bottom:
        this.sprite.y += this.step;
        break;

      case keyCodes.right:
        this.sprite.x += this.step;
        break;
      case keyCodes.left:
        this.sprite.x -= this.step;
        break;

    }

    this.walk$.next(this.sprite)
  }


  private cantMove(code: string): boolean {
    return this.sprite.x - this.step < 0 && code === keyCodes.left
      || this.sprite.y - this.step < 0 && code === keyCodes.top
      || this.sprite.y + this.sprite.height + this.step > appConfig.height! && code === keyCodes.bottom
      || this.sprite.x + this.sprite.width + this.step > appConfig.width! && code === keyCodes.right
  }
}
