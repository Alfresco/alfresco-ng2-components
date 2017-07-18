/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { CardViewItem } from '../../interface/card-view-item.interface';
import { CardViewContentProxyDirective } from './card-view-content-proxy.directive';
import { CardViewItemDispatcherComponent } from './card-view-item-dispatcher.component';

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
    let component: CardViewItemDispatcherComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [
                CardViewItemDispatcherComponent,
                CardViewShinyCustomElementItemComponent,
                CardViewContentProxyDirective
            ],
            providers: []
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

        fixture.detectChanges();
        component.ngOnChanges(null);
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    describe('Subcompomnent creation', () => {

        it('should load the CardViewShinyCustomElementItemComponent', () => {
            const innerElement = fixture.debugElement.query(By.css('[data-automation-id="found-me"]'));
            expect(innerElement).not.toBeNull();
        });

        it('should load the CardViewShinyCustomElementItemComponent only ONCE', () => {
            component.ngOnChanges();
            component.ngOnChanges();
            component.ngOnChanges();
            fixture.detectChanges();

            const shinyCustomElementItemComponent = fixture.debugElement.queryAll(By.css('whatever-you-want-to-have'));

            expect(shinyCustomElementItemComponent.length).toEqual(1);
        });

        it('should pass through the property and editable parameters', () => {
            const shinyCustomElementItemComponent = fixture.debugElement.query(By.css('whatever-you-want-to-have')).componentInstance;

            expect(shinyCustomElementItemComponent.property).toBe(component.property);
            expect(shinyCustomElementItemComponent.editable).toBe(component.editable);
        });
    });

    describe('Angular lifecycle methods', () => {

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

        it('should call through the lifecycle methods', () => {
            lifeCycleMethods.forEach((lifeCycleMethod) => {
                shinyCustomElementItemComponent[lifeCycleMethod] = () => {};
                spyOn(shinyCustomElementItemComponent, lifeCycleMethod);
                const param1 = {};
                const param2 = {};

                component[lifeCycleMethod].call(component, param1, param2);

                expect(shinyCustomElementItemComponent[lifeCycleMethod]).toHaveBeenCalledWith(param1, param2);
            });
        });

        it('should NOT call through the lifecycle methods if the method does not exist (no error should be thrown)', () => {
            lifeCycleMethods.forEach((lifeCycleMethod) => {
                shinyCustomElementItemComponent[lifeCycleMethod] = undefined;

                const execution = () => {
                    component[lifeCycleMethod].call(component);
                };

                expect(execution).not.toThrowError();
            });
        });
    });
});
