class Broadcast {
  constructor() {
    this._channels = {}
    this._id_generator = new Id_generator();
  }

  //Channel methods
  create_channel(channel_name, scope) {
    scope = scope || 'local';
    this._channels[channel_name] = new Channel(scope);
  }
  post(channel_name, value) {
    this._channels[channel_name].post(value);
  }

  //subscriber methods
  subscribe(channel_name, reaction) {
    var subscriber = new Subscriber(this._id_generator.new(), reaction);
    this._channels[channel_name].subscribe(subscriber);
  }
  report()
}
