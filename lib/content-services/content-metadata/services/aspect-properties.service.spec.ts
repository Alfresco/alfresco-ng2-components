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

import { async, TestBed } from '@angular/core/testing';
import { AspectPropertiesService } from './aspect-properties.service';
import { AspectsApi } from '../spike/aspects-api.service';
import { Observable } from 'rxjs/Observable';

describe('AspectPropertiesService', () => {

    let aspectProperties: AspectPropertiesService,
        aspectsApi: AspectsApi;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                AspectPropertiesService,
                AspectsApi
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        aspectProperties = TestBed.get(AspectPropertiesService);
        aspectsApi = TestBed.get(AspectsApi);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should load the aspects passed by paramter', () => {
        spyOn(aspectsApi, 'fetchAspect');

        aspectProperties.load(['exif:exif', 'cm:content', 'custom:custom']);

        expect(aspectsApi.fetchAspect).toHaveBeenCalledTimes(3);
        expect(aspectsApi.fetchAspect).toHaveBeenCalledWith('exif:exif');
        expect(aspectsApi.fetchAspect).toHaveBeenCalledWith('cm:content');
        expect(aspectsApi.fetchAspect).toHaveBeenCalledWith('custom:custom');
    });

    it('should emit forked value of fetchings', (done) => {

        const expectations = [ { name: 'exif:exif', id: 1 }, { name: 'cm:content', id: 2 } ];
        let counter = 0;

        spyOn(aspectsApi, 'fetchAspect').and.callFake(() => {
            return Observable.of(expectations[counter++]);
        });

        aspectProperties.load(['exif:exif', 'cm:content'])
            .subscribe({
                next: (data) => {
                    expect(data['exif:exif']).toBe(expectations[0]);
                    expect(data['cm:content']).toBe(expectations[1]);
                },
                complete: done
            });
    });
});
