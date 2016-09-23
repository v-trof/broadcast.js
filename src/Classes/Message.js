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
