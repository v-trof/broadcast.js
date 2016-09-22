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
