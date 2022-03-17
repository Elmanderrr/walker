import { Sprite } from 'pixi.js';
import { gameConfig } from '../config/game-config';
import { keyCodes } from '../models/key-codes';
import { appConfig } from '../config/app-config';

export class Walker {
  constructor() {
  }

  public sprite: Sprite = Sprite.from(gameConfig.walkerSprite);

  public interactions(code: string): void {
    if (this.cantMove(code)) {
      return
    }

    switch (code) {
      case keyCodes.top:
        this.sprite.y = this.sprite.y - 10;
        break;
      case keyCodes.bottom:
        this.sprite.y = this.sprite.y + 10;
        break;

      case keyCodes.right:
        this.sprite.x = this.sprite.x + 10;
        break;
      case keyCodes.left:
        this.sprite.x = this.sprite.x - 10;
        break;

    }
  }

  private cantMove(code: string): boolean {
    return this.sprite.x - 10 < 0 && code === keyCodes.left
      || this.sprite.y - 10 < 0 && code === keyCodes.top
      || this.sprite.y + this.sprite.height + 10 > appConfig.height! && code === keyCodes.bottom
      || this.sprite.x + this.sprite.width + 10 > appConfig.width! && code === keyCodes.right
  }
}
