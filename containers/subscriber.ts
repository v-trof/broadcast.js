import broadcast from '../core.ts';

export class Subscriber {
  react: Function;
  id: number;

  constructor(reaction: Function) {
    this.id = broadcast.id_generator.new();
    this.react = reaction;
  }
}
