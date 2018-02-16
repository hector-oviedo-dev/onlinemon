import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoChecklistComponent } from './auto-checklist.component';

describe('AutoChecklistComponent', () => {
  let component: AutoChecklistComponent;
  let fixture: ComponentFixture<AutoChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
