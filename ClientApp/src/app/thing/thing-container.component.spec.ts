import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingContainerComponent } from './thing-container.component';

describe('ThingContainerComponent', () => {
  let component: ThingContainerComponent;
  let fixture: ComponentFixture<ThingContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThingContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
