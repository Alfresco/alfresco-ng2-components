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

import { Component, OnInit } from '@angular/core';
import { CloudLayoutService } from './services/cloud-layout.service';

@Component({
    selector: 'app-cloud-settings',
    templateUrl: './cloud-settings.component.html',
    styleUrls: ['./cloud-settings.component.scss']
})
export class CloudSettingsComponent implements OnInit {

    multiselect: boolean;
    selectionMode: string;
    testingMode: boolean;
    taskDetailsRedirection: boolean;

    selectionModeOptions = [
        { value: '', title: 'None' },
        { value: 'single', title: 'Single' },
        { value: 'multiple', title: 'Multiple' }
    ];

    constructor(private cloudLayoutService: CloudLayoutService) { }

    ngOnInit() {
        this.cloudLayoutService.getCurrentSettings()
            .subscribe((settings) => this.setCurrentSettings(settings));
    }

    setCurrentSettings(settings) {
        if (settings) {
            this.multiselect = settings.multiselect;
            this.testingMode = settings.testingMode;
            this.selectionMode = settings.selectionMode;
            this.taskDetailsRedirection = settings.taskDetailsRedirection;
        }
    }

    toggleMultiselect() {
        this.multiselect = !this.multiselect;
        this.setSetting();
    }

    toggleTestingMode() {
        this.testingMode = !this.testingMode;
        this.setSetting();
    }

    toggleTaskDetailsRedirection() {
        this.taskDetailsRedirection = !this.taskDetailsRedirection;
        this.setSetting();
    }

    onSelectionModeChange() {
        this.setSetting();
    }

    setSetting() {
        this.cloudLayoutService.setCurrentSettings({
            multiselect: this.multiselect,
            testingMode: this.testingMode,
            selectionMode: this.selectionMode,
            taskDetailsRedirection: this.taskDetailsRedirection
        });
    }
}
