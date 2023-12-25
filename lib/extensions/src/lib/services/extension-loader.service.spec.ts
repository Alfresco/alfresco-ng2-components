/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExtensionConfig } from '../config/extension.config';
import { ExtensionLoaderService } from './extension-loader.service';

describe('ExtensionLoaderService', () => {
    let extensionLoaderService: ExtensionLoaderService;
    let httpMock: HttpTestingController;
    let appExtensionsConfig: ExtensionConfig;
    const pluginConfig1: ExtensionConfig = {
        $id: 'test1',
        $name: 'test.extension.1',
        $version: '1.0.0',
        $vendor: 'Alfresco',
        $license: 'MIT',
        $runtime: '2.6.1'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                ExtensionLoaderService
            ]
        });
        extensionLoaderService = TestBed.inject(ExtensionLoaderService);
        httpMock = TestBed.inject(HttpTestingController);

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
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should load default registered app extensions when no custom $references defined', fakeAsync(() => {
        extensionLoaderService.load('assets/app.extensions.json', 'assets/plugins', ['test.extension.1.json']).then((config: ExtensionConfig) => {
            const pluginsReference = config.$references.map((entry: ExtensionConfig) => entry.$name);
            expect(pluginsReference).toEqual(['test.extension.1']);
        });
        httpMock.expectOne('assets/app.extensions.json').flush(appExtensionsConfig);
        tick();
        httpMock.expectOne('assets/plugins/test.extension.1.json').flush(pluginConfig1);
        flushMicrotasks();
    }));

    it('should ignore default registered app extension if defined in $ignoreReferenceList', (done) => {
        appExtensionsConfig.$ignoreReferenceList = ['test.extension.1.json'];

        extensionLoaderService.load('assets/app.extensions.json', 'assets/plugins', ['test.extension.1.json']).then((config: ExtensionConfig) => {
            const pluginsReference = config.$references.map((entry: ExtensionConfig) => entry.$name);
            expect(pluginsReference).toEqual([]);
            done();
        });

        httpMock.expectOne('assets/app.extensions.json').flush(appExtensionsConfig);
    });

    it('should load only extensions defined by $references', fakeAsync(() => {
        appExtensionsConfig.$references = ['test.extension.1.json'];

        extensionLoaderService.load('assets/app.extensions.json', 'assets/plugins', ['test.extension.2.json, test.extension.3.json']).then((config: ExtensionConfig) => {
            const pluginsReference = config.$references.map((entry: ExtensionConfig) => entry.$name);
            expect(pluginsReference).toEqual(['test.extension.1']);
        });

        httpMock.expectOne('assets/app.extensions.json').flush(appExtensionsConfig);
        tick();
        httpMock.expectOne('assets/plugins/test.extension.1.json').flush(pluginConfig1);
        httpMock.expectNone('assets/plugins/test.extension.2.json');
        httpMock.expectNone('assets/plugins/test.extension.3.json');
        flushMicrotasks();
    }));

    it('should load extensions from passed extension value',fakeAsync(() => {
        appExtensionsConfig.$references = ['test.extension.1.json'];

        extensionLoaderService.load(
            'assets/app.extensions.json',
            'assets/plugins',
            undefined,
            [{
                $id: 'extension-value-id',
                $license: 'license',
                $name: 'name',
                $version:'version',
                $vendor: 'vendor'
            }]).then((config: ExtensionConfig) => {
                const hasExtensionValue = config.$references.some((entry: ExtensionConfig) => entry.$id === 'extension-value-id');
                expect(hasExtensionValue).toBe(true);
            });
        httpMock.expectOne('assets/app.extensions.json').flush(appExtensionsConfig);
        tick();
        httpMock.expectOne('assets/plugins/test.extension.1.json').flush(pluginConfig1);
        flushMicrotasks();
    }));

    it('should load extensions if only extension value was passed', fakeAsync(() => {
        extensionLoaderService.load(
            'assets/app.extensions.json',
            'assets/plugins',
            undefined,
            [{
                $id: 'extension-value-id',
                $license: 'license',
                $name: 'name',
                $version:'version',
                $vendor: 'vendor'
            }]).then((config: ExtensionConfig) => {
                const hasExtensionValue = config.$references.some((entry: ExtensionConfig) => entry.$id === 'extension-value-id');
                expect(hasExtensionValue).toBe(true);
            });
        httpMock.expectOne('assets/app.extensions.json').flush(appExtensionsConfig);
        tick();
        flushMicrotasks();
    }));

    it('should load extensions with multiple extension values', fakeAsync(() => {
        appExtensionsConfig.$references = ['test.extension.1.json'];

        extensionLoaderService.load(
            'assets/app.extensions.json',
            'assets/plugins',
            undefined,
            [{
                $id: 'extension-value-id-1',
                $license: 'license',
                $name: 'name',
                $version:'version',
                $vendor: 'vendor'
            },{
                $id: 'extension-value-id-2',
                $license: 'license',
                $name: 'name',
                $version:'version',
                $vendor: 'vendor'
            }]).then((config: ExtensionConfig) => {
                const hasFirstExtensionValue = config.$references.some((entry: ExtensionConfig) => entry.$id === 'extension-value-id-1');
                expect(hasFirstExtensionValue).toBe(true);
                const hasSecondExtensionValue = config.$references.some((entry: ExtensionConfig) => entry.$id === 'extension-value-id-2');
                expect(hasSecondExtensionValue).toBe(true);
            });
        httpMock.expectOne('assets/app.extensions.json').flush(appExtensionsConfig);
        tick();
        httpMock.expectOne('assets/plugins/test.extension.1.json').flush(pluginConfig1);
        flushMicrotasks();
    }));
});
