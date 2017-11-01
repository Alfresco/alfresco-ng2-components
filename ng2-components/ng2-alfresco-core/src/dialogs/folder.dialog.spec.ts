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

import { async, TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Observable } from 'rxjs/Rx';

import { AlfrescoTranslationService, CoreModule } from '../../index';
import { TranslationMock } from '../assets/translation.service.mock';
import { NodesApiService } from '../services/nodes-api.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { FolderDialogComponent } from './folder.dialog';

describe('FolderDialogComponent', () => {

    let fixture: ComponentFixture<FolderDialogComponent>;
    let component: FolderDialogComponent;
    let translationService: TranslationService;
    let nodesApi: NodesApiService;
    let notificationService: NotificationService;
    let dialogRef;

    beforeEach(async(() => {
        dialogRef = {
            close: jasmine.createSpy('close')
        };

        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                MatDialogModule,
                FormsModule,
                ReactiveFormsModule,
                BrowserDynamicTestingModule
            ],
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: AlfrescoTranslationService, useClass: TranslationMock }
            ]
        });

        // entryComponents are not supported yet on TestBed, that is why this ugly workaround:
        // https://github.com/angular/angular/issues/10760
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {entryComponents: [ FolderDialogComponent ]}
        });

        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FolderDialogComponent);
        component = fixture.componentInstance;

        nodesApi = TestBed.get(NodesApiService);
        notificationService = TestBed.get(NotificationService);

        translationService = TestBed.get(TranslationService);
        spyOn(translationService, 'get').and.returnValue(Observable.of('message'));
    });

    describe('Edit', () => {

        beforeEach(() => {
            component.data = {
                folder: {
                    id: 'node-id',
                    name: 'folder-name',
                    properties: {
                        ['cm:description']: 'folder-description'
                    }
                }
            };
            component.ngOnInit();
        });

        it('should init form with folder name and description', () => {
            expect(component.name).toBe('folder-name');
            expect(component.description).toBe('folder-description');
        });

        it('should update form input', () => {
            component.form.controls['name'].setValue('folder-name-update');
            component.form.controls['description'].setValue('folder-description-update');

            expect(component.name).toBe('folder-name-update');
            expect(component.description).toBe('folder-description-update');
        });

        it('should submit updated values if form is valid', () => {
            spyOn(nodesApi, 'updateNode').and.returnValue(Observable.of({}));

            component.form.controls['name'].setValue('folder-name-update');
            component.form.controls['description'].setValue('folder-description-update');

            component.submit();

            expect(nodesApi.updateNode).toHaveBeenCalledWith(
                'node-id',
                {
                    name: 'folder-name-update',
                    properties: {
                        'cm:title': 'folder-name-update',
                        'cm:description': 'folder-description-update'
                    }
                }
            );
        });

        it('should call dialog to close with form data when submit is succesfluly', () => {
            const folder = {
                data: 'folder-data'
            };

            spyOn(nodesApi, 'updateNode').and.returnValue(Observable.of(folder));

            component.submit();

            expect(dialogRef.close).toHaveBeenCalledWith(folder);
        });

        it('should not submit if form is invalid', () => {
            spyOn(nodesApi, 'updateNode');

            component.form.controls['name'].setValue('');
            component.form.controls['description'].setValue('');

            component.submit();

            expect(component.form.valid).toBe(false);
            expect(nodesApi.updateNode).not.toHaveBeenCalled();
        });

        it('should not call dialog to close if submit fails', () => {
            spyOn(nodesApi, 'updateNode').and.returnValue(Observable.throw('error'));
            spyOn(component, 'handleError').and.callFake(val => val);

            component.submit();

            expect(component.handleError).toHaveBeenCalled();
            expect(dialogRef.close).not.toHaveBeenCalled();
        });
    });

    describe('Create', () => {
        beforeEach(() => {
            component.data = {
                parentNodeId: 'parentNodeId',
                folder: null
            };
            component.ngOnInit();
        });

        it('should init form with empty inputs', () => {
            expect(component.name).toBe('');
            expect(component.description).toBe('');
        });

        it('should update form input', () => {
            component.form.controls['name'].setValue('folder-name-update');
            component.form.controls['description'].setValue('folder-description-update');

            expect(component.name).toBe('folder-name-update');
            expect(component.description).toBe('folder-description-update');
        });

        it('should submit updated values if form is valid', () => {
            spyOn(nodesApi, 'createFolder').and.returnValue(Observable.of({}));

            component.form.controls['name'].setValue('folder-name-update');
            component.form.controls['description'].setValue('folder-description-update');

            component.submit();

            expect(nodesApi.createFolder).toHaveBeenCalledWith(
                'parentNodeId',
                {
                    name: 'folder-name-update',
                    properties: {
                        'cm:title': 'folder-name-update',
                        'cm:description': 'folder-description-update'
                    }
                }
            );
        });

        it('should call dialog to close with form data when submit is succesfluly', () => {
            const folder = {
                data: 'folder-data'
            };

            component.form.controls['name'].setValue('name');
            component.form.controls['description'].setValue('description');

            spyOn(nodesApi, 'createFolder').and.returnValue(Observable.of(folder));

            component.submit();

            expect(dialogRef.close).toHaveBeenCalledWith(folder);
        });

        it('should not submit if form is invalid', () => {
            spyOn(nodesApi, 'createFolder');

            component.form.controls['name'].setValue('');
            component.form.controls['description'].setValue('');

            component.submit();

            expect(component.form.valid).toBe(false);
            expect(nodesApi.createFolder).not.toHaveBeenCalled();
        });

        it('should not call dialog to close if submit fails', () => {
            spyOn(nodesApi, 'createFolder').and.returnValue(Observable.throw('error'));
            spyOn(component, 'handleError').and.callFake(val => val);

            component.form.controls['name'].setValue('name');
            component.form.controls['description'].setValue('description');

            component.submit();

            expect(component.handleError).toHaveBeenCalled();
            expect(dialogRef.close).not.toHaveBeenCalled();
        });
    });

    describe('handleError()', () => {
        it('should raise error for 409', () => {
            spyOn(notificationService, 'openSnackMessage').and.stub();

            const error = {
                message: '{ "error": {  "statusCode" : 409 } }'
            };

            component.handleError(error);

            expect(notificationService.openSnackMessage).toHaveBeenCalled();
            expect(translationService.get).toHaveBeenCalledWith('CORE.MESSAGES.ERRORS.EXISTENT_FOLDER');
        });

        it('should raise generic error', () => {
            spyOn(notificationService, 'openSnackMessage').and.stub();

            const error = {
                message: '{ "error": {  "statusCode" : 123 } }'
            };

            component.handleError(error);

            expect(notificationService.openSnackMessage).toHaveBeenCalled();
            expect(translationService.get).toHaveBeenCalledWith('CORE.MESSAGES.ERRORS.GENERIC');
        });
    });
});
