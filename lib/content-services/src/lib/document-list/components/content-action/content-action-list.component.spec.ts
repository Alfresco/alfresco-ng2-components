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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { ContentActionModel } from './../../models/content-action.model';
import { DocumentListComponent } from './../document-list.component';
import { ContentActionListComponent } from './content-action-list.component';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('ContentColumnList', () => {

    let documentList: DocumentListComponent;
    let actionList: ContentActionListComponent;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        documentList = (TestBed.createComponent(DocumentListComponent).componentInstance as DocumentListComponent);
        actionList = new ContentActionListComponent(documentList);
    });

    it('should register action', () => {
        spyOn(documentList.actions, 'push').and.callThrough();

        const action = new ContentActionModel();
        const result = actionList.registerAction(action);

        expect(result).toBeTruthy();
        expect(documentList.actions.push).toHaveBeenCalledWith(action);
    });

    it('should require document list instance to register action', () => {
        actionList = new ContentActionListComponent(null);
        const action = new ContentActionModel();
        expect(actionList.registerAction(action)).toBeFalsy();
    });

    it('should require action instance to register', () => {
        spyOn(documentList.actions, 'push').and.callThrough();
        const result = actionList.registerAction(null);

        expect(result).toBeFalsy();
        expect(documentList.actions.push).not.toHaveBeenCalled();
    });
});
