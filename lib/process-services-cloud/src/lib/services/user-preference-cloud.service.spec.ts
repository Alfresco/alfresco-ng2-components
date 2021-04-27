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

import { TestBed, async } from '@angular/core/testing';

import { UserPreferenceCloudService } from './user-preference-cloud.service';
import { setupTestBed, AlfrescoApiService } from '@alfresco/adf-core';
import { mockPreferences, getMockPreference, createMockPreference, updateMockPreference } from '../mock/user-preference.mock';
import { ProcessServiceCloudTestingModule } from '../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('PreferenceService', () => {
  let service: UserPreferenceCloudService;
  let alfrescoApiMock: AlfrescoApiService;
  let getInstanceSpy: jasmine.Spy;

  const errorResponse = {
    error: 'Mock Error',
    state: 404, stateText: 'Not Found'
  };

  function apiMock(mockResponse) {
    return {
      oauth2Auth: {
        callCustomApi: () => {
          return Promise.resolve(mockResponse);
        },
        on: jasmine.createSpy('on')
      },
      isEcmLoggedIn() {
        return false;
      }
    };
  }

  const apiErrorMock = {
    oauth2Auth: {
      callCustomApi: () => Promise.reject(errorResponse)
    },
    isEcmLoggedIn() {
        return false;
    }
  };

  setupTestBed({
    imports: [
        TranslateModule.forRoot(),
        ProcessServiceCloudTestingModule
    ]
  });

  beforeEach(async(() => {
    service = TestBed.inject(UserPreferenceCloudService);
    alfrescoApiMock = TestBed.inject(AlfrescoApiService);
    getInstanceSpy = spyOn(alfrescoApiMock, 'getInstance').and.returnValue(apiMock(mockPreferences));
  }));

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

  it('Should not fetch preferences if error occurred', () => {
    getInstanceSpy.and.returnValue(apiErrorMock);
    service.getPreferences('mock-app-name')
      .subscribe(
        () => fail('expected an error, not preferences'),
        (error) => {
          expect(error.state).toEqual(404);
          expect(error.stateText).toEqual('Not Found');
          expect(error.error).toEqual('Mock Error');
        }
      );
  });

  it('should return the preference by key', (done) => {
    getInstanceSpy.and.returnValue(apiMock(getMockPreference));
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

  it('Should not fetch preference by key if error occurred', () => {
    getInstanceSpy.and.returnValue(apiErrorMock);
    service.getPreferenceByKey('mock-app-name', 'mock-preference-key')
      .subscribe(
        () => fail('expected an error, not preference'),
        (error) => {
          expect(error.state).toEqual(404);
          expect(error.stateText).toEqual('Not Found');
          expect(error.error).toEqual('Mock Error');
        }
      );
  });

  it('should create preference', (done) => {
    getInstanceSpy.and.returnValue(apiMock(createMockPreference));
    service.createPreference('mock-app-name', 'mock-preference-key', createMockPreference).subscribe((res: any) => {
      expect(res).toBeDefined();
      expect(res).not.toBeNull();
      expect(res).toBe(createMockPreference);
      expect(res.appName).toBe('mock-appName');
      expect(res.name).toBe('create-preference');
      done();
    });
  });

  it('Should not create preference if error occurred', () => {
    getInstanceSpy.and.returnValue(apiErrorMock);
    service.createPreference('mock-app-name', 'mock-preference-key', createMockPreference)
      .subscribe(
        () => fail('expected an error, not to create preference'),
        (error) => {
          expect(error.state).toEqual(404);
          expect(error.stateText).toEqual('Not Found');
          expect(error.error).toEqual('Mock Error');
        }
      );
  });

  it('should update preference', (done) => {
    getInstanceSpy.and.returnValue(apiMock(updateMockPreference));
    service.updatePreference('mock-app-name', 'mock-preference-key', updateMockPreference).subscribe((res: any) => {
      expect(res).toBeDefined();
      expect(res).not.toBeNull();
      expect(res).toBe(updateMockPreference);
      expect(res.appName).toBe('mock-appName');
      expect(res.name).toBe('update-preference');
      done();
    });
  });

  it('Should not update preference if error occurred', () => {
    getInstanceSpy.and.returnValue(apiErrorMock);
    service.createPreference('mock-app-name', 'mock-preference-key', updateMockPreference)
      .subscribe(
        () => fail('expected an error, not to update preference'),
        (error) => {
          expect(error.state).toEqual(404);
          expect(error.stateText).toEqual('Not Found');
          expect(error.error).toEqual('Mock Error');
        }
      );
  });

  it('should delete preference', (done) => {
    getInstanceSpy.and.returnValue(apiMock(''));
    service.deletePreference('mock-app-name', 'mock-preference-key').subscribe((res: any) => {
      expect(res).toBeDefined();
      done();
    });
  });

  it('Should not delete preference if error occurred', () => {
    getInstanceSpy.and.returnValue(apiErrorMock);
    service.deletePreference('mock-app-name', 'mock-preference-key')
      .subscribe(
        () => fail('expected an error, not to delete preference'),
        (error) => {
          expect(error.state).toEqual(404);
          expect(error.stateText).toEqual('Not Found');
          expect(error.error).toEqual('Mock Error');
        }
      );
  });
});
