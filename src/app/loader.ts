import { Loader } from 'pixi.js';
import { resourceUrls, resource, spriteSheetResources } from './config/game-config';
import { ILoaderResource } from '@pixi/loaders';

export interface LoadedResources {
  [name: string]: ILoaderResource;
}

export class MyLoader extends Loader{
  constructor() {
    super();
    Object.keys(resource).forEach(key => {
      this.add(key, resourceUrls[key])
    });

    Object.values(spriteSheetResources).forEach(val => {
      this.add(val, resourceUrls[val])
    });


  }
}
