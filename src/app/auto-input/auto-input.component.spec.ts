import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoInputComponent } from './auto-input.component';

describe('AutoInputComponent', () => {
  let component: AutoInputComponent;
  let fixture: ComponentFixture<AutoInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
