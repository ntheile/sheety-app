import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingConfigComponent } from './thing-config.component';

describe('ThingConfigComponent', () => {
  let component: ThingConfigComponent;
  let fixture: ComponentFixture<ThingConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThingConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
