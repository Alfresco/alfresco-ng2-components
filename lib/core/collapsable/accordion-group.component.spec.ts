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
import { Component, ViewChild } from '@angular/core';
import { CoreModule } from '../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

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
            let accordin = element.querySelector('mat-accordion');
            let expansionPanel = element.querySelector('mat-expansion-panel');
            let accordinHeader = element.querySelector('mat-expansion-panel-header');
            let content = element.querySelector('#adf-expansion-panel-content-id').innerHTML;
            expect(accordin).toBeDefined();
            expect(expansionPanel).toBeDefined();
            expect(accordinHeader).toBeDefined();
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

@Component({
    template: `
    <adf-accordion-group [heading]="'My Header'"
                         [isSelected]="isSelected"
                         [isOpen]="isOpen"
                         [headingIcon]="headingIcon" #accordion>
        <div>My List</div>
    </adf-accordion-group>
       `
})
class CustomAccordionGroupComponent extends AccordionGroupComponent {
    isOpen: boolean;
    isSelected: boolean;
    headingIcon: string;

    @ViewChild('accordion')
    accordion: AccordionGroupComponent;
}

describe('Custom AccordionGroup', () => {
    let fixture: ComponentFixture<CustomAccordionGroupComponent>;
    let component: CustomAccordionGroupComponent;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        declarations: [
            CustomAccordionGroupComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomAccordionGroupComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render the title', () => {
        component.isOpen = true;
        component.isSelected = true;
        fixture.detectChanges();
        let title: any = fixture.debugElement.queryAll(By.css('.adf-panel-heading-text'));
        expect(title.length).toBe(1);
        expect(title[0].nativeElement.innerText).toBe('My Header');
    });

    it('should render a tab with icon', () => {
        component.headingIcon = 'assignment';
        fixture.detectChanges();
        let tab: any = fixture.debugElement.queryAll(By.css('.material-icons'));
        expect(tab[0].nativeElement.innerText).toBe('assignment');
    });

    it('should expand the panel if has content and is selected', (done) => {
        spyOn(component.accordion, 'expandPanel').and.callThrough();
        component.isOpen = false;
        component.isSelected = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.accordion.expansionPanel.expanded).toBe(false);
            const selectElement = fixture.debugElement.nativeElement.querySelector('#adf-expansion-panel-id');
            selectElement.click();
            expect(component.accordion.expandPanel).toHaveBeenCalled();
            expect(component.accordion.expansionPanel.expanded).toBe(true);
            done();
        });
    });

    it('should close the expanded panel if has content and is selected', (done) => {
        spyOn(component.accordion, 'expandPanel').and.callThrough();
        component.isOpen = true;
        component.isSelected = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.accordion.expansionPanel.expanded).toBe(true);
            const selectElement = fixture.debugElement.nativeElement.querySelector('#adf-expansion-panel-id');
            selectElement.click();
            expect(component.accordion.expandPanel).toHaveBeenCalled();
            expect(component.accordion.expansionPanel.expanded).toBe(false);
            done();
        });
    });
});
