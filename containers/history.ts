import {Message} from './message.ts';
import broadcast from '../core.ts';

export class History {
  values: Message[] = [];

  append(message: Message) {
    if (this.values.length > broadcast.params.max_history) {
      this.values = this.values.slice(1);
    }

    this.values.push(message);
  }

  reveal = {
    all: function(message_id: number): Message[] {
      return this.values;
    },

    scince: function(message_id: number): Message[] {
      var messages = [];
      var found = false;

      this.valeus.forEach(function(message: Message) {
        if (message.id === message_id) found = true;


        if (found) messages.push(message);
      });

      return messages;
    },

    single: function(message_id: number) {
      this.valeus.forEach(function(message: Message): Message {
        if (message.id === message_id) {
          return message;
        }
      })
    },
  }
}
