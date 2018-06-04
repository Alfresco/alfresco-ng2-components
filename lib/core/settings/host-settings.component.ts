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
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
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

    providersValues = ['ALL', 'BPM', 'ECM', 'OAUTH'];
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

    constructor(private fb: FormBuilder,
                private userPreference: UserPreferencesService) {
    }

    ngOnInit() {

        let providerValue = this.userPreference.providers;
        const oAuthConfig = this.userPreference.oauthConfig;

        const oauthGroup = this.fb.group( {
            host: [oAuthConfig.host, [Validators.required, Validators.pattern(this.HOST_REGEX)]],
            clientId: [oAuthConfig.clientId, Validators.required],
            redirectUri: [oAuthConfig.redirectUri, Validators.required],
            scope: [oAuthConfig.scope, Validators.required],
            secretId: oAuthConfig.secret,
            requireHttps: oAuthConfig.requireHttps,
            implicitFlow: oAuthConfig.implicitFlow
        });

        this.form = this.fb.group({
            providers: [providerValue, Validators.required],
            ecmHost: [this.userPreference.ecmHost, [Validators.required, Validators.pattern(this.HOST_REGEX)]],
            oauthConfig: oauthGroup,
            bpmHost: [this.userPreference.bpmHost, [Validators.required, Validators.pattern(this.HOST_REGEX)]]
        });
    }

    onCancel() {
        this.cancel.emit(true);
    }

    onSubmit(values: any) {
        this.userPreference.providers = values.providers;
        if (this.isBPM()) {
            this.saveBPMValues(values);
        } else if (this.isECM()) {
            this.saveECMValues(values);
        } else if (this.isALL()) {
            this.saveECMValues(values);
            this.saveBPMValues(values);
        } else if (this.isOAUTH()) {
            this.saveOAuthValues(values);
        }
        this.success.emit(true);
    }

    saveOAuthValues(values: any) {
        this.userPreference.oauthConfig = values.oauthConfig;
        this.userPreference.bpmHost = values.bpmHost;
    }

    saveBPMValues(values: any) {
        this.userPreference.bpmHost = values.bpmHost;
    }

    saveECMValues(values: any) {
        this.userPreference.ecmHost = values.ecmHost;
    }

    isBPM(): boolean {
        return this.providers.value === 'BPM';
    }

    isECM(): boolean {
        return this.providers.value === 'ECM';
    }

    isALL(): boolean {
        return this.providers.value === 'ALL';
    }

    isOAUTH(): boolean {
        return this.providers.value === 'OAUTH';
    }

    get providers(): AbstractControl {
        return this.form.get('providers');
    }

    get bpmHost(): AbstractControl {
        return this.form.get('bpmHost');
    }

    get ecmHost(): AbstractControl {
        return this.form.get('ecmHost');
    }

    get host(): AbstractControl {
        return this.oauthConfig.get('host');
    }

    get clientId(): AbstractControl {
        return this.oauthConfig.get('clientId');
    }

    get scope(): AbstractControl {
        return this.oauthConfig.get('scope');
    }

    get secretId(): AbstractControl {
        return this.oauthConfig.get('secretId');
    }

    get implicitFlow(): AbstractControl {
        return this.oauthConfig.get('implicitFlow');
    }

    get requireHttps(): AbstractControl {
        return this.oauthConfig.get('requireHttps');
    }

    get redirectUri(): AbstractControl {
        return this.oauthConfig.get('redirectUri');
    }

    get oauthConfig(): AbstractControl {
        return this.form.get('oauthConfig');
    }

}
