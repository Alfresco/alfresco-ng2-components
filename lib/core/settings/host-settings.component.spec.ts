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
import { CoreTestingModule } from '../testing/core.testing.module';
import { UserPreferencesService } from '../services/user-preferences.service';

describe('HostSettingsComponent', () => {

    let fixture: ComponentFixture<HostSettingsComponent>;
    let component: HostSettingsComponent;
    let userPreferences: UserPreferencesService;
    let element: any;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HostSettingsComponent);
        component = fixture.componentInstance;
        userPreferences = TestBed.get(UserPreferencesService);
        element = fixture.nativeElement;
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('BPM ', () => {

        let ecmUrlInput;
        let bpmUrlInput;

        beforeEach(() => {
            userPreferences.providers = 'BPM';
            fixture.detectChanges();
            bpmUrlInput = element.querySelector('#bpmHost');
            ecmUrlInput = element.querySelector('#ecmHost');
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should have a valid form when the url inserted is correct', (done) => {
            const url = 'http://localhost:9999/bpm';

            component.form.statusChanges.subscribe((status: string) => {
                expect(status).toEqual('VALID');
                done();
            });

            component.form.valueChanges.subscribe((values) => {
                expect(values.bpmHost).toEqual(url);
            });

            bpmUrlInput.value = url;
            bpmUrlInput.dispatchEvent(new Event('input'));
        });

        it('should have an invalid form when the inserted is wrong', (done) => {
            const url = 'wrong';

            component.form.statusChanges.subscribe((status: string) => {
                expect(status).toEqual('INVALID');
                expect(component.bpmHost.hasError('pattern')).toBeTruthy();
                done();
            });

            bpmUrlInput.value = url;
            bpmUrlInput.dispatchEvent(new Event('input'));
        });

        it('should not render the ECM url config if setting provider is BPM', () => {
            expect(ecmUrlInput).toEqual(null);
            expect(bpmUrlInput).toBeDefined();
        });

    });

    describe('ECM ', () => {

        let ecmUrlInput;
        let bpmUrlInput;

        beforeEach(() => {
            userPreferences.providers = 'ECM';
            fixture.detectChanges();
            bpmUrlInput = element.querySelector('#bpmHost');
            ecmUrlInput = element.querySelector('#ecmHost');
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should have a valid form when the url inserted is correct', (done) => {
            const url = 'http://localhost:9999/ecm';

            component.form.statusChanges.subscribe((status: string) => {
                expect(status).toEqual('VALID');
                done();
            });

            ecmUrlInput.value = url;
            ecmUrlInput.dispatchEvent(new Event('input'));
        });

        it('should have an invalid form when the url inserted is wrong', (done) => {
            const url = 'wrong';

            component.form.statusChanges.subscribe((status: string) => {
                expect(status).toEqual('INVALID');
                expect(component.ecmHost.hasError('pattern')).toBeTruthy();
                done();
            });

            ecmUrlInput.value = url;
            ecmUrlInput.dispatchEvent(new Event('input'));
        });

        it('should not render the BPM url config if setting provider is BPM', () => {
            expect(bpmUrlInput).toEqual(null);
            expect(ecmUrlInput).toBeDefined();
        });
    });

    describe('ALL ', () => {

        let ecmUrlInput;
        let bpmUrlInput;

        beforeEach(() => {
            userPreferences.providers = 'ALL';
            fixture.detectChanges();
            bpmUrlInput = element.querySelector('#bpmHost');
            ecmUrlInput = element.querySelector('#ecmHost');
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should have a valid form when the BPM and ECM url inserted are correct', (done) => {
            const urlEcm = 'http://localhost:9999/ecm';
            const urlBpm = 'http://localhost:9999/bpm';

            component.form.statusChanges.subscribe((status: string) => {
                expect(status).toEqual('VALID');
                done();
            });

            ecmUrlInput.value = urlEcm;
            bpmUrlInput.value = urlBpm;
            ecmUrlInput.dispatchEvent(new Event('input'));
        });

        it('should have an invalid form when one of the ECM url inserted is wrong', (done) => {
            const url = 'wrong';

            component.form.statusChanges.subscribe((status: string) => {
                expect(status).toEqual('INVALID');
                expect(component.ecmHost.hasError('pattern')).toBeTruthy();
                done();
            });

            ecmUrlInput.value = url;
            ecmUrlInput.dispatchEvent(new Event('input'));
        });

        it('should have an invalid form when one of the BPM url inserted is wrong', (done) => {
            const url = 'wrong';

            component.form.statusChanges.subscribe((status: string) => {
                expect(status).toEqual('INVALID');
                expect(component.bpmHost.hasError('pattern')).toBeTruthy();
                done();
            });

            bpmUrlInput.value = url;
            bpmUrlInput.dispatchEvent(new Event('input'));
        });

        it('should have an invalid form when both BPM and ECM url inserted are wrong', (done) => {
            const url = 'wrong';

            component.form.statusChanges.subscribe((status: string) => {
                expect(status).toEqual('INVALID');
                expect(component.bpmHost.hasError('pattern')).toBeTruthy();
                done();
            });

            bpmUrlInput.value = url;
            ecmUrlInput.value = url;
            bpmUrlInput.dispatchEvent(new Event('input'));
        });

    });

    describe('OAUTH ', () => {

        let ecmUrlInput;
        let bpmUrlInput;
        let oauthHostUrlInput;
        let clientIdInput;

        beforeEach(() => {
            userPreferences.providers = 'OAUTH';
            userPreferences.oauthConfig = {
                host: 'http://localhost:6543',
                redirectUri: '/',
                silentLogin: false,
                implicitFlow: true,
                clientId: 'activiti',
                scope: 'openid',
                secret: ''
            };
            fixture.detectChanges();
            bpmUrlInput = element.querySelector('#bpmHost');
            oauthHostUrlInput = element.querySelector('#oauthHost');
            clientIdInput = element.querySelector('#clientId');
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should have a valid form when the BPM is correct', (done) => {
            const urlBpm = 'http://localhost:9999/bpm';

            component.form.statusChanges.subscribe((status: string) => {
                expect(status).toEqual('VALID');
                done();
            });

            bpmUrlInput.value = urlBpm;
            bpmUrlInput.dispatchEvent(new Event('input'));
        });

        it('should have an invalid form when the url inserted is wrong', (done) => {
            const url = 'wrong';

            component.form.statusChanges.subscribe((status: string) => {
                expect(status).toEqual('INVALID');
                expect(component.bpmHost.hasError('pattern')).toBeTruthy();
                done();
            });

            bpmUrlInput.value = url;
            bpmUrlInput.dispatchEvent(new Event('input'));
        });

        it('should have an invalid form when the host is wrong', (done) => {
            const hostUrl = 'wrong';

            component.form.statusChanges.subscribe((status: string) => {
                expect(status).toEqual('INVALID');
                expect(component.host.hasError('pattern')).toBeTruthy();
                done();
            });

            oauthHostUrlInput.value = hostUrl;
            oauthHostUrlInput.dispatchEvent(new Event('input'));
        });

        it('should have a required clientId an invalid form when the clientId is missing', (done) => {
            component.form.statusChanges.subscribe((status: string) => {
                expect(status).toEqual('INVALID');
                expect(component.clientId.hasError('required')).toBeTruthy();
                done();
            });

            clientIdInput.value = '';
            clientIdInput.dispatchEvent(new Event('input'));
        });

    });

});
