import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessListCloudComponent } from './process-list-cloud.component';

describe('ProcessListCloudComponent', () => {
  let component: ProcessListCloudComponent;
  let fixture: ComponentFixture<ProcessListCloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessListCloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessListCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
