import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ETLComponent } from './etl.component';

describe('ETLComponent', () => {
  let component: ETLComponent;
  let fixture: ComponentFixture<ETLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ETLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ETLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
