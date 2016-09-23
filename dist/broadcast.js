var Broadcast = (function() {

  class Broadcast {
    constructor(max_failures=5) {
      this._channels = {};
      this.max_failures = max_failures;
      this._time = {
        upstart: new Date() //actually request
      }
      this.origin = 0; //actually request
    }

    //Channel methods
    _create_channel(channel_name, scope='local', max_history=100, max_failures=this.max_failures) {
      this._channels[channel_name] = new Broadcast._src.Channel(scope, channel_name, this, max_failures, max_history);
      return this._channels[channel_name];
    }

    _delete_channel(channel_name) {
      delete this._channels[channel_name];
    }

    edit_channel(channel_name, props) {
      for(var key in props) {
        this._channels[channel_name][key] = props[key];
      }
    }

    post(channel_name, value) {
      if( ! this._channels[channel_name]) {
        this._create_channel(channel_name);
      }

      return this._channels[channel_name].post(value);
    }

    //subscriber methods

    subscribe(channel_name, reaction) {
      if( ! this._channels[channel_name]) {
        this._create_channel(channel_name);
      }

      var subscriber = new Broadcast._src.Subscriber(reaction);
      this._channels[channel_name].subscribe(subscriber);
      return subscriber;
    }

    unsubscribe(channel_name, subscriber) {
      this._channels[channel_name].unsubscribe(subscriber);
    }

    //utility methods
    get_time() {
      return (new Date() - this._time.upstart);
    }
  }

  Broadcast._src = {}
  return Broadcast;
})();

(function () {
class Channel {
  constructor(scope, name, host, max_failures, max_history) {
    this._subscribers = [];
    this.scope = scope;
    this._host = host;
    this.max_failures = max_failures;
    this._name = name;
    this.history = new Broadcast._src.History(this, max_history);
  }

  //subscriber methods
  subscribe(subscriber) {
    this._subscribers.push(subscriber);
  }

  unsubscribe(subscriber) {
    if(typeof subscriber === 'number') {
      //it is id of subscriber object, fine
      var id = subscriber;
    } else {
      //find subscriber id
      var id = this._subscribers.indexOf(subscriber);
    }

    if(id > -1) {
      this._subscribers.splice(id, 1);
    }
  }

  //messaging methods
  post(value) {
    var message = new Broadcast._src.Message(value, this._host, this._name);

    this.history.add(message);
    for(var current = 0; current < this._subscribers.length; current++) {
      var subscriber = this._subscribers[current];
      try {
        subscriber.react(message.value, message);
      } catch (err) {
        //no reason to keep dead subscribers
        console.error(
          "subscriber:", subscriber,
          "\n channel:", this,
          "\n\n error:", err);
        subscriber.failures++;
        if(subscriber.failures > this.max_failures) {
          this.unsubscribe(current);
        }
      }
    };
    return message;
  }
}

Broadcast._src.Channel = Channel;
} ());

(function () {
class History {
  constructor(host, max_length) {
    this._messages = [];
    this._host = host;
    this._max_length = max_length;
  }

  /**
   * return all values since message(including it)
   * @method since
   * @param  {Message} message message to start with
   * @return {Message[]} Array of messages since that one
   */
  since(message) {
    var id = this._messages.indexOf(message);
    if(id == -1) {
      console.error('Message', message, 'hasn`t been posted to ', this._host, 'lately.');
      return [];
    }
    else {
      return this._messages.slice(id);
    }
  }

  /**
   * Returns whole history of channel
   * @method all
   * @return {Message[]} [description]
   */
  all() {
    return this._messages.slice()
  }

  /**
   * Adds message to channel history
   * @method add
   * @param  {Message} message message to add
   */
  add(message) {
    this._messages.push(message);
    if (this._messages.length > this._max_length) {
      this._messages.shift();
    }
  }

  sync() {}
}

Broadcast._src.History = History;
} ());

(function () {
class Message {
  constructor(value, host, channel_name) {
    this.value = value;
    this.origin = host.origin;
    this.time = host.get_time();
    this.channel_name = channel_name;

    if(value instanceof File) {
      this.type = 'File';
    } else if (value instanceof Blob) {
      this.type = 'Blob';
    } else {
      this.type = typeof value;
    }
  }
}

Broadcast._src.Message = Message;
} ());

(function () {
class Subscriber {
  constructor(react) {
    // this.id = id;
    this.react = react;
    this.failures = 0;
  }

  react(message) {
    console.warn('No reaction set for a subscriber', this)
  };
}

Broadcast._src.Subscriber = Subscriber;
} ());
