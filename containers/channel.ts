import {Message} from './message.ts';
import {Subscriber} from './subscriber.ts';
import {Id_generator} from '../utils/id_generator.ts';

export class Channel {
  private history: Message[];
  private subscribers: Subscriber[];
  id_generator = new Id_generator;
}
