import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartTaskCloudComponent } from './start-task-cloud.component';

describe('StartTaskCloudComponent', () => {
  let component: StartTaskCloudComponent;
  let fixture: ComponentFixture<StartTaskCloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartTaskCloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartTaskCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
