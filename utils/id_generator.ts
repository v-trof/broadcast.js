export class Id_generator {
  private next_id = 0;
  /**
   * @return {number} new unique id
   */
  new(): number {
    this.next_id++;
    return this.next_id - 1;
  }
}
