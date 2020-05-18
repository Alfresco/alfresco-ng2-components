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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    AlfrescoApiService,
    AlfrescoApiServiceMock,
    FileModel,
    UploadService,
    setupTestBed,
    CoreModule
} from '@alfresco/adf-core';

import { FileDraggableDirective } from '../directives/file-draggable.directive';
import { UploadDragAreaComponent } from './upload-drag-area.component';

function getFakeShareDataRow(allowableOperations = ['delete', 'update', 'create']) {
    return {
        obj: {
            entry: {
                createdAt: '2017-06-04T04:32:15.597Z',
                path: {
                    name: '/Company Home/User Homes/Test',
                    isComplete: true,
                    elements: [
                        {
                            id: '94acfc73-7014-4475-9bd9-93a2162f0f8c',
                            name: 'Company Home'
                        },
                        {
                            id: '55052317-7e59-4058-8e07-769f41e615e1',
                            name: 'User Homes'
                        },
                        {
                            id: '70e1cc6a-6918-468a-b84a-1048093b06fd',
                            name: 'Test'
                        }
                    ]
                },
                isFolder: true,
                name: 'pippo',
                id: '7462d28e-bd43-4b91-9e7b-0d71598680ac',
                nodeType: 'cm:folder',
                allowableOperations
            }
        }
    };
}

function getFakeFileShareRow(allowableOperations = ['delete', 'update', 'create']) {
    return {
        obj: {
            entry: {
                createdAt: '2017-06-04T04:32:15.597Z',
                path: {
                    name: '/Company Home/User Homes/Test',
                    isComplete: true,
                    elements: [
                        {
                            id: '94acfc73-7014-4475-9bd9-93a2162f0f8c',
                            name: 'Company Home'
                        },
                        {
                            id: '55052317-7e59-4058-8e07-769f41e615e1',
                            name: 'User Homes'
                        },
                        {
                            id: '70e1cc6a-6918-468a-b84a-1048093b06fd',
                            name: 'Test'
                        }
                    ]
                },
                isFolder: false,
                isFile: true,
                name: 'pippo',
                id: '7462d28e-bd43-4b91-9e7b-0d71598680ac',
                nodeType: 'cm:folder',
                allowableOperations
            }
        }
    };
}

