import { merge } from 'rxjs';
import { Game } from '../game';
import { Enemy } from '../entities/enemy';
import { Sprite } from 'pixi.js';

export class BattleController {
  constructor(game: Game) {
    this.game = game;

    this.init();
  }

  private game: Game;


  public handleAttackControl(): void {
    const enemy = this.findEnemy();
    if (enemy) {
      this.game.walker.attack(enemy);
    }
  }

  public onWalkerWalk(walkerSprite: Sprite): void {
    this.game.enemies.forEach(enemy => {
      if (enemy.inAggroArea(walkerSprite)) {
        enemy.follow(this.game.walker)
      } else {
        enemy.stopFollowing()
      }
    })
  }

  private init() {
    this.listeners();
  }

  private listeners() {
    merge(...this.game.enemies.map(enemy => enemy.died$))
      .subscribe(diedEnemy => {
        this.game.enemies = this.game.enemies.filter(enemy => enemy !== diedEnemy)
      })
  }

  private findEnemy(): Enemy | null {
    const enemiesInAttackZone = this.game.enemies.filter(enemy => enemy.inAttackArea);
    return enemiesInAttackZone.length ? enemiesInAttackZone[0] : null;
  }

}
