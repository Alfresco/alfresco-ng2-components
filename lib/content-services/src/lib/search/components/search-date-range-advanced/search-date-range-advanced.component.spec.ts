import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDateRangeAdvancedComponent } from './search-date-range-advanced.component';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../../../testing/content.testing.module';

describe('SearchDateRangeAdvancedComponent', () => {
    let component: SearchDateRangeAdvancedComponent;
    let fixture: ComponentFixture<SearchDateRangeAdvancedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchDateRangeAdvancedComponent],
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SearchDateRangeAdvancedComponent);
        component = fixture.componentInstance;
        component.id = 'date-range-advanced';
        component.context = {
            queryFragments: {
                date: ''
            },
            update: jasmine.createSpy()
        } as any;

        fixture.detectChanges();
    });

    const getElementByDataAutomationId = (dataAutomationId) => {
        return fixture.debugElement.query(By.css(`[data-automation-id="${dataAutomationId}"]`)).nativeElement;
    }

    const clickElementByAutomationId = async (elementDataAutomationId) => {
        const el = getElementByDataAutomationId(elementDataAutomationId);
        el.dispatchEvent(new Event('click'));
        await fixture.whenStable();
        fixture.detectChanges();
    }

    const enterValueInInputField = async (inputElementId: string, value: string) => {
        const inputField = getElementByDataAutomationId(inputElementId);
        inputField.value = value;
        inputField.dispatchEvent(new Event('input'));
        await fixture.whenStable();
        fixture.detectChanges();
    }

    const selectDropdownOption = (itemId: string) => {
        const matSelect = fixture.debugElement.query(By.css('[data-automation-id="date-range-advanced-in-last-dropdown"]')).nativeElement;
        matSelect.click();
        fixture.detectChanges();
        const matOption = fixture.debugElement.query(By.css(`[data-automation-id="${itemId}"]`)).nativeElement;
        matOption.click();
        fixture.detectChanges();
    };

    it('should not set any date filter in context when Anytime option is selected', async () => {
        await clickElementByAutomationId('date-range-advanced-anytime');
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        expect(component.context.queryFragments[component.id]).toBe('');
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should set proper date filter in context when In the last option is selected', async () => {
        await clickElementByAutomationId('date-range-advanced-in-last');
        await enterValueInInputField('date-range-advanced-in-last-input', '5');
        await selectDropdownOption('date-range-advanced-in-last-option-days')
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        let query = '[NOW/DAY-5DAYS TO NOW/DAY+1DAY]';
        expect(component.context.queryFragments[component.id]).toBe(query);
        expect(component.context.update).toHaveBeenCalled();

        await clickElementByAutomationId('date-range-advanced-in-last');
        await enterValueInInputField('date-range-advanced-in-last-input', '3');
        await selectDropdownOption('date-range-advanced-in-last-option-weeks');
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        query = '[NOW/DAY-3WEEKS TO NOW/DAY+1DAY]';
        expect(component.context.queryFragments[component.id]).toBe(query);
        expect(component.context.update).toHaveBeenCalled();

        await clickElementByAutomationId('date-range-advanced-in-last');
        await enterValueInInputField('date-range-advanced-in-last-input', '6');
        await selectDropdownOption('date-range-advanced-in-last-option-months');
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        query = '[NOW/DAY-6MONTHS TO NOW/DAY+1DAY]';
        expect(component.context.queryFragments[component.id]).toBe(query);
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should not set any date filter in context when In the last or Between option is selected, but no value is provided', async () => {
        await clickElementByAutomationId('date-range-advanced-in-last');
        await selectDropdownOption('date-range-advanced-in-last-option-weeks')
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        expect(component.context.queryFragments[component.id]).toBe('');
        expect(component.context.update).toHaveBeenCalled();

        await clickElementByAutomationId('date-range-advanced-between');
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        expect(component.context.queryFragments[component.id]).toBe('');
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should set proper date filter in context when Between option is selected', async () => {
        // TODO might need to get updated with date-fns
        await clickElementByAutomationId('date-range-advanced-between');
        await enterValueInInputField('date-range-advanced-between-start-input', '05/06/2023');
        await enterValueInInputField('date-range-advanced-between-end-input', '10/06/2023');
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        let query = '[NOW/DAY-5DAYS TO NOW/DAY+1DAY]';
        expect(component.context.queryFragments[component.id]).toBe(query);
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should clear context when widget is reset', async () => {
        component.context.queryFragments[component.id] = '[NOW/DAY-5DAYS TO NOW/DAY+1DAY]';
        await clickElementByAutomationId('date-range-advanced-clear-btn');
        expect(component.context.queryFragments[component.id]).toBe('');
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should update display label with proper text when In the last/Between option is selected and values are properly set', async () => {
        spyOn(component.displayValue$, 'next');

        await clickElementByAutomationId('date-range-advanced-in-last');
        await enterValueInInputField('date-range-advanced-in-last-input', '5');
        await selectDropdownOption('date-range-advanced-in-last-option-days')
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        expect(component.displayValue$.next).toHaveBeenCalledWith('In the last 5 days');

        await enterValueInInputField('date-range-advanced-in-last-input', '3');
        await selectDropdownOption('date-range-advanced-in-last-option-weeks')
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        expect(component.displayValue$.next).toHaveBeenCalledWith('In the last 3 weeks');

        await enterValueInInputField('date-range-advanced-in-last-input', '7');
        await selectDropdownOption('date-range-advanced-in-last-option-months')
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        expect(component.displayValue$.next).toHaveBeenCalledWith('In the last 7 months');

        //TODO: Might need to be updated with date-fns
        await clickElementByAutomationId('date-range-advanced-between');
        await enterValueInInputField('date-range-advanced-between-start-input', '05/06/2023');
        await enterValueInInputField('date-range-advanced-between-end-input', '10/06/2023');
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        expect(component.displayValue$.next).toHaveBeenCalledWith('Between 05-Jun-2023 - 10-Jun-2023');
    });

    it('should not update display label if anytime option is selected', async() => {
        spyOn(component.displayValue$, 'next');

        await clickElementByAutomationId('date-range-advanced-anytime');
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        expect(component.displayValue$.next).toHaveBeenCalledWith('');
    });

    it('should not update display label if no valid value was provided', async () => {
        spyOn(component.displayValue$, 'next');

        await clickElementByAutomationId('date-range-advanced-in-last');
        await selectDropdownOption('date-range-advanced-in-last-option-weeks')
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        expect(component.displayValue$.next).toHaveBeenCalledWith('');

        await clickElementByAutomationId('date-range-advanced-between');
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        expect(component.displayValue$.next).toHaveBeenCalledWith('');
    });

    it('should set values if initial value is provided', () => {
        let value: any = {
            dateRangeType: component.DateRangeType.ANY
        }
        component.startValue = value;
        component.ngOnInit();
        expect(component.getCurrentValue()).toBe(value);

        value = {
            dateRangeType: component.DateRangeType.IN_LAST,
            inLastValue: 5,
            inLastValueType: component.InLastDateType.WEEKS
        }
        component.startValue = value;
        component.ngOnInit();
        expect(component.getCurrentValue()).toBe(value);

        //TODO: Might need to be changed after date-fns
        value = {
            dateRangeType: component.DateRangeType.BETWEEN,
            betweenStartDate: '05/06/2023',
            betweenEndDate: '10/06/2023'
        }
        component.startValue = value;
        component.ngOnInit();
        expect(component.getCurrentValue()).toBe(value);
    });

    it('should not allow selecting a date after the current date when Between option is selected', () => {
        //TODO: Will need to be updated after date-fns
    });
});
