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

import { it, describe, expect } from '@angular/core/testing';
import { FormModel } from './form.model';

describe('FormModel', () => {

    it('should store original json', () => {
        let json = {};
        let form = new FormModel(json);
        expect(form.json).toBe(json);
    });

    it('should setup properties with json', () => {
        let json = {
            id: '<id>',
            name: '<name>',
            taskId: '<task-id>',
            taskName: '<task-name>'
        };
        let form = new FormModel(json);

        Object.keys(json).forEach(key => {
            expect(form[key]).toEqual(form[key]);
        });
    });

    it('should take form name when task name is missing', () => {
        let json = {
            id: '<id>',
            name: '<name>'
        };
        let form = new FormModel(json);
        expect(form.taskName).toBe(json.name);
    });

    it('should use fallback value for task name', () => {
        let form = new FormModel({});
        expect(form.taskName).toBe(FormModel.UNSET_TASK_NAME);
    });

    it('should set readonly state from params', () => {
        let form = new FormModel({}, null, null, true);
        expect(form.readOnly).toBeTruthy();
    });

});
