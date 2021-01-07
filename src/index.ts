import { tag } from 'sandstone/commands';
import { Selector, SelectorClass } from 'sandstone/variables';
import { _ } from 'sandstone/_internals';
import { ConditionType } from 'sandstone/_internals/flow/conditions';
import { SelectorProperties } from 'sandstone/_internals/variables/selector';

type SingleEntity = SelectorClass<true, boolean>;

/**
 * Label tag (/tag) handler
 */
export class LabelClass {
  /**
   * Label Tag name
   */
  public name;

  /**
   * Label Description (optional)
   */
  public description: string | boolean = false;

  public LabelHolder (entity: SingleEntity | '@s' | '@p' | '@r') {
    if (typeof entity === 'string') 
      return new EntityLabel(Selector(entity), this);
    else
      return new EntityLabel(entity, this);
  }

  /**
   * Contains the name and description of the Label (eg. 'wasd:is_walking; Whether the player is not mounted')
   */
  public toString = () => `${this.name}${this.description ? `; ${this.description}` : ''}`

  constructor (name: string, description: string | false) {
    this.name = name

    if (description) this.description = description;
  }
}

export class EntityLabel {

  /** Label */
  public label: LabelClass;

  /**
   * Selects entity with the label
   */
  public selector: SingleEntity;
  
  /**
   * Selects entity
   */
  public originalSelector: SingleEntity;

  public _toMinecraftCondition() {
    return { value: ['if', 'entity', this.selector.toString()] as any[] };
  };

  /** Test for label on entity */
  public test = this as ConditionType;

  /**
   * Add label to entity
   */
  public add = () => tag(this.originalSelector).add(this.label.name);

  /**
   * Remove label from entity
   */
  public remove = () => tag(this.originalSelector).remove(this.label.name);

  /**
   * Set label on/off for entity
   */
  public set (set: boolean | ConditionType) {
    if (typeof set === 'boolean') {
      if (set) this.add();
      else this.remove();
    }
    else _.if(set, () => this.add())
    .else(() => this.remove());
  };

  /**
   * Toggle label on/off for entity
   */
  public toggle() {
    _.if(this.test, () => this.remove())
    .else(() => this.add())
  }

  /**
   * Contains the selector, and the name/description of the Label (eg. 'Whether @s has the label wasd:is_walking; Whether the player is not mounted')
   */
  public toString = () => `Whether ${this.originalSelector.toString()} has the label ${this.label.toString()}`;

  constructor (entity: SingleEntity, label: LabelClass) {
    this.originalSelector = entity;
    this.label = label;

    if (entity.arguments) {
      if (entity.arguments.tag) {
        if (typeof entity.arguments.tag === 'string')
          entity.arguments.tag = [ entity.arguments.tag, label.name ];
        else
          entity.arguments.tag = [ ...entity.arguments.tag, label.name ];
      }
      else entity.arguments.tag = label.name;
    }
    else entity.arguments = { tag: label.name } as SelectorProperties<true, false>;

    this.selector = entity;
  }
}

/**
 * Creates a new label
 * @param label Label/tag name
 * @param description Label description (optional)
 */
export function createLabel(label: string, description: string | false = false) {
  return new LabelClass(label, description);
}

type input = LabelClass | string;

const self = (label: input) => 
  (typeof label === 'string' ? createLabel(label) : label).LabelHolder('@s');

/**
 * Adds label to `@s`
 * @param label Label
 */
export function addLabel (label: input) {
  const target = self(label);
  target.add();
  return target;
}

/**
 * Removes label from `@s`
 * @param label Label
 */
export function removeLabel(label: input) {
  const target = self(label);
  target.remove();
  return target;
}

export function setLabel (label: input, set: boolean | ConditionType) {
  const target = self(label);
  target.set(set);
  return target;
}

export function toggleLabel (label: input) {
  const target = self(label);
  target.toggle();
  return target;
}

/**
 * Test for label on `@s`
 * @param label Label
 */
export function hasLabel(label: input) {
  return self(label).test
}