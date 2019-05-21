import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingFacetsComponent } from './thing-facets.component';

describe('ThingFacetsComponent', () => {
  let component: ThingFacetsComponent;
  let fixture: ComponentFixture<ThingFacetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThingFacetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingFacetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
