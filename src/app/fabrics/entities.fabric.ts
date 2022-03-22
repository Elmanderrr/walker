import { Enemy } from '../entities/enemy';
import { spriteSheetResources } from '../config/game-config';
import { random, sample } from 'lodash-es';
import { appConfig } from '../config/app-config';
import { appLoader } from '../../app';
import { AnimatedSprite } from 'pixi.js';
import { ILoaderResource } from '@pixi/loaders';

export class EntitiesFabric {

  enemies(count: number): Enemy[] {

    return Array.from(new Array(count)).map(() => {
      const { spritesheet, name } = this.getRandomEnemyResource();

      return new Enemy({
        x: random(0, appConfig.width! - 32),
        y: random(0, appConfig.height! - 32),
        sprite: new AnimatedSprite(spritesheet!.animations[name]),
        attackFrequency: random(0.5, 1.5),
        attackPower: random(5, 10)
      })
    })
  }


  getRandomEnemyResource(): ILoaderResource {
    return sample(
      Object.values(spriteSheetResources)
        .map(k => appLoader.resources[k])
    )!
  }
}

