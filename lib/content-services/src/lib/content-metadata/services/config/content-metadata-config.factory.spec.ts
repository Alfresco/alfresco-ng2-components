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
import { AppConfigService, LogService, setupTestBed } from '@alfresco/adf-core';
import { IndifferentConfigService } from './indifferent-config.service';
import { AspectOrientedConfigService } from './aspect-oriented-config.service';
import { LayoutOrientedConfigService } from './layout-oriented-config.service';
import { ContentMetadataConfigFactory } from './content-metadata-config.factory';
import { ContentMetadataConfig } from '../../interfaces/content-metadata.interfaces';
import { HttpClientModule } from '@angular/common/http';

describe('ContentMetadataConfigFactory', () => {

    let factory: ContentMetadataConfigFactory;
    let appConfig: AppConfigService;
    let config: ContentMetadataConfig;

    setupTestBed({
        imports: [
            HttpClientModule
        ],
        providers: [
            {
                provide: LogService, useValue: {
                    error: () => {}
                }
            }
        ]
    });

    beforeEach(() => {
        factory = TestBed.inject(ContentMetadataConfigFactory);
        appConfig = TestBed.inject(AppConfigService);
    });

    describe('get', () => {

        let logService: LogService;

        beforeEach(() => {
            logService = TestBed.inject(LogService);
            spyOn(logService, 'error').and.stub();
        });

        describe('get', () => {

            it('should get back to default preset if no preset is provided as parameter', () => {
                config = factory.get();

                expect(config).toEqual(jasmine.any(IndifferentConfigService));
            });

            it('should get back to default preset if no preset is set', () => {
                config = factory.get('default');

                expect(config).toEqual(jasmine.any(IndifferentConfigService));
                expect(logService.error).not.toHaveBeenCalled();
            });

            it('should get back to the default preset if the requested preset does not exist', () => {
                config = factory.get('not-existing-preset');

                expect(config).toEqual(jasmine.any(IndifferentConfigService));
            });

            it('should log an error message if the requested preset does not exist', () => {
                config = factory.get('not-existing-preset');

                expect(logService.error).toHaveBeenCalledWith('No content-metadata preset for: not-existing-preset');
            });
        });

        describe('set', () => {

            const setConfig = (presetName: string, presetConfig: any) => {
                appConfig.config['content-metadata'] = {
                    presets: {
                        [presetName]: presetConfig
                    }
                };
            };

            it('should get back the IndifferentConfigService preset if the preset config is indifferent', () => {
                setConfig('default', '*');

                config = factory.get('default');

                expect(config).toEqual(jasmine.any(IndifferentConfigService));
            });

            it('should get back the AspectOrientedConfigService preset if the preset config is aspect oriented', () => {
                setConfig('default', { 'exif:exif': '*' });

                config = factory.get('default');

                expect(config).toEqual(jasmine.any(AspectOrientedConfigService));
            });

            it('should get back the LayoutOrientedConfigService preset if the preset config is layout oriented', () => {
                setConfig('default', []);

                config = factory.get('default');

                expect(config).toEqual(jasmine.any(LayoutOrientedConfigService));
            });
        });
   });
});
