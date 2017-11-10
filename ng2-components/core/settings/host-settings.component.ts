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

import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AlfrescoSettingsService } from '../services/alfresco-settings.service';
import { LogService } from '../services/log.service';
import { StorageService } from '../services/storage.service';
import { TranslationService } from '../services/translation.service';

@Component({
    selector: 'adf-host-settings',
    templateUrl: 'host-settings.component.html',
    host: {
        'class': 'adf-host-settings'
    },
    styleUrls: ['host-settings.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HostSettingsComponent {

    HOST_REGEX: string = '^(http|https):\/\/.*[^/]$';

    ecmHost: string;
    ecmHostTmp: string;
    bpmHost: string;
    bpmHostTmp: string;
    urlFormControlEcm = new FormControl('', [Validators.required, Validators.pattern(this.HOST_REGEX)]);
    urlFormControlBpm = new FormControl('', [Validators.required, Validators.pattern(this.HOST_REGEX)]);

    @Input()
    providers: string = 'ALL';

    @Output()
    error = new EventEmitter<string>();

    constructor(private settingsService: AlfrescoSettingsService,
                private storage: StorageService,
                private logService: LogService,
                private translationService: TranslationService) {
        this.ecmHostTmp = this.ecmHost = storage.getItem('ecmHost') || this.settingsService.ecmHost;
        this.bpmHostTmp = this.bpmHost = storage.getItem('bpmHost') || this.settingsService.bpmHost;
    }

    public onChangeECMHost(event: any): void {
        let value = (<HTMLInputElement> event.target).value.trim();
        if (value && this.isValidUrl(value)) {
            this.logService.info(`ECM host: ${value}`);
            this.ecmHostTmp = value;
        } else {
            this.translationService.get('CORE.HOST_SETTING.CS_URL_ERROR').subscribe((message) => {
                this.error.emit(message);
            });
        }
    }

    public onChangeBPMHost(event: any): void {
        let value = (<HTMLInputElement> event.target).value.trim();
        if (value && this.isValidUrl(value)) {
            this.logService.info(`BPM host: ${value}`);
            this.bpmHostTmp = value;
        } else {
            this.translationService.get('CORE.HOST_SETTING.PS_URL_ERROR').subscribe((message) => {
                this.error.emit(message);
            });
        }
    }

    public save(event: KeyboardEvent): void {
        if (this.bpmHost !== this.bpmHostTmp) {
            this.storage.setItem(`bpmHost`, this.bpmHostTmp);
        }
        if (this.ecmHost !== this.ecmHostTmp) {
            this.storage.setItem(`ecmHost`, this.ecmHostTmp);
        }
        window.location.href = '/';
    }

    isValidUrl(url: string) {
        return /^(http|https):\/\/.*/.test(url);
    }

}
