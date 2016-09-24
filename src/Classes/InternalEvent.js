(function() {
class InternalEvent extends Broadcast._src.Message {
  constructor(type, value, host) {
    this.type = type;
    this.value = value;
    this.origin = host.origin;
    this.time = host.get_time();
  }
}

Broadcast._src.InternalEvent = InternalEvent;
} ());
