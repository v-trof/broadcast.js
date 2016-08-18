export class Id_generator {
  private next_id = 0;
  new() {
    this.next_id++;
    return this.next_id - 1;
  }
}
