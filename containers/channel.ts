import {Message} from './message.ts';
import {Subscriber} from './subscriber.ts';
import {Id_generator} from '../utils/id_generator.ts';

import {History} from './history.ts';

export class Channel {
  private history = new History();
  private subscribers: Subscriber[];

  id_generators = {
    message: new Id_generator,
    subscribers: new Id_generator
  }

  post(message_value: Message) {
    var message = new Message(message_value);
    message.id = this.id_generators.message.new();

    this.history.append(message);
    this.subscribers.forEach(subscriber =>
      subscriber.react(message));
  }

  subscibe(subscriber: Subscriber) {
    subscriber.id = this.id_generators.subscribers.new();
    this.subscribers.push(subscriber);
  }
}
