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

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Action {
    type: string;
    payload?: any;
}

@Injectable({ providedIn: 'root' })
export class ActionService {
    private actions = new BehaviorSubject<Action>({ type: 'startup' });

    actions$ = this.actions.asObservable();

    ofType(type: string): Observable<Action> {
        return this.actions$.pipe(filter((action) => action.type === type));
    }

    dispatch(action: Action): void {
        if (action) {
            this.actions.next(action);
        }
    }
}
