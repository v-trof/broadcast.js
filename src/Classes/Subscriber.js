class Subscriber {
  constructor(react) {
    // this.id = id;
    this.react = react;
    this.failures = 0;
  }

  react(message) {
    console.warn('NO_reaction', this)
  };
}
