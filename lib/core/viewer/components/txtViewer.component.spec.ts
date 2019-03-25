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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TxtViewerComponent } from './txtViewer.component';
import { setupTestBed } from '../../testing/setupTestBed';
import { CoreModule } from '../../core.module';

describe('Text View component', () => {

    let component: TxtViewerComponent;
    let fixture: ComponentFixture<TxtViewerComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TxtViewerComponent);

        element = fixture.nativeElement;
        component = fixture.componentInstance;
    });

    describe('View', () => {

        it('Should text container be present with urlFile', (done) => {
            fixture.detectChanges();
            const urlFile = './fake-test-file.txt';
            const change = new SimpleChange(null, urlFile, true);

            component.ngOnChanges({ 'urlFile': change }).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(element.querySelector('.adf-txt-viewer-content').textContent).toContain('example');
                    done();
                });
            });
        });

        it('Should text container be present with Blob file', (done) => {
            const blobFile = new Blob(['text example'], {type: 'text/txt'});

            const change = new SimpleChange(null, blobFile, true);

            component.ngOnChanges({ 'blobFile': change }).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(element.querySelector('.adf-txt-viewer-content').textContent).toContain('example');
                    done();
                });
            });
        });

    });
});
