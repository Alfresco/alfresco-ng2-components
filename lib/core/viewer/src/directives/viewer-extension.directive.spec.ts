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

import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ViewerRenderComponent } from '../components/viewer-render/viewer-render.component';
import { ViewerExtensionDirective } from './viewer-extension.directive';
import { CoreTestingModule } from '@alfresco/adf-core';

describe('ExtensionViewerDirective', () => {
    let extensionViewerDirective: ViewerExtensionDirective;
    let viewerRenderer: ViewerRenderComponent;

    class MockElementRef extends ElementRef {
        constructor() {
            super(null);
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule],
            providers: [
                { provide: Location, useClass: SpyLocation },
                ViewerExtensionDirective,
                { provide: ElementRef, useClass: MockElementRef },
                ViewerRenderComponent,
                {
                    provide: ChangeDetectorRef,
                    useValue: {
                        detectChanges: () => {}
                    }
                }
            ]
        });
        extensionViewerDirective = TestBed.inject(ViewerExtensionDirective);
        viewerRenderer = TestBed.inject(ViewerRenderComponent);
        extensionViewerDirective.templateModel = { template: '', isVisible: false };
    });

    it('is defined', () => {
        expect(extensionViewerDirective).toBeDefined();
    });

    it('if the file in the viewer has an extension handled by this extension isVisible should be true', () => {
        extensionViewerDirective.supportedExtensions = ['xls', 'sts'];
        expect(extensionViewerDirective.isVisible('xls')).toBeTruthy();
    });

    it('if the file in the viewer not has an extension handled by this extension isVisible should be false', () => {
        extensionViewerDirective.supportedExtensions = ['xls', 'sts'];
        expect(extensionViewerDirective.isVisible('png')).not.toBeTruthy();
    });

    it('should set correct template and supported extensions in viewer renderer component', () => {
        extensionViewerDirective.supportedExtensions = ['png', 'txt'];
        extensionViewerDirective.ngAfterContentInit();
        expect(viewerRenderer.extensionTemplates.length).toBe(1);
        expect(viewerRenderer.extensionTemplates[0]).toEqual(extensionViewerDirective.templateModel);
        expect(viewerRenderer.extensionsSupportedByTemplates).toEqual(extensionViewerDirective.supportedExtensions);
    });
});
