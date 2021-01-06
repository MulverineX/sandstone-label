import { execute, tag } from "sandstone/commands";
import { Selector } from "sandstone/variables";

const namespace = { full: 'wasd', short: 'wasd' };

/**
 * Label tag (/tag) handler
 */
export class Label {
  /**
   * Label name
   */
  public name;

  /**
   * Full Tag Name
   */
  public raw_name;

  /**
   * Selector to test for label, ie. `execute.as(foo.test())`
   */
  public test;

  constructor (name: string) {
    this.name = name;
    this.raw_name = `${namespace.full}.${name}`;

    this.test = Selector('@s', { tag: this.raw_name });
  }
}

/**
 * Creates a new label
 * @param label Label/tag name
 */
export function newLabel(label: string) {
  return new Label(label);
}

/**
 * Adds label to `@s`
 * @param label Label
 */
export function addLabel(label: Label) {
  tag('@s').add(label.raw_name)
}

/**
 * Removes label from `@s`
 * @param label Label
 */
export function removeLabel(label: Label) {
  tag('@s').remove(label.raw_name)
}

/**
 * Removes label from `@s`
 * @param label Label
 * @param run Function to run
 */
export function hasLabel(label: Label, run: () => void) {
  execute.as(label.test).run(run);
}