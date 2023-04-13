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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExtensionConfig } from '../config/extension.config';
import { ExtensionLoaderService } from './extension-loader.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('ExtensionLoaderService', () => {
    let extensionLoaderService: ExtensionLoaderService;
    let httpClient: HttpClient;
    let appExtensionsConfig: ExtensionConfig;
    const pluginConfig1: ExtensionConfig = {
        $id: 'test1',
        $name: 'test.extension.1',
        $version: '1.0.0',
        $vendor: 'Alfresco',
        $license: 'MIT',
        $runtime: '2.6.1'
    };
    const pluginConfig2: ExtensionConfig = {
        $id: 'test2',
        $name: 'test.extension.2',
        $version: '1.0.0',
        $vendor: 'Alfresco',
        $license: 'MIT',
        $runtime: '2.6.1'
    };
    const pluginConfig3: ExtensionConfig = {
        $id: 'test3',
        $name: 'test.extension.3',
        $version: '1.0.0',
        $vendor: 'Alfresco',
        $license: 'MIT',
        $runtime: '2.6.1'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HttpClient,
                ExtensionLoaderService
            ]
        });
        extensionLoaderService = TestBed.inject(ExtensionLoaderService);
        httpClient = TestBed.inject(HttpClient);

        appExtensionsConfig = {
            $id: 'test',
            $name: 'test.config',
            $version: '1.0.0',
            $vendor: 'Alfresco',
            $license: 'MIT',
            $runtime: '2.6.1',
            $references: [],
            $ignoreReferenceList: []
        };

        spyOn(httpClient, 'get').and.callFake((url: string) => {
            if (url === 'assets/app.extensions.json') {
                return of(appExtensionsConfig);
            }

            if (url === 'assets/plugins/test.extension.1.json') {
                return of(pluginConfig1);
            }

            if (url === 'assets/plugins/test.extension.2.json') {
                return of(pluginConfig2);
            }

            if (url === 'assets/plugins/test.extension.3.json') {
                return of(pluginConfig3);
            }

            return of(null);
        });
    });

    it('should load default registered app extensions when no custom $references defined', (done) => {
        extensionLoaderService.load('assets/app.extensions.json', 'assets/plugins', ['test.extension.1.json']).then((config: ExtensionConfig) => {
            const pluginsReference = config.$references.map((entry: ExtensionConfig) => entry.$name);
            expect(pluginsReference).toEqual(['test.extension.1']);
            done();
        });
    });

    it('should ignore default registered app extension if defined in $ignoreReferenceList', (done) => {
        appExtensionsConfig.$ignoreReferenceList = ['test.extension.1.json'];

        extensionLoaderService.load('assets/app.extensions.json', 'assets/plugins', ['test.extension.1.json']).then((config: ExtensionConfig) => {
            const pluginsReference = config.$references.map((entry: ExtensionConfig) => entry.$name);
            expect(pluginsReference).toEqual([]);
            done();
        });
    });

    it('should load only extensions defined by $references', (done) => {
        appExtensionsConfig.$references = ['test.extension.1.json'];

        extensionLoaderService.load('assets/app.extensions.json', 'assets/plugins', ['test.extension.2.json, test.extension.3.json']).then((config: ExtensionConfig) => {
            const pluginsReference = config.$references.map((entry: ExtensionConfig) => entry.$name);
            expect(pluginsReference).toEqual(['test.extension.1']);
            done();
        });
    });
});
