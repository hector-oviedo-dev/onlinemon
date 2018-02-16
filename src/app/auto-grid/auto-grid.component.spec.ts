import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoGridComponent } from './auto-grid.component';

describe('AutoGridComponent', () => {
  let component: AutoGridComponent;
  let fixture: ComponentFixture<AutoGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
