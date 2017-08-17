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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { MaterialModule } from '../../material.module';
import { DocumentListService } from '../../services/document-list.service';
import { ContentActionModel } from './../../models/content-action.model';
import { DocumentListComponent } from './../document-list.component';
import { ContentActionListComponent } from './content-action-list.component';

describe('ContentColumnList', () => {

    let documentList: DocumentListComponent;
    let actionList: ContentActionListComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                DataTableModule,
                MaterialModule
            ],
            declarations: [
                DocumentListComponent
            ],
            providers: [
                DocumentListService
            ],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        documentList = TestBed.createComponent(DocumentListComponent).componentInstance;
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
