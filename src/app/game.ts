import { AnimatedSprite, Application } from 'pixi.js';
import { appConfig } from './config/app-config';
import { Walker } from './entities/walker';
import { Enemy } from './entities/enemy';
import { keyCodes } from './models/key-codes';
import { BattleController } from './controllers/battle.controller';
import { EntitiesFabric } from './fabrics/entities.fabric';
import { resource } from './config/game-config';
import { LoadedResources } from './loader';

export class Game {

  constructor(resources: LoadedResources) {
    this.entitiesFabric = new EntitiesFabric();

    this.app = new Application(appConfig);

    this.walker = new Walker(
      30,
      30,
      new AnimatedSprite(resources[resource.walker].spritesheet!.animations['bandit'])
    );

    this.enemies = this.entitiesFabric.enemies(5);
    this.battleController = new BattleController(this);
    // this.tileMap = new TileMap();

    this.listeners();
    this.draw();

  }

  // private tileMap: TileMap;
  public battleController: BattleController;
  public entitiesFabric: EntitiesFabric;
  public app: Application;
  public walker: Walker;
  public enemies: Enemy[];
  private pressedKeys: { [key: string]: boolean } = {};

  private draw() {
    document.body.appendChild(this.app.view);
    // this.app.stage.addChild(this.tileMap.container);
    this.app.stage.addChild(this.walker.container);

    this.enemies?.forEach(enemy => {
      this.app.stage.addChild(enemy.container);
    });

  }

  private listeners() {
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));

    this.app.ticker.add(() => this.gameLoop());

    this.walker.walk$.subscribe(walkerSprite => {
      this.battleController.onWalkerWalk(walkerSprite);
    });

  }

  private onKeyDown(e: KeyboardEvent): void {
    this.pressedKeys[e.code] = true;
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.pressedKeys[e.code] = false;


    if (e.code === keyCodes.space) {
      this.battleController.handleAttackControl()
    }
  }

  private gameLoop(): void {
    this.walker.gameLoop(this.pressedKeys);
  }

}
