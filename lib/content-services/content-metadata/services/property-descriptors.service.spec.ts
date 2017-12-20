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
import { PropertyDescriptorLoaderService } from './properties-loader.service';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AspectsApi } from '../spike/aspects-api.service';
import { AspectWhiteListService } from './aspect-whitelist.service';
import { AppConfigService, LogService } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';

describe('PropertyDescriptorsService', () => {

    let contentMetadataService: PropertyDescriptorsService,
        aspectProperties: PropertyDescriptorLoaderService,
        appConfigService: AppConfigService,
        logService: LogService,
        node: MinimalNodeEntryEntity,
        testPresets: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                PropertyDescriptorsService,
                PropertyDescriptorLoaderService,
                AppConfigService,
                AspectWhiteListService,
                { provide: LogService, useValue: { error: () => {} }},
                AspectsApi
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        contentMetadataService = TestBed.get(PropertyDescriptorsService);
        aspectProperties = TestBed.get(PropertyDescriptorLoaderService);
        appConfigService = TestBed.get(AppConfigService);
        logService = TestBed.get(LogService);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    describe('getAspects', () => {

        beforeEach(() => {
            node = <MinimalNodeEntryEntity> { aspectNames: [ 'exif:exif', 'cm:content', 'custom:custom' ] };

            testPresets = {};
            appConfigService.config['content-metadata'] = {
                presets: testPresets
            };
        });

        it('should call the aspect properties loading for the default aspects related to the given node and defined in the app config', () => {
            spyOn(aspectProperties, 'load').and.callFake(x => Observable.of({}));
            testPresets.default = { 'exif:exif': [], 'custom:custom': [], 'banana:banana': [] };

            contentMetadataService.getAspects(node);

            expect(aspectProperties.load).toHaveBeenCalledWith(['exif:exif', 'custom:custom']);
        });

        it('should call the aspect properties loading for the defined aspects related to the given node and defined in the app config', () => {
            spyOn(aspectProperties, 'load').and.callFake(x => Observable.of({}));
            testPresets.pink = { 'cm:content': [], 'custom:custom': [] };

            contentMetadataService.getAspects(node, 'pink');

            expect(aspectProperties.load).toHaveBeenCalledWith(['cm:content', 'custom:custom']);
        });

        it('should call the aspect properties loading for all the node aspectNames if the "*" widecard is used for the preset', () => {
            spyOn(aspectProperties, 'load').and.callFake(x => Observable.of({}));
            testPresets.default = '*';

            contentMetadataService.getAspects(node);

            expect(aspectProperties.load).toHaveBeenCalledWith(['exif:exif', 'cm:content', 'custom:custom']);
        });

        it('should call the aspect properties loading for all the node aspectNames if there is no preset data defined in the app config', () => {
            spyOn(aspectProperties, 'load').and.callFake(x => Observable.of({}));
            spyOn(logService, 'error').and.stub();
            appConfigService.config['content-metadata'] = undefined;

            contentMetadataService.getAspects(node);

            expect(logService.error).not.toHaveBeenCalled();
            expect(aspectProperties.load).toHaveBeenCalledWith(['exif:exif', 'cm:content', 'custom:custom']);
        });

        it('should show meaningful error when invalid preset are given', () => {
            spyOn(aspectProperties, 'load').and.callFake(x => Observable.of({}));
            spyOn(logService, 'error').and.stub();
            testPresets.pink = { 'cm:content': {}, 'custom:custom': {} };

            contentMetadataService.getAspects(node, 'blue');

            expect(logService.error).toHaveBeenCalledWith('No content-metadata preset for: blue');
        });

        it('should filter out properties which are not defined in the particular aspect', () => {
            spyOn(aspectProperties, 'load').and.callFake(() => {
                return Observable.of([
                    { name: 'exif:1', aspectName: 'exif:exif', id: 'exif:1:id' },
                    { name: 'exif:2', aspectName: 'exif:exif', id: 'exif:2:id' }
                ]);
            });

            testPresets.default = { 'exif:exif': ['exif:2'] };

            contentMetadataService.getAspects(node).subscribe({
                next: (properties) => {
                    expect(properties['exif:2']).toEqual({ name: 'exif:2', aspectName: 'exif:exif', id: 'exif:2:id' });
                    expect(properties['exif:1']).toBeUndefined();
                }
            });
        });

        it('should accept "*" wildcard for aspect properties', () => {
            spyOn(aspectProperties, 'load').and.callFake(() => {
                return Observable.of([
                    { name: 'exif:1', aspectName: 'exif:exif', id: 'exif:1:id' },
                    { name: 'exif:2', aspectName: 'exif:exif', id: 'exif:2:id' },
                    { name: 'custom:1', aspectName: 'custom:custom', id: 'custom:1:id' },
                    { name: 'custom:2', aspectName: 'custom:custom', id: 'custom:2:id' }
                ]);
            });

            testPresets.default = {
                'exif:exif': '*',
                'custom:custom': ['custom:1']
            };

            contentMetadataService.getAspects(node).subscribe({
                next: (properties) => {
                    expect(properties['exif:1']).toEqual({ name: 'exif:1', aspectName: 'exif:exif', id: 'exif:1:id' });
                    expect(properties['exif:2']).toEqual({ name: 'exif:2', aspectName: 'exif:exif', id: 'exif:2:id' });
                    expect(properties['custom:1']).toEqual({ name: 'custom:1', aspectName: 'custom:custom', id: 'custom:1:id' });
                    expect(properties['custom:2']).toBeUndefined();
                }
            });
        });

        it('should filter out properties which are not defined amongst all aspects', () => {
            spyOn(aspectProperties, 'load').and.callFake(() => {
                return Observable.of([
                    { name: 'exif:1', aspectName: 'exif:exif', id: 'exif:1:id' },
                    { name: 'custom:1', aspectName: 'custom:custom', id: 'custom:1:id' }
                ]);
            });

            testPresets.default = {
                'exif:exif': ['exif:1'],
                'custom:custom': ['custom:1']
            };

            contentMetadataService.getAspects(node).subscribe({
                next: (properties) => {
                    expect(properties['exif:1']).toEqual({ name: 'exif:1', aspectName: 'exif:exif', id: 'exif:1:id' });
                    expect(properties['custom:1']).toEqual({ name: 'custom:1', aspectName: 'custom:custom', id: 'custom:1:id' });
                }
            });
        });

        it('should filter out aspects which are not present in app config preset', () => {
            spyOn(aspectProperties, 'load').and.callFake(() => {
                return Observable.of([
                    { name: 'exif:1', aspectName: 'exif:exif', id: 'exif:1:id' }
                ]);
            });

            testPresets.default = {
                'exif:exif': ['exif:1'],
                'banana:banana': ['banana:1']
            };

            contentMetadataService.getAspects(node).subscribe({
                next: (properties) => {
                    expect(properties['exif:1']).toEqual({ name: 'exif:1', aspectName: 'exif:exif', id: 'exif:1:id' });
                    expect(properties['banana:1']).toBeUndefined();
                }
            });
        });

    });
});
