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

import { TestBed } from '@angular/core/testing';
import { AlfrescoApiService, setupTestBed } from '@alfresco/adf-core';
import { FormDefinitionSelectorCloudService } from './form-definition-selector-cloud.service';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';

declare let jasmine: any;

const responseBody = [
    {
        formRepresentation: {
            id: 'form-de8895be-d0d7-4434-beef-559b15305d72',
            name: 'Form 1',
            description: '',
            version: 0,
            standalone: true
        }
    },
    {
        formRepresentation: {
            id: 'form-de8895be-d0d7-4434-beef-fgr34ttgrtgd',
            name: 'Form 2',
            description: '',
            version: 0,
            standalone: false
        }
    },
    {
        formRepresentation: {
            id: 'form-de8895be-d0d7-4434-beef-53453453452',
            name: 'Form 3',
            description: '',
            version: 0
        }
    }
];

const oauth2Auth = jasmine.createSpyObj('oauth2Auth', ['callCustomApi', 'on']);

describe('Form Definition Selector Cloud Service', () => {

    let service: FormDefinitionSelectorCloudService;
    let apiService: AlfrescoApiService;
    const appName = 'app-name';

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(FormDefinitionSelectorCloudService);
        apiService = TestBed.inject(AlfrescoApiService);
        spyOn(apiService, 'getInstance').and.returnValue({
            oauth2Auth: oauth2Auth,
            isEcmLoggedIn() {
                return false;
            }
        });
    });

    it('should fetch all the forms when getForms is called', (done) => {
        oauth2Auth.callCustomApi.and.returnValue(Promise.resolve(responseBody));

        service.getForms(appName).subscribe((result) => {
            expect(result).toBeDefined();
            expect(result.length).toBe(3);
            done();
        });
    });

    it('should fetch only standalone enabled forms when getStandaloneTaskForms is called', (done) => {
        oauth2Auth.callCustomApi.and.returnValue(Promise.resolve(responseBody));

        service.getStandAloneTaskForms(appName).subscribe((result) => {
            expect(result).toBeDefined();
            expect(result.length).toBe(2);
            expect(result[0].name).toBe('Form 1');
            expect(result[1].name).toBe('Form 3');
            done();
        });
    });
});
