/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { NodesApiService } from '../../common/services/nodes-api.service';
import { FolderDialogComponent } from './folder.dialog';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NotificationService } from '@alfresco/adf-core';

describe('FolderDialogComponent', () => {
    let fixture: ComponentFixture<FolderDialogComponent>;
    let component: FolderDialogComponent;
    let nodesApi: NodesApiService;
    let notificationService: NotificationService;

    let submitButton: HTMLButtonElement;
    const dialogRef = {
        close: jasmine.createSpy('close')
    };
    let updateNodeSpy: jasmine.Spy;
    let createFolderSpy: jasmine.Spy;

    beforeEach(() => {
        const notificationServiceMock = {
            showInfo: jasmine.createSpy('showInfo')
        };

        TestBed.configureTestingModule({
            imports: [],
            providers: [{ provide: MatDialogRef, useValue: dialogRef }, { provide: NotificationService, useValue: notificationServiceMock }]
        });
        dialogRef.close.calls.reset();
        fixture = TestBed.createComponent(FolderDialogComponent);
        component = fixture.componentInstance;
        nodesApi = TestBed.inject(NodesApiService);
        notificationService = TestBed.inject(NotificationService);

        createFolderSpy = spyOn(nodesApi, 'createFolder');
        updateNodeSpy = spyOn(nodesApi, 'updateNode');
        submitButton = fixture.nativeElement.querySelector('#adf-folder-create-button');
    });

    const getTitle = () => fixture.debugElement.query(By.css('[data-automation-id="adf-folder-dialog-title"]'));

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
            const title = getTitle();
            expect(title).not.toBeNull();
            expect(title.nativeElement.innerText.trim()).toBe('CORE.FOLDER_DIALOG.EDIT_FOLDER_TITLE');
        });

        it('should update form input', () => {
            setFormValues();

            expect(component.name).toBe('folder-name-update');
            expect(component.title).toBe('folder-title-update');
            expect(component.description).toBe('folder-description-update');
        });

        it('should submit updated values if form is valid', () => {
            const updatedFolder: any = { name: 'folder-name-update' };
            updateNodeSpy.and.returnValue(of(updatedFolder));

            setFormValues();

            fixture.detectChanges();
            submitButton.click();
            fixture.detectChanges();

            expect(component.form.valid).toBeTrue();
            expect(submitButton.disabled).toBeTrue();
            expect(component.disableSubmitButton).toBeTrue();
            expect(nodesApi.updateNode).toHaveBeenCalledWith('node-id', {
                name: 'folder-name-update',
                properties: {
                    'cm:title': 'folder-title-update',
                    'cm:description': 'folder-description-update'
                }
            });
        });

        it('should not submit if form is invalid', () => {
            component.form.controls['name'].setValue('');
            component.form.controls['description'].setValue('');

            fixture.detectChanges();
            submitButton.click();
            fixture.detectChanges();

            expect(submitButton.disabled).toBeTrue();
            expect(component.form.valid).toBeFalse();
            expect(updateNodeSpy).not.toHaveBeenCalled();
        });

        it('should show edit success notification with folder name when folder is updated', () => {
            const updatedFolder: any = { name: 'updated-folder' };
            updateNodeSpy.and.returnValue(of(updatedFolder));

            component.form.controls['name'].setValue('updated-folder');
            component.submit();

            expect(notificationService.showInfo).toHaveBeenCalledWith('CORE.FOLDER_DIALOG.FOLDER_UPDATED_SUCCESS');
        });

        describe('when submit is successfully', () => {
            const folder: any = { data: 'folder-data', name: 'folder-data' };

            it('should call dialog to close with form data', () => {
                updateNodeSpy.and.returnValue(of(folder));
                component.submit();

                expect(dialogRef.close).toHaveBeenCalledWith(folder);
            });

            it('should emit success output event with folder', fakeAsync(() => {
                updateNodeSpy.and.returnValue(of(folder));
                let emittedNode: any;
                component.success.subscribe((node) => {
                    emittedNode = node;
                });
                component.submit();
                tick();
                expect(emittedNode).toBe(folder);
            }));
        });

        it('should not call dialog to close if submit fails', () => {
            updateNodeSpy.and.returnValue(throwError(() => 'error'));
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
            const title = getTitle();
            expect(title).not.toBeNull();
            expect(title.nativeElement.innerText.trim()).toBe('CORE.FOLDER_DIALOG.CREATE_FOLDER_TITLE');
        });

        it('should init form with empty inputs', () => {
            expect(component.name).toBe('');
            expect(component.description).toBe('');
        });

        it('should update form input', () => {
            setFormValues();

            expect(component.name).toBe('folder-name-update');
            expect(component.description).toBe('folder-description-update');
        });

        describe('when form is valid', () => {
            beforeEach(() => {
                setFormValues();
            });

            it('should submit updated values', () => {
                const createdFolder: any = { name: 'folder-name-update' };
                createFolderSpy.and.returnValue(of(createdFolder));

                component.submit();

                expect(component.disableSubmitButton).toBeTrue();
                expect(createFolderSpy).toHaveBeenCalledWith('parentNodeId', {
                    name: 'folder-name-update',
                    properties: {
                        'cm:title': 'folder-title-update',
                        'cm:description': 'folder-description-update'
                    },
                    nodeType: 'cm:folder'
                });
            });

            it('should submit updated values (with custom nodeType)', () => {
                const createdFolder: any = { name: 'folder-name-update' };
                createFolderSpy.and.returnValue(of(createdFolder));
                component.nodeType = 'cm:sushi';

                fixture.detectChanges();
                submitButton.click();
                fixture.detectChanges();

                expect(component.form.valid).toBeTrue();
                expect(submitButton.disabled).toBeTrue();
                expect(component.disableSubmitButton).toBeTrue();
                expect(createFolderSpy).toHaveBeenCalledWith('parentNodeId', {
                    name: 'folder-name-update',
                    properties: {
                        'cm:title': 'folder-title-update',
                        'cm:description': 'folder-description-update'
                    },
                    nodeType: 'cm:sushi'
                });
            });
        });

        it('should call dialog to close with form data when submit is successfully', () => {
            const folder: any = { data: 'folder-data', name: 'folder-data' };
            createFolderSpy.and.returnValue(of(folder));

            setFormValues();
            component.submit();

            expect(dialogRef.close).toHaveBeenCalledWith(folder);
        });

        it('should not submit if form is invalid', () => {
            component.form.controls['name'].setValue('');
            component.form.controls['description'].setValue('');

            expect(submitButton.disabled).toBeTrue();
            expect(component.form.valid).toBeFalse();
            expect(createFolderSpy).not.toHaveBeenCalled();
        });

        it('should not call dialog to close if submit fails', () => {
            createFolderSpy.and.returnValue(throwError(() => 'error'));
            spyOn(component, 'handleError').and.callFake((val) => val);

            component.form.controls['name'].setValue('name');
            component.form.controls['description'].setValue('description');

            component.submit();

            expect(component.handleError).toHaveBeenCalled();
            expect(dialogRef.close).not.toHaveBeenCalled();
        });

        it('should show success notification with folder name when folder is created', () => {
            const createdFolder: any = { name: 'new-folder' };
            createFolderSpy.and.returnValue(of(createdFolder));

            component.form.controls['name'].setValue('new-folder');
            component.submit();

            expect(notificationService.showInfo).toHaveBeenCalledWith('CORE.FOLDER_DIALOG.FOLDER_CREATED_SUCCESS');
        });

        describe('Error events', () => {
            it('should raise error for 409', (done) => {
                const error = {
                    message: '{ "error": {  "statusCode" : 409 } }'
                };
                createFolderSpy.and.returnValue(throwError(() => error));

                component.error.subscribe((message) => {
                    expect(message).toBe('CORE.MESSAGES.ERRORS.EXISTENT_FOLDER');
                    done();
                });

                component.form.controls['name'].setValue('name');
                component.form.controls['description'].setValue('description');

                component.submit();
            });

            it('should raise generic error', (done) => {
                const error = {
                    message: '{ "error": {  "statusCode" : 123 } }'
                };
                createFolderSpy.and.returnValue(throwError(() => error));

                component.error.subscribe((message) => {
                    expect(message).toBe('CORE.MESSAGES.ERRORS.GENERIC');
                    done();
                });

                component.form.controls['name'].setValue('name');
                component.form.controls['description'].setValue('description');

                component.submit();
            });

            it('should enable submit button after changing name field when previous value caused error', () => {
                createFolderSpy.and.returnValue(throwError(() => 'error'));
                spyOn(component, 'handleError').and.callFake((val) => val);
                component.form.controls['name'].setValue('');
                component.submit();
                expect(component.disableSubmitButton).toBeTrue();

                component.form.controls['name'].setValue('testName');
                expect(component.disableSubmitButton).toBeFalse();
            });
        });
    });

    /**
     * Set mock values to form
     */
    function setFormValues() {
        component.form.controls['name'].setValue('folder-name-update');
        component.form.controls['title'].setValue('folder-title-update');
        component.form.controls['description'].setValue('folder-description-update');
    }
});
