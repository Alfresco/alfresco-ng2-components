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

import { ContainerModel } from './container.model';
import { FormModel } from './form.model';
import { FormFieldModel } from './../core/form-field.model';
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

    it('should not setup with json config', () => {
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

});
