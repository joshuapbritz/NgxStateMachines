# Ngx State Machines

This is an attempt to use state machines as an extension of the Angular platform. The most important thing about this experiment for me, was to make sure that the actions for each state were part of the Angular component itself, and won't have to be called via a key lookup layer.

---

## Usage

To use the state machine in an Angular component, you have to extend the class of the component you want to use it in with the `Machine` base class.

```typescript
import { Machine, StateDeclaration, StateAction } from 'src/app/machine';


export class AppComponent extends Machine implements OnInit {
 ...
}
```

next you will have to set up you states for the components. You do this by specifing your parameters in the arguments of you super call. The first argument will be the name of your initial state. The following arguments will be the definitions of the states that your component can be in. You can have as many states as you want.

```typescript
import { Machine, StateDeclaration, StateAction } from 'src/app/machine';

export class AppComponent extends Machine implements OnInit {
  constructor() {
    super(
      'idle',
      new StateDeclaration('idle'),
      new StateDeclaration('fetching'),
      new StateDeclaration('done')
    );
  }
}
```

The `StateDeclaration` class can actually take up to three arguments (statename, from, to), but for now we will just use *statename*.

So, we now have three states in our component: an idle state, a fetching state, and a done state. Now we need to create actions for those states. To do this, we use the `@StateAction` decorator.

```typescript
import { Machine, StateDeclaration, StateAction } from 'src/app/machine';

export class AppComponent extends Machine implements OnInit {
  constructor() {
    super(
      'idle',
      new StateDeclaration('idle'),
      new StateDeclaration('fetching'),
      new StateDeclaration('done')
    );
  }

  @StateAction('idle')
  public onButtonClick(): void { ... }

  @StateAction('fetching')
  public onFetchSuccess(data: any): void { ... }

  @StateAction('fetching')
  public onFetchError(message: string): void { ... }

  @StateAction('done')
  public displayFetchedData(date: any): void { ... }

  @StateAction('done')
  public reset(): void { ... }
}
```


### To-Do

- Add decorator for state specific properties
- Generate a state machine schema based on the machine's given states
- Detailed error handling
