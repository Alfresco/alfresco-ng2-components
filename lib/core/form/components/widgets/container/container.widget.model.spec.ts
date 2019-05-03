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

import { FormFieldTypes } from './../core/form-field-types';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { ContainerWidgetComponentModel } from './container.widget.model';

describe('ContainerWidgetComponentModel', () => {

    it('should store the form reference', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form);
        const model = new ContainerWidgetComponentModel(field);
        expect(model.form).toBe(form);
    });

    it('should allow collapsing only when of a group type', () => {
        let container = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(), {
            type:  FormFieldTypes.CONTAINER,
            params: {
                allowCollapse: true
            }
        }));

        expect(container.isCollapsible()).toBeFalsy();
        container = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(), {
            type:  FormFieldTypes.GROUP,
            params: {
                allowCollapse: true
            }
        }));
        expect(container.isCollapsible()).toBeTruthy();
    });

    it('should allow collapsing only when explicitly defined in params', () => {
        let container = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(), {
            type:  FormFieldTypes.GROUP,
            params: {}
        }));
        expect(container.isCollapsible()).toBeFalsy();

        container = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(), {
            type:  FormFieldTypes.GROUP,
            params: {
                allowCollapse: true
            }
        }));
        expect(container.isCollapsible()).toBeTruthy();
    });

    it('should be collapsed by default', () => {
        const container = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(), {
            type:  FormFieldTypes.GROUP,
            params: {
                allowCollapse: true,
                collapseByDefault: true
            }
        }));
        expect(container.isCollapsedByDefault()).toBeTruthy();
    });

});
