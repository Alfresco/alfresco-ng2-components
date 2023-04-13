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

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CloudServiceSettings {
    multiselect: boolean;
    actionMenu: boolean;
    contextMenu: boolean;
    testingMode: boolean;
    taskDetailsRedirection: boolean;
    processDetailsRedirection: boolean;
    selectionMode: string;
    actions: any[];
}

export interface FilterSettings {
    id?: string;
    index?: number;
    key?: string;
}

export class ActionMenuModel {
    constructor(
        public key: string,
        public icon: string,
        public title: string,
        public visible?: boolean,
        public disabled?: boolean
      ) {  }

}

@Injectable({
    providedIn: 'root'
})
export class CloudLayoutService {

    private settings: CloudServiceSettings = {
        multiselect: false,
        actionMenu: false,
        contextMenu: false,
        testingMode: false,
        taskDetailsRedirection: true,
        processDetailsRedirection: true,
        selectionMode: 'single',
        actions: []
    };

    taskFilter$ = new BehaviorSubject<FilterSettings>({index: 0});
    processFilter$ = new BehaviorSubject<FilterSettings>({index: 0});
    settings$ = new BehaviorSubject<CloudServiceSettings>(this.settings);

    setCurrentTaskFilterParam(param: FilterSettings) {
        this.taskFilter$.next(param);
    }

    setCurrentProcessFilterParam(param: FilterSettings) {
        this.processFilter$.next(param);
    }

    setCurrentSettings(param: CloudServiceSettings) {
        this.settings$.next(param);
    }
}
