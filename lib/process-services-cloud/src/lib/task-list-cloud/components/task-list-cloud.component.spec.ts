import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListCloudComponent } from './task-list-cloud.component';

describe('TaskListCloudComponent', () => {
  let component: TaskListCloudComponent;
  let fixture: ComponentFixture<TaskListCloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskListCloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
