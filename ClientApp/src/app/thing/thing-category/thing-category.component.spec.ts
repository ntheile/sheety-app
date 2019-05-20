import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingCategoryComponent } from './thing-category.component';

describe('ThingCategoryComponent', () => {
  let component: ThingCategoryComponent;
  let fixture: ComponentFixture<ThingCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThingCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
