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

import { FormFieldTypes } from './../core/form-field-types';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { ContainerWidgetComponentModel } from './container.widget.model';

describe('ContainerWidgetComponentModel', () => {

    it('should store the form reference', () => {
        let form = new FormModel();
        let field = new FormFieldModel(form);
        let model = new ContainerWidgetComponentModel(field);
        expect(model.form).toBe(form);
    });

    it('should be expanded by default', () => {
        let container = new ContainerWidgetComponentModel(null);
        expect(container.isExpanded).toBeTruthy();
    });

    it('should wrap fields into columns on setup', () => {
        let form = new FormModel();

        let json = {
            fieldType: '<type>',
            id: '<id>',
            name: '<name>',
            type: '<type>',
            tab: '<tab>',
            numberOfColumns: 3,
            params: {},
            visibilityCondition: {},
            fields: {
                '1': [
                    { id: 'field-1' },
                    { id: 'field-3' }
                ],
                '2': [
                    { id: 'field-2' }
                ],
                '3': null
            }
        };

        let field = new FormFieldModel(form, json);

        let container = new ContainerWidgetComponentModel(field);
        expect(container.columns.length).toBe(3);

        let col1 = container.columns[0];
        expect(col1.fields.length).toBe(2);
        expect(col1.fields[0].id).toBe('field-1');
        expect(col1.fields[1].id).toBe('field-3');

        let col2 = container.columns[1];
        expect(col2.fields.length).toBe(1);
        expect(col2.fields[0].id).toBe('field-2');

        let col3 = container.columns[2];
        expect(col3.fields.length).toBe(0);
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
        let container = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(), {
            type:  FormFieldTypes.GROUP,
            params: {
                allowCollapse: true,
                collapseByDefault: true
            }
        }));
        expect(container.isCollapsedByDefault()).toBeTruthy();
    });

});
