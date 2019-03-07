import { isDevMode } from '@angular/core';

export class StateDeclaration {
  // The states that can move to this state.
  // If empty, all states can move to this one
  public from: string[];

  // The states that this state move to.
  // If empty, this state cna move to any
  // state
  public to: string[];

  constructor(
    public stateName: string,
    _from?: string | string[],
    _to?: string | string[]
  ) {
    if (!!_from) this.from = Array.isArray(_from) ? _from : [_from];
    if (!!_to) this.to = Array.isArray(_to) ? _to : [_to];
  }
}

export class Machine {
  public states: Map<string, StateDeclaration>;

  constructor(public state: string, ...states: StateDeclaration[]) {
    this.states = arraytostatemap(states);
  }

  public nextstate(stateName: string) {
    const newStateDeclaration = this.states.get(stateName);
    const currentStateDeclaration = this.states.get(this.state);
    if (
      !!newStateDeclaration &&
      newStateDeclaration.stateName !== currentStateDeclaration.stateName
    ) {
      if (
        (!newStateDeclaration.from ||
          newStateDeclaration.from.includes(
            currentStateDeclaration.stateName
          )) &&
        (!currentStateDeclaration.to ||
          currentStateDeclaration.to.includes(newStateDeclaration.stateName))
      ) {
        if (isDevMode()) {
          console.info(
            `%cFrom state %c"${this.state}" %cto state %c"${stateName}"`,
            `color:#33cccc;font-size: 12px;`,
            `color:#333333;font-size: 12px;font-weight:bolder;`,
            `color:#33cccc;font-size: 12px;`,
            `color:#333333;font-size: 12px;font-weight:bolder;`,
          );
        }
        this.state = stateName;
      } else if (isDevMode()) {
        console.warn(`Cannot set the new state to "${stateName}"`);
      }
    }
  }

  public print(): void {
    console.warn(`The "print(...)" method has not been implemented yet`);
  }
}

export class StateMachine {
  protected static machines = new Map<string, Machine>();

  static create(
    machineName: string,
    initialState: string,
    ...states: StateDeclaration[]
  ): Machine {
    const machine = new Machine(initialState, ...states);
    this.machines.set(machineName, machine);
    return machine;
  }

  static get(name: string): Machine {
    return this.machines.get(name);
  }
}

// DECORATORS
export function StateAction(name: string): any {
  return function(_: Machine, propkey: string, descriptor: PropertyDescriptor) {
    if (
      descriptor &&
      descriptor.value &&
      typeof descriptor.value === 'function'
    ) {
      const value = descriptor.value;

      descriptor.value = function(...args) {
        if (this.state === name) {
          value.bind(this)(...args);
        } else if (isDevMode()) {
          const exsist = (this as Machine).states.has(name);

          if (exsist) {
            console.warn(
              `You cannot invoke "${propkey}(...)" on the current state.\nShould Be: ${name}\nIs: ${
                this.state
              }`
            );
          } else {
            console.warn(
              `The state "${name}" has not been declared, and so "${propkey}(...)" cannot be invoked.\n\n` +
                `- If it is meant to be a state in your machine, add it to your state declarations.\n` +
                `- If that isn't the problem, try checking your spelling`
            );
          }
        }
      };
    } else {
      console.warn(
        `The "@StateAction(...)" decorator can only be used on class methods, but was used on the "${propkey}" property.`
      );
    }
  };
}
// END DECORATORS

// HELPERS
function arraytostatemap(
  states: StateDeclaration[]
): Map<string, StateDeclaration> {
  const map = new Map<string, StateDeclaration>();

  for (const state of states) {
    map.set(state.stateName, state);
  }

  return map;
}
// END HELPERS
