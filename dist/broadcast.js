var Broadcast = (function() {

  class Broadcast {
    constructor(max_failures=5) {
      this._channels = {};
      this.max_failures = max_failures;
      this._time = {
        upstart: new Date() //actually request
      };
      this._router = new Broadcast._src.Router.init(this);
      this.origin = 0; //actually request
    }

    //Channel methods
    _create_channel(channel_name, scope='local', max_history=100,
        max_failures=this.max_failures) {
      this._channels[channel_name] = new Broadcast._src.Channel(scope,
        channel_name, this, max_failures, max_history);

      return this._channels[channel_name];
    }

    _delete_channel(channel_name) {
      delete this._channels[channel_name];
    }

    edit_channel(channel_name, props) {
      this._channels[channel_name].edit(props);
    }

    post(channel_name, value) {
      if( ! this._channels[channel_name]) {
        this._create_channel(channel_name);
      }

      var to_send;
      if(value instanceof Broadcast._src.Message) {
        to_send = value;
      } else {
        to_send = new Broadcast._src.Message(value, this, channel_name);
      }
      if (this._channels[channel_name].scope === 'global') {
        this._router.send_message(to_send);
      }
      return this._channels[channel_name].post(to_send);
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

    _set_upstart(value) {
      this._time.upstart = value;
    }
  }

  Broadcast._src = {};
  return Broadcast;
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

(function() {
  class Abstract_Router {
    constructor(host) {
      this._host = host;
      this._routes = {};
    }

    on(event_type, callback) {
      if (typeof callback === 'function') {
        this._routes[event_type] = callback;
      } else {
        console.error('callback parameter should be a type of Function');
      }
      return this;
    }

    route_event(message) {
      var route = this._routes[message.event_type];
      try {
        return route(this._host, message.value);
      } catch (err) {
        console.error('broken route for ' + message.event_type);
      }
    }
  }

Broadcast._src.Abstract_Router = Abstract_Router;
} ());

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

  edit(properties) {
    for(var key in properties) {
      if(key.match(/^_/)) {
        return console.error('private properties of a channel are not editable');
      }
      if(key === 'max_history') {
        var old_history = this.history.all();
        this.history = new Broadcast._src.History(this, properties[key]);
        this.history.sync(old_history);
      } else {
        if(this.hasOwnProperty(key)) {
          this[key] = properties[key];
        } else {
          return console.error('non-existing properties of a channel are not editable');
        }
      }
    }
  }

  //subscriber methods
  subscribe(subscriber) {
    this._subscribers.push(subscriber);
  }

  unsubscribe(subscriber) {
    var id;
    if(typeof subscriber === 'number') {
      //it is id of subscriber object, fine
      id = subscriber;
    } else {
      //find subscriber id
      id = this._subscribers.indexOf(subscriber);
    }

    if(id > -1) {
      this._subscribers.splice(id, 1);
    }
  }

  //messaging methods
  post(message) {
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
    }
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
    if(id === -1) {
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

  sync(messages) {
    this._messages.push.apply(this._messages, messages);
    // sort by timestamps
    this._messages.sort(function(x, y) {
      if (x.time > y.time){
        return 1;
      } else if (x.time < y.time){
        return -1;
      } else{
        return 0;
      }
    });
    if (this._messages.length > this._max_length) {
      this._messages.splice(0, (this._messages.length - this._max_length));
    }
  }
}

Broadcast._src.History = History;
} ());

(function() {
class Internal_Event extends Broadcast._src.Message {
  constructor(event_type, value, host) {
    super(value, host, null);
    this.event_type = event_type;
  }
}

Broadcast._src.Internal_Event = Internal_Event;
} ());

(function() {

class Router {
  constructor(host) {
    this._host = host;
    this._socket_adapter = new Broadcast._src.SocketAdapter(this);
    this._routes = {};
  }

  parse_message(message) {
    if (message instanceof Broadcast._src.Internal_Event){
      this.route_event(message);
    } else if (message instanceof Broadcast._src.Message){
      this.route_message(message);
    } else {
      console.error('message parameter should be an instance of Message class');
    }
  }

  route_event(message) {
    var route = this._routes[message.event_type];
    try {
      return route(this._host, message.value);
    } catch (err) {
      console.error('broken route for ' + message.event_type);
    }
  }

  route_message(message) {
    this._host.post(message.channel_name, message);
  }

  on(event_type, callback) {
    if (typeof callback === 'function') {
      this._routes[event_type] = callback;
    } else {
      console.error('callback parameter should be a type of Function');
    }
    return this;
  }

  send_message(message) {
    if (message.origin === this._host.origin) {
      this._socket_adapter.send(message);
    }
  }

  get_init_data() {
    var request = new Broadcast._src.Internal_Event('init', null, this._host);
    this._socket_adapter.send(request);
  }

  set_relevancy(channel_name, toggle) {
    var request = new Broadcast._src.Internal_Event('relevancy', {
      channel: channel_name,
      relevancy: toggle
    }, this._host);
    this._socket_adapter.send(request);
  }

}

Broadcast._src.Router = Router;
Broadcast._src.Router.init = function(host, socket_adapter) {
  instance = new Router(host, socket_adapter)
  instance
    .on('init', function(host, value) {
      host._set_upstart(value.upstart);
      host.origin = value.origin;
    })
    .on('history_sync', function(host, value){
      host._channels[value.channel_name].history.sync(value.messages);
    });
  return instance;
}
} ());

(function() {
class SocketAdapter {
  constructor(router){
    this._router = router;
  }

  send(message) {
    console.log('skel implementation of send(message) has been called');
  }
  // TODO: implement the SocketAdapter
}

Broadcast._src.SocketAdapter = SocketAdapter;
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
  }
}

Broadcast._src.Subscriber = Subscriber;
} ());
