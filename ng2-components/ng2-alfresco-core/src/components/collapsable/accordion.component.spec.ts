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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccordionGroupComponent } from './accordion-group.component';
import { AccordionComponent } from './accordion.component';

describe('AccordionComponent', () => {

    let fixture: ComponentFixture<AccordionComponent>;
    let component: AccordionComponent;
    let componentGroup1: AccordionGroupComponent;
    let componentGroup2: AccordionGroupComponent;
    let componentGroup3: AccordionGroupComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AccordionComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccordionComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        component.groups = [];
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should add the AccordionGroup', () => {
        component.addGroup(componentGroup1);
        expect(component.groups.length).toBe(1);
    });

    it('should close all the other group', () => {
        componentGroup1 = new AccordionGroupComponent(component);
        componentGroup2 = new AccordionGroupComponent(component);
        componentGroup3 = new AccordionGroupComponent(component);
        componentGroup1.isOpen = false;
        componentGroup2.isOpen = true;
        componentGroup3.isOpen = false;

        expect(component.groups[0].isOpen).toBeFalsy();
        expect(component.groups[1].isOpen).toBeTruthy();
        expect(component.groups[2].isOpen).toBeFalsy();

        componentGroup1.isOpen = true;

        expect(component.groups[0].isOpen).toBeTruthy();
        expect(component.groups[1].isOpen).toBeFalsy();
        expect(component.groups[2].isOpen).toBeFalsy();
    });

    it('should remove the AccordionGroup', () => {
        component.addGroup(componentGroup1);
        component.removeGroup(componentGroup1);
        expect(component.groups.length).toBe(0);
    });

});
