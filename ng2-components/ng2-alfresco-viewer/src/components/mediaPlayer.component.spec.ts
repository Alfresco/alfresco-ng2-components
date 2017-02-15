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
import { MediaPlayerComponent } from './mediaPlayer.component';
import { DebugElement }    from '@angular/core';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    AlfrescoApiService,
    CoreModule
} from 'ng2-alfresco-core';

describe('Test ng2-alfresco-viewer Media player component ', () => {

    let component: any;
    let fixture: ComponentFixture<MediaPlayerComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [MediaPlayerComponent],
            providers: [
                AlfrescoSettingsService,
                AlfrescoAuthenticationService,
                AlfrescoApiService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaPlayerComponent);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('If no url is passed should thrown an error', () => {
        expect(() => {
            component.ngOnChanges();
        }).toThrow(new Error('Attribute urlFile is required'));
    });

    it('If  url is passed should not thrown an error', () => {
        component.urlFile = 'fake-url';
        expect(() => {
            component.ngOnChanges();
        }).not.toThrow(new Error('Attribute urlFile is required'));
    });

    it('If  url is passed should not thrown an error', () => {
        component.urlFile = 'fake-url';
        expect(() => {
            component.ngOnChanges();
        }).not.toThrow(new Error('Attribute urlFile is required'));
    });
});
