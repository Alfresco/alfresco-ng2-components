import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDateRangeAdvancedComponent } from './search-date-range-advanced.component';

describe('SearchDateRangeAdvancedComponent', () => {
  let component: SearchDateRangeAdvancedComponent;
  let fixture: ComponentFixture<SearchDateRangeAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchDateRangeAdvancedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDateRangeAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
