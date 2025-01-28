/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/* eslint-disable @angular-eslint/component-selector */

import { Component, Input, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardViewItem } from '../../interfaces/card-view-item.interface';
import { CardItemTypeService } from '../../services/card-item-types.service';
import { CardViewItemDispatcherComponent } from './card-view-item-dispatcher.component';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';

@Component({
    selector: 'whatever-you-want-to-have',
    standalone: true,
    template: '<div data-automation-id="found-me">Hey I am shiny!</div>'
})
export class CardViewShinyCustomElementItemComponent {
    @Input() property: CardViewItem;
    @Input() editable: boolean;
}

describe('CardViewItemDispatcherComponent', () => {
    let fixture: ComponentFixture<CardViewItemDispatcherComponent>;
    let cardItemTypeService: CardItemTypeService;
    let component: CardViewItemDispatcherComponent;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        cardItemTypeService = new CardItemTypeService();
        cardItemTypeService.setComponentTypeResolver('shiny-custom-element', () => CardViewShinyCustomElementItemComponent);

        TestBed.configureTestingModule({
            imports: [CardViewItemDispatcherComponent, CardViewShinyCustomElementItemComponent],
            providers: [{ provide: CardItemTypeService, useValue: cardItemTypeService }]
        });

        TestBed.compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewItemDispatcherComponent);
        component = fixture.componentInstance;
        component.property = {
            type: 'shiny-custom-element',
            label: 'Shiny custom element',
            value: null,
            key: 'customkey',
            default: '',
            editable: false,
            get displayValue(): string {
                return 'custom value displayed';
            }
        };
        component.editable = true;
        component.displayEmpty = true;
        testingUtils = new UnitTestingUtils(fixture.debugElement);

        fixture.detectChanges();
        component.ngOnChanges({});
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    describe('Sub-component creation', () => {
        it('should load the CardViewShinyCustomElementItemComponent', () => {
            const innerElement = testingUtils.getByDataAutomationId('found-me');
            expect(innerElement).not.toBeNull();
        });

        it('should load the CardViewShinyCustomElementItemComponent only ONCE', () => {
            component.ngOnChanges({});
            component.ngOnChanges({});
            component.ngOnChanges({});
            fixture.detectChanges();

            const shinyCustomElementItemComponent = testingUtils.getAllByCSS('whatever-you-want-to-have');

            expect(shinyCustomElementItemComponent.length).toEqual(1);
        });

        it('should pass through the property, editable and displayEmpty parameters', () => {
            const shinyCustomElementItemComponent = testingUtils.getByCSS('whatever-you-want-to-have').componentInstance;

            expect(shinyCustomElementItemComponent.property).toBe(component.property);
            expect(shinyCustomElementItemComponent.editable).toBe(component.editable);
            expect(shinyCustomElementItemComponent.displayEmpty).toBe(component.displayEmpty);
        });

        it('should update the subcomponent input parameters', () => {
            const expectedEditable = false;
            const expectedDisplayEmpty = true;
            const expectedProperty = {};
            const expectedCustomInput = 1;
            const expectedDisplayNoneOption = false;
            const expectedDisplayClearAction = false;
            const expectedDisplayLabel = true;

            component.ngOnChanges({
                editable: new SimpleChange(true, expectedEditable, false),
                displayEmpty: new SimpleChange(false, expectedDisplayEmpty, false),
                property: new SimpleChange(null, expectedProperty, false),
                customInput: new SimpleChange(0, expectedCustomInput, false),
                displayNoneOption: new SimpleChange(true, expectedDisplayNoneOption, false),
                displayClearAction: new SimpleChange(true, expectedDisplayClearAction, false),
                displayLabelForChips: new SimpleChange(false, expectedDisplayLabel, false)
            });

            const shinyCustomElementItemComponent = testingUtils.getByCSS('whatever-you-want-to-have').componentInstance;
            expect(shinyCustomElementItemComponent.property).toBe(expectedProperty);
            expect(shinyCustomElementItemComponent.editable).toBe(expectedEditable);
            expect(shinyCustomElementItemComponent.displayEmpty).toBe(expectedDisplayEmpty);
            expect(shinyCustomElementItemComponent.customInput).toBe(expectedCustomInput);
            expect(shinyCustomElementItemComponent.displayNoneOption).toBe(expectedDisplayNoneOption);
            expect(shinyCustomElementItemComponent.displayClearAction).toBe(expectedDisplayClearAction);
            expect(shinyCustomElementItemComponent.displayLabelForChips).toBe(expectedDisplayLabel);
        });
    });

    describe('Angular life-cycle methods', () => {
        let shinyCustomElementItemComponent: any;

        const lifeCycleMethods = [
            'ngOnChanges',
            'ngOnInit',
            'ngDoCheck',
            'ngAfterContentInit',
            'ngAfterContentChecked',
            'ngAfterViewInit',
            'ngAfterViewChecked',
            'ngOnDestroy'
        ];

        beforeEach(() => {
            shinyCustomElementItemComponent = testingUtils.getByCSS('whatever-you-want-to-have').componentInstance;
        });

        it('should call through the life-cycle methods', () => {
            lifeCycleMethods.forEach((lifeCycleMethod) => {
                shinyCustomElementItemComponent[lifeCycleMethod] = () => {};
                spyOn(shinyCustomElementItemComponent, lifeCycleMethod);
                const param = {};

                component[lifeCycleMethod].call(component, param);

                expect(shinyCustomElementItemComponent[lifeCycleMethod]).toHaveBeenCalledWith(param);
            });
        });

        it('should NOT call through the life-cycle methods if the method does not exist (no error should be thrown)', () => {
            const param = {};
            lifeCycleMethods.forEach((lifeCycleMethod) => {
                shinyCustomElementItemComponent[lifeCycleMethod] = undefined;

                const execution = () => {
                    component[lifeCycleMethod].call(component, param);
                };

                expect(execution).not.toThrowError();
            });
        });
    });
});
