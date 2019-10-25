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

import { ContainerColumnModel } from './../core/container-column.model';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';

describe('ContainerColumnModel', () => {

    it('should have max size by default', () => {
        const column = new ContainerColumnModel();
        expect(column.size).toBe(12);
    });

    it('should check fields', () => {
        const column = new ContainerColumnModel();

        column.fields = null;
        expect(column.hasFields()).toBeFalsy();

        column.fields = [];
        expect(column.hasFields()).toBeFalsy();

        column.fields = [new FormFieldModel(new FormModel(), null)];
        expect(column.hasFields()).toBeTruthy();
    });

});
