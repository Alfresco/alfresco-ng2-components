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

import { DocumentListComponent } from './../document-list.component';
import { DocumentListServiceMock } from './../../assets/document-list.service.mock';
import { ContentActionModel } from './../../models/content-action.model';
import { ContentActionListComponent } from './content-action-list.component';

describe('ContentColumnList', () => {

    let documentList: DocumentListComponent;
    let actionList: ContentActionListComponent;

    beforeEach(() => {
        let documentListService = new DocumentListServiceMock();
        documentList = new DocumentListComponent(documentListService, null, null, null);
        actionList = new ContentActionListComponent(documentList);
    });

    it('should register action', () => {
        spyOn(documentList.actions, 'push').and.callThrough();

        let action = new ContentActionModel();
        let result = actionList.registerAction(action);

        expect(result).toBeTruthy();
        expect(documentList.actions.push).toHaveBeenCalledWith(action);
    });

    it('should require document list instance to register action', () => {
        actionList = new ContentActionListComponent(null);
        let action = new ContentActionModel();
        expect(actionList.registerAction(action)).toBeFalsy();
    });

    it('should require action instance to register', () => {
        spyOn(documentList.actions, 'push').and.callThrough();
        let result = actionList.registerAction(null);

        expect(result).toBeFalsy();
        expect(documentList.actions.push).not.toHaveBeenCalled();
    });

});
