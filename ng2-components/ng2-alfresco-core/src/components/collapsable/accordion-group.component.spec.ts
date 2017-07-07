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

describe('AccordionGroupComponent', () => {

    let fixture: ComponentFixture<AccordionGroupComponent>;
    let component: AccordionGroupComponent;
    let element: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AccordionGroupComponent
            ],
            providers: [AccordionComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccordionGroupComponent);

        element = fixture.nativeElement;
        component = fixture.componentInstance;

    });

    it('should be closed by default', () => {
        component.heading = 'Fake Header';
        component.headingIcon = 'fake-icon';
        component.contentWrapper.nativeElement.innerHTML = '<a>Test</a>';
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let headerText = element.querySelector('#heading-text');
            expect(headerText.innerText).toEqual('Fake Header');
            let headerIcon = element.querySelector('#heading-icon .material-icons');
            expect(headerIcon.innerText).toEqual('fake-icon');
            let headerToggle = element.querySelector('#accordion-button .material-icons');
            expect(headerToggle.innerText).toEqual('expand_more');
        });
    });

    it('should be open when click', () => {
        component.isSelected = true;
        component.heading = 'Fake Header';
        component.headingIcon = 'fake-icon';
        component.contentWrapper.nativeElement.innerHTML = '<a>Test</a>';
        fixture.detectChanges();
        element.querySelector('#accordion-button').click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let headerText = element.querySelector('#heading-text');
            expect(headerText.innerText).toEqual('Fake Header');
            let headerIcon = element.querySelector('#heading-icon .material-icons');
            expect(headerIcon.innerText).toEqual('fake-icon');
            let headerToggle = element.querySelector('#accordion-button .material-icons');
            expect(headerToggle.innerText).toEqual('expand_less');
        });
    });

    it('should show expand icon by default', () => {
        component.heading = 'Fake Header';
        component.headingIcon = 'fake-icon';
        component.contentWrapper.nativeElement.innerHTML = '<a>Test</a>';
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let headerIcon = element.querySelector('#accordion-button');
            expect(headerIcon).toBeDefined();
        });
    });

    it('should hide expand icon', () => {
        component.heading = 'Fake Header';
        component.headingIcon = 'fake-icon';
        component.hasAccordionIcon = false;
        component.contentWrapper.nativeElement.innerHTML = '<a>Test</a>';
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let headerIcon = element.querySelector('#accordion-button');
            expect(headerIcon).toBeNull();
        });
    });

    it('should emit an event when a heading clicked', (done) => {
        component.heading = 'Fake Header';
        fixture.detectChanges();
        let heading: string = component.heading;
        component.headingClick.subscribe((headName: string) => {
            expect(headName).toBeDefined();
            expect(headName).toEqual(heading);
            done();
        });
        let header = element.querySelector('.adf-panel-heading');
        header.click();
    });

});
