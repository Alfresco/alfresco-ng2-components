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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TxtViewerComponent } from './txtViewer.component';
import { DebugElement, SimpleChange }    from '@angular/core';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    AlfrescoApiService,
    CoreModule
} from 'ng2-alfresco-core';

describe('Test ng2-alfresco-viewer Text View component', () => {

    let component: TxtViewerComponent;
    let fixture: ComponentFixture<TxtViewerComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [TxtViewerComponent],
            providers: [
                AlfrescoSettingsService,
                AlfrescoAuthenticationService,
                AlfrescoApiService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TxtViewerComponent);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        component.urlFile = require('../assets/fake-test-file.txt');
    });

    describe('View', () => {

        it('Should text container be present with urlfile', (done) => {
            fixture.detectChanges();
            let change = new SimpleChange(null, null, true);

            component.ngOnChanges(change).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(element.querySelector('#adf-viewer-text-container').textContent).toContain('example');
                    done();
                });
            });
        });
    });
});
