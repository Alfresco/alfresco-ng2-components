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

import { ElementRef } from '@angular/core';
import { FileInfo } from './../utils/file-utils';
import { UploadDirective } from './upload.directive';

describe('UploadDirective', () => {

    let directive: UploadDirective;
    let nativeElement: any;

    beforeEach(() => {
        nativeElement = {
            classList: jasmine.createSpyObj('classList', ['add', 'remove']),
            dispatchEvent: () => {}
        };
        directive = new UploadDirective(new ElementRef(nativeElement), null, null);
    });

    it('should be enabled by default', () => {
        expect(directive.enabled).toBeTruthy();
    });

    it('should update drag status on dragenter', () => {
        expect(directive.isDragging).toBeFalsy();
        directive.enabled = true;
        directive.onDragEnter();
        expect(directive.isDragging).toBeTruthy();
    });

    it('should not update drag status on dragenter when disabled', () => {
        expect(directive.isDragging).toBeFalsy();
        directive.enabled = false;
        directive.onDragEnter();
        expect(directive.isDragging).toBeFalsy();
    });

    it('should update drag status on dragover', () => {
        expect(directive.isDragging).toBeFalsy();
        directive.enabled = true;
        directive.onDragOver(new CustomEvent('dragover'));
        expect(directive.isDragging).toBeTruthy();
    });

    it('should prevent default event on dragover', () => {
        const event = new Event('dom-event');
        spyOn(event, 'preventDefault').and.stub();
        directive.enabled = true;
        directive.onDragOver(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(directive.isDragging).toBeTruthy();
    });

    it('should not update drag status on dragover when disabled', () => {
        expect(directive.isDragging).toBeFalsy();
        directive.enabled = false;
        directive.onDragOver(new CustomEvent('dragover'));
    });

    it('should update drag status on dragleave', () => {
        directive.enabled = true;
        directive.isDragging = true;
        directive.onDragLeave();
        expect(directive.isDragging).toBeFalsy();
    });

    it('should not update drag status on dragleave when disabled', () => {
        directive.enabled = false;
        directive.isDragging = true;
        directive.onDragLeave();
        expect(directive.isDragging).toBeTruthy();
    });

    it('should prevent default event on drop', () => {
        directive.enabled = true;
        const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
        directive.onDrop(<DragEvent> event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should stop default event propagation on drop', () => {
        directive.enabled = true;
        const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
        directive.onDrop(<DragEvent> event);
        expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should not prevent default event on drop when disabled', () => {
        directive.enabled = false;
        const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
        directive.onDrop(<DragEvent> event);
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should raise upload-files event on files drop', (done) => {
        directive.enabled = true;
        const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
        spyOn(directive, 'getDataTransfer').and.returnValue({});
        spyOn(directive, 'getFilesDropped').and.returnValue(Promise.resolve([
            <FileInfo> {},
            <FileInfo> {}
        ]));
        spyOn(nativeElement, 'dispatchEvent').and.callFake((_) => {
            done();
        });
        directive.onDrop(event);
    });

    it('should provide dropped files in upload-files event', (done) => {
        directive.enabled = true;
        const files = [
            <FileInfo> {}
        ];
        const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
        spyOn(directive, 'getDataTransfer').and.returnValue({});
        spyOn(directive, 'getFilesDropped').and.returnValue(Promise.resolve(files));

        spyOn(nativeElement, 'dispatchEvent').and.callFake((e) => {
            expect(e.detail.files.length).toBe(1);
            expect(e.detail.files[0]).toBe(files[0]);
            done();
        });
        directive.onDrop(event);
    });

    it('should reset input value after file upload', () => {
        directive.enabled = true;
        directive.mode = ['click'];
        const files = [
            <FileInfo> {}
        ];
        const event = {'currentTarget': {'files': files}, 'target': {'value': '/testpath/document.pdf'}};

        directive.onSelectFiles(event);
        expect(event.target.value).toBe('');
    });
});
