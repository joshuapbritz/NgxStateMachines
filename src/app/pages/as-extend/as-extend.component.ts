import { Component, OnInit } from '@angular/core';
import {
  Machine,
  StateDeclaration,
  StateAction,
  StateProp,
} from 'src/app/machine';

@Component({
  selector: 'app-as-extend',
  templateUrl: './as-extend.component.html',
  styleUrls: ['./as-extend.component.scss'],
})
export class AsExtendComponent extends Machine implements OnInit {
  @StateProp('done')
  public data: any;

  constructor() {
    super(
      'idle',
      new StateDeclaration('idle', 'done', 'fetching'),
      new StateDeclaration('fetching', 'idle', ['parsing', 'done']),
      new StateDeclaration('parsing', 'fetching', 'done'),
      new StateDeclaration('done', ['fetching', 'parsing'], 'idle')
    );
  }

  public ngOnInit(): void {}

  @StateAction('idle')
  public async click(): Promise<void> {
    this.nextstate('fetching');

    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(result => {
        this.success(result);
      })
      .catch(err => {
        this.error('There was a problem fetching the data');
      });
  }

  @StateAction('fetching')
  public success(data: any): void {
    this.nextstate('parsing');

    try {
      this.parse(JSON.parse(data));
    } catch (error) {
      this.parse(data);
    }
  }

  @StateAction('fetching')
  public error(message: any): void {
    this.nextstate('done');

    this.displayData(message);
  }

  @StateAction('parsing')
  private parse(data: any): void {
    this.nextstate('done');

    try {
      this.displayData((JSON.parse(data).length || 0) + ' items found');
    } catch (error) {
      this.displayData((data.length || 0) + ' items found');
    }
  }

  @StateAction('done')
  public displayData(data: any): void {
    this.data = data;
  }

  @StateAction('done')
  public doFetch(): void {
    this.nextstate('fetching');
  }

  @StateAction('done')
  public reset(data: any): void {
    this.data = void 0;
    this.nextstate('idle');
  }
}
