/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { SearchFilterTabbedComponent } from './search-filter-tabbed.component';

describe('SearchFilterTabbedComponent', () => {
    let component: SearchFilterTabbedComponent;
    let fixture: ComponentFixture<SearchFilterTabbedComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [SearchFilterTabbedComponent],
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ]
        });

        fixture = TestBed.createComponent(SearchFilterTabbedComponent);
        component = fixture.componentInstance;
        component.id = 'tabbed';
        component.context = {
            queryFragments: {
                field1: '',
                field2: ''
            },
            update: jasmine.createSpy()
        } as any;
        component.settings = {
            field: undefined,
            hideDefaultAction: true,
            displayLabelSeparator: ';',
            tabs: [
                {
                    id: 'widget1',
                    tabDisplayLabel: 'Widget1',
                    component: {
                        settings: {
                            field: 'field1'
                        }
                    }
                },
                {
                    id: 'widget2',
                    tabDisplayLabel: 'Widget2',
                    component: {
                        settings: {
                            field: 'field2'
                        }
                    }
                }
            ]
        };
        fixture.detectChanges();
    });

    function getButtonByDataAutomationId(buttonDataAutomationId: string) {
        return fixture.debugElement.query(By.css(`[data-automation-id="${buttonDataAutomationId}"]`)).nativeElement;
    }

    it('should update displayLabel when inner widgets display label is updated', async () => {
        spyOn(component.displayValue$, 'next');
        fixture.detectChanges();
        component.widgetContainerComponentList.get(0).componentRef.instance.displayValue$.next('test-label-1');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.displayValue$.next).toHaveBeenCalledWith('Widget1 test-label-1');

        component.widgetContainerComponentList.get(1).componentRef.instance.displayValue$.next('test-label-2');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.displayValue$.next).toHaveBeenCalledWith('Widget1 test-label-1; Widget2 test-label-2');
    });

    it('should call submitValues for inner widgets and update context when apply button is clicked', () => {
        component.widgetContainerComponentList.forEach(widget => {
            spyOn(widget, 'applyInnerWidget');
        });
        const resetButton = getButtonByDataAutomationId('tab-apply-btn');
        resetButton.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        component.widgetContainerComponentList.forEach(widget => {
            expect(widget.applyInnerWidget).toHaveBeenCalled();
        });
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should reset inner widgets when clear button is clicked', () => {
        component.widgetContainerComponentList.forEach(widget => {
            spyOn(widget, 'resetInnerWidget');
        });
        const resetButton = getButtonByDataAutomationId('tab-clear-btn');
        resetButton.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        component.widgetContainerComponentList.forEach(widget => {
            expect(widget.resetInnerWidget).toHaveBeenCalled();
        });
    });

    it('should have valid value when inner widgets have valid values', () => {
        component.widgetContainerComponentList.forEach(widget => {
            spyOn(widget, 'hasValueSelected').and.returnValue(true);
        });
        expect(component.hasValidValue()).toBe(true);
    });

    it('should set values on init for inner widgets if initial value is provided', () => {
        component.widgetContainerComponentList.forEach(widget => {
            spyOn(widget, 'setValue');
        });
        const valueForWidget1 = {
            testStringValue: 'test value',
            testNumberValue: 28
        }
        const valueForWidget2 = {
            testBooleanValue: false,
            testStringValue: 'test value'
        }
        component.startValue = {
            widget1: valueForWidget1,
            widget2: valueForWidget2
        }
        component.ngOnInit();
        component.widgetContainerComponentList.forEach(widget => {
            const value = component.startValue[widget.id];
            expect(widget.setValue).toHaveBeenCalledWith(value);
        });
    });
});
