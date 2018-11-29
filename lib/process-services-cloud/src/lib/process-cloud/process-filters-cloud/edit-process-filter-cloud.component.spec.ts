import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProcessFilterCloudComponent } from './edit-process-filter-cloud.component';

describe('EditProcessFilterCloudComponent', () => {
  let component: EditProcessFilterCloudComponent;
  let fixture: ComponentFixture<EditProcessFilterCloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProcessFilterCloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProcessFilterCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
