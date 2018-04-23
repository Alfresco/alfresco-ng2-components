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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentService } from '../../services/content.service';

import { ImgViewerComponent } from './imgViewer.component';
import { setupTestBed } from '../../testing/setupTestBed';
import { CoreModule } from '../../core.module';

describe('Test Img viewer component ', () => {

    let component: ImgViewerComponent;
    let service: ContentService;
    let fixture: ComponentFixture<ImgViewerComponent>;
    let element: HTMLElement;

    function createFakeBlob() {
        let data = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        return new Blob([data], {type: 'image/png'});
    }

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        service = TestBed.get(ContentService);
        fixture = TestBed.createComponent(ImgViewerComponent);

        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should display current scale as percent string', () => {
        component.scaleX = 0.5;
        expect(component.currentScaleText).toBe('50%');

        component.scaleX = 1.0;
        expect(component.currentScaleText).toBe('100%');
    });

    it('should generate transform settings', () => {
        component.scaleX = 1.0;
        component.scaleY = 2.0;
        component.rotate = 10;
        component.offsetX = 20;
        component.offsetY = 30;

        expect(component.transform).toBe('scale(1, 2) rotate(10deg) translate(20px, 30px)');
    });

    it('should start drag on mouse down', () => {
        expect(component.isDragged).toBeFalsy();

        component.onMouseDown(<any> new CustomEvent('mousedown'));

        expect(component.isDragged).toBeTruthy();
    });

    it('should prevent default behaviour on mouse down', () => {
        const event = jasmine.createSpyObj('mousedown', ['preventDefault']);

        component.onMouseDown(event);

        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should prevent default mouse move during drag', () => {
        const event = jasmine.createSpyObj('mousemove', ['preventDefault']);

        component.onMouseDown(<any> new CustomEvent('mousedown'));
        component.onMouseMove(event);

        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not prevent default mouse move if not dragged', () => {
        const event = jasmine.createSpyObj('mousemove', ['preventDefault']);

        component.onMouseMove(event);

        expect(component.isDragged).toBeFalsy();
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should prevent default mouse up during drag end', () => {
        const event = jasmine.createSpyObj('mouseup', ['preventDefault']);

        component.onMouseDown(<any> new CustomEvent('mousedown'));
        expect(component.isDragged).toBeTruthy();

        component.onMouseUp(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should stop drag on mouse up', () => {
        component.onMouseDown(<any> new CustomEvent('mousedown'));
        expect(component.isDragged).toBeTruthy();

        component.onMouseUp(<any> new CustomEvent('mouseup'));
        expect(component.isDragged).toBeFalsy();
    });

    it('should stop drag on mouse leave', () => {
        component.onMouseDown(<any> new CustomEvent('mousedown'));
        expect(component.isDragged).toBeTruthy();

        component.onMouseLeave(<any> new CustomEvent('mouseleave'));
        expect(component.isDragged).toBeFalsy();
    });

    it('should stop drag on mouse out', () => {
        component.onMouseDown(<any> new CustomEvent('mousedown'));
        expect(component.isDragged).toBeTruthy();

        component.onMouseOut(<any> new CustomEvent('mouseout'));
        expect(component.isDragged).toBeFalsy();
    });

    it('should update scales on zoom in', () => {
        component.scaleX = 1.0;

        component.zoomIn();
        expect(component.scaleX).toBe(1.2);
        expect(component.scaleY).toBe(1.2);

        component.zoomIn();
        expect(component.scaleX).toBe(1.4);
        expect(component.scaleY).toBe(1.4);
    });

    it('should update scales on zoom out', () => {
        component.scaleX = 1.0;

        component.zoomOut();
        expect(component.scaleX).toBe(0.8);
        expect(component.scaleY).toBe(0.8);

        component.zoomOut();
        expect(component.scaleX).toBe(0.6);
        expect(component.scaleY).toBe(0.6);
    });

    it('should not zoom out past 20%', () => {
        component.scaleX = 0.4;

        component.zoomOut();
        component.zoomOut();
        component.zoomOut();

        expect(component.scaleX).toBe(0.2);
    });

    it('should update angle by 90 degrees on rotate left', () => {
        component.rotate = 0;

        component.rotateLeft();
        expect(component.rotate).toBe(-90);

        component.rotateLeft();
        expect(component.rotate).toBe(-180);
    });

    it('should reset to 0 degrees for full rotate left round', () => {
        component.rotate = -270;

        component.rotateLeft();
        expect(component.rotate).toBe(0);
    });

    it('should update angle by 90 degrees on rotate right', () => {
        component.rotate = 0;

        component.rotateRight();
        expect(component.rotate).toBe(90);

        component.rotateRight();
        expect(component.rotate).toBe(180);
    });

    it('should reset to 0 degrees for full rotate right round', () => {
        component.rotate = 270;

        component.rotateRight();
        expect(component.rotate).toBe(0);
    });

    it('should reset all image modifications', () => {
        component.rotate = 10;
        component.scaleX = 20;
        component.scaleY = 30;
        component.offsetX = 40;
        component.offsetY = 50;

        component.reset();

        expect(component.rotate).toBe(0);
        expect(component.scaleX).toBe(1.0);
        expect(component.scaleY).toBe(1.0);
        expect(component.offsetX).toBe(0);
        expect(component.offsetY).toBe(0);
    });

    it('If no url or blob are passed should thrown an error', () => {
        let change = new SimpleChange(null, null, true);
        expect(() => {
            component.ngOnChanges({ 'blobFile': change });
        }).toThrow(new Error('Attribute urlFile or blobFile is required'));
    });

    it('If  url is passed should not thrown an error', () => {
        component.urlFile = 'fake-url';
        expect(() => {
            component.ngOnChanges(null);
        }).not.toThrow(new Error('Attribute urlFile or blobFile is required'));
    });

    it('The file Name should be present in the alt attribute', () => {
        component.nameFile = 'fake-name';
        fixture.detectChanges();
        expect(element.querySelector('#viewer-image').getAttribute('alt')).toEqual('fake-name');
    });

    it('If blob is passed should not thrown an error', () => {
        let blob = createFakeBlob();

        spyOn(service, 'createTrustedUrl').and.returnValue('fake-blob-url');
        let change = new SimpleChange(null, blob, true);
        expect(() => {
            component.ngOnChanges({ 'blobFile': change });
        }).not.toThrow(new Error('Attribute urlFile or blobFile is required'));
        expect(component.urlFile).toEqual('fake-blob-url');
    });
});
