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

import { AppConfigService, CoreModule } from '@alfresco/adf-core';
import { TagService } from './tag.service';
import { AlfrescoApiService, LogService, AppConfigService, StorageService } from '@alfresco/adf-core';

declare let jasmine: any;

describe('TagService', () => {

    let service: TagService;

    beforeEach(() => {
        service = new TagService(new AlfrescoApiService(new AppConfigService(null), new StorageService()), new LogService(new AppConfigService(null)));
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('Content tests', () => {

        it('getTagsByNodeId catch errors call', (done) => {
            service.getTagsByNodeId('fake-node-id').subscribe(() => {
            }, () => {
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        });

        it('delete tag should trigger a refresh event', (done) => {
            service.refresh.subscribe(() => {
                done();
            });

            service.removeTag('fake-node-id', 'fake-tag');

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
        });

        it('add tag should trigger a refresh event', (done) => {
            service.refresh.subscribe(() => {
                done();
            });

            service.addTag('fake-node-id', 'fake-tag');

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
        });
    });

});
