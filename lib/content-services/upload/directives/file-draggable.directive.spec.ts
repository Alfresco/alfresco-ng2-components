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

import { ElementRef } from '@angular/core';
import { FileDraggableDirective } from '../directives/file-draggable.directive';

describe('FileDraggableDirective', () => {

    let component: FileDraggableDirective;

    beforeEach( () => {
        let el = new ElementRef(null);
        component = new FileDraggableDirective(el, null);
    });

    it('should always be enabled by default', () => {
        expect(component.enabled).toBeTruthy();
    });

    it('should not allow drag and drop when disabled', () => {
        component.enabled = false;
        let event = new CustomEvent('custom-event');
        spyOn(event, 'preventDefault').and.stub();
        component.onDropFiles(event);
        component.onDragEnter(event);
        component.onDragLeave(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    /*
    it('should emit onFolderEntityDropped event when a folder is dragged with Chrome' , (done) => {

        let itemEntity = {
            fullPath: '/folder-fake',
            isDirectory: true,
            isFile: false,
            name: 'folder-fake'
        };
        let fakeEvent = {
            dataTransfer: {
                items: [{
                    webkitGetAsEntry: () => {
                        return itemEntity;
                    }
                }]
            },
            stopPropagation: jasmine.createSpy('stopPropagation'),
            preventDefault: jasmine.createSpy('preventDefault')
        };

        component.onFolderEntityDropped.subscribe(files => {
            expect(files).toEqual(itemEntity);
            expect(component.getInputFocus()).toBe(false);
            done();
        });

        component.onDropFiles(fakeEvent);
    });

    it('should emit onFilesDropped event when a file is dragged not with Chrome' , (done) => {
        let file = {name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json'};
        let fakeEvent = {
            dataTransfer: {
                files: [file]
            },
            stopPropagation: jasmine.createSpy('stopPropagation'),
            preventDefault: jasmine.createSpy('preventDefault')
        };

        component.onFilesDropped.subscribe(files => {
            expect(files).toEqual([file]);
            expect(component.getInputFocus()).toBe(false);
            done();
        });

        component.onDropFiles(fakeEvent);
    });

    it('should emit onFilesDropped event when a file is dragged with Chrome', (done) => {
        let file = {name: 'fake-name-2', size: 10, webkitRelativePath: 'fake-folder1/fake-name-2.json'};
        let fakeEvent = {
            dataTransfer: {
                items: [''],
                files: [file]
            },
            stopPropagation: jasmine.createSpy('stopPropagation'),
            preventDefault: jasmine.createSpy('preventDefault')
        };

        component.onFilesDropped.subscribe(files => {
            expect(files).toEqual([file]);
            expect(component.getInputFocus()).toBe(false);
            done();
        });

        component.onDropFiles(fakeEvent);
    });

    it('should take the focus when the drag enter is called', () => {
        let mockEvent = new Event('dragstart');
        spyOn(mockEvent, 'preventDefault');

        expect(component.getInputFocus()).toBe(false);
        component.onDragEnter(mockEvent);
        expect(component.getInputFocus()).toBe(true);
    });
    */
});
