import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterTabbedComponent } from './search-filter-tabbed.component';

describe('SearchFilterTabbedComponent', () => {
  let component: SearchFilterTabbedComponent;
  let fixture: ComponentFixture<SearchFilterTabbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchFilterTabbedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFilterTabbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
