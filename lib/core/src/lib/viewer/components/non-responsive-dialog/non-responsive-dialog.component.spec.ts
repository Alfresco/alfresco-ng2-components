import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonResponsiveDialogComponent } from './non-responsive-dialog.component';

describe('NonResponsiveDialogComponent', () => {
  let component: NonResponsiveDialogComponent;
  let fixture: ComponentFixture<NonResponsiveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonResponsiveDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonResponsiveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
