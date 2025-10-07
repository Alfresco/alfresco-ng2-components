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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppConfigService } from '../../../app-config';
import { UrlService } from '../../../common';
import { UnitTestingUtils } from '../../../testing';
import { ImgViewerComponent } from './img-viewer.component';

describe('Test Img viewer component ', () => {
    let component: ImgViewerComponent;
    let urlService: UrlService;
    let fixture: ComponentFixture<ImgViewerComponent>;
    let testingUtils: UnitTestingUtils;

    const createFakeBlob = () => {
        const data = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        return new Blob([data], { type: 'image/png' });
    };

    describe('Zoom customization', () => {
        beforeEach(() => {
            urlService = TestBed.inject(UrlService);
            fixture = TestBed.createComponent(ImgViewerComponent);
            testingUtils = new UnitTestingUtils(fixture.debugElement);

            component = fixture.componentInstance;
            component.urlFile = 'fake-url-file.png';
            fixture.detectChanges();
        });

        describe('default value', () => {
            it('should use default zoom if is not present a custom zoom in the app.config', () => {
                fixture.detectChanges();
                expect(component.scale).toBe(1.0);
            });
        });

        describe('custom value', () => {
            beforeEach(() => {
                const appConfig: AppConfigService = TestBed.inject(AppConfigService);
                appConfig.config['adf-viewer-render.image-viewer-scaling'] = 70;
                component.initializeScaling();
            });

            it('should use the custom zoom if it is present in the app.config', (done) => {
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(component.scale).toBe(0.7);
                    done();
                });
            });
        });
    });

    describe('Url', () => {
        beforeEach(() => {
            urlService = TestBed.inject(UrlService);
            fixture = TestBed.createComponent(ImgViewerComponent);

            component = fixture.componentInstance;
            component.urlFile =
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
            fixture.detectChanges();
            fixture.componentInstance.ngAfterViewInit();
            component.ngAfterViewInit();
            fixture.detectChanges();
        });

        it('should display current scale as percent string', () => {
            component.scale = 0.5;
            expect(component.currentScaleText).toBe('50%');

            component.scale = 1.0;
            expect(component.currentScaleText).toBe('100%');
        });

        it('should define cropper after init', () => {
            fixture.componentInstance.ngAfterViewInit();
            expect(component.cropper).toBeDefined();
        });
    });

    describe('Blob', () => {
        beforeEach(() => {
            urlService = TestBed.inject(UrlService);
            fixture = TestBed.createComponent(ImgViewerComponent);
            testingUtils.setDebugElement(fixture.debugElement);

            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should thrown an error if no url or blob are passed', () => {
            const change = new SimpleChange(null, null, true);
            expect(() => {
                component.ngOnChanges({ blobFile: change, urlFile: change });
            }).toThrow(new Error('Attribute urlFile or blobFile is required'));
        });

        it('should not thrown an error if url is passed ', () => {
            component.urlFile = 'fake-url';
            expect(() => {
                component.ngOnChanges(null);
            }).not.toThrow(new Error('Attribute urlFile or blobFile is required'));
        });

        it('should present file name in the alt attribute', () => {
            component.fileName = 'fake-name';
            fixture.detectChanges();
            expect(testingUtils.getByCSS('#viewer-image').nativeElement.getAttribute('alt')).toEqual('fake-name');
        });

        it('should call replace on cropper with new url if blobFile is null', () => {
            component.urlFile = 'fake-url';
            spyOn(component.cropper, 'replace').and.stub();
            const urlFile = new SimpleChange('fake-url', 'fake-url-2', false);

            fixture.detectChanges();
            component.ngOnChanges({ urlFile });

            expect(component.cropper.replace).toHaveBeenCalledWith('fake-url-2');
        });

        it('should not thrown an error if blob is passed ', () => {
            const blob = createFakeBlob();

            spyOn(urlService, 'createTrustedUrl').and.returnValue('fake-blob-url');
            const change = new SimpleChange(null, blob, true);
            expect(() => {
                component.ngOnChanges({ blobFile: change });
            }).not.toThrow(new Error('Attribute urlFile or blobFile is required'));
            expect(component.urlFile).toEqual('fake-blob-url');
        });
    });

    describe('toolbar actions', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(ImgViewerComponent);
            component = fixture.componentInstance;
            testingUtils = new UnitTestingUtils(fixture.debugElement);
            component.blobFile = createFakeBlob();
            const change = new SimpleChange(null, component.blobFile, true);
            component.ngOnChanges({ blobFile: change });
            fixture.detectChanges();
        });

        it('should update scales on zoom in', fakeAsync(() => {
            spyOn(component, 'zoomIn').and.callThrough();
            spyOn(component.cropper, 'zoom');
            component.scale = 1.0;
            tick();

            component.zoomIn();
            expect(component.scale).toBe(1.2);
            expect(component.cropper.zoom).toHaveBeenCalledWith(0.2);

            component.zoomIn();
            expect(component.scale).toBe(1.4);
            expect(component.cropper.zoom).toHaveBeenCalledWith(0.2);
        }));

        it('should update scales on zoom out', fakeAsync(() => {
            spyOn(component, 'zoomOut').and.callThrough();
            spyOn(component.cropper, 'zoom');
            component.scale = 1.0;
            tick();

            component.zoomOut();
            expect(component.scale).toBe(0.8);
            expect(component.cropper.zoom).toHaveBeenCalledWith(-0.2);

            component.zoomOut();
            expect(component.scale).toBe(0.6);
            expect(component.cropper.zoom).toHaveBeenCalledWith(-0.2);
        }));

        it('should not zoom out past 20%', fakeAsync(() => {
            component.scale = 0.2;
            tick();

            component.zoomOut();
            component.zoomOut();
            component.zoomOut();

            expect(component.scale).toBe(0.2);
        }));

        it('should show rotate button if not in read only mode', () => {
            component.readOnly = false;
            fixture.detectChanges();

            expect(testingUtils.getByCSS('#viewer-rotate-button')).not.toEqual(null);
        });

        it('should not show rotate button by default', () => {
            expect(testingUtils.getByCSS('#viewer-rotate-button')).toEqual(null);
        });

        it('should not show crop button by default', () => {
            expect(testingUtils.getByCSS('#viewer-crop-button')).toEqual(null);
        });

        it('should start cropping when clicking the crop button', fakeAsync(() => {
            component.readOnly = false;
            spyOn(component, 'cropImage').and.callThrough();
            spyOn(component.cropper, 'crop');
            spyOn(component.cropper, 'setDragMode');
            fixture.detectChanges();
            testingUtils.clickByCSS('#viewer-crop-button');
            tick();

            expect(component.cropImage).toHaveBeenCalled();
            expect(component.cropper.crop).toHaveBeenCalled();
            expect(component.cropper.setDragMode).toHaveBeenCalledWith('crop');
        }));

        it('should rotate image by -90 degrees on button click', fakeAsync(() => {
            component.readOnly = false;
            spyOn(component, 'rotateImage').and.callThrough();
            spyOn(component.cropper, 'rotate');
            fixture.detectChanges();
            testingUtils.clickByCSS('#viewer-rotate-button');
            tick();

            expect(component.rotateImage).toHaveBeenCalled();
            expect(component.cropper.rotate).toHaveBeenCalledWith(-90);
        }));

        it('should display the second toolbar when in editing and not in read only mode', fakeAsync(() => {
            component.readOnly = false;
            component.isEditing = true;
            fixture.detectChanges();

            expect(testingUtils.getByCSS('.adf-secondary-toolbar')).not.toEqual(null);
        }));

        it('should not display the second toolbar when in read only mode', () => {
            component.readOnly = true;
            fixture.detectChanges();

            expect(testingUtils.getByCSS('.adf-secondary-toolbar')).toEqual(null);
        });

        it('should not display the second toolbar when not in editing', () => {
            component.readOnly = true;
            component.isEditing = false;
            fixture.detectChanges();

            expect(testingUtils.getByCSS('.adf-secondary-toolbar')).toEqual(null);
        });

        it('should display second toolbar in edit mode', fakeAsync(() => {
            component.readOnly = false;
            component.isEditing = true;

            fixture.detectChanges();

            expect(testingUtils.getByCSS('.adf-secondary-toolbar')).not.toEqual(null);
            expect(testingUtils.getByCSS('#viewer-cancel-button')).not.toEqual(null);
            expect(testingUtils.getByCSS('#viewer-save-button')).not.toEqual(null);
        }));

        it('should not be in editing mode by default', () => {
            component.readOnly = false;

            expect(component.isEditing).toEqual(false);
        });

        it('should get in editing mode when the image gets rotated', () => {
            component.readOnly = false;
            component.rotateImage();

            expect(component.isEditing).toEqual(true);
        });

        it('should get in editing mode when the image gets cropped', () => {
            component.readOnly = false;
            component.cropImage();

            expect(component.isEditing).toEqual(true);
        });

        it('should reset the scale and hide second toolbar', fakeAsync(() => {
            component.readOnly = false;
            component.isEditing = true;

            spyOn(component, 'reset').and.callThrough();
            spyOn(component, 'updateCanvasContainer');
            spyOn(component.cropper, 'reset');
            spyOn(component.cropper, 'clear');
            spyOn(component.cropper, 'zoomTo');

            fixture.detectChanges();
            testingUtils.clickByCSS('#viewer-cancel-button');
            tick();

            expect(component.reset).toHaveBeenCalled();
            expect(component.scale).toEqual(1.0);
            expect(component.isEditing).toEqual(false);
            expect(component.cropper.reset).toHaveBeenCalled();
            expect(component.cropper.clear).toHaveBeenCalled();
            expect(component.updateCanvasContainer).toHaveBeenCalled();
        }));

        it('should save when clicked on toolbar button', fakeAsync(() => {
            component.readOnly = false;
            component.isEditing = true;

            const canvasMock = document.createElement('canvas');
            spyOn(component.isSaving, 'emit');
            spyOn(component, 'save').and.callThrough();
            spyOn(component.cropper, 'getCroppedCanvas').and.returnValue(canvasMock);
            spyOn(component.cropper.getCroppedCanvas(), 'toBlob').and.callFake(() => component.isSaving.emit(false));

            fixture.detectChanges();
            testingUtils.clickByCSS('#viewer-save-button');
            tick();

            expect(component.save).toHaveBeenCalled();
            expect(component.isSaving.emit).toHaveBeenCalledWith(true);
            expect(component.isSaving.emit).toHaveBeenCalledWith(false);
        }));

        it('should reset the viewer after going to full screen mode', () => {
            Object.defineProperty(document, 'fullscreenElement', {
                value: true
            });
            spyOn(component, 'reset');

            document.dispatchEvent(new Event('fullscreenchange'));

            expect(component.reset).toHaveBeenCalled();
        });
    });

    describe('allowedEditActions', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(ImgViewerComponent);
            testingUtils.setDebugElement(fixture.debugElement);
            component = fixture.componentInstance;
        });

        it('should conditionally display rotate and crop buttons based on allowedEditActions', () => {
            component.readOnly = false;
            component.allowedEditActions = { rotate: true, crop: true };
            fixture.detectChanges();

            // Check both buttons are visible when allowed
            expect(testingUtils.getByCSS('#viewer-rotate-button')).not.toBeNull('Rotate button should be visible when allowed');
            expect(testingUtils.getByCSS('#viewer-crop-button')).not.toBeNull('Crop button should be visible when allowed');

            // Change allowedEditActions to disallow both actions
            component.allowedEditActions = { rotate: false, crop: false };
            fixture.detectChanges();

            // Check both buttons are not visible when not allowed
            expect(testingUtils.getByCSS('#viewer-rotate-button')).toBeNull('Rotate button should not be visible when disallowed');
            expect(testingUtils.getByCSS('#viewer-crop-button')).toBeNull('Crop button should not be visible when disallowed');
        });
    });
});
