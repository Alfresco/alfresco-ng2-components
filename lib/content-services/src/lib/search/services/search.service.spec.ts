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
import { mockError, fakeSearch } from '../mocks/search.service.mock';
import { SearchService } from './search.service';
import { setupTestBed, CoreTestingModule } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { NodePaging } from '@alfresco/js-api';

describe('SearchService', () => {

    let service: SearchService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(SearchService);
    });

    it('should call search API with no additional options', (done) => {
        const searchTerm = 'searchTerm63688';
        spyOn(service.queriesApi, 'findNodes').and.returnValue(Promise.resolve(new NodePaging(fakeSearch)));
        service.getNodeQueryResults(searchTerm).subscribe(
            () => {
                expect(service.queriesApi.findNodes).toHaveBeenCalledWith(searchTerm, undefined);
                done();
            }
        );
    });

    it('should call search API with additional options', (done) => {
        const searchTerm = 'searchTerm63688';
        const options = {
            include: [ 'path' ],
            rootNodeId: '-root-',
            nodeType: 'cm:content'
        };
        spyOn(service.queriesApi, 'findNodes').and.returnValue(Promise.resolve(new NodePaging(fakeSearch)));
        service.getNodeQueryResults(searchTerm, options).subscribe(
            () => {
                expect(service.queriesApi.findNodes).toHaveBeenCalledWith(searchTerm, options);
                done();
            }
        );
    });

    it('should notify errors returned from the API', (done) => {
        spyOn(service.queriesApi, 'findNodes').and.returnValue(Promise.reject(mockError));
        service.getNodeQueryResults('').subscribe(
            () => {},
            (res: any) => {
                expect(res).toBeDefined();
                expect(res).toEqual(mockError);
                done();
            }
        );
    });
});
