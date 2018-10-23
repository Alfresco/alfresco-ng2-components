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
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';

describe('AccordionGroupComponent', () => {

    let fixture: ComponentFixture<AccordionGroupComponent>;
    let component: AccordionGroupComponent;
    let element: any;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AccordionGroupComponent);

        element = fixture.nativeElement;
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should define mat-accordion ', async(() => {
        component.isSelected = true;
        component.heading = 'Fake Header';
        component.headingIcon = 'fake-icon';
        component.contentWrapper.nativeElement.innerHTML = '<a>Test</a>';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let accordion = element.querySelector('mat-accordion');
            let expansionPanel = element.querySelector('mat-expansion-panel');
            let accordionHeader = element.querySelector('mat-expansion-panel-header');
            let content = element.querySelector('#adf-expansion-panel-content-id').innerHTML;
            expect(accordion).toBeDefined();
            expect(expansionPanel).toBeDefined();
            expect(accordionHeader).toBeDefined();
            expect(content).toEqual('<a>Test</a>');
        });
    }));

    it('should be display accordion title and icon', async(() => {
        component.heading = 'Fake Header';
        component.headingIcon = 'fake-icon';
        component.contentWrapper.nativeElement.innerHTML = '<a>Test</a>';
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let headerText = element.querySelector('#heading-text');
            let headerIcon = element.querySelector('#adf-expansion-panel-id .material-icons');
            expect(headerText.innerText).toEqual('Fake Header');
            expect(headerIcon.innerText).toEqual('fake-icon');
        });
    }));

    it('should be display only accordion title', async(() => {
        component.heading = 'Fake Header';
        component.headingIcon = '';
        component.contentWrapper.nativeElement.innerHTML = '<a>Test</a>';
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let headerText = element.querySelector('#heading-text');
            let headerIcon = element.querySelector('#adf-expansion-panel-id .material-icons');
            expect(headerText.innerText).toEqual('Fake Header');
            expect(headerIcon).toBeNull();
        });
    }));

    it('should be display accordion title and content', async(() => {
        component.isSelected = true;
        component.heading = 'Fake Header';
        component.headingIcon = 'fake-icon';
        component.contentWrapper.nativeElement.innerHTML = '<a>Test</a>';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let headerText = element.querySelector('#heading-text');
            let headerIcon = element.querySelector('#heading-icon .material-icons');
            let content = element.querySelector('#adf-expansion-panel-content-id').innerHTML;
            expect(headerText.innerText).toEqual('Fake Header');
            expect(headerIcon.innerText).toEqual('fake-icon');
            expect(content).toEqual('<a>Test</a>');
        });
    }));

    it('should emit an event when a heading clicked', async(() => {
        component.heading = 'Fake Header';
        fixture.detectChanges();
        let heading: string = component.heading;
        component.headingClick.subscribe((headName: string) => {
            expect(headName).toBeDefined();
            expect(headName).toEqual(heading);
        });
        let header = element.querySelector('.adf-panel-heading');
        header.click();
    }));

    it('should display icon if is present', (done) => {
        component.headingIcon = 'assignment';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.hasHeadingIcon()).toBe(true);
            let headerText = element.querySelector('.adf-panel-heading-icon');
            expect(headerText).toBeDefined();
            done();
        });
    });
});
