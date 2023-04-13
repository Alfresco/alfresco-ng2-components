/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { PropertyDescriptorsService } from './property-descriptors.service';
import { setupTestBed } from '@alfresco/adf-core';
import { ClassesApi } from '@alfresco/js-api';
import { PropertyGroup } from '../interfaces/content-metadata.interfaces';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('PropertyDescriptorLoaderService', () => {

    let service: PropertyDescriptorsService;
    let classesApi: ClassesApi;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(PropertyDescriptorsService);
        classesApi = service['classesApi'];
    });

    it('should load the groups passed by paramter', () => {
        spyOn(classesApi, 'getClass');

        service.load(['exif:exif', 'cm:content', 'custom:custom'])
            .subscribe(() => {});

        expect(classesApi.getClass).toHaveBeenCalledTimes(3);
        expect(classesApi.getClass).toHaveBeenCalledWith('exif_exif');
        expect(classesApi.getClass).toHaveBeenCalledWith('cm_content');
        expect(classesApi.getClass).toHaveBeenCalledWith('custom_custom');
    });

    it('should merge the forked values', (done) => {

        const exifResponse: PropertyGroup = {
            name: 'exif:exif',
            title: '',
            properties: {
                'exif:1': { title: 'exif:1:id', name: 'exif:1', dataType: '', mandatory: false, multiValued: false },
                'exif:2': { title: 'exif:2:id', name: 'exif:2', dataType: '', mandatory: false, multiValued: false }
            }
        };

        const contentResponse: PropertyGroup = {
            name: 'cm:content',
            title: '',
            properties: {
                'cm:content': { title: 'cm:content:id', name: 'cm:content', dataType: '', mandatory: false, multiValued: false }
            }
        };

        const apiResponses = [ exifResponse, contentResponse ];
        let counter = 0;

        spyOn(classesApi, 'getClass').and.callFake(() => Promise.resolve(apiResponses[counter++]));

        service.load(['exif:exif', 'cm:content'])
            .subscribe({
                next: (data) => {
                    expect(data['exif:exif']).toBe(exifResponse);
                    expect(data['cm:content']).toBe(contentResponse);
                },
                complete: done
            });
    });
});
