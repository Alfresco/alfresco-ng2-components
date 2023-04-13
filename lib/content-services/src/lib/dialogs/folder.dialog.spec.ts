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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { setupTestBed } from '@alfresco/adf-core';
import { NodesApiService } from '../common/services/nodes-api.service';

import { FolderDialogComponent } from './folder.dialog';
import { of, throwError } from 'rxjs';
import { ContentTestingModule } from '../testing/content.testing.module';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('FolderDialogComponent', () => {
    let fixture: ComponentFixture<FolderDialogComponent>;
    let component: FolderDialogComponent;
    let nodesApi: NodesApiService;
    const dialogRef = {
        close: jasmine.createSpy('close')
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            { provide: MatDialogRef, useValue: dialogRef }
        ]
    });

    beforeEach(() => {
        dialogRef.close.calls.reset();
        fixture = TestBed.createComponent(FolderDialogComponent);
        component = fixture.componentInstance;
        nodesApi = TestBed.inject(NodesApiService);
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Edit', () => {

        beforeEach(() => {
            component.data = {
                folder: {
                    id: 'node-id',
                    name: 'folder-name',
                    properties: {
                        ['cm:title']: 'folder-title',
                        ['cm:description']: 'folder-description'
                    }
                }
            };
            fixture.detectChanges();
        });

        it('should init form with folder name and description', () => {
            expect(component.name).toBe('folder-name');
            expect(component.title).toBe('folder-title');
            expect(component.description).toBe('folder-description');
        });

        it('should have the proper title', () => {
            const title = fixture.debugElement.query(By.css('[mat-dialog-title]'));
            expect(title === null).toBe(false);
            expect(title.nativeElement.innerText.trim()).toBe('CORE.FOLDER_DIALOG.EDIT_FOLDER_TITLE');
        });

        it('should update form input', () => {
            component.form.controls['name'].setValue('folder-name-update');
            component.form.controls['title'].setValue('folder-title-update');
            component.form.controls['description'].setValue('folder-description-update');

            expect(component.name).toBe('folder-name-update');
            expect(component.title).toBe('folder-title-update');
            expect(component.description).toBe('folder-description-update');
        });

        it('should submit updated values if form is valid', () => {
            spyOn(nodesApi, 'updateNode').and.returnValue(of(null));

            component.form.controls['name'].setValue('folder-name-update');
            component.form.controls['title'].setValue('folder-title-update');
            component.form.controls['description'].setValue('folder-description-update');

            component.submit();

            expect(nodesApi.updateNode).toHaveBeenCalledWith(
                'node-id',
                {
                    name: 'folder-name-update',
                    properties: {
                        'cm:title': 'folder-title-update',
                        'cm:description': 'folder-description-update'
                    }
                }
            );
        });

        it('should call dialog to close with form data when submit is successfully', () => {
            const folder: any = {
                data: 'folder-data'
            };

            spyOn(nodesApi, 'updateNode').and.returnValue(of(folder));

            component.submit();

            expect(dialogRef.close).toHaveBeenCalledWith(folder);
        });

        it('should emit success output event with folder when submit is successful', async () => {
            const folder: any = { data: 'folder-data' };
            let expectedNode = null;

            spyOn(nodesApi, 'updateNode').and.returnValue(of(folder));

            component.success.subscribe((node) => {
                expectedNode = node;
            });
            component.submit();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(expectedNode).toBe(folder);
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
            spyOn(nodesApi, 'updateNode').and.returnValue(throwError('error'));
            spyOn(component, 'handleError').and.callFake((val) => val);

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
            fixture.detectChanges();
        });

        it('should have the proper title', () => {
            const title = fixture.debugElement.query(By.css('[mat-dialog-title]'));
            expect(title === null).toBe(false);
            expect(title.nativeElement.innerText.trim()).toBe('CORE.FOLDER_DIALOG.CREATE_FOLDER_TITLE');
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
            spyOn(nodesApi, 'createFolder').and.returnValue(of(null));

            component.form.controls['name'].setValue('folder-name-update');
            component.form.controls['title'].setValue('folder-title-update');
            component.form.controls['description'].setValue('folder-description-update');

            component.submit();

            expect(nodesApi.createFolder).toHaveBeenCalledWith(
                'parentNodeId',
                {
                    name: 'folder-name-update',
                    properties: {
                        'cm:title': 'folder-title-update',
                        'cm:description': 'folder-description-update'
                    },
                    nodeType: 'cm:folder'
                }
            );
        });

        it('should submit updated values if form is valid (with custom nodeType)', () => {
            spyOn(nodesApi, 'createFolder').and.returnValue(of(null));

            component.form.controls['name'].setValue('folder-name-update');
            component.form.controls['title'].setValue('folder-title-update');
            component.form.controls['description'].setValue('folder-description-update');
            component.nodeType = 'cm:sushi';

            component.submit();

            expect(nodesApi.createFolder).toHaveBeenCalledWith(
                'parentNodeId',
                {
                    name: 'folder-name-update',
                    properties: {
                        'cm:title': 'folder-title-update',
                        'cm:description': 'folder-description-update'
                    },
                    nodeType: 'cm:sushi'
                }
            );
        });

        it('should call dialog to close with form data when submit is successfully', () => {
            const folder: any = {
                data: 'folder-data'
            };

            component.form.controls['name'].setValue('name');
            component.form.controls['title'].setValue('title');
            component.form.controls['description'].setValue('description');

            spyOn(nodesApi, 'createFolder').and.returnValue(of(folder));

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
            spyOn(nodesApi, 'createFolder').and.returnValue(throwError('error'));
            spyOn(component, 'handleError').and.callFake((val) => val);

            component.form.controls['name'].setValue('name');
            component.form.controls['description'].setValue('description');

            component.submit();

            expect(component.handleError).toHaveBeenCalled();
            expect(dialogRef.close).not.toHaveBeenCalled();
        });

        describe('Error events ', () => {
            it('should raise error for 409', (done) => {
                const error = {
                    message: '{ "error": {  "statusCode" : 409 } }'
                };

                component.error.subscribe((message) => {
                    expect(message).toBe('CORE.MESSAGES.ERRORS.EXISTENT_FOLDER');
                    done();
                });

                spyOn(nodesApi, 'createFolder').and.returnValue(throwError(error));

                component.form.controls['name'].setValue('name');
                component.form.controls['description'].setValue('description');

                component.submit();
            });

            it('should raise generic error', (done) => {
                const error = {
                    message: '{ "error": {  "statusCode" : 123 } }'
                };

                component.error.subscribe((message) => {
                    expect(message).toBe('CORE.MESSAGES.ERRORS.GENERIC');
                    done();
                });

                spyOn(nodesApi, 'createFolder').and.returnValue(throwError(error));

                component.form.controls['name'].setValue('name');
                component.form.controls['description'].setValue('description');

                component.submit();
            });
        });
   });
});
