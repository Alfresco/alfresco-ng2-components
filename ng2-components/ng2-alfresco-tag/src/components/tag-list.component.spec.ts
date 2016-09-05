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


import { describe, inject, beforeEachProviders, beforeEach, afterEach } from '@angular/core/testing';
import { AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { TagService } from '../services/tag.service';

declare let jasmine: any;

describe('Tag list', () => {

    let  service;

    beforeEachProviders(() => {

        return [
            AlfrescoSettingsService,
            AlfrescoAuthenticationService,
            TagService
        ];
    });

    beforeEach(inject([TagService], (tagService: TagService) => {
        service = tagService;
    }));

    describe('Content tests', () => {

        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

    });
});
