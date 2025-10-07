/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ContainerModel } from '../core/container.model';
import { FormFieldTypes } from '../core/form-field-types';
import { FormFieldModel } from '../core/form-field.model';
import { HeaderWidgetComponent } from './header.widget';
import { UnitTestingUtils } from '../../../../testing';

describe('HeaderWidgetComponent', () => {
    let component: HeaderWidgetComponent;
    let fixture: ComponentFixture<HeaderWidgetComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HeaderWidgetComponent]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderWidgetComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
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
                        params: {
                            hideHeader: false,
                            allowCollapse: false,
                            collapseByDefault: false
                        }
                    }
                )
            )
        );
    });

    it('should render header widget template when type is group', () => {
        fixture.detectChanges();

        expect(testingUtils.getByCSS('.adf-container-widget-header')).not.toBe(null);
        expect(testingUtils.getByCSS('#container-header-label-test-id').nativeElement.textContent.trim()).toEqual('test-name');
    });

    it('should NOT render header widget template when type is different then group', () => {
        spyOnProperty(component.element, 'isTypeFieldGroup').and.returnValue(false);

        fixture.detectChanges();

        expect(testingUtils.getByCSS('.adf-container-widget-header')).toBe(null);
    });

    it('should display header text when hideHeader is set to false', () => {
        fixture.detectChanges();

        expect(testingUtils.getByCSS('.adf-container-widget-header__text')).not.toBe(null);
    });

    it('should NOT display header text when hideHeader is set to true', () => {
        component.element.json.params.hideHeader = true;

        fixture.detectChanges();

        expect(testingUtils.getByCSS('.adf-container-widget-header__text')).toBe(null);
    });

    it('should display expander when allowCollapse is set to true', () => {
        component.element.json.params.allowCollapse = true;

        fixture.detectChanges();

        expect(testingUtils.getByCSS('.mdl-button--icon')).not.toBe(null);
    });

    it('should NOT display expander when allowCollapse is set to false', () => {
        fixture.detectChanges();

        expect(testingUtils.getByCSS('.mdl-button--icon')).toBe(null);
    });

    it('should call onExpanderClicked method when expander is clicked', () => {
        component.element.json.params.allowCollapse = true;
        fixture.detectChanges();

        spyOn(component, 'onExpanderClicked');

        testingUtils.clickByCSS('.mdl-button--icon');

        expect(component.onExpanderClicked).toHaveBeenCalledWith(component.element);
    });

    it('should call onExpanderClicked method when header text is clicked', () => {
        fixture.detectChanges();

        spyOn(component, 'onExpanderClicked');

        testingUtils.clickByCSS('#container-header-label-test-id');

        expect(component.onExpanderClicked).toHaveBeenCalledWith(component.element);
    });
});
