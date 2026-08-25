/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ContainerModel } from './container.model';
import { FormModel } from './form.model';
import { FormFieldModel } from './form-field.model';
import { TabModel } from './tab.model';

describe('TabModel', () => {
    it('should setup with json config', () => {
        const json = {
            id: '<id>',
            title: '<title>',
            visibilityCondition: '<condition>'
        };

        const model = new TabModel(null, json);
        expect(model.id).toBe(json.id);
        expect(model.title).toBe(json.title);
        expect(model.isVisible).toBe(true);
    });

    it('should not setup with null json config', () => {
        const model = new TabModel(null, null);
        expect(model.id).toBeUndefined();
        expect(model.title).toBeUndefined();
        expect(model.isVisible).toBeDefined();
        expect(model.isVisible).toBe(true);
        expect(model.visibilityCondition).toBeUndefined();
    });

    it('should evaluate content based on fields', () => {
        const model = new TabModel(null, null);

        model.fields = null;
        expect(model.hasContent()).toBeFalsy();

        model.fields = [];
        expect(model.hasContent()).toBeFalsy();

        const form = new FormModel();
        const field = new FormFieldModel(form);
        model.fields = [new ContainerModel(field)];
        expect(model.hasContent()).toBeTruthy();
    });

    it('should store the form reference', () => {
        const form = new FormModel();
        const model = new TabModel(form);
        expect(model.form).toBe(form);
    });

    it('should store original json', () => {
        const json = {};
        const model = new TabModel(null, json);
        expect(model.json).toBe(json);
    });

    it('should default to sidenav children layout when not specified', () => {
        const model = new TabModel(null, { id: 'parent' });
        expect(model.childrenLayout).toBe('sidenav');
    });

    it('should parse children nodes and childrenLayout from json', () => {
        const json = {
            id: 'parent',
            title: 'Parent',
            childrenLayout: 'tabs',
            children: [
                { id: 'child1', title: 'Child 1' },
                { id: 'child2', title: 'Child 2' }
            ]
        };

        const model = new TabModel(null, json);
        expect(model.childrenLayout).toBe('tabs');
        expect(model.children.length).toBe(2);
        expect(model.children[0].id).toBe('child1');
        expect(model.children[1].id).toBe('child2');
        expect(model.hasChildren()).toBeTruthy();
        expect(model.hasTabbedChildren()).toBeTruthy();
    });

    it('should not consider children as tabbed when childrenLayout is sidenav', () => {
        const json = {
            id: 'parent',
            children: [{ id: 'child1' }]
        };

        const model = new TabModel(null, json);
        expect(model.hasTabbedChildren()).toBeFalsy();
    });

    it('should find a nested tab by id', () => {
        const json = {
            id: 'root',
            children: [
                {
                    id: 'child1',
                    children: [{ id: 'grandchild1' }]
                },
                { id: 'child2' }
            ]
        };

        const model = new TabModel(null, json);
        expect(model.findTabById('root')).toBe(model);
        expect(model.findTabById('child2')).toBe(model.children[1]);
        expect(model.findTabById('grandchild1')).toBe(model.children[0].children[0]);
        expect(model.findTabById('unknown')).toBeUndefined();
    });

    it('should filter visible children', () => {
        const model = new TabModel(null, {
            id: 'root',
            children: [{ id: 'visible-child' }, { id: 'hidden-child' }]
        });

        model.children[1].isVisible = false;

        const visibleChildren = model.visibleChildren();
        expect(visibleChildren.length).toBe(1);
        expect(visibleChildren[0].id).toBe('visible-child');
    });

    it('should collect own and nested fields, and compute completion/error state', () => {
        const form = new FormModel();
        const requiredField = new FormFieldModel(form, { id: 'required-field', required: true });
        const requiredFieldFilled = new FormFieldModel(form, { id: 'required-field-filled', required: true, value: 'value' });

        const model = new TabModel(form, { id: 'root' });
        model.fields = [new ContainerModel(requiredField)];

        const childModel = new TabModel(form, { id: 'child' });
        childModel.fields = [new ContainerModel(requiredFieldFilled)];
        model.children = [childModel];

        expect(model.getOwnFields()).toEqual([requiredField]);
        expect(model.getAllFields()).toEqual([requiredField, requiredFieldFilled]);
        expect(model.getRequiredFieldsCount()).toBe(2);
        expect(model.getCompletedRequiredFieldsCount()).toBe(1);
        expect(model.isComplete()).toBeFalsy();
        expect(childModel.isComplete()).toBeTruthy();

        requiredField.markAsInvalid();
        expect(model.hasErrors()).toBeTruthy();
        expect(childModel.hasErrors()).toBeFalsy();
    });
});
