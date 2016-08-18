import {Message} from './message.ts';
import {Subscriber} from './subscriber.ts';
import {Id_generator} from '../utils/id_generator.ts';

import {History} from './history.ts';

export class Channel {
  private subscribers: { [id: number]: Subscriber };
  private id_generators = new Id_generator;
  history = new History();

  post(message_value: Message) {
    var message = new Message(message_value);
    message.id = this.id_generators.new();

    this.history.append(message);
    for (var id in this.subscribers) {
      this.subscribers[id].react(message);
    }
  }

  subscibe(subscriber: Subscriber) {
    var id = subscriber.id;
    this.subscribers[id] = subscriber;
  }

  unsubscribe(id) {
    delete this.subscribers[id];
  }
}
