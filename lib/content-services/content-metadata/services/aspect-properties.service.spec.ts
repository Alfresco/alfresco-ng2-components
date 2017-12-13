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

    it('should flatten the forked values', (done) => {

        const apiResponses = [
            {
                name: 'exif:exif',
                id: 1,
                properties: {
                    'exif:1': { id: 'exif:1:id', name: 'exif:1' },
                    'exif:2': { id: 'exif:2:id', name: 'exif:2' }
                }
            },
            {
                name: 'cm:content',
                id: 2,
                properties: {
                    'cm:content': { id: 'cm:content:id', name: 'cm:content' }
                }

            }
        ];
        let counter = 0;

        spyOn(aspectsApi, 'fetchAspect').and.callFake(() => {
            return Observable.of(apiResponses[counter++]);
        });

        aspectProperties.load(['exif:exif', 'cm:content'])
            .subscribe({
                next: (data) => {
                    expect(data[0]).toEqual({ id: 'exif:1:id', name: 'exif:1', aspectName: 'exif:exif'});
                    expect(data[1]).toEqual({ id: 'exif:2:id', name: 'exif:2', aspectName: 'exif:exif'});
                    expect(data[2]).toEqual({ id: 'cm:content:id', name: 'cm:content', aspectName: 'cm:content'});
                },
                complete: done
            });
    });
});
