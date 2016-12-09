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

import { Component } from '@angular/core';
import { AlfrescoSettingsService, StorageService } from 'ng2-alfresco-core';

@Component({
    selector: 'alfresco-setting-demo',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.css']
})
export class SettingComponent {

    ecmHost: string;
    bpmHost: string;

    constructor(public alfrescoSettingsService: AlfrescoSettingsService,
                private storage: StorageService) {
        this.ecmHost = this.alfrescoSettingsService.ecmHost;
        this.bpmHost = this.alfrescoSettingsService.bpmHost;
    }

    public onChangeECMHost(event: KeyboardEvent): void {
        console.log((<HTMLInputElement>event.target).value);
        this.ecmHost = (<HTMLInputElement>event.target).value;
        this.alfrescoSettingsService.ecmHost = this.ecmHost;
        this.storage.setItem(`ecmHost`, this.ecmHost);
    }

    public onChangeBPMHost(event: KeyboardEvent): void {
        console.log((<HTMLInputElement>event.target).value);
        this.bpmHost = (<HTMLInputElement>event.target).value;
        this.alfrescoSettingsService.bpmHost = this.bpmHost;
        this.storage.setItem(`bpmHost`, this.bpmHost);
    }

}
