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

import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { ElementRef } from '@angular/core';
import { Injector } from '@angular/core';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { ViewerComponent } from '../components/viewer.component';
import { ExtensionViewerDirective } from './extension-viewer.directive';

export class MockElementRef extends ElementRef {
    constructor() {
        super(null);
    }
}

describe('ExtensionViewerDirective', () => {
    let injector: Injector;
    let extensionViewerDirective: ExtensionViewerDirective;
    let viewerComponent: ViewerComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule],
            providers: [
                { provide: Location, useClass: SpyLocation },
                ExtensionViewerDirective,
                {provide: ElementRef, useClass: MockElementRef},
                ViewerComponent
            ]
        });
        injector = getTestBed();
        extensionViewerDirective = injector.get(ExtensionViewerDirective);
        viewerComponent = injector.get(ViewerComponent);
        extensionViewerDirective.templateModel = {template: '', isVisible: false};
    }));

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
});
