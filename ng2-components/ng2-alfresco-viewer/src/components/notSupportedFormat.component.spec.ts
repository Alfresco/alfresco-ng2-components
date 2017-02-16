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
import { NotSupportedFormat } from './notSupportedFormat.component';
import { DebugElement }    from '@angular/core';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    AlfrescoApiService,
    CoreModule
} from 'ng2-alfresco-core';

describe('Test ng2-alfresco-viewer Not Supported Format View component', () => {

    let component: NotSupportedFormat;
    let fixture: ComponentFixture<NotSupportedFormat>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [NotSupportedFormat],
            providers: [
                AlfrescoSettingsService,
                AlfrescoAuthenticationService,
                AlfrescoApiService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NotSupportedFormat);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('View', () => {

        it('Download button should be present', () => {
            expect(element.querySelector('#viewer-download-button')).not.toBeNull();
        });

        it('should display the name of the file', () => {
            component.nameFile = 'Example Content.xls';
            fixture.detectChanges();
            expect(element.querySelector('h4 span').innerHTML).toEqual('Example Content.xls');
        });
    });

    describe('User Interaction', () => {
        it('Click on Download button should call download method', () => {
            spyOn(window, 'open');

            let downloadButton: any = element.querySelector('#viewer-download-button');
            downloadButton.click();

            expect(window.open).toHaveBeenCalled();
        });
    });
});
