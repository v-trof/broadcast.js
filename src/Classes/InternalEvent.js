(function() {
class InternalEvent extends Broadcast._src.Message {
  constructor(event_type, value, host) {
    super(value, host, null);
    this.event_type = event_type;
  }
}

Broadcast._src.InternalEvent = InternalEvent;
} ());
