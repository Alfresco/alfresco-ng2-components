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

import { TestBed } from '@angular/core/testing';
import { TaskTypeResolverService, UserTaskContentType } from './task-type-resolver.service';

describe('TaskTypeResolverService', () => {
    let service: TaskTypeResolverService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TaskTypeResolverService);
    });

    it('should return proper user task type', () => {
        expect(service.getUserTaskType('form-1234')).toBe(UserTaskContentType.Form);
        expect(service.getUserTaskType('screen-1234')).toBe(UserTaskContentType.Screen);

        expect(service.getUserTaskType('other-1234')).toBe(UserTaskContentType.None);
        expect(service.getUserTaskType('')).toBe(UserTaskContentType.None);
        expect(service.getUserTaskType()).toBe(UserTaskContentType.None);
    });

    it('should detect form task', () => {
        expect(service.isFormTask('form-1234')).toBeTrue();

        expect(service.isFormTask('screen-1234')).toBeFalse();
        expect(service.isFormTask('other-1234')).toBeFalse();
        expect(service.isFormTask('')).toBeFalse();
        expect(service.isFormTask()).toBeFalse();
    });

    it('should detect screen task', () => {
        expect(service.isScreenTask('screen-1234')).toBeTrue();

        expect(service.isScreenTask('form-1234')).toBeFalse();
        expect(service.isScreenTask('other-1234')).toBeFalse();
        expect(service.isScreenTask('')).toBeFalse();
        expect(service.isScreenTask()).toBeFalse();
    });

    it('should extract screen id from form key', () => {
        expect(service.getScreenId('screen-1234-5678-9121')).toBe('1234-5678-9121');
        expect(service.getScreenId('form-1234')).toBe('');
        expect(service.getScreenId('other-1234')).toBe('');
        expect(service.getScreenId('')).toBe('');
        expect(service.getScreenId()).toBe('');
    });
});
