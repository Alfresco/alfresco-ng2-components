import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessFilterDialogCloudComponent } from './process-filter-dialog-cloud.component';

describe('ProcessFilterDialogCloudComponent', () => {
  let component: ProcessFilterDialogCloudComponent;
  let fixture: ComponentFixture<ProcessFilterDialogCloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessFilterDialogCloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessFilterDialogCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
