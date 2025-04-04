/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ExtensionManagerService } from './extension-manager.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { first } from 'rxjs/operators';
import { ExtensionCompositionEntry } from '../models/extension-composition-entry';
import { ExtensionComposition } from '../models/extension-composition';
import { CoreTestingModule } from '@alfresco/adf-core';

describe('ExtensionManagerService', () => {
    let extensionManagerService: ExtensionManagerService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule, HttpClientTestingModule]
        });
        extensionManagerService = TestBed.inject(ExtensionManagerService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should fetch saved plugin state for provided instance', () => {
        const getSpy = spyOn(extensionManagerService.settingsApi, 'getSavedExtensionState').and.returnValue(
            Promise.resolve(new ExtensionCompositionEntry())
        );
        const instanceId = 'test-instance-id';
        extensionManagerService.getSavedPluginState(instanceId);
        expect(getSpy).toHaveBeenCalledOnceWith('test-instance-id');
    });

    it('should fetch saved plugin state for provided instance', () => {
        const extensionComposition = new ExtensionComposition();
        const instanceId = 'test-instance-id';
        const putSpy = spyOn(extensionManagerService.settingsApi, 'publishExtensionConfig').and.returnValue(Promise.resolve());
        extensionManagerService.publishExtensionConfig(instanceId, extensionComposition);
        expect(putSpy).toHaveBeenCalledOnceWith('test-instance-id', extensionComposition);
    });

    it('should fetch extension info from pluginInfo.json', (done) => {
        extensionManagerService
            .getPluginInfo('test-adw-url')
            .pipe(first())
            .subscribe((data) => {
                expect(data).toEqual([]);
                done();
            });
        const req = httpTestingController.expectOne('test-adw-url/pluginInfo.json');
        expect(req.request.method).toEqual('GET');
        req.flush([]);
        httpTestingController.verify();
    });

    it('should fetch extension defaults from appConfig.json', (done) => {
        extensionManagerService
            .getDefaultPluginState('test-adw-url')
            .pipe(first())
            .subscribe((data) => {
                expect(data).toEqual({ plugins: {} });
                done();
            });
        const req = httpTestingController.expectOne('test-adw-url/app.config.json');
        expect(req.request.method).toEqual('GET');
        req.flush({ plugins: {} });
        httpTestingController.verify();
    });
});
