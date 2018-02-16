import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoRadioComponent } from './auto-radio.component';

describe('AutoRadioComponent', () => {
  let component: AutoRadioComponent;
  let fixture: ComponentFixture<AutoRadioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoRadioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
