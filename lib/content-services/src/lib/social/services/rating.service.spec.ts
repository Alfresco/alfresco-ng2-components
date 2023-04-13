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
import { setupTestBed } from '@alfresco/adf-core';
import { RatingService } from './rating.service';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ratingOneMock, ratingThreeMock } from '../mock/rating-response.mock';

declare let jasmine: any;

describe('Rating service', () => {

    let service;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(RatingService);
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('Should get rating return an Observable', (done) => {
        const ratingType: string = 'fiveStar';
        const nodeId: string = 'fake-node-id';

        service.getRating(nodeId, ratingType).subscribe((data) => {
            expect(data.entry.myRating).toBe('1');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: ratingOneMock
        });
    });

    it('Should post rating return an Observable', (done) => {
        const ratingType: string = 'fiveStar';
        const nodeId: string = 'fake-node-id';

        service.postRating(nodeId, ratingType, 3).subscribe((data) => {
            expect(data.entry.myRating).toBe('3');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: ratingThreeMock
        });
    });
});
