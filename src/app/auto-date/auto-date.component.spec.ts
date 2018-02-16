import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoDateComponent } from './auto-date.component';

describe('AutoDateComponent', () => {
  let component: AutoDateComponent;
  let fixture: ComponentFixture<AutoDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
