/* Undo and redo, the same way everywhere: the Director's turn, Build scene and the castle editor.
 * It remembers snapshots of a value (as JSON). Call note() after every finished change. */
export class History {
  constructor(limit = 80) {
    this.limit = limit;
    this.past = [];
    this.future = [];
  }
  /** Start over from this value. */
  reset(value) {
    this.past = value === undefined ? [] : [JSON.stringify(value)];
    this.future = [];
  }
  /** Remember the value as it is now. Returns false if nothing changed since the last note. */
  note(value) {
    const j = JSON.stringify(value);
    if (j === this.past[this.past.length - 1]) return false;
    this.past.push(j);
    if (this.past.length > this.limit) this.past.shift();
    this.future = [];
    return true;
  }
  get canUndo() {
    return this.past.length > 1;
  }
  get canRedo() {
    return this.future.length > 0;
  }
  /** Step back. Returns the earlier value (a fresh copy), or null if there is nothing to undo. */
  undo() {
    if (!this.canUndo) return null;
    this.future.push(this.past.pop());
    return JSON.parse(this.past[this.past.length - 1]);
  }
  /** Step forward again. Returns the value, or null. */
  redo() {
    if (!this.canRedo) return null;
    this.past.push(this.future.pop());
    return JSON.parse(this.past[this.past.length - 1]);
  }
}
