class Subscriber {
  constructor(id, react) {
    this.id = id;
    this.react = react;
    this.falures = 0;
  }

  react(message) {
    console.warn('NO_reaction', this)
  };
}
