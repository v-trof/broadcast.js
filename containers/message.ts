import {Channel} from './channel.ts';
import broadcast from '../core.ts';

export class Message {
  value: {};
  time: number;
  id: number;
  origin: string;

  constructor(value) {
    this.value = value;
    this.time = broadcast.get_time();
    this.origin = broadcast.origin;
  }
}

broadcast.create_channel
