import { BaseEntity } from './base-entity';
import { AnimatedSprite, Sprite } from 'pixi.js';

export class BaseEnemy extends BaseEntity {
  constructor(baseTexture: Sprite | AnimatedSprite) {
    super(baseTexture);
  }
}
