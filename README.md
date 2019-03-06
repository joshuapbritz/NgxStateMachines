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

The `StateDeclaration` class can actually take up to three arguments (statename, from, to), but for now we will just use _statename_.

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

We now have the boilerplate of our component, so we can begin implementing a flow. To do this, let's start by defining the second and third parameters of our `StateDeclaration`. Those parameters are _from_ and _to_. As you can probably guess, these parameters allow you to control the exact flow of your state by letting you specify what states can be activated by or can activate other states. For example, our component will look something like this.

```typescript
import { Machine, StateDeclaration, StateAction } from 'src/app/machine';

export class AppComponent extends Machine implements OnInit {
  constructor() {
    super(
      'idle',
      new StateDeclaration('idle', 'done', 'fetching'),
      new StateDeclaration('fetching', 'idle', 'done'),
      new StateDeclaration('done', 'fetching', 'idle')
    );
  }

  ...
}
```

This may look a bit ridiculous right now becuase the states for this component are so simple, but when you are dealing with a lot of states, this will be a very useful tool. Now that we have our rules set up, we can implement our logic. To do this, we will make use of the `nextstate` provided by the Machine class. This will be used to moved between states. In our `onButtonClick` function let's add the following functionality.

```typescript
import { Machine, StateDeclaration, StateAction } from 'src/app/machine';

export class AppComponent extends Machine implements OnInit {
  ...

  @StateAction('idle')
  public onButtonClick(): void {
    this.nextstate('fetching');

    setTimeout(() => {
        this.onFetchSuccess('Fetch succeeded');
    }, 5000);
  }

  ...
}
```

### To-Do

- Add decorator for state specific properties
- Generate a state machine schema based on the machine's given states
- Detailed error handling
