import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessServicesCloudComponent } from './process-services-cloud.component';

describe('ProcessServicesCloudComponent', () => {
  let component: ProcessServicesCloudComponent;
  let fixture: ComponentFixture<ProcessServicesCloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessServicesCloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessServicesCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
