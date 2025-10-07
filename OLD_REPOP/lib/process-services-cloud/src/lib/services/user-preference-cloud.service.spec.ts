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

import { TestBed } from '@angular/core/testing';
import { UserPreferenceCloudService } from './user-preference-cloud.service';
import { mockPreferences, getMockPreference, createMockPreference, updateMockPreference } from '../mock/user-preference.mock';
import { AdfHttpClient } from '@alfresco/adf-core/api';
import { NoopTranslateModule } from '@alfresco/adf-core';

describe('PreferenceService', () => {
    let service: UserPreferenceCloudService;
    let adfHttpClient: AdfHttpClient;
    let requestSpy: jasmine.Spy;

    const errorResponse = {
        error: 'Mock Error',
        state: 404,
        stateText: 'Not Found'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule]
        });
        service = TestBed.inject(UserPreferenceCloudService);
        adfHttpClient = TestBed.inject(AdfHttpClient);
        requestSpy = spyOn(adfHttpClient, 'request').and.returnValue(Promise.resolve(mockPreferences));
    });

    it('should return the preferences', (done) => {
        service.getPreferences('mock-app-name').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.list.entries.length).toBe(3);
            expect(res.list.entries[0].entry.key).toBe('mock-preference-key-1');
            expect(res.list.entries[0].entry.value.length).toBe(2);
            expect(res.list.entries[0].entry.value[0].username).toBe('mock-username-1');
            expect(res.list.entries[0].entry.value[0].firstName).toBe('mock-firstname-1');

            expect(res.list.entries[1].entry.key).toBe('mock-preference-key-2');
            expect(res.list.entries[1].entry.value).toBe('my mock preference value');

            expect(res.list.entries[2].entry.key).toBe('mock-preference-key-3');
            expect(res.list.entries[2].entry.value.appName).toBe('mock-appName');
            expect(res.list.entries[2].entry.value.state).toBe('MOCK-COMPLETED');
            done();
        });
    });

    it('Should not fetch preferences if error occurred', (done) => {
        requestSpy.and.returnValue(Promise.reject(errorResponse));
        service.getPreferences('mock-app-name').subscribe(
            () => fail('expected an error, not preferences'),
            (error) => {
                expect(error.state).toEqual(404);
                expect(error.stateText).toEqual('Not Found');
                expect(error.error).toEqual('Mock Error');
                done();
            }
        );
    });

    it('should return the preference by key', (done) => {
        requestSpy.and.returnValue(Promise.resolve(getMockPreference));
        service.getPreferenceByKey('mock-app-name', 'mock-preference-key').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(2);
            expect(res[0].appName).toBe('mock-appName');
            expect(res[0].firstName).toBe('mock-firstname-1');
            expect(res[1].appName).toBe('mock-appName');
            expect(res[1].username).toBe('mock-username-2');
            done();
        });
    });

    it('Should not fetch preference by key if error occurred', (done) => {
        requestSpy.and.returnValue(Promise.reject(errorResponse));
        service.getPreferenceByKey('mock-app-name', 'mock-preference-key').subscribe(
            () => fail('expected an error, not preference'),
            (error) => {
                expect(error.state).toEqual(404);
                expect(error.stateText).toEqual('Not Found');
                expect(error.error).toEqual('Mock Error');
                done();
            }
        );
    });

    it('should create preference', (done) => {
        requestSpy.and.returnValue(Promise.resolve(createMockPreference));
        service.createPreference('mock-app-name', 'mock-preference-key', createMockPreference).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res).toBe(createMockPreference);
            expect(res.appName).toBe('mock-appName');
            expect(res.name).toBe('create-preference');
            done();
        });
    });

    it('Should not create preference if error occurred', (done) => {
        requestSpy.and.returnValue(Promise.reject(errorResponse));
        service.createPreference('mock-app-name', 'mock-preference-key', createMockPreference).subscribe(
            () => fail('expected an error, not to create preference'),
            (error) => {
                expect(error.state).toEqual(404);
                expect(error.stateText).toEqual('Not Found');
                expect(error.error).toEqual('Mock Error');
                done();
            }
        );
    });

    it('should update preference', (done) => {
        requestSpy.and.returnValue(Promise.resolve(updateMockPreference));
        service.updatePreference('mock-app-name', 'mock-preference-key', updateMockPreference).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res).toBe(updateMockPreference);
            expect(res.appName).toBe('mock-appName');
            expect(res.name).toBe('update-preference');
            done();
        });
    });

    it('Should not update preference if error occurred', (done) => {
        requestSpy.and.returnValue(Promise.reject(errorResponse));
        service.createPreference('mock-app-name', 'mock-preference-key', updateMockPreference).subscribe(
            () => fail('expected an error, not to update preference'),
            (error) => {
                expect(error.state).toEqual(404);
                expect(error.stateText).toEqual('Not Found');
                expect(error.error).toEqual('Mock Error');
                done();
            }
        );
    });

    it('should delete preference', (done) => {
        requestSpy.and.returnValue(Promise.resolve(''));
        service.deletePreference('mock-app-name', 'mock-preference-key').subscribe((res: any) => {
            expect(res).toBeDefined();
            done();
        });
    });

    it('Should not delete preference if error occurred', (done) => {
        requestSpy.and.returnValue(Promise.reject(errorResponse));
        service.deletePreference('mock-app-name', 'mock-preference-key').subscribe(
            () => fail('expected an error, not to delete preference'),
            (error) => {
                expect(error.state).toEqual(404);
                expect(error.stateText).toEqual('Not Found');
                expect(error.error).toEqual('Mock Error');
                done();
            }
        );
    });
});
