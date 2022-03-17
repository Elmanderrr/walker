import { Application } from 'pixi.js';
import { appConfig } from './config/app-config';
import { Walker } from './controllers/walker';
import { Enemy } from './controllers/enemy';

export class Game {

  constructor() {
    this.app = new Application(appConfig);
    this.walker = new Walker();


    this.interactions();


    setTimeout(() => {
      this.draw();

    }, 1000)
  }

  public app: Application;
  public walker: Walker;
  public enemies: Enemy[] = [new Enemy(100, 100), new Enemy(250, 180)];

  private draw() {
    document.body.appendChild(this.app.view)
    this.app.stage.addChild(this.walker.sprite);
    this.enemies?.forEach(enemy => {
      this.app.stage.addChild(enemy.container);
    });
  }

  private interactions() {
    window.addEventListener('keydown', (e) => this.onKeyUp(e))
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.walker.interactions(e.code)
  }
}
