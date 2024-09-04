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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ContainerModel } from '../core/container.model';
import { FormFieldTypes } from '../core/form-field-types';
import { FormFieldModel } from '../core/form-field.model';
import { HeaderWidgetComponent } from './header.widget';

describe('HeaderWidgetComponent', () => {
    let component: HeaderWidgetComponent;
    let fixture: ComponentFixture<HeaderWidgetComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HeaderWidgetComponent, TranslateModule.forRoot()]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderWidgetComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput(
            'element',
            new ContainerModel(
                new FormFieldModel(
                    {
                        onFormFieldChanged: () => {}
                    },
                    {
                        type: FormFieldTypes.GROUP,
                        name: 'test-name',
                        id: 'test-id',
                        params: { allowCollapse: true }
                    }
                )
            )
        );
        fixture.detectChanges();
    });

    it('should render the header widget template', () => {
        const nativeElement = fixture.nativeElement;
        expect(nativeElement.querySelector('.adf-container-widget-header')).toBeTruthy();
        expect(nativeElement.querySelector('#container-header-label-test-id').textContent.trim()).toEqual('test-name');
    });

    it('should call onExpanderClicked method when expander is clicked', () => {
        spyOn(component, 'onExpanderClicked');
        const expander = fixture.nativeElement.querySelector('#container-header-label-test-id');
        expander.click();
        expect(component.onExpanderClicked).toHaveBeenCalled();
    });
});
