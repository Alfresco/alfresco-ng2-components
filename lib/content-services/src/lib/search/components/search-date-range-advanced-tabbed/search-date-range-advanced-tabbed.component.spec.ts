import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDateRangeAdvancedTabbedComponent } from './search-date-range-advanced-tabbed.component';

describe('SearchDateRangeAdvancedTabbedComponent', () => {
  let component: SearchDateRangeAdvancedTabbedComponent;
  let fixture: ComponentFixture<SearchDateRangeAdvancedTabbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchDateRangeAdvancedTabbedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDateRangeAdvancedTabbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
