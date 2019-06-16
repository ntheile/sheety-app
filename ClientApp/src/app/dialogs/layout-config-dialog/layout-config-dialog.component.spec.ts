import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutConfigDialogComponent } from './layout-config-dialog.component';

describe('LayoutConfigDialogComponent', () => {
  let component: LayoutConfigDialogComponent;
  let fixture: ComponentFixture<LayoutConfigDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutConfigDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