describe('UploadDragAreaComponent', () => {

    let component: UploadDragAreaComponent;
    let fixture: ComponentFixture<UploadDragAreaComponent>;
    let uploadService: UploadService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        declarations: [
            FileDraggableDirective,
            UploadDragAreaComponent
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadDragAreaComponent);
        uploadService = TestBed.get(UploadService);

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('When disabled', () => {

        it('should NOT upload the list of files dropped', () => {
            component.disabled = true;
            spyOn(uploadService, 'addToQueue');
            spyOn(uploadService, 'uploadFilesInTheQueue');
            fixture.detectChanges();

            const file: any = { name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json' };
            const filesList = [file];

            component.onFilesDropped(filesList);

            expect(uploadService.addToQueue).not.toHaveBeenCalled();
            expect(uploadService.uploadFilesInTheQueue).not.toHaveBeenCalled();
        });

        it('should NOT upload the file dropped', () => {
            component.disabled = true;
            spyOn(uploadService, 'addToQueue');
            spyOn(uploadService, 'uploadFilesInTheQueue');
            fixture.detectChanges();

            component.onFilesDropped([new File(['fakefake'], 'file-fake.png', { type: 'image/png' })]);

            expect(uploadService.addToQueue).not.toHaveBeenCalled();
            expect(uploadService.uploadFilesInTheQueue).not.toHaveBeenCalled();
        });

        it('should NOT upload the folder dropped', (done) => {
            component.disabled = true;
            spyOn(uploadService, 'addToQueue');
            spyOn(uploadService, 'uploadFilesInTheQueue');
            fixture.detectChanges();

            const itemEntity = {
                isDirectory: true,
                createReader: () => {
                    return {
                        readEntries: (cb) => {
                            cb([]);
                        }
                    };
                }
            };
            component.onFolderEntityDropped(itemEntity);

            setTimeout(() => {
                expect(uploadService.addToQueue).not.toHaveBeenCalled();
                expect(uploadService.uploadFilesInTheQueue).not.toHaveBeenCalled();
                done();
            }, 0);
        });

        it('should NOT upload the files', () => {
            component.disabled = true;
            spyOn(uploadService, 'addToQueue');
            spyOn(uploadService, 'uploadFilesInTheQueue');

            const fakeItem = {
                fullPath: '/folder-fake/file-fake.png',
                isDirectory: false,
                isFile: true,
                relativeFolder: '/',
                name: 'file-fake.png',
                file: (callbackFile) => {
                    const fileFake = new File(['fakefake'], 'file-fake.png', { type: 'image/png' });
                    callbackFile(fileFake);
                }
            };
            fixture.detectChanges();

            const fakeCustomEvent: CustomEvent = new CustomEvent('CustomEvent', {
                detail: { data: getFakeShareDataRow([]), files: [fakeItem] }
            });
            component.onUploadFiles(fakeCustomEvent);

            expect(uploadService.addToQueue).not.toHaveBeenCalled();
            expect(uploadService.uploadFilesInTheQueue).not.toHaveBeenCalled();
        });
    });

    describe('Upload Files', () => {
        let addToQueueSpy;

        beforeEach(async(() => {
            addToQueueSpy = spyOn(uploadService, 'addToQueue');
        }));

        it('should upload the list of files dropped', async(() => {
            component.success = null;
            spyOn(uploadService, 'uploadFilesInTheQueue');
            fixture.detectChanges();

            const file: any = { name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json' };
            const filesList = [file];

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                addToQueueSpy.and.callFake((f: FileModel) => {
                    expect(f.file).toBe(file);
                });
                component.onFilesDropped(filesList);
            });
        }));

        it('should only upload those files whose fileTypes are in acceptedFilesType', async(() => {
            spyOn(uploadService, 'uploadFilesInTheQueue');
            component.success = null;
            component.acceptedFilesType = '.jpg,.pdf';
            fixture.detectChanges();
            const files: File[] = [
                <File> { name: 'phobos.jpg' },
                <File> { name: 'deimos.pdf' },
                <File> { name: 'ganymede.bmp' }
            ];
            component.onFilesDropped(files);
            fixture.whenStable().then(() => {
                expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalledWith(null);
                const filesCalledWith = addToQueueSpy.calls.mostRecent().args;
                expect(filesCalledWith.length).toBe(2, 'Files should contain two elements');
                expect(filesCalledWith[0].name).toBe('phobos.jpg');
                expect(filesCalledWith[1].name).toBe('deimos.pdf');
            });
        }));

        it('should upload a file if fileType is in acceptedFilesType', async(() => {
            spyOn(uploadService, 'uploadFilesInTheQueue');
            component.success = null;
            component.acceptedFilesType = '.png';
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                component.onFilesDropped([new File(['fakefake'], 'file-fake.png', { type: 'image/png' })]);
                expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalledWith(null);
            });
        }));

        it('should not upload a file if fileType is not in acceptedFilesType', async(() => {
            component.success = null;
            component.acceptedFilesType = '.pdf';
            fixture.detectChanges();
            spyOn(uploadService, 'uploadFilesInTheQueue');

            fixture.whenStable().then(() => {
                component.onFilesDropped([new File(['fakefake'], 'file-fake.png', { type: 'image/png' })]);
                expect(uploadService.uploadFilesInTheQueue).not.toHaveBeenCalledWith(null);
            });
        }));

        it('should upload a file with a custom root folder ID when dropped', async(() => {
            component.success = null;
            fixture.detectChanges();
            spyOn(uploadService, 'uploadFilesInTheQueue');

            component.onFilesDropped([new File(['fakefake'], 'file-fake.png', { type: 'image/png' })]);
            expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalledWith(null);
        }));

        it('should upload a file when user has create permission on target folder', async(() => {
            const fakeItem = {
                fullPath: '/folder-fake/file-fake.png',
                isDirectory: false,
                isFile: true,
                name: 'file-fake.png',
                relativeFolder: '/',
                file: (callbackFile) => {
                    const fileFake = new File(['fakefake'], 'file-fake.png', { type: 'image/png' });
                    callbackFile(fileFake);
                }
            };

            const fakeCustomEvent: CustomEvent = new CustomEvent('CustomEvent', {
                detail: {
                    data: getFakeShareDataRow(),
                    files: [fakeItem]
                }
            });

            component.onUploadFiles(fakeCustomEvent);
            expect(uploadService.addToQueue).toHaveBeenCalled();
        }));

        it('should upload a file to a specific target folder when dropped onto one', async(() => {

            const fakeItem = {
                fullPath: '/folder-fake/file-fake.png',
                isDirectory: false,
                isFile: true,
                name: 'file-fake.png',
                relativeFolder: '/',
                file: (callbackFile) => {
                    const fileFake = new File(['fakefake'], 'file-fake.png', { type: 'image/png' });
                    callbackFile(fileFake);
                }
            };

            addToQueueSpy.and.callFake((fileList) => {
                expect(fileList.name).toBe('file');
                expect(fileList.options.path).toBe('pippo/');
            });

            const fakeCustomEvent: CustomEvent = new CustomEvent('CustomEvent', {
                detail: {
                    data: getFakeShareDataRow(),
                    files: [fakeItem]
                }
            });

            component.onUploadFiles(fakeCustomEvent);
        }));

        it('should upload a folder to a specific target folder when dropped onto one', async(() => {

            const fakeItem = {
                fullPath: '/folder-fake/file-fake.png',
                isDirectory: false,
                isFile: true,
                name: 'file-fake.png',
                relativeFolder: '/super',
                file: (callbackFile) => {
                    const fileFake = new File(['fakefake'], 'file-fake.png', { type: 'image/png' });
                    callbackFile(fileFake);
                }
            };

            addToQueueSpy.and.callFake((fileList) => {
                expect(fileList.name).toBe('file');
                expect(fileList.options.path).toBe('pippo/super');
            });

            const fakeCustomEvent: CustomEvent = new CustomEvent('CustomEvent', {
                detail: {
                    data: getFakeShareDataRow(),
                    files: [fakeItem]
                }
            });

            component.onUploadFiles(fakeCustomEvent);
        }));

        it('should upload the file in the current folder when the target is file', async(() => {

            const fakeItem = {
                fullPath: '/folder-fake/file-fake.png',
                isDirectory: false,
                isFile: true,
                name: 'file-fake.png',
                relativeFolder: '/',
                file: (callbackFile) => {
                    const fileFake = new File(['fakefake'], 'file-fake.png', { type: 'image/png' });
                    callbackFile(fileFake);
                }
            };

            addToQueueSpy.and.callFake((fileList) => {
                expect(fileList.name).toBe('file');
                expect(fileList.options.path).toBe('/');
            });

            const fakeCustomEvent: CustomEvent = new CustomEvent('CustomEvent', {
                detail: {
                    data: getFakeFileShareRow(),
                    files: [fakeItem]
                }
            });

            component.onUploadFiles(fakeCustomEvent);
        }));
    });

    describe('Events', () => {

        it('should raise an error if upload a file goes wrong', (done) => {
            spyOn(uploadService, 'getUploadPromise').and.callThrough();

            const fakeItem = {
                fullPath: '/folder-fake/file-fake.png',
                isDirectory: false,
                isFile: true,
                relativeFolder: '/',
                name: 'file-fake.png',
                file: (callbackFile) => {
                    const fileFake = new File(['fakefake'], 'file-fake.png', { type: 'image/png' });
                    callbackFile(fileFake);
                }
            };

            fixture.detectChanges();

            component.error.subscribe((error) => {
                expect(error).not.toBeNull();
                done();
            });

            const fakeCustomEvent: CustomEvent = new CustomEvent('CustomEvent', {
                detail: {
                    data: getFakeShareDataRow(),
                    files: [fakeItem]
                }
            });

            component.onUploadFiles(fakeCustomEvent);
        });
    });
});
