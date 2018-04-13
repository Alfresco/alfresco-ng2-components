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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HostSettingsComponent } from './host-settings.component';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreModule } from '../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HostSettingsComponent', () => {

    let fixture: ComponentFixture<HostSettingsComponent>;
    let component: HostSettingsComponent;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HostSettingsComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should emit an error when the ECM url inserted is wrong', (done) => {
        fixture.detectChanges();

        component.error.subscribe((message: string) => {
            expect(message).toEqual('CORE.HOST_SETTING.CS_URL_ERROR');
            done();
        });

        const ecmUrlInput = fixture.nativeElement.querySelector('#ecmHost');
        ecmUrlInput.value = 'wrong_url';

        const event: any = {};
        event.target = ecmUrlInput;
        component.onChangeECMHost(event);
    });

    it('should emit ecmHostChange when the ECM url inserted is correct', (done) => {
        fixture.detectChanges();
        const url = 'http://localhost:9999/ecm';
        component.ecmHostChange.subscribe((message: string) => {
            expect(message).toEqual(url);
            done();
        });

        const ecmUrlInput = fixture.nativeElement.querySelector('#ecmHost');
        ecmUrlInput.value = url;

        const event: any = {};
        event.target = ecmUrlInput;
        component.onChangeECMHost(event);
    });

    it('should emit an error when the BPM url inserted is wrong', (done) => {
        fixture.detectChanges();

        component.error.subscribe((message: string) => {
            expect(message).toEqual('CORE.HOST_SETTING.PS_URL_ERROR');
            done();
        });

        const bpmUrlInput: any = fixture.nativeElement.querySelector('#bpmHost');
        bpmUrlInput.value = 'wrong_url';

        const event: any = {};
        event.target = bpmUrlInput;
        component.onChangeBPMHost(event);
    });

    it('should emit bpmHostChange when the BPM url inserted is correct', (done) => {
        fixture.detectChanges();
        const url = 'http://localhost:9999/bpm';

        component.ecmHostChange.subscribe((message: string) => {
            expect(message).toEqual(url);
            done();
        });

        const ecmUrlInput = fixture.nativeElement.querySelector('#bpmHost');
        ecmUrlInput.value = url;

        const event: any = {};
        event.target = ecmUrlInput;
        component.onChangeECMHost(event);
    });

    it('should not render the ECM url config if setting provider is BPM', () => {
        component.providers = 'BPM';

        fixture.detectChanges();

        const bpmUrlInput = fixture.nativeElement.querySelector('#bpmHost');
        const ecmUrlInput = fixture.nativeElement.querySelector('#ecmHost');
        expect(ecmUrlInput).toEqual(null);
        expect(bpmUrlInput).toBeDefined();
    });

    it('should hide the BPM url config if setting provider is ECM', () => {
        component.providers = 'ECM';

        fixture.detectChanges();

        const ecmUrlInput = fixture.nativeElement.querySelector('#ecmHost');
        const bpmUrlInput = fixture.nativeElement.querySelector('#bpmHost');
        expect(bpmUrlInput).toEqual(null);
        expect(ecmUrlInput).toBeDefined();
    });
});
