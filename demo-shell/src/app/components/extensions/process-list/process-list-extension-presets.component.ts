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

import {
    AppExtensionService,
    ProcessListPresetRef
} from "@alfresco/adf-extensions";
import { ProcessFilterCloudModel } from "@alfresco/adf-process-services-cloud";
import { Component, OnInit } from "@angular/core";

@Component({
    selector: "process-list-extension-preset",
    templateUrl: "./process-list-extension-presets.component.html",
    styleUrls: ["./process-list-extension-presets.component.scss"]
})
export class ProcessListExtensionPresetsComponent implements OnInit {
    columns: ProcessListPresetRef[] = [];
    isSmallScreen = false;

    editedFilter = new ProcessFilterCloudModel({
        name: "ADF_CLOUD_PROCESS_FILTERS.RUNNING_PROCESSES",
        icon: "inbox",
        key: "running-processes",
        appName: "simpleapp",
        sort: "startDate",
        status: "RUNNING",
        order: "DESC"
    });

    constructor(private extensions: AppExtensionService) {}

    ngOnInit() {
        this.columns = this.extensions.processesColumnPreset();
        console.log(this.columns, 's');
    }

    trackById(_: number, obj: ProcessListPresetRef): string {
        return obj.id;
    }
}
