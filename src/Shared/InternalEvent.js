(function() {
class Internal_Event extends Broadcast._src.Message {
  constructor(event_type, value, host) {
    super(value, host, null);
    this.event_type = event_type;
  }
}

Broadcast._src.Internal_Event = Internal_Event;
} ());
