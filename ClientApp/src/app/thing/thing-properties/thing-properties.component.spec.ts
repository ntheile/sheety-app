import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingPropertiesComponent } from './thing-properties.component';

describe('ThingPropertiesComponent', () => {
  let component: ThingPropertiesComponent;
  let fixture: ComponentFixture<ThingPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThingPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
