import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadNewVersionDialogComponent } from './upload-new-version.dialog';

describe('UploadNewVersionDialog', () => {
  let component: UploadNewVersionDialogComponent;
  let fixture: ComponentFixture<UploadNewVersionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadNewVersionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadNewVersionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
