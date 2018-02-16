import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoTextareaComponent } from './auto-textarea.component';

describe('AutoTextareaComponent', () => {
  let component: AutoTextareaComponent;
  let fixture: ComponentFixture<AutoTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
