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

import { async, TestBed } from '@angular/core/testing';
import { ProcessNamePipe } from './process-name.pipe';
import { setupTestBed } from 'core';
import { CoreTestingModule } from 'core/testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedDatePipe } from './localized-date.pipe';
import moment from 'moment-es6';

describe('ProcessNamePipe', () => {

    let processNamePipe: ProcessNamePipe;
    const defaultName = 'default-name';
    const datetimeIdentifier = '%{datetime}';
    const processDefinitionIdentifier = '%{processDefinition}';
    const mockProcessDefinitionName = 'my-process-definition';
    const mockCurrentDate = 'Wed Oct 23 2019';
    const mockLocalizedCurrentDate = 'Oct 23, 2019, 12:00:00 AM';
    const nameWithProcessDefinitionIdentifier = `${defaultName} - ${processDefinitionIdentifier}`;
    const nameWithDatetimeIdentifier = `${defaultName} - ${datetimeIdentifier}`;
    const nameWithAllIdentifiers = `${defaultName} ${processDefinitionIdentifier} - ${datetimeIdentifier}`;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(async(() => {
        const localizedDatePipe = TestBed.get(LocalizedDatePipe);
        processNamePipe = new ProcessNamePipe(localizedDatePipe);
    }));

    it('should not modify the name when there is no identifier', () => {
        const transformResult = processNamePipe.transform(defaultName);
        expect(transformResult).toEqual(defaultName);
    });

    it('should add the selected process definition name to the process name', () => {
        const transformResult = processNamePipe.transform(nameWithProcessDefinitionIdentifier, mockProcessDefinitionName);
        expect(transformResult).toEqual(`${defaultName} - ${mockProcessDefinitionName}`);
    });

    it('should add the current datetime to the process name', () => {
        spyOn(moment, 'now').and.returnValue(mockCurrentDate);
        const transformResult = processNamePipe.transform(nameWithDatetimeIdentifier);
        expect(transformResult).toEqual(`${defaultName} - ${mockLocalizedCurrentDate}`);
    });

    it('should add the current datetime and the selected process definition name when both identifiers are present', () => {
        spyOn(moment, 'now').and.returnValue(mockCurrentDate);
        const transformResult = processNamePipe.transform(nameWithAllIdentifiers, mockProcessDefinitionName);
        expect(transformResult).toEqual(`${defaultName} ${mockProcessDefinitionName} - ${mockLocalizedCurrentDate}`);
    });

    it('should not modify the process name when processDefinition identifier is present but no process definition is selected', () => {
        const transformResult = processNamePipe.transform(nameWithProcessDefinitionIdentifier);
        expect(transformResult).toEqual(`${defaultName} - `);
    });

});
