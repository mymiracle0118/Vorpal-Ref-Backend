import { WriteLog } from '../../database/log';
import GameObject from './GameObject';
import { play } from '../types';
import { GameRoom } from '../core/Room';
import { defShipHealth, defStarHealth } from '../config';
import { actionList } from '../types/msg';

export default class Star extends GameObject {
  public energy: number;
  private lifeTimer: NodeJS.Timer;

  constructor(
    _room: GameRoom,
    _owner: string,
    _coords: play.coords,
    _sprite: play.sprite,
  ) {
    super(_room, _owner, _coords, _sprite, 'star');
    this.onCreate();
  }

  protected onCreate() {
    // WriteLog(this.owner, 'Star placed');
    this.energy = defStarHealth;

    this.lifeTimer = setInterval(() => {
      this.TakeDamage(1)
    }, 1000)
  }

  protected onDestroy() {
    this.room.StarDestroy(this.owner, this.id);
  }

  public TakeDamage(damage: number) {
    this.energy -= damage;
    if (this.energy <= 0) {
      this.destroy();
    } else {
      this.room.ReSendMessage(JSON.stringify({
        action: actionList.objectupdate,
        id: this.id,
        enegry: this.energy
      }))
    }
  }

  public destroy = () => {
    this.onDestroy();
  };
}
