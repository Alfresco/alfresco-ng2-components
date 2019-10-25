/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

/* tslint:disable:component-selector  */

import { Component, Input, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { CardViewItem } from '../../interfaces/card-view-item.interface';
import { CardItemTypeService } from '../../services/card-item-types.service';
import { CardViewContentProxyDirective } from '../../directives/card-view-content-proxy.directive';
import { CardViewItemDispatcherComponent } from '../card-view-item-dispatcher/card-view-item-dispatcher.component';

@Component({
    selector: 'whatever-you-want-to-have',
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

    beforeEach(async(() => {
        cardItemTypeService = new CardItemTypeService();
        cardItemTypeService.setComponentTypeResolver('shiny-custom-element', () => CardViewShinyCustomElementItemComponent);

        TestBed.configureTestingModule({
            declarations: [
                CardViewItemDispatcherComponent,
                CardViewShinyCustomElementItemComponent,
                CardViewContentProxyDirective
            ],
            providers: [ { provide: CardItemTypeService, useValue: cardItemTypeService } ]
        });

        // entryComponents are not supported yet on TestBed, that is why this ugly workaround:
        // https://github.com/angular/angular/issues/10760
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: { entryComponents: [ CardViewShinyCustomElementItemComponent ] }
        });

        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewItemDispatcherComponent);
        component = fixture.componentInstance;
        component.property = <CardViewItem> {
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

        fixture.detectChanges();
        component.ngOnChanges({});
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    describe('Sub-component creation', () => {

        it('should load the CardViewShinyCustomElementItemComponent', () => {
            const innerElement = fixture.debugElement.query(By.css('[data-automation-id="found-me"]'));
            expect(innerElement).not.toBeNull();
        });

        it('should load the CardViewShinyCustomElementItemComponent only ONCE', () => {
            component.ngOnChanges({});
            component.ngOnChanges({});
            component.ngOnChanges({});
            fixture.detectChanges();

            const shinyCustomElementItemComponent = fixture.debugElement.queryAll(By.css('whatever-you-want-to-have'));

            expect(shinyCustomElementItemComponent.length).toEqual(1);
        });

        it('should pass through the property, editable and displayEmpty parameters', () => {
            const shinyCustomElementItemComponent = fixture.debugElement.query(By.css('whatever-you-want-to-have')).componentInstance;

            expect(shinyCustomElementItemComponent.property).toBe(component.property);
            expect(shinyCustomElementItemComponent.editable).toBe(component.editable);
            expect(shinyCustomElementItemComponent.displayEmpty).toBe(component.displayEmpty);
        });

        it('should update the subcomponent\'s input parameters', () => {
            const expectedEditable = false,
                expectedDisplayEmpty = true,
                expectedProperty = <CardViewItem> {},
                expectedCustomInput = 1,
                expectedDisplayNoneOption = false,
                expectedDisplayClearAction = false;

            component.ngOnChanges({
                editable: new SimpleChange(true, expectedEditable, false),
                displayEmpty: new SimpleChange(false, expectedDisplayEmpty, false),
                property: new SimpleChange(null, expectedProperty, false),
                customInput: new SimpleChange(0, expectedCustomInput, false),
                displayNoneOption: new SimpleChange(true, expectedDisplayNoneOption, false),
                displayClearAction: new SimpleChange(true, expectedDisplayClearAction, false)
            });

            const shinyCustomElementItemComponent = fixture.debugElement.query(By.css('whatever-you-want-to-have')).componentInstance;
            expect(shinyCustomElementItemComponent.property).toBe(expectedProperty);
            expect(shinyCustomElementItemComponent.editable).toBe(expectedEditable);
            expect(shinyCustomElementItemComponent.displayEmpty).toBe(expectedDisplayEmpty);
            expect(shinyCustomElementItemComponent.customInput).toBe(expectedCustomInput);
            expect(shinyCustomElementItemComponent.displayNoneOption).toBe(expectedDisplayNoneOption);
            expect(shinyCustomElementItemComponent.displayClearAction).toBe(expectedDisplayClearAction);
        });
    });

    describe('Angular life-cycle methods', () => {

        let shinyCustomElementItemComponent;

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
            shinyCustomElementItemComponent = fixture.debugElement.query(By.css('whatever-you-want-to-have')).componentInstance;
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
