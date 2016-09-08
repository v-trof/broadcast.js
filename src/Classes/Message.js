class Message {
  constructor(value, host) {
    this.value = value;
    this.origin = host.origin;
    this.time = host.get_time();

    if(value instanceof File) {
      this.type = 'File';
    } else if (value instanceof Blob) {
      this.type = 'Blob';
    } else {
      this.type = typeof value;
    }
  }
}
