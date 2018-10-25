import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleCloudComponent } from './people-cloud.component';

describe('PeopleCloudComponent', () => {
  let component: PeopleCloudComponent;
  let fixture: ComponentFixture<PeopleCloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleCloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
