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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AccordionComponent } from './accordion.component';
import { AccordionGroupComponent } from './accordion-group.component';

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
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let headerToggle = fixture.nativeElement.querySelector('.adf-panel-heading-toggle .material-icons');
            expect(headerToggle.innerText).toEqual('expand_more');
            let headerText = fixture.nativeElement.querySelector('.adf-panel-heading-text');
            expect(headerText.innerText).toEqual('Fake Header');
            let headerIcon = fixture.nativeElement.querySelector('.adf-panel-heading-icon .material-icons');
            expect(headerIcon.innerText).toEqual('fake-icon');
        });
    });

    it('should be open when click', () => {
        component.isSelected = true;
        component.heading = 'Fake Header';
        component.headingIcon = 'fake-icon';
        fixture.detectChanges();
        element.querySelector('#accordion-button').click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let headerText = fixture.nativeElement.querySelector('.adf-panel-heading-text');
            expect(headerText.innerText).toEqual('Fake Header');
            let headerIcon = fixture.nativeElement.querySelector('.adf-panel-heading-icon .material-icons');
            expect(headerIcon.innerText).toEqual('fake-icon');
            let headerToggle = fixture.nativeElement.querySelector('.adf-panel-heading-toggle .material-icons');
            expect(headerToggle.innerText).toEqual('expand_less');
        });
    });

});
