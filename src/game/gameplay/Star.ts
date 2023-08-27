import { WriteLog } from '../../database/log';
import GameObject from './GameObject';
import { play } from '../types';
import { GameRoom } from '../core/Room';

export default class Star extends GameObject {
  public energy : number;

  constructor(_room: GameRoom, _owner: string, _coords: play.coords, _sprite: play.sprite) {
    super(_room, _owner, _coords, _sprite, 'star');
    this.energy = 100;
    this.onCreate();
  }

  protected onCreate() {
    WriteLog(this.owner, 'Star placed');
  }

  public destroy = () => {
    WriteLog(this.owner, 'Star destroyed');
  }

}
