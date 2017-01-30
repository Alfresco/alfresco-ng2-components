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
"use strict";
var file_draggable_directive_1 = require("../directives/file-draggable.directive");
describe('Test ng2-alfresco-upload FileDraggableDirective', function () {
    var component;
    beforeEach(function () {
        component = new file_draggable_directive_1.FileDraggableDirective();
    });
    it('should emit onFolderEntityDropped event when a folder is dragged with Chrome', function (done) {
        var itemEntity = {
            fullPath: '/folder-fake',
            isDirectory: true,
            isFile: false,
            name: 'folder-fake'
        };
        var fakeEvent = {
            dataTransfer: {
                items: [{
                        webkitGetAsEntry: function () {
                            return itemEntity;
                        }
                    }]
            },
            stopPropagation: jasmine.createSpy('stopPropagation'),
            preventDefault: jasmine.createSpy('preventDefault')
        };
        component.onFolderEntityDropped.subscribe(function (files) {
            expect(files).toEqual(itemEntity);
            expect(component.getInputFocus()).toBe(false);
            done();
        });
        component._onDropFiles(fakeEvent);
    });
    it('should emit onFilesDropped event when a file is dragged not with Chrome', function (done) {
        var file = { name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json' };
        var fakeEvent = {
            dataTransfer: {
                files: [file]
            },
            stopPropagation: jasmine.createSpy('stopPropagation'),
            preventDefault: jasmine.createSpy('preventDefault')
        };
        component.onFilesDropped.subscribe(function (files) {
            expect(files).toEqual([file]);
            expect(component.getInputFocus()).toBe(false);
            done();
        });
        component._onDropFiles(fakeEvent);
    });
    it('should emit onFilesDropped event when a file is dragged with Chrome', function (done) {
        var file = { name: 'fake-name-2', size: 10, webkitRelativePath: 'fake-folder1/fake-name-2.json' };
        var fakeEvent = {
            dataTransfer: {
                items: [''],
                files: [file]
            },
            stopPropagation: jasmine.createSpy('stopPropagation'),
            preventDefault: jasmine.createSpy('preventDefault')
        };
        component.onFilesDropped.subscribe(function (files) {
            expect(files).toEqual([file]);
            expect(component.getInputFocus()).toBe(false);
            done();
        });
        component._onDropFiles(fakeEvent);
    });
    it('should take the focus when the drag enter is called', function () {
        var mockEvent = new Event('dragstart');
        spyOn(mockEvent, 'preventDefault');
        expect(component.getInputFocus()).toBe(false);
        component._onDragEnter(mockEvent);
        expect(component.getInputFocus()).toBe(true);
    });
});
//# sourceMappingURL=file-draggable.directive.spec.js.map