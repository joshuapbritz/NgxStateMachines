import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsExtendComponent } from './as-extend.component';

describe('AsExtendComponent', () => {
  let component: AsExtendComponent;
  let fixture: ComponentFixture<AsExtendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsExtendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
