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
import { PropertyDescriptorsLoaderService } from './property-descriptors-loader.service';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';
import { ClassesApi } from 'alfresco-js-api';

describe('PropertyDescriptorLoaderService', () => {

    let propertyDescriptorsLoaderService: PropertyDescriptorsLoaderService,
        classesApi: ClassesApi;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                PropertyDescriptorsLoaderService,
                AlfrescoApiService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        propertyDescriptorsLoaderService = TestBed.get(PropertyDescriptorsLoaderService);
        const alfrescoApiService = TestBed.get(AlfrescoApiService);
        classesApi = alfrescoApiService.classesApi;
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should load the groups passed by paramter', () => {
        spyOn(classesApi, 'getClass');

        propertyDescriptorsLoaderService.load(['exif:exif', 'cm:content', 'custom:custom'])
            .subscribe(() => {});

        expect(classesApi.getClass).toHaveBeenCalledTimes(3);
        expect(classesApi.getClass).toHaveBeenCalledWith('exif_exif');
        expect(classesApi.getClass).toHaveBeenCalledWith('cm_content');
        expect(classesApi.getClass).toHaveBeenCalledWith('custom_custom');
    });

    it('should merge the forked values', (done) => {

        const exifResponse = {
            name: 'exif:exif',
            id: 1,
            properties: {
                'exif:1': { id: 'exif:1:id', name: 'exif:1' },
                'exif:2': { id: 'exif:2:id', name: 'exif:2' }
            }
        };

        const contentResponse = {
            name: 'cm:content',
            id: 2,
            properties: {
                'cm:content': { id: 'cm:content:id', name: 'cm:content' }
            }
        };

        const apiResponses = [ exifResponse, contentResponse ];
        let counter = 0;

        spyOn(classesApi, 'getClass').and.callFake(() => {
            return Observable.of(apiResponses[counter++]);
        });

        propertyDescriptorsLoaderService.load(['exif:exif', 'cm:content'])
            .subscribe({
                next: (data) => {
                    expect(data[0]).toBe(exifResponse);
                    expect(data[1]).toBe(contentResponse);
                },
                complete: done
            });
    });
});
