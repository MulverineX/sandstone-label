import { SelectorClass, Selector, tag, _ } from "sandstone";
import { ConditionType } from "sandstone/flow/conditions";
import { SelectorProperties } from "sandstone/variables";

type SingleEntity = SelectorClass<true, boolean>;

/**
 * Label tag (/tag) handler
 */
export class LabelClass {
  /**
   * Label Tag name
   */
  public name: string;

  /**
   * Label Description (optional)
   */
  public description: string | boolean = false;

  public LabelHolder = (entity: SingleEntity | '@s' | '@p' | '@r') => {
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

// voodoo code I don't really understand
export type LabelInstance = (
  Omit<LabelClass, 'LabelHolder'> & LabelClass['LabelHolder']
)

/**
 * Creates a new label
 * @param label Label/tag name
 * @param description Label description (optional)
 */
 export function Label(label: string, description: string | false = false): LabelInstance {
  const createdLabel = new LabelClass(label, description);
  const value = createdLabel.LabelHolder;

  const { name: _, ...labelExceptName } = createdLabel;
  const labelInstance = Object.assign(
    createdLabel.LabelHolder,
    labelExceptName
  );
  const descriptor = Object.getOwnPropertyDescriptor(value, 'name');
  descriptor.value = createdLabel.name;
  Object.defineProperty(value, 'name', descriptor);

  return labelInstance;
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

    // Haha brrrrrrr
    let selector = Selector(entity.target as any, { ...entity.arguments }) as SingleEntity;

    if (selector.arguments) {
      if (selector.arguments.tag) {
        if (typeof selector.arguments.tag === 'string')
          selector.arguments.tag = [ selector.arguments.tag, label.name ];
        else
          selector.arguments.tag = [ ...selector.arguments.tag, label.name ];
      }
      else selector.arguments.tag = label.name;
    }
    else selector.arguments = { tag: label.name } as SelectorProperties<true, false>;

    this.selector = selector;
  }
}