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

import { ReflectiveInjector } from '@angular/core';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    AlfrescoApiService,
    StorageService,
    LogService
} from 'ng2-alfresco-core';
import { RatingService } from '../services/rating.service';

declare let jasmine: any;

describe('Rating service', () => {

    let service, injector;

    beforeEach(() => {
        injector = ReflectiveInjector.resolveAndCreate([
            AlfrescoSettingsService,
            AlfrescoApiService,
            AlfrescoAuthenticationService,
            RatingService,
            StorageService,
            LogService
        ]);
    });

    beforeEach(() => {
        service = injector.get(RatingService);
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('Should get rating return an Observable', (done) => {
        let ratingType: string = 'fiveStar';
        let nodeId: string = 'fake-node-id';

        service.getRating(nodeId, ratingType).subscribe((data) => {
            expect(data.entry.myRating).toBe('1');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: {
                'entry': {
                    myRating: 1,
                    'ratedAt': '2017-04-06T14:34:28.061+0000',
                    'id': 'fiveStar',
                    'aggregate': {'numberOfRatings': 1, 'average': 1.0}
                }
            }
        });
    });

    it('Should post rating return an Observable', (done) => {
        let ratingType: string = 'fiveStar';
        let nodeId: string = 'fake-node-id';

        service.postRating(nodeId, ratingType, 3).subscribe((data) => {
            expect(data.entry.myRating).toBe('3');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: {
                'entry': {
                    'myRating': 3,
                    'ratedAt': '2017-04-06T14:36:40.731+0000',
                    'id': 'fiveStar',
                    'aggregate': {'numberOfRatings': 1, 'average': 3.0}
                }
            }
        });
    });
});
