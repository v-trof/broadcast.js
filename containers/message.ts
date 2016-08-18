import {Channel} from './channel.ts';
import broadcast from '../core.ts';

export class Message {
  value: {};
  time: number;
  id: number;
  origin: string;
  constructor(channel: Channel, value: {}) {
    this.value = value;
    this.time = broadcast.get_time();
    this.id = channel.id_generator.new();
    this.origin = broadcast.origin;
  }
}
