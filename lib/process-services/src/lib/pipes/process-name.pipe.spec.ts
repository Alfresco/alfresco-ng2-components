/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ProcessNamePipe } from './process-name.pipe';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { setupTestBed, LocalizedDatePipe, CoreTestingModule } from '@alfresco/adf-core';
import { ProcessInstance } from '../process-list';

describe('ProcessNamePipe', () => {

    let processNamePipe: ProcessNamePipe;
    const defaultName = 'default-name';
    const datetimeIdentifier = '%{datetime}';
    const processDefinitionIdentifier = '%{processDefinition}';
    const mockCurrentDate: number = new Date('Wed Oct 23 2019').getTime();
    const mockLocalizedCurrentDate = 'Oct 23, 2019, 12:00:00 AM';
    const nameWithProcessDefinitionIdentifier = `${defaultName} - ${processDefinitionIdentifier}`;
    const nameWithDatetimeIdentifier = `${defaultName} - ${datetimeIdentifier}`;
    const nameWithAllIdentifiers = `${defaultName} ${processDefinitionIdentifier} - ${datetimeIdentifier}`;
    const fakeProcessInstanceDetails = new ProcessInstance({ processDefinitionName: 'fake-process-def-name'});

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        const localizedDatePipe = TestBed.inject(LocalizedDatePipe);
        processNamePipe = new ProcessNamePipe(localizedDatePipe);
    });

    it('should not modify the name when there is no identifier', () => {
        const transformResult = processNamePipe.transform(defaultName);
        expect(transformResult).toEqual(defaultName);
    });

    it('should add the selected process definition name to the process name', () => {
        const transformResult = processNamePipe.transform(nameWithProcessDefinitionIdentifier, fakeProcessInstanceDetails);
        expect(transformResult).toEqual(`${defaultName} - ${fakeProcessInstanceDetails.processDefinitionName}`);
    });

    it('should add the current datetime to the process name', () => {
        spyOn(moment, 'now').and.returnValue(mockCurrentDate);
        const transformResult = processNamePipe.transform(nameWithDatetimeIdentifier);
        expect(transformResult).toEqual(`${defaultName} - ${mockLocalizedCurrentDate}`);
    });

    it('should add the current datetime and the selected process definition name when both identifiers are present', () => {
        spyOn(moment, 'now').and.returnValue(mockCurrentDate);
        const transformResult = processNamePipe.transform(nameWithAllIdentifiers, fakeProcessInstanceDetails);
        expect(transformResult).toEqual(`${defaultName} ${fakeProcessInstanceDetails.processDefinitionName} - ${mockLocalizedCurrentDate}`);
    });

    it('should not modify the process name when processDefinition identifier is present but no process definition is selected', () => {
        const transformResult = processNamePipe.transform(nameWithProcessDefinitionIdentifier);
        expect(transformResult).toEqual(`${defaultName} - `);
    });

});
