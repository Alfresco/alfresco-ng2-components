/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { BpmProductVersionModel, EcmProductVersionModel } from '../models/product-version.model';
import { AppConfigService } from '../app-config/app-config.service';
import { DiscoveryApiService } from './discovery-api.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';

declare let jasmine: any;

const fakeEcmDiscoveryResponse: any = {
    'entry': {
        'repository': {
            'edition': 'FAKE',
            'version': {
                'major': '5',
                'minor': '2',
                'patch': '0',
                'hotfix': '0',
                'schema': 999999,
                'label': 'r134899-b26',
                'display': '5.2.0.0 (r134899-b26) schema 10005'
            },
            'license': {
                'issuedAt': '2017-06-22T10:56:45.796+0000',
                'expiresAt': '2017-07-22T00:00:00.000+0000',
                'remainingDays': 4,
                'holder': 'Trial User',
                'mode': 'ENTERPRISE',
                'entitlements': {
                    'isClusterEnabled': false,
                    'isCryptodocEnabled': false
                }
            },
            'status': {
                'isReadOnly': false,
                'isAuditEnabled': true,
                'isQuickShareEnabled': true,
                'isThumbnailGenerationEnabled': true
            },
            'modules': [
                {
                    'id': 'alfresco-fake-services',
                    'title': 'Alfresco Share Services AMP',
                    'description': 'Module to be applied to alfresco.war, containing APIs for Alfresco Share',
                    'version': '5.2.0',
                    'installDate': '2017-03-07T08:48:14.161+0000',
                    'installState': 'INSTALLED',
                    'versionMin': '5.1',
                    'versionMax': '999'
                },
                {
                    'id': 'alfresco-trashcan-fake',
                    'title': 'alfresco-trashcan-cleaner project',
                    'description': 'The Alfresco Trash Can Cleaner (Alfresco Module)',
                    'version': '2.2',
                    'installState': 'UNKNOWN',
                    'versionMin': '0',
                    'versionMax': '999'
                }
            ]
        }
    }
};

const fakeBPMDiscoveryResponse: any = {
        'revisionVersion': '2',
        'edition': 'SUPER FAKE EDITION',
        'type': 'bpmSuite',
        'majorVersion': '1',
        'minorVersion': '6'
    };

describe('Discovery Api Service', () => {

    let service;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        const appConfig: AppConfigService = TestBed.get(AppConfigService);
        appConfig.config = {
            ecmHost: 'http://localhost:9876/ecm'
        };
        service = TestBed.get(DiscoveryApiService);
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('For ECM', () => {
        it('Should retrieve the info about the product for ECM', (done) => {
            service.getEcmProductInfo().subscribe((data: EcmProductVersionModel) => {
                expect(data).not.toBeNull();
                expect(data.edition).toBe('FAKE');
                expect(data.version.schema).toBe(999999);
                expect(data.license.isClusterEnabled).toBeFalsy();
                expect(data.status.isQuickShareEnabled).toBeTruthy();
                expect(data.modules.length).toBe(2);
                expect(data.modules[0].id).toBe('alfresco-fake-services');
                expect(data.modules[1].id).toBe('alfresco-trashcan-fake');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakeEcmDiscoveryResponse
            });
        });

        it('getEcmProductInfo catch errors call', (done) => {
            service.getEcmProductInfo().subscribe(
                () => {
                },
                () => {
                    done();
                });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        });
    });

    describe('For BPM', () => {
        it('Should retrieve the info about the product for BPM', (done) => {
            service.getBpmProductInfo().subscribe((data: BpmProductVersionModel) => {
                expect(data).not.toBeNull();
                expect(data.edition).toBe('SUPER FAKE EDITION');
                expect(data.revisionVersion).toBe('2');
                expect(data.type).toBe('bpmSuite');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakeBPMDiscoveryResponse
            });
        });

        it('getBpmProductInfo catch errors call', (done) => {
            service.getBpmProductInfo().subscribe(
                () => {
                },
                () => {
                    done();
                });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        });
    });

});
