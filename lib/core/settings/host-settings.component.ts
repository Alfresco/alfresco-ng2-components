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

import { Component, EventEmitter, Output, ViewEncapsulation, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { LogService } from '../services/log.service';
import { SettingsService } from '../services/settings.service';
import { StorageService } from '../services/storage.service';
import { TranslationService } from '../services/translation.service';
import { UserPreferencesService } from '../services';

@Component({
    selector: 'adf-host-settings',
    templateUrl: 'host-settings.component.html',
    host: {
        'class': 'adf-host-settings'
    },
    styleUrls: ['host-settings.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HostSettingsComponent implements OnInit {

    HOST_REGEX: string = '^(http|https):\/\/.*[^/]$';

    ecmHostTmp: string;
    bpmHostTmp: string;
    providers = ['ALL', 'BPM', 'ECM'];
    providerSelected = 'BPM';
    form: FormGroup;

    /** Emitted when the URL is invalid. */
    @Output()
    error = new EventEmitter<string>();

    /** Emitted when the ecm host URL is changed. */
    @Output()
    ecmHostChange = new EventEmitter<string>();

    @Output()
    cancel = new EventEmitter<boolean>();

    @Output()
    success = new EventEmitter<boolean>();

    /** Emitted when the bpm host URL is changed. */
    @Output()
    bpmHostChange = new EventEmitter<string>();

    constructor(private settingsService: SettingsService,
                private userPreference: UserPreferencesService,
                private storage: StorageService,
                private logService: LogService,
                private fb: FormBuilder,
                private translationService: TranslationService) {
    }

    ngOnInit() {
        this.ecmHostTmp = this.storage.getItem('ecmHost') || this.settingsService.ecmHost;
        this.bpmHostTmp = this.storage.getItem('bpmHost') || this.settingsService.bpmHost;

        this.form = this.fb.group({
            sso: [this.userPreference.sso, Validators.required],
            providers: [this.userPreference.providers, Validators.required],
            urlFormControlEcm: [this.ecmHostTmp, [Validators.required, Validators.pattern(this.HOST_REGEX)]],
            urlFormControlBpm: [this.bpmHostTmp, [Validators.required, Validators.pattern(this.HOST_REGEX)]]
        });

        this.form.controls.providers.valueChanges.distinctUntilChanged().debounceTime(200).subscribe(provider => {
            if (!this.isProviderValid(provider)) {
                this.form.controls.providers.setErrors({'providerNotAllowed': true});
            }
        });
    }

    isProviderValid(provider: string): boolean {
        return provider === 'BPM' || provider === 'ECM' || provider === 'ALL';
    }

    public onChangeECMHost(event: any): void {
        let value = (<HTMLInputElement> event.target).value.trim();
        if (value && this.isValidUrl(value)) {
            this.logService.info(`ECM host: ${value}`);
            this.ecmHostTmp = value;
            this.ecmHostChange.emit(value);
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
            this.bpmHostChange.emit(value);
        } else {
            this.translationService.get('CORE.HOST_SETTING.PS_URL_ERROR').subscribe((message) => {
                this.error.emit(message);
            });
        }
    }

    onCancel() {
        this.cancel.emit(true);
    }

    onSubmit(values: any) {
        this.userPreference.sso = values.sso;
        this.userPreference.providers = values.providers;
        if (this.isBPM(values.providers)) {
            this.storage.setItem(`bpmHost`, values.urlFormControlBpm);
        } else if (this.isECM(values.providers)) {
            this.storage.setItem(`ecmHost`, values.urlFormControlEcm);
        } else {
            this.storage.setItem(`bpmHost`, values.urlFormControlBpm);
            this.storage.setItem(`ecmHost`, values.urlFormControlEcm);
        }
        this.success.emit(true);
    }

    isValidUrl(url: string) {
        return /^(http|https):\/\/.*/.test(url);
    }

    isBPM(value): boolean {
        return value === 'BPM';
    }

    isECM(value): boolean {
        return value === 'ECM';
    }

}
