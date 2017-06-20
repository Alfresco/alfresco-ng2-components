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

import { Component, AfterViewChecked } from '@angular/core';
import { AlfrescoSettingsService, StorageService, LogService } from 'ng2-alfresco-core';

declare var componentHandler: any;

@Component({
    selector: 'app-settings',
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.css']
})
export class SettingsComponent implements AfterViewChecked {

    ecmHost: string;
    bpmHost: string;

    constructor(private settingsService: AlfrescoSettingsService,
                private storage: StorageService,
                private logService: LogService) {
        this.ecmHost = storage.getItem('ecmHost') || this.settingsService.ecmHost;
        this.bpmHost = storage.getItem('bpmHost') || this.settingsService.bpmHost;
    }

    ngAfterViewChecked() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

    public onChangeECMHost(event: KeyboardEvent): void {
        let value = (<HTMLInputElement>event.target).value.trim();
        if (value && this.isValidUrl(value)) {
            this.logService.info(`ECM host: ${value}`);
            this.ecmHost = value;
            this.storage.setItem(`ecmHost`, value);
        } else {
            console.error('Ecm address does not match the pattern');
        }
    }

    public onChangeBPMHost(event: KeyboardEvent): void {
        let value = (<HTMLInputElement>event.target).value.trim();
        if (value && this.isValidUrl(value)) {
            this.logService.info(`BPM host: ${value}`);
            this.bpmHost = value;
            this.storage.setItem(`bpmHost`, value);
        } else {
            console.error('Bpm address does not match the pattern');
        }
    }

    isValidUrl(url: string) {
        return /^(http|https):\/\/.*/.test(url);
    }

}
