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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TxtViewerComponent } from './txt-viewer.component';
import { UnitTestingUtils } from '../../../testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('Text View component', () => {
    let component: TxtViewerComponent;
    let fixture: ComponentFixture<TxtViewerComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TxtViewerComponent]
        });
        fixture = TestBed.createComponent(TxtViewerComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);

        const httpClient = TestBed.inject(HttpClient);
        spyOn(httpClient, 'get').and.returnValue(of('example'));

        component = fixture.componentInstance;
    });

    describe('View', () => {
        it('Should text container be present with urlFile', async () => {
            spyOn(component.contentLoaded, 'emit');
            fixture.detectChanges();
            const urlFile = './fake-test-file.txt';
            const change = new SimpleChange(null, urlFile, true);

            await component.ngOnChanges({ urlFile: change });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByCSS('.adf-txt-viewer-content').nativeElement.textContent).toContain('example');
            expect(component.contentLoaded.emit).toHaveBeenCalled();
        });

        it('Should text container be present with Blob file', async () => {
            spyOn(component.contentLoaded, 'emit');
            const blobFile = new Blob(['text example'], { type: 'text/txt' });

            const change = new SimpleChange(null, blobFile, true);

            await component.ngOnChanges({ blobFile: change });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByCSS('.adf-txt-viewer-content').nativeElement.textContent).toContain('example');
            expect(component.contentLoaded.emit).toHaveBeenCalled();
        });
    });
});
