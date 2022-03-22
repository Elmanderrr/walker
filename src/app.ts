import { Game } from './app/game';
import { MyLoader } from './app/loader';


export const appLoader = new MyLoader().load(() => {
  new Game(appLoader.resources);
})
