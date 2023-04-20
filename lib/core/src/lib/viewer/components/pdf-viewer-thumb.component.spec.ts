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

import { DomSanitizer } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfThumbComponent } from './pdf-viewer-thumb.component';
import { setupTestBed } from '../../testing/setup-test-bed';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('PdfThumbComponent', () => {

    let fixture: ComponentFixture<PdfThumbComponent>;
    let component: PdfThumbComponent;
    const domSanitizer = {
        bypassSecurityTrustUrl: () => 'image-data'
    };
    const width = 91;
    const height = 119;
    const page = {
        id: 'pageId',
        getPage: jasmine.createSpy('getPage').and.returnValue(Promise.resolve({
            getViewport: () => ({ height: width, width: height }),
            render: jasmine.createSpy('render').and.returnValue({ promise: Promise.resolve() })
        })),

        getWidth: jasmine.createSpy('getWidth').and.returnValue(width),
        getHeight: jasmine.createSpy('getHeight').and.returnValue(height)
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        providers: [
            { provide: DomSanitizer, useValue: domSanitizer }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PdfThumbComponent);
        component = fixture.componentInstance;
    });

    it('should have resolve image data', (done) => {
        component.page = page;
        fixture.detectChanges();

        component.image$.then((result) => {
            expect(result).toBe('image-data');
            done();
        });
    });

    it('should focus element', () => {
        component.page = page;
        fixture.detectChanges();
        component.focus();

        expect(fixture.debugElement.nativeElement.id).toBe(document.activeElement.id);
    });
});
