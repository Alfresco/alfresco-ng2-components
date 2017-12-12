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
import { ContentMetadataService } from './content-metadata.service';
import { AspectPropertiesService } from './aspect-properties.service';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AspectsApi } from '../spike/aspects-api.service';
import { AppConfigService } from '@alfresco/adf-core';

describe('ContentMetadataService', () => {

    let contentMetadataService: ContentMetadataService,
        aspectProperties: AspectPropertiesService,
        appConfigService: AppConfigService,
        node: MinimalNodeEntryEntity,
        testPresets: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                ContentMetadataService,
                AspectPropertiesService,
                AspectsApi
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        contentMetadataService = TestBed.get(ContentMetadataService);
        aspectProperties = TestBed.get(AspectPropertiesService);
        appConfigService = TestBed.get(AppConfigService);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    fdescribe('getAspects', () => {

        beforeEach(() => {
            node = <MinimalNodeEntryEntity> { aspectNames: [ 'exif:exif', 'cm:content', 'custom:custom' ] };

            testPresets = {};
            appConfigService.config['content-metadata'] = {
                presets: testPresets
            };
        });

        it('should call the aspect properties loading for the default aspects related to the given node and defined in the app config', () => {
            spyOn(aspectProperties, 'load');
            testPresets.default = { 'exif:exif': {}, 'custom:custom': {} };

            contentMetadataService.getAspects(node);

            expect(aspectProperties.load).toHaveBeenCalledWith(['exif:exif', 'custom:custom']);
        });

        it('should call the aspect properties loading for the defined aspects related to the given node and defined in the app config', () => {
            spyOn(aspectProperties, 'load');
            testPresets.pink = { 'cm:content': {}, 'custom:custom': {} };

            contentMetadataService.getAspects(node, 'pink');

            expect(aspectProperties.load).toHaveBeenCalledWith(['cm:content', 'custom:custom']);
        });

        it('should throw meaningful error when invalid preset are given', () => {
            spyOn(aspectProperties, 'load');
            testPresets.pink = { 'cm:content': {}, 'custom:custom': {} };

            function sut() {
                contentMetadataService.getAspects(node, 'blue');
            }

            expect(sut).toThrowError('No content-metadata preset for: blue');
        });

    });

});
