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
import { setupTestBed } from '../testing/setupTestBed';
import { PreviousRouteService } from './previous-route.service';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { CoreTestingModule } from 'core/testing/core.testing.module';

class MockRouter {
    firstUrl = new NavigationEnd(0, '/files', '/files');
    events = new Observable((observer) => {
        observer.next(this.firstUrl);
        observer.complete();
    });
}

describe('Previous route service ', () => {

    let previousRouteService: PreviousRouteService;

    setupTestBed({
        imports: [CoreTestingModule],
        providers: [
            { provide: Router, useClass: MockRouter },
            PreviousRouteService
        ]
    });

    beforeEach(() => {
        previousRouteService = TestBed.get(PreviousRouteService);
    });

    it('should be able to create the service', () => {
        expect(previousRouteService).not.toBeNull();
        expect(previousRouteService).toBeDefined();
    });

    it('should set curent url when new page loads', () => {
        expect(previousRouteService.getPreviousUrl()).toBe('/files');
    });
});
