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

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CloudLayoutService {

    private settings = {
        multiselect: false,
        testingMode: false,
        taskDetailsRedirection: true,
        selectionMode: 'single'
    };

    private filterTaskSubject: BehaviorSubject<any> = new BehaviorSubject({index: 0});
    private filterTask$: Observable<any>;
    private filterProcessSubject: BehaviorSubject<any> = new BehaviorSubject({index: 0});
    private filterProcess$: Observable<any>;
    private settingsSubject: BehaviorSubject<any> = new BehaviorSubject(this.settings);
    private settings$: Observable<any>;

    constructor() {
        this.filterTask$ = this.filterTaskSubject.asObservable();
        this.filterProcess$ = this.filterProcessSubject.asObservable();
        this.settings$ = this.settingsSubject.asObservable();
    }

    getCurrentTaskFilterParam() {
        return this.filterTask$;
    }

    setCurrentTaskFilterParam(param) {
        this.filterTaskSubject.next(param);
    }

    getCurrentProcessFilterParam() {
        return this.filterProcess$;
    }

    setCurrentProcessFilterParam(param) {
        this.filterProcessSubject.next(param);
    }

    getCurrentSettings() {
        return this.settings$;
    }

    setCurrentSettings(param) {
        this.settingsSubject.next(param);
    }
}
