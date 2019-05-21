import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingTransformComponent } from './thing-transform.component';

describe('ThingTransformComponent', () => {
  let component: ThingTransformComponent;
  let fixture: ComponentFixture<ThingTransformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThingTransformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingTransformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
