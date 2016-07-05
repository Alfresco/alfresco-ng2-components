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

import { describe, it, expect } from '@angular/core/testing';

describe('ContentColumnList', () => {

    it('should be upgraded', () => {
        expect(false).toBeTruthy();
    });

});

/*
import {
    it,
    describe,
    expect,
    beforeEach
} from '@angular/core/testing';

import {DocumentList} from './document-list';
import {AlfrescoServiceMock} from '../assets/alfresco.service.mock';
import {ContentColumnList} from './content-column-list';
import {ContentColumnModel} from '../models/content-column.model';

describe('ContentColumnList', () => {

    let documentList: DocumentList;
    let columnList: ContentColumnList;

    beforeEach(() => {
        let alfrescoServiceMock = new AlfrescoServiceMock();
        documentList = new DocumentList(alfrescoServiceMock, null);
        columnList = new ContentColumnList(documentList);
    });

    it('should register column within parent document list', () => {
        expect(documentList.columns.length).toBe(0);

        let result = columnList.registerColumn(new ContentColumnModel());

        expect(result).toBeTruthy();
        expect(documentList.columns.length).toBe(1);
    });

    it('should require document list instance to register action', () => {
        columnList = new ContentColumnList(null);
        let col = new ContentColumnModel();
        expect(columnList.registerColumn(col)).toBeFalsy();
    });

    it('should require action instance to register', () => {
        spyOn(documentList.actions, 'push').and.callThrough();
        let result = columnList.registerColumn(null);

        expect(result).toBeFalsy();
        expect(documentList.actions.push).not.toHaveBeenCalled();
    });

});
*/
