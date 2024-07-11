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

import { TestBed } from '@angular/core/testing';
import { ActionService } from './action.service';
import { take } from 'rxjs/operators';

describe('ActionService', () => {
    let service: ActionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ActionService);
    });

    it('should dispatch and filter actions by type', (done) => {
        const testAction = { type: 'testAction' };
        service
            .ofType('testAction')
            .pipe(take(1))
            .subscribe((action) => {
                expect(action).toEqual(testAction);
                done();
            });
        service.dispatch(testAction);
    });

    it('should not emit actions of a different type', () => {
        const testAction = { type: 'testAction' };
        const otherAction = { type: 'otherAction' };
        let emitted = false;

        service.ofType(testAction.type).subscribe(() => {
            emitted = true;
        });

        service.dispatch(otherAction);
        expect(emitted).toBeFalse();
    });

    it('should handle dispatching null actions gracefully', () => {
        expect(() => service.dispatch(null)).not.toThrow();
    });

    it('should initially emit a startup action', (done) => {
        service.actions$.pipe(take(1)).subscribe((action) => {
            expect(action.type).toBe('startup');
            done();
        });
    });
});
