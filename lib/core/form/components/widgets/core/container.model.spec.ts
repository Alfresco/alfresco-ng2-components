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
import { FormFieldModel } from './form-field.model';
import { FormModel } from './form.model';

describe('ContainerModel', () => {

    it('should store the form reference', () => {
        const form = new FormModel();
        const model = new ContainerModel(new FormFieldModel(form));
        expect(model.form).toBe(form);
    });

});
