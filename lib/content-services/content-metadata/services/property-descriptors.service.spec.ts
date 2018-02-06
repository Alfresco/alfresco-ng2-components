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
import { PropertyDescriptorsService } from './property-descriptors.service';
import { PropertyDescriptorsLoaderService } from './property-descriptors-loader.service';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';
import { Property, ContentMetadataConfig } from '../interfaces/content-metadata.interfaces';
import { IndifferentConfigService } from './config/indifferent-config.service';
import { AspectOrientedConfigService } from './config/aspect-oriented-config.service';

describe('PropertyDescriptorsService', () => {

    let propertyDescriptorsService: PropertyDescriptorsService,
        propertyDescriptorsLoaderService: PropertyDescriptorsLoaderService,
        groupNames: string[],
        config: ContentMetadataConfig;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                PropertyDescriptorsService,
                PropertyDescriptorsLoaderService,
                AlfrescoApiService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        propertyDescriptorsService = TestBed.get(PropertyDescriptorsService);
        propertyDescriptorsLoaderService = TestBed.get(PropertyDescriptorsLoaderService);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    describe('loadDescriptors', () => {

        beforeEach(() => {
            groupNames = [ 'exif:exif', 'cm:content', 'custom:custom' ];
        });

        it('should load the groups of the intersection of AspectOrientedConfigService\'s groups and groupNames', () => {
            spyOn(propertyDescriptorsLoaderService, 'load').and.callFake(x => Observable.of({}));
            config = new AspectOrientedConfigService({ 'exif:exif': [], 'custom:custom': [], 'banana:banana': [] });

            propertyDescriptorsService.loadDescriptors(groupNames, config);

            expect(propertyDescriptorsLoaderService.load).toHaveBeenCalledWith(['exif:exif', 'custom:custom']);
        });

        it('should load everything from groupNames if IndifferentConfigService config is passed', () => {
            spyOn(propertyDescriptorsLoaderService, 'load').and.callFake(x => Observable.of({}));
            config = new IndifferentConfigService('*');

            propertyDescriptorsService.loadDescriptors(groupNames, config);

            expect(propertyDescriptorsLoaderService.load).toHaveBeenCalledWith(['exif:exif', 'cm:content', 'custom:custom']);
        });

        // TODO: move it to the right place
        it('should filter out properties which are not defined in the particular group', (done) => {
            spyOn(propertyDescriptorsLoaderService, 'load').and.callFake(() => {
                return Observable.of([
                    {
                        name: 'exif:exif',
                        properties: [
                            { name: 'exif:1' },
                            { name: 'exif:2' }
                        ]
                    }
                ]);
            });

            config = new AspectOrientedConfigService({ 'exif:exif': ['exif:2'] });

            propertyDescriptorsService.loadDescriptors(groupNames, config).subscribe({
                next: (aspects) => {
                    expect(aspects[0].name).toBe('exif:exif');
                    expect(aspects[0].properties).toContain(<Property> { name: 'exif:2' });
                    expect(aspects[0].properties).not.toContain(<Property> { name: 'exif:1' });
                },
                complete: done
            });
        });

        // TODO: move it to the right place
        it('should accept "*" wildcard for group properties', (done) => {
            spyOn(propertyDescriptorsLoaderService, 'load').and.callFake(() => {
                return Observable.of([
                    {
                        name: 'exif:exif',
                        properties: [
                            { name: 'exif:1' },
                            { name: 'exif:2' }
                        ]
                    },
                    {
                        name: 'custom:custom',
                        properties: [
                            { name: 'custom:1' },
                            { name: 'custom:2' }
                        ]
                    }
                ]);
            });

            config = new AspectOrientedConfigService({
                'exif:exif': '*',
                'custom:custom': ['custom:1']
            });

            propertyDescriptorsService.loadDescriptors(groupNames, config).subscribe({
                next: (aspects) => {
                    expect(aspects.length).toBe(2);
                    expect(aspects[0].name).toBe('exif:exif');
                    expect(aspects[0].properties).toContain(<Property> { name: 'exif:1' });
                    expect(aspects[0].properties).toContain(<Property> { name: 'exif:2' });

                    expect(aspects[1].name).toBe('custom:custom');
                    expect(aspects[1].properties).toContain(<Property> { name: 'custom:1' });
                    expect(aspects[1].properties).not.toContain(<Property> { name: 'custom:2' });
                },
                complete: done
            });
        });

        // TODO: move it to the right place
        it('should filter out groups which are not present in app config preset', () => {
            spyOn(propertyDescriptorsLoaderService, 'load').and.callFake(() => {
                return Observable.of([
                    {
                        name: 'exif:exif',
                        properties: [
                            { name: 'exif:1' }
                        ]
                    }
                ]);
            });

            config = new AspectOrientedConfigService({
                'exif:exif': ['exif:1'],
                'banana:banana': ['banana:1']
            });

            propertyDescriptorsService.loadDescriptors(groupNames, config).subscribe({
                next: (aspects) => {
                    expect(aspects.length).toBe(1);
                    expect(aspects[0].name).toBe('exif:exif');
                    expect(aspects[0].properties).toContain(<Property> { name: 'exif:1' });
                }
            });
        });
    });
});
