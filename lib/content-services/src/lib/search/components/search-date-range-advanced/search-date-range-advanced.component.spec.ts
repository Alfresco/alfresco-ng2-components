import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDateRangeAdvancedComponent } from './search-date-range-advanced.component';

describe('SearchDateRangeAdvancedComponent', () => {
    let component: SearchDateRangeAdvancedComponent;
    let fixture: ComponentFixture<SearchDateRangeAdvancedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchDateRangeAdvancedComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SearchDateRangeAdvancedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should not set any date filter in context when Anytime option is selected', () => {

    });

    it('should set proper date filter in context when In the last option is selected', () => {

    });

    it('should not set any date filter in context when In the last option is selected, but no value is provided', () => {

    });

    it('should set proper date filter in context when Between option is selected', () => {

    });

    it('should not set any date filter in context when Between option is selected, but no value is provided in the dates', () => {

    });

    it('should clear context when widget is reset', () => {

    });

    it('should update display label with proper text when In the last/Between option is selected and values are properly set', () => {

    });

    it('should set values if initial value is provided', () => {

    });

    it('should not allow selecting a date after the current date when Between option is selected', () => {

    });
});
