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

import { FormModel } from './form.model';
import { FormWidgetModel } from './form-widget.model';

describe('FormWidgetModel', () => {

    class FormWidgetModelMock extends FormWidgetModel {
        constructor(form: FormModel, json: any) {
            super(form, json);
        }
    }

    it('should store the form reference', () => {
        let form = new FormModel();
        let model = new FormWidgetModelMock(form, null);
        expect(model.form).toBe(form);
    });

    it('should store original json', () => {
        let json = {};
        let model = new FormWidgetModelMock(null, json);
        expect(model.json).toBe(json);
    });

});
