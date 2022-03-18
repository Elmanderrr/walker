import { Application } from 'pixi.js';
import { appConfig } from './config/app-config';
import { Walker } from './controllers/walker';
import { Enemy } from './controllers/enemy';
import { keyCodes } from './models/key-codes';
import { merge } from 'rxjs';

export class Game {

  constructor() {
    this.app = new Application(appConfig);
    this.walker = new Walker();
    this.enemies = [new Enemy(100, 100), new Enemy(150, 200),  new Enemy(230, 200),  new Enemy(270, 200)];

    this.interactions();
    this.draw();

  }

  public app: Application;
  public walker: Walker;
  public enemies: Enemy[];
  private pressedKeys: { [key: string]: boolean } = {};

  private draw() {
    document.body.appendChild(this.app.view)
    this.app.stage.addChild(this.walker.container);

    this.enemies?.forEach(enemy => {
      this.app.stage.addChild(enemy.container);
    });
  }

  private interactions() {
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));
    this.app.ticker.add(() => this.gameLoop())
    this.walker.walk$.subscribe(walkerSprite => {
      this.enemies.forEach(enemy => {
        if (enemy.inAggroArea(walkerSprite)) {
          enemy.follow(this.walker)
        } else {
          enemy.stopFollowing()
        }
      })
    });

    merge(...this.enemies.map(enemy => enemy.died$))
      .subscribe(diedEnemy => {
        this.enemies = this.enemies.filter(enemy => enemy !== diedEnemy)
      })
  }

  private onKeyDown(e: KeyboardEvent): void {
    this.pressedKeys[e.code] = true;
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.pressedKeys[e.code] = false;


    if (e.code === keyCodes.space) {
      const enemy = this.targetEnemy();
      if (enemy) {
        this.walker.attack(enemy);
      }
    }
  }

  private gameLoop(): void {
    [keyCodes.top, keyCodes.bottom, keyCodes.left, keyCodes.right].forEach(code => {
      if (this.pressedKeys[code]) {
        this.walker.interactions(code)
      }
    });

  }

  private targetEnemy(): Enemy | null {
    const enemiesInAttackZone = this.enemies.filter(enemy => enemy.inAttackArea);
    return enemiesInAttackZone.length ? enemiesInAttackZone[0] : null;
  }
}
